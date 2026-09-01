import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Search, 
  Bell, 
  Calendar, 
  Award, 
  FileText, 
  CheckCircle2, 
  Share2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Announcement, Student, GradeEntry } from '../../types';

interface PublicPortalModuleProps {
  announcements: Announcement[];
  students: Student[];
  grades: GradeEntry[];
  onAddAnnouncement: (announcement: Announcement) => void;
}

export const PublicPortalModule: React.FC<PublicPortalModuleProps> = ({
  announcements,
  students,
  grades,
  onAddAnnouncement
}) => {
  const [activeTab, setActiveTab] = useState<'actualites' | 'proclamation'>('actualites');
  const [searchMatricule, setSearchMatricule] = useState<string>('');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [formTitre, setFormTitre] = useState<string>('');
  const [formType, setFormType] = useState<Announcement['type']>('Communiqué');
  const [formContenu, setFormContenu] = useState<string>('');
  const [formCible, setFormCible] = useState<Announcement['cible']>('Tous');

  const handleSearchProclamation = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => 
      s.matricule.toLowerCase() === searchMatricule.trim().toLowerCase() ||
      s.nom.toLowerCase() === searchMatricule.trim().toLowerCase()
    );
    setSearchedStudent(st || null);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      titre: formTitre,
      type: formType,
      contenu: formContenu,
      datePublication: new Date().toISOString().split('T')[0],
      auteur: 'Secrétariat Général',
      cible: formCible,
      priorite: 'normal'
    };

    onAddAnnouncement(newAnc);
    setShowAddModal(false);
    setFormTitre('');
    setFormContenu('');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600  font-bold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4" /> Pages Publiques & Portail Institutionnel
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100  mt-1">Portail Web & Proclamation des Résultats</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
            Publication des communiqués officiels, actualités scolaires et consultation publique des notes.
          </p>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publier un Communiqué
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 bg-white dark:bg-slate-900  p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm text-xs w-full sm:w-fit transition-colors duration-200">
        <button
          onClick={() => setActiveTab('actualites')}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
            activeTab === 'actualites'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-transparent text-slate-500 dark:text-slate-400  hover:bg-slate-50 dark:bg-slate-800/50 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          Communiqués & Actualités
        </button>
        <button
          onClick={() => setActiveTab('proclamation')}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
            activeTab === 'proclamation'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-transparent text-slate-500 dark:text-slate-400  hover:bg-slate-50 dark:bg-slate-800/50 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          Guichet de Proclamation des Résultats
        </button>
      </div>

      {/* Tab 1: Actualités & Communiqués */}
      {activeTab === 'actualites' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  hover:border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60slate-200 p-5 rounded-2xl shadow-sm transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    anc.type === 'Examen' ? 'bg-purple-50  text-purple-700  border border-purple-200 ' :
                    anc.type === 'Urgent' ? 'bg-rose-50  text-rose-700  border border-rose-200 ' :
                    'bg-blue-50  text-blue-700  border border-blue-200 '
                  }`}>
                    {anc.type}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400  font-medium">{anc.datePublication}</span>
                </div>

                <h3 className="font-bold text-slate-800 dark:text-slate-100  text-base hover:text-blue-600 transition-colors">
                  {anc.titre}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400  leading-relaxed">
                  {anc.contenu}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 ">
                <span>Par : <strong className="text-slate-800 dark:text-slate-100 ">{anc.auteur}</strong></span>
                <span className="bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400  px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">Cible: {anc.cible}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tab 2: Proclamation des Points */
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-8 rounded-2xl shadow-sm flex flex-col gap-4 text-center transition-colors duration-200">
            <div className="w-16 h-16 rounded-lg bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 ">Guichet Numérique de Proclamation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400  mt-1 max-w-md mx-auto">
                Entrez le numéro matricule ou le nom de l'élève pour consulter les résultats académiques officiels et le bulletin synthétique.
              </p>
            </div>

            <form onSubmit={handleSearchProclamation} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Ex: MAT-2026-001 ou nom..."
                value={searchMatricule}
                onChange={(e) => setSearchMatricule(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:bg-slate-900 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Vérifier
              </button>
            </form>
          </div>

          {/* Search Result */}
          {searchedStudent && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-6 rounded-2xl shadow-md flex flex-col gap-4 transition-colors duration-200">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600  tracking-wider">Résultat Proclamé</span>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 ">{searchedStudent.nom} {searchedStudent.prenom}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 ">{searchedStudent.classe} • {searchedStudent.matricule}</p>
                </div>
                <div className="bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  px-3 py-1 rounded-xl text-xs font-bold">
                  ADMIS(E) AVEC SUCCÈS
                </div>
              </div>

              {/* Grades Table for this student */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60">
                    <tr className="border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Matière</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Devoir</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Examen</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Moyenne Finale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 ">
                    {grades.filter(g => g.studentId === searchedStudent.id || g.studentName.includes(searchedStudent.nom)).map(g => (
                      <tr key={g.id} className="hover:bg-slate-50 dark:bg-slate-800/50/60">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 ">{g.matiere}</td>
                        <td className="px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400 ">{g.noteDevoir}/20</td>
                        <td className="px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400 ">{g.noteExamen}/20</td>
                        <td className="px-4 py-3 text-sm text-center font-bold text-blue-600 ">
                          {((g.noteDevoir * 0.4) + (g.noteExamen * 0.6)).toFixed(1)} /20
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Public Portal Contact & Institutional Footer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mt-2 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            EC
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100  text-sm">EDU-CONGO • Portail Numérique Institutionnel</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 ">République du Congo • Brazzaville & Pointe-Noire</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 ">
          <span className="text-blue-600  font-bold">WhatsApp : +242 06 895 83 77</span>
          <span className="text-blue-600  font-bold">Appel : +242 06 169 35 98</span>
          <span className="text-slate-800 dark:text-slate-100 ">steph.alongo@gmail.com</span>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100  border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600 " />
              Nouveau Communiqué Officiel
            </h3>

            <form onSubmit={handleSaveAnnouncement} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-slate-800 dark:text-slate-100  font-semibold mb-1 block">Titre :</label>
                <input
                  type="text"
                  value={formTitre}
                  onChange={(e) => setFormTitre(e.target.value)}
                  placeholder="Ex: Calendrier des rattrapages"
                  className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 dark:text-slate-100  font-semibold mb-1 block">Type :</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Communiqué">Communiqué</option>
                    <option value="Examen">Examen</option>
                    <option value="Événement">Événement</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-800 dark:text-slate-100  font-semibold mb-1 block">Public Cible :</label>
                  <select
                    value={formCible}
                    onChange={(e) => setFormCible(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Tous">Tous</option>
                    <option value="Parents">Parents</option>
                    <option value="Élèves">Élèves</option>
                    <option value="Enseignants">Enseignants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-800 dark:text-slate-100  font-semibold mb-1 block">Contenu du message :</label>
                <textarea
                  rows={4}
                  value={formContenu}
                  onChange={(e) => setFormContenu(e.target.value)}
                  placeholder="Rédigez le texte du communiqué..."
                  className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50  hover:bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100  rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
                >
                  Publier Maintenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
