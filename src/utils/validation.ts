import { Student, Teacher, TenantSchool } from '../types';

/**
 * Normalizes phone numbers for Congo (+242)
 */
export function normalizePhone(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('242') && digits.length === 12) {
    // 242068958377 -> +242 06 895 83 77
    return `+242 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }
  if (digits.length === 9 && (digits.startsWith('06') || digits.startsWith('05') || digits.startsWith('04'))) {
    // 068958377 -> +242 06 895 83 77
    return `+242 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  return raw.trim();
}

/**
 * Extracts pure digits from phone for comparisons
 */
export function extractPhoneDigits(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('242')) {
    return digits.slice(3);
  }
  return digits;
}

/**
 * Validates subdomain format (lowercase letters, numbers, hyphens)
 */
export function isValidSubdomain(subdomain: string): boolean {
  if (!subdomain) return false;
  return /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(subdomain);
}

/**
 * Generates clean subdomain slug from school name
 */
export function generateSubdomainSlug(schoolName: string): string {
  return schoolName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 25);
}

/**
 * Generates unique establishment code for Congo
 */
export function generateSchoolCode(deptCode: string = 'BZV'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EC-${deptCode.toUpperCase()}-${year}-${randomNum}`;
}

/**
 * Generates secure temporary password
 */
export function generateTemporaryPassword(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return randomDigits.toString();
}

/**
 * Result of duplicate check
 */
export interface DuplicateCheckResult {
  isDuplicate: boolean;
  field?: 'email' | 'phone';
  message?: string;
  matchedEntity?: string;
}

/**
 * Checks for duplicate emails across database (Schools, Students, Parents, Teachers)
 */
export function checkDuplicateEmail(
  email: string,
  context: {
    schools?: TenantSchool[];
    students?: Student[];
    teachers?: Teacher[];
    excludeId?: string;
  }
): DuplicateCheckResult {
  if (!email || !email.trim()) return { isDuplicate: false };
  const clean = email.trim().toLowerCase();

  // 1. Check schools
  if (context.schools) {
    const foundSchool = context.schools.find(
      (s) => s.contactEmail?.toLowerCase() === clean && s.id !== context.excludeId
    );
    if (foundSchool) {
      return {
        isDuplicate: true,
        field: 'email',
        message: `L'adresse e-mail "${email}" est déjà enregistrée pour l'établissement "${foundSchool.name}". Les doublons d'e-mail sont strictement refusés.`,
        matchedEntity: `Établissement: ${foundSchool.name}`
      };
    }
  }

  // 2. Check teachers
  if (context.teachers) {
    const foundTeacher = context.teachers.find(
      (t) => t.email?.toLowerCase() === clean && t.id !== context.excludeId
    );
    if (foundTeacher) {
      return {
        isDuplicate: true,
        field: 'email',
        message: `L'adresse e-mail "${email}" est déjà assignée à l'enseignant "${foundTeacher.prenom} ${foundTeacher.nom}" (${foundTeacher.matricule}).`,
        matchedEntity: `Enseignant: ${foundTeacher.nom}`
      };
    }
  }

  // 3. Check student parent emails
  if (context.students) {
    const foundParent = context.students.find(
      (s) => s.emailParent?.toLowerCase() === clean && s.id !== context.excludeId
    );
    if (foundParent) {
      return {
        isDuplicate: true,
        field: 'email',
        message: `L'adresse e-mail "${email}" est déjà associée au tuteur de l'élève "${foundParent.prenom} ${foundParent.nom}" (${foundParent.matricule}).`,
        matchedEntity: `Tuteur de: ${foundParent.nom}`
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Checks for duplicate phone numbers across database (Schools, Students, Parents, Teachers)
 */
export function checkDuplicatePhone(
  phone: string,
  context: {
    schools?: TenantSchool[];
    students?: Student[];
    teachers?: Teacher[];
    excludeId?: string;
  }
): DuplicateCheckResult {
  if (!phone || !phone.trim()) return { isDuplicate: false };
  const targetDigits = extractPhoneDigits(phone);
  if (targetDigits.length < 8) return { isDuplicate: false };

  // 1. Check schools
  if (context.schools) {
    const foundSchool = context.schools.find((s) => {
      if (s.id === context.excludeId) return false;
      return extractPhoneDigits(s.contactPhone || '') === targetDigits;
    });
    if (foundSchool) {
      return {
        isDuplicate: true,
        field: 'phone',
        message: `Le numéro de téléphone "${phone}" est déjà utilisé par l'établissement "${foundSchool.name}". Les doublons de numéro sont strictement refusés.`,
        matchedEntity: `Établissement: ${foundSchool.name}`
      };
    }
  }

  // 2. Check teachers
  if (context.teachers) {
    const foundTeacher = context.teachers.find((t) => {
      if (t.id === context.excludeId) return false;
      return extractPhoneDigits(t.telephone || '') === targetDigits;
    });
    if (foundTeacher) {
      return {
        isDuplicate: true,
        field: 'phone',
        message: `Le numéro de téléphone "${phone}" est déjà enregistré pour l'enseignant "${foundTeacher.prenom} ${foundTeacher.nom}".`,
        matchedEntity: `Enseignant: ${foundTeacher.nom}`
      };
    }
  }

  // 3. Check student parents
  if (context.students) {
    const foundStudent = context.students.find((s) => {
      if (s.id === context.excludeId) return false;
      return extractPhoneDigits(s.telephoneParent || '') === targetDigits;
    });
    if (foundStudent) {
      return {
        isDuplicate: true,
        field: 'phone',
        message: `Le numéro de téléphone "${phone}" est déjà associé au parent "${foundStudent.nomParent}" (Élève: ${foundStudent.prenom} ${foundStudent.nom}).`,
        matchedEntity: `Parent de: ${foundStudent.nom}`
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Validates PIN codes strictly:
 * - Student (Élève): 6 digits
 * - Parent: 4 digits
 * - Teacher / Staff (Enseignant / Personnel): 6 digits
 */
export function validatePinCode(role: 'eleve' | 'parent' | 'enseignant' | 'administration', pin: string): {
  isValid: boolean;
  requiredLength: number;
  message?: string;
} {
  const requiredLength = role === 'parent' ? 4 : 6;
  const cleanPin = pin.trim();

  if (!/^\d+$/.test(cleanPin)) {
    return {
      isValid: false,
      requiredLength,
      message: `Le code PIN doit comporter uniquement des chiffres (0-9).`
    };
  }

  if (cleanPin.length !== requiredLength) {
    return {
      isValid: false,
      requiredLength,
      message: `Le code PIN pour le profil "${role === 'parent' ? 'Parent / Tuteur' : role === 'eleve' ? 'Élève' : 'Enseignant / Personnel'}" doit comporter exactement ${requiredLength} chiffres.`
    };
  }

  return { isValid: true, requiredLength };
}
