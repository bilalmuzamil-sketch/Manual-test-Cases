# Rule 106 reconciliation — every held defect, three ways

Read live on **2026-09-10** from Confluence. Nothing below is quoted from our own case text,
from `requirements.md`, or from memory.

| Source | Page id | Title | Last modified (as shown) | Read |
|---|---|---|---|---|
| Inline Add and Edit Parts on Work Order Lines | `782761986` | as titled | Sep 07, 2026 | 2026-09-10 |
| Printer Friendly Work Orders | `519176194` | as titled | Sep 07, 2026 | 2026-09-10 |

> The page body carries no version integer through the MCP read (`BLOCKED-confluence-version-integers.md`),
> so the modification date shown by the API is given instead of a version number, rather than repeating a
> version remembered from our own text (Rule 100).

Build observed: **staging `v26.36.2-617d8d1`**, 2026-09-10.

---

## D1 · A Declined work order is still fully editable
**Cases:** C45061 · C44993 · C44994 · C45035  · **Owning story:** SV-9316 (display) with SV-9317 / SV-9318 / SV-9319 (save)

**THE CASE'S EXPECTED** (read live from TestRail): the Add Part button and the Edit control are not
displayed on Complete / Invoiced / Paid / Declined / Imported; and if the work order moves to a
non-editable status while a row is open, the save fails with *"This work order can no longer be
edited. Refresh to see the latest."*

**THE SOURCE AS IT READS TODAY** — page `782761986`, read 2026-09-10, verbatim:

- Story 1 Prerequisites: *"The work order status is one of: Estimate, Approved, In Progress, Review."*
- **S1-N1:** *"If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the \"Add Part\" button is not displayed on any work order line."*
- **S1-N2:** *"If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the Edit control is not displayed on part lines."*
- **S2-E3:** *"If the work order moves to a status that does not permit editing while the inline row is open (for example, another user invoices it), the save fails and the user sees an alert: \"This work order can no longer be edited. Refresh to see the latest.\" The entered data remains in the row so the user can copy it before refreshing."*
- **S3-E2:** *"If the work order moves to a status that does not permit editing while the row is open, S2-E3 applies."*
- **S4-E3:** *"If the work order moves to a status that does not permit editing while the row is open, S2-E3 applies."*

**THE BUILD OBSERVED** (staging `v26.36.2-617d8d1`, 2026-09-10): on a **Declined** work order all four
Add Part buttons and all eight Edit controls are present and usable; adding a part answers *"Part
added"* and it persists; saving an inline edit while the job is moved to Declined shows no alert and
the row closes. On **Paid** and on **Complete** both controls are correctly absent (0 and 0).

**VERDICT: the case agrees with the source and the build differs ⇒ a real defect.** Ask to file.

**Answering the nearest apparently contradicting rule.** *Rule 24 — "Front-end blocks + backend/API
allows = a PASSED test case"* — does not apply: here the front end does not block. The controls are
rendered, the user can drive them, and the write lands. That is Rule 24's stated inverse, an
FE-exposure defect.

---

## D2 · Letters in Cost or Sell price give the wrong message
**Case:** C45058 · **Owning story:** SV-9319 (Story 4, Inline Add Part — Full View)

**THE CASE'S EXPECTED:** *"The row does not save and the message names the field: \"Cost must be a
number.\", \"Cost cannot be negative.\", \"Sell price must be a number.\", \"Sell price cannot be
negative.\" as applicable."*

**THE SOURCE AS IT READS TODAY** — page `782761986`, read 2026-09-10, verbatim:

- **S4-N5:** *"If a cost or sell price is not a number, or is negative, the row does not save and the message names the field: \"Cost must be a number.\", \"Cost cannot be negative.\", \"Sell price must be a number.\", \"Sell price cannot be negative.\" (Added 2026-08-24 to match the design.)"*
- §8 User Feedback Summary row: *"Cost or sell price not a number, or negative (Full View) | \"Cost must be a number.\" · \"Cost cannot be negative.\" · \"Sell price must be a number.\" · \"Sell price cannot be negative.\" | Inline validation, field highlighted, persists until corrected"*

**THE BUILD OBSERVED:** letters in both boxes → *"Enter a cost and sell price to save this part."*
(that is the S2-N1 **empty-field** message, not the numeric one). A negative value gives the correct
*"Cost cannot be negative."* The row correctly does not save in either case.

**VERDICT: case agrees with source, build differs ⇒ a real defect.** Ask to file. Half the requirement
(negative) is already right; only the not-a-number half is wrong.

---

## D3 · A part with no price opens at 0.00 and saves at 0.00
**Case:** C45060 · **Owning story:** SV-9319 (Story 4, Inline Add Part — Full View)

**THE CASE'S EXPECTED:** *"Those fields open empty and the user must enter them before saving inline.
The user may instead select \"More options\" to complete the part in the modal."*

**THE SOURCE AS IT READS TODAY** — page `782761986`, read 2026-09-10, verbatim:

- **S4-E1:** *"If the selected part has no cost or sell price on record, those fields open empty and the user must enter them before saving inline. The user may instead select \"More Options\" to complete the part in the modal."*
- **S4-R7:** *"To save, the user must have entered a description, a quantity, a cost, and a sell price. Part number and category are optional."*

**THE BUILD OBSERVED:** the Catalog screen's *New Catalog Part* window carries no price fields at all
(Description, Part Number, Size, Category, Manufacturer, Tags), so a catalogue entry created there has
no cost and no sell price. Picking it on the inline row fills Cost with **0.00** and Sell price with
**0.00**, and Save answers *"Part added"* with nothing typed into either.

**VERDICT: case agrees with source, build differs ⇒ a real defect.** Ask to file. It is also a data
risk, not only a wording one: parts go onto jobs at zero.

---

## D4 · No rule is drawn between one job line's block and the next on the printed page
**Case:** C45105 · **Owning story:** SV-9386 (Story 3, Print Layout — Line Items)

**THE CASE'S EXPECTED:** *"Each work order line group (main line plus its sub-rows for tech story,
labor, parts, inspections) is visually separated from the next by a thick border and blank space below,
giving room to write notes per line."*

**THE SOURCE AS IT READS TODAY** — page `519176194`, read 2026-09-10, verbatim:

- **S3-R7:** *"Each work order line group (main line + its sub-rows for tech story, labor, parts, inspections) will be visually separated from the next line by a thick border and blank space below, giving technicians room to write notes per line"*
- Change Log 2026-04-19: *"Visual separation between WO lines | Thick border + blank note space between line groups; lighter borders on sub-rows"*

**THE BUILD OBSERVED:** the blank writing band is present (a spacer row ~80px tall between every pair of
blocks) and the lighter sub-row rules are present (1px on the rows inside a block, which is the second
half of the change-log entry). **No rule at all is drawn at the boundary between blocks** — measured on
the printed page over all 24 rows, cells as well as rows, top edge as well as bottom. Positive control:
the same reader found the 2px rule under the column headings and 83 other ruled elements on the page.

**VERDICT: case agrees with source, build differs ⇒ a real defect.** Ask to file. Exactly half of S3-R7
shipped: the note space, not the thick border.

---

## Q1 · NOT a defect — the printing spec contradicts itself about a job with no lines
**Case:** C45091 · currently marked Passed on half its expectation

**THE CASE'S EXPECTED:** *"The Print option is disabled (grayed out and non-clickable) until line item
data has finished loading, **and while no line items exist**. It does not enable when only the UI
skeleton appears."* Provenance cites **S1-E1**.

**THE SOURCE AS IT READS TODAY** — page `519176194`, read 2026-09-10, verbatim:

- **S1-E1** (the requirement the case cites), in full: *"The option does not enable when the UI skeleton appears — it waits for the actual data to arrive."* — **it says nothing about a job with no lines.**
- §4 Key Decisions: *"**Print disabled until lines data loads.** The menu item is disabled (grayed out) while line item data is being fetched from the server or when no line items exist. The button does not enable when the UI skeleton appears — it waits for the actual data to arrive. This prevents printing a blank or incomplete page."*
- Change Log 2026-04-19: *"Clarified print-disabled behavior | Menu item disabled while loading AND when no lines exist, not just missing data"*
- **S3-N1:** *"If the work order has no line items, the line items section will display \"No lines on this work order\""*
- **S4-N1:** *"If there are no line items, the summary will show zero totals rather than being hidden, and the line items area shows a single placeholder row reading \"No lines on this work order\"."*

**THE BUILD OBSERVED:** on job S2-32270, which has no lines, Print is offered and **not** greyed out, and
it prints — header, the single row *"No lines on this work order"*, and `Total Actual Time: 0.00` /
`Total Estimated Time: 0.00`. So the build satisfies S3-N1 and S4-N1 and not the Key Decision.

**VERDICT: the source contradicts itself, so this is held and asked (Rules 58 and 106), NOT filed.**
Two numbered negative cases describe a printout that the Key Decision says can never be reached. The
numbered requirement the case actually cites (S1-E1) is met by the build.

**What we would do on each answer:**
- *"Print should be greyed out when there are no lines"* → S3-N1 and S4-N1 are dead text: C45091 becomes a defect to file, and C45107 and C45116 are retired.
- *"Printing a job with no lines is correct"* → the Key Decision and its change-log line are dead text: C45091's Expected is corrected to drop the no-lines clause, and it passes as it stands.

Until then C45091 is reported as **Blocked with the reason**, because it was marked Passed on only the
first half of its expectation.
