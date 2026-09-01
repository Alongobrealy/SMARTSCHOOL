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
  Upload,
  RefreshCw,
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
    direction: { label: 'Direction Générale et Administration', icon: Briefcase, color: 'text-purple-400 bg-purple-950/60 border-purple-800', badge: 'Superviseur Global' },
    administration: { label: 'Secrétariat et Scolarité', icon: Building2, color: 'text-blue-400 bg-blue-950/60 border-blue-800', badge: 'Gestion Administrative' },
    enseignant: { label: 'Corps Enseignant et Personnel', icon: UserCheck, color: 'text-blue-600 bg-indigo-950/60 border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60', badge: 'Appel, Notes & Cours' },
    parent: { label: 'Espace Parents', icon: Users, color: 'text-blue-600 bg-emerald-950/60 border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60', badge: 'Suivi de l’Enfant' },
    eleve: { label: 'Espace Elèves', icon: GraduationCap, color: 'text-sky-400 bg-sky-950/60 border-sky-800', badge: 'Cours, Notes & Devoirs' },
    comptabilite: { label: 'Comptabilité et Caisse', icon: Calculator, color: 'text-amber-400 bg-amber-950/60 border-amber-800', badge: 'Recouvrement & Bilans' },
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
    <div className="h-screen w-full bg-transparent text-[#1E293B] dark:text-slate-100 flex font-sans overflow-hidden">
      

      {/* Sidebar */}
      <aside className={`w-64 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col h-full shrink-0 z-40 transition-transform duration-300 ${mobileMenuOpen ? "fixed inset-y-0 left-0 shadow-2xl" : "hidden md:flex"}`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#1E293B]">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">EduERP Pro</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'opacity-80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1E293B] bg-slate-900/50">
          <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentRole}&backgroundColor=c0aede,b6e3f4,d1d4f9`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{roleConfig[currentRole].label}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate">admin@eduerp.com</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
             <button
                onClick={onBackToFlyer}
                className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Retour Vitrine"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout || onBackToFlyer}
                className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        
                {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700/60 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 transition-colors">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <label className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Uploader un logo">
                        <Upload className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
                        <input type="file" className="hidden" accept="image/*" />
                    </label>
                    <h1 className="font-display font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100 dark:text-gray-100 tracking-tight hidden sm:block">Portail Académique</h1>
                </div>
                <span className="hidden lg:inline-block px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider ml-2">Année 2024-2025</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => window.location.reload()} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full relative transition-colors cursor-pointer" title="Réactualiser">
                    <RefreshCw className="w-5 h-5" />
                </button>
                <ThemeToggle variant="icon" />
                <div className="relative hidden md:block ml-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 lg:w-64 transition-all text-gray-700 dark:text-gray-200" />
                </div>
            </div>
        </header>

        {/* Global Offline Network Status Banner */}
        <NetworkStatusBanner variant="banner" />

        {/* DEVELOPER CONTROL MODE BANNER WITH RETURN BUTTON */}
        {isDevUnlocked && currentRole !== 'superadmin' && (
          <div className="bg-amber-500 border-b border-amber-600 px-4 sm:px-6 py-2.5 shadow-md flex items-center justify-between gap-3 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              Mode Simulation: {roleConfig[currentRole].label}
            </div>
            <button
              onClick={() => {
                onChangeRole('superadmin');
                setActiveTab('superadmin');
              }}
              className="px-3 py-1 bg-amber-950 text-amber-400 rounded-lg text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Quitter la Simulation
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-8">

          <AccessGuard
            activeTenant={activeTenant}
            licenseInfo={licenseInfo}
            currentRole={currentRole}
            onOpenApprovalModal={onOpenApprovalModal}
          >
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-200">
              
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tableau de bord ERP</h2>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 text-slate-700 dark:text-slate-200 font-medium rounded-2xl shadow-sm hover:bg-slate-50 dark:bg-slate-800/50 transition-colors text-sm cursor-pointer">
                      Télécharger le rapport
                    </button>
                    <button 
                      onClick={() => setActiveTab('eleves')}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                    >
                      Nouvelle Admission
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 flex flex-col hover:-translate-y-1 gap-2 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Élèves</span>
                    <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{scopedStudents.length > 0 ? scopedStudents.length : '2,450'}</span>
                    <span className="text-xs font-semibold text-emerald-500 mt-1">+12% vs l'an dernier</span>'
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Users className="w-16 h-16 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 flex flex-col hover:-translate-y-1 gap-2 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Personnel</span>
                    <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{scopedTeachers.length > 0 ? scopedTeachers.length : '145'}</span>
                    <span className="text-xs font-medium text-slate-400 mt-1">2 postes à pourvoir</span>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <GraduationCap className="w-16 h-16 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 flex flex-col hover:-translate-y-1 justify-between hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Taux Présence</span>
                      <span className="text-3xl font-black text-slate-800 dark:text-slate-100">96.5%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4 relative overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full absolute top-0 left-0" style={{ width: '96.5%' }}></div>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 flex flex-col hover:-translate-y-1 gap-2 hover:shadow-md transition-shadow">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenu Mensuel</span>
                    <span className="text-3xl font-black text-slate-800 dark:text-slate-100">125M <span className="text-lg">FCFA</span></span>
                    <span className="text-xs font-semibold text-amber-500 mt-1">75% de l'objectif mensuel</span>'
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                  {/* Chart 1: Aperçu Financier */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Aperçu Financier</h3>
                      <select className="text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:bg-slate-100 dark:bg-slate-800 transition-colors">
                        <option>Cette Année</option>
                      </select>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', in: 4000, out: 2400 },
                          { name: 'Fév', in: 3000, out: 1398 },
                          { name: 'Mar', in: 2000, out: 9800 },
                          { name: 'Avr', in: 2780, out: 3908 },
                          { name: 'Mai', in: 1890, out: 4800 },
                          { name: 'Juin', in: 2390, out: 3800 },
                          { name: 'Jui', in: 3490, out: 4300 },
                        ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                          <Area type="monotone" dataKey="in" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Présences Hebdomadaires */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Présences Hebdomadaires</h3>
                      <select className="text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:bg-slate-100 dark:bg-slate-800 transition-colors">
                        <option>Toutes les classes</option>
                      </select>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Lun', present: 95, absent: 5 },
                          { name: 'Mar', present: 98, absent: 2 },
                          { name: 'Mer', present: 92, absent: 8 },
                          { name: 'Jeu', present: 96, absent: 4 },
                          { name: 'Ven', present: 90, absent: 10 },
                        ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                          <Bar dataKey="absent" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
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
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100  w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  EC
                </div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 ">Support Officiel EDU-CONGO</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400  flex flex-col gap-3">
              <p>
                L'équipe technique et commerciale EDU-CONGO est à votre service en République du Congo pour tout accompagnement, formation ou assistance :'
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50  p-4 rounded-lg border border-slate-200 dark:border-slate-700/60 dark:border-slate-700/60  flex flex-col gap-2.5 font-mono">
                <a
                  href="https://wa.me/242068958377"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-600  hover:text-blue-600 font-bold"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp : +242 06 895 83 77</span>
                </a>

                <a
                  href="tel:+242061693598"
                  className="flex items-center gap-2 text-blue-600  hover:text-blue-600 font-bold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appel : +242 06 169 35 98</span>
                </a>

                <a
                  href="mailto:steph.alongo@gmail.com"
                  className="flex items-center gap-2 text-slate-800 dark:text-slate-100  hover:text-blue-600 font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  <span>steph.alongo@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer"
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
