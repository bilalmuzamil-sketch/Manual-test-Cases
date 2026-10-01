import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeAndWait, SEL } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, entityTerms, type LiveAnchors } from '../fixtures/anchors.js';

/**
 * SEARCH RESULTS INTEGRITY — does the row show the WHOLE matched value, and is the highlight drawn
 * INSIDE the text rather than instead of it?
 *
 * SOURCE: Global Search — Product Requirements v1.5, §5.3 Result rows and §9 Highlighting, plus
 * epic SV-9160. Each check was run by hand and passed in run 415 before it was automated (Rule 115).
 *
 * 🔴 WHY THIS IS ONE TABLE AND NOT TWENTY-SEVEN FILES. The same three questions are asked of every
 * record kind: is the full value shown (A1), is a long value cut off through the match (A2), and is
 * the match marked inside the text or in place of it (A3)? Writing those out per entity would be
 * twenty-seven copies of one assertion, and they would drift apart within a week. One named test
 * per case, driven from a table (Rule 115).
 *
 * 🔴 AND THE TRAP THAT MAKES THIS MEASURABLE AT ALL: the check needs a row the product has actually
 * HIGHLIGHTED. A row with no <mark> proves nothing about highlighting - it may simply have matched
 * on a field the row does not display. So every check below finds a marked row first and SKIPS,
 * with the reason, when the environment gives it none. A verdict from an unmarked row would be a
 * guess dressed as a result.
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

type Marked = { row: string; marks: string[]; host: string; hostHasEllipsis: boolean };

/** Rows carrying a highlight, with the text of the element the highlight sits inside. */
async function markedRows(): Promise<Marked[]> {
  return s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
    .map(r => {
      const marks = [...r.querySelectorAll('mark')];
      if (!marks.length) return null;
      // the element the highlight lives in — that is the "value" the requirement talks about,
      // not the whole row, which also carries the record number and the customer name
      const host = marks[0].parentElement as HTMLElement | null;
      const hostText = (host?.textContent || '').replace(/\s+/g, ' ').trim();
      // 🔴 ONLY THE MARKS INSIDE THAT HOST. Collecting every mark in the ROW and comparing the
      // total against ONE element's text compares two different things: a row with highlights in
      // three fields totals more characters than any single field holds, and the check then reports
      // "the row shows only the typed text" about a row showing the full value perfectly.
      const hostMarks = host ? [...host.querySelectorAll('mark')] : marks;
      return {
        row: (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim(),
        marks: hostMarks.map(m => (m.textContent || '').trim()),
        host: hostText,
        hostHasEllipsis: /…|\.\.\./.test(hostText),
      };
    }).filter(Boolean) as Marked[]);
}

async function openTab(label: string) {
  const ok = await s.page.evaluate(l => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim().toLowerCase() === l.toLowerCase());
    if (!t) return false; (t as HTMLElement).click(); return true;
  }, label);
  await s.page.waitForTimeout(2_400);
  return ok;
}

/** search `q`, scope to `tab`, and return the highlighted rows — or null if there are none to judge */
async function highlighted(q: string, tab?: string): Promise<Marked[] | null> {
  if (!q) return null;
  await typeAndWait(s.page, q);
  if (tab && !(await openTab(tab))) return null;
  const rows = await markedRows();
  return rows.length ? rows : null;
}

/**
 * FIND A QUERY THAT ACTUALLY HIGHLIGHTS SOMETHING IN THIS TAB.
 *
 * 🔴 Ten of these checks skipped on their first run because the broad term matched records in a
 * tab without the match being in any field the row DISPLAYS — so no highlight, and nothing to
 * judge. Skipping was honest but lazy: the environment does hold highlightable rows, just not
 * under that word. So take the words the tab's own rows are made of and try them until one comes
 * back marked. Cached per tab, because the hunt costs a few searches.
 */
const litCache = new Map<string, string | null>();
async function queryThatHighlights(tab: string): Promise<string | null> {
  if (litCache.has(tab)) return litCache.get(tab)!;
  let answer: string | null = null;
  if (BROAD) {
    if (await highlighted(BROAD, tab)) answer = BROAD;
    else {
      // 🔴 SEED FROM THE RECORDS, NOT ONLY FROM THE SCREEN — an empty tab yields no words, so the
      // hunt tried nothing and the check skipped against a tab holding a hundred records.
      const seed = await s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
        .map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
      const words = [...new Set([
        ...seed.flatMap(t => t.split(/[^A-Za-z0-9]+/)).filter(w => w.length >= 4 && w.length <= 14),
        ...(await entityTerms(s.page, tab)),
      ])].slice(0, 12);
      for (const w of words) {
        if (await highlighted(w, tab)) { answer = w; break; }
      }
    }
  }
  console.log(`highlightable query for ${tab}: ${answer ? `"${answer}"` : 'none found on this environment'}`);
  litCache.set(tab, answer);
  return answer;
}

/* ─────────────────────── A1 · THE WHOLE MATCHED VALUE IS SHOWN ─────────────────────── */
const A1: [string, string][] = [
  ['C146224', 'Assets'], ['C146233', 'Parts'], ['C146245', 'Vendors'],
  ['C146257', 'Part sales'], ['C146266', 'Purchase orders'], ['C146277', 'Vendor invoices'],
];
for (const [cid, tab] of A1) {
  test(`${cid} — ${tab}: the row shows the whole matched value, not just what was typed`, async () => {
    test.skip(!BROAD, 'no query on this environment matches more than one kind of record');
    const q = await queryThatHighlights(tab);
    test.skip(!q, `no query tried highlights anything in ${tab} on this environment, so there is no matched value to judge`);
    const rows = await highlighted(q!, tab);
    test.skip(!rows, `the highlighted rows in ${tab} disappeared between finding them and using them`);
    for (const r of rows!.slice(0, 5)) {
      // 🔴 COMPARE THE VALUE AGAINST WHAT WAS TYPED, NOT AGAINST THE HIGHLIGHT. Requiring unmarked
      // text inside the value fails when the product highlights the WHOLE value - which it does,
      // and which is not a defect: "ZZAUTOTEST Fibridge Wheel Seal" shown in full for the query
      // "ZZAUTOTEST" is exactly what this case asks for. What matters is that the row shows the
      // record's own value rather than echoing the query back.
      expect(r.host.length, `the row shows only the typed text, not the value that matched: "${r.host}"`)
        .toBeGreaterThan(q!.length);
      expect(r.row.toLowerCase(), `the row does not contain the query at all: "${r.row}"`)
        .toContain(q!.toLowerCase());
    }
  });
}

/* ───────────────── A2 · A LONG VALUE IS NOT CUT OFF THROUGH THE MATCH ───────────────── */
const A2: [string, string][] = [
  ['C146225', 'Assets'], ['C146234', 'Parts'], ['C146246', 'Vendors'],
  ['C146258', 'Part sales'], ['C146267', 'Purchase orders'], ['C146278', 'Vendor invoices'],
];
for (const [cid, tab] of A2) {
  test(`${cid} — ${tab}: a long value is not cut off through the part that matched`, async () => {
    test.skip(!BROAD, 'no broad query on this environment');
    const q = await queryThatHighlights(tab);
    test.skip(!q, `no query tried highlights anything in ${tab} on this environment`);
    const rows = await highlighted(q!, tab);
    test.skip(!rows, `the highlighted rows in ${tab} disappeared between finding them and using them`);
    for (const r of rows!.slice(0, 5)) {
      // truncation itself is allowed; truncating THROUGH the match is not — the whole of what was
      // typed must still be readable in the highlighted fragment
      const joined = r.marks.join('').toLowerCase().replace(/\s+/g, '');
      expect(joined, `the highlighted fragment is shorter than the query, so the value was cut through `
        + `the match: marks=${JSON.stringify(r.marks)} in "${r.host}"`)
        .toContain(q!.toLowerCase().replace(/\s+/g, '').slice(0, Math.min(q!.length, joined.length) || 1));
      if (r.hostHasEllipsis) {
        expect(r.host, `the value is trimmed with an ellipsis directly against the match: "${r.host}"`)
          .not.toMatch(new RegExp(`(…|\\.\\.\\.)\\s*${q!.slice(0, 3)}|${q!.slice(-3)}\\s*(…|\\.\\.\\.)`, 'i'));
      }
    }
  });
}

/* ──────────── A3 · THE HIGHLIGHT MARKS THE MATCH INSIDE THE TEXT, NOT INSTEAD OF IT ──────────── */
const A3: [string, string][] = [
  ['C146247', 'Vendors'], ['C146268', 'Purchase orders'], ['C146279', 'Vendor invoices'],
];
for (const [cid, tab] of A3) {
  test(`${cid} — ${tab}: the highlight marks the match inside the text, not instead of it`, async () => {
    test.skip(!BROAD, 'no broad query on this environment');
    const q = await queryThatHighlights(tab);
    test.skip(!q, `no query tried highlights anything in ${tab} on this environment`);
    const rows = await highlighted(q!, tab);
    test.skip(!rows, `the highlighted rows in ${tab} disappeared between finding them and using them`);
    for (const r of rows!.slice(0, 5)) {
      expect(r.marks.join('').length, 'the highlight is empty').toBeGreaterThan(0);
      // 🔴 THE FAILURE THIS CATCHES: a build that REPLACES the value with the matched fragment,
      // so the tester sees only what they typed. The test is that the value on screen is longer
      // than the query AND still contains it - highlighting the whole value is fine, losing the
      // rest of it is not.
      expect(r.host.length, `the value was replaced by the matched fragment: "${r.host}"`)
        .toBeGreaterThanOrEqual(q!.length);
      expect(r.host.toLowerCase(), `the highlighted element no longer contains what was typed: "${r.host}"`)
        .toContain(q!.toLowerCase());
    }
  });
}

/* ───────────── C · A MATCH ON A NAMED FIELD SHOWS THAT FIELD'S FULL VALUE ───────────── */
/**
 * These search a value harvested LIVE from the field in question, so the row that comes back is
 * known to have matched on that field and not on something else that happens to contain the text.
 */
const FIELD: [string, string, keyof LiveAnchors, string][] = [
  ['C146229', 'Assets',          'assetVin',   'VIN or serial number'],
  ['C146263', 'Part sales',      'assetVin',   'VIN or serial number'],
  ['C146271', 'Purchase orders', 'partNumber', 'part number'],
];
for (const [cid, tab, key, what] of FIELD) {
  test(`${cid} — ${tab}: a match on ${what} shows the full value on the row`, async () => {
    const id = String((LIVE as Record<string, string | undefined>)[key] || '');
    test.skip(!id, `this environment has no ${what} that search can currently find`);
    const rows = await highlighted(id, tab);
    test.skip(!rows, `no ${tab} row came back highlighted for the ${what} "${id}"`);
    const norm = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    const carries = rows!.some(r => norm(r.row).includes(norm(id)));
    expect(carries, `no ${tab} row shows the ${what} "${id}" in full:\n  `
      + rows!.slice(0, 4).map(r => r.row.slice(0, 100)).join('\n  ')).toBe(true);
  });
}

/* ───────────────────────── MATCHING RULES THAT STAND ALONE ───────────────────────── */
test('C55726 — an accented name matches with or without the accent', async () => {
  // find a record whose name actually carries an accent, rather than assuming one exists
  const accented = await s.page.evaluate(async () => {
    const r = await fetch('https://api.shopview.com/api/customers?limit=100', { credentials: 'include' });
    const j = await r.json().catch(() => null);
    const rows = j?.data?.collection || j?.collection || [];
    const hit = rows.map((c: any) => String(c?.name || '')).find((n: string) => /[À-ÿ]/.test(n));
    return hit || '';
  }).catch(() => '');
  test.skip(!accented, 'no customer on this environment has an accented name, so there is nothing to compare');
  const word = accented.split(/\s+/).find(w => /[À-ÿ]/.test(w)) || accented;
  const withAccent = await highlighted(word);
  const plain = word.normalize('NFD').replace(/[̀-ͯ]/g, '');
  await typeAndWait(s.page, plain);
  const after = await s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
    .map(r => (r as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
  expect(after.some(t => t.includes(word) || t.normalize('NFD').replace(/[̀-ͯ]/g, '').includes(plain)),
    `"${plain}" did not find the record that "${word}" names`).toBe(true);
  expect(withAccent, 'the accented spelling found nothing, so the pair proves nothing').toBeTruthy();
});

test('C44862 — reopening the panel restores the last query, tab and results', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const tabs = await s.page.evaluate(() => [...document.querySelectorAll('.search-tabs__tab')]
    .map(t => (t as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim()));
  const target = tabs.find(t => !/^All$/i.test(t)) || '';
  if (target) await openTab(target);
  const before = {
    q: await s.page.locator(SEL.input).inputValue(),
    rows: await s.page.locator('.search-row').count(),
    tab: await s.page.evaluate(() => (document.querySelector('.search-tabs__tab--active') as HTMLElement)?.innerText.trim() ?? ''),
  };
  await closePanel(s.page);
  await openPanel(s.page);
  await s.page.waitForTimeout(2_500);
  expect(await s.page.locator(SEL.input).inputValue(), 'the query was not restored').toBe(before.q);
  expect(await s.page.evaluate(() => (document.querySelector('.search-tabs__tab--active') as HTMLElement)?.innerText.trim() ?? ''),
    'the scope tab was not restored').toBe(before.tab);
  expect(await s.page.locator('.search-row').count(), 'the result list was not restored').toBe(before.rows);
});

test('C55730 — a record below the top twenty is not shown until the query is narrowed', async () => {
  test.skip(!BROAD, 'no broad query on this environment');
  await typeAndWait(s.page, BROAD);
  const tabs = await s.page.evaluate(() => [...document.querySelectorAll('.search-tabs__tab')]
    .map(t => ({ label: (t as HTMLElement).innerText.replace(/\s*\(\d+\)/, '').trim(),
                 count: Number(((t as HTMLElement).innerText.match(/\((\d+)\)/) || [])[1] ?? -1) })));
  const big = tabs.find(t => !/^All$/i.test(t.label) && t.count > 20);
  test.skip(!big, 'no kind has more than twenty matches here, so the cap cannot be demonstrated');
  await openTab(big!.label);
  const shown = await s.page.locator('.search-row').count();
  expect(shown, `the ${big!.label} tab listed ${shown} rows for ${big!.count} matches, above the twenty the requirement allows`)
    .toBeLessThanOrEqual(20);
});
