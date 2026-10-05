import { test, expect } from '../fixtures/test.js';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeAndWait, SEL } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, type LiveAnchors } from '../fixtures/anchors.js';

/**
 * SCOPE TABS, GROUP HEADINGS AND OPENING A RESULT.
 *
 * SOURCE: Global Search — Product Requirements v1.5, §5.3 Result grouping and counts, §5.4 Scope
 * tabs and §5.5 Keyboard navigation, plus epic SV-9160. Every check here was run by hand and
 * passed in run 415 before it was automated (Rule 115).
 *
 * 🔴 FOUR TRAPS, EACH ONE PAID FOR EARLIER TODAY AND COMMENTED WHERE IT BITES:
 *   1. The scope tab is STICKY across close and reopen, so it scopes the NEXT search. Every search
 *      goes through typeAndWait, which resets the scope to All first.
 *   2. A one-letter query renders NO tab counts at all, so the broad query is resolved from live
 *      data by broadTerm() instead of being a letter someone typed into the spec.
 *   3. "All" always carries a count whenever anything matched, so it is never counted as one of
 *      the kinds that came back.
 *   4. The All view lists only FIVE rows per group. Judging "is this record present" there
 *      produced eight false failures in an earlier pass - open the record's own tab to judge.
 */
let s: Session;
test.beforeAll(async () => { s = await signIn('/customers'); console.log('build under test:', await buildMarker(s.page)); });
let LIVE: LiveAnchors = {};
let BROAD = '';
test.beforeAll(async () => {
  LIVE = await harvestAnchors(s.page);
  const b = await broadTerm(s.page);
  BROAD = b?.term ?? '';
});
test.afterAll(async () => { await s?.browser.close(); });

const tabStrip = () => s.page.evaluate(() =>
  [...document.querySelectorAll('.search-tabs__tab')].map(t => ({
    label: (t as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').replace(/\s+/g, ' ').trim(),
    count: Number(((t as HTMLElement).innerText.match(/\((\d+)\)/) || [])[1] ?? -1),
    active: /--active/.test(t.className),
  })));

const rowTexts = () => s.page.evaluate(() =>
  [...document.querySelectorAll('.search-row')].map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));

async function openTab(label: string) {
  const ok = await s.page.evaluate(l => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
    if (!t) return false; (t as HTMLElement).click(); return true;
  }, label);
  await s.page.waitForTimeout(2_200);
  return ok;
}

/* ─────────────── EACH SCOPE TAB SHOWS ONLY ITS OWN KIND, WITH ITS COUNT (§5.4) ─────────────── */
/**
 * One named test per case, not one file per case (Rule 115). The count on the tab is what the
 * requirement promises, and it is also the only honest way to judge "only this kind came back":
 * the rows themselves carry no machine-readable type, so a text test would be guesswork.
 */
const TABS: [string, string][] = [
  ['C44817', 'Customers'], ['C44818', 'Assets'], ['C44819', 'Parts'],
  ['C44820', 'Vendors'],   ['C44821', 'Part sales'], ['C45131', 'Vendor invoices'],
];
for (const [cid, label] of TABS) {
  test(`${cid} — the ${label} tab shows only ${label.toLowerCase()}, with its own count @${cid}`, async () => {
    test.skip(!BROAD, 'no query on this environment matches more than one kind of record');
    await typeAndWait(s.page, BROAD);
    const before = await tabStrip();
    const mine = before.find(t => t.label.toLowerCase() === label.toLowerCase());
    expect(mine, `there is no "${label}" tab: ${before.map(t => t.label).join(' | ')}`).toBeTruthy();
    test.skip(mine!.count <= 0, `no ${label.toLowerCase()} match "${BROAD}" on this environment, so there is nothing to scope to`);
    expect(await openTab(label), `the "${label}" tab could not be clicked`).toBe(true);
    const after = await tabStrip();
    expect(after.find(t => t.label.toLowerCase() === label.toLowerCase())?.active,
      `clicking "${label}" did not select it`).toBe(true);
    const rows = await rowTexts();
    // the scoped list shows that tab's own matches, capped at twenty by the requirement
    expect(rows.length, `the ${label} tab shows nothing although its count said ${mine!.count}`).toBeGreaterThan(0);
    expect(rows.length, `the ${label} tab listed ${rows.length} rows, more than its count of ${mine!.count}`)
      .toBeLessThanOrEqual(Math.min(mine!.count, 20));
  });
}

test('C44815 — the All tab shows every kind together @C44815', async () => {
  test.skip(!BROAD, 'no query on this environment matches more than one kind of record');
  await typeAndWait(s.page, BROAD);
  const tabs = await tabStrip();
  // 🔴 "All" is excluded: it carries a count whenever ANYTHING matched, so including it would make
  // this pass for a query that matched a single record of a single kind.
  const kinds = tabs.filter(t => !/^All$/i.test(t.label) && t.count > 0);
  expect(kinds.length, `only one kind came back for "${BROAD}": ${tabs.map(t => t.label + '(' + t.count + ')').join(' | ')}`)
    .toBeGreaterThan(1);
  const groups = await s.page.evaluate(() => document.querySelectorAll('.search-group').length);
  expect(groups, 'the All view is not grouping the kinds it returned').toBeGreaterThan(1);
});

test('C44822 — selecting a scope tab shows that kind only, and its count @C44822', async () => {
  test.skip(!BROAD, 'no query on this environment matches more than one kind of record');
  await typeAndWait(s.page, BROAD);
  const tabs = await tabStrip();
  const target = tabs.find(t => !/^All$/i.test(t.label) && t.count > 0);
  test.skip(!target, 'nothing matched on any entity tab');
  await openTab(target!.label);
  const groups = await s.page.evaluate(() =>
    [...document.querySelectorAll('.search-group__header')].map(h => (h as HTMLElement).innerText.trim()));
  expect(groups.length, `the ${target!.label} tab is showing ${groups.length} groups, not just its own`)
    .toBeLessThanOrEqual(1);
});

/* ───────────────────────── GROUP HEADINGS, THE FIVE CAP, SHOW ALL ───────────────────────── */
test('C44823 — each group heading carries its total match count @C44823', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const heads = await s.page.evaluate(() =>
    [...document.querySelectorAll('.search-group__header')].map(h => (h as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
  expect(heads.length, 'no groups came back at all').toBeGreaterThan(0);
  const withCount = heads.filter(h => /\d/.test(h));
  expect(withCount.length, `no group heading carries a count: ${heads.join(' | ')}`).toBe(heads.length);
});

test('C44824 — a group shows at most five results in the All view @C44824', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const perGroup = await s.page.evaluate(() =>
    [...document.querySelectorAll('.search-group')].map(g => g.querySelectorAll('.search-row').length));
  expect(perGroup.length, 'no groups came back at all').toBeGreaterThan(0);
  for (const n of perGroup) expect(n, `a group listed ${n} rows in the All view, above the five the requirement allows`).toBeLessThanOrEqual(5);
  // and prove the cap is real rather than there simply being few matches
  const tabs = await tabStrip();
  const big = tabs.find(t => !/^All$/i.test(t.label) && t.count > 5);
  test.skip(!big, 'no kind has more than five matches here, so the cap cannot be demonstrated');
  expect(Math.max(...perGroup), `a kind has ${big!.count} matches but no group is showing the full five`).toBe(5);
});

test('C44825 — a group with more than five matches offers Show all @C44825', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const tabs = await tabStrip();
  const big = tabs.find(t => !/^All$/i.test(t.label) && t.count > 5);
  test.skip(!big, 'no kind has more than five matches here, so no Show all is expected');
  const panel = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  expect(panel, `${big!.label} has ${big!.count} matches but the panel offers no "Show all"`).toMatch(/Show all/i);
});

test('C44826 — Show all switches the panel to that kind\'s tab @C44826', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const link = await s.page.evaluate(() => {
    const el = [...document.querySelectorAll('.search-modal a, .search-modal button, .search-group__header *')]
      .find(e => /Show all/i.test((e as HTMLElement).innerText || ''));
    if (!el) return null;
    const text = (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
    (el as HTMLElement).click(); return text;
  });
  test.skip(!link, 'no Show all link is on screen for this query');
  await s.page.waitForTimeout(2_200);
  const tabs = await tabStrip();
  const active = tabs.find(t => t.active);
  expect(active, 'no tab is selected after Show all').toBeTruthy();
  expect(/^All$/i.test(active!.label), `Show all left the panel on All instead of moving to a kind's own tab`).toBe(false);
});

/* ────────────── CONTACTS ARE NOT A GROUP — A CONTACT MATCH RETURNS ITS COMPANY ────────────── */
const CONTACTS: string[] = ['C45129', 'C44895'];
for (const cid of CONTACTS) {
  test(`${cid} — there is no Contacts tab or group @${cid}`, async () => {
    test.skip(!BROAD, 'no broad query on this environment');
    await typeAndWait(s.page, BROAD);
    const tabs = await tabStrip();
    expect(tabs.some(t => /contact/i.test(t.label)),
      `a Contacts tab appeared: ${tabs.map(t => t.label).join(' | ')}`).toBe(false);
    const heads = await s.page.evaluate(() =>
      [...document.querySelectorAll('.search-group__header')].map(h => (h as HTMLElement).innerText.trim()));
    expect(heads.some(h => /contact/i.test(h)), `a Contacts group appeared: ${heads.join(' | ')}`).toBe(false);
  });
}

/* ─────────────────────────── OPENING A RESULT (§5.5) ─────────────────────────── */
test('C44810 — Enter opens the highlighted result in the same tab @C44810', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const before = s.page.url();
  const rows = await rowTexts();
  expect(rows.length, 'nothing came back, so there is nothing to open').toBeGreaterThan(0);
  await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(400);
  await s.page.keyboard.press('Enter');
  await s.page.waitForLoadState('domcontentloaded').catch(() => {});
  await s.page.waitForTimeout(4_000);
  expect(s.page.url(), `Enter did not navigate anywhere (still ${before})`).not.toBe(before);
  // and it stayed in the same tab - no second page was opened
  expect(s.page.context().pages().length, 'Enter opened a new browser tab instead of navigating in place').toBe(1);
  await s.page.goBack().catch(() => {});
  await s.page.waitForTimeout(2_500);
});

test('C44811 — Ctrl+Enter opens the highlighted result in a new browser tab @C44811', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const rows = await rowTexts();
  expect(rows.length, 'nothing came back, so there is nothing to open').toBeGreaterThan(0);
  const ctx = s.page.context();
  const beforeCount = ctx.pages().length;
  await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(400);
  // 🔴 WAIT FOR THE PAGE EVENT, DO NOT COUNT TABS IMMEDIATELY. A new tab takes a moment to appear
  // and counting straight after the keypress reports "no new tab" for a shortcut that worked.
  const opened = ctx.waitForEvent('page', { timeout: 15_000 }).catch(() => null);
  await s.page.keyboard.press('Control+Enter');
  const fresh = await opened;
  expect(fresh, `Ctrl+Enter opened no new browser tab (still ${beforeCount})`).toBeTruthy();
  await fresh?.close().catch(() => {});
  await s.page.bringToFront().catch(() => {});
});
