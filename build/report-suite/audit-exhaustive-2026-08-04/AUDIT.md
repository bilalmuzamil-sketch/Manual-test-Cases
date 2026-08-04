# RUTHLESS USEFULNESS AUDIT — Report Suite, EXHAUSTIVE · 2026-08-04

**478 of 478 active cases cold-read on all three dimensions. No sampling.**

The previous certification cold-read **24 of 475** while reading as a certification of the whole.
Under Standing Rule 50 that is a sample, not verification. This pass is the verification.

| | |
|---|---|
| Population | **478** active cases under TestRail group 4281, `created_by = 3` |
| Cold-read on Dimension 1 (useful) | **478 / 478** |
| Cold-read on Dimension 2 (makes sense) | **478 / 478** |
| Assessed on Dimension 3 (genuine + layman-runnable) | **478 / 478** |
| Excluded, never touched | **5** foreign cases by Vladimir Tomovic (C38919–C38923), Standing Rule 38 |
| Reported counts | **ours 478 / live total under group 4281 = 483** |
| Method | **desk audit** — case text against the current specs, PO rulings and the recorded live VIU evidence. Nothing re-observed live this pass. |
| Build the evidence came from | **`v3.4.1-0ed4433`**, declared **NOT FINAL** — every judgement is provisional (Standing Rule 49) |
| Deterministic regeneration | `gen_audit.py` (exits non-zero if the population is not 100% scored, if any count fails to reconcile, if a CONTRADICTION lacks a resolution or a PENDING flag, or on any KEEP-but-NONSENSE) |

Population confirmed **four ways with set equality empty in both directions** — see
`VERDICT-LEDGER.md`. Source-currency block: also `VERDICT-LEDGER.md`.

---

## THE THREE-DIMENSION TALLY

### Headline

> **478 cases today → 468 recommended.** **0 NONSENSE. 7 contradictions found, 4 resolved, 3
> pending a ruling. 478 of 478 traceable to a ticket AND a spec anchor. 422 of 478 runnable by a
> non-technical tester unaided; the other 56 need a developer tool and are named.**

### Dimension 1 — USEFUL

| Verdict | Cases | Share |
|---|---:|---:|
| **KEEP** | **403** | 84.3% |
| **WEAK-KEEP** (legitimate, low value, counted separately so the tally is honest) | **65** | 13.6% |
| **MERGE** (real coverage, over-granular packaging — 9 groups, each with a named survivor) | **9** | 1.9% |
| **CUT** | **1** | 0.2% |
| **Total** | **478** | |

**Recommended count = 403 KEEP + 65 WEAK-KEEP = 468.** The 9 MERGE cases are absorbed by survivors
already inside the KEEP count; the 1 CUT is removed. **Net reduction: 10 cases, 2.1%.**

### Dimension 2 — MAKES SENSE

| Verdict | Cases | Share |
|---|---:|---:|
| **SENSIBLE** | **446** | 93.3% |
| **FIX-WORDING** (the underlying test is sound; specific wording would mislead a cold reader) | **25** | 5.2% |
| **CONTRADICTION** (found by Stage 2b) | **7** | 1.5% |
| **NONSENSE** | **0** | 0.0% |
| **Total** | **478** | |

**KEEP-but-NONSENSE embarrassment check: EMPTY.** Asserted in code, not from memory.

### Dimension 3 — GENUINE + LAYMAN-RUNNABLE

| Check | Result |
|---|---|
| **Genuine** — every case carries a Jira ticket AND a spec/video anchor in `refs` (Standing Rule 20) | **478 / 478.** Zero missing-traceability. One qualification: **TU-COL-01** = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) and **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) cite the nearest owning story because TU Story 10 **has no Jira ticket** — a real gap, disclosed in each case's own notes and logged as DELIBERATE-DECISIONS D17. |
| **Standing Rule 4** — API content (endpoints, verbs, status codes) only in API-titled sections | **0 breaches in 478.** All 31 `api_related` cases sit in an API-titled section; a mechanical scan of the 447 non-API-section cases returned 7 candidates, **all 7 false positives** ("$400 quoted", "400 days", "font weight (400)", "300 to 500 rows"). |
| **Layman-runnable** by a non-technical manual tester | **422 of 478 unaided (88.3%).** |
| Needs a developer tool | **56 (11.7%)** — see the breakdown below. |

**The 56 that a non-technical tester cannot run unaided:**

| Kind | Cases | Why it is unavoidable |
|---|---:|---|
| Browser **network panel** | **30** | These assert server-side behaviour — pagination, re-query on filter change, lazy drill-down, HTTP 200/403. **All 30 sit in API-titled sections**, so Rule 4 is satisfied and the case may address a technically-equipped tester. |
| **Screen reader / accessibility inspector / PDF inspector / colour picker** | **25** | Accessibility requirements (accessible names, `aria-expanded`, `aria-sort`, 44×44 touch targets, contrast) and PDF page-geometry requirements cannot be checked by eye. 10 are typed `Accessibility`. |
| **QuickBooks** | **1** | PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925) crosses two systems. |

**Honest action, not a defence:** route those 56 to a technically-equipped tester. Logged as
DELIBERATE-DECISIONS D22.

---

## Per report

| Report | Cases | KEEP | MERGE | WEAK-KEEP | CUT | SENSIBLE | FIX-WORDING | NONSENSE | CONTRADICTION |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sales By Customer | 85 | 68 | 1 | 16 | 0 | 79 | 5 | 0 | 1 |
| Sales By Representative | 111 | 94 | 0 | 17 | 0 | 107 | 3 | 0 | 1 |
| Parts Velocity | 72 | 64 | 1 | 7 | 0 | 67 | 5 | 0 | 0 |
| Technician Utilization | 60 | 56 | 1 | 3 | 0 | 59 | 1 | 0 | 0 |
| Work In Progress | 79 | 63 | 4 | 12 | 0 | 76 | 0 | 0 | 3 |
| Inventory Value | 71 | 58 | 2 | 10 | 1 | 58 | 11 | 0 | 2 |
| **All six** | **478** | **403** | **9** | **65** | **1** | **446** | **25** | **0** | **7** |

---

## The NONSENSE list

**None found.** Not one of the 478 cases fails a fail condition F1–F7 outright. Stated only because
the full population was genuinely read.

## The CONTRADICTION list — 7 cases, 5 groups

Full working, both texts quoted side by side, in **`CONTRADICTIONS.md`**.

| Group | Cases | Winner | Status |
|---|---|---|---|
| **CG-LOCATION-COLUMN-MECHANISM** — is the Location column user-toggled or automatic? | WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) · WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) · WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) *(+ 4 IV cases to align: C30551, C30554, C30580, C30588, C38917)* | IV v3 `S7-R6` and WIP v6 `S4-R3`/`S7-R13` — **automatic** | **PENDING the QA lead** — reversing a prior authorised choice is his call |
| **CG-SBR-STATUS-POSITION** — is Status adjacent to Inv. Hrs? | SBR-BADGE-01 = [C30226](https://shopview.testrail.io/index.php?/cases/view/30226) | SBR v15 `S21-R7` (Chris Ward 2026-07-29) | **Aligned** — make expected 1 scope-conditional |
| **CG-IV-PAGINATION** — pagination control or scroll-loading? | IV-NAV-05 = [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) | our live observation — no pagination control | **Aligned** |
| **CG-IV-TOTALS-LABEL** — "Total" or "Totals"? | IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | IV v3 `S4-R1` | **Aligned**, flagged to Chris Ward |
| **CG-SBC-CUSTOM-RANGE** — is there a "Custom" item? | SBC-DATE-03 = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | our live observation — no Custom item | **Aligned** |

**The pattern behind four of the five is one and the same:** a case that asserts the build's current
behaviour as the pass condition **cannot fail a build that breaks the spec**. Two say so in their own
text (*"That is what the build does today."*, *"That is what you should see"*).

**The suite already contains the correct pattern**, on **WIP-FLT-05** = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502):
expected 3 states the **spec** value, and expected 4 separately tells the tester *"on this build the
exact cut-off sits one day later than the specification says … Record what you see; the one-day
difference is already known and is with the product owner."* **That is the model.** Four cases should
be rewritten to it.

## The FIX-WORDING list — 25 cases

Grouped by what actually needs doing. Every one is a wording repair; **none is wrong about the
product**.

**(a) The Location-mechanism phrase — 6 cases.** IV-COL-01 = C30551 · IV-COL-04 = C30554 ·
IV-PERS-02 = C30580 · IV-EXP-02 = C30588 · IV-LOC-06 = C38917 *(also CONTRADICTION members)* —
*"when it is turned on in the column-selection control"* must become the automatic behaviour.

**(b) The same stray cosmetic sentence copied into five cases — 5 cases.** IV-LOC-06 exp 6 ·
PV-FILT-14 = C38914 exp 6 · SBC-LOC-04 = C38912 exp 7 · SBR-LOC-05 = C38913 exp 8 ·
TU-LOC-06 = C38915 exp 8, all reading *"The Location filter control keeps the same width whichever
label it shows…"*. It is toolbar styling sitting inside five load-bearing cases. **Put it in one
styling case or drop it from all five.**

**(c) Un-repaired pixel and unmeasurable assertions — 5 cases.** SBC-VIS-01 = [C30185](https://shopview.testrail.io/index.php?/cases/view/30185)
(32px / 24px / 2rem / 1px / 24px, five separate measurements) · SBR-VIS-01 = [C30305](https://shopview.testrail.io/index.php?/cases/view/30305) ·
SBC-TREE-01 = [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) (colour #616161, font-weight 600) ·
SBC-TREE-13 = [C30133](https://shopview.testrail.io/index.php?/cases/view/30133) (font-weight 600/700) ·
IV-VIS-05 = [C30600](https://shopview.testrail.io/index.php?/cases/view/30600) (*"dark-mode-legible colors"* — no pass criterion).
**The repair already exists**: PV-VIS-02 = [C30386](https://shopview.testrail.io/index.php?/cases/view/30386)
was rewritten on 2026-07-28 to a by-eye check that names design and engineering as the owner of the
figures. These five were missed. Apply the same fix.

**(d) Assertions duplicated across cases — 4 cases.** PV-EXP-07 = C30381 exp 3 duplicates
PV-EXP-06 = C30380 exp 3 · PV-ROW-07 = C30347 exp 4 duplicates PV-EXP-06 exp 2 ·
PV-ROW-08 = C30348 exp 3/4 duplicate PV-CALC-12 = C30370 and PV-EXP-07 · SBC-CALC-06 = C30154 exp 4
is an unbounded universal (*"regardless of permission, data, filters, or sort"*) a tester cannot
exhaust.

**(e) Steps that no longer match the build's controls — 3 cases.** IV-DATE-04 = C30564 (*"Select a
Custom range"*) · IV-FLT-02 = C30570 (*"where the list starts"*, assuming pages) · IV-CALC-03 =
C30547 (asks for a part with no category, which the build cannot save — the sibling IV-COL-05
already carries the plain tester note for exactly this).

**(f) One-off wording defects — 2 cases.** SBR-ASGN-02 = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293)
puts the hedge **inside the quoted file name**: *'downloads as "sales-representative-assignments.csv
(the short form "rep" is gone from the file name — confirm the exact final file name in the
build)"'* — a cold tester cannot tell what the file name is meant to be. IV-COL-02 = C30552 (the
build's "Qty" versus the spec's "Qty on Hand" — the deviation is the spec's, and the notes should
say so).

**(g) The defect-as-expected inversion — 1 case, and it matters.** **IV-EXP-10** = [C43548](https://shopview.testrail.io/index.php?/cases/view/43548)
makes the bug the pass condition: *"On the whole list the PDF does not download. After roughly half a
minute a plain error appears…"*. **On a fixed build a tester must mark this FAILED for correct
behaviour.** Its own sibling, authored the same day, gets it right — **PV-EXP-12** = [C43547](https://shopview.testrail.io/index.php?/cases/view/43547)
expected 2 reads *"The PDF also downloads successfully. If instead nothing downloads and a message
appears saying something went wrong, **that is a failure**"*. Rewrite IV-EXP-10 to match PV-EXP-12.

## The MERGE plan — 9 groups

| Group | Absorbed | Survivor | What the survivor gains |
|---|---|---|---|
| MG-IV-SNAPSHOT-RERUN | IV-API-04 = [C30608](https://shopview.testrail.io/index.php?/cases/view/30608) | IV-API-03 = [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | the no-backfill and past-dates-unchanged lines |
| MG-IV-TOTALS-POSITION | IV-SORT-04 = [C30586](https://shopview.testrail.io/index.php?/cases/view/30586) | IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | "sorting reorders only the data rows" (its persistence line belongs to IV-PERS-03) |
| MG-PV-REVERSAL | PV-ROW-10 = [C30350](https://shopview.testrail.io/index.php?/cases/view/30350) | PV-CALC-06 = [C30364](https://shopview.testrail.io/index.php?/cases/view/30364) | nothing — all three of its lines already exist in PV-CALC-06, PV-CALC-01 and PV-ROW-09 |
| MG-SBC-EMPTY-LOADING | SBC-EMPTY-02 = [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) | SBC-EMPTY-01 = [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | "the message never appears while still loading" |
| MG-TU-LOC-FALLBACK | TU-LOC-04 = [C30445](https://shopview.testrail.io/index.php?/cases/view/30445) | TU-LOC-03 = [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | the manual deselect-all trigger for the same fallback |
| MG-WIP-SNAPSHOT-SHAPE | WIP-API-02 = [C30529](https://shopview.testrail.io/index.php?/cases/view/30529) | WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | the captured field list |
| MG-WIP-SNAPSHOT-PRECISION | WIP-API-05 = [C30532](https://shopview.testrail.io/index.php?/cases/view/30532) | WIP-API-03 = [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | "stored to the cent" |
| MG-WIP-TAB-COUNTS | WIP-TAB-03 = [C30453](https://shopview.testrail.io/index.php?/cases/view/30453) | WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | nothing — the count and the "(0)" case are already in WIP-TAB-02 and WIP-SCOPE-05 |
| MG-WIP-TOTAL-PINNED | WIP-VIS-03 = [C30521](https://shopview.testrail.io/index.php?/cases/view/30521) | WIP-TOT-01 = [C30494](https://shopview.testrail.io/index.php?/cases/view/30494) | the horizontal-scroll line |

## The CUT list — 1 case

**IV-SCOPE-05** = [C30544](https://shopview.testrail.io/index.php?/cases/view/30544) — *"There is no
dead-stock exclusion - a slow-moving part still appears."* **Duplicate.** IV-SCOPE-01 = [C30540](https://shopview.testrail.io/index.php?/cases/view/30540)
expected 4 already asserts *"**Only** parts meeting BOTH conditions - not a core charge, and on-hand
quantity greater than zero - are listed"*, which excludes any dead-stock filter by construction.
IV-SCOPE-05 restates a spec context note with no independent observable.

---

## The named slop patterns — what the hunt actually found

| # | Pattern | Found? | Detail |
|---|---|---|---|
| 1 | Near-duplicates across areas | **Yes, and this is the real one** | **114 distinct cases assert a behaviour supplied by the shared report shell** and re-asserted on up to six reports: date presets (19 cases / 6 reports), saved view (25/6), pinned bold headline column (17/6), export toasts (14/6), sort toggle (9/6), empty state (8/6), dark mode (6/6), PDF logo (6/6), loading indicator (6/5), export menu labels (5/5), white-table/no-zebra (3/3). **See the honest verdict below — this is not a straight cut.** |
| 2 | Sort-direction / per-column explosions | **No** | Each report has 2–5 sorting cases covering default order, toggle semantics, value-vs-text, null placement and sort scope — not one per column × direction. |
| 3 | Per-column display filler | **Minor** | 4 cases (WIP-COL-06, WIP-COL-08, SBC-CUST-01, SBC-CUST-05); all WEAK-KEEP, each carrying at least one real negative branch. The formatting contracts are consolidated the right way — **PV-CALC-13** = [C30371](https://shopview.testrail.io/index.php?/cases/view/30371) covers all 20 columns' formats in ONE case. |
| 4 | Tooltip present-vs-text splits | **No — the opposite** | **PV-ROW-06** = [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) asserts three icons' presence AND their three verbatim texts AND keyboard exposure AND no-sort-on-activate in one case. **WIP-SUM-07** = [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) does seven tooltips in one. A lesser suite would have written twenty. |
| 5 | Empty-state triplets | **No** | One empty-state case per report, each covering every producing cause: SBC-EMPTY-01 covers three causes; WIP-SCOPE-05 covers four tabs and the one-empty-tab case; TU-NAV-08 covers both triggers. |
| 6 | Permission cases reducing to one gate | **Partly** | 18 permission cases across six reports reduce to **one atom** (`reportsPageAccess`). But they are not redundant: each pair proves the allow AND block side per report, and **SBC-PERM-05** covers a distinct assertion (that no per-report permission is offered at all). A defensible trim is one allow + one block per report; the suite already has close to that. |
| 7 | Export pairs duplicating a whole filter matrix | **No** | Each report has one "export reflects the filters/columns/sort" case; the filter matrix itself lives once, in the filter cases. |

## Load-bearing coverage — the defence, credited explicitly

**217 of 478 cases (45.4%)** sit in at least one load-bearing family:

| Family | Cases | Examples that would catch a customer-facing money bug |
|---|---:|---|
| **Calculation contracts** | 34 | **WIP-CALC-06** = [C30479](https://shopview.testrail.io/index.php?/cases/view/30479) (Earned + Remaining = Total, and Total is deliberately NOT the work order's grand total) · **TU-SUM-03** = [C30416](https://shopview.testrail.io/index.php?/cases/view/30416) (weighted rate, not an average of rows) · **IV-TOT-03** = [C30558](https://shopview.testrail.io/index.php?/cases/view/30558) (recomputed from totals, not averaged) · **PV-CALC-09** = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367) — **which caught the live off-by-one Turns/Yr window divisor** |
| **State / lifecycle integrity** | 36 | **SBR-WO-05** = [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) (invoice credit snapshot, never retroactively altered) · **SBC-TREE-12** = [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) (reversed invoices excluded from rows, counts AND totals) · **WIP-CALC-10** = [C38890](https://shopview.testrail.io/index.php?/cases/view/38890) (an explicit regression guard against the legacy defect that dropped open clock records) · **PV-PREC-01** = [C38924](https://shopview.testrail.io/index.php?/cases/view/38924) (the report half of the SV-8589 QuickBooks corruption bug) |
| **Export-reflects-filters** | 96 | one contract case per export per report, plus the file-content contracts the build is currently failing (SBC-EXP-04, SBR-EXP-12, TU-EXP-05) |
| **Link / navigation targets** | 26 | **TU-LINK-03** = [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) — the reconciliation guarantee between two reports, with the exact scope under which a mismatch IS a defect |
| **Persistence** | 25 | **PV-COL-04** = [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) (settings applied BEFORE the first fetch, no flash-then-requery) · the defensive-restore negatives, one of which caught a real blank-date-control defect |
| **Permission gating** | 18 | both sides per report, proven live at 200 and 403 |

**What these cases have already earned on one non-final branch:** **109 DEVIATIONS**, including a
one-day-late as-of date across the whole Inventory Value report, four Sales By Customer columns that
silently do not sort while showing a sort arrow, black-on-near-black totals text in dark mode, eight
of ten mobile touch targets under the minimum size, a Technician Utilization export that ignores its
required A–Z order, a silent no-op that instead downloads a file, and a summary figure reading $0.00
against 146 work orders.

---

## IS THE CRITIC RIGHT? — the straight answer, both halves

Stefan Mitrovic (2026-07-27): of the 500+ Report Suite cases *"maybe only 200 test cases are useful,
the rest of them can be a waste"*, AI makes *"more than 70% useless test cases"*, and *"some tests
just do not make sense"*.

### Half one — "more than 70% useless"

**Not supported, and now measured against 100% of the suite rather than a sample.**

- **10 of 478 (2.1%)** are recommended for removal or absorption: 9 MERGE + 1 CUT.
- **The most hostile arithmetic available** — counting every WEAK-KEEP as waste too — gives
  **75 of 478 (15.7%)**.
- To reach his 70% you would have to cut **335 cases**. There are only **75** that any reading
  calls low-value. The remaining 260 would have to come out of the **217 load-bearing cases** —
  the calculation contracts, the permission gates, the reversal exclusions, the credit snapshots.
  **His number cannot be reached without deleting the cases that catch money bugs.**
- His "only 200 are useful" figure is closest to our **217 load-bearing** count, which suggests he
  was counting *load-bearing* rather than *useful*. On that definition he is roughly right about the
  size of the core — and wrong that the rest is waste, because a report suite needs its column
  orders, empty states, permission blocks and export headers checked too.

### Where he IS right, specifically

1. **The 6× shared-shell repetition is the strongest case he has.** **114 cases** assert behaviour
   supplied by one shared component, re-asserted on up to six reports. If you believe the shell is
   one component, roughly 90 of those are redundant.
   **The counter-evidence is real and was produced on this branch:** **SBC-SORT-01** = [C30142](https://shopview.testrail.io/index.php?/cases/view/30142)
   found **four Sales By Customer columns that do not sort**, and **SBR-SORT-01** = [C30241](https://shopview.testrail.io/index.php?/cases/view/30241)
   proved the same gap **does not reproduce on Sales By Representative**. The shell is shared; the
   **wiring is per report**, and only per-report cases found that. Likewise Technician Utilization's
   export ignores the A–Z order its own spec requires while other reports honour theirs.
   **Verdict: this is a genuine trade-off, not slop — and it is the QA lead's call, not ours. If he
   wants the shared-shell family consolidated to one report plus a thin per-report smoke case, that
   is a defensible ~90-case reduction and we will produce the plan.**
2. **The cosmetic tail.** **38 of the 65 WEAK-KEEP** are pure presentation — zebra striping,
   padding, border radius, link underline colour, band-versus-cards. They are specified requirements,
   so they are not invented, but a failure in any of them is cosmetic.
3. **The same throwaway sentence copied into five load-bearing cases** (the Location filter's
   constant width). That is exactly the padding he would point at, and he would be right.

### Half two — "some tests just do not make sense"

**He is right about 32 of 478 (6.7%), and this pass found them — but not in the way he means.**

- **0 of 478 are NONSENSE.** Not one case is unrunnable, self-defeating or domain-nonsense. Every
  case has executable steps, a reachable precondition and a stated pass criterion.
- **7 (1.5%) are CONTRADICTIONS** — and these are the real finding. **Four of the seven assert the
  build's current broken behaviour as the pass condition, so they cannot fail a build that breaks
  the specification.** Two say so out loud. That is worse than a confusing case: it is a test that
  goes green on a bug. **He is right that something does not make sense here, and it is ours.**
- **25 (5.2%) are FIX-WORDING** — a cold tester would be misled by a specific sentence: a hedge
  inside a quoted file name, five pixel measurements with no tool named, steps naming a "Custom"
  button that does not exist.
- **1 case (IV-EXP-10) is the sharpest example of his claim being right**: its expected result IS
  the defect, so a fixed build makes the tester mark it failed.

### The honest summary

> **On waste he is wrong by an order of magnitude: 2.1% recommended for removal, 15.7% on the most
> hostile reading, against his 70%. On coherence he is right about 6.7% — and the most serious
> instances are ours, not the AI's: four cases written to match a broken build instead of the
> specification. We found them, quoted them, and staged the fix.**

---

## Plain-words paragraph for management

We have now read every single one of the 478 report tests from top to bottom — not a sample. Almost
all of them earn their place: 10 should be tidied away, and if you take the harshest possible view of
the low-value ones the number is 75. That is a long way from the claim that most of them are a waste.
Every test can be traced back to a ticket and to the written requirement it comes from, and 422 of
the 478 can be run by a tester with nothing but a browser; the other 56 need a developer tool because
they are about accessibility, PDF layout or behind-the-scenes behaviour, and those should go to a
technical tester. Not one test was found to be nonsense. We did find seven that disagree with each
other or with themselves, and four of those are a real problem of our own making: they were written
to match what the software does today rather than what the specification says, so they would pass
even on a broken build. We have written the corrections and are waiting for approval to apply them.
The tests have already found 109 genuine differences between the software and the specification on
the test build, including money and date errors customers would have noticed. One caution: that test
build is not finished, so every result is provisional and all 478 tests are queued to be checked
again once it settles.

---

## OUTSTANDING — what I need from you

**Nothing in TestRail has been changed by this audit.** Every item below is a recommendation waiting
on a decision.

| # | What I need | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **A ruling on CG-LOCATION-COLUMN-MECHANISM.** The specs say the Location column appears automatically; 7 of our cases say the user switches it on, matching the build. Aligning them to the spec reverses a previous authorised pass's choice, so it is your call. | **QA lead** | 7 cases currently **cannot fail a build that breaks the current spec**. Also visible from outside our work — Vladimir's C38920 asserts the spec model. | 2026-08-04 (found today) |
| 2 | **Authorisation for the FIX-WORDING edit list** — 25 cases, grouped (a)–(g) above. All are wording; none changes what the product should do. | **QA lead** | The two highest-value single fixes are **IV-EXP-10** (its expected result is the bug) and **SBR-ASGN-02** (a hedge inside a quoted file name). | 2026-08-04 |
| 3 | **Authorisation for the merge plan** — 9 groups, each with a named survivor — and the 1 CUT (IV-SCOPE-05). Approvable wholesale or per group. | **QA lead** | 478 → 468. | 2026-08-04 |
| 4 | **A decision on the shared-shell family.** 114 cases assert behaviour from one shared component across six reports. Consolidating is a defensible ~90-case reduction; keeping it is defensible too, and the evidence for keeping it is real (SBC-SORT-01 versus SBR-SORT-01). **I am not choosing this for you.** | **QA lead** | The single biggest number in the "is the critic right?" argument, in either direction. | 2026-08-04 |
| 5 | **A decision on re-verdicting 3 cases from PASS to DEVIATION** — SBR-EXP-06, SBR-VIS-03, SBC-EXP-09, each recorded as passing while the observation written underneath contradicts the case. Ledger becomes 324 PASS / 112 DEVIATION. | **QA lead** | Three false passes in the status ledger. | 2026-08-04 |
| 6 | **Authorisation to extend 2 cases for the surface gaps** — PV-EXP-04 needs a PDF leg; SBR-EXP-11 needs the per-invoice order. A candidate gap is never authored on our own initiative (Rule 6). | **QA lead** | Two small uncovered assertions, same defect class as the 31 July export miss. | 2026-08-04 |
| 7 | **The Jira ticket key for Technician Utilization Story 10** (Column Selection and Persistence, added 2026-07-29). TU tickets stop at SV-8656. | Whoever owns epic **SV-8582** | The only traceability shortfall in 478 cases — TU-COL-01 and TU-LOC-06 cite the nearest story instead of their own. | 2026-07-29 |
| 8 | **A decision on re-reading epic SV-8582** (Tier-2, user-gated per Rule 37). Six stories were reopened on 2026-07-31 and have not been re-read. | **QA lead** | The epic source is **PARTIAL**, so no deliverable here can claim complete source currency. | 2026-07-31 |
| 9 | **Chris Ward's five pending spec edits** — the one-permission model (3 specs), the one-location filter note (4 specs), the over-cap message (2 specs), the "Sales Rep" rename, the IV totals-row label. | **Chris Ward** | 30-plus cases sit deliberately ahead of their spec text; anyone diffing a case against its spec reads it as our error until he edits. | 2026-07-29 / 2026-07-31 |
| 10 | **Confirmation of when branch `sv8582` becomes final.** Build marker `v3.4.1-0ed4433`. | Engineering, via the QA lead | **Everything.** All 478 cases are queued in `../viu-2026-08-03/RECHECK-QUEUE.md` (**OPEN**, now covering 478/478). No Report Suite deliverable — including this audit — may be called VIU-complete until it closes. | 2026-08-03 |
| 11 | **A technical tester for the 56 tool-dependent cases** (30 network panel, 25 screen reader / inspector, 1 QuickBooks). | **QA lead** to assign | Those 56 cannot be executed by the manual QA team unaided. | 2026-08-04 |

**Also worth your attention, needing nothing from you:** the two dark-mode observations that are
inferences rather than observations (IV-VIS-05, WIP-VIS-07) — a five-minute look at both reports in
dark mode closes them, and I have queued them rather than leaving them as evidence.
