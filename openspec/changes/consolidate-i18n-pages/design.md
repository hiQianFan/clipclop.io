## Context

The site currently has eight locale-specific Astro files for four page types. Their structure is duplicated, while several browser scripts also contain translation dictionaries for content already rendered into static HTML. The site must remain a zero-framework static Astro build.

## Goals / Non-Goals

**Goals:**

- Keep one Astro template per page type and generate both locale routes at build time.
- Keep fixed copy and SEO fields in typed locale modules.
- Make language navigation work as ordinary links and isolate it from theme buttons.

**Non-Goals:**

- Adding an i18n dependency, SSR middleware, or runtime content service.
- Changing public URLs, Cloudflare download endpoints, or visual design tokens.
- Converting GitHub release data or interactive demo records into a CMS.

## Decisions

Use `src/pages/[lang]/` with `getStaticPaths()` returning `zh` and `en`. This preserves Astro file-based page boundaries while eliminating per-language templates; a single catch-all page was rejected because the four page types have different structures.

Use typed TypeScript modules under `src/i18n/`. Plain JSON was considered, but typed objects catch missing locale fields and support structured privacy sections without unsafe HTML strings.

Pass the validated locale and localized navigation content into shared components. Language menu destinations are anchors whose href replaces only the leading locale segment; a small click handler may persist preference but must not perform navigation or prevent the anchor fallback.

Remove browser-side fixed-copy replacement. Client scripts retain only genuinely dynamic behavior such as platform detection, release fetching, and the interactive product demo, receiving the build locale from the document.

## Risks / Trade-offs

- [Astro dynamic route parameters are strings] → Validate them against the two supported locale constants in `getStaticPaths()` and shared helpers.
- [Rich privacy copy can become awkward data] → Store it as typed sections and paragraphs, rendering known inline link/code fields explicitly.
- [Large one-shot migration can hide content loss] → Compare all eight generated routes, canonical/hreflang fields, navigation links, and build size before completion.
> **Superseded in part:** 本文关于页面级内容集中在全局 `src/i18n` 的目录设计已由 [adopt-feature-based-architecture](../adopt-feature-based-architecture/proposal.md) 取代；多语言静态生成行为保持不变。
