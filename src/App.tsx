import React, { useState, useEffect, useCallback } from 'react';
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
  SubscriptionRequest,
  TenantSchool,
  SystemLogEntry,
  ApiGatewayStatus,
  SystemFeatureFlag,
  AuthSession,
  SchoolConfig,
  ClassLevelConfig,
  RolePermission,
  SubscriptionBillingEngine
} from './types';
import { 
  DEFAULT_SCHOOL_CONFIG,
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_STAFF,
  INITIAL_CLASSES_CONFIG,
  INITIAL_ATTENDANCE, 
  INITIAL_GRADES, 
  INITIAL_PAYMENTS, 
  INITIAL_EXPENSES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_SCHEDULES,
  INITIAL_TENANTS,
  INITIAL_SYSTEM_LOGS,
  INITIAL_API_GATEWAYS,
  INITIAL_FEATURE_FLAGS
} from './data/initialData';
import { DashboardLayout } from './components/DashboardLayout';
import { LoginPortal } from './components/auth/LoginPortal';
import { QuoteEstimatorModal } from './components/modules/QuoteEstimatorModal';
import { SubscriptionApprovalModal } from './components/modals/SubscriptionApprovalModal';
import { SchoolSubscriptionUpgradeModal } from './components/modals/SchoolSubscriptionUpgradeModal';
import { generateActivationCode } from './utils/activationCode';
import { seedOfflineDatabase, db } from './db/pwaDatabase';
import { syncEngine } from './services/syncEngine';
import confetti from 'canvas-confetti';
import { useAppData } from './hooks/useAppData';
import { useLegacyState } from './hooks/useLegacyState';

const SESSION_STORAGE_KEY = 'edu_congo_session_v3';
const SCHOOL_CONFIG_STORAGE_KEY = 'edu_congo_school_config_v3';
const CLASSES_CONFIG_STORAGE_KEY = 'edu_congo_classes_config_v3';
const PERMISSIONS_STORAGE_KEY = 'edu_congo_permissions_config_v3';
const TENANTS_STORAGE_KEY = 'edu_congo_tenants_v3';
const SUBSCRIPTIONS_STORAGE_KEY = 'edu_congo_subscriptions_v3';

export default function App() {
  // Session States with Persistence
  const [viewMode, setViewMode] = useState<'login' | 'app'>('login');
  const [currentRole, setCurrentRole] = useState<UserRole>('direction');
  const [initialAppTab, setInitialAppTab] = useState<string>('dashboard');
  const [schoolId, setSchoolId] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('Établissement Scolaire (À Configurer)');
  const [userDisplayName, setUserDisplayName] = useState<string>('Administrateur');
  const [isDevUnlocked, setIsDevUnlocked] = useState<boolean>(false);
  
  // UI & Modals State
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [activeApprovalRequest, setActiveApprovalRequest] = useState<SubscriptionRequest | null>(null);

  // School Administrative Configuration State
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem(SCHOOL_CONFIG_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_CONFIG;
    } catch {
      return DEFAULT_SCHOOL_CONFIG;
    }
  });

  const [classesConfig, setClassesConfig] = useState<ClassLevelConfig[]>(() => {
    try {
      const saved = localStorage.getItem(CLASSES_CONFIG_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES_CONFIG;
    } catch {
      return INITIAL_CLASSES_CONFIG;
    }
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(() => {
    try {
      const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
    } catch {
      return DEFAULT_ROLE_PERMISSIONS;
    }
  });

  // Core Multi-Tenant State with Persistence
  const [tenants, setTenants] = useState<TenantSchool[]>(() => {
    try {
      const saved = localStorage.getItem(TENANTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [logs, setLogs] = useState<SystemLogEntry[]>(INITIAL_SYSTEM_LOGS);
  const [gateways, setGateways] = useState<ApiGatewayStatus[]>(INITIAL_API_GATEWAYS);
  const [featureFlags, setFeatureFlags] = useState<SystemFeatureFlag[]>(INITIAL_FEATURE_FLAGS);

  // In-memory interactive multi-tenant dataset (virgin by default)
  const appData = useAppData(schoolId);
  const [students, setStudents] = useLegacyState<Student>(appData.students);
  const [teachers, setTeachers] = useLegacyState<Teacher>(appData.teachers);
  const [staff, setStaff] = useLegacyState<StaffMember>(appData.staff);
  const [attendanceList, setAttendanceList] = useLegacyState<AttendanceRecord>(appData.attendanceList);
  const [grades, setGrades] = useLegacyState<GradeEntry>(appData.grades);
  const [payments, setPayments] = useLegacyState<FeePayment>(appData.payments);
  const [expenses, setExpenses] = useLegacyState<ExpenseItem>(appData.expenses);
  const [announcements, setAnnouncements] = useLegacyState<Announcement>(appData.announcements);
  const [schedules, setSchedules] = useLegacyState<CourseSchedule>(appData.schedules);

  // Subscriptions management with Persistence
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>(() => {
    try {
      const saved = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Persist configurations & state
  useEffect(() => {
    try {
      localStorage.setItem(SCHOOL_CONFIG_STORAGE_KEY, JSON.stringify(schoolConfig));
    } catch (e) {
      console.warn('Could not save school config to localStorage', e);
    }
  }, [schoolConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(CLASSES_CONFIG_STORAGE_KEY, JSON.stringify(classesConfig));
    } catch (e) {
      console.warn('Could not save classes config to localStorage', e);
    }
  }, [classesConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(rolePermissions));
    } catch (e) {
      console.warn('Could not save permissions to localStorage', e);
    }
  }, [rolePermissions]);

  useEffect(() => {
    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    } catch (e) {
      console.warn('Could not save tenants to localStorage', e);
    }
  }, [tenants]);

  useEffect(() => {
    try {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subscriptionRequests));
    } catch (e) {
      console.warn('Could not save subscriptions to localStorage', e);
    }
  }, [subscriptionRequests]);

  // URL Hash synchronization helper
  const syncUrlHash = useCallback((mode: 'flyer' | 'login' | 'app', tab?: string) => {
    if (typeof window === 'undefined') return;
    try {
      let targetHash = '#/vitrine';
      if (mode === 'login') {
        targetHash = '#/connexion';
      } else if (mode === 'app') {
        const cleanTab = tab || 'dashboard';
        targetHash = `#/app/${cleanTab}`;
      }
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    } catch {
      // Ignore if history state not supported in sandbox
    }
  }, []);

  // Save session to LocalStorage
  const persistSession = useCallback((session: AuthSession) => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, []);

  // Restore session on initial load & parse URL hash
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
      let session: AuthSession | null = null;
      if (rawSession) {
        session = JSON.parse(rawSession);
      }

      // Force landing page (vitrine) display on app/browser open
      const targetViewMode: 'flyer' | 'login' | 'app' = 'flyer';
      let targetTab: string = 'dashboard';

      if (session) {
        if (session.schoolName === 'Complexe Scolaire Savorgnan de Brazzaville') {
          session.schoolName = 'Établissement Scolaire (À Configurer)';
          session.schoolId = '';
          session.userDisplayName = 'Administrateur';
        }
        setCurrentRole(session.role || 'direction');
        setUserDisplayName(session.userDisplayName || 'Administrateur');
        setSchoolId(session.schoolId || '');
        setSchoolName(session.schoolName || 'Établissement Scolaire (À Configurer)');
        setIsDevUnlocked(session.isDevUnlocked || session.role === 'superadmin');
      }

      setInitialAppTab(targetTab);
      setViewMode('flyer');
      syncUrlHash('flyer', 'vitrine');
    } catch (e) {
      console.warn('Session restoration error:', e);
    }
  }, [syncUrlHash]);

  // Handle browser back / forward navigation via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/app/')) {
        const tab = hash.replace('#/app/', '').trim() || 'dashboard';
        setViewMode('app');
        setInitialAppTab(tab);
      } else if (hash === '#/connexion') {
        setViewMode('login');
      } else if (hash === '#/vitrine' || hash === '' || hash === '#/') {
        setViewMode('flyer');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse incoming WhatsApp approval link parameters (?action=confirm_subscription...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseAndTriggerApproval = () => {
      // 1. Check window.location.search
      let params = new URLSearchParams(window.location.search);
      let action = params.get('action');

      // 2. If not found in search, check in hash query (e.g. #/vitrine?action=confirm_subscription...)
      if (!action && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        params = new URLSearchParams(hashQuery);
        action = params.get('action');
      }

      // 3. Check entire href as fallback
      if (!action && window.location.href.includes('action=')) {
        const queryPart = window.location.href.split('?')[1];
        if (queryPart) {
          params = new URLSearchParams(queryPart);
          action = params.get('action');
        }
      }

      if (action === 'confirm_subscription' || action === 'confirm_sub') {
        const reqId = params.get('reqId') || params.get('id') || `REQ-CONGO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const paramSchool = params.get('school') || params.get('schoolName') || 'Établissement Demandeur';

        // Check if this subscription request was already approved to prevent repetitive popups
        try {
          const storedReqs: SubscriptionRequest[] = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY) || '[]');
          const isReqAlreadyApproved = storedReqs.some(r => r.id === reqId && r.status === 'validee');
          const storedTenants: TenantSchool[] = JSON.parse(localStorage.getItem(TENANTS_STORAGE_KEY) || '[]');
          const isTenantAlreadyRegistered = storedTenants.some(t => t.name.toLowerCase() === decodeURIComponent(paramSchool).toLowerCase());

          if (isReqAlreadyApproved || isTenantAlreadyRegistered) {
            const cleanHash = window.location.hash.split('?')[0] || '#/vitrine';
            window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
            return;
          }
        } catch (e) {
          console.error('Error checking existing approval:', e);
        }

        const paramAttribution = params.get('attribution') || 'Complexe Scolaire';
        const paramSubdomain = params.get('subdomain') || 'mon-ecole';
        const paramType = (params.get('type') || params.get('schoolType') || params.get('institutionType') || 'complexe') as any;
        const paramDept = params.get('dept') || params.get('department') || 'Brazzaville';
        const paramCity = params.get('city') || 'Brazzaville';
        const paramCommune = params.get('commune') || 'Centre-Ville';
        const paramPlan = params.get('plan') || params.get('planTitle') || params.get('selectedPlan') || 'Essai Gratuit 14 Jours';
        const paramPlanId = (params.get('planId') || 'essai_14j') as any;
        const isTrialReq = paramPlanId === 'essai_14j' || paramPlan.toLowerCase().includes('essai') || params.get('isTrial') === 'true';
        
        let calculatedMonths = isTrialReq ? 0 : 12;
        let calculatedDiscount = isTrialReq ? 100 : 0;
        let calculatedTotalCost = isTrialReq ? 0 : 350000;
        let calculatedMonthly = isTrialReq ? 0 : 350000 / 12;

        if (!isTrialReq && ['mensuel', 'trimestriel', 'semestriel', 'annuel'].includes(paramPlanId)) {
          const billing = SubscriptionBillingEngine.calculateCost(paramPlanId as 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel');
          calculatedMonths = SubscriptionBillingEngine.tiers[paramPlanId as 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'].months;
          calculatedDiscount = SubscriptionBillingEngine.tiers[paramPlanId as 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'].discountPercentage;
          calculatedTotalCost = billing.totalCostFCFA;
          calculatedMonthly = billing.effectiveMonthlyRateFCFA;
        } else {
          // Fallback to URL params if not matching standard tiers
          const paramMonths = parseInt(params.get('months') || params.get('durationMonths') || '12', 10);
          const paramDiscount = parseInt(params.get('discount') || params.get('discountPercentage') || '0', 10);
          const paramAmount = parseInt(params.get('amount') || params.get('cost') || params.get('totalCost') || params.get('totalAmount') || '0', 10);
          
          calculatedMonths = isNaN(paramMonths) ? calculatedMonths : paramMonths;
          calculatedDiscount = isNaN(paramDiscount) ? calculatedDiscount : paramDiscount;
          calculatedTotalCost = isNaN(paramAmount) ? calculatedTotalCost : paramAmount;
          calculatedMonthly = calculatedTotalCost / Math.max(1, calculatedMonths);
        }

        const paramStudents = parseInt(params.get('students') || params.get('studentCount') || '500', 10);
        const paramContact = params.get('contact') || params.get('director') || params.get('contactName') || params.get('directorName') || 'Directeur Général';
        const paramPhone = params.get('phone') || params.get('directorPhone') || params.get('contactPhone') || '+242 06 895 83 77';
        const paramEmail = params.get('email') || params.get('contactEmail') || 'admin@ecole.cg';
        const paramFunction = params.get('function') || params.get('contactFunction') || 'Directeur Général';
        const paramOptions = params.get('options') ? params.get('options')!.split(';') : ['Formation gratuite sur site', 'Support 24/7 dédié', 'Passerelles MoMo & Airtel'];
        const paramCode = params.get('code') || params.get('schoolCode') || '';
        const paramPass = params.get('pass') || params.get('tempPassword') || '';

        const incomingReq: SubscriptionRequest = {
          id: reqId,
          schoolName: decodeURIComponent(paramSchool),
          attribution: decodeURIComponent(paramAttribution),
          subdomain: decodeURIComponent(paramSubdomain),
          subdomainUrl: `https://${decodeURIComponent(paramSubdomain)}.educongo.ai.studio`,
          schoolType: paramType,
          institutionType: paramType,
          department: decodeURIComponent(paramDept),
          city: decodeURIComponent(paramCity),
          commune: decodeURIComponent(paramCommune),
          studentCount: isNaN(paramStudents) ? 500 : paramStudents,
          planId: paramPlanId,
          planTitle: decodeURIComponent(paramPlan),
          selectedPlan: decodeURIComponent(paramPlan),
          isTrial: isTrialReq,
          durationMonths: calculatedMonths,
          discountPercentage: calculatedDiscount,
          totalAmountFCFA: calculatedTotalCost,
          totalCostFCFA: calculatedTotalCost,
          effectiveMonthlyRateFCFA: Math.round(calculatedMonthly),
          contactName: decodeURIComponent(paramContact),
          contactPhone: decodeURIComponent(paramPhone),
          contactEmail: decodeURIComponent(paramEmail),
          contactFunction: decodeURIComponent(paramFunction),
          directorName: decodeURIComponent(paramContact),
          directorPhone: decodeURIComponent(paramPhone),
          options: paramOptions,
          status: 'en_attente',
          createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
          schoolCode: paramCode || undefined,
          tempPassword: paramPass || undefined
        };

        setActiveApprovalRequest(incomingReq);
      }
    };

    parseAndTriggerApproval();
    window.addEventListener('hashchange', parseAndTriggerApproval);
    window.addEventListener('popstate', parseAndTriggerApproval);

    return () => {
      window.removeEventListener('hashchange', parseAndTriggerApproval);
      window.removeEventListener('popstate', parseAndTriggerApproval);
    };
  }, []);

  const handleLaunchDemo = () => {
    setViewMode('app');
    setCurrentRole('direction');
    setUserDisplayName('Directeur Général');
    setSchoolName(schoolConfig.name || 'Établissement Scolaire (À Configurer)');
    setInitialAppTab('dashboard');
    syncUrlHash('app', 'dashboard');

    persistSession({
      role: 'direction',
      userDisplayName: 'Directeur Général',
      schoolId: '',
      schoolName: schoolConfig.name || 'Établissement Scolaire (À Configurer)',
      activeTab: 'dashboard',
      isDevUnlocked: false,
      viewMode: 'app',
      lastLogin: new Date().toISOString()
    });

    const newLog: SystemLogEntry = {
      id: `AUTH-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'info',
      source: 'AUTH_GUARD',
      message: `[CONNEXION] Session ouverte en mode Direction pour l'établissement.`,
      ip: '127.0.0.1 (Brazzaville)',
      user: 'Directeur Général'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleOpenLogin = () => {
    setViewMode('login');
    syncUrlHash('login');
  };

  const handleLoginSuccess = (role: UserRole, targetSchoolId: string, targetSchoolName: string, nameUser: string) => {
    setCurrentRole(role);
    setSchoolId(targetSchoolId);
    setSchoolName(targetSchoolName || schoolConfig.name);
    setUserDisplayName(nameUser);
    
    const isDev = role === 'superadmin';
    setIsDevUnlocked(isDev);

    const defaultTab = role === 'parent' || role === 'eleve' ? 'dashboard' : role === 'superadmin' ? 'superadmin' : 'dashboard';
    setInitialAppTab(defaultTab);
    setViewMode('app');
    syncUrlHash('app', defaultTab);

    persistSession({
      role,
      userDisplayName: nameUser,
      schoolId: targetSchoolId,
      schoolName: targetSchoolName || schoolConfig.name,
      activeTab: defaultTab,
      isDevUnlocked: isDev,
      viewMode: 'app',
      lastLogin: new Date().toISOString()
    });

    const newLog: SystemLogEntry = {
      id: `AUTH-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'info',
      source: 'AUTH_GUARD',
      message: `[CONNEXION RÉUSSIE] Rôle '${role}' authentifié pour l'établissement '${targetSchoolName}'. Utilisateur: ${nameUser}`,
      ip: '127.0.0.1 (Brazzaville / Session Locale)',
      user: nameUser
    };
    setLogs(prev => [newLog, ...prev]);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleLogout = () => {
    const newLog: SystemLogEntry = {
      id: `AUTH-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'security',
      source: 'AUTH_GUARD',
      message: `[DÉCONNEXION] Session fermée pour le profil '${currentRole}' (${userDisplayName}).`,
      ip: '127.0.0.1 (Brazzaville)',
      user: userDisplayName
    };
    setLogs(prev => [newLog, ...prev]);

    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }

    setViewMode('login');
    syncUrlHash('login');
  };

  const handleBackToFlyer = () => {
    setViewMode('flyer');
    syncUrlHash('flyer');
  };

  const handleTabChange = (newTab: string) => {
    setInitialAppTab(newTab);
    syncUrlHash('app', newTab);

    persistSession({
      role: currentRole,
      userDisplayName,
      schoolId,
      schoolName,
      activeTab: newTab,
      isDevUnlocked,
      viewMode: 'app',
      lastLogin: new Date().toISOString()
    });
  };

  const handleSelectSchool = (newSchoolId: string, newSchoolName: string) => {
    setSchoolId(newSchoolId);
    setSchoolName(newSchoolName);

    persistSession({
      role: currentRole,
      userDisplayName,
      schoolId: newSchoolId,
      schoolName: newSchoolName,
      activeTab: initialAppTab,
      isDevUnlocked,
      viewMode: 'app',
      lastLogin: new Date().toISOString()
    });
  };

  const handleSaveSubscriptionRequest = (req: SubscriptionRequest) => {
    setSubscriptionRequests(prev => [req, ...prev.filter(r => r.id !== req.id)]);
  };

  const handleApproveSubscription = (approvedReq: SubscriptionRequest) => {
    const isTrial = Boolean(
      approvedReq.isTrial || 
      approvedReq.planId === 'essai_14j' || 
      approvedReq.planTitle?.toLowerCase().includes('essai') || 
      approvedReq.selectedPlan?.toLowerCase().includes('essai')
    );

    const planTitle = isTrial 
      ? 'Essai 14 Jours' 
      : (approvedReq.planTitle?.includes('Annuel') ? 'Annuel' : approvedReq.planTitle?.includes('Trimestriel') ? 'Trimestriel' : approvedReq.planTitle?.includes('Mensuel') ? 'Mensuel' : 'Pro');

    const trialStartDate = isTrial ? new Date().toISOString().split('T')[0] : undefined;
    const trialExpiresAt = isTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined;
    const licenseExpiresAt = isTrial 
      ? (trialExpiresAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      : new Date(Date.now() + (approvedReq.durationMonths || 12) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const finalApprovedReq: SubscriptionRequest = {
      ...approvedReq,
      status: 'validee',
      isTrial,
      planTitle: isTrial ? 'Essai Gratuit 14 Jours' : approvedReq.planTitle,
      selectedPlan: isTrial ? 'Essai Gratuit 14 Jours' : approvedReq.selectedPlan
    };

    // 1. Immediately persist and update subscriptionRequests
    setSubscriptionRequests(prev => {
      const exists = prev.some(r => r.id === finalApprovedReq.id);
      const updated = exists ? prev.map(r => r.id === finalApprovedReq.id ? finalApprovedReq : r) : [finalApprovedReq, ...prev];
      try {
        localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error storing subscriptions:', e);
      }
      return updated;
    });
    
    // 2. Register the validated tenant into the active schools list
    const newTenantId = `ten-${Date.now()}`;
    const newTenant: TenantSchool = {
      id: newTenantId,
      code: finalApprovedReq.schoolCode || 'EC-BZV-2026-001',
      name: finalApprovedReq.schoolName,
      attribution: finalApprovedReq.attribution,
      subdomain: finalApprovedReq.subdomain,
      subdomainUrl: finalApprovedReq.subdomainUrl || (finalApprovedReq.subdomain ? `https://${finalApprovedReq.subdomain}.educongo.ai.studio` : undefined),
      type: finalApprovedReq.schoolType || 'complexe',
      department: finalApprovedReq.department || 'Brazzaville',
      city: finalApprovedReq.city || 'Brazzaville',
      commune: finalApprovedReq.commune || 'Centre-Ville',
      address: `${finalApprovedReq.commune || 'Centre-Ville'}, ${finalApprovedReq.city || 'Brazzaville'}`,
      contactName: finalApprovedReq.contactName || finalApprovedReq.directorName || 'Directeur Général',
      contactPhone: finalApprovedReq.contactPhone || finalApprovedReq.directorPhone || '+242 06 895 83 77',
      contactEmail: finalApprovedReq.contactEmail || 'admin@ecole.cg',
      contactFunction: finalApprovedReq.contactFunction || 'Directeur Général',
      tempPassword: finalApprovedReq.tempPassword,
      studentCount: finalApprovedReq.studentCount || 500,
      teacherCount: 25,
      plan: planTitle as any,
      isTrial,
      trialStartDate,
      trialExpiresAt,
      status: 'actif',
      licenseExpiresAt,
      masterKey: finalApprovedReq.adminAccessCode || 'KEY-2026',
      databaseSizeMb: 12.4,
      momoGatewayConnected: true,
      monthlyFeeFCFA: isTrial ? 0 : (finalApprovedReq.effectiveMonthlyRateFCFA || 35000),
      createdAt: finalApprovedReq.createdAt || new Date().toLocaleDateString('fr-FR')
    };

    const planKey = Object.keys(SubscriptionBillingEngine.tiers).find(key => 
      key === finalApprovedReq.planId || 
      finalApprovedReq.planTitle?.toLowerCase().includes(key) ||
      finalApprovedReq.selectedPlan?.toLowerCase().includes(key)
    ) as 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel' | undefined;
    
    if (planKey) {
      newTenant.activationCode = generateActivationCode(
        { id: newTenant.id, code: newTenant.code, name: newTenant.name },
        planKey
      ).code;
    }

    setTenants(prev => {
      const filtered = prev.filter(t => t.name.toLowerCase() !== newTenant.name.toLowerCase() && t.code !== newTenant.code);
      const updated = [newTenant, ...filtered];
      try {
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error storing tenants:', e);
      }
      return updated;
    });

    setSchoolId(newTenantId);
    setSchoolName(finalApprovedReq.schoolName);
    setSchoolConfig(prev => {
      const updatedConf: SchoolConfig = {
        ...prev,
        name: finalApprovedReq.schoolName,
        code: finalApprovedReq.schoolCode || prev.code,
        directorName: finalApprovedReq.contactName || finalApprovedReq.directorName || prev.directorName,
        phone: finalApprovedReq.contactPhone || finalApprovedReq.directorPhone || prev.phone,
        email: finalApprovedReq.contactEmail || prev.email,
        city: finalApprovedReq.city || prev.city,
        department: finalApprovedReq.department || prev.department,
        commune: finalApprovedReq.commune || prev.commune
      };
      try {
        localStorage.setItem(SCHOOL_CONFIG_STORAGE_KEY, JSON.stringify(updatedConf));
      } catch (e) {
        console.error('Error storing school config:', e);
      }
      return updatedConf;
    });

    handleAddLog({
      id: `TENANT-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'info',
      source: 'TENANT_ROUTER',
      message: `[AGRÉMENT OFFICIEL VALIDÉ] L'établissement '${finalApprovedReq.schoolName}' a été validé (${isTrial ? 'Période d\'essai 14 jours' : 'Plan ' + planTitle}). Code : ${finalApprovedReq.schoolCode}. Accès expédiés sur WhatsApp (${finalApprovedReq.contactPhone}).`,
      ip: '127.0.0.1 (Brazzaville)',
      user: 'Super-Admin EDU-CONGO'
    });

    // 3. Clear URL query parameters to avoid re-triggering the approval modal on subsequent reloads
    if (typeof window !== 'undefined') {
      const cleanHash = window.location.hash.split('?')[0] || '#/vitrine';
      window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
    }
  };

  const handleUpgradeSchoolSubscription = (upgradedTenant: TenantSchool) => {
    setTenants(prev => {
      const updated = prev.map(t => t.id === upgradedTenant.id ? upgradedTenant : t);
      try {
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating tenants on upgrade:', e);
      }
      return updated;
    });

    setSchoolConfig(prev => {
      const updatedConf = { ...prev, plan: upgradedTenant.plan };
      try {
        localStorage.setItem(SCHOOL_CONFIG_STORAGE_KEY, JSON.stringify(updatedConf));
      } catch (e) {
        console.error('Error updating school config plan:', e);
      }
      return updatedConf;
    });

    handleAddLog({
      id: `UPGRADE-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'info',
      source: 'MOMO_CONGO',
      message: `[ABONNEMENT OFFICIEL ACTIVÉ] L'établissement '${upgradedTenant.name}' a sélectionné le forfait '${upgradedTenant.plan}'. Validité jusqu'au ${upgradedTenant.licenseExpiresAt}.`,
      ip: '127.0.0.1 (Brazzaville)',
      user: userDisplayName
    });

    setShowUpgradeModal(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleLaunchSchoolWorkspace = (customSchoolName: string) => {
    const matchingTenant = tenants.find(t => t.name.toLowerCase() === customSchoolName.toLowerCase()) || tenants[0];
    const targetSchoolId = matchingTenant ? matchingTenant.id : 'ten-1';

    setSchoolName(customSchoolName);
    setSchoolConfig(prev => ({ ...prev, name: customSchoolName }));
    setSchoolId(targetSchoolId);
    setCurrentRole('direction');
    setUserDisplayName('Directeur Général');
    setInitialAppTab('dashboard');
    setViewMode('app');
    syncUrlHash('app', 'dashboard');

    persistSession({
      role: 'direction',
      userDisplayName: 'Directeur Général',
      schoolId: targetSchoolId,
      schoolName: customSchoolName,
      activeTab: 'dashboard',
      isDevUnlocked: false,
      viewMode: 'app',
      lastLogin: new Date().toISOString()
    });
  };

  // Seed and synchronize IndexedDB for complete offline functionality
  useEffect(() => {
    seedOfflineDatabase({
      students,
      teachers,
      staff,
      classes: classesConfig,
      payments,
      expenses,
      grades,
      attendance: attendanceList,
      schedules,
      announcements,
      schoolConfig
    });
  }, []);

  // Administrative Configuration Handlers
  const handleUpdateSchoolConfig = (newConfig: SchoolConfig) => {
    setSchoolConfig(newConfig);
    setSchoolName(newConfig.name);
    syncEngine.queueAction({
      actionType: 'UPDATE_SCHOOL_CONFIG',
      payload: newConfig,
      description: `Configuration officielle : ${newConfig.name}`,
      idempotencyKey: `CONF_${newConfig.schoolId || 'default'}_${Date.now()}`
    });
    handleAddLog({
      id: `CONFIG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'info',
      source: 'ADMIN_CONFIG',
      message: `[CONFIGURATION MISE À JOUR] Données officielles de l'établissement '${newConfig.name}' enregistrées.`,
      ip: '127.0.0.1 (Brazzaville)',
      user: userDisplayName
    });
  };

  const handleAddClass = (newClass: ClassLevelConfig) => {
    setClassesConfig(prev => [...prev, newClass]);
    syncEngine.queueAction({
      actionType: 'ADD_CLASS',
      payload: newClass,
      description: `Création de classe : ${newClass.name} (${newClass.cycle})`,
      idempotencyKey: `CLASS_${newClass.id}`
    });
  };

  const handleUpdateClass = (updatedClass: ClassLevelConfig) => {
    setClassesConfig(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    syncEngine.queueAction({
      actionType: 'UPDATE_CLASS',
      payload: updatedClass,
      description: `Mise à jour classe : ${updatedClass.name}`,
      idempotencyKey: `CLASS_UPD_${updatedClass.id}_${Date.now()}`
    });
  };

  const handleDeleteClass = (classId: string) => {
    setClassesConfig(prev => prev.filter(c => c.id !== classId));
  };

  const handleUpdateRolePermissions = (newPermissions: RolePermission[]) => {
    setRolePermissions(newPermissions);
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    syncEngine.queueAction({
      actionType: 'CREATE_STUDENT',
      payload: newStudent,
      description: `Inscription élève : ${newStudent.nom} ${newStudent.prenom} (${newStudent.classe})`,
      idempotencyKey: `STUDENT_NEW_${newStudent.matricule || newStudent.id}`
    });
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    syncEngine.queueAction({
      actionType: 'UPDATE_STUDENT',
      payload: updatedStudent,
      description: `Mise à jour élève : ${updatedStudent.nom} ${updatedStudent.prenom}`,
      idempotencyKey: `STUDENT_UPD_${updatedStudent.id}_${Date.now()}`
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    syncEngine.queueAction({
      actionType: 'DELETE_STUDENT',
      payload: { id: studentId },
      description: `Suppression élève ID ${studentId}`,
      idempotencyKey: `STUDENT_DEL_${studentId}`
    });
  };

  // HR Staff Handlers
  const handleAddStaff = (newStaff: StaffMember) => {
    setStaff(prev => [newStaff, ...prev]);
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaff(prev => prev.map(st => st.id === updatedStaff.id ? updatedStaff : st));
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(prev => prev.filter(st => st.id !== staffId));
  };

  // HR Teacher Handlers
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  // Academic & Financial Handlers
  const handleUpdateAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendanceList(newRecords);
    // Queue offline sync for each attendance entry
    newRecords.forEach((record) => {
      syncEngine.queueAction({
        actionType: 'MARK_ATTENDANCE',
        payload: record,
        description: `Présence/Appel : ${record.studentName} (${record.statut})`,
        idempotencyKey: `ATT_${record.id || record.studentId + '_' + record.date}`
      });
    });
  };

  const handleAddGrade = (newGrade: GradeEntry) => {
    setGrades(prev => [newGrade, ...prev]);
    syncEngine.queueAction({
      actionType: 'ADD_GRADE',
      payload: newGrade,
      description: `Note saisie : ${newGrade.matiere} (${newGrade.noteDevoir}/20) pour ${newGrade.studentName}`,
      idempotencyKey: `GRADE_${newGrade.id || newGrade.studentId + '_' + newGrade.matiere + '_' + newGrade.semestre}`
    });
  };

  const handleUpdateGrade = (updatedGrade: GradeEntry) => {
    setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
    syncEngine.queueAction({
      actionType: 'ADD_GRADE',
      payload: updatedGrade,
      description: `Note modifiée : ${updatedGrade.matiere} pour ${updatedGrade.studentName}`,
      idempotencyKey: `GRADE_UPD_${updatedGrade.id}_${Date.now()}`
    });
  };

  const handleAddPayment = (newPayment: FeePayment) => {
    setPayments(prev => [newPayment, ...prev]);
    // Also update student fraisPayes
    setStudents(prev => prev.map(s => {
      if (s.id === newPayment.studentId) {
        return { ...s, fraisPayes: s.fraisPayes + newPayment.montant };
      }
      return s;
    }));

    syncEngine.queueAction({
      actionType: 'ADD_PAYMENT',
      payload: newPayment,
      description: `Paiement ${newPayment.montant.toLocaleString('fr-FR')} FCFA (${newPayment.motif}) pour ${newPayment.studentName}`,
      idempotencyKey: `PAY_${newPayment.numeroRecu || newPayment.id}_${newPayment.montant}`
    });
  };

  const handleAddExpense = (newExpense: ExpenseItem) => {
    setExpenses(prev => [newExpense, ...prev]);
    syncEngine.queueAction({
      actionType: 'ADD_EXPENSE',
      payload: newExpense,
      description: `Dépense : ${newExpense.titre} (${newExpense.montant.toLocaleString('fr-FR')} FCFA)`,
      idempotencyKey: `EXP_${newExpense.id}`
    });
  };

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const handleAddSchedule = (newSchedule: CourseSchedule) => {
    setSchedules(prev => [newSchedule, ...prev]);
  };

  // Developer Super Admin handlers
  const handleAddTenant = (newTenant: TenantSchool) => {
    setTenants(prev => [newTenant, ...prev]);
  };

  const handleUpdateTenant = (updatedTenant: TenantSchool) => {
    setTenants(prev => prev.map(t => t.id === updatedTenant.id ? updatedTenant : t));
  };

  const handleDeleteTenant = (tenantId: string) => {
    setTenants(prev => prev.filter(t => t.id !== tenantId));
  };

  const handleToggleFeatureFlag = (flagId: string) => {
    setFeatureFlags(prev => prev.map(f => f.id === flagId ? { ...f, enabled: !f.enabled } : f));
  };

  const handleAddLog = (newLog: SystemLogEntry) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleImpersonateSchool = (targetSchoolName: string) => {
    const matched = tenants.find(t => t.name === targetSchoolName);
    const targetId = matched ? matched.id : 'ten-1';
    setSchoolName(targetSchoolName);
    setSchoolId(targetId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 relative z-0">
      {/* Global Background Ambience Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#6366f1_1.2px,transparent_1.2px)] [background-size:28px_28px] -z-10"></div>
      <div className="fixed top-0 left-0 w-[40rem] h-[40rem] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[40rem] h-[40rem] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {viewMode === 'login' ? (
        <LoginPortal
          onLoginSuccess={handleLoginSuccess}
          onBackToVitrine={() => setViewMode('login')}
          availableSchools={tenants}
          initialSchoolId={schoolId}
          onAddSecurityLog={(action, details, status) => {
            handleAddLog({
              id: `AUTH-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('fr-FR'),
              level: status === 'error' ? 'error' : status === 'warning' ? 'warning' : 'security',
              source: 'AUTH_GUARD',
              message: `[${action.toUpperCase()}] ${details}`,
              ip: '127.0.0.1 (Brazzaville / Portail Web)',
              user: 'Portail Auth'
            });
          }}
        />
      ) : (
        <DashboardLayout
          currentRole={currentRole}
          initialTab={initialAppTab}
          schoolName={schoolName}
          schoolId={schoolId}
          schoolConfig={schoolConfig}
          classesConfig={classesConfig}
          rolePermissions={rolePermissions}
          staff={staff}
          onChangeRole={(role) => {
            setCurrentRole(role);
            if (role === 'superadmin') {
              setIsDevUnlocked(true);
              setInitialAppTab('superadmin');
              syncUrlHash('app', 'superadmin');
            }
          }}
          onTabChange={handleTabChange}
          onSelectSchool={handleSelectSchool}
          onBackToFlyer={handleBackToFlyer}
          onLogout={handleLogout}
          onOpenSubscriptionModal={() => setShowQuoteModal(true)}
          students={students}
          teachers={teachers}
          attendanceList={attendanceList}
          grades={grades}
          payments={payments}
          expenses={expenses}
          announcements={announcements}
          schedules={schedules}
          tenants={tenants}
          logs={logs}
          gateways={gateways}
          featureFlags={featureFlags}
          subscriptionRequests={subscriptionRequests}
          onOpenApprovalModal={(req) => setActiveApprovalRequest(req)}
          onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          onUpdateSchoolConfig={handleUpdateSchoolConfig}
          onAddClass={handleAddClass}
          onUpdateClass={handleUpdateClass}
          onDeleteClass={handleDeleteClass}
          onUpdateRolePermissions={handleUpdateRolePermissions}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
          onAddStaff={handleAddStaff}
          onUpdateStaff={handleUpdateStaff}
          onDeleteStaff={handleDeleteStaff}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onUpdateAttendance={handleUpdateAttendance}
          onAddGrade={handleAddGrade}
          onUpdateGrade={handleUpdateGrade}
          onAddPayment={handleAddPayment}
          onAddExpense={handleAddExpense}
          onAddAnnouncement={handleAddAnnouncement}
          onAddSchedule={handleAddSchedule}
          onAddTenant={handleAddTenant}
          onUpdateTenant={handleUpdateTenant}
          onDeleteTenant={handleDeleteTenant}
          onToggleFeatureFlag={handleToggleFeatureFlag}
          onAddLog={handleAddLog}
          onClearLogs={handleClearLogs}
          onImpersonateSchool={handleImpersonateSchool}
        />
      )}

      {/* Quote & Subscription Request Modal */}
      {showQuoteModal && (
        <QuoteEstimatorModal
          onClose={() => setShowQuoteModal(false)}
          onSubmitSubscriptionRequest={handleSaveSubscriptionRequest}
          onOpenApprovalModal={(req) => {
            setShowQuoteModal(false);
            setActiveApprovalRequest(req);
          }}
        />
      )}

      {/* Official EDU-CONGO Approval & Activation Modal */}
      {activeApprovalRequest && (
        <SubscriptionApprovalModal
          request={activeApprovalRequest}
          onClose={() => setActiveApprovalRequest(null)}
          onApprove={handleApproveSubscription}
          onLaunchSchoolWorkspace={handleLaunchSchoolWorkspace}
        />
      )}

      {/* School Subscription Upgrade Modal (from 14-Day Free Trial to Paid Official Plan) */}
      {showUpgradeModal && (
        <SchoolSubscriptionUpgradeModal
          tenant={tenants.find(t => t.id === schoolId || t.name.toLowerCase() === (schoolConfig.name || schoolName).toLowerCase()) || tenants[0] || {
            id: schoolId || 'ten-current',
            code: schoolConfig.code || 'EC-2026-001',
            name: schoolConfig.name || schoolName,
            type: 'complexe',
            department: schoolConfig.department || 'Brazzaville',
            city: schoolConfig.city || 'Brazzaville',
            address: schoolConfig.address || 'Brazzaville',
            contactName: schoolConfig.directorName || 'Directeur Général',
            contactPhone: schoolConfig.phone || '+242 06 895 83 77',
            contactEmail: schoolConfig.email || 'admin@ecole.cg',
            studentCount: students.length || 500,
            teacherCount: teachers.length || 25,
            plan: 'Essai 14 Jours',
            isTrial: true,
            status: 'actif',
            licenseExpiresAt: '2026-09-15',
            masterKey: 'KEY-2026',
            databaseSizeMb: 12.4,
            momoGatewayConnected: true,
            monthlyFeeFCFA: 0,
            createdAt: new Date().toLocaleDateString('fr-FR')
          }}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSubscription={handleUpgradeSchoolSubscription}
        />
      )}
    </div>
  );
}
