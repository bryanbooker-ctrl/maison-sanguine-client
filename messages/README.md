# Site languages

- `en.json` lists every English text of the site (header, footer, pages, sub-domains, MS Account). It is generated, do not edit it by hand.
- `fr.json` holds the French text for the same keys. Edit the values freely; a missing or empty value falls back to English.
- `extra.en.json` adds short texts the generator cannot detect on its own (single words built by scripts, and `context` entries written `previous text || text` when a word must be translated differently after a given title line).

## After changing an English text

```
node scripts/i18n-extract.mjs
```

The command updates `en.json` and reports how many texts are translated in each language. Translate the new keys in `fr.json`.

## Locations and languages

Locations, their currency and the languages offered in each are listed in `lib/locations.ts`.
URLs are `/<country>/<language>/...` (for example `/fr/fr/home`, `/jp/ja/home`, `/tw/zh-hant/home`) and `/en/...` for International.
A language offered in a location without its file here is shown in English until the file exists.
The choice is made in the Location / Language window, opened from the footer and from the MS Archives header.

## Adding a language

1. Copy `fr.json` to `<code>.json` (for example `de.json`, `ja.json`, `zh-hant.json`) and translate the values.
2. Add the code to `LOCALES` in `lib/locales.ts`.
3. Add the import line in `lib/messages.ts`.

Nothing else changes: the URLs already exist, and the language is picked by default in its locations as soon as it is listed in `LOCALES`.

## Prices per currency

The currency of each location is used at checkout (for International, the currency of the country chosen in the window, for example AED for Dubai) when the edition has a price for it in the `prices` column (see `supabase-editions-prices.sql`). Without it, the price in EUR is used.
