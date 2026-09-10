# Rule-65 notice — Automated case C26577 was corrected (2026-09-10)

**C26577** — https://shopview.testrail.io/index.php?/cases/view/26577
"See Financial Data OFF: no pricing shown on the work order's invoice document"
(epic SV-7388 · story SV-7523 · task SV-7484). `custom_atmstatus = 3` (Automated), `created_by = 3`.

**Authorised:** the QA lead gave explicit go-ahead on 2026-09-10 to correct this case (Rule 71).
Only the title, preconditions, steps and expected were changed; `custom_atmstatus` (3),
`custom_automation_type` (1 = E2E) and the section were left untouched. Fields written through the
Froala UI editor → all render `fr-view` (served-page scan clean); runnable-gate 1/1.

## Why it changed (build-verified live on staging app.staging.shopview.com, 2026-09-10)
The old case told the tester/automation to **download the Work Order's PDF** and **search the PDF
text** for money. On the live build that does not work:
1. The Work Order's own print action ("Print Work Order") is a **client-side browser print** of a
   time/labour-hours printer-friendly sheet that shows **no money for anyone** — it is not a server
   PDF and never carries pricing. Targeting it proves nothing.
2. The money-bearing document is the **Invoice / Estimate** document.
3. The generated **invoice PDF has no text layer** — a text search returns **0 hits even for a
   finance-ON admin**, so a PDF-text assertion would falsely pass.

## What the behaviour actually is (proof)
Same paid work order, invoice document:
- finance-ON (admin): 11 money figures, e.g. $464.86, $513.67, **$539.35**.
- See-Financial-Data-OFF user: **0 money — fully stripped.** ✅

## Automation guidance
- **Target the invoice/estimate document**, not the Work Order print sheet.
- **Assert on the rendered document content** (the on-screen invoice / its HTML render), **not** on a
  downloaded PDF's extracted text (no text layer → false green).
- **Setup guard:** fetch the same invoice as a finance-ON user first and assert money IS present, so
  the test can't pass against an empty/zero invoice.
- **Isolation:** provision the Fin-OFF test user as a **Full View** role with only "See Financial
  Data" off (staging already has a role "TEST" configured this way), so the result is attributable to
  this permission and not to Tech-view.

## Secondary finding (separate from this case)
The Work Order data feed zeroes the totals for a Fin-OFF user **but still exposes one tax dollar
amount** ($37.29). The invoice document itself is clean. Flagged to the QA lead as a possible separate
defect.

Before/after snapshots: `build/custom-roles/build-verify-C26577-2026-09-10/evidence/c26577_{before,after}.json`.
