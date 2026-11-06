import { SPRITE_FRAME_ALIASES } from './sprite-frame-aliases.generated';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CitizenRuntime } from '../../../../game-core/citizens/citizen-types';
import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import type { ChampionCelebrationSnapshot } from '../../../../game-core/app/game-snapshot';
import type { CharacterActionSnapshot } from '../../../../game-core/progression/character-action-types';
import { useMotionTuning } from '../../../context/MotionTuningContext';
import { useTwitchConnection } from '../../../context/TwitchConnectionContext';
import { useGame } from '../../../context/GameContext';
import {
  CHARACTER_FRAME_COUNT, CHARACTER_IDS, CHARACTER_IDLE_FRAME_MS,
  STATIC_NEUTRAL_IDLE_CHARACTERS, type CharacterId, type CharacterAnimationName,
  type CitizenPlacement,
} from '../shared/overlay-types';
import {
  hashString, getCitizenAnimationName, getCharacterFrameIndex, getCitizenVisualScale,
  getCharacterId, getCitizenPlacementSignature, getCitizenPlacementMotionSignature,
  getCitizenWalkFacing, getCitizenFloorStyle, getCitizenReactionClass, getCitizenFrameDurationMs,
  getCitizenStageSidePlacement, getAdaptiveCitizenLobbyStyle,
  shouldUseCitizenAnswerPlacement,
  getChampionCelebrationAnimationName, getChampionCelebrationStage,
  getAnswerOptionByUserId, getCitizenChoiceResultState,
} from '../shared/citizen-helpers';
import { buildChoiceSpotlights } from '../shared/answer-helpers';
import { getVisibleAudience } from '../shared/visible-audience';
import { usesModernQuestionUi } from '../shared/modern-question-games';

export function CitizenPlazaOverlay({
  citizens,
  phase,
  miniGame,
  championCelebration,
}: {
  citizens: CitizenRuntime[];
  phase: TourPhase;
  miniGame: MiniGameSnapshot;
  championCelebration: ChampionCelebrationSnapshot;
}) {
  const reactionClass = getCitizenReactionClass(phase, miniGame);
  const { snapshot } = useGame();
  const activeActions = new Map(snapshot.characterActions.map(action => [action.twitchUserId, action]));
  const { status } = useTwitchConnection();
  const streamerUserId = status.accountUserId;
  const choiceSpotlights = buildChoiceSpotlights(miniGame);
  // Keep the audience in their chosen answer lanes for the entire reveal,
  // including long manual host pauses. Return them only when the host opens
  // the scoreboard (phase leaves `scoring`).
  const usesModernQuestion = usesModernQuestionUi(miniGame.id);
  const shouldUseAnswerPlacement = miniGame.hasRound && (shouldUseCitizenAnswerPlacement(phase)
    || (usesModernQuestion && phase === 'scoring'));
  const answerOptionByUserId = shouldUseAnswerPlacement ? getAnswerOptionByUserId(miniGame) : new Map<string, number>();
  const isMiniGameSceneActive = phase !== 'lobby_open' && phase !== 'cleanup';
  const activeAnswerUserIds = new Set([...miniGame.answerRecords.map((answer) => answer.twitchUserId), ...activeActions.keys()]);
  const visibleCitizens = getVisibleAudience(citizens, streamerUserId, activeAnswerUserIds);
  const finalChampionId = phase === 'tour_complete'
    ? [...citizens]
      .filter((citizen) => citizen.role === 'official')
      .sort((a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName))[0]?.twitchUserId ?? null
    : null;
  // Footlights are purely decorative, limited to smaller lobbies for visual calm and GPU cost.
  const showLobbyFootlights = !isMiniGameSceneActive && visibleCitizens.length <= 12;
  const crowdDensityClass = visibleCitizens.length > 24 ? 'gameplay-citizen-plaza-packed' : visibleCitizens.length > 8 ? 'gameplay-citizen-plaza-busy' : '';
  const optionGroupCounters = new Map<number, number>();
  const optionGroupSizes = new Map<number, number>();
  if (shouldUseAnswerPlacement) {
    for (const citizen of visibleCitizens) {
      const option = answerOptionByUserId.get(citizen.twitchUserId);
      if (option) optionGroupSizes.set(option, (optionGroupSizes.get(option) ?? 0) + 1);
    }
  }

  if (visibleCitizens.length === 0) {
    return null;
  }

  return (
    <section className={`gameplay-citizen-plaza-overlay ${reactionClass} ${visibleCitizens.length <= 5 ? 'gameplay-citizen-plaza-sparse' : ''} ${crowdDensityClass}`}>
      {visibleCitizens.map((citizen, index) => {
        const answerOption = answerOptionByUserId.get(citizen.twitchUserId) ?? null;
        const choice = answerOption ? choiceSpotlights.find((item: { optionNumber: number }) => item.optionNumber === answerOption) : null;
        const groupIndex = answerOption ? optionGroupCounters.get(answerOption) ?? 0 : 0;

        if (answerOption) {
          optionGroupCounters.set(answerOption, groupIndex + 1);
        }

        let placement: CitizenPlacement | null;
        if (finalChampionId === citizen.twitchUserId) {
          placement = { kind: 'champion' };
        } else if (choice) {
          placement = {
            kind: 'choice',
            optionNumber: choice.optionNumber,
            optionCount: choiceSpotlights.length,
            groupIndex,
            groupSize: optionGroupSizes.get(choice.optionNumber) ?? 0,
            tone: choice.tone,
            resultState: getCitizenChoiceResultState(miniGame, answerOption),
          };
        } else if (isMiniGameSceneActive) {
          // Reserve a stable side slot for every citizen. When a viewer answers, only
          // that character moves to the numbered marker; the rest of the crowd does not
          // reshuffle. The same slot is therefore restored when scoring begins.
          placement = getCitizenStageSidePlacement(index);
        } else {
          placement = null;
        }

        return (
          <CitizenCard
            key={citizen.twitchUserId}
            citizen={citizen}
            index={index}
            action={activeActions.get(citizen.twitchUserId) ?? null}
            locale={snapshot.locale}
            placement={placement}
            championCelebration={championCelebration}
            showLobbyFootlight={showLobbyFootlights}
            audienceCount={visibleCitizens.length}
          />
        );
      })}
    </section>
  );
}

export function CitizenCard({
  citizen,
  index,
  action,
  locale,
  placement,
  championCelebration,
  showLobbyFootlight = false,
  audienceCount = 0,
}: {
  citizen: CitizenRuntime;
  index: number;
  action: CharacterActionSnapshot | null;
  locale: 'ar' | 'en';
  placement: CitizenPlacement | null;
  championCelebration: ChampionCelebrationSnapshot;
  showLobbyFootlight?: boolean;
  audienceCount?: number;
}) {
  const { tuning } = useMotionTuning();
  const characterId = getCharacterId(citizen.twitchUserId, index);
  const roleClass = citizen.role === 'official' ? 'official' : 'spectator';
  const [isEntering, setIsEntering] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [celebrationNow, setCelebrationNow] = useState(Date.now());
  const [isFinalChampionVictoryLooping, setIsFinalChampionVictoryLooping] = useState(false);
  const [renderedPlacement, setRenderedPlacement] = useState<CitizenPlacement | null>(placement);
  const [isWalkingToPlacement, setIsWalkingToPlacement] = useState(false);
  const [walkFacing, setWalkFacing] = useState(1);
  const renderedPlacementRef = useRef<CitizenPlacement | null>(placement);
  const walkFinishAtRef = useRef(0);
  const placementSignature = getCitizenPlacementSignature(placement);
  const isChampionCelebrating = championCelebration.twitchUserId === citizen.twitchUserId
    && Boolean(championCelebration.startedAt)
    && citizen.level >= 10;
  const celebrationElapsedMs = isChampionCelebrating && championCelebration.startedAt
    ? Math.max(0, celebrationNow - championCelebration.startedAt)
    : 0;
  const celebrationStage = getChampionCelebrationStage(celebrationElapsedMs);

  useEffect(() => {
    setIsEntering(true);
    setFrameIndex(0);

    const enterTimer = window.setTimeout(() => {
      setIsEntering(false);
      setFrameIndex(0);
    }, tuning.citizens.joinEnterMs);

    return () => {
      window.clearTimeout(enterTimer);
    };
  }, [citizen.twitchUserId, tuning.citizens.joinEnterMs]);


  useEffect(() => {
    const currentRenderedPlacement = renderedPlacementRef.current;
    const currentSignature = getCitizenPlacementSignature(currentRenderedPlacement);

    if (currentSignature === placementSignature) {
      return;
    }

    const nextPlacement = placement;
    const currentMotionSignature = getCitizenPlacementMotionSignature(currentRenderedPlacement);
    const nextMotionSignature = getCitizenPlacementMotionSignature(nextPlacement);

    // If only the result state changed (pending → correct/wrong), switch immediately to the
    // reaction animation. Do not restart walk or it looks like the character keeps walking in place.
    if (currentMotionSignature === nextMotionSignature) {
      // A pending choice can turn into correct/wrong while the character is still walking.
      // Keep walking until the destination is reached, then play the reaction. This prevents
      // dead/jump from firing halfway across the floor.
      if (isWalkingToPlacement && nextPlacement?.kind === 'choice') {
        const remainingMs = Math.max(0, walkFinishAtRef.current - Date.now());
        const resultTimer = window.setTimeout(() => {
          renderedPlacementRef.current = nextPlacement;
          setRenderedPlacement(nextPlacement);
          setIsWalkingToPlacement(false);
        }, remainingMs + 80);

        return () => {
          window.clearTimeout(resultTimer);
        };
      }

      renderedPlacementRef.current = nextPlacement;
      setRenderedPlacement(nextPlacement);
      setIsWalkingToPlacement(false);
      return;
    }

    // Every placement transition is a real movement: lobby → stage, stage → answer
    // marker, answer marker → stage sides, and stage → final champion position.
    const shouldWalkBeforeTranslate = !isEntering;

    let firstFrameId = 0;
    let secondFrameId = 0;
    let preWalkTimer = 0;
    let finishTimer = 0;

    if (!shouldWalkBeforeTranslate) {
      renderedPlacementRef.current = nextPlacement;
      setRenderedPlacement(nextPlacement);
      setIsWalkingToPlacement(false);
      return;
    }

    const moveMs = currentRenderedPlacement?.kind === 'champion' || nextPlacement?.kind === 'champion'
      ? tuning.citizens.championWalkMs
      : tuning.citizens.sideToChoiceMs;

    // Critical: WALK starts first while the card is still standing in the old position.
    // After a short configurable pre-walk, left/top are changed so the motion reads as
    // real walking instead of an instant transfer.
    setWalkFacing(getCitizenWalkFacing(currentRenderedPlacement, nextPlacement, index));
    setIsWalkingToPlacement(true);
    walkFinishAtRef.current = Date.now() + tuning.citizens.walkPreTranslateMs + moveMs + 160;
    preWalkTimer = window.setTimeout(() => {
      firstFrameId = window.requestAnimationFrame(() => {
        secondFrameId = window.requestAnimationFrame(() => {
          renderedPlacementRef.current = nextPlacement;
          setRenderedPlacement(nextPlacement);
        });
      });
    }, tuning.citizens.walkPreTranslateMs);

    finishTimer = window.setTimeout(() => {
      setIsWalkingToPlacement(false);
      walkFinishAtRef.current = 0;
    }, tuning.citizens.walkPreTranslateMs + moveMs + 160);

    return () => {
      window.clearTimeout(preWalkTimer);
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      window.clearTimeout(finishTimer);
    };
  }, [index, isEntering, placementSignature, tuning.citizens.championWalkMs, tuning.citizens.sideToChoiceMs, tuning.citizens.walkPreTranslateMs]);

  useEffect(() => {
    if (placement?.kind !== 'champion' || isEntering) {
      setIsFinalChampionVictoryLooping(false);
      return;
    }

    setIsFinalChampionVictoryLooping(false);
    const victoryTimer = window.setTimeout(() => setIsFinalChampionVictoryLooping(true), tuning.citizens.championVictoryDelayMs);

    return () => {
      window.clearTimeout(victoryTimer);
    };
  }, [isEntering, placement?.kind, tuning.citizens.championVictoryDelayMs]);


  useEffect(() => {
    if (!isChampionCelebrating) {
      return;
    }

    setCelebrationNow(Date.now());
    const celebrationTicker = window.setInterval(() => setCelebrationNow(Date.now()), 90);

    return () => {
      window.clearInterval(celebrationTicker);
    };
  }, [isChampionCelebrating, championCelebration.startedAt]);

  const effectText = action ? getCharacterActionText(action, locale, citizen) : null;
  const floorStyle = !renderedPlacement && audienceCount > 8
    ? getAdaptiveCitizenLobbyStyle(index, audienceCount)
    : getCitizenFloorStyle(index, renderedPlacement);
  const actionAnimation = action?.kind === 'dance' ? 'run' : action?.kind === 'wave' || action?.kind === 'cheer' || action?.kind === 'victory' || action?.kind === 'level_up' ? 'jump' : action?.kind === 'challenge' ? 'slide' : null;
  const animationName = isChampionCelebrating && !isEntering
    ? getChampionCelebrationAnimationName(celebrationElapsedMs)
    : isFinalChampionVictoryLooping
      ? 'jump'
      : isWalkingToPlacement
        ? 'walk'
        : actionAnimation && !isEntering ? actionAnimation : getCitizenAnimationName(isEntering, renderedPlacement);
  const isChoiceWaitingIdle = renderedPlacement?.kind === 'choice' && renderedPlacement.resultState === 'pending';
  const isLivingIdle = !isEntering && (!renderedPlacement || renderedPlacement.kind === 'side' || renderedPlacement.kind === 'champion' || isChoiceWaitingIdle) && !isWalkingToPlacement && !isChampionCelebrating && !isFinalChampionVictoryLooping && animationName === 'idle';
  const shouldAnimateSprite = isEntering || animationName !== 'idle' || isLivingIdle;
  const idleLifePhase = Math.abs(hashString(`${citizen.twitchUserId}:idle-life`)) % 6;

  useEffect(() => {
    if (!shouldAnimateSprite) {
      setFrameIndex(0);
      return;
    }

    const frameMs = isFinalChampionVictoryLooping
      ? tuning.citizens.championVictoryLoopMs / CHARACTER_FRAME_COUNT
      : getCitizenFrameDurationMs(animationName);

    if (animationName === 'dead') {
      setFrameIndex(0);
      const deadFrameTimer = window.setInterval(() => {
        setFrameIndex((frame) => {
          if (frame >= CHARACTER_FRAME_COUNT - 1) {
            window.clearInterval(deadFrameTimer);
            return CHARACTER_FRAME_COUNT - 1;
          }

          return frame + 1;
        });
      }, frameMs);

      return () => {
        window.clearInterval(deadFrameTimer);
      };
    }

    const frameTimer = window.setInterval(() => {
      setFrameIndex((frame) => (frame + 1) % CHARACTER_FRAME_COUNT);
    }, frameMs);

    return () => {
      window.clearInterval(frameTimer);
    };
  }, [animationName, isFinalChampionVictoryLooping, shouldAnimateSprite, tuning.citizens.championVictoryLoopMs]);

  const resolvedFrameIndex = getCharacterFrameIndex(characterId, animationName, frameIndex);
  const frameName = `${animationName}_${String(shouldAnimateSprite ? resolvedFrameIndex : 0).padStart(2, '0')}`;
  const spriteFramePath = `${characterId}/${animationName}/${frameName}.png`;
  const spriteAssetPath = SPRITE_FRAME_ALIASES[spriteFramePath] ?? spriteFramePath;
  return (
    <article
      className={`gameplay-citizen-card gameplay-citizen-${roleClass} gameplay-citizen-character-${characterId} gameplay-citizen-idle-life-${idleLifePhase} ${isLivingIdle ? 'gameplay-citizen-living-idle' : ''} ${shouldAnimateSprite && !isEntering ? 'gameplay-citizen-body-animated' : ''} ${renderedPlacement?.kind === 'choice' ? `gameplay-citizen-answer-moving gameplay-citizen-choice-${renderedPlacement.tone} gameplay-citizen-answer-${renderedPlacement.resultState}` : ''} ${renderedPlacement?.kind === 'side' ? `gameplay-citizen-stage-side gameplay-citizen-stage-side-${renderedPlacement.side}` : ''} ${renderedPlacement?.kind === 'champion' ? 'gameplay-citizen-final-champion' : ''} ${animationName === 'dead' ? 'gameplay-citizen-dead-hold' : ''} ${isWalkingToPlacement ? 'gameplay-citizen-walk-translate' : ''} ${isFinalChampionVictoryLooping ? 'gameplay-citizen-final-victory-loop' : ''} ${isEntering ? 'gameplay-citizen-entering' : ''} ${isChampionCelebrating && !isEntering ? `gameplay-citizen-level10-champion gameplay-champion-stage-${celebrationStage}` : ''} ${action && !isEntering ? `gameplay-citizen-action-v42 citizen-action-${action.kind.replace('_','-')}-v42` : ''}`}
      style={{ ...floorStyle, '--citizen-walk-facing': String(isWalkingToPlacement ? walkFacing : (floorStyle as Record<string, unknown>)['--citizen-walk-facing'] ?? 1), '--citizen-life-delay': `${idleLifePhase * -0.43}s`, '--citizen-visual-scale': String(getCitizenVisualScale(characterId)) } as CSSProperties}
    >
      <div className="gameplay-citizen-nameplate" title={citizen.displayName}>
        <b>{citizen.level}</b>
        <span>{citizen.displayName}</span>
      </div>
      {(isChampionCelebrating || isFinalChampionVictoryLooping) && !isEntering ? <span className="gameplay-citizen-champion-burst" aria-hidden="true">✦</span> : null}
      {action && !isEntering && effectText ? (
        <span key={action.sequence} className={`citizen-action-callout-v42 citizen-action-callout-${action.kind}-v42`} aria-label={effectText.label}>
          <b aria-hidden="true">{effectText.icon}</b><span>{effectText.label}</span>
          {action.kind === 'profile' ? <i className="citizen-profile-progress-track-v42"><i style={{width: `${citizen.progressPercent}%`}} /></i> : null}
        </span>
      ) : null}
      {(action?.kind === 'spotlight' || action?.kind === 'victory' || action?.kind === 'level_up') && !isEntering ? <span className="citizen-special-aura-v42" aria-hidden="true" /> : null}
      {showLobbyFootlight ? <span className="premium-citizen-footlight" aria-hidden="true" /> : null}
      <span className="gameplay-citizen-ground-shadow" aria-hidden="true" />
      <div className="gameplay-citizen-body-shell" aria-hidden="true">
        <img
          className="gameplay-citizen-sprite"
          src={`./assets/game/runtime/characters/stage-ready/${spriteAssetPath}`}
          alt=""
          draggable={false}
        />
        {isLivingIdle ? <span className="gameplay-citizen-eye-blink" aria-hidden="true" /> : null}
      </div>
    </article>
  );
}


function getCharacterActionText(action: CharacterActionSnapshot, locale: 'ar' | 'en', citizen: CitizenRuntime) {
  const ar = locale === 'ar';
  switch (action.kind) {
    case 'wave': return { icon: '👋', label: ar ? 'أهلًا!' : 'HELLO!' };
    case 'dance': return { icon: '♫', label: ar ? 'يلا نرقص!' : 'DANCE!' };
    case 'emote': return { icon: '💜', label: '♥' };
    case 'cheer': return { icon: '✦', label: ar ? 'يلا يا أبطال!' : 'LET’S GO!' };
    case 'challenge': return { icon: '⚡', label: ar ? 'مستعد للتحدي!' : 'CHALLENGE READY!' };
    case 'spotlight': return { icon: '✦', label: ar ? 'نجم المسرح!' : 'IN THE SPOTLIGHT!' };
    case 'victory': return { icon: '🏆', label: ar ? 'رقصة الفوز!' : 'VICTORY!' };
    case 'level_up': return { icon: '★', label: `LEVEL UP · LV.${action.level ?? citizen.level}` };
    case 'profile': return { icon: '★', label: `LV.${citizen.level} · ${citizen.xp} XP` };
  }
}
