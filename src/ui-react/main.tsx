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
// Final typography layer; deliberately last to override legacy !important rules.
import './styles/typography-system-v11.css';

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
