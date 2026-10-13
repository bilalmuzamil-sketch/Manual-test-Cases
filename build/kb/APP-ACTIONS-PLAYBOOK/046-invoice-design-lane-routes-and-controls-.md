## INVOICE-DESIGN LANE — ROUTES AND CONTROLS PROVEN ON PRODUCTION, 12 SEPTEMBER 2026

Build `v26.36.4-3e1c643`, account `bilal.muzamil+serviceadvisornoreports@shopview.com`, org Bilal-Trucks.
Every one of these was found by **walking the screen with a request listener attached**, never by
guessing a route. Two of them replace guesses that 404'd.

### The estimate document of a NEVER-INVOICED job
An estimate-status work order carries **no `invoice_id`**, so `/api/invoices/preview` cannot be called
for it from the list payload. The finance screen uses its own route:

```
POST /api/work-orders/invoices/estimate
{"work_order_id":"<wo id>","type":"html","isEstimate":1,"includeDeclined":0,
 "issueDate":"<ISO>","dueDate":"<ISO>","historyEvent":null}   -> 200, the document HTML in the body
```

⚠ **Blank `issueDate`/`dueDate` make it 500.** The screen itself sent blanks for work order S1-860 and
got two 500s; four other estimate jobs on the same screen, same session, returned 200. So a 500 here is
about that record, not about the route — supply real dates when you call it yourself.

### The invoice kebab: Reverse and Issue Credit
`[data-test-id="button_wo_invoice_menu"]` on the Finance tab → **Reverse** · **Issue Credit**.
Reverse raises *"This action will re-open and undo the invoice. Are you sure you want to proceed?"*
with a **Reverse** button. **After a reversal the old invoice's `/api/invoices/preview` answers 400** —
the document genuinely no longer exists, so capture anything you need to compare BEFORE reversing.
The work-order kebab is a different control: `[data-test-id="button_work_order_nav_bar_menu"]` →
Audit Log · Timesheets · Set status.

### Changing workplace (location)
Profile menu → **click the SELECT `[data-test-id="select_location"]`, not the "Change Location" label**.
Clicking the label does nothing and looks like the control is absent. The select offers every workplace
(here: Truck Hill 1 · Trucks Hill 2 · SANKAN); the choice **persists across later logins**, so a probe
that assumes it starts at the default will be looking at the wrong workplace's records.

### The part-sale credit document
Customers → the customer → Invoices → the credit row's own print icon
`[data-test-id="button_print_credit_memo_<id>"]` → **`GET /api/credit-memos/<id>/pdf`** → 200,
`application/pdf`. The row shows the number as `CM2-4398` while the document itself reads `CM-4398`
(the same display-vs-document split already recorded for staging).

### The Authorizer
`[data-test-id="select_authorizer"]` on the **Lines** and **Finance** tabs; the work-order record
carries `authorizer_contact_id`, `authorizer_full_name`, `authorizer_telephone`, `ibs_approval_code`.
🔑 **The dropdown is populated from the CUSTOMER'S CONTACTS.** A customer with none offers only
"No authorizer", which reads exactly like a broken control and is not one. **Contacts are NOT in the
`/api/customers/view/{id}` payload and the Contacts tab makes no separate call** — the count is on the
tab itself, `[data-test-id="tab_contacts"]` reading `Contacts (4)`. Check there before concluding
anything about a missing Authorizer.

### Create Invoice
Still gated on the work order being **Complete** (recorded earlier the same day). Set it through
`button_work_order_nav_bar_menu` → Set status → Complete.

### Completing a work order, and why fresh work cannot simply be invoiced
`[data-test-id="button_complete_work_order"]` on the **Lines** tab is what completes a work order.
It is **NOT** the status badge (`badge_wo_status` is a label, not a menu) and **NOT** a "Set status"
menu — that is the PART SALE control (`button_part_sale_nav_bar_menu`), and assuming it applied to
work orders cost three probes. The work-order kebab (`button_work_order_nav_bar_menu`) offers only
Audit Log and Timesheets. Individual lines are completed first via
`button_action_complete_line_<lineId>`.

Completing does not make a job invoiceable: it opens **"Complete & Send to Review"**, and afterwards
the screen reads *"A foreman or manager must review this work order before it can be invoiced."* A
work order can also refuse to complete with *"1 part waiting to receive"*. So on an account whose
sign-in cannot approve reviews, **the only reliable way to obtain a fresh unpaid invoice is to REVERSE
an already-invoiced work order and recreate it** — and even then, a customer carrying money on account
may have the new invoice settled the moment it is raised.

### Invoices import (Settings → Invoices)
Route `/administration/invoices-import`. Controls: `file_upload` (a real `<input type=file>`, so
`setInputFiles` works), `button_download_template`, `button_import_invoices`. The template is a CSV
whose required columns are starred: `*Shop Location, *Customer, *Invoice Number, *Invoice Date, *Item
(Labor|Part), *Line Title, *Qty, *Rate, *Total, *Tax Amount`.
🔑 **The date must be `MM/DD/YYYY`.** `YYYY-MM-DD` is rejected with *"InvoiceDate and InvoiceNumber
cannot be empty."* — an error that names the wrong cause and will send you hunting the invoice number.
The endpoint is `POST /api/imports/work-order-historical`; a clean file answers
`{"duplicatedInvoices":[]}` and the screen says *"imported successfully"*.
⚠ **Unresolved as of 2026-09-13:** after a successful import the record could not be located — not on
the customer's Invoices tab, and not in the work-order list paged to exhaustion (186 distinct work
orders). Reported to the QA lead as something to look at, NOT filed as a defect. Note also that
`/api/work-orders?search=` matches the CUSTOMER name (78 rows for "aqeel") but **not** the work-order
number (0 rows for the real "S2-863"), so a zero from that search proves nothing on its own.

### IBS batch transactions
Reports → **IBS Batches** → `/reports/batch-transactions`, backed by
`GET /api/customers/ibs/list-batches`. On the production test account this lists **none**.

### QA branch sv9160 (Global Search V2) — boot, 2026-09-14
`node build/testing-tools/qa-branch-boot.mjs sv9160 / admin` — works, 200s across the board.
Two traps cost four attempts and are worth writing down:
- **The SSO file must contain the COOKIE ASSIGNMENT, not the bare token.** `qa-branch-boot.mjs` greps
  `/sv_sso_session=([^;\s]+)/` out of `/tmp/qa-cookies/<branch>-sso.txt`. A file holding only the
  64-hex value fails with *"no sv_sso_session in …"*, which reads like a bad token and is not.
  Write `printf 'sv_sso_session=%s' "<token>" > /tmp/qa-cookies/sv9160-sso.txt`, `chmod 600`.
- **A hand-rolled `chromium.launch()` does NOT reach these hosts** — `ERR_CONNECTION_RESET`. The
  committed harness launches with `proxy: {server: 'http://127.0.0.1:<bridge port>'}`, the port read
  from `/tmp/atlassian/bridge-port.txt` (it ROTATES — never hard-code it). Reuse the harness (Rule 97);
  rebuilding it is what produced the reset.
- **Node's playwright is NOT resolvable by bare specifier** — `import 'playwright'` gives
  ERR_MODULE_NOT_FOUND, and the `playwright` on the PATH is the PYTHON package. Node probes must import
  `/opt/node22/lib/node_modules/playwright/index.mjs` by absolute path, as the committed harnesses do.

