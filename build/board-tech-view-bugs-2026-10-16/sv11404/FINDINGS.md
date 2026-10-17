# SV-11404 — Work Orders Search: use the design system's magnifier icon in every view

**Verdict: PASSED, 5 of 5.** Jira comment **78921**, 16 Oct 2026 (CDT).

## Source currency
PRD v64 (S1-R9a) · ticket TESTING STAGE, Slavcho Mitrov, only Chris Ward 15 Oct · staging v26.40.19-754919e
unchanged; production v26.40.19-d2441a9 for the BEFORE and the List compare.

## Matrix (`data/s04-staging.json`, `s04-prod.json`, `tb04-*.json`)
| View | closed | open (typed "S2-33") |
|---|---|---|
| List | ds-search 20 px rgb(54,65,82) | ds-search 20 px |
| Tech View | ds-search 20 px | ds-search 20 px |
| Board View | ds-search 20 px | ds-search 20 px |
| Production List | Material "search" 24 px | Material 20 px |
SVG: `<circle cx=11 cy=11 r=7/><line x1=20 y1=20 x2=15.95 y2=15.95/>` (identical hash in all 6 cells); Lucide search =
circle r=8 + `m21 21-4.3-4.3`, so not Lucide. Design file crop (D1 Tech View design) shows the same lens + short handle.
List top bar vs production: only `page_search_toggle` icon and the 3 new switcher buttons differ; 9 other icons identical.

## Film
`VR04.mjs`, anchored + `idle_cut_voiced.py`: 45.9 → 31.6 s.
