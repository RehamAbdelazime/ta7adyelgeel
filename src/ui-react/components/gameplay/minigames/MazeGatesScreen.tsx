import type { MiniGameSnapshot } from '../../../../game-core/minigames/minigame-types';
import type { TourPhase } from '../../../../game-core/tours/tour-types';
import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';
import { useTranslation } from '../../../i18n/useTranslation';
import {
  SHAPE_COLORS, MEMORY_ITEM_EMOJI, normalizeRuntimeAssetUrl,
  getShapeLabel, getShapeIcon, getChoiceTone, getPairChoiceTone,
  getPhaseHelper, type TranslateFn, type ChoiceTone,
} from '../shared/overlay-types';
import { type ShapeCountShapeId } from '../../../../game-core/minigames/minigame-types';
import { QuestionScreenShell, type QuestionChoiceItem, ShapeMark } from '../shared/question-shell';

export function MazeGatesScreen({ miniGame, tourPhase }: { miniGame: MiniGameSnapshot; tourPhase: TourPhase }) {
  const t = useTranslation();
  const mazeGates = miniGame.mazeGates;

  if (!mazeGates) {
    return <p className="gameplay-empty-round">{t('gameplay.empty.mazeGates')}</p>;
  }

  const reveal = mazeGates.revealPath;
  const fullMaze = mazeGates.fullMaze;
  const pathLine = (points: { x: number; y: number }[]) => points.map((point) => `${point.x},${point.y}`).join(' ');
  const choices = fullMaze
    ? fullMaze.gates.map((gate) => ({ command: gate.command, label: gate.label, tone: 'orange' as ChoiceTone }))
    : mazeGates.paths.map((path) => ({ command: path.command, label: path.label, tone: 'orange' as ChoiceTone }));
  const helper = miniGame.acceptsAnswers ? t('gameplay.helper.maze.answerNow') : reveal ? t('gameplay.maze.correctGate', { answer: String(mazeGates.correctOptionNumber ?? '-') }) : getPhaseHelper(tourPhase, t);

  const mazeBody = fullMaze ? (
    <div className={`gameplay-maze-stage gameplay-maze-full-stage ${reveal ? 'gameplay-maze-reveal' : ''}`}>
      <svg viewBox={`0 0 ${fullMaze.viewBoxWidth} ${fullMaze.viewBoxHeight}`} className="gameplay-maze-svg gameplay-maze-full-svg" role="img" aria-label="Maze gates">
        <defs>
          <filter id="mazeFullGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="mazeFullBoardFill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="rgba(8, 13, 38, 0.98)" /><stop offset="1" stopColor="rgba(40, 15, 74, 0.95)" /></linearGradient>
          <linearGradient id="mazeWallFill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f8fbff" /><stop offset="1" stopColor="#b8c6d8" /></linearGradient>
        </defs>
        <rect x={fullMaze.boardX - 30} y={fullMaze.boardY - 32} width={fullMaze.boardWidth + 60} height={fullMaze.boardHeight + 78} rx="28" className="gameplay-maze-full-frame" />
        <rect x={fullMaze.boardX - 8} y={fullMaze.boardY - 8} width={fullMaze.boardWidth + 16} height={fullMaze.boardHeight + 16} rx="8" className="gameplay-maze-full-board" />
        <g className="gameplay-maze-full-grid" aria-hidden="true">
          {Array.from({ length: fullMaze.columns + 1 }, (_, index) => <path key={`v-${index}`} d={`M${fullMaze.boardX + index * (fullMaze.boardWidth / fullMaze.columns)} ${fullMaze.boardY} V${fullMaze.boardY + fullMaze.boardHeight}`} />)}
          {Array.from({ length: fullMaze.rows + 1 }, (_, index) => <path key={`h-${index}`} d={`M${fullMaze.boardX} ${fullMaze.boardY + index * (fullMaze.boardHeight / fullMaze.rows)} H${fullMaze.boardX + fullMaze.boardWidth}`} />)}
        </g>
        {fullMaze.solutionPath.length > 0 ? <polyline points={pathLine(fullMaze.solutionPath)} className="gameplay-maze-full-solution" /> : null}
        <g className="gameplay-maze-full-walls-shadow" aria-hidden="true">{fullMaze.wallSegments.map((segment, index) => <line key={`shadow-${index}`} x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} />)}</g>
        <g className="gameplay-maze-full-walls">{fullMaze.wallSegments.map((segment, index) => <line key={`wall-${index}`} x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} />)}</g>
        <g className="gameplay-maze-full-exit" transform={`translate(${fullMaze.exit.x} ${fullMaze.exit.y})`}><rect x="-38" y="-15" width="76" height="30" rx="15" /><text y="5" textAnchor="middle">{fullMaze.exit.label}</text></g>
        {fullMaze.gates.map((gate) => <g key={gate.optionNumber} className={`gameplay-maze-full-gate ${gate.isCorrect ? 'gameplay-maze-full-gate-correct' : ''} ${gate.isDeadEnd ? 'gameplay-maze-full-gate-dead' : ''}`} transform={`translate(${gate.x} ${gate.y})`}><circle r="19" /><text y="6" textAnchor="middle">{gate.command}</text></g>)}
      </svg>
    </div>
  ) : (
    <div className={`gameplay-maze-stage ${reveal ? 'gameplay-maze-reveal' : ''}`}>
      <svg viewBox="0 0 720 390" className="gameplay-maze-svg" role="img" aria-label="Maze gates">
        <defs><filter id="mazeGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter><linearGradient id="mazeBoardFill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="rgba(5, 11, 34, 0.95)" /><stop offset="1" stopColor="rgba(42, 16, 77, 0.92)" /></linearGradient></defs>
        <rect x="34" y="28" width="652" height="332" rx="26" className="gameplay-maze-board" />
        <g className="gameplay-maze-grid" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <path key={`v-${index}`} d={`M${106 + index * 64} 58 V330`} />)}{Array.from({ length: 5 }, (_, index) => <path key={`h-${index}`} d={`M70 ${94 + index * 54} H650`} />)}</g>
        <g className="gameplay-maze-exit-svg"><rect x="318" y="20" width="84" height="30" rx="15" /><text x="360" y="40" textAnchor="middle">EXIT</text></g>
        {mazeGates.paths.map((path) => <polyline key={`shadow-${path.optionNumber}`} points={pathLine(path.path)} className="gameplay-maze-path-shadow" />)}
        {mazeGates.paths.map((path) => <polyline key={path.optionNumber} points={pathLine(path.path)} className={`gameplay-maze-path ${path.isCorrect ? 'gameplay-maze-path-correct' : ''} ${path.isDeadEnd ? 'gameplay-maze-path-dead' : ''}`} />)}
        {mazeGates.paths.map((path) => { const first = path.path[0]; if (!first) return null; return <g key={`gate-${path.optionNumber}`} className={`gameplay-maze-entrance ${path.isCorrect ? 'gameplay-maze-entrance-correct' : ''} ${path.isDeadEnd ? 'gameplay-maze-entrance-dead' : ''}`} transform={`translate(${first.x} ${first.y})`}><circle r="20" /><text y="6" textAnchor="middle">{path.command}</text></g>; })}
        {mazeGates.paths.map((path) => { const last = path.path[path.path.length - 1]; if (!last) return null; return <circle key={`end-${path.optionNumber}`} cx={last.x} cy={last.y} r={path.isCorrect ? 11 : 7} className={`gameplay-maze-end ${path.isCorrect ? 'gameplay-maze-end-correct' : ''} ${path.isDeadEnd ? 'gameplay-maze-end-dead' : ''}`} />; })}
      </svg>
    </div>
  );

  return (
    <QuestionScreenShell miniGame={miniGame} tourPhase={tourPhase} helperText={helper} choices={choices} bodyClassName="gameplay-question-body-maze">
      {mazeBody}
    </QuestionScreenShell>
  );
}
