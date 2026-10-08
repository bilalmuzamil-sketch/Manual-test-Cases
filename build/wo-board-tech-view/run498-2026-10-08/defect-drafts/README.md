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
| D2 | C96923 | After changing location, Assigned to me stays switched on (List, Tech View and Board View alike) | SV-10044 | `D2-C96923-board-annotated.png` |

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
