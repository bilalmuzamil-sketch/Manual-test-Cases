# Dashboard v1 — full rewrite brief (7 October 2026)

QA lead order (verbatim): *"Update Dashboard. Also make sure that you never do anything in DELTA mode, you fully drive
the design and create/edit the test cases as needed to make them runnable for the manual QA tester."*
So: every case in your share is reviewed and rewritten **in full** to the standard below, not only where the
sources changed. **You write proposals only. Never call TestRail write endpoints, never git commit.**

## Sources — read every one in full (Rule 119: nothing skipped)
| Source | Path |
|---|---|
| PRD **v42** (THE authority; quotes come only from here) | `build/dashboards/sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md` |
| Design canvas, all 50 boards' text + image captions, in canvas order | `build/dashboards/full-update-2026-10-07/design-drive/BOARDS-TEXT.md` |
| Design screenshots (open the `after-*.png` for your stories; `before-*` = old production, ignore for expectations) | `build/dashboards/sources/design-po-empty-states-2026-10-07/canvas/*.png` |
| Tech plan (informs, never overrules; read in full) | `build/dashboards/sources/Dashboard-v1-Technical-Implementation-Plan.md` |
| PO answers on the PRD (already folded into v42): Confluence comment thread summarised in v42 context notes | — |
| Your cases as they are live now (one JSON per case) | `build/dashboards/full-update-2026-10-07/snapshots-before/C<id>.json` |
| The locked case standard + worked example | `build/skills/IDEAL-TEST-CASE-STANDARD.md`; example `build/founder-mode/part-sales/snapshots-2026-10-05/C154586-after.json` |
| Rules 113, 114, 116, 117 (read in full) | `build/rules/RULES-61-96.md` lines 2391–2760 |

The old "ShopView Dashboard Directions" design is **retired** (PO inline comment: "Drop this, not faithfully
accurate"). The design is now the canvas above (PRD header links it). The canvas "after" boards are screenshots of
the real build (SV-8311, captured 2026-09-28) — use them for **on-screen labels and navigation only** (Rule 57).
Row 15 (empty tiles) is the approved design, not yet built.

## The standard every case must meet (Rules 113/114/116/117 + QA lead 2026-10-07 title rule)
1. **Title**: ≤ 80 characters, one check, no semicolons, the screen's own words, no specification shorthand
   (no "S3-E3", "parity", "denominator", "bucket", "measure", "n/a state", rule numbers).
2. **Preconditions**: what the tester sets up, as numbered single actions with the real click-path, every seeded
   value shown as an example *(e.g. $1,250.00)*. Sign-in, role/permission (Settings > Roles & Permissions, the
   **Reports** permission), the workplace selected in the top bar, and every record the case needs (customer, work
   order, lines with labor hours, technician clocked time, invoice, credit memo, reversed invoice …) with how to
   create it in the UI. Never "seed the exact records", never "the conditions in Sx", never an internal rule number,
   never "Dashboard feature on" (there is no such switch any more — access is the Reports permission only, S1-R6).
3. **Steps**: numbered, ONE UI action per line, product labels exactly as the build shows them ("View details",
   the range pill, "Hide Chart", "View Report" …). A step is an action ("Click View details on the Revenue card"),
   never "confirm X" — checks belong in Expected. Arithmetic the tester must do is written out with the numbers.
4. **Expected results** = runnable observations: what the tester SEES, one per bullet, with the arithmetic shown.
   Then **Source** (epic SV-490 + story Jira key, PRD Confluence 788430850 **v42**, section, read 7 Oct 2026; design
   canvas board/row where used). Then **Exact quotes** — the PRD sentence for each anchor **copied verbatim from the
   v42 file** (straight quotes in the file stay straight; do not tidy). Quotes pair with results; the quote wins.
   Where a requirement is a table row (S3-R2), quote the requirement sentence and the table row text exactly.
5. **Where something cannot be checked by hand** (server refusal, timing, APM latency, true concurrency): express it
   as something a human can do (second browser, a user without the permission), or say plainly in the plain result
   "this part cannot be checked by hand; write 'not checked by hand' in the result comment; pass or fail on what you
   can see". Never leave an instruction a manual tester cannot carry out.
6. **Design vs spec**: where the design's on-screen words differ from the PRD (e.g. "Hide Chart"/"Show Chart" vs the
   PRD's "Show chart"/"Hide chart"), the case follows the PRD and says "write down the words you see; do not pass or
   fail on the capitalisation"; list every such difference in `notes`. Design-only testable details the PRD does not
   state (e.g. legend hover readout, table columns, ten rows a page) may be ADDED, cited to the design board
   (Rule 115), never contradicting the PRD.
7. **AUTOMATION marker** (exactly one, last line of Expected): keep the case's current marker if its expected
   behaviour is unchanged; if the expectation changed to something not yet built (the grey "-", the empty-chart
   placeholder) use `AUTOMATION: HOLD - not yet built (approved design 7 Oct 2026)`; for new cases on S10-R5..S10-E1
   use `AUTOMATION: HOLD - not yet build-verified`. Keep the "Last checked against build v26.39.1-09be696 on
   10/2/2026" sentence only where the expectation is unchanged; drop it where it changed.
8. **Coverage**: every PRD v42 anchor in your share must be quoted by at least one case (yours). Report any anchor you
   could not place.

## Output — ONE JSON file (path given in your task), exactly this shape
```json
{"updates":[{"case_id":88603,"title":"...","preconds":["..."],"steps":["..."],"results":["..."],
  "source":"Epic SV-490; story SV-9575 (S3); Dashboard v1 PRD, Confluence 788430850 v42, read 7 Oct 2026, S3. ...",
  "quotes":[["S3-E3","<verbatim v42 text>"]],"marker":"AUTOMATION: ...","change_summary":"one line"}],
 "new":[{"key":"NEW-A1","section_id":12170,"title":"...", "preconds":[],"steps":[],"results":[],"source":"",
  "quotes":[],"marker":"","why":"which anchors it covers"}],
 "notes":["design-vs-spec differences, questions, anything you could not resolve"],
 "anchors_covered":{"S4-R12":["NEW-A1"]},
 "reading_coverage":"file — size — read 100%"}
```
Plain text only in every string (no HTML). Each list item is one line/bullet.
