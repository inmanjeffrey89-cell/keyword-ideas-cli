#!/usr/bin/env node
// keyword-ideas — pull real autocomplete keyword ideas from Google/YouTube/Amazon/Bing. No API key.
import { run, CliError } from './src/cli.js';
import { expansions } from './src/expand.js';
import { fetchSuggest } from './src/suggest-fetch.js';

const SOURCES = ['google', 'youtube', 'amazon', 'bing'];
const MODES = ['none', 'alphabet', 'questions', 'deep'];

const usage = `Usage: keyword-ideas "<seed>" [source] [mode] [--json]

  source  ${SOURCES.join(' | ')} (default: google)
  mode    none | alphabet (seed + a..z) | questions (who/what/how + seed) | deep (all) (default: alphabet)
  --json  print one JSON envelope; each result records the query that produced it

Exit: 0 ok · 1 bad input · 2 autocomplete requests failed · 3 no suggestions for this seed`;

// Same phrase, different bytes (extra spaces, NFD accents, case) must dedupe as one.
const clean = (s) => s.normalize('NFC').replace(/\s+/g, ' ').trim();
const key = (s) => clean(s).toLowerCase();

run({
  tool: 'keyword-ideas',
  usage,
  positionals: 3,
  async main(args) {
    const [rawSeed, rawSource = 'google', rawMode = 'alphabet'] = args.positional;
    const seed = rawSeed === undefined ? '' : clean(rawSeed);
    const source = rawSource.toLowerCase();
    const mode = rawMode.toLowerCase();
    if (!seed) throw new CliError('USAGE', 'missing "<seed>"');
    if (!SOURCES.includes(source)) throw new CliError('INVALID_INPUT', `unknown source "${source}" (use ${SOURCES.join(', ')})`);
    if (!MODES.includes(mode)) throw new CliError('INVALID_INPUT', `unknown mode "${mode}" (use ${MODES.join(', ')})`);

    const queries = expansions(seed, mode);
    const seen = new Set([key(seed)]);
    const results = [];
    let failed = 0;
    let lastErr = null;
    for (const query of queries) {
      try {
        for (const suggestion of await fetchSuggest(source, query)) {
          const k = key(suggestion);
          if (seen.has(k)) continue;
          seen.add(k);
          results.push({ suggestion: clean(suggestion), query });
        }
      } catch (e) {
        failed++;
        lastErr = e;
      }
    }
    const error = failed
      ? new CliError(lastErr.errorType || 'INTERNAL', `${failed} of ${queries.length} ${source} requests failed, last: ${lastErr.message}`, { retryable: !!lastErr.retryable })
      : null;
    return {
      input: { seed, source, mode },
      results,
      error,
      emptyMessage: `no ${source} suggestions for "${seed}"`,
      human: () => results.map((r) => r.suggestion).join('\n') + '\n',
    };
  },
});
