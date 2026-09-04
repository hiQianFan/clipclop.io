## 1. Locale foundation

- [x] 1.1 Add typed locale definitions and fixed page content under `src/i18n/`, verified by the TypeScript-aware Astro build.
- [x] 1.2 Add a shared localized document layout that renders canonical, hreflang, social metadata, theme bootstrap, header, and footer from one source, verified in generated HTML.

## 2. Shared page generation

- [x] 2.1 Replace duplicate locale home pages with `src/pages/[lang]/index.astro` and verify `/zh` and `/en` outputs.
- [x] 2.2 Replace duplicate locale Download, Changelog, and Privacy pages with one dynamic Astro file per page type and verify all six outputs.
- [x] 2.3 Remove redundant browser-side fixed-copy translation while preserving interactive behavior, verified on both locale builds.

## 3. Navigation and validation

- [x] 3.1 Replace JavaScript-driven language option buttons with equivalent-route links and verify opening controls never navigates while choosing a language does.
- [x] 3.2 Update architecture documentation and validate OpenSpec, tests, production build, localized metadata/navigation, and the 500KB size limit.
