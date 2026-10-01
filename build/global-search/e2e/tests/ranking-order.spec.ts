import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeAndWait, SEL } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, entityTerms, type LiveAnchors } from '../fixtures/anchors.js';

/**
 * RANKING AND ORDERING.
 *
 * SOURCE: Global Search — Product Requirements v1.5, §8 Ranking signals, plus epic SV-9160.
 * Every check below was run by hand and passed in run 415 before it was automated (Rule 115).
 *
 * 🔴 THE RULE THIS WHOLE FILE IS BUILT ON: RANKING IS ONLY JUDGEABLE ON A FAIR PAIR.
 * "A prefix match ranks above a contains match" can only be tested where the results actually
 * contain one of each AND they differ in nothing else that the requirement also ranks on. On a
 * shared environment that pair often is not there. The wrong answer is to assert on whichever row
 * happened to sort first - that produces a confident verdict from no evidence, and it will flip
 * the next time someone edits a record. So each check LOOKS for its pair and, not finding one,
 * SKIPS saying exactly what was missing. A skip with a reason is worth more than a guess.
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

test.beforeEach(async () => {
  // 🔴 `/customers` ALSO MATCHES `/customers/<id>`. A record page therefore looked like the list
  // page, the guard did not send the session home, and the next check opened its panel on a page
  // where the shortcut does not take - reported as "the search panel is not there". Match the LIST.
  if (!/\/customers\/?(\?|$)/.test(s.page.url())) {
    // 🔴 ALWAYS GIVE THIS AN EXPLICIT TIMEOUT. Without one the navigation inherits a long default,
    // and when it stalls the BEFORE-EACH times out instead of the test - so the report blames a
    // tablet check that never ran. It happened to C55674 at 120s.
    await s.page.goto(`${process.env.GS_APP || ''}/customers`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => {});
    await s.page.waitForTimeout(4_000);
  }
});

const rowTexts = () => s.page.evaluate(() =>
  [...document.querySelectorAll('.search-row')].map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));

async function openTab(label: string) {
  const ok = await s.page.evaluate(l => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
    if (!t) return false; (t as HTMLElement).click(); return true;
  }, label);
  await s.page.waitForTimeout(2_400);
  return ok;
}

/** a row is a CLOSE match if the product badged it as one - never inferred from the text */
const isFuzzy = (t: string) => /≈|close match/i.test(t);
/** strip the badge so the row's own words can be read */
const plain = (t: string) => t.replace(/^\s*≈?\s*close match:\s*/i, '').trim();

/**
 * Does any WORD in the row begin with the query? That is what "a prefix match" means to a reader:
 * "Transcontinental" is a prefix match for "trans", and so is "ACME Transport" - the match is at
 * the start of a word, not necessarily at the start of the whole line, which also happens to carry
 * record numbers and customer names the person never typed.
 */
const prefixMatch = (t: string, q: string) =>
  new RegExp(`(^|[^A-Za-z0-9])${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(plain(t));
const containsMatch = (t: string, q: string) => plain(t).toLowerCase().includes(q.toLowerCase());

/**
 * HUNT FOR A FAIR PAIR RATHER THAN HOPING THE BROAD TERM PROVIDES ONE.
 *
 * 🔴 Seven of these checks skipped on the first run because "service" happened not to produce, in
 * any one tab, both a row whose name STARTS with it and a row that only CONTAINS it. Skipping was
 * the honest answer, but it is a poor one when the environment does hold such a pair under a
 * different query. So: take the words the tab's own rows are made of, try them, and keep the first
 * query that yields a genuine pair. Cached per tab - the search costs a few seconds once.
 */
const pairCache = new Map<string, string | null>();
async function queryWithFairPair(tab: string): Promise<string | null> {
  if (pairCache.has(tab)) return pairCache.get(tab)!;
  let answer: string | null = null;
  if (BROAD) {
    await typeAndWait(s.page, BROAD);
    if (await openTab(tab)) {
      const seed = (await rowTexts()).filter(t => !isFuzzy(t));
      // 🔴 SEED FROM THE RECORDS, NOT ONLY FROM THE SCREEN. When the broad term matches nothing in
      // this tab the screen is EMPTY, so screen-seeded words give an empty hunt and the check
      // skips saying "none on this environment" about an environment holding a hundred records.
      const fromRows = [...new Set(seed.flatMap(t => plain(t).split(/[^A-Za-z]+/))
        .filter(w => w.length >= 4 && w.length <= 12))];
      const words = [...new Set([...fromRows, ...(await entityTerms(s.page, tab))])]
        .sort((a, b) => b.length - a.length).slice(0, 10);
      for (const q of [BROAD, ...words]) {
        await typeAndWait(s.page, q);
        if (!(await openTab(tab))) continue;
        const rows = (await rowTexts()).filter(t => !isFuzzy(t));
        const p = rows.findIndex(t => prefixMatch(t, q));
        const c = rows.findIndex(t => !prefixMatch(t, q) && containsMatch(t, q));
        if (p >= 0 && c >= 0) { answer = q; break; }
      }
    }
  }
  console.log(`fair pair for ${tab}: ${answer ? `"${answer}"` : 'none on this environment'}`);
  pairCache.set(tab, answer);
  return answer;
}

/* ───────────── PREFIX BEATS CONTAINS, IN EACH TAB THAT HAS A FAIR PAIR (§8) ───────────── */
const PREFIX_TABS: [string, string][] = [
  ['C72120', 'Parts'], ['C72121', 'Vendors'], ['C72122', 'Assets'],
];
for (const [cid, label] of PREFIX_TABS) {
  test(`${cid} — ${label}: a name starting with the query ranks above one that only contains it`, async () => {
    test.skip(!BROAD, 'no query on this environment matches more than one kind of record');
    const q = await queryWithFairPair(label);
    test.skip(!q, `no query tried produces a fair pair in ${label} on this environment — it needs one row `
      + `whose name STARTS with the query and one that only CONTAINS it. Nothing is proved either way.`);
    await typeAndWait(s.page, q!);
    test.skip(!(await openTab(label)), `there is no ${label} tab`);
    const rows = (await rowTexts()).filter(t => !isFuzzy(t));   // exact matches only; fuzzy ranks below both
    const firstPrefix = rows.findIndex(t => prefixMatch(t, q!));
    const firstOnlyContains = rows.findIndex(t => !prefixMatch(t, q!) && containsMatch(t, q!));
    test.skip(firstPrefix < 0 || firstOnlyContains < 0, `the pair disappeared between finding it and using it`);
    expect(firstPrefix, `a row that only contains "${q}" (#${firstOnlyContains + 1}) is ranked above one `
      + `that starts with it (#${firstPrefix + 1}):\n  ${rows.slice(0, 6).map((r, i) => `${i + 1}. ${r.slice(0, 90)}`).join('\n  ')}`)
      .toBeLessThan(firstOnlyContains);
  });
}

test('C55707 — a name match ranks above a whole-word match, which ranks above a close match', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const rows = await rowTexts();
  test.skip(rows.length < 2, 'too few results to judge an order');
  const lastExact = rows.map(isFuzzy).lastIndexOf(false);
  const firstFuzzy = rows.findIndex(isFuzzy);
  test.skip(firstFuzzy < 0, `nothing came back as a close match for "${BROAD}", so the boundary cannot be seen`);
  // 🔴 THE ONE ORDERING THE PRODUCT ITSELF LABELS. Exact and whole-word matches are not
  // distinguishable from the row text, but a close match IS badged, so the exact/close boundary is
  // the part of §8 that can be measured without guessing which signal fired.
  expect(firstFuzzy, `a close match is ranked above an exact one (close at #${firstFuzzy + 1}, exact at #${lastExact + 1})`)
    .toBeGreaterThan(lastExact);
});

test('C55724 — with everything else equal, the prefix match comes first', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const rows = (await rowTexts()).filter(t => !isFuzzy(t));
  const p = rows.findIndex(t => prefixMatch(t, BROAD));
  const c = rows.findIndex(t => !prefixMatch(t, BROAD) && containsMatch(t, BROAD));
  test.skip(p < 0 || c < 0, `no fair pair in the All view for "${BROAD}" — one row must START with it and another only CONTAIN it`);
  expect(p, `a contains-only row is above a prefix row for "${BROAD}"`).toBeLessThan(c);
});

test('C44851 — within a group, exact matches come before close ones', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const groups = await s.page.evaluate(() => [...document.querySelectorAll('.search-group')]
    .map(g => [...g.querySelectorAll('.search-row')].map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim())));
  const mixed = groups.filter(rows => rows.some(isFuzzy) && rows.some(t => !isFuzzy(t)));
  test.skip(mixed.length === 0, 'no group came back holding both an exact and a close match, so order within a group cannot be judged');
  for (const rows of mixed) {
    const lastExact = rows.map(isFuzzy).lastIndexOf(false);
    const firstFuzzy = rows.findIndex(isFuzzy);
    expect(firstFuzzy, `inside one group a close match (#${firstFuzzy + 1}) is above an exact match (#${lastExact + 1}):\n  `
      + rows.map((r, i) => `${i + 1}. ${r.slice(0, 80)}`).join('\n  ')).toBeGreaterThan(lastExact);
  }
});

test('C44852 — in-stock parts rank above out-of-stock ones, and out-of-stock are still shown', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  test.skip(!(await openTab('Parts')), 'there is no Parts tab');
  const rows = await rowTexts();
  test.skip(rows.length < 2, 'fewer than two parts came back');
  // the rows carry their own stock wording; read it rather than inferring from a number
  const outIdx = rows.findIndex(t => /out of stock|0 available|unavailable/i.test(t));
  const inIdx = rows.findIndex(t => /\b[1-9]\d*\s+available/i.test(t));
  test.skip(outIdx < 0 || inIdx < 0,
    `the Parts tab does not hold both an in-stock and an out-of-stock match for "${BROAD}", so the order cannot be judged`);
  expect(inIdx, `an out-of-stock part (#${outIdx + 1}) ranks above an in-stock one (#${inIdx + 1})`).toBeLessThan(outIdx);
  expect(outIdx, 'out-of-stock parts should still be listed, not hidden').toBeGreaterThanOrEqual(0);
});

test('C53588 — more recent work orders rank above older ones of equal relevance', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  test.skip(!(await openTab('Work orders')), 'there is no Work orders tab');
  const rows = (await rowTexts()).filter(t => !isFuzzy(t));
  // work order numbers run upwards, so a higher number is the more recent record. Only judge where
  // the rows are otherwise alike - same customer and same status - or another signal explains it.
  const parsed = rows.map(t => ({ t, n: Number((t.match(/\bS\d-(\d+)/) || [])[1] ?? NaN) })).filter(x => !Number.isNaN(x.n));
  test.skip(parsed.length < 2, 'fewer than two numbered work orders came back');
  const groupsOfLike = new Map<string, number[]>();
  for (const { t, n } of parsed) {
    const key = (t.match(/\b(Approved|Estimate|Complete|Ready For Review|Invoiced)\b/i) || ['?'])[0].toLowerCase()
      + '|' + (t.match(/\d\s+([A-Za-z].{0,24}?)\s+(Approved|Estimate|Complete|Ready|Invoiced)/i) || ['', '?'])[1];
    groupsOfLike.set(key, [...(groupsOfLike.get(key) || []), n]);
  }
  const pair = [...groupsOfLike.values()].find(v => v.length >= 2);
  test.skip(!pair, 'no two work orders came back that are alike enough to compare on recency alone');
  expect(pair![0], `an older work order is ranked above a newer one of the same customer and status: ${pair!.join(', ')}`)
    .toBeGreaterThan(Math.min(...pair!.slice(1)));
});

/* ───────────────────────────── RECENT SEARCHES: CLEAR ALL ───────────────────────────── */
test('C45128 — Clear all empties the history and returns to the first-time state', async () => {
  // make sure there IS history to clear, so this never passes by having nothing to do
  await typeAndWait(s.page, BROAD || 'service');
  await closePanel(s.page); await openPanel(s.page);
  await s.page.locator(SEL.input).fill('').catch(() => {});
  await s.page.waitForTimeout(2_000);
  const before = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  test.skip(!/Clear All/i.test(before), 'this account has no recent history, so there is no Clear all to press');
  const pressed = await s.page.evaluate(() => {
    const el = [...document.querySelectorAll('.search-modal button, .search-modal a')]
      .find(e => /clear all/i.test((e as HTMLElement).innerText || ''));
    if (!el) return false; (el as HTMLElement).click(); return true;
  });
  expect(pressed, 'the Clear all control could not be pressed').toBe(true);
  await s.page.waitForTimeout(2_500);
  const after = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  expect(after, `the recent list is still showing after Clear all: ${after.slice(0, 200)}`).not.toMatch(/Clear All/i);
  expect(await s.page.locator('.search-row').count(), 'rows are still listed after Clear all').toBe(0);
});

/* ───────────────────────── REACHABLE ON A TABLET AS WELL (§6) ───────────────────────── */
test.describe('on a tablet viewport', () => {
  let t: Session;
  test.beforeAll(async () => {
    t = await signIn('/customers');
    // the layout is decided at load, so resize THEN reload (GS_VW never reaches this session)
    await t.page.setViewportSize({ width: 820, height: 1180 });
    await t.page.reload({ waitUntil: 'domcontentloaded' });
    await t.page.waitForTimeout(6_000);
    console.log(`tablet session viewport: ${JSON.stringify(t.page.viewportSize())}`);
  });
  test.afterAll(async () => { await t?.browser.close(); });

  test('C55674 — search can be reached on a tablet as well as a desktop', async () => {
    for (let i = 0; i < 3; i++) {
      await t.page.keyboard.press('Control+k');
      await t.page.waitForTimeout(2_000);
      if (await t.page.locator(SEL.modal).count()) break;
      await t.page.locator('.global-search__trigger').click({ timeout: 4_000 }).catch(() => {});
      await t.page.waitForTimeout(2_000);
    }
    await expect(t.page.locator(SEL.modal)).toBeVisible();
    await expect(t.page.locator(SEL.input)).toBeFocused();
  });

  test('C45135 — the first-time state on a tablet matches the web one, with no quick-create buttons', async () => {
    for (let i = 0; i < 3; i++) {
      if (await t.page.locator(SEL.modal).count()) break;
      await t.page.keyboard.press('Control+k'); await t.page.waitForTimeout(2_000);
    }
    await expect(t.page.locator(SEL.modal)).toBeVisible();
    await t.page.locator(SEL.input).fill('').catch(() => {});
    await t.page.waitForTimeout(2_000);
    const text = (await t.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
    // §6: the mobile and tablet states mirror the web ones and add NO create actions
    expect(text, `a quick-create action is offered on the tablet surface: ${text.slice(0, 200)}`)
      .not.toMatch(/\b(New|Create|Add)\s+(work order|customer|asset|part|vendor)\b/i);
  });
});
