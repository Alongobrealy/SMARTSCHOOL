import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey);

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('VITE_SUPABASE_URL is missing. Please configure your Supabase credentials.');
}
