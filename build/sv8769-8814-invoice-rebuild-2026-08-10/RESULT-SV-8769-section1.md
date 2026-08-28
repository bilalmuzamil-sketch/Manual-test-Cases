# SV-8769 / SV-8768 — section 1: reproduced on production, fixed on staging

Tested to the **combined test plan on SV-8768**, which SV-8769's own comment names as its QA:
*"This ticket: sections 1–2 and 5."* This file covers **section 1** — *an invoiced work order shows
what was billed*. It needs **no API at all**: the defect is visible on screen the moment the work
order is invoiced.

## Setup — the plan's own recipe

| | Plan | Production S2-836 | Staging S1-44 |
|---|---|---|---|
| Labor | $100 (1 h) | $118 (1 h @ $118, rate **4226**) | **$100** (1 h @ $100, rate *100 per hour*) |
| Shop supplies | $10 | $11.80 (10%) | $0 (customer has none) |
| Tax | 15% | **15 percent** | **Flat 15%** |
| Fee | $50 flat, whole WO, **taxable** | same | same |
| Processing fee | % of grand total, non-taxable | **100%** | **100%** |

The plan says *"at 5% the fee error is only cents; a 100%+ Processing Fee makes the same bugs show up
as dollars"* — hence 100%.

## Result

| | Processing fee | Subtotal | Total | Balance |
|---|---|---|---|---|
| **Production — before invoicing** | $149.27 | $329.07 | $356.04 | $356.04 ✅ agree |
| **Production — after invoicing** | **$156.77** ⚠️ | $336.57 | **$363.54** | **$356.04** ❌ disagree |
| **Staging — before invoicing** | $115.00 | $265.00 | $287.50 | $287.50 ✅ agree |
| **Staging — after invoicing** | **$115.00** ✅ | $265.00 | $287.50 | $287.50 ✅ agree |

**Nothing was edited between the two production captures — the work order was simply invoiced.**

**The gap is $7.50 on production**, and it is exactly the formula SV-8768 states —
`PF% × (final tax − invoice-time gross tax)` = 100% × (15% × $50) = **$7.50**. The **Balance
($356.04) is what the customer was actually billed**, so the screen is displaying a processing fee
**$7.50 higher than anything ever charged**.

On staging the identical action changes nothing: fee stays $115.00, Total and Balance still agree.

## Evidence

| File | Shows |
|---|---|
| `SV-8769_PRODUCTION_BEFORE-invoicing-everything-correct.png` | fee $149.27, Total = Balance |
| `SV-8769_PRODUCTION_AFTER-invoicing-fee-inflated-BUG.png` | fee $156.77, Total $363.54 vs Balance $356.04 |
| `SV-8769_STAGING_BEFORE-invoicing-everything-correct.png` | fee $115.00, Total = Balance |
| `SV-8769_STAGING_AFTER-invoicing-fee-unchanged-FIXED.png` | fee $115.00 unchanged, Total = Balance |

## Noticed in the same screenshots — belongs to SV-8813 section 3

The production capture shows the **ShopCoach "Build Lines" panel still present on an INVOICED work
order**. That is precisely what SV-8813's UI change removes, so it is section 3's "before" evidence,
captured incidentally here.

## Honest notes

- Production has no $100/hr rate, so its labor is $118 and the absolute figures differ from the
  plan's $166.33 / $6.33. The **arithmetic still reconciles exactly** on each side, and the $7.50 gap
  is identical in both — that is what the comparison rests on.
- Staging's customer carries no shop-supplies charge; production's charges 10%. Irrelevant to the
  defect, which is driven by the taxable fee's tax.
- **Section 2 (QuickBooks) is NOT covered** — no QuickBooks-connected org available. It is being
  handed to manual QA.
