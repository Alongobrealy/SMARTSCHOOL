import React from 'react';
import { X, Printer, QrCode, ShieldCheck, School, Lock } from 'lucide-react';
import { Student, SchoolConfig, UserRole } from '../../types';

interface StudentCardModalProps {
  student: Student | null;
  schoolConfig: SchoolConfig;
  currentRole: UserRole;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
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

  const getCycleLabel = () => {
    if (student.cycle === 'maternelle') return 'Cycle Maternel';
    if (student.cycle === 'primaire') return 'Cycle Primaire';
    if (student.cycle === 'college') return 'Cycle Secondaire 1er Degré (Collège)';
    if (student.cycle === 'lycee') return 'Cycle Secondaire 2nd Degré (Lycée)';
    if (student.cycle === 'formation_pro') return 'Formation Professionnelle & Métiers';
    return 'Enseignement Général';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-6 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Carte d'Identité Scolaire Officielle</h3>
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
            <span>Mode Consultation Sécurisée : L'impression et la délivrance de la carte plastique officielle sont exclusivement réservées à l'administration de l'établissement.</span>
          </div>
        )}

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center justify-center gap-6 bg-slate-100 dark:bg-slate-950/60 print:bg-white print:p-0">
          
          {/* Card Container (Standard ID-1 Format Styled for Web & Print) */}
          <div 
            id="printable-student-card"
            className="w-full max-w-md bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-5 shadow-xl border-2 border-indigo-500/40 relative overflow-hidden flex flex-col justify-between min-h-[260px]"
          >
            {/* Background Graphic Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Bar of Card: National Header & School Brand */}
            <div className="border-b border-indigo-800/80 pb-2.5 flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md border border-white/20">
                  EC
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight text-white leading-tight uppercase">
                    {schoolConfig.name || 'Établissement Scolaire'}
                  </h4>
                  <p className="text-[10px] text-indigo-300 font-medium">
                    Rép. du Congo • {schoolConfig.city || 'Brazzaville'} • {schoolConfig.agrementNumber || 'MEPPSA'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {schoolConfig.anneeScolaire || '2026-2027'}
                </span>
              </div>
            </div>

            {/* Card Middle: Photo + Student Info */}
            <div className="grid grid-cols-12 gap-3.5 my-3 items-center relative z-10">
              
              {/* Photo */}
              <div className="col-span-4 flex flex-col items-center">
                <div className="w-20 h-24 rounded-xl bg-slate-800 border-2 border-indigo-400/60 overflow-hidden flex items-center justify-center shadow-md">
                  {student.photoUrl ? (
                    <img 
                      src={student.photoUrl} 
                      alt={student.nom}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <span className="text-2xl font-black text-indigo-300">{student.nom[0]}{student.prenom[0]}</span>
                      <span className="text-[8px] text-slate-400 mt-1 uppercase font-bold">Photo Élève</span>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-indigo-300 mt-1 font-bold">{student.matricule}</span>
              </div>

              {/* Identity Details */}
              <div className="col-span-8 flex flex-col gap-1 text-xs">
                <div>
                  <span className="text-[9px] uppercase text-indigo-300 font-semibold block">Nom & Prénom</span>
                  <p className="font-extrabold text-white text-sm leading-tight uppercase">
                    {student.nom} <span className="capitalize text-indigo-200">{student.prenom}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div>
                    <span className="text-[9px] uppercase text-indigo-300 font-semibold block">Classe</span>
                    <p className="font-bold text-emerald-400 text-xs">{student.classe}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-indigo-300 font-semibold block">Genre</span>
                    <p className="font-bold text-white text-xs">{student.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div>
                    <span className="text-[9px] uppercase text-indigo-300 font-semibold block">Né(e) le</span>
                    <p className="font-semibold text-white text-[11px]">{student.dateNaissance || '01/01/2012'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-indigo-300 font-semibold block">Cycle</span>
                    <p className="font-semibold text-indigo-200 text-[10px] truncate">{getCycleLabel()}</p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-indigo-800/60">
                  <span className="text-[8px] text-slate-300 block">Tuteur : <strong>{student.nomParent}</strong> ({student.telephoneParent})</span>
                </div>
              </div>
            </div>

            {/* Card Footer: QR Code Security Seal & Authority Signature */}
            <div className="border-t border-indigo-800/80 pt-2 flex items-center justify-between text-[9px] relative z-10 text-slate-300">
              <div className="flex items-center gap-1.5 font-mono text-[9px]">
                <QrCode className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-emerald-300 font-bold block">CARTE SCOLAIRE CERTIFIÉE</span>
                  <span className="text-[8px] text-slate-400 font-mono">ID: {student.id.slice(0, 10)}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[8px] font-bold text-indigo-200">{schoolConfig.directorSignatureTitle || 'Le Chef d\'Établissement'}</p>
                <p className="text-[9px] font-extrabold text-white">{schoolConfig.directorName || 'La Direction'}</p>
              </div>
            </div>

          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 max-w-md">
            <span>Présentez cette carte lors des contrôles d'accès, des examens officiels et de l'émargement en classe.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Format Carte Standardisée MEPPSA Congo</span>
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
                Imprimer la Carte Scolaire
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
