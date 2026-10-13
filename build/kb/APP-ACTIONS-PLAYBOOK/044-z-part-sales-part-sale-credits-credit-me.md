## §Z — PART SALES, PART SALE CREDITS, CREDIT MEMOS AND IMPORTED INVOICES (sv9872, 2026-09-11)

Everything below was observed live on `v26.36.2-12974d6`. Recorded at the QA lead's instruction
("Save the recipe etc").

### Z.1 The branch has TWO ORGANISATIONS — check which one you are in BEFORE anything else

`sv9872` carries **two separate organisations**, and this is the single biggest time-waster on it:

| Organisation | Locations | Numbering | Reached by |
|---|---|---|---|
| **Foothills Group Inc** | Staging Heavy Duty - 9919 · Staging Lethbridge - 4310 | `S-…`, `S2-…`, `P9872-…` | the branch's **dev quick-login** (`qa-branch-boot.mjs`) |
| **Dteem** (the QA lead's own test org) | Location1 | `S1-…`, `P1-…`, `S-3…S-6`, `CM-…` | **only the QA lead's browser cookies** |

**The dev quick-login CANNOT reach Dteem.** There is no organisation switcher in the app
(`grep` the bundle: only `iam/change-location`, which takes a *workplace*, not an org). If the QA lead
points you at a customer and the page is empty or `customers/view/<id>` answers
`{"errors":[{"companyId":"Not found"}]}`, **you are in the wrong organisation** — stop and say so
rather than hunting for data that is not there.

**🛑 NEVER call `POST /api/iam/change-location` to move between locations.** It returns 200 and then
leaves the session showing zero customers and zero invoices, with a null location in the top bar. A
fresh `boot()` always recovers it. Cost on 2026-09-11: about an hour. Let `boot()` pick the location
and check where you landed; if it is wrong, boot again.

### Z.2 The QA lead's cookies reach his org's DATA but NOT its SCREENS

Carry all three, host-only, on **both** the app host and the API host:
`sv_sso_session` + `PHPSESSID` + `cf_clearance` (the last on `.shopview.com`).
With only `sv_sso_session` every call answers `409 Session has expired.` — the other two are required.

With those cookies **the API works fully** but the SPA always lands on `/login`, because its own
auth check requests `/api/api/sso/check` (doubled prefix) and that route does not exist on any host
(404 on the API host, all spellings tried). So: **read and print with his session, but you cannot
click anything.** Anything requiring a tick-box or a dialog has to be done by him, or in the
Foothills org where quick-login works.

### Z.3 Part sales

- List: `/parts/part-sales` (**not** `/part-sales`, which renders an empty page).
- **The list's default filter is `?status=estimate&status=approved`.** A direct link to an *invoiced*
  part sale bounces back to the list. Load `/parts/part-sales?status=invoiced&status=paid` first, then
  click the number.
- Detail: `/parts/part-sale/<id>/part-requests`; the document is on the **Finance** tab.
- An **invoiced** part sale's Finance tab renders through the ordinary
  `GET /api/invoices/preview?invoice_id=…` route, so it can be captured like any other document.
- An **un-invoiced** part sale's Finance tab builds its document with `POST /api/work-orders/invoices/estimate`
  instead — there is no GET to replay, so capture that document **from the rendered page**, not the API.

### Z.4 Part Sale Credits — the conditions, from the QA lead (2026-09-11)

A Part Sale Credit is the sixth customer document and **no new ones can be created** in the ordinary
way (spec Q21). It appears only when this chain holds:

1. the customer has payment terms set (**Net 30 / Due on Receipt**), **and**
2. the part sale invoice is paid by **Charge Account**, **and**
3. the parts are then returned — `⋮` on the part sale's **Finance** tab → **Issue Credit**.

**The tell when the chain is not satisfied:** the Issue Credit dialog opens but reads
**"No parts on this invoice are available for credit."** Seen on P1-162.

**Charge Account is a BUTTON on the payment dialog, not a payment method.** The Payment Method list
offers only EFT · Visa · Cash · E-transfer · Check · Gift card · Amex · Debit · Payroll deduction ·
Mastercard · Applied credit · Exmerce. The **Charge Account** button appears on the payment dialog
raised from a **work order** invoice, and is **absent** when the customer is over their credit limit —
P1-162 carries an **"Over Limit"** badge and its customer has `credit_limit: 0`, which is why the
button never appeared.

**How to find an existing one without guessing:** every customer record carries
**`part_sale_credit_count`**, and every work order carries **`has_part_sale_credits`**. Sweep on those
two fields rather than scanning documents. On 2026-09-11 exactly **one work order in 472** carried a
part sale credit (`S-17335`, Foothills), which is why a casual look finds none.

### Z.5 Credit memos (Credit Invoices)

- Raised from `⋮` on a **work order's** Finance tab → **Issue Credit**.
- **There is no GET list route.** `GET /api/credit-memos` is **405, POST only**.
- Find them two ways:
  - **applied** ones: `GET /api/customer-payment/list?account_id=<customer_account_id>` →
    each payment carries `applied_credit_memos[]` with `credit_memo_id` and `credit_number`;
  - **unapplied** ones: `GET /api/customer-account/list-unpaid-transaction?account_id=<id>` →
    rows with `type: "credit"`.
- **`account_id` is the customer's `customer_account_id`**, NOT the customer id. Passing the customer
  id gives `400 {"account_id":"Missing required parameter"}` or an empty list.
- **`origin_invoices[]` is the field that says what a credit was raised against** — empty means a
  standalone credit with no originating invoice. This is the only reliable way to tell them apart;
  the printed page merely omits the Invoice Number column.
- Print it: **`GET /api/credit-memos/<id>/pdf`** (found by grepping the served bundle for
  `printCreditMemoPDF`). Returns a real `application/pdf`.

### Z.6 Imported invoices — how to seed one

Settings → **Invoices Import** (`/administration/invoices-import`). Two traps, one round each:

1. **Keep the asterisks in the header row exactly as the downloaded template has them**
   (`*Shop Location,*Customer,…`). Stripping them gives `400 {"error":"Invalid file headers provided!"}`.
2. **The `Shop Location` column must name the location the session is actually on**, or every row is
   silently skipped and the import reports success with nothing created.

Required columns are the starred ones: Shop Location · Customer · Invoice Number · Invoice Date ·
Item · Line Title · Qty · Rate · Total · Tax Amount. `Item` is one of
Labor · Part · Shop Supplies · Misc · Sublet · Credit Memo.

Posts to `POST /api/imports/work-order-historical`; on success `{"duplicatedInvoices":[]}`.
List with `GET /api/work-orders-imported?…`; print with `GET /api/imported-work-orders/<id>/pdf`.
Seeded example: `ZZAUTOTEST-IMP-003`.

### Z.7 Finding a route when walking the UI stalls

The app is a Vue SPA with ~134 lazily-loaded chunks. When a screen will not render, **grep the served
bundle instead of guessing URLs** — ten guessed routes all 404'd on 2026-09-11, and one grep found the
answer immediately:

```bash
curl -s https://<branch>/ -o idx.html
grep -oE 'src="[^"]+\.js"|href="[^"]+\.js"' idx.html          # the entry chunk
curl -s https://<branch>/js/index.<hash>.js -o index.js
grep -oE '[A-Za-z]{3,32}:[a-z]?=>[a-z]\.(get|post)\(`[^`]{0,90}<thing>[^`]{0,50}`' index.js
grep -oE '"\./[A-Za-z0-9_.-]+\.js"' index.js                  # every lazy chunk, fetch them all
```

---

