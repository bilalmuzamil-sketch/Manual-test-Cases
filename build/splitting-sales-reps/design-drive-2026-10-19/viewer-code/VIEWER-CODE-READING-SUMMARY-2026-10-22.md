# Canvas viewer code — read in full (22 Oct 2026, Rule 119)

QA lead, 22 Oct 2026: "No you can read it now" (the 2.47 MB of canvas viewer code skipped by line-by-line reading on 19 Oct).

| Part | File | Lines read | Record |
|---|---|---|---|
| CSS | `appifact-style.pretty.css` (from 485,008 B, md5 db443f41…) | 1-11,960 (100%); 4 embedded icon fonts decoded by script | `READING-RECORD-CSS.md` |
| JS-A | `appifact-app.pretty.js` (from 1,988,017 B, md5 86b674de…) | 1-45,400 (100%); colour-token line 12761 split by script and read | `READING-RECORD-JS-A.md` |
| JS-B | same | 45,401-90,786 (100%); icon font at 53546 decoded by script | `READING-RECORD-JS-B.md` |

## Result
- No ShopView or feature content anywhere in the viewer code (all three parts).
- canvas.json: the viewer reads artboards (file, x, y, w, h, title, page, expand, print, is_interactive), notes (id, x, y, w, text,
  size, kind, bold, italic, color, page), pages, launch. Our file uses only fields we read on 19 Oct; every value is within the
  viewer's limits, so nothing is cut or dropped. Board titles in the text inventory: 68 of 68 (checked by script 22 Oct).
- What the viewer changes ON SCREEN only (none of it is design content): titles cut with "…" at low zoom (about 61 of 68 at the
  opening zoom, 1440 px); pages open zoomed to fit (5-32%); only 10 boards live at once, others hatched "Click to load"; Play "Fill"
  reflows a board; edit mode switches off animations; boards run in a sandbox where links/new tabs do nothing; viewer screenshots
  are low-quality JPEG; an unresolved {{value}} shows a grey box and a script error a red banner.
- Effect on our cases: none. Every SSR design case compares the build with the ORIGINAL board pictures attached to the case at
  100% (the PNG inside each board file, not a viewer screenshot), and titles/notes were taken from the files, not the screen.
- Useful for every future Claude design drive (facts, not a rule): read titles and notes from canvas.json, never from the canvas;
  judge a board's look at Play "Fit" or from its own image, never at "Fill" or from a viewer screenshot.
