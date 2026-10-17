## §Y — WORK ORDER LINES: EVERY STATUS AND EVERY OPERATION, FROM THE SCREEN
### (shown by the QA lead on staging, 2026-09-10, with screenshots — do NOT re-discover this)

**Read this before trying to change a line, delete a line, or reach a work order status.** Three
sessions' worth of guessing was spent on these; every route below is the one the product actually
offers, and each was demonstrated on screen rather than inferred.

### Reaching a WORK ORDER status
| Status wanted | How |
|---|---|
| **In Progress** | press **Start** on a line's **Labor** row — the work order moves to In Progress by itself |
| **Complete** | press **Complete** on each line, then **Complete Work Order** (top right) |
| **Estimate · Approved · Review · Invoiced · Paid** | these already exist on staging work orders; filter the list |
| **Declined** | set the LINE status to Declined (below), or the work order's own status control |

**Do not try to set a work order to In Progress or Complete directly** — they are consequences of the
line actions above.

### Reaching a LINE status — click the LINE, not the badge
Clicking the line opens the **Edit Line** window: *What Are You Doing?* · *Why Are You Doing It?* ·
**Status** · Delete · Save & Close. The **Status** list offers exactly four values:

> **Authorization required · Declined · Authorized · Complete**

**🛑 THERE IS NO "CANCELLED" LINE STATUS.** Attempts to set `cancelled` / `canceled` / `cancel` /
`void` / `voided` / `rejected` / `on_hold` / `not_authorized` all return **400 "Invalid parameter
value"**. Clicking the status **badge** opens nothing — the badge is not a control. If a test case
asks for a Cancelled line, that is a **case-versus-build question** (Rule 106), not a defect to file.

### Deleting a line, and the bulk menu
**Tick the line's checkbox**, then open the **⋮ menu in the lines table header** (`button_line_bulk_action`).
It offers:

> **Set line status ▸ · Delete lines · Split work order**

So `Set line status` is a **second** route to line status, for one or many lines at once, and
**Delete lines is the only delete route** — there is no per-line delete button on the row, and the
part-request delete endpoints all answer 404.

### Other line facts proven the same day
- A **new line lands in `authorization_required`**; a part request cannot be picked there
  (*"This action can only be performed on the authorized lines."*).
- The **Labor row's own ⋮** offers only *Add Labor Fee / Discount* — **a line technician is NOT
  assigned from there**; the Labor row simply displays whoever is assigned.
- The **lead technician** is set from `select_lead_technician` on the work order — and **its first
  option is "Unassigned"**, so taking "the first option" assigns nobody and proves nothing.
- **Creating a work order behind the screen 500s on staging** — use the screen (§C, and the UI recipe
  there): *Create Work Order → pick Customer + Asset → Save → confirm*.
- **Setting mileage / engine hours behind the screen fails** (`work-orders/change` → 500,
  `work-orders/update` → 404). Set them on the vehicle or through the screen.

### §Y.1 — WORK ORDER AND LINE STATUS, PRINTING, AND THE JOB'S HISTORY (proven live on Staging 2026-09-10)

Everything here was observed on `app.staging.shopview.com` while finishing runs 418/419. Each line
cost a probe cycle to learn; none of it needs re-deriving.

- **LINE STATUS — `POST /api/work-orders/lines/change-status {line_id, status}`.** The parameter is
  **`line_id`** — `line` or `id` gives `400 {"line_id":"Missing required parameter"}`, which reads like
  a missing line and is really a wrong field name. Accepted values are the four the Edit Line window
  offers: `authorization_required` · `declined` · `authorized` · **`complete`**. `completed` and
  `cancelled` are both `400 {"status":"Invalid parameter value"}` — **there is no Cancelled line
  status in this product** (QA lead's screenshot, 2026-09-10).
- **WORK ORDER STATUS — `POST /api/work-orders/change-status {id, work_order, status}` → 201.**
  Valid names: `estimate` · `approved` · `ready_for_review` · `invoiced` · `paid` · `declined` ·
  **`complete`**. Two traps: **`complete` is refused with `"Cannot complete work order with incomplete
  lines."`** until EVERY line is `complete` (that refusal names the precondition — read it rather than
  trying more spellings, L0042), and **`invoiced` is refused from `paid`** — go back through `approved`.
- **COMPLETE WORK ORDER RAISES A DIALOG WHOSE BUTTON IS NOT CALLED "Complete".** With unordered parts
  on the job it reads *"N parts are not ordered yet … Cancel | Receive Parts | **Complete Without
  Receiving**"*. A confirm-handler matching `^complete$` silently does nothing and the job stays
  Approved — which looks exactly like "the build will not complete a work order" and is not.
- **THE WORK ORDER TOOLBAR MENU IS `[data-test-id=button_work_order_nav_bar_menu]`**; the print item is
  `[data-test-id=menu_item_print_work_order]`. Do NOT hunt for a three-dots by its glyph — the LINE
  table has its own, and picking the last one gives you the line menu (`Add Labor Fee / Discount`),
  which is how a whole status sweep once recorded "Print is absent" on four statuses.
- **PRINT IS OFFERED ON EVERY STATUS, INCLUDING A JOB WITH NO LINES.** Observed offered and not greyed
  out on estimate, approved, ready_for_review, invoiced, paid and declined, and on a job with **zero
  lines** (S2-32270) — where it prints the row **"No lines on this work order"** with
  `Total Actual Time: 0.00` / `Total Estimated Time: 0.00`. ⛔ **This CORRECTS the earlier note that
  "Print is greyed out when a work order has no lines"** — that note was wrong, and it had parked two
  cases as unrunnable. On a Paid job the menu drops to three items (Audit Log · Timesheets · Print Work
  Order); that is not a fault.
- **THERE IS NO "History" TAB.** The job's tabs are Lines · Parts · Notes · Stats · Finance. Its history
  is the **Audit Log** item in the toolbar menu (API `GET /api/work-orders/{id}/history`). A print
  writes an entry reading **`Work order printed history — <user> - Total: $<amount>`** with the
  timestamp, in the same list and shape as the other entries.
- **READ A BORDER OFF THE PRINTED PAGE FROM THE CELLS, NOT THE `<tr>`.** Quasar puts the rules on the
  `td`/`th`. Measuring `getComputedStyle(tr).borderBottomWidth` returns `0px` on every row of a page
  that plainly has rules on it — that reading produced a "no borders anywhere" finding that was purely
  the instrument. Take `max` over the row's children, top and bottom, and keep a positive control (how
  many ruled elements the same reader can see anywhere in the document).
- **CLEAR THE PARTS A CANNED LINE BRINGS:** `POST /api/work-orders/part/remove-request/{requestId}`
  → 200, one per entry in the line's `part_requests`. That is how you build a line with no parts.
  A line created by `POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id,
  status:'authorized'}` also starts with **no technician**, which is the subject for the "no technician
  assigned" cases.
- **IN FULL VIEW THE PART ROW'S EDIT CONTROL OPENS THE "Edit Part Request" MODAL, NOT AN INLINE ROW**
  (Part number · Description · Quantity · Source · Category · Vendor · Cost · Core charge · Sell price ·
  Margin % · Cancel order · Save & close). That is expected — C45064 "Full View has no inline edit row"
  is a PASSED case. Inline-edit cases must be run in **Tech View**, i.e. as the Technician quick-login
  user (§G: the Technician role already carries `view_mode:'tech'`, so no role change is needed).
- **`GET /api/auth/me` 404s on staging** — read the identity from `GET /api/auth/me/fe-permissions`
  (`fe_permissions`, `view_mode`, `cross_toggles`, `template_id`, `template_slug`, `system_role`).
  There is no `organization_id` there, so `GET /api/organizations/{org}/roles` cannot be built from it;
  enumerate people and their roles from **`GET /api/staff?limit=200`** (`role_label` per row).
  Staging today: Admin 15 · Technician 11 · Senior Service Advisor 1 · Sales Representative 2 ·
  Parts Technician 1 · **Time Clock User 1** — that last one is the ready-made "role that cannot see
  work orders" subject, reachable with `POST /api/switch-user {user_id}` and left with
  `POST /api/exit-switch-user`, so no role has to be edited at all.

### §Y.2 — WORK ORDER LINE STATUS: STAGED PARTS BLOCK IT, AND THE APP TELLS YOU SO (2026-09-10)

- **A line will not change status while it holds STAGED PARTS.** Both the screen and the direct route
  refuse. The screen refuses with a toast at the **bottom right**:
  *"Can`t change status while there are staged parts. Please move parts to another line or return
  them. Please try to resolve this."* The direct route refuses with
  `400 {"status":"Invalid parameter value"}`, which says nothing useful — **the screen is where the
  reason is**, which is one more reason to drive status changes through it.
- **To clear a line for a status change:** cancel its part *requests*
  (`POST /api/work-orders/part/remove-request/{requestId}` → 200, one per entry in `part_requests`)
  **and** return or move any part already **picked** (`parts[]`). Clearing only the requests is not
  enough — a line with `parts: 1` still refuses.
- **The Edit Line window's Save & Close does work** — proved by a control in the same window in the
  same sitting: changing **Tech Time** to `3.75` closes the window and the value reads back (as 225
  minutes). So a save that does nothing is the product refusing, not a broken button. **Read the
  toast before concluding anything.**
- ⚠️ **Tech Time is entered in HOURS and stored in MINUTES.** `1.00` on screen reads back as `60`.
  Typing the stored value back into the box (60) sets it to sixty HOURS (3600). Restore by typing the
  **hours**, not the number the API returned.
- **`authorization_declined`** displays as **"Auth Declined"** on the work order screen and prints as
  **"Declined"** on the printed page. Two different words for the same state — do not read the
  difference as a missing status.

#### 🛑 HOW TO READ A TOAST — POLL FROM THE MOMENT OF THE CLICK, NEVER ONCE AFTERWARDS

Quasar toasts auto-fade. Reading `.q-notification` **once**, several seconds after the action, finds
nothing and looks exactly like "the app said nothing" — which is how a correct refusal was written up
as a defect on 2026-09-10. Arm a watcher **before** the click:

```js
await page.evaluate(()=>{ window.__toasts=[];
  const grab=()=>{ for (const n of document.querySelectorAll('.q-notification, .q-notifications__list *, [role=alert]')){
    const t=(n.innerText||'').replace(/\s+/g,' ').trim();
    if (t && t.length>8 && !window.__toasts.includes(t)) window.__toasts.push(t); } };
  window.__toastTimer=setInterval(grab,250); grab(); });
// ... do the action, wait ...
const toasts = await page.evaluate(()=>{ const t=[...window.__toasts]; clearInterval(window.__toastTimer); return t; });
```

---


- **THE RED / BLUE NUMBERS ON A WORK ORDER'S STATUS PILL (List, Tech View, Board cards) — seeded 2026-10-17.** Red = lines in
  **Needs Approval**: add a line with `POST /api/work-orders/{wo}/lines/create-from-canned-line {canned_line_id, status:
  'authorization_required'}` → list answer `serviceActionsCount` ≥ 1, tooltip `"1 Line in Auth Req'd"` (not drawn on the Estimates tab).
  Blue = parts actions: a part request on a line (`/api/work-orders/part/make-request`) → `"1 Part Ready to Order"`. Read the count back
  in the list answer before judging a pill (L0431).
