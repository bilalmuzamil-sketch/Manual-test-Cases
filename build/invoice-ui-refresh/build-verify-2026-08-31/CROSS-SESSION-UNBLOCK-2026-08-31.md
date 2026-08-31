# Invoice UI Refresh (SV-8218) — cross-session unblock of `markers/blocked-analysis.json`

**Written by:** session `user-73` (credit-memo document investigation lane), 2026-08-31
**For:** the build-verification session working `build/invoice-ui-refresh/build-verify-2026-08-31/`
**Answers:** 35 of the 60 rows in `markers/blocked-analysis.json`
**Branch this file lives on:** `claude/credit-memo-document-location-tov2x1`

## 🔴 READ THE VERIFICATION STATUS FIRST (Rule 12)

**Everything below is SOURCE-VERIFIED ONLY. Nothing here was observed on the sv8218 build.**
I read `origin/SV-8218` in the `ShopView/shopview` monorepo, fetched 2026-08-31. I did not hit a
single one of these endpoints on the host, did not log in, and captured no evidence.

Badge: ❌ **never build-verified** (Rule 91). Each route below needs **one live call** before any
case moves off Blocked. Treat this file as a set of leads that removes the search cost — not as a
verification. If a route 404s live despite being on the branch, the most likely cause is a
**deployed build behind branch head**, not a missing feature.

---

## 1 · The Credit Invoice document — 22 cases

`blocked-analysis.json` says: *"Needs a Credit Invoice DOCUMENT. The credit memo RECORD exists
(CM-100). The document render path was searched exhaustively and not found; Story 11."*

**The render path exists on the branch and is reachable from the UI.**

**Screen:** Customers → open the customer → **Invoices tab** → the credit memo's own row → **print
icon** in the Action column ("Print credit memo" tooltip).

**Why it was missed:** the row does not announce itself as a credit memo. In
`ListUnpaidTransactionsQueryHandler.php:689-716` the credit row is built with
`invoiceNumber: $row['credit_number']` and `workOrderId: null` — so **CM-100 sits in the Invoice #
column** among real work-order invoice numbers, with the shop-id splice applied. There is no
separate Credits tab. The print icon is `flat round size="sm"` in an `auto-width` right-aligned
cell shared with Cash Out, which reads as invoice-row chrome.

| Fact | Value |
|---|---|
| Screen | `app/src/components/ts/customers/Customer.vue:166` — `<q-tab-panel name="invoices">` |
| Button | `UnpaidTransactionsTable.vue:194-219` (SV-8218 line numbers) |
| Selector | `data-test-id="button_print_credit_memo_<creditMemoId>"`, `aria-label="Print credit memo"` |
| Shown when | `scenario === 'customer'` AND `row.type === 'credit'` AND `row.status !== 'voided'` — **Unapplied qualifies**, no invoice application needed |
| Endpoint | `GET /api/credit-memos/{creditMemoId}/pdf` (route `credit_memos_pdf`), `ROLE_INVOICE_VIEW` |
| Response | inline `application/pdf`, filename `credit-memo.pdf` |
| Renderer | `CreditMemoPdfDataProvider` → `PartSaleCreditPdfGenerator` → `api/templates/invoices/credit-invoice.html.twig`, whose `<title>` is literally **Credit Invoice** (line 299) |

**The id to use is the credit row's `id` field** from `list-unpaid-transaction` — row id IS the
credit memo id for credit-type rows. Not `CM-100`, not the origin invoice `S-15517`, not a payment
id. The handler does `findOrgScopedById()` and throws `NotFoundHttpException` on a miss
(`GenerateCreditMemoPdfQueryHandler.php`), so **a wrong id 404s identically to a wrong route** —
which is why route-shape probing produced 404 everywhere.

**Second entry point:** Customer → **Payments tab** (`TransactionsPaymentsTable.vue`), same
endpoint — on a refund row carrying `linked_credit_memo_id` (line 110-130) and on the expanded
`applied_credit_memos` sub-rows (line 496-508). An **Unapplied** CM-100 will not appear there,
which matches the observation that it was absent from Payments.

**Not on the work order finance tab, by design:** credit memos are not WO-attached
(`workOrderId: null`, same mapper). The invoice menu offering only **Issue Credit** is the creation
path. Do not write cases expecting the document there.

**Why `/api/invoices/preview` rejected the credit memo id:** `#[MapEntity(Invoice::class)]` on
`CreateRequestDto` — it resolves an **Invoice** entity, so a credit memo UUID can never bind. Not a
bug.

### ⚠️ Precondition these 22 cases must carry — a scoping asymmetry

- the unpaid list filters credit memos **by workplace** — `workplaceDecorator->decorateQuery($creditMemosQB, 'cm.workplace_id')`, comment cites **SV-7761** (*"credit memos stay workplace-local — only the INVOICES list was widened cross-location"*)
- the PDF handler is **org-scoped** — `findOrgScopedById()`, comment cites **SV-7757** (*"workplace scoping here 404'd a credit whose location differed from the caller's active location"*)

**Net effect: if the tester's active location is not the location CM-100 was issued at, the row
disappears from the Invoices tab entirely** — no row, no print button — even though the PDF
endpoint would still serve it. Pin the active location to the memo's workplace in Preconditions.

Also: the **Open only** chip defaults to on (`Customer.vue:403`). CM-100 at −$36.57 passes it; a
fully-applied memo needs the toggle off.

### The 22 cases

C44903 · C44904 · C44905 · C44906 · C44955 · C44956 · C44964 · C44965 · C44966 · C44967 · C44968 ·
C44969 · C44970 · C44971 · C44977 · C45168 · C45179 · C45180 · C45181 · C45182 · C45183 · C45197

Links: `https://shopview.testrail.io/index.php?/cases/view/<id>` — e.g.
C44903 → https://shopview.testrail.io/index.php?/cases/view/44903 ·
C45197 → https://shopview.testrail.io/index.php?/cases/view/45197

---

## 2 · The Parts Sale document — 9 cases

`blocked-analysis.json` says: *"Needs a Parts Sale document. I have /api/part-sales (53 records) but
NEVER clicked into a part sale in the UI to learn its detail/document route. Untried."*

**Endpoint:** `GET /api/part-sales/{partSaleId}/invoice-pdf?estimate=0|1`
(route `part_sales_invoice_pdf`, `ROLE_INVOICE_VIEW`)
`api/src/Invoicing/Invoice/UI/HTTP/PartSaleInvoicePdf/PartSaleInvoicePdfController.php:19`

### 🛑 THE TRAP — `{partSaleId}` IS RESOLVED AS A WORK ORDER, NOT A PART SALE

```php
final readonly class PartSaleInvoicePdfRequestDto implements RequestPayload
{
    public function __construct(
        #[MapEntity('partSaleId')]
        public WorkOrder $workOrder,          // ← a WorkOrder, despite the param name
        public int|string $estimate = 0,
    ) {}
}
```

Passing a `part_sale` row id from `GET /api/part-sales` **404s every time** — `MapEntity` cannot
bind it to a `WorkOrder`. Use the part sale's **work order id**.

`?estimate=1` renders the Parts Sale **Estimate**; `estimate=0` (default) renders the **Invoice**.
That covers the estimate/invoice split these cases need, and maps to **Story 13 — Parts Sale
Estimate and Invoice (SV-9195)**.

Related: `GET /api/part-sales/credit/{partSaleCreditId}/pdf` (route `part_sales_credit_pdf`) is the
legacy part-sale-credit document — the parallel endpoint the credit-memo PDF was modelled on.

**Screens that list part sales** (for the UI leg, not yet traced to a print control):
`app/src/components/ts/parts/part-sale/PartSales.vue` (pageKey `part-sales`) ·
`app/src/components/ts/customers/CustomerPartSalesTab.vue` (Customer → Part Sales tab,
`tab_part-sales`) · route `/part-sales/:id/parts` (`PartSaleTabs`).
**I did not find the FE print control for this document.** Endpoint confirmed, screen leg open.

### The 9 cases
C44928 · C44980 · C44981 · C44982 · C44983 · C44984 · C44985 · C44986 · C45190

---

## 3 · "Generate the PDF" — 4 cases, nothing missing

`blocked-analysis.json` says: *"I render type=html and never once tried type=pdf on the same
endpoint."*

**`type=pdf` is already accepted.** `api/src/Invoicing/Invoice/UI/HTTP/Preview/DTO/CreateRequestDto.php`:

```php
#[Assert\Choice(choices: ['html', 'HTML', 'pdf', 'PDF'], message: 'Type must be either html or pdf')]
public string $type,
```

The handler matches on `strtolower($type)` and the controller returns raw content with the
generator's own headers (`CreateController.php:34`) — so the same `GET /api/invoices/preview` call
that produced the captured HTML returns a PDF with one param change. **No new endpoint, no build
work, no blocker.**

Permission is `ROLE_INVOICE_CREATE_AND_EDIT` on this endpoint (note: *stronger* than the
`ROLE_INVOICE_VIEW` on the two document endpoints above — a view-only role can print a credit memo
and a parts sale but cannot preview an invoice).

Other params on the same DTO worth knowing: `includeDeclined` (bool), `isEstimate` (bool),
`historyEvent` (?int — a pre-redesign snapshot, which C45185 needs).

### The 4 cases
C45173 · C45185 · C45193 · C45195

**C45175 is NOT in this group** — its need is *"Generate each portal PDF"*, which is staging-only.
Leave it parked.

---

## 4 · C44937 "Show declined work" — a CORRECTION, and it is NOT a bug

`blocked-analysis.json` says: *"The 'Show declined work' setting is genuinely absent from the
Invoice Details dialog — confirmed this run with a POSITIVE CONTROL firing… Story 6 not built."*

**The positive control was sound. The conclusion is too strong.** The *toggle* is absent; the
*capability ships*:

| Evidence | Location |
|---|---|
| `includeDeclined` is an accepted request param | `Preview/DTO/CreateRequestDto.php` |
| `isDisplayDeclinedWork` carried to the template | `InvoicePreviewDto.php:32,140` |
| same on the estimate path | `InvoiceEstimateDto.php:31,140` |
| same on the snapshot path | `InvoiceSnapshotDto.php:127` |
| declared on the shared interface | `InvoiceDtoInterface.php:50` |
| **no FE control sends it — anywhere** | grepped all of `app/src`: zero hits for `includeDeclined` |

So the document **does** render declined work when asked; only the operator control is missing.

### Is it a bug? NO — and it must not be filed as one

**Story 6 is `SV-9145 — Declined Work`, status `In Progress`.** Verified live 2026-08-31 via
`parent = SV-8218`: **all 21 children of SV-8218 are In Progress. Not one is Done.**

Therefore:

1. **Rules 49 + 60, and CLAUDE.md §4 verbatim:** *"the branches are NOT final — they are
   continuously updated as ad-hoc decisions are made and will not be final until release day, so
   Rules 49 and 60 remain in force and a gap is **possibly-unfinished** rather than automatically a
   defect."* A control missing from an open story is **unfinished, not defective**.
2. **Rule 94 (defect admissibility gate):** a finding against an open story does not clear the gate.
3. **Rule 62 / register row H1:** the Jira creation hold is active regardless.

**Correct handling:** the case keeps its documented expectation (**Rule 57** — the spec, not the
build, defines Expected Results), takes the **"NOT AVAILABLE ON BUILD"** marker (**Rule 69**), and
is **excluded from any ready-to-automate figure** (automation-marker convention). Verdict stays
**PROVISIONAL** (Rule 49). Re-check when SV-9145 closes.

### ❌ Rule 24 does NOT apply here — do not use it

I floated Rule 24 for this row earlier in my own session and that was **wrong**; recording the
correction so it does not propagate. Rule 24 is *"Front-end blocks + backend/API allows = a PASSED
test case"* and it is about **permission enforcement** — an action correctly hidden from a user who
should not perform it, still reachable via the API, is expected and passes. Here the toggle is
missing for an **admin who should have it**. That is a **missing control on an unfinished story**,
not a permission boundary. Marking C44937 PASSED under Rule 24 would bury a real gap.

**Same treatment for C44942** (*"Show % on Estimates and Invoices"*, Story 7 = **SV-9146 Financial
Summary, In Progress**). I found no `showPercent` / percent-on-documents field anywhere in
`api/src` or `app/src`, so unlike declined-work there is no backend capability either — a cleaner
NOT-BUILT. Still not a bug, same reasoning.

---

## 5 · A lead, not an answer — the 4 IBS Approval Code cases

C44913 · C44916 · C44938 · C44939 need an invoice carrying an integrated-billing **Approval Code**.
The endpoints exist:

- `POST /api/invoices/ibs/requestIBSApproval`
- `GET  /api/invoices/ibs/retrieveIBSApproval`
- `POST /api/invoices/ibs/changeIBSApproval`
- `GET  /api/invoices/ibs/retrieveCustomerInformation`

**I did not trace whether an approval code can be forced onto a seeded invoice**, and
`changeIBSApproval` may or may not accept an arbitrary code. Calling this unblocked would be a
guess. Treat as the next thing to probe, not as an answer.

---

## 6 · What I could NOT unblock

| Rows | Reason |
|---|---|
| C44947 · C44951 · C44952 · C45175 | Customer-portal-only. Correctly parked under the QA lead's 2026-08-31 staging-only ruling; the `AUTOMATION: HOLD - customer portal only exists on staging…` marker is right. |
| the 18 `MINE` rows | Own seeding work, not blockers. The self-triage on those reads correct to me. |
| C44963 / C44962 | Needs an unpaid invoice. Diagnosis in the file is right — seeding, already authorised. |

---

## Provenance

Source: `ShopView/shopview` @ `origin/SV-8218` (head `8c3cc215a6`, 2026-08-28,
*"SV-8218 Fix the unstyled preview - no tag names inside the stylesheet"*), fetched 2026-08-31.
Jira read live 2026-08-31 (`parent = SV-8218`, 21 children, all In Progress).
Story 11 = SV-9150 *Credit Invoice*, In Progress — the credit-invoice template has three SV-8218
commits dated 2026-08-27/28 and differs from `develop` by 401/436 lines, so **the redesign is
landing on the branch now** and any layout verdict is PROVISIONAL.

No TestRail writes, no Jira tickets, no case edits were made in producing this file.
