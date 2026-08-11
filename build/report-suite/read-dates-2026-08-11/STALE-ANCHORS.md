# Report Suite — anchors and requirements that MOVED, 2026-08-11

**Recorded for a later Rule-43 coverage re-derivation. Nothing here was re-verdicted, and no
assertion was changed.** A version pin is not a licence to change an expectation: this pass
corrected which revision each case *cites*, and where that revision's own text has moved, the
consequence is a **coverage question**, not a wording edit.

**All of this needs the QA lead's go-ahead** — it is requirement reconciliation (Rule 43), not
provenance.

---

## 1 · The headline: NO case is pinned to a requirement that no longer exists

| Check | Result |
|---|---|
| Anchors cited by our 476 cases, checked against **their own report's** live specification | **0 missing** |
| Anchors that disappeared between the pinned version and the live one, across all six specs | **0** |
| New anchors added | **2** — Sales By Customer `S3-R6a`, Parts Velocity `S6-R12` |

Anchors were read from **both** the tester-facing provenance text **and** `refs`, because a case can
cite one in either place and checking only one is a sample, not a check.

---

## 2 · What actually changed in each specification, and who cites it

### Sales By Customer v16 → v17 — the Product Type filter was redesigned

The largest change of the five, and the only one that alters a user-visible control. Chris Ward's
version message names it: *"SV-9074: Product Type filter to multi-select toggles"*.

| Anchor | Was (v16) | Is (v17) |
|---|---|---|
| `S3-R1` | *"A 'Product Type' **dropdown** is visible in the report toolbar."* | *"A 'Product Type' **filter** is visible… **It is a multi-select**, matching the behavior of the Customer and Location filters."* |
| `S3-R2` | *"offers **exactly three options**, in this order: 'Parts & Service,' 'Parts only,' 'Service only.'"* | *"**pins two action rows at the top — 'All products' and 'Clear all' — above two toggle options: 'Parts' and 'Services.'**"* |
| `S3-R3` | *"'Parts & Service' is the **default selection** on first load."* | *"**Both toggles are selected (all products)** on first load."* |
| `S3-R4` | *"When 'Parts & Service' is selected, no product-type filter is applied."* | as before, **plus** *"the exports' filter summary line reads 'Parts & Service.'"* |
| `S3-R5` | *"When '**Service only**' is selected…"* | *"When **only 'Services'** is selected… **the exports' filter summary line reads 'Service only.'**"* |
| `S3-R6` | *"When '**Parts only**' is selected…"* | *"When **only 'Parts'** is selected… **the exports' filter summary line reads 'Parts only.'**"* |
| `S3-R6a` | **did not exist** | *"When neither toggle is selected (after 'Clear all'), the report shows the empty-state message (Story 17) until a toggle is selected."* |

**Cases citing these anchors:**

| Case | Cites |
|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) — *"Product Type: three options with Parts & Service default"* | S3-R1, S3-R2, S3-R3, S3-R4, S3-R5, S3-R6 |
| [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | S1-N1 |
| [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | S1-N1 |

**🔴 C30107 is the one that matters, and its own title gives it away.** It asserts *"three options
with Parts & Service default"* — a **single-select dropdown with exactly three named options** — and
the requirement it cites now describes a **multi-select with two toggles plus two pinned action
rows**. This is not a wording drift; the control it tests has been redesigned. It is also flagged
**Automated** (`custom_atmstatus = 3`), so an automated check may be asserting the superseded shape.

**Note the Rule-42 angle:** C30107's expectation is a **closed enumeration** — *"exactly three
options, in this order"* — which is precisely the shape Rule 42 warns is a time bomb. The pin is now
correct at v17, which is what makes the mismatch *findable*; before this pass it pointed at v16 and
looked consistent.

**C30099 and C43546 are almost certainly unaffected**: `S1-N1`'s own definition is byte-identical
between v16 and v17 (the span difference is a neighbouring cross-reference), and it is a
navigation-access negative case unrelated to the Product Type filter.

### Sales By Representative v17 → v18 — the Location column rule was rewritten

| | |
|---|---|
| Was | shown *"only when the current view spans more than one location… When the view is scoped to a single location it is hidden"* — **automatic, driven by the current selection** |
| Is | shown *"to any user with access to more than one location: it appears by default and can be toggled on or off from the column selector, whatever the current location selection, and a user with access to only one location never sees it"* — **access-gated and user-toggleable** |

**Cases citing `S21-R7`:** [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) ·
[C30234](https://shopview.testrail.io/index.php?/cases/view/30234) ·
[C30265](https://shopview.testrail.io/index.php?/cases/view/30265) ·
[C38913](https://shopview.testrail.io/index.php?/cases/view/38913).
Citing `S1-R7`: [C30197](https://shopview.testrail.io/index.php?/cases/view/30197) — its own
definition is unchanged, so it is very likely unaffected.

### Parts Velocity v5 → v6 — same Location column rewrite, plus a brand-new export cap

The Location wording moved exactly as above. **And a requirement was added that did not exist
before:**

> **`S6-R12`**: *"An export is capped at a maximum of 10,000 rows in the current filtered set. When
> the filtered set exceeds the cap, neither the PDF nor the CSV is produced and the user is shown the
> message: 'This report is too large to export. Narrow the date range or filters, then try again.'"*

**🔴 `S6-R12` is cited by NO Parts Velocity case, because it did not exist when they were written.**
That is a **candidate coverage gap** with a verbatim message string to assert. It is worth noting
that the Report Suite record already treats the 10,000-row cap as deliberate and epic-backed
([SV-8591](https://shopview.atlassian.net/browse/SV-8591)), and separately records that *"none of the
six specifications mentions it"* — **that second half is now out of date for Parts Velocity**, which
does mention it, in full, with the exact message.

**Cases citing the changed anchors:** [C30333](https://shopview.testrail.io/index.php?/cases/view/30333)
(S2-R6) · [C30341](https://shopview.testrail.io/index.php?/cases/view/30341) and
[C30342](https://shopview.testrail.io/index.php?/cases/view/30342) (S3-R1a) ·
[C30351](https://shopview.testrail.io/index.php?/cases/view/30351) (S4-R1). For S2-R6 and S3-R1a the
anchor's own definition is unchanged, so those three are likely unaffected;
**[C30352](https://shopview.testrail.io/index.php?/cases/view/30352)** sits on the Location-column
sentence itself and is flagged **Automated**.

### Work In Progress v10 → v11 — a whole new Key Decision about bucketing

Chris Ward's message: *"QA-cycle decisions: line-state bucketing, fixed-price valuation, core …"*.
The inserted decision, verbatim:

> *"Buckets are keyed on line state, not work-order status. Every line's value sits in exactly one
> bucket: an unapproved line counts in Estimates, an approved untouched line in Approved - not
> started, a started line in Approved - partially completed (split Earned/Remaining), and a completed
> not-invoiced line in Completed. The buckets are disjoint and always sum to the work order's total
> quoted value."*

The changelog entry adds two more decisions: **fixed-price lines valued at their fixed amounts with
binary earning on line completion**, and **core charge included** in the valuation.

**🔴 This is a substantive semantic change to how the report's central numbers are computed, and it
is the change most likely to affect real assertions.** Cases citing `S9-E1`:
[C30511](https://shopview.testrail.io/index.php?/cases/view/30511) ·
[C30516](https://shopview.testrail.io/index.php?/cases/view/30516) ·
[C38916](https://shopview.testrail.io/index.php?/cases/view/38916). But the exposure is **wider than
those three**: the bucketing rule governs the tab-mapping and totals cases generally — for example
[C30462](https://shopview.testrail.io/index.php?/cases/view/30462) (*"Status-to-tab mapping:
Estimate, Complete, In Progress…"*, **Automated**) and
[C30488](https://shopview.testrail.io/index.php?/cases/view/30488) (*"Total Earned is the hero figure
and equals the started-state…"*, **Automated**), neither of which cites `S9-E1` by name.

**Establishing that exposure properly is a Rule-43 re-derivation and was not attempted here.**

### Inventory Value v4 → v5 — the same Location column rewrite

`S7-R6`, identical in kind to the Sales By Representative and Parts Velocity changes. Cases citing
it: [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) ·
[C30554](https://shopview.testrail.io/index.php?/cases/view/30554) ·
[C30580](https://shopview.testrail.io/index.php?/cases/view/30580) ·
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917). Citing `S11-R6` (snapshot
retention, own definition unchanged): [C30609](https://shopview.testrail.io/index.php?/cases/view/30609)
· [C30610](https://shopview.testrail.io/index.php?/cases/view/30610).

### Technician Utilization — nothing moved

Already at its live version 7. No diff to run, no cases affected.

---

## 3 · A prior pass had already spotted the Location-column exposure and HELD 16 cases

`build/report-suite/source-accuracy-remaining-2026-08-11/` planned the same re-pins for three
reports and **held 16 cases** whose assertions turn on the Location-column rule. **That plan was
never executed** — the stale pins were still live when this pass began. Its held list is worth
carrying forward, because it was reached independently:

**C30218, C30226, C30265, C30278, C30279, C30285, C30286, C30342, C30352, C30353, C30551, C30554,
C30588, C38913, C38914, C38917.**

**Those 16 were re-pinned and read-dated by this pass like the other 460.** That is deliberate and
worth being explicit about: **re-pinning a case whose assertion may be wrong makes the problem more
visible, not less** — the case now points at the revision it must be judged against. What was *not*
done is re-verdicting them.

---

## 4 · One case now names a version it no longer pins

**[C30518](https://shopview.testrail.io/index.php?/cases/view/30518)** is pinned to Work In Progress
**v11** and its body still reads:

> *"One caution for anyone checking the source: **version 10** of that specification uses the number
> S9-R11 for two different requirements — one about a size limit on downloads, one about the success
> message."*

**The caution is still true** — S9-R11 occurs twice in v11 as well as v10, checked directly — so
nothing is misleading a tester today. But the sentence names a revision the case no longer cites. It
needs a one-word wording review, which is outside a provenance pass's charter.

---

## 5 · What is owed

1. **A Rule-43 requirement→case re-derivation for all six reports** against the live versions, in
   both directions. The pins are now correct, which is the precondition for that work being
   meaningful.
2. **A coverage verdict for `S6-R12`** (Parts Velocity export cap) — a new requirement with a
   verbatim message and, as far as this pass can tell, no case.
3. **A decision on C30107**, which asserts a control that has been redesigned and is flagged
   Automated.
4. **A judgement on the Work In Progress bucketing change**, whose reach extends past the three cases
   that cite `S9-E1` by name.
5. **The one-word fix to C30518.**
