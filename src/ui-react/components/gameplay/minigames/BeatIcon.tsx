/** One shared, production artwork component for Count the Beat.
 * The SAME normalized PNG is used in the target bar, timed beats,
 * reveal, and two-page tutorial. No duplicate SVG artwork or CSS drawing.
 */
export type BeatIconName = 'note' | 'double-note' | 'wave' | 'mic' | 'headphones' | 'speaker' | 'disc';

// The base-aware path is important: packaged Electron runs the renderer from
// file:// with Vite's relative base, not from a web server at '/'.
const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/game/runtime/minigames/count-the-beat/icons/`;

const ICON_FILE: Record<BeatIconName, string> = {
  note: 'beat-note.png',
  'double-note': 'beat-double-note.png',
  wave: 'beat-wave.png',
  mic: 'beat-mic.png',
  headphones: 'beat-headphones.png',
  speaker: 'beat-speaker.png',
  disc: 'beat-disc.png',
};

const ICON_URL: Record<BeatIconName, string> = {
  note: `${ASSET_ROOT}${ICON_FILE.note}`,
  'double-note': `${ASSET_ROOT}${ICON_FILE['double-note']}`,
  wave: `${ASSET_ROOT}${ICON_FILE.wave}`,
  mic: `${ASSET_ROOT}${ICON_FILE.mic}`,
  headphones: `${ASSET_ROOT}${ICON_FILE.headphones}`,
  speaker: `${ASSET_ROOT}${ICON_FILE.speaker}`,
  disc: `${ASSET_ROOT}${ICON_FILE.disc}`,
};

// Icon changes can happen within one beat (< 1 second on hard): preload every
// asset eagerly once, even if the tutorial has displayed only the target note.
// Keep the elements alive to retain decoded images and avoid first-flash stalls.
const cachedBeatImages: HTMLImageElement[] = [];
if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
  for (const url of Object.values(ICON_URL)) {
    const image = new Image();
    image.src = url;
    if (typeof image.decode === 'function') void image.decode().catch(() => undefined);
    cachedBeatImages.push(image);
  }
}

export function BeatIcon({ icon, className = '' }: { icon: string; className?: string }) {
  const safeIcon = Object.prototype.hasOwnProperty.call(ICON_URL, icon) ? icon as BeatIconName : 'note';
  return <img
    className={className}
    src={ICON_URL[safeIcon]}
    draggable={false}
    alt=""
    aria-hidden="true"
    decoding="sync"
    style={{ display: 'block', width: '1em', height: '1em', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
  />;
}
