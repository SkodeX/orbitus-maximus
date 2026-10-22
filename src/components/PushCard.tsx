import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2, Send, Share } from 'lucide-react';
import { useI18n } from '../i18n';
import { cloudConfigured } from '../lib/cloud/config';
import { useSession } from '../lib/cloud/client';
import {
  DEFAULT_PREFS,
  currentSubscription,
  disablePush,
  enablePush,
  loadPrefs,
  pushSupport,
  saveSubscription,
  sendTestPush,
  type PushPrefs,
  type PushTopic,
} from '../lib/cloud/push';
import { useSettings } from '../state/settings';

const TOPICS: PushTopic[] = ['iss', 'aurora', 'clear', 'meteors'];

/** Benachrichtigungen: einschalten, Themen wählen, Test schicken */
export function PushCard() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { user } = useSession();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [prefs, setPrefs] = useState<PushPrefs>(DEFAULT_PREFS);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const support = pushSupport();

  useEffect(() => {
    if (!user || support !== 'ok') return;
    currentSubscription().then((s) => setEnabled(!!s));
    loadPrefs().then((p) => p && setPrefs(p));
  }, [user, support]);

  if (!cloudConfigured()) return null;

  const act = async (fn: () => Promise<void>, ok?: string) => {
    setBusy(true);
    setNote(null);
    try {
      await fn();
      if (ok) setNote({ kind: 'ok', text: ok });
    } catch (e) {
      const msg = (e as Error).message;
      setNote({ kind: 'error', text: msg === 'denied' ? t('push.denied') : t('push.error') });
    } finally {
      setBusy(false);
    }
  };

  const toggleTopic = (topic: PushTopic, on: boolean) => {
    const next = { ...prefs, [topic]: on };
    setPrefs(next);
    act(async () => {
      const sub = await currentSubscription();
      if (sub && settings.place) await saveSubscription(sub, settings.place, lang, next);
    });
  };

  return (
    <section className="card push-card">
      <p className="card-kicker">{t('push.kicker')}</p>
      {support === 'needs-install' && (
        <p className="muted">
          <Share size={16} className="inline-icon" /> {t('push.needsInstall')}
        </p>
      )}
      {support === 'unsupported' && <p className="muted">{t('push.unsupported')}</p>}
      {support === 'ok' && !user && <p className="muted">{t('push.signInFirst')}</p>}
      {support === 'ok' && user && (
        <>
          <div className="setting-row">
            <div>
              <h3>{enabled ? t('push.on') : t('push.off')}</h3>
              <span className="muted small">{t('push.forPlace', { place: settings.place?.name ?? '' })}</span>
            </div>
            {enabled ? (
              <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act(async () => (await disablePush(), setEnabled(false)))}>
                <BellOff size={16} /> {t('push.disable')}
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                disabled={busy || enabled === null || !settings.place}
                onClick={() => act(async () => (await enablePush(settings.place!, lang, prefs), setEnabled(true)), t('push.enabled'))}
              >
                {busy ? <Loader2 size={16} className="spin" /> : <Bell size={16} />} {t('push.enable')}
              </button>
            )}
          </div>
          {enabled && (
            <>
              <ul className="toggle-list">
                {TOPICS.map((topic) => (
                  <li key={topic}>
                    <label className="toggle">
                      <span>
                        <strong>{t(`push.topic.${topic}`)}</strong>
                        <span className="muted small block">{t(`push.topic.${topic}Text`)}</span>
                      </span>
                      <input type="checkbox" checked={prefs[topic]} onChange={(e) => toggleTopic(topic, e.target.checked)} />
                      <span className="switch" aria-hidden="true" />
                    </label>
                  </li>
                ))}
              </ul>
              <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act(() => sendTestPush(lang), t('push.testSent'))}>
                <Send size={16} /> {t('push.test')}
              </button>
            </>
          )}
        </>
      )}
      {note && <p className={note.kind === 'ok' ? 'install-ok' : 'error'}>{note.text}</p>}
    </section>
  );
}
