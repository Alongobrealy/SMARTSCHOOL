import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Briefcase, 
  Calculator, 
  CreditCard, 
  Calendar, 
  FileText, 
  PieChart, 
  Globe, 
  Bell, 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  TrendingUp, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut,
  Award,
  Sparkles,
  Phone,
  Layers,
  MessageCircle,
  Mail,
  Headphones,
  School,
  Terminal,
  Key,
  Lock,
  Unlock,
  Sliders
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
  UserRole, 
  Student, 
  Teacher, 
  StaffMember,
  AttendanceRecord, 
  GradeEntry, 
  FeePayment, 
  ExpenseItem, 
  Announcement, 
  CourseSchedule,
  TenantSchool,
  SystemLogEntry,
  ApiGatewayStatus,
  SystemFeatureFlag,
  SchoolConfig,
  ClassLevelConfig,
  RolePermission,
  SubscriptionRequest
} from '../types';
import { AttendanceModule } from './modules/AttendanceModule';
import { GradesModule } from './modules/GradesModule';
import { FeesModule } from './modules/FeesModule';
import { AccountingModule } from './modules/AccountingModule';
import { HRModule } from './modules/HRModule';
import { ClassesModule } from './modules/ClassesModule';
import { PublicPortalModule } from './modules/PublicPortalModule';
import { DeveloperSuperAdminModule } from './modules/DeveloperSuperAdminModule';
import { SchoolSettingsModule } from './modules/SchoolSettingsModule';
import { StudentsModule } from './modules/StudentsModule';
import { ReportCardModal } from './modals/ReportCardModal';
import { DeveloperAuthModal } from './modals/DeveloperAuthModal';
import { DashboardAnalyticsCharts } from './dashboard/DashboardAnalyticsCharts';
import { MonthlyPaymentAnalyticsCharts } from './dashboard/MonthlyPaymentAnalyticsCharts';
import { OverdueFeesAlertWidget } from './dashboard/OverdueFeesAlertWidget';
import { ThemeToggle } from './ThemeToggle';

import { calculateLicenseStatus } from '../utils/licenseManager';
import { LicenseWarningBanner } from './dashboard/LicenseWarningBanner';
import { AccessGuard } from './AccessGuard';
import { FeeRevenueChart } from './dashboard/FeeRevenueChart';
import { NetworkStatusBanner } from './pwa/NetworkStatusBanner';
import { PwaInstallPrompt } from './pwa/PwaInstallPrompt';

interface DashboardLayoutProps {
  currentRole: UserRole;
  initialTab?: string;
  schoolName?: string;
  schoolId?: string;
  schoolConfig: SchoolConfig;
  classesConfig: ClassLevelConfig[];
  rolePermissions: RolePermission[];
  staff: StaffMember[];
  onChangeRole: (role: UserRole) => void;
  onBackToFlyer: () => void;
  onLogout?: () => void;
  onOpenSubscriptionModal?: () => void;
  onTabChange?: (tab: string) => void;
  onSelectSchool?: (schoolId: string, schoolName: string) => void;
  students: Student[];
  teachers: Teacher[];
  attendanceList: AttendanceRecord[];
  grades: GradeEntry[];
  payments: FeePayment[];
  expenses: ExpenseItem[];
  announcements: Announcement[];
  schedules: CourseSchedule[];
  tenants: TenantSchool[];
  logs: SystemLogEntry[];
  gateways: ApiGatewayStatus[];
  featureFlags: SystemFeatureFlag[];
  subscriptionRequests?: SubscriptionRequest[];
  onOpenApprovalModal?: (req: SubscriptionRequest) => void;
  onOpenUpgradeModal?: () => void;
  onUpdateSchoolConfig: (config: SchoolConfig) => void;
  onAddClass: (cls: ClassLevelConfig) => void;
  onUpdateClass: (cls: ClassLevelConfig) => void;
  onDeleteClass: (classId: string) => void;
  onUpdateRolePermissions: (permissions: RolePermission[]) => void;
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddStaff: (staffMember: StaffMember) => void;
  onUpdateStaff: (staffMember: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
  onUpdateAttendance: (newRecords: AttendanceRecord[]) => void;
  onAddGrade: (grade: GradeEntry) => void;
  onUpdateGrade: (grade: GradeEntry) => void;
  onAddPayment: (payment: FeePayment) => void;
  onAddExpense: (expense: ExpenseItem) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  onAddSchedule: (schedule: CourseSchedule) => void;
  onAddTenant: (tenant: TenantSchool) => void;
  onUpdateTenant: (tenant: TenantSchool) => void;
  onDeleteTenant: (tenantId: string) => void;
  onToggleFeatureFlag: (flagId: string) => void;
  onAddLog: (log: SystemLogEntry) => void;
  onClearLogs: () => void;
  onImpersonateSchool: (schoolName: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentRole,
  initialTab = 'dashboard',
  schoolName = 'Établissement Scolaire (À Configurer)',
  schoolId = '',
  schoolConfig,
  classesConfig,
  rolePermissions,
  staff = [],
  onChangeRole,
  onBackToFlyer,
  onLogout,
  onOpenSubscriptionModal,
  onTabChange,
  onSelectSchool,
  students,
  teachers,
  attendanceList,
  grades,
  payments,
  expenses,
  announcements,
  schedules,
  tenants,
  logs,
  gateways,
  featureFlags,
  subscriptionRequests = [],
  onOpenApprovalModal,
  onOpenUpgradeModal,
  onUpdateSchoolConfig,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onUpdateRolePermissions,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdateAttendance,
  onAddGrade,
  onUpdateGrade,
  onAddPayment,
  onAddExpense,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddAnnouncement,
  onAddSchedule,
  onAddTenant,
  onUpdateTenant,
  onDeleteTenant,
  onToggleFeatureFlag,
  onAddLog,
  onClearLogs,
  onImpersonateSchool
}) => {
  const [activeTab, setActiveTabState] = useState<string>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedStudentBulletin, setSelectedStudentBulletin] = useState<Student | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showDevAuthModal, setShowDevAuthModal] = useState<boolean>(false);
  const [isDevUnlocked, setIsDevUnlocked] = useState<boolean>(currentRole === 'superadmin');

  // Detect Trial status
  const activeTenant = tenants.find(t => t.id === schoolId || t.name.toLowerCase() === (schoolConfig.name || schoolName).toLowerCase()) || tenants[0];
  const isTrial = Boolean(activeTenant?.isTrial || activeTenant?.plan === 'Essai 14 Jours' || (schoolConfig as any)?.plan === 'Essai 14 Jours');

  const getTrialDaysRemaining = () => {
    if (!activeTenant?.trialExpiresAt) return 14;
    const diff = new Date(activeTenant.trialExpiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Sync internal activeTab with external props
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const licenseInfo = calculateLicenseStatus(activeTenant);

  // Intercept write operations if suspended
  const withSuspensionCheck = <T extends (...args: any[]) => any>(fn: T, actionName: string): T => {
    return ((...args: Parameters<T>) => {
      if (licenseInfo.isSuspended && currentRole !== 'superadmin') {
        alert(`ACCÈS RESTREINT (LICENCE SUSPENDUE)\n\nL'établissement a dépassé sa date limite d'abonnement (y compris la période de grâce de 7 jours).\n\nL'action "${actionName}" est temporairement bloquée en écriture.\n\nVeuillez régulariser votre abonnement pour débloquer toutes les fonctionnalités.`);
        return;
      }
      return fn(...args);
    }) as T;
  };

  // Scoped multi-tenant data calculation
  const activeSchoolId = schoolId || 'ten-1';
  const isSuperAdminGlobal = currentRole === 'superadmin' && activeSchoolId === 'all';

  const scopedStudents = isSuperAdminGlobal 
    ? students 
    : students.filter(s => s.schoolId === activeSchoolId || (!s.schoolId && activeSchoolId === 'ten-1'));
  
  const scopedTeachers = isSuperAdminGlobal 
    ? teachers 
    : teachers.filter(t => t.schoolId === activeSchoolId || (!t.schoolId && activeSchoolId === 'ten-1'));

  const scopedStaff = isSuperAdminGlobal
    ? staff
    : staff.filter(st => st.schoolId === activeSchoolId || (!st.schoolId && activeSchoolId === 'ten-1'));

  const scopedAttendance = isSuperAdminGlobal 
    ? attendanceList 
    : attendanceList.filter(a => a.schoolId === activeSchoolId || (!a.schoolId && activeSchoolId === 'ten-1'));

  const scopedGrades = isSuperAdminGlobal 
    ? grades 
    : grades.filter(g => g.schoolId === activeSchoolId || (!g.schoolId && activeSchoolId === 'ten-1'));

  const scopedPayments = isSuperAdminGlobal 
    ? payments 
    : payments.filter(p => p.schoolId === activeSchoolId || (!p.schoolId && activeSchoolId === 'ten-1'));

  const scopedExpenses = isSuperAdminGlobal 
    ? expenses 
    : expenses.filter(e => e.schoolId === activeSchoolId || (!e.schoolId && activeSchoolId === 'ten-1'));

  const scopedAnnouncements = isSuperAdminGlobal 
    ? announcements 
    : announcements.filter(anc => anc.schoolId === activeSchoolId || (!anc.schoolId && activeSchoolId === 'ten-1'));

  const scopedSchedules = isSuperAdminGlobal 
    ? schedules 
    : schedules.filter(sch => sch.schoolId === activeSchoolId || (!sch.schoolId && activeSchoolId === 'ten-1'));

  // Role metadata
  const roleConfig: Record<UserRole, { label: string; icon: any; color: string; badge: string }> = {
    direction: { label: 'Direction Générale', icon: Briefcase, color: 'text-purple-400 bg-purple-950/60 border-purple-800', badge: 'Superviseur Global' },
    administration: { label: 'Secrétariat & Scolarité', icon: Building2, color: 'text-blue-400 bg-blue-950/60 border-blue-800', badge: 'Gestion Administrative' },
    enseignant: { label: 'Espace Professeur', icon: UserCheck, color: 'text-[#1877F2] bg-indigo-950/60 border-[#E4E6EB]', badge: 'Appel, Notes & Cours' },
    parent: { label: 'Espace Parents d’Élèves', icon: Users, color: 'text-[#1877F2] bg-emerald-950/60 border-[#E4E6EB]', badge: 'Suivi de l’Enfant' },
    eleve: { label: 'Espace Élève', icon: GraduationCap, color: 'text-sky-400 bg-sky-950/60 border-sky-800', badge: 'Cours, Notes & Devoirs' },
    comptabilite: { label: 'Service Comptabilité & Caisse', icon: Calculator, color: 'text-amber-400 bg-amber-950/60 border-amber-800', badge: 'Recouvrement & Bilans' },
    superadmin: { label: 'Super Admin Développeur', icon: Terminal, color: 'text-rose-400 bg-rose-950/60 border-rose-800', badge: 'DevOps & Multi-Écoles' },
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: PieChart, roles: ['direction', 'administration', 'comptabilite', 'parent', 'eleve', 'enseignant', 'superadmin'] },
    { id: 'config', label: 'Configuration & Cycles', icon: Sliders, roles: ['direction', 'administration', 'superadmin'] },
    { id: 'eleves', label: 'Gestion des Élèves', icon: Users, roles: ['direction', 'administration', 'comptabilite', 'enseignant', 'parent', 'eleve', 'superadmin'] },
    { id: 'presence', label: 'Présence en Classe', icon: UserCheck, roles: ['direction', 'administration', 'enseignant', 'parent', 'superadmin'] },
    { id: 'notes', label: 'Notes & Bulletins', icon: FileText, roles: ['direction', 'administration', 'enseignant', 'parent', 'eleve', 'superadmin'] },
    { id: 'frais', label: 'Frais Scolaires & Caisse', icon: CreditCard, roles: ['direction', 'administration', 'comptabilite', 'parent', 'superadmin'] },
    { id: 'comptabilite', label: 'Comptabilité & Bilans', icon: Calculator, roles: ['direction', 'comptabilite', 'superadmin'] },
    { id: 'rh', label: 'Personnel, RH & Badges', icon: Briefcase, roles: ['direction', 'administration', 'superadmin'] },
    { id: 'classes', label: 'Classes & Horaires', icon: Calendar, roles: ['direction', 'administration', 'enseignant', 'eleve', 'superadmin'] },
    { id: 'public', label: 'Portail Web & Proclamation', icon: Globe, roles: ['direction', 'administration', 'enseignant', 'parent', 'eleve', 'comptabilite', 'superadmin'] },
    { id: 'superadmin', label: 'Console Développeur', icon: Terminal, roles: ['superadmin'] },
  ];

  const handleRoleSelectChange = (newRole: UserRole) => {
    if (newRole === 'superadmin') {
      if (!isDevUnlocked) {
        setShowDevAuthModal(true);
        return;
      }
      onChangeRole('superadmin');
      setActiveTab('superadmin');
    } else {
      onChangeRole(newRole);
      if (activeTab === 'superadmin') {
        setActiveTab('dashboard');
      }
    }
  };

  const handleDevAuthSuccess = () => {
    setIsDevUnlocked(true);
    setShowDevAuthModal(false);
    onChangeRole('superadmin');
    setActiveTab('superadmin');
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  // Compute live stats
  const totalFeesExpected = scopedStudents.reduce((sum, s) => sum + s.fraisTotal, 0);
  const totalFeesCollected = scopedStudents.reduce((sum, s) => sum + s.fraisPayes, 0);
  const recoveryRate = totalFeesExpected > 0 ? Math.round((totalFeesCollected / totalFeesExpected) * 100) : 0;
  const currentStudent = scopedStudents[0] || students[0]; // For parent / eleve view

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1E293B] flex flex-col font-sans transition-colors duration-200">
      
      
      {/* Mobile Menu Toggle (Floating) */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-4 rounded-full bg-[#1877F2] text-white shadow-lg cursor-pointer"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Global Offline Network Status Banner */}

      <NetworkStatusBanner variant="banner" />

      {/* DEVELOPER CONTROL MODE BANNER WITH RETURN BUTTON */}
      {isDevUnlocked && currentRole !== 'superadmin' && (
        <div className="bg-[#1877F2] border-b border-amber-500/50 px-4 sm:px-6 py-2.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-lg bg-amber-400 animate-pulse shrink-0" />
            <span className="font-extrabold text-amber-300 tracking-wide">MODE CONTRÔLE DÉVELOPPEUR :</span>
            <span className="text-[#65676B]">
              Prise de contrôle active sur l'établissement <strong>{schoolConfig.name || schoolName}</strong>.
            </span>
          </div>
          
          <button
            id="btn-return-dev-console"
            onClick={() => {
              onChangeRole('superadmin');
              setActiveTab('superadmin');
            }}
            className="px-3.5 py-1.5 bg-[#1877F2] hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            title="Quitter la gestion de cette école et retourner à la Console Développeur Globale"
          >
            <Terminal className="w-4 h-4 text-slate-950" />
            <span>← Retourner à la Console Développeur</span>
          </button>
        </div>
      )}

      {/* App Body (Sidebar + Content) */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <aside className={`md:w-64 shrink-0 flex flex-col gap-4 bg-white rounded-lg p-4 shadow-sm text-[#050505] border border-[#E4E6EB] ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
          
          {/* Logo Header inside sidebar */}
          <div className="flex items-center gap-3 px-2 py-2 border-b border-[#E4E6EB]">
            <div className="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center font-bold text-white text-xs">
              EC
            </div>
            <div>
              <span className="text-[#050505] font-bold text-sm tracking-tight block">EDU-CONGO</span>
              <span className="text-[10px] text-[#1877F2] font-medium block uppercase tracking-wider">Congo-Brazzaville</span>
            </div>
          </div>

          {/* Quick Return to Dev Console in Sidebar */}
          {isDevUnlocked && currentRole !== 'superadmin' && (
            <button
              onClick={() => {
                onChangeRole('superadmin');
                setActiveTab('superadmin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-xs"
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>← Console Développeur</span>
            </button>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-1 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#65676B] px-3 py-1">
              Modules du Logiciel
            </span>

            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1877F2] text-white font-semibold shadow-md shadow-sm'
                      : 'text-[#65676B] hover:text-white hover:bg-[#F0F2F5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Contact Box in Sidebar */}
          <div className="bg-white border border-[#E4E6EB] rounded-xl p-3 text-[11px] text-[#65676B] flex flex-col gap-1.5">
            <span className="font-bold text-white text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5 text-[#1877F2]" /> Support EDU-CONGO
            </span>
            <div className="flex flex-col gap-1 text-[10px]">
              <span className="text-[#1877F2] font-mono">WhatsApp: +242 06 895 83 77</span>
              <span className="text-amber-300 font-mono">Appel: +242 06 169 35 98</span>
              <span className="text-[#65676B] truncate">steph.alongo@gmail.com</span>
            </div>
          </div>


          <div className="border-t border-[#E4E6EB] pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-[#F0F2F5] p-2.5 rounded-lg border border-[#E4E6EB]">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold text-[#1877F2] border border-[#1877F2] shrink-0">
                {React.createElement(roleConfig[currentRole].icon, { className: 'w-4 h-4' })}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#050505] truncate">{roleConfig[currentRole].label}</span>
                <span className="text-[10px] text-[#65676B] uppercase tracking-wider truncate">{roleConfig[currentRole].badge}</span>
              </div>
            </div>
            
            <button
              onClick={onBackToFlyer}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-white hover:bg-[#F0F2F5] text-[#050505] border border-[#E4E6EB] transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour Vitrine</span>
            </button>
            
            <button
              onClick={onLogout || onBackToFlyer}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-[#F0F2F5] hover:bg-[#E4E6EB] text-red-600 border border-red-100 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          
          <div className="p-4 sm:p-6 lg:p-8 pb-0 pt-4 sm:pt-6 lg:pt-8 w-full max-w-7xl mx-auto">
            <LicenseWarningBanner licenseInfo={licenseInfo} />
          </div>

          <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          <AccessGuard
            activeTenant={activeTenant}
            licenseInfo={licenseInfo}
            currentRole={currentRole}
            onOpenApprovalModal={onOpenApprovalModal}
          >
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-6">
              
              {/* Welcome Banner */}
              <div className="relative rounded-lg bg-[#1877F2] border border-[#E4E6EB] p-6 sm:p-7 shadow-sm text-white overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1877F2] uppercase tracking-widest">
                        EDU-CONGO • {roleConfig[currentRole].label}
                      </span>
                      <span className="bg-[#1877F2] text-[#1877F2] border border-[#E4E6EB] text-[10px] px-2 py-0.5 rounded-lg">
                        {schoolConfig.name || schoolName}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      {currentRole === 'parent' ? `Bienvenue, ${currentStudent?.nomParent || 'Parent d\'élève'}` :
                       currentRole === 'eleve' ? `Bienvenue, ${currentStudent?.prenom || 'Élève'} ${currentStudent?.nom || ''}` :
                       'Tableau de Bord de l\'Établissement'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#65676B] mt-1 max-w-xl">
                      {currentRole === 'parent'
                        ? `Suivez l'assiduité, les notes et les frais scolaires de votre enfant (${currentStudent?.classe || 'Classe'}). Consultation en lecture seule.`
                        : currentRole === 'eleve'
                        ? `Consultez votre emploi du temps, vos évaluations et vos notes en ligne.`
                        : `Plateforme prête pour la configuration des cycles, des classes, du personnel et l'enregistrement des élèves.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab(currentRole === 'parent' || currentRole === 'eleve' ? 'notes' : 'config')}
                      className="px-4 py-2.5 bg-[#1877F2] hover:bg-[#1877F2] text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      {currentRole === 'parent' || currentRole === 'eleve' ? 'Consulter le Bulletin' : 'Configurer l\'Établissement'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 14-Day Free Trial Notice Banner (if active) */}
              {isTrial && (
                <div className="p-4 sm:p-5 rounded-lg bg-[#1877F2] border-2 border-amber-400/70  flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-amber-500/20 text-amber-700  flex items-center justify-center font-bold text-xl shrink-0 shadow-xs border border-amber-400/40">
                      🎁
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-[#050505]  text-sm sm:text-base">
                          Période d'Essai 14 Jours Active ({getTrialDaysRemaining()} jours restants)
                        </h4>
                        <span className="bg-[#1877F2] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-xs">
                          Accès 100% Illimité Sans Restriction
                        </span>
                      </div>
                      <p className="text-xs text-[#65676B]  mt-1 max-w-3xl leading-relaxed">
                        Votre établissement bénéficie d'un accès sans aucune limite à tous les modules EDU-CONGO (Bulletins, Notes, Registre, Finances MoMo, Emplois du temps). Vous pouvez choisir et activer votre abonnement officiel à tout moment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <button
                      onClick={onOpenUpgradeModal}
                      className="w-full md:w-auto px-5 py-2.5 bg-[#1877F2] hover:from-amber-600 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Choisir mon Abonnement →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Specific Views based on Role */}
              {currentRole === 'parent' || currentRole === 'eleve' ? (
                /* Parent & Student Dashboard */
                <div className="flex flex-col gap-6">
                  {currentStudent && currentStudent.fraisPayes < currentStudent.fraisTotal && (
                    <div className="p-4 sm:p-5 rounded-lg bg-amber-50  border border-amber-200  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100  text-amber-700  flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-amber-950  text-sm">
                              Rappel de Règlement des Frais Scolaires
                            </h4>
                            <span className="bg-amber-200  text-amber-900  text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Solde : {(currentStudent.fraisTotal - currentStudent.fraisPayes).toLocaleString()} FCFA
                            </span>
                          </div>
                          <p className="text-xs text-amber-900/80  mt-1 max-w-xl">
                            Le paiement des écolages s'effectue au guichet de l'école ou par transfert Mobile Money (MTN MoMo / Airtel Money Congo) avec le numéro matricule <strong>{currentStudent.matricule}</strong>.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('frais')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        Consulter mon compte
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white  p-5 rounded-lg shadow-sm border border-[#E4E6EB]  flex flex-col justify-between gap-3 transition-colors duration-200">
                      <span className="text-[#65676B]  text-xs font-bold uppercase tracking-wider">Assiduité & Présences</span>
                      <div className="text-3xl font-bold text-[#050505] ">100%</div>
                      <div className="text-[#1877F2]  text-xs font-semibold">Présence régulière signalée</div>
                      <button
                        onClick={() => setActiveTab('presence')}
                        className="text-xs text-[#1877F2]  font-semibold hover:underline text-left mt-2 cursor-pointer"
                      >
                        Voir le détail des présences →
                      </button>
                    </div>

                    <div className="bg-white  p-5 rounded-lg shadow-sm border border-[#E4E6EB]  flex flex-col justify-between gap-3 transition-colors duration-200">
                      <span className="text-[#65676B]  text-xs font-bold uppercase tracking-wider">Moyenne & Notes</span>
                      <div className="text-3xl font-bold text-[#050505] ">-- <span className="text-sm font-normal text-[#65676B] ">/20</span></div>
                      <div className="text-[#1877F2]  text-xs font-semibold">Consultation en ligne</div>
                      <button
                        onClick={() => {
                          if (currentStudent) setSelectedStudentBulletin(currentStudent);
                        }}
                        className="text-xs text-[#1877F2]  font-semibold hover:underline text-left mt-2 cursor-pointer"
                      >
                        Ouvrir le bulletin de notes →
                      </button>
                    </div>

                    <div className="bg-white  p-5 rounded-lg shadow-sm border border-[#E4E6EB]  flex flex-col justify-between gap-3 transition-colors duration-200">
                      <span className="text-[#65676B]  text-xs font-bold uppercase tracking-wider">Situation Frais Scolaires</span>
                      <div className="text-3xl font-bold text-[#050505] ">
                        {currentStudent ? `${currentStudent.fraisPayes.toLocaleString()} FCFA` : '0 FCFA'}
                      </div>
                      <div className="text-[#65676B]  text-xs">
                        Total attendu : {currentStudent ? currentStudent.fraisTotal.toLocaleString() : 0} FCFA
                      </div>
                      <button
                        onClick={() => setActiveTab('frais')}
                        className="text-xs text-[#1877F2]  font-semibold hover:underline text-left mt-2 cursor-pointer"
                      >
                        Consulter l'historique des reçus →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Administration / Direction / Comptabilité Dashboard */
                <>
                  {/* PWA Offline Installation Banner */}
                  <PwaInstallPrompt />

                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="bg-white  p-5 rounded-lg border border-[#E4E6EB]  shadow-sm flex items-center justify-between transition-colors duration-200">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#65676B] ">Total Élèves</span>
                        <h3 className="text-2xl font-bold text-[#050505]  mt-1">{scopedStudents.length}</h3>
                        <span className="text-[11px] text-[#1877F2]  font-medium">Inscrits au registre</span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-50  text-blue-600  border border-blue-100  flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white  p-5 rounded-lg border border-[#E4E6EB]  shadow-sm flex items-center justify-between transition-colors duration-200">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#65676B] ">Enseignants & Personnel</span>
                        <h3 className="text-2xl font-bold text-[#050505]  mt-1">{scopedTeachers.length + scopedStaff.length}</h3>
                        <span className="text-[11px] text-[#1877F2]  font-medium">Permanents & Vacataires</span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB]  flex items-center justify-center">
                        <UserCheck className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white  p-5 rounded-lg border border-[#E4E6EB]  shadow-sm flex items-center justify-between transition-colors duration-200">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#65676B] ">Recouvrement Caisse</span>
                        <h3 className="text-2xl font-bold text-[#1877F2]  mt-1">{recoveryRate}%</h3>
                        <span className="text-[11px] text-[#65676B]  font-medium">{totalFeesCollected.toLocaleString()} FCFA encaissés</span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#E7F3FF]  text-[#1877F2]  border border-[#E4E6EB]  flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white  p-5 rounded-lg border border-[#E4E6EB]  shadow-sm flex items-center justify-between transition-colors duration-200">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#65676B] ">Classes Actives</span>
                        <h3 className="text-2xl font-bold text-[#050505]  mt-1">{classesConfig.length}</h3>
                        <span className="text-[11px] text-purple-600  font-medium">Niveaux configurés</span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-50  text-purple-600  border border-purple-100  flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>

                  </div>

                  {/* OVERDUE FEES RECOVERY ALERTS WIDGET */}
                  <OverdueFeesAlertWidget
                    students={scopedStudents}
                    onOpenPaymentModal={() => setActiveTab('frais')}
                    onTriggerRelance={(alert, method) => {
                      onAddLog({
                        id: `LOG-${Date.now()}`,
                        timestamp: new Date().toLocaleTimeString('fr-FR'),
                        level: 'warning',
                        source: 'MOMO_CONGO',
                        message: `[RELANCE ${method.toUpperCase()}] Notification envoyée à ${alert.parentName} (${alert.parentPhone}) pour l'élève ${alert.studentName} (${alert.classe}) - Arriéré : ${alert.remainingDebt.toLocaleString()} FCFA.`,
                        ip: '127.0.0.1 (Brazzaville)',
                        user: roleConfig[currentRole].label
                      });
                    }}
                  />

                  {/* MONTHLY SCHOOL FEES ANALYTICS CHART (RECHARTS) */}
                  <FeeRevenueChart payments={scopedPayments} />
                  
                  <MonthlyPaymentAnalyticsCharts
                    payments={scopedPayments}
                    students={scopedStudents}
                    expenses={scopedExpenses}
                  />

                  {/* VISUAL ANALYTICS CHARTS */}
                  <DashboardAnalyticsCharts 
                    students={scopedStudents}
                    grades={scopedGrades}
                    payments={scopedPayments}
                  />

                  {/* Quick Modules Shortcuts & Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Quick Action Buttons */}
                    <div className="bg-white  p-6 rounded-lg border border-[#E4E6EB]  shadow-sm flex flex-col gap-4 transition-colors duration-200">
                      <h4 className="font-bold text-[#050505]  text-sm">Opérations Principales</h4>
                      
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => setActiveTab('config')}
                          className="p-3 bg-[#F0F2F5]  hover:bg-[#E7F3FF]/50 border border-[#E4E6EB]  hover:border-[#E4E6EB][#E4E6EB] rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <Sliders className="w-4 h-4 text-[#1877F2]  mb-1" />
                          <span className="text-xs font-bold text-[#050505]  group-hover:text-[#1877F2] block">Configuration</span>
                          <span className="text-[10px] text-[#65676B] ">Cycles & Classes</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('eleves')}
                          className="p-3 bg-[#F0F2F5]  hover:bg-blue-50/50 border border-[#E4E6EB]  hover:border-blue-300 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <Users className="w-4 h-4 text-blue-600  mb-1" />
                          <span className="text-xs font-bold text-[#050505]  group-hover:text-blue-600 block">Élèves</span>
                          <span className="text-[10px] text-[#65676B] ">Cartes & Inscriptions</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('rh')}
                          className="p-3 bg-[#F0F2F5]  hover:bg-purple-50/50 border border-[#E4E6EB]  hover:border-purple-300 rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <Briefcase className="w-4 h-4 text-purple-600  mb-1" />
                          <span className="text-xs font-bold text-[#050505]  group-hover:text-purple-600 block">Personnel & RH</span>
                          <span className="text-[10px] text-[#65676B] ">Badges & Salaires</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('frais')}
                          className="p-3 bg-[#F0F2F5]  hover:bg-[#E7F3FF]/50 border border-[#E4E6EB]  hover:border-[#E4E6EB][#E4E6EB] rounded-xl text-left transition-all cursor-pointer group"
                        >
                          <CreditCard className="w-4 h-4 text-[#1877F2]  mb-1" />
                          <span className="text-xs font-bold text-[#050505]  group-hover:text-[#1877F2] block">Encaisser Frais</span>
                          <span className="text-[10px] text-[#65676B] ">Reçu FCFA / MoMo</span>
                        </button>
                      </div>
                    </div>

                    {/* Latest Payments Feed */}
                    <div className="lg:col-span-2 bg-white  p-6 rounded-lg border border-[#E4E6EB]  shadow-sm flex flex-col justify-between gap-4 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#050505]  text-sm">Derniers Encaissements en Caisse (FCFA)</h4>
                        <button
                          onClick={() => setActiveTab('frais')}
                          className="text-xs text-[#1877F2]  font-semibold hover:underline cursor-pointer"
                        >
                          Voir tout l'historique →
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100  text-xs">
                        {scopedPayments.length === 0 ? (
                          <div className="py-6 text-center text-[#65676B]">
                            Aucun encaissement enregistré pour le moment.
                          </div>
                        ) : (
                          scopedPayments.slice(0, 4).map((p) => (
                            <div key={p.id} className="py-2.5 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[#050505]  block">{p.studentName}</span>
                                <span className="text-[11px] text-[#65676B] ">{p.motif} • {p.modePaiement}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#1877F2] ">+{p.montant.toLocaleString()} FCFA</span>
                                <span className="text-[10px] text-[#65676B]  block">{p.datePaiement}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </>
              )}

            </div>
          )}

          {/* TAB 2: CONFIGURATION ÉTABLISSEMENT, CYCLES, CLASSES & PERMISSIONS */}
          {activeTab === 'config' && (
            <SchoolSettingsModule
              schoolConfig={schoolConfig}
              classesConfig={classesConfig}
              rolePermissions={rolePermissions}
              currentRole={currentRole}
              onUpdateSchoolConfig={withSuspensionCheck(onUpdateSchoolConfig, "Mise à jour de la configuration")}
              onAddClass={withSuspensionCheck(onAddClass, "Ajout d'une classe")}
              onUpdateClass={withSuspensionCheck(onUpdateClass, "Modification d'une classe")}
              onDeleteClass={withSuspensionCheck(onDeleteClass, "Suppression d'une classe")}
              onUpdateRolePermissions={withSuspensionCheck(onUpdateRolePermissions, "Mise à jour des permissions")}
            />
          )}

          {/* TAB 3: GESTION DES ÉLÈVES & CARTES SCOLAIRES */}
          {activeTab === 'eleves' && (
            <StudentsModule
              students={scopedStudents}
              schoolConfig={schoolConfig}
              classesConfig={classesConfig}
              grades={scopedGrades}
              currentRole={currentRole}
              onAddStudent={withSuspensionCheck(onAddStudent, "Inscription d'un élève")}
              onUpdateStudent={withSuspensionCheck(onUpdateStudent, "Modification d'un élève")}
              onDeleteStudent={withSuspensionCheck(onDeleteStudent, "Suppression d'un élève")}
            />
          )}

          {/* TAB 4: PRÉSENCE */}
          {activeTab === 'presence' && (
            <AttendanceModule
              students={scopedStudents}
              attendanceList={scopedAttendance}
              onUpdateAttendance={withSuspensionCheck(onUpdateAttendance, "Validation du registre de présence")}
            />
          )}

          {/* TAB 5: NOTES & BULLETINS */}
          {activeTab === 'notes' && (
            <GradesModule
              students={scopedStudents}
              grades={scopedGrades}
              onAddGrade={withSuspensionCheck((g) => onAddGrade({ ...g, schoolId: activeSchoolId }), "Saisie de note")}
              onUpdateGrade={withSuspensionCheck((g) => onUpdateGrade({ ...g, schoolId: activeSchoolId }), "Modification de note")}
            />
          )}

          {/* TAB 6: FRAIS SCOLAIRES */}
          {activeTab === 'frais' && (
            <FeesModule
              students={scopedStudents}
              payments={scopedPayments}
              onAddPayment={withSuspensionCheck((p) => onAddPayment({ ...p, schoolId: activeSchoolId }), "Encaissement de frais scolaires")}
            />
          )}

          {/* TAB 7: COMPTABILITÉ */}
          {activeTab === 'comptabilite' && (
            <AccountingModule
              students={scopedStudents}
              payments={scopedPayments}
              expenses={scopedExpenses}
              onAddExpense={withSuspensionCheck((e) => onAddExpense({ ...e, schoolId: activeSchoolId }), "Saisie d'une dépense")}
            />
          )}

          {/* TAB 8: RH & PERSONNEL */}
          {activeTab === 'rh' && (
            <HRModule
              teachers={scopedTeachers}
              staff={scopedStaff}
              schoolConfig={schoolConfig}
              currentRole={currentRole}
              onAddTeacher={withSuspensionCheck(onAddTeacher, "Ajout d'un enseignant")}
              onUpdateTeacher={withSuspensionCheck(onUpdateTeacher, "Modification d'un enseignant")}
              onDeleteTeacher={withSuspensionCheck(onDeleteTeacher, "Suppression d'un enseignant")}
              onAddStaff={withSuspensionCheck(onAddStaff, "Ajout de personnel")}
              onUpdateStaff={withSuspensionCheck(onUpdateStaff, "Modification de personnel")}
              onDeleteStaff={withSuspensionCheck(onDeleteStaff, "Suppression de personnel")}
            />
          )}

          {/* TAB 9: CLASSES & HORAIRES */}
          {activeTab === 'classes' && (
            <ClassesModule
              schedules={scopedSchedules}
              onAddSchedule={withSuspensionCheck((s) => onAddSchedule({ ...s, schoolId: activeSchoolId }), "Ajout au planning")}
            />
          )}

          {/* TAB 10: PORTAIL PUBLIC */}
          {activeTab === 'public' && (
            <PublicPortalModule
              announcements={scopedAnnouncements}
              students={scopedStudents}
              grades={scopedGrades}
              onAddAnnouncement={withSuspensionCheck((a) => onAddAnnouncement({ ...a, schoolId: activeSchoolId }), "Publication d'annonce")}
            />
          )}

          {/* TAB 11: DEVELOPER / SUPER ADMIN CONSOLE */}
          {activeTab === 'superadmin' && (
            <DeveloperSuperAdminModule
              tenants={tenants}
              logs={logs}
              gateways={gateways}
              featureFlags={featureFlags}
              students={scopedStudents}
              teachers={scopedTeachers}
              payments={scopedPayments}
              subscriptionRequests={subscriptionRequests}
              onOpenApprovalModal={onOpenApprovalModal}
              onAddTenant={onAddTenant}
              onUpdateTenant={onUpdateTenant}
              onDeleteTenant={onDeleteTenant}
              onToggleFeatureFlag={onToggleFeatureFlag}
              onAddLog={onAddLog}
              onClearLogs={onClearLogs}
              onLockSession={() => {
                setIsDevUnlocked(false);
                onChangeRole('direction');
                setActiveTab('dashboard');
              }}
              onImpersonateSchool={(name) => {
                onImpersonateSchool(name);
                onChangeRole('direction');
                setActiveTab('dashboard');
              }}
            />
          )}
          </AccessGuard>

          </div>
        </main>
      </div>

      {/* Developer Super Admin Authentication Modal */}
      {showDevAuthModal && (
        <DeveloperAuthModal
          onClose={() => setShowDevAuthModal(false)}
          onSuccess={handleDevAuthSuccess}
        />
      )}

      {/* Report Card Modal if open from dashboard */}
      {selectedStudentBulletin && (
        <ReportCardModal
          student={selectedStudentBulletin}
          grades={grades}
          schoolConfig={schoolConfig}
          currentRole={currentRole}
          onClose={() => setSelectedStudentBulletin(null)}
        />
      )}

      {/* Support & Contact Details Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white  text-[#050505]  w-full max-w-md rounded-lg p-6 border border-[#E4E6EB]  shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-[#E4E6EB]  pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center font-bold text-white text-xs">
                  EC
                </div>
                <h3 className="font-extrabold text-base text-[#050505] ">Support Officiel EDU-CONGO</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-[#65676B] hover:text-[#050505] hover:bg-[#F0F2F5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#65676B]  flex flex-col gap-3">
              <p>
                L'équipe technique et commerciale EDU-CONGO est à votre service en République du Congo pour tout accompagnement, formation ou assistance :
              </p>

              <div className="bg-[#F0F2F5]  p-4 rounded-lg border border-[#E4E6EB]  flex flex-col gap-2.5 font-mono">
                <a
                  href="https://wa.me/242068958377"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[#1877F2]  hover:text-[#1877F2] font-bold"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp : +242 06 895 83 77</span>
                </a>

                <a
                  href="tel:+242061693598"
                  className="flex items-center gap-2 text-[#1877F2]  hover:text-[#1877F2] font-bold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appel : +242 06 169 35 98</span>
                </a>

                <a
                  href="mailto:steph.alongo@gmail.com"
                  className="flex items-center gap-2 text-[#050505]  hover:text-[#1877F2] font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  <span>steph.alongo@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2] text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
