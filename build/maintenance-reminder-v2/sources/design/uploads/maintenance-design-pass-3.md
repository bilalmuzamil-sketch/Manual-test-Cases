# Pass 3 — the work order

*Paste this whole file into Claude Design. SV-3780 Maintenance Reminders.*

---

Rebuild the **work-order band**. The existing artboards are a starting point, but this surface was never properly specified until now — where they disagree with the spec below, **the spec wins**.

The core of it: a maintenance service is a **real work-order line** carrying its own labour and parts, and canned lines attached to it **nest beneath it as sublines**. Draw both shapes — the shop that writes PM-A as one line, and the shop that writes it as four — plus the mid-completion state where three of four sublines are closed and the service is still open.

The nesting treatment is **deliberately unsolved**. Draw two or three options and flag them for review. Do not pick one.

---

# The spec

## 4. The work order — the biggest change, and mostly new

The review spent most of its time here and the base handover barely covers it. `maintenance-design-prompt-work-order.md` is **partly superseded**: keep its six artboards as a starting point and amend them as follows.

### 4a. A service is a line

Draw the service as a **real work-order line**, at the same level as any other line, carrying its own labour and parts.

Two shapes, both required, drawn side by side:

**Shape A — the shop that does not model it.** One line, *PM-A*, four hours of labour on it, nothing beneath. This is the common case and it must need no configuration at all.

**Shape B — the shop that does.** One *PM-A* service line with its four canned lines — oil change, grease, fuel filter, inspection — **nested beneath it as sublines**, each carrying its own labour.

> *"Everybody has a different concept of what a PM-A is. Every shop's PM-A is different from the next shop's. There's no standardisation for this."*

**The nesting treatment does not exist and this is the one thing in this document that is genuinely an open design problem.** It was agreed as necessary and never drawn. Constraints: it must survive a line being added or removed; it must not look like a new line type; and the service line must still read as completable in shape A. **Draw two or three options and flag them for review rather than picking one silently.**

### 4b. Three ways a service reaches a work order — draw all three

1. **From the worklist** — `Create estimate` on a due row. Already drawn; only the label changes.
2. **From the line search — new.** The control that finds canned lines when adding a line must also find maintenance services. *"It should search canned lines when you're adding a line — it should search maintenance reminders."* Draw the picker with both kinds of result in one list, visually distinguished. This entry point was missing entirely, and its absence meant the only way to attach a service was to leave the work order.
3. **From a prompt on work-order creation — new.** Creating a work order for an enrolled asset shows what is coming up, roughly a three-month horizon, with the due date on each row and a checkbox. *"Would you like to add them?"*

**The prompt has no proximity condition, and that was an explicit override.** Do not grey out, warn on, or gate anything in that list. Everything in the horizon is addable. *"You have a scenario where the customer is like, oh yeah, just get her done, it's in the shop, I'll do it all."*

### 4c. Completion

**The split rule, and it must be legible on the artboard:**

- a service line with **no** sublines completes when that line completes
- a service line **with** sublines completes when **every** subline completes

Draw the second state mid-way — three of four sublines closed, the service still open — because that is the state a technician will actually see and it is the one that has to explain itself without copy.

**The completion step is skippable.** Nothing here may block closing a work order.

**Compliance completion may write more than one record.** A work order closing both a CVIP and an emissions inspection asks for details **per record**, not once for the work order. The existing single-certificate artboard needs a two-record variant.

**Add line completion dates.** Each closed line stamps the date it closed, and that date is visible on the work order. Small, and it is the data that would later justify or overturn the reset anchor.

### 4d. What a declined service looks like

A service added to an estimate the customer declines **resets nothing and stays due**. Draw it: the line declined on the work order, the service still sitting on the worklist. No warning, no special state, no revival prompt.

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
