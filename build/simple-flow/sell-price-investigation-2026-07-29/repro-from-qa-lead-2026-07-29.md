# QA Lead's Exact Repro — Sell-Price Auto-Calc (Simple Flow) — received 2026-07-29

**AUTHORITATIVE source for the corrective case drafts** (`corrective-cases-draft.json`).
Received from the QA lead 2026-07-29; supersedes the earlier draft flow that was
reconstructed from the founder's screenshot alone. Verbatim below.

---

## Steps (verbatim)

1. Create a new WO
2. Create a new line
3. Request a special order part but do NOT add anything in the new part request modal but description and quantity, and click save and close
4. Click Order
5. Click Receive
6. Select Vendor from the top left side
7. Add the Invoice number
8. Add the missing Part number
9. Add Cost
10. Click outside the cost field to see if the sell price auto calculated

## Expected behavior (verbatim)

- Sell price should auto calculate based on the UNCATEGORIZED category matrix (the part has no category, so the pricing matrix's Uncategorized category rules apply)
- After the sell price is auto generated, the Receive button should get auto activated

---

*Refs anchor: "QA lead repro 2026-07-29" (this file) + placeholder "Fabian 2026-07-29
sell-price concern (ticket TBD)" — re-point at the real Jira key when the bug is filed
(Rule 20). No TestRail writes made.*
