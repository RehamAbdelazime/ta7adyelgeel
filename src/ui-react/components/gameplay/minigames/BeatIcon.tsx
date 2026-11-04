/** A tiny vector icon family shared by the target and the moving symbols.
 * Pure inline SVG: sharp at 720p/1080p, no OS-dependent emoji rendering,
 * no remote images, one dark outline and one saturated game-show highlight. */
import type { CSSProperties, ReactNode } from 'react';

type BeatIconName = 'note' | 'double-note' | 'wave' | 'mic' | 'headphones' | 'speaker' | 'disc';

const solid: CSSProperties = { fill: 'currentColor', stroke: '#091430', strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round' };
const outline: CSSProperties = { fill: 'none', stroke: 'currentColor', strokeWidth: 5.2, strokeLinejoin: 'round', strokeLinecap: 'round' };

const art: Record<BeatIconName, ReactNode> = {
  note: <>
    <path d="M37 17v34c-3 8-19 11-24 5-7-8 3-17 16-16V20l23-8v10z" style={solid} />
    <path d="M30 24l22-7" style={{...outline, strokeWidth:3}} />
  </>,
  'double-note': <>
    <path d="M20 21l33-9v34c0 8-18 13-22 5-5-9 10-15 16-13V23L27 29v25c-3 8-18 11-22 3-6-10 7-16 15-14z" style={solid} />
    <path d="M23 29l27-7" style={{...outline,strokeWidth:3}} />
  </>,
  wave: <>
    <path d="M5 35h10l6-14 8 27 8-38 8 31 5-11h9" style={{fill:'none',stroke:'#091430',strokeWidth:10,strokeLinecap:'round',strokeLinejoin:'round'}}/>
    <path d="M5 35h10l6-14 8 27 8-38 8 31 5-11h9" style={outline}/>
  </>,
  mic: <>
    <rect x="25" y="8" width="20" height="31" rx="10" style={solid}/>
    <path d="M18 32a17 17 0 0034 0M35 50v7m-9 0h18" style={{fill:'none',stroke:'#091430',strokeWidth:9,strokeLinecap:'round'}}/>
    <path d="M18 32a17 17 0 0034 0M35 50v7m-9 0h18" style={outline}/>
  </>,
  headphones: <>
    <path d="M12 38v-9a23 23 0 0146 0v9" style={{fill:'none',stroke:'#091430',strokeWidth:13,strokeLinecap:'round'}}/>
    <path d="M12 38v-9a23 23 0 0146 0v9" style={{...outline,strokeWidth:7}}/>
    <rect x="8" y="33" width="14" height="22" rx="6" style={solid}/>
    <rect x="48" y="33" width="14" height="22" rx="6" style={solid}/>
  </>,
  speaker: <>
    <path d="M9 26h13l16-13v45L22 45H9z" style={solid} />
    <path d="M45 25a14 14 0 010 20M51 18a23 23 0 010 34" style={{fill:'none',stroke:'#091430',strokeWidth:9,strokeLinecap:'round'}}/>
    <path d="M45 25a14 14 0 010 20M51 18a23 23 0 010 34" style={outline}/>
  </>,
  disc: <>
    <circle cx="35" cy="35" r="28" style={solid}/>
    <circle cx="35" cy="35" r="16" style={{fill:'none',stroke:'#091430',strokeWidth:4,opacity:.55}}/>
    <circle cx="35" cy="35" r="7" style={{fill:'#091430',stroke:'rgba(255,255,255,.7)',strokeWidth:2}}/>
    <path d="M14 19a26 26 0 0125-11" style={{fill:'none',stroke:'rgba(255,255,255,.5)',strokeWidth:4,strokeLinecap:'round'}}/>
  </>,
};

export function BeatIcon({ icon, className = '' }: { icon: string; className?: string }) {
  const artNode = art[icon as BeatIconName] ?? art.note;
  return <svg className={className} viewBox="0 0 70 70" width="1em" height="1em" focusable="false" aria-hidden="true" style={{display:'block',width:'1em',height:'1em',overflow:'visible'}}>
    {artNode}
  </svg>;
}
