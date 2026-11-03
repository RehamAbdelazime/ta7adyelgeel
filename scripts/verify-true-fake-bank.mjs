#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const questions = JSON.parse(readFileSync(path.join(root, 'src/game-core/minigames/true-fake/true-fake-questions.json'), 'utf8'));
const ids = new Set();
const categories = new Set(['science','animals','space','history','geography','games','food','sports','internet','language','weird','horror']);
const counts = { easy: 0, medium: 0, hard: 0 };
const arabic = /[\u0600-\u06FF]/;
assert.equal(questions.length, 500, 'All 500 original questions must survive the content extraction');
for (const [index, q] of questions.entries()) {
  assert(typeof q.id === 'string' && q.id && !ids.has(q.id), `Unique question ID at ${index}`);
  ids.add(q.id);
  assert(['true', 'fake'].includes(q.answer), q.id);
  assert(['easy','medium','hard'].includes(q.difficulty), q.id);
  assert(categories.has(q.category), q.id);
  assert(typeof q.similarityGroup === 'string' && q.similarityGroup, q.id);
  assert(Array.isArray(q.tags) && q.tags.every(tag => typeof tag === 'string'), q.id);
  assert(typeof q.statement?.en === 'string' && q.statement.en && !arabic.test(q.statement.en), `${q.id}: English must not contain Arabic text`);
  assert(typeof q.statement?.ar === 'string' && arabic.test(q.statement.ar), `${q.id}: Arabic content missing`);
  counts[q.difficulty]++;
}
console.log(`True/Fake data PASS: ${questions.length} unique bilingual questions, ${JSON.stringify(counts)}.`);
