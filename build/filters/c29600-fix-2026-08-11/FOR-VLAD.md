# For Vlad — two Filters cases were edited on 11 August 2026

## THE HEADLINE, FIRST

**Nothing an automated check evaluates has changed on either case.**

We corrected **which document each case cites** as the source of its expected behaviour. We did **not**
change what either case asserts, what it does, or what counts as a pass. **Titles, preconditions, steps
and every expected outcome are byte-identical to what was there before** — verified field by field, not
assumed.

**So no automated check can break as a result of this, and nothing needs adjusting on your side.**
This note exists because one of the two cases is flagged **Automated** in TestRail, and the standing
rule is that you get told when we touch one — not because there is anything to react to.

---

## THE TWO CASES

| Case | Title | TestRail automation flag |
|---|---|---|
| **[C29600](https://shopview.testrail.io/index.php?/cases/view/29600)** | *Status and Customer filters together show only work orders matching both* | **`custom_atmstatus = 3` — AUTOMATED** |
| **[C29632](https://shopview.testrail.io/index.php?/cases/view/29632)** | *A combined multi-filter request returns only work orders matching all filters* | **`custom_atmstatus = 1` — not automated; carries the text marker `AUTOMATION: READY`, so it is queued for you** |

*(A note in passing: the task we were given said both were `atmstatus = 3`. Read live, only C29600 is.
Recorded so nobody carries the wrong fact forward.)*

---

## WHAT CHANGED, EXACTLY

### Changed on both cases — two fields only

1. **`refs`** — the traceability field. Both cases were citing **`S8-R3`** for their headline claim.
   `S8-R3` turns out to be the **empty-state requirement** (*"When the combination of active filters …
   produces no matching records, the table shows an empty state …"*). It presupposes that filters
   combine; it never says **how**. That citation is gone from both, replaced by the place the rule is
   actually written down — the **engineering technical design**, §1.8 (*"…return the right WOs **and AND
   across fields**"*) and §0.3 (the repeated-`eq` convention, which is literally where C29632's request
   shape comes from).

   On C29600 one more `refs` correction: it credited *"§2 Feature Overview **(multi-criteria)**"*, and
   the phrase *multi-criteria* is not in §2 and never has been, in any version. §2 **does** source the
   chip and Clear-filters parts, so it is now cited for what it really says.

2. **The provenance material at the end of Expected Results** — the source line, plus a short plain
   note saying which part of the assertion comes from which document. C29600 previously had **no
   provenance line and no automation marker at all**; it now has both.

### NOT changed — anything a check evaluates

| | C29600 | C29632 |
|---|---|---|
| Title | **unchanged** | **unchanged** |
| Preconditions | **unchanged** | **unchanged** |
| Steps | **unchanged** | **unchanged** |
| **The assertion itself** | **unchanged, byte for byte** (107 chars) | **unchanged, byte for byte** — items 1, 2 and 3 (305 chars) |
| `custom_atmstatus` | **3 → 3** | **1 → 1** |
| `custom_automation_type` | **0 → 0** | **0 → 0** |
| Automation marker | added: `AUTOMATION: READY` (it had none) | **`AUTOMATION: READY`, unchanged** |
| Existing build stamp | n/a (never had one) | **kept byte-identical** |
| Section | 4117, unchanged | 4124, unchanged |

**The assertions, verbatim and still exactly as they were:**

> **C29600:** *"Two active chips, a visible Clear Filters button, and exactly the intersection of both
> filters in the table"*

> **C29632:** *"1. One request carries both filters together (both statuses and the customer).
> 2. The response returns customer A's Estimate and Approved work orders only.
> 3. Customer B's work orders are absent - the customer filter and status filter both restrict the
> result, while the two statuses combine as either-or."*

---

## WHY WE TOUCHED THEM AT ALL

Both cases assert that two different filter buttons **narrow together** — an intersection. We went
looking for the requirement behind that and found it **is not in the product description**, in any
version from v4 to v19. Boolean `AND` appears **exactly once** in the whole specification, and it is
about *search versus filters*, not filter versus filter.

**But it is written down — in your side's technical design.** So the cases were never wrong and were
never unsourced; **they were pointing at the wrong document.** That is what got fixed.

Full working: `build/filters/c29600-sourcing-2026-08-11/FINDINGS.md`. Before-and-after with every
source quoted: `build/filters/c29600-fix-2026-08-11/CHANGES.md`.

---

## THE ONE THING THAT COULD AFFECT YOU LATER — flagged now, not hidden

We have asked Branko to add the rule to his own product description, because a rule that lives only in
an engineering note can be changed by accident with nobody noticing. **That question is drafted and
not yet sent.**

- **If he confirms the rule** (the expected answer, and what the product does today) — **nothing
  changes for you at all.** Only the source line on the two cases gets re-stamped to name his
  description instead of the technical design.
- **If he answers differently** — then both cases are wrong on their headline assertion, both would be
  corrected, **and you would be told before anything is touched.** That is the only branch in which
  your automation is affected, and it has not happened.

---

## PROOF, IF YOU WANT IT

- Both writes returned **HTTP 200** and were **re-read and compared field by field** against the
  intended payload: **30 fields compared per case, 0 mismatches, 0 collateral changes.**
- **The only fields that moved on either case are `custom_expected` and `refs`.**
- **Run 352 was proven untouched by content**: `include_all` still false, **114** tests, **all 473**
  result records present **by id**, **0** new results, **0** graded-field changes, counters unchanged
  at 65 passed / 7 failed / 42 untested. The only movement is `case_refs` on 12 records, which is
  TestRail's read-time echo of the `refs` edit and traces to exactly those two cases — **no run write
  was made, and no result was logged anywhere.**
- **No case was added or deleted; no other Filters case was touched** (119 before, 119 after).
- **No Jira ticket was created or edited.**

Operation-by-operation log: `build/filters/c29600-fix-2026-08-11/testrail-execution-log.md`.
