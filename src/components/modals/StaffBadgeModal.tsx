import React from 'react';
import { X, Printer, QrCode, ShieldCheck, Briefcase, Lock, CheckCircle2 } from 'lucide-react';
import { Teacher, StaffMember, SchoolConfig, UserRole } from '../../types';

interface StaffBadgeModalProps {
  person: Teacher | StaffMember | null;
  type: 'teacher' | 'staff';
  schoolConfig: SchoolConfig;
  currentRole: UserRole;
  onClose: () => void;
}

export const StaffBadgeModal: React.FC<StaffBadgeModalProps> = ({
  person,
  type,
  schoolConfig,
  currentRole,
  onClose
}) => {
  if (!person) return null;

  const canPrint = currentRole !== 'parent' && currentRole !== 'eleve';

  const handlePrint = () => {
    if (!canPrint) return;
    window.print();
  };

  const isTeacher = type === 'teacher';
  const teacher = isTeacher ? (person as Teacher) : null;
  const staff = !isTeacher ? (person as StaffMember) : null;

  const roleTitle = isTeacher 
    ? `Enseignant • ${teacher?.specialite || 'Généraliste'}`
    : staff?.roleFonction || 'Personnel Administratif';

  const departement = isTeacher 
    ? 'Corps Professoral & Pédagogique' 
    : staff?.departement || 'Administration & Services Généraux';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-6 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Badge d'Accès Professionnel & Sécurité</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Notice for Parents & Students */}
        {!canPrint && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Consultation Sécurisée : L'impression des badges professionnels d'accès est réservée à la Direction Générale.</span>
          </div>
        )}

        {/* Badge Area */}
        <div className="p-6 flex flex-col items-center justify-center gap-6 bg-slate-100 dark:bg-slate-950/60 print:bg-white print:p-0">
          
          {/* Badge Vertical Lanyard Layout */}
          <div 
            id="printable-staff-badge"
            className="w-full max-w-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 shadow-2xl border-2 border-indigo-600/60 relative overflow-hidden flex flex-col items-center justify-between min-h-[380px]"
          >
            {/* Lanyard Hole Clip */}
            <div className="w-12 h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full border border-slate-400/50 mb-3 shadow-inner" />

            {/* Header Header */}
            <div className="w-full text-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md mb-1.5">
                EC
              </div>
              <h4 className="font-black text-xs tracking-tight text-slate-900 dark:text-white uppercase leading-snug">
                {schoolConfig.name || 'Établissement Scolaire'}
              </h4>
              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold block uppercase tracking-wider mt-0.5">
                Badge d'Accès Sécurisé • {schoolConfig.anneeScolaire || '2026-2027'}
              </span>
            </div>

            {/* Photo & Identity */}
            <div className="flex flex-col items-center my-3 w-full">
              <div className="w-24 h-28 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500 overflow-hidden flex items-center justify-center shadow-md mb-2">
                {person.photoUrl ? (
                  <img 
                    src={person.photoUrl} 
                    alt={person.nom}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{person.nom[0]}{person.prenom[0]}</span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase font-bold">Personnel</span>
                  </div>
                )}
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase text-center leading-tight">
                {person.nom} {person.prenom}
              </h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 text-center mt-0.5">
                {roleTitle}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">
                {departement}
              </span>
            </div>

            {/* Badge Info Grid */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs mb-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Matricule :</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{person.matricule}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Statut :</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{person.statut || 'Permanent'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Contact :</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{person.telephone}</span>
              </div>
            </div>

            {/* Footer QR Code & Security */}
            <div className="w-full border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-7 h-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="text-[8px] text-left">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">ID SÉCURISÉ</span>
                  <span className="text-slate-400 font-mono">CONGO-AUTH</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] text-slate-400 block font-medium">Autorisé par</span>
                <span className="text-[9px] font-bold text-slate-900 dark:text-white">{schoolConfig.directorName || 'Direction'}</span>
              </div>
            </div>

          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
            Badge nominatif et strictement personnel. À porter de manière visible dans l'enceinte de l'établissement.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Badge d'Accès Numérisé Professionnel</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Fermer
            </button>

            {canPrint && (
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimer le Badge
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
