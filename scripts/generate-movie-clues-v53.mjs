#!/usr/bin/env node
/** V53: scan the user's local movie content. No web requests and no placeholder clues. */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const rootArgIndex = process.argv.indexOf('--root');
const root = rootArgIndex < 0 ? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  : path.resolve(process.argv[rootArgIndex + 1] ?? '.');
const bankFile = path.join(root, 'src/game-core/minigames/visual-guess/visual-guess-questions.json');
const bank = JSON.parse(await readFile(bankFile, 'utf8'));
const publicRoot = path.join(root, 'public/assets/game/runtime/minigames/visual-guess');
const target = path.join(root, 'src/game-core/minigames/visual-guess/movie-clues.generated.json');
const supportedImages = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const sortedIds = bank.movies.map(f => f.id).sort((a, b) => b.length - a.length);
const manifest = [];
// V54 metadata is opt-in; legacy TXT, images and {ar,en} JSON keep movie-name quiz mode.
const asI18n = value => typeof value === 'string' && value.trim()
  ? { ar: value.trim(), en: value.trim() }
  : value && typeof value === 'object' && !Array.isArray(value)
    && ((typeof value.ar === 'string' && value.ar.trim()) || (typeof value.en === 'string' && value.en.trim()))
    ? { ar: (value.ar || value.en).trim(), en: (value.en || value.ar).trim() }
    : null;
const normalize = value => value.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g, '')
  .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
function validAnswerSet(correct, wrong) {
  if (!correct || !Array.isArray(wrong) || wrong.length !== 3) return false;
  const values = [correct, ...wrong];
  if (values.some(value => !value || value.ar.length > 120 || value.en.length > 120)) return false;
  return new Set(values.map(value => normalize(value.ar))).size === 4
    && new Set(values.map(value => normalize(value.en))).size === 4;
}
// V62 playability rule: "Complete the line" is a memory/recognition challenge,
// not an unreadable or one-word trick question. The player gets a substantial
// lead-in and chooses from four plausible *phrases*.  Short or one-word lines
// remain usable as "Who said it?" or movie-identification clues unchanged.
const wordCount = text => (text || '').trim().split(/\s+/).filter(Boolean).length;
function playableCompletion(prompt, correct, wrong) {
  if (!validAnswerSet(correct, wrong)) return false;
  if (wordCount(prompt.ar) < 4 || wordCount(prompt.en) < 4) return false;
  return [correct, ...wrong].every(value => wordCount(value.ar) >= 2 && wordCount(value.en) >= 2);
}
const warnings = [];
const editorialSkips = [];
const matchFilm = (base) => sortedIds.find(id => base === id || base.startsWith(`${id}__`));
for (const [folder, kind] of [['Frame', 'frame'], ['Quotes', 'quote']]) {
  let files = [];
  try { files = (await readdir(path.join(publicRoot, folder), { withFileTypes: true }))
    .filter(entry => entry.isFile()).map(entry => entry.name).sort(); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  for (const name of files) {
    if (name.startsWith('.') || name.startsWith('_')) continue;
    const ext = path.extname(name).toLowerCase();
    const base = name.slice(0, -ext.length);
    if (!supportedImages.has(ext) && !(kind === 'quote' && (ext === '.txt' || ext === '.json'))) {
      warnings.push(`Unsupported file: ${folder}/${name}`); continue;
    }
    const movieId = matchFilm(base);
    if (!movieId) { warnings.push(`Cannot match a movie for ${folder}/${name} (use movie-id__01.ext)`); continue; }
    const filename = path.join(publicRoot, folder, name);
    if ((await stat(filename)).size === 0) { warnings.push(`Empty file: ${folder}/${name}`); continue; }
    if (supportedImages.has(ext)) {
      const bytes = await readFile(filename);
      const valid = ext === '.jpg' || ext === '.jpeg' ? bytes[0] === 0xff && bytes[1] === 0xd8
        : ext === '.png' ? bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
        : ext === '.avif' ? bytes.toString('ascii', 4, 8) === 'ftyp' && bytes.toString('ascii', 8, 12).startsWith('avif')
        : bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
      if (!valid) { warnings.push(`Invalid image: ${folder}/${name}`); continue; }
    }
    const clue = { id: `${kind}:${base}`, movieId, kind, asset: '', text: null };
    if (supportedImages.has(ext)) {
      clue.asset = `${folder}/${name}`;
    } else {
      const raw = (await readFile(filename, 'utf8')).trim();
      if (!raw || raw.length > (ext === '.json' ? 10000 : 3000)) { warnings.push(`Invalid quote length: ${folder}/${name}`); continue; }
      let text = { ar: raw, en: raw };
      if (ext === '.json') {
        let parsed;
        try { parsed = JSON.parse(raw); }
        catch { warnings.push(`Invalid quote JSON: ${folder}/${name}`); continue; }
        if (typeof parsed === 'string') text = asI18n(parsed);
        else if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          warnings.push(`Invalid quote JSON: ${folder}/${name}`); continue;
        } else {
          text = asI18n(parsed.text) ?? asI18n({ ar: parsed.ar, en: parsed.en });
          if (parsed.completion !== undefined) {
            const part = parsed.completion;
            const prompt = asI18n(part?.prompt);
            const answer = asI18n(part?.answer);
            const wrong = Array.isArray(part?.wrong) ? part.wrong.map(asI18n) : null;
            if (prompt && prompt.ar.length <= 500 && prompt.en.length <= 500
              && validAnswerSet(answer, wrong)
              && !normalize(prompt.ar).includes(normalize(answer.ar))
              && !normalize(prompt.en).includes(normalize(answer.en))) {
              if (playableCompletion(prompt, answer, wrong)) {
                clue.completion = { prompt, answer, wrong };
              } else {
                editorialSkips.push(`${folder}/${name}`);
              }
              if (!text) text = prompt;
            } else warnings.push(`Invalid completion (requires prompt, answer, 3 distinct wrong endings): ${folder}/${name}`);
          }
          if (parsed.speaker !== undefined) {
            const part = parsed.speaker;
            const answer = asI18n(part?.correct ?? part?.name);
            const wrong = Array.isArray(part?.wrong) ? part.wrong.map(asI18n) : null;
            const role = part?.role === 'character' ? 'character' : 'actor';
            if (text && validAnswerSet(answer, wrong)) clue.speaker = { answer, wrong, role };
            else warnings.push(`Invalid speaker (requires quote text, correct name, 3 distinct wrong names): ${folder}/${name}`);
          }
        }
      }
      if (!text || !text.ar || !text.en || text.ar.length > 500 || text.en.length > 500) {
        warnings.push(`Invalid quote text: ${folder}/${name}`); continue;
      }
      clue.text = text;
    }
    manifest.push(clue);
  }
}
if (new Set(manifest.map(x => x.id)).size !== manifest.length) throw Error('Duplicate clue filenames across Frame/Quotes');
await writeFile(target, JSON.stringify({ version: 1, clues: manifest }, null, 2) + '\n');
console.log(`V57 movie clues: ${bank.movies.filter(x=>x.asset?.startsWith('Posters/')).length} Posters, ${manifest.filter(x => x.kind === 'frame').length} Frames, ${manifest.filter(x => x.kind === 'quote').length} Quotes; ${bank.movies.length} distinct film titles.`);
if (editorialSkips.length) console.log(`[movie clues] ${editorialSkips.length} short/one-word completions not playable; original quotes remain available for other modes.`);
for (const warning of warnings) console.warn('[movie clues]', warning);
