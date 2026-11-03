import type { MiniGameLightingState } from './mini-game-lighting-cues';
import { getAnswerLaneLightTarget, STAGE_LIGHT_ORIGINS } from './mini-game-lighting-cues';

/**
 * Decorative 1920x1080 mini-game-stage lighting.
 * Every moving-head beam and its floor pool are in the SAME SVG group and rotate
 * around the truss lamp. No React timers, layout reads, or pointer interaction.
 * Different geometry from the lobby rig: the mini-game's roof truss is higher.
 */
export function MiniGameLightingRig({ state }: { state: MiniGameLightingState }) {
  const target = state.cue === 'correct' && state.correctOption !== null
    ? getAnswerLaneLightTarget(state.correctOption, state.optionCount)
    : null;
  const { leftSide, rightSide, roofCenter } = STAGE_LIGHT_ORIGINS;
  return (
    <svg className={`minigame-lighting-rig-v21 minigame-lighting-cue-${state.cue}`} viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="minigame-v21-cyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#43dffa" stopOpacity="0" />
          <stop offset=".48" stopColor="#7fe8ff" stopOpacity=".57" />
          <stop offset="1" stopColor="#43dffa" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="minigame-v21-pink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff75d3" stopOpacity="0" />
          <stop offset=".5" stopColor="#f9a8ea" stopOpacity=".56" />
          <stop offset="1" stopColor="#ff75d3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="minigame-v21-center" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c3adff" stopOpacity="0" />
          <stop offset=".5" stopColor="#afc7ff" stopOpacity=".31" />
          <stop offset="1" stopColor="#c3adff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="minigame-v21-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity=".48" />
          <stop offset=".48" stopColor="white" stopOpacity=".42" />
          <stop offset="1" stopColor="white" stopOpacity=".83" />
        </linearGradient>
        <mask id="minigame-v21-depth">
          <rect width="1920" height="1080" fill="url(#minigame-v21-fade)" />
        </mask>
        <radialGradient id="minigame-v21-pool-cyan">
          <stop offset="0" stopColor="#ecffff" stopOpacity=".59" />
          <stop offset=".28" stopColor="#66dff9" stopOpacity=".35" />
          <stop offset="1" stopColor="#49aaff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="minigame-v21-pool-pink">
          <stop offset="0" stopColor="#ffdaef" stopOpacity=".53" />
          <stop offset=".3" stopColor="#fc76d8" stopOpacity=".37" />
          <stop offset="1" stopColor="#dc58ec" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="minigame-v21-lamp-cyan">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".11" stopColor="#e5fcff" stopOpacity=".88" />
          <stop offset=".46" stopColor="#6fe8ff" stopOpacity=".3" />
          <stop offset="1" stopColor="#75dfff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="minigame-v21-lamp-pink">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".12" stopColor="#fff0ff" stopOpacity=".9" />
          <stop offset=".47" stopColor="#ff88e4" stopOpacity=".34" />
          <stop offset="1" stopColor="#ff88e4" stopOpacity="0" />
        </radialGradient>
        {/* Cues share the same LED fixtures as the resting stage lights. */}
        <linearGradient id="minigame-v22-success" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#84ffe3" stopOpacity="0" />
          <stop offset=".5" stopColor="#a2fff0" stopOpacity=".5" />
          <stop offset="1" stopColor="#84ffe3" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="minigame-v22-success-pool">
          <stop offset="0" stopColor="#c8fff0" stopOpacity=".68" />
          <stop offset=".3" stopColor="#78ffc8" stopOpacity=".37" />
          <stop offset="1" stopColor="#45e6a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="minigame-v22-success-lens">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".21" stopColor="#bbffe7" stopOpacity=".82" />
          <stop offset="1" stopColor="#47ffa6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="minigame-v22-winner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe7a7" stopOpacity="0" />
          <stop offset=".5" stopColor="#ffdf93" stopOpacity=".42" />
          <stop offset="1" stopColor="#ffe7a7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="minigame-v22-winner-pool">
          <stop offset="0" stopColor="#ffefb7" stopOpacity=".58" />
          <stop offset=".4" stopColor="#ffca73" stopOpacity=".33" />
          <stop offset="1" stopColor="#ffb65a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="minigame-v22-winner-lens">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".25" stopColor="#fff3c4" stopOpacity=".76" />
          <stop offset="1" stopColor="#ffc673" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft ceiling washes, physically attached to the illustrated roof truss. */}
      <g mask="url(#minigame-v21-depth)">
        <g className="minigame-light-wash minigame-light-wash-left">
          <path d="M 320 81 L 157 765 L 636 765 Z" fill="url(#minigame-v21-cyan)" />
        </g>
        <g className="minigame-light-wash minigame-light-wash-center">
          <path d="M 960 81 L 728 745 L 1204 745 Z" fill="url(#minigame-v21-center)" />
        </g>
        <g className="minigame-light-wash minigame-light-wash-right">
          <path d="M 1600 81 L 1275 765 L 1780 765 Z" fill="url(#minigame-v21-pink)" />
        </g>
      </g>
      <ellipse cx="368" cy="778" rx="210" ry="28" fill="url(#minigame-v21-pool-cyan)" opacity=".48" />
      <ellipse cx="960" cy="776" rx="200" ry="26" fill="url(#minigame-v21-pool-cyan)" opacity=".32" />
      <ellipse cx="1530" cy="777" rx="212" ry="27" fill="url(#minigame-v21-pool-pink)" opacity=".48" />
      <g className="minigame-light-lamps">
        <circle cx="320" cy="81" r="32" fill="url(#minigame-v21-lamp-cyan)" />
        <circle cx="960" cy="81" r="27" fill="url(#minigame-v21-lamp-cyan)" opacity=".67" />
        <circle cx="1600" cy="81" r="32" fill="url(#minigame-v21-lamp-pink)" />
      </g>
      {/* Side truss beams illuminate the *audience* floor, not the question text. */}
      <g className="minigame-light-head minigame-light-head-left">
        <path d="M 211 413 L 492 974 L 885 974 Z" fill="url(#minigame-v21-cyan)" opacity=".84" />
        <ellipse cx="684" cy="965" rx="205" ry="50" fill="url(#minigame-v21-pool-cyan)" />
      </g>
      <g className="minigame-light-head minigame-light-head-right">
        <path d="M 1709 413 L 1048 974 L 1439 974 Z" fill="url(#minigame-v21-pink)" opacity=".84" />
        <ellipse cx="1250" cy="965" rx="204" ry="50" fill="url(#minigame-v21-pool-pink)" />
      </g>
      <circle cx="211" cy="413" r="38" fill="url(#minigame-v21-lamp-cyan)" />
      <circle cx="1709" cy="413" r="38" fill="url(#minigame-v21-lamp-pink)" />
      {/* When the correct answer is revealed, both side mounted moving heads
          converge on its physical audience lane. Source, beam and floor pool
          occupy the same SVG world coordinates (no disconnected VFX). */}
      {target ? (
        <g key={`correct-${state.correctOption}`} className="minigame-v22-event-cue minigame-v22-correct-cue" aria-hidden="true">
          <g className="minigame-v22-aim-left">
            <path d={`M ${leftSide.x} ${leftSide.y} L ${target.x - 128} ${target.y} L ${target.x + 128} ${target.y} Z`}
              fill="url(#minigame-v22-success)" />
            <ellipse cx={target.x} cy={target.y} rx="166" ry="54" fill="url(#minigame-v22-success-pool)" opacity=".58" />
            <circle cx={leftSide.x} cy={leftSide.y} r="37" fill="url(#minigame-v22-success-lens)" />
          </g>
          <g className="minigame-v22-aim-right">
            <path d={`M ${rightSide.x} ${rightSide.y} L ${target.x - 128} ${target.y} L ${target.x + 128} ${target.y} Z`}
              fill="url(#minigame-v22-success)" opacity=".72" />
            <ellipse cx={target.x} cy={target.y} rx="166" ry="54" fill="url(#minigame-v22-success-pool)" opacity=".5" />
            <circle cx={rightSide.x} cy={rightSide.y} r="37" fill="url(#minigame-v22-success-lens)" />
          </g>
        </g>
      ) : null}
      {/* Award moment: the real center-roof fixture lights the stage apron.
          The UI leader badge gets its own matching soft screen glow. */}
      {state.cue === 'winner' ? (
        <g className="minigame-v22-event-cue minigame-v22-winner-cue" aria-hidden="true">
          <path d={`M ${roofCenter.x} ${roofCenter.y} L 715 960 L 1205 960 Z`} fill="url(#minigame-v22-winner)" />
          <ellipse cx="960" cy="963" rx="248" ry="51" fill="url(#minigame-v22-winner-pool)" />
          <circle cx={roofCenter.x} cy={roofCenter.y} r="40" fill="url(#minigame-v22-winner-lens)" />
        </g>
      ) : null}
    </svg>
  );
}
