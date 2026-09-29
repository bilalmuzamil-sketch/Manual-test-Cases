# Update — the Work Order surfaces

Targeted change to the existing Maintenance Reminders canvas. Six artboards, laid out as one band, left to right in the order below.

---

## Why this band exists

The work order is the only moment the truck is physically on the premises. Every other surface in this feature is about deciding who to phone; this one is about a unit that is already here, where the shop has leverage it will not have again for months.

**Use the same unit as the reading update:** Unit 402, Freightliner Cascadia, on open work order **S3780-15904**. Its last real reading was **342,417 mi on 29 Aug**; today is 4 Sep.

---

## Artboard 1 — the maintenance section inside the asset card

**Collapsed by default.** A shop with a unit on ten services would otherwise scroll forever. Collapsed, it is one line:

> `Maintenance · 3 due` ▸

Expanded, one line per due service. **No monetary totals and no hours estimates on this card** — those belong in the preview (artboard 2), not here.

**Six states, drawn as a row beneath the card:**

1. `Maintenance · Highway Tractor PM · nothing due`
2. `PM-A · overdue by 1,200 mi` → **Add to this work order**
3. `PM-C · due now · absorbs PM-A, PM-B` → **Add to this work order**
4. `CVIP · expires end of September` → **Add to this work order** — **orange, never red**
5. `PM-B · needs a current reading · last read 34 days ago` → **Enter a reading**
6. `Not on a maintenance programme` → **Add to programme**

State 3 is supersession: within a programme the highest service absorbs the lower ones, and they become one visit, one work order, all their checklists. Do not list the absorbed services as separate actionable rows.

**Hovering a due service shows what it will add** — the lines, the value and the time — before anything is committed. This is where money appears; the card itself stays clean.

> `PM-A · 4 lines · $412.60 · 2.1 hrs`

## Artboard 2 — Add to this work order

A confirm, not a silent action, because it changes what a technician is expected to finish today.

- The lines it will add, listed.
- The value and the time they add to this work order.
- **Two destinations, both offered:** **Add to this work order** and **Create a new work order instead.** A technician with three hours left cannot absorb ten more lines, and the second option lets the work be scheduled to someone else. Follow the DVI pattern for this choice.
- The added lines carry a marker back to the service they came from, so a reader of the work order can tell why they are there.

This action is **role-gated** — show the state a user without the permission sees.

## Artboard 3 — a reading entered here re-evaluates on the spot

**The most important behaviour in the feature.** A technician records a new odometer value at intake. The unit is re-evaluated immediately, not on the overnight run — a service that was three thousand miles away is now due, and it has to surface while the truck is still here. By tomorrow morning it has gone.

**3.1 — before.** The work order's mileage and engine-hours inputs, each showing the asset's current knowledge in the four-state reading field: `342,417 mi · Recorded 29 Aug on WO S3780-15211`.

**Two separate fields**, mileage and engine hours. Never merged, never one derived from the other.

**3.2 — after saving.** Draw the maintenance section from artboard 1 in its changed state, with the new row saying it just arrived:

> `PM-A · due now · appeared just now, odometer updated 14:20`

A row that arrives during the day is not the same as one that was there at 06:00, and it should say so. Draw this as the section changing — not as a toast.

**3.3 — a lower number than we hold.** Normally the truth: someone typed the earlier one wrong. Matter-of-fact, never a warning, never refused. State what is on record, what is being entered, and that thresholds will be recalculated. One confirm.

**3.4 — an implausible value.** Refused, with the reason legible. The real case from live data: a 2004 vehicle reading 217,649 miles and **11 engine hours**.

## Artboard 4 — "This was already done here"

**Covers a case nothing else on the canvas does.** Not every shop uses canned lines — plenty of people freeform type, with the prices in their heads. So location A runs maintenance properly, a unit turns up at location B where they type every line by hand, and in doing so they perform the CVIP that A is tracking. Nothing links the two, and A's record silently stays open on work already done.

From the maintenance section, alongside *add to this work order*:

> **This was already done here**

The dialog takes **which services**, **the date**, and **a reading**, and records the completion against this work order. **No canned line is involved at any point** — that is the whole reason it exists.

It must not scold. A shop typing freeform is not doing anything wrong.

## Artboard 5 — work-order completion

One screen, two blocks, in this order.

**5.1 — What will be marked done.** The silent failure this closes: a service advancing although its work was not done, pushing the next due point a year out with nothing on screen. Prefilled, every item unticked-able, each exclusion carrying its reason.

> ☑ `PM-A`  ·  ☑ `CVIP`  ·  ☐ `PM-B — its lines were removed from this work order`

Include the **compliance certificate**: month and year, skippable. It arrives from the agency with its own effective date that has nothing to do with when this work order completed, and the common case is not having it yet.

**5.2 — The enrolment nudge.** Appears **only** where the work just completed was maintenance-shaped and the asset is on no programme. One line, skippable, never modal on its own.

> `This looked like maintenance work. Put this unit on a programme?` → programme picker → **Enrol**

Draw the completion screen in **three variants**: both blocks · the reset list alone (asset already enrolled) · neither, so the quiet case is visible and nobody builds a screen that always shouts.

## Artboard 6 — Work Orders list, provenance column

One column, `Maintenance programme`. Where a work order was created from a due service it names the programme and links to it; otherwise the cell is empty.

This is what replaces a separate maintenance-history page — service history stays in one table rather than being split across two.

Draw the list with a realistic mix: a few rows attributed, most empty.

---

## Rules

- **No explanatory captions or annotations** on any artboard. That copy exists to explain the design to us, not to a user. Where a rule genuinely needs explaining to a user it goes behind an **info icon**.
- **One line per row** wherever it fits.
- **Existing design-system components only.** For the *unit is on site* indication, reuse the existing **on-site / off-site control** from the work-order screen rather than drawing a new one.
- **Compliance is orange, never red.**
- Money and hours appear **only** in the hover preview and the add confirm — never on the asset card itself.
- Lay all six artboards in one labelled band, left to right, with the action that leads from one to the next named beside the connector.
