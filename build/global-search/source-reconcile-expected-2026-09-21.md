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

## RECONCILED 2026-09-21 (QA lead go-ahead given)
- **C44882** — point 3 corrected: the masked money fields are now quoted from §4 as the part-sale total, the purchase-order total and the vendor-invoice total; part price and work-order total removed (§4 displays neither). Source block now quotes §4 displayed fields, §9, and the 2026-08-12 engineering resolution verbatim. fr-view confirmed.
- **C55706** — corrected the same way (prices-shown positive): the priced rows are part sales, purchase orders and vendor invoices only. fr-view confirmed.

## Standing rule now in force (Rule 57 amendment 2026-09-21)
Expected = the source's VERBATIM QUOTE with complete references, never reworded/changed. Any case whose
Expected is not an exact quote with complete references is to be corrected to the source (this pass began
that; a full sweep over the remaining GS cases follows).
