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
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-6 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Certificat de Scolarité Officiel</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Warning for Parents & Students */}
        {!canPrint && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Consultation Sécurisée : L'impression et la signature du certificat de scolarité original sont délivrées au secrétariat de l'école.</span>
          </div>
        )}

        {/* Official Printable Certificate Document */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 flex flex-col gap-6 print:p-0 print:m-0" id="printable-certificate">
          
          {/* Top National Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div className="text-left max-w-xs">
              <h4 className="font-extrabold text-xs uppercase text-slate-900">
                {schoolConfig.attribution || 'COMPLEXE SCOLAIRE'}
              </h4>
              <h2 className="font-black text-base text-indigo-950 uppercase tracking-tight">
                {schoolConfig.name || 'ÉTABLISSEMENT SCOLAIRE'}
              </h2>
              <p className="text-[10px] text-slate-600 font-medium mt-0.5">
                {schoolConfig.address} • {schoolConfig.commune}
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                Tél : {schoolConfig.phone} • Email : {schoolConfig.email}
              </p>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                {schoolConfig.agrementNumber || 'Agrément Ministériel MEPPSA'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-950 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-indigo-700">
                EC
              </div>
              <span className="text-[9px] text-slate-500 font-semibold block mt-1">SCEAU OFFICIEL</span>
            </div>

            <div className="text-right max-w-xs">
              <h4 className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">
                RÉPUBLIQUE DU CONGO
              </h4>
              <p className="text-[10px] italic text-slate-600 font-serif">
                Unité - Travail - Progrès
              </p>
              <div className="h-0.5 w-16 bg-slate-400 ml-auto my-1" />
              <p className="text-[10px] font-bold text-slate-800 uppercase">
                MINISTÈRE DE L'ENSEIGNEMENT PRÉSCOLAIRE, PRIMAIRE, SECONDAIRE ET DE L'ALPHABÉTISATION
              </p>
              <p className="text-[9px] font-medium text-slate-600">
                Direction Départementale de {schoolConfig.department || 'Brazzaville'}
              </p>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-4">
            <span className="text-[11px] font-mono text-slate-500 tracking-widest block uppercase">
              RÉFÉRENCE : CERT/{schoolConfig.city?.toUpperCase().slice(0, 3) || 'BZV'}/{new Date().getFullYear()}/{student.matricule}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 inline-block px-6 pb-1 mt-1">
              CERTIFICAT DE SCOLARITÉ
            </h1>
            <p className="text-xs font-bold text-indigo-900 mt-2 uppercase tracking-wide">
              ANNÉE SCOLAIRE {schoolConfig.anneeScolaire || '2026 - 2027'}
            </p>
          </div>

          {/* Body Content */}
          <div className="flex flex-col gap-4 text-sm sm:text-base leading-relaxed text-slate-800 px-4 sm:px-8">
            <p>
              Je soussigné(e), <strong className="uppercase text-slate-900 font-bold">{schoolConfig.directorName || 'Le Chef d\'Établissement'}</strong>, {schoolConfig.directorTitle || 'Directeur Général'} du <strong>{schoolConfig.name || 'Complexe Scolaire'}</strong>, certifie par la présente que :
            </p>

            {/* Student Information Box */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 my-2 space-y-2 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">L'élève (Nom & Prénom) :</span>
                  <p className="text-base font-black text-slate-950 uppercase">{student.nom} {student.prenom}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Numéro Matricule :</span>
                  <p className="text-sm font-mono font-bold text-indigo-950">{student.matricule}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Date de Naissance :</span>
                  <p className="font-bold text-slate-900">{student.dateNaissance || 'Non renseignée'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Sexe :</span>
                  <p className="font-bold text-slate-900">{student.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold block">Classe Fréquentée :</span>
                  <p className="font-black text-indigo-900">{student.classe}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-semibold block">Parent / Responsable Légal :</span>
                <p className="font-bold text-slate-900">{student.nomParent} ({student.telephoneParent})</p>
              </div>
            </div>

            <p>
              Est régulièrement inscrit(e) et poursuit assidûment ses études au sein de notre établissement pour l'année scolaire <strong>{schoolConfig.anneeScolaire || '2026 - 2027'}</strong>, conformément aux règlements et programmes officiels de la République du Congo.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 italic">
              En foi de quoi, le présent certificat lui est délivré sur sa demande pour servir et valoir ce que de droit auprès de toutes administrations, organismes sociaux ou concours.
            </p>
          </div>

          {/* Footer & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 px-4 sm:px-8 items-end">
            <div className="text-left space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase block">Vérification & Registre</span>
              <p className="text-xs font-mono text-slate-700">Archivé au registre matricule</p>
              <div className="w-20 h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[9px] text-slate-400 text-center p-1">
                Cachet Secrétariat
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs text-slate-700 font-semibold">
                Fait à {schoolConfig.city || 'Brazzaville'}, le {currentDate}
              </p>
              <p className="text-xs font-bold text-slate-900 uppercase">
                {schoolConfig.directorSignatureTitle || 'Le Chef d\'Établissement'}
              </p>
              <p className="text-sm font-black text-indigo-950 uppercase pt-8">
                {schoolConfig.directorName || 'La Direction'}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Controls */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Document Administratif Authentifié MEPPSA</span>
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
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
