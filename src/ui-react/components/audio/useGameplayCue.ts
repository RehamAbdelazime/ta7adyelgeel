import { useEffect } from 'react';
import { useAudioTuning } from '../../context/AudioTuningContext';

function createAudioContext(): AudioContext | null {
  try { return new AudioContext(); } catch { return null; }
}

function playTone(context: AudioContext, at: number, frequency: number, volume: number, duration: number) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, at);
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), at + 0.006);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.008);
}

/** Soft cues use the generator's EXACT beat schedule, including tempo ramps.
 * Runs only while symbols are visible during preparation, never during answers. */
export function useCountBeatAudio(params: {
  enabled: boolean;
  paused: boolean;
  questionId: string | null;
  elapsedMs: number;
  items: ReadonlyArray<{ delayMs: number }>;
}) {
  const { tuning } = useAudioTuning();
  const { enabled, paused, questionId, elapsedMs, items } = params;
  const volume = tuning.enabled ? tuning.globalVolume : 0;
  useEffect(() => {
    if (!enabled || paused || volume <= 0 || !questionId) return undefined;
    const context = createAudioContext();
    if (!context) return undefined;
    // Only one sound for each visible icon. Re-anchor after pause/resume.
    const anchoredAt = performance.now() - elapsedMs;
    let nextBeat = items.findIndex((item) => item.delayMs >= elapsedMs - 12);
    if (nextBeat < 0) nextBeat = items.length;
    const schedule = () => {
      if (context.state !== 'running') return;
      const now = performance.now();
      while (nextBeat < items.length && anchoredAt + items[nextBeat].delayMs < now + 95) {
        const when = context.currentTime + Math.max(0, (anchoredAt + items[nextBeat].delayMs - now) / 1000);
        playTone(context, when, 560, volume * 0.025, 0.042);
        nextBeat += 1;
      }
    };
    void context.resume().then(schedule).catch(() => undefined);
    const timer = window.setInterval(schedule, 55);
    return () => { window.clearInterval(timer); void context.close().catch(() => undefined); };
    // questionId ensures no per-frame audio recreation. The user settings can
    // mute live by turning off audio; pause also stops scheduling immediately.
  }, [enabled, paused, questionId, items, volume]);
}

/** Two very short ascending notes when the winning cup exposes its ball. */
export function useLuckyCupRevealCue(isRevealed: boolean, questionId: string | null) {
  const { tuning } = useAudioTuning();
  const volume = tuning.enabled ? tuning.globalVolume : 0;
  useEffect(() => {
    if (!isRevealed || !questionId || volume <= 0) return undefined;
    const context = createAudioContext();
    if (!context) return undefined;
    void context.resume().then(() => {
      if (context.state !== 'running') return;
      const now = context.currentTime + 0.025;
      playTone(context, now, 560, volume * 0.065, 0.12);
      playTone(context, now + 0.13, 840, volume * 0.08, 0.16);
    }).catch(() => undefined);
    const closeTimer = window.setTimeout(() => {void context.close().catch(() => undefined);}, 550);
    return () => {window.clearTimeout(closeTimer); void context.close().catch(() => undefined);};
  }, [isRevealed, questionId, volume]);
}
