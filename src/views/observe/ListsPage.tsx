import { useMemo, useState } from 'react';
import { ArrowRight, BookMarked, Check, Eye, Binoculars, Telescope } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { useSettings } from '../../state/settings';
import { useNow } from '../../lib/useNow';
import { bestFixedAltitude, computeNight, constellationAt, observerOf } from '../../lib/astro';
import { LISTS, type ListObject, type ListObjectType, type ObservingList } from '../../lib/observe/lists';
import { updateProgress, useProgress } from '../../learn/progress';
import { useDiary } from '../../lib/cloud/diary';
import { fmtMag, fmtTime, fold } from '../../lib/format';
import skyData from '../../data/sky.json';
import type { SkyData } from '../../sky/engine';
import consNames from '../../data/constellation-names.json';
import { ToolHead } from './ObserveView';

const sky = skyData as unknown as SkyData;
const DSO_TYPE: Record<string, ListObjectType> = {
  s: 'galaxy',
  e: 'galaxy',
  i: 'galaxy',
  oc: 'open-cluster',
  gc: 'globular',
  pn: 'planetary',
  sfr: 'nebula',
  rn: 'nebula',
  snr: 'supernova-remnant',
  pos: 'asterism',
};

/** Der Messier-Katalog aus den Sternkarten-Daten als fünfte Liste */
const MESSIER: ObservingList = {
  id: 'messier' as ObservingList['id'],
  equipment: 'binoculars',
  de: { title: 'Messier-Katalog', text: 'Die 110 „Nebel“, die Charles Messier im 18. Jahrhundert auflistete, damit man sie nicht mit Kometen verwechselt – heute die klassische Sammlung für Einsteiger.' },
  en: { title: 'Messier catalogue', text: 'The 110 “nebulae” Charles Messier listed in the 18th century so nobody would mistake them for comets – today the classic collection for beginners.' },
  items: sky.messier.map((m) => ({
    id: m.id,
    ra: m.ra,
    dec: m.dec,
    mag: m.mag,
    size: m.dim ? `${m.dim.replace('x', '×')}′` : undefined,
    type: DSO_TYPE[m.type] ?? 'other',
    con: constellationAt(m.ra / 15, m.dec),
    name: { de: m.de || m.ngc, en: m.en || m.ngc },
    desig: m.ngc,
  })),
};

const ALL: ObservingList[] = [LISTS.find((l) => l.id === 'naked-eye')!, LISTS.find((l) => l.id === 'binocular')!, MESSIER, ...LISTS.filter((l) => l.id === 'double-stars' || l.id === 'caldwell')];
const ICON = { eye: Eye, binoculars: Binoculars, telescope: Telescope };

/** Objekte, die schon im Tagebuch stehen (Name, Bezeichnung oder ID passt) */
function useLogged() {
  const entries = useDiary();
  return useMemo(() => new Set(entries.flatMap((e) => e.objects.map((o) => fold(o)))), [entries]);
}
const isLogged = (o: ListObject, logged: Set<string>) =>
  [o.id, o.name.de, o.name.en, o.desig].some((x) => x && (logged.has(fold(x)) || [...logged].some((l) => l.startsWith(fold(x) + ' ') || l.endsWith(' ' + fold(x)))));

export function ListsPage({ listId }: { listId: string | null }) {
  const list = ALL.find((l) => l.id === listId);
  return list ? <ListDetail list={list} /> : <ListOverview />;
}

function ListOverview() {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const logged = useLogged();
  const done = new Set(progress.observed);
  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.lists')} title={t('lists.title')} lead={t('lists.lead')} />
      <div className="tool-grid">
        {ALL.map((l) => {
          const Icon = ICON[l.equipment];
          const n = l.items.filter((o) => done.has(o.id) || isLogged(o, logged)).length;
          return (
            <a key={l.id} className="card tool-card list-card" href={`#/beobachten/listen/${l.id}`}>
              <span className="tool-icon">
                <Icon size={22} />
              </span>
              <span>
                <strong>{l[lang].title}</strong>
                <span className="muted small">{l[lang].text}</span>
                <span className="list-progress" aria-label={t('lists.progress', { n, total: l.items.length })}>
                  <span style={{ width: `${(n / l.items.length) * 100}%` }} />
                </span>
                <span className="muted small">{t('lists.progress', { n, total: l.items.length })}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

type Sort = 'catalog' | 'bright' | 'tonight';

function ListDetail({ list }: { list: ObservingList }) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const place = settings.place!;
  const progress = useProgress();
  const logged = useLogged();
  const now = useNow(10 * 60_000);
  const [onlyVisible, setOnlyVisible] = useState(false);
  const [sort, setSort] = useState<Sort>('catalog');
  const [open, setOpen] = useState<string | null>(null);
  const done = new Set(progress.observed);
  const conName = (id: string) => (consNames as Record<string, { de: string; en: string }>)[id]?.[lang] ?? id;

  // Beste Höhe in der kommenden Nacht
  const best = useMemo(() => {
    const night = computeNight(place, now);
    const from = night.darkFrom ?? night.sunset ?? night.from;
    const to = night.darkTo ?? night.sunrise ?? night.to;
    const obs = observerOf(place);
    return new Map(list.items.map((o) => [o.id, bestFixedAltitude(o.ra, o.dec, from, to, obs)]));
  }, [list, place, Math.floor(now.getTime() / 3_600_000)]);

  let items = list.items.filter((o) => !onlyVisible || (best.get(o.id)?.alt ?? -90) > 20);
  if (sort === 'bright') items = [...items].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  if (sort === 'tonight') items = [...items].sort((a, b) => (best.get(b.id)?.alt ?? -90) - (best.get(a.id)?.alt ?? -90));
  const n = list.items.filter((o) => done.has(o.id) || isLogged(o, logged)).length;

  const toggle = (id: string) =>
    updateProgress((p) => ({ ...p, observed: p.observed.includes(id) ? p.observed.filter((x) => x !== id) : [...p.observed, id] }));

  const focusOf = (o: ListObject) =>
    /^M\d+$/.test(o.id) ? `dso:${o.id}` : `coord:${o.ra},${o.dec},${encodeURIComponent(o.name[lang])}`;

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('lists.title')} title={list[lang].title} lead={list[lang].text}>
        <p className="list-count">
          <strong>{t('lists.progress', { n, total: list.items.length })}</strong>
        </p>
        <span className="list-progress list-progress--big">
          <span style={{ width: `${(n / list.items.length) * 100}%` }} />
        </span>
      </ToolHead>

      <div className="list-tools">
        <label className="toggle">
          <span>{t('lists.onlyVisible')}</span>
          <input type="checkbox" checked={onlyVisible} onChange={(e) => setOnlyVisible(e.target.checked)} />
          <span className="switch" aria-hidden="true" />
        </label>
        <div className="segmented" role="radiogroup" aria-label={t('lists.sort')}>
          {(['catalog', 'bright', 'tonight'] as Sort[]).map((s) => (
            <button key={s} role="radio" aria-checked={sort === s} className={sort === s ? 'is-on' : ''} onClick={() => setSort(s)}>
              {t(`lists.sort.${s}`)}
            </button>
          ))}
        </div>
      </div>

      <ul className="list-items">
        {items.map((o) => {
          const b = best.get(o.id)!;
          const checked = done.has(o.id);
          const inDiary = isLogged(o, logged);
          return (
            <li key={o.id} className={`card list-item ${checked || inDiary ? 'is-done' : ''}`}>
              <button
                className={`list-check ${checked ? 'is-on' : ''}`}
                onClick={() => toggle(o.id)}
                aria-pressed={checked}
                aria-label={t(checked ? 'lists.uncheck' : 'lists.check', { name: o.name[lang] })}
              >
                <Check size={16} />
              </button>
              <div className="list-body">
                <button className="list-title" onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id}>
                  <strong>
                    {o.id !== o.name[lang] && /^[A-Z]\d+$/.test(o.id) ? `${o.id} · ` : ''}
                    {o.name[lang]}
                  </strong>
                  <span className="muted small">
                    {t(`lists.type.${o.type}` as MsgKey)} · {conName(o.con)}
                    {o.mag != null && ` · ${fmtMag(o.mag, lang)} mag`}
                    {o.size && ` · ${o.size}`}
                  </span>
                </button>
                <span className={`list-best small ${b.alt > 20 ? 'is-good' : 'muted'}`}>
                  {b.alt > 0 ? t('lists.best', { time: fmtTime(b.time, place.tz, lang), alt: Math.round(b.alt) }) : t('lists.notTonight')}
                  {inDiary && ` · ${t('lists.inDiary')}`}
                </span>
                {open === o.id && (
                  <div className="list-more">
                    {o.desig && o.desig !== o.name[lang] && <p className="muted small">{o.desig}</p>}
                    {o.tip && <p className="small">{o.tip[lang]}</p>}
                    <div className="btn-row">
                      <a className="link small" href={`#/sky?focus=${focusOf(o)}`}>
                        {t('common.showInSky')} <ArrowRight size={14} />
                      </a>
                      <a className="link small" href={`#/tagebuch/neu?obj=${encodeURIComponent(o.name[lang])}`}>
                        <BookMarked size={14} /> {t('diary.addFromSky')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {!items.length && <p className="muted">{t('lists.noneVisible')}</p>}
    </div>
  );
}
