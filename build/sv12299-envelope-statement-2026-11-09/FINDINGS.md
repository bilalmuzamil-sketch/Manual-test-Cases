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

## 9 Nov 2026 (later) — REPRODUCED from the reporter's file (Mike, comment 80536)
- The file the HD Force customer received (Jira attachment 63968) is a **Customer Statement** (PDF title "Customer Statement", template `api/templates/customer/statement.html.twig`) for invoice S-6024, named "<customer> Statement (1).pdf".
- Only two places name a file "<customer> Statement.pdf": the statement download (`UnpaidTransactionsStatements.vue` exportFile) and the statement email (`MailTransactionsCommandHandler.php`, attach '%s Statement.pdf', subject 'Statement for %s'). Both sit on **Customers → customer → Invoices tab**: three icon buttons with no text (aria-label/tooltip Download / Send Email / Print; `UnpaidTransactionsTable.vue` L1238–1262). No work-order screen calls `/api/customers/{id}/statement-pdf` or `send-transactions-mail`, and nothing sends statements automatically. The Finance-tab envelope always attaches `invoice-for-order-<n>.pdf`.
- Reproduced on production v26.45.2-107ad4b: ZZAUTOTEST SV12299 Charge Account → Invoices (2) → envelope → "Sending statement" → Send Email → Gmail "Statement for ZZAUTOTEST SV12299 Charge Account" with "ZZAUTOTEST SV12299 Charge Account Statement.pdf" (19:23:21Z). Same template as the reporter's file (`ev/statement/`).
- Likely cause: the user clicked the unlabelled envelope on the customer's Invoices tab expecting it to email the invoice. Comment 80538 asks Jordan to confirm.
- Correction owned: comment 80521 called that tab "Transactions" (taken from the component name, not the screen). Corrected in 80538.
- The reporter's file is saved as `ev/statement/received-from-ticket-statement.pdf` and picture 7 as `ev/exhibits/07-received-vs-reproduced-statement.png` (Rule 127: ticket data is safe for this repo).
- 13:50 CST: comment 80538 rewritten in plain words (Rule 127c): status, what is happening, 5 steps, 3 captioned pictures, expected; read back with 3 media in order.

## 9 Nov 2026 14:49 CST — Mike 80541: Jordan insists it was the envelope INSIDE the work order (Finance tab)
- Code: the Finance-tab send attaches every work-order note file marked For Customer, under its ORIGINAL file name, when "Include 'For Customer' Attachments in email" is ticked (`InvoiceStatusUpdatedToSentActions.php` L56–58, L143–148, query L254–279).
- Reproduced on production v26.45.2-107ad4b, S2-1945 (Invoiced, charged): Notes → upload "ZZAUTOTEST SV12299 Charge Account Statement (1).pdf" (`note/create` + `note/add-attachments` 201) → tick For Customer (`note/update-attachment` 201) → Finance → envelope → tick Include For Customer → Send (`work-order/invoice/send-email` 201). Gmail 19:54:31Z "Invoice for order number: S2-1945" with 2 files: `invoice-for-order-S2-1945.pdf` + `ZZAUTOTEST SV12299 Charge Account Statement (1).pdf`. Script `scripts/forcust.mjs`, pictures `ev/exhibits/08`, `09`.
- The "(1)" in the reporter's file name = a browser's second save → the file was uploaded from a computer, consistent with this path.
- Posted ONE new complete comment 80542 (status, what is happening, 6 steps, 3 captioned pictures, ask Jordan to check WO 6024 Notes for a For-Customer statement). Read back: 3 media in order.
- Both ways a statement reaches the customer are now reproduced: (a) customer Invoices-tab envelope (80538), (b) work-order envelope with a For-Customer statement note (80542).
- 9 Nov 2026: comment 80538 deleted by the QA lead (the Jira connector has no delete-comment action). Ticket now: 80510, 80521, 80536, 80541, 80542 — 80542 is the single reproduction comment.

## 10 Nov 2026 00:35–01:00 UTC — Jordan's order (80547, 80549) on production, NOT reproduced
Jordan: no file was added to notes. Order: Customers > customer > Invoices > select invoices > envelope > X (nothing sent); then WO > Finance > Reverse > corrections > Create Invoice > Charge Account > envelope > untick default recipients, type own email > Send > received a statement.
Our runs, production v26.45.2-107ad4b, one browser session, in-app navigation only (no reload), customer ZZAUTOTEST SV12299 Charge Account, WO S2-1944 (script `scripts/jordan.mjs`):
| Run | Recipients | Statement window | Email received | PDF the browser uploaded |
|---|---|---|---|---|
| J1 | default contact | opened (2 invoices ticked) + X | 00:35:37Z "Invoice for order number: S2-1944", 1 file invoice-for-order-S2-1944.pdf | not captured |
| J2 | default contact | same | same subject | `invoices/preview?…type=pdf` = INV-S2-1944, 1 page, "statement" 0 times (`ev/jordan-order/J2/sent-invoice.pdf`) |
| J3 | default unticked, typed bilal.muzamil+sv12299j@shopview.com | same | sent (201) | INV-S2-1944 (`ev/jordan-order/J3/sent-invoice.pdf`) |
So Jordan's steps send the invoice on our data. The For-Customer path (80542) is a way a statement CAN go out with the invoice, but Jordan says no note was added, so it is not his case.
Pointer: the file Mike shared is "West Creek Farms Ltd Statement (1).pdf"; the customer-page statement email names its file "<customer> Statement.pdf" (MailTransactionsCommandHandler) with subject "Statement for <customer>". The email's subject + attachment name would say which screen sent it — asked of the QA lead first.

## 10 Nov 2026 ~03:50 UTC — Jordan 80549 WITH the payment steps (run K1, scripts/jordan2.mjs), NOT reproduced
Production v26.45.2-107ad4b, S2-1944, one session, in-app navigation:
1. WO Finance > New Payment > Cash > Make Payment (badge Paid). 2. Customers > ZZAUTOTEST SV12299 Charge Account > Invoices > tick invoices > envelope ("Sending statement") > X. 3. Payments tab > bin > Reverse (`reverse-customer-payment`). 4. WO > Finance > ⋮ > Reverse > confirm (Complete) > Create Invoice > "New Customer Payment" (lists BOTH open invoices S2-1944 + S2-1945, Charge Account preselected) > Charge Account (Invoiced). 5. Envelope > untick Inbox SV12299 > Optional emails bilal.muzamil+sv12299k@shopview.com > Send Email.
Result: `work-order/invoice/send-email` 201; uploaded PDF = `invoices/preview?…type=pdf` = INV-S2-1944 (ev/jordan-order/K1/sent-invoice.pdf).
WO page menus checked: nav ⋮ = Audit Log / Timesheets / Print Work Order; invoice ⋮ = Reverse / Issue Credit; icons Download / Send email / Print / Settings / New Payment. No statement option inside the work order.
Total: Jordan's order tried 4 ways (J1–J3, K1), the invoice was sent every time.

## 10 Nov 2026 — audit of OUR posted comments (QA lead: "we cant rely on Jordan … check if what we have mentioned as reproduction steps will not bite us"). Nothing posted.
80521 (NOT REPRODUCED, 9 Nov):
- OK: the 5 sends + their results; "the work-order envelope only attaches the invoice, plus notes marked For Customer when the box is ticked" (code + live).
- WRONG: "customer page → **Transactions** → Send Email" — the tab on screen is **Invoices** and the control is an envelope icon (same mistake already logged in LESSONS-INDEX for 80538).
- WRONG: "That email's subject **ends in** 'Statement'" (twice) — the real subject is "**Statement for** <customer>" (Gmail 9 Nov 19:23Z); it is the FILE name that ends in "Statement.pdf".
80542 (REPRODUCED…, 9 Nov):
- OVERCLAIM: headline "REPRODUCED ON PRODUCTION" — we reproduced one way a statement goes out WITH the invoice (note file marked For Customer + box ticked; email had 2 files). The report is a statement INSTEAD of the invoice, and Jordan says no note was added (80547). Not the customer's issue.
- UNSUPPORTED: "the '(1)' … is a sign it was uploaded from a computer and not created by ShopView" — "(1)" only shows the file was saved to a computer more than once (e.g. downloaded twice from the email). Inference, not evidence.
- OK: the steps themselves are true and live-verified (S2-1945, 19:54:31Z email with 2 files).
Risk: assignee Slavcho (Ready to Fix) may change the For-Customer path or close the ticket as user error based on 80542.

## 10 Nov 2026 — Sentry session recordings of HD Force (QA lead: "see everything and reach the exact steps")

Search: Sentry replays `user.email:*hdforce*`, last 8 days (36 recordings: service@, gm@ = Ryan Wallis, sean@). Server spans searched for `statement-pdf`, `send-transactions-mail`, `add-attachments`, the WO id, the customer id and the invoice id. Recordings and spans are SAMPLED, so a missing event proves nothing.

**The one recording that sends anything — Ryan (gm@), 6 Nov 2026 21:18:48 UTC (13:18 Pacific), replay 0a34af059d1e4a9a9f5634008758f2aa, work order 6f595db5, customer 2b40283b:**
| time in recording | click | request |
|---|---|---|
| 21.2 s | Notes tab | `GET notes` for the WO and its lines (list only, nothing uploaded) |
| 28.5 s | Finance tab | invoice settings, details, estimate |
| 54–64 s | line chip, line menu, a round button | line history |
| 71.0 s | blue button (Create Invoice) | `POST invoices/create` 201 → invoice 1d7e0717 |
| 94.7 s | **Charge Account** | (no payment request in the recording) |
| 98.3 s | envelope **Send email** | — |
| 105.7 s | tick contact **SHAHIM KHAN** | — |
| 106.4 s | tick one more box, unticked before, no label captured (a second contact, or "Include 'For Customer' Attachments") | — |
| 109.6 s | **Send email** | `GET invoices/preview?invoice_id=1d7e0717…&type=pdf` 200, then `POST work-order/invoice/send-email` 201 |

So this send attached the INVOICE PDF (plus For-Customer note files only if that second box was the Include box). No statement download, statement email or note upload appears in any HD Force recording or sampled span. The other recordings (service@ 6 Nov 21:11 WO 8c623673; sean@ 6 Nov 20:56 imported list; Ryan/service@ 9 Nov sessions incl. 22:07 vehicle invoices for customer 2b40283b) show no send.

**What this proves and what it does not:**
- Proven (code): only two screens make a file called "<customer> Statement.pdf" — Customers → customer → Invoices tab → Download, and the same tab's envelope (email subject "Statement for <customer>"). The work-order envelope sends "invoice-for-order-<n>.pdf" and, with the Include box ticked, every For-Customer note file under its own name.
- Proven (production, earlier today): both routes deliver a statement file to the customer (80521 path; For-Customer note path, pictures 08/09).
- Not proven: which of the two HD Force used. The customer's file is "West Creek Farms Ltd Statement (1).pdf"; the "(1)" is a browser's second-download suffix, which the statement email never adds — so it points at a DOWNLOADED statement that was then sent on (as a For-Customer note, or by hand), unless the "(1)" came from Mike saving it twice.
- Not proven: that invoice 1d7e0717 is S-6024. The statement is dated 6 Nov and lists only S-6024 due 6 Dec, which fits an invoice made on 6 Nov — if it is this one, the statement was made AFTER Ryan's send and went out separately.

**The one thing that settles it:** the email log for HD Force on 6 Nov (subject + attachment name of the email West Creek Farms received). "Statement for West Creek Farms Ltd" = Customers → Invoices tab envelope; "Invoice for order number: …" with a "… Statement (1).pdf" second file = work-order envelope + For-Customer note. The developer can read it from the mail provider log; nothing on the ticket or in Sentry can.
Nothing posted to Jira (QA lead: no comment yet).

## 10 Nov 2026 07:53–07:59 UTC — both routes RE-WALKED on production, screen only (QA lead: steps must really reproduce)
Production v26.45.2-107ad4b, Chrome 1600×900, signed in as bilal.muzamil@shopview.com (location Trucks Hill 2), customer **ZZAUTOTEST SV12299 Charge Account** (2 unpaid invoices S2-1944, S2-1945, contact "Inbox SV12299"). Scripts `scripts/walkA.mjs`, `scripts/walkB.mjs`; pictures + logs `ev/rewalk-2026-11-10/`.
**Route A — the envelope on the customer's Invoices tab sends a statement.** Customers → search → open customer → tab **Invoices (2)** → three icons with no text at the top right of the list; hover shows **Download / Send Email / Print** → click the envelope (**Send Email**) → window titled **Sending statement**, "You're about to send statement to selected contacts", contact ticked by default → **Send Email**. No invoice rows were ticked. Email received 07:55:55Z: subject **"Statement for ZZAUTOTEST SV12299 Charge Account"**, ONE file **"ZZAUTOTEST SV12299 Charge Account Statement.pdf"**. No invoice attached. REPRODUCED (statement INSTEAD of invoice).
**Route B — a statement file saved on the work order goes out with the invoice.** Same Invoices tab → **Download** icon → file "ZZAUTOTEST SV12299 Charge Account Statement.pdf" → Work Orders → S2-1944 (Invoiced) → tab **Notes** (0 files before) → **Attach files to a new note** button (tooltip "Attach Files") → choose the downloaded file → tick **For Customer** under it → tab **Finance** → envelope (tooltip **Send Email**) → window **Sending invoice** with an unticked box **"Include 'For Customer' Attachments in email"** at the top → tick it → **Send Email** → toast "Successfully sent invoice to email." Email received 07:58:41Z: subject **"Invoice for order number: S2-1944"**, TWO files: **invoice-for-order-S2-1944.pdf** + **"ZZAUTOTEST SV12299 Charge Account Statement.pdf"**. REPRODUCED (statement IN ADDITION to the invoice).
Note: only Route A gives a statement *instead of* the invoice; Route B gives both. Neither adds "(1)" to the name — the customer's "(1)" can only come from a browser saving the download a second time (Route B or a manual send).

## 10 Nov 2026 08:37 UTC — comment 80542 rewritten in place (QA lead: "this comment to be edited with what we have decided")
Dated edit note at the top (first posted 9 Nov 14:55 UTC−5, rewritten 10 Nov 03:37 UTC−5). Tags Slavcho. Contents: Way 1 (customer Invoices tab envelope → statement only) and Way 2 (For Customer note + Include box → invoice + statement), each with the re-walked steps, result email subject + file names + receive time; pictures `ev/exhibits/10-way1-customer-invoices-envelope.png`, `11-way2-work-order-for-customer-note.png` (new uploads) + the existing received-vs-reproduced picture; Jordan's flow not reproduced (4 runs); what is unknown; the 6 Nov email log settles it. Read back from Jira: 3 media in order, first line = edit note, mention resolved to Slavcho Mitrov. Gate: production marker v26.45.2-107ad4b at 07:53 UTC, last ticket comment 80549 (Jordan), no technical section.
