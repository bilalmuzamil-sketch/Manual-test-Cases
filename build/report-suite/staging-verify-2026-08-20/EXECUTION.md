# Staging build-verify — 2026-08-20 (cookie-dependent backlog)

## Session / build marker
- **Session ALIVE.** `GET /api/auth/me/fe-permissions` → HTTP 200, role administrator (42 perms, view_mode full).
- App build marker: **`v3.8-d0e135e`**, `last-modified` Wed 19 Aug 2026 13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`.
- Read at (UTC): **2026-08-20T06:28Z**. Host: `app.staging.shopview.com` / `api.staging.shopview.com`.
- Cookies mapped as supplied (PHPSESSID 32-hex, sv_sso_session 64-hex, cf_clearance) — auth OK first try, no swap needed.
- SPA driven via route-less direct-proxy Chromium (staging-admin.mjs api()) + localStorage seed from `POST /api/token` (no quick-login for admin observation).

## Constraints honoured
- TestRail **API only** (Basic auth `update_case`). **Did NOT open the TestRail web UI.**
- Writes stored in the `<br>` interim format (hazard #6 — API wrap block still active). Edited cases appended to `../format-reflow-2026-08-20/NEEDS-REFLOW-STAGING.md` (NOT reflowed).
- 0 Jira. 0 foreign-case edits (all edited cases created_by=3). Runs 359/357/352 not written.

## Per-case results

### C43838 — WIP: selecting a bucket tab glows its composing summary widgets  → HOLD → **READY**
- **Observed live** (build v3.8-d0e135e, real data: 365/667/374/1068 WOs). The glow is a `::before`
  on `.wip-summary-strip__figure` (class `--highlighted`), BEHIND the figure, exclusive, moves with the tab.
- **Mapping confirmed EXACTLY as documented:**
  - Approved - partially completed → **Completed Work on Open Work Orders** + **Remaining Work on Open Work Orders** ✓
  - Approved - not started → **Work Orders Not Started** ✓
  - Completed → **Work Orders Ready to Invoice** ✓
  - Estimates → **Estimates** ✓
- **Colour: design-vs-build point.** Design review said "amber"; the build renders the app's **violet accent**
  (`::before` bg rgba(135,91,247,0.12) + inset box-shadow rgba(135,91,247,0.55) 1px = #875BF7). The case's
  item 4 deliberately left the colour unpinned ("confirm live … do not invent a hex"), so the behavioural
  assertions (which figures glow / placement / exclusivity) PASS → READY. The amber-vs-violet colour
  difference is disclosed in the case (Rule 56) and flagged for the design owner (NO Jira — create-nothing hold).
- Rule-54 sentence 2 stamped: "Last checked against build v3.8-d0e135e on 8/20/2026."
- update_case HTTP 200, byte-verified (text = sent + idempotent `\n`; refs exact; title/section/atmstatus/automation_type/type/priority unchanged). atm=1 (not automated) — not a FOR-VLAD case.
- Evidence: evidence/wip-partially-completed-glow-and-wrap.png, evidence/wip-glow-mapping.json, evidence/wip-glow-color.json.

### C43984 — WIP: long summary/column labels wrap, no truncation  → HOLD → **READY**
- **Observed live.** Long summary labels "Completed Work on Open Work Orders" and "Remaining Work on Open
  Work Orders" render across two-to-three rows (`.wip-summary-strip__label` white-space:normal, text-overflow:clip,
  clientHeight 40 vs single-line ~26), fully readable, no ellipsis, no mid-word truncation. Column headers
  stay on one row and fit their columns (scrollWidth==clientWidth, no truncation). BEHAVES.
- Rule-54 sentence 2 stamped: "Last checked against build v3.8-d0e135e on 8/20/2026."
- update_case HTTP 200, byte-verified as above. atm=1 — not a FOR-VLAD case.
- Evidence: evidence/wip-label-wrap.json, evidence/wip-partially-completed-glow-and-wrap.png.

### C38848 — Schedule: Edit Staff 'Set working hours for this technician' toggle  → **HELD (observation-limited)**
- Could NOT be driven this session. Two independent blockers, both harness/render limits, NOT feature-absence (Rule 12):
  1. **Staff admin table renders Active(0)** ("Empty bays") in headless regardless of workplace (switched
     to QB Location - Automation, which holds technicians per `GET /api/staff` = 19), because the table is
     gated by a top **Locations** filter whose Quasar menu renders no selectable `.q-item` rows in headless.
  2. **New/Edit Staff form section-errors:** "Something went wrong loading this section" and does **not**
     recover on Retry — the staff create/edit chunk fails to load in this session.
- `GET /api/staff/{id}/working-hours` returns 404 ('Staff' not found) for id and staff_id (workplace scoping).
- **No write.** atm=3 (automated). Kept HELD; same conclusion as the 2026-08-18 pass, now further characterised. → FOR-VLAD.

### C38849 — Schedule: technician with no custom hours inherits shop hours  → **HELD (observation-limited)**
- Depends on the same per-technician working-hours tab in Edit Staff (same two blockers as C38848). No write. atm=3. → FOR-VLAD.

## Run untouched
- update_case writes no run results. Run 359 read post-pass: include_all False, 6 passed / 0 failed / 503 untested (509 total) — intact. No run write issued. Runs 357/352 not touched.

## Priority 4 (permission/single-location backlog) — ATTEMPTED, DEFERRED (no fabrication, Rule 12)

**4 Schedule permission candidates need NO action — already `AUTOMATION: READY`:** C30076 (Schedule
nav hidden with Schedule:View OFF), C30078 (Edit without Delete), C30081 (Schedule without WO:View),
C30614 (WO:View OFF hides WO details). All atm=1, marker already READY — nothing to flip.

**3 reports-access cases NOT observed this session (kept HELD):** C30398 (TU hidden without reports
access), C30603 (IV opens with ordinary reports access, atm=3 updated_by=1), C30604 (IV absent
without reports access, atm=3 updated_by=1). Reason:
- The only way to reach a *no-reports-access* live state was to mutate the shared org's roles: the
  Tech quick-login user's role (Technician) is currently DRIFTED to include `reportsPageAccess`
  (13 perms, confirmed live), and active staff hold only Admin / Technician / Senior Service Advisor /
  Parts Manager — no clean reports-less holder to impersonate read-only.
- A concurrent worker is active and the org is shared; resetting/assigning roles (Rule 26 mutation)
  risks disrupting them, so it was NOT done. Impersonation/quick-login also rotates the shared
  PHPSESSID (it expired the admin cookie mid-pass; recovered by re-minting via quick-login admin +
  persisting the fresh PHPSESSID).
- Per Rule 12 the verdict was NOT inferred from `fe_permissions`. These 3 stay HELD; they are the
  automation-owned "one shared sign-in" cases and are best driven when a dedicated reports-less test
  login exists.

**No shared-org mutation was made this pass:** no role permission changed, no staff role_id changed.
Only read-only API calls + quick-login (session-scoped, self-recovered). **Technician role swap: NOT
performed → nothing to restore (N/A).**
