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
- **The Edit control's behaviour**, in either view. It is present and it responds, but neither an
  inline row nor a modal was captured after clicking it in Tech View. Not concluded either way —
  needs one more capture. (C45023 expects an inline row with the same three fields; C45063 expects a
  pre-populated modal in Full View.)

### A third instrument error — the one that matters most

**"Add Part is not visible in Tech View"** was my first Tech View reading, and it was wrong twice
over: the technician I impersonated was based at *Staging Lethbridge* while the work order is at
*Staging Heavy Duty 9919*, and I never checked the page had rendered at all. Re-run with a technician
at the work order's **own** workplace and a landing assertion (Lines tab present, 3 existing part rows
visible, not on `/login`), the button is **there** and the row opens.

Had I reported that, it would have contradicted 25 cases on the strength of a workplace mismatch.
The landing assertion is now built into the capture tool.

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

## OUTSTANDING

1. **Tech View access** — to verify 38 Tech View cases I need the Technician view mode. I can swap the
   role on the Technician quick-login user (skill 03 §8.2a) — say the word and I will, or tell me if
   you would rather I used a different account on this branch.
2. Nothing else blocking. Verification continues on the Full View, Add-Part-button and Bin Allocation
   areas, which need no extra access.
