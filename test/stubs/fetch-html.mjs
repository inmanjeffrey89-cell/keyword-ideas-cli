// 200 with a consent/captcha page instead of suggestions.
globalThis.fetch = async () => new Response('<!doctype html><title>Before you continue</title>', { status: 200 });
