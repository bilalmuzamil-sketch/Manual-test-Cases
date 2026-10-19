# WO Board: Chris Ward's answers and PRD v67/v68 — what changes (19 Oct 2026)

Sources: answers `answers.json` (sheet of 19 Oct 2026, 19 answers); PRD Confluence 845185030 v68 (19 Oct 2026 19:44 UTC, Chris Ward), saved `../prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md`, diff `../prd-v68-2026-10-19/PRD-DIFF-v66-to-v68.diff` (75 lines, read in full). Where answer 5 ("about 2.6 seconds") and v68 S4-R16 (5 s with Undo, 2.6 s without) differ, v68 is later and prevails.

## Held design-version cases (Rule 130: released or removed the day the PO rules)

| Held | Case | Chris | Proposed |
|---|---|---|---|
| H1 | [C682429](https://shopview.testrail.io/index.php?/cases/view/682429) | 1 (b) PRD | remove: the PRD's words stand; C682422 checks them |
| H2 | [C682430](https://shopview.testrail.io/index.php?/cases/view/682430) | 2, 3, 4 (a) design; 5 (a), v68 = 5 s / 2.6 s | remove: v68 now says the design's words; C682424, C682425, C682426 move to v68 and check them (C682424 gains the "lead technician set to" message for a new lead already on a line; C682425 the 5 s / 2.6 s close; C682426 "Assignment undone") |
| H3 | [C682431](https://shopview.testrail.io/index.php?/cases/view/682431) | 6, 9 (a) design; 7, 8 (b) PRD | remove: v68 S4-N6/S4-N1 now carry the notes; C96964, C96967, C368147, C97020 move to v68 and check them (C96964 gains the lock-icon tooltip and the drag note; C96967 / C368147 the "You don’t have permission to assign technicians" note); Declined and Imported stay as the PRD says |
| H4 | [C682432](https://shopview.testrail.io/index.php?/cases/view/682432) | 10 (b) PRD | remove |
| H5 | [C682433](https://shopview.testrail.io/index.php?/cases/view/682433) | 11, 12 (b) PRD | remove |
| H6 | [C682434](https://shopview.testrail.io/index.php?/cases/view/682434) | 13 (b) PRD | remove |
| H7 | [C682435](https://shopview.testrail.io/index.php?/cases/view/682435) | 14, 15 (b) PRD | remove |
| H8 | [C682436](https://shopview.testrail.io/index.php?/cases/view/682436) | 16 (a) design; v68 new S1-N1d | release: rewrite to quote v68 S1-N1d (Add Technician only with 'Settings → App'), add to run 498. No other case covers S1-N1d |

Answers 17 (v67 wording everywhere), 18 (List pills as in production: SV-11464 not adopted) and 19 ("Unassigned" for a deleted technician's work orders in List, v68 S3-R20e) need no held case.

## Existing cases whose quotes or words no longer match v67/v68 (44; all ours; 15 Automated)

Found by script: a quoted sentence that is in v66 but not in v68, or the old words "Lead technician updated", "Lead technician removed", "8 seconds", "can't be changed once a work order is Invoiced or Paid", "no new toast", "{work order number} unassigned". Candidates: each is re-checked by reading the case before it is changed.

| Case | Title | Automated | Changed requirements | Old words | Also in the v65/v66 list |
|---|---|---|---|---|---|
| [C96929](https://shopview.testrail.io/index.php?/cases/view/96929) | A group's work orders are in the order their leads were given, not List's sort | yes | S9-R14 | - | no |
| [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) | Work orders of a deleted lead sit under Deleted technician, which takes no drops | no | - | Lead technician updated | yes |
| [C96956](https://shopview.testrail.io/index.php?/cases/view/96956) | Reassign lead technician lists eligible technicians with Unassigned first | no | - | Lead technician updated; Lead technician removed | yes |
| [C96957](https://shopview.testrail.io/index.php?/cases/view/96957) | Lead technician updated and removed messages show and close on their own | no | - | Lead technician updated; Lead technician removed | yes |
| [C96963](https://shopview.testrail.io/index.php?/cases/view/96963) | The lead of an Invoiced or Paid work order cannot be changed in any way | no | - | Lead technician updated | yes |
| [C96964](https://shopview.testrail.io/index.php?/cases/view/96964) | Invoiced and Paid work orders show why the lead can't be changed | no | S4-N6 | can't be changed once a work order is Invoiced or Paid | yes |
| [C96967](https://shopview.testrail.io/index.php?/cases/view/96967) | A user without create and edit cannot drag or reassign work orders | yes | S4-N1 | - | yes |
| [C96969](https://shopview.testrail.io/index.php?/cases/view/96969) | Choosing the current lead again changes nothing and shows no message | yes | - | Lead technician updated | yes |
| [C96973](https://shopview.testrail.io/index.php?/cases/view/96973) | Reassign can pick a technician outside the filter and the card then leaves | yes | S4-E4 | - | yes |
| [C154888](https://shopview.testrail.io/index.php?/cases/view/154888) | Clear shifts keeps ended shifts, removes future ones, trims a running one | no | - | Lead technician updated; Lead technician removed | yes |
| [C154889](https://shopview.testrail.io/index.php?/cases/view/154889) | Removing the lead asks the same clear-shifts question as changing it | no | - | Lead technician updated; Lead technician removed | yes |
| [C368133](https://shopview.testrail.io/index.php?/cases/view/368133) | The clear-shifts question appears only for the old lead's unfinished shifts | yes | - | Lead technician updated; Lead technician removed | yes |
| [C368134](https://shopview.testrail.io/index.php?/cases/view/368134) | The clear-shifts question shows its exact title, text and buttons | no | - | Lead technician updated; Lead technician removed | yes |
| [C368135](https://shopview.testrail.io/index.php?/cases/view/368135) | Cancel or closing the clear-shifts question calls the change off | yes | - | Lead technician updated | yes |
| [C368136](https://shopview.testrail.io/index.php?/cases/view/368136) | The clear-shifts question shows on Board and Tech View only | yes | S4-R31 | Lead technician updated; Lead technician removed | yes |
| [C368140](https://shopview.testrail.io/index.php?/cases/view/368140) | Assigning a lead to unassigned work moves only open unassigned lines | yes | - | Lead technician updated | yes |
| [C581891](https://shopview.testrail.io/index.php?/cases/view/581891) | A line with only a Schedule shift technician follows the new lead technician | no | - | Lead technician updated; Lead technician removed | yes |
| [C581892](https://shopview.testrail.io/index.php?/cases/view/581892) | The Clear shifts question ignores lines that are not approved or are declined | no | - | Lead technician updated; Lead technician removed | yes |
| [C581893](https://shopview.testrail.io/index.php?/cases/view/581893) | An Entire work order shift stops counting once a new line is approved | no | - | Lead technician updated; Lead technician removed | yes |
| [C682423](https://shopview.testrail.io/index.php?/cases/view/682423) | The lead technician dialog offers no Unassigned and assigns on one click | no | S4-R5 | Lead technician updated; Lead technician removed; unassigned" after removing | no |
| [C682424](https://shopview.testrail.io/index.php?/cases/view/682424) | A lead change message names the work order and technician, with Undo | no | S4-R5 | Lead technician updated; Lead technician removed; 8 seconds; unassigned" after removing | no |
| [C682425](https://shopview.testrail.io/index.php?/cases/view/682425) | The lead change message stays while hovered and closes after 8 seconds | no | S4-R16, S4-R32, S4-R5 | Lead technician updated; Lead technician removed; 8 seconds; no new toast; unassigned" after removing | no |
| [C682426](https://shopview.testrail.io/index.php?/cases/view/682426) | Undo puts the work order back with its old lead and in its old place | no | S4-R32 | Lead technician updated; Lead technician removed; no new toast | no |
| [C682427](https://shopview.testrail.io/index.php?/cases/view/682427) | Undo brings back the shifts that a lead change cleared | no | S4-R32 | Lead technician updated; Lead technician removed; no new toast | no |
| [C682428](https://shopview.testrail.io/index.php?/cases/view/682428) | Undo cannot move back a work order that was invoiced in the meantime | no | S4-R32 | Lead technician updated; Lead technician removed; 8 seconds; no new toast | no |
| [C97002](https://shopview.testrail.io/index.php?/cases/view/97002) | Dragging to another technician changes the lead, Unassigned clears it | no | - | Lead technician updated; Lead technician removed | yes |
| [C97007](https://shopview.testrail.io/index.php?/cases/view/97007) | A work order given a new lead from Reassign or its page goes to the bottom | yes | S9-R14 | - | yes |
| [C97008](https://shopview.testrail.io/index.php?/cases/view/97008) | Moving to another technician shows the message, reordering shows none | yes | - | Lead technician updated; Lead technician removed | yes |
| [C97009](https://shopview.testrail.io/index.php?/cases/view/97009) | Invoiced and Paid work orders can only be reordered within their technician | no | - | Lead technician updated | yes |
| [C97010](https://shopview.testrail.io/index.php?/cases/view/97010) | Nothing can be dropped on an inactive technician, and a failed drop goes back | no | - | Lead technician updated | yes |
| [C368144](https://shopview.testrail.io/index.php?/cases/view/368144) | Removing the lead puts the work order in its normal place in Unassigned | yes | S9-R14 | Lead technician updated; Lead technician removed | yes |
| [C368145](https://shopview.testrail.io/index.php?/cases/view/368145) | A work order created with a lead keeps its normal place, not the bottom | yes | S9-R14 | - | no |
| [C368147](https://shopview.testrail.io/index.php?/cases/view/368147) | A user without Work Orders create and edit cannot drag work orders | yes | S4-N1 | - | yes |
| [C97020](https://shopview.testrail.io/index.php?/cases/view/97020) | The keyboard cannot get around permission or status limits | no | S11-R9, S4-N1, S4-N6 | can't be changed once a work order is Invoiced or Paid | yes |
| [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) | Enter opens the focused card or row, and no key drags it | no | S11-R9 | Lead technician updated | yes |
| [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) | Reassign and Unassign work from the keyboard through the More actions menu | no | S11-R9 | Lead technician updated; Lead technician removed | yes |
| [C97028](https://shopview.testrail.io/index.php?/cases/view/97028) | Blocked analytics never stops the page, settings or reassignment | no | - | Lead technician updated | yes |
| [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) | A refused lead change on the work order page shows an error, keeps the old lead | yes | - | can't be changed once a work order is Invoiced or Paid | no |
| [C368168](https://shopview.testrail.io/index.php?/cases/view/368168) | Changing the lead on the work order page moves the lines that followed it | yes | S4-R31 | - | no |
| [C590116](https://shopview.testrail.io/index.php?/cases/view/590116) | Design: Drag handles on Tech View rows and technician headings, not Unassigned | no | S4-N1 | - | no |
| [C590121](https://shopview.testrail.io/index.php?/cases/view/590121) | Design: The More actions button and its menu look as in the design | no | S4-N6 | can't be changed once a work order is Invoiced or Paid | yes |
| [C590130](https://shopview.testrail.io/index.php?/cases/view/590130) | Design: Lead technician updated shows as the app's success message, then fades | no | - | Lead technician updated; Lead technician removed | yes |
| [C682430](https://shopview.testrail.io/index.php?/cases/view/682430) | Design- Lead change messages, Assignment undone, 2.6 s close (design's version) | no | S4-R16, S4-R32, S4-R5 | 8 seconds; no new toast; unassigned" after removing | no |
| [C682431](https://shopview.testrail.io/index.php?/cases/view/682431) | Design- Locked work orders show short notes, Declined locked (design's version) | no | S4-N1, S4-N6 | can't be changed once a work order is Invoiced or Paid | no |

No case was changed. Rule 122 (amended 16 Oct 2026): the QA lead decides full pass or a named set before any update starts.
