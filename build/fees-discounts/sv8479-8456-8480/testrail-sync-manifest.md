# Fees & Discounts — SV-8479 / SV-8480 / SV-8456 — TestRail Sync Manifest

**STATUS: EXECUTED 2026-07-22 — user-authorized (SV-8479/8480 push + retire 3).**
See `testrail-execution-log-2026-07-22.md` for the per-case audit log.
Result: **5 add_section (4377–4381) + 18 add_case (C30618–C30635) + 3 delete_case (C28441/C28471/C28475) + 51 update_case** — ALL HTTP 200, ALL re-GET verified MATCH; run 325 untouched. The 3 retire-candidates in §C were user-ruled RETIRE and deleted. New tally: **199 active** (165 Verified / 12 Deviation / 21 Blocked-Env / 1 Pending).

> **Date:** 2026-07-22 · **Project:** Fees & Discounts V1 (ShopView) · **Epic:** SV-7387 · **PO:** Chris Ward.
> **Scope:** the staged TestRail writes for the SV-8479/SV-8480/SV-8456 live-staging-VIU pass (§0.0n).
> **NOTHING here has been written to TestRail.** TestRail is the ONLY production system (Standing Rule 6):
> no `add_case` / `update_case` / `delete_case` / run result has been executed. This manifest is the
> exact change set to run ONCE the user grants a fresh one-day TestRail authorization.
> **Sources:** `deconfliction-decision-table-2026-07-22.md` (decision table + one-line changes),
> `../testrail-id-map.csv` (C-ids), `viu-sv8479-8480-2026-07-22/` + `viu-sv8456-2026-07-22/` (live evidence).
> **`add_case` requirement (all 18):** each new case MUST be created with **`custom_atmstatus:3`** +
> **`custom_automation_type:0`** (project convention). API case → an "…API…"-titled section (Rule 4).
> **`refs` (Rule 20):** every case carries ticket + spec anchor `<TICKET(S)> (<spec-anchor>)`.

---

## A. `add_case` — 18 net-new cases

All 18 are currently **unmapped in `testrail-id-map.csv` (BLANK C-id)** and confirmed absent from TestRail.
On execution each returns a new C-id → **re-merge those C-ids back into `testrail-id-map.csv`** (keep the
186 already-populated rows; fill the 18 blanks).

| # | fd_id | Target section (leaf) | Type | Priority | refs (ticket + spec anchor) |
|---|---|---|---|---|---|
| 1 | FD-WO-017 | Work Order — Labor-line Fee/Discount | Functional | High | SV-8479 (SV-8288 Story 12 — item 1: labor entry-point placement, ⋮ LEFT of "Unassigned" + "Add Labor Fee / Discount") |
| 2 | FD-WO-018 | Work Order / Parts — Part-line Fee/Discount | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 2: WO part-row ⋮ menu label "Add Part Fee / Discount") |
| 3 | FD-WO-021 | Work Order — Sidebar 'Work Order Fee / Discount' card | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 6: WO card disclaimer copy) |
| 4 | FD-WO-025 | Work Order — Whole-WO Fee/Discount | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 10: WO toolbar ⋮ menu label "Add Work Order Fee / Discount") |
| 5 | FD-WO-028 | Work Order — Whole-WO Fee/Discount | Functional | Medium | SV-8479 (SV-8288 Story 12 — regression: jurisdiction note + "Pass convenience fee to customer" banner preserved) |
| 6 | FD-PSALE-002 | Parts page — 'FEES & DISCOUNTS' column | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 13: redundant "+ Add" removed) |
| 7 | FD-PSALE-003 | Parts page — 'FEES & DISCOUNTS' column | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 14: parts-sale per-part ⋮ menu label "Add Part Fee / Discount") |
| 8 | FD-PSALE-004 | Parts Sale — Fees & Discounts card | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 15: parts-sale card plain-text + bracket/sign) |
| 9 | FD-PSALE-006 | Parts Sale — Financial Info card | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 17: parts-sale Financial Info line above Subtotal) |
| 10 | FD-PSALE-008 | Part Sale — Fee/Discount dialog | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 19: whole-parts-sale modal title/subline; label VIU-confirm — Picture 26 missing) |
| 11 | FD-PSALE-009 | Parts Sale — Statistics tab | Functional | Medium | SV-8479 (SV-8288 Story 12 — item 20: parts-sale Statistics "%"/"Amount" headings) |
| 12 | FD-CALC-018 | Calculation contract | Functional | High | SV-8480 (S3-R18: line total = Labor + Parts + line fees) |
| 13 | FD-CALC-019 | Calculation contract | Functional | High | SV-8480 (S3-R18: fees add / discounts subtract on line total) |
| 14 | FD-CALC-020 | Calculation contract | Functional | Medium | SV-8480 (S3-R18: no-fee line = Labor + Parts only) |
| 15 | FD-CALC-021 | Calculation contract | Functional | Medium | SV-8480 (S3-R18: Estimate document unchanged, no double-count) |
| 16 | FD-CALC-022 | Calculation contract | Functional | Medium | SV-8480 (S3-R18: Invoice document unchanged, no double-count) |
| 17 | FD-CALC-023 | Calculation contract | Functional | Medium | SV-8480 (S3-R18: feature-off org → line total gross-only) |
| 18 | FD-CALC-024 | **API — Calculation contract** | Functional | High | SV-8480 (S3-R18: backend per-line total includes signed fee/discount amounts) |

**Per Rule 4, FD-CALC-024 (API content) MUST land in the "API — Calculation contract" section.**

---

## B. `update_case` — 54 edited existing cases

Source: `deconfliction-decision-table-2026-07-22.md` §"EXISTING CASES EDITED" (19 primary + 35 label-sweep).
All C-ids cross-checked against `testrail-id-map.csv` (0 mismatches). These are wording→corrected-UI
edits (build-accurate labels, sign convention, title/subline) + one S3-R18 strengthen — no `viu_status`
change is pushed to TestRail (statuses live in local deliverables only).

### B.1 Primary edits (19 = 18 SV-8479 + 1 SV-8480)

| fd_id | C-id | What changed |
|---|---|---|
| FD-INLINE-001 | C28454 | Labor inline: blank left label + plain text/no-badge + −X%/X% sign rule (absorbs dropped FD-WO-019 labor). |
| FD-INLINE-002 | C28455 | Part inline: plain text/no-badge + sign rule (absorbs dropped FD-WO-019 part). |
| FD-PART-002 | C28447 | Inline part-row render badge→plain text; nav label → "Add Part Fee / Discount"; calc unchanged. |
| FD-CALC-001 | C28568 | Rate render "badge"→plain text "+10%"; nav label → "Add Work Order Fee / Discount"; math unchanged. |
| FD-FIN-004 | C28467 | WO card entries badge→plain text + bracketed percent + sign rule (absorbs FD-WO-020). |
| FD-FIN-001 | C28464 | Financial Info F&D line pinned directly above Subtotal + order (absorbs FD-WO-022). |
| FD-LABOR-001 | C28439 | Labor dialog title "New Labor Fee / Discount" + subline "Applying To: Line N Labor — {name}" (absorbs FD-WO-023). |
| FD-LABOR-003 | C28441 | Entry point rescoped to ⋮ left of technician + "Add Labor Fee / Discount". **Retire-candidate — see §C.** |
| FD-LABOR-007 | C28445 | Label → "Add Labor Fee / Discount" + entry-point wording; permission behavior unchanged. |
| FD-PART-001 | C28446 | Menu label "Add Part Fee / Discount" + title "New Part Fee / Discount"/subline "Applying To: Line N Part — {name}" (absorbs FD-WO-024). |
| FD-WO-001 | C28424 | Menu "Add Work Order Fee / Discount" + title "New Work Order Fee / Discount"/subline "Applying To: Entire Work Order" (absorbs FD-WO-026). |
| FD-WO-013 | C28436 | Label → "Add Work Order Fee / Discount"; permission behavior unchanged. |
| FD-STATS-001 | C28459 | Added "%"/"Amount" column headings + blank-% for flat (absorbs FD-WO-027). |
| FD-PCOL-002 | C28470 | Column values + "+N" overflow badge→plain text + sign rule (absorbs FD-PSALE-005). |
| FD-PCOL-003 | C28471 | Rescoped off removed "+ Add" → per-row ⋮ "Add Part Fee / Discount" + "New Part Fee / Discount" title. **Retire-candidate — see §C.** |
| FD-PCOL-006 | C28474 | Empty-state no "+ Add" button; add via per-row ⋮. |
| FD-PCOL-007 | C28475 | Rescoped off removed "+ Add" → per-row ⋮ blocked-when-uneditable. **Retire-candidate — see §C.** |
| FD-PSALE-001 | C29918 | Nav label "Add Part Fee / Discount" + dialog titles named for context; jurisdiction-note assertion unchanged. |
| FD-INLINE-004 | C28457 | **SV-8480 (S3-R18):** strengthened to explicit formula + $322.20 worked example + no-fee-line sub-check; inline-display scoped. |

### B.2 Label-only sweep (35) — navigation labels swapped, behavior/expected unchanged

- **Whole-WO → "Add Work Order Fee / Discount" / "New Work Order Fee / Discount" (28):**
  FD-WO-002 C28425, FD-WO-003 C28426, FD-WO-004 C28427, FD-WO-005 C28428, FD-WO-006 C28429, FD-WO-007 C28430,
  FD-WO-008 C28431, FD-WO-009 C28432, FD-WO-010 C28433, FD-WO-011 C28434, FD-WO-012 C28435, FD-WO-014 C28437,
  FD-WO-015 C28438, FD-WO-016 C29441, FD-STACK-003 C28484, FD-PROC-005 C28523, FD-PERM-011 C28595,
  FD-CALC-002 C28569, FD-CALC-005 C28572, FD-CALC-006 C28573, FD-CALC-007 C28574, FD-CALC-008 C28575,
  FD-VAL-001 C28599, FD-VAL-002 C28600, FD-VAL-003 C28601, FD-VAL-004 C28602, FD-VAL-005 C28603, FD-VAL-006 C28604.
  *(FD-CALC-005 also had its "at any scope" step reworded to the WO entry label.)*
- **Labor-line → "Add Labor Fee / Discount" (2):** FD-LABOR-002 C28440, FD-LABOR-004 C28442.
- **Part-line → "Add Part Fee / Discount" (3):** FD-PART-003 C28448, FD-PART-004 C28449, FD-CALC-004 C28571.
- **Mixed per-step (2):** FD-CALC-003 C28570 (step 1 WO / step 2 Labor); FD-TMPL-010 C28511 (step 1 Labor / step 3 Part).

---

## C. RETIRE-CANDIDATES — needs SEPARATE explicit user ruling (NOT auto-deleted)

**Do NOT include these in the sync as automatic `delete_case`.** They are flagged for a distinct
retire-vs-keep decision; retirement requires an explicit user ruling + snapshot (per the FD-CUST-016
precedent, §0.0k). Until ruled, they are KEPT + edited (they appear in §B.1 as normal `update_case`).

| fd_id | C-id | Overlap rationale |
|---|---|---|
| FD-LABOR-003 | C28441 | After rescoping to the item-1 labor entry point, substantially overlaps the kept new **FD-WO-017** (same ⋮-left-of-Unassigned entry point + label). Both carry the item-1 Deviation. |
| FD-PCOL-003 | C28471 | Rescoped off the removed "+ Add" button → now overlaps the kept new **FD-PSALE-002/003** (per-row ⋮ add on the parts-sale column). |
| FD-PCOL-007 | C28475 | Rescoped off the removed "+ Add" button → now overlaps **FD-PSALE-002** (add blocked when non-editable is a sub-case of the removal-acceptance). |

---

## D. SV-8456 — NO `update_case`

SV-8456 cases were **re-VIU'd (evidence refreshed, `viu-sv8456-2026-07-22/`) but their wording was
unchanged** → **0 `update_case` required.** (The SV-8456 wording pass had already been pushed
2026-07-21, §0.0l; this pass only re-observed behavior live and refreshed evidence.) No re-VIU wording
fix was made, so nothing SV-8456 is added here.

---

## SUMMARY

**18 `add_case` + 54 `update_case` + 3 retire-candidates (pending separate ruling) + 0 SV-8456 edits.**

On execution: create the 18 (with `custom_atmstatus:3` + `custom_automation_type:0`), capture their new
C-ids, and re-merge into `testrail-id-map.csv`; push the 54 `update_case` and re-GET to confirm MATCH;
log per-case in a dated audit log; do NOT touch run 325. Retire-candidates await a separate user ruling.
