## STAGING — permissions, roles and location switching (proven live 2026-09-28, build v26.39.1-02c6b6c)

Everything below was measured on `app.staging.shopview.com`, organisation
`d55bc308-e61a-438d-b5f1-c7a73c89d49f` ("Foothill…"), workplace **Staging Heavy Duty - 9919**
(`b3c8c820-f815-4cf1-8938-10956c5ee71a`). Lethbridge is `f8a8b802-7780-4b16-bf10-343caeb616b2`.
Both are `America/Edmonton`.

### Driving a permission matrix without a second human login

Quick-login offers exactly two keys on staging: **`admin`** and **`tech`**. To test any other access
level, **give the Tech account a purpose-built role and sign in fresh as Tech**:

```
POST /api/staff/{staff_id}/change
     {first_name:'Tech', last_name:'ShopView', email:'tech@shopview.com',
      workplace_id:<WP>, role_id:<ROLE>}          -> 201
```

- **Tech's `staff_id` is `d2cb20a6-90a8-4884-ac50-022ff2fb9313`** and its user id is
  `ba74948b-…`. 🔴 **Tech is NOT one of the 28 rows in `GET /api/staff`** — you cannot confirm the
  change from that list, and looking for it there returns "not found" on a change that worked. Read
  it back with `POST /api/quick-login {key:'tech'}`, whose `data.role` carries the role's **name and
  its full `fePermissions` list**. That same response is where the `staff_id`, `user_id` and email
  come from in the first place (`data.details`).
- **NEVER swap the role of a session that is already open** — sign in fresh afterwards. The stock
  Technician role to restore to is **`af8d02b5-ecd1-4205-a82f-32a4d5bb1015`** (6 permissions:
  `workOrdersView`, `customersView`, `scheduleView`, `woPickParts`, `woTechViewMode`,
  `workOrderLinesCreateAndEdit`).
- **`GET /api/iam/list-roles` returns roles for EVERY organisation** — 6,853 rows of
  `{id, code, label}` on this estate. Matching by label alone will hand you another company's role.
  The `ZZAUTOTEST …` fixtures are unique by name and therefore safe; `Office User` and `Technician`
  are **not** (618 candidates each). Take the Technician id off the staff rows or off quick-login.
- Role **creation** works as `seed_roles.py` documents (`fePermissions` must be a list of bare uuid
  strings). Two fixtures were added on 2026-09-28: **`ZZAUTOTEST Full Access`** (the union of the
  seven minus-one roles, so each of those differs from it by exactly ONE bundle) and **`ZZAUTOTEST
  Part Sales Only`**. Manifest: `build/global-search/seeding/seed-manifest-pertab.json` for the
  per-tab data; the roles are listed in `/tmp/staging/role-ids.json` at run time.

### The permission → search-group mapping, confirmed end to end

Removing one bundle removes its **group, its count AND its scope tab** together:

| bundle removed | what disappears |
|---|---|
| `workOrdersView` | Work orders |
| `customersView` | Customers **and** Assets (one permission, two groups) |
| `catalogInventoryView` | Parts |
| `partSalesView` | Part sales |
| `vendorOrderManagementView` | Vendors, Purchase orders **and** Vendor invoices |
| `seeFinancialData` | **nothing disappears** — every group and row stays, only the amounts go |

The Time Clock role (3 permissions) returns **nothing at all**, whatever is typed.

### 🔴 The location lives in the BROWSER, not only in the session

`POST /api/iam/change-location {workplace_id, workplace_timezone}` moves the session — the search
endpoint immediately stops returning the other location's work orders — **but the screen does not
follow, even across a full page reload.** The app keeps `location` (and `current_shop_id`) in
`localStorage` and keeps sending it. A back-end switch therefore proves nothing about what a user
sees, and produces a very convincing false finding ("the old location's records are still listed").

- **Switch through the UI:** click the workplace name in the header → the user menu → **"Change
  Location: `<dropdown>`"** → pick the workplace. The dropdown is a `.q-field` inside `.q-menu`; the
  options are `.q-item`s in a second `.q-menu`.
- **Read the header back** (`/Staging [A-Za-z ]+ - \d+/`) before measuring anything.
- **Wrong timezone ⇒ HTTP 400**, silently, if your script only prints the measurement.

### 🔴 The mouse pointer selects the row that Enter will open

Whatever row sits under the pointer becomes the palette's selected row. **Clicking the header search
box leaves the pointer exactly where the panel then opens over it**, so a row lands under it and
Enter opens the wrong record. Park the pointer (`page.mouse.move(5, 5)`) before reading
`selectedIndex`, or open the palette with **Ctrl+K**. This is SV-10061 (closed OBSOLETE) and it cost
three wrong characterisations before it was found — see learning **L0233**.

### Smaller staging facts worth not re-discovering

- The palette's **All tab shows only the first FIVE rows of each group**; a record ranked sixth or
  lower reads as missing unless you open that group's tab. Two "not found" results on 2026-09-28
  were this, not the product.
- A work order's **Parts tab is `/workorders/{id}/part-requests`**, not `/parts`, and its label reads
  **"Parts (3)"** once it holds parts — an exact-match tab selector finds nothing.
- Editing a work order's URL to reach a sub-route answers **page-not-found**; the SPA needs the work
  order loaded, so click the tab.
- `POST /api/work-orders/create` needs **`{is_vehicle_here:false, company_id, vehicle_id}`** — sending
  `workplace_id` instead of the vehicle answers **500**.
- `POST /api/work-orders/change-status` accepts `complete` and `paid`; **`invoiced` is refused**
  ("cannot be changed manually") and `closed` is not a status name. A **part sale is a work order**,
  so the same call marks one Paid.
- A new customer, work order or part sale is findable in global search in **about 5 seconds**.
- **Supplier contacts (measured 2026-10-05):** list `GET /api/parts-catalogue/list-vendor-contacts?vendorId=<id>`;
  create `POST /api/parts-catalogue/add-vendor-contact` with `{vendor_id, first_name, last_name, title,
  telephone, email, department:'preferred'}`. The supplier itself reads at `/api/parts-catalogue/vendor/<id>`;
  its page is `/parts/vendor/<id>/contacts`. Supplier emails and contact first names repeat on staging,
  so find a contact by two fields (seed.py `also: {field: value}`), never by one.
- **Part sale (measured 2026-10-05):** `POST /api/part-sales` takes `{company_id, customer_id, vehicle_id}`;
  its page is `/parts/part-sale/<id>/part-requests`.
- **Customer delete:** `POST /api/customers/delete {company_id}`. Contacts and vehicles must go first.
- **Roles:** listing the roles is a `POST` (a `GET /api/roles` refuses); one role reads at
  `GET /api/roles/<id>`. The edit screen is `/administration/roles-permissions/<id>/edit`. Every staging
  role carries `workOrdersView`; **Time Clock User** has no customer access.
- **Dating the standard copy:** after a reset the branch's own records carry creation dates on or before
  the reset (last one: **2026-09-28 14:19:29**). Anything dated later was made since and is gone after
  the next reset, so it must be in a seeding plan (`seed-manifest-fixtures.json` holds the 86 that were
  made by hand on 2026-09-29).
- **QA-branch API host for the e2e harness (measured on `sv10043`, 2026-10-08):** a QA branch's API is
  `<branch>api.qa.shopview.com` (e.g. `sv10043api.qa.shopview.com`). Posting quick-login to the app host
  `<branch>.qa.shopview.com` answers **403**, which looks like an expired cookie and is not.
  `build/global-search/e2e/fixtures/boot.ts` now derives it; `GS_API` still overrides.

### WO Board / Tech View on a QA branch (sv10043, build v26.40.8-7a95011) — measured 2026-10-08
- **Display switcher:** `display_option_list` · `display_option_tech_view` · `display_option_board_view` (aria-labels
  "List" / "Tech View" / "Board View", the chosen one `aria-pressed=true`). The choice is saved in
  `GET/PUT /api/users/me/preferences/work-orders-list` → `value.display` = `list | tech_view | board_view`, beside
  `collapsedGroups`, `technicianOrder`, `pinnedTechnicianIds`, `density`. A never-used user has `value: null` (opens List).
- **Tech View test-ids:** group row `tech_view_group_<staffId|unassigned>` (`data-collapsed`), `tech_view_group_name_*`,
  `tech_view_group_count_*`, toggle `button_tech_view_group_toggle_*`, pin `button_tech_view_pin_*` (aria-pressed;
  4th pin disabled, tooltip "You can pin up to 3 technicians."), drag handle `tech_view_group_drag_handle_*`, rows
  `tech_view_row_<woId>` (`data-group-key`), row menu `button_work_order_more_actions`, columns
  `button_tech_view_column_selection` (menu items are `[role=switch][aria-label=…]`, e.g. "Assigned Techs").
  **Every eligible technician gets a group even under a search, and the table draws only the rows on screen** — a group
  further down is NOT in the DOM until scrolled to. Collapse Unassigned (1,100+ rows) first, then scroll the
  `.q-table__middle` until `tech_view_group_<id>` exists. The header kept at the top while scrolling is a separate
  drawn copy, not the group row.
- **Board View:** columns `board_column_<staffId|unassigned>`, horizontal scroller `.board-view__scroller`, column body
  `.board-column__body`; toolbar "Fields to display" (`[aria-label="Fields to display"]`, switches incl. "Line technicians").
- **Lead/advisor calls:** lead candidates `GET /api/work-orders/lead-technician-candidates`; lead
  `POST /api/work-orders/change-lead-technician {work_order_id, tech_assigned_id|null}`; advisor
  `POST /api/work-orders/change-service-advisor {work_order_id, service_advisor_id:<staffId>}`.
  **"Assigned to me" also counts work orders where you are the Service Advisor**, and whoever creates a work order
  becomes its Service Advisor — give other people's work orders another advisor when a case needs "not mine".
- **Settings > Staff** is `/administration/staff` (tabs Active(n) / Deactivated(n); "Search" is a button that opens the
  box; each row ends with an edit icon). This organisation's roles: `GET /api/organizations/<orgId>/roles?pagination[rowsPerPage]=1000`
  (sv10043/staging org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`) — `iam/list-roles` spans every organisation.
- **🔴 Changing YOUR OWN staff record's Time Clock (`clockable`) ends your session at once** (the next call answers 401;
  the change itself is saved, `clockableChanged:true`). Make the change, sign in again, check, change back, sign in
  again and read it back. Measured on Admin ShopView (needed to make "a location with no technicians").
- **Location menu:** initials > the orange button under "Change Location:" > pick. Seen 2026-10-08: after moving to
  Lethbridge the orange button still read Heavy Duty and picking Heavy Duty did nothing; a new sign-in starts at the
  default location. The API `iam/change-location` changes the server side only, not what the screen shows.
- **🔴 SEEING THE SCREEN AS ANOTHER PERSON (2026-10-08):** `switch-user` changes the server session only. The sign-in
  context re-writes the ADMIN's `user` and `fe_permissions_wrapper` into localStorage on every page load, so a page
  there keeps admin permissions: a view-only person looked able to reassign ("Drag a work order here…" instead of
  "No work orders"). Use `build/wo-board-tech-view/run498-2026-10-08/viewas.mts`: switch, then open a NEW context with
  the same cookies and the switched person's own user and permissions written before load; exit-switch afterwards.
  Server-side things (saved display, pins, sort) were right either way. A crashed run can leave the switch on:
  call `POST /api/exit-switch-user` at the start of the next script.
- **Staff form (Settings > Staff > edit):** "Deactivate Account" posts `POST /api/iam/change-status {id:<user id>}`, a
  toggle; the same call sets them active again. The Location field is ONE location, chosen from the locations the
  person is enrolled at (their departments). It saves `POST /api/staff/{staffId}/change … workplace_id`. Changing it
  did NOT stop Ayesha Khan, who is enrolled at both locations, being offered as a lead technician at Heavy Duty. A
  hidden `.q-dialog` sits in front of the open form, so scope Save & Close as `button:visible`.
- **`/api/contacts?company_id=` and `/api/vehicles?company_id=` ignore the filter** and return the branch's first rows.
  Reusing "the customer's vehicle" from them gave every test customer the same Ford Transit with no unit; make each
  new customer its own vehicle (`data.mts customer()` does now).
- **🔴 A DRAG FROM A CARD BELOW THE BOTTOM OF THE WINDOW DOES NOTHING — AND LOOKS EXACTLY LIKE A REFUSED MOVE
  (2026-10-08).** With six cards in one Board View column, the last ones sat below the window; mouse-dragging them
  moved nothing and showed no message, the same as a locked Invoiced/Paid card. Scroll the card into view first
  (`wob.mts drag()` does now), and always drag a card that SHOULD move (Declined/Complete) first in the same pass
  as the positive control — if the control does not move, the reading for the locked card proves nothing.
- **Line audit vs work order history:** the work order's change history is `GET /api/work-orders/{id}/history`
  (lead changes: `eventName` "Lead tech changed", `originalLeadTechName`/`newLeadTechName`). A LINE's own
  Audit log (line ⋮ > Audit log) is a separate list, `GET /api/work-orders/lines/{lineId}/history`; a technician
  changed in the Edit Line window is looked for there, not in the work order's history. The Edit Line window
  saves through `POST /api/work-orders/lines/change`.
- **Notifications page** is `/notifications` (top bar bell): it lists note mentions, "Unread only" on by default
  (`toggle_unread_only`), empty text "There are no notifications for selected filters".
- **Completing a line needs the work order's mileage first:** `POST /api/work-orders/change-mileage
  {work_order_id, mileage:'123456'}` (a STRING — a number answers 500), else the line answers 400 "Add the
  mileage to the work order before completing it."

#### WO Board — FAST RE-RUN RECIPE (everything learned running run 498, 2026-10-08/09; harness in `build/wo-board-tech-view/run498-2026-10-08/`)
**Start here; each line below cost at least one failed attempt.**
- **Run as our own test admin, never as "Admin ShopView".** Work Orders choices (pins, columns, fields, density,
  technician order) are saved PER USER and someone else uses the Admin ShopView login on this branch — their pins
  changed under a running batch. `runner.mts asRunner()` signs in once, switches to "ZZ WOB Runner" (Admin role, Time
  Clock off so it is never a technician column) and works in a page carrying that user's own storage. **After the first
  switch every call must go through the runner's own page** — a switch renews the session cookie and the sign-in page's
  older copy answers 401. Take other people in turn with `viewAs(..., RUN.toRunner)`; two "browsers" for two people =
  open the second person's page, switch back, act, switch to them again: their unrefreshed page acts as a stale board.
- **One queue, one session at a time.** Never run two batches at once (a switch-user in one changes the other's
  identity). Chain them in one script (`master*.sh` pattern: `ONLY=<case ids> wob.sh <batch>.mts`, `echo EXIT=`). A
  container restart kills the queue — check `m-*.log` for `EXIT=` and restart from the first unfinished batch.
- **Test data, fast and right:** one customer PER work order (`<prefix> <runNo> Alpha Co` …) so the List's
  customer-name order is known; lines added BEFORE the lead follow the lead (`derivedFromLeadTech`), lines added after
  have no technician. Work orders need a **contact** (`work-orders/create … customer_id:<contactId>`) or invoicing
  answers 500. Canned lines bring **vendor part requests**, and Complete is refused ("All vendor parts must be received
  before completing the work order.") until they are cancelled: `POST /api/work-orders/part/remove-request/{id}`.
  Order: mileage (STRING) → remove part requests → `lines/change-story` → `lines/change-status complete` →
  `change-status in_progress → ready_for_review → complete` → `invoices/create {work_order_id, issue_date, due_date}`
  → `change-status paid`. Paid is refused from Complete; Estimate = do not approve. A work order could NOT be created on
  an asset after `vehicles/change` reshaped it (500) — create the work order first, reshape after.
- **Assets:** `vehicles/change` takes `vehicle_maker_id`/`vehicle_model_id` (borrow from a `GET /api/vehicles` row whose
  `vehicle_make`/`vehicle_model` NAMES match — those are the name fields). A VIN once set cannot be removed ("Cannot
  remove VIN form vehicle"): make the asset without one. Cards did not show make/model set this way — **make assets
  for card checks through the New Asset form (UI)**, as the cases say.
- **Drags:** scroll the card into view first (an off-screen card "drags" and nothing happens — looks like a refusal);
  always drag a card that SHOULD move (Declined/Complete) first as the positive control. Board columns off to the right
  are not drawn: pin the technicians (runner's pref `pinnedTechnicianIds`) or scroll `[data-test-id="board_view_scroller"]`.
  Tech View: drop on `tech_view_group_empty_<id>` when the group is empty. Column/group drag = the six-dot
  `drag_indicator` icon in the header. Network-off cannot be used (the branch's "sleeping" page takes over): refuse the
  save with `route.fulfill(500)` on `board-move|change-lead-technician`.
- **Menus and fields:** List `button_column_selection` (`toggle_column_<camel>`), Tech View
  `button_tech_view_column_selection` (`toggle_tech_view_column_<snake>`), Board `button_board_fields_selection`
  (`toggle_board_field_<snake>`); density `button_density` → `option_density_compact|regular|comfortable` (selected
  shows a check). Status filter `filter_chip_status` (options incl. "In progress", "Imported", "Clear selection" —
  match unanchored, items carry icon text). Lead box on the work order page `select_lead_technician`: type the name's
  START ("ZZAUTOTEST Ben", not "Ben"). Option "Unassigned" — match unanchored too.
- **Work order page:** line name → Edit Line window (Add Technician ADDS, Save & Close); story row
  `line_tech_story_<line>` / pencil `button_tech_story_edit_<line>` open "Tech Story: …" (scope the textarea to
  `.q-dialog` — the AI line builder has its own textarea); `button_action_complete_line_<line>` opens the completion
  windows ("Tech stories", then "Receive parts" → "Complete Line"); split = tick `line_checkbox_<line>` →
  `button_line_bulk_action` → "Split work order". The New Work Order window has only Customer and Asset (no lead).
- **History:** work order `GET /api/work-orders/{id}/history`; a LINE's own Audit log
  `GET /api/work-orders/lines/{lineId}/history`.
- **Schedule edits** (what the Schedule sends): `PATCH /api/schedule/shifts/{id}` with `startsAt` (move),
  `startsAt + durationMinutes` (resize — `endsAt` alone is ignored), `staffId + reassign:true` (reassign);
  `scope:'shift'`. Delete `DELETE /api/schedule/shifts/{id}?scope=shift`.
- **Clocks:** check-in as the tech `{task_id:<line task id>, line_id, work_order_id}`; check-out needs the RUNNING
  record's id from `my-current-task` (`technician_task.id`). Stop every clock you start.
- **Notifications** page `/notifications` lists note mentions; positive control = `POST /api/note/create {type:'work_order',
  reference_id, content:'@Name …', mentions:[{referenceId:<user id>, label}]}` (appears at once).
- **Roles:** `seeFinancialData` is a cross toggle (`PUT /api/roles/{id}` with `fe_permissions` as ids + `cross_toggles`);
  the org role list can come back empty — take role ids from staff rows (`roleIds()`), or from a known person's row.
  Save the role first, put it back, read it back.
- **Locations:** departments are shared across locations; enrolment is a "Location/Department" pair (staff rows show
  `departments:["Staging Heavy Duty - 9919/Shop Time (Shop hand)"]`). `staff/{id}/change {departments:[ids]}` did NOT
  add a second location → use the Staff form (UI) or a person already enrolled at both (Ayesha Khan: Heavy Duty and
  Lethbridge). Switch with the location menu (initials → orange location button → pick).
- **Analytics:** the harness blocks Google Analytics by default; un-route it and read the events from the page's own
  requests (`en=` parameter) — DebugView is not needed.

### WO Board (sv10043) — three selector traps learned 2026-10-09 (each cost a whole batch)
- **The Status filter's options are TICK BOXES, not menu items.** `filter_chip_status` opens a `.q-menu` whose options
  (Estimate · Approved · In progress · Review · Complete · Invoiced · Paid · Declined · Imported) are `.q-checkbox`, so
  `.q-menu .q-item` finds nothing and times out. Use `.q-menu .q-item, .q-menu .q-checkbox` filtered by text.
- **The line bulk bar's menu button is labelled "More"** (bar: *N selected · Complete Line · Order (n) · More*); there is
  no `button_line_bulk_action` on v26.40.8. Split work order is under More.
- **Production profile menu (v26.40.13):** the location is a button under *Change Location:* showing the CURRENT location
  (e.g. *Truck Hill 1*); clicking it opens a second `.q-menu` listing the locations (current one ticked). Pick by exact
  text in the LAST `.q-menu`. In Edit Line's *Add Technician* list every option's text starts with the word `check`
  (an icon), so "not already ticked" cannot be read from the text.
- **Production test accounts:** `/tmp/shopview/prod-login.env` is the QA lead's OWN account — use
  `PROD_ENVF=/tmp/shopview/prod-login-second.env` (a Service Advisor test account, locations Truck Hill 1 / Trucks Hill 2 / SANKAN).
- **Side-menu links carry their icon's name in their text with NO space** (Reports: text content *autorenewWork In
  Progress*; Parts: the same), so neither `^\s*Work In Progress\s*$` nor `(^|\s)Work In Progress\s*$` matches (both
  tried and failed on 2026-10-09). Use `page.getByText('<label>', { exact: true }).last()` — it matches the label's own
  span — and take the LAST match (the side menu sits after the top menu in the page).
- **Keyboard on Board View / Tech View (v26.40.8, measured 2026-10-09, `evidence/probe-kbd.json`):** Tab stops on ONE card
  per board (roving focus: the first card has `tabindex=0`, the rest none) — every other card and the column headers are
  reached with the ARROW keys (Down/Up within a column, Right/Left across, Up from the top card = the column header).
  A Tab-only walk therefore "finds" one card and leaves the board; it is not evidence that the others are unreachable.
  Tech View: Tab stops on the first group header and its collapse button only; rows carry no tabindex. Use
  `kbd-batch.mts` (`walkBoard`, `arrowToCard`) rather than a Tab loop.
- **Profile photo upload (sv10043):** initials (top right) > Edit Profile (`/profile`) has an `input[type=file]`; setting a
  file there posts `POST /api/iam/upload-avatar`. The header avatar is an `<img>` from `/api/iam/view-avatar/<id>` on the
  API host. A view-as page starts blank — open the app before clicking `profile_menu_button`.
- **Queue hygiene trap:** `pkill -f "<text>"` also matches the shell running that very command (its command line
  contains the text), so it kills itself (exit 144) and can take a waiting chain with it. Find the PID first with
  `ps -eo pid,args | grep "[m]asterNN.sh"` and `kill <pid>`.
- **Work order page lists are VIRTUAL (sv10043, 2026-10-09, `evidence/probe-lines.json`):** the status card's Lead
  Technician select and the line window's *Add technician* select render ~30 options at a time; typing does not filter
  (the input is read-only). Scroll `.q-menu .q-virtual-scroll` until the name appears. Line window: remove a technician
  with `button_line_roster_remove_<staffId>`; a typed description is kept by pressing Enter once the list reads
  *No results*; `input_time_estimate` is a number box. The line menu opens from `line_number_<id>` (Request part, Add
  line note, Save as canned line, Story history, Audit log, Add inspection, **Edit labor**, Authorization required,
  Decline, Delete line). Timesheets is a TAB of the work order (three-dots > Timesheets), not a dialog; an Active clock
  row cannot be edited. Schedule rows load as the calendar scrolls.
- **`/register` on a QA branch needs the branch's SSO cookie but NO app sign-in:** a bare new browser context is sent to
  Google sign-in. Create the context with `storageState: { cookies: <only the sv_sso cookie>, origins: [] }`.
- **Staff routes, read from the app's own code (sv10043, 2026-10-09):** enrol a person at a location in a department —
  `POST /api/staff/enrollment/create {staffId, workplaceId, departmentId}` (camelCase; remove with
  `/api/staff/enrollment/remove`); delete a staff member — `DELETE /api/staff/{id}` (the staff row carries `deletable`);
  deactivate — `POST /api/iam/change-status`; edit — `POST /api/staff/{id}/change`; view — `GET /api/staff/{id}/view`.
  Schedule rows are drawn only for technicians in the **Service** department, so enrol a technician there before a
  Schedule check. `/settings/staff` opened directly renders blank for the switched-in test admin — reach Staff via
  initials > Settings > Staff.

### Account access (impersonation) on the Work Orders QA branch — route found in the app code (2026-10-09)
- Start: open `/impersonate-user/<user id>` (the staff row's `id`, NOT `staff_id`). The page shows "Please wait..." and switches. It does nothing if you are ALREADY in account-access mode — so run it from the admin's own session, never from a harness that has already switched to a runner user.
- Exit: the orange "Account Access Mode" bar's **Exit** — `[data-test-id="button_exit_impersonation"]`.
- API: `POST /api/switch-user {user_id}` · `GET /api/switch-user` (state) · `POST /api/exit-switch-user`.
- Script: `build/wo-board-tech-view/run498-2026-10-08/imp-batch.mts`.
- **Queue hygiene (2026-10-09):** `pgrep -f <name>` ALSO matches the shell that runs the pgrep, so `kill $(pgrep -f x)` kills your own command (exit 144). Find PIDs with `ps -eo pid,args | grep "[m]aster47"` (the bracket stops grep matching itself) — but run the kill in a command that does NOT also name the script (a `sed`/`nohup` on master47.sh in the same command line makes your own shell match too). And editing a waiting `masterNN.sh` with `sed -i` does NOT change the running copy (it holds the old file): kill it by PID and start it again.
- **Seeding an Estimate (2026-10-09):** `POST /api/work-orders/{id}/lines/create-from-canned-line {status:"authorized"}` on an Estimate work order **approves the work order**. To keep an Estimate, give it no line (or a line that is not authorized); to approve it later, adding an authorized line does it.

### Work order editing and the Parts pages' filters — confirmed by the QA lead (9 Oct 2026)
- **There is no "Edit Work Order" window for an existing work order.** The lead technician is changed in two places: a Board View / Tech View card's ⋯ > **Reassign lead technician**, or the **Lead Technician** field on the work order page's left-hand card (`select_lead_technician`). Mileage, Engine Hours (and Service Advisor, Sales Rep, Contact, Authorizer) are changed on that same card (`input_vehicle_mileage`, `input_vehicle_engine_hours`); the Customer PO is on the Finance tab. Lines are edited one by one: open the work order, click the line → Edit Line. A check written for an "Edit Work Order" window runs on that card (QA lead: *"ideally those checks use that card instead"*).
- **Parts > Purchase Orders, Vendors, Vendor Invoices have no Vendor or State/Province filter.** Each has the page's own **Search** (`page_search_toggle` / `page_search_input`, kept in the page address), the app-wide search at the top (whose tabs include Purchase orders, Vendors, Vendor invoices), and, on Purchase Orders, the columns button. A "keeps its filter after a reload" check uses the page's own Search — QA lead 9 Oct 2026: *"Typing something in the left side page search FILTERS the page to what you need"*, corrected by him the same day: *"Sorry I meant RIGHT side search"* — the page's own Search button at the RIGHT of the page header, next to New PO / New Vendor (`page_search_toggle`), NOT the app-wide search at the top Scripts: `run498-2026-10-08/editwo-batch.mts`, `run498-2026-10-08/parts-filter.mts`.
- **Saved list filters leak between batches (2026-10-09):** ticking a Status option on Work Orders SAVES it on the user (`/api/users/me/preferences/work-orders-list` → `filters`), and every later List/Board/Tech check by that user starts filtered — an "Imported" tick from a picture step hid every work order for an hour and made three checks look empty. `runner.mts` now clears saved filters when a batch signs in; a script that sets filters for a picture must clear them again.
- **Changing an asset (2026-10-09):** `POST /api/vehicles/change` refuses a payload without a VIN (*"Cannot remove VIN form vehicle, update to valid one"*) — always send the VIN.
- **Schedule shifts (2026-10-09):** a dropped shift can never be longer than the work's estimated hours (the + button disables at the estimate); on a non-working day the window says *"Couldn't read this shop's working hours. Reopen to try again."* — use a day the technician works. Choose lines → tick → **Select lines** → then the hours.
- **Edit Labor (2026-10-09):** the Technician field is multi-select — untick the old technician as well as ticking the new one; close an open list by clicking the window's title, not Escape (Escape closes the window).
- **Receiving a work-order part request (2026-10-09):** a vendor part request made with `work-orders/part/make-request` can come out on a purchase order marked **"Vendor missing"**; on its receive page (`/order/<orderId>?receive=1…`) **Receive Parts stays disabled until a Vendor is picked in the page's Vendor field** (and the Vendor Invoice # is filled). Pick it there, or `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds}` first.
- **Live board updates in a check (2026-10-09):** the harness blocks the live-update channel (mercure) by default. A check that needs the board to update by itself (a card leaving after another user's change) runs with `WOB_LIVE=1` (passed by `wob.sh`, honoured by `viewas.mts`). A page reload always puts focus back at the top of the page, so it can never show where the app keeps focus.
- **Lines and staff (2026-10-09):** removing a technician from a line asks **"Remove technician?"** (Remove / Cancel) when they are scheduled on it — confirm it. A staff member who has logged labor can NOT be deleted (`DELETE /api/staff/{id}` → *"Staff is being used elsewhere."*, also after clock-out), so a "Deleted user" labor row can only be found in existing data (`deleted-search.mts`). On a customer page, the asset list is under the LEFT card's own **Assets** tab.

### WO Board / Tech View suite — rerun on ANY environment in one command (2026-10-09)
`build/wo-board-tech-view/run498-2026-10-08/FAST-RERUN.md`: `GS_APP=https://<branch>.qa.shopview.com ./run-all.sh` runs the 50 FINAL scripts (only the checks each owns), sign-out last. Environment differences (API host, organisation, the two locations, session file) live ONLY in `profile.mts` + `profiles/<host>.json` (written once by `discover-profile.mts`). After adding a fix script, run `build-rerun-map.py` so the rerun picks the newest one.
- **Second organisation on v26.40.x (2026-10-09, corrected 14:15):** the `/register` FORM cannot be reached on this build — signed in it redirects to Work Orders, signed out (SSO cookie only) to Login. Send the form's own request instead: `POST /api/register` (an empty body first; its refusal names the fields). The new organisation holds only its administrator and cannot be signed in to from the branch. Supersedes the SSO-only step of §X for this build. The work-order CSV import needs the app's own headings, required ones starred: `*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount`.
- **Board View on a busy branch (2026-10-09):** the location filled up to ~200 technician columns (another team's "AaaE2E…" staff sort first), so a column can be ~57,000 px right. `toColumn` / `showCols` now scroll until the column renders or the board ends (up to 400 steps of 900 px) instead of stopping after 40.
- **Work order numbers differ between the API and the screen (2026-10-09):** the API returns `S-18522`, the list shows `S10043-18522`. Match on the digits after the last dash.
- **A Technician cannot open Reports (2026-10-09):** Reports shows "Access restricted" ("Looks like you don't have access to this page"). Any "while a report loads, signed in as a technician" step needs another page that loads (Schedule).
- **Board keyboard walk (2026-10-09):** the roving Tab stop can land on a card in any column; press ArrowLeft to the leftmost column (Unassigned) before walking right, or a card in Unassigned is never reached. Tech View collapse is measured by counting visible `tech_view_row_` rows (they are not inside the group element).
- **`annotate_v2.py --mark` positions are PICTURE pixels (2026-10-09):** with a 2x capture, double the page (CSS) box a script recorded — `x,y,w,h` = CSS × 2. Passing CSS values draws every box at half size, up and to the left.
- **After a picture step changes location through the initials menu, run the next step in a fresh process (2026-10-09):** the switch-back call left the open page at "ZZAUTOTEST Empty Shop", where no ready-made lines exist; a new sign-in starts at Staging Heavy Duty - 9919 again. Queue such steps separately (`ONLY=D8`).
- **Schedule shift blocks are not inside the technician's row element (2026-10-09):** find a shift by position (its middle inside the row's height), click it and match the work order number in its details. Drop targets: match the hour heading EXACTLY ("9 AM"); a loose text match picked a far-right column and the shift landed at 3 PM. A technician already clocked in elsewhere gets a "Stop <other> … / Start <this> …" window on Start: fill "What Have You Been Doing On This Line?" and press Start.
- **Customer page tabs carry counts (2026-10-09):** "Assets (2)", "Work Orders (4)", "Contacts (1)" — match `^Assets( \(n\))?$`, not the bare word.
- **Filter chips: match whole words inside the page, never the top menu (2026-10-09):** a chip's hidden text runs its icon name into the label ("personVendor", "placeLocation"), so the icon prefix must allow no space; and a bare "Customer" also matches the top menu's "Customers" and navigates away. Scope to `.q-page-container` and end the label with a word boundary.
- **A `// comment` added in the middle of a one-line script statement swallows the code after it (2026-10-09, 4 scripts):** the file still compiles, so a syntax check does not catch it — the dropped code just never runs (`ls is not defined`, `pg is not defined`, a line never saved). Put fix notes on their own line, and before queuing run: `grep -nE "//[^'\`\"]*(FIX|fix)[^'\`\"]*\b(const|let|await|for|if) [a-zA-Z(]" *.mts` — it must print nothing.
- **Two people at the same time need two REAL sign-ins (2026-10-09):** `viewAs` / switch-user turns ONE server session into another user, so "two browsers" made that way are one person taking turns. With live updates on (`WOB_LIVE=1`) the app notices the switch and signs the other browser out ("Session expired, please log in again."), and a script waiting on the board then hangs. For a concurrency check open the second browser with its own quick-login (`signIn()` from `global-search/e2e/fixtures/auth.js`) and never switch users mid-check.
- **A check that edits a shared role must put it back in `finally` (2026-10-09):** C97012 adds Work orders > Create & Edit to 'ZZAUTOTEST WO View Only' for one step; a run that stopped part-way left it on, and the "view-only" user could then open Reassign. Read the role back before any view-only check (`role-restore.mts`).
- **Two people share a name in the reassign list (2026-10-09):** two staff are called "ZZAUTOTEST Ben Bravo" (1 open / 50 open) — pick by `option_lead_technician_<staff id>`, never by name.
- **Part Sales > Add Part window (2026-10-09):** boxes are Part Number (type a new number, Enter), Description (required), Quantity, Source (defaults to "Vendor"), Category, Vendor, Cost, Core Charge, Sell Price, Margin. Find each by its own `.q-field__label` — matching on text alone takes the Source box for the Vendor box, because its value reads "Vendor".
- **Schedule shifts and the customer page, as measured (2026-10-09 probe):** a shift block is NOT inside the technician's row element (`.schedule-lane--technician` is only the 34 px name cell); find it on the grid by the customer name it shows, right of the names column, and read where it landed from `GET /api/schedule/board?from=…&to=…`. The grid scrolls itself to working hours after loading, so measure an hour heading only after `scrollIntoViewIfNeeded` and a pause. On a customer page click the `.q-tab` "Assets (n)" — the bare word "Assets" also sits in the left card and clicking it does nothing. A line's Labor row shows its first technician in `line_labor_name_<line>` and the others in separate rows under it — read the whole Labor block, not that one element.
- **Report and Parts filter menus (2026-10-09):** options are tick-box rows (`[role=checkbox]` / `.q-checkbox`), not only `.q-item`; read and pick from the last visible `.q-menu`. A chip's hidden text runs everything together ("personVendorkeyboard_arrow_down"), so no word-end rule on the label — keep the match inside `.q-page-container` instead.
- **A second quick-login does NOT end the first session (proved 2026-10-09, C368149):** `signIn()` in a new browser (Admin or `key='tech'`) gives an independent session; the first session stayed signed in. Use it for every "two people at once" check. Pins are per user, so in the second browser scroll to the test technician's column (`toColumn`) before reading it.

- **TestRail Defects field (2026-10-09, QA lead: "The failed test run links should have the related tickets.")** —
  a result's ticket must go into the result's `defects` field (comma-separated keys), which TestRail shows and links
  on the test; a key only inside the comment does not count. `push_results_to_run.py` fills it from every
  `browse/<KEY>` link in the record's `ticket` text, or from an explicit `"defects": ["SV-…"]`. There is no API to edit
  a past result: re-post the same status with the field set.
- **A ticket picture whose wiki name does not match the attached file renders as nothing (2026-10-09, SV-11104).**
  `size_pics.py` still reports the picture "found and sized" and the media node reads full-width, so only the
  rendered `<img>` count catches it. Before the PUT, check every `!name.png|…!` in the wiki exists under that exact
  name in the folder you attach from; after it, require img tags == pictures in the wiki.
- **Taking a technician OFF a location (2026-10-09, sv10043)** — two steps, in this order: (1) Settings > Staff > edit >
  **Location** = another location they are enrolled at > Save & Close (this only changes their MAIN location); (2) remove
  the enrolment at the old location (app route `POST /api/staff/enrollment/remove {staffId, workplaceId, departmentId}`;
  StaffDialog > EnrollmentsDialog). Step 2 alone is refused: *"Staff must be enrolled in at least one department from
  default location"*. Step 1 alone leaves them enrolled — that mistake produced a false report (D5). Restore: enrolment
  create, then Location back. `seedCase()` does NOT return work orders in plan order — pick them by lead.
- **Waiting for a QA branch to come back (2026-10-10, L0307).** Signed out, every `/api/...` path on a QA branch answers with the
  plain web page, so a curl ping can never tell up from down. Use `build/testing-tools/wait_branch_up.sh <run dir> <flag>`:
  it signs in through `wob-run.sh build-probe.mts` (the real action), prints its answer at start (positive control), then
  re-checks every 3 minutes. Still do one real check by hand before each message to the QA lead.
- **Schedule: a dropped shift lands SIX HOURS after the hour it was dropped on, and the remembered day (2026-10-10).**
  ⛔ CORRECTED the same morning: I first blamed the test browser's UTC clock. Re-run with `WOB_TZ=America/Edmonton`
  (the shop's zone, from `localStorage.user`), a drop under **1 PM** was still saved **07:00 PM – 09:00 PM** (read in the
  shift's own details), and under **9 AM** drawn at **3 PM** — the jump does NOT depend on the browser's zone. Production
  (shop on UTC) saved a 1 PM drop as 12:00–14:00, over the drop point. Finding: C368179 / draft D19. Readers must look for the
  block where it really lands (match the work-order number in its details), not under the hour dropped on. Also: **the
  Schedule remembers the last day viewed across reloads** — press **Today** first, then step to the exact day (`goRange()` in
  `high1-fix7.mts`); an hour regex like `13` also matches the mini-calendar's date — match `1 PM`. Earlier runs leave
  same-named shifts piled up ("+3 more" hides some): `WOB_SCHED_SKIP=n` lands on an empty day.
- **The Tech quick-login (2026-10-10):** he is "Tech ShopView", `tech@shopview.com`. `GET /api/staff?search=Tech` does NOT
  return him on sv10043 (54 others do); `search=tech@shopview.com` does. There is no who-am-I endpoint on this build
  (`/api/auth/me`, `/api/users/me`, `/api/auth/user` → 404); read the name from the profile menu instead.
- **Sign-out in a second tab freezes the headless test browser (2026-10-10, C368240).** After Logout in tab 2, BOTH tabs stop
  answering (a screenshot and even `evaluate('1+1')` time out) with no redirect loop, no dialog and no script error; with the
  request blocking off it still freezes, and the full Chromium build could not load the pages at all here. Tab 1 was seen to
  move to `/login` on its own in one of two runs. Treat as a manual check; do not call it a product fault.
- **Jira search moved (2026-10-10):** `GET /rest/api/2/search` now answers **410 Gone**. Use
  `GET /rest/api/3/search/jql?jql=…&fields=status,summary&maxResults=50` through `jira.sh`.
- **⚠️ TestRail `delete_case/{id}&soft=1` DELETES on this instance (2026-10-12).** Sent as a "preview the impact" call before
  the real delete, it returned `{}` and the case was already gone — the follow-up `delete_case` answered 400 because nothing
  was left. Treat ANY `delete_case` call as the real delete: snapshot the case body to the repo first (Rule 87), check
  `created_by` and `custom_atmstatus != 3` (Automated, Rule 71), then read back `get_case` → 400 "not a valid test case",
  with a positive control on a case that still exists. Record: `build/wo-board-tech-view/run498-2026-10-08/case-deletes-2026-10-12/`.
- **Second organisation on v26.40.8 (2026-10-12): NOT possible on sv10043.** `POST /api/register` (the call the app's own
  Register page makes) now answers **404 "'resource' was not found."**; `GET /api/organizations` lists only "Staging Foothills
  Group Inc". Supersedes the 9 Oct "send the form's own request" note for this branch. Tenant-isolation tests are Blocked here
  until a developer adds a second organisation (C368175, C154650).
- **⚠️ "The browser freezes after a sign-out / user switch" was the HARNESS (2026-10-12, C368240; days lost on it).** The
  sign-in helper (`global-search/e2e/fixtures/boot.ts`) adds an init script that writes the session into localStorage on EVERY
  page load. After a sign-out with TWO tabs open, both tabs then loop (both paused in the app's `getOrganizationFeatures`,
  read with CDP `Debugger.pause`) and stop answering — screenshots and even `evaluate('1')` time out. One tab alone does not
  freeze. Fix: for any sign-out / switch-user / session-change check, open a CLEAN context from the same signed-in state —
  `browser.newContext({ storageState: await page.context().storageState() })` — and use only it (`signout-fix6.mts`,
  `freeze-diag4.mts`). Diagnosis kit: `freeze-diag.mts` (pending requests + liveness), `freeze-diag3.mts` (debugger stacks).

### Schedule drop-time on production vs QA, by location time zone (measured 12 Oct 2026, Rule 121)
- Production `Administration > Locations > Truck Hill 1 > edit_note > Timezone`, then **Save & Close** — the button only answers a DOM click (`[...document.querySelectorAll('.q-dialog button')]` text `Save & Close` → `.click()`); Playwright `getByRole`/`getByText` time out on it. Script: `build/wo-board-tech-view/run498-2026-10-08/prod-tz-check.mjs` (`TZ_TARGET=<zone>`; reverts to Africa/Bangui in `finally`, read back).
- Production, location America/Edmonton: 1 PM drop → 13:00–15:00 (correct). Location Africa/Bangui (UTC+1): 1 PM drop → 12:00–14:00 (one hour early — pre-existing production fault). QA sv10043, America/Edmonton: 1 PM drop → 19:00–21:00 (six hours late — not on production ⇒ regression).
- Production has **no Board View / Tech View** on Work Orders (v26.40.16-2f213f3, 12 Oct 2026; reached via the top-menu *Work Orders*, URL `/workorders` — `/work-orders` is a "Page not found"). Board-only checks cannot be compared on production.
- Production timesheet move (C368177 comparison, 12 Oct 2026, location on America/Edmonton, three runs): a clock-in made at 02:49 AM shop time lists as *Today 02:49 AM – 02:50 AM* (correct); the row's pencil → *Line* → line 2 → *Save* opens **Confirm Overwrite** (overlap with the account's own long-running clock) → *Confirm* moves it to line 2. No "Start date cannot be set in the future". Line options carry a tick glyph first (`check 1 …`), so match `/(^|\s)2\s+\S/`, not `/^\s*2\b/`. Script `prod-timesheet-check.mjs` (finds the work order through `GET /api/work-orders?pagination[rowsPerPage]=200`). Note: the first run stopped the test account's own S1-2 clock that had been running since Apr 14 2026.
- **⚠️ (12 Oct 2026, L0312) The run 498 harness (`wob-run.sh` → global-search `boot.ts` / `session.mts`) DISPLAYS QA-branch times in UTC** — Schedule shifts and Timesheets read six hours later than the Mountain-time shop's real time, and editing a time entry there is refused as "in the future". The data is saved correctly. Judge any displayed date/time in a `qa-branch-boot.mjs` browser (sign-in page quick-login, nothing injected): `run498-2026-10-08/clean-tz-check.mjs`. The *"Schedule six-hour offset"* entry above is a harness artefact, not a product fault (SV-11229 obsoleted by the QA lead).
- **(12 Oct 2026) sv10043's "Staging Heavy Duty - 9919" is set to time zone Asia/Dubai** (state "Abu Dhabi") — not Mountain time any more. Check Administration > Locations before any time-of-day test; the Schedule's blue "now" pill must match it. A one-line work order dropped on a Schedule row is scheduled immediately (no window). Re-test scripts: `run498-2026-10-08/ah-seed.mts`, `ah-ui3.mts`, `ah-ui4.mts`.
- **(12 Oct 2026, Rule 125) sv10043 "Staging Heavy Duty - 9919" set to Asia/Karachi** (was Asia/Dubai). Set: `TZ=Asia/Karachi node build/wo-board-tech-view/run498-2026-10-08/qa-set-tz.mjs` (`TZ_TARGET`, `LOC` override). Prove: `TZ=Asia/Karachi node …/tz-match-check.mjs` (exit 0 = Schedule pill equals the browser clock and the user's zone equals the browser's).
- **(12 Oct 2026) GOOGLE ANALYTICS CHECKS WITHOUT GOOGLE ANALYTICS — the route that works (Rule 107.J–L, L0314).** ShopView
  has NO analytics report screens (searched every QA-branch JS chunk: only the event-sending code in `WorkOrders.*.js`). A check
  phrased "the Story 12 report shows…" is judged on the QA branch: (1) let analytics through (`WOB_GA=1`) and intercept
  `/g/collect` per user (`ga-week.mts` `tap()`; reads sendBeacon bodies via `route` + `postDataBuffer`); each event carries
  `uid` = that user and `ep.setting_source` default/saved/fallback/forced; (2) `WOB_FRESH_GA=1` gives each test user their own
  `_ga` browser id (`viewas.mts`); (3) `python3 run498-2026-10-08/ga_calc.py` applies the PRD formulas (S12-R4/R10/R11/R13,
  R7) and writes `evidence/ga-week-2026-10-12/report-figures.json`. Say in the result that the report page itself (the
  report owner's work in Google Analytics) was not looked at. Phases: `PHASE=day1|day2|c97026|fs1fix ./wob-run.sh ga-week.mts`
  (PHASE is REQUIRED; wob-run.sh passes it since 12 Oct — L0315). A "different day" step must be different in EVERY likely time zone of the Analytics property (unknown): run it at or after 09:00 UTC the next day.
- **(12 Oct 2026) Google Analytics facts, if the report page itself is ever needed.** Properties: QA + staging share
  `G-CMYCXL13C9`, production `G-Q8V1RLY7LK` (Confluence 865894403). Google sign-in from an automated browser is refused;
  PowerTools (`powertools.shopview.com`) redirects to Google sign-in; no test copy of PowerTools exists. A read-only key can be
  made by a person in ~2 min: developers.google.com/oauthplayground → Analytics Data API v1beta + Admin API v1beta →
  `analytics.readonly` → Authorize → Exchange → access token (1 hour). Store ONLY in `/tmp/google/ga-token.json` (chmod 600),
  read with `build/testing-tools/ga_api.py`, delete after. The QA lead's account (12 Oct) had NO Analytics accounts, so that
  route needs someone with Analytics access. The session's safety check asks for the user's explicit go before a pasted key is used.
- **(12 Oct 2026) Retesting run 498 after a new build — what to reuse (no rediscovery).** Per failed test, run its own batch
  script with `ONLY=<C-id> WOB_SCALE=2 ./wob-run.sh <script>.mts` (script per test: `STAGING-READY.md` table). Ahtasham's on-screen
  scenarios (offline drag SV-11074, Clear-shifts prompt SV-11126, line follows new lead SV-11128): `./wob-run.sh e84-seed.mts` then
  `cd build/global-search/e2e && TZ=Asia/Karachi QA_DPR=2 npx tsx ../../wo-board-tech-view/run498-2026-10-08/e84-ui.mts` (copy and
  rename both for the next build so earlier evidence is kept). Avatar hover (C96938): `avatar-check.mjs` reads every Tech View
  header avatar's `title`. A stuck technician clock: `FRESH_CLOCK=1` (L0316). **Run `build/testing-tools/ensure_bridge.sh` before
  every normal-browser script — the bridge dropped three times on 12 Oct (`ERR_PROXY_CONNECTION_FAILED`).**
- **(12 Oct 2026) QA branches turn ANY network error into the sleep page (L0317).** Offline tests (`ctx.setOffline(true)`) on a
  QA branch end on sleep.qa.shopview.com — QA-build-only code. Judge offline alerts on staging/production; on the QA branch use
  a refused request (`route.abort`/fulfil 500, as s4-batchD does) for the "card back + alert" part.
- **(12 Oct 2026, Slavcho) From v26.40.14-e84b3d1, Board/Tech View cards name the lead like the column header (the ACCOUNT name);
  the List still shows the staff-record name.** On QA data the two differ for most technicians (scrambled data) — expected, not a fault.
- **(12 Oct 2026) Analytics checks a MANUAL tester can run, no Google Analytics access.** Chrome/Edge F12 → Network → tick
  Preserve log → filter `collect` → click a request → Payload. Events list `en` (name), `ep.element_location` (list / tech_view /
  board_view), `ep.element_label` (field or density, e.g. `vin`, `total_price`, `comfortable`), `ep.setting_value` (on/off),
  `ep.setting_source` (default/saved), `uid` (the user). One request can hold several events. Ad blockers stop them; use a new
  private window per user. Worked text: `build/wo-board-tech-view/run498-2026-10-08/ruling-rewrites-2026-10-12/HOWTO.html`
  (used in C97026, C97033, C97034). Automated version: `ga-week.mts` + `ga_calc.py` (entry above).
- **(12 Oct 2026) Changing a TestRail case: `safe_case_edit.py`, one case at a time (L0319).** `python3
  build/testing-tools/safe_case_edit.py <id> <json with any of custom_preconds/custom_steps/custom_expected/title>` → guarded
  write + read-back; then `served_page_scan.mjs` with `<OUT>/evidence/` created and the bridge up. Plain-English setup blocks for
  ShopView data (technician eligibility, customer + asset, Approved work order + lead, bring to Complete):
  `build/wo-board-tech-view/run498-2026-10-08/ruling-rewrites-2026-10-12/preconds-trim/build_preconds.py`. Which of a run's
  cases we edited while Automated: `automated_edit_scan.py <run>` (L0320). What the QA lead answered earlier in this session:
  `find_ruling.py "<words>"`.

### WO Board / Schedule on STAGING (v26.40.17-ddb9ba1, 14 Oct 2026) — set-up that works first time (L0330)
- Technicians for Schedule checks: department EXACTLY **Service** (the Schedule shows Administration, E2E Test Department,
  Service, Work order status only); billable + Time Clock on. Wrong department ⇒ no Schedule row and shifts read "Unassigned".
  `/api/staff/{id}/change` does not change departments. Made by `run498-2026-10-08/stg6.mts` as `zz.wob.<first>.<last>.svc@…`.
- Sign-in for anything showing a time: `bootOrigin` with `/tmp/qa-cookies/staging-sso.txt` + `staging-full.json`
  (`PHPSESSID`, `cf_clearance`); prove with `TZ=Asia/Karachi node run498-2026-10-08/tz-match-staging.mjs` (exit 0).
  Heavy Duty set to Asia/Karachi 14 Oct (`stg6-tz.mts`).
- Empty-filter state: QB Location (no Estimate / In progress / Declined work orders); switch on screen, switch back after.
- Read a work order's shifts on screen: Schedule → arrow beside Today → magnifier → `input_schedule_search` = number → click
  each shift (`stg6-sched2.mts`).
- **(14 Oct 2026) Staging role list:** `GET /api/organizations/<org>/roles` answers 200 with an EMPTY collection, `GET /api/roles`
  is 405 (POST only = create). Roles are read from staff rows (`role_label`/`role_id`, staff.mts `roleIds`) or created on
  screen (Settings → Roles & Permissions → Create custom role). "ZZAUTOTEST WO View Only" and the location "ZZAUTOTEST F2 Empty
  Shop" exist only on sv10043 — on staging they are made by the second-pass set-up (`stg-setup-*.mts`).
- **(14 Oct 2026) Staging Administration routes:** Roles = `/administration/roles-permissions` (not `/settings/...`) → Create
  Custom Role → template modal **Skip** → `role_name_input` + permission switches `area_<area>_<view|createandedit|delete>`
  (e.g. `area_workorders_view`) → **Create** ("Role created successfully."). See Financial Data is off unless switched on.
  Locations = `/administration/locations` → **New Location**: Name, Address 1, City, State/Province (select), ZIP/Postal Code and
  **Telephone are all required** (the dialog stays open, no toast, red "… is a required field" under each); fields are found by
  their label (`getByLabel('Address 1')`, `/ZIP/`, `/Telephone/`). The creating admin can switch to the new location at once.
  Recipe: `run498-2026-10-08/stg-setup.mts` (idempotent).
- **(15 Oct 2026, L0339) Staging API shapes and names.** `GET /api/organizations/d55bc308-…/roles?pagination[rowsPerPage]=1000`
  → `data` is a plain list (32 roles; "ZZAUTOTEST WO View Only" = `8e20d1b6-83e5-4996-8d2b-54d2cd0c4e32`); `GET /api/roles/<id>`
  reads one. Board/Tech View headers = `GET /api/work-orders/board?tab=all` (`groups[].technician.firstName/lastName`); every
  staging technician's account name equals the staff name — to make them differ, account access as the technician
  (`/impersonate-user/<user id>`) then `POST /api/iam/change-name`, exit with `POST /api/exit-switch-user`. Staff screen:
  `/administration/staff`. Production comparisons: `build/testing-tools/prod-login-boot.mjs` (`bootProdLogin`).
