# Part Lifecycle — design coverage proof, 8 Oct 2026 (Rules 115, 119, 120, 124)

**Design:** canvas artifact Vz6rprcWyP16tYxzM1kdeE "Parts Lifecycle Update" (read 8 Oct 2026 via the Artifact tool).
- Raw page: `sources/design-2026-10-08-artifact/artifact-raw.html`, 10,170,839 bytes, md5 e144a2ae….
- 53 embedded files: 46 board images, 5 Before boards, canvas.json and a favicon.
- Every file is listed with its md5 in `board-files-md5.txt`.
- The design is static board screenshots on a canvas, not a clickable prototype. The design's own notes say: "Boards 1.1 to 1.6 are screenshots of the build, on Staging Heavy Duty data".

## 1 · Every file read (Rule 119)
| File | Size | Read |
|---|---|---|
| 46 board PNGs | 6.9 MB | every image transcribed: `BOARDS-TRANSCRIPT-2026-10-08.md` (1,614 lines, "TOTAL: 46 of 46 boards read"); I spot-checked 4.9 and 6.5 against the images (match) |
| 5 Before boards (`*Before.dc.html`) | 65,002 B | all visible text, 100% |
| `canvas.json` | 29,959 B (980 lines) | 7 pages, 52 artboard entries, 59 notes, launch; 100% |
| favicon-32x32.png | 2,664 B | an icon, no content |

## 2 · Drive — the whole canvas, through its own navigation (Rule 120)
| Pass | Tool | Result |
|---|---|---|
| One-click sweep | `drive_design_full.py --serve` | 64 elements: 64 hovered, 64 clicked; 26 hover-exposed, 54 click-exposed; 0 failed, 0 missing |
| Canvas drive (run 2, final) | `drive_design_canvas.py` (new tool, built 8 Oct for canvas artifacts) | see the table below |
| Stateful prototype crawl | `crawl_design_states.py` | 0 actions — the canvas has no prototype state to crawl (boards are images); the canvas drive replaces it |

Canvas drive (run 2):

| Action | Result |
|---|---|
| Page menu | 7 pages; every one selected |
| Board titles | 51 boards seen, 51 hovered |
| Play | 51 of 51 played; never played: none |
| Play-mode controls ("7 pages", Fit, Read-only, Export, Back to canvas) | hovered 153 times |
| Export | 51 of 51 opened. The menu offers "PNG 1×", "PNG 2×", "PDF (.pdf)", "HTML (.zip)" and "All artboards (.pdf)"; no download until a format is picked |
| Notes | 59 recorded; all are `pointer-events: none` stickies, so there is nothing to hover or click |
| Zoom | opened once |
| Dark theme | captured once |
| Errors | 0 |

Run 1 (kept in `canvas-run1/`) found that Export opens a menu and that notes cannot be hovered; the driver was fixed and re-run in full.

**Never exercised, with reasons:**
- **Clicking Fit and Back to canvas inside a played board.** These are canvas chrome, identical on every board, and the driver leaves with Escape. They do not change the board content.
- **Picking an export format.** This produces a file of the same image already read.

## 3 · Gap proof (Rule 124 gate 4) — `design-gap-triage-2026-10-08.md`
- 565 distinct design strings. 157 appear in a case.
- The other 408 are classified:
  - DATA: 350
  - OUT-OF-SCOPE (existing screens the feature does not change): 49
  - COVERED via a placeholder template: 9
  - CASE-NEEDED: 0
  - unclassified: 0
- The design-vs-PRD conflicts are listed in FULL-UPDATE §Notes.

## 4 · Label check (gate 6) — `label-check.txt`
1,316 quoted labels in preconditions, setup and steps. 42 are not in the design, PRD, tech plan, stories or playbook. All 42 are example data, placeholders, bin-chip formats or "mark Blocked" texts. None is an invented control.
