import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cli } from './cli.mjs';

test('a captcha/consent page is an upstream failure (exit 2), not "no suggestions"', () => {
  const r = cli(['coffee', 'google', 'none', '--json'], { preload: 'fetch-html' });
  assert.equal(r.status, 2, r.stderr);
  assert.equal(JSON.parse(r.stderr).error.type, 'BAD_RESPONSE');
  assert.equal(JSON.parse(r.stderr).error.retryable, true);
});

test('the source rejecting the query is invalid input (exit 1), not retryable', () => {
  const r = cli(['x'.repeat(5000), 'google', 'none', '--json'], { preload: 'fetch-400' });
  assert.equal(r.status, 1, r.stderr);
  const e = JSON.parse(r.stderr).error;
  assert.equal(e.type, 'INVALID_REQUEST');
  assert.equal(e.retryable, false);
});

test('the seed never comes back as a result, whatever its spacing, case or Unicode form', () => {
  const r = cli(['coffee   maker', 'google', 'none', '--json'], { preload: 'fetch-seed-echo' });
  assert.equal(r.status, 0, r.stderr);
  const env = JSON.parse(r.stdout);
  assert.equal(env.input.seed, 'coffee maker');
  assert.deepEqual(env.results.map((x) => x.suggestion), ['café latte', 'coffee maker grinder']);
});

test('source and mode names are case-insensitive', () => {
  const r = cli(['coffee', 'Google', 'NONE', '--json'], { preload: 'fetch-seed-echo' });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(r.stdout).input, { seed: 'coffee', source: 'google', mode: 'none' });
});

test('a seed starting with a dash passes after --', () => {
  const r = cli(['--json', '--', '-ism', 'google', 'none'], { preload: 'fetch-seed-echo' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).input.seed, '-ism');
});
