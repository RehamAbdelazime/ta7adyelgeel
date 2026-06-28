import { useGame } from '../../context/GameContext';

type VisualAsset = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  opacity?: number;
  className?: string;
};

const RUNTIME = './assets/game/runtime';

function asset(
  id: string,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
  z: number,
  opacity = 1,
  className?: string,
): VisualAsset {
  return { id, src, x, y, width, height, z, opacity, className };
}

function pct(value: number, base: number): string {
  return `${(value / base) * 100}%`;
}

const lobbyStageAsset = asset(
  'concert-stage-background',
  `${RUNTIME}/background/concert_stage_1920x1080.png`,
  0, 0, 1920, 1080, 0, 1,
  'visual-world-concert-stage visual-world-stage-lobby',
);

const miniGameStageAsset = asset(
  'mini-game-stage-background',
  `${RUNTIME}/background/minigame_stage_1920x1080.png`,
  0, 0, 1920, 1080, 1, 1,
  'visual-world-concert-stage visual-world-stage-minigame',
);

// FIX: defined outside the component so the array is not recreated on every render.
const VISUAL_ASSETS: VisualAsset[] = [lobbyStageAsset, miniGameStageAsset];

export function VisualWorldLayer({ sceneOverride }: { sceneOverride?: 'lobby' | 'minigame' } = {}) {
  const { snapshot } = useGame();
  const isMiniGameScene = sceneOverride
    ? sceneOverride === 'minigame'
    : snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open';
  const sceneClassName = isMiniGameScene
    ? 'visual-world-layer-minigame-active'
    : 'visual-world-layer-lobby-active';

  return (
    <div
      className={`visual-world-layer visual-world-layer-concert ${sceneClassName}`}
      aria-hidden="true"
      data-scene={isMiniGameScene ? 'minigame' : 'lobby'}
    >
      {VISUAL_ASSETS.map((item) => (
        <div
          className={`visual-world-asset ${item.className ?? ''}`}
          data-asset-id={item.id}
          key={item.id}
          style={{
            left: pct(item.x, 1920),
            top: pct(item.y, 1080),
            width: pct(item.width, 1920),
            height: pct(item.height, 1080),
            zIndex: item.z,
            opacity: item.opacity ?? 1,
          }}
        >
          <img src={item.src} alt="" draggable={false} />
        </div>
      ))}

      <div className="concert-star-twinkle-layer" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <span key={index} className={`concert-star-twinkle concert-star-twinkle-${index + 1}`} />
        ))}
      </div>

      <div className="concert-effect-layer concert-effect-layer-back">
        <span className="concert-host-spotlight" />
        <span className="concert-host-floor-pool" />
        <span className="concert-floor-sweep-beam" />
        <span className="concert-screen-glow" />
        <span className="concert-screen-scanline" />
      </div>
    </div>
  );
}
