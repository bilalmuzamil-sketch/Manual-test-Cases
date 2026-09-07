# Invoice Refresh — execution findings
**Date:** 7 September 2026 · **Environment:** staging, `app.staging.shopview.com` · **Build:** `v26.35.9-9812433`
**Suite:** Invoice Refresh (Aug 2026), TestRail group 6559 · **All 120 cases executed.**
**Results are held LOCALLY. Nothing was written to TestRail run R417.**

| Verdict | Cases |
|---|---|
| **Passed** | **106** |
| **Failed** | **4** |
| **Blocked** | **10** |
| **Total** | **120** |

---

## The four failures

| Case | What is wrong | Ticket |
|---|---|---|
| **C44935** | The work-line footer excludes that line's own fees and discounts. Line 01 of S2-32136 carries a $25.00 fee; the footer still reads `Labor $299.90` / `Line total $299.90` where both should read `$324.90`. The Summary charges the fee, so the same page disagrees with itself. | **[SV-9773](https://shopview.atlassian.net/browse/SV-9773)** — raised this pass |
| **C44926** | `Mileage` and `Eng Hrs` print `0` instead of hiding when the asset has no reading. `Unit` and `Plate` hide correctly. Reproduced on four records whose live values are null. | **[SV-9680](https://shopview.atlassian.net/browse/SV-9680)** — already open, Code Review. Not re-raised. |
| **C44974** | Every generated PDF embeds **DejaVu Sans**, never Inter — Invoice, Estimate, deposit-paid Invoice and Credit all four. The 400/600/700/800 weight ladder collapses to regular-or-bold. | **[SV-9761](https://shopview.atlassian.net/browse/SV-9761)** — already open. Not re-raised. |
| **C44970** | A credit with no originating invoice prints no disclaimer (eight documents). A credit raised from an invoice does print it, which proves the shop has one configured. | None. This is outcome (2) in the case's own text, so the case says mark it Failed and raise nothing. |

**[SV-9774](https://shopview.atlassian.net/browse/SV-9774) was raised this pass and has been OBSOLETED by the QA lead.** It claimed the Parts Sale document drops the part number. It does not — the "Part number" toggle was off in that part sale's own per-view settings. With it on the line reads `P550848 - FUEL/WATER SEPARATOR…`. **C44981 is corrected to Passed.** The lesson is recorded as L24 in `../INVOICE-REFRESH-LEARNINGS.md`.

---

## The ten blocked, and what each needs

| Case | Verified | Cannot be produced | To finish it |
|---|---|---|---|
| **C44902** | The logo shows when set (2208×480 image, centred in the masthead) | Nothing showing when unset | Find where the logo is uploaded — it is on none of Locations, New Location or Administration → Settings |
| **C44907** | Fields that have values do show | Any masthead identity field being empty | The Locations form clears the field, reports success and does not persist it. Needs a data change |
| **C44916** | — | The Approval Code field | All 100 work orders here have a null `ibs_approval_code`. Needs a work order taken through the IBS approval flow |
| **C44951 · C44952 · C45175** | No shop-app PDF ever carries the paid banner (C44951 clause 3) | The banner itself | The banner exists only on a **customer-portal** PDF. No portal host resolves and no portal payment exists on the test customer |
| **C44963** | — | An invoice with no due date | Every customer carries a credit term, so a due date is always derived. Clear a customer's terms first |
| **C45178** | — | A $0.00 invoice | Every canned line here is priced. Needs a zero-priced line |
| **C45190** | The card and the Authorizer row are correct on a work order and on a part sale | The imported-work-order half | No imported work order exists in this organisation |
| **C45275** | — | — | Needs the authorizer entry screens |

---

## Observations — worth a product decision, not defects

1. **Excess sub-line wording.** A payment split across two invoices prints `of $397.96 — $347.96 will be credited` on this invoice, although the excess went to the other invoice rather than to a credit. That is exactly what S8 clause 3 prescribes, so the build conforms; the wording may still mislead.
2. **Shop-supplies percentage when the cap binds.** At 105 lines the labour total is $36,750.00 and the summary prints `Shop supplies (10.5% of labor)  $350.00`. The $350.00 is correct — the location's maximum charge is $350 and the spec sanctions the cap — but the label advertises a percentage that does not reconcile.
3. **PDF filename rule G-R2 has no case.** Added to the spec on 2026-09-04, after this suite was written. The app download obeys it (`INV-S2-32136.pdf`); the **email attachment does not** (`invoice-for-order-S2-32136.pdf`). G-R2 says "the same however the PDF is produced, in the app or from the customer portal" and does not mention email, so whether it binds here is a genuine question.
4. **Terms cannot be empty.** C44914 clause 2 describes a state the product cannot reach — the picker offers twelve values and no empty option, and new customers are given COD automatically.
5. **The document preview serves a stale render.** After a settings change, an already-rendered document keeps returning the old PDF (byte-identical across three requests) while unrendered documents come back correct. Judge any settings change on a fresh document.
6. **Saving an empty value silently does nothing.** The organisation Tax ID and the location address fields all clear in the form, report no error on save, and are unchanged afterwards. This is an Administration-screen behaviour, outside this suite's scope.

---

## Source currency

All 120 cases cite **specification version 45**. The live Confluence page (755990532) was last modified **5 September 2026** and now carries rules the suite predates — **G-R2** (PDF filename) and the **2026-09-04 correction to S12-R4** making the document label 24px, which the build renders at 18px. Bringing the suite up to the current spec is authoring work and was not done in this lane.
