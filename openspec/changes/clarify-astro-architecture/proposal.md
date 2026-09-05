## Why

The current Astro implementation renders correctly, but its boundaries do not consistently communicate responsibility: the whole home page is hidden behind a generic `HomePage` component, shared components infer locale from the URL, and both languages for several pages are coupled in large files. Clarifying these boundaries now will make the localization architecture easier to understand and change without introducing speculative layers.

## What Changes

- Document the site architecture and the responsibilities of routes, layouts, shared site components, page-local sections, localized copy, long-form content, and interactive data.
- Keep ordinary page composition in the corresponding `src/pages/[lang]/*.astro` route instead of wrapping an entire page body in a generic page component.
- Keep the complete home-page composition, including the interactive demonstration, in the home route; introduce `InteractiveDemo.astro` only if its markup, behavior, styles, and input later form a complete independent boundary.
- Pass the validated locale explicitly from the route through the layout to `SiteHeader` and `SiteFooter` instead of having shared components infer it from `Astro.url.pathname`.
- Organize all localized content under `src/i18n/` by page first and locale second, keeping Home demo content with the rest of Home and site-wide copy in its own area.
- Preserve the current `/zh/*` and `/en/*` URLs, generated HTML, accessibility behavior, visual design, Cloudflare routing, and download endpoints.

## Capabilities

### New Capabilities

None. This change clarifies and refactors the implementation without adding user-visible behavior.

### Modified Capabilities

None.

## Impact

The change affects `docs/architecture.md`, the localized layout and shared header/footer interfaces, the localized home route, the current `HomePage.astro` boundary, and files under `src/i18n/`. It adds no dependency, content framework, runtime service, public route, or client framework.
> **Superseded:** 本文关于源码按技术类型组织、完整页面保留在 route、页面内容集中于全局 `src/i18n` 的结论，已由 [adopt-feature-based-architecture](../adopt-feature-based-architecture/proposal.md) 取代。本文仅保留为历史决策记录。
