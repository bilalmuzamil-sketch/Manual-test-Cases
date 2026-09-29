import { test, expect } from 'playwright/test';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { groupRows, lastPointerCheck } from '../fixtures/rowshape.js';
import * as fs from 'node:fs';

/**
 * THE 32 RE-TESTS — "the labelled note must show the FULL value, not just what you typed".
 *
 * These cases were HELD ("do not run") until 29 September, on the belief that a result row could
 * not say why it came back. It can: the row appends a labelled note — "VIN: …", "Technician: …",
 * "Contact match: …". They now carry a real assertion, and this file runs it.
 *
 * ── 🔴 THE TRAP THAT DECIDES WHETHER ANY OF THIS MEANS ANYTHING ────────────────────────────────
 * Typing a value IN FULL produces a note identical to the query whether the product is right or
 * wrong. "VIN: SVEWU82M5ETEJFWFA" for the query SVEWU82M5ETEJFWFA is correct output AND is exactly
 * what the fault would also produce. It is indistinguishable, so it can never fail — and about
 * half of these cases supply the whole value as their term.
 *
 * So each case is run TWICE where that applies:
 *   1. AS WRITTEN, with the term the case supplies — the faithful execution;
 *   2. with a PROPER FRAGMENT of the same value — the run that can actually answer the case's own
 *      Expected, which says in terms: "If you typed part of a longer value and the note shows only
 *      that part, this is a FAIL."
 * The Expected is never touched. Only the data is brought to the state the Expected describes.
 *
 * A case whose supplied term is already a fragment needs only run 1.
 */

type Retest = { cid: number; term: string | null; title: string; tab: string };
const CASES: Retest[] = JSON.parse(fs.readFileSync('../staging-run-2026-09-29/retest-plan.json', 'utf8'));

const VIEWPORT = { width: 1440, height: 900 };
let s: Session;
const m: Record<string, any> = { viewport: VIEWPORT, when: '2026-09-29' };

test.beforeAll(async () => {
  s = await signIn('/customers');
  await s.page.setViewportSize(VIEWPORT);
  m.build = await buildMarker(s.page);
  console.log('build under test:', m.build);
});
test.afterAll(async () => {
  fs.mkdirSync('results', { recursive: true });
  fs.writeFileSync('results/sri-retest.json', JSON.stringify(m, null, 1));
  await s?.browser.close();
});

/** The labelled note on a row: a meta part shaped "Label: value". */
const noteOf = (r: any): string | null =>
  r.metaParts.find((p: string) => /^[A-Za-z][A-Za-z /]{2,30}:\s/.test(p)) ?? null;
const valueOf = (note: string) => note.replace(/^[^:]+:\s*/, '').trim();

/** A fragment of a value that is unambiguously SHORTER than it, or null if none is sensible. */
function fragmentOf(term: string): string | null {
  const t = term.trim();
  if (t.length < 5) return null;                       // already short; a fragment proves nothing
  const digits = t.replace(/\D/g, '');
  // For a punctuated value take a run of digits that appears literally; else the leading characters.
  if (digits.length >= 6 && /[^\w]/.test(t)) {
    const run = t.match(/\d{3,}/g)?.sort((a, b) => b.length - a.length)[0];
    if (run && run.length >= 3 && run.length < t.length) return run;
  }
  const head = t.slice(0, Math.max(4, Math.ceil(t.length * 0.45)));
  return head.length < t.length ? head : null;
}

for (const c of CASES) {
  test(`C${c.cid} — ${c.title}`, async () => {
    const rec: any = { cid: c.cid, tab: c.tab, suppliedTerm: c.term };

    // ── the case supplies no usable term ────────────────────────────────────────────────────────
    if (!c.term || c.term === 'None') {
      rec.outcome = 'CANNOT RUN — the case supplies no search term';
      rec.detail = c.term === 'None'
        ? 'The case text literally instructs the tester to type the word "None": a null value was '
          + 'written into the case when it was generated.'
        : 'No "TYPE THIS INTO THE SEARCH BOX" line is present.';
      m[`C${c.cid}`] = rec;
      console.log(`C${c.cid}: ${rec.outcome} — ${rec.detail}`);
      return;                                          // recorded, not judged
    }

    // ── 1. as written ───────────────────────────────────────────────────────────────────────────
    const asWritten = await groupRows(s.page, c.term, c.tab);
    rec.pointer = lastPointerCheck;
    const notes = asWritten.map(noteOf);
    rec.asWritten = { rows: asWritten.length, notes, rowText: asWritten.map((r) => r.text.slice(0, 110)) };
    const withNote = notes.filter(Boolean) as string[];
    const onlyTyped = withNote.filter((n) => valueOf(n).toLowerCase() === c.term!.toLowerCase());

    // ── 2. the fragment run, where the supplied term is a whole value ───────────────────────────
    const frag = onlyTyped.length && fragmentOf(c.term) ? fragmentOf(c.term) : null;
    if (frag) {
      const fragRows = await groupRows(s.page, frag, c.tab);
      const fragNotes = fragRows.map(noteOf).filter(Boolean) as string[];
      const fragOnlyTyped = fragNotes.filter((n) => valueOf(n).toLowerCase() === frag.toLowerCase());
      rec.fragmentRun = { term: frag, rows: fragRows.length, notes: fragNotes,
                          onlyTyped: fragOnlyTyped.length };
      rec.note = `The supplied term is the WHOLE value, so run 1 cannot distinguish correct output `
               + `from the fault. Run 2 typed "${frag}", a proper fragment of it.`;
      console.log(`C${c.cid}: as-written "${c.term}" → ${withNote.length} notes; ` +
        `fragment "${frag}" → ${fragNotes.length} notes, ${fragOnlyTyped.length} showing only what was typed`);
      m[`C${c.cid}`] = rec;
      expect(fragNotes.length,
        `no labelled note came back for the fragment "${frag}", so the case cannot be judged`)
        .toBeGreaterThan(0);
      expect(fragOnlyTyped,
        `typing "${frag}" — a fragment of "${c.term}" — returns rows whose note reads only ` +
        `"${frag}" instead of the whole value: ${JSON.stringify(fragOnlyTyped)}`).toHaveLength(0);
      return;
    }

    console.log(`C${c.cid}: "${c.term}" → ${asWritten.length} rows, ${withNote.length} labelled notes, ` +
      `${onlyTyped.length} showing only what was typed`);
    m[`C${c.cid}`] = rec;
    expect(asWritten.length, `"${c.term}" returns no ${c.tab} rows at all`).toBeGreaterThan(0);
    expect(withNote.length,
      `no row carries a labelled note, so there is nothing to check the value against`).toBeGreaterThan(0);
    expect(onlyTyped,
      `these rows show only the characters typed instead of the whole value: ${JSON.stringify(onlyTyped)}`)
      .toHaveLength(0);
  });
}
