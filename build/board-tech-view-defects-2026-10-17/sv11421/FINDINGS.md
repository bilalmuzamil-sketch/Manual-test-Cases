# SV-11421 — QA result (17 October 2026)

- Verdict: **PASSED** — Jira comment 78928.
- Environment: staging v26.40.19-754919e; Production v26.40.19-d2441a9 for the List comparison. Window 1440 x 900, zoom 100%.
- Spec: Confluence 845185030 v64 S1-R8 (Chris 2026-10-16: Board/Tech restore tab, filters, position; List left as today — List tab loss is its own bug SV-11440).

## Matrix (bk-*.json, list-back-*.json, film run.json)
| Case | Before | After Back |
|---|---|---|
| Board, no filter (search ZZAUTOTEST F1 Scroll Back Theresa), opened S2-36404 | All, scrollLeft 35384, Theresa top card S2-36403 partly hidden (t143 vs body 254) | All, 35384, S2-36403 at 255 fully shown |
| Board, Status: Approved | same | filter kept, All, 35384, same top card |
| Tech, no filter (search 4 Star), opened S2-32988 | All, scrollLeft 120, scrollTop 600 (S2-33679 sliver under Unassigned header, S2-32993 first full row) | All, 120, scrollTop 576, S2-33679 fully shown at top, S2-32993 second |
| Tech, Status: Approved | same shape | filter kept, 120, 600→576 |
| Film run (fresh) | Board 35400 / Tech 120, 600 | Board 35400, S2-36403 fully shown; Tech 120, 576 |
| List, staging vs Production, All + Estimates | URL /workorders and ?tab=estimate, scrollTop 600 | same URL, scrollTop 0 — identical on both |

## Evidence
`ev/bk-*` (2x captures + json), `ev/list-back-*.json`, exhibits `ev/sv11421-01-board-back.png`, `ev/sv11421-02-tech-back.png`, `ev/sv11421-tech-top-rows-zoom.png`, film + `voiceover/`. Scripts: `../scripts/bk07b.mjs`, `bk07c.mjs`, `VR21b.mjs`, `ex_back.py`.

## Pre-post gate
Build marker v26.40.19-754919e; ticket TESTING STAGE, last comment Chris 2026-10-16 10:17; PRD v64; voice scan clean; no technical section; embeds with width+height; read back: PASSED panel, 7 table rows, 3 media.
