import { useEffect, useMemo, useRef, useState } from 'react';
import type { MiniGameId } from '../../../game-core/minigames/minigame-types';
import { getPublicMiniGames } from '../../../game-core/minigames/minigame-registry';
import type { TextDirection, TranslationKey } from '../../../game-core/localization/locale-types';
import { useGame } from '../../context/GameContext';
import { OPEN_APP_SETTINGS_EVENT } from '../../events/app-ui-events';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { useTranslation } from '../../i18n/useTranslation';

type ScreenStep = 'home' | 'mode' | 'mini-game-grid' | 'tour-grid';

// Public catalog eligibility comes from the registry; runtime enablement comes from GameStore.
type MiniGameCardDefinition = ReturnType<typeof getPublicMiniGames>[number];

const MODE_ASSET_ROOT = './assets/game/runtime/ui/main';
const FOOD_ORIGIN_CARD_BACKGROUND = `${MODE_ASSET_ROOT}/food_origin_card_background.png`;
const LANDING_BRAND_MARK = `${MODE_ASSET_ROOT}/ta7ady_brand_mark.png`;

function getMiniGameCardBackground(miniGameId: MiniGameId): string {
  return miniGameId === 'shape-count' ? `${MODE_ASSET_ROOT}/shape_count_card_background.png` : FOOD_ORIGIN_CARD_BACKGROUND;
}


function uniqueMiniGames(miniGames: MiniGameCardDefinition[]): MiniGameId[] {
  return [...new Set(miniGames.map((miniGame) => miniGame.id))];
}

export function MainScreenPlayFlow() {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const [step, setStep] = useState<ScreenStep>('home');
  const enabledMiniGameKey = [...snapshot.hostSettings.enabledMiniGameIds].sort().join('|');
  const availableMiniGames = useMemo(
    () => getPublicMiniGames(enabledMiniGameKey ? enabledMiniGameKey.split('|') as MiniGameId[] : []),
    [enabledMiniGameKey],
  );
  const [selectedTourMiniGames, setSelectedTourMiniGames] = useState<MiniGameId[]>([]);
  const canStart = snapshot.tour.canStartTour && snapshot.citizens.some((citizen) => citizen.role === 'official');

  useEffect(() => {
    const availableIds = uniqueMiniGames(availableMiniGames);
    setSelectedTourMiniGames((currentSelected) => {
      const stillAvailable = currentSelected.filter((miniGameId) => availableIds.includes(miniGameId));
      const unchanged = stillAvailable.length === currentSelected.length
        && stillAvailable.every((id, index) => id === currentSelected[index]);
      return unchanged ? currentSelected : stillAvailable;
    });
  }, [availableMiniGames]);

  // Navigation remains available before anyone joins; only launching a round is gated.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || step === 'home' || event.defaultPrevented) return;
      // Settings owns Escape while its dialog is open.
      if (document.querySelector('.settings-modal[role="dialog"]')) return;
      setStep(step === 'mode' ? 'home' : 'mode');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step]);

  const openModePicker = () => setStep('mode');
  const backHome = () => setStep('home');
  const startMiniGame = (miniGameId: MiniGameId) => {
    if (!canStart) {
      return;
    }

    actions.startQuickMiniGame(miniGameId);
  };
  const startTour = () => {
    if (!canStart || selectedTourMiniGames.length === 0) {
      return;
    }

    actions.startTour(selectedTourMiniGames);
  };
  const toggleTourMiniGame = (miniGameId: MiniGameId) => {
    setSelectedTourMiniGames((currentSelected) => {
      if (currentSelected.includes(miniGameId)) {
        return currentSelected.filter((id) => id !== miniGameId);
      }

      return [...currentSelected, miniGameId];
    });
  };

  return (
    <div className={`main-screen-play-flow main-screen-play-flow-${step}`}>
      {step === 'home' ? <LobbyHomeScreen onPlay={openModePicker} /> : null}
      {step === 'mode' ? (
        <ModePickerScreen
          canStart={canStart}
          onBack={backHome}
          onMiniGame={() => setStep('mini-game-grid')}
          onTour={() => setStep('tour-grid')}
        />
      ) : null}
      {step === 'mini-game-grid' ? (
        <MiniGameGridScreen
          title={t('ui.play.chooseMiniGame')}
          subtitle={t('ui.play.chooseMiniGameHint')}
          miniGames={availableMiniGames}
          direction={snapshot.direction}
          selectedMiniGames={[]}
          canStart={canStart}
          mode="single"
          onBack={() => setStep('mode')}
          onLaunch={startMiniGame}
          translate={(key) => t(key)}
        />
      ) : null}
      {step === 'tour-grid' ? (
        <MiniGameGridScreen
          title={t('ui.play.chooseTourGames')}
          subtitle={t('ui.play.chooseTourGamesHint')}
          miniGames={availableMiniGames}
          direction={snapshot.direction}
          selectedMiniGames={selectedTourMiniGames}
          canStart={canStart}
          mode="tour"
          onBack={() => setStep('mode')}
          onLaunch={toggleTourMiniGame}
          onStartTour={startTour}
          translate={(key) => t(key)}
        />
      ) : null}
    </div>
  );
}

function LobbyHomeScreen({ onPlay }: { onPlay: () => void }) {
  const t = useTranslation();

  const openSettings = () => {
    window.dispatchEvent(new Event(OPEN_APP_SETTINGS_EVENT));
  };

  return (
    <div className="main-screen-home-layout main-screen-home-layout-logo">
      <section className="main-screen-welcome-card main-screen-logo-card">
        <div className="main-screen-brand-lockup">
          <h1 className="premium-visually-hidden">{t('ui.landing.brand')}</h1>
          <div className="premium-brand-frame">
            <span className="premium-brand-frame-corner premium-brand-frame-corner-start" aria-hidden="true" />
            <img className="main-screen-brand-mark" src={LANDING_BRAND_MARK} alt="" draggable={false} />
            <span className="premium-brand-frame-corner premium-brand-frame-corner-end" aria-hidden="true" />
          </div>
        </div>
        <JoinInstruction text={t('ui.landing.joinHint')} />
        <div className="main-screen-home-actions">
          <button
            className="main-screen-play-cta"
            type="button"
            onClick={onPlay}
          >
            <span className="main-screen-play-cta-label">{t('ui.play')}</span>
            <span className="main-screen-play-cta-underline" aria-hidden="true" />
            <span className="main-screen-play-cta-particles" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>

          <button className="main-screen-play-cta main-screen-settings-link" type="button" onClick={openSettings}>
            <span className="main-screen-play-cta-label">{t('settings.title')}</span>
            <span className="main-screen-play-cta-underline" aria-hidden="true" />
            <span className="main-screen-play-cta-particles" aria-hidden="true"><i /><i /><i /></span>
          </button>

        </div>
      </section>
      <LiveChatPanel />
    </div>
  );
}

function ModePickerScreen({
  canStart,
  onBack,
  onMiniGame,
  onTour,
}: {
  canStart: boolean;
  onBack: () => void;
  onMiniGame: () => void;
  onTour: () => void;
}) {
  const t = useTranslation();

  return (
    <div className="main-screen-mode-layout">
      <ScreenBackButton onBack={onBack} />
      <header className="main-screen-section-header premium-mode-header">
        <h2>{t('main.mode.title')}</h2>
        <p className="premium-mode-subtitle">{t('main.mode.subtitle')}</p>
        {!canStart ? <p className="main-screen-start-notice" role="status">{t('ui.needJoinPlayer')}</p> : null}
      </header>
      <div className="main-screen-mode-cards premium-mode-cards" role="group" aria-label={t('main.mode.title')}>
        <button className="main-screen-mode-card main-screen-mode-card-mini premium-mode-card" type="button" onClick={onMiniGame}>
          <span className="premium-mode-card-art" aria-hidden="true">
            <img src={MODE_ASSET_ROOT + '/mini_game_mode_controller.png'} alt="" draggable={false} />
          </span>
          <strong>{t('main.mode.miniGame')}</strong>
          <small>{t('main.mode.miniGameNote')}</small>
          <b>{t('main.mode.chooseMiniGame')}</b>
        </button>
        <button className="main-screen-mode-card main-screen-mode-card-tour premium-mode-card" type="button" onClick={onTour}>
          <span className="premium-mode-card-art" aria-hidden="true">
            <img src={MODE_ASSET_ROOT + '/tour_mode_trophy.png'} alt="" draggable={false} />
          </span>
          <strong>{t('main.mode.tour')}</strong>
          <small>{t('main.mode.tourNote')}</small>
          <b>{t('main.mode.buildTour')}</b>
        </button>
      </div>
    </div>
  );
}

function MiniGameGridScreen({
  title,
  subtitle,
  miniGames,
  direction,
  selectedMiniGames,
  canStart,
  mode,
  onBack,
  onLaunch,
  onStartTour,
  translate,
}: {
  title: string;
  subtitle: string;
  miniGames: MiniGameCardDefinition[];
  direction: TextDirection;
  selectedMiniGames: MiniGameId[];
  canStart: boolean;
  mode: 'single' | 'tour';
  onBack: () => void;
  onLaunch: (miniGameId: MiniGameId) => void;
  onStartTour?: () => void;
  translate: (key: TranslationKey) => string;
}) {
  return (
    <div className={`main-screen-game-grid-layout main-screen-game-grid-layout-${mode}`}>
      <ScreenBackButton onBack={onBack} />
      <header className="main-screen-grid-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {mode === 'tour' ? <strong>{selectedMiniGames.length}/{miniGames.length}</strong> : <span aria-hidden="true">✦</span>}
      </header>

      {!canStart ? <p className="main-screen-grid-notice" role="status">{translate('ui.needJoinPlayer')}</p> : null}
      {/* Disabled launch is intentional; tour selections are still editable before joining. */}
      <div className="main-screen-mini-card-grid" dir={direction} role="group" aria-label={title}>
        {miniGames.map((miniGame) => (
          <button
            key={miniGame.id}
            className={`main-screen-mini-card main-screen-mini-card-${miniGame.id}${selectedMiniGames.includes(miniGame.id) ? ' main-screen-mini-card-selected' : ''}`}
            type="button"
            onClick={() => onLaunch(miniGame.id)}
            disabled={mode === 'single' && !canStart}
            aria-pressed={mode === 'tour' ? selectedMiniGames.includes(miniGame.id) : undefined}
            aria-label={translate(miniGame.titleKey)}
          >
            {mode === 'tour' && selectedMiniGames.includes(miniGame.id) && (
              <span className="main-screen-mini-card-order" aria-hidden="true">
                {'✓'}
              </span>
            )}
            <img className="main-screen-mini-card-bg" src={getMiniGameCardBackground(miniGame.id)} alt="" draggable={false} aria-hidden="true" />
            <span className="main-screen-mini-card-copy">
              <strong>{translate(miniGame.titleKey)}</strong>
              <small>{translate(miniGame.noteKey)}</small>
            </span>
          </button>
        ))}
      </div>
      {miniGames.length === 0 ? <p className="main-screen-empty-catalog" role="status">{translate('ui.play.noGamesEnabled')}</p> : null}
      {mode === 'tour' ? (
        <footer className="main-screen-tour-footer">
          <button type="button" onClick={onStartTour} disabled={!canStart || selectedMiniGames.length === 0}>{translate('ui.play.startSelectedTour')} <b>›</b></button>
        </footer>
      ) : null}
    </div>
  );
}

function ScreenBackButton({ onBack }: { onBack: () => void }) {
  const t = useTranslation();
  const { snapshot } = useGame();

  return <button className="main-screen-back-button" type="button" onClick={onBack}><span aria-hidden="true">{snapshot.direction === 'rtl' ? '›' : '‹'}</span> {t('main.back')}</button>;
}

function JoinInstruction({ text }: { text: string }) {
  const command = '!join';
  const commandIndex = text.indexOf(command);

  if (commandIndex < 0) {
    return <small className="main-screen-join-hint" dir="auto">{text}</small>;
  }

  return (
    <small className="main-screen-join-hint" dir="auto">
      <span>{text.slice(0, commandIndex)}</span>
      <code dir="ltr">{command}</code>
      <span>{text.slice(commandIndex + command.length)}</span>
    </small>
  );
}

function LiveChatPanel() {
  const { status, isConnected, recentMessages } = useTwitchConnection();
  const t = useTranslation();
  const { snapshot } = useGame();
  const feedRef = useRef<HTMLDivElement | null>(null);
  const shouldFollowRef = useRef(true);
  const channelName = status.channelName?.replace(/^#/, '').trim() ?? '';
  const isArabic = snapshot.direction === 'rtl';

  // Preserve the reader's position when they scroll up to review a message.
  // Follow new messages only if they were already at the bottom.
  useEffect(() => {
    const feed = feedRef.current;
    if (feed && shouldFollowRef.current) feed.scrollTop = feed.scrollHeight;
  }, [recentMessages]);

  return (
    <aside className={`main-screen-live-chat premium-live-chat ${isConnected ? 'main-screen-live-chat-connected' : ''}`} aria-label={t('ui.landing.liveChat')}>
      <header className="main-screen-live-chat-header">
        <div className="main-screen-live-chat-heading">
          <span className={isConnected ? 'main-screen-live-dot main-screen-live-dot-on' : 'main-screen-live-dot main-screen-live-dot-off'} />
          <strong>{t('ui.landing.liveChat')}</strong>
          <span className="premium-chat-connection" aria-label={isConnected ? 'Connected' : 'Offline'}>
            {isConnected ? (isArabic ? 'متصل' : 'ONLINE') : (isArabic ? 'غير متصل' : 'OFFLINE')}
          </span>
        </div>
        {channelName ? (
          <b className="main-screen-streamer-name" dir="ltr" title={channelName}>#{channelName}</b>
        ) : null}
      </header>

      <div
        ref={feedRef}
        className="premium-chat-feed"
        role="log"
        aria-label={isArabic ? 'رسائل شات تويتش' : 'Twitch chat messages'}
        aria-live="polite"
        aria-relevant="additions"
        onScroll={(event) => {
          const element = event.currentTarget;
          shouldFollowRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 44;
        }}
      >
        {recentMessages.length === 0 ? (
          <div className="premium-chat-empty">
            <span className="premium-chat-empty-light" aria-hidden="true" />
            <strong>{isConnected ? (isArabic ? 'جاهزين للشات!' : 'CHAT IS READY') : (isArabic ? 'الشات مش متصل' : 'CHAT OFFLINE')}</strong>
            <p>{isConnected
              ? (isArabic ? 'أي رسالة جديدة على تويتش هتظهر هنا.' : 'New Twitch messages will appear here.')
              : (isArabic ? 'وصّلي تويتش من الإعدادات علشان تعرضي الرسائل هنا.' : 'Connect Twitch in Settings to show live messages.')}</p>
          </div>
        ) : (
          <div className="premium-chat-messages">
            {recentMessages.map(({ key, message }) => (
              <div className="premium-chat-message" key={key}>
                <div className="premium-chat-message-meta">
                  <span className={`premium-chat-username ${message.isBroadcaster ? 'premium-chat-broadcaster' : message.isMod ? 'premium-chat-mod' : ''}`} dir="auto" title={message.displayName}>
                    {message.displayName || 'Viewer'}
                  </span>
                  {message.isBroadcaster ? <span className="premium-chat-badge" title="Broadcaster">HOST</span> : null}
                  {message.isMod && !message.isBroadcaster ? <span className="premium-chat-badge" title="Moderator">MOD</span> : null}
                  <time className="premium-chat-timestamp" dateTime={new Date(message.timestamp || Date.now()).toISOString()}>
                    {new Date(message.timestamp || Date.now()).toLocaleTimeString(isArabic ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <p className="premium-chat-message-text" dir="auto">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
