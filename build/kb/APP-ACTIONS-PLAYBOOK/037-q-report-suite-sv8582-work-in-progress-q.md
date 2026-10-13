## §Q — REPORT SUITE `sv8582`: Work In Progress + Quasar recipes (proven live 2026-08-06, build `v3.5-f77875c`)

**WIP EXPORT NEEDS `columns=` — WITHOUT IT YOU GET A 400 THAT LOOKS LIKE A DEFECT.**
`GET /api/reporting/reports/work-in-progress/export` returns
**HTTP 400 `{"errors":[{"error":"At least one column is required."}]}`** if `columns` is missing. The real
shape, taken off the product's own download menu with a request listener rather than guessed:
```
…/work-in-progress/export?format=csv|pdf&tab=<Tab>&from=<ISO>&to=<ISO>&locations=<id,id>
  &columns=wo_number,status,customer,asset,location,advisor,days_open,earned,remaining,total
  &sortBy=days_open&descending=true
```
Full column set: `wo_number,status,customer,asset,vin,location,advisor,days_open,last_activity,labor_earned,labor_remaining,parts_earned,parts_remaining,earned,remaining,inv_hours,total`.
**WIP uses `from=`/`to=` with full ISO instants plus `tab=`, NOT the other five reports' `range=`.**
Tabs: `Estimates` · `Completed` · `ApprovedPartiallyCompleted` · `ApprovedNotStarted`.
The data response carries `collection`, `pagination`, **`tab_counts`** (all four at once), **`totals`** and
**`summary`** (the seven-figure strip) — so **the whole strip and every tab total can be checked in one
call**, money in **cents**.

**WIP DATE-RANGE CAP, MEASURED:** a **366-day** span inclusive of both endpoints returns **200**; **367**
returns **HTTP 400 `{"errors":[{"error":"Date range cannot be over one year."}]}`**. So the first and last
days are both counted.

**LOCATION SCOPING:** omitting `locations` returns the **active location only** — counts identical to
passing that one id. An id the user cannot access, or a bogus uuid, is **silently ignored and falls back to
the active location** (no error). Useful as a ready-made negative for "no inaccessible location leaks".

**QUASAR: THREE THINGS THAT EACH COST A RUN.**
1. **A dialog backdrop swallows Playwright clicks.** `page.click('[data-test-id="button_new_line"]')` times
   out on `div.q-dialog__backdrop` even though the button is visible and enabled. **Fix: click the element
   centre by coordinate** — `const r=el.getBoundingClientRect(); page.mouse.click(r.x+r.width/2, r.y+r.height/2)`.
   Press `Escape` first to clear any dialog already open.
2. **A type-ahead multi-select needs its own input, and needs a dispatched event.** Typing with
   `page.keyboard.type` after clicking the control lands on the **page**, not the menu, so the list looks
   unfiltered and reads as a broken filter. **Fix: find `input` inside the open `.q-menu` whose
   `placeholder` starts with `Search`, set `.value`, then dispatch `new Event('input',{bubbles:true})`.**
   Query the **last** `.q-menu` in the DOM — earlier ones linger. Placeholders here are `Search assets`,
   `Search customers`.
3. **The shared date-range calendar navigates by `aria-label`** — `Previous month`, `Next month`,
   **`Previous year`**, **`Next year`**. Preset items are plain text inside `.q-menu`
   (`Last 12 Months`, `This Year`, …). **Clicking day cells to build a custom range did NOT register** for
   us — the readout stayed on the old range and Apply re-sent it, so a custom span is still best proven at
   the data layer.

**DARK MODE IS IN THE PROFILE MENU, NOT AN OS PREFERENCE.** `prefers-color-scheme: dark` does **not**
switch this app — the body stays `body--light`. The toggle is `[data-test-id="profile_menu_button"]` →
menu items **`Light`** / **`Dark`**; state persists in `localStorage.mode` (`"light"` / `"dark"`) and the
body class becomes `body--dark`. Forcing the class by hand works for a style read but is **not** what a
tester does — use the menu, and switch back afterwards.

**WO LINE SEEDING.** `POST /api/work-orders/create`
`{company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}` → **201
`{data:{work_order_id}}`** (company only → 500; no company → 400 naming the field). `POST /api/work-orders/lines/create`
with just `work_order_id` returns **`{"error":"Labor or fixed prices must be set."}`**, and
`labor_hours`/`labor_rate`/`labor_price`/`hours`/`rate` in every combination tried do **not** satisfy it —
**the field names are still unknown; learn them from the dialog's own request, do not guess.** The New Line
dialog (`dialog_line`) holds `select_line_canned_line` ("What Are You Doing?"), `input_line_description`,
`select_technician`, `select_labour_type` ("Labor Rate"), **`input_time_estimate` ("Estimated Time")**,
**`input_tech_time` ("Tech Time")**, `checkbox_line_approved`, `button_save_add_line`, `button_save_close`.

**⚠️ TWO CLAIMS THAT STOOD HERE WERE PROVEN WRONG — CORRECTED 2026-08-06, both live on `v3.5-f77875c`.**
Left in place as corrections rather than deleted, because each cost a session.

1. **`input_tech_time` is NOT the clocked time, and the earned/remaining maths does not read it.** A canned
   line was seeded carrying **`tech_time: 120` (2.00 h)** and the report still returned **`worked_hours: 0`
   and `labor_earned: 0`**. The report reads **clock records** — `total_clocked_time` — so the state those
   maths cases need is **a running clock**, not a "Tech Time" value:
   **`POST /api/technician-tasks/check-in {task_id, line_id, work_order_id, refresh_lines:true}` → 201**.
   Verified three times against the same running clock (worked 0.01/0.02/0.18 h of a 3 h quote gave Labor
   Earned $1.50/$3.00/$26.99, each matching the clocked share of $449.85 to the cent).
2. **The "at least one more field is required" hunt on Save & Close was a DEAD END — abandon it.** There is
   no unknown field to find: **pick a canned line and the dialog collapses**, and the seeding route is
   **`POST /api/work-orders/{woId}/lines/create-from-canned-line`
   `{another:false, canned_line_id, work_order_id, status}` → 201**. Approve with
   `POST /api/work-orders/lines/change-status {line_id, status:'authorized', workOrderId}` → **200**;
   move the work order with `POST /api/work-orders/change-status {id, status}` → **201** — note **`id`, NOT
   `work_order_id`**, which returns 400 *"Work Order ID is missing"*. Use `status:'authorization_required'`
   on the canned-line call to seed **unapproved** value.

**SIX MORE PROVEN FACTS FROM THE SAME SEEDING RUN (recorded 2026-08-06; they had been flagged in a pass
note and never written here, so each was at risk of being re-derived).**

1. **`POST /api/work-orders/change-status` takes `id`.** `{work_order_id}` → 400 *"Work Order ID is
   missing"*; `{id}` alone → **500**; `{id, status}` → **201**.
2. **The staff list carries TWO ids and the task endpoints want the second one.** `GET /api/staff` returns
   both `id` and `staff_id`. `POST /api/work-orders/tasks/create` answers **400 `{"staff_id":"Not found"}`**
   for the `id` and **201** for the `staff_id`.
3. **Clock IN:** `POST /api/technician-tasks/check-in {task_id, line_id, work_order_id, refresh_lines:true}`
   → **201**. ⚠️ **Clock OUT is NOT solved:** `check-out` answers
   **400 `{"error":"Task not found for the given technician ID."}`** for every id tried (task id, the
   returned record id, with and without the work order), and a second check-in elsewhere then fails with
   *"You are already clocked into different line."* **So a clock you start is effectively left running —
   start one only when you want that state, and say so in the pass notes.**
4. **`POST /api/work-orders/lines/change` is camelCase** — `lineName`, `timeEstimate`, `labourTypeId`;
   snake_case (`line_id`, `time_estimate`) returns *"Line name is missing"*. **The labour-price key is
   still UNKNOWN**: `labourRate`, `labourPrice`, `fixedPrice` and `techTime` all still return
   **400 `{"error":"Labor or fixed prices must be set."}`**. **Do not guess it — capture it from the
   *Edit labor* dialog's own request** (line kebab → **Edit labor**). It is **no longer on the critical
   path**, because `create-from-canned-line` seeds a priced line outright.
5. **The work-order list response key is `data.work_orders`, NOT `data.collection`.** Reading it as
   `collection` returns an empty list with **HTTP 200**, which reads silently and falsely as *"no work
   orders exist"*.
6. **WIP received-vs-outstanding parts live in two different arrays on a line:** `parts[]` is what arrived
   (it carries `arrived_date` / `delivery_id`), `part_requests[]` is what is outstanding. **Parts Earned
   INCLUDES the core charge** — omitting it made a verification formula miss by exactly $149.50 and look
   like a product defect.

**⚠️ CORRECTION TO THE 409 RECOVERY RECIPE ABOVE — IT HAS A LIMIT.** The recipe (call
`quick-login {"key":"admin"}`, swap only the returned `PHPSESSID`) works when a **failed quick-login**
rotated the per-branch session. **It does NOT work when the shared `sv_sso_session` itself has expired:
`quick-login` is SSO-gated too and returns HTTP 401 `sso_required` as well.** How to tell the two apart in
one step: **all three branch cookie sets carry the SAME `sv_sso_session` and `cf_clearance`** (only
`PHPSESSID` is per-branch), so **if `sv8582api`, `sv8785api` AND `sv8685api` all 401 together, the shared
token is gone and no self-service recovery exists — only the QA lead can supply a new one.** If only one
branch fails, it is the per-branch session and the recipe applies. Distinguish an expired `cf_clearance`
from an expired SSO session by the **shape of the refusal**: a Cloudflare block returns a challenge page,
whereas an application-level JSON `{"error":"sso_required", …}` means the request **reached the app** and
`cf_clearance` is still good.

