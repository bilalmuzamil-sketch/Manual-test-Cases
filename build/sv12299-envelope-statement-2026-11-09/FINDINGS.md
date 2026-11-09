# SV-12299 — "customer receives a statement instead of the invoice" — production reproduction attempt (9 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12299 (Bug, Ready to Fix, Product Area Work Orders, labels bug-report/powertools-unassigned/source-intercom). Asked by the QA lead: "We need to reproduce this on production." Milos (80510): "Billal will try to repro this issue".
Source read in full: description + Intercom attachment `intercom-conversation.txt` (Ryan Wallis / Jordan, HD Force Maintenance, invoice 6024).

## Result: NOT REPRODUCED on production — 5 emails sent from the envelope icon, 5 invoices attached, 0 statements

Environment: production `app.shopview.com`, test org 72b2cc90…, location Trucks Hill 2, signed in as admin Bilal, Chrome desktop 1600 wide.
Build v26.45.2-107ad4b (read at each send; earlier today the marker was 132dcb4, so production redeployed between 08:21 and 09:35 CST).

Test data (left in place, ZZAUTOTEST): customer **ZZAUTOTEST SV12299 Charge Account** (company 164013e0-2148-402e-b0e2-4f9390b72c29), credit term set to **Net 30** on screen (Customer → edit → Credit Term → Net 30 → Save), contact **Inbox SV12299** = bilal.muzamil+sv12299@shopview.com, unit 12299, work orders **S2-1944** (a53ff202-d342-4f00-85cb-191bf7583c2f) and **S2-1945**.

| # | Work order state | How | Document the browser fetched + uploaded | Email received (Gmail) |
|---|---|---|---|---|
| A | S2-1944 Complete (not invoiced) | Finance tab → envelope → Send Email | estimate endpoint (invoice draft) | "Invoice for order number: S2-1944", 1 attachment `invoice-for-order-S2-1944.pdf` (15:35:26Z) |
| A2 | same, repeated to keep the PDF | same | INV-S2-1944, Terms Net 30 (`ev/A2-completed-pdf1.pdf`) | same subject + attachment (15:37:20Z) |
| C | Create Invoice → New Customer Payment dialog, method **Charge Account** (pre-selected for a Net 30 customer) → **Charge Account** | on screen | — (no request is sent by Charge Account; it closes the dialog; WO badge → Invoiced, invoice pending on account) | — |
| B | S2-1944 Invoiced + charged to account (fresh page) | Finance tab → envelope → Send Email | `invoices/preview?invoice_id=…&type=pdf` → INV-S2-1944 (`ev/B-charged-pdf1.pdf`) | same subject, 1 attachment `invoice-for-order-S2-1944.pdf` (15:40:52Z) |
| D1 | S2-1945 Complete, one page session | envelope → send | INV-S2-1945 draft (`ev/D-samepage-pdf1.pdf`) | "Invoice for order number: S2-1945" (15:44:20Z) |
| D2 | same page, no reload: Create Invoice → Charge Account → envelope → send | on screen | INV-S2-1945 (`ev/D-samepage-pdf2.pdf`) | same, 1 attachment `invoice-for-order-S2-1945.pdf` (15:44:43Z) |

All 4 captured PDFs: 1 page, title "Invoice: INV-S2-19xx", the word "statement" appears 0 times.

## Why (code, ShopView/shopview at a49c607ed4dfb86ef3e92062dcf6f147995df274)
- The envelope on the Finance tab runs `sendInvoice()` in `app/src/components/ts/billing/Invoice.vue` (L1675–1720): it first calls `retrieveInvoiceHtmlPdf('pdf')` (L954–1000) — with an invoice id it uses `GET /api/invoices/preview?invoice_id=…&type=pdf` (`app/src/api/billing/index.ts` L74–80), otherwise `POST /api/work-orders/invoices/estimate` — and uploads that PDF as `invoice_pdf`.
- The server attaches exactly that upload (`api/src/Invoicing/Invoice/Application/HTTP/Send/InvoiceStatusUpdatedToSentActions.php` L113–116, named `invoice-for-order-<number>.pdf`) plus note attachments only when "Include 'For Customer' Attachments" is ticked (L56–58). The preview handler (`Application/Preview/Create/CreateCommandHandler.php`) only renders the invoice template.
- The only screen that emails a **statement** is the customer page → Transactions table → **Send Email** (`UnpaidTransactionsTable.vue` L1231–1254 → `UnpaidTransactionsStatements.vue`, `doc-type="statement"`, `POST /api/customer-account/send-transactions-mail`; email template `email/UnpaidTransactions/send-unpaid-transactions-email.html.twig`, title "<Company> Statement", body "Please find your statement attached and remit payment…"). That page is not inside the work order.

## What would settle it (not obtainable by us)
The email the HD Force customer actually received: its **subject** ("Invoice for order number: …" vs "… Statement") and its **attachment name** (`invoice-for-order-….pdf` vs a statement file). That tells which screen sent it. Also whether "Include 'For Customer' Attachments" was ticked and the WO had a statement PDF attached as a For-Customer note.

## Not tried
- The customer's own org and invoice 6024 (no access).
- A WO carrying a For-Customer note attachment that is itself a statement PDF.

Learning check: nothing new for the rule book; recipe reused from playbook (production email content test, SV-6915). New proven fact for the playbook: Charge Account in the New Customer Payment dialog sends no request (closes the dialog; invoice stays pending on account); customer credit term can be set on screen via the customer Edit dialog (option has no test id on this build — pick by text "Net 30"); `POST /api/customers/change` with a partial body returns 500.

## Posted 9 Nov 2026 — comment 80521
"Not reproduced on production" comment with 4 annotated production exhibits (`ev/exhibits/01..04`, built by `scripts/exhibit.py`, uploaded as real Jira attachments) and a table of the 5 emails; tags Mike Freeman (reporter) asking for the subject line and attachment name of the email HD Force's customer received. Read back: 4 media in order, mention present. Pre-post gate: production marker v26.45.2-107ad4b (same as the tests), ticket Open with only Milos's comment 80510, no technical section, human voice. The earlier header said "6 sends"; the correct count is 5 emails (C was the Charge Account step, not a send).
