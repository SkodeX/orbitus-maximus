import { useSettings } from '../state/settings';
import { useI18n } from '../i18n';
import { LocationPicker } from '../components/LocationPicker';
import { Starfield } from '../components/Starfield';

/** Erster Start: Ort festlegen */
export function Onboarding() {
  const { settings, update } = useSettings();
  const { t } = useI18n();
  return (
    <div className="onboarding">
      <Starfield />
      <button className="lang-switch" onClick={() => update({ lang: settings.lang === 'de' ? 'en' : 'de' })}>
        {settings.lang === 'de' ? 'English' : 'Deutsch'}
      </button>
      <div className="onboarding-card">
        <img src="./logo.svg" alt="" className="onboarding-logo" width="84" height="84" />
        <p className="eyebrow">{t('onboarding.eyebrow')}</p>
        <h1>
          Orbitus <span className="grad">Maximus</span>
        </h1>
        <p className="lead">{t('onboarding.lead')}</p>
        <LocationPicker />
        <p className="muted small">{t('onboarding.privacy')}</p>
      </div>
    </div>
  );
}
