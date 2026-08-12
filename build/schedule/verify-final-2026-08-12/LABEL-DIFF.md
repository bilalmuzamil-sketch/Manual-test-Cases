# Schedule — label diff, verify-final, 2026-08-12

**Build `v3.5-65d6500`**, unmoved. **Location `Staging Heavy Duty - 9919`**, confirmed on screen
before every observation.

Every label below was read as a **RAW TEXT NODE with its computed `text-transform` recorded beside
it**. That is not pedantry: these panels are painted uppercase, so the screen — and any screenshot,
and any `innerText` dump — returns `FILTER & DISPLAY` while the build stores `Filter & display`.

---

## 1 · CONFIRMED EXACT — read again on this build, this pass

| Label our case asserts | Stored | Painted | Cases |
|---|---|---|---|
| `Filter & display` | `Filter & display` | **UPPERCASE** | C30042 · C29930 · C30043 · C30044 · C30045 · C30082 |
| `VIN Number` | `VIN Number` | as stored | C30042 · C30034 · C30045 |
| `My Shifts` | `My Shifts` | as stored | C30044 · C30082 |
| `Clear all` | `Clear all` (`button_sidebar_filters_clear`) | as stored | C29946 |
| `Day` / `Week` / `Month` | as stored | capitalize | C30074 and the view cases |
| `This shift only` | `This shift only` | as stored | C30058 |
| `Search work orders` | placeholder, as stored | — | C29939 · C29940 · C29941 · C29947 |

**`Filter & display` and `VIN Number` were confirmed a second time as the TECHNICIAN**, in that
user's own DOM — independent corroboration of the 11 August correction by a different account.

## 2 · CORRECTED — the build ships different wording

| Case | Was | **Build ships** | Field |
|---|---|---|---|
| [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | `this and everything after` | **`This and all later shifts`** | `custom_steps` |

**Only one correction, and it was in a step** — which is the half that strands a tester.

## 3 · REPORTED, NOT CORRECTED

[C30061](https://shopview.testrail.io/index.php?/cases/view/30061) names the three scope options as
`this and after`, `this only` and `whole series` **inside its EXPECTED RESULT**. The build reads
`This and all later shifts`, `This shift only`, `Entire series (8 shifts)`. **An expected result is
not ours to edit** — raised in `DIVERGENCES.md` §F for the QA lead.

## 4 · THE SERIES DELETE DIALOG — captured in full, first time on this build

Opened on a middle shift of an 8-shift series, read, and **cancelled**:

```
"Delete from this series?"
"Series of 8 shifts"
"This shift is part of a series. Choose how much to remove."
"This shift only"              returns 12h
"This and all later shifts"    returns 64h 36m
"Entire series (8 shifts)"     returns 76h 36m
"Cancel"
```

**A middle shift offers all three options** — which is exactly what C30061 item 3 requires.

## 5 · THE SHIFT TOOLTIP — captured with the VIN toggle in BOTH states

```
toggle OFF:  Fuline Enterprises / G30 / Mon, Aug 10, 2026 · 12:00 PM – 8:43 PM /
             6 lines · 8h 43m / 3 line names / +3 more lines / 7h 28m / 8h 43m
toggle ON :  ...same, but the second line reads  G30 · VIN 12-06696
```

**The three-line cap and the `+N more lines` row are correct.** The VIN is not: it appears only with
the toggle ON, against a documented decision that asks for it either way. Recorded as a deviation on
[C30034](https://shopview.testrail.io/index.php?/cases/view/30034); the expectation is unchanged.

## 6 · WHAT REMAINS UNREACHED — the worklist, not a defect list

`Needs techs` (C29952 · C29961) needs a line with no technician · the weekend conflict reason
(C30024) needs a shift outside a technician's working days · the hours-overlap validation message
(C38851) · `series too long` (C38873) · `Adjust` (C30014), which was searched for and **is genuinely
not in this build**.

**These are surfaces we did not stand in, not controls we proved absent.** The distinction is the
whole point: the machine diff in `evidence/restamp-eligibility.json` reports them NOT-FOUND, and that
number is a worklist, never a finding.
