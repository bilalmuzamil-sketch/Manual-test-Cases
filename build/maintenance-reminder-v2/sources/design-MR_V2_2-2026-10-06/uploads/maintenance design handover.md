# Maintenance Reminders — design handover

**SV-3780 · 2026-09-03 · supersedes the change-list documents. Read this end to end before touching the canvas.**

The canvas has grown into a pile of components that cannot be followed. This document is organised the way the product is actually used — by surface, and inside each surface by flow. **Rebuild the canvas to match this shape.**

---

## How to lay out the canvas

**One band per surface**, labelled, stacked top to bottom in the order of this document.

Inside a band: **the main screen on the left. Everything its actions open, to its right, in a row, in the order the actions appear on the screen.** A modal sits immediately right of the screen that opens it. A modal that opens another modal sits right of that one.

Beside each connector, **name the action that causes it** — `Add service`, `Contact`, `Enter a reading`. A reviewer must be able to read a band left to right and understand the whole flow without opening anything.

Component states — the six states of the reading field, the six of the work-order card — go in **one row, in the order given**, directly beneath the screen they belong to.

Nothing floats unattached. If an artboard cannot be placed in a band, it does not belong on the canvas.

---

## 0. The spine — one artboard, drawn first

Before any screen, draw **what the objects are and how they relate.** This is what is missing, and it is why everything else reads as scattered.

| Object | Lives on | Carries |
|---|---|---|
| **Programme** | the organization | name · distance unit · an ordered list of services |
| **Service** | a programme | name · compliance yes/no · one or more triggers · one interval per trigger · canned lines · a reminder schedule |
| **Enrolment** | an asset | which programme · baseline readings · the customer's stated weekly average · running type |
| **Due service** | computed, never stored | what appears on the worklist. One per service that has come due for an enrolled asset |
| **Compliance record** | the asset | type · effective date · expiry month · term · certificate number. **Exists with or without a programme** |
| **Reading** | the asset | value · which meter · **when it was taken** · where it came from |

Two relationships that must be visible in the drawing, because they are the two people keep getting wrong:

- A **service** is a line inside a programme. A **due service** is that line coming due for one particular truck. They are not the same object and the design must not use one word for both.
- A **compliance record** belongs to the truck, not to our programme. Remove the programme and the record stays.

---

## 1. Settings → Service → Maintenance

One entry in Settings, beside Inspection Templates. **Two tabs: Programmes · Reminders.**

Both tabs survive the email decision. What changed is *who presses send*, not whether messages exist — see area 6.

### 1a. Programmes tab

**Main screen — the list.** Built for 50–70. Inline search, filters, sort. Two visible groups or a marker: programmes with assets enrolled, and programmes with none.

| Action | Opens |
|---|---|
| `New programme` | the create choice — blank, or start from an example |
| row `⋯` → `Edit` | the programme editor |
| row `⋯` → `Duplicate` | the editor, on a copy |
| row `⋯` → `Apply to assets` | the asset picker — **reuse the existing global search**, do not draw a new one |
| row `⋯` → `Archive` | confirm |
| Archived filter → row `⋯` | `Duplicate` · `Restore` only |

**No delete anywhere.** Chris: *"delete is completely gone. You're archiving, because things can be attached to it."* Restoring a programme restores it **enrolled to nothing.**

**Start from an example** offers five: four PM tiers and CVIP. Names and realistic interval bands only — **no canned lines**, because no shop is guaranteed to have matching ones and some do not use the concept.

**The programme editor** carries only: name · distance unit · the ordered list of services. **No trigger selection at programme level** — it lives on the service.

| Action | Opens |
|---|---|
| `Add service` | the service form |
| service row `⋯` | `Duplicate` · `Move up` · `Move down` — plus drag to reorder |
| `Apply to assets` | asset picker → conflict preview |

A service row reads on **one line**: `PM-B · 15,000 mi or 3 months · 3 lines, 3 absorbed`.

**The service form — this is the sequence, in this order:**

1. **Name** — free text, or *start from a common service*
2. **Is this a compliance inspection?** — a toggle. Turning it on **replaces everything below**
3. *(compliance on)* **Type** · **Term** · **Certificate start date** · **Book this early**
4. *(compliance off)* **Trigger** — distance · engine hours · calendar, **multi-select**, evaluated as OR
5. **Intervals** — one field per ticked trigger, on one row, joined by *or*. Untick everything and the intervals lock with `Tick a trigger to set the interval`
6. **Canned lines** — ordered, drag to reorder
7. **Reminder schedule**

**Certificate start date is required and it is currently missing.** A unit routinely arrives with a CVIP already two months old, issued by another shop in another organization. Term alone cannot place it. Chris: *"that's a very, very common thing that happens."*

**One `Add service` button, not two.** The compliance toggle is inside the form, so a separate `Add compliance service` is redundant — Chris's own call, and he is the one who originally wanted the distinction.

**Each trigger carries an info icon** explaining how it fires. Where a meter is ticked and calendar is not — **distance or engine hours, both** — the form offers, not warns:

> `This service only fires when someone records a reading.` → **Add a 12-month calendar backstop**

| Action | Opens |
|---|---|
| `Add lines` | the canned-line picker — search only, no tags, the data does not exist |
| `Reminder schedule` | inline, not a separate screen |

**The reminder schedule.** One list. Every row the same shape, no labels, no numbering:

> `[ before ▾ ] [ 7 ] [ days ▾ ]`

Distance-triggered services also offer **miles** as the unit. Three rows by default — window opens · due date · seven days after. **Ceiling five**, then `Add reminder` disables.

**What this schedule now drives.** Under area 6 it is no longer a customer mailing cadence. It decides **when a due service appears on the worklist and in the shop digest** — when the advisor is told. State that on the screen in one line, or the whole control reads as dead.

Beneath it, resolve the offsets against one real unit, in two variants so the confidence difference shows:

> `Unit 402 at 640 mi/week → 12 Sep · 19 Sep · 3 Oct · estimated, reading 34 days old`

### 1b. Reminders tab

**This tab survives.** A person still sends real messages, and someone still has to author them.

**Main screen** — the messages, and who they go to.

| Message | Sent by | Notes |
|---|---|---|
| **Shop digest** | automatically | internal. **Weekly**, day and time settable — Monday 08:00 by default |
| **Service reminder to the customer** | **a person, from the worklist** | the template lives here |
| **Request a reading** | **a person, from a row** | the template lives here |
| **Welcome / enrolment confirmation** | on enrolment | the customer just said yes |

| Action | Opens |
|---|---|
| a message row | the editor — **two panes, source and preview** |
| `Merge fields` | labelled blocks, never raw braces. A shop must never see `{{customer_name}}` |
| `Who receives this` | the audience view — by customer, by programme, by service |

The audience view carries the deliverability slices: receiving · **no email address** · opted out. The no-address count deserves prominence — those customers silently get nothing today and nobody can see them.

---

## 2. The asset → Maintenance tab

**Main screen — the panel.** Three blocks, in this order.

**Block 1 — Current reading.** One field, always present. Only what is behind it changes, and it always carries an **as of**:

| Behind it | Reads |
|---|---|
| a real reading | `342,000 mi · recorded 29 Aug on WO S3780-15211` |
| measured from history | `≈ 348,200 mi · estimated from 6 visits · as of today` |
| the customer's stated average | `≈ 349,000 mi · from the 2,000 mi/week they told us · as of today` |
| a regional default | `≈ 351,000 mi · national average for long-haul · as of today` |
| nothing usable | `Not enough data to estimate` |
| telematics, later | `342,880 mi · Samsara · as of 06:14 today` |

**Never estimate for a unit seen fewer than twice.** Engine hours get the same field and the same treatment.

**Block 2 — Programmes and services.** Per programme, its services. Each service row on one line, with its gap history where there is one: `PM-B · due 12 Sep · last done 14 Aug 2024 · 2 cycles missed`.

**Block 3 — Compliance records.** Independent of any programme. `CVIP · effective 14 Mar 2026 · expires September 2026 · 12-month`. A compliance service with no matching record reads **`Certificate unknown`**, prominently.

| Action | Opens |
|---|---|
| `Enrol` | the enrolment dialog → conflict preview if it overlaps |
| `Enter a reading` | the reading dialog |
| `Add compliance record` | the record form |
| service `⋯` → `Complete` | the completion dialog — optionally links an existing work order from a short list of this asset's, **or** records it as done elsewhere with a date and a reading |
| service `⋯` → `Snooze` | date **and** reason. Never available on compliance |
| service `⋯` → `Ignore` | reason. Dismisses this occurrence only |
| service `⋯` → `Create work order` | a new WO carrying this service's lines |
| service `⋯` → `Service history` | the work orders for this service |
| programme header `⋯` | `Pause` · `Remove` — nothing else |

**Removing a programme must not destroy history.** Cycles belong to the asset-and-service pair. Adding a new programme afterwards anchors each service from the last completion of a matching service, otherwise from now.

**The enrolment dialog** shows, live: which services it creates, each threshold as it resolves, the current reading it is anchoring from, and the customer's stated weekly average. Where a reading lower than the one on record is entered, confirm — do not refuse — and say that thresholds will be recalculated.

---

## 3. Customers → Maintenance — the worklist

The tab sits beside `Customers`, with the count on the nav item. This surface is organization-wide and not location-specific, which is why it lives here and not under Work Orders.

**Main screen — the overview.** Monday morning: what do I attack first. Three tiles, in consequence order, and nothing else:

1. **Expires this month** — compliance. Orange.
2. **Ready to book** — sellable today.
3. **Needs a reading** — information gathering, a different kind of call.

No fourth filler tile.

| Action | Opens |
|---|---|
| a tile | the list, filtered to that group |

**The list.** One dense table, one line per row, server-side paged and sorted, sorted by clicking a column header. One column set across all three groups; cells adapt, columns do not:

> `UNIT · CUSTOMER · WHY IT IS HERE · BUNDLED · VALUE · LAST CONTACT · LAST DONE AT · actions`

Group by customer is available, and beside a customer name a control filters the whole list to them. Getting back to the overview is a clear path, not only a browser back.

**Row actions.**

| Row | Primary | `⋯` |
|---|---|---|
| Ready to book | **Contact** · **Create WO** | Snooze · Ignore · Service history · Log call outcome · Open asset |
| Unit on site | **Add to WO S3780-15904** | as above |
| Needs a reading | **Contact** · **Request a reading** | Enter a reading · Open asset |
| Compliance | **Contact** · **Create WO** | Service history · Log call outcome · Open asset — **no snooze** |

The *unit on site* state reuses the existing **on-site / off-site control** from the work-order screen. Do not draw a new indicator.

| Action | Opens |
|---|---|
| `Contact` | the contact card |
| `Enter a reading` | the reading dialog |
| `Request a reading` | the message, pre-composed, for a person to send |
| `Create WO` | a work order carrying this service's lines |

**The contact card** — the hub, and under area 6 it is also where email lives.

- Every phone number. Fleet contacts routinely have two or three.
- The email address, **with a copy control**.
- **`Send reminder`** — opens the message, pre-composed from the template, for the advisor to review and send.
- **`Log call outcome`** — presets plus an optional note. Options include `Left a message`, `No answer`, `Booked`, `Declined`, **`Sent email`**.

Logging an outcome writes **Last contact**. That column is fed by this action, not only by sends — advisors ring people who do not answer, and the row must show what has been tried so nobody rings twice.

After an outcome is logged, offer the next step: `No answer` → `Send an email instead?`

---

## 4. The work order

Where the truck physically is. The only moment the shop has leverage it will not have again for months.

**Main screen — the maintenance section inside the asset card.** **Collapsed by default**, showing its count, expanding on demand. Chris: *"if you're on 10 different maintenance services, you're just going to create scrolling forever."*

Expanded, one line per due service. **No monetary totals, no hours estimates** on this card.

**Six states:**

1. `Maintenance · Highway Tractor PM · nothing due`
2. `PM-A · overdue by 1,200 mi` → **Add to this work order**
3. `PM-C · due now · absorbs PM-A, PM-B` → **Add to this work order**
4. `CVIP · expires end of September` → **Add to this work order** — orange
5. `PM-B · needs a current reading · last read 34 days ago` → **Enter a reading**
6. `Not on a maintenance programme` → **Add to programme**

| Action | Opens |
|---|---|
| hovering a due service | what it will add — the lines and the value — before anything is committed |
| `Add to this work order` | a confirm listing the lines, **and a second destination: `Create a new work order` instead** |
| `This was already done here` | the manual completion dialog — date and reading |
| `Enter a reading` | the reading dialog |
| `Add to programme` | the enrolment dialog |

**Adding lines is role-gated and must offer the second destination.** A technician with three hours left cannot absorb ten more lines. Follow the DVI pattern.

**A reading entered here re-evaluates the unit on the spot.** Not overnight — the truck leaves tomorrow. Draw the section in its changed state afterwards, with the row that just arrived saying so:

> `PM-A · due now · appeared just now, odometer updated 14:20`

**Completion.** One screen, two blocks:

- **What will be marked done** — prefilled, each item unticked-able, with the reason: `☑ PM-A · ☑ CVIP · ☐ PM-B — its lines were removed`. Includes the compliance certificate's month and year, skippable.
- **The enrolment nudge** — only where the work was maintenance-shaped and the asset is on no programme. One line, skippable, never modal.

**The Work Orders list** gains a `Maintenance programme` column. Where a work order came from a due service it names the programme and links to it; otherwise the cell is empty. This replaces a separate maintenance-history page — service history stays in one table.

---

## 5. The shop that does not use canned lines

**A hole nothing above covers, and it is Chris's.**

> *"Not everybody's going to use the canned lines. A lot of people just freeform type. They'll need to be able to manually trigger that they've done a maintenance service, possibly without even realising it."*

Location A runs maintenance properly. Location B does not — a unit turns up, someone types every line by hand, and in doing so performs the CVIP that A is tracking. Nothing links them, and A's record silently stays open on work already done.

The enrolment classifier is blind here: it recognises maintenance work by its canned line, and a freeform line has none.

So both completion paths must work **without a canned line ever being involved**: `This was already done here` on the work order (area 4), and `Complete` on the asset panel (area 2). Neither may scold. A shop typing freeform is not doing anything wrong.

**Completion travels across the organization.** A unit serviced at location B advances the schedules location A is tracking.

---

## 6. Where email actually stands — read this before deleting anything

**Email is not removed. Automatic sending is.**

Sasha, in the review: *"the debate for me is not should we email or not. We should. It's just, is it automated or not."* And: *"I think we should support email, but it should be a human choosing to do it."*

**What goes:**
- Any message leaving on its own to a customer.
- The email toggle on the programme and on the service. It was in the wrong place regardless — a customer's channel is a property of the customer, not of a maintenance policy.
- Campaign machinery built around automatic sending.

**What stays:**
- **Templates, merge fields, and the two-pane preview** (area 1b). A human still sends a real message.
- **`Send reminder` from the contact card** (area 3), pre-composed, reviewed, sent deliberately.
- **`Sent email` as a call outcome**, feeding Last contact.
- **`Request a reading`**, sent by hand from a row.
- **The shop digest**, which does send automatically because it is internal.
- **The welcome message** on enrolment — the customer has just said yes.
- **The audience view**, because knowing who has no address is useful whoever presses send.

**Two layers, and they must read as two things on the canvas:**

- **Enrolment is internal tracking.** On the moment an asset is enrolled. Feeds the worklist and the digest. Nothing leaves the building, so there is no consent surface.
- **Customer participation is separate and opt-in**, and it is **owned by the customer** — channel, cadence and consent all sit on the customer record, never on the programme.

On the customer record: how they want to be reached, whether they are in, and which of two cadences — **per unit when something is due**, or **a periodic summary across their whole fleet**, weekly or monthly, which is what a fleet manager with thirty trucks actually wants.

---

## 7. Delete from the canvas

| Delete | Why |
|---|---|
| Customer self-booking — the tokenised page, the three windows, the drag onto the schedule | Cut for v1. Being re-raised with Fabijan; keep it out of the canvas until that lands |
| A separate asset maintenance history page | Replaced by the work-order column, the gap line, and the printed compliance record |
| `Deactivate` and `Change programme` on the programme header | Pause and Remove cover it |
| `Edit` on the service row | Nobody could justify it |
| `Delete` anywhere | Archive only |
| Canned-line tags and categories | No line tagging exists in the data |
| Email toggles on the programme and service | Area 6 |
| Prediction toggles for inspection findings, parts history, customer behaviour, utilisation trends | They do not affect the maths — they only append labels to an explanation |
| A fourth overview tile | Three groups, no filler |

**Hallucinations seen in the last walkthrough — remove:** settings tabs rendered as *"Programs and Compliance types"* — they are **Programmes** and **Reminders** · an archive-menu item reading *"Move its 8 assets"* · an `Enter a reading` control where no reading is being taken.

---

## 8. Global rules

1. **No explanatory hint copy on any artboard.** No captions, no annotations, no "this shows…". That copy exists to explain the design to us, not to a user. Where a rule genuinely needs explaining to a user it goes **behind an info icon**.
2. **One line per row** wherever it fits.
3. **Existing design-system components only.** Do not invent controls. Known gap: the inline search control is not in the design system — draw it where it belongs and flag it rather than inventing a variant.
4. **Compliance is orange, never red.**
5. **"Template" appears nowhere.** The object is a **programme**.
6. Work-order numbers read `S3780-15904`. Distance in miles for this round.
7. **Every artboard belongs to a band** (see the layout rules at the top). Nothing floats.
