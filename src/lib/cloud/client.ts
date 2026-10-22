import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_URL, cloudConfigured } from './config';

let client: SupabaseClient | null = null;

/** Supabase-Client (nur wenn das Projekt eingerichtet ist) */
export function cloud(): SupabaseClient | null {
  if (!cloudConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'orbitus.auth' },
    });
    client.auth.getSession().then(({ data }) => setSession(data.session));
    client.auth.onAuthStateChange((_event, s) => setSession(s));
  }
  return client;
}

// ---------------------------------------------------------------- Sitzung als kleiner Store

let session: Session | null = null;
let ready = !cloudConfigured();
const listeners = new Set<() => void>();
function setSession(s: Session | null) {
  session = s;
  ready = true;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  cloud();
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useSession() {
  const s = useSyncExternalStore(subscribe, () => session);
  const r = useSyncExternalStore(subscribe, () => ready);
  return { session: s, ready: r, user: s?.user ?? null };
}

export const currentUser = () => session?.user ?? null;

// ---------------------------------------------------------------- Anmeldung per E-Mail-Code

export async function sendCode(email: string) {
  const c = cloud();
  if (!c) throw new Error('not-configured');
  const { error } = await c.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifyCode(email: string, token: string) {
  const c = cloud();
  if (!c) throw new Error('not-configured');
  const { error } = await c.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw error;
}

export async function signOut() {
  await cloud()?.auth.signOut();
}
