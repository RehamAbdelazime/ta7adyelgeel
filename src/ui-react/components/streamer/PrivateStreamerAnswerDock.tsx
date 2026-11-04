import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';

const STATUS_RESET_MS = 1400;

// The sole V31 host-answer UI, styled and positioned by the stage-mounted pod.
export function PrivateStreamerAnswerDock() {
  const { snapshot, actions } = useGame();
  const { status } = useTwitchConnection();
  const [value, setValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('Private answer hidden');
  const [statusTone, setStatusTone] = useState<'idle' | 'ok' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // The GameStore owns the answer lock; an accepted answer closes this dock
  // immediately and cannot reopen until the next question (including remounts).
  const canAnswer = snapshot.tour.phase === 'answer_window_open'
    && snapshot.miniGame.acceptsAnswers
    && !snapshot.privateStreamerAnswerSubmitted;
  const choiceCount = useMemo(() => getPrivateChoiceCount(snapshot.miniGame), [snapshot.miniGame]);
  const isCountAnswer = snapshot.miniGame.id === 'count-the-beat';
  const isArabic = snapshot.locale === 'ar';
  const isValidAnswer = isCountAnswer ? /^\d{1,3}$/.test(value)
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
    // Do not refocus after a successful submit: the store update unmounts the dock.
    if (!feedback.ok) inputRef.current?.focus();
  };

  return (
    <aside className={`private-streamer-answer private-streamer-answer-embedded private-streamer-answer-${statusTone}`} aria-label={isArabic ? 'إجابة الهوست الخاصة' : 'Host private answer'}>
      <div className="private-streamer-answer-header">
        <span className="qshell-host-private-tag">{isArabic ? 'خاص • HOST' : 'PRIVATE • HOST'}</span>
        <strong>{isArabic ? 'اختيار الهوست' : 'Host pick'}</strong>
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
          inputMode={'numeric'}
          pattern={'[0-9]*'}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={isCountAnswer ? 3 : 1}
          value={value}
          onChange={(event) => setValue(event.target.value.replace(isCountAnswer ? /[^0-9]/g : /[^1-9]/g, ''))}
          placeholder={isCountAnswer ? '0–999' : `1 – ${choiceCount}`}
          aria-label={isArabic ? 'اكتب إجابة الهوست' : 'Type host answer'}
        />
        <button type="submit" disabled={!isValidAnswer}>{isArabic ? 'إرسال' : 'SEND'}</button>
      </form>

      <p aria-live="polite" className={statusTone === 'idle' ? 'private-answer-idle-message' : ''}>
        {statusTone === 'idle' ? '' : statusTone === 'ok' ? (isArabic ? 'تم الإرسال' : 'Sent!') : statusMessage}
      </p>
    </aside>
  );
}

type MiniGameSnapshotLike = ReturnType<typeof useGame>['snapshot']['miniGame'];

function getPrivateChoiceCount(miniGame: MiniGameSnapshotLike): number {
  if (miniGame.id === 'couple-or-siblings') return 2;
  if (miniGame.id === 'lucky-cup') return 3;
  if (miniGame.id === 'shape-count') return miniGame.shapeGrid?.choices.length ?? 4;
  if (miniGame.id === 'memory-count') return miniGame.memoryCount?.choices.length ?? 4;
  if (miniGame.id === 'food-origin') return miniGame.foodOrigin?.choices.length ?? 4;
  if (miniGame.id === 'guess-movie' || miniGame.id === 'guess-star') return miniGame.visualGuess?.choices.length ?? 4;
  if (miniGame.id === 'maze-gates') return miniGame.mazeGates?.choices.length ?? 4;
  return 4;
}
