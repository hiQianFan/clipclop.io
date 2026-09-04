## Why

The current site uses client-side locale detection without URL-based language routing, making English content invisible to search engines. Every page defaults to Chinese SEO metadata regardless of user language, preventing international discovery and indexing. Users cannot share language-specific links, and the site architecture violates Google's i18n guidelines for multi-language content.

## What Changes

- Introduce language-prefixed routes (`/zh/*` and `/en/*`) for all pages, replacing the single-locale URL structure with explicit language paths.
- Create a root redirect handler at `/` that detects `Accept-Language` and routes to `/zh` or `/en` accordingly, with `/en` as the fallback.
- Duplicate current pages into language-specific directories: `src/pages/zh/` and `src/pages/en/`, each with localized SEO metadata (`<title>`, `<meta description>`, Open Graph, Twitter Card).
- Set `html lang` attributes to `zh-CN` for Chinese routes and `en` for English routes.
- Add standard `hreflang` alternate links on every page to declare language variants and the default (`x-default`) version to search engines.
- Update internal navigation to use language-prefixed paths (`/zh/download`, `/en/privacy`), preserving current locale across route changes.
- Update external links (from README, GitHub, etc.) to point to `/zh` or `/en` instead of bare `/`.
- Keep existing client-side locale switching functional by redirecting to the equivalent path in the target language.

## Capabilities

### New Capabilities

- `i18n-routing`: Language-prefixed URL structure with standard hreflang annotations.
- `root-redirect`: Accept-Language-aware entry point at `/`.
- `locale-aware-seo`: Per-language SEO metadata for search engine indexing.

### Modified Capabilities

- `site-navigation`: Header and footer links now route to language-prefixed paths.
- `homepage-content`: Split into `/zh/index.astro` and `/en/index.astro` with localized SEO.
- `download-page`: Available at `/zh/download` and `/en/download`.
- `changelog-page`: Available at `/zh/changelog` and `/en/changelog`.
- `privacy-page`: Available at `/zh/privacy` and `/en/privacy`.

## Impact

- Affects all Astro page files, site navigation components, and internal links.
- Requires updating deployment configuration to handle `/` redirect logic (Cloudflare Workers `_redirects` or edge function).
- Existing bare URLs (`/`, `/download`, etc.) will redirect to language-specific versions.
- Does not affect client-side locale detection; localStorage and manual switching remain functional.
- Improves SEO discoverability for English-speaking users and international markets.
