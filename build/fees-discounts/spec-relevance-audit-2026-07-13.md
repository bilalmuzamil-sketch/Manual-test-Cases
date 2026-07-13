# Fees & Discounts V1 — Spec-Relevance / Obsolescence Audit (2026-07-13)

> Ran `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` END-TO-END for **Fees &
> Discounts only** (PO = Chris Ward). Goal: ensure NO F&D case is stale vs the
> current spec, and NO downstream deliverable hands a QA engineer old-spec wording.
> Exhaustive sweep of all **183** cases (the QA lead had no pre-flagged IDs).
>
> **Authoritative CURRENT spec set:** `requirements.md` (V1_1 body + **§16 V1_2
> delta, 2026-07-13**, last-update-wins) + `spec-v2-reconciliation.md` + the epic
> (`epic-content.md`: "What's out of v1" = per-template QB mapping is Phase 2,
> non-US tax models out, auto-apply rules engine out; 5 calc types in the epic but
> the spec dropped the legacy "% of Labor + Parts" from the dropdown → 4 selectable).
>
> **Already-handled baseline checked against:** the V1_2 batch push
> (`testrail-v1_2-push-log.md`, 43 updates + FD-WO-016) and the full build-accurate
> wording+VIU pass (`testrail-wording-viu-log.md`, all 183 cases pushed, title+
> preconds+steps+expected, 200/200) — both dated **2026-07-13**; every case carries
> `fresh_run: 2026-07-13`.

---

## Headline

- **The 183-case suite is CLEAN of stale spec-wording in tester-facing content**
  (Title / Preconditions / Steps / Expected / permissions_required). The V1_2 delta
  pass + the full build-accurate wording+VIU pass (both 2026-07-13) had already
  eliminated every old permission euphemism, the old Processing-Fee legal-disclosure
  block, and the removed "% of Labor + Parts" dropdown option. **No MISSED case.**
- **The gap this process caught was in DELIVERABLES, not cases** — exactly the
  failure mode the process exists to catch:
  1. `testrail-id-map.csv` still carried **156 pre-wording-pass (stale) titles** —
     TestRail already held the new titles (pushed by the wording pass) but the
     id-map deliverable was never regenerated. **FIXED** (156 titles refreshed from
     the current case source).
  2. One **TestRail section name** was still spec-stale:
     **"Processing Fee — taxable + legal disclosure"** (the removed §8-R13 legal
     block; §16.1 replaced it with the §5-R15 jurisdiction note). The case's `area`
     and the import CSV were already updated to "…jurisdiction note", but the live
     TestRail section (and the id-map section column) still said "legal disclosure".
     **FIXED** — TestRail section **3928 renamed** via `update_section` (200/200) +
     id-map section column updated.
- **1 DUPLICATE/OVERLAP pair** (FD-CUST-016 / FD-VAL-007) — not deleted; snapshotted
  and listed as a RETIRE candidate awaiting the QA lead's ruling.

## Bucket tally (all 183 cases)

| Bucket | Count | Notes |
|---|---:|---|
| **1. OBSOLETE** | 0 | No case tests a removed/superseded feature. The removed "% of Labor + Parts" method and the old legal-disclosure block appear only where a case correctly asserts their **absence** / the replacement (§5-R15). No case tests per-template QB mapping (Phase 2). |
| **2. NEEDS-UPDATE** | 0 MISSED | Every V1_2-affected case was already reworded in the 2026-07-13 delta + wording passes (see already-handled column below). |
| **3. DUPLICATE/OVERLAP** | 2 (1 pair) | FD-CUST-016 / FD-VAL-007 — RETIRE candidate (see below). |
| **4. CONTRADICTS a resolved ruling** | 0 | No case contradicts a resolved decision. The 6 cases held on Chris Ward's blank Round-2 answers stay VIU-Deviation pending his ruling (not a contradiction). |
| **5. RELEVANT** | 181 | Fully correct vs the current spec. |

## Deliverable-staleness findings (the MISSED set) + fixes

| # | Deliverable | Stale content | Current rule that supersedes | Already-handled? | Action taken |
|---|---|---|---|---|---|
| DELIV-1 | `testrail-id-map.csv` (title column) | 156/183 titles were the pre-wording-pass wording (e.g. "Verify a percentage adjustment resolves as base × percent" vs current "Verify a percentage fee/discount works out as base x percent") | Rule 9 build-accurate wording pass 2026-07-13 (TestRail already holds the new titles) | **MISSED** by the wording pass (cases pushed, id-map not regenerated) | Regenerated all 156 stale titles from `cases/*.json` (= current TestRail titles). |
| DELIV-2 | TestRail **section 3928** name + `testrail-id-map.csv` section column | "Processing Fee — taxable + **legal disclosure**" | §16.1 (S8-R13 rewritten) removed the legal-disclosure block; the case `area` is now "Processing Fee — taxable + **jurisdiction note**" | **MISSED** (case `area`/import updated; live section + id-map not) | `update_section` 3928 → "Processing Fee — taxable + jurisdiction note" (200/200, verified); id-map section column updated. |
| DELIV-3 | import CSV/xlsx, Blockers Tracker md/xlsx, FreshVIU csv/xlsx | (regeneration hygiene) | current `cases/*.json` | n/a | Regenerated all from the current case source (`gen_import.py`, `gen_blockers.py`, `gen_fresh_viu_workbook.py`). Grep-clean confirmed. |

## RETIRE candidates — needs QA-lead ruling (NOT deleted; snapshotted)

Snapshots: `build/fees-discounts/testrail-snapshots-relevance-2026-07-13/`.

| FD-ID | C-ID | Bucket | Reason | Snapshot |
|---|---|---|---|---|
| FD-CUST-016 | [C28500](https://shopview.testrail.io/index.php?/cases/view/28500) | DUPLICATE/OVERLAP | Verifies the S9-known-gap "auto-apply template + customer default → added only once" — **functionally identical** to FD-VAL-007 (same expected: exactly one adjustment). Differs only by section (Customer-page vs Validation). | C28500.json |
| FD-VAL-007 | [C28605](https://shopview.testrail.io/index.php?/cases/view/28605) | DUPLICATE/OVERLAP | Same scenario/expected as FD-CUST-016. | C28605.json |

**Recommendation (for QA-lead ruling):** keep ONE (suggest FD-CUST-016 in the
Customer-page area, its natural home) and retire the other, OR keep both as
deliberate cross-area coverage. **No deletion performed** — deletion needs explicit
user ruling (TestRail is the only real system).

## Why NOTHING was OBSOLETE (evidence the removed-feature cases assert the removal)

- **Removed "% of Labor + Parts" calc method** (epic counts 5; spec dropped it to 4
  selectable — `epic-content.md` note 1, §5-R4 legacy note): the only tester-facing
  mentions are **FD-WO-011** and **FD-TMPL-014**, which each assert the dropdown
  offers **exactly** Flat Amount / % of Labor Total / % of Parts Total / % of
  Subtotal (i.e. they verify the legacy method is **absent**). RELEVANT, not obsolete.
- **Old Processing-Fee legal-disclosure block** (S8-R13 pre-V1_2): **FD-PROC-004**
  was already rewritten to the §5-R15 jurisdiction note; **FD-WO-016** (new in V1_2)
  covers the Add/Edit dialog. No case still asserts "legal disclosure / legal
  sign-off / auto-translate".
- **Per-template QB Product/Service mapping** (Phase 2 / out of v1 per the epic):
  no case tests it. **FD-QB-002** correctly tests the v1 model — a **single** mapped
  Fee item / Discount item per location (S6-R5), explicitly "not the adjustment
  name" — which is the current-spec behavior.
- **Old permission euphemisms** ("pricing-view permission", "Work Order change
  permission", "customer change permission", "work-order history permission", "View
  History Logs" as a gate): **0** hits in tester-facing case content; all cases use
  the exact SV-7388 names (See Financial Data, Work Orders / Work Order Lines / Part
  Sales: Create and Edit, Customer Management: Create and Edit + Manage AP/AR).

## Grep-verify (Step 6) — regenerated deliverables

Stale spec-wording patterns asserted **ZERO** in all case-content deliverables
(import CSV + xlsx, id-map, Blockers Tracker md + xlsx, FreshVIU csv + xlsx):
`pricing-view permission`, `Work Order change permission`, `customer change
permission`, generic `change permission`, `work-order history permission`, `legal
disclosure`, `legal sign-off`, `auto-translate`. **All CLEAN.**

Import CSV/xlsx additionally confirmed **0** occurrences of `feature flag` and `VIU`
(the VIU-word-free + feature-flag-free import rule).

**Allowed residual (explicitly permitted exceptions):**
- `FeesDiscounts_FreshVIU_*` "Fresh Evidence / Note" column retains dated historical
  evidence ("…was View History Logs", "no legacy '% Labor+Parts'") — these are
  **dated historical records** documenting the change, not tester-facing assertions;
  the Title column is current/clean.
- `FeesDiscounts_Blockers_Tracker.md` contains "feature flag" ×3 — all in the
  spec-ref column of the **flag-gating** cases (FD-PERM-010, FD-FLAG-001/003) where
  the feature flag is the subject under test (a current, valid concept), and "VIU"/
  "verified" appear as **status values** (VIU-Verified etc.), the legitimate purpose
  of a status tracker (Standing Rule 8). Neither is stale spec-wording.

## TestRail actions (explicit)

- **1 `update_section`** — section **3928** renamed "…legal disclosure" →
  "…jurisdiction note" (HTTP 200, re-verified 200).
- **2 `get_case`** (read-only snapshots: C28500, C28605).
- **0 `update_case`** — all tester-facing case content was already current in
  TestRail (pushed by the 2026-07-13 wording pass); no case rewrite was needed.
- **0 deletions / 0 moves / 0 results / 0 runs.** Fees & Discounts project only.
- Audit log: `testrail-relevance-audit-log-2026-07-13.md`.
