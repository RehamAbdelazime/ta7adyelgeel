import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { MEMORY_ITEM_EMOJI, getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';

export function MemoryCountScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const memory = miniGame.memoryCount;
  if (!memory) return <p className="gameplay-empty-round">{t('gameplay.empty.memory')}</p>;

  const isReveal = tourPhase === 'scoring' && memory.correctCount !== null;
  const isPreview = tourPhase === 'tour_starting' && memory.showItems;
  const targetIcon = MEMORY_ITEM_EMOJI[memory.targetKind];
  return (
    <QuestionScreenShell
      miniGame={{ ...miniGame, statement: isPreview ? miniGame.statement : '' }}
      tourPhase={tourPhase}
      layout="choice"
      shellClassName={isPreview ? 'v35-memory-prep' : ''}
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.memory.answerNow') : getPhaseHelper(tourPhase, t)}
      choices={isPreview ? [] : memory.choices.map((choice) => ({ command: choice.command, label: choice.label, tone: 'cyan' }))}
      bodyClassName="gameplay-question-body-memory"
    >
      <div className={`v35-memory-puzzle ${isPreview ? 'v35-memory-preview' : ''}`}>
        {isPreview ? (
          <div className="gameplay-memory-grid v35-memory-grid" style={{ gridTemplateColumns: `repeat(${memory.columns}, minmax(0, 1fr))` }}>
            {memory.cells.map((cell) => <span key={cell.id} className="gameplay-memory-item">{MEMORY_ITEM_EMOJI[cell.kind]}</span>)}
          </div>
        ) : (
          <div className="v35-memory-query" role={isReveal ? 'status' : undefined}>
            <span className="v35-memory-query-icon" aria-hidden="true">{targetIcon}</span>
            <strong>{isReveal ? memory.correctCount : '?'}</strong>
            {!isReveal ? <small>{memory.targetLabel}</small> : null}
          </div>
        )}
      </div>
    </QuestionScreenShell>
  );
}
