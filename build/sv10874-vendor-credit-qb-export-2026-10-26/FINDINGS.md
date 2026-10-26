# SV-10874 — vendor credit not exported to QuickBooks / not in QB Unexported (26 Oct 2026)

Mode: **API** (QA lead). QA lead: test without a QuickBooks sandbox. Result: **PARTLY REPRODUCED**.
Production `app.shopview.com` build **v26.43.1-9af7270**, read at start and before posting. Admin, location Trucks Hill 2.
Sources: ticket description (customer J4 Mechanical, credit XA107024577:01, three statements), comments 77915 (Ryan: not
dup of SV-9419), 78659 (Parth: two ways to create a credit; manual New Credit not synced; return credit synced; not
reproducible), 79399 (Milos: try, then move back to him). SV-9419 read (different customer, vendor invoice).

## Checks
| # | Check | Evidence | Result |
|---|---|---|---|
| 1 | QuickBooks state | `GET /api/bookkeeping/adjustment-item-mapping-status` → quickBooksConnected:false | export not testable |
| 2 | QB Unexported, all groups | `GET /api/bookkeeping/unexported-items?filters[0][field]=groupName&filters[0][value]=vendor|customer|journal_entry` → 0/0/0 | empty (nothing queues without QB) |
| 3 | Manual credit: vendor Delete Test (`f9618e14-2255-470d-afc7-b20c8e7fc33d`) → New Credit 12.34 | `POST /api/parts-catalogue/vendor/credit/create` 200; row "Credit … C-17064 -$12.34 Unapplied", **no href**; click on No. cell → URL unchanged | **customer point 3 reproduced** |
| 4 | Return credit ZZAUTOTEST-CM-10408-P1 on same list | href `/parts/return/57bd03b4-…` → "Return Details" page | opens |
| 5 | Vendor invoice ZZ10841-P5 | href `/parts/delivery/aedd6a11-…` → "Vendor Invoice" page | opens |

Hypothesis put to dev (not confirmed): customer's credit was entered with New Credit → never sent to QB, never in
QB Unexported, not clickable — matches all three statements. Asked Parth/Milos to check the customer's data; product
question if so.

## Posted
Comment **79537** (yellow "REPRODUCTION ON PRODUCTION: PARTLY REPRODUCED", @Milos @Parth, 4-row table, pictures 1–2,
5 steps, could-not-test). Read back: panel, 5 table rows, 2 media as attachments in order, ol 5. Gate: production marker
unchanged; ticket Blocked, 3 comments, none new; wording scan clean. Ticket NOT moved back to Milos — asked QA lead.

## Test data left on production
Manual credit $12.34 "ZZAUTOTEST SV-10874 manual credit" on vendor Delete Test.

## Learning check
- Vendor Unpaid Invoices tab (`/parts/vendor/{id}/unpaid-invoices`): table `table-unpaid-transactions`; Delivery rows link
  `/parts/delivery/{id}`, return-credit rows `/parts/return/{vendor_return_id}`, manual credits have no link.
- Copy full UUIDs, never ones truncated in a print: a cut vendor id gave "Oooops! An error occurred".
Recorded in the playbook.
