import { ANSWER_STAGE_LAYOUT } from './answer-stage-layout';
import type { CSSProperties } from 'react';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import {
  CHARACTER_FRAME_COUNT, CHARACTER_IDS, CHARACTER_IDLE_FRAME_MS,
  STATIC_NEUTRAL_IDLE_CHARACTERS,
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
  // Per-sprite calibration compensates for transparent padding and different silhouettes.
  // Values intentionally stay close so the audience looks like one coherent cast.
  const scales: Record<CharacterId, number> = {
    cat: 1.00,
    dog: 0.99,
    cute_girl: 0.99,
    flat_boy: 1.01,
    female_person: 1.02,
    male_person: 1.02,
    red_hat: 1.03,
    temple_runner: 1.08,
    robot: 0.97,
    stage_office: 1.12,
    stage_chef: 1.12,
  };
  return scales[characterId] ?? 1;
}

export function getCharacterId(twitchUserId: string, _index: number): CharacterId {
  // Explicit sprite selection is only supported for namespaced local QA identities.
  const qaSprite = CHARACTER_IDS.find(id => twitchUserId.startsWith(`__ta7ady_qa_bot__qa_${id}_`));
  if (qaSprite) return qaSprite;
  const hash = hashString(`character-v42:${twitchUserId}`) >>> 0;
  return CHARACTER_IDS[hash % CHARACTER_IDS.length];
}

export function shouldUseCitizenAnswerPlacement(phase: TourPhase): boolean {
  return phase === 'answer_window_open';
}

export function getCitizenPlacementSignature(placement: CitizenPlacement | null): string {
  if (!placement) return 'none';
  if (placement.kind === 'champion') return 'champion';
  if (placement.kind === 'side') return `side-${placement.side}-${placement.groupIndex}`;
  return `choice-${placement.optionNumber}-${placement.optionCount}-${placement.groupIndex}-${placement.groupSize ?? 0}-${placement.resultState}`;
}

export function getCitizenPlacementMotionSignature(placement: CitizenPlacement | null): string {
  if (!placement) return 'none';
  if (placement.kind === 'champion') return 'champion';
  if (placement.kind === 'side') return `side-${placement.side}-${placement.groupIndex}`;
  return `choice-${placement.optionNumber}-${placement.optionCount}-${placement.groupIndex}`;
}

const CHOICE_SPOTLIGHT_LAYOUT = ANSWER_STAGE_LAYOUT;

function getChoiceSpotlightCenterX(placement: CitizenSpotlightPlacement): number {
  const count = Math.max(1, placement.optionCount);
  const index = Math.max(0, Math.min(count - 1, placement.optionNumber - 1));
  return CHOICE_SPOTLIGHT_LAYOUT.leftPercent
    + CHOICE_SPOTLIGHT_LAYOUT.widthPercent * ((index + 0.5) / count);
}

/**
 * Stable audience slots for the 16:9 desktop stage.
 *
 * Cards are centered on these points. The old front row was at 78% of the
 * audience overlay, which put the feet of a 168px card below the viewport.
 * Reserve the lower portion as a visual safe area (including OBS/taskbar crop).
 * The column order fills the middle of the crowd first, without repositioning
 * existing viewers each time someone joins.
 */
export function getLobbyCrowdCoordinates(index: number): { x: number; y: number; scale: number } {
  const columns = 8;
  const row = Math.floor(index / columns);
  const columnOrder = [2, 5, 0, 7, 3, 4, 1, 6];
  const column = columnOrder[index % columns];
  return {
    x: 10 + (80 / (columns - 1)) * column,
    y: Math.max(10, 50 - row * 5),
    scale: Math.max(0.62, 1.02 - row * 0.065),
  };
}

/** Compact show-floor arrangement for larger lobbies.
 * A limited small crowd keeps the original cinematic spacing. When attendance
 * increases, we deliberately switch to a denser grid so back-row nameplates
 * do not sit directly on top of the front row's nameplates. This never changes
 * answer marker or minigame side placement.
 */
export function getAdaptiveLobbyCrowdCoordinates(index: number, count: number): {x: number; y: number; scale: number} {
  if (count <= 8) return getLobbyCrowdCoordinates(index);
  const columns = count <= 24 ? 8 : count <= 48 ? 10 : 12;
  const rows = Math.ceil(count / columns);
  const row = Math.floor(index / columns);
  const column = index % columns;
  // A modest alternating offset gives a concert-crowd formation without overlap
  // between adjacent name badges in a single row.
  const stagger = row % 2 === 1 ? 0.28 : 0;
  const x = 6 + 88 * (column + .5 + stagger) / columns;
  const startY = count <= 24 ? 22 : 16;
  const endY = count <= 24 ? 57 : 67;
  const y = rows === 1 ? endY : startY + (endY - startY) * row / (rows - 1);
  const scale = count <= 24 ? .69 : count <= 48 ? .52 : .40;
  return { x, y, scale };
}

export function getAdaptiveCitizenLobbyStyle(index: number, count: number): CSSProperties {
  const position = getAdaptiveLobbyCrowdCoordinates(index, count);
  return citizenPositionStyle({ ...position, z: Math.round(position.y) + 10, index });
}

function getPlacementXPercent(placement: CitizenPlacement | null, index: number): number {
  if (!placement) return getLobbyCrowdCoordinates(index).x;
  if (placement.kind === 'champion') return 50;
  if (placement.kind === 'choice') return getChoiceSpotlightCenterX(placement);

  const columns = 6;
  const row = Math.floor(placement.groupIndex / columns);
  const column = placement.groupIndex % columns;
  return placement.side === 'left'
    ? 4.5 + column * 4.2 + row * 0.6
    : 95.5 - column * 4.2 - row * 0.6;
}

export function getCitizenStageSidePlacement(index: number): CitizenSidePlacement {
  return {
    kind: 'side',
    side: index % 2 === 0 ? 'left' : 'right',
    groupIndex: Math.floor(index / 2),
  };
}

export function getCitizenWalkFacing(
  currentPlacement: CitizenPlacement | null,
  nextPlacement: CitizenPlacement | null,
  index: number,
): number {
  const delta = getPlacementXPercent(nextPlacement, index) - getPlacementXPercent(currentPlacement, index);
  if (Math.abs(delta) > 0.25) return delta > 0 ? 1 : -1;
  if (nextPlacement?.kind === 'side') return nextPlacement.side === 'left' ? 1 : -1;
  return index % 2 === 0 ? 1 : -1;
}

export function getCitizenFrameDurationMs(animationName: CharacterAnimationName): number {
  const durations: Record<CharacterAnimationName, number> = {
    idle: CHARACTER_IDLE_FRAME_MS, walk: 90, run: 70, jump: 80, slide: 80, dead: 110,
  };
  return durations[animationName] ?? CHARACTER_IDLE_FRAME_MS;
}

export function getCitizenFloorStyle(index: number, placement: CitizenPlacement | null = null): CSSProperties {
  if (!placement) return getCitizenLobbyStyle(index);
  if (placement.kind === 'side') return getCitizenSideStyle(placement, index);
  if (placement.kind === 'champion') return getCitizenChampionStyle();
  return getCitizenSpotlightStyle(placement, index);
}

function citizenPositionStyle({ x, y, scale, z, index, facing }: {
  x: number;
  y: number;
  scale: number;
  z: number;
  index: number;
  facing?: number;
}): CSSProperties {
  return {
    '--citizen-x': `${x}%`,
    '--citizen-target-x': `${x}%`,
    '--citizen-y': `${y}%`,
    '--citizen-scale': scale,
    '--citizen-z': z,
    '--citizen-delay': `${(index * 0.07) % 0.8}s`,
    '--citizen-walk-facing': facing ?? 1,
  } as CSSProperties;
}

export function getCitizenLobbyStyle(index: number): CSSProperties {
  const position = getLobbyCrowdCoordinates(index);
  return citizenPositionStyle({ ...position, z: Math.round(position.y) + 10, index });
}

export function getCitizenSideStyle(placement: CitizenSidePlacement, fallbackIndex: number): CSSProperties {
  const columns = 6;
  const row = Math.floor(placement.groupIndex / columns);
  const column = placement.groupIndex % columns;
  const isLeft = placement.side === 'left';
  const x = isLeft
    ? 4.5 + column * 4.2 + row * 0.6
    : 95.5 - column * 4.2 - row * 0.6;
  const y = Math.max(18, 66 - row * 9.2);
  const scale = Math.max(0.62, 0.94 - row * 0.055);

  return citizenPositionStyle({
    x, y, scale, z: Math.round(y) + 10 + (fallbackIndex % 5), index: fallbackIndex,
    facing: isLeft ? 1 : -1,
  });
}

export function getCitizenChampionStyle(): CSSProperties {
  return citizenPositionStyle({ x: 50, y: 76, scale: 1.16, z: 120, index: 0, facing: 1 });
}

/** Place responders in longitudinal lanes without stacking them on a single pad.
 * Keep deterministic columns to avoid movement every time one viewer joins.
 * Rows extend from the screen apron towards the spectator-facing floor.
 * Dense groups shrink moderately; all placements remain within their own lane.
 */
export function getCitizenSpotlightStyle(placement: CitizenSpotlightPlacement, fallbackIndex: number): CSSProperties {
  const laneCenter = getChoiceSpotlightCenterX(placement);
  const laneWidth = CHOICE_SPOTLIGHT_LAYOUT.widthPercent / Math.max(1, placement.optionCount);
  const count = Math.max(1, placement.groupSize ?? placement.groupIndex + 1);
  const columns = count <= 3 ? 3 : count <= 16 ? 4 : count <= 36 ? 5 : 6;
  const columnOrder = columns === 3 ? [1, 0, 2] : [2, 1, 3, 0, 4, 5];
  const column = columnOrder[placement.groupIndex % columns] ?? 0;
  const row = Math.floor(placement.groupIndex / columns);
  const totalRows = Math.max(1, Math.ceil(count / columns));
  const offset = (column - (columns - 1) / 2) * (laneWidth * 0.8 / columns);
  const x = Math.max(2, Math.min(98, laneCenter + offset));
  // Local CitizenPlaza height covers y=73.9%..100% of the game stage.
  // Keep fronts away from bottom OBS/taskbar safe area, and leave the screen
  // apron above free for highly readable answer-zone labels.
  const backY = 27;
  const frontY = 72;
  const y = totalRows === 1 ? 58 : backY + (frontY - backY) * row / (totalRows - 1);
  const scale = count > 48 ? 0.41 : count > 24 ? 0.48 : count > 12 ? 0.56 : count > 4 ? 0.7 : 0.86;
  return citizenPositionStyle({
    x, y, scale, z: Math.round(y) + 20 + (fallbackIndex % 5), index: fallbackIndex,
    facing: x < laneCenter ? 1 : -1,
  });
}

export function getCitizenReactionClass(phase: TourPhase, _miniGame: MiniGameSnapshot): string {
  if (phase === 'scoring') return 'citizen-reacting';
  if (phase === 'answer_window_open') return 'citizen-answering';
  return '';
}
