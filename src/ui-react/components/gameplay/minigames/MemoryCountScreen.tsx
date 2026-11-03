import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useTranslation } from '../../../i18n/useTranslation';
import { useGame } from '../../../context/GameContext';
import { MEMORY_ITEM_EMOJI, getPhaseHelper } from '../shared/overlay-types';
import { QuestionScreenShell } from '../shared/question-shell';
import { ScoringGuide } from '../shared/ScoringGuide';

export function MemoryCountScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const { snapshot } = useGame();
  const memory = miniGame.memoryCount;

  if (!memory) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.memory')}</p>;
  }

  return (
    <QuestionScreenShell
      miniGame={miniGame}
      tourPhase={tourPhase}
      layout="choice"
      helperText={miniGame.acceptsAnswers ? t('gameplay.helper.memory.answerNow') : memory.correctCount !== null ? t('gameplay.memory.correctCount', { answer: String(memory.correctCount) }) : getPhaseHelper(tourPhase, t)}
      choices={memory.choices.map((choice) => ({ command: choice.command, label: choice.label, tone: 'yellow' }))}
      bodyClassName="gameplay-question-body-memory"
    >
      <div className={`gameplay-memory-stage ${memory.showItems ? '' : 'gameplay-memory-hidden'}`}>
        {memory.showItems ? (
          <div className="gameplay-memory-grid" style={{ gridTemplateColumns: `repeat(${memory.columns}, minmax(0, 1fr))` }}>
            {memory.cells.map((cell) => (
              <span key={cell.id} className="gameplay-memory-item">{MEMORY_ITEM_EMOJI[cell.kind]}</span>
            ))}
          </div>
        ) : (
          <div className="gameplay-memory-blank">
            <strong>{snapshot.locale === 'ar' ? 'الأشكال اختفت!' : 'ITEMS HIDDEN'}</strong>
            <span>{snapshot.locale === 'ar' ? `كام ${memory.targetLabel} شوفتي؟` : `How many ${memory.targetLabel} did you see?`}</span>
          </div>
        )}
      <ScoringGuide
        exact={memory.scoring.exact}
        partial={memory.scoring.partial}
        partialTolerance={memory.scoring.partialTolerance}
        incorrect={memory.scoring.incorrect}
        exactLabel={t('gameplay.scoring.exact')}
        partialLabel={t('gameplay.scoring.withinMargin')}
        incorrectLabel={t('gameplay.scoring.incorrect')}
        className="gameplay-memory-scoring"
      />
      </div>
    </QuestionScreenShell>
  );
}
