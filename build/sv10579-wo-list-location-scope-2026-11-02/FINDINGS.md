# SV-10579 — Work Orders List: order and clock-in records must be scoped to the work order's location (2 Nov 2026)

## Sources read (live, 2 Nov 2026)
- SV-10579 (Task, TESTING QA, Medium, no labels, assignee Slavcho Mitrov, QA Branch https://sv10579.qa.shopview.com).
  Comments: 79919 Chris Ward (30 Oct) — the rule: *"The Work Orders list shows only parts orders and technician clock-ins made at
  the work order's own location. Anything made at another location doesn't show, even within the same company."* ·
  79954 Slavcho (2 Nov) — all 31 production records are same-company; no stored data changes.
- No developer QA handoff / test plan on the ticket (asked the QA lead).
- Bug family searched: SV-11051 (WO log readable from another location, Blocked), SV-11908 (timesheet location scoping, Open),
  SV-10633 (records saved to another org's location, Ready to Fix), SV-10583 (task move endpoints no tenant check, Open).

## Builds
- Branch sv10579: v26.43.5-e516d33, index.html last-modified Mon 02 Nov 2026 13:39:31 GMT.
- Production: v26.43.5-77de68c, last-modified Sun 01 Nov 2026 13:54:18 GMT (second admin login; the main login's session was refused).

## Where the records show on screen (from the list response + the app's own code)
| Record | List response field | Screen surface |
|---|---|---|
| Parts order | `orderId` | List "Waiting On Parts" badge is a link only when `orderId` and unreceived parts exist; it opens `Order` (receive) for that order id |
| Clock-ins (open task records) | `clockedInTechnicians` | List "Clocked In" column; Board card field "Clocked in" |
| Task records on the lines | `lineTechnicians` (board) | Board card field "Line technicians" |

## Production "before" attempt — test data (left in place, ZZAUTOTEST)
- Work order **S2-1788** (`cf137c46-0b4d-4d61-8b14-99d7e7541f83`) at **Trucks Hill 2**, line `b8316678-…` (canned line "Fdgfdg"),
  vendor part request `218c3e17-…` "ZZAUTOTEST SV-10579 cross-location part" (vendor Delete Test).
- Route 1, switch location on screen with the WO open: the app **navigates back to the Work Orders list** (no request on the WO).
- Route 2, two browser tabs (WO open at Trucks Hill 2 in tab 1, tab 2 switches to Truck Hill 1, then act in tab 1):
  - **Order** in tab 1 → `perform-request-status-action` refused, toasts *"Part request not found."* / *"Error performing part
    action."* (ev/prod/p14-tab1-after-order.png). No order created (list row `orderId: null`).
  - **Clock in** on the line in tab 1 → `POST /api/technician-tasks/check-in` **400** *"Cannot clock in to selected line"*,
    toasts *"WorkOrder not found."* (ev/prod/p22-tab1-after-clock.png).
- Conclusion so far: on today's production neither screen route creates a cross-location order or clock-in; the 31 production
  records are historical (Slavcho: the 4 clock-ins are from 28 Feb 2024 at a since-deleted location). The branch test therefore
  needs these records built another way — question raised to the QA lead.
- Session location of the second admin login was left on Truck Hill 1 by tab 2 — to be put back to its original default
  (Truck Hill 1 is that login's default location, so nothing to restore).


## Test mode (QA lead, 2 Nov): API way, nothing skipped. No recording, no technical section (not asked for).

## Branch test data (sv10579, build v26.43.5-e516d33, index.html last-modified Mon 02 Nov 2026 13:39:31 GMT)
| WO | Location | Records on it |
|---|---|---|
| S10579-17581 (`91584361`) | Heavy Duty | open timesheet entry made **at Lethbridge** (`075bbd49`, staff 34156e50); closed entry at Lethbridge (`f62d1326`); closed line clock-in made at Lethbridge then moved onto its line (`bf1116ad`) |
| S10579-17582 (`f43c61d6`) | Heavy Duty | own-location parts order `8c200267`; open line clock-in by Admin ShopView at Heavy Duty |
| S10579-17584 (`7d283a78`) | Heavy Duty | open timesheet entry at Heavy Duty (Michael Stephenson); moved closed Heavy Duty clock-in `dc0af7b6` |
| S10579-17585 (`b39e72e8`) | Heavy Duty | own-location parts order `ef3302c4`; closed Heavy Duty line clock-in by Tech ShopView |
| S10579-17583 (`436328d1`) | Lethbridge | own-location parts order `030cfff2` (used for the move attempt) |
Location of every entry proven from the work order's Timesheets list (`technician-tasks/list` filtered by work order): `workplace_id`.

## Variant matrix (Rule 96) — what the list must hide vs keep
| # | Record on a Heavy Duty WO | Surface | Result on branch | Verdict |
|---|---|---|---|---|
| 1 | open clock-in made at Lethbridge (17581) | List "Clocked In" | empty | PASSED |
| 2 | same | Board "Clocked in" | field absent | PASSED |
| 3 | open clock-in made at Heavy Duty (17584, timesheet entry) | List / Board | Michael Stephenson / "Clocked in Michael Stephenson" | PASSED (still shows) |
| 4 | open line clock-in at Heavy Duty (17582) | List / Board | Admin ShopView / clocked in + line technicians "AS" | PASSED (still shows) |
| 5 | closed line clock-in at Heavy Duty (17585) | Board "Line technicians" | "TS" (Tech ShopView) | PASSED (still shows) |
| 6 | own-location parts order (17582, 17585) | List "Waiting On Parts" link | "1 Part Waiting" opens `/order/8c200267…` and `/order/ef3302c4…` (their own orders) | PASSED (still links) |
| 7 | **parts order made at Lethbridge** for a Heavy Duty WO | List "Waiting On Parts" link | **cannot exist through the product** — every screen and request below refuses it; 0 such orders on the branch (125 checked) or on production (283 checked) | NOT OBSERVABLE (state unreachable) |
| 8 | **line clock-in made at Lethbridge** on a Heavy Duty WO's task | Board "Line technicians" | **not produced by time records at all** — a time record alone never makes a line technician, even at the same location (S-17587 control); a clock-in at the other location is refused | NOT OBSERVABLE (state unreachable) |
Note on 8: moving a time entry onto another work order's line does not make a line technician even within one location
(17584 control: moved Heavy Duty clock-in → Line technicians stays empty) — Line technicians follow the clock-in's own task,
so 17581's empty Line technicians proves nothing about the fix and is NOT counted as a pass.

## Every route tried to create rows 7 and 8 (all on the branch, all refused or not linking)
- Order the part from a stale tab / with session at Lethbridge → *"Part request not found."* (same on production).
- Manual parts order at Lethbridge (`inventory/orders/create`) → created `208e4be0`, but `work_order_id: null` (not linked to any WO).
- Same with the part request id → *"Part request does not exist."*
- Move an ordered Lethbridge part request onto the Heavy Duty line (`part-request/move-to-line`) → HTTP 500 (both locations).
- Split a Heavy Duty work order from Lethbridge (`work-orders/split {ids}`) → *"No lines found by given IDs."*
- Line clock-in at Lethbridge on the Heavy Duty line → *"Cannot clock in to selected line"*.
- Move labor (moves the task itself): Admin role **Move labor** toggle switched on, saved through Edit Anyway + Confirm (PUT 200),
  reload shows it **off**; admin permissions still lack `woMoveLabor` (ev/branch/role-movelabor-before.png / -after.png) — same as
  SV-11253 (developer: permission missing from the QA database template).
=> (first round) these two record shapes could not be created; QA lead asked for every route to be tried — see below.

### Second round, 2 Nov (QA lead: "Why cant you do this by yourself? Try API and UI all the ways")
Parts order (row 7):
- Part sale P-248 at Lethbridge: line approved, part ordered (order ead4d943), `part-sales/move` to the Heavy Duty WO from either
  location, either direction → *"Part request not found."*
- Screen: Lethbridge WO S-17583 → Lines tab → part's ⋮ → **Move** → "Move part to line:" dialog. The **target work order list offers
  only Lethbridge work orders**; searching 17581 finds only S-17583 (ev: /tmp only — screen walk, not an exhibit).
- `work-orders/part-request/move-to-line` with the dialog's full body (part_request_id/partRequestId, target_line_id,
  target_work_order_id, work_order_id/workOrderId) → HTTP 500 from both locations.
- `inventory/orders/create` naming the Heavy Duty WO → needs an inventory item id; with one, the order is created unlinked (as before).
- Move the work order itself: S-17589 (Heavy Duty, part ordered at Heavy Duty) → `work-orders/change-required-data
  {work_order_id, workplace_id: Lethbridge}` → 201 "data updated", **work order stays at Heavy Duty**. No screen offers it either.
- Scan for old data: branch — 125 purchase orders linked to a work order across both locations, **0** at a different location from
  their work order. Production test org (build v26.43.5-77de68c) — 1,641 list rows over 4 locations, 283 with an order, **every one**
  opens from its own work order's location (order details are location-scoped: 400 from another location).
Line technician (row 8):
- Board "Line technicians" = the line's assigned technicians (`GET /api/work-orders/{id}/line-technicians`: source "manual",
  derivedFromLeadTech). A clock-in adds the technician there; a timesheet entry does not (S-17587 control: Heavy Duty entry for
  Tech ShopView → no line technician; S-17586: Stephen Grimes entry → no line technician).
- Clock-in at Lethbridge on a Heavy Duty line refused for a task made at Heavy Duty **and** a task made at Lethbridge
  (*"Cannot clock in to selected line"*); the Lethbridge-made task clocked in at Heavy Duty → record at Heavy Duty.
- Clock in at Heavy Duty, switch to Lethbridge, clock out → record stays Heavy Duty (S-17588, 6945187b).
- Edit the record from Lethbridge (`technician-tasks/change`) → 201, record stays Heavy Duty.
- A Lethbridge timesheet entry on S-17588 and the Heavy Duty clock-in share one task; after moving the Heavy Duty clock-in away, the
  line still shows Tech ShopView — from the assigned list (locked: "hasLoggedLabor"), not from the time record. Clearing lead
  technician + assigned list does not remove him (logged labor). So the board cannot show a line technician that comes only from a
  time record, at any location.
- Technician cannot add timesheet entries (403); time entries cannot be deleted (no delete on Timesheets).
=> Conclusion: on this build neither shape can be created by any screen or request, and neither environment holds one. The
   reachable cross-location record — a time entry made at another location on the work order's line — is row 1 (PASSED, hidden),
   and the production before (S2-1788) shows the same kind of record listed under Clocked In.
Test data left (per-ticket branch, no cleanup): S-17586…S-17589, part sale P-248 + order, Lethbridge timesheet entries on S-17588.


## Production before (screens) — build v26.43.5-77de68c
- Open timesheet entry made at **Truck Hill 1** for ZZAUTOTEST NT1 Ana Brooks (`23bd9c47`, proven in Truck Hill 1's timesheet report)
  on S2-1788 (Trucks Hill 2) — made with the same timesheet request that works on the branch (no screen offered it).
- Work Orders list at Trucks Hill 2: S2-1788 Clocked In = **"ZZAUTOTEST NT1 Ana Brooks"**; Board card: "Clocked in ZZAUTOTEST NT1 Ana Brooks".
- Production list/board preferences of the second login restored and re-read identical (PATCH 200).
- Left in place (test data): S2-1788, its part request, the open timesheet entry for Ana Brooks.

## Exhibit
- ev/before-after-clocked-in.png (production list vs branch list, annotated).

## Side observations (Rule 93 buckets)
- (d) UNVERIFIED: the timesheet entry request accepts a work order from another location (that is how rows 1 and the production
  before were made). Whether any screen offers it is not settled — Reports → Timesheet Activities at Lethbridge showed
  "Something went wrong loading this section" (ev/branch/timesheet-new-wo-picker-at-lethbridge.png). Not filed (Rule 94).
- (c) Production list API returned `clockedInTechniciansCount: 0` with one name in `clockedInTechnicians` for S2-1788; the screen
  shows the name. Not a finding.

## Learning check
- Before calling a state unreachable, scan for existing examples of it (branch + production) — cheap, and it settles whether only
  legacy data holds it.
- Line technicians on the board come from the line's assigned list, not time records — check the data source of a column before
  building records to drive it.
- The split request body was already recorded (SV-9304, playbook) — I probed it blind before running recall.sh. Recall first.
