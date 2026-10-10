# keyword-ideas

Pull **real keyword ideas** straight from the autocomplete of **Google, YouTube, Amazon, and Bing**, from the command line. No API key.

```bash
npx keyword-ideas-cli "coffee maker" google deep
# → hundreds of the phrases people actually search, one per line

npx keyword-ideas-cli "standing desk" amazon alphabet --json | jq -r '.results[].suggestion'
```

Args: `<seed>` `[google|youtube|amazon|bing]` `[none|alphabet|questions|deep]` `[--json]`. `deep` mines the most ideas per seed; in `--json` mode each result records the expansion query that produced it.

## How it works

It hits each engine's public autocomplete endpoint and expands your seed (a–z, question words, prepositions) to surface long-tail phrases. No dependencies, MIT.

## Output contract

Identical across every tool in this family, so they chain cleanly from shell scripts and AI agents:

- **stdout** is data only: the plain format above, or one JSON envelope with `--json`
- **stderr** is diagnostics only: errors, warnings, summaries
- **exit codes**

| code | meaning |
|---|---|
| `0` | complete |
| `1` | usage error or invalid input |
| `2` | the upstream source failed. If some results arrived first they're still on stdout, and the envelope says `"complete": false` |
| `3` | the source answered, but had no data for this input |

With `--json`, success is one line on stdout:

```json
{"tool":"keyword-ideas","version":"2.0.0","input":{...},"complete":true,"count":42,"results":[...]}
```

and a failure is one line on stderr:

```json
{"tool":"keyword-ideas","version":"2.0.0","exitCode":2,"error":{"type":"BLOCKED","message":"HTTP 429","retryable":true}}
```

Branch on the exit code; log `error.type`: `USAGE`, `INVALID_INPUT` and `INVALID_REQUEST` (the source rejected the input) exit `1`; `NETWORK`, `BLOCKED` and `BAD_RESPONSE` (a captcha or consent page instead of data) exit `2` with `retryable` set; `NOT_FOUND` and `NO_DATA` exit `3`.

`--json --help` prints `{"tool","version","usage"}`. `--` ends option parsing, for inputs that start with a dash. Extra arguments are an error rather than silently dropped, so quote inputs that contain spaces.

## Bigger jobs

Need **hundreds of seeds across all four sources at once, as structured JSON you can schedule**? I run a hosted version on Apify, pay per seed, empty seeds free:

**→ [Keyword Research & Autocomplete Scraper](https://apify.com/beacondata/keyword-research-scraper)** · [ready-made n8n workflow → Google Sheets](https://inmanjeffrey89-cell.github.io/data-tools/n8n-workflows)

Pairs with the [Google Trends Scraper](https://apify.com/beacondata/google-trends-scraper) to validate demand once you've found ideas.

## The family

Five no-key data CLIs, one output contract:
[yt-transcript-cli](https://github.com/inmanjeffrey89-cell/yt-transcript-cli) ·
[keyword-ideas-cli](https://github.com/inmanjeffrey89-cell/keyword-ideas-cli) ·
[gtrends-cli](https://github.com/inmanjeffrey89-cell/gtrends-cli) ·
[play-reviews-cli](https://github.com/inmanjeffrey89-cell/play-reviews-cli) ·
[app-store-reviews-cli](https://github.com/inmanjeffrey89-cell/app-store-reviews-cli)

## Changelog

**2.0.0** — shared output contract across the family: data on stdout, diagnostics on stderr, exit codes `0/1/2/3`, and a `--json` envelope. Breaking: "no data" now exits `3` (was `2`), and network failures are reported instead of being swallowed. If only some autocomplete requests fail you get the partial results plus exit `2`; results are Unicode- and whitespace-normalized. Thanks to u/Tariq9977 on r/SideProject for the suggestion.

## License

MIT
