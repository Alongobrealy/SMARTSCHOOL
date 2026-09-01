import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Settings, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Save, 
  School, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  AlertCircle,
  Users,
  Check,
  X
} from 'lucide-react';
import { SchoolConfig, ClassLevelConfig, SchoolCycle, UserRole, RolePermission } from '../../types';
import { CONGO_DEPARTMENTS, CONGO_COMMUNES, SCHOOL_ATTRIBUTIONS } from '../../data/congoGeoData';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface SchoolSettingsModuleProps {
  schoolConfig: SchoolConfig;
  classesConfig: ClassLevelConfig[];
  rolePermissions: RolePermission[];
  currentRole: UserRole;
  onUpdateSchoolConfig: (newConfig: SchoolConfig) => void;
  onAddClass: (newClass: ClassLevelConfig) => void;
  onUpdateClass: (updatedClass: ClassLevelConfig) => void;
  onDeleteClass: (classId: string) => void;
  onUpdateRolePermissions: (permissions: RolePermission[]) => void;
}

export const SchoolSettingsModule: React.FC<SchoolSettingsModuleProps> = ({
  schoolConfig,
  classesConfig,
  rolePermissions,
  currentRole,
  onUpdateSchoolConfig,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onUpdateRolePermissions
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'cycles' | 'classes' | 'subjects' | 'permissions'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // General Form State
  const [formData, setFormData] = useState<SchoolConfig>({ ...schoolConfig });

  useEffect(() => {
    setFormData({ ...schoolConfig });
  }, [schoolConfig]);

  // Periodic AutoSave to localStorage for general school settings
  const autoSave = useFormAutoSave<SchoolConfig>({
    storageKey: `edu_draft_settings_${schoolConfig.name || 'default'}`,
    formData,
    setFormData,
    intervalMs: 2500,
    enabled: currentRole === 'direction' || currentRole === 'administration' || currentRole === 'superadmin'
  });

  // Class Modal State
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassLevelConfig | null>(null);
  const [classForm, setClassForm] = useState<Partial<ClassLevelConfig>>({
    cycle: 'primaire',
    name: '',
    code: '',
    niveau: '',
    section: 'A',
    capaciteMax: 40,
    fraisScolariteFCFA: 250000,
    fraisInscriptionFCFA: 25000,
    salle: 'Salle 1'
  });

  const isAdmin = currentRole === 'direction' || currentRole === 'administration' || currentRole === 'superadmin';

  // Subjects Management State
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [subjectSuccess, setSubjectSuccess] = useState<string | null>(null);

  const handleAddSubject = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const val = newSubjectInput.trim();
    if (!val) {
      setSubjectError('Veuillez saisir le nom de la matière.');
      return;
    }
    const currentSubjects = formData.subjects || schoolConfig.subjects || [];
    if (currentSubjects.some(s => s.toLowerCase() === val.toLowerCase())) {
      setSubjectError(`La matière "${val}" existe déjà dans le programme.`);
      return;
    }

    const updatedSubjects = [...currentSubjects, val];
    const updatedConfig = { ...schoolConfig, ...formData, subjects: updatedSubjects };
    setFormData(updatedConfig);
    onUpdateSchoolConfig(updatedConfig);
    setNewSubjectInput('');
    setSubjectError(null);
    setSubjectSuccess(`Matière "${val}" ajoutée avec succès !`);
    setTimeout(() => setSubjectSuccess(null), 3000);
  };

  const handleDeleteSubject = (subjectToDelete: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subjectToDelete}" ?`)) {
      const currentSubjects = formData.subjects || schoolConfig.subjects || [];
      const updatedSubjects = currentSubjects.filter(s => s !== subjectToDelete);
      const updatedConfig = { ...schoolConfig, ...formData, subjects: updatedSubjects };
      setFormData(updatedConfig);
      onUpdateSchoolConfig(updatedConfig);
      setSubjectSuccess(`Matière "${subjectToDelete}" supprimée.`);
      setTimeout(() => setSubjectSuccess(null), 3000);
    }
  };

  const handleAddStandardPreset = (presetName: string) => {
    const currentSubjects = formData.subjects || schoolConfig.subjects || [];
    if (currentSubjects.some(s => s.toLowerCase() === presetName.toLowerCase())) {
      return;
    }
    const updatedSubjects = [...currentSubjects, presetName];
    const updatedConfig = { ...schoolConfig, ...formData, subjects: updatedSubjects };
    setFormData(updatedConfig);
    onUpdateSchoolConfig(updatedConfig);
    setSubjectSuccess(`"${presetName}" ajouté au programme.`);
    setTimeout(() => setSubjectSuccess(null), 2500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolConfig(formData);
    autoSave.clearDraft();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleCycle = (cycleKey: keyof SchoolConfig['activeCycles']) => {
    const updated = {
      ...formData,
      activeCycles: {
        ...formData.activeCycles,
        [cycleKey]: !formData.activeCycles[cycleKey]
      }
    };
    setFormData(updated);
    onUpdateSchoolConfig(updated);
  };

  const handleOpenAddClass = (cycle: SchoolCycle = 'primaire') => {
    setEditingClass(null);
    setClassForm({
      cycle,
      name: '',
      code: '',
      niveau: '',
      section: 'A',
      capaciteMax: 40,
      fraisScolariteFCFA: 250000,
      fraisInscriptionFCFA: 25000,
      salle: 'Salle 1'
    });
    setShowClassModal(true);
  };

  const handleOpenEditClass = (cls: ClassLevelConfig) => {
    setEditingClass(cls);
    setClassForm({ ...cls });
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name || !classForm.cycle) return;

    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        ...classForm
      } as ClassLevelConfig);
    } else {
      const newClass: ClassLevelConfig = {
        id: `cls-${Date.now()}`,
        code: classForm.code || classForm.name.toUpperCase().replace(/\s+/g, '-'),
        name: classForm.name,
        cycle: classForm.cycle as SchoolCycle,
        niveau: classForm.niveau || classForm.name,
        section: classForm.section || 'A',
        capaciteMax: Number(classForm.capaciteMax) || 40,
        fraisScolariteFCFA: Number(classForm.fraisScolariteFCFA) || 0,
        fraisInscriptionFCFA: Number(classForm.fraisInscriptionFCFA) || 0,
        salle: classForm.salle || 'Salle',
        professeurPrincipal: classForm.professeurPrincipal || ''
      };
      onAddClass(newClass);
    }
    setShowClassModal(false);
  };

  // Quick Preset Helper for adding standard classes by cycle
  const handleGenerateCyclePresets = (cycle: SchoolCycle) => {
    const presets: Record<SchoolCycle, string[]> = {
      maternelle: ['Petite Section', 'Moyenne Section', 'Grande Section'],
      primaire: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'],
      college: ['6ème', '5ème', '4ème', '3ème'],
      lycee: ['2nde A', '2nde C', '1ère A', '1ère C', '1ère D', 'Terminale A', 'Terminale C', 'Terminale D'],
      formation_pro: ['Électricité Bâtiment 1ère Année', 'Mécanique Auto 1ère Année', 'Couture & Stylisme 1ère Année', 'Secrétariat Bureautique 1ère Année']
    };

    const cycleRates: Record<SchoolCycle, { tuition: number; reg: number }> = {
      maternelle: { tuition: 180000, reg: 20000 },
      primaire: { tuition: 220000, reg: 25000 },
      college: { tuition: 280000, reg: 30000 },
      lycee: { tuition: 350000, reg: 35000 },
      formation_pro: { tuition: 300000, reg: 30000 }
    };

    presets[cycle].forEach((lvlName, idx) => {
      // Check if already exists
      const exists = classesConfig.some((c) => c.cycle === cycle && c.name === `${lvlName} A`);
      if (!exists) {
        onAddClass({
          id: `cls-preset-${cycle}-${idx}-${Date.now()}`,
          code: `${cycle.slice(0, 3).toUpperCase()}-${lvlName.slice(0, 4).toUpperCase().trim()}-A`,
          name: `${lvlName} A`,
          cycle,
          niveau: lvlName,
          section: 'A',
          capaciteMax: 40,
          fraisScolariteFCFA: cycleRates[cycle].tuition,
          fraisInscriptionFCFA: cycleRates[cycle].reg,
          salle: `Salle ${idx + 1}`
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
              Configuration de l'Établissement & Pédagogie
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400  mt-0.5">
              Paramétrez l'identité officielle, activez les cycles d'enseignement, structurez les classes et gérez les permissions.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-blue-600  w-full md:w-auto">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Paramètres enregistrés avec succès !</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 gap-2 pb-3">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Identité & Coordonnées Officielles
        </button>

        <button
          onClick={() => setActiveTab('cycles')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cycles'
              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Cycles d'Enseignement
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'classes'
              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Niveaux & Classes ({classesConfig.length})
        </button>

        
          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-3 border-b-2 font-bold text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'subjects'
                ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Matières & Cours</span>
          </button>

<button
          onClick={() => setActiveTab('permissions')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'permissions'
              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Rôles & Permissions
        </button>
      </div>

      {/* TAB 1: IDENTITÉ & COORDONNÉES */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Nom de l'Établissement *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Complexe Scolaire La Renaissance"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Statut / Type d'Établissement
              </label>
              <select
                value={formData.attribution}
                onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
              >
                {SCHOOL_ATTRIBUTIONS.map((attr) => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Agrément Ministériel (MEPPSA)
              </label>
              <input
                type="text"
                value={formData.agrementNumber}
                onChange={(e) => setFormData({ ...formData, agrementNumber: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Arrêté N° 0482/MEPPSA-DGE"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Devise de l'École
              </label>
              <input
                type="text"
                value={formData.devise}
                onChange={(e) => setFormData({ ...formData, devise: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Discipline - Travail - Succès"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Nom du Chef d'Établissement / Proviseur *
              </label>
              <input
                type="text"
                required
                value={formData.directorName}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: M. Stéphane Alongo"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Titre Officiel du Chef d'Établissement
              </label>
              <input
                type="text"
                value={formData.directorSignatureTitle}
                onChange={(e) => setFormData({ ...formData, directorSignatureTitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Le Chef d'Établissement / Le Proviseur"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Département (Congo)
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
              >
                {CONGO_DEPARTMENTS.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Ville / Commune
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Brazzaville"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Année Scolaire Active
              </label>
              <input
                type="text"
                value={formData.anneeScolaire}
                onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="2026 - 2027"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Téléphone Officiel (+242)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="+242 06 895 83 77"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Email Officiel
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="contact@etablissement.cg"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-100  uppercase tracking-wider block mb-1.5">
                Adresse & Boîte Postale
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100  focus:ring-2 focus:ring-indigo-500"
                placeholder="Avenue de la Paix, B.P. 1428"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex flex-col sm:flex-row items-center justify-between gap-3">
            <AutoSaveIndicator
              lastSavedTime={autoSave.lastSavedTime}
              isSaving={autoSave.isSaving}
              hasDraft={autoSave.hasDraft}
              savedDraftDate={autoSave.savedDraftDate}
              onRestoreDraft={autoSave.restoreDraft}
              onClearDraft={autoSave.clearDraft}
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            >
              <Save className="w-4 h-4" />
              Enregistrer les Paramètres d'Établissement
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: CYCLES D'ENSEIGNEMENT */}
      {activeTab === 'cycles' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 ">
              Cycles d'Enseignement Disponibles dans votre Établissement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
              Activez ou désactivez les cycles pédagogiques dispensés par votre structure scolaire ou centre de formation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Cycle Maternel */}
            <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
              formData.activeCycles.maternelle 
                ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 bg-blue-50/40 ' 
                : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-slate-50 dark:bg-slate-800/50/50  opacity-75'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🧸</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCycle('maternelle')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      formData.activeCycles.maternelle
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400 '
                    }`}
                  >
                    {formData.activeCycles.maternelle ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Cycle Maternel & Préscolaire</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
                  Crèche, Petite Section, Moyenne Section, Grande Section.
                </p>
              </div>

              {formData.activeCycles.maternelle && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600 ">
                    {classesConfig.filter((c) => c.cycle === 'maternelle').length} Classes configurées
                  </span>
                  <button
                    onClick={() => handleGenerateCyclePresets('maternelle')}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    + Générer les niveaux (PS, MS, GS)
                  </button>
                </div>
              )}
            </div>

            {/* Cycle Primaire */}
            <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
              formData.activeCycles.primaire 
                ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 bg-blue-50/40 ' 
                : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-slate-50 dark:bg-slate-800/50/50  opacity-75'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎒</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCycle('primaire')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      formData.activeCycles.primaire
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400 '
                    }`}
                  >
                    {formData.activeCycles.primaire ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Cycle Primaire (Fondamental)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
                  CP1, CP2, CE1, CE2, CM1, CM2 (Préparation au CEPE & Concours d'entrée en 6ème).
                </p>
              </div>

              {formData.activeCycles.primaire && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600 ">
                    {classesConfig.filter((c) => c.cycle === 'primaire').length} Classes configurées
                  </span>
                  <button
                    onClick={() => handleGenerateCyclePresets('primaire')}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    + Générer CP1 - CM2
                  </button>
                </div>
              )}
            </div>

            {/* Cycle Collège */}
            <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
              formData.activeCycles.college 
                ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 bg-blue-50/40 ' 
                : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-slate-50 dark:bg-slate-800/50/50  opacity-75'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🏫</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCycle('college')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      formData.activeCycles.college
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400 '
                    }`}
                  >
                    {formData.activeCycles.college ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Cycle Secondaire 1er Degré (Collège)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
                  6ème, 5ème, 4ème, 3ème (Préparation à l'examen d'État du BEPC).
                </p>
              </div>

              {formData.activeCycles.college && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600 ">
                    {classesConfig.filter((c) => c.cycle === 'college').length} Classes configurées
                  </span>
                  <button
                    onClick={() => handleGenerateCyclePresets('college')}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    + Générer 6ème - 3ème
                  </button>
                </div>
              )}
            </div>

            {/* Cycle Lycée */}
            <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
              formData.activeCycles.lycee 
                ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 bg-blue-50/40 ' 
                : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-slate-50 dark:bg-slate-800/50/50  opacity-75'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎓</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCycle('lycee')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      formData.activeCycles.lycee
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400 '
                    }`}
                  >
                    {formData.activeCycles.lycee ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Cycle Secondaire 2nd Degré (Lycée)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
                  2ndes, 1ères et Terminales Générales (Séries A, C, D, TI, G, F - Baccalauréat National).
                </p>
              </div>

              {formData.activeCycles.lycee && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600 ">
                    {classesConfig.filter((c) => c.cycle === 'lycee').length} Classes configurées
                  </span>
                  <button
                    onClick={() => handleGenerateCyclePresets('lycee')}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    + Générer Séries 2nde - Tle
                  </button>
                </div>
              )}
            </div>

            {/* Centre de Formation Professionnelle */}
            <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
              formData.activeCycles.formation_pro 
                ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 bg-blue-50/40 ' 
                : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-slate-50 dark:bg-slate-800/50/50  opacity-75'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">⚙️</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCycle('formation_pro')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      formData.activeCycles.formation_pro
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400 '
                    }`}
                  >
                    {formData.activeCycles.formation_pro ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Centre de Formation Professionnelle & Métiers</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
                  Filières qualifiantes : Électricité, Mécanique, Couture, Hôtellerie, Secrétariat, Maçonnerie, etc.
                </p>
              </div>

              {formData.activeCycles.formation_pro && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600 ">
                    {classesConfig.filter((c) => c.cycle === 'formation_pro').length} Classes configurées
                  </span>
                  <button
                    onClick={() => handleGenerateCyclePresets('formation_pro')}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    + Générer Filières Métiers
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: NIVEAUX & CLASSES */}
      {activeTab === 'classes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 ">
                Gestion des Niveaux, Séries & Classes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 ">
                Créez, modifiez ou supprimez les divisions de classes, définissez les capacités et la tarification des frais de scolarité.
              </p>
            </div>

            <button
              onClick={() => handleOpenAddClass('primaire')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter une Nouvelle Classe
            </button>
          </div>

          {classesConfig.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg p-6">
              <GraduationCap className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Aucune classe configurée</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400  mt-1 max-w-md mx-auto">
                Commencez par ajouter vos classes manuellement ou utilisez les boutons de génération rapide dans l'onglet "Cycles d'Enseignement".
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => handleGenerateCyclePresets('primaire')}
                  className="px-3 py-1.5 bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg text-xs font-bold text-blue-600  hover:bg-blue-50 cursor-pointer"
                >
                  + Ajouter Classes Primaires (CP1 - CM2)
                </button>
                <button
                  onClick={() => handleGenerateCyclePresets('college')}
                  className="px-3 py-1.5 bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg text-xs font-bold text-blue-600  hover:bg-blue-50 cursor-pointer"
                >
                  + Ajouter Classes Collège (6ème - 3ème)
                </button>
                <button
                  onClick={() => handleGenerateCyclePresets('lycee')}
                  className="px-3 py-1.5 bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-lg text-xs font-bold text-blue-600  hover:bg-blue-50 cursor-pointer"
                >
                  + Ajouter Classes Lycée (2nde - Tle)
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60">
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Code</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Intitulé de la Classe</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Cycle</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Section</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Capacité Max</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Frais Scolarité (Annuel)</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Frais Inscription</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 ">
                  {classesConfig.map((cls) => {
                    const getCycleBadge = () => {
                      switch (cls.cycle) {
                        case 'maternelle': return 'bg-pink-100 text-pink-800  ';
                        case 'primaire': return 'bg-blue-100 text-blue-800  ';
                        case 'college': return 'bg-purple-100 text-purple-800  ';
                        case 'lycee': return 'bg-blue-50 text-blue-600  ';
                        case 'formation_pro': return 'bg-amber-100 text-amber-800  ';
                        default: return 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100';
                      }
                    };

                    return (
                      <tr key={cls.id} className="hover:bg-slate-50 dark:bg-slate-800/50/80 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                        <td className="px-4 py-3 text-sm font-mono font-bold text-blue-600 ">{cls.code}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 ">{cls.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${getCycleBadge()}`}>
                            {cls.cycle}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">{cls.section || 'A'}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono">{cls.capaciteMax} élèves</td>
                        <td className="px-4 py-3 text-sm text-right font-mono font-bold text-slate-800 dark:text-slate-100 ">
                          {cls.fraisScolariteFCFA.toLocaleString()} FCFA
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-slate-500 dark:text-slate-400 ">
                          {cls.fraisInscriptionFCFA.toLocaleString()} FCFA
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditClass(cls)}
                              className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400  transition-colors cursor-pointer"
                              title="Modifier la classe"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteClass(cls.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Supprimer la classe"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RÔLES & PERMISSIONS */}
      
      {/* TAB MATIÈRES & COURS */}
      {activeTab === 'subjects' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 " />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 ">
                  Matières & Disciplines d'Études
                </h3>
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  {(schoolConfig.subjects || []).length} matière(s)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400  mt-1">
                Gérez le programme officiel des matières enseignées dans l'établissement pour les cours, notes, bulletins et emplois du temps.
              </p>
            </div>

            {isAdmin && (
              <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input 
                  type="text" 
                  value={newSubjectInput}
                  onChange={(e) => {
                    setNewSubjectInput(e.target.value);
                    if (subjectError) setSubjectError(null);
                  }}
                  placeholder="Ex: Mathématiques, Sciences Physiques..." 
                  className="bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100  focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[240px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter la matière</span>
                </button>
              </form>
            )}
          </div>

          {/* Feedback messages */}
          {subjectError && (
            <div className="bg-rose-50  border border-rose-200  rounded-xl p-3 text-rose-900  text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600  shrink-0" />
              <span>{subjectError}</span>
            </div>
          )}
          {subjectSuccess && (
            <div className="bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl p-3 text-blue-600  text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600  shrink-0" />
              <span>{subjectSuccess}</span>
            </div>
          )}

          {/* Quick presets for common Congolese curriculum */}
          {isAdmin && (
            <div className="bg-slate-50 dark:bg-slate-800/50  p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100  block mb-2">
                Suggestions de matières courantes au Congo (+ Ajouter en 1 clic) :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Mathématiques',
                  'Sciences Physiques',
                  'Français',
                  'Histoire-Géographie',
                  'Sciences de la Vie et de la Terre (SVT)',
                  'Philosophie',
                  'Anglais',
                  'Éducation Physique et Sportive (EPS)',
                  'Éducation Civique et Morale (ECM)',
                  'Informatique & Numérique',
                  'Économie Générale',
                  'Comptabilité & Gestion',
                  'Espagnol',
                  'Allemand',
                  'Arabe'
                ].map((preset) => {
                  const alreadyExists = (schoolConfig.subjects || []).some(s => s.toLowerCase() === preset.toLowerCase());
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => handleAddStandardPreset(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        alreadyExists 
                          ? 'bg-slate-50 dark:bg-slate-800/50  text-slate-500 dark:text-slate-400  cursor-default'
                          : 'bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-slate-800 dark:text-slate-100  hover:border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 hover:text-blue-600 hover:shadow-xs cursor-pointer'
                      }`}
                    >
                      {alreadyExists ? `✓ ${preset}` : `+ ${preset}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter / Search */}
          <div className="flex items-center justify-between gap-4">
            <input 
              type="text" 
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Filtrer les matières..."
              className="bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100  w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          {/* Subjects Table */}
          <div className="bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60">
                <tr className="border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">#</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Intitulé de la matière</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Discipline</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200  text-xs">
                {(schoolConfig.subjects || [])
                  .filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()))
                  .map((subject, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono w-12">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-100  font-semibold">
                        {subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400  hidden sm:table-cell">
                        {subject.toLowerCase().includes('math') || subject.toLowerCase().includes('physique') || subject.toLowerCase().includes('svt') || subject.toLowerCase().includes('info') ? (
                          <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  font-medium text-[10px]">
                            Scientifique / Tech
                          </span>
                        ) : subject.toLowerCase().includes('français') || subject.toLowerCase().includes('anglais') || subject.toLowerCase().includes('espagnol') || subject.toLowerCase().includes('philo') || subject.toLowerCase().includes('histoire') ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50  text-amber-700  font-medium text-[10px]">
                            Littéraire / Humaines
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50  text-purple-700  font-medium text-[10px]">
                            Générale / Transversale
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSubject(subject)}
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-rose-100/30 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer la matière"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                {!(schoolConfig.subjects || []).length && (
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                    <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                      Aucune matière configurée pour l'instant. Utilisez le formulaire ci-dessus pour en ajouter.
                    </td>
                  </tr>
                )}
                {(schoolConfig.subjects || []).length > 0 && !(schoolConfig.subjects || []).filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase())).length && (
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors">
                    <td colSpan={4} className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                      Aucune matière ne correspond à votre recherche "{subjectSearch}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 ">
              Attribution des Rôles & Matrice des Permissions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 ">
              Contrôlez les droits d'accès pour chaque profil. Notez que les rôles <strong>Élève</strong> et <strong>Parent</strong> sont strictement limités à la lecture seule (impression de documents originaux désactivée).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rolePermissions.map((rp) => {
              const isReadOnlyProfile = rp.role === 'parent' || rp.role === 'eleve';

              return (
                <div 
                  key={rp.role}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isReadOnlyProfile 
                      ? 'border-amber-200  bg-amber-50/40 '
                      : 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  bg-slate-50 dark:bg-slate-800/50/50 '
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 ">{rp.label}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        isReadOnlyProfile 
                          ? 'bg-amber-100  text-amber-800 ' 
                          : 'bg-blue-50  text-blue-600 '
                      }`}>
                        {rp.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400  mb-3">
                      {rp.description}
                    </p>

                    <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 ">Gestion Élèves & Inscriptions :</span>
                        {rp.canManageStudents ? <Check className="w-4 h-4 text-blue-600" /> : <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 ">Gestion Personnel & Enseignants :</span>
                        {rp.canManageStaff ? <Check className="w-4 h-4 text-blue-600" /> : <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 ">Saisie des Notes & Évaluations :</span>
                        {rp.canInputGrades ? <Check className="w-4 h-4 text-blue-600" /> : <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 ">Comptabilité & Encaissements :</span>
                        {rp.canManageFees ? <Check className="w-4 h-4 text-blue-600" /> : <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      </div>
                      <div className="flex items-center justify-between font-bold">
                        <span className={rp.canPrintOfficialDocs ? 'text-blue-600 ' : 'text-slate-500 dark:text-slate-400'}>
                          Impression Documents Officiels :
                        </span>
                        {rp.canPrintOfficialDocs ? (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50  px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60">Autorisée</span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50  px-1.5 py-0.5 rounded border border-rose-300">Désactivée (Lecture seule)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CLASS MODAL */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3">
              <h3 className="font-bold text-base">
                {editingClass ? 'Modifier la Classe' : 'Créer une Nouvelle Classe'}
              </h3>
              <button
                onClick={() => setShowClassModal(false)}
                className="p-1 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-500 dark:text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Cycle Pédagogique *
                  </label>
                  <select
                    value={classForm.cycle}
                    onChange={(e) => setClassForm({ ...classForm, cycle: e.target.value as SchoolCycle })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="maternelle">Maternel</option>
                    <option value="primaire">Primaire</option>
                    <option value="college">Collège</option>
                    <option value="lycee">Lycée</option>
                    <option value="formation_pro">Formation Professionnelle</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Intitulé / Nom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 6ème A ou CP1"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Niveau / Filière
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 6ème, Terminale D"
                    value={classForm.niveau}
                    onChange={(e) => setClassForm({ ...classForm, niveau: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="A, B, C, 1, 2"
                    value={classForm.section}
                    onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Frais Scolarité (Annuel FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={classForm.fraisScolariteFCFA}
                    onChange={(e) => setClassForm({ ...classForm, fraisScolariteFCFA: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Frais Inscription (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={classForm.fraisInscriptionFCFA}
                    onChange={(e) => setClassForm({ ...classForm, fraisInscriptionFCFA: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Capacité Maximale
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={classForm.capaciteMax}
                    onChange={(e) => setClassForm({ ...classForm, capaciteMax: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400  block mb-1">
                    Salle de Cours
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Bâtiment A - Salle 04"
                    value={classForm.salle}
                    onChange={(e) => setClassForm({ ...classForm, salle: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100  hover:bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                >
                  {editingClass ? 'Mettre à jour' : 'Créer la Classe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
