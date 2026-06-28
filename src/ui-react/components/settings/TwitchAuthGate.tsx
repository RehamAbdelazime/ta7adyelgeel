import type { TranslationKey } from '../../../game-core/localization/locale-types';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { useTranslation } from '../../i18n/useTranslation';

export function TwitchAuthGate() {
  const { snapshot } = useGame();
  const { status, error, isBootstrapping, isBusy, canUseDesktopBridge, connect } = useTwitchConnection();
  const t = useTranslation();
  const statusKey: TranslationKey = `twitch.status.${status.state}`;
  const awaitingAuthorization = status.state === 'awaitingAuthorization';
  const showCompactStatus = awaitingAuthorization || Boolean(error) || isBootstrapping || isBusy || !canUseDesktopBridge;

  const handleConnect = async () => {
    await connect();
  };

  return (
    <main className="auth-gate-page auth-gate-simple" dir={snapshot.direction}>
      <div className="auth-gate-bg auth-gate-stage-bg" aria-hidden="true" />

      <section className="auth-simple-panel" aria-label={t('authGate.title')}>
        <button className="auth-primary-button auth-connect-only-button" type="button" onClick={handleConnect} disabled={!canUseDesktopBridge || isBootstrapping || isBusy}>
          {isBusy || isBootstrapping ? <span className="auth-button-spinner" aria-hidden="true" /> : <span className="auth-connect-icon" aria-hidden="true">▶</span>}
          <strong>{isBusy || isBootstrapping ? t('twitch.action.connecting') : t('authGate.connectButton')}</strong>
        </button>

        {showCompactStatus ? (
          <div className="auth-compact-status" role="status" aria-live="polite">
            <span className={`twitch-status-pill twitch-status-${status.state}`}>{t(statusKey)}</span>
            {awaitingAuthorization && status.userCode ? <b dir="ltr">{status.userCode}</b> : null}
            <small>{error ?? (awaitingAuthorization ? t('twitch.device.instruction') : status.message)}</small>
          </div>
        ) : null}
      </section>
    </main>
  );
}
