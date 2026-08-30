import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CreditCard, 
  FileCheck, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  Award,
  Lock
} from 'lucide-react';
import { Student, SchoolConfig, ClassLevelConfig, SchoolCycle, UserRole, GradeEntry } from '../../types';
import { StudentCardModal } from '../modals/StudentCardModal';
import { SchoolCertificateModal } from '../modals/SchoolCertificateModal';
import { ReportCardModal } from '../modals/ReportCardModal';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface StudentsModuleProps {
  students: Student[];
  schoolConfig: SchoolConfig;
  classesConfig: ClassLevelConfig[];
  grades: GradeEntry[];
  currentRole: UserRole;
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({
  students,
  schoolConfig,
  classesConfig,
  grades,
  currentRole,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<Student>>({
    matricule: '',
    nom: '',
    prenom: '',
    genre: 'M',
    dateNaissance: '2012-05-14',
    lieuNaissance: 'Brazzaville',
    cycle: 'primaire',
    classe: classesConfig[0]?.name || 'CP1 A',
    nomParent: '',
    telephoneParent: '+242 06 ',
    emailParent: '',
    adresseParent: 'Brazzaville',
    fraisTotal: 250000,
    fraisPayes: 0,
    photoUrl: ''
  });

  // Periodic AutoSave for student form draft
  const autoSave = useFormAutoSave<Partial<Student>>({
    storageKey: `edu_draft_student_${schoolConfig.name || 'default'}`,
    formData: form,
    setFormData: (val) => setForm(val),
    intervalMs: 2500,
    enabled: showAddModal
  });

  const canEdit = currentRole === 'direction' || currentRole === 'administration' || currentRole === 'superadmin';
  const canDelete = currentRole === 'direction' || currentRole === 'superadmin';

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nomParent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCycle = selectedCycle === 'all' || s.cycle === selectedCycle;
    const matchesClass = selectedClass === 'all' || s.classe === selectedClass;

    return matchesSearch && matchesCycle && matchesClass;
  });

  const generateMatricule = (cycleName: string) => {
    const yearPrefix = new Date().getFullYear().toString().slice(2);
    const cycleCode = (cycleName || 'GEN').slice(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${yearPrefix}-${cycleCode}-${randomNum}`;
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const initialCycle: SchoolCycle = 'primaire';
    const firstClass = classesConfig.find(c => c.cycle === initialCycle)?.name || classesConfig[0]?.name || 'Classe 1';
    
    setForm({
      matricule: generateMatricule(initialCycle),
      nom: '',
      prenom: '',
      genre: 'M',
      dateNaissance: '2012-01-01',
      lieuNaissance: schoolConfig.city || 'Brazzaville',
      cycle: initialCycle,
      classe: firstClass,
      nomParent: '',
      telephoneParent: '+242 06 ',
      emailParent: '',
      adresseParent: schoolConfig.commune || 'Brazzaville',
      fraisTotal: 250000,
      fraisPayes: 0,
      photoUrl: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setForm({ ...student });
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.classe) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...form
      } as Student);
    } else {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        matricule: form.matricule || generateMatricule(form.cycle || 'primaire'),
        nom: form.nom.toUpperCase().trim(),
        prenom: form.prenom.trim(),
        genre: form.genre || 'M',
        dateNaissance: form.dateNaissance || '01/01/2012',
        lieuNaissance: form.lieuNaissance || 'Brazzaville',
        cycle: form.cycle as SchoolCycle,
        classe: form.classe,
        nomParent: form.nomParent || 'Parent / Tuteur',
        telephoneParent: form.telephoneParent || '+242 06 000 00 00',
        emailParent: form.emailParent || '',
        adresseParent: form.adresseParent || 'Brazzaville',
        fraisTotal: Number(form.fraisTotal) || 250000,
        fraisPayes: Number(form.fraisPayes) || 0,
        photoUrl: form.photoUrl || '',
        pinCode: Math.floor(100000 + Math.random() * 900000).toString(),
        parentPinCode: Math.floor(1000 + Math.random() * 9000).toString()
      };
      onAddStudent(newStudent);
    }
    autoSave.clearDraft();
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white  rounded-lg p-4 sm:p-6 border border-[#E4E6EB]  shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#E7F3FF]  text-[#1877F2]  flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#050505] ">
              Gestion des Élèves & Inscriptions Scolaires
            </h2>
            <p className="text-xs text-[#65676B]  mt-0.5">
              Enregistrez les élèves, délivrez les cartes scolaires plastifiées, certificats officiels et bulletins.
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="w-full md:w-auto px-4 py-2.5 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Inscrire un Nouvel Élève
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white  rounded-lg p-4 border border-[#E4E6EB]  shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#65676B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#050505]  focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Cycle filter */}
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 text-xs font-semibold text-[#050505] "
          >
            <option value="all">Tous les Cycles</option>
            <option value="maternelle">Maternel</option>
            <option value="primaire">Primaire</option>
            <option value="college">Collège</option>
            <option value="lycee">Lycée</option>
            <option value="formation_pro">Formation Pro</option>
          </select>

          {/* Class filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 text-xs font-semibold text-[#050505] "
          >
            <option value="all">Toutes les Classes</option>
            {classesConfig.map((cls) => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-[#65676B]  px-2">
            {filteredStudents.length} Élève(s)
          </span>
        </div>
      </div>

      {/* Students Table / Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white  rounded-lg p-12 border-2 border-dashed border-[#E4E6EB]  text-center">
          <Users className="w-12 h-12 text-[#65676B] mx-auto mb-3" />
          <h3 className="font-bold text-sm text-[#050505] ">Aucun élève inscrit</h3>
          <p className="text-xs text-[#65676B]  mt-1 max-w-sm mx-auto">
            Utilisez le bouton "Inscrire un Nouvel Élève" pour enregistrer les premiers effectifs de l'établissement.
          </p>
          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Inscrire le 1er élève
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white  rounded-lg border border-[#E4E6EB]  shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F0F2F5]  text-[#050505]  font-bold border-b border-[#E4E6EB] ">
                  <th className="p-3.5">Élève</th>
                  <th className="p-3.5">Matricule</th>
                  <th className="p-3.5">Classe & Cycle</th>
                  <th className="p-3.5">Parent / Tuteur</th>
                  <th className="p-3.5 text-right">Frais Scolaires</th>
                  <th className="p-3.5 text-center">Documents & Cartes</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 ">
                {filteredStudents.map((student) => {
                  const paymentRatio = student.fraisTotal > 0 ? (student.fraisPayes / student.fraisTotal) * 100 : 100;
                  const isPaidFull = student.fraisPayes >= student.fraisTotal;

                  return (
                    <tr key={student.id} className="hover:bg-[#F0F2F5]">
                      
                      {/* Élève */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#E7F3FF]  text-[#1877F2]  font-black flex items-center justify-center text-xs overflow-hidden border border-[#E4E6EB] ">
                            {student.photoUrl ? (
                              <img src={student.photoUrl} alt={student.nom} className="w-full h-full object-cover" />
                            ) : (
                              <span>{student.nom[0]}{student.prenom[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#050505]  uppercase leading-tight">
                              {student.nom} <span className="capitalize text-[#050505]  font-bold">{student.prenom}</span>
                            </p>
                            <span className="text-[10px] text-[#65676B] ">
                              {student.genre === 'M' ? 'Masculin' : 'Féminin'} • Né(e) le {student.dateNaissance}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Matricule */}
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-[#1877F2]  bg-[#E7F3FF]  px-2 py-1 rounded-md border border-[#E4E6EB] ">
                          {student.matricule}
                        </span>
                      </td>

                      {/* Classe & Cycle */}
                      <td className="p-3.5">
                        <div>
                          <span className="font-bold text-[#050505]  block">{student.classe}</span>
                          <span className="text-[10px] text-[#65676B] uppercase font-semibold">{student.cycle || 'Général'}</span>
                        </div>
                      </td>

                      {/* Parent / Tuteur */}
                      <td className="p-3.5">
                        <div>
                          <span className="font-semibold text-[#050505]  block">{student.nomParent}</span>
                          <span className="text-[10px] font-mono text-[#65676B]">{student.telephoneParent}</span>
                        </div>
                      </td>

                      {/* Frais Scolaires */}
                      <td className="p-3.5 text-right">
                        <div>
                          <span className="font-mono font-bold text-[#050505]  block">
                            {student.fraisPayes.toLocaleString()} / {student.fraisTotal.toLocaleString()} FCFA
                          </span>
                          <span className={`text-[10px] font-bold ${isPaidFull ? 'text-[#1877F2]' : 'text-amber-600'}`}>
                            {paymentRatio.toFixed(0)}% réglé
                          </span>
                        </div>
                      </td>

                      {/* Documents & Cartes Buttons */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Carte Scolaire */}
                          <button
                            onClick={() => setSelectedStudentForCard(student)}
                            className="p-1.5 rounded-lg bg-[#E7F3FF]  border border-[#E4E6EB]  text-[#1877F2]  hover:bg-[#E7F3FF][#1877F2] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="Générer Carte Scolaire"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Carte</span>
                          </button>

                          {/* Certificat de Scolarité */}
                          <button
                            onClick={() => setSelectedStudentForCert(student)}
                            className="p-1.5 rounded-lg bg-[#E7F3FF]  border border-[#E4E6EB]  text-[#1877F2]  hover:bg-[#E7F3FF][#1877F2] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="Certificat de Scolarité"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Certificat</span>
                          </button>

                          {/* Bulletin */}
                          <button
                            onClick={() => setSelectedStudentForReport(student)}
                            className="p-1.5 rounded-lg bg-purple-50  border border-purple-200  text-purple-600  hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="Bulletin de Notes"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Bulletin</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {canEdit && (
                            <button
                              onClick={() => handleOpenEdit(student)}
                              className="p-1.5 rounded-lg hover:bg-[#F0F2F5] text-[#65676B]  transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => onDeleteStudent(student.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white  text-[#050505]  w-full max-w-2xl rounded-lg shadow-2xl border border-[#E4E6EB]  p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-[#E4E6EB]  pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1877F2] " />
                {editingStudent ? 'Modifier le Dossier Élève' : 'Inscription d\'un Nouvel Élève'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-[#F0F2F5] text-[#65676B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              
              {/* Identity Section */}
              <div>
                <span className="font-bold uppercase tracking-wider text-[#1877F2]  block mb-2">
                  1. Identité de l'Élève
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Nom de Famille *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: MBOUNGOU"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Prénom(s) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Grace Archange"
                      value={form.prenom}
                      onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Genre / Sexe *</label>
                    <select
                      value={form.genre}
                      onChange={(e) => setForm({ ...form, genre: e.target.value as 'M' | 'F' })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    >
                      <option value="M">Masculin (M)</option>
                      <option value="F">Féminin (F)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="font-semibold block mb-1">Date de Naissance</label>
                    <input
                      type="date"
                      value={form.dateNaissance}
                      onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Lieu de Naissance</label>
                    <input
                      type="text"
                      placeholder="Ex: Brazzaville (Talangaï)"
                      value={form.lieuNaissance}
                      onChange={(e) => setForm({ ...form, lieuNaissance: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Matricule Automatique</label>
                    <input
                      type="text"
                      value={form.matricule}
                      onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Cycle & Class Section */}
              <div className="pt-2 border-t border-[#E4E6EB] ">
                <span className="font-bold uppercase tracking-wider text-[#1877F2]  block mb-2">
                  2. Orientation Pédagogique & Classe
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Cycle d'Enseignement *</label>
                    <select
                      value={form.cycle}
                      onChange={(e) => {
                        const newCycle = e.target.value as SchoolCycle;
                        const firstCls = classesConfig.find(c => c.cycle === newCycle)?.name || classesConfig[0]?.name || '';
                        setForm({ ...form, cycle: newCycle, classe: firstCls });
                      }}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    >
                      <option value="maternelle">Maternel</option>
                      <option value="primaire">Primaire</option>
                      <option value="college">Collège</option>
                      <option value="lycee">Lycée</option>
                      <option value="formation_pro">Formation Professionnelle</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Classe Assignée *</label>
                    <select
                      value={form.classe}
                      onChange={(e) => setForm({ ...form, classe: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    >
                      {classesConfig
                        .filter(c => !form.cycle || c.cycle === form.cycle)
                        .map(c => (
                          <option key={c.id} value={c.name}>{c.name} ({c.cycle})</option>
                        ))}
                      {classesConfig.length === 0 && (
                        <option value="Classe Par Défaut">Classe 1 (À configurer dans Réglages)</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Parents Section */}
              <div className="pt-2 border-t border-[#E4E6EB] ">
                <span className="font-bold uppercase tracking-wider text-[#1877F2]  block mb-2">
                  3. Parents & Contact d'Urgence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Nom du Parent / Tuteur *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: M. MBOUNGOU Guy"
                      value={form.nomParent}
                      onChange={(e) => setForm({ ...form, nomParent: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Téléphone (+242) *</label>
                    <input
                      type="text"
                      required
                      placeholder="+242 06 895 83 77"
                      value={form.telephoneParent}
                      onChange={(e) => setForm({ ...form, telephoneParent: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Email du Parent</label>
                    <input
                      type="email"
                      placeholder="parent@gmail.com"
                      value={form.emailParent}
                      onChange={(e) => setForm({ ...form, emailParent: e.target.value })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Financials & Photo */}
              <div className="pt-2 border-t border-[#E4E6EB] ">
                <span className="font-bold uppercase tracking-wider text-[#1877F2]  block mb-2">
                  4. Écolage & Frais de Scolarité
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Total Frais Annuel (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={form.fraisTotal}
                      onChange={(e) => setForm({ ...form, fraisTotal: Number(e.target.value) })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Acompte / Montant Déjà Versé (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={form.fraisPayes}
                      onChange={(e) => setForm({ ...form, fraisPayes: Number(e.target.value) })}
                      className="w-full bg-[#F0F2F5]  border border-[#E4E6EB]  rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E6EB]  flex flex-col sm:flex-row items-center justify-between gap-3">
                <AutoSaveIndicator
                  lastSavedTime={autoSave.lastSavedTime}
                  isSaving={autoSave.isSaving}
                  hasDraft={autoSave.hasDraft}
                  savedDraftDate={autoSave.savedDraftDate}
                  onRestoreDraft={autoSave.restoreDraft}
                  onClearDraft={autoSave.clearDraft}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#050505]  hover:bg-[#F0F2F5] cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1877F2] hover:bg-[#1877F2] text-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    {editingStudent ? 'Enregistrer les Modifications' : 'Valider l\'Inscription'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* STUDENT ID CARD MODAL */}
      {selectedStudentForCard && (
        <StudentCardModal
          student={selectedStudentForCard}
          schoolConfig={schoolConfig}
          currentRole={currentRole}
          onClose={() => setSelectedStudentForCard(null)}
        />
      )}

      {/* SCHOOL CERTIFICATE MODAL */}
      {selectedStudentForCert && (
        <SchoolCertificateModal
          student={selectedStudentForCert}
          schoolConfig={schoolConfig}
          currentRole={currentRole}
          onClose={() => setSelectedStudentForCert(null)}
        />
      )}

      {/* REPORT CARD MODAL */}
      {selectedStudentForReport && (
        <ReportCardModal
          student={selectedStudentForReport}
          grades={grades}
          schoolConfig={schoolConfig}
          currentRole={currentRole}
          onClose={() => setSelectedStudentForReport(null)}
        />
      )}

    </div>
  );
};
