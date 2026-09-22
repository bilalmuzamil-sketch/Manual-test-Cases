# Preview mode — handover for Claude Code

SV-8181 · Digital Inspections V2 · `FR-08a` · artboard `TB7`
Extract from `DVI-V2-PRD.md`. Self-contained: everything needed to build this one feature.

---

## 1 · Why it exists

The template author's loop today:

```
build the template → publish it → open a work order → add the inspection
→ start it as a technician → find the problems → return to the builder → edit
```

Fabian, verbatim:

> *"It would still be nice for the user to see it, so they know what they are building and what it
> looks like. For the experience I had, I build the inspection, then I wanted to see it. So I went to
> a work order, added it, then started the inspection as if I was a technician. Saw some issues with
> it, then had to go back to the inspection page to edit stuff again. Would have been nice to see what
> I was building at the time of building it."*

Preview mode removes that round trip. It is not a nice-to-have on the side of the builder; it is the
builder's second half.

**Related but different, and both are needed:** the two tooltips (`FR-08`) answer *what is this field
type*. Preview answers *what am I building*. Do not let one replace the other.

---

## 2 · State

```
mode   : 'edit' | 'preview'        // template level, not field level
device : 'desktop' | 'phone'       // implicit — follows the viewport, NOT a control
```

`mode` belongs to the builder screen. It is not per-field and not per-section — an author previews the
template, then navigates sections inside the preview using the rail that is already there.

There is **no device switcher in the sub-header.** The phone gets the same preview at phone width,
following the width the builder is opened at. An earlier draft had a `Desktop / Phone` pair; it was
cut — the preview should follow the window, not ask.

---

## 3 · What Preview renders

> **Mount the real fill-screen component.** Do not build a second renderer, a static mock, or a
> "preview variant" of the fill screen. A preview that can drift from the thing it previews is worse
> than no preview, because it will be trusted.

| Aspect | Requirement |
| --- | --- |
| Source of truth | **The current draft, unsaved edits included.** Rename a row, switch to Preview, see the new name. Not the published version. |
| Interactivity | **Read-only, with one exception: the axle control.** `+ Add Axle` and the per-axle delete both work, and the resulting count **writes back to the draft** (see below). Nothing else takes input — no values, no verdicts, no Add Note, no Add Photo. A reference file still **opens**, because that is a read. |
| Mark OK actions | **Not drawn at all** — not inert, not greyed. They set verdicts, and Preview sets none. |
| Axle write-back | Adding or deleting an axle in Preview updates `field.axleCount` on the draft, so returning to Edit shows the new number on the `Axles` control. Preview is where an author first sees the field at real size and works out that three is not enough; making them carry that number back by hand is the round trip this mode exists to remove. |
| Writes | **No `Answer` row and no inspection record, ever.** The one draft mutation permitted is `axleCount` from the axle control. See §7. |
| Submit bar | **Not rendered at all.** The fill footer belongs to an inspection, not a template. |
| Banner / notice | **Not rendered.** The mode control says which mode the author is in. |
| Add / delete axle | **Both present and working.** Trying the field out is what Preview is for. |
| Axle count | Renders `field.axleCount` axles (`FR-07`, default 3). This is the first place the author sees that setting take effect. |
| Availability | Works on a **draft**. Must never require publishing. |

---

## 4 · Layout

### 4.1 The mode control

An `Edit` / `Preview` segmented control in the builder sub-header, sitting **left of `Save Draft`**.

```
height        34px
border        1px #CDD5DF, radius 8, overflow hidden
selected half background #364152, white label
idle half     background #fff, #697586 label
label         13px / 600
icons         pencil on Edit, eye on Preview — 14px, currentColor, 2px stroke
```

It appears in the sub-header of every full builder screen, in both modes.

### 4.2 Preview layout

```
EDIT                                    PREVIEW
┌──────┬──────────────┬────────┐        ┌──────┬───────────────────────┐
│ rail │   canvas     │ panel  │        │ rail │       canvas          │
│ 184  │   flex       │  328   │   →    │ 184  │       flex            │
└──────┴──────────────┴────────┘        └──────┴───────────────────────┘
```

**In Preview the properties panel steps aside and the canvas takes its width.**

That single move is the reason this design works where two earlier attempts failed:

- **Inline in the panel** — the panel is ~360px; the axle grid needs a 180px measurement column plus
  two value columns, and the top view wants 186px beside it. It arrived clipped, with a horizontal
  scrollbar.
- **A modal dialog** — cost a click, could only ever show one field, and could not show the author
  their template as a whole.

The axle grid needs **≥800px**. The canvas has it once the panel is gone. If you are considering a
different container, that is the constraint to test against.

**The sections rail stays.** The author previews one section at a time using navigation they already
know.

### 4.3 The banner

Directly beneath the sub-header, full width:

```
background  #FFFAEB
border      1px #FEF0C7 bottom
padding     10px 20px
icon        eye, 14px, #B54708
label       "Preview" — 13px / 600, #B54708
sentence    13px / 400, #B54708
```

> **Preview** · Nothing here is saved. This is the fill screen a technician gets from this template,
> with the 3 axles it starts them on.

**The number in that sentence is live, and scoped to the section being previewed.** It reads the
`axleCount` of the **first per-axle field in that section**. A template can hold several per-axle fields
with different counts, so there is no single number for the whole template. A section with no per-axle
field **drops the clause** — it must never render "0 axles". Hardcoding "3" defeats the point: this
sentence is where an author discovers what the `Axles` card actually did.

### 4.4 Click a field to edit it

The loop-closer. See the problem, click it, fix it.

| State | Treatment |
| --- | --- |
| Field card, hover | Border → `1.5px #257CFF`; shadow sm → md. **No pill, no label** — the whole card is the target |
| Click | Return to `mode: 'edit'` **with that field selected in the properties panel** |

Selection matters. Landing in Edit with nothing selected makes the author hunt for the field they just
clicked, which is the round trip again in miniature.

Beneath the preview canvas, one explanatory line for the author:

> Clicking a field here returns to **Edit** with that field selected in the panel — the loop that
> otherwise means publishing, opening a work order and starting an inspection as a technician.

---

## 5 · Copy

| Element | String |
| --- | --- |
| Mode control | `Edit` · `Preview` |


| Canvas footnote | *Clicking a field here returns to Edit with that field selected in the panel — the loop that otherwise means publishing, opening a work order and starting an inspection as a technician.* |
| Rail footnote | *The outline stays, so you can preview one section at a time.* |

Nothing else. No empty-state copy, no "exit preview" hint — the mode control is visible and selected.

---

## 6 · Tokens

Everything here already exists in the design system. Read from
`_ds/shopview-design-system-…/colors_and_type.css`.

| Role | Value |
| --- | --- |
| Selected mode half | `#364152` on white |
| Idle mode label | `#697586` |
| Control border | `1px #CDD5DF`, radius 8 |
| Banner surface / border / ink | `#FFFAEB` / `#FEF0C7` / `#B54708` |
| Hover card border | `1.5px #257CFF` |
| Pill ink | `#175CD3` |
| Shadow sm → md | `0 1px 2px rgba(11,23,51,.05)` → `0 4px 8px rgba(11,23,51,.08), 0 1px 2px rgba(11,23,51,.05)` |
| Transition | 120–160ms ease-out; colour + shadow only, no scale |
| Canvas | `#F8FAFC`, 22px 28px padding, column max 880px in preview |

---

## 7 · Self-check

Run all of these. The first two are the ones that matter — a preview that writes, or that lies about
the draft, is a defect worth shipping nothing for.

```
✓ entering preview mounts no Answer rows and creates no inspection record
✓ preview reflects an unsaved draft edit immediately
    → rename a measurement row, switch to Preview, the new name is there
✓ the properties panel is absent in preview; the canvas column widens
✓ clicking a previewed field lands in edit mode WITH that field selected
✓ the banner's axle count equals the first per-axle field's axleCount in the previewed section
✓ switching to a section with no per-axle field drops the clause rather than showing 0
✓ preview works on a draft — no publish required, no publish prompt
✓ the preview renders the same component as the fill screen (one renderer, not two)
✓ phone width: no horizontal scroll, no interactive target under 44px
✓ + Add Axle and the per-axle delete are both present in preview and both respond
✓ adding an axle in preview, then returning to Edit, shows the new number on the Axles control
✓ nothing else takes input: values, verdicts, Mark OK, Add Note and Add Photo are all inert
✓ a reference file still opens from preview — that is a read, not an edit
```

Integration check worth writing once: run the entire preview flow — enter, type into every input,
press every bulk-OK action, add an axle, click a verdict — then assert the inspection tables are
byte-identical to before.

---

## 8 · Do not

- **Do not build it as a dialog.** One was drawn and dropped.
- **Do not put it inline in the properties panel.** Tried; fails on width.
- **Do not write a second renderer** for the preview. Mount the fill screen.
- **Do not render the submit bar.** `Save & Exit` / `Submit & Generate Report` belong to an inspection, not a
  template. An inert Submit invites the author to think something can be sent.
- **Do not add a banner, notice or helper paragraph.** One was drawn and removed.
- **Do not draw the Mark OK actions.** Removed 2026-09-16: they set verdicts, and Preview sets none.
- **Do not draw an `Edit this field` pill.** Removed 2026-09-16: the hovered card is the click target.
- **Do not require publishing** to preview.
- **Do not add a device switcher.** Cut deliberately — the preview follows the window.
- **Do not remove the tooltips** (`FR-08`) on the grounds that preview covers it. Different questions.
- **Do not let preview write an answer or an inspection record**, including a "preview inspection" that is
  cleaned up later. Invariant `I3`: no `Answer` exists that a technician did not cause. `axleCount` is the one
  draft field preview may change.
- **Do not make the axle count session-local.** An author who discovers three is not enough must not have
  to retype it in Edit — that is the round trip this mode removes.

---

## 9 · Reference

| What | Where |
| --- | --- |
| Requirement, with acceptance | `DVI-V2-PRD.md` § FR-08a |
| User story | `DVI-V2-user-stories.md` § TB-11 |
| Build spec | `DVI-V2-build-spec.md` §2, "Preview mode" |
| Design documentation | `README.md`, template builder section |
| Artboard | `TB7` in `Inspection Template Builder V2 - Desktop.dc.html` — desktop board plus the phone rendering beside it. Also in `Digital Inspections V2 - All Screens.dc.html`. |
| Fill screen being previewed | §6.2 of the PRD; artboards `A1`–`A6`, with `A6` live |
| Phone fill screen | §6.3 of the PRD; artboards `M1`–`M6` |

Artboard ids and `data-screen-label` values are stable and cited across the documents — keep them.
