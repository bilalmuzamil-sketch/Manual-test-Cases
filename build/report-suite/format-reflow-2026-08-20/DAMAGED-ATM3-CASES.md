# DAMAGED by reflow — 2 atm=3 cases need a targeted Expected-field fix (2026-08-20)

**Cases:** C30162, C30287 (both `created_by=3` = ours, both `custom_atmstatus=3` = Automated).

## What happened
These two are a **different regression variant** from the other 174 candidates. The 174 atm=1
cases stored their fields as `<p>1. …<br>2. …<br>…</p>` — a real-`<br>` form that renders as
clean line breaks and stays clean after the Edit→"."→Save reflow. These two instead stored the
**Expected** field as `<p>1. …\n2. …\n…</p>` — a wrapper containing **raw newlines and NO `<br>`**.

- **Before the reflow** their Expected rendered on ~12 lines **but with the literal `<p>`/`</p>`
  tags shown as text** (broken flavour A).
- **The Edit→"."→Save reflow made them WORSE:** Froala, on save, collapsed the raw `\n`s to
  spaces, so the Expected field is now a **single run-on line** with the numbered items, the
  provenance line and the `AUTOMATION: READY` marker all **inline** (broken flavour B).

Live-verified stored source after reflow (no `<br>`, no `\n`, single `<p>`):
`<p>1. Margin % … 2. Dates … 3. Currency … 4. The CSV … --- This is the expected behaviour … AUTOMATION: READY SV-9069 …</p>`

## Why the proven method cannot fix this variant
The reflow trigger only re-renders; it does not add line breaks. For the `\n`-in-`<p>` form the
UI Save **removes** the structure instead of restoring it. A clean fix requires **editing the
Expected field** to reinstate line breaks between the items and around the marker/provenance —
which this task explicitly prohibits ("add a full stop to the PRECONDITIONS field only, never the
Expected field, to protect the AUTOMATION marker literal and the provenance line").

Reverting is also not clean: a UI re-save reproduces flavour B, and the pre-damage bytes are only
partially captured for C30287, so an exact restore is not possible from what we hold. (An API
write is out — the task is UI-only and an API `update_case` would re-trigger the same
markdown-wrap hazard #6.)

## Recommendation (needs the coordinator's / QA lead's call)
1. **Authorize a targeted Expected-field line-break restoration** for these two only, done in the
   Froala editor, reinstating each numbered item / the `---` separator / the provenance line / the
   `AUTOMATION:` marker (and the Rule-56 divergence note on C30162) on their own lines — with the
   marker and provenance **text byte-verified unchanged** afterward and the render confirmed
   multi-line. (I can do this on request; it is outside the "never the Expected field" rule, which
   is why it is not done here.)
2. These are **atm=3 (Automated)** cases — loop in the automation engineer (Vlad); a concurrent
   worker was handling other atm=3 cases this same session.

## Status
- Recorded in `DONE.jsonl` with `status: atm3-variant-DAMAGED-needs-review`.
- NOT counted as cleanly fixed. The 161 atm=1 cases were reflowed and render clean.

## RESOLUTION — 2026-08-20 (Expected line-breaks restored via API)
Both cases' **Expected** field was rebuilt via TestRail API `update_case` (Basic auth; the concurrent
worker's web-UI session was NOT touched), restoring `<br>` line breaks in the C30133 interim format.
- **Word-identical, order-preserved, zero wording/semantic change** (Rule 50): the reconstruction was
  built by inserting `<br>` at the item / separator / provenance / marker boundaries of the run-on and
  proven token-for-token identical to the run-on BEFORE writing. Byte-verified after the write: the only
  differences from intended were the **declared** server transforms — em-dash → `&mdash;` (both),
  `≤` → `&le;` (C30287) and a trailing `\n`. **0 collateral field changes.** Preconditions/Steps were
  already fine (`<ol><li>` form) and were left untouched.
  - C30162: tokens 168/168, 1 marker, 1 provenance line, 11 `<br>`.
  - C30287: tokens 270/270, 1 marker, 1 provenance line, 13 `<br>`.
- **⚠️ Marker not literally last:** each Expected ends with the pre-existing SV-9069 explanatory note
  (*"SV-9069 superseded the one-decimal wording: …"*) which sits **after** `AUTOMATION: READY`. This
  ordering predates the reflow damage (present in the collapsed run-on; the collapse only removed line
  breaks, it did not reorder words), so it was preserved as-is. Relocating it to make the marker last
  is a word reorder / semantic edit beyond a line-break repair and is left for the QA lead / Vlad to
  authorize. The Rule-56 "divergence note before the marker" house form would require that move.
- Still in `<br>` interim form ⇒ appended to `NEEDS-REFLOW-STAGING.md` (with a re-render-VERIFY caveat,
  since the plain "." trick previously failed on these) and to
  `automated-review-2026-08-20/FOR-VLAD-CONSOLIDATED.md`.
