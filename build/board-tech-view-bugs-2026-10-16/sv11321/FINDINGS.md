# SV-11321 — Tech View: column header labels 12px, weight 500, secondary color; no overlap

**Verdict: PASSED, 6 of 6.** Posted as Jira comment **78914** on 16 Oct 2026 (exhibit + voiced film, no technical
section). Row 3 updated in place at 17:39 CDT with a dated note (the 1920 px figure now covers all densities).

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD page 845185030 | v64 | start + posting | CURRENT (S2-R21 same wording as v51) |
| SV-11321 | TESTING STAGE, Slavcho Mitrov, 1 comment (Chris Ward 14 Oct) | posting | CURRENT, no other tester |
| Build | staging v26.40.19-754919e | start + posting | unchanged |
| Design | ticket attachment D1-design-tech_view-1440.png | — | label colour read from pixels: rgb(105, 117, 134) |

## Matrix — 30 cells, all observed (`data/h21d.json`)
2 column sets (default 13 / all 20) × 3 densities × 5 widths (1024, 1280, 1440, 1536, 1920):
every cell 12px / 500 / rgb(105, 117, 134) on every label, 0 labels on two lines.
Closest pair: default 32.6 px (Waiting On Parts / Number) at 1024–1536, 34.1–39.2 px at 1920; all columns 16 px (On Site / Status) everywhere.
Lead Technician / Clocked In: 16 px in the film's state; 73.7 px in an earlier measurement where column widths
were wider (widths follow the rows on screen) — never touching. Progress / Service Advisor: 79 px.

## Admin preference
techViewColumns snapshot `{"assignedTechs":true}` (`data/pref21-before.json`); all columns switched on via the column
menu (in the film) and via the same PUT the menu sends (`x21.mjs`, `h21d.mjs`); restored by PUT and read back equal each
time. Density back to Regular. `collapsedGroups` moved during the pass (4 groups opened) — not by these scripts; another
session uses the shared admin account.

## Film
`VR21.mjs`, anchored with the improved `anchor_mux.py` (largest change in a 4 s window) and cut with
`idle_cut_voiced.py`: 58.8 → 43.6 s. Sync check `voiceover/cut.check.png`.

## Pre-post gate + read-back
Build, ticket, PRD v64, fingerprint clean, files referenced. Read-back: PASSED panel, image 1024x439 + video, table 7
rows, steps 5. Post-read found rows 2/4 claimed "every width and density" while densities had only been measured at
1440 px — measured the full 30-cell matrix (all pass) and corrected row 3's 1920 px figure in place.

Learning check: `anchor_mux.py` picks the largest strip change in a 4 s window (fixes page-change and scroll
mis-anchors without `--fix`; re-validated on SV-11319/11320/11321); new `jira_edit_comment.py`; LESSONS row.
