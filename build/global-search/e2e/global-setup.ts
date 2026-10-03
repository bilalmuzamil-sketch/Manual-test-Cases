/**
 * RUNS ONCE, BEFORE THE FIRST TEST, EVERY TIME: seed, then check the data is there.
 *
 *   1. SEED   — every record every test reads, on whatever environment GS_APP names (seed.ts).
 *               The branch is refreshed to a standard starting copy, which removes what was seeded,
 *               so this is not a step anyone has to remember: `npm test` cannot start without it.
 *               A record that is ALREADY THERE is found and used, never created twice.
 *   2. CHECK  — the preflight asks search for each record the checks look for, inside the shop the
 *               tests sign into, and names any that is missing (preflight.ts).
 *
 * 🔴 NOTHING HERE STALLS THE RUN (QA lead, 2026-10-02). A seeding step that fails, or a record that is
 * missing, is reported loudly — and then the tests run. The ones that needed the missing data stand
 * down and say so; every other test still gives a result. One bad record must not cost the results of
 * three hundred tests. GS_SEED_STRICT=1 / GS_PREFLIGHT=enforce stop at the first problem instead.
 *
 *   GS_SEED=check   measure what is there, create nothing, then check
 *   GS_SEED=skip    do not seed — ONLY for re-running one spec locally against data you just seeded
 */
import type { FullConfig } from 'playwright/test';
import seedEverything from './seed.js';
import preflight from './preflight.js';
import { writeRunStatus } from './fixtures/data.js';
import { resetTechnicianRole } from './fixtures/roles.js';

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
  writeRunStatus('run', { app: process.env.GS_APP || null, started: new Date().toISOString() }, true);
  const mode = (process.env.GS_SEED || 'on').toLowerCase();
  if (mode === 'skip' || mode === 'off') {
    console.log('\nseeding: SKIPPED (GS_SEED=skip). The preflight below still checks the data is there.');
    writeRunStatus('seeding', { completed: false, skipped: true, failed_steps: [] });
  } else {
    await seedEverything();
  }
  // Before any test: put the Technician role back to its template and record that proven default.
  // The access checks edit this role and restore it to exactly this (see fixtures/roles.ts).
  await resetTechnicianRole();
  await preflight();
}
