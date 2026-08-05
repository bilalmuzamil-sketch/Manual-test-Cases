# Schedule — OUTSIDE-IN GAP HUNT, 5 August 2026 (Standing Rules 45 + 46)

Rules 40–44 make us follow through on what **we** found. This exists because we had no way to notice
that an outsider could see what we could not. All five checks ran; each result is stated.

## (a) Reverse-coverage diff, run in BOTH directions

**Their assertions with no counterpart in ours** — run over **all 22 story defects** on this epic
(12 from Mudassir Qamar, 7 from Ayesha Khan, 3 more from Mudassir on 5 Aug). Read-only.

**Rule 45(e): no "covered" verdict below without BOTH TEXTS QUOTED SIDE BY SIDE.** A verdict naming
only case ids is non-compliant.

### COVERED-BY — 19 of the 22

| Defect | What the DEFECT asserts | What OUR case asserts | Our case |
|---|---|---|---|
| SV-8826 | *"Schedule week view starts on Sunday instead of Monday"* | *"Week: the grid shows a 7-column **Monday-to-Sunday** layout with stacked shift chips per cell."* | SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) |
| SV-8827 | *"View Options — Business Hours and Tech Hours defaults"* | *"Defaults: **Business Hours OFF**, Capacity Bars ON, Events ON, **Tech Hours OFF**, Saturday ON, Sunday ON."* | SCH-VIEW-05 = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) |
| SV-8829 | *"estimated hours is not editable"* | *"The estimated hours field is **editable directly in the modal**."* | SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) |
| SV-8830 | *"Weekend shift is not flagged as a conflict"* | *"The shift is created but **flagged as a conflict** because the day is outside the technician's configured working days."* | SCH-CONF-02 = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) |
| SV-8831 | *"Technician Jose Young appears on the Schedule grid but has no staff record"* | *"The department-assigned staff member appears as a technician row — row presence is controlled by **the department on the staff record**."* | SCH-PERM-10 = [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) |
| SV-8833 | *"time picker allows any minute instead of 15-minute increments"* | *"The time pickers offer **15-minute increments** (for example 8:00, 8:15, 8:30, 8:45)."* | SCH-MODAL-02 = [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) |
| SV-8834 | *"shows time logged as complete when nothing has been clocked"* | *"A progress indication compares **time logged against the estimate** … The numbers are consistent with the line's actual logged time."* | SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) |
| SV-8835 | *"Hover tooltip shows VIN even when the VIN toggle is off"* | *"the tooltip shows the VIN whenever the unit has one, **regardless of the 'VIN Number' toggle**"* — **deliberately the opposite of the ticket, per Branko's 31 July ruling (Rule 33)** | SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) · SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) |
| SV-8837 | *"Day view does not auto-scroll to the working-day start"* | *"the timeline is **auto-scrolled so the working-day start sits at the left edge**, with a small buffer."* | SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) |
| SV-8839 | *"Capacity bar counts full capacity on days technicians are not working"* | *"the blue fill represents total technician-hours booked … **divided by total available (sum of all techs' working hours)**."* | SCH-CAP-01 = [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) |
| SV-8840 | *"No drag feedback while dragging a line onto the grid"* | *"The cell currently under the cursor **highlights** as a drop target. A **ghost block follows the drag** showing the line name and its hours."* | SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) |
| SV-8841 | *"Sidebar search returns no results when you type the full [shop-prefixed] work order number"* | *"Work-order-number search narrows the list to the card(s) whose work order number matches"* + a tester note naming the prefixed form and SV-8841 | SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) |
| SV-8864 | *"Conflict pop-up opens misaligned"* | *"When there is not enough room below, the tooltip opens **ABOVE** the block … shifts horizontally to stay fully within the viewport. **No part is clipped.**"* | SCH-TIP-05 = [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) |
| SV-8865 | *"Recurring (series) shift can't be opened or deleted in Month view"* | *"**All three views** handle the overlap … The overflow affordance opens the hidden-shifts popover **in each view**."* + *"Delete on a series member asks for a deletion scope"* | SCH-LANE-04 = [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) · SCH-MODAL-08 = [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) |
| SV-8868 | *"Status filter returns no work orders for most statuses"* | *"Only work orders in the chosen status remain in the card list"* — **re-proven live over all 8 statuses, 0 leaks** | SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) |
| SV-8869 | *"No drag feedback when dragging a work order onto the grid in Day view"* | same assertion as SV-8840 above, and the case is view-agnostic | SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) |
| SV-8873 | *"Sidebar search returns no results when you type a technician's [full] name"* | *"it must work when you type the technician's name the way the card shows it, first name and last name together"* — **restored this pass; SV-8873 confirmed live** | SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) |
| SV-8874 | *"Grid search hides non-matching shifts instead of fading them"* | *"blocks that do not match **fade** … Matching blocks **stay in place** (search visually filters; it does not remove)."* | SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) |
| SV-8877 | *"Conflict list does not show which technician or day each conflict belongs to"* | *"Clicking opens a dropdown **listing each conflict**"* and *"The grid **navigates to the relevant technician and day**."* | SCH-CONF-05 = [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) · SCH-CONF-06 = [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) |

**Honest note on SV-8877:** the match is partial. Our cases assert the list exists and clicking a row
navigates; **neither asserts that each row LABELS its technician and day.** That is a genuine
sub-assertion gap, smaller than a whole case. Recorded rather than papered over.

### CANDIDATE GAP — 3 of the 22, with NO counterpart among our 165

| Defect | Status | What it asserts that we do not test | Best overlap found in our 165 |
|---|---|---|---|
| **[SV-8863](https://shopview.atlassian.net/browse/SV-8863)** | **Ready to Fix** — accepted | *"Schedule opens in **Week** view by default instead of Day view."* **Which view the module opens on** is asserted by no case of ours. SCH-NAV-03 tests that the segmented control *switches* between the three; it never says which one is showing when you arrive. | 0.50, and on an unrelated case (SCH-COLOR-01) — i.e. no real match |
| **[SV-8870](https://shopview.atlassian.net/browse/SV-8870)** | Open | *"Cannot create a shift by **dragging a work order onto a day in Month view**."* Every one of our 8 drag-and-drop cases is written against the day/week grid. **Month-view drag-create is untested.** | 0.71, but against SCH-PERM-02, a permission case — not coverage |
| **[SV-8867](https://shopview.atlassian.net/browse/SV-8867)** | Open | *"Recurring (series) shift can't be **reassigned** in Week and Month view."* SCH-REAS-01 tests reassigning by drag, but **not a member of a SERIES**, and not per view. | 0.38 — the weakest score of all 22 |

**These three are NOT authored.** Reserved internal IDs, never used before and not on the retired list:
**`SCH-NAV-08`** (default view on open), **`SCH-DND-09`** (Month-view drag-create), **`SCH-REAS-07`**
(reassigning a series member per view).

**Why not authored:** authoring a case without observing the behaviour is exactly the failure this pass
exists to correct. Each needs a live run plus the QA lead's authorisation to add cases. **SV-8863 is
already accepted as Ready to Fix, so its case would be born `READY - EXPECT FAIL (SV-8863)`.**

### CONTRADICTS-OURS — 2 of the 22, and the rulings stand

**SV-8835** (VIN) and **SV-8829** (money) contradict Branko's rulings of 31 and 22 July. Per Rule 33 a
ticket raised on a spec sentence does not overturn a later PO decision: **the rulings stand, nothing
was changed on either side, and neither ticket was touched** (Rule 38). Both texts are quoted side by
side in `../expected-behaviour-audit-2026-08-05.md`.

## (b) The automation-engineer lens

*"If I were automating this from the running build, what would I assert?"* — and this pass **could**
apply it properly for the first time, because there was a live session.

It found the thing no document reading would have: **`button_sidebar_arm_<workOrderId>`**, with
`aria-label="Schedule S-12876 by click"` and `aria-pressed` flipping to `true`. An automation engineer
reading the DOM would have seen instantly that **click-to-arm is built** — while our records had it
down as *not built*. **That is exactly the outside-in blind spot this rule exists for, and it was ours.**

The lens is still **limited**: 158 of the 165 were not driven this pass, so their assertions were not
tested against what the build actually emits.

## (c) The hostile-reviewer lens

Run before delivery. The three sharpest challenges it produced, all now answered in the open:

1. *"You call this a final check but you only looked at 7 of 165."* — **True.** Stated in FINDINGS.md,
   READINESS-2026-08-05.md and decisions-register entry 2, with the reason.
2. *"Eight of your cases test what engineering intended, not what the product owner asked for."* —
   **True.** Decisions-register entry 3, risk marked HIGH.
3. *"Your own pass bent two expectations to match the build."* — **True, and we found it ourselves and
   reported it.** `../expected-behaviour-audit-2026-08-05.md`, decisions-register entries 4 and 5.

## (d) Every external signal treated as a coverage input, not a reply

| Signal | Treated as | Outcome |
|---|---|---|
| The QA lead's correction of principle | a coverage input | audit of all 165; the provenance line rewritten on every one |
| His clarification on Rule 25 | a coverage input | category D closed; two rewritten expectations restored |
| SV-8873 (Mudassir) | a coverage input | **our PASS was wrong** — re-tested every name form, verdict flipped |
| SV-8868 (Ayesha) | a coverage input | filter re-proven over all 8 statuses; the org-wide status counts recorded for whoever fixes it |
| SV-8863 / SV-8870 / SV-8867 | coverage inputs | **3 candidate gaps**, IDs reserved, awaiting authorisation |
| SV-8877 (raised today) | a coverage input | **partial** — a sub-assertion gap named above |

## (e) Compliance statement

Every "covered" verdict in section (a) quotes **both texts**. Where a requirement or a defect makes
more than one assertion, the assertions are verdicted separately — which is precisely how the SV-8877
shortfall surfaced instead of being absorbed into a comfortable "covered".
