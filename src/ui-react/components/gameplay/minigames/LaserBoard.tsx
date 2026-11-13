import type { LaserChallengeSnapshot } from '../../../../game-core/minigames/minigame-types';

/** Shared optics board for live play and the two-page tutorial. */
export function LaserBoard({ plan, locale, compact = false }: {
  plan: LaserChallengeSnapshot;
  locale: 'ar' | 'en';
  compact?: boolean;
}) {
  const reveal = Boolean(plan.revealedPath?.length);
  const line = plan.revealedPath?.map(point => `${point.x},${point.y}`).join(' ') ?? '';
  return <div className={`laser-v75-board ${compact ? 'laser-v75-compact' : ''} ${reveal ? 'laser-v75-revealed' : ''}`}>
    <svg viewBox="0 0 890 436" className="laser-v75-svg" role="img"
      aria-label={locale === 'ar' ? 'لوحة تحدي الليزر: مدفع يسار ومرايات وأربع أهداف مرقمة يمين' : 'Laser puzzle: emitter at left, mirrors, four numbered targets at right'}>
      <defs>
        <pattern id="laserV75Grid" width="41" height="41" patternUnits="userSpaceOnUse">
          <path d="M41 0H0V41" fill="none" stroke="#5aa8db" strokeOpacity=".11" strokeWidth="1" />
        </pattern>
        <linearGradient id="laserV75Panel" x2="0" y2="1">
          <stop offset="0" stopColor="#10213f"/><stop offset="1" stopColor="#080f27"/>
        </linearGradient>
        <linearGradient id="laserV75Beam" x1="0" x2="1">
          <stop offset="0" stopColor="#ffe7a2"/><stop offset=".5" stopColor="#ff5e7e"/><stop offset="1" stopColor="#ff315f"/>
        </linearGradient>
        <filter id="laserV75Glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="14" y="12" width="862" height="412" rx="24" fill="url(#laserV75Panel)" stroke="#345480" strokeWidth="2"/>
      <rect x="24" y="22" width="842" height="392" rx="20" fill="url(#laserV75Grid)"/>
      <path d="M84 55H778" stroke="#183653" strokeWidth="2" strokeDasharray="3 13"/>
      <path d="M84 379H778" stroke="#183653" strokeWidth="2" strokeDasharray="3 13"/>
      <g className="laser-v75-targets">
        {plan.targetYs.map((y, index) => <g key={y} className={reveal && plan.correctTarget === index + 1 ? 'laser-v75-target-win' : ''} transform={`translate(809 ${y})`}>
          <rect x="-14" y="-28" width="62" height="56" rx="16"/>
          <circle cx="13" cy="0" r="17"/>
          <text x="13" y="6" textAnchor="middle">{index + 1}</text>
        </g>)}
      </g>
      <g className="laser-v75-emitter" transform={`translate(${plan.source.x} ${plan.source.y})`}>
        <circle r="34" className="laser-v75-source-ring"/>
        <rect x="-38" y="-18" width="55" height="36" rx="11"/>
        <rect x="8" y="-11" width="22" height="22" rx="5" className="laser-v75-nozzle"/>
        <circle cx="28" r="7" className="laser-v75-source-core"/>
      </g>
      <g className="laser-v75-mirrors">
        {plan.mirrors.map(m => <g key={m.id} transform={`translate(${m.x} ${m.y})`}>
          <circle r="25" className="laser-v75-mirror-base" />
          <path d={m.slash === '/' ? 'M-18 18L18 -18' : 'M-18 -18L18 18'} className="laser-v75-mirror-metal"/>
          <path d={m.slash === '/' ? 'M-15 15L15 -15' : 'M-15 -15L15 15'} className="laser-v75-mirror-glass" />
        </g>)}
      </g>
      {reveal && line ? <g key={line} className="laser-v75-beam-group" aria-hidden="true">
        <polyline points={line} pathLength={1000} className="laser-v75-beam-glow"/>
        <polyline points={line} pathLength={1000} className="laser-v75-beam"/>
        {plan.revealedPath?.slice(1,-1).map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="6" className="laser-v75-beam-spark"/>)}
      </g> : null}
    </svg>
    <div className="laser-v75-caption" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <span className="laser-v75-caption-dot"/>
      {reveal ? (locale === 'ar' ? 'مسار الليزر' : 'LASER PATH') : (locale === 'ar' ? 'تخيل اتجاه الانعكاسات' : 'TRACE THE REFLECTIONS')}
    </div>
  </div>;
}
