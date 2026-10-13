# What/Why — design coverage proof, 13 Oct 2026 (Rules 115, 119, 120, 124 as amended 9 Oct)

**Design:** canvas artifact Pz1Q6BfvreYFpQwVQZPTE6 "What Are You Doing / Why Are You Doing It?", read 13 Oct 2026 with the
Artifact tool and unpacked with `build/testing-tools/extract_artifact_canvas.py` into
`sources/design-2026-10-13-artifact/` (raw page, browser-ready page, 8 files with md5). No earlier copy was kept on 30 Sep,
so there is no file-by-file change list; the whole design was read and driven now. No design comments.

## 1 · Every file read (Rule 119)
| File | Size | Read |
|---|---|---|
| DialogBefore, Main (New Line before/after), EditBefore, EditAfter (Edit Line before/after), QuickBooks, EdgeCases, Truncation (`*.dc.html`) | 45,109 B | every line of visible text and structure read; inline CSS read as styling only — 100% |
| canvas.json | 3,053 B | 2 pages ("Before and after", "Extreme cases"), 7 artboards, 4 notes, launch — 100% |
The boards are HTML text, not images, so no transcription was needed. There are no boards for Story 2 (ShopCoach) or Story 4 (imports); their labels come from Jira and the tech plan.

## 2 · One-click sweep (`drive_design_full.py --serve`)
44 elements found · 44 hovered · 44 clicked · 20 hover-exposed · 39 click-exposed · 0 failed · 0 missing.

## 3 · Canvas drive (`drive_design_canvas.py`, `design-drive-2026-10-13/canvas-run2/`)
2 pages selected · 7 of 7 boards seen, hovered, played (never played: none) and exported (never exported: none) · 21
play-mode control hovers · 4 notes · zoom · dark theme · 0 errors. (The first run found 0 boards: the driver only accepted
numbered page names. Fixed in the shared tool and re-run in full.)

## 4 · Text inventory (gate) — `design-inventory/DESIGN-TEXT-TRIAGE-2026-10-13.md`
112 distinct texts in the 8 files; 28 already in a case; the other 84 classified: DESIGN NOTE 57 · DATA 11 · COVERED 11 ·
OUT-OF-SCOPE 4 · SPEC-CONFLICT (minor) 1 ("Title *" on New Line vs PRD "Title"; the SV-10130 developer says no asterisk
ships). **Unclassified 0 · CASE-NEEDED 0.**

## 5 · Flows
A static canvas of text boards: no prototype state, drag or in-board menu. Every board on both pages was played in order.
Flows not driven: none.

## 6 · Label check — `label-check.txt`
82 quoted labels in preconditions, steps and setup Part 1; 6 not in a source, all example data (line titles, descriptions,
a test string). No invented control.
