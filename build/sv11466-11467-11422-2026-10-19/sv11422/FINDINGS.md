# SV-11422 re-test — 19 October 2026

**Build:** staging `v26.40.19-c850386` (index.html last-modified Mon 19 Oct 2026 11:32:40 GMT; etag `W/"bdf98214d965620c79d3af07302d531c"`). The marker was read at the start and end of every script and was the same each time.
**Spec:** PRD 845185030, **version 66**. S11-R1 has not changed since v62.
**Ticket state when read (live):** Ready for QA. Last comment is our 78953 (18 Oct). Nothing new from Slavcho or Chris.
**Account / window:** Admin, 1440 x 900, dpr 2.
**Location:** the account was on "ZZAUTOTEST C614715 Empty .." when the run started. Each script switched it to "Staging Heavy Duty - 9919" through the profile menu and switched it back afterwards (restore = true each run). The work-orders-list prefs were restored with a PUT (200).

## Matrix (S11-R1)

| # | Case | Result | Evidence |
|---|---|---|---|
| 1 | ZZAUTOTEST F3 Keyboard Reach, first Tab | Lands on row S2-37015, solid 2px blue ring. PASS | x22c A, x22 first |
| 2 | ArrowUp onto the Unassigned header, Shift+Tab, Tab | Lands back on S2-37015. PASS | x22c A_back, x22 back |
| 3 | Every group collapsed | Lands on the first group header (Unassigned). PASS | x22 collapsed |
| 4 | Unassigned collapsed (search "Truck") | Lands on S2-31594, the first technician's first row (S2-33465 was the first row on 18 Oct; the data has changed). PASS | x22 unCollapsed |
| 5 | Lamkin: S2-16218 focused, Tab out, Tab in | Lands back on S2-16218. PASS | d10e-c850386 |
| 6 | Board View, first Tab | Lands on the first card, S2-33692 (d10e) / S2-37015 (x22, x22c D). PASS | |
| 7 | Board View: last-focused card scrolled away | S2-33377 is half under the column header (top 154 < column top 214), so Tab lands on S2-34972, the first card fully in view. PASS | d10e bBack |
| 8 | **Was FAILED.** Search S2-16688, Tech View. Unassigned is empty and the row starts at y 1848/1920, off screen. 4 fresh loads (x22c ×2, z22 ×2). | Focus lands on the S2-16688 row (ring solid 2px blue), not on the Unassigned header. **Fixed.** | x22c B1/B2, z22 T1/T2 |
| 8b | Same search, row already scrolled on screen | Lands on S2-16688. PASS | x22c B3 |
| 9 | **Was FAILED.** Search S2-16688, Board View, card off screen to the right in Brandi Smith's column. 3 fresh loads. | Focus lands on the S2-16688 card. The board scrolls sideways and the card is fully visible at x 1149 with the ring, not on the Unassigned column header. **Fixed.** | x22c C, z22 B1/B2 |

## New observation (needs the QA lead's decision; Rule 97(d))

On case 8, the first Tab focuses S2-16688 and scrolls it to y 208–244. That puts it exactly under the sticky "Brandi Smith" group heading (`tech_view_sticky_group`). `elementFromPoint` at 4 points inside the row (x 400 at the top, middle and bottom; x 900 at the middle) returned the sticky heading every time, on both loads (z22p P1/P2). So the row and its focus ring cannot be seen. ArrowUp then ArrowDown moves the row to y 244–280, below the heading, and all 4 points then hit the row (P3).

Board View does not show this: the card is fully visible after Tab.

S11-R1 ends: "the focused row or card shows a visible focus ring."

Jira search (sticky / focus ring / hidden behind / covered + Tech/Board View): no ticket covers this. SV-11406 is about sticky headings but describes a different problem and is Done.

Exhibit: `exhibits/q-row-under-heading.png`.

## Re-check 20 Oct 2026 (fresh staging cookies), build v26.40.19-c850386 (unchanged since 19 Oct 11:32 GMT)
- SV-11422 live: Ready for QA; last comment Chris 79047 (19 Oct 14:17 CDT); nothing new from Slavcho.
- Tech View, search S2-16688, first Tab (walkB-1020.json): Compact row 208–244 under heading 208–244 (fully covered); Regular row 208–256, heading 208–252; Comfortable row 208–272, heading 208–264. Focus ring solid 2px blue on the row. Unchanged → the fix is not on staging.
- Board View (z22.json, 2 loads): S2-16688 card focused at x 1149–1411, fully on screen. Pass.
- Run 498 test 4054408: result **530263 Failed** (Tech step 5), 2 pictures attached (ev-1020 → exhibits/sv11422-1020-*.png). Run results 1516 → 1517, 0 missing, 0 changed.
- Density preference restored to Compact (it was Compact before the run).
- **Run 498 changed by another session overnight** (not this session; our shared account, about 03:38 UTC 20 Oct): 20 tests removed (lead-technician dialog cases; the cases themselves still exist) and 23 added (clear-shifts / lead cases 690650+). 116 results left the run with the removed tests. Reported to the QA lead and not reversed.
