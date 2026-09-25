# PREPARED — not filed. Awaiting the QA lead's go-ahead, per ticket (Rules 62 / 113).

**Rewritten 25 September 2026.** The 24 September draft claimed the bar carried none of the required
dividers. That was wrong — all three are present and behave correctly. The draft below carries only
what survived re-measurement.

---

**Issue type:** Story Defect · **Parent:** the owning story (read its status live before filing —
must be *Ready for QA* or *Testing QA*, Rule 112) · **Priority:** Medium

**Title:** Bulk Action Bar Replaces the Work Order Tabs Instead of the Column Headings

---

## Description

The bulk action bar is specified to take the place of the **column headings** while lines are
selected, and to **never cover the work order's own tabs**. It does the opposite: the tabs disappear
and the headings stay. Two further pieces of the bar are missing.

For example, on a work order's Lines tab:

* Tick any line. *Notes*, *Stats* and *Finance* vanish from the tab strip and the bar appears in their
  place. Dismiss the bar and they come back.
* The column headings — *Name/Description*, *Actual/Estimate*, *Progress*, *Status*, *Action* — stay on
  screen the whole time.
* Nothing on the ticked line changes. Not the line, not its story, not its labour, not its parts. The
  only sign anything is selected is the count in the bar.
* The bar has no **Deselect all**. A user who over-selects can only press the cross, which throws the
  bar away as well as the selection — which is exactly what *Deselect all* exists to avoid.

## Steps to Reproduce

1. Open **Work Orders**, open any work order with several lines, and stay on its **Lines** tab.
2. Note the tab strip and the column headings.
3. Hover a line and tick its box.
   #* The tab strip's *Notes*, *Stats* and *Finance* are gone.
   #* The column headings are still there.
   #* The line looks exactly as it did before it was ticked.
   #* The bar reads `2 selected · Complete Lines (2) · Receive (1) · Pick (1) · More · ×` — no *Deselect all*.
4. Press the cross.
   #* The selection clears, the bar goes, the tabs come back.

**Actual Result:** the bar takes the tab strip's place, leaves the column headings on screen, gives no
visual sign of which lines are selected, and offers no way to clear a selection without dismissing itself.

**Expected Result:** the bar takes the place of the column headings, never covers the tabs, highlights
each selected line together with its story, labour and parts, and carries *Deselect all* between the
count and the line actions.

## Screenshots

`pictures/bulk-bar-takes-the-tabs-place.png` — one composed landscape picture, 2780px of 2×-captured
content, both states banner-labelled with the call-outs marked. Size with `size_pics.py` after the
description is written and read it back (Rule 116).

## Environment

Production, `app.shopview.com`, build **v26.39.1-3ef6ade**, 25 September 2026.
Work order used: **S2-908**.

## Sources

Simple Flow V2, Confluence page 771391574, **version 26**, *SV-9253 Story 7, The bulk action bar*:

> The bar sits at the top of the list and replaces the column headers while a selection is active. Nothing on the page shifts when it appears
> Selecting a row highlights the whole line, including its story, labour and parts
> Layout is n selected, then Deselect all, then the line actions, then the parts actions, then More, then a close control, with a divider between each group
> Deselect all clears the selection and leaves the bar in place. The close control clears the selection and dismisses the bar. Both exist because a user who over-selected wants to start again, not to lose the bar and the column headers with it
> The bar never covers the work order's own tabs. It belongs to the line list and appears inside it

---

### What is NOT in this ticket, and why

- **Dividers.** All three are present, at the three places the requirement names, and they correctly
  collapse when a group holds nothing. My earlier draft said otherwise and was wrong.
- **Action order, counts and the greyed-out rule.** All correct, including *Create Invoice* shown
  greyed with its reason.
- **The More menu.** Correct under a selection that covers every open line.
