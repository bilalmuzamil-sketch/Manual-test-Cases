# SV-11395 — QA result (17 October 2026)

- Verdict: **PASSED** — Jira comment 78927.
- Environment: staging, build v26.40.19-754919e, location Staging Heavy Duty - 9919, Admin quick-login; window 1440 x 900, zoom 100%.
- Spec: Confluence 845185030 v64, S2-R23 (Chris Ward rulings on this ticket, 2026-10-16: bubble above on row/card avatars incl. +N; header avatars keep the plain browser tip).
- Test data: S2-16688 (lead Brandi Smith, 4+ assigned techs: BS, DH, JO, EM, +4 = Karen Peck, Douglas Fields, Brent Avila, Dylan Rush).

## Matrix (real mouse hover; bubble bottom vs avatar top)
| View | Density | Technician avatar | +N | Header avatar |
|---|---|---|---|---|
| Tech View | Compact / Regular / Comfortable | above (d10c) | above (+4, ~6 px) | plain browser tip (title "Brandi Smith"), no bubble |
| Board View | Compact / Regular / Comfortable | above (d10c, x95b) | above (+3/+2/+4 cards, x95b) | plain browser tip, no bubble |

Gap bubble→avatar: 5.64 px in every captured case.

## For the QA lead (not in the comment, asked separately)
- The **Service Advisor** avatar in a Tech View row shows no name bubble and no tip at all on hover (d10c: tip null, title null, aria null) at every density. S2-R23 only covers technician avatars; the advisor's name is printed beside it. Question raised in the chat report.

## Evidence
`ev/x95-*.png` + `x95.json` (2x captures), `ev/d10c.json`, `ev/d10k.json`, exhibit `ev/sv11395-01-bubble-above.png`, film + `voiceover/`. Scripts `../scripts/x95.mjs`, `x95b.mjs`, `VR95.mjs`, `ex_bubble.py`.

## Pre-post gate
Build marker v26.40.19-754919e re-read; ticket TESTING STAGE, last comment Chris 2026-10-16 10:17; PRD v64; voice scan clean; no technical section; embeds carry width+height; read back: first panel PASSED, 7 table rows, 2 media (1024x767, 1280x800).
