# Filters — Fabian app-wide filter redesign reconciliation — COMPLETION REPORT

**Pass:** `build/filters/fabian-review-2026-08-17/` · **Date:** 2026-08-17 · worker = TestRail user id 3
**Epic:** SV-8785 · **PO:** Branko Cicovic · **TestRail group:** 4110 · **Run (Ahtasham's):** 352

## What I did (plain)
The Filters spec moved to **Confluence v21** (the Fabian design review) — a **fundamental redesign**,
not an increment. I reconciled the whole Filters suite to it: authored the genuinely new behaviour,
rewrote the cases the redesign changed, repurposed the cases whose feature was removed, and fixed the
untouched cases whose old wording now contradicts the new spec.

## Counts
| | Count |
|---|---|
| Live cases in group 4110 | **129** (ours **124** / foreign **5**) |
| NEW cases created (add_case) | **9** (C43841–C43849) |
| Existing cases updated / repurposed (update_case) | **60** |
| Total TestRail writes this pass | **69** (all byte-verified, 0 mismatch) |
| Cases NOT touched (behaviour unchanged by the redesign) | **55** |
| **Build-verified this pass** | **0** (app deliberately not opened — build verification deferred) |
| **Steps walked live this pass** | **0** (documents-only pass) |
| Foreign cases touched | **0** (proven byte-identical) |

**The 69 touched cases** carry `AUTOMATION: Not available on Build to test Yet - Last checked
8/17/2026` (Rule 69) and a Rule-54 provenance line naming **epic SV-8785 + the redesign story +
Filters spec v21 (published 14 Aug 2026), read on 17 August 2026** — with no build sentence (build
deferred). The **55 untouched cases** keep their prior markers (41 READY / 10 HOLD / 4 EXPECT-FAIL)
and their earlier build-check record, because their behaviour did not change.

## The redesign delta covered
- Chips moved into the **toolbar row** (right-aligned, same row as tabs); **no separate filter bar**.
- **Collapse/expand toggle REMOVED** everywhere (desktop + mobile).
- Work Orders reduced to **three chips: Status, Assigned to me, Asset on Site**. **Customer, Lead
  Technician and Service Advisor removed** as WO filters (their panel survives as the Story-16 entity
  panel — 23 cases repurposed page-agnostically, no delete).
- **"Assigned to me" NEW toggle chip** (3 new cases) — replaces the removed **My Work Orders tab**.
- **Global "Clear filters" button REMOVED** — clear per chip / "Clear selection".
- **Asset on Site** now a single-select **checkmark** panel.
- Tab model: **four tabs; My Work Orders removed; Work Orders tab added** (pre-filters
  Estimate/Approved/In Progress); Status chip **All-tab only**.
- **Shared-link banner NEW** (1 new case).
- Mobile: **no combined "All filters" drawer**; per-filter bottom sheets; deferred "Apply filters".
- **Panel-type contract** (Story 16) consolidated.

## Verification (Rule 50 / §2)
- Every write sent all four fields (title + refs + 3 text) and was re-GET + byte-compared field by
  field (30 fields each) — **69/69 clean, 0 mismatch, 0 collateral change**. Per-op oplog committed
  as each write landed.
- **Post-write invariant census:** 0 raw markup, exactly **1 automation marker + 1 provenance line**
  per case, all 69 touched carry the Rule-69 marker.
- **Cross-case contradiction sweep (Rule 45):** caught 6 real stale-v19 contradictions in untouched
  cases (global Clear filters / My Work Orders tab / Parts-Reports collapse) — all fixed. Re-sweep =
  **0 live contradictions.** One in-pass duplicate title caught by import hygiene and de-duplicated.
- **Foreign cases (C43576–C43580, Ahtasham):** proven byte-identical START vs END; never in our write
  set.
- **Deliverables:** shredding guard **PASSED**; four counts **live 124 / local 124 / id-map 124 /
  import 124, set-equal both ways**; id-map 0 blanks, refs 124/124; import titles == live titles.
- **Post-write assertion re-audit (§2.10):** 69 material cases, every assertion quoted back to a v21
  anchor, 0 unsourceable, 1 deliberately HELD (see below). `POST-WRITE-AUDIT.md`.

## AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)
**None.** No case we touched carried `custom_atmstatus = 3` — all our cases (and the 9 new) are
`custom_atmstatus = 1` ("Not Automated"). Nothing changed that affects Vlad's automation.

## Is Filters complete?
**Complete against spec v21 for everything the Fabian redesign changed or added**, with three honest
qualifiers: (1) **build verification deferred** — a later sync must build-verify and lift the Rule-69
markers; (2) **the 55 unchanged cases still name spec v18/v19** in their provenance — a version-only
re-stamp to v21 is owed (they are behaviourally correct, so this is a currency tidy, not a defect);
(3) the **greyed-vs-hidden Status question** is held pending the QA lead.

---

## OUTSTANDING — what I need from you (all six categories swept)
1. **Missing sources.** The **per-view filter list is PENDING from engineering** (spec S1-R8 /
   S13-R23) — until it lands, QA has no baseline for exactly which chips belong on which Parts view /
   Report, so those cases stay behavioural + "confirm live". *Owed by: engineering. Blocks: precise
   Parts/Reports chip coverage. Since: spec v20, 14 Aug.*
2. **Unanswered questions (PO / QA lead).** **Greyed-vs-hidden Status chip on Estimates/Completed
   (C29609/C29610):** v21 S9-R5 says the Status chip is **hidden**; the recorded **QA-lead ruling of
   30 July 2026** said greyed-out/pre-filled. Ruling not silently reversed (Rule 33) — **verdict held,
   flagged.** *Owed by: QA lead. Blocks: the Status-visibility verdict on 2 cases. Since: this pass.*
3. **Missing go-aheads / authorisations.** **Run 352 sync** — the 9 new cases are not in Ahtasham's
   run (`include_all: False`). Union staged (129 cases) in `STAGED-RUN-352-SYNC.md`; needs his
   authorization before any `update_run`. *Blocks: run-352 coverage (false gap for a run-only
   reviewer). Since: this pass.*
4. **Access / credentials.** **A QA-branch sign-in** for `sv8785.qa.shopview.com` to build-verify the
   redesign and lift the 69 Rule-69 markers to READY. *Blocks: build verification of all 69 + the 55
   unchanged cases against the running build. Since: this pass (build deliberately deferred).*
5. **Decisions deferred / held.** The greyed-vs-hidden ruling (item 2). Also: whether to run the
   **v18/v19 → v21 provenance re-stamp** across the 55 unchanged cases now or fold it into the
   build-verify sync.
6. **Things another team owes.** The engineering per-view filter list (item 1). The Claude design
   (`Filters.html`) is the primary design but not directly fetchable — authored from the spec prose
   (complete for labels); a design link that renders would let us pin the few "confirm live" labels.

**Also flagged (process):** the task brief said `add_case` needs `custom_atmstatus:3`; common-core
§3.1 (and both sibling Fabian passes today) say `1` — `3` is Vlad's automation flag. I used **`1`**
(rule-compliant, avoids corrupting his signal). Please confirm.
