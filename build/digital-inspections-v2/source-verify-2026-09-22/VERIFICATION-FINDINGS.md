# DVI V2 — verification findings: what changed since the cases were written (2026-09-22)

The cases were built against **"specification version 18", read 2026-08-21**. The canonical spec
(Confluence **768507905**) is the SAME `S#-R#` document — now revised three times since:

## Change Log since v18 (from the live spec)
- **2026-09-10 (13 PRD-review decisions):** big content changes. Notably **counting is now per-AXLE
  everywhere** (S8-R25 was per-position; S5-R20 was per-axle; unified to per-axle, "a count is not a
  finding"). Plus S2-N5 money-masking, S2-R17 server-side enforcement, S2-R18 fixed-line-total, S2-E1
  deleted, S5-R21, S5-R12 cut-off, S15 panel changes, S12-R31 preview, S12-R15→tooltip.
- **2026-09-16 (9 technical-planning corrections):** "open/closed work order" → **"eligible build
  target"** = Estimate/Approved/In Progress/Review; ineligible = Complete/Invoiced/Paid/Declined/invoice
  exists (S2-R4/R5). **S8-R1 dropped the "measurement field no longer carries an axle option" claim.**
  S11-R3 file-size limit (10/20 MB decision), S3-E4 deleted, S2-E8→S2-N6, S2-R9 labour-type fallback,
  S5-R21 schema/backfill, S17-R9 accepts HEIC.
- **2026-09-18 (S19 added):** **conditional follow-up on a checkbox response is REINTRODUCED** (text +
  one file shown only on that response; acknowledgement required on Monitor/Not OK). Reverses the earlier
  "out of scope" decision. **S11 gains R10** ("general reference file" naming).

## Concrete conflicts with existing cases (must fix)
- **C44516** says *"Counting is per judged position"* → spec now counts **per axle**. Contradiction.
- **C44511** says *"the Measurement field no longer carries an axle option"* → that claim was dropped
  (S8-R1). Also names the type **"New axle set"** → spec/design use **"Per axle" / "New axle
  measurements"** ("axle set" banned). Must re-quote.
- **C44521** uses **"open/closed" WO** language → spec now uses **"eligible build target"** with the
  named status lists. Must align to the current wording.
- Likely more per-section wording drift (S2 money-mask, S15 edits, S12 preview) — to check per case.

## Coverage gaps in the current spec (no existing case)
- **S18 — Mark a whole scope OK in one press** (bulk OK, inspection/section/field). NEW. Uncovered.
- **S19 — Conditional follow-up on a checkbox response** (+ acknowledgement on Monitor/Not OK). NEW. Uncovered.
- Possibly new individual requirements added within existing sections (e.g. S2-R17/R18, S5-R21, S11-R10,
  S17-R9) — to check for coverage.

## Assessment
The 43 cases are **structurally aligned** to the current spec (same S-section scheme) and most are still
valid; a subset have genuinely drifted (above), and two whole sections (S18, S19) plus some new
requirements are uncovered. This is **correction + extension**, not a from-scratch rebuild — a wholesale
delete would discard ~40 still-good cases and their ids/run history for no gain. Recommendation put to the
QA lead: UPDATE the 43 to the current spec (Expected quoted verbatim, Rule 113; read-date re-stamped) and
ADD new cases for S18, S19 and any uncovered requirements — rather than delete-all-and-rebuild.
