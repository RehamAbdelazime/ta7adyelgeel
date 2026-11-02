import { useEffect, useMemo, useState } from 'react';
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

// type LiveChatItem = TwitchChatMessage & {
//   id: string;
// };

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

function LobbyHomeScreen({ canStart, onPlay }: { canStart: boolean; onPlay: () => void }) {
  const t = useTranslation();

  const openSettings = () => {
    window.dispatchEvent(new Event(OPEN_APP_SETTINGS_EVENT));
  };

  return (
    <div className="main-screen-home-layout main-screen-home-layout-logo">
      <section className="main-screen-welcome-card main-screen-logo-card">
        <div className="main-screen-brand-lockup">
          <img className="main-screen-brand-mark" src={LANDING_BRAND_MARK} alt="" draggable={false} />

        </div>
        <JoinInstruction text={t('ui.landing.joinHint')} />
        <div className="main-screen-home-actions">
          <button
            className="main-screen-play-cta"
            type="button"
            onClick={onPlay}
            disabled={!canStart}
          >
            <span className="main-screen-play-cta-label">{t('ui.play')}</span>
            <span className="main-screen-play-cta-underline" aria-hidden="true" />
            <span className="main-screen-play-cta-particles" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>


          <button
            className="main-screen-play-cta"
            type="button"
            onClick={openSettings}
          >
            <span className="main-screen-play-cta-label">{t('settings.title')}</span>
            <span className="main-screen-play-cta-underline" aria-hidden="true" />
            <span className="main-screen-play-cta-particles" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
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

      {/* Show every runtime-enabled public game together in a two-row grid. */}
      <div className="main-screen-mini-card-grid" dir={direction} role="group" aria-label="Mini-game choices">
        {miniGames.map((miniGame) => (
          <button
            key={miniGame.id}
            className={`main-screen-mini-card main-screen-mini-card-${miniGame.id}${selectedMiniGames.includes(miniGame.id) ? ' main-screen-mini-card-selected' : ''}`}
            type="button"
            onClick={() => onLaunch(miniGame.id)}
            disabled={!canStart}
            aria-pressed={mode === 'tour' ? selectedMiniGames.includes(miniGame.id) : undefined}
            aria-label={translate(miniGame.titleKey)}
          >
            {mode === 'tour' && selectedMiniGames.includes(miniGame.id) && (
              <span className="main-screen-mini-card-order" aria-hidden="true">
                {selectedMiniGames.indexOf(miniGame.id) + 1}
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
  const { status, isConnected } = useTwitchConnection();
  const t = useTranslation();

  const rawChannelName = status.channelName ? status.channelName.replace(/^#/, '').trim() : '';
  const channelName = rawChannelName;

  return (
    <aside className={`main-screen-live-chat ${isConnected ? 'main-screen-live-chat-connected' : ''}`} aria-label={t('ui.landing.liveChat')}>
      <header className="main-screen-live-chat-header">
        <div className="main-screen-live-chat-heading">
          <span className={isConnected ? 'main-screen-live-dot main-screen-live-dot-on' : 'main-screen-live-dot'} />
          <strong>{t('ui.landing.liveChat')}</strong>
        </div>
        {channelName ? (
          <b className="main-screen-streamer-name" dir="ltr" title={channelName}>{channelName}</b>
        ) : null}
      </header>
    </aside>
  );
}