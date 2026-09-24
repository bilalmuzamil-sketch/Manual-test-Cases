TITLE: A Work Order Line Offers Only Two of Its Actions, and a Completed Line Can Never Be Reopened
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9252 — Which actions appear on a line and on a part
PRIORITY: Medium
ALSO LINK: relates to SV-9252, SV-9251, SV-9265
PICTURE: pictures/line-actions.png  (banner: "The actions a work order line offers")
COVERS THE CHECKS: C44566, C44567, C44565, C44602, C44603

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

The actions a line offers are meant to follow its status, and the line's three-dot menu is meant to
carry the rest of them. On the build a line offers at most two actions and its menu holds one item, so
several actions the product is meant to have are not reachable at all.

For example, on a work order with lines in different statuses:
* a line *awaiting approval* offers *Approve* and *Decline* — *Request part* and *Delete line* are missing;
* an *approved* line offers *Complete* only — *Decline*, *Authorization required*, *Request part* and
  *Delete line* are all missing;
* *Uncomplete* does not exist anywhere, so a completed line can never be reopened;
* the line's three-dot menu holds only *Add Labor Fee / Discount* — none of *Request part*,
  *Uncomplete line*, *Add line note*, *Save as canned line*, *Edit labour*, *Receive parts* or
  *Authorization required*;
* because *Decline* is not offered on an approved line at all, it can never be shown disabled with its
  reason when the line holds received or picked parts.

The part's own three-dot menu is correct — *Move*, *Return*, the fee or discount item, and *Receive
part* appearing only when receiving is not required.

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Work Orders* → the *Work Orders* tab → a work order with one line awaiting approval and one approved line.
# Hover each line row in turn and read the buttons in its *Action* column.
#* Awaiting approval: *Approve*, *Decline*.
#* Approved: *Complete*.
# Open the three-dot menu on each line.
#* Every one holds a single item: *Add Labor Fee / Discount*.
# Search the whole page for *Request part*, *Delete line*, *Authorization required* and *Uncomplete*.
#* None of the four appears anywhere, on a row, in a menu, or on a completed line.

*Actual Result* — a line offers at most two actions and its menu holds one item. Four actions the
product is meant to offer are absent from the screen entirely.

*Expected Result* — a line awaiting approval offers Approve, Decline, Request part and Delete line;
an approved line offers Decline, Authorization required, Complete, Request part and Delete line; a
completed line offers Decline, Authorization required and Uncomplete; and the line's three-dot menu
carries the rest.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
The work order in the picture: [https://app.shopview.com/workorders/068f9856-9d28-4500-a3dd-dd6d7aafb15a/lines]

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 6 — "Which actions appear on a line and
on a part", and Story 19 — "Part rows and menus".
_[TO BE PASTED: the verbatim sentences from the live page — one gated read of the source is needed.]_
