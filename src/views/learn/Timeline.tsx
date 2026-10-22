import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { TIMELINE } from '../../learn/timeline';
import { ARTICLES } from '../../learn/articles';
import type { TimelineCategory } from '../../learn/types';
import { localeOf } from '../../lib/format';

const CATS: TimelineCategory[] = ['humans', 'moon', 'planets', 'telescopes', 'stations'];

export function Timeline() {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<TimelineCategory | 'all'>('all');

  const events = useMemo(() => TIMELINE.filter((e) => cat === 'all' || e.category === cat), [cat]);
  const fmt = (date: string) => {
    const [y, m, d] = date.split('-').map(Number);
    const opts: Intl.DateTimeFormatOptions = d ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' } : { month: 'long', year: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat(localeOf(lang), opts).format(new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)));
  };
  const first = TIMELINE[0]?.date.slice(0, 4);
  const sinceSputnik = first ? new Date().getUTCFullYear() - Number(first) : 0;

  // Nach Jahrzehnten gruppieren
  const decades = new Map<number, typeof events>();
  for (const e of events) {
    const dec = Math.floor(Number(e.date.slice(0, 4)) / 10) * 10;
    decades.set(dec, [...(decades.get(dec) ?? []), e]);
  }

  return (
    <div className="page learn">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('learn.timeline')}</h1>
        <p className="lead muted">{t('learn.timelineLead', { n: sinceSputnik })}</p>
      </header>

      <div className="filter-chips timeline-filter">
        {(['all', ...CATS] as const).map((c) => (
          <button key={c} className={`chip ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(c)}>
            {c !== 'all' && <span className={`tl-dot tl-dot--${c}`} />}
            {c === 'all' ? t('learn.all') : t(`learn.tl.${c}`)}
          </button>
        ))}
      </div>

      <ol className="history">
        {[...decades.entries()].map(([dec, list]) => (
          <li key={dec} className="history-decade">
            <h2 className="history-year">{t('learn.decade', { n: dec })}</h2>
            <ol>
              {list.map((e) => {
                const art = e.article ? ARTICLES.find((a) => a.id === e.article) : null;
                return (
                  <li key={e.id} className={`history-item history-item--${e.category}`}>
                    <span className={`tl-dot tl-dot--${e.category}`} aria-hidden="true" />
                    <div className="card history-card">
                      <p className="history-date">
                        {fmt(e.date)} · <span className="muted">{e.agency}</span>
                      </p>
                      <h3>{e[lang].title}</h3>
                      <p className="muted">{e[lang].text}</p>
                      {art && (
                        <a className="link" href={`#/wissen/lexikon/${art.id}`}>
                          {art[lang].title} <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
