import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set');

const useMockData = !supabaseUrl || !supabaseKey;

let supabase: SupabaseClient | null = null;

if (!useMockData) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export const initDatabase = async () => {
  if (useMockData) {
    console.log('Using mock data mode - no database connection');
    return;
  }
  
  console.log('Supabase client initialized');
  
  try {
    const { error } = await supabase!.from('clusters').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection error:', error.message);
    } else {
      console.log('Database connected successfully!');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

export const getSupabase = (): SupabaseClient | null => {
  return supabase;
};

export default supabase;
