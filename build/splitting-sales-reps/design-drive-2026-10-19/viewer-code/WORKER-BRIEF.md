# Worker brief: read the design export's canvas viewer code in full (Rule 119), 22 Oct 2026

QA lead, 22 Oct 2026, on the 2.47 MB of canvas viewer code in the Splitting Sales Representatives design export that was scanned
by script on 19 Oct but not read line by line: "No you can read it now". Rule 119: every line is read; size is never a reason to sample.

You READ ONLY. No writes to TestRail, Jira, Slack, Google; no commits. Write only your own output files in this folder.

## The files (extracted from `build/splitting-sales-reps/sources/design-2026-10-19-upload/Splitting_Sales_Representatives.html`)

- `appifact-style.css` (485,008 bytes, md5 db443f41599d890a9fe6c39dfbc02a8f) = `<style id="appifact-style">`; formatted copy
  `appifact-style.pretty.css` (11,960 lines, same content, formatted by prettier only).
- `appifact-app.js` (1,988,017 bytes, md5 86b674de52f6eecbe5f8acab5f4238c8) = `<script id="appifact-app">`; formatted copy
  `appifact-app.pretty.js` (90,786 lines).
- Read the formatted copy, in chunks of at most 1,500 lines (Read with offset/limit), every line of your range, in order. Keep a
  running notes file (`READING-NOTES-<part>.md`) and append to it after every chunk (range read, what that code does in one line,
  anything found), so a restart loses nothing.
- Embedded fonts (`data:font/woff2;base64,...` / `data:font/woff;base64,...`): do not read base64 by eye. Decode each one by script
  (python: base64 → file; `fontTools` if present, otherwise read the font's name table by script) and record its family name, style
  and byte size. That counts as reading it.
- The long JSON line in the JS (a colour token map, ~26 KB): read it in full by script-splitting it into lines, then reading them.

## What to look for (and record with line numbers)

1. Any ShopView or feature content: any text a ShopView screen would show (labels, messages, names, "Sales Representative",
   "Unassigned", "Labor", "Parts", "Part Sales", "Sales Type", report names, decisions, sample names like Becky, Devon, Elliot),
   any URL or id that is not the canvas tool's own.
2. Anything that changes how the design's boards LOOK or BEHAVE when viewed in the canvas (Play view, hover, click handling,
   zoom/scale, image smoothing, fonts substituted, dark mode, colour filters applied to boards, text rendering of board titles and
   notes, how notes are clipped or truncated). A tester comparing a build with a board picture must know if the viewer alters it.
3. Anything that says what a board's title/note/link means (e.g. note formatting rules, hidden fields of canvas.json that the viewer
   reads but our 19 Oct reading of `canvas.json` might have ignored: list every canvas.json field name the code reads).
4. Anything else surprising. If nothing in a chunk matters, say so in one line for that range — never skip the range.

## Output

- `READING-NOTES-<part>.md` (running) and, at the end, `READING-RECORD-<part>.md`: coverage table (file, line ranges read, 100%),
  font table, findings (numbered, each with line numbers and a plain explanation, and whether it affects any of the 68 boards or the
  text inventory), and the list of canvas.json fields the code reads (part JS-A and JS-B).
- Final message: coverage, findings count, and each finding in one line.

## Parts

- CSS: `appifact-style.pretty.css` lines 1-11,960.
- JS-A: `appifact-app.pretty.js` lines 1-45,400.
- JS-B: `appifact-app.pretty.js` lines 45,401-90,786.
