# Invoice UI Refresh — every case made UI-runnable, 1 September 2026

**Your instruction:** *"Make sure ALL the test cases in the invoice refresh are moved from Spec level
to UI based Runnable test cases with UI runnable preconditions and steps of reproduction for a
manual tester. This is the primary job of this session."*

## Result: 119 of 119 runnable — the gate exits clean

```
cases checked : 119
RUNNABLE      : 119
NOT RUNNABLE  : 0
```

`python3 build/testing-tools/check_runnable_cases.py --section-prefix "Invoice Refresh (Aug 2026)"`

---

## First, the correction you are owed

**I told you yesterday that 101 of 101 cases were UI-followable. That number was wrong.** It came
from `check_layman_steps.py`, which passed a case if its text contained any of *click / open the /
tab / menu / icon / button* **anywhere**. A case reading *"Open the Credit Invoice preview"* passed
on the words *"open the"* while telling a tester nothing about where to go.

The replacement, `check_runnable_cases.py`, reads TestRail **live** and enforces skill 18's
requirements. Against it the suite was **not** clean, and this pass fixed what it found.

## What the numbers did, and why they moved

Calibrating the gate honestly mattered more than getting a good-looking figure:

| Gate version | Result | Why that number |
|---|---|---|
| The old permissive checker | "101/101 clean" | Passed on any friendly-looking word. Wrong. |
| First strict version | 117 / 119 | Only caught cases with **no** route anywhere. Too lenient. |
| "every step must name a place" | 47 / 119 | **Over-fired badly.** Once step 1 has the document on screen, *"Look at the masthead"* is exactly right; demanding the click path in every step flagged 72 cases, nearly all wrongly. |
| **Final: the FIRST step must put the tester somewhere** | 93 → **119 / 119** | This is the rule that matches how a tester actually reads a case. |

**The lesson, recorded in skill 18:** a gate that cannot fail is not a gate, and a gate that fails
everything is not one either. It is now **self-tested in both directions** — proven to fail on your
own example (*"Generate the Invoice."*), on a case with no steps, and on jargon in a non-API case;
proven to pass a real route and a deliberate API case.

## What was changed

**26 cases** were fixed across two passes. Only **preconditions and steps** were touched — Expected
Results were never edited (Rule 57), and every marker was carried and verified unchanged
(**8/8** from the marker push still correct, **13/13** step-fix cases unchanged).

The 13 in the final pass were **hand-written, not auto-generated**. An automatic prefix produced
plausible text that was wrong in several places — a Credit Invoice case picked up a
"Work Orders → Finance" route because the word *credit* appeared in its title, and a document-history
case was told to look on the Finance tab. Each of the 13 was written against the route actually
observed for that document type, then re-checked through the gate before being written.

## Where a build-verified route beat a design-derived one

While this ran, another session was writing to the same cases. It has been stopped. Its edits
**preserved every marker**, but they **replaced the routes on five cases I had build-verified**
(C44987, C45185, C45190, C45191, C45196) with routes derived from the design rather than observed.
Those were restored, and three of them were materially wrong:

| Case | Design-derived route | What the build actually does |
|---|---|---|
| C45185 | *"Open it from Customers → Invoices tab"* | Saved copies open from the **work order's History**, not the Invoices tab |
| C45190 | *"Imported work orders open the same way from the Work Orders list"* | They appear **only under the Imported status filter** |
| C45191 | *"an administrator removes the Work Orders edit permission from the user's role"* | Unnecessary — the **Technician role already lacks it**, so no role is edited at all |

A route observed on the build outranks one written without opening the app. That is now stated in
`NAVIGATION-MAP.md` and skill 18.

## The one deliberate exception

[C45169](https://shopview.testrail.io/index.php?/cases/view/45169) keeps `/api/work-orders/change-authorizer`
in its steps. It is an **API-level case by design** — the whole point is that the back end holds the
lock when the screen is bypassed — so stripping the endpoint would delete the test (Rule 4). It is
still held to everything else and now says how to reach the work order in the app first. The gate
exempts genuine API cases from the plain-language rule and nothing else.

**One placement note for you:** per Rule 4, API-content cases belong in an API-titled section.
C45169 and C45170 sit in *Authorizer Entry (Work Order)*. Not moved — that is your call.

## OUTSTANDING — what I need from you

1. **Nothing blocking.** The suite is runnable end to end and the gate is wired to prove it.
2. Two titles exceed the ≤ ~80 character convention and will truncate on the case page —
   C45190 (99) and C45185 (89). One-line fix on your word.
3. Still parked at your instruction: the snapshot defect (not filed) and the three PO questions.
