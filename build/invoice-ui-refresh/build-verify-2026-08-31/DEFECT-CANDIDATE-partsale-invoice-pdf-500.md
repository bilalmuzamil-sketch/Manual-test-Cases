# DEFECT CANDIDATE — `/api/part-sales/{id}/invoice-pdf` returns HTTP 500 on sv8218

**Status: CANDIDATE, NOT FILED.** The Jira creation hold is active (QA lead, 2026-08-31: hold was
lifted for one push and is back on, *"for the next push ask again"*). This is prepared text and
stops at the button (Rule 62, Rule 94).

## What was observed

| | |
|---|---|
| Endpoint | `GET /api/part-sales/{partSaleId}/invoice-pdf?estimate=0` and `?estimate=1` |
| Host | `sv8218api.qa.shopview.com` (QA branch **sv8218**, build `v26.35.5-8c3cc21`) |
| Observed | **HTTP 500** on every call, both `estimate` values, on **two different** part sales |
| Body | `{"errors":[{"error":"An error occurred. We're sorry for this inconvenience, please try again a bit later later."},{"requestId":"…"}]}` |
| Request IDs | `082111b5-c42f-4fdb-a6e9-3e40323a9404` (paid P2-123, estimate=0) · `3315d1aa-e294-4ecf-a086-1d7…` (estimate-status part sale, estimate=1) |
| Observed at | 2026-08-31, ~16:45 UTC |

**Part sales used:** `50c51ff1-c5f6-42ba-86ec-d3ce283df81e` (P2-123, status paid, has an invoice)
and `cbce09ff-2bd0-4b56-8977-a3af0384f714` (status estimate).

## Why this is not an id or route mistake

The endpoint resolves `{partSaleId}` through `#[MapEntity('partSaleId')] WorkOrder`, so a
non-resolving id yields **404**, not 500. These calls returned **500**, which means the entity bound
and the failure is inside the handler or the generator. Confirming the id is a real work order:
`GET /api/work-orders/view/50c51ff1-…` returns **200** and reports `"id": "50c51ff1-…"`,
`"number": "P-123"`, `"invoice_id": "e4a295ae-6cb5-4865-9411-1a88cd3dc911"`.

**And the document itself is fine.** The same part sale renders correctly through the general
document route:
`GET /api/invoices/preview?invoice_id=e4a295ae-…&type=html&isEstimate=0|1` → **HTTP 200**, and the
output is a correct Parts Sale Invoice (`Invoice: INV-P2-123`, flat Parts section, no jobs) and
Parts Sale Estimate (`Estimate: EST-P2-123`, `Estimated Total`). **So the template and the data are
working; only the dedicated part-sale PDF endpoint fails.**

## Why it is a CANDIDATE and not a confirmed defect

**All 21 children of SV-8218 are In Progress; not one is Done** (verified live 2026-08-31). Under
**Rules 49 and 60** — and CLAUDE.md §4, *"the branches are NOT final… a gap is possibly-unfinished
rather than automatically a defect"* — a failure on an unfinished story is **provisional**. A 500 is
a server error rather than a missing control, which makes it stronger than a missing-toggle finding,
but it still does not clear the **Rule 94** admissibility gate while the story is open.

**It also does not block any test case.** The 9 Parts Sale cases are build verified through the
general document route, so this is a finding to hand the developer, not an obstacle.

## Draft ticket, for when the hold lifts

- **Type:** `Story Defect` · **Parent:** the owning story **SV-9195** (Story 13 — Parts Sale
  Estimate and Invoice) · **Priority:** `Medium` · also link SV-9195 `relates to` · no Product Area
- **Summary:** `Parts Sale invoice-pdf endpoint returns HTTP 500 on sv8218 (document renders fine via invoices/preview)`
- **Steps to reproduce:** 1. On sv8218, take a part sale with an invoice — P2-123,
  `50c51ff1-c5f6-42ba-86ec-d3ce283df81e`. 2. `GET /api/part-sales/50c51ff1-…/invoice-pdf?estimate=0`.
  3. Repeat with `estimate=1`, and with a second part sale.
- **Expected:** inline `application/pdf` — the Parts Sale Invoice (or Estimate with `estimate=1`).
- **Actual:** HTTP 500, generic error body, request IDs above. The same document renders correctly
  through `GET /api/invoices/preview?invoice_id=e4a295ae-…&type=html&isEstimate=0|1`.
- **Note for the developer:** please check the handler/generator behind route
  `part_sales_invoice_pdf` — the entity binds (a bad id would 404), and the underlying template and
  data are proven good by the working preview route, so the fault looks local to this endpoint.

## What a tester should do meanwhile

Nothing is parked. The 9 Parts Sale cases were verified against the documents captured through the
preview route, which is the path the case steps use.
