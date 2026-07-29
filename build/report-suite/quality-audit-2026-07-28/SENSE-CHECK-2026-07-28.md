# Report Suite — SENSE-CHECK Supplement (Coherence Audit) of All 515 Test Cases — 2026-07-28

**What this is:** the SECOND half of the answer to Stefan Mitrovic's "AI slop" claim. The completed
usefulness audit (`USEFULNESS-AUDIT-2026-07-28.md`) scored redundancy/value (KEEP/MERGE/WEAK-KEEP/CUT);
it did NOT explicitly test COHERENCE. Stefan also believes **"some tests just do not make sense."**
This supplement reads every one of the 515 cases COLD — as Stefan would, without our context — and
answers per case: *"Would a competent manual QA tester read this and find it makes sense?"*

- **Scope:** ALL 515 cases, no sampling (Standing Rule 17). Every case now carries a `sense_verdict`
  + `sense_reason` in `per-case-verdicts.csv` (all prior columns preserved).
- **Source snapshot:** case bodies read from the last COMMITTED state, **git SHA
  `674af301527c691c000e7063eca7f184fc0e2a89`** — case content verified byte-identical to `ddf8c16`
  (the usefulness audit's snapshot) via an empty `git diff ddf8c16 674af30 -- build/report-suite/cases/`.
  Bodies were read from a read-only checkout at `/tmp/rs-sense/cases-snapshot`; **the working-tree
  case files were NOT read and NOT touched** (a concurrent worker was mid-edit there).
- **Concurrent-edit flag:** the concurrent worker's video-authoritative edits landed as commit
  `3bd08a7` mid-run — **27 cases changed + 1 added (SBC-EXP-16, new, no C-ID yet, outside this 515
  population)**. Those 27 cases' sense verdicts apply to the PRE-EDIT text and are individually
  tagged *"re-check after video edits land"* in the CSV.
- **Also read (for fail condition 4):** the six current specs (`spec-current-2026-07-28/`, verified
  unchanged vs Confluence), the kickoff-video transcript + deltas (`chris-answers-2026-07-28/`).
- **Zero TestRail writes, zero case edits** — analysis + recommendations only.

## Method — the NONSENSE tests (fail conditions)

Each case was read cold (title + full preconditions + steps + expected + notes) and failed if ANY
of these held:

| # | Fail condition |
|---|---|
| F1 | Steps not executable in the stated order / precondition impossible to reach in the product. |
| F2 | Expected result does not logically follow from the steps. |
| F3 | Internal contradiction (precondition vs step, step vs expectation). |
| F4 | References a control/screen/field that exists in NEITHER the spec NOR the kickoff video. |
| F5 | Domain nonsense — wrong for how a real shop/report works (impossible math, wrong calculation direction, cost/sell conflation, snapshot logic that can't happen). |
| F6 | Not actionable — a tester cannot tell what to DO or what PASS looks like (vague verbs, missing data, ambiguous target). |

**Verdicts (exactly one per case):**
- **SENSIBLE** — a cold reader can run it and knows what pass looks like.
- **FIX-WORDING** — the test is sound, but specific wording would confuse a tester; repairable
  (the reason says exactly what to fix). NOT a case-existence problem.
- **NONSENSE** — fails one of F1–F6; the offending text is quoted; recommend CUT or full rewrite.

Worked math was recomputed where cases carry examples (e.g. PV-CALC-09's `(10 ÷ 30 × 365) ÷ 5 =
24.33`, PV-CALC-10's `$140 / $90 / 35.7%`, TU-SUM-03's weighted 10% vs naive 50%, WIP-CALC-02's
`1.0 of 4.0 hours = $100`) — **all checked out**; no impossible-math (F5) failure was found anywhere.

## Headline numbers

| Report | SENSIBLE | FIX-WORDING | NONSENSE | Total |
|---|---|---|---|---|
| **SBC** Sales By Customer | 97 | 2 | 0 | 99 |
| **SBR** Sales By Representative | 123 | 3 | 1 | 127 |
| **PV** Parts Velocity | 68 | 1 | 1 | 70 |
| **TU** Technician Utilization | 57 | 2 | 0 | 59 |
| **WIP** Work In Progress | 83 | 0 | 0 | 83 |
| **IV** Inventory Value | 76 | 1 | 0 | 77 |
| **TOTAL** | **504 (97.9%)** | **9 (1.7%)** | **2 (0.4%)** | **515** |

## The full NONSENSE list (2 cases — both already CUT by the usefulness audit)

| Case | C-id / link | Offending text (quoted) | Fail | Recommendation |
|---|---|---|---|---|
| PV-COL-07 — "A saved view with a stale schema version is ignored…" | C30357 — https://shopview.testrail.io/index.php?/cases/view/30357 | Precondition: *"seed by editing the stored value's version marker in browser storage"* — no storage key or format is given; the case's own note admits it must be *"found at VIU"*. A cold manual tester cannot perform the seeding step. | F6 | **CUT** (usefulness audit already says CUT — consistent). If kept at all, it belongs in a dev/automation test, not a manual case. |
| SBR-EXP-09 — "Font tier edge rules: a longer negative shifts one tier smaller (clamped at 8px)…" | C30284 — https://shopview.testrail.io/index.php?/cases/view/30284 | Expected: *"the base tier shifts ONE step smaller than the positive value's tier, clamped at the 8px floor"* — a manual tester cannot distinguish 8px vs 9px body text in a PDF without tooling the case does not provide, and the required *"view with no positive dollar value at all"* is barely seedable. | F6 | **CUT** (usefulness audit already says CUT — consistent). |

**Cross-check against the existing verdicts (the embarrassment check): NO case we marked KEEP
turned out NONSENSE.** Both NONSENSE cases were already caught as CUT by the usefulness audit —
the two dimensions agree on the worst offenders. (Verified programmatically by
`gen_sense_verdicts.py`: `KEEP-but-NONSENSE: none`.)

## The FIX-WORDING list (9 cases — sound tests, repairable wording)

Six of these carry a KEEP verdict, three WEAK-KEEP; none needs to die — each needs the stated repair.

| Case | C-id / link | Prior verdict | What to fix |
|---|---|---|---|
| SBR-NAV-01 | C30195 — /cases/view/30195 | KEEP | Steps compare the nav order against *"before this report was added"* — a state a cold tester cannot observe on a build where the report already exists. Reword to compare against production/the prior release, or move the additive-placement comparison to a VIU note. |
| SBR-CALC-08 | C30236 — /cases/view/30236 | KEEP | Seeding hint *"seed ZZAUTOTEST data with values like $10.005"* — money fields take 2 decimals; sub-cent values cannot be typed in. Reword the seeding to derive sub-cent intermediates (hours × rate, percentage lines). The trap itself (one-last-decimal totals difference = expected) is valuable. |
| SBR-EXP-08 | C30283 — /cases/view/30283 | WEAK-KEEP | The 11/10/9/8-px tier table is not verifiable by eye; the case's own note concedes only *"the relative step-downs and the no-overflow guarantee"* are checkable — promote that fallback into the Expected as the pass criterion, demote the px values to metadata. |
| SBC-PERM-04 | C30101 — /cases/view/30101 | KEEP | Step 3 *"attempt to request a location you are not assigned to (…by editing the page link if the location is carried there, or any other means available)"* is conditional/vague — name the concrete probe route(s) in the steps. |
| SBC-EXP-08 | C30166 — /cases/view/30166 | WEAK-KEEP | *"25px margins"* asserted with no measurement method — state the tooling (PDF inspector) or reduce the pass criterion to observable claims (A4 landscape + footer + page numbers). |
| TU-SUM-02 | C30415 — /cases/view/30415 | KEEP | Says eye-summing *"MAY differ … by a cent"* — the values are HOURS, not money; say "by 0.01 (one unit in the last decimal)". |
| TU-LINK-03 | C30430 — /cases/view/30430 | KEEP | Title/Expected say the totals *"reconcile … to the cent"* — the compared totals are hours (two decimals), not currency; reword to "match exactly, to two decimals". One of the suite's best cases otherwise. |
| PV-EXP-08 | C30382 — /cases/view/30382 | WEAK-KEEP | Step 2 *"Open the CSV in a spreadsheet tool and check the produced alignment"* — a CSV carries no alignment; scope the alignment assertions to the PDF only. |
| IV-PERS-04 | C30582 — /cases/view/30582 | KEEP | Expected line 1 asserts the GENERAL "invalid saved value falls back to its default" while the steps only drive the stale-category/vendor path — scope the Expected to what the steps produce (or add the per-value-class route the way SBC-PERS-03 does). |

(Full links: `https://shopview.testrail.io/index.php?` + the /cases/view/ path shown.)

## What did NOT fail (the honest defence, checked adversarially)

- **F4 (invented controls): zero hits.** Every control/screen/field referenced across all 515
  cases traces to the spec (each case carries a `spec_ref`); where the VIDEO diverges from the spec
  (SBC Print button, unit-number asset labels, single-location filter visibility P33, PV
  "Catalogue" naming), the cases already carry explicit KNOWN-DELTA / pending-video flags rather
  than invented expectations.
- **F5 (domain nonsense): zero hits.** Every worked example recomputes correctly; the calculation
  directions (labor delta = invoiced − worked; margin = sell − cost; weighted not averaged
  utilization; earned capped at quote per line; as-of snapshot anchoring) match the spec and the
  PO's own video explanations. The suite is notably careful about the classic shop-report traps —
  several cases exist specifically to STOP a tester misreading correct behaviour as a bug
  (IV-DATE-02 as-of anchor, WIP-CALC-06 Total ≠ WO grand total, TU-LINK-04/05 reconciliation
  exceptions, PV-CALC-15 movement-vs-billed bases).
- **F1/F3: zero outright hits.** Hard-to-produce data states are consistently hedged in-case with
  a seeding route + an explicit "if not producible → Blocked-Env with reason" instruction
  (SBC-LBL-03, SBC-TREE-11, SBR-ROW-03, SBR-EXP-15, IV-DATE-05) — that is the correct honest
  pattern, not incoherence.
- **The no-op sort cases (SBC-SORT-07, SBR-SORT-06) and the duplicate empty-state cases
  (IV-TOT-05, WIP-TOT-04) are coherent** — a tester can run them and knows what pass looks like.
  Their problem is WORTH, not SENSE, and the usefulness audit already cut them.

## Combined headline — usefulness + sense together

The two dimensions overlap on the worst cases (both NONSENSE are already CUT), so the combined
recommendation is unchanged in count but stronger in justification:

- **Usefulness:** 6 CUT + 50 MERGE-aways → **515 → 459 recommended** (409 if WEAK-KEEPs are also
  trimmed).
- **Sense:** 2 NONSENSE (already inside the 6 CUT) + **9 FIX-WORDING repairs to apply to surviving
  cases when they are next touched** (fold into the pending video-delta/consolidation rework so
  each case is edited once).
- **Final recommended suite: 459 cases**, of which 9 need the listed wording repairs; 0 additional
  cases die on sense grounds.

## Is Stefan right? (both halves of his claim, with numbers)

**On "70%+ waste": no — the honest worst-case fat is ~21%** (56 genuine-waste cases = 11%, plus 50
flagged low-value WEAK-KEEPs; see the usefulness audit). **On "some tests just do not make sense":
he is 0.4% right — 2 cases of 515** fail a cold coherence read (both are spec-minutiae cases we had
already cut ourselves before he could point at them), and another 9 (1.7%) have confusing wording
worth repairing (wrong unit-words like "to the cent" on hours, a px assertion without tooling, one
vague probe step). **97.9% of the suite reads coherently to a cold, non-technical manual tester:**
preconditions state their seeding, steps run in order, expected results follow, worked examples
recompute correctly, and every referenced control traces to the spec or the kickoff video. If
Stefan reads any 20 cases at random, the expected number that "don't make sense" is under half a
case. The two claims also converge rather than compound: everything that fails the sense check was
already in the waste column, so his combined case does not grow — the suite's real issues remain
over-granularity and one-time conformance mixed into the regression core, both already quantified
and consolidated in the merge plan.

## Deliverables updated in this folder

| File | Change |
|---|---|
| `SENSE-CHECK-2026-07-28.md` | This report. |
| `per-case-verdicts.csv` | + `sense_verdict` + `sense_reason` columns for all 515 rows (all prior columns preserved; regenerated by script so nothing drifts). |
| `gen_sense_verdicts.py` | The sense-verdict source of truth + CSV regenerator (runs after `gen_verdicts.py`; includes the KEEP-but-NONSENSE embarrassment check and the video-edited re-check flags). |
| `EXEC-NOTE-for-Stefan.md` | Updated to answer the "doesn't make sense" half head-on. |

**Guardrails honored:** zero TestRail writes; zero edits to `build/report-suite/cases/*` (bodies
read from the committed snapshot only), the reconciliation folder, PROJECT-STATE.md, or any other
concurrently-owned file; output confined to this folder + the Part-B process/rule docs; no secrets.

**Honesty limits (Rules 12/22):** this is a DESK coherence audit of case TEXT vs spec + video —
no live-build check was run (the QA branch does not exist yet), so "precondition reachable in the
product" judgements are spec-derived, not build-observed; and the 27 video-edited cases (commit
3bd08a7) were judged on their pre-edit text and are flagged for re-check.
