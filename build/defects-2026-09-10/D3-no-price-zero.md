# D3 — HELD, ready to file on his word

| Field | Value |
|---|---|
| `issuetype` | `Story Defect` |
| `parent` | **SV-9319** (Story 4, Inline Add Part — Full View) |
| `priority` | `Medium` |
| link | `relates to` SV-9319 |
| Cases | C45060 |

**Summary:** A part with no price on record opens the Cost and Sell price boxes at 0.00 and saves at 0.00

**Description**

*What happens*

The Catalog screen's **New Catalog Part** window has no price fields at all — Description, Part Number,
Size, Category, Manufacturer, Tags — so a catalogue entry created there genuinely has no cost and no
sell price. Selecting such a part on the inline part row fills **Cost with 0.00** and **Sell price with
0.00** instead of leaving them empty, and pressing Save with nothing typed into either answers "Part
added". The part goes onto the work order priced at nothing.

*What should happen — from the specification, read live on 2026-09-10 (Confluence page 782761986)*

- **S4-E1:** "If the selected part has no cost or sell price on record, those fields open empty and the user must enter them before saving inline. The user may instead select "More Options" to complete the part in the modal."
- **S4-R7:** "To save, the user must have entered a description, a quantity, a cost, and a sell price."

*Steps to reproduce*

1. Parts → Catalog → New Catalog Part. Give it a description, a part number and a category. Save.
2. Open a work order in Estimate or Approved, open the Lines tab, expand a line's Parts section.
3. Press Add Part and pick the catalogue part you just made from the part-number box.
4. Enter a quantity. Do not touch Cost or Sell price. Press Save.

*Result:* Cost and Sell price show 0.00; Save answers "Part added".
*Expected:* both boxes open empty and Save is refused until a value is entered in each.

*Environment:* Staging, build v26.36.2-617d8d1, 2026-09-10.

*Why it matters beyond the wording:* parts reach a work order at zero cost and zero sell price without
anyone being asked, which feeds straight into what the customer is charged.
