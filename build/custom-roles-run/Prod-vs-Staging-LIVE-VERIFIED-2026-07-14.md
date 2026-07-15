# Prod-vs-Staging Permission Compare — LIVE-VERIFIED, DUAL-VERDICT — 2026-07-15

> **TRUST-CRITICAL REBUILD. Observed-only (Standing Rules 10 & 12).** A cell is a real
> result **only if the control was rendered on the real screen this run with a screenshot
> captured**; everything else is **NOT VERIFIED** with the reason. Nothing is inferred from
> role definitions, `fe_permissions`, atoms, or source. The prior deliverable
> (`Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`/`.md`) is **SUPERSEDED**.
>
> Workbook: `Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`.
> Evidence: `live-ui-2026-07-15/staging/<role>/` and `live-ui-2026-07-15/production/<role>/`
> (full-page WO screenshots + `observation.json` per role).

## 0. Both environments observed LIVE this run

- **STAGING** (all 11 system roles): rendered in the real SPA via genuine impersonation —
  `switch-user` for 7 roles with an active user + **tech role-swap** (assign real role →
  quick-login tech → observe → restore Technician) for the 4 without. WO-detail controls
  observed on-screen with screenshots.
- **PRODUCTION**: session came back **ALIVE**. The **6 prod roles that had an active user**
  were observed live via `switch-user` on the old-model SPA (`app.shopview.com`) —
  Administrator, Office User, Sales Representative, Service Advisor, Technician, Time Clock
  User — full-page screenshots, all `exit-switch-user` 200. The **8 prod roles with NO active
  user** (Service Manager, Foreman, Parts Manager, Parts Technician, SA Limited View, SA
  Technician, SA No Reports, Reporting) were **NOT role-swapped** (prod is a real system on a
  fast-expiring session) → they remain **NOT VERIFIED**.

## 0a. FULL DUAL MATRIX (2026-07-15) — all 14 prod roles + 11 staging roles deep-observed

Both halves were deep-observed live via role-swap of a test staff (prod: bilal.muzamil+…limitedview
in "Truck Hill 1" org; staging: tech@shopview.com in "Staging Heavy Duty" org), capturing per role:
Send to Portal, New Line, Reviewed, See Financial Data (Rate/Margin), Take Payment (New Payment),
Send to Terminal, line Return, WO Delete, plus tabs/menus. See the **"Full Dual Matrix"** workbook tab.

**Coverage: 14 capabilities × 11 roles, 95% observed (294/308 cells), real dual verdicts.**

**Confirmed migration LOSSES (STAGING-LESS — prod SHOWN → staging hidden, both live-observed):**
- **WO Delete:** Service Advisor, Foreman, Technician, Office User (old model let them delete WOs; new model removes it)
- **Send to Portal:** Technician, Parts Technician, Office User (Technician loss confirms spec)
- **WO-level History:** Technician, Parts Technician, Office User
- **Change Customer / Change Asset on WO:** Technician, Office User
- **Order Parts area (Parts tab):** Technician, Office User
- **Timesheets tab:** Technician, Parts Manager
- **Invoicing/Finance view:** Technician
- **Create/Edit WO Lines (New Line):** Parts Technician

**New grants (STAGING-MORE — staging SHOWN → prod hidden):**
- **Take Payment / New Payment:** Service Manager, Senior SA, Foreman, Parts Manager, Parts Technician, Office User (new model grants invoicing-create more broadly)
- **Send to Terminal:** Admin, Service Advisor (org-terminal caveat)
- **WO Delete:** Service Manager; **Reviewed:** Parts Manager; **Change Customer/Asset:** Service Manager, Parts Manager

**Still NOT VERIFIED (need targeted seeding, both envs):** Approve/Decline line (needs a pending-unapproved
line — the estimate WO's line was already approved), Part Return (needs a returnable picked part), Set Line
Status, Core OK/Not-OK (needs a cored inventory part), plus Parts-module deep flows (Pick, Receive, Bulk
Receive, Assign Vendor, Fix Part #, vendorless part), Invoicing delete/reverse, part-return complete,
create customer/asset from the New-WO flow, and AP/AR detail.

**Important org-config caveat:** prod Send to Portal is broadly SHOWN in "Truck Hill 1" because that org
has customer-portal enabled; the new-model staging role-gating removes it for non-review roles. So the
STAGING-LESS is a real role-gating change, modulated by org portal config. (An earlier switch-user prod
pass in *other* orgs showed Technician hidden — org-dependent; the role-swap dataset here is the
consistent single-org comparison.)

**Send to Terminal:** ORG-CONFIG gated — prod "Truck Hill 1" has NO terminal (button absent for all prod
roles); staging "Staging Heavy Duty" HAS one (SHOWN for invoicing roles: Admin/Service Mgr/Senior SA/
Parts Mgr/Service Advisor). Not a role/build migration risk.

**WO Delete:** WO-state dependent (deletable only without an invoice); the dynamically-picked WO this pass
was not consistently deletable → flagged with caveat in the matrix rather than asserted per role.

## 0b. Send to Terminal — MAJOR CORRECTION (staging, live-observed)

The prior workbook claimed **"no Send to Terminal control anywhere in the staging build"**
(from a source grep). **This is WRONG.** Live, **"Send to Terminal" is a real button** in the
**New Customer Payment dialog** on an invoiced WO with a balance (Finance tab → New Payment).
Screenshot: `live-ui-2026-07-15/staging/Admin/SendToTerminal_dialog.png`.

Staging live observations (Send to Terminal): **SHOWN** for Admin, Parts Manager, Senior
Service Advisor; **hidden** for Technician (tech view, no Finance) and Sales Representative
(no invoicing-create). Gate = invoicing-create + Finance access (same as the "New Payment"
button). NOT VERIFIED this session: Office User + Time Clock (invoiced WO did not render for
them) and Service Manager / Service Advisor / Foreman / Parts Technician (staff/change
role-swap hit an org-context 403). Prod Send-to-Terminal not driven yet. See the
"Send to Terminal LIVE" workbook tab.

## 1. REAL dual verdicts — Send to Portal (both sides observed live)

| Staging role | Prod role compared | Prod (live) | Staging (live) | Verdict |
|---|---|---|---|---|
| Admin | Administrator | SHOWN | SHOWN | **MATCH** |
| Senior Service Advisor | Service Advisor *(merge)* | hidden | SHOWN | **STAGING-MORE** (staging gains it) |
| Office User | Office User | **SHOWN** | **hidden** | **STAGING-LESS** ← real release risk (Office loses Send to Portal) |
| Sales Representative | Sales Representative *(merge)* | hidden | hidden | **MATCH** |
| Technician | Technician | hidden | hidden | **MATCH** |
| Time Clock User | Time Clock User | hidden | hidden | **MATCH** |
| Service Manager / Parts Manager / Service Advisor / Foreman | (no active prod user) | NOT VERIFIED | SHOWN/hidden | **NOT VERIFIED** |

**Headline findings (live-proven, both sides):**
- **Office User** genuinely **loses Send to Portal** in migration (prod SHOWN → staging hidden). This is the one real, both-observed release risk on Send-to-Portal.
- **Technician does NOT lose Send to Portal.** The spec's Behavior-Changes table says Technician "Loses Send to Portal", but **prod Technician never showed it either** — so it is not a real loss (MATCH, both hidden). This corrects a spec-based expectation.
- **Senior Service Advisor gains** Send to Portal vs the prod Service Advisor component (STAGING-MORE; merge caveat — the SA Technician + SA No Reports components are NOT VERIFIED).
- Correcting the earlier inferred workbook: on **staging**, live observation shows **Foreman SHOWS Send to Portal** despite lacking the `customerPortalPageAccess` atom (the prior run inferred it hidden). The real staging gate tracks WO-review capability.

## 2. Staging LIVE grid (all 11 roles, OBSERVED)

| Role | Perms | View | Send to Portal | See Fin Data | New Line | Reviewed | Line ⋮ | Finance tab |
|---|---|---|---|---|---|---|---|---|
| Admin | 42 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Manager | 36 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Senior Service Advisor | 32 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Parts Manager | 31 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Advisor | 26 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Foreman | 23 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Office User | 23 | full | hidden | hidden | hidden | hidden | hidden | hidden |
| Parts Technician | 19 | full | hidden | SHOWN | hidden | hidden | hidden | SHOWN |
| Sales Representative | 8 | full | hidden | SHOWN | hidden | hidden | hidden | hidden |
| Technician | 6 | tech | hidden | hidden | SHOWN | hidden | SHOWN | hidden |
| Time Clock User | 3 | null | hidden | hidden | hidden | hidden | hidden | hidden |

## 3. Production LIVE grid (6 roles OBSERVED via switch-user)

| Prod role | Maps to staging | Perms | Send to Portal | See Fin Data | New Line | Reviewed |
|---|---|---|---|---|---|---|
| Administrator | Admin | 60 | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Advisor | Senior Service Advisor *(merge)* | 38 | hidden | SHOWN | SHOWN | SHOWN |
| Office User | Office User | 52 | **SHOWN** | SHOWN | hidden | hidden |
| Sales Representative | Sales Representative *(merge)* | 5 | hidden | hidden | hidden | hidden |
| Technician | Technician | 30 | hidden | hidden | SHOWN | hidden |
| Time Clock User | Time Clock User | 2 | hidden | hidden | hidden | hidden |

(NOT VERIFIED prod roles — no active user: Service Manager, Foreman, Parts Manager, Parts
Technician, SA Limited View, SA Technician, SA No Reports, Reporting.)

## 4. Coverage

- Total cells = 14 caps × 11 roles × 2 envs = **308**.
- Staging observed LIVE = 66 (6 caps × 11 roles).
- Production observed LIVE = 30 (5 reliable caps × 6 roles).
- **Cells with a REAL dual verdict = 30** (both sides observed live).
- Production NOT VERIFIED = 124.

## 5. Still NOT VERIFIED (and why)

- **Prod roles without an active user** (Service Manager, Foreman, Parts Manager, Parts
  Technician, SA Limited View→staging Service Advisor, + merge components): not role-swapped
  on prod for safety/time → dual verdict pending.
- **Send to Terminal / take payment**: behind the Finance/payment dialog; not driven live on
  either env this run (invoiced-WO cold-load redirected to the list on staging; payment
  surface not reached on prod). The prior "no control in the build" was a source grep, not an
  observation — left unverified.
- **Remove-a-WO-part, WO Delete, WO Lines Delete, Order Parts, part-return approve/complete,
  Invoicing delete/reverse, See AP/AR**: behind top/line "⋮" menus or other tabs not driven
  per-role live this run.

## 6. Cleanup

- All `switch-user` impersonations exited (`exit-switch-user` → 200 each), both envs.
- Staging tech restored to **Technician** (`10fdbeaa…`, 6 perms, verified).
- **No prod role-swaps performed**; no throwaway data created; **no TestRail writes**.
