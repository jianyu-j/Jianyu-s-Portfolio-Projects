import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client. When the env vars are absent the app runs fully offline
 * against the localStorage mock database, so `supabase` may be null.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
    ? createClient(url!, anonKey!, {
          auth: {
              persistSession: true,
              autoRefreshToken: true,
              storageKey: 'korIQ_auth',
          },
      })
    : null;

/** Throws when called in offline mode; use only behind `isSupabaseEnabled`. */
export const requireSupabase = (): SupabaseClient => {
    if (!supabase) throw new Error('Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing)');
    return supabase;
};
