# Source-Verification Disposition — "Inline Add and Edit Parts on Work Order Lines" (epic SV-9315, suite 6597)

- **Type:** FULL re-verification (every spec-derived case re-read against the current spec, not a delta).
- **Run date:** 2026-09-09 · READ-ONLY (no TestRail writes, no case edits). This file is the only deliverable.
- **Cases examined:** 123 (`/tmp/inline6597_bodies.json`) = 118 spec-derived + 5 "Manually added (QA lead)".

---

## A. Spec currency

- **Page:** Confluence 782761986 "Inline Add and Edit Parts on Work Order Lines", space ~Sasha Grosman.
- **Author / owner:** Sasha Grosman.
- **Body "Last Updated":** 2026-09-04. **Page lastModified (metadata):** Sep 07, 2026.
- **Newest change-log entries (both 2026-09-04, Branko Cicovic):**
  1. "Story 7 added — bin allocation on the inline row" (S7-R1–R18, S7-N1–N2, S7-E1–E2; Jira SV-9724).
  2. "Modal cancel no longer discards" (reversed the 2026-08-24 decision; S4-R12 + Story 6 resolved question).
- **Moved since the v16 baseline (2026-09-07)?** **No content movement.** Body "Last Updated" is still 2026-09-04
  and the newest change-log entry is still 2026-09-04 — identical to what the 2026-09-07 baseline pass verified
  (that pass already handled the two 2026-09-04 edits: S4-R12 modal-cancel reversal, Story 7 = SV-9724, plus
  S2-R5/S4-R4/S7-R12/S4-R21). The Sep-07 lastModified is the baseline-era touch; no change-log row exists after
  2026-09-04, so nothing substantive changed.
- **Version integer:** the Confluence version integer is NOT returned by the available MCP call (known limitation,
  `build/BLOCKED-confluence-version-integers.md`). Currency is therefore established from Last-Updated + change-log,
  which are unchanged since the v16 baseline. **Treat the spec as still v16.**

**⇒ Stamp for every spec-derived case: `specification version 16` (unchanged).**

---

## B. Per-requirement verdicts (Rule 43)

**Overall: 114 UNCHANGED, 4 UPDATE (of the 118 spec-derived). 5 manually-added still sensible except C45250 (see §D).**

### UPDATE (4)

**U1 — C44993 (S1-N1, Add Part button hidden) — Expected omits two spec statuses.**
- Field: Expected (and tester note).
- What's wrong: Expected names only "Complete, Invoiced, or Paid". Current spec S1-N1 names five:
- VERBATIM S1-N1: *"If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the 'Add Part'
  button is not displayed on any work order line."*
- The case's tester note actively contradicts the doc ("'Declined' is a real status and the button is shown on it,
  while 'Imported' is not a status this product has") — i.e. it follows the build, violating Rule 57.
- Proposed new Expected (keeps the doc per Rule 57; handle the build gap via three-outcomes, not by narrowing):
  1. The "Add Part" button is not displayed on any work order line when the work order status is Complete,
     Invoiced, Paid, Declined, or Imported (per S1-N1).
  - Note for the tester: on this build the button is currently shown on Declined, and "Imported" is not a status
    the product exposes. (1) If the button is hidden on Complete/Invoiced/Paid and shown on Declined ⇒ mark FAILED
    on the Declined check and report the deviation. (2) Different behaviour ⇒ new problem, report it.
    (3) Button hidden on Declined too ⇒ matches spec, PASS.
- ESCALATE: is the PO's intent that the button is hidden on Declined (spec) or shown (build)? Is "Imported" a real
  status? This is a spec-vs-build / possible spec-error question, not a silent case narrowing.

**U2 — C44994 (S1-N2, Edit control hidden) — same defect as U1.**
- VERBATIM S1-N2: *"If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the Edit control is
  not displayed on part lines."*
- Same fix and same escalation as U1, applied to the Edit control.

**U3 — C45007 (S2-R11, Tech View category) — Expected drops the "only when no category" condition.**
- Field: Expected.
- What's wrong: Expected says flatly "The part is assigned the category 'Uncategorized'." The current spec makes
  this conditional and adds the keeps-its-own-category half.
- VERBATIM S2-R11: *"A part added through the Tech View inline row is assigned the category 'Uncategorized' only
  when the selected part has no category. An inventory or catalog part keeps its own category. The category is not
  displayed to the Tech View user."*
- Proposed new Expected:
  1. A part with no category of its own is assigned the category "Uncategorized".
  2. A part that already carries a category (inventory or catalog part) keeps its own category — it is never
     replaced with "Uncategorized".
  3. In either case the category is not displayed to the Tech View user.

**U4 — C45034 (S3-E1, concurrent edit) — tests a requirement the spec has removed as out of scope.**
- Field: whole case (Expected + scope).
- What's wrong: Expected asserts the edit save fails with "This part was changed by someone else. Refresh to see
  the latest." The current spec has struck S3-E1 and marked it out of scope.
- VERBATIM S3-E1: *"~~If another user modifies or deletes the same part while the inline edit row is open, the save
  fails and the user sees an alert: 'This part was changed by someone else. Refresh to see the latest.'~~ Removed —
  confirmed out of scope; no concurrent-edit detection exists platform-wide."*
- The case's own tester note already says the behaviour could not be reproduced and "nothing is known ... either way."
- Proposed disposition: retire / reframe — there is no concurrent-edit detection; the case should not assert this
  behaviour occurs. (Case authored by us; retirement is a QA-lead call, so this is reported, not edited.)
- ESCALATE the spec-internal inconsistency: §8 "User Feedback Summary" still carries a row
  *"Part changed by another user at save time | 'This part was changed by someone else. Refresh to see the latest.'"*
  which the struck S3-E1 contradicts. §8 should have that row removed to match S3-E1.

### UNCHANGED (114) — grouped, with confirming spec anchor

- **Story 1 (SV-9316):** C44988 (S1-R1/E1), C44989 (S1-R2/R3), C44990 (S1-R4/R5), C44991 (S1-R6/R7),
  C44992 (S1-R8), C44995 (S1-N3), C44997 (S1-E2). All Expected match the cited requirement verbatim in intent.
  (C44993/C44994 = UPDATE above.)
- **Story 2 (SV-9317):** C44998, C44999, C45000, C45001, C45002, C45003, C45004, C45005, C45006, C45008, C45009,
  C45010, C45011, C45012, C45013, C45014, C45015, C45016, C45017, C45018, C45019, C45020, C45021, C45022 — all
  match S2-R1..R19 / S2-N1..N6 / S2-E1..E3 / S2-EH1. (C45007 = UPDATE.)
  - C45001 (S2-R5) confirmed against the 2026-09-04 SV-9766 wording (inventory desc read-only; post-save
    desc/cost/core charge/vendor read-only). ✔
  - C45000 (S2-R4/R19) confirmed against the 2026-09-04 amendment (cards carry inventory qty + bins; pick triggers
    bin allocation; focus to qty). ✔
  - C45022 (S2-EH1) uses "Couldn't add the part. Please try again." — this MATCHES the canonical §8 table, which
    the spec says to implement from ("copy only ... implemented from this table"); it differs from the stale
    S2-EH1 prose ("Refresh the page and try again"). Case is correct. ✔
- **Story 3 (SV-9318):** C45023, C45024, C45025, C45026, C45027, C45028, C45029, C45030, C45031, C45032, C45033,
  C45035 — match S3-R1..R9 / S3-N1..N3 / S3-E2. (C45034 = UPDATE.)
- **Story 4 (SV-9319):** C45036, C45037, C45038, C45039, C45040, C45041, C45042, C45043, C45044, C45045, C45046,
  C45047, C45048, C45049, C45050, C45051, C45052, C45053, C45054, C45055, C45056, C45057, C45058, C45059, C45060,
  C45061, C45062, C53477 — match S4-R1..R21 / S4-N1..N6 / S4-E1..E3 / S4-EH1.
  - C45047 (S4-R12) confirmed against the 2026-09-04 reversal (cancel discards nothing, returns to inline row). ✔
  - C45039 (S4-R4) confirmed against Found-part read-only fields. ✔
  - C53477 (S4-R21, "no See Financial Data ⇒ three-field row") confirmed. NOTE: the spec has TWO requirements both
    numbered S4-R21 (the other = "Changing the category recalculates Sell Price ... (SV-9673)"). C53477 maps to the
    permission one; the pricing-matrix one is covered by manually-added C45252/C45253. The duplicate numbering is a
    spec defect to report (not a case defect).
  - C45060 (S4-E1) carries an EXPECT-FAIL/three-outcomes note (build shows 0.00 not empty) — correct pattern. ✔
- **Story 5 (SV-9320):** C45063, C45064, C45065, C45066, C45067, C45068 — match S5-R1..R3 / S5-N1..N2 / S5-E1. ✔
- **Story 6 (SV-9321):** C45069, C45070, C45071, C45072, C45073, C45074, C45075, C45076, C45077, C45078, C45079,
  C45080, C45081, C45082, C45083 — match S6-R1..R6 / S6-N1..N5 / S6-E1..E3, including the add/edit confirmation
  wording and default-focus. ✔
- **Story 7 (SV-9724):** C45221–C45240, C45242, C45243, C45232 — match S7-R1..R18 / S7-N1..N2 / S7-E1..E2
  verbatim (bin allocation, "Pulled from" chip, picker, the two bin messages, split-across-bins routing, edit-row
  parity). ✔ These are the newest cases and align cleanly to the 2026-09-04 Story-7 addition.

---

## C. Manually-added cases (5) — sensibility check (keep "Manually added (QA lead)" source; no version stamp)

- **C45251** — Completed-line field editability (inventory vs SPO). Sensible product-knowledge; not contradicted by
  the spec. KEEP.
- **C45252** — Add Part calculates Sell Price from cost via the pricing matrix (atm=3, currently FAILS via
  three-outcomes note). Sensible; now also formalised in spec as S4-R21 (first instance, SV-9673). KEEP.
- **C45253** — Changing category recalculates Sell Price via the matrix (atm=3, currently FAILS). Sensible; matches
  spec S4-R21 (first instance, SV-9673). KEEP.
- **C45254** — Cannot enter a custom Cost for an inventory part. Sensible; consistent with S2-R5 / S4-R4. KEEP.
- **C45250** — ⚠️ **NO LONGER MAKES SENSE against the current spec.** It expects the "+ Add Part" button to
  DISAPPEAR on a Completed line. Current spec S1-R9 says the opposite:
  - VERBATIM S1-R9: *"Add Part is available on a line whose status is Complete or In Review. The system uncompletes
    the line on the user's behalf rather than requiring the user to uncomplete it first."*
  - This is a direct conflict (line-status Complete). ESCALATE to the QA lead: either the build hides the button on
    a Complete line (then S1-R9 is unbuilt and this should be an EXPECT-FAIL/three-outcomes case) or the case is
    stale. Not edited here (manually-added, QA-lead owned).

---

## D. Coverage gaps and spec-internal inconsistencies (report-only)

1. **S1-R9 — NO spec-derived case** (Add Part available on a Complete/In Review LINE, system auto-uncompletes).
   The only case touching this area is manually-added C45250, which asserts the opposite. Coverage gap + conflict.
2. **S1-N4 — no dedicated case** ("viewing a work order they cannot edit for any other reason ⇒ button/Edit hidden").
   Low priority; arguably covered by S1-N3's intent. Flag only.
3. **Duplicate requirement number S4-R21** — two different requirements share the number (pricing-matrix recalc /
   no-See-Financial-Data three-field row). Spec defect; report to the author.
4. **§8 vs S3-E1** — §8 table still lists the "Part changed by another user" message that S3-E1 removed as out of
   scope. Spec-internal inconsistency (see U4).
5. **S2-EH1 prose vs §8 table** — S2-EH1 says "Refresh the page and try again"; §8 (canonical, "implement from this
   table") says "Please try again." Cases correctly follow §8; §8 wins. Report for spec tidy-up only.
6. **Provenance-style inconsistency** — 5 spec-derived cases (C45001, C45039, C45047, C45232, C53477) use a
   date-style provenance ("...read on 7 September 2026") with no version integer, while the other 113 cite
   "specification version 16". For consistency (Rule 54) these 5 should also carry "specification version 16".
