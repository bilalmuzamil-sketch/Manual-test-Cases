# STEP 1 — SETTLING THE COUNT · Report Suite · 2026-08-04

## THE ANSWER, IN ONE LINE

**Nine cases WERE deleted. Both passes counted correctly — they counted at different times.**
`478 ours / 483 live / 478 tests / 539 results` was the **pre-merge** state.
`469 ours / 474 live / 469 tests / 529 results` is the **post-merge** state, and it is the state live
right now. Nothing was mis-counted, nothing was lost, and **every one of the nine deletions was
preceded by its content being folded into its survivor.**

**There is one real finding, and it is not a loss:** the authorised plan called for **ten** removals
(9 merges + 1 cut). **Nine happened.** `MG-WIP-TOTAL-PINNED` was never executed and no exclusion was
ever recorded for it — so I re-derived it from scratch and **it should not be executed.** See §5.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Live TestRail cases | project 1 / suite 1 / group **4281** | read live, fully paginated | **2026-08-04** | **CURRENT** |
| Live TestRail run | run **359** | read live, fully paginated | **2026-08-04** | **CURRENT** |
| Committed snapshots | `rulings-2026-08-04/baseline/`, `rulings-2026-08-04/recovery/` | commit `22c623c` and later | 2026-08-04 | **CURRENT** |
| Merge plan | `audit-exhaustive-2026-08-04/AUDIT.md` | 2026-08-04 | 2026-08-04 | **CURRENT** |
| Live build | `sv8582.qa.shopview.com` `v3.4.1-0ed4433` | **declared NOT FINAL** | 2026-08-03/04 | **PARTIAL (Rule 49)** — `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** |

This step was **entirely READ-ONLY**: `get_sections`, `get_cases`, `get_run`, `get_tests`,
`get_results_for_run`. **Zero writes.**

---

## 1 · THE LIVE COUNT, PAGINATED TO EXHAUSTION

Group 4281 is not one section — it is **96 sections** (the group itself plus 95 descendants,
resolved transitively, not just direct children). `get_cases` was paged at `limit=250` across the
**whole suite** (4,050 cases) and then filtered to those 96 section ids, because TestRail's
`section_id` filter returns only a section's *own* cases and would have silently under-counted.

| Measure | Live now |
|---|---|
| Sections under group 4281 (incl. itself) | **96** |
| Cases in suite 1, paginated to exhaustion | 4,050 |
| **Cases under group 4281 — live total** | **474** |
| **— OURS (`created_by == 3`)** | **469** |
| — FOREIGN (`created_by == 1`, Vladimir Tomovic) | **5** — C38919, C38920, C38921, C38922, C38923 |
| **Run 359 — `get_tests` paginated to exhaustion** | **469** |
| Run 359 — `include_all` | **false** |
| **Run 359 — `get_results_for_run` paginated to exhaustion** | **529** |

Reported as **ours 469 / live total 474**, per Standing Rule 38 — our tally never claims and never
hides another author's work.

---

## 2 · THE CASE-ID SET, DIFFED AGAINST EVERY COMMITTED SNAPSHOT

Not counts — **sets, both directions.** Every case present in one and absent from the other is named.

| Snapshot | Total (ours) | In snapshot but **NOT** live | In live but **NOT** in snapshot |
|---|---|---|---|
| `baseline/live-cases-4281-START.json` | 483 (478) | **9** — C30182, C30350, C30445, C30453, C30529, C30532, C30544, C30586, C30608 | **0** |
| `recovery/live-cases-4281-NOW.json` | 483 (478) | the same **9** | **0** |
| `recovery/live-cases-4281-AFTER.json` | 483 (478) | the same **9** | **0** |
| `recovery/live-cases-4281-POSTMERGE.json` | **474 (469)** | **0** | **0** |

**The nine are exactly the eight absorbed cases plus the one cut**, and nothing else moved in either
direction. `live-cases-4281-POSTMERGE.json` is **set-equal to live in both directions** — the live
state matches the last committed snapshot precisely.

**So the "469" was not a mis-count and the "478" was not a mis-count.** The 478 pass ran before the
deletions; the 469 pass ran after them. `478 − 469 = 9`.

---

## 3 · EVERY DELETION WAS AUTHORISED — AND EVERY ONE WAS FOLDED FIRST

The two-phase op logs are committed: `recovery/merge-backup/merge-op-log-phase1.json` (9
`update_case`, each *"30 fields compared, 0 mismatch"*) and `merge-op-log-phase2.json` (9
`delete_case`, each *"HTTP 200, re-GET HTTP 400 = gone"*). **Phase 1 ran before phase 2** — content
in first, deletion second, which is the only safe order.

I did not take that on trust. For each group I re-read the absorbed case body from the committed
pre-merge snapshot and checked the survivor's **live** text today:

| Group | Absorbed | Survivor | Survivor's Expected grew | Survivor's `refs` extended | Absorbed assertions now covered |
|---|---|---|---|---|---|
| MG-IV-SNAPSHOT-RERUN | C30608 | [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | 451 → 702 (+251) | `+ Story 11 S11-R5; Story 5 S5-E1` | 3 of 3, in the survivor |
| MG-IV-TOTALS-POSITION | C30586 | [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | 860 → 958 (+98) | `+ Story 9 S9-R4` | 1 in the survivor; **the sort-persistence line in [C30354](https://shopview.testrail.io/index.php?/cases/view/30354)** |
| MG-PV-REVERSAL | C30350 | [C30364](https://shopview.testrail.io/index.php?/cases/view/30364) | 627 → 816 (+189) | `+ S3-E1` | in the survivor plus [C30359](https://shopview.testrail.io/index.php?/cases/view/30359), [C30367](https://shopview.testrail.io/index.php?/cases/view/30367), [C30369](https://shopview.testrail.io/index.php?/cases/view/30369), [C30371](https://shopview.testrail.io/index.php?/cases/view/30371) |
| MG-SBC-EMPTY-LOADING | C30182 | [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | 882 → 1074 (+192) | `+ Story 17 S17-N1` | 2 of 2, in the survivor |
| MG-TU-LOC-FALLBACK | C30445 | [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | 483 → 668 (+185) | `+ S9-R7` | 2 of 2, in the survivor |
| MG-WIP-SNAPSHOT-SHAPE | C30529 | [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | 590 → 802 (+212) | `+ Story 11 S11-R2` | 1 of 1, in the survivor |
| MG-WIP-SNAPSHOT-PRECISION | C30532 | [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | 403 → 514 (+111) | `+ Story 11 S11-R5` | 1 of 1, in the survivor |
| MG-WIP-TAB-COUNTS | C30453 | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | 609 → 703 (+94) | `+ Story 1 S1-R4` | 2 in the survivor; **the `"(0)"` line in [C30460](https://shopview.testrail.io/index.php?/cases/view/30460)** |
| **CUT** IV-SCOPE-05 | C30544 | [C30540](https://shopview.testrail.io/index.php?/cases/view/30540) | 577 → 748 (+171) | `+ Story 2 context note` | its one line folded in anyway |

**The three lines that did not land in their own survivor were verified, verbatim, in the case the
audit named** — I did not accept "covered elsewhere" without reading the other case's text
(Rule 45(e)):

- sort persistence → **C30354** expected 1: *"On return, every saved setting is restored: Type =
  Inventory, Last Month, the chosen category, the column set including Turns / Yr, and the
  **Revenue-descending sort**."*
- WIP `"(0)"` → **C30460** expected 3: *"**Every tab label count reads "(0)"**."* and expected 4
  covers the one-empty-tab variant.
- PV negative movement → **C30359** expected 4: *"Units Sold **can be 0.00 or negative** when
  reversals exceed sales."*; **C30371** expected 1: *"negatives with a leading minus (**-3.00**)"*;
  exclusion-of-fully-reversed-parts → **C30369** and the survivor C30364 expected 5.

**No coverage was lost in any of the nine.** Nothing needs restoring.

---

## 4 · RUN 359 — EVERY PRIOR RESULT VERIFIED BY ID, NOT BY COUNT

| Check | Result |
|---|---|
| Prior result records (committed pre-deletion snapshot) | **539** |
| Live result records now | **529** |
| **Prior records still present, matched BY ID** | **529** |
| Records dropped, BY ID | **10** |
| **New/unexpected result ids** | **0** |

Each of the ten dropped records was traced **result id → test id → case id**:

| Result id | Test id | Case | Authorised delete? |
|---|---|---|---|
| 371369 | 2019235 | C30182 | yes |
| 372413 | 2019235 | C30182 | yes (that case held two results) |
| 371537 | 2019403 | C30350 | yes |
| 371632 | 2019498 | C30445 | yes |
| 371640 | 2019506 | C30453 | yes |
| 371716 | 2019582 | C30529 | yes |
| 371719 | 2019585 | C30532 | yes |
| 371731 | 2019597 | C30544 | yes |
| 371773 | 2019639 | C30586 | yes |
| 371795 | 2019661 | C30608 | yes |

**Results belonging to surviving cases: 529 before, 529 still present, 0 missing.** The ten that
dropped did so because a deleted case falls out of a run on its own — **no `update_run` was ever
sent**, so Rule 34's partial-`case_ids` hazard was never in play.

**Run 359 vs our live 469 — set-equal BOTH ways:** 469 tests, 469 distinct case ids, `in run not in
ours = []`, `in ours not in run = []`. `include_all` is still **false**, so this equality is a fact
to be re-checked after any future `add_case`, not a property that maintains itself.

**The five foreign cases are byte-identical to the pre-run baseline** — 30 fields compared each,
**zero** differences **including `updated_on` and `updated_by`** (all five still `updated_by = 1`).
That is evidence they were untouched, not an assurance (Rule 38/50).

**The id-map already reflects the post-merge state:** 469 rows, **0** blank C-ids.

---

## 5 · THE ONE REAL FINDING — `MG-WIP-TOTAL-PINNED` WAS NEVER EXECUTED, AND SHOULD NOT BE

The plan in `audit-exhaustive-2026-08-04/AUDIT.md` is headed **"The MERGE plan — 9 groups"** plus a
1-case cut = **10 removals**. The op logs show **8 merges + 1 cut = 9**. The missing group:

> `MG-WIP-TOTAL-PINNED` — absorb **WIP-VIS-03 = [C30521](https://shopview.testrail.io/index.php?/cases/view/30521)**
> into **WIP-TOT-01 = [C30494](https://shopview.testrail.io/index.php?/cases/view/30494)**, the
> survivor gaining *"the horizontal-scroll line"*.

**No exclusion was recorded anywhere** — not in the op logs, not in the deliberate-decisions
register, not in the execution log. I will not guess at the previous worker's intent. So I
re-derived the merge on its merits, and **my verdict is: do not execute it. Keep both.** This is the
brief's own escape hatch — *"if folding would make the survivor incoherent, keep both and report."*
Three reasons, each checkable:

**(a) They are different requirements.** C30521 cites **Story 4 S4-R22 and Story 10 S10-R3**;
C30494 cites **Story 6 S6-R1, S6-R4, S6-R5**. Merging them would put one case under two unrelated
anchors, which is precisely the coupling Rule 42 exists to prevent — a later change to Story 6 would
drag a Story 4 assertion with it.

**(b) They are different observables — a column, and a row.** C30521: *"The Total **column** (header
and cells, shown in bold) stays fixed to the right edge while the rest of the columns scroll
underneath."* C30494: *"Each tab's table has a Totals **row** pinned to the bottom, labeled
"Totals"."* C30494's title names a **Totals row**; bolting sideways-scroll column behaviour onto it
breaks the **title-vs-expected** check that Rule 28's Dimension 2 requires of every case.

**(c) Every other report keeps this as its own standalone case.** Sales By Customer
[C30154](https://shopview.testrail.io/index.php?/cases/view/30154) *"Subtotal is the rightmost
column; pinned on scroll and bold everywhere"*; Sales By Representative
[C30237](https://shopview.testrail.io/index.php?/cases/view/30237); Inventory Value
[C30553](https://shopview.testrail.io/index.php?/cases/view/30553) *"Total Cost is bold and pinned
far right; it stays put on sideways scroll"*. **C30521 is Work In Progress's structural counterpart
to all three.** Executing the merge would make Work In Progress the only report of the six with no
standalone pinned-column case — a suite-level inconsistency, for a saving of one case.

**And it is load-bearing.** A sweep of all 469 cases for horizontal-scroll assertions found
**C30521 is the only Work In Progress case covering the Total column under sideways scroll**
(C30522 covers the Totals *row* under *vertical* scroll). Deleting it without folding would have
lost real coverage; folding it in would have produced an incoherent survivor. Keeping both is the
only clean outcome.

**Consequence for the recommended count:** the audit's "468 recommended" assumed 10 removals. With
9 executed and this one deliberately declined, the honest figure is **469 — which is exactly what is
live.** Recorded in the Rule-46 register.

---

## 6 · WHAT THIS MEANS FOR THE REST OF THE WORK

**Step 5 of the brief is already done and must NOT be re-run.** The nine deletions are live and
verified; re-running the merge plan would attempt to delete cases that no longer exist and would
re-fold content that is already folded, inflating survivors with duplicate lines. The only
outstanding item from that plan is `MG-WIP-TOTAL-PINNED`, and the verdict above is **decline**.

**Nothing is in a dangerous half-state.** Live equals the last committed snapshot in both
directions; every survivor holds its absorbed content; every prior result for a surviving case is
present by id; the run is set-equal to the suite; the foreign five are byte-identical.

---

## OUTSTANDING — what I need from you

| What | Who owes it | What it blocks | Since |
|---|---|---|---|
| **A yes/no on declining `MG-WIP-TOTAL-PINNED`** (keep C30521 and C30494 as two cases). My reasoning is in §5; nothing was written either way. | **QA lead** | Only the final recommended-count wording. Both cases are live and correct as they stand, so nothing is broken while this waits. | 2026-08-04 |
| The QA branch being **declared final** | engineering | Every verdict taken from `v3.4.1-0ed4433` stays **provisional**; `viu-2026-08-03/RECHECK-QUEUE.md` cannot close (Rule 49). | 2026-08-03 |
| **Chris Ward's answers** on the consolidated questions sheet | Chris Ward | The cases carrying the do-not-automate hold cannot be automated. | 2026-08-04 |

Nothing else is outstanding from this step.
