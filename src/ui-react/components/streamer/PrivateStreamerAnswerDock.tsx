import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';

const STATUS_RESET_MS = 1400;

export function PrivateStreamerAnswerDock() {
  const { snapshot, actions } = useGame();
  const { status } = useTwitchConnection();
  const [value, setValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('Private answer hidden');
  const [statusTone, setStatusTone] = useState<'idle' | 'ok' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canAnswer = snapshot.tour.phase === 'answer_window_open' && snapshot.miniGame.acceptsAnswers;
  const choiceCount = useMemo(() => getPrivateChoiceCount(snapshot.miniGame), [snapshot.miniGame]);
  const isCountAnswer = snapshot.miniGame.id === 'count-the-beat';
  const isWordAnswer = snapshot.miniGame.id === 'hangman';
  const isValidAnswer = isWordAnswer ? value.trim().length > 0
    : isCountAnswer ? /^\d{1,3}$/.test(value)
      : /^[1-9]$/.test(value) && Number(value) <= choiceCount;
  const streamerName = status.accountDisplayName || status.channelName || status.accountLogin || 'STREAMER';
  const streamerTwitchUserId = status.accountUserId;

  useEffect(() => {
    if (!canAnswer) {
      setValue('');
      setStatusTone('idle');
      setStatusMessage('Private answer hidden');
    }
  }, [canAnswer, snapshot.tour.roundNumber, snapshot.miniGame.id]);

  useEffect(() => {
    if (statusTone === 'idle') return undefined;

    const timeout = window.setTimeout(() => {
      setStatusTone('idle');
      setStatusMessage('Private answer hidden');
    }, STATUS_RESET_MS);

    return () => window.clearTimeout(timeout);
  }, [statusTone]);

  if (!canAnswer) {
    return null;
  }

  const submit = () => {
    if (!isValidAnswer) return;
    const feedback = actions.submitPrivateStreamerAnswer({ rawAnswer: value, displayName: streamerName, twitchUserId: streamerTwitchUserId });
    setValue('');
    setStatusTone(feedback.ok ? 'ok' : 'error');
    setStatusMessage(feedback.ok ? 'Submitted privately' : feedback.message);
    inputRef.current?.focus();
  };

  return (
    <aside className={`private-streamer-answer private-streamer-answer-${statusTone}`} aria-label="Streamer private answer">
      <div className="private-streamer-answer-header">
        <span>HOST ONLY</span>
        <strong>Private Answer</strong>
      </div>

      <form
        className="private-streamer-answer-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          ref={inputRef}
          type="password"
          inputMode={isWordAnswer ? 'text' : 'numeric'}
          pattern={isWordAnswer ? undefined : '[0-9]*'}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={isWordAnswer ? 30 : isCountAnswer ? 3 : 1}
          value={value}
          onChange={(event) => setValue(event.target.value.replace(isWordAnswer ? /^!/ : isCountAnswer ? /[^0-9]/g : /[^1-9]/g, ''))}
          placeholder={isWordAnswer ? 'letter / word' : isCountAnswer ? '0–999' : `1–${choiceCount}`}
          aria-label="Private streamer answer input"
        />
        <button type="submit" disabled={!isValidAnswer}>SEND</button>
      </form>

      <p>{statusMessage}</p>
    </aside>
  );
}

type MiniGameSnapshotLike = ReturnType<typeof useGame>['snapshot']['miniGame'];

function getPrivateChoiceCount(miniGame: MiniGameSnapshotLike): number {
  if (miniGame.id === 'true-fake' || miniGame.id === 'couple-or-siblings' || miniGame.id === 'before-or-after') return 2;
  if (miniGame.id === 'lucky-cup') return 3;
  if (miniGame.id === 'shape-count') return miniGame.shapeGrid?.choices.length ?? 4;
  if (miniGame.id === 'memory-count') return miniGame.memoryCount?.choices.length ?? 4;
  if (miniGame.id === 'food-origin') return miniGame.foodOrigin?.choices.length ?? 4;
  if (miniGame.id === 'guess-logo') return miniGame.guessLogo?.choices.length ?? 4;
  if (miniGame.id === 'maze-gates') return miniGame.mazeGates?.choices.length ?? 4;
  return 4;
}
