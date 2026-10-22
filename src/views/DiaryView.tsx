import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Camera, Cloud, Loader2, MapPin, Plus, Star, Trash2, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { useSettings } from '../state/settings';
import { navigate } from '../lib/router';
import { cloud, useSession } from '../lib/cloud/client';
import { cloudConfigured } from '../lib/cloud/config';
import { deleteEntry, getEntry, newEntry, photoUrl, removePhoto, saveEntry, uploadPhoto, useDiary, type Observation } from '../lib/cloud/diary';
import { fmtDateTime } from '../lib/format';
import { SHOWPIECES } from '../lib/showpieces';
import { SHOWERS } from '../lib/meteors';

const EQUIPMENT = ['eye', 'binoculars', 'telescope', 'camera'] as const;

export function DiaryView({ path, query }: { path: string; query: URLSearchParams }) {
  const sub = path.split('/').filter(Boolean)[1];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sub]);
  if (sub === 'neu') return <Editor id={null} query={query} />;
  if (sub) return <Editor id={sub} query={query} />;
  return <DiaryList />;
}

/** Foto aus dem privaten Speicher (signierte Adresse) */
function Photo({ path, className }: { path: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const c = cloud();
    if (!c) return;
    let alive = true;
    photoUrl(c, path).then((u) => alive && setUrl(u), () => undefined);
    return () => {
      alive = false;
    };
  }, [path]);
  return url ? <img className={className} src={url} alt="" loading="lazy" /> : <span className={`${className} photo-loading`} />;
}

function DiaryList() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { user } = useSession();
  const entries = useDiary();
  const tz = settings.place?.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const objects = new Set(entries.flatMap((e) => e.objects.map((o) => o.toLowerCase())));

  const months = useMemo(() => {
    const m = new Map<string, Observation[]>();
    for (const e of entries) {
      const key = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric', timeZone: tz }).format(new Date(e.observedAt));
      m.set(key, [...(m.get(key) ?? []), e]);
    }
    return [...m.entries()];
  }, [entries, lang, tz]);

  return (
    <div className="page diary">
      <header className="page-head">
        <p className="eyebrow">{t('diary.eyebrow')}</p>
        <h1>{t('diary.title')}</h1>
        <p className="lead muted">{t('diary.lead')}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#/tagebuch/neu">
            <Plus size={18} /> {t('diary.new')}
          </a>
        </div>
      </header>

      {cloudConfigured() && !user && (
        <a className="card sync-hint" href="#/settings">
          <Cloud size={20} />
          <span>{t('diary.localOnly')}</span>
        </a>
      )}

      {entries.length > 0 && (
        <div className="diary-stats">
          <span className="chip">{entries.length === 1 ? t('diary.countOne') : t('diary.count', { n: entries.length })}</span>
          <span className="chip">{objects.size === 1 ? t('diary.objectsOne') : t('diary.objects', { n: objects.size })}</span>
        </div>
      )}

      {entries.length === 0 && (
        <div className="card diary-empty">
          <Star size={28} />
          <h3>{t('diary.emptyTitle')}</h3>
          <p className="muted">{t('diary.emptyText')}</p>
        </div>
      )}

      {months.map(([month, list]) => (
        <section key={month} className="section diary-month">
          <h2 className="lexicon-cat">{month}</h2>
          <div className="diary-grid">
            {list.map((e) => (
              <a key={e.id} className="card diary-card" href={`#/tagebuch/${e.id}`}>
                {e.photos[0] && <Photo path={e.photos[0]} className="diary-thumb" />}
                <div className="diary-card-body">
                  <p className="history-date">{fmtDateTime(new Date(e.observedAt), tz, lang)}</p>
                  <h3>{e.title || e.objects.join(', ') || t('diary.untitled')}</h3>
                  {e.title && e.objects.length > 0 && <p className="muted small">{e.objects.join(' · ')}</p>}
                  <p className="diary-meta">
                    {e.placeName && (
                      <span>
                        <MapPin size={13} /> {e.placeName}
                      </span>
                    )}
                    {e.seeing && <span className="stars">{'★'.repeat(e.seeing)}</span>}
                  </p>
                  {e.notes && <p className="muted diary-notes">{e.notes}</p>}
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Lokales Datum/Uhrzeit-Format für <input type="datetime-local"> */
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function Editor({ id, query }: { id: string | null; query: URLSearchParams }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { user } = useSession();
  const existing = id ? getEntry(id) : null;
  const place = settings.place;
  const [entry, setEntry] = useState<Observation>(
    () =>
      existing ??
      newEntry({
        placeName: place?.name ?? '',
        lat: place?.lat ?? null,
        lon: place?.lon ?? null,
        objects: query.get('obj') ? [query.get('obj')!] : [],
        observedAt: query.get('t') ? new Date(Number(query.get('t'))).toISOString() : new Date().toISOString(),
      }),
  );
  const [objInput, setObjInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (id && !existing) {
    return (
      <div className="page diary">
        <p className="muted">{t('search.none')}</p>
        <a className="link" href="#/tagebuch">
          {t('diary.title')}
        </a>
      </div>
    );
  }

  const set = (patch: Partial<Observation>) => setEntry((e) => ({ ...e, ...patch }));
  const addObject = (name: string) => {
    const v = name.trim();
    if (v && !entry.objects.includes(v)) set({ objects: [...entry.objects, v] });
    setObjInput('');
  };
  const equipment = entry.equipment ? entry.equipment.split(', ') : [];
  const toggleEquipment = (label: string) =>
    set({ equipment: (equipment.includes(label) ? equipment.filter((x) => x !== label) : [...equipment, label]).join(', ') });

  const suggestions = [
    ...['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].map((b) => t(`body.${b}` as 'body.sun')),
    'ISS',
    ...SHOWPIECES.map((s) => s[lang].name),
    ...SHOWERS.map((s) => s[lang]),
  ];

  const onFiles = async (files: FileList | null) => {
    const c = cloud();
    if (!files?.length || !c || !user) return;
    setUploading(true);
    setError(null);
    try {
      const paths: string[] = [];
      for (const f of [...files].slice(0, 6)) paths.push(await uploadPhoto(c, user.id, entry.id, f));
      const next = { ...entry, photos: [...entry.photos, ...paths] };
      setEntry(next);
      // Sofort speichern, damit hochgeladene Fotos nicht verwaisen
      saveEntry(next);
    } catch {
      setError(t('diary.photoError'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = () => {
    const objects = objInput.trim() && !entry.objects.includes(objInput.trim()) ? [...entry.objects, objInput.trim()] : entry.objects;
    saveEntry({ ...entry, objects });
    navigate('/tagebuch');
  };

  return (
    <div className="page diary">
      <header className="page-head">
        <a className="back-link" href="#/tagebuch">
          <ArrowLeft size={16} /> {t('diary.title')}
        </a>
        <h1>{existing ? t('diary.edit') : t('diary.new')}</h1>
      </header>

      <form
        className="card diary-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="form-grid">
          <label className="field">
            <span>{t('diary.when')}</span>
            <input type="datetime-local" value={toLocalInput(entry.observedAt)} onChange={(e) => e.target.value && set({ observedAt: new Date(e.target.value).toISOString() })} />
          </label>
          <label className="field">
            <span>{t('diary.where')}</span>
            <input type="text" value={entry.placeName} onChange={(e) => set({ placeName: e.target.value })} />
          </label>
        </div>

        <div className="field">
          <span>{t('diary.what')}</span>
          <div className="object-chips">
            {entry.objects.map((o) => (
              <button key={o} type="button" className="chip is-on" onClick={() => set({ objects: entry.objects.filter((x) => x !== o) })}>
                {o} <X size={12} />
              </button>
            ))}
            <input
              className="object-input"
              list="diary-objects"
              value={objInput}
              placeholder={t('diary.objectPlaceholder')}
              onChange={(e) => setObjInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addObject(objInput);
                }
              }}
              onBlur={() => objInput && addObject(objInput)}
            />
            <datalist id="diary-objects">
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        </div>

        <label className="field">
          <span>{t('diary.titleLabel')}</span>
          <input type="text" value={entry.title} placeholder={t('diary.titlePlaceholder')} onChange={(e) => set({ title: e.target.value })} />
        </label>

        <div className="field">
          <span>{t('diary.conditions')}</span>
          <div className="rating" role="radiogroup" aria-label={t('diary.conditions')}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={entry.seeing === n}
                className={entry.seeing && n <= entry.seeing ? 'is-on' : ''}
                onClick={() => set({ seeing: entry.seeing === n ? null : n })}
                title={t(`diary.seeing${n}` as 'diary.seeing1')}
              >
                ★
              </button>
            ))}
            <span className="muted small">{entry.seeing ? t(`diary.seeing${entry.seeing}` as 'diary.seeing1') : ''}</span>
          </div>
        </div>

        <div className="field">
          <span>{t('diary.equipment')}</span>
          <div className="filter-chips">
            {EQUIPMENT.map((k) => {
              const label = t(`diary.eq.${k}`);
              return (
                <button key={k} type="button" className={`chip ${equipment.includes(label) ? 'is-on' : ''}`} onClick={() => toggleEquipment(label)}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="field">
          <span>{t('diary.notes')}</span>
          <textarea rows={5} value={entry.notes} placeholder={t('diary.notesPlaceholder')} onChange={(e) => set({ notes: e.target.value })} />
        </label>

        <div className="field">
          <span>{t('diary.photos')}</span>
          {user ? (
            <>
              <div className="photo-grid">
                {entry.photos.map((p) => (
                  <div key={p} className="photo-item">
                    <Photo path={p} className="photo-img" />
                    <button
                      type="button"
                      className="icon-btn photo-remove"
                      aria-label={t('diary.removePhoto')}
                      onClick={() => {
                        const c = cloud();
                        if (c) removePhoto(c, p);
                        const next = { ...entry, photos: entry.photos.filter((x) => x !== p) };
                        setEntry(next);
                        saveEntry(next);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" className="photo-add" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 size={22} className="spin" /> : <Camera size={22} />}
                  <span>{t('diary.addPhoto')}</span>
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            </>
          ) : (
            <p className="muted small">{cloudConfigured() ? t('diary.photosNeedAccount') : t('diary.photosUnavailable')}</p>
          )}
          {error && <p className="error">{error}</p>}
        </div>

        <div className="btn-row diary-actions">
          {existing && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (window.confirm(t('diary.confirmDelete'))) {
                  deleteEntry(entry.id);
                  navigate('/tagebuch');
                }
              }}
            >
              <Trash2 size={16} /> {t('diary.delete')}
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {t('diary.save')}
          </button>
        </div>
        {existing && <p className="muted small">{t('diary.lastChange', { date: fmtDateTime(new Date(existing.updatedAt), settings.place?.tz ?? 'UTC', lang) })}</p>}
      </form>
    </div>
  );
}
