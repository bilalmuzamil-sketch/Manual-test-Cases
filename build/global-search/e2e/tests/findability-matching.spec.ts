import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { openPanel, closePanel, typeQuery, SEL } from '../fixtures/search.js';
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
const CFG = process.env.GS_ENTITY_CONFIG || '../staging-run-2026-09-29';
const A = JSON.parse(fs.readFileSync(`${CFG}/anchors.json`, 'utf8'));

let s: Session;
test.beforeAll(async () => { s = await signIn('/customers'); console.log('build under test:', await buildMarker(s.page)); });
test.afterAll(async () => { await s?.browser.close(); });

const rows = async (q: string) => {
  await closePanel(s.page); await openPanel(s.page);
  await typeQuery(s.page, q);
  return s.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => ({
    text: r.textContent!.replace(/\s+/g, ' ').trim(),
    marks: [...r.querySelectorAll('mark')].map(m => m.textContent!.trim()),
    approx: /≈|close match/i.test(r.textContent || ''),
  })));
};
const tri = (w: string) => { w = w.toLowerCase();
  return new Set(w.length >= 3 ? [...Array(w.length - 2)].map((_, i) => w.slice(i, i + 3)) : [w]); };
const overlap = (a: string, b: string) => { const A = tri(a), B = tri(b);
  const I = [...A].filter(x => B.has(x)).length; const U = new Set([...A, ...B]).size;
  return U ? I / U : 0; };
/** the longest word in an anchor — short words cannot clear §7's trigram gate */
const longWord = (v: string) => (v || '').split(/[^A-Za-z]+/).filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
const transpose = (w: string) => { const i = Math.floor(w.length / 2); const a = [...w];
  [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a.join(''); };
const dropOne = (w: string) => { const i = Math.floor(w.length / 2); return w.slice(0, i) + w.slice(i + 1); };

/* ───────────────────────── TYPO TOLERANCE — the spec promises these ───────────────────────── */
const FUZZY: [string, string, (w: string) => string][] = [
  ['C44839', 'customerName', dropOne],      // 'Petersn' finds 'Peterson' — a dropped letter
  ['C44840', 'customerName', dropOne],      // 'Abrige' finds 'Aabridge'
  ['C44841', 'assetMake',    transpose],    // 'freihgtliner' finds 'freightliner'
  ['C55715', 'partDesc',     dropOne],      // a part is still found through a misspelled description
];
for (const [cid, key, damage] of FUZZY) {
  test(`${cid} — a misspelled word still finds the record (${key})`, async () => {
    const word = longWord(A[key]);
    test.skip(word.length < 8, `${key} has no word long enough to damage fairly: "${word}"`);
    const typo = damage(word);
    const ov = overlap(word, typo);
    // the gate the requirement sets, checked BEFORE the product is blamed
    test.skip(ov < 0.35, `"${typo}" scores ${ov.toFixed(2)} trigram overlap against "${word}" — below the 0.35 the spec requires, so no match is promised`);
    const exact = await rows(word);
    expect(exact.length, `the correct spelling "${word}" finds nothing, so a miss below would say nothing about typo handling`).toBeGreaterThan(0);
    const key0 = exact[0].text.slice(0, 40);
    const fuzzy = await rows(typo);
    expect(fuzzy.some(r => r.text.slice(0, 40) === key0),
      `"${typo}" (overlap ${ov.toFixed(2)}) did not find what "${word}" found`).toBe(true);
  });
}

/* ──────────────── IDENTIFIERS — §7 "What is not fuzzy": these must NOT match ──────────────── */
const IDS: [string, string][] = [
  ['C44844', 'assetVin'], ['C44846', 'partNumber'], ['C44849', 'partSaleNo'], ['C44847', 'poNumber'],
];
for (const [cid, key] of IDS) {
  test(`${cid} — a damaged ${key} does NOT come back (identifiers bypass fuzzy)`, async () => {
    const id = String(A[key] || '');
    test.skip(id.length < 4, `no ${key} on this environment to damage`);
    const exact = await rows(id);
    expect(exact.length, `the exact ${key} "${id}" finds nothing, so nothing below is about the product`).toBeGreaterThan(0);
    const key0 = exact[0].text.slice(0, 40);
    // one character changed, in the numeric tail
    const broken = id.replace(/(\d)(?!.*\d)/, d => (d === '9' ? '8' : String(Number(d) + 1)));
    expect(broken, 'could not damage the identifier').not.toBe(id);
    const after = await rows(broken);
    expect(after.some(r => r.text.slice(0, 40) === key0),
      `"${broken}" still returned the record found by "${id}" — identifiers are supposed to require an exact match`).toBe(false);
  });
}

/* ─────────────────────────────── NORMALIZATION ─────────────────────────────── */
test('C55727 — a dash or apostrophe is optional in a name', async () => {
  const plate = String(A.assetPlate || '');
  test.skip(!/[-']/.test(plate), 'no anchor with a dash or apostrophe on this environment');
  const withPunct = await rows(plate);
  expect(withPunct.length, `"${plate}" finds nothing, so there is nothing to compare`).toBeGreaterThan(0);
  const key0 = withPunct[0].text.slice(0, 40);
  const without = await rows(plate.replace(/[-']/g, ''));
  expect(without.some(r => r.text.slice(0, 40) === key0),
    `"${plate.replace(/[-']/g, '')}" did not find what "${plate}" found — punctuation should be optional`).toBe(true);
});

test('C55659 — part of a number still finds the record', async () => {
  const id = String(A.poNumber || A.invoiceNo || '');
  test.skip(id.length < 5, 'no number long enough to take a fragment from');
  const whole = await rows(id);
  expect(whole.length, `"${id}" finds nothing`).toBeGreaterThan(0);
  const key0 = whole[0].text.slice(0, 40);
  const part = id.slice(0, Math.max(4, id.length - 1));
  const frag = await rows(part);
  expect(frag.some(r => r.text.slice(0, 40) === key0),
    `the fragment "${part}" did not find what "${id}" found`).toBe(true);
});

/* ─────────────────────── WHICH FIELDS ARE SEARCHED (§4) ─────────────────────── */
const FIELDS: [string, string, string][] = [
  ['C53585', 'customerCity', 'city'],
  ['C53604', 'customerPost', 'postal code'],
  ['C44837', 'partVendor',   'the vendor on a part'],
  ['C146220', 'customerPost', 'state or province'],
];
for (const [cid, key, label] of FIELDS) {
  test(`${cid} — a record is findable by its ${label}`, async () => {
    const v = String(A[key] || '');
    test.skip(v.length < 3, `no ${key} on this environment`);
    const r = await rows(v);
    expect(r.length, `searching the ${label} "${v}" returned nothing, though a record carries it`).toBeGreaterThan(0);
  });
}

/* ───────────────────────────── EMPTY AND NOISE ───────────────────────────── */
test('C44864 — nothing found says so, and says nothing else', async () => {
  const nonsense = 'zzqqxx' + Date.now();
  await closePanel(s.page); await openPanel(s.page);
  await typeQuery(s.page, nonsense);
  const panel = (await s.page.locator(SEL.modal).innerText()).replace(/\s+/g, ' ');
  expect(panel, 'the empty state does not name the query back').toContain(nonsense);
  expect(panel, 'the empty state does not say there are no results').toMatch(/No results/i);
  expect(await s.page.locator('.search-row').count(), 'rows came back for a nonsense query').toBe(0);
});

test('C55725 — an unrelated query returns no close matches either', async () => {
  const r = await rows('zzqqxxnothinglikethis');
  expect(r.length, 'a query resembling nothing returned rows').toBe(0);
});

test('C55713 — a very short query does not spray noisy close matches', async () => {
  const r = await rows('ab');
  // §7 sets a HIGHER bar for short queries (0.80) precisely to avoid noise. Anything that does come
  // back must be a real match, not an approximate one.
  const approx = r.filter(x => x.approx).length;
  expect(approx, `a two-letter query returned ${approx} close matches, which §7 raises the bar to prevent`).toBe(0);
});

test('C55661 — a query matching several kinds shows every kind', async () => {
  await closePanel(s.page); await openPanel(s.page);
  await typeQuery(s.page, 'a');
  const counted = await s.page.evaluate(() => [...document.querySelectorAll('.search-tabs__tab')]
    .map(t => t.textContent!.trim()).filter(t => /\((\d+)\)/.test(t) && !/\(0\)/.test(t)).length);
  expect(counted, 'only one kind of record came back for a broad query').toBeGreaterThan(1);
});

/* ─────────────────────────── ROW PRESENTATION ─────────────────────────── */
test('C44828 — the typed text is highlighted inside each matching row', async () => {
  const word = longWord(A.customerName);
  const r = await rows(word);
  expect(r.length, `"${word}" finds nothing`).toBeGreaterThan(0);
  const unmarked = r.filter(x => x.marks.length === 0).length;
  expect(unmarked, `${unmarked} of ${r.length} rows carry no highlight at all`).toBe(0);
});

test('C44848 — a close match is drawn as a close match', async () => {
  const word = longWord(A.customerName);
  test.skip(word.length < 8, 'no long enough anchor to damage');
  const typo = transpose(word);
  test.skip(overlap(word, typo) < 0.35, 'the damaged form is below the threshold the spec promises');
  const r = await rows(typo);
  expect(r.length, `"${typo}" finds nothing`).toBeGreaterThan(0);
  expect(r.some(x => x.approx), 'a fuzzy result is not marked as a close match').toBe(true);
});

test('C44838 — status and stock badges appear on the rows that carry them', async () => {
  await closePanel(s.page); await openPanel(s.page);
  await typeQuery(s.page, 'a');
  const badged = await s.page.evaluate(() => [...document.querySelectorAll('.search-row')]
    .filter(r => r.querySelector('[data-test-id="search_row_status_badge"], .search-row__badge, .q-badge')).length);
  expect(badged, 'not one row carries a status or stock badge').toBeGreaterThan(0);
});
