#!/usr/bin/env node
// keyword-ideas — pull real autocomplete keyword ideas from Google/YouTube/Amazon/Bing. No API key.
import { expansions } from './src/expand.js';
import { fetchSuggest } from './src/suggest-fetch.js';
const seed = process.argv[2];
const source = process.argv[3] || 'google';
const mode = process.argv[4] || 'alphabet';
if (!seed) { console.error('Usage: node keyword-ideas.mjs "<seed>" [google|youtube|amazon|bing] [none|alphabet|questions|deep]'); process.exit(1); }
const found = new Set();
for (const q of expansions(seed, mode)) {
  try { for (const s of await fetchSuggest(source, q)) if (s.toLowerCase() !== seed.toLowerCase()) found.add(s); } catch {}
}
if (!found.size) { console.error('No suggestions.'); process.exit(2); }
console.log([...found].join('\n'));
