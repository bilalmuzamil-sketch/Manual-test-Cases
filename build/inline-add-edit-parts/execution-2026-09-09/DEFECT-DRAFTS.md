# Story Defect drafts — Inline Add and Edit Parts (epic SV-9315)

**HELD.** Nothing is filed. Each ticket goes to Jira only on the QA lead's explicit go-ahead, **one
at a time**, and the next one waits until he has verified the previous (his standing instruction,
2026-09-09; Rule 62).

**Shape every ticket uses** (CLAUDE.md §5 · Rules 52/53/62):

| Field | Value |
|---|---|
| `issuetype` | **Story Defect** |
| `parent` | **the owning STORY**, never the epic — an Epic parent is rejected HTTP 400 |
| `priority` | **Medium** |
| link | **`relates to` the owning story** as well as the parent |
| Product Area | **not set** — the field does not exist on this issue type |

Story keys: **SV-9316** Story 1 (Add Part button and Edit control) · **SV-9317** Story 2 (Tech View
inline add) · **SV-9318** Story 3 (Tech View inline edit) · **SV-9319** Story 4 (Full View inline
add) · **SV-9320** Story 5 (Full View edit) · **SV-9321** Story 6 (Unsaved data protection).

---

## Draft 1 — parent **SV-9316**

**Summary:** Add Part and the Edit control are still shown on a Declined work order

**Description:**

On the sv9315 QA branch, build **v26.36.0-f43b2fd**, a work order whose status is **Declined** still
offers the "+ Add Part" button and the per-part Edit control, and both of them work.

**Steps to reproduce**
1. Open **Work Orders** and open a work order whose status is **Declined** (used: **S9315-15897**).
2. Open its **Lines** tab and look at a line's Parts section.
3. Click **+ Add Part**.
4. Move the mouse over any existing part row.

**What happens:** the "+ Add Part" button is displayed and clicking it opens a working inline add
row; the Edit control is present on the part rows and comes to full opacity on hover.

**What should happen:** per the specification (Inline Add and Edit Parts on Work Order Lines, v16,
S1-N1 and S1-N2), neither control is displayed when the work order status is Complete, Invoiced,
Paid, **Declined** or Imported.

**Why this is the build and not the test:** the same check on the other guarded statuses is correct
on this build — Complete (S9315-15856), Invoiced (S2-15828) and Paid (S9315-15894) each show **zero**
Add Part buttons and **zero** Edit controls with their Parts sections rendered on screen, and
Approved correctly shows 3 and 5. Only Declined is wrong.

**Test cases:** [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) and
[C44994](https://shopview.testrail.io/index.php?/cases/view/44994), run
[R418](https://shopview.testrail.io/index.php?/runs/view/418).

**Attachment:** `defect-shots/candidate1-declined-add-part.png`

---

## Draft 2 — parent **SV-9319**

**Summary:** Letters typed into Cost or Sell price give the empty-field message, not "must be a number"

**Description:**

On the sv9315 QA branch, build **v26.36.0-f43b2fd**, typing letters into the inline row's Cost or
Sell price box is not rejected at the box, and the message that appears on Save is the one meant for
an **empty** field.

**Steps to reproduce**
1. Open **Work Orders**, open an editable work order, open its **Lines** tab and click **+ Add Part**
   on a line (Full View, with See Financial Data).
2. Enter a description and a quantity, and a valid Sell price of 9.00.
3. Type `abc` into **Cost** and click **Save**.
4. Repeat the other way round: a valid Cost, and `xyz` in **Sell price**.

**What happens**

| Input | Message required (S4-N5) | Message shown |
|---|---|---|
| Cost `-5` | "Cost cannot be negative." | **"Cost cannot be negative."** — correct |
| Sell price `-4` | "Sell price cannot be negative." | **"Sell price cannot be negative."** — correct |
| Cost `abc` | "Cost must be a number." | **"Enter a cost to save this part."** |
| Sell price `xyz` | "Sell price must be a number." | **"Enter a sell price to save this part."** |

The letters also stay in the box — they are not rejected as they are typed.

**Why it matters:** the message tells the user to enter a cost when they have entered one; it just
is not a number. Two of the four messages in this rule are already correct, so the wording exists.

**Test case:** [C45058](https://shopview.testrail.io/index.php?/cases/view/45058), run
[R418](https://shopview.testrail.io/index.php?/runs/view/418). Each input was run on its own with a
page reload first, so no leftover state is involved.

**Attachment:** `defect-shots/candidate2-cost-letters-message.png`

---

## Draft 3 — parent **SV-9321**

**Summary:** The edit row's discard dialog says "Discard Changes" where the spec says "Discard Part"

**Description:**

On the sv9315 QA branch, build **v26.36.0-f43b2fd**, the discard confirmation shown when a **changed
edit row** is closed carries a different second action from the one shown on the **add** row.

**Steps to reproduce**
1. Open **Work Orders**, open an editable work order and open its **Lines** tab.
2. Move the mouse over an existing part and click its **edit** control.
3. Change any field (used: the quantity), then press **Esc** or click the row's close control.

**What happens:** the dialog reads

- Title **"Discard these changes?"** — correct
- Body **"The changes you made will be lost."** — correct
- Actions **"Keep Editing"** (focused by default — correct) and **"Discard Changes"**

**What should happen:** per S6-R1 the edit dialog keeps the add dialog's actions unchanged — "Keep
Editing" and **"Discard Part"**. On this same build the **add** row's dialog does show "Discard
Part", so the two dialogs disagree with each other as well as with the spec.

**Severity note:** the behaviour behind the button is correct — choosing it closes the row and puts
the part back to its saved values. This is a wording defect.

**Test case:** [C45070](https://shopview.testrail.io/index.php?/cases/view/45070), run
[R418](https://shopview.testrail.io/index.php?/runs/view/418).

**Attachment:** `defect-shots/candidate5-edit-discard-label.png`

---

## Draft 4 — parent **SV-9317**, and a second ticket for **SV-9319**

**Summary:** A failed part save is not reported — on a dropped connection the row closes and the part is lost

**Description:**

On the sv9315 QA branch, build **v26.36.0-f43b2fd**, a save that fails is either reported with the
wrong message or not reported at all.

**Steps to reproduce**
1. Open **Work Orders**, open an editable work order, open its **Lines** tab and click **+ Add Part**
   on a line.
2. Enter a description and a quantity (and, in Full View, a cost and a sell price).
3. Make the save request fail. Two ways were tried, and they behave differently:
   - the request returns a server error, or
   - the request is cut off in flight, as it would be on a dropped connection.
4. Press **Save**.

**What happens**

| The failure | Toast required (S2-EH1) | Toast shown | The row | The typing |
|---|---|---|---|---|
| Server error | "Couldn't add the part. Please try again." | **"Ooooops! An error occurred"** | stays open | kept |
| Connection dropped | "Couldn't add the part. Please try again." | **nothing at all** | **closes** | **lost** |

The second row is the serious one: the row closes exactly as it does on a successful save, no message
appears, and the part is not on the work order. A technician working on a weak shop connection is told
nothing and loses the line they just typed.

**Why this is the build and not the test:** the same flow with nothing interfering saves normally —
the part count goes 22 → 23 and the part is still there after a full page reload. Both views behave
identically: Tech view and Full View were run separately and matched.

**Test cases:** [C45022](https://shopview.testrail.io/index.php?/cases/view/45022) (Tech view, story
SV-9317) and [C45062](https://shopview.testrail.io/index.php?/cases/view/45062) (Full View, story
SV-9319), run [R418](https://shopview.testrail.io/index.php?/runs/view/418). **Two tickets, one per
story, since the parents differ.**

**Attachments:** `evidence/62-c45022-abort.png`, `evidence/62-c45022-500.png`,
`evidence/76-c45062-abort.png`, `evidence/76-c45062-500.png`

---

## Draft 5 — parent **SV-9317**

**Summary:** A saved part request stays fully editable — description, cost, core charge and vendor do not lock

**Description:**

On the sv9315 QA branch, build **v26.36.0-f43b2fd**, none of the fields that should freeze once a part
request is saved actually do.

**Steps to reproduce**
1. Open **Work Orders**, open an editable work order, open its **Lines** tab and click **+ Add Part**.
2. In the part number box choose a catalogue part — its card in the list reads **"Catalog"** rather
   than showing a stock quantity (used: **F40010212**, "Slack Adjuster").
3. Overwrite the description, enter a quantity, a cost of 14.00 and a sell price of 28.00, and Save.
4. Move the mouse over the saved part and open it again.

**What happens**

| Field | Required after the save (S2-R5) | Observed |
|---|---|---|
| Description | read-only | **editable** |
| Cost | read-only | **editable** (14.00000) |
| Core charge | read-only | **editable** (0.00) |
| Vendor | empty **and** read-only | empty but **editable** |
| Source | *(not named by the rule)* | read-only |

The only field that locks is the one the rule does not mention.

**Note on the rule's age:** S2-R5's after-save half was added by the spec update of **2026-09-04**
(SV-9766), so this may simply not be built yet rather than having regressed.

**Test case:** [C45001](https://shopview.testrail.io/index.php?/cases/view/45001), run
[R418](https://shopview.testrail.io/index.php?/runs/view/418). Clauses 1 and 2 of that case pass and
were verified on nine parts between them; only the after-save clause fails.

**Attachment:** `evidence/76-a-aftersave.png`
