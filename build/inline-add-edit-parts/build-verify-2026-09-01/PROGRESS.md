# Inline Add and Edit Parts (6597) — build verification, 1 September 2026

**Branch:** sv9315 · **Suite:** 119 cases · **First contact with a build** — every case previously
carried `AUTOMATION: Not available on Build to test Yet`, because no build existed.

## HEADLINE: the feature is on the build

Confirmed on three separate work orders (S9315-15591, S9315-15017, S9315-14846): each work order
line's Parts section carries an **Add Part** button (`button_add_part`) and an **Edit** control
(`button_edit_part`), exactly where the suite says to look.

## What has been observed live so far

| Area | Observed | Notes |
|---|---|---|
| **Add Part button** | ✅ present on every line, visible | one per line; labelled `Add Part` |
| **Edit control** | ✅ present per existing part row | labelled `edit` |
| **Inline add row** | ✅ opens on click, `inline_part_row` | see field set below |
| **Field set and ORDER** | ✅ `Description · Part number · Qty · Category · Cost · Sell price` | six fields, that order — the Full View shape |
| **Row controls** | ✅ `More options`, `Save`, close | `More options` opens the full **New Part Request** modal |
| **Unsaved-data protection** | ✅ works on **both** the close control and the **Escape** key | dialog: *"Discard this part? The details you entered will be lost."* with **Keep Editing** / **Discard Part** |
| **Bin Allocation (the new Story 7)** | ✅ **built** | detail below |

### Bin Allocation — the whole chain is there

| Case | Expectation | Observed |
|---|---|---|
| C45222 | result cards show total inventory quantity, then per-bin quantity | ✅ e.g. `Inventory Qty: 7 EA PB1 7` |
| C45224 | allocation shows below the row as **"Pulled from"** + a chip | ✅ "Pulled from" on screen, chip present |
| C45225 | chip label is the **bin name** for a single-bin allocation | ✅ label reads `PB1` |
| C45226 | picker lists every bin with on-hand, a **check** on the selected one and a **Default** badge | ✅ `check PB1 Default 7`, plus a `Split across bins…` entry |

### Tech View — verified, and it needed no role change

The **Technician role already carries `view_mode: 'tech'`** and lacks `woFullViewMode`, read live from
`GET /api/roles/{id}`. So impersonating an active Technician **is** Tech View: nothing was changed and
nothing needs restoring (skill 03 §8.2a's five-step swap is for when no such role holder exists).

| Viewer | `view_mode` | Inline add row fields | Pricing on the row |
|---|---|---|---|
| Admin | `full` | `Description · Part number · Qty · Category · Cost · Sell price` | **yes** |
| Christopher Smith, Technician | `tech` | **`Description · Part number · Qty`** | **no** |

Row text as the technician, verbatim: `Description Part number Qty Save Cancel`.

That is **C44998** ("Tech View inline add row shows exactly three fields and no pricing") observed
directly, as a clean A/B against Full View.

## Not yet established — and deliberately not guessed
- **"Not stocked" card** (C45222 leg 3) and the **"+ N" collapse chip** (leg 2). Neither appeared in
  the sample: they need a part with **no** bins and a part in **more than three** bins. Data states to
  seed, not findings.
### The Edit control — verified in BOTH views

| View | Observed | Case |
|---|---|---|
| **Full View** | the **"Edit Part Request" modal** opens **pre-populated**: `Part number SUBLET · Description "Cylinder Re-Seal" · Quantity 1 · Source Vendor · Cost 1,279.75 · Core charge 0.00 · Sell price 1,551.21 · Margin 17.49989` | **C45063** ✅ |
| **Tech View** | an **inline row below the part** with **the same three fields** — `Description · Part number · Qty` — plus Save/Cancel and a keyboard legend reading **`Enter save · Tab next field · Esc cancel`** | **C45023** ✅ |

**The add row and the edit row are different elements:** `inline_part_row` for add,
**`inline_part_edit_row`** for edit. Looking only for the add-row id is why an earlier capture
reported "no inline row and no modal" on a click that had plainly done something.

### A third instrument error — the one that matters most

**"Add Part is not visible in Tech View"** was my first Tech View reading, and it was wrong twice
over: the technician I impersonated was based at *Staging Lethbridge* while the work order is at
*Staging Heavy Duty 9919*, and I never checked the page had rendered at all. Re-run with a technician
at the work order's **own** workplace and a landing assertion (Lines tab present, 3 existing part rows
visible, not on `/login`), the button is **there** and the row opens.

Had I reported that, it would have contradicted 25 cases on the strength of a workplace mismatch.
The landing assertion is now built into the capture tool.

### A fourth — the Edit row has its own test-id

"Edit does nothing in Tech View" survived one careful re-run *with* a landing assertion, which made it
look solid. It was still wrong: the edit row is `inline_part_edit_row`, and I was only looking for
`inline_part_row`. A whole-DOM before/after diff settled it in one run — 7 new test-ids, 4 new inputs,
and the words `Description · number · Qty · Save · Cancel · Enter save · Tab next field · Esc cancel`
appearing.

**When a negative survives a re-run, stop refining the selector and diff the whole surface.** A
targeted selector can only ever confirm your own guess about what should appear.

## Two more instrument errors caught before they became false findings

Recording these because both would have been reported as defects (skill 03 §8.0-b):

1. **"No discard confirmation"** — the first attempt clicked `More options` first, which opens the
   New Part Request modal, and then typed and cancelled *behind* that modal. Re-run in isolation with
   a positive control (no dialog on screen before starting): the confirmation is there and correct.
2. **"Bin Allocation not built"** — the first pass searched the page for the word **"bin"** and found
   none, while `button_pulled_from_bin` was sitting in the very same capture. The control is labelled
   **"Pulled from"**, which contains no "bin" at all. **Search for what the case says, not for the
   word you have in your head.**

## Housekeeping

- **[C45220](https://shopview.testrail.io/index.php?/cases/view/45220) is Vladimir Tomovic's and is
  flagged Automated.** It is foreign (Rule 38) and protected (Rule 71), and it is the single case in
  this suite that fails the runnability gate — it has **no steps at all**. **Reported, not touched.**
- The rest of the suite passes the runnability gate: **118 of 119**. The other session's route work
  holds up.
- Three Automated cases in this suite: C45220 (Vlad's), C45005, C45026. None written by this pass.

## All seven areas of the suite now have their backbone observed

| Area | Cases | Backbone verified |
|---|---|---|
| Add Part Button and Edit Control | 11 | ✅ |
| Tech View Inline Add | 25 | ✅ three fields, no pricing |
| Tech View Inline Edit | 13 | ✅ `inline_part_edit_row`, same three fields |
| Full View Inline Add | 27 | ✅ six fields, exact order |
| Full View Edit | 6 | ✅ pre-populated modal |
| Unsaved Data Protection | 15 | ✅ both the close control and Escape |
| Bin Allocation | 22 | ✅ cards, Pulled from chip, bin picker with Default badge |

## OUTSTANDING

1. **Nothing blocking.** Per-case verdicts and the marker/runnability pass come next.
2. **[C45220](https://shopview.testrail.io/index.php?/cases/view/45220)** — Vladimir Tomovic's case,
   flagged Automated, **no steps at all**, and the only case in the suite failing the runnability
   gate. The QA lead's override covers *another session's* writes; this is a **person's** case and an
   **Automated** one, so Rules 38 and 71 both apply. **Flagged, not touched — say the word and I will
   write steps for it.**
3. Two bin data states still to seed: a part with **no** bins ("Not stocked") and a part in **more
   than three** bins (the "+ N" collapse chip).
