// Network wrapper around suggestUrl/parseSuggest with typed retryable errors.
import { suggestUrl, parseSuggest } from './suggest.js';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

export class SuggestError extends Error {
  constructor(errorType, message, { retryable = false } = {}) { super(message); this.errorType = errorType; this.retryable = retryable; }
}

export async function fetchSuggest(source, term, { gl = '', hl = 'en', fetchImpl = fetch } = {}) {
  const url = suggestUrl(source, term, { gl, hl });
  let res;
  try { res = await fetchImpl(url, { headers: { 'user-agent': UA } }); }
  catch (e) { throw new SuggestError('NETWORK', `${source} request failed: ${e.message}`, { retryable: true }); }
  if (res.status === 429 || res.status === 403) throw new SuggestError('BLOCKED', `${source} HTTP ${res.status}`, { retryable: true });
  if (!res.ok) throw new SuggestError('NETWORK', `${source} HTTP ${res.status}`, { retryable: true });
  return parseSuggest(source, await res.text());
}
