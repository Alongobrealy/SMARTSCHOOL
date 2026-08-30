import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

export const formatPseudoEmail = (role: UserRole, identifier: string, schoolCode: string = 'default') => {
  if (identifier.includes('@')) return identifier.toLowerCase();
  return `${role}_${identifier.toLowerCase().replace(/\s+/g, '')}@${schoolCode}.educongo.app`;
};

// Admin creating a user account for a student/teacher
export const provisionUserAuth = async (role: UserRole, identifier: string, pinCode: string, schoolId: string, schoolCode: string = 'default') => {
  const email = formatPseudoEmail(role, identifier, schoolCode);
  
  // Note: in a pure client environment with anon key, signUp will log out the current user
  // unless we use the Admin API. Since we are client-side, we should use a Postgres RPC or Edge function
  // BUT without that, a workaround for PINs is to let the student "sign up" on first login 
  // if we don't have admin privileges. 
  // However, it's better to provide a clear error message that the account needs to be provisioned.
  return { email, password: pinCode };
};
