TITLE: The Bulk Action Bar Sits Above the Column Headers Instead of Replacing Them, and Holds Almost Nothing
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9253 — The bulk action bar
PRIORITY: Medium
ALSO LINK: relates to SV-9253
PICTURE: pictures/bulk-bar.png  (banner: "The bulk action bar with one line selected")
COVERS THE CHECKS: C44571, C53486  (C44572 and C44574 were withdrawn on re-run - see below)

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

The bar that appears when lines are selected is meant to take the place of the column headers and to
lay its actions out in a fixed order, so the page does not grow and the actions always sit where the
user expects them.

On the build the bar is added above the headers rather than replacing them, and it holds only one
action.

For example, with lines selected:
* the column headers are still on screen underneath the bar;
* there is no *Deselect all* anywhere in it;
* none of the dividers the layout calls for is present — after the count, after the line group and
  after the parts group.

Everything else about the bar is right, and was confirmed on a work order with parts in each state:
the actions appear in the required order (*Create Invoice*, *Complete Lines*, *Approve*, then
*Receive* and *Pick*), *More* holds *Authorization required*, *Split work order* and *Decline* in that
order, each action carries its own count, and an action with a count of zero is absent rather than
greyed out.

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Work Orders* → the *Work Orders* tab → a work order with several lines.
# Hover a line row so its tick box appears, and tick it.
#* A dark bar appears at the top of the list.
#* The column headers — *Name/Description*, *Actual/Estimate*, *Progress*, *Status*, *Action*, *Rate*, *Margin*, *Total* — are all still visible below it.
# Read the bar from left to right.
#* *n selected*, then the actions, then *More*, then a cross. There is no *Deselect all* and no divider anywhere in it.
# Press the cross.
#* The selection clears and the bar goes.

*Actual Result* — the bar is added above the headers rather than replacing them, and carries neither a
*Deselect all* nor any of the dividers.

*Expected Result* — the bar replaces the column headers while a selection is active and reads
"n selected", *Deselect all*, the line actions, the parts actions, *More*, then a close control, with a
divider after the count and after each group. An empty More is not rendered.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
The work order in the picture: [https://app.shopview.com/workorders/068f9856-9d28-4500-a3dd-dd6d7aafb15a/lines]

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 7 — "The bulk action bar".
_[TO BE PASTED: the verbatim sentences from the live page — one gated read of the source is needed.]_

---

**Withdrawn on re-run, 2026-09-24:** two claims in the first draft of this report were mine, not the
product's. The bar looked empty because the line I had selected had nothing in it to act on. With a
work order carrying parts in each state, the parts group, the counts and the contents of *More* are all
correct. Only the two points above stand.
