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
