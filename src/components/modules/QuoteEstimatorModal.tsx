import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Send, 
  Building, 
  School, 
  Users, 
  Percent, 
  Calendar, 
  Zap, 
  Clock, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  MapPin, 
  FileCheck,
  Globe,
  AlertTriangle,
  UserCheck,
  Sparkles,
  Smartphone,
  MessageCircle
} from 'lucide-react';
import { SubscriptionRequest, TenantSchool, Student, Teacher } from '../../types';
import { 
  CONGO_DEPARTMENTS, 
  SCHOOL_ATTRIBUTIONS, 
  SCHOOL_TYPES_LIST, 
  ADMIN_FUNCTIONS 
} from '../../data/congoGeoData';
import { 
  generateSubdomainSlug, 
  isValidSubdomain, 
  checkDuplicateEmail, 
  checkDuplicatePhone, 
  normalizePhone, 
  generateSchoolCode,
  generateTemporaryPassword 
} from '../../utils/validation';
import { INITIAL_TENANTS, INITIAL_STUDENTS, INITIAL_TEACHERS } from '../../data/initialData';

interface QuoteEstimatorModalProps {
  onClose: () => void;
  onSubmitSubscriptionRequest?: (request: SubscriptionRequest) => void;
  onOpenApprovalModal?: (request: SubscriptionRequest) => void;
  existingSchools?: TenantSchool[];
  existingStudents?: Student[];
  existingTeachers?: Teacher[];
}

type BillingPeriod = 'essai_14j' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';

export const QuoteEstimatorModal: React.FC<QuoteEstimatorModalProps> = ({ 
  onClose,
  onSubmitSubscriptionRequest,
  onOpenApprovalModal,
  existingSchools = INITIAL_TENANTS,
  existingStudents = INITIAL_STUDENTS,
  existingTeachers = INITIAL_TEACHERS
}) => {
  const [step, setStep] = useState<'form' | 'submitted'>('form');
  const [activeTab, setActiveTab] = useState<'identity' | 'location' | 'plan'>('identity');
  
  // 1. School identity & Attribution
  const [attribution, setAttribution] = useState<string>(SCHOOL_ATTRIBUTIONS[0]);
  const [schoolName, setSchoolName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [isSubdomainManual, setIsSubdomainManual] = useState<boolean>(false);
  const [schoolType, setSchoolType] = useState<'complexe' | 'secondaire' | 'primaire' | 'professionnel'>('complexe');

  // 2. Congo Geographic Location (Département, Ville & Commune)
  const [selectedDeptId, setSelectedDeptId] = useState<string>('bzv');
  const currentDept = CONGO_DEPARTMENTS.find(d => d.id === selectedDeptId) || CONGO_DEPARTMENTS[0];
  const [city, setCity] = useState<string>(currentDept.chefLieu);
  const [selectedCommune, setSelectedCommune] = useState<string>(currentDept.communesAndDistricts[1] || currentDept.communesAndDistricts[0]);

  // Update city and commune when department changes
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const dept = CONGO_DEPARTMENTS.find(d => d.id === deptId) || CONGO_DEPARTMENTS[0];
    setCity(dept.chefLieu);
    setSelectedCommune(dept.communesAndDistricts[0] || 'Centre-Ville');
  };

  // Auto-generate subdomain from school name unless manually edited
  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val);
    if (!isSubdomainManual) {
      setSubdomain(generateSubdomainSlug(val));
    }
  };

  // 3. Admin info
  const [adminFullName, setAdminFullName] = useState<string>('');
  const [adminPhone, setAdminPhone] = useState<string>('+242 06 ');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminFunction, setAdminFunction] = useState<string>(ADMIN_FUNCTIONS[1]); // Directeur Général

  // 4. Subscription Plan & Sizing
  const [studentCount, setStudentCount] = useState<number>(650);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annuel');

  // 5. Gateways & Trainings (Formation & Support gratuit cochés par défaut)
  const [includeFreeTraining, setIncludeFreeTraining] = useState<boolean>(true);
  const [includeFreeDedicatedSupport, setIncludeFreeDedicatedSupport] = useState<boolean>(true);
  const [includeMtnMomo, setIncludeMtnMomo] = useState<boolean>(true);
  const [includeAirtelMoney, setIncludeAirtelMoney] = useState<boolean>(true);
  const [includeSmsWhatsappAlerts, setIncludeSmsWhatsappAlerts] = useState<boolean>(true);

  // Validation & Duplicate state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [generatedRequest, setGeneratedRequest] = useState<SubscriptionRequest | null>(null);
  const [generatedWhatsAppMessage, setGeneratedWhatsAppMessage] = useState<string>('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  // Plans config
  const periodConfig: Record<BillingPeriod, { label: string; months: number; durationDays?: number; discount: number; isTrial?: boolean; tag: string; badgeColor: string }> = {
    essai_14j: { label: 'Essai Gratuit 14 Jours', months: 0.5, durationDays: 14, discount: 100, isTrial: true, tag: '🎁 100% Gratuit • Accès Illimité Sans Limite • Sans Engagement', badgeColor: 'bg-amber-50  text-amber-700  border border-amber-300 ' },
    mensuel: { label: 'Mensuel (1 mois)', months: 1, discount: 0, tag: 'Standard', badgeColor: 'bg-slate-50 dark:bg-slate-800/50  text-slate-800 dark:text-slate-100 ' },
    trimestriel: { label: 'Trimestriel (3 mois)', months: 3, discount: 10, tag: '-10% de remise', badgeColor: 'bg-blue-50  text-blue-700  border border-blue-200 ' },
    semestriel: { label: 'Semestriel (6 mois)', months: 6, discount: 15, tag: '-15% de remise', badgeColor: 'bg-purple-50  text-purple-700  border border-purple-200 ' },
    annuel: { label: 'Annuel (12 mois - Année Scolaire)', months: 12, discount: 25, tag: '-25% • 3 mois offerts • Recommandé', badgeColor: 'bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ' },
  };

  // Base monthly pricing calculation in FCFA
  const currentSchoolTypeObj = SCHOOL_TYPES_LIST.find(t => t.id === schoolType) || SCHOOL_TYPES_LIST[0];
  let baseMonthlyRate = currentSchoolTypeObj.baseRate;

  // Student volume adjustment (+2 500 FCFA per each 200 students above 300)
  const studentVolumeAddon = Math.max(0, Math.floor((studentCount - 300) / 200)) * 2500;
  const smsGatewayMonthly = includeSmsWhatsappAlerts ? 5000 : 0;

  const totalStandardMonthly = baseMonthlyRate + studentVolumeAddon + smsGatewayMonthly;

  const currentPlan = periodConfig[billingPeriod];
  const isTrialPlan = currentPlan.isTrial === true;
  const grossTotal = isTrialPlan ? 0 : totalStandardMonthly * currentPlan.months;
  const discountAmount = isTrialPlan ? 0 : Math.round(grossTotal * (currentPlan.discount / 100));
  const finalPayableTotal = isTrialPlan ? 0 : grossTotal - discountAmount;
  const effectiveMonthlyRate = isTrialPlan ? 0 : Math.round(finalPayableTotal / currentPlan.months);

  const fullSchoolDisplayName = `${attribution} ${schoolName.trim()}`;
  const fullSubdomainUrl = `https://${subdomain.trim() || 'mon-ecole'}.educongo.ai.studio`;

  const buildConfirmationUrl = (req: SubscriptionRequest) => {
    let baseUrl = 'https://edu-congo.cg';
    if (typeof window !== 'undefined' && window.location.origin) {
      baseUrl = window.location.origin + window.location.pathname;
    }
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const params = new URLSearchParams({
      action: 'confirm_subscription',
      reqId: req.id,
      school: req.schoolName,
      attribution: req.attribution || '',
      subdomain: req.subdomain || '',
      type: req.schoolType || 'complexe',
      dept: req.department || '',
      city: req.city || 'Brazzaville',
      commune: req.commune || '',
      plan: req.planTitle || 'Annuel',
      planId: req.planId || 'annuel',
      months: (req.durationMonths || 12).toString(),
      discount: (req.discountPercentage || 0).toString(),
      amount: (req.totalAmountFCFA || 0).toString(),
      students: (req.studentCount || 500).toString(),
      contact: req.contactName || '',
      phone: req.contactPhone || '',
      email: req.contactEmail || '',
      function: req.contactFunction || '',
      options: (req.options || []).join(';'),
      code: req.schoolCode || '',
      pass: req.tempPassword || '',
      ts: Date.now().toString()
    });

    return `${cleanBase}/?${params.toString()}`;
  };

  const validateStep = (tab: 'identity' | 'location' | 'plan'): boolean => {
    setValidationError(null);
    if (tab === 'identity') {
      if (!schoolName.trim()) {
        setValidationError("Veuillez saisir le nom officiel de l'établissement.");
        return false;
      }
      if (!isValidSubdomain(subdomain.trim().toLowerCase())) {
        setValidationError("Le sous-domaine doit contenir uniquement des lettres minuscules, chiffres et tirets.");
        return false;
      }
    } else if (tab === 'location') {
      if (!city.trim()) {
        setValidationError("Veuillez renseigner la ville ou chef-lieu.");
        return false;
      }
      if (!adminFullName.trim() || !adminPhone.trim() || !adminEmail.trim()) {
        setValidationError("Veuillez renseigner l'ensemble des coordonnées du responsable (nom, téléphone, e-mail).");
        return false;
      }
      // Anti duplicate verification
      const emailCheck = checkDuplicateEmail(adminEmail.trim().toLowerCase(), {
        schools: existingSchools,
        students: existingStudents,
        teachers: existingTeachers
      });
      if (emailCheck.isDuplicate) {
        setValidationError(emailCheck.message || "Cette adresse e-mail est déjà utilisée dans EDU-CONGO.");
        return false;
      }
      const phoneCheck = checkDuplicatePhone(normalizePhone(adminPhone.trim()), {
        schools: existingSchools,
        students: existingStudents,
        teachers: existingTeachers
      });
      if (phoneCheck.isDuplicate) {
        setValidationError(phoneCheck.message || "Ce numéro WhatsApp est déjà enregistré.");
        return false;
      }
    }
    return true;
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate all tabs
    if (!validateStep('identity')) {
      setActiveTab('identity');
      return;
    }
    if (!validateStep('location')) {
      setActiveTab('location');
      return;
    }

    const cleanSchoolName = schoolName.trim();
    const cleanSubdomain = subdomain.trim().toLowerCase();
    const cleanAdminName = adminFullName.trim();
    const cleanPhone = normalizePhone(adminPhone.trim());
    const cleanEmail = adminEmail.trim().toLowerCase();

    // Check if subdomain is already taken by existing tenant
    const existingSubdomain = existingSchools.find(
      s => (s.subdomain?.toLowerCase() === cleanSubdomain) || (generateSubdomainSlug(s.name) === cleanSubdomain)
    );
    if (existingSubdomain) {
      setValidationError(`Le sous-domaine "${cleanSubdomain}.educongo.ai.studio" est déjà réservé par l'établissement "${existingSubdomain.name}".`);
      setActiveTab('identity');
      return;
    }

    const requestId = `REQ-CONGO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const tempPass = generateTemporaryPassword();
    const schoolCode = generateSchoolCode(currentDept.code);

    const options: string[] = [];
    if (includeFreeTraining) options.push('Formation continue sur site & en ligne (Inclus Gratuit)');
    if (includeFreeDedicatedSupport) options.push('Support technique & Hotline 24/7 (Inclus Gratuit)');
    if (includeMtnMomo) options.push('Passerelle MTN Mobile Money Congo (+242)');
    if (includeAirtelMoney) options.push('Passerelle Airtel Money Congo (+242)');
    if (includeSmsWhatsappAlerts) options.push('Module d\'Alertes SMS & WhatsApp');

    const isTrialSelected = billingPeriod === 'essai_14j';

    const newRequest: SubscriptionRequest = {
      id: requestId,
      schoolName: fullSchoolDisplayName,
      attribution,
      subdomain: cleanSubdomain,
      subdomainUrl: `https://${cleanSubdomain}.educongo.ai.studio`,
      schoolType,
      department: currentDept.name,
      city: city.trim() || currentDept.chefLieu,
      commune: selectedCommune,
      studentCount,
      planId: billingPeriod,
      planTitle: currentPlan.label,
      isTrial: isTrialSelected,
      durationMonths: isTrialSelected ? 0.5 : currentPlan.months,
      durationDays: isTrialSelected ? 14 : undefined,
      discountPercentage: currentPlan.discount,
      totalAmountFCFA: finalPayableTotal,
      effectiveMonthlyRateFCFA: effectiveMonthlyRate,
      contactName: cleanAdminName,
      contactPhone: cleanPhone,
      contactEmail: cleanEmail,
      contactFunction: adminFunction,
      options,
      status: 'en_attente',
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      tempPassword: tempPass,
      schoolCode
    };

    const confirmationLink = buildConfirmationUrl(newRequest);
    newRequest.confirmationLink = confirmationLink;

    setGeneratedRequest(newRequest);
    if (onSubmitSubscriptionRequest) {
      onSubmitSubscriptionRequest(newRequest);
    }

    // Official WhatsApp dispatch message
    const planDetailText = isTrialSelected
      ? `📦 *Plan d'Abonnement :* ESSAI GRATUIT 14 JOURS (Accès Intégral Illimité)\n💰 *Total Facturé :* 0 FCFA (Offert par EDU-CONGO pour évaluation 14j)\n✨ *Note :* Accès complet sans limite. Après les 14 jours, l'administrateur pourra choisir son plan définitif.`
      : `📦 *Plan d'Abonnement :* ${currentPlan.label.toUpperCase()}\n🏷️ *Remise Accordée :* -${currentPlan.discount}% (Économie : ${discountAmount.toLocaleString()} FCFA)\n💰 *Total Net Facturé :* ${finalPayableTotal.toLocaleString()} FCFA (${effectiveMonthlyRate.toLocaleString()} FCFA/mois)`;

    const whatsAppMessage = 
`🏛️ *DEMANDE OFFICIELLE D'INSCRIPTION & VALIDATION EDU-CONGO*
----------------------------------------
📋 *Réf Demande :* ${newRequest.id}
🏫 *Établissement :* ${newRequest.schoolName}
🌐 *Sous-Domaine Souhaité :* https://${newRequest.subdomain}.educongo.ai.studio
📍 *Localisation :* Dép. ${newRequest.department} • ${newRequest.city} (${newRequest.commune})
🎓 *Cycle & Type :* ${currentSchoolTypeObj.label}
👥 *Effectif Estimé :* ~${newRequest.studentCount} Élèves / Étudiants
${planDetailText}

👤 *Administrateur Référent :* ${newRequest.contactName} (${newRequest.contactFunction})
📞 *WhatsApp Référent :* ${newRequest.contactPhone}
📧 *Email :* ${newRequest.contactEmail}
🛠️ *Options Activées :* ${options.join(', ')}

----------------------------------------
🔗 *LIEN DE CONFIRMATION OFFICIELLE EDU-CONGO :*
👉 ${confirmationLink}

*(Cliquez sur ce lien pour valider instantanément l'établissement. Dès validation, les accès sécurisés seront automatiquement expédiés sur le WhatsApp de l'établissement).*`;

    const encoded = encodeURIComponent(whatsAppMessage);
    const apiWhatsAppUrl = `https://api.whatsapp.com/send?phone=242068958377&text=${encoded}`;
    
    setGeneratedWhatsAppMessage(whatsAppMessage);
    setGeneratedWhatsAppUrl(apiWhatsAppUrl);

    try {
      window.open(apiWhatsAppUrl, '_blank');
    } catch {
      // Fallback handled gracefully in UI
    }

    setStep('submitted');
  };

  const handleCopyLink = () => {
    if (generatedRequest?.confirmationLink) {
      navigator.clipboard.writeText(generatedRequest.confirmationLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyMessage = () => {
    if (generatedWhatsAppMessage) {
      navigator.clipboard.writeText(generatedWhatsAppMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleTestConfirmationDirectly = () => {
    if (generatedRequest && onOpenApprovalModal) {
      onOpenApprovalModal(generatedRequest);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-2xl overflow-hidden flex flex-col my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-center justify-between text-white border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
              EC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  EDU-CONGO • Plateforme SaaS
                </span>
                <span className="bg-blue-600 text-blue-600 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Inscription & Souscription Officielle
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Fiche d'Inscription d'Établissement Scolaire & Centre de Formation
              </h3>
            </div>
          </div>
          <button 
            id="btn-close-quote-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 'form' ? (
          <form onSubmit={handleProcessSubmit} className="p-6 sm:p-8 flex flex-col gap-6 text-xs max-h-[82vh] overflow-y-auto">
            
            {/* Top Contact Support Info Banner */}
            <div className="bg-blue-50/90  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-blue-600  shadow-xs">
              <span className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 " />
                Guichet National d'Enregistrement EDU-CONGO (Brazzaville & Pointe-Noire)
              </span>
              <div className="flex items-center gap-4 text-slate-800 dark:text-slate-100  font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-600  font-bold">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Support : +242 06 895 83 77
                </span>
                <span className="hidden md:flex items-center gap-1.5 text-blue-600  font-semibold">
                  <Mail className="w-3.5 h-3.5" /> steph.alongo@gmail.com
                </span>
              </div>
            </div>

            {/* Stepper Tabs Navigation Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/50/90  p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('identity')}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'identity'
                    ? 'bg-white dark:bg-slate-900  text-blue-600  shadow-sm border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 '
                    : 'text-slate-500 dark:text-slate-400  hover:text-slate-800 dark:text-slate-100'
                }`}
              >
                <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center ${
                  activeTab === 'identity' ? 'bg-blue-600  text-white ' : 'bg-slate-50 dark:bg-slate-800/50  text-slate-800 dark:text-slate-100 '
                }`}>
                  1
                </span>
                <span className="hidden sm:inline">Établissement & Domaine</span>
                <span className="sm:hidden">1. Établissement</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep('identity')) setActiveTab('location');
                }}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'location'
                    ? 'bg-white dark:bg-slate-900  text-blue-600  shadow-sm border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 '
                    : 'text-slate-500 dark:text-slate-400  hover:text-slate-800 dark:text-slate-100'
                }`}
              >
                <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center ${
                  activeTab === 'location' ? 'bg-blue-600  text-white ' : 'bg-slate-50 dark:bg-slate-800/50  text-slate-800 dark:text-slate-100 '
                }`}>
                  2
                </span>
                <span className="hidden sm:inline">Localisation & Admin</span>
                <span className="sm:hidden">2. Localisation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep('identity') && validateStep('location')) setActiveTab('plan');
                }}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'plan'
                    ? 'bg-white dark:bg-slate-900  text-blue-600  shadow-sm border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 '
                    : 'text-slate-500 dark:text-slate-400  hover:text-slate-800 dark:text-slate-100'
                }`}
              >
                <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center ${
                  activeTab === 'plan' ? 'bg-blue-600  text-white ' : 'bg-slate-50 dark:bg-slate-800/50  text-slate-800 dark:text-slate-100 '
                }`}>
                  3
                </span>
                <span className="hidden sm:inline">Offre & Validation</span>
                <span className="sm:hidden">3. Validation</span>
              </button>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="bg-rose-50  border border-rose-200  rounded-lg p-4 flex items-start gap-3 text-rose-900  animate-in shake">
                <AlertTriangle className="w-5 h-5 text-rose-600  shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-extrabold text-xs block">Règle de validation ou contrôle anti-doublon :</span>
                  <p className="text-xs mt-0.5">{validationError}</p>
                </div>
              </div>
            )}

            {/* TAB 1: IDENTIFICATION & SOUS-DOMAINE */}
            {activeTab === 'identity' && (
              <div className="bg-slate-50 dark:bg-slate-800/50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-5 sm:p-6 flex flex-col gap-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100  text-xs uppercase tracking-wider flex items-center gap-2">
                    <School className="w-4 h-4 text-blue-600 " />
                    1. Identification Officielle & Attribution
                  </span>
                  <span className="text-[10px] text-blue-600  bg-blue-50  font-bold px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                    Étape 1 sur 3
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Attribution */}
                  <div className="md:col-span-5">
                    <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                      Attribution officielle de l'école :
                    </label>
                    <select
                      value={attribution}
                      onChange={(e) => setAttribution(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    >
                      {SCHOOL_ATTRIBUTIONS.map((attr) => (
                        <option key={attr} value={attr}>{attr}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nom de l'établissement */}
                  <div className="md:col-span-7">
                    <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                      Nom de l'établissement :
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => handleSchoolNameChange(e.target.value)}
                      placeholder="Ex: Savorgnan, Chaminade, Saint-Exupéry..."
                      className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                  </div>

                  {/* Sous-domaine éditable */}
                  <div className="md:col-span-12">
                    <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600 " />
                        Sous-domaine web dédié de votre établissement :
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        (Format: lettres minuscules, chiffres, tirets)
                      </span>
                    </label>
                    <div className="flex items-center shadow-xs">
                      <span className="bg-slate-50 dark:bg-slate-800/50  border border-r-0 border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-500 dark:text-slate-400  px-3 py-2.5 rounded-l-xl font-mono text-xs">
                        https://
                      </span>
                      <input
                        type="text"
                        required
                        value={subdomain}
                        onChange={(e) => {
                          setIsSubdomainManual(true);
                          setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                        }}
                        placeholder="mon-ecole"
                        className="flex-1 bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-blue-600  font-black px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                      <span className="bg-blue-50  border border-l-0 border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-blue-600  font-bold px-3 py-2.5 rounded-r-xl font-mono text-xs">
                        .educongo.ai.studio
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400  mt-1.5">
                      <span>URL d'accès public : <strong className="text-blue-600  font-mono">{fullSubdomainUrl}</strong></span>
                      <span className="text-[10px] text-blue-600  font-bold">Certificat SSL & HTTPS inclus</span>
                    </div>
                  </div>

                  {/* Type d'établissement */}
                  <div className="md:col-span-12">
                    <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                      Cycle d'enseignement & Type d'établissement :
                    </label>
                    <select
                      value={schoolType}
                      onChange={(e) => setSchoolType(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    >
                      {SCHOOL_TYPES_LIST.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep('identity')) setActiveTab('location');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <span>Continuer vers Localisation</span>
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LOCALISATION & ADMINISTRATEUR */}
            {activeTab === 'location' && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                {/* Geographie Congo */}
                <div className="bg-slate-50 dark:bg-slate-800/50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100  text-xs uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 " />
                      2. Localisation Géographique (République du Congo)
                    </span>
                    <span className="text-[10px] text-blue-600  bg-blue-50  font-bold px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                      12 Départements Couverts
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Département */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Département du Congo :
                      </label>
                      <select
                        value={selectedDeptId}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      >
                        {CONGO_DEPARTMENTS.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ville */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Ville / Chef-lieu :
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Brazzaville, Pointe-Noire, Dolisie..."
                        className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    {/* Commune */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Commune / Arrondissement :
                      </label>
                      <select
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      >
                        {currentDept.communesAndDistricts.map((comm) => (
                          <option key={comm} value={comm}>{comm}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Administrateur Info */}
                <div className="bg-slate-50 dark:bg-slate-800/50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100  text-xs uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-purple-600 " />
                      3. Coordonnées de l'Administrateur Référent
                    </span>
                    <span className="text-[10px] text-purple-700  bg-purple-100  font-bold px-2.5 py-0.5 rounded-lg border border-purple-200 ">
                      Anti-Doublon Garanti
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nom complet */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Nom & Prénom complet du responsable :
                      </label>
                      <input
                        type="text"
                        required
                        value={adminFullName}
                        onChange={(e) => setAdminFullName(e.target.value)}
                        placeholder="Ex: Prof. Stéphane Alongo"
                        className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                      />
                    </div>

                    {/* Fonction */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Fonction / Titre administratif :
                      </label>
                      <select
                        value={adminFunction}
                        onChange={(e) => setAdminFunction(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                      >
                        {ADMIN_FUNCTIONS.map((fn) => (
                          <option key={fn} value={fn}>{fn}</option>
                        ))}
                      </select>
                    </div>

                    {/* Téléphone WhatsApp */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Téléphone WhatsApp Référent (+242) :
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          placeholder="+242 06 895 83 77"
                          className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono font-bold"
                        />
                        <Phone className="w-4 h-4 text-blue-600 absolute right-3 top-3 pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400  mt-1 block">
                        Les identifiants et mot de passe provisoires y seront envoyés dès validation.
                      </span>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-slate-800 dark:text-slate-100  font-bold mb-1.5 block">
                        Adresse E-mail officielle :
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="direction@votre-ecole.cg"
                          className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                        />
                        <Mail className="w-4 h-4 text-blue-600 absolute right-3 top-3 pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400  mt-1 block">
                        Doit être unique dans la base de données EDU-CONGO.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('identity')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  hover:bg-slate-50 dark:bg-slate-800/50 font-bold cursor-pointer"
                  >
                    Retour à l'étape 1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep('location')) setActiveTab('plan');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <span>Continuer vers l'Offre & Plan</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: PLAN, PASSERELLES & RECAPITULATIF */}
            {activeTab === 'plan' && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                
                {/* Plan Selection & Effectifs */}
                <div className="bg-slate-50 dark:bg-slate-800/50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100  text-xs uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600 " />
                      4. Formule d'Abonnement & Effectif Estimé
                    </span>
                    <span className="text-[11px] font-bold text-amber-800  bg-amber-100  px-2.5 py-0.5 rounded-lg border border-amber-200 ">
                      Tarification République du Congo
                    </span>
                  </div>

                  {/* Slider effectif */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-800 dark:text-slate-100  font-bold">
                        Effectif global estimé d'élèves / étudiants :
                      </label>
                      <span className="font-extrabold text-blue-600  bg-blue-50  px-3 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-xs">
                        {studentCount} élèves
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="3500"
                      step="50"
                      value={studentCount}
                      onChange={(e) => setStudentCount(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer mt-1"
                    />
                  </div>

                  {/* Cards des Plans */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(Object.keys(periodConfig) as BillingPeriod[]).map((periodKey) => {
                      const p = periodConfig[periodKey];
                      const isSelected = billingPeriod === periodKey;

                      return (
                        <button
                          key={periodKey}
                          type="button"
                          onClick={() => setBillingPeriod(periodKey)}
                          className={`p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 bg-blue-50/90  shadow-md ring-2 ring-indigo-500/30'
                              : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-white dark:bg-slate-900  hover:border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-1.5">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100  text-xs">{p.label}</span>
                              {p.discount > 0 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                                  -{p.discount}%
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400  block mb-2">{p.tag}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-blue-600  font-extrabold text-xs">
                            <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-blue-600 ' : 'text-slate-500 dark:text-slate-400 '}`} />
                            <span>{isSelected ? 'Sélectionné' : 'Choisir ce plan'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Passerelles & Formations (Formations & Support gratuits cochés par défaut) */}
                <div className="bg-slate-50 dark:bg-slate-800/50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-5 sm:p-6 flex flex-col gap-4">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100  text-xs uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 " />
                    5. Passerelles & Formations (Formation & Support Gratuit Inclus)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Formation Gratuite cochée par défaut */}
                    <label className="flex items-start gap-3 p-3.5 bg-blue-50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFreeTraining}
                        onChange={(e) => setIncludeFreeTraining(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600  text-xs">Formation continue sur site & en ligne</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-blue-600 text-white">GRATUIT</span>
                        </div>
                        <span className="text-[10px] text-blue-600  block mt-0.5">
                          Prise en main complète pour proviseurs, censeurs, secrétaires et enseignants.
                        </span>
                      </div>
                    </label>

                    {/* Support Dédié Gratuit coché par défaut */}
                    <label className="flex items-start gap-3 p-3.5 bg-blue-50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFreeDedicatedSupport}
                        onChange={(e) => setIncludeFreeDedicatedSupport(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600  text-xs">Support technique & Hotline 24/7</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-blue-600 text-white">GRATUIT</span>
                        </div>
                        <span className="text-[10px] text-blue-600  block mt-0.5">
                          Assistance prioritaire WhatsApp & téléphone dédiée pour votre établissement.
                        </span>
                      </div>
                    </label>

                    {/* Passerelle MTN MoMo */}
                    <label className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-2xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMtnMomo}
                        onChange={(e) => setIncludeMtnMomo(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-amber-500 rounded"
                      />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100  text-xs block">Passerelle MTN Mobile Money Congo (+242)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400  block mt-0.5">
                          Encaissement direct des frais scolaires avec validation automatique.
                        </span>
                      </div>
                    </label>

                    {/* Passerelle Airtel Money */}
                    <label className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-2xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeAirtelMoney}
                        onChange={(e) => setIncludeAirtelMoney(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-red-600 rounded"
                      />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100  text-xs block">Passerelle Airtel Money Congo (+242)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400  block mt-0.5">
                          Réconciliation instantanée et notification automatique des tuteurs.
                        </span>
                      </div>
                    </label>

                    {/* Passerelle SMS & WhatsApp */}
                    <label className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-2xl cursor-pointer sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={includeSmsWhatsappAlerts}
                        onChange={(e) => setIncludeSmsWhatsappAlerts(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100  text-xs">Module d'Alertes SMS & WhatsApp Direct (+242)</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-50  text-blue-600 ">5 000 FCFA / mois</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400  block mt-0.5">
                          Envoi automatique des bulletins de notes, alertes absences et relances de paiement aux parents.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* RECAPITULATIF FINANCIER */}
                <div className="bg-blue-600 text-white rounded-lg p-5 sm:p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                      Récapitulatif de l'Abonnement
                    </span>
                    <h4 className="text-lg font-black text-white">
                      {fullSchoolDisplayName}
                    </h4>
                    <p className="text-xs text-blue-600 mt-1">
                      Formule <strong>{currentPlan.label}</strong> • {studentCount} élèves • Département de <strong>{currentDept.name}</strong>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-lg font-mono">
                        Sous-domaine : {subdomain}.educongo.ai.studio
                      </span>
                      {currentPlan.discount > 0 && (
                        <span className="text-[11px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-lg">
                          Économie de {discountAmount.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-white/10 p-4 rounded-lg border border-white/15">
                    <span className="text-[10px] text-blue-600 block uppercase font-bold">Total Facturé</span>
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                      {finalPayableTotal.toLocaleString()} <span className="text-sm text-white">FCFA</span>
                    </div>
                    <span className="text-[11px] text-blue-600 block mt-0.5">
                      soit <strong>{effectiveMonthlyRate.toLocaleString()} FCFA</strong> / mois
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('location')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  hover:bg-slate-50 dark:bg-slate-800/50 font-bold transition-colors cursor-pointer"
                  >
                    Retour à l'étape 2
                  </button>
                  <button
                    id="btn-submit-registration-request"
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer la Demande sur WhatsApp EDU-CONGO (+242)</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        ) : (
          /* CONFIRMATION STEP (Demande transmise à EDU-CONGO) */
          <div className="p-6 sm:p-8 flex flex-col gap-6 text-xs max-h-[82vh] overflow-y-auto">
            <div className="bg-blue-50  border-2 border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-6 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-blue-600 ">
                Demande d'Inscription Générée avec Succès !
              </h3>
              <p className="text-xs text-blue-600  max-w-xl">
                La demande d'abonnement pour <strong>{generatedRequest?.schoolName}</strong> a été enregistrée. Transmettez-la sur le compte WhatsApp officiel de <strong>EDU-CONGO (+242 06 895 83 77)</strong> pour validation immédiate.
              </p>

              {/* Direct WhatsApp Call to Action */}
              <div className="w-full max-w-lg mt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={generatedWhatsAppUrl || `https://api.whatsapp.com/send?phone=242068958377&text=${encodeURIComponent(generatedWhatsAppMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold rounded-lg shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 text-xs transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Ouvrir WhatsApp (+242 06 895 83 77)</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  hover:bg-blue-50 text-blue-600  font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                  <span>{copiedMessage ? 'Message WhatsApp Copié !' : 'Copier le Message WhatsApp'}</span>
                </button>
              </div>
            </div>

            {/* Recapitulative Details */}
            <div className="bg-slate-50 dark:bg-slate-800/50  rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-5 flex flex-col gap-3">
              <span className="font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider text-xs flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600 " />
                Détails de l'Inscription en Attente de Validation
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400  block">Réf Demande :</span>
                  <strong className="font-mono text-blue-600 ">{generatedRequest?.id}</strong>
                </div>
                <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400  block">Sous-domaine :</span>
                  <strong className="font-mono text-blue-600 ">{generatedRequest?.subdomainUrl}</strong>
                </div>
                <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400  block">Localisation :</span>
                  <strong>{generatedRequest?.city} ({generatedRequest?.department})</strong>
                </div>
                <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400  block">Administrateur :</span>
                  <strong>{generatedRequest?.contactName} ({generatedRequest?.contactFunction})</strong>
                </div>
                <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400  block">WhatsApp Admin :</span>
                  <strong className="font-mono">{generatedRequest?.contactPhone}</strong>
                </div>
                <div className="bg-white dark:bg-slate-900  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400  block">Montant Facturé :</span>
                  <strong className="text-blue-600 font-extrabold">{generatedRequest?.totalAmountFCFA?.toLocaleString()} FCFA</strong>
                </div>
              </div>
            </div>

            {/* Validation Link Box */}
            <div className="bg-blue-50/80  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-600  flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600 " />
                  Lien de Confirmation Officiel EDU-CONGO :
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs font-bold text-blue-600  hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Lien Copié !' : 'Copier le lien'}
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={generatedRequest?.confirmationLink || ''}
                className="w-full bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-[11px] font-mono text-slate-800 dark:text-slate-100 "
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 ">
                Ce lien permet à l'équipe EDU-CONGO de valider instantanément l'établissement et d'expédier les accès directement sur le WhatsApp du responsable.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConfirmationDirectly}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tester la validation EDU-CONGO maintenant</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-900  text-white  font-extrabold text-xs hover:bg-white dark:bg-slate-900 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
