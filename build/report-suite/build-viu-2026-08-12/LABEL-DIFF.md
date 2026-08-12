# LABEL DIFF — what the build shows against what our cases say

**Report Suite · build `v3.6-8c28eed` · 12 August 2026 · all six reports opened live**

## 🔴 THE HEADLINE, AND IT IS A NEAR-MISS AVOIDED

**A naive label sweep would have "corrected" four Work In Progress cases into wording no tester will
ever see — on a report that is FINAL, on the morning of release.**

The four WIP tab names are shipped in the markup as **`Approved - partially completed`** (lower
case). Our cases assert **`Approved - Partially Completed`** (title case). Read only from
`textContent`, that is four mismatches on a final report and looks like an obvious repair.

**It is not. Measured live:**

| test-id | `textContent` (shipped string) | `innerText` (**what the tester sees**) | CSS on the label |
|---|---|---|---|
| `tab_wip_approved_partially_completed` | `Approved - partially completed (15)` | **`Approved - Partially Completed (15)`** | `text-transform: capitalize` |
| `tab_wip_approved_not_started` | `Approved - not started (3)` | **`Approved - Not Started (3)`** | `text-transform: capitalize` |
| `tab_wip_completed` | `Completed (4)` | `Completed (4)` | `text-transform: capitalize` |
| `tab_wip_estimates` | `Estimates (15)` | `Estimates (15)` | `text-transform: capitalize` |

**Standing Rule 9 asks for the words as they *appear in the build/UI*, so the tester-visible form
wins and [C30452](https://shopview.testrail.io/index.php?/cases/view/30452),
[C30462](https://shopview.testrail.io/index.php?/cases/view/30462),
[C30464](https://shopview.testrail.io/index.php?/cases/view/30464),
[C30488](https://shopview.testrail.io/index.php?/cases/view/30488) and
[C30490](https://shopview.testrail.io/index.php?/cases/view/30490) are RIGHT. Nothing was changed.**

This is the playbook's Trap 1 firing **in reverse**: the recorded lesson is that a screenshot lies
about casing, and the fix is to read `textContent` — but where a case is describing *what the tester
will read on screen*, `textContent` is the one that lies. **Both readings are needed; neither alone
is the label.**

*Footnote worth having: the downloaded **PDF** titles its page `Work In Progress (Approved -
partially completed)` — the shipped string, because a PDF has no CSS. So a case about the **screen**
wants title case and a case about the **file** wants lower case, and they are both correct.*

## The high-confidence classes, scored exactly

Only classes harvested **completely** are scored. A control that was never opened produces **no
verdict** — *not seen* is never scored as *wrong* (Rule 12).

| Case | Report | Class | Verdict |
|---|---|---|---|
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Work In Progress | four tab names, in order | **MATCH, exact and in order** |
| [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | Work In Progress | 15-item column-selection list, in order | **MATCH, exact and in order** |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress | export menu — `Download (PDF)`, `Download (CSV)` | **MATCH, exact and in order** |
| [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | Sales By Customer | nine column toggles, in order | **MATCH, exact and in order** |
| [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | Sales By Customer | four download items, in order, no `Print` | **MATCH, exact and in order** |
| [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | Technician Utilization | five column toggles (Technician fixed) | **MATCH, exact and in order** |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Technician Utilization | six column headers, in order | **MATCH, exact and in order** |

**7 of 7 scored classes match exactly, all three of them on the FINAL reports.**

## The one ordering difference — and the suite had already handled it

**Sales By Customer and Technician Utilization list the same four download items in DIFFERENT
orders**, which is the sort of thing that generates a spurious defect at 9 a.m.

| Report | order as built |
|---|---|
| Sales By Customer | Summary (PDF) · Expanded View (PDF) · Summary (CSV) · Expanded View (CSV) — *grouped by format* |
| Technician Utilization | Summary (PDF) · Summary (CSV) · Expanded View (PDF) · Expanded View (CSV) — *grouped by view* |

**[C30434](https://shopview.testrail.io/index.php?/cases/view/30434) already says so in the case
itself:** *“The order these four options appear in is NOT part of this check… Do not fail this test
on the order alone.”* — while SBC's [C30159](https://shopview.testrail.io/index.php?/cases/view/30159)
*does* fix the order and matches its own report exactly. **Two correct cases, written to two different
requirements. Nothing to fix.**

## The build's own label inventory, as harvested

| Report | column headers, left to right | rows seen |
|---|---|---:|
| Work In Progress | WO # · Status · Customer · Asset · Advisor · Days Open · Earned · Remaining · Total | 18 |
| Technician Utilization | Technician · Total Hours · WO Hours · Internal Hours · Utilization % · Est. Lost Labor | 4 |
| Sales By Customer | Customer · Date · Inv. Hrs · Labor Invoiced · Labor Margin · Parts Invoiced · Parts Margin · Shop Supplies · Margin · Margin % · Subtotal | 9 |
| Sales By Representative | Date · Invoice · Customer · Status · Inv. Hrs · Labor Invoiced · Labor Margin · Parts Invoiced · Parts Margin · Margin · Margin % · Subtotal | 5 |
| Parts Velocity | Type · Part # · Description · Category · Vendor · Units Sold · Unit Cost · Sell Price · Revenue · Margin · Margin % · Demand · Last Sale · On Hand | 2 |
| Inventory Value | Part # · Description · Category · Vendor · Location · Qty · Unit Cost · Unit Sell · Margin · Margin % · Total Sell · Total Cost | 33 |

Full per-surface dumps — text nodes, buttons, tabs, test-ids, placeholders, aria and the
column-selection menus with each column's default on/off state — are in
`evidence/harvest-all.json`, `evidence/menus2.json` and the per-report screenshots.

## HONEST LIMITS — read this before quoting the 7 of 7

- **367 quoted labels were extracted from the 480 cases and 230 were not found in the harvested
  visible text. Almost all of that is harvest coverage, not case error**: data values (`$1,234.56`,
  `39.7%`, `Acme Corp`), notification captions that only exist after an action, page `<title>`
  strings, and — the big one — **options inside dropdowns that were never opened** (`Last Month`,
  `All locations`, `Clear all`, `Select all`, status and product-type filters). **None of those 230
  is reported as a mismatch, because a label we did not harvest is not a label the build lacks.**
- **The date-range picker's nine named presets were NOT established.** Opening it showed a calendar
  (`Aug 1, 2026 — Aug 11, 2026`) and the preset panel was not captured, so
  [C30102](https://shopview.testrail.io/index.php?/cases/view/30102),
  [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) and their siblings carry **no
  verdict from this pass**.
- **The Location column question is untouched.** Work In Progress's column-selection list has **15
  items and `Location` is not one of them**, while `Inventory Value`'s list does contain it. That
  looks like a finding and is **deliberately not reported as one**: this is the exact open question
  already sitting with Chris Ward on the round-3 sheet, with **three cases already on
  `AUTOMATION: HOLD`** naming it. It also cannot be settled from a single-location scope — *before
  recording anything as absent, you have to be in a state where it should appear*, and this session
  was not.
- **Only the on-screen surface was swept.** PDF and CSV label surfaces were checked only for Work In
  Progress, via the files actually downloaded.

---

## LATE ADDITION — the nine date presets ARE established, and they settle a flagged contradiction

The preset panel *was* reached on a second attempt (it sits beside the calendar; the first capture
was truncated by the day numbers). **The build offers exactly nine, in this order, with no
`All Time`:**

`Last 12 Months` · `This Year` · `Last Year` · `This Quarter` · `Last Quarter` · `This Month` ·
`Last Month` · `This Week` · `Last Week`

Confirmed on **two** reports — Work In Progress and Sales By Customer — so it is the shared
component, not a per-report list. This is **word-for-word Chris Ward's 8 August decision**, and
**five of our six cases in this family name all nine and are therefore correct**:
[C30160](https://shopview.testrail.io/index.php?/cases/view/30160) ·
[C30201](https://shopview.testrail.io/index.php?/cases/view/30201) ·
[C30330](https://shopview.testrail.io/index.php?/cases/view/30330) ·
[C30501](https://shopview.testrail.io/index.php?/cases/view/30501) ·
[C30561](https://shopview.testrail.io/index.php?/cases/view/30561).

**That makes it 12 of 12 scored label classes matching exactly.**

### 🔴 And it hardens yesterday's CONTRADICTION 2 into a one-line decision

**[C30102](https://shopview.testrail.io/index.php?/cases/view/30102)** — *"Date range picker offers
nine periods in the specified order, no All Time"* — **names 0 of the 9**, while all five of its
siblings name all nine. Its expected result is numbered **1, 3, 3**: **item 2 was lost in an edit,
and item 2 was the one that listed the periods.**

So a tester opening it tomorrow finds a case whose **title promises a check its body does not
contain** — on **Sales By Customer, one of the three FINAL reports**.

**Deliberately NOT written by this pass.** Yesterday's quality gate examined it and recorded the
decision to leave it for the QA lead as *"a copy-paste the QA lead can authorise in one line"*, and a
recorded decision stands (Rule 33). **What this session adds is the evidence that makes that one line
trivial to give:** the nine periods are now **live-confirmed on two reports**, in exactly the order
five sibling cases already state, so the restore is a verbatim copy of a sentence we already hold —
not authoring.
