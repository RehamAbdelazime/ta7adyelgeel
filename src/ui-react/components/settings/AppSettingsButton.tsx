import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import type { LocaleCode } from '../../../game-core/localization/locale-types';
import type { DisplayMode, DisplaySettings, ResolutionPreset } from '../../../desktop-electron/preload';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { useAudioTuning } from '../../context/AudioTuningContext';
import { useTranslation } from '../../i18n/useTranslation';
import { OPEN_APP_SETTINGS_EVENT } from '../../events/app-ui-events';

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  displayMode: 'borderless',
  resolution: '1920x1080',
};

const RESOLUTIONS: Array<{ value: ResolutionPreset; label: string }> = [
  { value: '1920x1080', label: '1920 × 1080' },
  { value: '1600x900', label: '1600 × 900' },
  { value: '1366x768', label: '1366 × 768' },
  { value: '1280x720', label: '1280 × 720' },
];

const DISPLAY_MODES: Array<{ value: DisplayMode }> = [
  { value: 'fullscreen' },
  { value: 'borderless' },
  { value: 'windowed' },
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
  const [draftMusicVolume, setDraftMusicVolume] = useState(() => Math.round(audioTuning.globalVolume * 100));
  const lastAudibleVolumeRef = useRef(Math.max(1, Math.round(audioTuning.globalVolume * 100)));
  const dialogRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const isApplyingRef = useRef(isApplying);
  isApplyingRef.current = isApplying;

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

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
          if (!isOpenRef.current) setDraftDisplaySettings(settings);
        }
      })
      .catch((err: unknown) => {
        if (!disposed) {
          setError(getErrorMessage(err));
        }
      });

    const removeListener = api.onSettingsChanged((settings) => {
      setSavedDisplaySettings(settings);
      if (!isOpenRef.current) {
        setDraftDisplaySettings(settings);
      }
    });

    return () => {
      disposed = true;
      removeListener();
    };
  }, []);

  const accountLabel = useMemo(() => {
    return status.accountDisplayName ?? status.accountLogin ?? status.channelName ?? 'Twitch';
  }, [status.accountDisplayName, status.accountLogin, status.channelName]);

  const hasDisplayChanges = draftDisplaySettings.displayMode !== savedDisplaySettings.displayMode
    || draftDisplaySettings.resolution !== savedDisplaySettings.resolution;
  const hasLanguageChanges = draftLocale !== snapshot.locale;
  const hasAudioChanges = draftMusicVolume !== Math.round(audioTuning.globalVolume * 100);
  const hasAnyChanges = hasDisplayChanges || hasLanguageChanges || hasAudioChanges;
  const isWindowedMode = draftDisplaySettings.displayMode === 'windowed';
  const isActiveSession = snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open';
  const isArabic = snapshot.locale === 'ar';
  const copy = isArabic ? {
    online: 'متصل', offline: 'غير متصل', disconnect: 'فصل الحساب',
    music: 'مستوى صوت الموسيقى', musicHint: 'التحكم في صوت موسيقى اللعبة',
    mute: 'كتم', unmute: 'إلغاء الكتم',
    displayFull: 'شاشة كاملة', displayBorderless: 'بلا حدود', displayWindow: 'نافذة',
    session: 'الجلسة الحالية', pending: 'تغييرات غير محفوظة', saved: 'كل الإعدادات محفوظة',
    discard: 'إلغاء', keyHint: 'ESC للإغلاق',
  } : {
    online: 'Connected', offline: 'Offline', disconnect: 'Disconnect',
    music: 'Music volume', musicHint: 'Game music volume',
    mute: 'Mute', unmute: 'Unmute',
    displayFull: 'Fullscreen', displayBorderless: 'Borderless', displayWindow: 'Windowed',
    session: 'Active session', pending: 'Unsaved changes', saved: 'All changes saved',
    discard: 'Cancel', keyHint: 'ESC to close',
  };
  const endSessionLabel = snapshot.activeSessionMode === 'mini-game'
    ? (isArabic ? 'إنهاء اللعبة' : 'End mini game')
    : (isArabic ? 'إنهاء البطولة' : 'End tour');
  const volumeStyle = { '--settings-volume': `${draftMusicVolume}%` } as CSSProperties;

  const openSettings = useCallback(() => {
    if (!isOpen) restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setDraftLocale(snapshot.locale);
    setDraftDisplaySettings(savedDisplaySettings);
    setDraftMusicVolume(Math.round(audioTuning.globalVolume * 100));
    setError(null);
    setIsDisconnectConfirmOpen(false);
    setIsOpen(true);
  }, [savedDisplaySettings, snapshot.locale, isOpen, audioTuning.globalVolume]);

  useEffect(() => {
    const handleOpenSettings = () => openSettings();
    window.addEventListener(OPEN_APP_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(OPEN_APP_SETTINGS_EVENT, handleOpenSettings);
  }, [openSettings]);

  const closeSettings = useCallback(() => {
    setDraftLocale(snapshot.locale);
    setDraftDisplaySettings(savedDisplaySettings);
    setDraftMusicVolume(Math.round(audioTuning.globalVolume * 100));
    setError(null);
    setIsDisconnectConfirmOpen(false);
    setIsOpen(false);
  }, [snapshot.locale, savedDisplaySettings, audioTuning.globalVolume]);

  const closeSettingsRef = useRef(closeSettings);
  closeSettingsRef.current = closeSettings;

  // A real keyboard-modal: initial focus, Escape, Tab loop, and focus restoration.
  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getClientRects().length > 0);
    const first = dialog.querySelector<HTMLElement>('[data-settings-initial-focus="true"]');
    (first ?? getFocusable()[0] ?? dialog).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isApplyingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        closeSettingsRef.current();
      } else if (event.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) { event.preventDefault(); dialog.focus(); return; }
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === firstElement || !dialog.contains(document.activeElement))) {
          event.preventDefault(); lastElement.focus();
        } else if (!event.shiftKey && (document.activeElement === lastElement || !dialog.contains(document.activeElement))) {
          event.preventDefault(); firstElement.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [isOpen]);

  const applySettings = async () => {
    if (isApplying) return;
    setError(null);
    setIsApplying(true);

    try {
      // Do not commit language/audio before display settings have succeeded.
      // A locale-only or audio-only change must not require the display bridge.
      if (hasDisplayChanges) {
        const api = window.elGeel?.display;
        if (!api) throw new Error('Desktop display bridge is unavailable.');
        const saved = await api.setSettings(draftDisplaySettings);
        setSavedDisplaySettings(saved);
        setDraftDisplaySettings(saved);
      }
      if (hasLanguageChanges) actions.setLanguage(draftLocale);
      if (hasAudioChanges) setGlobalVolume(draftMusicVolume / 100);
      setIsOpen(false);
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
    setDraftMusicVolume(Number(event.target.value));
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
      {snapshot.tour.isTourActive ? (
        <button className="app-settings-gear" type="button" aria-label={t('settings.open')} onClick={openSettings}>⚙</button>
      ) : null}
      {isOpen ? (
        <div className="settings-modal-backdrop casual-settings-backdrop" role="presentation">
          <section
            ref={dialogRef}
            tabIndex={-1}
            className="settings-modal casual-settings"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
            aria-describedby="settings-dialog-description"
            dir={snapshot.direction}
          >
            <header className="casual-settings-header">
              <div className="casual-settings-heading">
                <div className="casual-settings-accent" aria-hidden="true"><span /><span /></div>
                <h2 id="settings-dialog-title">{t('settings.title')}</h2>
                <p id="settings-dialog-description">{isArabic ? 'ظبّطي اللعبة على مزاجك' : 'Make the game yours'}</p>
              </div>
              <button
                type="button"
                className="casual-settings-close"
                onClick={closeSettings} disabled={isApplying}
                aria-label={t('settings.close')} title={copy.keyHint}
              >×</button>
            </header>

            <div className="casual-settings-content">
              <div className="casual-settings-row casual-settings-audio">
                <div className="casual-settings-label">
                  <span>{isArabic ? 'الموسيقى' : 'Music'}</span>
                  <small>{copy.musicHint}</small>
                </div>
                <div className="casual-settings-volume-controls">
                  <button type="button" className="casual-settings-mute" disabled={isApplying}
                    onClick={() => {
                      if (draftMusicVolume > 0) {
                        lastAudibleVolumeRef.current = draftMusicVolume;
                        setDraftMusicVolume(0);
                      } else {
                        setDraftMusicVolume(lastAudibleVolumeRef.current);
                      }
                    }} aria-label={draftMusicVolume === 0 ? copy.unmute : copy.mute}
                    title={draftMusicVolume === 0 ? copy.unmute : copy.mute}>
                    <span aria-hidden="true">{draftMusicVolume === 0 ? '♪̸' : '♫'}</span>
                  </button>
                  <input id="casual-settings-volume" type="range" min="0" max="100" step="1"
                    value={draftMusicVolume} style={volumeStyle} data-settings-initial-focus="true"
                    onChange={changeMusicVolume} disabled={isApplying}
                    aria-label={copy.music} aria-valuetext={`${draftMusicVolume}%`} />
                  <output htmlFor="casual-settings-volume" dir="ltr">{draftMusicVolume}%</output>
                </div>
              </div>

              <div className="casual-settings-row">
                <div className="casual-settings-label"><span>{t('settings.language')}</span></div>
                <div className="casual-settings-segmented casual-settings-language" role="group" aria-label={t('settings.language')}>
                  <button type="button" onClick={() => changeLanguage('en')}
                    className={draftLocale === 'en' ? 'is-active' : ''}
                    aria-pressed={draftLocale === 'en'} disabled={isApplying}>English</button>
                  <button type="button" onClick={() => changeLanguage('ar')}
                    className={draftLocale === 'ar' ? 'is-active' : ''}
                    aria-pressed={draftLocale === 'ar'} disabled={isApplying}>العربية</button>
                </div>
              </div>

              <div className="casual-settings-row casual-settings-display-row">
                <div className="casual-settings-label"><span>{t('settings.displayMode')}</span></div>
                <div className="casual-settings-segmented casual-settings-display" role="group" aria-label={t('settings.displayMode')}>
                  {DISPLAY_MODES.map((mode) => (
                    <button type="button" key={mode.value} onClick={() => changeDisplayMode(mode.value)}
                      className={draftDisplaySettings.displayMode === mode.value ? 'is-active' : ''}
                      aria-pressed={draftDisplaySettings.displayMode === mode.value} disabled={isApplying}>
                      {mode.value === 'fullscreen' ? copy.displayFull : mode.value === 'borderless' ? copy.displayBorderless : copy.displayWindow}
                    </button>
                  ))}
                </div>
              </div>

              {isWindowedMode ? (
                <div className="casual-settings-row casual-settings-resolution-row">
                  <label className="casual-settings-label" htmlFor="casual-settings-resolution">
                    <span>{t('settings.resolution')}</span>
                  </label>
                  <select id="casual-settings-resolution" value={draftDisplaySettings.resolution}
                    disabled={isApplying}
                    onChange={(event) => changeResolution(event.target.value as ResolutionPreset)}>
                    {RESOLUTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              ) : null}

              <div className="casual-settings-row casual-settings-stream">
                <div className="casual-settings-label">
                  <span>Twitch</span>
                  <small className="casual-settings-account" title={accountLabel} dir="auto">
                    {isConnected ? accountLabel : copy.offline}
                  </small>
                </div>
                <div className="casual-settings-stream-actions">
                  <span className={`casual-settings-connection ${isConnected ? 'is-online' : ''}`}>
                    <i aria-hidden="true" />{isConnected ? copy.online : copy.offline}
                  </span>
                  {isConnected ? (
                    <button type="button" className="casual-settings-link"
                      disabled={isApplying || isDisconnectConfirmOpen} onClick={requestDisconnectTwitch}>
                      {copy.disconnect}
                    </button>
                  ) : null}
                </div>
              </div>
              {isDisconnectConfirmOpen ? (
                <div className="casual-settings-confirm" role="group" aria-label={t('settings.disconnectConfirmTitle')}>
                  <strong>{t('settings.disconnectConfirmTitle')}</strong>
                  <p>{t('settings.disconnectConfirmMessage')}</p>
                  <div>
                    <button type="button" onClick={cancelDisconnectTwitch}>{t('settings.cancel')}</button>
                    <button type="button" className="is-danger" onClick={() => void confirmDisconnectTwitch()}>
                      {t('settings.confirmDisconnect')}
                    </button>
                  </div>
                </div>
              ) : null}

              {isActiveSession ? (
                <div className="casual-settings-session">
                  <span>{copy.session}</span>
                  <button type="button" onClick={endActiveSession} disabled={isApplying}>{endSessionLabel}</button>
                </div>
              ) : null}
            </div>

            {error ? <p className="casual-settings-error" role="alert">{error}</p> : null}
            <footer className="casual-settings-footer">
              <span className={`casual-settings-status ${hasAnyChanges ? 'is-dirty' : ''}`} role="status" aria-live="polite">
                {hasAnyChanges ? copy.pending : copy.saved}
              </span>
              <div className="casual-settings-footer-buttons">
                <button className="casual-settings-cancel" type="button" onClick={closeSettings} disabled={isApplying}>{copy.discard}</button>
                <button className="casual-settings-save" type="button" disabled={!hasAnyChanges || isApplying} onClick={() => void applySettings()}>
                  {isApplying ? t('settings.applying') : t('settings.apply')}
                </button>
              </div>
            </footer>
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
