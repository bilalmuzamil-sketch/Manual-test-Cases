# D1 — HELD, ready to file on his word

| Field | Value |
|---|---|
| `issuetype` | `Story Defect` |
| `parent` | **SV-9316** (Story 1, Add Part Button on Work Order Lines) — an Epic parent is rejected |
| `priority` | `Medium` |
| link | `relates to` SV-9316 |
| Product Area | none (absent on this type) |
| Cases | C45061 · C44993 · C44994 · C45035 |

**Summary:** A Declined work order is still fully editable — parts can be added and changed on it

**Description**

*What happens*

On a work order whose status is **Declined**, the Add Part button and the part Edit control are both
still shown on every work order line, and both still work. A part added on a Declined work order is
accepted and saved, and the page shows "Part added". If the work order is moved to Declined while
somebody has a part row open, pressing Save does not fail: no alert is shown and the change goes
through.

The same checks on **Paid** and on **Complete** behave correctly — neither control is present.

*What should happen — from the specification, read live on 2026-09-10 (Confluence page 782761986,
"Inline Add and Edit Parts on Work Order Lines")*

- **S1-N1:** "If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the "Add Part" button is not displayed on any work order line."
- **S1-N2:** "If the work order status is Complete, Invoiced, Paid, Declined, or Imported, the Edit control is not displayed on part lines."
- **S2-E3:** "If the work order moves to a status that does not permit editing while the inline row is open (for example, another user invoices it), the save fails and the user sees an alert: "This work order can no longer be edited. Refresh to see the latest." The entered data remains in the row so the user can copy it before refreshing."
- **S3-E2 / S4-E3:** both point at S2-E3.
- Story 1 Prerequisites: "The work order status is one of: Estimate, Approved, In Progress, Review."

*Steps to reproduce*

1. Open a work order that has at least one line with a part on it.
2. Set its status to Declined.
3. Open the Lines tab and expand a line's Parts section.
4. Add Part is shown. Press it, enter a description, a quantity, a cost and a sell price, and Save.

*Result:* "Part added" — the part is on a declined work order.
*Expected:* no Add Part button and no Edit control; a save attempted from a row left open fails with
"This work order can no longer be edited. Refresh to see the latest."

*Environment:* Staging, build v26.36.2-617d8d1, 2026-09-10.

*Why one ticket:* four test cases fail on this single behaviour — Declined is not being treated as a
non-editable status anywhere in the feature. One fix settles all four.
