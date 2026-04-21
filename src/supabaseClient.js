import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fjdifnyyfptseezmcfua.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGlmbnl5ZnB0c2Vlem1jZnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTkwNzQsImV4cCI6MjA5MjI3NTA3NH0.N3vuGaP9Hex4az-IIvJTLwfGWpm_ASCbng6gBW_6jsI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);