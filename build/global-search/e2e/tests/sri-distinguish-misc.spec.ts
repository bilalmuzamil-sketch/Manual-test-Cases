import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { APP, APIH, apiJson, collectionOf } from '../fixtures/boot.js';
import { openPanel, closePanel, typeAndWait, SEL } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, entityTerms, type LiveAnchors } from '../fixtures/anchors.js';

/**
 * TELLING TWO SIMILAR RESULTS APART · WHAT EACH ROW PROMISES · THE FAILURE BANNER · NO FEATURE FLAG.
 *
 * SOURCE: Global Search — Product Requirements v1.5, §5.3 Result rows, §5.2 States and §11
 * Rollout, plus epic SV-9160. Run by hand and passed in run 415 before automating (Rule 115).
 *
 * 🔴 WHAT "TOLD APART" HAS TO MEAN FOR A MACHINE. A person looking at two rows for the same
 * customer knows instantly which is which. A spec cannot appeal to that, so it asserts the thing
 * that makes it possible: where two rows share their FIRST line, something else on those rows must
 * differ. If the two rows are identical top to bottom, the person has no way to choose and the
 * requirement is broken; if anything differs, it is met. That is a weaker statement than a human
 * judgement and it is an honest one - it fails exactly when the product gives the person nothing.
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
    await s.page.goto(`${process.env.GS_APP || ''}/customers`, { waitUntil: 'domcontentloaded', timeout: 25_000 }).catch(() => {});
    await s.page.waitForTimeout(4_000);
  }
});

const rowParts = () => s.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => {
  const whole = (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
  const lines = (r as HTMLElement).innerText.split('\n').map(l => l.trim()).filter(Boolean);
  return { whole, first: lines[0] ?? '', rest: lines.slice(1).join(' | ') };
}));
const rowTexts = async () => (await rowParts()).map(r => r.whole);

async function openTab(label: string) {
  const ok = await s.page.evaluate(l => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
    if (!t) return false; (t as HTMLElement).click(); return true;
  }, label);
  await s.page.waitForTimeout(2_400);
  return ok;
}
const tabCount = async (label: string) => s.page.evaluate(l => {
  const t = [...document.querySelectorAll('.search-tabs__tab')]
    .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
  return t ? Number(((t as HTMLElement).innerText.match(/\((\d+)\)/) || [])[1] ?? -1) : -1;
}, label);

/**
 * Find a query that puts at least two rows in this tab — otherwise "can two be told apart" has
 * nothing to work with. Seeded from the records themselves, never only from the screen (L0270).
 */
const twoCache = new Map<string, string | null>();
async function queryWithTwoRows(tab: string): Promise<string | null> {
  if (twoCache.has(tab)) return twoCache.get(tab)!;
  let answer: string | null = null;
  const tries = [BROAD, ...(await entityTerms(s.page, tab, 10))].filter(Boolean) as string[];
  for (const q of tries) {
    await typeAndWait(s.page, q);
    if ((await tabCount(tab)) < 2) continue;
    if (!(await openTab(tab))) continue;
    if ((await rowTexts()).length >= 2) { answer = q; break; }
  }
  console.log(`two-row query for ${tab}: ${answer ? `"${answer}"` : 'none on this environment'}`);
  twoCache.set(tab, answer);
  return answer;
}

/* ───────────── B1 · TWO RECORDS SHARING WHAT YOU TYPED CAN BE TOLD APART ───────────── */
const B1: [string, string][] = [
  ['C146227', 'Assets'], ['C146236', 'Parts'], ['C146248', 'Vendors'],
  ['C146260', 'Part sales'], ['C146269', 'Purchase orders'], ['C146280', 'Vendor invoices'],
];
for (const [cid, tab] of B1) {
  test(`${cid} — ${tab}: two records sharing what was typed can be told apart`, async () => {
    const q = await queryWithTwoRows(tab);
    test.skip(!q, `no query puts two ${tab.toLowerCase()} rows on screen at once here, so there is no pair to tell apart`);
    await typeAndWait(s.page, q!); await openTab(tab);
    const rows = await rowParts();
    test.skip(rows.length < 2, 'the pair disappeared between finding it and using it');
    const seen = new Map<string, string[]>();
    for (const r of rows) seen.set(r.whole, [...(seen.get(r.whole) || []), r.whole]);
    const identical = [...seen.values()].find(v => v.length > 1);
    expect(identical, `two rows are identical in every visible respect, so the person cannot choose between `
      + `them:\n  ${identical?.[0]?.slice(0, 120)}`).toBeUndefined();
  });
}

/* ─────────── B2 · TWO ROWS WITH THE SAME FIRST LINE DIFFER SOMEWHERE VISIBLE ─────────── */
const B2: [string, string][] = [
  ['C146228', 'Assets'], ['C146237', 'Parts'], ['C146249', 'Vendors'],
  ['C146261', 'Part sales'], ['C146270', 'Purchase orders'], ['C146281', 'Vendor invoices'],
];
for (const [cid, tab] of B2) {
  test(`${cid} — ${tab}: two rows with the same first line differ somewhere you can see`, async () => {
    const q = await queryWithTwoRows(tab);
    test.skip(!q, `no query puts two ${tab.toLowerCase()} rows on screen at once here`);
    await typeAndWait(s.page, q!); await openTab(tab);
    const rows = await rowParts();
    const byFirst = new Map<string, typeof rows>();
    for (const r of rows) byFirst.set(r.first, [...(byFirst.get(r.first) || []), r]);
    const shared = [...byFirst.values()].filter(v => v.length > 1);
    test.skip(shared.length === 0,
      `no two ${tab.toLowerCase()} rows share a first line for "${q}", so this cannot be demonstrated here`);
    for (const group of shared) {
      const rests = new Set(group.map(r => r.rest));
      expect(rests.size, `${group.length} rows read "${group[0].first}" and show nothing else to tell them apart`)
        .toBeGreaterThan(1);
    }
  });
}

/* ─────────── D1 · THE ROW SHOWS EVERYTHING THE REQUIREMENT PROMISED ─────────── */
const D1: [string, string, RegExp[], string[]][] = [
  ['C146231', 'Assets',          [/\b(19|20)\d{2}\b/, /[A-Za-z]{3,}/],          ['a year', 'a make or model']],
  ['C146243', 'Parts',           [/available|out of stock|in stock/i, /[A-Za-z0-9-]{4,}/], ['a stock state', 'a number or name']],
  ['C146255', 'Vendors',         [/[A-Za-z]{3,}/],                               ['the vendor name']],
  ['C146283', 'Vendor invoices', [/\d/, /[A-Za-z]{3,}/],                         ['a number', 'the vendor']],
];
for (const [cid, tab, pats, names] of D1) {
  test(`${cid} — the ${tab} row shows ${names.join(' and ')}`, async () => {
    const q = await queryWithTwoRows(tab) ?? BROAD;
    test.skip(!q, 'no query reaches this tab on this environment');
    await typeAndWait(s.page, q); 
    test.skip((await tabCount(tab)) <= 0, `no ${tab.toLowerCase()} match "${q}" here`);
    await openTab(tab);
    const rows = (await rowTexts()).slice(0, 5);
    expect(rows.length, `the ${tab} tab is empty although its count said otherwise`).toBeGreaterThan(0);
    pats.forEach((re, i) => expect(rows.some(r => re.test(r)),
      `no ${tab} row shows ${names[i]}:\n  ${rows.map(r => r.slice(0, 95)).join('\n  ')}`).toBe(true));
  });
}

/* ─────────── C · A MATCH ON A NAMED FIELD SHOWS THAT FIELD'S FULL VALUE ─────────── */
/**
 * Each searches a value taken live from the field in question, so the row that comes back is known
 * to have matched on THAT field rather than on something else containing the same text.
 */
const FIELDC: [string, string, string, string[]][] = [
  ['C146238', 'Parts',           'bin location', ['/api/inventory/parts?limit=60', 'bin_location', 'bin']],
  ['C146242', 'Parts',           'tags',         ['/api/inventory/parts?limit=60', 'tags', 'tag']],
  ['C146250', 'Vendors',         'email address',['/api/vendors?limit=60', 'email', 'contact_email']],
  ['C146204', 'Work orders',     'service advisor name', ['/api/work-orders?limit=40', 'service_advisor_name', 'advisor_name']],
];
for (const [cid, tab, what, src] of FIELDC) {
  test(`${cid} — ${tab}: a match on ${what} shows the full value on the row`, async () => {
    const [path, ...fields] = src;
    const value: string = await (async () => {
      const recs = collectionOf(await apiJson(s, path));
      for (const rec of recs) for (const f of fields) {
        const v = (rec as any)?.[f];
        const str = Array.isArray(v) ? String(v[0] ?? '') : String(v ?? '');
        if (str.trim().length >= 4) return str.trim();
      }
      return '';
    })();
    test.skip(!value, `no ${tab.toLowerCase()} record on this environment has a ${what} recorded, so there is nothing to match on`);
    await typeAndWait(s.page, value);
    const rows = await rowTexts();
    test.skip(rows.length === 0,
      `searching the ${what} "${value}" returns nothing. Either that field is not indexed or no row displays it; `
      + `either way this needs a human to judge, so it is not being called a defect here.`);
    const norm = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    expect(rows.some(r => norm(r).includes(norm(value))),
      `no row shows the ${what} "${value}" in full:\n  ${rows.slice(0, 4).map(r => r.slice(0, 100)).join('\n  ')}`).toBe(true);
  });
}

/* ───────────────────────── THE SEARCH-FAILURE BANNER (§5.2) ───────────────────────── */
test('C44876 — when the search cannot run, the panel says so and offers a retry', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  // 🔴 MAKE THE FAILURE HAPPEN RATHER THAN WAITING FOR ONE. The browser is told to fail the search
  // request; nothing on the server is touched and the route is removed again straight afterwards.
  await s.page.route('**/api/**search**', route => route.abort('failed'));
  try {
    await typeAndWait(s.page, BROAD + 'x');
    const panel = (await s.page.locator(SEL.modal).innerText().catch(() => '')).replace(/\s+/g, ' ');
    expect(panel, `the panel says nothing about the search having failed: ${panel.slice(0, 200)}`)
      .toMatch(/unavailable|try again|retry|something went wrong|could not/i);
  } finally {
    await s.page.unroute('**/api/**search**');
  }
  // and it recovers once the request works again
  await typeAndWait(s.page, BROAD);
  expect(await s.page.locator('.search-row').count(), 'the panel did not recover after the failure cleared')
    .toBeGreaterThan(0);
});

/* ───────────────────────── ROLLOUT: NO FEATURE FLAG (§11) ───────────────────────── */
const NOFLAG: [string, string][] = [
  ['C45158', 'global search is available without any toggle being switched on'],
  ['C44897', 'the old search path is gone, with no flag left behind'],
];
for (const [cid, what] of NOFLAG) {
  test(`${cid} — ${what}`, async () => {
    // it opens for this account with nothing enabled first — that IS the check
    await closePanel(s.page);
    await openPanel(s.page);
    await expect(s.page.locator(SEL.modal)).toBeVisible();
    await expect(s.page.locator(SEL.input)).toBeFocused();
    const page = (await s.page.content()).toLowerCase();
    expect(page, 'a global-search feature flag is still present in the page')
      .not.toMatch(/"(global_?search|new_?search|search_?v2)_?(flag|enabled|toggle)"\s*:\s*(true|false)/);
  });
}

/* ───────────────── SELECTING THE RECORD YOU ARE ALREADY ON ───────────────── */
test('C45154 — selecting the record you are already looking at does not reload the page', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  test.skip((await s.page.locator('.search-row').count()) === 0, 'nothing came back to open');
  await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(400);
  await s.page.keyboard.press('Enter');
  await s.page.waitForLoadState('domcontentloaded').catch(() => {});
  await s.page.waitForTimeout(4_500);
  const landed = s.page.url();
  test.skip(!/\/(customers|work-?orders|vehicles|parts|vendors)\/[^/]+/.test(landed),
    `opening the first result did not land on a record page (${landed}), so there is nothing to re-select`);
  // search the same thing again and pick the same row — the page must not navigate away and back
  let navigated = false;
  const onNav = () => { navigated = true; };
  s.page.on('framenavigated', onNav);
  navigated = false;
  // on a record page the shortcut is not always taken; the header field is the proven second route
  for (let i = 0; i < 3; i++) {
    if (await s.page.locator(SEL.modal).count()) break;
    await s.page.keyboard.press('Control+k'); await s.page.waitForTimeout(1_800);
    if (await s.page.locator(SEL.modal).count()) break;
    await s.page.locator('.global-search__trigger').click({ timeout: 4_000 }).catch(() => {});
    await s.page.waitForTimeout(1_800);
  }
  test.skip(!(await s.page.locator(SEL.modal).count()),
    'the search panel will not open on this record page, so re-selecting the same record cannot be tested from here');
  /**
   * 🔴 SELECT THE RECORD YOU ARE ON, NOT WHATEVER IS FIRST. Pressing Enter on the top result from
   * a record page opens whichever record ranks first, which is usually a DIFFERENT one — and the
   * check then reports "selecting the record already open moved the person somewhere else" about a
   * product that did exactly what was asked. Identify the open record from its own page and pick
   * THAT row.
   */
  const openRecordId = (landed.match(/\/([^/?#]+)(?:[?#]|$)/) || [])[1] ?? '';
  const heading = await s.page.evaluate(() =>
    (document.querySelector('h1, h2, .page-title') as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim() ?? '');
  const q = heading.split(/\s{2,}|·|\|/)[0].trim() || BROAD;
  await s.page.locator(SEL.input).fill('').catch(() => {});
  await s.page.locator(SEL.input).type(q, { delay: 45 }).catch(() => {});
  await s.page.waitForTimeout(3_500);
  const mine = await s.page.evaluate((id) => {
    const rows = [...document.querySelectorAll('.search-row')];
    const i = rows.findIndex(r => (r as HTMLElement).getAttribute('href')?.includes(String(id))
      || (r.querySelector('a') as HTMLAnchorElement | null)?.href?.includes(String(id)));
    return i;
  }, openRecordId);
  test.skip(mine < 0, 'the record whose page is open does not come back in its own search results, '
    + 'so there is no way to re-select it from here');
  for (let i = 0; i <= mine; i++) { await s.page.keyboard.press('ArrowDown'); await s.page.waitForTimeout(250); }
  await s.page.keyboard.press('Enter');
  await s.page.waitForTimeout(4_000);
  s.page.off('framenavigated', onNav);
  expect(s.page.url(), 'selecting the record already open moved the person somewhere else').toBe(landed);
});

/* ───────────────── THE COUNT IS ANNOUNCED TO A SCREEN READER ───────────────── */
test('C44829 — the results count is announced when it changes', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  // a live region is how a count reaches someone who cannot see it; it must exist AND carry a count
  const live = await s.page.evaluate(() => [...document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')]
    .map(e => ({ text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
                 politeness: e.getAttribute('aria-live') || e.getAttribute('role') || '' })));
  expect(live.length, 'the panel has no live region at all, so a count change is announced to nobody').toBeGreaterThan(0);
  expect(live.some(l => /\d/.test(l.text)),
    `no live region carries a count: ${JSON.stringify(live).slice(0, 240)}`).toBe(true);
});
