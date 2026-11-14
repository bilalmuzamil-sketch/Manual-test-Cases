# A/R and A/P Report Sorting — change list for PRD version 13 (14 Nov 2026)

DRAFT: nothing has been written to TestRail yet. Your choice of 14 Nov 2026: **"Apply on top, + SV-12723 (Recommended)"**. Every change is written on top of each case's current TestRail text, so the edits made on 11-12 Nov (build lines, READY markers, Setup steps, reworded steps) all stay. Every case stays in its current folder.

## At a glance

| What | Count |
|---|---|
| Cases that would change | 380 (73 rewritten for a changed requirement, 307 only re-stamped to PRD version 13) |
| ... of which what the tester does or sees changes | 14 |
| New cases | 8 (folder "Setup needed before testing"; added to run 557, assigned to Mudassir) |
| Skipped because TestRail changed since our read | 0 (two full reads and a per-case read just now: no change) |
| Main folder note (Rule 140) | "Test cases are current as of 11/14/2026. …" on folder 90418 (empty today) |

Proof that no edit made on 11-12 Nov is lost: a script compares, line by line, the current TestRail text with what would be written. Every line added or changed on 11-12 Nov is still there, except the replacements listed in section 5 (each one is a line PRD version 13 itself changes, plus DATA-13's case id, as you chose). Nothing is added that is not part of the PRD version 13 change.

## 1. Cases rewritten because a requirement changed

### S1-R8: The PRD now says an open customer's or vendor's documents may arrive all at once; it only sets how many show at a time.

| Case | Title | What changes |
|---|---|---|
| [C715450](https://shopview.testrail.io/index.php?/cases/view/715450) | A/R Summary: 30 customers at a time, none repeated or skipped | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715612](https://shopview.testrail.io/index.php?/cases/view/715612) | A/R Summary: the Totals row adds up every customer, not only those loaded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715451](https://shopview.testrail.io/index.php?/cases/view/715451) | A/P Summary: 30 vendors at a time, none repeated or skipped | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715613](https://shopview.testrail.io/index.php?/cases/view/715613) | A/P Summary: the Totals row adds up every vendor, not only those loaded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715452](https://shopview.testrail.io/index.php?/cases/view/715452) | A/R Collection: 30 customers at a time, none repeated or skipped | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715614](https://shopview.testrail.io/index.php?/cases/view/715614) | A/R Collection: the Totals row adds up every customer, not only those loaded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715453](https://shopview.testrail.io/index.php?/cases/view/715453) | A/P Unpaid Invoices: 30 vendors at a time, none repeated or skipped | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715615](https://shopview.testrail.io/index.php?/cases/view/715615) | A/P Unpaid Invoices: the Totals row adds up every vendor, not only those loaded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715454](https://shopview.testrail.io/index.php?/cases/view/715454) | A/R Detail: a long bucket loads in 100s with no line repeated or skipped | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715455](https://shopview.testrail.io/index.php?/cases/view/715455) | A/P Detail: a long bucket loads in 100s with no line repeated or skipped | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C1062589](https://shopview.testrail.io/index.php?/cases/view/1062589) | A/P Unpaid Invoices: 101 bills count and add up before all are shown | step 3: the 101st bill shows (same reason) |
| [C1062570](https://shopview.testrail.io/index.php?/cases/view/1062570) | A/R Collection: a customer with over 100 documents shows 100 at a time | title and steps 3-4 say the next invoices SHOW as you scroll (v13: the rule sets only how many are shown at a time) |
| [C1062571](https://shopview.testrail.io/index.php?/cases/view/1062571) | A/P Unpaid Invoices: a vendor with over 100 bills shows 100 at a time | title and steps 3-4 say the next bills SHOW as you scroll (same reason) |
| [C715316](https://shopview.testrail.io/index.php?/cases/view/715316) | A/R Summary: the sort stays while changing date, scrolling and filters | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715318](https://shopview.testrail.io/index.php?/cases/view/715318) | A/R Collection: the sort stays while changing date, scrolling and filters | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715319](https://shopview.testrail.io/index.php?/cases/view/715319) | A/P Summary: the sort stays while changing date, scrolling and filters | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715321](https://shopview.testrail.io/index.php?/cases/view/715321) | A/P Unpaid Invoices: the sort stays while changing date, scrolling and filters | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715358](https://shopview.testrail.io/index.php?/cases/view/715358) | A/R Collection: after Expand all, groups loaded later arrive expanded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715359](https://shopview.testrail.io/index.php?/cases/view/715359) | A/P Unpaid Invoices: after Expand all, groups loaded later arrive expanded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715360](https://shopview.testrail.io/index.php?/cases/view/715360) | A/R Detail: an expanded bucket shows 100 lines, then loads more on scroll | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715361](https://shopview.testrail.io/index.php?/cases/view/715361) | A/P Detail: an expanded bucket shows 100 lines, then loads more on scroll | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715366](https://shopview.testrail.io/index.php?/cases/view/715366) | A/R Collection: loading more by scrolling keeps groups open or closed | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715367](https://shopview.testrail.io/index.php?/cases/view/715367) | A/P Unpaid Invoices: loading more by scrolling keeps groups open or closed | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |

### S4-R1: The PRD now says the chevron at the top left of the table is blue, like each group's chevron. The design picture draws it grey (recorded; the PRD wins).

| Case | Title | What changes |
|---|---|---|
| [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | Design: A/R Detail chevron button, tooltips and pinned group row | steps 1-2: the header chevron is blue, the same blue as the group chevrons |
| [C715506](https://shopview.testrail.io/index.php?/cases/view/715506) | Design: A/R Collection chevron button, tooltips and pinned group row | same as D-25 |
| [C715507](https://shopview.testrail.io/index.php?/cases/view/715507) | Design: A/P Detail chevron button, tooltips and pinned group row | same as D-25 |
| [C715508](https://shopview.testrail.io/index.php?/cases/view/715508) | Design: A/P Unpaid Invoices chevron button, tooltips and pinned group row | same as D-25 |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | Design: A/P Detail with every bucket closed matches the design picture | step 2: the header chevron is blue (the live case already says so, changed 12 Nov on the QA lead's instruction; kept) |
| [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | Design: A/R Collection after Expand all matches the design picture | step 1: the header chevron is blue |
| [C715541](https://shopview.testrail.io/index.php?/cases/view/715541) | Design: A/R Collection with groups closed matches the pictures in both themes | step 2: the header chevron is blue |
| [C715354](https://shopview.testrail.io/index.php?/cases/view/715354) | A/R Detail: the top-left chevron collapses and expands every group | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715355](https://shopview.testrail.io/index.php?/cases/view/715355) | A/R Collection: the top-left chevron collapses and expands every group | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715356](https://shopview.testrail.io/index.php?/cases/view/715356) | A/P Detail: the top-left chevron collapses and expands every group | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715357](https://shopview.testrail.io/index.php?/cases/view/715357) | A/P Unpaid Invoices: the top-left chevron collapses and expands every group | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715358](https://shopview.testrail.io/index.php?/cases/view/715358) | A/R Collection: after Expand all, groups loaded later arrive expanded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715359](https://shopview.testrail.io/index.php?/cases/view/715359) | A/P Unpaid Invoices: after Expand all, groups loaded later arrive expanded | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |

### S5-E3: The PRD now says: after a new as-of date, if no ticked location is left and only one location is in the list, the Location chip is hidden.

| Case | Title | What changes |
|---|---|---|
| [C715392](https://shopview.testrail.io/index.php?/cases/view/715392) | A/R Collection: the Location chip hides when only one location has data | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C1062584](https://shopview.testrail.io/index.php?/cases/view/1062584) | A/R Detail: a new as-of date keeps the ticked locations still in the list | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C1062585](https://shopview.testrail.io/index.php?/cases/view/1062585) | A/R Detail: a new as-of date with no ticked location left returns to All | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C1062586](https://shopview.testrail.io/index.php?/cases/view/1062586) | A/R Detail: No locations stays No locations after a new as-of date | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |

### S8-R3: The PRD now allows one exception on A/P Unpaid Invoices: a vendor's group row does not wrap, so a very long vendor name can push the table sideways at 1440 px (78 characters still fit).

| Case | Title | What changes |
|---|---|---|
| [C715481](https://shopview.testrail.io/index.php?/cases/view/715481) | Design: A/R Summary at 1440 px in light theme shows every column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715621](https://shopview.testrail.io/index.php?/cases/view/715621) | Design: A/R Summary Total and Totals row match Sales By Customer | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715482](https://shopview.testrail.io/index.php?/cases/view/715482) | Design: A/R Summary in dark theme: chips, links and Totals row readable | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715483](https://shopview.testrail.io/index.php?/cases/view/715483) | Design: A/R Summary at 1536 px: no overlap or clipping, light and dark | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) | Design: A/R Detail at 1440 px in light theme shows every column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715623](https://shopview.testrail.io/index.php?/cases/view/715623) | Design: A/R Detail Open Balance and Totals row match Sales By Customer | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715485](https://shopview.testrail.io/index.php?/cases/view/715485) | Design: A/R Detail in dark theme: chips, links and Totals row readable | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715486](https://shopview.testrail.io/index.php?/cases/view/715486) | Design: A/R Detail at 1536 px: no overlap or clipping, light and dark | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715487](https://shopview.testrail.io/index.php?/cases/view/715487) | Design: A/R Collection at 1440 px in light theme shows every column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715625](https://shopview.testrail.io/index.php?/cases/view/715625) | Design: A/R Collection Open Balance and Totals row match Sales By Customer | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715488](https://shopview.testrail.io/index.php?/cases/view/715488) | Design: A/R Collection in dark theme: chips, links and Totals row readable | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715489](https://shopview.testrail.io/index.php?/cases/view/715489) | Design: A/R Collection at 1536 px: no overlap or clipping, light and dark | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715490](https://shopview.testrail.io/index.php?/cases/view/715490) | Design: A/P Summary at 1440 px in light theme shows every column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715627](https://shopview.testrail.io/index.php?/cases/view/715627) | Design: A/P Summary Total and Totals row match Sales By Customer | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715491](https://shopview.testrail.io/index.php?/cases/view/715491) | Design: A/P Summary in dark theme: chips, links and Totals row readable | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715492](https://shopview.testrail.io/index.php?/cases/view/715492) | Design: A/P Summary at 1536 px: no overlap or clipping, light and dark | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715493](https://shopview.testrail.io/index.php?/cases/view/715493) | Design: A/P Detail at 1440 px in light theme shows every column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715629](https://shopview.testrail.io/index.php?/cases/view/715629) | Design: A/P Detail Open Balance and Totals row match Sales By Customer | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715494](https://shopview.testrail.io/index.php?/cases/view/715494) | Design: A/P Detail in dark theme: chips, links and Totals row readable | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715495](https://shopview.testrail.io/index.php?/cases/view/715495) | Design: A/P Detail at 1536 px: no overlap or clipping, light and dark | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | Design: A/P Unpaid Invoices at 1440 px in light theme shows every column | vendor A's name bounded to 41-78 characters (step 4 expects no sideways scroll); step 5 adds: the group row does not wrap; new vendor B with & " ' < > and step 7 (design checklist line 9) |
| [C715631](https://shopview.testrail.io/index.php?/cases/view/715631) | Design: A/P Unpaid Invoices Open Balance and Totals row match Sales By Customer | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715497](https://shopview.testrail.io/index.php?/cases/view/715497) | Design: A/P Unpaid Invoices in dark theme: chips, links and Totals row readable | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715498](https://shopview.testrail.io/index.php?/cases/view/715498) | Design: A/P Unpaid Invoices at 1536 px: no overlap or clipping, light and dark | vendor name bounded to 41-78 characters (step 3 expects no sideways scroll at 1536 px) |
| [C715527](https://shopview.testrail.io/index.php?/cases/view/715527) | Design: A/R Detail narrower than 1440 px scrolls under the pinned column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715528](https://shopview.testrail.io/index.php?/cases/view/715528) | Design: A/P Detail narrower than 1440 px scrolls under the pinned column | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715532](https://shopview.testrail.io/index.php?/cases/view/715532) | Design: A/R Summary opening screen matches the design picture | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | Design: A/R Collection after Expand all matches the design picture | step 1: the header chevron is blue |
| [C715540](https://shopview.testrail.io/index.php?/cases/view/715540) | Design: A/P Unpaid Invoices pinned vendor row matches the design pictures | name bounded to 41-78 characters; step 2: bill rows wrap, the pinned group row stays on one line |
| [C715543](https://shopview.testrail.io/index.php?/cases/view/715543) | Design: A/P Detail with a bucket open matches the pictures in both themes | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715544](https://shopview.testrail.io/index.php?/cases/view/715544) | Design: A/P Unpaid Invoices at 1440 px shows every column, as pictured | names bounded to 41-78 characters; step 5 adds: each group row shows the whole name on one line |
| [C715599](https://shopview.testrail.io/index.php?/cases/view/715599) | A/R Detail: group labels stay at the left when scrolling sideways | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715600](https://shopview.testrail.io/index.php?/cases/view/715600) | A/R Collection: group labels stay at the left when scrolling sideways | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715601](https://shopview.testrail.io/index.php?/cases/view/715601) | A/P Detail: group labels stay at the left when scrolling sideways | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |
| [C715602](https://shopview.testrail.io/index.php?/cases/view/715602) | A/P Unpaid Invoices: group labels stay at the left when scrolling sideways | Only the quoted PRD sentence is updated to version 13; nothing the tester does or sees changes. |

### S5-R10b (new): any as-of date can be picked, including a day after today

| Case | Title | What changes |
|---|---|---|
| [C715579](https://shopview.testrail.io/index.php?/cases/view/715579) | A/P Detail: a date after today ages a bill to that day | Rewritten: it checked that a day after today could NOT be picked. Now: on A/P Detail, a bill due today moves to "1-30 days past due" with Past Due 10 when the day 10 days after today is picked. Its run 557 result (passed 11-12 Nov) was for the old expectation. |

## 2. Cases only re-stamped (no requirement they use changed)

What changes in each: the line above the quotes now names PRD version 13 (read 13 Nov, re-checked 14 Nov 2026). A script proved every quote in these cases is word for word in version 13.

| Case | Title |
|---|---|
| [C715622](https://shopview.testrail.io/index.php?/cases/view/715622) | Design: A/R Summary links are blue, semi-bold and not underlined |
| [C715624](https://shopview.testrail.io/index.php?/cases/view/715624) | Design: A/R Detail links are blue, semi-bold and not underlined |
| [C715626](https://shopview.testrail.io/index.php?/cases/view/715626) | Design: A/R Collection links are blue, semi-bold and not underlined |
| [C715628](https://shopview.testrail.io/index.php?/cases/view/715628) | Design: A/P Summary links are blue, semi-bold and not underlined |
| [C715630](https://shopview.testrail.io/index.php?/cases/view/715630) | Design: A/P Detail links are blue, semi-bold and not underlined |
| [C715632](https://shopview.testrail.io/index.php?/cases/view/715632) | Design: A/P Unpaid Invoices links are blue, semi-bold and not underlined |
| [C715499](https://shopview.testrail.io/index.php?/cases/view/715499) | Design: A/R Summary loading bar and empty state match Sales By Customer |
| [C715633](https://shopview.testrail.io/index.php?/cases/view/715633) | Design: A/R Summary load error message shows in place of the rows |
| [C715500](https://shopview.testrail.io/index.php?/cases/view/715500) | Design: A/R Detail loading bar and empty state match Sales By Customer |
| [C715634](https://shopview.testrail.io/index.php?/cases/view/715634) | Design: A/R Detail load error message shows in place of the rows |
| [C715501](https://shopview.testrail.io/index.php?/cases/view/715501) | Design: A/R Collection loading bar and empty state match Sales By Customer |
| [C715635](https://shopview.testrail.io/index.php?/cases/view/715635) | Design: A/R Collection load error message shows in place of the rows |
| [C715502](https://shopview.testrail.io/index.php?/cases/view/715502) | Design: A/P Summary loading bar and empty state match Sales By Customer |
| [C715636](https://shopview.testrail.io/index.php?/cases/view/715636) | Design: A/P Summary load error message shows in place of the rows |
| [C715503](https://shopview.testrail.io/index.php?/cases/view/715503) | Design: A/P Detail loading bar and empty state match Sales By Customer |
| [C715637](https://shopview.testrail.io/index.php?/cases/view/715637) | Design: A/P Detail load error message shows in place of the rows |
| [C715504](https://shopview.testrail.io/index.php?/cases/view/715504) | Design: A/P Unpaid Invoices loading bar and empty state match Sales By Customer |
| [C715638](https://shopview.testrail.io/index.php?/cases/view/715638) | Design: A/P Unpaid Invoices load error message shows in place of the rows |
| [C715509](https://shopview.testrail.io/index.php?/cases/view/715509) | Design: A/R Location chip and menu match Sales By Customer's |
| [C715510](https://shopview.testrail.io/index.php?/cases/view/715510) | Design: A/P Location chip and menu match Sales By Customer's |
| [C715511](https://shopview.testrail.io/index.php?/cases/view/715511) | Design: A/R Customer chip and menu match Sales By Customer's |
| [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) | Design: A/P Vendor chip and menu match Inventory Value's |
| [C715513](https://shopview.testrail.io/index.php?/cases/view/715513) | Design: A/R Past due chip and its tick-box menu |
| [C715514](https://shopview.testrail.io/index.php?/cases/view/715514) | Design: A/P Past due chip and its tick-box menu |
| [C715515](https://shopview.testrail.io/index.php?/cases/view/715515) | Design: A/R Export menu matches Sales By Customer's ⋯ menu |
| [C715516](https://shopview.testrail.io/index.php?/cases/view/715516) | Design: A/P Export menu matches Sales By Customer's ⋯ menu |
| [C715517](https://shopview.testrail.io/index.php?/cases/view/715517) | Design: export Success and Empty export messages match Sales By Customer |
| [C715518](https://shopview.testrail.io/index.php?/cases/view/715518) | Design: the export error messages look like the other reports' errors |
| [C715519](https://shopview.testrail.io/index.php?/cases/view/715519) | Design: the Switch location? dialog for a work order at another location |
| [C715520](https://shopview.testrail.io/index.php?/cases/view/715520) | Design: the Switch location? dialog for a part sale at another location |
| [C715521](https://shopview.testrail.io/index.php?/cases/view/715521) | Design: A/R info icon and tooltip match Work In Progress |
| [C715522](https://shopview.testrail.io/index.php?/cases/view/715522) | Design: A/P info icon and tooltip match Work In Progress |
| [C715523](https://shopview.testrail.io/index.php?/cases/view/715523) | Design: A/R Collection customer row shows Phone and Credit term |
| [C715524](https://shopview.testrail.io/index.php?/cases/view/715524) | Design: A/R Summary PDF heading 91 And Over stays on one line |
| [C715525](https://shopview.testrail.io/index.php?/cases/view/715525) | Design: A/P Summary PDF heading 91 And Over stays on one line |
| [C715526](https://shopview.testrail.io/index.php?/cases/view/715526) | Design: A/R Collection PDF prints the call list on each customer's line |
| [C715529](https://shopview.testrail.io/index.php?/cases/view/715529) | Design: narrower than 1024 px the reports show the mobile filter row |
| [C715533](https://shopview.testrail.io/index.php?/cases/view/715533) | Design: A/R Summary sorted by Total matches the design picture |
| [C715535](https://shopview.testrail.io/index.php?/cases/view/715535) | Design: the Export menu matches the design picture |
| [C715536](https://shopview.testrail.io/index.php?/cases/view/715536) | Design: A/P Summary title row and ⋯ button match the design picture |
| [C715537](https://shopview.testrail.io/index.php?/cases/view/715537) | Design: the PDF-too-large message matches the design picture |
| [C715539](https://shopview.testrail.io/index.php?/cases/view/715539) | Design: the pinned customer row matches the design picture |
| [C715542](https://shopview.testrail.io/index.php?/cases/view/715542) | Design: the description tooltip matches the pictures in both themes |
| [C715545](https://shopview.testrail.io/index.php?/cases/view/715545) | Design: A/R Detail invoice numbers are blue links, credit memos plain text |
| [C715546](https://shopview.testrail.io/index.php?/cases/view/715546) | Design: the switch-location dialog frame matches the design pictures |
| [C715547](https://shopview.testrail.io/index.php?/cases/view/715547) | Design: A/R Detail opens on All locations as in the design picture |
| [C715548](https://shopview.testrail.io/index.php?/cases/view/715548) | Design: the Location menu with two locations matches the design picture |
| [C715549](https://shopview.testrail.io/index.php?/cases/view/715549) | Design: one location ticked hides the Location column as pictured |
| [C715550](https://shopview.testrail.io/index.php?/cases/view/715550) | Design: No locations shows the empty state with no Totals row |
| [C715551](https://shopview.testrail.io/index.php?/cases/view/715551) | Design: A/R Summary sorted by Location matches the design picture |
| [C715552](https://shopview.testrail.io/index.php?/cases/view/715552) | Design: clicking a customer on A/R Summary matches the drill-down picture |
| [C715553](https://shopview.testrail.io/index.php?/cases/view/715553) | Design: the Past due menu matches the design picture |
| [C715554](https://shopview.testrail.io/index.php?/cases/view/715554) | Design: Past due with two ranges ticked matches the design picture |
| [C715555](https://shopview.testrail.io/index.php?/cases/view/715555) | Design: the Vendor menu shows its search box and rows in order |
| [C715556](https://shopview.testrail.io/index.php?/cases/view/715556) | Design: two customers ticked look as in the design picture |
| [C715557](https://shopview.testrail.io/index.php?/cases/view/715557) | Design: the call list for one customer matches the design picture |
| [C715563](https://shopview.testrail.io/index.php?/cases/view/715563) | Design: A/R Detail and Collection headings are in Title Case |
| [C715456](https://shopview.testrail.io/index.php?/cases/view/715456) | A/R Summary: the Totals row adds up exactly the rows each filter leaves |
| [C715457](https://shopview.testrail.io/index.php?/cases/view/715457) | A/P Summary: the Totals row adds up exactly the rows each filter leaves |
| [C715458](https://shopview.testrail.io/index.php?/cases/view/715458) | A/R Detail: Totals follow the customer, Past due and Location filters |
| [C715459](https://shopview.testrail.io/index.php?/cases/view/715459) | A/R Collection: Totals follow the customer, Past due and Location filters |
| [C715460](https://shopview.testrail.io/index.php?/cases/view/715460) | A/P Detail: Totals follow the vendor, Past due and Location filters |
| [C715461](https://shopview.testrail.io/index.php?/cases/view/715461) | A/P Unpaid Invoices: Totals follow the vendor, Past due and Location filters |
| [C715462](https://shopview.testrail.io/index.php?/cases/view/715462) | A/R Summary: the Totals row leaves out overpaid invoices, as the rows do |
| [C715463](https://shopview.testrail.io/index.php?/cases/view/715463) | A/R Summary Totals equal A/R Detail's Open Balance, bucket by bucket |
| [C715464](https://shopview.testrail.io/index.php?/cases/view/715464) | A/P Summary Totals equal A/P Detail's Open Balance, bucket by bucket |
| [C715465](https://shopview.testrail.io/index.php?/cases/view/715465) | A/R Detail: the Past due ranges split at 30, 60 and 90 days exactly |
| [C715466](https://shopview.testrail.io/index.php?/cases/view/715466) | A/P Unpaid Invoices: the Past due ranges split at 30, 60 and 90 days exactly |
| [C715467](https://shopview.testrail.io/index.php?/cases/view/715467) | A/P Detail: a PDF over 2,000 rows is refused, the CSV downloads |
| [C715468](https://shopview.testrail.io/index.php?/cases/view/715468) | A/R Summary: a PDF of exactly 2,000 customers downloads, 2,001 is refused |
| [C715469](https://shopview.testrail.io/index.php?/cases/view/715469) | A/P Detail: a PDF of exactly 2,000 lines downloads, 2,001 is refused |
| [C715581](https://shopview.testrail.io/index.php?/cases/view/715581) | A/R Summary: a payment shows as soon as the report is reloaded |
| [C797945](https://shopview.testrail.io/index.php?/cases/view/797945) | A/R Summary and Detail Totals differ by what a Past due filter drops |
| [C797946](https://shopview.testrail.io/index.php?/cases/view/797946) | A/P Summary and Detail Totals differ by what a Past due filter drops |
| [C1062587](https://shopview.testrail.io/index.php?/cases/view/1062587) | A/R Summary and Detail count a credit dated on the as-of date in Current |
| [C1062588](https://shopview.testrail.io/index.php?/cases/view/1062588) | A/P Summary and Detail count a vendor credit dated on the as-of date in Current |
| [C715471](https://shopview.testrail.io/index.php?/cases/view/715471) | SV-12663 - After the staging deploy an untouched A/R report shows the same rows and amounts |
| [C715472](https://shopview.testrail.io/index.php?/cases/view/715472) | SV-12663 - After the staging deploy an untouched A/P report shows the same rows and amounts |
| [C715473](https://shopview.testrail.io/index.php?/cases/view/715473) | A/R PDF prints the as-of date you picked, late in the day too |
| [C715474](https://shopview.testrail.io/index.php?/cases/view/715474) | Reports page access alone opens all six reports with their amounts |
| [C715616](https://shopview.testrail.io/index.php?/cases/view/715616) | Reports page access alone exports the reports |
| [C715475](https://shopview.testrail.io/index.php?/cases/view/715475) | Inventory Value link, PDF and CSV work as before the staging deploy |
| [C715617](https://shopview.testrail.io/index.php?/cases/view/715617) | Sales By Customer link, PDF and CSV work as before the staging deploy |
| [C715618](https://shopview.testrail.io/index.php?/cases/view/715618) | Work In Progress link, PDF and CSV work as before the staging deploy |
| [C715476](https://shopview.testrail.io/index.php?/cases/view/715476) | Other reports keep their own export error message |
| [C715477](https://shopview.testrail.io/index.php?/cases/view/715477) | A work order link from another location still asks to switch |
| [C715479](https://shopview.testrail.io/index.php?/cases/view/715479) | The research ideas left out of this release do not appear |
| [C715480](https://shopview.testrail.io/index.php?/cases/view/715480) | The location switcher in the top right is unchanged |
| [C715582](https://shopview.testrail.io/index.php?/cases/view/715582) | A drill-down link saved before the staging deploy still opens on its customer |
| [C715583](https://shopview.testrail.io/index.php?/cases/view/715583) | Sales By Customer keeps or forgets its filter between visits as before |
| [C715619](https://shopview.testrail.io/index.php?/cases/view/715619) | Inventory Value keeps or forgets its filter between visits as before |
| [C715620](https://shopview.testrail.io/index.php?/cases/view/715620) | Work In Progress keeps or forgets its filter between visits as before |
| [C715584](https://shopview.testrail.io/index.php?/cases/view/715584) | Sales By Customer's filter menus behave as before the staging deploy |
| [C1062590](https://shopview.testrail.io/index.php?/cases/view/1062590) | A credit dated on the as-of date moves from 1-30 to Current |
| [C715273](https://shopview.testrail.io/index.php?/cases/view/715273) | A/R Summary opens with customers in name order, A to Z |
| [C715274](https://shopview.testrail.io/index.php?/cases/view/715274) | A/P Summary opens with vendors in name order, A to Z |
| [C715275](https://shopview.testrail.io/index.php?/cases/view/715275) | A/R Summary sorts accented customer names with their base letter |
| [C715276](https://shopview.testrail.io/index.php?/cases/view/715276) | A/P Summary sorts lower-case accented and joined letters as plain letters |
| [C715277](https://shopview.testrail.io/index.php?/cases/view/715277) | Two customer names that differ only in capitals keep one order everywhere |
| [C715278](https://shopview.testrail.io/index.php?/cases/view/715278) | Two vendor names that differ only in capitals keep one order everywhere |
| [C715279](https://shopview.testrail.io/index.php?/cases/view/715279) | A/R Summary lists Emile's Towing before Émile's Towing |
| [C715280](https://shopview.testrail.io/index.php?/cases/view/715280) | A/R Detail lists the five buckets in fixed order and rows by name |
| [C715281](https://shopview.testrail.io/index.php?/cases/view/715281) | A/P Detail lists the five buckets in fixed order and rows by name |
| [C715282](https://shopview.testrail.io/index.php?/cases/view/715282) | A/R Collection groups customers by name, rows oldest date first |
| [C715283](https://shopview.testrail.io/index.php?/cases/view/715283) | A/P Unpaid Invoices groups vendors by name, rows oldest date first |
| [C715284](https://shopview.testrail.io/index.php?/cases/view/715284) | Each A/R report opens with its opening column marked as sorted |
| [C715285](https://shopview.testrail.io/index.php?/cases/view/715285) | Each A/P report opens with its opening column marked as sorted |
| [C715286](https://shopview.testrail.io/index.php?/cases/view/715286) | Without Reports page access the six reports are not available |
| [C715287](https://shopview.testrail.io/index.php?/cases/view/715287) | A customer with nothing open on the as-of date is not listed |
| [C715573](https://shopview.testrail.io/index.php?/cases/view/715573) | A/R Summary sorts names that start with a punctuation mark by character |
| [C1062566](https://shopview.testrail.io/index.php?/cases/view/1062566) | A/R Detail: a credit memo or deposit dated on the as-of date is in Current |
| [C1062567](https://shopview.testrail.io/index.php?/cases/view/1062567) | A/P Detail: a vendor credit dated on the as-of date is Current, Past Due 0 |
| [C1062568](https://shopview.testrail.io/index.php?/cases/view/1062568) | A/R Collection: a credit dated on the as-of date shows Past Due 0 |
| [C1062569](https://shopview.testrail.io/index.php?/cases/view/1062569) | A/P Detail: a bill not yet due shows a negative Past Due |
| [C715288](https://shopview.testrail.io/index.php?/cases/view/715288) | A/R Summary: the customer name header reverses on its first click |
| [C715585](https://shopview.testrail.io/index.php?/cases/view/715585) | A/R Summary: the Location header sorts A to Z, then Z to A |
| [C715289](https://shopview.testrail.io/index.php?/cases/view/715289) | A/R Summary: Current, 1-30 Days and 31-60 Days sort largest first |
| [C715290](https://shopview.testrail.io/index.php?/cases/view/715290) | A/R Summary: 61-90 Days, 91 And Over and Total sort largest first |
| [C715291](https://shopview.testrail.io/index.php?/cases/view/715291) | A/P Summary: the vendor name header reverses on its first click |
| [C715586](https://shopview.testrail.io/index.php?/cases/view/715586) | A/P Summary: the Location header sorts A to Z, then Z to A |
| [C715292](https://shopview.testrail.io/index.php?/cases/view/715292) | A/P Summary: Current, 1-30 Days and 31-60 Days sort largest first |
| [C715293](https://shopview.testrail.io/index.php?/cases/view/715293) | A/P Summary: 61-90 Days, 91 And Over and Total sort largest first |
| [C715294](https://shopview.testrail.io/index.php?/cases/view/715294) | A/R Detail: the text column headers sort A to Z, then Z to A |
| [C715587](https://shopview.testrail.io/index.php?/cases/view/715587) | A/R Detail: the Customer Full Name header reverses on its first click |
| [C715295](https://shopview.testrail.io/index.php?/cases/view/715295) | A/R Detail: Date and Due Date sort oldest first, then newest first |
| [C715296](https://shopview.testrail.io/index.php?/cases/view/715296) | A/R Detail: money headers sort largest first |
| [C715297](https://shopview.testrail.io/index.php?/cases/view/715297) | A/R Detail: ID sorts by number value, and ties go by number |
| [C715298](https://shopview.testrail.io/index.php?/cases/view/715298) | A/R Collection: the text column headers sort A to Z, then Z to A |
| [C715299](https://shopview.testrail.io/index.php?/cases/view/715299) | A/R Collection: the Date header reverses on its first click |
| [C715588](https://shopview.testrail.io/index.php?/cases/view/715588) | A/R Collection: Due Date sorts oldest first, then newest first |
| [C715300](https://shopview.testrail.io/index.php?/cases/view/715300) | A/R Collection: money and Past Due headers sort largest first |
| [C715301](https://shopview.testrail.io/index.php?/cases/view/715301) | A/R Collection: ID sorts by number value, and ties go by number |
| [C715302](https://shopview.testrail.io/index.php?/cases/view/715302) | A/P Detail: the text column headers sort A to Z, then Z to A |
| [C715589](https://shopview.testrail.io/index.php?/cases/view/715589) | A/P Detail: the Vendor Name header reverses on its first click |
| [C715303](https://shopview.testrail.io/index.php?/cases/view/715303) | A/P Detail: Date and Due Date sort oldest first, then newest first |
| [C715304](https://shopview.testrail.io/index.php?/cases/view/715304) | A/P Detail: money and Past Due headers sort largest first |
| [C715305](https://shopview.testrail.io/index.php?/cases/view/715305) | A/P Detail: No. sorts by number value, and ties go by number |
| [C715306](https://shopview.testrail.io/index.php?/cases/view/715306) | A/P Unpaid Invoices: the text column headers sort A to Z, then Z to A |
| [C715590](https://shopview.testrail.io/index.php?/cases/view/715590) | A/P Unpaid Invoices: the Vendor Name header cannot be clicked |
| [C715307](https://shopview.testrail.io/index.php?/cases/view/715307) | A/P Unpaid Invoices: the Date header reverses on its first click |
| [C715591](https://shopview.testrail.io/index.php?/cases/view/715591) | A/P Unpaid Invoices: Due Date sorts oldest first, then newest first |
| [C715308](https://shopview.testrail.io/index.php?/cases/view/715308) | A/P Unpaid Invoices: money and Past Due headers sort largest first |
| [C715309](https://shopview.testrail.io/index.php?/cases/view/715309) | A/P Unpaid Invoices: No. sorts by number value, and ties go by number |
| [C715310](https://shopview.testrail.io/index.php?/cases/view/715310) | A/P Unpaid Invoices: a vendor credit stays at the bottom when Due Date is sorted |
| [C715311](https://shopview.testrail.io/index.php?/cases/view/715311) | A/P Detail: a vendor credit shows its own date as its Due Date |
| [C715312](https://shopview.testrail.io/index.php?/cases/view/715312) | A/R Detail: sorting moves rows, never groups, and keeps groups open |
| [C715313](https://shopview.testrail.io/index.php?/cases/view/715313) | A/R Collection: sorting moves rows, never groups, and keeps groups open |
| [C715314](https://shopview.testrail.io/index.php?/cases/view/715314) | A/P Detail: sorting moves rows, never groups, and keeps groups open |
| [C715315](https://shopview.testrail.io/index.php?/cases/view/715315) | A/P Unpaid Invoices: sorting moves rows, never groups, and keeps groups open |
| [C715317](https://shopview.testrail.io/index.php?/cases/view/715317) | A/R Detail: the sort stays while changing date, scrolling and filters |
| [C715320](https://shopview.testrail.io/index.php?/cases/view/715320) | A/P Detail: the sort stays while changing date, scrolling and filters |
| [C715322](https://shopview.testrail.io/index.php?/cases/view/715322) | A/R Collection: changing the Past due filter keeps the sort |
| [C715323](https://shopview.testrail.io/index.php?/cases/view/715323) | A/R Summary forgets the sort between visits |
| [C715592](https://shopview.testrail.io/index.php?/cases/view/715592) | A/R Detail forgets the sort between visits |
| [C715324](https://shopview.testrail.io/index.php?/cases/view/715324) | A/R Collection forgets the sort between visits |
| [C715593](https://shopview.testrail.io/index.php?/cases/view/715593) | A/P Summary forgets the sort between visits |
| [C715325](https://shopview.testrail.io/index.php?/cases/view/715325) | A/P Detail forgets the sort between visits |
| [C715594](https://shopview.testrail.io/index.php?/cases/view/715594) | A/P Unpaid Invoices forgets the sort between visits |
| [C715326](https://shopview.testrail.io/index.php?/cases/view/715326) | A/R Collection: a column where every row is the same does not reorder |
| [C797940](https://shopview.testrail.io/index.php?/cases/view/797940) | A/R Detail: column headings are in Title Case on screen, PDF and CSV |
| [C797941](https://shopview.testrail.io/index.php?/cases/view/797941) | A/R Collection: column headings are in Title Case on screen, PDF and CSV |
| [C797942](https://shopview.testrail.io/index.php?/cases/view/797942) | A/P Detail: column headings are in Title Case on screen, PDF and CSV |
| [C1062572](https://shopview.testrail.io/index.php?/cases/view/1062572) | A/R Detail: Date and Due Date read as dates, never Today or Yesterday |
| [C1062573](https://shopview.testrail.io/index.php?/cases/view/1062573) | A/P Detail: Date and Due Date read as dates, never Today or Yesterday |
| [C1062574](https://shopview.testrail.io/index.php?/cases/view/1062574) | A/R Detail: Transaction Type names Credit Memo and Deposit and sorts them |
| [C1062575](https://shopview.testrail.io/index.php?/cases/view/1062575) | A/P Detail: Transaction Type names Vendor Credit and sorts it after Invoice |
| [C1062576](https://shopview.testrail.io/index.php?/cases/view/1062576) | A/R Detail: the PDF and CSV name each credit as the screen does |
| [C1062577](https://shopview.testrail.io/index.php?/cases/view/1062577) | A/R Summary: a Location sort returns to name order when one location is left |
| [C1062578](https://shopview.testrail.io/index.php?/cases/view/1062578) | A/R Collection: a Location sort returns to Date order when one location is left |
| [C1062579](https://shopview.testrail.io/index.php?/cases/view/1062579) | A/R Summary: a Location sort falls back when a new date leaves one location |
| [C715327](https://shopview.testrail.io/index.php?/cases/view/715327) | A/R Summary has the Export menu with PDF and CSV |
| [C715595](https://shopview.testrail.io/index.php?/cases/view/715595) | A/R Detail has the Export menu with PDF and CSV |
| [C715596](https://shopview.testrail.io/index.php?/cases/view/715596) | A/R Collection has the Export menu with PDF and CSV |
| [C715328](https://shopview.testrail.io/index.php?/cases/view/715328) | A/P Summary has the Export menu with PDF and CSV |
| [C715597](https://shopview.testrail.io/index.php?/cases/view/715597) | A/P Detail has the Export menu with PDF and CSV |
| [C715598](https://shopview.testrail.io/index.php?/cases/view/715598) | A/P Unpaid Invoices has the Export menu with PDF and CSV |
| [C715329](https://shopview.testrail.io/index.php?/cases/view/715329) | A/R Summary: the PDF and CSV match the rows and order on screen |
| [C715330](https://shopview.testrail.io/index.php?/cases/view/715330) | A/R Detail: the PDF and CSV match the rows and order on screen |
| [C715331](https://shopview.testrail.io/index.php?/cases/view/715331) | A/R Collection: the PDF and CSV match the rows and order on screen |
| [C715332](https://shopview.testrail.io/index.php?/cases/view/715332) | A/P Summary: the PDF and CSV match the rows and order on screen |
| [C715333](https://shopview.testrail.io/index.php?/cases/view/715333) | A/P Detail: the PDF and CSV match the rows and order on screen |
| [C715334](https://shopview.testrail.io/index.php?/cases/view/715334) | A/P Unpaid Invoices: the PDF and CSV match the rows and order on screen |
| [C715335](https://shopview.testrail.io/index.php?/cases/view/715335) | A/R Summary: each export states the as-of date and the filters |
| [C715336](https://shopview.testrail.io/index.php?/cases/view/715336) | A/R Detail: each export states the as-of date and the filters |
| [C715337](https://shopview.testrail.io/index.php?/cases/view/715337) | A/R Collection: each export states the as-of date and the filters |
| [C715338](https://shopview.testrail.io/index.php?/cases/view/715338) | A/P Summary: each export states the as-of date and the filters |
| [C715339](https://shopview.testrail.io/index.php?/cases/view/715339) | A/P Detail: each export states the as-of date and the filters |
| [C715340](https://shopview.testrail.io/index.php?/cases/view/715340) | A/P Unpaid Invoices: each export states the as-of date and the filters |
| [C715341](https://shopview.testrail.io/index.php?/cases/view/715341) | A/R Summary: exports say All locations and add only the lines that are set |
| [C715342](https://shopview.testrail.io/index.php?/cases/view/715342) | A/P Detail: exports say All locations and add only the lines that are set |
| [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) | A/R Detail: exports list the ticked locations in A to Z order |
| [C715344](https://shopview.testrail.io/index.php?/cases/view/715344) | A/R Summary: the CSV is one flat table with plain two-decimal amounts |
| [C715345](https://shopview.testrail.io/index.php?/cases/view/715345) | A/P Summary: the CSV is one flat table with plain two-decimal amounts |
| [C715346](https://shopview.testrail.io/index.php?/cases/view/715346) | A/R Detail: the CSV has one row per document and no group rows |
| [C715347](https://shopview.testrail.io/index.php?/cases/view/715347) | A/R Collection: the CSV has one row per document and no group rows |
| [C715348](https://shopview.testrail.io/index.php?/cases/view/715348) | A/P Detail: the CSV has one row per document and no group rows |
| [C715349](https://shopview.testrail.io/index.php?/cases/view/715349) | A/P Unpaid Invoices: the CSV has one row per document and no group rows |
| [C715350](https://shopview.testrail.io/index.php?/cases/view/715350) | A/R Summary: exporting an empty report downloads nothing and warns |
| [C715351](https://shopview.testrail.io/index.php?/cases/view/715351) | A/P Unpaid Invoices: exporting an empty report downloads nothing and warns |
| [C715352](https://shopview.testrail.io/index.php?/cases/view/715352) | A/R Detail: a CSV export that fails shows one error and downloads nothing |
| [C715353](https://shopview.testrail.io/index.php?/cases/view/715353) | A/P Summary: a PDF export that fails shows one error and downloads nothing |
| [C715574](https://shopview.testrail.io/index.php?/cases/view/715574) | A/R Detail: exporting with every bucket closed still downloads every row |
| [C715575](https://shopview.testrail.io/index.php?/cases/view/715575) | A/P Detail: exporting with every bucket closed still downloads every row |
| [C715576](https://shopview.testrail.io/index.php?/cases/view/715576) | A/R Summary: a name starting with = opens in the CSV as plain text |
| [C1062580](https://shopview.testrail.io/index.php?/cases/view/1062580) | A/R Detail: the PDF prints a credit's amount in brackets with a minus sign |
| [C1062581](https://shopview.testrail.io/index.php?/cases/view/1062581) | A/R Detail: the PDF prints dates as month, two-digit day and year |
| [C715362](https://shopview.testrail.io/index.php?/cases/view/715362) | A/R Detail: the group row stays pinned under the headings |
| [C715363](https://shopview.testrail.io/index.php?/cases/view/715363) | A/R Collection: the group row stays pinned under the headings |
| [C715364](https://shopview.testrail.io/index.php?/cases/view/715364) | A/P Detail: the group row stays pinned under the headings |
| [C715365](https://shopview.testrail.io/index.php?/cases/view/715365) | A/P Unpaid Invoices: the group row stays pinned under the headings |
| [C715368](https://shopview.testrail.io/index.php?/cases/view/715368) | A/R Detail does not remember expanded groups |
| [C715603](https://shopview.testrail.io/index.php?/cases/view/715603) | A/R Collection does not remember expanded groups |
| [C715369](https://shopview.testrail.io/index.php?/cases/view/715369) | A/P Detail does not remember expanded groups |
| [C715604](https://shopview.testrail.io/index.php?/cases/view/715604) | A/P Unpaid Invoices does not remember expanded groups |
| [C715370](https://shopview.testrail.io/index.php?/cases/view/715370) | A/R Detail: changing the date or a filter collapses every group |
| [C715371](https://shopview.testrail.io/index.php?/cases/view/715371) | A/R Collection: changing the date or a filter collapses every group |
| [C715372](https://shopview.testrail.io/index.php?/cases/view/715372) | A/P Detail: changing the date or a filter collapses every group |
| [C715373](https://shopview.testrail.io/index.php?/cases/view/715373) | A/P Unpaid Invoices: changing the date or a filter collapses every group |
| [C715374](https://shopview.testrail.io/index.php?/cases/view/715374) | A/R Summary has no Collapse all button |
| [C715605](https://shopview.testrail.io/index.php?/cases/view/715605) | A/P Summary has no Collapse all button |
| [C1062582](https://shopview.testrail.io/index.php?/cases/view/1062582) | A/R Detail: a bucket that cannot load its lines says so |
| [C1062583](https://shopview.testrail.io/index.php?/cases/view/1062583) | A/P Detail: lines that stop loading while scrolling leave a message |
| [C715375](https://shopview.testrail.io/index.php?/cases/view/715375) | A/R Summary: the filter row reads As of, Customer, Past due, Location |
| [C715376](https://shopview.testrail.io/index.php?/cases/view/715376) | A/R Detail: the filter row reads As of, Customer, Past due, Location |
| [C715377](https://shopview.testrail.io/index.php?/cases/view/715377) | A/R Collection: the filter row reads As of, Customer, Past due, Location |
| [C715378](https://shopview.testrail.io/index.php?/cases/view/715378) | A/P Summary: the filter row reads As of, Vendor, Past due, Location |
| [C715379](https://shopview.testrail.io/index.php?/cases/view/715379) | A/P Detail: the filter row reads As of, Vendor, Past due, Location |
| [C715380](https://shopview.testrail.io/index.php?/cases/view/715380) | A/P Unpaid Invoices: the filter row reads As of, Vendor, Past due, Location |
| [C715381](https://shopview.testrail.io/index.php?/cases/view/715381) | A/R Detail: the Location menu lists the locations, ticked ones first |
| [C715382](https://shopview.testrail.io/index.php?/cases/view/715382) | A/P Summary: the Location menu lists the locations, ticked ones first |
| [C715383](https://shopview.testrail.io/index.php?/cases/view/715383) | A/R Summary: the Location menu has a search box above 8 locations |
| [C715384](https://shopview.testrail.io/index.php?/cases/view/715384) | A/R Collection: every location is listed, whatever your enrollment |
| [C715606](https://shopview.testrail.io/index.php?/cases/view/715606) | A/R Collection: the filters do not narrow the Location list |
| [C715607](https://shopview.testrail.io/index.php?/cases/view/715607) | A/R Collection: the Location list changes with the as-of date |
| [C715385](https://shopview.testrail.io/index.php?/cases/view/715385) | A/P Unpaid Invoices: every location is listed, whatever your enrollment |
| [C715608](https://shopview.testrail.io/index.php?/cases/view/715608) | A/P Unpaid Invoices: the filters do not narrow the Location list |
| [C715609](https://shopview.testrail.io/index.php?/cases/view/715609) | A/P Unpaid Invoices: the Location list changes with the as-of date |
| [C715386](https://shopview.testrail.io/index.php?/cases/view/715386) | Location names in the menu and column match the location switcher |
| [C715387](https://shopview.testrail.io/index.php?/cases/view/715387) | A/R Summary: the Location chip reads all, a count, one name or none |
| [C715388](https://shopview.testrail.io/index.php?/cases/view/715388) | A/P Detail: with no location ticked the report is empty |
| [C715389](https://shopview.testrail.io/index.php?/cases/view/715389) | A/R Detail: each row belongs to its own document's location |
| [C715390](https://shopview.testrail.io/index.php?/cases/view/715390) | A/P Detail: a bill belongs to the location of its delivery |
| [C715391](https://shopview.testrail.io/index.php?/cases/view/715391) | A/P Unpaid Invoices: a vendor credit belongs to its return or vendor |
| [C715393](https://shopview.testrail.io/index.php?/cases/view/715393) | A/R Collection: ticked locations survive reload, Back and a shared link |
| [C715394](https://shopview.testrail.io/index.php?/cases/view/715394) | A/P Summary: a link naming several locations or every location |
| [C715395](https://shopview.testrail.io/index.php?/cases/view/715395) | A/R Detail: a link with an unknown location ignores it |
| [C715396](https://shopview.testrail.io/index.php?/cases/view/715396) | A/P Unpaid Invoices: a Past due value the chip does not offer reads Any |
| [C715397](https://shopview.testrail.io/index.php?/cases/view/715397) | A/R Summary: ticked customers and ranges survive reload and Back |
| [C715398](https://shopview.testrail.io/index.php?/cases/view/715398) | A/R Collection: a customer ticked by link is named even if hard to find |
| [C715399](https://shopview.testrail.io/index.php?/cases/view/715399) | A/P Unpaid Invoices: opening from the Reports menu starts with no filters |
| [C715400](https://shopview.testrail.io/index.php?/cases/view/715400) | A/R Summary: clicking a customer opens A/R Collection with the same filters |
| [C715401](https://shopview.testrail.io/index.php?/cases/view/715401) | A/P Summary: clicking a vendor opens A/P Unpaid Invoices with the same filters |
| [C715402](https://shopview.testrail.io/index.php?/cases/view/715402) | A/R Detail: the Customer menu ticks several customers and the chip counts them |
| [C715403](https://shopview.testrail.io/index.php?/cases/view/715403) | A/P Detail: the Vendor menu ticks several vendors and the chip counts them |
| [C715404](https://shopview.testrail.io/index.php?/cases/view/715404) | A/R Collection: the Past due menu offers Any and four ranges in order |
| [C715405](https://shopview.testrail.io/index.php?/cases/view/715405) | A/P Summary: the Past due menu offers Any and four ranges in order |
| [C715406](https://shopview.testrail.io/index.php?/cases/view/715406) | A/R Summary: no rows after a customer pick, and the Location chip stays |
| [C715407](https://shopview.testrail.io/index.php?/cases/view/715407) | A/R Collection: switching location in the top right reloads the report |
| [C715408](https://shopview.testrail.io/index.php?/cases/view/715408) | A/P Detail: switching location in the top right reloads the report |
| [C715577](https://shopview.testrail.io/index.php?/cases/view/715577) | A/R Collection: a link with an unknown customer ignores it |
| [C715578](https://shopview.testrail.io/index.php?/cases/view/715578) | A/P Unpaid Invoices: a link with an unknown vendor ignores it |
| [C715580](https://shopview.testrail.io/index.php?/cases/view/715580) | A/R Summary: ticking several customers quickly shows rows for all of them |
| [C797943](https://shopview.testrail.io/index.php?/cases/view/797943) | A/P Summary: the Vendor menu has no search box with 8 vendors or fewer |
| [C715409](https://shopview.testrail.io/index.php?/cases/view/715409) | A/R reports: the column is named Location and sits in its place |
| [C715410](https://shopview.testrail.io/index.php?/cases/view/715410) | A/P reports: the column is named Location and sits in its place |
| [C715411](https://shopview.testrail.io/index.php?/cases/view/715411) | A/R Collection: the Location column shows with two or more locations |
| [C715412](https://shopview.testrail.io/index.php?/cases/view/715412) | A/R Summary: a row shows one location's name or Multiple |
| [C715413](https://shopview.testrail.io/index.php?/cases/view/715413) | A/P Summary: a row shows one location's name or Multiple |
| [C715414](https://shopview.testrail.io/index.php?/cases/view/715414) | A/R Detail: an invoice at your location opens its finance page |
| [C715415](https://shopview.testrail.io/index.php?/cases/view/715415) | A/R Collection: a part sale invoice at your location opens its finance page |
| [C715416](https://shopview.testrail.io/index.php?/cases/view/715416) | A/R Detail: a work order invoice at another location asks to switch |
| [C715417](https://shopview.testrail.io/index.php?/cases/view/715417) | A/R Collection: a part sale invoice at another location asks to switch |
| [C715418](https://shopview.testrail.io/index.php?/cases/view/715418) | A/R Collection: Cancel on the switch prompt leaves the report as it was |
| [C715419](https://shopview.testrail.io/index.php?/cases/view/715419) | A/P Detail: a bill opens its delivery here and is plain text elsewhere |
| [C715420](https://shopview.testrail.io/index.php?/cases/view/715420) | A/P Detail: a vendor credit links to the return it came from |
| [C715421](https://shopview.testrail.io/index.php?/cases/view/715421) | A/P Unpaid Invoices: a vendor credit links to the return it came from |
| [C715422](https://shopview.testrail.io/index.php?/cases/view/715422) | A/R Detail: opening an invoice link in a new tab asks there |
| [C715423](https://shopview.testrail.io/index.php?/cases/view/715423) | A/R Detail: credit memos and deposits are plain text |
| [C715424](https://shopview.testrail.io/index.php?/cases/view/715424) | A/R Detail: a document at a location you are not enrolled in is plain text |
| [C715425](https://shopview.testrail.io/index.php?/cases/view/715425) | With Invoicing and Work Orders View, a work order invoice is a link |
| [C715426](https://shopview.testrail.io/index.php?/cases/view/715426) | Without Invoicing View, work order and part sale invoices are plain text |
| [C715427](https://shopview.testrail.io/index.php?/cases/view/715427) | With Invoicing and Part Sales View only, only part sale invoices link |
| [C715428](https://shopview.testrail.io/index.php?/cases/view/715428) | With Vendor Order Management View, a bill at your location is a link |
| [C715429](https://shopview.testrail.io/index.php?/cases/view/715429) | With Vendor Order Management Create & Edit, a bill at your location is a link |
| [C715430](https://shopview.testrail.io/index.php?/cases/view/715430) | Without Vendor Order Management, bills and vendor credits are plain text |
| [C715431](https://shopview.testrail.io/index.php?/cases/view/715431) | A/R Summary: with Customers View, customer names link to A/R Collection |
| [C715610](https://shopview.testrail.io/index.php?/cases/view/715610) | A/R Summary: without Customers View, customer names are plain text |
| [C715432](https://shopview.testrail.io/index.php?/cases/view/715432) | A/P Summary: vendor names link for everyone who can open the report |
| [C797944](https://shopview.testrail.io/index.php?/cases/view/797944) | A/R Detail: the × on the switch prompt leaves the report as it was |
| [C715433](https://shopview.testrail.io/index.php?/cases/view/715433) | A/R Summary: the info icon shows the report's description |
| [C715434](https://shopview.testrail.io/index.php?/cases/view/715434) | A/R Detail: the info icon shows the report's description |
| [C715435](https://shopview.testrail.io/index.php?/cases/view/715435) | A/R Collection: the info icon shows the report's description |
| [C715436](https://shopview.testrail.io/index.php?/cases/view/715436) | A/P Summary: the info icon shows the report's description |
| [C715437](https://shopview.testrail.io/index.php?/cases/view/715437) | A/P Detail: the info icon shows the report's description |
| [C715438](https://shopview.testrail.io/index.php?/cases/view/715438) | A/P Unpaid Invoices: the info icon shows the report's description |
| [C715439](https://shopview.testrail.io/index.php?/cases/view/715439) | A/R Summary: the description is not in the PDF or CSV |
| [C715611](https://shopview.testrail.io/index.php?/cases/view/715611) | A/P Unpaid Invoices: the description is not in the PDF or CSV |
| [C715440](https://shopview.testrail.io/index.php?/cases/view/715440) | A/R Detail: Clear all filters keeps the date and resets the rest |
| [C715441](https://shopview.testrail.io/index.php?/cases/view/715441) | A/P Detail: Clear all filters keeps the date and resets the rest |
| [C715442](https://shopview.testrail.io/index.php?/cases/view/715442) | A/R Collection: a report that fails to load says so in place of the rows |
| [C715443](https://shopview.testrail.io/index.php?/cases/view/715443) | A/P Summary: a report that fails to load says so in place of the rows |
| [C715444](https://shopview.testrail.io/index.php?/cases/view/715444) | A/P Detail: the progress bar shows while the report loads |
| [C715449](https://shopview.testrail.io/index.php?/cases/view/715449) | A/R Collection: a tap on the info icon shows the description |
| [C715445](https://shopview.testrail.io/index.php?/cases/view/715445) | A/R Collection: each customer row shows phone and credit term |
| [C715446](https://shopview.testrail.io/index.php?/cases/view/715446) | A/R Collection: a customer with no phone shows no Phone label |
| [C715447](https://shopview.testrail.io/index.php?/cases/view/715447) | A/R Collection: the PDF and CSV carry the phone and credit term |
| [C715448](https://shopview.testrail.io/index.php?/cases/view/715448) | A/R Collection: without AP/AR Data access there is no credit term |

## 3. New cases (folder "Setup needed before testing", run 557, Mudassir)

| Key | Title | What it checks |
|---|---|---|
| S3-33 (no C-id yet) | A/R Detail: the PDF ends each bucket with its "Total for" row | S3-R7b: the A/R Detail PDF ends each bucket with "Total for <bucket>", same totals as the screen, never "Subtotal". |
| S3-35 (no C-id yet) | A/P Detail: the PDF ends each bucket with its "Total for" row | S3-R7b: the A/P Detail PDF ends each bucket with "Total for <bucket>", never "Subtotal". |
| S3-34 (no C-id yet) | A/R Collection: the PDF ends each customer with its "Total for" row | S3-R7b: the A/R Collection PDF ends each customer with "Total for <name>"; a long name with & " ' < > prints exactly and wraps. |
| S3-36 (no C-id yet) | A/P Unpaid Invoices: the PDF ends each vendor with its "Total for" row | S3-R7b: the A/P Unpaid Invoices PDF ends each vendor with "Total for <name>"; a long name with & " ' < > prints exactly and wraps. |
| S5-43 (no C-id yet) | A/R Detail: the PDF and CSV print an as-of date after today | S5-R10b: with an as-of date after today, the PDF and CSV print that day (not today). |
| S5-41b (no C-id yet) | A/R Detail: a new as-of date with one location left hides the chip | S5-E3: after a new as-of date with no ticked location left and one location in the list, the Location chip is hidden. |
| S2-51 (no C-id yet) | A/R Summary: a blank bucket cell stays at the bottom in both sort orders | SV-12723 / S2-R6: on A/R Summary a blank bucket cell stays at the bottom both ways; long name with & " ' < >; headings do not move. |
| S2-52 (no C-id yet) | A/P Summary: a blank bucket cell stays at the bottom in both sort orders | SV-12723 / S2-R6: the same on A/P Summary. |

Already covered elsewhere, not duplicated: D-95 (Demo Day; A/R Collection PDF Total row); C1078980 and C1078981 (another author's cases in run 557: picking a later date on A/R Summary, a saved link with a later date).

## 4. Edits made on 11-12 Nov that are kept

| Case | Live folder | What was edited on 11-12 Nov (kept) |
|---|---|---|
| [C715481](https://shopview.testrail.io/index.php?/cases/view/715481) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715621](https://shopview.testrail.io/index.php?/cases/view/715621) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715622](https://shopview.testrail.io/index.php?/cases/view/715622) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715482](https://shopview.testrail.io/index.php?/cases/view/715482) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715483](https://shopview.testrail.io/index.php?/cases/view/715483) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715623](https://shopview.testrail.io/index.php?/cases/view/715623) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715624](https://shopview.testrail.io/index.php?/cases/view/715624) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715485](https://shopview.testrail.io/index.php?/cases/view/715485) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715486](https://shopview.testrail.io/index.php?/cases/view/715486) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715487](https://shopview.testrail.io/index.php?/cases/view/715487) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715625](https://shopview.testrail.io/index.php?/cases/view/715625) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715626](https://shopview.testrail.io/index.php?/cases/view/715626) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715488](https://shopview.testrail.io/index.php?/cases/view/715488) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715489](https://shopview.testrail.io/index.php?/cases/view/715489) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715490](https://shopview.testrail.io/index.php?/cases/view/715490) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715627](https://shopview.testrail.io/index.php?/cases/view/715627) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715628](https://shopview.testrail.io/index.php?/cases/view/715628) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715491](https://shopview.testrail.io/index.php?/cases/view/715491) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715492](https://shopview.testrail.io/index.php?/cases/view/715492) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715493](https://shopview.testrail.io/index.php?/cases/view/715493) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715629](https://shopview.testrail.io/index.php?/cases/view/715629) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715630](https://shopview.testrail.io/index.php?/cases/view/715630) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715494](https://shopview.testrail.io/index.php?/cases/view/715494) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715495](https://shopview.testrail.io/index.php?/cases/view/715495) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715631](https://shopview.testrail.io/index.php?/cases/view/715631) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715632](https://shopview.testrail.io/index.php?/cases/view/715632) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715497](https://shopview.testrail.io/index.php?/cases/view/715497) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715498](https://shopview.testrail.io/index.php?/cases/view/715498) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715499](https://shopview.testrail.io/index.php?/cases/view/715499) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715633](https://shopview.testrail.io/index.php?/cases/view/715633) | Design — how it looks | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715500](https://shopview.testrail.io/index.php?/cases/view/715500) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715634](https://shopview.testrail.io/index.php?/cases/view/715634) | Design — how it looks | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715501](https://shopview.testrail.io/index.php?/cases/view/715501) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715635](https://shopview.testrail.io/index.php?/cases/view/715635) | Design — how it looks | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715502](https://shopview.testrail.io/index.php?/cases/view/715502) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715636](https://shopview.testrail.io/index.php?/cases/view/715636) | Design — how it looks | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715503](https://shopview.testrail.io/index.php?/cases/view/715503) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715637](https://shopview.testrail.io/index.php?/cases/view/715637) | Design — how it looks | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715504](https://shopview.testrail.io/index.php?/cases/view/715504) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715638](https://shopview.testrail.io/index.php?/cases/view/715638) | Design — how it looks | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715506](https://shopview.testrail.io/index.php?/cases/view/715506) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715507](https://shopview.testrail.io/index.php?/cases/view/715507) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715508](https://shopview.testrail.io/index.php?/cases/view/715508) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715509](https://shopview.testrail.io/index.php?/cases/view/715509) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715510](https://shopview.testrail.io/index.php?/cases/view/715510) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715511](https://shopview.testrail.io/index.php?/cases/view/715511) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715513](https://shopview.testrail.io/index.php?/cases/view/715513) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715514](https://shopview.testrail.io/index.php?/cases/view/715514) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715515](https://shopview.testrail.io/index.php?/cases/view/715515) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715516](https://shopview.testrail.io/index.php?/cases/view/715516) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715517](https://shopview.testrail.io/index.php?/cases/view/715517) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715518](https://shopview.testrail.io/index.php?/cases/view/715518) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715519](https://shopview.testrail.io/index.php?/cases/view/715519) | Design — how it looks | expected result: build line, AUTOMATION marker, wording changed |
| [C715520](https://shopview.testrail.io/index.php?/cases/view/715520) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715521](https://shopview.testrail.io/index.php?/cases/view/715521) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715522](https://shopview.testrail.io/index.php?/cases/view/715522) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715523](https://shopview.testrail.io/index.php?/cases/view/715523) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715524](https://shopview.testrail.io/index.php?/cases/view/715524) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715525](https://shopview.testrail.io/index.php?/cases/view/715525) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715526](https://shopview.testrail.io/index.php?/cases/view/715526) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715527](https://shopview.testrail.io/index.php?/cases/view/715527) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715528](https://shopview.testrail.io/index.php?/cases/view/715528) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715529](https://shopview.testrail.io/index.php?/cases/view/715529) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715532](https://shopview.testrail.io/index.php?/cases/view/715532) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715533](https://shopview.testrail.io/index.php?/cases/view/715533) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | Design — how it looks | expected result: build line, AUTOMATION marker, wording changed |
| [C715535](https://shopview.testrail.io/index.php?/cases/view/715535) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715536](https://shopview.testrail.io/index.php?/cases/view/715536) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715537](https://shopview.testrail.io/index.php?/cases/view/715537) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715539](https://shopview.testrail.io/index.php?/cases/view/715539) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715540](https://shopview.testrail.io/index.php?/cases/view/715540) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715541](https://shopview.testrail.io/index.php?/cases/view/715541) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715542](https://shopview.testrail.io/index.php?/cases/view/715542) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715543](https://shopview.testrail.io/index.php?/cases/view/715543) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715544](https://shopview.testrail.io/index.php?/cases/view/715544) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715545](https://shopview.testrail.io/index.php?/cases/view/715545) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715546](https://shopview.testrail.io/index.php?/cases/view/715546) | Design — how it looks | expected result: build line, AUTOMATION marker, wording changed |
| [C715547](https://shopview.testrail.io/index.php?/cases/view/715547) | Design — how it looks | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715548](https://shopview.testrail.io/index.php?/cases/view/715548) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715549](https://shopview.testrail.io/index.php?/cases/view/715549) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715550](https://shopview.testrail.io/index.php?/cases/view/715550) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715551](https://shopview.testrail.io/index.php?/cases/view/715551) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715552](https://shopview.testrail.io/index.php?/cases/view/715552) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715553](https://shopview.testrail.io/index.php?/cases/view/715553) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715554](https://shopview.testrail.io/index.php?/cases/view/715554) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715555](https://shopview.testrail.io/index.php?/cases/view/715555) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715556](https://shopview.testrail.io/index.php?/cases/view/715556) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715557](https://shopview.testrail.io/index.php?/cases/view/715557) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715563](https://shopview.testrail.io/index.php?/cases/view/715563) | Design — how it looks | expected result: build line, AUTOMATION marker |
| [C715450](https://shopview.testrail.io/index.php?/cases/view/715450) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715612](https://shopview.testrail.io/index.php?/cases/view/715612) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715451](https://shopview.testrail.io/index.php?/cases/view/715451) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715613](https://shopview.testrail.io/index.php?/cases/view/715613) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715452](https://shopview.testrail.io/index.php?/cases/view/715452) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715614](https://shopview.testrail.io/index.php?/cases/view/715614) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715453](https://shopview.testrail.io/index.php?/cases/view/715453) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715615](https://shopview.testrail.io/index.php?/cases/view/715615) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715454](https://shopview.testrail.io/index.php?/cases/view/715454) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715455](https://shopview.testrail.io/index.php?/cases/view/715455) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715456](https://shopview.testrail.io/index.php?/cases/view/715456) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715457](https://shopview.testrail.io/index.php?/cases/view/715457) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715458](https://shopview.testrail.io/index.php?/cases/view/715458) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715459](https://shopview.testrail.io/index.php?/cases/view/715459) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715460](https://shopview.testrail.io/index.php?/cases/view/715460) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715461](https://shopview.testrail.io/index.php?/cases/view/715461) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715462](https://shopview.testrail.io/index.php?/cases/view/715462) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715463](https://shopview.testrail.io/index.php?/cases/view/715463) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715464](https://shopview.testrail.io/index.php?/cases/view/715464) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715465](https://shopview.testrail.io/index.php?/cases/view/715465) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715466](https://shopview.testrail.io/index.php?/cases/view/715466) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715467](https://shopview.testrail.io/index.php?/cases/view/715467) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715468](https://shopview.testrail.io/index.php?/cases/view/715468) | Totals and counts — exact amounts | expected result: build line |
| [C715469](https://shopview.testrail.io/index.php?/cases/view/715469) | Totals and counts — exact amounts | expected result: build line, AUTOMATION marker |
| [C715581](https://shopview.testrail.io/index.php?/cases/view/715581) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C797945](https://shopview.testrail.io/index.php?/cases/view/797945) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C797946](https://shopview.testrail.io/index.php?/cases/view/797946) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062587](https://shopview.testrail.io/index.php?/cases/view/1062587) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062588](https://shopview.testrail.io/index.php?/cases/view/1062588) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062589](https://shopview.testrail.io/index.php?/cases/view/1062589) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715471](https://shopview.testrail.io/index.php?/cases/view/715471) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; steps: wording changed; expected result: build line, wording changed |
| [C715472](https://shopview.testrail.io/index.php?/cases/view/715472) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; steps: wording changed; expected result: build line, wording changed |
| [C715473](https://shopview.testrail.io/index.php?/cases/view/715473) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715474](https://shopview.testrail.io/index.php?/cases/view/715474) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715616](https://shopview.testrail.io/index.php?/cases/view/715616) | Setup needed before testing | preconditions: wording changed, Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715475](https://shopview.testrail.io/index.php?/cases/view/715475) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; steps: wording changed; expected result: build line, wording changed |
| [C715617](https://shopview.testrail.io/index.php?/cases/view/715617) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; steps: wording changed; expected result: build line, wording changed |
| [C715618](https://shopview.testrail.io/index.php?/cases/view/715618) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; steps: wording changed; expected result: build line, wording changed |
| [C715476](https://shopview.testrail.io/index.php?/cases/view/715476) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, wording changed |
| [C715477](https://shopview.testrail.io/index.php?/cases/view/715477) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715479](https://shopview.testrail.io/index.php?/cases/view/715479) | Run on Staging After the Feature Is Deployed | steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715480](https://shopview.testrail.io/index.php?/cases/view/715480) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, wording changed |
| [C715582](https://shopview.testrail.io/index.php?/cases/view/715582) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; steps: wording changed; expected result: build line, wording changed |
| [C715583](https://shopview.testrail.io/index.php?/cases/view/715583) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, wording changed |
| [C715619](https://shopview.testrail.io/index.php?/cases/view/715619) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, wording changed |
| [C715620](https://shopview.testrail.io/index.php?/cases/view/715620) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, wording changed |
| [C715584](https://shopview.testrail.io/index.php?/cases/view/715584) | Run on Staging After the Feature Is Deployed | title: wording changed; preconditions: wording changed; expected result: build line, wording changed |
| [C1062590](https://shopview.testrail.io/index.php?/cases/view/1062590) | Run on Staging After the Feature Is Deployed | preconditions: wording changed; expected result: build line, wording changed |
| [C715273](https://shopview.testrail.io/index.php?/cases/view/715273) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715274](https://shopview.testrail.io/index.php?/cases/view/715274) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715275](https://shopview.testrail.io/index.php?/cases/view/715275) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715276](https://shopview.testrail.io/index.php?/cases/view/715276) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715277](https://shopview.testrail.io/index.php?/cases/view/715277) | Retired - cannot be set up (QA lead 11 and 12 Nov 2026) | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715278](https://shopview.testrail.io/index.php?/cases/view/715278) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715279](https://shopview.testrail.io/index.php?/cases/view/715279) | Retired - cannot be set up (QA lead 11 and 12 Nov 2026) | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715280](https://shopview.testrail.io/index.php?/cases/view/715280) | S1 — Reports open in QuickBooks name order | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715281](https://shopview.testrail.io/index.php?/cases/view/715281) | S1 — Reports open in QuickBooks name order | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715282](https://shopview.testrail.io/index.php?/cases/view/715282) | S1 — Reports open in QuickBooks name order | expected result: build line, AUTOMATION marker, wording changed |
| [C715283](https://shopview.testrail.io/index.php?/cases/view/715283) | S1 — Reports open in QuickBooks name order | steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715284](https://shopview.testrail.io/index.php?/cases/view/715284) | S1 — Reports open in QuickBooks name order | expected result: build line, AUTOMATION marker |
| [C715285](https://shopview.testrail.io/index.php?/cases/view/715285) | S1 — Reports open in QuickBooks name order | expected result: build line, AUTOMATION marker |
| [C715286](https://shopview.testrail.io/index.php?/cases/view/715286) | Setup needed before testing | preconditions: wording changed, Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715287](https://shopview.testrail.io/index.php?/cases/view/715287) | S1 — Reports open in QuickBooks name order | expected result: build line, AUTOMATION marker |
| [C715573](https://shopview.testrail.io/index.php?/cases/view/715573) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062566](https://shopview.testrail.io/index.php?/cases/view/1062566) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062567](https://shopview.testrail.io/index.php?/cases/view/1062567) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062568](https://shopview.testrail.io/index.php?/cases/view/1062568) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062569](https://shopview.testrail.io/index.php?/cases/view/1062569) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062570](https://shopview.testrail.io/index.php?/cases/view/1062570) | S1 — Reports open in QuickBooks name order | expected result: build line, AUTOMATION marker |
| [C1062571](https://shopview.testrail.io/index.php?/cases/view/1062571) | S1 — Reports open in QuickBooks name order | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715288](https://shopview.testrail.io/index.php?/cases/view/715288) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715585](https://shopview.testrail.io/index.php?/cases/view/715585) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715289](https://shopview.testrail.io/index.php?/cases/view/715289) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715290](https://shopview.testrail.io/index.php?/cases/view/715290) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715291](https://shopview.testrail.io/index.php?/cases/view/715291) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715586](https://shopview.testrail.io/index.php?/cases/view/715586) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715292](https://shopview.testrail.io/index.php?/cases/view/715292) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715293](https://shopview.testrail.io/index.php?/cases/view/715293) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715294](https://shopview.testrail.io/index.php?/cases/view/715294) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715587](https://shopview.testrail.io/index.php?/cases/view/715587) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715295](https://shopview.testrail.io/index.php?/cases/view/715295) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715296](https://shopview.testrail.io/index.php?/cases/view/715296) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715297](https://shopview.testrail.io/index.php?/cases/view/715297) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715298](https://shopview.testrail.io/index.php?/cases/view/715298) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715299](https://shopview.testrail.io/index.php?/cases/view/715299) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715588](https://shopview.testrail.io/index.php?/cases/view/715588) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715300](https://shopview.testrail.io/index.php?/cases/view/715300) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715301](https://shopview.testrail.io/index.php?/cases/view/715301) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715302](https://shopview.testrail.io/index.php?/cases/view/715302) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715589](https://shopview.testrail.io/index.php?/cases/view/715589) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715303](https://shopview.testrail.io/index.php?/cases/view/715303) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715304](https://shopview.testrail.io/index.php?/cases/view/715304) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715305](https://shopview.testrail.io/index.php?/cases/view/715305) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715306](https://shopview.testrail.io/index.php?/cases/view/715306) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715590](https://shopview.testrail.io/index.php?/cases/view/715590) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715307](https://shopview.testrail.io/index.php?/cases/view/715307) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715591](https://shopview.testrail.io/index.php?/cases/view/715591) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715308](https://shopview.testrail.io/index.php?/cases/view/715308) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715309](https://shopview.testrail.io/index.php?/cases/view/715309) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715310](https://shopview.testrail.io/index.php?/cases/view/715310) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715311](https://shopview.testrail.io/index.php?/cases/view/715311) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715312](https://shopview.testrail.io/index.php?/cases/view/715312) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715313](https://shopview.testrail.io/index.php?/cases/view/715313) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715314](https://shopview.testrail.io/index.php?/cases/view/715314) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715315](https://shopview.testrail.io/index.php?/cases/view/715315) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715316](https://shopview.testrail.io/index.php?/cases/view/715316) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715317](https://shopview.testrail.io/index.php?/cases/view/715317) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715318](https://shopview.testrail.io/index.php?/cases/view/715318) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715319](https://shopview.testrail.io/index.php?/cases/view/715319) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715320](https://shopview.testrail.io/index.php?/cases/view/715320) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715321](https://shopview.testrail.io/index.php?/cases/view/715321) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715322](https://shopview.testrail.io/index.php?/cases/view/715322) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715323](https://shopview.testrail.io/index.php?/cases/view/715323) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715592](https://shopview.testrail.io/index.php?/cases/view/715592) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715324](https://shopview.testrail.io/index.php?/cases/view/715324) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715593](https://shopview.testrail.io/index.php?/cases/view/715593) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715325](https://shopview.testrail.io/index.php?/cases/view/715325) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715594](https://shopview.testrail.io/index.php?/cases/view/715594) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715326](https://shopview.testrail.io/index.php?/cases/view/715326) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C797940](https://shopview.testrail.io/index.php?/cases/view/797940) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C797941](https://shopview.testrail.io/index.php?/cases/view/797941) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C797942](https://shopview.testrail.io/index.php?/cases/view/797942) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C1062572](https://shopview.testrail.io/index.php?/cases/view/1062572) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062573](https://shopview.testrail.io/index.php?/cases/view/1062573) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062574](https://shopview.testrail.io/index.php?/cases/view/1062574) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062575](https://shopview.testrail.io/index.php?/cases/view/1062575) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062576](https://shopview.testrail.io/index.php?/cases/view/1062576) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062577](https://shopview.testrail.io/index.php?/cases/view/1062577) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C1062578](https://shopview.testrail.io/index.php?/cases/view/1062578) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062579](https://shopview.testrail.io/index.php?/cases/view/1062579) | S2 — Sort by clicking any column header | expected result: build line, AUTOMATION marker |
| [C715327](https://shopview.testrail.io/index.php?/cases/view/715327) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715595](https://shopview.testrail.io/index.php?/cases/view/715595) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715596](https://shopview.testrail.io/index.php?/cases/view/715596) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715328](https://shopview.testrail.io/index.php?/cases/view/715328) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715597](https://shopview.testrail.io/index.php?/cases/view/715597) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715598](https://shopview.testrail.io/index.php?/cases/view/715598) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715329](https://shopview.testrail.io/index.php?/cases/view/715329) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715330](https://shopview.testrail.io/index.php?/cases/view/715330) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715331](https://shopview.testrail.io/index.php?/cases/view/715331) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715332](https://shopview.testrail.io/index.php?/cases/view/715332) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715333](https://shopview.testrail.io/index.php?/cases/view/715333) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715334](https://shopview.testrail.io/index.php?/cases/view/715334) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715335](https://shopview.testrail.io/index.php?/cases/view/715335) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715336](https://shopview.testrail.io/index.php?/cases/view/715336) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715337](https://shopview.testrail.io/index.php?/cases/view/715337) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715338](https://shopview.testrail.io/index.php?/cases/view/715338) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715339](https://shopview.testrail.io/index.php?/cases/view/715339) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715340](https://shopview.testrail.io/index.php?/cases/view/715340) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715341](https://shopview.testrail.io/index.php?/cases/view/715341) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715342](https://shopview.testrail.io/index.php?/cases/view/715342) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715344](https://shopview.testrail.io/index.php?/cases/view/715344) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715345](https://shopview.testrail.io/index.php?/cases/view/715345) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715346](https://shopview.testrail.io/index.php?/cases/view/715346) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715347](https://shopview.testrail.io/index.php?/cases/view/715347) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715348](https://shopview.testrail.io/index.php?/cases/view/715348) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715349](https://shopview.testrail.io/index.php?/cases/view/715349) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715350](https://shopview.testrail.io/index.php?/cases/view/715350) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715351](https://shopview.testrail.io/index.php?/cases/view/715351) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715352](https://shopview.testrail.io/index.php?/cases/view/715352) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715353](https://shopview.testrail.io/index.php?/cases/view/715353) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715574](https://shopview.testrail.io/index.php?/cases/view/715574) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715575](https://shopview.testrail.io/index.php?/cases/view/715575) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C715576](https://shopview.testrail.io/index.php?/cases/view/715576) | S3 — Export to PDF and CSV | expected result: build line, AUTOMATION marker |
| [C1062580](https://shopview.testrail.io/index.php?/cases/view/1062580) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C1062581](https://shopview.testrail.io/index.php?/cases/view/1062581) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715354](https://shopview.testrail.io/index.php?/cases/view/715354) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715355](https://shopview.testrail.io/index.php?/cases/view/715355) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715356](https://shopview.testrail.io/index.php?/cases/view/715356) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715357](https://shopview.testrail.io/index.php?/cases/view/715357) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715358](https://shopview.testrail.io/index.php?/cases/view/715358) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715359](https://shopview.testrail.io/index.php?/cases/view/715359) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715360](https://shopview.testrail.io/index.php?/cases/view/715360) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715361](https://shopview.testrail.io/index.php?/cases/view/715361) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715362](https://shopview.testrail.io/index.php?/cases/view/715362) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715599](https://shopview.testrail.io/index.php?/cases/view/715599) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715363](https://shopview.testrail.io/index.php?/cases/view/715363) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715600](https://shopview.testrail.io/index.php?/cases/view/715600) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715364](https://shopview.testrail.io/index.php?/cases/view/715364) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715601](https://shopview.testrail.io/index.php?/cases/view/715601) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715365](https://shopview.testrail.io/index.php?/cases/view/715365) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715602](https://shopview.testrail.io/index.php?/cases/view/715602) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715366](https://shopview.testrail.io/index.php?/cases/view/715366) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715367](https://shopview.testrail.io/index.php?/cases/view/715367) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715368](https://shopview.testrail.io/index.php?/cases/view/715368) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715603](https://shopview.testrail.io/index.php?/cases/view/715603) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715369](https://shopview.testrail.io/index.php?/cases/view/715369) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715604](https://shopview.testrail.io/index.php?/cases/view/715604) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715370](https://shopview.testrail.io/index.php?/cases/view/715370) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715371](https://shopview.testrail.io/index.php?/cases/view/715371) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715372](https://shopview.testrail.io/index.php?/cases/view/715372) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715373](https://shopview.testrail.io/index.php?/cases/view/715373) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715374](https://shopview.testrail.io/index.php?/cases/view/715374) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C715605](https://shopview.testrail.io/index.php?/cases/view/715605) | S4 — Collapse all, Expand all and pinned group rows | expected result: build line, AUTOMATION marker |
| [C1062582](https://shopview.testrail.io/index.php?/cases/view/1062582) | S4 — Collapse all, Expand all and pinned group rows | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C1062583](https://shopview.testrail.io/index.php?/cases/view/1062583) | S4 — Collapse all, Expand all and pinned group rows | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715375](https://shopview.testrail.io/index.php?/cases/view/715375) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715376](https://shopview.testrail.io/index.php?/cases/view/715376) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715377](https://shopview.testrail.io/index.php?/cases/view/715377) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715378](https://shopview.testrail.io/index.php?/cases/view/715378) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715379](https://shopview.testrail.io/index.php?/cases/view/715379) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715380](https://shopview.testrail.io/index.php?/cases/view/715380) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715381](https://shopview.testrail.io/index.php?/cases/view/715381) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715382](https://shopview.testrail.io/index.php?/cases/view/715382) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715383](https://shopview.testrail.io/index.php?/cases/view/715383) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715384](https://shopview.testrail.io/index.php?/cases/view/715384) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715606](https://shopview.testrail.io/index.php?/cases/view/715606) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715607](https://shopview.testrail.io/index.php?/cases/view/715607) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715385](https://shopview.testrail.io/index.php?/cases/view/715385) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715608](https://shopview.testrail.io/index.php?/cases/view/715608) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715609](https://shopview.testrail.io/index.php?/cases/view/715609) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715386](https://shopview.testrail.io/index.php?/cases/view/715386) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715387](https://shopview.testrail.io/index.php?/cases/view/715387) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715388](https://shopview.testrail.io/index.php?/cases/view/715388) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715389](https://shopview.testrail.io/index.php?/cases/view/715389) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715390](https://shopview.testrail.io/index.php?/cases/view/715390) | S5 — Filters: customer or vendor, past due and location | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715391](https://shopview.testrail.io/index.php?/cases/view/715391) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715392](https://shopview.testrail.io/index.php?/cases/view/715392) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715393](https://shopview.testrail.io/index.php?/cases/view/715393) | S5 — Filters: customer or vendor, past due and location | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715394](https://shopview.testrail.io/index.php?/cases/view/715394) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715395](https://shopview.testrail.io/index.php?/cases/view/715395) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715396](https://shopview.testrail.io/index.php?/cases/view/715396) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715397](https://shopview.testrail.io/index.php?/cases/view/715397) | S5 — Filters: customer or vendor, past due and location | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715398](https://shopview.testrail.io/index.php?/cases/view/715398) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715399](https://shopview.testrail.io/index.php?/cases/view/715399) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715400](https://shopview.testrail.io/index.php?/cases/view/715400) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715401](https://shopview.testrail.io/index.php?/cases/view/715401) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715402](https://shopview.testrail.io/index.php?/cases/view/715402) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715403](https://shopview.testrail.io/index.php?/cases/view/715403) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715404](https://shopview.testrail.io/index.php?/cases/view/715404) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715405](https://shopview.testrail.io/index.php?/cases/view/715405) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715406](https://shopview.testrail.io/index.php?/cases/view/715406) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715407](https://shopview.testrail.io/index.php?/cases/view/715407) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715408](https://shopview.testrail.io/index.php?/cases/view/715408) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715577](https://shopview.testrail.io/index.php?/cases/view/715577) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715578](https://shopview.testrail.io/index.php?/cases/view/715578) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715579](https://shopview.testrail.io/index.php?/cases/view/715579) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715580](https://shopview.testrail.io/index.php?/cases/view/715580) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C797943](https://shopview.testrail.io/index.php?/cases/view/797943) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C1062584](https://shopview.testrail.io/index.php?/cases/view/1062584) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062585](https://shopview.testrail.io/index.php?/cases/view/1062585) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C1062586](https://shopview.testrail.io/index.php?/cases/view/1062586) | S5 — Filters: customer or vendor, past due and location | expected result: build line, AUTOMATION marker |
| [C715409](https://shopview.testrail.io/index.php?/cases/view/715409) | S6 — Location column | expected result: build line, AUTOMATION marker |
| [C715410](https://shopview.testrail.io/index.php?/cases/view/715410) | S6 — Location column | expected result: build line, AUTOMATION marker |
| [C715411](https://shopview.testrail.io/index.php?/cases/view/715411) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715412](https://shopview.testrail.io/index.php?/cases/view/715412) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715413](https://shopview.testrail.io/index.php?/cases/view/715413) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715414](https://shopview.testrail.io/index.php?/cases/view/715414) | S7 — Document links open where they can | expected result: build line, AUTOMATION marker |
| [C715415](https://shopview.testrail.io/index.php?/cases/view/715415) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715416](https://shopview.testrail.io/index.php?/cases/view/715416) | S7 — Document links open where they can | expected result: build line, AUTOMATION marker, wording changed |
| [C715417](https://shopview.testrail.io/index.php?/cases/view/715417) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715418](https://shopview.testrail.io/index.php?/cases/view/715418) | S7 — Document links open where they can | expected result: build line, AUTOMATION marker |
| [C715419](https://shopview.testrail.io/index.php?/cases/view/715419) | S7 — Document links open where they can | expected result: build line, AUTOMATION marker |
| [C715420](https://shopview.testrail.io/index.php?/cases/view/715420) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715421](https://shopview.testrail.io/index.php?/cases/view/715421) | Setup needed before testing | preconditions: Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715422](https://shopview.testrail.io/index.php?/cases/view/715422) | S7 — Document links open where they can | expected result: build line, AUTOMATION marker |
| [C715423](https://shopview.testrail.io/index.php?/cases/view/715423) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715424](https://shopview.testrail.io/index.php?/cases/view/715424) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715425](https://shopview.testrail.io/index.php?/cases/view/715425) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715426](https://shopview.testrail.io/index.php?/cases/view/715426) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715427](https://shopview.testrail.io/index.php?/cases/view/715427) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715428](https://shopview.testrail.io/index.php?/cases/view/715428) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715429](https://shopview.testrail.io/index.php?/cases/view/715429) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715430](https://shopview.testrail.io/index.php?/cases/view/715430) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715431](https://shopview.testrail.io/index.php?/cases/view/715431) | Setup needed before testing | preconditions: wording changed, Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715610](https://shopview.testrail.io/index.php?/cases/view/715610) | Setup needed before testing | preconditions: wording changed, Setup steps added; expected result: build line, AUTOMATION marker, wording changed |
| [C715432](https://shopview.testrail.io/index.php?/cases/view/715432) | Setup needed before testing | preconditions: wording changed, Setup steps added; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C797944](https://shopview.testrail.io/index.php?/cases/view/797944) | S7 — Document links open where they can | expected result: build line, AUTOMATION marker |
| [C715433](https://shopview.testrail.io/index.php?/cases/view/715433) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715434](https://shopview.testrail.io/index.php?/cases/view/715434) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715435](https://shopview.testrail.io/index.php?/cases/view/715435) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715436](https://shopview.testrail.io/index.php?/cases/view/715436) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715437](https://shopview.testrail.io/index.php?/cases/view/715437) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715438](https://shopview.testrail.io/index.php?/cases/view/715438) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715439](https://shopview.testrail.io/index.php?/cases/view/715439) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715611](https://shopview.testrail.io/index.php?/cases/view/715611) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715440](https://shopview.testrail.io/index.php?/cases/view/715440) | S8 — Report descriptions and layout | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715441](https://shopview.testrail.io/index.php?/cases/view/715441) | S8 — Report descriptions and layout | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715442](https://shopview.testrail.io/index.php?/cases/view/715442) | S8 — Report descriptions and layout | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715443](https://shopview.testrail.io/index.php?/cases/view/715443) | S8 — Report descriptions and layout | preconditions: wording changed; steps: wording changed; expected result: build line, AUTOMATION marker, wording changed |
| [C715444](https://shopview.testrail.io/index.php?/cases/view/715444) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715449](https://shopview.testrail.io/index.php?/cases/view/715449) | S8 — Report descriptions and layout | expected result: build line, AUTOMATION marker |
| [C715445](https://shopview.testrail.io/index.php?/cases/view/715445) | S9 — A/R Collection call list | expected result: build line, AUTOMATION marker |
| [C715446](https://shopview.testrail.io/index.php?/cases/view/715446) | Setup needed before testing | preconditions: Setup steps added; expected result: build line, AUTOMATION marker |
| [C715447](https://shopview.testrail.io/index.php?/cases/view/715447) | S9 — A/R Collection call list | steps: wording changed; expected result: build line, AUTOMATION marker |
| [C715448](https://shopview.testrail.io/index.php?/cases/view/715448) | Setup needed before testing | preconditions: wording changed, Setup steps added; expected result: build line, AUTOMATION marker, wording changed |

## 5. Replacements: lines edited on 11-12 Nov that PRD version 13 itself changes

| Case | What is replaced | The line as it reads today (start) |
|---|---|---|
| [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | D-16's tech-plan note: your session's wording kept, the version 13 point added | Where the tech plan differs: the tech plan (21 Oct 2026) says Location wraps only on A/P Detail; PRD version 11 (its lay… |
| [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715633](https://shopview.testrail.io/index.php?/cases/view/715633) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715634](https://shopview.testrail.io/index.php?/cases/view/715634) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715635](https://shopview.testrail.io/index.php?/cases/view/715635) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715636](https://shopview.testrail.io/index.php?/cases/view/715636) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715637](https://shopview.testrail.io/index.php?/cases/view/715637) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715638](https://shopview.testrail.io/index.php?/cases/view/715638) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715506](https://shopview.testrail.io/index.php?/cases/view/715506) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715507](https://shopview.testrail.io/index.php?/cases/view/715507) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715508](https://shopview.testrail.io/index.php?/cases/view/715508) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715519](https://shopview.testrail.io/index.php?/cases/view/715519) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715520](https://shopview.testrail.io/index.php?/cases/view/715520) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | quoted PRD sentence replaced by its version 13 wording | S1-R5: “A/R Detail and A/P Detail keep their aging buckets in this fixed order: "91 or more days past due", "61-90 days … |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | quoted PRD sentence replaced by its version 13 wording | S1-R7: “The column the report opened on is marked as sorted: the name column on the Summaries and Detail reports, the Da… |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | quoted PRD sentence replaced by its version 13 wording | S4-R1: “The table's top-left header cell holds one chevron button. While any group is expanded it points down, its toolt… |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | quoted PRD sentence replaced by its version 13 wording | S4-R5: “Each group's own expand toggle uses the same chevron: pointing down when open, right when closed. Behavior is un… |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | quoted PRD sentence replaced by its version 13 wording | S5-R1: “Each report's filter row is the native report filter row of the newer reports (Inventory Value, Sales By Custome… |
| [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | quoted PRD sentence replaced by its version 13 wording | S2-R1, A/P Detail and A/P Unpaid Invoices columns: “A/P Detail and A/P Unpaid Invoices: Date, Location (when shown), Tra… |
| [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715540](https://shopview.testrail.io/index.php?/cases/view/715540) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715541](https://shopview.testrail.io/index.php?/cases/view/715541) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715544](https://shopview.testrail.io/index.php?/cases/view/715544) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715546](https://shopview.testrail.io/index.php?/cases/view/715546) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715462](https://shopview.testrail.io/index.php?/cases/view/715462) | DATA-13: the case id C715462 dropped from the record name in the preconditions (now "ZZAUTOTEST OVERPAID Cust A"; the staging record keeps its full name, so search "ZZAUTOTEST OVERPAID") | Customer A is "ZZAUTOTEST OVERPAID C715462 Cust A" at Staging Heavy Duty - 9919. Its $100.00 invoice S-40181 was paid $2… |
| [C715462](https://shopview.testrail.io/index.php?/cases/view/715462) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715471](https://shopview.testrail.io/index.php?/cases/view/715471) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715472](https://shopview.testrail.io/index.php?/cases/view/715472) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715475](https://shopview.testrail.io/index.php?/cases/view/715475) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715617](https://shopview.testrail.io/index.php?/cases/view/715617) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715618](https://shopview.testrail.io/index.php?/cases/view/715618) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715476](https://shopview.testrail.io/index.php?/cases/view/715476) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715477](https://shopview.testrail.io/index.php?/cases/view/715477) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715479](https://shopview.testrail.io/index.php?/cases/view/715479) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715480](https://shopview.testrail.io/index.php?/cases/view/715480) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715582](https://shopview.testrail.io/index.php?/cases/view/715582) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715583](https://shopview.testrail.io/index.php?/cases/view/715583) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715619](https://shopview.testrail.io/index.php?/cases/view/715619) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715620](https://shopview.testrail.io/index.php?/cases/view/715620) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715584](https://shopview.testrail.io/index.php?/cases/view/715584) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C1062590](https://shopview.testrail.io/index.php?/cases/view/1062590) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 12 (12 Nov 2026, Milos… |
| [C715282](https://shopview.testrail.io/index.php?/cases/view/715282) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715283](https://shopview.testrail.io/index.php?/cases/view/715283) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715573](https://shopview.testrail.io/index.php?/cases/view/715573) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C1062582](https://shopview.testrail.io/index.php?/cases/view/1062582) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C1062583](https://shopview.testrail.io/index.php?/cases/view/1062583) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715579](https://shopview.testrail.io/index.php?/cases/view/715579) | build line: this case gained a result no build has shown yet, so it now says "Partly checked … not yet seen on that build: …" (or, for S5-37, not checked in this form) | Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.… |
| [C715579](https://shopview.testrail.io/index.php?/cases/view/715579) | AUTOMATION marker: S5-37's expected behaviour reversed, so "Not available on Build to test Yet - Last checked 11/14/2026" instead of READY | AUTOMATION: READY… |
| [C715416](https://shopview.testrail.io/index.php?/cases/view/715416) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715417](https://shopview.testrail.io/index.php?/cases/view/715417) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715442](https://shopview.testrail.io/index.php?/cases/view/715442) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |
| [C715443](https://shopview.testrail.io/index.php?/cases/view/715443) | line above the quotes now names PRD version 13 (the rest of that line kept) | From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026, Chris … |

D-52 already showed the blue header chevron (changed 12 Nov on your instruction): its tester line and note stay exactly as they are.

## 6. Dry runs (live reads, 14 Nov 2026)

`applied/dryrun-update-on-live-2026-11-14.txt`:
```
mode: on-live | cases 380 | to update 380 | edited outside our library 0 | held 0 | no change 0
fields to update: {'custom_expected': 372, 'custom_preconds+custom_steps+custom_expected': 1, 'custom_preconds+custom_expected': 4, 'title+custom_steps+custom_expected': 2, 'title+custom_preconds+custom_steps+custom_expected+refs': 1}
start re-read: 9061 suite cases read; plan cases changed since the merge's read: 0 []
per-case re-read (dry run): 380 cases read again; changed: 0 []
DRY RUN: nothing written. Would update 380 cases.
```

`applied/dryrun-update-locked-2026-11-14.txt`:
```
mode: locked on our last written body | cases 380 | to update 0 | edited outside our library 380 | held 0 | no change 0
fields to update: {}
start re-read: 9061 suite cases read; plan cases changed since the merge's read: 0 []
per-case re-read (dry run): 0 cases read again; changed: 0 []
DRY RUN: nothing written. Would update 0 cases.
```

`applied/dryrun-create-sync-folder-2026-11-14.txt`:
```
new cases 8 | to add 8 | already added 0
  S3-33 -> section 133629 (Setup needed before testing): A/R Detail: the PDF ends each bucket with its "Total for" row
  S3-35 -> section 133629 (Setup needed before testing): A/P Detail: the PDF ends each bucket with its "Total for" row
  S3-34 -> section 133629 (Setup needed before testing): A/R Collection: the PDF ends each customer with its "Total for" row
  S3-36 -> section 133629 (Setup needed before testing): A/P Unpaid Invoices: the PDF ends each vendor with its "Total for" row
  S5-43 -> section 133629 (Setup needed before testing): A/R Detail: the PDF and CSV print an as-of date after today
  S5-41b -> section 133629 (Setup needed before testing): A/R Detail: a new as-of date with one location left hides the chip
  S2-51 -> section 133629 (Setup needed before testing): A/R Summary: a blank bucket cell stays at the bottom in both sort orders
  S2-52 -> section 133629 (Setup needed before testing): A/P Summary: a blank bucket cell stays at the bottom in both sort orders
live read: folder 133629 holds 144 cases, all in our map
DRY RUN: nothing written.
---
new cases 8 | to add to run 557 0 | not created yet: ['S3-33', 'S3-35', 'S3-34', 'S3-36', 'S5-43', 'S5-41b', 'S2-51', 'S2-52']
live read: run 557 open, 481 tests; after the union it would hold 489 (the 8 new cases, once created, assigned to user 6); no test removed
DRY RUN: nothing written.
---
folder 90418: live description as read 14 Nov 2026 = ''
new description = 'Test cases are current as of 11/14/2026. Before you start testing, check whether the PRD, design or any other source has changed since then; if it has, update the test cases first.'
live read: folder 90418 description now None; lock holds
DRY RUN: nothing written.
```

Run order when you approve: `write/update_cases.py --on-live --apply`, `write/create_new.py --apply`, `write/sync_run_557.py --apply`, `write/folder_note.py --apply` (each runs the readiness check first and logs C-id, HTTP status and read-back).
