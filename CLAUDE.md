# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server (Japanese locale, port 6200)
yarn start

# Full production build (both ja + en locales) + postbuild script
yarn build

# Build single locale
ng build --configuration=ja
ng build --configuration=en

# Run unit tests
yarn test

# Build + serve SSG output locally
./ssg-local.sh

# Extract i18n messages (run after adding new $localize strings)
yarn ng extract-i18n

# Verify no untranslated messages remain
grep -n '<target/>' src/resources/texts/def/messages.en.xlf
```

**Package manager: Yarn only. Never use npm.**

## Architecture Overview

Angular 21 SSG (Static Site Generation) app hosted on S3. Two locales: **ja** (source) and **en**.

### Build pipeline

1. `ng build` — Angular outputs `dist/ng-devtools/browser/ja/` and `dist/ng-devtools/browser/en/`
2. `scripts/postbuild.mjs` runs automatically and:
   - Copies `404.html` to browser root and removes it from locale dirs
   - Copies favicons to browser root
   - Injects Google AdSense `<script>` into every `index.html`
   - Injects `canonical` + `hreflang` `<link>` tags into every `index.html`

When adding new postbuild logic, extend `scripts/postbuild.mjs`.

### i18n

- Source locale is **ja** — write all template text in Japanese
- English translations live in `src/resources/texts/def/messages.en.xlf`
- Use `$localize` with explicit custom IDs: `` $localize`:@@page.example.title:例のタイトル` ``
- After adding strings: run `yarn ng extract-i18n`, then add `<target>` tags in the `.xlf` file
- **English `<target>` must not be a literal translation of the Japanese `<source>`.** Write en content as independent, English-search-intent-oriented copy (different sentence order, examples, or added/omitted detail is expected) rather than a sentence-by-sentence rendering. See `docs/products/en-content-quality/policy.md` for the full policy and detailed requirements.

### Key directories

- `src/app/pages/` — one folder per tool/page (route + component + help component)
- `src/app/components/` — shared UI components
- `src/app/core/services/` — platform-safe services (e.g. `PlatformService`)
- `src/app/services/` — app-level services (help drawer, cookie consent, etc.)
- `src/resources/menu/def/menu-def.ts` — single source of truth for all menu items and descriptions
- `public/` — static assets copied as-is to every locale output dir

### Angular conventions (strictly enforced)

- **Standalone components only** — no NgModules
- **`inject()`** for DI — never constructor injection
- **Signals** for state: `signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()`, `linkedSignal()`
- **Built-in control flow** in templates: `@if`, `@for`, `@switch`, `@defer` — never `*ngIf`/`*ngFor`
- **SCSS + Angular Material M3**: use CSS variables `--mat-sys-...` — never hardcoded colors
- `PlatformService` must wrap all `window`/`localStorage` access (SSG runs in Node.js)

### Adding a new tool page (mandatory checklist)

1. Create page component + routes under `src/app/pages/tool-name-page/`
2. Create help component at `src/app/pages/tool-name-page/tool-name-help/` (HTML-only, ≥500 ja chars, 4 sections: 概要・使い方・仕様/用語解説・ユースケース)
3. Wire help component into the tool page via `HelpDrawerService` and `<ng-template #helpContent>`
4. Add a `<section>` in `guide-page.component.html` that includes the help component
5. Add a `<li>` entry in `src/app/components/sitemap/sitemap.component.html`
6. Register the route in `src/app/app.routes.ts`
7. Add menu item to `src/resources/menu/def/menu-def.ts`
8. Run `yarn ng extract-i18n` and add English translations to `messages.en.xlf` — write them as independent en content, not literal translations of the ja source (see `docs/products/en-content-quality/policy.md`)

### Commit message format

```
refs #{issue-number} {description}
```

Use the active issue number from context. Never guess from the branch name alone.
