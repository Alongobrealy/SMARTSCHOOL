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
      <div className="bg-white  text-[#050505]  w-full max-w-2xl rounded-lg shadow-2xl border border-[#E4E6EB]  overflow-hidden flex flex-col my-6 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-white  text-white px-6 py-4 flex items-center justify-between border-b border-[#E4E6EB]">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#1877F2]" />
            <h3 className="font-bold text-base">Badge d'Accès Professionnel & Sécurité</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white text-[#65676B] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Notice for Parents & Students */}
        {!canPrint && (
          <div className="bg-amber-50  border-b border-amber-200  px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-amber-800 ">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Consultation Sécurisée : L'impression des badges professionnels d'accès est réservée à la Direction Générale.</span>
          </div>
        )}

        {/* Badge Area */}
        <div className="p-6 flex flex-col items-center justify-center gap-6 bg-[#F0F2F5]  print:bg-white print:p-0">
          
          {/* Badge Vertical Lanyard Layout */}
          <div 
            id="printable-staff-badge"
            className="w-full max-w-xs bg-white  text-[#050505]  rounded-lg p-5 shadow-2xl border-2 border-[#E4E6EB] relative overflow-hidden flex flex-col items-center justify-between min-h-[380px]"
          >
            {/* Lanyard Hole Clip */}
            <div className="w-12 h-2.5 bg-[#F0F2F5]  rounded-lg border border-[#E4E6EB] mb-3 shadow-inner" />

            {/* Header Header */}
            <div className="w-full text-center border-b border-[#E4E6EB]  pb-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#1877F2] flex items-center justify-center font-black text-white text-xs shadow-md mb-1.5">
                EC
              </div>
              <h4 className="font-black text-xs tracking-tight text-[#050505]  uppercase leading-snug">
                {schoolConfig.name || 'Établissement Scolaire'}
              </h4>
              <span className="text-[9px] text-[#1877F2]  font-semibold block uppercase tracking-wider mt-0.5">
                Badge d'Accès Sécurisé • {schoolConfig.anneeScolaire || '2026-2027'}
              </span>
            </div>

            {/* Photo & Identity */}
            <div className="flex flex-col items-center my-3 w-full">
              <div className="w-24 h-28 rounded-xl bg-[#F0F2F5]  border-2 border-[#E4E6EB] overflow-hidden flex items-center justify-center shadow-md mb-2">
                {person.photoUrl ? (
                  <img 
                    src={person.photoUrl} 
                    alt={person.nom}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-3xl font-black text-[#1877F2] ">{person.nom[0]}{person.prenom[0]}</span>
                    <span className="text-[8px] text-[#65676B] mt-1 uppercase font-bold">Personnel</span>
                  </div>
                )}
              </div>

              <h3 className="font-extrabold text-sm text-[#050505]  uppercase text-center leading-tight">
                {person.nom} {person.prenom}
              </h3>
              <p className="text-xs font-bold text-[#1877F2]  text-center mt-0.5">
                {roleTitle}
              </p>
              <span className="text-[10px] text-[#65676B]  text-center font-medium">
                {departement}
              </span>
            </div>

            {/* Badge Info Grid */}
            <div className="w-full bg-[#F0F2F5]  p-2.5 rounded-xl border border-[#E4E6EB]  text-xs mb-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#65676B]  font-medium">Matricule :</span>
                <span className="font-mono font-bold text-[#050505] ">{person.matricule}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-[#65676B]  font-medium">Statut :</span>
                <span className="font-semibold text-[#1877F2] ">{person.statut || 'Permanent'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-[#65676B]  font-medium">Contact :</span>
                <span className="font-mono font-medium text-[#050505] ">{person.telephone}</span>
              </div>
            </div>

            {/* Footer QR Code & Security */}
            <div className="w-full border-t border-[#E4E6EB]  pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-7 h-7 text-[#1877F2]  shrink-0" />
                <div className="text-[8px] text-left">
                  <span className="font-bold text-[#050505]  block">ID SÉCURISÉ</span>
                  <span className="text-[#65676B] font-mono">CONGO-AUTH</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] text-[#65676B] block font-medium">Autorisé par</span>
                <span className="text-[9px] font-bold text-[#050505] ">{schoolConfig.directorName || 'Direction'}</span>
              </div>
            </div>

          </div>

          <p className="text-xs text-[#65676B]  text-center max-w-xs">
            Badge nominatif et strictement personnel. À porter de manière visible dans l'enceinte de l'établissement.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#F0F2F5]  px-6 py-4 border-t border-[#E4E6EB]  flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#65676B]  font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1877F2] " />
            <span>Badge d'Accès Numérisé Professionnel</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#050505]  hover:bg-[#F0F2F5] transition-colors cursor-pointer"
            >
              Fermer
            </button>

            {canPrint && (
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1877F2] hover:bg-[#1877F2] text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
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
