# Maintenance Reminders — Design (SV-3780)

| | |
|---|---|
| **Epic** | SV-3780 |
| **Status** | Design agreed 2026-08-27. Not yet ticketed — epic has zero child issues. |
| **Supersedes** | Sections 2–5 and 11 of *Maintenance Reminders Handoff* (Confluence 778469399). Sections 6–8 of that page (PRD source, architecture, invariants) remain valid except where §11 below corrects them. |
| **Reference build** | `origin/SV-3780-maintenance-reminders` @ `cbe5bf0c`, draft PR #2786, QA at `sv3780.qa.shopview.com` |
| **Author of this design** | Milos Vasic, from a design session on 2026-08-27 |

---

## 1. Why this document exists

A working proof of concept exists on the branch above and is deployed to QA. It is functionally broad — 6 tables, 28 endpoints, ~50 frontend files, all quality gates green — and most of its engine is worth keeping. What it does not have is a coherent user flow: authoring a single reminder takes five clicks across two tabs and a ten-field dialog, the same eight fields appear on two competing surfaces, and the model cannot express the one thing every heavy-duty shop actually does (tiered PM where the higher tier absorbs the lower ones).

This document fixes the flow and the object model. It is an upgrade path on the existing branch, not a rewrite: the status engine, the cron, the completion subscriber, the persistence layer and the work-order intake prompt all survive unchanged.

---

## 2. The problem

Shops track preventive maintenance on memory, the customer's memory, and by digging through old work orders. All three fail quietly: the service is skipped, the customer feels forgotten, and the shop loses work it should have booked.

It is worst for use-driven jobs. The shop cannot know a unit's mileage or engine hours unless a human types one, and the only routine moment a human types one is a visit — so a unit that comes in twice a year is invisible for six months and then appears already overdue.

Requirements source is PowerTools PRD #8 (91 customer data points across 57 companies, benchmarked against Fullbay). Recurring themes: PM tracking is too manual; reminders must live on the asset and survive work-order history; date + mileage + engine hours + whichever-first must all work; an alert is only useful if it converts to bookable work in one click; compliance intervals (DOT, CVIP, 90-day, annual) are the concrete jobs behind the abstraction.

**Primary user: the service advisor.** Their job on Monday morning is *"what work can I book into this week's empty bays, and who do I call to get it?"* Compliance is a filter on that list, not a separate product. The owner/manager and the fleet customer are secondary in v1.

---

## 3. Industry grounding

Four properties of an asset decide which services it gets. They are properties of the asset, not choices an advisor makes per plan — which is why the current 7-way "What Makes It Due" dropdown is the wrong control.

**3.1 The meter follows the asset class.**

| Asset kind | Meter | Why |
|---|---|---|
| Over-the-road tractor | Odometer | Miles predict wear reliably |
| Vocational / PTO-heavy (mixer, refuse, oilfield, service truck) | Engine hours | An idle hour ≈ 25–30 mi of engine wear with zero odometer movement. A refuse truck logs ~2,000 hrs and ~18,000 mi a year — mileage triggers leave it chronically under-serviced |
| Trailer | Calendar (~quarterly) | Trailers sit in yards for weeks; brakes corrode, lights fail, ABS degrades while the odometer does not move |
| Stationary / genset | Engine hours | No odometer exists |

**3.2 Tiers nest.** Roughly PM-A every 10–15k mi (or ~250 hrs), PM-B every 25–30k (~750 hrs), PM-C every 50–60k (~2,000 hrs), PM-D annually or ~100k. Bands vary by fleet, which is why **we ship no templates**. The rule is universal and must be built: **when the C comes due it supersedes the A and B — one visit, one work order, all three checklists.**

**3.3 Compliance is not convenience.** The US annual periodic inspection (49 CFR §396.17) and the Canadian CVIP under NSC Standard 11 are calendar-only, mutually recognised, cannot lapse, and put the unit out of service if they do. Established practice is to schedule at **11 months for a 12-month requirement** so the certificate never expires while the unit waits for a bay. Missing an oil change costs money; missing a CVIP costs the truck.

**3.4 Duty cycle is a multiplier.** Severe duty (heavy haul, stop-and-go, dust) tightens every interval 15–20%. One number on the asset, applied to the whole program.

Sources: oxmaint 2026 HD interval chart · heavyvehicleinspection PM program guide · truckcmms PM A/B/C/D for trucks and trailers · J.J. Keller PM program elements · eCFR 49 CFR §396.17 · NSC Standard 11 · FMCSA on US/Canada periodic-inspection equivalency.

---

## 4. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Primary user is the service advisor.** | The entry-point argument was unresolvable for three months because nobody had named the user. Every surface decision below follows from this. |
| D2 | **One row on the workbench = one bookable visit per unit**, not one due service. | The phone call is about the truck, not about the oil change. It is also the only shape in which tier supersession and slot-offering mean anything. |
| D3 | **Due timing is projected from the unit's own history**, with a four-tier fallback and a mandatory calendar backstop at every tier. Compliance dates are never projected. | See §7. Puts a low-mileage unit on the list *before* it is overdue instead of after. |
| D4 | **Schema adds `mileage_reported_at` and `engine_hours_reported_at`** on the vehicle. | `vehicle.mileage` has no timestamp today, so "last reported 34 days ago" is unanswerable without a subquery against work orders. The column makes freshness honest everywhere. |
| D5 | **Entry point is a fifth tab on Work Orders**: All / Estimates / Work Orders / Completed / **Maintenance**, behind an org feature flag, with a count badge. | Root redirect after login is `WorkOrders` — confirmed in `routes.ts`. The Dashboard is **not** a nav item: `DesktopMenu.vue` documents that *"the logo is the ONLY Dashboard entry point in the top nav"*, and it is gated on `organizationHasFeature('DashboardAdministrator')` **and** `permissionService.has('reportsPageAccess')`. A dashboard widget is therefore invisible to any org without that flag, any user without reports access, and anyone who never clicks the logo. It is the weakest of the three surfaces the design review chose, and the only one that was never built. |
| D6 | **Nav and API permissions align on work-order atoms.** | All 28 endpoints are already gated by `ROLE_WORK_ORDER_VIEW` / `_CREATE_AND_EDIT` / `_DELETE`. Under Reports, nav and API disagree — a user with report access and no work-order view opens the page and gets 403s. Under Work Orders they agree, and the deferred debate about granular report permissions (handoff decision 3) stops blocking. |
| D7 | **`MaintenanceDueBanner.vue` is deleted. No bell. No header wrench icon.** | The tab is two pixels away; two signals for one thing is noise. The bell is intentionally excluded — it is already saturated with other notifications and users barely read it. Nothing transient replaces the banner: a toast on every landing has the badge's noise problem *and* is gone when you look for it. |
| D8 | **Three surfaces, three frequencies.** Settings → Maintenance programs (rare). Asset → enrol on program (constant). Work Orders → Maintenance tab (daily). | Today "create plan" and "assign to asset" have the same UI weight and wildly different real frequencies. Authoring belongs in Settings beside Inspection Templates (`administration/inspection-templates`, `requiredPermissions: ['settingsService']`, gated by `checkIfDigitalInspectionsEnabled`) — an established pattern we copy, which also supplies the org on/off flag. |
| D9 | **The program owns the meter, the tiers, the intervals, the canned lines per tier, the advance warning, and whether the customer is emailed.** Per-schedule copies of those settings are removed. Shop-level Reminder Settings holds delivery only (which role gets the digest, how often, who is CC'd). | With 40 trucks on a 4-tier program, per-schedule settings mean 160 independent decisions and no answer to "how early do we warn for CVIP?" A policy change means editing 40 rows. On the program it is one field for the whole fleet. Exceptions are stored as **per-enrolment overrides** so the list can show "this one differs from the standard". |
| D10 | **Ad-hoc schedules without a program are removed.** | Today `Add Schedule` on the asset has `Start From A Plan (Optional)`, so the plan library never becomes authoritative. After a year a shop has hundreds of hand-typed schedules and no PM standard. |
| D11 | **The Maintenance tab has two zones.** Top: units due with no work order yet — this is the notification surface. Bottom: maintenance-originated work orders in flight. The advisor promotes from top to bottom by hand; the system never auto-creates estimates. | Auto-creating burns work-order numbers on work that may never be agreed, and a shop with 200 units gets 200 estimates. Reminders are automatic; offers are a human decision — which is also where Fabijan's line sits. |
| D12 | **Enrolment creates one `maintenance_schedule` row per tier.** The visit bundle is computed on read and never persisted. | This preserves the entire existing engine — `ScheduleStatusCalculator`, `NextDueCalculator`, `IntakeDueEvaluator`, the cron, `WorkOrderCompletedSubscriber`, activity, cycles, the vehicle write-back — and adds a program layer above plus a bundling layer on read. Persisting the bundle would create a second source of truth for something that changes daily. |
| D13 | **Changing a program's interval re-anchors enrolled assets by default, and the shop is shown the blast radius before saving** ("this moves 40 assets"). | If the fleet does not follow a policy change, the policy does not exist. But moving 40 units silently is a surprise noticed only when 12 go overdue at once. |
| D14 | **The customer's click is a request, not a booking.** It creates a work order in `estimate` status flagged `customer_requested` with a requested window; the advisor confirms. Nothing enters the technician schedule without a human. In v1. | Delivers nearly all the value — the customer says when it suits them, the advisor stops making six calls to extract that — without ever promising a slot the shop cannot keep. A true reservation needs an appointment object and capacity locking, which do not exist. |

---

## 5. Object model

### 5.1 New

**`MaintenanceProgram`** — organization-level, optionally bound to one or more `VehicleTypes` (Settings already has a Vehicle Types page, so asset class is an existing configurable vocabulary). Carries the meter (`odometer` / `engine_hours` / `calendar`), a **mandatory calendar backstop interval**, and an ordered set of tiers.

**`ProgramTier`** — belongs to a program. Carries name (A/B/C/D or free text), interval in the program's meter, an optional own calendar interval, an **ordered list of canned lines**, advance warning, a customer-email flag, and `kind`:

- `routine` — participates in supersession.
- `compliance` — no meter, calendar only, holds the certificate date as a **fact**, schedules at (interval − buffer), never projected, never superseded, and **cannot be snoozed past its deadline**.

**`AssetEnrolment`** — asset + program + baseline readings, plus any per-enrolment overrides. This is the only object the advisor creates.

### 5.2 Reused

- **`maintenance_schedule`** — one row per enrolled tier, exactly as it exists today, additionally linked to the enrolment and the tier.
- **`maintenance_schedule_work_order_link`** — already exists with Draft/Active statuses. Promotion to an estimate is the existing `CreateWorkOrderFromSchedule` handler called for several schedules at once.
- **Estimate** — `work_order` with `status = 'estimate'`. `Status.php` already defines `estimate, in_progress, approved, declined, ready_for_review, complete, invoiced, paid`. No new entity.
- **`CannedLine`** — already carries `timeEstimate` and `techTime`, so **visit duration is a sum over canned lines**. No ShopCoach, no AI, no new estimation.

### 5.3 Computed, never stored

**The visit bundle.** Group actionable schedules by asset; within each program, the highest due tier absorbs the lower ones; across programs, deduplicate canned lines by id so a unit never gets oil twice; sum value from sell prices and duration from `timeEstimate`.

---

## 6. Surfaces and permissions

| Surface | Route | Gate |
|---|---|---|
| Maintenance programs (authoring) | `administration/maintenance-programs` | `settingsService` + org feature flag |
| Asset enrolment | asset → Maintenance tab; bulk from asset list / customer page; nudge on WO completion | `ROLE_WORK_ORDER_CREATE_AND_EDIT` |
| Maintenance workbench | Work Orders → Maintenance tab | `ROLE_WORK_ORDER_VIEW` + org feature flag |
| Reminder delivery settings | shop settings | `settingsService` (**currently not admin-gated — must be fixed**) |
| Reports → Maintenance | `reports/maintenance-reminders` | kept as an alias for users who look for it as a report |

**Authoring from the asset.** The enrolment dialog carries a "No suitable program? **Create one**" link for users with `settingsService`, which navigates to Settings and **returns to the same asset with the new program preselected**. Users without that permission see "**Request a program**" instead — a short form (what is needed, which asset class, which interval) routed to an admin. Without it, an advisor without settings permission is stuck on a step they perform daily.

---

## 7. Due timing

### 7.1 Sources we can project from

| Source | The pair | Note |
|---|---|---|
| `work_order.mileage` / `.engine_hours` + `work_order.start_date` | (date, reading) per visit | Richest source; `start_date` is indexed |
| `work_order_imported.vehicle_mileage` / `.vehicle_hours` + `.invoice_date` | (date, reading) per legacy invoice | Shops that imported history have back-history from day one |
| `maintenance_schedule_cycle` | reading at each completion | What the feature writes itself |
| Inspection report data | `vehicleMileage` snapshot | Extra points from DVI |
| `vehicle.mileage` / `.engineHours` | current value only | **No timestamp today** — hence D4 |

### 7.2 The fallback ladder

The unit is never invisible at any tier.

1. **≥2 usable points** → rate (mi/day or hrs/day) from this unit's own history. Projected date shown with confidence and last-reported age. Points must be monotonic; a reading lower than an earlier one is rejected.
2. **Exactly 1 point** → no rate exists. Fall back to a **shop-settable default rate per asset class**, labelled as a default rather than a measurement, low confidence.
3. **0 points but a reading exists** → no projection. Show the gap in units, not dates: "due in ~900 mi · no usage history".
4. **No reading at all** → "**Needs a current reading**", explicitly, never a blank.

**The calendar backstop runs at every tier.** Every program carries a maximum calendar interval — roughly 6 months for a PM regardless of miles, quarterly for trailers — so a unit surfaces even at tier 4. This is the answer to "if we have no data, on what basis do we send anything": the calendar. Everything else only moves that date earlier.

### 7.3 Implausible readings

Readings are rejected when implausible, not only when empty. The concrete case from QA: a 2004 Ford F-350 showing 217,649 mi and **11 engine hours**. Engine hours are ignored when they imply an average outside a realistic band for the asset's age. Without this rule the system concludes the engine is nearly new and never warns.

---

## 8. Flows

### A — Shop defines the standard *(Settings, rare)*

1. Settings → Maintenance programs → New
2. Name, bind to one or more Vehicle Types, choose meter
3. **Mandatory** calendar backstop
4. Add tiers bottom-up: name, interval, canned lines, advance warning, customer-email flag
5. Compliance tiers: `kind = compliance`, calendar term, buffer
6. Save → available organization-wide

No templates ship. What is right for one jurisdiction is wrong for another.

### B — Asset is enrolled *(constant; three entries, one dialog)*

1. System reads the asset: `Type`, mileage, engine hours
2. **Suggests** a program when `Type` is populated — it is populated on roughly 3 in 10 assets, so an empty suggestion is the normal state, not an error. Type is never guessed from the VIN without confirmation, and a missing type never blocks enrolment.
3. Shows **live-computed thresholds** while choosing: "reads 217,649 → A at 227,649 · B at 242,649 · C at 267,649". This is the fix for the interval/target ambiguity in §11 F9.
4. If the program has a compliance tier, the **current certificate date is required** and the tier cannot save without it.
5. Last service optional; when blank, counting starts today **and the dialog says so**.
6. Save → one `maintenance_schedule` per tier, all linked to the enrolment.

### C — Advisor works the tab *(daily)*

1. Login → Work Orders → badge on **Maintenance [12]**
2. Top zone: units due, compliance first, then by risk and value
3. **Send** (batched email) → wait 3–5 minutes → **Call** (phone number printed in the row). This order is deliberate: it lets the advisor open with "look at the email I just sent you, let's go through it together" — Foothills' own practice.
4. Customer agrees → **Estimate** → work order in `estimate` status carrying every canned line from every tier entering the visit, supersession applied
5. Row moves to the bottom zone. The reminder stays active — it is not done until the work is done.
6. A morning digest email repeats the same content, with phone numbers and CTAs, for whoever does not open the app.

**Empty state.** While any enrolment exists the calendar backstop guarantees the top zone eventually fills. If there are genuinely no enrolments the empty state says "no assets are on a PM program" with a button to enrol them — not "no data".

### D — Work order completes

`WorkOrderCompletedSubscriber` already advances every schedule holding a Draft/Active link to **that** work order, writes a cycle, and pushes the reading to the vehicle forward-only, with service date = completion date. Added: `mileage_reported_at` is stamped, and if the unit is not on a program, the enrolment nudge from flow B appears — the only moment when asset, reading, date and completed work are all already on screen.

### E — Adding maintenance to an existing work order *(already built, kept)*

`AddScheduleToWorkOrder`, the `addToWorkOrder` endpoint, `GetWorkOrderSuggestions` and `MaintenanceIntakeSection` in the `VehicleCard` footer already do this: a collapsed "Maintenance: N overdue, M upcoming" bar opens to show each service with its line total, one click adds it. Under the program model it gains grouping by program, supersession within a program, and canned-line dedup across programs.

One change: `DismissWorkOrderSuggestion` must apply **to that work order only**, not permanently — the service is still due.

---

## 9. Failure modes and required behaviour

| # | Failure | Required behaviour |
|---|---|---|
| 1 | Asset has no reading | No invented threshold. "Needs a current reading". Meter tier silent, calendar backstop carries the unit. Row action is "call for a reading", not "create estimate". |
| 2 | Reading implausible (11 hrs / 217k mi) | Discard the meter, fall back to calendar, ask for confirmation. |
| 3 | Asset type missing (7 in 10) | Empty suggestion, manual choice, never blocked, never guessed from VIN. |
| 4 | Reading goes backwards (12,000 typed for 120,000) | Projection rejects non-monotonic points; thresholds are not recomputed from a lower reading. `mileage_reported_at` makes the error visible. Note: `UpdateMileageOnWorkOrderMileageChange` currently overwrites blindly and is **not** forward-only, unlike the maintenance write-back. |
| 5 | Two tiers due together | Supersession within the program; one row, one visit, one estimate, canned lines deduped. |
| 6 | Compliance closing with no bay | The 11-month buffer exists for this. Escalation does not stop. Snooze below a compliance deadline is forbidden. |
| 7 | Work done at another shop | Enter date and reading, reminder resets from there. Recorded as an "external" cycle so history does not claim we did it. (Already built — keep.) |
| 8 | Customer does not answer | Routine: 3 touches then silence, unit stays on the list. Compliance: does not stop. The unit never leaves the list; only sending stops. |
| 9 | Advisor lacks `settingsService` | "Request a program", never a dead end. |

---

## 10. Notification

### 10.1 Recipient matrix

| Event | Shop digest (role) | Escalation | Customer | Call |
|---|---|---|---|---|
| Routine enters lead window | yes | — | only if the program says so | primary action |
| Routine overdue | yes (nag interval) | — | per program | primary action |
| **Compliance certificate inside 60 days** | yes | yes | yes — it is their legal exposure | primary action |
| Compliance expired | yes | yes, daily | yes | immediately |
| Unit has no usable reading | yes | — | not in v1 — asking the customer for a reading is a separate outbound message from the booking offer in §11, and needs the same reply channel SMS needs | optional |
| Estimate created | — | — | advisor's decision, never automatic | — |
| Customer approved via portal | yes | — | — | — |
| Work completed, reminder reset | — | — | — | — |

Two things this matrix says on purpose: **the call is the shop's primary action and email supports it**, and **an estimate is never sent automatically** — the machine reports what is due, a human decides what is offered.

### 10.2 Addressing

Never a named user. `assigned_user_id` stays deleted. The digest goes to a **role** or to the shop's maintenance mailbox — `shopRecipients` already supports several addresses and the customer email already CCs them. The digest must carry **CTAs and customer phone numbers** so an advisor can act from the inbox without opening the app.

### 10.3 Cadence

There is **no established industry standard for an exact day sequence** — the grounded finding is that around three touches per cycle is reasonable and more reads as bulk mail. Two regimes, because the cost of error differs:

- **Routine — at most 3 touches, then silence.** One on entering the lead window, one on the due date, one seven days after. Then the unit stays on the list but stops sending.
- **Compliance — does not stop until resolved.** 60 / 30 / 14 / 7 days, then daily inside 3 days and after expiry. *This is reasoning from consequence, not a cited standard;* a lighter alternative is 60/30/7 then daily only after expiry.

Two hard caps over everything: **at most one email per recipient per day**, and **batched** — all of that recipient's units in one message. This is what solves "600 emails to Bob" mechanically rather than by good intentions.

---

## 11. Customer self-booking (v1, per D14)

Feasible on existing primitives: duration from `CannedLine::timeEstimate` + `techTime`; opening hours from `Organization/Workplaces/BusinessHours`; day and technician load from `schedule-next/capacity`, which already knows "Closed"; tokenised customer action from `CustomerPortal/WorkOrders/AuthorizeController`, in production today.

**Sequence.** Morning digest to the shop first — the advisor always has the first move. If the program says to email the customer, a batched message goes out: *"Unit 402 — CVIP expires 14 Oct, at about 245,000 km. We suggest service in the next 3 weeks."* plus three windows, plus "none of these work, call me", plus the shop's phone. The link opens a tokenised page with no login showing the units, what is due, estimated duration and the windows. A choice creates a work order in `estimate` status, `customer_requested`, **with the program's canned lines already in it** — an empty work order tells the advisor nothing, and the lines are already known; what makes it a request is the flag and the absence of scheduling. The shop gets a real-time signal — the only event in the system that earns one, because a person is waiting. The advisor confirms and the existing flow schedules it.

**Window rules.** Day-level windows only (morning / afternoon), never an exact hour — a shop cannot honour "10:00 sharp" and offering it is a promise that breaks. Skip non-working days. Skip days above an org-settable load threshold (e.g. 85%). **Never offer a day after a compliance deadline.** At most three windows plus "call me". Token valid 7 days, single-use for booking.

**Three risks that belong in the spec rather than being designed around.** Capacity is not an appointment — no appointment object exists; the schedule assigns lines to technicians on days, so this is a *requested date on a work order*. `timeEstimate` is billed time, not bay time — a 2.5-hour job can occupy a bay all day, so duration feeds capacity and is never quoted to the customer. Email consent is unresolved: `optedOut` exists as a field with no UI and no process.

---

## 12. Corrections to the handoff (verified against `cbe5bf0c`)

The Confluence handoff is the right starting document but was written alongside the build. These items are marked BUILT or listed as invariants and do not match the branch.

| # | Claim | Reality |
|---|---|---|
| F1 | Decision 4 BUILT — ordered list of canned lines; invariant *"never re-introduce `linked_canned_line_id`"* | `linked_canned_line_id CHAR(36)` is the only linkage, on both schedule and template. No pivot table. The picker emits one id. **Multi-line is not built** — and under this design it becomes the program tier's ordered list. |
| F2 | Customer email send path NOT built, "no real send infrastructure exists" | **Fully wired.** `sendCustomerEmail()` builds a `TemplatedEmail` via `MailerInterface`, renders `customer-reminder.html.twig`, substitutes eight merge fields, CCs shop recipients, and throttles. The cron is an EventBridge rule in `ecs-scheduled-tasks.tf` firing daily at 06:00 UTC. Opt-in (`customerReminderEnabled` defaults false), but it sends **one email per due reminder** the moment a shop enables it. |
| F3 | Invariant: server-filtered / sorted / paged, never browser-side | `Maintenance.vue` filters the whole loaded collection client-side (customer, status, due window, free text) and builds the customer filter's options from loaded rows. |
| F4 | Four views (Overdue / Due soon / Needs a reading / All active) with server counts | Two tabs (Reminders, Plans) and a single-select six-option "Due window" chip. No counts. No "Needs a reading" view. |
| F5 | Invariant: flat list, group-by defaults to none, asset leads the row | `groupBy` defaults to `'customer'`, rows are customer parents plus flat rows, and Customer precedes Asset in the column order. |
| F6 | "Needs a current reading" specified three times, including as an invariant | The string exists nowhere in `app/src` or `api/src`. No equivalent flag or reading-age field. |
| F7 | "The branch is not on origin" | It is, with draft PR #2786 and a QA environment deployed from it. |
| F8 | Decision 10 — the mi/km selector "is being removed" | Still present, and `distanceUnit` is `#[Assert\NotBlank]` on `CreateTemplateRequest`, so removal is a backend change, not just hiding the select. |
| F9 | — | **New: interval/target ambiguity.** "Interval (Odometer)" sits beside an asset reading 217,649 and invites reading a value like 232,323 as a target. It is an interval: `dueOdometer = baseline.odometer + interval.odometer`, so the threshold becomes 449,972. Fixed by the live threshold preview in flow B step 3. |
| F10 | — | **New: half-empty thresholds save silently.** Enter a last service *date* but leave *odometer at last service* blank, and the handler skips reading the asset's current values (they are only read when no last service is given). `NextDueCalculator` then requires a non-null completion odometer, so the odometer threshold stays `null` — the meter trigger is dead while the row still displays "or 232,323 mi". The existing invariant guards the all-empty case only. |
| F11 | — | **New: `customer_id` holds the wrong entity.** `ms.customer_id` joins the `customer` table, which is **Contacts** (`Customer/Contacts/Domain/Customer.php`; the queue sorts by `last_name`, `first_name`). `MaintenanceApplyTemplateDialog` sends `vehicle.customer_id ?? vehicle.company_id`, so an asset with no preferred contact writes a **company** id into a contact-id column. The backend validates only that it is a UUID, the join returns nothing, and the row reads "no customer record". **This is the root cause of the handoff's "27 of 76 rows point at a customer record that does not exist"** — a modelling defect, not bad data. The dialog's own comment says the other maintenance surfaces do the same. |
| F12 | — | **New: batching setting is inert.** `ReminderGrouping` has four cases, is persisted, and is exposed in the settings API. `getGrouping()` is never read by the cron. |
| F13 | — | **New: nothing is demoable on QA.** The queue requires `overdue OR (upcoming AND in_lead_window = 1)`; a new schedule is `upcoming` with `in_lead_window = 0`, and only the cron flips it. The branch's own e2e helper states there is no shell access to the worker on QA/staging. Reminders and customer email therefore cannot be demonstrated there without a manual trigger. **A "recalculate now" action is needed for QA regardless of the rest of this design.** |

---

## 13. What is deleted, kept, new

**Deleted.** `MaintenanceDueBanner.vue`. The Plans tab under Reports (moves to Settings). The 7-option "What Makes It Due" dropdown. The Miles/Kilometers selector, including its backend `NotBlank`. The "Only this location" toggle. Per-schedule advance warning inputs and per-schedule customer-email toggle. Ad-hoc schedule creation without a program.

**Kept, unchanged or nearly.** The whole `VehicleService/MaintenanceSchedules` bounded context and its DBAL persistence. `ScheduleStatusCalculator`, `NextDueCalculator`, `IntakeDueEvaluator`, `EffectiveTemplateResolver`. The cron, including lead-window computation, pause expiry and throttling. `WorkOrderCompletedSubscriber` and the forward-only vehicle write-back. Activity log and completion cycles. `MaintenanceIntakeSection` in the work-order asset card. Asset and customer panels. The server-side queue query. The email template builder. Most of the 28 endpoints.

**New.** Program and tier schema plus CRUD in Settings (largest single piece). Enrolment. Read-time bundling with the supersession rule (second largest). Usage projection with the fallback ladder. Implausible-reading rejection. `mileage_reported_at` / `engine_hours_reported_at`. The two-zone tab. The digest. The tokenised booking page and `customer_requested` flag. The "request a program" path.

---

## 14. Open questions

1. **Who sees the Maintenance tab** — all roles with work-order view, or a narrower set? Deferred in session; related to handoff decision 3 on permissions, which Sasha owns and has since indicated may be revisited.
2. **Compliance cadence** — 60/30/14/7 then daily, or the lighter 60/30/7 then daily after expiry.
3. **Default usage rates per asset class** for fallback tier 2 — who sets the shipped defaults, and are they per-organization or per-asset-class only.
4. **Duty-cycle multiplier** (§3.4) — in v1 on the enrolment, or deferred. Not decided in session.
5. **"Request a program" in v1** or a message pointing at the administrator. Leaning v1, because an advisor without settings permission is otherwise stuck on a daily step.
6. **Reminder delivery settings are not admin-permission-gated** today. Must be fixed; which permission is the open part.
7. **Email consent process** — `optedOut` exists as a field with no UI and no process.

---

## 15. Implementation sequencing

This design is too large for a single implementation plan. It decomposes into four, in this order, each independently shippable:

1. **QA unblock + corrections.** A "recalculate now" action (F13), the `customer_id` modelling fix (F11), forward-only guard on the work-order mileage path (§9 #4), half-empty threshold guard (F10), and `mileage_reported_at` / `engine_hours_reported_at` (D4). Small, and without the first item nothing else can be reviewed on QA.
2. **Programs and enrolment.** Program/tier schema, Settings CRUD at `administration/maintenance-programs`, the enrolment dialog with live threshold preview, the three enrolment entries, removal of the ad-hoc path and the dead fields. This is the largest piece.
3. **The workbench.** The fifth Work Orders tab with two zones, read-time bundling with supersession and canned-line dedup, usage projection with the fallback ladder, implausible-reading rejection, the badge, banner deletion, and the digest.
4. **Customer booking.** The batched email, the tokenised booking page, window generation, `customer_requested`, and the real-time signal to the shop.

Steps 2 and 3 share the bundling contract, so the read-model shape should be agreed while 2 is being built rather than after.

## 16. Out of scope

ShopCoach / predictive maintenance (not needed — canned lines already carry `timeEstimate`). Telematics ingest (Samsara, Geotab). An automation-rules engine. Bulk CSV import. SMS, including reply-to-book, which needs an inbound channel that does not exist in the application — no Twilio, no SendGrid, no inbound SES parsing. A true appointment object with capacity locking. Internal in-app reminders stay paused: the Mercure path is intact behind an early return, and under this design the digest replaces it rather than reviving it.
