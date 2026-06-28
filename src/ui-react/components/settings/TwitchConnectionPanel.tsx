import type { TranslationKey } from '../../../game-core/localization/locale-types';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { useTranslation } from '../../i18n/useTranslation';

export function TwitchConnectionPanel() {
  const { status, error, isBusy, isConnected, canUseDesktopBridge, connect, reconnect, disconnect } = useTwitchConnection();
  const t = useTranslation();
  const statusKey: TranslationKey = `twitch.status.${status.state}`;
  const awaitingAuthorization = status.state === 'awaitingAuthorization';
  const accountName = status.accountDisplayName ?? status.accountLogin;
  const statusMessage = error ?? status.message;
  const canConnect = canUseDesktopBridge && !isBusy && !isConnected;
  const canReconnect = canUseDesktopBridge && !isBusy && !isConnected;

  return (
    <section className="twitch-connection-panel" aria-label={t('twitch.panel.title')}>
      <div className="twitch-panel-heading">
        <div>
          <h3>{t('twitch.panel.title')}</h3>
          <p>{t('twitch.panel.subtitle')}</p>
        </div>
        <span className={`twitch-status-pill twitch-status-${status.state}`}>{t(statusKey)}</span>
      </div>

      {isConnected && accountName ? (
        <div className="twitch-account-card">
          <span className="twitch-account-check">✓</span>
          <div>
            <strong>{accountName}</strong>
            <small>#{status.channelName ?? status.accountLogin}</small>
          </div>
        </div>
      ) : null}

      {awaitingAuthorization ? (
        <div className="twitch-device-card" role="status" aria-live="polite">
          <span>{t('twitch.device.instruction')}</span>
          <strong dir="ltr">{status.userCode}</strong>
          {status.verificationUri ? <small dir="ltr">{status.verificationUri}</small> : null}
        </div>
      ) : null}

      <div className="twitch-button-row twitch-button-row-three">
        <button type="button" onClick={() => void connect()} disabled={!canConnect}>
          <span aria-hidden="true">▶</span>
          {isBusy ? t('twitch.action.connecting') : t('twitch.action.login')}
        </button>
        <button type="button" onClick={() => void reconnect()} disabled={!canReconnect}>
          <span aria-hidden="true">↻</span>
          {t('twitch.action.reconnect')}
        </button>
        <button type="button" onClick={() => void disconnect()} disabled={!isConnected && status.state !== 'reconnecting' && !awaitingAuthorization}>
          <span aria-hidden="true">■</span>
          {t('twitch.action.disconnect')}
        </button>
      </div>

      <p className="twitch-status-message">{statusMessage}</p>
      <p className="twitch-consumer-note">{t('twitch.consumer.note')}</p>
    </section>
  );
}
