# Notes — Internal Work Orders design drive (12 Nov 2026)

Worker pass for `WORKER-BRIEF.md`. No writes to TestRail, Jira, Slack or Google; nothing committed. Files written only in this
folder and `build/founder-mode/internal-work-orders/DESIGN-DIVERGENCE-REGISTER.json`. Written as the work goes.

## How the design was reached (Rule 121, no bot check touched)
- The canvas page sits behind a Cloudflare check for a headless browser; not touched. The saved package (`files/`) was rendered locally.
- `tools/serve.js` serves `files/project/` on 127.0.0.1:8765 and answers `./support.js` with `files/artifact-type/dc-runtime.js`. Why that file:
  the runtime carries React and ReactDOM itself (React production build at its top), boots `<x-dc>` on DOMContentLoaded, fetches each
  `<dc-import name=X>` as `./X.dc.html` (its own `ln = "."`), and its own guard message says the page loads "support.js or a copy of it". The
  saved frames in `../from-qa-lead-2026-11-12-final/design-saved-page-files/saved_resource(n).html` show the canvas injecting the same runtime
  (`_f/1794484794-2031/artifact-type/dc-runtime.js`) plus a file map; locally the same files come from disk.
- The package has no `fonts/` folder (the canvas serves it): `Inter_18pt-*.ttf` is answered with the system Inter of the same weight
  (`/usr/share/fonts/opentype/inter/`), logged in `render/server-404.log`. Inter is the design's own `--sv-font-ui`.
- Check against the QA lead's browser save: the text of saved frames (4) "18 Closed · INTERNAL document" and (10) "07 Invoice · the line at
  $0.00, Warranty" was extracted and matches the local rendering word for word (see DESIGN-READING-RECORD.md, "Own rendering checked").

## Version
- Canvas "Internal Work Orders · All flows v6", version 1794484794-2031 (stamp found twice in the saved `_t.html`; `canvas.json` created on files
  at 2026-11-03T13:50:56Z; every page description says "v6.1 · Nov 5, 2026"). PRD Final v1.0 of 9 Nov 2026 is newer and says in its header:
  "Where a frame and this text disagree, the text wins".

## Running findings (filled in as the drive goes; the register is the record)
- See `../DESIGN-DIVERGENCE-REGISTER.json` and the final counts at the end of this file.
