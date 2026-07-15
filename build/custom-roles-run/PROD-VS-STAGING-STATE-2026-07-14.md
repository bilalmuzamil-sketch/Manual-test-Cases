# Custom Roles — PRODUCTION vs STAGING Permission Compare — CANONICAL STATE / COLD-RESUME DOC — 2026-07-14

> **Read this first to resume the release-eve prod-vs-staging permission compare.**
> Single authoritative snapshot of the DONE compare. Custom Roles = Epic **SV-7388**,
> PO **Sasha Grosman**. Companion resume docs: `WORDING-VIU-STATE-2026-07-13.md`
> (wording/VIU pass), `RUN331-STATE.md` (run-331 re-test). **Never mix with Fees &
> Discounts or Simple Flow.** No env/TestRail touched by this compare beyond read-only
> GETs (prod) + read-only role captures (staging).

---

## 0. STATUS (one line)
**DONE 2026-07-14 (final commit `30b35bd`).** Release-eve prod-vs-staging permission
comparison complete: find where prod legacy roles grant more/less than the mapped
staging system roles pre-release. Both sides live-captured, bi-directional capability
diff, per-spec Yes/No + Migration-Type annotation, independent verification pass, and
staging FE-gate verification from the shipped JS + live role defs. Residual work =
pixel-confirm the MEDIUM FE-gated rows (needs a fresh staging cookie) + PO/dev decisions
on the High "No" rows.

---

## 1. Purpose & method (COMPLETE)
- **Purpose:** find every place where a **production role can do MORE or LESS** than the
  **staging role it maps to**, before release (the user's worry: e.g. Send to Terminal /
  Send to Portal being lost in migration).
- **Method:**
  - Live capture of all **14 prod legacy roles** (org `72b2cc90-6964-4429-a207-76e55f946936`,
    **no Owner role**) via `GET /api/iam/list-roles` + per-role effective permissions by
    impersonation (`switch-user` → `data.permissions` → `exit-switch-user`); userless roles
    via a temporary throwaway-user role swap, restored to Technician. Prod left unmodified.
  - Live capture of all **11 staging system roles** (`GET /api/organizations/{org}/roles`
    + per-role `GET /api/roles/{id}`: fe_permissions + view_mode + cross_toggles).
  - **Bi-directional capability diff** (translate old `{resource,action}` model ↔ new 41-atom
    + view_mode + 3 cross-toggle model), classified STAGING-LESS / STAGING-MORE.
  - **Per-spec Yes/No + Migration-Type** annotation (spec migration + Behavior-Changes tables
    authoritative for intent).
  - **Independent verification pass** (`compare-VERIFICATION-2026-07-14.md`): re-enumerated
    both surfaces, re-executed the generator logic in isolation, re-captured several prod roles
    live, cross-checked spec flags.
  - **Staging FE-gate verification** from the shipped staging JS bundle + live role defs
    (`staging-ui-verify-2026-07-14/`) for the FE-gated High rows.

---

## 2. Confirmed role mapping (QA-lead 2026-07-14 + spec slug table)
Spec migration table is authoritative. Role-template slugs captured live (`GET /api/role-templates`).

| Staging system role | Slug | Production legacy role(s) mapped in |
|---|---|---|
| Administrator | `administrator` | Administrator (1:1; "Owner merged in" **N/A** — no Owner role in either env) |
| Service Manager | `service_manager` | Service Manager |
| Senior Service Advisor | `senior_service_advisor` | Service Advisor + SA Technician + SA No Reports (3 merged) |
| Service Advisor | `service_advisor` | SA Limited View |
| Foreman | `foreman` | Foreman |
| Technician | `technician` | Technician |
| Parts Manager | `parts_manager` | Parts Manager |
| Parts Technician | `parts_technician` | Parts Technician |
| Sales Representative | `sales_representative` | Sales Representative + Reporting (merged) |
| Office User | `office` | Office |
| Time Clock User | `time_clock_user` | Time Clock |

**Naming trap (resolved):** legacy "Service Advisor" → staging "Senior Service Advisor"
(NOT staging "Service Advisor"); staging "Service Advisor" ← legacy "SA Limited View".
The section-3549 same-name migration cases (C26514/C26515) are superseded by this table.

---

## 3. Final counts (out-of-model excluded)
| Scope | STAGING-LESS | STAGING-MORE |
|---|---|---|
| **Whole app** | No = **51** / Yes = 5 | No = **37** / Yes = 24 |
| **Work Orders — granular** | No = **22** | No = **18** |
| **Out-of-model (staff-record)** | — | 10 rows (excluded from risk counts) |

The **"No"** rows in BOTH directions are the release-eve items needing a keep/change
decision (unaccounted reductions AND unexpected over-grants). Out-of-model = clock-in /
timesheet rows, spec-designated staff-record-controlled, excluded from risk counts.

---

## 4. Key findings
- **Send to Portal = real prod-only loss for all 6 non-portal roles (HIGH).** FE gate =
  `customerPortalPageAccess`; staging **HIDES** it for Technician / Foreman / Parts
  Technician / Office User / Sales Representative / Time Clock User (atom absent), while
  prod grants it. Internally consistent (present for the 5 roles that keep it).
- **Send to Terminal = NO such control anywhere in the staging build** (build-wide
  absence, not a role regression). No payment-terminal / card-reader / "Send to Terminal"
  control exists in the staging FE bundle. **Confirm prod's actual control name/intent**
  before treating the Parts-Tech row as a role-level loss.
- **Parts Manager gains WO Create&Edit + WO Lines Create&Edit** — the standout
  STAGING-MORE over-grant (prod PM was WO/WOL view-only); not in the PM itemized
  Behavior-Changes → real over-grant risk (HIGH).
- **Confirmed STAGING-LESS regressions:** Technician Order-Parts + WO-Lines-Delete;
  Parts-Tech invoice-reverse (Invoicing Delete) + See-AP/AR; Service Advisor WO-Delete.
- **Service Advisor See-AP/AR is INTENDED** (spec Behavior-Changes: "AP/AR OFF preserves
  core restriction") — flagged Yes, not a release risk (false High removed in verification).

---

## 5. Confidence
- **Structurally complete** — no critical omissions; every staging atom + cross-toggle +
  view_mode represented; all 14 prod roles (no Owner) + 11 staging roles + 4 merges present.
  Only **5 trivial prod resources unrowed** (`workplace`, `department`, `vehicle_type`,
  `vehicle_history`, `shop_billing_efficiency` — settings/reference/report-view only).
- **Numerically correct** — independent recompute matched the workbook **23/23** on
  critical rows + prod live-confirmed.
- **Priority FE-gated High rows = HIGH confidence** (FE-source + live role-def data,
  authoritative for a front-end display gate).
- **Residual MEDIUM rows needing pixel confirmation** (need a fresh staging cookie to
  click-verify): Remove-a-WO-part (Technician / Parts-Manager / Parts-Tech); part-return
  approve/complete (Parts-Tech + Service Manager); Sales-Rep See-Financial-Data-on-WO.

---

## 6. Deliverables index (all under `build/custom-roles-run/`)
- `Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx` / `.md` — the finalized bi-directional
  gap deliverable (13-col main tab with Migration Type + Verification-confidence columns,
  WO-granular tab, per-role 2×2 summaries, out-of-model tab, full matrix, open questions).
- `compare-VERIFICATION-2026-07-14.md` — the independent verification pass (completeness +
  correctness + corrections + honest go/no-go confidence statement).
- `prod-vs-staging-compare-PLAN-2026-07-14.md` — the read-only offline prep/method plan
  (mapping, vocabulary, methodology, risks, ready-to-execute checklist).
- `gen_prod_vs_staging.py` — the workbook generator.
- `compare-evidence-2026-07-14/` — captured evidence (`prod-capability-matrix.json` 14
  roles, `staging-capability-matrix.json` 11 roles, `prod-perm-ROLE_*.json`,
  `prod-roles-list.json`, `prod-staff-role-map.json`).
- `staging-ui-verify-2026-07-14/` — staging FE-source / role-definition verification of the
  FE-gated High rows + boot2 bridge recipe.

---

## 7. Env / access facts
- **Production (READ-ONLY):** app/api `shopview.com` (`api.shopview.com`). **No SSO** —
  PHPSESSID session; **expires fast** (re-supply per run). Prod org `72b2cc90-6964-4429-a207-76e55f946936`.
  `switch-user` `user_id` = the **staff-record `id`** (e.g. Technician `4b121f91-…`), NOT
  the `staff_id`/user-uuid. **NEVER write to production** (GETs + impersonation-read only;
  role swaps for userless roles must be reversed).
- **Staging:** SPA `app.staging.shopview.com`, API `api.staging.shopview.com`, org
  `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. **Staging reseeds** — role IDs + the Time Clock
  User restore id CHANGE each reseed; **no `tech@shopview.com` exists on the latest reseed**
  — re-derive role IDs live before any staging drive. boot2 bridge recipe is in the evidence
  dir. Cookies ephemeral (`/tmp` only, chmod 600, NEVER in repo).
- **TestRail:** REAL system — no writes without fresh explicit authorization (none needed/
  made by this compare).

---

## 8. Open items
1. **Confirm Send-to-Terminal intent** — no such control exists in the staging build at all;
   confirm prod's actual control name + whether its absence in staging is intended.
2. **Pixel-confirm the residual MEDIUM rows** (needs a fresh staging cookie): Remove-a-WO-part
   (Technician / Parts-Manager / Parts-Tech), part-return approve/complete (Parts-Tech +
   Service Manager), Sales-Rep See-Financial-Data-on-WO.
3. **Go/no-go decision on the High "No" rows** (both directions) — the release-eve keep/change
   calls: Send-to-Portal losses (6 roles), Parts-Manager WO/WOL Create&Edit over-grant, and
   the confirmed STAGING-LESS regressions.

---

## 9. How to resume (ordered)
1. `git pull --rebase origin claude/slack-session-0sxnd9`. Read THIS doc +
   `Prod-vs-Staging-Permission-Gaps_2026-07-14.md` + `compare-VERIFICATION-2026-07-14.md`.
2. Re-supply prod + staging cookies to `/tmp/custom-roles/` (ephemeral; chmod 600). Prod
   PHPSESSID expires fast; staging cookie expires ~24h.
3. **Re-derive staging role IDs live** (env reseeds change them; no `tech@shopview.com` on
   the latest reseed). Build a fresh boot2/MITM bridge (read `$HTTPS_PROXY` live).
4. Drive the §8.2 residual MEDIUM rows per role in a real staging browser to pixel-confirm.
5. Regenerate the workbook via `gen_prod_vs_staging.py` only if capability data changes.
6. **NEVER write to production**; no TestRail writes without fresh authorization.
