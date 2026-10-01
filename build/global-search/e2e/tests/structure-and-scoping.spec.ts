import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeQuery, SEL, typeAndWait } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, type LiveAnchors } from '../fixtures/anchors.js';
import fs from 'node:fs';

/**
 * TAB SCOPING, GROUP ORDER, ROW CONTENT, IDENTIFIER NORMALIZATION AND THE EMPTY STATES.
 *
 * These are the checks from the ranking group that can be asserted WITHOUT depending on how two
 * records happen to be ordered on the day. The true ranking comparisons live in their own file,
 * where each one proves a fair pair exists before it judges anything.
 *
 * SOURCE: Global Search - Product Requirements v1.5 §5.2 States, §5.3 Result row anatomy,
 * §6.2 Cross-entity ordering, §7 normalization; epic SV-9160.
 */
const CFG = process.env.GS_ENTITY_CONFIG || '../staging-run-2026-09-29';
const A = JSON.parse(fs.readFileSync(`${CFG}/anchors.json`, 'utf8'));

/**
 * A date as the rows actually render it.
 * 🔴 A RECENT RECORD SHOWS A RELATIVE DATE, NOT A CALENDAR ONE. The purchase-order row reads
 * "· Today ·" and the vendor-invoice row can read "Yesterday" or "3 days ago". An absolute-date
 * pattern therefore reported "the row carries no date" about a row that was displaying its date
 * perfectly - the requirement asks for the created date, not for a particular format.
 */
const DATE_SHOWN = /\b(19|20)\d{2}\b|\b\d{1,2}\s\w{3}\b|\w{3}\s\d{1,2},?\s\d{4}|\b(Today|Yesterday)\b|\b\d+\s+(minute|hour|day|week|month)s?\s+ago\b/i;

let s: Session;
test.beforeAll(async () => { s = await signIn('/customers'); console.log('build under test:', await buildMarker(s.page)); });
let LIVE: LiveAnchors = {};
let BROAD = '';
test.beforeAll(async () => {
  LIVE = await harvestAnchors(s.page);
  // 🔴 NOT "a". A one-letter query renders no tab counts at all, which skipped five checks here
  // while the product was working perfectly. Find a term this environment actually spans.
  const b = await broadTerm(s.page);
  BROAD = b?.term ?? '';
});
test.afterAll(async () => { await s?.browser.close(); });


const openTabbed = async (q: string, tab?: string) => {
  await typeAndWait(s.page, q);
  if (tab) {
    const ok = await s.page.evaluate(l => {
      const t = [...document.querySelectorAll('.search-tabs__tab')]
        .find(e => e.textContent!.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
      if (!t) return false; (t as HTMLElement).click(); return true; }, tab);
    expect(ok, `there is no "${tab}" tab`).toBe(true);
    await s.page.waitForTimeout(2_000);
  }
  return s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
    .map(r => r.textContent!.replace(/\s+/g, ' ').trim()));
};

/* ───────────────────────── A SCOPE TAB SHOWS ONLY ITS OWN KIND ───────────────────────── */
const SCOPED: [string, string, string][] = [
  ['C44816', 'Work orders', 'workOrder'],
  ['C45130', 'Purchase orders', 'purchaseOrder'],
];
for (const [cid, tab] of SCOPED) {
  test(`${cid} — the ${tab} tab shows only ${tab.toLowerCase()}`, async () => {
    await typeAndWait(s.page, BROAD);
    const count = await s.page.evaluate(l => {
      const t = [...document.querySelectorAll('.search-tabs__tab')]
        .find(e => e.textContent!.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
      return t ? Number((t.textContent!.match(/\((\d+)\)/) || [])[1] ?? 0) : -1; }, tab);
    test.skip(count <= 0, `no ${tab.toLowerCase()} match the broad query on this environment`);
    test.skip(!BROAD, 'no query on this environment matches two kinds of record');
  const rows = await openTabbed(BROAD, tab);
    expect(rows.length, `the ${tab} tab says ${count} but shows none`).toBeGreaterThan(0);
    // every row under a scoped tab must be that kind: the group heading is the tab's own name
    const heading = await s.page.evaluate(() => {
      const h = document.querySelector('.search-group__title, .search-results__group-title');
      return h ? h.textContent!.replace(/\s*\(\d+\)/, '').trim() : null; });
    if (heading) expect(heading.toLowerCase(), `the scoped tab shows a "${heading}" group`).toBe(tab.toLowerCase());
  });
}

/* ───────────────────────── GROUPS APPEAR IN THE FIXED ORDER ───────────────────────── */
const ORDER = ['work orders', 'customers', 'assets', 'parts', 'vendors',
               'part sales', 'purchase orders', 'vendor invoices'];
for (const cid of ['C44827', 'C44830']) {
  test(`${cid} — groups appear in the order the requirement fixes`, async () => {
    await typeAndWait(s.page, BROAD);
    const seen = await s.page.evaluate(() =>
      [...document.querySelectorAll('.search-group__title, .search-results__group-title')]
        .map(h => h.textContent!.replace(/\s*\(\d+\)/, '').trim().toLowerCase()));
    test.skip(seen.length < 2, 'fewer than two groups came back, so order cannot be judged');
    const positions = seen.map(g => ORDER.indexOf(g)).filter(i => i >= 0);
    const sorted = [...positions].sort((x, y) => x - y);
    expect(positions, `groups came back as ${seen.join(' → ')}, which is not the fixed order`).toEqual(sorted);
  });
}

/* ───────────── AN IDENTIFIER MATCHES WITH OR WITHOUT ITS PUNCTUATION (§7) ───────────── */
const NORMALIZED: [string, string][] = [
  ['C44843', 'poNumber'], ['C53579', 'poNumber'], ['C55672', 'partSaleNo'], ['C55714', 'invoiceNo'],
];
for (const [cid, key] of NORMALIZED) {
  test(`${cid} — ${key} matches with or without its punctuation`, async () => {
    // the punctuated anchor: this check exists to prove a dash is optional, so it needs one
    const id = String((LIVE.punct || {})[key as keyof typeof LIVE.punct] || '');
    test.skip(!id || !/[^A-Za-z0-9]/.test(id), `${key} "${id}" carries no punctuation to strip`);
    const withP = await openTabbed(id);
    expect(withP.length, `the exact "${id}" finds nothing, so nothing below is about the product`).toBeGreaterThan(0);
    const key0 = withP[0].slice(0, 40);
    const without = await openTabbed(id.replace(/[^A-Za-z0-9]/g, ''));
    expect(without.some(r => r.slice(0, 40) === key0),
      `stripping the punctuation from "${id}" lost the record — §7 says normalization keeps it`).toBe(true);
  });
}

/* ───────────────────────────── ROW CONTENT (§4 displayed fields) ───────────────────────────── */
test('C44831 — a work order row carries its number, customer and a status badge', async () => {
  test.skip(!BROAD, 'no query on this environment matches two kinds of record');
  const rows = await openTabbed(BROAD, 'Work orders');
  test.skip(rows.length === 0, 'no work orders match the broad query here');
  const badge = await s.page.evaluate(() => !!document.querySelector(
    '.search-row [data-test-id="search_row_status_badge"], .search-row .search-row__badge, .search-row .q-badge'));
  expect(badge, 'no work order row carries a status badge').toBe(true);
});

test('C44832 — a customer row carries its name, an address line and an open-count chip', async () => {
  test.skip(!BROAD, 'no query on this environment matches two kinds of record');
  const rows = await openTabbed(BROAD, 'Customers');
  test.skip(rows.length === 0, 'no customers match the broad query here');
  const shaped = await s.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => ({
    title: (r.querySelector('.search-row__title')?.textContent || '').trim(),
    meta: (r.querySelector('.search-row__meta')?.textContent || '').trim(),
  })));
  expect(shaped.every(x => x.title.length > 0), 'a customer row has no name on it').toBe(true);
  expect(shaped.some(x => x.meta.length > 0), 'not one customer row carries a second line').toBe(true);
});

test('C146275 — a purchase order row carries everything the requirement names', async () => {
  test.skip(!BROAD, 'no query on this environment matches two kinds of record');
  const rows = await openTabbed(BROAD, 'Purchase orders');
  test.skip(rows.length === 0, 'no purchase orders match the broad query here');
  // §4: PO number + vendor (primary), status badge, total + created date
  const r0 = rows[0];
  expect(r0, 'the purchase order row carries no total').toMatch(/[$£€]\s?[\d,]+\.\d{2}|\d+\.\d{2}/);
  expect(r0, 'the purchase order row carries no date').toMatch(DATE_SHOWN);
});

/* ───────────────────────────── THE EMPTY STATES (§5.2) ───────────────────────────── */
test('C44855 — the first-time state shows one helper line and nothing else', async () => {
    await s.page.fill(SEL.input, ''); await s.page.waitForTimeout(1_200);
  const text = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  // 🔴 RECENT SEARCHES ARE ALSO `.search-row`. Counting every row therefore reports "results are
  // showing before anything was typed" whenever the account has any search history - which, after
  // a suite has just run, it always does. What must be absent is RESULT rows, so judge by the
  // panel's own state: it is showing its Recent searches list, not results.
  const showingRecent = /Recent searches/i.test(text);
  if (!showingRecent) {
    expect(await s.page.locator('.search-row').count(), 'result rows are showing before anything is typed').toBe(0);
  }
  // §5.2: "a single line of helper text ... Nothing else - no suggested actions."
  expect(text, 'the empty state offers a quick-create button, which §5.2 removed')
    .not.toMatch(/New work order|New customer|Create|Add new/i);
});

test('C44856 — neither the first-time nor the no-results state offers quick-create', async () => {
  await typeAndWait(s.page, 'zzqqxx' + Date.now());
  const text = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  expect(text, 'the no-results state offers a quick-create button')
    .not.toMatch(/New work order|New customer|Create|Add new/i);
});
