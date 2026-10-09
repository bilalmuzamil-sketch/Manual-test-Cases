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
| D3 | C96929 | Before anyone reorders a group, Tech View and Board View list its work orders in the order they were made, not in List's default order (Customer A-Z) | SV-10045 (Story 2) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | `D3-C96929-1-list-annotated.png`, `D3-C96929-2-board-annotated.png` (2x, re-verified 9 Oct 13:07) |
| D4 | C96938 | Hovering a technician's avatar in a Tech View group header shows no name | SV-10045 (Story 2) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | `D4-C96938-tech-annotated.png` |
| D5 | C368131 | A technician whose Location field no longer includes this location is still offered here, and their pinned column keeps "Drag a work order here to assign it" instead of "No work orders" | SV-10046 (Story 3) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | `D5-C368131-board-annotated.png` (2x, re-verified 9 Oct 12:53) |
| D6 | C368135 | A click outside the "Clear …'s scheduled shifts?" question does not call the change off (Cancel, X and Escape do) | SV-10047 (Story 4) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | picture to be made with the 2x recapture |
| D7 | C368138 | Dropping next to a card another person just moved shows the general "Couldn't save the new order" headline above the expected sentence, instead of exactly that sentence | SV-10047 (Story 4) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | `D7-C368138-alert-annotated.png` |
| D2 | C96923 | After changing location, Assigned to me stays switched on (List, Tech View and Board View alike) | SV-10044 — **Ready for QA** (read live 9 Oct 2026 11:14 UTC) | `D2-C96923-board-annotated.png` |
| D10 | C96978 | Board View's Estimated hours field never shows on a card, although it is turned on and the work order's lines carry estimated time | SV-10048 (Story 5) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | `D10-board-fields-open-annotated.png`, `D10-wo-lines-annotated.png` |
| D9 | C96983 | When the saved Work Orders choices cannot load, the next field choice is not saved: no save is sent and the choice is gone after a reload | SV-10048 (Story 5) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | `D9-C96983-1-failure-annotated.png`, `D9-C96983-2-after-reload-annotated.png` (2x, re-verified 9 Oct 12:56) |
| D8 | C96962 | A technician added to a line in the Edit Line window is saved, but no history entry is written for it (neither the line's Audit log nor the work order's history) | SV-10047 (Story 4) — **Ready for QA** (read live 9 Oct 2026 11:14 UTC; read again before each ask) | picture to be made with the 2x recapture |

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

## D10 — C96978 · Estimated hours never shows on a card

**What happens:** Board View > Fields to display > Estimated hours turned on. Work order S10043-18032 has three lines
with estimated time 0.3 + 1.5 + 0.4 hours (its page shows them), yet the card shows no Estimated hours field at all.
The work order's own total estimate reads 0.00. Same on S10043-18036 at Compact, Regular and Comfortable. Every
other optional field turned on at the same time does show.
**What the case expects:** each field on the card shows the same value as the work order (e.g. 8.0 estimated hours).
(PRD S5-R11: "Offer the optional fields listed below using their existing production meaning" — the list includes
"estimated hours".)
**Open before asking:** what "estimated hours" means in production for a work order (the sum of its lines' Estimate,
as the page shows, or a separate work-order estimate that is 0.00 here). If it is a separate value that is simply
empty, the card is right to leave it off (empty fields are left off) and this is not a defect.
**Steps for the QA lead:** open any work order with lines that have an Estimate > Work Orders > Board View >
Fields to display > turn Estimated hours on > the card shows no Estimated hours.

## Production check, 9 October 2026 (production v26.40.13-013e543, the second production test account — never the QA lead's)

Evidence: `evidence/prod-2026-10-09/` (pictures at 2x, `prod-check.json`), script `prod-check.mjs`.

| Report | What production does today | What it means for the report |
|---|---|---|
| **D2** (C96923) | Work Orders > All > **Assigned to me** on > initials > Change Location: *Truck Hill 1* → *Trucks Hill 2*: the top bar reads Trucks Hill 2 and **Assigned to me is still on** (address keeps `?assigned_to_me=1`). Pictures `D2-prod-on.png`, `D2-prod-after.png`. | The source sentence *"Assigned to me resets on location change, as it does today"* (PRD S1-E3) does not match today's product: production keeps it on, and so does the test branch. **Not raised as a defect — a question for the product owner** (Rule 58): should a location change switch Assigned to me off (a new behaviour), or is the "as it does today" sentence wrong? |
| **D8** (C96962) | Work order S1-915, Line 1 *Sadasdsad* > Edit Line > Add Technician > a new technician > Save & Close: the technician **is added** (read back on the line), but the line's history stays at 5 entries and the work order's history at 6 — **no entry is written**, twice, for two different technicians. | Production does not audit this change either, so there is no *"existing line auditing"* for this story to *"continue"* (PRD S4-R18). **Not raised as a defect**: the case's "as it does today" premise is contradicted by production. Put to the QA lead with the case text. |
| **D10** (C96978) | The work-order list carries **`timeEstimate`** = the sum of its lines' estimated time (S1-915: one line of 120 min → 120; S1-816 and S1-793: 60 → 60). Production's List offers no Estimated hours column. | "Estimated hours" in production is the work order's time estimate, **the sum of its lines' estimates**. On the test branch the card shows no Estimated hours at all for a work order whose lines carry 0.3 + 1.5 + 0.4 h — **the report stands**. |
| **D4** (C96938) | — | **Already reported** by Ahtasham Amjad on 8 Oct 2026: [SV-11075](https://shopview.atlassian.net/browse/SV-11075) *Tech View – technician avatar in group header has no name tooltip* (Open, under SV-10045). No second ticket; the run's result for C96938 is to point at SV-11075. |

Owning stories read live 9 Oct 2026: SV-10044, SV-10045, SV-10046, SV-10047, SV-10048, SV-10049, SV-10050, SV-10051, SV-10052,
SV-10054 are all **Ready for QA** (Rule 112 allows filing); SV-10053 is OBSOLETE. Existing Story Defects under them: SV-11075
(= D4) and [SV-11074](https://shopview.atlassian.net/browse/SV-11074) (*Board View – drag made while offline isn't reverted and is saved on reconnect*, Open, SV-10052) — no overlap with D1–D10 other than D4.


## Re-verification on the build of 9 October 2026 (Rule 62(c) / skill 06 §6e)

| Report | Re-run | Still happens? |
|---|---|---|
| D1 (C96918) | s1-batch1, 05:13 | **Yes** — a no-match search still reads *No work orders match the search "ZZNOMATCH123".* with no Clear filters action (List, Tech View, Board View). |
| D10 (C96978) | s5-batchC, 05:29 (2x) | **Yes** — S10043-18218, three lines estimated 18 + 90 + 24 min (2.2 h); Fields to display offers 13 fields and all 13 were on, Estimated hours included; the card shows every other field but no Estimated hours; the work order's own estimate reads 0.00. Pictures `evidence/recapture-2026-10-09/C96978-*.png`. |
| D5 (C368131) | s3-batchC, 05:26 | **Yes** — Ayesha Khan's Location changed to Staging Lethbridge - 4310 only: at Heavy Duty she is still eligible and her pinned column reads *Drag a work order here to assign it*; control in the same run: Jenny Wilson (deactivated) reads *No work orders*. Restored afterwards. |

## QA lead rulings, 9 Oct 2026 (answers to the four questions)

| Item | His answer (verbatim) | What it means here |
|---|---|---|
| D2 (C96923) — Assigned to me stays on after a location change, here and on production | *"If that is against the spec we will create a ticket for it with the reference from specs and with annotated screenshot and everything which tells the problem."* | **D2 is a defect report.** Ticket drafted (`tickets/D2-ticket.wiki`), pictures from `d28-pics.mts`; the run result is Failed with the ticket held. Production behaving the same does not stop it. |
| D8 (C96962) — Edit Line technician add writes no history, here and on production | *"If that behavior is against the Specs then it warrants for a defect ticket."* | **D8 is a defect report.** Ticket drafted (`tickets/D8-ticket.wiki`), pictures from `d28-pics.mts`; result Failed, ticket held. |
| Analytics reports (C97026, C97033, C97034) | *"Leave blocked"* | Stay Blocked; nothing more to do. |
| Missing screens (C368169–C368171 Edit Work Order; C368218, C368219, C368223 Parts filters) | *"You need to tell me for all these … so that I can manually check and tell you if you are missing something and I can unblock you and you can also then save it in your recipe/playbook etc for future use aswell."* | Manual-check guide sent to him: `MANUAL-CHECK-missing-screens.md`. Whatever route he finds goes into the playbook and the six are re-run. |

## D8 re-verification, 9 Oct 2026 13:09 (before any ask — Rule 62(c))

Recapture on a FRESH line with NO technician: adding Dana Ortiz in Edit Line DID write a line entry ("Line tech changed — Admin ShopView — Tech: - → Dana Ortiz", line menu > Audit log). The 8 Oct report was made on a line that ALREADY had a technician (Ralph Edwards, who came with the lead), where adding Dana wrote nothing. So D8 as written ("no history entry is written") does not hold in general. The original state is being rebuilt (`d8-pics2.mts`): if no entry appears there, D8 is narrowed to "adding a technician to a line that already has one"; if one appears, D8 is CLOSED and C96962's Failed result is corrected.

## Questions for the QA lead (gathered for the defect round)

| # | Check | What happens | The question |
|---|---|---|---|
| Q1 | C368170 | On an Invoiced work order the card locks Lead Technician, Mileage and Engine Hours, but the Customer PO on the Finance tab can still be changed (PO-100 → PO-200, kept after reload). | The case expects the PO to stay; its source sentence is about "other edits in the **same save**", and on this build the PO saves on its own. Does the PO change count against the case (Failed + report) or not (Passed)? |
| Q2 | C368238 / C368239 setup | Admin ShopView's own "Assigned to me" lists work orders he only created (Service Advisor), not ones he leads. | The cases assume "Assigned to me" lists none for him. Is "Assigned to me" meant to include work orders where you are the Service Advisor? (Observation only — not raised as a defect without the source.) |

## Left for manual testing (QA lead, 9 Oct 2026)

*"Any test cases that require Organization B leave them for manual testing."* — C368175 (line technician lists offer no staff from another organization) and C154650 (Tech View and Board View show only this organization and location). Not run by script; left Untested in run 498 for the manual tester.


## Filed (per-ticket approval, 9 Oct 2026)

| Report | Ticket | Case | Filed |
|---|---|---|---|
| D2 — "Assigned to me" stays on after changing location | [SV-11098](https://shopview.atlassian.net/browse/SV-11098) (Story Defect, Open, under SV-10044, relates to SV-10044) | C96923 | QA lead approved 9 Oct; picture inline full-width, verified |
| D1 — a search with no results has no Clear filters action | [SV-11099](https://shopview.atlassian.net/browse/SV-11099) (Story Defect, Open, under SV-10044, relates to SV-10044, label board-tech-view) | C368211 (C96918, the original case, no longer exists in TestRail — `get_case` refuses it — so it is not linked) | QA lead approved 9 Oct; picture inline full-width; ends with the case link (Rule 120) |

**Standing for this suite (QA lead, 9 Oct 2026, with a picture of the label):** *"for this testing suite apply this label to all the defects you are creating."* ⇒ every ticket from this suite carries the Jira label **`board-tech-view`** (SV-11098 given it after filing). Every draft in `tickets/` now has `LABEL: board-tech-view` and ends with its `h2. Test case` link (Rule 120).
