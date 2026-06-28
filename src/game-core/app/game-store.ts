import type { CitizenRuntime } from '../citizens/citizen-types';
import { DEFAULT_RUNTIME_GAME_CONFIG, MINI_GAME_IDS, type RuntimeGameConfig } from '../config/runtime-game-config';
import { EMPTY_TOUR_AWARDS, type TourAward, type TourAwardsSnapshot, type TourAwardWinner, type TourPlayerStats, type TourScoreboardRow } from '../awards/tour-awards';
import { CHAOS_EVENTS, ChaosEventService } from '../chaos/chaos-event-service';
import type { ChaosEventDefinition } from '../chaos/chaos-types';
import { GameEventBus } from '../events/game-event-bus';
import { localeDirection, translate } from '../localization/translations';
import type { LocaleCode, TranslationKey } from '../localization/locale-types';
import { CoupleOrSiblingsMiniGameService } from '../minigames/couple-or-siblings/couple-or-siblings-service';
import { GuessLogoMiniGameService } from '../minigames/guess-logo/guess-logo-service';
import { FoodOriginMiniGameService } from '../minigames/food-origin/food-origin-service';
import { MemoryCountMiniGameService } from '../minigames/memory-count/memory-count-service';
import { MazeGatesMiniGameService } from '../minigames/maze-gates/maze-gates-service';
import { createHangmanAnswerFromCommand, HangmanMiniGameService } from '../minigames/hangman/hangman-service';
import { ShapeCountMiniGameService } from '../minigames/shape-count/shape-count-service';
import { TrueFakeMiniGameService } from '../minigames/true-fake/true-fake-service';
import {
  createNoopPersistencePort,
  type GamePersistencePort,
  type PersistentProfilesFile,
  type PersistentSettingsFile,
  type PersistentTourHistoryFile,
  type PersistenceStatus,
  type StoredTourHistoryEntry,
  type StoredTourLeaderboardEntry,
} from '../persistence/persistence-types';
import type { CoupleOrSiblingsAnswer, FoodOriginAnswer, GuessLogoAnswer, HangmanAnswer, MazeGateAnswer, MemoryCountAnswer, MiniGameId, MiniGameScoreAward, ShapeCountAnswer, ShapeCountShapeId, TrueFakeAnswer } from '../minigames/minigame-types';
import { CountTheBeatMiniGameService } from '../minigames/count-the-beat/count-the-beat-service';
import { LuckyCupMiniGameService } from '../minigames/lucky-cup/lucky-cup-service';
import { BeforeOrAfterMiniGameService } from '../minigames/before-or-after/before-or-after-service';
import { ProfileService } from '../profiles/profile-service';
import { ProgressionService } from '../progression/progression-service';
import type { CommandUnlockDefinition } from '../progression/progression-types';
import { getTourPhaseTitleKey } from '../tours/tour-phase-labels';
import { TourStateMachine } from '../tours/tour-state-machine';
import type { TourPhase, TourSnapshot } from '../tours/tour-types';
import { TwitchCommandRouter } from '../twitch/twitch-command-router';
import type { CommandFeedback, ParsedTwitchCommand, TwitchChatMessage } from '../twitch/twitch-message-types';
import type { ActiveSessionMode, FeedEntry, GameSnapshot, HostChaosMode } from './game-snapshot';

type StoreListener = (snapshot: GameSnapshot) => void;


type GameStoreOptions = {
  persistence?: GamePersistencePort | null;
  runtimeConfig?: RuntimeGameConfig;
};

type ActiveTourHistorySeed = {
  tourId: string;
  startedAt: string;
  roundIndex: number;
};


type TimedAnswerHintMiniGameService = {
  configureAnswerWindow: (params: { startedAt: number; durationMs: number }) => void;
};

function supportsTimedAnswerHint(service: unknown): service is TimedAnswerHintMiniGameService {
  return typeof (service as TimedAnswerHintMiniGameService).configureAnswerWindow === 'function';
}

type PendingPersistenceSave = {
  profiles: boolean;
  settings: boolean;
  tourHistory: boolean;
};

const PHASE_TICK_MS = 1_000;
const PRIVATE_STREAMER_TWITCH_USER_ID = '__ta7ady_private_streamer__';
const PRIVATE_STREAMER_FALLBACK_NAME = 'STREAMER';

export class GameStore {
  private locale: LocaleCode = 'en';
  private chaosPercent = 2;

  private readonly citizens = new Map<string, CitizenRuntime>();
  private readonly feed: FeedEntry[] = [];
  private readonly listeners = new Set<StoreListener>();
  private readonly tourStateMachine: TourStateMachine;
  private readonly chaosEventService = new ChaosEventService();
  private activeChaosEvent: ChaosEventDefinition | null = null;
  private readonly trueFakeMiniGame = new TrueFakeMiniGameService();
  private readonly shapeCountMiniGame = new ShapeCountMiniGameService();
  private readonly countTheBeatMiniGame = new CountTheBeatMiniGameService();
  private readonly luckyCupMiniGame = new LuckyCupMiniGameService();
  private readonly memoryCountMiniGame = new MemoryCountMiniGameService();
  private readonly foodOriginMiniGame = new FoodOriginMiniGameService();
  private readonly coupleOrSiblingsMiniGame = new CoupleOrSiblingsMiniGameService();
  private readonly guessLogoMiniGame = new GuessLogoMiniGameService();
  private readonly mazeGatesMiniGame = new MazeGatesMiniGameService();
  private readonly hangmanMiniGame = new HangmanMiniGameService();
  private readonly beforeOrAfterMiniGame = new BeforeOrAfterMiniGameService();
  private runtimeConfig: RuntimeGameConfig;
  private activeMiniGameId: MiniGameId = 'food-origin';
  private activeSessionMode: ActiveSessionMode = null;
  private tourRoundCount = DEFAULT_RUNTIME_GAME_CONFIG.tour.defaultRoundCount;
  private enabledMiniGameIds = new Set<MiniGameId>(DEFAULT_RUNTIME_GAME_CONFIG.tour.enabledMiniGames);
  private activeTourMiniGameQueue: MiniGameId[] = [];
  private forcedNextMiniGameId: MiniGameId | null = null;
  private chaosMode: HostChaosMode = 'normal';
  private forcedNextChaosEventId: string | null = null;
  private readonly twitchCommandRouter: TwitchCommandRouter;
  private readonly profileService = new ProfileService();
  private readonly progressionService = new ProgressionService();
  private readonly persistence: GamePersistencePort;
  private readonly hasPersistence: boolean;

  private currentSnapshot: GameSnapshot;
  private persistenceStatus: PersistenceStatus = 'loading';
  private persistenceError: string | null = null;
  private persistenceLastSavedAt: string | null = null;
  private persistenceReady: Promise<void> = Promise.resolve();
  private persistenceSaveTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingPersistenceSave: PendingPersistenceSave = {
    profiles: false,
    settings: false,
    tourHistory: false,
  };
  private tourHistory: StoredTourHistoryEntry[] = [];
  private activeTourHistorySeed: ActiveTourHistorySeed | null = null;
  private championCelebrationUserId: string | null = null;
  private championCelebrationStartedAt: number | null = null;
  private championCelebrationTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly tourPlayerStats = new Map<string, TourPlayerStats>();
  private finalTourAwards: TourAwardsSnapshot = EMPTY_TOUR_AWARDS;
  private lastRoundAwards: MiniGameScoreAward[] = [];
  private phaseTick: ReturnType<typeof setInterval> | null = null;
  private lastCommandFeedback: CommandFeedback | null = null;

  constructor(private readonly eventBus: GameEventBus, options: GameStoreOptions = {}) {
    this.runtimeConfig = options.runtimeConfig ?? DEFAULT_RUNTIME_GAME_CONFIG;
    this.tourRoundCount = this.clampTourRoundCount(this.runtimeConfig.tour.defaultRoundCount);
    this.enabledMiniGameIds = new Set(this.runtimeConfig.tour.enabledMiniGames);

    this.hasPersistence = Boolean(options.persistence);
    this.persistence = options.persistence ?? createNoopPersistencePort();

    if (!this.hasPersistence) {
      this.persistenceStatus = 'unavailable';
    }

    this.tourStateMachine = new TourStateMachine({
      resolvePhaseDurationMs: (definition) => this.resolveTourPhaseDurationMs(definition.phase, definition.durationMs),
      onPhaseChanged: (tour, previousPhase) => this.handleTourPhaseChanged(tour, previousPhase),
      onTourCompleted: (tour) => this.handleTourCompleted(tour),
    });

    this.twitchCommandRouter = new TwitchCommandRouter({
      join: (message) => this.handleJoinCommand(message),
      help: (message) => this.handleHelpCommand(message),
      profile: (message) => this.handleProfileCommand(message),
      answerPreview: (message, command) => this.handleMiniGameAnswerCommand(message, command),
      unlockedCommand: (message, command) => this.handleUnlockedCommand(message, command),
      unknown: (message) => this.handleUnknownCommand(message),
      cooldown: (message, command) => this.handleCooldownCommand(message, command),
    });

    this.addFeed('Ta7ady ElGeel is ready. Streamer auto-joins after Twitch login; viewers type !join.');

    if (this.hasPersistence) {
      this.persistenceReady = this.hydrateFromPersistence();
    } else {
      this.addFeed('Persistence adapter unavailable. Runtime data will not be saved.');
    }

    this.currentSnapshot = this.createSnapshot();
  }

  getSnapshot(): GameSnapshot {
    return this.currentSnapshot;
  }

  applyRuntimeConfig(runtimeConfig: RuntimeGameConfig): void {
    this.runtimeConfig = runtimeConfig;
    this.tourRoundCount = this.clampTourRoundCount(this.tourRoundCount || runtimeConfig.tour.defaultRoundCount);
    this.enabledMiniGameIds = new Set(runtimeConfig.tour.enabledMiniGames.length > 0 ? runtimeConfig.tour.enabledMiniGames : MINI_GAME_IDS);

    if (!this.enabledMiniGameIds.has(this.activeMiniGameId)) {
      this.activeMiniGameId = this.selectMiniGameForRound(this.tourStateMachine.getSnapshot().roundNumber || 1, this.tourStateMachine.getSnapshot().tourNumber || 1);
    }

    this.addFeed(`Gameplay config loaded: ${runtimeConfig.tour.defaultRoundCount} rounds, ${runtimeConfig.tour.phaseDurationsMs.answer_window_open ?? 0}ms answer window.`);
    this.notifyChanged();
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  destroy(): void {
    this.stopPhaseTick();

    if (this.persistenceSaveTimer) {
      clearTimeout(this.persistenceSaveTimer);
      this.persistenceSaveTimer = null;
      void this.flushPersistenceSaves();
    }

    if (this.championCelebrationTimer) {
      clearTimeout(this.championCelebrationTimer);
      this.championCelebrationTimer = null;
    }

    this.tourStateMachine.destroy();
    this.listeners.clear();
  }

  submitTwitchChatMessage(twitchMessage: TwitchChatMessage): CommandFeedback {
    this.eventBus.emit({ type: 'twitch.chat.message', message: twitchMessage });

    const result = this.twitchCommandRouter.handle(twitchMessage);
    const feedback = this.createCommandFeedback({
      ok: result.ok,
      displayName: twitchMessage.displayName,
      command: result.command.normalizedMessage || twitchMessage.message,
      message: result.message,
    });

    this.lastCommandFeedback = feedback;
    this.eventBus.emit({ type: result.ok ? 'command.accepted' : 'command.rejected', feedback });
    this.notifyChanged();

    return feedback;
  }

  submitPrivateStreamerAnswer(params: { rawAnswer: string; displayName?: string | null; twitchUserId?: string | null }): CommandFeedback {
    const normalizedCommand = this.normalizePrivateStreamerAnswer(params.rawAnswer);
    const displayName = this.sanitizePrivateStreamerName(params.displayName);

    if (!normalizedCommand) {
      const feedback = this.createCommandFeedback({
        ok: false,
        displayName,
        command: '',
        message: this.locale === 'ar' ? 'اكتب رقم إجابة صحيح.' : 'Type a valid answer number.',
      });

      this.lastCommandFeedback = feedback;
      this.notifyChanged();
      return feedback;
    }

    const privateCitizen = this.ensureStreamerCitizen({ twitchUserId: params.twitchUserId, displayName, announce: false });
    const command = this.parseCommandForResult(normalizedCommand);

    if (command.kind !== 'answer') {
      const feedback = this.createCommandFeedback({
        ok: false,
        displayName: privateCitizen.displayName,
        command: 'private-answer',
        message: this.locale === 'ar' ? 'الإجابة الخاصة غير صالحة للراوند الحالي.' : 'Private answer is not valid for this round.',
      });

      this.lastCommandFeedback = feedback;
      this.notifyChanged();
      return feedback;
    }

    const result = this.handleMiniGameAnswerCommand({
      twitchUserId: privateCitizen.twitchUserId,
      displayName: privateCitizen.displayName,
      message: normalizedCommand,
      isBroadcaster: true,
      isMod: true,
      badges: ['broadcaster'],
      timestamp: Date.now(),
    }, command);

    const feedback = this.createCommandFeedback({
      ok: result.ok,
      displayName: privateCitizen.displayName,
      command: 'private-answer',
      message: result.ok
        ? (this.locale === 'ar' ? 'تم تسجيل إجابة الستريمر بسرية.' : 'Streamer private answer submitted.')
        : result.message,
    });

    this.lastCommandFeedback = feedback;
    this.eventBus.emit({ type: result.ok ? 'command.accepted' : 'command.rejected', feedback });
    this.notifyChanged();

    return feedback;
  }

  registerStreamerPlayer(params: { twitchUserId?: string | null; displayName?: string | null }): CitizenRuntime | null {
    const twitchUserId = this.sanitizeStreamerTwitchUserId(params.twitchUserId);

    if (!twitchUserId) {
      return null;
    }

    const displayName = this.sanitizePrivateStreamerName(params.displayName);
    const citizen = this.ensureStreamerCitizen({ twitchUserId, displayName, announce: true });
    this.notifyChanged();
    return citizen;
  }

  private normalizePrivateStreamerAnswer(rawAnswer: string): string | null {
    const trimmed = rawAnswer.trim();

    if (!trimmed) {
      return null;
    }

    const withoutBang = trimmed.startsWith('!') ? trimmed.slice(1).trim() : trimmed;

    if (/^[1-9]$/.test(withoutBang)) {
      return `!${withoutBang}`;
    }

    if (this.activeMiniGameId === 'hangman') {
      const cleanAnswer = withoutBang.replace(/\s+/g, ' ').slice(0, 30);
      return cleanAnswer ? `!${cleanAnswer}` : null;
    }

    return null;
  }

  private sanitizePrivateStreamerName(displayName: string | null | undefined): string {
    const cleaned = (displayName ?? PRIVATE_STREAMER_FALLBACK_NAME)
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .trim()
      .slice(0, 30);

    return cleaned || PRIVATE_STREAMER_FALLBACK_NAME;
  }

  private ensureStreamerCitizen(params: { twitchUserId?: string | null; displayName: string; announce: boolean }): CitizenRuntime {
    const twitchUserId = this.sanitizeStreamerTwitchUserId(params.twitchUserId) ?? PRIVATE_STREAMER_TWITCH_USER_ID;
    const displayName = this.sanitizePrivateStreamerName(params.displayName);
    const profile = this.profileService.getOrCreateProfile(twitchUserId, displayName);
    const progression = this.progressionService.createView(profile.xp, profile.coins);
    const existingCitizen = this.citizens.get(twitchUserId);
    const wasAlreadyOfficial = existingCitizen?.role === 'official';

    const citizen: CitizenRuntime = {
      twitchUserId,
      displayName,
      // The streamer is always an official player. They must never need !join and must not
      // become a spectator after reconnecting during a live Tour.
      role: 'official',
      score: existingCitizen?.score ?? 0,
      joinedAt: existingCitizen?.joinedAt ?? Date.now(),
      level: progression.level,
      xp: progression.xp,
      coins: progression.coins,
      xpToNextLevel: progression.xpToNextLevel,
      progressPercent: progression.progressPercent,
      unlockedCommandIds: progression.unlockedCommandIds,
    };

    this.citizens.set(twitchUserId, citizen);
    this.ensureTourPlayerStats(citizen);
    this.queuePersistenceSave('profiles');

    if (params.announce && !wasAlreadyOfficial) {
      this.addFeed(this.locale === 'ar'
        ? `${displayName} انضاف تلقائياً كلاعب الستريمر.`
        : `${displayName} auto-joined as the streamer player.`);
      this.eventBus.emit({ type: 'citizen.joined', citizen });
    }

    return citizen;
  }

  private sanitizeStreamerTwitchUserId(twitchUserId: string | null | undefined): string | null {
    const cleaned = (twitchUserId ?? '')
      .replace(/[^a-zA-Z0-9_:-]/g, '')
      .trim()
      .slice(0, 64);

    return cleaned || null;
  }

  startTour(roundCountOverride?: number, selectedMiniGameIds?: MiniGameId[], sessionMode: Exclude<ActiveSessionMode, null> = 'tour'): void {
    const currentTour = this.tourStateMachine.getSnapshot();

    if (currentTour.isCleanupActive) {
      this.addFeed(translate(this.locale, 'event.tourCleanupInProgress'));
      this.notifyChanged();
      return;
    }

    if (!currentTour.canStartTour) {
      this.addFeed(translate(this.locale, 'event.tourAlreadyActive'));
      this.notifyChanged();
      return;
    }

    const officialCount = this.getOfficialCitizens().length;

    if (officialCount === 0) {
      this.addFeed(translate(this.locale, 'event.tourCannotStartWithoutOfficials'));
      this.notifyChanged();
      return;
    }

    const selectedPool = this.normalizeSelectedMiniGames(selectedMiniGameIds);
    const plannedRoundCount = selectedPool.length > 0
      ? this.clampTourRoundCount(roundCountOverride ?? selectedPool.length)
      : roundCountOverride
        ? this.clampTourRoundCount(roundCountOverride)
        : this.tourRoundCount;

    // Phase 13W sequence starts immediately on mini_game_intro, so all per-tour
    // services must be prepared before the state machine emits the first phase.
    const nextTourNumber = currentTour.tourNumber + 1;
    this.activeTourMiniGameQueue = this.buildTourMiniGameQueue(plannedRoundCount, selectedPool.length > 0 ? selectedPool : null);
    this.activeMiniGameId = this.selectMiniGameForRound(1, nextTourNumber);
    this.beginTourAwardTracking(plannedRoundCount);
    this.chaosEventService.beginTour();
    this.activeChaosEvent = null;
    this.lastRoundAwards = [];
    this.trueFakeMiniGame.beginTour();
    this.shapeCountMiniGame.beginTour();
    this.memoryCountMiniGame.beginTour();
    this.foodOriginMiniGame.beginTour();
    this.coupleOrSiblingsMiniGame.beginTour();
    this.guessLogoMiniGame.beginTour();
    this.mazeGatesMiniGame.beginTour();
    this.hangmanMiniGame.beginTour();
    this.beforeOrAfterMiniGame.beginTour();

    this.activeSessionMode = sessionMode;
    const result = this.tourStateMachine.startTour(plannedRoundCount);

    if (!result.ok) {
      this.activeSessionMode = null;
      this.addFeed(translate(this.locale, 'event.tourAlreadyActive'));
      this.notifyChanged();
      return;
    }

    if (result.snapshot.tourId) {
      this.activeTourHistorySeed = {
        tourId: result.snapshot.tourId,
        startedAt: new Date(result.snapshot.phaseStartedAt ?? Date.now()).toISOString(),
        roundIndex: result.snapshot.tourNumber,
      };
    }

    this.chaosPercent = Math.min(100, this.chaosPercent + 10 + Math.min(12, officialCount * 2));
    this.addFeed(translate(this.locale, 'event.tourStarted'));
    this.eventBus.emit({ type: 'tour.started', officialCount, tour: result.snapshot });
    this.startPhaseTick();
    this.notifyChanged();
  }

  endTour(): void {
    const result = this.tourStateMachine.endTourImmediately();

    if (!result.ok) {
      this.addFeed(translate(this.locale, 'event.tourNoActiveTour'));
      this.notifyChanged();
      return;
    }

    this.activeTourMiniGameQueue = [];
    this.activeSessionMode = null;
    this.chaosPercent = Math.max(2, this.chaosPercent - 6);
    this.addFeed(translate(this.locale, 'event.tourEnded'));
    this.eventBus.emit({ type: 'tour.ended', tour: result.snapshot });

    if (result.snapshot.phase === 'tour_complete') {
      this.stopPhaseTick();
    } else {
      this.startPhaseTick();
    }

    this.notifyChanged();
  }

  backToStage(): void {
    const result = this.tourStateMachine.returnToLobbyFromFinalScoreboard();

    if (!result.ok) {
      this.addFeed(this.locale === 'ar' ? 'لا يمكن الرجوع للمسرح الآن.' : 'Cannot return to the stage right now.');
      this.notifyChanged();
      return;
    }

    this.activeChaosEvent = null;
    this.lastRoundAwards = [];
    this.activeSessionMode = null;
    this.addFeed(this.locale === 'ar' ? 'تم الرجوع للمسرح.' : 'Back to stage.');
    this.notifyChanged();
  }

  pauseTour(): void {
    const result = this.tourStateMachine.pauseTour();

    if (!result.ok) {
      this.addFeed(translate(this.locale, 'event.tourCannotPause'));
      this.notifyChanged();
      return;
    }

    this.addFeed(translate(this.locale, 'event.tourPaused'));
    this.eventBus.emit({ type: 'tour.phase.changed', phase: result.snapshot.phase, tour: result.snapshot });
    this.notifyChanged();
  }

  resumeTour(): void {
    const result = this.tourStateMachine.resumeTour();

    if (!result.ok) {
      this.addFeed(translate(this.locale, 'event.tourCannotResume'));
      this.notifyChanged();
      return;
    }

    this.addFeed(translate(this.locale, 'event.tourResumed'));
    this.eventBus.emit({ type: 'tour.phase.changed', phase: result.snapshot.phase, tour: result.snapshot });
    this.startPhaseTick();
    this.notifyChanged();
  }

  skipPhase(): void {
    const previousPhase = this.tourStateMachine.getSnapshot().phase;
    const result = this.tourStateMachine.skipCurrentPhase();

    if (!result.ok) {
      this.addFeed(translate(this.locale, 'event.tourCannotSkip'));
      this.notifyChanged();
      return;
    }

    const previousPhaseName = this.getPhaseLabel(previousPhase);
    const nextPhaseName = this.getPhaseLabel(result.snapshot.phase);
    this.addFeed(translate(this.locale, 'event.tourPhaseSkipped', {
      previous: previousPhaseName,
      next: nextPhaseName,
    }));
    this.startPhaseTick();
    this.notifyChanged();
  }

  skipRound(): void {
    const result = this.tourStateMachine.skipToNextRound();

    if (!result.ok) {
      this.addFeed(this.locale === 'ar' ? 'لا يمكن تخطي الراوند الآن.' : 'Cannot skip the current round right now.');
      this.notifyChanged();
      return;
    }

    this.addFeed(this.locale === 'ar' ? 'تم تخطي الراوند الحالي.' : 'Current round skipped.');
    this.startPhaseTick();
    this.notifyChanged();
  }

  restartRound(): void {
    const result = this.tourStateMachine.restartCurrentRound();

    if (!result.ok) {
      this.addFeed(this.locale === 'ar' ? 'لا يمكن إعادة الراوند الآن.' : 'Cannot restart the current round right now.');
      this.notifyChanged();
      return;
    }

    this.addFeed(this.locale === 'ar' ? 'تمت إعادة الراوند الحالي.' : 'Current round restarted.');
    this.startPhaseTick();
    this.notifyChanged();
  }

  getSingleMiniGameRoundCount(miniGameId: MiniGameId): number {
    return this.runtimeConfig.tour.singleMiniGameRoundCounts[miniGameId] ?? 1;
  }

  setTourRoundCount(roundCount: number): void {
    const nextRoundCount = this.clampTourRoundCount(roundCount);
    this.tourRoundCount = nextRoundCount;
    this.addFeed(this.locale === 'ar' ? `عدد راوندات التور القادم: ${nextRoundCount}` : `Next Tour round count: ${nextRoundCount}`);
    this.notifyChanged();
  }

  setMiniGameEnabled(miniGameId: MiniGameId, enabled: boolean): void {
    if (enabled) {
      this.enabledMiniGameIds.add(miniGameId);
    } else if (this.enabledMiniGameIds.size > 1) {
      this.enabledMiniGameIds.delete(miniGameId);
      if (this.forcedNextMiniGameId === miniGameId) {
        this.forcedNextMiniGameId = null;
      }
    } else {
      this.addFeed(this.locale === 'ar' ? 'لازم تسيب ميني جيم واحدة مفعلة على الأقل.' : 'Keep at least one mini-game enabled.');
    }

    this.notifyChanged();
  }

  setForcedNextMiniGame(miniGameId: MiniGameId | null): void {
    if (miniGameId && !this.enabledMiniGameIds.has(miniGameId)) {
      this.enabledMiniGameIds.add(miniGameId);
    }

    this.forcedNextMiniGameId = miniGameId;
    this.addFeed(miniGameId
      ? (this.locale === 'ar' ? `الميني جيم القادمة إجبارية: ${miniGameId}` : `Forced next mini-game: ${miniGameId}`)
      : (this.locale === 'ar' ? 'تم إلغاء إجبار الميني جيم القادمة.' : 'Cleared forced next mini-game.'));
    this.notifyChanged();
  }

  setChaosMode(mode: HostChaosMode): void {
    this.chaosMode = mode;
    this.addFeed(this.locale === 'ar' ? `وضع الفوضى: ${mode}` : `Chaos mode: ${mode}`);
    this.notifyChanged();
  }

  forceNextChaosEvent(eventId: string | null): void {
    this.forcedNextChaosEventId = eventId;
    this.addFeed(eventId
      ? (this.locale === 'ar' ? `حدث الفوضى القادم: ${eventId}` : `Forced next chaos event: ${eventId}`)
      : (this.locale === 'ar' ? 'تم إلغاء حدث الفوضى الإجباري.' : 'Cleared forced chaos event.'));
    this.notifyChanged();
  }

  clearSpectators(): void {
    let removed = 0;
    for (const [id, citizen] of this.citizens.entries()) {
      if (citizen.role === 'spectator') {
        this.citizens.delete(id);
        removed += 1;
      }
    }

    this.addFeed(this.locale === 'ar' ? `تم حذف ${removed} متفرج.` : `Cleared ${removed} spectator(s).`);
    this.notifyChanged();
  }

  clearRuntimePlayers(): void {
    if (this.tourStateMachine.isTourActive()) {
      this.addFeed(this.locale === 'ar' ? 'أنهي التور قبل حذف كل اللاعبين.' : 'End the Tour before clearing all players.');
      this.notifyChanged();
      return;
    }

    const count = this.citizens.size;
    this.citizens.clear();
    this.tourPlayerStats.clear();
    this.finalTourAwards = EMPTY_TOUR_AWARDS;
    this.addFeed(this.locale === 'ar' ? `تم حذف ${count} لاعب من الجلسة.` : `Cleared ${count} runtime player(s).`);
    this.notifyChanged();
  }

  resetRuntimeScores(): void {
    for (const [id, citizen] of this.citizens.entries()) {
      this.citizens.set(id, { ...citizen, score: 0 });
    }

    for (const [id, stats] of this.tourPlayerStats.entries()) {
      this.tourPlayerStats.set(id, { ...stats, startScore: 0, currentScore: 0, pointsEarned: 0 });
    }

    this.addFeed(this.locale === 'ar' ? 'تم تصفير السكور الحالي.' : 'Runtime scores reset.');
    this.notifyChanged();
  }

  triggerLevel10ChampionCelebrationTest(): void {
    const candidates = this.getOfficialCitizens().length > 0 ? this.getOfficialCitizens() : [...this.citizens.values()];
    const citizen = candidates[0];

    if (!citizen) {
      this.addFeed(this.locale === 'ar' ? 'أضيف لاعب QA الأول لتجربة احتفال ليفل 10.' : 'Add a QA player first to test the Level 10 celebration.');
      this.notifyChanged();
      return;
    }

    const topScore = Math.max(0, ...[...this.citizens.values()].map((candidate) => candidate.score));
    const profile = this.profileService.getOrCreateProfile(citizen.twitchUserId, citizen.displayName);
    const targetXp = Math.max(profile.xp, 2_700);
    const progression = this.progressionService.createView(targetXp, Math.max(profile.coins, citizen.coins));

    this.profileService.updateProgress(citizen.twitchUserId, {
      xp: targetXp,
      coins: progression.coins,
      level: Math.max(10, progression.level),
    });

    this.citizens.set(citizen.twitchUserId, {
      ...citizen,
      score: topScore + 250,
      level: Math.max(10, progression.level),
      xp: targetXp,
      coins: progression.coins,
      xpToNextLevel: progression.xpToNextLevel,
      progressPercent: progression.progressPercent,
      unlockedCommandIds: progression.unlockedCommandIds,
    });

    this.triggerChampionCelebration(citizen.twitchUserId);
    this.addFeed(this.locale === 'ar' ? `اختبار احتفال ليفل 10: ${citizen.displayName}` : `Level 10 champion celebration test: ${citizen.displayName}`);
    this.queuePersistenceSave('profiles');
    this.notifyChanged();
  }

  setLanguage(locale: LocaleCode): void {
    if (this.locale === locale) {
      return;
    }

    this.locale = locale;
    this.addFeed(translate(this.locale, 'event.languageChanged'));
    this.eventBus.emit({ type: 'language.changed', locale: this.locale });
    this.queuePersistenceSave('settings');
    this.notifyChanged();
  }

  switchLanguage(): void {
    this.setLanguage(this.locale === 'en' ? 'ar' : 'en');
  }

  getOfficialCitizens(): CitizenRuntime[] {
    return [...this.citizens.values()].filter((citizen) => citizen.role === 'official');
  }

  getSpectatorCitizens(): CitizenRuntime[] {
    return [...this.citizens.values()].filter((citizen) => citizen.role === 'spectator');
  }

  private joinCitizen(params: { twitchUserId: string; displayName: string }): CitizenRuntime {
    const existingCitizen = this.citizens.get(params.twitchUserId);
    const profile = this.profileService.getOrCreateProfile(params.twitchUserId, params.displayName);
    const progression = this.progressionService.createView(profile.xp, profile.coins);

    if (existingCitizen) {
      const updatedCitizen: CitizenRuntime = {
        ...existingCitizen,
        displayName: params.displayName,
        level: progression.level,
        xp: progression.xp,
        coins: progression.coins,
        xpToNextLevel: progression.xpToNextLevel,
        progressPercent: progression.progressPercent,
        unlockedCommandIds: progression.unlockedCommandIds,
      };

      this.citizens.set(params.twitchUserId, updatedCitizen);
      this.addFeed(translate(this.locale, 'command.feedback.alreadyJoined', { name: params.displayName }));
      this.queuePersistenceSave('profiles');
      this.ensureTourPlayerStats(updatedCitizen);
      return updatedCitizen;
    }

    const role = this.tourStateMachine.isTourActive() ? 'spectator' : 'official';
    const citizen: CitizenRuntime = {
      twitchUserId: params.twitchUserId,
      displayName: params.displayName,
      role,
      score: 0,
      joinedAt: Date.now(),
      level: progression.level,
      xp: progression.xp,
      coins: progression.coins,
      xpToNextLevel: progression.xpToNextLevel,
      progressPercent: progression.progressPercent,
      unlockedCommandIds: progression.unlockedCommandIds,
    };

    this.citizens.set(params.twitchUserId, citizen);

    const eventKey =
      role === 'official'
        ? 'event.citizenJoinedOfficial'
        : 'event.citizenJoinedSpectator';

    this.addFeed(translate(this.locale, eventKey, { name: params.displayName }));
    this.eventBus.emit({ type: 'citizen.joined', citizen });
    this.queuePersistenceSave('profiles');
    this.ensureTourPlayerStats(citizen);

    return citizen;
  }

  private handleJoinCommand(message: TwitchChatMessage) {
    const citizen = this.joinCitizen({
      twitchUserId: message.twitchUserId,
      displayName: message.displayName,
    });

    return {
      ok: true,
      command: this.parseCommandForResult(message.message),
      message: translate(this.locale, citizen.role === 'official' ? 'command.feedback.joinedOfficial' : 'command.feedback.joinedSpectator', {
        name: citizen.displayName,
      }),
    };
  }

  private handleHelpCommand(message: TwitchChatMessage) {
    const citizen = this.citizens.get(message.twitchUserId);
    const level = citizen?.level ?? 1;
    const unlocked = this.progressionService
      .getUnlockedCommands(level)
      .slice(0, 6)
      .map((command) => command.primaryCommand)
      .join(', ');
    const nextLocked = this.progressionService.createSnapshot(this.locale).commandUnlocks.find((unlock) => unlock.levelRequired > level);
    const nextText = nextLocked
      ? translate(this.locale, 'progression.nextUnlockShort', {
          command: nextLocked.primaryCommand,
          level: String(nextLocked.levelRequired),
        })
      : translate(this.locale, 'progression.allUnlocked');
    const response = translate(this.locale, 'command.feedback.helpProgression', { commands: unlocked, next: nextText });
    this.addFeed(`${message.displayName}: ${response}`);

    return {
      ok: true,
      command: this.parseCommandForResult(message.message),
      message: response,
    };
  }

  private handleProfileCommand(message: TwitchChatMessage) {
    const citizen = this.citizens.get(message.twitchUserId);
    const profile = this.profileService.getProfile(message.twitchUserId);
    const response = citizen && profile
      ? translate(this.locale, 'command.feedback.profile', {
          name: citizen.displayName,
          level: String(citizen.level),
          xp: String(citizen.xp),
          coins: String(citizen.coins),
          role: citizen.role.toUpperCase(),
          next: String(citizen.xpToNextLevel),
        })
      : translate(this.locale, 'command.feedback.profileMissing', { name: message.displayName });

    this.addFeed(response);

    return {
      ok: Boolean(citizen && profile),
      command: this.parseCommandForResult(message.message),
      message: response,
    };
  }

  private handleMiniGameAnswerCommand(message: TwitchChatMessage, command: ParsedTwitchCommand) {
    const citizen = this.citizens.get(message.twitchUserId);

    if (!citizen) {
      const response = translate(this.locale, 'command.feedback.answerNeedsJoin', { name: message.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    if (this.activeMiniGameId === 'shape-count') {
      return this.handleShapeCountAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'memory-count') {
      return this.handleMemoryCountAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'food-origin') {
      return this.handleFoodOriginAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'couple-or-siblings') {
      return this.handleCoupleOrSiblingsAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'guess-logo') {
      return this.handleGuessLogoAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'maze-gates') {
      return this.handleMazeGatesAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'hangman') {
      return this.handleHangmanAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'count-the-beat') {
      return this.handleCountTheBeatAnswerCommand(citizen, command);
    }

    if (this.activeMiniGameId === 'lucky-cup') {
      return this.handleLuckyCupAnswerCommand(citizen, command);
    }

    return this.handleTrueFakeAnswerCommand(citizen, command);
  }


  private handleCountTheBeatAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getNumericAnswerFromCommand(command);

    if (answer === null || answer < 0 || answer > 99) {
      const response = translate(this.locale, 'minigame.countTheBeat.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.countTheBeatMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.countTheBeat.alreadyAnswered'
        : 'minigame.countTheBeat.answerWindowClosed';

      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.countTheBeat.answerAccepted', {
      name: citizen.displayName,
      answer: String(answer),
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleLuckyCupAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getNumericAnswerFromCommand(command);

    if (answer === null || answer < 1 || answer > 3) {
      const response = translate(this.locale, 'minigame.luckyCup.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.luckyCupMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.luckyCup.alreadyAnswered'
        : 'minigame.luckyCup.answerWindowClosed';

      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.luckyCup.answerAccepted', {
      name: citizen.displayName,
      answer: String(answer),
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private getNumericAnswerFromCommand(command: ParsedTwitchCommand): number | null {
    const value = command.normalizedMessage.replace(/^!+/, '').trim();
    if (!/^\d{1,2}$/.test(value)) {
      return null;
    }

    return Number(value);
  }


  private handleTrueFakeAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getTrueFakeAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.trueFake.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.trueFakeMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.trueFake.alreadyAnswered'
        : 'minigame.trueFake.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.trueFake.answerAccepted', {
      name: citizen.displayName,
      answer: translate(this.locale, answer === 'true' ? 'minigame.trueFake.true' : 'minigame.trueFake.fake'),
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleShapeCountAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getShapeCountAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.shapeCount.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.shapeCountMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.shapeCount.alreadyAnswered'
        : 'minigame.shapeCount.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.shapeCount.answerAccepted', {
      name: citizen.displayName,
      answer: this.getShapeLabel(answer),
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleMemoryCountAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getMemoryCountAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.memoryCount.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.memoryCountMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.memoryCount.alreadyAnswered'
        : 'minigame.memoryCount.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.memoryCount.answerAccepted', {
      name: citizen.displayName,
      answer: this.getAnswerOptionNumber(command)?.toString() ?? '-',
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleFoodOriginAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getFoodOriginAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.foodOrigin.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.foodOriginMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.foodOrigin.alreadyAnswered'
        : 'minigame.foodOrigin.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.foodOrigin.answerAccepted', {
      name: citizen.displayName,
      answer: this.getAnswerOptionNumber(command)?.toString() ?? '-',
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleCoupleOrSiblingsAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getCoupleOrSiblingsAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.coupleOrSiblings.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.coupleOrSiblingsMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.coupleOrSiblings.alreadyAnswered'
        : 'minigame.coupleOrSiblings.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.coupleOrSiblings.answerAccepted', {
      name: citizen.displayName,
      answer: this.getAnswerOptionNumber(command)?.toString() ?? '-',
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleGuessLogoAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getGuessLogoAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.guessLogo.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.guessLogoMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.guessLogo.alreadyAnswered'
        : 'minigame.guessLogo.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.guessLogo.answerAccepted', {
      name: citizen.displayName,
      answer: this.getAnswerOptionNumber(command)?.toString() ?? '-',
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }


  private handleMazeGatesAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getMazeGatesAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.mazeGates.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.mazeGatesMiniGame.submitAnswer(citizen, answer);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.mazeGates.alreadyAnswered'
        : 'minigame.mazeGates.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'minigame.mazeGates.answerAccepted', {
      name: citizen.displayName,
      answer: this.getAnswerOptionNumber(command)?.toString() ?? '-',
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }


  private handleHangmanAnswerCommand(citizen: CitizenRuntime, command: ParsedTwitchCommand) {
    const answer = this.getHangmanAnswerFromCommand(command);

    if (!answer) {
      const response = translate(this.locale, 'minigame.hangman.invalidAnswer', { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const result = this.hangmanMiniGame.submitGuess(citizen, answer, this.locale);

    if (!result.ok) {
      const reasonKey = result.reason === 'already_answered'
        ? 'minigame.hangman.alreadyAnswered'
        : 'minigame.hangman.answerWindowClosed';
      const response = translate(this.locale, reasonKey, { name: citizen.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const guessLabel = answer.startsWith('letter:') ? answer.replace('letter:', '') : answer.replace('word:', '');
    const response = translate(this.locale, 'minigame.hangman.answerAccepted', {
      name: citizen.displayName,
      answer: guessLabel,
    });

    this.addFeed(response);
    this.eventBus.emit({ type: 'minigame.answer.accepted', twitchUserId: citizen.twitchUserId, answer });
    this.notifyChanged();

    return { ok: true, command, message: response };
  }

  private handleUnlockedCommand(message: TwitchChatMessage, command: ParsedTwitchCommand) {
    const citizen = this.citizens.get(message.twitchUserId);

    if (!citizen) {
      const response = translate(this.locale, 'progression.commandNeedsJoin', { name: message.displayName });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const lockedCommand = this.progressionService.getLockedCommand(command.rawCommand, citizen.level);

    if (lockedCommand) {
      const response = translate(this.locale, 'progression.commandLocked', {
        name: citizen.displayName,
        command: lockedCommand.primaryCommand,
        level: String(lockedCommand.levelRequired),
      });
      this.addFeed(response);
      return { ok: false, command, message: response };
    }

    const response = translate(this.locale, 'progression.commandActivated', {
      name: citizen.displayName,
      command: command.rawCommand,
    });
    this.addFeed(response);
    return { ok: true, command, message: response };
  }

  private handleUnknownCommand(message: TwitchChatMessage) {
    const response = translate(this.locale, 'command.feedback.unknownCommand', { name: message.displayName });
    this.addFeed(response);

    return {
      ok: false,
      command: this.parseCommandForResult(message.message),
      message: response,
    };
  }

  private handleCooldownCommand(message: TwitchChatMessage, command: ParsedTwitchCommand) {
    const response = translate(this.locale, 'command.feedback.cooldown', { name: message.displayName });

    return {
      ok: false,
      command,
      message: response,
    };
  }

  private parseCommandForResult(message: string): ParsedTwitchCommand {
    const rawCommand = message.trim().split(' ')[0] ?? '';

    return {
      kind: 'unknown',
      rawCommand,
      args: [],
      normalizedMessage: message.trim(),
    };
  }

  private getTrueFakeAnswerFromCommand(command: ParsedTwitchCommand): TrueFakeAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (optionNumber === 1) {
      return 'true';
    }

    if (optionNumber === 2) {
      return 'fake';
    }

    return null;
  }

  private getShapeCountAnswerFromCommand(command: ParsedTwitchCommand): ShapeCountAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (!optionNumber || optionNumber < 1 || optionNumber > 4) {
      return null;
    }

    return this.shapeCountMiniGame.getAnswerByOptionNumber(optionNumber);
  }

  private getMemoryCountAnswerFromCommand(command: ParsedTwitchCommand): MemoryCountAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (!optionNumber || optionNumber < 1 || optionNumber > 4) {
      return null;
    }

    return this.memoryCountMiniGame.getAnswerByOptionNumber(optionNumber);
  }

  private getFoodOriginAnswerFromCommand(command: ParsedTwitchCommand): FoodOriginAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (!optionNumber || optionNumber < 1 || optionNumber > 4) {
      return null;
    }

    return this.foodOriginMiniGame.getAnswerByOptionNumber(optionNumber);
  }

  private getCoupleOrSiblingsAnswerFromCommand(command: ParsedTwitchCommand): CoupleOrSiblingsAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (!optionNumber || optionNumber < 1 || optionNumber > 2) {
      return null;
    }

    return this.coupleOrSiblingsMiniGame.getAnswerByOptionNumber(optionNumber);
  }

  private getGuessLogoAnswerFromCommand(command: ParsedTwitchCommand): GuessLogoAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (!optionNumber || optionNumber < 1 || optionNumber > 4) {
      return null;
    }

    return this.guessLogoMiniGame.getAnswerByOptionNumber(optionNumber);
  }


  private getMazeGatesAnswerFromCommand(command: ParsedTwitchCommand): MazeGateAnswer | null {
    const optionNumber = this.getAnswerOptionNumber(command);

    if (!optionNumber || optionNumber < 1 || optionNumber > 4) {
      return null;
    }

    return this.mazeGatesMiniGame.getAnswerByOptionNumber(optionNumber);
  }


  private getHangmanAnswerFromCommand(command: ParsedTwitchCommand): HangmanAnswer | null {
    if (command.kind !== 'answer') {
      return null;
    }

    return createHangmanAnswerFromCommand(command.rawCommand, command.args);
  }

  private getAnswerOptionNumber(command: ParsedTwitchCommand): number | null {
    if (command.kind !== 'answer') {
      return null;
    }

    const rawOption = command.rawCommand.replace(/^!/, '').trim();
    const optionNumber = Number.parseInt(rawOption, 10);

    if (!Number.isInteger(optionNumber)) {
      return null;
    }

    return optionNumber;
  }

  private getShapeLabel(shape: ShapeCountShapeId): string {
    const labels: Record<ShapeCountShapeId, { en: string; ar: string }> = {
      circle: { en: 'Circle', ar: 'دائرة' },
      square: { en: 'Square', ar: 'مربع' },
      triangle: { en: 'Triangle', ar: 'مثلث' },
      star: { en: 'Star', ar: 'نجمة' },
      diamond: { en: 'Diamond', ar: 'ماسة' },
      hexagon: { en: 'Hexagon', ar: 'سداسي' },
    };

    return labels[shape][this.locale];
  }

  private clampTourRoundCount(roundCount: number): number {
    return Math.max(
      this.runtimeConfig.tour.minRoundCount,
      Math.min(this.runtimeConfig.tour.maxRoundCount, Math.round(roundCount)),
    );
  }

  private selectMiniGameForRound(roundNumber: number, tourNumber: number): MiniGameId {
    if (this.forcedNextMiniGameId && this.enabledMiniGameIds.has(this.forcedNextMiniGameId)) {
      return this.forcedNextMiniGameId;
    }

    const queuedMiniGame = this.activeTourMiniGameQueue[roundNumber - 1];

    if (queuedMiniGame) {
      return queuedMiniGame;
    }

    const configuredRotation = this.runtimeConfig.tour.miniGameRotation.length > 0 ? this.runtimeConfig.tour.miniGameRotation : MINI_GAME_IDS;
    const cycle = configuredRotation.filter((miniGameId) => this.enabledMiniGameIds.has(miniGameId));
    const safeCycle = cycle.length > 0 ? cycle : MINI_GAME_IDS;
    const rotationOffset = Math.max(0, tourNumber - 1);
    return safeCycle[(rotationOffset + roundNumber - 1) % safeCycle.length];
  }

  private normalizeSelectedMiniGames(selectedMiniGameIds?: MiniGameId[] | null): MiniGameId[] {
    if (!selectedMiniGameIds?.length) {
      return [];
    }

    const uniqueSelected = [...new Set(selectedMiniGameIds)];
    const enabledSelected = uniqueSelected.filter((miniGameId) => MINI_GAME_IDS.includes(miniGameId) && this.enabledMiniGameIds.has(miniGameId));
    return enabledSelected.length > 0 ? enabledSelected : [];
  }

  private buildTourMiniGameQueue(roundCount: number, selectedMiniGameIds: MiniGameId[] | null): MiniGameId[] {
    const configuredRotation = this.runtimeConfig.tour.miniGameRotation.length > 0 ? this.runtimeConfig.tour.miniGameRotation : MINI_GAME_IDS;
    const configuredPool = configuredRotation.filter((miniGameId) => this.enabledMiniGameIds.has(miniGameId));
    const basePool = selectedMiniGameIds?.length ? selectedMiniGameIds : configuredPool.length > 0 ? configuredPool : MINI_GAME_IDS;
    const queue: MiniGameId[] = [];

    while (queue.length < roundCount) {
      queue.push(...shuffleMiniGameIds(basePool));
    }

    return queue.slice(0, roundCount);
  }

  private getActiveMiniGameService(): TrueFakeMiniGameService | ShapeCountMiniGameService | MemoryCountMiniGameService | FoodOriginMiniGameService | BeforeOrAfterMiniGameService | CoupleOrSiblingsMiniGameService | GuessLogoMiniGameService | MazeGatesMiniGameService | HangmanMiniGameService | CountTheBeatMiniGameService | LuckyCupMiniGameService {
    switch (this.activeMiniGameId) {
      case 'shape-count':
        return this.shapeCountMiniGame;
      case 'count-the-beat':
        return this.countTheBeatMiniGame;
      case 'lucky-cup':
        return this.luckyCupMiniGame;
      case 'memory-count':
        return this.memoryCountMiniGame;
      case 'food-origin':
        return this.foodOriginMiniGame;
      case 'couple-or-siblings':
        return this.coupleOrSiblingsMiniGame;
      case 'guess-logo':
        return this.guessLogoMiniGame;
      case 'maze-gates':
        return this.mazeGatesMiniGame;
      case 'hangman':
        return this.hangmanMiniGame;
      case 'before-after':
        return this.beforeOrAfterMiniGame;
      case 'true-fake':
      default:
        return this.trueFakeMiniGame;
    }
  }

  private createCommandFeedback(params: { ok: boolean; displayName: string; command: string; message: string }): CommandFeedback {
    return {
      id: crypto.randomUUID(),
      ok: params.ok,
      displayName: params.displayName,
      command: params.command,
      message: params.message,
      createdAt: Date.now(),
    };
  }

  private handleTourPhaseChanged(tour: TourSnapshot, previousPhase: TourPhase): void {
    const phaseName = this.getPhaseLabel(tour.phase);
    this.syncMiniGameWithTourPhase(tour, previousPhase);

    if (tour.phase === 'tour_complete' || tour.phase === 'cleanup' || tour.phase === 'lobby_open') {
      this.activeChaosEvent = null;
    }

    if (tour.phase !== 'lobby_open' && tour.phase !== previousPhase) {
      this.addFeed(translate(this.locale, 'event.tourPhaseChanged', { phase: phaseName }));
    }

    this.eventBus.emit({ type: 'tour.phase.changed', phase: tour.phase, tour });

    if (tour.isTourActive && tour.phase !== 'tour_complete') {
      this.startPhaseTick();
    } else {
      this.stopPhaseTick();
    }

    this.notifyChanged();
  }

  private syncMiniGameWithTourPhase(tour: TourSnapshot, previousPhase: TourPhase): void {
    switch (tour.phase) {
      case 'mini_game_intro':
        this.activeMiniGameId = this.selectMiniGameForRound(tour.roundNumber, tour.tourNumber);
        if (this.forcedNextMiniGameId === this.activeMiniGameId) {
          this.forcedNextMiniGameId = null;
        }
        this.lastRoundAwards = [];
        this.getActiveMiniGameService().startRound(tour.roundNumber);
        this.selectChaosEventForRound(tour.roundNumber);
        this.addFeed(`${this.locale === 'ar' ? 'راوند' : 'Round'} ${tour.roundNumber}/${tour.totalRounds}: ${translate(this.locale, this.getMiniGameTranslationKey('started'))}`);
        break;
      case 'tour_starting':
        if (previousPhase === 'scoring') {
          this.activeMiniGameId = this.selectMiniGameForRound(tour.roundNumber, tour.tourNumber);
          if (this.forcedNextMiniGameId === this.activeMiniGameId) {
            this.forcedNextMiniGameId = null;
          }
          this.lastRoundAwards = [];
          this.getActiveMiniGameService().startRound(tour.roundNumber);
          this.selectChaosEventForRound(tour.roundNumber);
          this.addFeed(`${this.locale === 'ar' ? 'راوند' : 'Round'} ${tour.roundNumber}/${tour.totalRounds}: ${translate(this.locale, this.getMiniGameTranslationKey('started'))}`);
        }
        this.getActiveMiniGameService().setStatus('prepare');
        break;
      case 'answer_window_open': {
        const miniGameService = this.getActiveMiniGameService();
        if (supportsTimedAnswerHint(miniGameService)) {
          miniGameService.configureAnswerWindow({
            startedAt: tour.phaseStartedAt ?? Date.now(),
            durationMs: tour.phaseDurationMs,
          });
        }
        miniGameService.setStatus('answering');
        this.addFeed(translate(this.locale, this.getMiniGameTranslationKey('answerWindowOpen')));
        break;
      }
      case 'scoring':
        // Resolve and score immediately after the answer timer closes. The UI holds on the
        // round score screen until the host presses Go To Leaderboard / View Final Score.
        this.getActiveMiniGameService().resolveRound();
        this.addFeed(this.buildMiniGameResultFeed());
        this.applyMiniGameScoring();
        this.triggerRoundChampionCelebration();
        break;
      case 'tour_complete':
        this.getActiveMiniGameService().setStatus('leaderboard');
        this.finalTourAwards = this.computeTourAwardsSnapshot(tour.totalRounds);
        this.triggerChampionCelebration(this.finalTourAwards.champion?.twitchUserId ?? null);
        this.addFeed(this.locale === 'ar' ? 'اكتمل التور. عرض النتيجة النهائية.' : 'Tour complete. Showing final score.');
        break;
      case 'cleanup':
        this.getActiveMiniGameService().setStatus('leaderboard');
        break;
      case 'lobby_open':
      default:
        break;
    }
  }

  private buildMiniGameResultFeed(): string {
    const miniGame = this.getActiveMiniGameService().getSnapshot(this.locale);
    const answerLabel = this.getMiniGameAnswerLabel(miniGame);

    return translate(this.locale, this.getMiniGameTranslationKey('resultFeed'), {
      answer: answerLabel,
      official: String(miniGame.correctOfficialCount),
      spectator: String(miniGame.correctSpectatorCount),
    });
  }

  private getMiniGameAnswerLabel(miniGame = this.getActiveMiniGameService().getSnapshot(this.locale)): string {
    if (miniGame.id === 'shape-count') {
      return miniGame.correctAnswer ? this.getShapeLabel(miniGame.correctAnswer as ShapeCountShapeId) : '-';
    }

    if (miniGame.id === 'memory-count') {
      return miniGame.memoryCount?.correctCount !== null && miniGame.memoryCount?.correctCount !== undefined
        ? String(miniGame.memoryCount.correctCount)
        : '-';
    }

    if (miniGame.id === 'food-origin') {
      return miniGame.foodOrigin?.correctCountry ?? '-';
    }

    if (miniGame.id === 'couple-or-siblings') {
      return miniGame.coupleOrSiblings?.correctAnswer === 'couple'
        ? (this.locale === 'ar' ? 'مرتبطين' : 'Couple')
        : miniGame.coupleOrSiblings?.correctAnswer === 'siblings'
          ? (this.locale === 'ar' ? 'إخوات' : 'Siblings')
          : '-';
    }

    if (miniGame.id === 'guess-logo') {
      return miniGame.guessLogo?.correctLogo ?? '-';
    }

    if (miniGame.id === 'maze-gates') {
      return miniGame.mazeGates?.correctOptionNumber ? `!${miniGame.mazeGates.correctOptionNumber}` : '-';
    }

    if (miniGame.id === 'hangman') {
      return miniGame.hangman?.correctWord ?? '-';
    }

    if (miniGame.id === 'count-the-beat') {
      return miniGame.countTheBeat?.targetCount !== null && miniGame.countTheBeat?.targetCount !== undefined
        ? `!${miniGame.countTheBeat.targetCount}`
        : '-';
    }

    if (miniGame.id === 'lucky-cup') {
      return miniGame.luckyCup?.correctCupNumber ? `!${miniGame.luckyCup.correctCupNumber}` : '-';
    }

    return miniGame.correctAnswer
      ? translate(this.locale, miniGame.correctAnswer === 'true' ? 'minigame.trueFake.true' : 'minigame.trueFake.fake')
      : '-';
  }

  private getMiniGameTranslationKey(action: 'started' | 'answerWindowOpen' | 'answerWindowLocked' | 'resultFeed' | 'noAnswers' | 'scoringApplied'): TranslationKey {
    const prefixByGame: Record<MiniGameId, string> = {
      'true-fake': 'minigame.trueFake',
      'shape-count': 'minigame.shapeCount',
      'memory-count': 'minigame.memoryCount',
      'food-origin': 'minigame.foodOrigin',
      'couple-or-siblings': 'minigame.coupleOrSiblings',
      'guess-logo': 'minigame.guessLogo',
      'maze-gates': 'minigame.mazeGates',
      'hangman': 'minigame.hangman',
      'count-the-beat': 'minigame.countTheBeat',
      'lucky-cup': 'minigame.luckyCup',
      'before-after': 'minigame.beforeAfter',
    };

    return `${prefixByGame[this.activeMiniGameId]}.${action}` as TranslationKey;
  }

  private selectChaosEventForRound(roundIndex: number): void {
    if (this.chaosMode === 'off') {
      this.activeChaosEvent = null;
      this.chaosPercent = Math.max(0, this.chaosPercent - 2);
      return;
    }

    if (this.forcedNextChaosEventId) {
      this.activeChaosEvent = CHAOS_EVENTS.find((event) => event.id === this.forcedNextChaosEventId) ?? null;
      this.forcedNextChaosEventId = null;
    } else {
      this.activeChaosEvent = this.chaosEventService.selectForRound({
        roundIndex,
        chaosPercent: this.getEffectiveChaosPercent(),
        officialCount: this.getOfficialCitizens().length,
        spectatorCount: this.getSpectatorCitizens().length,
      });
    }

    if (this.activeChaosEvent) {
      const boost = this.chaosMode === 'madness' ? 20 : this.chaosMode === 'high' ? 17 : 14;
      this.chaosPercent = Math.min(100, this.chaosPercent + boost);
      this.addFeed(`${this.activeChaosEvent.title[this.locale]}: ${this.activeChaosEvent.description[this.locale]}`);
      return;
    }

    const passiveGain = this.chaosMode === 'madness' ? 10 : this.chaosMode === 'high' ? 7 : 4;
    this.chaosPercent = Math.min(100, this.chaosPercent + passiveGain);
  }

  private getEffectiveChaosPercent(): number {
    if (this.chaosMode === 'madness') {
      return Math.min(100, this.chaosPercent + 55);
    }

    if (this.chaosMode === 'high') {
      return Math.min(100, this.chaosPercent + 30);
    }

    return this.chaosPercent;
  }

  private resolveTourPhaseDurationMs(phase: TourPhase, defaultDurationMs: number): number {
    const phaseConfigDuration = this.runtimeConfig.tour.phaseDurationsMs[phase];
    const miniGameOverride = this.runtimeConfig.tour.miniGamePhaseOverridesMs[this.activeMiniGameId]?.[phase];
    let durationMs = miniGameOverride ?? phaseConfigDuration ?? defaultDurationMs;

    if (phase !== 'answer_window_open' || !this.activeChaosEvent?.answerWindowMultiplier) {
      return durationMs;
    }

    return Math.max(4_500, Math.round(durationMs * this.activeChaosEvent.answerWindowMultiplier));
  }

  private applyActiveChaosFlatScoreDelta(): void {
    if (!this.activeChaosEvent || typeof this.activeChaosEvent.flatScoreDelta !== 'number') {
      return;
    }

    const delta = this.activeChaosEvent.flatScoreDelta;

    for (const [id, citizen] of this.citizens.entries()) {
      if (this.activeChaosEvent.appliesTo === 'official' && citizen.role !== 'official') {
        continue;
      }

      if (this.activeChaosEvent.appliesTo === 'spectator' && citizen.role !== 'spectator') {
        continue;
      }

      this.citizens.set(id, { ...citizen, score: Math.max(0, citizen.score + delta) });
    }

    this.addFeed(`${this.activeChaosEvent.title[this.locale]}: ${delta > 0 ? '+' : ''}${delta} score`);
  }


  private beginTourAwardTracking(roundsPlayed: number): void {
    this.tourPlayerStats.clear();
    this.finalTourAwards = {
      ...EMPTY_TOUR_AWARDS,
      officialCount: this.getOfficialCitizens().length,
      spectatorCount: this.getSpectatorCitizens().length,
      roundsPlayed,
    };

    for (const citizen of this.citizens.values()) {
      this.ensureTourPlayerStats(citizen);
    }
  }

  private ensureTourPlayerStats(citizen: CitizenRuntime): void {
    if (!this.tourStateMachine.isTourActive() && this.finalTourAwards.roundsPlayed <= 0) {
      return;
    }

    const existing = this.tourPlayerStats.get(citizen.twitchUserId);

    if (existing) {
      this.tourPlayerStats.set(citizen.twitchUserId, {
        ...existing,
        displayName: citizen.displayName,
        role: citizen.role,
        currentScore: citizen.score,
      });
      return;
    }

    this.tourPlayerStats.set(citizen.twitchUserId, {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      startScore: citizen.score,
      currentScore: citizen.score,
      totalAnswers: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      pointsEarned: 0,
      roundPoints: [],
      chaosRounds: 0,
      unluckyRounds: 0,
    });
  }

  private recordTourAwardStats(awards: MiniGameScoreAward[]): void {
    const isChaosRound = Boolean(this.activeChaosEvent);

    for (const award of awards) {
      const citizen = this.citizens.get(award.twitchUserId);

      if (!citizen) {
        continue;
      }

      this.ensureTourPlayerStats(citizen);
      const existing = this.tourPlayerStats.get(award.twitchUserId);

      if (!existing) {
        continue;
      }

      const isUnlucky = !award.isCorrect;
      const roundIndex = Math.max(0, this.tourStateMachine.getSnapshot().roundNumber - 1);
      const roundPoints = [...existing.roundPoints];
      roundPoints[roundIndex] = (roundPoints[roundIndex] ?? 0) + award.points;

      this.tourPlayerStats.set(award.twitchUserId, {
        ...existing,
        displayName: award.displayName,
        role: award.role,
        totalAnswers: existing.totalAnswers + 1,
        correctAnswers: existing.correctAnswers + (award.isCorrect ? 1 : 0),
        wrongAnswers: existing.wrongAnswers + (award.isCorrect ? 0 : 1),
        pointsEarned: existing.pointsEarned + award.points,
        roundPoints,
        chaosRounds: existing.chaosRounds + (isChaosRound && award.isCorrect ? 1 : 0),
        unluckyRounds: existing.unluckyRounds + (isUnlucky ? 1 : 0),
      });
    }
  }

  private createTourScoreboardRows(): TourScoreboardRow[] {
    for (const citizen of this.citizens.values()) {
      this.ensureTourPlayerStats(citizen);
    }

    return [...this.tourPlayerStats.values()]
      .map((stats) => ({
        twitchUserId: stats.twitchUserId,
        displayName: stats.displayName,
        role: stats.role,
        roundPoints: [...stats.roundPoints],
        total: stats.pointsEarned,
      }))
      .sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName));
  }

  private computeTourAwardsSnapshot(roundsPlayed: number): TourAwardsSnapshot {
    const officialCitizens = this.createSortedCitizens('official');
    const spectatorCitizens = this.createSortedCitizens('spectator');
    const champion = officialCitizens[0] ? this.createAwardWinner(officialCitizens[0]) : null;
    const bestSpectator = spectatorCitizens[0] ? this.createAwardWinner(spectatorCitizens[0]) : null;
    const topOfficial = officialCitizens.slice(0, 3).map((citizen) => this.createAwardWinner(citizen));
    const awards: TourAward[] = [];

    awards.push(this.createAward('champion', champion, champion ? `${champion.score} pts` : '-', champion ? this.awardText(`${champion.displayName} أنهى التور في المركز الأول.`, `${champion.displayName} أنهى التور في المركز الأول.`) : this.awardText('No official player scored this Tour.', 'لا يوجد لاعب رسمي حصل على نقاط.')));

    awards.push(this.createAward('best_spectator', bestSpectator, bestSpectator ? `${bestSpectator.score} pts` : '-', bestSpectator ? this.awardText(`${bestSpectator.displayName} تصدر لوحة المتفرجين.`, `${bestSpectator.displayName} تصدر لوحة المتفرجين.`) : this.awardText('No spectator score this Tour.', 'لا توجد نقاط للمتفرجين في هذا التور.')));

    const mostCorrect = this.findBestStats((stats) => stats.correctAnswers, (stats) => stats.correctAnswers > 0 && stats.role === 'official');
    awards.push(this.createAward('most_correct', mostCorrect ? this.createAwardWinnerFromStats(mostCorrect) : null, mostCorrect ? `${mostCorrect.correctAnswers} correct` : '-', mostCorrect ? this.awardText('Most correct answers among official players.', 'أكثر إجابات صحيحة بين اللاعبين الرسميين.') : this.awardText('No correct official answers recorded.', 'لم يتم تسجيل إجابات صحيحة للاعبين الرسميين.')));

    const biggestComeback = this.findBestStats((stats) => stats.currentScore - stats.startScore, (stats) => stats.role === 'official' && stats.currentScore > stats.startScore);
    awards.push(this.createAward('biggest_comeback', biggestComeback ? this.createAwardWinnerFromStats(biggestComeback) : null, biggestComeback ? `+${biggestComeback.currentScore - biggestComeback.startScore} pts` : '-', biggestComeback ? this.awardText('Biggest score gain during the Tour.', 'أكبر زيادة نقاط أثناء التور.') : this.awardText('No comeback recorded yet.', 'لا توجد عودة قوية مسجلة بعد.')));

    const mostParticipating = this.findBestStats((stats) => stats.totalAnswers, (stats) => stats.totalAnswers > 0);
    awards.push(this.createAward('most_participating', mostParticipating ? this.createAwardWinnerFromStats(mostParticipating) : null, mostParticipating ? `${mostParticipating.totalAnswers} answers` : '-', mostParticipating ? this.awardText('Most active player in chat answers.', 'أكثر لاعب شارك في إجابات الشات.') : this.awardText('No answer participation recorded.', 'لا توجد مشاركات إجابات مسجلة.')));

    const chaosSurvivor = this.findBestStats((stats) => stats.chaosRounds, (stats) => stats.chaosRounds > 0);
    awards.push(this.createAward('chaos_survivor', chaosSurvivor ? this.createAwardWinnerFromStats(chaosSurvivor) : null, chaosSurvivor ? `${chaosSurvivor.chaosRounds} chaos wins` : '-', chaosSurvivor ? this.awardText('Best correct performance during Chaos Events.', 'راوند') : this.awardText('No Chaos Event winner recorded.', 'لا يوجد فائز في أحداث الفوضى.')));

    const mostUnlucky = this.findBestStats((stats) => stats.unluckyRounds, (stats) => stats.unluckyRounds > 0);
    awards.push(this.createAward('most_unlucky', mostUnlucky ? this.createAwardWinnerFromStats(mostUnlucky) : null, mostUnlucky ? `${mostUnlucky.unluckyRounds} unlucky rounds` : '-', mostUnlucky ? this.awardText('Most wrong/fallen outcomes. Better luck next Tour.', 'راوند') : this.awardText('No unlucky moments recorded.', 'لا توجد لحظات حظ سيء مسجلة.')));

    return {
      champion,
      topOfficial,
      bestSpectator,
      awards,
      scoreboardRows: this.createTourScoreboardRows(),
      officialCount: officialCitizens.length,
      spectatorCount: spectatorCitizens.length,
      roundsPlayed,
    };
  }

  private createSortedCitizens(role: 'official' | 'spectator'): CitizenRuntime[] {
    return [...this.citizens.values()]
      .filter((citizen) => citizen.role === role)
      .sort((a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName));
  }

  private createAward(id: TourAward['id'], winner: TourAwardWinner | null, valueLabel: string, reason: string): TourAward {
    const labels: Record<TourAward['id'], { title: { en: string; ar: string }; description: { en: string; ar: string } }> = {
      champion: { title: { en: 'Champion', ar: 'بطل التور' }, description: { en: 'Highest official score.', ar: 'أعلى سكور رسمي.' } },
      best_spectator: { title: { en: 'Best Spectator', ar: 'أفضل متفرج' }, description: { en: 'Top spectator score.', ar: 'أعلى سكور للمتفرجين.' } },
      most_correct: { title: { en: 'Sharpest Mind', ar: 'أذكى إجابات' }, description: { en: 'Most correct answers.', ar: 'أكثر إجابات صحيحة.' } },
      biggest_comeback: { title: { en: 'Biggest Comeback', ar: 'أقوى عودة' }, description: { en: 'Largest score gain.', ar: 'أكبر زيادة في النقاط.' } },
      most_participating: { title: { en: 'Most Active', ar: 'الأكثر مشاركة' }, description: { en: 'Most submitted answers.', ar: 'أكثر لاعب جاوب.' } },
      chaos_survivor: { title: { en: 'Chaos Survivor', ar: 'ناجي الفوضى' }, description: { en: 'Best during Chaos Events.', ar: 'الأفضل في أحداث الفوضى.' } },
      most_unlucky: { title: { en: 'Most Unlucky', ar: 'الأكثر نحسًا' }, description: { en: 'Most wrong or fallen outcomes.', ar: 'أكثر اختيارات غير موفقة.' } },
    };

    const label = labels[id];

    return {
      id,
      title: label.title[this.locale],
      description: label.description[this.locale],
      winner,
      valueLabel,
      reason,
    };
  }

  private findBestStats(score: (stats: TourPlayerStats) => number, predicate: (stats: TourPlayerStats) => boolean): TourPlayerStats | null {
    return [...this.tourPlayerStats.values()]
      .filter(predicate)
      .sort((a, b) => score(b) - score(a) || b.currentScore - a.currentScore || a.displayName.localeCompare(b.displayName))[0] ?? null;
  }

  private createAwardWinnerFromStats(stats: TourPlayerStats): TourAwardWinner {
    const citizen = this.citizens.get(stats.twitchUserId);

    if (citizen) {
      return this.createAwardWinner(citizen);
    }

    return {
      twitchUserId: stats.twitchUserId,
      displayName: stats.displayName,
      role: stats.role,
      score: stats.currentScore,
      level: 1,
    };
  }

  private createAwardWinner(citizen: CitizenRuntime): TourAwardWinner {
    return {
      twitchUserId: citizen.twitchUserId,
      displayName: citizen.displayName,
      role: citizen.role,
      score: citizen.score,
      level: citizen.level,
    };
  }

  private awardText(en: string, ar: string): string {
    return this.locale === 'ar' ? ar : en;
  }

  private triggerChampionCelebration(twitchUserId: string | null): void {
    if (!twitchUserId) {
      return;
    }

    const citizen = this.citizens.get(twitchUserId);

    if (!citizen || citizen.level < 10) {
      return;
    }

    this.championCelebrationUserId = twitchUserId;
    this.championCelebrationStartedAt = Date.now();

    if (this.championCelebrationTimer) {
      clearTimeout(this.championCelebrationTimer);
    }

    this.championCelebrationTimer = setTimeout(() => {
      this.championCelebrationUserId = null;
      this.championCelebrationStartedAt = null;
      this.championCelebrationTimer = null;
      this.notifyChanged();
    }, 6200);
  }

  private triggerRoundChampionCelebration(): void {
    const topRoundAward = [...this.lastRoundAwards]
      .filter((award) => award.role === 'official' && award.points > 0)
      .sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName))[0];

    if (topRoundAward) {
      this.triggerChampionCelebration(topRoundAward.twitchUserId);
    }
  }

  private applyMiniGameScoring(): void {
    const baseAwards = this.getActiveMiniGameService().createScoreAwards();
    const awards = this.chaosEventService.applyToAwards({
      event: this.activeChaosEvent,
      awards: baseAwards,
      citizens: [...this.citizens.values()],
    });

    this.lastRoundAwards = awards;

    this.applyActiveChaosFlatScoreDelta();
    this.recordTourAwardStats(awards);

    if (awards.length === 0) {
      this.addFeed(translate(this.locale, this.getMiniGameTranslationKey('noAnswers')));
      return;
    }

    let officialAwardCount = 0;
    let spectatorAwardCount = 0;
    let totalOfficialXp = 0;

    for (const award of awards) {
      const citizen = this.citizens.get(award.twitchUserId);

      if (!citizen) {
        continue;
      }

      const nextScore = Math.max(0, citizen.score + award.points);

      if (award.role === 'official') {
        officialAwardCount += 1;
        const correctReward = this.runtimeConfig.scoring.officialCorrectRewardByDifficulty[award.difficulty];
        const xpAward = award.isCorrect ? correctReward.xp : this.runtimeConfig.scoring.officialParticipationXp;
        const coinAward = award.isCorrect ? correctReward.coins : this.runtimeConfig.scoring.officialParticipationCoins;
        totalOfficialXp += xpAward;
        this.applyOfficialProgressionAward(citizen, nextScore, xpAward, coinAward);
      } else {
        spectatorAwardCount += 1;
        this.citizens.set(award.twitchUserId, { ...citizen, score: nextScore });
      }
    }

    this.addFeed(translate(this.locale, this.getMiniGameTranslationKey('scoringApplied'), {
      official: String(officialAwardCount),
      spectator: String(spectatorAwardCount),
    }));

    if (officialAwardCount > 0) {
      this.addFeed(translate(this.locale, 'progression.officialXpAwarded', { xp: String(totalOfficialXp) }));
    }

    if (spectatorAwardCount > 0) {
      this.addFeed(translate(this.locale, 'progression.spectatorNoRewards'));
    }
  }

  private applyOfficialProgressionAward(citizen: CitizenRuntime, nextScore: number, xpAward: number, coinAward: number): void {
    const profile = this.profileService.getOrCreateProfile(citizen.twitchUserId, citizen.displayName);
    const awardPreview = this.progressionService.awardXp(profile.xp, xpAward);
    const nextXp = profile.xp + xpAward;
    const nextCoins = profile.coins + coinAward;
    const progression = this.progressionService.createView(nextXp, nextCoins);
    const updatedProfile = this.profileService.updateProgress(citizen.twitchUserId, {
      xp: nextXp,
      coins: nextCoins,
      level: progression.level,
    });

    if (!updatedProfile) {
      return;
    }

    this.citizens.set(citizen.twitchUserId, {
      ...citizen,
      score: nextScore,
      level: progression.level,
      xp: progression.xp,
      coins: progression.coins,
      xpToNextLevel: progression.xpToNextLevel,
      progressPercent: progression.progressPercent,
      unlockedCommandIds: progression.unlockedCommandIds,
    });
    this.queuePersistenceSave('profiles');

    if (awardPreview.leveledUp) {
      this.addFeed(translate(this.locale, 'progression.levelUp', {
        name: citizen.displayName,
        level: String(awardPreview.newLevel),
      }));

      for (const unlock of awardPreview.unlockedCommands) {
        this.addFeed(this.buildUnlockFeed(citizen.displayName, unlock));
      }
    }
  }

  private buildUnlockFeed(displayName: string, unlock: CommandUnlockDefinition): string {
    return translate(this.locale, 'progression.commandUnlocked', {
      name: displayName,
      command: unlock.primaryCommand,
      level: String(unlock.levelRequired),
    });
  }

  private handleTourCompleted(tour: TourSnapshot): void {
    this.recordTourHistory();
    this.promoteSpectatorsForNextTour();
    this.chaosPercent = Math.max(2, this.chaosPercent - 4);
    this.addFeed(translate(this.locale, 'event.tourAutoCompleted'));
    this.eventBus.emit({ type: 'tour.completed', tour });
  }


  private async hydrateFromPersistence(): Promise<void> {
    if (!this.hasPersistence) {
      return;
    }

    try {
      const [settingsFile, profilesFile, tourHistoryFile] = await Promise.all([
        this.persistence.readJson<PersistentSettingsFile>('settings.json'),
        this.persistence.readJson<PersistentProfilesFile>('profiles.json'),
        this.persistence.readJson<PersistentTourHistoryFile>('tour-history.json'),
      ]);

      if (settingsFile && this.isLocaleCode(settingsFile.locale)) {
        this.locale = settingsFile.locale;
      }

      const profileCount = profilesFile && Array.isArray(profilesFile.profiles)
        ? this.profileService.loadProfiles(profilesFile.profiles)
        : 0;

      if (tourHistoryFile && Array.isArray(tourHistoryFile.entries)) {
        this.tourHistory = tourHistoryFile.entries.slice(0, this.runtimeConfig.persistence.maxTourHistoryEntries);
      }

      this.persistenceStatus = 'ready';
      this.persistenceError = null;
      this.addFeed(`Persistent storage loaded: ${profileCount} profile(s), ${this.tourHistory.length} tour record(s).`);
      this.notifyChanged();
    } catch (error) {
      this.persistenceStatus = 'error';
      this.persistenceError = this.getErrorMessage(error);
      this.addFeed(`Persistent storage failed to load: ${this.persistenceError}`);
      this.notifyChanged();
    }
  }

  private queuePersistenceSave(kind: keyof PendingPersistenceSave): void {
    if (!this.hasPersistence) {
      return;
    }

    this.pendingPersistenceSave[kind] = true;

    if (this.persistenceSaveTimer) {
      return;
    }

    this.persistenceSaveTimer = setTimeout(() => {
      this.persistenceSaveTimer = null;
      void this.flushPersistenceSaves();
    }, this.runtimeConfig.persistence.saveDebounceMs);
  }

  private async flushPersistenceSaves(): Promise<void> {
    if (!this.hasPersistence) {
      return;
    }

    if (this.persistenceStatus === 'loading') {
      await this.persistenceReady;
    }

    const shouldSaveProfiles = this.pendingPersistenceSave.profiles;
    const shouldSaveSettings = this.pendingPersistenceSave.settings;
    const shouldSaveTourHistory = this.pendingPersistenceSave.tourHistory;

    this.pendingPersistenceSave = {
      profiles: false,
      settings: false,
      tourHistory: false,
    };

    if (!shouldSaveProfiles && !shouldSaveSettings && !shouldSaveTourHistory) {
      return;
    }

    const savedAt = new Date().toISOString();

    try {
      if (shouldSaveProfiles) {
        await this.persistence.writeJson('profiles.json', this.createProfilesFile(savedAt));
      }

      if (shouldSaveSettings) {
        await this.persistence.writeJson('settings.json', this.createSettingsFile(savedAt));
      }

      if (shouldSaveTourHistory) {
        await this.persistence.writeJson('tour-history.json', this.createTourHistoryFile(savedAt));
      }

      this.persistenceStatus = 'ready';
      this.persistenceError = null;
      this.persistenceLastSavedAt = savedAt;
      this.notifyChanged();
    } catch (error) {
      this.persistenceStatus = 'error';
      this.persistenceError = this.getErrorMessage(error);
      this.addFeed(`Persistent storage save failed: ${this.persistenceError}`);
      this.notifyChanged();
    }
  }

  private createProfilesFile(savedAt: string): PersistentProfilesFile {
    return {
      version: 1,
      savedAt,
      profiles: this.profileService.exportProfiles(),
    };
  }

  private createSettingsFile(savedAt: string): PersistentSettingsFile {
    return {
      version: 1,
      savedAt,
      locale: this.locale,
    };
  }

  private createTourHistoryFile(savedAt: string): PersistentTourHistoryFile {
    return {
      version: 1,
      savedAt,
      entries: this.tourHistory.slice(0, this.runtimeConfig.persistence.maxTourHistoryEntries),
    };
  }

  private recordTourHistory(): void {
    if (!this.activeTourHistorySeed) {
      return;
    }

    const entry: StoredTourHistoryEntry = {
      id: this.activeTourHistorySeed.tourId,
      startedAt: this.activeTourHistorySeed.startedAt,
      completedAt: new Date().toISOString(),
      roundIndex: this.activeTourHistorySeed.roundIndex,
      officialCount: this.getOfficialCitizens().length,
      spectatorCount: this.getSpectatorCitizens().length,
      topOfficial: this.createLeaderboardEntries('official'),
      topSpectator: this.createLeaderboardEntries('spectator'),
      awards: this.finalTourAwards.awards,
    };

    this.tourHistory = [entry, ...this.tourHistory].slice(0, this.runtimeConfig.persistence.maxTourHistoryEntries);
    this.activeTourHistorySeed = null;
    this.queuePersistenceSave('tourHistory');
  }

  private createLeaderboardEntries(role: 'official' | 'spectator'): StoredTourLeaderboardEntry[] {
    return [...this.citizens.values()]
      .filter((citizen) => citizen.role === role)
      .sort((a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName))
      .slice(0, 5)
      .map((citizen) => ({
        twitchUserId: citizen.twitchUserId,
        displayName: citizen.displayName,
        role: citizen.role,
        score: citizen.score,
        level: citizen.level,
      }));
  }

  private isLocaleCode(value: unknown): value is LocaleCode {
    return value === 'en' || value === 'ar';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }

  private promoteSpectatorsForNextTour(): void {
    for (const [id, citizen] of this.citizens.entries()) {
      if (citizen.role === 'spectator') {
        this.citizens.set(id, { ...citizen, role: 'official' });
      }
    }
  }

  private getPhaseLabel(phase: TourPhase): string {
    return translate(this.locale, getTourPhaseTitleKey(phase));
  }

  private addFeed(message: string): void {
    const entry: FeedEntry = {
      id: crypto.randomUUID(),
      message,
      createdAt: Date.now(),
    };

    this.feed.unshift(entry);

    if (this.feed.length > 8) {
      this.feed.pop();
    }

    this.eventBus.emit({ type: 'feed.added', message });
  }

  private getNextMiniGameId(tour: TourSnapshot): MiniGameId | null {
    if (!tour.isTourActive || tour.phase === 'tour_complete' || tour.roundNumber >= tour.totalRounds) {
      return null;
    }

    return this.selectMiniGameForRound(tour.roundNumber + 1, tour.tourNumber);
  }

  private createSnapshot(): GameSnapshot {
    const tour = this.tourStateMachine.getSnapshot();

    return {
      locale: this.locale,
      direction: localeDirection[this.locale],
      tourActive: tour.isTourActive,
      activeSessionMode: this.activeSessionMode,
      chaosPercent: this.chaosPercent,
      chaosEvent: this.chaosEventService.getSnapshot(this.activeChaosEvent, this.locale),
      citizens: [...this.citizens.values()],
      feed: [...this.feed],
      tour,
      commandFeedback: this.lastCommandFeedback,
      miniGame: this.getActiveMiniGameService().getSnapshot(this.locale),
      nextMiniGameId: this.getNextMiniGameId(tour),
      lastRoundAwards: [...this.lastRoundAwards],
      progression: this.progressionService.createSnapshot(this.locale),
      persistence: {
        status: this.persistenceStatus,
        error: this.persistenceError,
        profileCount: this.profileService.getProfileCount(),
        tourHistoryCount: this.tourHistory.length,
        lastSavedAt: this.persistenceLastSavedAt,
      },
      tourAwards: this.finalTourAwards,
      tourScoreboardRows: this.createTourScoreboardRows(),
      hostSettings: {
        tourRoundCount: this.tourRoundCount,
        enabledMiniGameIds: [...this.enabledMiniGameIds],
        forcedNextMiniGameId: this.forcedNextMiniGameId,
        chaosMode: this.chaosMode,
      },
      championCelebration: {
        twitchUserId: this.championCelebrationUserId,
        startedAt: this.championCelebrationStartedAt,
      },
    };
  }

  private notifyChanged(): void {
    this.currentSnapshot = this.createSnapshot();

    for (const listener of this.listeners) {
      listener(this.currentSnapshot);
    }

    this.eventBus.emit({ type: 'state.changed' });
  }

  private startPhaseTick(): void {
    if (this.phaseTick) {
      return;
    }

    this.phaseTick = setInterval(() => {
      if (!this.tourStateMachine.isTourActive()) {
        this.stopPhaseTick();
        return;
      }

      this.notifyChanged();
    }, PHASE_TICK_MS);
  }

  private stopPhaseTick(): void {
    if (!this.phaseTick) {
      return;
    }

    clearInterval(this.phaseTick);
    this.phaseTick = null;
  }
}

function shuffleMiniGameIds(miniGameIds: MiniGameId[]): MiniGameId[] {
  const shuffled = [...miniGameIds];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
