# SV-11904 — Part Sale Fees & Discounts column: full fee name on hover, heading on one line (IN PROGRESS)

Ticket: https://shopview.atlassian.net/browse/SV-11904 · QA branch https://sv11904.qa.shopview.com · build v26.43.5-2999cf9
(index.html last-modified Mon 02 Nov 2026 16:52:15 GMT). Production before: build v26.43.5-77de68c, part sale P-85 (Trucks Hill 2).
QA lead settings: API mode · no recording · no technical section · phone check judged against Chris's ask (79907).
Sources: description (ours), Chris 79907 (rules), Dipesh 79976/79977 (handoff + test plan), handoff file (/tmp only, summarised here).

## Test data (branch, left in place)
- P2-162: row 1 Ignition Switch "Such a Long name testing" 5% (dev's) + "Disc" −2% (ours → +1 badge); row 2 Freight
  "ZZAUTOTEST Part Discount with a long name" −2%; row 3 Engine Oil Filter "ZZAUTOTEST Flat fee with a long name" +$5.00;
  row 8 "Fee" 3% (dev's). All added on screen (row ⋮ → Add Part Fee / Discount), 201 + "Fee added".
- P-248 (new, 684124d6…): two ZZAUTOTEST parts, no fees → then "ZZAUTOTEST Part Fee with a long name" 5% on row 1.

## Results so far (branch)
| Check | 1440 | 1024 | 768 | 1440 dark | phone 375/390 touch |
|---|---|---|---|---|---|
| cut name → full name on hover (3 cut names: fee %, discount %, fee flat) | PASS | PASS | PASS | PASS | tap: tooltip + viewer |
| name that fits ("Fee") → no tooltip | PASS | PASS | PASS | PASS | — |
| rate / +1 / +$5.00 → no tooltip, still visible | PASS | PASS | PASS | PASS | — |
| tooltip gone after moving away | PASS | PASS | PASS | PASS | — |
| heading one line, all headings 39 px | PASS | PASS | PASS | PASS | PASS (375) |
| cells line up with heading (x/w equal) | PASS | PASS | PASS | PASS | — |
| pinned Actions stays while scrolling | PASS | PASS | PASS | PASS | — |
| heading row 39 px without column → 39 px with (P-248) | PASS | | | | |
| Description / Sell Price widths unchanged when column appears (P-248) | PASS | | | | |
| click name → viewer with full names; close leaves nothing | PASS | | | | |
| hover then click without moving → tooltip gone at 0.4 s and 2 s | PASS | | | | |
| phone: tap shows full name (Chris 79907) | | | | | PASS (tooltip + viewer list) |
| phone: tooltip stays OVER the open viewer (handoff expects it not to) | | | | | stays ≥6 s, clears on next tap — ASK QA LEAD |

Notes:
- Cell shows names in Title Case (CSS); tooltip + viewer show the name as typed. Bucket (c): styling, full name readable.
- 768 first run hovered empty space (table below the fold) — my script, fixed by scrolling each cell into view (Rule 79c).
- Phone: two tap methods (touchscreen.tap, locator.tap) at 390×844 agree; Chrome device emulation with touch, not a real phone.

## Production before (build v26.43.5-77de68c, P-85 at Trucks Hill 2, 1440)
- Added on screen: "ZZAUTOTEST Part Fee with a long name" 5% + "Disc" −2% on row 1 (201 + toasts). Test data left.
- Heading "Fees & Discounts" on 2 lines, heading row 49 px; name cut to 41 px; hover on name / 5% / +1 → nothing.
- Gotcha: production screen location was Truck Hill 1 → part sale page bounced to the list. Fixed by switching the
  on-screen location first (scripts/loc.mjs).

## Work order Parts tab (Chris: "stays as it is")
- Branch S2-4219 vs production S2-1788 (different orders, no shared record): same 13 headings in the same order, no
  Fees & Discounts column on either, heading row 47 px on both; fixed widths equal (Part Number 94, Quantity 70, Cost/Core/
  Sell Price 82, Margin 86, Category 224, Requested At 98). Description/Vendor/Status/Actions widths follow each order's data.

## Exhibits (ev/)
before-after-1440.png · every-kind-of-name-1440.png · other-widths-and-dark.png · viewer-full-names.png ·
phone-tooltip-over-viewer.png (for the open question).

## Still to do
- Pre-post gate + comment, after the QA lead answers the phone-tooltip question (asked 3 Nov).
