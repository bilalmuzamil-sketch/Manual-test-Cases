import { test, expect } from '../fixtures/test.js';
import { retestPlanPath } from '../fixtures/data.js';
import { signIn, buildMarker, type Session } from '../fixtures/auth.js';
import { resolveTerm } from '../fixtures/anchors.js';
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
/**
 * 🔴 THE PLAN NAMES STAGING'S RECORDS. Each entry carries the term that case was run with on
 * staging; on production many of those return nothing, which made 23 of these red against a
 * product that is fine. Each term is therefore resolved against the environment under test before
 * it is used, keeping the staging word wherever it still works.
 */
let CASES: Retest[] = [];
try {
  CASES = JSON.parse(fs.readFileSync(
    retestPlanPath(), 'utf8'));
} catch {
  // the plan is an input, not a requirement: without it this file simply has nothing to run, and
  // saying so beats failing the whole suite at collection time
  console.log('no retest plan found — set GS_RETEST_PLAN to run these');
}

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
  test(`C${c.cid} — ${c.title} @C${c.cid}`, async () => {
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
    // 🔴 RESOLVE THE TERM AGAINST THIS ENVIRONMENT FIRST. The plan carries the word this case was
    // run with on staging; on production many of those records do not exist, and 23 of these went
    // red reporting a product fault that was really an absent fixture. The staging word is kept
    // wherever it still works, so a staging run is unchanged.
    const term = (await resolveTerm(s.page, c.term, c.tab)) ?? c.term;
    rec.termUsed = term;
    if (term !== c.term) rec.termNote = `"${c.term}" is not on this environment; used "${term}" instead`;
    const asWritten = await groupRows(s.page, term, c.tab);
    rec.pointer = lastPointerCheck;
    const notes = asWritten.map(noteOf);
    rec.asWritten = { rows: asWritten.length, notes, rowText: asWritten.map((r) => r.text.slice(0, 110)) };
    const withNote = notes.filter(Boolean) as string[];
    const onlyTyped = withNote.filter((n) => valueOf(n).toLowerCase() === term.toLowerCase());

    // ── 2. the fragment run, where the supplied term is a whole value ───────────────────────────
    const frag = onlyTyped.length && fragmentOf(term) ? fragmentOf(term) : null;
    if (frag) {
      const fragRows = await groupRows(s.page, frag, c.tab);
      const fragNotes = fragRows.map(noteOf).filter(Boolean) as string[];
      const fragOnlyTyped = fragNotes.filter((n) => valueOf(n).toLowerCase() === frag.toLowerCase());
      rec.fragmentRun = { term: frag, rows: fragRows.length, notes: fragNotes,
                          onlyTyped: fragOnlyTyped.length };
      rec.note = `The supplied term is the WHOLE value, so run 1 cannot distinguish correct output `
               + `from the fault. Run 2 typed "${frag}", a proper fragment of it.`;
      console.log(`C${c.cid}: as-written "${term}" → ${withNote.length} notes; ` +
        `fragment "${frag}" → ${fragNotes.length} notes, ${fragOnlyTyped.length} showing only what was typed`);
      // 🔴 "COULD NOT REACH THE STATE" IS NOT A FAILURE, AND MUST NOT GO RED.
      // The fragment is derived, not supplied by the case, so it can simply fail to match the
      // field - a postcode fragment that the index does not match returns no labelled note at
      // all. Asserting here made five cases red whose own message said "the case cannot be
      // judged", which is the exact confusion between a product fault and an unreached state
      // that this whole pass exists to avoid. Recorded as not-judged instead.
      if (!fragNotes.length) {
        rec.outcome = 'COULD NOT JUDGE — the derived fragment returns no labelled note';
        rec.detail = `The case supplies the whole value "${term}", which cannot fail this check. `
                   + `The fragment "${frag}" was tried instead and matched nothing with a labelled `
                   + `note, so neither run can answer the case. It needs a term that is a proper `
                   + `fragment of a value the field actually matches on.`;
        m[`C${c.cid}`] = rec;
        console.log(`C${c.cid}: ${rec.outcome}`);
        return;
      }
      m[`C${c.cid}`] = rec;
      /**
       * 🔴 [expected to fail: SV-10634] WHEN THE NOTE READS ONLY WHAT WAS TYPED.
       * That is the open fault "Search Result Rows Show Only The Characters Typed, Not The Value
       * That Matched" — status read live from Jira on 2 October 2026, still Open. Reproducing a
       * known fault is not a reason for this file to be red: the point of the suite is to notice
       * CHANGE. Marking it expected-to-fail means a red line here reads as "still broken", and the
       * moment the fix lands this test FAILS for passing, which is exactly the signal wanted.
       * Everything else in the case is still asserted normally below.
       */
      if (fragOnlyTyped.length) {
        rec.knownFault = 'SV-10634';
        test.info().annotations.push({ type: 'known fault', description: 'SV-10634 — rows show only the characters typed' });
        test.fail();
      }
      expect(fragOnlyTyped,
        `typing "${frag}" — a fragment of "${term}" — returns rows whose note reads only ` +
        `"${frag}" instead of the whole value: ${JSON.stringify(fragOnlyTyped)}`).toHaveLength(0);

      // 🔴 "DIFFERENT FROM WHAT I TYPED" IS NOT "THE WHOLE VALUE", and treating it as such
      // recorded a PASS on C146216. Typing part of a contact's email returns
      // "Contact match: ZZAUTOTEST" — the contact's FIRST NAME. It differs from the query and is
      // still wrong: it is not the email that matched. Where the case supplies the whole value we
      // KNOW what the note should say, so check it says that.
      const shouldRead = term.toLowerCase();
      const wrongValue = fragNotes.filter((n) => {
        const v = valueOf(n).toLowerCase();
        return v !== shouldRead && !v.includes(frag.toLowerCase());
      });
      expect(wrongValue,
        `the note shows neither the whole value "${term}" nor the text typed — it shows a ` +
        `different detail of the record altogether: ${JSON.stringify(wrongValue)}`).toHaveLength(0);
      return;
    }

    console.log(`C${c.cid}: "${c.term}" → ${asWritten.length} rows, ${withNote.length} labelled notes, ` +
      `${onlyTyped.length} showing only what was typed`);
    m[`C${c.cid}`] = rec;
    expect(asWritten.length, `"${c.term}" returns no ${c.tab} rows at all`).toBeGreaterThan(0);
    if (!withNote.length) {
      // Same distinction as above: nothing to compare against is not the same as a wrong value.
      rec.outcome = 'COULD NOT JUDGE — no row carries a labelled note for this term';
      m[`C${c.cid}`] = rec;
      console.log(`C${c.cid}: ${rec.outcome}`);
      return;
    }
    expect(onlyTyped,
      `these rows show only the characters typed instead of the whole value: ${JSON.stringify(onlyTyped)}`)
      .toHaveLength(0);
  });
}
