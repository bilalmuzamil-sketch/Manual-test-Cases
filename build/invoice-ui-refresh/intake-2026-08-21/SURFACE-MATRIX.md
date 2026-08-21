# Surface Matrix — Invoice UI Refresh (Rule 40)

These are customer **documents** rendered by ShopView (Twig → WeasyPrint), so the primary surface is
the generated document (on-screen preview and PDF are the same template). Two split surfaces matter:
**portal-generated vs shop-app-generated PDF** (S8-R8 banner), and the **work-order / parts-sale UI**
(Vue/Quasar) where the Authorizer is selected (S3-R5..R9, S13-R6). There is **no CSV/data export** of
these documents and **no API-payload surface** (Rule 4 not triggered — nothing is endpoint/verb/status
content invisible to a tester).

Legend: ✅ authored · — N/A for that document · (n) case count.

| Story / area | Estimate | Invoice | Credit Inv. | Parts Sale | Portal PDF split | WO/PS UI |
|---|---|---|---|---|---|---|
| 1 Masthead | ✅ | ✅ | ✅ | ✅ (S13-R1) | — | — |
| 2 Addresses | ✅ | ✅ | ✅ (Credit To) | ✅ | — | — |
| 3 Order ref fields | ✅ | ✅ | — (Sec 3) | ✅ (WO/Appr dropped) | — | — |
| 3 Authorizer entry | — | — | — | — | — | ✅ (5) WO UI; ✅ Parts-sale UI (S13-R6) |
| 4 Asset section | ✅ | ✅ | — | ✅ (asset if attached) | — | — |
| 5 Work section | ✅ | ✅ | — | replaced by Parts body (S13-R2) | — | — |
| 6 Declined work | ✅ | ✅ | — | — (none on PS) | — | — |
| 7 Financial summary | ✅ | ✅ | — (own totals block) | ✅ (no Labor/Supplies) | — | — |
| 8 Paid banner/Payments/Balance | — | ✅ | Payments/Balance via S11 | ✅ (as Invoice) | ✅ banner portal-only (S8-R8/N2) | — |
| 9 Disclaimer/Signature/Footer | ✅ | ✅ | ✅ | ✅ | — | — |
| 10 Estimate/Invoice specifics | ✅ | ✅ | — | ✅ (dates/labels) | — | — |
| 11 Credit Invoice | — | — | ✅ (7 cases) | — | — | — |
| 12 Visual standard | ✅ screen+PDF | ✅ | ✅ | ✅ | ✅ print/PDF ink floor (S12-R5), grayscale (S12-R6), no shadow/round (S12-N1) | — |
| 13 Parts sale | — | — | — | ✅ (8 cases) | ✅ (banner as Invoice) | ✅ (S13-R6) |

**Explicitly N/A, with reason:**
- **CSV / spreadsheet export:** these documents have none — they are printed/PDF customer documents.
- **Email / scheduled delivery:** not in this spec (Section 2 out-of-scope covers the standalone portal receipt; delivery is unchanged).
- **API payload:** no case asserts an endpoint/verb/status; Authorizer immediate-selectability (S3-R9) is a live-UI behaviour, not an API contract.
- **Batch / imported invoices:** deferred to SV-9193 (S13-N1) — one negative case (INV-PART-08) guards the boundary.
