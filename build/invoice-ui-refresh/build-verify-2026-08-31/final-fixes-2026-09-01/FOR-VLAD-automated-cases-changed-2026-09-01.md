# FOR VLAD — five Automated cases were changed (Rule 65)

**Date:** 1 September 2026 · **Project:** Invoice UI Refresh (SV-8218) · **Suite:** TestRail suite 1

Rule 65 requires that any pass which writes to a case TestRail flags as **Automated** tells you.
This pass wrote to five, **with the QA lead's explicit per-case go-ahead** given on 2026-09-01
(*"2. yes please"*, in reply to a request for exactly that permission).

## What changed, and what did not

| Case | Title | What changed |
|---|---|---|
| [C44919](https://shopview.testrail.io/index.php?/cases/view/44919) | Authorizer is selected in the work order customer contact card | preconditions + steps |
| [C44920](https://shopview.testrail.io/index.php?/cases/view/44920) | Authorizer is optional and can be cleared with 'No authorizer' | preconditions + steps |
| [C44921](https://shopview.testrail.io/index.php?/cases/view/44921) | Authorizer's phone shows below the name when the contact has one | preconditions + steps |
| [C44922](https://shopview.testrail.io/index.php?/cases/view/44922) | Authorizer is locked once the work order is invoiced | preconditions + steps |
| [C44985](https://shopview.testrail.io/index.php?/cases/view/44985) | Parts sale receives the Authorizer treatment (net-new) | preconditions + steps |

**Only `custom_preconds` and `custom_steps` were rewritten.** Verified unchanged afterwards on all
five: **`custom_atmstatus` is still 3**, the section is unchanged, `refs` are unchanged, the
**Expected Results are byte-identical**, and each case still carries its original AUTOMATION marker —
including C44919's `AUTOMATION: READY - EXPECT FAIL (SV-9599)`, which was carried through verbatim.

## Why they were changed

All five described the route to the **document** (*"click Work Orders … the Finance tab … the
document appears on the right"*), but none of them is about the document. They are about the
**Authorizer row in the customer card**, which is the panel down the **left-hand side** of a work
order or parts sale — a different screen area entirely. A tester following the old preconditions
would have been looking at the wrong half of the page.

The steps were also spec-level (*"Open the work order."*, *"Open the parts sale record and find the
Authorizer field."*) and are now click-by-click.

## What this means for your automation

**The selectors and the assertions are untouched** — nothing in the Expected Results moved, so what
an automated run checks is exactly what it checked before. What changed is the human-readable setup
and navigation text.

Two things in the new text may be useful to you, both observed live on `v26.35.5-8c3cc21`:

- On an **invoiced** work order the Authorizer control renders with `q-field--disabled` /
  `aria-disabled="true"` — that is S3-R8's lock, and it is why C44922 can be asserted without a
  permission change.
- A **parts sale** customer card carries Contact, Phone and Authorizer just as a work order does,
  which is what C44985 asserts.

## Nothing else of yours was touched

No other Automated case in the suite exists — these five are the complete set (`custom_atmstatus = 3`
across all 119 Invoice cases). Full audit log: `../markers-2026-09-01/TESTRAIL-EXECUTION-LOG-2026-09-01.md`
and this folder's `APPLIED-steps.jsonl`.
