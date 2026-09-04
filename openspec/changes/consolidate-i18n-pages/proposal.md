## Why

Chinese and English currently duplicate each Astro page and repeat the same copy in browser scripts, making structure, SEO metadata, and translations drift-prone. Language navigation is also implemented as JavaScript-driven buttons, which is fragile and does not work as ordinary navigation.

## What Changes

- Generate both locale variants from one Astro template per page using build-time locale paths.
- Move fixed website copy and localized metadata into typed modules under `src/i18n/`.
- Remove redundant browser-side translation data where the localized HTML is already generated at build time.
- Render language destinations as real links that preserve the current page suffix.

## Capabilities

### New Capabilities

- `localized-page-generation`: Defines shared page templates, typed locale content, and progressively enhanced language navigation.

### Modified Capabilities

None.

## Impact

This changes Astro page organization, shared header/footer inputs, page scripts, localized metadata generation, and related validation. Public URLs and Cloudflare download routes remain unchanged; no dependency or runtime service is added.
