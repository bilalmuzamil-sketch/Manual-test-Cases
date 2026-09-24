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
