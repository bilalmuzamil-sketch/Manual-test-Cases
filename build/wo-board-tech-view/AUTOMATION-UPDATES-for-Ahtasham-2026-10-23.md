Hi brother Ahtasham,

I hope you are doing well. Thank you so much for all your work on the automation for Work Orders Board View and Tech View — it really helps the whole team.

While testing the latest release I updated some of the test cases that are marked **Automated**, so your scripts may need a small update to match. Below are all **36** of them, newest first, with the date of my last change and which part changed. Each link opens the test case; where the test is in run 498, the second link opens it there.

**The main changes, in short:**

- **Spacing (density):** Board View no longer has a spacing button in this release; spacing is only in Tech View (PRD v73, S3-R11 and S6-R1). Steps that changed the spacing on Board View now do it in Tech View.
- **Keyboard and focus:** a few steps were added (smaller window, three work orders for the third customer), following the product owner's notes.
- **Lead technician changes:** messages and the shift-clearing question were updated to the PRD's newer wording.
- **Set-up text:** many tests were rewritten into a cleaner layout (the steps the tester follows, plus a separate set-up section); the behaviour they check did not change unless the expected result is listed below.

### In run 498 (25 tests)

| # | Test case | Changed on | What changed | Test in run 498 |
|---|---|---|---|---|
| 1 | [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) — First Tab skips a collapsed or empty Unassigned to the first technician | 23 Oct | set-up, steps, expected result | [T4007027](https://shopview.testrail.io/index.php?/tests/view/4007027) |
| 2 | [C682421](https://shopview.testrail.io/index.php?/cases/view/682421) — First Tab goes to the work order even when it is far down or off to the side | 20 Oct | expected result, title | [T4054408](https://shopview.testrail.io/index.php?/tests/view/4054408) |
| 3 | [C368173](https://shopview.testrail.io/index.php?/cases/view/368173) — Changing a line's technician in Edit Line saves the new technician | 20 Oct | set-up, steps, expected result | [T3792494](https://shopview.testrail.io/index.php?/tests/view/3792494) |
| 4 | [C96992](https://shopview.testrail.io/index.php?/cases/view/96992) — Density changes Tech View rows only, not Board View cards or List | 20 Oct | set-up, steps, expected result, title | [T3481936](https://shopview.testrail.io/index.php?/tests/view/3481936) |
| 5 | [C96989](https://shopview.testrail.io/index.php?/cases/view/96989) — Tech View density is kept after logout, in another browser and location | 20 Oct | set-up, steps, expected result, title | [T3481933](https://shopview.testrail.io/index.php?/tests/view/3481933) |
| 6 | [C96988](https://shopview.testrail.io/index.php?/cases/view/96988) — Density changes spacing and size only, never what is shown | 20 Oct | set-up, steps, expected result | [T3481932](https://shopview.testrail.io/index.php?/tests/view/3481932) |
| 7 | [C682420](https://shopview.testrail.io/index.php?/cases/view/682420) — Design- Tech View count bubbles sit on the status label as in List, any density | 19 Oct | title | [T4054407](https://shopview.testrail.io/index.php?/tests/view/4054407) |
| 8 | [C682419](https://shopview.testrail.io/index.php?/cases/view/682419) — Board View's sideways scroll bar is thick and its handle is never tiny | 19 Oct | expected result | [T4053764](https://shopview.testrail.io/index.php?/tests/view/4053764) |
| 9 | [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) — After Back and Forward the List keeps its tab, search and filters | 19 Oct | set-up, steps, expected result | [T3792535](https://shopview.testrail.io/index.php?/tests/view/3792535) |
| 10 | [C368168](https://shopview.testrail.io/index.php?/cases/view/368168) — Changing the lead on the work order page moves the lines that followed it | 19 Oct | expected result | [T3792489](https://shopview.testrail.io/index.php?/tests/view/3792489) |
| 11 | [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) — A refused lead change on the work order page shows an error, keeps the old lead | 19 Oct | set-up, steps, expected result | [T3792488](https://shopview.testrail.io/index.php?/tests/view/3792488) |
| 12 | [C368145](https://shopview.testrail.io/index.php?/cases/view/368145) — A work order created with a lead keeps its normal place, not the bottom | 19 Oct | set-up, steps, expected result | [T3761666](https://shopview.testrail.io/index.php?/tests/view/3761666) |
| 13 | [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) — A card's More actions menu appears on hover or focus and offers Reassign | 19 Oct | set-up, steps, expected result, title | [T3481889](https://shopview.testrail.io/index.php?/tests/view/3481889) |
| 14 | [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) — A lead changed elsewhere moves the work order to its new group on refresh | 19 Oct | set-up, steps, expected result | [T3481880](https://shopview.testrail.io/index.php?/tests/view/3481880) |
| 15 | [C96929](https://shopview.testrail.io/index.php?/cases/view/96929) — A group's work orders are in the order their leads were given, not List's sort | 19 Oct | set-up, steps, expected result, title | [T3481873](https://shopview.testrail.io/index.php?/tests/view/3481873) |
| 16 | [C97011](https://shopview.testrail.io/index.php?/cases/view/97011) — A cancelled drag leaves the order and the lead unchanged | 16 Oct | set-up, steps, expected result | [T3481955](https://shopview.testrail.io/index.php?/tests/view/3481955) |
| 17 | [C96978](https://shopview.testrail.io/index.php?/cases/view/96978) — Column Selection offers the 13 optional fields with their usual values | 16 Oct | set-up, steps, expected result | [T3481922](https://shopview.testrail.io/index.php?/tests/view/3481922) |
| 18 | [C96996](https://shopview.testrail.io/index.php?/cases/view/96996) — The technician field is blank only with no lead and no line technician | 14 Oct | set-up, steps, expected result | [T3481940](https://shopview.testrail.io/index.php?/tests/view/3481940) |
| 19 | [C96995](https://shopview.testrail.io/index.php?/cases/view/96995) — Extra technicians show as +N and every name can be found by hovering | 14 Oct | set-up, steps, expected result | [T3481939](https://shopview.testrail.io/index.php?/tests/view/3481939) |
| 20 | [C96994](https://shopview.testrail.io/index.php?/cases/view/96994) — The lead comes first and each technician shows only once | 14 Oct | set-up, steps, expected result | [T3481938](https://shopview.testrail.io/index.php?/tests/view/3481938) |
| 21 | [C96993](https://shopview.testrail.io/index.php?/cases/view/96993) — Cards and Tech View's Assigned Techs show the lead and line technicians | 14 Oct | set-up, steps, expected result | [T3481937](https://shopview.testrail.io/index.php?/tests/view/3481937) |
| 22 | [C96911](https://shopview.testrail.io/index.php?/cases/view/96911) — Switching display keeps the same tab, search, filters and work orders | 14 Oct | set-up, steps, expected result | [T3481856](https://shopview.testrail.io/index.php?/tests/view/3481856) |
| 23 | [C368181](https://shopview.testrail.io/index.php?/cases/view/368181) — An asset's Work Orders tab count matches its rows | 12 Oct | set-up, steps, expected result | [T3792502](https://shopview.testrail.io/index.php?/tests/view/3792502) |
| 24 | [C96960](https://shopview.testrail.io/index.php?/cases/view/96960) — Reassigning by drag moves only open lines that follow the old lead | 12 Oct | set-up, expected result | [T3481904](https://shopview.testrail.io/index.php?/tests/view/3481904) |
| 25 | [C96962](https://shopview.testrail.io/index.php?/cases/view/96962) — A lead change adds one history entry and none for the lines it moves | 9 Oct | set-up, steps, expected result | [T3481906](https://shopview.testrail.io/index.php?/tests/view/3481906) |

### Moved to the Fast Follow folder (11 tests — not in run 498 now; they wait for their Fast Follow tickets)

| # | Test case | Changed on | What changed |
|---|---|---|---|
| 1 | [C368147](https://shopview.testrail.io/index.php?/cases/view/368147) — SV-11546 - A user without Work Orders create and edit cannot drag work orders | 20 Oct | set-up, steps, expected result, title |
| 2 | [C96967](https://shopview.testrail.io/index.php?/cases/view/96967) — SV-11546 - A user without create and edit cannot drag or reassign work orders | 20 Oct | set-up, steps, expected result, title |
| 3 | [C368144](https://shopview.testrail.io/index.php?/cases/view/368144) — Removing the lead puts the work order in its normal place in Unassigned | 19 Oct | set-up, steps, expected result |
| 4 | [C368140](https://shopview.testrail.io/index.php?/cases/view/368140) — Assigning a lead to unassigned work moves only open unassigned lines | 19 Oct | steps, expected result |
| 5 | [C368136](https://shopview.testrail.io/index.php?/cases/view/368136) — The clear-shifts question shows on Board and Tech View only | 19 Oct | set-up, steps, expected result |
| 6 | [C368135](https://shopview.testrail.io/index.php?/cases/view/368135) — Cancel or closing the clear-shifts question calls the change off | 19 Oct | set-up, steps, expected result |
| 7 | [C368133](https://shopview.testrail.io/index.php?/cases/view/368133) — The clear-shifts question appears only for the old lead's unfinished shifts | 19 Oct | set-up, steps, expected result |
| 8 | [C97008](https://shopview.testrail.io/index.php?/cases/view/97008) — Moving to another technician shows the message, reordering shows none | 19 Oct | steps, expected result |
| 9 | [C97007](https://shopview.testrail.io/index.php?/cases/view/97007) — A work order given a new lead from Reassign or its page goes to the bottom | 19 Oct | set-up, steps, expected result |
| 10 | [C96973](https://shopview.testrail.io/index.php?/cases/view/96973) — Reassign can pick a technician outside the filter and the card then leaves | 19 Oct | set-up, steps, expected result |
| 11 | [C96969](https://shopview.testrail.io/index.php?/cases/view/96969) — Choosing the current lead again changes nothing and shows no message | 19 Oct | steps, expected result |

If anything is unclear or you would like me to explain a change in more detail, please just let me know — I am happy to help.

Thank you again for your support and for keeping the automation in such good shape.

Best regards,
Bilal

(Test run 498: https://shopview.testrail.io/index.php?/runs/view/498)
