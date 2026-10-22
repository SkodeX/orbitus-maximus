// Abgleich von Einstellungen, Lernfortschritt und Tagebuch mit dem Konto
import { useEffect, useRef, useState } from 'react';
import { cloud, useSession } from './client';
import { connectDiary } from './diary';
import { DEFAULT_PREFS, currentSubscription, loadPrefs, saveSubscription } from './push';
import { SYNCED_KEYS, useSettings, type SyncedSettings } from '../../state/settings';
import { getProgress, updateProgress, useProgress, type Progress } from '../../learn/progress';

export type SyncStatus = 'off' | 'syncing' | 'ok' | 'error';

let status: SyncStatus = 'off';
let lastSync: number | null = null;
const listeners = new Set<() => void>();
function setStatus(s: SyncStatus) {
  status = s;
  if (s === 'ok') lastSync = Date.now();
  listeners.forEach((l) => l());
}

export function useSyncStatus() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { status, lastSync };
}

/** Lernfortschritt zusammenführen: nichts geht verloren, egal auf welchem Gerät es entstand */
export function mergeProgress(a: Progress, b: Partial<Progress>): Progress {
  const union = (x: string[] = [], y: string[] = []) => [...new Set([...x, ...y])];
  const badges = new Map<string, number>();
  for (const bd of [...a.badges, ...(b.badges ?? [])]) badges.set(bd.id, Math.min(bd.at, badges.get(bd.id) ?? Infinity));
  const quizzes = new Map<number, Progress['quizzes'][number]>();
  for (const q of [...a.quizzes, ...(b.quizzes ?? [])]) quizzes.set(q.at, q);
  return {
    read: union(a.read, b.read),
    correct: union(a.correct, b.correct),
    tools: union(a.tools, b.tools),
    badges: [...badges.entries()].map(([id, at]) => ({ id, at })),
    quizzes: [...quizzes.values()].sort((x, y) => x.at - y.at).slice(-100),
    observed: union(a.observed, b.observed),
    pathTasks: union(a.pathTasks, b.pathTasks),
    // Lernkarten: der jeweils neuere Stand gewinnt
    cards: Object.fromEntries(
      [...new Set([...Object.keys(a.cards ?? {}), ...Object.keys(b.cards ?? {})])].map((k) => {
        const x = a.cards?.[k];
        const z = b.cards?.[k];
        return [k, !x ? z! : !z ? x : z.at > x.at ? z : x];
      }),
    ),
  };
}

const pickSynced = (s: SyncedSettings): SyncedSettings => {
  const out = { updatedAt: s.updatedAt } as SyncedSettings;
  for (const k of SYNCED_KEYS) (out as Record<string, unknown>)[k] = s[k];
  return out;
};

/** Hält Einstellungen, Fortschritt und Tagebuch mit dem Konto synchron (im App-Gerüst eingebunden) */
export function useCloudSync() {
  const { user } = useSession();
  const { settings, applyRemote } = useSettings();
  const progress = useProgress();
  const [loaded, setLoaded] = useState(false);
  const pushTimer = useRef(0);

  // Beim Anmelden: Stand vom Server holen und zusammenführen
  useEffect(() => {
    const client = cloud();
    setLoaded(false);
    if (!client || !user) {
      connectDiary(null, null);
      setStatus('off');
      return;
    }
    let alive = true;
    setStatus('syncing');
    (async () => {
      const { data, error } = await client.from('user_state').select('settings, progress').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (!alive) return;
      const remoteSettings = data?.settings as SyncedSettings | undefined;
      if (remoteSettings && (remoteSettings.updatedAt ?? 0) > (settings.updatedAt ?? 0)) applyRemote(remoteSettings);
      if (data?.progress) updateProgress((p) => mergeProgress(p, data.progress as Partial<Progress>));
      setLoaded(true);
      connectDiary(client, user.id);
      setStatus('ok');
    })().catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
    // Nur beim Wechsel des Kontos neu laden
  }, [user?.id]);

  // Lokale Änderungen kurz gebündelt hochladen
  useEffect(() => {
    const client = cloud();
    if (!client || !user || !loaded) return;
    window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(async () => {
      setStatus('syncing');
      const { error } = await client.from('user_state').upsert({
        user_id: user.id,
        settings: pickSynced(settings),
        progress: getProgress(),
        updated_at: new Date().toISOString(),
      });
      setStatus(error ? 'error' : 'ok');
    }, 2000);
    // Nach dem ersten Laden einmal den zusammengeführten Stand hochladen, danach bei jeder Änderung
  }, [settings.updatedAt, progress, user, loaded]);

  // Benachrichtigungen gelten für den aktuellen Ort: Abo nachführen, wenn sich Ort oder Sprache ändern
  useEffect(() => {
    const place = settings.place;
    if (!user || !place) return;
    (async () => {
      const sub = await currentSubscription();
      if (!sub) return;
      await saveSubscription(sub, place, settings.lang, (await loadPrefs()) ?? DEFAULT_PREFS);
    })().catch(() => undefined);
  }, [user?.id, settings.place?.lat, settings.place?.lon, settings.lang]);
}
