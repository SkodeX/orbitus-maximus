import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n, type Translate } from '../../i18n';
import type { Lang } from '../../state/settings';
import { award } from '../../learn/badges';
import { updateProgress } from '../../learn/progress';
import { AU_METERS, DESTINATIONS, LIGHT_YEAR_M, SCALE_STOPS, VEHICLES } from '../../learn/scale';
import { BODY, type SolarId } from '../../solar/bodies';
import { fmtInt, fmtNum, fmtDate } from '../../lib/format';
import { useSettings } from '../../state/settings';

function markTool(id: string) {
  updateProgress((p) => (p.tools.includes(id) ? p : { ...p, tools: [...p.tools, id] }), award);
}

/** Große Zahlen in Worten: 1,2 Millionen / 540 Billionen */
function bigNumber(n: number, lang: Lang) {
  const units =
    lang === 'de'
      ? [
          [1e15, 'Billiarden'],
          [1e12, 'Billionen'],
          [1e9, 'Milliarden'],
          [1e6, 'Millionen'],
        ]
      : [
          [1e15, 'quadrillion'],
          [1e12, 'trillion'],
          [1e9, 'billion'],
          [1e6, 'million'],
        ];
  for (const [v, word] of units as [number, string][]) {
    if (n >= v) {
      const x = n / v;
      if (x >= 1000) return `${fmtInt(x, lang)} ${word}`;
      return `${fmtNum(x, lang, x < 10 ? 1 : 0)} ${word}`;
    }
  }
  return fmtInt(n, lang);
}

function fmtLength(m: number, lang: Lang, t: Translate) {
  if (m < 1000) return `${fmtNum(m, lang, m < 10 ? 1 : 0)} m`;
  if (m < 1e11) return `${fmtInt(m / 1000, lang)} km`;
  if (m < 1e15) {
    const au = m / AU_METERS;
    return `${fmtNum(au, lang, au < 10 ? 1 : 0)} ${t('learn.au')} · ${bigNumber(m / 1000, lang)} km`;
  }
  const ly = m / LIGHT_YEAR_M;
  return `${ly < 1e6 ? fmtNum(ly, lang, ly < 10 ? 1 : 0) : bigNumber(ly, lang)} ${t('learn.lightYears')}`;
}

export function Sizes() {
  const { t } = useI18n();
  return (
    <div className="page learn">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('learn.sizes')}</h1>
        <p className="lead muted">{t('learn.sizesLead')}</p>
        <div className="filter-chips">
          <a className="chip" href="#/wissen/groessen" onClick={(e) => (e.preventDefault(), document.getElementById('scale')?.scrollIntoView({ behavior: 'smooth' }))}>
            {t('learn.scaleTitle')}
          </a>
          <a className="chip" href="#/wissen/groessen" onClick={(e) => (e.preventDefault(), document.getElementById('travel')?.scrollIntoView({ behavior: 'smooth' }))}>
            {t('learn.travelTitle')}
          </a>
          <a className="chip" href="#/wissen/groessen" onClick={(e) => (e.preventDefault(), document.getElementById('weight')?.scrollIntoView({ behavior: 'smooth' }))}>
            {t('learn.weightTitle')}
          </a>
        </div>
      </header>
      <ScaleJourney />
      <TravelTime />
      <WeightAge />
    </div>
  );
}

// ------------------------------------------------------------------------------ Skalenreise

function ScaleJourney() {
  const { t, lang } = useI18n();
  const [i, setI] = useState(0);
  const stop = SCALE_STOPS[i];
  const prev = i > 0 ? SCALE_STOPS[i - 1] : null;
  const ratio = prev ? stop.meters / prev.meters : 1;
  const inner = prev ? 128 / ratio : 0;
  const go = (n: number) => {
    setI(Math.max(0, Math.min(SCALE_STOPS.length - 1, n)));
    markTool('scale');
  };

  return (
    <section className="section" id="scale">
      <div className="section-head">
        <p className="eyebrow">{t('learn.tool', { n: 1 })}</p>
        <h2>{t('learn.scaleTitle')}</h2>
        <p className="muted">{t('learn.scaleLead')}</p>
      </div>
      <div className="card scale-card">
        <svg className="scale-visual" viewBox="0 0 320 320" role="img" aria-label={stop[lang].name}>
          <defs>
            <radialGradient id="scale-cur" cx="40%" cy="35%" r="75%">
              <stop offset="0" stopColor="rgba(197,139,255,0.35)" />
              <stop offset="1" stopColor="rgba(138,164,255,0.05)" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="160" r="128" fill="url(#scale-cur)" stroke="rgba(138,164,255,0.8)" strokeWidth="1.5" key={`c${i}`} className="scale-pop" />
          {prev && inner >= 1.2 && <circle cx="160" cy="160" r={inner} fill="rgba(255,213,154,0.35)" stroke="#ffd59a" strokeWidth="1.2" key={`p${i}`} className="scale-pop" />}
          {prev && inner < 1.2 && (
            <g key={`d${i}`} className="scale-pop">
              <circle cx="160" cy="160" r="2" fill="#ffd59a" />
              <line x1="163" y1="157" x2="210" y2="118" stroke="rgba(255,213,154,0.7)" />
              <text x="214" y="114" fill="#ffd59a" fontSize="11">
                {prev[lang].name}
              </text>
            </g>
          )}
        </svg>
        <div className="scale-info">
          <p className="card-kicker">
            {t('learn.step', { n: i + 1, total: SCALE_STOPS.length })}
          </p>
          <h3>{stop[lang].name}</h3>
          <p className="scale-size">{fmtLength(stop.meters, lang, t)}</p>
          <p className="muted">{stop[lang].fact}</p>
          {prev && (
            <p className="scale-ratio">
              {t('learn.ratio', { x: ratio < 1e6 ? fmtNum(ratio, lang, ratio < 10 ? 1 : 0) : bigNumber(ratio, lang), prev: prev[lang].name })}
            </p>
          )}
          <input
            className="range"
            type="range"
            min={0}
            max={SCALE_STOPS.length - 1}
            value={i}
            onChange={(e) => go(Number(e.target.value))}
            aria-label={t('learn.scaleTitle')}
          />
          <div className="btn-row">
            <button className="btn btn-ghost btn-sm" onClick={() => go(i - 1)} disabled={i === 0}>
              <ChevronLeft size={16} /> {t('learn.smaller')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => go(i + 1)} disabled={i === SCALE_STOPS.length - 1}>
              {t('learn.bigger')} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------------------ Reisezeit

const YEAR_S = 365.25 * 86_400;
const LIFETIME_Y = 73;
const UNIVERSE_Y = 13.8e9;

function fmtTravel(seconds: number, lang: Lang, t: Translate) {
  if (seconds < 60) return t('learn.dur.seconds', { n: fmtNum(seconds, lang, seconds < 10 ? 1 : 0) });
  const min = seconds / 60;
  if (min < 60) return t('learn.dur.minutes', { n: fmtInt(min, lang) });
  const h = min / 60;
  if (h < 24) return t('learn.dur.hours', { h: Math.floor(h), m: Math.round((h % 1) * 60) });
  const d = h / 24;
  if (d < 365) return t('learn.dur.days', { d: Math.floor(d), h: Math.round((d % 1) * 24) });
  const y = seconds / YEAR_S;
  if (y < 1000) return t('learn.dur.years', { n: fmtNum(y, lang, y < 10 ? 1 : 0) });
  return t('learn.dur.years', { n: y < 1e6 ? fmtInt(y, lang) : bigNumber(y, lang) });
}

function travelNote(seconds: number, lang: Lang, t: Translate) {
  const years = seconds / YEAR_S;
  if (seconds < 10) return t('learn.note.blink');
  if (seconds < 86_400) return t('learn.note.day');
  if (years < 1) return t('learn.note.year');
  if (years < LIFETIME_Y) return t('learn.note.lifePct', { pct: Math.round((years / LIFETIME_Y) * 100) });
  if (years < UNIVERSE_Y) return t('learn.note.lives', { n: years / LIFETIME_Y < 1e6 ? fmtInt(years / LIFETIME_Y, lang) : bigNumber(years / LIFETIME_Y, lang) });
  return t('learn.note.universe', { n: fmtInt(years / UNIVERSE_Y, lang) });
}

const TICKS = [
  { s: 1, key: 'learn.tick.second' },
  { s: 3600, key: 'learn.tick.hour' },
  { s: YEAR_S, key: 'learn.tick.year' },
  { s: LIFETIME_Y * YEAR_S, key: 'learn.tick.life' },
  { s: UNIVERSE_Y * YEAR_S, key: 'learn.tick.universe' },
] as const;
const LOG_MAX = 23;

function TravelTime() {
  const { t, lang } = useI18n();
  const [dest, setDest] = useState('mars');
  const [veh, setVeh] = useState('car');
  const d = DESTINATIONS.find((x) => x.id === dest)!;
  const v = VEHICLES.find((x) => x.id === veh)!;
  const seconds = (d.km / v.kmh) * 3600;
  const pos = Math.max(0, Math.min(100, (Math.log10(Math.max(seconds, 1)) / LOG_MAX) * 100));

  return (
    <section className="section" id="travel">
      <div className="section-head">
        <p className="eyebrow">{t('learn.tool', { n: 2 })}</p>
        <h2>{t('learn.travelTitle')}</h2>
        <p className="muted">{t('learn.travelLead')}</p>
      </div>
      <div className="card travel-card">
        <div>
          <p className="card-kicker">{t('learn.destination')}</p>
          <div className="filter-chips">
            {DESTINATIONS.map((x) => (
              <button
                key={x.id}
                className={`chip ${dest === x.id ? 'is-on' : ''}`}
                onClick={() => {
                  setDest(x.id);
                  markTool('travel');
                }}
              >
                {x[lang]}
              </button>
            ))}
          </div>
          <p className="card-kicker" style={{ marginTop: 18 }}>
            {t('learn.vehicle')}
          </p>
          <div className="filter-chips">
            {VEHICLES.map((x) => (
              <button
                key={x.id}
                className={`chip ${veh === x.id ? 'is-on' : ''}`}
                onClick={() => {
                  setVeh(x.id);
                  markTool('travel');
                }}
              >
                {x[lang]} <small className="muted">{fmtInt(x.kmh, lang)} km/h</small>
              </button>
            ))}
          </div>
        </div>
        <div className="travel-result" aria-live="polite">
          <p className="card-kicker">{t('learn.travelTime')}</p>
          <p className="travel-time">{fmtTravel(seconds, lang, t)}</p>
          <p className="muted">{travelNote(seconds, lang, t)}</p>
          <div className="logbar">
            <span className="logbar-fill" style={{ width: `${pos}%` }} />
            <span className="logbar-marker" style={{ left: `${pos}%` }} />
            {TICKS.map((tk, k) => (
              <span key={tk.key} className={`logbar-tick ${k % 2 ? 'is-up' : ''}`} style={{ left: `${(Math.log10(tk.s) / LOG_MAX) * 100}%` }}>
                {t(tk.key)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------------------ Gewicht & Alter

const WORLDS: SolarId[] = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const MOON_G = 1.62;
// Bezugswert aus denselben Daten, damit die Erde genau dein Gewicht zeigt
const EARTH_G = BODY.earth.facts!.gravity;

function WeightAge() {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const tz = settings.place?.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [weight, setWeight] = useState(70);
  const [birth, setBirth] = useState('');
  const born = birth ? Date.parse(`${birth}T12:00:00Z`) : NaN;
  const ageDays = Number.isFinite(born) ? (Date.now() - born) / 86_400_000 : null;

  return (
    <section className="section" id="weight">
      <div className="section-head">
        <p className="eyebrow">{t('learn.tool', { n: 3 })}</p>
        <h2>{t('learn.weightTitle')}</h2>
        <p className="muted">{t('learn.weightLead')}</p>
      </div>
      <div className="card weight-card">
        <div className="weight-inputs">
          <label className="field">
            <span>{t('learn.yourWeight')}</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={500}
              value={weight}
              onChange={(e) => {
                setWeight(Number(e.target.value) || 0);
                markTool('weight');
              }}
            />
          </label>
          <label className="field">
            <span>{t('learn.birthday')}</span>
            <input
              type="date"
              value={birth}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => {
                setBirth(e.target.value);
                markTool('weight');
              }}
            />
          </label>
        </div>
        <div className="table-wrap">
          <table className="world-table">
            <thead>
              <tr>
                <th>{t('learn.world')}</th>
                <th>{t('learn.weightThere')}</th>
                <th>{t('learn.ageThere')}</th>
              </tr>
            </thead>
            <tbody>
              {WORLDS.map((id) => {
                const def = BODY[id];
                const g = id === 'moon' ? MOON_G : (def.facts?.gravity ?? EARTH_G);
                const year = def.facts?.yearD;
                const age = ageDays != null && year ? ageDays / year : null;
                const nextBirthday = age != null && year ? new Date(born + Math.ceil(age) * year * 86_400_000) : null;
                return (
                  <tr key={id} className={id === 'earth' ? 'is-home' : ''}>
                    <th>{t(`solar.name.${id}` as 'solar.name.sun')}</th>
                    <td>{fmtNum((weight * g) / EARTH_G, lang, 1)} kg</td>
                    <td>
                      {age == null ? (
                        <span className="muted">–</span>
                      ) : (
                        <>
                          {t('learn.ageYears', { n: fmtNum(age, lang, age < 10 ? 1 : 0) })}
                          {nextBirthday && age < 200 && (
                            <small className="block muted">{t('learn.nextBirthday', { date: fmtDate(nextBirthday, tz, lang) })}</small>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="note">{t('learn.weightNote')}</p>
      </div>
    </section>
  );
}
