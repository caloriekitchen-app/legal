# CalorieKitchen — Legal

Public Privacy Policy & Terms pages, hosted on GitHub Pages, linked from Google Play Console and fetched directly by the CalorieKitchen app at runtime (see `src/lib/legalContent.ts` in the [main app repo](https://github.com/caloriekitchen-app/CalorieCounter-2)).

## Source of truth

`privacy.json` and `terms.json` are what actually matters — both the live web pages and the in-app Terms/Privacy screens are generated from them. Each has a `version` field; bumping it is what triggers existing users to be re-prompted to accept, **without needing an app store release**.

To make a change:
1. Edit `privacy.json` and/or `terms.json`
2. Bump the `version` field on whichever one changed
3. Commit and push to `main`

That's it — a GitHub Action (`.github/workflows/build.yml`) regenerates `privacy-policy.html`/`terms.html` from the JSON automatically and commits them back. No local build step needed.

## URLs

- https://caloriekitchen-app.github.io/legal/privacy-policy.html
- https://caloriekitchen-app.github.io/legal/terms.html
- https://caloriekitchen-app.github.io/legal/privacy.json — fetched by the app
- https://caloriekitchen-app.github.io/legal/terms.json — fetched by the app

## Local preview

```bash
node generate.mjs
```
