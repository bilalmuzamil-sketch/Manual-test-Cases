# D2 — HELD, ready to file on his word

| Field | Value |
|---|---|
| `issuetype` | `Story Defect` |
| `parent` | **SV-9319** (Story 4, Inline Add Part — Full View) |
| `priority` | `Medium` |
| link | `relates to` SV-9319 |
| Cases | C45058 |

**Summary:** Letters typed into Cost or Sell price give the empty-field message instead of "must be a number"

**Description**

*What happens*

Typing letters into the Cost box and the Sell price box on the inline part row and pressing Save
answers **"Enter a cost and sell price to save this part."** — the message used when the boxes have
been left empty. The boxes are not empty; they contain something that is not a number, and the user is
not told that. The row correctly does not save.

Typing a **negative** number is handled correctly: "Cost cannot be negative."

*What should happen — from the specification, read live on 2026-09-10 (Confluence page 782761986)*

- **S4-N5:** "If a cost or sell price is not a number, or is negative, the row does not save and the message names the field: "Cost must be a number.", "Cost cannot be negative.", "Sell price must be a number.", "Sell price cannot be negative.""
- §8 User Feedback Summary: same four strings, "Inline validation, field highlighted, persists until corrected".

*Steps to reproduce*

1. Open a work order in Estimate or Approved, open the Lines tab, expand a line's Parts section.
2. Press Add Part.
3. Type a description and a quantity; type `abc` into Cost and `xyz` into Sell price.
4. Press Save.

*Result:* "Enter a cost and sell price to save this part."
*Expected:* "Cost must be a number." and "Sell price must be a number."

*Environment:* Staging, build v26.36.2-617d8d1, 2026-09-10.
