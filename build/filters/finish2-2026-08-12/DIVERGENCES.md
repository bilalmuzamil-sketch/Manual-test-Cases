# Filters — divergences (finish2), 2026-08-12

**Build `v3.6-3e9dd6d`, read at 12:07Z and unmoved.** Every entry quotes both texts.

> **THIS FILE IS NOT EMPTY.**
> **0 COSMETIC step corrections** — every case walked this pass was runnable exactly as written.
> **0 NEW SUBSTANTIVE divergences** — no case sent a tester to something that does not exist.
> **1 CORRECTION OF OUR OWN EARLIER READING, made inside this same pass.**
> **3 build behaviours recorded against cases that are correct and should FAIL** — left alone
> deliberately, because a hold would disarm a working case.
> **2 items inherited and still owed.**

---

## 1 · THE CATEGORY QUESTION, ANSWERED FOR EVERY CASE WALKED

The test is *would a reader of the source recognise what the build offers as the same thing?*
For all **12** fully-walked cases the answer was **yes** — every precondition was reachable, every
navigation path existed, every named control was where the step said it was, the steps worked in
the order written, and the labels matched. **So nothing was rewritten, and nothing needed to be.**

---

## 2 · A CORRECTION OF OUR OWN, MADE AND OWNED WITHIN THE PASS

### C29614 — an earlier reading in this same pass was WRONG

**[C29614](https://shopview.testrail.io/index.php?/cases/view/29614)** — *"Filters are remembered
permanently, even after closing the browser"*.

**WHAT THE FIRST PROBE SAW, AND REPORTED INTERNALLY AS A GENUINE FAILURE:** a filter applied by
opening `?tab=all&status=approved`, then navigating to Customers and Parts and back to
`/workorders`, left the chip reading plain **`Status`** — and the saved preference showed
**`"filters": []`**.

**WHY THAT WAS WRONG:** the filter had been applied **by URL**. Driven the way a tester drives it —
**clicking the Status chip and ticking Approved** — the preference stored
**`{"status":["approved"],"company_id":[]}`**, and after visiting Customers and returning plainly to
`/workorders` the chip read **`Status : Approved`** again.

**SO THE BUILD DISTINGUISHES THE TWO, AND THE DISTINCTION IS THE USEFUL FINDING:**

| How the filter was applied | Saved to the account? | Restored on return? |
|---|---|---|
| By URL (`?status=approved`) | **No** — `filters` stayed `[]` | No |
| By the chip control | **Yes** — `{"status":["approved"]}` | **Yes** |

**CONSEQUENCE, STATED PLAINLY: C29614's expectation 1 PASSES on the path a tester actually takes.**
Its expectations 2 and 3 — closing the browser completely, and a second computer — were **not**
established here. **We are not calling C29614 a failure, and we are not calling it a pass**; the
verdict is the tester's (Rule 10 as amended on 11 August). What we can say is that the reading that
would have corroborated a defect **was our own probe's artefact**, and it is corrected here rather
than left in an evidence file to be quoted later.

---

## 3 · C29601 — the pressed look is applied in the OPPOSITE state

**[C29601](https://shopview.testrail.io/index.php?/cases/view/29601)**, expectation 3:

> *"3. The filter icon shows a pressed/active look **while the bar is collapsed**."*

**WHAT THE BUILD DOES** (measured with focus and hover controlled — `element.blur()`, not a page
click, after the first attempt navigated away and established nothing):

| State | modifier class | computed colour | computed background |
|---|---|---|---|
| Expanded, blurred | **`filter-toggle-button--open` PRESENT** | `rgb(97,97,97)` | `rgb(239,242,246)` |
| Collapsed, blurred | **absent** | `rgb(97,97,97)` | `rgb(239,242,246)` |

There is **no `aria-pressed`**, and the colour and background are **identical in both states**. The
only state marker is a class, and it is applied **while the bar is OPEN** — the inverse of what the
case requires. The focus-helper opacity is **not** a distinguishing signal: once the pointer was left
over the button it read `0.15` in the expanded state too.

**LEFT EXACTLY AS IT IS, DELIBERATELY.** Expectations 1 and 2 pass, the case is fully runnable, and
the tester has already failed it under **SV-8903**. Adding a hold would disarm a case that is doing
its job.

---

## 4 · C29622 — three parts of the sheet description are not met

**[C29622](https://shopview.testrail.io/index.php?/cases/view/29622)**:

> *"1. A bottom sheet slides up with a **drag handle** at the top, the **centered title 'All
> Filters'** and a close (x) button. 2. It lists the five filters as expandable accordion rows,
> **each with its icon**, name and a down arrow…"*

**WHAT THE BUILD DOES** (measured against the sheet **card**, top 482, height 354):

| Required | Observed |
|---|---|
| drag handle at the top | **absent** — the top 40 px holds a header, the title and the close button, and nothing else |
| **centered** title | **left-aligned**: `text-align: start`, 17 px from the left edge, 291 px from the right, centre offset **−137 px** |
| each row with **its icon** | rows carry only `keyboard_arrow_down` (and `search` where searchable) — **no `person` / `build` / `headset_mic` / `local_shipping`**, though those same glyphs *are* on the chip row |
| sticky blue `Apply Filters` at the bottom | **present**, `rgb(56,116,255)`, 13 px off the card bottom ✓ |

**Stickiness itself is NOT established** — with all rows collapsed the content fits, so there was
nothing to scroll.
**Left alone**; the tester has failed it under **SV-9000**.

---

## 5 · C29628 — the phone chip shows a COUNT where the case requires the VALUE

**[C29628](https://shopview.testrail.io/index.php?/cases/view/29628)**, expectation 1:

> *"1. The chip for the applied filter shows the active state **with the selected value(s)**, like on
> desktop."*

**WHAT THE BUILD DOES**, with `status=approved` at 390 × 844: the chip reads **`Status (1)`** and the
All Filters chip reads **`All Filters (1)`**, both tinted `rgb(227,242,253)`. On desktop the same
filter reads **`Status : Approved`**. So the active state is shown; **the selected value is not**.

**Also worth the tester's time, and not a fault:** `Clear Filters` **is** present, but it sits at
**x≈1032** in a horizontally scrolling chip row on a 390-px screen — **you have to scroll the chip
row to reach it.** Step 2 is satisfiable, and expectations 2 and 3 pass once you do.
**Left alone**; the tester has failed it under **SV-8846**.

---

## 6 · INHERITED AND STILL OWED

| Item | State |
|---|---|
| **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — the empty state offers no way to clear the search on its own, against spec v19 `S8-R4`/`S8-R5` | **Still the one unticketed real deviation on this project.** Not re-driven this pass; the previous pass established it with a proper rule-out. **It needs a ticket the moment the creation hold lifts.** |
| **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** — ~42 surface names, two known wrong (`IBS Batch Transactions` → **`IBS Batches`**, `Sales Tax Invoices` → **`Sales Tax Collected`**) | Still owed as **one pass over all 42 surfaces**, not two spot fixes. **The tester marked it Blocked at 12:41Z today** — the correct outcome for a held case. |
| **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581)** and **[C29588](https://shopview.testrail.io/index.php?/cases/view/29588)** | Need a **staff record deactivated**. Barred for us on this branch — such an edit destroys the session of every holder. **Ordinary work for a tester**, and flagged so nobody records them as unrunnable. |

---

## 7 · RAISED TO THE QA LEAD

1. **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) passes as written, and is
   marked Failed.** The tester's own comment says the fault is on **Parts/Reports** pages; this case
   only ever exercises **Work Orders**, where the build behaves correctly. **SV-8905 may well be a
   real defect — but this case is not the evidence for it, and no case covers that ground.**
   Details in `FINDINGS.md` §1.
2. **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) still needs a ticket.**
3. **[C29625](https://shopview.testrail.io/index.php?/cases/view/29625)'s expect-fail note describes
   the wrong sheet.** Its precondition is the **All Filters** sheet, where selection is deferred and
   produces a removable tag; its note describes the **single-filter** sheet's instant-apply
   behaviour (SV-8875). The tester marked it **Passed**, which is consistent with what was observed.
