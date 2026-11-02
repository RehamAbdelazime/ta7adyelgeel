import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useGame } from '../../context/GameContext';
import { useTwitchConnection } from '../../context/TwitchConnectionContext';
import { getVisibleAudience } from '../gameplay/shared/visible-audience';
import { getAdaptiveLobbyCrowdCoordinates } from '../gameplay/shared/citizen-helpers';
import { ConcertLightingRig } from './ConcertLightingRig';

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

type LobbyJoinFlash = { id: string; x: number; y: number };
const DECOR_ASSET_ROOT = `${RUNTIME}/ui/scene-polish`;

/** Soft, event-driven floor acknowledgment. Never animates on chat messages and never
 * produces a flash during initial synchronization of existing audience members.
 */
function useLobbyJoinFlash(isLobby: boolean): LobbyJoinFlash | null {
  const { snapshot } = useGame();
  const { status } = useTwitchConnection();
  const audience = getVisibleAudience(snapshot.citizens, status.accountUserId);
  const ids = audience.map((citizen) => citizen.twitchUserId).join('|');
  const previousIds = useRef<string[] | null>(null);
  const [flash, setFlash] = useState<LobbyJoinFlash | null>(null);

  useEffect(() => {
    const currentIds = audience.map((citizen) => citizen.twitchUserId);
    const oldIds = previousIds.current;
    previousIds.current = currentIds;
    if (!isLobby || oldIds === null) return;
    const prior = new Set(oldIds);
    const newest = [...currentIds].reverse().find((id) => !prior.has(id));
    if (!newest) return;
    const index = currentIds.indexOf(newest);
    const point = getAdaptiveLobbyCrowdCoordinates(index, currentIds.length);
    setFlash({
      id: newest + ':' + currentIds.length,
      x: 9.5 + point.x * .75,
      y: 72.4 + point.y * .255 + 5,
    });
  // `ids` is a primitive signature of membership. Status state changes or chat do not pulse.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, isLobby]);

  useEffect(() => {
    if (!flash) return;
    const timeout = window.setTimeout(() => setFlash(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [flash]);

  return isLobby ? flash : null;
}

export function VisualWorldLayer({ sceneOverride }: { sceneOverride?: 'lobby' | 'minigame' } = {}) {
  const { snapshot } = useGame();
  const isMiniGameScene = sceneOverride
    ? sceneOverride === 'minigame'
    : snapshot.tour.isTourActive && snapshot.tour.phase !== 'lobby_open';
  const sceneClassName = isMiniGameScene
    ? 'visual-world-layer-minigame-active'
    : 'visual-world-layer-lobby-active';

  const joinFlash = useLobbyJoinFlash(!isMiniGameScene);

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

      {!isMiniGameScene ? (
        <div className="concert-lobby-sparkles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
      ) : null}

      <div className="concert-effect-layer concert-effect-layer-back">
        {!isMiniGameScene ? (
          <div className="premium-stage-ambience" aria-hidden="true">
            <ConcertLightingRig />
            {/* A single SVG light rig replaces the disconnected old beams & floor spot
                circles. Each moving beam carries its ground reflection with it. */}
            {/* Soft sweeps over the audience plaza; these do not cover UI or player labels. */}

            {/* A small set of original, project-local image textures; intentionally subtle. */}
            <img className="premium-floor-light-cookie premium-floor-light-cookie-left" src={`${DECOR_ASSET_ROOT}/soft-audience-light.png`} alt="" draggable={false} />
            <img className="premium-floor-light-cookie premium-floor-light-cookie-right" src={`${DECOR_ASSET_ROOT}/soft-audience-light.png`} alt="" draggable={false} />
            <img className="premium-scene-glint premium-scene-glint-left" src={`${DECOR_ASSET_ROOT}/stage-glint.png`} alt="" draggable={false} />
            <img className="premium-scene-glint premium-scene-glint-right" src={`${DECOR_ASSET_ROOT}/stage-glint.png`} alt="" draggable={false} />
            {/* Original atmospheric light-mote overlay: visible only near side rigs. */}
            <img className="premium-rig-motes premium-rig-motes-left" src={`${DECOR_ASSET_ROOT}/ambient-light-motes.png`} alt="" draggable={false} loading="lazy" />
            <img className="premium-rig-motes premium-rig-motes-right" src={`${DECOR_ASSET_ROOT}/ambient-light-motes.png`} alt="" draggable={false} loading="lazy" />
            {joinFlash ? (
              <img key={joinFlash.id} className="premium-audience-join-flash" src={`${DECOR_ASSET_ROOT}/soft-audience-light.png`} alt="" draggable={false} style={{ '--join-x': `${joinFlash.x}%`, '--join-y': `${joinFlash.y}%` } as CSSProperties} />
            ) : null}
            {/* Low front-of-stage LED floor markers, leaving the stairway clear. */}
            <div className="premium-stage-footlights">
              <span className="premium-stage-footlight" />
              <span className="premium-stage-footlight" />
              <span className="premium-stage-footlight" />
              <span className="premium-stage-footlight" />
            </div>
          </div>
        ) : null}
        <span className="concert-host-spotlight" />
        <span className="concert-host-floor-pool" />
        <span className="concert-floor-sweep-beam" />
        <span className="concert-screen-glow" />
        <span className="concert-screen-scanline" />
      </div>
    </div>
  );
}
