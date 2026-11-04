import { useEffect, useMemo, useState } from 'react';
import { QA_BOT_PREFIX, type QaBotBehavior } from '../../services/qa-bot-controller';
import type { MiniGameId } from '../../../game-core/minigames/minigame-types';
import { MINI_GAME_REGISTRY } from '../../../game-core/minigames/minigame-registry';
import type { TwitchChatMessage } from '../../../game-core/twitch/twitch-message-types';
import { useGame } from '../../context/GameContext';
import { useMotionTuning } from '../../context/MotionTuningContext';
import { useGameConfig } from '../../context/GameConfigContext';
import { useAudioTuning } from '../../context/AudioTuningContext';
import { useLocalization } from '../../context/LocalizationContext';

type CharacterId =
  | 'cat'
  | 'dog'
  | 'cute_girl'
  | 'flat_boy'
  | 'red_hat'
  | 'temple_runner'
  | 'female_person'
  | 'male_person'
  | 'robot'
  | 'stage_office'
  | 'stage_chef';

type QaCharacterSelection = CharacterId | 'mixed';

const QA_USERS = [
  [`${QA_BOT_PREFIX}legacy_001`, 'QA_Nour'],
  [`${QA_BOT_PREFIX}legacy_002`, 'QA_Ahmed'],
  [`${QA_BOT_PREFIX}legacy_003`, 'QA_Sara'],
  [`${QA_BOT_PREFIX}legacy_004`, 'QA_Mona'],
  [`${QA_BOT_PREFIX}legacy_005`, 'QA_Karim'],
  [`${QA_BOT_PREFIX}legacy_006`, 'QA_Youssef'],
  [`${QA_BOT_PREFIX}legacy_007`, 'QA_Laila'],
  [`${QA_BOT_PREFIX}legacy_008`, 'QA_Omar'],
  [`${QA_BOT_PREFIX}legacy_009`, 'QA_Mariam'],
  [`${QA_BOT_PREFIX}legacy_010`, 'QA_Yassin'],
  [`${QA_BOT_PREFIX}legacy_011`, 'QA_Farah'],
  [`${QA_BOT_PREFIX}legacy_012`, 'QA_Ziad'],
] as const;

const ANSWER_COMMANDS = ['!1', '!2', '!3', '!4'] as const;
const CHARACTER_IDS: CharacterId[] = [
  'cat',
  'dog',
  'cute_girl',
  'flat_boy',
  'red_hat',
  'temple_runner',
  'female_person',
  'male_person',
  'robot',
  'stage_office',
  'stage_chef',
];

const CHARACTER_OPTIONS: { id: QaCharacterSelection; label: string }[] = [
  { id: 'mixed', label: 'Mixed uploaded characters' },
  { id: 'cat', label: 'Cat' },
  { id: 'dog', label: 'Dog' },
  { id: 'cute_girl', label: 'Cute Girl' },
  { id: 'flat_boy', label: 'Flat Boy' },
  { id: 'red_hat', label: 'Red Hat' },
  { id: 'temple_runner', label: 'Temple Runner' },
  { id: 'female_person', label: 'Female Person' },
  { id: 'male_person', label: 'Male Person' },
  { id: 'robot', label: 'Robot' },
  { id: 'stage_office', label: 'Office' },
  { id: 'stage_chef', label: 'Chef' },
];

const MINI_GAME_QUICK_FORCE = MINI_GAME_REGISTRY;

export function DeveloperQaPanel() {
  const { actions, snapshot, qaBots } = useGame();
  const [qaBotStatus, setQaBotStatus] = useState(() => qaBots.getSnapshot());
  const [qaBotBehavior, setQaBotBehavior] = useState<QaBotBehavior>('mixed');
  const [qaBotCustomCount, setQaBotCustomCount] = useState(50);
  useEffect(() => qaBots.subscribe(() => setQaBotStatus(qaBots.getSnapshot())), [qaBots]);
  const { configPath, lastError, loadedAt, reloadMotionTuning } = useMotionTuning();
  const { configPath: gameplayConfigPath, lastError: gameplayConfigError, loadedAt: gameplayConfigLoadedAt, reloadGameConfig, config: gameplayConfig } = useGameConfig();
  const { configPath: audioConfigPath, lastError: audioConfigError, loadedAt: audioConfigLoadedAt, reloadAudioTuning } = useAudioTuning();
  const { configPath: localizationConfigPath, lastError: localizationConfigError, loadedAt: localizationConfigLoadedAt, reloadLocalization } = useLocalization();
  const [lastCopied, setLastCopied] = useState(false);
  const [motionReloadStatus, setMotionReloadStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [gameplayReloadStatus, setGameplayReloadStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [audioReloadStatus, setAudioReloadStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [localizationReloadStatus, setLocalizationReloadStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [testPlayerCount, setTestPlayerCount] = useState(24);
  const [testCharacter, setTestCharacter] = useState<QaCharacterSelection>('mixed');

  const playerCount = snapshot.citizens.filter((citizen) => citizen.role === 'official').length;
  const spectatorCount = snapshot.citizens.filter((citizen) => citizen.role === 'spectator').length;
  const phaseSeconds = Math.max(0, Math.ceil(snapshot.tour.phaseRemainingMs / 1000));
  const correctAnswer = snapshot.miniGame.correctAnswer ? String(snapshot.miniGame.correctAnswer) : '-';
  const answerCount = snapshot.miniGame.officialAnswerCount + snapshot.miniGame.spectatorAnswerCount;

  const debugRows = useMemo(() => {
    const playerLabel = spectatorCount >= 1
      ? `${playerCount} players · ${spectatorCount} spectators`
      : `${playerCount} players`;

    return [
      ['Tour', snapshot.tour.isTourActive ? `R${snapshot.tour.roundNumber}/${snapshot.tour.totalRounds}` : 'Lobby'],
      ['Phase', `${snapshot.tour.phase} · ${phaseSeconds}s`],
      ['Mini-game', `${snapshot.miniGame.title} · ${snapshot.miniGame.status}`],
      ['Answers', String(answerCount)],
      ['Answer window', snapshot.miniGame.acceptsAnswers ? 'OPEN' : 'closed'],
      ['Correct', correctAnswer],
      ['Question', snapshot.miniGame.questionId ?? '-'],
      ['Difficulty', snapshot.miniGame.questionDifficulty ?? '-'],
      ['Category', snapshot.miniGame.questionCategory ?? '-'],
      ['Chaos', snapshot.chaosEvent.active ? `${snapshot.chaosEvent.title} · ${snapshot.chaosEvent.badge}` : `${snapshot.chaosPercent}%`],
      ['Citizens', playerLabel],
      ['Motion config', lastError ? `ERROR: ${lastError}` : loadedAt ? `Loaded ${new Date(loadedAt).toLocaleTimeString()}` : configPath],
      ['Gameplay config', gameplayConfigError ? `ERROR: ${gameplayConfigError}` : gameplayConfigLoadedAt ? `${gameplayConfig.tour.defaultRoundCount} rounds · ${gameplayConfig.tour.phaseDurationsMs.answer_window_open}ms answers` : gameplayConfigPath],
      ['Audio config', audioConfigError ? `ERROR: ${audioConfigError}` : audioConfigLoadedAt ? `Loaded ${new Date(audioConfigLoadedAt).toLocaleTimeString()}` : audioConfigPath],
      ['Localization', localizationConfigError ? `ERROR: ${localizationConfigError}` : localizationConfigLoadedAt ? `Loaded ${new Date(localizationConfigLoadedAt).toLocaleTimeString()}` : localizationConfigPath],
    ];
  }, [answerCount, audioConfigError, audioConfigLoadedAt, audioConfigPath, configPath, correctAnswer, gameplayConfig, gameplayConfigError, gameplayConfigLoadedAt, gameplayConfigPath, lastError, loadedAt, localizationConfigError, localizationConfigLoadedAt, localizationConfigPath, phaseSeconds, playerCount, snapshot, spectatorCount]);

  const addTestCitizen = (index: number) => {
    const user = QA_USERS[index % QA_USERS.length];
    actions.submitTwitchMessage(createQaMessage(user[0], user[1], '!join'));
  };

  const addPresetCitizens = (count: number) => {
    Array.from({ length: count }, (_, index) => addTestCitizen(index));
  };

  const addCustomTestCitizens = () => {
    const count = clampNumber(testPlayerCount, 1, 72);
    const batchId = `${Date.now()}`;
    const startIndex = snapshot.citizens.length;

    Array.from({ length: count }, (_, index) => {
      const citizenIndex = startIndex + index;
      const user = createCustomQaUser(batchId, index, citizenIndex, testCharacter);
      actions.submitTwitchMessage(createQaMessage(user.twitchUserId, user.displayName, '!join'));
    });
  };

  const getQaAnswerTargets = () => {
    // NEVER spoof real viewers' answers from a QA action. Target test identities only.
    const joinedCitizens = snapshot.citizens.filter((citizen) => citizen.twitchUserId.startsWith(QA_BOT_PREFIX));

    if (joinedCitizens.length > 0) {
      return joinedCitizens.map((citizen) => ({
        twitchUserId: citizen.twitchUserId,
        displayName: citizen.displayName,
      }));
    }

    // No fabricated replies from users who have not joined; QA buttons are no-ops.
    return [];
  };

  const getActiveAnswerCommands = () => {
    switch (snapshot.miniGame.id) {
      case 'couple-or-siblings':
        return ANSWER_COMMANDS.slice(0, 2);
      case 'shape-count':
        return (snapshot.miniGame.shapeGrid?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'memory-count':
        return (snapshot.miniGame.memoryCount?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'food-origin':
        return (snapshot.miniGame.foodOrigin?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'maze-gates':
        return (snapshot.miniGame.mazeGates?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      default:
        return [...ANSWER_COMMANDS];
    }
  };

  const submitAnswerFromTestUsers = (command: string) => {
    getQaAnswerTargets().forEach((user) => {
      const message = command;
      actions.submitTwitchMessage(createQaMessage(user.twitchUserId, user.displayName, message));
    });
  };

  const submitMixedAnswers = () => {
    const activeCommands = getActiveAnswerCommands();
    const fallbackCommands = activeCommands.length > 0 ? activeCommands : [...ANSWER_COMMANDS];

    getQaAnswerTargets().forEach((user, index) => {
      const command = fallbackCommands[index % fallbackCommands.length] ?? '!1';
      actions.submitTwitchMessage(createQaMessage(user.twitchUserId, user.displayName, command));
    });
  };

  const forceNextMiniGame = (miniGameId: MiniGameId) => {
    actions.setForcedNextMiniGame(miniGameId);
    actions.setMiniGameEnabled(miniGameId, true);
  };




  const reloadLocalizationConfig = async () => {
    setLocalizationReloadStatus('idle');
    const result = await reloadLocalization();
    setLocalizationReloadStatus(result.ok ? 'ok' : 'error');
    window.setTimeout(() => setLocalizationReloadStatus('idle'), 1800);
  };

  const reloadAudioConfig = async () => {
    setAudioReloadStatus('idle');
    const result = await reloadAudioTuning();
    setAudioReloadStatus(result.ok ? 'ok' : 'error');
    window.setTimeout(() => setAudioReloadStatus('idle'), 1800);
  };

  const reloadGameplayConfig = async () => {
    setGameplayReloadStatus('idle');
    const result = await reloadGameConfig();
    setGameplayReloadStatus(result.ok ? 'ok' : 'error');
    window.setTimeout(() => setGameplayReloadStatus('idle'), 1800);
  };

  const reloadMotionConfig = async () => {
    setMotionReloadStatus('idle');
    const result = await reloadMotionTuning();
    setMotionReloadStatus(result.ok ? 'ok' : 'error');
    window.setTimeout(() => setMotionReloadStatus('idle'), 1800);
  };

  const copyDebugReport = async () => {
    const report = {
      createdAt: new Date().toISOString(),
      tour: snapshot.tour,
      miniGame: snapshot.miniGame,
      chaosEvent: snapshot.chaosEvent,
      citizens: snapshot.citizens.map((citizen) => ({
        twitchUserId: citizen.twitchUserId,
        displayName: citizen.displayName,
        role: citizen.role,
        score: citizen.score,
        level: citizen.level,
      })),
      commandFeedback: snapshot.commandFeedback,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setLastCopied(true);
      window.setTimeout(() => setLastCopied(false), 1500);
    } catch {
      setLastCopied(false);
    }
  };

  return (
    <section className="developer-qa-panel developer-qa-panel-embedded">
      <div className="developer-qa-body developer-qa-body-embedded">
        <div className="developer-qa-grid">
          {debugRows.map(([label, value]) => (
            <div key={label} className="developer-qa-row">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="v44-qa-bots" aria-label="Offline QA crowd simulation">
          <header>
            <strong>🧪 Bots — اختبار جمهور حقيقي بدون Twitch</strong>
            <span>{qaBotStatus.count} test bots · {qaBotStatus.auto ? 'AUTO ANSWERING' : 'Manual'}</span>
          </header>
          <div className="v44-qa-bot-buttons">
            {[5, 25, 100, 300].map(n => (
              <button type="button" key={n} onClick={() => qaBots.add(n)} disabled={qaBotStatus.count >= 500}>+{n} bots</button>
            ))}
          </div>
          <div className="v44-qa-bot-buttons">
            <label>Custom bots
              <input type="number" min={1} max={500} value={qaBotCustomCount}
                onChange={event => setQaBotCustomCount(clampNumber(Number(event.target.value),1,500))} />
            </label>
            <button type="button" onClick={() => qaBots.add(qaBotCustomCount)} disabled={qaBotStatus.count >= 500}>Add custom</button>
          </div>
          <div className="v44-qa-bot-buttons">
            <label>Responses
              <select value={qaBotBehavior} onChange={event => setQaBotBehavior(event.target.value as QaBotBehavior)}>
                <option value="mixed">Mixed answers</option>
                <option value="random">Random answers</option>
                <option value="one">All !1</option>
              </select>
            </label>
            <button type="button" onClick={() => qaBots.setAuto(!qaBotStatus.auto, qaBotBehavior)}>
              {qaBotStatus.auto ? '⏹ Stop auto answering' : '▶ Auto answer every question'}
            </button>
            <button type="button" onClick={() => qaBots.answerNow(qaBotBehavior)} disabled={!snapshot.tour.acceptsAnswers}>Answer now</button>
            <button type="button" onClick={() => qaBots.clear()} disabled={snapshot.tour.isTourActive}>Remove QA bots</button>
          </div>
          <p>New bots join as Official before first question and Spectators after. Auto mode survives closing this panel; it never posts real Twitch messages. Max 500. QA profiles/history are not saved.</p>
        </div>

        <div className="developer-qa-custom-add">
          <label>
            <span>Test players</span>
            <input
              type="number"
              min="1"
              max="72"
              value={testPlayerCount}
              onChange={(event) => setTestPlayerCount(clampNumber(Number(event.target.value), 1, 72))}
            />
          </label>
          <label>
            <span>Character</span>
            <select value={testCharacter} onChange={(event) => setTestCharacter(event.target.value as QaCharacterSelection)}>
              {CHARACTER_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={addCustomTestCitizens}>Add selected crowd</button>
        </div>

        <div className="developer-qa-actions">
          <button type="button" onClick={() => addPresetCitizens(1)}>Add 1</button>
          <button type="button" onClick={() => addPresetCitizens(6)}>Add 6</button>
          <button type="button" onClick={() => addPresetCitizens(12)}>Add 12</button>
          <button type="button" onClick={() => actions.startQuickMiniGame()} disabled={snapshot.tour.isTourActive || playerCount === 0}>Start 1 Round</button>
          <button type="button" onClick={actions.triggerLevel10ChampionCelebrationTest}>Test L10 Win</button>
          <button type="button" onClick={submitMixedAnswers}>Mixed answers</button>
          <button type="button" onClick={() => void copyDebugReport()}>{lastCopied ? 'Copied!' : 'Copy JSON'}</button>
          <button type="button" onClick={() => void reloadMotionConfig()}>
            {motionReloadStatus === 'ok' ? 'Motion Reloaded' : motionReloadStatus === 'error' ? 'Motion Error' : 'Reload Motion Config'}
          </button>
          <button type="button" onClick={() => void reloadGameplayConfig()}>
            {gameplayReloadStatus === 'ok' ? 'Gameplay Reloaded' : gameplayReloadStatus === 'error' ? 'Gameplay Error' : 'Reload Gameplay Config'}
          </button>
          <button type="button" onClick={() => void reloadAudioConfig()}>
            {audioReloadStatus === 'ok' ? 'Audio Reloaded' : audioReloadStatus === 'error' ? 'Audio Error' : 'Reload Audio Config'}
          </button>
          <button type="button" onClick={() => void reloadLocalizationConfig()}>
            {localizationReloadStatus === 'ok' ? 'Localization Reloaded' : localizationReloadStatus === 'error' ? 'Localization Error' : 'Reload Localization'}
          </button>
        </div>

        <div className="developer-qa-answer-grid">
          {ANSWER_COMMANDS.map((command) => (
            <button key={command} type="button" onClick={() => submitAnswerFromTestUsers(command)}>
              All {command}
            </button>
          ))}
        </div>

        <div className="developer-qa-force-grid">
          {MINI_GAME_QUICK_FORCE.map((miniGame) => (
            <button key={miniGame.id} type="button" onClick={() => forceNextMiniGame(miniGame.id)}>
              Force {miniGame.id}
            </button>
          ))}
        </div>

        <p className="developer-qa-hint">
          QA commands are sent through the same Twitch command router as real chat, so this panel is safe for local testing.
        </p>
      </div>
    </section>
  );
}

function createQaMessage(twitchUserId: string, displayName: string, message: string): TwitchChatMessage {
  return {
    twitchUserId,
    displayName,
    message,
    isBroadcaster: false,
    isMod: false,
    badges: ['qa'],
    timestamp: Date.now(),
  };
}

function createCustomQaUser(
  batchId: string,
  index: number,
  citizenIndex: number,
  selectedCharacter: QaCharacterSelection,
): { twitchUserId: string; displayName: string } {
  if (selectedCharacter === 'mixed') {
    const mixedId = CHARACTER_IDS[index % CHARACTER_IDS.length];
    return createCustomQaUser(batchId, index, citizenIndex, mixedId);
  }

  const twitchUserId = findTwitchIdForCharacter(`qa_${selectedCharacter}_${batchId}_${index}`, citizenIndex, selectedCharacter);
  const displayName = `QA_${String(citizenIndex + 1).padStart(2, '0')}`;

  return { twitchUserId, displayName };
}

function findTwitchIdForCharacter(baseId: string, _citizenIndex: number, desiredCharacter: CharacterId): string {
  // GameplayOverlay reads this explicit QA marker before using the session-randomized assignment.
  // This keeps QA's selected character deterministic while normal Twitch players stay randomized.
  return `${QA_BOT_PREFIX}qa_${desiredCharacter}_${baseId}`;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, Math.round(value)));
}

