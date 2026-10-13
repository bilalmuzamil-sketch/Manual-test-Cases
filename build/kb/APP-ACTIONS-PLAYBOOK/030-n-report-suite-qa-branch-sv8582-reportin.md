## N. REPORT SUITE QA BRANCH sv8582 — reporting API + report-UI recipes (proven 2026-08-03)
First live Report Suite environment. Everything below was observed working; reuse it, do not
re-discover (Rule 27). Secrets stay in `/tmp` — helpers read them at runtime.

### Env + auth
- App `https://sv8582.qa.shopview.com` · API **`https://sv8582api.qa.shopview.com`** (no dot before
  "api", same convention as `sv7301api`). Org = the shared **`d55bc308-e61a-438d-b5f1-c7a73c89d49f`**.
- `POST /api/quick-login {"key":"admin"}` → **200** + a fresh `PHPSESSID`; cookies
  (`sv_sso_session` 64-hex, `PHPSESSID` 32-hex, `cf_clearance`) on `.qa.shopview.com`, `Max-Age=86400`.
- **Run node with `NODE_USE_ENV_PROXY=1`** or plain `fetch` bypasses the egress proxy.
- Helpers: `build/report-suite/viu-2026-08-03/tools/qa8582.mjs` (`login()`/`api()`) and
  `boot8582.mjs` (`boot()` = the boot2 hydration pattern retargeted; also logs every `/api` call the
  SPA makes, which is how these endpoints were found).
- **Build marker:** `curl -s https://sv8582.qa.shopview.com/ | grep app-version` →
  `<meta name="app-version" content="v3.4.1-0ed4433">`. Use it for Rule-49 re-check queues.

### Report routes (all six, live)
`/reports` **redirects to** `/reports/punch-clock-activities` — there is no neutral reports index.
`/reports/sales-by-customer` · `/reports/sales-by-representative` · `/reports/parts-velocity` ·
`/reports/technician-utilization` · `/reports/work-in-progress` · `/reports/inventory-value`.
Nav group headings: LABOR · PERFORMANCE (WIP, TU, SBR) · PARTS (PV, IV) · **SALES (SBC)** ·
FINANCE · ACCOUNTS RECEIVABLE · ACCOUNTS PAYABLE · ACCOUNTING · COMMUNICATIONS.

### Report DATA endpoints
`GET /api/reporting/reports/<slug>?<filters>&pagination[page]=&pagination[rowsPerPage]=&pagination[sortBy]=&pagination[descending]=`
- SBC/SBR/PV/IV are **paginated**; **TU and WIP are NOT**.
- Date scope: most take `range=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`;
  **WIP takes `from`/`to` as ISO datetimes** (`from=2026-01-01T00:00:00.000Z&to=…`). A span beyond the
  server limit returns **400**.
- Multi-location scope: `&locations=<uuid>,<uuid>` (comma-separated, URL-encoded).
- Extra per report: SBC `productType=all`; SBR `productType`+`invoiceStatus=all`; PV `type=both`.
- Payload: `{data:{collection:[…], pagination:{…}, totals:{…}}}` — **PV returns NO `totals`**;
  IV also returns `as_of_date`.

### Report EXPORT endpoints (this is the part worth never re-deriving)
`GET /api/reporting/reports/<slug>/export?format=csv|pdf&<the same filters>` plus:
- `&variant=summary|expanded` — **required** for SBC, SBR, TU (else `400 "Invalid export variant.
  Allowed values: summary, expanded."`).
- `&tab=ApprovedNotStarted|ApprovedPartiallyCompleted|Completed|Estimates` — **required for WIP**
  (else `400 "Invalid tab \"\"."`).
- `&columns=<comma-separated keys>` — **required for WIP** (else `400 "At least one column is
  required."`); optional elsewhere, and **omitting it exports every column**.
  **Valid WIP keys:** `wo_number, status, customer, asset, vin, location, advisor, days_open,
  last_activity, labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining,
  total`. **`invoiced_hours` is NOT accepted** even though the UI offers an Inv. Hrs column.
- Bad `format` → `400 "Invalid export format. Allowed values: csv, pdf."`
- **Over-size guard:** `400 "This report is too large to export. Narrow the date range or filters,
  then try again."` — narrow with `&search=<term>` or a single location to get a file.
- CSV shape: line 1 `"Locations: <name>"` (or `"Locations: All locations"`); IV puts
  `"As of: YYYY-MM-DD"` **above** it. Then the header row, the data rows, and a final `Totals,…` row.
- **The per-row `Location` column appears only when scope spans >1 location**, in the screen's slot —
  except TU, which puts it FIRST in the export and second on screen.
- **WIP export headers rename two columns:** screen `Asset`/`Location` → file **`Unit`/`Branch`**.

### Report UI recipes (Quasar)
- The **export menu** is the `more_horiz` icon button (`aria-label="Export report"`); the **column
  selector** is the `width_normal` icon button next to it (tooltip + aria `Column Selection`).
- The **date-range control** is **`span.date-range-label`** (NOT a `.q-btn` — a `.q-btn` text search
  fails). Click it by coordinate; the popup holds an inline calendar plus presets
  **Last 12 Months · This Year · Last Year · This Quarter · Last Quarter · This Month · Last Month ·
  This Week · Last Week**, a `Range: N days` readout and an **Apply** button. There is **no "Custom"
  or "Today"/"Yesterday"** preset.
- Filter dropdowns are `.q-select` in toolbar order; the **Location** filter is always last and offers
  `All locations` + `Clear all` + one row per accessible workplace.
- **The report grids are VIRTUALISED** — `tbody tr` returns a spacer, so per-cell reads fail. The
  `thead` and the `Totals` row read fine. To read data cells, scroll-and-read or use the data API.
- **Empty export:** the FE short-circuits and shows a toast `Empty export` /
  `Export didn't yield any results` / `Close`, and calls no endpoint.

### Report permission testing (the ONE-permission model, proven both ways)
- The **entire** FE-permission catalogue (`GET /api/fe-permissions`) holds exactly **one** report
  atom: **`reportsPageAccess`**. No per-report atom exists.
- Roles holding it on this org: Admin, Service Manager, Office User, **Sales Representative** (only 8
  atoms — the ideal minimal positive subject), Parts Manager. Without it: Parts Technician, Senior
  Service Advisor, Time Clock User, Technician, Service Advisor, **Foreman** (good negative subject).
- **Impersonate:** `POST /api/switch-user {user_id}` where `user_id` is the staff record's **`id`**
  (not `staff_id`). **`GET /api/staff?limit=300` returns `role_label`, `role_id`, `staff_id`, `id`,
  `is_active`.** **switch-user 403s on inactive users** — filter `is_active === true` **and**
  `confirmed_invitation_on`. Confirm who you are with `GET /api/auth/me/fe-permissions` →
  `template_slug`; `administrator` means the switch did not take.
- **Seed a minimal-permission subject** (Rule 14): `POST /api/staff/{staff_id}/change
  {first_name,last_name,email,role_id,workplace_id,job_title,salary_type,salary,billable,clockable}`
  → **201**. Note `POST /api/organizations/{org}/roles` is **GET-only (405)** on this build, so
  **reassign an existing minimal role instead of creating one**. Always restore and verify.
- **Seed a single-location user** (for the Location-filter question): assign one `workplace_id`; then
  `GET /api/staff/my-workplaces` as them returns exactly one. **Caution:** re-hydrating the same
  browser profile keeps the previous user's persisted **column selection** in localStorage, which can
  fake a Location column — use a fresh profile, and note that `localStorage.clear()` alone breaks SPA
  hydration (the SPA needs the full `user` payload, not just `fe_permissions_wrapper`).

### §N addendum — WIP + Inventory Value recipes (proven 2026-08-04, build v3.4.1-0ed4433)
Everything here was observed working. Reuse it; do not re-derive it (Rule 27).

**READ A PDF EXPORT'S CONTENTS.** `pdftotext -layout <file>.pdf -` works — **poppler-utils 24.02.0 is
already installed** at `/usr/bin/pdftotext`. Use `-layout` so the column order survives. Page count:
`pdfinfo <file>.pdf | grep ^Pages`. (`import pypdf` fails on this container with a
`pyo3_runtime.PanicException` out of `cryptography`; `pdfplumber` is not installed. Do not waste time
on either — `pdftotext` is the route.)

**TOGGLE A COLUMN IN THE Column Selection PANEL (the recipe that actually works).** Click
`[data-testid="button_column_selection"]` by coordinate, then click the **`.q-toggle` INSIDE** the
`.q-item` whose exact `innerText` is the column name — clicking the `.q-item` centre does NOT toggle
it (that is why an earlier pass reported "no change"). Then `Escape` and **re-read `table thead th`**
to confirm: the rendered header row is the only reliable state, because the toggles' `aria-checked`
reads `false` on every item regardless of state. Working script:
`build/report-suite/viu-2026-08-03/batch-wip-iv/tools/probe_colselector.mjs <slug> <ColumnLabel>`.

**DATE-RANGE PRESET, applied.** Click `span.date-range-label`, click the leaf element whose text is
the preset (e.g. `Last 12 Months`), then click the popup's **`Apply`** button, then wait ~9 s. Without
the Apply click the range does not take. The default range leaves 3 of the 4 WIP tabs empty, so widen
first or you will observe an empty report.

**WIP data payload.** `GET /api/reporting/reports/work-in-progress?from=<ISO>&to=<ISO>&locations=…`
→ `{data:{collection:[…]}}` — a FLAT list, **no `totals` and no `summary`**, each row carrying
`tab` (`ApprovedPartiallyCompleted|ApprovedNotStarted|Completed|Estimates`). Row keys: `work_order_id,
number, status, customer, unit_number, vin, location, advisor, start_date, last_activity,
labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining, total, quoted_hours,
worked_hours, tab`. **Money is INTEGER CENTS** (`15000` = $150.00). There is **no `days_open`** (the
browser derives it from `start_date`) and **no `invoiced_hours`** (Inv. Hrs = `quoted_hours −
worked_hours`, computed in the browser) — which is exactly why the export rejects
`columns=…,invoiced_hours` with `400 Invalid column`. **Span cap = 367 days**: 367 → 200, 368 → `400
{"error":"Date range cannot be over one year."}`. An unrecognised or omitted `locations` falls back to
the active workplace only.

**Inventory Value data payload.** `GET /api/reporting/reports/inventory-value?range=custom&
start_date=&end_date=&locations=…&search=&categories=<uuid>&pagination[…]` →
`{data:{collection:[…], pagination:{rowsNumber}, totals:{qty,total_cost,total_sell,margin,margin_pct},
as_of_date}}`. Row keys: `key, workplace_id, location, part_number, description, category, vendor,
qty, unit_cost, unit_sell, total_cost, total_sell, margin, margin_pct`. **Money is INTEGER CENTS**;
`margin_pct` carries **2 decimals** (the screen renders 1 dp truncating, the exports render 1 dp
rounding — the same row can read `56.0%` on screen and `56.1%` in the file). `totals` is computed
server-side over the FULL filtered set from UNROUNDED values, so a hand sum of displayed cents can
differ by a few cents (6 cents over 5,657 rows) — that is correct.
- **Category filter param is `categories=<uuid>`** (comma-separated for several). The option list is
  `GET /api/inventory/categories?limit=500` → `{data:{collection:[{value,label}]}}` — **`value` is the
  id, not `id`**. Passing a category NAME returns 400; `category` / `category_ids` / `categoryIds` are
  silently ignored. `GET /api/vendors` is **404** on this build — the vendor param was not established;
  drive the Vendor filter through the UI dropdown.
- **The IV export IGNORES `columns=` entirely** — it always emits every column, and a nonsense column
  name is silently accepted. It DOES honour `pagination[sortBy]`/`[descending]`.
- **The IV PDF export TIMES OUT at ~30 s.** `format=pdf` 500s (`"…please try again a bit later
  later."`) on any scope big enough to take >~31 s to render — 200 at 1–578 rows, 500 at 538–9,275
  rows, **non-deterministic at the boundary** (578 rows passed at 25.4 s and failed at 32.2 s). The
  CSV of the identical scope returns in 0.8–2.2 s. Narrow with `&search=<term>` or one location to get
  a PDF. Bisector: `batch-wip-iv/tools/iv_pdf_boundary.mjs`.

**EXPORT FILE NAMES** come back in `Content-Disposition`: `wip-2-report.csv|pdf` and
`inventory-value-report.csv|pdf`. **CSV metadata lines:** WIP line 1 = `"Locations: …"`; IV line 1 =
`"As of: YYYY-MM-DD"` then line 2 = `"Locations: …"`. `"Locations: All locations"` when every
accessible location is selected. **WIP export renames two headers:** screen `Asset`/`Location` → file
`Unit`/`Branch` (confirmed in the extracted PDF text as well as the CSV).

**WORK-ORDER STATUS ENUM.** `GET /api/work-orders/statuses` → `{data:{collection:[{value,label}]}}` =
`estimate/Estimate · approved/Approved · in_progress/`**`In progress`**` · ready_for_review/Review ·
complete/Complete · invoiced/Invoiced · paid/Paid`. **There is no `declined` status.** Note the
lower-case "p" in the In-progress label.

**CREATE / DELETE a work order — the gotcha that leaves strays.**
`POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`
→ **201 `{data:{work_order_id:"…"}}`** — the id is `work_order_id`, **NOT `id`**. Reading `.id` returns
`undefined` and the cleanup `POST /api/work-orders/delete {work_order_id}` is silently skipped, leaving
a stray WO in the report. Always read `data.work_order_id ?? data.id`, then delete (201) and re-read
the report to confirm it is gone. On this build `GET /api/canned-lines` is **404**, so the
canned-line line-create recipe is unavailable; and driving a WO to In progress via
`POST /api/work-orders/change` was not achieved (`{id}` → `400 "Work Order ID is missing."`,
`{work_order_id}` → 500) — status transitions go through the UI wizard.

**CREATE an inventory part.** `POST /api/inventory/parts/create` requires
`catalog_part_id, category_id, quantity, cost, tags, bins` (learned by posting `{}` and reading the
validation errors). **`category_id` is mandatory, so a part with NO category cannot exist** — which is
why 0 of 5,657 Inventory Value rows show a "—" Category. `POST /api/inventory/parts` is 405 (GET only).
Check whether a part is a core charge with `GET /api/inventory/parts?search=<pn>` → `is_core` /
`core_charge` (a part merely NAMED "…-CORE" in a "CORE / FEE" category is **not** a core charge).

**SEED A MINIMAL *POSITIVE* PERMISSION SUBJECT (better than creating a fresh staff member).**
`switch-user` 403s on inactive/unconfirmed users, and on this org only Admin, Technician and Foreman
have an active+confirmed holder. So: take an existing active+confirmed holder, **temporarily reassign
their role** to the smallest role that holds the atom you need, impersonate, observe, then **restore
the original `role_id` and verify it**. `GET /api/organizations/{org}/roles` + `GET /api/roles/{id}`
gives each role's permission count; on this org the roles holding `reportsPageAccess` are Service
Manager (36), Office User (25), **Sales Representative (8 — the ideal minimal subject)**, Parts
Manager (31), Admin (42). Executor: `batch-wip-iv/tools/seed2_wo_and_minimal_role.mjs`.

**PRE-COMMIT SECRET GUARD.** `bash build/report-suite/viu-2026-08-03/batch-wip-iv/tools/secret_scan.sh
[paths]` reads the live secret VALUES from `/tmp` at run time and greps the staged folder for each
one; exit 1 = leak. Scope it to genuine secret KEYS only (`sv_sso_session`, `PHPSESSID`,
`cf_clearance`, `token`, `password`, `email`, `user`) — including the `host`/`api` values from
`cookies.json` produces false positives, because the host names are deliberately documented.

---

### §N addendum — PARTS VELOCITY + TECHNICIAN UTILIZATION recipes (proven 2026-08-04, build v3.4.1-0ed4433)

**READ THE PDF. IT IS NOT AN EXTERNAL DEPENDENCY.** `apt-get update -qq && apt-get install -y
poppler-utils` (the first attempt 404s until `apt-get update` runs) then `pdftotext -layout f.pdf
f.txt` reads every report PDF, `pdfinfo f.pdf` gives **Title / Pages / Page size**, and
`pdfimages -list f.pdf` proves whether a logo is embedded. `pip install pypdf` installs but its
import panics on this image's broken system `cryptography` — use poppler.

**EXPORT SIZE BOUNDARIES (three distinct behaviours — do not conflate them).**
- **Over ~10,000 rows → HTTP 400** `"This report is too large to export. Narrow the date range or
  filters, then try again."` Proven exactly: Parts Velocity This Year across **both** locations is
  **10,064** rows and every format is refused; **one** location is 6,219 rows and exports.
- **Under the cap but a big PDF → HTTP 500** while the CSV of the identical scope succeeds.
  Reproduced twice each way: **344 rows / 31 pages succeeds** (byte-identical 308,830 bytes at 37.9 s
  and 55.4 s), **449 rows fails** (35.1 s and 36.0 s). A 55 s success next to a 36 s failure proves it
  is **size-driven, not a wall-clock timeout**. Renderer is `WeasyPrint 69.0`. Same class on the TU
  **Expanded** PDF at This-Year scope (500 after 32.8 s) while its Summary PDF returns in 1.95 s.
- **Empty result → no request at all**: the front end short-circuits with a toast reading
  `Empty export` / `Export didn't yield any results`. Same for an export with zero columns enabled.

**PV export/data facts.** `Content-Disposition` says `velocity-report.csv/.pdf` but the **browser
filename is `parts-velocity-report.csv/.pdf`** — the front end renames it, so assert the browser name.
Omitting `columns=` exports all 20; passing an empty `columns=` also exports all 20. The per-row
`Location` column is auto-inserted whenever scope spans >1 location and sits **after Vendor** (6th) on
screen *and* in both files. CSV line 1 is `"Locations: …"`. PV has **no Totals row and no `totals`
object** — that is correct, not a gap. Export sort: `pagination[sortBy]`/`[descending]` are honoured
in the file, with **nulls first ascending, last descending**.

**TU export facts.** `variant=summary|expanded` is required. Menu ships **FOUR** items
(`Summary (PDF)`, `Summary (CSV)`, `Expanded (PDF)`, `Expanded (CSV)`). Files are
`technician-utilization-summary/-expanded.pdf/.csv`. **Location is FIRST in every export but SECOND on
screen.** Neither CSV nor the Summary PDF contains the Summary row. Rows come out in raw server order,
not A→Z. Money with commas is correctly quoted (`"$7,248.85"`).

**SEED CLOCKED TIME (this is how you make Technician Utilization non-empty).** Impersonate a holder
with `POST /api/switch-user {user_id}` (the staff record's `id`), optionally
`POST /api/iam/change-location {workplace_id, workplace_timezone}` first, then:
- `POST /api/technician-tasks/department-clock-in {department_id}` → **201** `{technician_task_id}`.
  **⚠️ SNAKE_CASE.** `{departmentId}` returns `400 "Department ID is missing."` even though the error
  names the camelCase key. Departments: `GET /api/departments` → use one with `enable_time_clock`.
- `POST /api/technician-tasks/department-clock-out {task_id, description}` → **201**.
- `GET /api/technician-tasks/my-current-task` shows the open record (with a live `seconds`).
- **`DELETE /api/technician-tasks/{id}` → 204** — full clean-up, so seeding costs nothing.
Clock the SAME technician at BOTH workplaces to produce the per-row Location value **`Multiple`**, and
leave one clock OPEN to exercise the load-instant snapshot (Total Hours read 0.06 → 0.13 → 0.76 across
successive loads). Day grouping uses the **active workplace's** time zone: a record created
`2026-08-04 01:24 UTC` lands on the `2026-08-03` day row and shows as `07:25 PM` in Timesheet
Activities. `POST /api/technician-tasks/create` needs `staff_id`+`start_date` (snake_case) but then
500s — use the clock-in/out pair instead.

**TU per-day endpoint (fires ONLY on expand).**
`GET /api/reporting/reports/technician-utilization/{staff_id}/daily?range=custom&start_date=&end_date=&locations=`

**TU deep link.** Total Hours is an anchor to
`/reports/punch-clock-activities?range=custom&startDate=&endDate=&technicianId=` — same tab, technician
and range only, **no location**. A day row narrows `startDate`=`endDate`. The landed page's Totals row
is what you reconcile against.

**REPORT UI HANDLES (`data-test-id` — stop guessing selectors).** `input_report_search`
(placeholder **"Search parts"** — the report's OWN search; `select_global_search` is the Ctrl+K bar and
is the wrong element), `btn_dropdown_pv_export` / `btn_dropdown_tu_export` (aria `Export report`),
`button_column_selection` (aria + tooltip `Column Selection`), `date-range-selector_tu_trigger`,
`clear_report_location_filter`, `clear_tu_technician_filter`, `button_tu_expand_all`
(aria `Expand all technicians`), `button_tu_expand_<staff_id>`
(aria `Expand <name>'s daily breakdown` ⇄ `Collapse …`), `header_tu_{technician,total_hours,wo_hours,
internal_hours,utilization,est_lost_labor}`, `icon_tu_est_lost_labor_info`,
`option_pv_type_{both,inventory,special_order}`. Filter `.q-select` inputs carry
`aria-label="Type|Category|Vendor|Bin|Location|Technician"` — open one by clicking
`input[aria-label="X"]`.

**QUASAR GOTCHAS THAT COST REAL TIME.**
- **Column-selector toggles: click the `.q-toggle` KNOB, not the row label.** Clicking the `.q-item`
  text does nothing, which reads exactly like a broken feature — I nearly logged a false defect.
  With a 20-entry menu also `scrollIntoView({block:'center'})` first, or `boundingBox()` returns a
  clipped/negative box and the click misses.
- **Select options are `[role=option]` with `aria-selected`**, so single-vs-multi select is provable
  from the DOM. **Date-range presets are NOT `.q-item` and NOT `<button>`** — a text match over either
  silently fails (that is why a "Last 12 Months" click appeared to do nothing).
- **Toasts are `.q-notification`; POLL them** every ~250 ms for 10–20 s. A single read at +2 s misses
  them and makes a correct error toast look absent.
- Report grids are virtualised: `tbody tr` includes spacer rows — filter on
  `tr.querySelectorAll('td').length > 5`.
- **Hydration:** set `fe_permissions_wrapper` only. Calling `localStorage.clear()` first breaks
  hydration and every report renders empty.

**SAVED VIEW.** `localStorage['report_view:<slug>']` =
`{version, view:{dateRange, locationIds, sortBy, descending, columns}, extra:{…}}` — PV's extra holds
`type/categoryIds/vendorIds/binIds`, TU's holds `deselectedTechnicianIds` (the **deselected** set, so a
newly appearing technician is selected by default). Delete just the `report_view:` keys to test
first-visit defaults without breaking hydration.

**LABOUR RATES / EST. LOST LABOR.** `GET /api/labour-types` (scoped to your **active** workplace) →
`{id, name, labour_rate, is_default, workplaceId}`. The Est. Lost Labor rate **is** the workplace's
default Labour Type — Heavy Duty's `CP RAIL FLEET RATE` at `145` matches the reported dollars exactly.
There is **no labor-rate field on the Location edit dialog**; the page is `/administration/labour-types`
(nav label "Labor Rates"). **⚠️ The default cannot be cleared:** `POST /api/labour-types/change` accepts
`is_default:false`, returns **201, and does not persist it**; `POST /api/labour-types/set-default`
requires a real `labour_type_id` and rejects null/empty/bogus. And `POST /api/workplaces/delete`
**returns 500 for every id**, so do NOT create a throwaway workplace on a shared org — it cannot be
removed. Consequence: a location with **no** default labor rate is not producible, so the em-dash
Est. Lost Labor family is environment-blocked, not seed-blocked.

**CORE PARTS.** `is_core` is not settable on create. Create the parent, then
`POST /api/inventory/parts/change {…full field set…, core:true, core_charge:25}` → 201, which mints a
**separate linked core-part record** (`core_part_id`). That core record appears in neither
`GET /api/inventory/parts` nor Parts Velocity, while the parent (which merely *carries* a core charge)
does — that is the core exclusion, and `core_charge > 0` is **not** the same thing as "is a core".
`bins` on create/change take `{id, quantity, isDefault}` — `{binLocationId,…}` is rejected.

**PV DATE-RANGE CAP, exactly.** A **366-day difference** is accepted; **367 is refused** with
`400 "Date range cannot exceed 366 days."`; reversed dates give
`400 "Invalid start date provided. Must be less than end date."`

**TURNS/YR USES THE EXCLUSIVE DAY COUNT.** For Jan 1 – Aug 4 the build divides by **215**, not the
spec's inclusive 216: `512/215*365/618 = 1.40648754422` matches the payload exactly (216 would give
1.39998). Reproduced on a second row. Useful as a worked example of settling a calculation dispute
from the payload alone.

### N.2 SBC / SBR report internals + the seeding chain (proven 2026-08-04, build v3.4.1-0ed4433)

**Report UI selectors (Quasar) — do not re-derive.**
- Date range trigger is **`span.date-range-label`** (NOT a `.q-btn`). Presets inside the popup are
  **`div.preset-option`** in **`div.preset-sidebar`** (active one also carries `.active`); the readout
  is **`span.range-indicator`** ("Range: N days"); then an **Apply** `.q-btn`.
  **Exactly NINE presets, and NO "Custom"/"Today"/"Yesterday":** Last 12 Months · This Year · Last Year ·
  This Quarter · Last Quarter · This Month · Last Month · This Week · Last Week. Default is **This Month**,
  which on this org is EMPTY — always widen to Last 12 Months before observing anything.
- Export menu = **`[aria-label="Export report"]`** (`btn_dropdown_<sbc|sbr>_export`), exactly four items:
  `Download Summary (PDF)` · `Download Expanded View (PDF)` · `Download Summary (CSV)` · `Download Expanded View (CSV)`.
  **No Print control exists on any report page.**
- Column selector = **`[aria-label="Column Selection"]`** (`button_column_selection`). **The menu ROW is
  NOT clickable** — the control is the **`q-toggle` `role="switch"` `data-test-id="toggle_column_<key>"`**
  beside the label. Clicking the row centre does nothing and reads as "the selector is broken"; clicking
  the toggle removes the column correctly. (Cost an hour once — don't repeat it.)
- Grand totals row = **`tbody tr.report-totals-row`**, label `Totals`. Row classes: `sbc-row--customer`
  / `sbc-row--asset` / `sbc-row--invoice`, `sbr-row--rep` / `sbr-row--invoice`.
- Expand-all is a header `.q-btn` with aria-label **"Expand all customers"** / **"Expand all representatives"**.
- Entity-filter menus have a real search input (`placeholder="Search customers"`) — you must **click the
  input inside the `.q-menu`** before typing, or the keystrokes go nowhere and it looks like search is broken.
- Filter state persists in **`localStorage['report_view:<slug>']`**; the **URL carries no filter state**.

**Report data + drill-down endpoints.**
- `GET /api/reporting/reports/sales-by-customer/{customerId}/assets?<filters>` then
  `.../assets/vehicle%3A{vehicleId}/invoices?<filters>` — SBC is a 3-level tree, loaded on demand.
- `GET /api/reporting/reports/sales-by-representative/{repKey}/invoices?<filters>`; the **Unassigned
  bucket's key is `00000000-0000-0000-0000-000000000000`**.
- **`showUnassigned=1`** is the Show Unassigned parameter (`show_unassigned`/`showUnassigned=true` also work;
  `includeUnassigned`/`unassigned` do NOT). It is the cheapest way to get a big SBR dataset without seeding.
- `productType=all|parts|service`; `invoiceStatus=all|paid|partially_paid|unpaid`; `customers=<uuid>`.
- A **span beyond ~2 years returns 400** — use `start_date` within 12 months for real data.
- Money is integer **CENTS** in every payload.

**Sales reps.**
- `GET /api/sales-reps` → `[{id (= the staff_id), name}]` — this is what the **work-order** selector uses.
- A staff member becomes selectable by setting **`is_sales_rep`** via
  `POST /api/staff/{staff_id}/change` (echo the whole record; **`workplace_id` must be non-null** or it
  400s "Missing required parameter").
- Assign on a WO: `POST /api/work-orders/change-sales-rep {work_order_id, sales_rep_id}` → 201.
  **⚠️ Returns 201 but SILENTLY NO-OPS for a work order in another workplace** — switch first with
  `POST /api/iam/change-location {workplace_id, workplace_timezone}`.
- The **customer's** rep is a different mechanism: `POST /api/customers/change` stores
  **`sales_rep_first_name` / `sales_rep_last_name` as STRINGS** (no `sales_rep_id`; sending one → 500), and
  its picker offers **all staff including inactive**, unlike the WO selector.
- **The report reads a SNAPSHOT taken at invoice creation** (SBR S19-R6/S19-N2): changing a WO's rep after
  invoicing does NOT move the invoice. So **a new invoice is the only way to create a new rep row.**

**The invoiced-work-order chain (each step's exact gotcha).**
1. `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`
   → 201; the response key is **`work_order_id`**, NOT `id` (getting this wrong silently strands work orders).
2. `POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id, status:'authorized'}` → 201
   `{line_id}`. Canned lines: `GET /api/work-orders/canned-lines` (filter to `fixed_price` set + your
   `workplace_id`). **The generic `POST /api/work-orders/lines/create` returns 500** once validation passes.
3. `POST /api/work-orders/change-mileage {work_order_id, mileage:'123456'}` → 201.
   **`mileage` MUST be a STRING** — a number returns 500. Without it, line-complete 400s
   "Line can not be completed without a Work Order mileage".
4. `POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id}` → 201. Required before
   completing a line ("Line can not be completed without a tech story"). **`/lines/change` returns 500.**
5. `POST /api/work-orders/lines/change-status {line_id, status:'complete'}` → 200.
6. `POST /api/work-orders/change-status {id, status:'complete'}` → 201. **The field is `id`, not `work_order_id`.**
7. `POST /api/invoices/create {work_order_id}` → **201** — **but ONLY if the work order carries a
   CONTACT PERSON.** Without one it returns **500**. See the next block: this is the single most
   expensive thing this chain got wrong.

**⚠️ THE CONTACT IS MANDATORY FOR INVOICING — the correction that cost us SV-8821 (proven 2026-08-04,
build `v3.4.1-0ed4433`).** The earlier version of this recipe said `invoices/create` "returns 500 on
this branch" and that the UI's Create Invoice failed too. **Both statements were wrong**, and they were
wrong because the chain above never set a contact.

- **`POST /api/work-orders/create` does NOT set a contact unless you pass one.** Add
  **`customer_id: <contactId>`** to the create payload — on this build **`company_id` is the business
  and `customer_id` is the CONTACT PERSON**, which is easy to misread as the same thing.
- **Get a contact id from `GET /api/customers/view/{companyId}` → `data.company.contacts[]`.**
  (`/api/customers/{id}/contacts` is **404**; not every company has one — pick a company where
  `contacts_count > 0`.)
- **On an existing work order:** `POST /api/work-orders/change-contact
  {work_order_id, vehicle_id, contact_id, update_vehicle:true}` → **200**. This is what the UI sends;
  `update_vehicle:true` writes the contact onto the **asset** permanently (the UI asks *"Would you like
  to change to the new contact for this asset permanently?"* → **YES**).
- **With a contact: `invoices/create` → 201** (work order status → **Invoiced**) and
  `POST /api/work-orders/invoices/estimate` → **200**. **Without: both → 500** with the generic
  `"An error occurred…"` body. Proven with everything else held constant (same customer, same asset,
  same canned line, identical `sub_total 386.75` / `total_cost 406.09`).
- **The bare `{work_order_id}` body is fine** — the UI sends a much larger body, but the minimal one
  returns 201 once a contact exists, so **do not chase the payload shape.**
- **UI-side gate (useful for any invoicing test):** with no contact the work order's **Finance tab is
  disabled** (`aria-disabled="true"`, tooltip **"Please select a contact for the asset"**) and **no
  Create Invoice button exists in the DOM**. The **Create Work Order** dialog has only *Customer ·
  Asset · Asset Here?* — **no Contact field** — so every freshly created work order starts in that
  state. The **New Asset** dialog makes **`Contact *`** required, which is why the tooltip says
  "for the asset".

**⚠️ Canned lines that bring PARTS cannot reach Complete without receiving them first.**
`GET /api/work-orders/canned-lines` on this branch returns **79** lines (all at Heavy Duty): **11**
with `fixed_price` (Fixed labour), **3** with `fixed_line_total`, **65** hourly via `labour_rate`;
**37 pull catalogue parts**. For a parts-bearing line,
`POST /api/work-orders/lines/change-status {status:'complete'}` → **400 ``"Line can`t be completed with
unfulfilled part requests."``**, so the work order never completes and `invoices/create` correctly
answers **400 `"Work order is not complete."`**. **Pick a `total_parts === 0` canned line** for any
seed that only needs a completed, priced line — filtering on `fixed_price` (as the original script did)
narrows you to 11 lines for no reason and hides the parts distinction that actually matters.
Enumerator: `build/report-suite/defect-pack-2026-08-04/repro-sv8821/tools/enumerate_canned.mjs`.

**Deleting seeded work orders.** A Complete/Invoiced WO cannot be deleted — first
`POST /api/work-orders/change-status {id, status:'estimate'}`, then
`POST /api/work-orders/delete {work_order_id}`. **⚠️ A missing work order answers
`400 {"workOrderId":"Not found"}`, NOT 404** — a cleanup verifier checking for 404 will wrongly report
everything still present.

**Reading PDF exports (the "PDF is an external dependency" excuse is wrong).**
`pip install pypdf` — and if it fails to import with `ModuleNotFoundError: _cffi_backend`, `pip install cffi`
repairs the broken system `cryptography` module. `apt-get install poppler-utils` 404s on this image, and is
unnecessary. Extractor: `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/extract_pdf.py`.

---

