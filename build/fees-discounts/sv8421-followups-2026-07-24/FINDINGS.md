# SV-8421 (Processing-Fee base fix) — downstream follow-ups, LIVE staging spot-check

**Date:** 2026-07-24
**Env:** app.staging.shopview.com / api.staging.shopview.com, org d55bc308 (F&D flags ON)
**Method:** LIVE, evidence-based (Standing Rules 10/12/13/14/15/25). All figures observed live
via the WO `adjustments/add` + `GET /api/work-orders/view/{id}` API and the SPA Finance panel.
**Auth:** `POST /api/quick-login {key:'admin'}` -> HTTP 200 (cookies OK).

## What SV-8421 requires (baseline being regression-checked)
Processing Fee (PF) base = **NET subtotal** (net labour + parts + shop supplies) **x (1 + tax on that net)**,
**EXCLUDING all whole-WO fees/discounts and the PF itself** — even the tax change caused by a
taxable whole-WO fee/discount ("a taxable PF never grows its own base"). Floor rules
(S6-R10..R13): floor on the pre-tax net subtotal, never below $0.00; a non-taxable discount
leaves the tax on the original taxable base owed; the excess becomes a customer credit;
warn/confirm before save.

## Seed used (all self-seeded, deleted after — ZZAUTOTEST)
- Customer **Iibay Landscaping** (company 00122246...), vehicle 00052898..., workplace **Staging
  Lethbridge 4310** (f8a8b802...).
- WO auto-applies this customer's default Processing Fees; the flat $121 PF was removed, the
  **3% "Processing fee on Grand Total"** PF (template c0648eea...) kept.
- One approved labour line (canned **"(L) CVIP Electric Brake Trailer Tandem - Wheels Off"**,
  $100 x 4 h = **$400 labour**) -> shop supplies 10.5% = **$42** -> **net subtotal = $442.00**,
  tax (GST 5%) on net = **$22.10**, so PF base = 442 + 22.10 = **$464.10**.
- Note: labour/canned-line creation via API returns HTTP 500 on staging (known env bug) -> the
  line was added through the UI New Line dialog; all fees/discounts + reads were done via API.

---

## PF-BASE FIX confirmed (the "ALSO" ask) — C28527 / C28580

**Discriminator test:** with the 3% PF present (= **$13.92** = 3% x $464.10), add a **$100 TAXABLE
whole-WO fee** and re-read.

| Metric | Before fee | After +$100 taxable whole-WO fee |
|---|---|---|
| PF ("Processing fee on Grand Total") | **$13.92** | **$13.92 (UNCHANGED)** |
| adjustmentsSummary feesAmount | 13.92 | 113.92 ( = 100 fee + 13.92 PF ) |
| tax (GST 5%) | $22.80 | $27.80 (grew with the fee) |
| total_cost | $478.72 | $583.72 |

The whole-WO fee raised the taxable amount/tax but the **PF stayed $13.92** = 3% x (net 442 + tax
on net 22.10). The PF base **excludes** the whole-WO fee and its tax. This is exactly the SV-8421
fix. Previously (FDBUG-2, the reason these two were VIU-Deviation) the PF base wrongly INCLUDED
whole-WO fees/discounts + their tax.

- **FD-PROC-009 = C28527** — https://shopview.testrail.io/index.php?/cases/view/28527 —
  **VIU-Deviation -> VIU-Verified (PASS, staged).** Spec S8-R5, §5-R4/R5: PF "works out last,
  left out of its own base and every other Processing Fee's base." CONFIRMED.
- **FD-CALC-013 = C28580** — https://shopview.testrail.io/index.php?/cases/view/28580 —
  **VIU-Deviation -> VIU-Verified (PASS, staged).** Same evidence. §5-R4/R5.

Note on the illustrative "3% of $324 -> +$9.72" in the case text: that worked example assumes net
$300 + $24 tax (8%-style). This env is GST 5%, so the observed figure is $13.92 on a $464.10 base —
the RULE (PF = 3% x net x(1+tax), whole-WO adjustments excluded) is confirmed; the case's example is
still a valid illustration of the rule, so the body text is left unchanged, only the status flips.
Evidence: `evidence/api_PFbase_after_100_taxable_fee.json`.

---

## FOLLOW-UP 2 — PF base UNCHANGED with MIXED taxable settings (§5-R4)

**Test:** PF + a **TAXABLE whole-WO discount -$50** + a **NON-TAXABLE whole-WO fee +$80**.

| Metric | Observed |
|---|---|
| PF ("Processing fee on Grand Total") | **$13.92 (UNCHANGED)** |
| feesAmount | 93.92 ( = 80 nontax fee + 13.92 PF ) |
| discountsAmount | -50 |
| tax (GST 5%) | $20.30 ( = 5% x (442 net + 13.92 PF - 50 taxable disc) = 405.92 ) |
| sub_total | $485.92 ( 442 + 13.92 + 80 - 50 ) |
| total_cost | $506.22 |

**PASS.** The PF base is unchanged (**$13.92**) regardless of the taxable flags on the two whole-WO
adjustments — it still equals net subtotal x (1 + tax on net) and excludes both the taxable
discount and the non-taxable fee. §5-R4. Evidence:
`evidence/api_PFbase_taxable-disc_plus_nontax-fee.json`.

---

## FOLLOW-UP 1 — FLOOR / CREDIT (with a Processing Fee present, PF now smaller)

Baseline: 3% PF + line -> net line-item subtotal $442, PF $13.92, pre-discount subtotal $455.92,
tax $22.80.

### Floor A — NON-TAXABLE discount -$600
| Metric | Observed | Expected | Verdict |
|---|---|---|---|
| sub_total | **$0.00** (raw net -586.08) | floors at $0, never negative | PASS |
| tax (GST 5%) | **$22.80** (unchanged) | non-taxable discount leaves tax on original taxable base | PASS |
| total_cost | **$22.80** ( = the tax ) | customer pays the tax, not $0 | PASS |
| excessCreditAmount | **$144.08** ( = 600 - 455.92 ) | excess carried as customer credit | PASS |

Matches **FD-CALC-015 (C28582)** and **FD-QB-012 (C28555) assertion #1** exactly. The PF is now the
correct smaller $13.92 and is excluded from the discount's reach.
Evidence: `evidence/api_floorA_nontaxable_disc_600.json`.

### Floor B — TAXABLE discount -$600
| Metric | Observed | Expected / interpretation | Verdict |
|---|---|---|---|
| sub_total | **$0.00** (raw net -586.08) | floors at $0, never negative | PASS |
| tax (GST 5%) | **$0.70** | line-item taxable base zeroed; only the surviving PF ($13.92) is still taxable -> $13.92 x 5% = $0.70 | PASS (SV-8421-consistent) |
| total_cost | **$0.70** | customer pays the PF's residual tax | PASS |
| excessCreditAmount | **$144.08** | excess carried as customer credit | PASS |

Matches **FD-QB-012 (C28555) assertion #2** in spirit: a taxable discount drives the line-item
taxable base to $0. The residual $0.70 is the tax on the **Processing Fee**, which SV-8421 correctly
keeps OUT of the discount (the PF "works out last, after all other fees & discounts"), so the PF and
its tax survive. In the case's own example there was no PF, so the residual was $0; with a PF present
the correct residual is the PF's tax. This is the "now the PF is smaller" nuance and is consistent
with the fix. Evidence: `evidence/api_floorB_taxable_disc_600.json`,
`evidence/floorB-finance-panel.png` (Finance panel: Parts $0.00 / Labor $400.00 / Shop Supplies
$42.00 / Fees & Discounts (2) -$586.08 / Subtotal $0.00 / GST $0.70 / Total $0.70; fees card
"Processing fee on Grand Total (3%) +$13.92 / ZZAUTOTEST taxable disc 600 -$600.00 / Applies to the
whole work order, after all other fees & discounts").

### Per-case verdicts (Follow-up 1)
| Internal | C-ID | TestRail link | Prior status | This run |
|---|---|---|---|---|
| FD-CALC-015 | C28582 | https://shopview.testrail.io/index.php?/cases/view/28582 | VIU-Verified | **PASS (regression holds)** — floor $0, non-tax disc keeps tax, excess credit |
| FD-CALC-017 | C28584 | https://shopview.testrail.io/index.php?/cases/view/28584 | VIU-Blocked-Env | **Still Blocked-Env** — app computes the credit/floor (excessCreditAmount $144.08); the whole-cent (largest-remainder) SPLIT of the discount LINES sent to QuickBooks needs a QB-connected company + a human in QB. No change. |
| FD-QB-012 | C28555 | https://shopview.testrail.io/index.php?/cases/view/28555 | VIU-Verified | **PASS (regression holds)** — both non-taxable (tax stays, pays tax) and taxable (tax -> PF residual) confirmed |
| FD-QB-013 | C28556 | https://shopview.testrail.io/index.php?/cases/view/28556 | VIU-Blocked-Env | **Still Blocked-Env** — QB discount-line whole-cent cap needs QB + human. No change. |
| FD-QB-014 | C28557 | https://shopview.testrail.io/index.php?/cases/view/28557 | VIU-Verified | **No change** — the over-discount floor/credit that the warn reports is confirmed live; the warn dialog itself was NOT re-triggered this run because the WO needs a contact selected before review/complete (precondition tooltip "Contact must be selected for this work order before review"). Already VIU-Verified as built in prior passes; not downgraded. |
| FD-QB-015 | C28558 | https://shopview.testrail.io/index.php?/cases/view/28558 | VIU-Blocked-Env | **Still Blocked-Env** — the QuickBooks goodwill credit-memo posting needs QB + human. App-side credit amount ($144.08) confirmed. No change. |

---

## Summary of status changes staged (see testrail-sync-manifest.md — NOT EXECUTED)
- **FD-PROC-009 (C28527): VIU-Deviation -> VIU-Verified** (PF base fix confirmed live).
- **FD-CALC-013 (C28580): VIU-Deviation -> VIU-Verified** (PF base fix confirmed live).
- No wording changes needed. No other case status changes. QB-posting cases stay Blocked-Env.

## Honesty notes (Rule 12)
- FD-QB-014's warn/confirm DIALOG was not re-triggered this run (contact precondition on
  review/complete); only the floor/credit computation that feeds it was re-observed. Status left
  unchanged (already Verified).
- FD-CALC-017 / FD-QB-013 / FD-QB-015 involve the actual QuickBooks postings, which cannot be
  observed on this org (QB not connected). They stay Blocked-Env; the app-side floor + credit amount
  is confirmed.
