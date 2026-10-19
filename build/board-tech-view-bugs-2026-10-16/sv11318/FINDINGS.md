# SV-11318 — Tech View status pill size follows density — staging, 16 Oct 2026
Build v26.40.19-754919e, PRD v64 (S6-R2a, S2-R19 unchanged since v62).
| # | Check | Observed |
|---|---|---|
| 1-3 | Pill height Compact/Regular/Comfortable | 16 / 16 / 22 px (12 pills, search S2-363 under Unassigned; and S2-33351) |
| 4 | Counts + tooltips vs List | S2-33351 red 2 "2 Lines in Auth Req'd", blue 3 "3 Parts Ready to Order" — identical in List and Tech View |
| 5 | Width = List's | 113.98 px both (S2-363 page, S2-33351) |
| 6 | List pill unchanged | 21.02 px tall, widths = production (see SV-11310) |
Observation → QA lead (16 Oct): at Compact the 19 px bubbles cover most of the status text; Regular/Comfortable/List only touch the top. Ruling: "Pass it but create a separate story defect for the issue you found and link that to this ticket" → **SV-11467** (Story Defect, parent SV-10049 Density, Medium, label board-tech-view, Relates SV-11318; image 62484; read back OK; deep link ?search=S2-33351 verified to prefill search).
Admin's Unassigned group was opened for measuring and closed again; density back to Regular; Collapse all restored ("Expand all" state).
Comment **78911** (62485 exhibit, 62486 recording 45.9 s). Gate: build unchanged, PRD v64, only Chris's comments.

## 2026-10-18 edit
- Paid-only page: Tech View 44.5 px vs List 58.5 px (List's Status column has a minimum width). QA lead ruled "Not a fault": verdict stays PASSED.
- Comment 78911 edited in place 18 Oct 21:53 CDT: film embed given height=800 (it showed squashed), dated note added; read back: media (887x764), (1280x800), first block still PASSED.
