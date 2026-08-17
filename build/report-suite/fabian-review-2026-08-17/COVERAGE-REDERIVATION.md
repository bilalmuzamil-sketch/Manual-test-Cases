# COVERAGE RE-DERIVATION — Report Suite — Fabian design-review (2026-08-17)

Re-derived from the six **live** specs (SBC v20 / SBR v22 / PV v10 / TU v9 / WIP v21 / IV v10) and epic
SV-8582 (114 children), both directions. The nine Fabian/Chris Loom-review decisions are the change set;
each gets its own verdict. Build verification is **deferred by instruction** — every touched case carries
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` (Standing Rule 69).

**Legend:** ✅ DONE this pass · 🟡 STAGED (specified, not executed) · 🔵 already covered · ⛔ blocked.

---

## 1. Adjustments column — WIP, SBC, SBR  ✅ DONE

The single biggest new-coverage gap: a whole new money column, being built now (SV-9280/9281/9282 all
**TESTING QA**). Previously **uncovered** (a grep of 480 active cases found "adjustment" in one PV case
only, and SBR-ROW-02/C30218 still enumerated 12 columns where the spec now has 13). **18 new cases
authored + byte-verified this pass** (CASES-CREATED.md).

**Surface matrix (Rule 40):**

| Requirement | On-screen | Column selector | CSV export | Snapshot / history | Totals row | Summary strip |
|---|---|---|---|---|---|---|
| **WIP** (SV-9282, spec v21) | ✅ C43814 (order S4-R1/R2), C43815 (calc S4-R29), C43816 (S4-R30), C43817 (Total S4-R21), C43821 (completed S4a-R2) | 🔵 covered by existing WIP col-selector cases (Adjustments now in set) | 🟡 WIP CSV Adjustments column — STAGED | ✅ C43820 (S11-R8/R9 no backfill) | ✅ C43819 (S6-R2) | ✅ C43818 (S5-R1/R13 — **no** tile) |
| **SBC** (SV-9280, spec v20) | ✅ C43822 (order S7-R6), C43823 (calc S7-R17), C43824 (tie-out S7-R18), C43827 (per-invoice S8-R12) | ✅ C43825 (S13-R4, ten cols) | ✅ C43826 (S14-R4/R5 both CSVs) | n/a | 🔵 tie-out covers totals row (C43824 asserts it) | n/a |
| **SBR** (SV-9281, spec v22) | ✅ C43828 (order S5-R2), C43829 (calc S5-R11), C43830 (tie-out S5-R12) | ✅ C43831 (S20-R2, eight cols) | 🟡 SBR CSV S14-R15/R16 Adjustments — STAGED | n/a | 🔵 C43830 asserts Totals row | n/a |

**Both-texts check (Rule 45e), sample:** spec WIP S4-R21 *"Total is Earned plus Remaining plus
Adjustments … NOT the work order's stored grand total"* ↔ C43817 expected *"Total equals Earned plus
Remaining plus Adjustments … NOT the work order's stored grand total … expected, not a data error."*

**STAGED remainder:** WIP CSV/PDF Adjustments column cases; SBR CSV S14-R15/R16 Adjustments column cases;
**update SBR-ROW-02 (C30218)** 12→13 columns and **SBR-CALC-06 (C30234)** to name Adjustments. Also
**S5a-R4 vs the Loom note "WIP and SBC only"** — the spec includes SBR (pre-existing); recorded as a
consistency note, resolved in favour of the spec (SBR Adjustments IS in scope).

## 2. Labor Delta rename ("Inv. Hrs" → "Labor Delta", SV-9071)  🟡 STAGED

**40 active cases still show the tester the old column label "Inv. Hrs"** (SBC 10, SBR 21, WIP 9 in
tester text). Current specs rename it everywhere: SBC **S12-R1**, SBR **§3/Terminology**, WIP **S4-R1**
(display label only; calculation/format/coloring unchanged). This is a build-accuracy defect (Rule 9) —
a tester would look for a column that no longer has that name.

**Not executed this pass — deliberately, and here is why:** two cases are NOT clean swaps and would be
corrupted by a blanket replace, so the batch needs per-case care:
- **SBC-CALC-03 (C30151)** and **SBR-CALC-01 (C30229)** assert the heading reads *"Inv. Hrs" (including
  the period after "Inv")* — that whole assertion, and the parenthetical, is now obsolete and must be
  reworded to "Labor Delta".
- **SBR-CALC-01 (C30229)** additionally carries an **EXPECT-FAIL symptom block (SV-8999)** whose text
  says *"item 1 passes — the heading really does read 'Inv. Hrs' with the period"* — the rename makes
  that self-contradictory; it needs hand-rework, not a swap.

**Transform spec for the safe ~38 cases (ready to execute):** replace "Inv. Hrs" → "Labor Delta" in
title/preconditions/steps and the expected **body** (never inside a `refs` string); refresh the Rule-54
provenance to the current spec version + read-date 17 Aug 2026 + Rule-69 marker; whole-case re-verify
each (Rule 41). Full list in `LABOR-DELTA-RENAME-STAGED.md` (to be generated on execution authorisation
/ budget). Owner: this worker on resume, or a dedicated update pass.

## 3. Single "as of" date — WIP + IV  🟡 STAGED (WIP) / 🔵 (IV)

- **IV** — already uses "as of" (10 IV-DATE cases, e.g. C30561–C30566). 🔵 covered; spot-verify against
  IV Story 5 on resume.
- **WIP** — the spec **dropped the date range entirely** for a single "as of" date (S7-R6/R7/R8, new
  S7-R8a; Chris 2026-08-13). **~19 WIP cases still say "date range"** (WIP-PERS-03/C30508, WIP-EXP-02,
  WIP-SCOPE-*, WIP filters). 🟡 STAGED: rework "date range" → single "as of" date; owning story SV-9214
  (In Progress). Divergence from the *previous* WIP spec must be disclosed (Rule 56).

## 4. CSV carries the filter-summary metadata lines, verbatim — all six reports (SV-9283)  🟡 STAGED

Suite-wide rule (2026-08-12): the CSV carries the same filter-summary lines as the PDF header, verbatim
and in the same order, above the column-header row. Anchors: IV **S10-R15a**, PV **S6-R11a**, SBC/SBR/TU/WIP
equivalents. **Current coverage is thin** — each report has ~1 export case touching "Locations:" but none
asserts the full SV-9283 requirement (every PDF-header filter line appears as a leading CSV metadata line).
🟡 STAGED: one focused case per report (6), or extend the existing CSV-content export case per report.
Story SV-9283 is **Code Review**.

## 5. Asset column hides "(no unit #)" — VIN alone when no unit number  🟡 STAGED / 🔵 partial

- **SBC** — the VIN → Unit # → plate fallback is covered (SBC-LBL-01/C30134, SBC-LBL-02, SBC-LBL-03,
  spec S8-R7/R8). The **specific "hide (no unit #)" display suppression** (Loom) is not asserted. 🟡
  STAGED: extend SBC-LBL-01 or add SBC-LBL-05.
- **WIP** — WIP-COL-05 (C30470) covers the asset "no unit" behaviour. 🔵 spot-verify the exact "(no
  unit #)"-suppression wording against WIP spec on resume.

## 6. "Labor Delta" grouped totals shown as a math strip  🟡 STAGED (spec-silent → Loom-sourced)

0 coverage; specs do not use the phrase "math strip". Loom-sourced (2026-08-17). 🟡 STAGED — needs the
design artifact (unfetchable this pass) to pin the exact layout/labels before authoring; VIU-confirm.
Owner: QA lead (design export). Risk of authoring without the design: inventing labels (Rule 12).

## 7. Amber glow on the active tab when clicked  🟡 STAGED (spec-silent → Loom-sourced)

0 coverage; spec silent. Loom-sourced. 🟡 STAGED — a Visual Conformance case per report shell (SV-8593).
The exact colour/animation needs the design (unfetchable this pass) → VIU-confirm; do not invent the
colour value.

## 8. Column header labels wrap to two rows (instead of truncating)  🟡 STAGED / 🔵 partial

Spec mentions wrapping in SBR/TU; the exact "wrap to two rows instead of truncate" is Loom-sourced.
🟡 STAGED — a Visual Conformance case per report (or extend the header-layout case). VIU-confirm the
two-row behaviour on the design/build.

## 9. Locked Estimates value tooltip (verbatim)  ✅ DONE (WIP) + spec-contradiction raised

**WIP-SUM-07 (C30493) updated** this pass to the design-review-locked verbatim wording (WIP **S5a-R2**):
*"The total value of all estimate lines that have not yet been approved, including lines awaiting
authorization on open work orders."* The other six info-icon explanations were re-verified against the
live spec S5-R12 and match byte-for-byte (Rule 41).

**🔴 REAL FINDING — spec-internal contradiction raised for Chris Ward:** WIP spec **S5-R12 still lists the
older short Estimates explanation** *"Quotes the customer has not approved yet — not counted in the
totals."* while **S5a-R2 locks the long verbatim** above. The case follows S5a-R2 (design review + Loom,
latest wins, Rule 32) and discloses the divergence in tester-facing text (Rule 56). **This contradiction
is a PO question for Chris** — see OUTSTANDING.

---

## Counts (reconciled live, 2026-08-17)
- Live group 4281: **ours 498 / foreign 12 / live 510** (foreign = Vladimir Tomovic C38919–38923, C43567–43573; **0 touched**).
- Four counts set-equal both ways: **live 498 = local active 498 = id-map 498 (0 blanks) = import 498**.
- Import header sha256 == all peers; shredding guard PASSED (0 rows).

## OUTSTANDING — what I need from you
1. **Spec contradiction (Chris Ward):** WIP S5-R12 vs S5a-R2 both define the Estimates info-icon tooltip, differently. We followed S5a-R2 (Fabian's locked wording). *Please have Chris drop the S5-R12 short wording so the spec states it once.* Blocks: nothing (case is correct); it is a spec-hygiene fix. Since: 2026-08-17.
2. **Design artifact** (Fabian's Claude design) — unfetchable/undated. Blocks authoring items 6, 7, 8 (math strip, amber glow, two-row wrap) without inventing labels/colours. Owner: QA lead — a dated export or screenshots.
3. **Run-359 sync** — 18 new cases are NOT yet in run 359 (`include_all` false). A union-only sync needs **explicit per-ask authorisation** (Rule 34; not granted this session — STAGE only).
4. **Staged authoring/updates** (items 1-Labor-Delta-rename, WIP as-of, CSV metadata ×6, VIN suppression, math strip, amber glow, two-row wrap) — need budget/authorisation to execute; all specified above.
5. **Tech plan** — not provided (Rule 30).
