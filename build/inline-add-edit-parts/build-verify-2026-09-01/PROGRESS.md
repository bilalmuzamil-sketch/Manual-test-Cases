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

## Not yet established — and deliberately not guessed

- **Tech View** (25 + 13 cases). The admin account is in **Full View**, which is why the row shows six
  fields. Tech View is expected to show three fields and no pricing (C44998). **Needs the Technician
  view mode** — not yet observed, so no Tech View case has a verdict.
- **"Not stocked" card** (C45222 leg 3) and the **"+ N" collapse chip** (leg 2). Neither appeared in
  the sample: they need a part with **no** bins and a part in **more than three** bins. Data states to
  seed, not findings.
- **Full View Edit opens a modal** (C45063) — the Edit control was seen but its behaviour is not yet
  captured.

## Two instrument errors caught before they became false findings

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
