import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'your-supabase-anon-key'
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
