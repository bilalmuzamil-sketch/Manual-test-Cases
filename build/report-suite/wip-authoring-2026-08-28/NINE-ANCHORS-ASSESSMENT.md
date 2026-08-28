# WIP — Coverage Assessment of the Nine Never-Assessed Anchors

**Project:** Report Suite · Work In Progress report
**Date:** 2026-08-28 · **Pass type:** read-only assessment. **No TestRail writes. No cases created.**
**Source:** WIP spec **version 28** (2026-08-24, version message *"Margin %% denominator + precision
(SV-9423)"*), reused from the capture at
`build/report-suite/source-verify-2026-08-26/specs/wip.json` — **not refetched** (Rule 80/81).
**Epic:** SV-8582.

---

## 1 · Why these nine were never assessed

`verify.py`'s anchor regex could not match a **lettered story number**. It recognised `S4-R1` but not
`S4a-R1`, so the whole of **Story 4a ("Completed Work Orders Hold No Remaining", raised by SV-9119)**
and **Story 5a ("Locked Figure Wording and Tab Vocabulary", decisions from the 2026-08-13 design
review)** fell out of the coverage arithmetic silently. All nine anchors **do exist in v28** — they
were never phantom requirements.

## 2 · Method — content search, not citation search

Because the whole point is that **citations were unreliable**, coverage was decided by **searching the
body text of all 97 of our live WIP cases** (Preconditions + Steps + Expected) for each requirement's
*assertions*, then reading the candidate cases in full. Citation was used only as corroboration.

**Citation check first, for contrast — only 1 of the 9 anchors is cited anywhere in our WIP suite:**

| Anchor | Cited in any case's refs/body? |
|---|---|
| S4a-R1 | no |
| **S4a-R2** | **yes** (C43821) |
| S4a-R3 | no |
| S4a-N1 | no |
| S4a-N2 | no |
| S5a-R1 | no |
| S5a-R2 | no |
| S5a-R3 | no |
| S5a-R4 | no |

**Content search found coverage for eight of the nine.** Citation alone would have reported eight
false gaps — which is exactly the failure mode Rule 20/64 warns about.

---

## 3 · Verdicts

| Anchor | Verdict | Covering cases |
|---|---|---|
| S4a-R1 | **COVERED** | C45205 (primary), C43821 |
| S4a-R2 | **COVERED** | C43821 |
| S4a-R3 | **PARTIAL** | C30489, C30490 |
| S4a-N1 | **COVERED** | C45205 |
| S4a-N2 | **PARTIAL** | C30490 (implied), C30489 |
| S5a-R1 | **COVERED** | C30493 |
| S5a-R2 | **COVERED** | C30493 + C30491 |
| S5a-R3 | **COVERED** | C30452 |
| S5a-R4 | **PARTIAL** | C43821 (WIP); C43822–C43827 (SBC); C43828–C43831 (SBR) |

**Totals: 6 COVERED · 3 PARTIAL · 0 NOT COVERED · 0 NOT A REQUIREMENT.**

Unlike S7-R7a and S9-E2, **none of these nine turned out to be change-log prose** — every one carries
at least some testable assertion, though S5a-R1 and S5a-R4 are substantially decision/provenance
narrative wrapped around a small testable core (noted per anchor below).

---

## 4 · Anchor by anchor

### S4a-R1 — COVERED

> **Verbatim (v28):** "When a work order is completed, its whole approved value moves to Earned and its
> Remaining becomes $0.00, for both labor and parts (S4-R15a, S4-R16a, S4-R18a)."

**Covered by [C45205](https://shopview.testrail.io/index.php?/cases/view/45205)** — *"Completing a work
order moves all approved labor and parts to Earned"*, section *WIP — Earned & Remaining*.

The case seeds an approved labor line quoted 4.0 h / $400.00 with only 1.0 h clocked, plus an approved
parts line of 4 × $50.00 with only 2 units received, reads the row on the *Approved - partially
completed* tab, sets the work order to Complete, and re-reads on the *Completed* tab. Its Expected
asserts Labor Earned $400.00 "whatever hours were clocked to it", Labor Remaining $0.00, Parts Earned
$200.00 "whatever quantity was received", Parts Remaining $0.00, and row Remaining $0.00 — i.e. the
whole approved value for **both labor and parts**, which is precisely S4a-R1.

C45205 cites `S4-R15a; S4-R16a; S4-R18a` — the three anchors S4a-R1 itself points at — plus SV-9119,
the ticket that raised Story 4a. **The coverage is real; only the S4a-R1 citation is absent.**

### S4a-R2 — COVERED

> **Verbatim (v28):** "A row on the Completed tab therefore shows Earned equal to its Total less
> Adjustments, and Remaining of $0.00."

**Covered by [C43821](https://shopview.testrail.io/index.php?/cases/view/43821)** — *"Completed tab:
Earned equals Total minus Adjustments, Remaining $0.00"*. This is a verbatim-grade match and the case
already cites `S4a-R2` explicitly, quoting the requirement text in its provenance line. It additionally
asserts the tie-out `Total = Earned + Remaining + Adjustments`. **The only anchor of the nine that was
already correctly cited.**

### S4a-R3 — PARTIAL

> **Verbatim (v28):** "The summary strip and the table always agree for the same work order. No figure
> may report Remaining that the row does not show, and no row may show Remaining that no figure counts."

**What is covered.** [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) (*"Each
per-stage figure equals the matching tab's money total"*) proves strip-vs-table agreement **at tab
aggregate level** — Work Orders Not Started = the *Approved - Not Started* tab's Earned + Remaining;
Completed Work on Open Work Orders and Remaining Work on Open Work Orders = the *Approved - Partially
Completed* tab's Earned and Remaining; Work Orders Ready to Invoice = the *Completed* tab's Earned.
[C30489](https://shopview.testrail.io/index.php?/cases/view/30489) proves the strip's internal
arithmetic (`Remaining Work = Work Orders Not Started + Remaining Work on Open Work Orders`).

**What is missing.** S4a-R3 is stated **per work order** ("always agree for the *same work order*"),
and it is a **two-way no-orphan rule**. No case asserts the reconciliation for an individual work
order, and in particular none does so **for a completed work order** — which is the Story 4a context
in which S4a-R3 sits. A new case would need to take one identified completed work order, read its row
Remaining ($0.00), and prove that **no** summary figure attributes any Remaining to that specific work
order (the "no figure may report Remaining that the row does not show" half), and conversely that a
row showing Remaining is counted by at least one figure.

### S4a-N1 — COVERED

> **Verbatim (v28):** "A completed work order whose approved labor was clocked for less than its quoted
> hours still shows its full quoted labor value in Earned. Example: one approved line quoted at 2.00
> hours and $270.00, with 0.01 hours clocked, completed — Earned $270.00, Remaining $0.00, and Ready to
> Invoice counts $270.00, not $1.35."

**Covered by [C45205](https://shopview.testrail.io/index.php?/cases/view/45205).** Its seeded scenario
is the same shape (4.0 h quoted / 1.0 h clocked rather than the spec's 2.00 h / 0.01 h), and its
Expected states the rule in the general form the requirement asserts — *"Labor Earned now shows the
full quoted value of every approved labor line … whatever hours were clocked to it. Clocked time stops
driving the number once the work order is completed"* — and closes with the negative-case point
explicitly: *"An under-clocked or part-received work order jumping to its full approved value on
completion is the expected result here, not a data error."*

**Note (not a gap in the requirement's assertion, but worth the QA lead's eye):** C45205 does not carry
the spec's Ready-to-Invoice half of the example (*"Ready to Invoice counts $270.00, not $1.35"*). That
figure-level consequence is reachable through C30490's Completed-tab-to-Ready-to-Invoice equality, so
it is chained rather than absent. Contrast [C30475](https://shopview.testrail.io/index.php?/cases/view/30475)
(*"Labor Earned is the clocked share of each approved line's quoted value"*), which is the **open-tab**
rule (S4-R15) and is consistent with, not contradictory to, S4a-N1.

### S4a-N2 — PARTIAL

> **Verbatim (v28):** "A completed work order never contributes to Remaining Work, Work Orders Not
> Started, or Remaining Work on Open Work Orders, because those figures read the two Approved tabs only
> (S5-R4, S5-R6)."

**What is covered.** The exclusion is **implied** by
[C30490](https://shopview.testrail.io/index.php?/cases/view/30490), which binds each of those three
figures to an Approved tab's total, and by
[C30489](https://shopview.testrail.io/index.php?/cases/view/30489)'s arithmetic identity for Remaining
Work.

**What is missing.** No case makes the **negative assertion directly**, and this anchor is filed as a
Negative Case for a reason. A new case would need to record the three figures (Remaining Work, Work
Orders Not Started, Remaining Work on Open Work Orders), complete a work order that previously
contributed to them, reload, and assert that **all three figures fall by exactly that work order's
former Remaining and that the completed work order contributes $0.00 to each** — with Work Orders
Ready to Invoice rising instead. The current cases prove the figures equal their tab totals; they never
prove a completed work order cannot leak into an Approved-tab figure.

### S5a-R1 — COVERED

> **Verbatim (v28):** "The Remaining Work explanation is the re-worded text carried in S5-R12, signed
> off by Fabian in the design review. The wording locked in the original naming meeting described
> started-only work, which was wrong: the figure also includes work orders nobody has started."

**Covered by [C30493](https://shopview.testrail.io/index.php?/cases/view/30493)** — *"Each summary
figure's information icon reveals its plain explanation"*. Expected item 2 asserts the Remaining Work
tooltip word-for-word: *"The total value of all approved work that has not yet been completed,
including work orders that have not started and incomplete work order lines on work orders already in
progress."* That is the re-worded text, and it carries the correction S5a-R1 exists to record (it
explicitly includes work orders that have not started).

C30493 already cites `S5-R12` — the anchor S5a-R1 forwards to — and its refs even record *"Fabian
signed off Remaining Work"*. **S5a-R1 is a pointer plus rationale rather than an independent
requirement; its testable content is fully carried by S5-R12 and is covered.** No new case is needed.

### S5a-R2 — COVERED

> **Verbatim (v28):** "The Estimates explanation is locked verbatim as: 'The total value of all estimate
> lines that have not yet been approved, including lines awaiting authorization on open work orders.'
> It counts per line, not per work order, and includes lines awaiting authorization on work orders that
> are otherwise approved."

Covered in **both halves**:

- **The locked wording** — [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) Expected
  item 7 states the Estimates tooltip verbatim, ending *"…including lines awaiting authorization on open
  work orders."* — an exact match to the spec string.
- **The behaviour** — [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) (*"The
  Estimates figure is the Estimates tab total, shown at full opacity"*) asserts the figure equals the
  total of unapproved estimate lines *"including lines awaiting authorization on open work orders
  **(counted per line, not per work order)**"*, and additionally that Estimates is excluded from Total
  Completed Work and Remaining Work. C30491 also carries the divergence sentence recording that the
  earlier spec had this figure muted and counted **per work order**, superseded by the 2026-08-13 design
  review — which is exactly the change S5a-R2 locks.

### S5a-R3 — COVERED

> **Verbatim (v28):** "The tab labels stay as they are — 'Approved - partially completed', 'Approved -
> not started', 'Completed', 'Estimates' — even though the summary figures were renamed. The tabs name
> work-order states; the figures name money. Aligning the two vocabularies is recorded as follow-up
> work, not done in this wave (Chris, 2026-08-13)."

**Covered by [C30452](https://shopview.testrail.io/index.php?/cases/view/30452)** — *"Four tabs in a
fixed order with the partially-completed tab selected"*. Its Expected asserts all four labels verbatim
and in order: *"Four tabs are shown, labeled in this order: 'Approved - partially completed', 'Approved
- not started', 'Completed', and 'Estimates'"*, each with its bracketed count, and the
partially-completed tab selected by default.

This is the **invariant** S5a-R3 protects: the tab labels must **not** move when the summary figures were
renamed. The "aligning the two vocabularies is follow-up work" clause is parked-decision prose and is
correctly not testable.

### S5a-R4 — PARTIAL

> **Verbatim (v28):** "The Adjustments treatment covers this report, Sales By Customer, and Sales By
> Representative for this wave. Sales By Representative already specifies an Adjustments column and its
> calculations; those stay exactly as specified and are not removed (Chris, 2026-08-14). Other reports
> that total Labor and Parts only continue to exclude work-order-level fees and discounts; that
> inconsistency is known and parked rather than fixed here (Chris, 2026-08-13)."

**What is covered — the affirmative scope, on all three named reports:**

| Report | Cases |
|---|---|
| WIP | C43821 |
| Sales By Customer | C43822, C43823, C43824, C43825, C43826, C43827 |
| Sales By Representative | C43828, C43829, C43830, C43831 |

The SBR set in particular discharges the *"those stay exactly as specified and are not removed"* clause:
C43828 (Adjustments column between Shop Supplies and Margin), C43829 (signed net of invoice-level fees
and discounts), C43830 (row ties out with Shop Supplies and Adjustments included) and C43831
(Adjustments among the eight toggleable columns).

**What is missing — the negative invariant for the *other* reports.** The clause *"Other reports that
total Labor and Parts only continue to exclude work-order-level fees and discounts"* has **no asserting
case**. A content search of every non-WIP Report Suite case found Adjustments referenced only in SBC
(13 cases) and SBR (15 cases), plus one incidental Parts Velocity hit (C30370, about null triggers, not
about adjustments). A new case — or a checked assertion added to existing Technician Utilization,
Parts Velocity and Inventory Value cases — would need to assert that those reports show **no**
Adjustments column and that their Labor/Parts totals **exclude** work-order-level fees and discounts,
so the parked inconsistency is pinned rather than left to drift.

The *"inconsistency is known and parked rather than fixed here"* sentence is decision prose and is
correctly not testable.

---

## 5 · What this changes about the coverage figure

Nine anchors that the tooling reported as un-assessed are in fact **six fully covered, three partially
covered, none absent**. The real defect was **citation drift, not missing tests**: eight of the nine
are covered by cases that never name them. Recommended follow-up, **for approval — nothing was
written**:

1. **Three candidate new cases** (S4a-R3 per-work-order reconciliation; S4a-N2 direct negative on the
   three Approved-tab figures; S5a-R4 negative invariant for the non-adjustment reports).
2. **Eight citation repairs** adding the S4a-/S5a- anchors to the provenance lines of C45205, C30489,
   C30490, C30493, C30491, C30452 and the SBC/SBR Adjustments sets — noting that under **Rule 41**
   touching a case means re-verifying the whole case, so this is a sized pass, not a surgical edit.
3. **Re-run `verify.py`** after the regex fix across **every** report's spec, since the lettered-anchor
   blind spot was generic and Story 4a/5a may not be the only casualties — S10-R5a, S4-R15a, S4-R16a,
   S4-R18a, S7-R7a, S7-R8a, S9-R10a, S9-R10b and S9-E1/E2 all use the same lettered form.

---

## OUTSTANDING — what I need from you

1. **Approval to author the three candidate cases** listed above (S4a-R3, S4a-N2, S5a-R4). Rule 62's
   hold is Jira tickets only and TestRail case creation is not held, but this pass was ordered
   read-only, so nothing was created and I am holding for your go-ahead.
2. **A decision on the eight citation repairs** — whether to spend a Rule 41 full re-verification pass
   on them now, or to batch them into the next WIP authoring wave.
3. **Confirmation that WIP v28 is still current.** It was captured 2026-08-24 and reused here without
   refetching, per your standing instruction not to re-spend quota on source checks unasked.

---

## 6 · CLOSED 2026-08-28 — what was approved and done

**The QA lead approved recommendations 1 and 2 on 2026-08-28. Both are done and verified.**

| Recommendation | Status |
|---|---|
| 1 · Three candidate cases (S4a-R3, S4a-N2, S5a-R4) | **DONE** — [C45208](https://shopview.testrail.io/index.php?/cases/view/45208), [C45209](https://shopview.testrail.io/index.php?/cases/view/45209), [C45210](https://shopview.testrail.io/index.php?/cases/view/45210); all three verified on the rendered page and PASS the mechanical readiness gate; all three synced into run 359 union-only |
| 2 · Eight citation repairs | **DONE** — eight anchors cited across seven cases (C45205, C30489, C30490, C30493, C30491, C30452, C43821); `refs` was the only field sent and all bodies are byte-identical |
| 3 · Re-run `verify.py` with the lettered-anchor regex fix across every report | **STILL OPEN** — not in this batch |

**All nine anchors are now cited in the WIP suite; before this pass only one was.** The three PARTIAL
verdicts in §3 are now COVERED: **S4a-R3** by C45208, **S4a-N2** by C45209, **S5a-R4** by C43821
(affirmative) plus C45210 (the negative invariant).

Full evidence: `CREATED-AND-REPAIRS-2026-08-28.md`.
