import { useMemo, useState } from 'react';
import type { MiniGameId } from '../../../game-core/minigames/minigame-types';
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
  ['qa_user_001', 'QA_Nour'],
  ['qa_user_002', 'QA_Ahmed'],
  ['qa_user_003', 'QA_Sara'],
  ['qa_user_004', 'QA_Mona'],
  ['qa_user_005', 'QA_Karim'],
  ['qa_user_006', 'QA_Youssef'],
  ['qa_user_007', 'QA_Laila'],
  ['qa_user_008', 'QA_Omar'],
  ['qa_user_009', 'QA_Mariam'],
  ['qa_user_010', 'QA_Yassin'],
  ['qa_user_011', 'QA_Farah'],
  ['qa_user_012', 'QA_Ziad'],
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

const MINI_GAME_QUICK_FORCE: { id: MiniGameId; label: string }[] = [
  { id: 'food-origin', label: 'Food Origin' },
  { id: 'shape-count', label: 'Shape Count' },
  { id: 'maze-gates', label: 'Maze Gates' },
  { id: 'guess-logo', label: 'Guess The Logo' },
];

export function DeveloperQaPanel() {
  const { actions, snapshot } = useGame();
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
      ? `${playerCount} players Â· ${spectatorCount} spectators`
      : `${playerCount} players`;

    return [
      ['Tour', snapshot.tour.isTourActive ? `R${snapshot.tour.roundNumber}/${snapshot.tour.totalRounds}` : 'Lobby'],
      ['Phase', `${snapshot.tour.phase} Â· ${phaseSeconds}s`],
      ['Mini-game', `${snapshot.miniGame.title} Â· ${snapshot.miniGame.status}`],
      ['Answers', String(answerCount)],
      ['Answer window', snapshot.miniGame.acceptsAnswers ? 'OPEN' : 'closed'],
      ['Correct', correctAnswer],
      ['Question', snapshot.miniGame.questionId ?? '-'],
      ['Difficulty', snapshot.miniGame.questionDifficulty ?? '-'],
      ['Category', snapshot.miniGame.questionCategory ?? '-'],
      ['Chaos', snapshot.chaosEvent.active ? `${snapshot.chaosEvent.title} Â· ${snapshot.chaosEvent.badge}` : `${snapshot.chaosPercent}%`],
      ['Citizens', playerLabel],
      ['Motion config', lastError ? `ERROR: ${lastError}` : loadedAt ? `Loaded ${new Date(loadedAt).toLocaleTimeString()}` : configPath],
      ['Gameplay config', gameplayConfigError ? `ERROR: ${gameplayConfigError}` : gameplayConfigLoadedAt ? `${gameplayConfig.tour.defaultRoundCount} rounds Â· ${gameplayConfig.tour.phaseDurationsMs.answer_window_open}ms answers` : gameplayConfigPath],
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
    const joinedCitizens = snapshot.citizens.filter((citizen) => citizen.role === 'official' || citizen.role === 'spectator');

    if (joinedCitizens.length > 0) {
      return joinedCitizens.map((citizen) => ({
        twitchUserId: citizen.twitchUserId,
        displayName: citizen.displayName,
      }));
    }

    // Fallback for very early QA testing before adding a custom crowd.
    return QA_USERS.map(([twitchUserId, displayName]) => ({ twitchUserId, displayName }));
  };

  const getActiveAnswerCommands = () => {
    switch (snapshot.miniGame.id) {
      case 'true-fake':
      case 'couple-or-siblings':
        return ANSWER_COMMANDS.slice(0, 2);
      case 'shape-count':
        return (snapshot.miniGame.shapeGrid?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'memory-count':
        return (snapshot.miniGame.memoryCount?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'food-origin':
        return (snapshot.miniGame.foodOrigin?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'guess-logo':
        return (snapshot.miniGame.guessLogo?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'maze-gates':
        return (snapshot.miniGame.mazeGates?.choices ?? []).map((choice) => choice.command) as typeof ANSWER_COMMANDS[number][];
      case 'hangman':
        return [];
      default:
        return [...ANSWER_COMMANDS];
    }
  };

  const submitAnswerFromTestUsers = (command: string) => {
    getQaAnswerTargets().forEach((user, index) => {
      const message = snapshot.miniGame.id === 'hangman'
        ? getHangmanQaCommand(index)
        : command;
      actions.submitTwitchMessage(createQaMessage(user.twitchUserId, user.displayName, message));
    });
  };

  const submitMixedAnswers = () => {
    const activeCommands = getActiveAnswerCommands();
    const fallbackCommands = activeCommands.length > 0 ? activeCommands : [...ANSWER_COMMANDS];

    getQaAnswerTargets().forEach((user, index) => {
      const command = snapshot.miniGame.id === 'hangman'
        ? getHangmanQaCommand(index)
        : fallbackCommands[index % fallbackCommands.length] ?? '!1';
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
              Force {miniGame.label}
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
  return `qa_${desiredCharacter}_${baseId}`;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, Math.round(value)));
}

function getHangmanQaCommand(index: number): string {
  const commands = ['!a', '!e', '!m', '!s', '!word moon', '!word city', '!o', '!r', '!n', '!l', '!word test', '!word maze'];
  return commands[index % commands.length];
}
