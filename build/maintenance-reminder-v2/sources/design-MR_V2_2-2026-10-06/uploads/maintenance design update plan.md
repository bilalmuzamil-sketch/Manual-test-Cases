# Claude Design — update plan

**Maintenance Reminders (SV-3780). Written 2026-09-03, from Sasha review #2 (call 2026-09-02).**
**Deadline: Friday 2026-09-04 EOD, before showing Fabijan.**

Every item is marked **[F]** — must be visible Friday — or **[L]** — later. Work the [F] items in the order they appear; the areas are already sequenced by how much each one changes the story.

Item codes below (M1, A6, D3…) point into the analysis this was built from.

**How to work this document.** Apply it as **one pass over the whole canvas.** Four changes in here — the trigger moving onto the service, compliance records, the two-layer split, and the estimated-reading field — ripple across every area, so applying an area in isolation leaves the rest of the canvas referring to a model that no longer exists.

**If you cannot finish in one pass, do not spread the work thinly.** Work the areas in the order they appear, finish each one completely, and **stop cleanly at an area boundary** — then say which area you stopped after. A canvas where areas 1–5 are fully updated and 6–10 are untouched is recoverable. A canvas where every area is half-updated is not.

---

## 0. Global rules — apply to every artboard [F]

1. **Strip all explanatory hint copy.** Every caption, annotation and "this shows…" line that exists to explain the design to Milos and Sasha comes out. Sasha asked twice, and it is his stated acceptance condition.
2. Where a rule genuinely needs explaining to a *user*, it moves **behind an info icon** — Branko's feedback, adopted.
3. **One line per table row** wherever it fits.
4. **Existing design-system components only.** Do not invent controls. Known gap: the inline search control is **not in the design system** — Branko has been asked to add it. Draw the search where it belongs and flag it rather than inventing a variant.
5. **Compliance is orange, never red.** Chris: *"red sounds like something bad's happening."*
6. **"Template" appears nowhere** — not in a heading, button, empty state or helper line. The object is a **programme**.
7. Work-order numbers read `S3780-15904`. Distance in miles for this round.

---

## 1. Programme creation and the service form — the biggest visible change [F]

### 1.1 Delete the programme-level trigger step entirely — **M1**

The step that asks which meters the programme watches **goes away.** Sasha: *"you have to set it per service line anyway… PM-A may be mileage-based, PM-B mileage or time-based, PM-C time-based only."*

The programme now carries only: **name**, **distance unit (mi/km)**, and **an ordered list of services**. Nothing else.

### 1.2 Reorder the service form — **A6**

New order, and the compliance question moves **above** the trigger because it changes the trigger:

1. **Service name** — free text, plus *"start from a common service"*
2. **Is this a compliance inspection?** — a **toggle**, not a checkbox
3. **Trigger** — distance · engine hours · calendar, **multi-select, any combination**, evaluated as OR
4. **Intervals** — one field per ticked meter, joined by *or*
5. **Canned lines** — ordered, picked from the shop's library, search only
6. **Reminders** — see area 2

### 1.3 Prefill the trigger from the previous service — **M1**

Do **not** build inheritance from a programme-level default; there is no such default any more, and an inherited value creates a recalculation problem the moment anyone edits it.

Instead: the **first** service added asks for its trigger cold. Every **subsequent** service opens with the previous service's trigger already selected and its interval fields empty. No "custom" marker, no reset control, nothing to explain.

Draw: adding a second service to a programme, trigger already ticked, intervals blank.

### 1.4 The distance notice moves onto the trigger, permanently — **§7 standing**

Sasha: the *"only speaks when someone records a reading"* notice belongs on the **distance option itself, always** — not only when distance is the sole meter — because it is true of the distance leg even inside a distance-plus-calendar programme.

And it becomes **an offer, not a warning**. Where distance is ticked and calendar is not:

> `This service only fires when someone records a reading.` → **Add a 12-month calendar backstop**

One tap, visible, the shop owns it. Do **not** draw a silent fallback.

### 1.5 Info icon per trigger type — **A21**

Each of distance, engine hours and calendar gets an info icon explaining exactly how that trigger fires. This is where the copy Sasha wants removed from the canvas actually belongs.

### 1.6 Skeletons ship without canned lines — **A8**

*"Start from an example"* offers **five**: four PM tiers plus CVIP. They carry names and realistic interval bands only. **No canned lines** — no shop is guaranteed to have matching lines, and some do not use the concept.

### 1.7 Fix the Customise scope — **A9**

Clicking **Customise** on PM-B opens **PM-B**. Today it opens an editor showing every service in the programme.

---

## 2. The reminder schedule — one list, unlabelled, capped [F]

Currently split across two screens, with numbered labels, and the second screen also shows the first screen's rows.

### 2.1 Merge before and after into one list — **A11**

One section, `Reminder schedule`. Every row has the same shape:

> `[ before ▾ ] [ 7 ] [ days ▾ ]`   ·   `[ after ▾ ] [ 7 ] [ days ▾ ]`

For a distance-triggered service the unit selector offers **miles** as well as days.

### 2.2 Unlabelled rows, Google Calendar pattern — **A10**

No "Follow-up", no "Second follow-up", no numbering. A single **`Add reminder`** beneath the list, and a remove control per row. Sasha: *"they just say add notification, and you just keep adding. They don't label them first notification, second notification."*

### 2.3 Cap it — **A12**

Default **three** rows: window opens · due date · seven days after. Hard ceiling **five**. `Add reminder` disables at the ceiling. Sasha: *"we don't want to give them 100 notifications per service line."*

### 2.4 The worked example stays [F]

An offset like "7 days after" hangs off a due date that was itself estimated, so every follow-up inherits the error. Beneath the list, resolve it against one real unit, in one line, in two variants — with a fresh reading and with a stale one, so the confidence difference is visible:

> `Unit 402 at 640 mi/week → 12 Sep · 19 Sep · 3 Oct · estimated, reading 34 days old`

---

## 3. Compliance records — the new object [F]

**M2, and the idea Fabijan is most likely to react to.** Verified in code 2026-09-03: nothing like this exists; `CVIP` appears nowhere in the codebase.

A compliance approval belongs to the **truck**, not to our programme. It arrives from an agency with its own effective date that has nothing to do with when any work order completed, and it must survive a programme being removed and replaced.

**Naming: "compliance record".** Not "licence" — `LicencePlate` already exists in the code as the registration plate, and the collision is real.

### 3.1 Compliance records on the asset [F]

A block on the asset, several records possible. Each carries:

- **Type** — an extensible list the shop can add to. Chris confirmed CVIP as the common case; other jurisdictions differ and **nothing is hardcoded**.
- **Effective date** — entered manually, because it comes from the agency, not from us.
- **Expires** — a **month**, not a day. Certificates expire on the last day of a month.
- **Term** — 6 or 12 months, settable; other terms exist.
- **Certificate number** — optional.

**Draw the empty state prominently.** A unit with a compliance service and no record must read **`Certificate unknown`**, never sit silently as though it were tracked. This is PRD §18 Q8, and compliance is the highest-consequence thing in the product.

### 3.2 The monthly cohort works off records, not schedules [F]

Chris's actual practice: *"day one of the month, whatever the first Monday is — anybody that expires that month, we call them and book right away."* A running spreadsheet of which units are 6-month and which are 12-month.

So the cohort is a list you work down: **`Expires this month — 7 units`**, showing unit · customer · expiry month · 6- or 12-month cycle, with tick-off and a **print** action.

**Draw it as working with no programme attached to anything.** That is the point: it must be usable on day one, before any programme exists — see area 9.

### 3.3 The printed record [L]

One page per asset, showing **only what was performed**. §396.3 asks a shop to demonstrate a systematic maintenance programme; handing an inspector a document highlighting your own misses serves nobody. The on-screen gap view (area 5.3) is the opposite and deliberately so.

---

## 4. The estimated current reading — one field, everywhere [F]

**M4, Sasha's idea, adopt whole.** This is the home the four-tier cascade never had.

One field. It always exists. Only what is behind it changes, and it always carries an **as of**:

| Behind it | Reads |
|---|---|
| A real reading | `342,000 mi · recorded 29 Aug on WO S3780-15211` |
| Measured from history | `≈ 348,200 mi · estimated from 6 visits · as of today` |
| The customer's stated average | `≈ 349,000 mi · from the 2,000 mi/week they told us · as of today` |
| Regional default | `≈ 351,000 mi · national average for long-haul · as of today` |
| Nothing | `Not enough data to estimate` |
| Telematics, later | `342,880 mi · Samsara · as of 06:14 today` |

**Floor: never estimate for a unit seen fewer than twice.** Below that the field reads `Not enough data to estimate`.

**Where it appears [F]:** the asset page · the work-order asset card · wherever else asset information is shown. It is also where the **Enter a reading** action lives.

Sasha's scenario, which the field has to deliver: *"the mileage was 103,000 but the guesstimate is 125,000 — why don't I call Bob and say, have you hit 125,000 yet?"*

Draw all six states as one component.

---

## 5. Asset → Maintenance panel [F]

### 5.1 Service-row menu — remove Edit — **A15**

`Complete · Snooze · Create work order · Service history · Activity`. **Edit is gone** — neither of you could justify it.

### 5.2 Programme-header menu shrinks to two — **A16**

`Pause · Remove`. **Deactivate is gone** (indistinguishable from pause) and **Change programme is gone** (it is remove-then-add).

One rule that must not be lost with the control: when a programme is removed and another added, **cycles belong to the asset-plus-service pair and must survive.** The new programme's services anchor from the last completion of a matching service where one exists, otherwise from now. Without that rule, swapping a programme erases everything known about the truck.

### 5.3 The gap line — **D3**

The asset maintenance history *page* is cut. What must not be cut with it is the thing only it showed: **intervals where a service came due and no cycle was recorded**, which is what tells a shop where its programme broke down.

It becomes one line on each service row in this panel:

> `PM-B · last done 14 Aug 2024 · 2 cycles missed`

### 5.4 Complete may link an existing work order — **A18**

The Complete flow optionally attaches a work order, picked from a short list of that asset's work orders. **Optional** — the case where no work order exists is real.

Keep the external case: `Completed elsewhere`, with a date and a reading, recorded so history does not claim we did the work.

### 5.5 Ignore, not Delete — **A17**

On a due row the destructive-sounding action becomes **Ignore**, with a reason. Sasha: *"ignore is acknowledged and choosing not to do something. Delete is 'I don't want you to exist', which is the incorrect thing. It existed, we acknowledged it, we moved on."*

**Keep these separate and do not merge them:** *Ignore* dismisses one occurrence of a due service. *Delete* still exists, but only for an enrolment created by mistake that has no history behind it.

---

## 6. The worklist — dashboard, then drill in [F]

**Milos's decision, 2026-09-03.** Sasha's diagnosis was that a successful shop manages hundreds of assets and five rows per group shows almost nothing.

**Shape: an overview that drills in.** The condition that makes it work, in Milos's own words — the drill-in has to land on *who to call first*, not on a count. A number at the top is only useful if one click puts the advisor on the list they came for.

### 6.1 Overview [F]

Three groups, in consequence order — this order is not negotiable, it is what makes the page a worklist and not a report:

1. **Expires this month** — the compliance cohort. Orange.
2. **Ready to book** — work that can be sold today.
3. **Needs a reading** — *"nothing is being sold here, information is being gathered."* A different kind of call, and it must never push bookable work below the fold.

### 6.2 Drill-in [F]

A plain, dense table. **Server-side paged and sorted** — note that the current build loads everything and filters in the browser, so this is a backend change regardless.

One column set across all three groups; cells adapt, columns do not:

> `UNIT · CUSTOMER · WHY IT IS HERE · BUNDLED · VALUE · LAST CONTACT · LAST DONE AT · actions`

Sorting is by **clicking a column header**, matching the app. No sort dropdown.

### 6.3 Group by customer, and a shortcut — **A14** [F]

Group-by-customer stays. Add the shortcut Sasha asked for: beside a customer name, a control that instantly filters the whole list to that customer.

### 6.4 Last contact must be writable — **A/§11.4** [F]

Sasha: *"if you can't manually update that field, I don't like it, because it's mostly a phone-based business."* The column is fed by the **Log call outcome** action, not only by sends. Advisors ring people who do not answer, and the row has to show what has been tried so nobody rings twice.

### 6.5 Row actions [F]

| Row | Primary | Menu |
|---|---|---|
| Ready to book | **Call** · **Create WO** | Snooze · Service history · Log call outcome · Ignore · Open asset |
| Unit on site, open WO | **Add to WO S3780-15904** | as above |
| Needs a reading | **Call** · **Request a reading** | Enter a reading · Open asset |
| Compliance | **Call** · **Create WO** | Service history · Log call outcome · Open asset — **no snooze** |

**Call opens a contact card** — name, every phone number, email. Fleet contacts routinely have two or three.

**There is no "send reminder" action.** Under the new email decision (area 7) sending is a deliberate human act, and it appears only where it means *ask for a reading*.

---

## 7. Messaging — what is left of it in v1 [F]

**Decision, 2026-09-03: no automatic customer email in v1.** Sasha's argument carried — ShopView's own automated billing email is part of why a large account is leaving, and a fleet using three ShopView shops would get the same truck's PM-A reminded three times with no shop able to see the other two.

### 7.1 Delete from the canvas [F]

- The **customer-email toggle on the programme and on the service** — it was in the wrong place regardless of the automation question.
- The **campaign screens** built around automatic sending.
- Anything implying a message leaves the building without a person choosing to send it.

### 7.2 Two layers, drawn as two things — **M3** [F]

- **Enrolment = internal tracking.** On when the asset is enrolled. Feeds the worklist and the shop digest. No consent surface, because nothing leaves the building.
- **Customer participation = a separate, later, opt-in step**, and it is **owned by the customer**, not by the programme.

### 7.3 Channel preference on the customer [F]

A block on the customer record: how this customer wants to be reached, and whether they are in. Sasha's reason is better than the consent one: *"I've got an introvert who only wants email, versus a guy who'll always pay $50,000 but wants to talk for half an hour."* Foothills proves it — they email estimates and invoices, but **are not allowed to until they have made a phone call.**

Two cadence shapes, chosen per customer:
- **Per unit, when something is due** — the default for a customer with one or two trucks.
- **A periodic summary across their whole fleet**, weekly or monthly. Sasha: *"I'm a fleet manager, I manage 30 trucks. I don't want reminders asset by asset, milestone by milestone. Give me a report at the end of every month for all my assets."*

### 7.4 What still sends automatically [F]

**The shop digest.** Internal, no consent question, and under this decision it carries the whole thesis: the automatic reminder goes to the advisor rather than to the customer.

### 7.5 What sends by hand [F]

**Request a reading**, from a row in the needs-a-reading group. A person chooses to send it, which is inside Sasha's line. This is what closes the loop that group opens.

### 7.6 Shadow week [L — decision pending]

The system shows exactly what it *would* have sent, and sends nothing. Three months of that is the evidence that settles v2 instead of re-running this argument. **Milos has not yet ruled on it.**

---

## 8. The Work Order surfaces [F]

### Why this set matters

The work order is the only moment the truck is physically on the premises. Every other surface in this feature is about deciding who to phone; this one is about a unit that is already here, where the shop has leverage it will not have again for months.

Today this is scattered — an asset card nobody can read, a completion screen that resets services silently, and no visible link back from a work order to the programme that created it. Design it as one story.

**Four artboards.** Component states matter more than page chrome.

---

### Artboard 1 — Work order → asset card → maintenance section

A section inside the asset card on an open work order. Sasha on the current version: *"it doesn't fit at all, it doesn't work… you can keep it simpler, it doesn't need to be information dense."*

What it must carry, and nothing more: that services are due, which ones, how overdue, and one action. Detail lives one click away on the asset's maintenance panel.

**Six states.**

**1.1 — Enrolled, nothing due.** One quiet line. The section must not disappear, or the advisor cannot tell the difference between "nothing due" and "not tracked".
> `Maintenance · Highway Tractor PM · nothing due`

**1.2 — One service due.** Service name, why it is here, one primary action.
> `PM-A · overdue by 1,200 mi`  → **Add to this work order**

**1.3 — Several due, with supersession.** Within a programme the highest service absorbs the lower ones (one visit, one work order, all checklists). State the absorption; do not list the absorbed services as separate actionable rows.
> `PM-C · due now · absorbs PM-A, PM-B`  → **Add to this work order**

**1.4 — Compliance due.** Orange. No snooze anywhere on this row.
> `CVIP · expires end of September`  → **Add to this work order**

**1.5 — A service that cannot be judged.** A distance-triggered service whose reading is too old to trust. It must not read as "not due" — it reads as unknown, and it points at the fix.
> `PM-B · needs a current reading · last read 34 days ago`  → **Enter a reading**

**1.6 — Asset on no programme.** The persistent entry point Sasha asked for.
> `Not on a maintenance programme`  → **Add to programme**

Show 1.2 and 1.3 also in a **multi-programme** variant, where the unit is on two programmes and each contributes a row.

---

### Artboard 2 — A reading entered here changes things immediately

**The most important behaviour in the feature, and it has never been drawn.**

A technician records a new odometer value on this work order. The unit is re-evaluated **on the spot**, not on the overnight run. A service that was three thousand miles away is now due, and it has to surface while the truck is still on the premises — by tomorrow morning it has gone.

**2.1 — The reading field, before.** Beside the work order's odometer input, the asset's current knowledge, as a single field with its provenance and an "as of":
> `342,000 mi · recorded 29 Aug on WO S3780-15211`

and where no reading exists but the system can estimate:
> `≈ 348,200 mi · estimated from 6 visits · as of today`

and where it cannot:
> `Not enough data to estimate`

The provenance line is one line, quiet, directly beneath the number. Same field in all three cases — only what is behind it changes.

**2.2 — The moment after saving.** The maintenance section from Artboard 1 gains a row, and the row says it just arrived:
> `PM-A · due now · appeared just now, odometer updated 14:20`

Draw this as the section in its changed state, not as a toast.

**2.3 — A lower number than we hold.** The new value is normally the truth — usually someone typed the earlier one wrong. Matter-of-fact, never a warning, never refused. State what is on record, what is being entered, and that thresholds will be recalculated. One confirm.

**2.4 — An implausible value.** Refused, with the reason legible. Real case from QA data: a 2004 vehicle showing 217,649 miles and 11 engine hours.

---

### Artboard 3 — Work-order completion

One screen, two blocks, in this order.

**3.1 — What will be marked done.** The silent failure this closes: a service advancing although its work was not done, pushing the next due point a year out with nothing on screen. Prefilled, every item unchekable, with the reason an item is already unticked.
> ☑ `PM-A` · ☑ `CVIP` · ☐ `PM-B — its lines were removed from this work order`

Include a field for the **compliance certificate**, because it arrives from the agency with its own effective date that has nothing to do with when this work order completed. Month and year, and it must be skippable — the common case is not having it yet.

**3.2 — The enrolment nudge.** Appears **only** when the work just completed was maintenance-shaped and the asset is on no programme. Small, one line, skippable, never modal on its own.
> `This looked like maintenance work. Put this unit on a programme?` → programme picker → **Enrol**

Draw the completion screen in three variants: with both blocks · with the reset list only (asset already enrolled) · with neither (nothing to reset, nothing to offer) so the quiet case is visible.

---

### Artboard 4 — Work Orders list, provenance column

One column, `Maintenance programme`. Where a work order was created from a due service, it names the programme and links to it. Where it was not, the cell is empty.

This replaces a separate maintenance-history page — service history stays in one table, not two.

Draw the list with a mix: some rows attributed, most empty.

---

### What NOT to draw in this area

The worklist itself, the programme editor, the reminder sequence, the asset maintenance panel, any email. Those are other rounds. Nothing on these four artboards should show a monetary total or an hours estimate.

**Two things here matter beyond their own screens:**

- **The asset card's "Add to this work order"** is the same behaviour as the worklist's *unit on site* row (6.5). Sasha arrived at it from the work-order side and the PRD from the worklist side — two directions, one control.
- **A reading entered on a work order re-evaluates immediately.** Not overnight. The truck leaves tomorrow.

## 9. Sequencing note for the Fabijan conversation [F]

Worth saying out loud on Friday, because it changes what "v1" costs.

Because a compliance record is an object on the asset (area 3), **the monthly cohort works with no programme, no enrolment and no prediction.** A shop enters its CVIP dates and immediately gets *"expires this month — 7 units"*, tick-off and a print. That is Chris's spreadsheet, replaced, with zero setup — and compliance is the highest-consequence list in the product.

It is also **demoable without the cron**, which is what blocks everything on QA today.

Proposed as **step 0**, ahead of the current step 1.

---

## 10. Delete from the canvas

| Delete | Why |
|---|---|
| **Customer self-booking** — the tokenised page, the three windows, the drag onto the schedule | Sasha: *"I would not do that… it's the service advisors who make the schedule, they don't want to give that power to the customer."* And with automatic email gone, the booking link has no delivery vehicle |
| **Asset maintenance history page** | Competes with the work-order list and splits service history across two tables. Replaced by the provenance column, the gap line (5.3) and the printed compliance record (3.3) |
| **Deactivate**, **Change programme** | A16 |
| **Edit** on the service row | A15 |
| **Canned-line tags and categories** | The data does not exist — no line tagging in the system. Search only |
| **Customer-email toggles**, campaign screens | 7.1 |
| **Prediction settings toggles** — include inspection findings, parts history, customer behaviour, utilisation trends | On `origin/crm` these four **do not affect the maths**; they only append labels to an explanation. Keep prediction on/off and the conservative/normal/aggressive dial |

**Keep the research even where the feature is cut:** the booking primitives were all verified to exist — `BusinessHours`, `schedule-next/capacity`, the tokenised customer-portal `AuthorizeController`, and `ScheduleLaneKind = 'unassigned'`. That work is what makes v2 cheap.

---

## 11. Blocked on someone else

- **Inline search control is missing from the design system** — Branko.
- **The list of compliance types** beyond CVIP — Fabijan is a better source than Chris, who confirmed only CVIP and flagged an eastern-provinces emissions inspection he was unsure about.
- **A name for the worklist row.** "Reminder" currently means the row, the message, and one step in a sequence, and it visibly confused a design lead for several minutes. Proposal on the table: **due service**. Milos has not ruled.
