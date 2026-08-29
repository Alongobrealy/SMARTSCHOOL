// Utility for generating and verifying school-specific unique activation codes

export interface ActivationPlanDefinition {
  id: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
  name: 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
  durationMonths: number;
  durationLabel: string;
  monthlyRateFCFA: number;
  discountPercent: number;
  totalAmountFCFA: number;
  codePrefix: string;
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<'mensuel' | 'trimestriel' | 'semestriel' | 'annuel', ActivationPlanDefinition> = {
  mensuel: {
    id: 'mensuel',
    name: 'Mensuel',
    durationMonths: 1,
    durationLabel: '1 Mois',
    monthlyRateFCFA: 25000,
    discountPercent: 0,
    totalAmountFCFA: 25000,
    codePrefix: 'M1',
    description: 'Sans engagement • Facturation mensuelle'
  },
  trimestriel: {
    id: 'trimestriel',
    name: 'Trimestriel',
    durationMonths: 3,
    durationLabel: '3 Mois (1 Trimestre)',
    monthlyRateFCFA: 22500,
    discountPercent: 10,
    totalAmountFCFA: 67500, // 25 000 * 3 * 0.90
    codePrefix: 'T3',
    description: 'Remise 10% • Idéal pour 1 trimestre scolaire'
  },
  semestriel: {
    id: 'semestriel',
    name: 'Semestriel',
    durationMonths: 6,
    durationLabel: '6 Mois (1 Semestre)',
    monthlyRateFCFA: 21250,
    discountPercent: 15,
    totalAmountFCFA: 127500, // 25 000 * 6 * 0.85
    codePrefix: 'S6',
    description: 'Remise 15% • 6 mois de gestion académique'
  },
  annuel: {
    id: 'annuel',
    name: 'Annuel',
    durationMonths: 12,
    durationLabel: '12 Mois (Année Scolaire Complète)',
    monthlyRateFCFA: 18750,
    discountPercent: 25,
    totalAmountFCFA: 225000, // 25 000 * 12 * 0.75 (soit 3 mois offerts)
    codePrefix: 'A12',
    description: '🔥 Recommandé • Remise 25% (3 Mois Offerts)'
  }
};

export interface GeneratedActivationCode {
  code: string;
  schoolId: string;
  schoolCode: string;
  schoolName: string;
  planId: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
  planName: 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
  durationMonths: number;
  amountFCFA: number;
  generatedAt: string;
  expiresAtCalculated: string;
  isUsed: boolean;
  usedAt?: string;
}

/**
 * Creates a deterministic, non-trivial hash from string inputs
 */
function simpleChecksum(input: string, length = 4): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const positive = Math.abs(hash);
  const hex = positive.toString(36).toUpperCase().padStart(length, 'X');
  return hex.slice(-length);
}

/**
 * Normalizes a school key identifier
 */
function normalizeSchoolKey(schoolId: string, schoolCode?: string, schoolName?: string): string {
  const code = (schoolCode || '').trim().toUpperCase();
  const id = (schoolId || '').trim().toLowerCase();
  const name = (schoolName || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${id}_${code}_${name.slice(0, 8)}`;
}

/**
 * Generates an activation code strictly tied to a specific school
 * Format: EDU-[PREFIX]-[SCHOOL_HASH]-[PLAN_CHECKSUM]-[SALT]
 * Example: EDU-A12-EC26-89AF-7B32
 */
export function generateActivationCode(
  school: { id: string; code?: string; name: string },
  planId: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'
): GeneratedActivationCode {
  const plan = SUBSCRIPTION_PLANS[planId];
  const schoolKey = normalizeSchoolKey(school.id, school.code, school.name);
  
  // 1. School specific hash chunk
  const schoolHash = simpleChecksum(`SCH_KEY_${schoolKey}`, 4);
  
  // 2. Plan specific verification chunk
  const planHash = simpleChecksum(`PLAN_${plan.id}_${schoolKey}`, 4);
  
  // 3. Security verification salt
  const salt = simpleChecksum(`SALT_EDU_CONGO_2026_${schoolKey}_${plan.codePrefix}`, 4);
  
  const code = `EDU-${plan.codePrefix}-${schoolHash}-${planHash}-${salt}`.toUpperCase();

  // Calculate new target expiration date from today
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + plan.durationMonths);
  const expiresAtCalculated = targetDate.toISOString().split('T')[0];

  return {
    code,
    schoolId: school.id,
    schoolCode: school.code || 'EC-2026',
    schoolName: school.name,
    planId: plan.id,
    planName: plan.name,
    durationMonths: plan.durationMonths,
    amountFCFA: plan.totalAmountFCFA,
    generatedAt: new Date().toISOString(),
    expiresAtCalculated,
    isUsed: false
  };
}

export interface VerificationResult {
  isValid: boolean;
  planId?: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
  planName?: 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
  durationMonths?: number;
  amountFCFA?: number;
  calculatedNewExpirationDate?: string;
  errorMessage?: string;
}

/**
 * Verifies if an activation code is valid and belongs specifically to the target school
 */
export function verifyActivationCodeForSchool(
  inputCode: string,
  targetSchool: { id: string; code?: string; name: string }
): VerificationResult {
  const cleanCode = (inputCode || '').trim().toUpperCase();
  
  if (!cleanCode) {
    return { isValid: false, errorMessage: 'Veuillez saisir un code d\'activation.' };
  }

  // Code pattern check
  const parts = cleanCode.split('-');
  if (parts.length !== 5 || parts[0] !== 'EDU') {
    return {
      isValid: false,
      errorMessage: 'Format de code invalide. Le format officiel est EDU-[FORMULE]-[CODE1]-[CODE2]-[CODE3] (ex: EDU-A12-XXXX-YYYY-ZZZZ).'
    };
  }

  const prefix = parts[1]; // M1, T3, S6, A12
  const schoolHashInput = parts[2];
  const planHashInput = parts[3];
  const saltInput = parts[4];

  // Find plan by prefix
  const planEntry = Object.values(SUBSCRIPTION_PLANS).find(p => p.codePrefix === prefix);
  if (!planEntry) {
    return {
      isValid: false,
      errorMessage: 'Formule d\'abonnement inconnue dans le code saisi.'
    };
  }

  const schoolKey = normalizeSchoolKey(targetSchool.id, targetSchool.code, targetSchool.name);
  const expectedSchoolHash = simpleChecksum(`SCH_KEY_${schoolKey}`, 4);
  const expectedPlanHash = simpleChecksum(`PLAN_${planEntry.id}_${schoolKey}`, 4);
  const expectedSalt = simpleChecksum(`SALT_EDU_CONGO_2026_${schoolKey}_${planEntry.codePrefix}`, 4);

  // Check if code was generated for THIS school
  if (schoolHashInput !== expectedSchoolHash || planHashInput !== expectedPlanHash || saltInput !== expectedSalt) {
    return {
      isValid: false,
      errorMessage: `Ce code d'activation est invalide ou a été généré pour un autre établissement. Chaque code est strictement unique et réservé à son école destinataire.`
    };
  }

  // Calculate new target expiration date
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + planEntry.durationMonths);
  const calculatedNewExpirationDate = targetDate.toISOString().split('T')[0];

  return {
    isValid: true,
    planId: planEntry.id,
    planName: planEntry.name,
    durationMonths: planEntry.durationMonths,
    amountFCFA: planEntry.totalAmountFCFA,
    calculatedNewExpirationDate
  };
}
