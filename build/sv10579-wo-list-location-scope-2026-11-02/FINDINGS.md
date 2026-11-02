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

## Status
- In progress. Waiting on the QA lead: test mode (API / conventional), recording yes/no, technical section yes/no, and how to
  build the cross-location records on the branch.
