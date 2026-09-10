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

**Both views behave the same way.** The table above is Tech view (C45022); Full View (C45062) was run
separately and matched it exactly — the 500 gave *"Ooooops! An error occurred"* with the row and its
data intact, and the cut-off request gave no message at all, closed the row, and left the part count
unchanged at 27 across a clean reload.

Evidence: `evidence/62-savefail2.json`, `evidence/62-c45022-abort.png`, `evidence/62-c45022-500.png`,
`evidence/62-c45022-control.png`, `evidence/76-final.json`, `evidence/76-c45062-abort.png`,
`evidence/76-c45062-500.png`.

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

---

## Candidate 8 — OBSERVED 2026-09-10 · story SV-9317 (Story 2, S2-R5)

**Case:** [C45001](https://shopview.testrail.io/index.php?/cases/view/45001) *(Description overwrite:
editable for catalog, read-only for inventory)* · run [R418](https://shopview.testrail.io/index.php?/runs/view/418).

**🛑 THIS CASE IS CURRENTLY MARKED PASSED IN R418 AND THAT IS WRONG — see the note at the end.**

**The rule (S2-R5, added by the spec update of 2026-09-04, SV-9766):** *"After the inline part request
is saved, description, cost, core charge and vendor become read-only; where no vendor was predefined,
that field is empty and still read-only."*

**What the build does:** none of the four lock after the save.

A catalogue part (**F40010212**, "Slack Adjuster") was chosen, its description overwritten with
`ZZAUTOTEST c45001 after-save`, cost set to 14.00 and sell price to 28.00, and saved. Re-opening that
saved part request:

| Field | After the save, required | After the save, observed |
|---|---|---|
| Description | read-only | **editable** — `ZZAUTOTEST c45001 after-save` |
| Cost | read-only | **editable** — `14.00000` |
| Core charge | read-only | **editable** — `0.00` |
| Vendor | empty **and read-only** | empty but **editable** |
| Source | (not named by the rule) | read-only — `Vendor` |

So the one field that *is* locked is the one the rule does not mention, and all four that it does name
stay open for editing.

Clauses 1 and 2 of this case both **pass** and were verified repeatedly — a catalogue part's
description can be overwritten (four parts), an inventory part's cannot (five parts). It is only
clause 3 that fails.

Evidence: `evidence/76-final.json`, `evidence/76-a-aftersave.png`.

### ⚠️ A result already written to the run needs correcting

C45001 was marked **Passed** in R418 earlier in this pass, with a note saying clause 3 "was still
being checked when this result was written". Clause 3 has now been checked and it fails, so **the
case must move to Failed** once this defect is raised and approved. Nothing else in R418 is affected.

---

## Review item — [C45250](https://shopview.testrail.io/index.php?/cases/view/45250), and a correction to my own earlier reading

**Clause 1 passes.** On a line whose status is **Complete**, that line's own Parts section still offers
**"+ Add Part"** and clicking it opens the inline row. Verified by locating the Complete line's own
block (it reads *"TEST … Complete … Add Part"*) rather than clicking the first button on the page.

**Clause 2 — the part really is added.** Both test parts typed onto the Complete line are in the
saved parts list after a full reload: *"(-) ZZAUTOTEST c45250 admin"* and *"(-) ZZAUTOTEST c45250
tech"*. So the user is not asked to uncomplete the line first, which is the outcome the case is
protecting.

**🛑 I reported the opposite twice before getting here, and both readings were my own errors:**

1. *"the save does nothing"* — the run was in Full View and my probe filled only description and
   quantity, so the save was correctly refused with **"Enter a cost and sell price to save this part."**
2. *"the part never landed"* — I was counting the line's `part_requests` array, which is empty for
   this line in that response shape. The parts list on screen is the truth, and it shows both parts.

**What is left genuinely open, and is a question rather than a defect:** the case says *"the system
uncompletes the line on your behalf"*. The part is added without any demand to uncomplete, but the
line's status still reads **complete** afterwards, in the API and in the block on screen. So either
the case's wording overstates the mechanism, or the line should have flipped and did not.

*Options:* (a) the case's clause 2 is reworded to what the build does — the part is added and the line
is left as it is; (b) the build is changed to uncomplete the line; (c) I test it once more against
whatever the spec says exactly. **Not filed, and no verdict written to the run.**

Evidence: `evidence/96-c45250.json`, `evidence/96-c45250.png`, `evidence/84-c45250c.json`,
`evidence/93-c45250d.json`.

---

## Candidate 6 — CONFIRMED 2026-09-10 · story SV-9319 (Story 4, Inline Add Part - Full View)

**Case:** [C45061](https://shopview.testrail.io/index.php?/cases/view/45061) — *Work order becoming
non-editable during Full View add fails the save*

**The rule (S4-E3):** if the work order moves to a status that does not permit editing while an
inline row is open, the save must **fail** — the alert *"This work order can no longer be edited.
Refresh to see the latest."* is shown and **the entered data remains** in the row.

**What the build does — the save SUCCEEDS.** Measured on work order **S9315-15899**, build
`v26.36.0-f43b2fd`, Full View, administrator:

1. The inline add row was opened and filled with valid values (description, quantity 2, cost 10,
   sell price 20).
2. With that row still open, the work order was moved to **Declined** from a separate session. The
   change is confirmed, not assumed — the work-orders list read back `status: "declined"`.
3. **Save** was then pressed on the still-open row.

**Result:** `POST /api/work-orders/part/make-request` returned **201 Created**, the on-screen toast
read **"Part added"**, and the row cleared to a fresh empty row. There was **no** *"This work order
can no longer be edited"* alert anywhere on the page — the whole page text was searched for both
*"no longer be edited"* and *"refresh to see the latest"* and neither appears. The entered data was
not preserved because there was nothing to preserve: the part went in.

So the case fails on **both** halves of its expectation — the save did not fail, and no alert was
shown. A part was added to a **Declined** work order.

**Why this is the build and not the test:** the status flip is proved by a read-back, and the save
is proved by the API's own 201 plus the app's own success toast. The probe refuses to report an
observation unless the setup call actually succeeded.

**Relationship to candidate 1:** almost certainly the same root cause — this build does not treat
**Declined** as a non-editable status. Candidate 1 is that the controls are still *shown* on a
Declined work order; this is that a save through them is still *accepted*. They may be one ticket or
two; that is the QA lead's call. Worth noting that candidate 1's controls are on the same list of
statuses (Complete, Invoiced, Paid, Declined, Imported) and only Declined misbehaves.

**Verdict: C45061 FAILED.** The work order was returned to **approved** afterwards and the
restore was confirmed by read-back.

Evidence: `evidence/105-noneditable.json` (`C45061`), screenshots
`evidence/105-c45061-1-row-ready.png` and `evidence/105-c45061-2-after-save.png`.
**Annotated shot: not yet made.**

---

## Candidate 7 — CONFIRMED 2026-09-10 · story SV-9318 (Story 3, Inline Edit Part - Tech View)

**Case:** [C45035](https://shopview.testrail.io/index.php?/cases/view/45035) — *Work order becoming
non-editable during edit fails the save*

**The rule (S3-E2, which points at S2-E3):** if the work order moves to a status that does not
permit editing while an inline **edit** row is open, the save must **fail** — the alert *"This work
order can no longer be edited. Refresh to see the latest."* is shown and **the entered data
remains**.

**What the build does — the edit is ACCEPTED.** Measured on work order **S9315-15899**, build
`v26.36.0-f43b2fd`, **Tech view**, technician user (6 permissions, `view_mode: tech`):

1. The Edit control was opened on an existing part row and the quantity changed to **7**.
2. With that row still open, the work order was moved to **Declined** from a separate session,
   confirmed by read-back (`status: "declined"`).
3. **Save** was pressed on the still-open edit row.

**Result:** `POST /api/work-orders/part/change-request` returned **200 OK**, the row **closed**, and
no *"This work order can no longer be edited"* alert appeared — the page text was searched for both
*"no longer be edited"* and *"refresh to see the latest"* and neither is present.

The case fails on both halves: the save did not fail, and the row did not keep the data — it closed
as though the edit had gone through normally, which it had.

**This is the third face of the same root cause** (candidate 1: the controls are shown on a Declined
work order; candidate 6: an *add* saves on one; this: an *edit* saves on one). It is the QA lead's
call whether these are one ticket or three. What is now established across all three is that
**Declined is not being treated as a non-editable status anywhere in this feature** — the guard
works for Complete, Invoiced and Paid, and only Declined is missed.

**Verdict: C45035 FAILED.** The work order was returned to **approved** afterwards.

Evidence: `evidence/105-noneditable.json` (`C45035`), screenshots
`evidence/105-c45035-1-row-ready.png` and `evidence/105-c45035-2-after-save.png`.
**Annotated shot: not yet made.**

---

## Candidate 8 — CONFIRMED 2026-09-10 · OUTSIDE THIS SUITE, but serious · no story assigned

**Not an Inline Add and Edit Parts defect.** It surfaced while trying to satisfy
[C45251](https://shopview.testrail.io/index.php?/cases/view/45251) clause 2 and it blocks that
clause, but it belongs to the Ordering / Receiving feature. Raised here so it is not lost.

**In plain words: on this build a shop cannot receive an ordered part at all.**

**What happens.** On a work order line, a special-order part is created and **ordered**
successfully — it moves to *"Awaiting Receive"* (`authorized_to_order` → `waiting_to_receive`).
Clicking **Receive** on it then does **nothing visible**: no window, no panel, no drop-down, no
message. The part stays at *Awaiting Receive* forever, and because the line refuses to complete
while any request is unfulfilled, the line can never be completed either.

**Why this is the front end, not the data.** The click does fire its request, and the request
succeeds:

* the control is `data-test-id=button_part_request_action`
* it calls **`POST /api/inventory/orders/receive-view`** → **200**, returning entirely valid data:
  vendor *Aabridge Beverages*, purchase order **S-15899**, and the line items with
  `orderItemId`, `quantityOrdered`, `quantityRemaining`, `cost`, `sellPrice`, `coreCharge`
* at the same moment the page posts **two Sentry error envelopes** — the app is reporting its own
  JavaScript errors
* a DOM scan immediately after the click finds **zero** dialogs, drawers or menus on the page

So the back end hands the front end everything it needs and the receiving panel fails to render.

**Not a way round it.** Ten write routes were tried directly with the real `orderId` and
`orderItemId` read out of `receive-view`: `/api/inventory/orders/{orderId}/receive` (404),
`/api/inventory/orders/receive` · `/receive-items` · `/receive-parts` (all **405, "Allow: GET"**,
POST and PUT alike), `/api/inventory/order-items/receive` (404),
`/api/inventory/orders/receive-view/confirm` (404), `/api/work-orders/part/receive` (404).
There is no API path around the broken panel.

**What it blocks:** C45251 clause 2 — and, in the product, the whole receiving workflow.
**What it does NOT block (Rule 68):** everything else in suite 6597. Inventory parts are unaffected
— they go `in_stock` → `pick` → on the line, and C45250 and C45251's other two clauses were all
observed normally through that path.

Evidence: `evidence/117-spo.json` (order succeeds, receive does not),
`evidence/118-receive.json` (the click, the 200, the Sentry posts, zero panels),
`evidence/119-receive-api.json` and `evidence/120-receive-final.json` (the ten refused routes).
**Annotated shot: not yet made.**
