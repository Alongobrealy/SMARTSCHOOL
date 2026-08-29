import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Server, 
  Database, 
  CreditCard, 
  Radio, 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Upload, 
  Play, 
  Activity, 
  Globe, 
  School, 
  Users, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink, 
  Sliders, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Phone, 
  Mail, 
  Eye, 
  Sparkles, 
  FileText, 
  Send,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
  Ban,
  PauseCircle,
  PlayCircle,
  PowerOff,
  ShieldAlert,
  X
} from 'lucide-react';
import { 
  TenantSchool, 
  SystemLogEntry, 
  ApiGatewayStatus, 
  SystemFeatureFlag,
  Student,
  Teacher,
  FeePayment,
  SubscriptionRequest
} from '../../types';
import { 
  generateActivationCode, 
  SUBSCRIPTION_PLANS, 
  ActivationCodeDetails 
} from '../../utils/activationCode';
import confetti from 'canvas-confetti';

interface DeveloperSuperAdminModuleProps {
  tenants: TenantSchool[];
  logs: SystemLogEntry[];
  gateways: ApiGatewayStatus[];
  featureFlags: SystemFeatureFlag[];
  students?: Student[];
  teachers?: Teacher[];
  payments?: FeePayment[];
  subscriptionRequests?: SubscriptionRequest[];
  onAddTenant: (newTenant: TenantSchool) => void;
  onUpdateTenant: (updatedTenant: TenantSchool) => void;
  onDeleteTenant: (tenantId: string) => void;
  onToggleFeatureFlag: (flagId: string) => void;
  onAddLog: (newLog: SystemLogEntry) => void;
  onClearLogs: () => void;
  onImpersonateSchool: (schoolName: string) => void;
  onLockSession: () => void;
  onOpenApprovalModal?: (req: SubscriptionRequest) => void;
}

export const DeveloperSuperAdminModule: React.FC<DeveloperSuperAdminModuleProps> = ({
  tenants,
  logs,
  gateways,
  featureFlags,
  students = [],
  teachers = [],
  payments = [],
  subscriptionRequests = [],
  onAddTenant,
  onUpdateTenant,
  onDeleteTenant,
  onToggleFeatureFlag,
  onAddLog,
  onClearLogs,
  onImpersonateSchool,
  onLockSession,
  onOpenApprovalModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'requests' | 'gateways' | 'logs' | 'terminal' | 'flags' | 'activation_codes'>('overview');
  
  // Search & Filters
  const [tenantSearch, setTenantSearch] = useState<string>('');
  const [tenantCityFilter, setTenantCityFilter] = useState<string>('all');
  const [tenantStatusFilter, setTenantStatusFilter] = useState<string>('all');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Activation Code Generator State
  const [codeSchoolId, setCodeSchoolId] = useState<string>(tenants[0]?.id || '');
  const [codePlanId, setCodePlanId] = useState<'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'>('annuel');
  const [recentlyGeneratedCode, setRecentlyGeneratedCode] = useState<ActivationCodeDetails | null>(null);
  const [generatedCodesHistory, setGeneratedCodesHistory] = useState<ActivationCodeDetails[]>(() => {
    try {
      const saved = localStorage.getItem('edu_congo_activation_codes_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tenant Status & Deletion Management
  const [tenantToDelete, setTenantToDelete] = useState<TenantSchool | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState<string>('');

  // New Tenant Modal
  const [showNewTenantModal, setShowNewTenantModal] = useState<boolean>(false);
  const [newTenantData, setNewTenantData] = useState({
    name: '',
    code: '',
    type: 'complexe' as 'primaire' | 'secondaire' | 'professionnel' | 'complexe',
    city: 'Brazzaville',
    address: '',
    contactName: '',
    contactPhone: '+242 06 ',
    contactEmail: '',
    studentCount: 500,
    plan: 'Pro' as 'Starter' | 'Pro' | 'Entreprise' | 'Annuel',
    monthlyFeeFCFA: 25000
  });

  // MoMo Simulator State
  const [simulatorAmount, setSimulatorAmount] = useState<number>(50000);
  const [simulatorProvider, setSimulatorProvider] = useState<'MTN Mobile Money' | 'Airtel Money'>('MTN Mobile Money');
  const [simulatorPhone, setSimulatorPhone] = useState<string>('+242 06 612 3456');
  const [simulatorSchool, setSimulatorSchool] = useState<string>(tenants[0]?.name || 'Établissement Scolaire');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatorSuccessMsg, setSimulatorSuccessMsg] = useState<string | null>(null);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'input' | 'output' | 'error'; text: string }[]>([
    { type: 'output', text: '==================================================' },
    { type: 'output', text: '  EDU-CONGO SUPER ADMIN / DEV CLI v2.4.0' },
    { type: 'output', text: '  Connected to Cloud Run Cluster (europe-west2)' },
    { type: 'output', text: '  Type "help" to list available diagnostic commands.' },
    { type: 'output', text: '==================================================' }
  ]);

  // Live Ping Timer simulation
  const [liveLatency, setLiveLatency] = useState<number>(38);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(32 + Math.random() * 15));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Create Tenant
  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantData.name) return;

    const generatedCode = newTenantData.code || newTenantData.name.substring(0, 8).toUpperCase().replace(/\s+/g, '-');
    const newTenant: TenantSchool = {
      id: `ten-${Date.now()}`,
      code: generatedCode,
      name: newTenantData.name,
      type: newTenantData.type,
      city: newTenantData.city,
      address: newTenantData.address || `${newTenantData.city}, République du Congo`,
      contactName: newTenantData.contactName || 'Directeur Général',
      contactPhone: newTenantData.contactPhone,
      contactEmail: newTenantData.contactEmail || `contact@${generatedCode.toLowerCase()}.cg`,
      studentCount: Number(newTenantData.studentCount),
      teacherCount: Math.round(Number(newTenantData.studentCount) / 18),
      plan: newTenantData.plan,
      status: 'actif',
      licenseExpiresAt: '2027-08-31',
      masterKey: `MST-${generatedCode}-${Math.floor(10000 + Math.random() * 90000)}`,
      databaseSizeMb: 45.2,
      momoGatewayConnected: true,
      monthlyFeeFCFA: Number(newTenantData.monthlyFeeFCFA),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTenant(newTenant);
    onAddLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'audit',
      source: 'TENANT_ROUTER',
      message: `Nouvel établissement provisionné : ${newTenant.name} (${newTenant.code})`,
      user: 'superadmin@edu-congo.cg',
      ip: '197.234.220.12'
    });

    setShowNewTenantModal(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Change Tenant Status (Suspend / Deactivate / Reactivate)
  const handleSetTenantStatus = (tenant: TenantSchool, newStatus: 'actif' | 'suspendu' | 'en_attente') => {
    const updatedTenant: TenantSchool = {
      ...tenant,
      status: newStatus
    };
    onUpdateTenant(updatedTenant);
    
    const actionLabel = newStatus === 'actif' 
      ? 'RÉACTIVÉ / ACTIF' 
      : newStatus === 'suspendu' 
      ? 'SUSPENDU' 
      : 'DÉSACTIVÉ / EN ATTENTE';

    onAddLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: newStatus === 'actif' ? 'info' : 'warning',
      source: 'TENANT_ROUTER',
      message: `[STATUT ÉTABLISSEMENT] '${tenant.name}' (${tenant.code}) est désormais ${actionLabel}.`,
      user: 'superadmin@edu-congo.cg',
      ip: '197.234.220.12'
    });
  };

  // Generate Activation Code
  const handleGenerateActivationCode = (overrideSchoolId?: string, overridePlanId?: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel') => {
    const targetId = overrideSchoolId || codeSchoolId;
    const targetPlan = overridePlanId || codePlanId;
    const targetSchool = tenants.find(t => t.id === targetId) || tenants[0];
    if (!targetSchool) return;

    const newCodeDetails = generateActivationCode(
      { id: targetSchool.id, code: targetSchool.code, name: targetSchool.name },
      targetPlan
    );

    setRecentlyGeneratedCode(newCodeDetails);
    setGeneratedCodesHistory(prev => {
      const updated = [newCodeDetails, ...prev.filter(c => c.code !== newCodeDetails.code)];
      try {
        localStorage.setItem('edu_congo_activation_codes_v1', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    onAddLog({
      id: `ACT-GEN-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'info',
      source: 'SECURITY_AUTH',
      message: `[CODE D'ACTIVATION UNIQUE GÉNÉRÉ] Formule ${newCodeDetails.planName} (${newCodeDetails.amountFCFA.toLocaleString()} FCFA) pour '${newCodeDetails.schoolName}'. Code: ${newCodeDetails.code}`,
      ip: '127.0.0.1 (Brazzaville)',
      user: 'Super-Admin EDU-CONGO'
    });

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
  };

  const handleQuickGenerateCodeForTenant = (tenant: TenantSchool) => {
    setCodeSchoolId(tenant.id);
    setActiveTab('activation_codes');
    handleGenerateActivationCode(tenant.id, 'annuel');
  };

  // Confirm Permanent Deletion of Tenant
  const handleDeleteTenantConfirmed = () => {
    if (!tenantToDelete) return;
    const deletedName = tenantToDelete.name;
    const deletedCode = tenantToDelete.code;
    const deletedId = tenantToDelete.id;

    onDeleteTenant(deletedId);

    onAddLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      level: 'error',
      source: 'TENANT_ROUTER',
      message: `[SUPPRESSION DÉFINITIVE] L'établissement '${deletedName}' (${deletedCode}) a été supprimé du cluster par le super-admin.`,
      user: 'superadmin@edu-congo.cg',
      ip: '197.234.220.12'
    });

    setTenantToDelete(null);
    setDeleteConfirmationInput('');
  };

  // Run MoMo Simulation
  const handleRunMoMoSimulation = () => {
    setIsSimulating(true);
    setSimulatorSuccessMsg(null);

    setTimeout(() => {
      const txnRef = `TXN-CG-${simulatorProvider === 'MTN Mobile Money' ? 'MOMO' : 'AIRTEL'}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      onAddLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        level: 'info',
        source: simulatorProvider === 'MTN Mobile Money' ? 'MOMO_CONGO' : 'AIRTEL_MONEY',
        message: `Webhook transaction validée : ${txnRef} (+${simulatorAmount.toLocaleString()} FCFA)`,
        user: simulatorPhone,
        ip: '41.138.89.22',
        details: `Établissement: ${simulatorSchool} | Réf: ${txnRef}`
      });

      setIsSimulating(false);
      setSimulatorSuccessMsg(`Paiement de ${simulatorAmount.toLocaleString()} FCFA validé avec succès (Réf: ${txnRef}). Reçu officiel transmis au serveur de ${simulatorSchool}.`);
      
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const inputEntry = { type: 'input' as const, text: `$ ${terminalInput}` };
    let outputEntries: { type: 'input' | 'output' | 'error'; text: string }[] = [];

    switch (cmd) {
      case 'help':
        outputEntries = [
          { type: 'output', text: 'Available Super Admin Commands:' },
          { type: 'output', text: '  status       : Displays server compute, cluster and latency stats' },
          { type: 'output', text: '  tenants      : Lists all active school instances across Congo' },
          { type: 'output', text: '  ping momo    : Tests connection with MTN MoMo and Airtel Money APIs' },
          { type: 'output', text: '  stats        : Shows global students count and FCFA volume' },
          { type: 'output', text: '  backup       : Generates a JSON snapshot backup of the platform' },
          { type: 'output', text: '  clear-logs   : Clears recent audit trail history' },
          { type: 'output', text: '  whoami       : Displays current developer security identity' },
          { type: 'output', text: '  clear        : Clears the terminal screen' }
        ];
        break;

      case 'status':
        outputEntries = [
          { type: 'output', text: 'STATUS CHECK: OK' },
          { type: 'output', text: `  Container: Cloud Run (Node 20 / TypeScript)` },
          { type: 'output', text: `  Port: 3000 | Ingress: NGINX Reverse Proxy` },
          { type: 'output', text: `  Latency to Brazzaville: ${liveLatency}ms` },
          { type: 'output', text: `  Database: Cloud Firestore (100% healthy, 0 fail)` }
        ];
        break;

      case 'tenants':
        outputEntries = [
          { type: 'output', text: `Total Tenants: ${tenants.length}` },
          ...tenants.map(t => ({
            type: 'output' as const,
            text: `  [${t.code}] ${t.name} (${t.city}) - ${t.studentCount} élèves - Plan: ${t.plan}`
          }))
        ];
        break;

      case 'stats':
        const totalStudents = tenants.reduce((acc, t) => acc + t.studentCount, 0);
        const totalMonthlyFCFA = tenants.reduce((acc, t) => acc + t.monthlyFeeFCFA, 0);
        outputEntries = [
          { type: 'output', text: `GLOBAL METRICS:` },
          { type: 'output', text: `  Active Schools   : ${tenants.length}` },
          { type: 'output', text: `  Total Students   : ~${totalStudents.toLocaleString()} élèves` },
          { type: 'output', text: `  Monthly Sub Rev  : ${totalMonthlyFCFA.toLocaleString()} FCFA / mois` },
          { type: 'output', text: `  Gateways Active  : MTN MoMo (+242), Airtel Money (+242), WhatsApp API` }
        ];
        break;

      case 'ping momo':
        outputEntries = [
          { type: 'output', text: 'PINGING TELECOM GATEWAYS...' },
          { type: 'output', text: '  -> MTN Congo MoMo API (api.mtn.cg) : 142ms [ACK 200 OK]' },
          { type: 'output', text: '  -> Airtel Money OpenAPI (airtel.cg) : 185ms [ACK 200 OK]' },
          { type: 'output', text: '  -> WhatsApp Cloud API (+242 06 895 83 77) : 95ms [ACTIVE]' }
        ];
        break;

      case 'backup':
        handleDownloadBackup();
        outputEntries = [
          { type: 'output', text: 'Generating snapshot backup archive...' },
          { type: 'output', text: 'JSON Archive generated and downloaded successfully.' }
        ];
        break;

      case 'clear-logs':
        onClearLogs();
        outputEntries = [
          { type: 'output', text: 'System audit logs cleared.' }
        ];
        break;

      case 'whoami':
        outputEntries = [
          { type: 'output', text: 'User: Stéphane Alongo (Lead Architect & Super Admin)' },
          { type: 'output', text: 'Email: steph.alongo@gmail.com' },
          { type: 'output', text: 'Phone: +242 06 895 83 77 / +242 06 169 35 98' },
          { type: 'output', text: 'Role: ROOT_SUPERADMIN (Full Access)' }
        ];
        break;

      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;

      default:
        outputEntries = [
          { type: 'error', text: `Command not recognized: "${cmd}". Type "help" for a list of available commands.` }
        ];
        break;
    }

    setTerminalHistory(prev => [...prev, inputEntry, ...outputEntries]);
    setTerminalInput('');
  };

  // Download Full DB Backup
  const handleDownloadBackup = () => {
    const backupData = {
      version: 'EDU-CONGO-2.4.0',
      exportedAt: new Date().toISOString(),
      tenants,
      gateways,
      featureFlags,
      studentsCount: students.length,
      teachersCount: teachers.length,
      paymentsCount: payments.length,
      sampleRecords: {
        students,
        teachers,
        payments
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edu_congo_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(tenantSearch.toLowerCase()) || 
                          t.code.toLowerCase().includes(tenantSearch.toLowerCase()) ||
                          t.contactName.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchesCity = tenantCityFilter === 'all' || t.city === tenantCityFilter;
    const matchesStatus = tenantStatusFilter === 'all' || t.status === tenantStatusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Filtered logs
  const filteredLogs = logs.filter(l => {
    if (logLevelFilter === 'all') return true;
    return l.level === logLevelFilter;
  });

  // Calculated totals
  const totalNetworkStudents = tenants.reduce((acc, t) => acc + t.studentCount, 0);
  const totalNetworkMonthlyFCFA = tenants.reduce((acc, t) => acc + t.monthlyFeeFCFA, 0);

  return (
    <div className="space-y-6">
      
      {/* Super Admin Top Control Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border-2 border-indigo-400 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-500/20">
            <Terminal className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3 h-3 text-emerald-400" />
                SUPER ADMIN CONNECTÉ • ACCÈS ROOT
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Latence : <strong className="text-emerald-400">{liveLatency}ms</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Console Centrale & Administration Globale EDU-CONGO
            </h1>
            <p className="text-xs text-indigo-200/80 font-medium mt-0.5">
              Supervision Multi-Établissements • Passerelles MoMo/Airtel (+242) • Télémétrie & Outils DevOps
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={handleDownloadBackup}
            className="px-3.5 py-2 bg-indigo-600/40 hover:bg-indigo-600 border border-indigo-400/40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Télécharger une sauvegarde complète JSON"
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            <span>Sauvegarde JSON</span>
          </button>

          <button
            onClick={onLockSession}
            className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Verrouiller la session développeur"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Verrouiller</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Vue d\'Ensemble Réseau', icon: Activity, count: null },
          { id: 'tenants', label: 'Parc Établissements', icon: School, count: tenants.length },
          { id: 'activation_codes', label: 'Codes d\'Activation', icon: Key, count: generatedCodesHistory.length > 0 ? generatedCodesHistory.length : null },
          { id: 'requests', label: 'Inscriptions & Demandes', icon: CheckCircle2, count: subscriptionRequests.length },
          { id: 'gateways', label: 'Passerelles MoMo & Télécom', icon: CreditCard, count: gateways.length },
          { id: 'logs', label: 'Logs & Audit Trail', icon: FileText, count: logs.length },
          { id: 'terminal', label: 'Console CLI & DevOps', icon: Terminal, count: null },
          { id: 'flags', label: 'Feature Flags & Config', icon: Sliders, count: featureFlags.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <School className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Écoles Connectées
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {tenants.length} <span className="text-xs text-emerald-600 font-semibold">(100% actives)</span>
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Élèves sous Licence
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ~{totalNetworkStudents.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Revenu Récurrent (MRR)
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {totalNetworkMonthlyFCFA.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Disponibilité Cluster
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  99.98%
                </span>
              </div>
            </div>

          </div>

          {/* Regional & Infrastructure Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 cols: Regional Distribution */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Déploiement Territorial en République du Congo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Répartition géographique des instances et serveurs scolaires
                  </p>
                </div>
                <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-mono text-xs px-3 py-1 rounded-full font-bold border border-indigo-200 dark:border-indigo-800">
                  Zone CEMAC • Congo (242)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {tenants.length === 0 ? (
                  <div className="sm:col-span-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                    <School className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Aucun établissement dans le réseau</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Le réseau est vierge. Utilisez l'onglet « Parc Établissements » pour provisionner une nouvelle école.</p>
                  </div>
                ) : (
                  ['Brazzaville', 'Pointe-Noire', 'Dolisie'].map(city => {
                    const cityTenants = tenants.filter(t => t.city.toLowerCase().includes(city.toLowerCase()));
                    const cityStudents = cityTenants.reduce((acc, t) => acc + t.studentCount, 0);
                    return (
                      <div key={city} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">📍 {city}</span>
                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {cityTenants.length} {cityTenants.length > 1 ? 'Écoles' : 'École'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {cityTenants.length > 0 ? cityTenants.map(t => t.name).join(', ') : 'Aucune école active'}
                          </p>
                        </div>
                        <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                          Effectif : <strong>{cityStudents.toLocaleString()} élèves</strong>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Developer contact direct */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Support & Maintenance Développeur : Stéphane Alongo</span>
                    <span className="text-indigo-700 dark:text-indigo-300 text-[11px]">Brazzaville, République du Congo • steph.alongo@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/242068958377"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-white font-bold rounded-xl flex items-center gap-1 hover:opacity-90"
                  >
                    WhatsApp +242 06 895 83 77
                  </a>
                </div>
              </div>
            </div>

            {/* Right col: Live Cluster & Telemetry */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Télémétrie Système en Direct
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-medium mb-1">
                    <span>CPU Container (Cloud Run)</span>
                    <span className="font-mono font-bold text-emerald-600">14.2%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-medium mb-1">
                    <span>Mémoire RAM Allouée (512MB / 2GB)</span>
                    <span className="font-mono font-bold text-indigo-600">25.6%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25.6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-medium mb-1">
                    <span>Passerelles MoMo & SMS (+242)</span>
                    <span className="font-mono font-bold text-emerald-600">100% OK</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-col gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Runtime :</span>
                    <span className="text-slate-800 dark:text-slate-200">Node.js 20 ESM (Cloud Run)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Port Ingress :</span>
                    <span className="text-slate-800 dark:text-slate-200">3000 (HTTPS Proxy Active)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chiffrement :</span>
                    <span className="text-slate-800 dark:text-slate-200">TLS 1.3 / AES-256 GCM</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: TENANTS MANAGEMENT */}
      {activeTab === 'tenants' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Actions & Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, code ou responsable..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={tenantCityFilter}
                onChange={(e) => setTenantCityFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">Toutes les villes (Congo)</option>
                <option value="Brazzaville">Brazzaville</option>
                <option value="Pointe-Noire">Pointe-Noire</option>
                <option value="Dolisie">Dolisie</option>
                <option value="Oyo">Oyo</option>
                <option value="Nkayi">Nkayi</option>
              </select>

              <select
                value={tenantStatusFilter}
                onChange={(e) => setTenantStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 outline-none font-semibold"
              >
                <option value="all">Tous les statuts ({tenants.length})</option>
                <option value="actif">🟢 Actifs ({tenants.filter(t => t.status === 'actif').length})</option>
                <option value="suspendu">🔴 Suspendus ({tenants.filter(t => t.status === 'suspendu').length})</option>
                <option value="en_attente">🟡 Désactivés / En attente ({tenants.filter(t => t.status === 'en_attente').length})</option>
              </select>
            </div>

            <button
              onClick={() => setShowNewTenantModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Établissement</span>
            </button>

          </div>

          {/* Tenants Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4">Code & Établissement</th>
                    <th className="p-4">Type & Ville</th>
                    <th className="p-4 text-center">Effectif</th>
                    <th className="p-4 text-center">Formule / Forfait</th>
                    <th className="p-4 text-center">MoMo Gateway</th>
                    <th className="p-4 text-center">Statut Actuel</th>
                    <th className="p-4 text-right">Actions Développeur & Gestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((t) => (
                      <tr key={t.id} className={`transition-colors ${
                        t.status === 'suspendu'
                          ? 'bg-rose-50/40 dark:bg-rose-950/20'
                          : t.status === 'en_attente'
                          ? 'bg-amber-50/40 dark:bg-amber-950/20'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                      }`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${
                              t.status === 'suspendu'
                                ? 'bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                                : t.status === 'en_attente'
                                ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                                : 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'
                            }`}>
                              {t.code.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                                  {t.name}
                                </span>
                                {t.status === 'suspendu' && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                    Accès Bloqué
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{t.code}</span>
                                <span>•</span>
                                <span>{t.contactName} ({t.contactPhone})</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-slate-700 dark:text-slate-300">
                          <span className="font-semibold block">{t.city}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{t.type}</span>
                        </td>

                        <td className="p-4 text-center">
                          <span className="font-bold text-slate-900 dark:text-white block">{t.studentCount} élèves</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{t.teacherCount} profs</span>
                        </td>

                        <td className="p-4 text-center">
                          {t.isTrial || t.plan === 'Essai 14 Jours' ? (
                            <div className="flex flex-col items-center">
                              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold px-2.5 py-1 rounded-full text-[11px] border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                                <span>🎁 Essai 14 Jours</span>
                              </span>
                              <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 font-semibold">
                                Accès Illimité (0 FCFA)
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-full text-[11px] border border-indigo-200 dark:border-indigo-800">
                                {t.plan}
                              </span>
                              <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                                {t.monthlyFeeFCFA.toLocaleString()} FCFA/m
                              </span>
                            </>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          {t.momoGatewayConnected ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                              En attente
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                            t.status === 'actif'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : t.status === 'suspendu'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}>
                            {t.status === 'actif' && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                            {t.status === 'suspendu' && <Ban className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                            {t.status === 'en_attente' && <PauseCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                            {t.status === 'actif' ? 'ACTIF' : t.status === 'suspendu' ? 'SUSPENDU' : 'DÉSACTIVÉ'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Impersonate / Take Control */}
                            <button
                              onClick={() => onImpersonateSchool(t.name)}
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer hover:scale-105"
                              title="Prendre le contrôle de cet établissement"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Gérer</span>
                            </button>

                            {/* Status Toggles: Suspend / Deactivate / Activate */}
                            {t.status === 'actif' ? (
                              <>
                                <button
                                  onClick={() => handleSetTenantStatus(t, 'suspendu')}
                                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Suspendre cet établissement (bloque les accès)"
                                >
                                  <Ban className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                  <span className="hidden xl:inline">Suspendre</span>
                                </button>

                                <button
                                  onClick={() => handleSetTenantStatus(t, 'en_attente')}
                                  className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Désactiver cet établissement"
                                >
                                  <PowerOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  <span className="hidden xl:inline">Désactiver</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleSetTenantStatus(t, 'actif')}
                                className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Réactiver l'accès pour cet établissement"
                              >
                                <PlayCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Activer</span>
                              </button>
                            )}

                            {/* Quick Generate Activation Code */}
                            <button
                              onClick={() => handleQuickGenerateCodeForTenant(t)}
                              className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Générer un code d'activation pour cette école"
                            >
                              <Key className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span className="hidden xl:inline">Code</span>
                            </button>

                            {/* Master Key Copy */}
                            <button
                              onClick={() => handleCopy(t.masterKey, `key-${t.id}`)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                              title="Copier la clé maître de l'école"
                            >
                              {copiedText === `key-${t.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Key className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Delete Tenant Button */}
                            <button
                              onClick={() => {
                                setTenantToDelete(t);
                                setDeleteConfirmationInput('');
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer définitivement cet établissement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                        Aucun établissement ne correspond aux critères de recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2.5: SUBSCRIPTION REQUESTS & VALIDATIONS */}
      {activeTab === 'requests' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Demandes d'Abonnement & Inscriptions Établissements
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Gestion centralisée des souscriptions (Essai 14 jours, Mensuel, Trimestriel, Annuel) et validation officielle.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                  {subscriptionRequests.length} Demande{subscriptionRequests.length > 1 ? 's' : ''} au registre
                </span>
              </div>
            </div>

            {subscriptionRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3.5">Établissement & Ville</th>
                      <th className="p-3.5">Responsable & Contact</th>
                      <th className="p-3.5 text-center">Formule Choisie</th>
                      <th className="p-3.5 text-center">Montant</th>
                      <th className="p-3.5 text-center">Statut</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {subscriptionRequests.map((req) => {
                      const isTrial = req.isTrial || req.planId === 'essai_14j';
                      const isApproved = req.status === 'validee';

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {req.schoolName}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {req.city} ({req.department || 'Congo'}) • <span className="font-mono text-indigo-600 dark:text-indigo-400">{req.subdomain || 'mon-ecole'}.educongo.cg</span>
                            </div>
                          </td>

                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            <div className="font-semibold">{req.contactName || req.directorName || 'Administrateur'}</div>
                            <a
                              href={`https://wa.me/${(req.contactPhone || req.directorPhone || '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1 hover:underline mt-0.5"
                            >
                              <MessageCircle className="w-3 h-3" />
                              {req.contactPhone || req.directorPhone || '+242 06 895 83 77'}
                            </a>
                          </td>

                          <td className="p-3.5 text-center">
                            {isTrial ? (
                              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold px-2.5 py-1 rounded-full text-[11px] border border-amber-300 dark:border-amber-700">
                                🎁 Essai 14 Jours
                              </span>
                            ) : (
                              <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-full text-[11px] border border-indigo-200 dark:border-indigo-800">
                                {req.planTitle || req.selectedPlan || 'Annuel'}
                              </span>
                            )}
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {isTrial ? 'Accès 100% Illimité' : `${req.durationMonths || 12} mois`}
                            </span>
                          </td>

                          <td className="p-3.5 text-center font-mono font-bold text-slate-900 dark:text-white">
                            {isTrial ? (
                              <span className="text-emerald-600 dark:text-emerald-400">0 FCFA</span>
                            ) : (
                              `${(req.totalAmountFCFA || req.totalCostFCFA || 0).toLocaleString()} FCFA`
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            {isApproved ? (
                              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-full text-[10px] border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Validée & Active
                              </span>
                            ) : (
                              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold px-2.5 py-1 rounded-full text-[10px] border border-amber-300 dark:border-amber-700 animate-pulse">
                                En attente
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onOpenApprovalModal && (
                                <button
                                  onClick={() => onOpenApprovalModal(req)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                                >
                                  {isApproved ? 'Voir Agrément' : 'Valider & Activer'}
                                </button>
                              )}
                              <button
                                onClick={() => onImpersonateSchool(req.schoolName)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                                title="Ouvrir l'espace de cet établissement"
                              >
                                Ouvrir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <p className="font-semibold text-sm">Aucune demande d'inscription reçue pour le moment.</p>
                <p className="text-xs mt-1">
                  Les établissements qui s'inscrivent via la vitrine officielle apparaîtront automatiquement ici avec leur période d'essai de 14 jours ou leur formule d'abonnement.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'gateways' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Gateways Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gateways.map((gw) => (
              <div 
                key={gw.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      {gw.provider}
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {gw.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">
                    {gw.name}
                  </h4>

                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-1 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {gw.endpoint}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block">Latence</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{gw.latencyMs} ms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block">Uptime</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{gw.uptimePercentage}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block">Requêtes/j</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{gw.todayRequests.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Interactive MoMo Webhook Simulator */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-500/40 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 border border-indigo-400 flex items-center justify-center font-bold text-white shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                    TESTEUR DE PASSERELLE EN DIRECT
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    Simulateur de Webhook & Transaction Mobile Money Congo (+242)
                  </h3>
                </div>
              </div>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Environnement Sandbox / Live
              </span>
            </div>

            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Testez la réception en temps réel d'un paiement effectué par un parent au Congo via <strong>MTN MoMo (*105#)</strong> ou <strong>Airtel Money (*128#)</strong>. Le système génère instantanément l'accusé de réception, la mise à jour comptable et le reçu officiel.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-indigo-500/20 text-xs">
              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Opérateur :</label>
                <select
                  value={simulatorProvider}
                  onChange={(e) => setSimulatorProvider(e.target.value as any)}
                  className="w-full bg-slate-800 border border-indigo-500/40 rounded-xl p-2.5 text-white outline-none"
                >
                  <option value="MTN Mobile Money">MTN Mobile Money Congo (*105#)</option>
                  <option value="Airtel Money">Airtel Money Congo (*128#)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Montant (FCFA) :</label>
                <input
                  type="number"
                  step="5000"
                  value={simulatorAmount}
                  onChange={(e) => setSimulatorAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-indigo-500/40 rounded-xl p-2.5 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Téléphone Parent (+242) :</label>
                <input
                  type="text"
                  value={simulatorPhone}
                  onChange={(e) => setSimulatorPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-indigo-500/40 rounded-xl p-2.5 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Établissement Cible :</label>
                <select
                  value={simulatorSchool}
                  onChange={(e) => setSimulatorSchool(e.target.value)}
                  className="w-full bg-slate-800 border border-indigo-500/40 rounded-xl p-2.5 text-white outline-none"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-indigo-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Prêt à émettre le webhook vers l'API de validation</span>
              </div>

              <button
                onClick={handleRunMoMoSimulation}
                disabled={isSimulating}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer disabled:opacity-50 text-xs"
              >
                {isSimulating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>Simuler le Paiement MoMo ({simulatorAmount.toLocaleString()} FCFA)</span>
              </button>
            </div>

            {simulatorSuccessMsg && (
              <div className="bg-emerald-950/70 border border-emerald-500/50 p-4 rounded-2xl text-xs text-emerald-200 flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Confirmation Transaction Télécom Validée :</span>
                  <span>{simulatorSuccessMsg}</span>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 4: SYSTEM LOGS & AUDIT */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Niveau de Log :</span>
              {['all', 'security', 'audit', 'info', 'warning'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                    logLevelFilter === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'all' ? 'Tous' : lvl}
                </button>
              ))}
            </div>

            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purger l'Historique</span>
            </button>
          </div>

          {/* Logs List */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-2.5 font-mono text-xs max-h-[600px] overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase shrink-0 mt-0.5 ${
                      log.level === 'security' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      log.level === 'audit' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                      log.level === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {log.source}
                    </span>

                    <div>
                      <p className="text-slate-200 leading-relaxed font-sans text-xs">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          ↪ {log.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-[11px] text-slate-400 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                    <span className="text-slate-300 font-bold">{log.timestamp}</span>
                    <span className="text-indigo-400 font-mono text-[10px]">{log.ip}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Aucun log dans cette catégorie.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 5: CLI TERMINAL & DEVOPS */}
      {activeTab === 'terminal' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="bg-slate-950 text-emerald-400 rounded-3xl p-6 border border-slate-800 shadow-2xl font-mono text-xs space-y-4 min-h-[420px] flex flex-col justify-between">
            
            {/* Terminal Output */}
            <div className="space-y-1 overflow-y-auto max-h-[350px]">
              {terminalHistory.map((item, idx) => (
                <div 
                  key={idx} 
                  className={
                    item.type === 'input' ? 'text-indigo-300 font-bold' :
                    item.type === 'error' ? 'text-rose-400' : 'text-emerald-400/90'
                  }
                >
                  {item.text}
                </div>
              ))}
            </div>

            {/* Terminal Input Bar */}
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 border-t border-slate-800 pt-3">
              <span className="text-indigo-400 font-bold font-mono">root@edu-congo:~#</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Tapez 'help', 'status', 'ping momo', 'tenants', 'backup'..."
                autoFocus
                className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Exécuter
              </button>
            </form>

          </div>

          {/* Quick Command Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold">Raccourcis CLI :</span>
            {['status', 'ping momo', 'stats', 'tenants', 'backup', 'whoami'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setTerminalInput(cmd);
                }}
                className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px] transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* TAB 6: FEATURE FLAGS */}
      {activeTab === 'flags' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-950 dark:text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-600 inline mr-1.5" />
            <span>
              Les <strong>Feature Flags</strong> permettent au Super Admin d'activer ou désactiver des fonctionnalités critiques instantanément sur l'ensemble des établissements du Congo sans redéployer le serveur.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase font-mono">
                      {flag.category}
                    </span>
                    <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      {flag.key}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {flag.label}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {flag.description}
                  </p>
                </div>

                <button
                  onClick={() => onToggleFeatureFlag(flag.id)}
                  className={`p-1 rounded-2xl transition-all cursor-pointer shrink-0 ${
                    flag.enabled ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                  title={flag.enabled ? 'Désactiver' : 'Activer'}
                >
                  {flag.enabled ? (
                    <ToggleRight className="w-10 h-10 fill-indigo-600 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-400" />
                  )}
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 7: GENERATEUR DE CODES D'ACTIVATION UNIQUE */}
      {activeTab === 'activation_codes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-amber-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                  Sécurité Cryptographique
                </span>
                <span className="text-slate-400 text-xs font-mono">Module Super-Admin</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Générateur Officiel de Codes d'Activation Établissement
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Générez des clés d'activation uniques et infalsifiables pour les règlements en espèces ou mandats administratifs. Chaque code généré n'est valable <strong>que pour l'établissement sélectionné</strong> et lève immédiatement le statut suspendu.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 text-center shrink-0">
              <span className="text-[10px] text-amber-200 font-bold block uppercase tracking-wider">Tarification Officielle</span>
              <span className="text-xl font-black text-white font-mono">25 000 FCFA</span>
              <span className="text-[10px] text-slate-300 block">Base mensuelle sans engagement</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Code Generation Form */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Key className="w-5 h-5 text-amber-500" />
                <h4 className="font-black text-slate-900 dark:text-white text-sm">
                  1. Paramétrer la Clé d'Activation
                </h4>
              </div>

              {/* School Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Établissement Bénéficiaire Unique
                </label>
                <select
                  value={codeSchoolId}
                  onChange={(e) => setCodeSchoolId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city} • {t.code}) - Statut: {t.status.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 block">
                  Le code généré sera chiffré avec l'identifiant et le code de cet établissement.
                </span>
              </div>

              {/* Plan Choice Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Formule d'Abonnement à Activer
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.keys(SUBSCRIPTION_PLANS) as (keyof typeof SUBSCRIPTION_PLANS)[]).map((pKey) => {
                    const plan = SUBSCRIPTION_PLANS[pKey];
                    const isSelected = codePlanId === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setCodePlanId(pKey)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/60 ring-2 ring-amber-500/30'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-black text-slate-900 dark:text-white text-xs">{plan.name}</span>
                          {plan.discountPercent > 0 && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              -{plan.discountPercent}%
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          {plan.durationMonths} {plan.durationMonths === 1 ? 'Mois' : 'Mois'}
                        </span>
                        <span className="font-black text-xs text-amber-700 dark:text-amber-300">
                          {plan.totalAmount.toLocaleString()} FCFA
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={() => handleGenerateActivationCode()}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-101 active:scale-99"
              >
                <Key className="w-4 h-4 fill-current" />
                <span>Générer le Code d'Activation Unique</span>
              </button>
            </div>

            {/* Right Col: Voucher / Generated Code Display */}
            <div className="lg:col-span-6 flex flex-col">
              {recentlyGeneratedCode ? (
                <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl flex flex-col justify-between h-full space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Bon d'Activation Officiel
                      </span>
                      <h4 className="text-base font-black text-white mt-1.5">
                        {recentlyGeneratedCode.schoolName}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        Code École: {recentlyGeneratedCode.schoolCode}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Formule</span>
                      <span className="text-sm font-black text-amber-400">
                        {recentlyGeneratedCode.planName} ({recentlyGeneratedCode.durationMonths} Mois)
                      </span>
                    </div>
                  </div>

                  {/* Prominent Code Box */}
                  <div className="bg-black/40 border-2 border-dashed border-amber-400/60 rounded-2xl p-4 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Code d'Activation à Fournir à l'Établissement :
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-widest selection:bg-amber-400 selection:text-black">
                      {recentlyGeneratedCode.code}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Montant réglé : <strong>{recentlyGeneratedCode.amountFCFA.toLocaleString()} FCFA</strong> • Échéance calculée : <strong>{recentlyGeneratedCode.calculatedNewExpirationDate}</strong>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(recentlyGeneratedCode.code, 'rec-code')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {copiedText === 'rec-code' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Code Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copier le Code</span>
                        </>
                      )}
                    </button>

                    {(() => {
                      const targetSchool = tenants.find(t => t.id === recentlyGeneratedCode.schoolId);
                      const targetPhone = targetSchool?.contactPhone ? targetSchool.contactPhone.replace(/[^0-9]/g, '') : '242068958377';
                      const message = encodeURIComponent(
                        `*EDU-CONGO - CODE D'ACTIVATION OFFICIEL*\n\n` +
                        `Bonjour Monsieur le Directeur de *${recentlyGeneratedCode.schoolName}*,\n\n` +
                        `Votre abonnement EDU-CONGO a été validé avec succès pour la formule *${recentlyGeneratedCode.planName} (${recentlyGeneratedCode.durationMonths} Mois)*.\n\n` +
                        `🔑 *Votre Code d'Activation Unique :*\n\`${recentlyGeneratedCode.code}\`\n\n` +
                        `📅 *Nouvelle Échéance :* ${recentlyGeneratedCode.calculatedNewExpirationDate}\n` +
                        `💰 *Montant :* ${recentlyGeneratedCode.amountFCFA.toLocaleString()} FCFA\n\n` +
                        `👉 Insérez ce code dans le bouton "Mettre à niveau / Activer" de votre tableau de bord pour lever toute suspension et débloquer vos accès.`
                      );
                      const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;

                      return (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/30"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Transmettre sur WhatsApp</span>
                        </a>
                      );
                    })()}
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center h-full text-slate-400 space-y-3">
                  <Key className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  <p className="text-xs max-w-xs">
                    Sélectionnez un établissement et une formule puis cliquez sur <strong>"Générer le Code"</strong> pour éditer un coupon officiel.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* History Ledger of Generated Codes */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm">
                  Registre des Codes d'Activation Émis
                </h4>
                <span className="text-xs text-slate-400">
                  Historique cryptographique des coupons générés sur ce cluster
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {generatedCodesHistory.length} code(s) émis
              </span>
            </div>

            {generatedCodesHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                Aucun code d'activation n'a encore été généré sur cette session.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[11px] uppercase font-bold">
                      <th className="p-3">Établissement</th>
                      <th className="p-3">Formule & Durée</th>
                      <th className="p-3">Montant</th>
                      <th className="p-3">Code Unique d'Activation</th>
                      <th className="p-3">Généré le</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {generatedCodesHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                          {item.schoolName}
                          <span className="text-[10px] text-slate-400 block font-mono font-normal">
                            Code: {item.schoolCode}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.planName}</span>
                          <span className="text-[10px] text-slate-400 block">{item.durationMonths} Mois</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {item.amountFCFA.toLocaleString()} FCFA
                        </td>
                        <td className="p-3">
                          <span className="font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                            {item.code}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {item.generatedAt}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.code, `hist-${idx}`)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedText === `hist-${idx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copié</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copier</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

      {/* NEW TENANT MODAL */}
      {showNewTenantModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-6 animate-in fade-in zoom-in-95">
            
            <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-800">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">Provisionner un Établissement (Congo)</h3>
              </div>
              <button
                onClick={() => setShowNewTenantModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom de l'Établissement * :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Complexe Scolaire Saint-Michel Brazzaville"
                  value={newTenantData.name}
                  onChange={(e) => setNewTenantData({ ...newTenantData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Type d'Institution :</label>
                  <select
                    value={newTenantData.type}
                    onChange={(e) => setNewTenantData({ ...newTenantData, type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="complexe">Complexe Scolaire (Maternelle/Primaire/Collège/Lycée)</option>
                    <option value="secondaire">Lycée / Collège</option>
                    <option value="primaire">École Primaire & Maternelle</option>
                    <option value="professionnel">Centre de Formation Professionnelle</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ville (Congo) :</label>
                  <select
                    value={newTenantData.city}
                    onChange={(e) => setNewTenantData({ ...newTenantData, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="Brazzaville">Brazzaville</option>
                    <option value="Pointe-Noire">Pointe-Noire</option>
                    <option value="Dolisie">Dolisie</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Nkayi">Nkayi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Promoteur / Directeur :</label>
                  <input
                    type="text"
                    placeholder="M. Le Directeur"
                    value={newTenantData.contactName}
                    onChange={(e) => setNewTenantData({ ...newTenantData, contactName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Téléphone (+242) :</label>
                  <input
                    type="text"
                    value={newTenantData.contactPhone}
                    onChange={(e) => setNewTenantData({ ...newTenantData, contactPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Formule / Forfait :</label>
                  <select
                    value={newTenantData.plan}
                    onChange={(e) => setNewTenantData({ ...newTenantData, plan: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="Starter">Mensuel (Sans engagement)</option>
                    <option value="Pro">Trimestriel / Semestriel</option>
                    <option value="Entreprise">Annuel (Année Scolaire complète)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Effectif Élèves :</label>
                  <input
                    type="number"
                    value={newTenantData.studentCount}
                    onChange={(e) => setNewTenantData({ ...newTenantData, studentCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTenantModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Provisionner l'Établissement
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Tenant Confirmation Modal */}
      {tenantToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Supprimer Définitivement l'Établissement ?
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                Attention : Cette action est irréversible et détruira toutes les données associées.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Établissement :</span>
                <span className="font-bold text-slate-900 dark:text-white">{tenantToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Code Système :</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{tenantToDelete.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ville / Contact :</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{tenantToDelete.city} • {tenantToDelete.contactPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Effectif & Données :</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{tenantToDelete.studentCount} élèves / {tenantToDelete.teacherCount} profs</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-rose-50/50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60">
              La suppression de cet établissement effacera son compte, ses accès, son registre d'élèves, ses bulletins de notes, son historique financier et révoquera sa clé maître <strong>{tenantToDelete.masterKey}</strong>.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setTenantToDelete(null);
                  setDeleteConfirmationInput('');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDeleteTenantConfirmed}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmer la Suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
