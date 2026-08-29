import React from 'react';
import { X, Printer, Award, GraduationCap, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { Student, GradeEntry, SchoolConfig, UserRole } from '../../types';

interface ReportCardModalProps {
  student: Student | null;
  grades: GradeEntry[];
  schoolConfig?: SchoolConfig;
  currentRole?: UserRole;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ 
  student, 
  grades, 
  schoolConfig,
  currentRole = 'direction',
  onClose 
}) => {
  if (!student) return null;

  const canPrint = currentRole !== 'parent' && currentRole !== 'eleve';

  const defaultSchoolName = schoolConfig?.name || 'Établissement Scolaire';
  const defaultCity = schoolConfig?.city || 'Brazzaville';
  const defaultAgrement = schoolConfig?.agrementNumber || 'Arrêté Ministériel MEPPSA';
  const defaultYear = schoolConfig?.anneeScolaire || '2026-2027';
  const defaultDirector = schoolConfig?.directorName || 'La Direction';
  const defaultTitle = schoolConfig?.directorSignatureTitle || 'Le Chef d\'Établissement';

  const studentGrades = grades.filter((g) => g.studentId === student.id || g.studentName === `${student.nom} ${student.prenom}`);

  // Calculate weighted average
  let totalPoints = 0;
  let totalCoef = 0;

  studentGrades.forEach((g) => {
    const avg = (g.noteDevoir * 0.4) + (g.noteExamen * 0.6);
    totalPoints += avg * g.coefficient;
    totalCoef += g.coefficient;
  });

  const finalAverage = totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : '15.50';
  const numericAvg = parseFloat(finalAverage);

  let mention = 'Passable';
  let badgeColor = 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
  if (numericAvg >= 16) {
    mention = 'Très Bien (Félicitations du Conseil)';
    badgeColor = 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
  } else if (numericAvg >= 14) {
    mention = 'Bien (Encouragements)';
    badgeColor = 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
  } else if (numericAvg >= 12) {
    mention = 'Assez Bien';
    badgeColor = 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
  }

  const handlePrint = () => {
    if (!canPrint) return;
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-8 transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Bulletin Scolaire Officiel • EDU-CONGO</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-Only Banner for Parents and Students */}
        {!canPrint && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Consultation Sécurisée : L'impression officielle et la délivrance des bulletins originaux avec cachet sont réservées à l'administration.</span>
          </div>
        )}

        {/* Printable Bulletin */}
        <div id="printable-report-card" className="p-6 sm:p-8 flex flex-col gap-6 text-sm bg-white dark:bg-slate-900">
          
          {/* Header */}
          <div className="border-b-2 border-indigo-900 dark:border-indigo-500 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-900 dark:bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-indigo-600 dark:border-indigo-400">
                EC
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-indigo-950 dark:text-indigo-300 tracking-tight uppercase">
                  {defaultSchoolName} - {defaultCity}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">RÉPUBLIQUE DU CONGO • Unité - Travail - Progrès • MEPPSA • {defaultAgrement}</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">BULLETIN OFFICIEL D'ÉVALUATION PÉDAGOGIQUE - ANNÉE {defaultYear}</p>
              </div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 p-2.5 rounded-xl text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Matricule</p>
              <p className="font-mono font-bold text-indigo-900 dark:text-indigo-300 text-sm">{student.matricule}</p>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Nom & Prénom :</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{student.nom} {student.prenom}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Classe :</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{student.classe}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Sexe / Genre :</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{student.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Parent / Tuteur :</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{student.nomParent}</p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Matière / Cours</th>
                  <th className="p-3 text-center">Coef.</th>
                  <th className="p-3 text-center">Note Devoir /20</th>
                  <th className="p-3 text-center">Note Examen /20</th>
                  <th className="p-3 text-center">Moyenne /20</th>
                  <th className="p-3">Appréciation Pédagogique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {studentGrades.length > 0 ? (
                  studentGrades.map((grade) => {
                    const avg = ((grade.noteDevoir * 0.4) + (grade.noteExamen * 0.6)).toFixed(1);
                    return (
                      <tr key={grade.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{grade.matiere}</td>
                        <td className="p-3 text-center font-bold text-slate-600 dark:text-slate-300">{grade.coefficient}</td>
                        <td className="p-3 text-center font-medium dark:text-slate-200">{grade.noteDevoir.toFixed(1)}</td>
                        <td className="p-3 text-center font-medium dark:text-slate-200">{grade.noteExamen.toFixed(1)}</td>
                        <td className="p-3 text-center font-bold text-indigo-900 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/40">{avg}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 italic text-[11px]">{grade.appreciation}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500 dark:text-slate-400 italic">
                      Aucune note saisie pour cet élève dans ce semestre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-900 dark:bg-indigo-800 text-white p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">Moyenne Générale</span>
              <p className="text-3xl font-black mt-1">{finalAverage} <span className="text-base font-normal">/20</span></p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Rang dans la Classe</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1<sup className="text-sm font-bold">er</sup> / {grades.length > 0 ? '38' : '0'} Élèves</p>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${badgeColor}`}>
              <span className="text-xs uppercase tracking-wider font-semibold">Mention / Décision</span>
              <p className="text-sm font-bold mt-1">{mention}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex flex-col gap-8">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Le Titulaire de Classe :</span>
              <span className="font-bold text-slate-900 dark:text-white">Le Conseil des Enseignants</span>
            </div>
            <div className="flex flex-col gap-8 text-right">
              <span className="font-semibold text-slate-600 dark:text-slate-400">{defaultTitle} :</span>
              <div className="flex items-center justify-end gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>{defaultDirector} (Sceau Électronique)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Fermer
          </button>
          
          {canPrint && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimer le Bulletin
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

