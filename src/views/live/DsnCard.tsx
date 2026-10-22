import { useMemo } from 'react';
import { ArrowDown, ArrowUp, Radio } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useLive } from '../../lib/live/useLive';
import { craftName, loadDsn, loadDsnConfig, type DsnLink, type DsnSite } from '../../lib/live/dsn';
import { fmtKm, fmtLightTime, fmtRate, fmtTime } from '../../lib/format';

const SITES: { id: DsnSite; tz: string; flag: string }[] = [
  { id: 'gdscc', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'mdscc', tz: 'Europe/Madrid', flag: '🇪🇸' },
  { id: 'cdscc', tz: 'Australia/Sydney', flag: '🇦🇺' },
];

/** Deep Space Network live: die drei Antennen-Standorte und wer gerade mit wem funkt */
export function DsnCard() {
  const { t, lang } = useI18n();
  const cfg = useLive(loadDsnConfig, []);
  const dsn = useLive(loadDsn, [], 20_000);
  const config = cfg.data;
  const links = dsn.data?.links ?? [];

  // Pro Sonde nur eine Zeile je Standort (Arrays aus mehreren Antennen zusammenfassen)
  const bySite = useMemo(() => {
    const m = new Map<DsnSite, DsnLink[][]>();
    for (const s of SITES) {
      const groups = new Map<string, DsnLink[]>();
      for (const l of links.filter((x) => x.site === s.id)) groups.set(l.craft, [...(groups.get(l.craft) ?? []), l]);
      m.set(s.id, [...groups.values()]);
    }
    return m;
  }, [links]);

  const crafts = new Set(links.map((l) => l.craft));
  const farthest = links.filter((l) => l.rangeKm).sort((a, b) => b.rangeKm! - a.rangeKm!)[0];

  return (
    <article className="card dsn-card">
      <p className="card-kicker">
        <span className="live-dot" /> {t('dsn.kicker')}
      </p>
      <h3>{dsn.data ? t('dsn.title', { dishes: new Set(links.map((l) => l.dish)).size, crafts: crafts.size }) : t('live.loading')}</h3>
      <p className="muted small">{t('dsn.lead')}</p>
      {dsn.error && !dsn.data && <p className="muted">{t('live.error')}</p>}

      {farthest && (
        <p className="dsn-far">
          <Radio size={16} />
          <span>
            {t('dsn.farthest', {
              craft: craftName(config, farthest.craft),
              dist: fmtKm(farthest.rangeKm!, lang),
              time: fmtLightTime((farthest.rtlt ?? (2 * farthest.rangeKm!) / 299_792.458) / 2, lang),
            })}
          </span>
        </p>
      )}

      <div className="dsn-sites">
        {SITES.map((s) => (
          <section key={s.id} className="dsn-site">
            <h4>
              {s.flag} {t(`dsn.site.${s.id}`)}
              <span className="muted small">{fmtTime(new Date(), s.tz, lang)}</span>
            </h4>
            <ul>
              {(bySite.get(s.id) ?? []).map((group) => {
                const l = group[0];
                const rate = Math.max(...group.map((g) => g.rate));
                const dishes = group.map((g) => g.dish.replace('DSS', 'DSS ')).join(' + ');
                const size = config?.dishes[l.dish]?.type.replace(/M.*$/, ' m') ?? '';
                return (
                  <li key={l.craft}>
                    <strong>{craftName(config, l.craft)}</strong>
                    <span className="dsn-meta">
                      {group.some((g) => g.up) && <ArrowUp size={13} aria-label={t('dsn.up')} />}
                      {group.some((g) => g.down) && <ArrowDown size={13} aria-label={t('dsn.down')} />}
                      {rate > 0 && <span>{fmtRate(rate, lang)}</span>}
                      {l.rangeKm != null && <span>{fmtKm(l.rangeKm, lang)}</span>}
                    </span>
                    <span className="dsn-dish muted small">
                      {dishes}
                      {size && ` · ${size}`} · {l.band}-Band
                    </span>
                  </li>
                );
              })}
              {dsn.data && !(bySite.get(s.id) ?? []).length && <li className="muted small">{t('dsn.idle')}</li>}
            </ul>
          </section>
        ))}
      </div>
      <p className="note">{t('dsn.source')}</p>
    </article>
  );
}
