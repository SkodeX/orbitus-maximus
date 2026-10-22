import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Download, Eclipse, Moon, Orbit, Rocket, Sparkles, Sun, Telescope } from 'lucide-react';
import { useI18n, type I18n, type MsgKey } from '../../i18n';
import { useSettings } from '../../state/settings';
import { observerOf } from '../../lib/astro';
import { skyEvents, type EventCategory, type SkyEvent } from '../../lib/observe/events';
import { SHOWERS } from '../../lib/meteors';
import { readCache } from '../../lib/live/cache';
import type { Launch } from '../../lib/live/feeds';
import { buildIcs, saveFile, type IcsEvent } from '../../lib/ics';
import { fmtDateTime, fmtInt, fmtMag, fmtNum, fmtWeekday } from '../../lib/format';
import { ToolHead } from './ObserveView';

type Cat = EventCategory | 'launch';
const CATS: Cat[] = ['moon', 'meteors', 'eclipse', 'planets', 'conjunction', 'season', 'launch'];
const ICONS: Record<Cat, typeof Moon> = { moon: Moon, meteors: Sparkles, eclipse: Eclipse, planets: Orbit, conjunction: Telescope, season: Sun, launch: Rocket };

interface Item extends Omit<SkyEvent, 'category'> {
  category: Cat;
  title?: string;
}

/** Titel eines Ereignisses in der gewählten Sprache */
function titleOf(e: Item, { t, lang }: I18n) {
  if (e.title) return e.title;
  const v: Record<string, string | number> = { ...e.vars };
  for (const k of ['planet', 'a', 'b']) if (typeof v[k] === 'string') v[k] = t(`body.${v[k]}` as MsgKey);
  if (typeof v.kind === 'string') v.kind = t(`ecl.kind.${v.kind}` as MsgKey);
  // Zahlen in der Schreibweise der Sprache (1,0° bzw. 1.0°)
  if (typeof v.deg === 'number') v.deg = fmtNum(v.deg, lang, 1);
  if (typeof v.mag === 'number') v.mag = fmtMag(v.mag, lang);
  if (typeof v.km === 'number') v.km = fmtInt(v.km, lang);
  if (typeof v.id === 'string') {
    const s = SHOWERS.find((x) => x.id === v.id);
    v.name = s ? s[lang] : String(v.id);
  }
  if (e.key.startsWith('ev.season.') && v.south) return t(`${e.key}South` as MsgKey);
  return t(e.key as MsgKey, v);
}

export function CalendarPage() {
  const i18n = useI18n();
  const { t, lang } = i18n;
  const { settings } = useSettings();
  const place = settings.place!;
  const [events, setEvents] = useState<Item[] | null>(null);
  const [off, setOff] = useState<Set<Cat>>(new Set());

  // Die Rechnung dauert einen Moment – erst nach dem ersten Zeichnen starten
  useEffect(() => {
    const id = window.setTimeout(() => {
      const list: Item[] = skyEvents(new Date(), 12, observerOf(place));
      const launches = readCache<Launch[]>('launches.v2')?.data ?? [];
      for (const l of launches) {
        if (Date.parse(l.net) < Date.now() || !['Minute', 'Second', 'Hour'].includes(l.precision)) continue;
        list.push({
          id: `launch-${l.id}`,
          category: 'launch',
          start: new Date(l.net),
          key: '',
          vars: {},
          title: `${t('ev.launch')}: ${l.mission || l.name} (${l.rocket})`,
          link: '#/live',
        });
      }
      setEvents(list.sort((a, b) => a.start.getTime() - b.start.getTime()));
    }, 30);
    return () => window.clearTimeout(id);
  }, [place.lat, place.lon, t]);

  const shown = useMemo(() => (events ?? []).filter((e) => !off.has(e.category)), [events, off]);
  const months = useMemo(() => {
    const m = new Map<string, Item[]>();
    const f = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric', timeZone: place.tz });
    for (const e of shown) {
      const k = f.format(e.start);
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return [...m.entries()];
  }, [shown, lang, place.tz]);

  const toIcs = (list: Item[]): IcsEvent[] =>
    list.map((e) => ({
      uid: e.id,
      start: e.start,
      end: e.end,
      title: titleOf(e, i18n),
      description: t('ev.icsNote', { place: place.name }),
      url: e.link ? `https://skodex.github.io/orbitus-maximus/${e.link}` : undefined,
    }));
  const exportAll = () => saveFile(buildIcs(toIcs(shown)), 'orbitus-himmelskalender.ics', 'text/calendar');
  const exportOne = (e: Item) => saveFile(buildIcs(toIcs([e])), `${e.id}.ics`, 'text/calendar');

  const toggle = (c: Cat) => {
    const next = new Set(off);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setOff(next);
  };

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.calendar')} title={t('cal.title')} lead={t('cal.lead')}>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={exportAll} disabled={!shown.length}>
            <Download size={18} /> {t('cal.exportAll', { n: shown.length })}
          </button>
        </div>
      </ToolHead>

      <div className="filter-chips cal-filters">
        {CATS.map((c) => {
          const Icon = ICONS[c];
          return (
            <button key={c} className={`chip ${off.has(c) ? '' : 'is-on'}`} onClick={() => toggle(c)} aria-pressed={!off.has(c)}>
              <Icon size={13} /> {t(`cal.cat.${c}`)}
            </button>
          );
        })}
      </div>

      {!events && <p className="muted">{t('cal.computing')}</p>}

      {months.map(([month, list]) => (
        <section key={month} className="section cal-month">
          <h2 className="lexicon-cat">{month}</h2>
          <ul className="cal-list">
            {list.map((e) => {
              const Icon = ICONS[e.category];
              return (
                <li key={e.id} className="card cal-item">
                  <span className={`cal-icon cal-icon--${e.category}`}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <span className="muted small">{e.category === 'meteors' || e.category === 'season' ? fmtWeekday(e.start, place.tz, lang) : fmtDateTime(e.start, place.tz, lang)}</span>
                    {e.link ? (
                      <a href={e.link}>
                        <strong>{titleOf(e, i18n)}</strong>
                      </a>
                    ) : (
                      <strong>{titleOf(e, i18n)}</strong>
                    )}
                  </div>
                  <button className="icon-btn" onClick={() => exportOne(e)} aria-label={t('cal.addOne')} title={t('cal.addOne')}>
                    <CalendarPlus size={17} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="note">{t('cal.note')}</p>
    </div>
  );
}
