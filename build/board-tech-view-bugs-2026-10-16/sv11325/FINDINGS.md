# SV-11325 — Tech View: number link, progress bar and advisor avatar as in the design

**Verdict: PASSED, 6 of 6.** Jira comment **78919**, 16 Oct 2026 (exhibit + voiced film, no technical section).

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD page 845185030 | v64 (S2-R20 now pins #175CD3 and "no hours line"; S2-R23 pins avatar 20/24/32 and bar 48x4 at Compact) | start + posting | CURRENT |
| SV-11325 | TESTING STAGE, Slavcho Mitrov, only Chris Ward 14 Oct | posting | CURRENT, no other tester |
| Build | staging v26.40.19-754919e; production v26.40.19-d2441a9 for the List compare | start + posting | unchanged |

## Matrix (all observed; `data/c25-staging.json`, `ci25.json`, `fs25.json`, `c25-prod.json`)
| Cell | Compact | Regular | Comfortable |
|---|---|---|---|
| Number: `<a href=/workorders/{id}>`, colour rgb(23,92,211) | 59/59 | 59/59 | 59/59 |
| Progress track | 48x4 | 64x6 | 64x6 |
| % beside bar | 8 px, 59/59 | 8 px | 8 px |
| Hours line | 0 rows | 0 | 0 |
| Advisor avatar before name (8 px gap) | 20 px, 52/52 | 24 px | 32 px |
| Avatar colours | bg rgb(238,242,246), initials rgb(75,85,101) | same | same |
| No-advisor rows (7) | "Unassigned", no avatar | same | same |
Click on number → /workorders/097f416b…/lines (film). Clocked In: seeded by clocking Tech ShopView and Admin ShopView
into line 1 of S2-33043 (`ck25.mjs`); Tech View "Tech ShopView +1" = List "Tech ShopView +1", bold; size 14 px in
Tech View vs 13 px in List, which is each table's size for every cell (fs25.json), so the display is the List's.
Both clocked out (all buttons back to Start, verified twice). List cells: staging = production (plain black 400 number,
percentage pill, name only).

## Test data left on staging (shared env)
S2-33043 line 1: a Tech ShopView labor row was added by the clock-in, and four short time entries (two clock-ins ×
two passes) with story "ZZAUTOTEST clock check SV-11325". Clocked out; nothing left running.

## Film
`VR25.mjs`, anchored + `idle_cut_voiced.py`: 120.6 → 52.7 s. Check `voiceover/cut.check.png`.

Learning check: nothing new (tools from SV-11319..11321 held).
