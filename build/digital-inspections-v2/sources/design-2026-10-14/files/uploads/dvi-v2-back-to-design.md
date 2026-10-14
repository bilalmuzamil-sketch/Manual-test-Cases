# DVI V2 — back to design

SV-8181 · from implementation to Claude Design · 8 September 2026

The artboards in `design_handoff_dvi_v2 3` were built, shipped to the QA
environment `sv8181`, and reviewed by Fabian and Sasha. This file carries what
changed **as a result of that review**, so the artboards can be brought back in
step with what is now live.

Everything below is implemented and deployed. Where a decision departs from an
artboard, the reason is stated — the point is to agree the change, not to have it
quietly undone on the next pass.

---

## 1 · "Runs" is now "Times used"

**Screen:** Admin › Inspection Templates (list), desktop and phone.

**What happened.** Fabian went looking in QA for what a "run" was, could not find
it, and assumed it meant the number of times the template had been used. It does.
Sasha confirmed: *"Runs is total times used, yea."* Fabian: *"Times used is the
clearest."*

**New copy, verbatim:**

| Where | Was | Is |
| --- | --- | --- |
| Desktop KPI card | `Runs (30 days)` | `Times used (30 days)` |
| Table column header | `Total Runs` | `Times used` |
| Phone KPI chip | `Runs/30d` | `Used/30d` |
| Phone card suffix | `3 runs` | `3 times used` |
| Phone action sheet meta | `4,218 runs · v2` | `Used 4,218 times · v2` |
| Phone archived banner | *"Historical runs stay counted in reports."* | *"Inspections already completed from this template stay counted in reports."* |

The action sheet singularises: `Used 1 time · v2`.

**Not changed.** The API field is still `total_runs` / `totalRuns`. It is a field
name, not something a user reads, and renaming it would move a backend contract
for no benefit.

---

## 2 · Secondary descriptors deleted from the starter cards

**Screen:** Template builder, empty template — `START FROM A TEMPLATE` (artboard
TB1).

**What happened.** Fabian struck out the second line on the starter cards:
*"The template name describes itself. We don't need to double describe."* And,
more broadly: *"I have seen this lots in the app now that we are using Claude
Design. There are many times that it's redundant. Wherever we can delete it, we
should. And focus on making the name as clear as possible to the user."*

**Removed** — the sub-line on all six cards:

- ~~Preventive maintenance, tractor~~ (Class 8 Tractor PM Inspection)
- ~~Pickups and service trucks~~ (Light Duty PM)
- ~~Federal annual, Appendix G items~~ (DOT Annual Federal Inspection)
- ~~Foundation brakes, per axle~~ (Air Brake Inspection)
- ~~Running gear, lights, coupling~~ (Trailer Inspection)
- ~~Asked for in review · not named or scoped yet~~ (Equipment starter)

A starter card is now an icon, a name, and a `PENDING` badge where it applies.

**Deliberately kept** — the hints on the `Or build from scratch` cards
(`OK / Not OK / N/A`, `Number + unit (mm, psi, …)`, `Measurement rows repeated
per axle`, `Required photo evidence`, `Read-only callout for the tech`,
`Text answer that grows as you type`). These are not redundant: a field type's
name does not say what the field produces. The `Per axle` one is in fact the
hint that turned out to be **missing** information — see §3.

**Open for design.** Fabian's wider point is an audit across the product, not
only this screen. It has not been done. If Claude Design wants to sweep for
redundant secondary descriptors elsewhere, that is a separate pass and should be
scoped as one.

---

## 3 · "Axle set" is gone, and the field now shows what it becomes

**Screens:** Template builder — field-type palette, canvas row, and the field
properties panel (artboards TB0 / TB2 / TB5).

### 3.1 What went wrong

Fabian added four axles and got something he did not expect:

> *"I got very confused just now and I added 4 axles, and then opened the
> inspection on the work order, and found I had added 4 axle groups of 2, each
> with their own ability to add an axle."*
>
> *"It is not clear at all to the user what an 'axle set' means."*
>
> *"I think using the word 'set' threw me off. And I thought it was one axle, like
> right and left side of the axle meant axle set. Axle set is not standard
> terminology."*

He created **four fields** where **one** was wanted. The name told him a set was
one axle's two sides, so he added one per axle.

### 3.2 The rename

| Where | Was | Is |
| --- | --- | --- |
| Default label for a new per-axle field | `New axle set` | `New axle measurements` |

The field **type** in the palette stays `Per axle`. That is standard terminology
and Fabian did not object to it. The word "set" is out of the product.

### 3.3 A tooltip on the type card

The `Per axle` card in `Or build from scratch` gains an `ⓘ` and a tooltip. This
was Milos's steer — the hint line is too short to carry it, and the tooltip is
where more can be said without crowding the card.

> One field covers the whole unit. You define the measurement rows here, and the
> technician adds each axle while filling the inspection in — every row is then
> recorded per wheel position on every axle.

Treatment matches the Mark OK tooltip already in the design system: 300 ms delay,
grey-900 surface, white 12/16, radius 8, max 280px, shadow-lg.

### 3.4 A preview, opened from the properties panel

Fabian:

> *"When doing the inspection itself from the work order, the UI looks really
> nice. We should show this on the inspection template, so that the user knows
> what they are adding and what it will look like."*

**This needs an artboard.** It does not exist in the bundle. What is implemented:

**The trigger** sits in the field properties panel, directly under
`+ Add Measurement Row`. A full-width row, not a button — it opens a view of
something rather than changing anything:

```
┌────────────────────────────────────────────────┐
│ 👁  Preview of the axle field              ⤢   │
│     See how the technician fills this in       │
└────────────────────────────────────────────────┘
```

- container: `#F8FAFC`, `1px #E3E8EF`, radius 8, padding `10px 12px`, gap 10
- hover: background `#FFFFFF`, border `#CDD5DF`
- title 13/600 `#202939` · sub-line 11px `#697586`
- leading `visibility` icon 16px, trailing `open_in_full` 14px `#9AA4B2`

**The dialog** is `xl` (1120px — closest to the filler's own 1040px canvas
column), titled **"How the technician fills this in"**, with one paragraph above
the preview:

> One field covers the whole unit. You define the measurement rows; the
> technician adds each axle while filling the inspection in, and every row is
> recorded per wheel position on every axle.

Inside: **the real filler component**, disabled throughout — not a redrawing of
it. It cannot drift from what the technician sees because it *is* what the
technician sees. It is seeded with **two axles, one Single and one Dual**, so the
`1 per side` and `Outer + inner` renderings are both visible; that distinction is
set in this very panel and was the thing nobody could picture before publishing.

The frame is `#F8FAFC`, `1px #E3E8EF`, radius 8, padding 12, `pointer-events:
none`.

### 3.5 Two shapes that were tried and rejected

Recorded so the artboard does not propose either of them again.

**Inline, desktop grid.** Cut off. The properties panel is about 360px; the grid
needs 196px for its row labels plus two value columns, and the TOP VIEW diagram
wants another 186px beside it. It arrived clipped with a horizontal scrollbar.

**Inline, phone rendering.** Fitted the width, but ran the whole length of the
panel and pushed the field's own controls — reference file, validation toggles,
Duplicate/Delete — off screen. Fabian's words on seeing it: *"ovo izgleda loše."*

Hence a dialog. **If the design prefers a different container**, the constraint to
design against is: the preview needs ≥800px of width, and the properties panel
cannot give up more than ~120px of vertical space.

---

## Appendix · Earlier divergences the artboards do not yet reflect

Not from Fabian's review — these came out of the QA pass before it, and are also
live. Listed because an artboard update should account for them.

| # | Artboard | What is live instead | Why |
| --- | --- | --- | --- |
| A1 | A4 / A5 — `Add Photo` as `btn2` in the field card header | It sits in the card **footer, beside `Add Note`** | QA read the two as unrelated controls. They are the same kind of offer, so they share a row. The photo block still opens on its own the moment `photoIfNotOk` bites. |
| A2 | §5.3 — Mark OK tooltip with an 8px arrow | No arrow | Quasar's tooltip has no arrow element and resolves its side at runtime; a hand-drawn one points the wrong way. Everything else in the spec (surface, type, radius, shadow, max-width, delay) is implemented. |
| A3 | TB1 — five active starters + one pending | **Two** active (Class 8 Tractor PM, Light Duty PM), **four** pending | Only two have template content. Seeding a DOT Annual Federal Inspection with brake-and-axle fields because that is the content to hand would put a lie in the product. They turn on when their own definitions arrive. |
| A4 | §4.4 — "All five are seeded into every organisation" | No seeding exists | That describes a backend mechanism which is not built. Separate ticket. |
| A5 | B — the completed screen as a single card | The card, **plus the section-by-section review stacked below it** | Milos's call: the card answers *what happened*, the sections answer *what was entered*. Removing the second would drop the only way to read a locked inspection's answers. |
| A6 | B — header | The section rail is gone; header is the 52px bar with the lock **stated in words**, no coloured status pill | On a wholly read-only screen a status dot competed with the verdict dots on the card. `Advisor`, `Started` and per-section progress went with the rail and have nowhere in the design — **flagging in case they should come back somewhere**. |
| A7 | B2 — target row reads `S-81 · Open · 0 lines` | `S-81 · Approved` — number and status, no line count | The work-order payload carries no line count and a menu sub-line is not worth a second request. |
| A8 | B2 — menu on the completed screen only | The same menu on **all three** entry points: completed screen, work order › Notes card, Customer › Asset › Inspections | One action should have one appearance wherever it is met. The chooser dialog it replaced asked its question before anything had happened. |

---

## What is not in this file

- **ShopCoach line generation is not testable on QA.** The assistant is a separate
  deployment that does not carry the new `inspection-line-builder`. What has been
  reviewed on `sv8181` is the design and the entitlement gate, not drafting.
- **Two spec items are unimplemented and unreviewed:** `HELPER TEXT` (build-spec
  §2) and M3's outstanding-per-position list on the phone.
- **One open bug:** `POST /inspections/{id}/submit` returns 400 on QA and the
  response body has not been captured, so which of six backend validations fires
  is still unknown. It blocks report generation for the inspection it happens on.
