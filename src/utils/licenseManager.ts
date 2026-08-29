import { TenantSchool } from '../types';

export interface LicenseStatusResult {
  status: 'actif' | 'grace_period' | 'expired_suspended' | 'manual_suspended' | 'en_attente';
  isSuspended: boolean; // True if manual suspended or expired beyond 7-day grace period
  isGracePeriod: boolean; // True if expired within the 7-day grace window
  isTrial: boolean;
  daysRemaining: number; // Positive if active, negative if expired
  graceDaysRemaining: number; // 0 to 7
  expirationDateString: string;
  warningLevel: 'none' | 'info' | 'warning' | 'critical' | 'locked';
  warningTitle: string;
  warningMessage: string;
  badgeLabel: string;
  badgeColorClass: string;
}

const GRACE_PERIOD_DAYS = 7; // 1 week grace period after expiration

/**
 * Calculates real-time license and subscription status with 7-day grace period and 30-day warning
 */
export function calculateLicenseStatus(tenant?: TenantSchool | null): LicenseStatusResult {
  if (!tenant) {
    return {
      status: 'actif',
      isSuspended: false,
      isGracePeriod: false,
      isTrial: false,
      daysRemaining: 365,
      graceDaysRemaining: 0,
      expirationDateString: '',
      warningLevel: 'none',
      warningTitle: '',
      warningMessage: '',
      badgeLabel: 'Actif',
      badgeColorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    };
  }

  // 1. Check explicit manual status
  if (tenant.status === 'suspendu') {
    return {
      status: 'manual_suspended',
      isSuspended: true,
      isGracePeriod: false,
      isTrial: Boolean(tenant.isTrial),
      daysRemaining: 0,
      graceDaysRemaining: 0,
      expirationDateString: tenant.licenseExpiresAt || tenant.trialExpiresAt || '',
      warningLevel: 'locked',
      warningTitle: '⛔ Établissement Suspendu — Mode Lecture Seule Actif',
      warningMessage: 'Cet établissement a été suspendu par l\'administration technique. Tous les modules sont en lecture seule. Pour débloquer immédiatement vos accès, effectuez le paiement de votre abonnement ou saisissez un code d\'activation.',
      badgeLabel: 'Suspendu (Lecture Seule)',
      badgeColorClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
    };
  }

  if (tenant.status === 'en_attente') {
    return {
      status: 'en_attente',
      isSuspended: true,
      isGracePeriod: false,
      isTrial: false,
      daysRemaining: 0,
      graceDaysRemaining: 0,
      expirationDateString: '',
      warningLevel: 'locked',
      warningTitle: '⏳ Établissement en Attente d\'Activation',
      warningMessage: 'Votre instance est en attente d\'activation de licence. Veuillez régler votre abonnement ou saisir un code pour démarrer.',
      badgeLabel: 'En Attente',
      badgeColorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    };
  }

  const isTrial = Boolean(tenant.isTrial || tenant.plan === 'Essai 14 Jours');
  const targetExpiryDate = isTrial && tenant.trialExpiresAt ? tenant.trialExpiresAt : tenant.licenseExpiresAt;

  // If no date set, assume active trial for 14 days
  if (!targetExpiryDate) {
    return {
      status: 'actif',
      isSuspended: false,
      isGracePeriod: false,
      isTrial,
      daysRemaining: 14,
      graceDaysRemaining: 0,
      expirationDateString: '',
      warningLevel: 'none',
      warningTitle: '',
      warningMessage: '',
      badgeLabel: 'Actif',
      badgeColorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    };
  }

  const expiryTimestamp = new Date(targetExpiryDate).getTime();
  const now = Date.now();
  const diffMs = expiryTimestamp - now;
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Date formatée pour affichage
  const formattedDate = new Date(targetExpiryDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // CASE A: Expired (daysRemaining <= 0)
  if (daysRemaining <= 0) {
    const daysPastExpiry = Math.abs(daysRemaining);
    const graceDaysRemaining = Math.max(0, GRACE_PERIOD_DAYS - daysPastExpiry);

    if (graceDaysRemaining > 0) {
      // Sub-case: IN 7-DAY GRACE PERIOD
      return {
        status: 'grace_period',
        isSuspended: false, // Access still granted during grace period with strong warning
        isGracePeriod: true,
        isTrial,
        daysRemaining,
        graceDaysRemaining,
        expirationDateString: formattedDate,
        warningLevel: 'critical',
        warningTitle: `⚠️ Période de Grâce Active : ${graceDaysRemaining} jour${graceDaysRemaining > 1 ? 's' : ''} restant${graceDaysRemaining > 1 ? 's' : ''}`,
        warningMessage: `Votre ${isTrial ? 'période d\'essai' : 'licence officielle'} a expiré le ${formattedDate}. Une semaine de grâce vous est accordée pour finaliser le réabonnement sans interruption. Passé ce délai, les modules passeront en lecture seule.`,
        badgeLabel: `Grâce (${graceDaysRemaining}j restants)`,
        badgeColorClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
      };
    } else {
      // Sub-case: GRACE PERIOD EXPIRED -> SUSPENDED IN READ-ONLY
      return {
        status: 'expired_suspended',
        isSuspended: true, // Now locked in read-only
        isGracePeriod: false,
        isTrial,
        daysRemaining,
        graceDaysRemaining: 0,
        expirationDateString: formattedDate,
        warningLevel: 'locked',
        warningTitle: '⛔ Licence Expirée — Établissement Bloqué en Lecture Seule',
        warningMessage: `Votre licence a expiré le ${formattedDate} et le délai de grâce d'une semaine est désormais forclos. L'accès à tous les formulaires d'écriture, d'inscription et de modification est suspendu. Activez votre abonnement pour débloquer immédiatement.`,
        badgeLabel: 'Expiré (Suspendu)',
        badgeColorClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
      };
    }
  }

  // CASE B: Less than 30 days before expiration (< 30 jours)
  if (daysRemaining <= 30) {
    const isVeryUrgent = daysRemaining <= 7;
    return {
      status: 'actif',
      isSuspended: false,
      isGracePeriod: false,
      isTrial,
      daysRemaining,
      graceDaysRemaining: 0,
      expirationDateString: formattedDate,
      warningLevel: isVeryUrgent ? 'warning' : 'info',
      warningTitle: `⏳ Avis d'Échéance : Licence expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} (le ${formattedDate})`,
      warningMessage: `La licence EDU-CONGO de votre établissement expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}. Anticipez le renouvellement pour éviter tout blocage ou passage en période de grâce.`,
      badgeLabel: `Expire dans ${daysRemaining}j`,
      badgeColorClass: isVeryUrgent 
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    };
  }

  // CASE C: Active and healthy (> 30 days)
  return {
    status: 'actif',
    isSuspended: false,
    isGracePeriod: false,
    isTrial,
    daysRemaining,
    graceDaysRemaining: 0,
    expirationDateString: formattedDate,
    warningLevel: 'none',
    warningTitle: '',
    warningMessage: '',
    badgeLabel: `Actif (${daysRemaining}j)`,
    badgeColorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  };
}
