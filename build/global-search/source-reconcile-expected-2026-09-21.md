# Global Search — expected-behaviour reconciled to source (2026-09-21)

Principle (Rule 57): a case's Expected states what the DOCUMENTS say, never the build. This pass rewrote
the Expected of two cases so it is traceable straight to the source, and strips build-flavoured reasoning
that a prior edit had left in.

## Sources used (live, PRD 576978945 v1.5, read 2026-09-21)
- §4 Vendor Invoices displayed: "invoice number + vendor (primary), status badge (Paid / Unpaid), total + invoice date."
- §4 Parts displayed: "description (primary), part number (secondary), total quantity with a stock-status badge." (no price field.)
- §4 Part Sales displayed: "P-number + customer (primary), status badge, total price + created date." (total price.)
- §4 Purchase Orders displayed: "PO number + vendor (primary), status badge (Ordered / Received), total + created date." (total.)
- §4 Work Orders displayed: "WO number + customer name (primary), status badge, unit number + year/make/model." (NO total shown.)
- §9: "All result fields must respect existing tenant-isolation and role-based-access checks."
- §5.2: "No count in the modal reads higher than 20."
- Engineering resolution recorded on the PRD (2026-08-12): "'See Financial Data' gates prices inside result rows"; "results, group counts and scope tabs are all filtered by the user's permissions."

## Corrected this pass
- **C55736** — See Financial Data masking. Expected now states: the vendor-invoice row shows number/vendor/status/total; without See Financial Data the total is hidden and the row remains. Sourced to §4 (VI displayed fields) + §9 + the 2026-08-12 engineering resolution. Removed the build-flavoured note ("a part row does not print a price for anyone"); replaced with the §4 basis for choosing a vendor-invoice row.
- **C55737** — counts filtered by permission. Expected now states: a permitted kind shows its group/count/tab and is in the All count; a non-permitted kind shows no group/count/tab and is not counted; counts are capped at twenty. Sourced to §9 + the 2026-08-12 resolution + §5.2. Removed "the All count drops by exactly that kind's contribution" (not in source and defeated by the §5.2 cap).

## STILL TO RECONCILE (same source issue) — needs the QA lead's nod on the exact edit
Two cases still name money fields that §4 does NOT list among a result row's displayed fields:
- **C44882** — masks list reads "part purchase/sell price, part-sale total, work-order total, PO total, vendor-invoice total". Per §4 the displayed money fields are ONLY: **part-sale total, purchase-order total, vendor-invoice total**. A Part row shows no price; a Work Order row shows no total. → correct the list to those three.
- **C55706** — prices-shown positive case lists the same over-broad set; correct to the same three §4 money fields.
These are the Rule 106 pattern (case disagrees with source ⇒ correct the case). Proposed correction above; awaiting go-ahead to apply.
