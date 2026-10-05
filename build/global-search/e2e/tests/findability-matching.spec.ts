import { test, expect } from '../fixtures/test.js';
import { entityConfigDir } from '../fixtures/data.js';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeQuery, SEL, typeAndWait } from '../fixtures/search.js';
import { harvestAnchors, broadTerm, type LiveAnchors } from '../fixtures/anchors.js';
import fs from 'node:fs';

/**
 * FINDABILITY AND MATCHING — 46 checks: typo tolerance, identifier exactness, normalization,
 * which fields are searched, and what an empty result says.
 *
 * SOURCE: Global Search - Product Requirements v1.5 §7 Fuzzy Matching and §4 Scope, epic SV-9160.
 *
 * 🔴 THE ANCHORS COME FROM THE ENVIRONMENT, NOT FROM ME. A findability check needs "a name that
 * exists here", not a literal I invented - inventing them is exactly how this suite ended up asking
 * production about staging's records and reporting 46 false blanks.
 *
 * 🔴 AND THE SPEC'S OWN THRESHOLD DECIDES WHAT MAY BE ASSERTED. §7 runs TWO gates: a trigram
 * overlap of >= 0.35, and only then an edit-distance similarity of >= 0.70. A typo in a SHORT word
 * destroys every trigram, so the spec never promised it would match - measured 1 October: 'master'
 * damaged four ways scores 0.00-0.29 overlap and correctly finds nothing. Every fuzzy assertion
 * below therefore damages a LONG word and checks the overlap first, so a red result means the
 * product missed something the requirement actually promised.
 */
/**
 * 🔴 OPTIONAL, NOT REQUIRED. This used to be read at module load, so a missing folder failed the
 * whole suite at COLLECTION time — `--list` returned "0 tests in 0 files" and the real anchors are
 * harvested live anyway (see fixtures/anchors.ts). Anyone cloning this repo without the staging
 * run's folder would have seen the suite refuse to start for a file it does not actually need.
 */
const CFG = entityConfigDir();
const readJson = (p: string, fallback: unknown) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
};
const A = readJson(`${CFG}/anchors.json`, {});

let s: Session;
test.beforeAll(async () => { s = await signIn('/customers'); console.log('build under test:', await buildMarker(s.page)); });
let LIVE: LiveAnchors = {};
test.beforeAll(async () => { LIVE = await harvestAnchors(s.page); });
test.afterAll(async () => { await s?.browser.close(); });

const rows = async (q: string) => {
  // 🔴 PROVE THE INSTRUMENT BEFORE TRUSTING AN EMPTY READ (Rule 104). An empty result is the one
  // reading that must never be taken on trust: on 1 Oct 2026 "S-818" returned three rows to a hand
  // probe and nothing at all inside the run, twice. The causes are real and mundane - the panel is
  // sticky, so a scope tab left selected by an earlier assertion silently scopes the next search,
  // and a query can be read back before its own response has landed. So: confirm the field really
  // holds the query, force the scope back to All, and re-read ONCE before believing a zero.
  const read = async () => s.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => ({
    text: r.textContent!.replace(/\s+/g, ' ').trim(),
    marks: [...r.querySelectorAll('mark')].map(m => m.textContent!.trim()),
    approx: /\u2248|close match/i.test(r.textContent || ''),
  })));

  for (let attempt = 0; attempt < 2; attempt++) {
    await typeAndWait(s.page, q);
    // the scope strip is sticky across close/reopen - put it back on All or the search is scoped
    await s.page.evaluate(() => {
      const all = [...document.querySelectorAll('.search-tabs__tab')]
        .find(t => /^All\b/.test((t as HTMLElement).innerText.trim()));
      if (all && !/--active/.test(all.className)) (all as HTMLElement).click();
    });
    await s.page.waitForTimeout(1_200);
    const typed = await s.page.locator(SEL.input).inputValue().catch(() => '');
    const out = await read();
    if (out.length > 0 && typed === q) return out;
    if (typed !== q) continue;                       // the field lost the query - type it again
    // genuinely empty: let the product say so before accepting it
    const panel = (await s.page.locator(SEL.modal).innerText().catch(() => '')).replace(/\s+/g, ' ');
    if (/No results/i.test(panel)) return out;
    await s.page.waitForTimeout(2_500);
    const retry = await read();
    if (retry.length > 0) return retry;
  }
  return read();
};
/**
 * The row's identity, with the close-match badge removed.
 *
 * 🔴 A FUZZY ROW IS PREFIXED "≈ close match: ". Comparing raw row text against the exact search's
 * row therefore NEVER matches, and the spec reports "the typo did not find the record" while the
 * record is sitting on screen. This exact trap was found and fixed once already, in the fuzzy
 * sweep (sweep3.mjs), and was reintroduced here - which is why it is now a named helper both
 * sides go through instead of a slice() written out at each call site.
 */
const ident = (t: string) => t.replace(/^\s*≈?\s*close match:\s*/i, '').trim().slice(0, 40);

const tri = (w: string) => { w = w.toLowerCase();
  return new Set(w.length >= 3 ? [...Array(w.length - 2)].map((_, i) => w.slice(i, i + 3)) : [w]); };
const overlap = (a: string, b: string) => { const A = tri(a), B = tri(b);
  const I = [...A].filter(x => B.has(x)).length; const U = new Set([...A, ...B]).size;
  return U ? I / U : 0; };
/** the longest word in an anchor — short words cannot clear §7's trigram gate */
const longWord = (v: string) => (v || '').split(/[^A-Za-z]+/).filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
/** a term broad enough to hit several record kinds on WHICHEVER environment is under test.
 *  Derived from the environment's own anchor, so it is not hardcoded to one data set. */
const BROAD = longWord(A.customerName) || longWord(A.assetMake) || 'transport';
const transpose = (w: string) => { const i = Math.floor(w.length / 2); const a = [...w];
  [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a.join(''); };
const dropOne = (w: string) => { const i = Math.floor(w.length / 2); return w.slice(0, i) + w.slice(i + 1); };

/* ───────────────────────── TYPO TOLERANCE — the spec promises these ───────────────────────── */
const FUZZY: [string, string, (w: string) => string][] = [
  ['C44839', 'customerName', dropOne],      // 'Petersn' finds 'Peterson' — a dropped letter
  ['C44840', 'customerName', dropOne],      // 'Abrige' finds 'Aabridge'
  ['C44841', 'assetMake',    transpose],    // 'freihgtliner' finds 'freightliner'
  // ['C55715', 'partDesc', dropOne] — MANUAL ONLY, deliberately not automated. The part carrying
  //   this description is reachable only as a work-order LINE row, and the result lists cap at 20
  //   with ranking deciding what is visible. Measured twice on production on 1 Oct 2026: the
  //   CORRECTLY spelled query returned the record on one run and not on the next, with no change
  //   to the data. A spec built on that goes red for its own reasons, which is worse than no spec
  //   (Rule 115). Run this one by hand against a record you have just created yourself.
];
for (const [cid, key, damage] of FUZZY) {
  test(`${cid} — a misspelled word still finds the record (${key}) @${cid}`, async () => {
    const word = longWord(A[key]);
    test.skip(word.length < 8, `${key} has no word long enough to damage fairly: "${word}"`);
    const typo = damage(word);
    const ov = overlap(word, typo);
    // the gate the requirement sets, checked BEFORE the product is blamed
    test.skip(ov < 0.35, `"${typo}" scores ${ov.toFixed(2)} trigram overlap against "${word}" — below the 0.35 the spec requires, so no match is promised`);
    const exact = await rows(word);
    expect(exact.length, `the correct spelling "${word}" finds nothing, so a miss below would say nothing about typo handling`).toBeGreaterThan(0);
    const key0 = ident(exact[0].text);
    const fuzzy = await rows(typo);
    expect(fuzzy.some(r => ident(r.text) === key0),
      `"${typo}" (overlap ${ov.toFixed(2)}) did not find what "${word}" found`).toBe(true);
  });
}

/* ──────────────── IDENTIFIERS — §7 "What is not fuzzy": these must NOT match ──────────────── */
const IDS: [string, string][] = [
  ['C44844', 'assetVin'], ['C44846', 'partNumber'], ['C44849', 'partSaleNo'], ['C44847', 'poNumber'],
];
for (const [cid, key] of IDS) {
  test(`${cid} — a damaged ${key} does NOT come back (identifiers bypass fuzzy) @${cid}`, async () => {
    // 🔴 LIVE, NOT FROZEN. The value in the config file went stale within an hour on 1 Oct 2026
    // and three identifier checks went red against a product that was working correctly.
    const id = String((LIVE as Record<string, string | undefined>)[key] || '');
    test.skip(id.length < 4,
      `this environment has no ${key} that search can currently find - nothing to damage, so this `
      + `proves nothing either way. That is a data fact, not a product verdict.`);
    const exact = await rows(id);
    // 🔴 FIND THE ROW THAT ACTUALLY CARRIES THE IDENTIFIER. Comparing "the first row" of a broad
    // result set is meaningless: the first row may be something else entirely, and with sequential
    // identifiers the damaged form is often a REAL record of its own - bj030275 -> bj030276 is a
    // different part that genuinely exists. That comparison failed four of these on its first run
    // and would have been reported as "production applies fuzzy matching to identifiers".
    // 🔴 NORMALISE BOTH SIDES THE SAME WAY. This stripped punctuation from the identifier but only
    // WHITESPACE from the row, so "P1-71" became "p171" while the row stayed "...p1-71aacomplete..."
    // and the two could never match. It failed the part-sale and purchase-order checks while the
    // product was returning the right record - the row plainly reads "P1-71 aa Complete".
    const norm = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    const carries = (t: string) => norm(t).includes(norm(id));
    expect(exact.some(r => carries(r.text)),
      `the exact ${key} "${id}" does not come back at all, so nothing below is about the product. `
      + `rows seen (${exact.length}): ${exact.slice(0, 4).map(r => r.text.slice(0, 90)).join(' // ')}`).toBe(true);
    // 🔴 NOT EVERY IDENTIFIER HAS A DIGIT. The part number harvested here was
    // "AFter Releas regression", so incrementing "the last digit" changed nothing and the check
    // failed on its own setup rather than on the product. Change the last LETTER instead when
    // there is no digit to change.
    let broken = id.replace(/(\d)(?!.*\d)/, d => (d === '9' ? '8' : String(Number(d) + 1)));
    if (broken === id) {
      broken = id.replace(/([A-Za-z])(?!.*[A-Za-z])/, c => (c.toLowerCase() === 'z' ? 'y' : String.fromCharCode(c.charCodeAt(0) + 1)));
    }
    test.skip(broken === id, `"${id}" carries no digit or letter that can be changed, so it cannot be damaged`);
    const after = await rows(broken);
    expect(after.some(r => carries(r.text)),
      `searching "${broken}" still returned the record whose ${key} is "${id}" — §7 says identifiers bypass fuzzy logic and require an exact match`).toBe(false);
  });
}

/* ─────────────────────────────── NORMALIZATION ─────────────────────────────── */
test('C55727 — a dash or apostrophe is optional in a name @C55727', async () => {
  const plate = String(A.assetPlate || '');
  test.skip(!/[-']/.test(plate), 'no anchor with a dash or apostrophe on this environment');
  const withPunct = await rows(plate);
  expect(withPunct.length, `"${plate}" finds nothing, so there is nothing to compare`).toBeGreaterThan(0);
  const key0 = ident(withPunct[0].text);
  const without = await rows(plate.replace(/[-']/g, ''));
  expect(without.some(r => ident(r.text) === key0),
    `"${plate.replace(/[-']/g, '')}" did not find what "${plate}" found — punctuation should be optional`).toBe(true);
});

test('C55659 — part of a number still finds the record @C55659', async () => {
  const id = String(LIVE.poNumber || LIVE.invoiceNo || '');
  test.skip(id.length < 5, 'this environment has no findable purchase-order or invoice number to take a fragment from');
  const whole = await rows(id);
  expect(whole.length, `"${id}" finds nothing`).toBeGreaterThan(0);
  const key0 = ident(whole[0].text);
  const part = id.slice(0, Math.max(4, id.length - 1));
  const frag = await rows(part);
  expect(frag.some(r => ident(r.text) === key0),
    `the fragment "${part}" did not find what "${id}" found`).toBe(true);
});

/* ─────────────────────── WHICH FIELDS ARE SEARCHED (§4) ─────────────────────── */
const FIELDS: [string, string, string][] = [
  ['C53585', 'customerCity', 'city'],
  ['C53604', 'customerPost', 'postal code'],
  ['C44837', 'partVendor',   'the vendor on a part'],
  ['C146220', 'customerState', 'state or province'],   // was wired to the postcode by mistake
];
for (const [cid, key, label] of FIELDS) {
  test(`${cid} — a record is findable by its ${label} @${cid}`, async () => {
    const v = String(A[key] || '');
    test.skip(v.length < 3, `no ${key} on this environment`);
    const r = await rows(v);
    expect(r.length, `searching the ${label} "${v}" returned nothing, though a record carries it`).toBeGreaterThan(0);
  });
}

/* ───────────────────────────── EMPTY AND NOISE ───────────────────────────── */
test('C44864 — nothing found says so, and says nothing else @C44864', async () => {
  // 🔴 A ZZ-PREFIXED NONSENSE QUERY IS NOT NONSENSE HERE. This environment is full of ZZ... test
  // records, so "zzqqxx…" fuzzy-matches them and the panel fills with close matches instead of the
  // empty state. Use letters that resemble nothing in the data.
  const nonsense = 'qwkjhx' + Date.now();
  await typeAndWait(s.page, nonsense);
  // 🔴 AND CONFIRM THE QUERY IS STILL IN THE BOX. On the first run the panel had fallen back to
  // Recent searches, so the assertion was reading a completely different state and reporting the
  // no-results message missing when no search was showing at all.
  await expect(s.page.locator(SEL.input)).toHaveValue(nonsense);
  const panel = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  expect(panel, 'the empty state does not name the query back').toContain(nonsense);
  expect(panel, 'the empty state does not say there are no results').toMatch(/No results/i);
  expect(await s.page.locator('.search-row').count(), 'rows came back for a nonsense query').toBe(0);
});

test('C55725 — an unrelated query returns no close matches either @C55725', async () => {
  const r = await rows('zzqqxxnothinglikethis');
  expect(r.length, 'a query resembling nothing returned rows').toBe(0);
});

test('C55713 — a very short query does not spray noisy close matches @C55713', async () => {
  const r = await rows('ab');
  // §7 sets a HIGHER bar for short queries (0.80) precisely to avoid noise. Anything that does come
  // back must be a real match, not an approximate one.
  const approx = r.filter(x => x.approx).length;
  expect(approx, `a two-letter query returned ${approx} close matches, which §7 raises the bar to prevent`).toBe(0);
});

test('C55661 — a query matching several kinds shows every kind @C55661', async () => {
  // 🔴 A ONE-LETTER QUERY RENDERS NO TAB COUNTS AT ALL - the strip reads "All | Work orders | ..."
  // with no numbers, so a count-based assertion can never pass and reports "only one kind came
  // back" when nine kinds did. Measured on production 1 Oct 2026. Use a term broad enough to hit
  // several record kinds; the assertion below proves the counts are actually rendered first.
  const found = await broadTerm(s.page, [BROAD]);
  test.skip(!found, 'no query on this environment matches two different kinds of record, so there is nothing to judge');
  const broad = found!.term;
  const tabs = found!.tabs;
  const withCounts = tabs.filter(t => /\(\d+\)/.test(t));
  expect(withCounts.length, `no tab showed a count at all for "${broad}" - the search did not run: ${tabs.join(' | ')}`).toBeGreaterThan(0);
  // 🔴 EXCLUDE "All": it carries a count whenever ANY result exists, so counting it made this
  // assertion pass for a query that matched one single customer. Entity tabs only.
  const kinds = withCounts.filter(t => !/^All\b/.test(t) && !/\(0\)/.test(t));
  expect(kinds.length, `only one kind of record came back for "${broad}": ${tabs.join(' | ')}`).toBeGreaterThan(1);
});

/* ─────────────────────────── ROW PRESENTATION ─────────────────────────── */
test('C44828 — the typed text is highlighted inside each matching row @C44828', async () => {
  const word = longWord(A.customerName);
  const r = await rows(word);
  expect(r.length, `"${word}" finds nothing`).toBeGreaterThan(0);
  const unmarked = r.filter(x => x.marks.length === 0).length;
  expect(unmarked, `${unmarked} of ${r.length} rows carry no highlight at all`).toBe(0);
});

test('C44848 — a close match is drawn as a close match @C44848', async () => {
  const word = longWord(A.customerName);
  test.skip(word.length < 8, 'no long enough anchor to damage');
  const typo = transpose(word);
  test.skip(overlap(word, typo) < 0.35, 'the damaged form is below the threshold the spec promises');
  const r = await rows(typo);
  expect(r.length, `"${typo}" finds nothing`).toBeGreaterThan(0);
  expect(r.some(x => x.approx), 'a fuzzy result is not marked as a close match').toBe(true);
});

test('C44838 — status and stock badges appear on the rows that carry them @C44838', async () => {
  await typeAndWait(s.page, 'a');
  const badged = await s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
    .filter(r => r.querySelector('[data-test-id="search_row_status_badge"], .search-row__badge, .q-badge')).length);
  expect(badged, 'not one row carries a status or stock badge').toBeGreaterThan(0);
});
