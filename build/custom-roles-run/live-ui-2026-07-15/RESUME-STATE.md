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

## SESSION STATUS 2026-07-15 (checkpoint 30a4674+)
- **STAGING SESSION EXPIRED** mid-run (quick-login tech -> 401, fe-permissions -> 409). Needs FRESH
  staging cookies to continue. Tech last-known role = Technician (Service Advisor run restored it 201;
  subsequent Foreman/Parts-Tech swaps all 403'd = no change) — could NOT live-verify after expiry.
  ON RESUME: supply fresh staging cookies, FIRST verify tech is Technician (quick-login tech), restore if not.
- **PROD ALIVE**, test staff = Office User (verified/restored). Prod role-swap via POST /api/staff/change works reliably.
- Send-to-Terminal DONE: staging 5 SHOWN (Admin/Parts Mgr/Senior SA/Service Mgr/Service Advisor) + 2 hidden
  (Technician/Sales Rep); Foreman + Parts Technician = pending (staff/change org-alignment intermittently
  403 — retry when admin+tech orgs align); Office User + Time Clock = WO didn't render (both lack invoicing anyway).
  Prod: terminal ABSENT org-wide (Truck Hill has no terminal) -> Send-to-Terminal hidden for all prod roles;
  observed Admin(reaches dialog,no terminal)/Technician/Service Manager(no New Payment).
- BLOCKER for user (if it persists): the intermittent staging staff/change 403 is a multi-org shared-env
  artifact (tech fixture 6fb22c1b not consistently in the admin's landed org). A dedicated staging test-staff
  account (username/password) pinned to "Staging Heavy Duty - 9919" would make staging role-swap deterministic.

## FULL DUAL MATRIX DONE 2026-07-15 (commit 3fe0cc0)
- ALL 14 prod roles + ALL 11 staging roles DEEP-observed (Send to Portal, New Line, Reviewed,
  See Financial Data, Take Payment, Send to Terminal, line Return, WO Delete, tabs/menus). Workbook
  tab "Full Dual Matrix". Both test users RESTORED (staging tech=Technician 44d03e75; prod test staff=Office User).
- HEADLINE: Send-to-Portal STAGING-LESS (prod SHOWN -> staging hidden) = Technician, Parts Technician, Office User.
- Caveats: prod Send-to-Portal = org-customer-portal gated; Send-to-Terminal = org-terminal gated
  (prod Truck Hill has none, staging Heavy Duty has one); WO Delete = WO-state dependent (confounded).
- STILL TODO (needs per-role data seeding — the deep-flow capabilities): Pick, Receive, Bulk Receive,
  Assign Vendor, Fix Part #, Add vendorless part, Order Parts, Core OK/Not-OK, Set Line Status,
  Approve/decline line, notes create/edit/delete detail, WO/line History detail, AP/AR, Invoicing
  create/delete-reverse, part-return approve/complete, create customer/asset from New WO. Each needs
  a seeded WO/PO/return/cored-part state per role in both envs.
- **SECURITY FLAG for coordinator:** the live test password appears verbatim in an INGESTED TICKET file
  `build/custom-roles-run/sv7388-done-tickets/SV-8165.md:101` (committed earlier by the ticket-ingestion
  task, commit ee7b7e9 — NOT this task). A live credential is in the repo. Recommend redacting it across
  the ingested tickets. Left untouched by this task (out of scope; verbatim ticket content).
  **⛔ ANSWERED AND CLOSED 2026-09-03 — the flag above is kept as written for the record, but it is NO
  LONGER OPEN and must not be re-raised. QA lead, verbatim: _"Prod is a test account no problem sharing
  its password in public repo."_ So neither redaction nor rotation is owed, and the ingested ticket stays
  as written. Scoped to that one production TEST account only — Rule 82 is unchanged for every other
  credential, which stays `/tmp`-only and is never committed. Full record:
  `build/PROD-VS-STAGING-COMPARE-METHOD.md` §1.**

## RESIDUAL CAPS — precise status + blockers (as of commit 93594f7, matrix 14 caps x 11 roles = 95%)
Tractable (observable with light seeding; partially explored):
- **Approve/Decline line:** STAGING DONE (estimate WO S9-25050 had a pending line — Admin/SM/SeniorSA/
  ServiceAdvisor/Foreman/PartsMgr SHOWN; Technician/Office/PartsTech/SalesRep/TimeClock hidden).
  PROD needs a WO with a PENDING (unapproved) line — the prod estimate S1-720 line was already approved.
  UNBLOCK: create a fresh prod estimate WO (New-WO flow) → its line is pending → observe per role.
- **Assign Vendor / Fix Part #:** OBSERVABLE on the WO **Parts tab** (per-part Vendor dropdown = Assign Vendor;
  editable Part Number field = Fix Part #; both present for Admin, screenshot staging/Admin/parts.png).
  Needs a per-role field-enabled check on a WO with part requests. TRACTABLE next.
- **Create customer/asset from New WO:** the New-WO creation modal (route /workorders/new redirects; opens via
  the "New" button wizard). Needs the wizard driven per role. TRACTABLE next.
- **See AP/AR detail:** gated by seeApArData cross-toggle; lives in a Reports/Accounts area (route not yet
  located). Needs route discovery + per-role nav. TRACTABLE next.
- **Invoicing create + delete/reverse:** Finance tab on an invoiced WO. New Payment (take payment) already
  observed per role; invoice create/void/reverse actions live in the Finance ⋮ / invoice view. Partially observable.

HARD blockers (need full PO/inventory lifecycle seeding — Parts MODULE at /parts/orders + /parts/deliveries,
NOT the WO Parts tab):
- **Order Parts action, Pick, Receive, Bulk Receive:** require a seeded Purchase Order + delivery in each env's
  test org, then driving /parts/orders + /parts/deliveries per role. BLOCKER: no PO/delivery seeded; WO-create
  and PO-create API endpoints not mapped this session. UNBLOCK: seed one PO + one delivery per env (ZZAUTOTEST),
  then observe the module actions per role (or sample representative roles).
- **Core OK/Not-OK:** needs a cored inventory part picked onto a WO line (staging cored PN P550848 per CLAUDE.md).
  BLOCKER: no picked-core line seeded. UNBLOCK: add a core part to a WO line, then observe the line-level Ok/Not-Ok control.
- **Part Return (approve/complete):** needs a returnable PICKED part + the return flow (line "Return" entry is
  present on staging; complete/approve is deeper). BLOCKER: no picked-returnable part seeded.
- **Set Line Status:** needs a line in an editable state exposing the status control. BLOCKER: line-state dependent.

Efficient unblock recommendation: pre-seed ONE reference state per env (a WO with a pending line + a part request +
a cored picked line; one PO with a delivery; one invoiced WO), tagged ZZAUTOTEST, then the observer can drive all
roles against those fixed reference WOs — avoids re-seeding per role. Alternatively accept representative-role sampling.

## SEEDING ATTEMPT RESULT 2026-07-15 (the precise hard blocker)
Executed the recommended unblock (seed reference states as admin). Findings:
- **WO create is NOT a simple REST POST** — `POST /api/work-orders` => 405 (no route/Allow:null);
  `POST /api/estimates` => 404. WO detail `GET /api/work-orders/{id}/lines` => 404 (SPA route != API path).
  The create flow is a multi-step SPA WIZARD (New-WO: pick/create customer -> pick/create asset -> save ->
  add line -> add part request), not a single mappable endpoint.
- Finding an existing prod WO with a PENDING unapproved line by rendering estimate WOs = expensive
  (per-render scan timed out at 8 WOs).
- Interactive Parts-tab editability (Assign Vendor/Fix Part#) is state-confounded on arbitrary WOs
  (no open editable part-request row).
**=> PRECISE HARD BLOCKER for the residual caps (Approve/Decline prod, Set Line Status, Core OK/NotOk,
Part Return complete, Order Parts/Pick/Receive/Bulk Receive, Invoicing create/reverse, create cust/asset
from New-WO): they need controlled reference states that (a) don't exist on arbitrary WOs and (b) can only
be created via the multi-step New-WO / PO / delivery / invoice UI WIZARDS (no simple create API).**
EXACT UNBLOCK (any one):
  1. A human/dev seeds ONE reference set per env (WO w/ pending line + open part request + cored picked line;
     one PO w/ pending delivery; one invoiced WO) tagged ZZAUTOTEST — then the existing observers drive all roles.
  2. OR an attended session to drive the New-WO/PO/delivery/invoice UI wizards headfully (fragile headless).
  3. OR map the create-endpoint sequence from the shipped SPA bundle (larger reverse-engineering task).
No ZZAUTOTEST data was created (all create attempts failed at the API-probe stage => nothing to clean).

## FULL-GRIND PROGRESS (2026-07-15, session-limit checkpoint) — RESUME HERE
Proven & documented: UI WO-create + unapproved-line + part-requests + WO-Delete (playbook).
Capability grind status:
- **#1 Core OK/Not-OK — IN PROGRESS, deep-flow blocker found.** Cored parts exist (staging PN
  **84-2005** core_charge=20 qty11, **58-12** core_charge=20 qty10). WO+line creation works; adding a
  catalog service auto-adds THAT service's parts as part-requests (Parts tab), but those aren't cored
  and aren't picked. **Blocker:** the "New Part Request" control to add an ARBITRARY part (the cored
  84-2005) to a line was NOT located on the Parts tab (only auto-service-parts show; "Save & Add Part"
  in New Line reopened a blank New Line). And the **inventory PICK flow** (pick core from bin ->
  Core Ok/NotOk line control appears) is unmapped. UNBLOCK NEEDED: locate the add-part-request control
  (likely line-expand or a row "+"/⋮) + the pick/accept-delivery surface (`/parts/deliveries`,
  `/accept-delivery/{orderId}` per simple-flow notes) driven as admin.
- #2 Approve/Decline: STAGING DONE. PROD needs a pending-line WO (recipe proven — seed on prod test org).
  Set Line Status: control not yet isolated (line Status column on Lines tab).
- #3 Order Parts/Pick/Receive/Bulk Receive: need PO + delivery seeded via `/parts/orders` + `/parts/deliveries`. Unmapped.
- #4 Invoicing create/reverse: need invoice in create/void state on Finance tab. Unmapped.
- #5 Part Return complete: need a picked returnable part + return flow. Unmapped.
- #6 create customer/asset from New-WO (the New-WO dialog HAS "Add" buttons next to Customer + Asset =
  create-customer/create-asset — observable per role, TRACTABLE next) + See AP/AR (route not located).
Seeded WOs this session ALL DELETED (7682ebcd, fdf545bd, 8bc3014e — verified gone). Tech=Technician; prod test staff=Office User.
NEXT EFFICIENT STEP: map the add-part-request + inventory-pick surfaces once as admin (the gating flow
for Core/Pick/Receive/Part-Return), then the remaining caps unlock together.

## SESSION 2026-07-15c (fresh cookies) — DEEP-FLOW UNBLOCKED via Simple Flow recipe
- Fresh staging + prod cookies supplied; BOTH sessions held the whole run. KEY FIX: Node built-in
  fetch ignores HTTPS_PROXY → run all node with **NODE_USE_ENV_PROXY=1** (node 22.22). Bridge port 44975.
- Confirmed Simple Flow inventory endpoints exist identically on Custom Roles envs
  (/api/inventory/orders, /deliveries; cored PN P550848 present). Orgs already hold 100 POs/deliveries
  → observed Parts-module FE gates on EXISTING data, NO seeding needed.
- **STAGING role access:** landed org = Foothills Group Inc 123 (d55bc308). Active holders for 7 roles
  (Admin/Senior SA/Parts Mgr/Service Advisor/Technician/Sales Rep/Time Clock) → switch-user by `id`.
  4 roles w/o holder (Service Mgr/Foreman/Office/Parts Tech) → role-swapped THROWAWAY
  **bilal.muzamil+20 (staff 0336686b, user 051292ea, wp b3c8c820 Staging Heavy Duty-9919)**;
  ORIGINAL role_id **7d1f3fc3** (restored, verified). staff/change 403 fixed by throwaway being on
  SAME location as admin's landed org. Org roles: Office c0f68bba / SM 8f74d272 / Foreman bf33f7af /
  Parts Tech 09dec847 (full list in tmp).
- **PROD role access:** test-staff role-swap POST /api/staff/change (id in body) + self-login, all 14
  roles; test staff RESTORED to Office User (verified). PO used I-26 6417ae16.
- **[DONE] Parts-module Order Parts (New PO) + Receive** — ALL 11 staging + 14 prod roles, live
  screenshots. 22/22 dual cells MATCH (no migration risk). Commits 1a8d5d6/c85e3fc/4b0f7cd.
- **[DONE] New-WO create Customer/Asset (New button + Add Customer + Add Asset)** — ALL 11 staging +
  14 prod roles. 30/33 MATCH; **3 STAGING-MORE = Parts Manager gains WO-create + create-customer/asset**
  (prod Parts Mgr had none). Commits 867872a/ce0fd41.
- Deliverable: added workbook tabs "Parts-Module Dual LIVE" + "New-WO Create Dual LIVE" + md §0c/§0d.
  Generators gen_parts_dual.py / gen_newwo_dual.py.
- STILL NOT VERIFIED (genuine per-cell blockers — need seeded reference states via multi-step SPA
  wizards, no simple create API): Core OK/Not-OK (needs cored PICKED line), Part Return approve/complete
  (needs returnable picked part), Set Line Status, Assign Vendor / Fix Part# (PO-detail editable row),
  Bulk Receive (PO-detail), Invoicing delete/reverse, See AP/AR. Send-to-Terminal already resolved
  (org-config gated). These remain the deep-seeding backlog.

## Cleanup checklist (do at very end)
- [ ] Restore prod test staff to Office User (d238a892)
- [ ] Restore staging tech to Technician (10fdbeaa)
- [ ] Delete all ZZAUTOTEST data (both envs)
- [ ] Exit all impersonations; confirm base sessions clean
- [ ] NEVER TestRail; NEVER commit secrets

## SESSION 2026-07-15d (better-technique pass) — CONVERTING technique-artifact NOT-VERIFIEDs
Both sessions held. Bridge rebuilt (port read live). NODE_USE_ENV_PROXY=1.
- **Target #1 prod finance (switch-user into REAL holders):** DONE. Prod org has real holders for
  only 6/14 roles. Office User = invoice-view **403 DENY** (2 holders, real). Service Advisor =
  invoice-view **200 ALLOWED** but finance panel crashes to /no-location under switch-user
  (location-store artifact; controls NV). SM/PartsMgr/PartsTech/Foreman = **no prod holder = genuine
  blocker**. Evidence: production/{Office_User,Service_Advisor,Administrator_finrecheck}/ +
  _prod-finance-switchuser-2026-07-15.json. Commit 8a24556.
- **Target #3 prod Part Return:** DONE (characterized). Parts-tab Actions column is lifecycle-gated
  (Requested=none, Awaiting=Receive); Return needs a received+picked part (none exist). NOT a
  click-probe miss. _prod-partreturn-2026-07-15.json. Commit 7fe7499.
- **Target #2 staging holderless finance:** DONE. **staff/change 500 CLEARED** (201) with fresh
  session + location-pin. Throwaway 0336686b/051292ea role-swapped to each of SM/Office/Foreman/
  PartsTech → switch-user → invoiced WO S9-24662 finance observed. All 4 = New Payment SHOWN +
  Issue Credit SHOWN; Reverse only SM. **Office User dual = STAGING-MORE** (prod 403 vs staging
  New Payment). Corrects §2's "Office finance hidden". _stg-holderless-finance-2026-07-15.json.
  Commit 4e0f3b3. Throwaway RESTORED to Admin (verified).
- **Target #4 staging Core OK/Not-OK:** STILL BLOCKED. No existing WO with a cored PICKED line;
  headless per-WO scan too slow on shared env. Needs a cored part (P550848/84-2005/58-12) picked
  onto a WO line (no create API) — dev/human-seeded or attended headful. Prod side prev-observed;
  dual pending.
- **WO Delete / Set Line Status / Part Return for the 4 staging roles:** WO-state confounded on the
  invoiced WO (need a non-invoiced WO w/ pending line + picked part per role) — not re-run this pass.
- **Cleanup verified:** staging throwaway=Admin (7d1f3fc3), staging tech=Technician (44d03e75),
  prod test staff=Office User, no active impersonation, no throwaway data, NO TestRail writes.
- Deliverable: appended §8 (better-technique pass) to Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.md.
