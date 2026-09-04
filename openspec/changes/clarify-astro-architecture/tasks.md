## 1. Architecture contract

- [x] 1.1 Update `docs/architecture.md` with route, layout, component, locale-flow, and page-first i18n responsibilities; verify the documented tree matches the intended source tree.

## 2. Explicit locale flow

- [x] 2.1 Make `locale` a required typed prop of `SiteHeader.astro` and `SiteFooter.astro`, pass it from `LocalizedLayout.astro`, and verify generated navigation URLs and `aria-current` values remain unchanged.

## 3. Page-first localization

- [x] 3.1 Add `src/i18n/config.ts` and split site-wide localized copy into `src/i18n/site/zh.ts` and `en.ts`; verify both locale variants satisfy one shared TypeScript shape.
- [x] 3.2 Split Home copy and its complete interactive-demo content into `src/i18n/home/zh.ts` and `en.ts`; verify the serialized demo records and visible Home strings remain complete in both languages.
- [x] 3.3 Split Download and Changelog copy into their page-owned `src/i18n/<page>/zh.ts` and `en.ts` modules; verify both localized routes retain their metadata and visible strings.
- [x] 3.4 Move the two privacy bodies to `src/i18n/privacy/zh.md` and `en.md`, keep typed privacy metadata alongside the locale sources, and verify both privacy routes render the same semantic content without raw HTML strings.
- [x] 3.5 Remove obsolete aggregate i18n and demo modules after all imports migrate; verify no source import references the removed paths.

## 4. Home composition

- [x] 4.1 Move the complete Home markup, including the interactive showcase, into `src/pages/[lang]/index.astro` and remove `HomePage.astro`; verify DOM ids, script ordering, localized content, and interactions remain unchanged.

## 5. Validation

- [x] 5.1 Run the repository test suite and `pnpm build`; verify all localized routes build without errors.
- [x] 5.2 Verify the uncompressed production output remains below 500 KB and inspect generated locale navigation, canonical, hreflang, Home demo, and privacy markup.
- [x] 5.3 Run Lighthouse against the production preview when the environment supports it and verify Performance and Accessibility are both above 90; otherwise record the exact environmental blocker and leave the task incomplete.
