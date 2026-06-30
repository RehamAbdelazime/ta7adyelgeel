import { useEffect, useMemo, useState } from 'react';
import type { MiniGameId } from '../../../game-core/minigames/minigame-types';
import { MINI_GAME_REGISTRY } from '../../../game-core/minigames/minigame-registry';
import type { TranslationKey } from '../../../game-core/localization/locale-types';
import type { TwitchChatMessage } from '../../../game-core/twitch/twitch-message-types';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { useTranslation } from '../../i18n/useTranslation';

type ScreenStep = 'home' | 'mode' | 'mini-game-grid' | 'tour-grid';

// Derived from MINI_GAME_REGISTRY — never hardcoded here.
// Adding/removing a game only requires editing minigame-registry.ts.
const MINI_GAME_CARDS = MINI_GAME_REGISTRY.filter((g) => g.visibleInPicker);
type MiniGameCardDefinition = typeof MINI_GAME_CARDS[number];

type LiveChatItem = TwitchChatMessage & {
  id: string;
};

const MODE_ASSET_ROOT = './assets/game/runtime/ui/main';
const FOOD_ORIGIN_CARD_BACKGROUND = `${MODE_ASSET_ROOT}/food_origin_card_background.png`;
const LANDING_LOGO_AR = `${MODE_ASSET_ROOT}/ta7ady_landing_logo_ar.png`;
const LANDING_LOGO_EN = `${MODE_ASSET_ROOT}/ta7ady_landing_logo_en.png`;

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
  const availableMiniGames = MINI_GAME_CARDS;
  const [selectedTourMiniGames, setSelectedTourMiniGames] = useState<MiniGameId[]>([]);
  const canStart = snapshot.tour.canStartTour && snapshot.citizens.some((citizen) => citizen.role === 'official');

  useEffect(() => {
    const availableIds = uniqueMiniGames(availableMiniGames);
    setSelectedTourMiniGames((currentSelected) => {
      const stillAvailable = currentSelected.filter((miniGameId) => availableIds.includes(miniGameId));
      return stillAvailable;
    });
  }, [availableMiniGames]);

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
      {step === 'home' ? <LobbyHomeScreen canStart={canStart} onPlay={openModePicker} /> : null}
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

function LobbyHomeScreen({ canStart, onPlay }: { canStart: boolean; onPlay: () => void }) {
  const { snapshot } = useGame();
  const t = useTranslation();
  const logoSrc = snapshot.locale === 'ar' ? LANDING_LOGO_AR : LANDING_LOGO_EN;

  return (
    <div className="main-screen-home-layout main-screen-home-layout-logo">
      <section className="main-screen-welcome-card main-screen-logo-card">
        <img className="main-screen-brand-logo" src={logoSrc} alt={t('app.logo.main')} draggable={false} />
        {!canStart ? <small className="main-screen-join-hint">{t('ui.landing.joinHint')}</small> : null}
        <button className="main-screen-play-button main-screen-play-button-redesign" type="button" onClick={onPlay} disabled={!canStart}>
          <b>{t('ui.play')}</b>
        </button>
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
      <header className="main-screen-section-header">
        <span>{'\u2726'}</span>
        <h2>{t('main.mode.title')}</h2>
        <span>{'\u2726'}</span>
        <p>{t('main.mode.subtitle')}</p>
      </header>
      <div className="main-screen-mode-cards">
        <button className="main-screen-mode-card main-screen-mode-card-mini" type="button" onClick={onMiniGame} disabled={!canStart}>
          <img src={MODE_ASSET_ROOT + '/mini_game_mode_controller.png'} alt="" draggable={false} />
          <strong>{t('main.mode.miniGame')}</strong>
          <small>{t('main.mode.miniGameNote')}</small>
          <b>{t('main.mode.chooseMiniGame')}</b>
        </button>
        <button className="main-screen-mode-card main-screen-mode-card-tour" type="button" onClick={onTour} disabled={!canStart}>
          <img src={MODE_ASSET_ROOT + '/tour_mode_trophy.png'} alt="" draggable={false} />
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
      <div className="main-screen-mini-card-grid">
        {miniGames.slice(0, 6).map((miniGame) => {
          const selectedOrder = selectedMiniGames.indexOf(miniGame.id) + 1;
          const selected = selectedOrder > 0;
          return (
            <button
              key={miniGame.id}
              className={`main-screen-mini-card main-screen-mini-card-${miniGame.id} ${selected ? 'main-screen-mini-card-selected' : ''}`}
              type="button"
              onClick={() => onLaunch(miniGame.id)}
              disabled={!canStart}
              aria-pressed={mode === 'tour' ? selected : undefined}
              aria-label={translate(miniGame.titleKey)}
            >
              {mode === 'tour' && selected ? <span className="main-screen-mini-card-order" aria-hidden="true">{selectedOrder}</span> : null}
              <img className="main-screen-mini-card-bg" src={getMiniGameCardBackground(miniGame.id)} alt="" draggable={false} aria-hidden="true" />
              <span className="main-screen-mini-card-copy">
                <strong>{translate(miniGame.titleKey)}</strong>
                <small>{translate(miniGame.noteKey)}</small>
              </span>
            </button>
          );
        })}
      </div>
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

  return <button className="main-screen-back-button" type="button" onClick={onBack}>‹ {t('main.back')}</button>;
}

function LiveChatPanel() {
  const { runtime } = useGame();
  const { status, isConnected } = useTwitchConnection();
  const t = useTranslation();
  const [messages, setMessages] = useState<LiveChatItem[]>([]);

  useEffect(() => {
    return runtime.eventBus.subscribe((event) => {
      if (event.type !== 'twitch.chat.message') {
        return;
      }

      const nextMessage: LiveChatItem = {
        ...event.message,
        id: `${event.message.twitchUserId}-${event.message.timestamp}-${event.message.message}`,
      };

      setMessages((currentMessages) => [...currentMessages.slice(-7), nextMessage]);
    });
  }, [runtime.eventBus]);

  const channelName = status.channelName ? status.channelName.replace(/^#/, '') : '';
  const channelLabel = channelName ? `#${channelName}` : t('ui.landing.notConnected');

  return (
    <aside className="main-screen-live-chat" aria-label={t('ui.landing.liveChat')}>
      <header>
        <span className={isConnected ? 'main-screen-live-dot main-screen-live-dot-on' : 'main-screen-live-dot'} />
        <strong>{t('ui.landing.liveChat')}</strong>
        <small className="main-screen-streamer-channel"><span>{t('ui.landing.streamer')}</span><b>{channelLabel}</b></small>
      </header>
      <div className="main-screen-chat-list">
        {messages.length > 0 ? messages.map((message) => <LiveChatMessageRow key={message.id} message={message} />) : (
          <div className="main-screen-chat-empty">
            <b>{t('ui.landing.chatWaitingTitle')}</b>
            <span>{t('ui.landing.chatWaitingBody')}</span>
          </div>
        )}
      </div>
    </aside>
  );
}

function LiveChatMessageRow({ message }: { message: LiveChatItem }) {
  const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(message.timestamp));

  return (
    <article className="main-screen-chat-row">
      <div>
        <header><strong>{message.displayName}</strong><small>{time}</small></header>
        <p>{message.message}</p>
      </div>
    </article>
  );
}
