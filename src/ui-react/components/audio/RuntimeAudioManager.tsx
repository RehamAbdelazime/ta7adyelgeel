import { useEffect, useRef, type MutableRefObject } from 'react';
import { useAudioTuning, type AudioTuning } from '../../context/AudioTuningContext';
import type { GameSceneKey } from '../visual/SceneCurtainTransition';

type CurtainPhase = 'idle' | 'closing' | 'opening';
type LoopTrackKey = 'mainScreen' | 'miniGame';
type AudioElements = Record<LoopTrackKey | 'curtain', HTMLAudioElement | null>;
type FadeKey = keyof AudioElements;

type RuntimeAudioManagerProps = {
  renderedScene: GameSceneKey;
  curtainPhase: CurtainPhase;
  transitionId: number;
};

const LOOP_TRACK_BY_SCENE: Record<GameSceneKey, LoopTrackKey> = {
  lobby: 'mainScreen',
  minigame: 'miniGame',
};

export function RuntimeAudioManager({ renderedScene, curtainPhase, transitionId }: RuntimeAudioManagerProps) {
  const { tuning } = useAudioTuning();
  const elementsRef = useRef<AudioElements>({ mainScreen: null, miniGame: null, curtain: null });
  const activeLoopRef = useRef<LoopTrackKey | null>(null);
  const activeCurtainTransitionRef = useRef<number | null>(null);
  const lastRequestedLoopRef = useRef<LoopTrackKey>('mainScreen');
  const timeoutIdsRef = useRef<number[]>([]);
  const fadeFrameIdsRef = useRef<Partial<Record<FadeKey, number>>>({});
  const tuningRef = useRef(tuning);

  useEffect(() => {
    tuningRef.current = tuning;

    const activeLoop = activeLoopRef.current;
    if (activeLoop) {
      const activeAudio = elementsRef.current[activeLoop];
      if (activeAudio && !activeAudio.paused) {
        activeAudio.volume = getTrackVolume(tuning, activeLoop);
      }
    }

    const curtainAudio = elementsRef.current.curtain;
    if (curtainAudio && !curtainAudio.paused) {
      curtainAudio.volume = getTrackVolume(tuning, 'curtain');
    }
  }, [tuning]);

  useEffect(() => {
    createOrUpdateAudioElements(elementsRef.current, tuning);
  }, [tuning.tracks.mainScreen.src, tuning.tracks.miniGame.src, tuning.tracks.curtain.src]);

  useEffect(() => {
    const tuningNow = tuningRef.current;
    clearScheduledTimeouts(timeoutIdsRef.current);

    if (!tuningNow.enabled) {
      stopAllAudio(elementsRef.current, fadeFrameIdsRef.current);
      activeLoopRef.current = null;
      activeCurtainTransitionRef.current = null;
      return;
    }

    if (curtainPhase !== 'idle') {
      fadeOutCurrentLoop({
        audioElements: elementsRef.current,
        fadeFrameIds: fadeFrameIdsRef.current,
        activeLoopRef,
        tuning: tuningNow,
        durationMs: tuningNow.transitions.backgroundFadeOutMs,
      });

      if (curtainPhase === 'closing' && activeCurtainTransitionRef.current !== transitionId) {
        activeCurtainTransitionRef.current = transitionId;
        const curtainStartDelayMs = tuningNow.transitions.backgroundFadeOutMs + tuningNow.transitions.silenceBeforeCurtainMs;
        const startCurtainTimer = window.setTimeout(() => {
          startCurtainSound(elementsRef.current, fadeFrameIdsRef.current, tuningRef.current);
        }, curtainStartDelayMs);
        timeoutIdsRef.current.push(startCurtainTimer);
      }

      return;
    }

    activeCurtainTransitionRef.current = null;
    fadeCurtainOut(elementsRef.current, fadeFrameIdsRef.current, tuningNow);

    const targetLoop = LOOP_TRACK_BY_SCENE[renderedScene];
    const startBackgroundTimer = window.setTimeout(() => {
      startLoopTrack({
        audioElements: elementsRef.current,
        fadeFrameIds: fadeFrameIdsRef.current,
        activeLoopRef,
        lastRequestedLoopRef,
        tuning: tuningRef.current,
        targetLoop,
      });
    }, tuningNow.transitions.curtainFadeOutMs + tuningNow.transitions.silenceAfterCurtainMs);

    timeoutIdsRef.current.push(startBackgroundTimer);
  }, [curtainPhase, renderedScene, transitionId, tuning]);

  useEffect(() => {
    const unlockAudio = () => {
      const currentLoop = lastRequestedLoopRef.current;
      const audio = elementsRef.current[currentLoop];
      if (audio && audio.volume > 0 && audio.paused) {
        safePlay(audio);
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);

      clearScheduledTimeouts(timeoutIdsRef.current);
      stopAllAudio(elementsRef.current, fadeFrameIdsRef.current);
    };
  }, []);

  return null;
}

function createOrUpdateAudioElements(audioElements: AudioElements, tuning: AudioTuning) {
  audioElements.mainScreen = createOrUpdateAudioElement(audioElements.mainScreen, tuning.tracks.mainScreen.src, true);
  audioElements.miniGame = createOrUpdateAudioElement(audioElements.miniGame, tuning.tracks.miniGame.src, true);
  audioElements.curtain = createOrUpdateAudioElement(audioElements.curtain, tuning.tracks.curtain.src, false);
}

function createOrUpdateAudioElement(current: HTMLAudioElement | null, src: string, loop: boolean) {
  if (!current) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.loop = loop;
    audio.volume = 0;
    return audio;
  }

  if (current.src !== new URL(src, window.location.href).href) {
    current.pause();
    current.src = src;
    current.currentTime = 0;
    current.volume = 0;
  }

  current.loop = loop;
  current.preload = 'auto';
  return current;
}

function startLoopTrack({
  audioElements,
  fadeFrameIds,
  activeLoopRef,
  lastRequestedLoopRef,
  tuning,
  targetLoop,
}: {
  audioElements: AudioElements;
  fadeFrameIds: Partial<Record<FadeKey, number>>;
  activeLoopRef: MutableRefObject<LoopTrackKey | null>;
  lastRequestedLoopRef: MutableRefObject<LoopTrackKey>;
  tuning: AudioTuning;
  targetLoop: LoopTrackKey;
}) {
  const targetAudio = audioElements[targetLoop];
  if (!targetAudio) {
    return;
  }

  const previousLoop = activeLoopRef.current;

  if (previousLoop && previousLoop !== targetLoop) {
    const previousAudio = audioElements[previousLoop];
    fadeAudio(previousLoop, previousAudio, 0, tuning.transitions.backgroundSceneSwapFadeMs, fadeFrameIds, true);
  }

  const targetVolume = getTrackVolume(tuning, targetLoop);
  lastRequestedLoopRef.current = targetLoop;
  safePlay(targetAudio);
  fadeAudio(targetLoop, targetAudio, targetVolume, tuning.transitions.backgroundFadeInMs, fadeFrameIds);
  activeLoopRef.current = targetLoop;
}

function fadeOutCurrentLoop({
  audioElements,
  fadeFrameIds,
  activeLoopRef,
  tuning,
  durationMs,
}: {
  audioElements: AudioElements;
  fadeFrameIds: Partial<Record<FadeKey, number>>;
  activeLoopRef: MutableRefObject<LoopTrackKey | null>;
  tuning: AudioTuning;
  durationMs: number;
}) {
  const activeLoop = activeLoopRef.current;

  if (!activeLoop) {
    return;
  }

  const activeAudio = audioElements[activeLoop];
  fadeAudio(activeLoop, activeAudio, 0, durationMs, fadeFrameIds, true);
  activeLoopRef.current = null;
}

function startCurtainSound(audioElements: AudioElements, fadeFrameIds: Partial<Record<FadeKey, number>>, tuning: AudioTuning) {
  const curtainAudio = audioElements.curtain;

  if (!curtainAudio) {
    return;
  }

  curtainAudio.pause();
  curtainAudio.currentTime = 0;
  curtainAudio.volume = 0;
  safePlay(curtainAudio);
  fadeAudio('curtain', curtainAudio, getTrackVolume(tuning, 'curtain'), tuning.transitions.curtainFadeInMs, fadeFrameIds);
}

function fadeCurtainOut(audioElements: AudioElements, fadeFrameIds: Partial<Record<FadeKey, number>>, tuning: AudioTuning) {
  fadeAudio('curtain', audioElements.curtain, 0, tuning.transitions.curtainFadeOutMs, fadeFrameIds, true);
}

function stopAllAudio(audioElements: AudioElements, fadeFrameIds: Partial<Record<FadeKey, number>>) {
  (Object.keys(audioElements) as FadeKey[]).forEach((key) => {
    cancelFade(key, fadeFrameIds);
    const audio = audioElements[key];
    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0;
  });
}

function fadeAudio(
  key: FadeKey,
  audio: HTMLAudioElement | null,
  targetVolume: number,
  durationMs: number,
  fadeFrameIds: Partial<Record<FadeKey, number>>,
  pauseOnComplete = false,
) {
  if (!audio) {
    return;
  }

  cancelFade(key, fadeFrameIds);

  const fromVolume = audio.volume;
  const safeDuration = Math.max(0, durationMs);

  if (safeDuration <= 0) {
    audio.volume = targetVolume;
    if (pauseOnComplete && targetVolume <= 0) {
      audio.pause();
      audio.currentTime = 0;
    }
    return;
  }

  const startedAt = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - startedAt) / safeDuration);
    const eased = easeInOut(t);
    audio.volume = fromVolume + (targetVolume - fromVolume) * eased;

    if (t < 1) {
      fadeFrameIds[key] = window.requestAnimationFrame(step);
      return;
    }

    fadeFrameIds[key] = undefined;
    audio.volume = targetVolume;

    if (pauseOnComplete && targetVolume <= 0) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  fadeFrameIds[key] = window.requestAnimationFrame(step);
}

function cancelFade(key: FadeKey, fadeFrameIds: Partial<Record<FadeKey, number>>) {
  const frameId = fadeFrameIds[key];

  if (typeof frameId === 'number') {
    window.cancelAnimationFrame(frameId);
    fadeFrameIds[key] = undefined;
  }
}

function getTrackVolume(tuning: AudioTuning, key: LoopTrackKey | 'curtain') {
  const trackVolume = key === 'mainScreen'
    ? tuning.tracks.mainScreen.volume
    : key === 'miniGame'
      ? tuning.tracks.miniGame.volume
      : tuning.tracks.curtain.volume;

  return Math.max(0, Math.min(1, trackVolume * tuning.globalVolume));
}

function safePlay(audio: HTMLAudioElement) {
  void audio.play().catch(() => undefined);
}

function clearScheduledTimeouts(timeoutIds: number[]) {
  timeoutIds.forEach((timerId) => window.clearTimeout(timerId));
  timeoutIds.length = 0;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
