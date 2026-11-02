// Basic structural guards for the lightweight casual settings menu.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const component=readFileSync(path.join(root,'src/ui-react/components/settings/AppSettingsButton.tsx'),'utf8');
const css=readFileSync(path.join(root,'src/ui-react/styles/casual-settings-v10.css'),'utf8');
const main=readFileSync(path.join(root,'src/ui-react/main.tsx'),'utf8');
function requireText(haystack,needle){if(!haystack.includes(needle))throw new Error(`Missing settings marker: ${needle}`);}
for(const marker of [
  'settings-modal casual-settings','aria-modal="true"','casual-settings-volume-controls',
  'casual-settings-language','casual-settings-display','casual-settings-resolution',
  'casual-settings-stream','casual-settings-confirm','isActiveSession',
  'hasAnyChanges','setGlobalVolume','actions.setLanguage','api.setSettings(draftDisplaySettings)',
  'restoreFocusRef.current?.focus()','closeSettingsRef.current()', 'if (!isOpenRef.current)',
  'aria-pressed=','aria-valuetext=', 'aria-live="polite"',
]) requireText(component,marker);
requireText(main,"import './styles/casual-settings-v10.css'");
for(const marker of ['.settings-modal.casual-settings','.casual-settings-segmented button.is-active',':focus-visible','prefers-reduced-motion: reduce']) requireText(css,marker);
if(existsSync(path.join(root,'src/ui-react/styles/arcade-settings-v9.css'))) throw new Error('V9 arcade stylesheet should be removed');
console.log('Casual Settings v10 structure OK. Runtime verification still required.');
