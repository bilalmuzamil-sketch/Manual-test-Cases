# Conditional follow-up on a response — implementation handoff

Design source: `Conditional Follow-up V2.dc.html` (section 5 of Digital Inspections V2).
Artboards: CI1b, CI1c, CI1d, CI3–CI9. Ids in this document match the badges in that file.
Parent spec: `DVI-V2-PRD.md`, `DVI-V2-build-spec.md`. Nothing here changes the customer report, the ShopCoach brief or the proposed-lines panel.

---

## 1. What this feature is

A template author can attach a **follow-up** to a single response of a **checkbox** field. The technician sees it only when they give that response.

A follow-up is **text plus one optional file** — the same payload a standalone Instructions field already holds. What is new is the condition under which it appears, and an optional acknowledgement.

Not supported on per-axle fields: a verdict there is recorded per position, so there is no single position the follow-up would belong to.

Vocabulary, deliberately split and not to be unified:

| Surface | Word |
|---|---|
| Builder (author-facing) | **follow-up** |
| Fill / preview (technician-facing) | **INSTRUCTION** |

---

## 2. Data model

```
InspectionTemplateField
  ...existing
  followUpsEnabled: boolean          // default false — the section toggle
  responses: ResponseOption[]

ResponseOption                        // existing: OK, Monitor, Not OK, N/A
  key: 'ok' | 'monitor' | 'notOk' | 'na'
  label: string                       // author-editable
  colour: enum                        // existing, unchanged
  followUp: FollowUp | null

FollowUp
  enabled: boolean                    // the per-response checkbox
  text: string
  file: FileRef | null                // exactly one, optional
  requireAck: boolean                 // default true on monitor + notOk, false on ok + na
```

On the filled inspection:

```
InspectionFieldAnswer
  ...existing
  followUpAck: { userId, at } | null   // set when the technician checks the box
```

Rules:

1. **One follow-up per response, up to four per field.** No arrays.
2. `followUpsEnabled === false` hides the whole per-response apparatus in the builder. Stored follow-ups are **retained**, not deleted, and reappear if it is turned back on.
3. Turning the toggle off while any `followUp.enabled` is true → **confirm first** (text would be lost from the technician's view). Turning it back on restores exactly what was there.
4. `Include Monitor option === false` removes the Monitor row **and** its follow-up block from the builder, and the Monitor response from the fill screen. The stored Monitor follow-up is retained and returns with the option.
5. `requireAck` defaults: `monitor` and `notOk` true, `ok` and `na` false. **The author can set it either way on any of the four.** Do not hard-code the response→requirement mapping anywhere; it is a default applied at creation only.
6. `followUp.enabled === false` → `text` and `file` are retained but the fields render disabled. Persist on save regardless, so an unchecked box is not a data loss.
7. Changing the technician's response **drops the acknowledgement** for the previous response. Answering the same response again asks for it afresh. The `followUpAck` record is per response, not per field.
8. Nothing from a follow-up or its acknowledgement reaches the customer report.

---

## 3. Builder — the properties panel (CI1c, CI1b)

Panel width 360px desktop; a bottom sheet on the phone (CI9).

### Layout inside `RESPONSE OPTIONS`

Two toggles sit **below** the response list, in this order:

1. `Include Monitor option` — existing, unchanged, own job.
2. `Add follow-up to a response` — new, default **off**, carries an ⓘ.

With (2) off: four plain response rows. Panel height as today (~280px for the section).

With (2) on: each response becomes a **block** containing, in order:

- the response row (colour dot + editable label input)
- a checkbox, `Follow-up for this response`
- a textarea, placeholder `Instruction the technician sees`
- `Attach File` — or the attached file's row, when one is set
- a toggle, `Require acknowledgement`, with an ⓘ

The textarea, the attach control and the acknowledgement toggle are **rendered but disabled** until the checkbox is checked. This is the point of the design: the author sees what a follow-up consists of before committing to one. Do not render them only on check.

Section height with four blocks on: ~990px. That is the cost, and the reason (2) is off by default.

### Block states

| State | Block | Checkbox | Fields |
|---|---|---|---|
| Unchecked | `#F8FAFC` ground, `#E3E8EF` border | empty | disabled: `#F1F4F8` ground, `#E3E8EF` border, `#9AA4B2` text |
| Checked | `#fff` ground, `#BEDFFF` border, shadow-sm | `#257CFF` fill, white check | enabled; textarea grows 2 → 4 rows; `Attach File` replaced by the file row |

### Canvas field row (CI1b, CI9)

A field carrying follow-ups shows, under its existing type line, a `FOLLOW-UPS` caption and **one line per follow-up**:

`● Monitor  Re-check at the next PM and record the reading.  📎`

- the dot and the response name in that response's colour (`#B54708` Monitor, `#B42318` Not OK, `#087443` OK, `#4B5565` N/A)
- the first line of the text in `#4B5565`, `text-overflow: ellipsis`, **no wrap**
- a clip glyph only where a file is attached

This list renders on **every** field that has follow-ups, selected or not. Do not gate it on selection.

### Tooltips (CI1d)

Two, both on an ⓘ, nothing permanent on the surface:

| On | Text |
|---|---|
| `Add follow-up to a response` | Adds text and one file to a single response. The technician sees it only when they give that response, and each one can be set to require acknowledgement. |
| `Require acknowledgement` | The technician confirms they have read this follow-up before the inspection can be submitted. On by default for Monitor and Not OK. |

---

## 4. Fill — the field card (CI3 desktop, CI4/CI8 phone)

### Order inside the card

```
response control (segmented)
NOTE block            ← if a note is required for the given response
INSTRUCTION block     ← if the given response carries a follow-up
footer (Add Photo / Add Note / Edit Note)
```

Both blocks are **full width**, stacked, never side by side. Same order on both surfaces.

### Behaviour

- Answering a response whose note is required **opens the note automatically**. `Add Note` leaves the footer in that state and returns as `Edit Note` once written.
- Answering a response that carries a follow-up **opens the instruction block in place**. No animation beyond the standard 120–160ms.
- With no follow-up on the response, the note runs the full width alone (CI3 state 5).
- The **marker**: where the given response carries a follow-up that does not require acknowledgement (typically OK / N/A), the block is collapsed and a blue `Instruction` button sits in the footer beside `Add Photo` / `Add Note`. Nothing blocks. Opening it expands the block in place.
- The file opens **full screen in the same view** and closes back to the exact scroll position, identically to the existing reference file (D4 in the master document).
- Long text is never truncated. Long file names are. Author paragraph breaks are preserved (`white-space: pre-line`).

### The instruction block

`#E9F5FF` ground, `#BEDFFF` border, radius 8.

```
[doc icon] INSTRUCTION   [Required pill — only when requireAck && !acked]
<body text, #202939, 13/19 desktop, 14/20 phone>
[file row: PDF tile | name + size | View Instruction | acknowledgement]
```

- The header pill reads **Required**, in the colour of the response that triggered it — `#FEE4E2`/`#B42318` on Not OK, `#FEF0C7`/`#B54708` on Monitor. It disappears once acknowledged.
- The file button reads **View Instruction**, not Open.
- **Acknowledgement is a borderless checkbox + label**, no button, no toggle, no bordered pill.
  - unchecked: `#CDD5DF` box, label `#364152`, text `Acknowledge`
  - checked: `#16B364` box with white check, label `#087443`, text `Acknowledged`
  - It does **not** print who or when on the card. The `{userId, at}` record is stored against the inspection and surfaced in the digital inspection record, not on the fill surface.
  - It is not reversible by the technician once checked; changing the response is what clears it (§2.7).
- Desktop: the acknowledgement is the **last child of the file row**, after `View Instruction`. The file-name column has `min-width: 120px` and the acknowledgement `flex: 0 1 auto`, so the name shortens and the acknowledgement wraps rather than either being crushed.
- Phone: the acknowledgement takes **its own full-width row**, min-height 52px, below the file row. The 402px file row has no width to spare and a gloved-thumb target is worth more than a saved line.

### Error state (CI3 state 4, CI4)

Reached when the technician tries to complete the inspection with a required acknowledgement outstanding. There is **no dialog** — completing opens the outstanding list (§5) and marks the fields it is waiting on.

- card border and instruction border → `#FDA29B`
- checkbox → `#D92D20`, 2px; label → `#B42318`
- one line under the file row, `#B42318`, with an alert glyph: *Read the instruction and check Acknowledge to complete this inspection.*
- footer ground → `#FEF3F2`

Red marks the error only. The instruction itself keeps its blue; no third semantic colour is introduced for the feature.

---

## 5. Outstanding items (CI5 desktop, CI6 phone)

An unacknowledged required follow-up is an **outstanding item**, alongside missing answers and missing notes.

Row shape, identical on both surfaces:

```
[tile]  Acknowledgement
        Section 1 · Brake chamber condition · Not OK        >
```

- kind first (`Acknowledgement`, `Note`, `Answer`), then location — the technician is looking for the next thing to do, not a category
- tile colour is the **verdict that caused the item**: amber on Monitor, red on Not OK, neutral for a plain missing answer
- selecting a row navigates to the field and opens the block that is missing
- `Go to the first one` at the foot of the list

**Desktop**: a count button beside Submit (`4 Outstanding`, amber). Pressing Submit with items left opens this list rather than raising an error. The list is a popover above the submit bar, 440px.

**Phone**: the count rides on the action that completes the section (`3 Next: Section 2`) — on **every** section action, not only the last, so the number is not saved up for the end. Tapping the badge opens the list as a bottom sheet; tapping the label moves on and leaves the items where they are. Rows are 64px.

---

## 6. Preview (CI7)

Preview mounts the fill screen against the current unsaved draft.

- No response can be given, so **every** configured follow-up on the field is shown at once, each naming the response it belongs to (`● On Not OK` chip, white ground, `#BEDFFF` border, `#175CD3` text).
- The file **still opens** — that is a read.
- The acknowledgement renders as the same checkbox in the inert treatment already used for verdict controls here: `#CDD5DF` box on `#F1F4F8`, `#9AA4B2` label. It takes no input.
- **No banner** explaining that Preview saves nothing.

---

## 7. House rules that bind this feature

1. **No explanatory subtext.** No descriptor line, no hint paragraph, no helper sentence anywhere. Where something needs explaining it is a tooltip on an ⓘ. This has been removed by hand from several handoffs; treat it as a default, not a preference.
2. The ShopCoach purple and the AI badge belong to the build action only. Not used here.
3. Red and amber carry Not OK and Monitor. The follow-up introduces **no** colour of its own — it borrows the blue already used for the reference file, because it is something to read.
4. Every phone target ≥ 44px (52px for primary rows). Every value input 16px so focusing it does not zoom the page. No horizontal scroll at 402px.
5. Long text, long file names and long labels shorten; they never break the layout.
6. `GENERAL REFERENCE FILE` is the label on checkbox fields, where per-response follow-ups also exist, to distinguish the always-visible file. Per-axle panels keep plain `REFERENCE FILE`.

---

## 8. Acceptance criteria

1. With `Add follow-up to a response` off, the checkbox properties panel is byte-identical to today apart from that one toggle row.
2. Turning it on renders four blocks (three with Monitor off), each with a visible-but-disabled textarea and Attach File.
3. Checking `Follow-up for this response` enables that block's fields only.
4. `Require acknowledgement` arrives on for Monitor and Not OK, off for OK and N/A, and can be set either way on all four.
5. Turning `Include Monitor option` off removes the Monitor row and block; turning it back on restores the text that was there.
6. A field with follow-ups lists them in the canvas row whether or not it is selected.
7. Answering a response with a follow-up opens the instruction in place, below an auto-opened note where the note is required.
8. A required, unacknowledged follow-up blocks submit, appears in the outstanding list with the triggering verdict's colour, and selecting it navigates to the field.
9. Checking the box turns it green, removes the Required pill, and stores `{userId, at}` without printing it on the card.
10. Changing the response clears the acknowledgement; re-answering asks again.
11. Preview shows all configured follow-ups, opens the file, and accepts no acknowledgement input.
12. A 1,400-character body with paragraph breaks renders in full, unscrolled and untruncated, with the file row and acknowledgement below it.

---

## 9. Open

- **Does an unacknowledged follow-up block the section action, or only submit?** Drawn as non-blocking: the count rises, `Next: Section 2` still advances. Confirm before building.
- Whether the acknowledgement record appears in the digital inspection record's field detail (recommended) or only in the audit trail.
