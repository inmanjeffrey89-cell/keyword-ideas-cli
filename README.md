# keyword-ideas

Pull **real keyword ideas** straight from the autocomplete of **Google, YouTube, Amazon, and Bing** — from the command line, no API key.

```bash
node keyword-ideas.mjs "coffee maker" google deep
# → hundreds of the phrases people actually search
```

Args: `<seed>` `[google|youtube|amazon|bing]` `[none|alphabet|questions|deep]`. `deep` mines the most ideas per seed.

## How it works

It hits each engine's public autocomplete endpoint and expands your seed (a–z, question words, prepositions) to surface long-tail phrases. No dependencies, MIT.

## Bigger jobs

Need this for **hundreds of seeds, across all four sources at once, as structured JSON you can schedule**? I run a hosted version on Apify that does exactly that, pay-per-seed, empty seeds free:

**→ [Keyword Research & Autocomplete Scraper](https://apify.com/beacondata/keyword-research-scraper)**

Pairs with the [Google Trends Scraper](https://apify.com/beacondata/google-trends-scraper) to validate demand once you've found ideas.

## License
MIT.
