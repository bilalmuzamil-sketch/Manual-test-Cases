# Claude Code handoff — Digital Inspections V2

SV-8181 · Shopview Design System · 8 September 2026

> **`DVI-V2-PRD.md` is the full product requirements document** — problem and goals, the domain
> model and its invariants, numbered requirements `FR-01`–`FR-24` each with logic + acceptance +
> self-check, the copy deck, submit logic, edge cases, a **self-verification protocol** (six gates),
> the test matrix, the decision log and the open questions. Read it as the contract; this file is the
> shorter orientation on top of it.

Start here. This file is the implementation brief: what to build, how it behaves, and where the
detail lives. It is self-sufficient for the parts that changed in the 2026-09-03 review; for
everything else it points at the three reference documents in this bundle.

---

## 1 · What this is

Digital Inspections V2 covers three things:

1. **Template builder** — a shop manager composes an inspection template: sections, fields, field
   types, units, validation rules, reference files.
2. **Inspection fill** — a technician fills that template on desktop or phone. Values are typed;
   each value carries its own verdict (OK / Monitor / Not OK / N/A).
3. **Work-order hand-off** — a finished inspection turns findings into work-order lines, optionally
   drafted by ShopCoach (the AI line builder, licensed per organisation).

### About the design files

Every `.dc.html` file in this bundle is a **design reference written in HTML** — a prototype of the
intended look and behaviour, not production code to lift. The job is to **recreate these designs in
the target codebase using its own framework, component library and patterns**. If no environment
exists yet, pick the appropriate framework for the product and implement there.

Two of the prototypes carry real logic and are worth running before you start, because they answer
behaviour questions faster than prose: **A6** (live axle grid: verdicts, Single/Dual, bulk OK,
tooltip, undo).

### Fidelity

**High fidelity.** Colours, type, spacing, radii and copy are final and come from the Shopview
Design System. Recreate them exactly, but build with the codebase's existing Shopview components
(Button, Input, Badge, Toggle, Table, Menu, Tooltip, Side-Panel) rather than re-styling raw markup.
Where a prototype hardcodes a hex that the design system exposes as a token, use the token.

---

## 2 · Reference documents

| File | What it holds |
| --- | --- |
| `PREVIEW-MODE-handover.md` | Preview mode (FR-08a) on its own — why, state, layout, copy, tokens, self-check, and what not to do. Build this feature from that file. |
| `DVI-V2-PRD.md` | **The PRD and implementation contract.** Requirements, logic, invariants, self-check gates, decision log, open questions. |
| `README.md` | Screen-by-screen design documentation: every artboard, layout, component, measurement, colour and copy string. The primary reference while building UI. |
| `DVI-V2-build-spec.md` | Numbered build spec. §1 principles · §2 template builder · §3 fill desktop · §4 fill phone · §5 work-order hand-off · §6 ShopCoach · §7 deletions to schedule · §8 the 2026-09-03 review: decisions, deferrals, rejections, open questions. |
| `DVI-V2-user-stories.md` | Acceptance criteria per behaviour, ids `TB-*` (builder), `FD-*` (fill desktop), `FM-*` (fill mobile), `WO-*` (hand-off). Use these as the test list. |

**Read `DVI-V2-build-spec.md` §8 before changing anything you disagree with.** Several decisions in
this release reverse earlier ones, and the reasoning is recorded there specifically so they are not
undone by the next reader.

---

## 3 · Artboard index

Artboard ids and `data-screen-label` values are stable and cited by the build spec — keep them if
you annotate anything.

| File | Artboards |
| --- | --- |
| `Inspection Template Builder V2 - Desktop.dc.html` | TB1 empty template + starter library · TB2 full builder · TB3 validation · TB7 Preview mode |
| `Inspection Fill V2 - Desktop.dc.html` | A1 dual axle not inspected · A2 grid detail · A3 partly judged · A5 **the whole screen as filled** · A5b **after Mark section OK** · **A6 live** · D3/D4 support states |
| `Inspection Fill V2 - Mobile.dc.html` | M1/M2 section screens · M3 outstanding list · M4/M5 axle-set screens · M6 verdict sheet |
| `ShopCoach Line Builder V2.dc.html` | A–F: inspection completed, notes tab, asset inspections table, work-order created, review screen · **P1–P4: the whole build flow on a phone** (card, target sheet, drafted lines, unlicensed variant) |
| `Digital Inspections V2 - All Screens.dc.html` | All of the above merged into one scrollable document. **Duplicates the per-area files — any change must land in both.** |

---

## 4 · The four decisions from the 2026-09-03 review

These are the deltas against any earlier version of this handoff.

1. **Bulk OK returns**, at inspection, section and field level. Fully specified in §5 below.
2. **Filter chips removed** from Asset › Inspections (ShopCoach artboard F). The table, its columns
   and the "rows needing a work order sort first" rule all stay. One plain line above the table
   carries the actionable count: *"2 of 14 have findings with no lines yet."*
3. **"Photo required if Not OK" defaults off** for a new field. New-field defaults are now:
   `Required to complete` off · `Photo required` off · `Photo required if Not OK` **off** ·
   `Note required if Monitor / Not OK` on. Existing templates keep whatever they have — this is a
   default for newly created fields only, not a migration.
4. **Six starter slots, five with content** — Class 8 Tractor PM Inspection (4 sections / 77 fields), DOT
   Annual Federal Inspection (12 / 50), Air Brake Inspection (3 / 15), Trailer Inspection (5 / 20), Light
   Duty PM (4 / 29). Only an unnamed equipment starter renders as a **pending placeholder** (dashed
   border, `PENDING` badge). Seeded templates use one per-axle field where the same thing is measured on
   every wheel position. A card is an icon and a name — no second line. Build the grid so a seventh
   and eighth entry drop in without relayout. No marketplace, no search. **No seeding mechanism
   exists** — how starters reach an organisation is a separate ticket.

5. **"Axle set" is gone.** The field type is `Per axle`; a new field's default label is
   `New axle measurements`. Two tooltips do the explaining: one on the **type card** in the palette
   (*one field covers the whole unit…*), one on a new **`AXLES`** field in the properties panel,
   directly above `+ Add Measurement Row` — a 104px select defaulting to `3`, hint *"Starting point
   for a new inspection"*, tooltip *"Most units of this kind have this many axles, so the technician
   starts with that many. They can add or remove axles while filling the inspection in."* It is a
   **default, not a limit**: the fill screen keeps `+ Add Axle` and axle delete. The rows section is
   labelled `MEASUREMENT ROWS · EVERY AXLE`.

7a. **No explanatory subtext anywhere unless this handoff asks for it** (PRD §7a) — no descriptor lines,
   no hint text, no helper paragraphs. Where an explanation is called for it is a tooltip on an `ⓘ`,
   never permanent text on the surface. Already removed once from the starter cards, the per-axle field
   descriptor and the preview banner.

8. **Preview mode** (PRD FR-08a, artboard `TB7`). An `Edit` / `Preview` control in the builder
   sub-header. In Preview the **properties panel steps aside
   and the canvas takes its width** — mount the real fill-screen component against the current draft,
   unsaved edits included, with every control **inert** (no `Answer` is ever written). 
   **No banner, no submit bar, no Mark OK actions and no per-field edit pill.** `+ Add Axle` and the **per-axle delete** both work, session-local and
   discarded. **Clicking a previewed field
   returns to Edit with that field selected**; hovering shows an `Edit this field` pill. Works on a
   draft — never requires publishing. Do not build this as a dialog: one was drawn and dropped.

6. **Template list copy:** `Times used (30 days)`, column `Times used`, phone `Used/30d`,
   `3 times used`, `Used 4,218 times · v2` (singular `Used 1 time · v2`), archived banner
   *"Inspections already completed from this template stay counted in reports."* The API field stays
   `total_runs` / `totalRuns`. That list screen has no artboard — this copy is its whole design.

7. **Note and photo** sit together in the field card footer, never one in the header. The Mark OK
   tooltip has **no arrow**. On the completed-inspection screen the section-by-section review of what
   was entered sits below the completed card, the lock is stated in words, and there is no status
   pill and no section rail. The `Build lines` menu is identical at all three entry points and its
   target row reads `S-81 · Approved`.

### Deliberately not changed

- **The value control** (input + verdict marker + menu). Two clicks to pick a verdict was raised;
  reworking it was **deferred**, because bulk OK removes the volume that made the click count hurt
  and the control is the atom of the whole release. Do not redesign it in this pass.
- **The per-row scope selector** ("1 per side" / "Outer + inner") stays in the template builder.
- **Automatic verdicts derived from value ranges** — **rejected** for this release.

---

## 5 · Mark OK — the one new behaviour, in full

### 5.1 Rules

- It sets **OK** only. There is no bulk Monitor and no bulk Not OK: a bad finding stays a deliberate
  act.
- It sets **verdicts** only. Measured values are always typed by hand; bulk never invents a reading.
- It **never overwrites a verdict already picked**. It fills only what is still `Not inspected`, so
  "mark everything good, then correct the two bad ones" works in either order.
- Correcting a position after a bulk press is the same single gesture as any other — its own marker
  menu. Nothing about the value control changes.

### 5.2 Three levels, one pattern

Same wording, same treatment, same right edge, one level per row — the level is read from the row
the action sits on, not from the label.

| Level | Row it sits on | Label |
| --- | --- | --- |
| Inspection | Inspection line at the top of the canvas (name + *2 sections · 5 fields · …*) | `Mark all OK` |
| Section | Section header under it (`SECTION 1 OF 2` caption + 20px title + count) | `Mark section OK` |
| Field | Every field's own card header, right end, after Add Photo | `Mark field OK` |

Every field type that has a verdict carries the field-level action — per-axle field, checkbox,
measurement. A **text** field has no verdict and carries no action.

**Treatment.** A text action, not a button: `#175CD3` (`--sv-info-text`), weight 600, 13px at
inspection level and 12px below it, 30px tall, 8px horizontal padding, radius 8, no border and no
fill. Leading 14px check icon in `currentColor`, 2.5 stroke. Hover background `#F4FAFF`. Quiet
enough to repeat three times; blue so it still reads as interactive (grey is reserved for disabled).
The screen's primary is still Submit.

**Placement.** Inspection and section rows right-align to the canvas column (`max-width: 1040px`);
the field action right-aligns inside its card header, inset only by the card's own padding, so all
three read as one edge. **Nothing lands in the app bar or the work-order sub-header.** The
inspection line is the top of the scroll, so the inspection-level action needs no scrolling.

### 5.3 Tooltip

300 ms hover delay, grey-900 (`#202939`) surface, white 12/16 text, radius 8, max 250px, shadow-lg,
8px arrow. Three sentences, always the same shape — what it covers, what it leaves alone, what it
never touches — with counts read from the live inspection:

| Level | Tooltip |
| --- | --- |
| Inspection | *Marks every field in this inspection OK. 2 sections, 5 fields. Only what is still Not inspected changes; verdicts already picked stay. Values are never filled in.* |
| Section | *Marks every field in Section 1 OK. 3 fields, 38 positions. Only what is still Not inspected changes; verdicts already picked stay. Values are never filled in.* |
| Field (per-axle field / measurement) | *Marks every position in this field OK. 4 rows on 3 axles, 36 positions. Only what is still Not inspected changes. Values are never filled in.* |
| Field (checkbox) | *Selects OK for this field. The same as pressing OK below.* |

The tooltip carries the scope, which is what lets the labels stay this short. The live one is on A6; all four strings are in the copy deck above.

### 5.4 After the press

No confirmation dialog before; an undo after — the same trade the Single/Dual switch makes.

- The action on the row pressed is replaced **in place** by a green check and a count in
  success-text (`#087443`), plus `Undo` as a text action on the same edge.
- **The count is in that level's own unit.** Inspection and section rows count **fields**
  (*"3 fields marked OK"*). A field counts **positions** (*"36 positions marked OK"*, singular
  *"1 position marked OK"*). A checkbox says *"Marked OK"* — it has no count.
- **The state cascades.** Every level beneath the one pressed swaps its own action for the same
  check and its own count, so before and after read at a glance down the page. `Undo` appears only
  on the row that was pressed.
- The report clears on the **next edit anywhere in the inspection** — a verdict, a value, a
  Single/Dual switch — and the actions return.
- Drawn in **A5b**; live in **A6**.

### 5.5 Phone

Same three levels, one per surface, because the phone shows one thing at a time:

- **Section** — full-width 44px `Mark section OK` row at the foot of the section header (M1/M2).
- **Field** — `Mark field OK` beside the field name in the axle-set screen's sub-header (M4/M5),
  44px. Single-answer fields keep their one-tap OK segment and get no second action.
- **Inspection** — the single item in the app-bar menu, `Mark all OK`. M2 draws that menu on its own
  block beside the frame so it covers nothing.

The footer stays section navigation (`Back: Section 1` / `Next: Section 2`) and gains nothing.

### 5.6 Open questions

**Where do `Advisor`, `Started` and per-section progress live on the completed screen?** They left with
the section rail and have no home in the design. Ask before inventing one.

**Needs an answer before you build bulk OK:**

**What does bulk OK do to a position with no value entered?**

§1 of the build spec says `Not inspected` is where a position starts, not a choice, and that `na` is
never written as a default. A bulk OK that stamps unmeasured positions contradicts that; one that
silently skips them leaves the technician unsure the press did anything. A5b sidesteps it by showing
values typed first. Get a product decision, then implement one of:

- **(a) Stamp everything.** Simplest, matches "one press and done", but writes a verdict against a
  position nobody measured.
- **(b) Skip unmeasured positions, and say so** in the report line (*"12 positions marked OK · 6
  skipped, no value"*). Honest, but adds the sub-line this design just removed.
- **(c) Stamp everything and mark bulk-set verdicts as reversible** until submit, so the technician
  can see which verdicts were pressed rather than judged.

Three questions that used to sit here were closed on 2026-09-10: the per-side selector stays on every row
(no fifth toggle); HEIC, TIFF, Word and Excel stay accepted and the viewer gains a download-only state; and the row scope reads `1 per side` / `Outer + inner` everywhere, phone included.

---

## 6 · Logic handoff

### 6.1 Data model

A template is sections → fields. A field has a type and, if it takes measurements, rows.

```
Template  { id, name, orgId, sections[] }
Section   { id, name, order, fields[] }
Field     { id, name, order, type, unit?, axleCount?, rows[]?, rules }   // axleCount: per-axle default, 3
           type: 'axleSet' | 'measurement' | 'checkbox' | 'text'
Rules     { required, photo, photoIfNotOk, noteIfBad }
           new-field defaults: false, false, false, true
Row       { id, label, unit, scope }        // scope: 'perSide' | 'perTire'
```

An inspection instance stores answers per position. A position key is
`fieldId:rowId:side[:tire]` — `left` / `right`, plus `outer` / `inner` when the axle is dual.

```
Answer   { positionKey, value?, verdict }
Verdict  'none' | 'ok' | 'monitor' | 'notok' | 'na'
```

`'none'` **is** *Not inspected*. It is the initial state, it is never a choice in the verdict menu,
and `na` is never written as a default.

### 6.2 Bulk OK

One operation, parameterised by scope. Resolve the scope to a set of position keys, set only the
ones currently `'none'`, and keep the list of what changed so undo is exact.

```
markOk(scope, target):
  keys    = positionsIn(scope, target)          // 'inspection' | 'section' | 'field'
  changed = keys.filter(k => verdictOf(k) === 'none')
  changed.forEach(k => setVerdict(k, 'ok'))     // values untouched
  lastBulk = { scope, target, changed }         // for undo + the report
  return changed

undoBulk():
  lastBulk.changed.forEach(k => setVerdict(k, 'none'))
  lastBulk = null
```

- `lastBulk` is cleared by any subsequent edit: `setVerdict`, `setValue`, or a Single/Dual switch.
- Report text: fields at inspection and section scope, positions at field scope, `"Marked OK"` for a
  checkbox. Cascading display is derived, not stored — a level shows the check when it sits inside
  `lastBulk`'s target.
- An action whose scope has nothing left `'none'` renders grey-400 (`#9AA4B2`) and does nothing.
  It is not hidden: the pattern keeps its place.

`markSetOk` / `undoBulk` in `Inspection Fill V2 - Desktop.dc.html` (the A6 logic class) is a working
reference implementation of exactly this, including the tooltip count and the report.

### 6.3 Other behaviour worth reading in the prototypes

- **Verdict lives on the value, not the row.** A dual axle can read "left outer Not OK, left inner
  OK" with no extra control.
- **Single ↔ Dual** switches with no dialog and no data loss: typed values return if the technician
  switches back within the session. Not persisted between submissions.
- **Validation** is four independent toggles per field, editable at any time; the panel shows a live
  plain-words summary of what the technician will be held to.
- **Reference files** attach per field. PDF and image types render in the viewer; HEIC, TIFF, Word and
  Excel open a **download-only** state — an accepted, dated contradiction of "downloading is never
  the only way to read the document", pending server-side conversion as its own ticket.
- **ShopCoach** is licensed per organisation and appears in exactly four places as a purple
  AI-badged `Build lines` action, always landing on a review screen with lines already drafted —
  never a modal, never a prompt box.

### 6.4 Deletions to schedule alongside

**Conditional follow-up** — builder UI, fill UI, and the stored branch data. Set-all shortcuts are
**not** on this list any more; what stays deleted is bulk Monitor, bulk Not OK, and any shortcut
that writes a measured value.

---

## 7 · Design tokens

Read these from `_ds/shopview-design-system-.../colors_and_type.css` rather than hardcoding.

| Use | Value |
| --- | --- |
| Primary / action | `#257CFF` · hover `#1752C0` · active `#042260` · disabled `#B7D5FF` |
| Info text (the Mark OK action, links) | `#175CD3` · fill `#E9F5FF` · hover wash `#F4FAFF` |
| Success | `#16B364` · fill `#EDFCF2` · text `#087443` |
| Warning | `#F79009` · fill `#FFFAEB` · text `#B54708` |
| Error | `#F04438` · fill `#FEF3F2` · text `#B42318` |
| Text | `#202939` headings · `#364152` body · `#4B5565` secondary · `#697586` meta · `#9AA4B2` disabled |
| Surfaces | `#FFFFFF` cards · `#F8FAFC` canvas and card footers · `#EEF2F6` chips and subtle dividers |
| Borders | `#E3E8EF` container · `#CDD5DF` input and strong divider · `2px #257CFF` focus |
| Radii | 8px controls · 12px cards and panels · pill badges |
| Shadows | sm `0 1px 2px rgba(16,24,40,.05)` · md `0 4px 8px rgba(11,23,51,.08), 0 1px 2px rgba(11,23,51,.05)` · lg `0 12px 24px rgba(11,23,51,.10), 0 4px 8px rgba(11,23,51,.05)` |
| Type | Inter; 30/38 H1 · 24/32 H2 · 20/28 H3 · 16/24 H4 · 14/20 body · 12/16 body-2 · 10/14 caption 600 +1.5% tracking. 12px floor. |
| Spacing | 4px grid: 4 8 12 16 20 24 32 40 48 64 |
| Geometry | app bar 56–64px · sections rail 236px · canvas column max 1040px · phone touch target ≥44px |
| Value control | marker 38px wide · menu 206px · selected option row `#F4FAFF` |
| Motion | 120–160ms ease-out; hover = colour shift + shadow-sm→md; no scale, no bounce |

**Assets.** No images. Icons are Lucide-style outlined SVGs, inline, 1.5–2px stroke, `currentColor`.
Logos ship in the design system's `assets/`. Nothing else to import.

---

## 8 · Test list

Drive from `DVI-V2-user-stories.md`. The stories that are new or changed in this pass:

- **FD-07** Mark OK in bulk, desktop — three levels, OK only, verdicts only, no overwrite, tooltip,
  cascading check + count, Undo until the next edit.
- **FM-06** Mark OK in bulk, phone — section header row, field header, app-bar menu; footer unchanged.
- **TB-06** Validation toggles — only the note rule arrives on for a new template.
- **TB-07** Starter library — five starters, seeded per organisation, editable after picking, pending
  sixth slot.
- Asset › Inspections — no chips, columns unchanged, work-order-needed rows still sort first.

---

## 9 · One warning

`Digital Inspections V2 - All Screens.dc.html` duplicates the per-area files. They have drifted apart
once already. If you annotate, correct or extend an artboard, land it in **both** the per-area file
and the merged one, and keep every artboard id and `data-screen-label` as it is — the build spec
cites them by name.
