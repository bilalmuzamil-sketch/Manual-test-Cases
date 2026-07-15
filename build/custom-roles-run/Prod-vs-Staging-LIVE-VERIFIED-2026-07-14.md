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
