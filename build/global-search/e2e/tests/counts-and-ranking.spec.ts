import { test, expect } from 'playwright/test';
import { signIn, buildMarker, api, type Session } from '../fixtures/auth.js';
import { search, rowsOf, contains, positionOf, waitForIndex } from '../fixtures/search.js';

/**
 * COUNTS AND RANKING — the twenty-row limit, and the order records come back in.
 *
 * Two live reports are reproduced here: SV-10320 (counts above the limit) and SV-10340 (the
 * most-recently-updated tie-break). Both are expected red until fixed.
 */
let s: Session;
test.beforeAll(async () => { s = await signIn('/work-orders'); console.log('build under test:', await buildMarker(s.page)); });
test.afterAll(async () => { await s?.browser.close(); });

/**
 * C53476 — nothing in the panel may read higher than 20.
 * Requirement §5.2: "No count in the modal reads higher than 20 — not a tab, not a group header,
 * not the Show all N link." The per-type tabs obey it; the All tab adds them together.
 */
test('C53476 — no count reads higher than 20 [expected to fail: SV-10320]', async () => {
  const p = await search(s.page, 'ZZ');
  const over = Object.entries(p.counts).filter(([, v]) => (v ?? 0) > 20);
  // The per-type tabs are correct — assert that too, so a regression there is not hidden by the known fault.
  for (const [tab, v] of Object.entries(p.counts)) {
    if (tab !== 'All' && v !== null) expect(v, `the ${tab} tab reads ${v}`).toBeLessThanOrEqual(20);
  }
  expect(over,
    `known fault SV-10320 — these read above the limit: ${JSON.stringify(over)}. ` +
    `The All figure is the per-type figures added together.`).toHaveLength(0);
});

/**
 * C45137 — a purchase order still on order outranks a received one, and newer outranks older.
 * The third part of this check (a boost for one you raised yourself) is NOT automated: nothing on
 * the branch gives two purchase orders alike except their author, and the author is not on the row.
 */
test('C45137 — still-ordered purchase orders rank above received ones', async () => {
  const p = await search(s.page, '5 Star Truck Repair', 'Purchase orders');
  const rows = rowsOf(p, 'Purchase orders');
  expect(rows.length).toBeGreaterThan(1);
  const state = (r: string) => /partial delivery/i.test(r) ? 'Partial'
    : /\bordered\b/i.test(r) ? 'Ordered' : /fulfilled|received/i.test(r) ? 'Received' : '?';
  const seq = rows.map(state);
  const lastOrdered = seq.lastIndexOf('Ordered');
  const firstReceived = seq.indexOf('Received');
  if (lastOrdered >= 0 && firstReceived >= 0) {
    expect(lastOrdered, `a received order is above a still-ordered one: ${JSON.stringify(seq)}`).toBeLessThan(firstReceived);
  }
  // NOT asserted: where "Partial Delivery" belongs. The requirement never mentions that state, so
  // there is no right answer to test against — it is an open product-owner question, not a fault.
  console.log('state order, for the record:', JSON.stringify(seq));
});

test('C45138 — unpaid supplier invoices rank above paid ones', async () => {
  const p = await search(s.page, 'ZZ', 'Vendor invoices');
  const rows = rowsOf(p, 'Vendor invoices');
  const state = (r: string) => /unpaid/i.test(r) ? 'Unpaid'
    : /partially paid/i.test(r) ? 'Partially Paid' : /\bpaid\b/i.test(r) ? 'Paid' : '?';
  const seq = rows.map(state);
  test.skip(!(seq.includes('Unpaid') && seq.includes('Paid')),
    'needs both a paid and an unpaid invoice in one result set — mark one paid to run this');
  expect(seq.lastIndexOf('Unpaid'),
    `a paid invoice is above an unpaid one: ${JSON.stringify(seq)}`).toBeLessThan(seq.indexOf('Paid'));
});

/**
 * C55716 — when two records tie, the one changed most recently comes first.
 * Requirement §6.1: "ties are broken by recency (most recently updated wins)". That sentence sits
 * after all the per-type scoring, so it applies on every tab.
 *
 * 🔴 WHY THE FIXTURE IS BUILT THIS WAY, after seven that did not work. The nudge has to satisfy
 * BOTH of these, and almost nothing does:
 *   · it must be a field search INDEXES, so the entry is rebuilt and the edit can be seen; and
 *   · it must NOT move anything the ranking scores, or the climb proves nothing.
 * Changing a capital letter to a small one does both: the name is indexed, and matching is
 * case-blind (see C55671), so the two records still match the typed text identically.
 * Rejected: engine hours (not indexed), assigning a technician (returns success, saves nothing),
 * adding a job line (flips the job to Approved, and open status outranks the tie-break).
 */
test('C55716 — the record changed most recently is listed first [expected to fail: SV-10340]', async () => {
  test.setTimeout(240_000);
  const tag = 'ZZE2E' + Date.now().toString().slice(-5);
  const shared = `${tag} Halloway Brothers`;
  const lowered = `${tag} Halloway brothers`;

  // Two suppliers, identical in every matched field. The product allows duplicate VENDOR names
  // (it refuses duplicate CUSTOMER names — "Company with provided name already exists").
  const made: string[] = [];
  for (let i = 0; i < 2; i++) {
    const r = await api(s.page, 'POST', '/api/parts-catalogue/add-vendor', {
      name: shared, email: `e2e@${tag.toLowerCase()}.com`,
      tax_id: '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b',      // a tax RECORD id, not a tax number
      credit_term: 'Net 30', credit_limit: 1000,            // a CreditTerms string, never the integer 30
      telephone: '(264) 555-0900', address_1: '9 Tie Street', city: 'Fernvale',
      state_or_province: 'Ohio', postal_code: '44872',
    });
    expect(r.status, `could not create supplier ${i + 1}: ${r.text}`).toBeLessThan(400);
    made.push((r.body as any)?.data?.vendor_id);
  }

  expect(await waitForIndex(s.page, tag, 'Vendors', shared), 'the two suppliers never appeared in search').toBe(true);
  const before = rowsOf(await search(s.page, tag, 'Vendors'), 'Vendors');
  expect(before.length, 'both suppliers must come back for there to be a tie').toBeGreaterThanOrEqual(2);

  // Edit the one listed SECOND. Editing the one already on top proves nothing either way.
  const list = await api(s.page, 'GET', '/api/parts-catalogue/vendors?pagination[rowsPerPage]=250');
  const mine = ((list.body as any)?.data?.collection ?? []).filter((v: any) => String(v.name).includes(tag));
  const target = mine[1] ?? mine[0];
  const w = await api(s.page, 'POST', '/api/parts-catalogue/change-vendor', { ...target, vendor_id: target.id, id: target.id, name: lowered });
  expect(w.status, `the rename was refused: ${w.text}`).toBeLessThan(400);

  // The edit appearing in the results IS the proof the entry rebuilt. Without it, a stale order
  // says nothing about the rule — which is what made seven earlier attempts worthless.
  expect(await waitForIndex(s.page, tag, 'Vendors', lowered),
    'the rename never showed, so the entry did not rebuild and the ranking cannot be judged').toBe(true);

  const after = rowsOf(await search(s.page, tag, 'Vendors'), 'Vendors');
  expect(positionOf(after, lowered),
    `known fault SV-10340 — the supplier edited seconds ago is not first. Order: ${JSON.stringify(after.map((r) => r.slice(0, 44)))}`).toBe(0);
});

/** Same rule, second tab. Two independent tabs failing one shared rule is what points at the
 *  shared scoring step rather than at either record type. */
test('C55716 (customers) — the customer changed most recently is listed first [expected to fail: SV-10340]', async () => {
  test.setTimeout(240_000);
  const p = await search(s.page, 'ZZTIEBREAK', 'Customers');
  const rows = rowsOf(p, 'Customers');
  test.skip(rows.length < 2, 'needs the ZZTIEBREAK pair — run the ranking seeder first');

  const list = await api(s.page, 'GET', '/api/customers?pagination[rowsPerPage]=50&search=ZZTIEBREAK');
  const all = ((list.body as any)?.data?.collection ?? []);
  const secondName = rows[1].split(/\s{2,}|·/)[0].trim();
  const target = all.find((c: any) => secondName.includes(c.name)) ?? all[1];
  const lowered = String(target.name).replace(/(\w)(\w*)$/, (_m, a, b) => a.toLowerCase() + b);

  const cur = await api(s.page, 'GET', `/api/customers/view/${target.id}`);
  const w = await api(s.page, 'POST', '/api/customers/change',
    { ...(cur.body as any)?.data?.company, company_id: target.id, id: target.id, name: lowered });
  expect(w.status, `the rename was refused: ${w.text}`).toBeLessThan(400);

  expect(await waitForIndex(s.page, 'ZZTIEBREAK', 'Customers', lowered),
    'the rename never showed, so the entry did not rebuild').toBe(true);
  const after = rowsOf(await search(s.page, 'ZZTIEBREAK', 'Customers'), 'Customers');
  expect(positionOf(after, lowered),
    `known fault SV-10340 — the customer edited seconds ago is not first. Order: ${JSON.stringify(after)}`).toBe(0);
});
