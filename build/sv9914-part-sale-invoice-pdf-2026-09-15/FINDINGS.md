# SV-9914 — `GET /api/part-sales/{id}/invoice-pdf` returns 500 on every call

**Verdict: PASSED.**

Milomir's comment pointed at the QA env and the part sale to use; Minja's note in Slack gave the exact
acceptance signal — the file name the browser is handed changes between `part-sale-invoice.pdf` and
`part-sale-estimate.pdf`, and on `main` all three calls give a 500.

## Environments and build markers

| | Web | API | Build (app-version) | `index.html` last-modified / etag |
|---|---|---|---|---|
| Fix branch | `sv9914.qa.shopview.com` | `sv9914api.qa.shopview.com` | **v26.36.7-2e03bc9** | Tue 15 Sep 2026 15:54:13 GMT / `58705708dc7178fd1dbf415d538e653c` |
| Production (the "before") | `app.shopview.com` | `api.shopview.com` | **v26.36.7-cf5012e** | `b5f3b4831b5cc6f505a8c477b2fceec3` |

Test data: part sale **P9914-147**, id `0ff71593-ccc3-4d1c-af74-5b958c5950f6`, customer *Beltsville
Diesel Repair*, status **Paid**, total **$20,104.05**, invoice **INV-P9914-147**, invoice id
`60312f2e-3d2b-444b-a688-0035a484c596`. Signed in with Dev Mode → Quick Login → Admin, as the ticket
steps say.

## BEFORE — production

Nine combinations, all **500** `application/problem+json`:

| id | no parameter | `?estimate=0` | `?estimate=1` |
|---|---|---|---|
| `0ff71593-…` (the real one) | 500 | 500 | 500 |
| `00000000-0000-0000-0000-000000000000` (does not exist) | 500 | 500 | 500 |
| `not-a-uuid` (malformed) | 500 | 500 | 500 |

```
{"errors":[{"error":"An error occurred. We're sorry for this inconvenience, please try again a bit later later."},
           {"requestId":"59ec3178-6804-4415-9fa1-22dcbb1b3e07"}]}
```

Production masks the detail, but **a non-existent id and a malformed id fail identically to a real
one** — which confirms the ticket's diagnosis directly: the failure happens at argument resolution,
before the controller ever looks the part sale up.

## AFTER — fix branch

```
GET .../invoice-pdf                -> 200  application/pdf; charset=UTF-8  87,013 bytes  %PDF-1.7
GET .../invoice-pdf?estimate=0     -> 200  application/pdf                 87,014 bytes  %PDF-1.7
GET .../invoice-pdf?estimate=1     -> 200  application/pdf                 87,486 bytes  %PDF-1.7
```
Verbatim headers:
```
content-disposition: inline; filename="part-sale-invoice.pdf"     (no parameter, and ?estimate=0)
content-disposition: inline; filename="part-sale-estimate.pdf"    (?estimate=1)
```
Exactly the filenames Minja's steps name.

### The parameter still does its job

Not just typed away — the two documents genuinely differ (text extracted from the returned PDFs):

| | invoice (`no parameter` / `?estimate=0`) | estimate (`?estimate=1`) |
|---|---|---|
| heading | `Invoice:` **INV-P9914-147** | `Estimate:` **EST-P9914-147** |
| dates | `Invoice date: Sep 15, 2026`, `Paid date: Sep 15, 2026` | `Estimate date: Sep 15, 2026` |
| money block | `Payments` · `Sep 15, 2026 - E-transfer $20,104.05` · `BALANCE $0.00` | `ESTIMATED TOTAL $20,104.05`, no payments, no balance |
| page footer | `INV-P9914-147 - Page 1 / 1` | `EST-P9914-147 - Page 1 / 1` |

Both carry the same six parts and the same `Parts $19,146.72 / GST (5%) $957.33 / Total $20,104.05`.

### Fourteen forms of the parameter, none returned 500

| query | code | bytes | filename | document |
|---|---|---|---|---|
| (none) | 200 | 87,013 | part-sale-invoice.pdf | INVOICE |
| `?estimate=0` | 200 | 87,014 | part-sale-invoice.pdf | INVOICE |
| `?estimate=1` | 200 | 87,486 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=true` | 200 | 87,487 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=false` | 200 | 87,487 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=` (empty) | 200 | 87,013 | part-sale-invoice.pdf | INVOICE |
| `?estimate=abc` | 200 | 87,487 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=2` | 200 | 87,487 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=-1` | 200 | 87,487 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=0.5` | 200 | 87,488 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate[]=1` | 200 | 87,486 | part-sale-estimate.pdf | ESTIMATE |
| `?estimate=1&estimate=0` | 200 | 87,017 | part-sale-invoice.pdf | INVOICE |
| `?ESTIMATE=1` | 200 | 87,014 | part-sale-invoice.pdf | INVOICE |
| `?foo=bar` | 200 | 87,014 | part-sale-invoice.pdf | INVOICE |

### Bad ids now answer properly instead of crashing

```
.../00000000-0000-0000-0000-000000000000/invoice-pdf?estimate=1 -> 400 {"errors":[{"partSaleId":"Not found"}]}
.../not-a-uuid/invoice-pdf?estimate=1                           -> 400 {"errors":[{"partSaleId":"Invalid UUID"}]}
```
This is the clearest proof the resolver now hands off to the controller: the same two ids returned 500
on production.

## Regression — the path the app itself uses

The ticket says the frontend prints and downloads through `invoices/preview`. Driven live on the branch:

* Part sale → **Finance** tab renders the invoice document (**Invoice: INV-P9914-147**) via
  `GET /api/invoices/preview?invoice_id=60312f2e-…` → **200**
* The toolbar **Download** button (`button_download_invoice`) fires
  `GET /api/invoices/preview?invoice_id=60312f2e-…&type=pdf&isEstimate=0` → **200**, and the browser
  downloads **`INV-P9914-147.pdf`**

Unaffected, as the ticket predicted.

Evidence: `ev/raw_fix_finance_tab_regression.png`, `ev/raw_fix_pdf_in_browser_estimate.png`.

## Observation — reported, not raised as a fault

`?estimate=false` and `?estimate=abc` both return the **estimate**: anything other than `0` or an
empty value is treated as "on". That is ordinary behaviour for a switch of this kind, and nothing in
the ticket, or in any other source, says `false` must mean false — so it is a question for the
developer, not a failure. Worth a decision only because this endpoint's stated audience is external
and integration callers.

## Not treated as faults

* `GET /api/api/sso/check` on the branch's login page — doubled `/api` prefix, 404. Pre-existing on
  the QA branches' SSO gate, unrelated to this ticket, no user-visible effect.

## Honest limits

* The **tab title** the ticket steps mention could not be used as the signal: the headless PDF viewer
  titles the tab from the URL segment (`invoice-pdf`) rather than from the file name. The file name
  was taken from the `content-disposition` header instead, captured verbatim above, and the PDF was
  confirmed to render in the browser.
* Production hides the exception detail, so the resolver message quoted in the ticket
  (`PartSaleInvoicePdfRequestDto … constructor parameter estimate should be typed`) was not read back
  from production; the request id is recorded for tracing instead. The behaviour it causes was
  reproduced in full.
* `POST /api/quick-login` was used twice during the pass, which rotates the shared QA session — worth
  knowing if the branch session was in use elsewhere at the same time.

---

## Posted

Pre-post gate at 19:12–19:13Z. **The gate earned its keep:** the first marker read reported the QA
branch as running production's build `v26.36.7-cf5012e`, which read exactly like a redeploy onto the
production build. It was not — both MITM bridges had died, and `curl -o /tmp/i.html` had left the
*previous* pass's bytes in place for the grep to find. Re-read with a fresh `mktemp`, an HTTP-code
check and a non-empty check: branch `v26.36.7-2e03bc9` etag `58705708…`, production `v26.36.7-cf5012e`
etag `b5f3b483…` — both identical to the start of the pass. Lesson recorded in
`build/LESSONS-INDEX.md` and `build/APP-ACTIONS-PLAYBOOK.md` §AC.8.

Comment **76593** on SV-9914 (status Code Review, priority Medium, assignee Milomir Kotlajic).
Read back in ADF: first line `OVERALL QA STATUS: PASSED`, 8 table rows, 5 media nodes all
`type: file` (real attachments), and the `@Milomir Kotlajic` mention resolved.

The `?estimate=false` observation is put to him in the comment as a question — intended as it stands,
or a separate ticket — and is **not** recorded as a failure.
