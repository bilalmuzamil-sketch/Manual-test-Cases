# Coverage Matrix — Invoice UI Refresh (spec v45)

**Re-derived 2026-08-21 from spec v38 and the 87 authored cases, BOTH directions. No C-IDs yet (nothing pushed).**

Verdicts: **covered** (case IDs named) · **not independently testable** (rationale) · **deferred/out-of-scope**.

| Rule | Verbatim requirement (spec v38) | Verdict | Covered by (internal ID) |
|---|---|---|---|
| S1-R1 | The masthead shows the shop location's name, street address, city, state or province, postal code, and phone number. | covered | INV-MAST-01 |
| S1-R2 | The masthead shows the shop's logo when the shop has set one; when no logo is set, no logo and no placeholder are rendered. | covered | INV-MAST-02 |
| S1-R3 | The masthead shows the document label naming the type before the number: exactly "Estimate: {number}", "Invoice: {number}", or "Credit: {number}". The number always includes its type prefix — for example "Estimate: EST-4176", "Invoice: INV- | covered | INV-MAST-03 |
| S1-R4 | The document number uses the shop's existing document numbering; the Credit Invoice's number carries the "CM-" prefix (Story 11). | covered | INV-MAST-03 |
| S1-R5 | The masthead carries no status pill on any document. Status appears only with the content that proves it: the Paid banner's pill (Story 8) and the status column in the Credit Invoice's status table (Story 11). | covered | INV-MAST-04 |
| S1-R6 | The masthead shows no monetary figure on any document. The document's single headline figure appears once, as the boxed figure at the end of the totals block, with a label matching the document type: "Estimated Total" on an Estimate (its va | covered | INV-CRED-01, INV-MAST-05 |
| S1-R7 | The masthead date labels read exactly: "Invoice date: {date}" and "Due date: {date}" on an Invoice; on a fully paid Invoice, "Paid date: {date}" replaces "Due date: {date}" (S10-R4); "Issue date: {date}" on a Credit Invoice; "Estimate date: | covered | INV-MAST-06 |
| S1-N1 | Within the masthead, the street address, city, state or province, postal code, and phone number are each hidden when empty. | covered | INV-MAST-07 |
| S2-R1 | The document shows a block labeled exactly "Bill To" with the customer's name, street address, city, state or province, and postal code. The name is the customer's company name when present, otherwise the customer's personal name. On the Cr | covered | INV-ADDR-01, INV-CRED-02 |
| S2-R2 | On the Estimate and Invoice (not the Credit Invoice), the document shows a block labeled exactly "Remit Payment To" when a remit-to payee is present for the document. The payee resolves from either production mechanism: the shop's integrate | covered | INV-ADDR-02, INV-ADDR-04 |
| S2-R3 | When the Remit Payment To block is not shown, the Bill To block spans the full width of the addresses area (it does not stay at half width). This width rule is one of the spec's two deliberate binding layout rules, like the banner-order rul | covered | INV-ADDR-03, INV-CRED-02 |
| S2-N1 | Within the Bill To block, the street address, city, state or province, and postal code are each hidden when empty. The name line is always shown. | covered | INV-ADDR-05 |
| S2-N2 | When no remit-to payee is present, the Remit Payment To block is not shown. | covered | INV-ADDR-04 |
| S3-R1 | The order reference fields area can show five fields, in this order, labeled exactly "Work Order", "Customer PO", "Authorizer", "Approval Code", and "Terms". In this area, field labels render with no punctuation after them (no colon). | covered | INV-OREF-01 |
| S3-R2 | The Terms field is always shown on the Estimate and Invoice — the one deliberate exception to the hide-when-empty rule (Section 5). | covered | INV-OREF-02 |
| S3-R3 | The Authorizer field shows the full name of the work order's selected Authorizer (net-new). The Authorizer is selected on the work order per S3-R5. | covered | INV-OREF-03 |
| S3-R4 | The Approval Code field shows the work order's integrated-billing approval code (net-new placement — see the context note). | covered | INV-OREF-04 |
| S3-R5 | The Authorizer is selected in the customer contact card on the left side of every work order, in an "Authorizer" row directly below the Contact and Phone values, in the same label-and-value style. Selecting the row opens a list of the custo | covered | INV-AUTH-01 |
| S3-R6 | The Authorizer is not required and defaults to empty. The list carries a "No authorizer" option that clears the selection. | covered | INV-AUTH-02 |
| S3-R7 | When the selected Authorizer's contact record has a phone number, the phone number is shown in the card directly below the Authorizer's name, styled like the Contact's phone. When the contact record has no phone number, no phone row is show | covered | INV-AUTH-03 |
| S3-R8 | The Authorizer cannot be changed once the work order is invoiced; from that point the row is locked. | covered | INV-AUTH-04 |
| S3-R9 | A new authorizer is created on the customer's contacts page: the user creates or edits a contact and enables "Approves Work". The change reflects immediately: the contact becomes selectable in the work order's Authorizer list without any re | covered | INV-AUTH-05 |
| S3-N1 | The Work Order field is hidden when the work order number equals the trailing digits of the document number. The trailing digits are the unbroken digits at the end of the number: "4176" in "INV-4176"; "24914" in "INV-S-24914". Example: docu | covered | INV-OREF-05 |
| S3-N2 | The Customer PO field is hidden when it is empty. | covered | INV-OREF-06 |
| S3-N3 | The Authorizer field is hidden when the work order has no Authorizer selected: no label, no empty value area. An empty Authorizer never prints on any document. | covered | INV-OREF-06 |
| S3-N4 | When no Terms value is configured, the rendered text is exactly "Terms" with an empty value area — no colon, no placeholder. | covered | INV-OREF-02 |
| S3-N5 | The Approval Code field is hidden when the work order has no approval code — no label, no empty value area. | covered | INV-OREF-06 |
| S4-R1 | When the asset section is shown, it shows the asset name, labeled exactly "Asset". When the asset has a VIN or a serial number, the section also shows one value labeled exactly "VIN / Serial": the VIN when the asset has a VIN, otherwise the | covered | INV-ASST-01 |
| S4-R2 | The asset section can also show fields labeled exactly "Unit", "Plate", "Mileage", and "Eng Hrs". | covered | INV-ASST-02 |
| S4-N1 | The Unit, Plate, Mileage, and Eng Hrs fields are each hidden when empty. | covered | INV-ASST-03 |
| S4-N2 | When the section is shown but the asset has no VIN or serial number, the "VIN / Serial" field is hidden; the Asset name still shows. | covered | INV-ASST-04 |
| S4-N3 | When the work order has no asset attached, the asset section is hidden. | covered | INV-ASST-05 |
| S5-R1 | The work is presented under a single section heading, reading exactly "Work Summary" on an Estimate and "Work Performed" on an Invoice. | covered | INV-WORK-01 |
| S5-R2 | Each work line shows a line number. Line numbers are sequential with no gaps and are zero-padded to two digits (01, 02 … 10, 11). Lines 1–99 stay two digits even when the document has 100 or more lines; lines 100 and above show three digits | covered | INV-WORK-02 |
| S5-R3 | Each work line shows a name. | covered | INV-WORK-03 |
| S5-R4 | Each work line shows its description when a description is present. | covered | INV-WORK-03 |
| S5-R5 | Each work line shows its scope-of-work note when a scope-of-work note is present. | covered | INV-WORK-03 |
| S5-R6 | A labor entry within a line is labeled exactly "Labor"; a parts entry is labeled exactly "Parts". | covered | INV-WORK-04 |
| S5-R7 | Labor hours, labor rate, labor cost, part quantity, and part price are each shown or hidden by their own independent document setting — under Administration → Invoice Details, labeled "Labor hours", "Labor rate", "Labor price", "Part quanti | covered | INV-WORK-05, INV-WORK-07 |
| S5-R8 | A fee or discount that applies to a single labor or parts line is shown with that line; a discount is shown in parentheses and a fee is shown as a plain amount. | covered | INV-WORK-06 |
| S5-R9 | Each work line shows a footer with figures labeled exactly "Labor", "Parts", and "Line total". The Labor and Parts figures are that line's own totals after its line-level fees and discounts; "Line total" is their sum. A "Labor" or "Parts" f | covered | INV-WORK-07 |
| S5-R10 | The "Line total" figure appears once per line. | covered | INV-WORK-07 |
| S5-N1 | When the document has no work lines, the work section shows its heading with no lines, and the "Summary" divider (S7-R1) still precedes the financial summary. | covered | INV-WORK-08 |
| S6-R1 | Declined work is shown in its own section headed exactly "Declined Work", separate from the main work section. | covered | INV-DECL-01 |
| S6-R2 | Each declined line shows its name, and its description when a description is present. A declined line never shows a scope-of-work note (the technician's write-up); that note is internal and does not print on any customer document for declin | covered | INV-DECL-01 |
| S6-R3 | Declined lines show no prices, no labor totals, and no parts totals, and are never included in any total on the document. | covered | INV-DECL-02 |
| S6-R4 | Declined lines do not show a line number. | covered | INV-DECL-02 |
| S6-R5 | No status pill is shown on declined lines; the "Declined Work" heading is the only indicator of declined status. | covered | INV-DECL-02 |
| S6-N1 | When there are no declined lines, or the "Show declined work" option is off, the Declined Work section is not shown. | covered | INV-DECL-03 |
| S7-R1 | A divider labeled exactly "Summary" precedes the financial summary. | covered | INV-FSUM-01 |
| S7-R2 | The summary shows a row labeled exactly "Labor" and a row labeled exactly "Parts". Each shows the gross amount — before any fees or discounts. A row labeled exactly "Shop supplies" is shown only when a shop-supplies charge applies. | covered | INV-FSUM-02 |
| S7-R3 | When the location's "Show % on Estimates and Invoices" setting is enabled and shop supplies are charged as a percentage of labor, the percentage is shown with the shop supplies amount; otherwise the amount is shown alone. | covered | INV-FSUM-03 |
| S7-R4 | Fees and discounts are grouped under a heading labeled exactly "Adjustments", which is a label with no amount of its own. | covered | INV-FSUM-04 |
| S7-R5 | Under the Adjustments heading, in this order: a rollup row labeled exactly "Labor" totaling all line-level labor fees and discounts, a rollup row labeled exactly "Parts" totaling all line-level parts fees and discounts, then each work-order | covered | INV-FSUM-04 |
| S7-R6 | Shop supplies are shown as their own charge row and are not placed under the Adjustments heading. | covered | INV-FSUM-02 |
| S7-R7 | The summary shows a row labeled exactly "Subtotal". | covered | INV-FSUM-05 |
| S7-R8 | The summary shows one tax row per applicable tax, each labeled with the tax name and its rate. | covered | INV-FSUM-05 |
| S7-R9 | The summary shows the grand total, labeled exactly "Total". | covered | INV-FSUM-05 |
| S7-R10 | Every row of the financial summary that contributes to the Subtotal is displayed; no contributing summary row is hidden. | covered | INV-FSUM-05 |
| S7-N1 | The Adjustments heading is not shown when there is nothing to list under it — no work-order-wide fees or discounts and both rollup totals at zero. | covered | INV-FSUM-06 |
| S7-N2 | When no tax applies, no tax row is shown. | covered | INV-FSUM-06 |
| S8-R1 | The Invoice shows a heading labeled exactly "Payments". | covered | INV-PAID-01 |
| S8-R2 | When one or more payments have been applied, each payment is shown as a row with a label and an amount. The label reads "{date} - {method}" (for example "Jul 30, 2026 - Cash"), where {date} is the payment's own date and the hyphen is a lite | covered | INV-PAID-01 |
| S8-R3 | The method name is the shop-configured payment-method name when configured; otherwise the payment code, with each underscore replaced by a space (for example, credit_card → "credit card"). The "SHOPPAY" code is shown as "Online". | covered | INV-PAID-02 |
| S8-R4 | A deposit is shown as a payment row labeled "(Deposit) {date} - {method}", where {date} is the date the deposit was collected. An applied customer-account credit is shown as a payment row labeled "(Credit) {date} - {credit number}", where { | covered | INV-PAID-03 |
| S8-R5 | When a payment's or deposit's amount exceeds its amount applied to this invoice, a sub-line is shown beneath that row. When the excess has become a customer-account credit with a number, the sub-line reads exactly "of {full amount} — {exces | covered | INV-PAID-04 |
| S8-R6 | The Invoice shows a row labeled exactly "Balance" with the amount remaining to be paid. Balance equals the Total minus all applied payments (any method), applied deposits, and applied customer-account credits, and is floored at $0.00: an ov | covered | INV-PAID-05 |
| S8-R7 | A payment row whose amount is $0.00 is not shown. | covered | INV-PAID-08 |
| S8-R8 | (prose rule — see spec body) | covered | INV-PAID-06 |
| S8-R9 | Each banner payment shows fields labeled exactly: "Date / Time" (the date and time the payment was made), "Paid By" (the payer name captured at payment), "Method" (named by the S8-R3 rule), "Invoice Amount" (the portion of this payment appl | covered | INV-PAID-07 |
| S8-N1 | When no payments, deposits, or customer-account credits have been applied, the Payments heading is shown with no rows, and the Balance equals the Total. | covered | INV-PAID-08 |
| S8-N2 | When the invoice has no portal-processed payment, the paid banner is not shown — a shop-recorded payment (for example cash at the counter) never produces the banner, and an Invoice PDF generated in the shop app shows no banner in any case. | covered | INV-PAID-09 |
| S9-R1 | The document shows the shop's configured disclaimer text, with no heading above it, identical on every document that carries it. | covered | INV-FOOT-01 |
| S9-R2 | The document shows a signature area with three lines labeled exactly "Customer Signature", "Printed Name", and "Date", identical on every document that carries it. | covered | INV-CRED-07, INV-FOOT-02 |
| S9-R3 | The signature area contains no authorization or acknowledgment sentence. | covered | INV-FOOT-02 |
| S9-R4 | The footer shows the shop's tax identifier exactly as the shop entered it, with no label added in front of it. | covered | INV-FOOT-03 |
| S9-N1 | When the shop has no configured disclaimer, the disclaimer area is not shown. | covered | INV-FOOT-04 |
| S9-N2 | When the shop has no tax identifier configured, the footer tax identifier is not shown. | covered | INV-FOOT-04 |
| S10-R1 | The Estimate and Invoice carry the same content, differing only as Section 3 specifies (document label, dates, work-section heading, headline figure, and the presence of the Paid banner and the Payments and Balance sections on the Invoice). | covered | INV-EIS-01 |
| S10-R2 | On an Estimate, the work-section heading reads "Work Summary", the headline figure is labeled "Estimated Total", and the masthead shows "Estimate date: {date}" **(a relabel, not a new element: production estimates today print "Invoice Date" | covered | INV-EIS-02 |
| S10-R3 | On an Invoice, the work-section heading reads "Work Performed", the headline figure is labeled "Balance", and the masthead shows "Invoice date: {date}" and "Due date: {date}" (on a fully paid Invoice, "Paid date: {date}" replaces "Due date: | covered | INV-EIS-03 |
| S10-R4 | A fully paid Invoice (Section 6) remains "Invoice: {number}", lists its payments (Story 8), and shows a Balance of $0.00. It is the customer's receipt; no separate receipt document exists and the document label is never renamed. **One masth | covered | INV-EIS-04 |
| S10-N1 | An Invoice with no due date set shows "Invoice date: {date}" and no "Due date" line. The S10-R4 swap is unaffected: when such an invoice becomes fully paid, "Paid date: {date}" is shown. | covered | INV-EIS-05 |
| S11-R1 | The masthead shows "Credit: {number}" (the credit number carries the "CM-" prefix, for example "Credit: CM-2202") and "Issue date: {date}". The masthead shows no money figure. | covered | INV-CRED-01 |
| S11-R2 | The customer address block is labeled exactly "Credit To". | covered | INV-CRED-02 |
| S11-R3 | A status table shows three columns labeled exactly "Credit Number", "Status", and "Invoice Number". Status shows the credit's current state: "Unapplied", "Partially applied", "Applied", "Refunded", or "Voided". Invoice Number shows the orig | covered | INV-CRED-03 |
| S11-R4 | The credited items appear in a table with columns labeled exactly "Description", "Quantity", "Rate", "Restocking Fee", and "Total". A returned part shows its actual quantity (as a negative number) and rate; a money-only credit line shows "- | covered | INV-CRED-04 |
| S11-R5 | For a returned part, the restocking fee reduces the credit: quantity -2 at rate $50.00 with a $10.00 restocking fee produces Total -$90.00. For a money-only line, Total is the credited amount. A money-only line's Description comes from the  | covered | INV-CRED-04, INV-CRED-05 |
| S11-R6 | The totals block shows rows labeled exactly: "Subtotal" (sum of the item totals, negative), "Tax" (a single row; negative when tax applies, "$0.00" when none), "Total Credit" (negative, the document's most important figure — visual emphasis | covered | INV-CRED-06 |
| S11-R6a | Balance reads the credit's **open balance** in every status: the original credit total minus amounts refunded minus amounts applied to invoices, shown positive, reading $0.00 once nothing remains or when the credit is voided. On memos with  | covered | INV-CRED-06 |
| S11-R7 | The Credit Invoice shows the shop's configured disclaimer and the standard signature area (S9-R2). | covered | INV-CRED-07 |
| S12-R1 | The documents implement the Design Document's structure exactly: masthead with the shop letterhead left, the shop logo center, and the document block right over a 2px ink rule; a bordered Addresses row; the asset band; the order reference c | covered | INV-VIS-01 |
| S12-R2 | The only colors on the light printed document are: ink #121926, body text #364152, muted text #697586, faint labels #9AA4B2, hairlines #E3E8EF, row dividers #EEF2F6, paid-banner surface #F8FAFC, accent #257CFF, negative #B42318, paper #FFFFFF. No color outside this set appears on the printed document; print/B&W adds only the S12-R5 inks; demo chrome and dark-mode preview are not part of any document. | covered | INV-VIS-02 |
| S12-R3 | The accent #257CFF appears only on the work line numbers and on the word "ShopView" in the footer. On the Parts Sale document (no numbered work lines) the accent appears only on "ShopView". Nothing else uses the accent. | covered | INV-VIS-03 |
| S12-R4 | The typeface is Inter with a system sans-serif fallback, applied identically on screen and in PDF output (preview and PDF wrap line for line). Weight 400 body; 600 and 700 emphasis/totals; 700 in-job section labels (S12-R9); 800 shop name, document label, headline figure, line numbers. | covered | INV-VIS-04 |
| S12-R5 | In print and PDF output, no text renders lighter than #4B5565; text smaller than 10px renders no lighter than #364152; hairline rules render no lighter than #CDD5DF. (Weak printers drop lighter values.) | covered | INV-VIS-05 |
| S12-R6 | Every document is fully legible printed in grayscale. Color is never the only signal: credit amounts also carry the leading minus (S11-R4), and discounts also carry parentheses (S5-R8). | covered | INV-VIS-06 |
| S12-R7 | The Design Document's control strips (the document and field toggles, the settings menu, the theme controls) are demo tooling. They are not part of any document. The white sheet is the document. | covered | INV-VIS-07 |
| S12-R8 | The work section opens with a 2px ink rule under the section label. Numbered jobs are separated by a 1px ink (#121926) rule. Charge rows inside a job are separated by #EEF2F6 row dividers. The "Labor" and "Parts" sub-section labels carry no | covered | INV-PART-03, INV-VIS-08 |
| S12-R9 | Section labels are bold uppercase micro-labels in three fixed treatments: the document section label ("Work Summary" / "Work Performed" / "Parts") at 11px weight 700 in muted ink #697586; "Scope of work" at 10px weight 700 in body ink #364152; the in-job "Labor"/"Parts" labels at 10.5px weight 700 in full ink #121926. | covered | INV-VIS-09 |
| S12-R10 | Long documents paginate with standard page-break behavior: every page after the first opens with a single identification line (shop location name left, document number right); the full masthead does not repeat; the totals block is not split; a work line and its footer stay together; the signature row does not land alone; no single row is orphaned. | covered | INV-VIS-10 |
| S12-R11 | On screen the document fits within the viewport with no content clipped; any element wider than the viewport (e.g. a wide table) scrolls horizontally within its own container rather than clipping or forcing the whole page to scroll sideways. | covered | INV-VIS-11 |
| S12-N1 | The PDF output carries no drop shadow and no rounded sheet corners; those are screen-prototype presentation only. | covered | INV-VIS-07 |
| S13-R1 | The Parts Sale Estimate behaves as the Estimate, and the Parts Sale Invoice as the Invoice, throughout this spec — masthead and date labels (Stories 1 and 10, including "Estimate date" and the Due/Paid date swap), addresses and Remit Paymen | covered | INV-PART-01 |
| S13-R2 | The body is a single section headed "Parts": flat part lines showing part number, description, quantity, rate, and amount. No job blocks, no "Scope of work", no Labor section, and no Declined Work section exist on a parts sale document. | covered | INV-PART-02 |
| S13-R3 | Line-level fees and discounts render exactly as on the Invoice: indented under their part line, with the row divider following the part's last adjustment row rather than sitting between the part and its adjustments. | covered | INV-PART-03 |
| S13-R4 | The document number keeps the parts-sale numbering through the existing document numbering (for example "Estimate: EST-P2-1088", "Invoice: INV-P2-1088"). | covered | INV-PART-04 |
| S13-R5 | Reference fields: Work Order and Approval Code are not shown. Customer PO and Terms are unchanged. Authorizer follows S13-R6. | covered | INV-PART-05 |
| S13-R6 | The parts sale receives the work-order Authorizer treatment: an Authorizer field on the parts sale record, offering the customer's "Approves Work" contacts, empty by default, filled by the user, locked once the parts sale is invoiced, and p | covered | INV-PART-06 |
| S13-R7 | The financial summary shows no Labor row and no Shop supplies row; the Parts row, the adjustment rows, Subtotal, Tax, Total, Payments, and Balance are identical to the Invoice. | covered | INV-PART-07 |
| S13-N1 | Batch invoices and imported invoices are not part of this story or this spec; they keep their current templates until [SV-9193](https://shopview.atlassian.net/browse/SV-9193) ships (§2, Out of scope). | covered | INV-PART-08 |
| G-R1 | Every {date} on every document renders as, for example, "Jan 5, 2026": abbreviated English month, day of the month without a leading zero, a comma, and the four-digit year (PHP format string "M j, Y"). This format is fixed: no shop or user  | covered | INV-MAST-06, INV-PAID-07 |

## Reconciliation
- Distinct spec rule IDs: **112** (v45: +S12-R10 page breaks, +S12-R11 viewport)
- Rules with at least one covering case: **112**
- **UNCOVERED rules: 0** — none
- Cases: **89** · case→rule anchors all resolve to a real spec rule: **YES**