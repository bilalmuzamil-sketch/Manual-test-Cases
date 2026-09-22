# PRD — Digital Inspections V2

**SV-8181** · Shopview · Product requirements + implementation contract
Last revised 10 September 2026 · owners: Fabian Bonjean (domain), Sasha Grosman (product)

---

## 0 · How to use this document

This is the single document to work from. It states the requirement, the logic behind it, and the
check that proves it was built right. It is written so an implementation can be **verified against
it line by line** without a designer in the room.

Structure:

| § | Contents |
| --- | --- |
| 1 | Problem, goals, non-goals, success measures |
| 2 | Users and jobs |
| 3 | Surfaces in scope |
| 4 | Domain model and invariants — **read before writing any code** |
| 5 | Functional requirements `FR-01…FR-24`, each with logic + acceptance + self-check |
| 6 | Screen requirements, per surface |
| 7 | Copy deck — exact strings |
| 8 | Design tokens |
| 9 | Validation and submit logic |
| 10 | Edge cases |
| 11 | **Self-verification protocol** — the gates to run before calling it done |
| 12 | Test matrix |
| 13 | Deletions to schedule |
| 14 | Decision log: decided / deferred / rejected |
| 15 | Open questions — do not invent answers |
| 16 | Artboard map and companion files |

**Companion files in this bundle**

| File | Role |
| --- | --- |
| `README.md` | Screen-by-screen design documentation — every layout, measurement, colour, copy string. The visual reference. |
| `DVI-V2-build-spec.md` | Numbered build spec, §1–§9. Deeper detail per surface than this PRD carries. |
| `DVI-V2-user-stories.md` | Acceptance criteria as stories (`TB-*`, `FD-*`, `FM-*`, `WO-*`). |
| `*.dc.html` | The designs themselves. `A6` carries working logic — **run it**; it answers behaviour questions faster than prose. |

The `.dc.html` files are **design references written in HTML**, not production code. Recreate them in
the target codebase with its own framework and component library. Fidelity is **high**: colours,
type, spacing, radii and copy are final. Where a prototype hardcodes a hex that the design system
exposes as a token, use the token.

---

## 1 · Problem, goals, non-goals

### 1.1 The problem

Digital inspections V1 asks a technician to answer a form, then asks a service advisor to read that
form and retype its findings as work-order lines. Three things break:

1. **A verdict is attached to the wrong thing.** V1 puts one status on a row, so a dual axle whose
   left outer tire is bald and left inner is fine has no way to say so. Technicians work around it by
   creating one field per wheel, which makes templates unmaintainable.
2. **Volume.** A four-axle unit is 48 verdicts. V1 removed every bulk shortcut, so the ordinary case —
   the unit is fine — costs the same as the exceptional one.
3. **The hand-off is manual.** Findings are read by a human and retyped as lines, which loses detail
   and takes advisor time on every job.

### 1.2 Goals

| # | Goal | Measure |
| --- | --- | --- |
| G1 | A verdict describes the smallest thing it applies to | A dual axle records four independent tire verdicts with no extra field |
| G2 | The ordinary case is one action | Marking a fully-measured 3-axle unit OK takes 1 press, not 36 |
| G3 | A template author can see what the technician will get, before publishing | No support ticket of the form "I made four fields when I needed one"; no author needs a work order to inspect their own template |
| G4 | Findings reach the work order without retyping | Advisor drafts lines from an inspection in one action |
| G5 | Nothing is invented on the technician's behalf | No position ever carries a verdict the technician did not cause |

### 1.3 Non-goals

- Automatic verdicts derived from value ranges. Rejected — §14.
- Redesigning the value control. Deferred — §14.
- A template marketplace, template search, or template sharing between organisations.
- Offline fill. The phone experience assumes connectivity.
- Migrating existing templates' validation settings. New defaults apply to newly created fields only.

### 1.4 Success measures

- Median time to complete a 3-axle PM inspection falls below the V1 median.
- Share of inspections that produce work-order lines without manual retyping rises.
- Zero inspections in which a verdict exists on a position with no technician action (§4 invariant I3
  — this is assertable in the database).

---

## 2 · Users and jobs

| User | Job | Where |
| --- | --- | --- |
| **Shop manager / owner** | Build and maintain the templates the shop runs | Template builder, desktop mostly, phone occasionally |
| **Technician** | Fill an inspection on a unit, hands dirty, often on a phone at the vehicle | Fill screens, desktop and phone |
| **Service advisor** | Turn findings into authorised work | Work order, ShopCoach line builder |

Design consequences that follow from the technician's context and are not negotiable: touch targets
≥44px on phone, no horizontal scrolling on phone, no modal that hides the thing it acts on, and no
destructive action without an undo.

---

## 3 · Surfaces in scope

| Surface | Platform | Artboards |
| --- | --- | --- |
| Template builder | Desktop | `TB1`–`TB4`, `TB7` |
| Inspection fill | Desktop | `A1`–`A3`, `A5` full screen, `A5b` after bulk OK, `A6` live |
| Inspection fill | Phone | `M1`–`M6` |
| Work-order hand-off + ShopCoach | Desktop | `A`–`F` |
| Work-order hand-off + ShopCoach | Phone | `P1`–`P4` |
| Admin › Inspection Templates (list) | Both | **No artboard.** Copy deck in §7.4 is the whole design. |

---

## 4 · Domain model and invariants

### 4.1 Model

```
Template  { id, orgId, name, version, sections[] }
Section   { id, name, order, fields[] }

Field     { id, label, order, type, referenceFile?, rules, axleCount?, rows[]? }
  type          : 'text' | 'checkbox' | 'measurement' | 'axleSet'
  referenceFile : { name, mime, sizeBytes }   // always available; never conditional on an answer
  rules         : { required, photo, photoIfNotOk, noteIfMonitorOrNotOk }
  axleCount     : integer, axleSet only, default 3, range 2–5   // a STARTING POINT, not a limit
  rows[]        : axleSet only

Row       { id, name, unit, perTire }
  unit    : 'psi' | 'mm' | 'in.' | '32nds' | 'ft-lbs'   // system default 'in.'
  perTire : boolean   // false → one value per side, regardless of axle config

Inspection { id, templateId, assetId, workOrderId?, status, axles[], answers[] }
Axle       { id, order, brake: 'drum'|'disc', config: 'single'|'dual' }
Answer     { positionKey, value?, verdict? }
Verdict    : 'ok' | 'mon' | 'bad' | 'na'      // absent/undefined === Not inspected
```

### 4.2 Position keys

```
positionKey = `${fieldId}:${rowId}:${axleId}:${position}`

position, perTire row on a dual axle : 'lo' | 'li' | 'ri' | 'ro'
position, any other case             : 'l'  | 'r'
```

Reading order across the screen is `lo, li, ri, ro` — left outer, left inner, right inner, right
outer. It mirrors how a technician walks the axle; do not reorder it to `lo, li, ro, ri`.

### 4.3 Invariants — assert these

| # | Invariant | Why |
| --- | --- | --- |
| **I1** | A verdict is stored **only** at position level. Row, axle, field and section verdicts are always computed. | One writer, no reconciliation bugs |
| **I2** | `'na'` is never written as a default, by any code path, including bulk OK. | G5 |
| **I3** | No `Answer` row exists with a `verdict` the technician did not cause — no seeding, no migration fill, no "complete the record" job. | G5, and it is auditable |
| **I4** | `Not inspected` is the absence of a verdict, not a value of it. It never appears as a selectable option. | It is a state, not a judgement |
| **I5** | A measured `value` is only ever written by direct typing. No bulk action, default, or derivation writes one. | Fabian's rule; a reading nobody took is a liability |
| **I6** | `axleCount` constrains nothing at fill time. The technician can add and remove axles freely. | It is a default |
| **I7** | Verdict colour appears on the input border, the marker, and status chips only — never as a container or card background. | Noise control; decided in V2 design |

### 4.4 Roll-up

```
WORST_ORDER = ['bad', 'mon', 'ok', 'na']        // 'bad' wins; absent loses to everything

worst(verdicts):
  present = verdicts.filter(v => v)             // drop absent
  if present.isEmpty: return undefined          // → Not inspected
  return first of WORST_ORDER found in present
```

| Level | Computed from |
| --- | --- |
| Measurement row | `worst()` of its positions on that axle |
| Axle | `worst()` of its rows |
| Field | `worst()` of its axles |
| Section | `worst()` of its fields |
| Top-view tire | `worst()` of every verdict entered for that tire so far. Absent → grey. **Some but not all** of its rows judged → same tint, **dashed** border. |

### 4.5 Single ↔ Dual

Two value stores per row are kept side by side **for the session**: `dual` and `single`. Switching
never opens a confirmation dialog and never loses typed data.

```
dual → single :  copy lo→l, ro→r  (value AND verdict); clear li, ri
                 // the OUTER readings survive — they are the ones a technician takes first
single → dual :  restore the previous dual store untouched
submit        :  stamp axle.config; persist only the store matching that config
```

The alternate store is **session state, not persisted**. A technician who switches, submits, and
reopens does not get the other store back.

---

## 5 · Functional requirements

Each requirement carries **Logic** (what to implement), **Accept** (what must be observably true),
and **Self-check** (the assertion or probe that proves it).

### 5.1 Template builder

---

#### FR-01 · Per-axle field type

**Logic.** A field of type `axleSet` holds `rows[]` and an `axleCount`. One such field covers the
whole unit; axles are instances created at fill time, not authored.

**Accept.** The type appears in the add-field palette as **`Per axle`** with hint *"Measurement rows
repeated per axle"*. Adding one creates an empty measurement-row table and a default label of
**`New axle measurements`**. The word "set" appears nowhere in any label, hint, tooltip or heading.

**Self-check.** `grep -ri "axle set"` across templates, copy files and fixtures returns nothing.

---

#### FR-02 · Measurement rows

**Logic.** Rows are ordered children of an `axleSet` field. Add, rename, reorder (drag), delete.

**Accept.** Renaming is **inline on the row**, committed by a check and discarded by an X. No modal
opens for a rename. Drag reorders. The rows section is headed **`MEASUREMENT ROWS · EVERY AXLE`**.

**Self-check.** Renaming a row never mounts a dialog — assert no `role="dialog"` appears in the DOM
during a rename.

---

#### FR-03 · Unit per row

**Logic.** `row.unit`, from `psi | mm | in. | 32nds | ft-lbs`. System default `in.`.

**Accept.** A unit selector sits on each row. **The row name never carries the unit in brackets.** A
row whose unit equals the default shows the plain grey word **`Defaults`**; a row that differs shows
its unit. That line sits between the row name and its options at helper-text size, costing one line
of height.

**Self-check.** No row label matches `/\(.*\)$/` containing a unit token.

---

#### FR-04 · Per-tire or per-side scope

**Logic.** `row.perTire`. `true` → the row follows the axle's Single/Dual config. `false` → always
one value per side, whatever the config.

**Accept.** A two-value control on each row. Desktop vocabulary: **`1 per side`** / **`Outer + inner`**.

**Self-check.** With an axle set to Dual, a `perTire: false` row renders exactly 2 inputs and a
`perTire: true` row renders exactly 4.

**One vocabulary everywhere.** `1 per side` / `Outer + inner`, desktop and phone alike — closed on 2026-09-10 in favour of the desktop wording.

---

#### FR-05 · Reference file

**Logic.** `field.referenceFile`, one per field, unconditional.

**Accept.** Always available on the field, never gated on an answer. Accepted types and the size
limit are stated **before** the upload, not after a failure. Removing is an X, then attach again —
**there is no Replace button**. Downloading is never the only way to read the document.

**Self-check.** The upload control renders its accepted-types and size-limit text with an empty
field state.

**Download-only types.** HEIC, TIFF, Word and Excel stay accepted, and the viewer states plainly that they
can only be downloaded — heading **This file can only be downloaded**, one sentence naming why and what
opens the file, a primary `Download {size}`, and a line confirming the field can still be answered without
opening it. PDF and image types render as before. **Specified here, not drawn** — the artboard was removed on 2026-09-16, so this section is the reference. This **contradicts** "downloading is never the only way to read the document", and the contradiction is
accepted and dated (2026-09-10) rather than hidden: server-side conversion is a separate ticket, and a
technician who has the file is better off than one who was refused the upload.

**Self-check.** A `.docx` or `.xlsx` reference file opens the download-only state, never a blank viewer, and
never blocks submit.

---

#### FR-06 · Validation rules

**Logic.** Four independent booleans on every field, editable at any time.

```
NEW FIELD DEFAULTS
  required             = false
  photo                = false
  photoIfNotOk         = false     // ← changed from true, 2026-09-03
  noteIfMonitorOrNotOk = true
```

**Accept.** Four toggles in **this order**, with these labels: `Required to complete`,
`Photo required`, `Photo required if Not OK`, `Note required if Monitor / Not OK`. A live plain-words
summary sits beneath them. Existing templates keep whatever they have — **this is not a migration**.

**Self-check.** Create a field programmatically; assert
`rules == {required:false, photo:false, photoIfNotOk:false, noteIfMonitorOrNotOk:true}`. Then load a
fixture template with `photoIfNotOk: true` and assert it is unchanged.

---

#### FR-07 · Axles default

**Logic.** `field.axleCount`, default `3`, options `2–5`. A starting point for a new inspection only —
invariant I6.

**Accept.** A row card in the same shape as the measurement rows, sitting **directly above
`+ Add Measurement Row`** so the panel reads top to bottom: what every axle is measured on, then how
many axles to start with. Title **`Axles`** at 13/600 with an `ⓘ`; muted line **`Select # of axles to
start with`** where a measurement row says *Defaults*; the panel's own unit-picker control at 104×32
desktop, 112×44 phone.  Tooltip: *"Most units of this kind have this many axles, so the technician starts with that many.
They can add or remove axles while filling the inspection in."*

**Accept (fill side).** The fill screen still offers `+ Add Axle` and per-axle delete. Setting
`axleCount` to 3 and then deleting an axle at fill time is legal and persists.

**Self-check.** Assert `axleCount` appears in no fill-time validation, no submit gate, and no
comparison against `axles.length`.

---

#### FR-08 · What the per-axle field covers

**Logic.** Two tooltips answer *what this field type is*. They do **not** answer *what am I building* —
that is FR-08a. Both are needed.

**Accept.** The `Per axle` **type card** in the palette carries an `ⓘ`:

> One field covers the whole unit. You define the measurement rows here, and the technician adds each
> axle while filling the inspection in — every row is then recorded per wheel position on every axle.

The **`Axles`** card carries the FR-07 tooltip. Both use the standard tooltip treatment: 300 ms hover
delay, grey-900 surface, white 12/16, radius 8, shadow-lg, **no arrow** (the implementation resolves
its side at runtime). Both are drawn in `TB2`.

**Self-check.** Both tooltips render on hover with no arrow element.

---

#### FR-08a · Preview mode

**Logic.** A template author must be able to see what they are building **while** building it. Today the
loop is: publish, open a work order, add the inspection, start it as a technician, find the problems, come
back to the builder and edit. That round trip is the cost this removes.

The builder has two modes at template level:

```
mode   : 'edit' | 'preview'
device : 'desktop' | 'phone'      // preview only
```

**Preview renders the real fill experience from the current draft** — not a mock-up of it, and not the
published version. Unsaved edits appear in it.

**Accept.**

- An `Edit` / `Preview` segmented control in the builder sub-header, 34px, `1px #CDD5DF`, selected half
  `#364152` on white, pencil icon on Edit and eye icon on Preview. It sits left of `Save Draft`.
- **In Preview the properties panel steps aside and the canvas takes its width.** This is the whole reason
  the preview works here and did not work in the panel — the panel is ~360px and the axle grid needs
  ≥800px. The sections rail stays, so one section can be previewed at a time.
- **No banner, and nothing in its place.** An earlier draft explained the mode in an amber notice
  above the canvas. The `Edit` / `Preview` control already says which mode the author is in, and the canvas
  is visibly the fill screen. Removed 2026-09-10.
- The canvas renders the fill screen as §6.2 specifies it: inspection line, section header, field cards,
  value controls with verdict markers, `+ Add Axle` and the per-axle delete, the card footer.
- **The three Mark OK actions are not drawn at all.** Not inert, not greyed — absent. They set verdicts, and
  Preview sets none; an author previewing a template has nothing to mark OK. Their absence also keeps the
  canvas quiet enough to read as a template rather than a half-filled inspection.
  **Preview is read-only, with one exception: the axle control.** `+ Add Axle` and the per-axle delete both
  work, and the resulting count **writes back to the draft** — returning to Edit shows the new number on the
  `Axles` control (FR-07). Preview is where an author first sees the field at real size and works out that
  three is not enough; making them carry that number back by hand is the round trip this mode exists to
  remove.
- **Nothing else takes input.** No values, no verdicts, no Mark OK, no Add Note, no Add Photo. A reference
  file still **opens**, because that is a read. No `Answer` row and no inspection record is ever written;
  `axleCount` is the only draft field Preview may change.
- **Phone gets the same preview**, rendering the §6.3 layout at phone width — a template that reads well on
  a desktop can still be wrong in a technician's hand. It follows the width the builder is opened at; there
  is no device switcher in the sub-header.
- **Clicking any field in Preview returns to Edit with that field selected in the panel.** Hovering raises
  the card and turns its border `#257CFF` — the card is the affordance, so no `Edit this field` pill is drawn.
  This is what closes the loop: see the problem, click it, fix it.
- **No submit bar.** `Save & Exit` and `Submit & Generate Report` are not rendered in Preview. They belong
  to an inspection, not a template, and an inert Submit invites the author to think something can be
  sent. Everything else stays present-and-inert.
- Preview is available on a **draft**. It must not require publishing.

**Self-check.**

```
✓ entering preview mounts no Answer rows and creates no inspection record
✓ adding an axle in preview, then returning to Edit, shows the new number on the Axles control
✓ the three Mark OK actions are absent from preview, not merely inert
✓ no per-field edit pill is drawn; the hovered card itself is the click target
✓ values, verdicts, Add Note and Add Photo are inert in preview; a reference file still opens
✓ preview reflects an unsaved draft edit immediately (rename a row, switch mode, see the new name)
✓ the properties panel is absent in preview; the canvas column widens
✓ clicking a previewed field lands in edit mode with that field selected
✓ no banner, notice or helper paragraph is rendered in preview
✓ phone preview has no horizontal scroll and no target under 44px
```

Drawn in **`TB7`** — desktop and phone side by side.

---

#### FR-09 · Starter library

**Logic.** Six starter slots. Five carry template content; the equipment slot is a placeholder awaiting its
own definition.

| Starter | Base | Content |
| --- | --- | --- |
| Class 8 Tractor PM Inspection | Truck | 4 sections · 77 fields |
| DOT Annual Federal Inspection | Truck | 12 sections · 50 fields |
| Air Brake Inspection | Truck | 3 sections · 15 fields |
| Trailer Inspection | Truck | 5 sections · 20 fields |
| Light Duty PM | Truck | 4 sections · 29 fields |
| Equipment starter | Equipment | pending, unnamed |

Content comes from Cody's seed templates. **Where the same thing is measured on every wheel position, those
templates use one per-axle field rather than one field per position** — that is the point of the type, and a
seed that fans it out into per-position fields would teach the wrong pattern. The DOT form keeps its own
structure. Only the equipment slot stays `PENDING`.

Card copy is unchanged: an icon and a name, no second line. The counts above are for whoever loads the seed
data, not for the card.

**Accept.** Heading **`Start from a template`** at 13px/600 in grey-900, left-aligned, with one helper line — *Select a template to start building the inspection.* — the same treatment as `Or build from scratch` below it, so the two routes read as a pair. Two-column grid of **equal 52px rows**, so a seventh and eighth entry drop in without
relayout. A card is an **icon and a name** — no second line; the template name describes itself.
Pending cards carry a dashed border and a `PENDING` badge. A picked starter is an ordinary editable
template. No marketplace, no search.



**Self-check.** All six card heights are equal at both 1280px and the narrowest supported width.

**Open.** **No seeding mechanism exists** — how starters reach an organisation is a separate ticket,
§15 Q5.

---

#### FR-10 · Template list copy

**Logic.** "Runs" is out. The number means how many times a template has been used.

**Accept.** Exact strings in §7.4. The API field stays `total_runs` / `totalRuns` — it is a field
name, not something a user reads. **This surface has no artboard**; §7.4 is its whole design.

**Self-check.** No user-visible string contains "run" or "Runs" on this surface.

---

### 5.2 Filling an inspection — desktop

---

#### FR-11 · Verdict per position

**Logic.** Verdict is stored per `positionKey`. Invariant I1.

**Accept.** The value control is an input with a **verdict marker** joined to its right edge —
`38px` wide, tinted to the verdict, showing a dot and a chevron. Clicking the marker opens a
**`206px`** shadow-lg menu offering **OK, Monitor, Not OK, N/A**, the position named in the menu
header, the current option on a **`#F4FAFF`** row. The value and its verdict read as one control.

**Self-check.** Set `lo = bad` and `li = ok` on one row; assert both persist independently and the
row rolls up to `bad`.

---

#### FR-12 · Not inspected is the start

**Logic.** Invariants I2, I3, I4.

**Accept.** `Not inspected` is **not** in the verdict menu. Nothing is ever auto-filled to `N/A`.
Empty stays empty. A not-inspected input has a white fill and a `1px #CDD5DF` border.

**Self-check.** The verdict menu renders exactly 4 options. A freshly opened inspection has zero
`Answer` rows carrying a verdict.

---

#### FR-13 · Mark OK in bulk — the rules

**Logic.**

```
markOk(scope, targetId):
  keys    = positionsIn(scope, targetId)              // 'inspection' | 'section' | 'field'
  changed = keys.filter(k => verdictOf(k) === undefined)
  changed.forEach(k => setVerdict(k, 'ok'))            // values untouched — invariant I5
  lastBulk = { scope, targetId, changed }
  return changed

undoBulk():
  lastBulk.changed.forEach(k => clearVerdict(k))       // back to absent, NOT to 'na'
  lastBulk = null
```

**Accept.**

- It sets **OK** only. **No bulk Monitor. No bulk Not OK.** A bad finding stays a deliberate act.
- It sets **verdicts** only. Invariant I5.
- It **never overwrites a verdict already picked** — only absent positions change. So "mark
  everything good, then correct the two bad ones" works in either order.
- Correcting a position afterwards is the same single gesture as any other: its own marker menu.
  Nothing about the value control changes.
- `lastBulk` is cleared by **any** subsequent edit: `setVerdict`, `setValue`, or a Single/Dual switch.

**Self-check.** Set one position to `bad`, run `markOk('field', f)`, assert that position is still
`bad` and every other position in the field is `ok`. Then `undoBulk()` and assert the `bad` position
is untouched and the rest are **absent**, not `'na'`.

---

#### FR-14 · Mark OK in bulk — three levels, one pattern

**Logic.** Same operation, three scopes. Same wording, same treatment, same right edge, one level per
row — the level is read from the row the action sits on, not from the label.

| Level | Row it sits on | Label |
| --- | --- | --- |
| Inspection | Inspection line at the top of the canvas (name + *2 sections · 5 fields · …*) | **`Mark all OK`** |
| Section | Section header beneath it (`SECTION 1 OF 2` caption + 20px title + count) | **`Mark section OK`** |
| Field | Every field's own card header, right end | **`Mark field OK`** |

**Accept.**

- Every field type **that has a verdict** carries the field-level action — `axleSet`, `checkbox`,
  `measurement`. A **`text`** field has no verdict and carries **no action**.
- Treatment: a **text action, not a button** — `#175CD3`, weight 600, 13px at inspection level and
  12px below, 30px tall, 8px horizontal padding, radius 8, no border, no fill. Leading 14px check
  icon in `currentColor` at 2.5 stroke. Hover background `#F4FAFF`.
- Placement: inspection and section rows right-align to the canvas column (`max-width: 1040px`); the
  field action right-aligns inside its card header, inset only by the card's own padding, so all
  three read as one edge.
- **Nothing lands in the app bar or the work-order sub-header.** The inspection line is the top of
  the scroll, so the inspection-level action needs no scrolling to reach.
- The screen's primary remains **Submit**. Bulk OK must never be a primary button.

**Self-check.** Measure the right edge of all three actions at 1440px — they align. Assert a `text`
field's card header contains no bulk action.

---

#### FR-15 · Mark OK in bulk — tooltips

**Logic.** The tooltip carries the scope, which is what lets the labels stay short. Counts come from
the live inspection, not from static copy.

| Level | Tooltip |
| --- | --- |
| Inspection | *Marks every field in this inspection OK. 2 sections, 5 fields. Only what is still Not inspected changes; verdicts already picked stay. Values are never filled in.* |
| Section | *Marks every field in Section 1 OK. 3 fields, 38 positions. Only what is still Not inspected changes; verdicts already picked stay. Values are never filled in.* |
| Field, axleSet / measurement | *Marks every position in this field OK. 4 rows on 3 axles, 36 positions. Only what is still Not inspected changes. Values are never filled in.* |
| Field, checkbox | *Selects OK for this field. The same as pressing OK below.* |

Three sentences, always the same shape: **what it covers, what it leaves alone, what it never
touches.** Treatment: 300 ms delay, grey-900, white 12/16, radius 8, max 250px, shadow-lg, **no
arrow**. The live one is on `A6`.

**Self-check.** Hover each action and assert the count in the tooltip matches
`positionsIn(scope).filter(absent).length`.

---

#### FR-16 · Mark OK in bulk — after the press

**Logic.** No confirmation dialog before; an undo after. The same trade the Single/Dual switch makes.

**Accept.**

- The action on the row pressed is replaced **in place** by a green check and a count in success-text
  `#087443`, plus **`Undo`** as a text action on the same edge.
- **The count is in that level's own unit.** Inspection and section rows count **fields** —
  *"3 fields marked OK"*. A field counts **positions** — *"36 positions marked OK"*, singularising to
  *"1 position marked OK"*. A checkbox says *"Marked OK"*, with no count.
- **The state cascades.** Every level beneath the one pressed swaps its own action for the same check
  and its own count, so before and after read at a glance down the page. `Undo` appears **only** on
  the row that was pressed.
- The report clears on the next edit anywhere in the inspection, and the actions return.
- An action whose scope has nothing left absent renders **grey-400 `#9AA4B2`** and does nothing. It is
  **not hidden** — the pattern keeps its place.
- Drawn in `A5b`; live in `A6`.

**Self-check.** Press at section level; assert exactly one `Undo` in the DOM, and that each field card
beneath shows a check with its own position count.

---

#### FR-17 · Note and photo

**Logic.** They are the same kind of offer, so they share a row.

**Accept.** `Add Photo` and `Add Note` sit **together in the field card footer**. Never one in the
header and the other in the footer. The photo block still opens on its own the moment `photoIfNotOk`
bites.

**Self-check.** No field card header contains a photo control.

---

#### FR-18 · Single ↔ Dual switch

**Logic.** §4.5.

**Accept.** No confirmation dialog. Switching back restores typed values within the session. The
alternate store is not persisted between submissions.

**Self-check.** Type into `li`, switch to Single, switch back — `li` returns. Submit on Single and
reopen — it does not.

---

#### FR-19 · No verdict colour on containers

**Logic.** Invariant I7.

**Accept.** Verdict colour appears on the input border, the verdict marker, status chips and top-view
tires. Cards, panels and section backgrounds stay white / `#F8FAFC` regardless of verdict.

**Self-check.** With one position set to `bad`, assert the enclosing card's computed
`background-color` is unchanged from the not-inspected state.

---

### 5.3 Filling an inspection — phone

---

#### FR-20 · Phone layout rules

**Accept.**

- **No horizontal scrolling**, at any axle configuration.
- Every touch target ≥44px.
- **No bottom back button** — Android draws one, and it cost a row of screen.
- The footer is **section navigation only**: two half-width 52px buttons naming their destination,
  `Back: Section 1` / `Next: Section 2`. On the last section the forward action becomes
  **`Review & Sign`**, carrying a count of what is still outstanding.
- Axle switching lives in the sub-header chips.
- Verdict sheet: a bottom sheet titled with the position, the measurement and the value entered; four
  56px options; **no "Not inspected" option**.

**Removed on phone:** the coloured dot beside a verdict (the field is already coloured), the dot on
axle chips, the bottom axle-navigation strip, and the requirement bar above the footer.

**Self-check.** At 390px width, assert `document.documentElement.scrollWidth <= clientWidth` on every
fill screen, and that no interactive element's height is under 44px.

---

#### FR-21 · Mark OK in bulk on the phone

**Logic.** Same three levels, one per surface — the phone shows one thing at a time.

**Accept.**

| Level | Placement |
| --- | --- |
| Section | Full-width **44px** `Mark section OK` row at the foot of the section header (`M1`/`M2`) |
| Field | `Mark field OK` beside the field name in the axle screen's sub-header (`M4`/`M5`), 44px |
| Inspection | The single item in the **app-bar menu**, `Mark all OK` |

Single-answer fields keep their one-tap OK segment and get **no second action**. The footer gains
nothing. `M2` draws the app-bar menu on its own block beside the frame so it covers nothing.

**Self-check.** The app-bar menu contains exactly one action. The footer contains only navigation.

---

### 5.4 Work-order hand-off and ShopCoach

---

#### FR-22 · The completed inspection screen

**Logic.** The completed card answers *what happened*; the section-by-section review answers *what was
entered*. Without the second, a locked inspection has no readable record outside the PDF.

**Accept — the summary card.** The screen **leads** with it:

- The **completion line** — *Inspection completed*, then time, technician, and that the report was posted
  to the work order.
- **A count per verdict**, as tinted chips. **A verdict with no findings under it is not counted.** A zero
  reads as a finding at a glance, which is the opposite of what it says — so an inspection with nothing on
  Monitor draws no Monitor chip at all (`P4`).
- **A findings list.** Each flagged position names **field · axle · row · position** with the reading that
  earned it — *Brake & tire measurements · Axle 1 · Tire pressure · left outer · 42 psi*. A flagged field
  with no position (a checkbox) names itself and what it carries — *Slack adjuster travel · Note attached*.

**Accept — the footer, and the one line above it.**

| | Footer | The line above it |
| --- | --- | --- |
| With ShopCoach | `View PDF` · `Go to work order` · `Build lines` | Names the product **once**: *ShopCoach can turn these 3 findings into work order lines with labor and parts. You review everything before it is added.* |
| Without ShopCoach | `View PDF` · `Go to work order` | The same space carries a plain line: *These findings are on the customer report and in the work order note feed. The lines are added on the work order.* |

**Accept — below the card.** The read-only, section-by-section review of every answer stays — field name,
value, verdict chip. **The card answers what happened; the sections answer what was entered.** The header
is the 52px bar with the lock stated **in words**. **No coloured status pill** (on a wholly read-only
screen it competes with the verdict dots) and **no section rail**.

**Not carried onto this screen:** the service advisor, the inspection's start time, and per-section
progress. The first two belong to the work order the inspection was run on; progress means nothing once
the inspection is locked.

**Self-check.** An inspection with zero Monitor findings renders no Monitor chip. Every findings row names
its position. No element on the screen reads `Advisor`, `Started` or a section progress count.



---

#### FR-23 · ShopCoach line builder

**Logic.** Licensed per organisation. One action, one appearance, three entry points.

**Accept.**

- **`Build lines`** is a purple AI-badged action (`#7A5AF8`, surface `#F8F6FF`, border `#DDD4FF`).
- It appears in exactly these places: the completed-inspection screen, work order › **Notes**, and
  Customer › Asset › **Inspections**. The same target menu opens from all three — one action, one
  appearance.
- It **always lands the user on a review screen with lines already drafted**. Never a modal, never a
  prompt box, never a chat.
- Target rows read number and status only — **`S-81 · Approved`**. No line count: the payload does not
  carry one, and a menu sub-line is not worth a second request.
- When the org is not licensed, the action is absent — not disabled.

**Accept — on a phone.** The whole flow completes on the device the inspection was read on. No step sends
the technician to a desktop.

| Step | Phone treatment | Artboard |
| --- | --- | --- |
| Completed inspection | Summary card, then the section review. Footer actions stack full-width at 48px, `Build lines` first | `P1` |
| Target choice | The same two targets as the desktop menu, as a **bottom sheet** with 56px rows and a Cancel | `P2` |
| Review the drafted lines | Lines as cards — selection box, title, the findings they came from, labor and parts. Pre-selected, editable, deselectable. A footer strip carries the running total and `Add 2 Lines to S-81` | `P3` |
| Without ShopCoach | Two stacked actions and the plain line | `P4` |

**Self-check.** The menu markup is one shared component instance across all three entry points. At 390px no
hand-off screen scrolls horizontally and no target is under 44px.

**Note.** ShopCoach drafting is not testable on the QA deployment — §15 Q7.

---

#### FR-24 · Asset › Inspections table

**Logic.** An asset gets roughly one inspection a quarter. Ten rows in a year is not a list worth
filtering.

**Accept.** **No filter chips.** The table, its columns, and the rule that rows needing a work order
**sort first** all stay. One plain line above the table carries the actionable count:
*"2 of 14 have findings with no lines yet."* Nothing in ShopCoach purple — the sort order carries the
actionable set on its own.

**Self-check.** No chip, tab or segmented control renders above this table.

---

## 6 · Screen requirements

Geometry and layout per surface. `README.md` carries the same information with more measurement
detail; this is the summary an implementation can be checked against.

### 6.1 Template builder, desktop — `TB1`–`TB4`, `TB7`

```
1280 wide
├── app bar                    52px
├── sub-header                 52px
└── three columns
    ├── sections rail         236px
    ├── canvas                flex, #F8FAFC
    └── inspector panel       320px, 1px #E3E8EF left border
```

Field row in the canvas: 44px tall; grip handle left in grey-400; label 13px semibold; type + rules as
an 11px grey-500 subtitle; pencil and delete right, delete `#B42318`.

Inspector panel, top to bottom: `TYPE` · label · `MEASUREMENT ROWS · EVERY AXLE` (row cards) ·
**`Axles`** card · `+ Add Measurement Row` · `REFERENCE FILE` · `VALIDATION` (4 toggles + summary) ·
Duplicate / Delete.

The defaults are drawn in `TB3` and pinned in §FR-06.

### 6.2 Inspection fill, desktop — `A1`–`A6`

```
1440 wide
├── app bar                    56px
├── work-order sub-header      56px   ← "All changes saved" only; no bulk action here
└── body
    ├── sections rail         236px, #F8FAFC   (progress, photo budget, tech/advisor/started)
    └── canvas                flex, #F8FAFC, column max-width 1040px
        ├── inspection line   name + meta + Mark all OK
        ├── divider
        ├── section header    SECTION 1 OF 2 / title / count + Mark section OK
        └── field cards       header (title, type badge, Mark field OK — no descriptor, §7a)
                              body
                              footer (Add Photo, Add Note)
└── action bar                Save & Exit · Submit & Generate Report
```

Axle card internals: top view 186px on the left; grid to the right with a 196px measurement column
and two fluid side columns. Value control per §FR-11.

`A6` is live: verdicts, Single/Dual, bulk OK with tooltip and undo.

### 6.3 Inspection fill, phone — `M1`–`M6`

390px frame. App bar with the overflow menu (one item: `Mark all OK`). Section header with title,
progress and the full-width `Mark section OK` row. Field cards. Footer: two 52px navigation buttons.
Axle screens carry the field name and `Mark field OK` in the sub-header, with axle chips beneath.

### 6.4 Work order + ShopCoach — `A`–`F`

`A` completed, no ShopCoach · `B` completed with ShopCoach + the answers review · `B2` target menu ·
`C` Notes tab · `D` work order created · `E` review screen with drafted lines · `F` Asset ›
Inspections table.

---

## 7 · Copy deck

Exact strings. Sentence case for helper text, Title Case for product nouns and actions.

### 7.1 Bulk OK

| Element | String |
| --- | --- |
| Inspection action | `Mark all OK` |
| Section action | `Mark section OK` |
| Field action | `Mark field OK` |
| Report, inspection/section | `3 fields marked OK` |
| Report, field | `36 positions marked OK` · singular `1 position marked OK` |
| Report, checkbox field | `Marked OK` |
| Undo | `Undo` |

Tooltips: §FR-15.

### 7.2 Per-axle field

| Element | String |
| --- | --- |
| Mode control | `Edit` · `Preview` |
| Preview banner | `Preview` — *Nothing here is saved. This is the fill screen a technician gets from this template, with the 3 axles it starts them on.* |
| Field hover in preview | `Edit this field` |
| Type card name | `Per axle` |
| Type card hint | `Measurement rows repeated per axle` |
| Type card tooltip | *One field covers the whole unit. You define the measurement rows here, and the technician adds each axle while filling the inspection in — every row is then recorded per wheel position on every axle.* |
| New field label | `New axle measurements` |
| Rows section heading | `MEASUREMENT ROWS · EVERY AXLE` |
| Axles card title | `Axles` |
| Axles card helper | `Select # of axles to start with` |
| Axles tooltip | *Most units of this kind have this many axles, so the technician starts with that many. They can add or remove axles while filling the inspection in.* |
| Add row | `+ Add Measurement Row` |
| Add axle, fill screen | `+ Add Axle` |

### 7.3 Validation

| Toggle | Default, new field |
| --- | --- |
| `Required to complete` | off |
| `Photo required` | off |
| `Photo required if Not OK` | **off** |
| `Note required if Monitor / Not OK` | **on** |

Summary example: *"The technician must provide an answer, a photo when Not OK, a note when Monitor or
Not OK."* — built from whichever toggles are on.

### 7.4 Admin › Inspection Templates — no artboard, this is the design

| Where | String |
| --- | --- |
| Desktop KPI card | `Times used (30 days)` |
| Table column header | `Times used` |
| Phone KPI chip | `Used/30d` |
| Phone card suffix | `3 times used` |
| Phone action sheet meta | `Used 4,218 times · v2` — singular `Used 1 time · v2` |
| Phone archived banner | *Inspections already completed from this template stay counted in reports.* |

API field unchanged: `total_runs` / `totalRuns`.

### 7.5 Fill and hand-off

| Element | String |
| --- | --- |
| Save state | `All changes saved` |
| Actions | `Save & Exit` · `Submit & Generate Report` |
| Phone footer | `Back: Section 1` · `Next: Section 2` · `Review & Sign` |
| Section caption | `SECTION 1 OF 2` |
| ShopCoach action | `Build lines` |
| Asset table line | `2 of 14 have findings with no lines yet` |
| Verdicts | `OK` · `Monitor` · `Not OK` · `N/A` — and `Not inspected` as a state, never an option |
| Scope control, desktop | `1 per side` · `Outer + inner` |

---

## 7a · Standing rule — no unspecified explanatory text

**Add no descriptor line, hint text or helper paragraph that this document does not ask for.** Not under a
field name, not under a card, not above a control, not below a canvas.

Where an explanation is genuinely needed this document says **on demand**, and that means one thing: an
information affordance (an `ⓘ`) with a tooltip. Never permanent text on the surface.

What this has already removed, and what will be removed again if it reappears:

- Second lines under the starter cards (FR-09) — the template name says it
- The descriptor in **every** fill field-card header, on every field type and on every artboard — *4
  measurement rows · verdict per tire*, *note required if Monitor / Not OK*, *one value · psi*, *3 axles to
  start*. The field name, the type badge and the visible contents say it. A validation rule surfaces when it
  bites, not as permanent subtext
- The preview banner (FR-08a) — the mode control says it

**What is specified, and therefore stays:** the 11px subtitle on a **builder canvas field row** (§6.1), which
carries type and rules in a list where neither is otherwise visible; the `Defaults` line on a measurement row
(FR-03); and the axle-state line on a collapsed axle (*Drum · Dual*), which is state, not description.

The two per-axle explanations that remain (FR-08) are tooltips, which is why they remain. This has been
removed by hand from several handoffs across different designers; treat it as the default, not a note on
one screen.

---

## 8 · Design tokens

Read from `_ds/shopview-design-system-…/colors_and_type.css`. Do not hardcode.

| Role | Value |
| --- | --- |
| Primary action | `#257CFF` · hover `#1752C0` · active `#042260` · disabled `#B7D5FF` |
| Info text — bulk OK, links | `#175CD3` · fill `#E9F5FF` · hover wash `#F4FAFF` |
| ShopCoach / AI | `#7A5AF8` · surface `#F8F6FF` · border `#DDD4FF` |
| Text | `#202939` · `#364152` · `#4B5565` · `#697586` · `#9AA4B2` (disabled only) |
| Surfaces | white · `#F8FAFC` canvas and footers · `#EEF2F6` chips and page |
| Borders | `#E3E8EF` subtle · `#CDD5DF` input and strong divider |
| OK | dot `#16B364` · fill `#EDFCF2` / `#D3F8DF` · text `#087443` |
| Monitor | dot `#F79009` · fill `#FFFAEB` / `#FEF0C7` · text `#B54708` |
| Not OK | dot `#F04438` · fill `#FEF3F2` / `#FEE4E2` · text `#B42318` |
| N/A | dot `#9AA4B2` · solid `#697586` |
| Radii | 8px controls · 12px cards and panels · pill badges · 20px phone frame |
| Shadow sm / lg | `0 1px 2px rgba(11,23,51,.05)` / `0 12px 24px rgba(11,23,51,.10), 0 4px 8px rgba(11,23,51,.05)` |
| Focus | `2px solid #257CFF` + `0 0 0 4px rgba(37,124,255,.24)` |
| Overlay | `rgba(15,17,26,0.5)`, no blur |
| Type | Inter. 24/32 semibold · 16/24 semibold · 14/20 body · 13px controls · 12px meta · 11px labels · 10px uppercase heads at 0.06em. **12px floor.** |
| Spacing | 4px grid: 4 8 12 16 20 24 32 40 48 64 |
| Geometry | app bar 52–56px · rails 236px · canvas column max 1040px · inspector 320px · phone target ≥44px |
| Value control | marker **38px** · menu **206px** · selected row **`#F4FAFF`** |
| Motion | 120–160ms ease-out; hover = colour shift + sm→md shadow; no scale, no bounce |

**Assets.** No images anywhere. Icons are Lucide-style outlined SVGs, inline, 1.5–2px stroke,
`currentColor`. Logos ship in the design system's `assets/`.

---

## 9 · Validation and submit logic

```
canSubmit(inspection):
  blockers = []
  for field in every field of the template:
    v = rollUpVerdict(field)                      // §4.4
    if field.rules.required and v is undefined:
      blockers.push({ field, reason: 'answer' })
    if field.rules.photo and field.photos.isEmpty:
      blockers.push({ field, reason: 'photo' })
    if field.rules.photoIfNotOk and v == 'bad' and field.photos.isEmpty:
      blockers.push({ field, reason: 'photo-not-ok' })
    if field.rules.noteIfMonitorOrNotOk and v in ['mon','bad'] and field.note.isBlank:
      blockers.push({ field, reason: 'note' })
  return blockers
```

Rules:

- A **not inspected** field is only a blocker when `required` is on. Absence is not an error by
  default — that is the whole "nothing is required, so nothing is auto-filled" principle.
- `photoIfNotOk` and `noteIfMonitorOrNotOk` evaluate against the **rolled-up** field verdict, not per
  position. One photo answers a field with four bad tires.
- Blockers are surfaced as a **count on the submit action**, which opens a list of what is missing,
  each item navigating to its field. On phone that list is `M3`.
- **Never** silently satisfy a blocker by writing a verdict or a value.

**Known QA defect to reproduce and fix:** `POST /inspections/{id}/submit` returns 400 on the QA
deployment with the response body uncaptured, so which of six backend validations fires is unknown. It
blocks report generation for the inspection it happens on. Capture the body first.

---

## 10 · Edge cases

| Case | Required behaviour |
| --- | --- |
| Bulk OK where every position is already judged | Action renders grey-400 and does nothing. Not hidden. |
| Bulk OK on a field with one `bad` position | The `bad` stays; everything absent becomes `ok`; report counts only what changed |
| `Undo` after an intervening edit | Not possible — the report cleared on that edit |
| Undo restores | Absent, **never** `'na'` |
| Dual → Single with `li` typed | `li` is cleared from the visible store but survives in the session dual store |
| Single → Dual after submit and reopen | Dual store is gone; positions are absent |
| Axle deleted after bulk OK | Its positions leave the roll-up; the report count is historical and does not recompute |
| `text` field | No verdict, no bulk action, no verdict marker |
| `checkbox` field bulk OK | Selects OK; report reads `Marked OK` with no count |
| Template with `photoIfNotOk: true` created before this release | Unchanged. New defaults apply to new fields only. |
| `axleCount: 5`, technician deletes to 2 | Legal, persists, no warning |
| Reference file of a type no viewer supports | **Open** — §15 Q3. Do not ship a download-only dead end silently. |
| Position with no value entered, hit by bulk OK | **Open and blocking** — §15 Q1. Do not choose for the product. |

---

## 11 · Self-verification protocol

Run these gates before calling any part of this done. They are ordered cheapest first.

### Gate 1 · Invariant assertions (unit level)

```
✓ I1  no verdict is persisted at row, axle, field or section level
✓ I2  grep the codebase: no assignment of 'na' outside an explicit user selection
✓ I3  a freshly created inspection persists zero verdicts
✓ I4  the verdict menu renders exactly 4 options; 'Not inspected' is not among them
✓ I5  no code path writes Answer.value except a change handler on a text input
✓ I6  axleCount appears in no validation, gate, or comparison against axles.length
✓ I7  no container background is driven by a verdict
```

### Gate 2 · Bulk OK behavioural matrix

| Setup | Action | Expected |
| --- | --- | --- |
| all absent | `markOk('field')` | all `ok`; report = position count |
| one `bad`, rest absent | `markOk('field')` | `bad` intact; rest `ok`; report excludes the `bad` |
| all judged | render | action grey-400, inert |
| after any press | `setValue` anywhere | report gone, actions back |
| after press | `undoBulk` | changed → absent; untouched → untouched |
| `markOk('section')` | render | one `Undo`; each field beneath shows its own count |

### Gate 3 · Copy audit

```
✓ grep -ri "axle set"        → 0 hits
✓ grep -ri "\bruns\b"        → 0 user-visible hits (total_runs in API only)
✓ grep -ri "Mark all fields" → 0 hits (superseded label)
✓ grep -ri "Mark all positions OK" → 0 hits (superseded label)
✓ every string in §7 appears verbatim, including the singular/plural variants
```

### Gate 4 · Layout probes

```
✓ the three bulk-OK actions share one right edge at 1440px
✓ all six starter cards report equal height
✓ phone: scrollWidth <= clientWidth at 390px on every fill screen
✓ phone: no interactive element under 44px
✓ tooltips render with no arrow element
✓ verdict marker is 38px; verdict menu is 206px; selected row is #F4FAFF
✓ no field card header contains a photo control
```

### Gate 5 · Cross-document consistency

```
✓ every claim in §5 has a matching artboard in §16
✓ preview writes nothing: run the whole preview flow, then assert the inspection tables are untouched
✓ nothing in §14 "deferred" or "rejected" was implemented
✓ no §15 open question was answered in code without a product decision
```

### Gate 6 · The reversal check

Four decisions in this release **reverse** earlier ones. Confirm none of them has been quietly
reinstated by pattern-matching against older code or docs:

```
✓ bulk OK exists (it was removed once)
✓ Asset › Inspections has no filter chips (they existed once)
✓ photoIfNotOk defaults OFF (it defaulted on once)
✓ starters are 2 active + 4 pending (they were 2 placeholders, then 5 "seeded")
```

---

## 12 · Test matrix

| Area | Story ids | What to test |
| --- | --- | --- |
| Builder — per-axle field | `TB-01`, `TB-08`, `TB-09` | Type name, default label, both tooltips, axles card and its 2–5 menu |
| Builder — preview mode | `TB-11` | Mode control, panel steps aside, draft edits reflected, nothing written, click-to-edit, phone width |
| Builder — rows | `TB-02`, `TB-03`, `TB-04` | Inline rename, drag reorder, units, per-tire vs per-side input counts |
| Builder — reference file | `TB-05` | Types and limit stated up front; X-then-attach, no Replace |
| Builder — validation | `TB-06` | New-field defaults; existing templates untouched; live summary |
| Builder — starters | `TB-07` | Six slots, 2 active, 4 pending, equal heights, no second line |
| Builder — template list | `TB-10` | Every string in §7.4, singular and plural |
| Fill desktop — verdicts | `FD-01`, `FD-02` | Per-position independence, 4-option menu, nothing auto-filled |
| Fill desktop — bulk OK | `FD-07` | The whole of Gate 2, plus tooltips and cascade |
| Fill desktop — note/photo | `FD-08` | Both in the footer |
| Fill — download-only file | `FD-05` | .docx / .xlsx / .heic / .tiff open the download-only state, never a blank viewer, never block submit |
| Fill desktop — single/dual | `FD-03` | Switch, restore, submit, reopen |
| Fill phone | `FM-01`, `FM-06` | No horizontal scroll, 44px targets, three bulk levels, footer unchanged |
| Hand-off | `HO-01`–`HO-06` | Completed screen review, one menu at three entry points, `S-81 · Approved` |
| Hand-off — summary card | `HO-07` | Completion line, per-verdict counts with **no zero counts**, findings naming field · axle · row · position with the reading; both footer states |
| Hand-off — phone | `HO-08` | Whole build flow on a phone: card, target sheet, drafted lines, Add Lines. No horizontal scroll, no target under 44px |
| Asset table | — | No chips, columns intact, work-order-needed rows sort first |

---

## 13 · Deletions to schedule alongside

**Conditional follow-up** — the builder UI, the fill UI, and the stored branch data. A branch per
response meant the author wrote four instructions and the technician met one. The reference file
covers the content need; validation covers the obligation. Also gone: the follow-up editor, nested
follow-up rows in the field list, and acknowledgement toggles.

Also removed, and not to be reinstated: the four-pill verdict row per measurement, the STATUS column,
the ROW column, the axle roll-up badge, and — on phone — the bottom back button, the dot beside a
verdict, the dot on axle chips, the bottom axle-navigation strip, and the requirement bar.

**Set-all shortcuts are NOT on this list.** They were, until 2026-09-03. A bulk **OK** is now part of
the release. What stays deleted is bulk Monitor, bulk Not OK, and any shortcut that writes a measured
value.

---

## 14 · Decision log

### Decided — 2026-09-03 review

| # | Decision | Reason |
| --- | --- | --- |
| 1 | Bulk **OK** returns at inspection, section and field level | Four axles is 48 dropdowns at two clicks each. The real workflow is to mark everything good, then change the two or three that are not. |
| 2 | Filter chips come off Asset › Inspections | About one inspection a quarter per asset. Ten rows in a year does not need filtering. |
| 3 | `Photo required if Not OK` defaults **off** | Not every flagged item should demand a photograph. The note rule stays on. |
| 4 | Six starter slots, two with content | These are the templates shops run; the rest turn on when defined. |

### Decided — 2026-09-08 QA review

| # | Decision | Reason |
| --- | --- | --- |
| 5 | "Runs" → "Times used" | Nobody could resolve what a "run" was |
| 6 | Secondary descriptors off the starter cards | The template name says it already |
| 7 | "Axle set" → `Per axle` + `New axle measurements` | A shop owner created four fields where one was wanted: *"axle set is not standard terminology"* |
| 8 | Axles default field, with tooltips | Two sentences answer *what the type is* where the question is asked |

### Decided — 2026-09-10

| # | Decision | Reason |
| --- | --- | --- |
| 10 | Preview renders **no submit bar** | The fill footer belongs to an inspection; an inert Submit suggests something can be sent |
| 11 | The preview **banner is removed**, with nothing in its place | The mode control already says which mode the author is in |
| 12 | **Q2 closed: no.** The per-side selector stays on every row; validation stays at four toggles | A template row is a template, not a named measurement |
| 13 | **Q3 closed.** HEIC, TIFF, Word and Excel stay accepted; the viewer gains a **download-only** state (§FR-05a). Conversion is a separate ticket | A technician who has the file is better off than one refused the upload. The contradiction with "downloading is never the only way" is accepted and dated |
| 14 | **Q4 closed:** `1 per side` / `Outer + inner` everywhere | One control, one vocabulary |
| 15 | Five starters carry content; only the equipment slot stays pending | Cody's seed templates supply them |
| 16 | The descriptor under a per-axle field in preview is **removed** | Same removal as the starter cards: the name and the visible contents say what it is |
| 17 | **Standing rule (§7a): no explanatory subtext unless specified.** Where an explanation is called for it is a tooltip on an `ⓘ`, never permanent surface text | Removed by hand from several handoffs across different designers |
| 18 | Preview is **read-only except the axle control**, whose count **writes back to the draft** | Preview is where an author sees the field at real size and finds three is not enough; carrying the number back by hand is the round trip the mode removes |

#### Preview mode


| # | Decision | Reason |
| --- | --- | --- |
| 9 | **Preview mode** in the builder — `Edit` / `Preview` at template level, the panel stepping aside so the canvas has the width, phone previewed at phone width (FR-08a) | *"It would still be nice for the user to see it, so they know what they are building and what it looks like… I build the inspection, then I wanted to see it. So I went to a work order, added it, then started the inspection as if I was a technician. Saw some issues with it, then had to go back to the inspection page to edit stuff again."* The tooltips explain the field type; they do not show the author their own template. |

### Deferred

**The value control** (input + verdict marker + menu). Picking a verdict takes two clicks, and a table
with all four options always visible would be faster to press. **Not changed in this release:** bulk OK
removes the volume that made the click count hurt, and the control is the atom of the whole release —
reworking it invalidates `A6`, `M6` and every measurement in the handoff. Revisit after bulk OK has
been in shops. Do not redesign it in this pass.

**Product-wide descriptor audit.** The broader form of decision 6 — *"wherever we can delete it, we
should, and focus on making the name as clear as possible"* — is a sweep across the product, not one
screen. Not started; scope it as its own pass.

### Rejected

**Automatic verdicts derived from value ranges.** Feasible, and proposed twice. Rejected for this
release: it needs a limit per row per unit per vehicle class, plus an override path and an answer to
who judged what. Recorded here so it is not proposed a third time.

### Not changed, deliberately

**The per-row scope selector** (`1 per side` / `Outer + inner`) stays in the template builder. It sets
the default the technician lands on, and a template row is a template, not a named measurement — the
row labelled "Brake lining" can be edited into anything.

---

## 15 · Open questions — surface, do not answer

| # | Question | Blocks |
| --- | --- | --- |
| **Q1** | **What does bulk OK do to a position with no value entered?** §4 says Not inspected is where a position starts, not a choice, and `'na'` is never written as a default. A bulk OK that stamps unmeasured positions contradicts that; one that silently skips them leaves the technician unsure the press did anything. Candidate answers: **(a)** stamp everything — simplest, but writes a verdict against a position nobody measured; **(b)** skip unmeasured and say so in the report (*"12 positions marked OK · 6 skipped, no value"*) — honest, but adds the sub-line this design just removed; **(c)** stamp everything and mark bulk-set verdicts as reversible until submit. `A5b` sidesteps it by showing values typed first. | **FR-13**, **FR-16** |
| **Q2** | **How do starters reach an organisation?** No seeding mechanism exists. Separate ticket. | FR-09 |
| **Q6** | **Where do `Advisor`, `Started` and per-section progress live** on the completed-inspection screen? They left with the section rail and have no home. | FR-22 |
| **Q7** | **ShopCoach drafting is not testable on QA** — the assistant is a separate deployment without the new line builder. What has been reviewed is the design and the entitlement gate, not drafting quality. | FR-23 |

One further item is **unimplemented and unreviewed**, not an open question: `M3`'s
outstanding-per-position list on the phone.

---

## 16 · Artboard map

| File | Artboards |
| --- | --- |
| `Digital Inspections V2 - All Screens.dc.html` | Everything below, merged into one scrollable document. **Duplicates the per-area files — any change must land in both.** |
| `Inspection Template Builder V2 - Desktop.dc.html` | `TB1` empty template + starter library · `TB2` full builder · `TB3` validation · `TB7` **Preview mode**, desktop and phone |
| `Inspection Fill V2 - Desktop.dc.html` | `A1` dual axle not inspected · `A2` grid detail · `A3` complete, mixed verdicts · `A5` **the whole screen as filled** · `A5b` **after Mark section OK** · `A6` **live** · `D3`/`D4` support states |
| `Inspection Fill V2 - Mobile.dc.html` | `M1`/`M2` section screens · `M3` outstanding list · `M4`/`M5` axle screens · `M6` verdict sheet |
| `ShopCoach Line Builder V2.dc.html` | `P1`–`P4` **the whole flow on a phone** · `A` completed no ShopCoach · `B` completed + answers review · `B2` target menu · `C` Notes tab · `D` work order created · `E` review with drafted lines · `F` Asset › Inspections |

Artboard ids and `data-screen-label` values are **stable and cited throughout this document**. Keep
them if you annotate anything.

---

## 17 · One warning

The merged file duplicates the per-area files. They have drifted apart once already. If you annotate,
correct or extend an artboard, land it in **both**, and keep every id as it is.
