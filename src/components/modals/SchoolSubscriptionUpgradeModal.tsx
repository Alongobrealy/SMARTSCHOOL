import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Calendar, 
  Sparkles, 
  Building2, 
  Smartphone, 
  ArrowRight, 
  Check, 
  Star, 
  RefreshCw,
  Award,
  PhoneCall,
  Clock,
  KeyRound,
  AlertTriangle,
  Receipt,
  Phone
} from 'lucide-react';
import { TenantSchool } from '../../types';
import { 
  SUBSCRIPTION_PLANS, 
  verifyActivationCodeForSchool, 
  VerificationResult 
} from '../../utils/activationCode';
import confetti from 'canvas-confetti';

interface SchoolSubscriptionUpgradeModalProps {
  school: TenantSchool | { name: string; id: string; code?: string; plan?: string; isTrial?: boolean; licenseExpiresAt?: string };
  onClose: () => void;
  onConfirmPlan: (selectedPlan: {
    planName: 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
    durationMonths: number;
    amountFCFA: number;
    paymentMethod: 'MTN Mobile Money' | 'Airtel Money' | 'Virement Bancaire' | 'Code d\'Activation Espèces';
    transactionRef: string;
    activationCodeUsed?: string;
  }) => void;
}

export const SchoolSubscriptionUpgradeModal: React.FC<SchoolSubscriptionUpgradeModalProps> = ({
  school,
  onClose,
  onConfirmPlan
}) => {
  const [activeTab, setActiveTab] = useState<'momo' | 'code'>('momo');
  const [selectedPlanId, setSelectedPlanId] = useState<'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'>('annuel');
  const [paymentMethod, setPaymentMethod] = useState<'MTN Mobile Money' | 'Airtel Money' | 'Virement Bancaire'>('MTN Mobile Money');
  const [payerPhone, setPayerPhone] = useState<string>('+242 06 ');
  const [transactionRef, setTransactionRef] = useState<string>('');
  
  // Activation Code state
  const [inputActivationCode, setInputActivationCode] = useState<string>('');
  const [codeVerificationResult, setCodeVerificationResult] = useState<VerificationResult | null>(null);
  const [hasVerifiedCode, setHasVerifiedCode] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false);
  const [successDetails, setSuccessDetails] = useState<{ planName: string; durationLabel: string; method: string } | null>(null);

  // Exact pricing per user specifications:
  // - Mensuel : 25 000 FCFA sans engagement
  // - Trimestriel : 25 000 FCFA (-10%) -> 67 500 FCFA (22 500 FCFA/m)
  // - Semestriel : 25 000 FCFA (-15%) -> 127 500 FCFA (21 250 FCFA/m)
  // - Annuel : 25 000 FCFA (-25%) -> 225 000 FCFA (18 750 FCFA/m)
  const plans = [
    {
      id: 'mensuel' as const,
      name: 'Mensuel' as const,
      durationMonths: 1,
      durationLabel: '1 Mois',
      rateMonthly: 25000,
      totalAmount: 25000,
      discountPercent: 0,
      tag: 'Sans engagement',
      features: ['Tous les modules débloqués', 'Support standard', 'Passerelles MoMo (+242)']
    },
    {
      id: 'trimestriel' as const,
      name: 'Trimestriel' as const,
      durationMonths: 3,
      durationLabel: '3 Mois (1 Trimestre)',
      rateMonthly: 22500,
      totalAmount: 67500, // 25 000 * 3 * 0.90
      discountPercent: 10,
      tag: '-10% d\'économie',
      features: ['Tous les modules débloqués', 'Support prioritaire WhatsApp', 'Bulletins & Notes trimestriels']
    },
    {
      id: 'semestriel' as const,
      name: 'Semestriel' as const,
      durationMonths: 6,
      durationLabel: '6 Mois (1 Semestre)',
      rateMonthly: 21250,
      totalAmount: 127500, // 25 000 * 6 * 0.85
      discountPercent: 15,
      tag: '-15% d\'économie',
      features: ['Tous les modules débloqués', 'Formation continue du personnel', 'Sauvegardes multi-sites']
    },
    {
      id: 'annuel' as const,
      name: 'Annuel' as const,
      durationMonths: 12,
      durationLabel: '12 Mois (Année Scolaire)',
      rateMonthly: 18750,
      totalAmount: 225000, // 25 000 * 12 * 0.75 (soit 3 mois offerts)
      discountPercent: 25,
      isPopular: true,
      tag: '🔥 Recommandé • 3 Mois Offerts • -25%',
      features: [
        'Accès 100% illimité pour 12 mois',
        'Formation sur site à Brazzaville & Pointe-Noire',
        'Support technique dédié 24/7',
        'Sauvegardes quotidiennes et cartes scolaires illimitées'
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[3];

  // Handle Mobile Money Activation
  const handleActivateSubscriptionMoMo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedTxnRef = transactionRef.trim() || `TXN-MOMO-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      onConfirmPlan({
        planName: currentPlan.name,
        durationMonths: currentPlan.durationMonths,
        amountFCFA: currentPlan.totalAmount,
        paymentMethod,
        transactionRef: generatedTxnRef
      });
      setIsProcessing(false);
      setSuccessDetails({
        planName: currentPlan.name,
        durationLabel: currentPlan.durationLabel,
        method: paymentMethod
      });
      setUpgradeSuccess(true);

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onClose();
      }, 2500);
    }, 900);
  };

  // Handle Real-Time Activation Code Verification
  const handleVerifyCode = () => {
    const res = verifyActivationCodeForSchool(inputActivationCode, {
      id: school.id,
      code: (school as any).code || 'EC-2026',
      name: school.name
    });
    setCodeVerificationResult(res);
    setHasVerifiedCode(true);
  };

  // Handle Code-based Activation
  const handleActivateWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyActivationCodeForSchool(inputActivationCode, {
      id: school.id,
      code: (school as any).code || 'EC-2026',
      name: school.name
    });

    if (!res.isValid || !res.planName || !res.durationMonths || !res.amountFCFA) {
      setCodeVerificationResult(res);
      setHasVerifiedCode(true);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      onConfirmPlan({
        planName: res.planName!,
        durationMonths: res.durationMonths!,
        amountFCFA: res.amountFCFA!,
        paymentMethod: 'Code d\'Activation Espèces',
        transactionRef: `ACT-CODE-${inputActivationCode.trim().toUpperCase()}`,
        activationCodeUsed: inputActivationCode.trim().toUpperCase()
      });
      setIsProcessing(false);
      setSuccessDetails({
        planName: res.planName!,
        durationLabel: `${res.durationMonths} Mois`,
        method: 'Code d\'Activation Unique (Espèces)'
      });
      setUpgradeSuccess(true);

      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        id="modal-school-subscription-upgrade"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {school.isTrial || school.plan === 'Essai 14 Jours' ? 'ABONNEMENT OFFICIEL' : 'RENOUVELLEMENT / UPGRADE'}
                </span>
                <span className="text-slate-400 text-xs font-mono">{school.name}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Activation & Paiement de la Licence Établissement
              </h2>
            </div>
          </div>
          <button
            id="btn-close-upgrade-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {upgradeSuccess && successDetails ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Licence Activée avec Succès !
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
              La formule <strong className="text-indigo-600 dark:text-indigo-400">{successDetails.planName} ({successDetails.durationLabel})</strong> a été activée pour <strong>{school.name}</strong> via <em>{successDetails.method}</em>. La suspension éventuelle est levée et toutes les fonctionnalités sont débloquées.
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Activation Modes Toggle Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                id="tab-momo-activation"
                onClick={() => setActiveTab('momo')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'momo'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Option 1 : Paiement Mobile Money Congo (+242)</span>
              </button>

              <button
                type="button"
                id="tab-code-activation"
                onClick={() => setActiveTab('code')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Option 2 : Saisir un Code d'Activation (Espèces)</span>
              </button>
            </div>

            {/* OPTION 1: MOBILE MONEY */}
            {activeTab === 'momo' && (
              <form onSubmit={handleActivateSubscriptionMoMo} className="space-y-6 animate-in fade-in duration-200">
                
                {/* Plan Selector Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      1. Sélectionnez votre Formule d'Abonnement
                    </label>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                      Tarif de base : 25 000 FCFA / mois
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {plans.map((p) => {
                      const isSelected = selectedPlanId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          id={`plan-card-${p.id}`}
                          onClick={() => setSelectedPlanId(p.id)}
                          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/70 shadow-lg ring-2 ring-indigo-500/30'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {p.isPopular && (
                            <div className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Recommandé
                            </div>
                          )}
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-black text-slate-900 dark:text-white text-sm">{p.name}</span>
                              {p.discountPercent > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                                  -{p.discountPercent}%
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-2">{p.durationLabel}</span>

                            <div className="mb-3">
                              <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">
                                {p.totalAmount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold"> FCFA</span>
                              {p.durationMonths > 1 && (
                                <span className="text-[10px] text-slate-400 block">
                                  soit ~{p.rateMonthly.toLocaleString()} FCFA/mois
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300 dark:text-slate-600'}`} />
                            <span>{isSelected ? 'Sélectionné' : 'Choisir'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Gateway and Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      2. Opérateur de Paiement Congo (+242)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'MTN Mobile Money' as const, label: 'MTN MoMo', color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-200' },
                        { id: 'Airtel Money' as const, label: 'Airtel Money', color: 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200' },
                        { id: 'Virement Bancaire' as const, label: 'Virement / Chèque', color: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200' }
                      ].map((method) => {
                        const isPicked = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-3 rounded-2xl border text-center text-xs font-extrabold transition-all cursor-pointer ${
                              isPicked
                                ? `${method.color} ring-2 ring-indigo-500/40 shadow-sm`
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <Smartphone className="w-4 h-4 mx-auto mb-1" />
                            <span>{method.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      3. Numéro de Contact / Référence MoMo
                    </label>
                    <input
                      type="text"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="+242 06 000 00 00"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Phone className="w-3 h-3 text-emerald-500" />
                      <span>Assistance & Confirmation Directe : +242 06 895 83 77</span>
                    </div>
                  </div>
                </div>

                {/* Total and Submit button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                      Montant total pour {currentPlan.durationLabel} :
                    </span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {currentPlan.totalAmount.toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Annuler
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Validation MoMo...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Valider le Paiement & Activer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}

            {/* OPTION 2: ACTIVATION CODE INPUT */}
            {activeTab === 'code' && (
              <form onSubmit={handleActivateWithCode} className="space-y-6 animate-in fade-in duration-200">
                
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 text-xs text-amber-950 dark:text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-300">
                    <KeyRound className="w-4 h-4" />
                    <span>Activation par Code Unique d'Établissement (Achat Espèces ou Facture)</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
                    Si vous avez réglé votre abonnement en espèces auprès d'un agent agréé EDU-CONGO ou par bon de commande administratif, insérez ci-dessous le code d'activation fourni.
                  </p>
                  <div className="bg-amber-100/70 dark:bg-amber-900/50 p-2.5 rounded-xl text-[11px] font-mono text-amber-900 dark:text-amber-200">
                    🔒 <strong>Sécurité Établissement :</strong> Chaque code généré est cryptographiquement associé à <strong>{school.name}</strong> et ne peut être utilisé sur aucun autre établissement.
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Insérez votre Code d'Activation Officiel
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="input-activation-code"
                      value={inputActivationCode}
                      onChange={(e) => {
                        setInputActivationCode(e.target.value);
                        setHasVerifiedCode(false);
                        setCodeVerificationResult(null);
                      }}
                      placeholder="Ex: EDU-A12-XXXX-YYYY-ZZZZ"
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    
                    <button
                      type="button"
                      id="btn-verify-activation-code"
                      onClick={handleVerifyCode}
                      className="px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      Vérifier le Code
                    </button>
                  </div>

                  {/* Verification result feedback */}
                  {hasVerifiedCode && codeVerificationResult && (
                    <div className="animate-in fade-in duration-200">
                      {codeVerificationResult.isValid ? (
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs space-y-2">
                          <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Code d'activation valide et authentifié pour {school.name} !</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                            <div className="bg-emerald-100/60 dark:bg-emerald-900/60 p-2 rounded-xl">
                              <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase">Formule</span>
                              <strong>{codeVerificationResult.planName} ({codeVerificationResult.durationMonths} Mois)</strong>
                            </div>
                            <div className="bg-emerald-100/60 dark:bg-emerald-900/60 p-2 rounded-xl">
                              <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase">Montant Réglé</span>
                              <strong>{codeVerificationResult.amountFCFA?.toLocaleString()} FCFA</strong>
                            </div>
                            <div className="bg-emerald-100/60 dark:bg-emerald-900/60 p-2 rounded-xl col-span-2 sm:col-span-1">
                              <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase">Nouvelle Échéance</span>
                              <strong>{codeVerificationResult.calculatedNewExpirationDate}</strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-bold">Code non reconnu ou non autorisé :</strong>
                            <p className="mt-0.5 text-rose-800 dark:text-rose-300">{codeVerificationResult.errorMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit button for Code */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Besoin d'un code ? Contactez Stéphane Alongo au <strong>+242 06 895 83 77</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Fermer
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing || !inputActivationCode.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Activation en cours...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Activer la Licence avec ce Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
