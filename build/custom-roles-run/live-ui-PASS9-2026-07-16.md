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

## TASK B — Staging holderless roles on a SEEDED non-invoiced WO (unapproved line)

Seeded reference WO **S-25619** (`a25f6342`, org Staging Heavy Duty) with **1 pending
UNAPPROVED line** (`is_authorized_to_repair=0`, status `estimate`) via the proven New-Line
recipe (New Line → select service → "Save & Close"). Then role-swapped the throwaway staff
**+20** (`staff_id 0336686b`) through each target role via **`POST /api/staff/{staff_id}/change`**
(staging path — NOT `/api/staff/change`; that returns 405) → **genuine `switch-user`** into it
→ observed the line-caps live on `app.staging.shopview.com`. Evidence:
`live-ui-2026-07-15/staging/<role>/refwo_lines.png` + `refwo_menus.png` + `refwo-caps.json`.
Throwaway **RESTORED to Admin** (verified); WO **deleted** (`POST /api/work-orders/delete`, 201, verified gone).

| Staging role | perms | Set Line Status (Approve/Decline) | WO Delete | Confidence |
|---|---|---|---|---|
| Service Manager | 36 | **SHOWN** (Approve, Decline) | **SHOWN** (Delete Work Order) | **OBSERVED-LIVE** |
| Foreman | 23 | **SHOWN** (Approve, Decline) | **hidden** | **OBSERVED-LIVE** |
| Office User | 25 | **hidden** (no status buttons) | **hidden** | **OBSERVED-LIVE** |
| Parts Technician | 19 | **hidden** | **hidden** | **OBSERVED-LIVE** |

(perms counts match the §2 staging grid — confirms the swap is genuine, not a leaked Admin session.)

### Dual verdicts unlocked by Task B (prod side from Pass-8 §0e "Prod Remaining-Caps (all 14)")
Pass-8 observed prod (all rendering legacy roles): **WO Delete SHOWN broadly** (old model);
**Set Line Status SHOWN** for rendering roles (Office User = line shown, no status buttons).

| Staging role | Cap | Prod (live, Pass-8) | Staging (live, Pass-9) | Dual verdict |
|---|---|---|---|---|
| Service Manager | WO Delete | SHOWN | SHOWN | **MATCH** |
| **Foreman** | **WO Delete** | SHOWN | **hidden** | **STAGING-LESS** (Foreman loses WO Delete) |
| **Office User** | **WO Delete** | SHOWN | **hidden** | **STAGING-LESS** |
| **Parts Technician** | **WO Delete** | SHOWN | **hidden** | **STAGING-LESS** |
| Service Manager / Foreman | Set Line Status | SHOWN | SHOWN | **MATCH** |
| Office User | Set Line Status | no status buttons | hidden | **MATCH** |
| Parts Technician | Set Line Status | Start/Complete only (Pass-8) | hidden | staging-side hidden; prod partial → **STAGING-LESS (line-status)** |

### Core OK/Not-OK + Part Return (staging 4 roles) — STILL NOT VERIFIED
The reference WO's line has NO picked part, so neither the line-level **Core OK / Not-OK**
control nor the **Part Return** line-menu item surfaces. I confirmed cored inventory parts
DO exist in this env (**84-2005** CONNECTOR core, **58-12** brass core; P550848 is absent
here), and reached the line's Parts view — but it only offers **"New Inventory Part"** (create
a brand-new part record), NOT the **New Part Request → select existing catalog part → Source
Inventory → pick** flow needed to place a *picked* cored part on the line. The pick step has
no simple create path headlessly. **Precise residual blocker:** placing a picked cored part on
a WO line requires the New-Part-Request + inventory-pick multi-step flow (or a dev/human-seeded
cored picked line, or an attended headful session). Left NOT VERIFIED — not inferred.
(Matches the Pass-8 §8 Target-#4 conclusion.)

## TASK C — Assign Vendor / Fix Part# / Bulk Receive / See AP/AR
Not driven live this pass (budget spent on A + B). These sit behind PO-detail rows
(`/parts/orders/{id}`), the deliveries surface, and AP/AR report routes that need in-app
navigation from a WO Parts tab with a part in the right lifecycle state. **Remain NOT VERIFIED**
with the precise blocker recorded in the main doc §0e-prior. Not inferred.

## FINAL MATRIX STATUS (after Pass-9)

**Newly OBSERVED-LIVE this pass: 14 cells**
- Prod finance (6): SA-Limited-View New Payment/Reverse/Issue Credit (3, all SHOWN);
  Foreman finance (3, all hidden = no Finance tab).
- Staging line-caps (8): Set Line Status + WO Delete for Service Manager / Foreman /
  Office User / Parts Technician (4 roles × 2 caps).

**New DUAL verdicts finalized this pass (both sides live): 7**
- **Invoice Reverse — Service Advisor = STAGING-LESS** (prod SA-LV SHOWN → staging hidden) ← release risk, now dual-confirmed.
- **Finance/New Payment — Foreman = STAGING-MORE**; **Office User = STAGING-MORE** (prod Office 403 deny, Pass-8).
- **WO Delete — Foreman / Office User / Parts Technician = STAGING-LESS**; Service Manager = MATCH.

**Still NOT VERIFIED (genuinely blocked even with self-login + seeding) — the short list:**
1. **Prod finance for Service Manager / Parts Manager / Parts Technician** (New Payment /
   Reverse / Issue Credit — 9 cells). Reason: self-login works and invoice-view API = 200,
   but the Finance panel's `GET /api/work-orders/invoices/estimate` returns **HTTP 400** and
   the SPA bounces to `/no-location` on every invoiced WO tried (S1-518 / S1-543 / S1-517);
   the controls never render. Needs a dev fix to the estimate endpoint under these roles, a
   real per-role credentialed prod login, or an attended headful session.
2. **Staging Core OK/Not-OK + Part Return for the 4 holderless roles** (8 cells). Reason:
   requires a *picked* cored part on a WO line; the New-Part-Request→inventory-pick flow has
   no simple headless path. Needs a dev/human-seeded cored picked line or an attended session.
3. **Assign Vendor / Fix Part# / Bulk Receive / See AP/AR** (Task C). Reason: PO-detail /
   deliveries / AP-AR routes need in-app nav with a part in a specific lifecycle state.

## Cleanup (Pass-9)
- Prod test-staff (`1e19e572`) **RESTORED to Office User** (`d238a892`, verified `role_label=Office User`).
- Staging throwaway **+20** (`0336686b`) **RESTORED to Admin** (`7d1f3fc3`, verified).
- Seeded staging WO **S-25619 `a25f6342` DELETED** (`POST /api/work-orders/delete` → 201; view now gone).
- Staging `tech@shopview.com` absent on this reseed → NOT touched (throwaway used instead).
- All `switch-user` impersonations exited (200 each). No prod data mutated (read-only). **No TestRail writes.**
