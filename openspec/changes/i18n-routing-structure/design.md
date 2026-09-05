## Goal

Publish independently indexable Chinese and English static pages while keeping locale routing compatible with the existing Cloudflare Worker deployment.

## Decisions

### Static localized pages

Astro continues to build static HTML. The existing four pages are emitted below both `/zh` and `/en`; each route has localized initial content, document language, canonical URL, social metadata, and reciprocal hreflang links.

### Shared navigation

`SiteHeader` and `SiteFooter` derive locale from `Astro.url.pathname`. Their links always retain that locale. Choosing another language records `clipclop-locale` and navigates to the same suffix under the target prefix.

### Edge redirects

The existing Cloudflare Worker handles `/`, `/download`, `/changelog`, and `/privacy` before Static Assets. It parses `Accept-Language`, selects Chinese only when Chinese has the strongest supported preference, falls back to English, preserves query strings, returns `302`, and sets `Vary: Accept-Language` plus `Cache-Control: no-store`.

The Worker cannot read browser `localStorage`. Stored preference therefore applies when the client language switcher is used; unqualified server requests use `Accept-Language` as required by the proposal.

### No new abstraction or dependency

The site remains framework-free beyond Astro. Existing page translation data and components are reused; no i18n package, middleware, backend, or runtime database is introduced.

## Compatibility

- Stable binary routes `/download/macos` and `/download/windows` remain unchanged.
- Explicit `/zh/*` and `/en/*` routes are never language-negotiated.
- Bare content URLs remain usable through temporary redirects.
- The sitemap lists only canonical localized URLs.

## Documentation

Update `docs/architecture.md` and `docs/distribution.md` because the public request flow and URL contract change. Update README and sitemap links. `PRODUCT.md` remains unchanged because product purpose and users do not change.

## Validation

- Worker unit tests cover language negotiation, fallback, query preservation, cache headers, and stable download routes.
- `pnpm build`, `pnpm test`, and `pnpm check:size` pass.
- Generated localized HTML is checked for language, canonical, hreflang, and locale-preserving navigation.
- Lighthouse remains a deployment gate; staging, Search Console, and changes to the separate app repository are follow-up operations outside this repository change.
> **Superseded in part:** 本文的路由行为继续有效，但源码组织设计已由 [adopt-feature-based-architecture](../adopt-feature-based-architecture/proposal.md) 更新为 feature co-location。
