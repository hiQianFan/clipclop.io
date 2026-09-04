## Context

See [proposal.md](./proposal.md) for motivation and the two capability specs for behavior. The Astro site already builds static `dist/`, but has no GitHub remote, Wrangler configuration, Worker entry point, or deployment workflow. The App repository currently owns a small download redirect Worker and uploads signed release assets plus `downloads.json` and `latest.json` to the existing `clipclop-releases` R2 bucket. Its Worker fetches metadata through `clipclop.mapin.net`; it does not currently use an R2 binding.

The change crosses the website repository, App repository, GitHub, Cloudflare DNS/Workers and R2. The website remains dependency-light and static; release signing and R2 writes remain in the App repository.

## Goals / Non-Goals

**Goals:**

- Make the website repository the single deployment owner for `clipclop.io` and its public read routes.
- Route static assets and release downloads through one Worker with one R2 binding.
- Keep production configuration reproducible in the repository and deployment gated by required checks.
- Perform a verified one-time cutover, then remove the old Worker deployment surface.

**Non-Goals:**

- Moving release builds, signing keys, R2 upload credentials or GitHub Release publishing out of the App repository.
- Adding Pages, a second Worker, a download subdomain, preview domains, runtime databases or a compatibility proxy.
- Replacing GitHub Releases as the release-history/source-record data source.
- Automating Cloudflare account or GitHub secret creation beyond documenting exact required values.

## Decisions

### Use one module Worker with Static Assets and R2 bindings

Add one Worker entry point and one Wrangler configuration to the website repository. Wrangler binds `dist/` as `ASSETS`, binds the existing `clipclop-releases` bucket as `RELEASES`, disables `workers.dev`/preview URLs, and assigns `clipclop.io` as a Custom Domain.

The Worker checks the four distribution route families first, then delegates every other request to `env.ASSETS.fetch(request)`. This ordering prevents missing R2 objects from falling through to an Astro page while allowing the static host to retain normal file and 404 behavior.

Alternative considered: Cloudflare Pages plus a separate Download Worker. Rejected because it creates two deployables and a path-routing boundary without providing a needed capability.

### Read release data directly from R2

Download redirects read `downloads.json` through `env.RELEASES`; `/latest.json` and `/releases/*` read their exact object keys from the same binding. Response metadata is derived from trusted object metadata where available, with route-specific cache policy enforced by the Worker. Redirect targets remain constrained to absolute-path `/releases/` values.

Alternative considered: retain the current Worker pattern of fetching metadata from the public hostname. Rejected because the combined Worker would recursively request itself and because direct R2 reads have fewer failure points.

### Use GitHub Actions as the only deployment controller

Create a GitHub Actions workflow triggered by pushes to `main`, plus manual dispatch. It installs the locked pnpm toolchain, builds, checks total `dist/` size, runs the Worker route check and Lighthouse thresholds, then invokes Wrangler once. The workflow uses a narrowly scoped Worker deployment token and Cloudflare account ID; it does not receive R2 write credentials.

Alternative considered: Cloudflare Workers Builds. Rejected because required repository checks and Lighthouse gating would otherwise be split across two controllers. Only one system should publish production.

### Keep R2 publishing in the App repository

The App workflow continues its existing atomic order: build and verify signed versioned artifacts, upload them, then replace `downloads.json` and `latest.json`. Only manifest URLs change from `clipclop.mapin.net` to `clipclop.io`. GitHub API URLs used for changelog data and source records remain unchanged.

After the website Worker is live, remove the App repository's `cloudflare/` Worker files and `deploy-download-worker.yml`; retain the R2 verification and release-upload workflows.

Alternative considered: move all Cloudflare operations into the website repository. Rejected because it would give the website release-signing and R2 write responsibilities that belong to the App release pipeline.

### Cut over once, after end-to-end verification

Deploy the new Worker and verify it through `clipclop.io` before changing or removing the old route. Update website documentation, App updater/privacy/download URLs and generated manifest URLs in the same cutover batch. After those commits and production checks succeed, remove the `clipclop.mapin.net` route without adding redirects.

Alternative considered: maintain a timed compatibility redirect. Rejected because there are no known external users and it would preserve an unnecessary second public contract.

## Risks / Trade-offs

- [An undiscovered old client still uses `clipclop.mapin.net`] → Accept the deliberate break because the product has not been publicly used; verify known test installations before removing the route.
- [A routing bug shadows static assets or returns HTML for missing releases] → Test every reserved route family plus static pages and unknown R2 objects before deployment.
- [R2 object metadata is incomplete] → Enforce safe defaults for content type/cache behavior and preserve installer filenames from validated object paths.
- [DNS or certificate activation delays the cutover] → Keep the old route untouched until `clipclop.io` passes HTTPS and endpoint checks; this is deployment sequencing, not a compatibility commitment.
- [Two repositories deploy the old and new Workers concurrently] → Establish the website workflow first, then delete the App Worker workflow immediately after cutover.
- [Worker rollback does not roll back App manifest URLs] → Roll back the Worker while leaving R2 objects intact; do not remove the old route until the final URL/config batch has passed verification.

## Migration Plan

1. Create the GitHub repository for the existing website worktree, add `origin`, protect `main`, and configure the Cloudflare account ID plus narrowly scoped deploy token.
2. Add the Worker, R2/Static Assets bindings, route checks and single GitHub Actions deployment workflow to the website repository.
3. Build and test locally, then deploy to `clipclop.io`; verify HTTPS, static pages, both platform redirects, `latest.json`, an existing versioned object, cache headers and failure responses.
4. Update all canonical download/updater/privacy/distribution references in both repositories and change App-generated updater URLs to `clipclop.io`; do not replace GitHub API/source-record URLs.
5. Run the website build/size/Lighthouse checks and the App tests/build checks affected by URL changes. Confirm the App release workflow still uploads versioned objects before metadata.
6. Merge/deploy the coordinated changes, verify production again, then remove the App Download Worker files/workflow and disable the `clipclop.mapin.net` Worker route.
7. If production validation fails before step 6, roll back the website Worker and leave the old route in place. If it fails after step 6, restore the previous Worker version and temporarily re-enable the old route only as an operational rollback, not as a supported compatibility layer.
