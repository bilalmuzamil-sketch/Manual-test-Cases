TITLE: The Bulk Action Bar Sits Above the Column Headers Instead of Replacing Them, and Holds Almost Nothing
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9253 — The bulk action bar
PRIORITY: Medium
ALSO LINK: relates to SV-9253
PICTURE: pictures/bulk-bar.png  (banner: "The bulk action bar with one line selected")
COVERS THE CHECKS: C44571, C44572, C44574, C53486

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

The bar that appears when lines are selected is meant to take the place of the column headers and to
lay its actions out in a fixed order, so the page does not grow and the actions always sit where the
user expects them.

On the build the bar is added above the headers rather than replacing them, and it holds only one
action.

For example, with one line selected:
* the column headers are still on screen underneath the bar;
* the bar reads *1 selected*, *Approve (1)*, *More* and a cross — nothing else;
* there is no *Deselect all*;
* there is no parts group at all, so *Order*, *Receive* and *Pick* never appear in it;
* *More* is rendered but opens empty, and an empty More is meant not to be rendered at all;
* none of the dividers the layout calls for is present.

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Work Orders* → the *Work Orders* tab → a work order with several lines.
# Hover a line row so its tick box appears, and tick it.
#* A dark bar appears at the top of the list.
#* The column headers — *Name/Description*, *Actual/Estimate*, *Progress*, *Status*, *Action*, *Rate*, *Margin*, *Total* — are all still visible below it.
# Read the bar from left to right.
#* *1 selected*, then *Approve (1)*, then *More*, then a cross. No *Deselect all*, no dividers, no parts actions.
# Open *More*.
#* It opens with nothing in it.
# Press the cross.
#* The selection clears and the bar goes.

*Actual Result* — the bar is added above the headers, carries one action and an empty More, and has no
Deselect all.

*Expected Result* — the bar replaces the column headers while a selection is active and reads
"n selected", *Deselect all*, the line actions, the parts actions, *More*, then a close control, with a
divider after the count and after each group. An empty More is not rendered.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
The work order in the picture: [https://app.shopview.com/workorders/068f9856-9d28-4500-a3dd-dd6d7aafb15a/lines]

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 7 — "The bulk action bar".
_[TO BE PASTED: the verbatim sentences from the live page — one gated read of the source is needed.]_
