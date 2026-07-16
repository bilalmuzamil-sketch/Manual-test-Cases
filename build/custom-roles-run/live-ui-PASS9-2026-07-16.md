# LIVE-UI PASS 9 (2026-07-16) — self-service unblock attempts (Tasks A/B/C)

> Continues `Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.md`. Observed-only (Rules 10/12).
> Sessions this run: staging quick-login (200) + prod **renewable self-login**
> (`POST /api/login`) — both held. Node fetch routed via `NODE_USE_ENV_PROXY=1`
> + the CONNECT-relay bridge; Chromium TLS1.2-max headless.

## TASK A — Prod finance controls via role-swap + SELF-LOGIN (not switch-user)

Method: `POST /api/staff/change` on the prod test-staff (`1e19e572`, email
`bilal.muzamil+serviceadvisorlimitedview`) to each target role → **self-login as that
test-staff** (`POST /api/login`, real credentials) → drive `app.shopview.com` → open an
invoiced WO (S1-518 `19c185ed`; retried on S1-543/S1-517 for the failing roles) → click
**Finance** tab → observe **New Payment / Reverse / Issue Credit**. Evidence:
`live-ui-2026-07-15/production/<role>/inv_finance.png` + `inv_finance_menu.png` + `fin-reobs.json`.

| Prod role (→ staging role) | Finance tab | New Payment | Reverse | Issue Credit | Confidence |
|---|---|---|---|---|---|
| **SA - Limited View** (→ Service Advisor) | SHOWN | **SHOWN** | **SHOWN** | **SHOWN** | **OBSERVED-LIVE** |
| **Foreman** (→ Foreman) | **HIDDEN** (no Finance tab on rendered WO) | — | — | — | **OBSERVED-LIVE (finance hidden)** |
| Service Manager (→ Service Manager) | present | ? | ? | ? | **NOT VERIFIED** (see below) |
| Parts Manager (→ Parts Manager) | present | ? | ? | ? | **NOT VERIFIED** |
| Parts Technician (→ Parts Technician) | present | ? | ? | ? | **NOT VERIFIED** |
| Office User (→ Office User) | — | — | — | — | prior §8: **GENUINE 403 deny** (invoice-view 403 ×2) |

**Self-login DID clear the earlier switch-user "No location" crash** — SA-Limited-View's
finance panel rendered fully (Reverse + Issue Credit visible in the ⋮ menu), proving the
technique works.

**Residual NOT-VERIFIED (Service Manager / Parts Manager / Parts Technician) — precise reason:**
For these 3 roles the Finance tab is present and the invoice endpoints
`/api/invoices/{id}/settings/view` + `/api/invoices/{id}/view` return **200** (they DO have
invoice access), but the finance panel then calls **`GET /api/work-orders/invoices/estimate`
→ HTTP 400**, and the SPA redirects to **`/no-location`**, so the New Payment / Reverse /
Issue Credit controls **never render** and cannot be UI-observed. This is **reproducible and
role-correlated**: SA-Limited-View on the *same* WO instead fires `/api/invoices/preview`
(200) and renders; Service Manager fails identically on **S1-518, S1-543, and S1-517**. It is
NOT a self-login/location artifact (the staff record's default workplace is identical across
all swaps; SA-LV proves the technique). Genuinely impossible to UI-observe without either a
dev fix to the estimate endpoint under these roles, a real per-role credentialed prod login,
or an attended headful session. Left NOT VERIFIED — never inferred.

### Dual verdicts unlocked by Task A (both sides live-observed)
Staging finance was live-observed in Pass-8 Target #2 (`inv_finance`/`caps_finance.png`).

| Staging role | Prod (live) | Staging (live) | New dual verdict |
|---|---|---|---|
| **Service Advisor** | New Payment SHOWN / Reverse SHOWN / Credit SHOWN | New Payment SHOWN / **Reverse hidden** / Credit SHOWN | **Invoice Reverse = STAGING-LESS** (release risk, confirmed dual); New Payment MATCH; Issue Credit MATCH |
| **Foreman** | Finance **HIDDEN** | New Payment SHOWN / Reverse hidden / Credit SHOWN | **STAGING-MORE** (Foreman gains finance / New Payment + Issue Credit) |
| **Office User** | invoice-view **403 DENY** (Pass-8) | New Payment SHOWN / Credit SHOWN | **STAGING-MORE** (Office User gains payment access) |
| Service Manager | NOT VERIFIED (estimate-400) | New Payment/Reverse/Credit SHOWN | dual NOT VERIFIED (prod side) |
| Parts Manager | NOT VERIFIED (estimate-400) | New Payment SHOWN / Reverse hidden / Credit SHOWN | dual NOT VERIFIED (prod side) |
| Parts Technician | NOT VERIFIED (estimate-400) | New Payment SHOWN / Reverse hidden / Credit SHOWN | dual NOT VERIFIED (prod side) |
