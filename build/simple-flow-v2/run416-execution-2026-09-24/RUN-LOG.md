# Simple Flow V2 — run 416 execution log (production, Trucks Hill 2)

**Build read live at start: `v26.39.0-07c719b`** (app.shopview.com, 2026-09-24).
**Org:** 72b2cc90-6964-4429-a207-76e55f946936 · **workplace:** Trucks Hill 2. Every workplace this
account can reach belongs to that ONE organization, so the work-order settings are shared across them.

## Routes found by walking the screen (recorded per Rule 27/93)
| What | Route |
|---|---|
| Work Orders settings | `/administration/settings` → tab strip `Organization | Invoice | Work Orders` (NOT `/settings`, which 404s) |
| Work order detail | `/workorders/{id}` → redirects to `/workorders/{id}/lines` |
| Work orders list feed | `GET /api/work-orders?pagination[rowsPerPage]=..&pagination[page]=1&search=&showMyWorkOrders=0` → `data.work_orders[]` |
| Org settings read | `GET /api/organizations/settings` → `data` |

## The settings as found at the start of this run (both from the screen and from what the app stores)
| Group | Setting | On the screen | Stored |
|---|---|---|---|
| WORKFLOW | Require Approval for New Lines | off | `autoApproveLines: true` (inverted) |
| WORKFLOW | Require Review Before Completion | off | `requireReview: false` |
| LINE REQUIREMENTS | Require Tech Story | off | `requireTechStories: false` |
| LINE REQUIREMENTS | Require Mileage | off | `requireMileage: false` |
| LINE REQUIREMENTS | Require Engine Hours | off | `requireHours: false` |
| PARTS | Require Ordering Parts | off | `requireOrderingParts: false` |
| PARTS | Require Receiving Parts Before Completion | **on** | `requireVendorInvoiceNumber: true` |
| PARTS | Require Picking Inventory Parts | off | `autoPickInventoryParts: true` (inverted) |

Eight settings, three groups. The two renamed settings are stored inverted, exactly as the rename intends.

## Observations recorded so far
- **Part row menus with ordering and picking both off** (S2-861): `Move · Return · Move up · Move down ·
  Add Part Fee / Discount`; a core row offers only `Core OK`. **No Order, no Pick, no Receive anywhere.**
  Positive control passed — every menu opened and listed items, so the absence is a real absence.
- **Work order header menu:** `Audit Log · Timesheets (1) · Add Work Order Fee / Discount · Print Work
  Order · Create invoice · Delete Work Order`.
- **Confirmation dialogs** — all four PARTS/WORKFLOW switches were toggled and saved, and every one of
  them opened a confirmation naming the setting, the direction and a count of affected records:
  - Require Ordering Parts → "Turn on Require Ordering Parts?" · "123 parts at this location are affected"
  - Require Picking Inventory Parts → "Turn on Require Picking Inventory Parts?" · "57 parts … affected"
  - Require Approval for New Lines → "Turn on Require Approval for New Lines?" · "50 lines … affected"
  - Require Receiving Parts Before Completion → "Turn off …?" · "82 work orders waiting on parts can now be invoiced"
  Every dialog also states **"No record is changed by this switch"** and that parts/lines already on a
  work order keep the state they are in.
- **Cancel changed nothing:** the stored settings were read back after all four cancels and were
  byte-identical to the reading taken before. (C44558.)

## The settings sweep — the decisive test (2026-09-24)

**What the checks require.** Turning "Require Ordering Parts" OFF must place every part still waiting
to be ordered onto a real purchase order and move it to "Awaiting", by the same path a manual Order
press uses; the change must apply to every open work order; each swept record must be written to the
audit log naming the cause; and while it runs the settings page must show a progress indicator.

**What the product does.** Nothing is swept.

| Step | Observed |
|---|---|
| Parts recorded before the change | 66 parts across 45 work orders, every one `authorized` |
| The confirmation the product shows | *"Turn off Require Ordering Parts? … 123 parts at this location are affected by this requirement today. **No record is changed by this switch.** Parts already on a work order keep the state they are in."* |
| Progress indicator while applying | none — the save returns at once |
| Parts recorded after the change | the same 66, every one still `authorized` — **0 changed** |
| Audit log on an affected work order | no entry from the change; the newest entries are from 16 Sep |

The same holds in the other direction and for picking: turning "Require Picking Inventory Parts" OFF
says *"None of them is picked retroactively"* — the opposite of the warning about stock deduction the
check requires.

**Which confirmations appear.** All four switches confirm. The checks require a confirmation on
ordering and picking ONLY, and none on "Require Approval for New Lines" or "Require Receiving Parts
Before Completion" — both of those confirm too.

## What the two renamed settings do on screen
- **Require Picking Inventory Parts ON** → a **Pick** button appears on the part row and the part
  carries an **In Stock** badge. OFF → no Pick action anywhere, on the row or in the ... menu.
- **Require Receiving Parts Before Completion ON** → a **Receive** button sits on the part row of a
  part that is **Awaiting**.
- The org was left exactly as it was found: ordering off, picking off, receiving on, approval off.

## The receive modal (read on S2-925)
Opens **without leaving the page** (the address does not change). It carries a **Vendor missing** card
with **Assign Vendor**, then **Vendor Invoice Number**, **Invoice Date** (pre-filled with today),
**Delivery Note**, a part table with **Select All**, and a **Receive Parts (0)** button that is
**disabled** while nothing is selected.
