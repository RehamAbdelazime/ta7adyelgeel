import type { LaserChallengeSnapshot } from '../../../../game-core/minigames/minigame-types';

/**
 * Pure visual projection of the EXISTING, verified optical solution.
 * Original solver: source LEFT -> receivers RIGHT (x increases).
 * New board:     source TOP  -> receivers BOTTOM (projected y increases).
 *
 * Every original horizontal/vertical segment stays cardinal. Mirror '/' vs '\\'
 * stays optically valid when axes are exchanged. Nothing is solved in React;
 * the correct ray continues to arrive only AFTER host reveal.
 */
import { LASER_VERTICAL_BOARD, projectLaserPoint } from '../../../../game-core/minigames/laser-challenge/laser-board-layout';
import { translate } from '../../../../game-core/localization/translations';

/** Sprites are the approved, cropped assets from the user's original artwork.
 * Rendered with the SAME geometry in the game and the two-page tutorial. */
const LASER_ART = '/assets/game/runtime/minigames/laser-challenge';
const MIRROR_SPRITE = `${LASER_ART}/laser-mirror.png`;
const EMITTER_SPRITE = `${LASER_ART}/laser-emitter.png`;

/** Shared visual board for gameplay and the game's two-page tutorial. */
export function LaserBoard({ plan, locale, compact = false }: {
  plan: LaserChallengeSnapshot;
  locale: 'ar' | 'en';
  compact?: boolean;
}) {
  const revealed = Boolean(plan.revealedPath?.length);
  const emitter = projectLaserPoint(plan.source);
  const projectedPath = plan.revealedPath?.map(projectLaserPoint) ?? [];
  // Asset muzzle is ~41px below the center after image scaling.
  // Start the beam exactly there; never draw through the cannon body.
  const beamPoints = projectedPath.map((point, index) =>
    `${point.x.toFixed(2)},${(index === 0 ? point.y + 41 : point.y).toFixed(2)}`,
  ).join(' ');

  return (
    <div className={`laser-v80-board ${compact ? 'laser-v80-compact' : ''} ${revealed ? 'laser-v80-revealed' : ''}`}>
      <svg
        className="laser-v80-svg"
        viewBox={`0 0 ${LASER_VERTICAL_BOARD.width} ${LASER_VERTICAL_BOARD.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={translate(locale, 'minigame.laserChallenge.boardAria')}
      >
        <defs>
          <linearGradient id="laserV80Panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#122644" />
            <stop offset=".56" stopColor="#0d1c35" />
            <stop offset="1" stopColor="#070f26" />
          </linearGradient>
          <pattern id="laserV80Grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#67a8de" strokeOpacity=".12" strokeWidth="1" />
          </pattern>
          <filter id="laserV80Glow" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="laserV80SoftGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <rect x="10" y="7" width="940" height="462" rx="24" fill="url(#laserV80Panel)" stroke="#42688f" strokeWidth="2" />
        <rect x="20" y="17" width="920" height="442" rx="18" fill="url(#laserV80Grid)" />
        <path d="M32 107H928 M32 196H928 M32 285H928 M32 374H928" stroke="#234764" strokeOpacity=".32" strokeDasharray="4 15" />

        {/* Four neutral exit channels line up with the 4 bottom ChoiceCards.
            No numbered SVG answer cards; the shared QuestionScreenShell owns them. */}
        {plan.targetYs.map((row, index) => {
          const x = projectLaserPoint({ x: LASER_VERTICAL_BOARD.receiverInputX, y: row }).x;
          const isWinner = revealed && plan.correctTarget === index + 1;
          return (
            <g key={`receiver-${index}`} className={`laser-v80-receiver ${isWinner ? 'laser-v80-receiver-win' : ''}`}>
              <path d={`M${x} 392V436`} className="laser-v80-channel-guide" />
              <path d={`M${x - 14} 438V449H${x + 14}V438`} className="laser-v80-receiver-base" />
              <circle cx={x} cy={LASER_VERTICAL_BOARD.receiverY} r="15" className="laser-v80-socket-outer" />
              <circle cx={x} cy={LASER_VERTICAL_BOARD.receiverY} r="9" className="laser-v80-socket-inner" />
              <circle cx={x} cy={LASER_VERTICAL_BOARD.receiverY} r="3.2" className="laser-v80-socket-core" />
            </g>
          );
        })}

        {/* The glow sits UNDER the mirrors, like a beam passing through a reflection. */}
        {revealed && beamPoints ? (
          <g key={beamPoints} className="laser-v80-beam-group" aria-hidden="true">
            <polyline points={beamPoints} pathLength={1000} className="laser-v80-beam-halo" />
            <polyline points={beamPoints} pathLength={1000} className="laser-v80-beam-shell" />
            <polyline points={beamPoints} pathLength={1000} className="laser-v80-beam-core" />
          </g>
        ) : null}

        {/* Premium emitter image. No duplicate hand-drawn cannon. The muzzle
            points straight down, matching the original optical solver. */}
        <g className="laser-v80-emitter" transform={`translate(${emitter.x} ${emitter.y})`} aria-hidden="true">
          <image
            className="laser-v88-emitter-art"
            href={EMITTER_SPRITE}
            x={-45}
            y={-45}
            width={90}
            height={90}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* The provided mirror artwork is ALREADY a slash '/' at -45 degrees.
            Rotate by 90 degrees ONLY for a backslash; never double-rotate. */}
        <g className="laser-v80-mirrors" aria-hidden="true">
          {plan.mirrors.map((mirror) => {
            const point = projectLaserPoint(mirror);
            return (
              <g key={mirror.id} transform={`translate(${point.x} ${point.y})`} className="laser-v80-mirror">
                <image
                  href={MIRROR_SPRITE}
                  x={-28}
                  y={-28}
                  width={56}
                  height={56}
                  preserveAspectRatio="xMidYMid meet"
                  transform={mirror.slash === '/' ? undefined : 'rotate(90)'}
                />
              </g>
            );
          })}
        </g>

        {revealed ? (
          <g className="laser-v80-sparks" aria-hidden="true">
            {projectedPath.slice(1, -1).map((point, index) => (
              <g key={`${index}-${point.x}-${point.y}`} transform={`translate(${point.x} ${point.y})`}>
                <circle r="4.5" fill="#fff2de" filter="url(#laserV80Glow)" />
                <path d="M-10 0H10M0 -10V10" stroke="#fff4d5" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
              </g>
            ))}
          </g>
        ) : null}
      </svg>
    </div>
  );
}
