export type UserRole = 'direction' | 'administration' | 'enseignant' | 'parent' | 'eleve' | 'comptabilite' | 'superadmin';

export type SchoolCycle = 'maternelle' | 'primaire' | 'college' | 'lycee' | 'formation_pro';

export interface SchoolConfig {
  schoolId: string;
  name: string;
  attribution: string; // e.g. "Complexe Scolaire", "Lycée", "Collège", "École Primaire", "Centre de Formation Professionnelle"
  devise: string; // e.g. "Discipline - Travail - Succès"
  agrementNumber: string; // e.g. "N° 0482/MEPPSA-DGE/Brazzaville"
  directorName: string;
  directorTitle: string; // "Directeur Général", "Proviseur", "Principal", "Directrice des Études"
  directorSignatureTitle: string;
  phone: string;
  email: string;
  city: string;
  department: string;
  commune: string;
  address: string;
  postalBox: string;
  anneeScolaire: string; // e.g. "2026 - 2027"
  logoUrl?: string;
  activeCycles: {
    maternelle: boolean;
    primaire: boolean;
    college: boolean;
    lycee: boolean;
    formation_pro: boolean;
  };
}

export interface ClassLevelConfig {
  id: string;
  code: string;
  name: string;
  cycle: SchoolCycle;
  niveau: string; // e.g. "Petite Section", "CP1", "6ème", "Terminale D", "Électricité 1ère Année"
  section: string; // e.g. "A", "B", "1", "2"
  capaciteMax: number;
  fraisScolariteFCFA: number;
  fraisInscriptionFCFA: number;
  salle?: string;
  professeurPrincipal?: string;
  schoolId?: string;
}

export interface StaffMember {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  roleFonction: 'Directeur Général' | 'Directeur des Études' | 'Surveillant Général' | 'Secrétaire Général(e)' | 'Économe / Comptable' | 'Informaticien / Webmestre' | 'Bibliothécaire' | 'Infirmier(ère) Scolaire' | 'Agent de Sécurité' | 'Autre Personnel Administratif';
  departement: 'Direction' | 'Secrétariat & Scolarité' | 'Vie Scolaire & Discipline' | 'Comptabilité & Caisse' | 'Santé & Médical' | 'Sécurité & Logistique';
  telephone: string;
  email: string;
  genre: 'M' | 'F';
  datePriseService: string;
  salaireMensuel: number;
  statut: 'Permanent' | 'Contractuel' | 'Vacataire';
  photoUrl?: string;
  schoolId?: string;
  pinCode?: string;
}

export interface RolePermission {
  role: UserRole;
  label: string;
  description: string;
  canManageConfig: boolean;
  canManageStudents: boolean;
  canManageStaff: boolean;
  canManageClasses: boolean;
  canInputGrades: boolean;
  canManageFees: boolean;
  canViewReports: boolean;
  canPrintOfficialDocs: boolean; // false for eleve and parent
  canManageAnnouncements: boolean;
  canDeleteRecords: boolean;
}

export interface Student {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  classe: string;
  cycle?: SchoolCycle;
  filiere?: string;
  genre: 'M' | 'F';
  dateNaissance: string;
  lieuNaissance?: string;
  nomParent: string;
  telephoneParent: string;
  emailParent: string;
  adresseParent?: string;
  photoUrl?: string;
  fraisTotal: number;
  fraisPayes: number;
  schoolId?: string;
  pinCode?: string; // 6-digit student PIN code
  parentPinCode?: string; // 4-digit parent PIN code
}

export interface Teacher {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  specialite: string;
  matieres: string[];
  telephone: string;
  email: string;
  genre?: 'M' | 'F';
  statut: 'Permanent' | 'Vacataire' | 'Temps Partiel';
  salaireMensuel: number;
  heuresEffectuees: number;
  classes: string[];
  photoUrl?: string;
  schoolId?: string;
  pinCode?: string; // 6-digit teacher/staff PIN code
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classe: string;
  date: string;
  matiere: string;
  statut: 'present' | 'absent_non_justifie' | 'retard' | 'justifie';
  heure: string;
  parentNotifie: boolean;
  schoolId?: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  classe: string;
  matiere: string;
  semestre: 'Semestre 1' | 'Semestre 2' | 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3';
  noteDevoir: number;
  noteExamen: number;
  coefficient: number;
  appreciation: string;
  schoolId?: string;
}

export interface FeePayment {
  id: string;
  numeroRecu: string;
  studentId: string;
  studentName: string;
  classe: string;
  motif: 'Écolage / Frais de Scolarité' | 'Minerval / Scolarité' | 'Frais Inscription' | 'Frais Examen (BEPC / BAC)' | 'Frais Examen' | 'Transport' | 'Cantine' | 'Uniforme';
  montant: number;
  datePaiement: string;
  modePaiement: 'Mobile Money' | 'MTN Mobile Money' | 'Airtel Money' | 'Espèces' | 'Virement Bancaire' | 'Chèque';
  referenceTransaction?: string;
  statut: 'Validé' | 'En attente' | 'Annulé';
  caissier: string;
  schoolId?: string;
}

export interface ExpenseItem {
  id: string;
  titre: string;
  categorie: 'Salaires' | 'Maintenance' | 'Fournitures' | 'Énergie & Eau' | 'Activités Pédagogiques' | 'Autre';
  montant: number;
  date: string;
  beneficiaire: string;
  statut: 'Payé' | 'En attente';
  schoolId?: string;
}

export interface Announcement {
  id: string;
  titre: string;
  type: 'Communiqué' | 'Examen' | 'Événement' | 'Urgent';
  contenu: string;
  datePublication: string;
  auteur: string;
  cible: 'Tous' | 'Parents' | 'Élèves' | 'Enseignants';
  priorite: 'normal' | 'haute';
  schoolId?: string;
}

export interface CourseSchedule {
  id: string;
  jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  heureDebut: string;
  heureFin: string;
  matiere: string;
  enseignant: string;
  classe: string;
  salle: string;
  schoolId?: string;
}

export interface SubscriptionRequest {
  id: string;
  schoolName: string;
  attribution?: string;
  subdomain?: string;
  subdomainUrl?: string;
  schoolType?: 'maternelle' | 'primaire' | 'secondaire' | 'complexe' | 'professionnel';
  institutionType?: 'maternelle' | 'primaire' | 'secondaire' | 'complexe' | 'professionnel';
  department?: string;
  city: string;
  commune?: string;
  studentCount?: number;
  planId?: 'essai_14j' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
  planTitle?: string;
  selectedPlan?: string;
  isTrial?: boolean;
  durationMonths?: number;
  durationDays?: number;
  discountPercentage?: number;
  totalAmountFCFA?: number;
  totalCostFCFA?: number;
  effectiveMonthlyRateFCFA?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactFunction?: string;
  directorName?: string;
  directorPhone?: string;
  options?: string[];
  status: 'en_attente' | 'validee' | 'rejetee';
  createdAt: string;
  confirmationLink?: string;
  approvedAt?: string;
  agrementNumber?: string;
  adminAccessCode?: string;
  tempPassword?: string;
  schoolCode?: string;
}

export interface TenantSchool {
  id: string;
  code: string;
  name: string;
  attribution?: string;
  subdomain?: string;
  subdomainUrl?: string;
  type: 'maternelle' | 'primaire' | 'secondaire' | 'complexe' | 'professionnel';
  department?: string;
  city: string;
  commune?: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactFunction?: string;
  tempPassword?: string;
  studentCount: number;
  teacherCount: number;
  plan: 'Essai 14 Jours' | 'Starter' | 'Pro' | 'Entreprise' | 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
  isTrial?: boolean;
  trialStartDate?: string;
  trialExpiresAt?: string;
  status: 'actif' | 'suspendu' | 'en_attente';
  licenseExpiresAt: string;
  activationCode?: string;
  masterKey: string;
  databaseSizeMb: number;
  momoGatewayConnected: boolean;
  monthlyFeeFCFA: number;
  createdAt: string;
}

export const SubscriptionBillingEngine = {
  baseMonthlyRateFCFA: 25000,
  tiers: {
    mensuel: { months: 1, discountPercentage: 0 },
    trimestriel: { months: 3, discountPercentage: 10 },
    semestriel: { months: 6, discountPercentage: 15 },
    annuel: { months: 12, discountPercentage: 25 }
  },
  calculateCost(planId: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'): { totalCostFCFA: number; discountFCFA: number; effectiveMonthlyRateFCFA: number } {
    const tier = this.tiers[planId];
    if (!tier) return { totalCostFCFA: 0, discountFCFA: 0, effectiveMonthlyRateFCFA: 0 };
    
    const grossCost = this.baseMonthlyRateFCFA * tier.months;
    const discountFCFA = grossCost * (tier.discountPercentage / 100);
    const totalCostFCFA = grossCost - discountFCFA;
    const effectiveMonthlyRateFCFA = totalCostFCFA / tier.months;

    return { totalCostFCFA, discountFCFA, effectiveMonthlyRateFCFA };
  }
};

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'security' | 'audit';
  source: 'API_GATEWAY' | 'AUTH_GUARD' | 'MOMO_CONGO' | 'AIRTEL_MONEY' | 'DB_ENGINE' | 'TENANT_ROUTER' | 'ADMIN_CONFIG';
  message: string;
  user: string;
  ip: string;
  details?: string;
}

export interface ApiGatewayStatus {
  id: string;
  name: string;
  provider: 'MTN Congo MoMo API' | 'Airtel Money OpenAPI' | 'Cloud Run EU-West2' | 'PostgreSQL / Firestore DB' | 'WhatsApp Business Gateway (+242)';
  endpoint: string;
  status: 'online' | 'degraded' | 'maintenance' | 'offline';
  latencyMs: number;
  uptimePercentage: number;
  todayRequests: number;
  errorRatePercentage: number;
}

export interface SystemFeatureFlag {
  id: string;
  key: string;
  label: string;
  description: string;
  category: 'Pédagogie' | 'Finance & MoMo' | 'Sécurité & Audit' | 'IA & Automatisation';
  enabled: boolean;
}

export interface AuthSession {
  isAuthenticated?: boolean;
  role: UserRole;
  schoolId: string;
  schoolName: string;
  userDisplayName: string;
  userEmail?: string;
  activeTab: string;
  loginTimestamp?: number;
  lastLogin?: string;
  viewMode?: 'flyer' | 'login' | 'app';
  isDevUnlocked?: boolean;
}


