# Custom Roles — Build-Accurate Wording + VIU Pass — CANONICAL STATE / COLD-RESUME DOC — 2026-07-13

> **Read this first to resume the Custom Roles wording+VIU effort.** Single
> authoritative snapshot of the 2026-07-13 build-accurate wording + behavioral VIU
> pass over the Custom Roles suite (TestRail section **3527** subtree, sub-sections
> **3528–3553**, plus 2 stubs moved in from 3658). Method =
> `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (Standing Rule 10). Companion:
> `RUN331-STATE.md` (the earlier run-331 re-test snapshot). Custom Roles = STAGING,
> Epic **SV-7388**. **Never mix with Fees & Discounts or Simple Flow.**
>
> **Canonical spec (Confluence):** https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions
> (Atlassian-SSO login-walled — reference pointer only; content must be exported/pasted to ingest, do NOT fetch the URL.)

---

## 0. STATUS (one line)
**DONE 2026-07-13.** Full build-accurate wording pass pushed to TestRail (252
`update_case` on the core suite, all 200/200) + boot2 behavioral VIU across 8 rounds
(the RUN331 "role editor not drivable headless" blocker is overcome) + section-3658
stub tree fully resolved. **Final tally (254 cases): VIU-Verified 204 / Blocked-UI 39
/ Deviation 11.** No open TestRail writes pending. Residual work = 38–39 manual /
second-real-user cases + 11 dev deviations (both handed off in the Blockers Tracker).

---

## 0b. Prod-vs-Staging permission compare — MAPPING CONFIRMED (2026-07-14)
The prod↔staging role/permission gap deliverable (`Prod-vs-Staging-Permission-Gaps_2026-07-14`
`.xlsx`/`.md`, generator `gen_prod_vs_staging.py`, evidence `compare-evidence-2026-07-14/`) is
FINALIZED under the **QA-lead-CONFIRMED mapping (2026-07-14, spec migration table authoritative):**
Administrator ← Administrator (1:1; "Owner merged in" **N/A** — no Owner role in either env),
Senior Service Advisor ← Service Advisor + SA Technician + SA No Reports (3 merged), Service
Advisor ← SA Limited View, Sales Representative ← Sales Representative + Reporting, all others 1:1.
The Service-Advisor / Senior-SA rows are now FINAL (mapping-unconfirmed flag removed; recompute
under the confirmed mapping changed **no** rows — it was already computed under this mapping).
**Finalized headline counts** — ALL: STAGING-LESS No=52 / Yes=4 · STAGING-MORE No=53 / Yes=18;
WO-granular: STAGING-LESS No=22 · STAGING-MORE No=24. No env/TestRail touched (data already captured).

---

## 1. What was done (COMPLETE)
- **Wording pass:** all **252 core cases** (sections 3528–3553) rewritten to
  build-accurate, layman, jargon-free wording (labels captured LIVE from the shipped
  build Vue chunks) and pushed via `update_case` — **252 UPDATED · 0 no-op · 0 failed
  · every push re-verified 200/200.** (TestRail writes were authorized for this pass.)
- **Behavioral VIU:** the role-editor SPA **IS drivable headless** via the boot2
  hydration pattern (seed cookies + localStorage user/fe_permissions/token, then
  navigate) + Playwright chromium (`/opt/pw-browsers/chromium-1194`) through
  `$HTTPS_PROXY`. 8 rounds run; **no TestRail writes in the behavioral pass** (local
  `viu_status`/`evidence` only). Tooling in `/tmp/custom-roles/beh0713/`
  (adm/boot2/drive/click/cascade/capture/setstatus + permmap.json); screenshots in
  `screenshots/behavioral-viu-2026-07-13/`.
- **Section 3658 stub tree — FULLY RESOLVED** (original 10 stubs):
  - 3 confirmed duplicates DELETED early (C27735 = dup C26467; C27733 & C27737 = dup
    C26429/C26371).
  - 2 valid stubs MOVED into 3527 sub-sections + reworded + pushed (200/200):
    **C27731 → 3549 (Migration)**, **C27736 → 3545 (View and Manage AP/AR Data)**.
  - 5 not-valid stubs DELETED (QA-lead authorized 2026-07-13): **C27729, C27730,
    C27732, C27734, C27738** — each verified gone (get_case HTTP 400).
  - **Section 3658 subtree (3658 + sub-sections 3659–3665) is now EMPTY** (0 cases,
    all 8 sections) — CANDIDATE for section removal (reported; sections not deleted).
- **New local editable source (Custom Roles never had one before):**
  `cases-2026-07-13/*.json` — **254 files** (252 core + the 2 moved-in), each with
  `viu_status`/`evidence`/`fresh_run:2026-07-13` and `section_id`. This is the
  resumable checkpoint + source of truth. **No `testrail-id-map.csv`** for Custom
  Roles — the JSON filename IS `C<id>.json` and each JSON carries `case_id` +
  `section_id`.
- **Safety net:** verbatim pre-edit snapshots of all in-scope cases (incl. the 5
  deleted stubs) in `testrail-snapshots-2026-07-13/` — full rollback baseline.

## 2. Final tally (254 cases)
| Bucket | Count | Meaning |
|---|---:|---|
| **VIU-Verified** | 204 | Behavior driven live via boot2, or label/structure confirmed from the shipped build, or per-role permission set confirmed from the live roles API |
| **Blocked-UI** | 39 | Wording corrected + pushed; behavior needs MANUAL / SECOND-REAL-USER coverage (genuine harness/env residue — see §3) |
| **Deviation/Finding** | 11 | Build differs from the old case / stale premise / dev fix to confirm — route to dev (see §4) |
| **TOTAL** | 254 | 252 core (3528–3553) + 2 moved-in stubs (C27731 Blocked-UI, C27736 VIU-Verified) |

Reproduce the tally: `python3 build/custom-roles-run/gen_wording_viu_workbook.py`
(reads `cases-2026-07-13/*.json`; emits 254 rows = 204/39/11).

## 3. The 38–39 Blocked-UI residue (MANUAL / 2nd-real-user) — grouped by root cause
Per-case precise reason lives in each `cases-2026-07-13/C*.json` `viu_status`; the
per-case list with TestRail links is in `CustomRoles_Blockers_Tracker_2026-07-13.md`.
- **Staff-editor / staff-record — needs real browser or 2nd real user (9):** C26356,
  C26450, C26490, C26491, C26493, C26526, C26527, C26539, C27873.
- **Calendar drag/slot — needs real browser (3):** C26395, C26396, C27867.
- **In-page payment/terminal/return/financial/timesheet-entry editors (9):** C26401,
  C26422, C26423, C26427, C27871, C29434, C29438, C26479, C26431.
- **Portal / Send-to-Portal surfaces not exposed in this env (5):** C26437, C26438,
  C26439, C26440, C26466.
- **Parts delete/restock detail-page affordance not reachable in harness (4):**
  C26412, C26415, C26418, C26419.
- **Seeded line-state ops (review-auth/pick/core/set-line-status/WOL-delete/qty) (6):**
  C26379, C26380, C26391, C27866, C27870, C29435.
- **Tech-view parts-request form field-count (1):** C26460.
- **Last-Administrator guard — 89 admins on shared org, can't create last-admin (1):**
  C26550.
- **Plus the moved-in migration stub C27731 (Blocked-UI)** — legacy-Owner landing not
  seedable.

## 4. The 11 Deviations (route to dev) + fixes verified
| Case(s) | Finding |
|---|---|
| **C26387 / C26388** | RUN331 FAIL PERSISTS — in the New Work Order modal the "Add" (new customer) and "Add" (new asset) affordances are shown+enabled even with **Customers Create & Edit OFF** (gate not applied). |
| **C26459 / C26464** | Labor rate is NOT hidden by Tech view when **See Financial Data is ON** (Rate/Margin/Total + labor $ shown); labor-rate visibility follows SFD, not view mode. (Caveat: test role also had WO Create&Edit — dev to confirm.) |
| **C26424** | Invoicing & payments Delete/Reverse while View and Manage AP/AR Data is OFF shows **NO AP/AR prompt** — invoicing gates on See Financial Data, not AP/AR. |
| **C26339** | Role NAME not strictly unique — the duplicate dialog keys on IDENTICAL PERMISSIONS ("Create Anyway" override), not name. |
| **C26340 / C26341** | Template picker names & descriptions are IDENTICAL to the Roles list (not shorter/different) — premise stale. |
| **C26529 / C26531** | QuickBooks/Integrations stale premise — QuickBooks stays under **Integrations** (settingsIntegrations gates IBS/Open API/QuickBooks; Finance gates only Payment Methods/Taxes). Integrations sub-toggle IS present in the build. |
| *(fix verified)* **C26475** | SFD-disable confirm prompt (`FinancialDataDisableConfirmModal` "Disable See Financial Data?") is NOW BUILT — RUN331 FAIL now fixed. |
| *(fix verified)* **C26482** | Aging reports now follow the Reports permission (build-confirmed). |

Also build-verified during the wording pass: Administrator IS editable (only Office
User + Time Clock User non-editable — C26510 corrected, C26543 verified); AP/AR toggle
build label = "View and Manage AP/AR Data"; Settings has 7 sub-toggles incl.
Integrations; "Delete / Reverse" column on Invoicing & payments; Duplicate Role route
exists (RolesPermissionsDuplicate).

## 5. Env / access facts
- **Staging:** SPA `app.staging.shopview.com`, API `api.staging.shopview.com`; org
  `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. Cookies **ephemeral** (`/tmp` only,
  ~24h lifetime; a 401/409 before 24h ⇒ suspect a deploy, re-request).
- **boot2 hydration cracks the role editor headless** (seed cookies + localStorage
  `user`/`fe_permissions_wrapper`/`token`, THEN navigate; DEV login buttons don't
  reliably work). Build a FRESH MITM bridge per run (port rotates; read `$HTTPS_PROXY`
  live). Cookies file used this pass: `/tmp/custom-roles/cookies-viu-0713.env`.
- **Tech role-switch (STAGING):** staff `6fb22c1b-...`; `POST /api/staff/{staff}/change`.
  **Restore target = Time Clock User `a0359055-3dfb-4e9c-9e11-2fbea21585c2`** (the old
  `77b069d1-...` does NOT exist on staging — do not use it). EXACT email match
  `tech@shopview.com` before changing.
- **⚠️ Tech currently DRIFTED on the Technician role** on the shared staging org
  (left there by an earlier pass). **Reset Tech → Time Clock User
  `a0359055-...` before any future negative/permission retest.** Staging org is
  SHARED — never assume env state; re-read before runs.
- **This task (deletes + save-state) touched NOTHING on the env** besides the 5
  TestRail `delete_case` calls — **no role/settings/data changed, no restore needed.**
- **TestRail:** project **1** / suite **1 "Master"**; API v2, Basic auth via curl
  (Node fetch is proxy-blocked — use `curl --cacert /root/.ccr/ca-bundle.crt`); creds
  in `/tmp` only, chmod 600, NEVER in repo. `update_case`/`delete_case`/
  `move_cases_to_section` all authorized only per-task. Custom Roles - (Revised) =
  section **3527**; stub tree (now empty) = **3658** + 3659–3665.

## 6. Deliverables index (all under `build/custom-roles-run/`)
- `WORDING-VIU-STATE-2026-07-13.md` — **THIS canonical resume doc.**
- `CustomRoles_WordingVIU_2026-07-13.xlsx` / `.csv` — results workbook (tab per bucket
  + Summary + All Cases; Case ID + clickable TestRail Link columns, Rule 8). 254 rows.
  Regenerate: `python3 gen_wording_viu_workbook.py`.
- `CustomRoles_Blockers_Tracker_2026-07-13.md` — per-case residue (38–39) grouped by
  root cause + the 11 deviations, with TestRail links.
- `cases-2026-07-13/*.json` — 254 local case bodies (source of truth; carry
  `viu_status`/`evidence`/`section_id`).
- `testrail-snapshots-2026-07-13/*.json` — verbatim pre-edit snapshots (rollback
  baseline; includes the 5 deleted stubs → deletions reversible).
- `section-3658-resolution-2026-07-13.md` + `section-3658-dedupe-2026-07-13.md` — the
  stub-tree rulings/rationale.
- `testrail-wording-viu-log.md` — per-case/section TestRail audit log (incl. the 5
  deletions).
- `wording-glossary-2026-07-13.md` — build labels captured from the shipped Vue chunks.
- `roles-matrix-2026-07-13.md` — live per-role permission matrix (from `GET /api/roles/{id}`).
- `screenshots/wording-2026-07-13/` + `screenshots/behavioral-viu-2026-07-13/`.

## 7. How to resume (ordered checklist)
1. `git pull --rebase origin claude/slack-session-0sxnd9`. Read THIS doc + the
   Blockers Tracker.
2. Re-supply staging cookies to `/tmp/custom-roles/` (ephemeral). Build a fresh
   MITM/boot2 bridge (read `$HTTPS_PROXY` live).
3. **RESET Tech → Time Clock User `a0359055-...`** (it is currently drifted on
   Technician) before any negative/permission test; EXACT email match. Restore after
   any switch. Mark throwaway data/roles `ZZAUTOTEST`; delete them after.
4. Work from `cases-2026-07-13/*.json`; update `viu_status`/`evidence` as behavior is
   confirmed. Prioritize: (a) the 11 Deviations (dev re-test/confirm), then (b) the
   38–39 Blocked-UI residue — these need a REAL browser and/or a SECOND real user
   account and/or seeded data not creatable in this harness (staff-editor, calendar
   drag, in-page payment/return/terminal/timesheet editors, portal surfaces, parts
   delete detail, seeded line-state ops, last-admin guard).
5. TestRail writes require fresh explicit user authorization each time. Push only
   changed fields via `update_case` (curl + Basic auth from `/tmp`); log every write
   to `testrail-wording-viu-log.md`; regenerate the workbook + tracker.
6. If QA-lead OKs it, remove the empty section 3658 subtree (3658 + 3659–3665) —
   NOT done here (needs separate OK).
