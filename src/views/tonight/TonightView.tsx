import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Binoculars, BookMarked, Cloud, Eye, MapPin, Sparkles, Sunrise, Sunset, Telescope } from 'lucide-react';
import { useSettings } from '../../state/settings';
import { useI18n, type MsgKey } from '../../i18n';
import { useNow } from '../../lib/useNow';
import { skyState, rateConditions, AU_KM, type Equipment, type PlanetReport, type Night } from '../../lib/astro';
import {
  compass,
  compassLong,
  fmtDay,
  fmtDec,
  fmtDeg,
  fmtDuration,
  fmtEventTime,
  fmtInt,
  fmtMag,
  fmtNum,
  fmtRA,
  fmtTime,
  fmtWeekday,
} from '../../lib/format';
import { cloudAverage, cloudHours, fetchClouds, seeingScore, transparencyScore, type CloudForecast } from '../../lib/weather';
import { ToolStrip } from './ToolStrip';

// „Heute in der Raumfahrtgeschichte“ bringt einen großen Datensatz mit – erst nachladen
const OnThisDay = lazy(() => import('./OnThisDay').then((m) => ({ default: m.OnThisDay })));
import { PlanetGlyph } from '../../components/PlanetGlyph';
import { MoonPhase } from '../../components/MoonPhase';
import { NightTimeline } from './NightTimeline';
import { buildReport, type TonightReport } from './buildReport';
import consNames from '../../data/constellation-names.json';

const EYE_ICON: Record<Equipment, typeof Eye> = { naked: Eye, binoculars: Binoculars, telescope: Telescope };

export function TonightView() {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;
  const now = useNow(30_000);
  // Ephemeriden alle fünf Minuten neu berechnen, nicht bei jedem Tick
  const refreshKey = Math.floor(now.getTime() / (5 * 60_000));
  const report = useMemo(() => buildReport(place, new Date()), [place, refreshKey]);

  const [clouds, setClouds] = useState<CloudForecast | null>(null);
  const [cloudError, setCloudError] = useState(false);
  useEffect(() => {
    let alive = true;
    setClouds(null);
    setCloudError(false);
    fetchClouds(place.lat, place.lon)
      .then((c) => alive && setClouds(c))
      .catch(() => alive && setCloudError(true));
    return () => {
      alive = false;
    };
  }, [place.lat, place.lon]);

  const { night, moon } = report;
  const darkFrom = night.darkFrom ?? night.sunset ?? night.from;
  const darkTo = night.darkTo ?? night.sunrise ?? night.to;
  const cloudAvg = clouds ? cloudAverage(clouds, darkFrom, darkTo) : null;
  const rating = rateConditions(night, moon, cloudAvg);
  // Luftruhe und Durchsicht in den dunklen Stunden (Schätzung aus den Wetterdaten)
  const avgOf = (fn: (f: CloudForecast, i: number) => number | null) => {
    if (!clouds) return null;
    const v = cloudHours(clouds, darkFrom, darkTo)
      .map((h) => fn(clouds, h.i))
      .filter((x): x is number => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  const seeing = avgOf(seeingScore);
  const transp = avgOf(transparencyScore);
  const tz = place.tz;
  const conName = (id: string) => (consNames as Record<string, { de: string; en: string }>)[id]?.[lang] ?? id;

  return (
    <div className="page tonight">
      <Hero report={report} now={now} />

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">{t('tonight.overviewEyebrow')}</p>
          <h2>{t('tonight.overviewTitle')}</h2>
        </div>
        <div className="overview">
          <article className={`card conditions conditions--${rating.level}`}>
            <p className="card-kicker">{t('conditions.kicker')}</p>
            <div className="conditions-top">
              <ScoreRing score={rating.score} />
              <div>
                <h3 className="conditions-level">{t(`conditions.${rating.level}`)}</h3>
                <p className="muted">{t(`conditions.${rating.level}Text`)}</p>
              </div>
            </div>
            <dl className="stat-list">
              <div>
                <dt>
                  <Cloud size={15} /> {t('conditions.clouds')}
                </dt>
                <dd>
                  {cloudError ? t('conditions.cloudsError') : cloudAvg == null ? t('conditions.cloudsLoading') : `${Math.round(cloudAvg)} %`}
                </dd>
              </div>
              {seeing != null && transp != null && (
                <div>
                  <dt>{t('conditions.seeing')}</dt>
                  <dd>
                    <a href="#/beobachten/wetter">
                      {fmtNum(seeing, lang, 1)} / {fmtNum(transp, lang, 1)}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt>{t('conditions.moon')}</dt>
                <dd>
                  {Math.round(moon.illum * 100)} % ·{' '}
                  {moon.upInDark == null
                    ? '–'
                    : moon.upInDark < 0.05
                      ? t('conditions.moonDown')
                      : moon.upInDark > 0.95
                        ? t('conditions.moonAllNight')
                        : t('conditions.moonPart', { pct: Math.round(moon.upInDark * 100) })}
                </dd>
              </div>
              <div>
                <dt>{t('conditions.dark')}</dt>
                <dd>
                  {night.darkFrom && night.darkTo
                    ? `${fmtTime(night.darkFrom, tz, lang)} – ${fmtTime(night.darkTo, tz, lang)}`
                    : t('conditions.noDark')}
                </dd>
              </div>
            </dl>
            {night.darkKind === 'nautical' && <p className="note">{t('conditions.nauticalOnly')}</p>}
          </article>

          <article className="card timeline-card">
            <p className="card-kicker">{t('timeline.kicker')}</p>
            <NightTimeline night={night} planets={report.planets} moon={moon} clouds={clouds} now={now} tz={tz} />
          </article>
        </div>
      </section>

      <ToolStrip />

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">{t('planets.eyebrow')}</p>
          <h2>{t('planets.title')}</h2>
          <p className="muted">{t('planets.lead')}</p>
        </div>
        <div className="planet-grid">
          {sortPlanets(report.planets, now).map((p) => (
            <PlanetCard key={p.id} p={p} night={night} now={now} conName={conName} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="duo">
          <MoonCard report={report} conName={conName} />
          <SunCard night={night} />
        </div>
      </section>

      <section className="section">
        <div className="duo">
          <MeteorCard report={report} />
          <TipsCard report={report} />
        </div>
      </section>

      <Suspense fallback={null}>
        <OnThisDay />
      </Suspense>

      <p className="credits">{t('tonight.credits')}</p>
    </div>
  );
}

// -------------------------------------------------------------------------------------------

function Hero({ report, now }: { report: TonightReport; now: Date }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;
  const tz = place.tz;
  const { night } = report;
  const sunAlt = report.night.samples.reduce((best, s) => (Math.abs(s.t - now.getTime()) < Math.abs(best.t - now.getTime()) ? s : best)).sunAlt;
  const state = skyState(sunAlt);
  const until = (d: Date | null) => (d ? fmtDuration(d.getTime() - now.getTime(), lang) : '');

  let status: string;
  if (night.kind === 'polarDay') status = t('status.polarDay');
  else if (night.kind === 'polarNight') status = t('status.polarNight');
  else if (state === 'day')
    status = night.sunset && now < night.sunset ? t('status.day', { time: fmtTime(night.sunset, tz, lang), in: until(night.sunset) }) : t('status.dayAfter');
  else if (!night.darkFrom) status = t('status.brightNight');
  else if (night.darkFrom && now < night.darkFrom) status = t('status.dusk', { time: fmtTime(night.darkFrom, tz, lang), in: until(night.darkFrom) });
  else if (night.darkTo && now < night.darkTo) status = t('status.dark', { time: fmtTime(night.darkTo, tz, lang) });
  else status = t('status.dawn', { time: fmtTime(night.sunrise, tz, lang) });

  const visibleNow = report.planets.filter((p) => p.windows.some((w) => now >= w.from && now <= w.to));
  const { moon } = report;

  return (
    <header className="hero">
      <a className="hero-moon" href="#/sky?focus=body:moon" aria-label={t('body.moon')}>
        <MoonPhase illum={moon.illum} waxing={moon.waxing} size={260} south={place.lat < 0} />
        <span>
          {t(`phase.${moon.phase}`)} · {Math.round(moon.illum * 100)} %
        </span>
      </a>
      <p className="eyebrow">
        {t('tonight.eyebrow')} · {fmtWeekday(now, tz, lang)}
      </p>
      <h1>
        {t('tonight.titleA')} <span className="grad">{place.name}</span>
      </h1>
      <p className={`hero-status hero-status--${state}`}>
        <span className="pulse" /> {status}
      </p>
      {visibleNow.length > 0 && (
        <p className="hero-sub">
          {t('tonight.visibleNow')} {visibleNow.map((p) => t(`body.${p.id}`)).join(', ')}
        </p>
      )}
      <div className="hero-actions">
        <a className="btn btn-primary" href="#/sky">
          <Sparkles size={18} /> {t('tonight.openSky')}
        </a>
        <a className="btn btn-ghost" href="#/tagebuch/neu">
          <BookMarked size={18} /> {t('diary.logObservation')}
        </a>
        <a className="btn btn-ghost" href="#/settings">
          <MapPin size={18} /> {t('tonight.changePlace')}
        </a>
      </div>
    </header>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg className="score-ring" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r={r} className="score-ring-bg" />
      <circle cx="36" cy="36" r={r} className="score-ring-fg" strokeDasharray={`${(score / 100) * c} ${c}`} />
      <text x="36" y="40" textAnchor="middle">
        {score}
      </text>
    </svg>
  );
}

function planetStatus(p: PlanetReport, now: Date) {
  if (!p.windows.length) return p.elongation < 15 ? 'sun' : 'none';
  if (p.windows.some((w) => now >= w.from && now <= w.to)) return 'now';
  if (now < p.windows[0].from) return 'later';
  if (p.windows.some((w) => now < w.from)) return 'later';
  return 'over';
}

const STATUS_ORDER = { now: 0, later: 1, over: 2, none: 3, sun: 4 };
function sortPlanets(list: PlanetReport[], now: Date) {
  return [...list].sort((a, b) => STATUS_ORDER[planetStatus(a, now)] - STATUS_ORDER[planetStatus(b, now)] || a.mag - b.mag);
}

function PlanetCard({ p, night, now, conName }: { p: PlanetReport; night: Night; now: Date; conName: (id: string) => string }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const tz = settings.place!.tz;
  const status = planetStatus(p, now);
  const nextWindow = p.windows.find((w) => now < w.from) ?? p.windows[0];
  const EyeIcon = EYE_ICON[p.eye];
  const lightMin = (p.distAu * AU_KM) / 299_792.458 / 60;

  let statusText: string;
  if (status === 'now') statusText = t('planet.statusNow', { dir: compass(p.now.az, lang), alt: Math.round(p.now.alt) });
  else if (status === 'later') statusText = t('planet.statusLater', { time: fmtTime(nextWindow.from, tz, lang) });
  else if (status === 'over') statusText = t('planet.statusOver');
  else if (status === 'sun') statusText = t('planet.statusSun');
  else statusText = t('planet.statusNone');

  return (
    <article className={`card planet-card planet-card--${status}`}>
      <header className="planet-head">
        <PlanetGlyph id={p.id} size={46} />
        <div>
          <h3>{t(`body.${p.id}`)}</h3>
          <p className={`status status--${status}`}>{statusText}</p>
        </div>
      </header>

      {p.windows.length > 0 && p.best && (
        <p className="planet-window">
          {t('planet.window', {
            from: fmtTime(p.windows[0].from, tz, lang),
            to: fmtTime(p.windows[p.windows.length - 1].to, tz, lang),
          })}{' '}
          {t('planet.best', { time: fmtTime(p.best.time, tz, lang), alt: Math.round(p.best.alt), dir: compassLong(p.best.az, lang) })}
        </p>
      )}

      <div className="chips">
        <span className="chip">
          <EyeIcon size={14} /> {t(`eye.${p.eye}`)}
        </span>
        <span className="chip">{t('planet.mag', { mag: fmtMag(p.mag, lang) })}</span>
        <span className="chip">{t('planet.in', { con: conName(p.constellation) })}</span>
      </div>

      <dl className="times">
        <div>
          <dt>{t('planet.rise')}</dt>
          <dd>{fmtEventTime(p.rise, night.from, tz, lang)}</dd>
        </div>
        <div>
          <dt>{t('planet.transit')}</dt>
          <dd>{p.transit ? fmtEventTime(p.transit.time, night.from, tz, lang) : '–'}</dd>
        </div>
        <div>
          <dt>{t('planet.set')}</dt>
          <dd>{fmtEventTime(p.set, night.from, tz, lang)}</dd>
        </div>
      </dl>

      <details className="details">
        <summary>{t('details.summary')}</summary>
        <dl className="detail-grid">
          <dt>{t('details.azAlt')}</dt>
          <dd>
            {fmtDeg(p.now.az)} / {fmtNum(p.now.alt, lang, 1)}°
          </dd>
          <dt>{t('details.raDec')}</dt>
          <dd>
            {fmtRA(p.now.ra)} / {fmtDec(p.now.dec)}
          </dd>
          <dt>{t('details.distance')}</dt>
          <dd>
            {fmtNum(p.distAu, lang, 3)} AE · {fmtInt((p.distAu * AU_KM) / 1e6, lang)} {t('unit.mioKm')}
          </dd>
          <dt>{t('details.lightTime')}</dt>
          <dd>{lightMin < 60 ? `${fmtNum(lightMin, lang, 1)} min` : fmtDuration(lightMin * 60_000, lang)}</dd>
          <dt>{t('details.diameter')}</dt>
          <dd>{fmtNum(p.diameterArcsec, lang, 1)}″</dd>
          <dt>{t('details.illum')}</dt>
          <dd>{Math.round(p.illum * 100)} %</dd>
          <dt>{t('details.elongation')}</dt>
          <dd>
            {fmtNum(p.elongation, lang, 1)}° ({t(`details.${p.side}`)})
          </dd>
        </dl>
      </details>

      <a className="link" href={`#/sky?focus=body:${p.id}`}>
        {t('common.showInSky')} <ArrowRight size={15} />
      </a>
    </article>
  );
}

function MoonCard({ report, conName }: { report: TonightReport; conName: (id: string) => string }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const { moon, night } = report;
  const place = settings.place!;
  const tz = place.tz;
  const nexts = (['new', 'firstQuarter', 'full', 'lastQuarter'] as const)
    .map((k) => ({ k, d: moon.next[k] }))
    .sort((a, b) => a.d.getTime() - b.d.getTime());

  return (
    <article className="card moon-card">
      <p className="card-kicker">{t('moon.kicker')}</p>
      <div className="moon-top">
        <MoonPhase illum={moon.illum} waxing={moon.waxing} size={112} south={place.lat < 0} />
        <div>
          <h3>{t(`phase.${moon.phase}`)}</h3>
          <p className="muted">
            {t('moon.illum', { pct: Math.round(moon.illum * 100) })} · {t('planet.in', { con: conName(moon.constellation) })}
          </p>
          <p className="muted">
            {moon.now.alt > 0
              ? t('moon.upNow', { dir: compassLong(moon.now.az, lang), alt: Math.round(moon.now.alt) })
              : t('moon.downNow')}
          </p>
        </div>
      </div>
      <dl className="times">
        <div>
          <dt>{t('planet.rise')}</dt>
          <dd>{fmtEventTime(moon.rise, night.from, tz, lang)}</dd>
        </div>
        <div>
          <dt>{t('planet.transit')}</dt>
          <dd>{moon.transit ? fmtEventTime(moon.transit.time, night.from, tz, lang) : '–'}</dd>
        </div>
        <div>
          <dt>{t('planet.set')}</dt>
          <dd>{fmtEventTime(moon.set, night.from, tz, lang)}</dd>
        </div>
      </dl>
      <ul className="moon-next">
        {nexts.map(({ k, d }) => (
          <li key={k}>
            <span>{t(`phase.${k}`)}</span>
            <strong>{fmtDay(d, tz, lang)}</strong>
          </li>
        ))}
      </ul>
      <details className="details">
        <summary>{t('details.summary')}</summary>
        <dl className="detail-grid">
          <dt>{t('details.distance')}</dt>
          <dd>
            {fmtInt(moon.distKm, lang)} km
          </dd>
          <dt>{t('details.diameter')}</dt>
          <dd>{fmtNum(moon.diameterDeg * 60, lang, 1)}′</dd>
          <dt>{t('details.phaseAngle')}</dt>
          <dd>{fmtNum(moon.phaseAngle, lang, 1)}°</dd>
          <dt>{t('details.mag')}</dt>
          <dd>{fmtMag(moon.mag, lang)}</dd>
        </dl>
      </details>
      <a className="link" href="#/sky?focus=body:moon">
        {t('common.showInSky')} <ArrowRight size={15} />
      </a>
    </article>
  );
}

function SunCard({ night }: { night: Night }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const tz = settings.place!.tz;
  const rows: { key: MsgKey; d: Date | null; icon?: typeof Sunset }[] = [
    { key: 'sun.sunset', d: night.sunset, icon: Sunset },
    { key: 'sun.civilDusk', d: night.civilDusk },
    { key: 'sun.nauticalDusk', d: night.nauticalDusk },
    { key: 'sun.astroDusk', d: night.astroDusk },
    { key: 'sun.astroDawn', d: night.astroDawn },
    { key: 'sun.nauticalDawn', d: night.nauticalDawn },
    { key: 'sun.civilDawn', d: night.civilDawn },
    { key: 'sun.sunrise', d: night.sunrise, icon: Sunrise },
  ];
  const nightLen = night.sunset && night.sunrise ? night.sunrise.getTime() - night.sunset.getTime() : null;
  return (
    <article className="card sun-card">
      <p className="card-kicker">{t('sun.kicker')}</p>
      <h3>{t('sun.title')}</h3>
      <ol className="twilight">
        {rows.map(({ key, d, icon: Icon }) => (
          <li key={key} className={d ? '' : 'is-missing'}>
            <span className="twilight-dot" />
            <span className="twilight-label">
              {Icon && <Icon size={15} />} {t(key)}
            </span>
            <strong>{d ? fmtTime(d, tz, lang) : '–'}</strong>
          </li>
        ))}
      </ol>
      {nightLen && <p className="muted">{t('sun.nightLength', { len: fmtDuration(nightLen, lang) })}</p>}
      <details className="details">
        <summary>{t('sun.explainSummary')}</summary>
        <p className="muted">{t('sun.explain')}</p>
      </details>
    </article>
  );
}

function MeteorCard({ report }: { report: TonightReport }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const tz = settings.place!.tz;
  return (
    <article className="card meteor-card">
      <p className="card-kicker">{t('meteors.kicker')}</p>
      <h3>{t('meteors.title')}</h3>
      <ul className="meteor-list">
        {report.showers.map(({ shower, active, days, radiant }) => (
          <li key={shower.id} className={active ? 'is-active' : ''}>
            <div className="meteor-row">
              <strong>{lang === 'de' ? shower.de : shower.en}</strong>
              <span className={`badge ${days <= 1 ? 'badge--hot' : active ? 'badge--on' : ''}`}>
                {days === 0 ? t('meteors.peakToday') : days === 1 ? t('meteors.peakTomorrow') : t('meteors.peakIn', { days })}
              </span>
            </div>
            <p className="muted">
              {t('meteors.zhr', { zhr: shower.zhr })} · {t('meteors.speed', { v: shower.speed })} · {t('meteors.parent', { p: shower.parent })}
            </p>
            {active && (
              <p className="muted">
                {radiant.alt > 10
                  ? t('meteors.radiantBest', { time: fmtTime(radiant.time, tz, lang), alt: Math.round(radiant.alt), dir: compassLong(radiant.az, lang) })
                  : t('meteors.radiantLow')}
              </p>
            )}
            {active && (
              <a className="link" href={`#/sky?focus=meteor:${shower.id}`}>
                {t('meteors.showRadiant')} <ArrowRight size={15} />
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="note">{t('meteors.note')}</p>
    </article>
  );
}

function TipsCard({ report }: { report: TonightReport }) {
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const tz = settings.place!.tz;
  return (
    <article className="card tips-card">
      <p className="card-kicker">{t('tips.kicker')}</p>
      <h3>{t('tips.title')}</h3>
      {report.tips.length === 0 && <p className="muted">{t('tips.none')}</p>}
      <ul className="tip-list">
        {report.tips.map(({ piece, best }) => {
          const txt = piece[lang];
          const EyeIcon = EYE_ICON[piece.eye];
          const focus = piece.id.startsWith('M') ? `dso:${piece.id}` : `coord:${piece.ra},${piece.dec},${encodeURIComponent(txt.name)}`;
          return (
            <li key={piece.id}>
              <div className="tip-head">
                <strong>{txt.name}</strong>
                <span className="chip">
                  <EyeIcon size={14} /> {t(`eye.${piece.eye}`)}
                </span>
              </div>
              <p className="muted">
                {txt.type} · {txt.text}
              </p>
              <p className="tip-when">
                {t('tips.best', { time: fmtTime(best.time, tz, lang), alt: Math.round(best.alt), dir: compassLong(best.az, lang) })}
                <a className="link" href={`#/sky?focus=${focus}`}>
                  {t('common.showInSky')} <ArrowRight size={15} />
                </a>
              </p>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
