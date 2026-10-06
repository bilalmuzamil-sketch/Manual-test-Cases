# Pass 1 — rename, delete, and the object spine

*Paste this whole file into Claude Design. SV-3780 Maintenance Reminders.*

---

Amendment pass on an existing canvas — **not a rebuild**. Do exactly three things and change nothing else:

1. Apply the rename table to every artboard: tabs, breadcrumbs, headings, buttons, modal titles, empty states, menu items. Miss nothing.
2. Delete everything in the delete table, including anything downstream of it.
3. Redraw the single spine artboard to match the object table, keeping its existing visual style.

Do not restyle, redraw or improve anything else you touch. When you are done, report what you renamed, what you deleted, and what you redrew.

---

# The spec

## 0. Rename first, everywhere, before anything else

This is the single highest-value change in the document. The programme/reminder ambiguity cost the review roughly half an hour of three people's time — *"this has literally thrown me off for half an hour"* — and it is the second review in a row to lose time to it.

| Where | Was | Is now |
|---|---|---|
| Settings → Services, tab 1 | Programmes | **Maintenance programmes** |
| Settings → Services, tab 2 | Reminders | **Reminder settings** |
| Customers, tab | Maintenance | **Maintenance reminders** |
| Worklist row action | Create work order | **Create estimate** |

*Programmes* alone does not survive on its own — nobody in a shop uses the word. It works only with *maintenance* in front of it. And tab 2 is **Reminder settings**, not *Email settings*: *"it might not always be email."*

Sweep every artboard, including breadcrumbs, empty states, modal titles and menu items.

---

## 7. Delete from the canvas — additions to the base handover's list

| Delete | Why |
|---|---|
| The **Shop digest** campaign and its email artboard | Left the feature (area 3) |
| The **Welcome / enrolment** message | Cut at the review |
| The **Request a reading** message and its email artboard | Cut at the review |
| Any **campaign list, campaign creation, or per-campaign recipient** screen | Cut. Reminder settings holds exactly one message |
| The **call-outcome** picker and everything downstream of it | Cut (area 6) |
| The **nav badge** on Customers | Cut (area 6) |
| Customer **self-booking** — still out | Confirmed again as its own feature. It needs the existing customer-portal *request a service* flow expanded, and there is no guest mode |
| A **one-time / recurring** control on the service form | Never adopted — every service recurs |

**Half-withdrawn from the base handover's delete list:** the email toggle returns **on the service** (area 2a) and stays deleted **on the programme**.

---

## 1. The spine — three amendments

Redraw the spine artboard. Three rows change.

| Object | Amendment |
|---|---|
| **Service** | add `automatic send: on / off` · note that **a meter trigger always carries a calendar interval beside it** |
| **Compliance record** | unchanged as an object, but it now has **its own tab on the asset**, so draw that relationship explicitly |
| **Due service** | add the reset anchor: **the invoice date of the work order that completed it** |

Add one new object:

| Object | Lives on | Carries |
|---|---|---|
| **Work-order service line** | a work order | the service it came from · its own labour and parts · **canned lines nested beneath it as sublines** |

The relationship to make visible, because it is the one the review spent longest on: **a service is a work-order line in its own right.** It is not a label attached to other lines. A shop that writes *PM-A* as one four-hour line and a shop that writes it as four canned lines must both be drawable, and the second nests inside the first.

---

---

# Standing rules — these apply to every pass and were set before this one

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
5. **The name for a worklist row.** "Reminder" currently means the row, the message and a schedule step. Proposal on the table: **due service**. Until it is ruled, **do not label the row anything at all on the artboards** — a heading that has to be renamed on every board is exactly how the last two reviews lost half an hour each.
