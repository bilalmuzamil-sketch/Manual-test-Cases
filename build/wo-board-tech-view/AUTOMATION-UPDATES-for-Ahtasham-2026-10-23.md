Hi brother Ahtasham,

I hope you are doing well. Thank you so much for all your work on the automation for Work Orders Board View and Tech View — it really helps the whole team.

While testing the latest release I updated some of the test cases that are marked **Automated**, so your scripts may need a small update to match. Below are all **36** of them: each one's text today is different from the day it was marked Automated. Each row gives the date it was automated, the date of the last change, which part changed, and a link to the test case (and to the test in run 498 where it is in that run).

**The main changes, in short:**

- **Spacing (density):** Board View no longer has a spacing button in this release; spacing is only in Tech View (PRD v73, S3-R11 and S6-R1). Steps that changed the spacing on Board View now do it in Tech View.
- **Column Selection:** Board View's "Fields to display" is now called "Column Selection" (SV-11580, live on production), and the steps use the new name.
- **Keyboard and focus:** a few steps were added (smaller window, three work orders for the third customer), following the product owner's notes.
- **Lead technician changes:** messages and the shift-clearing question were updated to the PRD's newer wording.
- **Set-up text:** many tests were rewritten into a cleaner layout (the steps the tester follows, plus a separate set-up section); the behaviour they check did not change unless the expected result is listed below.

### All 36 tests, with links

| # | Test case | Title | Automated on | Last changed | What changed | Where |
|---|---|---|---|---|---|---|
| 1 | [C96911](https://shopview.testrail.io/index.php?/cases/view/96911) | Switching display keeps the same tab, search, filters and work orders | 12 Oct 2026 | 14 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481856) |
| 2 | [C96929](https://shopview.testrail.io/index.php?/cases/view/96929) | A group's work orders are in the order their leads were given, not List's sort | 14 Oct 2026 | 19 Oct 2026 | title, set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481873) |
| 3 | [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) | A lead changed elsewhere moves the work order to its new group on refresh | 14 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481880) |
| 4 | [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) | A card's More actions menu appears on hover or focus and offers Reassign | 12 Oct 2026 | 19 Oct 2026 | title, set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481889) |
| 5 | [C96978](https://shopview.testrail.io/index.php?/cases/view/96978) | Column Selection offers the 13 optional fields with their usual values | 12 Oct 2026 | 22 Oct 2026 | title, set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481922) |
| 6 | [C96981](https://shopview.testrail.io/index.php?/cases/view/96981) | Column Selection changes apply to every card at once without a reload | 12 Oct 2026 | 23 Oct 2026 | title, set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481925) |
| 7 | [C96988](https://shopview.testrail.io/index.php?/cases/view/96988) | Density changes spacing and size only, never what is shown | 15 Oct 2026 | 20 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481932) |
| 8 | [C96989](https://shopview.testrail.io/index.php?/cases/view/96989) | Tech View density is kept after logout, in another browser and location | 12 Oct 2026 | 20 Oct 2026 | title, set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481933) |
| 9 | [C96992](https://shopview.testrail.io/index.php?/cases/view/96992) | Density changes Tech View rows only, not Board View cards or List | 15 Oct 2026 | 20 Oct 2026 | title, set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481936) |
| 10 | [C96993](https://shopview.testrail.io/index.php?/cases/view/96993) | Cards and Tech View's Assigned Techs show the lead and line technicians | 14 Oct 2026 | 23 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481937) |
| 11 | [C96994](https://shopview.testrail.io/index.php?/cases/view/96994) | The lead comes first and each technician shows only once | 14 Oct 2026 | 23 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481938) |
| 12 | [C96995](https://shopview.testrail.io/index.php?/cases/view/96995) | Extra technicians show as +N and every name can be found by hovering | 14 Oct 2026 | 23 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481939) |
| 13 | [C96996](https://shopview.testrail.io/index.php?/cases/view/96996) | The technician field is blank only with no lead and no line technician | 14 Oct 2026 | 23 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481940) |
| 14 | [C97011](https://shopview.testrail.io/index.php?/cases/view/97011) | A cancelled drag leaves the order and the lead unchanged | 12 Oct 2026 | 16 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481955) |
| 15 | [C154649](https://shopview.testrail.io/index.php?/cases/view/154649) | Narrowing the window below 1024 px does not change your chosen display | 12 Oct 2026 | 22 Oct 2026 | steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3481975) |
| 16 | [C368145](https://shopview.testrail.io/index.php?/cases/view/368145) | A work order created with a lead keeps its normal place, not the bottom | 12 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3761666) |
| 17 | [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) | A refused lead change on the work order page shows an error, keeps the old lead | 09 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3792488) |
| 18 | [C368168](https://shopview.testrail.io/index.php?/cases/view/368168) | Changing the lead on the work order page moves the lines that followed it | 09 Oct 2026 | 19 Oct 2026 | expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3792489) |
| 19 | [C368173](https://shopview.testrail.io/index.php?/cases/view/368173) | Changing a line's technician in Edit Line saves the new technician | 09 Oct 2026 | 20 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3792494) |
| 20 | [C368181](https://shopview.testrail.io/index.php?/cases/view/368181) | An asset's Work Orders tab count matches its rows | 09 Oct 2026 | 12 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3792502) |
| 21 | [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) | After Back and Forward the List keeps its tab, search and filters | 09 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/3792535) |
| 22 | [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) | First Tab skips a collapsed or empty Unassigned to the first technician | 16 Oct 2026 | 23 Oct 2026 | set-up, steps, expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/4007027) |
| 23 | [C682419](https://shopview.testrail.io/index.php?/cases/view/682419) | Board View's sideways scroll bar is thick and its handle is never tiny | 19 Oct 2026 | 19 Oct 2026 | expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/4053764) |
| 24 | [C682420](https://shopview.testrail.io/index.php?/cases/view/682420) | Design- Tech View count bubbles sit on the status label as in List, any density | 19 Oct 2026 | 19 Oct 2026 | title | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/4054407) |
| 25 | [C682421](https://shopview.testrail.io/index.php?/cases/view/682421) | First Tab goes to the work order even when it is far down or off to the side | 19 Oct 2026 | 20 Oct 2026 | expected result | [test in run 498](https://shopview.testrail.io/index.php?/tests/view/4054408) |
| 26 | [C96967](https://shopview.testrail.io/index.php?/cases/view/96967) | SV-11546 - A user without create and edit cannot drag or reassign work orders | 15 Oct 2026 | 20 Oct 2026 | title, set-up, steps, expected result | Fast-follow folder (not in run 498) |
| 27 | [C96969](https://shopview.testrail.io/index.php?/cases/view/96969) | Choosing the current lead again changes nothing and shows no message | 12 Oct 2026 | 23 Oct 2026 | steps, expected result | Fast-follow folder (not in run 498) |
| 28 | [C96973](https://shopview.testrail.io/index.php?/cases/view/96973) | Reassign can pick a technician outside the filter and the card then leaves | 12 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | Fast-follow folder (not in run 498) |
| 29 | [C97007](https://shopview.testrail.io/index.php?/cases/view/97007) | A work order given a new lead from Reassign or its page goes to the bottom | 12 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | Fast-follow folder (not in run 498) |
| 30 | [C97008](https://shopview.testrail.io/index.php?/cases/view/97008) | Moving to another technician shows the message, reordering shows none | 12 Oct 2026 | 23 Oct 2026 | steps, expected result | Fast-follow folder (not in run 498) |
| 31 | [C368133](https://shopview.testrail.io/index.php?/cases/view/368133) | The clear-shifts question appears only for the old lead's unfinished shifts | 12 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | Fast-follow folder (not in run 498) |
| 32 | [C368135](https://shopview.testrail.io/index.php?/cases/view/368135) | Cancel or closing the clear-shifts question calls the change off | 12 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | Fast-follow folder (not in run 498) |
| 33 | [C368136](https://shopview.testrail.io/index.php?/cases/view/368136) | The clear-shifts question shows on Board and Tech View only | 12 Oct 2026 | 19 Oct 2026 | steps, expected result | Fast-follow folder (not in run 498) |
| 34 | [C368140](https://shopview.testrail.io/index.php?/cases/view/368140) | Assigning a lead to unassigned work moves only open unassigned lines | 12 Oct 2026 | 19 Oct 2026 | steps, expected result | Fast-follow folder (not in run 498) |
| 35 | [C368144](https://shopview.testrail.io/index.php?/cases/view/368144) | Removing the lead puts the work order in its normal place in Unassigned | 12 Oct 2026 | 19 Oct 2026 | set-up, steps, expected result | Fast-follow folder (not in run 498) |
| 36 | [C368147](https://shopview.testrail.io/index.php?/cases/view/368147) | SV-11546 - A user without Work Orders create and edit cannot drag work orders | 15 Oct 2026 | 20 Oct 2026 | title, set-up, steps, expected result | Fast-follow folder (not in run 498) |

If anything is unclear or you would like me to explain a change in more detail, please just let me know — I am happy to help.

Thank you again for your support and for keeping the automation in such good shape.

Best regards,
Bilal

(Test run 498: https://shopview.testrail.io/index.php?/runs/view/498)
