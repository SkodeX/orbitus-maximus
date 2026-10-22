import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../state/settings';
import { ON_THIS_DAY } from '../../learn/onThisDay';
import { localDayKey } from '../../lib/format';

/** „Heute in der Raumfahrtgeschichte“: Ereignisse vom heutigen Kalendertag, sonst vom nächsten Tag mit Eintrag */
export function OnThisDay() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const [shift, setShift] = useState(0);
  const base = new Date(Date.now() + shift * 86_400_000);
  const md = localDayKey(base, settings.place!.tz).slice(5);
  let list = ON_THIS_DAY.filter((e) => e.md === md);
  let shown = md;
  if (!list.length) {
    // Nächster Kalendertag mit Eintrag
    const next = ON_THIS_DAY.find((e) => e.md > md) ?? ON_THIS_DAY[0];
    shown = next.md;
    list = ON_THIS_DAY.filter((e) => e.md === shown);
  }
  const [m, d] = shown.split('-').map(Number);
  const label = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2001, m - 1, d)));
  const year = new Date().getFullYear();

  return (
    <section className="section">
      <article className="card history-card">
        <div className="history-head">
          <p className="card-kicker">
            <History size={14} className="inline-icon" /> {t('history.kicker')}
          </p>
          <div className="history-nav">
            <button className="icon-btn" onClick={() => setShift((s) => s - 1)} aria-label={t('history.prev')}>
              <ChevronLeft size={16} />
            </button>
            <button className="icon-btn" onClick={() => setShift((s) => s + 1)} aria-label={t('history.next')}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <h3>{shift === 0 && shown === md ? t('history.today', { date: label }) : label}</h3>
        <ul className="history-list">
          {list.map((e) => (
            <li key={`${e.year}-${e.en.slice(0, 20)}`}>
              <span className="history-year">
                {e.year}
                <small className="muted">{t('history.ago', { n: year - e.year })}</small>
              </span>
              <span>
                {e[lang]}
                {e.article && (
                  <a className="link small" href={`#/wissen/lexikon/${e.article}`}>
                    {t('history.more')} <ArrowRight size={13} />
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
