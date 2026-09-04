## Why

The current single-page navigation mixes page-level destinations with scroll sections, while downloading and release history still route through GitHub instead of ClipClop's owned Cloudflare/R2 endpoints. The site needs a small, durable page structure that makes the product easy to understand, verify, and download on desktop and mobile.

## What Changes

- Replace section-based global navigation with page-level destinations for Download, Changelog, and Privacy; the persistent ClipClop brand links to Home without a duplicate Home item.
- Keep the desktop destinations visible. Present the cached public GitHub star count beside the brand on desktop and beside More on mobile; keep page destinations and utility controls in the mobile menu.
- Refocus Home around the hero, interactive product demonstration, a short privacy/open-source trust statement, and a closing download area with current-release context.
- Add a dedicated Download page using stable `/download/macos` and `/download/windows` endpoints without hard-coded artifact names or versions.
- Move the full release history to a dedicated Changelog page, retaining GitHub only as the original public release record.
- Keep Privacy as a dedicated page and align its network-boundary copy with the current-to-target Cloudflare migration state.
- Add a shared footer with Download, Changelog, Privacy, GitHub, license, and copyright links; do not create empty About, Terms, Features, or Help pages.

## Capabilities

### New Capabilities

- `site-navigation`: Shared responsive header and footer behavior across the site.
- `homepage-content`: Focused home-page content hierarchy and interactive demonstration behavior.
- `download-page`: First-party platform download entry backed by stable Cloudflare/R2 routes.
- `changelog-page`: Dedicated release-history browsing with graceful GitHub API fallback.
- `privacy-page`: Clear local-data and necessary-network-access disclosure.

### Modified Capabilities

None. This repository has no existing capability specifications.

## Impact

- Affects Astro pages, the shared header, a new shared footer, localized copy, metadata, internal links, and the existing GitHub API release rendering.
- Uses the public URL contract in `docs/distribution.md`; Cloudflare Worker, R2 binding, DNS, and deployment migration remain outside this change.
- Adds no client framework, UI library, account system, backend database, or analytics.
