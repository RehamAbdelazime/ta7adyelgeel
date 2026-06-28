import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { LocaleCode } from '../../../game-core/localization/locale-types';
import type { DisplayMode, DisplaySettings, ResolutionPreset } from '../../../desktop-electron/preload';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { useAudioTuning } from '../../context/AudioTuningContext';
import { useTranslation } from '../../i18n/useTranslation';

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  displayMode: 'borderless',
  resolution: '1920x1080',
};

const RESOLUTIONS: Array<{ value: ResolutionPreset; label: string; icon: string }> = [
  { value: '1920x1080', label: '1920 × 1080', icon: '▣' },
  { value: '1600x900', label: '1600 × 900', icon: '▤' },
  { value: '1366x768', label: '1366 × 768', icon: '▥' },
  { value: '1280x720', label: '1280 × 720', icon: '▦' },
];

const DISPLAY_MODES: Array<{ value: DisplayMode; labelKey: 'settings.display.fullscreen' | 'settings.display.windowed' | 'settings.display.borderless'; icon: string }> = [
  { value: 'fullscreen', labelKey: 'settings.display.fullscreen', icon: '⛶' },
  { value: 'borderless', labelKey: 'settings.display.borderless', icon: '▣' },
  { value: 'windowed', labelKey: 'settings.display.windowed', icon: '▢' },
];

export function AppSettingsButton() {
  const { snapshot, actions } = useGame();
  const { isConnected, status, disconnect } = useTwitchConnection();
  const t = useTranslation();
  const { tuning: audioTuning, setGlobalVolume } = useAudioTuning();
  const [isOpen, setIsOpen] = useState(false);
  const [savedDisplaySettings, setSavedDisplaySettings] = useState<DisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [draftDisplaySettings, setDraftDisplaySettings] = useState<DisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [draftLocale, setDraftLocale] = useState<LocaleCode>(snapshot.locale);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnectConfirmOpen, setIsDisconnectConfirmOpen] = useState(false);

  useEffect(() => {
    const api = window.elGeel?.display;

    if (!api) {
      return;
    }

    let disposed = false;

    void api.getSettings()
      .then((settings) => {
        if (!disposed) {
          setSavedDisplaySettings(settings);
          setDraftDisplaySettings(settings);
        }
      })
      .catch((err: unknown) => {
        if (!disposed) {
          setError(getErrorMessage(err));
        }
      });

    const removeListener = api.onSettingsChanged((settings) => {
      setSavedDisplaySettings(settings);
      if (!isOpen) {
        setDraftDisplaySettings(settings);
      }
    });

    return () => {
      disposed = true;
      removeListener();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setDraftLocale(snapshot.locale);
      setDraftDisplaySettings(savedDisplaySettings);
      setError(null);
      setIsDisconnectConfirmOpen(false);
    }
  }, [isOpen, savedDisplaySettings, snapshot.locale]);

  const accountLabel = useMemo(() => {
    return status.accountDisplayName ?? status.accountLogin ?? status.channelName ?? 'Twitch';
  }, [status.accountDisplayName, status.accountLogin, status.channelName]);

  const hasDisplayChanges = draftDisplaySettings.displayMode !== savedDisplaySettings.displayMode
    || draftDisplaySettings.resolution !== savedDisplaySettings.resolution;
  const hasLanguageChanges = draftLocale !== snapshot.locale;
  const isWindowedMode = draftDisplaySettings.displayMode === 'windowed';
  const isActiveSession = snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open';
  const endSessionLabel = snapshot.activeSessionMode === 'mini-game' ? 'End Mini Game' : 'End Tour';

  const openSettings = () => {
    setDraftLocale(snapshot.locale);
    setDraftDisplaySettings(savedDisplaySettings);
    setError(null);
    setIsDisconnectConfirmOpen(false);
    setIsOpen(true);
  };

  const closeSettings = () => {
    setDraftLocale(snapshot.locale);
    setDraftDisplaySettings(savedDisplaySettings);
    setError(null);
    setIsDisconnectConfirmOpen(false);
    setIsOpen(false);
  };

  const applySettings = async () => {
    const api = window.elGeel?.display;
    setError(null);

    if (hasLanguageChanges) {
      actions.setLanguage(draftLocale);
    }

    if (!api) {
      setError('Desktop display bridge is unavailable.');
      return;
    }

    setIsApplying(true);

    try {
      const saved = await api.setSettings(draftDisplaySettings);
      setSavedDisplaySettings(saved);
      setDraftDisplaySettings(saved);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsApplying(false);
    }
  };

  const changeLanguage = (locale: LocaleCode) => {
    setDraftLocale(locale);
  };

  const changeResolution = (resolution: ResolutionPreset) => {
    setDraftDisplaySettings((current) => ({ ...current, resolution }));
  };

  const changeDisplayMode = (displayMode: DisplayMode) => {
    setDraftDisplaySettings((current) => ({ ...current, displayMode }));
  };

  const changeMusicVolume = (event: ChangeEvent<HTMLInputElement>) => {
    setGlobalVolume(Number(event.target.value) / 100);
  };

  const endActiveSession = () => {
    actions.endTour();
    setIsOpen(false);
  };

  const requestDisconnectTwitch = () => {
    setError(null);
    setIsDisconnectConfirmOpen(true);
  };

  const cancelDisconnectTwitch = () => {
    setIsDisconnectConfirmOpen(false);
  };

  const confirmDisconnectTwitch = async () => {
    setError(null);

    try {
      await disconnect();
      setIsDisconnectConfirmOpen(false);
      setIsOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <button className="app-settings-gear" type="button" aria-label={t('settings.open')} onClick={openSettings}>
        ⚙
      </button>

      {isOpen ? (
        <div className="settings-modal-backdrop" role="presentation">
          <section className="settings-modal" role="dialog" aria-modal="true" aria-label={t('settings.title')}>
            <header className="settings-modal-header">
              <div>
                <span>{t('settings.kicker')}</span>
                <h2>{t('settings.title')}</h2>
              </div>
              <button type="button" className="settings-close-button" onClick={closeSettings} aria-label={t('settings.close')}>
                ×
              </button>
            </header>

            <div className="settings-section settings-danger-section settings-account-section">
              <h3>{t('settings.twitch')}</h3>
              <p className="settings-help-text">
                {isConnected ? t('settings.connectedAs', { name: accountLabel }) : t('settings.notConnected')}
              </p>
              <button type="button" className="settings-danger-button" onClick={requestDisconnectTwitch} disabled={!isConnected}>
                <span aria-hidden="true">■</span>
                {t('settings.disconnectTwitch')}
              </button>

              {isDisconnectConfirmOpen ? (
                <div className="settings-confirm-card" role="alertdialog" aria-modal="false" aria-label={t('settings.disconnectConfirmTitle')}>
                  <strong>{t('settings.disconnectConfirmTitle')}</strong>
                  <p>{t('settings.disconnectConfirmMessage')}</p>
                  <div className="settings-confirm-actions">
                    <button type="button" className="settings-secondary-button" onClick={cancelDisconnectTwitch}>
                      <span aria-hidden="true">←</span>
                      {t('settings.cancel')}
                    </button>
                    <button type="button" className="settings-danger-button" onClick={() => void confirmDisconnectTwitch()}>
                      <span aria-hidden="true">■</span>
                      {t('settings.confirmDisconnect')}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="settings-section settings-audio-section">
              <h3>Music Volume</h3>
              <div className="settings-volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(audioTuning.globalVolume * 100)}
                  onChange={changeMusicVolume}
                  aria-label="Music volume"
                />
                <strong>{Math.round(audioTuning.globalVolume * 100)}%</strong>
              </div>
            </div>

            {isActiveSession ? (
              <div className="settings-section settings-end-session-section">
                <h3>Live Session</h3>
                <button type="button" className="settings-danger-button settings-end-session-button" onClick={endActiveSession}>
                  <span aria-hidden="true">■</span>
                  {endSessionLabel}
                </button>
              </div>
            ) : null}

            <div className="settings-system-grid">
              <div className="settings-section">
                <h3>{t('settings.language')}</h3>
                <div className="settings-segmented-row">
                  <button type="button" className={draftLocale === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>
                    <span className="settings-language-flag" aria-hidden="true">🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button type="button" className={draftLocale === 'ar' ? 'active' : ''} onClick={() => changeLanguage('ar')}>
                    <span className="settings-language-flag" aria-hidden="true">🇪🇬</span>
                    <span>العربية</span>
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>{t('settings.displayMode')}</h3>
                <div className="settings-choice-grid settings-choice-grid-three" role="radiogroup" aria-label={t('settings.displayMode')}>
                  {DISPLAY_MODES.map((mode) => (
                    <button
                      type="button"
                      key={mode.value}
                      className={draftDisplaySettings.displayMode === mode.value ? 'settings-choice-button active' : 'settings-choice-button'}
                      onClick={() => changeDisplayMode(mode.value)}
                      disabled={isApplying}
                      aria-pressed={draftDisplaySettings.displayMode === mode.value}
                    >
                      <span aria-hidden="true">{mode.icon}</span>
                      <strong>{t(mode.labelKey)}</strong>
                    </button>
                  ))}
                </div>
              </div>

              {isWindowedMode ? (
                <div className="settings-section">
                  <h3>{t('settings.resolution')}</h3>
                  <div className="settings-choice-grid settings-choice-grid-resolution" role="radiogroup" aria-label={t('settings.resolution')}>
                    {RESOLUTIONS.map((resolution) => (
                      <button
                        type="button"
                        key={resolution.value}
                        className={draftDisplaySettings.resolution === resolution.value ? 'settings-choice-button active' : 'settings-choice-button'}
                        onClick={() => changeResolution(resolution.value)}
                        disabled={isApplying}
                        aria-pressed={draftDisplaySettings.resolution === resolution.value}
                      >
                        <span aria-hidden="true">{resolution.icon}</span>
                        <strong>{resolution.label}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="settings-actions-row">
              <button type="button" className="settings-secondary-button" onClick={closeSettings} disabled={isApplying}>
                <span aria-hidden="true">←</span>
                {t('settings.cancel')}
              </button>
              <button type="button" className="settings-apply-button" onClick={() => void applySettings()} disabled={isApplying}>
                <span aria-hidden="true">✓</span>
                {isApplying ? t('settings.applying') : t('settings.apply')}
              </button>
            </div>

            {error ? <p className="settings-error-text">{error}</p> : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
