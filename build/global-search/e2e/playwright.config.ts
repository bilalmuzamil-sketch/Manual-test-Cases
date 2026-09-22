import { defineConfig } from 'playwright/test';

/**
 * Global Search V2 — end-to-end suite.
 *
 * Converted from the probes actually used to execute TestRail run 415 on the sv9160 QA branch,
 * 14–22 September 2026. Every test carries the C-id of the manual case it automates, so a failure
 * here points straight at a case in the run.
 *
 * ── HOW IT SIGNS IN ────────────────────────────────────────────────────────────────────────────
 * The branch uses Google SSO. There is no scriptable login, so the suite reuses browser cookies
 * that a person pastes in. They are read at run time from /tmp and are NEVER committed — this
 * repository is public (Standing Rule 82).
 *
 *     /tmp/qa-cookies/<branch>-full.json   {"sv_sso_session":"…","PHPSESSID":"…","cf_clearance":"…"}
 *
 * 🔴 BOTH sv_sso_session AND PHPSESSID are required. Measured 22 Sep: either one alone answers 401
 * {"error":"sso_required"}; the two together answer 200. Older notes in this repo say the sign-in
 * cookie alone is enough — that was true before the branch moved to Google sign-in and is wrong now.
 *
 * ── WHY SO MANY WAITS ──────────────────────────────────────────────────────────────────────────
 * The search index refreshes asynchronously (the requirement allows up to 30s). Anything that
 * creates or edits a record has to wait for the entry to rebuild before reading the panel, or the
 * test measures the old state and reports a fault that is not there. That mistake cost this
 * project several false findings; the helpers make the wait explicit rather than incidental.
 */
export default defineConfig({
  testDir: './tests',
  // Index refresh dominates; these are not fast unit tests and pretending otherwise causes flakes.
  timeout: 180_000,
  expect: { timeout: 20_000 },
  // One worker: two sessions on one QA branch evict each other's sign-in (Standing Rule 83).
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'results/e2e-results.json' }]],
  use: {
    baseURL: process.env.GS_APP || 'https://sv9160.qa.shopview.com',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 60_000,
  },
});
