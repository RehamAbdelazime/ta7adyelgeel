import { useEffect, useMemo, useState } from 'react';
import type { MiniGameId } from '../../../game-core/minigames/minigame-types';
import type { TranslationKey } from '../../../game-core/localization/locale-types';
import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../i18n/useTranslation';

type PlayPickerStep = 'mode' | 'mini-game-grid' | 'tour-grid';

type MiniGamePickerDefinition = {
  id: MiniGameId;
  icon: string;
  titleKey: TranslationKey;
  noteKey: TranslationKey;
};

const MINI_GAME_PICKER_DEFINITIONS: MiniGamePickerDefinition[] = [
  { id: 'food-origin',   icon: '\u{1F35C}', titleKey: 'minigame.foodOrigin.title',   noteKey: 'minigame.foodOrigin.note' },
  { id: 'shape-count',   icon: '\u{1F537}', titleKey: 'minigame.shapeCount.title',   noteKey: 'minigame.shapeCount.note' },
  { id: 'maze-gates',    icon: '\u{1F300}', titleKey: 'minigame.mazeGates.title',    noteKey: 'minigame.mazeGates.note' },
  { id: 'before-after',  icon: '\u{23F3}',  titleKey: 'minigame.beforeAfter.title',  noteKey: 'minigame.beforeAfter.note' },
  { id: 'guess-logo',    icon: '\u{2728}',  titleKey: 'minigame.guessLogo.title',    noteKey: 'minigame.guessLogo.note' },
  { id: 'count-the-beat',icon: '\u{1F3B5}', titleKey: 'minigame.countTheBeat.title', noteKey: 'minigame.countTheBeat.note' },
  { id: 'lucky-cup',     icon: '\u{1F3B2}', titleKey: 'minigame.luckyCup.title',     noteKey: 'minigame.luckyCup.note' },
];

function uniqueMiniGames(miniGames: MiniGamePickerDefinition[]): MiniGameId[] {
  return [...new Set(miniGames.map((miniGame) => miniGame.id))];
}

export function PlayLauncher() {
  const { actions, snapshot } = useGame();
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [pickerStep, setPickerStep] = useState<PlayPickerStep>('mode');
  const availableMiniGames = useMemo(() => {
    const enabled = new Set(snapshot.hostSettings.enabledMiniGameIds);
    const filtered = MINI_GAME_PICKER_DEFINITIONS.filter((miniGame) => enabled.has(miniGame.id));
    return filtered.length > 0 ? filtered : MINI_GAME_PICKER_DEFINITIONS;
  }, [snapshot.hostSettings.enabledMiniGameIds]);
  const [selectedTourMiniGames, setSelectedTourMiniGames] = useState<MiniGameId[]>([]);
  const canStart = snapshot.tour.canStartTour && snapshot.citizens.some((citizen) => citizen.role === 'official');
  const shouldShow = !snapshot.tour.isTourActive && !snapshot.tour.isCleanupActive;
  const labels = {
    play: t('ui.play'),
    miniGameTitle: t('ui.miniGame'),
    miniGameNote: t('ui.miniGameNote'),
    tourTitle: t('ui.tour'),
    tourNote: t('ui.tourNote'),
    waiting: t('ui.needJoinPlayer'),
    close: t('ui.close'),
    back: t('ui.play.back'),
    chooseMiniGame: t('ui.play.chooseMiniGame'),
    chooseTourGames: t('ui.play.chooseTourGames'),
    startSelectedTour: t('ui.play.startSelectedTour'),
    selectedCount: t('ui.play.selectedCount'),
    randomOrder: t('ui.play.randomOrder'),
    oneRoundPicked: t('ui.play.oneRoundPicked'),
    tourGamesHint: t('ui.play.tourGamesHint'),
  };

  useEffect(() => {
    const availableIds = uniqueMiniGames(availableMiniGames);
    setSelectedTourMiniGames((currentSelected) => {
      const stillAvailable = currentSelected.filter((miniGameId) => availableIds.includes(miniGameId));
      return stillAvailable;
    });
  }, [availableMiniGames]);

  if (!shouldShow) {
    return null;
  }

  const openPicker = () => {
    setPickerStep('mode');
    setSelectedTourMiniGames([]);
    setIsBursting(false);
    requestAnimationFrame(() => setIsBursting(true));
    window.setTimeout(() => setIsOpen(true), 220);
    window.setTimeout(() => setIsBursting(false), 840);
  };

  const closePicker = () => {
    setIsOpen(false);
    setPickerStep('mode');
  };

  const launchMiniGame = (miniGameId: MiniGameId) => {
    if (!canStart) {
      return;
    }
    closePicker();
    actions.startQuickMiniGame(miniGameId);
  };

  const launchSelectedTour = () => {
    if (!canStart || selectedTourMiniGames.length === 0) {
      return;
    }
    closePicker();
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

  const getMiniGameText = (miniGame: MiniGamePickerDefinition) => {
    return { title: t(miniGame.titleKey), note: t(miniGame.noteKey) };
  };

  const isCardSelectedForTour = (miniGameId: MiniGameId) => selectedTourMiniGames.includes(miniGameId);

  return (
    <div className={`play-launcher-layer ${isOpen ? 'play-launcher-layer-open' : ''}`} dir={snapshot.direction}>
      <button
        className={`center-play-button ${isBursting ? 'center-play-button-burst' : ''} ${canStart ? 'center-play-button-ready' : 'center-play-button-waiting'}`}
        type="button"
        onClick={openPicker}
        aria-label={labels.play}
      >
        <span className="center-play-glow" aria-hidden="true" />
        <span className="center-play-icon" aria-hidden="true">Ã¢â€“Â¶</span>
        <span className="center-play-core">{labels.play}</span>
        <span className="center-play-spark center-play-spark-a" aria-hidden="true">Ã¢Å“Â¦</span>
        <span className="center-play-spark center-play-spark-b" aria-hidden="true">Ã¢Å“Â§</span>
        <i className="center-play-particle center-play-particle-1" aria-hidden="true" />
        <i className="center-play-particle center-play-particle-2" aria-hidden="true" />
        <i className="center-play-particle center-play-particle-3" aria-hidden="true" />
        <i className="center-play-particle center-play-particle-4" aria-hidden="true" />
        <i className="center-play-particle center-play-particle-5" aria-hidden="true" />
        <i className="center-play-particle center-play-particle-6" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className={`play-choice-modal play-choice-modal-${pickerStep}`} role="dialog" aria-modal="false" aria-label={labels.play}>
          <button className="play-choice-close" type="button" onClick={closePicker} aria-label={labels.close}>Ãƒâ€”</button>
          {pickerStep !== 'mode' ? <button className="play-choice-back" type="button" onClick={() => setPickerStep('mode')}>{snapshot.direction === 'rtl' ? 'Ã¢â‚¬Âº' : 'Ã¢â‚¬Â¹'} {labels.back}</button> : null}
          {!canStart ? <p className="play-choice-warning">{labels.waiting}</p> : null}

          {pickerStep === 'mode' ? (
            <div className="play-choice-cards">
              <button className="play-choice-card play-choice-card-mini" type="button" onClick={() => setPickerStep('mini-game-grid')} disabled={!canStart}>
                <span className="play-choice-icon">Ã°Å¸Å½Â®</span>
                <strong>{labels.miniGameTitle}</strong>
                <small>{labels.miniGameNote}</small>
              </button>
              <button className="play-choice-card play-choice-card-tour" type="button" onClick={() => setPickerStep('tour-grid')} disabled={!canStart}>
                <span className="play-choice-icon">Ã°Å¸Å½Â¤</span>
                <strong>{labels.tourTitle}</strong>
                <small>{labels.tourNote}</small>
              </button>
            </div>
          ) : null}

          {pickerStep === 'mini-game-grid' ? (
            <div className="play-mini-game-picker play-mini-game-picker-single">
              <header className="play-picker-header">
                <strong>{labels.chooseMiniGame}</strong>
                <span>{labels.oneRoundPicked}</span>
              </header>
              <div className="play-mini-game-grid play-mini-game-grid-portrait">
                {availableMiniGames.map((miniGame) => {
                  const text = getMiniGameText(miniGame);
                  return (
                    <button key={miniGame.id} className="play-mini-game-tile play-mini-game-tile-launch" type="button" onClick={() => launchMiniGame(miniGame.id)} disabled={!canStart}>
                      <span className="play-mini-game-icon">{miniGame.icon}</span>
                      <strong>{text.title}</strong>
                      <small>{text.note}</small>
                      <em>START</em>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {pickerStep === 'tour-grid' ? (
            <div className="play-mini-game-picker play-mini-game-picker-tour">
              <header className="play-picker-header">
                <strong>{labels.chooseTourGames}</strong>
                <span>{labels.selectedCount}: {selectedTourMiniGames.length} Ã‚Â· {labels.randomOrder}</span>
                <em>{labels.tourGamesHint}</em>
              </header>
              <div className="play-mini-game-grid play-mini-game-grid-portrait play-mini-game-grid-selectable">
                {availableMiniGames.map((miniGame) => {
                  const text = getMiniGameText(miniGame);
                  const selectedOrder = selectedTourMiniGames.indexOf(miniGame.id) + 1;
                  const selected = selectedOrder > 0;
                  return (
                    <button
                      key={miniGame.id}
                      className={`play-mini-game-tile play-mini-game-select-tile ${selected ? 'play-mini-game-select-tile-active' : ''}`}
                      type="button"
                      onClick={() => toggleTourMiniGame(miniGame.id)}
                      disabled={!canStart}
                      aria-pressed={selected}
                    >
                      {selected ? <span className="play-mini-game-order-badge" aria-hidden="true">{selectedOrder}</span> : null}
                      <span className="play-mini-game-icon">{miniGame.icon}</span>
                      <strong>{text.title}</strong>
                      <small>{text.note}</small>
                      <em>{selected ? 'SELECTED' : 'SELECT'}</em>
                    </button>
                  );
                })}
              </div>
              <button className="play-start-selected-tour" type="button" onClick={launchSelectedTour} disabled={!canStart || selectedTourMiniGames.length === 0}>
                {labels.startSelectedTour}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
