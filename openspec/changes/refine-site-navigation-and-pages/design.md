## Context

The Astro site began as a two-page site with most Home styles and behavior in `index.astro`. This change introduces four routes and shared navigation while moving release history off Home. See `proposal.md` for motivation and `docs/distribution.md` for the first-party URL contract.

## Goals / Non-Goals

**Goals:**

- Introduce the confirmed page structure with the smallest reusable shell.
- Preserve the existing interactive demonstration and synchronized app design tokens.
- Keep all pages static, accessible, bilingual, and resilient to public API failure.

**Non-Goals:**

- Migrating the Cloudflare Worker, R2 binding, DNS, or deployment workflow.
- Adding accounts, analytics, a content system, or a client framework.
- Creating About, Terms, Features, or Help pages without content that requires them.

## Decisions

### Use brand-as-Home navigation

The ClipClop brand remains a persistent link to `/`; a separate Home item is omitted as redundant. Desktop displays Download, Changelog, and Privacy directly. GitHub stars form a compact metric beside the brand on desktop and beside More on mobile: GitHub mark, tabular count, then a larger yellow star. Successful counts are cached in local storage for six hours and stale values render before a refresh. The site does not add OAuth merely to detect a visitor's starred state.

The mobile menu becomes a full-viewport navigation surface while preserving the floating header's exact position, size, radius, background, and shadow as its persistent visual anchor. The More icon crossfades, rotates, and scales into Close in place; the full surface fades in while its navigation content moves upward slightly, using the existing fast/mid motion tokens and disabling transitions for reduced-motion users. Below it, large destination targets and native expandable language and appearance sections avoid stacked popovers and keep secondary settings reachable by thumb. Desktop destination slots use fixed widths based on the longer English labels, while platform download labels stay on one line, preventing locale changes from shifting or wrapping the header and calls to action.

### Add only one shared component

Keep `SiteHeader.astro` and add `SiteFooter.astro`. Page-specific content stays in Astro pages. A shared layout or content system is deferred until duplication makes it smaller than direct markup.

### Keep release data client-side for this change

Reuse the existing public GitHub API request for Changelog and optional current-version context. Changelog reads its last successful history from local storage before making a fresh request on every visit; success replaces the cache and failure leaves it untouched. Do not add a build-time data pipeline. Downloads always use stable first-party routes, so release API failure cannot block downloading.

Release bodies use the repository's `## 中文` and `## English` convention. Select one section before rendering a small, escaped Markdown subset matching the release-note format; omit the appended installation-note block. Release entries have no download controls; one page-level action beside the source-record link routes to `/download`.

### Keep Home short after the demonstration

Home uses one compact trust statement and one closing download area. The Hero keeps direct macOS and Windows actions for a fast first CTA, while the closing area uses one icon-labelled action to `/download` for platform details. The complete release feed moves to Changelog; version context is folded into the closing area instead of becoming another large section.

On mobile, the demonstration's actual section boundary overlaps the unused lower portion of the Hero while preserving a 32 px clearance from Hero content; equivalent bottom space keeps the total scroll distance unchanged. This avoids relying on transformed sticky overflow, which WebKit may clip differently from desktop browser emulation. Section 2 story typography scales by layout: up to 60/18 px on desktop, 40/17 px on tablet, and 32/16 px on mobile, with a 28 px mobile gap from the scaled app model. This approaches the hierarchy of later Home sections without letting the side-by-side story overwhelm the demonstration.

In dark mode, every Home section and the footer share the existing `bg-raised` website canvas. The faithful app model keeps `bg-shell` plus the standard 1 px `hairline` panel boundary, separating it through the design system's tonal layering without making Section 2 a different-colored band.

### Share design tokens, not a new visual language

New pages and components use the existing CSS variables synchronized from the app. Native HTML links, buttons, and popovers remain the interaction primitives.

Download, Changelog, and Privacy share a 1000 px page grid, 148 px desktop title offset, the same responsive `h1` scale, and 17 px introduction style. Privacy keeps a 760 px reading column inside that grid; its narrower body does not move or resize the page title.

Privacy copy follows a direct sequence: local data, network access, user controls, open-source auditability, and system permissions. Each section separates behavior from limitations, avoids unsupported security guarantees, and keeps the Chinese and English versions semantically equivalent.

## Risks / Trade-offs

- [GitHub API rate limits hide release context] → Keep static download actions usable and show a localized fallback.
- [Mobile More hides page destinations by one interaction] → Keep the control persistent, clearly labelled, keyboard operable, and ordered consistently with desktop.
- [Styles remain partly page-local] → Accept until actual duplication justifies extracting a shared stylesheet.
- [Stable target download routes may not yet be deployed] → Implement against the documented contract and keep infrastructure migration tracked separately before production cutover.
- [Current build output may exceed the 500 KiB repository budget] → Measure the complete `dist/` tree after each build and reduce or exclude unused copied assets before release; do not modify the main-repository-owned app icon.
- [Lighthouse is not available in the build command] → Keep the quality task open until Performance and Accessibility are measured above 90 with browser tooling.

## Migration Plan

1. Add shared navigation/footer behavior and new static routes.
2. Move release-history rendering from Home to Changelog.
3. Add Home trust and closing download content, using stable route contracts.
4. Verify routes, keyboard behavior, responsive layout, build size, and Lighthouse targets.
5. Roll back the page commit if route or deployment readiness checks fail; no stored user data is migrated.
