# Closing the evidence gaps — what each unexercised clause turned out to be
**Date:** 2026-09-07 (later the same day) · **Environment:** staging · **Build:** `v26.35.9-9812433`

All 120 cases were driven against this build in the main pass, but **26 carried an explicit
not-observed note** — a clause I had not produced. Eleven of those were re-testable rather than
product-limited. **Ten are now closed; one stays blocked.**

| Case | Clause that was open | Outcome |
|---|---|---|
| **C44909** | the *location's own* remit-to, as distinct from the shop's integrated-billing remit-to | **Closed, no write needed.** Heavy Duty's own **Remit To** is set to Staging Lethbridge - 4310, and the document prints exactly that. Integrated billing is ruled out — IBS is not connected on this org at all (`isConfigured: false`), so the block can only be resolving from the location setting |
| **C44918** | Customer PO / Authorizer / Approval Code each hiding when empty | **Closed.** On S2-32229 none of the three strings appears anywhere in the document — no label, no empty value area — while `Terms Net 7` still prints |
| **C44924** | a serial showing when the asset has no VIN | **Closed, and it produced a finding.** Created an asset holding `SN-ZZAUTOTEST-0042`, raised **S2-32270** on it through the UI, and the band prints `VIN / SERIAL  SN-ZZAUTOTEST-0042`. **Clause 4 is unreachable** — one field, not two. Candidate ticket prepared, not filed |
| **C44930** | 100+ lines showing three digits | **Closed.** S2-32231 renders 105 lines: exactly `01`…`105`, no gaps, lines 1–99 zero-padded to two digits, 100–105 at three |
| **C44931** | a line with neither description nor scope note | **Closed.** S2-31596 line `02` renders as line number and name only — no empty description row, no empty scope row |
| **C44939** | a work order with *no* declined lines | **Closed.** S2-32229 contains no `Declined Work` section and no `DECLINED` string |
| **C44942** | shop supplies shown as the amount alone | **Closed by a controlled A/B.** Setting off → `Shop supplies  $31.49`; setting back on → `Shop supplies (10.5% of labor)  $31.49` |
| **C44945** | no tax → no tax row | **Closed by a controlled A/B.** Location on `Exempt (0%)` → summary is Labor · Parts · Shop supplies · Subtotal · Total, **no tax row**. Restored to `GST (5%)` → `GST (5%)  $26.82` returns |
| **C44955** | disclaimer identical on every document that carries it | **Closed across twelve documents** rendered live — one disclaimer block each, no heading above it, identical 49-character string (same sha256) |
| **C44987** | the imported work order's own document | **Closed on this pass's capture.** ZZAUTOTEST-IMP-001 renders on the OLD template — `Bill To`, `Customer signature:`, plain table, `Software Powered by ShopView` — which is what the case requires |
| **C44913** | the full five-field order | **Still blocked, and provably so.** Two of the five cannot exist here: `Work Order` is absent from the build (**SV-9642**) and `Approval Code` needs IBS (**SV-9710**). The three that can appear do so in the right relative order with no colons |

## Two things worth knowing that came out of this

**The location tax picker has no "none".** Its six choices are `Exempt (0%)`, `GST (5%)`, `HST (13%)`,
`HST BC (12%)`, `Zero Rated (0%)`, `Zero Tax (0%)`. "No tax applies" is reached through a zero-rate
code, not by clearing the field — so C44945 clause 2 was tested with `Exempt (0%)`.

**SV-9680 reproduces on a brand-new record.** The asset created today has no mileage and no
engine-hours reading, and the band still prints `MILEAGE 0` / `ENG HRS 0`. That narrows the ticket:
the zero comes from the renderer, not from migrated data. Prepared as a comment on SV-9680, not posted.

## Writes: the API 500 and the way round it

`POST /api/work-orders/create`, `/api/vehicles/change` and `/api/customers/change` all return the
documented **create/change 500** in this session, while `/api/vehicles/create` and the `*/change`
*validators* work. Everything that needed a write was therefore done **through the UI** — the fallback
the playbook already prescribes. Nothing was left changed: the Heavy Duty location was toggled twice
and restored, verified field-by-field against the original form (`evidence-gap-closure/loc-restored-crop.png`).

## What the 16 remaining gaps are

Fifteen are states the product refuses to create — C44914 (Terms cannot be empty), C44947
(unconfigured payment code refused), C44949, C44950 (applied amount is capped), C44953 ($0.00 payment
rejected), C44958 (org Tax ID cannot be emptied), C44966 (`Refunded` unreachable), C44967, C44968
(part returns are part-sale only), C45184 (no US workplace), plus the four already ticketed as
blockers and the two failures with noted gaps. The sixteenth is C44913, blocked as above.
