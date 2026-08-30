import { useState, useCallback } from 'react';
import { useSupabaseSync } from './useSupabaseSync';
import { db } from '../db/pwaDatabase';
import { Student, Teacher, StaffMember, FeePayment, GradeEntry, AttendanceRecord, ExpenseItem, ClassLevelConfig, SchoolConfig, Announcement, CourseSchedule } from '../types';
import { syncEngine } from '../services/syncEngine';

export function useAppData(schoolId: string) {
  // Use dexie+supabase for all tables
  const students = useSupabaseSync<Student>('students', db.students, schoolId);
  const teachers = useSupabaseSync<Teacher>('teachers', db.teachers, schoolId);
  const staff = useSupabaseSync<StaffMember>('staff_members', db.staff, schoolId);
  const payments = useSupabaseSync<FeePayment>('fee_payments', db.payments, schoolId);
  const grades = useSupabaseSync<GradeEntry>('grade_entries', db.grades, schoolId);
  const attendanceList = useSupabaseSync<AttendanceRecord>('attendance_records', db.attendance, schoolId);
  const expenses = useSupabaseSync<ExpenseItem>('expense_items', db.expenses, schoolId);
  const classesConfig = useSupabaseSync<ClassLevelConfig>('class_levels', db.classes, schoolId);
  const announcements = useSupabaseSync<Announcement>('announcements', db.announcements, schoolId);
  const schedules = useSupabaseSync<CourseSchedule>('course_schedules', db.schedules, schoolId);

  // For setX replacements to keep UI from crashing if they call it directly (if any)
  // Our new architecture relies entirely on `syncEngine.queueAction` and Dexie updating, 
  // which will trigger `useLiveQuery` in `useSupabaseSync` automatically! 
  // Wait, in `App.tsx`, we saw: 
  // setStudents(prev => [newStudent, ...prev]);
  // syncEngine.queueAction(...)
  
  // Since `setStudents` is called inside `App.tsx` handlers, we can just remove the `setStudents` calls!
  // The Dexie wrapper in `syncEngine.queueAction` already does: `await db.students.put(...)`. 
  // Since `useLiveQuery` listens to `db.students`, it will automatically re-render `App.tsx`!
  // So we don't even need `setStudents` anymore.

  return {
    students,
    teachers,
    staff,
    payments,
    grades,
    attendanceList,
    expenses,
    classesConfig,
    announcements,
    schedules
  };
}
