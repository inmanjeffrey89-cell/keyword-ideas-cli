// Test preload: every autocomplete call answers with 200 suggestions in Google's firefox format.
globalThis.fetch = async (url) => {
  const q = new URL(url).searchParams.get('q') ?? '';
  return new Response(JSON.stringify([q, Array.from({ length: 200 }, (_, i) => `${q} idea ${i}`)]), { status: 200 });
};
