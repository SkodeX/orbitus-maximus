import { Eye, EyeOff, GraduationCap, MapPin, Moon, Orbit, Satellite, Settings2, Sparkles } from 'lucide-react';
import { useSettings } from '../state/settings';
import { useI18n } from '../i18n';

export type ViewId = 'tonight' | 'sky' | 'solar' | 'live' | 'learn' | 'settings';

const NAV: { id: ViewId; href: string; icon: typeof Moon; key: 'nav.tonight' | 'nav.sky' | 'nav.solar' | 'nav.live' | 'nav.learn' }[] = [
  { id: 'tonight', href: '#/', icon: Moon, key: 'nav.tonight' },
  { id: 'sky', href: '#/sky', icon: Sparkles, key: 'nav.sky' },
  { id: 'solar', href: '#/system', icon: Orbit, key: 'nav.solar' },
  { id: 'live', href: '#/live', icon: Satellite, key: 'nav.live' },
  { id: 'learn', href: '#/wissen', icon: GraduationCap, key: 'nav.learn' },
];

export function TopBar({ view }: { view: ViewId }) {
  const { settings, update } = useSettings();
  const { t } = useI18n();
  return (
    <header className="topbar">
      <a className="brand" href="#/" aria-label="Orbitus Maximus">
        <img src="./logo.svg" alt="" width="30" height="30" />
        <span className="brand-name">
          Orbitus <b>Maximus</b>
        </span>
      </a>
      <nav className="topnav" aria-label={t('nav.main')}>
        {NAV.map(({ id, href, key }) => (
          <a key={id} href={href} className={view === id ? 'is-active' : ''} aria-current={view === id ? 'page' : undefined}>
            {t(key)}
          </a>
        ))}
      </nav>
      <div className="topbar-actions">
        <a className="place-chip" href="#/settings" title={t('nav.changePlace')}>
          <MapPin size={15} />
          <span>{settings.place?.name}</span>
        </a>
        <button
          className={`icon-btn ${settings.redMode ? 'is-on' : ''}`}
          onClick={() => update({ redMode: !settings.redMode })}
          aria-pressed={settings.redMode}
          aria-label={t('settings.redMode')}
          title={t('settings.redMode')}
        >
          {settings.redMode ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <a className={`icon-btn ${view === 'settings' ? 'is-active' : ''}`} href="#/settings" aria-label={t('nav.settings')} title={t('nav.settings')}>
          <Settings2 size={18} />
        </a>
        <button className="icon-btn lang-btn" onClick={() => update({ lang: settings.lang === 'de' ? 'en' : 'de' })} aria-label={t('settings.language')}>
          {settings.lang === 'de' ? 'EN' : 'DE'}
        </button>
      </div>
    </header>
  );
}

export function BottomNav({ view }: { view: ViewId }) {
  const { t } = useI18n();
  return (
    <nav className="bottomnav" aria-label={t('nav.main')}>
      {NAV.map(({ id, href, icon: Icon, key }) => (
        <a key={id} href={href} className={view === id ? 'is-active' : ''} aria-current={view === id ? 'page' : undefined}>
          <Icon size={22} />
          <span>{t(key)}</span>
        </a>
      ))}
    </nav>
  );
}
