import React from 'react';
import { Lock, Unlock, CreditCard } from 'lucide-react';
import { LicenseStatusResult } from '../utils/licenseManager';
import { UserRole, TenantSchool } from '../types';

interface AccessGuardProps {
  children: React.ReactNode;
  activeTenant: TenantSchool;
  licenseInfo: LicenseStatusResult;
  currentRole: UserRole;
  onOpenApprovalModal: () => void;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({
  children,
  activeTenant,
  licenseInfo,
  currentRole,
  onOpenApprovalModal
}) => {
  // If the license is suspended and the user is not a superadmin, display the locked state.
  if (licenseInfo.isSuspended && currentRole !== 'superadmin') {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="bg-white  border border-rose-200  rounded-lg p-8 md:p-12 text-center shadow-xl max-w-2xl mx-auto mt-10 space-y-6">
          <div className="w-20 h-20 bg-rose-100  rounded-lg flex items-center justify-center mx-auto mb-2">
            <Lock className="w-10 h-10 text-rose-600 " />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 ">
            Accès Restreint
          </h2>
          <p className="text-slate-500  leading-relaxed text-sm">
            La licence d'utilisation de votre établissement <strong>{activeTenant.name}</strong> a expiré depuis le <strong className="text-slate-800 ">{licenseInfo.expirationDateString}</strong>.<br/><br/>
            La période de grâce étant dépassée, l'accès aux modules opérationnels est totalement suspendu.
          </p>
          
          <div className="bg-slate-50  rounded-lg p-6 text-left border border-slate-200 ">
            <h4 className="font-bold text-slate-800  text-sm mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Comment rétablir l'accès ?
            </h4>
            <ul className="text-xs text-slate-500  space-y-2 list-disc pl-4">
              <li>Veuillez renouveler votre abonnement EDU-CONGO pour lever cette restriction.</li>
              <li>Si vous disposez déjà d'un Code d'Activation fourni par l'administration centrale, vous pouvez le saisir ci-dessous.</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onOpenApprovalModal}
              className="px-6 py-3.5 bg-blue-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Accéder au portail de paiement et renouveler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, return the normal content
  return <>{children}</>;
};
