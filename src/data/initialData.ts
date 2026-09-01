import { 
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
  RolePermission
} from '../types';

export const DEFAULT_SCHOOL_CONFIG: SchoolConfig = {
  schoolId: 'ten-default',
  name: 'Complexe Scolaire La Renaissance',
  attribution: 'Complexe Scolaire',
  devise: 'Discipline - Travail - Succès',
  agrementNumber: 'Arrêté Ministériel N° 0482/MEPPSA-DGE',
  directorName: 'M. Stéphane Alongo',
  directorTitle: 'Directeur Général',
  directorSignatureTitle: 'Le Chef d\'Établissement',
  phone: '+242 06 895 83 77',
  email: 'contact@renaissance-congo.cg',
  city: 'Brazzaville',
  department: 'Brazzaville',
  commune: 'Plateau des 15 Ans',
  address: 'Avenue de la Paix, Immeuble Scolaire',
  postalBox: 'B.P. 1428 Brazzaville',
  anneeScolaire: '2026 - 2027',
  subjects: ['Mathématiques', 'Sciences Physiques', 'Français', 'Histoire-Géographie', 'SVT', 'Philosophie', 'Anglais', 'Éducation Physique', 'Informatique'],
  activeCycles: {
    maternelle: true,
    primaire: true,
    college: true,
    lycee: true,
    formation_pro: false,
  },
};

export const DEFAULT_ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'direction',
    label: 'Direction Générale et Administration',
    description: 'Accès total à l\'établissement : configuration, gestion financière, validation des bulletins, audit et signatures.',
    canManageConfig: true,
    canManageStudents: true,
    canManageStaff: true,
    canManageClasses: true,
    canInputGrades: true,
    canManageFees: true,
    canViewReports: true,
    canPrintOfficialDocs: true,
    canManageAnnouncements: true,
    canDeleteRecords: true,
  },
  {
    role: 'administration',
    label: 'Secrétariat et Scolarité',
    description: 'Inscriptions des élèves, registres, délivrance de cartes scolaires et certificats officiels.',
    canManageConfig: false,
    canManageStudents: true,
    canManageStaff: true,
    canManageClasses: true,
    canInputGrades: true,
    canManageFees: false,
    canViewReports: true,
    canPrintOfficialDocs: true,
    canManageAnnouncements: true,
    canDeleteRecords: false,
  },
  {
    role: 'comptabilite',
    label: 'Comptabilité et Caisse',
    description: 'Encaissement des frais scolaires, gestion des dépenses, salaires, reçus de paiement et bilans.',
    canManageConfig: false,
    canManageStudents: false,
    canManageStaff: false,
    canManageClasses: false,
    canInputGrades: false,
    canManageFees: true,
    canViewReports: true,
    canPrintOfficialDocs: true,
    canManageAnnouncements: false,
    canDeleteRecords: false,
  },
  {
    role: 'enseignant',
    label: 'Corps Professoral',
    description: 'Saisie des notes d\'évaluation, appel numérique en classe et cahier de texte.',
    canManageConfig: false,
    canManageStudents: false,
    canManageStaff: false,
    canManageClasses: false,
    canInputGrades: true,
    canManageFees: false,
    canViewReports: true,
    canPrintOfficialDocs: false,
    canManageAnnouncements: false,
    canDeleteRecords: false,
  },
  {
    role: 'parent',
    label: 'Parents d\'Élèves',
    description: 'Consultation sécurisée en lecture seule des notes, présences et situation des frais scolaires.',
    canManageConfig: false,
    canManageStudents: false,
    canManageStaff: false,
    canManageClasses: false,
    canInputGrades: false,
    canManageFees: false,
    canViewReports: true,
    canPrintOfficialDocs: false, // Strictly false: cannot print
    canManageAnnouncements: false,
    canDeleteRecords: false,
  },
  {
    role: 'eleve',
    label: 'Élèves',
    description: 'Consultation personnelle en lecture seule des cours, devoirs et relevés de notes.',
    canManageConfig: false,
    canManageStudents: false,
    canManageStaff: false,
    canManageClasses: false,
    canInputGrades: false,
    canManageFees: false,
    canViewReports: true,
    canPrintOfficialDocs: false, // Strictly false: cannot print
    canManageAnnouncements: false,
    canDeleteRecords: false,
  },
  {
    role: 'superadmin',
    label: 'Super Admin Développeur',
    description: 'Accès console système, multi-tenant et maintenance globale de la plateforme.',
    canManageConfig: true,
    canManageStudents: true,
    canManageStaff: true,
    canManageClasses: true,
    canInputGrades: true,
    canManageFees: true,
    canViewReports: true,
    canPrintOfficialDocs: true,
    canManageAnnouncements: true,
    canDeleteRecords: true,
  },
];

export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_TEACHERS: Teacher[] = [];
export const INITIAL_STAFF: StaffMember[] = [];
export const INITIAL_CLASSES_CONFIG: ClassLevelConfig[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_GRADES: GradeEntry[] = [];
export const INITIAL_PAYMENTS: FeePayment[] = [];
export const INITIAL_EXPENSES: ExpenseItem[] = [];
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
export const INITIAL_SCHEDULES: CourseSchedule[] = [];
export const INITIAL_TENANTS: TenantSchool[] = [];
export const INITIAL_SYSTEM_LOGS: SystemLogEntry[] = [];

export const INITIAL_API_GATEWAYS: ApiGatewayStatus[] = [
  {
    id: 'gw-1',
    name: 'MTN Mobile Money Congo Gateway',
    provider: 'MTN Congo MoMo API',
    endpoint: 'https://momoapi.mtn.cg/collection/v2_0',
    status: 'online',
    latencyMs: 142,
    uptimePercentage: 99.96,
    todayRequests: 0,
    errorRatePercentage: 0.0
  },
  {
    id: 'gw-2',
    name: 'Airtel Money Congo OpenAPI',
    provider: 'Airtel Money OpenAPI',
    endpoint: 'https://openapi.airtel.cg/merchant/v1/payments',
    status: 'online',
    latencyMs: 185,
    uptimePercentage: 99.89,
    todayRequests: 0,
    errorRatePercentage: 0.0
  },
  {
    id: 'gw-3',
    name: 'WhatsApp Cloud Business Gateway (+242)',
    provider: 'WhatsApp Business Gateway (+242)',
    endpoint: 'https://graph.facebook.com/v19.0/edu-congo-hub/messages',
    status: 'online',
    latencyMs: 95,
    uptimePercentage: 99.99,
    todayRequests: 0,
    errorRatePercentage: 0.0
  },
  {
    id: 'gw-4',
    name: 'Cloud Run Compute Cluster (europe-west2)',
    provider: 'Cloud Run EU-West2',
    endpoint: 'https://ais-dev-27bch3y3x4rstnqlwsjbxe-677987865776.europe-west2.run.app',
    status: 'online',
    latencyMs: 48,
    uptimePercentage: 100.0,
    todayRequests: 0,
    errorRatePercentage: 0.0
  },
  {
    id: 'gw-5',
    name: 'Cloud Firestore & Relational Engine',
    provider: 'PostgreSQL / Firestore DB',
    endpoint: 'europe-west2-firestore.googleapis.com',
    status: 'online',
    latencyMs: 32,
    uptimePercentage: 99.99,
    todayRequests: 0,
    errorRatePercentage: 0.0
  }
];

export const INITIAL_FEATURE_FLAGS: SystemFeatureFlag[] = [
  {
    id: 'ff-1',
    key: 'ENABLE_MOMO_AUTO_VALIDATION',
    label: 'Validation Automatique MTN MoMo & Airtel Money',
    description: 'Crédite et génère automatiquement le reçu d\'écolage officiel dès réception du webhook télécom',
    category: 'Finance & MoMo',
    enabled: true
  },
  {
    id: 'ff-2',
    key: 'ENABLE_WHATSAPP_AUTO_DISPATCH',
    label: 'Notification WhatsApp Temps Réel (+242)',
    description: 'Envoi instantané de SMS/WhatsApp aux parents lors d\'une absence ou d\'un retard enregistré',
    category: 'Pédagogie',
    enabled: true
  },
  {
    id: 'ff-3',
    key: 'ENABLE_BULLETIN_QR_SEAL',
    label: 'Sceau Numérique & QR Code Anti-Fraude sur Bulletins',
    description: 'Ajoute la signature cryptographique et le QR code de vérification MEPPSA sur chaque bulletin scolaire',
    category: 'Sécurité & Audit',
    enabled: true
  },
  {
    id: 'ff-4',
    key: 'ENABLE_AI_PEDAGOGICAL_ASSISTANT',
    label: 'Assistant IA d\'Appréciation & Analyse des Moyennes',
    description: 'Aide les enseignants à rédiger des appréciations constructives basées sur l\'évolution trimestrielle',
    category: 'IA & Automatisation',
    enabled: true
  },
  {
    id: 'ff-5',
    key: 'ENABLE_MAINTENANCE_BANNER',
    label: 'Bannière de Maintenance Globale',
    description: 'Affiche un message d\'avertissement pour les opérations réseau programmées',
    category: 'Sécurité & Audit',
    enabled: false
  },
  {
    id: 'ff-6',
    key: 'ENABLE_MULTI_CAMPUS_ROUTING',
    label: 'Routage Multi-Campus & Multi-Sites Congo',
    description: 'Gestion centralisée des succursales pour les établissements à plusieurs sites (ex: Brazzaville & Pointe-Noire)',
    category: 'Pédagogie',
    enabled: true
  }
];
