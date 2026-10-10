// Test preload: every other autocomplete call fails, the rest answer normally.
let n = 0;
globalThis.fetch = async (url) => {
  if (n++ % 2) throw new TypeError('fetch failed (stubbed flaky)');
  const q = new URL(url).searchParams.get('q') ?? '';
  return new Response(JSON.stringify([q, [`${q} one`, `${q} two`]]), { status: 200 });
};
