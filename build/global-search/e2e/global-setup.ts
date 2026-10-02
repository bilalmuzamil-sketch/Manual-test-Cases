/**
 * RUNS ONCE, BEFORE THE FIRST TEST, EVERY TIME: seed, then prove the data is there.
 *
 *   1. SEED   — every record every test reads, on whatever environment GS_APP names (seed.ts).
 *               The branch is refreshed and a refresh wipes what was seeded, so this is not a step
 *               anyone has to remember: `npm test` cannot start without it.
 *   2. VERIFY — the preflight asks search for each record the checks look for, inside the shop the
 *               tests will sign into, and stops the run if any is missing (preflight.ts).
 *
 * Only then does a test start. A seed step that fails stops the run with the step named, because a
 * suite running on half-seeded data does not fail — its checks stand down, and a standing-down suite
 * looks exactly like a suite that ran.
 *
 *   GS_SEED=check   measure what is there, create nothing, then verify
 *   GS_SEED=skip    do not seed — ONLY for re-running one spec locally against data you just seeded;
 *                   the preflight still runs and still stops a run on missing data
 */
import type { FullConfig } from 'playwright/test';
import seedEverything from './seed.js';
import preflight from './preflight.js';

export default async function globalSetup(config: FullConfig): Promise<void> {
  // 🔴 ONE WORKER, ENFORCED — NOT JUST CONFIGURED. Every sign-in ends the previous session of the
  // same account, so two workers log each other out and every test after that reads as a broken
  // environment. The config says workers: 1, but a CI command line (`--workers=4`, or sharding)
  // overrides it silently, so refuse here, before seeding, with the reason.
  if (config.workers > 1) {
    throw new Error(`This suite must run with ONE worker; this run asked for ${config.workers}. Each `
      + 'sign-in ends the same account\'s previous session, so parallel workers log each other out and '
      + 'every later test fails as if the environment were down. Drop --workers (or set --workers=1).');
  }
  const mode = (process.env.GS_SEED || 'on').toLowerCase();
  if (mode === 'skip' || mode === 'off') {
    console.log('\nseeding: SKIPPED (GS_SEED=skip). The preflight below still checks the data is there.');
  } else {
    await seedEverything();
  }
  await preflight();
}
