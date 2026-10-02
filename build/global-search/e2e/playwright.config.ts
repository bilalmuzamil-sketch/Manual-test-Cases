import { defineConfig } from 'playwright/test';

/**
 * Global Search V2 — end-to-end suite for TestRail run 415.
 *
 * Every test is named with the C-id of the manual case it automates and carries that C-id as a
 * tag, so `--grep @C44804` runs exactly one case and a failure points straight at the case in the
 * run. `TESTRAIL-MAPPING.csv` lists every one of them.
 *
 * ── RUNNING IT ─────────────────────────────────────────────────────────────────────────────────
 *     npm install && npx playwright install chromium
 *     cp .env.example .env     # fill in, then: set -a && . ./.env && set +a
 *     npm run seed             # prepare the environment
 *     npm test
 *
 * `GS_APP` picks the environment and everything else follows from it. Nothing is read from a fixed
 * path, no relay or proxy is required, and no host is hard-coded in any spec — a spec naming the
 * production API would quietly query production while you believed you were testing staging.
 *
 * Credentials are read from the environment at run time and are NEVER committed: this repository
 * is public (Standing Rule 82). See README.md and .env.example.
 *
 * ── WHY SO MANY WAITS ──────────────────────────────────────────────────────────────────────────
 * The search index refreshes asynchronously and the requirement allows up to 30s. Anything that
 * creates or edits a record has to wait for the entry to rebuild before reading the panel, or the
 * test measures the old state and reports a fault that is not there. That mistake cost this
 * project several false findings, so the helpers make the wait explicit rather than incidental.
 */
// 🔴 HEADED MODE MUST REACH THE SUITE'S OWN BROWSER. These tests sign in with a browser they launch
// themselves (fixtures/boot.ts), not Playwright's `page` fixture, so `--headed` used to change
// nothing: the run stayed invisible and looked like the flag was broken. This file is evaluated by
// the main Playwright process BEFORE any worker starts, and workers inherit its environment — so
// the flags are read here and handed on. GS_HEADED=1 does the same by hand; GS_SLOWMO=<ms> slows
// every action so a person can follow it.
if (process.argv.some((a) => a === '--headed' || a === '--debug' || a === '--ui' || a.startsWith('--ui='))
    || process.env.PWDEBUG) {
  process.env.GS_HEADED = '1';
}

export default defineConfig({
  testDir: './tests',
  // 🔴 SEEDS, THEN VERIFIES, BEFORE THE FIRST TEST — EVERY RUN. The branch is refreshed and a refresh
  // wipes the seeded data; an unseeded run does not fail, its checks stand down, and that was
  // discovered 1.6 hours later. global-setup.ts seeds every record the tests read, then the
  // preflight proves search returns each one and stops the run if not. GS_SEED=skip|check,
  // GS_PREFLIGHT=warn|off.
  globalSetup: './global-setup.ts',
  // Index refresh dominates; these are not fast unit tests and pretending otherwise causes flakes.
  timeout: 180_000,
  expect: { timeout: 20_000 },
  // One worker: signing in as the same person expires their previous session, so two workers log
  // each other out and both report a broken environment.
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'results/e2e-results.json' }]],
  use: {
    // 🔴 DEFAULTS TO STAGING, NOT A QA BRANCH. The old default named sv9160, which was merged and
    // DELETED — so a run with GS_APP unset went to a host that no longer exists and failed in a way
    // that looked like the suite being broken.
    baseURL: process.env.GS_APP || 'https://app.staging.shopview.com',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 60_000,
  },
});
