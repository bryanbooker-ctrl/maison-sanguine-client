# Site languages

- `en.json` lists every English text of the site (header, footer, pages, sub-domains, MS Account). It is generated, do not edit it by hand.
- `fr.json` holds the French text for the same keys. Edit the values freely; a missing or empty value falls back to English.
- `extra.en.json` adds short texts the generator cannot detect on its own (single words built by scripts, and `context` entries written `previous text || text` when a word must be translated differently after a given title line).

## After changing an English text

```
node scripts/i18n-extract.mjs
```

The command updates `en.json` and reports how many texts are translated in each language. Translate the new keys in `fr.json`.

## Adding a language

1. Copy `fr.json` to `<code>.json` (for example `zh.json`) and translate the values.
2. Add the code to `LOCALES` in `lib/locales.ts`.
3. Add the import line in `lib/messages.ts`.

URLs become `/<code>/...` and the language appears in the footer and MS Archives language menus automatically.
