/**
 * supabaseClient.js
 * 
 * SECURITY: API keys are read from environment variables (VITE_ prefix exposes
 * them to the Vite build, which is intentional for client-side Supabase usage).
 * The anon key is safe to expose — it is restricted by Row Level Security (RLS).
 * NEVER put service_role key here.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail loudly at startup if env vars are missing — avoids silent runtime errors
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[ScoutIndia] Missing Supabase environment variables.\n' +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);