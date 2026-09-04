## 1. Shared Navigation

- [ ] 1.1 Convert the desktop header to page-level Download, Changelog, and Privacy links and verify current-page semantics on every route.
- [ ] 1.2 Add the mobile brand, GitHub stars, and More menu behavior and verify all destinations and utilities are keyboard accessible at 320px.
- [ ] 1.3 Add a shared footer and verify every page exposes the agreed destination, repository, and license links.

## 2. Page Structure

- [ ] 2.1 Create `/download` with both stable platform routes, verified compatibility copy, and non-exclusive platform emphasis.
- [ ] 2.2 Create `/changelog`, move the release feed off Home, and verify API failure leaves first-party downloads available.
- [ ] 2.3 Refocus Home around hero, demonstration, compact trust statement, and closing download area; verify no full release feed remains.
- [ ] 2.4 Align Privacy copy with local data, open-source auditability, and current-to-target network endpoints.

## 3. Quality

- [ ] 3.1 Verify localized labels, metadata, current-page states, focus visibility, and reduced-motion behavior across all routes.
- [ ] 3.2 Run `openspec validate refine-site-navigation-and-pages --strict`, `pnpm build`, confirm uncompressed output is below 500 KiB, and record Lighthouse follow-up if browser tooling is unavailable.
