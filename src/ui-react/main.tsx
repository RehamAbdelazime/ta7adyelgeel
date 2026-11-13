import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { GameProvider } from './context/GameContext';
import { TwitchConnectionProvider } from './context/TwitchConnectionContext';
import { LocalizationProvider } from './context/LocalizationContext';
// Local, bundled by Vite from the Fontsource npm packages: no CDN or runtime internet required.
import '@fontsource-variable/fredoka/wght.css';
import '@fontsource-variable/alexandria/wght.css';
import './styles.css';
import './styles/premium-lobby.css';
import './styles/premium-stage-mode.css';
import './styles/premium-experience.css';
import './styles/lobby-final-polish.css';
import './styles/ambient-accents.css';
import './styles/lobby-action-alignment.css';
import './styles/concert-lighting-rig.css';
import './styles/casual-settings-v10.css';
// Bilingual typography underlays the final, screen-scoped mode-picker layout.
import './styles/typography-system-v11.css';
// Mode-picker only: final scoped polish, no changes to gameplay or the lobby.
import './styles/mode-picker-casual-v12.css';
// Final game-catalog layout: scoped to the two selection screens only.
import './styles/game-picker-v14.css';
// One Back control across all lobby navigation screens.
import './styles/screen-back-button.css';
// Opt-in shared question experience (Food Origin + Maze Gates pilot).
import './styles/question-experience-v17.css';
// Final polish for the stage question experience (above legacy styles).
import './styles/question-stage-v18.css';
// Unified question HUD, scalable answer zones and shared casual score screens.
import './styles/game-show-polish-v19.css';
// v20: horizontal choices, unified stage answer lanes and host bubble.
import './styles/answer-zones-question-v20.css';
// Scoreboard interaction regression fix + shared casual action + mini-game lighting.
import './styles/scoreboard-stage-v21.css';
// v22: stage-mounted lighting follows answer reveal and leaderboard events.
import './styles/event-stage-lighting-v22.css';
// v23: shared question-style result banner, simplified scoreboard and matching game CTA.
import './styles/scoreboard-casual-v23.css';
// V25: shared compact answers for Shape Count and other choice-based minigames.
import './styles/shared-choice-questions-v25.css';
// V27: premium Lucky Cup artwork + deterministic visible shuffle.
import './styles/lucky-cup-v27.css';
// V28: correct full-stage Lucky Cup prep, ball visibility, and stage-host answer pod.
import './styles/lucky-cup-v28.css';
import './styles/host-answer-pod-v28.css';

// V32: permanent answer reveal, illustrated intros, and shared visual structure.
import './styles/experience-unification-v32.css';
// V34: scoped, minimal gameplay fixes for four tested mini-games.
import './styles/gameplay-clarity-v34.css';
// V35: targeted polish per game, after legacy and v34 rule layers.
import './styles/gameplay-review-v35.css';
// V36: two visual trivia modes sharing the existing question HUD and host controls.
import './styles/visual-guess-v36.css';
import './styles/poster-puzzle-v73.css';
// V38: count/maze/shape gameplay quality without changing shared layouts.
import './styles/gameplay-quality-v38.css';
// V39: spectator leaderboard and join policy visual polish.
import './styles/spectator-experience-v39.css';

// V40: Chaos reveal + Golden Rewards scoreboard badges.
import './styles/chaos-v40.css';
// V41: XP only appears once, at the end of a Tour or single MiniGame.
import './styles/progression-finale-v41.css';
// V42: stage character reactions, stable avatars, and finale level-up animations.
import './styles/character-progression-v42.css';
// V46 visual polish: scoreboard, winner banner, shape shading, nameplates.
import './styles/visual-polish-v46.css';
// V61: frames stay sharp; longer movie answers fit fully inside their cards.
import './styles/visual-guess-readability-v61.css';
// V68: photographic, navigable pre-round game tutorials.
import './styles/intro-walkthrough-v68.css';
import './styles/laser-challenge-v75.css';
import './styles/intro-all-games-v72.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <GameProvider>
      <LocalizationProvider>
        <TwitchConnectionProvider>
          <App />
        </TwitchConnectionProvider>
      </LocalizationProvider>
    </GameProvider>
  </StrictMode>,
);
