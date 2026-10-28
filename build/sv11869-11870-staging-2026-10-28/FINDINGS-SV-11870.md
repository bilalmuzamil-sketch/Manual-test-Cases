# SV-11870 — Invoices import: empty *Line Title message (QA on staging, 28 Oct 2026)

Ticket: https://shopview.atlassian.net/browse/SV-11870 · TESTING STAGE · QA Assignee Bilal · no `accounting` label (checked).
Checklist: Nemanja's test plan (comment 79676) + PRD S4-R8 (Confluence 845348896 v16, quoted in the ticket description).
Staging build v26.43.2-f8698cb (last-modified Wed 28 Oct 2026 14:06:20 GMT) — unchanged at every read.
Mode: QA lead asleep at start → defaults: no screen recording, no technical section (Rules 104/84).

## Method
CSV per case built from the staging template header (old-column-name variant uses `*Line Title - What are you doing` /
`Line Description - Why are you doing it`), uploaded ON SCREEN: Settings → Imports → Invoices → Select CSV File → Import Invoices.
Customer 4 Star Truck Repair, location Staging Heavy Duty - 9919, unique invoice numbers ZZ11870-<case><HHMMSS>.
Scripts: `scripts/impmatrix.sh` (ONLY=<cases> runs a subset), `scripts/imp.mjs` (screens + element boxes), `scripts/exhibits11870.py`.
Full 12-case result log: `ev/import/results-all-12-cases.txt` (second full run, 28 Oct ~21:30 UTC); the first full run (~19:43 UTC) gave identical results.

## Results (page text + POST /api/imports/work-order-historical response)
| Case | Page | Verdict |
|---|---|---|
| Labor, title empty | Failed row 2 "Line Title cannot be empty." Created 0 / Failed 1 | PASS |
| Part, title empty | same | PASS |
| Shop Supplies / Misc / Credit Memo, no title | "All invoices have been imported successfully." | PASS |
| Labor, title filled | imported successfully | PASS |
| Old column names, empty / filled | new message / imported | PASS |
| Empty Invoice Date | "InvoiceDate and InvoiceNumber cannot be empty." | PASS (unchanged) |
| lowercase "shop supplies" | row 3 "Line Title cannot be empty." | as the plan's known difference |
| title "0" | "Line Title cannot be empty." | as the plan's known difference |
| Sublet, no title (extra) | refused, new message | matches S4-R8 (Sublet not a no-title item) |

## Production before
NOT captured: production needs a password and none was held after the container restart. The comment cites Nemanja's own
confirmation (79655) of the old message and says plainly that no production screenshot was taken. OUTSTANDING.

## Imported invoices — CORRECTED 2026-10-28 22:15 UTC (my earlier "could NOT be found" was wrong)
The earlier note said the successfully imported files could not be found. **Wrong:** imported invoices live under
**Work Orders → `All` tab → `Status` filter → `Imported`** (`/workorders?status=imported`), which I did not check. Re-checked live
on staging (build v26.43.2-f8698cb): all 9 ZZ11870 imports are listed — OF194324, OK213053, OF213053, SS213053, MI213053,
OK194324, SS194324, MI194324, SS214505 (`ev/workorders-status-imported.png`, `scripts/imported.mjs`). Not a defect; the
question to the QA lead is withdrawn. Root cause + fix: Standing Rule 117, playbook §AW, `build/testing-tools/recall.sh`.

## Production before — captured 2026-10-28 22:05 UTC
Production `app.shopview.com`, build **v26.43.2-537378f** (last-modified Tue 27 Oct 09:11:44 GMT), location Trucks Hill 2,
customer Alpha Freight, password login. Same CSV shape as case 7 (old column names, Labor, *Line Title empty):
`200 … {"errors":[{"rowNumber":2,"message":"Line name cannot be empty."}],"invoicesCreated":0,"invoicesFailed":1}` — the old
message, on screen in Failed Rows (`ev/import/prod-old-header-empty-2-after-import.png`). The NEW-header file is refused on
production with "Invalid file headers provided!" (expected: the rename has not shipped there). Exhibit
`ev/SV-11870-00-before-after.png` (`scripts/beforeafter11870.py`) added to comment 79704 with a dated note (17:09 CDT);
the paragraph saying no production screenshot was taken was removed. Read back from Jira: 5 media, before/after first.

## Posted
**79704** (green OVERALL QA STATUS: PASSED), 11-row table, 4 annotated exhibits (real Jira attachments via the Atlassian MCP).
Gate: build marker re-read unchanged; ticket re-read (newest comment 79676, TESTING STAGE); voice clean; no technical section.
