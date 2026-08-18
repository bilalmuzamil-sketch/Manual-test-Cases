# Report Suite — COVERAGE-CURRENCY (Rule 43/45 re-derivation, 2026-08-17)

Per report, the specification each report's cases were pinned to (the "from" version) was fetched live
from Confluence and diffed anchor-by-anchor against the CURRENT live version. This established which
requirement anchors carry a **substantive** change (a change a case must reflect) versus a
**cosmetic/boundary** change (reword, reflow, or an artefact of an inserted neighbouring anchor), and
which cases were **content-stale** versus **version-pin-only stale**.

Method: `/tmp/rsspec/*` (raw storage XML per version), `specdiff.py` (anchor set + text diff),
`specdump.py` (old/new text per changed anchor). Content-stale cases confirmed by a live census of the
tester-facing text (not by anchor alone) — the ground truth of what a tester would see wrong.

## Per-report substantive deltas (old → current)

### SBC v17 → v20  (3 new anchors, 14 text-changed)
**Substantive:** the "Inv. Hrs" → **Labor Delta** column rename; the invoice-level **Adjustments**
money-model column folded into the toggleable-column list (nine → **ten** toggleable columns); the
**CSV filter-summary metadata** line (S14-R13a new, S15-R10). All of these were applied by the prior
Fabian pass, which swept the whole suite (0 "Inv. Hrs" left, 0 enumeration missing Adjustments).
**Residual content-stale found here:** 2 count cases still saying "nine" columns — **SBC-COL-02**
(steps + expected) and **SBC-PERS-05** (expected) → bumped to "ten".
**Cosmetic/boundary:** S7-R16 (trailing fragment dropped), S11-N1/S13-N1 label reflow.

### SBR v18 → v22  (3 new, 26 text-changed)
**Substantive:** Labor Delta rename + Adjustments column (seven → **eight** metric columns) + CSV
metadata (S14-R20a). Applied by Fabian. **Residual:** **SBR-PERS-04** still said "seven metric
columns" → "eight". **SBR-COL-01** was flagged but is **already current** (already at v22, already
says "eight") — left untouched. Many "changed" anchors (S1-R2, S1-R7, S10-R5, S14-R3, S16-R4, S21-R7,
S23-R4, S5-R9, S8-R3) are **boundary false-positives** — the anchor's own text is byte-identical.

### Parts Velocity v6 → v10  (4 new, 19 text-changed)  ← NOT covered by the Loom pass
**Substantive, and NOT one of the Fabian Loom items:**
- **Unit Cost → Avg Cost** and **Sell Price → Avg Sell** — a column rename in the column list, the
  column descriptions and the calculation names (S4-R4, S5-R4a, S5-R7, S6-R7). **13 cases** used the
  old labels → renamed.
- **CSV vs PDF null handling** (S3-R9, S6-R7): a null now renders as an em-dash in the **PDF** but as
  an **empty cell** in the **CSV** (was em-dash in both). **PV-EXP-07** rewritten.
- CSV/PDF alignment clarified (S3-R8, S6-R10) — no case asserted the old CSV alignment, so no edit.
- New CSV filter-summary metadata (S6-R11a) — Fabian added the PV metadata case already.

### Technician Utilization v7 → v9  (2 new, 6 text-changed)  ← NOT covered by the Loom pass
**Substantive:** the **Total Hours drill-down link is now scope-gated** (SV-9064, S6-R1/S6-R5/S6-R6):
it is a link **only** when the location scope is exactly the user's active shop (the default view);
under any other scope the value is plain text. **3 cases rewritten** — TU-LINK-01 (link only under
default scope), TU-LINK-05 (the old "reconciliation exception (b)" can no longer occur, because there
is no link outside the active-shop scope), TU-LINK-06 (day-row link under the same gate). The other 5
flagged TU cases (LINK-02/03/04, NAV-06, VIS-02) do not assert the always-a-link behaviour →
version-pin only.

### WIP v11 → v21  (20 new, 37 text-changed)
**Substantive:** Labor Delta rename (Fabian, suite sweep); the **Adjustments** column + **Total =
Earned + Remaining + Adjustments** (S4-R21) + Estimates includes adjustments (S5-R8); the
**date-range → single "as of" date** control (S7-R6/R7/R8, Fabian did the two core cases C30501/C30502);
VIN-alone asset display (Fabian, C30470). **Residual content-stale found here:** **WIP-CALC-06** still
said "Total equals Earned plus Remaining" and "excludes … fees, discounts" → rewritten to include
Adjustments (S4-R21). The other 4 flagged WIP cases (CALC-12, SUM-04, API-03, API-06) do not assert
the Total formula → version-pin only. WIP-FLT-04/05 already current (Fabian). WIP-SCOPE-03 carries raw
markup → **skipped** (see report).

### Inventory Value v5 → v10  (2 new, 18 text-changed)  ← NOT covered by the Loom pass
**Substantive — the largest single delta:** the whole report moved from a **date-range control (nine
presets + Custom range)** to a **single "as of" date control** (one calendar day, defaults to today,
capped at today) — S1-R3/R4/R5, S5-R1, S5-R4/R5/R6/R7, S6-R9, S8-R5, S12-R3. The resolved-day
indicator moved **into the date control itself** (no separate "As of" indicator — S5-R5/R6). Export
over-cap message changed "Narrow the date range or filters" → "Narrow the filters" (S10-R12).
Retention wording changed "longest date preset (366 days)" → "13 months of selectable 'as of' days"
(S11-R6). **16 cases rewritten** (6 substantive as-of rewrites: NAV-03, DATE-01/03/04/05/06; 10 lighter
"date range" → "as of date" / message / retention swaps). 2 IV cases carry raw markup → **skipped**
(IV-EXP-02 C30588, IV-API-02 C30606).

## Both-directions check (Rule 45)
- **requirement → case:** every substantive changed/new anchor above was checked for a covering case;
  each has one (or is a Fabian-added new case). No substantive anchor was left with no case.
- **case → requirement:** no case cites an anchor that was **removed** (0 removed anchors across all 6
  reports), so there are **no orphaned/stale-anchor cases** from these version moves.

## Honest residual-risk note
The SBC/SBR **Adjustments money model** (S3-R6a, SBR S5-R11/R12) was reconciled at the level of column
**enumerations** and **counts** (this pass) plus the SBR tie-out (Fabian's C30234 fix). A deeper
per-formula audit of SBC/SBR calc cases (whether any Subtotal/Margin formula case needs Adjustments
folded in) was scoped to those checks; no calc case was found asserting a stale formula, but this is
the one area where a subtle money-model implication could remain and is flagged for the build-verify
sync.
