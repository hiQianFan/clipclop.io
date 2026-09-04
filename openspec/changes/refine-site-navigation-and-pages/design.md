## Context

The current Astro site has two pages, a shared header, and most Home styles and behavior in `index.astro`. Its header navigates scroll sections, Home embeds the complete GitHub release feed, and download actions point to GitHub. See `proposal.md` for motivation and `docs/distribution.md` for the first-party URL contract.

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

The ClipClop brand remains a persistent link to `/`; a separate Home item is omitted as redundant. Desktop displays Download, Changelog, and Privacy directly. GitHub stars form a compact metric beside the brand on desktop and beside More on mobile: GitHub mark, count, then a yellow star. Successful counts are cached in local storage for six hours and stale values render before a refresh. The site does not add OAuth merely to detect a visitor's starred state.

### Add only one shared component

Keep `SiteHeader.astro` and add `SiteFooter.astro`. Page-specific content stays in Astro pages. A shared layout or content system is deferred until duplication makes it smaller than direct markup.

### Keep release data client-side for this change

Reuse the existing public GitHub API request for Changelog and optional current-version context. Do not add a build-time data pipeline. Downloads always use stable first-party routes, so release API failure cannot block downloading.

### Keep Home short after the demonstration

Home uses one compact trust statement and one closing download area. The complete release feed moves to Changelog; version context is folded into the closing area instead of becoming another large section.

### Share design tokens, not a new visual language

New pages and components use the existing CSS variables synchronized from the app. Native HTML links, buttons, and popovers remain the interaction primitives.

## Risks / Trade-offs

- [GitHub API rate limits hide release context] → Keep static download actions usable and show a localized fallback.
- [Mobile More hides page destinations by one interaction] → Keep the control persistent, clearly labelled, keyboard operable, and ordered consistently with desktop.
- [Styles remain partly page-local] → Accept until actual duplication justifies extracting a shared stylesheet.
- [Stable target download routes may not yet be deployed] → Implement against the documented contract and keep infrastructure migration tracked separately before production cutover.

## Migration Plan

1. Add shared navigation/footer behavior and new static routes.
2. Move release-history rendering from Home to Changelog.
3. Add Home trust and closing download content, using stable route contracts.
4. Verify routes, keyboard behavior, responsive layout, build size, and Lighthouse targets.
5. Roll back the page commit if route or deployment readiness checks fail; no stored user data is migrated.
