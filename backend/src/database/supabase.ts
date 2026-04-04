import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set');

const notConfigured = !supabaseUrl || !supabaseKey;

let supabase: SupabaseClient | null = null;
let connectionFailed = false;

if (!notConfigured) {
  try {
    supabase = createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        fetch: (url, options) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          return fetch(url, { ...options, signal: controller.signal })
            .finally(() => clearTimeout(timeoutId));
        }
      }
    });
    console.log('Supabase client created');
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    connectionFailed = true;
  }
}

export const initDatabase = async () => {
  if (notConfigured || !supabase) {
    console.log('Database not configured, using mock data');
    return;
  }
  
  console.log('Testing database connection (30s timeout)...');
  
  try {
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 30000);
    });
    
    const queryPromise = supabase.from('clusters').select('*', { count: 'exact', head: true });
    
    const result = await Promise.race([queryPromise, timeoutPromise.then(() => null)]);
    
    if (result === null) {
      console.error('Database connection timeout');
      connectionFailed = true;
      return;
    }
    
    const { error, count } = result;
    
    if (error) {
      console.error('Database connection error:', error.message);
      connectionFailed = true;
    } else {
      console.log(`Database connected successfully! Clusters count: ${count}`);
    }
  } catch (err: any) {
    console.error('Database initialization error:', err?.message || err);
    connectionFailed = true;
  }
};

export const getSupabase = (): SupabaseClient | null => {
  return supabase;
};

export const isDatabaseConnected = (): boolean => {
  return !notConfigured && !!supabase && !connectionFailed;
};

export const resetConnection = () => {
  connectionFailed = false;
};

export const testConnection = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    const { error } = await supabase.from('clusters').select('count', { count: 'exact', head: true });
    if (error) {
      connectionFailed = true;
      return false;
    }
    connectionFailed = false;
    return true;
  } catch (err) {
    connectionFailed = true;
    return false;
  }
};

export default supabase;
