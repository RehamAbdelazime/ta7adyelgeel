import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMotionTuning } from '../../context/MotionTuningContext';

export type GameSceneKey = 'lobby' | 'minigame';

type CurtainPhase = 'idle' | 'closing' | 'opening';

type CurtainTransitionState = {
  phase: CurtainPhase;
  targetScene: GameSceneKey;
  transitionId: number;
};

export type CurtainSceneTransition = {
  renderedScene: GameSceneKey;
  curtainPhase: CurtainPhase;
  curtainTargetScene: GameSceneKey;
  transitionId: number;
};

const SCENE_SWAP_AFTER_CLOSED_MS = 40;
const FINISH_AFTER_OPEN_MS = 100;

export function useCurtainSceneTransition(desiredScene: GameSceneKey): CurtainSceneTransition {
  const { tuning } = useMotionTuning();
  const [renderedScene, setRenderedSceneState] = useState<GameSceneKey>(desiredScene);
  const [transition, setTransition] = useState<CurtainTransitionState>({
    phase: 'idle',
    targetScene: desiredScene,
    transitionId: 0,
  });

  const renderedSceneRef = useRef<GameSceneKey>(desiredScene);
  const pendingSceneRef = useRef<GameSceneKey>(desiredScene);
  const isTransitioningRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const tuningRef = useRef(tuning);

  const setRenderedScene = (scene: GameSceneKey) => {
    renderedSceneRef.current = scene;
    setRenderedSceneState(scene);
  };

  const clearTimers = () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  };

  useEffect(() => {
    tuningRef.current = tuning;
  }, [tuning]);

  useEffect(() => {
    pendingSceneRef.current = desiredScene;
  }, [desiredScene]);

  useEffect(() => {
    if (desiredScene === renderedSceneRef.current || isTransitioningRef.current) {
      return;
    }

    const currentTuning = tuningRef.current;
    isTransitioningRef.current = true;
    clearTimers();

    const transitionId = Date.now();
    setTransition({ phase: 'closing', targetScene: desiredScene, transitionId });

    const audioDurationMs = Number.isFinite(currentTuning.curtain.audioDurationFallbackMs) && currentTuning.curtain.audioDurationFallbackMs > 1800
      ? currentTuning.curtain.audioDurationFallbackMs
      : currentTuning.curtain.closeMs + currentTuning.curtain.openMs + currentTuning.curtain.closedHoldAfterCloseMs;

    const openDelayMs = Math.max(
      currentTuning.curtain.blackoutFadeMs + currentTuning.curtain.closeMs + currentTuning.curtain.closedHoldAfterCloseMs,
      audioDurationMs - currentTuning.curtain.openBeforeAudioEndMs,
    );

    const switchTimer = window.setTimeout(() => {
      // The scene swap happens while the two curtain halves fully cover the stage.
      setRenderedScene(pendingSceneRef.current);
    }, currentTuning.curtain.blackoutFadeMs + currentTuning.curtain.closeMs + SCENE_SWAP_AFTER_CLOSED_MS);

    const openTimer = window.setTimeout(() => {
      setTransition({ phase: 'opening', targetScene: pendingSceneRef.current, transitionId });
    }, openDelayMs);

    const finishTimer = window.setTimeout(() => {
      const targetScene = pendingSceneRef.current;
      setRenderedScene(targetScene);
      setTransition({ phase: 'idle', targetScene, transitionId });
      isTransitioningRef.current = false;
      clearTimers();
    }, openDelayMs + currentTuning.curtain.openMs + FINISH_AFTER_OPEN_MS);

    timersRef.current = [switchTimer, openTimer, finishTimer];
  }, [desiredScene]);

  useEffect(() => {
    return () => {
      clearTimers();
      isTransitioningRef.current = false;
    };
  }, []);

  return {
    renderedScene,
    curtainPhase: transition.phase,
    curtainTargetScene: transition.targetScene,
    transitionId: transition.transitionId,
  };
}

export function SceneCurtainTransitionLayer({
  phase,
  targetScene,
  transitionId,
}: {
  phase: CurtainPhase;
  targetScene: GameSceneKey;
  transitionId: number;
}) {
  const { tuning } = useMotionTuning();

  if (phase === 'idle') {
    return null;
  }

  const style = {
    '--curtain-close-ms': `${tuning.curtain.closeMs}ms`,
    '--curtain-open-ms': `${tuning.curtain.openMs}ms`,
    '--curtain-blackout-ms': `${tuning.curtain.blackoutFadeMs}ms`,
  } as CSSProperties;

  return (
    <div
      className={`scene-curtain-transition scene-curtain-transition-${phase}`}
      data-target-scene={targetScene}
      data-transition-id={transitionId}
      style={style}
      aria-hidden="true"
    >
      <div className="scene-curtain-blackout" />
      <div className="scene-curtain-dim" />
      <img
        className="scene-curtain-panel scene-curtain-panel-left"
        src="./assets/game/runtime/transition/curtain_left_960x1080.png"
        alt=""
        draggable={false}
      />
      <img
        className="scene-curtain-panel scene-curtain-panel-right"
        src="./assets/game/runtime/transition/curtain_right_960x1080.png"
        alt=""
        draggable={false}
      />
    </div>
  );
}
