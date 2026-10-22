import * as A from 'astronomy-engine';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BODIES, observerOf, type BodyId } from '../../lib/astro';
import { activeShowers } from '../../lib/meteors';
import { fold } from '../../lib/format';
import { useSettings } from '../../state/settings';
import { useI18n } from '../../i18n';
import type { SkyData, SkyObject } from '../../sky/engine';

interface Entry {
  label: string;
  sub: string;
  obj: SkyObject;
  key: string;
  ra?: number; // Grad
  dec?: number;
  rank: number;
}

const SUGGESTED = ['body:moon', 'body:jupiter', 'body:saturn', 'body:mars', 'body:venus', 'dso:M31', 'dso:M45', 'dso:M42', 'star:Polaris', 'star:Vega', 'star:Sirius'];
const BODY_IDS: BodyId[] = ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'];

export function SearchPanel({ data, time, onPick }: { data: SkyData; time: Date; onPick: (o: SkyObject) => void }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const obs = observerOf(settings.place!);

  const entries = useMemo(() => {
    const list: Entry[] = [];
    BODY_IDS.forEach((id) =>
      list.push({ label: t(`body.${id}`), sub: id === 'moon' ? t('type.moon') : id === 'sun' ? t('type.star') : t('type.planet'), obj: { kind: 'body', id }, key: `body:${id}`, rank: 0 }),
    );
    data.stars.forEach(([ra, dec, , , hip], index) => {
      const n = data.starNames[hip];
      if (n?.n) list.push({ label: n.n, sub: `${t('type.star')}${n.b ? ` · ${n.b} ${n.c}` : ''}`, obj: { kind: 'star', index }, key: `star:${n.n}`, ra, dec, rank: 2 });
    });
    data.messier.forEach((m, index) => {
      const name = lang === 'de' ? m.de : m.en;
      list.push({ label: name ? `${name} (${m.id})` : m.id, sub: `${m.id} · ${m.ngc}`, obj: { kind: 'dso', index }, key: `dso:${m.id}`, ra: m.ra, dec: m.dec, rank: 1 });
    });
    data.constellations.forEach((c, index) =>
      list.push({ label: lang === 'de' ? c.de : c.la, sub: `${t('type.constellation')} · ${c.la}`, obj: { kind: 'constellation', index }, key: `con:${c.id}`, ra: c.ra, dec: c.dec, rank: 1 }),
    );
    activeShowers(time).forEach((s) =>
      list.push({ label: lang === 'de' ? s.de : s.en, sub: t('type.meteor'), obj: { kind: 'meteor', id: s.id }, key: `meteor:${s.id}`, ra: s.ra, dec: s.dec, rank: 1 }),
    );
    return list.map((e) => ({ ...e, folded: fold(`${e.label} ${e.sub}`) }));
  }, [data, t, lang, time]);

  const results = useMemo(() => {
    const f = fold(q.trim());
    if (!f) return SUGGESTED.map((k) => entries.find((e) => e.key === k)).filter((e): e is (typeof entries)[number] => !!e);
    return entries
      .filter((e) => e.folded.includes(f))
      .sort((a, b) => Number(!fold(a.label).startsWith(f)) - Number(!fold(b.label).startsWith(f)) || a.rank - b.rank)
      .slice(0, 40);
  }, [q, entries]);

  // Höhe über dem Horizont für die Trefferliste
  const rot = A.Rotation_EQJ_HOR(time, obs);
  const at = A.MakeTime(time);
  const altitude = (e: Entry) => {
    if (e.obj.kind === 'body') {
      const eq = A.Equator(BODIES[e.obj.id], at, obs, true, true);
      return A.Horizon(at, obs, eq.ra, eq.dec, 'normal').altitude;
    }
    const ra = (e.ra! * Math.PI) / 180;
    const dec = (e.dec! * Math.PI) / 180;
    const v = A.RotateVector(rot, new A.Vector(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec), at));
    return (Math.asin(v.z) * 180) / Math.PI;
  };

  return (
    <div className="search">
      <label className="search-box">
        <Search size={18} />
        <input autoFocus type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.placeholder')} />
      </label>
      {!q && <p className="search-hint">{t('search.suggestions')}</p>}
      <ul className="result-list">
        {results.map((e) => {
          const alt = altitude(e);
          return (
            <li key={e.key}>
              <button onClick={() => onPick(e.obj)}>
                <span className="result-label">{e.label}</span>
                <span className="result-sub">{e.sub}</span>
                <span className={`result-alt ${alt > 0 ? 'is-up' : ''}`}>{alt > 0 ? `${Math.round(alt)}°` : t('search.below')}</span>
              </button>
            </li>
          );
        })}
        {results.length === 0 && <li className="muted">{t('search.none')}</li>}
      </ul>
    </div>
  );
}
