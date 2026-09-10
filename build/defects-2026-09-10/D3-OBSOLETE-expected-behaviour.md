# D3 / SV-9918 — ⛔ CLOSED AS OBSOLETE 2026-09-10. EXPECTED BEHAVIOUR.

**The QA lead's ruling, on the ticket:** for a **catalogue** part — the picker shows the word
**"Catalog"** beside it — the Cost and Sell price may be left at **0.00** on the job. The cost is
captured later: pressing **Order** and then **Receive** takes you to the receiving screen, where the
cost is entered before the part is received. The sell price may still be left at 0.00.

**Verified on the build afterwards (2026-09-10):** the picker does label such a part "Catalog"
(`evidence/BIG31-1-picker.png`), and the receiving screen does carry a per-part **Cost** box with the
**Receive** button greyed out (`evidence/BIG31-2-receive.png`).

**NOT verified, and left as an open question:** exactly which box turns the Receive button on. Filling
the invoice number and a cost on every line did not enable it, and adding a sell price as well did not
either (`evidence/BIG32.json`) — so something further on that screen is also required. ⚠️ Note that
`build/APP-ACTIONS-PLAYBOOK.md` §X carries an earlier session's note saying `input_sell_{itemId}`
"must be > 0 to enable Receive". **That note is unconfirmed and now doubtful** — do not rely on it
without re-observing.

**What was wrong with the finding.** The specification (S4-E1) does say the boxes open empty and must
be filled before saving. It does not carve out catalogue parts, which are not priced until they are
received. I read the requirement literally against a part type it was not written for, and did not ask
what a part with no price *means in a repair shop* — which is exactly the check skill 06 §A5-b exists
to force, added after two tickets were obsoleted the same way on 2026-09-08.

**Consequence still open:** the specification now disagrees with the ruled behaviour. Unless S4-E1 is
amended, the next source-verification pass will re-derive this same expectation and the finding will
come back. Raised with the QA lead.

**Test case handled:** C45060 reworded and now Passed — https://shopview.testrail.io/index.php?/cases/view/45060 · run 418 https://shopview.testrail.io/index.php?/runs/view/418

**Kept, not deleted** (Rule 94: a failed candidate is a record).

---

*The original draft follows, unchanged, for the record only. Do not re-file it.*

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
