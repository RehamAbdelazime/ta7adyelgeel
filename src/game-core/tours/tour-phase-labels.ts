import type { TranslationKey } from '../localization/locale-types';
import type { TourPhase } from './tour-types';

export function getTourPhaseTitleKey(phase: TourPhase): TranslationKey {
  const keys: Record<TourPhase, TranslationKey> = {
    lobby_open: 'tour.phase.lobbyOpen',
    tour_starting: 'tour.phase.tourStarting',
    mini_game_intro: 'tour.phase.miniGameIntro',
    answer_window_open: 'tour.phase.answerWindowOpen',
    scoring: 'tour.phase.scoring',
    tour_complete: 'tour.phase.tourComplete',
    cleanup: 'tour.phase.cleanup',
  };

  return keys[phase];
}
