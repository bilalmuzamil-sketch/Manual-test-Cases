# Pass 2 — restore, then amend the existing screens

*Paste this whole file into Claude Design. SV-3780 Maintenance Reminders.*

---

Two things, in this order.

**First, the restore section.** Pass 1 deleted three things it should not have. Put them back before anything else — if your history allows restoring the original artboards, do that rather than redrawing them.

**Then, a surgical amendment pass** across four bands: **Settings → Maintenance programmes**, **Settings → Reminder settings**, **the asset band**, and **the worklist band**.

Every change is listed below. **Anything not named stays exactly as drawn** — do not redesign, do not tidy, do not restyle.

When you finish, report the restores separately from the amendments.

---

# The spec

## R. Restore — corrections to pass 1

**Pass 1 carried three delete instructions that were wrong.** They came from over-reading the review transcript and were caught afterwards. Restore the following before doing anything else in this pass. If your canvas history allows it, restoring the original artboards is better than redrawing them.

| Restore | What was wrong | What it should be now |
|---|---|---|
| **The digest email artboard** | Pass 1 said the shop digest leaves the feature. The remark it was based on was aimed at a *generic shop-wide digest with no connection to assets* being configured as a campaign here — not at the maintenance digest | **The maintenance digest stays and is v1.** Weekly, internal, to the service advisor. Unit, programme, customer, phone number. Restore it, and place it in the Reminder settings band as one of three fixed messages |
| **The welcome / enrolment message artboard** | Pass 1 said it was cut at the review. It was not. What was said is that its **trigger** is unclear — *"you have to kind of understand how you define that so it makes sense"* | **Restore it and mark it as an open question** (§8). Draw the message. Do not draw a sequence, a journey, or anything implying a second message follows it |
| **The Reminder settings message list**, if pass 1 emptied it | Pass 1 implied the tab should hold one message | **Three fixed messages:** service reminder · overdue follow-up · maintenance digest. Plus the welcome message, flagged open. Editable, **not creatable** |

**Still correctly deleted — do not restore these:** `Request a reading` · campaign creation controls · per-campaign recipient management · the call-outcome picker · the nav badge · customer self-booking.

## 2. Settings → Services → Maintenance programmes

### 2a. The service form — two changes

**Add a calendar interval field, required, whenever a meter trigger is ticked.**

The base handover has *distance · engine hours · calendar* as checkboxes with one interval each. That stands. What is new: ticking **distance** or **engine hours** makes a calendar interval **required as well**, on the same row, joined by *or*.

```
Trigger    [x] Distance   every [ 15,000 ] miles
                          or every [ 6 ] months          ← new, required
           [ ] Engine hours
           [ ] Calendar
```

It is **asked, never assumed** — *"I don't think you should do it silently. I think you should make them pick it."* Do not prefill it, do not grey it, do not add a "we'll work it out for you" affordance. If a meter is ticked and this is empty, the service cannot save.

Beneath, unchanged from the base: `15,000 mi · for this unit, about 15 September`, with its source. The derived date is display. The calendar interval is a hard trigger. **Due at whichever arrives first** — the base handover's yellow "whichever comes first" note now applies to every meter service, not only the multi-trigger ones.

**Add an automatic-send toggle**, at the end of the form, after the reminder schedule:

```
Send reminders automatically   [ on / off ]
Send to    ( ) the shop   ( ) the customer   ( ) both
```

This is a **reinstatement**. The base handover's area 7 told you to delete the email toggles from the programme and the service. That instruction is **half withdrawn**: the toggle comes back **on the service** and stays deleted **on the programme**. Automation is a property of a service — a shop may automate PM-A reminders and hand-send compliance ones — and never of a programme.

**Do not add a one-time / recurring control.** It was raised and withdrawn in the same exchange. Every service recurs.

### 2b. The form sequence, final

name → is this compliance? → trigger → intervals → **calendar interval, if a meter was ticked** → canned lines → reminder schedule → automatic send

### 2c. The compliance branch — confirmed, plus one field rule

Compliance keeps its own flagged type. An alternative was floated in the review — drop the flag, make *term* just another trigger — and not taken. Nothing changes in the branch itself.

One rule to reflect in the form: **the certificate-number field must not be labelled "certificate number".** Its label follows the compliance type, and where a type has no such artefact the field does not render at all. *"Different inspections and different jurisdictions might call them different things. They might not include a certificate."*

Draw it as a labelled-by-type field, not as a hardcoded string.

---

## 3. Settings → Services → Reminder settings

The base handover's area 1b survives, with its meaning restored rather than changed.

**The reminder schedule rows drive the customer's mail again.** The base handover reframed them as internal timing, because there was no automatic customer send left for them to drive. There is now. The one-line explanation under the control must say **both things**:

> *When the customer is reminded, and when this appears on your worklist.*

Everything else about the control is unchanged: one merged before/after list · unlabelled rows · three by default · hard ceiling of five · the worked example beneath it.

**One correction the review made explicitly:** a row's unit follows its trigger. A distance-triggered service takes `1,000 miles before`, not `14 days before`. Do not draw a service showing days and miles mixed on one schedule.

**Delete from this tab:**

| Delete | Why |
|---|---|
| **Campaign creation** — any `New campaign` / `Add message` control, and the campaign list drawn as an extensible list | A shop edits the messages it has and cannot add more. *"We have them pre-populated. They can't create new ones."* |
| **Per-campaign recipient management** drawn as part of a campaign | The audience view stays as its own thing; managing recipients per campaign does not |
| The **Request a reading** message and its email artboard | Cut in the room, by Milos: *"I have this request of reading, but I will remove this."* The reading cascade covers it |

**What is left, and it should look small — three messages, fixed:**

1. **Service reminder** — the initial one, to the customer
2. **Overdue follow-up** — to the customer
3. **Maintenance digest** — weekly, internal, to the service advisor. Unit, programme, customer, phone number. A worklist in an email

Plus the **welcome / enrolment message**, which stays on the canvas as an **open question, not a message you should finish**. Its trigger is unresolved (§8). Draw it flagged.

The tab should end up reading as a settings tab rather than a campaign console. If it still looks like a marketing tool, it is wrong — but **do not confuse "fewer messages" with "one message".** There are three, and they are not creatable.

---

## 5. The asset → Maintenance tab

Two changes.

**Add a Certificates tab on the asset.** *"You need to have another tab on asset called certificates, and it's just a list of certificate records that we create."* A flat list of compliance records — type, effective date, expiry month, term, the type-labelled number, and an **optional single file attachment**, reusing the DVI attachment component. Records exist with or without a programme; the empty state should say so rather than pointing at programmes.

**The reset anchor.** Wherever a completed service shows its date — *last completed*, the history line — that date is the **invoice date** of the work order that closed it, not the line completion date. Label it so the two cannot be confused, because 4c now puts line completion dates on the same screen family.

Everything else in the base handover's area 2 stands, including the flat date-sorted list with the programme as a column. The review re-confirmed it: *"I don't want to have to scroll a bunch of programmes and then, in my head, aggregate all the ones that are upcoming."*

---

## 6. Customers → Maintenance reminders — the worklist

Three changes.

**The location column is conditional.** It renders only for an organization with more than one workplace. Draw **both** variants — with and without — and treat the single-location one as the default, because *"90% of our customers are just one location."* That is also where the width for the action column comes from.

**Delete the nav badge.** The count on Customers in the sidebar goes. Nothing in the feature drives the count back towards zero, so within a month it reads a permanent number and stops meaning anything.

**Nothing replaces it yet, and this is an open design problem.** The need is real — nothing outside this tab tells an advisor there is maintenance work waiting. Whatever replaces it **must have a natural resting state of zero.** Candidates worth sketching, none chosen: *overdue this week* rather than *overdue* · the compliance cohort alone, which does empty every month · no badge at all, on the grounds that the weekly maintenance digest already carries the nudge. **Sketch, flag, do not pick.**

**The contact card.** The `Send reminder` button becomes **`Resend`** with `last sent <date>` beside it whenever a message has already gone — *"somebody calls up and says, I can't find that email, can you resend it to me."* Where nothing has been sent, it reads `Send reminder` as before.

**Delete call-outcome logging** — the outcome picker after a call, *no answer* / *left a message* / *booked* / *declined* / *sent email*, and anything branching from it. *"Is it cool? Yes. Would it work? Yes. But it's a bunch of extra stuff for them to do."* `Last contact` survives as a plain timestamp.

---

---

# Standing rules — these applied before this pass and still apply

## Standing canvas layout rules

**One band per surface**, labelled, stacked top to bottom in the order of this document.

Inside a band: **the main screen on the left. Everything its actions open, to its right, in a row, in the order the actions appear on the screen.** A modal sits immediately right of the screen that opens it. A modal that opens another modal sits right of that one.

Beside each connector, **name the action that causes it** — `Add service`, `Contact`, `Enter a reading`. A reviewer must be able to read a band left to right and understand the whole flow without opening anything.

Component states — the six states of the reading field, the six of the work-order card — go in **one row, in the order given**, directly beneath the screen they belong to.

Nothing floats unattached. If an artboard cannot be placed in a band, it does not belong on the canvas.

---

## Standing global rules

1. **No explanatory hint copy on any artboard.** No captions, no annotations, no "this shows…". That copy exists to explain the design to us, not to a user. Where a rule genuinely needs explaining to a user it goes **behind an info icon**.
2. **One line per row** wherever it fits.
3. **Existing design-system components only.** Do not invent controls. Known gap: the inline search control is not in the design system — draw it where it belongs and flag it rather than inventing a variant.
4. **Compliance is orange, never red.**
5. **"Template" appears nowhere.** The object is a **programme**.
6. Work-order numbers read `S3780-15904`. Distance in miles for this round.
7. **Every artboard belongs to a band** (see the layout rules at the top). Nothing floats.

---

## 8. What is still open, so you do not resolve it by accident

Draw around these; do not invent an answer.

1. **Who receives the reminder.** The asset's preferred contact, or contacts mapped to groups of a customer's assets. Being decided against real data. **Draw the reminder going to *a* contact and do not draw a contact picker.**
2. **Unsubscribe.** Mandatory, and the mechanism is unspecified — what it suppresses, and where a customer manages it. **Draw the footer link and nothing behind it.**
3. **The subline nesting treatment** (area 4a). Options, flagged.
4. **A replacement for the nav badge** (area 6). Sketches, flagged.
5. **The welcome / enrolment message.** Not cut — its **trigger** is unresolved. Draw the message flagged as open; do not draw a journey, a sequence, or anything that implies a second message follows it.
6. **The name for a worklist row.** "Reminder" currently means the row, the message and a schedule step. Proposal on the table: **due service**. Until it is ruled, **do not label the row anything at all on the artboards** — a heading that has to be renamed on every board is exactly how the last two reviews lost half an hour each.

---
