# Every label mismatch, both texts side by side, with its class

**Build `v3.6-3e9dd6d`, read 2026-08-11.** Method: `build/report-suite/label-vs-behaviour-2026-08-11/`.

| Class | Where the string sits | What we did |
|---|---|---|
| **A** | a label in **Preconditions or Steps** | **used the build's wording** |
| **B** | a label in **Expected Results that a numbered requirement PINS** | **kept the spec's wording**, recorded the build difference |
| **C** | a label in **Expected Results merely describing what the tester will see** | **used the build's wording**; the assertion untouched |

**Rule 45(e) is applied throughout: no verdict below is given without both texts quoted.**

---

## CORRECTED — class A (a step told the tester to tap a control that does not exist under that name)

### The mobile apply button: `Apply filters` → `Apply Filters`

**Build, read live at 390 × 844:**
```
mobile_all_filters_sheet = "All Filters | close | Status | … | Asset on Site | Apply Filters"
apply_filters            = "Apply Filters"
```
The `data-test-id` is `apply_filters`; the **visible label carries a capital F on both words**.

**Spec v19 S12-R6, verbatim:**
> *"Unlike desktop, mobile does not filter in real time. Selections made inside a dropdown / bottom
> sheet are staged, and the table updates only when the user taps an **"Apply filters"** button
> within the sheet."*

**Why this is class A / C and not class B — and the contrast that settles it.** S12-R6 names the
button in order to **identify** it while asserting *deferred apply*. It does not argue for the
wording. **S11-R7, in the same specification, shows what pinning actually looks like:**

> *"a **"Back to my view"** action is available … **The label is deliberately "my view" rather than
> "my filters"**, since the action affects both filters and search"*

That requirement **argues for its own string**; S12-R6 does not. So the Back-to-my-view label is
class B and stays as the spec writes it, while the Apply button is a locator and moves to the build.

| Case | Field | Was | Now | Class |
|---|---|---|---|---|
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Steps | `Tap the 'Apply filters' button.` | `Tap the 'Apply Filters' button.` | A |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Steps | `Tap the 'Apply filters' button inside the sheet` | `Tap the 'Apply Filters' button inside the sheet` | A |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Steps | `then tap 'Apply filters'.` | `then tap 'Apply Filters'.` | A |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | Steps | `and tap 'Apply filters'.` | `and tap 'Apply Filters'.` | A |
| [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | Steps | `Choose Yes and tap 'Apply filters'.` | `Choose Yes and tap 'Apply Filters'.` | A |
| [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | Expected | `A sticky blue 'Apply filters' button` | `A sticky blue 'Apply Filters' button` | C |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Expected | `After 'Apply filters' the sheet closes` | `After 'Apply Filters' the sheet closes` | C |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Expected | `An 'Apply filters' button is shown inside the sheet.` | `An 'Apply Filters' button is shown inside the sheet.` | C |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Expected | `After 'Apply filters' the list shows` | `After 'Apply Filters' the list shows` | C |

**Nothing about deferred apply changed.** The cases still assert that the table updates only on the
button, which is exactly S12-R6.

---

## CORRECTED — class C (an illustration that would have failed a CONFORMING build)

### The active chip label

**Build, read live:**
```
one value    ->  "Status\n: Estimate\nkeyboard_arrow_down"
three values ->  "Status\n: Estimate, +2\nkeyboard_arrow_down"
```
So the rendered strings are **`Status : Estimate`** and **`Status : Estimate, +2`** — a space before
the colon, and additional selections shown as **a count**, not spelled out.

**Spec v19 S7-R2, verbatim — and note that it contradicts itself:**
> *"If multiple values are selected for a single filter, the chip displays **the first value followed
> by a count of additional selections** (e.g., "Status: Estimate, In progress, Approved…")"*

**The rule says a count. The `e.g.` shows three spelled-out values, which is not a count.** The build
follows **the rule**. Our case had followed **the example**:

| | text |
|---|---|
| **[C29596](https://shopview.testrail.io/index.php?/cases/view/29596) was** | *"The chip **lists the selected values** starting with the first one and **shortens the label when it gets too long** (the design shows 'Status: Estimate, In progress, Approved...')."* |
| **now** | *"The chip displays the **FIRST selected value followed by a count of the additional selections** — it does not spell out every value (on the build tested, ticking Estimate, In progress and Approved gives 'Status : Estimate, +2')."* |

**This is the most consequential correction in the pass, and it is worth being plain about why:** as
written, the case would have made a tester **FAIL a build that conforms to S7-R2**. The repair does
not bend the expectation toward the build — it moves the expectation **onto the requirement's own
rule**, which it had drifted off. The assertion is now *stronger* and still falsifiable: a build
that spelled out every value would fail it.

| | text |
|---|---|
| **[C29595](https://shopview.testrail.io/index.php?/cases/view/29595) was** | *"The chip displays the selected value (for example 'Status: Estimate')."* |
| **now** | *"The chip displays the selected value (on the build tested it reads 'Status : Estimate')."* |

**S7-R1 verbatim:** *"the chip changes to an active/highlighted visual state (blue pill) and
**displays the selected value(s)**"* — no format is pinned, so the parenthetical is an illustration
and moves to what the tester will actually see. Class C.

---

## KEPT — class B (the requirement pins the wording; the build differs)

### `Back to my view` vs `Back To My Saved Filters`

**Build:** `back_to_saved_filters = "undo Back To My Saved Filters"`.
**Spec S11-R7:** quoted in full above — it **argues for** the string *"Back to my view"*.

[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) and
[C38896](https://shopview.testrail.io/index.php?/cases/view/38896) already carry the correct shape:
**steps say `Back To My Saved Filters`** (so the tester can find it) and **expected results assert
`Back to my view`** (so the case can still fail). **Left exactly as they are.** The build difference
is recorded in `FINDINGS.md`.

**The residual is real and worth naming:** a tester reads two different names for one button inside
one case. It is the honest shape, not a comfortable one, and resolving it needs the label changed in
the product — not in the case.

---

## RECORDED, NOT CHANGED — the six where the control our case names does not exist

These are **not** label variance. In each, the case describes a control or a surface that the build
does not have, so renaming the step would silently convert a **coverage finding** into a test of a
different control. Full detail in `FINDINGS.md`; here is the side-by-side.

| Case | Our text | Build, observed | Why not renamed |
|---|---|---|---|
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | *"On the Parts Returns tab, click the **Part Type** filter button"*, then asserts *"two options: Core and Non Core"* and that both can be ticked | Returns carries **`Show cores only`** and **`Vendor`**. There is no Part Type control and no Core / Non Core pair | The assertion is a **multi-select Core/Non Core filter**. `Show cores only` is a different control with different behaviour. Renaming would delete the finding |
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | *"Inventory shows four filter buttons: Bin Location, Category, Supply and **Vendor**"*; *"Part Sales shows four filter buttons: Status, Customer, **Created by** and …"* | Inventory: **Bin Location, Category, Supply** (three). Part Sales: **Status** (one) | The count is the assertion. It is a gap, not a wording difference |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | *"Go to the **My Timesheets** report"*; *"Go to the **Sales Tax** report. Look at the filter buttons on the **Collected** tab, then open the **All Tax Rates** tab"* | The Reports nav has **no My Timesheets**; a Timesheets surface exists at `/timesheets`. The nav item reads **`Sales Tax Collected`** and the page shows **no tabs at all** | Two separate things: one navigation name, and one structure (tabs) that does not exist. The second is a finding |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | *"Open the **Sales Tax** report, choose the **Collected** tab"* | Same as above — nav reads `Sales Tax Collected`, no tabs | as above |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | *"a report that uses them — for example A/R Aging Detail (**Location, Transaction Type**)"* | A/R Aging Detail carries exactly one chip: **`Date : 2026-08-11`** | The named filters are absent, not renamed |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | *"Visit the Reports and Dashboard surfaces: **IBS Batch Transactions**, **Sales Tax Invoices**, the Dashboard"* | Nav reads **`IBS Batches`** and **`Sales Tax Collected`** | **These two ARE class A and would normally be renamed** — see the note below |

### The one place we deliberately stopped short, and why

**[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)'s `IBS Batch Transactions` and
`Sales Tax Invoices` are straightforward class-A navigation names** that the build calls
`IBS Batches` and `Sales Tax Collected`, and on any ordinary day they would simply be corrected.

They were not corrected here because **that case's precondition 2 is *"The page-search rollout has
finished everywhere"*, which is not true** — the case sweeps ~42 surfaces and is currently
unrunnable end to end. Renaming two entries inside a list of forty would produce a case that still
cannot be run, while making it *look* freshly verified. **The remaining ~40 surface names in that
case have not been checked against the build**, and correcting two of them would misrepresent that.

**What it needs: one pass that walks all ~42 surfaces and checks every name at once.** Recorded as
outstanding rather than half-done.
