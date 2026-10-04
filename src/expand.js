// Build expansion queries from a seed to pull far more suggestions than the bare term.
const AZ = 'abcdefghijklmnopqrstuvwxyz'.split('');
const QUESTIONS = ['who', 'what', 'why', 'where', 'when', 'how', 'which', 'are', 'can', 'will', 'does'];
const PREPS = ['for', 'with', 'without', 'vs', 'near', 'like', 'to', 'from'];

export function expansions(seed, mode = 'none') {
  const s = seed.trim();
  const out = [s];
  const add = (arr, fn) => arr.forEach((x) => out.push(fn(x)));
  if (mode === 'alphabet' || mode === 'deep') add(AZ, (c) => `${s} ${c}`);
  if (mode === 'questions' || mode === 'deep') add(QUESTIONS, (q) => `${q} ${s}`);
  if (mode === 'deep') add(PREPS, (p) => `${s} ${p}`);
  return [...new Set(out)];
}
