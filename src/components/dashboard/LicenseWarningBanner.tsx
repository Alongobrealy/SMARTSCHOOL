import React from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  KeyRound, 
  CreditCard 
} from 'lucide-react';
import { LicenseStatusResult } from '../../utils/licenseManager';

interface LicenseWarningBannerProps {
  licenseInfo: LicenseStatusResult;
  schoolName: string;
  onOpenUpgradeModal: () => void;
  isDirectorOrAdmin: boolean;
}

export const LicenseWarningBanner: React.FC<LicenseWarningBannerProps> = ({
  licenseInfo,
  schoolName,
  onOpenUpgradeModal,
  isDirectorOrAdmin
}) => {
  // If no warning and not trial, don't show intrusive banner
  if (licenseInfo.warningLevel === 'none' && !licenseInfo.isTrial) {
    return null;
  }

  // 1. LOCKED / SUSPENDED STATE (Over grace period or manually suspended)
  if (licenseInfo.isSuspended) {
    return (
      <div 
        id="banner-license-suspended"
        className="rounded-lg p-4 sm:p-5 bg-blue-600 text-white border-2 border-rose-500 shadow-lg animate-in fade-in duration-300"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-rose-500/30 text-rose-200 border border-rose-400/50 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              <Lock className="w-6 h-6 text-rose-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-white text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                  <span>⛔</span>
                  <span>{licenseInfo.warningTitle}</span>
                </h4>
                <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-xs">
                  Accès Restreint en Lecture Seule
                </span>
              </div>
              <p className="text-xs text-rose-100/90 mt-1 max-w-3xl leading-relaxed">
                {licenseInfo.warningMessage}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-rose-200 font-semibold">
                <span>🔒 Modifications, créations et encaissements verrouillés.</span>
                <span>•</span>
                <span className="text-amber-300 underline font-bold">Le déblocage est instantané dès régularisation.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              id="btn-unlock-license-suspended"
              onClick={onOpenUpgradeModal}
              className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>Lever la Suspension / Activer</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. CRITICAL GRACE PERIOD (Expired within last 7 days)
  if (licenseInfo.isGracePeriod) {
    return (
      <div 
        id="banner-license-grace-period"
        className="rounded-lg p-4 sm:p-5 bg-blue-600 text-white border-2 border-amber-500 shadow-md animate-in fade-in duration-300"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-bold text-xl shrink-0">
              <Clock className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{licenseInfo.warningTitle}</span>
                </h4>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                  Délai de Grâce Actif
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-1 max-w-3xl leading-relaxed">
                {licenseInfo.warningMessage}
              </p>
              <p className="text-[11px] text-amber-300 font-bold mt-1.5">
                Il vous reste <strong>{licenseInfo.graceDaysRemaining} jour(s)</strong> avant le verrouillage en lecture seule.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              id="btn-renew-grace-period"
              onClick={onOpenUpgradeModal}
              className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Régulariser Maintenant →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. WARNING: EXPIRES IN LESS THAN 30 DAYS
  if (licenseInfo.warningLevel === 'warning' || licenseInfo.warningLevel === 'info') {
    return (
      <div 
        id="banner-license-expiring-soon"
        className="rounded-lg p-4 sm:p-5 bg-blue-600 border-2 border-slate-200  text-white shadow-md animate-in fade-in duration-300"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-600 text-blue-600 border border-slate-200 flex items-center justify-center font-bold text-xl shrink-0">
              <ShieldAlert className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
                  <span>⏳</span>
                  <span>{licenseInfo.warningTitle}</span>
                </h4>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                  Échéance dans {licenseInfo.daysRemaining} jours
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1 max-w-3xl leading-relaxed">
                {licenseInfo.warningMessage}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                <span>Tarif Mensuel : 25 000 FCFA</span>
                <span>•</span>
                <span className="text-blue-600 font-bold">Annuel avec -25% (3 mois offerts)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              id="btn-renew-expiring-license"
              onClick={onOpenUpgradeModal}
              className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Renouveler la Licence →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
