// Beobachtungstagebuch: lokal gespeichert (funktioniert offline und ohne Konto),
// mit Konto zusätzlich in Supabase synchronisiert. Gelöschte Einträge bleiben als Grabstein,
// damit das Löschen auf allen Geräten ankommt.
import { useSyncExternalStore } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Observation {
  id: string;
  observedAt: string; // ISO
  placeName: string;
  lat: number | null;
  lon: number | null;
  objects: string[];
  title: string;
  notes: string;
  /** Beobachtungsbedingungen 1–5 */
  seeing: number | null;
  equipment: string;
  /** Pfade im Storage-Bucket */
  photos: string[];
  deleted: boolean;
  updatedAt: number;
  /** Lokal geändert, noch nicht hochgeladen */
  dirty?: boolean;
}

const KEY = 'orbitus.diary.v1';
const PULL_KEY = 'orbitus.diary.lastPull';

function load(): Observation[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Observation[];
  } catch {
    return [];
  }
}

let entries: Observation[] = load();
const listeners = new Set<() => void>();
function save(next: Observation[]) {
  entries = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Speicher voll: bleibt dann nur bis zum Neuladen erhalten
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Alle sichtbaren Einträge, neueste zuerst */
export function useDiary() {
  const all = useSyncExternalStore(subscribe, () => entries);
  return all.filter((e) => !e.deleted).sort((a, b) => b.observedAt.localeCompare(a.observedAt));
}

export const getEntry = (id: string) => entries.find((e) => e.id === id && !e.deleted) ?? null;

export function newEntry(init: Partial<Observation> = {}): Observation {
  return {
    id: crypto.randomUUID(),
    observedAt: new Date().toISOString(),
    placeName: '',
    lat: null,
    lon: null,
    objects: [],
    title: '',
    notes: '',
    seeing: null,
    equipment: '',
    photos: [],
    deleted: false,
    updatedAt: Date.now(),
    ...init,
  };
}

export function saveEntry(e: Observation) {
  const next = { ...e, updatedAt: Date.now(), dirty: true };
  save([...entries.filter((x) => x.id !== e.id), next]);
  scheduleSync();
}

export function deleteEntry(id: string) {
  const e = entries.find((x) => x.id === id);
  if (!e) return;
  save([...entries.filter((x) => x.id !== id), { ...e, deleted: true, updatedAt: Date.now(), dirty: true }]);
  scheduleSync();
}

// ---------------------------------------------------------------- Abgleich mit Supabase

interface Row {
  id: string;
  user_id?: string;
  observed_at: string;
  place_name: string | null;
  lat: number | null;
  lon: number | null;
  objects: string[];
  title: string;
  notes: string;
  seeing: number | null;
  equipment: string;
  photos: string[];
  deleted: boolean;
  updated_at: string;
  /** Vom Server gesetzt: Zeitpunkt des letzten Schreibens (unabhängig von der Geräteuhr) */
  synced_at?: string;
}

const toRow = (e: Observation, userId: string): Row => ({
  id: e.id,
  user_id: userId,
  observed_at: e.observedAt,
  place_name: e.placeName,
  lat: e.lat,
  lon: e.lon,
  objects: e.objects,
  title: e.title,
  notes: e.notes,
  seeing: e.seeing,
  equipment: e.equipment,
  photos: e.photos,
  deleted: e.deleted,
  updated_at: new Date(e.updatedAt).toISOString(),
});

const fromRow = (r: Row): Observation => ({
  id: r.id,
  observedAt: r.observed_at,
  placeName: r.place_name ?? '',
  lat: r.lat,
  lon: r.lon,
  objects: r.objects ?? [],
  title: r.title ?? '',
  notes: r.notes ?? '',
  seeing: r.seeing,
  equipment: r.equipment ?? '',
  photos: r.photos ?? [],
  deleted: r.deleted,
  updatedAt: Date.parse(r.updated_at),
});

let syncer: (() => Promise<void>) | null = null;
let timer = 0;
function scheduleSync() {
  if (!syncer) return;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => syncer?.().catch(() => undefined), 1500);
}

/** Verbindet das Tagebuch mit einem angemeldeten Konto (null = abmelden) */
export function connectDiary(client: SupabaseClient | null, userId: string | null) {
  syncer = client && userId ? () => syncDiary(client, userId) : null;
  if (syncer) syncer().catch(() => undefined);
}

export async function syncDiary(client: SupabaseClient, userId: string) {
  // 1. Lokale Änderungen hochladen
  const dirty = entries.filter((e) => e.dirty);
  if (dirty.length) {
    const { error } = await client.from('observations').upsert(dirty.map((e) => toRow(e, userId)));
    if (error) throw error;
    const ids = new Set(dirty.map((e) => e.id));
    save(entries.map((e) => (ids.has(e.id) ? { ...e, dirty: false } : e)));
  }
  // 2. Änderungen von anderen Geräten holen (nach Serverzeit, damit falsch gehende Uhren nichts verschlucken)
  const since = localStorage.getItem(PULL_KEY) ?? '1970-01-01T00:00:00Z';
  const { data, error } = await client.from('observations').select('*').gt('synced_at', since).order('synced_at');
  if (error) throw error;
  if (data?.length) {
    const map = new Map(entries.map((e) => [e.id, e]));
    for (const row of data as Row[]) {
      const remote = fromRow(row);
      const local = map.get(remote.id);
      if (!local || (!local.dirty && remote.updatedAt >= local.updatedAt)) map.set(remote.id, remote);
    }
    save([...map.values()]);
    localStorage.setItem(PULL_KEY, (data[data.length - 1] as Row).synced_at ?? new Date().toISOString());
  }
}

// ---------------------------------------------------------------- Fotos

const BUCKET = 'observation-photos';

/** Foto verkleinern (max. 2048 px) und als JPEG hochladen; liefert den Speicherpfad */
export async function uploadPhoto(client: SupabaseClient, userId: string, entryId: string, file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2048 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('jpeg'))), 'image/jpeg', 0.85));
  const path = `${userId}/${entryId}/${crypto.randomUUID()}.jpg`;
  const { error } = await client.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw error;
  return path;
}

const signed = new Map<string, { url: string; until: number }>();

/** Zeitlich begrenzte Adresse für ein privates Foto (eine Stunde gültig, zwischengespeichert) */
export async function photoUrl(client: SupabaseClient, path: string) {
  const hit = signed.get(path);
  if (hit && hit.until > Date.now()) return hit.url;
  const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) throw error;
  signed.set(path, { url: data.signedUrl, until: Date.now() + 50 * 60_000 });
  return data.signedUrl;
}

export async function removePhoto(client: SupabaseClient, path: string) {
  await client.storage.from(BUCKET).remove([path]);
}
