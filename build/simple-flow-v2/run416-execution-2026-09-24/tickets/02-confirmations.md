TITLE: Every Work Order Switch Asks to Confirm, and the Picking Warning Says the Opposite of What It Should
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9249 — Confirmation before a settings change
PRIORITY: Medium
ALSO LINK: relates to SV-9249
PICTURES: pictures/confirm-approval.png, pictures/confirm-receiving.png
COVERS THE CHECK: C44557

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

A confirmation is meant to appear only where a switch is about to change records that already exist —
that is, for *Require Ordering Parts* and *Require Picking Inventory Parts*. The other two switches
change nothing that exists, so they are meant to save straight away with no interruption.

On the build all four switches confirm, and the one confirmation that is meant to be a warning is not
one.

For example:
* *Require Approval for New Lines* opens a confirmation. It should save directly.
* *Require Receiving Parts Before Completion* opens a confirmation. It should save directly.
* Turning *Require Picking Inventory Parts* off should warn, in words, that the affected inventory
  parts will be marked as picked and deducted from stock. Instead it reads
  {{None of them is picked retroactively.}} — the opposite reassurance.

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Settings* in the left sidebar, then the *Work Orders* tab.
# Switch *Require Approval for New Lines*.
#* A confirmation opens: {{Turn on Require Approval for New Lines? … 50 lines at this location are affected by this requirement today. No record is changed by this switch.}}
# Press *Cancel*, then switch *Require Receiving Parts Before Completion*.
#* A confirmation opens: {{Turn off Require Receiving Parts Before Completion? … 82 work orders waiting on parts can now be invoiced.}}
# Press *Cancel*, turn *Require Picking Inventory Parts* on and save, then switch it back off.
#* The confirmation reads {{Inventory and found parts will be ready as soon as their line is approved … None of them is picked retroactively.}}

*Actual Result* — all four switches confirm, and turning picking off reassures rather than warns.

*Expected Result* — only the ordering and picking switches confirm; approval and receiving save
directly. Turning picking off is shown as a warning that says in words that the affected inventory
parts will be marked as picked and deducted from stock.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
Settings page: [https://app.shopview.com/administration/settings] → *Work Orders* tab.

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 3 — "Confirmation before a settings change".
_[TO BE PASTED: the verbatim sentence from the live page — one gated read of the source is needed.]_
