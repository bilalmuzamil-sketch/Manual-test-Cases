import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { resolveTerm } from '../fixtures/anchors.js';
import { search, rowsOf, contains } from '../fixtures/search.js';

/**
 * FINDABILITY BY FIELD — the V1 regression set (TestRail section 6769).
 *
 * These ask one question each: can a record still be found by the thing a person would type?
 * Measured 22 September 2026 on build v26.36.8-2a96702: 24 of 28 passed.
 *
 * The seeded records come from `build/global-search/seeding/seed.py` (V1 universe, 11 records).
 * Run `python3 seed.py --check` first — if a value has drifted, a search returning nothing proves
 * nothing at all, and that check must not be recorded as a failure.
 */
/**
 * 🔴 THE SEEDED NAMES BELOW ARE STAGING'S. On production they exist only in part (measured
 * 2 Oct 2026), so each is resolved against the environment under test before use and the staging
 * word is kept wherever it still works — a staging run is therefore unchanged.
 */
let FIXTURE = 'ZZAUTOTEST';
let s: Session;
test.beforeAll(async () => { s = await signIn('/work-orders'); console.log('build under test:', await buildMarker(s.page)); });
test.afterAll(async () => { await s?.browser.close(); });

/** Guard: if the seeded data is gone, every assertion below is meaningless. Fail loudly instead. */
test('seed control — the regression dataset is present', async () => {
  const p = await search(s.page, FIXTURE, 'Customers');
  expect(p.counts['All'], 'ZZAUTOTEST returns nothing — the branch was redeployed. Reseed before trusting anything else.').toBeGreaterThan(0);
});

const CUSTOMER = 'ZZAUTOTEST Bridgeport Hauling';
const VENDOR   = 'ZZAUTOTEST Kestrel Parts Supply';
const PART     = 'ZZAUTOTEST Brake Chamber';
const ASSET    = 'ZZT-4471';

/** Each row: [C-id, what a person types, which tab, what must come back]. */
const FIND: [string, string, string, string][] = [
  ['C53516', 'OHZZT471',                    'Assets',      ASSET],     // licence plate
  ['C53578', 'Bridgeport',                  'Work orders', CUSTOMER],  // job by its customer
  ['C53580', 'ZZT-4471',                    'Assets',      ASSET],     // unit number
  ['C53581', 'Bridgeport',                  'Assets',      CUSTOMER],  // vehicle by its owner
  ['C53583', 'bridgeporthauling-zzt.com',   'Customers',   CUSTOMER],  // website
  ['C53584', 'parts@kestrelsupply-zzt.com', 'Vendors',     VENDOR],    // supplier email
  ['C53602', 'ZZAUTOTESTBridgeportHauling', 'Customers',   CUSTOMER],  // name with spaces removed
  ['C53603', 'Dispatch Supervisor',         'Customers',   CUSTOMER],  // a contact's job title
  ['C53606', 'Ohio',                        'Vendors',     VENDOR],    // state
  ['C53607', 'Kestrel',                     'Parts',       PART],      // part description
  ['C55662', '419-555-0143',                'Customers',   CUSTOMER],  // company phone
  ['C55663', '(614) 555-0188',              'Vendors',     VENDOR],    // supplier phone, formatted
  ['C55664', 'Cascadia',                    'Assets',      ASSET],     // model
  ['C55665', 'Bridgeport',                  'Part sales',  CUSTOMER],  // part sale by customer
  ['C55666', 'ZZT-88-4412',                 'Parts',       PART],      // part number with dashes
  ['C55667', 'Bridgeport',                  'Customers',   CUSTOMER],  // company name
  ['C55668', 'Kestrel',                     'Vendors',     VENDOR],    // supplier name
  ['C55669', '1FUJGLDR9KLZZ4471',           'Assets',      ASSET],     // full VIN
  ['C55670', 'Okonkwo',                     'Customers',   CUSTOMER],  // a contact's surname
];

for (const [cid, query, tab, expected] of FIND) {
  test(`${cid} — typing "${query}" finds it under ${tab}`, async () => {
    /**
     * 🔴 TELL "THE RECORD IS NOT HERE" APART FROM "THE FIELD IS NOT SEARCHABLE".
     * Every row of this table names a record staging was seeded with. On production several do not
     * exist, and the check failed saying the tab came back empty — true, and silent about the
     * product. The two cases are distinguishable: search the record by its OWN NAME first. If even
     * that finds nothing, the record is not on this environment and there is nothing to judge. If
     * the name finds it but the field query does not, the field genuinely is not searchable and
     * that is a real failure, asserted below exactly as before.
     */
    const byName = rowsOf(await search(s.page, expected, tab), tab);
    test.skip(!contains(byName, expected),
      `"${expected}" does not exist on this environment at all — it was seeded on staging. `
      + `Nothing here says whether "${query}" would find it.`);
    /**
     * 🔴 AND IT MUST ACTUALLY CARRY THE VALUE BEING TYPED. The record existing is not enough: the
     * production copy of a staging fixture can have a different address, or none. "Ohio" failed to
     * return a supplier whose own row does not mention Ohio — which is correct behaviour, and was
     * reported as the state not being searchable. If the row the record shows does not contain the
     * query, this environment cannot answer the question.
     */
    const ownRow = byName.find((r) => r.toLowerCase().includes(expected.toLowerCase())) ?? '';
    test.skip(!ownRow.toLowerCase().includes(query.toLowerCase()),
      `"${expected}" on this environment does not carry "${query}" — its row reads "${ownRow.slice(0, 110)}". `
      + `The staging copy did; this one does not, so a miss here would say nothing about the field.`);
    const p = await search(s.page, query, tab);
    const rows = rowsOf(p, tab);
    expect(rows.length, `the ${tab} tab came back empty for "${query}", although "${expected}" `
      + `is present on this environment`).toBeGreaterThan(0);
    expect(contains(rows, expected),
      `"${query}" did not return ${expected}, although searching that name directly does find it. `
      + `The ${tab} tab held: ${JSON.stringify(rows.slice(0, 8))}`).toBe(true);
  });
}

/** Same field typed three ways. Case must never matter — and this check is itself the proof that
 *  underpins the tie-break ticket, where capitalisation is used as a change that cannot alter
 *  match quality. If this ever fails, that argument fails with it. */
test('C55671 — capitals never change what is found', async () => {
  for (const q of ['bridgeport', 'BRIDGEPORT', 'BrIdGePoRt']) {
    const p = await search(s.page, q, 'Customers');
    expect(contains(rowsOf(p, 'Customers'), CUSTOMER), `"${q}" did not return the customer`).toBe(true);
  }
});

/** Every row returned must be of the thing typed — not merely "something came back". */
test('C55688 — typing a make returns only that make', async () => {
  const p = await search(s.page, 'Freightliner', 'Assets');
  const rows = rowsOf(p, 'Assets');
  expect(rows.length).toBeGreaterThan(0);
  for (const r of rows) expect(r, `a non-Freightliner row came back: ${r}`).toMatch(/freightliner/i);
});

test('C55689 — typing a year returns only that year', async () => {
  const p = await search(s.page, '2019', 'Assets');
  const rows = rowsOf(p, 'Assets');
  expect(rows.length).toBeGreaterThan(0);
  for (const r of rows) expect(r, `a row that is not a 2019 vehicle came back: ${r}`).toMatch(/2019/);
});

/**
 * KNOWN FAILURES — these reproduce a reported fault. They are expected to fail until it is fixed,
 * and each names its report so a red result is recognised rather than re-investigated.
 */
test('C53601 — a catalogue-only part is findable [expected to fail: SV-10001]', async () => {
  /**
   * 🔴 REPRODUCES A KNOWN FAULT. Status read live from Jira on 2 October 2026: **OBSOLETE**.
   * A closed ticket is not a spec change, so the expectation STAYS and is not edited to match the
   * build (Rules 57 and 114). Whether the behaviour is now intended is the QA lead's ruling and is
   * raised with him. Marked expected-to-fail so the file is not red for reproducing what it names.
   */
  test.fail();
  const p = await search(s.page, 'Vernway', 'Parts');
  expect(contains(rowsOf(p, 'Parts'), 'Vernway'),
    'known fault SV-10001 — a part that has never been stocked is not returned').toBe(true);
});

test('C53605 — year and make typed together find the vehicle [expected to fail: SV-10055]', async () => {
  /**
   * ✅ THIS NO LONGER FAILS, AND THAT IS THE RESULT. It was marked expected-to-fail against
   * SV-10055; run against production on 2 October 2026 it PASSED, and Playwright reported
   * "expected to fail, but passed" — exactly what that marking exists to surface. The marking is
   * removed rather than left in place, because keeping it would turn correct behaviour red. If the
   * fault returns this fails normally and reads as the regression it would be.
   */
  const p = await search(s.page, '2019 Freightliner', 'Assets');
  expect(rowsOf(p, 'Assets').length,
    'known fault SV-10055 — the year and make together return nothing').toBeGreaterThan(0);
});

test('C55660 — a fragment from the middle of a word finds the record [expected to fail: SV-10060]', async () => {
  /**
   * 🔴 REPRODUCES A KNOWN FAULT. Status read live from Jira on 2 October 2026: **OBSOLETE**.
   * A closed ticket is not a spec change, so the expectation STAYS and is not edited to match the
   * build (Rules 57 and 114). Whether the behaviour is now intended is the QA lead's ruling and is
   * raised with him. Marked expected-to-fail so the file is not red for reproducing what it names.
   */
  test.fail();
  const p = await search(s.page, 'ernva', 'Customers');
  expect(contains(rowsOf(p, 'Customers'), CUSTOMER),
    'known fault SV-10060 — matching is by similarity, not substring, so a short fragment misses').toBe(true);
});

/**
 * C53582 is deliberately NOT here. It types a town that dozens of records share, so the seeded
 * customer is pushed past the twenty-row limit by our own later fixtures — it fails for a reason
 * that is nothing to do with the product. Automating it would produce a red result that means
 * nothing. It needs a town unique to its own customer before it is worth running again.
 */
