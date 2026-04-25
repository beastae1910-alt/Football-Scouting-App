import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError = !SUPABASE_URL || !SUPABASE_ANON_KEY
  ? '[ScoutIndia] Missing Supabase environment variables. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  : null;

export const supabase = supabaseConfigError
  ? null
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
