# Digital Inspections V2 — what changed, and what needs design

A hand-off brief. Behaviour is built and tested; **visual design is not done**. This
describes every surface we touched, what it does now, and where the current UI is
weakest.

Epic: SV-8181. Spec: Confluence "Digital Inspections V2" (page 768507905).

Nothing here is committed yet — it all lives on the local branch `SV-8181-dvi-v2`.

---

## 1. Fill screen — the axle set

**This is the screen that needs design most.** It is the densest thing in the
feature and it currently looks worse than it works.

### What it does now

A field of type "Per axle" renders a truck top-view plan on the left and one card
per axle on the right.

**Truck plan (desktop only).** Draws a CAB block and one row per axle. Each axle
row draws its wheels: one per side on a single axle, two per side (outer and inner)
on a dual axle. The right side is mirrored, so the outer tire is on the outside of
the truck on both sides. Wheels are tinted by the axle's verdict. Every wheel is
its own click target: clicking one scrolls to that axle's card and drops the cursor
into that exact tire's input. The hub (the numbered square) selects the axle.

**Axle card head.** Axle number and title, a Drum / Disc pair, a Single / Dual
pair, and a delete button. Single / Dual is how many tires a side has, and it
governs every tire measurement row on that axle.

**Axle card grid.** Four columns: row label, LEFT, RIGHT, STATUS.

- The label cell holds the measurement name and a unit chip the technician can
  change per row per axle (PSI, mm, in., 32nds, ft-lbs, in. H₂O, V, mi, hr).
- LEFT and RIGHT hold the values. On a tire row of a dual axle each side splits
  into OUTER and INNER, with small sub-labels. Values are free text: a number, or
  "N/A", or anything else ("12 PSI", "worn") is kept verbatim.
- STATUS holds four pills per row: OK, Monitor, Not OK, N/A.

**Below the grid**: an ALL ROWS pill group. It sets every row at once — the one-tap
path for an axle that is simply fine. It shows as selected only when every row
carries that verdict. When rows disagree, a separate line states the axle's
roll-up instead ("Axle: Not OK").

**Add axle** button at the bottom of the list.

### The rule behind it

Rows are the truth. ALL ROWS is only a bulk setter. The axle's verdict is derived:
the worst verdict among its rows (Not OK beats Monitor beats OK beats N/A). This
matters because a flat tire has to be able to fail without condemning the brake
lining measured beside it.

### What is wrong with it visually

1. **The status pills do not read as a selection.** Unselected pills already carry
   their own colour, so a selected Not OK and an unselected Not OK look nearly the
   same. This is the single worst problem on the screen.
2. **Sixteen controls per axle just for verdicts.** Four rows × four pills. On a
   three-axle truck that is 48 pills on one screen. It needs a denser idea — a
   segmented control, a colour swatch that cycles, a small popover per row.
3. **Row heights are driven by the status column.** Because the pills are the
   tallest thing in a row, every row is roughly twice the height of its inputs,
   leaving large empty areas in the value columns.
4. **The relationship between ALL ROWS and the row pills is invisible.** Nothing
   tells the technician that ALL ROWS is a shortcut and the rows are the record.
5. **The OUTER / INNER sub-labels repeat on every tire row**, adding noise.
6. **No mobile design at all.** On the compact layout the axles become an
   accordion, the truck plan is hidden, and the status pills drop onto their own
   full-width line under each row. It is functional and ugly. This is the biggest
   single piece of design work in the feature.

---

## 2. Fill screen — the field card (all field types)

Every field renders inside a card with a label, a type tag, the input, a photo
strip and a note area.

### What was added

**Reference file chip.** When the template attached a file to a question, the card
shows a chip reading "Recommended procedure", with the file name in a tooltip.
Tapping it opens images and PDFs in a viewer; anything else downloads. The point is
that the technician sees the procedure exactly when filling that question, not as a
separate instruction block elsewhere in the checklist.

**Note required badge.** When the template says a note is required on a flagged
response, and the response is flagged, a "Note required" badge appears and the note
area opens automatically. The badge disappears the moment a note is written.

### What is wrong with it visually

1. **The badge is lost next to the Not OK button.** That was the original
   complaint, and it is still true — it sits in the same row as the response
   controls and reads as another chip among chips.
2. **The reference-file chip is too close to "Add note".** They are two different
   kinds of action sitting side by side with the same weight.
3. The card has accumulated four kinds of secondary affordance (photo, note,
   reference file, badges) with no hierarchy between them.

---

## 3. Attachment viewer — new screen

A dialog that shows an attached reference file: an image inline, a PDF in a frame,
with a close X in the corner. Near-fullscreen on phones.

Currently plain. Needs: proper framing, a title showing the file name, zoom for
images, and a sensible phone treatment for multi-page PDFs.

---

## 4. Template builder — field properties panel

The right-hand panel where the author configures the selected field. It is about
340 px wide and now carries considerably more than it was designed for.

### What was added or changed

**Type palette, six types.** Checkbox, Text, Measurement, **Per axle** (new),
Photo, Instructions. Per axle used to be a toggle hidden inside Measurement; it is
now its own type, and the old toggle is gone. A template authored the old way is
shown as "Per axle" so the author sees it for what it is.

**Reference file block.** On every field type: a heading and an "Attach File"
button, with the attached file name and a remove control once set. The label is the
same everywhere — there is no second wording for the same action.

**Measurement rows editor** (for Per axle). One card per row. The row name reads as
plain text with a pencil to rename it. Beside it, a unit picker and a **Per tire /
Per brake** choice. That choice says what the row is measured on: a per-tire row
follows the axle's Single / Dual at fill time, a per-brake row is always one value
per side. It used to say "1 per side / Outer + inner", which collided with the
identical wording on the fill screen where it meant something else.

**Conditional follow-up.** Rewritten. Instead of editing instruction text inline,
the panel lists the **paths** a field has: "When OK", "When Monitor", "When Not
OK", "When N/A", each with a coloured pill, a one-line summary of what that path
holds, and a chevron. Clicking a path selects that follow-up field so it is edited
in the same panel as any other field. An "Add follow-up" menu offers the responses
that do not have a path yet, and greys out the ones that do. Standing on a
follow-up, the author still sees its siblings and can add the next one without
navigating back.

A follow-up field itself is locked to Instruction, cannot be duplicated, and can
only be deleted.

### What is wrong with it visually

1. **The follow-up paths are functional but plain** — coloured left border, pill,
   truncated summary, chevron. This is the most novel interaction in the builder
   and deserves a real design.
2. **The panel is crowded.** Label, type grid, type-specific settings, reference
   file, validation toggles, follow-up paths, and a footer, all in 340 px.
3. **A long attached file name used to push the panel sideways.** That is fixed,
   but the file-name treatment is still a bare truncation.
4. Row cards in the rows editor are tight: name, pencil, delete, unit picker and a
   two-button choice on one line.

---

## 5. Completed inspection view (read-only, after submit)

The per-axle grid is repeated as a read-only table. Two changes:

- It now renders the **Per axle** field type, which it previously ignored entirely.
- Where the technician judged rows individually, the table gains a **STATUS column**
  with a chip per row. Where only the axle was judged, the table keeps its original
  three columns and shows the axle chip in the header.

Design need: the four-column read-only table is cramped on narrow screens and
scrolls horizontally. Mobile view especially.

---

## 6. Customer PDF report

The axle table in the report gains a **Status** column, but only for axles whose
rows were judged individually. Column widths are redistributed on those tables
only, so older inspections print exactly as they did.

The report's counters ("needs attention", "monitor", "pass") now count **one per
judged measurement row**, not one per axle. A flat tire and worn brake lining on
the same axle are two findings, not one.

Design need: the PDF is print-only and functional, but the new column is the first
place a customer sees a per-row verdict. Worth a look at how much weight it should
carry versus the axle-level chip.

---

## 7. Inspection list / asset Inspections tab

**One known defect, not yet fixed:** the whole table row is clickable and opens the
inspection, while the inspection name itself is plain text. It should be the other
way round — the name is the link.

The Issues column now reflects per-row counting, same rule as the report.

---

## 8. Build work order from an inspection

Not a screen change, but it changes what the destination shows.

A flagged axle set used to arrive at the work-order builder as a single finding
named after the field ("Brake & tire set"). It now arrives as **one finding per
flagged measurement row**, named so the line can be traced back:

    Brake & tire set - Axle 2 - Brake lining

So a work order built from an inspection where only the brake lining failed carries
a line for the brake lining, not for the whole axle set. The field's note is
attached to the first of its findings only, so one comment does not read as several
complaints.

**Known limit:** this traceability is textual — it lives in the line description,
the ShopCoach prompt and the provenance note. There is no stored link from a work
order line back to the measurement row that caused it. Making the system itself
know that connection is a separate decision (SV-9100).

---

## Priority order for design

### First — the screens a technician works in

1. **Axle set on mobile.** No design exists. Biggest gap.
2. **Status pills on the axle set, desktop.** Selection is unreadable and the
   control count is too high.
3. **Field card hierarchy** — the note-required badge and the reference-file chip
   need to stop competing with the response buttons.
4. **Conditional follow-up paths** in the builder.
5. **Attachment viewer dialog.**

### Later — the customer-facing output

6. **The PDF report.** Deliberately deferred, and it is its own kind of work: print
   layout, page breaks, no interaction, and a customer rather than a technician
   reading it. Worth treating as a separate pass once the fill screens settle,
   because the report has to represent whatever the axle grid ends up looking like.
   The new per-row Status column is the first place a customer sees a row-level
   verdict, so how much weight it carries against the axle chip is a real question.
7. **Completed inspection view** — the read-only grid on narrow widths. Sits next to
   the PDF: same content, different medium.

---

## Where the code lives

Frontend, all under `app/src/components/ts/inspections/`:

| Surface | File |
| --- | --- |
| Axle set, fill | `filler/fields/AxleMeasurementField.vue` |
| Status pills | `filler/fields/StatusPillGroup.vue` |
| Field card, fill | `filler/fields/InspectionFieldCard.vue` |
| Reference file chip | `filler/fields/FieldAttachmentChip.vue` |
| Attachment viewer | `filler/fields/AttachmentViewerDialog.vue` |
| Field properties panel | `builder/fields/FieldInspector.vue` |
| Rows editor | `builder/fields/MeasurementInspector.vue` |
| Follow-up paths | `builder/fields/ConditionalFollowUpEditor.vue` |
| Attach control | `builder/fields/InstructionAttachmentControl.vue` |
| Completed view | `completion/CompletedFieldCard.vue` |
| Inspections tab | `../customers/VehicleInspectionsTab.vue` |

Customer PDF: `api/templates/inspections/report.html.twig`.
