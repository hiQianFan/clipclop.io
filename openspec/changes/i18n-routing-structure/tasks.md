## 1. Localized static pages

- [x] 1.1 Generate Chinese and English routes for Home, Download, Changelog, and Privacy
- [x] 1.2 Render route-specific document language and localized SEO/social metadata
- [x] 1.3 Add self-canonical and reciprocal zh/en/x-default hreflang links

## 2. Locale-aware navigation

- [x] 2.1 Make shared header and footer links preserve the route locale
- [x] 2.2 Make language switching persist the choice and navigate to the equivalent localized route
- [x] 2.3 Audit page CTAs and fallback links for locale-preserving navigation

## 3. Redirect compatibility

- [x] 3.1 Redirect root and legacy bare page routes in the Cloudflare Worker using Accept-Language with English fallback
- [x] 3.2 Add Worker tests for preference parsing, query preservation, response headers, and unchanged download routes

## 4. Public contracts and validation

- [x] 4.1 Update sitemap, README, architecture, and distribution documentation for localized canonical URLs
- [x] 4.2 Pass OpenSpec strict validation, worker tests, production build, route/metadata checks, and the 500KB size limit

## Follow-up operations

- Deploy to staging and run live redirect/Lighthouse checks.
- Update links in the separate ClipClop repository and its GitHub website field.
- Submit localized URLs to Google Search Console and monitor hreflang indexing.
