# SV-11407 — Tech View and Board View: Back brings the top row or card back fully shown

**Status: NOT POSTED — held for a QA-lead decision (Rule 97d).** Everything in the ticket's "How to check" passes on
Tech View, and on Board View except one detail in the Unassigned column (below). No film or comment yet.

- Staging `v26.40.19-754919e`, 17 Oct 2026, window 1440 x 900, zoom 100%, Tech user (quick-login `tech`); a few cells with admin.
- Source: PRD 845185030 v64 S1-R8 (quoted in the ticket); ticket "How to check" (3 bullets) is the pass bar (Chris Ward, 15 Oct).

## Matrix (bk07b.mjs / bk07c.mjs; data/*.json)
| Cell | Opened | Result |
|---|---|---|
| Tech View, top row cut 12 px (0.25) | lower row S2-32220 | S2-32993 back at top, fully shown (224 = held header bottom) |
| Tech View, cut 24 px (0.5) | lower row S2-33522 | same, fully shown |
| Tech View, cut 24 px | the cut row itself, mouse click on its visible number | same, fully shown |
| Tech View, cut 36 px (0.75) | lower row | same, fully shown |
| Tech View, cut 43 px (0.9) | lower row | same, fully shown |
| Tech View, cut 36 px | the cut row itself | not a user action: its number link is entirely under the held header (click landed on the header) |
| Tech View, row aligned (0) | cut row (admin) | same row, fully shown |
| Tech View, sideways 228 px + cut 24 px | lower row / cut row | scrollLeft 228 → 228 exact, row fully shown |
| Tech View, search "4 Star", Unassigned 137 | lower row | S2-32988 back at top, fully shown |
| Tech View: restored row never under the held header | all above | first row top = held header bottom (224) in every run |
| Board, 3 columns each scrolled separately, top card cut 62–89 px (0.5) | lower card / cut card (mouse) | each column's cut card back at top. ZA, ZB: top 2.1 px below column top, fully shown. **Unassigned: card top 1.9 px ABOVE the column top — top border hidden** |
| Board, cut 0.25 and 0.75 | lower card | same three results |
| Board, sideways 900 px + cut 0.5 | lower card | scrollLeft 900 → 900 exact; Unassigned card again 2 px above the column top |

**Unassigned 2 px:** seen in 5 of 5 Board runs, never in the other columns. Pixel proof (`ev/bv-after.png`, 2x): rows
410–411 = column top line in both columns; ZA card border at 416–417 (css 208); Unassigned shows no card border below the
line (its border is at css 204, under the column edge). On a fresh page (no scroll) the Unassigned card sits at 214 with
its border visible.

## Earlier false lead (recorded so it is not repeated)
Opening the cut row with Playwright's `click()` jumped 13 rows on Back (scrollTop 888 → 240). Cause: Playwright scrolls a
partly hidden link into view before clicking, so the page saved that new position. With a plain mouse click on the
visible part of the link the row comes back correctly. Not a product fault.

## Question for the QA lead (with steps)
On Board View, after Back, the Unassigned column's top card comes back with its top border 2 px under the column's top
edge (the other columns leave a 2 px gap). S1-R8 says "fully shown". Pass it as within the allowance ("may sit up to one
row or card from the exact pixel position"), or report it as a remaining issue?
Steps: Staging → Work Orders → Board View → scroll the Unassigned column until its top card is half hidden → click a
card lower in that column → press the browser Back button → look at the top of the Unassigned column: the card has no
top border line under the column's top edge; compare with the next column.

## State
Tech user `collapsedGroups` restored after every run (`restored: true`). Nothing else written.
