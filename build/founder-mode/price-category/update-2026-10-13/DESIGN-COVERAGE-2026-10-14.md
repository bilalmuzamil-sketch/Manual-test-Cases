# Price/Category — design coverage proof, 13–14 Oct 2026 (Rules 115, 119, 120, 124 as amended 9 Oct)

**Design:** canvas artifact https://claude.ai/artifact/UMNdojKWhYhRyJrjdgZa4P "Settings Pricing And Categories Sorting", read
13 Oct 2026 with the Artifact tool and unpacked with `build/testing-tools/extract_artifact_canvas.py` into
`sources/design-2026-10-13-artifact/`. **Re-read 14 Oct: all 6 files byte-identical (md5)**, so the 13 Oct drive stands for
the 14 Oct design. No design comments. Every category, matrix and part number on the boards is real data from a production
shop ("Automotive - 4700"); none is used as an example in any case (every case makes its own ZZAUTOTEST data).

## 1 · Every file read (Rule 119)
| File | Read |
|---|---|
| Main, CategoriesBefore, FixedRules, Matrices, Behaviour (`*.dc.html`) | every line of visible text and structure; inline CSS as styling only — 100% |
| canvas.json | 1 page, 5 artboards, 3 notes — 100% |
The boards are HTML text, not images, so no transcription was needed.

## 2 · One-click sweep (`drive_design_full.py`, `design-drive-2026-10-13/sweep/`)
45 elements found · 45 hovered · 45 clicked · 20 hover-exposed · 41 click-exposed · 0 failed.

## 3 · Canvas drive (`drive_design_canvas.py`, `design-drive-2026-10-13/canvas-run3/`)
1 page · 5 of 5 boards seen, played and export menu opened · 3 notes recorded · zoom · 0 errors. (Earlier runs found 0
boards on this single, unnumbered page; the shared driver was fixed and re-run in full.)

## 4 · Text inventory (gate)
- 13 Oct: `design-inventory/DESIGN-TEXT-TRIAGE-2026-10-13.md` — 65 distinct texts; 14 in a case; 51 classified
  (DESIGN NOTE 17 · COVERED 24 · DATA 7 · OUT-OF-SCOPE 3). **Unclassified 0 · CASE-NEEDED 0.**
- 14 Oct, re-run against the cases brought to PRD v21: `design-inventory/design-text-inventory-2026-10-14-v21.md` —
  65 texts, 14 in a case, **none lost, none gained**; the 51 classifications stand.

## 5 · Flows
A static canvas of text boards: no prototype state, drag or in-board menu. Every board was played. Flows not driven: none.

## 6 · Design against PRD v21
The design shows no Fixed price sort direction, so it does not conflict with v21's "highest price first". Remaining
design-vs-PRD differences (in `proposals-A.json` notes): "Part" vs "Parts"; board 2.1 shows the first QuickBooks click
descending; label capitals; "$1.4" price formatting. Cases follow the PRD.
