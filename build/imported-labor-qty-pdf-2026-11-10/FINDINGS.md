# SV-12520 — Imported invoice PDF prints labor/sublet quantity in minutes (found while testing SV-12435)

QA lead ruling (10 Nov 2026, verbatim): "Raise it Only of that is a genuine bug, with anotated s reenahots do vive the reference 9f where this ticket is coming from if that is a followup ticket and then tag milos and chris ward to confirm if that needs to live like this or we want to fix it. But make sure that it should not bite me."

## Why it is genuine (checked before filing)
- Spec: History Import - Overview (v2) "All values import exactly as they appear in the file."; History Import - Internal Training (v4) §9.1 Labor rows "Store ... Qty"; §9.5 Sublet "Behaves like Labor rows."
- Code (ShopView/shopview @ 1c2403e5636c): ImportCommandHandler.php L253-L264 stores Labor/Sublet qty × 60 (timeEstimate in minutes); ImportedInvoice.vue L205 shows minutesToHours(); imported-invoice.html.twig L545 prints line.timeEstimate raw. Parts stored and printed as-is.
- The PDF contradicts itself: 150.00 × $40.00 = $100.00.
- Jira search (imported/import + PDF/quantity/minutes/hours, all statuses; again just before filing): no duplicate. SV-12501 (Board Backlog) does not mention quantity; noted on the ticket.
- Not caused by SV-12435 (commit c90603f11b touched only app/src/css/invoice.scss).

## Variant matrix (all observed live)
| Env | Invoice | Line | File qty | Screen | PDF |
|---|---|---|---|---|---|
| Production v26.45.3-fc08f23 | ZZQTYPDF-P | Labor | 2.5 | 2.50 | 150.00 |
| Production | ZZQTYPDF-P | Sublet | 3 | 3.00 | 180.00 |
| Production | ZZQTYPDF-P | Part | 4 | 4 | 4.00 |
| Production | ZZ9818-P | Labor | 1 | 1.00 | 60.00 |
| QA sv12435 v26.45.3-8f11821 | ZZQTYPDF-QA | Labor / Sublet / Part | 2.5/3/4 | 2.50/3.00/4 | 150.00/180.00/4.00 |
| QA sv12435 | ZZ12435-INV1 | Labor | 1 | 1.00 | 60.00 |
Production released a new build mid-pass (fc08f23); the production screen + PDF were re-captured on it at ~17:04 UTC and the branch re-captured at the same time.

## Test data (left in place, ZZAUTOTEST)
- Production imported invoice ZZQTYPDF-P (id 006fbf58-fcbe-43f0-992b-e95060fb7318), location Trucks Hill 2, customer aqeel transport 56.
- QA sv12435 imported invoice ZZQTYPDF-QA (id 17d4bce6-8cbe-473e-9747-d77741df130c).
- Import CSVs: ev/prod/import-ZZQTYPDF-P.csv, ev/branch/import-ZZQTYPDF-QA.csv.
- The production Work Orders view was switched to list view for the walk and put back to board view; Status filter cleared.

## Steps walked live on production before filing
Work Orders → All → list view → Status → Imported → row ZZQTYPDF-P opens /imported-work-orders/006fbf58… → Download. In BOARD view the Imported checkbox is disabled, so the list-view step is needed (added to playbook §AW).

## Ticket
SV-12520 (Bug, Medium, Product Area Work Orders, label bug-report, no parent — SV-12435 has none), Relates SV-12435, Milos + Chris mentioned to confirm fix vs keep. 3 attachments embedded (prod-where-to-click, prod-qty-screen-vs-pdf, branch-qty-screen-vs-pdf); read back: 3 attachments, link present, priority Medium, Product Area Work Orders.

## Pre-post gate
Build markers re-read (prod moved → re-captured); duplicate search re-run at filing; steps walked live; mentions use real account ids; no technical section beyond the code-reference line (Rule 124); human voice.

## Learning check
- New nav fact: the Status → Imported filter is disabled in board view; switch to list view first → playbook §AW.
- New: Jira MCP createJiraIssue/editJiraIssue take HTML only; mentions = `<span data-type="mention" data-user-id="AAID">@Name</span>`, images = `<figure data-type="media-single" ...><div data-type="media" data-media-type="file" data-id=".." data-collection=".."></div></figure>` → playbook §V.
