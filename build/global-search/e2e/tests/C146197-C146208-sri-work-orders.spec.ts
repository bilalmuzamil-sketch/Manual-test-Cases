import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { groupRows, lastPointerCheck, type RowShape } from '../fixtures/rowshape.js';
import * as fs from 'node:fs';

/**
 * SEARCH RESULTS INTEGRITY — WORK ORDERS (C146197–C146208, TestRail folder 19387 / SV-10619 · SV-10551)
 *
 * Twelve manual cases. SEVEN are judgeable and asserted here. FIVE (C146202–C146206) carry, in
 * their own Expected Results, the line:
 *
 *     "THIS CASE IS HELD: the specification does not say what should happen here.
 *      Do not pass or fail it. Record what you saw."
 *
 * so they are run as MEASUREMENT ONLY. They assert that the instrument worked and write down the
 * observation; they never assert on the product. A held case that goes red here would be this
 * file inventing a requirement the source does not contain.
 *
 * ── WHAT WOULD MAKE THESE MEASUREMENTS LIE ─────────────────────────────────────────────────────
 * 1. A CSS ellipsis is invisible to innerText, so truncation must be read from geometry. The whole
 *    reason fixtures/rowshape.ts exists — see its header.
 * 2. The All tab lists five rows per group, so every read opens the Work orders tab.
 * 3. The window width decides whether anything clips at all. A headless default of 1280 clips
 *    where a maximised laptop does not, and vice versa, so the viewport is PINNED below and its
 *    value is recorded with every verdict. A truncation result is only true of that width.
 * 4. The mouse pointer owns the selected row, so nothing asserts on aria-selected.
 *
 * Every negative claim in this file carries a positive control on the same row (Standing Rule 104):
 * before concluding "there is no soft-match marker", the test proves it can see the highlight and
 * would see italics, on that same element, in that same read.
 */

const TERM = 'ZZLONGROW';          // both work orders the suite seeded for these cases
const TAB = 'Work orders';         // the build's own label, read off the tab strip
const VIEWPORT = { width: 1440, height: 900 };

let s: Session;
let rows: RowShape[];
const measurements: Record<string, unknown> = { term: TERM, viewport: VIEWPORT };

/** Visible text of a line — what a person can actually read, clipped parts removed. */
const visibleText = (l: { segs: { text: string; visible: boolean }[] }) =>
  l.segs.filter((x) => x.visible).map((x) => x.text).join('').replace(/\s+/g, ' ').trim();

const visibleRow = (r: RowShape) =>
  [visibleText(r.title), r.badge ?? '', visibleText(r.meta)].join(' | ').replace(/\s+/g, ' ').trim();

test.beforeAll(async () => {
  s = await signIn('/customers');
  await s.page.setViewportSize(VIEWPORT);
  measurements.build = await buildMarker(s.page);
  console.log('build under test:', measurements.build, '| viewport', JSON.stringify(VIEWPORT));
  rows = await groupRows(s.page, TERM, TAB);
  measurements.pointer = lastPointerCheck;   // proof, not a comment — see parkPointer()
  console.log('pointer parked:', JSON.stringify(lastPointerCheck));
  measurements.rows = rows.map((r) => ({ ...r, html: undefined }));
  console.log(`${TAB} rows for "${TERM}": ${rows.length}`);
  for (const r of rows) {
    console.log(`  [${r.index}] title="${r.title.text}" clipped=${r.title.clipped} ` +
      `(${r.title.scrollW}/${r.title.clientW}) markVisible=${r.title.markVisible} ` +
      `badge=${r.badge} meta=${JSON.stringify(r.metaParts)} metaClipped=${r.meta.clipped}`);
    if (r.title.hiddenSegs.length) console.log(`       HIDDEN in title: ${JSON.stringify(r.title.hiddenSegs)}`);
    if (r.meta.hiddenSegs.length) console.log(`       HIDDEN in meta:  ${JSON.stringify(r.meta.hiddenSegs)}`);
  }
});

test.afterAll(async () => {
  fs.mkdirSync('results', { recursive: true });
  fs.writeFileSync('results/sri-work-orders.json', JSON.stringify(measurements, null, 1));
  await s?.browser.close();
});

/** The fixture itself must be sound before any verdict it produces means anything. */
test('C146197 — the whole WO number is shown, with what you typed marked inside it', async () => {
  expect(rows.length, `"${TERM}" returned no ${TAB} rows — the fixture data is gone, ` +
    `so nothing below would be a statement about the product`).toBeGreaterThan(0);

  for (const r of rows) {
    // (b) the typed characters are highlighted…
    expect(r.marks.join(' '), `row ${r.index} has no highlight at all`).toContain(TERM);
    // …(a) inside a longer value: there is text on the line that is NOT the match.
    const unmarked = r.title.segs.filter((x) => !x.marked).map((x) => x.text).join('').trim();
    expect(unmarked.length, `row ${r.index} shows only what was typed — title is "${r.title.text}"`)
      .toBeGreaterThan(0);
    // The WO number is the identifier this case is about; it must be one of those unmarked parts.
    expect(unmarked, `row ${r.index} shows no WO number outside the match`).toMatch(/S\d-\d+/);
    // (c) and none of it is cut short.
    expect(r.title.clipped,
      `row ${r.index} title is clipped: it paints ${r.title.clientW}px of ${r.title.scrollW}px and ` +
      `hides ${JSON.stringify(r.title.hiddenSegs)}`).toBe(false);
  }
});

/**
 * C146198 — run TWICE, and the second run is the one that matters.
 *
 * 🔴 THE CASE'S OWN TERM DOES NOT EXERCISE THE CASE. Its precondition asks for "the matched
 * characters near the END of the value", but the term it tells the tester to type — ZZLONGROW —
 * matches at the very START of the customer name, where a left-anchored clip can never reach it.
 * Run as literally written the case passes no matter how badly the row truncates, which is a false
 * PASS on the one question it exists to ask. So the fixture also searches a term that falls in the
 * clipped tail of the SAME records. Nothing about the Expected is changed; only the data reaches
 * the state the case says it needs.
 */
const TAIL_TERM = 'Fernvale';   // sits in the tail of "…Services Of Greater Fernvale 123786"

test('C146198 — nothing cut off has eaten the match or what tells the rows apart', async () => {
  for (const r of rows) {
    const clipped = r.title.clipped || r.meta.clipped;
    if (!clipped) continue;                       // nothing is cut off; the case's question is moot
    // If something IS cut off, the match must survive it…
    expect(r.title.markVisible ?? true, `row ${r.index}: the clip has eaten the typed characters`).toBe(true);
    expect(r.meta.markVisible ?? true, `row ${r.index}: the clip has eaten the typed characters in the second line`).toBe(true);
    // …and so must the identifier that separates this record from its neighbour.
    expect(visibleRow(r), `row ${r.index}: the clip has eaten the WO number`).toMatch(/S\d-\d+/);
  }
  // ── the run the precondition actually asks for ──────────────────────────────────────────────
  const tail = await groupRows(s.page, TAIL_TERM, TAB);
  measurements.tail_C146198 = { term: TAIL_TERM, rows: tail.map((r) => ({ ...r, html: undefined })) };
  console.log(`tail term "${TAIL_TERM}" → ${tail.length} ${TAB} rows`);
  for (const r of tail) console.log(`  [${r.index}] markVisible=${r.title.markVisible} ` +
    `clipped=${r.title.clipped} "${r.title.text.slice(0, 80)}"`);

  // POSITIVE CONTROL (Rule 104): a row where the same reader DOES see the match proves the
  // "invisible" verdict below is about the product, not about the reader.
  const seen = tail.filter((r) => r.title.markVisible === true);
  const eaten = tail.filter((r) => r.title.markVisible === false);
  measurements.tailControl_C146198 = { visibleOn: seen.map((r) => r.title.text.slice(0, 60)),
                                       eatenOn: eaten.map((r) => r.title.text.slice(0, 60)) };
  expect(seen.length,
    `POSITIVE CONTROL FAILED: the reader saw the "${TAIL_TERM}" highlight as visible on NO row, so ` +
    `"the clip ate it" is unproven — it may be reading geometry wrong on every row.`).toBeGreaterThan(0);

  expect(eaten.map((r) => r.title.text),
    `typing "${TAIL_TERM}" returns these rows with the matched word clipped clean off the line — ` +
    `the row comes back and cannot say why (SV-10619 / SV-10551)`).toHaveLength(0);
});

test('C146199 — the highlight marks the match inside the text, not instead of it', async () => {
  for (const r of rows) {
    const segs = r.title.segs;
    expect(segs.some((x) => x.marked), `row ${r.index}: nothing is marked`).toBe(true);
    expect(segs.some((x) => !x.marked), `row ${r.index}: the mark has replaced the text`).toBe(true);
    // Reassembling the segments must give back the whole value — no character is dropped by the
    // highlight, which is the exact failure PRD v1.5 §5.3's "Fib" example rules out.
    const rebuilt = segs.map((x) => x.text).join('').replace(/\s+/g, ' ').trim();
    expect(rebuilt, `row ${r.index}: the marked and unmarked parts do not add up to the line`)
      .toBe(r.title.text.replace(/\s+/g, ' ').trim());
  }
});

test('C146200 — two records sharing the typed text can be told apart from the rows alone', async () => {
  expect(rows.length, 'this case needs at least two rows sharing the fragment').toBeGreaterThan(1);
  const seen = rows.map(visibleRow);
  const dupes = seen.filter((v, i) => seen.indexOf(v) !== i);
  expect(dupes, `these rows read identically to a person: ${JSON.stringify(dupes)}`).toHaveLength(0);
  // Not enough that the strings differ — the difference must be in the IDENTIFIER, not incidental.
  const ids = rows.map((r) => (visibleRow(r).match(/S\d-\d+/) || [''])[0]);
  expect(new Set(ids).size, `the visible WO numbers are ${JSON.stringify(ids)}`).toBe(rows.length);
});

test('C146201 — rows with the same bold line still differ somewhere you can see', async () => {
  const byTitle = new Map<string, RowShape[]>();
  for (const r of rows) {
    const k = visibleText(r.title);
    byTitle.set(k, [...(byTitle.get(k) ?? []), r]);
  }
  const shared = [...byTitle.entries()].filter(([, v]) => v.length > 1);
  measurements.sharedBoldLines_C146201 = shared.map(([k, v]) => ({ title: k, rows: v.map((r) => r.index) }));
  for (const [title, group] of shared) {
    const rest = group.map((r) => `${r.badge ?? ''} | ${visibleText(r.meta)}`);
    expect(new Set(rest).size,
      `rows ${group.map((r) => r.index).join(',')} share the bold line "${title}" and nothing ` +
      `visible separates them: ${JSON.stringify(rest)}`).toBe(group.length);
  }
});

test('C146207 — the row shows every field the requirement names', async () => {
  // PRD v1.5 §4: "Displayed: WO number + customer name (primary), status badge,
  // unit number + year/make/model. When the asset has no unit number, the y/m/m stands alone."
  for (const r of rows) {
    const vis = visibleRow(r);
    const missing: string[] = [];
    if (!/S\d-\d+/.test(visibleText(r.title))) missing.push('WO number');
    // Customer name = the primary line with the WO number taken off the front.
    if (visibleText(r.title).replace(/^S\d-\d+\s*/, '').trim().length === 0) missing.push('customer name');
    if (!r.badge) missing.push('status badge');
    // The second line carries unit number and year/make/model, separated by " · ".
    const ymm = r.metaParts.find((p) => /\b(19|20)\d{2}\b/.test(p));
    if (!ymm) missing.push('year/make/model');
    const unit = r.metaParts.filter((p) => p !== ymm);
    if (!unit.length) missing.push('unit number (allowed to be absent only when the asset has none)');
    expect(missing, `row ${r.index} is missing ${JSON.stringify(missing)} — the row reads "${vis}"`)
      .toHaveLength(0);
  }
});

test('C146208 — a soft match is drawn as a soft match', async () => {
  const SOFT = 'ZZSOFTHIT';
  const soft = await groupRows(s.page, SOFT, TAB);
  measurements.soft_C146208 = soft.map((r) => ({ ...r, html: undefined }));
  console.log(`"${SOFT}" ${TAB} rows: ${soft.length}`);
  for (const r of soft) console.log(`  [${r.index}] "${r.text}" marks=${JSON.stringify(r.marks)} ` +
    `approx=${r.approx} italicMarks=${JSON.stringify(r.italicMarks)}`);

  expect(soft.length, `"${SOFT}" returned no ${TAB} rows`).toBeGreaterThan(0);
  // The case names the soft row: the near-miss, not the exact hits above it.
  const exact = soft.filter((r) => new RegExp(SOFT, 'i').test(r.text));
  const near = soft.filter((r) => !new RegExp(SOFT, 'i').test(r.text));
  measurements.soft_split_C146208 = { exact: exact.map((r) => r.text), near: near.map((r) => r.text) };
  expect(near.length,
    `no near-miss row came back for "${SOFT}" — every row contains the term literally, so there is ` +
    `no soft match to judge and this is a statement about the data, not the product`).toBeGreaterThan(0);

  for (const r of near) {
    // POSITIVE CONTROL (Rule 104): before saying "no soft-match marker", prove this read can see
    // the treatments at all. The row must carry a highlight — if it does not, the reader is not
    // looking at a rendered row and any "absent" conclusion is about the reader.
    expect(r.marks.length,
      `POSITIVE CONTROL FAILED on row ${r.index}: no highlight found either, so "no ≈ or italics" ` +
      `is unproven. The reader is not seeing this row's markup.`).toBeGreaterThan(0);
    expect(r.approx || r.italicMarks.length > 0,
      `row ${r.index} "${r.text}" is a soft match drawn exactly like an exact one: no "≈" anywhere ` +
      `on the row and no highlighted text in italics. Highlights present: ${JSON.stringify(r.marks)}.`)
      .toBe(true);
  }
});

/* ───────────────────────────── HELD — recorded, never judged ───────────────────────────────── */

for (const held of [
  { cid: 'C146202', field: 'VIN / serial number', term: 'SVEWU82M5ETEJFWFA' },
  { cid: 'C146205', field: 'line item descriptions (parts and labor)', term: '786' },
  { cid: 'C146206', field: 'part numbers on the work order lines', term: '786' },
  // Found live on staging 2026-09-29: the case shipped with no term because nothing matched these
  // two fields when it was written. Brandi Smith is a lead technician on 15 work orders and Jason
  // Garrison is the service advisor on S2-9379, so both fields can now be exercised.
  { cid: 'C146203', field: 'lead technician name', term: 'Brandi Smith' },
  { cid: 'C146204', field: 'service advisor name', term: 'Garrison' },
]) {
  test(`${held.cid} — [HELD: the source is silent] does a match on ${held.field} explain itself?`, async () => {
    const r = await groupRows(s.page, held.term, TAB);
    const obs = r.map((x) => ({
      row: x.index, text: x.text, marks: x.marks,
      termVisibleOnRow: new RegExp(held.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(x.text),
      // Recorded because it changes what the reader can actually see: on several rows the matched
      // value is present in the DOM but clipped mid-word ("Technician: Brandi Smi").
      metaClipped: x.meta.clipped, metaHidden: x.meta.hiddenSegs,
      titleClipped: x.title.clipped, markVisible: x.meta.markVisible ?? x.title.markVisible,
    }));
    (measurements as any)[`held_${held.cid}`] = { term: held.term, field: held.field, rows: obs };
    console.log(`${held.cid} HELD — "${held.term}" → ${r.length} rows`);
    for (const o of obs) console.log(`   row ${o.row}: termOnRow=${o.termVisibleOnRow} ` +
      `markVisible=${o.markVisible} metaClipped=${o.metaClipped} "${o.text.slice(0, 95)}"`);
    // The ONLY assertion a held case may carry is that the measurement happened. Anything else
    // would be this file deciding a question the specification leaves open (PO question Q1).
    expect(Array.isArray(obs), 'the observation was recorded').toBe(true);
  });
}
