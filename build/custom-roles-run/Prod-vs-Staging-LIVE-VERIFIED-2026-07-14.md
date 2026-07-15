# Prod-vs-Staging Permission Check — LIVE-VERIFIED — 2026-07-15

> **TRUST-CRITICAL REBUILD.** Observed-only (Standing Rules 10 & 12). The prior
> deliverable (`Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`) presented FE-gated
> capabilities as results that were **inferred** from role definitions / source code —
> it is now **SUPERSEDED**. Here, a cell is a real result **only if the control was
> rendered on the real screen this run with a screenshot captured**; everything else is
> **NOT VERIFIED** with the reason. Nothing is inferred from `fe_permissions`, atoms, or
> source.
>
> Companion workbook: `Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`.
> Evidence: `live-ui-2026-07-15/staging/<role>/` (full-page WO screenshots + `observation.json`).

## 0. Headline

- **PRODUCTION WAS NOT OBSERVABLE THIS RUN.** The supplied prod PHPSESSID returned
  **HTTP 409 "Session has expired."** on every endpoint at the *start* of the run
  (`/api/iam/list-roles`, `/api/organizations/settings`, `/api/staff` — all 409).
  Per the task stop-condition, prod was **STOPPED** and nothing about prod was inferred.
  **Consequence: every production cell = NOT VERIFIED, so NO row carries a real
  prod-vs-staging verdict. A fresh prod cookie is required to finish the comparison.**
- **STAGING was fully observed LIVE.** All 11 staging system roles were rendered in the
  real SPA via genuine impersonation and their WO-detail controls observed on-screen with
  screenshots.
- **KEY LIVE FINDING (corrects the prior inference):** **Foreman SHOWS "Send to Portal"
  live** even though its role lacks the `customerPortalPageAccess` atom. The prior run
  *inferred* Foreman hides it (gate = `customerPortalPageAccess`). Live, the Send-to-Portal
  icon renders for **all 6 roles that can review WOs** and is **absent for the 5 that
  cannot** — the real gate tracks review capability, not the portal-page atom.

## 1. Method (genuine live impersonation)

- **Staging session** stayed alive the whole run (quick-login → authenticated GETs 200).
- Browser bridge = the documented recipe (Node CONNECT-relay reading `$HTTPS_PROXY`
  live + Chromium `--ssl-version-max=tls1.2 --disable-quic --disable-http2`).
- **Per-role rendering:**
  - 7 roles with an active user → **`switch-user` impersonation** (login admin →
    `POST /api/switch-user{user_id}` → the SPA renders with the impersonated user's
    server-provided `fe_permissions` → observe → `POST /api/exit-switch-user`, all exits 200).
  - 4 roles with no active user (Service Manager, Service Advisor, Foreman, Parts
    Technician) → **tech role-swap**: assign the tech fixture user (staff `6fb22c1b…`,
    exact-email-guarded) the real role via `POST /api/staff/{id}/change` → quick-login tech
    (session reflects the real assigned role) → observe → **restored to Technician**.
- **Observation** = presence/visibility of the actual control on the real WO-detail
  screen (ready_for_review WO `S9-25044` and invoiced WO `S9-25382`), plus a full-page
  screenshot per role. "Send to Portal" detected by its real `aria-label="Send to Portal"`
  icon and cross-checked against the captured screenshots as ground truth.

## 2. Staging LIVE grid (all 11 roles, OBSERVED)

| Staging role | Perms | View | Send to Portal | See Fin Data (Rate/Margin) | New Line (WO Lines C&E) | Reviewed | Line ⋮ menu | Finance tab |
|---|---|---|---|---|---|---|---|---|
| Admin | 42 | full | **SHOWN** | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Manager | 36 | full | **SHOWN** | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Senior Service Advisor | 32 | full | **SHOWN** | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Parts Manager | 31 | full | **SHOWN** | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Advisor | 26 | full | **SHOWN** | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Foreman | 23 | full | **SHOWN** (lacks portal atom!) | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Office User | 23 | full | hidden | hidden | hidden | hidden | hidden | hidden |
| Parts Technician | 19 | full | hidden | SHOWN | hidden | hidden | hidden | SHOWN |
| Sales Representative | 8 | full | hidden | SHOWN (Rate/Margin) | hidden | hidden | hidden | hidden |
| Technician | 6 | tech | hidden | hidden | SHOWN | hidden | SHOWN | hidden |
| Time Clock User | 3 | null | hidden | hidden | hidden | hidden | hidden | hidden |

All values above are **LIVE-OBSERVED** with a screenshot in
`live-ui-2026-07-15/staging/<role>/WO_ready_for_review.png`.

## 3. Priority FE-gated / release-critical capabilities — status this run

| Capability | Staging (LIVE) | Production | Notes |
|---|---|---|---|
| **Send to Portal** | **OBSERVED** (6 SHOWN / 5 hidden — see grid) | NOT VERIFIED | trust archetype; live-confirmed; Foreman correction above |
| **See Financial Data on WO** (Rate/Margin) | **OBSERVED** | NOT VERIFIED | shown for full-view financial roles; hidden in tech view |
| **Create/Edit WO Lines** (New Line) | **OBSERVED** | NOT VERIFIED | shown for review roles + Technician(tech view) |
| **Review Work Orders** (Reviewed) | **OBSERVED** | NOT VERIFIED | tracks the review capability |
| **WO line/bulk actions ⋮** | **OBSERVED** | NOT VERIFIED | entry to line-level actions |
| **Send to Terminal** (take payment) | **NOT VERIFIED** | NOT VERIFIED | invoiced-WO Finance/payment dialog not reachable live (cold-load redirected to list). Prior "no control in build" was a source grep, not an observation — left unverified. |
| **Remove a WO part** | **NOT VERIFIED** | NOT VERIFIED | line "⋮" submenu not opened per-role |
| **Delete Work Order** | **NOT VERIFIED** | NOT VERIFIED | in the top "⋮" menu; not opened systematically per role |
| **Delete WO Line** | **NOT VERIFIED** | NOT VERIFIED | line "⋮" submenu not opened per-role |
| **Order Parts** | **NOT VERIFIED** | NOT VERIFIED | Parts-tab action not driven |
| **Part-return approve/complete** | **NOT VERIFIED** | NOT VERIFIED | return flow not driven |
| **Delete/Reverse invoice** | **NOT VERIFIED** | NOT VERIFIED | invoicing delete not driven |
| **See AP/AR data** | **NOT VERIFIED** | NOT VERIFIED | AP/AR surface not navigated live |

## 4. Coverage (capability × role × env cells)

- Total cells = 14 caps × 11 roles × 2 envs = **308**.
- **Staging observed LIVE = 66** (6 caps × 11 roles).
- Staging NOT VERIFIED = 88 (8 caps × 11 roles).
- **Production observed LIVE = 0** (session expired).
- Production NOT VERIFIED = 154.
- **Cells with a dual prod+staging verdict = 0** (prod not observed).

## 5. Cleanup

- All `switch-user` impersonations exited (`exit-switch-user` → 200 each).
- Tech user restored to **Technician** (role `10fdbeaa…`, 6 perms) and verified.
- No throwaway data created; production left untouched (no writes were even possible —
  session dead). No TestRail writes.

## 6. To finish the comparison

Supply a **fresh production cookie** (prod is NO-SSO → plain PHPSESSID, expires fast).
Then observe prod per-role capabilities live via `switch-user` on the old-model SPA and
diff against the staging live grid already captured here. Until then, no prod-vs-staging
verdict can be honestly stated.
