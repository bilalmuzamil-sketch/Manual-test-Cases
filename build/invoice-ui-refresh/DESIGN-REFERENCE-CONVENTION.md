# THE DESIGN REFERENCE — link plus location, never link alone (Invoice UI Refresh)

**QA lead, 2026-09-01, verbatim:** *"if the source for something is the design, you can add the
reference for the design with this link
https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354 . But do tell where in the design
that reference can be found."*

## The shape

One sentence, inside the case's existing provenance block, after the Rule-54 sentence and before the
automation marker:

> **Design:** the Design Document (<link>) — open **"&lt;view&gt;"** → **"&lt;document&gt;"**, then
> **&lt;the block it is about&gt;**. *(&lt;any toggle that has to be on&gt;.)*

A bare link is not a reference. Somebody opening the design must land on the thing the case is about
without hunting.

## The design's own vocabulary — use these words, they are the buttons

Read out of the downloaded copy the QA lead supplied (2026-09-01) and verified string by string.

| Row | The buttons, verbatim |
|---|---|
| **View** | `Customer Documents` · `Authorizer Entry (Work Order)` · `Authorizer Entry (Parts Sale)` · `Remit To` · `B&W print preview` · `Dark mode` |
| **Document** | `Estimate` · `Invoice` · `Paid Invoice (ShopPay portal)` · `Paid Invoice (shop app)` · `Credit Invoice` · `Parts Sale Estimate` · `Parts Sale Invoice` |
| **Fields** | `WO = Doc #` · `No PO` · `Approval Code` · `No Unit` · `No Plate` · `No Mileage` · `No Eng Hrs` · `Declined Work` · `Supplies %` · `Adjustments` · `Labor discount (10%)` · `Labor fee (5%)` · `Parts discount (5%)` · `Parts fee ($20 flat)` · `WO fee ($75 flat)` · `WO discount ($100 flat)` |
| **Administration > Invoice Details** | `Labor rate` · `Labor hours` · `Labor price` · `Part number` · `Part quantity` · `Part price` · `Part description` · `Summarize parts total` · `Summarize labor total` |

Document sections, as the sheet labels them: the masthead · `Addresses` (`Bill To` / `Credit To` /
`Remit Payment To`) · `Asset` · the order-reference row (`Work Order`, `Customer PO`, `Authorizer`,
`Approval Code`, `Terms`) · `Work Summary` / `Work Performed` · `Declined Work` · `Summary` ·
`Payments` · `Estimated Total` / `Balance` · `Customer Signature` / `Printed Name` · the footer.
On the credit: the `Credit Number` / `Status` / `Invoice Number` table, the credited-items table
(`Description` · `Quantity` · `Rate` · `Restocking Fee` · `Total`) and the totals block
(`Subtotal` · `Tax` · `Total Credit` · `Payments` · `Balance`).

## 🛑 The rule that keeps this honest

**Every anchor cited is checked against the design text before it is written.** `build_design_refs.py`
fails rather than emit a location it could not find. This is the same discipline as
`build/OBSERVED-UI-LABELS-sv9315.md`, and for the same reason: earlier the same day a label copied
from an old note instead of read from the source made a gate flag 42 correct cases. **A location
nobody can find is worse than no location at all.**

**And no case is excluded on a hunch.** The first run of the generator dropped C44913 on the guess that
"field order and label punctuation" had no picture. It does — the order-reference row shows
Work Order / Customer PO / Authorizer / Approval Code / Terms in that order, unpunctuated. Checked
before excluding; the exclusion list ended up empty.

## Regenerating

```
python3 build/invoice-ui-refresh/build_design_refs.py          # build + verify every anchor
python3 build/invoice-ui-refresh/design-ref-write/build_blocks.py   # payload, provenance only
DIR=…/design-ref-write RUNFLAG=/tmp/drwrite/RUNNING node …/apply_cases.mjs
```

The writer changes **only** the provenance block: the expectation, preconditions, steps, the Rule-54
sentence and the marker are all carried verbatim, and it refuses any case that changed since the
payload was built.
