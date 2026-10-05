/**
 * The suite's `test`: Playwright's own, plus one automatic step before every test - the per-test data
 * check (fixtures/data-check.ts): the records THIS test needs are confirmed on the branch, missing ones
 * are seeded, and a test whose data still cannot be made stands down naming it before it starts.
 * Every spec imports `test` and `expect` from here, not from 'playwright/test'.
 */
import { test as base, expect } from 'playwright/test';
import { ensureTestData } from './data-check.js';

export const test = base.extend<{ _testData: void }>({
  _testData: [async ({}, use, testInfo) => {
    await ensureTestData(testInfo);
    await use();
  }, { auto: true }],
});
export { expect };
export type { Page, TestInfo } from 'playwright/test';
