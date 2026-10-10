// Echoes the seed back in a different spacing and Unicode form, plus one real idea.
globalThis.fetch = async (url) => {
  const q = new URL(url).searchParams.get('q') ?? '';
  return new Response(JSON.stringify([q, ['Coffee  Maker', 'café latte', 'coffee maker grinder']]), { status: 200 });
};
