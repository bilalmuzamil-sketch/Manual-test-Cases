# Maintenance Reminders — PRD & Design Handover

**Project** SV-3780 · Maintenance Reminders
**Product** ShopView — shop management software for heavy-duty shops
**Version** 12.0 · 23 September 2026
**Status** Aligned to Confluence spec 833290250 **v12** (23 Sep: chunk one correction, chunk two in full). Chunk one only; the customer email is chunk two. Open items in §12.
**Design canvas** `Maintenance Reminders.dc.html` — index over seven pages, 106 artboards

---

## 0. How to use this document

> **24 Sep:** reminder timing and sending are schedule-level. See `01-admin-schedules.md` § Reminders and sending move to the schedule. Any rule below that puts reminder rows or the email switch on a service is superseded.

> **Work dates at invoice (22 Sep review):** the cycle counts from the date the work was done, proposed as the invoice date and corrected per service at invoice. See `06-work-order.md` § At invoice.

> **Standing rule (v12):** no descriptive subheadings under headings, beside fields or above sections. A rule the user needs goes behind an info icon.

This is the **normative specification**. Where this document and the design canvas disagree, **this document wins** — §13 lists every known divergence and why.

The document is written to be machine-verifiable. Three ID families run through it:

| Prefix | Meaning | Use |
|---|---|---|
| `R-nn` | A rule. Domain logic, calculation, or constraint. | Implement it. Each rule is independently testable. |
| `V-nn` | A verification assertion. | Run through §14 after implementing. Every assertion must pass or be explicitly waived. |
| `OQ-nn` | An open question. Not decided. | Do **not** invent an answer. Build the surrounding surface and leave the seam. |

Every requirement carries a weight:

| Weight | Meaning |
|---|---|
| **P0** | v1 cannot ship without it. A missing P0 is a bug, not a gap. |
| **P1** | v1 should ship with it. Cutting one is a product decision, not an implementation shortcut. |
| **P2** | Wanted, safely deferrable to v1.1. |

And a confidence marker where relevant:

| Marker | Meaning |
|---|---|
| ✅ **Confirmed** | Validated with the shop side (Cody, session 3). Do not redesign. |
| ⚠️ **Provisional** | Designed, not yet validated. Build it, expect a copy or threshold change. |
| 🚫 **Blocked** | Depends on an `OQ`. Build the surface, leave the value configurable. |

### Self-check protocol for an implementing agent

1. Read §1–§4 to load the domain. Do not skip §3 — most implementation errors are vocabulary errors.
   Then read **§6.0** for the navigation map, the status machine, and the recalculation cascade — what leads to what.
2. Implement §5 (the calculation engine) **first and in isolation**, with unit tests derived from the worked examples. Every screen reads from it; nothing else can be right until it is.
3. Implement surfaces in the order given in §6. That order is the user's order, and each surface depends only on those above it.
4. Run §14. Any failing assertion means stop and re-read the cited rule.
5. Anything not in this document and not in the canvas is **out of scope**. §11 lists what was explicitly cut — those must not reappear.

### One standing instruction about copy

Fabijan, on the design in general: *"Claude design puts so much subtext everywhere. We just need to be cautious about that."* No explanatory sentences under headings, under fields, or beside controls. A rule the user needs goes **behind an info icon**; a rule the team needs goes in this document. The canvas was stripped of 44 such lines on 10 September; do not reintroduce them in the build.

---

## 1. What this feature is

A shop that services trucks knows which units are due for preventive maintenance only if someone remembers. This feature makes that a system function: a shop defines its maintenance standards once, enrols assets against them, and the product then tells the shop what is due, tells the customer, and carries the work into a work order.

It replaces nothing that exists except `MaintenanceDueBanner.vue`, which is deleted (see `OQ-07`).

**Four things happen, in this order.**

| # | Step | Actor | Frequency | Produces |
|---|---|---|---|---|
| 1 | Define a **schedule** | Owner / admin, settings permission | Once at setup, then rarely | A schedule available org-wide. No asset affected yet. |
| 2 | **Enrol** an asset on it | Service advisor | Whenever an asset is in the shop | One tracked service row per service on the schedule |
| 3 | Due dates are **computed** | System | On every reading, and daily | Statuses, dates, and the worklist |
| 4 | The work gets **sold** | Service advisor | Daily | A contact, an estimate, a work order |

**This is an org-level feature.** ✅ Confirmed, P0. A unit can have its safety inspection done at a shop on the other side of the country and come back. Nothing in the data model, the UI, or the queries may assume one location owns an asset. Location appears only as a recorded fact ("completed at Shop 9919"), never as a filter that hides an asset from its own history. → `R-41`

---

## 2. Scope

### In scope for v1

- Maintenance schedules: create, edit, archive, seed from starter templates
- Services on a schedule: routine and compliance, intervals, canned lines
- Compliance records on an asset: type, term, effective/expiry, artefact number, attachment
- Enrolment of an asset onto a schedule
- Reading entry, validation, recalculation, and undo
- The asset Maintenance tab
- The Maintenance reminders worklist under Customers
- The maintenance panel on a work order, and adding a service to it
- Mark complete, snooze
- One consolidated reminder email per customer, automatic and manual

### Deferred to a second chunk, one week behind the rest

**The customer email.** P1. The design is settled (§9) but four operational questions gate it — see `OQ-01`…`OQ-04`. Ship the rest of the feature without it; the worklist and the manual contact card carry the shop until it lands.

### Out of scope — must not appear in the UI

| ID | Cut | Why |
|---|---|---|
| `OOS-01` | Internal weekly/daily digest email to shop staff | Needs groups, notification preferences, and a from/reply-to decision. That is a feature, not a message. |
| `OOS-02` | Welcome email when an asset is enrolled | Scaled down |
| `OOS-03` | Customer self-booking from the email, and rescheduling emails | Scaled down |
| `OOS-04` | Campaign-style email tooling, recipient lists, wording editor, blast-radius previews | The email has one fixed wording, the same for every shop |
| `OOS-05` | Anything depending on mass-email capability | We do not have it. Sending is on behalf of a user only. |
| `OOS-06` | Bulk enrolment from the schedule side | Needs cross-customer asset search, which does not exist. Enrolment is per asset, from the asset. → `R-20` |
| `OOS-07` | One estimate spanning several assets | Removed session 3. Estimate creation is per row. |
| `OOS-08` | Delivery reporting — bounces, open rates | Not tracked, deliberately not reported |
| `OOS-09` | Conflict/overlap resolution screens at enrolment | Deleted session 2. Enrolment does not negotiate with other schedules. |
| `OOS-13` | **Dormant units** — the quiet line, the review flow, the bulk unenrol by customer | Cut entirely 16 Sep. It hid a significant action at the bottom of a list. |
| `OOS-14` | **The Reminder settings screen and its wording editor** | One hardcoded email leaves nothing to word. |
| `OOS-15` | **An unsubscribe link in the email** | Honouring one properly is consent management, its own feature. |
| `OOS-16` | **An expected running rate at enrolment**, and the running-type control | Tested against production and dropped. |
| `OOS-17` | **The customer records page** | Out for now. Only the consent switch is drawn. |
| `OOS-18` | **The canned-lines empty state in settings** | Canned lines cannot be created from there, so the shop is never asked. |
| `OOS-19` | **Any inference that a work-order line satisfies a service** | The advisor states it. The system does not read line text. |
| `OOS-20` | **A `Compliance` tag on a data row** | The service name plus its due date already identify it. |

---

## 3. Vocabulary — normative

Copy is final. Implement it verbatim. Getting a word wrong here is a defect, because these words appear in the UI, in the emails, and in the shop's own speech.

| Use | Never | Note |
|---|---|---|
| **schedule** | program, plan, campaign | The object an asset is enrolled on |
| **template** | starter template as two concepts | One word. A schedule can be seeded from a template. |
| **service** | item, task, job | One entry on a schedule's list |
| **enrol / enrolled / enrolment** | apply, applied, assign | UK spelling of the noun and participle; the **button** reads `Enroll` (US), matching product convention elsewhere |
| **select** | tick, check | For choosing an option |
| **reading** | meter value, mileage entry | A mileage or engine-hours value with a date |
| **recorded** vs **estimated** | actual vs projected | A reading's own state. ✅ Confirmed. **Reserved for readings** — never used for confidence. |
| **Low · Medium · High** | good, poor, unknown | The three confidence levels, grading the meter (`R-27`) |
| **No data** | None, unknown, N/A | A separate state, not a fourth level: nothing to estimate from |
| **compliance** | regulated, mandatory, safety | ✅ Settled by Fabijan: *"I'll call it compliance. This is a compliance inspection."* Supersedes Cody's *mandatory* and *safety*. `Compliance record`, the `Compliance` tag, `Is this a compliance inspection?`. The artefact is still a certificate. |
| **Start reminders** | work list lead time | The compliance inspection lead-time control |
| **Open** | No work order, None, — | The work-order column before one exists: a service is due and nothing has been raised |
| **Not enough data** | unknown, N/A, 0 | An asset with too few readings to project from |
| **Not priced** | $0.00 | A canned line with no rate or part price |
| **Soon** | a date | In the customer email, where confidence is low |

**Asset naming.** P0. Everywhere in the product an asset is named `unit number · year make model` — `402 · 2019 Freightliner Cascadia`. No "Unit" or "Asset" prefix. Where there is no unit number, the make and model stand alone with `No unit number` as the secondary line. `OQ-06` covers whether the same pattern is right in the customer email.

**Units.** P0. **The distance unit is the word `mileage`, written in full, everywhere.** `mi` and `km` never appear. One unit covers both, so an abbreviation would claim one of them.

| Where | Reads |
|---|---|
| A value | `342,417 mileage`, `≈ 346,050 mileage` |
| A trigger row | `every` · `15,000` · `mileage` |
| A rate | `640 a week` — **a rate never names a unit.** `mileage` describes a unit&rsquo;s history, not a speculative rate |
| A provenance line | `based on mileage` |
| The field label | `Mileage` — never `Odometer` |
| Inside a section titled `Mileage` | the value does not repeat the word |

Engine hours keep `hrs`; `OQ-17` asks whether they should follow. Months keep `months`. Never `miles` or `kilometres` spelled out, and never a unit picker.

**No em dashes in prose.** House style. Use a full stop, a colon, or a comma. The `·` middot separates label fragments.

---

## 4. Domain model

```
Schedule       { id, orgId, name, seededFromTemplate?,
                 triggers: { calendar: true, distance: bool, hours: bool },
                 services: Service[], emailEnabled: bool,
                 reminderSchedule: ReminderSchedule,
                 archived: bool, enrolledAssetCount }
                 // NO distanceUnit — there is no unit choice. §3 Units.

Service        { id, scheduleId, order, name,   // ONE name. R-05.
                 kind: 'routine' | 'compliance',
                 // routine only — operator on all three rows, R-09:
                 intervals: {
                   calendar?: { operator: 'every'|'at',
                                months?: 1..12,       // when operator = every
                                month?: 1..12 },      // when operator = at
                   distance?: { operator, value },
                   hours?:    { operator, value } },
                 // compliance only:
                 complianceTypeId?: ComplianceTypeId,   // R-13
                 termMonths?: int,                    // R-14
                 startRemindersMonths?: 1..4,         // R-15
                 cannedLines: LineRef[] }

ComplianceType  { id, orgId?,          // orgId set = added by that shop, R-13
                 name, jurisdictionLabel?, defaultTermMonths,
                 artefactLabel }      // seeds in R-13.1; fallback in OQ-18

ComplianceRecord { id, assetId, complianceTypeId, termMonths,
                 effectiveDate, expiryMonth, expiryYear,
                 artefactNumber?, attachment? }       // R-16, R-19

Enrolment      { id, assetId, scheduleId, enrolledAt, enrolledBy,
                 serviceStates: ServiceState[] }

ServiceState   { serviceId, lastCompletedAt?, lastCompletedReadings?,
                 lastCompletedWhere?, snoozedUntil?,
                 // all derived, never stored: → R-30
                 dueDate, dueReading?, decidingTrigger, status,
                 confidence }

Reading        { id, assetId, meter: 'odometer' | 'hours', value, unit,
                 takenAt, enteredBy, enteredAt, sourceWorkOrderId?,
                 correctedBy?, correctsReadingId? }   // R-25

AuditEntry     { id, entityType, entityId, action, actorId, at, payload }
```

**Invariants.** P0.

- `R-01` A schedule always has `calendar: true`. Calendar cannot be switched off. ✅ Confirmed — distance and engine-hour data cannot be trusted even with a telematics integration, so time is always the fallback. → `V-01`
- `R-02` A compliance inspection has no intervals and never participates in the routine ladder. It absorbs nothing and is absorbed by nothing. It has no ladder position and cannot be reordered.
- `R-03` A compliance inspection **cannot be snoozed.** The action is not rendered, not disabled-with-reason — absent. A deadline set by an agency is exactly the thing that cannot be deferred. → `V-11`
- `R-04` A schedule edit never reaches assets already enrolled. Editing intervals changes what future enrolments get; existing tracked services keep the intervals they were given. See `OQ-08` for the law-change case.

---

## 5. The calculation engine

**Implement this first, in isolation, with tests.** Every surface renders from it. The worked examples below are the test fixtures.

### 5.1 Service definition

- `R-05` ⛔ **WITHDRAWN 10 Sep 2026. There is no customer-facing name.** A service has **one name**, used everywhere. Fabijan's objection is operational: two names for one thing means the customer phones and says *"you did an oil service"* while the shop has to work out that this is a PM-A. *"If they wanted that, they would call it PM-A hyphen oil service or something. I would delete it."* A shop that wants a customer-legible name types one as **the** name. Do not reinstate the field. → `V-02`
- `R-06` A service's **triggers are a subset of its schedule's triggers.** The form renders one interval row per trigger the schedule watches. A blank interval means that trigger does not apply to that service.
- `R-07` **Whichever comes first.** Where a service carries more than one interval, the due point is the **earliest** of the resolved dates. The UI states this once, in one grey line: *"Comes due at whichever trigger arrives first."* No amber panel.
- `R-08` ⛔ **REVISED v12 — the calendar interval carries a unit: `days` or `months`.** P0. `every` takes a whole number and a unit, so *every 30 days from the last completion* is expressible (done 15 Sep → due 15 Oct → 15 Nov). **`at` stays month-based:** it keeps its month picker whatever the unit control shows, because a fixed calendar point in days is not a thing anyone sets. The one-line service row renders either unit (`15,000 mileage or 30 days`) without wrapping. With `months` the number dropdown offers **1 to 12**; with `days` it is a whole-number field. The next due date is anchored on completion by the system; the form carries no date picker or preview. → `V-03`
- `R-09` ⛔ **The `every | at` operator sits on ALL THREE interval rows, calendar included.** P0. Revised 10 Sep 2026, superseding "calendar has no operator".

  | Row | `every` | `at` |
  |---|---|---|
  | Mileage | `every 15,000` — recurring from the last completion | `at 150,000` — a fixed point on the meter, fires once |
  | Engine hours | `every 500` | `at 10,000` |
  | Calendar | `every 12` months — recurring, rebases on completion | `at` **January** — a fixed month that never moves |

  The calendar case is why this changed. A customer wants the inspection done **every January**. If they bring the unit in during February, next year's is still January. `every 12 months` rebases off the last completion and would silently drift the schedule a month later every time the customer is late.

  **When `at` is selected on the calendar row the value control changes from a months picker to a month picker.** The distinction that must read from the screen: `every` moves with the work, `at` does not. → `V-36`
- `R-10` **There is one distance unit, the word `mileage`.** P0. No unit picker, no per-schedule unit, no conversion, no abbreviation. → `V-04`
- `R-11` **Templates pre-fill industry-standard values and everything stays editable.** e.g. `15,000 mi` / `every 3 months`. A template is a starting point, never a preset.
- `R-12` There is **no "start from template" control inside the service form.** P0. Template choice happens in the schedule-creation step only. → `V-05`

### 5.2 Compliance inspections

- `R-13` ⛔ **Type is a TYPE-AHEAD, not a closed dropdown.** P0. Revised 10 Sep 2026. Fabijan expects **more than a hundred** types: *"every state is going to have it be named different, and every province is named different."*
  - Typing filters the list of known types.
  - A handful of **generic** types ship by default.
  - No match offers **`+ Add "<what they typed>"`**, which saves it **for that shop** from then on. Same pattern as adding a vendor inline in Simple Flow.
  - The jurisdiction, where a type has one, is **secondary text on the option row** — never appended to the name, and never the term either, or the list stops being scannable.
  - **Do not ship the jurisdictional names as fixed options.** The seeded set must read as examples to start from, not as the complete world.
  → `V-06b`

  `R-13.1` **What ships by default** — generic, five of them, examples only:

  `Annual inspection` · `Safety inspection` · `Emissions test` · `Brake inspection` · `Trailer inspection`

  Every real jurisdictional name (CVIP, Ontario Annual Safety Inspection, SAAQ Mechanical Inspection, PMVI, Federal Annual Inspection) is something a shop **adds**, and is then available to that shop only.

  `R-13.2` **Why the field exists at all**, since Fabijan pushed on it: **reporting.** *"If we're going to put a field in, let's make sure that there's a reason for it."* The answer is being able to count how many of each compliance inspection a shop performed. Worth remembering if the field ever starts to look like decoration.

  California's CARB Clean Truck Check was cut on 9 September 2026; it was the only artefact-less type, which is why `R-17` can be absolute.

- `R-14` **The type suggests the term; it never fixes it.** P0. Selecting a type pre-fills `termMonths` from `defaultTermMonths` and leaves the field editable. There is no locked or read-only term state. A bus CVIP runs 6 months where a tractor runs 12, and a certificate issued elsewhere may say something else again. → `V-06`
- `R-15` **`Start reminders` derives from the term.** P0. Not a constant 1 month. Editable, **months only, 1 to 4**. Default: 1 month for a 12-month term, 1 month for a 6-month term (8% and 17% of the cycle respectively — the floor is a month either way). → `V-07`
- `R-16` **Compliance inspection due date.** 🚫 Blocked on `OQ-09`. The design assumes **the last day of the expiry month**. Implement the rule behind a single function so it can change. A compliance inspection with no record on the asset **cannot come due**: the row reads `No record` with an `Add record` action, and it is excluded from every count and total.
- `R-17` **The artefact number field is labelled by the type** — `Certificate number`, `Sticker number`, `Decal number`, `Report number` — from `ComplianceType.artefactLabel`. It is **optional but always present**. There is no state in which it disappears: every type produces a document. A type the shop added has no label of its own and falls back to `Certificate number` (`OQ-18`). → `V-08`
- `R-18` **One optional attachment per compliance record**, reusing the existing DVI attachment component. A US Federal Annual Inspection has to be carried on the vehicle, so scanning it in is real workflow. Replacing the file replaces the record's only attachment.
- `R-19` **One compliance record form, three entry points.** P0. The `Add history record` action on the enrolment modal's record row, the same action on the asset's compliance service, and `+ Add certificate` on the work order all open the **same** form with the same fields. Not three forms.
  - `R-19.1` **Certificate start date is not on the service form.** Removed 10 Sep 2026. It is a property of one truck, not of the shop's policy: *"you can't put that on the inspection creation form."* It lives on the record modal, and the enrolment modal's record row.
  - `R-19.2` **Field widths follow one scale** — half or full, nothing in between. Three different dropdown sizes in one column gives the eye nothing to follow.
  - `R-19.3` Where a record **already exists**, show the record and an **edit** affordance. Not an add button.
  → `V-09`

### 5.3 Enrolment

- `R-20` ⛔ **The enrolment modal is lighter. Revised 16 Sep 2026.** P0. It collects, in this order:

  1. the **schedule**
  2. the customer's **notification consent**, shown with its current value and marked as belonging to the customer (`R-70`) — **display only**
  3. **one optional last-service date per service**

  **Removed from it:** both current-reading fields, the live `Comes due` column, and the expected-running-rate control.
  - **Readings** are carried by the asset header and the work order already. Collecting them here raises the question of whether that counts as a new recorded reading, and it should not arise.
  - **`Comes due`** is not needed while filling the form; the asset page resolves it immediately afterwards.
  - **The running rate** belonged to an idea that was tested against production and dropped (`R-27.1`).

  `[x1]` populated · `[x1r]` a unit with no readings. → `V-10`

- `R-21` **One last-service date per service, not one for the asset.** P0. Brakes done last week and an oil service long overdue cannot be described by a single date.
- `R-22` A blank last-service date means **counting starts today**.
- `R-23` ⭐ **NEW — `Not enough data` per meter.** P0. Where a service watches a meter the asset has no reading for, its row in the modal carries a **`Not enough data` badge, per meter** — mileage and engine hours separately, so one badge never speaks for the other. Reuses the existing badge. `[x1r]` → `V-59`
- `R-24` A compliance inspection in the modal shows its record's number and expiry with an **standard edit icon**, or **`Add history record`** opening the `R-19` form. **The term is always known**, so the row never reads `No record` where a date belongs (`R-16.1`).
- `R-24.1` ⭐ **NEW — bulk enrol.** P1. Reached from **a customer's own asset list**. It is **a selection of which units go on which schedule**, not an enrol-the-whole-fleet action, because a fleet holds different kinds of unit. One schedule per pass; units already on another schedule are shown and not selectable; last-service dates are set per unit afterwards. `[x4]` → `V-60`

### 5.4 Readings, rate, and confidence

- `R-25` **A reading is a fact with a timestamp and an author.** Recording one **re-evaluates every dependent threshold immediately**, not on an overnight run — the one moment the truck is physically present is now.
- `R-26` **Rate estimation.** Take the two most recent recorded readings for that meter, derive a rate from the delta in value over the delta in days, and carry the most recent reading forward at that rate. A new recorded reading **replaces** the estimate outright.
- `R-27` ⛔ **Confidence is three levels. Revised 16 Sep 2026.** P0.

  | Level | Colour | Meaning |
  |---|---|---|
  | `Low` | orange | a measured rate that is thin or stale |
  | `Medium` | blue | a measured rate, middling in visits or recency |
  | `High` | green | a measured rate from several recent visits |

  They grade **the meter**. They are **deliberately not** the words used for a reading's own state: `recorded` and `estimated` stay reserved for readings.

  **`No data` is not a fourth level.** It is a **separate state**, for a unit with nothing to estimate from: **the calendar governs**, no date is offered for the meter, and the row says the meter has no basis yet. **Draw it** — it is the ordinary case, not an error. `[p1]` draws all three levels plus `No data` and the recorded case, which carries **no grade at all** (a fact needs no grading).

  **Engine hours get the same treatment as mileage.**

  `None` as a confidence label is **withdrawn**, along with the four-level scheme from v6.

- `R-27.1` ⛔ **The enrolment running rate is withdrawn.** The expected-running-rate control, its four running types and their prefills are **removed from the enrolment modal** (see `R-20`). It was tested against production and dropped. Nothing borrows or invents a rate: a unit with no usable reading pair reads `No data` and runs on the calendar.

- `R-27.2` **Precision.** P0. **An exact date belongs to a recorded reading alone. Everything computed shows a month.** A projected due date reads `Sep 2026`, never `15 Sep 2026`, so the design never claims a day it cannot support. A snoozed date is user-set and stays exact. → `V-58`

- `R-28` **Every projected value names the rule that produced it, and its source.** P0. Revised 15 Sep 2026 — the line gains a **third string** naming where the rate came from.

  ```
  ≈ 346,050 mileage · measured from 4 visits · last read 6 days ago
  ```

  Due lines keep their rule: `based on mileage estimate`, `based on engine hours estimate`, `based on the certificate term`, `based on the calendar`. ⛔ **v12: an overdue row never prints a figure** — no `overdue by 1,400 mileage`, no `one cycle missed`. With no telematics the number is an estimate printed as a fact. The reader looks up to the meter card for the estimate and its confidence; confidence is **not** repeated per row or moved into the column header.

  **No new state and no new chip.** Origin goes in the line. → `V-12`, `V-49`
- `R-29` Where two triggers apply, the recalculation summary **shows both**, since whichever comes first wins. ✅ Confirmed.

**Worked example — fixture A.** Asset `402`. Mileage recorded `342,417 mileage` on 29 Aug 2026 (WO S3780-15211), previous recorded reading giving a rate of `640 a week`. Today is 9 Sep 2026.
- Estimate today: `≈ 346,050 mileage · measured from 4 visits`, `High` confidence.
- `PM-A`, `every 15,000`, last completed 18 Jun 2026: due at `346,000 mileage` → `Sep 2026`, `based on mileage`.
- Enter `346,900` and save: the maintenance tab re-renders with the rate at `710 a week` and `PM-A` badged `Due today`. The modal itself shows none of this (`R-34`).

### 5.5 Reading validation — soft, never blocking

**The largest correction from the shop side. P0 ✅ Confirmed.**

- `R-30` ⛔ **Removed from v1 scope. Revised 16 Sep 2026.** The implausible-value screen, the lower-reading screen and the `Cannot be judged` state are **out of the design for now** (boards `[w10]` `[w11]` `[w5]` `[w5x]` deleted). The underlying position stands — **nothing about a meter value is refused** — but the screens that dramatised it are cut until the validation behaviour is specified. `R-31` and `R-32` are withdrawn with them.
- `R-33` **Undo.** P0. A short toast-style undo immediately after saving, plus a way to correct a reading entered by mistake afterwards. A correction is a new `Reading` carrying `correctsReadingId`; the original is retained, not overwritten. → `V-16`
- `R-33.1` ⭐ **NEW — two things record a reading.** P0. **A user changing the mileage on a work order, and the work order being invoiced.** Whatever the mileage reads at the moment of invoice becomes the new **last recorded reading**. Until the invoice exists the value shows as entered, dated today, marked **`In the shop`**. `[p3]` draws the before and after, including what moves. → `V-61`
- `R-34` ⛔ **REVISED v12.** Two columns, `CURRENT` and `NEW`, top-aligned at equal height. **The `WHAT THIS CHANGES` panel is removed**: live computation, hard wording, and a forecast in front of someone who came to type one number. Enter, save, land on the maintenance tab, which shows every consequence. No unit word beside either value (the field is labelled). Under the current value: `Last recorded 29 Aug 2026 · WO S3780-15211`, the work order **not a link**; a long work order number truncates, the date never does, and the modal never widens. Button stays `Enter a reading` (`OQ` open: `Enter mileage` may be too narrow since it captures engine hours).
- `R-35` **One modal, both entry points.** The reading modal opened from the asset and the one opened from the work order are the same component with the same behaviour. Not a separate design. → `V-17`

### 5.6 Status

- `R-36` ⛔ **REVISED v12. Asset-level status is one of exactly three: `Overdue` · `Due today` · `Due soon`.** P0. `Upcoming` is gone; every state reads as a form of *due*. Rendered as a **badge beside the service name**, not a status column, so it never reads as part of the work-order status family. `Active` and `Paused` stay removed. → `V-18`
- `R-36.1` ⭐ **NEW v12 — month-precision due dates show a month.** Compliance and anything term-based prints `Oct 2026`, never a day. `Due today` holds for every day of that month.
- `R-37` **`Due soon` begins at the first reminder**, e.g. 14 days before due — not at enrolment. Before that point a service has a due date but no status badge.
- `R-38` **A missed service appears once**, however many cycles have passed. Not one row per skipped cycle.
- `R-39` **Snooze moves the due date and nothing else.** P0. It is not a status, no reason is recorded, and the service keeps its interval and its history. Like putting off an alarm. → `V-19`
- `R-40` ⛔ **Revised 15 Sep 2026 — the empty state reads `Open`.** P0. Nothing new is invented: once a work order exists the row shows **that work order's own status**. Before one exists the row reads **`Open`**, meaning a service is due and nothing has been raised for it. The earlier `No work order` wording is withdrawn. → `V-20`

### 5.7 Completion

- `R-41` **Mark complete offers two branches.** P0.
  1. **On a work order** — a dropdown or search over work orders **from any location** (`R-01` org-level). The completion date and the readings come from the work order.
  2. **Completed elsewhere** — asks for the date and a location, and keeps the shop that did it. Readings are **optional** here: nobody remembers the engine hours from two weeks ago. Left empty, the next due point is measured from the date alone.
- `R-42` ⛔ **Completion resets on two different dates. Revised 15 Sep 2026.** P0.

  | Branch | Resets from | Row reads until then |
  |---|---|---|
  | On a work order | that work order's **invoice date** | keeps its old due point, with no distinct status |
  | Completed elsewhere | the **date entered**, immediately | — |

  A work order can be completed days before it is invoiced, and the invoice date is what the rest of the application treats as the transaction. **There is no `Awaiting invoice` status** — removed 16 Sep 2026; the row simply keeps its old due point. → `V-50`
- `R-42.1` ⭐ **NEW — bundling.** P0. `[w3]` drew supersession; this is the rule behind it.
  - Candidates inside a **bundling window** collapse into **one event**, dated on the **earlier** of the two, **showing both reasons**.
  - Bundling groups **by unit, not by schedule** — a truck arrives once.
  - **Within one schedule** the highest due service **absorbs every lower one.**
  - **Across schedules there is no absorption.**
  - **A compliance inspection is never absorbed** (`R-02`).
  - ⚠ The window's length is not set — see `OQ-21`.
  → `V-51`

- `R-43` **Adding a service to a work order writes to the work-order notes and the audit log**, so it can be traced back to the schedule it came from. P0 ✅ Confirmed. This is required regardless of how `OQ-11` resolves. → `V-21`

---

## 6. Surfaces

Build in this order. Canvas board IDs are given as `[id]` — search the `.dc.html` for `id="…"`.

### 6.0 Navigation map — what leads to what

Three entry points reach this feature. Nothing else does.

| Entry | Path | Who | Leads to |
|---|---|---|---|
| **Settings** | Settings › Service › Maintenance | Owner/admin with settings permission | §6.1 schedules list |
| **Customers** | Customers › Maintenance reminders *(tab)* | Service advisor | §6.9 worklist |
| **Asset** | Asset › Maintenance *(tab)* | Service advisor | §6.8 asset panel |

Plus one in-context surface with no navigation of its own: the **maintenance panel on a work order** (§6.10), which appears inside a work order the advisor is already in.

#### The screen graph

`──▶` navigates (a page). `··▶` opens a modal over the current page. `◀··` returns to it.

```
SETTINGS BRANCH — defining the standard
  Settings › Service › Maintenance  [s2b empty | s2 populated]
    ├──▶ New schedule             [s2new blank | p11 from a template]
    │      └──▶ Schedule editor   [s3new | s3skel seeded]
    ├──▶ Schedule editor          [s3 · s3one · t1-t5 · k03]
    │      ├·· + Add service      [c0]  ──▶ Service form  [c1 · c2b · c2 · c2all · p13]
    │      │                                  └·· Compliance block  [c4 · k02 · k04]
    │      │                                  └·· Canned lines     [d1 · d3 · d4]
    │      ├·· Edit service       [c3]
    │      ├·· Remove service     [s3rm]        ◀·· never touches enrolled assets  (R-04)
    │      └── drag handle reorders rows        (no menu item)
    ├·· Row menu                  [s2menu]  Edit · Duplicate · Archive   (no Delete)
    └·· Archive                   [s2arch]  Cancel / Archive
  Settings › Service › Reminders   [r1 · r2 · r1e · r3p]     read-only, no builder

ASSET BRANCH — enrolling and tracking
  Asset › Maintenance             [s4]
    ├·· Enroll in a schedule      [x1]   ──▶ back to [s4] with tracked rows
    │      └·· + Add record       [k4]   ◀·· returns into [x1], row now filled
    ├·· Enter a reading           [n5]   ──▶ recalculates, returns to [s4]   (R-25)
    ├·· Row menu                  [m1]
    │      ├·· Mark complete      [m2 on a work order | m2e elsewhere]       (R-41)
    │      ├·· Snooze             [m5]   routine only, absent on compliance   (R-03)
    │      └──▶ Create estimate          leaves the feature, into an estimate
    └── Schedule header menu             Pause · Remove
    └·· + Add record / Edit       [k4]   one form, three entry points        (R-19)

WORKLIST BRANCH — selling the work
  Customers › Maintenance reminders  [s1]
    ├── Tiles filter in place     [s1d]  click again clears · multi-select   (R-46)
    ├── Column header sorts              not a badge, not a tile control     (R-47)
    ├·· Contact                   [b1 · b1r · b1e · b1p]
    │      └·· Send reminder      [b4]   sends the state's own email         (§6.9)
    ├──▶ Work Order link                 the WO itself, not a button         (R-49)
    ├·· Row menu                  [b3]   Mark complete · Snooze · Create estimate · Open asset
    └──▶ Maintenance schedules           crosses to the settings branch

WORK ORDER BRANCH — carrying it into the job
  Work order › Maintenance schedule card  [w7c collapsed]
    ├── expand                    [wo1 · y0 · w2x · w3 · w4 · w5 · w6 · w7]
    ├── hover a service           [y1h]  description · parts · inspection form  (R-50)
    ├·· + Add                     [y1a]  ──▶ [w2b] lines on the WO + note + audit  (R-43)
    │      └── or Create a new work order instead                            (R-52)
    ├·· + Add certificate         [k4]   compliance row with no record
    ├·· Enter a reading           [w8]   same component as [n5]              (R-35)
    └── without permission        [w2p]  action muted, reason available      (R-56)
```

#### What each modal produces

| Modal | Board | On confirm | Where it returns |
|---|---|---|---|
| Enroll in a schedule | `[x1]` | One `ServiceState` per service on the schedule | Asset › Maintenance, rows present |
| Add/Edit record | `[k4]` | A `ComplianceRecord`; the compliance row can now come due | Whichever of the three entry points opened it |
| Enter a reading | `[n5]` `[w8]` | A `Reading`; **every** dependent threshold recalculates at once | Same page, values moved, undo toast up |
| Mark complete | `[m2]` `[m2e]` | `lastCompletedAt` + readings; interval resets from that point | Asset › Maintenance, row re-dated |
| Snooze | `[m5]` | `dueDate` moves. Nothing else. | Same list |
| Add service to WO | `[y1a]` | Lines on the work order + a WO note + an audit entry | The work order |
| Archive schedule | `[s2arch]` | `archived: true`; enrolment stops, history and due points keep | Schedules list |

#### ServiceState — the status machine

Status is **derived on read, never stored** (`R-30` on the model, `R-36` on the values).

```
                    ┌──────────── no badge ────────────┐
   enrolled ───────▶│ due date exists, first reminder   │
                    │ not yet reached          (R-37)   │
                    └───────────────┬──────────────────┘
                                    │ reaches first reminder
                                    ▼
                              ╔═══════════╗
                              ║ Due soon  ║
                              ╚═════╤═════╝
                                    │ due date arrives
                                    ▼
                              ╔═══════════╗
                              ║ Due today ║
                              ╚═════╤═════╝
                                    │ due date passes
                                    ▼
                              ╔═══════════╗
                              ║  Overdue  ║   one row however many
                              ╚═════╤═════╝   cycles pass       (R-38)
                                    │
          Mark complete  ───────────┤────────── Snooze
          resets the interval,      │           moves dueDate only,
          restarts from that        │           no status, no reason
          point          (R-42)     │                        (R-39)
                                    ▼
                         back to no badge / Due soon
```

There is no `Active` and no `Paused`. A schedule-level `Pause` exists on the schedule header menu; what it renders on the row is `OQ-16`.

#### The recalculation cascade

One reading fans out. This is why §5 is built first and in isolation.

```
  a Reading is saved                                           (R-25)
        │
        ├─▶ rate recomputed from the two most recent readings   (R-26)
        ├─▶ confidence re-evaluated for that meter              (R-27)
        └─▶ for every ServiceState measured from that meter:
                dueReading / dueDate re-resolved
                    │
                    ├─ more than one interval? earliest wins    (R-07)
                    ├─ status re-derived                        (R-36)
                    └─ provenance line re-rendered              (R-28)
                          │
                          ▼
        ┌─────────────────┴─────────────────┬────────────────────┐
        ▼                                   ▼                    ▼
  Asset › Maintenance               Worklist + tiles      Work order panel
  header readings move              counts and totals     count, "due today ·
  [s4]                              re-bucket  [s1]       odometer updated" [w2x]
```

Nothing in that cascade waits for an overnight job. The one moment the truck is physically present is now. The daily job (`OQ-03`) only queues the email chunk.

#### Reading entry — the validation path

No branch of this ends in a refusal (`R-30`).

```
  value entered
      │
      ├─ implausible for the asset?  ─▶ orange warning, Save stays live   (R-31)
      │                                 "11 hours with 316,000 mi. Are you sure?"
      ├─ lower than the last one?    ─▶ flagged, saved, both kept         (R-32)
      └─ ordinary                    ─▶ saved
                                        │
                                        ▼
                              save, land on Maintenance tab
                              which shows what moved       (R-34)
                                        │
                                        ▼
                              saved ─▶ undo toast ─▶ later correction
                                        as a new Reading carrying
                                        correctsReadingId          (R-33)
```

### 6.1 Settings › Service › Maintenance — schedules list · P0

`[s2b]` empty · `[s2]` populated · `[s2menu]` row menu · `[s2arch]` archive

- Tabs: `Schedules`, `Reminders`. Primary action `New schedule`.
- Empty state: a heading, one sentence, one action. No illustration.
- Row menu: `Edit`, `Duplicate`, divider, `Archive`. **No Delete** — a schedule with history can only be emptied and left archived. No `Apply to assets` (`OOS-06`).
- Archive confirm: **one sentence, one action pair** (`Cancel` / `Archive`). Copy: *"Archiving keeps every asset's current due points and history, and stops new enrolment."*

### 6.2 Schedule creation and the template picker · P0

`[s2new]` start blank · `[p11]` from a template · `[s3skel]` seeded editor

- `R-44` **The starter template set is four deliberately basic templates.** ⚠️ See `OQ-12` — the brief says "five" and lists four.

  | Template | Shape |
  |---|---|
  | Annual inspection — truck | Compliance, 12-month term |
  | Annual inspection — trailer | Compliance, 12-month term |
  | Service inspection | The PM inspection. Routine. |
  | 300-hour service | Routine, engine hours. For equipment customers. |

  The previous `PM-A / PM-B / PM-C / PM-D / CVIP` set is **removed**: too many, too specific. Do **not** model regional variants (Ontario vs US) in the starter set.

### 6.3 Schedule editor · P0

`[s3new]` empty · `[s3one]` one service · `[s3]` in use, 42 assets · `[t1]`–`[t5]` trigger variants · `[k03]` with a compliance row

- No wizard, no numbered steps, no Name step. The title carries an inline pencil for renaming. No schedule-level Save/Cancel.
- **Triggers.** Calendar is first and required, with no checkbox (`R-01`). Distance and Engine hours sit below as optional selections, each with its own one-line description. A single grey line resolves the combination (`R-07`).
- **Services** sit in an unnumbered section. Rows are drag-reorderable **by a handle on the row**, not by a menu item.
- `+ Add service` opens a separate modal offering the template services plus blank (`R-12` — no template control inside the form).

### 6.4 Service form · P0

`[c0]` add · `[c1]` empty · `[c2b]` distance · `[c2]` distance + calendar · `[c2all]` all three · `[c3]` edit · `[p13]` template service · `[c4]`, `[k02]`, `[k04]` compliance

Fields, in order: `Name` · `Customer-facing name` (`R-05`) · one interval row per trigger (`R-06`, `R-08`, `R-09`, `R-10`) · `Canned lines` · compliance branch (`R-13`–`R-18`).

- The compliance branch replaces intervals with `Type`, `Term`, `Effective date`, `Expiry date` (calendar picker, same as effective date; for a month-long certificate pick the last day of that month), the type-labelled number, and the attachment. Plus `Start reminders` (`R-15`).
- `Term` carries its explanation as a **tooltip on the label**, not as text under the field.
- Field pairs top-align; hints hang under their own field.

### 6.5 Canned lines · P1

`[d1]` picker · `[d3]` shop with none · `[d4]` read-only

- Empty state is compact: one line, one action.
- The picker has **no count, no disabled rows, no drag, no row icons**, and supports long lists.
- `Not priced`, never `$0.00`. A line deleted from the library reads `Not counted` at `0.0` hrs.
- `R-45` **A maintenance service is not a line-search result.** P0. Line search returns canned lines only. Adding a service happens from the work order's Maintenance schedule card, never from line search. `[v4]` → `V-22`

### 6.6 Compliance records on the asset · P0

`[k6]` type list · `[k7]` term and lead time · `[k8]` number field variants · `[k9]` attachment states · `[k4]` the form · `[cert1]` list · `[cert2]` empty · `[k2]` service with no record · `[k3]`, `[k3e]` monthly cohort

⛔ **v12: the Certificates tab is descoped.** The asset already carries many tabs and gains two more (digital inspections, maintenance). Records stay reachable from the compliance service that owns them. A list view comes later.

### 6.7 Enrolment modal · P0

`[x1]` · `[x3]` asset search · `[m4]` not on a schedule

Per `R-20`–`R-24`. Footer `Cancel` / `Enroll`.

### 6.8 Asset › Maintenance tab · P0

`[s4]` the panel · `[n5]` reading entry · `[m1]` menus · `[m2]`, `[m2e]` mark complete · `[m5]` snooze · `[n6]` snooze rules · `[n7]` thresholds

- **Readings live in the asset header**, where the odometer already does; engine hours are added beside it. Both show `Last recorded` and `Current estimate` with provenance and a confidence bar (`R-27`).
- **One flat list for the whole asset**, ordered by what comes due first. Schedule is a **column, not a heading**, so two schedules never split the order.
- Columns: `Status` · `Service` · `Schedule` · `Interval` · `Due` · row menu.
- Row menu, routine: `Mark complete`, `Snooze`, `Create estimate`. Compliance: `Mark complete`, `Create estimate` — **no Snooze** (`R-03`). Schedule header menu: `Pause`, divider, `Remove`.
- `Ignore` and `Pause` are **not** service-row actions. `View recent work history` and `Activity` are covered by the Work Orders tab.

### 6.9 Maintenance reminders worklist · P0

`[s1]` the list · `[s1b]` nothing enrolled · `[s1c]` book is clear · `[s1d]` filtered · `[s1f]` not enough data · `[s1e]` one customer · `[s1dl]` several workplaces · `[b1]`, `[b1r]`, `[b1o]`, `[b1e]`, `[b1p]` contact card · `[b4]` send reminder · `[b3]` row menus

Under **Customers**, as a tab beside Customers itself. ✅ Confirmed placement: Customer tab and Asset tab, alongside digital inspections. **Not under Reports.**

- `R-46` **Four summary tiles act as filters.** P0. `Overdue`, `Due in a month`, `Due in three months`, `Not enough data`. Clicking a tile filters the list; **clicking it again clears it**; **multi-select is possible**. All four tiles look alike — the numbers carry the urgency, not the colour. → `V-23`
- `R-47` **Sorting is by clicking a column header.** P0. Not from a badge and not from a control inside a tile. → `V-24`
- `R-48` **Use the new filter design component**, which differs noticeably from the old one. P1 🚫 — confirm the component name in the codebase before building.
- Columns: `Asset` · `Customer` · `Service` · `Due` (+ provenance, `R-28`) · `Status` (`R-40`) · `Work Order` · `Actions`.
- `R-49` **There is no `View work order` button anywhere on the worklist.** P0. The work order is reachable as a **link in the Work Order column**, so a button repeating that navigation is redundant. `Contact` occupies the Actions slot on **every** row, whatever its status. A row with a work order shows `Contact` alone — no `Create estimate`, since one exists. → `V-25`
- No checkbox column, no bulk bar, no bulk estimate (`OOS-07`).
- **Contact card** ✅ Confirmed as designed: a **tappable phone number** for mobile, an email address that is easy to copy, and a send-reminder action that **respects the item's current state** — an overdue item sends the overdue email. Resend shows the last-sent date. States for no phone, no email, and neither.

### 6.10 Work order — maintenance panel · P0

`[w7c]` collapsed · `[wo1]` nothing at criteria · `[y0]`, `[w2x]` one due · `[w3]` supersession · `[w4]` compliance · `[w5]`, `[w5x]` cannot be judged · `[w6]` no schedule · `[w7]` two schedules · `[y1h]` hover · `[y1a]` add confirm · `[w2b]` after adding · `[w2p]` without permission · `[w8]`–`[w11]` readings · `[y1d]` already done here · `[y3]` completion · `[y4]` provenance column · `[v1]`–`[v9]` line shapes

- ✅ Confirmed: **collapsed by default with a tag to expand.** The count carries the signal. Neutral in tone: an opportunity, not an alert.
- `R-50` **The hover on a service shows the job description, any parts on it, and — if one is attached — which digital inspection form it uses.** P1. Drawn 16 Sep 2026 on `[y1h]`: description as prose, parts with quantities and part numbers, the named inspection form. The card sits **beside** the row, never over it. ⚠ No variant drawn for a service with neither parts nor a form. → `V-26`
- `R-51` When a reading update makes something newly due, **emphasise it lightly**: *"Due today · odometer updated 14:20"*. Information, not an alarm.
- `R-52` Keep both options: **`Add to this work order`** and **`Create a new work order instead`**.
- `R-53` ⛔ **No `Compliance` tag on data rows. Revised 16 Sep 2026.** The tags read wrong, and the service name plus its due date already identify it. Removed from the worklist row, the asset row and the work-order panel row. The tag **stays in the schedule editor and the service form**, where there is no due date to identify it by. Do not recolour the service title.

- `R-56` ⭐ **NEW — two ways to satisfy a service. Revised 16 Sep 2026, and this closes `OQ-11`.** P0.

  A work order can satisfy a maintenance service **however it was built**, so every panel row offers both:

  | Action | What it does |
  |---|---|
  | **`Add`** | brings the service's canned lines onto the work order |
  | **`Mark Complete on this work order`** | a plain statement by the advisor |

  Either one marks the row **addressed on this work order**, and the service then resets when the work order is **invoiced**, on the same rule as any other completion (`R-42`).

  **Nothing infers a match.** Do **not** draw anything suggesting the system reads line text or recognises a canned line as a preventive-maintenance item. The advisor says so; the system does not guess. Getting clever here is how it breaks. → `V-65`

- `R-57` ⭐ **NEW — the row is one summary, not a list.** P0. Where a service carries more canned lines than fit, the row reads **`4 lines · $412.60 · 2.1 hrs`**. That summary **is the main content of the row**; the individual lines come off. → `V-66`

- `R-51.1` ⭐ **NEW — newly due must be visible in real time.** P1. When a reading makes something newly due while the card is open, it changes **on the card, live** — a pulse or a tone change, **not an alarm**. `[w9]`

- Every row carries the two actions above; a compliance row with no record carries `+ Add certificate` as a **third action in the same row** — a compliance row reads identically to a routine one. Reading entry is **not** offered inside the panel — readings are entered in the header (`[w8]`).

## 7. The customer email · P1, second chunk

⛔ **Rewritten 16 Sep 2026. Three emails became one, and the settings screens are gone.**

Why, and it is worth carrying because it will otherwise be re-proposed: **one unit can be upcoming, due today and past due at the same moment.** With three emails an owner opens three messages to find out about one truck.

- `R-59` **One consolidated email per customer**, with a **table of units** — not one email per asset. ✅ Confirmed. A 50-unit fleet gets one email. → `V-28`
- `R-65` ⛔ **One hardcoded email.** P1. The wording is **fixed and identical for every shop**. Nothing about it is editable.
- `R-66` ⛔ **The entire Reminder settings screen and its editor are deleted.** Boards `[r1]` `[r2]` `[r1e]` `[r3p]` `[r4]` `[r5]` `[r5b]` `[r6]` are gone. With no editable content there is nothing for the page to hold, so **Settings carries one list, not two tabs**. One artboard of the email itself is kept, rendered as it would look in a mail client, so it can be built: `[r1]`.
- `R-67` ⛔ **One opening line that holds for any mix**, so it **never needs a singular and a plural version**: *"You have some preventive maintenance we want to remind you about."* Followed by the table. The two-line singular/plural scheme is withdrawn.
- `R-60` Each table row carries the **unit, the service and the due date, with its state on the row**. Where confidence is low the due cell reads **`Soon`**, not a date (`R-27`).
- `R-61` **Only include what is reasonably near.** Nothing due eleven months out.
- `R-64` ⛔ **No unsubscribe link.** Honouring one properly is **consent management**, which is its own feature. `R-64.1` (the unsubscribe scope line) is withdrawn with it. The footer **states why the customer received it, and stops there**.
- Header carries the shop logo, name and phone. Sending uses the **same mechanism as work-order email**, so the reply address is the one customers already write to.
- `R-68` `R-69` `R-69a` (default strings, test send, the Sending tab) are **withdrawn** — there is nothing to word, test-word, or schedule per shop.

### 7.1 Consent lives on the customer · NEW

- `R-70` ⭐ **REVISED.** P0. One boolean on the **customer record**: **`Send preventive maintenance notifications`**. It appears on **three surfaces** — nowhere else. In the enrolment modal it is a **plain checkbox with an info tooltip** (v12); no highlighted row, no customer-setting tag, no warning line.
  - **Where it is edited.** In the **customer edit dialog**, as the third checkbox in the trailing row beside `PO is required` and `Pin notes?` — same row, same width, same size, same weight. There is **no notifications card and no notifications tab** on the customer page; the customer page is a header plus its existing tabs. One checkbox does not earn a new one.
  - **Where it is switched.** The **customer info card** carries the setting as a **toggle**, **below `IBS` and above the Contacts / Assets counts**, labelled `Maintenance notifications`. Its info tooltip states the scope: *"Covers every asset this customer owns, including units enrolled later. Turning it off does not remove any unit from maintenance tracking."* Still no card, tab or page of its own.
  - **No preferences page, no per-channel matrix, no unsubscribe control.** Consent is one boolean.
  - **No explanatory copy beside the checkbox.** The rule lives in the info-icon tooltip: *"Preventive maintenance reminders are emailed to this customer's preferred contact. Turning this off does not remove any unit from maintenance tracking."*
  - **Default ON**, decided 16 September, for existing and new customers alike. A shop switches individual customers off on the record; there is **no bulk action** and no turn-everyone-on button.
  - **Permission** follows *editing a customer*. It is **not** financial data, so it does **not** sit behind the AP/AR visibility gate the way `PO is required` does. Without that permission the trailing row and `Save` are disabled.
  - **Enrolment modal (second surface).** It shows the current value **and offers the change in place**, writing the same field — an advisor who sees `off` mid-enrolment must not have to close the modal, open the customer, edit, save and start again. The row states that it belongs to the **customer, not this asset**; when off, the state is **visibly** flagged (warning fill + `<customer> receives no reminder emails`), not quiet.
  - **Worklist contact card (third surface).** Rows still appear; nothing is hidden internally. The email row carries `Notifications off for this customer`, **`Resend` is disabled** with a tooltip naming the field, and a `Turn on for this customer` link leads to the customer.
  - **Off stops the email and nothing else.** Every due date, status and worklist row is unchanged.
  - **Not drawn, still binding:** the edit-dialog checkbox, the no-permission state and the phone-width reflow are specified above and carry no board of their own — they are the same control in another position.
  - `[cs0]` the toggle on the customer info card, on design page 2 beside the enrolment modal · `[x1]` enrolment on · `[x1r]` enrolment off · `[b1o]` contact card, cannot send. → `V-67`

## 10. Design system binding

The bound system is **Shopview Design System** (`_ds/shopview-design-system-fac6efcf-…/`). `colors_and_type.css` is the only place tokens are defined. **Reference the variable, never the hex.**

Compose from the existing components — Button, Input, Select, Checkbox, Toggle, Badge, Table, Tabs, Menu, Modal, Side Panel, Tooltip, Breadcrumb, Avatar. Do not restyle raw HTML to look like them.

| Element | Rule |
|---|---|
| Radii | 8px buttons/inputs/menus/cards · 12px modals and large panels · pill badges |
| Elevation | sm resting · md hover and dropdowns · lg modals and popovers |
| Focus | 4px `rgba(37,124,255,.24)` ring + 2px `#257CFF` border. Always visible. |
| Overlay | `rgba(15,17,26,0.5)`, **no blur** |
| Motion | 120–160ms ease-out. Hover = colour shift + sm→md. Active = darker fill, no shadow. No bounce, no entrance animation. |
| Type | Inter throughout; Inter Display for H1/H2 only. Minimum 12px. Numeric columns `tabular-nums`. |
| Buttons | 32px row actions · 40px page and dialog actions. **One primary per view.** |
| Colour discipline | Neutral grey by default. Warning = compliance and overdue. Success = done. Error = destructive and hard error. Primary = actions, links, active filters. **Two colours maximum per row**; more belongs in a tooltip. Colour never carries state alone. |
| Icons | Lucide, outlined, 1.5–2px stroke, `currentColor`. In `assets/icons/lucide/`. |
| Prohibited | Gradients, illustrations, photography, emoji, frosted glass |

**Modals** close with the design system's **X**, not a text `Cancel` in the header. Footers carry `Cancel` + one primary.

> ⚠️ **Known debt in the canvas.** The prototype styles buttons and modals with inline CSS against tokens rather than mounting the design system's components, and several modals close with a text `Cancel`. That is an authoring artefact of the prototype, **not** a specification. Build against the real components.

---

## 11. Confirmed — do not redesign

These landed with the shop side in session 3. Changing them is a regression.

| ✅ | Rule |
|---|---|
| Recorded vs estimated readings with a visible confidence level | `R-27` |
| Calendar always on as the fallback | `R-01` |
| One consolidated email per customer | `R-59` |
| Collapsed maintenance panel on the work order, with a tag to expand | §6.10 |
| Placement under Customer and Asset | §6.9 |
| Soft reading validation, never blocking — the position stands, the screens are cut for now | `R-30` |
| `compliance` as the word, not `regulated` | §3 |
| The operator on all three interval rows | `R-09` |
| One distance unit, the word `mileage` | `R-10`, §3 |
| Three confidence levels grading the meter, with `No data` separate | `R-27` |
| No rate borrowed or invented; `No data` runs on the calendar | `R-27.1` |
| Contact modal as designed | §6.9 |
| Mark complete: work order or elsewhere, resetting the interval | `R-41`, `R-42` |

---

## 12. Open questions

Do not invent answers. Build the surface, leave the seam.

### Closed since v6

| ID | Was | Resolution |
|---|---|---|
| `OQ-11` | Tagging a work-order line as coming from a service | **Closed.** `R-56`: the advisor states it. `Add` or `Mark Complete on this work order` both mark the row addressed; notes and the audit log record the schedule. Nothing reads line text. |
| `OQ-12` | Compliance terminology | **Closed.** Settled as `compliance`. The Certificates tab is descoped (v12). |
| `OQ-18` | Satisfying a reminder from hand-typed lines | **Closed** by `R-56` — it is an action on every row, not a separate screen. |

### Blocking a v1 surface

| ID | Question | Blocks | Owner |
|---|---|---|---|
| `OQ-09` | Is the compliance inspection due date the **last day of the expiry month**? Described by Chris Ward, not confirmed by the shop side. | `R-16`, every compliance date | Shop side |
| `OQ-10` | **The confidence thresholds.** `Low`, `Medium` and `High` are settled (`R-27`); what separates them, in visit count and recency, is not. **Engine hours need the same treatment as mileage.** Gates what the UI is allowed to claim, and the boards claim a grade in five places. | `R-27`, every estimate | Design + Sasha |
| `OQ-12` | The starter set: handover 3 says **five** templates and lists **four**. Which is the fifth, or is four correct? Cody also owes template recommendations. | `R-44` | Cody |
| `OQ-13` | **Permission to send a reminder.** A new permission, or gated behind create/edit customer? A tech should see the list but not send. | `R-55` | Sasha |

### Blocking the email chunk

| ID | Question |
|---|---|
| `OQ-01` | Who the email comes from — a from and reply-to decision, not a per-shop setting |
| `OQ-02` | Whether we can mass-send at all. Volume and deliverability limits on the sending mechanism. |
| `OQ-03` | The daily calculation job: what recalculates due dates and queues the day's sends |
| `OQ-04` | A single global send time for the whole system, not per shop |

### Not blocking

| ID | Question |
|---|---|
| `OQ-18` | The **artefact label on a shop-added type**. A seeded type carries its own; a typed-in one falls back to `Certificate number`. Whether the shop should be asked for the label is open. |
| `OQ-19` | A **global metric/imperial setting per organization**. Fabijan floated it. No such setting exists in the codebase, so it is an application-wide change rather than part of this feature. Noted, deliberately not drawn. |
| `OQ-17` | Whether **engine hours** drop `hrs` the way distance dropped its abbreviation. `mileage` is written in full because one unit covers miles and kilometres; hours have no such ambiguity. |
| `OQ-21` | **The bundling window.** `R-42.1` collapses candidates that fall inside a window; its length is not set. |
| `OQ-06` | Asset naming in customer-facing copy. `unit number · year make model` is right inside the product; the email needs Fabijan. |
| `OQ-07` | `MaintenanceDueBanner.vue` is deleted. Confirm nothing else depends on it. |
| `OQ-08` | Retroactively updating assets already enrolled. `R-04` is copy-on-enrol; a law change may need the opposite. Deferred. |
| `OQ-11` | **Tagging a work-order line as coming from a maintenance service.** Undecided — one service can produce many lines, so a tag beside every line may be too much. Notes and the audit log record it regardless (`R-43`). |
| `OQ-14` | Partial settings permissions (service-only access) before the reminder settings page is final. Sasha. |
| `OQ-15` | **Read receipts on reminder emails.** New shop-side request. Nowhere to expose it today; nearest candidates are the contact card (read/unread under "last sent") and the reminder settings hub. Also blocked by `OQ-02`. |
| `OQ-16` | With `Paused` removed as a status (`R-36`), what does the `Pause` action on the schedule header render as on the asset row? Not resolved in session 3. |

---

## 13. Canvas divergences

The canvas is current to spec **v7** for terminology, the email, consent, enrolment, confidence, precision, readings, the work-order panel and every §9 screen fix. These remain specified above but **not yet drawn.**

| Rule | Canvas today | Spec |
|---|---|---|
| `R-44` | `PM-A`…`PM-D` + `CVIP` templates | Four basic templates (`OQ-12a`) |
| `R-12` | `[c0]` offers "blank or from a template" inside the service flow | No template control in the service form |
| `R-33` | Not drawn | Undo toast + later correction |
| `R-46` | Tiles filter `[s1]`/`[s1d]` | Plus click-again-to-clear and multi-select |
| `R-48` | Old filter chips | New filter component |

| `R-55` | Not drawn | Send hidden without permission |
| §0 gaps | No board | Loading, saving, stale-data and error states |

Everything else in §6 is drawn and current.

## 14. Verification checklist

Run every assertion. Each cites the rule it tests.

| ID | Assertion | Rule | Weight |
|---|---|---|---|
| `V-01` | A schedule cannot be saved with calendar switched off; there is no control to do so | `R-01` | P0 |
| `V-02` | A service has exactly one name field | `R-05` | P0 |
| `V-03` | The calendar `every` interval takes a number and a `days`/`months` unit; `at` takes a month only | `R-08` | P0 |
| `V-04` | The distance trigger shows the word `mileage`; no picker and no abbreviation exist anywhere | `R-10` | P0 |
| `V-05` | No template control exists anywhere inside the service form | `R-12` | P0 |
| `V-06` | Selecting a type pre-fills the term and the term remains editable; no locked state exists | `R-14` | P0 |
| `V-06b` | Typing a name no type matches offers `+ Add "…"` | `R-13` | P0 |
| `V-07` | `Start reminders` defaults from the term, accepts 1–4 months only, and rejects nothing else | `R-15` | P0 |
| `V-08` | Each of the six types renders its own artefact label; none hides the field | `R-17` | P0 |
| `V-09` | All three entry points open the identical record form component | `R-19` | P0 |
| `V-10` | The enrolment modal takes one last-service date **per service**, plus both readings | `R-21` | P0 |
| `V-11` | Snooze is absent — not disabled — on every compliance row and menu | `R-03` | P0 |
| `V-12` | Every due date in the product renders a provenance line naming its rule | `R-28` | P0 |
| `V-13` | No reading value can be rejected by validation | `R-30` | P0 |
| `V-16` | An undo appears after saving a reading, and a saved reading can be corrected later | `R-33` | P0 |
| `V-17` | The reading modal from the asset and from the work order are one component | `R-35` | P0 |
| `V-18` | No UI renders `Active` or `Paused` as an asset-level status | `R-36` | P0 |
| `V-19` | Snoozing changes only the due date; no status, no reason field | `R-39` | P0 |
| `V-20` | A row with no work order reads `Open`; once one exists the row shows that work order's status | `R-40` | P0 |
| `V-21` | Adding a service writes both a work-order note and an audit entry | `R-43` | P0 |
| `V-22` | Line search returns no maintenance services | `R-45` | P0 |
| `V-23` | A tile toggles its filter off on second click, and two tiles can be active at once | `R-46` | P0 |
| `V-24` | Sorting is only reachable from a column header | `R-47` | P0 |
| `V-25` | No `View work order` button exists on any row; `Contact` is in that slot and the WO is reachable only as a column link | `R-49` | P0 |
| `V-26` | The service hover shows description, parts, and inspection form when present | `R-50` | P1 |
| `V-27` | Without send permission the send action is **hidden**, not disabled | `R-55` | P0 |
| `V-28` | A customer with five due assets receives one email with five rows | `R-59` | P1 |
| `V-29` | The first reminder cannot be duplicated, and its unit follows the trigger | `R-62` | P1 |
| `V-30` | With the schedule off, the manual send from the reminders page still works | `R-63` | P1 |
| `V-31` | No em dash appears in any UI string | §3 | P1 |
| `V-32` | No asset is labelled `Unit 402`; every asset reads `402 · 2019 Freightliner Cascadia` | §3 | P0 |
| `V-33` | Nothing from §2 `OOS-01`…`OOS-09` is reachable in the UI | §2 | P0 |
| `V-34` | No token is hardcoded as a hex; every colour resolves through `var(--sv-*)` | §10 | P0 |
| `V-35` | Fixture A (§5.4) reproduces exactly, including the recalculation deltas | `R-26` | P0 |
| `V-36` | The `every | at` operator renders on all three interval rows, and selecting `at` on the calendar row swaps the months picker for a month picker | `R-09` | P0 |
| `V-37` | No service has a second, customer-facing name anywhere in the product | `R-05` | P0 |
| `V-38` | `miles`, `kilometres`, `mi` and `km` appear zero times | §3 | P0 |
| `V-39` | The word `compliance` appears zero times; the asset tab still reads `Certificates` | §3 | P0 |
| `V-40` | The type control is a type-ahead that offers `+ Add "…"` on no match, and the added type is scoped to that shop | `R-13` | P0 |
| `V-41` | Certificate start date does not appear on the service form | `R-19.1` | P0 |
| `V-42` | The due-date reminder row's delete control is present and disabled | `R-62` | P1 |
| `V-43` | No explanatory sentence sits under a heading, under a field, or beside a control; rules are behind info icons | §0 | P1 |
| `V-44` | Exactly one email exists, hardcoded, with no settings screen behind it | `R-65` `R-66` | P1 |
| `V-45` | The email opening line holds for any mix of states, with no singular and plural variants | `R-67` | P1 |
| `V-46` | Each table row carries the unit, the service, the due date and its state | `R-60` | P1 |
| `V-47` | The footer states why the email was received and carries no unsubscribe | `R-64` | P1 |
| `V-48` | The enrolment modal carries no reading fields, no `Comes due` column and no running-rate control | `R-20` | P0 |
| `V-49` | Every estimate names its source: `measured from N visits · last read N days ago` | `R-28` | P0 |
| `V-50` | A service completed on an uninvoiced work order keeps its old due point, and shows no distinct status | `R-42` | P0 |
| `V-51` | Two candidates inside the window collapse into one event on the earlier date showing both reasons; across schedules nothing absorbs | `R-42.1` | P0 |

| `V-53` | A unit with no contact information shows an empty state opening the add-contact modal, and no send action | `R-49.1` | P0 |
| `V-54` | Origin and value can be reported together | `R-58.1` | P1 |
| `V-55` | The email carries no unsubscribe link; the footer states why it was received and stops | `R-64` | P1 |
| `V-56` | No rate is ever borrowed or invented; a unit with no usable pair reads `No data` and runs on the calendar | `R-27.1` | P0 |
| `V-58` | No projected date shows a day; only a recorded reading and a user-set snooze carry an exact date | `R-27.2` | P0 |
| `V-59` | A service watching a meter the asset has no reading for shows `Not enough data` **per meter** | `R-23` | P0 |
| `V-60` | Bulk enrol selects units for **one** schedule per pass; units already on another are not selectable | `R-24.1` | P1 |
| `V-61` | Invoicing a work order sets the last recorded reading to the mileage at that moment | `R-33.1` | P0 |
| `V-62` | No `Comes due` cell ever reads `No record` for a compliance service | `R-16.1` | P0 |
| `V-63` | Every summary tile carries a figure or states why it has none | `R-49.3` | P1 |
| `V-64` | An asset with no unit number renders make and model with `No unit number` beneath | `R-49.4` | P0 |
| `V-65` | Either `Add` or `Mark Complete on this work order` marks the row addressed; nothing reads line text to infer it | `R-56` | P0 |
| `V-66` | A service with more lines than fit renders one summary, not a list | `R-57` | P0 |
| `V-67` | Notifications off stops the email and changes no due date, status or worklist row | `R-70` | P0 |
| `V-68` | The strings `regulated`, `mi` and `km` appear zero times | §3 | P0 |
| `V-69` | No `Compliance` tag appears on a worklist, asset or work-order panel row | `R-53` | P0 |

---

## 15. Files in this bundle

| File | What it is |
|---|---|
| `PRD.md` | **This document. The source of truth.** |
| `Maintenance Reminders.dc.html` | **Canvas index** over seven pages, 106 artboards. `Maintenance Reminders.dc.html` holds them all in one scroll. |
| `00-overview.md` … `06-work-order.md` | **Six review chunks.** Click-by-click paths, per-chunk state coverage, gap tables and spec-testing questions. Read `00-overview.md` first, then in numbered order. |
| `Maintenance Reminders - Flow Map.dc.html` | Control-flow map, drawn. The same graph as §6.0 in visual form. |
| `ShopviewHeader.dc.html` | App header component. Takes a `nav` prop. |
| `SettingsSidebar.dc.html` | Settings sidebar. |
| `support.js` | Prototype runtime. Not part of the design. |
| `_ds/shopview-design-system-…/` | `colors_and_type.css` (all tokens) + the component bundle. |
| `assets/` | Lucide icon SVGs, ShopView symbol. |
| `README.md` | Index. Superseded by this file. |

**The canvas is a design reference, not production code.** It is authored in a streaming HTML format with 100% inline styles — an authoring constraint of the design tool, not a recommendation. Recreate the designs in the target codebase using its own patterns and the real design-system components.

---

## 16. Decision log

Cleared at handoff. From here this log carries only what changed **after** handoff.

| # | Date | What changed |
|---|---|---|
| 1 | 16 Sep 2026 | Handoff. Design aligned to Confluence spec v7. |
| 2 | 23 Sep 2026 | Spec v12. Chunk one: calendar `every` gains a days/months unit, `at` stays a month. Chunk two: reading modal loses `WHAT THIS CHANGES` and unit words; status badges `Overdue` · `Due today` · `Due soon` beside the service; overdue rows print no figure; month-precision dates; `Add history record` + edit icon + `Expiry date` picker; Certificates tab descoped; plain consent checkbox; descriptive subheadings stripped (standing rule); duplicate header readings removed. |
| 3 | 23 Sep 2026 | Work dates step at invoice (review 22 Sep): editable work-done date per completed maintenance service, read-only next due beside it, absorbed services nested, compliance excluded, one-action accept, never blocks. Boards `i1`–`i5` on page 4. |
| 4 | 24 Sep 2026 | Reminder rows move from each service to the schedule (days only, up to five, default 14 before · due date · 7 after; due-date row undeletable). Sending: schedule master switch `Email customers`, default off; per-service switch, default on, as an Email column in the service table. Service modal ends at canned lines. |
