## 1. Website Worker

- [x] 1.1 Add the minimal module Worker and Wrangler configuration with `ASSETS`, `RELEASES`, `clipclop.io` Custom Domain, `workers_dev = false`, and preview URLs disabled; verify Wrangler configuration validation succeeds.
- [x] 1.2 Implement `/download/macos` and `/download/windows` from R2 `downloads.json`, including GET/HEAD, 302, `no-cache`, target validation, 405 and 503 behavior; verify focused Worker tests pass.
- [x] 1.3 Implement direct R2 responses for `/latest.json` and `/releases/*`, including 404, content metadata and required cache headers; verify focused Worker tests pass.
- [x] 1.4 Delegate all non-distribution requests to Static Assets and verify Home, `/download`, `/privacy`, `/changelog`, static files and unknown paths are not shadowed by R2 routing.

## 2. Repository Validation and Deployment

- [x] 2.1 Add repository scripts for Worker tests and total uncompressed `dist/` size below 500KB; verify the scripts fail on invalid fixtures/oversized output and pass on the current production build.
- [x] 2.2 Add the single GitHub Actions production workflow for `main` and manual dispatch with locked pnpm install, tests, build, size check, Lighthouse Performance/Accessibility thresholds above 90 and one Wrangler deployment; verify the workflow configuration exposes no R2 write credentials and has no second production deployer.
- [x] 2.3 Update `docs/distribution.md`, `docs/architecture.md`, README and repository guidance to describe the implemented Worker, exact Cloudflare variables/secrets, Custom Domain, R2 binding, deployment and rollback commands; verify searches contain no claim that the target deployment is still absent or that the old domain will be retained.
- [x] 2.4 Run `pnpm build`, the Worker tests, size check and Lighthouse checks against a production preview; verify all repository-required thresholds pass.

## 3. GitHub and Cloudflare Setup

- [ ] 3.1 Create the website GitHub repository, add it as this worktree's `origin`, push `main` and enable required branch checks; verify the remote points to the intended repository and `main` is visible there.
- [ ] 3.2 Configure the GitHub production environment with `CLOUDFLARE_ACCOUNT_ID` and a narrowly scoped Worker deploy token; verify the workflow can authenticate without access to release signing secrets or R2 write credentials.
- [ ] 3.3 Confirm `clipclop-releases` exists in the same Cloudflare account, configure the R2 binding and `clipclop.io` Custom Domain, then deploy; verify HTTPS, static routes, both platform redirects, `/latest.json`, one existing `/releases/` object, cache headers, 404 and 503 behavior in production.

## 4. App Repository Migration

- [x] 4.1 Replace `clipclop.mapin.net` with `clipclop.io` in the Tauri updater endpoint, release workflow manifest URLs, privacy/network disclosures, distribution documentation and user-facing download/release entry points; verify a targeted search leaves no old-domain runtime or documentation references and preserves GitHub API/source-record URLs.
- [x] 4.2 Verify the App release workflow still validates and uploads every signed versioned artifact before replacing `downloads.json` and `latest.json`; run its relevant workflow/static checks and confirm the generated manifest contains only `https://clipclop.io/releases/...` URLs.
- [x] 4.3 Run the App repository tests and production build checks affected by the URL migration; verify they pass before changing the old Cloudflare route.

## 5. Cutover and Cleanup

- [ ] 5.1 Deploy the coordinated website and App changes and rerun the complete production endpoint matrix on `clipclop.io`; verify every check passes before cleanup.
- [x] 5.2 Remove the App repository's migrated `cloudflare/` Download Worker and `deploy-download-worker.yml`; verify only the website repository can deploy the public Worker while App R2 upload and verification workflows remain intact.
- [ ] 5.3 Disable the `clipclop.mapin.net` Worker route without adding redirects or proxy rules; verify the canonical endpoint matrix still passes and both repositories contain no supported old-domain contract.
- [ ] 5.4 Record the deployed Worker version and tested rollback command, then verify a rollback dry run or non-production rehearsal does not modify R2 objects.
