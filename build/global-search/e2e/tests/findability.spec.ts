import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
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
let s: Session;
test.beforeAll(async () => { s = await signIn('/work-orders'); console.log('build under test:', await buildMarker(s.page)); });
test.afterAll(async () => { await s?.browser.close(); });

/** Guard: if the seeded data is gone, every assertion below is meaningless. Fail loudly instead. */
test('seed control — the regression dataset is present', async () => {
  const p = await search(s.page, 'ZZAUTOTEST', 'Customers');
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
    const p = await search(s.page, query, tab);
    const rows = rowsOf(p, tab);
    expect(rows.length, `the ${tab} tab came back empty for "${query}"`).toBeGreaterThan(0);
    expect(contains(rows, expected),
      `"${query}" did not return ${expected}. The ${tab} tab held: ${JSON.stringify(rows.slice(0, 8))}`).toBe(true);
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
  const p = await search(s.page, 'Vernway', 'Parts');
  expect(contains(rowsOf(p, 'Parts'), 'Vernway'),
    'known fault SV-10001 — a part that has never been stocked is not returned').toBe(true);
});

test('C53605 — year and make typed together find the vehicle [expected to fail: SV-10055]', async () => {
  const p = await search(s.page, '2019 Freightliner', 'Assets');
  expect(rowsOf(p, 'Assets').length,
    'known fault SV-10055 — the year and make together return nothing').toBeGreaterThan(0);
});

test('C55660 — a fragment from the middle of a word finds the record [expected to fail: SV-10060]', async () => {
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
