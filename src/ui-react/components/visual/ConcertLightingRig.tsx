/**
 * Physically anchored, decorative stage lighting for the 1920 × 1080 lobby world.
 * Three stationary overhead washes illuminate the *platform* and two independent
 * moving-head fixtures on the side trusses paint the audience floor.
 *
 * Geometry lives in SVG world coordinates so the cones and their floor impacts
 * cannot drift apart when the Electron window is resized. Motion is CSS-only:
 * no requestAnimationFrame, React state, timers, or Twitch/gameplay dependencies.
 */
export function ConcertLightingRig() {
  return (
    <svg
      className="concert-lighting-rig"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ta7-light-cyan" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#52eaff" stopOpacity="0" />
          <stop offset="27%" stopColor="#52dfff" stopOpacity=".38" />
          <stop offset="50%" stopColor="#9eeeff" stopOpacity=".95" />
          <stop offset="75%" stopColor="#52cfff" stopOpacity=".38" />
          <stop offset="100%" stopColor="#52eaff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ta7-light-pink" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ff87e4" stopOpacity="0" />
          <stop offset="25%" stopColor="#e980ff" stopOpacity=".37" />
          <stop offset="50%" stopColor="#ffaeed" stopOpacity=".88" />
          <stop offset="76%" stopColor="#f36bf0" stopOpacity=".35" />
          <stop offset="100%" stopColor="#ff87e4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ta7-light-lavender" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#bcacff" stopOpacity="0" />
          <stop offset="50%" stopColor="#f4c5ff" stopOpacity=".75" />
          <stop offset="100%" stopColor="#bcacff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ta7-light-depth" x1="0" x2="0" y1="180" y2="735" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity=".12" />
          <stop offset=".26" stopColor="white" stopOpacity=".62" />
          <stop offset=".7" stopColor="white" stopOpacity=".56" />
          <stop offset="1" stopColor="white" stopOpacity=".37" />
        </linearGradient>
        <mask id="ta7-light-stage-depth" maskUnits="userSpaceOnUse" x="360" y="190" width="1200" height="560">
          <rect x="360" y="190" width="1200" height="560" fill="url(#ta7-light-depth)" />
        </mask>
        <linearGradient id="ta7-light-audience-depth" x1="0" x2="0" y1="425" y2="970" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity=".84" />
          <stop offset=".2" stopColor="white" stopOpacity=".82" />
          <stop offset=".76" stopColor="white" stopOpacity=".72" />
          <stop offset="1" stopColor="white" stopOpacity=".34" />
        </linearGradient>
        <mask id="ta7-light-audience-mask" maskUnits="userSpaceOnUse" x="280" y="405" width="1380" height="610">
          <rect x="280" y="405" width="1380" height="610" fill="url(#ta7-light-audience-depth)" />
        </mask>
        <radialGradient id="ta7-light-cyan-pool">
          <stop offset="0%" stopColor="#dcffff" stopOpacity=".66" />
          <stop offset="24%" stopColor="#70eeff" stopOpacity=".38" />
          <stop offset="65%" stopColor="#25b9ff" stopOpacity=".12" />
          <stop offset="100%" stopColor="#36d6ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ta7-light-pink-pool">
          <stop offset="0%" stopColor="#ffe5ff" stopOpacity=".57" />
          <stop offset="24%" stopColor="#ff83e9" stopOpacity=".38" />
          <stop offset="68%" stopColor="#bb53f5" stopOpacity=".12" />
          <stop offset="100%" stopColor="#ef6dfd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ta7-light-lavender-pool">
          <stop offset="0%" stopColor="#fff4ff" stopOpacity=".4" />
          <stop offset="48%" stopColor="#aa8aff" stopOpacity=".37" />
          <stop offset="100%" stopColor="#aa8aff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ta7-light-lamp-cyan">
          <stop offset="0%" stopColor="white" stopOpacity=".94" />
          <stop offset="13%" stopColor="#ccfaff" stopOpacity=".92" />
          <stop offset="42%" stopColor="#5dedff" stopOpacity=".36" />
          <stop offset="100%" stopColor="#5dedff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ta7-light-lamp-pink">
          <stop offset="0%" stopColor="white" stopOpacity=".95" />
          <stop offset="13%" stopColor="#ffe6ff" stopOpacity=".91" />
          <stop offset="44%" stopColor="#fa75ee" stopOpacity=".33" />
          <stop offset="100%" stopColor="#fa75ee" stopOpacity="0" />
        </radialGradient>
        <filter id="ta7-light-soften" x="-15%" y="-10%" width="130%" height="122%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Top-truss rig. Beams intentionally diffuse so LED interface remains readable. */}
      <g className="concert-overhead-beams" mask="url(#ta7-light-stage-depth)">
        <g className="concert-top-wash concert-top-wash-1">
          <path d="M 675 229 Q 667 420 566 710 L 826 710 Q 699 425 685 229 Z" fill="url(#ta7-light-cyan)" filter="url(#ta7-light-soften)" />
          <path d="M 679 230 L 630 710 L 763 710 Z" fill="url(#ta7-light-cyan)" opacity=".6" />
        </g>
        <g className="concert-top-wash concert-top-wash-2">
          <path d="M 912 229 Q 882 445 818 710 L 1040 710 Q 947 440 922 229 Z" fill="url(#ta7-light-lavender)" filter="url(#ta7-light-soften)" />
        </g>
        <g className="concert-top-wash concert-top-wash-3">
          <path d="M 1244 229 Q 1250 410 1130 710 L 1377 710 Q 1272 422 1255 229 Z" fill="url(#ta7-light-pink)" filter="url(#ta7-light-soften)" />
          <path d="M 1250 230 L 1184 710 L 1304 710 Z" fill="url(#ta7-light-pink)" opacity=".55" />
        </g>
      </g>
      <g className="concert-stage-light-landing">
        <ellipse cx="692" cy="732" rx="139" ry="22" fill="url(#ta7-light-cyan-pool)" opacity=".63" />
        <ellipse cx="923" cy="733" rx="115" ry="18" fill="url(#ta7-light-lavender-pool)" opacity=".5" />
        <ellipse cx="1254" cy="732" rx="140" ry="22" fill="url(#ta7-light-pink-pool)" opacity=".6" />
      </g>
      {/* Tiny bright lamp cores anchored to the truss, not fake floating lights. */}
      <g className="concert-top-lamp-cores">
        <circle cx="680" cy="229" r="29" fill="url(#ta7-light-lamp-cyan)" />
        <circle cx="917" cy="229" r="23" fill="url(#ta7-light-lamp-cyan)" opacity=".7" />
        <circle cx="1250" cy="229" r="29" fill="url(#ta7-light-lamp-pink)" />
      </g>

      {/* Two side-truss moving heads: one *connected* beam + ground footprint per head. */}
      <g className="concert-audience-moving-light concert-audience-moving-light-left">
        <g mask="url(#ta7-light-audience-mask)">
          <path d="M 490 426 Q 550 700 533 954 L 796 954 Q 639 673 499 426 Z" fill="url(#ta7-light-cyan)" filter="url(#ta7-light-soften)" />
          <path d="M 492 426 L 601 949 L 735 949 Z" fill="url(#ta7-light-cyan)" opacity=".66" />
        </g>
        <ellipse cx="664" cy="950" rx="157" ry="47" fill="url(#ta7-light-cyan-pool)" opacity="1" />
      </g>
      <g className="concert-audience-moving-light concert-audience-moving-light-right">
        <g mask="url(#ta7-light-audience-mask)">
          <path d="M 1418 426 Q 1355 691 1124 954 L 1395 954 Q 1472 685 1427 426 Z" fill="url(#ta7-light-pink)" filter="url(#ta7-light-soften)" />
          <path d="M 1422 426 L 1195 948 L 1337 948 Z" fill="url(#ta7-light-pink)" opacity=".66" />
        </g>
        <ellipse cx="1256" cy="950" rx="157" ry="47" fill="url(#ta7-light-pink-pool)" opacity="1" />
      </g>
      <g className="concert-side-lamp-cores">
        <circle cx="493" cy="426" r="40" fill="url(#ta7-light-lamp-cyan)" opacity=".9" />
        <circle cx="1422" cy="426" r="40" fill="url(#ta7-light-lamp-pink)" opacity=".88" />
      </g>
    </svg>
  );
}
