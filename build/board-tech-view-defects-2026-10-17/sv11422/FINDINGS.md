# SV-11422 — POSTED PARTIALLY PASSED 19 October 2026 (78952 + remaining issue 78953)

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

## 2026-10-19 — decided and posted
- QA lead (19 Oct): handle it per Chris's ruling, which wins only if it matches the PRD (Standing Rule 109). Chris 78872 ("never the Unassigned header while a row is shown") and 78893 are written into S11-R1 v64 — they match.
- "Shown": S2-R12 uses "currently shown … so the count always matches the rows listed" (= listed), and S11-R1 says "in view" when it means on screen. S2-16688 is listed → shown → Tab must land on it.
- Re-run on v26.40.19-31ad1e1 (ev/x22c.json, ev/d10e-31ad1e1.json): rows-in-Unassigned first Tab S2-37015 PASS; header→out→in back to row PASS; all collapsed → first header PASS; last-focused row S2-16218 PASS; Board first card PASS; Board scrolled-away → S2-33099 first card fully in view PASS (S2-35104 above it half cut off); search S2-16688 Tech (2 loads) → Unassigned header FAIL; scrolled on screen → S2-16688 PASS; Board same search → Unassigned column header FAIL (card in Brandi Smith's column).
- Exhibits ev/sv11422-01-first-tab.png (scripts/ex_tab.py), ev/sv11422-02-off-screen-row.png; film 132 s → 53.8 s, idle removed 78.4 s, offsets 0.5/15.31/28.45/44.31, frame grid checked (column-name caption fixed after a first take showed initials "BS").
- Gate: build v26.40.19-31ad1e1, PRD v64, ticket TESTING STAGE, last comment Chris 78893; read back: warning panel PARTIALLY PASSED, 1024x704 + 1280x800, 9 table rows; remaining 512x704.
