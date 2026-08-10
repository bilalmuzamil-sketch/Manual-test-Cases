# SV-8768 combined test plan — sections 1, 3, 4, 5, 6 run. Section 2 held for a manual tester.

Tested against the plan Nemanja Djuric published on **SV-8768** (comment 74852), which is named as the
QA for **SV-8768, SV-8769, SV-8813 and SV-8814** together.

| | |
|---|---|
| Production (the unfixed side) | `app.shopview.com`, build **`v3.6-b8002fc`** |
| Staging (the fixed side) | `app.staging.shopview.com`, build **`v3.5-5e6bd35`** |
| Date | 2026-08-10 |

## Scoreboard

| Section | What it checks | Result |
|---|---|---|
| **1** | An invoiced work order shows what was billed | ✅ **PASS** — reproduced on production, fixed on staging |
| **2** | QuickBooks gets the amount the customer was charged | ⏸️ **HELD** — no QuickBooks-connected org; assigned to a manual tester |
| **3** | No line can be added to an invoiced work order | ✅ **PASS** — reproduced on production, fixed on staging |
| **4** | Re-invoicing after a void computes fresh numbers | ✅ **PASS on staging**; the pre-fix behaviour did **not** reproduce on production (see below) |
| **5** | Editing a work order with an unpaid invoice | ✅ **PASS** — the plan says skip; we tested it anyway, both halves |
| **6** | Things that shouldn't have changed | ✅ 5 of 8 checked and clean · 3 not coverable here (below) |

---

## Section 1 — an invoiced work order shows what was billed (SV-8768 / SV-8769)

Covered in full in `RESULT-SV-8769-section1.md`. Headline: **on production, simply invoicing the work
order pushed the processing fee from $149.27 to $156.77** — a $7.50 gap exactly matching the ticket's
own formula `PF% × (final tax − invoice-time gross tax)` = 100% × (15% × $50). On staging the identical
action moved nothing.

The remaining section-1 checkboxes were then run on staging work order **S1-44**:

| Check | Result |
|---|---|
| Fees & Discounts card | Processing fee **$115.00** ✅ |
| Financial Info subtotal | **$265.00**, matching the invoice ✅ |
| Stats tab fees list | **$115.00** — the same figure ✅ |
| Total vs Balance | $287.50 = $287.50 ✅ |
| Audit Log ("Work Order Log") | the "Invoice created" entry reads **Total: $287.50**, and both fee rows match the card ✅ |
| History entry (the clock icon in the Audit Log) | opens the work order as it was, showing processing fee **$115.00** and subtotal **$265.00** — same as the live screen ✅ |

A second work order, **S1-45**, independently confirms it with shop supplies in play: processing fee
**$126.50** before invoicing and **$126.50** after, subtotal $286.50 both times.

A third, **S1-47**, confirms it again at $236.50 → $236.50.

**Not covered:** the work-order **list** Total column, and a formal before/after comparison of the
invoice PDF against a pre-fix copy — we have no pre-fix PDF of the same work order to diff against.

---

## Section 3 — no line can be added to an invoiced work order (SV-8813, the one UI change)

**This section could not be tested honestly until a setup problem was fixed.** The staging organisation
had only **two** feature flags enabled — `BillingPortal` and `Deposits`. **ShopCoach was not enabled at
all**, so "the Build Lines panel is gone" was passing for the wrong reason, and the plan's own control
check ("on an in-progress work order it still shows") was impossible to demonstrate. `ShopCoach`,
`ShopCoachStory` and `ShopCoachWOReview` were enabled on the staging organisation (original two
recorded, to be restored), and the section was then run properly.

| Work order | Status | ShopCoach "Build Lines" | New Line button |
|---|---|---|---|
| **Production S2-836** | Invoiced | **SHOWN, button present** 🔴 | hidden |
| Staging **S1-44** | Invoiced | **gone** ✅ | hidden |
| Staging **S1-9** | Paid | **gone** ✅ | hidden |
| Staging **S1-8** | Paid | **gone** ✅ | hidden |
| Staging **S1-28** | In Progress | **shows and works** ✅ | shown |
| Staging **S1-15** | Approved | shows ✅ | shown |
| Staging **S1-10** | Estimate | shows ✅ | shown |
| Staging **S1-44**, history entry | Invoiced | **gone** ✅ | hidden |

Every checkbox in section 3 is covered except one, honestly:

- ✅ invoiced — panel gone
- ✅ paid — panel gone (two work orders)
- ✅ in progress — still shows and works
- ✅ history entry — no panel there either
- ✅ New Line behaviour unchanged — hidden on invoiced and paid, shown otherwise
- ⚠️ **the zero-line edge case was not reproduced exactly.** The plan asks for an *invoiced* work order
  with *no lines*, which this organisation does not contain and which the product will not let us
  create (a work order cannot be invoiced with nothing on it). What we can say is that on every
  invoiced and paid work order tested, opening the Lines tab did **not** auto-open the create-line
  dialog — while on an estimate with no lines (S1-10) it did, which is the correct behaviour.

**Evidence:** `ANN-SEC3-PRODUCTION-BEFORE.png` · `ANN-SEC3-STAGING-AFTER-invoiced.png` ·
`ANN-SEC3-STAGING-in-progress.png` (all annotated), plus the raw captures.

---

## Section 4 — re-invoicing after a void computes fresh numbers (SV-8813)

Run on staging work order **S1-45**: invoiced → **Reverse** → labour changed **1 h → 2 h** → completed →
invoiced again.

| | First invoice | After reverse + 1 h→2 h + re-invoice |
|---|---|---|
| Labour | $100.00 | $200.00 |
| **Shop supplies (10% of labour)** | **$10.00** | **$20.00** ✅ recomputed |
| Taxable fee | $50.00 | $50.00 |
| Processing fee (100%) | $126.50 | $253.00 ✅ recomputed |
| Subtotal | $286.50 | $523.00 |
| **Tax (15%)** | **$24.00** | **$40.50** ✅ recomputed |
| Total | $310.50 | $563.50 |
| Balance | $310.50 | $563.50 ✅ agrees |

Both figures the plan names — **tax and shop supplies** — were computed from today's numbers, and the
work order screen agrees with the new invoice. **PASS.**

**Honest finding: the pre-fix behaviour did not reproduce on production.** The identical sequence was
run on production work order **S2-836** (invoiced → Reverse → labour 1 h → 2 h → invoiced again) and
shop supplies moved $11.80 → **$23.60** and tax $26.97 → **$46.44** there as well. So we cannot show a
"before" for this section. Either the freeze needs a trigger other than the **Reverse** action we used,
or it needs a state this organisation does not produce. The **fix** is verified working; the **bug** is
not reproduced. (The production re-invoice did show the section-1 processing-fee inflation again —
$662.08 on screen against a $654.58 balance, the same $7.50 gap.)

**Evidence:** `ANN-SEC4-STAGING-BEFORE.png` · `ANN-SEC4-STAGING-AFTER.png` (annotated) ·
`SEC4-PRODUCTION_AFTER-reinvoice.png`.

---

## Section 5 — editing a work order with an unpaid invoice (SV-8813 / SV-8814)

The plan says *"skip hands-on testing here"*. **We tested it anyway**, on both environments, and both
halves behave as the plan promises. Covered in full in `RESULT-SV-8814.md`:

- **The one-edit lag (SV-8814):** on production a single API edit did **not** reach the invoice at all —
  the work order header read 2.0 hrs while its own invoice still read 1 hour / $129.80 — and a second,
  pointless edit was needed to flush the first one through. On staging **one edit was enough**.
- **The tax recompute (SV-8813):** on production the subtotal moved to $247.80 while tax stayed frozen
  at $19.47 (a $17.70 under-charge). On staging tax recomputed to $35.40 in the same single edit.

---

## Section 6 — things that shouldn't have changed

| Check | Result |
|---|---|
| A work order with **no fees at all** | ✅ **PASS** — staging **S1-46** invoiced: no Fees & Discounts card at all, labour $100.00 + supplies $10.00 = subtotal $110.00, tax $16.50, Total $126.50 = Balance $126.50 |
| **Add or change a fee before invoicing** — the amount shown when you save matches the card afterwards | ✅ **PASS** — on S1-45 the processing fee saved as $126.50 and the card read $126.50; the $50 flat fee likewise |
| A work order with a **declined line** — it must not feed the processing fee | ✅ **PASS** — staging **S1-47** had two $100 lines and a 100% processing fee resolving to **$253.00**; declining the second line moved it to **$126.50**, exactly `(100 + 10) × 1.15`, i.e. the declined line contributes nothing. Invoicing then left it at $236.50 |
| **Invoice creation in general** | ✅ **PASS** — five first-time invoices were created during this pass (S1-44, S1-45, S1-46, S1-47, S2-836) and every one reconciled to the cent on its own document |
| An **older invoice** created before this feature area existed | ⚠️ **PARTIAL** — staging **S1-25** (started 14 July, before this work shipped) still shows $20.00 exactly as it did. But it carries **no fees**, so it takes the no-adjustments path; a historical invoice that *does* carry a processing fee, where the code must fall back to live values, does not exist on this organisation |
| **Customer Invoice CSV export** | ❌ **NOT COVERED** — no such export could be found on this organisation. The work order's download button produces the PDF; the customer's Invoices tab has no export menu; Reports has no invoice CSV; and no export endpoint answered. It is likely behind the bookkeeping/IBS integration, which reads `bookkeeping_enabled: false` here. The plan itself lists this export as **unchanged** by the branch |
| A **technician** user (no pricing permission) | ❌ **NOT COVERED** — deliberately. Impersonating another user ends the only staging session we have, and staging cannot be signed into from here (it is behind Google SSO), so the pass would have stopped dead. Needs a second sign-in or the manual tester |
| A **tax-exempt part** | ❌ **NOT COVERED** — the declined-line half of that checkbox is covered above; the tax-exempt part half was not exercised |

---

## What was changed on staging, and what must be put back

| Change | Why | Restore |
|---|---|---|
| Feature flags `ShopCoach`, `ShopCoachStory`, `ShopCoachWOReview` enabled on organisation `115f79f7…` | Section 3 was untestable without them | Original set was **`BillingPortal`, `Deposits`** only — to be restored |
| First Location shop supplies set to **10%** (was 0%) | Section 4 needs shop supplies to be non-zero, otherwise "frozen at 0" and "fresh 0" are indistinguishable | Was `shop_supplies_charge: 0` |
| Work orders **S1-45, S1-46, S1-47** created (all `ZZAUTOTEST`) | Test data | Disposable |
| Production **S2-836** reversed and re-invoiced | Section 4 comparison | It is a `ZZAUTOTEST` work order we created |

## Honest limits on the whole pass

- **Section 2 (QuickBooks) was not tested at all** and is the plan's own most valuable check.
- Production's organisation charges 10% shop supplies and staging's did not until we enabled it, so the
  absolute figures differ between the two sides. The *behaviour* being compared is unaffected.
- The two builds are not the same version (`v3.6-b8002fc` vs `v3.5-5e6bd35`); they are the released
  build and the fix branch, which is the comparison the tickets ask for.
- Neither build is declared final.
