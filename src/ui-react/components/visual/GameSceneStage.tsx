import { GameCanvas } from '../GameCanvas';
import { GameplayOverlay } from '../gameplay/GameplayOverlay';
import { VisualWorldLayer } from './VisualWorldLayer';
import { SceneCurtainTransitionLayer, useCurtainSceneTransition, type GameSceneKey } from './SceneCurtainTransition';
import { useGame } from '../../context/GameContext';
import { RuntimeAudioManager } from '../audio/RuntimeAudioManager';
import { HostMascotLayer } from './HostMascotLayer';

/**
 * Fixed 16:9 game stage.
 *
 * The game scene is authored at 1920x1080, then fitted into the available window without
 * stretching. Static visuals are rendered as independent image elements in VisualWorldLayer;
 * Pixi is kept for realtime effects, and gameplay overlays sit on the same stage so all
 * positions stay aligned at every resolution.
 */
export function GameSceneStage() {
  const { snapshot } = useGame();
  const desiredScene: GameSceneKey = snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open' ? 'minigame' : 'lobby';
  const { renderedScene, curtainPhase, curtainTargetScene, transitionId } = useCurtainSceneTransition(desiredScene);

  return (
    <div className="game-scene-viewport" aria-hidden="false">
      <div className={`game-scene-stage game-scene-stage-${renderedScene}`}>
        <VisualWorldLayer sceneOverride={renderedScene} />
        <GameCanvas />
        <GameplayOverlay sceneOverride={renderedScene} />
        <HostMascotLayer scene={renderedScene} />
        <RuntimeAudioManager renderedScene={renderedScene} curtainPhase={curtainPhase} transitionId={transitionId} />
        <SceneCurtainTransitionLayer phase={curtainPhase} targetScene={curtainTargetScene} transitionId={transitionId} />
      </div>
    </div>
  );
}
