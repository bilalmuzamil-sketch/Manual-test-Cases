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

## Observation for the QA lead (Rule 93 bucket d — UNVERIFIED, not in the ticket)
The "imported successfully" files (10 across two runs: ZZ11870-OK/SS/MI/CM/OF…) could NOT be found afterwards: top-bar search
(`/api/search`) 0 results; Work Orders list by status (all 7 statuses) with search ZZ11870 → 0; both customers named
"4 Star Truck Repair" (6a7b6afc… 162 orders, b3406baf… 54 orders) hold no such order; the customer's Work Orders count went
161 → 162 only because of the Karachi test order. The success response carries only `{"duplicatedInvoices":[]}` (no created
count), which may mean the import is queued in the background. Jira searched ("invoices import", "historical import") — no
matching ticket. Asked the QA lead whether he wants it looked into; not part of SV-11870's message fix.

## Posted
**79704** (green OVERALL QA STATUS: PASSED), 11-row table, 4 annotated exhibits (real Jira attachments via the Atlassian MCP).
Gate: build marker re-read unchanged; ticket re-read (newest comment 79676, TESTING STAGE); voice clean; no technical section.
