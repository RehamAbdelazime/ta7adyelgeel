import type { CitizenRuntime } from '../../citizens/citizen-types';
import type { LocaleCode } from '../../localization/locale-types';
import type { QuestionDifficulty } from '../../questions/question-types';
import type {
  MiniGameAnswerRecord, MiniGameScoreAward, MiniGameSnapshot,
  MiniGameStatus, SubmitMiniGameAnswerResult,
} from '../minigame-types';
import { calculateExactAnswerScore } from '../scoring-policy';
import { generateLaserPuzzle, type LaserPuzzle } from './laser-puzzle';

const ORDER: QuestionDifficulty[] = ['easy','medium','hard'];

export class LaserChallengeMiniGameService {
  private round: LaserPuzzle | null = null;
  private roundNumber = 0;
  private status: MiniGameStatus = 'idle';
  private readonly answers = new Map<string, MiniGameAnswerRecord>();
  private officialCorrect = 0;
  private spectatorCorrect = 0;
  private scored = false;
  private readonly usedSeeds = new Set<number>();

  beginTour(): void { this.clearActiveRound(); this.usedSeeds.clear(); }
  startRound(roundNumber: number, seed = Date.now()): void {
    this.clearActiveRound();
    this.roundNumber = roundNumber;
    let effectiveSeed = seed >>> 0;
    while (this.usedSeeds.has(effectiveSeed)) effectiveSeed = (effectiveSeed + 1) >>> 0;
    this.usedSeeds.add(effectiveSeed);
    this.round = generateLaserPuzzle(ORDER[(roundNumber - 1) % 3]!, effectiveSeed);
    this.status = 'intro';
  }
  setStatus(status: MiniGameStatus): void { if (this.round || status === 'idle') this.status = status; }
  submitAnswer(citizen: CitizenRuntime, answer: number): SubmitMiniGameAnswerResult {
    if (!this.round) return { ok: false, reason: 'no_round' };
    if (this.status !== 'answering') return { ok: false, reason: 'closed' };
    if (!Number.isInteger(answer) || answer < 1 || answer > 4) return { ok: false, reason: 'closed' };
    if (this.answers.has(citizen.twitchUserId)) return { ok: false, reason: 'already_answered' };
    const record: MiniGameAnswerRecord = {
      twitchUserId: citizen.twitchUserId, displayName: citizen.displayName, role: citizen.role,
      answer, submittedAt: Date.now(),
    };
    this.answers.set(citizen.twitchUserId, record);
    return { ok: true, record };
  }
  resolveRound(): void {
    if (!this.round) return;
    this.officialCorrect = 0;
    this.spectatorCorrect = 0;
    for (const [key, record] of this.answers) {
      const correct = record.answer === this.round.correctTarget;
      this.answers.set(key, { ...record, isCorrect: correct });
      if (correct && record.role === 'official') this.officialCorrect++;
      if (correct && record.role === 'spectator') this.spectatorCorrect++;
    }
    this.status = 'resolved';
  }
  createScoreAwards(): MiniGameScoreAward[] {
    if (!this.round || this.scored || !['resolved','scored','leaderboard'].includes(this.status)) return [];
    const awards = [...this.answers.values()].map((answer): MiniGameScoreAward => ({
      twitchUserId: answer.twitchUserId, displayName: answer.displayName, role: answer.role,
      ...calculateExactAnswerScore('laser-challenge', this.round!.difficulty, answer.isCorrect === true),
      difficulty: this.round!.difficulty,
    }));
    this.scored = true;
    this.status = 'scored';
    return awards;
  }
  clearActiveRound(): void {
    this.round = null; this.roundNumber = 0; this.status = 'idle'; this.answers.clear();
    this.officialCorrect = 0; this.spectatorCorrect = 0; this.scored = false;
  }
  clear(): void { this.clearActiveRound(); this.usedSeeds.clear(); }
  getSnapshot(locale: LocaleCode): MiniGameSnapshot {
    const reveal = ['resolved','scored','leaderboard'].includes(this.status);
    const records = [...this.answers.values()];
    return {
      id: 'laser-challenge', status: this.status, roundNumber: this.roundNumber,
      title: locale === 'ar' ? 'تحدي الليزر' : 'LASER CHALLENGE',
      statement: locale === 'ar' ? 'الليزر هيوصل لأنهي هدف؟' : 'Which target will the laser hit?',
      instruction: locale === 'ar' ? 'اتبع انعكاس الليزر واكتب !1 أو !2 أو !3 أو !4' : 'Trace the mirrors. Answer !1, !2, !3, or !4',
      acceptsAnswers: this.status === 'answering',
      officialAnswerCount: records.filter(r => r.role === 'official').length,
      spectatorAnswerCount: records.filter(r => r.role === 'spectator').length,
      answerRecords: records,
      correctAnswer: reveal && this.round ? this.round.correctTarget : null,
      correctOfficialCount: this.officialCorrect,
      correctSpectatorCount: this.spectatorCorrect,
      hasRound: Boolean(this.round),
      questionId: this.round ? `laser-${this.round.seed}-${this.roundNumber}` : null,
      questionCategory: null, questionDifficulty: this.round?.difficulty ?? null,
      questionBankStats: {
        totalQuestions: 9999, tourUsedQuestions: this.roundNumber,
        tourUsedSimilarityGroups: this.roundNumber, sessionUsedQuestions: this.roundNumber,
        sessionUsedSimilarityGroups: this.roundNumber,
      },
      laserChallenge: this.round ? {
        source: this.round.source,
        mirrors: this.round.mirrors.map(m => ({ ...m })),
        targetYs: [...this.round.targetYs],
        correctTarget: reveal ? this.round.correctTarget : null,
        revealedPath: reveal ? this.round.solution.map(p => ({ ...p })) : null,
      } : null,
    };
  }
}
