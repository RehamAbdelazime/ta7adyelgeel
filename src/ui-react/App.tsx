import { GameSceneStage } from './components/visual/GameSceneStage';
import { AppSettingsButton } from './components/settings/AppSettingsButton';
import { TwitchAuthGate } from './components/settings/TwitchAuthGate';
import { useGame } from './context/GameContext';
import { useTwitchConnection } from './context/TwitchConnectionContext';
import { GameConfigProvider } from './context/GameConfigContext';
import { MotionTuningProvider } from './context/MotionTuningContext';
import { AudioTuningProvider } from './context/AudioTuningContext';

export function App() {
  const { snapshot } = useGame();
  const { isConnected } = useTwitchConnection();

  if (!isConnected) {
    return <TwitchAuthGate />;
  }

  return (
    <GameConfigProvider>
      <MotionTuningProvider>
        <AudioTuningProvider>
          <main className="app-desktop-shell" dir={snapshot.direction} lang={snapshot.locale}>
            <GameSceneStage />
            <div className="app-desktop-overlay-layer">
              <AppSettingsButton />
            </div>
          </main>
        </AudioTuningProvider>
      </MotionTuningProvider>
    </GameConfigProvider>
  );
}
