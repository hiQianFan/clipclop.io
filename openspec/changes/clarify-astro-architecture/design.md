## Context

See `proposal.md` for motivation. The site is a zero-framework Astro static build with four localized page templates under `src/pages/[lang]/`, a shared document layout, shared header/footer components, typed locale objects, and small vanilla-JavaScript enhancements. Public URLs, Cloudflare behavior, design tokens, and generated page behavior are stable constraints.

The current boundaries are uneven: `HomePage.astro` hides the complete home-page composition, while the other routes contain their composition directly; `SiteHeader` and `SiteFooter` recover locale from the URL instead of receiving the locale already validated by the route; and large localization files couple complete Chinese and English page sources.

## Goals / Non-Goals

**Goals:**

- Make each file name and directory communicate one clear responsibility.
- Keep route files as the visible composition root for their pages.
- Extract components when they own shared site chrome or an independently meaningful behavior, not merely to shorten a route file.
- Make locale flow explicit from the generated route to every shared component that needs it.
- Keep all localized page material under one predictable `src/i18n/` boundary, organized by owning page and then locale.
- Preserve static generation, accessibility, output size, and the current user experience.

**Non-Goals:**

- Creating a general section framework, component registry, content loader layer, or route factory.
- Splitting every home-page section into a component for symmetry.
- Adding Astro SSR, a client framework, an i18n package, a CMS, or a new runtime dependency.
- Changing locale negotiation, canonical URLs, download distribution, page design, or product copy.

## Decisions

### 1. Route files remain page composition roots

Each `src/pages/[lang]/*.astro` file will visibly compose its page inside `LocalizedLayout`. The home route will directly contain its static Hero, Trust, and download CTA sections instead of delegating the entire body to `HomePage.astro`.

`HomePage.astro` will be removed because it is neither shared nor an independent behavioral unit; its name hides rather than clarifies the page structure. Keeping the other small pages inline is intentional, not an incomplete component migration.

Alternative considered: create `Hero`, `TrustSection`, `DownloadCards`, and similar components for every visual block. Rejected because these blocks currently have no independent behavior or demonstrated reuse, and the extra files would only move markup behind props.

### 2. Keep the interactive showcase in the home route for now

The home-page showcase remains inline in `src/pages/[lang]/index.astro`. Although it is a meaningful product area, its markup, serialized data node, public client script, and home stylesheet currently form one page-level DOM contract. Extracting only the Astro markup into `InteractiveDemo.astro` would move code without encapsulating the behavior or styles.

`InteractiveDemo.astro` remains a future option only when the markup, behavior, styles, and typed input can move together as a complete boundary, or when a second page needs the same demonstration. Component extraction is evidence-driven rather than required for visual symmetry.

Alternative considered: extract `InteractiveDemo.astro` immediately. Rejected because the route would still need to know its initialization node, selector contract, script ordering, and shared stylesheet, leaving a partial abstraction with more navigation cost.

### 3. Keep one combined layout at the current site scale

`LocalizedLayout.astro` continues to own the document shell, metadata, shared Header/Footer, and page slots. A separate `DocumentLayout` plus site-shell layer, like the larger WorldFirst reference project, is not introduced because ClipClop has one site shell and four pages.

The layout passes `locale` and `page` explicitly to `SiteHeader` and passes `locale` to `SiteFooter`. Shared components build localized links from those props and no longer inspect `Astro.url.pathname` to determine language. The header may still use the current URL only to preserve the non-locale path suffix and query/hash when constructing alternate-language links.

Alternative considered: introduce a shared routing service or context provider. Rejected because simple props and template literals cover the complete route set.

### 4. Organize all localized material under `src/i18n/`

The site uses one localization boundary rather than introducing a separate content architecture before it is needed:

```text
src/i18n/
  config.ts
  site/
    zh.ts
    en.ts
  home/
    zh.ts
    en.ts
  download/
    zh.ts
    en.ts
  changelog/
    zh.ts
    en.ts
  privacy/
    zh.md
    en.md
```

Content is organized by owning page first and locale second. The complete Home source for one locale includes its SEO, Hero, interactive demo records and labels, Trust section, and closing CTA. This keeps the Demo visibly owned by Home while allowing each language to be reviewed independently. `site/` contains only cross-page Header, Footer, language-control, and theme-control copy.

`config.ts` defines supported locale codes and the shared `Locale` type. A small index module in each TypeScript content area may export its `zh`/`en` mapping and enforce compile-time shape parity. No loader, fallback merge system, or runtime translation layer is introduced.

Privacy prose uses two Markdown files under `src/i18n/privacy/`, imported locally by the shared privacy route. Markdown does not require a `src/content/` directory, and two fixed documents do not justify Astro Content Collections.

Alternatives considered: a mixed `src/i18n/` plus `src/content/` architecture creates a boundary the current site does not need; locale-first top-level folders scatter one page across distant trees; a separate `src/data/demo.ts` or `src/i18n/demo/` loses the fact that the Demo belongs only to Home. Raw privacy HTML remains hard to inspect, while a Content Collection is unnecessary at this scale.

### 5. Preserve the existing routing and browser contract

`[lang]` plus `getStaticPaths()` remains the static generation mechanism for `zh` and `en`. Repeating the small `getStaticPaths()` function in four routes is acceptable; no helper is introduced solely to remove a few identical lines.

Language destinations remain ordinary anchors, theme controls remain buttons, and demo controls retain their current native semantics. Client JavaScript enhances the generated HTML but does not replace fixed translations or perform primary navigation.

### 6. Document rules that prevent the architecture from drifting

`docs/architecture.md` will describe the responsibility and allowed dependency direction for routes, layout, shared components, page-local interactive components, localized copy, data, Markdown content, public assets, and browser scripts. It will include the component extraction rule: extract only for shared site chrome, demonstrated reuse, or an independent state/interaction/accessibility boundary.

## Risks / Trade-offs

- [Moving home markup can accidentally omit content] → Compare both generated home pages before and after migration and verify every section and localized string.
- [Moving home markup can break DOM selectors and initialization order] → Preserve the existing DOM contract and script order while removing the `HomePage` wrapper, then run the current interaction tests before cleanup.
- [Explicit locale props can miss a caller] → Let Astro/TypeScript require the prop and build all eight localized routes.
- [Markdown rendering can change privacy-page HTML or CSS hooks] → Keep the existing semantic heading/paragraph structure and verify both privacy pages visually.
- [Splitting locale files can create translation drift] → Retain one shared shape per TypeScript content area and check it at build time.

## Migration Plan

1. Update `docs/architecture.md` with the agreed boundaries and target structure.
2. Make locale an explicit required prop for Header/Footer and update the layout callers without changing link output.
3. Move the complete home composition, including the interactive showcase, into the localized home route while preserving its DOM and behavior; remove `HomePage.astro` without creating a replacement component.
4. Split localized material into page-first sources under `src/i18n/<page>/<locale>` and site-wide copy under `src/i18n/site/<locale>`, retaining compile-time parity.
5. Replace privacy HTML strings with `src/i18n/privacy/zh.md` and `en.md`, rendered by the shared privacy route.
6. Run the production build, repository tests, generated-route checks, output-size check, and Lighthouse validation required by `AGENTS.md`.

Each step is independently reviewable. Rollback is a source-level revert because no public API, stored data, or deployment resource changes.
> **Superseded:** 本文的源码组织设计已由 [adopt-feature-based-architecture](../adopt-feature-based-architecture/proposal.md) 取代；当前事实源为 `docs/architecture.md`。
