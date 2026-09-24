# Simple Flow V2 — test-case appraisal / verification (2026-09-24)

**Scope:** appraisal + verification of the Simple Flow V2 suite (epic **SV-8683**, spec Confluence **771391574**,
TestRail group **6665**). Read-only audit — **no cases changed** (Rule 38/71/6). Last prior source re-verification
was **2026-09-09**; this pass re-checks currency, live inventory, and conformance to the current rule bar
(Rules 113/114/115/116, ratified 21–22 Sep 2026, i.e. **after** the suite's last pass).

## Live inventory (TestRail group 6665, read 2026-09-24)
- **79 cases total in the folder subtree** (12 subsections).
- **Ours (created_by=3): 64.** **Foreign (created_by=1): 15.**  → report as **ours 64 / live total 79**.
- Automation type: 57 Functional + 7 Automated. atmstatus: 57 normal + 7 Automated (Rule 71 hands-off).
- All 64 have non-empty preconditions, steps, expected, a provenance line, and an AUTOMATION marker.

## Verdict: the suite is **structurally sound but NOT current to the rule bar or the source.** Six findings.

### 1. 🔴 Source is STALE — spec moved after the last pass (Rule 31/32/59/91)
- Cases cite the **8 September 2026** revision, read **9 Sep**. The live page **771391574 was last modified 11 September 2026** —
  **after** our verification. No case has been checked against the Sep-11 revision.
- Rule-91 badge today: **🔴 >14 days** (last check 2026-09-09, today 2026-09-24) **and** the source has demonstrably moved.
- **Action:** diff the Sep-11 revision against our saved 8-Sep source; re-stamp/adjust affected cases. (Not yet done — offered.)

### 2. 🔴 Expected results do NOT meet the current verbatim-quote layout (Rule 113 + 114)
- **0 of 64** use the three-part layout the QA lead set on 2026-09-22 (plain results → **Source** → **exact verbatim quotes**).
- Today each Expected is a numbered plain restatement plus a one-paragraph prose provenance line. The **verbatim source
  sentence, quoted and cited per result, is absent** (only ~19/64 contain any quote character, and those are UI-label
  quotes such as "Require ordering parts", not cited source sentences).
- This suite was authored/verified **before** Rule 113 (21 Sep) and its layout amendment (22 Sep), so it predates the bar.
- **Action:** a Rule-113/114 reformat pass (pull the verbatim spec sentence per anchor from the source, add it below the
  plain results, keep plain results leading). Same pipeline used for DVI V2 / Dashboards / WO Board.

### 3. 🔴 AUTOMATION markers say READY while the project is source-verified-only (data-integrity conflict)
- **All 64 read `AUTOMATION: READY`.** PROJECT-STATE records the project as **Rule-85 source-verified-only — "no QA build
  exists yet"** (2026-09-08 and 2026-09-09).
- Yet every Expected also carries **"Last checked against build v26.35.9-5700a76 on 9/9/2026"** — a build-check claim that
  the project record says never happened. This is a **Rule 12 / 54 / 110** conflict (verified = observed; the build is named
  as if checked).
- The QA lead's 2026-09-22 rule is explicit: **not build-verified ⇒ NOT automation ready ⇒ `HOLD`.** So either the suite
  really was build-verified on v26.35.9 (then PROJECT-STATE is wrong and READY is fine) **or** it was not (then all 64
  markers should be **HOLD** and the build line removed). **This must be resolved before the suite is trusted.**

### 4. 🟠 Foreign cases have grown from 2 to 15 (Rule 38 — report, hands-off)
- Last pass knew only **C45202, C45203** (Vladimir). The folder now holds **15** foreign cases:
  45202, 45203, 53490, 53491, 53492, 53493, 53515, 53572, 53573, 53574, 53593, 53596, 53597, 55676, 55681.
- 13 new foreign cases appeared since 2026-09-09 — someone else is authoring in group 6665. **Hands-off**, but the overlap
  needs reconciling with Milos/Vladimir so ours-vs-theirs stays clean and there is no duplicate coverage.

### 5. 🟠 Local id-map is stale (Rule 17/86 reconciliation drift)
- `testrail-id-map.csv` lists **61** internal ids; live ours = **64**. The **4 NEW** cases from 2026-09-08
  (C53486 Story 7, C53487 Story 13, C53488 Story 14, C53489 Story 15) were never added to the id-map.
- **Action:** append the 4 to the id-map so local reconciliation matches live (61 → 64… minus the deleted C53485).

### 6. 🟡 C44604 still HELD, and coverage matrix predates the moved spec
- **C44604** remains held (reorder-Undo "removed on user request" conflicts with every spec version; unsourced) —
  open **PO question for Milos** since 2026-09-09, still outstanding.
- `coverage-matrix.md` shows **21/21 stories covered**, but it was derived **2026-08-21 against spec v23**; it has not been
  re-derived against the Sep-11 revision. Coverage is **presumed** current, not proven for the latest source.

## What IS good (verified)
- Every case has real preconditions/steps/expected and a provenance line; nothing empty.
- Renders were repaired to served-page `fr-view` in the Sep-08/09 passes (marker last, no literal tags).
- Coverage design (21 stories + SV-8183 permission map, both directions) was sound at v23; Automated/foreign cases handled correctly.

## OUTSTANDING — what I need from you
1. **Resolve finding #3 first:** was Simple Flow V2 ever build-verified (v26.35.9), or is it source-verified-only? That
   decides whether the 64 markers stay `READY` or must become `HOLD` and the build line be removed.
2. **Approve the Sep-11 spec re-verification** (diff 771391574 Sep-11 vs our 8-Sep source; re-stamp affected cases). I can run this.
3. **Approve the Rule-113/114 reformat pass** (verbatim-quote Expected layout) to bring the 64 to the current bar. I can run this.
4. **Milos:** the C44604 reorder-Undo conflict is still an open PO question.
5. **Foreign overlap:** confirm with Milos/Vladimir who owns the 13 new foreign cases in group 6665 (kept hands-off meanwhile).

_Read-only appraisal; no TestRail writes made this pass._
