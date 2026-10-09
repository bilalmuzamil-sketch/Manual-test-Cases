# WO Board / Tech View — reports held for the QA lead (run 498, QA branch sv10043, build v26.40.8-7a95011)

**Nothing here has been raised.** Process (QA lead, 2026-10-08): each report is kept drafted with annotated
pictures; he verifies it by hand, one at a time; a ticket is created only after he approves that one.
Before filing: re-read the owning story's status live (Rule 112), re-capture the pictures at 2x
(Rule 116), and re-check that it still happens on the build of that day (Rule 62(c)).
Source reconciliation: NOT done this pass — the QA lead will check the cases against the spec himself
(his decision, 2026-10-08), so each draft quotes the case's own source quote and says so.

| # | Case | What is wrong | Owning story | Picture |
|---|---|---|---|---|
| D1 | C96918 | A search that finds nothing says *No work orders match the search "…"* and offers no Clear filters | SV-10044 (Ready for QA when read on 2026-10-08) | `D1-C96918-board-annotated.png` |
| D3 | C96929 | Before anyone reorders a group, Tech View and Board View list its work orders in the order they were made, not in List's default order (Customer A-Z) | SV-10045 (Story 2) — status to be read live before asking | picture to be made with the 2x recapture |
| D4 | C96938 | Hovering a technician's avatar in a Tech View group header shows no name | SV-10045 (Story 2) — status to be read live before asking | `D4-C96938-tech-annotated.png` |
| D5 | C368131 | A technician whose Location field no longer includes this location is still offered here, and their pinned column keeps "Drag a work order here to assign it" instead of "No work orders" | SV-10046 (Story 3) — status to be read live before asking | picture to be made with the 2x recapture |
| D6 | C368135 | A click outside the "Clear …'s scheduled shifts?" question does not call the change off (Cancel, X and Escape do) | SV-10047 (Story 4) — status to be read live before asking | picture to be made with the 2x recapture |
| D7 | C368138 | Dropping next to a card another person just moved shows the general "Couldn't save the new order" headline above the expected sentence, instead of exactly that sentence | SV-10047 (Story 4) — status to be read live before asking | `D7-C368138-alert-annotated.png` |
| D2 | C96923 | After changing location, Assigned to me stays switched on (List, Tech View and Board View alike) | SV-10044 | `D2-C96923-board-annotated.png` |
| D9 | C96983 | When the saved Work Orders choices cannot load, the next field choice is not saved: no save is sent and the choice is gone after a reload | SV-10048 (Story 5) — status to be read live before asking | picture to be made with the 2x recapture |
| D8 | C96962 | A technician added to a line in the Edit Line window is saved, but no history entry is written for it (neither the line's Audit log nor the work order's history) | SV-10047 (Story 4) — status to be read live before asking | picture to be made with the 2x recapture |

## D1 — C96918 · No-results message and its Clear filters action

**Steps to check by hand**
1. Sign in to https://sv10043.qa.shopview.com as the Admin quick-login user.
2. Work Orders > All tab > Search, type `ZZNOMATCH123`.
3. Look at the page in List, then Tech View, then Board View (switcher at the right of the toolbar).

**What you will see:** one message for the whole page, *No work orders match the search "ZZNOMATCH123".*,
and no Clear filters button. The only way out is the small x in the search box.
**What the case expects:** *No work orders match your filters*, with a Clear filters action, in all three displays.
Side note: when it is the FILTERS (not the search) that find nothing, the page says *No work orders match these
filters* and offers *Clear all filters*. So the search case is the odd one out.

## D2 — C96923 · Assigned to me is not switched off by a location change

**Steps to check by hand**
1. Sign in as the Admin quick-login user at Staging Heavy Duty - 9919. Open Work Orders, All tab.
2. Choose Board View. Turn on Assigned to me.
3. Click your initials at the top right > the orange location button under "Change Location:" > pick Staging Lethbridge - 4310.
4. Look at the toolbar.

**What you will see:** the page stays on Work Orders, All tab, Board View, and **Assigned to me is still on**
(the address also still ends in `?assigned_to_me=1`). The same happens in Tech View, and in List.
**What the case expects (its source quote, PRD S1-E3):** *"Assigned to me resets on location change, as it does today."*
**Open point:** on this build the plain List also keeps it on, so either List changed on this branch, or the live
product already keeps it on and the source's "as it does today" is wrong. That has not been checked on the
live product yet; it should be before this is raised.
**Also seen (not part of this report):** after moving to Lethbridge, picking Staging Heavy Duty - 9919 in that menu
did nothing (three tries, and after a refresh); the menu's orange button kept showing Heavy Duty while the top bar
read Lethbridge.

## D3 — C96929 · A group's work orders do not start in List's default order

**Steps to check by hand**
1. Make three work orders, in this order, for three customers whose names sort differently (e.g. Zeta…, Alpha…, Mid…), all led by one technician who leads nothing else.
2. Sign in as a user who has never reordered anything (on this branch: ZZAUTOTEST WOB User B). In List, All tab, note the order of the three: List's default sort is Customer A-Z, so Alpha, Mid, Zeta.
3. Switch to Tech View and find that technician's group; then Board View and that technician's column.

**What you will see:** Zeta, Alpha, Mid in both (the order they were made).
**What the case expects:** List's default order, Alpha, Mid, Zeta, in Tech View and Board View.

## D4 — C96938 · No name on hovering a technician's avatar

**Steps to check by hand**
1. Work Orders > All > Tech View. Pick any technician group, e.g. Aaron Baker.
2. Hover the round avatar (initials) at the left of the name. Then hover the name.

**What you will see:** nothing on the avatar; the name shows the browser's own hover text with the full name.
**What the case expects:** hovering the avatar shows the technician's full name (and the long-name header or its avatar shows the full name even when shortened).

## D5 — C368131 · Changing a technician's Location does not take them off this location

**Steps to check by hand**
1. Settings > Staff > edit a technician who is enrolled at two locations (on this branch: Ayesha Khan) > Location = Staging Lethbridge - 4310 > Save & Close.
2. Back at Staging Heavy Duty - 9919: Work Orders > Board View. Look at her column; open any card's More actions > Reassign lead technician and look for her name.
3. Afterwards set her Location back to Staging Heavy Duty - 9919.

**What you will see:** her column is still there with "Drag a work order here to assign it", and she is still offered as a lead technician.
**What the case expects:** a technician no longer at this location shows "No work orders" in their (pinned) column and cannot be given work here.
**Note:** a technician enrolled at only one location cannot have it removed at all (the Location list offers only that one), so the case's step 2 cannot be followed as written. The deactivated half of the same case passed.

## D6 — C368135 · Clicking outside the shift question does nothing

**Steps to check by hand**
1. A work order led by a technician who has a shift on it for the whole work order tomorrow (e.g. 8:00–12:00).
2. Board View: drag its card into another technician's column. The question "Clear …'s scheduled shifts?" opens.
3. Click an empty part of the page outside the question.

**What you will see:** the question stays open and the card stays in the new column; only Cancel, the X or Escape call it off.
**What the case expects:** a click outside calls the change off like the others: the card goes back to its place and no message appears.
**Note:** the question itself is new on this build (the case's "today" note expected none); everything else about it behaved as specified.

## D7 — C368138 · The "card next to it has moved" alert has an extra headline

**Steps to check by hand**
1. Three work orders led by one technician, Board View open in two tabs.
2. Tab 2: drag the middle card into another technician's column.
3. Tab 1, without reloading: drop the last card directly above that middle card.

**What you will see:** one alert reading "Couldn't save the new order. Please try again." with "The card you dropped this next to has moved. Refresh the board and try again." under it. The card goes back correctly.
**What the case expects:** an alert reading exactly "The card you dropped this next to has moved. Refresh the board and try again."

## D8 — C96962 · A line edit writes no history entry

**What happens:** on S10043-17986, Line 1 ("Service - Cabin air filter") was opened in the Edit Line window, Dana
Ortiz was added under Add Technician and Save & Close was pressed. The change saved (the line's technicians then read
"Dana Ortiz, Ralph Edwards"), but nothing was recorded: the line's Audit log (line menu > Audit log) still held only
"Line created", and the work order's change history had no new entry.
**What the case expects:** "Changing a line's technician directly in Edit Line still adds its own line entry, as it does
today." (PRD S4-R18: "Continue existing line auditing for technician changes made directly on a work order line.")
**The rest of the case passed:** each of the three lead changes added exactly one history entry; lines that moved with
the lead added none.
**Open before asking:** whether production writes a line entry for this today (the case says it does) — check it on
production, because if production does not either, this is not a change made by this story.
**Steps for the QA lead:** open any work order with a line > click the line's name > Edit Line > Add Technician > pick
someone > Save & Close > line menu (⋮) > Audit log: no entry for the technician change.

## D9 — C96983 · A field choice made after a load failure is not saved

**What happens:** with the saved Work Orders choices failing to load, Board View and Tech View correctly show their
defaults. Turning a field on (On-site) then shows on the menu, but the page sends no save at all, and after a
reload the choice is gone. A normal change a moment earlier was saved, so the recorder works.
**What the case expects:** "The next field choice made after the failure is saved and is still there after the
reload." (PRD S5-N3: "Save the user's next field selection after a preference-load failure.")
**How it was forced:** the page's request for the saved choices was answered with a server error (the case says a
developer must force it by hand). **Steps for the QA lead:** needs a developer to make the saved-choices request
fail; then in Board View > Fields to display turn one field on, remove the failure, reload: the field is off again.
