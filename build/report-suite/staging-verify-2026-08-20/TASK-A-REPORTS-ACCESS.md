# TASK A — Reports-access permission cases (C30398, C30603, C30604) — DONE 2026-08-20

## Session / build marker
- Session ALIVE via `quick-login admin` (raw cookie returned 409 "Session has expired." → re-minted a
  fresh PHPSESSID via quick-login, persisted to `/tmp/cln/cookies.json` — the sv_sso_session/cf_clearance
  are still valid).
- Build **`v3.8-d0e135e`**, `last-modified` Wed 19 Aug 2026 13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`.
- Read at **2026-08-20T06:58Z**. Host `app/api.staging.shopview.com`. Org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`.

## Method (role-swap used = YES, for the negatives; switch-user for the positive)
The negatives need a signed-in user with NO reports access, and this org has NO confirmed+active
no-reports holder to impersonate (the only active Senior Service Advisor holder is unconfirmed →
switch-user 403s; the confirmed Technician holders sit on the drifted-with-reports Technician role).
So the Technician **role-swap** was required:
1. Recorded the tech quick-login user (`a7fd0a88…`, Technician role `50bf6a0d`) and snapshotted the
   Technician role (`/tmp/roleswap/technician-BEFORE.json`).
2. Found the Technician role **DRIFTED to 13 perms including `reportsPageAccess`** (canonical template = 6
   perms, cross-validated against the clean "Technicain(AK)" role). The template does NOT include
   `reportsPageAccess`.
3. To get the no-reports state with **minimal blast radius on this shared org** (a concurrent worker owns
   the TestRail web UI; 3 other staff hold the Technician role), I removed ONLY `reportsPageAccess`
   (13→12 perms) via `PUT /api/roles/50bf6a0d` (atom-UUID payload; code-string payload 500s). This is the
   task's explicit fallback and fully achieves "a live user with NO reports access" — the reports gate is
   the single atom `reportsPageAccess`.
4. Confirmed LIVE on the tech quick-login session: fe-permissions dropped to 12, `reportsPageAccess` gone.
5. Observed the negatives (below).
6. **RESTORED** the Technician role byte-exact to the as-found 13-perm state (`PUT` → 200; read-back 10
   fields byte-identical; tech session back to 13 perms with `reportsPageAccess`). Shared org left as found.
   Do-no-harm restore (matches the schedule `role_tool.py` byte-exact pattern) — the pre-existing drift is
   flagged as a finding, not silently changed to template mid-concurrent-work.

The **positive** (C30603) used **zero-mutation switch-user impersonation** of the Parts Manager holder
`mudassir.qamar+pm` (id `071a4e52`, active+confirmed, holds `reportsPageAccess`), then re-logged admin.

## Per-case verdicts (all PASS → AUTOMATION: READY)

### C30398 — Without reports access Technician Utilization is hidden → **READY (PASS)**
- BE: as no-reports tech, `GET /api/reporting/reports/technician-utilization?range=custom&start_date=…&end_date=…` → **HTTP 403 "Access denied."** (admin baseline: 200 / 38 rows).
- FE: no **Reports** entry in the top nav; `/reports/technician-utilization` **redirects to /workorders**; 0 `/reports` links in the DOM. Evidence `evidence/tech-noreports-TU.png`.
- Update: Rule-54 sentence-2 stamped `Last checked against build v3.8-d0e135e on 8/20/2026`; marker `HOLD → READY`. refs unchanged.

### C30604 — Without reports access Inventory Value is absent from the navigation → **READY (PASS)**
- BE: as no-reports tech, `GET /api/reporting/reports/inventory-value?…` → **HTTP 403 "Access denied."**
- FE: no Reports nav; `/reports/inventory-value` **redirects to /workorders**. Evidence `evidence/tech-noreports-IV.png`.
- Update: build stamp + marker `HOLD → READY`. refs unchanged.

### C30603 — A user with ordinary reports access can open Inventory Value → **READY (PASS)**
- Subject: Parts Manager (non-admin, `reportsPageAccess`=true, 31 perms) via switch-user.
- `GET /api/reporting/reports/inventory-value?…` → **HTTP 200, 100 rows**; CSV export
  `.../inventory-value/export?format=csv&variant=summary` → **HTTP 200, 699,071 bytes, line 1 "As of: 2026-08-20"**.
- "No per-report permission required" is structurally confirmed: the FE-permission catalogue holds exactly
  ONE report atom (`reportsPageAccess`); a user holding it opens IV. Admin render confirms the exact nav
  labels "Technician Utilization" / "Inventory Value" (`evidence/admin-reports-nav.png`).
- Update: build stamp + marker `HOLD → READY`. refs unchanged.

## TestRail writes (Rule 50 byte-verified)
- `update_case` on C30398, C30604, C30603 — all HTTP 200, all three text fields byte-verified against the
  sent interim `<br>` strings (C30603 exact under the declared `—`→`&mdash;` HTML-entity normalization).
  0 collateral field changes; `refs`, `custom_atmstatus` (3), `type_id`, `priority_id`, `section_id`,
  `title` all unchanged. All `created_by=3` (ours) — 0 foreign edits.
- Fields written in the interim `<br>` form (hazard #6) → appended to `../format-reflow-2026-08-20/NEEDS-REFLOW-STAGING.md`.
- atm=3 (Automated) on all three → recorded in `FOR-VLAD.md`.

## Run untouched
- Run 359 (Report Suite): `include_all` False, **6 passed / 0 failed / 503 untested / 509 total** — identical
  to the session baseline; all three cases present in the run with status Untested (unchanged). `update_case`
  writes no results; no run write issued. Runs 357/352 not touched.

## Finding (reported, NOT filed — creation hold)
- **Technician role `50bf6a0d` is drifted** to 13 perms (adds `reportsPageAccess`, `settingsApp/Finance/
  Parts/Service`, `customersCreateAndEdit`, `workOrdersCreateAndEdit`) vs the 6-perm template. Restored to
  the as-found state after this pass; recommend the shared-org owner reset it to template (Rule 26).
