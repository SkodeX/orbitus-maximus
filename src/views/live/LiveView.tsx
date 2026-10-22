import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Rocket, Satellite, Users, Zap } from 'lucide-react';
import type { SatRec } from '../../lib/live/sgp4';
import { useSettings } from '../../state/settings';
import { useI18n, type MsgKey } from '../../i18n';
import { useNow } from '../../lib/useNow';
import { useLive } from '../../lib/live/useLive';
import { loadIss } from '../../lib/live/iss';
import { loadAstronauts, loadLaunches, loadNasaImages, loadNews, type Astronaut, type Launch } from '../../lib/live/feeds';
import { kpLevel, kpNeeded, loadKpForecast, loadKpNow, loadScales, loadSolarWind, type KpPoint } from '../../lib/live/spaceWeather';
import { fmtDateTime, fmtDay, fmtNum, fmtTime, localDayKey, localeOf } from '../../lib/format';
import { IssCard, usePasses } from './IssCard';

const flag = (cc: string) =>
  cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';

function useRelative() {
  const { lang } = useI18n();
  return useMemo(() => {
    const rtf = new Intl.RelativeTimeFormat(localeOf(lang), { numeric: 'auto' });
    return (iso: string | number) => {
      const diff = (typeof iso === 'number' ? iso : Date.parse(iso)) - Date.now();
      const abs = Math.abs(diff);
      if (abs < 3_600_000) return rtf.format(Math.round(diff / 60_000), 'minute');
      if (abs < 86_400_000) return rtf.format(Math.round(diff / 3_600_000), 'hour');
      return rtf.format(Math.round(diff / 86_400_000), 'day');
    };
  }, [lang]);
}

function countdown(ms: number, lang: 'de' | 'en') {
  const sign = ms >= 0 ? 'T−' : 'T+';
  let s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86_400);
  s -= d * 86_400;
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${sign} ${d ? `${d}${lang === 'de' ? ' T' : 'd'} ` : ''}${hh}:${mm}:${ss}`;
}

export function LiveView() {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;

  const [rec, setRec] = useState<SatRec | null>(null);
  const [issError, setIssError] = useState(false);
  useEffect(() => {
    loadIss().then(setRec, () => setIssError(true));
  }, []);
  const passes = usePasses(rec);

  const launches = useLive(loadLaunches, [], 10 * 60_000);
  const astronauts = useLive(loadAstronauts, []);
  const kpNow = useLive(loadKpNow, [], 5 * 60_000);

  const upcoming = useMemo(
    () => (launches.data ?? []).filter((l) => Date.parse(l.net) > Date.now() - 2 * 3_600_000 && !['Success', 'Failure', 'Partial Failure'].includes(l.status)),
    [launches.data],
  );
  const nextPass = (passes ?? []).find((p) => p.visible && p.vanish && p.vanish.t.getTime() > Date.now());
  // Kurz: „Heute“, „Morgen“ oder Wochentag, damit es auf dem Handy in die Kachel passt
  const shortDay = (d: Date) => {
    const key = localDayKey(d, place.tz);
    if (key === localDayKey(new Date(), place.tz)) return t('common.today');
    if (key === localDayKey(new Date(Date.now() + 86_400_000), place.tz)) return t('common.tomorrow');
    return new Intl.DateTimeFormat(localeOf(lang), { weekday: 'short', timeZone: place.tz }).format(d);
  };
  const needed = kpNeeded(place.lat, place.lon);

  return (
    <div className="page live">
      <header className="page-head live-head">
        <p className="eyebrow">
          <span className="live-dot" /> {t('live.eyebrow')}
        </p>
        <h1>
          {t('live.titleA')} <span className="grad">{t('live.titleB')}</span>
        </h1>
        <p className="lead muted">{t('live.lead')}</p>
        <div className="quick">
          <a className="quick-chip" href="#iss">
            <Satellite size={16} />
            <span>
              <small>{t('live.quickIss')}</small>
              {nextPass ? `${shortDay(nextPass.appear!.t)}, ${fmtTime(nextPass.appear!.t, place.tz, lang)}` : passes ? t('live.quickNone') : '…'}
            </span>
          </a>
          <a className="quick-chip" href="#launches">
            <Rocket size={16} />
            <span>
              <small>{t('live.quickLaunch')}</small>
              {upcoming[0] ? <LaunchClock net={upcoming[0].net} /> : '…'}
            </span>
          </a>
          <a className="quick-chip" href="#weather">
            <Zap size={16} />
            <span>
              <small>{t('live.quickKp')}</small>
              {kpNow.data ? `Kp ${fmtNum(kpNow.data.kp, lang, 1)} · ${t(`kp.${kpLevel(kpNow.data.kp)}`)}` : '…'}
            </span>
          </a>
          <a className="quick-chip" href="#people">
            <Users size={16} />
            <span>
              <small>{t('live.quickPeople')}</small>
              {astronauts.data ? t('live.peopleCount', { n: astronauts.data.length }) : '…'}
            </span>
          </a>
        </div>
      </header>

      <section className="section" id="iss">
        {rec ? (
          <IssCard rec={rec} passes={passes} launches={upcoming} />
        ) : (
          <article className="card">
            <p className="muted">{issError ? t('live.error') : t('live.loading')}</p>
          </article>
        )}
      </section>

      <section className="section" id="launches">
        <div className="section-head">
          <p className="eyebrow">{t('launch.eyebrow')}</p>
          <h2>{t('launch.title')}</h2>
        </div>
        <Launches list={upcoming} error={launches.error && !launches.data} stale={launches.stale} />
      </section>

      <section className="section" id="apod">
        <div className="section-head">
          <p className="eyebrow">{t('apod.eyebrow')}</p>
          <h2>{t('apod.title')}</h2>
        </div>
        <ImageOfTheDay />
      </section>

      <section className="section" id="weather">
        <div className="section-head">
          <p className="eyebrow">{t('sw.eyebrow')}</p>
          <h2>{t('sw.title')}</h2>
          <p className="muted">{t('sw.lead')}</p>
        </div>
        <SpaceWeather kpNow={kpNow.data?.kp ?? null} needed={needed} />
      </section>

      <section className="section" id="people">
        <div className="duo">
          <People list={astronauts.data} error={astronauts.error && !astronauts.data} />
          <News />
        </div>
      </section>

      <p className="credits">{t('live.credits')}</p>
    </div>
  );
}

// ------------------------------------------------------------------------------------------

function LaunchClock({ net }: { net: string }) {
  const { lang } = useI18n();
  const now = useNow(1000);
  return <span className="mono">{countdown(Date.parse(net) - now.getTime(), lang)}</span>;
}

const STATUS_KEYS: Record<string, MsgKey> = {
  Go: 'launch.go',
  TBC: 'launch.tbc',
  TBD: 'launch.tbd',
  Hold: 'launch.hold',
  'In Flight': 'launch.inFlight',
};

function Launches({ list, error, stale }: { list: Launch[]; error: boolean; stale: boolean }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const tz = settings.place!.tz;
  if (error) return <p className="muted">{t('live.error')}</p>;
  if (!list.length) return <p className="muted">{t('live.loading')}</p>;
  return (
    <>
      <div className="launch-grid">
        {list.slice(0, 6).map((l) => {
          const exact = l.precision === 'Minute' || l.precision === 'Second' || l.precision === 'Hour';
          const net = new Date(l.net);
          return (
            <article key={l.id} className="card launch-card">
              <div className="launch-img" style={l.image ? { backgroundImage: `url("${l.image}")` } : undefined}>
                <span className={`badge launch-status launch-status--${l.status.replace(/\s/g, '').toLowerCase()}`}>
                  {STATUS_KEYS[l.status] ? t(STATUS_KEYS[l.status]) : l.statusName || l.status}
                </span>
              </div>
              <div className="launch-body">
                <p className="launch-clock">{exact ? <LaunchClock net={l.net} /> : t('launch.planned')}</p>
                <p className="muted small">
                  {exact ? fmtDateTime(net, tz, lang) : new Intl.DateTimeFormat(localeOf(lang), { month: 'long', year: 'numeric', day: l.precision === 'Day' ? 'numeric' : undefined, timeZone: tz }).format(net)}
                  {l.precision === 'Hour' && ` (${t('launch.approx')})`}
                </p>
                <h3>{l.mission || l.name}</h3>
                <p className="launch-rocket">
                  {l.rocket} · {l.provider}
                </p>
                <p className="muted small">
                  {flag(l.country)} {l.location}
                  {l.orbit && l.orbit !== 'N/A' ? ` · ${t('launch.orbit')} ${l.orbit}` : ''}
                </p>
                {l.missionText && (
                  <details className="details">
                    <summary>{t('launch.mission')}</summary>
                    <p className="muted">{l.missionText}</p>
                  </details>
                )}
                {l.links[0] && (
                  <a className="link" href={l.links[0]} target="_blank" rel="noreferrer">
                    {t('launch.more')} <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="note">
        {t('launch.source')}
        {stale && ` ${t('live.stale')}`}
      </p>
    </>
  );
}

function ImageOfTheDay() {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const images = useLive(loadNasaImages, [], 60 * 60_000);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const list = images.data ?? [];
  const a = list[Math.min(index, list.length - 1)];

  return (
    <article className="card apod-card">
      {images.error && !a && <p className="muted apod-body">{t('live.error')}</p>}
      {!a && !images.error && <div className="apod-media apod-media--loading" />}
      {a && (
        <>
          <a className="apod-media" href={a.full} target="_blank" rel="noreferrer">
            <img src={a.image} alt={a.title} loading="lazy" />
          </a>
          <div className="apod-body">
            <div className="apod-nav">
              <button className="icon-btn" onClick={() => setIndex((i) => i + 1)} disabled={index >= list.length - 1} aria-label={t('apod.prev')}>
                <ChevronLeft size={18} />
              </button>
              <span className="muted small">{fmtDay(new Date(a.date), settings.place!.tz, lang)}</span>
              <button className="icon-btn" onClick={() => setIndex((i) => i - 1)} disabled={index === 0} aria-label={t('apod.next')}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h3>{a.title}</h3>
            <p className={`apod-text ${open ? 'is-open' : ''}`}>{a.text}</p>
            <div className="apod-links">
              <button className="link" onClick={() => setOpen((o) => !o)}>
                {open ? t('apod.less') : t('apod.more')}
              </button>
              <a className="link" href={a.link} target="_blank" rel="noreferrer">
                nasa.gov <ExternalLink size={14} />
              </a>
            </div>
            {lang === 'de' && <p className="note">{t('apod.english')}</p>}
          </div>
        </>
      )}
    </article>
  );
}

const SUN_IMAGES = [
  { id: '0171', key: 'sw.sun171' },
  { id: '0304', key: 'sw.sun304' },
  { id: 'HMIIC', key: 'sw.sunHmi' },
] as const;

function SpaceWeather({ kpNow, needed }: { kpNow: number | null; needed: number }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;
  const scales = useLive(loadScales, [], 15 * 60_000);
  const forecast = useLive(loadKpForecast, [], 30 * 60_000);
  const wind = useLive(loadSolarWind, [], 5 * 60_000);
  const [sun, setSun] = useState<(typeof SUN_IMAGES)[number]['id']>('0171');

  const now = Date.now();
  const bins = (forecast.data ?? []).filter((p) => p.t >= now - 24 * 3_600_000 && p.t <= now + 72 * 3_600_000);
  const next24 = bins.filter((p) => p.t >= now - 3 * 3_600_000 && p.t <= now + 24 * 3_600_000);
  const maxKp = next24.length ? Math.max(...next24.map((p) => p.kp)) : null;
  const neededRound = Math.ceil(needed);
  const chance = maxKp == null ? null : maxKp >= needed ? 'likely' : maxKp >= needed - 1 ? 'possible' : 'unlikely';
  const south = place.lat < 0;
  const level = kpNow == null ? 'quiet' : kpLevel(kpNow);

  return (
    <div className="weather-grid">
      <article className={`card kp-card kp-card--${level}`}>
        <p className="card-kicker">{t('sw.kpKicker')}</p>
        <div className="kp-now">
          <strong>{kpNow == null ? '–' : fmtNum(kpNow, lang, 1)}</strong>
          <div>
            <h3>{t(`kp.${level}`)}</h3>
            <p className="muted small">{t('sw.kpExplain')}</p>
          </div>
        </div>
        <div className="kp-scale" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={`kp-step kp-step--${kpLevel(i)} ${kpNow != null && Math.round(kpNow) === i ? 'is-now' : ''}`}>
              {i}
            </span>
          ))}
          <span className="kp-need" style={{ left: `${(Math.min(9, needed) / 9) * 90 + 5}%` }}>
            {t('sw.yourLimit')}
          </span>
        </div>
        <div className={`aurora aurora--${chance ?? 'unknown'}`}>
          <h4>{t('sw.auroraTitle', { place: place.name })}</h4>
          <p>
            {chance ? t(`sw.aurora.${chance}`) : t('live.loading')}{' '}
            {t('sw.auroraNeed', { kp: neededRound, dir: south ? t('sw.south') : t('sw.north') })}
            {maxKp != null && ` ${t('sw.auroraMax', { kp: fmtNum(maxKp, lang, 1) })}`}
          </p>
        </div>
      </article>

      <article className="card kp-chart-card">
        <p className="card-kicker">{t('sw.forecastKicker')}</p>
        <KpChart bins={bins} needed={needed} tz={place.tz} />
        {scales.data && (
          <div className="scales">
            {(['G', 'S', 'R'] as const).map((k) => (
              <div key={k} className={`scale scale--${scales.data!.now[k] > 0 ? 'on' : 'off'}`}>
                <strong>
                  {k}
                  {scales.data!.now[k]}
                </strong>
                <span>{t(`sw.scale${k}`)}</span>
              </div>
            ))}
          </div>
        )}
        <details className="details">
          <summary>{t('details.summary')}</summary>
          <dl className="detail-grid">
            <dt>{t('sw.windSpeed')}</dt>
            <dd>{wind.data?.speed != null ? `${wind.data.speed} km/s` : '–'}</dd>
            <dt>{t('sw.bz')}</dt>
            <dd>{wind.data?.bz != null ? `${fmtNum(wind.data.bz, lang, 0)} nT` : '–'}</dd>
            <dt>{t('sw.flareNow')}</dt>
            <dd>{wind.data?.flareNow ?? '–'}</dd>
            <dt>{t('sw.flareMax')}</dt>
            <dd>{wind.data?.flareMax ? `${wind.data.flareMax} (${fmtTime(new Date(wind.data.flareMaxTime!), place.tz, lang)})` : '–'}</dd>
            <dt>{t('sw.rProb')}</dt>
            <dd>{scales.data?.forecast[0] ? `${scales.data.forecast[0].rMinor ?? 0} % / ${scales.data.forecast[0].rMajor ?? 0} %` : '–'}</dd>
          </dl>
          <p className="muted small">{t('sw.bzExplain')}</p>
        </details>
      </article>

      <article className="card sun-live-card">
        <p className="card-kicker">{t('sw.sunKicker')}</p>
        <div className="segmented sun-tabs" role="radiogroup">
          {SUN_IMAGES.map((s) => (
            <button key={s.id} role="radio" aria-checked={sun === s.id} className={sun === s.id ? 'is-on' : ''} onClick={() => setSun(s.id)}>
              {t(s.key)}
            </button>
          ))}
        </div>
        <img className="sun-img" src={`https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_${sun}.jpg`} alt={t(SUN_IMAGES.find((s) => s.id === sun)!.key)} loading="lazy" />
        <p className="muted small">{t(`sw.sunText${sun}` as MsgKey)}</p>
      </article>

      <article className="card oval-card">
        <p className="card-kicker">{t('sw.ovalKicker')}</p>
        <img
          className="oval-img"
          src={`https://services.swpc.noaa.gov/images/aurora-forecast-${south ? 'southern' : 'northern'}-hemisphere.jpg`}
          alt={t('sw.ovalKicker')}
          loading="lazy"
        />
        <p className="muted small">{t('sw.ovalText')}</p>
      </article>
    </div>
  );
}

function KpChart({ bins, needed, tz }: { bins: KpPoint[]; needed: number; tz: string }) {
  const { t, lang } = useI18n();
  if (!bins.length) return <div className="kp-chart kp-chart--empty muted">{t('live.loading')}</div>;
  const now = Date.now();
  const days: { label: string; from: number }[] = [];
  let lastDay = '';
  bins.forEach((b, i) => {
    const label = fmtDay(new Date(b.t), tz, lang);
    if (label !== lastDay) days.push({ label, from: i });
    lastDay = label;
  });
  return (
    <div className="kp-chart" role="img" aria-label={t('sw.forecastKicker')}>
      <div className="kp-bars">
        <span className="kp-line" style={{ bottom: `${(Math.min(9, needed) / 9) * 100}%` }} />
        {bins.map((b) => {
          const current = now >= b.t && now < b.t + 3 * 3_600_000;
          return (
            <span
              key={b.t}
              className={`kp-bar kp-step--${kpLevel(b.kp)} kp-bar--${b.kind} ${current ? 'is-now' : ''}`}
              style={{ height: `${Math.max(3, (b.kp / 9) * 100)}%` }}
              title={`${fmtDateTime(new Date(b.t), tz, lang)}: Kp ${fmtNum(b.kp, lang, 1)}`}
            />
          );
        })}
      </div>
      <div className="kp-days">
        {days.map((d) => (
          <span key={d.label} style={{ left: `${(d.from / bins.length) * 100}%` }}>
            {d.label}
          </span>
        ))}
      </div>
      <p className="kp-legend muted small">
        <span className="kp-line-key" /> {t('sw.lineLegend')} · {t('sw.barsLegend')}
      </p>
    </div>
  );
}

function People({ list, error }: { list: Astronaut[] | null; error: boolean }) {
  const { t, lang } = useI18n();
  const days = (iso: string) => {
    const m = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?/.exec(iso);
    if (!m) return null;
    return (Number(m[1] ?? 0) * 365 + Number(m[2] ?? 0) * 30 + Number(m[3] ?? 0)) | 0;
  };
  return (
    <article className="card people-card">
      <p className="card-kicker">{t('people.kicker')}</p>
      <h3>{list ? t('people.title', { n: list.length }) : t('people.titleLoading')}</h3>
      {error && <p className="muted">{t('live.error')}</p>}
      <ul className="people-list">
        {(list ?? []).map((a) => {
          const d = days(a.timeInSpace);
          return (
            <li key={a.id}>
              {a.image ? <img src={a.image} alt="" loading="lazy" /> : <span className="avatar-empty" />}
              <div>
                <strong>
                  {flag(a.country)} {a.name}
                </strong>
                <span className="muted small">
                  {a.agency}
                  {d ? ` · ${t('people.days', { n: d.toLocaleString(localeOf(lang)) })}` : ''}
                </span>
              </div>
              {a.wiki && (
                <a href={a.wiki} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Wikipedia">
                  <ArrowRight size={16} />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function News() {
  const { t } = useI18n();
  const news = useLive(loadNews, [], 20 * 60_000);
  const rel = useRelative();
  return (
    <article className="card news-card">
      <p className="card-kicker">{t('news.kicker')}</p>
      <h3>{t('news.title')}</h3>
      {news.error && !news.data && <p className="muted">{t('live.error')}</p>}
      <ul className="news-list">
        {(news.data ?? []).slice(0, 8).map((n) => (
          <li key={n.id}>
            <a href={n.url} target="_blank" rel="noreferrer">
              {n.image && <img src={n.image} alt="" loading="lazy" />}
              <div>
                <span className="muted small">
                  {n.site} · {rel(n.published)}
                </span>
                <strong>{n.title}</strong>
                <span className="news-summary muted">{n.summary}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <p className="note">{t('news.english')}</p>
    </article>
  );
}
