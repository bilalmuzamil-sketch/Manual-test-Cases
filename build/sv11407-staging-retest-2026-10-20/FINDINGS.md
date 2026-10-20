# SV-11407 staging retest — 20 Oct 2026

Ticket: Tech View and Board View: Back brings the top row or card back fully shown. TESTING STAGE, Slavcho Mitrov.
Last comments before this pass: ours 78932 (PARTIALLY PASSED) + 78933 (remaining issue: Board Unassigned top card 2 px cut).
Source: PRD 845185030 **v68** (19 Oct) S1-R8, quoted. Ticket "How to check" = pass bar (Chris 78809).
v68 S1-R8 also says the tab and filters come back; that clause belongs to SV-11421 (Board/Tech) / SV-11440 (List, Open) — not judged here.

## Build
- Matrix first ran on `v26.40.20-3312e15` (index last-modified 10:37:43 GMT); **staging redeployed mid-run at 11:36:03 GMT to
  `v26.40.20-9c75418`**. Every cell was re-run on 9c75418; only 9c75418 results are reported. All cells also passed on 3312e15.
- Window 1440 x 900, zoom 100%. Harness `bk07c.mjs` (bk07b + measures only on-screen Board columns that hold cards; needed
  for sideways 900 where the first measured column was empty). pick=second (a lower card/row) or mouse (click the visible
  part of the cut item itself — avoids Playwright's scroll-into-view artefact).

## Matrix on 9c75418 (data/n2*.json, ev/x2*.json)
| Cell | Result |
|---|---|
| Board, Tech, cut 0.25 / 0.5 / 0.75, lower card | Unassigned 207 vs edge 206, ZA/ZB 208 — all fully shown |
| Board, Tech, cut 0.5 / 0.75, mouse on the cut card S2-32218 | same |
| Board, sideways 600 / 900 | scrollLeft 600→600, 900→900; all columns fully shown |
| Board, Regular spacing | Unassigned 207, ZA/ZB 208 |
| Board, Comfortable spacing | Unassigned **206** (flush with the edge, 0 px gap; 2x pixel check: border rows 412–413 directly under edge line 410–411 — visible), ZA/ZB 208 |
| Board, Admin (other location, Unassigned 2127) | 255 vs 254, fully shown |
| Tech View, cut 0.25/0.5/0.75/0.9, lower row | row back at 224 = held header bottom, fully shown |
| Tech View, mouse on the cut row | same |
| Tech View, sideways (max 170) | 170→170, row fully shown |
| Tech View, Regular / Comfortable | 224 / 236 = header bottom, fully shown |
| Tech View, Admin | 264 = header bottom, fully shown |
| Unassigned Board column on this build | 11 of 11 fully shown (17 Oct: 9 of 9 cut 2 px) |

Pixel proof (2x, `ev/x2b-after.png`, Compact): Unassigned column edge line rows 410–411, white 412–413, card border 414–415.
17 Oct (`board-tech-view-bugs-2026-10-16/sv11407/ev/bv-after.png`): line 410–411, no card border (at css 204, under the edge).

## Exhibits
`sv11407-01-unassigned-before-after.png` (17 Oct vs today + magnified edge), `-02-tech-view-before-after.png`,
`-03-board-view-before-after.png`; `build.py`. No production before: these views are not on production.

## State
Tech + Admin work-orders-list prefs saved (`/tmp/qa11310/ev07/prefs0-*.json`) and restored after every density change —
`restore 200 identical true` both users. Nothing else written.

## Outcome
QA lead shown the per-point coverage (incl. the Comfortable 0 px flush detail) and chose "New PASSED comment".
Pre-post gate (20 Oct): build marker re-read v26.40.20-9c75418 (same as tested), ticket still TESTING STAGE with no new
comment since 78933, PRD still v68, text scanned (no AI fingerprint, no technical section). **Posted comment 79103**:
read back = green PASSED panel first, 3 attachments in order (62710/62711/62712, 900x947 / 900x454 / 900x748), table
9 rows + header, 7 steps. Older comments 78932/78933 left for the QA lead to delete. No recording, no technical section.
