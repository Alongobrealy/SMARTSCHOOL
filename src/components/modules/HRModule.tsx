import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Clock, 
  DollarSign, 
  Printer, 
  Award, 
  CheckCircle, 
  Phone, 
  Mail,
  FileText,
  AlertTriangle,
  CreditCard,
  Edit3,
  Trash2,
  Building,
  UserCheck,
  ShieldCheck,
  X
} from 'lucide-react';
import { Teacher, StaffMember, SchoolConfig, UserRole } from '../../types';
import { StaffBadgeModal } from '../modals/StaffBadgeModal';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface HRModuleProps {
  teachers: Teacher[];
  staff: StaffMember[];
  schoolConfig: SchoolConfig;
  currentRole: UserRole;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onAddStaff: (staffMember: StaffMember) => void;
  onUpdateStaff: (staffMember: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
}

export const HRModule: React.FC<HRModuleProps> = ({ 
  teachers, 
  staff = [],
  schoolConfig,
  currentRole,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'staff'>('teachers');
  
  // Modals state
  const [selectedPersonForBadge, setSelectedPersonForBadge] = useState<{ person: Teacher | StaffMember; type: 'teacher' | 'staff' } | null>(null);
  const [selectedTeacherForSlip, setSelectedTeacherForSlip] = useState<Teacher | null>(null);
  
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Teacher Form State
  const [tNom, setTNom] = useState('');
  const [tPrenom, setTPrenom] = useState('');
  const [tSpecialite, setTSpecialite] = useState('');
  const [tMatieres, setTMatieres] = useState('Mathématiques, Informatique');
  const [tPhone, setTPhone] = useState('+242 06 ');
  const [tEmail, setTEmail] = useState('');
  const [tStatut, setTStatut] = useState<Teacher['statut']>('Permanent');
  const [tSalaire, setTSalaire] = useState('250000');
  const [tClasses, setTClasses] = useState('6ème A, 3ème B');

  // Staff Form State
  const [sNom, setSNom] = useState('');
  const [sPrenom, setSPrenom] = useState('');
  const [sRole, setSRole] = useState<StaffMember['roleFonction']>('Surveillant Général');
  const [sDepartement, setSDepartement] = useState<StaffMember['departement']>('Vie Scolaire & Discipline');
  const [sPhone, setSPhone] = useState('+242 06 ');
  const [sEmail, setSEmail] = useState('');
  const [sGenre, setSGenre] = useState<'M' | 'F'>('M');
  const [sStatut, setSStatut] = useState<StaffMember['statut']>('Permanent');
  const [sSalaire, setSSalaire] = useState('220000');

  // Teacher Form AutoSave
  const teacherFormData = {
    nom: tNom,
    prenom: tPrenom,
    specialite: tSpecialite,
    matieres: tMatieres,
    phone: tPhone,
    email: tEmail,
    statut: tStatut,
    salaire: tSalaire,
    classes: tClasses
  };

  const setTeacherFormData = (data: typeof teacherFormData) => {
    setTNom(data.nom);
    setTPrenom(data.prenom);
    setTSpecialite(data.specialite);
    setTMatieres(data.matieres);
    setTPhone(data.phone);
    setTEmail(data.email);
    setTStatut(data.statut);
    setTSalaire(data.salaire);
    setTClasses(data.classes);
  };

  const autoSaveTeacher = useFormAutoSave({
    storageKey: `edu_draft_teacher_${schoolConfig.name || 'default'}`,
    formData: teacherFormData,
    setFormData: setTeacherFormData,
    intervalMs: 2500,
    enabled: showTeacherModal
  });

  // Staff Form AutoSave
  const staffFormData = {
    nom: sNom,
    prenom: sPrenom,
    role: sRole,
    departement: sDepartement,
    phone: sPhone,
    email: sEmail,
    genre: sGenre,
    statut: sStatut,
    salaire: sSalaire
  };

  const setStaffFormData = (data: typeof staffFormData) => {
    setSNom(data.nom);
    setSPrenom(data.prenom);
    setSRole(data.role);
    setSDepartement(data.departement);
    setSPhone(data.phone);
    setSEmail(data.email);
    setSGenre(data.genre);
    setSStatut(data.statut);
    setSSalaire(data.salaire);
  };

  const autoSaveStaff = useFormAutoSave({
    storageKey: `edu_draft_staff_${schoolConfig.name || 'default'}`,
    formData: staffFormData,
    setFormData: setStaffFormData,
    intervalMs: 2500,
    enabled: showStaffModal
  });

  const canEdit = currentRole === 'direction' || currentRole === 'administration' || currentRole === 'superadmin';
  const canDelete = currentRole === 'direction' || currentRole === 'superadmin';

  const totalPayrollTeachers = teachers.reduce((sum, t) => sum + (t.salaireMensuel || 0), 0);
  const totalPayrollStaff = staff.reduce((sum, s) => sum + (s.salaireMensuel || 0), 0);
  const grandTotalPayroll = totalPayrollTeachers + totalPayrollStaff;

  // Teacher handlers
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setTNom('');
    setTPrenom('');
    setTSpecialite('Enseignement Général');
    setTMatieres('Français, Histoire');
    setTPhone('+242 06 895 83 77');
    setTEmail('');
    setTStatut('Permanent');
    setTSalaire('250000');
    setTClasses('6ème A, 5ème B');
    setShowTeacherModal(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setTNom(t.nom);
    setTPrenom(t.prenom);
    setTSpecialite(t.specialite);
    setTMatieres(t.matieres.join(', '));
    setTPhone(t.telephone);
    setTEmail(t.email);
    setTStatut(t.statut);
    setTSalaire(t.salaireMensuel.toString());
    setTClasses(t.classes.join(', '));
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const email = tEmail || `${tPrenom.toLowerCase()}.${tNom.toLowerCase()}@${schoolConfig.city?.toLowerCase() || 'congo'}.edu`;

    if (editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        nom: tNom.toUpperCase().trim(),
        prenom: tPrenom.trim(),
        specialite: tSpecialite,
        matieres: tMatieres.split(',').map(m => m.trim()),
        telephone: tPhone,
        email,
        statut: tStatut,
        salaireMensuel: parseFloat(tSalaire) || 0,
        classes: tClasses.split(',').map(c => c.trim())
      });
    } else {
      const newTeacher: Teacher = {
        id: `tea-${Date.now()}`,
        matricule: `ENS-${new Date().getFullYear().toString().slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`,
        nom: tNom.toUpperCase().trim(),
        prenom: tPrenom.trim(),
        specialite: tSpecialite,
        matieres: tMatieres.split(',').map(m => m.trim()),
        telephone: tPhone,
        email,
        statut: tStatut,
        salaireMensuel: parseFloat(tSalaire) || 0,
        heuresEffectuees: 32,
        classes: tClasses.split(',').map(c => c.trim()),
        pinCode: Math.floor(100000 + Math.random() * 900000).toString()
      };
      onAddTeacher(newTeacher);
    }
    autoSaveTeacher.clearDraft();
    setShowTeacherModal(false);
  };

  // Staff handlers
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setSNom('');
    setSPrenom('');
    setSRole('Surveillant Général');
    setSDepartement('Vie Scolaire & Discipline');
    setSPhone('+242 06 895 83 77');
    setSEmail('');
    setSGenre('M');
    setSStatut('Permanent');
    setSSalaire('220000');
    setShowStaffModal(true);
  };

  const handleOpenEditStaff = (s: StaffMember) => {
    setEditingStaff(s);
    setSNom(s.nom);
    setSPrenom(s.prenom);
    setSRole(s.roleFonction);
    setSDepartement(s.departement);
    setSPhone(s.telephone);
    setSEmail(s.email);
    setSGenre(s.genre || 'M');
    setSStatut(s.statut);
    setSSalaire(s.salaireMensuel.toString());
    setShowStaffModal(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const email = sEmail || `${sPrenom.toLowerCase()}.${sNom.toLowerCase()}@admin.cg`;

    if (editingStaff) {
      onUpdateStaff({
        ...editingStaff,
        nom: sNom.toUpperCase().trim(),
        prenom: sPrenom.trim(),
        roleFonction: sRole,
        departement: sDepartement,
        telephone: sPhone,
        email,
        genre: sGenre,
        statut: sStatut,
        salaireMensuel: parseFloat(sSalaire) || 0
      });
    } else {
      const newStaff: StaffMember = {
        id: `stf-${Date.now()}`,
        matricule: `ADM-${new Date().getFullYear().toString().slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`,
        nom: sNom.toUpperCase().trim(),
        prenom: sPrenom.trim(),
        roleFonction: sRole,
        departement: sDepartement,
        telephone: sPhone,
        email,
        genre: sGenre,
        datePriseService: new Date().toISOString().split('T')[0],
        salaireMensuel: parseFloat(sSalaire) || 0,
        statut: sStatut,
        pinCode: Math.floor(100000 + Math.random() * 900000).toString()
      };
      onAddStaff(newStaff);
    }
    autoSaveStaff.clearDraft();
    setShowStaffModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-sm transition-colors duration-200 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600  font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" /> Ressources Humaines & Personnel de l'Établissement
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100  mt-1">
            Enseignants, Administration & Badges d'Accès
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400  mt-0.5">
            Gérez le corps professoral, le personnel administratif, générez les badges sécurisés avec QR Code et bulletins de paie.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full md:w-auto">
            <button
              onClick={handleOpenAddTeacher}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Enseignant
            </button>
            <button
              onClick={handleOpenAddStaff}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Personnel Admin
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400  font-medium">Corps Professoral</span>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 ">{teachers.length} Enseignant(s)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400  font-medium">Personnel Administratif</span>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 ">{staff.length} Agent(s)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-4 rounded-2xl shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50  text-purple-600  border border-purple-100  flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400  font-medium">Masse Salariale Totale</span>
            <p className="text-xl font-black text-blue-600 ">{grandTotalPayroll.toLocaleString()} FCFA / mois</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  gap-2">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'teachers'
              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Corps Professoral ({teachers.length})
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-blue-600 '
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Personnel Administratif & Technique ({staff.length})
        </button>
      </div>

      {/* TAB 1: TEACHERS DIRECTORY */}
      {activeTab === 'teachers' && (
        <div>
          {teachers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-center">
              <Users className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Aucun enseignant enregistré</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400  mt-1 max-w-sm mx-auto">
                Ajoutez les professeurs de votre établissement pour leur attribuer des cours et générer leurs badges d'accès.
              </p>
              {canEdit && (
                <button
                  onClick={handleOpenAddTeacher}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter le 1er Enseignant
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-blue-600  flex items-center justify-center font-bold text-base">
                        {t.photoUrl ? (
                          <img src={t.photoUrl} alt={t.nom} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span>{t.nom[0]}{t.prenom[0]}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100  text-sm uppercase">{t.nom} <span className="capitalize text-slate-800 dark:text-slate-100  font-bold">{t.prenom}</span></h4>
                        <p className="text-xs text-blue-600  font-semibold">{t.specialite}</p>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ">{t.matricule}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      t.statut === 'Permanent' 
                        ? 'bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ' 
                        : 'bg-blue-50  text-blue-700  border border-blue-200 '
                    }`}>
                      {t.statut}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 ">
                      <span className="text-slate-500 dark:text-slate-400 ">Matières :</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 ">{t.matieres.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 ">
                      <span className="text-slate-500 dark:text-slate-400 ">Classes :</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 ">{t.classes.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 ">
                      <span className="text-slate-500 dark:text-slate-400 ">Salaire Mensuel :</span>
                      <span className="font-bold text-blue-600 ">{t.salaireMensuel.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-xs">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{t.telephone}</span>

                    <div className="flex items-center gap-1.5">
                      {/* Badge d'accès */}
                      <button
                        onClick={() => setSelectedPersonForBadge({ person: t, type: 'teacher' })}
                        className="px-2.5 py-1.5 bg-blue-50  hover:bg-blue-700 text-blue-600  hover:text-white rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center gap-1 transition-all cursor-pointer"
                        title="Badge d'Accès"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Badge</span>
                      </button>

                      {/* Fiche de Paie */}
                      <button
                        onClick={() => setSelectedTeacherForSlip(t)}
                        className="px-2.5 py-1.5 bg-blue-50  hover:bg-blue-700 text-blue-600  hover:text-white rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center gap-1 transition-all cursor-pointer"
                        title="Fiche de Paie"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Paie</span>
                      </button>

                      {canEdit && (
                        <button
                          onClick={() => handleOpenEditTeacher(t)}
                          className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400  cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => onDeleteTeacher(t.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <div>
          {staff.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-center">
              <Building className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 ">Aucun personnel administratif enregistré</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400  mt-1 max-w-sm mx-auto">
                Enregistrez le Surveillant Général, Secrétaire, Économe, Informaticien ou autres agents pour générer leurs badges officiels.
              </p>
              {canEdit && (
                <button
                  onClick={handleOpenAddStaff}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un Membre du Personnel
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-blue-600  flex items-center justify-center font-bold text-base">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt={s.nom} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span>{s.nom[0]}{s.prenom[0]}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100  text-sm uppercase">{s.nom} <span className="capitalize text-slate-800 dark:text-slate-100  font-bold">{s.prenom}</span></h4>
                        <p className="text-xs text-blue-600  font-semibold">{s.roleFonction}</p>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ">{s.matricule}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                      {s.departement}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50  p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 ">
                      <span className="text-slate-500 dark:text-slate-400 ">Date d'embauche :</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 ">{s.datePriseService}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 ">
                      <span className="text-slate-500 dark:text-slate-400 ">Statut :</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 ">{s.statut}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 ">
                      <span className="text-slate-500 dark:text-slate-400 ">Salaire :</span>
                      <span className="font-bold text-blue-600 ">{s.salaireMensuel.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-xs">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{s.telephone}</span>

                    <div className="flex items-center gap-1.5">
                      {/* Badge d'accès */}
                      <button
                        onClick={() => setSelectedPersonForBadge({ person: s, type: 'staff' })}
                        className="px-2.5 py-1.5 bg-blue-50  hover:bg-blue-700 text-blue-600  hover:text-white rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex items-center gap-1 transition-all cursor-pointer"
                        title="Badge d'Accès Sécurisé"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Badge</span>
                      </button>

                      {canEdit && (
                        <button
                          onClick={() => handleOpenEditStaff(s)}
                          className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400  cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => onDeleteStaff(s.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STAFF / TEACHER ACCESS BADGE MODAL */}
      {selectedPersonForBadge && (
        <StaffBadgeModal
          person={selectedPersonForBadge.person}
          type={selectedPersonForBadge.type}
          schoolConfig={schoolConfig}
          currentRole={currentRole}
          onClose={() => setSelectedPersonForBadge(null)}
        />
      )}

      {/* PAYSLIP MODAL */}
      {selectedTeacherForSlip && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-2xl p-6 flex flex-col gap-5">
            <div className="border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3 flex items-start justify-between">
              <div>
                <h3 className="font-black text-blue-600  text-lg">BULLETIN DE PAIE MENSUEL</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 ">
                  {schoolConfig.name || 'Établissement Scolaire'} • {schoolConfig.city || 'Brazzaville'}
                </p>
              </div>
              <span className="bg-blue-50  text-blue-600  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  text-xs font-bold px-2 py-1 rounded-md">
                VIREMENT VALIDÉ
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50  p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 ">Nom du Bénéficiaire :</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 ">{selectedTeacherForSlip.prenom} {selectedTeacherForSlip.nom}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 ">Matricule :</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-100 ">{selectedTeacherForSlip.matricule}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 ">Statut :</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100 ">{selectedTeacherForSlip.statut}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 ">Heures Prestées :</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 ">{selectedTeacherForSlip.heuresEffectuees} heures</p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50  p-2.5 font-bold flex justify-between text-slate-800 dark:text-slate-100 ">
                <span>Rubrique de Rémunération</span>
                <span>Montant Net</span>
              </div>
              <div className="p-3 divide-y divide-slate-100  flex flex-col gap-2">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 ">Salaire de base</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 ">{selectedTeacherForSlip.salaireMensuel.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 ">Prime d'exercice & transport</span>
                  <span className="font-semibold text-blue-600 ">+ 25 000 FCFA</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500 dark:text-slate-400 ">
                  <span>Cotisation CNSS Congo (4%)</span>
                  <span className="font-semibold text-rose-600 ">- {(selectedTeacherForSlip.salaireMensuel * 0.04).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-sm text-blue-600  border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
                  <span>NET À PAYER AU SALARIÉ</span>
                  <span className="text-blue-600  font-extrabold">
                    {(selectedTeacherForSlip.salaireMensuel + 25000 - (selectedTeacherForSlip.salaireMensuel * 0.04)).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 ">
              <button
                onClick={() => setSelectedTeacherForSlip(null)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50  hover:bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100  rounded-xl text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimer Bulletin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT TEACHER MODAL */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3">
              <h3 className="font-bold text-base">
                {editingTeacher ? 'Modifier l\'Enseignant' : 'Ajouter un Nouvel Enseignant'}
              </h3>
              <button onClick={() => setShowTeacherModal(false)} className="p-1 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: OKEMBA"
                    value={tNom}
                    onChange={(e) => setTNom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean-Claude"
                    value={tPrenom}
                    onChange={(e) => setTPrenom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Spécialité / Discipline *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mathématiques & Physique"
                    value={tSpecialite}
                    onChange={(e) => setTSpecialite(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Statut Contractuel</label>
                  <select
                    value={tStatut}
                    onChange={(e) => setTStatut(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Vacataire">Vacataire</option>
                    <option value="Temps Partiel">Temps Partiel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Téléphone (+242) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+242 06 895 83 77"
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Salaire Mensuel (FCFA)</label>
                  <input
                    type="number"
                    step="5000"
                    value={tSalaire}
                    onChange={(e) => setTSalaire(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Classes Assignées</label>
                <input
                  type="text"
                  placeholder="Ex: 6ème A, 5ème B, 3ème C"
                  value={tClasses}
                  onChange={(e) => setTClasses(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex flex-col sm:flex-row items-center justify-between gap-3">
                <AutoSaveIndicator
                  lastSavedTime={autoSaveTeacher.lastSavedTime}
                  isSaving={autoSaveTeacher.isSaving}
                  hasDraft={autoSaveTeacher.hasDraft}
                  savedDraftDate={autoSaveTeacher.savedDraftDate}
                  onRestoreDraft={autoSaveTeacher.restoreDraft}
                  onClearDraft={autoSaveTeacher.clearDraft}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTeacherModal(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-500 dark:text-slate-400  hover:bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    {editingTeacher ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT STAFF MODAL */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3">
              <h3 className="font-bold text-base">
                {editingStaff ? 'Modifier le Personnel' : 'Ajouter un Personnel Administratif'}
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="p-1 rounded-lg hover:bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: LOUBAMBA"
                    value={sNom}
                    onChange={(e) => setSNom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Estelle"
                    value={sPrenom}
                    onChange={(e) => setSPrenom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Fonction / Poste *</label>
                  <select
                    value={sRole}
                    onChange={(e) => setSRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="Directeur Général">Directeur Général</option>
                    <option value="Directeur des Études">Directeur des Études</option>
                    <option value="Surveillant Général">Surveillant Général</option>
                    <option value="Secrétaire Général(e)">Secrétaire Général(e)</option>
                    <option value="Économe / Comptable">Économe / Comptable</option>
                    <option value="Informaticien / Webmestre">Informaticien / Webmestre</option>
                    <option value="Bibliothécaire">Bibliothécaire</option>
                    <option value="Infirmier(ère) Scolaire">Infirmier(ère) Scolaire</option>
                    <option value="Agent de Sécurité">Agent de Sécurité</option>
                    <option value="Autre Personnel Administratif">Autre Personnel</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Département *</label>
                  <select
                    value={sDepartement}
                    onChange={(e) => setSDepartement(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="Direction">Direction</option>
                    <option value="Secrétariat & Scolarité">Secrétariat & Scolarité</option>
                    <option value="Vie Scolaire & Discipline">Vie Scolaire & Discipline</option>
                    <option value="Comptabilité & Caisse">Comptabilité & Caisse</option>
                    <option value="Santé & Médical">Santé & Médical</option>
                    <option value="Sécurité & Logistique">Sécurité & Logistique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Téléphone (+242) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+242 06 895 83 77"
                    value={sPhone}
                    onChange={(e) => setSPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Salaire Mensuel (FCFA)</label>
                  <input
                    type="number"
                    step="5000"
                    value={sSalaire}
                    onChange={(e) => setSSalaire(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50  border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  rounded-xl px-3 py-2 font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex flex-col sm:flex-row items-center justify-between gap-3">
                <AutoSaveIndicator
                  lastSavedTime={autoSaveStaff.lastSavedTime}
                  isSaving={autoSaveStaff.isSaving}
                  hasDraft={autoSaveStaff.hasDraft}
                  savedDraftDate={autoSaveStaff.savedDraftDate}
                  onRestoreDraft={autoSaveStaff.restoreDraft}
                  onClearDraft={autoSaveStaff.clearDraft}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStaffModal(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-500 dark:text-slate-400  hover:bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    {editingStaff ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
