# SV-11499 — List column choice lost after logging out and back in (QA, 21 Oct 2026)

**Verdict: PASSED** — Jira comment 79214 (2 exhibits, 10 checks). No recording, no technical section (batch ruling).
QA branch `sv11499` build **v26.40.20-00f1fd6** (index.html last-modified Wed 21 Oct 2026 13:03:54 GMT, etag
`275e9cd46fa2ca6a39770758025e6cd1`; re-read after posting, unchanged). Before = staging v26.40.20-c627fc7. PRD v73 S5-R8.
PR ShopView/shopview#3861 (open): real cause = a stale Work Orders window saving layout edits with a whole-document PUT that
carried its old List columns; fix sends sparse PATCHes for layout edits; List/tab/filter/sort edits still PUT the whole document.

## Matrix (all observed on screen + saved preferences `GET /api/users/me/preferences/work-orders-list`)
| # | Cell | Staging | Branch |
|---|---|---|---|
| 1 | List: Progress off, Waiting On Parts off, Asset on → Logout → quick-login | (off→off kept too on c627fc7) | kept |
| 2 | New browser context | – | kept |
| 3 | Tabs Estimates / Work Orders / Completed / All | – | same columns |
| 4 | Location → Lethbridge 4310 | – | same columns (switched back to Heavy Duty) |
| 5 | Tech View Unit off → relogin; List unaffected | – | kept, separate |
| 6–9 | Stale window: display → Tech View, density, Tech View column, Board View | PUT whole doc → Progress back (4/4) | PATCH only that field → Progress off (4/4) |
| 10 | Stale window: List tab switch / sort | Progress back | Progress back — Production v26.40.20-aada856 does the same (2/2) → "as today" (S5-R8) |

Note: the plain logout/login flow (ticket's steps) no longer reproduces on staging c627fc7 in either direction; the two-window
path is what reproduces there.

## Restores
- Staging admin preferences snapshot → PUT back, read back equal (twice).
- Production preferences (snapshot taken before the first, killed run) → PUT back, read back equal.
- Branch: nothing restored (per-ticket branch).

## Gate
Ticket TESTING QA, 0 comments; PRD 73; media read back 1000x444 / 1000x356; table 11 rows; 6 steps; branch marker re-read.
Learning check: Tech View has its own column button `button_tech_view_column_selection` (List: `button_column_selection`);
layout preferences live at `/api/users/me/preferences/work-orders-list` (PUT whole value, PATCH `{value:{..}}`/`{entries:{..}}`).
