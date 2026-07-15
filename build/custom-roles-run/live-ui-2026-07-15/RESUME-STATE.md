# Full Live Matrix — RESUME STATE (auto-resume scaffold)

**Goal:** complete Prod-vs-Staging LIVE compare, every (role × capability × env) OBSERVED
with a screenshot; zero NOT VERIFIED unless genuinely impossible after seeding+role-assign.
Observed-only (Rule 12). Checkpoint-commit after every role.

## Access (secrets in /tmp ONLY — never in repo)
- Staging: `/tmp/custom-roles/stg.env` (+ `/tmp/cln/cookies.json`); quick-login admin/tech works.
- Prod: renewable self-login `POST /api/login {username,password}` — helper
  `/tmp/custom-roles/prodlogin.mjs` (creds `/tmp/custom-roles/prod-creds.env`). RE-LOGIN on 409.
- Bridge: `build/testing-tools/staging-bridge.mjs` (rebuild per session; read $HTTPS_PROXY live).

## Test staff for role-swap
- **PROD test staff:** `bilal.muzamil+serviceadvisorlimitedview@shopview.com`
  user_id `511514cf-9f10-49e0-8cfd-2d0f4848ed27`, staff_id `1e19e572-1c88-4d75-a8d6-551bb22a21fc`.
  **ORIGINAL ROLE = Office User (d238a892-23ae-4a24-891d-eb14027c9974). RESTORE AT END.**
- **STAGING test staff:** tech `tech@shopview.com` staff `6fb22c1b…`, restore role Technician `10fdbeaa…`.

## Prod roles (14) — assign to test staff, log in as staff (pass in creds), observe, restore
Administrator 66983cac / Service Manager 7bebaa8c / Service Advisor 81c91848 /
SA No Reports 3dc0de27 / SA Technician 9c49200d / SA Limited View e89813fa /
Foreman ad38f780 / Technician ae21eedf / Parts Manager c2e48f18 / Parts Technician c5136e7f /
Reporting cec81f11 / Office User d238a892 / Sales Representative 01706c35 / Time Clock User 88bc3e89

## Staging roles (11)
Admin 9b3fc6be / Service Manager 0fb1333c / Senior SA 62c28d64 / Parts Manager b7d68907 /
Service Advisor 32dc4355 / Foreman 8d704f89 / Office User 9b36bb9f / Parts Technician 3bd9ac57 /
Sales Representative 0767df32 / Technician 10fdbeaa / Time Clock User 36462edb

## Progress log (update every checkpoint)
- [done] Staging WO-detail caps (6) all 11 roles — commit 90ecc26 (portal/findata/newline/reviewed/lineBulk/financeTab)
- [done] Prod WO-detail caps 6 roles via switch-user — commit e95db5a / 227d651
- [done] Prod self-login (renewable): POST /api/login {username,password} -> helper prodlogin.mjs
- [done] **Send to Terminal CRACKED (staging): EXISTS** in New Customer Payment dialog on an
  invoiced WO w/ balance (Finance -> New Payment). Observed SHOWN Admin/Parts Mgr/Senior SA;
  hidden Technician/Sales Rep. Good staging invoiced WO w/ balance: 35cd5c68-bf9d-4026-a5ca-6f9f8bffd663
  (S9-24662); warm-render WO: fca75d39-33fd-4c1b-847e-84055556022c (S10-25108). Observer: /tmp/custom-roles/st-observe.mjs
- [BLOCKER] staging staff/change role-swap returns 403 "Access denied" intermittently (admin
  quick-login lands in a shifting org context on the SHARED env). switch-user is unaffected.
  -> for staging roles w/o an active user (Service Manager/Service Advisor/Foreman/Parts Tech),
  retry role-swap when org context allows, or find active users.
- [BLOCKER] staging org context is VOLATILE (WO ids valid one moment, 404/redirect next; org
  name flips e.g. "Staging Heavy Duty" vs "QB Location"). Re-fetch a renderable WO per session.
- [done] Send to Terminal — PROD via test-staff role-swap (Administrator/Technician/Service Manager
  observed). KEY: prod org "Truck Hill 1" has NO terminal configured -> "Send to Terminal" button
  ABSENT in the New Customer Payment dialog for ALL prod roles (observed live for Admin who CAN reach
  the dialog). New-Payment reachability is role-gated (Admin yes; Technician/SM no). So Send-to-Terminal
  is ORG-CONFIG gated, NOT a role/build migration risk. Dual verdict Admin = STAGING-MORE (staging
  Heavy Duty org has a terminal; prod Truck Hill doesn't). Prod change endpoint = POST /api/staff/change
  (id in body), NOT /{id}/change. prodlogin.mjs + prod-st.mjs. **Prod test staff RESTORED to Office User (verified).**
- [ ] Send to Terminal — staging remaining 4 role-swap roles: RETRY with LOCATION PINNING.
  FIX (from user): keep admin AND test/tech user on the SAME location. Admin currently on
  "Staging Heavy Duty - 9919". Discover change-location endpoint, pin both to it, then staff/change 403 clears.
  Locations: QB Location, NEW LOOK WIG & Fascinator, Staging Heavy Duty - 9919, No QB Location, LocAtion, Empty, Staging Lethbridge - 4310.
- [ ] Remaining ~25 capabilities x roles x both envs (see capability set) — deep per-role observation +
  data seeding (ZZAUTOTEST): the bulk of the matrix. Menu-gated caps (WO Delete, Remove part, WO Lines
  Delete, Set Line Status, Core OK/NotOK, notes CRUD, History) + Parts-module caps (Pick/Receive/Bulk
  Receive/Assign Vendor/Fix Part#/vendorless/Order Parts) + AP/AR + Invoicing view/create/delete-reverse
  + part-return + create customer/asset from New WO + tech-vs-full.
- [ ] Deep WO-detail caps (menus): Remove part, WO Delete, WO Lines Delete, Set Line Status,
      Approve/decline line, Core OK/NotOK, notes CRUD, WO+line History, Complete
- [ ] Parts-module caps: Order Parts, Pick, Receive, Bulk Receive, Assign Vendor, Fix Part#, vendorless part
- [ ] Cross caps: See AP/AR, Invoicing view/create/delete-reverse, part-return approve/complete,
      create customer/asset from New WO, tech-vs-full view
- [ ] Prod remaining 8 roles via role-swap of test staff

## Cleanup checklist (do at very end)
- [ ] Restore prod test staff to Office User (d238a892)
- [ ] Restore staging tech to Technician (10fdbeaa)
- [ ] Delete all ZZAUTOTEST data (both envs)
- [ ] Exit all impersonations; confirm base sessions clean
- [ ] NEVER TestRail; NEVER commit secrets
