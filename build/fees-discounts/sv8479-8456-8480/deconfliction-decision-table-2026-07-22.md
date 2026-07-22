# Fees & Discounts — SV-8479 / SV-8480 Authoring ↔ Reconciliation Deconfliction Decision Table

> **Date:** 2026-07-22 · **Project:** Fees & Discounts V1 (ShopView) · **Epic:** SV-7387 · **PO:** Chris Ward.
> **Task:** consolidate the SV-8479/SV-8480 new-case authoring with the reconciliation change-list —
> deconflict new-vs-existing and apply every existing-case edit. **Scope of this pass:** case JSON edits
> (`cases/*.json`) + this decision table ONLY. **NO TestRail writes · NO id-map edit · NO import regen ·
> NO commit.** No `viu_status` changed (all new = VIU-Pending; existing keep their status → re-observed at VIU).
> **Inputs:** `reconciliation-changelist-2026-07-22.md`, `requirements-SV-8479.md`, `requirements-SV-8480.md`,
> `cases/*.json`, `testrail-id-map.csv`.
> **Pre-decided rulings applied verbatim (not re-litigated):** F1 (item-1 keep FD-WO-017, Deviation at VIU),
> F2 (FD-PCOL-003/007 EDIT-rescope + mark retire-candidate), F3 (FD-PCOL maps to Parts Sale; edit for 13/14/16,
> keep new only for gaps), F4 (7 customer-tab buttons OUT of scope — no change), F5 (item-19 keep FD-PSALE-008,
> Picture 26 missing → VIU-confirm), F6 (discount sign "(−5%)" per ticket sign rule).

---

## DECONFLICTION PRINCIPLE (how each new case was judged)

A new SV-8479 case is **DROP-dup** when an existing case has the **same surface AND same behavior** once corrected —
i.e. the existing case's *primary subject* is the very visual element/display the new case verifies (inline
render, card render, financial-info line position, dialog title/subline, column display, stats headings).
It is **KEEP-NEW** when the only existing coverage is a **functional** case (dialog-open/save, calc, permission,
preview) that references the label merely in navigation, **or** when it is a pure **menu-label acceptance** with no
existing subject, **or** a **gap** with no existing coverage. Emergent pattern (fully consistent across the suite):
**menu-label acceptance → KEEP new; dialog title/subline → DROP into the existing dialog case** — the only
exceptions are item 1 (placement move, F1 keep) and item 19 (gap + Picture-26 + F5 keep).

---

## DECISION TABLE — 20 new SV-8479 cases (items 1–20 + regression)

| Item | New case id | Decision | Existing case(s) edited (id → C-id) | Reason |
|---|---|---|---|---|
| 1 | **FD-WO-017** | **KEEP-NEW** | FD-LABOR-001→C28439, FD-LABOR-003→C28441, FD-LABOR-007→C28445 | F1: entry-point placement (⋮ LEFT of technician/"Unassigned") + label; will be a **Deviation at VIU** (build renders RIGHT). Existing labor cases rescoped to the new entry point; FD-LABOR-003 now overlaps FD-WO-017 → **retire-candidate flagged**. |
| 2 | **FD-WO-018** | **KEEP-NEW** | FD-PART-001→C28446 | Pure **menu-label** acceptance ("Add Part Fee / Discount"). FD-PART-001 is a functional dialog-open case — distinct subject; its title/subline covers item 9 (below), menu label is only navigation there. |
| 3+4 | ~~FD-WO-019~~ | **DROP-dup** | FD-INLINE-001→C28454, FD-INLINE-002→C28455 (+ FD-PART-002→C28447, FD-CALC-001→C28568 wording) | Same surface + same behavior: inline line-level render. FD-INLINE-001 (labor) reworded to blank left label + plain text/no-badge + sign rule (items 3&4); FD-INLINE-002 (part) reworded plain-text (item 4). Together they fully cover FD-WO-019. FD-PART-002/FD-CALC-001 are calc cases — badge→plain-text wording only. |
| 5 | ~~FD-WO-020~~ | **DROP-dup** | FD-FIN-004→C28467 | Same surface + behavior: WO Fees & Discounts **card** render. FD-FIN-004 reworded to plain text + bracketed percent + sign rule (item 5). Item-6 disclaimer intentionally left to FD-WO-021 (kept) to avoid double coverage. |
| 6 | **FD-WO-021** | **KEEP-NEW** | *(none)* | Gap — no existing case asserts the WO card disclaimer copy ("Applies to the whole work order, after all other fees & discounts."). |
| 7 | ~~FD-WO-022~~ | **DROP-dup** | FD-FIN-001→C28464 | Same surface + behavior: Financial Info F&D **line position**. FD-FIN-001 reworded to pin the line directly above Subtotal + order (item 7). Hidden-when-zero already lives in FD-FIN-003 (no change). |
| 8 | ~~FD-WO-023~~ | **DROP-dup** | FD-LABOR-001→C28439 | Same surface + behavior: labor **dialog title/subline**. FD-LABOR-001 already asserts the dialog title/subtitle → reworded to "New Labor Fee / Discount" + "Applying To: Line N Labor — {name}". |
| 9 | ~~FD-WO-024~~ | **DROP-dup** | FD-PART-001→C28446 | Same surface + behavior: WO part **dialog title/subline**. FD-PART-001 reworded to "New Part Fee / Discount" + "Applying To: Line N Part — {name}". |
| 10 | **FD-WO-025** | **KEEP-NEW** | FD-WO-001→C28424, FD-WO-013→C28436 | Pure **toolbar menu-label** acceptance ("Add Work Order Fee / Discount") + order. FD-WO-001 is a functional dialog-open case (covers item 11 below); menu label is only navigation there. |
| 11 | ~~FD-WO-026~~ | **DROP-dup** | FD-WO-001→C28424 | Same surface + behavior: whole-WO **dialog title/subline**. FD-WO-001 reworded to "New Work Order Fee / Discount" + new subline "Applying To: Entire Work Order" (reverses old "no Applying-to line"). |
| 12 | ~~FD-WO-027~~ | **DROP-dup** | FD-STATS-001→C28459 | Same surface: WO Stats F&D section. FD-STATS-001 reworded to add the "%"/"Amount" column headings + blank-% for flat (item 12). |
| 13 | **FD-PSALE-002** | **KEEP-NEW** | FD-PCOL-003→C28471, FD-PCOL-006→C28474, FD-PCOL-007→C28475 | Removal-acceptance ("+ Add" gone; entry points remain). No existing case asserts the *removal* as its subject — the FD-PCOL cases test functional add/remove/blocked flows (rescoped off "+ Add"). FD-PCOL-003/007 = **retire-candidates (F2)**. |
| 14 | **FD-PSALE-003** | **KEEP-NEW** | FD-PSALE-001→C29918 (+ FD-PCOL-003→C28471) | Pure per-part **menu-label** acceptance. FD-PSALE-001 (jurisdiction-note functional case) only references the label in navigation — distinct subject. |
| 15 | **FD-PSALE-004** | **KEEP-NEW** | *(none)* | Gap — FD-FIN-* are WO-only; no parts-sale **card** case exists. |
| 16 | ~~FD-PSALE-005~~ | **DROP-dup** | FD-PCOL-002→C28470 | Same surface + behavior: parts-sale F&D **column** render. FD-PCOL-002 reworded to plain text + "+N" overflow kept + sign rule (item 16). FD-PCOL-001 already plain text (no change). |
| 17 | **FD-PSALE-006** | **KEEP-NEW** | *(none)* | Gap — FD-FIN-* are WO-only; no parts-sale **Financial Info** case exists. |
| 18 | ~~FD-PSALE-007~~ | **DROP-dup** | FD-PSALE-001→C29918 (+ FD-PCOL-003→C28471) | Same surface + behavior: parts-sale per-part **dialog title/subline**. FD-PSALE-001 already asserts the per-part subtitle → reworded to name the title "New Part Fee / Discount" (subline unchanged). Parity with items 8/9/11. |
| 19 | **FD-PSALE-008** | **KEEP-NEW** | FD-PSALE-001→C29918 (light, nav/title-naming only) | F5: dedicated **whole-parts-sale modal** case; **Picture 26 missing** → whole-sale entry label "Add Parts Sale Fee / Discount" is prose-only, marked **VIU-confirm**. No existing case owns the whole-sale title/subline as its subject; FD-PSALE-001 only names it for context. |
| 20 | **FD-PSALE-009** | **KEEP-NEW** | *(none)* | Gap — FD-STATS-* are WO-only; no parts-sale **Statistics** case exists. |
| reg | **FD-WO-028** | **KEEP-NEW** | *(none)* | Regression: jurisdiction tax note + "Pass convenience fee to customer" banner survive the SV-8479 UI changes across all four dialogs. The **convenience-fee banner** has no other dedicated coverage. *(Mild overlap on the jurisdiction note with FD-WO-016/FD-TMPL-018/FD-PSALE-001 — see "flagged for morning".)* |

**SV-8479 new-case tally:** **11 KEEP-NEW · 9 DROP-dup** (= 20).

## DECISION — 7 new SV-8480 calc cases (all KEEP)

Per the change-list, **no existing calc case asserts the buggy "Labor + Parts only" line total**
(FD-CALC-001..017 test individual fee math / order-of-operations; FD-STACK-001/002, FD-FIN-001/002 checked clean).
So all **7 are KEEP-NEW**; the only existing SV-8480 edit is **FD-INLINE-004** (strengthened, below).

| New case id | viu | Scope (kept — distinct from FD-INLINE-004 inline-display) |
|---|---|---|
| FD-CALC-018 | VIU-Pending | Line total = Labor + Parts + line fees (worked example $322.20). |
| FD-CALC-019 | VIU-Pending | Fees add / discounts subtract on the line total. |
| FD-CALC-020 | VIU-Pending | No-fee line = Labor + Parts only (unchanged). |
| FD-CALC-021 | VIU-Pending | Estimate document unchanged (labor gross, fees own rows, grand total no double-count). |
| FD-CALC-022 | VIU-Pending | Invoice document unchanged (same, no double-count). |
| FD-CALC-023 | VIU-Pending | Feature-flag OFF → line total gross-only. |
| FD-CALC-024 | VIU-Pending | **API** — backend per-line total includes signed fee/discount amounts (S3-R18). |

---

## EXISTING CASES EDITED (54 total = 19 primary + 35 label-only sweep)

### A. Primary edits (18 SV-8479 + 1 SV-8480 = 19) — behavior/wording rewritten

| id → C-id | One-line change |
|---|---|
| FD-INLINE-001 → C28454 | Labor inline: blank left label + plain text/no-badge + −X%/X% sign rule (items 3&4); absorbs FD-WO-019 (labor). |
| FD-INLINE-002 → C28455 | Part inline: plain text/no-badge + sign rule (item 4); absorbs FD-WO-019 (part). |
| FD-PART-002 → C28447 | Inline part-row render badge→plain text (item 4); per-item flat calc unchanged; nav label → "Add Part Fee / Discount". |
| FD-CALC-001 → C28568 | Rate render "badge"→plain text "+10%" (item 4); calc math unchanged; nav label → "Add Work Order Fee / Discount". |
| FD-FIN-004 → C28467 | WO card entries badge→plain text w/ bracketed percent + sign rule (item 5); absorbs FD-WO-020; item-6 disclaimer left to FD-WO-021. |
| FD-FIN-001 → C28464 | Financial Info F&D line pinned directly above Subtotal + order (item 7); absorbs FD-WO-022. |
| FD-LABOR-001 → C28439 | Labor dialog title "New Labor Fee / Discount" + subline "Applying To: Line N Labor — {name}" (items 1&8); absorbs FD-WO-023. |
| FD-LABOR-003 → C28441 | Entry point rescoped to ⋮ left of technician + "Add Labor Fee / Discount" (item 1). **Retire-candidate** (overlaps FD-WO-017). |
| FD-LABOR-007 → C28445 | Label → "Add Labor Fee / Discount" + entry-point wording (item 1); permission behavior unchanged. |
| FD-PART-001 → C28446 | Menu label "Add Part Fee / Discount" (item 2) + title "New Part Fee / Discount"/subline "Applying To: Line N Part — {name}" (item 9); absorbs FD-WO-024. |
| FD-WO-001 → C28424 | Menu "Add Work Order Fee / Discount" (item 10) + title "New Work Order Fee / Discount"/subline "Applying To: Entire Work Order" (item 11); absorbs FD-WO-026. |
| FD-WO-013 → C28436 | Label → "Add Work Order Fee / Discount" (item 10); permission behavior unchanged. |
| FD-STATS-001 → C28459 | Added "%"/"Amount" column headings + blank-% for flat (item 12); absorbs FD-WO-027. |
| FD-PCOL-002 → C28470 | Column values + "+N" overflow badge→plain text + sign rule (item 16); absorbs FD-PSALE-005. |
| FD-PCOL-003 → C28471 | Rescoped off removed "+ Add" → per-row ⋮ "Add Part Fee / Discount" + "New Part Fee / Discount" title (items 13/14/18). **Retire-candidate (F2)**. |
| FD-PCOL-006 → C28474 | Empty-state no "+ Add" button; add via per-row ⋮ (item 13). |
| FD-PCOL-007 → C28475 | Rescoped off removed "+ Add" → per-row ⋮ blocked-when-uneditable (item 13). **Retire-candidate (F2)**. |
| FD-PSALE-001 → C29918 | Nav label "Add Part Fee / Discount" (item 14) + dialog titles named for context (items 18/19); jurisdiction-note assertion unchanged; whole-sale detail owned by FD-PSALE-008. |
| FD-INLINE-004 → C28457 | **SV-8480 (S3-R18):** strengthened to explicit formula + $322.20 worked example + no-fee-line sub-check; kept inline-display scoped (calc/document/flag-off ACs owned by new FD-CALC-018..024). |

### B. Label-only sweep (35) — navigation labels swapped, behavior/expected unchanged, driver appended to story_ref/notes

- **Whole-WO → "Add Work Order Fee / Discount" / "New Work Order Fee / Discount" (28):**
  FD-WO-002 C28425, FD-WO-003 C28426, FD-WO-004 C28427, FD-WO-005 C28428, FD-WO-006 C28429, FD-WO-007 C28430,
  FD-WO-008 C28431, FD-WO-009 C28432, FD-WO-010 C28433, FD-WO-011 C28434, FD-WO-012 C28435, FD-WO-014 C28437,
  FD-WO-015 C28438, FD-WO-016 C29441, FD-STACK-003 C28484, FD-PROC-005 C28523, FD-PERM-011 C28595,
  FD-CALC-002 C28569, FD-CALC-005 C28572, FD-CALC-006 C28573, FD-CALC-007 C28574, FD-CALC-008 C28575,
  FD-VAL-001 C28599, FD-VAL-002 C28600, FD-VAL-003 C28601, FD-VAL-004 C28602, FD-VAL-005 C28603, FD-VAL-006 C28604.
  *(FD-CALC-005 also had its "at any scope" step reworded to the WO entry label — validation is scope-independent.)*
- **Labor-line → "Add Labor Fee / Discount" (2):** FD-LABOR-002 C28440, FD-LABOR-004 C28442.
- **Part-line → "Add Part Fee / Discount" (3):** FD-PART-003 C28448, FD-PART-004 C28449, FD-CALC-004 C28571.
- **Mixed per-step (2):** FD-CALC-003 C28570 (step 1 WO, step 2 Labor); FD-TMPL-010 C28511 (step 1 Labor, step 3 Part).

> **Rule-9 refinement note:** the change-list grouped FD-CALC-003 and FD-CALC-004 under "whole-WO," but their steps
> are labor/part. To stay build-accurate, per-step surface-correct labels were applied (CALC-003 mixed; CALC-004 → Part).

### SV-8456 — 0 edits (verification only: 0 stragglers, whole suite already Settings→Service-consistent).

---

## FINAL NET-NEW CASE LIST (need `add_case` in TestRail later — 18)

**SV-8479 kept (11):** FD-WO-017, FD-WO-018, FD-WO-021, FD-WO-025, FD-WO-028,
FD-PSALE-002, FD-PSALE-003, FD-PSALE-004, FD-PSALE-006, FD-PSALE-008, FD-PSALE-009.
**SV-8480 kept (7):** FD-CALC-018, FD-CALC-019, FD-CALC-020, FD-CALC-021, FD-CALC-022, FD-CALC-023, FD-CALC-024.

*(All 18 are VIU-Pending, unmapped in `testrail-id-map.csv` — confirmed absent. Per Rule 4, FD-CALC-024 is an
API case → must land in an "…API…" section on import.)*

---

## SUMMARY COUNTS

| Metric | Count |
|---|---|
| New SV-8479 cases in | 20 |
| — kept | **11** |
| — dropped as duplicate | **9** |
| New SV-8480 cases in / kept | 7 / **7** |
| **Net-new total (add_case later)** | **18** |
| Existing cases edited | **54** (19 primary + 35 label-sweep) |
| — SV-8479 primary | 18 |
| — SV-8480 primary (FD-INLINE-004) | 1 |
| — label-only sweep | 35 |
| SV-8456 edits | 0 |
| Cases dropped from `group-A-wo-parts.json` | 9 (83 → 74) |
| `viu_status` changes | 0 |
| Retire-candidates flagged (need user ruling) | 3 — FD-LABOR-003 C28441, FD-PCOL-003 C28471, FD-PCOL-007 C28475 |

**Source file counts after edits:** group-A 74 · group-B 84 · group-C 47 = **205** (was 214; −9 dropped).
JSON validated: all three files load clean, **0 duplicate ids**, **0 dangling test dependencies** (the only
references to dropped ids are intentional audit lines in edited cases' `notes`).

---

## FLAGGED FOR THE MORNING (genuine judgment calls)

1. **FD-LABOR-003 (C28441) retire-candidate.** After rescoping to the item-1 entry point it substantially
   overlaps the kept new **FD-WO-017**. Kept + edited per the change-list (F1 keeps FD-WO-017); recommend the
   user decide **retire FD-LABOR-003** vs keep both. *(Retirement needs explicit ruling + snapshot.)*
2. **FD-PCOL-003 (C28471) / FD-PCOL-007 (C28475) retire-candidates (F2).** Rescoped off the removed "+ Add"
   button; they now overlap the kept new **FD-PSALE-002/003**. Kept + rescoped per F2; user to confirm
   retire-vs-keep.
3. **FD-WO-028 (regression) mild overlap.** The jurisdiction-note half overlaps FD-WO-016/FD-TMPL-018/FD-PSALE-001
   (per-surface note cases). Kept because the **"Pass convenience fee to customer" banner** regression has no
   other coverage and this is a consolidated post-SV-8479 "nothing removed" check. Confirm the user wants the
   standalone regression case vs folding the banner check elsewhere.
4. **FD-PSALE-008 (item 19) — Picture 26 missing.** Whole-parts-sale entry label "Add Parts Sale Fee / Discount"
   is prose-only; kept as **VIU-confirm** (F5). Confirm the exact label live at VIU (and F4: whether Chris wants
   the 7 customer-tab "Add Fee/Discount" buttons renamed for consistency — left unchanged for now).

## Confirmation of guardrails honoured
NO TestRail writes · NO `testrail-id-map.csv` edit · NO import regeneration · NO commit · NO secrets written ·
NO `viu_status` changed. Only `cases/group-A-wo-parts.json`, `cases/group-C-calc-permissions-validation.json`
(edited) and this decision table were written. `group-B` label-sweep cases (FD-TMPL-010, FD-PROC-005, etc.)
were edited in place within `cases/group-B-customer-admin-finance.json`.
