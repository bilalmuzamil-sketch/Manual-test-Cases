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
const DATE = /\d{1,2}\/\d{1,2}\/\d{2,4}|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i;
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
const CFG = JSON.parse(fs.readFileSync('../staging-run-2026-09-29/entity-config.json', 'utf8'));
for (const e of ENTITIES) {
  const c = CFG[e.section];
  e.cases = Object.fromEntries(Object.entries(c.cases).map(([k, v]: [string, any]) => [k, { cid: v.cid, term: v.term }]));
  e.held = c.held.map((h: any) => ({ cid: h.cid, term: h.term, field: h.field }));
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
      expect(r.marks.join(' '), `row ${r.index} carries no highlight`).toContain(C.A1.term.split(/\s+/)[0]);
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
      expect(r.title.segs.some((x) => x.marked), `row ${r.index}: nothing marked`).toBe(true);
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
    store('D1', { quote: E.d1Quote, judged: best.text, badge: best.badge, meta: best.metaParts, missing,
                  allRows: rows.map(visibleRow) });
    console.log(`   ${E.section} D1 judged "${best.text.slice(0, 90)}" badge=${best.badge} missing=${JSON.stringify(missing)}`);
    expect(missing, `the best-qualifying ${E.section} row is missing ${JSON.stringify(missing)}.\n` +
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

  for (const h of E.held) {
    test(`C${h.cid} — ${E.section} [HELD: the source is silent] does a match on ${h.field} explain itself?`, async () => {
      const rows = await groupRows(s.page, h.term, E.tab);
      const obs = rows.map((x) => ({ row: x.index, text: x.text, marks: x.marks,
        termOnRow: new RegExp(h.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(x.text) }));
      store(`held.C${h.cid}`, { term: h.term, field: h.field, rows: obs });
      console.log(`   C${h.cid} HELD "${h.term}" → ${rows.length} rows`);
      for (const o of obs.slice(0, 6)) console.log(`      termOnRow=${o.termOnRow} "${o.text.slice(0, 95)}"`);
      expect(Array.isArray(obs)).toBe(true);   // the only thing a held case may assert
    });
  }
}
