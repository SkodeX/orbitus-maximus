import { Check, MapPin, Share, Smartphone } from 'lucide-react';
import { useSettings, type Lang } from '../state/settings';
import { useI18n } from '../i18n';
import { LocationPicker } from '../components/LocationPicker';
import { AccountCard } from '../components/AccountCard';
import { PushCard } from '../components/PushCard';
import { fmtCoords } from '../lib/format';

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function SettingsView() {
  const { settings, update } = useSettings();
  const { t, lang } = useI18n();
  const place = settings.place!;

  return (
    <div className="page settings">
      <header className="page-head">
        <p className="eyebrow">{t('settings.eyebrow')}</p>
        <h1>{t('settings.title')}</h1>
      </header>

      <AccountCard />
      <PushCard />

      <section className="card">
        <p className="card-kicker">{t('settings.placeKicker')}</p>
        <div className="place-current">
          <MapPin size={22} />
          <div>
            <h3>{place.name}</h3>
            <p className="muted">
              {place.region ? `${place.region} · ` : ''}
              {fmtCoords(place.lat, place.lon, lang)}
            </p>
            <p className="muted small">
              {t('settings.timezone')}: {place.tz} · {place.source === 'gps' ? t('settings.viaGps') : t('settings.viaSearch')}
            </p>
          </div>
        </div>
        <LocationPicker />
      </section>

      <section className="card">
        <p className="card-kicker">{t('settings.displayKicker')}</p>
        <div className="setting-row">
          <div>
            <h3>{t('settings.language')}</h3>
          </div>
          <div className="segmented" role="radiogroup" aria-label={t('settings.language')}>
            {(['de', 'en'] as Lang[]).map((l) => (
              <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? 'is-on' : ''} onClick={() => update({ lang: l })}>
                {l === 'de' ? 'Deutsch' : 'English'}
              </button>
            ))}
          </div>
        </div>
        <label className="toggle setting-row">
          <span>
            <h3>{t('settings.redMode')}</h3>
            <span className="muted small">{t('settings.redModeText')}</span>
          </span>
          <input type="checkbox" checked={settings.redMode} onChange={(e) => update({ redMode: e.target.checked })} />
          <span className="switch" aria-hidden="true" />
        </label>
      </section>

      <section className="card">
        <p className="card-kicker">{t('settings.installKicker')}</p>
        {isStandalone() ? (
          <p className="install-ok">
            <Check size={18} /> {t('settings.installed')}
          </p>
        ) : isIos() ? (
          <ol className="steps">
            <li>
              {t('settings.iosStep1')} <Share size={16} className="inline-icon" />
            </li>
            <li>{t('settings.iosStep2')}</li>
            <li>{t('settings.iosStep3')}</li>
          </ol>
        ) : (
          <p className="muted">
            <Smartphone size={16} className="inline-icon" /> {t('settings.installOther')}
          </p>
        )}
        <p className="muted small">{t('settings.installWhy')}</p>
      </section>

      <section className="card">
        <p className="card-kicker">{t('settings.aboutKicker')}</p>
        <h3>Orbitus Maximus</h3>
        <p className="muted">{t('settings.aboutText')}</p>
        <h4>{t('settings.roadmap')}</h4>
        <ul className="roadmap">
          <li className="is-done">{t('settings.phase1')}</li>
          <li className="is-done">{t('settings.phase2')}</li>
          <li className="is-done">{t('settings.phase3')}</li>
          <li className="is-done">{t('settings.phase4')}</li>
          <li className="is-done">{t('settings.phase5')}</li>
          <li className="is-done">{t('settings.phase6')}</li>
        </ul>
        <h4>{t('settings.sources')}</h4>
        <ul className="sources">
          <li>
            <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noreferrer">
              Astronomy Engine
            </a>{' '}
            – {t('settings.srcAstronomy')}
          </li>
          <li>
            <a href="https://github.com/ofrohn/d3-celestial" target="_blank" rel="noreferrer">
              d3-celestial
            </a>{' '}
            – {t('settings.srcCelestial')}
          </li>
          <li>
            <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>{' '}
            – {t('settings.srcMeteo')}
          </li>
          <li>
            <a href="https://github.com/nasa/NASA-3D-Resources" target="_blank" rel="noreferrer">
              NASA 3D Resources
            </a>{' '}
            – {t('settings.srcNasa3d')}
          </li>
          <li>
            <a href="https://www.bigdatacloud.com" target="_blank" rel="noreferrer">
              BigDataCloud
            </a>{' '}
            – {t('settings.srcBdc')}
          </li>
        </ul>
        <p className="muted small">v{__APP_VERSION__}</p>
      </section>
    </div>
  );
}
