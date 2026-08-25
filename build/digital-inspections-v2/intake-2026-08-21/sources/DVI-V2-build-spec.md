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

### Inspector panel — checkbox field

Sections in this order, each separated by a `1px #E3E8EF` divider:

1. **LABEL** — text input, inline. Confirm = 28px blue check; cancel = 28px white/grey-300 X. No modal.
2. **HELPER TEXT** — optional, one line.
3. **RESPONSE OPTIONS** — OK / Monitor / Not OK / N/A shown as read-only chips. Fixed order and not editable.
4. **REFERENCE FILE** — helper line "Always available on this field, whatever the technician answers." When present: a `#E9F5FF` / `#BEDFFF` row with a PDF tile, name, size, and "not in the customer report"; remove is a grey-700 X. When absent: an "Attach File" secondary button plus `PDF, JPG or PNG · up to 10 MB` in grey-400 **above** the upload, not after a failure. There is no Replace button.
5. **VALIDATION** — four toggles, in this order:
   - Required to complete — off by default
   - Photo required — off
   - Photo required if Not OK — **on for new templates**
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

### Axle set

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

### The value control

One control per position: the input and its verdict marker share a border.

```
┌───────────────────────────┐
│ 42                    │ ●▾│   ← marker: 34px wide, tinted to the verdict
└───────────────────────────┘
```

- Border: `1px #CDD5DF` when not inspected; `1.5px` in the verdict colour once judged.
- Marker button: verdict-tinted background, dot + chevron, `1px` divider in the verdict colour.
- Clicking the marker opens a menu, `230px`, shadow-lg, titled with the position and the value: **"Left outer tire · 42 psi"**. Options: OK, Monitor, Not OK, N/A — each a dot + label, the current one on a `#F4FAFF` row with a check.
- **Not inspected is not in the menu.** It is where a position starts, not a choice.
- One menu open at a time; clicking elsewhere closes it.

### Field card — order of elements

Top to bottom, always: **title + type** → **reference file chip** → **response row** → **note / photo** → **footer**. The reference chip never sits beside the response row.

- Reference chip: `#E9F5FF` / `#BEDFFF`, PDF tile, name, "Open".
- Response row: one segmented control, `44px`, `max-width 520px`. The selected segment is filled solid in its verdict colour with white text; unselected segments are white with a coloured dot.
- **No status badge in the card's top-right corner.** It only repeated the answer at a smaller size.
- Note and photo sit **side by side**: note flexible on the left, photo `340px` on the right.
  - Note block: `NOTE` label + `Required` badge when it applies, textarea, "Goes to the customer report", and a confirm/cancel pair (grey-300 X, blue check).
  - Photo block: `PHOTO` label + badge, then a dashed `#CDD5DF` drop target ≥132px tall — icon tile `#E5EDFF`, "Drop a photo here", "or upload from your computer · JPG or PNG". **No video.** Once files land, 104px thumbnails with a remove X sit to the left of the target.
- Containers stay neutral. Colour appears only on the value that earned it, the badge, and the control being pressed — no tinted rows, no red card outlines.

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
- Verdict sheet: bottom sheet titled with the position, measurement and entered value; four 56px options; no "Not inspected" option.
- Required evidence: the `Add note` / `Add photo` labels and icons turn `#B42318` on a row holding any Not OK position. The container stays neutral and the button spans the row — no placeholder square beside it.

**Removed on phone**: the bottom back button (Android draws one), the coloured dot beside a verdict, the dot on axle chips, the bottom axle-navigation strip, the requirement bar, and Set all positions.

---

## 5 · Inspection → work order

**Entitlement.** Building lines is a ShopCoach capability. Without it, an inspection reports and a human builds.

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

**Asset › Inspections table.** Filter chips with counts — All, Needs a work order (count in ShopCoach purple, because that is the actionable set), With issues, Not started. Columns: Inspection (name + version) · Status · Completed · Technician · Issues · Work order · Report · Action.

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
3. Axle set on desktop, then the phone variant.
4. Field card: reference file, response row, note/photo side by side.
5. Builder inspector: rows, units, scope, reference file, the four validation rules.
6. Hand-off: entitlement check, the four entry points, the drafting state, the review table.

Two deletions to schedule alongside: conditional follow-up (builder, fill, and the stored branch data), and every set-all shortcut at row, axle and field level.
