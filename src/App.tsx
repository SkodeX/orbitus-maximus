import { lazy, Suspense } from 'react';
import { SettingsProvider, useSettings } from './state/settings';
import { useRoute } from './lib/router';
import { useI18n } from './i18n';
import { BottomNav, TopBar, type ViewId } from './components/Chrome';
import { Starfield } from './components/Starfield';
import { TonightView } from './views/tonight/TonightView';
import { SettingsView } from './views/SettingsView';
import { Onboarding } from './views/Onboarding';

// Die Sternkarte bringt ihren Sternkatalog mit und wird erst bei Bedarf geladen
const SkyView = lazy(() => import('./views/sky/SkyView'));
// 3D-Sonnensystem (three.js) und Live-Seite ebenfalls erst bei Bedarf laden
const SolarView = lazy(() => import('./views/solar/SolarView'));
const LearnView = lazy(() => import('./views/learn/LearnView'));
const LiveView = lazy(() => import('./views/live/LiveView').then((m) => ({ default: m.LiveView })));

function Shell() {
  const { settings } = useSettings();
  const { t } = useI18n();
  const route = useRoute();

  if (!settings.place) return <Onboarding />;

  const view: ViewId = route.path.startsWith('/sky')
    ? 'sky'
    : route.path.startsWith('/system')
      ? 'solar'
      : route.path.startsWith('/wissen')
        ? 'learn'
      : route.path.startsWith('/live')
      ? 'live'
      : route.path.startsWith('/settings')
        ? 'settings'
        : 'tonight';

  return (
    <div className={`app app--${view}`}>
      {view !== 'sky' && view !== 'solar' && <Starfield />}
      <TopBar view={view} />
      <main className="main" key={view}>
        {view === 'tonight' && <TonightView />}
        {view === 'settings' && <SettingsView />}
        {view === 'solar' && (
          <Suspense fallback={<div className="loading">{t('solar.loading')}</div>}>
            <SolarView focus={route.query.get('focus')} />
          </Suspense>
        )}
        {view === 'learn' && (
          <Suspense fallback={<div className="loading">{t('live.loading')}</div>}>
            <LearnView path={route.path} query={route.query} />
          </Suspense>
        )}
        {view === 'live' && (
          <Suspense fallback={<div className="loading">{t('live.loading')}</div>}>
            <LiveView />
          </Suspense>
        )}
        {view === 'sky' && (
          <Suspense fallback={<div className="loading">{t('common.loadingSky')}</div>}>
            <SkyView focus={route.query.get('focus')} at={Number(route.query.get('t')) || null} />
          </Suspense>
        )}
      </main>
      <BottomNav view={view} />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Shell />
      <div className="red-filter" aria-hidden="true" />
    </SettingsProvider>
  );
}
