# HANDOFF → RUN SESSION — Global Search: Permissions & Role-Based Scoping (6734), 12 cases
### Run on `sv9160` (build `v26.36.8-d146c39`), record results in run **R415**. 2026-09-18.

**You are the run session.** All 12 are build-verified and re-stamped on `v26.36.8-d146c39`
(report: `build/global-search/build-verify-perms-12-2026-09-18/REPORT-2026-09-18.md`). Runnable,
render-clean, roles present (status.py 7/7 seeded + 6 stock). Execute each, mark **Passed / Failed /
Blocked** in **R415**. **C44880 is not-available** (second org) — mark it so, do not fail it.

- **Scope:** C44877, C44878, C44879, **C44880**, C44881, C44882, C55702, C55703, C55704, C55705, C55706, C55717. All `created_by=3`, none Automated.
- **Run:** R415 — <https://shopview.testrail.io/index.php?/runs/view/415>.
- **🔑 RESULT-WRITE GO-AHEAD:** the QA lead asked for results recorded in R415 — explicit go-ahead for
  **result writes on R415 only** (Rule 6). Use `push_results_to_run.py` (playbook §W); union-only sync (Rule 34).
- **Branch:** `https://sv9160.qa.shopview.com` ONLY. **Access:** as the other handoff (bridge + fresh
  `sv_sso_session` in `/tmp/qa-cookies/sv9160-sso.txt`, chmod 600, never committed; `qa-branch-boot.mjs`).
- **First:** `cd build/global-search/seeding && python3 status.py` (marker + roles). Reseed if moved.

## 🔴 Role hygiene (costs time if skipped)
- **Reset a STOCK role To Template before assigning it** (QA lead 2026-09-17): Settings → Roles &
  Permissions → role → Edit → **Reset To Template** → **Save** → assign. If Save is disabled the role is
  already default. The 7 `ZZAUTOTEST` roles are template-clean already.
- **After a role change, confirm it took effect for the signed-in user** (re-login) before reading.
- **A dropped `View` can come back on its own** — remove the whole family (`customersView` +
  `customersCreateAndEdit` + `customersDelete`); if a negative behaves like a positive, read the role back.
- **`seeFinancialData` is a crossToggle** — dropping it from the list alone does nothing; the toggle must go False.
- **Part Sales needs two conditions**: `partSalesView` AND `seeFinancialData`.
- **Collateral:** `vendorOrderManagementView` hides Vendors+POs+Vendor Invoices together; `customersView` hides Customers+Assets together.
- **"Absent" means three ways**: no group, no count, no scope tab. C44881 distinguishes *absent* from *present-but-empty* — don't collapse them.

## What to run, per case
Run each POSITIVE before its matching NEGATIVE — the positive is the control.

| Case | Sign in as | Expected shape | Note |
|---|---|---|---|
| **C44877** | Admin | Parts group present + populated | positive; control for C44878. Observed as admin. |
| **C44878** | Technician (or `ZZAUTOTEST No Parts View`) | Parts group absent (no group/count/tab) | negative |
| **C44879** | `ZZAUTOTEST No Work Orders View` | Work Orders group absent; WO not pinned on exact number | check the pin separately |
| **C44880** | 🔴 **NOT AVAILABLE ON BUILD** | tenant isolation — needs a second org's sign-in (`ZZAUTOTEST Second Org Ltd` has no working login) | **mark not-available, do not fail** |
| **C44881** | Technician | a type with zero accessible rows shows the **empty state**, not an error | distinguish from "no permission" |
| **C44882** | **each role in turn** | one bundle removed at a time: Part Sales · Customers(+Assets) · Vendor & Order Mgmt(+POs+VIs) · Financial Data (prices masked, groups stay) · Time Clock (nothing) | **six sign-ins, one case — budget for it** |
| **C55702** | Admin | Work Orders group present | positive; control for C44879. Observed. |
| **C55703** | Admin | Customers AND Assets present | positive (one permission, two groups). Observed. |
| **C55704** | Admin | Part Sales present | positive; needs `partSalesView`+`seeFinancialData`. Observed. |
| **C55705** | Admin | Vendors, POs AND Vendor Invoices present | positive (one permission, three groups). Observed. |
| **C55706** | Admin | prices visible in result rows | positive; control for the masking half of C44882. Observed (`Fib` rows show prices). |
| **C55717** | user who loses access after viewing | open a record, remove that bundle, re-check recent list — record drops off | two observations with a role edit between |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | 11 of 12 runnable and ready on `v26.36.8-d146c39`; roles present. |
| 2 | **C44880** — mark not-available; it needs a second-organisation sign-in (QA lead). |
| 3 | **C44882** is six sign-ins under one case number — plan the role order once, sweep in one pass. |

**Standing holds:** no Jira/external artefact without the QA lead, no TestRail *case* writes without his
go-ahead (result writes on R415 covered above), Vladimir's cases never, Automated cases held, secrets
never committed, production is not a test environment. All on `sv9160` only.

---
_(Rule 95 — the twelve-clause Token-Discipline Charter is embedded verbatim in the companion build-verify
handoff `fca2a117-HANDOFF-BUILD-VERIFY-PERMISSIONS-6734`; canonical copy
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Strategy first · never bulk-read · spawn discipline · never
poll · batch writes · piggyback · never re-do · answer in text · the budget · week-start guard · quality
is never the thing cut.)_
