# SV-11430 — QA result (17 October 2026)

- Verdict: **PASSED** — Jira comment 78931 (edited 04:22 CDT with a dated note: both column counts shown).
- Environment: staging v26.40.19-754919e. Headless Chromium launched with scrollbars shown (`SHOW_SB=1` → `ignoreDefaultArgs:['--hide-scrollbars']`), window 1440 x 900.
- Spec v64 S1-R9c + the design's dark Board View (ticket picture lower half). No dev comment on the ticket.

## Results
| Check | Data |
|---|---|
| Dark: `.board-column__body` scrollbar-width thin, scrollbar-color `rgb(75, 85, 101) rgba(0, 0, 0, 0)` | t30a, t30b |
| Dark pixels (scrollbar strip of Unassigned, AB, AZ columns): only rgb(32,41,57) panel + rgb(75,85,101) thumb | t30b/t30-dark.png |
| Dark after reload, all columns: 281 columns, one style (t30c); 295 columns, one style (film) | t30c, VR30 |
| Light unchanged: scrollbar-color auto, thin; pixels rgb(252,252,252) track + rgb(139,139,139) thumb | t30b |
CSS source: `.board-column__body[data-v-c35ed5f7] { scrollbar-width: thin }` and a dark rule `scrollbar-color: var(--sv-border-strong) transparent`.

## Evidence / gate
`ev/t30*`, exhibit `ev/sv11430-01-dark-scrollbars.png`, film + `voiceover/` (anchors pinned with `--fix`: theme switches were taken for captions). Gate: build marker re-read, ticket TESTING STAGE with no comments, PRD v64, voice scan clean, no technical section, read back 5 table rows + 2 media.
