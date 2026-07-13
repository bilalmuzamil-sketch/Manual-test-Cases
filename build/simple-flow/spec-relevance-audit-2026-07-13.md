# Simple Flow — Spec-Relevance / Obsolescence Audit (2026-07-13)

> **Project:** Simple Flow ONLY (Epic SV-7301, PO = Milos, app `sv7301.qa.shopview.com`).
> **Scope:** READ-ONLY audit. Nothing modified in cases/TestRail/other projects.
> **Trigger:** QA engineer reports some Simple Flow cases look based on an OLDER spec version.
> **Authoritative CURRENT spec used:** `requirements.md` (V2.4 body + §16/V2.4 Δ1–Δ4 notes) +
> `spec-diff-2026-07-10.md` + `spec-diff-2026-07-13.md` + `contradiction-resolution.md`
> (last-update-wins rulings C1–C3 + 2026-07-10 reviewer≠completer ruling) + `epic-content.md`
> ("What's Been Built").
> **Case source audited:** `cases/*.json` (163 cases). **C-IDs:** `testrail-id-map.csv`.
> **Cross-checked against:** `testrail-delta-push-0713-log.md` (Δ1–Δ4 push) + every case's
> `viu_status` / `fresh_run:2026-07-13` / `notes`.

---

## 0. Headline verdict (be honest — this checks my own prior work)

- **Case CONTENT is in very good shape.** All four V2.4 deltas (Δ1 VIN-drop, Δ2 Story-4
  disabled-button+tooltip, Δ3 S13-R6/R7 receive gates, Δ4 Mark-Reviewed note-removed)
  were **correctly applied** in `cases/*.json`, and no case still asserts the classic
  older-spec content (VIN-in-completion-modal, optional review note, error-toast for the
  Story-4 line gate, "distinct Reviewed holding state").
- **The genuine MISSED case-content gap is narrow: 3 cases** carry the stale CTA label
  **"Complete & Send to Review"** that the 2026-07-13 wording+VIU pass proved is actually
  **"Send To Review"** in the build. The correction was applied to SF-SET-14 and to
  SF-REV-02's *expected*, but was **not propagated** to SF-REV-02's *title*, SF-REV-05's
  *step*, or SF-REV-13's *step*.
- **The MOST LIKELY real trigger of the QA complaint is a DELIVERABLE-regeneration gap,
  not the live cases.** The downstream deliverables (`testrail-id-map.csv`, the import
  CSV/XML, the workbooks/results CSVs) were **NOT regenerated** after the Δ pass +
  wording+VIU pass, so they still show older-spec wording — e.g.
  `simple-flow-v2.4-update.xml` still contains SF-REV-10 titled *"…includes VIN (required)
  and an optional review note field (input_review_note)"* with a step *"an optional review
  note field is present; enter a note and Confirm."* Anyone reading those artifacts (rather
  than the live TestRail case or the case JSON) would correctly say "these look like the
  old spec." See §D.
- **Buckets 1 (truly obsolete) and 4 (contradicts a resolved ruling) are EMPTY.** No case
  tests a removed feature, and no case asserts the losing side of any C1–C3 / reviewer≠completer
  ruling.

**Total cases audited: 163.**

| Bucket | Count (cases) | MISSED (needs action) |
|---|---:|---:|
| 1 — OBSOLETE (feature removed/superseded) | **0** | 0 |
| 2 — NEEDS UPDATE (partially stale) | **3** | **3** |
| 3 — DUPLICATE/OVERLAP | **5 pairs** (0 recommend-retire) | 0 |
| 4 — CONTRADICTS a resolved decision | **0** | 0 |
| 5 — RELEVANT (no action) | **~155** | — |
| *(Deliverable-regeneration gap — not a per-case bucket)* | *see §D* | *critical* |

---

## MISSED — NEEDS ACTION (top of report)

These are stale at the **case-content** level and were **NOT** caught by the Δ1–Δ4 delta
pass or the contradiction resolution. All three are the same root cause: the build label
**"Complete & Send to Review" → "Send To Review"** correction was applied incompletely.

| SF-ID | C-ID | TestRail link | Bucket | Stale assertion (quoted) | Current spec / build rule that supersedes | Already handled? | Recommended action |
|---|---|---|---|---|---|---|---|
| **SF-REV-02** | **C29387** | https://shopview.testrail.io/index.php?/cases/view/29387 | 2 NEEDS UPDATE | **Title:** "Verify the completion CTA relabels to **'Complete & Send to Review'** when review is on" | Build label is **"Send To Review"** (SF-SET-14 note: *"the ready-WO action relabels to 'Send To Review' (confirmed live), not 'Complete & Send to Review'"*). The case's OWN expected #1 already says "'Send To Review'" — the **title contradicts its own expected**. | **NO — missed** (expected fixed, title not) | **update-wording** (retitle to "Send To Review") |
| **SF-REV-05** | **C29390** | https://shopview.testrail.io/index.php?/cases/view/29390 | 2 NEEDS UPDATE | **Step 1:** "Click **Complete & Send to Review**." | Same — ready-WO CTA is **"Send To Review"**. | **NO — missed** | **update-wording** (step label) |
| **SF-REV-13** | **C29398** | https://shopview.testrail.io/index.php?/cases/view/29398 | 2 NEEDS UPDATE | **Step 1:** "Click **Complete & Send to Review**." | Same — build CTA is **"Send To Review"**. (Δ2 sanity-checked SF-REV-13 for the *approval-error* model and left it "unchanged" — the stale CTA-label step slipped through the same review.) | **NO — missed** | **update-wording** (step label) |

> **Caveat / honesty note:** SF-REV-02's `notes` already carries a FLAG:
> *"the wizard's final review CTA wording ('Complete & Send to Review' per prior notes) not
> cleanly reproduced this run."* So there may be **two** distinct affordances — the
> **ready-WO toolbar button = "Send To Review"** (confirmed) and a possible **wizard final
> CTA** for part-bearing WOs whose exact label was not reproduced. The fix is to make the
> **ready-WO** wording say "Send To Review" and re-VIU the part-bearing wizard's final CTA
> before asserting either label. This is a build-accuracy wording drift, not a removed feature.

**MISSED-needs-action count: 3 — SF-REV-02 (C29387), SF-REV-05 (C29390), SF-REV-13 (C29398).**

---

## A. Bucket 1 — OBSOLETE (feature/behavior removed or superseded): **0 cases**

No case tests a feature the current spec has removed. The obvious suspects were checked and
are **NOT obsolete**:

- **SF-COMP-06 (C29295), SF-QB-02 (C29427), SF-SET-03 (C29277)** — the No-PO / Skip path and
  the "Create Purchase Orders" toggle. Although the **build lacks** the toggle (SF-SET-03 =
  Deviation; POs always-on), **contradiction ruling C2 keeps V2.4's No-PO path and toggle**
  ("the retire of SF-COMP-06 / SF-QB-02 is CANCELLED … SF-SET-03 is NOT rewritten to 'POs
  always on'"). These are a **spec-vs-build gap (build lags spec)**, correctly recorded as
  Deviation/Blocked-Env — **RELEVANT, keep.** Not obsolete.
- **VIN-in-completion-modal** (older S4-R3) — fully removed from SF-COMP-16, SF-VAL-02,
  SF-REV-03, SF-UX-02 (grep-confirmed: no case asserts a VIN field inside the completion
  modal). Handled.
- **Optional review note** (older R7/R10) — fully removed from SF-REV-06 and SF-REV-10
  (SF-REV-10 now *actively asserts* "There is no review note field"). Handled.
- **"Distinct Reviewed holding state" + separate final Complete** (older R5/R8) — corrected
  in SF-REV-08 ("signs off and completes the work order directly (no distinct Reviewed
  holding state)") and SF-REV-11. Handled. *(Only the internal `story_ref` string of SF-REV-08
  still reads "(distinct Reviewed state)" — a harmless label on a non-tester-facing field; see §E.)*

---

## B. Bucket 2 — NEEDS UPDATE (partially stale): **3 cases** — all listed in "MISSED" above

SF-REV-02 (C29387), SF-REV-05 (C29390), SF-REV-13 (C29398). "Complete & Send to Review"
label drift. Recommended: **update-wording** (do not retire).

---

## C. Bucket 3 — DUPLICATE/OVERLAP: **5 notable overlaps, 0 recommended-retire**

All overlaps are **intentional cross-section coverage** (a functional case in its Story
section + a mirror in the Validation/Edge or QuickBooks-Integrity section, or an FE-vs-API
split per Standing Rule 4). They survived the V2.4 reconciliation deliberately; none is an
accidental stale duplicate.

| Overlap pair | C-IDs | Nature | Recommended |
|---|---|---|---|
| SF-COMP-07 ↔ SF-QB-01 | C29296 ↔ C29426 | Near-identical text: "in-stock parts decrement inventory + write Part History on simple completion". One sits in Story-2 completion, one in §5 QuickBooks/Inventory-Integrity. | **keep** (cross-section by design; note the near-duplication) |
| SF-COMP-06 ↔ SF-QB-02 | C29295 ↔ C29427 | Create-POs-OFF ⇒ no PO/vendor-bill/AP. Completion vs QB-integrity view. | **keep** |
| SF-VAL-06 ↔ SF-RCV-06 ↔ SF-PNFIX-05 ↔ SF-VEND-04 ↔ SF-VEND-06 | C29420 / C29374 / C29367 / C29381 / C29442 | All exercise the S13-R6/R7 (+vendor) receive-time gates on different surfaces (Validation, Accept-Delivery, Inline-PN-fix, Assign-Vendor, dedicated cost/sell). | **keep** (each anchors a different Story/surface; SF-VEND-06 is the dedicated S13-R7 case) |
| SF-REV-06 ↔ SF-VAL-07 | C29391 ↔ C29421 | Both "Confirm Review disabled until VIN". Review-flow vs Validation/Edge. | **keep** |
| SF-REV-08 ↔ SF-REV-11 | C29393 ↔ C29396 | Both "sign-off completes directly Review→Complete, no separate final Complete". SF-REV-11 adds the invoicing-block half. | **keep** |

---

## D. Deliverable-regeneration gap (the LIKELY QA trigger) — CRITICAL housekeeping

The **live TestRail cases + `cases/*.json` are current**, but several **downstream
deliverables were not regenerated** after (a) the Milos Round-2 pass, (b) the Δ1–Δ4 delta
pass, and (c) the 2026-07-13 build-accurate wording+VIU pass. They still carry older-spec
wording. A QA engineer reading these — rather than the live case — would reasonably say the
cases "look based on an older spec version."

| Deliverable | Stale content found | Severity |
|---|---|---|
| `testrail-import/simple-flow-v2.4-update.xml` | SF-REV-10 title *"…includes VIN (required) and **an optional review note field (input_review_note)**"* + steps *"Confirm an optional review note field is present; enter a note and Confirm"* (fully superseded by Δ4 + Milos R2); SF-REV-08 `references` *"(distinct Reviewed state)"*. | **High** (directly shows removed features) |
| `build/simple-flow/testrail-id-map.csv` | Stale **titles** for many re-worded cases, e.g. SF-COMP-16 *"…(mileage, VIN, engine hours)…"*, SF-REV-10 *"…an optional review note field (input_review_note)"*, SF-REV-08 *"…distinct Reviewed state requiring a separate final Complete Work Order"*, SF-COMP-21/22 *"…approve-line error…"*, SF-CORE-01 *"…gated in the completion modal after Pick…"*, SF-INV-01 *"'Apply invoice to selected POs'"*. (C-ID column is correct; only the title column is stale.) | **High** (this map is the C-ID/title source for every other deliverable per Standing Rule 8) |
| `testrail-import/simple-flow-v1-testrail-import.csv` | Carries the "distinct Reviewed state" reference and pre-wording-pass titles/expected. Already marked INTERIM. | Medium |
| `build/simple-flow/SimpleFlow_V1_TestCases.csv` / `SimpleFlow_Results.csv` | Match the stale patterns (pre-wording-pass titles). | Medium |

**Recommended action (needs its own task + any TestRail authorization is NOT required — these
are local files):** regenerate `testrail-id-map.csv` and all workbooks/import artifacts from
the current `cases/*.json` (re-run `gen_import.py`, `gen_update.py`, `build_workbook.py`,
`build_results_workbook.py`, `gen_blockers.py`), and retire/refresh the stale
`simple-flow-v2.4-update.xml`. **No TestRail write is needed** (the live cases are already
current per the wording+VIU push, 200/200).

---

## E. Bucket 4 — CONTRADICTS a resolved decision: **0 cases**

Every contradiction-resolution ruling is correctly reflected:

- **C1 (Require Review default = per-cohort, NOT on-for-all):** SF-REV-15 (C29400) keeps
  per-cohort; SF-SET-14 (C29288) does not claim "defaults ON". ✔
- **C2 (No-PO path RETAINED; SF-COMP-06/SF-QB-02 not retired; SF-SET-03 keeps toggle):** ✔
- **Reviewer≠completer descope (2026-07-10):** SF-PERM-04/07/08 (C29408/29411/29412) +
  SF-REV-09 (C29394) all allow permission-gated self-review with no identity block. ✔
- **BUG-3 note reversal → re-descoped by Milos R2 + Δ4:** SF-REV-06/10 note-free. ✔

No case asserts a losing side.

---

## F. Peripheral (not spec-obsolescence, noted for completeness)

- **"EXPECTED PER SPEC:" jargon** still prefixes 18 expected lines across SF-POSEL-01..06,
  SF-BULK-01/02/03/04/05/07/08/09/10, SF-INV-01/02/03, and SF-REV-12 (C29401 area). This
  violates Standing Rule 9 (layman wording) but is **not** an older-spec issue — a wording
  cleanup follow-up (the wording pass stripped it from SF-WOP-01/03 and SF-QB-02 but not
  these). Recommend a wording sweep.
- **SF-REV-08 `story_ref`** still reads "(distinct Reviewed state)" — internal metadata only;
  the tester-facing title/expected are correct. Cosmetic.

---

## G. Method / coverage statement

All 163 cases were read in full (three group JSONs) and individually classified. Deltas were
cross-checked line-by-line against `testrail-delta-push-0713-log.md` (the 9 update_case + 1
add_case) and each case's `viu_status` / `fresh_run` / `notes`. Targeted greps confirmed the
full-set absence of the four classic older-spec assertions (VIN-in-modal, optional review
note, Story-4 error-toast line gate, distinct-Reviewed-state) beyond the cases already
corrected. C-IDs sourced from `testrail-id-map.csv`.
