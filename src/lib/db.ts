import Dexie, { Table } from 'dexie';
import { 
  SchoolConfig, ClassLevelConfig, StaffMember, Teacher, Student, 
  AttendanceRecord, GradeEntry, FeePayment, ExpenseItem, 
  Announcement, CourseSchedule, TenantSchool, SubscriptionRequest, RolePermission 
} from '../types';

export interface SyncableRecord {
  id?: string;
  client_generated_id?: string;
  school_id?: string;
  sync_status?: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
  updated_at?: string;
}

export type DbSchool = SchoolConfig & SyncableRecord;
export type DbClassLevel = ClassLevelConfig & SyncableRecord;
export type DbStaffMember = StaffMember & SyncableRecord;
export type DbTeacher = Teacher & SyncableRecord;
export type DbStudent = Student & SyncableRecord;
export type DbAttendance = AttendanceRecord & SyncableRecord;
export type DbGrade = GradeEntry & SyncableRecord;
export type DbPayment = FeePayment & SyncableRecord;
export type DbExpense = ExpenseItem & SyncableRecord;
export type DbAnnouncement = Announcement & SyncableRecord;
export type DbCourseSchedule = CourseSchedule & SyncableRecord;
export type DbTenantSchool = TenantSchool & SyncableRecord;
export type DbSubscriptionRequest = SubscriptionRequest & SyncableRecord;
export type DbRolePermission = RolePermission & SyncableRecord;

export class AppDatabase extends Dexie {
  schools!: Table<DbSchool>;
  class_levels!: Table<DbClassLevel>;
  staff_members!: Table<DbStaffMember>;
  teachers!: Table<DbTeacher>;
  students!: Table<DbStudent>;
  attendance_records!: Table<DbAttendance>;
  grade_entries!: Table<DbGrade>;
  fee_payments!: Table<DbPayment>;
  expense_items!: Table<DbExpense>;
  announcements!: Table<DbAnnouncement>;
  course_schedules!: Table<DbCourseSchedule>;
  tenant_schools!: Table<DbTenantSchool>;
  subscription_requests!: Table<DbSubscriptionRequest>;
  role_permissions!: Table<DbRolePermission>;

  constructor() {
    super('SchoolManagementDB');
    this.version(1).stores({
      schools: 'id, client_generated_id, sync_status',
      class_levels: 'id, client_generated_id, school_id, sync_status',
      staff_members: 'id, client_generated_id, school_id, sync_status',
      teachers: 'id, client_generated_id, school_id, sync_status',
      students: 'id, client_generated_id, school_id, sync_status',
      attendance_records: 'id, client_generated_id, school_id, sync_status',
      grade_entries: 'id, client_generated_id, school_id, sync_status',
      fee_payments: 'id, client_generated_id, school_id, sync_status',
      expense_items: 'id, client_generated_id, school_id, sync_status',
      announcements: 'id, client_generated_id, school_id, sync_status',
      course_schedules: 'id, client_generated_id, school_id, sync_status',
      tenant_schools: 'id, client_generated_id, sync_status',
      subscription_requests: 'id, client_generated_id, sync_status',
      role_permissions: 'id, client_generated_id, school_id, sync_status'
    });
  }
}

export const db = new AppDatabase();
