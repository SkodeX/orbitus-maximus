// Web-Push: Abo im Browser anlegen und mit Ort und Wunsch-Themen in Supabase speichern.
// Verschickt werden die Meldungen von der Edge Function „push-alerts“.
import type { Place } from '../astro';
import type { Lang } from '../../state/settings';
import { cloud, currentUser } from './client';
import { VAPID_PUBLIC_KEY } from './config';

export type PushTopic = 'iss' | 'aurora' | 'clear' | 'meteors';
export type PushPrefs = Record<PushTopic, boolean>;
export const DEFAULT_PREFS: PushPrefs = { iss: true, aurora: true, clear: true, meteors: true };

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
export const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** 'ok' | 'needs-install' (iPhone: erst zum Home-Bildschirm hinzufügen) | 'unsupported' */
export function pushSupport(): 'ok' | 'needs-install' | 'unsupported' {
  if (!('serviceWorker' in navigator)) return 'unsupported';
  if (isIos() && !isStandalone()) return 'needs-install';
  if (!('PushManager' in window) || !('Notification' in window)) return 'unsupported';
  return 'ok';
}

function keyBytes(base64url: string) {
  const pad = '='.repeat((4 - (base64url.length % 4)) % 4);
  const raw = atob((base64url + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export async function currentSubscription() {
  if (pushSupport() !== 'ok') return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

/** Benachrichtigungen erlauben, Abo anlegen und auf dem Server speichern */
export async function enablePush(place: Place, lang: Lang, prefs: PushPrefs) {
  const client = cloud();
  const user = currentUser();
  if (!client || !user) throw new Error('not-signed-in');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('denied');
  const reg = await navigator.serviceWorker.ready;
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID_PUBLIC_KEY) }));
  await saveSubscription(sub, place, lang, prefs);
  return sub;
}

export async function saveSubscription(sub: PushSubscription, place: Place, lang: Lang, prefs: PushPrefs) {
  const client = cloud();
  const user = currentUser();
  if (!client || !user) return;
  const json = sub.toJSON();
  const { error } = await client.from('push_subscriptions').upsert({
    endpoint: sub.endpoint,
    user_id: user.id,
    p256dh: json.keys?.p256dh,
    auth: json.keys?.auth,
    lat: place.lat,
    lon: place.lon,
    tz: place.tz,
    place_name: place.name,
    lang,
    prefs,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function loadPrefs(): Promise<PushPrefs | null> {
  const client = cloud();
  const sub = await currentSubscription();
  if (!client || !sub) return null;
  const { data } = await client.from('push_subscriptions').select('prefs').eq('endpoint', sub.endpoint).maybeSingle();
  return data ? { ...DEFAULT_PREFS, ...(data.prefs as Partial<PushPrefs>) } : null;
}

export async function disablePush() {
  const client = cloud();
  const sub = await currentSubscription();
  if (!sub) return;
  await client?.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
  await sub.unsubscribe();
}

/** Testnachricht an dieses Gerät schicken lassen */
export async function sendTestPush(lang: Lang) {
  const client = cloud();
  const sub = await currentSubscription();
  if (!client || !sub) throw new Error('no-subscription');
  const { error } = await client.functions.invoke('push-alerts', { body: { test: true, endpoint: sub.endpoint, lang } });
  if (error) throw error;
}
