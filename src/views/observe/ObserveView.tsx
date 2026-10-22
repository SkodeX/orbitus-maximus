import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { ArrowLeft, Binoculars, CalendarDays, Camera, CloudMoon, Eclipse, Lightbulb, ListChecks, MoonStar, Orbit, Sparkle, Telescope } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { WeatherPage } from './WeatherPage';
import { EyepiecePage } from './EyepiecePage';
import { EclipsesPage } from './EclipsesPage';
import { JupiterPage } from './JupiterPage';
import { CalendarPage } from './CalendarPage';
import { CometsPage } from './CometsPage';
import { ListsPage } from './ListsPage';
import { LightPage } from './LightPage';

// Der Mondatlas bringt three.js mit und wird nur bei Bedarf geladen
const MoonAtlas = lazy(() => import('./MoonAtlas'));

const TOOLS: { id: string; href: string; icon: typeof Telescope; key: string }[] = [
  { id: 'weather', href: '#/beobachten/wetter', icon: CloudMoon, key: 'weather' },
  { id: 'light', href: '#/beobachten/licht', icon: Lightbulb, key: 'light' },
  { id: 'ar', href: '#/sky?ar=1', icon: Camera, key: 'ar' },
  { id: 'lists', href: '#/beobachten/listen', icon: ListChecks, key: 'lists' },
  { id: 'eyepiece', href: '#/beobachten/okular', icon: Telescope, key: 'eyepiece' },
  { id: 'moon', href: '#/beobachten/mond', icon: MoonStar, key: 'moon' },
  { id: 'jupiter', href: '#/beobachten/jupiter', icon: Orbit, key: 'jupiter' },
  { id: 'eclipses', href: '#/beobachten/finsternisse', icon: Eclipse, key: 'eclipses' },
  { id: 'comets', href: '#/beobachten/kometen', icon: Sparkle, key: 'comets' },
  { id: 'calendar', href: '#/beobachten/kalender', icon: CalendarDays, key: 'calendar' },
];

export default function ObserveView({ path, query }: { path: string; query: URLSearchParams }) {
  const parts = path.split('/').filter(Boolean);
  const section = parts[1] ?? '';
  const sub = parts[2];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  switch (section) {
    case 'wetter':
      return <WeatherPage />;
    case 'licht':
      return <LightPage />;
    case 'listen':
      return <ListsPage listId={sub ?? null} />;
    case 'okular':
      return <EyepiecePage />;
    case 'mond':
      return (
        <Suspense fallback={<div className="loading">…</div>}>
          <MoonAtlas feature={query.get('f')} />
        </Suspense>
      );
    case 'jupiter':
      return <JupiterPage />;
    case 'finsternisse':
      return <EclipsesPage />;
    case 'kometen':
      return <CometsPage />;
    case 'kalender':
      return <CalendarPage />;
    default:
      return <ObserveHub />;
  }
}

/** Kopf einer Werkzeugseite mit Rückweg zur Übersicht */
export function ToolHead({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: ReactNode; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <header className="page-head">
      <a className="back-link" href="#/beobachten">
        <ArrowLeft size={16} /> {t('observe.title')}
      </a>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lead && <p className="lead muted">{lead}</p>}
      {children}
    </header>
  );
}

function ObserveHub() {
  const { t } = useI18n();
  return (
    <div className="page observe">
      <header className="page-head">
        <p className="eyebrow">
          <Binoculars size={14} className="inline-icon" /> {t('observe.eyebrow')}
        </p>
        <h1>{t('observe.title')}</h1>
        <p className="lead muted">{t('observe.lead')}</p>
      </header>
      <div className="tool-grid">
        {TOOLS.map(({ id, href, icon: Icon, key }) => (
          <a key={id} className="card tool-card" href={href}>
            <span className="tool-icon">
              <Icon size={22} />
            </span>
            <span>
              <strong>{t(`observe.tool.${key}` as MsgKey)}</strong>
              <span className="muted small">{t(`observe.tool.${key}Text` as MsgKey)}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
