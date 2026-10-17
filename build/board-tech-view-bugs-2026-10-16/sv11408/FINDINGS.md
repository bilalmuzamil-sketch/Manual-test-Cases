# SV-11408 — Tech View and Board View: first-run state when there are no work orders at all

- **Verdict: PASSED (6 of 6)** — Jira comment 78923, posted 17 Oct 2026.
- Staging `v26.40.19-754919e` (read at start and at the gate); Production `v26.40.19-d2441a9`.
- Source: PRD 845185030 v64 S1-N1a, S1-N1b, S1-N1c (quoted in the comment); ticket "How to check" (3 bullets).
- Admin quick-login; location switched to ZZAUTOTEST F2 Empty Shop for the tests and back to Staging Heavy Duty - 9919 after every run (read back).

## Matrix (scripts e11408*.mjs, data/*.json)
| Cell | Tech View | Board View | List |
|---|---|---|---|
| All tab (has 6 WOs) | rows | rows | rows |
| Estimates tab, no WOs, no filter/search | first-run: clipboard-list 24 px in a 48 px circle rgb(238,242,246), 2 lines exact, button `button_first_run_create_work_order` | same | magnifier + "No work orders found." |
| Work Orders tab (has WOs) | rows | rows | rows |
| Completed tab, no WOs | first-run, same | same | magnifier + "No work orders found." |
| Search only "zzqnomatch" | S1-N1b exact, no button | same | same words |
| Filter "Assigned to me" | S1-N1a exact + Clear all filters (`empty_state_clear_filters`) | same | same |
| Filter + search | S1-N1a | S1-N1a | – |
| Clear all filters | first-run state back | same | – |
| Empty-state button vs page button (`button_new_work_order`) | both open "New Work Order" with the same 8 controls (dialog_title, button_close_dialog, select_customer_select, button_add_customer, select_company_vehicle_select, button_add_vehicle, checkbox_is_vehicle_here, button_save_work_order) | same | – |
| Production List | Inventory 2 location (no WOs): magnifier + "No work orders found."; search and filter messages word-for-word the same as staging List | | |

Not done: saving a work order through the empty-state button (it would fill the empty location used by other tests; opening the same dialog is the ticket's "opens the same flow").

Observed: closing the New Work Order dialog with the x asks "Are you sure you want to close this dialog?" (Cancel / Close) — the second confirmation; both closes in the film needed *Close*. Not part of this ticket.

## Evidence
- `ev/sv11408-01-first-run.png`, `ev/sv11408-02-filtered-and-button.png` (`build_exhibits.py`), raw 2x screenshots in `ev/`.
- Film `ev/sv11408-first-run-staging-recording-voiceover.mp4`: 118.6 s → 65.6 s, idle removed 53.3 s (13 stretches); offsets n1 0.5, n2 12.7, n3 18.88, n4 29.42, n5 39.46, n6 49.64, n7 60.52; caption strip checked (`voiceover/cut.check.png`). About 1 s where the "After Clear all filters" caption is still showing as the view switches to List.
- A first take crashed and left the "Assigned to me" filter on for the admin user; the next take cleared it before filming (logged `clearedLeftover`). Final state: no filter on.

## Gate
build identical · ticket TESTING STAGE, 1 comment · PRD v64 · text scan clean · posted 78923 · read back: PASSED panel, media 1024x548, 1024x622, video; table 7 rows; steps 7.
Learning check: nothing new beyond the dialog close confirmation (already Rule 102).
