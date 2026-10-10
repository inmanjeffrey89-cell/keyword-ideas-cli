import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cli, BIN, stubUrl } from './cli.mjs';


test('every request failing is an upstream failure (exit 2), not "no suggestions"', () => {
  const r = cli(['coffee', 'google', 'alphabet'], { preload: 'fetch-fail' });
  assert.equal(r.status, 2);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /27 of 27 google requests failed/);
});

test('some requests failing: partial results on stdout, complete:false, exit 2', () => {
  const r = cli(['coffee', 'google', 'alphabet', '--json'], { preload: 'fetch-suggest-flaky' });
  assert.equal(r.status, 2);
  const env = JSON.parse(r.stdout);
  assert.equal(env.complete, false);
  assert.ok(env.count > 0);
  assert.equal(JSON.parse(r.stderr).error.type, 'NETWORK');
});

test('results never repeat the seed or each other, and record their query', () => {
  const r = cli(['coffee', 'google', 'alphabet', '--json'], { preload: 'fetch-suggest-ok' });
  assert.equal(r.status, 0, r.stderr);
  const env = JSON.parse(r.stdout);
  const all = env.results.map((x) => x.suggestion.toLowerCase());
  assert.equal(new Set(all).size, all.length);
  assert.ok(!all.includes('coffee'));
  assert.ok(env.results.every((x) => typeof x.query === 'string'));
});

test('a reader closing the pipe early is not an error', () => {
  const cmd = `set -o pipefail; "${process.execPath}" --import "${stubUrl('fetch-suggest-ok')}" "${BIN}" coffee google deep | head -n 1`;
  const r = spawnSync('/bin/bash', ['-c', cmd], { encoding: 'utf8', timeout: 60_000 });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim().split('\n').length, 1);
  assert.doesNotMatch(r.stderr, /EPIPE|Error/);
});
