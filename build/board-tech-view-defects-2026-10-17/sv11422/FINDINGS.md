# SV-11422 — HELD for the QA lead (17 October 2026) — nothing posted

- Environment: staging v26.40.19-754919e, window 1440 x 900, zoom 100%.
- Spec v64 S11-R1 (Chris 2026-10-16: Tab never lands on the Unassigned header while a row is shown; all collapsed → first group header; header → out → in returns to a row; Board: last-focused card scrolled away → first card in view).

## What passes (observed)
| Case | Result | Data |
|---|---|---|
| First Tab from Search, rows in Unassigned (ZZAUTOTEST F3 Keyboard Reach) | row S2-37015, blue 2px ring | x22 first |
| Arrow up onto Unassigned header, Shift+Tab out, Tab in | back on row S2-37015 | x22 header/back |
| Every group collapsed | first group header (Unassigned) | x22 collapsed, d10d t2 |
| Unassigned collapsed (search "Truck") | first technician's first row S2-33465 | x22 unCollapsed |
| Last-focused row S2-16218 → out → in | S2-16218 | d10e |
| Board first Tab | first card S2-37015 (ring) | x22 board, d10e b0 |
| Board last-focused card scrolled away | first card in view S2-33377 | d10e |
| Search "M&J Truck Repair" (row on screen) ×2 | row S2-7962 | x22b |

## What is in question (observed, repeatable)
| Case | Result |
|---|---|
| Search S2-16688: Unassigned empty, the only row (under Brandi Smith) is below the visible part of the table (row y=1776, window 900) — 2 fresh loads | Tab lands on the **Unassigned group header** ("Unassigned 0 0 work orders"), not on S2-16688 |
| Same, after scrolling S2-16688's row onto the screen | Tab lands on S2-16688 |
| Board View, search S2-16688 (card in Brandi Smith's column far to the right, off screen) | Tab lands on the **Unassigned column header** |

S11-R1 verbatim: "…or the first technician's first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; …)". Whether an off-screen row counts as "shown" decides PASS vs FAIL. Asked the QA lead (with steps) in the chat report; no comment posted until he answers.

Steps for him: Staging → Work Orders → All → Search `S2-16688` → Tech View → click in the Search box → press Tab until the focus ring appears in the table → it is on the "Unassigned" header. Then scroll down to Brandi Smith's row S2-16688, click the Search box again, Tab → focus lands on the S2-16688 row.

Evidence: `ev/x22*`, `ev/d10d.json`, `ev/d10e.json`; scripts `../scripts/x22.mjs`, `x22b.mjs`.
