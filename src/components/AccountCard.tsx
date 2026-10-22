import { useState } from 'react';
import { Check, Cloud, CloudOff, Loader2, LogOut, Mail, RefreshCw } from 'lucide-react';
import { useI18n } from '../i18n';
import { cloudConfigured } from '../lib/cloud/config';
import { sendCode, signOut, useSession, verifyCode } from '../lib/cloud/client';
import { useSyncStatus } from '../lib/cloud/sync';
import { fmtTime } from '../lib/format';
import { useSettings } from '../state/settings';

/** Konto: Anmeldung per E-Mail-Code und Sync-Status */
export function AccountCard() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { user, ready } = useSession();
  const { status, lastSync } = useSyncStatus();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tz = settings.place?.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!cloudConfigured()) {
    return (
      <section className="card">
        <p className="card-kicker">{t('account.kicker')}</p>
        <p className="muted">{t('account.notConfigured')}</p>
      </section>
    );
  }

  const run = async (fn: () => Promise<void>, next?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      next?.();
    } catch (e) {
      const msg = (e as { message?: string }).message ?? '';
      setError(/rate|security purposes/i.test(msg) ? t('account.errRate') : /expired|invalid/i.test(msg) ? t('account.errCode') : t('account.errGeneric'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card account-card">
      <p className="card-kicker">{t('account.kicker')}</p>
      {!ready && <Loader2 size={18} className="spin" />}

      {ready && user && (
        <>
          <div className="account-row">
            <span className="account-avatar">{(user.email ?? '?').slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.email}</strong>
              <p className={`sync-state sync-state--${status}`}>
                {status === 'syncing' && <RefreshCw size={14} className="spin" />}
                {status === 'ok' && <Check size={14} />}
                {status === 'error' && <CloudOff size={14} />}
                {status === 'syncing' && t('account.syncing')}
                {status === 'ok' && t('account.synced', { time: lastSync ? fmtTime(new Date(lastSync), tz, lang) : '' })}
                {status === 'error' && t('account.syncError')}
                {status === 'off' && t('account.syncOff')}
              </p>
            </div>
          </div>
          <p className="muted small">{t('account.syncWhat')}</p>
          <button className="btn btn-ghost btn-sm" onClick={() => run(signOut)}>
            <LogOut size={16} /> {t('account.signOut')}
          </button>
        </>
      )}

      {ready && !user && (
        <>
          <h3>
            <Cloud size={20} className="inline-icon" /> {t('account.title')}
          </h3>
          <p className="muted">{t('account.lead')}</p>
          {step === 'email' ? (
            <form
              className="account-form"
              onSubmit={(e) => {
                e.preventDefault();
                run(() => sendCode(email.trim()), () => setStep('code'));
              }}
            >
              <label className="search-box">
                <Mail size={18} />
                <input type="email" required autoComplete="email" inputMode="email" placeholder={t('account.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <button className="btn btn-primary" disabled={busy || !email.includes('@')}>
                {busy ? <Loader2 size={16} className="spin" /> : null} {t('account.sendCode')}
              </button>
            </form>
          ) : (
            <form
              className="account-form"
              onSubmit={(e) => {
                e.preventDefault();
                run(() => verifyCode(email.trim(), code.trim()));
              }}
            >
              <p className="muted small">{t('account.codeSent', { email })}</p>
              <input
                className="code-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
              <div className="btn-row">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep('email')}>
                  {t('account.otherEmail')}
                </button>
                <button className="btn btn-primary" disabled={busy || code.length < 6}>
                  {busy ? <Loader2 size={16} className="spin" /> : null} {t('account.signIn')}
                </button>
              </div>
            </form>
          )}
          {error && <p className="error">{error}</p>}
          <p className="muted small">{t('account.privacy')}</p>
        </>
      )}
    </section>
  );
}
