## Simple Flow V2 on PRODUCTION — routes and traps found 2026-09-24

- **Work Orders settings page:** `/administration/settings` → the tab strip at the top reads
  `Organization | Invoice | Work Orders`. **`/settings` 404s** ("The page went to get parts and never
  came back"). The three page tabs are the LAST entries among `[role=tab], .q-tab`, after the whole
  sidebar — match on the exact text `Work Orders` walking the list BACKWARDS, or you hit the top-nav
  Work Orders button instead.
- **Work order detail:** `/workorders/{id}` redirects to `/workorders/{id}/lines`. Clicking a row on
  `/workorders` does NOT navigate — go to the id directly. The list feed is
  `GET /api/work-orders?pagination[rowsPerPage]=N&pagination[page]=1&search=&showMyWorkOrders=0` and the
  rows are at **`data.work_orders[]`** (not `data[]`).
- **Lines and parts:** `GET /api/work-orders/lines/{id}` → `data.collection[].parts[]`, each part with
  `status`, `status_val`, `part_source_type` (`vendor|inventory|found`), `vendor_id`, `core_charge`.
- **Purchase orders page:** `/parts/orders` (the *Purchase Orders* tab on the Parts page).
- **Org settings:** read `GET /api/organizations/settings`, write `POST /api/organizations/settings/change`.
  **Two settings are stored INVERTED:** `autoPickInventoryParts` is the opposite of "Require Picking
  Inventory Parts", and `autoApproveLines` is the opposite of "Require Approval for New Lines".
- **The settings save flow, learnt from the screen:** clicking the TOGGLE opens the confirmation
  immediately; pressing *Turn On* / *Turn Off* does NOT persist; you must then press **Save Settings**.
  A dialog backdrop covers the Save button while the confirmation is open, so a Playwright click on it
  times out — that is the backdrop, not a broken button.
- **Quasar traps:** every tab panel keeps its own `.q-toggle` elements in the DOM, so `page.locator('.q-toggle').nth(i)`
  picks a hidden toggle in another panel — scope to the panel whose text contains `Save Settings`.
  Line tick boxes (`[data-test-id="line_checkbox_<lineId>"]`) are **invisible until the row is hovered**.
  Line rows are `tr.line-row-<lineId>.first-line-row`.
- **Roles:** `/administration/roles-permissions`, editor `/administration/roles-permissions/{id}/edit`.
  **The system roles (Admin and the rest with a lock) SAVE NOTHING** — flipping any permission, including
  an unrelated one like *Move labor*, reads back unchanged after a reload. Saving also raises a
  *"Similar role already exists"* dialog that must be answered with **Edit Anyway**.
  **A custom role is created from `Create custom role` → pick the template CARD → `Apply` → the primary
  button on the form is `Create`, not `Save`.** A copy of the Admin template came back with 57
  permissions where Admin has 58, so verify what a copied role actually carries before testing with it.
- **Staff:** `/administration/staff` **remembers a role filter** and redirects to it, so your own row may
  not be listed — pass `?roles=<Role Name>` explicitly. The row opens through its **`edit_note` pencil**
  (clicking the row does nothing), giving an *Edit Staff Member* dialog with a *Role* picker and
  *Save & Close*. `GET /api/auth/me/fe-permissions` reads back what you actually hold; it can read `0`
  for a few seconds straight after a role change, so re-read before concluding anything.
- **Sharp pictures on production:** `bootProdLogin(route, { viewport:{width:1680,height:1000}, deviceScaleFactor: 2 })`
  now captures at 2×, which is what Standing Rule 116 needs. At a 1000px viewport the work order's lines
  table does not render its rows at all — use 1680 for anything involving lines.

### Work order LINES — the three-dot trap, the line editor, and the real menus (prod, 2026-09-25)

**THE TRAP THAT PRODUCED FOUR FALSE "MISSING FEATURE" FINDINGS.** A line row contains **more than one
`more_vert`**, and the FIRST one in DOM order is the **labor sub-row's**, whose menu holds a single
item, `Add Labor Fee / Discount`. `tr.line-row-<id> .q-btn:has-text("more_vert")` + `.first()`
therefore opens the wrong menu on every line and makes the whole feature set look absent.
**Enumerate every `more_vert` on the page with its position and click each one**; the line's own menu
is the LEFTMOST (~x=402 at 1680px wide), the labor one is to its right (~x=515), the part rows' are
further right again (~x=549-715).

**AND READ ONLY A VISIBLE `.q-menu`.** Quasar leaves closed menus in the DOM, so
`document.querySelectorAll('.q-menu .q-item')` returns a STALE menu's items. Filter by bounding box
(`r.width > 20 && r.height > 20`) and take the LAST match — this is the same class of mistake as the
settings toggles in §A.

**THE LINE EDITOR OPENS BY CLICKING THE LINE — THERE IS NO PENCIL.** Clicking a line's name cell
opens an **`Edit Line`** dialog: fields `What Are You Doing?`, `Why Are You Doing It?`, **`Status`**
(dropdown: `Authorization required` · `Declined` · `Authorized` · `Complete`), `Add Technician`,
`Labor Rate`, `Estimated Time`, `Tech Time`; buttons **`Delete`** and **`Save & Close`**. Hunting a
pencil and concluding "there is no line editor, so there is no delete" is a probe fault, not a finding.

**THE MENUS AS THEY ACTUALLY READ** (`evidence/p3c-all-dots.json`):
- **Approved line:** Request part · Add line note · Save as canned line · Story history · Audit log ·
  Add inspection · Edit labor · Move labor · `Receive parts (n)` · Authorization required · Decline ·
  Delete line. **Decline and Delete line are DISABLED while the line holds parts**, enabled without.
- **Complete line:** **Uncomplete** · Add line note · Save as canned line · Story history · Audit log ·
  Edit labor · Move labor · Authorization required · Decline. **No Request part, no Delete line.**
- **Part row:** Move · Return (disabled unless received) · Move up · Move down · Add Part Fee / Discount.
- **A part with a core** has its own small menu: `Core OK`.
- **Work order header three-dot** (~x=1484): Audit Log · Timesheets (n) · Add Work Order Fee / Discount ·
  Print Work Order · Create invoice · Delete Work Order.

**DELETING A LINE — the QA lead's route, 2026-09-25.** A **Complete** line cannot be deleted directly:
move it to **Authorization required** (its three-dot) or **Decline** it first, then delete. A line is
deletable while **Declined / Authorization required (= Needs Approval) / Authorized**. It is still
refused **while it holds staged parts** — move the parts to another line, cancel the order, or return
the part first. And **nothing can be reopened or deleted once the work order is invoiced or paid**, so
"finished line" must be stated as either *status Complete* or *work order invoiced/paid* — they behave
differently and are not the same thing.

**ROLE CHECKS — RESET THE ROLE AND SAVE IT BEFORE ASSIGNING (QA lead, 2026-09-25).** The estate is
shared, so a pre-existing role may have been edited by another session. Before any permission check:
open the role in `/administration/roles-permissions/<id>/edit` → **Reset to the template/default** →
**Save** → then assign it to the staff member → then run the check. A role already assigned to the
person still needs the reset-and-save, and **the test is re-run afterwards** — an earlier result taken
on the un-reset role is void. See Standing Rule 26 and learning L0203. Note that **system roles save
nothing** (L0193), so this applies to custom roles; a system role is verified by a control change.

**ANNOTATED TICKET PICTURES — MEASURE THE BOXES, NEVER COMPUTE THEM (2026-09-25).** Capture the
screenshot and the element boxes in the SAME probe run: `getBoundingClientRect()` for every element
you intend to outline, written beside the image together with the `clip` and `deviceScaleFactor`
used. Then compose with `build/testing-tools/compose_boxed_compare.py`, whose `mapbox()` does the
only arithmetic involved. A box derived from a remembered page position, an earlier run or a
different viewport lands over empty space — which makes a true finding look careless (L0206).
Badges at the same height are moved onto their own box automatically. **Always open the finished
picture and look at it before it goes near a ticket.**

**FILING A `Bug` RATHER THAN A `Story Defect` (QA lead, 2026-09-25, SV-10475).** He may ask for the
type explicitly; his instruction governs. The two types differ in the fields they take, so do not
carry the Story Defect recipe across:
- **`Bug` REQUIRES `customfield_10153` Product Area** — the very field the Story Defect convention
  records as *absent on this type*. Allowed values include `10120 Work Orders` · `10121 Parts` ·
  `10123 Schedule` · `10125 Customers` · `10268 Administration` · `10130 Customer Portal` ·
  `10566 Reports & Dashboards`. Read them live from
  `/rest/api/2/issue/createmeta?projectKeys=SV&issuetypeNames=Bug&expand=projects.issuetypes.fields`
  rather than guessing a value.
- **`Bug` takes no owning-story parent.** Link the story with `POST /rest/api/2/issueLink`,
  `{"type":{"name":"Relates"}}` — proven, HTTP 201.
- Priority values are `Highest · High · Medium · Low`; **Medium** stays the house choice.
- **Sequence that works, end to end:** create with a placeholder description (`POST /rest/api/2/issue`,
  201) → attach the picture by multipart `curl -F file=@…` to `/rest/api/2/issue/<KEY>/attachments`
  with `X-Atlassian-Token: no-check` plus Origin and Referer (jira.sh cannot do multipart) → write the
  real description in **wiki markup** via `PUT /rest/api/2/issue/<KEY>` (the only route that embeds an
  image) → run `size_pics.py <KEY> <img>` → **read it back** and require `mediaSingle layout=full-width`
  with the picture's true pixel dimensions (Rule 116).

### The grouped-by-VENDOR receive window — and the route to it (QA lead, 2026-09-25)

**THE PRODUCT'S WORD IS *VENDOR*. Never "supplier"** — not in a case, a ticket, a report or a message
(Rule 110: four things are company-wide, and the product's own word is one of them).

**I judged two checks on the wrong screen.** `/parts/orders` (Parts → Purchase Orders) is a flat
sortable list and always was; the grouping the requirement describes is **not there and is not meant
to be**. It lives in the receive window reached from the work order:

1. Open a work order → **Lines** tab.
2. Press **Complete** on a line that has parts waiting.
3. The completion wizard opens, usually at **Resolve cores** — press **Continue Without Resolving**
   (clicking the *Receive parts (n)* step label does NOT advance it; the step must be cleared).
4. The next step is a prompt: *"n parts waiting to receive"* with **Cancel · Receive Parts ·
   Finish Work Order**. Press **Receive Parts**.
5. **That** window is grouped by vendor: a **Vendor missing** group first, with an amber warning icon
   and an **Assign Vendor** box, then named vendors. Each group carries **Vendor Invoice Number ·
   Invoice Date · Delivery Note**, then its parts with a tick box each and columns **Part number &
   description · Select All · Cost · Qty Ordered · Qty Received · Total**, then **Subtotal · Tax
   (editable) · Total**, and **Receive Parts (n)** as the primary action, greyed while nothing is ticked.

**Clicking a purchase order on `/parts/orders` navigates to `/order/<id>` "Purchase Order Details" —
and the QA lead confirms that separate page is intended**, not an in-place panel.

**Differences from the written requirement, recorded but not raised** (the Product Owner has said this
area changed during development and the requirement will be updated): the control is **Select All**
where the requirement says *Deselect all*; groups open **expanded** rather than collapsed; there is no
*Expand all* and no rollup such as *"3 POs, 6 parts"*; no **sell price** is shown.

**The lesson worth carrying:** a precondition that names a route is part of what is being tested. Two
checks pointed at `/parts/orders` and I judged the product against them without asking whether the
route itself was right. When a whole feature appears to be missing, suspect the route before the
product — and ask.

**READING CONTROLS — FOUR WAYS, ALWAYS (2026-09-28).** `innerText` alone is not how you read a control.
Capture `innerText`, `aria-label`, `title`, and the **rendered tooltip** (hover first; Quasar creates
`.q-tooltip` lazily). Anything that comes back looking like a Material ligature — `how_to_reg`,
`more_vert`, `content_copy`, `width_normal`, `expand_less` — means you are reading the ICON and have
not yet found the label. Worked example: the work order header's **Send to Portal** is an icon button
whose ligature is `how_to_reg`; reading text alone made it invisible across seven work-order states
(L0212).

**WORKPLACES (2026-09-28).** Work orders are scoped to a workplace. Opening one that belongs to another
**silently redirects to `/workorders`** — no error — so a header scan then reads the LIST toolbar.
**Assert you are on a work order first**: the presence of the `Name/Description` column-headings row.
To switch, use the screen: profile chip (top right) → **"Change Location: <current>"** → pick.
`POST /api/iam/change-location` succeeded once and then 500'd on every subsequent call, stranding the
session. Workplaces on prod: Inventory 1 · Inventory 2 · Truck Hill 1 · Trucks Hill 2 · Import Test ·
QA New · QA Testing · For Ryan · SANKAN. **Restore the workplace you started in and read it back.**

**PERMISSION ATOMS CASCADE — AND THE CASCADE MUST BE CONFIRMED BEFORE THE TOGGLE TAKES (2026-09-28).**
Turning **See Financial Data** off raises *"Disable See Financial Data? Disabling See Financial Data
will also disable **Part Sales** and **Invoicing & Payments** and **Order Parts** and **View and Manage
AP/AR Data**. Continue?"* — press **Disable**. Until that is confirmed the toggle does not take and the
role is created without the change, silently: the role appears in the list looking normal and the
permission is still on. `build/.../seed/lib-role.mjs` now confirms a cascade dialog straight after each
flip, not at save time.
**Consequence for test design:** a person who may **order parts** but may **not see money** cannot exist
in this product — the two are coupled. A check that asks for that state is asking for something the
product refuses to build, and should be read as being about **receiving** (a different atom) rather than
ordering. Relevant to the "gated by its mapped atom" checks: the mapping is not one-to-one.

**THE ROLE EDITOR HAS TWO KINDS OF CONTROL, AND ONLY ONE IS A `.q-toggle` (2026-09-28).** Scanning
`.q-toggle` finds the **cross-toggles** only — *Review work orders · Pick parts · Order parts ·
**Receive later** · Move labor* — plus the section cards. The main permission matrix (Work Orders,
Work Order Lines, Vendor & Order Mgmt … each with View / Create & Edit / Delete) is **checkboxes** and
does not appear in that scan at all. A role built by matching `.q-toggle` labels for something in the
matrix silently creates **a clone of the template with nothing changed** — and it looks entirely
normal in the roles list, so a later check measures the template and believes it measured a
restricted user. **Always read the role back after building it**, and delete a role that did not get
its intended change rather than leaving it named for something it is not.
**Deleting a role:** open it (`edit` on its row) → **`delete Delete Role`** → confirm. A role that is
assigned to somebody cannot be removed, so move the person first.
**Existing test roles on prod:** `ZZAUTOTEST Receive Later`, `ZZAUTOTEST No Parts Perms`,
`ZZAUTOTEST Order No Money` — all built from the Admin template.

### Reordering parts on a line, and moving a part to another line (production, v26.39.1)

**Move a part to a different line.** Part row → its own `more_vert` → **Move** → the dialog reads
"Move part to line:" with *Work Order* (pre-filled) and *Target Line* → pick the line → press the
button **twice**: it reads **"Move To Line"**, then re-labels itself **"Please Confirm"** and only acts
on the second press. The dialog closes when it has committed. Works even when the part's current line
is Complete. (L0217)

**Reorder parts within a line.** Part menu → **Move up** / **Move down**, or the drag handle.
The call is `PUT /api/work-orders/lines/{line_id}/part-order`
body `{"parts":[{"part_request_id":"…","part_order":1}, …]}`.
- ids come from `parts[].part_request_id` — **not** `parts[].id` (both exist; `id` gets a 409 that
  looks like a concurrency error)
- the set must match exactly; core rows are excluded and are NOT flagged by `parent_wo_part_id`
- **capture the payload from a real Move up rather than building it** (L0218)

**Refusals seen:**
| Situation | What the shop system answers |
|---|---|
| Work order invoiced | `409` "Parts can no longer be reordered on this work order (status: Invoiced)." — and the screen offers no drag handle and no part menu at all |
| Parts added/removed since you loaded | `409` "The parts submitted for reordering no longer match this line. Please refresh and try again." |
| Two people both reorder | **Accepted, last save wins, nobody is told** |

**The lines endpoint:** `GET /api/work-orders/lines/{work_order_id}` → `data.collection[]`, each with
`line_id`, `line_name`, `status_display`, `work_order_status`, `editable`, `deletable`, and the parts
in **`parts[]`** (`part_requests[]` is a different thing and is often empty on a line that visibly
carries parts).

### Staging sign-in for Global Search (from 2026-09-28) — the QA branch is GONE

**QA branch `sv9160` was merged into staging and DELETED** (QA lead, 2026-09-28). `sv9160.qa.shopview.com`
no longer resolves — a 502 with `fetch failed`, which is NOT the sleeping-branch trap (that serves
`sleep.qa.shopview.com` with a Wake Up button, and staging has no such trap). All Global Search work
is now on **https://app.staging.shopview.com**, api host `api.staging.shopview.com`.

**🛑 STAGING IS THE OPPOSITE OF A QA BRANCH ON COOKIES.** On a QA branch you carry ONLY
`sv_sso_session` and must NOT carry `PHPSESSID`. On staging you must carry **all three** —
`sv_sso_session`, `PHPSESSID` and `cf_clearance` — **host-only, on BOTH the app host and the api
host**. Measured the same day:

| Cookies carried | What happens |
|---|---|
| all three | ShopView's own sign-in card **with the DEV MODE — QUICK LOGIN panel**; `/api/auth/me/fe-permissions` answers **200, 59 permissions** |
| `sv_sso_session` + `cf_clearance`, no PHPSESSID | staging bounces to a **GOOGLE sign-in page** ("Enter your email", "Forgot email?") and `/api/api/sso/check` answers **401** |

**A Google sign-in screen on staging means a cookie is missing or expired** — it does not mean the
environment is down, and there is no Wake Up button to look for.

**The method is unchanged from the QA branches: let the app log itself in.** The card's DEV MODE panel
carries real `<button>` elements whose text is the icon ligature plus the word —
`admin_panel_settings Admin` and `schedule Tech` — so `button:has-text("Admin")` matches. Clicking it
makes the SPA call quick-login and write its own `localStorage.user` / `fe_permissions_wrapper`.
Poll for the button (the panel is filled by an API call) and retry the click up to three times.

Ready-made: **`build/testing-tools/staging-cookie-boot.mjs`**, same shape as `qa-branch-boot.mjs`
(`boot(route, opts)` → `{ browser, ctx, page, APP, APIH, templateSlug, nFePerms }`). Cookies live in
`/tmp/shopview/gs-staging.env`, chmod 600, never committed (Rule 82); they come from the QA lead and
expire, so a Google card means ask him for fresh ones. Run it through `run_probe.sh` — chromium cannot
reach staging without the local bridge.

**Observed 2026-09-28:** build `v26.39.1-02c6b6c` (api reports `02c6b6c…-develop`), workplace
**Staging Heavy Duty - 9919**, `template_slug=administrator`, 59 permissions. Judge the session by
`template_slug` and the permission count, never by `role.name`.

### Staging routes and traps learned while running Global Search (2026-09-28)

**API routes on staging** — several differ from what a QA branch served, and guessing costs runs:

| What | Route |
|---|---|
| Vendors list | `GET /api/parts-catalogue/vendors` — **NOT** `/api/vendors`, which 404s |
| Catalogue parts | `GET /api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=30&search=…` |
| Categories / units | `GET /api/parts-catalogue/categories-list` · `/api/parts-catalogue/units-of-measurement` |
| Create a customer | **`POST /api/customers/create`** — `POST /api/customers` answers **405 Method Not Allowed (Allow: GET)**. Body: `{name, address_1, city, state_or_province, country_code:'US', require_po:false, …}` |
| Change a customer | `POST /api/customers/change` with `{customer_id, …the full record…}` |
| Work order lines | `GET /api/work-orders/lines/{work_order_id}` → `data.collection[]` |

**Duplicate customer names are refused** — `"Company with provided name already exists."` So a check
needing "two otherwise identical records" cannot use two identical names; use two names that match
the query token identically instead (e.g. `ZZTIEBREAK Alpha Hauling` / `ZZTIEBREAK Beta Hauling`).

#### Driving the global search modal

`build/global-search/run415-execution/gs_probe.mjs` carries the whole toolkit and now exports
**`openStaging(route, key)`** alongside the original `open(branch, …)`. Selectors in `SEL`.

**🛑 Four traps, each of which produced a false reading on 2026-09-28:**
1. **A synthetic `mouseover` cannot trigger a CSS `:hover` state.** Dispatching the event found no
   hover actions on any entity, which reads as "the feature is gone". Move the real pointer:
   `page.mouse.move(x-250, y)` then `page.mouse.move(x, y, {steps:10})`.
2. **The modal shows RECENT rows before anything is typed**, with
   `data-test-id="search_result_row_recent_today_0"`. They carry no actions by design. Genuine
   results are `search_result_row_<entity>_<n>` — filter out anything matching `/recent/`.
3. **After a search the tab labels carry counts** — `Work orders (20)`, not `Work orders`. An
   exact-match tab selector silently finds nothing and every per-entity reading is then taken from
   whatever tab happened to be open. Match on `startsWith`.
4. **The close-match marker is injected MID-WORD**, so a row reads
   `ZZAUTOTEST Br≈ close match: idgeport Hauling`. A plain `includes('Bridgeport Hauling')` test
   fails on a row that did come back. Strip `≈ close match: ` before matching text.

**Positive control for hover in this modal:** hovering a row that is not already selected changes its
class `search-row` → `search-row search-row--selected` and its background
`rgba(0,0,0,0)` → `rgb(248,250,252)`. If that does not happen, the pointer is not reaching the modal
and no hover-based finding is admissible.

**Checking whether the app may legitimately hide hover actions:** the requirement gates them on
"desktop only — pointer present". Read it from the page:
`matchMedia('(hover: hover)')`, `('(pointer: fine)')`, `navigator.maxTouchPoints`. Headless chromium
here reports hover:hover, pointer:fine, maxTouchPoints 0 — so there is no pointer-based excuse.

---

