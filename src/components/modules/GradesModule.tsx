import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Award, 
  Printer, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Student, GradeEntry } from '../../types';
import { ReportCardModal } from '../modals/ReportCardModal';

interface GradesModuleProps {
  students: Student[];
  grades: GradeEntry[];
  onAddGrade: (grade: GradeEntry) => void;
  onUpdateGrade: (grade: GradeEntry) => void;
}

export const GradesModule: React.FC<GradesModuleProps> = ({
  students,
  grades,
  onAddGrade,
  onUpdateGrade
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Terminale S1');
  const [selectedSemestre, setSelectedSemestre] = useState<string>('Semestre 1');
  const [activeTab, setActiveTab] = useState<'saisie' | 'bulletins'>('saisie');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  // New Grade Form Modal State
  const [showAddGradeModal, setShowAddGradeModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [formMatiere, setFormMatiere] = useState<string>('Mathématiques');
  const [formDevoir, setFormDevoir] = useState<string>('15');
  const [formExamen, setFormExamen] = useState<string>('16');
  const [formCoef, setFormCoef] = useState<string>('4');
  const [formAppreciation, setFormAppreciation] = useState<string>('Très bon travail et assiduité remarquable.');

  const classStudents = students.filter(s => s.classe === selectedClass);

  // Compute student averages
  const studentsWithStats = classStudents.map(student => {
    const studentGrades = grades.filter(
      g => (g.studentId === student.id || g.studentName === `${student.nom} ${student.prenom}`) &&
           g.semestre === selectedSemestre
    );

    let totalPoints = 0;
    let totalCoef = 0;

    studentGrades.forEach(g => {
      const weightedNote = (g.noteDevoir * 0.4) + (g.noteExamen * 0.6);
      totalPoints += weightedNote * g.coefficient;
      totalCoef += g.coefficient;
    });

    const average = totalCoef > 0 ? (totalPoints / totalCoef) : 0;
    return {
      student,
      gradesCount: studentGrades.length,
      average: parseFloat(average.toFixed(2)),
      grades: studentGrades
    };
  }).sort((a, b) => b.average - a.average);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    const newGrade: GradeEntry = {
      id: `grd-${Date.now()}`,
      studentId: st.id,
      studentName: `${st.nom} ${st.prenom}`,
      classe: st.classe,
      matiere: formMatiere,
      semestre: selectedSemestre as any,
      noteDevoir: parseFloat(formDevoir) || 0,
      noteExamen: parseFloat(formExamen) || 0,
      coefficient: parseInt(formCoef, 10) || 1,
      appreciation: formAppreciation
    };

    onAddGrade(newGrade);
    setShowAddGradeModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white  p-4 sm:p-6 rounded-lg border border-[#E4E6EB]  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#1877F2]  font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Module Pédagogique & Évaluations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#050505]  mt-1">Saisie des Notes & Bulletins Officiels</h2>
          <p className="text-xs text-[#65676B]  mt-1">
            Calcul automatique des coefficients, moyennes pondérées, rangs et génération de bulletins instantanés.
          </p>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto">
          <button
            onClick={() => {
              if (classStudents.length > 0) setSelectedStudentId(classStudents[0].id);
              setShowAddGradeModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1877F2] hover:bg-[#1877F2] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Saisir une Note
          </button>
        </div>
      </div>

      {/* Filter and Tab Selectors */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white  p-4 sm:p-5 rounded-lg border border-[#E4E6EB]  shadow-sm text-xs transition-colors duration-200">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <button
            onClick={() => setActiveTab('saisie')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              activeTab === 'saisie'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
            }`}
          >
            Grille des Notes
          </button>
          <button
            onClick={() => setActiveTab('bulletins')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-xs ${
              activeTab === 'bulletins'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-[#F0F2F5]  text-[#65676B]  hover:text-[#050505] hover:bg-[#F0F2F5]'
            }`}
          >
            Bulletins & Rangs
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-semibold"
          >
            <option value="Terminale S1">Terminale D (Lycée)</option>
            <option value="3ème Scientifique">3ème A (Collège)</option>
            <option value="CM2 A">CM2 A (Primaire)</option>
            <option value="Grande Section">Grande Section (Maternelle)</option>
            <option value="Électricité 1ère Année">Électricité 1ère Année (Formation Pro)</option>
          </select>

          <select
            value={selectedSemestre}
            onChange={(e) => setSelectedSemestre(e.target.value)}
            className="bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-semibold"
          >
            <option value="Trimestre 1">1er Trimestre</option>
            <option value="Trimestre 2">2ème Trimestre</option>
            <option value="Trimestre 3">3ème Trimestre</option>
            <option value="Semestre 1">1er Semestre</option>
            <option value="Semestre 2">2ème Semestre</option>
          </select>
        </div>
      </div>

      {/* Main Content View */}
      {activeTab === 'saisie' ? (
        <div className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
          <div className="px-6 py-4 border-b border-[#E4E6EB]  flex items-center justify-between">
            <h3 className="font-bold text-[#050505]  text-sm">
              Relevé des évaluations : {selectedClass} ({selectedSemestre})
            </h3>
            <span className="text-xs text-[#65676B]  font-medium">
              {grades.length} notes enregistrées au total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F0F2F5]  text-[#65676B]  font-bold uppercase tracking-wider border-b border-[#E4E6EB]  text-[11px]">
                  <th className="p-3.5 sm:px-6">Élève / Étudiant</th>
                  <th className="p-3.5">Matière</th>
                  <th className="p-3.5 text-center">Devoir /20</th>
                  <th className="p-3.5 text-center">Examen /20</th>
                  <th className="p-3.5 text-center">Coef</th>
                  <th className="p-3.5 text-center">Moyenne</th>
                  <th className="p-3.5">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100  text-[#050505] ">
                {grades
                  .filter(g => g.classe === selectedClass && g.semestre === selectedSemestre)
                  .map((grade) => {
                    const avg = ((grade.noteDevoir * 0.4) + (grade.noteExamen * 0.6)).toFixed(1);
                    return (
                      <tr key={grade.id} className="hover:bg-[#F0F2F5]/70 transition-colors">
                        <td className="p-3.5 sm:px-6 font-bold text-[#050505] ">{grade.studentName}</td>
                        <td className="p-3.5 text-[#1877F2]  font-semibold">{grade.matiere}</td>
                        <td className="p-3.5 text-center font-mono text-[#050505] ">{grade.noteDevoir.toFixed(1)}</td>
                        <td className="p-3.5 text-center font-mono text-[#050505] ">{grade.noteExamen.toFixed(1)}</td>
                        <td className="p-3.5 text-center font-bold text-[#65676B] ">{grade.coefficient}</td>
                        <td className="p-3.5 text-center font-bold text-[#1877F2]  bg-[#E7F3FF] ">{avg} /20</td>
                        <td className="p-3.5 text-[#65676B]  italic text-[11px]">{grade.appreciation}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bulletins & Rankings View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsWithStats.map((item, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={item.student.id}
                className="bg-white  border border-[#E4E6EB]  hover:border-[#E4E6EB][#E4E6EB] shadow-sm p-6 rounded-lg transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB]  flex items-center justify-center font-bold text-sm">
                      #{rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#050505]  text-sm">{item.student.nom} {item.student.prenom}</h4>
                      <p className="text-[11px] text-[#65676B] ">{item.student.matricule}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    item.average >= 16 ? 'bg-[#E7F3FF]  text-[#1877F2]  border-[#E4E6EB] ' :
                    item.average >= 12 ? 'bg-[#E7F3FF]  text-[#1877F2]  border-[#E4E6EB] ' :
                    'bg-amber-50  text-amber-700  border-amber-200 '
                  }`}>
                    {item.average.toFixed(2)} /20
                  </span>
                </div>

                <div className="text-xs text-[#65676B]  flex items-center justify-between bg-[#F0F2F5]  p-3 rounded-xl border border-[#E4E6EB] ">
                  <span>Matières : <strong>{item.gradesCount}</strong></span>
                  <span>Classement : <strong className="text-[#050505] ">{rank}e / {studentsWithStats.length}</strong></span>
                </div>

                <button
                  onClick={() => setSelectedStudentForReport(item.student)}
                  className="w-full bg-[#1877F2] hover:bg-[#1877F2] text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Générer le Bulletin Officiel
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Grade Modal */}
      {showAddGradeModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white  text-[#050505]  w-full max-w-md rounded-lg border border-[#E4E6EB]  shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#050505]  border-b border-[#E4E6EB]  pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#1877F2] " />
              Saisie d'une Nouvelle Note
            </h3>

            <form onSubmit={handleSaveGrade} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Sélectionner l'Élève :</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  required
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.nom} {st.prenom} ({st.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Matière / Cours :</label>
                <input
                  type="text"
                  value={formMatiere}
                  onChange={(e) => setFormMatiere(e.target.value)}
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Devoir (/20) :</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={formDevoir}
                    onChange={(e) => setFormDevoir(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Examen (/20) :</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={formExamen}
                    onChange={(e) => setFormExamen(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Coef :</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formCoef}
                    onChange={(e) => setFormCoef(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Appréciation Pédagogique :</label>
                <textarea
                  rows={2}
                  value={formAppreciation}
                  onChange={(e) => setFormAppreciation(e.target.value)}
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E6EB] ">
                <button
                  type="button"
                  onClick={() => setShowAddGradeModal(false)}
                  className="px-4 py-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Enregistrer la Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Card Modal */}
      {selectedStudentForReport && (
        <ReportCardModal
          student={selectedStudentForReport}
          grades={grades}
          onClose={() => setSelectedStudentForReport(null)}
        />
      )}

    </div>
  );
};
