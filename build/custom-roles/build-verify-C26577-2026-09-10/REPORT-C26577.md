# Build verification — C26577 (See Financial Data OFF strips pricing from the Work Order PDF)

- **Case:** C26577 — https://shopview.testrail.io/index.php?/cases/view/26577
- **Project/epic:** Custom Roles & Permissions, epic SV-7388; story SV-7523; task SV-7484 (CRP-BE-09 chokepoint).
- **Env:** staging — https://app.staging.shopview.com (build verified live 2026-09-10).
- **Flag:** case is TestRail **Automated** (`custom_atmstatus = 3`) → Rule 71: **observed & reported only; NOT edited** without the QA lead's go-ahead. Author `created_by = 3` (ours), so not Vladimir's — but the Automated flag still gates the write.
- **Purpose (per the QA lead, mid-task):** make sure the case is correct enough that **when automation is written for it, the automation actually works.**

## What the case claims vs. what the build does

| Case says | Build (observed live) | Impact on automation |
|---|---|---|
| A user role with the **"See Financial Data"** toggle OFF, set in **Settings → Roles & Permissions → the role** | ✅ Real & accurate. Route `/administration/roles-permissions/<roleId>/edit`; screen shows **"View mode: Full View / Tech view"** and a **"See Financial Data"** toggle (exact label). | Precondition route is runnable as written. |
| Step 2: request the WO's **PDF from its download endpoint** — the shop-app **"Print / Download PDF"** action on a Work Order (PDF-controller / LinesDetailProvider path) | ❌ **No such action/endpoint.** The WO ⋮ menu offers **"Print Work Order"** only, which calls the browser's `window.print()` on a **printer-friendly view that shows NO pricing for anyone** (a time/labour-hours shop sheet — same doc as suite 6617). There is **no "Download PDF"** control and **no server WO-PDF endpoint** reachable from the UI. | **Automation would fail or falsely pass.** Pointed at "Print Work Order", it tests a document that never carries money. |
| — the money-bearing document | ✅ The **Invoice / Estimate document**: `GET /api/invoices/preview?invoice_id=<id>&type=pdf` (or `type=html`). This is a "PDF path" SV-7484 covers. | This is the endpoint automation must target. |
| Step 3–4: open the PDF and **search its text for money** | ⚠️ The generated **PDF has no text layer** (`pdffonts` empty) — a text search finds **0 hits even for a Fin-ON admin**. | **False pass risk.** Automation must assert on **`type=html`** (real text) or the JSON payload, not PDF text. |
| Expected: Fin-OFF user sees **no pricing** | ✅ **Confirmed on the money-bearing document** (below). | Behaviour is correct; only the *how-to-observe-it* is wrong in the case. |

## The core behaviour IS correct (proof)

Same paid work order (S2-32273, invoice `7d7cc1da…`), invoice document via `/api/invoices/preview?...&type=html`:

| Caller | See Financial Data | Money in the document |
|---|---|---|
| Admin | ON | **11 figures** — $464.86 (labour), $48.81 (shop supplies), $513.67 (subtotal), $25.68 (tax), **$539.35 (total)** |
| Technician role | **OFF** | **0 — fully stripped** ✅ |

The Technician role has `seeFinancialData = false`, so it satisfies the case's precondition ("a role with See Financial Data OFF") exactly.

## Secondary finding — a small leak (worth a separate look)

In the **Work Order view payload** (`/api/work-orders/view/<id>`, the `/lines` screen data), a Fin-OFF user gets the totals zeroed (`total_cost`, `sub_total`, `labour` → 0.00) **but the tax object still carries a dollar amount** (`tax.amountTotal = 37.29`, `tax.rates[0].amount = 37.29`). The **invoice document render is clean**, so this does not fail C26577, but it is a real financial-data leak on the WO API and may deserve its own ticket.

## Attribution note (honest limit)

The Fin-OFF principal I ran as (Technician) is also `view_mode = tech`. A full-view user with **only** See Financial Data off would prove the chokepoint is `seeFinancialData` and not tech-view. A ready-made such role exists on staging — **role "TEST"**, id `e0e9b247-5432-43e8-9e35-f0c9bf3ade16` (`view_mode: full`, `seeFinancialData: false`). I could not bind it to a live login this run because the tech **staff id has drifted** (the `/api/staff/{id}/change` id in `staging-restore-tech.mjs` now 404s and `/api/staff` lists 0). The server-side invoice renderer keys off `seeFinancialData` (that IS the SV-7484 chokepoint) and `view_mode` is a front-end concern, so the result is strongly attributable — but binding role "TEST" to the automation's test user closes the last gap.

---

## Five-table summary

### 1 — DONE
| Item | Evidence |
|---|---|
| Precondition route + labels confirmed live (Settings → Roles & Permissions → View mode Full/Tech + "See Financial Data" toggle) | evidence/roles_real.png, test_role_edit.png |
| Money-bearing document identified + behaviour proven (admin money / Fin-OFF none) | evidence/money-comparison.txt |
| WO "Print Work Order" identified as client-side window.print of a no-money printer-friendly doc | wo_menu_admin.png + print-to-PDF (0 money both roles) |
| Invoice PDF confirmed to have no text layer | pdffonts empty; pdftotext 0 hits on admin |
| Staging browser login (sv_sso_session alone past Cloudflare) proven working | boot2 landed on /workorders, 42 perms admin |

### 2 — LEFT (to make the case automation-ready)
| Item | How to finish (concrete) |
|---|---|
| Correct C26577 Steps to the real document + assertion | Apply the proposed rewrite in `PROPOSED-CASE-C26577.md` (retarget to `/api/invoices/preview?invoice_id=<id>&type=html`, assert no `$` for the Fin-OFF user; drop "search the PDF text"). **Needs QA-lead go-ahead — Automated case (Rule 71) + Rule 65 Vlad notice on write.** |
| Prove isolation on a full-view Fin-OFF login | Bind role "TEST" (`e0e9b247…`) to the automation's test user, or fix the tech staff id in `staging-restore-tech.mjs`, then re-confirm 0 money. |

### 3 — BLOCKED (and what it does NOT block)
| Blocker | Does NOT block |
|---|---|
| Live full-view-Fin-OFF isolation (tech staff id drifted; `/api/staff` empty) | The verdict itself — proven with the Technician (Fin-OFF) user, which satisfies the precondition; and role "TEST" is ready for the automation engineer |

### 4 — HOW TO UNBLOCK
- Get the current tech staff id from the Staff settings page (row → edit URL) and update `staging-restore-tech.mjs`; then assign role "TEST" and re-run the invoice-HTML money check.

### 5 — HANDOFF-READY
**NO — not until C26577's steps are corrected (and that needs your go-ahead because it is an Automated case).** The *behaviour* passes; the *case text* would make the automation test the wrong document with an untestable assertion.

## OUTSTANDING — what I need from you
1. **Go-ahead to correct C26577** (Automated case, Rule 71). It currently tells automation to download a WO "PDF" and grep its text — on this build that document (a) isn't a server PDF, (b) never shows money, and (c) has no text layer. Corrected version ready in `PROPOSED-CASE-C26577.md`: target the invoice/estimate document `type=html`, assert no `$`. **If yes:** I apply it and file the Rule 65 Vlad notice. **If no:** the case stays as-is and any automation built on it will fail or falsely pass. Cost of silence: the manual/automated test is unreliable.
2. **The tax-amount leak** (`tax.amountTotal` visible to a Fin-OFF user on the WO API) — want it raised as its own finding/ticket, or left for now?
