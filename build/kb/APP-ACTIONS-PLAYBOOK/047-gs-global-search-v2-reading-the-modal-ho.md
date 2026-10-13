## §GS — GLOBAL SEARCH V2: READING THE MODAL HONESTLY (proven live on sv9160, 2026-09-14)

Everything here was paid for twice. Read it before writing any probe against global search — the
selectors below are the app's own, so nothing in this section needs discovering again.

### The app labels its own results — never guess a row selector

| What you want | Selector |
|---|---|
| The search box in the header (opens the modal) | `[data-test-id="global_search_trigger"]` |
| The input inside the modal | `[data-test-id="search_modal_input"]` |
| The tab strip | `[data-test-id="search_modal_tab_strip"]` |
| One scope tab | `[data-test-id="search_modal_tab_<slug>"]` |
| The "N results found across M categories" line | `[data-test-id="search_modal_result_count"]` |
| A group heading | `[data-test-id="search_group_header_<type>"]` |
| **A result row** | `[data-test-id="search_result_row_<type>_<n>"]` |

Tab slugs: `all` · `work_orders` · `customers` · `assets` · `parts` · `vendors` · `part_sales` ·
`purchase_orders` · `vendor_invoices`. The row's `data-test-id` carries the TYPE, so a row's group is
read off the row itself and never inferred from the query, the title or the Expected prose (two
earlier attempts at inference both produced confident, wrong findings — "pro**vin**ce" matched `/vin/`).

### 🛑 The four traps, each of which produced a finding that was not real

1. **THE MODAL REMEMBERS ITS SCOPE TAB ACROSS CLOSE/REOPEN.** Escape and reopen lands on whatever tab
   the previous search selected. Every probe that clicks a scope tab therefore poisons the *next*
   observation's "All" view. **Click `search_modal_tab_all` explicitly before reading the All view**,
   and record which tab it opened on. Symptom: the strip counts 16 across 5 categories and one row
   renders.
2. **THE API IS ON A DIFFERENT ORIGIN.** It is `https://<branch>api.qa.shopview.com/api/search?q=…`
   — **no dot before `api`**. An in-page `fetch('/api/search?q=…')` resolves against the front-end
   host and returns the SPA's `index.html`; a parser then records `{error}` and any comparison built
   on it **fails open and reports agreement without comparing anything**. Prefer
   `page.on('response')` and read the answer the app already received.
3. **THE RESULTS BODY SCROLLS** (`search-modal__body`, e.g. scrollHeight 842 vs clientHeight 668).
   Filtering rows by `getBoundingClientRect()` size turns "further down the list" into "missing".
   Count rows from the DOM **unfiltered**; keep geometry as an attribute, not a filter.
4. **COUNTS SETTLE LATE.** A long query still reads `All (0)` at 2s and settles at ~4s. Require
   **three consecutive identical reads AND ≥5s**, and require the counts to be *present* — a tab strip
   rendered without its counts looks stable and is not settled.

### The location trap applies to the RUN, not only to seeding

Work orders and part sales are scoped to the current workplace. The seeder pins itself to the
`Heavy Duty` workplace before creating anything; a browser session signs in separately and uses the
admin user's default, so **an unpinned probe can read seeded jobs as missing**. Pin it first:

```
GET  /api/staff/my-workplaces                 → pick the one matching the manifest's name hint
POST /api/iam/change-location  {workplace_id, workplace_timezone}
```

### Three signals, and they must agree before anything is believed

The tab-strip counts · the modal's own "N results found across M categories" line · the
`/api/search` response the page received. **A disagreement is not a finding — it is a reason to look
again** (longer settle, then re-read). Only a disagreement that survives that is worth a human's time.
And the count agreeing is *not* the test: check that a type the server says has rows **actually
renders rows**, which is the failure the QA lead caught by hand.

### Keyboard

`Control+k` — **lowercase `k`**. `Control+K` sends Ctrl+Shift+K and does nothing.

Working executors: `build/global-search/tickets-2026-09-14/RUN_exec2.mjs` (query cases) and
`RUN_special.mjs` (shortcut, header hint, three widths, row navigation, analytics).

### §GS.1 — RUNNING A PERMISSION CASE WITHOUT CREATING A USER (proven on sv9160, 2026-09-14)

Quick-login offering only **Admin** and **Tech** blocks quick-login, not being a different user.
`GET /api/staff?limit=200` lists every staff member **with their role label**; sv9160 carries 66
across five roles (Admin 32 · Technician 22 · Sales Representative 6 · Foreman 5 · Senior Service
Advisor 1). `POST /api/switch-user {user_id}` becomes any of them — nothing created, nothing edited,
nothing to restore. Prefer it to the Tech role-swap (§G) whenever a holder already exists.

**The positive control is the test.** "This role cannot see work orders" and "my session broke" are
the same empty screen. Before observing anything, read back `localStorage.fe_permissions_wrapper`
(`template_slug` + permission count) and the user's email and confirm they CHANGED. A 200 from
switch-user is not that proof. A role whose identity did not change is an instrument failure and must
never be written up as a permission finding.

**One browser per role.** Changing who you are mid-session bounces the SPA to `/no-location`, which
reads as a permission result and is a technique artifact (§G).

Working script: `build/global-search/tickets-2026-09-14/RUN_roles2.mjs`.

### §GS.2 — TECHNIQUES THIS PASS PAID FOR (sv9160, 2026-09-14)

Small things, each of which cost a wrong reading before it was got right.

**Identity after impersonation.** `localStorage.user` and `fe_permissions_wrapper` are written at
sign-in and are **not** refreshed by `POST /api/switch-user`. Read `GET /api/auth/me/fe-permissions`
for the truth, then clear both keys and reload so the app renders as that user. (`GET /api/auth/me`
itself answers **404** here.)

**Switching location.** `POST /api/iam/change-location` returns 200 and the header goes on showing
the previous location — the browser session does not move. For anything a user would see, **switch
through the location control on screen** and confirm the header changed before comparing anything.

**Is an icon different per type?** Every row's icon carries the same generic class, so the class
answers nothing. Take the **SVG's own shapes** (`path` `d`, `points`, circle attributes) as the icon's
identity. Measured: five types, five distinct shapes.

**What is highlighted?** Do not match `/active|selected|highlight/` against class names — it picks
rows four down the list. Read the input's **`aria-activedescendant`**, which is the app's own answer,
and keep `aria-selected` as the secondary check.

**Before testing a keyboard behaviour, click nothing.** A freshly-opened panel is already on All;
clicking a scope tab first can move the highlight and turn a probe artefact into a finding.

**Reading a work order back.** The create answers 201 with the **id but not the number**. Search on
the work-order list is broken (the manifest says so). Read it back with
`/api/work-orders/view/<id>`, which is the only reliable route.

**Analytics.** GA4 posts carry the event name as `en=` in the BODY, and `sendBeacon` bodies are not
always exposed to a request listener — intercept the route and read `postDataBuffer()`, and count the
posts whose body you could not read rather than reporting "no such event".

### §GS.3 — WHAT WORKS AND WHAT DOES NOT FOR ROLES ON sv9160 (measured 2026-09-14)

Recorded so the next session does not spend the time again.

| Want | Route | Result |
|---|---|---|
| The list of role templates | `GET /api/role-templates` | **200**, `data.role_templates[]` — 11 of them, including **Time Clock User**, Parts Manager, Parts Technician |
| The organisation's roles | `GET /api/roles` | **405.** `GET /api/organizations/{org}/roles` needs an organisation id that is **not** in localStorage (only `default_workplace` is there) |
| Staff and their roles | `GET /api/staff?limit=200` | **200** — carries `role_label` but **no role id anywhere** |
| Act as another person | `POST /api/switch-user {user_id}` | **works**, with the staff-list id. Refuses inactive accounts by name: *"Cannot impersonate an inactive user."* Some accounts answer *"Access denied."* — try several |
| Change a staff member's role | `POST /api/staff/{id}/change` | **404 *"'Staff' was not found"*** with the staff-list id. `/api/staff/{id}`, `/edit`, `/view/{id}`, `/api/iam/users/{id}` all 404 or 405 — **no id that works was found** |

**So: impersonation yes, role assignment no (from behind the app).** Four non-admin roles are reachable
by impersonation on this branch — Technician, Foreman, Sales Representative, Senior Service Advisor —
which is enough for any case that compares a role WITH a permission against one WITHOUT it.

**After impersonating, read identity from `GET /api/auth/me/fe-permissions`** (`template_slug` and the
permission count), never from localStorage: that copy is written at sign-in and does not change.
**Do not clear localStorage to force a refresh** — removing `user` *or* `fe_permissions_wrapper`
signs the app out and the bounce to the sign-in screen reads exactly like a permission result. Nothing
needs clearing: the RESULTS come from the server, which already knows who the session is.

Measured: technician = 6 permissions, sees jobs, customers and vehicles only; foreman = 23, additionally
sees parts and suppliers; administrator = 43.

### §GS.4 — CHANGING A STAFF MEMBER'S ROLE ON sv9160: WHY IT CANNOT BE DONE (measured 2026-09-14)

Both routes were exhausted. Recorded so nobody repeats them.

**Behind the app:** `POST /api/staff/{id}/change` answers **404 *"'Staff' was not found"*** with the id
every staff member is listed under in `GET /api/staff?limit=200`. `/api/staff/{id}` is **405**,
`/api/staff/{id}/edit`, `/api/staff/view/{id}` and `/api/iam/users/{id}` are all **404**. No id that
the change endpoint accepts was found anywhere on the record.

**Through the screen:** `/administration/staff` lists everyone with an edit control per row. The
editor is a dialog whose fields are, in order: First Name · Last Name · Email · Salary Type ·
Hourly Rate · **Job Title** (a text box, holds e.g. "Automotive Technician") · **Role** (the dropdown,
label starts exactly `Role`) · **Location** · Billable. The save button reads **"Save & Close"**.

The Role dropdown opens and lists all eleven roles, and the pick registers — the field shows the new
role. **Saving is then refused: *"Location is a required field"***, and the Location dropdown opens
showing the app's own **"No results"**. So the role cannot be changed either way.

**That location list is empty only HERE.** The branch has two workplaces (`Staging Heavy Duty - 9919`,
`Staging Lethbridge - 4310`, from `GET /api/staff/my-workplaces`), and the **profile-menu** location
chooser lists both and switches between them correctly (proven: C45152). So the staff editor's
location box fails to load a list that loads two menus away — a pinned, single-control problem, not an
empty branch. Proof that this is the product and not a selector: `PROBE-STAFF-LOCATION.json` counts
zero menus on the page before the click and a `q-menu.limit-select-options` after it, containing the
single item "No results", driven by a real pointer press at the field's own coordinates.

**Two traps in that editor**, both of which silently do nothing: match the role field by a label
starting `Role`, not by its value (the Job Title box above it holds a role-shaped string); and match
the save button on a prefix, since `^(save)$` misses "Save & Close".

**What this blocks:** any case needing a permission set nobody currently holds — a time-clock user, a
user without work-order access, a user without customer access, a part-sales-only user. What it does
NOT block is any case that compares a role WITH a permission against one WITHOUT it: impersonation
(§GS.3) reaches Technician, Foreman, Sales Representative and Senior Service Advisor.

