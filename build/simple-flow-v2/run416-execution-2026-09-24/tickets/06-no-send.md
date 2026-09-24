TITLE: The Work Order Header Has No Send Action in Any State
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9264 — Create invoice as the finish action
PRIORITY: Medium
ALSO LINK: relates to SV-9264
PICTURE: pictures/header-no-send.png  (banner: "The work order header when every line is complete")
COVERS THE CHECK: C44599

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

The work order header is meant to carry *New Line*, *Send*, and the finish action that is genuinely
next — and only that one. On the build *Send* is not there, in any state of the work order.

For example, across four work orders read on the same build:
* lines still open → header shows *New Line* and a three-dot menu holding *Create invoice*, shown
  disabled with the reason {{All lines must be approved before invoicing.}} — correct, but no *Send*;
* every line complete → *Create Invoice* is promoted to a button beside *New Line* — correct, but no *Send*;
* every line declined → no finish action at all — correct, and no *Send*;
* already invoiced → the header and the menu carry neither finish action — correct, and no *Send*.

Everything else about the finish action behaves as it should. The single gap is *Send*.

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Work Orders* → the *Work Orders* tab → a work order whose lines are all complete.
# Read the buttons at the top right of the lines area.
#* *New Line* and the create-invoice button. Nothing else.
# Open the three-dot menu beside them.
#* *Audit Log*, *Timesheets*, *Add Work Order Fee / Discount*, *Print Work Order*, *Delete Work Order*.
# Repeat on a work order with a line still awaiting approval, on one whose only line is declined, and on one already invoiced.
#* *Send* appears on none of them.

*Actual Result* — there is no *Send* action on the work order header, or in its three-dot menu, in any
state.

*Expected Result* — the header carries *New Line*, *Send*, and the one finish action that is genuinely
available.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
The work order in the picture: [https://app.shopview.com/workorders/4560a837-ee20-46e5-a62c-c6a4892fc85d/lines]

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 18 — "Create invoice as the finish action".
_[TO BE PASTED: the verbatim sentence from the live page — one gated read of the source is needed.]_
