import { useEffect, useState } from 'react';
import { Loader2, LocateFixed, MapPin, Search } from 'lucide-react';
import { getGpsPosition, reverseName, searchPlaces, type GeoResult } from '../lib/geocode';
import { useSettings } from '../state/settings';
import { useI18n } from '../i18n';

/** GPS-Knopf plus Ortssuche; ruft `onDone` nach erfolgreicher Auswahl auf */
export function LocationPicker({ onDone }: { onDone?: () => void }) {
  const { settings, setPlace } = useSettings();
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<GeoResult[] | null>(null);
  const [busy, setBusy] = useState<'gps' | 'search' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults(null);
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      setBusy('search');
      searchPlaces(query, lang, ctrl.signal)
        .then((r) => setResults(r))
        .catch((e) => e.name !== 'AbortError' && setError(t('place.searchFailed')))
        .finally(() => setBusy((b) => (b === 'search' ? null : b)));
    }, 300);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [q, lang, t]);

  async function useGps() {
    setBusy('gps');
    setError(null);
    try {
      const pos = await getGpsPosition();
      const { latitude: lat, longitude: lon, altitude } = pos.coords;
      const named = await reverseName(lat, lon, lang);
      setPlace({
        name: named?.name ?? t('place.myLocation'),
        region: named?.region,
        lat,
        lon,
        elevation: altitude ?? 0,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        source: 'gps',
      });
      onDone?.();
    } catch (e) {
      const code = (e as GeolocationPositionError).code;
      setError(code === 1 ? t('place.gpsDenied') : (e as Error).message === 'unsupported' ? t('place.gpsUnsupported') : t('place.gpsFailed'));
    } finally {
      setBusy(null);
    }
  }

  function pick(r: GeoResult) {
    const { id: _id, country: _country, ...place } = r;
    setPlace(place);
    setQ('');
    setResults(null);
    onDone?.();
  }

  const cur = settings.place;
  const recent = settings.recentPlaces.filter((p) => !cur || Math.abs(p.lat - cur.lat) > 0.01 || Math.abs(p.lon - cur.lon) > 0.01);

  return (
    <div className="picker">
      <button className="btn btn-primary btn-block" onClick={useGps} disabled={busy === 'gps'}>
        {busy === 'gps' ? <Loader2 size={18} className="spin" /> : <LocateFixed size={18} />}
        {busy === 'gps' ? t('place.gpsBusy') : t('place.useGps')}
      </button>

      <div className="picker-or">
        <span>{t('place.or')}</span>
      </div>

      <label className="search-box">
        {busy === 'search' ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('place.searchPlaceholder')} autoComplete="off" />
      </label>

      {error && <p className="error">{error}</p>}

      {results && (
        <ul className="result-list">
          {results.length === 0 && <li className="muted">{t('place.noResults')}</li>}
          {results.map((r) => (
            <li key={r.id}>
              <button onClick={() => pick(r)}>
                <MapPin size={16} />
                <span className="result-label">{r.name}</span>
                <span className="result-sub">{r.region}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!results && recent.length > 0 && (
        <>
          <p className="search-hint">{t('place.recent')}</p>
          <ul className="result-list">
            {recent.map((p) => (
              <li key={`${p.lat},${p.lon}`}>
                <button
                  onClick={() => {
                    setPlace(p);
                    onDone?.();
                  }}
                >
                  <MapPin size={16} />
                  <span className="result-label">{p.name}</span>
                  <span className="result-sub">{p.region}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
