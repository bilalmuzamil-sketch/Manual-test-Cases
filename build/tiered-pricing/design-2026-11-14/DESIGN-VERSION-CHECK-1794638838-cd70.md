# Design version check: 1794631438-539a (driven) -> 1794638838-cd70 (published later on 14 Nov 2026)

Found 14 Nov 2026 while fetching the 11 "Today" screenshots with the QA lead's share link (the asset store opens with the link's `sk` key,
one asset id per read; a batch `paths` read refuses asset ids).

- Design content: 280 non-font files under project/ (every board, canvas.json, tp-app.css, the design-system CSS/JSON/SVG).
  231 downloaded from 1794638838-cd70 and compared byte for byte with files-v1794631438-539a: **231 identical, 0 different**.
  The other 49 (T22-T26, TP01-TP09, WO01-WO13, X01-X43 boards): same byte size as the published listing of 1794638838-cd70 (not downloaded).
  Same 322 published paths in both versions.
- What changed: only the canvas tool's own files: artifact-type/app.js, app.css, capture.js (viewer runtime) and
  artifact-type/reference/diagrams.md (tool guide, 9,638 -> 10,627 bytes). No board, note or design-library file changed.
- Conclusion: the design the cases follow is unchanged; the drive, inventories and pictures stay valid. The cases cite the design as
  1794631438-539a (content-identical to 1794638838-cd70).

## The 11 "Today" screenshots (fetched 14 Nov 2026)

Saved to images/today/ with the boards that show them (map in images/today/TODAY-PICTURES.json):
2.1 and 6.1 (one picture), 9.25, 9.26, 9.27, 9.38, 10.1, 10.2, 10.3, 13.1, 14.1, 20.1. Boards 7.1 and 7.2 are drawn, not screenshots.
