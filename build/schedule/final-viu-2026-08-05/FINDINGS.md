# Schedule — FINDINGS, 5 August 2026 (final VIU pass)

Build **`v3.5-be42149`**, read at 13:24:01Z / 13:49:34Z / 14:11:22Z — **byte-identical all three**.

## What was OBSERVED LIVE this pass, and what was not — said first, plainly

**7 of the 165 cases were re-observed live today.** The other **158 carry verdicts measured on
`v3.5-4873abe` on 4 August**. Every one of those 158 now says so in its own text, so no reader can
mistake a carried-forward verdict for a fresh one. **Nothing was inferred** (Rule 12).

This is a deliberate, stated limit rather than a claim of completeness. What the pass prioritised was
the QA lead's correction of principle — auditing all 165 for build-derived expectations and repairing
them — plus the specific rows whose verdict was in doubt.

## The 7 re-observed live, with the evidence

### 1. SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) — verdict STANDS, now proven properly

Our 4 August evidence proved **one** status and called the filter good. That was a Rule-50
exhaustiveness failure of our own. This pass exercised **every status the filter accepts**:

| Status filter | Rows returned | Statuses actually returned |
|---|---:|---|
| `estimate` | 0 | — none — |
| `approved` | 90 | {'approved': 90} |
| `ready_for_review` | 1 | {'ready_for_review': 1} |
| `complete` | 0 | — none — |
| `invoiced` | 0 | — none — |
| `paid` | 0 | — none — |
| `declined` | 0 | — none — |
| `in_progress` | 0 | — none — |

**8 statuses accepted; 18 other candidates rejected with *"The value you selected is not a valid
choice"*, which is how the offered list was enumerated. 0 leaks — no status filter ever returned a
work order of a different status. Multi-select `approved` + `ready_for_review` returned 91 = 90 + 1.**

The 6 statuses returning nothing do so because **the schedule list holds only two statuses**
(Approved ×90, Review ×1 out of 91). An empty result for a status nothing is in is the right answer,
and the case now tells the tester that in plain words so nobody raises a false bug.

**On SV-8868** (*"Status filter returns no work orders for most statuses"*, Ready to Fix): the
observation is real but the **filter mechanics are correct**. Worth knowing for whoever fixes it: the
org as a whole **does** hold work orders in those statuses — paid ×1101, estimate ×43, approved ×37,
declined ×7, invoiced ×7, complete ×5 out of 1200 — so the issue is that the schedule list is scoped
to schedulable work while the filter still offers statuses that list can never contain. **Our case
asserts nothing about that, so it is a coverage question, not a wrong verdict.**

### 2. SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) — OUR VERDICT WAS WRONG. Now a DEVIATION on SV-8873

The coordinator's suspicion was right: our evidence never recorded **which form** of the technician's
name we typed. Tested against work order **S-15875**, customer **Vuchester Retail**, unit
**10154522**, technician **Andrew Wade** on line *Replace - Windshield button*:

| What was typed | Rows | Our work order found? |
|---|---:|---|
| `S-15875` | 1 | yes |
| `15875` | 1 | yes |
| `S8685-15875` | 0 | **no** — SV-8841 |
| `Vuchester Retail` (multi-word customer) | 21 | yes |
| `10154522` | 2 | yes |
| `Andrew` (first name alone) | 12 | yes |
| `Wade` (last name alone) | 12 | yes |
| **`Andrew Wade`** (the name as displayed) | 0 | **NO** |
| `andrew wade` | 0 | **NO** |
| `Wade Andrew` | 0 | **NO** |

**Typing the technician's name the way the card shows it returns nothing.** Single tokens work; the
full name never does. And it is **not** a general problem with spaces — the full customer name
*Vuchester Retail* matches 21 work orders correctly, so the fault is specific to the technician
matcher. Spec §3.1: *"Sidebar search ("Search work orders") matches against: WO number, customer
name, unit number, and technician name."*

**SV-8873 was right and we were wrong.** The case now expects the full-name form to work, names the
exact strings, and carries `AUTOMATION: READY - EXPECT FAIL (SV-8873)`.

### 3. SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) — NOT BUILT is WRONG. The feature has SHIPPED

§11 requires *"drag-and-drop has a click-to-arm alternative"*. On `v3.5-be42149` it exists:

- every sidebar card carries `button_sidebar_arm_<workOrderId>`, `aria-label="Schedule S-12876 by click"`, `aria-pressed="false"`;
- clicking it sets `aria-pressed="true"`, adds class `sidebar-card__arm--armed`, and the label becomes `"Stop placing S-12876"`;
- clicking a technician's day cell then opens the **same scope picker a drag opens**, headed *"dropped on MQ Test Tech Qamar · Thu, Aug 6"*.

So the case's second assertion — *the result is the same as the equivalent drag-and-drop* — is
satisfied too. **Verdict NOT BUILT → PASS**, and the ready-to-automate figure rises from 157 to 158.

### 4. SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) — restored to the spec, and it FAILS. SV-8886 filed

Reached by click-to-arm rather than a simulated drag. In *Select multiple* mode, with one line ticked:

| Spec §4.3 requires | The build shows |
|---|---|
| a running tally `"Create shift · 2 lines · 6h"` | `text_line_picker_tally` reads **`1 selected · 1h`** |
| a **`Select all`** shortcut (equivalent to whole order) | **absent** — no such control exists |
| **`Cancel`** (returns to the fast single-tap list) | **absent** — only an X that closes the whole picker |

Controls actually present: `button_line_picker_close`, `line_picker_whole_work_order`,
`button_line_picker_multi_select`, `input_line_picker_search`, `button_line_picker_scope_all`
(renders **`All 2`** — the All/Unscheduled *filter*, which ticks nothing),
`button_line_picker_scope_unscheduled`, `checkbox_line_picker_<lineId>`, `line_picker_footer`,
`text_line_picker_tally`, `button_line_picker_schedule` (renders **`Schedule`**).

**Filed as [SV-8886](https://shopview.atlassian.net/browse/SV-8886)** — Bug, priority Low, parent
SV-8685, story SV-8689 linked *Relates*, Product Area Schedule. 11 field checks read back, all PASS.

### 5. SCH-LINE-03 = [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) — restored assertion, and it PASSES

Exhaustive over the whole sidebar: **533 lines across all 91 work orders**, statuses **`authorized`
×329** and **`complete` ×204** — **zero unapproved lines anywhere**. Spec §3.1: *"Only approved work
order lines are visible in the schedule sidebar; unapproved lines do not appear."* The restored
item 3 (*the count matches the APPROVED lines*) is therefore both testable and true.

### 6. SCH-FILT-04 = [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) — PASS
`priority=high` → 1 row, all high. `medium` → 0, `low` → 0. Only the requested priority is ever returned.

### 7. SCH-FILT-06 = [C29947](https://shopview.testrail.io/index.php?/cases/view/29947) — PASS
Search alone 21 rows · status alone 90 rows · **both together 21** — the two narrow jointly, per §5.1.

## Not settled, and why — stated rather than glossed

| Item | Status after this pass |
|---|---|
| **SCH-API-02** = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873), **SCH-EVT-02** = [C30017](https://shopview.testrail.io/index.php?/cases/view/30017), **SCH-SPREAD-11** = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | still recorded **not built**; **not re-driven this pass** |
| **SCH-EDGE-07** = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | still *cannot be set up here*. **Worth revisiting:** the clock change need not be *moved* — a series scheduled ACROSS 1 Nov 2026 would test it. Not attempted this pass. |
| **SCH-START-02** = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | still *cannot be set up here*; turning shop business hours on changes a shared setting mid-pass for other testers |
| The **19 carried-forward deviations** | **not re-driven.** All ten of our tickets SV-8848…SV-8857 were read live and are **still Open**, so they very probably still reproduce — but *probably* is not *observed*, and the cases say so |
| **SCH-FILT-01/02** = [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) / [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) | the assignment filter parameter was not found (my two guesses returned HTTP 400). **Not a defect finding — a gap in my probing**, recorded as such |
| The **three candidate coverage gaps** (SV-8863, SV-8870, SV-8867) | **NOT authored.** See OUTSIDE-IN.md |

## Environment: nothing seeded, nothing to restore

The only interaction that could have written data was arming a work order and opening the scope
picker. **The confirm button was never pressed.** Proven, not assumed:

| | Before | After |
|---|---:|---:|
| shifts | 34 | 34 |
| events | 9 | 9 |
| series | 6 | 6 |

**All shift, event and series records byte-identical**, and the shift id sets **equal in both
directions** (0 added, 0 removed). No throwaway data was created, so none needed deleting, and **no
role was changed, so none needed resetting to template.**
