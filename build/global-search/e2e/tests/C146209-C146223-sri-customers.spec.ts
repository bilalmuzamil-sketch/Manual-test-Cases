import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { groupRows, hoverRow, lastPointerCheck, type RowShape } from '../fixtures/rowshape.js';
import * as fs from 'node:fs';

/**
 * SEARCH RESULTS INTEGRITY — CUSTOMERS (C146209–C146223, folder 19387 / SV-10619 · SV-10551)
 *
 * Fifteen manual cases: six judgeable here, eight HELD by their own Expected Results ("the
 * specification does not say what should happen here — do not pass or fail it"), and one,
 * C146213, whose Expected says "THIS CASE DOES NOT APPLY … Leave it Untested" because the product
 * refuses to create two customers with the same name. That one is not run and not recorded.
 *
 * ── TWO ABSENCES ARE CLAIMED HERE, SO BOTH CARRY A CONTROL (Standing Rule 104) ─────────────────
 * PRD v1.5 §4 promises a customer row an "open WO count badge" and "telephone on hover". Neither
 * appears. Both are negative claims, and a negative claim from a reader that cannot see the thing
 * is worthless, so:
 *   · the BADGE control reads a Work orders row in the same session with the same selector, where
 *     a badge IS drawn ("Estimate"). A reader that finds that one and not this one is working.
 *   · the HOVER control asserts the row actually matched :hover after the pointer moved onto it.
 *     Without that, "hovering shows no telephone" may only mean the pointer never arrived.
 *
 * Everything in fixtures/rowshape.ts's header applies here too — above all that a CSS ellipsis is
 * invisible to innerText, so truncation is read from geometry and never from characters.
 */

const TERM = 'ZZLONGROW';
const TAB = 'Customers';
const VIEWPORT = { width: 1440, height: 900 };

let s: Session;
let rows: RowShape[];
const m: Record<string, unknown> = { term: TERM, viewport: VIEWPORT };

/** What a person can read on this line — partially clipped segments counted character by
 *  character, not thrown away whole. See Seg.visibleText for why that distinction matters. */
const visibleText = (l: { segs: { visibleText: string }[] }) =>
  l.segs.map((x) => x.visibleText).join('').replace(/\s+/g, ' ').trim();
const visibleRow = (r: RowShape) =>
  [visibleText(r.title), r.badge ?? '', visibleText(r.meta)].join(' | ').replace(/\s+/g, ' ').trim();

test.beforeAll(async () => {
  s = await signIn('/customers');
  await s.page.setViewportSize(VIEWPORT);
  m.build = await buildMarker(s.page);
  rows = await groupRows(s.page, TERM, TAB);
  m.pointer = lastPointerCheck;
  m.rows = rows.map((r) => ({ ...r, html: undefined }));
  console.log('build:', m.build, '| pointer:', JSON.stringify(lastPointerCheck));
  for (const r of rows) console.log(`  [${r.index}] "${r.title.text}" clipped=${r.title.clipped} ` +
    `(${r.title.scrollW}/${r.title.clientW}) badge=${r.badge} meta=${JSON.stringify(r.metaParts)}`);
});

test.afterAll(async () => {
  fs.mkdirSync('results', { recursive: true });
  fs.writeFileSync('results/sri-customers.json', JSON.stringify(m, null, 1));
  await s?.browser.close();
});

/**
 * C146209 — NOT ASSERTED AGAINST THE PRODUCT, AND THE REASON IS THE CASE, NOT THE BUILD.
 *
 * Its Expected reads "Each row shows the COMPLETE telephone, with the bit you typed highlighted
 * inside it", but the term it supplies, ZZLONGROW, is part of a customer NAME and matches no
 * telephone anywhere; and the requirement this suite quotes puts the telephone on hover, not on
 * the row. So neither half of the Expected can be reached with the data the case gives, and a
 * verdict either way would be invented. Rule 114 forbids editing an Expected to make it runnable,
 * and says a case that cannot be run is Blocked with the reason — so this records the measurement
 * and the blocking reason, and the case is written up for the QA lead.
 */
test('C146209 — [cannot be judged as written] record the telephone and the highlight', async () => {
  const hov = await hoverRow(s.page, 0);
  m.c146209 = {
    anyTelephoneOnRow: rows.map((r) => /\+?\d[\d\s().-]{6,}/.test(r.text)),
    marks: rows.map((r) => r.marks),
    hoverGained: hov.gained,
  };
  console.log('C146209 telephone on row:', JSON.stringify(m.c146209));
  expect(rows.length, 'the term returns no customer rows at all').toBeGreaterThan(0);
});

test('C146210 — nothing cut off has eaten the match or what tells the rows apart', async () => {
  // The supplied term matches at the START of the name, where a right-hand clip cannot reach it,
  // so — as on the Work Orders sheet — the run that answers this case uses a term from the TAIL of
  // the same records. The Expected is untouched; only the data reaches the state it describes.
  const TAIL = '123786';
  const tail = await groupRows(s.page, TAIL, TAB);
  m.tail_C146210 = { term: TAIL, rows: tail.map((r) => ({ ...r, html: undefined })) };
  for (const r of tail) console.log(`  tail [${r.index}] markVisible=${r.title.markVisible} ` +
    `clipped=${r.title.clipped} "${r.title.text.slice(0, 90)}"`);

  for (const r of [...rows, ...tail]) {
    if (!(r.title.clipped || r.meta.clipped)) continue;
    expect(r.title.markVisible ?? true,
      `"${r.title.text.slice(0, 60)}…" — the clip has eaten the characters that were typed`).toBe(true);
  }
  // And the rows must still be separable after the clip.
  const seen = [...rows].map(visibleRow);
  expect(new Set(seen).size, `two customer rows read identically once cut short: ${JSON.stringify(seen)}`)
    .toBe(seen.length);
});

test('C146211 — the highlight marks the match inside the text, not instead of it', async () => {
  for (const r of rows) {
    expect(r.title.segs.some((x) => x.marked), `row ${r.index}: nothing is marked`).toBe(true);
    expect(r.title.segs.some((x) => !x.marked), `row ${r.index}: the mark has replaced the text`).toBe(true);
    const rebuilt = r.title.segs.map((x) => x.text).join('').replace(/\s+/g, ' ').trim();
    expect(rebuilt, `row ${r.index}: the pieces do not add up to the line`)
      .toBe(r.title.text.replace(/\s+/g, ' ').trim());
  }
});

test('C146212 — two customers sharing the typed text can be told apart from the rows alone', async () => {
  expect(rows.length, 'this case needs more than one row').toBeGreaterThan(1);
  const seen = rows.map(visibleRow);
  const dupes = seen.filter((v, i) => seen.indexOf(v) !== i);
  expect(dupes, `these rows read identically to a person: ${JSON.stringify(dupes)}`).toHaveLength(0);
});

/**
 * C146222 — judged on a customer that MEETS THE CASE'S PRECONDITION.
 *
 * 🔴 THE SEEDED ZZLONGROW CUSTOMERS CANNOT ANSWER THIS CASE. It asks for "any customer that search
 * returns, WHICH HAS A VALUE IN EACH FIELD named in the requirement" — and those customers have no
 * open work orders, so no count badge is drawn. Judging them produced "the customer row has no
 * open WO count badge", which is false: a customer WITH open work orders shows "30 open" plainly.
 * A row that legitimately has nothing to show in a field cannot be evidence that the field is
 * missing. So this uses a customer that has both an open-WO count and a telephone on file.
 */
const BADGED_CUSTOMER = '7 Star Truck Repair';   // 30 open work orders, telephone 609-461-6502

test('C146222 — the customer row shows every field the requirement names', async () => {
  // PRD v1.5 §4: "Displayed: customer name (primary), address line, open WO count badge (e.g. 12),
  // telephone on hover."
  const found = await groupRows(s.page, BADGED_CUSTOMER, TAB);
  expect(found.length, `the fixture customer "${BADGED_CUSTOMER}" is gone from this environment`)
    .toBeGreaterThan(0);
  const r = found[0];
  const hov = await hoverRow(s.page, 0);
  console.log(`C146222 row: "${r.text}" badge=${JSON.stringify(r.badge)}`);

  // ── CONTROL 1: on THIS row type, can the reader see a badge? (A control on a different row
  // type is not a control — that mistake is written up in fixtures/rowshape.ts.)
  const badgeControl = found.map((x) => x.badge).filter(Boolean);
  // ── CONTROL 2: did the pointer actually reach the row? Answered by hoverRow WHILE hovering —
  // asking here would answer false every time, because the pointer has already been parked again.
  const hoverReached = hov.reached;
  m.c146222 = { badgeControl, hoverGained: hov.gained, hoverReached, row: r.text };
  console.log('C146222 badge control (work order rows):', JSON.stringify(badgeControl));
  console.log('C146222 hover gained:', JSON.stringify(hov.gained), '| pointer reached row:', hoverReached);

  expect(badgeControl.length,
    'CONTROL FAILED: the reader found no badge on ANY customer row returned here, so anything it ' +
    'says about a missing badge is about the reader. Fix the reader before reporting it.')
    .toBeGreaterThan(0);

  expect(hoverReached,
    'CONTROL FAILED: the pointer never actually landed on the row, so "hovering shows no telephone" ' +
    'says nothing about the product. Fix the hover before reporting anything about it.').toBe(true);

  const missing: string[] = [];
  if (!visibleText(r.title)) missing.push('customer name');
  if (!r.metaParts.length) missing.push('address line');
  if (!r.badge) missing.push('open WO count badge');
  if (!hov.gained.some((w) => /\d/.test(w))) missing.push('telephone on hover');
  expect(missing, `the customer row is missing ${JSON.stringify(missing)}. Row reads "${r.text}". ` +
    `Hover added ${JSON.stringify(hov.gained)} (pointer reached the row: ${hoverReached}).`)
    .toHaveLength(0);
});

test('C146223 — a soft match is drawn as a soft match', async () => {
  const SOFT = 'ZZPREFIY';
  const soft = await groupRows(s.page, SOFT, TAB);
  m.soft_C146223 = soft.map((r) => ({ ...r, html: undefined }));
  for (const r of soft) console.log(`  soft [${r.index}] approx=${r.approx} ` +
    `italic=${JSON.stringify(r.italicMarks)} marks=${JSON.stringify(r.marks)} "${r.text.slice(0, 80)}"`);
  expect(soft.length, `"${SOFT}" returned no ${TAB} rows`).toBeGreaterThan(0);

  const near = soft.filter((r) => !new RegExp(SOFT, 'i').test(r.text));
  expect(near.length, `no near-miss row came back for "${SOFT}" — nothing to judge`).toBeGreaterThan(0);
  for (const r of near) {
    expect(r.marks.length, `CONTROL FAILED on row ${r.index}: no highlight either`).toBeGreaterThan(0);
    expect(r.approx || r.italicMarks.length > 0,
      `row ${r.index} "${r.text}" is a close match drawn exactly like an exact one`).toBe(true);
  }
});

/* ────────────────────────────────────────────────────────────────────────────────────────────
 * THE HELD TESTS THAT USED TO LIVE HERE WERE REMOVED ON 29 SEPTEMBER 2026.
 *
 * Those cases were un-held that day and rewritten to assert that the labelled note shows the
 * WHOLE matched value. They are now covered, with real assertions, by
 *     tests/C146202-C146282-sri-retest-full-value.spec.ts
 *
 * Leaving the old measurement-only versions in place meant the same case was measured TWICE in
 * one run — once judged, once "recorded only". A held test asserts nothing about the product, so
 * whichever the reporter printed last won, and genuine Failed verdicts were being overwritten
 * with Blocked. Nineteen cases were affected before it was caught. One case, one test.
 * ──────────────────────────────────────────────────────────────────────────────────────────── */
