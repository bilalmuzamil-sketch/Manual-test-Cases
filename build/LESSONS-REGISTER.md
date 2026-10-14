# Lessons register — read before starting any new suite, design drive or currency check

One row per incident. Each row: what went wrong, the root cause in one line, what to do differently, and where the full record is.
This file holds FACTS and LESSONS only. Rule and skill changes are made only after the QA lead says yes (Rule 72); the row says
whether they were approved.

| # | Date | Feature | What went wrong | Root cause (one line) | Do this every time now | Full record | Rule/skill change |
|---|---|---|---|---|---|---|---|
| L-01 | 14 Oct 2026 | WO Board & Tech View | PO filed 10 design defects (SV-11317–SV-11326); 0 would have been caught by our cases, and 2 of ours (C96927, C96979) expected the wrong behaviour | We covered the design's WORDS, never its LOOK (icons, grips, sizes, spacing, panels, cell styles, tooltip position, default columns); the text inventory cannot see looks; design-library rules filed OUT-OF-SCOPE; a drafted PO question never sent; a List-only ruling stretched to other views | (1) one "looks as in the design" case per screen and state, compared with the design screenshot; (2) a visual inventory beside the text inventory; (3) library always/never rules are in scope; (4) every divergence question sent the same day, unsent count = 0; (5) never stretch a ruling past what it names | `build/wo-board-tech-view/po-defects-2026-10-14/INCIDENT-REVIEW-2026-10-14.md` | APPROVED 14 Oct 2026 ("Yes, do everything scientific and correct…"): Rule 126; skills 21 §4b/§6b, 15 §00, 01; CLAUDE.md §1 |
