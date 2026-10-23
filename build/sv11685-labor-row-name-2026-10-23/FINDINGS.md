# SV-11685 — Modern estimate and invoice: stop repeating the line name on the Labor row (23 Oct 2026)

Mode: **API** (QA lead: "Test this using your Quickest method"). No recording, no technical section.
Branch `sv11685` build **v26.43.0-aa5be60** (index.html last-modified Thu 22 Oct 2026 18:53:29 GMT, etag `81600780b96f981c7cb53c7afd2e41f6`), read at start and again at each session.
Production before: `app.shopview.com` build v26.43.0-ffea43c. Production's org layout is **Legacy**; it was switched to Modern only
for each capture and put back to Legacy every time (read back as `legacy` after every run, last at the end of the pass).

Ticket source: description (What/Why/Scope 1–5/How to check) + one comment (Milomir: QA env link). No developer handoff.

## Test data
- Branch: work order **S11685-17580** (`f94beef2-…`), customer Andrews' Truck & Trailer Repair LLC / William Parker. Lines:
  01 Service - Transmission service (Automatic) (2 h labor) · 02 Service - Cabin air filter (0.3 h) · 03 Service - Remove wheels for
  annual inspection (fixed price $150) · 04 Service - Wheels off single axle medium duty (fixed line total $100) · declined:
  Replace - Suspension air bag. Invoiced as **INV a4c6bc89-…**. Plus existing invoices S2-4219, S2-16012 and 40 other work orders.
- Production: work order **S2-1760** (`a5435594-…`), same five-line shape (2 labor lines, fixed price, fixed line total, declined), invoiced.
- Left in place (test data, no clean-up per standing ruling).

## Variant matrix (every cell observed)
| # | Check | Result |
|---|---|---|
| 1 | Modern estimate, branch: Labor row text | blank on 4/4 lines (HTML + PDF) |
| 2 | Same, production (before) | line name repeated on 4/4 lines |
| 3 | Modern invoice, branch / production | blank 4/4 / repeated 4/4 |
| 4 | Line name count in branch Modern PDFs | 1 per line (5/5) in estimate (4 settings) and invoice; production 2+ |
| 5 | Hours/rate/amount, settings: defaults · all on · all off · labor summarised (estimate) + all on / all off (invoice) | same cells filled as production in every setting; only the text cell differs |
| 6 | Permission: Technician (no See Financial Data), matched settings | branch: hours shown, rate/amount hidden, text blank; production Technician (impersonated, same location): hours shown, rate/amount hidden, name repeated |
| 7 | Declined line (estimate + invoice, include declined) | "Declined Work" with title only, no Labor row — same on production |
| 8 | Title, "why", scope of work, parts rows, line total, footers | present and unchanged (structure diff prod vs branch: differences only from data and summarize settings) |
| 9 | Totals | Modern summary = Legacy summary on every variant, both envs (Labor $594.89, Shop supplies $62.46, Subtotal $657.35, GST $32.87, Total $690.22 on branch) |
| 10 | Legacy unchanged | branch Legacy still prints name + why in the Labor row, once — same as production Legacy |
| 11 | On-screen preview (Finance tab) | branch 4/4 Labor rows blank; production 4/4 repeated |
| 12 | Print | Print button fetches the same invoice PDF (`historyEvent=109`) and opens it → covered by the PDF checks |
| 13 | Existing documents | 84 branch Modern documents, 481 lines, 403 Labor rows: 0 with text |
| 14 | Fee/discount rows (↳) under a line | **NOT RUN — blocked**, see below |
| 15 | Email attachment | **NOT RUN — needs the QA lead's yes** to send to his plus-address inbox (playbook rule) |

## Blocked: line fee/discount rows (↳)
`POST /api/work-orders/adjustments/add` → 409 "Connect a QuickBooks item for fees before adding a fee." (same for discounts).
Branch has QuickBooks advanced mode on, `products-and-services` → 400 "Bookkeeping is not configured" (no QuickBooks company, so no
item can be mapped), and switching the org's QuickBooks feature off → 403 "Access denied." (needs an admin-portal sign-in since
21 Oct). 0 of 800 branch work orders carry any fee or discount. Needs the developer to add a line fee/discount on S11685-17580 or
turn the QuickBooks feature off for the branch org.

## Observation for the QA lead (not a fault in the ticket's terms)
When labor hours, rate and amount are all hidden (settings all off, or a Technician whose pricing is hidden with hours off), the
"Labor" heading now sits over a completely empty row. The ticket asks for exactly this ("only the description text goes, so the
cell is blank"). Asked whether to raise it.

## Production restore
Org layout switched Modern→Legacy after every capture; one script crashed after switching to Modern and one used flawed restore
logic — both caught and restored immediately; final read-back `legacy`. Per-WO document settings restored and read back identical
on both environments. Branch org layout left on Modern (its original).

## Evidence
`ev/SV-11685_1-before-after-labor-row.png` (matched settings). Readings in `data/`, scripts in `scripts/`.

## Gate / learning check
Not posted yet — waiting on the QA lead (email yes, fee/discount route, empty-row question).
Learning: the production layout switch must be restored in a `finally`, and a second session on production must reuse the same
bridge dir (`/tmp/qa21`); `switch-user` on production needs a Technician at the work order's own location.
