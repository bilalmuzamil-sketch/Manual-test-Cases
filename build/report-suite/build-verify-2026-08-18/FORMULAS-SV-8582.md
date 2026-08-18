# CALC FORMULAS — epic SV-8582 comments (read live 2026-08-18)

**Source:** `GET /rest/api/3/issue/SV-8582/comment` on `shopview.atlassian.net`, read via the
Atlassian session cookies at 2026-08-18 (Jira access independent of staging). Epic has **3 comments**.
These are the **authoritative expected-calculation source** for verifying report numbers (Rule 57 —
expected behaviour comes from the documents; a PO/stakeholder answer in the epic is such a source).

Build under test: **v3.8-2bf8d14** (app.staging.shopview.com), last-modified 2026-08-18 17:45:12 GMT.

---

## Comment 74819 — "Sales By Customer — QA Equation Sheet" (parth fadadu, 2026-08-07 10:35 -0500)

**This is the authoritative Sales By Customer calculation contract.** Quoted verbatim.

### Terms (verbatim)

| Term | Meaning |
|---|---|
| Labor charge | The labor rate on a work-order labor line |
| Estimated hrs | The line's time estimate — what the customer is billed for |
| Clocked hrs | Technician time actually recorded against the work order |
| Staff actual hrs rate | The hourly rate stored on the technician's clock record |
| Part sell price | Price on a work-order part line |
| Part cost | Cost recorded on the work-order part line |
| Qty | Quantity on the part line |
| Labor fee / Labor discount | Adjustment applied to labor |
| Part fee / Part discount | Adjustment applied to parts |
| Work order fee / Work order discount | Adjustment applied to the whole work order |
| Shop supply | The invoice's shop-supplies charge |
| Subtotal | The work order invoice subtotal |

### Equations (verbatim)

**Labor Invoiced** — Labor charge total mentioned in the invoice.
```
Labor Invoiced = Labor charge × Estimated hrs
```

**Labor Margin**
```
Labor Margin = (Labor clocked hrs × Staff actual hrs rate) + Labor fee − Labor discount
```

**Part Invoiced** — Part charge total mentioned in the invoice.
```
Part Invoiced = Part sell price × Qty
```

**Part Margin**
```
Part Margin = (Part cost × Qty) + Part fee − Part discount
```
**⚠️ SUPERSEDED — see comment 74830 below (Nebojsa Glavinic, later, 2026-08-09). Latest-wins
(Rule 32): the corrected Part Margin formula is the authoritative one.**

**Margin**
```
Margin = Part Margin + Labor Margin + Work order fee − Work order discount
```

**Margin (%)**
```
Margin % = Margin ÷ (Subtotal − Shop supply) × 100
```
Where Subtotal = the work order invoice subtotal.

---

## Comment 74830 — Part Margin CORRECTION (Nebojsa Glavinic, 2026-08-09 23:12 -0500)

Verbatim:

> Part Margin
> Part Margin = (Part cost × Qty) + Part fee − Part discount
> **This should be the correct formula for Part Margin**
> **Part Margin = ((Part Sell Price - Part Cost) × Qty) + Part fee − Part discount**

**⇒ AUTHORITATIVE Part Margin (latest-wins, Rule 32):**
```
Part Margin = ((Part Sell Price − Part Cost) × Qty) + Part fee − Part discount
```
This is a margin (profit) formula — sell minus cost — which is the sensible reading; the 74819 version
(cost × qty only) omitted the sell price and was corrected two days later by Nebojsa Glavinic (run
owner). No later comment supersedes this.

---

## Comment 74800 — "Formulas for Inventory Velocity report:" (Dipesh Changawala, 2026-08-07 09:32 -0500)

Body is a heading only ("Formulas for Inventory Velocity report:") with no inline equation text — the
detail was evidently in an attachment. **Not relevant to Sales By Customer** (that report is not in the
6-report Report Suite scope; "Inventory Velocity" ≠ "Inventory Value"). Flagged for the IV/other-report
passes only.

---

## AUTHORITATIVE SBC FORMULA SET (consolidated, latest-wins applied)

```
Labor Invoiced = Labor charge × Estimated hrs
Labor Margin   = (Labor clocked hrs × Staff actual hrs rate) + Labor fee − Labor discount
Part Invoiced  = Part sell price × Qty
Part Margin    = ((Part Sell Price − Part Cost) × Qty) + Part fee − Part discount   [corrected, 74830]
Margin         = Part Margin + Labor Margin + Work order fee − Work order discount
Margin %       = Margin ÷ (Subtotal − Shop supply) × 100
```
