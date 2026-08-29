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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4" /> Pages Publiques & Portail Institutionnel
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">Portail Web & Proclamation des Résultats</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publication des communiqués officiels, actualités scolaires et consultation publique des notes.
          </p>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publier un Communiqué
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs w-full sm:w-fit transition-colors duration-200">
        <button
          onClick={() => setActiveTab('actualites')}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
            activeTab === 'actualites'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Communiqués & Actualités
        </button>
        <button
          onClick={() => setActiveTab('proclamation')}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
            activeTab === 'proclamation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 p-5 rounded-2xl shadow-sm transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    anc.type === 'Examen' ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' :
                    anc.type === 'Urgent' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                    'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {anc.type}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{anc.datePublication}</span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {anc.titre}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {anc.contenu}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Par : <strong className="text-slate-700 dark:text-slate-300">{anc.auteur}</strong></span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200/50 dark:border-slate-700">Cible: {anc.cible}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tab 2: Proclamation des Points */
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-2xl shadow-sm flex flex-col gap-4 text-center transition-colors duration-200">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Guichet Numérique de Proclamation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Entrez le numéro matricule ou le nom de l'élève pour consulter les résultats académiques officiels et le bulletin synthétique.
              </p>
            </div>

            <form onSubmit={handleSearchProclamation} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Ex: MAT-2026-001 ou nom..."
                value={searchMatricule}
                onChange={(e) => setSearchMatricule(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Vérifier
              </button>
            </form>
          </div>

          {/* Search Result */}
          {searchedStudent && (
            <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 p-6 rounded-2xl shadow-md flex flex-col gap-4 transition-colors duration-200">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">Résultat Proclamé</span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{searchedStudent.nom} {searchedStudent.prenom}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{searchedStudent.classe} • {searchedStudent.matricule}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-xl text-xs font-bold">
                  ADMIS(E) AVEC SUCCÈS
                </div>
              </div>

              {/* Grades Table for this student */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-100 dark:border-slate-800">
                      <th className="p-3">Matière</th>
                      <th className="p-3 text-center">Devoir</th>
                      <th className="p-3 text-center">Examen</th>
                      <th className="p-3 text-center">Moyenne Finale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {grades.filter(g => g.studentId === searchedStudent.id || g.studentName.includes(searchedStudent.nom)).map(g => (
                      <tr key={g.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-medium text-slate-900 dark:text-white">{g.matiere}</td>
                        <td className="p-3 text-center text-slate-600 dark:text-slate-300">{g.noteDevoir}/20</td>
                        <td className="p-3 text-center text-slate-600 dark:text-slate-300">{g.noteExamen}/20</td>
                        <td className="p-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mt-2 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            EC
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">EDU-CONGO • Portail Numérique Institutionnel</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">République du Congo • Brazzaville & Pointe-Noire</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-300">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">WhatsApp : +242 06 895 83 77</span>
          <span className="text-indigo-700 dark:text-indigo-400 font-bold">Appel : +242 06 169 35 98</span>
          <span className="text-slate-800 dark:text-slate-200">steph.alongo@gmail.com</span>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Nouveau Communiqué Officiel
            </h3>

            <form onSubmit={handleSaveAnnouncement} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Titre :</label>
                <input
                  type="text"
                  value={formTitre}
                  onChange={(e) => setFormTitre(e.target.value)}
                  placeholder="Ex: Calendrier des rattrapages"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Type :</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Communiqué">Communiqué</option>
                    <option value="Examen">Examen</option>
                    <option value="Événement">Événement</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Public Cible :</label>
                  <select
                    value={formCible}
                    onChange={(e) => setFormCible(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Tous">Tous</option>
                    <option value="Parents">Parents</option>
                    <option value="Élèves">Élèves</option>
                    <option value="Enseignants">Enseignants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Contenu du message :</label>
                <textarea
                  rows={4}
                  value={formContenu}
                  onChange={(e) => setFormContenu(e.target.value)}
                  placeholder="Rédigez le texte du communiqué..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm cursor-pointer"
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
