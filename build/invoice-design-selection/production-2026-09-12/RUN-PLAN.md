# Invoice Design Selection — production run: the plan, the routes, and what is already known

Prepared 12 September 2026, before the feature lands on production.
Production build **as of 17:36 today: `v26.36.4-3e1c643`** (read from `meta[name=app-version]`).
That is the **before** marker — when it changes, the deploy has landed.

## 0 · The one thing blocking the start

`POST https://api.shopview.com/api/login` for the recorded account answers
**401 `{"error":"Invalid credentials."}`**, and the login screen still renders a real email+password
form (so the route has NOT moved to SSO, unlike staging). The recorded password no longer works.
Proved through `blocker_gate.py`, 7 of 7 — `BLOCKER-CLAIM-prod-login.json`.
**What it does not block:** nothing else here. The plan, the probes and the case-to-route map below
are all written and ready; only the sign-in is missing.

## 1 · Scope and the standing rules that still apply

The QA lead's instruction (12 Sep): production is also a dummy test account; seed, delete or change
data as needed to complete the run. That matches Rule 6, which already lists **prod test orgs** as
disposable. Rule 107's closing line — *"production is not a test environment"* — is about the
production **system**, and it is not overridden here: the licence covers **this test organisation
only**, everything is tagged `ZZAUTOTEST`, and anything not the point of the test is restored.

Untouched, as always: no Jira ticket without his go-ahead (62) · no TestRail write without his
go-ahead (6) · Vladimir Tomovic's cases never (38) · Automated cases held (71) · secrets never
committed (82).

## 2 · What is already proven, and therefore not to be rediscovered

Everything below was established on the sv9872 QA branch (11 Sep) and on Staging (12 Sep). None of it
needs re-finding; only the record ids change.

### The setting
| Thing | Value |
|---|---|
| Where a person changes it | Settings → **Invoice** tab |
| Read it | `GET /api/organizations/invoice-settings/view` → `data.documentDesign` (`legacy` \| `modern`) |
| Change it | `POST /api/organizations/invoice-settings/change-design` `{documentDesign:"legacy"|"modern"}` |
| It is organisation-wide and live | no document captures or is pinned to a design |

**The shared-environment guard, mandatory on every reading:** read the stored value immediately
before and immediately after each observation and discard any reading that drifted. On staging this
ran to 0 discards across four passes. Pattern in `../staging-2026-09-12/S9_run.mjs`.

**`setDesign` must verify and retry.** An anchored option matcher silently failed once and three
"different" documents were rendered under one design. Always read the value back, up to 3 attempts,
and log loudly if it never takes.

### Telling the two looks apart, mechanically
| | Legacy (old) | Modern (new) |
|---|---|---|
| Section headings | sentence case — `Bill To`, `Remit payment to`, `Line Total` | capitals — `ADDRESSES`, `BILL TO`, `REMIT PAYMENT TO`, `SCOPE OF WORK`, `SUMMARY`, `BALANCE` |
| Totals block | bottom right, plain rows | moved up, boxed `BALANCE` |
| Test | `/BILL TO\|REMIT PAYMENT TO\|SUMMARY\|ADDRESSES\|SCOPE OF WORK/` on the document text |

**Compare money as a SET, both ways** (`onlyInLegacy` / `onlyInModern`, both empty). A naive list
compare produced a phantom "figures differ" twice — it was a duplicate `$0.00` in one layout.

### Document surfaces and how to reach each one
| Document | Route |
|---|---|
| Invoice / estimate | Work Orders → the work order → **Finance** tab (`/workorders/<id>/finance`) |
| Parts sale | Parts → **Part Sales** |
| Credit memo / credit invoice | raised from an invoice's **Issue Credit**; viewed under Customers → the customer → **Invoices** |
| Find customers with credits cheaply | customer field `part_sale_credit_count`; work-order field `has_part_sale_credits` |
| Credit memo PDF | `credit-memos/<id>/pdf` |
| Portal invoice | `<portal>/invoices/<id>`; printable document `<portal>/invoices/<id>/preview` |
| Portal invoice **with the paid banner** | `<portal>/invoices/<id>/preview?include_receipt=1&payment_id=<id>` — needs a **succeeded ShopPay payment**; find the pair in the portal Payments list (`status==='succeeded' && invoice_id && !is_batch_payment`) |
| Portal payment receipt | `<portal>/payments/<id>/receipt` |

### The customer portal
Two calls, not one: `POST /api/token` → `data.accessToken`, then
`POST <portal>/sso-login` with `Authorization: Bearer <token>` and `{"returnJson":true,"portalType":"customer"}`.
Works from cookies alone; the shop SPA does not need to render.
Portal lists parse from `script[data-page]` → `props.invoices.data` / `props.payments.data`.
**On production the portal host is `portal.shopview.com`** (staging is `staging.portal.shopview.com`).

### Producing the "PDF" a customer gets
The portal has no PDF endpoint. The printer control opens `/invoices/<id>/preview` in a new tab; that
page **is** the printable document and the PDF is the browser's own Save as PDF. Capture it with the
print engine, never a fetch:
`await page.emulateMedia({media:'print'}); await page.pdf({path, format:'Letter', printBackground:true});`
Read the result with **pymupdf**, not `pdf_text.py` (which returns empty for browser-printed PDFs),
and render a page to PNG when the thing being checked might be a graphic.
The saved file's name is `document.title` = `<Company Name> - <work order number> - Invoice`.

### Traps that cost time and must not be paid for twice
1. **`limit=300` silently caps at 100.** Page with `pagination[page]` / `pagination[rowsPerPage]`.
2. **Never call `POST /api/iam/change-location`** — returns 200 and leaves the session with no
   customers and a null location bar. A fresh boot recovers.
3. **List rows are `<tr>`, not links.** An `a[href]` scan returns zero on a full page.
4. **Never exclude a container by class substring** when enumerating controls — `[class*=sidebar]`
   matches the whole layout shell and returns "0 controls".
5. **After the second guessed 404, grep the served bundle** instead of guessing a third.
6. A control that looks missing is usually a **record that does not qualify** for it.

## 3 · Production-specific facts and what must be re-established

| | |
|---|---|
| Shop app | `https://app.shopview.com` · API `https://api.shopview.com` |
| Portal | `https://portal.shopview.com` (to be confirmed on the first pass) |
| Entry | real `POST /api/login` — **no DEV MODE quick-login on production, it 500s there** |
| Log in **once** per run | a second login for the same user expires the first session (409) |
| Bridge | required for every navigation; port rotates, read `/tmp/atlassian/bridge-port.txt` |
| Node | run with the egress variable set, or Node's `fetch` is refused by the allowlist |
| Recorded test org | workplace **Trucks Hill 2** has canned lines — seed work orders there |

**To be read live on the first pass, never assumed:** the organisation name, its locations, the
document numbering, which customers have portal access, and whether ShopPay is enabled (the paid
banner needs a succeeded portal payment; if production has none, one must be seeded or the case is
reported honestly as not observed).

## 4 · The order of work once the deploy lands

1. Read `meta[name=app-version]`; confirm it has moved off `v26.36.4-3e1c643`.
2. Read `documentDesign`. Record the value found — **it is restored to exactly this at the end.**
3. Inventory the records the suite needs, in one pass: an invoice, an estimate, a parts sale, a
   credit memo, a paid invoice, a portal-paid invoice with its payment id, a payment receipt.
   Seed only what is genuinely missing, tagged `ZZAUTOTEST`.
4. Run the document comparisons under both designs, guarded, capturing evidence per case.
5. Run the portal cases last (they need the token + SSO chain).
6. Push results with `push_results_to_run.py` — dry-run first, one file per batch.
7. Restore the setting, report, and say what was seeded and what was cleaned up.

**Everything that does not need the feature can be done before the deploy** — steps 1 and 3 in
particular. That is what the sign-in is being asked for.
