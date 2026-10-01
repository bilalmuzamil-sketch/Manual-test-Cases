# Gap-fill — new 4-point case format + deferred-release folders (2026-10-01)

Follows the QA lead's four-point instruction (2026-10-01):

1. **Bottom author note.** Every gap case now ends, after a line break, with **"Note from the author
   (what the spec says about this)"** — what the specification author says about the item.
2. **Top testing-method banner.** Every gap case now starts with **"▶ How to test this"** — either
   *Can be automated* (with why) or *Manual testing preferred* (with the WHY spelled out).
3. **Separate, clearly-labelled folders** (unchanged from the first pass; see below).
4. **Deferred-release items authored** in their own folders whose **name states the author's release
   words**, with the author's release statement at the **top** of each case (then a line break, then
   preconditions).

## Part 1 — the 27 existing gap cases, reformatted (C195849–C195875)
`build/gap-fill/apply_format.py` added the top testing-method banner and the bottom author note to all
27 cases already authored on 2026-10-01 (MR 17 + DI 10). Idempotent (re-run safe; verified exactly one
banner + one note per case).

**Testing method assigned (why):**
- **Manual-preferred** (visual judgement a script can't make):
  - MR C195862 (expanded maintenance panel — badge colours orange-not-red, hover contents, layout).
  - DI C195853 / C195854 (converted Word / Excel renders readably in place).
  - DI C195855 (wide spreadsheet readable without clipping — the layout decision the spec flags).
  - DI C195856 (converted photo/image renders correctly as an image).
  - DI C195857 (download opens as the original type; byte-identity needs automation/a checksum).
- **Automatable:** the remaining 21 (deterministic UI steps + on-screen values).

**Author note carried:**
- MR (all 17): the Chunk-2 draft caveat — requirements copied as they stand, not yet reviewed for
  handoff, will be reworked before developers pick them up (Confluence 897679389).
- DI SV-8347 (4): deletion gated on inspection status + WO Lines permission, independent of line status.
- DI SV-9882 (6): viewer can't show HEIC/TIFF/Word/Excel today; story adds server-side conversion on
  upload; download still returns the original; narrowing accepted types was rejected.

## Part 2 — deferred / not-in-this-release items, newly authored (C195876–C195892)
Two new folders, each named with the author's own release words; each case carries that release
statement at the top (release status → testing-method → preconditions → steps → expected → author note).

### Folder A — section 25609 — Fixed Rules, list rules with no category (4 cases, C195876–C195879)
**Folder/author release words: "Not in this release."** (story SV-10403, Parts Alphabetical Sort
Story 4; PRD 578781186). Full requirements + 3 acceptance criteria in the story, so these are real,
runnable cases (all automatable).
- C195876 — category-less rule listed with an empty Category cell (R1/R2/AC1).
- C195877 — empty Category sorts last, ascending and descending (R3/AC2).
- C195878 — "Fixed rules (N)" count includes category-less rules (R4/AC3).
- C195879 — search finds a category-less rule by Part number and Fixed price (R5).

### Folder B — section 25610 — Automatic customer reminder email, S19 (13 cases, C195880–C195892)
**Folder/author release words: "Ship the rest of the feature without it." (Phase P5)** (story
SV-10575 / S19; Confluence 897679389 "Chunk 2 MR"). The customer email is explicitly deferred — the
MR V1 PRD says *"The customer reminder email ships with Chunk 2"* and *"nothing is emailed
automatically"* in this release. Author note carries the four operational questions that gate delivery
+ the placeholder caveat.
- Automatable (logic/backend an automation harness drives): C195880 consolidation per customer+recipient;
  C195881 window boundary; C195882 change-detection (never the same list twice); C195883 enrolment
  suppression; C195884 low-confidence vs No-data calendar; C195885 notifications-off; C195886 no
  preferred contact.
- Manual-preferred: C195887 08:00-local / working-days timing (timed backend job — harness, not hand);
  C195888 send logging; C195889 sender name + Reply-To (read delivered email); C195890 footer / no
  unsubscribe; C195891 location name + phone + call-to-action; C195892 fixed wording for any mix of states.

Every case `AUTOMATION: HOLD` (deferred stories, no build). Rule-117 shape (concise title ≤80,
discrete-list preconds with example values, build-glossary steps, runnable Expected + verbatim quotes).

## Provenance flags (carry to the QA lead)
- MR S19 and the MR gap cases quote the **Chunk 2 placeholder page** — re-check all these quotes when
  Chunk 2 is reworked into the handoff format (Rules 31/32/59).
- S19 is Phase P5 with **four open operational questions** (sender identity, mass-send feasibility,
  what queues the day's sends, global send time) — several S19 cases cannot be build-verified until
  those are answered and the feature is built.

## Part 3 — follow-up round (QA lead answers, 2026-10-01 afternoon)

**(1) Author note is now TRULY LAST.** On the QA lead's instruction the author note was moved to the
very bottom of every gap case, with the `AUTOMATION:` marker immediately above it. All 44 cases
(C195849–C195892) reordered. Standing rule amended: CLAUDE.md §5 and full Rule 61 now allow the
trailing author-note block; the render-repair validator (`hs_repair_one.mjs`) updated to treat the
marker as "last" when only the author note follows it. The marker stays the single machine literal the
arithmetic counter greps for (counter is position-independent, so unaffected).

**(3) QuickBooks per-fee mapping (SV-10398) added to scope.** 4 cases authored (C195893–C195896) in a
new separate folder **section 25611** — "Founder Mode / QuickBooks per-fee income mapping (SV-10398)".
Manual-QA runnable: the mapping step is in Settings > QuickBooks; the "what posted" check opens the
connected QuickBooks test company and reads the invoice. Testing method: case 1 automatable (UI
mapping), cases 2–4 manual-preferred (cross-system QBO verification). Provenance flag: SV-10398 is a
client feature request (Double J Trailers) with no PRD/acceptance criteria yet — derived from the
request, re-check when a spec exists.

**(4) Deferred folders** confirmed kept as-is (separate, release-worded names, release statement at the
top of each case).

**(2) Digital Inspections two non-hand points** — left on the stated default (check what a tester can
see; mark the exact-copy and upload-timing parts for automation/engineering), pending any different
word from the QA lead.

**Totals after this round:** 27 reformatted + 17 deferred + 4 QuickBooks = **48 gap cases**
(C195849–C195896), all note-last, all render-repaired, all committed.
