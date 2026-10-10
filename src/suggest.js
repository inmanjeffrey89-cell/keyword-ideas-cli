// Fetch + parse autocomplete suggestions from open endpoints (google, youtube, amazon, bing).

export function suggestUrl(source, term, { gl = '', hl = 'en' } = {}) {
  const q = encodeURIComponent(term);
  switch (source) {
    case 'google':
      return `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}${gl ? `&gl=${gl}` : ''}&q=${q}`;
    case 'youtube':
      return `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=${hl}&q=${q}`;
    case 'amazon':
      return `https://completion.amazon.com/api/2017/suggestions?alias=aps&mid=ATVPDKIKX0DER&prefix=${q}`;
    case 'bing':
      return `https://api.bing.com/osjson.aspx?query=${q}`;
    default:
      throw new Error(`unknown source: ${source}`);
  }
}

// Returns the suggestions, [] when the source answered with none, or null when the body isn't a
// suggestion response at all (a captcha, consent or error page), so callers can tell them apart.
export function parseSuggest(source, body) {
  try {
    if (source === 'amazon') {
      const j = JSON.parse(body);
      if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
      return (j.suggestions || [])
        .filter((s) => (s.type ? s.type === 'KEYWORD' : true) && s.value)
        .map((s) => s.value);
    }
    if (source === 'youtube') {
      const m = body.match(/\((\[[\s\S]*\])\)/);
      if (!m) return null;
      const arr = JSON.parse(m[1]);
      return (arr[1] || []).map((row) => (Array.isArray(row) ? row[0] : row)).filter(Boolean);
    }
    // google (firefox) + bing (osjson): ["query", ["s1","s2",...]]
    const arr = JSON.parse(body);
    if (!Array.isArray(arr)) return null;
    return (arr[1] || []).filter((s) => typeof s === 'string');
  } catch {
    return null;
  }
}
