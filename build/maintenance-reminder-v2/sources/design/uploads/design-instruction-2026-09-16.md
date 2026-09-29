# Maintenance Reminders — design update after the 15 September review

Source of truth is the Confluence spec, page 833290250, **version 7**. Where this
instruction and any earlier handover disagree, this one wins — several things below
reverse decisions from the session-6 bundle, which was written before the review.

Work **chunk one only**: settings, the asset tab, enrolment, the worklist and the
work-order panel. The customer email is chunk two and is not part of this pass.

---

## 1. Terminology — one global rename

`regulated` becomes **`compliance`** everywhere: headings, the toggle
`Is this a compliance inspection?`, every row, every label, every artboard title.
Cody asked for it and it reads less punitive than `regulated`. The asset tab keeps
the name **Certificates** — the artefact is still a certificate.

**Do not** put a `Compliance` tag on rows. The tags look wrong and the service name
plus its due date already identify it. Remove the tag from the worklist row, the
asset row and the work-order panel row.

---

## 2. The email — most of it is cut

Three emails become **one**.

The reason is worth carrying, because it will otherwise be re-proposed: one unit
can be upcoming, due today and past due at the same moment. With three emails an
owner opens three messages to find out about one truck.

- **One hardcoded email.** Wording fixed, identical for every shop.
- Phrase it so it holds for any mix and **never needs a singular and a plural
  version** — something in the shape of *"you have some preventive maintenance we
  want to remind you about"*, followed by the table.
- Each table row carries the unit, the service and the due date, with its state
  on the row.
- **No unsubscribe link.** Honouring one properly is consent management and that
  is its own feature.
- The footer states why the customer received it, and stops there.

**Delete the entire Reminder settings screen** and its editor: `[r1]` `[r2]`
`[r1e]` `[r3p]` `[r4]` `[r5]` `[r5b]` `[r6]`. With no editable content there is
nothing for the page to hold. Settings now carries **one** list, not two tabs.

Keep **one artboard of the email itself**, rendered as it would look in a mail
client, so it can be built.

---

## 3. Consent moves to the customer

New, and it is not drawn anywhere.

A setting on the **customer record**: `Send preventive maintenance notifications`.

It is deliberately **not** on the asset and **not** part of enrolment. A shop wants
to see that a unit is coming due even when that customer does not want email —
those are two different things and they need two different switches.

The enrolment modal **shows** it, with its current value, and makes plain that it
belongs to the customer rather than to this asset. It does not default it.

---

## 4. Enrolment modal — lighter

Remove:
- **Both current-reading fields.** The asset header and the work order already
  carry them, and collecting them here raises the question of whether that counts
  as a new recorded reading. It should not arise.
- **The live `Comes due` column.** The advisor does not need the arithmetic while
  filling the form; the asset page does it immediately afterwards.
- **The running type control.** It belonged to an idea that was tested against
  production and dropped.

Keep the schedule, the services, and one optional last-service date per service.

Add: where a service watches a meter the asset has no reading for, its row carries
a **`Not enough data`** badge, **per meter** — distance and engine hours
separately. Reuse an existing badge if one fits.

Add: a **bulk enrol** reached from a customer's own asset list. It is a selection
of which units go on which schedule, not an enrol-the-whole-fleet action, because a
fleet holds different kinds of unit.

---

## 5. Confidence — three levels and a separate state

Confidence is **`Low` · `Medium` · `High`**. Colours: low orange, medium blue,
high green.

**`No data` is not a fourth level.** It is a separate state, for a unit with
nothing to estimate from: the calendar governs and the row says the meter has no
basis yet. Draw it, because it is the ordinary case rather than an error.

Reading state stays **recorded** or **estimated** and shares none of those words.

An exact date belongs to a recorded reading alone. Everything computed shows a
month.

**A rate never names a unit.** `640 a week`, or `accrues 640 a week`. Not
`640 mileage a week` — mileage describes a unit's history, not a speculative rate.

---

## 6. Mileage — settled, with one exception

The distance unit is the word **`mileage`**, written in full. `mi` and `km` never
appear: a single unit covers both, and `mi` would claim one of them.

The exception is the rate above, where the word comes out entirely.

Inside a section already titled Mileage, the value does not repeat the word.

---

## 7. Readings on the asset

- Drop the **`Readings`** section title. It is obvious what is being looked at.
- Card titles match the title of the table below them, in the same size and
  spacing. They currently do not.
- **New rule to reflect:** two things count as recording a reading — a user
  changing the mileage on a work order, and the work order being **invoiced**.
  Whatever the mileage is at the moment of invoice becomes the new last recorded
  reading. Draw the state where an asset is in the shop today and the recorded
  value has just moved.

Remove for now: the implausible-value screen, the lower-reading screen, and the
`Cannot be judged` state.

---

## 8. The work-order panel — the reconciliation

The largest addition in this pass, and it answers a question that has been open
since the bundle was written.

A work order can satisfy a maintenance service **however it was built** — by adding
the service's canned lines, or by someone typing the lines by hand.

So every row on the panel offers **two** ways to satisfy it:

1. **`Add`** — brings the service's canned lines onto the work order.
2. **`Already addressed on this work order`** — a plain statement by the advisor.

Either one marks the row **addressed on this work order**. The service then resets
when the work order is invoiced, on the same rule as any other completion.

**Nothing infers a match.** Do not draw anything that suggests the system reads
line text or recognises a canned line as a preventive-maintenance item. The
advisor says so; the system does not guess. Getting clever here is how it breaks.

Where a service carries more canned lines than fit, the row reads as **one
summary** — `4 lines · $412.60 · 2.1 hrs` — rather than listing them. That summary
is the main content of the row; the individual lines come off.

When a new reading makes something newly due, it has to be **visible on the card in
real time** — a pulse or a tone change, not an alarm.

---

## 9. Screens to fix

**Schedule creation.** Remove the sentence *"This choice is made once. It cannot be
switched after."* It is not true and it is not needed.

**Archive confirm.** Rewrite to plain language:
> Archiving deactivates the schedule. Eight assets are currently enrolled in it,
> and reminders will not be sent.

**Editing a service.** It needs the same shape as the remove-service screen — a
before, an after, and the outcome. The outcome line is that assets already enrolled
do not change; assets enrolled from now on get the new version.

**Compliance term** is mandatory. There is no state where a compliance service has
no term, so `No record` in the `Comes due` cell is wrong — the term is always known.

**`Comes due` is inverted between row types.** On routine services the trigger is on
top and the date below; on compliance rows the date is on top and the trigger below.
Pick one and use it everywhere. Given the column is called Comes due, the date on
top is the likelier right answer.

**`Comes due` only ever shows one trigger.** Draw the two-trigger and three-trigger
cases — distance, engine hours and calendar together — and show which one the system
expects to fire first.

**Asset column.** Draw the variant with **no unit number**. Not every unit has one.

**The tiles.** The font sizes are wrong: `assets` is tiny, the dollar sign appears on
some and not others, `due in a month` is too small. Look at what reports and the
dashboard do and match it.

**Contact card.** Remove `preferred contact` from it. Remove the `send a reminder`
block. `Resend` keeps its confirmation step — the friction is deliberate, so nobody
fires an email with one stray click.

Roughly **55% of customers have no phone and no email**. Clicking that empty state
opens a small modal reusing the existing add-contact-information field, rather than
sending the advisor somewhere else.

**Canned lines empty state** in settings comes out. Canned lines cannot be created
from there, so the shop is never asked.

**Customer records page** comes out for now.

---

## 10. Cut entirely

**Dormant units.** The whole thing: the quiet line under the worklist, the review
flow, the bulk unenrol by customer, the units-without-a-visit area. It was hiding a
significant action at the bottom of a list, and it is gone from the spec too.

---

## 11. Housekeeping

Strip the explanatory subtext that has crept back in. No sentences under headings,
under fields, or beside controls. A rule the user needs goes behind an info icon.

Clear the change log. From handoff onward it carries only what changed after
handoff.

Keep the page split that was introduced — schedules, assets, workplace, work orders,
customer records, and the rules spine — one page per section plus one carrying every
artboard.
