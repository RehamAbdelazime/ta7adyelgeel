import type { CSSProperties } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import {
  CHARACTER_FRAME_COUNT, CHARACTER_IDS, CHARACTER_IDLE_FRAME_MS,
  CHARACTER_SESSION_SEED, STATIC_NEUTRAL_IDLE_CHARACTERS,
  type CharacterAnimationName, type CharacterId,
  type CitizenPlacement, type CitizenSpotlightPlacement, type CitizenSidePlacement,
} from './overlay-types';

// Re-export answer helpers used by citizen placement
export { getAnswerOptionByUserId, getCitizenChoiceResultState, getAnswerCountsByOption, getCorrectOptionNumber } from './answer-helpers';

export function hashString(value: string): number {
  return [...value].reduce((total, char) => ((total << 5) - total + char.charCodeAt(0)) | 0, 216613626);
}

export function getChampionCelebrationAnimationName(elapsedMs: number): CharacterAnimationName {
  if (elapsedMs < 1150) return 'slide';
  return 'jump';
}

export function getChampionCelebrationStage(elapsedMs: number): 'slide' | 'jump' | 'wave' {
  if (elapsedMs < 1150) return 'slide';
  if (elapsedMs < 2550) return 'jump';
  return 'wave';
}

export function getCitizenAnimationName(isEntering: boolean, placement: CitizenPlacement | null): CharacterAnimationName {
  if (isEntering) return 'walk';
  if (!placement || placement.kind === 'side' || placement.kind === 'champion') return 'idle';
  if (placement.resultState === 'correct') return 'jump';
  if (placement.resultState === 'wrong') return 'dead';
  return 'idle';
}

export function getCharacterFrameIndex(characterId: CharacterId, animationName: CharacterAnimationName, frameIndex: number): number {
  if (animationName === 'dead') return Math.min(frameIndex, CHARACTER_FRAME_COUNT - 1);
  if (animationName === 'idle' && STATIC_NEUTRAL_IDLE_CHARACTERS.has(characterId)) return 0;
  return frameIndex % CHARACTER_FRAME_COUNT;
}

export function getCitizenVisualScale(characterId: CharacterId): number {
  const scales: Record<CharacterId, number> = {
    cat: 0.76, dog: 0.80, cute_girl: 0.96, flat_boy: 0.98,
    female_person: 0.96, male_person: 0.96, red_hat: 0.80,
    temple_runner: 0.82, robot: 0.92, stage_office: 0.96, stage_chef: 0.96,
  };
  return scales[characterId] ?? 1;
}

export function getCharacterId(twitchUserId: string, _index: number): CharacterId {
  const hash = Math.abs(hashString(twitchUserId + CHARACTER_SESSION_SEED));
  return CHARACTER_IDS[hash % CHARACTER_IDS.length];
}

export function getCitizenPlacementSignature(placement: CitizenPlacement | null): string {
  if (!placement) return 'none';
  if (placement.kind === 'champion') return 'champion';
  if (placement.kind === 'side') return `side-${placement.side}-${placement.groupIndex}`;
  return `choice-${placement.optionNumber}-${placement.groupIndex}`;
}

export function getCitizenPlacementMotionSignature(placement: CitizenPlacement | null): string {
  if (!placement) return 'none';
  if (placement.kind === 'champion') return 'champion';
  if (placement.kind === 'side') return `side-${placement.side}`;
  return `choice-${placement.optionNumber}`;
}

export function getCitizenWalkFacing(currentPlacement: CitizenPlacement | null, nextPlacement: CitizenPlacement | null, index: number): number {
  if (!currentPlacement && nextPlacement) return 1;
  if (currentPlacement?.kind === 'side' && currentPlacement.side === 'left') return 1;
  if (currentPlacement?.kind === 'side' && currentPlacement.side === 'right') return -1;
  return index % 2 === 0 ? 1 : -1;
}

export function getCitizenFrameDurationMs(animationName: CharacterAnimationName): number {
  const durations: Record<CharacterAnimationName, number> = {
    idle: CHARACTER_IDLE_FRAME_MS, walk: 90, run: 70, jump: 80, slide: 80, dead: 110,
  };
  return durations[animationName] ?? CHARACTER_IDLE_FRAME_MS;
}

export function getCitizenFloorStyle(index: number, _placement?: unknown): CSSProperties {
  return {
    '--citizen-delay': `${(index * 0.07) % 0.8}s`,
  } as CSSProperties;
}

export function getCitizenSideStyle(placement: CitizenSidePlacement, fallbackIndex: number): CSSProperties {
  const isLeft = placement.side === 'left';
  const x = isLeft ? 12 + placement.groupIndex * 3.5 : 88 - placement.groupIndex * 3.5;
  return {
    '--citizen-x': `${x}%`,
    '--citizen-y': '75%',
    '--citizen-scale': 0.72 - placement.groupIndex * 0.04,
    '--citizen-z': 25 + fallbackIndex,
    '--citizen-delay': `${(fallbackIndex * 0.08) % 0.7}s`,
    '--citizen-walk-facing': isLeft ? 1 : -1,
  } as CSSProperties;
}

export function getCitizenChampionStyle(): CSSProperties {
  return {
    '--citizen-x': '50%',
    '--citizen-y': '74%',
    '--citizen-scale': 1.22,
    '--citizen-z': 100,
    '--citizen-delay': '0s',
  } as CSSProperties;
}

export function getCitizenSpotlightStyle(placement: CitizenSpotlightPlacement, fallbackIndex: number): CSSProperties {
  const optionCount = placement.optionCount;
  const col = placement.optionNumber - 1;
  const segWidth = 100 / Math.max(optionCount, 1);
  const x = segWidth * col + segWidth * 0.5 + ((placement.groupIndex % 3) - 1) * 4;
  const scale = 0.88 - placement.groupIndex * 0.045;
  return {
    '--citizen-x': `${Math.max(8, Math.min(92, x))}%`,
    '--citizen-y': '82%',
    '--citizen-scale': Math.max(0.55, scale),
    '--citizen-z': 30 + fallbackIndex,
    '--citizen-delay': `${(fallbackIndex * 0.06) % 0.5}s`,
  } as CSSProperties;
}

export function getCitizenReactionClass(phase: TourPhase, _miniGame: MiniGameSnapshot): string {
  if (phase === 'scoring') return 'citizen-reacting';
  if (phase === 'answer_window_open') return 'citizen-answering';
  return '';
}
