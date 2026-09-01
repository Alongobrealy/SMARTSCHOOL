import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Printer, 
  Send, 
  Building2, 
  Calendar, 
  Users, 
  CreditCard, 
  Clock, 
  Key, 
  ExternalLink,
  MessageCircle,
  FileCheck,
  School,
  Sparkles,
  Phone,
  Mail,
  AlertTriangle,
  Globe,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { SubscriptionRequest } from '../../types';
import { generateSchoolCode, generateTemporaryPassword, normalizePhone } from '../../utils/validation';
import confetti from 'canvas-confetti';

interface SubscriptionApprovalModalProps {
  request: SubscriptionRequest | null;
  onClose: () => void;
  onApprove: (updatedRequest: SubscriptionRequest) => void;
  onLaunchSchoolWorkspace: (schoolName: string) => void;
}

export const SubscriptionApprovalModal: React.FC<SubscriptionApprovalModalProps> = ({
  request,
  onClose,
  onApprove,
  onLaunchSchoolWorkspace
}) => {
  if (!request) return null;

  const isAlreadyApproved = request.status === 'validee';
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [approvedState, setApprovedState] = useState<SubscriptionRequest | null>(
    isAlreadyApproved ? request : null
  );
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);
  const [copiedCredentialsMessage, setCopiedCredentialsMessage] = useState<boolean>(false);
  const [credentialsWhatsAppUrl, setCredentialsWhatsAppUrl] = useState<string>('');
  const [credentialsWhatsAppMessage, setCredentialsWhatsAppMessage] = useState<string>('');
  const [adminPin, setAdminPin] = useState<string>('');

  const currentActiveData = approvedState || request;
  const subdomainLink = currentActiveData.subdomainUrl || `https://${currentActiveData.subdomain || 'mon-ecole'}.educongo.ai.studio`;

  const buildSchoolCredentialsMessage = (target: SubscriptionRequest) => {
    const isTrial = target.isTrial || target.planId === 'essai_14j';
    const planName = isTrial 
      ? "ESSAI GRATUIT 14 JOURS (Accès 100% Illimité)" 
      : (target.planTitle || target.selectedPlan || 'Annuel (12 mois)');
    const amountStr = isTrial ? "0 FCFA (Offre d'évaluation 14 jours)" : `${(target.totalAmountFCFA || target.totalCostFCFA || 0).toLocaleString()} FCFA`;
    const duration = isTrial ? "14 Jours" : `${target.durationMonths || 12} mois`;
    const phone = target.contactPhone || target.directorPhone || '+242 06 895 83 77';
    const email = target.contactEmail || 'admin@ecole.cg';
    const contactPerson = target.contactName || target.directorName || 'Administrateur Scolaire';
    const contactFunc = target.contactFunction || 'Directeur Général';
    const schoolDisplayName = target.schoolName || 'Établissement';
    const locCity = target.city || 'Brazzaville';
    const locDept = target.department || 'Brazzaville';
    const agrement = target.agrementNumber || 'AGR-EDU-CG-2026-8941';
    const code = target.schoolCode || 'EC-BZV-2026-4921';
    const pass = target.tempPassword || 'Congo@2026#XP8821';
    const portalUrl = target.subdomainUrl || `https://${target.subdomain || 'mon-ecole'}.educongo.ai.studio`;

    const trialNotice = isTrial 
      ? `\n🎁 *PÉRIODE D'ESSAI 14 JOURS :*\nVous bénéficiez d'un accès sans restriction à 100% des modules pendant 14 jours. Au terme de cette période, vous pourrez choisir votre abonnement officiel (Mensuel, Trimestriel ou Annuel) directement depuis votre espace administrateur.\n`
      : '';

    return `🏛️ *CONFIRMATION & ACTIVATION OFFICIELLE EDU-CONGO*
----------------------------------------
Félicitations ! L'inscription de votre établissement a été officiellement VALIDÉE et ACTIVÉE par la direction générale EDU-CONGO.

🏫 *Établissement :* ${schoolDisplayName.toUpperCase()}
📍 *Localisation :* ${locCity} (${locDept})
👤 *Administrateur :* ${contactPerson} (${contactFunc})
📋 *N° Agrément Officiel :* ${agrement}
📦 *Formule Activée :* ${planName} (${duration})
💰 *Montant :* ${amountStr}
${trialNotice}
----------------------------------------
🔑 *VOS IDENTIFIANTS OFFICIELS D'ACCÈS :*
• *Code Établissement Unique :* ${code}
• *Identifiant Administrateur :* ${email}
• *Mot de passe provisoire :* ${pass}
• *Lien de votre portail fonctionnel :* ${portalUrl}

----------------------------------------
👉 *Instructions de première connexion :*
1. Cliquez sur le lien de votre sous-domaine ci-dessus
2. Renseignez votre identifiant et votre mot de passe provisoire
3. Vous accédez immédiatement à votre tableau de bord avec tous les modules actifs (Élèves, Enseignants, Frais FCFA/MoMo, Notes, Bulletins, Emplois du temps).

Pour toute assistance dédiée (Gratuit 7j/7) :
WhatsApp EDU-CONGO : +242 06 895 83 77 | Email : steph.alongo@gmail.com`;
  };

  const dispatchWhatsAppToSchool = (target: SubscriptionRequest) => {
    const rawPhone = target.contactPhone || target.directorPhone || '';
    let cleanDigits = rawPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.startsWith('0')) {
      cleanDigits = `242${cleanDigits.slice(1)}`;
    } else if (!cleanDigits.startsWith('242')) {
      cleanDigits = `242${cleanDigits}`;
    }

    const whatsAppMessage = buildSchoolCredentialsMessage(target);
    const encoded = encodeURIComponent(whatsAppMessage);
    const apiWhatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanDigits}&text=${encoded}`;
    
    setCredentialsWhatsAppMessage(whatsAppMessage);
    setCredentialsWhatsAppUrl(apiWhatsAppUrl);

    try {
      window.open(apiWhatsAppUrl, '_blank');
    } catch {
      // Handled in UI
    }
  };

  const handleConfirmActivation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const agrementNumber = request.agrementNumber || `AGR-EDU-CG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const schoolCode = request.schoolCode || generateSchoolCode(request.department?.slice(0, 3).toUpperCase() || 'BZV');
      const tempPassword = request.tempPassword || generateTemporaryPassword();
      const adminAccessCode = request.adminAccessCode || `EDU-ADM-${Math.floor(100000 + Math.random() * 900000)}`;
      const approvedAt = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const updated: SubscriptionRequest = {
        ...request,
        status: 'validee',
        agrementNumber,
        schoolCode,
        tempPassword,
        adminAccessCode,
        approvedAt
      };

      setApprovedState(updated);
      onApprove(updated);
      setIsProcessing(false);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Auto-dispatch WhatsApp to school
      dispatchWhatsAppToSchool(updated);
    }, 600);
  };

  const handleCopyCredentialsMessage = () => {
    const msg = credentialsWhatsAppMessage || buildSchoolCredentialsMessage(currentActiveData);
    navigator.clipboard.writeText(msg);
    setCopiedCredentialsMessage(true);
    setTimeout(() => setCopiedCredentialsMessage(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900  text-slate-800 dark:text-slate-100  w-full max-w-3xl rounded-lg border border-slate-200 dark:border-slate-700  shadow-2xl overflow-hidden flex flex-col my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Top Header */}
        <div className="bg-blue-600 text-white px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-600 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
              EC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  EDU-CONGO • Validation d'Inscription
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${
                  currentActiveData.status === 'validee'
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-400 text-slate-950 animate-pulse'
                }`}>
                  {currentActiveData.status === 'validee' ? 'ACTIVÉ & CERTIFIÉ' : 'EN ATTENTE DE VALIDATION'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Centre de Validation & Dispatch WhatsApp d'Établissement
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* Status Alert Banner */}
          {currentActiveData.status === 'validee' ? (
            <div className="bg-blue-50  border-2 border-slate-200 dark:border-slate-700  rounded-lg p-4 flex items-start gap-3 text-blue-600  shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-blue-600  shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-extrabold text-sm text-blue-600 ">
                  INSCRIPTION VALIDÉE & ACCÈS TRANSMIS SUR LE WHATSAPP DE L'ÉCOLE !
                </h4>
                <p className="text-xs text-blue-600  mt-0.5">
                  L'établissement <strong>{currentActiveData.schoolName}</strong> a été activé. Les identifiants uniques, mot de passe provisoire et lien du sous-domaine sont opérationnels.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50  border-2 border-amber-300  rounded-lg p-4 flex items-start gap-3 text-amber-900  shadow-xs">
              <AlertTriangle className="w-6 h-6 text-amber-600  shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-amber-950 ">
                  DEMANDE REÇUE DU WHATSAPP DE L'ÉTABLISSEMENT
                </h4>
                <p className="text-xs text-amber-800  mt-0.5">
                  Cliquez sur <strong>« Valider et Envoyer les Accès sur WhatsApp »</strong> pour générer le code unique, le mot de passe provisoire et envoyer la notification directe au responsable.
                </p>
              </div>
            </div>
          )}

          {/* Identification & Credentials Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700  rounded-lg p-5 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600 " />
              Identifiants & Données d'Activation Générés
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Code Unique Établissement */}
              <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700 ">
                <span className="text-[10px] text-slate-500 dark:text-slate-400  block font-semibold">
                  Code Établissement Unique :
                </span>
                <div className="flex items-center justify-between mt-1">
                  <strong className="font-mono text-sm text-blue-600 ">
                    {currentActiveData.schoolCode || 'EC-BZV-2026-4921'}
                  </strong>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentActiveData.schoolCode || 'EC-BZV-2026-4921');
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Mot de Passe Provisoire */}
              <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700 ">
                <span className="text-[10px] text-slate-500 dark:text-slate-400  block font-semibold">
                  Mot de Passe Provisoire :
                </span>
                <div className="flex items-center justify-between mt-1">
                  <strong className="font-mono text-xs text-rose-600  bg-rose-50  px-1.5 py-0.5 rounded">
                    {currentActiveData.tempPassword || 'Congo@2026#XP8821'}
                  </strong>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentActiveData.tempPassword || 'Congo@2026#XP8821');
                      setCopiedPass(true);
                      setTimeout(() => setCopiedPass(false), 2000);
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    {copiedPass ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Sous-domaine */}
              <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700  sm:col-span-2 md:col-span-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400  block font-semibold">
                  Sous-Domaine Dédié :
                </span>
                <strong className="font-mono text-xs text-blue-600  block mt-1 truncate">
                  {subdomainLink}
                </strong>
              </div>
            </div>
          </div>

          {/* School Details Grid */}
          <div className="bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700  rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400  font-semibold uppercase text-[10px] tracking-wider block">
                Établissement Scolaire / Centre de Formation :
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100  text-sm sm:text-base mt-0.5 flex items-center gap-1.5">
                <School className="w-4 h-4 text-blue-600  shrink-0" />
                {currentActiveData.schoolName || 'Nouvel Établissement'}
              </p>
              <span className="text-slate-500 dark:text-slate-400  text-xs mt-1 block">
                📍 {currentActiveData.city || 'Brazzaville'} ({currentActiveData.commune || 'Centre'}) • Département de {currentActiveData.department || 'Brazzaville'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400  font-semibold uppercase text-[10px] tracking-wider block">
                Administrateur / Responsable Inscrit :
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100  text-sm mt-0.5">
                {currentActiveData.contactName || 'Administrateur Scolaire'} ({currentActiveData.contactFunction || 'Directeur Général'})
              </p>
              <div className="mt-1 flex flex-col gap-0.5 text-slate-500 dark:text-slate-400  text-xs">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-blue-600 " /> WhatsApp : {currentActiveData.contactPhone || '+242 06 895 83 77'}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-600 " /> {currentActiveData.contactEmail || 'steph.alongo@gmail.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Financial Breakdown */}
          <div className="border border-slate-200 dark:border-slate-700  rounded-lg overflow-hidden">
            <div className="bg-blue-600  text-white p-3.5 flex items-center justify-between font-bold border-b border-slate-200 dark:border-slate-700 ">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Détails du Forfait d'Abonnement
              </span>
              <span className="bg-blue-600  text-blue-600 px-2.5 py-0.5 rounded-lg text-[11px]">
                {currentActiveData.planTitle || currentActiveData.selectedPlan || 'Annuel'} ({currentActiveData.durationMonths || 12} mois)
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900  divide-y divide-slate-100  flex flex-col gap-2.5">
              <div className="flex justify-between py-1 text-slate-800 dark:text-slate-100 ">
                <span>Effectif couvert :</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 ">~{currentActiveData.studentCount || 500} Élèves / Étudiants</span>
              </div>
              <div className="flex justify-between py-1 text-slate-800 dark:text-slate-100 ">
                <span>Options incluses :</span>
                <span className="font-semibold text-blue-600 ">
                  {currentActiveData.options && currentActiveData.options.length > 0
                    ? currentActiveData.options.join(' • ')
                    : 'Formation gratuite sur site • Support 24/7 dédié • Passerelles MoMo/Airtel'}
                </span>
              </div>
              {(currentActiveData.discountPercentage || 0) > 0 && (
                <div className="flex justify-between py-1 text-blue-600  font-semibold">
                  <span>Remise accordée :</span>
                  <span>-{currentActiveData.discountPercentage}% sur l'engagement</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-extrabold text-slate-800 dark:text-slate-100 ">
                <span>MONTANT TOTAL FACTURÉ :</span>
                <span className="text-blue-600  text-lg">
                  {(currentActiveData.totalAmountFCFA || currentActiveData.totalCostFCFA || 0).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Official Certificate Preview (Printable) */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700  bg-blue-50/40  rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700  pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600 " />
                <span className="font-bold text-blue-600  text-xs uppercase tracking-wider">
                  Attestation d'Agrément Officiel EDU-CONGO
                </span>
              </div>
              <span className="text-[10px] text-blue-600  font-mono font-semibold">
                Réf : {currentActiveData.id}
              </span>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-100  leading-relaxed">
              La direction générale d'<strong>EDU-CONGO</strong> certifie que l'établissement <strong className="text-slate-800 dark:text-slate-100 ">{currentActiveData.schoolName}</strong> (Sous-domaine : <span className="font-mono text-blue-600">{subdomainLink}</span>) est officiellement validé et activé avec tous ses modules intégrés.
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 dark:text-slate-400 ">
              <span>Date d'Agrément : <strong>{currentActiveData.approvedAt || 'En cours de validation'}</strong></span>
              <span>N° Agrément : <strong>{currentActiveData.agrementNumber || 'AGR-EDU-CG-2026-8941'}</strong></span>
            </div>
          </div>

          {/* Quick Copy Credentials Toolbar */}
          {currentActiveData.status === 'validee' && (
            <div className="bg-blue-50/80  border border-slate-200 dark:border-slate-700  rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-blue-600 ">
                <CheckCircle2 className="w-5 h-5 text-blue-600  shrink-0" />
                <span>Références d'accès prêtes pour WhatsApp ({currentActiveData.contactPhone || currentActiveData.directorPhone})</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCredentialsMessage}
                className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700  hover:bg-blue-50 text-blue-600  font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                {copiedCredentialsMessage ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                <span>{copiedCredentialsMessage ? 'Accès Copiés !' : 'Copier les Accès & Message WhatsApp'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50  px-6 py-4 border-t border-slate-200 dark:border-slate-700  flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 ">
            <ShieldCheck className="w-4 h-4 text-blue-600 " />
            <span>Opération sécurisée par EDU-CONGO Congo-Brazzaville</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50  hover:bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100  rounded-xl font-semibold cursor-pointer"
            >
              Fermer
            </button>

            {currentActiveData.status !== 'validee' ? (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700  rounded-xl p-1 shadow-sm">
                <input
                  type="password"
                  placeholder="PIN Admin"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-28 bg-transparent text-slate-800 dark:text-slate-100  px-2 py-1 text-xs focus:outline-none text-center font-mono tracking-widest"
                  maxLength={4}
                />
                <button
                  onClick={handleConfirmActivation}
                  disabled={isProcessing || adminPin !== '8377'}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-600 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing ? 'Validation...' : 'Valider'}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50  hover:bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100  border border-slate-200 dark:border-slate-700  rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer
                </button>

                <a
                  href={credentialsWhatsAppUrl || `https://api.whatsapp.com/send?phone=242068958377&text=${encodeURIComponent(buildSchoolCredentialsMessage(currentActiveData))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer text-xs transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ouvrir WhatsApp Établissement</span>
                </a>

                <button
                  onClick={() => {
                    onLaunchSchoolWorkspace(currentActiveData.schoolName);
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer text-xs transition-all hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir l'Espace École</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
