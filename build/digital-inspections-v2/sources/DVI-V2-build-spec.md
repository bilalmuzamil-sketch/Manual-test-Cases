# Digital Inspections V2 — build spec

SV-8181 · Shopview Design System · companion to `DVI-V2-user-stories.md`

The user-stories file says *what* must be true. This file says *how it looks and behaves*, at the level of detail needed to build it. Everything here is taken from the design files: `Digital Inspections V2 — All Screens.dc.html` (all five sections in one document) and the five per-area files it was merged from.

---

## 0 · Tokens

Only Shopview Design System values are used. No new colours were invented.

| Role | Value |
| --- | --- |
| Primary action | `#257CFF` · hover `#1752C0` · active `#042260` · disabled `#B7D5FF` |
| ShopCoach / AI | `#7A5AF8` · surface `#F8F6FF` · border `#DDD4FF` |
| Text | grey-900 `#202939` · grey-700 `#364152` · grey-600 `#4B5565` · grey-500 `#697586` · grey-400 `#9AA4B2` |
| Surfaces | white · grey-25 `#F8FAFC` · page `#EEF2F6` |
| Borders | grey-200 `#E3E8EF` (subtle) · grey-300 `#CDD5DF` (input, divider) |
| OK | dot `#16B364` · fill `#EDFCF2` / `#D3F8DF` · text `#087443` · solid `#099250` |
| Monitor | dot `#F79009` · fill `#FFFAEB` / `#FEF0C7` · text `#B54708` · solid `#DC6803` |
| Not OK | dot `#F04438` · fill `#FEF3F2` / `#FEE4E2` · text `#B42318` · solid `#D92D20` |
| N/A | dot `#9AA4B2` · solid `#697586` |
| Not inspected | white fill, `1px solid #CDD5DF` border, text grey-600 |
| Radii | 8px controls/inputs/menus · 12px cards/panels · pill badges · 20px phone frame |
| Shadow sm | `0 1px 2px rgba(11,23,51,0.05)` — resting cards |
| Shadow lg | `0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)` — modals, popovers |
| Focus | `2px solid #257CFF` border + `0 0 0 4px rgba(37,124,255,0.24)` |
| Overlay | `rgba(15,17,26,0.5)`, no blur |
| Type | Inter. 24/32 semibold section titles · 16/24 semibold card titles · 14/20 body · 13px controls · 12px meta · 11px labels · 10px uppercase column heads (0.06em tracking) |

**Verdict metadata table** — one source of truth, used by every screen:

```
none: { label:'Not inspected', border:'1px solid #CDD5DF',   dot:null,      chipBg:'#EEF2F6', chipFg:'#4B5565', dotColor:'#9AA4B2', wheelBg:'#fff'    }
ok:   { label:'OK',            border:'1.5px solid #16B364', dot:'#16B364', chipBg:'#EDFCF2', chipFg:'#087443', dotColor:'#16B364', wheelBg:'#D3F8DF' }
mon:  { label:'Monitor',       border:'1.5px solid #F79009', dot:'#F79009', chipBg:'#FFFAEB', chipFg:'#B54708', dotColor:'#F79009', wheelBg:'#FEF0C7' }
bad:  { label:'Not OK',        border:'1.5px solid #F04438', dot:'#F04438', chipBg:'#FEF3F2', chipFg:'#B42318', dotColor:'#F04438', wheelBg:'#FEE4E2' }
na:   { label:'N/A',           border:'1.5px solid #697586', dot:'#9AA4B2', chipBg:'#EEF2F6', chipFg:'#4B5565', dotColor:'#9AA4B2', wheelBg:'#EEF2F6' }
```

---

## 1 · Data model

```
Template
  sections[]
    fields[]
      id, label, type: 'text' | 'checkbox' | 'measurement' | 'axleSet'
      referenceFile?: { name, mime, sizeBytes }        // always available, never conditional
      rules: { required, photo, photoIfNotOk, noteIfMonitorOrNotOk }
      rows[]                                            // axleSet only
        id, name, unit, perTire: boolean                // perTire=false → one value per side

Inspection (a filled template)
  axles[]                                               // axleSet field
    id, brake: 'drum' | 'disc', config: 'single' | 'dual'
    values: { [rowId]: { [position]: string } }
    verdicts: { [rowId]: { [position]: 'ok'|'mon'|'bad'|'na' } }   // absent = not inspected
```

**Positions.** `perTire` row on a dual axle: `lo, li, ri, ro` (left outer, left inner, right inner, right outer). On a single axle, or any `perTire: false` row: `l, r`.

**Unit defaults.** `in.` is the system default. A row whose unit equals the default shows "Defaults" plainly; a row that differs shows its unit. Available units: `psi, mm, in., 32nds, ft-lbs`.

### Roll-up

Only the position verdict is stored. Everything above is computed with `worst()`:

```
worst(list) = bad > mon > ok > na > none
```

| Level | Computed from |
| --- | --- |
| Measurement row | worst of its positions |
| Axle | worst of its rows |
| Field | worst of its axles |
| Top-view tire | worst of the verdicts entered for that tire so far; `none` → grey; if some but not all of its rows are judged, the tire border is **dashed** |

Never write `na` as a default. An untouched position stays absent.

### Single ↔ Dual

Two value stores per row, kept side by side for the session: `dualVals/dualV` and `singleVals/singleV`. No confirmation dialog.

- **Dual → Single**: copy `lo → l` and `ro → r` (value and verdict), clear `li` / `ri`. The outer readings are the ones that survive.
- **Single → Dual**: restore the previous dual store untouched.
- Submitting on Single stamps `config: 'single'` on the record.

---

## 2 · Template builder

### Screen: Admin › Inspection templates › edit

`1280` wide. App bar 52px → sub-header 52px → three columns: sections rail `236`, canvas (flex, `#F8FAFC`), inspector panel `320` with a `1px #E3E8EF` left border.

**Field row in the canvas.** 44px tall, grip handle on the left (grey-400), label 13px semibold, type + rules as a 11px grey-500 subtitle, pencil and delete on the right (delete `#B42318`, everything else grey-700).

### Starter library


Creating a template offers six starter slots. A starter is an ordinary template once picked: editable, renameable, deletable.

**No seeding mechanism exists.** Earlier drafts said all five were seeded into every organisation; that describes a backend job which is not built and is a separate ticket. The screen offers the starters; how they get into an org is unresolved.

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

A starter card is an icon, a name, and a `PENDING` badge where it applies — **no second line**. The template name describes itself; a descriptor under it says the same thing twice. (The hints on the *Or build from scratch* type cards stay: a field type's name does not say what the field produces.)

A slot is drawn as a **pending** placeholder wherever a starter has no template content yet. Build the library as a two-column grid of equal rows so a sixth and a seventh entry drop in without relayout — not a fixed-height panel sized to five.

No marketplace, no search. Six slots need neither.

### Template list copy — "Times used"

"Runs" is out. A run was not a word anyone could resolve in QA, and it means the number of times the template has been used.

| Where | Copy |
| --- | --- |
| Desktop KPI card | `Times used (30 days)` |
| Table column header | `Times used` |
| Phone KPI chip | `Used/30d` |
| Phone card suffix | `3 times used` |
| Phone action sheet meta | `Used 4,218 times · v2` — singularises to `Used 1 time · v2` |
| Phone archived banner | *"Inspections already completed from this template stay counted in reports."* |

The API field stays `total_runs` / `totalRuns`. It is a field name, not something a user reads.

**No artboard.** Admin › Inspection Templates (list) is not in this bundle, on either platform. The copy above is the whole of the design for it.

### Inspector panel — checkbox field

Sections in this order, each separated by a `1px #E3E8EF` divider:

1. **LABEL** — text input, inline. Confirm = 28px blue check; cancel = 28px white/grey-300 X. No modal.
2. **HELPER TEXT** — optional, one line.
3. **RESPONSE OPTIONS** — OK / Monitor / Not OK / N/A shown as read-only chips. Fixed order and not editable.
4. **REFERENCE FILE** — helper line "Always available on this field, whatever the technician answers." When present: a `#E9F5FF` / `#BEDFFF` row with a PDF tile, name, size, and "not in the customer report"; remove is a grey-700 X. When absent: an "Attach File" secondary button plus `PDF, JPG or PNG · up to 10 MB` in grey-400 **above** the upload, not after a failure. There is no Replace button.
5. **VALIDATION** — four toggles, in this order:
   - Required to complete — off by default
   - Photo required — off
   - Photo required if Not OK — **off for new templates** (was on; reversed in the 2026-09-03 review, §8)
   - Note required if Monitor / Not OK — **on for new templates**

   Below them, a live summary sentence: *"The technician must provide an answer, a photo when Not OK, a note when Monitor or Not OK."* With nothing enabled: *"Nothing is enforced — the technician can leave this field untouched."* Existing templates keep whatever they already have; the defaults apply only at creation.

### Inspector panel — per-axle field

Adds a **MEASUREMENT ROWS** list. Each row card carries, in this order:

```
[grip] Row name                              [pencil] [delete]
       Defaults                                        ← 11px #9AA4B2
       [unit selector ▾]   [ One per side | Outer + inner ]
```

- The row name never contains the unit in brackets.
- The "Defaults" line is 11px grey-400, the same size as helper text, so it costs one line of height.
- Unit selector opens a menu of the five units; the current one is highlighted `#F4FAFF` / `#175CD3`. Options are plain labels — no "(default)" suffix.
- Scope control is a two-value segmented pair: *One per side* (`perTire: false`) and *Outer + inner* (`perTire: true`). Column needs ≥376px so "Outer + inner" never wraps.
- Rows drag to reorder. Renaming is inline with check/X.

**Removed from the builder** — conditional follow-up in every form: the branch editor, the four response paths, nested follow-up rows in the field list, and acknowledgement toggles. The reference file covers the content need; validation covers the obligation.

### Phone builder

`402` wide. Same information, stacked: field list → field inspector as a full screen. All targets ≥44px; inputs 16px to stop iOS zooming. Validation toggles are 44px rows.

---

## 3 · Fill — desktop

`1440` wide. App bar 56 → work-order sub-header 56 → sections rail `236` + canvas. Cards `max-width: 1020px`, white, `1px #E3E8EF`, radius 12, shadow-sm.

### Per axle

**The word "set" is out of the product.** A shop owner added four fields in QA because "axle set" read as one axle's two sides: *"It is not clear at all to the user what an 'axle set' means… axle set is not standard terminology."* The field **type** stays `Per axle`, which is standard; the default label for a new field is **`New axle measurements`**.

The `Per axle` card in *Or build from scratch* carries an `ⓘ` and a tooltip — same treatment as the Mark OK tooltip (300 ms, grey-900, white 12/16, radius 8, max 280px, shadow-lg), no arrow:

> One field covers the whole unit. You define the measurement rows here, and the technician adds each axle while filling the inspection in — every row is then recorded per wheel position on every axle.

**Axles.** The panel gained one field, directly above `+ Add Measurement Row` so it reads top to bottom — what every axle is measured on, then how many axles to start with. It is a row card in the same shape as the measurement rows: title **Axles** 13/600 with an `ⓘ`, the muted line *"Select # of axles to start with"* where a row says *Defaults*, and the panel's own `.unitsel` control — 104×32 on desktop, 112×44 on phone — defaulting to **3**, its menu offering 2–5. Tooltip:

> Most units of this kind have this many axles, so the technician starts with that many. They can add or remove axles while filling the inspection in.

A default, not a limit: the technician still adds and removes axles on the fill screen, and `+ Add Axle` stays. Its menu offers 2–5. The rows section is labelled `MEASUREMENT ROWS · EVERY AXLE`, which says what the rows are for without a sentence.

Both tooltips sit on the full builder (**TB2**). They answer *what this field type is*. What they do not answer is *what am I building* — that is Preview mode, below.

### Preview mode

The author's loop today is: publish, open a work order, add the inspection, start it as a technician, find the problems, return to the builder. Preview removes the round trip.

- **`Edit` / `Preview`** segmented control in the sub-header, 34px, selected half `#364152`, pencil and eye icons, sitting left of `Save Draft`.
- **In Preview the properties panel steps aside and the canvas takes its width.** That is why this works where the earlier attempts did not: the panel is ~360px and the axle grid needs ≥800px. The sections rail stays, so one section can be previewed at a time.
- **No banner.** An earlier draft explained the mode in an amber notice above the canvas; the mode control already says which mode the author is in. Removed 2026-09-10, with nothing in its place.
- The canvas renders §3's fill screen from the **current draft**, unsaved edits included: inspection line, section header, field cards with their bulk-OK actions, value controls with verdict markers, `+ Add Axle`, card footers. **Read-only, with one exception: the axle control.** `+ Add Axle` and the per-axle delete both work, and the count **writes back to the draft**, so returning to Edit shows the new number on the `Axles` control. Preview is where an author first sees the field at real size and works out that three is not enough; carrying that number back by hand is the round trip this mode removes. Nothing else takes input — no values, no verdicts, no Add Note or Add Photo — though a reference file still opens, because that is a read. **The three Mark OK actions are not drawn at all**: they set verdicts, and Preview sets none. No answer and no inspection record is ever written.
- **Phone gets the same preview** at phone width, following the width the builder is opened at — no device switcher. The technician is usually on a phone, and a template that reads well on a desktop can still be wrong in the hand.
- **Clicking a field in Preview returns to Edit with that field selected**; hovering raises the card and turns its border blue. No `Edit this field` pill — the card is the affordance. That is the loop-closer.
- **No submit bar.** `Save & Exit` and `Submit & Generate Report` are not rendered: they belong to an inspection, not a template, and an inert Submit invites the author to think something can be sent.
- Available on a draft. Never requires publishing.

A preview **dialog** was drawn and dropped on the way here: a modal answers less and costs a click, and it could only ever show one field. Inline-in-the-panel was tried before that and failed on width. Drawn in **TB7**, desktop and phone.

```
┌ axle header ─────────────────────────────────────────────────┐
│ (1) Axle 1   [Drum|Disc]  [Single|Dual]              [✕]     │
├ grid header ─────────────────────────────────────────────────┤
│ MEASUREMENT        LEFT                RIGHT                 │
│                    OUTER   INNER       INNER   OUTER         │
├ rows ────────────────────────────────────────────────────────┤
│ Tire pressure psi▾ [42 |▾][98 |▾]      [101|▾][99 |▾]        │
└──────────────────────────────────────────────────────────────┘
```

- Grid is `196px | 1fr | 1fr` — **no** STATUS column and **no** ROW column.
- OUTER / INNER is labelled once, in the column header, not per input.
- Left panel `186px`: top view of the unit, tires tinted by roll-up, clicking a tire scrolls to its value.

### Note and photo

`Add Photo` and `Add Note` sit **together in the field card footer**. QA read a header photo button and a footer note button as unrelated controls; they are the same kind of offer, so they share a row. The photo block still opens on its own the moment `photoIfNotOk` bites.

### Mark OK in bulk

A technician filling four axles faces 48 verdict dropdowns. The bulk action exists so the ordinary case — everything good — is one press, and only the exceptions are set by hand. It was removed in an earlier pass; the 2026-09-03 review reinstated it (§8).

- **It sets OK. Nothing else.** No bulk Monitor, no bulk Not OK — a bad finding stays a deliberate act.
- **It sets verdicts only.** Measured values are always typed by hand. Bulk never invents a reading.
- **It never overwrites a verdict already picked.** It fills the positions still Not inspected, so "mark everything OK, then correct the two bad ones" works in either order.
- After a bulk press, correcting a position is the same single gesture as any other: its own marker menu. Nothing about the value control changes.

**Three levels, one pattern.** The action exists at inspection, section and field level — a technician who wants only one field marked must be able to do that without touching the rest. What made the first attempt read as clutter was not the count but the inconsistency: three different button weights at three different right edges, one of them in the app chrome.

The rule now: **the same wording, the same treatment, the same right edge, one level per row.** The level is read from the row the action sits on, not from the label.

| Level | Row it sits on | Label |
| --- | --- | --- |
| Inspection | Inspection row at the top of the canvas — name, then *2 sections · 5 fields* | `Mark all OK` |
| Section | Section row under it — `SECTION 1` + *2 fields · 0 of 24 positions* | `Mark section OK` |
| Field — every field type with a verdict | The field's own card header, right end | `Mark field OK` |

- Treatment: a **text action**, not a button — `#175CD3`, 600, 13px at inspection level and 12px below it, with a 14px check in `currentColor` and no border or fill. Quiet enough to repeat three times; blue so it still reads as interactive (grey is only for disabled).
- All three right-align to the canvas column (`max-width: 1040px`) — the inspection and section rows to the column edge, the field one to the card's inner edge, inset only by the card's 20px padding. The card carries no `align-self`: it shares the column's edges with the two rows above it.
- Nothing lands in the app bar or the work-order sub-header. The inspection row is the top of the scroll, so the inspection-level action is reachable without scrolling to the end.
- **Labels are short; the tooltip carries the scope.** A 300 ms hover shows a grey-900 tooltip (12/16, white, radius 8, max 250px, **no arrow** — the implementation resolves its side at runtime) whose three sentences always have the same shape — what it covers, what it leaves alone, what it never touches — with counts from the live inspection:

  | Level | Tooltip |
  | --- | --- |
  | Inspection | *Marks every field in this inspection OK. 2 sections, 5 fields. Only what is still Not inspected changes; verdicts already picked stay. Values are never filled in.* |
  | Section | *Marks every field in Section 1 OK. 3 fields, 38 positions. Only what is still Not inspected changes; verdicts already picked stay. Values are never filled in.* |
  | Field (per-axle field / measurement) | *Marks every position in this field OK. 4 rows on 3 axles, 36 positions. Only what is still Not inspected changes. Values are never filled in.* |
  | Field (checkbox) | *Selects OK for this field. The same as pressing OK below.* |

- One label per level, the same on every field type: an per-axle field, a checkbox and a measurement all carry `Mark field OK`. On an per-axle field it fills every position still Not inspected; on a checkbox it selects OK; on a measurement it sets the verdict and leaves the value for the technician. A text field has no verdict and carries no action. "Mark OK" on its own was not clear enough about what was about to happen.
- The inspection line is quiet (13px name + meta) and the section title is the page's heading (`SECTION 1 OF 2` label, 20px title) — the same hierarchy the product draws today.

**After the press.** The action on the row that was pressed is replaced, in place, by a check and a count in success-text green, plus `Undo` as a text action on the same right edge. The count is in that level's own unit: **fields** on the inspection and section rows (*"3 fields marked OK"*), **positions** on a field (*"36 positions marked OK"*; a checkbox just says *"Marked OK"*). Nothing else — no sub-line about what was skipped. The state cascades: every level beneath the one pressed swaps its own action for the same check and its own count, so before and after read at a glance down the page. Undo sits only on the row pressed. The report stays until the next edit anywhere in the inspection (a verdict, a value, a Single/Dual switch), then the actions return. No dialog before, an undo after — the same trade the Single/Dual switch makes. Drawn in A5b; live in A6.

A1 shows the pattern in place; **A5 is the whole screen as it is filled** — rail, inspection line, section header, an per-axle field, a checkbox and a measurement field, each with its own action, and the Save & Exit / Submit bar. **A5b is the same section after `Mark section OK`**: values had been typed first, so every position simply took OK; the section row carries the report and Undo, the three field actions have gone quiet. (A position with no value is still open — §8, question 1 — which is why A5b shows values typed first.)

**Open, and blocking.** What bulk OK does to a position with no value entered is not decided — §8, question 1.

### The value control

One control per position: the input and its verdict marker share a border.

```
┌───────────────────────────┐
│ 42                    │ ●▾│   ← marker: 38px wide, tinted to the verdict
└───────────────────────────┘
```

- Border: `1px #CDD5DF` when not inspected; `1.5px` in the verdict colour once judged.
- Marker button: verdict-tinted background, dot + chevron, `1px` divider in the verdict colour.
- Clicking the marker opens a menu, `206px`, shadow-lg, titled with the position and the value: **"Left outer tire · 42 psi"**. Options: OK, Monitor, Not OK, N/A — each a dot + label, the current one on a `#F4FAFF` row. (Geometry and the selected-row tint were reconciled with A6 on 2026-09-03: 38px marker, 206px menu, `#F4FAFF` selected row.)
- **Not inspected is not in the menu.** It is where a position starts, not a choice.
- One menu open at a time; clicking elsewhere closes it.

### Field card — order of elements

Top to bottom, always: **title + type badge** → **reference file chip** → **response row** → **note / photo** → **footer**. The reference chip never sits beside the response row. **The header carries no descriptor line** — no row count, no unit, no rule summary. The field name, the type badge and the visible contents say it; see the standing rule in the PRD §7a.

- Reference chip: `#E9F5FF` / `#BEDFFF`, PDF tile, name, "Open".
- Response row: one segmented control, `44px`, `max-width 520px`. The selected segment is filled solid in its verdict colour with white text; unselected segments are white with a coloured dot.
- **No status badge in the card's top-right corner.** It only repeated the answer at a smaller size.
- Note and photo sit **side by side**: note flexible on the left, photo `340px` on the right.
  - Note block: `NOTE` label + `Required` badge when it applies, textarea, "Goes to the customer report", and a confirm/cancel pair (grey-300 X, blue check).
  - Photo block: `PHOTO` label + badge, then a dashed `#CDD5DF` drop target ≥132px tall — icon tile `#E5EDFF`, "Drop a photo here", "or upload from your computer · JPG or PNG". **No video.** Once files land, 104px thumbnails with a remove X sit to the left of the target.
- Containers stay neutral. Colour appears only on the value that earned it, the badge, and the control being pressed — no tinted rows, no red card outlines.

### Download-only reference files

**Reference files accept types the product cannot display — resolved 2026-09-10.** HEIC, TIFF, Word and
Excel **keep being accepted**. Server-side conversion so they can be read in the viewer is a separate
ticket, not this release. Until then the viewer carries an honest **"This file can only be downloaded"**
state with a download action, specified here (the artboard was removed on 2026-09-16):

- Header keeps the file tile, name and owning field, and gains a primary `Download` beside the close X.
- Body is the `#EEF2F6` viewer ground with a centred block: 48px document icon, **This file can only be
  downloaded** at 18/26 semibold, one plain sentence naming why and what opens it, a primary
  `Download {size}`, and a line stating the field can still be answered without opening it.
- Nothing about this blocks the inspection.

**The contradiction is accepted and dated, not hidden.** §3 says downloading is never the only way to read
the document; for these four types it is, until conversion ships. The accepted-type list is not shrinking —
a technician who has the file is better off than one who was refused the upload.

### Reference-file viewer

A full-page modal. Bar `10px 16px`: PDF tile, file name, the field it belongs to, a zoom group (`− Fit width +`), Download as a secondary, and a close X. Body is `#EEF2F6`, `overflow-y: auto`, pages `620px` wide, `flex: 0 0 auto`, `align-items: flex-start`, shadow-sm, stacked with a 24px gap. Downloading is never the only way to read the document.

---

## 4 · Fill — phone

`402` wide. Structure: app bar 44 → section header → scrolling content → footer.

- **No grid.** One axle at a time. Values in a `1fr 1fr` grid, each with its position label above: *Left outer, Left inner, Right inner, Right outer*.
- Labels 11px semibold; on a judged position the label states the verdict and takes its colour — "Left outer · Not OK".
- Value rows 52px, inputs 17px semibold, marker button 52px wide.
- **Axle chips** in the sub-header: 44px pills, `flex: none`, `white-space: nowrap`, row scrolls horizontally. Tapping one **swaps the page** to that axle — it does not scroll to it. A `+ Axle` dashed chip ends the row.
- **Footer is section navigation only.** Two half-width 52px buttons naming their destination: `Back: Section 1` / `Next: Section 2`; on the last section the primary becomes `Review & Sign`. Never a greyed-out square.
- **Outstanding work rides on the action** as a count badge (amber for notes only, red when photos are also missing) — not its own bar. Tapping the badge opens a sheet listing each missing item with its path ("Section 1 · Tire pressure · left outer"); tapping a row goes **straight to that field**, never to a summary.
- **Bulk OK** keeps all three levels, one per surface, since the phone shows one thing at a time: the **section** action is a full-width 44px row at the foot of the section header (`Mark section OK`); the **field** action is on the field header of the axle-set screen (`Mark field OK`, 44px, beside the field name in the sub-header). Single-answer fields on the phone carry no extra action: their OK segment is already the one tap; the **inspection** action is the one item in the app-bar menu (`Mark all OK`; M2 draws that menu on its own beside the frame, so it covers neither the section action nor the outstanding count). Nothing in the footer — the footer stays section navigation. Same rule as desktop: OK only, verdicts only, never overwriting a verdict already picked.
- Verdict sheet: bottom sheet titled with the position, measurement and entered value; four 56px options; no "Not inspected" option.
- Required evidence: the `Add note` / `Add photo` labels and icons turn `#B42318` on a row holding any Not OK position. The container stays neutral and the button spans the row — no placeholder square beside it.

**Removed on phone**: the bottom back button (Android draws one), the coloured dot beside a verdict, the dot on axle chips, the bottom axle-navigation strip, and the requirement bar. Set all positions is no longer on this list — a single bulk OK came back on 2026-09-03 (§8).

---

## 5 · Inspection → work order

**Entitlement.** Building lines is a ShopCoach capability. Without it, an inspection reports and a human builds.

### Completed inspection — the summary card

The screen **leads** with it: the **completion line**, then **a count per verdict**, then a **findings list** naming each flagged position as **field · axle · row · position** with the reading that earned it — *Brake & tire measurements · Axle 1 · Tire pressure · left outer · 42 psi*. A flagged field with no position names itself and what it carries — *Slack adjuster travel · Note attached*.

**A verdict with no findings under it is not counted.** A zero reads as a finding at a glance, which is the opposite of what it says: an inspection with nothing on Monitor draws no Monitor chip at all (P4).

**Not on this screen:** the service advisor, the inspection's start time, and per-section progress. The first two belong to the work order the inspection was run on; progress means nothing once the inspection is locked.

### The whole flow on a phone

Nothing sends the technician to a desktop — the build completes on the device the inspection was read on.

| Step | Phone treatment | Artboard |
| --- | --- | --- |
| Completed inspection | Summary card, then the section review. Footer actions stack full-width at 48px, `Build lines` first | P1 |
| Target choice | The desktop menu's two targets as a **bottom sheet**, 56px rows, with a Cancel | P2 |
| Review the drafted lines | Lines as cards — selection box, title, the findings they came from, labor and parts; pre-selected, editable, deselectable. A footer strip carries the running total and `Add 2 Lines to S-81` | P3 |
| Without ShopCoach | Two stacked actions and the plain line | P4 |

At 390px no hand-off screen scrolls horizontally and no target is under 44px.

### Completed inspection — without ShopCoach

Summary card, findings list, counts (`9 OK · 1 Monitor · 2 Not OK`). Exactly two actions: `View PDF` (secondary) and `Go to work order` (primary). **No build action at all** — not disabled, not behind a tooltip.

### Completed inspection — with ShopCoach

Identical, plus a purple `#7A5AF8` **Build lines** button carrying a white-on-translucent `AI` badge and a chevron. `Go to work order` demotes to secondary. Above the footer, a `#F8F6FF` / `#DDD4FF` note: *"ShopCoach can turn these 3 findings into work order lines with labor and parts. You review everything before it is added."*

The label is "Build lines" — the colour and the badge carry the product name.

**Target menu** (308px, `#DDD4FF` border, shadow-lg): heading `BUILD THE LINES ON`, then *This work order* (S-81 · Open · 0 lines) and *A new work order* (seeded with this customer & unit).

### The run

Starts on **Continue / target choice**, not on the earlier "Create Lines" step — the destination decides the context, and running here means the technician never waits inside a modal.

**While drafting**: they are already on the work order, Lines tab. Panel header "Drafting lines from 3 findings · about 10 seconds", three pulsing dots, one skeleton row **per finding** (the count is known before the drafting is), `Cancel` available, footer "Nothing is added until you press Add Lines". The work order stays usable.

**Landed**: the same table, filled. All rows checked. Header "Review before adding · Click any title, description, labor or part to edit it. Uncheck a line to leave it out." Every line shows the finding it came from, under its title, with a verdict dot. Footer: `Add Lines` + "2.5 hrs labor · 4 parts · nothing on the work order yet". No prompt or query box anywhere in the flow.

Table columns: checkbox `44` · Title `280` · Description flex · Labor `88` · Parts `250`. Parts are green `#0E9F6E` chips with a check, plus a `+ Add` secondary chip. **Do not redesign this table** — it exists.

### Other entry points — same button, same panel

| Entry point | Where the action sits |
| --- | --- |
| Completed inspection | Footer, primary position |
| Work order › **Notes** | On the auto-posted inspection note card, beside View PDF and Download |
| Customer › Asset › **Inspections** | Action column of the row |
| Work order › Lines | Sub-header, beside `New Line` — drafts from unit history with no inspection at all |

**Notes tab card.** Avatar, author, `Auto-posted` badge, timestamp, then "Completed inspection 1234 · v2 · 2 sections, 6 fields". The report is a card: 76×96 page thumbnail, file name, size, and the counts as chips — an advisor never opens the PDF to learn whether something failed. Actions: View PDF · Download · Build lines. Without ShopCoach, the last one is absent.

**One menu, three entry points.** `Build lines` opens the same target menu wherever it is met — the completed-inspection screen, work order › Notes, and Customer › Asset › Inspections. One action, one appearance. The chooser dialog it replaced asked its question before anything had happened. Its target row reads number and status only — `S-81 · Approved`; the work-order payload carries no line count and a menu sub-line is not worth a second request.

**The completed screen is the card *and* the answers.** Below the completed card sits the section-by-section review of everything entered. The card answers *what happened*; the sections answer *what was entered*, and without them a locked inspection has no readable record outside the PDF. The header is the 52px bar with the lock stated in words — no coloured status pill (on a wholly read-only screen it competes with the verdict dots) and no section rail. **Open:** `Advisor`, `Started` and per-section progress went with the rail and have nowhere to live; they may need a home.

**Asset › Inspections table.** **No filter chips.** An asset gets roughly one inspection a quarter; ten rows in a year is not a list worth filtering, and the chips cost more than they saved. One plain line above the table carries the actionable count — "2 of 14 have findings with no lines yet" — and the sort order does the rest. Columns: Inspection (name + version) · Status · Completed · Technician · Issues · Work order · Report · Action.

Action column, one of:
- `Build lines` (purple) — completed, has findings, no lines yet
- `✓ WO created S-235` / `✓ Lines added S-58` — already handled, so the same work is never offered twice
- `—` — not started; there is nothing to build from

Rows needing a work order sort first, ahead of date order.

---

## 6 · Copy

Exact strings. Where the product says something different today, change it.

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
| Nothing-added reassurance | Nothing is added until you press Add Lines |
| Mobile nav | Back: Section 1 · Next: Section 2 · Review & Sign |

ShopCoach is named once, in the note before the run. Everywhere else the purple and the badge carry it.

---

## 7 · Build order

1. Data model and the `worst()` roll-up — everything else reads from it.
2. The value control (input + verdict marker + menu). It is the atom of the whole release.
3. Per axle on desktop, then the phone variant.
4. Field card: reference file, response row, note/photo side by side.
5. Builder inspector: rows, units, scope, reference file, the four validation rules.
6. Hand-off: entitlement check, the four entry points, the drafting state, the review table.

One deletion to schedule alongside: conditional follow-up (builder, fill, and the stored branch data).

Set-all shortcuts were on this list until 2026-09-03. They are not any more: a bulk **OK** at field, section and inspection level is part of the release (§3, §4). What stays deleted is bulk Monitor, bulk Not OK, and any shortcut that writes a measured value.

---

## 8 · Review 2026-09-03 — decisions, deferrals, open questions

Present: Fabian Bonjean (shop owner, domain) and Sasha Grosman (product). Some of these reverse earlier passes, so the reasoning is recorded here as well as drawn in the screens.

### Decided

| # | Decision | Why |
| --- | --- | --- |
| 1 | A bulk **OK** returns at inspection, section and field level, as one repeated pattern (§3, §4) | Four axles is 48 dropdowns at two clicks each. The real workflow is to mark everything good, then change the two or three that are not. |
| 2 | The filter chips come off Asset › Inspections (§5) | About one inspection a quarter per asset. Ten rows in a year does not need filtering. |
| 3 | "Photo required if Not OK" defaults **off** (§2) | Not every flagged item should demand a photograph. The note rule stays on. |
| 4 | Five seeded starters, plus a pending equipment slot (§2) | These are the templates shops run today. |

### Considered and deferred

**The value control.** Picking a verdict takes two clicks, and a table with the four options always visible would be faster to press. Not changed in this release: the bulk OK above removes the volume that made the click count hurt, and the control is the atom of the whole release (§7) — reworking it invalidates A6, M6 and every measurement in the handoff. Revisit after bulk OK has been in shops.

### Rejected

**Verdicts derived automatically from value ranges.** Feasible, and proposed twice. Rejected for this release: it needs a limit per row per unit, per vehicle class, plus an override path and an answer to who judged what. Recorded here so it is not proposed a third time.

### Open — surfaced, not answered

1. **What does bulk OK do to a position with no value entered?** §1 says Not inspected is where a position starts, not a choice, and `na` is never written as a default. A bulk OK that stamps unmeasured positions contradicts that; one that skips them leaves the technician unsure whether the press did anything. Needs an answer before §3 is built.
2. ~~Hiding the per-side selector on rows where it never applies.~~ **Closed 2026-09-10: no.** The selector stays on every row and validation stays at four toggles in the pinned order. A template row is a template, not a named measurement — the row labelled "Brake lining" can be edited into anything, so the selector always applies.
3. ~~Reference-file types the product cannot display.~~ **Closed 2026-09-10** — see §5, "Download-only reference files".
4. ~~Two vocabularies for one control.~~ **Closed 2026-09-10:** `1 per side` / `Outer + inner` everywhere, phone included.

### Not changed, and deliberately

The per-row scope selector stays in the template builder. It sets the default the technician lands on, and a template row is a template, not a named measurement — the row labelled "Brake lining" can be edited into anything. Everything else in the removed-on-purpose list stays removed; only the set-all entries were reversed.

---

## 9 · QA review 2026-09-08 — what changed after the build

Built, deployed to `sv8181`, reviewed by Fabian and Sasha. Four changes, all now drawn.

1. **"Runs" is "Times used"** across Admin › Inspection Templates, desktop and phone (§2). The API field name is unchanged.
2. **Secondary descriptors are gone from the starter cards** (§2). A starter card is an icon and a name. The wider point — *"wherever we can delete it, we should, and focus on making the name as clear as possible"* — is an audit across the product, not only this screen. **Not done; scope it as its own pass.**
3. **"Axle set" is gone** (§2). The type is `Per axle`, a new field is labelled `New axle measurements`, the type card gained an `ⓘ` tooltip, and the `Axles` card gained one of its own.
4. **Five starters carry content, the equipment slot is pending** (§2), and **no seeding mechanism exists** — that is a separate ticket.

Plus the earlier QA pass, now reflected: `Add Photo` joins `Add Note` in the card footer (§3); the Mark OK tooltip has **no arrow** (§3); the completed screen keeps the section-by-section review below its card and states the lock in words (§5); the `Build lines` menu is the same at all three entry points and its target row reads `S-81 · Approved` (§5).

### Still open

- **Homeless on the completed screen:** `Advisor`, `Started` and per-section progress left with the section rail (§5).
- **Unimplemented and unreviewed:** `HELPER TEXT` (§2) and M3's outstanding-per-position list on the phone (§4).
- **ShopCoach line generation is not testable on QA** — the assistant is a separate deployment without the new line builder. What has been reviewed is the design and the entitlement gate, not drafting.
- **One bug:** `POST /inspections/{id}/submit` returns 400 on QA with the response body uncaptured, so which of six backend validations fires is unknown. It blocks report generation for the inspection it happens on.
- The four questions from §8 stand, unanswered.
