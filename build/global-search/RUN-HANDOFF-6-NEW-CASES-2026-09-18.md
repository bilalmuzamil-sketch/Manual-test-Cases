# HANDOFF → RUN SESSION — Global Search: 6 new cases C55718–C55723
### Build verification is DONE. Run these six on `sv9160` and record honest results. 2026-09-18.

**You are the run session.** These six cases are build-verified on `sv9160` build
`v26.36.7-29ca209` (report: `build/global-search/build-verify-6cases-2026-09-18/REPORT-2026-09-18.md`).
All six are runnable, render clean, and their data is seeded and verified (seed note:
`build/global-search/SEED-NOTE-6-NEW-CASES-2026-09-18`). **Nothing blocks you.**

- **Scope:** C55718, C55719, C55720, C55721 (Permissions, section **6734**) · C55722, C55723
  (Ranking, section **6726**). All `created_by=3`, none Automated. Run **R415**.
- **Branch:** `https://sv9160.qa.shopview.com` ONLY (dummy QA branch, full CRUD authority, Rule 107).
  Do NOT run on staging or production.
- **Access:** `source build/testing-tools/ensure_bridge.sh`; put a fresh `sv_sso_session` in
  `/tmp/qa-cookies/sv9160-sso.txt` (chmod 600, /tmp only, NEVER committed — Rule 82); then
  `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`. Reuse
  `build/global-search/probe_gs_surfaces.mjs`. Labels: `build/OBSERVED-UI-LABELS-sv9160.md`.
- **First, prove the data is still there** (branch redeploys wipe it):
  `cd build/global-search/seeding && python3 status.py`. If the build marker has moved off
  `v26.36.7-29ca209`, run `./reseed_everything.sh qa` and allow OpenSearch a moment to index.

## The two ranking cases — already observed PASS at build-verify, re-confirm with the controls
| Case | Type in the search box | Expected order (assert the RULE, not a position) | Observed 2026-09-18 |
|---|---|---|---|
| **C55722** | `ZZOPENCOUNT` | In the **Customers** group, `ZZOPENCOUNT Freight Busy` (5 open jobs) ranks **above** `ZZOPENCOUNT Freight Quiet` (1 open). | PASS — Busy above Quiet, "5 open"/"1 open" badges shown |
| **C55723** | `ZZNAMEBONUS` | In the **Customers** group, `ZZNAMEBONUS Cartage` (matched on its name) ranks **above** `Sterling Brothers Freight` (matched only on its address). | PASS — name match above address match |

## The four permission cases — POSITIVE side observed as admin; run the NEGATIVE side with a reduced role
Sign in as the named reduced role, confirm the permission change took effect (re-read after switching),
then search. **Reset a role To Template before assigning it** (Edit → Reset To Template → Save; if Save
is disabled the role is already default). The `ZZAUTOTEST` roles are rebuilt from template by the seeder.

| Case | Reduced role (recorded id) | Search | Must happen |
|---|---|---|---|
| **C55718** | `ZZAUTOTEST No Work Orders View` (`87ba8d85-1d27-49a4-9bd0-29426c6fab41`) | `S2-15430` | The work order does NOT appear — not pinned at the top, not in any group. (As admin it returns 1 result — that is the permitted-user positive side.) |
| **C55719** | `ZZAUTOTEST No Customers View` (`530eb5d2-7c30-4cc7-92c8-a76a1935b169`) | `2643286723` (or `zzrankf@northgate-cartage.test`) | No Customers row for **Northgate Cartage Company** (its name contains neither value — it only matched via a contact). A user WITH Customers access sees that company row. |
| **C55720** | a role missing **BOTH** Work Orders AND Vendor & Order Management — seed note names `ZZAUTOTEST No Work Orders Or Vendors`. **⚠️ Confirm this combined role exists on the branch first** (the recorded roles file lists only single-bundle roles); if absent, build one from template removing both `workOrdersView` and `vendorOrderManagementView`. | `Fib` | Four groups vanish together: **Work orders, Vendors, Purchase orders, Vendor invoices** (their group, count and scope tab all gone). **Customers, Assets, Parts, Part sales stay** with correct counts. As admin all 8 groups show (the baseline). |
| **C55721** | `ZZAUTOTEST No Parts View` (`745590e6-e502-4727-91b3-0157210eb803`) | `Altenator` (typo of Alternator) | The part does NOT appear, even though the typo fuzzy-matches it for a permitted user (as admin the Parts group shows `≈close match:` hits). |

## Watch-outs (confirmed on the build)
- **OpenSearch index lag** is real but short — if a record looks absent, re-search before concluding.
- **After switching role, re-read** to confirm the change took effect before reading results.
- **Ranking is config-driven** (`search.yaml`), so assert the ORDER RULE, never an absolute position/score.
- A newly created work order is an **estimate**, which does NOT count as an open work order — the seeded
  open-WO counts were driven to `in_progress` on purpose (relevant if you reseed).

## OUTSTANDING — what I need from you (the run session)
| # | Item |
|---|---|
| 1 | Nothing blocks the run. All six are build-verified, runnable and seeded. |
| 2 | If any case FAILS, follow your own session's defect rules (Standing Rule 62: candidate held, reconcile the case's Expected against the live PRD v1.5 first, do not file without the QA lead's per-candidate go-ahead). |
| 3 | Confirm the combined role for C55720 exists before running its negative side (Table above). |

**Standing holds still apply:** no Jira/external artefact without the QA lead, no TestRail *case* writes
without his go-ahead, Vladimir's cases never, Automated cases held, secrets never committed, production
is not a test environment. All work on `sv9160` only.
