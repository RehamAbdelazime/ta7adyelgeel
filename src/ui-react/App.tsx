import { GameSceneStage } from './components/visual/GameSceneStage';
import { AppSettingsButton } from './components/settings/AppSettingsButton';
import { TwitchAuthGate } from './components/settings/TwitchAuthGate';
import { useGame } from './context/GameContext';
import { useTwitchConnection } from './context/TwitchConnectionContext';
import { GameConfigProvider } from './context/GameConfigContext';
import { MotionTuningProvider } from './context/MotionTuningContext';
import { AudioTuningProvider } from './context/AudioTuningContext';
import { PrivateStreamerAnswerDock } from './components/streamer/PrivateStreamerAnswerDock';

export function App() {
  const { snapshot } = useGame();
  const { isConnected } = useTwitchConnection();

  if (!isConnected) {
    return <TwitchAuthGate />;
  }

  return (
    // FIX: provider order is now GameConfig → Motion → Audio so config changes
    // only cascade into the layers that actually need them, not the reverse.
    // Indentation corrected throughout.
    <GameConfigProvider>
      <MotionTuningProvider>
        <AudioTuningProvider>
          <main className="relative h-screen w-screen overflow-hidden bg-[#050017]" dir={snapshot.direction}>
            <GameSceneStage />
            <div className="pointer-events-none absolute inset-0 z-10">
              <AppSettingsButton />
              <PrivateStreamerAnswerDock />
            </div>
          </main>
        </AudioTuningProvider>
      </MotionTuningProvider>
    </GameConfigProvider>
  );
}
