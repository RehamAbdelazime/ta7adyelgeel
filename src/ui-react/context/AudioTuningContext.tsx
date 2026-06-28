import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AudioTuning = {
  version: number;
  enabled: boolean;
  globalVolume: number;
  tracks: {
    mainScreen: AudioTrackConfig;
    miniGame: AudioTrackConfig;
    curtain: AudioTrackConfig;
  };
  transitions: {
    backgroundFadeOutMs: number;
    silenceBeforeCurtainMs: number;
    curtainFadeInMs: number;
    curtainFadeOutMs: number;
    silenceAfterCurtainMs: number;
    backgroundFadeInMs: number;
    backgroundSceneSwapFadeMs: number;
  };
};

type AudioTrackConfig = {
  src: string;
  volume: number;
};

type AudioTuningContextValue = {
  tuning: AudioTuning;
  configPath: string;
  loadedAt: number | null;
  lastError: string | null;
  reloadAudioTuning: () => Promise<{ ok: boolean; error?: string }>;
  setGlobalVolume: (volume: number) => void;
};

const AUDIO_CONFIG_PATH = './assets/game/runtime/config/audio-tuning.json';
const AUDIO_VOLUME_STORAGE_KEY = 'ta7ady-elgeel.audio.globalVolume';

export const DEFAULT_AUDIO_TUNING: AudioTuning = {
  version: 1,
  enabled: true,
  globalVolume: 1,
  tracks: {
    mainScreen: { src: './assets/game/runtime/audio/main_screen_loop.mp3', volume: 0.32 },
    miniGame: { src: './assets/game/runtime/audio/mini_game_loop.mp4', volume: 0.34 },
    curtain: { src: './assets/game/runtime/audio/curtain_transition.mp3', volume: 0.78 },
  },
  transitions: {
    backgroundFadeOutMs: 280,
    silenceBeforeCurtainMs: 140,
    curtainFadeInMs: 120,
    curtainFadeOutMs: 260,
    silenceAfterCurtainMs: 360,
    backgroundFadeInMs: 900,
    backgroundSceneSwapFadeMs: 650,
  },
};

const AudioTuningContext = createContext<AudioTuningContextValue | null>(null);

export function AudioTuningProvider({ children }: { children: ReactNode }) {
  const [tuning, setTuning] = useState<AudioTuning>(DEFAULT_AUDIO_TUNING);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [userGlobalVolume, setUserGlobalVolumeState] = useState(() => readPersistedGlobalVolume(DEFAULT_AUDIO_TUNING.globalVolume));

  const reloadAudioTuning = useCallback(async () => {
    try {
      const response = await fetch(`${AUDIO_CONFIG_PATH}?v=${Date.now()}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawConfig = await response.json();
      const normalized = normalizeAudioTuning(rawConfig);
      setTuning(normalized);
      setLoadedAt(Date.now());
      setLastError(null);
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown audio config error';
      setTuning(DEFAULT_AUDIO_TUNING);
      setLastError(message);
      return { ok: false, error: message };
    }
  }, []);

  const setGlobalVolume = useCallback((volume: number) => {
    const normalized = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : DEFAULT_AUDIO_TUNING.globalVolume));
    setUserGlobalVolumeState(normalized);

    try {
      window.localStorage.setItem(AUDIO_VOLUME_STORAGE_KEY, String(normalized));
    } catch {
      // Runtime-only volume control still works if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    void reloadAudioTuning();
  }, [reloadAudioTuning]);

  const effectiveTuning = useMemo<AudioTuning>(() => ({
    ...tuning,
    globalVolume: userGlobalVolume,
  }), [tuning, userGlobalVolume]);

  const value = useMemo<AudioTuningContextValue>(() => ({
    tuning: effectiveTuning,
    configPath: AUDIO_CONFIG_PATH,
    loadedAt,
    lastError,
    reloadAudioTuning,
    setGlobalVolume,
  }), [effectiveTuning, lastError, loadedAt, reloadAudioTuning, setGlobalVolume]);

  return <AudioTuningContext.Provider value={value}>{children}</AudioTuningContext.Provider>;
}

export function useAudioTuning(): AudioTuningContextValue {
  const context = useContext(AudioTuningContext);

  if (!context) {
    throw new Error('useAudioTuning must be used inside AudioTuningProvider.');
  }

  return context;
}

function readPersistedGlobalVolume(fallback: number): number {
  try {
    const rawValue = window.localStorage.getItem(AUDIO_VOLUME_STORAGE_KEY);
    if (rawValue === null) return fallback;
    return readNumber(Number(rawValue), fallback, 0, 1);
  } catch {
    return fallback;
  }
}

function normalizeAudioTuning(rawConfig: unknown): AudioTuning {
  const input = isRecord(rawConfig) ? rawConfig : {};
  const tracks = isRecord(input.tracks) ? input.tracks : {};
  const transitions = isRecord(input.transitions) ? input.transitions : {};

  return {
    version: readNumber(input.version, DEFAULT_AUDIO_TUNING.version, 1, 99),
    enabled: typeof input.enabled === 'boolean' ? input.enabled : DEFAULT_AUDIO_TUNING.enabled,
    globalVolume: readNumber(input.globalVolume, DEFAULT_AUDIO_TUNING.globalVolume, 0, 1),
    tracks: {
      mainScreen: readTrack(tracks.mainScreen, DEFAULT_AUDIO_TUNING.tracks.mainScreen),
      miniGame: readTrack(tracks.miniGame, DEFAULT_AUDIO_TUNING.tracks.miniGame),
      curtain: readTrack(tracks.curtain, DEFAULT_AUDIO_TUNING.tracks.curtain),
    },
    transitions: {
      backgroundFadeOutMs: readNumber(transitions.backgroundFadeOutMs, DEFAULT_AUDIO_TUNING.transitions.backgroundFadeOutMs, 0, 5_000),
      silenceBeforeCurtainMs: readNumber(transitions.silenceBeforeCurtainMs, DEFAULT_AUDIO_TUNING.transitions.silenceBeforeCurtainMs, 0, 3_000),
      curtainFadeInMs: readNumber(transitions.curtainFadeInMs, DEFAULT_AUDIO_TUNING.transitions.curtainFadeInMs, 0, 3_000),
      curtainFadeOutMs: readNumber(transitions.curtainFadeOutMs, DEFAULT_AUDIO_TUNING.transitions.curtainFadeOutMs, 0, 3_000),
      silenceAfterCurtainMs: readNumber(transitions.silenceAfterCurtainMs, DEFAULT_AUDIO_TUNING.transitions.silenceAfterCurtainMs, 0, 5_000),
      backgroundFadeInMs: readNumber(transitions.backgroundFadeInMs, DEFAULT_AUDIO_TUNING.transitions.backgroundFadeInMs, 0, 8_000),
      backgroundSceneSwapFadeMs: readNumber(transitions.backgroundSceneSwapFadeMs, DEFAULT_AUDIO_TUNING.transitions.backgroundSceneSwapFadeMs, 0, 8_000),
    },
  };
}

function readTrack(value: unknown, fallback: AudioTrackConfig): AudioTrackConfig {
  const input = isRecord(value) ? value : {};

  return {
    src: readString(input.src, fallback.src),
    volume: readNumber(input.volume, fallback.volume, 0, 1),
  };
}

function readString(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function readNumber(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, numeric));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
