# Handoff: Digital Inspections V2

SV-8181 · Shopview Design System · September 2026

> **Implementing this?** Read `DVI-V2-PRD.md` — the full requirements document, with the domain
> model, numbered requirements, logic, self-verification gates and open questions. Then
> `CLAUDE-CODE-HANDOFF.md` — it is the implementation brief:
> what changed in the 2026-09-03 review, the full Mark OK behaviour, the data model and the
> bulk-OK/undo logic, the token list and the test list. This README is the screen-by-screen
> design reference it points back to.

## Overview

Digital Inspections V2 reworks the two halves of the inspection feature and the path out of it. A shop manager builds a template; a technician fills it on a laptop or a phone; the findings become work order lines.

Three things changed structurally, and they are the reason this is a redesign rather than a restyle.

**A verdict now belongs to a single tire position.** Previously a measurement row held one verdict for the whole row. On a dual axle that made it impossible to record that the left outer tire is bad while the left inner is fine — which is the ordinary case. Each position now carries its own verdict, and every level above it is derived.

**Conditional follow-up is gone.** A branch per response meant the template author wrote four instructions and the technician met one. It is replaced by two simpler ideas that cover the same ground: a reference file always available on the field, and validation rules that say what the technician owes when something is wrong.

**Building work order lines is a ShopCoach capability.** A shop without ShopCoach gets no build action anywhere — the inspection reports what is wrong and a human builds the work order.

## About the design files

The `.dc.html` files in this bundle are **design references written in HTML** — prototypes showing intended layout, colour, copy and behaviour. They are not production code to copy. The task is to recreate them in the Shopview codebase using its existing React components, tokens and patterns.

Two of them carry real logic and are worth opening in a browser and clicking:

- `Inspection Fill V2 - Desktop.dc.html` — section A6 is live. Click a verdict marker, pick a verdict, watch the row and axle roll-ups and the top-view tires recompute. Switch Single/Dual and see values preserved.

`Digital Inspections V2 - All Screens.dc.html` is all four areas merged into one scrollable document with a contents list — the best single file to read start to finish. The per-area files are the same content split up.

`support.js` is the runtime the prototypes need to render. It is not part of the design and should not be ported.

## Fidelity

**High-fidelity.** Final colours, typography, spacing, copy and interaction states throughout. Every value comes from the Shopview Design System — no colour, radius or type size was invented. Recreate the UI faithfully using the codebase's existing component library; where a prototype hand-rolls something the codebase already has (buttons, badges, inputs, menus), use the real component.

Read the two specs alongside this README:

- `DVI-V2-user-stories.md` — what must be true, as acceptance criteria. Use it to check the implementation.
- `DVI-V2-build-spec.md` — how it looks and behaves, with measurements, exact copy strings, and a suggested build order.

---

## Design tokens

All from `_ds/shopview-design-system-.../colors_and_type.css`. Prefer the semantic CSS variables over the hexes so dark theme resolves; the hexes are given so the prototypes can be read.

| Role | Value |
| --- | --- |
| Primary | `#257CFF` · hover `#1752C0` · active `#042260` · disabled `#B7D5FF` |
| ShopCoach / AI | `#7A5AF8` · surface `#F8F6FF` · border `#DDD4FF` |
| Text | grey-900 `#202939` · grey-700 `#364152` · grey-600 `#4B5565` · grey-500 `#697586` · grey-400 `#9AA4B2` |
| Surfaces | white · grey-25 `#F8FAFC` · page `#EEF2F6` |
| Borders | `#E3E8EF` subtle · `#CDD5DF` input and divider |
| OK | dot `#16B364` · fill `#EDFCF2` / `#D3F8DF` · text `#087443` · solid `#099250` |
| Monitor | dot `#F79009` · fill `#FFFAEB` / `#FEF0C7` · text `#B54708` · solid `#DC6803` |
| Not OK | dot `#F04438` · fill `#FEF3F2` / `#FEE4E2` · text `#B42318` · solid `#D92D20` |
| N/A | dot `#9AA4B2` · solid `#697586` |
| Not inspected | white fill, `1px solid #CDD5DF`, text grey-600 |
| Radii | 8px controls, inputs, menus · 12px cards, panels · pill badges · 20px phone frame |
| Shadow sm | `0 1px 2px rgba(11,23,51,0.05)` |
| Shadow lg | `0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)` |
| Focus | `2px solid #257CFF` + `0 0 0 4px rgba(37,124,255,0.24)` |
| Overlay | `rgba(15,17,26,0.5)`, no blur |
| Type | Inter — 24/32 600 section titles · 16/24 600 card titles · 14/20 body · 13px controls · 12px meta · 11px labels · 10px uppercase column heads at 0.06em |
| Spacing | 4px grid; 8/10/12/14/16/20/24 in practice |
| Motion | 120–160ms ease-out; hover is colour + lift, never scale |

**Verdict metadata** — one table, read by every screen:

```js
const VMETA = {
  none: { label:'Not inspected', border:'1px solid #CDD5DF',   dot:null,      chipBg:'#EEF2F6', chipFg:'#4B5565', dotColor:'#9AA4B2', wheelBg:'#fff'    },
  ok:   { label:'OK',            border:'1.5px solid #16B364', dot:'#16B364', chipBg:'#EDFCF2', chipFg:'#087443', dotColor:'#16B364', wheelBg:'#D3F8DF' },
  mon:  { label:'Monitor',       border:'1.5px solid #F79009', dot:'#F79009', chipBg:'#FFFAEB', chipFg:'#B54708', dotColor:'#F79009', wheelBg:'#FEF0C7' },
  bad:  { label:'Not OK',        border:'1.5px solid #F04438', dot:'#F04438', chipBg:'#FEF3F2', chipFg:'#B42318', dotColor:'#F04438', wheelBg:'#FEE4E2' },
  na:   { label:'N/A',           border:'1.5px solid #697586', dot:'#9AA4B2', chipBg:'#EEF2F6', chipFg:'#4B5565', dotColor:'#9AA4B2', wheelBg:'#EEF2F6' }
};
```

---

## Data model

```
Template
  sections[]
    fields[]
      id, label, helperText?
      type: 'text' | 'checkbox' | 'measurement' | 'axleSet'
      referenceFile?: { name, mime, sizeBytes }
      rules: { required, photo, photoIfNotOk, noteIfMonitorOrNotOk }
      rows[]                                   // axleSet only
        id, name, unit, perTire: boolean

Inspection
  templateId, version, sections[], status: 'notStarted' | 'inProgress' | 'completed'
  completedAt?, technicianId?
  axles[]                                      // per axleSet field
    id, brake: 'drum' | 'disc', config: 'single' | 'dual'
    values:   { [rowId]: { [position]: string } }
    verdicts: { [rowId]: { [position]: 'ok' | 'mon' | 'bad' | 'na' } }
  fieldAnswers: { [fieldId]: { verdict?, note?, photos: [] } }
```

**Positions.** `perTire: true` on a dual axle → `lo, li, ri, ro` (left outer, left inner, right inner, right outer). Single axle, or any `perTire: false` row → `l, r`.

**Absence is meaningful.** A position with no entry in `verdicts` is *Not inspected*. Never write `na` as a default, never seed the object. Empty stays empty.

**Units.** `in.` is the system default. Available: `psi, mm, in., 32nds, ft-lbs`.

### Roll-up

Only the position verdict is stored. Everything above is computed:

```js
const ORDER = ['bad', 'mon', 'ok', 'na'];
function worst(list) {
  for (const v of ORDER) if (list.includes(v)) return v;
  return 'none';
}
```

| Level | Computed from |
| --- | --- |
| Measurement row | worst of its positions |
| Axle | worst of its rows |
| Field | worst of its axles |
| Top-view tire | worst of the verdicts entered for that tire so far; `none` → grey; some-but-not-all rows judged → **dashed border** |

Do not persist any derived level. Two earlier passes stored them and the values drifted.

### Single ↔ Dual

Two value stores per row, both alive for the session: `dualVals` / `dualV` and `singleVals` / `singleV`. **No confirmation dialog** — an earlier design had one and it was removed.

- **Dual → Single**: copy `lo → l` and `ro → r`, value *and* verdict; clear `li` / `ri`. The outer readings survive because they are what a single-tire axle corresponds to.
- **Single → Dual**: restore the previous dual store untouched.
- Submitting on Single stamps `config: 'single'` on the record.

Session-only memory. A page reload may forget the hidden store.

---

## Screens

### 1 · Template builder — desktop

**File** `Inspection Template Builder V2 - Desktop.dc.html` · artboards TB1–TB7 · `1280` wide

App bar 52 → sub-header 52 → three columns: sections rail `236`, canvas flex on `#F8FAFC`, inspector panel `320` with a `1px #E3E8EF` left border.

**Starter library.** Headed **Start from a template** at 13px/600 left-aligned, helper line *Select a template to start building the inspection.*, matching the **Or build from scratch** block beneath it. Six starter slots, five with content from Cody's seed templates — **Class 8 Tractor PM Inspection** (4 sections / 77 fields), **DOT Annual Federal Inspection** (12 / 50), **Air Brake Inspection** (3 / 15), **Trailer Inspection** (5 / 20), **Light Duty PM** (4 / 29). Only the unnamed **equipment starter** is drawn as `PENDING`. Where the same thing is measured on every wheel position those templates use one per-axle field, not one field per position; the DOT form keeps its own structure. A card is an icon and a name: no second line, because the template name describes itself. Two-column grid of equal rows, so a seventh and eighth drop in without relayout. No marketplace, no search. **How starters reach an organisation is unresolved** — no seeding mechanism exists.

**Per axle, not "axle set".** The type in the palette is `Per axle`; a new field is labelled `New axle measurements`. The word "set" read as one axle's two sides and cost a shop owner four fields where one was wanted. Two tooltips carry the explaining, each where the question comes up:

- The **type card** in the palette: *One field covers the whole unit. You define the measurement rows here, and the technician adds each axle while filling the inspection in — every row is then recorded per wheel position on every axle.*
- The **`AXLES`** field in the properties panel, directly above `+ Add Measurement Row` — a row card matching the measurement rows — title **Axles** 13/600 with the ⓘ, muted line *"Select # of axles to start with"*, and the panel's `.unitsel` control at 104×32 (112×44 on phone) defaulting to **3**, menu 2–5: *Most units of this kind have this many axles, so the technician starts with that many. They can add or remove axles while filling the inspection in.*

The rows section above it is labelled `MEASUREMENT ROWS · EVERY AXLE`. In TB3 the card is the last one after the measurement rows, with a working 2–5 menu. Both tooltips sit on the panel itself in TB2.

**Preview mode.** The tooltips say what the field type is; they do not show an author their own template. So the builder has two modes: an `Edit` / `Preview` control in the sub-header, left of `Save Draft`. **In Preview the properties panel steps aside and the canvas takes its width** — the reason this works where an inline preview did not (the panel is ~360px; the axle grid needs ≥800px). No banner and no notice: the mode control already says which mode the author is in. There is no submit bar either — the fill footer belongs to an inspection, not a template. The canvas then renders the real fill screen from the current draft, unsaved edits included, every control present and inert. The phone gets the same preview at its own width, because the technician is usually on a phone. **Clicking a field returns to Edit with that field selected**, and hovering raises the card and turns its border blue — the card is the affordance, so no pill is drawn. The three Mark OK actions are not drawn in Preview either: they set verdicts, and Preview sets none. Which is the point: the loop was publish, open a work order, start an inspection as a technician, find the problems, come back. **TB7** draws both widths. A preview dialog was drawn and dropped on the way: it cost a click and could only ever show one field.

**Field row in the canvas.** 44px tall. Grip handle grey-400 on the left, label 13px 500, type and rules as an 11px grey-500 subtitle, pencil and delete on the right — delete `#B42318`, everything else grey-700.

**Inspector — checkbox field.** Sections in this order, each divided by `1px #E3E8EF`:

1. `LABEL` — text input. Inline rename with a 28px blue check to confirm and a 28px white/grey-300 X to cancel. **No modal.**
2. `HELPER TEXT` — optional single line.
3. `RESPONSE OPTIONS` — OK / Monitor / Not OK / N/A as read-only chips. Fixed order, not editable.
4. `REFERENCE FILE` — helper: *"Always available on this field, whatever the technician answers."* With a file: `#E9F5FF` / `#BEDFFF` row, PDF tile, name, size, "not in the customer report", remove as a **grey-700 X** (not red). Without: an "Attach File" secondary plus `PDF, JPG or PNG · up to 10 MB` in grey-400 **above** the control, stated before the upload rather than after it fails. **There is no Replace button** — X then attach again.
5. `VALIDATION` — four independent toggles in this order:

   | Rule | New template default |
   | --- | --- |
   | Required to complete | off |
   | Photo required | off |
   | Photo required if Not OK | off — *changed 2026-09-03, see Review* |
   | Note required if Monitor / Not OK | **on** |

   Only the note rule is on for a new field; the photo rule is opt-in. Below the toggles a live summary: *"The technician must provide an answer, a photo when Not OK, a note when Monitor or Not OK."* With nothing on: *"Nothing is enforced — the technician can leave this field untouched."* Existing templates keep whatever they have; the defaults apply at creation only.

**Inspector — per-axle field.** Adds `MEASUREMENT ROWS`. Each row card:

```
[grip] Row name                          [pencil] [delete]
       Defaults                                   ← 11px #9AA4B2
       [unit ▾]   [ One per side | Outer + inner ]
```

- The row name **never** contains the unit in brackets. "Tread depth", not "Tread depth (32nds)".
- The `Defaults` line is 11px grey-400 — the same size as helper text, so it costs one line of height.
- Unit menu lists the five units, current highlighted `#F4FAFF` / `#175CD3`, labels plain with no "(default)" suffix.
- Scope is a two-value segmented pair: *One per side* → `perTire: false`, *Outer + inner* → `perTire: true`. The column needs ≥376px so the longer label never wraps.
- Rows drag to reorder.

**Removed from the builder** — conditional follow-up in every form: the branch editor, the four response paths, nested follow-up rows in the field list, and acknowledgement toggles. Also the Replace-file button, and the unit in the row name.

### 2 · Fill — desktop

**File** `Inspection Fill V2 - Desktop.dc.html` · artboards A1–A6, D3–D4 · `1440` wide

App bar 56 → work-order sub-header 56 → sections rail `236` + canvas. Cards `max-width: 1020px`, white, `1px #E3E8EF`, radius 12, shadow-sm.

**Per axle grid** is `196px | 1fr | 1fr`. There is **no STATUS column and no ROW column** — both were removed. OUTER / INNER is labelled once in the column header, never per input. A `186px` left panel holds a top view of the unit; clicking a tire scrolls to its value.

**Marking OK in bulk — three levels, one pattern.** `Mark all OK` on the inspection row, `Mark section OK` on the section row, `Mark field OK` on a field's own card header. Same wording, same treatment, same right edge, one level per row — so the level is read from the row it sits on. The inspection and section rows align to the canvas column; the field action sits at the right end of its card header, after Add Photo, inset only by the card's own padding. All three are quiet blue text actions (`#175CD3`, check icon, no border), not buttons: the primary on the screen is still finishing the inspection. Nothing sits in the app bar or the sub-header; the inspection row is the top of the scroll, so it needs no scrolling to reach.

OK only: no bulk Monitor, no bulk Not OK. Verdicts only: it never writes a measured value. It never overwrites a verdict already picked, so "everything OK, then fix the two bad ones" works in either order. Hovering any of them shows a tooltip (no arrow) that says exactly what it will do and what it will leave alone, with live counts — that is why the labels can be this short. The row that was pressed then swaps its action for a green check and a count in its own unit — *"3 fields marked OK"* on a section, *"36 positions marked OK"* on a field — with `Undo` beside it until the next edit, and every level beneath it shows the same check with its own count. A1 shows the pattern in place; A5 is the whole screen as it is filled and A5b the same section after `Mark section OK`, with an per-axle field, a checkbox and a measurement field each carrying `Mark field OK`. Text fields have no verdict and no action. What it should do with a position that has **no value entered** is an open question — see Review, below.

**The value control** is the atom of the release. Input and verdict marker share one border:

```
┌───────────────────────────┐
│ 42                    │ ●▾│   marker 38px wide, tinted to the verdict
└───────────────────────────┘
```

- Border `1px #CDD5DF` when not inspected; `1.5px` in the verdict colour once judged.
- Marker: verdict-tinted background, dot + chevron, divider in the verdict colour.
- Clicking it opens a `206px` shadow-lg menu **titled with the position and the value** — "Left outer tire · 42 psi" — so there is never a question which position is being set. Options are OK, Monitor, Not OK, N/A as dot + label; the current one sits on a `#F4FAFF` row. Marker, menu width and selected-row tint were reconciled with A6 on 2026-09-03.
- **Not inspected is not in the menu.** It is where a position starts, not a choice.
- One menu open at a time; a click elsewhere closes it.

**Field card element order**, always: title + type → reference-file chip → response row → note / photo → footer. The reference chip never sits beside the response row — that overlap was the original complaint.

- Response row: one segmented control, 44px, `max-width 520px`. Selected segment filled solid in its verdict colour with white text; unselected white with a coloured dot.
- **No status badge in the card's top-right corner.** It repeated the answer at a smaller size and survived three passes before removal — do not reintroduce it.
- Note and photo sit **side by side**: note flexible left, photo `340px` right.
  - Note: `NOTE` label + `Required` badge when applicable, textarea, "Goes to the customer report", confirm/cancel pair (grey-300 X, blue check).
  - Photo: `PHOTO` label + badge, dashed `#CDD5DF` target ≥132px — `#E5EDFF` icon tile, "Drop a photo here", "or upload from your computer · JPG or PNG". **No video.** Landed files show as 104px thumbnails with a remove X, to the left of the target. No grey placeholder square.
- Containers stay neutral. Colour appears only on the value that earned it, the badge, and the control being pressed — no tinted rows, no red card outlines.

**Reference-file viewer (D4)** is a full-page modal, because a technician on a small laptop reading a portrait document needs the height. Bar `10px 16px`: PDF tile, file name, the field it belongs to, a zoom group (`− Fit width +`), Download as a secondary, close X. Body `#EEF2F6`, `overflow-y: auto`, pages `620px` wide and `flex: 0 0 auto` with `align-items: flex-start` so they keep their natural height, 24px gap. **Downloading is never the only way to read it.**

### 3 · Fill — phone

**File** `Inspection Fill V2 - Mobile.dc.html` · artboards M1–M8 · `402` wide

App bar 44 → section header → scrolling content → footer.

- **No grid below tablet.** One axle at a time, values in a `1fr 1fr` grid, each with its position label above: *Left outer, Left inner, Right inner, Right outer*.
- Labels 11px 600. On a judged position the label states the verdict and takes its colour — "Left outer · Not OK".
- Value rows 52px, inputs 17px 600, marker button 52px wide. These sizes exist because the first pass was too small to tap with gloves on.
- **Axle chips** in the sub-header: 44px pills, `flex: none`, `white-space: nowrap`, the row scrolls horizontally. Tapping one **swaps the page** to that axle — it does not scroll to it.
- **The footer is section navigation and nothing else.** Two half-width 52px buttons naming their destination — `Back: Section 1` / `Next: Section 2`; on the last section the primary becomes `Review & Sign`. Never a greyed-out square. Axle switching lives only in the sub-header.
- **Outstanding work rides on the action** as a count badge — amber for notes only, red when photos are also missing — not in its own bar. Tapping the badge opens a sheet listing each missing item with its path ("Section 1 · Tire pressure · left outer"); tapping a row goes **straight to that field**, never back to a summary.
- **Bulk OK** keeps its three levels, one per surface: a full-width 44px row at the foot of the section header for the section, the field header of the axle-set screen for the field (single-answer fields keep their one-tap OK segment and no extra action), and the app-bar menu for the whole inspection (M2 draws that menu on its own, beside the frame). The footer gains nothing.
- Verdict sheet: bottom sheet titled with position, measurement and entered value; four 56px options; no "Not inspected" option.
- Required evidence: the `Add note` / `Add photo` label and icon turn `#B42318` on a row holding any Not OK position. The container stays neutral, the button spans the row.

**Removed on phone**: the bottom back button (Android draws one and it cost a row of screen), the coloured dot beside a verdict (the field is already coloured), the dot on axle chips, the bottom axle-navigation strip, and the requirement bar. Set all positions is no longer among them — see Review.

### 4 · Inspection → work order

**The summary card** leads the completed screen: the completion line, a count per verdict, and a findings list naming each flagged position as field · axle · row · position with the reading that earned it. **A verdict with no findings is not counted** — a zero reads as a finding at a glance. With ShopCoach the footer carries `View PDF`, `Go to work order` and `Build lines`, with one line above it naming the product once; without ShopCoach, two actions and a plain line pointing at the customer report, the note feed and the work order. The section-by-section review stays below the card: the card answers what happened, the sections what was entered. `Advisor`, `Started` and per-section progress are not carried onto this screen — the first two belong to the work order, and progress means nothing once the inspection is locked.

**On a phone** the whole flow completes on the device: P1 the card and review with stacked 48px actions, P2 the target bottom sheet at 56px rows, P3 the drafted lines with the running total and `Add 2 Lines to S-81`, P4 the unlicensed variant.

**File** `ShopCoach Line Builder V2.dc.html` · artboards A, B, B2, C1, C2, D, E, F · `1200`–`1440` wide

**Entitlement gate.** Building lines is a ShopCoach capability.

**A · Without ShopCoach.** Summary card, findings list, counts (`9 OK · 1 Monitor · 2 Not OK`). Exactly two actions: `View PDF` secondary, `Go to work order` primary. **No build action at all** — not disabled, not behind a tooltip, absent.

**B · With ShopCoach.** Identical plus a `#7A5AF8` **Build lines** button with a white-on-translucent `AI` badge and a chevron; `Go to work order` demotes to secondary. Above the footer a `#F8F6FF` / `#DDD4FF` note: *"ShopCoach can turn these 3 findings into work order lines with labor and parts. You review everything before it is added."*

The label is "Build lines" — not "Build lines with ShopCoach". The purple and the badge carry the product name.

**B2 · Target menu.** 308px, `#DDD4FF` border, shadow-lg. Heading `BUILD THE LINES ON`, then *This work order* (S-81 · Open · 0 lines) and *A new work order* (seeded with this customer & unit).

**When the run starts.** On the target choice, not on an earlier "Create Lines" step. The destination decides the context — a new estimate seeds different customer and vehicle data than the open work order — and running here means the technician never waits inside a modal: navigation and drafting happen together.

**C1 · Drafting.** Already on the work order, Lines tab. Header "Drafting lines from 3 findings · about 10 seconds", three pulsing dots, **one skeleton row per finding** because the count is known before the drafting is. `Cancel` available and leaves the work order untouched. Footer: "Nothing is added until you press Add Lines".

**C2 · Landed.** Same table, filled, all rows checked. Header "Review before adding · Click any title, description, labor or part to edit it. Uncheck a line to leave it out." Every line names the finding it came from beneath its title, with a verdict dot. Footer: `Add Lines` + "2.5 hrs labor · 4 parts · nothing on the work order yet".

**No prompt, no query box, no configuration step anywhere in this flow.** The technician arrives reviewing, not instructing.

Table columns: checkbox `44` · Title `280` · Description flex · Labor `88` · Parts `250`. Parts are `#0E9F6E` chips with a check plus a `+ Add` secondary chip. **Do not redesign this table** — it already exists in the product.

**The same action in four places:**

| Entry point | Where it sits | Artboard |
| --- | --- | --- |
| Completed inspection | Footer, primary position | B |
| Work order › **Notes** | On the auto-posted inspection note card, beside View PDF and Download | E |
| Customer › Asset › **Inspections** | Action column of the row | F |
| Work order › Lines | Sub-header beside `New Line`; drafts from unit history with no inspection | D |

**E · Notes tab.** Avatar, author, `Auto-posted` badge, timestamp, then "Completed inspection 1234 · v2 · 2 sections, 6 fields". The report is a card: 76×96 page thumbnail, file name, size, and **the counts as chips** — an advisor never opens the PDF to learn whether something failed. Actions: View PDF · Download · Build lines. Without ShopCoach the last is absent.

**Note and photo.** `Add Photo` and `Add Note` share the field card footer. A header photo button read as unrelated to the footer note button; they are the same kind of offer. The photo block still opens on its own when `photo required if Not OK` bites.

**F · Asset › Inspections.** **No filter chips** — an asset gets roughly one inspection a quarter, and ten rows in a year is not a list worth filtering. A single plain line above the table carries the actionable count ("2 of 14 have findings with no lines yet"); the sort order carries the rest. Columns: Inspection (name + version) · Status · Completed · Technician · Issues · Work order · Report · Action.

The action cell is one of:
- `Build lines` purple — completed, has findings, no lines yet
- `✓ WO created S-235` / `✓ Lines added S-58` — already handled, so the same work is never offered twice
- `—` — not started; there is nothing to build from

Rows needing a work order sort first, ahead of date order.

---

## Interactions and behaviour

| Interaction | Behaviour |
| --- | --- |
| Verdict marker click | Opens the position menu. One open at a time; outside click closes. Menu title names the position and the entered value. |
| Verdict pick | Writes `verdicts[rowId][position]`, closes the menu, recomputes row / axle / field / tire roll-ups synchronously. |
| Single ↔ Dual | Immediate, no dialog. Copies outer→side going down, restores the dual store coming back. |
| Axle chip tap (phone) | Swaps the page to that axle. Not a scroll. |
| Footer primary (phone) | Section navigation only, always naming its destination. |
| Requirement badge tap | Opens the missing-items sheet; a row navigates straight to that field with focus in it. |
| Add note / Add photo | Opens the block in place — never a modal. Note has confirm/cancel; photo accepts drag-drop or browse. |
| Reference file open | Full-page modal, scrollable, `Fit width` default. |
| Inline rename (builder) | Check confirms, X reverts. No modal. |
| Validation toggle | Rewrites the summary sentence live. |
| Build lines | Opens the target menu; choosing a target navigates *and* starts the run together. |
| Cancel during drafting | Aborts; the work order is untouched. |
| Add Lines | The only write. Until pressed, nothing reaches the work order. |

**Motion.** 120–160ms ease-out. Hover is colour plus a shadow-sm→md lift, never scale. Press is a darker fill with no shadow. Focus is always the 4px blue glow with a 2px border. No entrance animations on route change.

**Responsive.** The desktop grid holds down to ~1024px. Below that, switch to the phone pattern — one axle, stacked positions, no horizontal scroll anywhere.

## State

```
// fill
axles, activeAxleId, openMenu: { rowId, position } | null,
dualVals/dualV + singleVals/singleV per row,
notes, photos, outstandingRequirements (derived)

// builder
fields, selectedFieldId, rows, editingRowId, unitMenuOpen,
referenceFile, rules { required, photo, photoIfNotOk, noteIfMonitorOrNotOk }

// hand-off
hasShopCoach (entitlement), targetMenuOpen, runState: idle|drafting|ready,
proposedLines[], selectedLineIds
```

`outstandingRequirements` is derived from answers plus rules, never stored — it drives the footer badge count and the missing-items sheet.

## Assets

No new assets. Icons are Lucide outlines at 1.5–2px stroke with `currentColor`, matching the design system. Logos come from the design system's `assets/`. Inter ships with the design system. The prototypes inline their SVGs; use the codebase's icon component instead.

## Files in this bundle

| File | What it is |
| --- | --- |
| `Digital Inspections V2 - All Screens.dc.html` | All four areas in one scrollable document with a contents list. Read this first. |
| `Inspection Template Builder V2 - Desktop.dc.html` | TB1–TB3, TB7. TB7 is Preview mode, desktop and phone. |
| `Inspection Fill V2 - Desktop.dc.html` | A1–A6 (A5b = after the press), D3–D4. **A6 is interactive: hover for the tooltip, press for the report and Undo.** |
| `Inspection Fill V2 - Mobile.dc.html` | M1–M8, 402px. |
| `ShopCoach Line Builder V2.dc.html` | A–F plus **P1–P4, the whole flow on a phone**. |
| `DVI-V2-user-stories.md` | Acceptance criteria per story, with a REPLACES note per area listing what to delete. |
| `DVI-V2-build-spec.md` | Tokens, data model, per-screen measurements, exact copy strings, build order. |
| `support.js` | Prototype runtime. Needed to open the HTML; **not** to be ported. |

## Copy

Exact strings. Where the product says something else today, change it.

| Context | String |
| --- | --- |
| Neutral state | **Not inspected** — never "not judged", never "pending" |
| Verdicts | OK · Monitor · Not OK · N/A |
| Positions | left outer · left inner · right inner · right outer (outer→inner, left→right, matching the top view) |
| Axle config | Drum / Disc · Single / Dual |
| Note helper | Goes to the customer report |
| Photo target | Drop a photo here / or upload from your computer · JPG or PNG |
| Reference file helper | Always available on this field, whatever the technician answers |
| File limits | PDF, JPG or PNG · up to 10 MB |
| Validation rules | Required to complete · Photo required · Photo required if Not OK · Note required if Monitor / Not OK |
| Build action | Build lines (+ AI badge) |
| ShopCoach note | ShopCoach can turn these N findings into work order lines with labor and parts. You review everything before it is added. |
| Review header | Review before adding |
| Reassurance | Nothing is added until you press Add Lines |
| Phone nav | Back: Section 1 · Next: Section 2 · Review & Sign |

ShopCoach is named once, in the note before the run. Everywhere else the purple and the badge carry it.

## Build order

1. **Data model and `worst()`** — everything reads from it.
2. **The value control** (input + verdict marker + position-titled menu). The atom of the release; get it right before anything else.
3. **Per axle on desktop**, then the phone variant.
4. **Field card** — reference chip, response row, note and photo side by side.
5. **Builder inspector** — rows, units, scope, reference file, the four rules.
6. **Hand-off** — entitlement gate, the four entry points, drafting state, review table.

One deletion to schedule alongside: **conditional follow-up** (builder UI, fill UI, and the stored branch data). Set-all was on this list until 2026-09-03; a bulk **OK** is now part of the release. What stays deleted is bulk Monitor, bulk Not OK, and any shortcut that writes a measured value.

## Standing rule · no unspecified explanatory text

No descriptor line, hint text or helper paragraph beyond what the build spec asks for. Where an explanation
is needed the spec says **on demand** — a tooltip on an `ⓘ`, never permanent text on the surface. Already applied to the starter cards, every fill field-card header on every artboard, and the preview banner.
Still specified and kept: the builder canvas row subtitle, a measurement row's `Defaults` line, and the
state line on a collapsed axle. Detail in
`DVI-V2-PRD.md` §7a.

## Review · 2026-09-03

Fabian Bonjean (shop owner, domain) and Sasha Grosman (product). Four decisions, one deferral, one rejection, four open questions. Detail and reasoning live in `DVI-V2-build-spec.md` §8 — read it before changing any of them back.

**Decided.** A bulk **OK** returns at inspection, section and field level — the same quiet action repeated on each level's own row — because four axles is 48 dropdowns and the real workflow is to mark everything good and then correct two or three. The filter chips come off Asset › Inspections, because an asset gets about one inspection a quarter. "Photo required if Not OK" now defaults off; the note rule stays on. Five seeded starters replace the two placeholder ones, with a sixth equipment slot marked pending.

**Deferred — the value control.** Picking a verdict takes two clicks, and a table with all four options always visible would be faster. Not changed in this pass: bulk OK removes the volume that made the click count hurt, and the control is the atom of the release — reworking it invalidates A6, M6 and every measurement here.

**Rejected — verdicts derived from value ranges.** Feasible, proposed twice, out of scope for this release: limits per row per unit per vehicle class, an override path, and an audit story for who judged what.

**Open.** What bulk OK does to a position with no value entered. How starters reach an organisation — no seeding mechanism exists. Where `Advisor`, `Started` and per-section progress live now the rail has gone. And ShopCoach drafting, which QA cannot exercise.

**Closed 2026-09-10, and not to be reopened.** Hiding the per-side selector on rows where it never applies: **no** — the selector stays on every row and validation stays at four toggles. Reference-file types the viewer cannot display: HEIC, TIFF, Word and Excel **stay accepted**, and the viewer carries a download-only state until server-side conversion ships. The row-scope vocabulary: `1 per side` / `Outer + inner` everywhere, phone included. Reasoning in `DVI-V2-PRD.md` §14.

## Things removed on purpose

Listed together because several survived multiple review passes and should not come back. One entry left this list on 2026-09-03: a single bulk **OK** was reinstated at field, section and inspection level, because a technician filling four axles faced 48 verdict dropdowns and the workflow is to mark everything good and then correct the exceptions. Bulk Monitor, bulk Not OK, and any shortcut that writes a measured value remain out.

- Conditional follow-up, in every form
- Acknowledgement toggles
- The four-pill verdict row per measurement
- The STATUS column and the ROW column
- The by-row status legend
- The axle roll-up badge and "X of Y positions" counters
- The status badge in a card's top-right corner
- Row background tints and red card outlines
- The unit in brackets in a builder row name
- The Replace-file button
- Video upload
- On phone: the bottom back button, verdict dots, the axle-chip dot, the bottom axle strip, the requirement bar
- The Single/Dual confirmation dialog

## QA review · 2026-09-08

Built, shipped to `sv8181`, reviewed by Fabian and Sasha. Reasoning lives in `DVI-V2-build-spec.md` §9 — read it before changing any of this back.

**"Runs" is now "Times used"** on Admin › Inspection Templates, desktop and phone: `Times used (30 days)`, the column header `Times used`, `Used/30d` on the phone chip, `3 times used`, `Used 4,218 times · v2`, and *"Inspections already completed from this template stay counted in reports."* That list screen has **no artboard in this bundle**; the copy is the whole of its design. The API field stays `total_runs`.

**Secondary descriptors are gone from the starter cards** — an icon, a name, and a `PENDING` badge where it applies. The type-card hints under *Or build from scratch* stay, because a field type's name does not say what the field produces. The broader ask — sweep the product for redundant second lines — is **not done** and should be scoped as its own pass.

**"Axle set" is gone**, with two tooltips in its place — one on the type card, one on the new `AXLES` field. The preview dialog that first answered this was dropped.

**Five starters carry content, the equipment slot is pending**, and no seeding mechanism exists.

Earlier QA-pass divergences, now drawn: photo and note together in the card footer; no tooltip arrow; the completed screen carries the section-by-section review under its card, with the lock in words and no status pill or section rail; the `Build lines` menu identical at all three entry points, its target row reading `S-81 · Approved`.

**Open:** `Advisor`, `Started` and per-section progress lost their home when the rail went. M3's outstanding-per-position list is unimplemented and unreviewed. ShopCoach drafting is not testable on QA. `POST /inspections/{id}/submit` returns an uncaptured 400.
