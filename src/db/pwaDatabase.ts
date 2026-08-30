import Dexie, { Table } from 'dexie';
import { 
  Student, 
  Teacher,
  StaffMember,
  ClassLevelConfig, 
  FeePayment, 
  ExpenseItem, 
  GradeEntry, 
  AttendanceRecord, 
  CourseSchedule, 
  Announcement, 
  SchoolConfig 
} from '../types';

export interface OfflineSyncQueueItem {
  id?: number;
  actionId: string;
  actionType: 
    | 'CREATE_STUDENT'
    | 'UPDATE_STUDENT'
    | 'DELETE_STUDENT'
    | 'ADD_PAYMENT'
    | 'MOMO_PAYMENT_INIT'
    | 'ADD_GRADE'
    | 'MARK_ATTENDANCE'
    | 'ADD_EXPENSE'
    | 'UPDATE_SCHOOL_CONFIG'
    | 'ADD_CLASS'
    | 'UPDATE_CLASS';
  payload: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';
  retries: number;
  idempotencyKey: string;
  description: string;
  error?: string;
  serverSyncedAt?: number;
}

export interface OfflineAuditLog {
  id?: number;
  timestamp: number;
  action: string;
  details: string;
  user?: string;
  offline: boolean;
}

export class EduCongoOfflineDatabase extends Dexie {
  students!: Table<Student, string>;
  teachers!: Table<Teacher, string>;
  staff!: Table<StaffMember, string>;
  classes!: Table<ClassLevelConfig, string>;
  payments!: Table<FeePayment, string>;
  expenses!: Table<ExpenseItem, string>;
  grades!: Table<GradeEntry, string>;
  attendance!: Table<AttendanceRecord, string>;
  schedules!: Table<CourseSchedule, string>;
  announcements!: Table<Announcement, string>;
  schoolConfigs!: Table<SchoolConfig & { id: string }, string>;
  syncQueue!: Table<OfflineSyncQueueItem, number>;
  auditLogs!: Table<OfflineAuditLog, number>;

  constructor() {
    super('EduCongoOfflineDB');

    this.version(1).stores({
      students: 'id, matricule, nom, prenom, classe, statut, schoolId, updatedAt',
      teachers: 'id, matricule, nom, telephone, schoolId',
      staff: 'id, matricule, nom, roleFonction, schoolId',
      classes: 'id, code, name, cycle, niveau, schoolId',
      payments: 'id, numeroRecu, studentId, studentName, classe, datePaiement, modePaiement, statut, referenceTransaction, schoolId',
      expenses: 'id, titre, categorie, date, statut, schoolId',
      grades: 'id, studentId, studentName, classe, matiere, semestre, schoolId',
      attendance: 'id, studentId, studentName, classe, date, matiere, statut, schoolId',
      schedules: 'id, jour, matiere, classe, enseignant, schoolId',
      announcements: 'id, titre, type, datePublication, cible, schoolId',
      schoolConfigs: 'id, schoolId, name, anneeScolaire',
      syncQueue: '++id, actionId, actionType, timestamp, status, idempotencyKey',
      auditLogs: '++id, timestamp, action, offline'
    });
  }
}

export const db = new EduCongoOfflineDatabase();

/**
 * Initializes IndexedDB with default/initial datasets if tables are empty.
 */
export async function seedOfflineDatabase(data: {
  students: Student[];
  teachers: Teacher[];
  staff: StaffMember[];
  classes: ClassLevelConfig[];
  payments: FeePayment[];
  expenses: ExpenseItem[];
  grades: GradeEntry[];
  attendance: AttendanceRecord[];
  schedules: CourseSchedule[];
  announcements: Announcement[];
  schoolConfig: SchoolConfig;
}) {
  try {
    const studentCount = await db.students.count();
    if (studentCount === 0 && data.students && data.students.length > 0) {
      console.log('[IndexedDB] Seeding initial offline data...');
      await db.transaction('rw', [
        db.students,
        db.teachers,
        db.staff,
        db.classes,
        db.payments,
        db.expenses,
        db.grades,
        db.attendance,
        db.schedules,
        db.announcements,
        db.schoolConfigs,
        db.auditLogs
      ], async () => {
        if (data.students.length) await db.students.bulkPut(data.students);
        if (data.teachers.length) await db.teachers.bulkPut(data.teachers);
        if (data.staff.length) await db.staff.bulkPut(data.staff);
        if (data.classes.length) await db.classes.bulkPut(data.classes);
        if (data.payments.length) await db.payments.bulkPut(data.payments);
        if (data.expenses.length) await db.expenses.bulkPut(data.expenses);
        if (data.grades.length) await db.grades.bulkPut(data.grades);
        if (data.attendance.length) await db.attendance.bulkPut(data.attendance);
        if (data.schedules.length) await db.schedules.bulkPut(data.schedules);
        if (data.announcements.length) await db.announcements.bulkPut(data.announcements);
        if (data.schoolConfig) {
          await db.schoolConfigs.put({
            id: data.schoolConfig.schoolId || 'default',
            ...data.schoolConfig
          });
        }
        await db.auditLogs.add({
          timestamp: Date.now(),
          action: 'INIT_INDEXED_DB',
          details: 'Base locale IndexedDB initialisée avec succès pour le mode hors-ligne.',
          offline: !navigator.onLine
        });
      });
      console.log('[IndexedDB] Seeding completed.');
    }
  } catch (err) {
    console.warn('[IndexedDB] Seeding error (non-fatal):', err);
  }
}

/**
 * Returns database metrics for the PWA dashboard
 */
export async function getOfflineStorageMetrics() {
  try {
    const [
      studentsCount,
      classesCount,
      paymentsCount,
      gradesCount,
      attendanceCount,
      pendingSyncCount,
      syncedCount
    ] = await Promise.all([
      db.students.count(),
      db.classes.count(),
      db.payments.count(),
      db.grades.count(),
      db.attendance.count(),
      db.syncQueue.where('status').equals('pending').count(),
      db.syncQueue.where('status').equals('synced').count()
    ]);

    let estimatedBytes = 0;
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      estimatedBytes = estimate.usage || 0;
    }

    return {
      studentsCount,
      classesCount,
      paymentsCount,
      gradesCount,
      attendanceCount,
      pendingSyncCount,
      syncedCount,
      estimatedBytes,
      isIndexedDbSupported: true
    };
  } catch (e) {
    return {
      studentsCount: 0,
      classesCount: 0,
      paymentsCount: 0,
      gradesCount: 0,
      attendanceCount: 0,
      pendingSyncCount: 0,
      syncedCount: 0,
      estimatedBytes: 0,
      isIndexedDbSupported: false
    };
  }
}
