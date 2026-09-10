# "Move part to line" — the dialog's button does nothing (investigated 2026-09-10)

**Status: not filed. One hand click by a person is the only variable left, and the QA lead is doing it.**

This started as a caution logged during the SV-9807 pass (*"could not complete in my run"*) because the
suspect was my own automation. It has now been pushed as far as it can be pushed from a script, and
**everything except "a headless browser specifically" has been eliminated.**

## What the dialog is

On a work order's **Lines** tab, a part row's **⋮** menu offers **Move · Move up · Move down · Add Part
Fee / Discount**. **Move** opens a dialog titled **"Move part to line:"** with two selects — **Work
Order** and **Target Line** — and a **Move To Line** button. Controls:
`button_part_context_menu_<partId>_line_<lineId>` → menu item *Move* → `select_work_order_select` ·
`select_move_part_target_line` · `button_move_part_action`. The dialog's own chunk is
`WorkOrderSelect.*.js`, loaded on open.

## What happens

With **both** selects showing a value — and chosen from their dropdowns this time, not merely
displayed — pressing **Move To Line** produces, over five seconds of waiting:

- **no HTTP request of any kind** (network recorder empty),
- **no toast, no error, no validation message** anywhere in the dialog,
- **the dialog stays open** and the part does not move,
- **no JavaScript console error and no page error**,
- and `button_move_part_action` is **not disabled** — `disabled: false`, no `disabled` class.

The equivalent server call works: `POST /api/work-orders/part/move-part-to-line
{part_id, target_line_id, work_order_id}` → **200**, and the part moves.

Exhibit: `ev/EX1-move-to-line-does-nothing.png`.

## What has been eliminated

| Suspect | How it was ruled out |
|---|---|
| A disabled button | read `disabled: false` and no disabled class, at the moment of the click |
| The Target Line not actually selected | the field reads *"2 - Service - Cabin Air Filter - Preventative Maintenance"* after picking |
| The Work Order select left unset | re-picked **S2-32850** from its own 30-item dropdown; same result |
| A silent validation refusal | swept `.q-field--error` and `.q-field__messages` — nothing |
| A thrown handler | console and `pageerror` captured across the click — both empty |
| My click method | four ways: Playwright locator force-click (×2), an in-page `.click()`, and a real `mouse.click` at the button's measured centre |
| One environment | reproduces on `sv9807.qa.shopview.com` **and** on `app.staging.shopview.com` (the released build) |
| One part state | failed for a **picked** inventory part (SV-9807, RFU-505) and for an **awaiting-order** part (here, 122993) |
| Stale page state | every attempt was a fresh page load |

**Not eliminated:** that headless Chromium is somehow the cause. That is why a person clicking it once
settles it, and why nothing has been filed yet.

## The record to reproduce it on

Seeded on **staging** for a hand check, left in place:

- work order **S2-32850** — customer **4 Star Truck Repair**, vehicle **2020 Ford Transit**
  (VIN `SVEWU82M5ETEJFWFA`), created 10 Sep 2026
- **line 1** *"Service - Transmission service (Automatic)"*, Approved, holding part
  **(122993) Mobil 3309 ATF, 1L**
- **line 2** *"Service - Cabin air filter"*, Approved, empty — the move target
- direct link: `https://app.staging.shopview.com/workorders/585e57f7-5a4e-41ee-ba08-cffacc363b1d/lines`

Ids, for a script: part `3e5774bc-7609-4fef-9088-b42fc75fd4ab` on line
`de1f83b6-3f57-40f7-b8e5-0d7bb21cf5d6`, target line `cb30be38-6466-4daa-8deb-8a4b608e1b0d`, work order
`585e57f7-5a4e-41ee-ba08-cffacc363b1d`.

## If it is confirmed by hand

It is a **customer-facing defect on the released build**: a user fills the dialog, presses the button,
and nothing at all happens — no movement and no explanation. Worth noting for whoever picks it up that
**the server side is fine**, so the fix is in the dialog's submit path.

Honest correction to our own earlier record: the SV-9807 write-up called this *"a caution rather than a
defect claim"* and leaned toward blaming the automation. On the evidence above that hedge was too
generous to the build.
