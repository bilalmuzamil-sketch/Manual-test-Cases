# Custom Roles — Build-Accurate Wording + VIU Pass — STATE / RESUME DOC — 2026-07-13

> Canonical snapshot of the 2026-07-13 build-accurate wording + VIU pass over the
> **core Custom Roles cases** (TestRail section 3527 subtree, sections **3528–3553**),
> following `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`. Companion to `RUN331-STATE.md`.

## 1. What was done (COMPLETE)
- **All 252 CORE cases (26 sections 3528–3553) reworded to build-accurate, layman,
  jargon-free wording and pushed to TestRail via `update_case`: 252 UPDATED · 0 no-op ·
  0 failed · every push re-verified 200/200.** (TestRail writes were authorized for this pass.)
- **Safety net:** verbatim pre-edit snapshots of all 262 in-scope cases committed to
  `testrail-snapshots-2026-07-13/` (rollback baseline).
- **New local editable source:** `cases-2026-07-13/*.json` (one per case, with
  `viu_status` / `evidence` / `fresh_run:2026-07-13`) — the resumable checkpoint and the
  source of truth going forward (Custom Roles previously had NO local case bodies).
- **Section 3658 stub tree dedupe:** 3 confirmed duplicates DELETED (C27735 = dup of
  C26467; C27733 & C27737 = dup of C26429/C26371); **7 left + flagged for ruling**
  (`section-3658-dedupe-2026-07-13.md`).
- **Build glossary + evidence:** `wording-glossary-2026-07-13.md` +
  `screenshots/wording-2026-07-13/` (labels captured directly from the shipped build
  Vue chunks — a more exact source than pixel screenshots). Live roles matrix:
  `roles-matrix-2026-07-13.md`.
- **Audit log:** `testrail-wording-viu-log.md` (per-section, per-case).
- **Deliverables:** `CustomRoles_WordingVIU_2026-07-13.xlsx`/`.csv` (tab per bucket +
  Summary; Case ID + clickable TestRail Link columns, Rule 8) +
  `CustomRoles_Blockers_Tracker_2026-07-13.md`.

## 2. Tally (252 core cases)
| Bucket | Count | Meaning |
|---|---:|---|
| **VIU-Verified** | 30 | Label/structure confirmed from the shipped build, or role facts confirmed from the live roles API |
| **Blocked-UI** | 214 | Wording corrected + pushed; behavior needs a live UI pass (role editor not drivable headless — see §4) |
| **Deviation/Finding** | 8 | Build differs from the old case / prior FAIL / stale premise — route to dev or re-test live |
| **TOTAL** | 252 | |

## 3. Notable build-vs-spec/case findings (from reading the live shipped build)
1. **AP/AR toggle build label = "View and Manage AP/AR Data"** (NOT the spec's "Manage
   Accounts Payable and Receivable"). All tester-facing text corrected to the build label.
2. **Settings has 7 sub-toggles incl. Integrations** (App Settings, Service, Parts,
   Finance, Integrations, Data Import, View/Manage Wages) — the earlier "Integrations
   missing" flag (C26441) is RESOLVED/BUILT.
3. **QuickBooks stays under Integrations** (Integrations sub-toggle gates IBS/Open
   API/QuickBooks; Finance gates only Payment Methods/Taxes). The "QuickBooks Relocation"
   premise (QB→Finance, Integrations removed) is STALE — C26529/C26530/C26531 corrected;
   this matches the 09-Jul spec fact and 3658 stub C27738.
4. **Administrator is EDITABLE** (live API) — only **Office User** and **Time Clock User**
   are non-editable. C26510 (migration) corrected; C26543 verified.
5. **SFD-disable prompt now built** — `FinancialDataDisableConfirmModal` ("Disable See
   Financial Data?") is wired into the editor; C26475 (a RUN331 FAIL) appears implemented —
   recommend a live re-test.
6. **"Delete / Reverse" column** on Invoicing & payments (C27740) build-verified.
7. **Duplicate Role feature exists** (RolesPermissionsDuplicate route) — C26322/C26325's
   "no Duplicate" premise may be STALE (flagged for live confirm).
8. **C26538 similar-role warning** is about identical PERMISSIONS ("Similar role already
   exists" / "Create anyway"), not duplicate NAME.
9. **C26387/C26388** were RUN331 FAILs (Add Customer/Add Asset still shown with Customers
   Create & Edit off) — flagged for live re-test.

Build strings confirmed verbatim: 'Role created/updated/deleted successfully.', 'Enable/
Disable See Financial Data?', 'Reset to template', 'Role name*', '… is a required field',
disabled-Delete tooltip, 'Full administrative access', 'View History Logs', 'Full View' /
'Tech view', 'Cross-Cutting Toggles', all permission-card titles/descriptions.

## 4. Why 214 are Blocked-UI (honest)
The Custom Roles role editor and roles-list page **could not be driven headless in this
harness** (established in RUN331: role-editor SPA route unreachable headless). So the
*behavior* of permission on/off, cascades, prompts, and per-role gating needs a real
manual UI pass. What WAS done: every case's **wording** is now build-accurate + pushed;
label/structure facts are build-verified; per-role permission sets are live-verified via
`GET /api/roles/{id}`. No behavior was faked as Verified.

## 5. How to resume (the behavior VIU)
1. Cookies: `/tmp/custom-roles/cookies-viu-0713.env` (staging; quick-login ROTATES
   PHPSESSID — carry the new one). Build a fresh MITM/boot2 bridge for UI driving.
2. Seed a custom role per case in the editor, assign a user, log in, observe; RESET Tech
   to **Time Clock User `a0359055-3dfb-4e9c-9e11-2fbea21585c2`** after any switch
   (EXACT email match `tech@shopview.com`). Tech was NOT changed in this pass.
3. Work from `cases-2026-07-13/*.json`; update `viu_status`/`evidence` as behavior is
   confirmed; re-push only changed fields.
4. Prioritize the 8 Deviation/Finding cases (dev/re-test) and the flagged items in §3.

## 6. Env / access
- Staging: SPA `app.staging.shopview.com`, API `api.staging.shopview.com`; org
  `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. Cookies ~24h; cf_clearance works.
- TestRail: project 1 / suite 1; `update_case`/`delete_case` via curl + Basic auth
  (creds in `/tmp`). **No settings or roles were changed on staging in this pass.**
</content>
