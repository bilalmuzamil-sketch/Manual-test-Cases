/**
 * Where the suite's own data files live — resolved from THIS FILE, never from the working directory.
 *
 * 🔴 TWO WAYS THESE PATHS USED TO BREAK, BOTH OUTSIDE THIS ONE MACHINE.
 *   1. They pointed OUTSIDE the suite (`../staging-run-2026-09-29/…`), so copying the e2e folder
 *      anywhere — another repository, or a CI checkout of just this folder — lost them.
 *   2. They were relative to the WORKING DIRECTORY. CI commonly runs Playwright from the repository
 *      root (`npx playwright test -c build/global-search/e2e/playwright.config.ts`), and from there
 *      every one of them resolved to a folder that does not exist.
 * So the files are kept in `e2e/data/` and found relative to the code that reads them. An
 * environment variable still overrides each, for a run that deliberately points elsewhere.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const E2E_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_DIR = path.join(E2E_DIR, 'data');

/** The folder holding entity-config.json and held-terms-found.json. */
export const entityConfigDir = (): string => process.env.GS_ENTITY_CONFIG || DATA_DIR;
/** The retest plan the full-value checks read. */
export const retestPlanPath = (): string => process.env.GS_RETEST_PLAN || path.join(DATA_DIR, 'retest-plan.json');

import fs from 'node:fs';
/**
 * The seeding engine. Looked for INSIDE the suite first (e2e/seeding/ — what a self-contained copy
 * of this folder carries), then beside it (../seeding/ — this repository's layout). GS_SEEDING_DIR
 * overrides. Never assumed: a missing engine stops the run with a sentence, rather than every test
 * standing down for lack of data later.
 */
export function seedingDir(): string {
  const tries = [process.env.GS_SEEDING_DIR, path.join(E2E_DIR, 'seeding'), path.resolve(E2E_DIR, '..', 'seeding')]
    .filter(Boolean) as string[];
  const hit = tries.find((d) => fs.existsSync(path.join(d, 'seed.py')));
  if (!hit) {
    throw new Error('The seeding engine was not found. Looked in: ' + tries.join(' · ')
      + '. It lives in build/global-search/seeding in the repository; a copy of this suite needs it '
      + 'as e2e/seeding, or GS_SEEDING_DIR pointing at it.');
  }
  return hit;
}
