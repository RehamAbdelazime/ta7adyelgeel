import { useRef } from 'react';
import { GameCanvas } from '../GameCanvas';
import { GameplayOverlay } from '../gameplay/GameplayOverlay';
import { VisualWorldLayer } from './VisualWorldLayer';
import { SceneCurtainTransitionLayer, useCurtainSceneTransition, type GameSceneKey } from './SceneCurtainTransition';
import { GameViewSnapshotProvider, useGame } from '../../context/GameContext';
import { RuntimeAudioManager } from '../audio/RuntimeAudioManager';
import { HostMascotLayer } from './HostMascotLayer';
import { RoundRevealCompletionProvider } from '../gameplay/shared/RoundRevealCompletionContext';

/**
 * Fixed 16:9 game stage.
 *
 * The game scene is authored at 1920x1080, then fitted into the available window without
 * stretching. Static visuals are rendered as independent image elements in VisualWorldLayer;
 * A reserved canvas layer can host future realtime effects; gameplay overlays sit on the same stage so all
 * positions stay aligned at every resolution.
 */
export function GameSceneStage() {
  const { snapshot } = useGame();
  const desiredScene: GameSceneKey = snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open' ? 'minigame' : 'lobby';
  const { renderedScene, curtainPhase, curtainTargetScene, transitionId } = useCurtainSceneTransition(desiredScene);
  // The scene's children must not see the destination snapshot before the two
  // curtain panels have fully closed. Otherwise the upcoming screen flashes
  // in front of the departing one even though `renderedScene` is still old.
  const committedViewRef = useRef({ scene: desiredScene, snapshot });
  if (renderedScene === desiredScene && curtainPhase !== 'closing') {
    committedViewRef.current = { scene: desiredScene, snapshot };
  }
  const viewSnapshot = committedViewRef.current.snapshot;

  return (
    <div className="game-scene-viewport" aria-hidden="false">
      <div className={`game-scene-stage game-scene-stage-${renderedScene}`}>
        <RoundRevealCompletionProvider>
          <GameViewSnapshotProvider snapshot={viewSnapshot}>
            <VisualWorldLayer sceneOverride={renderedScene} />
            <GameCanvas />
            <GameplayOverlay sceneOverride={renderedScene} />
            <HostMascotLayer scene={renderedScene} />
          </GameViewSnapshotProvider>
          <RuntimeAudioManager renderedScene={renderedScene} curtainPhase={curtainPhase} transitionId={transitionId} />
          <SceneCurtainTransitionLayer phase={curtainPhase} targetScene={curtainTargetScene} transitionId={transitionId} />
        </RoundRevealCompletionProvider>
      </div>
    </div>
  );
}
