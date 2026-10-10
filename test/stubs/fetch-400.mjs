// The source rejects the query itself (e.g. a seed that is far too long).
globalThis.fetch = async () => new Response('Bad Request', { status: 400 });
