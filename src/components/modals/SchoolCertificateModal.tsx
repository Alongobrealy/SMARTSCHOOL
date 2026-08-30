import React from 'react';
import { X, Printer, FileCheck, ShieldCheck, School, Lock, Award } from 'lucide-react';
import { Student, SchoolConfig, UserRole } from '../../types';

interface SchoolCertificateModalProps {
  student: Student | null;
  schoolConfig: SchoolConfig;
  currentRole: UserRole;
  onClose: () => void;
}

export const SchoolCertificateModal: React.FC<SchoolCertificateModalProps> = ({
  student,
  schoolConfig,
  currentRole,
  onClose
}) => {
  if (!student) return null;

  const canPrint = currentRole !== 'parent' && currentRole !== 'eleve';

  const handlePrint = () => {
    if (!canPrint) return;
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white  text-[#050505]  w-full max-w-3xl rounded-lg shadow-2xl border border-[#E4E6EB]  overflow-hidden flex flex-col my-6 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-white  text-white px-6 py-4 flex items-center justify-between border-b border-[#E4E6EB]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#1877F2]" />
            <h3 className="font-bold text-base">Certificat de Scolarité Officiel</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white text-[#65676B] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Warning for Parents & Students */}
        {!canPrint && (
          <div className="bg-amber-50  border-b border-amber-200  px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-amber-800 ">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Consultation Sécurisée : L'impression et la signature du certificat de scolarité original sont délivrées au secrétariat de l'école.</span>
          </div>
        )}

        {/* Official Printable Certificate Document */}
        <div className="p-6 sm:p-10 bg-white text-[#050505] flex flex-col gap-6 print:p-0 print:m-0" id="printable-certificate">
          
          {/* Top National Header */}
          <div className="flex justify-between items-start border-b-2 border-[#E4E6EB] pb-4">
            <div className="text-left max-w-xs">
              <h4 className="font-extrabold text-xs uppercase text-[#050505]">
                {schoolConfig.attribution || 'COMPLEXE SCOLAIRE'}
              </h4>
              <h2 className="font-black text-base text-[#1877F2] uppercase tracking-tight">
                {schoolConfig.name || 'ÉTABLISSEMENT SCOLAIRE'}
              </h2>
              <p className="text-[10px] text-[#65676B] font-medium mt-0.5">
                {schoolConfig.address} • {schoolConfig.commune}
              </p>
              <p className="text-[10px] text-[#65676B] font-medium">
                Tél : {schoolConfig.phone} • Email : {schoolConfig.email}
              </p>
              <p className="text-[9px] text-[#65676B] font-bold uppercase mt-1">
                {schoolConfig.agrementNumber || 'Agrément Ministériel MEPPSA'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-lg bg-indigo-950 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-[#E4E6EB]">
                EC
              </div>
              <span className="text-[9px] text-[#65676B] font-semibold block mt-1">SCEAU OFFICIEL</span>
            </div>

            <div className="text-right max-w-xs">
              <h4 className="font-extrabold text-xs uppercase text-[#050505] tracking-wider">
                RÉPUBLIQUE DU CONGO
              </h4>
              <p className="text-[10px] italic text-[#65676B] font-serif">
                Unité - Travail - Progrès
              </p>
              <div className="h-0.5 w-16 bg-[#F0F2F5] ml-auto my-1" />
              <p className="text-[10px] font-bold text-[#050505] uppercase">
                MINISTÈRE DE L'ENSEIGNEMENT PRÉSCOLAIRE, PRIMAIRE, SECONDAIRE ET DE L'ALPHABÉTISATION
              </p>
              <p className="text-[9px] font-medium text-[#65676B]">
                Direction Départementale de {schoolConfig.department || 'Brazzaville'}
              </p>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-4">
            <span className="text-[11px] font-mono text-[#65676B] tracking-widest block uppercase">
              RÉFÉRENCE : CERT/{schoolConfig.city?.toUpperCase().slice(0, 3) || 'BZV'}/{new Date().getFullYear()}/{student.matricule}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#050505] border-b-2 border-[#E4E6EB] inline-block px-6 pb-1 mt-1">
              CERTIFICAT DE SCOLARITÉ
            </h1>
            <p className="text-xs font-bold text-[#1877F2] mt-2 uppercase tracking-wide">
              ANNÉE SCOLAIRE {schoolConfig.anneeScolaire || '2026 - 2027'}
            </p>
          </div>

          {/* Body Content */}
          <div className="flex flex-col gap-4 text-sm sm:text-base leading-relaxed text-[#050505] px-4 sm:px-8">
            <p>
              Je soussigné(e), <strong className="uppercase text-[#050505] font-bold">{schoolConfig.directorName || 'Le Chef d\'Établissement'}</strong>, {schoolConfig.directorTitle || 'Directeur Général'} du <strong>{schoolConfig.name || 'Complexe Scolaire'}</strong>, certifie par la présente que :
            </p>

            {/* Student Information Box */}
            <div className="bg-[#F0F2F5] border border-[#E4E6EB] rounded-xl p-5 my-2 space-y-2 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-[#65676B] uppercase font-semibold block">L'élève (Nom & Prénom) :</span>
                  <p className="text-base font-black text-slate-950 uppercase">{student.nom} {student.prenom}</p>
                </div>
                <div>
                  <span className="text-xs text-[#65676B] uppercase font-semibold block">Numéro Matricule :</span>
                  <p className="text-sm font-mono font-bold text-[#1877F2]">{student.matricule}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E4E6EB]">
                <div>
                  <span className="text-xs text-[#65676B] uppercase font-semibold block">Date de Naissance :</span>
                  <p className="font-bold text-[#050505]">{student.dateNaissance || 'Non renseignée'}</p>
                </div>
                <div>
                  <span className="text-xs text-[#65676B] uppercase font-semibold block">Sexe :</span>
                  <p className="font-bold text-[#050505]">{student.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div>
                  <span className="text-xs text-[#65676B] uppercase font-semibold block">Classe Fréquentée :</span>
                  <p className="font-black text-[#1877F2]">{student.classe}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E4E6EB]">
                <span className="text-xs text-[#65676B] uppercase font-semibold block">Parent / Responsable Légal :</span>
                <p className="font-bold text-[#050505]">{student.nomParent} ({student.telephoneParent})</p>
              </div>
            </div>

            <p>
              Est régulièrement inscrit(e) et poursuit assidûment ses études au sein de notre établissement pour l'année scolaire <strong>{schoolConfig.anneeScolaire || '2026 - 2027'}</strong>, conformément aux règlements et programmes officiels de la République du Congo.
            </p>

            <p className="text-xs sm:text-sm text-[#65676B] italic">
              En foi de quoi, le présent certificat lui est délivré sur sa demande pour servir et valoir ce que de droit auprès de toutes administrations, organismes sociaux ou concours.
            </p>
          </div>

          {/* Footer & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-[#E4E6EB] px-4 sm:px-8 items-end">
            <div className="text-left space-y-1">
              <span className="text-xs text-[#65676B] font-bold uppercase block">Vérification & Registre</span>
              <p className="text-xs font-mono text-[#050505]">Archivé au registre matricule</p>
              <div className="w-20 h-20 border border-dashed border-[#E4E6EB] rounded-lg flex items-center justify-center text-[9px] text-[#65676B] text-center p-1">
                Cachet Secrétariat
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs text-[#050505] font-semibold">
                Fait à {schoolConfig.city || 'Brazzaville'}, le {currentDate}
              </p>
              <p className="text-xs font-bold text-[#050505] uppercase">
                {schoolConfig.directorSignatureTitle || 'Le Chef d\'Établissement'}
              </p>
              <p className="text-sm font-black text-[#1877F2] uppercase pt-8">
                {schoolConfig.directorName || 'La Direction'}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Controls */}
        <div className="bg-[#F0F2F5]  px-6 py-4 border-t border-[#E4E6EB]  flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#65676B]  font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1877F2] " />
            <span>Document Administratif Authentifié MEPPSA</span>
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
                Imprimer le Certificat
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
