#!/usr/bin/env node
/** Offline, user-labeled Guess the Star gallery.
 * A person has one answer identity, but may have many DISTINCT eye/full-photo
 * variants. Labels come only from user-provided filenames or edited manifest.
 * Never infer a person's identity by interpreting their photograph.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'src/game-core/minigames/visual-guess/star-uploads-v66.json');
const bankPath = path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json');
const rootMedia = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
const config = JSON.parse(await readFile(configPath, 'utf8'));
if (config.schemaVersion !== 1 || !Array.isArray(config.photos)) throw Error('Invalid star photo manifest');
const ids = new Set();
const identities = new Map();
let pending = 0;
for (const photo of config.photos) {
  if (!/^star-uploaded-\d{2,}$/.test(photo.id) || ids.has(photo.id)) throw Error(`Unsafe or repeated star photo id: ${photo.id}`);
  ids.add(photo.id);
  for (const rel of [photo.photo, photo.eyes]) {
    if (!/^Stars\/(Full|Eyes)\/uploaded-\d{2,}\.jpg$/.test(rel)) throw Error(`Unsafe star image path: ${rel}`);
    const filename = path.join(rootMedia, rel);
    const info = await stat(filename).catch(() => null);
    if (!info?.isFile() || info.size < 1500) throw Error(`Missing star image: ${rel}`);
    const bytes = await readFile(filename);
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.at(-1) !== 0xd9) throw Error(`Invalid local JPEG: ${rel}`);
  }
  const ar = (photo.name?.ar ?? '').trim(), en = (photo.name?.en ?? '').trim();
  if (!ar && !en) { pending++; continue; }
  const personKey = (photo.personKey ?? '').trim();
  if (!/^[a-z0-9][a-z0-9-]{1,100}$/.test(personKey) || !ar || !en ||
    !['actors','singers','athletes','public-figures'].includes(photo.category) ||
    !['easy','medium','hard'].includes(photo.difficulty)) {
    throw Error(`Incomplete person label for ${photo.id}: fill name.ar, name.en, personKey, category and difficulty`);
  }
  const variant = { id: photo.id, asset: photo.photo, eyesAsset: photo.eyes };
  const group = identities.get(personKey);
  if (group) {
    if (group.name.ar !== ar || group.name.en !== en || group.category !== photo.category || group.difficulty !== photo.difficulty)
      throw Error(`Inconsistent names/category/difficulty for ${personKey} (${photo.originalFilename}). Variants of the SAME person must have identical labels.`);
    group.photoVariants.push(variant);
  } else {
    identities.set(personKey, {
      id: photo.id, personKey, name: { ar, en }, mode: 'eyes', difficulty: photo.difficulty,
      category: photo.category, asset: photo.photo, eyesAsset: photo.eyes,
      photoVariants: [variant], imageUrl: '', focus: { x: 50, y: 50 },
      mediaType: 'real_photo_user_supplied',
      mediaApproval: 'user_supplied_local_rights_unverified',
      attribution: { source: 'User supplied: named star photos (grouped by personKey)', license: 'Distribution rights not verified' },
    });
  }
}
const playable = [...identities.values()];
if (playable.length < 4) throw Error(`Need 4 DIFFERENT people for four choices (currently ${playable.length})`);
for (const difficulty of ['easy','medium','hard']) {
  if (!playable.some(item => item.difficulty === difficulty)) throw Error(`Missing ${difficulty} star question`);
}
const normalizedNameOwners = new Map();
for (const item of playable) {
  const key = item.name.ar.normalize('NFKC').toLocaleLowerCase('ar');
  if (normalizedNameOwners.has(key)) throw Error(`Different personKey entries share answer ${item.name.ar}. Merge aliases under ONE personKey.`);
  normalizedNameOwners.set(key, item.personKey);
}
const bank = JSON.parse(await readFile(bankPath, 'utf8'));
bank.stars = playable;
const serialized = JSON.stringify(bank, null, 2) + '\n';
if ((await readFile(bankPath, 'utf8')) !== serialized) await writeFile(bankPath, serialized, 'utf8');
const repeats = playable.filter(item => item.photoVariants.length > 1);
console.log(`[V67] Local Guess Star: ${playable.length} unique people, ${config.photos.length - pending} named photos, ${repeats.length} people with alternate portraits, ${pending} awaiting filename confirmation; 0 remote images.`);
