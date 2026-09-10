# Defect candidates — Inline Add and Edit Parts, run R418

**Live tally: 2 real · 5 closed as not-defects after verification.** Seven candidates have been
killed by a second measurement in this pass; that is the gate working, not caution for its own sake.

**HELD. Nothing is filed.** The QA lead files these one at a time, after all execution is finished,
on his explicit per-defect go-ahead, and verifies each before the next.
Build for all of them: **`v26.36.0-f43b2fd`** on `sv9315.qa.shopview.com`, Full View, administrator.

---

## Candidate 1 — CONFIRMED TWICE · story SV-9316

**Cases:** [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) / [T2724196](https://shopview.testrail.io/index.php?/tests/view/2724196) · [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) / [T2724197](https://shopview.testrail.io/index.php?/tests/view/2724197)

**The rule (S1-N1, S1-N2, as re-verified 2026-09-09):** the "Add Part" button and the Edit control
are not displayed when the work order status is Complete, Invoiced, Paid, **Declined** or Imported.

**What the build does:** on Declined work order **S9315-15897** the Add Part button is shown, and
pressing it genuinely opens the inline row. The Edit controls are present on the part rows and come
to full opacity on a real mouse hover — i.e. fully functional.

**Controls that prove the check is sound:** Complete (S9315-15856), Invoiced (S2-15828) and Paid
(S9315-15894) all correctly show **zero** of both controls, with their Parts sections rendered on
screen. Approved shows 3 Add Part and 5 Edit controls, as it should.

**The case's own instruction:** *"if the button is hidden on Complete, Invoiced, and Paid but SHOWN
on Declined, mark the case FAILED on the Declined check and report the deviation."* That is exactly
what happened.

Evidence: `evidence/21-c44993.json`, `evidence/23-statusmatrix.json`, `evidence/25-declined.json`.
**Annotated shot: `defect-shots/candidate1-declined-add-part.png`.**

---

## Candidate 2 — CONFIRMED, ISOLATED · story SV-9319

**Case:** [C45058](https://shopview.testrail.io/index.php?/cases/view/45058) / [T2724261](https://shopview.testrail.io/index.php?/tests/view/2724261)

**The rule (S4-N5):** the message names the field — "Cost must be a number.", "Cost cannot be
negative.", "Sell price must be a number.", "Sell price cannot be negative." as applicable.

**What the build does — two of the four are right, two are wrong:**

| Input | Message required | Message shown | |
|---|---|---|---|
| Cost `-5` | "Cost cannot be negative." | **"Cost cannot be negative."** | correct |
| Sell price `-4` | "Sell price cannot be negative." | **"Sell price cannot be negative."** | correct |
| Cost `abc` | "Cost must be a number." | **"Enter a cost to save this part."** | wrong message |
| Sell price `xyz` | "Sell price must be a number." | **"Enter a sell price to save this part."** | wrong message |

The letters are **not rejected at the field** either — `abc` and `xyz` stay in the boxes. The message
shown is the *empty-field* message, which is misleading: it tells the user to enter a cost when they
have entered one, just not a number. Each case was run on its own with a page reload first, so no
leftover state could confuse it.

Evidence: `evidence/33-fv-g.json`, `evidence/31-fv-e.json`.
**Annotated shot: `defect-shots/candidate2-cost-letters-message.png`.**

---

## Candidate 3 — ❌ CLOSED, NOT A DEFECT (2026-09-10) · story SV-9319

**Case:** [C45046](https://shopview.testrail.io/index.php?/cases/view/45046) / [T2724249](https://shopview.testrail.io/index.php?/tests/view/2724249)

**The rule (S4-R11):** saving from the part details window adds the part, closes the window AND
closes the inline row, and opens no new row.

**What was seen:** with a complete row (description, quantity 1, cost 3.00, sell price 6.00),
"More options" then "Save part" left the **window open**, the **inline row open**, no toast, and the
part not added.

**CLOSED — the refusal was correct.** Re-run capturing the window's own messages: it shows
**"Category is a required field"**. Category is required in the detailed window and was empty, so the
refusal is right. With a Category set, "Save part" added the part, closed the window, closed the quick
row and opened no new row — every clause of S4-R11 holds. **C45046 is PASSED.**

A second thing this exposed and settled: my first attempt looked for a button called "Save part" in the
*edit* window, where the button is actually **"Save & close"**. The two windows do not share button
names — New Part Request has `× · AI ShopCoach Parts · Save part`, Edit Part Request has
`× · Cancel order · Save & close`.

Evidence: `evidence/33-fv-g.json`.

---

## Candidate 4 — ❌ CLOSED, NOT A DEFECT (2026-09-10) · story SV-9319

**Case:** [C45040](https://shopview.testrail.io/index.php?/cases/view/45040) / [T2724243](https://shopview.testrail.io/index.php?/tests/view/2724243)

**The rule (S4-R5) clause 2:** a part saved with no category is assigned "Uncategorized".

**What was seen:** a part saved from the inline row without choosing a category opens in "Edit Part
Request" with the Category box **empty**, not "Uncategorized". Clause 1 is fine — the category
control is a genuine select listing the shop's categories.

**CLOSED — the stored value is correct.** The work order's **Parts tab** shows every part saved from
the quick row without a category with **Category = "Uncategorized"**, including the one in question.
The edit window merely renders its Category box blank for such a part; the value stored and displayed
in the Parts list is Uncategorized. **C45040 is PASSED, both clauses.**

Evidence: `evidence/33-fv-g.json`.

---

## Review item (not a defect) — for the QA lead

**Case:** [C45047](https://shopview.testrail.io/index.php?/cases/view/45047) / [T2724250](https://shopview.testrail.io/index.php?/tests/view/2724250) — **passed**, with a wording question.

The case says the part details window is cancelled *"via Cancel, the X, or Escape"*. There is **no
button labelled "Cancel"** in that window — its buttons are **×**, **"AI ShopCoach Parts"** and
**"Save part"**. Both routes that do exist behave correctly (nothing discarded, row intact, modal
changes not carried back), so the behaviour under test holds and the case passed. The question is
whether the case wording should drop "Cancel", or whether the window should have that button.

---

## Candidate 5 — OBSERVED 2026-09-10 · story SV-9321 (Story 6, Unsaved Data Protection)

**Case:** [C45070](https://shopview.testrail.io/index.php?/cases/view/45070) — *Closing a changed
edit row shows the discard-changes confirmation* · run [R418](https://shopview.testrail.io/index.php?/runs/view/418).

The dialog's **title and body are exactly as specified**; the **second action's label is not**.

| Element | Spec (S6-R1, spec v16) | Build v26.36.0-f43b2fd | Verdict |
|---|---|---|---|
| Title | "Discard these changes?" | **"Discard these changes?"** | correct |
| Body | "The changes you made will be lost." | **"The changes you made will be lost."** | correct |
| Action 1 | "Keep Editing" | **"Keep Editing"** | correct |
| Action 2 | **"Discard Part"** | **"Discard Changes"** | **wrong label** |

The case is explicit that the actions are *"unchanged"* between the add-row and the edit-row
dialogs. On the add row the build does show **"Discard Part"** (observed the same session,
[C45011](https://shopview.testrail.io/index.php?/cases/view/45011) — passed), so the two dialogs
disagree with each other in the build, not only with the spec.

**The label is quoted as DISPLAYED.** `textContent` reads `Discard changes`; the screen reads
**"Discard Changes"**, because the button carries a CSS `text-transform`. The rendered string is the
one above and the one in the annotated shot.

Behaviour is correct either way: choosing it closes the row and restores the part's saved values.

Evidence: `evidence/46-tv-edit.json` (`editGuard`), `evidence/46-b-editguard.png`,
`evidence/48-a-discardpart.png` (the add-row dialog for comparison).
**Annotated shot: `defect-shots/candidate5-edit-discard-label.png`.**

**Held** pending the QA lead's per-defect go-ahead (Rule 62 / his standing instruction).

---

## Candidate 6 — ❌ CLOSED, NOT A DEFECT (2026-09-10) · story SV-9321

**Case:** [C45081](https://shopview.testrail.io/index.php?/cases/view/45081) — *Untouched follow-on
empty row after a save prompts nothing* — **passed**.

Probe 48 saw the **"Leave without saving?"** dialog once, on an untouched follow-on row in Full
View, where the case says navigation proceeds freely. That would have been a defect. It did not
reproduce.

Probe 60 ran the identical three legs **twice in each view** — Tech view and Full View, four runs,
each on a freshly loaded page, each with a control leg (a plain empty row opened by "Add Part",
which is [C45077](https://shopview.testrail.io/index.php?/cases/view/45077) and correctly shows no
dialog). **All four runs showed no dialog on the follow-on row and navigated straight to the
schedule.** Dismissing the untouched follow-on row instead also closed it with no confirmation.

One sighting in a long sequential probe is not evidence; the single run that saw it had eight other
legs on the same browser session before it. **Nothing is filed.**

Evidence: `evidence/60-c45081.json`, `evidence/60-{admin,tech}-{1,2}.png`, and the original
`evidence/48-unsaved.json` sighting for the record.

---

## Candidate 7 — OBSERVED 2026-09-10 · stories SV-9317 (Tech) and SV-9319 (Full View)

**Cases:** [C45022](https://shopview.testrail.io/index.php?/cases/view/45022) *(Any other save failure
keeps the row open with data intact)* and [C45062](https://shopview.testrail.io/index.php?/cases/view/45062)
*(the Full View twin)* · run [R418](https://shopview.testrail.io/index.php?/runs/view/418).

**The rule (S2-EH1):** when a save fails for a reason other than the work order becoming
non-editable, an alert toast reads **"Couldn't add the part. Please try again."** and **the inline row
remains open with the entered data intact.**

**What the build does — two different failures, two different wrong answers:**

| The failure | Toast required | Toast shown | Row afterwards | Typing |
|---|---|---|---|---|
| Server error (HTTP 500 on `POST /api/work-orders/part/make-request`) | "Couldn't add the part. Please try again." | **"Ooooops! An error occurred"** | **stays open** ✓ | **kept** ✓ |
| Network failure (the same request cut off in flight) | "Couldn't add the part. Please try again." | **none at all** | **closes** ✗ | **lost** ✗ |

The server-error case is a wording defect. **The network-failure case is worse than that**: the row
closes as though the save had succeeded, no message of any kind is shown, and the part is not on the
work order. A tester — or a technician on a poor connection in a shop — is told nothing and loses the
line they just typed. Confirmed against a clean reload each time: the part count returns to 22 and the
part is absent.

**A control leg was run in the same probe** with nothing intercepted: the save went through normally,
the part count went 22 → 23 and the part was still there after a reload. So the harness itself is not
the cause — the difference is entirely the failed request.

Evidence: `evidence/62-savefail2.json`, `evidence/62-c45022-abort.png`, `evidence/62-c45022-500.png`,
`evidence/62-c45022-control.png`.

**Held** pending the QA lead's per-defect go-ahead.

---

## Review item (not filed, and not called a defect) — [C45222](https://shopview.testrail.io/index.php?/cases/view/45222) clause 3

**"A part with no bins shows 'Not stocked' in warning styling instead of chips."**

The card for a catalogue part carries the word **"Catalog"** where a stocked part's card reads
*"Inventory Qty: 6 EA · Unassigned 6"*. It does **not** say "Not stocked", and it is not in warning
styling. Observed on **F40010212** — *"Slack Adjuster F40010212 **Catalog** M807013…"*.

**This is a question for the QA lead before it is called anything**, for two reasons:

1. **The two may not be the same thing.** A *catalogue* part has no inventory record at all; the case
   may mean an *inventory* part that happens to be held in **zero** bins — a different state, and one
   this branch may not contain. Every stocked part looked at carries at least an "Unassigned" bin,
   including parts whose bin holds 0 or −1.
2. If they ARE the same thing, "Catalog" is arguably the better label — it says what the part is,
   where "Not stocked" says only what it lacks — so this could be a case-wording change rather than a
   build fix.

**What is settled either way:** clause 1 holds — the card shows the total quantity and then a bin chip
with its own count. Clause 2 (the "+ N" chip when a part sits in more than three bins) **has no data
state on this branch**: no part is held in more than one bin, so it could not be tested at all.

Evidence: `evidence/74-bins2.json`, `evidence/74-a-notstocked.png`.
