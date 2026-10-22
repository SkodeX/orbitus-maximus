import { ArrowRight, Camera, CloudMoon, ListChecks, MoonStar, Orbit, Telescope } from 'lucide-react';
import { useI18n } from '../../i18n';

const ITEMS = [
  { href: '#/beobachten/wetter', icon: CloudMoon, key: 'observe.tool.weather' },
  { href: '#/sky?ar=1', icon: Camera, key: 'observe.tool.ar' },
  { href: '#/beobachten/mond', icon: MoonStar, key: 'observe.tool.moon' },
  { href: '#/beobachten/listen', icon: ListChecks, key: 'observe.tool.lists' },
  { href: '#/beobachten/jupiter', icon: Orbit, key: 'observe.tool.jupiter' },
  { href: '#/beobachten/okular', icon: Telescope, key: 'observe.tool.eyepiece' },
] as const;

/** Schnellzugriff auf die Beobachtungs-Werkzeuge */
export function ToolStrip() {
  const { t } = useI18n();
  return (
    <section className="section">
      <div className="section-head">
        <p className="eyebrow">{t('observe.eyebrow')}</p>
        <h2>{t('observe.stripTitle')}</h2>
      </div>
      <div className="tool-strip">
        {ITEMS.map(({ href, icon: Icon, key }) => (
          <a key={href} className="tool-chip" href={href}>
            <Icon size={20} />
            <span>{t(key)}</span>
          </a>
        ))}
        <a className="tool-chip tool-chip--all" href="#/beobachten">
          <ArrowRight size={20} />
          <span>{t('observe.all')}</span>
        </a>
      </div>
    </section>
  );
}
