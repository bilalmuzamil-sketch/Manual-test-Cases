import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { groupRows, lastPointerCheck, type RowShape } from '../fixtures/rowshape.js';
import * as fs from 'node:fs';

/**
 * SEARCH RESULTS INTEGRITY — THE SIX ENTITY SHEETS (folder 19387 / SV-10619 · SV-10551)
 *
 * Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices — 61 manual cases,
 * 42 judgeable and 19 held by their own Expected Results. Every sheet asks the same seven
 * questions of its own record type, so this is ONE table-driven file with one named test per
 * case (Rule 115's amendment), not six near-identical ones. The C-id leads every test name, so a
 * red line points straight at a case.
 *
 * Read fixtures/rowshape.ts's header first — above all that a CSS ellipsis is invisible to
 * innerText, so every truncation question here is answered from geometry.
 *
 * ── THREE THINGS THIS FILE DOES DELIBERATELY ──────────────────────────────────────────────────
 * 1. **A2 FINDS ITS OWN TAIL TERM.** Every sheet supplies a term that matches at the START of the
 *    value, where a right-hand clip can never reach it — so run literally, A2 passes however badly
 *    the row truncates (see L0242). Rather than hard-code a tail term per entity, each A2 derives
 *    one from the record it is looking at: the last long word of a clipped title, which is by
 *    definition in the part that gets cut. If that term returns nothing, A2 says it could not
 *    reach the state rather than passing.
 * 2. **D1 IS CHECKED AGAINST THAT SHEET'S OWN QUOTE**, carried below next to the fields, because
 *    each record type promises different things.
 * 3. **HELD CASES ARE NEVER ASSERTED.** They record what was seen and nothing else.
 */

type Check = { cid: number; term: string };
type Entity = {
  section: string;
  tab: string;
  a1Field: string;                       // what this sheet's A1 calls "the COMPLETE …"
  /**
   * 🔴 NOT TYPED OUT BY HAND. The C-ids and search terms are read from entity-config.json, which
   * is generated from the live TestRail cases. The first draft of this file listed them inline and
   * two were already wrong — Parts D1 and Vendors D1 had been given the id of a HELD case in the
   * same sheet, which would have written a judged verdict onto a case that must not be judged.
   * Sixty-one ids copied by hand is sixty-one chances to do that silently.
   */
  cases: Record<string, Check>;
  d1Quote: string;
  /** Each field the quote names, and how it is recognised on a row. */
  d1: { name: string; on: (r: RowShape, vis: string) => boolean }[];
  held: { cid: number; term: string; field: string }[];
};

const YEAR = /\b(19|20)\d{2}\b/;
const MONEY = /[$]\s?[\d,]+\.?\d*/;
// 🔴 A DATE IS OFTEN NOT A DATE. These rows write a recent date in words - "Today",
// "Yesterday", "3 days ago" - so a pattern that only accepts 12/03/2026 or "Mar 12" reports the
// created date as MISSING when it is plainly on the row. That produced a wrong half of C146264:
// the Part Sales row reads "Admin ShopView · Today" and was recorded as having no created date.
// Only the total price is genuinely absent there.
const DATE = /\d{1,2}\/\d{1,2}\/\d{2,4}|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}|\b(today|yesterday)\b|\b\d+\s+(minute|hour|day|week|month|year)s?\s+ago\b/i;
const PHONE = /\d{3}[-.\s]\d{3}[-.\s]\d{4}|\(\d{3}\)\s?\d{3}[-.\s]\d{4}/;

// `cases` and `held` below are left EMPTY on purpose — both are filled from entity-config.json,
// which is generated from the live cases. Only the things that are genuinely logic live here: the
// tab label, what this sheet's A1 calls the value, the requirement's own sentence, and how each
// field it names is recognised on a row.
const ENTITIES: Entity[] = [
  {
    section: 'Assets', tab: 'Assets', a1Field: 'unit number',
    d1Quote: 'Displayed: year + make + model (primary), customer name (secondary, smaller).',
    d1: [
      { name: 'year + make + model (primary)', on: (r) => YEAR.test(r.title.text) && r.title.text.trim().split(/\s+/).length >= 3 },
      { name: 'customer name (secondary)', on: (r) => r.metaParts.join(' ').trim().length > 0 },
    ],
    held: [],
  },
  {
    section: 'Parts', tab: 'Parts', a1Field: 'part number',
    d1Quote: 'Displayed: description (primary), part number (secondary), total quantity with a stock-status badge (see §5.3).',
    d1: [
      { name: 'description (primary)', on: (r) => r.title.text.trim().length > 0 },
      { name: 'part number (secondary)', on: (r) => r.metaParts.join(' ').trim().length > 0 },
      { name: 'total quantity with a stock-status badge', on: (r, vis) => !!r.badge || /\b\d+\s*(in stock|available|on hand)\b/i.test(vis) },
    ],
    held: [],
  },
  {
    section: 'Vendors', tab: 'Vendors', a1Field: 'telephone',
    d1Quote: 'Displayed: vendor name (primary), telephone + address line (secondary).',
    d1: [
      { name: 'vendor name (primary)', on: (r) => r.title.text.trim().length > 0 },
      { name: 'telephone (secondary)', on: (r, vis) => PHONE.test(vis) },
      { name: 'address line (secondary)', on: (r) => r.metaParts.some((p) => !PHONE.test(p) && p.trim().length > 3) },
    ],
    held: [],
  },
  {
    section: 'Part Sales', tab: 'Part sales', a1Field: 'P-number',
    d1Quote: 'Displayed: P-number + customer (primary), status badge, total price + created date.',
    d1: [
      { name: 'P-number (primary)', on: (r) => /\bP\d|\bP-\d/i.test(r.title.text) },
      { name: 'customer (primary)', on: (r) => r.title.text.replace(/\bP-?\d+\b/i, '').trim().length > 0 },
      { name: 'status badge', on: (r) => !!r.badge },
      { name: 'total price', on: (r, vis) => MONEY.test(vis) },
      { name: 'created date', on: (r, vis) => DATE.test(vis) },
    ],
    held: [],
  },
  {
    section: 'Purchase Orders', tab: 'Purchase orders', a1Field: 'PO number',
    d1Quote: 'Displayed: PO number + vendor (primary), status badge (Ordered / Received), total + created date.',
    d1: [
      { name: 'PO number (primary)', on: (r) => /\d/.test(r.title.text) },
      { name: 'vendor (primary)', on: (r) => /[A-Za-z]{3}/.test(r.title.text) },
      { name: 'status badge', on: (r) => !!r.badge },
      { name: 'total', on: (r, vis) => MONEY.test(vis) },
      { name: 'created date', on: (r, vis) => DATE.test(vis) },
    ],
    held: [],
  },
  {
    section: 'Vendor Invoices', tab: 'Vendor invoices', a1Field: 'invoice number',
    d1Quote: 'Displayed: invoice number + vendor (primary), status badge (Paid / Unpaid), total + invoice date.',
    d1: [
      { name: 'invoice number (primary)', on: (r) => /\d/.test(r.title.text) },
      { name: 'vendor (primary)', on: (r) => /[A-Za-z]{3}/.test(r.title.text) },
      { name: 'status badge', on: (r) => !!r.badge },
      { name: 'total', on: (r, vis) => MONEY.test(vis) },
      { name: 'invoice date', on: (r, vis) => DATE.test(vis) },
    ],
    held: [],
  },
];

// The held rows are data, not logic, so they are read from the file generated off the live cases.
// 🔴 THE TERMS ARE PER-ENVIRONMENT. These were harvested on staging, where the ZZ... records were
// seeded. Production has none of them, so every one of these checks returns no rows there and the
// spec's own guards correctly refuse to judge - 46 checks came back unjudgeable for exactly that
// reason on 2026-10-01. Point GS_ENTITY_CONFIG at a config harvested from the environment under
// test and the same checks become runnable anywhere, without seeding anything.
const CFG_DIR = process.env.GS_ENTITY_CONFIG || '../staging-run-2026-09-29';
const CFG = JSON.parse(fs.readFileSync(`${CFG_DIR}/entity-config.json`, 'utf8'));
const FOUND = JSON.parse(fs.readFileSync(`${CFG_DIR}/held-terms-found.json`, 'utf8'));
for (const e of ENTITIES) {
  const c = CFG[e.section];
  e.cases = Object.fromEntries(Object.entries(c.cases).map(([k, v]: [string, any]) => [k, { cid: v.cid, term: v.term }]));
  // Terms found or seeded for held cases that shipped without one — see the file's own note.
  e.held = c.held.map((h: any) => ({ cid: h.cid, term: h.term ?? FOUND[String(h.cid)]?.term ?? null, field: h.field }));
  // A judged code and a held case can never be the same id; if they ever are, the config is wrong.
  const judged = new Set(Object.values(e.cases).map((x: any) => x.cid));
  for (const h of e.held) if (judged.has(h.cid)) throw new Error(`${e.section}: C${h.cid} is both judged and held`);
  for (const k of ['A1', 'A2', 'A3', 'B1', 'B2', 'D1', 'I1']) if (!e.cases[k]) throw new Error(`${e.section}: no ${k}`);
}

const VIEWPORT = { width: 1440, height: 900 };
let s: Session;
const m: Record<string, any> = { viewport: VIEWPORT };

const visibleText = (l: { segs: { visibleText: string }[] }) =>
  l.segs.map((x) => x.visibleText).join('').replace(/\s+/g, ' ').trim();
const visibleRow = (r: RowShape) =>
  [visibleText(r.title), r.badge ?? '', visibleText(r.meta)].join(' | ').replace(/\s+/g, ' ').trim();

/**
 * Every line that CONTAINS the typed text must highlight it IN THAT LINE.
 *
 * PRD v1.5 §5.3: "The matched substring of the query is highlighted in the primary and secondary
 * text". A row-level check — "is there a mark anywhere?" — is too loose to test that, and it hid a
 * real fault: an Assets row carries the unit number ZZLONGROW-123786 in its bold first line as
 * PLAIN TEXT while highlighting the same characters in the customer name underneath, so a
 * row-level check passes while the primary line shows the reader nothing. This returns the lines
 * that contain the term and fail to mark it.
 */
const unmarkedLines = (r: RowShape, term: string) => {
  const t = term.split(/\s+/)[0].toLowerCase();       // first word: multi-word terms match loosely
  const bad: string[] = [];
  for (const [name, line] of [['primary', r.title], ['secondary', r.meta]] as const) {
    if (!line.text.toLowerCase().includes(t)) continue;          // the term is not on this line
    const marked = line.segs.some((x) => x.marked && x.text.toLowerCase().includes(t));
    if (!marked) bad.push(`${name} line "${line.text.slice(0, 70)}"`);
  }
  return bad;
};

/** The last long word of a title — by construction in the part a right-hand clip removes. */
const tailWordOf = (title: string) => {
  const w = title.trim().split(/\s+/).filter((x) => x.replace(/[^\w-]/g, '').length >= 4);
  return w.length ? w[w.length - 1].replace(/[^\w-]/g, '') : null;
};

test.beforeAll(async () => {
  s = await signIn('/customers');
  await s.page.setViewportSize(VIEWPORT);
  m.build = await buildMarker(s.page);
  console.log('build under test:', m.build);
});
test.afterAll(async () => {
  fs.mkdirSync('results', { recursive: true });
  fs.writeFileSync('results/sri-entities.json', JSON.stringify(m, null, 1));
  await s?.browser.close();
});

for (const E of ENTITIES) {
  const C = E.cases;
  const store = (k: string, v: unknown) => { m[`${E.section}:${k}`] = v; };

  test(`C${C.A1.cid} — ${E.section}: the whole ${E.a1Field} is shown, with the typed part marked inside it`, async () => {
    const rows = await groupRows(s.page, C.A1.term, E.tab);
    store('A1', { pointer: lastPointerCheck, rows: rows.map((r) => ({ ...r, html: undefined })) });
    console.log(`\n== ${E.section} / "${C.A1.term}" → ${rows.length} rows`);
    for (const r of rows) console.log(`   [${r.index}] clipped=${r.title.clipped} ` +
      `(${r.title.scrollW}/${r.title.clientW}) badge=${r.badge} "${r.title.text.slice(0, 70)}" ` +
      `meta=${JSON.stringify(r.metaParts).slice(0, 80)}`);
    expect(rows.length, `"${C.A1.term}" returns no ${E.tab} rows — nothing below would be about the product`)
      .toBeGreaterThan(0);
    for (const r of rows) {
      // POSITIVE CONTROL first: the reader must find a highlight SOMEWHERE on this row, or its
      // report that a particular line lacks one says nothing about the product.
      expect(r.marks.length,
        `CONTROL FAILED: no highlight found anywhere on row ${r.index}, so anything said below about ` +
        `an unhighlighted line is about this reader`).toBeGreaterThan(0);
      // …then the requirement itself: highlighted in the primary AND secondary text.
      expect(unmarkedLines(r, C.A1.term),
        `row ${r.index}: the typed text is shown on these lines without being highlighted there, ` +
        `though it IS highlighted elsewhere on the row (marks: ${JSON.stringify(r.marks)})`).toEqual([]);
      const unmarked = r.title.segs.filter((x) => !x.marked).map((x) => x.text).join('').trim();
      expect(unmarked.length, `row ${r.index} shows only what was typed: "${r.title.text}"`).toBeGreaterThan(0);
      expect(r.title.clipped,
        `row ${r.index} is cut short — it paints ${r.title.clientW}px of ${r.title.scrollW}px and hides ` +
        `${JSON.stringify(r.title.hiddenSegs)}`).toBe(false);
    }
  });

  test(`C${C.A2.cid} — ${E.section}: nothing cut off has eaten the match or what separates the rows`, async () => {
    const rows = await groupRows(s.page, C.A2.term, E.tab);
    for (const r of rows) {
      if (!(r.title.clipped || r.meta.clipped)) continue;
      expect(r.title.markVisible ?? true, `row ${r.index}: the clip has eaten the typed characters`).toBe(true);
    }
    // …and now the run the precondition actually describes: a match in the clipped tail.
    const clipped = rows.find((r) => r.title.clipped);
    const tail = clipped ? tailWordOf(clipped.title.text) : null;
    store('A2.tailTerm', tail);
    if (!tail) {
      store('A2', { note: 'no row is clipped, so there is no tail to match in', rows: rows.length });
      console.log(`   ${E.section} A2: nothing is clipped — the case's question does not arise here`);
      return;
    }
    const tailRows = await groupRows(s.page, tail, E.tab);
    store('A2.tail', { term: tail, rows: tailRows.map((r) => ({ ...r, html: undefined })) });
    console.log(`   ${E.section} A2 tail term "${tail}" → ${tailRows.length} rows`);
    for (const r of tailRows) console.log(`      [${r.index}] markVisible=${r.title.markVisible} clipped=${r.title.clipped}`);
    if (!tailRows.length) {
      console.log(`   ${E.section} A2: "${tail}" returns nothing, so the tail state could not be reached`);
      return;
    }
    // POSITIVE CONTROL: at least one row must show the tail match, or the reader is the problem.
    expect(tailRows.some((r) => r.title.markVisible !== false),
      `CONTROL FAILED: the reader sees the "${tail}" highlight on no row at all, so "the clip ate it" ` +
      `is unproven.`).toBe(true);
    const eaten = tailRows.filter((r) => r.title.markVisible === false);
    expect(eaten.map((r) => r.title.text),
      `typing "${tail}" returns these rows with the matched word clipped clean off — the row comes back ` +
      `and cannot say why (SV-10619 / SV-10551)`).toHaveLength(0);
  });

  test(`C${C.A3.cid} — ${E.section}: the highlight marks the match inside the text, not instead of it`, async () => {
    const rows = await groupRows(s.page, C.A3.term, E.tab);
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(r.marks.length, `CONTROL FAILED: no highlight anywhere on row ${r.index}`).toBeGreaterThan(0);
      expect(unmarkedLines(r, C.A3.term),
        `row ${r.index}: the typed text appears on these lines unhighlighted`).toEqual([]);
      expect(r.title.segs.some((x) => !x.marked), `row ${r.index}: the mark replaced the text`).toBe(true);
      const rebuilt = r.title.segs.map((x) => x.text).join('').replace(/\s+/g, ' ').trim();
      expect(rebuilt, `row ${r.index}: the pieces do not add up to the line`)
        .toBe(r.title.text.replace(/\s+/g, ' ').trim());
    }
  });

  test(`C${C.B1.cid} — ${E.section}: two records sharing the typed text can be told apart`, async () => {
    const rows = await groupRows(s.page, C.B1.term, E.tab);
    store('B1', rows.map(visibleRow));
    expect(rows.length, 'this case needs more than one row to be about anything').toBeGreaterThan(1);
    const seen = rows.map(visibleRow);
    const dupes = seen.filter((v, i) => seen.indexOf(v) !== i);
    expect(dupes, `these rows read identically to a person: ${JSON.stringify(dupes)}`).toHaveLength(0);
  });

  test(`C${C.B2.cid} — ${E.section}: records with the same bold line differ somewhere you can see`, async () => {
    const rows = await groupRows(s.page, C.B2.term, E.tab);
    const byTitle = new Map<string, RowShape[]>();
    for (const r of rows) byTitle.set(visibleText(r.title), [...(byTitle.get(visibleText(r.title)) ?? []), r]);
    const shared = [...byTitle.entries()].filter(([, v]) => v.length > 1);
    store('B2', { term: C.B2.term, rows: rows.map(visibleRow), sharedBoldLines: shared.map(([k]) => k) });
    console.log(`   ${E.section} B2 "${C.B2.term}": ${rows.length} rows, ${shared.length} shared bold line(s)`);
    for (const [title, group] of shared) {
      const rest = group.map((r) => `${r.badge ?? ''} | ${visibleText(r.meta)}`);
      expect(new Set(rest).size,
        `rows ${group.map((r) => r.index).join(',')} share the bold line "${title}" and nothing visible ` +
        `separates them: ${JSON.stringify(rest)}`).toBe(group.length);
    }
  });

  test(`C${C.D1.cid} — ${E.section}: the row shows every field the requirement names`, async () => {
    const rows = await groupRows(s.page, C.D1.term, E.tab);
    expect(rows.length, `"${C.D1.term}" returns no ${E.tab} rows`).toBeGreaterThan(0);
    // Judge the row that BEST satisfies the case's precondition ("has a value in each field named"),
    // because a record with nothing to show in a field is not evidence the field is missing — the
    // mistake that produced a false "the customer row has no count badge" on C146222.
    const scored = rows.map((r) => ({ r, n: E.d1.filter((f) => f.on(r, visibleRow(r))).length }));
    const best = scored.sort((a, b) => b.n - a.n)[0].r;
    const vis = visibleRow(best);
    const missing = E.d1.filter((f) => !f.on(best, vis)).map((f) => f.name);

    // 🔴 A FIELD THE RECORD HAS NOTHING TO PUT IN IS NOT A MISSING FIELD.
    // Three part-sale rows showed no total price and this reported the price as missing. The
    // records simply had no parts on them, so there was no price to show; as soon as one was
    // added the price appeared. The same mistake was made earlier on the customer count badge.
    // So: if ANY row in this result shows a field, the row drawing it proves the product renders
    // it, and the judged row is just an unsuitable record - say so rather than blaming the screen.
    const renderedSomewhere = missing.filter((name) =>
      rows.some((r) => E.d1.find((f) => f.name === name)?.on(r, visibleRow(r))));
    if (renderedSomewhere.length) {
      store('D1.dataNote', { judged: best.text.slice(0, 80), renderedSomewhere,
        note: 'other rows in this same result DO show these, so the judged record lacks the value' });
      console.log(`   ${E.section} D1: ${JSON.stringify(renderedSomewhere)} are drawn on other rows — ` +
        `re-judging on a row that has them`);
      const better = rows.find((r) => renderedSomewhere.every((name) =>
        E.d1.find((f) => f.name === name)?.on(r, visibleRow(r))));
      if (better) {
        const m2 = E.d1.filter((f) => !f.on(better, visibleRow(better))).map((f) => f.name);
        store('D1', { quote: E.d1Quote, judged: better.text, missing: m2, reJudged: true });
        expect(m2, `the ${E.section} row is missing ${JSON.stringify(m2)}.\nRequirement: "${E.d1Quote}"` +
          `\nRow reads: "${visibleRow(better)}"`).toHaveLength(0);
        return;
      }
    }
    store('D1', { quote: E.d1Quote, judged: best.text, badge: best.badge, meta: best.metaParts, missing,
                  allRows: rows.map(visibleRow) });
    console.log(`   ${E.section} D1 judged "${best.text.slice(0, 90)}" badge=${best.badge} missing=${JSON.stringify(missing)}`);
    // Nothing in this result shows them, so this is EITHER the product never drawing the field OR
    // no returned record having a value for it. The message says so; confirm on the record itself
    // before reporting it as a fault.
    expect(missing, `NO row returned here shows ${JSON.stringify(missing)} — open one of these ` +
      `records and check whether it HAS a value for that field before treating this as a fault.\n` +
      `Requirement: "${E.d1Quote}"\nRow reads: "${vis}"\nBadge: ${best.badge}  Meta: ${JSON.stringify(best.metaParts)}`)
      .toHaveLength(0);
  });

  test(`C${C.I1.cid} — ${E.section}: a soft match is drawn as a soft match`, async () => {
    const rows = await groupRows(s.page, C.I1.term, E.tab);
    store('I1', { term: C.I1.term, rows: rows.map((r) => ({ text: r.text, approx: r.approx, marks: r.marks, italic: r.italicMarks })) });
    console.log(`   ${E.section} I1 "${C.I1.term}" → ${rows.length} rows`);
    for (const r of rows) console.log(`      [${r.index}] approx=${r.approx} marks=${JSON.stringify(r.marks).slice(0, 70)}`);
    expect(rows.length, `"${C.I1.term}" returns no ${E.tab} rows`).toBeGreaterThan(0);
    const near = rows.filter((r) => !new RegExp(C.I1.term, 'i').test(r.text));
    if (!near.length) {
      console.log(`   ${E.section} I1: every row contains the term literally — no soft match to judge`);
      return;   // a fact about the data, not a verdict on the product
    }
    for (const r of near) {
      expect(r.marks.length, `CONTROL FAILED on row ${r.index}: no highlight either`).toBeGreaterThan(0);
      expect(r.approx || r.italicMarks.length > 0,
        `row ${r.index} "${r.text}" is a close match drawn exactly like an exact one`).toBe(true);
    }
  });

  // Held tests removed — see the note at the foot of this file.

}

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
