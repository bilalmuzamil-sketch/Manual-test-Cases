# Maintenance Reminders — Design Brief (SV-3780)

A screen-by-screen brief for design work. Companion to `maintenance-reminders-design.md`, which holds the reasoning and the decisions; this file holds only *what needs designing, where it sits, and which states it must cover*.

**Product context in one paragraph.** ShopView is a shop-management platform for heavy-duty truck and equipment repair shops in the US and Canada. Maintenance Reminders tells a shop when a customer's unit (tractor, trailer, mixer, genset) is due for preventive maintenance, so the shop can book the work before it lapses. The primary user is a **service advisor** whose Monday-morning job is "what work can I book into this week's empty bays, and who do I call to get it?" A proof of concept exists and is functionally broad but has no coherent flow; this brief covers the redesign.

**Existing app conventions to match.** Vue 3 + Quasar 2. Existing surfaces to use as visual reference: the **Technician Efficiency** report for tab strips, **Inspection Templates** (`administration/inspection-templates`) for a settings-based template page, the **work-order list row** for status pills and count badges, and the shared filter kit (`PageSearchInput` + `FilterBar` chips) for any filtering. Light and dark themes both required.

---

## Screen inventory

| # | Screen | Status | Priority |
|---|---|---|---|
| 1 | Settings → Maintenance programs — list | **NEW** | 1 |
| 2 | Settings → Maintenance programs — program editor | **NEW** | 1 |
| 3 | Work Orders → Maintenance tab (two zones) | **NEW** | 1 |
| 4 | Work Orders → tab strip count badge | CHANGED | 1 |
| 5 | Asset → Maintenance tab — enrolment dialog | CHANGED (rewrite) | 2 |
| 6 | Asset → Maintenance tab — panel | CHANGED | 2 |
| 7 | Work order → asset card → maintenance section | CHANGED | 2 |
| 8 | Work-order completion — enrolment nudge | **NEW** | 3 |
| 9 | Reminder delivery settings | CHANGED (simplify) | 3 |
| 10 | Digest email to the shop | **NEW** | 3 |
| 11 | Customer reminder email (batched) | CHANGED | 4 |
| 12 | Customer booking page (tokenised, no login) | **NEW** | 4 |
| 13 | Customer page → maintenance card | CHANGED (minor) | 4 |
| 14 | Reports → Maintenance | CHANGED (becomes read-only alias) | 4 |
| 15 | Front-of-app maintenance banner | **DELETED** | — |
| 16 | Reports → Maintenance → Plans tab | **DELETED** (moves to #1/#2) | — |

---

## 1. Settings → Maintenance programs — list

**Route:** `administration/maintenance-programs`, in the Settings left-hand menu near Inspection Templates and Vehicle Types.
**Job:** show the shop's PM standards. Visited rarely — three to six programs total, created once and edited occasionally.
**Where it sits:** a settings page with the standard settings chrome. Direct sibling of Inspection Templates; copy that page's structure so the two read as the same family.

**Content per row:** program name; the asset classes it is bound to (chips, e.g. "Tractor", "Light Truck"); the meter it runs on (Odometer / Engine hours / Calendar); number of tiers; whether it contains a compliance tier; the calendar backstop interval; how many assets are currently enrolled on it.

**Actions:** New program. Per row: edit, duplicate, archive. Archive must warn when assets are enrolled.

**States to design:** empty (no programs yet — this is the first-run state for every shop, so it should invite creating one and explain in a sentence what a program is); 3–6 rows (the normal state); one program with an archived badge.

**Note for the designer:** "enrolled assets" is the number that makes this page feel consequential — a program with 40 units on it is a policy, not a draft. Give it visual weight.

---

## 2. Settings → Maintenance programs — program editor

**Job:** define one PM standard. The hardest screen in the feature and the one that most needs design.

**What a program is:** a name; the asset classes it applies to; one meter (odometer, engine hours, or calendar only); a **mandatory** calendar backstop ("tell us anyway every N months"); and an **ordered list of tiers**.

**What a tier is:** a name (typically A, B, C, D but free text); an interval expressed in the program's meter (e.g. every 25,000 km, or every 750 hours, or every 3 months); an optional own calendar interval; an **ordered list of canned lines** (the priced, described jobs — a tier may carry one or nine); an advance warning ("start showing this as due N days / N km early"); and a toggle for whether the customer is emailed when it comes due.

**Two kinds of tier, and they look different:**

- **Routine** — the normal case. Tiers nest: when tier C comes due it absorbs A and B, so the unit gets all three checklists in one visit. The editor should make the nesting legible — the reader must be able to see that C is "bigger than" B which is "bigger than" A, and that ordering carries meaning.
- **Compliance** — a legal inspection (US annual §396.17, Canadian CVIP). Calendar only, no meter. Holds a term (12 months) and a **buffer** (1 month), because the practice is to schedule at 11 months so the certificate never expires while the unit waits for a bay. It never nests and can never be snoozed past its deadline. This kind must be visually distinct from routine tiers — it carries a different consequence: missing an oil change costs money, missing a CVIP puts the truck out of service.

**States to design:** new empty program; a program with four routine tiers and one compliance tier (the realistic full state); a tier being reordered; validation state where the calendar backstop is missing; and the **blast-radius confirmation** — when an interval changes on a program with enrolled assets, saving must show "this moves 40 assets" before committing.

**Note for the designer:** the temptation is a long single-column form. The tier list is the real content — it wants to read like a structured list of increasing scope, with the program-level settings compact above it.

---

## 3. Work Orders → Maintenance tab

**Route:** a fifth tab on the Work Orders page — `All / Estimates / Work Orders / Completed / Maintenance`.
**Job:** the advisor's daily workbench. This is the most important screen in the feature and the one they open every morning.

**Two zones, in this order:**

**Zone 1 — "Due" (units with no work order yet).** This is the notification surface; it is not a work-order list. **One row = one unit = one proposed visit**, bundling everything due on that unit inside the window. A row carries:

- the unit first (unit number, then make/model), customer second
- how many services are in the bundle
- total value and total estimated hours
- the reason it is here, in plain words — "CVIP expires 14 Oct", "PM-B due in ~900 mi (est. 8 Sep)", "Quarterly trailer PM due 2 Sep"
- when the reading behind an estimate was last reported, and how confident the estimate is
- actions, in this order: **Send** (batched email to the customer), **Call** (the customer's phone number printed, not hidden behind an icon), **Create estimate**

The send-then-call order is deliberate: the advisor emails, waits three to five minutes, then calls so they can open with "look at the email I just sent you". The phone number must be readable and copyable without opening anything.

**Zone 2 — "In progress" (maintenance-originated work orders).** Real work orders in `estimate` / `approved` status that came from maintenance. Ordinary work-order row treatment. A row that arrived from a customer's own booking request carries a distinct marker — a human is waiting on it.

**Row variants that must be designed, because they are common not exceptional:**

- **Compliance urgency** — a unit whose certificate expires soon or has expired. Sorts to the top. Needs its own severity treatment, separate from ordinary "overdue".
- **"Needs a current reading"** — a meter-triggered unit whose reading is missing, stale or implausible. It has **no due date and no value**, so the row cannot show the usual numbers. Its action is "call for a reading", not "create estimate". This state must never render as a blank or a dash — a blank reads as "working, nothing due", which is the exact failure the design refuses to ship.
- **Estimated, low confidence** — the projection exists but rests on one data point or a stale reading. The row shows the estimate *and* its weakness in the same glance.

**Filtering:** the shared filter kit only (`PageSearchInput` + `FilterBar` chips). Filters wanted: customer, due window, compliance-only, and needs-a-reading.

**States to design:** normal (a dozen rows across both zones); zone 1 empty but zone 2 populated; **both empty because no asset is enrolled on any program** — this is the true first-run state and must say "no assets are on a PM program" with a route to enrol them, never "no data"; loading; and a dense state (50+ rows) that stays readable.

---

## 4. Work Orders → tab strip count badge

**Job:** the only ambient signal in the whole feature. There is no bell notification and no banner, by decision — this badge carries it alone.

Shows the count of units in zone 1. Compliance urgency should be distinguishable from an ordinary count. The existing pills on work-order rows (the small red and blue count badges next to the status) are the pattern to match — the badge must look like it belongs to this app, not like a new invention.

**States:** zero (badge hidden, not "0"); a small number; a large number; a number that includes compliance urgency.

---

## 5. Asset → Maintenance tab — enrolment dialog

**Where:** Customers → asset → Maintenance tab → primary action. Also reachable in bulk from the asset list and the customer page, and from the work-order completion nudge (#8) — **one dialog, three entry points.**
**Job:** put this unit on a PM program. Performed constantly, so it must be short.

**This replaces a ten-field dialog with roughly three inputs:**

1. **Program** — a dropdown. Pre-selected when the asset's type is known; the asset's type is populated on only about three in ten assets, so **an empty pre-selection is the normal state, not an error**, and a missing type must never block enrolment.
2. **Current meter reading** — pre-filled from the asset, editable, showing when it was last reported.
3. **Last service** — optional. When blank, counting starts today, and the dialog must say so rather than leaving the user to guess.

**The critical element: a live threshold preview.** As the program and reading are chosen, the dialog shows the thresholds it will create — "reads 217,649 → A at 227,649 · B at 242,649 · C at 267,649". This exists because the current build asks for an *interval* in a field that sits beside a current reading, and users reasonably read the number as a *target*. The preview removes the ambiguity by showing the arithmetic.

**Conditional element:** if the chosen program contains a compliance tier, the dialog must ask for the **current certificate date** and cannot save without it.

**Escape hatch, two variants by permission:** a user who can edit settings sees "No suitable program? **Create one**", which goes to Settings and returns to this asset with the new program pre-selected. A user who cannot sees "**Request a program**" — a short form (what is needed, which asset class, which interval) routed to an admin. Design both; the second must not feel like a dead end.

**States:** no programs exist yet; program pre-selected; nothing pre-selected; compliance date required and missing; asset has no reading at all; asset has an implausible reading (see note below); bulk mode with twelve assets selected.

**Note on implausible readings:** a real example from the current data is a 2004 Ford F-350 showing 217,649 miles and **11 engine hours**. The system rejects readings that are implausible, not only ones that are empty — so the dialog needs a state that says "this reading doesn't look right, confirm or replace it" without accusing anyone.

---

## 6. Asset → Maintenance tab — panel

**Job:** show this unit's PM position. Currently a flat table of independent services; it should show the **program** the unit is on and its tiers underneath, with each tier's next due point, last completion, and status.

Per-row actions already exist and stay: complete, pause, snooze, create work order, edit, activity log, delete. Two changes: **snooze must be unavailable on a compliance tier** (it cannot be pushed past its deadline), and the row must show "Needs a current reading" where a due point would go when the reading is missing.

**States:** not enrolled (invitation to enrol); enrolled on one program; enrolled on two programs, e.g. the shop's standard plus a customer-specific one; a paused tier; a compliance tier close to expiry.

---

## 7. Work order → asset card → maintenance section

**Where:** inside the asset card on an open work order, in its footer. **This already exists and works well** — a collapsed summary bar ("Maintenance: 1 overdue, 3 upcoming") that opens to list each due service with its line total, one click to add it into this work order.

**What changes:** services group **by program** rather than as a flat list; nesting is applied so a lower tier is not offered when a higher one is already going in; and duplicate canned lines across two programs are merged so the unit does not get its oil changed twice on one work order. Each service still shows its labour + parts total before it is added, and "Not priced" rather than "$0.00" when nothing is priced.

Keep it collapsed by default and neutral in tone — it is not an alert, it is an opportunity while the truck is already here.

---

## 8. Work-order completion — enrolment nudge

**Where:** the work-order completion flow.
**Job:** the single best moment to enrol a unit, because the asset, the reading, the date and the work just performed are all already on screen. If the unit is not on a PM program, one compact row offers to put it on one, with the program suggested from the asset type and the last service pre-filled from this work order.

**Design constraint:** it must be genuinely small and skippable. Completion is a flow with its own goal; this is an aside, not a step. One line, one action, dismissible without explanation.

---

## 9. Reminder delivery settings

**Job, narrowed.** Today this screen mixes *what to warn about* with *how to deliver it*. All the "what" moves to the program (#2). What remains here is delivery only:

- which **role** or shop mailbox receives the morning digest — never a named individual
- digest frequency
- who is CC'd on customer emails
- the customer-email wording, with insertable merge fields and a revert-to-standard action (this part already exists and works)

**States:** default; several recipient addresses; custom wording versus standard wording.

---

## 10. Digest email to the shop

**Job:** one email each morning to a role or shop mailbox, so an advisor who has not opened the app still knows what to chase. **One email per day maximum.**

**Content:** a headline count and total value; compliance deadlines first, as their own block; then units due, each with its unit number, customer, what is due, value, and **the customer's phone number**; and a link into the Maintenance tab. The advisor must be able to start calling from the inbox without opening the application — the phone numbers are content, not decoration.

Must survive the usual email-client constraints and read correctly on a phone, since this is often read before the advisor is at a desk.

---

## 11. Customer reminder email (batched)

**Job:** tell a customer what their units need. Sent from the shop's name.

**The one hard rule: one email per recipient, listing all of that recipient's units.** The current build sends one email per due service, which means a customer with sixty units can receive sixty emails. Batching is the fix and it is structural, not cosmetic.

**Content:** a short opening in the shop's own wording (shops write this themselves); then a block per unit — unit number, what is due, when, and the projected reading where relevant; then the booking call-to-action (three suggested windows, see #12), a "none of these work, call me" option, and the shop's phone number.

**States:** one unit; six units; a unit that is a compliance deadline (different urgency of language); custom shop wording versus the standard wording.

---

## 12. Customer booking page (tokenised, no login)

**Job:** let a customer say when it suits them, without an account. Reached from a link in #11. There is an existing precedent in the app — customers already authorise work orders from a tokenised link — and this page should feel like a sibling of that.

**Framing that must come through in the design: this is a request, not a confirmed booking.** The shop confirms afterwards. The page must never imply a slot is secured, because the shop cannot guarantee one.

**Content:** the units and what is due on each; the estimated duration; **at most three suggested windows at day granularity** — morning or afternoon, never an exact hour, because a shop cannot honour "10:00 sharp"; a "none of these work, call me" path with the shop's phone number; and a confirmation state that is honest about what happens next ("the shop will confirm").

**States:** three windows offered; the request submitted (confirmation); the token expired; the work already booked by someone else in the meantime.

**Audience note:** the reader is a fleet manager or an owner-operator, often on a phone, often in a yard. Large targets, minimal text, no login, no app.

---

## 13. Customer page → maintenance card

Already exists — a high-level count on the customer page. Small change only: it should link into the Maintenance tab **pre-filtered to that customer**, and show compliance exposure separately from routine work, since that is the number a fleet manager asks about.

---

## 14. Reports → Maintenance

The current home of the feature. It stays as a read-only report view for people who look for it under Reports, but it is no longer the working surface and the Plans tab is removed from it (authoring moves to #1/#2). Keep the print and CSV export, which already work.

---

## 15–16. Deleted

- **The front-of-app maintenance banner** on the Work Orders page. Removed: the Maintenance tab is a few pixels away, and two signals for one thing is noise. Nothing transient replaces it — a toast on every landing has the badge's noise problem and is gone by the time anyone looks for it.
- **The Plans tab under Reports.** Authoring moves to Settings, beside Inspection Templates.

---

## Cross-cutting requirements

**Copy that must appear verbatim, because each replaces a silent failure:**

- "**Needs a current reading**" — wherever a due point would go on a meter-triggered service with no usable reading. Never a dash, never blank.
- "**Not priced**" — where a line total would go and nothing is priced. Never "$0.00".
- "**No customer record**" — where a customer name would go and the record is missing.

**Three data realities the design must absorb rather than assume away:**

1. **Asset type is populated on roughly three in ten assets.** Any flow that depends on knowing the asset class needs a graceful unknown state.
2. **Readings are often stale, and sometimes wrong.** A reading is only refreshed when a human types one, and the routine moment for that is a visit — so a unit that comes in twice a year carries a six-month-old number. Freshness ("last reported 34 days ago") and confidence belong beside every projected date.
3. **Compliance and convenience are different consequences.** Design them as different, not as two values of one severity scale.

**Also required throughout:** light and dark themes; every interactive element carries a `data-test-id`; wide tables scroll inside their own container rather than the page; and dense states (a fleet customer with 60 units) stay readable.
