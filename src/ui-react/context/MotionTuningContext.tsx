import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type MotionTuning = {
  version: number;
  curtain: {
    closeMs: number;
    openMs: number;
    audioDurationFallbackMs: number;
    openBeforeAudioEndMs: number;
    closedHoldAfterCloseMs: number;
    blackoutFadeMs: number;
    volume: number;
  };
  citizens: {
    joinEnterMs: number;
    walkPreTranslateMs: number;
    sideToChoiceMs: number;
    defaultMoveMs: number;
    championWalkMs: number;
    championVictoryDelayMs: number;
    championVictoryLoopMs: number;
    walkEasing: string;
    defaultEasing: string;
  };
};

type MotionTuningContextValue = {
  tuning: MotionTuning;
  configPath: string;
  loadedAt: number | null;
  lastError: string | null;
  reloadMotionTuning: () => Promise<{ ok: boolean; error?: string }>;
};

const MOTION_CONFIG_PATH = './assets/game/runtime/config/motion-tuning.json';

export const DEFAULT_MOTION_TUNING: MotionTuning = {
  version: 1,
  curtain: {
    closeMs: 4700,
    openMs: 1150,
    audioDurationFallbackMs: 5850,
    openBeforeAudioEndMs: 1050,
    closedHoldAfterCloseMs: 160,
    blackoutFadeMs: 420,
    volume: 0.78,
  },
  citizens: {
    joinEnterMs: 620,
    walkPreTranslateMs: 320,
    sideToChoiceMs: 2600,
    defaultMoveMs: 1750,
    championWalkMs: 2700,
    championVictoryDelayMs: 3300,
    championVictoryLoopMs: 760,
    walkEasing: 'cubic-bezier(.32,0,.18,1)',
    defaultEasing: 'cubic-bezier(.24,.08,.22,1)',
  },
};

const MotionTuningContext = createContext<MotionTuningContextValue | null>(null);

export function MotionTuningProvider({ children }: { children: ReactNode }) {
  const [tuning, setTuning] = useState<MotionTuning>(DEFAULT_MOTION_TUNING);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const reloadMotionTuning = useCallback(async () => {
    try {
      const response = await fetch(`${MOTION_CONFIG_PATH}?v=${Date.now()}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawConfig = await response.json();
      const normalized = normalizeMotionTuning(rawConfig);
      setTuning(normalized);
      setLoadedAt(Date.now());
      setLastError(null);
      applyMotionCssVariables(normalized);
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown motion config error';
      setLastError(message);
      applyMotionCssVariables(DEFAULT_MOTION_TUNING);
      return { ok: false, error: message };
    }
  }, []);

  useEffect(() => {
    applyMotionCssVariables(DEFAULT_MOTION_TUNING);
    void reloadMotionTuning();
  }, [reloadMotionTuning]);

  const value = useMemo<MotionTuningContextValue>(() => ({
    tuning,
    configPath: MOTION_CONFIG_PATH,
    loadedAt,
    lastError,
    reloadMotionTuning,
  }), [lastError, loadedAt, reloadMotionTuning, tuning]);

  return <MotionTuningContext.Provider value={value}>{children}</MotionTuningContext.Provider>;
}

export function useMotionTuning(): MotionTuningContextValue {
  const context = useContext(MotionTuningContext);

  if (!context) {
    throw new Error('useMotionTuning must be used inside MotionTuningProvider.');
  }

  return context;
}

function normalizeMotionTuning(rawConfig: unknown): MotionTuning {
  const input = isRecord(rawConfig) ? rawConfig : {};
  const curtain = isRecord(input.curtain) ? input.curtain : {};
  const citizens = isRecord(input.citizens) ? input.citizens : {};

  return {
    version: readNumber(input.version, DEFAULT_MOTION_TUNING.version, 1, 99),
    curtain: {
      closeMs: readNumber(curtain.closeMs, DEFAULT_MOTION_TUNING.curtain.closeMs, 500, 10_000),
      openMs: readNumber(curtain.openMs, DEFAULT_MOTION_TUNING.curtain.openMs, 250, 6_000),
      audioDurationFallbackMs: readNumber(curtain.audioDurationFallbackMs, DEFAULT_MOTION_TUNING.curtain.audioDurationFallbackMs, 1_500, 30_000),
      openBeforeAudioEndMs: readNumber(curtain.openBeforeAudioEndMs, DEFAULT_MOTION_TUNING.curtain.openBeforeAudioEndMs, 100, 6_000),
      closedHoldAfterCloseMs: readNumber(curtain.closedHoldAfterCloseMs, DEFAULT_MOTION_TUNING.curtain.closedHoldAfterCloseMs, 0, 5_000),
      blackoutFadeMs: readNumber(curtain.blackoutFadeMs, DEFAULT_MOTION_TUNING.curtain.blackoutFadeMs, 0, 3_000),
      volume: readNumber(curtain.volume, DEFAULT_MOTION_TUNING.curtain.volume, 0, 1),
    },
    citizens: {
      joinEnterMs: readNumber(citizens.joinEnterMs, DEFAULT_MOTION_TUNING.citizens.joinEnterMs, 120, 4_000),
      walkPreTranslateMs: readNumber(citizens.walkPreTranslateMs, DEFAULT_MOTION_TUNING.citizens.walkPreTranslateMs, 0, 2_000),
      sideToChoiceMs: readNumber(citizens.sideToChoiceMs, DEFAULT_MOTION_TUNING.citizens.sideToChoiceMs, 250, 8_000),
      defaultMoveMs: readNumber(citizens.defaultMoveMs, DEFAULT_MOTION_TUNING.citizens.defaultMoveMs, 250, 8_000),
      championWalkMs: readNumber(citizens.championWalkMs, DEFAULT_MOTION_TUNING.citizens.championWalkMs, 250, 9_000),
      championVictoryDelayMs: readNumber(citizens.championVictoryDelayMs, DEFAULT_MOTION_TUNING.citizens.championVictoryDelayMs, 0, 12_000),
      championVictoryLoopMs: readNumber(citizens.championVictoryLoopMs, DEFAULT_MOTION_TUNING.citizens.championVictoryLoopMs, 250, 3_000),
      walkEasing: readEasing(citizens.walkEasing, DEFAULT_MOTION_TUNING.citizens.walkEasing),
      defaultEasing: readEasing(citizens.defaultEasing, DEFAULT_MOTION_TUNING.citizens.defaultEasing),
    },
  };
}

function applyMotionCssVariables(tuning: MotionTuning) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty('--motion-curtain-close-ms', `${tuning.curtain.closeMs}ms`);
  root.style.setProperty('--motion-curtain-open-ms', `${tuning.curtain.openMs}ms`);
  root.style.setProperty('--motion-curtain-open-delay-ms', `${Math.max(tuning.curtain.closeMs + tuning.curtain.blackoutFadeMs + tuning.curtain.closedHoldAfterCloseMs, tuning.curtain.audioDurationFallbackMs - tuning.curtain.openBeforeAudioEndMs)}ms`);
  root.style.setProperty('--motion-curtain-blackout-ms', `${tuning.curtain.blackoutFadeMs}ms`);
  root.style.setProperty('--motion-citizen-join-enter-ms', `${tuning.citizens.joinEnterMs}ms`);
  root.style.setProperty('--motion-citizen-walk-pre-translate-ms', `${tuning.citizens.walkPreTranslateMs}ms`);
  root.style.setProperty('--motion-citizen-side-choice-ms', `${tuning.citizens.sideToChoiceMs}ms`);
  root.style.setProperty('--motion-citizen-default-move-ms', `${tuning.citizens.defaultMoveMs}ms`);
  root.style.setProperty('--motion-citizen-champion-walk-ms', `${tuning.citizens.championWalkMs}ms`);
  root.style.setProperty('--motion-citizen-victory-loop-ms', `${tuning.citizens.championVictoryLoopMs}ms`);
  root.style.setProperty('--motion-citizen-walk-easing', tuning.citizens.walkEasing);
  root.style.setProperty('--motion-citizen-default-easing', tuning.citizens.defaultEasing);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNumber(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, numeric));
}

function readEasing(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed;
}
