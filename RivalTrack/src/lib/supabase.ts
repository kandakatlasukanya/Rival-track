import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase anon keys can be:
//   - Legacy JWT format: starts with "eyJ"
//   - New publishable key format: starts with "sb_publishable_" or "sb_"
// Both are valid for the JS client.
const isValidKeyFormat =
  supabaseAnonKey.startsWith('eyJ') ||
  supabaseAnonKey.startsWith('sb_');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  isValidKeyFormat &&
  !supabaseAnonKey.includes('PASTE_YOUR')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Test Connection to Supabase Project
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return {
      success: false,
      message: supabaseAnonKey
        ? `Supabase key format not recognised ("${supabaseAnonKey.substring(0, 16)}…"). Expected eyJ... or sb_...`
        : 'Supabase key missing in .env file (VITE_SUPABASE_ANON_KEY)'
    };
  }

  try {
    const { data, error } = await supabase
      .from('price_observations')
      .select('id, company_name, price, observed_at')
      .order('observed_at', { ascending: false })
      .limit(5);

    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase! Table "price_observations" not found — run schema.sql in Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Supabase Connection Error: ${error.message} (Code: ${error.code})`
      };
    }

    const rowCount = data?.length ?? 0;
    const latest = data?.[0];
    return {
      success: true,
      message: `Connected ✓ — ${rowCount} recent observation(s) found.${latest ? ` Latest: ${latest.company_name} ₹${latest.price} at ${latest.observed_at}` : ''}`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err?.message || 'Unknown network error'}`
    };
  }
}
