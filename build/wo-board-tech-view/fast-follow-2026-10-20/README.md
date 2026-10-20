# WO Board: Fast-follow (20 Oct 2026)

QA lead, 20 Oct 2026: every case blocked on SV-11522 / SV-11524 goes to a new folder "Fast-follow", out of the test run, kept
as a case. Fast follow = worked on after the release. Reference (Chris Ward, Slack, 20 Oct 2026 04:10 +04):
https://shopview.slack.com/archives/C0C41RV3T3L/p1792455057423139 — "I've labelled these 2 as fast-follows ... it's a bit late in
the game to make these changes and successfully make it through regression testing, and these do not impede the users functionality".
The same reference is the Fast-follow section's description in TestRail.

- Found by script: 27 cases whose AUTOMATION line or Known problem note names SV-11522 or SV-11524 (`candidates.json`), all ours.
- Folder: section 87347 "Fast-follow" under group 13204. All 27 moved; content unchanged (`move-log.json`).
- Run 498: 297 -> 270, only the 27 removed, no other test changed (`run-update-log.json`). Their tests and 116 results were saved
  first (`before/run498-results-27-cases.json`).
- QA lead chose "Move all 27, plus copies": 17 of the 27 also check things in this release; copies of those checks without the
  fast-follow step are proposed in `COPIES-PROPOSAL.md`, waiting for his go-ahead.

## Release copies created (20 Oct 2026)

| Original (Fast-follow) | Copy | Title | Test in run 498 |
|---|---|---|---|
| C96963 | [C690642](https://shopview.testrail.io/index.php?/cases/view/690642) | Lead of an Invoiced or Paid work order cannot be changed (release) | [T4075384](https://shopview.testrail.io/index.php?/tests/view/4075384) |
| C96973 | [C690643](https://shopview.testrail.io/index.php?/cases/view/690643) | Reassign lead technician dialog lists technicians outside the filter (release) | [T4075385](https://shopview.testrail.io/index.php?/tests/view/4075385) |
| C97002 | [C690644](https://shopview.testrail.io/index.php?/cases/view/690644) | Dragging a card changes its lead, dragging to Unassigned clears it (release) | [T4075386](https://shopview.testrail.io/index.php?/tests/view/4075386) |
| C97007 | [C690645](https://shopview.testrail.io/index.php?/cases/view/690645) | A lead set on the work order page sends it to the bottom (release) | [T4075387](https://shopview.testrail.io/index.php?/tests/view/4075387) |
| C97008 | [C690646](https://shopview.testrail.io/index.php?/cases/view/690646) | Moving a card updates the counts, reordering shows no message (release) | [T4075388](https://shopview.testrail.io/index.php?/tests/view/4075388) |
| C97009 | [C690647](https://shopview.testrail.io/index.php?/cases/view/690647) | Invoiced and Paid work orders can be reordered but not reassigned (release) | [T4075389](https://shopview.testrail.io/index.php?/tests/view/4075389) |
| C97028 | [C690648](https://shopview.testrail.io/index.php?/cases/view/690648) | Blocked analytics never stops the page, settings or a lead change (release) | [T4075390](https://shopview.testrail.io/index.php?/tests/view/4075390) |
| C154889 | [C690649](https://shopview.testrail.io/index.php?/cases/view/690649) | Removing the lead by drag or Unassign asks the clear-shifts question (release) | [T4075391](https://shopview.testrail.io/index.php?/tests/view/4075391) |
| C368133 | [C690650](https://shopview.testrail.io/index.php?/cases/view/690650) | Clear-shifts question opens only for the old lead's unfinished shifts (release) | [T4075392](https://shopview.testrail.io/index.php?/tests/view/4075392) |
| C368135 | [C690651](https://shopview.testrail.io/index.php?/cases/view/690651) | Cancel, X or Escape on the clear-shifts question puts the card back (release) | [T4075393](https://shopview.testrail.io/index.php?/tests/view/4075393) |
| C368136 | [C690652](https://shopview.testrail.io/index.php?/cases/view/690652) | Clear-shifts question shows on Board and Tech View, not page or List (release) | [T4075394](https://shopview.testrail.io/index.php?/tests/view/4075394) |
| C368140 | [C690653](https://shopview.testrail.io/index.php?/cases/view/690653) | Assigning a lead by drag moves only open unassigned lines (release) | [T4075395](https://shopview.testrail.io/index.php?/tests/view/4075395) |
| C368144 | [C690654](https://shopview.testrail.io/index.php?/cases/view/690654) | Unassigning puts the work order in its normal place in Unassigned (release) | [T4075396](https://shopview.testrail.io/index.php?/tests/view/4075396) |
| C581891 | [C690655](https://shopview.testrail.io/index.php?/cases/view/690655) | Line with only a Schedule shift technician follows the new lead (release) | [T4075397](https://shopview.testrail.io/index.php?/tests/view/4075397) |
| C581892 | [C690656](https://shopview.testrail.io/index.php?/cases/view/690656) | The Clear shifts question ignores lines not approved or declined (release) | [T4075398](https://shopview.testrail.io/index.php?/tests/view/4075398) |
| C581893 | [C690657](https://shopview.testrail.io/index.php?/cases/view/690657) | An Entire work order shift stops counting after a new line is approved (release) | [T4075399](https://shopview.testrail.io/index.php?/tests/view/4075399) |

Run 498: 270 -> 286, nothing dropped, no result changed. Every copy read back field by field.
