import * as A from 'astronomy-engine';
import type { ReactNode } from 'react';
import { BookMarked } from 'lucide-react';
import { BODIES, AU_KM, constellationAt, observerOf, positionOf, type RiseSetInfo } from '../../lib/astro';
import { SHOWERS } from '../../lib/meteors';
import { compassLong, fmtDec, fmtDeg, fmtEventTime, fmtInt, fmtMag, fmtNum, fmtRA } from '../../lib/format';
import { useSettings } from '../../state/settings';
import { useI18n, type I18n } from '../../i18n';
import type { SkyData, SkyObject } from '../../sky/engine';
import consNames from '../../data/constellation-names.json';

const DSO_TYPE: Record<string, string> = {
  s: 'galaxySpiral',
  e: 'galaxyElliptical',
  i: 'galaxyIrregular',
  oc: 'openCluster',
  gc: 'globularCluster',
  pn: 'planetaryNebula',
  sfr: 'nebula',
  rn: 'reflectionNebula',
  snr: 'supernovaRemnant',
  pos: 'starField',
};

/** Bayer-/Flamsteed-Bezeichnung mit lateinischem Genitiv, z. B. „ν Orionis“ */
function designation(n: SkyData['starNames'][string] | undefined, data: SkyData) {
  if (!n?.b) return '';
  const gen = data.constellations.find((c) => c.id === n.c)?.gen ?? n.c;
  return `${n.b} ${gen}`;
}

export function objectName(obj: SkyObject, data: SkyData, { t, lang }: I18n): string {
  switch (obj.kind) {
    case 'body':
      return t(`body.${obj.id}`);
    case 'star': {
      const s = data.stars[obj.index];
      const n = data.starNames[s[4]];
      return n?.n || designation(n, data) || `HIP ${s[4]}`;
    }
    case 'dso': {
      const m = data.messier[obj.index];
      const name = lang === 'de' ? m.de : m.en;
      return name ? `${m.id} · ${name}` : m.id;
    }
    case 'constellation': {
      const c = data.constellations[obj.index];
      return lang === 'de' ? c.de : c.la;
    }
    case 'meteor': {
      const s = SHOWERS.find((x) => x.id === obj.id);
      return s ? (lang === 'de' ? s.de : s.en) : obj.id;
    }
    case 'point':
      return obj.label;
    case 'iss':
      return 'ISS';
  }
}

function starColor(bv: number, t: I18n['t']) {
  if (bv < -0.1) return t('color.blue');
  if (bv < 0.3) return t('color.white');
  if (bv < 0.8) return t('color.yellow');
  if (bv < 1.4) return t('color.orange');
  return t('color.red');
}

/** Auf-/Untergang passend zur Situation: steht das Objekt, zeigt es den letzten Aufgang und den nächsten Untergang */
function riseSetAround(body: A.Body, obs: A.Observer, time: Date, up: boolean): RiseSetInfo {
  const rise = up ? A.SearchRiseSet(body, obs, +1, time, -1.05)?.date ?? null : A.SearchRiseSet(body, obs, +1, time, 1.05)?.date ?? null;
  const set = A.SearchRiseSet(body, obs, -1, up ? time : (rise ?? time), 1.05)?.date ?? null;
  const ha = A.SearchHourAngle(body, obs, 0, rise ?? time, +1);
  return { rise, set, transit: { time: ha.time.date, alt: ha.hor.altitude } };
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

export function InfoPanel({ obj, data, time }: { obj: SkyObject; data: SkyData; time: Date }) {
  const { settings } = useSettings();
  const i18n = useI18n();
  const { t, lang } = i18n;
  const place = settings.place!;
  const tz = place.tz;
  const obs = observerOf(place);
  const conName = (id: string) => (consNames as Record<string, { de: string; en: string }>)[id]?.[lang] ?? id;

  // Position und Kennwerte je nach Objektart
  let type = '';
  let raHours = 0;
  let dec = 0;
  let az = 0;
  let alt = 0;
  let mag: number | null = null;
  let body: A.Body = A.Body.Star1;
  const extra: [string, ReactNode][] = [];
  let text: string | null = null;

  const fixed = (raDeg: number, decDeg: number) => {
    raHours = raDeg / 15;
    dec = decDeg;
    A.DefineStar(A.Body.Star1, raHours, decDeg, 1000);
    body = A.Body.Star1;
    const eq = A.Equator(body, time, obs, true, true);
    const hor = A.Horizon(time, obs, eq.ra, eq.dec, 'normal');
    az = hor.azimuth;
    alt = hor.altitude;
  };

  switch (obj.kind) {
    case 'body': {
      body = BODIES[obj.id];
      const p = positionOf(obj.id, time, obs);
      ({ az, alt } = p);
      raHours = p.raJ2000;
      dec = p.decJ2000;
      const ill = A.Illumination(body, time);
      mag = ill.mag;
      type = obj.id === 'sun' ? t('type.star') : obj.id === 'moon' ? t('type.moon') : t('type.planet');
      const km = p.distAu * AU_KM;
      extra.push([t('details.distance'), obj.id === 'moon' ? `${fmtInt(km, lang)} km` : `${fmtNum(p.distAu, lang, 3)} AE · ${fmtInt(km / 1e6, lang)} ${t('unit.mioKm')}`]);
      if (obj.id !== 'sun') extra.push([t('details.illum'), `${Math.round(ill.phase_fraction * 100)} %`]);
      text = t(`about.${obj.id}`);
      break;
    }
    case 'star': {
      const [ra, d, m, bv, hip] = data.stars[obj.index];
      fixed(ra, d);
      mag = m;
      type = t('type.star');
      const n = data.starNames[hip];
      if (n?.n && n.b) extra.push([t('info.designation'), designation(n, data)]);
      extra.push([t('info.color'), starColor(bv, t)]);
      extra.push([t('info.catalog'), `HIP ${hip}`]);
      break;
    }
    case 'dso': {
      const m = data.messier[obj.index];
      fixed(m.ra, m.dec);
      mag = m.mag;
      type = t(`dso.${DSO_TYPE[m.type] ?? 'starField'}` as 'dso.nebula');
      extra.push([t('info.catalog'), `${m.id} · ${m.ngc}`]);
      if (m.dim) extra.push([t('info.size'), `${m.dim.replace('x', ' × ')}′`]);
      break;
    }
    case 'constellation': {
      const c = data.constellations[obj.index];
      fixed(c.ra, c.dec);
      type = t('type.constellation');
      extra.push([t('info.latin'), `${c.la} (${c.id})`]);
      break;
    }
    case 'meteor': {
      const s = SHOWERS.find((x) => x.id === obj.id)!;
      fixed(s.ra, s.dec);
      type = t('type.meteor');
      const md = (x: [number, number]) => `${x[1]}.${x[0]}.`;
      extra.push([t('info.active'), `${md(s.start)} – ${md(s.end)}`]);
      extra.push([t('info.peak'), md(s.peak)]);
      extra.push([t('info.zhr'), `${s.zhr}`]);
      extra.push([t('info.parent'), s.parent]);
      text = t('about.meteor');
      break;
    }
    case 'point':
      fixed(obj.ra, obj.dec);
      type = t('type.target');
      break;
  }

  const up = alt > 0;
  const rs = riseSetAround(body, obs, time, up);
  const con = constellationAt(raHours, dec);

  return (
    <div className="info">
      <p className="info-type">
        {type}
        {obj.kind !== 'constellation' && ` · ${t('planet.in', { con: conName(con) })}`}
      </p>
      <p className={`info-pos ${up ? 'is-up' : 'is-down'}`}>
        {up ? t('info.up', { dir: compassLong(az, lang), alt: Math.round(alt) }) : t('info.down')}
      </p>
      {text && <p className="muted">{text}</p>}
      <dl className="detail-grid">
        {mag != null && <Row label={t('details.mag')}>{fmtMag(mag, lang)}</Row>}
        {rs.rise || rs.set ? (
          <>
            <Row label={t('planet.rise')}>{fmtEventTime(rs.rise, time, tz, lang)}</Row>
            <Row label={t('planet.set')}>{fmtEventTime(rs.set, time, tz, lang)}</Row>
          </>
        ) : (
          <Row label={t('info.visibility')}>{rs.transit && rs.transit.alt > 0 ? t('info.circumpolar') : t('info.neverRises')}</Row>
        )}
        <Row label={t('planet.transit')}>{rs.transit ? `${fmtEventTime(rs.transit.time, time, tz, lang)} · ${Math.round(rs.transit.alt)}°` : '–'}</Row>
        {extra.map(([k, v]) => (
          <Row key={k} label={k}>
            {v}
          </Row>
        ))}
      </dl>
      <a className="link" href={`#/tagebuch/neu?obj=${encodeURIComponent(objectName(obj, data, i18n))}&t=${time.getTime()}`}>
        <BookMarked size={15} /> {t('diary.addFromSky')}
      </a>
      <details className="details">
        <summary>{t('details.summary')}</summary>
        <dl className="detail-grid">
          <Row label={t('details.azAlt')}>
            {fmtDeg(az)} / {fmtNum(alt, lang, 1)}°
          </Row>
          <Row label={t('details.raDecJ2000')}>
            {fmtRA(raHours)} / {fmtDec(dec)}
          </Row>
        </dl>
      </details>
    </div>
  );
}

InfoPanel.Title = function Title({ obj, data }: { obj: SkyObject; data: SkyData }) {
  const i18n = useI18n();
  return <>{objectName(obj, data, i18n)}</>;
};
