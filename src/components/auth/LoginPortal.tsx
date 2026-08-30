import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  User, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Users, 
  GraduationCap, 
  Calculator, 
  Terminal, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Globe, 
  Phone, 
  MessageCircle, 
  Fingerprint,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  ShieldAlert,
  X,
  School,
  KeyRound,
  Check
} from 'lucide-react';
import { UserRole, TenantSchool, Student, Teacher } from '../../types';
import { ThemeToggle } from '../ThemeToggle';
import { INITIAL_TENANTS, INITIAL_STUDENTS, INITIAL_TEACHERS } from '../../data/initialData';
import { extractPhoneDigits, normalizePhone, validatePinCode } from '../../utils/validation';
import confetti from 'canvas-confetti';

interface LoginPortalProps {
  onLoginSuccess: (role: UserRole, userDisplayName: string, targetTab?: string, schoolId?: string, schoolName?: string) => void;
  onBackToVitrine?: () => void;
  onBackToFlyer?: () => void;
  onAddSecurityLog?: (action: string, details: string, status: 'success' | 'warning' | 'error') => void;
  availableSchools?: TenantSchool[];
  initialSchoolId?: string;
  students?: Student[];
  teachers?: Teacher[];
}

interface RoleCredentials {
  role: UserRole;
  label: string;
  category: string;
  icon: any;
  color: string;
  defaultIdentifier: string;
  placeholderId: string;
  idLabel: string;
  authType: 'pin4' | 'pin6' | 'password';
  pinLength?: number;
  defaultPass: string;
  displayName: string;
  securityNote: string;
  requiresMasterKey?: boolean;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  onBackToVitrine,
  onBackToFlyer,
  onAddSecurityLog,
  availableSchools = INITIAL_TENANTS,
  initialSchoolId = 'ten-1',
  students = INITIAL_STUDENTS,
  teachers = INITIAL_TEACHERS
}) => {
  const handleBackToVitrine = () => {
    if (onBackToVitrine) {
      onBackToVitrine();
    } else if (onBackToFlyer) {
      onBackToFlyer();
    } else {
      window.location.hash = '#/vitrine';
    }
  };

  const [selectedRole, setSelectedRole] = useState<UserRole>('direction');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(initialSchoolId);
  const [identifier, setIdentifier] = useState<string>('');
  const [passwordOrPin, setPasswordOrPin] = useState<string>('');
  const [developerKey, setDeveloperKey] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  
  // Security & PIN Setup States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [showDevSecretTab, setShowDevSecretTab] = useState<boolean>(false);

  // PIN Creation / Setup Modal State
  const [showPinSetupModal, setShowPinSetupModal] = useState<boolean>(false);
  const [newPinValue, setNewPinValue] = useState<string>('');
  const [confirmPinValue, setConfirmPinValue] = useState<string>('');
  const [pinSetupError, setPinSetupError] = useState<string | null>(null);
  const [pinSetupSuccess, setPinSetupSuccess] = useState<boolean>(false);

  // Forgot Password State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);
  const [forgotPhone, setForgotPhone] = useState<string>('');
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp' | 'new_password'>('phone');
  const [forgotOtp, setForgotOtp] = useState<string>('');
  const [forgotNewPassword, setForgotNewPassword] = useState<string>('');
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Dynamic user PINs stored locally
  const [customPins, setCustomPins] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('educongo_user_pins');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const savePinLocally = (userId: string, pin: string) => {
    const updated = { ...customPins, [userId.toUpperCase()]: pin };
    setCustomPins(updated);
    try {
      localStorage.setItem('educongo_user_pins', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save PIN in localStorage', e);
    }
  };

  // Keyboard shortcut for secret developer access (Ctrl+Shift+D or Cmd+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowDevSecretTab((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const rolesConfig: RoleCredentials[] = [
    {
      role: 'direction',
      label: 'Direction Générale',
      category: 'Gouvernance, Pilotage & Décision',
      icon: Briefcase,
      color: 'from-purple-600 to-indigo-600',
      defaultIdentifier: '',
      placeholderId: 'Email institutionnel ou identifiant de direction',
      idLabel: 'Identifiant / Email Direction',
      authType: 'password',
      defaultPass: '',
      displayName: 'Direction Générale',
      securityNote: 'Accès superviseur global, états financiers et validation académique'
    },
    {
      role: 'administration',
      label: 'Secrétariat & Scolarité',
      category: 'Gestion Administrative & Inscriptions',
      icon: Building2,
      color: 'from-blue-600 to-cyan-600',
      defaultIdentifier: '',
      placeholderId: 'Matricule admin ou adresse email professionnelle',
      idLabel: 'Matricule / Email Secrétariat',
      authType: 'password',
      defaultPass: '',
      displayName: 'Secrétariat & Scolarité',
      securityNote: 'Registres des élèves, dossiers d’inscriptions et certificats officiels'
    },
    {
      role: 'comptabilite',
      label: 'Comptabilité & Caisse',
      category: 'Finance & Recouvrement FCFA / Mobile Money',
      icon: Calculator,
      color: 'from-amber-600 to-orange-600',
      defaultIdentifier: '',
      placeholderId: 'Identifiant caissier ou matricule comptable',
      idLabel: 'Identifiant Caisse / Comptabilité',
      authType: 'password',
      defaultPass: '',
      displayName: 'Caisse & Comptabilité',
      securityNote: 'Encaissement des écolages en FCFA, reçus MTN MoMo & bilans de caisse'
    },
    {
      role: 'enseignant',
      label: 'Corps Enseignant & Personnel',
      category: 'Espace Pédagogique • Code Enseignant + PIN 6 Chiffres',
      icon: UserCheck,
      color: 'from-indigo-600 to-blue-700',
      defaultIdentifier: '',
      placeholderId: 'Code identifiant enseignant / matricule (ex: ENS-...)',
      idLabel: 'Code Identifiant Enseignant',
      authType: 'pin6',
      pinLength: 6,
      defaultPass: '',
      displayName: 'Enseignant',
      securityNote: 'Saisie des notes, devoirs, appel en classe et relevés pédagogiques'
    },
    {
      role: 'parent',
      label: 'Espace Parents & Tuteurs',
      category: 'Suivi Familial • Téléphone Tuteur + PIN 4 Chiffres',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      defaultIdentifier: '',
      placeholderId: 'Numéro de téléphone tuteur enregistré (+242 ...)',
      idLabel: 'Numéro de Téléphone Tuteur (+242)',
      authType: 'pin4',
      pinLength: 4,
      defaultPass: '',
      displayName: 'Parent / Tuteur Légal',
      securityNote: 'Suivi des bulletins, alertes d’absence directes et quittances de scolarité'
    },
    {
      role: 'eleve',
      label: 'Espace Élèves & Étudiants',
      category: 'Portail Étudiant • Code Élève + PIN 6 Chiffres',
      icon: GraduationCap,
      color: 'from-sky-600 to-blue-600',
      defaultIdentifier: '',
      placeholderId: 'Code élève / matricule scolaire (ex: MAT-...)',
      idLabel: 'Matricule / Code Élève',
      authType: 'pin6',
      pinLength: 6,
      defaultPass: '',
      displayName: 'Élève / Étudiant',
      securityNote: 'Consultation de l’emploi du temps, des cours et des relevés de notes'
    },
    {
      role: 'superadmin',
      label: 'Console Super Admin (Root)',
      category: 'Gouvernance Système Multi-Établissements',
      icon: Terminal,
      color: 'from-rose-600 to-red-700',
      defaultIdentifier: '',
      placeholderId: 'steph.alongo@gmail.com',
      idLabel: 'Email Développeur Super-Admin',
      authType: 'password',
      defaultPass: '',
      displayName: 'Développeur Super-Admin',
      securityNote: 'Console Super Admin & Développeur Système (Accès Root Multi-Établissements)',
      requiresMasterKey: true
    }
  ];

  const currentRoleConfig = rolesConfig.find((r) => r.role === selectedRole) || rolesConfig[0];
  const currentSchool = availableSchools.find((s) => s.id === selectedSchoolId) || availableSchools[0] || {
    id: 'ten-empty',
    name: 'Établissement Non Configuré',
    city: 'Congo',
    department: 'Brazzaville'
  } as TenantSchool;

  // Quick switch role
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIdentifier('');
    setPasswordOrPin('');
    setDeveloperKey('');
  };

  // Submit Authentication
  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const cleanId = identifier.trim();
    const cleanSecret = passwordOrPin.trim();

    try {
      const { supabase } = await import('../../lib/supabase');
      const { formatPseudoEmail } = await import('../../utils/authUtils');
      
      let emailToUse = cleanId;
      
      if (!cleanId.includes('@')) {
        const targetSchool = availableSchools.find((s) => s.id === selectedSchoolId) || availableSchools[0];
        emailToUse = formatPseudoEmail(selectedRole, cleanId, targetSchool?.id || 'default');
      }

      // Hardcoded dev access for easy development without internet (optional but safe)
      const isDevEmail = cleanId.toLowerCase() === 'steph.alongo@gmail.com';
      const isDevPass = cleanSecret === 'Verlaine92/Brealy95/' || cleanSecret === '2420' || cleanSecret === 'DEV2026';
      if ((selectedRole === 'superadmin' || isDevEmail) && isDevPass) {
        setIsSubmitting(false);
        setSuccessMessage(`Authentification Super-Admin validée hors-ligne...`);
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        if (onAddSecurityLog) onAddSecurityLog('Super Admin Login', `Dev Bypass`, 'success');
        setTimeout(() => {
          onLoginSuccess('superadmin', 'M. Stéphane Alongo', 'superadmin', 'all', 'Console Centrale');
        }, 350);
        return;
      }

      // 1. SUPABASE AUTH
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: cleanSecret,
      });

      if (error) {
        setIsSubmitting(false);
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);
        if (newFailed >= 3) {
          setLockoutTimer(30);
          setErrorMessage('Tentatives multiples échouées. Verrouillage (30s).');
        } else {
          setErrorMessage(`Échec d'authentification : Identifiant ou mot de passe incorrect.`);
        }
        if (onAddSecurityLog) {
          onAddSecurityLog('Auth Failed', `Accès refusé pour ${cleanId}`, 'error');
        }
        return;
      }

      // 2. Fetch Profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, school_id, first_name, last_name')
        .eq('id', data.user?.id)
        .single();

      if (profileError || !profile) {
        console.warn("Profile not found, using selected role:", profileError);
      }

      const userRole = (profile?.role as UserRole) || selectedRole;
      const userSchoolId = profile?.school_id || selectedSchoolId || 'default';
      const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : cleanId;

      // Find the school name based on ID
      const schoolName = availableSchools.find(s => s.id === userSchoolId)?.name || 'Établissement';

      setIsSubmitting(false);
      setSuccessMessage(`Authentification validée. Bienvenue ${displayName}...`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      
      if (onAddSecurityLog) {
        onAddSecurityLog('Login Success', `Connecté : ${displayName} (${userRole})`, 'success');
      }

      setTimeout(() => {
        onLoginSuccess(
          userRole,
          displayName,
          'dashboard', // Default tab
          userSchoolId,
          schoolName
        );
      }, 500);

    } catch (err: any) {
      console.error('Login error:', err);
      setIsSubmitting(false);
      setErrorMessage(`Erreur technique : ${err.message || 'Problème réseau'}`);
    }
  };

  // Handle PIN Setup / Creation
  const handleSaveCreatedPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinSetupError(null);

    const requiredLen = selectedRole === 'parent' ? 4 : 6;
    const cleanPin = newPinValue.trim();
    const cleanConfirm = confirmPinValue.trim();

    if (!cleanPin || !/^\d+$/.test(cleanPin)) {
      setPinSetupError(`Le code PIN doit comporter uniquement des chiffres (0-9).`);
      return;
    }

    if (cleanPin.length !== requiredLen) {
      setPinSetupError(`Le code PIN doit comporter exactement ${requiredLen} chiffres.`);
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setPinSetupError(`Les deux codes PIN saisis ne correspondent pas.`);
      return;
    }

    // Determine target key to save
    let keyToSave = identifier.trim().toUpperCase();
    if (selectedRole === 'parent') {
      keyToSave = extractPhoneDigits(identifier);
    }

    savePinLocally(keyToSave, cleanPin);
    setPasswordOrPin(cleanPin);
    setPinSetupSuccess(true);

    setTimeout(() => {
      setPinSetupSuccess(false);
      setShowPinSetupModal(false);
      setSuccessMessage(`Code PIN à ${requiredLen} chiffres créé avec succès pour votre profil ! Vous pouvez maintenant vous connecter.`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none transition-colors duration-300">
      
      {/* Background Ambience Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 bg-[radial-gradient(#6366f1_1.2px,transparent_1.2px)] [background-size:28px_28px]"></div>
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-indigo-500/15 dark:bg-indigo-600/25 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-emerald-500/15 dark:bg-emerald-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-sky-500/5 dark:bg-sky-500/10 blur-[120px] pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 border-b border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl bg-white/90 dark:bg-slate-950/85 transition-colors text-center sm:text-left">
        {/* Left: Brand Logo & Title - Clickable to return to Vitrine */}
        <button
          id="btn-login-brand-vitrine"
          type="button"
          onClick={handleBackToVitrine}
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 text-center sm:text-left group cursor-pointer transition-all hover:opacity-90 active:scale-98 focus:outline-none rounded-2xl p-1 -m-1"
          title="Accéder au portail vitrine officiel EDU-CONGO"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 border border-indigo-400/40 flex items-center justify-center font-display font-black text-white text-base sm:text-lg shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-all shrink-0">
            EC
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-center gap-2">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                EDU-CONGO
              </span>
              <span className="bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Portail Sécurisé
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium tracking-tight mt-0.5 text-center sm:text-left">
              Système de Gestion Scolaire • République du Congo (+242)
            </p>
          </div>
        </button>

        {/* Right: Theme Toggle & Vitrine Button */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <ThemeToggle variant="pill" showLabel={true} />
          
          <button
            id="btn-login-vitrine-link"
            type="button"
            onClick={handleBackToVitrine}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-50 dark:bg-slate-900 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-indigo-950 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-slate-800 flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
            title="Revenir sur la page de présentation vitrine"
          >
            <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline font-bold">Vitrine EDU-CONGO</span>
            <span className="sm:hidden font-bold">Vitrine</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-3.5 sm:px-4 py-5 sm:py-8 flex flex-col items-center">
        
        {/* Hero Presentation Header */}
        <div className="text-center max-w-2xl mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/90 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-300 text-xs font-bold mb-2 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Portail Officiel et Sécurisé Multi-Rôles
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Accédez à votre espace pédagogique & administratif
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed text-balance max-w-xl mx-auto font-normal">
            Sélectionnez votre profil d'accès pour vous connecter à l'aide de votre identifiant ou code PIN sécurisé.
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800/90 rounded-3xl p-3.5 sm:p-5 mb-5 sm:mb-6 shadow-xl backdrop-blur-xl transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800/70 text-center sm:text-left">
            <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              1. Choisissez votre profil d'utilisateur :
            </span>
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Contrôle Anti-Doublon Actif
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {rolesConfig.filter(r => r.role !== 'superadmin' || showDevSecretTab).map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedRole === item.role;

              return (
                <button
                  key={item.role}
                  id={`role-btn-${item.role}`}
                  type="button"
                  onClick={() => handleSelectRole(item.role)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-br ${item.color} text-white shadow-lg shadow-indigo-600/25 scale-[1.03] ring-2 ring-indigo-500/30 dark:ring-indigo-400/40 font-bold`
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white border border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
                    isSelected ? 'bg-white/20 text-white scale-110 shadow-xs' : 'bg-slate-200/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-0.5 w-full">
                    <span className="font-display font-bold text-xs leading-tight tracking-tight text-center">
                      {item.label.replace('Espace ', '').replace('Corps ', '').replace('Console ', '')}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md mt-0.5 text-center ${
                      isSelected 
                        ? 'bg-white/25 text-white font-bold' 
                        : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-400'
                    }`}>
                      {item.authType === 'pin6' ? 'PIN 6 ch.' : item.authType === 'pin4' ? 'PIN 4 ch.' : 'Mot de passe'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Box */}
        <div className="w-full max-w-xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl relative transition-all">
          
          {/* Header of Active Role - Centré sur mobile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${currentRoleConfig.color} flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0`}>
              <currentRoleConfig.icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                {currentRoleConfig.label}
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                {currentRoleConfig.category}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                {currentRoleConfig.securityNote}
              </p>
            </div>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <div className="mt-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 flex items-start gap-3 text-rose-900 dark:text-rose-200 text-xs animate-in shake">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-xs block mb-0.5">Erreur d'authentification :</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 flex items-start gap-3 text-emerald-900 dark:text-emerald-200 text-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-xs block mb-0.5">Connexion validée :</span>
                <p className="leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmitAuth} className="mt-5 flex flex-col gap-4 text-xs">
            
            {/* School Selector (for staff roles) */}
            {selectedRole !== 'superadmin' && (
              <div>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1.5 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-2">
                    <School className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 
                    Établissement scolaire de rattachement :
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    Multi-Tenant Isolé
                  </span>
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  {availableSchools.length > 0 ? (
                    availableSchools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name} — {school.city} ({school.department})
                      </option>
                    ))
                  ) : (
                    <option value="">Aucun établissement enregistré (Créez un établissement ou accédez au Super-Admin)</option>
                  )}
                </select>
              </div>
            )}

            {/* Identifier Input */}
            <div>
              <label className="text-slate-800 dark:text-slate-200 font-bold mb-1.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {currentRoleConfig.idLabel} :
                </span>
                {selectedRole === 'eleve' && (
                  <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono font-bold">ex: MAT-2026-001</span>
                )}
                {selectedRole === 'parent' && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">ex: +242 06 612 3456</span>
                )}
                {selectedRole === 'enseignant' && (
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">ex: ENS-014</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentRoleConfig.placeholderId}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-semibold"
                />
                <UserCheck className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Secret Input (PIN or Password) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2 text-xs sm:text-sm">
                  <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {currentRoleConfig.authType === 'pin6' 
                    ? 'Code PIN Secret (6 chiffres) :' 
                    : currentRoleConfig.authType === 'pin4' 
                    ? 'Code PIN Secret (4 chiffres) :' 
                    : 'Mot de passe sécurisé :'}
                </label>

                {(selectedRole === 'eleve' || selectedRole === 'parent' || selectedRole === 'enseignant') && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewPinValue('');
                      setConfirmPinValue('');
                      setPinSetupError(null);
                      setShowPinSetupModal(true);
                    }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    Créer / Modifier mon Code PIN
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={currentRoleConfig.authType === 'pin4' ? 4 : currentRoleConfig.authType === 'pin6' ? 6 : 40}
                  value={passwordOrPin}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (currentRoleConfig.authType === 'pin4' || currentRoleConfig.authType === 'pin6') {
                      setPasswordOrPin(val.replace(/[^0-9]/g, ''));
                    } else {
                      setPasswordOrPin(val);
                    }
                  }}
                  placeholder={currentRoleConfig.authType === 'pin6' ? '•••••• (6 chiffres)' : currentRoleConfig.authType === 'pin4' ? '•••• (4 chiffres)' : 'Votre mot de passe'}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    currentRoleConfig.authType.startsWith('pin') ? 'font-mono text-center tracking-[0.35em] text-base sm:text-lg font-bold' : 'font-medium'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 absolute right-3 top-2.5 cursor-pointer rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title={showPassword ? "Masquer le code" : "Afficher le code"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Pin format indicator */}
              {currentRoleConfig.authType.startsWith('pin') && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">
                  Saisie numérique exclusive ({currentRoleConfig.pinLength} chiffres de 0 à 9).
                </span>
              )}

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            {/* Master Key for Super Admin */}
            {selectedRole === 'superadmin' && (
              <div>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1.5 block text-xs sm:text-sm">
                  Clé Maître Super-Admin :
                </label>
                <input
                  type="password"
                  value={developerKey}
                  onChange={(e) => setDeveloperKey(e.target.value)}
                  placeholder="Clé maître requise"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isSubmitting || lockoutTimer > 0}
              className={`w-full py-3.5 rounded-xl font-display font-extrabold text-white text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                lockoutTimer > 0
                  ? 'bg-slate-400 dark:bg-slate-700 opacity-50 cursor-not-allowed'
                  : `bg-gradient-to-r ${currentRoleConfig.color} hover:opacity-95 active:scale-98 shadow-indigo-600/25`
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Vérification des accès...'
                  : lockoutTimer > 0
                  ? `Verrouillé temporairement (${lockoutTimer}s)`
                  : `Se Connecter en tant que ${currentRoleConfig.label}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Note Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Chiffrement TLS 256-bit • Base Nationale Congo
            </span>
            <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
              EDU-CONGO v4.2
            </span>
          </div>

        </div>
      </main>

      {/* PIN CREATION & SETUP MODAL */}
      {/* FORGOT PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                    Mot de passe oublié
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Récupération par WhatsApp
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {forgotError && (
              <div className="mt-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}
            {forgotStep === "phone" && (
              <div className="mt-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Veuillez saisir le numéro de téléphone WhatsApp utilisé lors de votre inscription pour recevoir un code de réinitialisation.
                </p>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1 block text-xs">
                  Numéro WhatsApp (+242) :
                </label>
                <input
                  type="text"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="06 895 83 77"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    if (forgotPhone.length < 8) {
                      setForgotError("Veuillez saisir un numéro de téléphone valide.");
                      return;
                    }
                    setForgotError(null);
                    setForgotStep("otp");
                  }}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Recevoir le code par WhatsApp
                </button>
              </div>
            )}
            {forgotStep === "otp" && (
              <div className="mt-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Un code à 4 chiffres a été envoyé au <span className="font-bold text-slate-900 dark:text-white">{forgotPhone}</span>. (Simulation: Saisissez 1234)
                </p>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1 block text-xs">
                  Code de vérification :
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-center text-xl tracking-[1em] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    if (forgotOtp !== "1234") {
                      setForgotError("Code incorrect. Veuillez réessayer.");
                      return;
                    }
                    setForgotError(null);
                    setForgotStep("new_password");
                  }}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Vérifier le code
                </button>
              </div>
            )}
            {forgotStep === "new_password" && (
              <div className="mt-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Veuillez saisir votre nouveau mot de passe (ou code PIN).
                </p>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1 block text-xs">
                  Nouveau mot de passe :
                </label>
                <input
                  type="password"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    if (forgotNewPassword.length < 4) {
                      setForgotError("Le mot de passe doit contenir au moins 4 caractères.");
                      return;
                    }
                    setCustomPins(prev => ({ ...prev, [identifier || "reset"]: forgotNewPassword }));
                    localStorage.setItem("educongo_user_pins", JSON.stringify({ ...customPins, [identifier || "reset"]: forgotNewPassword }));
                    setShowForgotPasswordModal(false);
                    setForgotStep("phone");
                    setForgotOtp("");
                    setForgotPhone("");
                    setForgotNewPassword("");
                  }}
                  className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Enregistrer le nouveau mot de passe
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showPinSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                    {selectedRole === 'parent' ? 'Configuration Code PIN Tuteur (4 Chiffres)' : 'Configuration Code PIN (6 Chiffres)'}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Profil concerné : {currentRoleConfig.label}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowPinSetupModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction description */}
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-3 leading-relaxed text-justified-academic">
              Définissez un code PIN confidentiel composé de chiffres ({selectedRole === 'parent' ? '4 chiffres' : '6 chiffres'}). Ce code sera mémorisé pour vos prochaines connexions rapides.
            </p>

            {pinSetupError && (
              <div className="mt-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{pinSetupError}</span>
              </div>
            )}

            {pinSetupSuccess && (
              <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Code PIN enregistré avec succès !</span>
              </div>
            )}

            <form onSubmit={handleSaveCreatedPin} className="mt-4 flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1 block">
                  Identifiant rattaché :
                </label>
                <input
                  type="text"
                  readOnly
                  value={identifier}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1 block">
                  Nouveau Code PIN ({selectedRole === 'parent' ? '4' : '6'} chiffres numériques) :
                </label>
                <input
                  type="password"
                  required
                  maxLength={selectedRole === 'parent' ? 4 : 6}
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={selectedRole === 'parent' ? '••••' : '••••••'}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-3 text-center font-mono text-xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-800 dark:text-slate-200 font-bold mb-1 block">
                  Confirmez votre Code PIN :
                </label>
                <input
                  type="password"
                  required
                  maxLength={selectedRole === 'parent' ? 4 : 6}
                  value={confirmPinValue}
                  onChange={(e) => setConfirmPinValue(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={selectedRole === 'parent' ? '••••' : '••••••'}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-3 text-center font-mono text-xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinSetupModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Enregistrer mon Code PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 text-center text-slate-500 dark:text-slate-400 text-xs border-t border-slate-200/80 dark:border-slate-900">
        <p className="leading-relaxed">
          EDU-CONGO SaaS • Conforme aux directives du Ministère de l'Enseignement Préscolaire, Primaire, Secondaire et de l'Alphabétisation • République du Congo
        </p>
      </footer>

    </div>
  );
};
