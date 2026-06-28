import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { GameProvider } from './context/GameContext';
import { TwitchConnectionProvider } from './context/TwitchConnectionContext';
import { LocalizationProvider } from './context/LocalizationContext';
import './styles.css';

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
