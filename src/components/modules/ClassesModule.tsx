import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  UserCheck, 
  BookOpen, 
  CheckCircle2, 
  School,
  Sparkles
} from 'lucide-react';
import { CourseSchedule } from '../../types';

interface ClassesModuleProps {
  schedules: CourseSchedule[];
  onAddSchedule: (schedule: CourseSchedule) => void;
}

export const ClassesModule: React.FC<ClassesModuleProps> = ({ schedules, onAddSchedule }) => {
  const [selectedClass, setSelectedClass] = useState<string>('Terminale S1');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states
  const [formJour, setFormJour] = useState<CourseSchedule['jour']>('Lundi');
  const [formHeureDebut, setFormHeureDebut] = useState<string>('08:00');
  const [formHeureFin, setFormHeureFin] = useState<string>('10:00');
  const [formMatiere, setFormMatiere] = useState<string>('Mathématiques Approfondies');
  const [formEnseignant, setFormEnseignant] = useState<string>('Prof. Michel KAPEND');
  const [formSalle, setFormSalle] = useState<string>('Salle A-102');

  const days: CourseSchedule['jour'][] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const filteredSchedules = schedules.filter(s => s.classe === selectedClass);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: CourseSchedule = {
      id: `sch-${Date.now()}`,
      jour: formJour,
      heureDebut: formHeureDebut,
      heureFin: formHeureFin,
      matiere: formMatiere,
      enseignant: formEnseignant,
      classe: selectedClass,
      salle: formSalle
    };

    onAddSchedule(newSchedule);
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white  p-4 sm:p-6 rounded-lg border border-[#E4E6EB]  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#1877F2]  font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" /> Module Organisation & Emplois du Temps
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#050505]  mt-1">Gestion des Classes & Horaires de Cours</h2>
          <p className="text-xs text-[#65676B]  mt-1">
            Planification des cours, affectation des salles et répartition intelligente sans conflit horaire.
          </p>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1877F2] hover:bg-[#1877F2] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Planifier un Cours
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white  p-4 rounded-lg border border-[#E4E6EB]  shadow-sm text-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <span className="text-[#65676B]  font-semibold text-center sm:text-left">Sélectionner la classe :</span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {['Terminale S1', '3ème Scientifique', 'CM2 A', 'Grande Section', 'Électricité 1ère Année'].map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : 'bg-[#F0F2F5]  text-[#65676B]  hover:bg-[#F0F2F5] hover:text-[#050505]'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-[#65676B]  font-medium">
          {filteredSchedules.length} séances programmées cette semaine
        </span>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map(day => {
          const dayCourses = filteredSchedules.filter(s => s.jour === day);

          return (
            <div
              key={day}
              className="bg-white  border border-[#E4E6EB]  rounded-lg shadow-sm overflow-hidden flex flex-col transition-colors duration-200"
            >
              <div className="bg-[#F0F2F5]  px-4 py-3 border-b border-[#E4E6EB]  flex items-center justify-between">
                <span className="font-bold text-[#050505]  text-sm">{day}</span>
                <span className="text-[11px] font-semibold text-[#1877F2]  bg-[#E7F3FF]  px-2 py-0.5 rounded-md border border-[#E4E6EB] ">
                  {dayCourses.length} cours
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col gap-2.5">
                {dayCourses.length > 0 ? (
                  dayCourses.map(course => (
                    <div
                      key={course.id}
                      className="bg-[#F0F2F5]/70  border border-[#E4E6EB]  hover:border-[#E4E6EB][#E4E6EB] p-3 rounded-xl flex flex-col gap-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#050505]  text-xs">{course.matiere}</span>
                        <span className="text-[10px] font-mono text-[#1877F2]  font-semibold bg-[#E7F3FF]  px-1.5 py-0.5 rounded border border-[#E4E6EB] ">
                          {course.heureDebut} - {course.heureFin}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#65676B]  pt-1 border-t border-[#E4E6EB] ">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-[#65676B]" />
                          {course.enseignant}
                        </span>
                        <span className="flex items-center gap-1 text-[#050505]  font-medium">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {course.salle}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 flex items-center justify-center text-xs text-[#65676B]  italic">
                    Aucun cours programmé
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white  text-[#050505]  w-full max-w-md rounded-lg border border-[#E4E6EB]  shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#050505]  border-b border-[#E4E6EB]  pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#1877F2] " />
              Planification d'un Nouveau Créneau
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Jour :</label>
                  <select
                    value={formJour}
                    onChange={(e) => setFormJour(e.target.value as any)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Salle de cours :</label>
                  <input
                    type="text"
                    value={formSalle}
                    onChange={(e) => setFormSalle(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Heure de début :</label>
                  <input
                    type="time"
                    value={formHeureDebut}
                    onChange={(e) => setFormHeureDebut(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#050505]  font-semibold mb-1 block">Heure de fin :</label>
                  <input
                    type="time"
                    value={formHeureFin}
                    onChange={(e) => setFormHeureFin(e.target.value)}
                    className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
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

              <div>
                <label className="text-[#050505]  font-semibold mb-1 block">Enseignant titulaire :</label>
                <input
                  type="text"
                  value={formEnseignant}
                  onChange={(e) => setFormEnseignant(e.target.value)}
                  className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  text-[#050505]  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E6EB] ">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#F0F2F5]  hover:bg-[#F0F2F5] text-[#050505]  rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Ajouter à l'Emploi du Temps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
