import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../state/settings';
import { loadSatellites, SAT_GROUPS, type Sat, type SatGroup } from '../../lib/live/satellites';
import { fmtInt, fmtNum } from '../../lib/format';
import { GROUP_COLORS, SatEngine, type SatPick } from './satEngine';

/** Die Satellitenwolke um die Erde (wird erst auf Knopfdruck geladen) */
export default function SatCloud() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<SatEngine | null>(null);
  const [sats, setSats] = useState<Sat[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [pick, setPick] = useState<SatPick | null>(null);
  const [hidden, setHidden] = useState<Set<SatGroup>>(new Set());

  useEffect(() => {
    let alive = true;
    loadSatellites((p) => alive && setProgress(p)).then(
      (c) => alive && setSats(c.sats),
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!sats || !host.current) return;
    const e = new SatEngine(host.current, sats, { lat: place.lat, lon: place.lon }, setPick);
    engine.current = e;
    return () => {
      e.dispose();
      engine.current = null;
    };
  }, [sats, place.lat, place.lon]);

  const counts = useMemo(() => {
    const m = new Map<SatGroup, number>();
    for (const s of sats ?? []) m.set(s.group, (m.get(s.group) ?? 0) + 1);
    return m;
  }, [sats]);

  const toggle = (g: SatGroup) => {
    const next = new Set(hidden);
    if (next.has(g)) next.delete(g);
    else next.add(g);
    setHidden(next);
    engine.current?.setVisible(g, !next.has(g));
  };

  return (
    <div className="satcloud">
      <div className="sat-stage" ref={host}>
        {!sats && (
          <div className="sat-loading">
            {error ? t('live.error') : `${t('sats.loading')} ${progress ? `${Math.round(progress * 100)} %` : ''}`}
          </div>
        )}
        {pick && (
          <div className="sat-pick card">
            <button className="icon-btn" onClick={() => engine.current?.select(null)} aria-label={t('common.close')}>
              <X size={16} />
            </button>
            <p className="card-kicker" style={{ color: GROUP_COLORS[pick.sat.group] }}>
              {t(`sats.group.${pick.sat.group}`)}
            </p>
            <strong>{pick.sat.name}</strong>
            <p className="muted small">
              {t('sats.pickInfo', { alt: fmtInt(pick.altKm, lang), speed: fmtNum(pick.speedKms * 3600, lang, 0) })}
            </p>
            <p className="muted small">NORAD {pick.sat.id}</p>
          </div>
        )}
      </div>
      {sats && (
        <>
          <p className="muted small">{t('sats.total', { n: fmtInt(sats.length, lang) })}</p>
          <div className="sat-legend">
            {SAT_GROUPS.filter((g) => counts.get(g)).map((g) => (
              <button key={g} className={`chip ${hidden.has(g) ? '' : 'is-on'}`} onClick={() => toggle(g)} aria-pressed={!hidden.has(g)}>
                <span className="sat-dot" style={{ background: GROUP_COLORS[g] }} />
                {t(`sats.group.${g}`)} <span className="muted">{fmtInt(counts.get(g)!, lang)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
