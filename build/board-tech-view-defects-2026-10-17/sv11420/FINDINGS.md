# SV-11420 — QA result (17 October 2026)

- Verdict: **PASSED** — Jira comment 78926 (edited 03:13 CDT: film height fixed, dated note in the comment).
- Environment: staging app.staging.shopview.com, build v26.40.19-754919e (last-modified Fri 16 Oct 2026 20:22:02 GMT), location Staging Heavy Duty - 9919, Admin quick-login.
- Spec: Confluence 845185030 version 64 (S6-R4); ticket rulings by Chris Ward 2026-10-16 (PRD v60/v61).
- Test data: work order S2-16688 (M&J Truck Repair LLC, lead Brandi Smith, advisor Jason Garrison, 4+ assigned technicians).
- BEFORE: the ticket's own picture (Tech View is not on production, so no production before exists).

## Measurements (read from the page, `getBoundingClientRect` / computed font-size)
| Density | Group header avatar | Technician avatar | Service Advisor avatar | Number / customer | Percentage | Progress bar |
|---|---|---|---|---|---|---|
| Compact | 24 | 20 | 20 | 14px | 12px | 48 x 4 |
| Regular | 28 | 24 | 24 | 14px | 12px | 64 x 6 |
| Comfortable | 36 | 32 | 32 | 14px | 12px | 64 x 6 |

Board View card avatars: 24 px at Compact, Regular and Comfortable. Other row text cells (Waiting On Parts, Unit, Asset, VIN/Serial #, Total Price): 14px at all three (earlier probe d10a on S2-17495).

## Evidence
- `ev/` exhibit (2x, window 1920 x 900) and the voiced film (`voiceover/` holds script, clip lengths, anchors).
- Capture scripts: `../scripts/x97.mjs` (exhibit), `../scripts/VRdens.mjs 11420` (film); exhibit builder `../scripts/ex_density.py`.

## Pre-post gate
Build marker re-read v26.40.19-754919e; ticket TESTING STAGE, no new comments since Chris 2026-10-16 10:17; PRD still v64; text scanned for AI/tool words (none); no technical section; comment read back (first panel PASSED, table rows and media present). Film embed first stored 1280x183 (no height) — corrected in place to 1280x666 with a dated note; posting tool now refuses embeds without height.
