# Invoice Refresh — execution findings
**Date:** 7 September 2026 · **Environment:** staging, `app.staging.shopview.com` · **Build:** `v26.35.9-9812433`
**Suite:** Invoice Refresh (Aug 2026), TestRail group 6559 · **All 120 cases executed.**
**Results are held LOCALLY. Nothing was written to TestRail run R417.**

| Verdict | Cases |
|---|---|
| **Passed** | **110** |
| **Failed** | **6** |
| **Blocked** | **4** |
| **Total** | **120** |

**Updated 7 Sep, later the same day:** the customer portal was reached and the three paid-banner cases
were executed. **C44951 and C45175 pass; C44952 fails on one clause.** Full method and evidence:
`PORTAL-BANNER-VERIFICATION-2026-09-07.md`.

---

## The six failures

| Case | What is wrong | Ticket |
|---|---|---|
| **C44935** | The work-line footer excludes that line's own fees and discounts. Line 01 of S2-32136 carries a $25.00 fee; the footer still reads `Labor $299.90` / `Line total $299.90` where both should read `$324.90`. The Summary charges the fee, so the same page disagrees with itself. | **[SV-9773](https://shopview.atlassian.net/browse/SV-9773)** — raised this pass |
| **C44926** | `Mileage` and `Eng Hrs` print `0` instead of hiding when the asset has no reading. `Unit` and `Plate` hide correctly. Reproduced on four records whose live values are null. | **[SV-9680](https://shopview.atlassian.net/browse/SV-9680)** — already open, Code Review. Not re-raised. |
| **C44974** | Every generated PDF embeds **DejaVu Sans**, never Inter — Invoice, Estimate, deposit-paid Invoice and Credit all four. The 400/600/700/800 weight ladder collapses to regular-or-bold. | **[SV-9761](https://shopview.atlassian.net/browse/SV-9761)** — already open. Not re-raised. |
| **C44970** | A credit with no originating invoice prints no disclaimer. A credit raised from an invoice does print it, which proves the shop has one configured. | **[SV-9790](https://shopview.atlassian.net/browse/SV-9790)** — raised this pass on the QA lead's instruction |
| **C44952** | The paid banner never draws the **"Remaining Balance"** row that S8-R9 requires. Checked on four invoices where money was still owing straight after a listed payment. Every other clause of the case passes. | **[SV-9803](https://shopview.atlassian.net/browse/SV-9803)** — Story Defect under SV-9147. The body argues it as a **spec correction** rather than a build change: production serves the byte-identical portal chunk, so the row has never existed, and the spec's own precedence rule amends a non-net-new rule to describe production. (First filed as the Task SV-9797 — wrong issue type, now OBSOLETE) |
| **C44917** | The Work Order field is hidden. Chris Ward's ruling of 7 Sep (spec v57) rewrote S3-N1: the field must now **show** unless the document has no work order or the two numbers are character-for-character identical. `S-32136` and `INV-S2-32136` are not identical. | **[SV-9642](https://shopview.atlassian.net/browse/SV-9642)** — already open, Code Review. Not re-raised. Chris linked it to SV-9770 |

**[SV-9774](https://shopview.atlassian.net/browse/SV-9774) was raised this pass and has been OBSOLETED by the QA lead.** It claimed the Parts Sale document drops the part number. It does not — the "Part number" toggle was off in that part sale's own per-view settings. With it on the line reads `P550848 - FUEL/WATER SEPARATOR…`. **C44981 is corrected to Passed.** The lesson is recorded as L24 in `../INVOICE-REFRESH-LEARNINGS.md`.

---

## The four blocked, each with a ticket that says what would unblock it

| Case | Verified | Cannot be produced | Ticket |
|---|---|---|---|
| **C44902** | The logo shows when set (2208×480 image, centred in the masthead) | Nothing showing when unset | **[SV-9804](https://shopview.atlassian.net/browse/SV-9804)** — Story Defect under SV-9140. A logo can be added or replaced, never removed, and it is stored per organisation. Fresh organisations do start without one, but ShopView offers no way to switch organisation. (First filed as the Task SV-9799 — wrong issue type, now OBSOLETE) |
| **C44907** | Fields that have values do show | Any masthead identity field being empty | **[SV-9805](https://shopview.atlassian.net/browse/SV-9805)** — Story Defect under SV-9140. All five are mandatory at creation; clearing them on an existing location reports success and does not persist. (First filed as the Task SV-9800 — wrong issue type, now OBSOLETE) |
| **C44916** | — | The Approval Code field | **[SV-9710](https://shopview.atlassian.net/browse/SV-9710)** — already open. Commented this pass: staging is worse than QA, the IBS integration is not connected at all (`isConfigured: false`) and all three locations have an empty IBS Location ID |
| **C45275** | — | Anything | None, and none possible. The case has **no Steps and no Expected Results at all**, and it is Vladimir Tomovic's (`created_by 1`), so hands-off — report, never edit |

**C44951, C44952 and C45175 are no longer blocked.** The customer portal is reached from the shop app's
own account menu — the avatar at the top right → **Customer Portal** — which opens
`https://staging.portal.shopview.com/invoices` in a new tab through an SSO handoff, with no separate
password. The banner document is the printer icon → **"Print with Payment Receipt"**. All three cases
now carry that route in their preconditions and pass `check_runnable_cases.py`.

**C44963, C45178 and C45190 are no longer blocked** — all three now pass. C45190 was unblocked by importing a historical work order through the route our own playbook documents; C45178 by discounting a work order to exactly $0.00; C44963 by the QA lead's correction that the document with no due date is the Estimate view.

---

## Observations — worth a product decision, not defects

1. **Excess sub-line wording.** A payment split across two invoices prints `of $397.96 — $347.96 will be credited` on this invoice, although the excess went to the other invoice rather than to a credit. That is exactly what S8 clause 3 prescribes, so the build conforms; the wording may still mislead.
2. **Shop-supplies percentage when the cap binds.** At 105 lines the labour total is $36,750.00 and the summary prints `Shop supplies (10.5% of labor)  $350.00`. The $350.00 is correct — the location's maximum charge is $350 and the spec sanctions the cap — but the label advertises a percentage that does not reconcile.
3. **PDF filename rule G-R2 has no case.** Added to the spec on 2026-09-04, after this suite was written. The app download obeys it (`INV-S2-32136.pdf`); the **email attachment does not** (`invoice-for-order-S2-32136.pdf`). G-R2 says "the same however the PDF is produced, in the app or from the customer portal" and does not mention email, so whether it binds here is a genuine question.
4. **Terms cannot be empty.** C44914 clause 2 describes a state the product cannot reach — the picker offers twelve values and no empty option, and new customers are given COD automatically.
5. **The document preview serves a stale render.** After a settings change, an already-rendered document keeps returning the old PDF (byte-identical across three requests) while unrendered documents come back correct. Judge any settings change on a fresh document.
6. **`undefined%` in the asset's Invoices list.** Customers → 4 Star Truck Repair → Assets → 2011
   Hyundai Santa Fe → **Invoices**: the **Tax Rate** column prints the literal word `undefined%` on
   every row, while the Discount column beside it renders `0.00%` correctly. Outside this suite, but
   unambiguous and reproducible in five clicks — **raised as
   [SV-9802](https://shopview.atlassian.net/browse/SV-9802)**, and this one stays a **Bug**: the Customers → asset →
   Invoices screen belongs to no story in any open epic, and a Story Defect must have a Story parent.
7. **`undefined, undefined, undefined` on the imported work order's document.** Seen earlier this pass
   on ZZAUTOTEST-IMP-001, where the shop address belongs, on the OLD (unrefreshed) imported template.
   **Not ticketed**, deliberately: the imported record could not be located again through the UI this
   afternoon, so no repro steps could be verified, and a ticket without runnable steps is worse than
   none. Screenshot kept at `evidence-incidental/imported-wo.png`. It needs a fresh historical import
   and a confirmed route before it is filed. The imported template's restyle is already deferred to
   **SV-9193**, but a missing shop address is a data fault, not styling.
8. **Saving an empty value silently does nothing.** The organisation Tax ID and the location address fields all clear in the form, report no error on save, and are unchanged afterwards. This is an Administration-screen behaviour, outside this suite's scope.

---

## Source currency — the spec moved during this pass

All 120 cases cite **specification version 45**. The live page is now **v57**, and Chris Ward changed
four things on 7 September, after our snapshot. Full analysis in `SPEC-CHANGES-2026-09-07-v57.md`:

1. **S3-N1 rewritten + new S3-R10** — the Work Order field must now SHOW. This flipped **C44917 from Passed to Failed** and is tracked by SV-9642.
2. **New G-R4** — A4 portrait, 718px sheet box, 634px content box. **Verified this pass and it passes**, on all six document types.
3. **S10-R2 expanded** — the Estimate date tracks the current date until an invoice exists; explicitly not a defect. Consistent with what we saw.
4. Changelog rows.

**Rules with no case at all:** G-R2 (PDF filename, 2026-09-04), S3-R10 and G-R4 (both 2026-09-07).
Bringing the suite current is authoring work and was not done in this lane.
