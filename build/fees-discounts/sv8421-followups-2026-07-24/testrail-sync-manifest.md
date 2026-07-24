# TestRail sync manifest — SV-8421 downstream follow-ups (2026-07-24)

**STATUS: NOT EXECUTED — awaiting explicit user authorization.**
No TestRail write has been made. Run 325 must not be touched. Only `update_case` on the two cases
below; NO add_case / delete_case / add_section / result writes.

## Cases to update (2 `update_case`)

| # | Internal | C-ID | TestRail link | Change | Driver + Done status | Spec anchor |
|---|---|---|---|---|---|---|
| 1 | FD-PROC-009 | C28527 | https://shopview.testrail.io/index.php?/cases/view/28527 | viu_status **VIU-Deviation -> VIU-Verified** (status/metadata only; no title/steps/expected/refs change) | **SV-8421** (Processing Fee base fix) — Done | S8-R5, §5-R4/R5 |
| 2 | FD-CALC-013 | C28580 | https://shopview.testrail.io/index.php?/cases/view/28580 | viu_status **VIU-Deviation -> VIU-Verified** (status/metadata only; no title/steps/expected/refs change) | **SV-8421** (Processing Fee base fix) — Done | §5-R4/R5 |

## Basis (live evidence 2026-07-24)
Adding a $100 TAXABLE whole-WO fee to a WO carrying a 3% "Processing fee on Grand Total" left the PF
at exactly $13.92 (= 3% x net$442 x(1+GST5%)=464.10) while tax grew $22.80->$27.80 — the PF base
EXCLUDES the whole-WO fee and its tax (SV-8421). FDBUG-2 (PF base wrongly including whole-WO
fees/discounts + tax), the reason both were VIU-Deviation, is RESOLVED. See FINDINGS.md +
`evidence/api_PFbase_after_100_taxable_fee.json`.

## NOT changed (documented for completeness)
- FD-CALC-015 (C28582), FD-QB-012 (C28555): already VIU-Verified — regression re-confirmed PASS, no write.
- FD-QB-014 (C28557): already VIU-Verified — warn dialog not re-triggered (contact precondition), no write.
- FD-CALC-017 (C28584), FD-QB-013 (C28556), FD-QB-015 (C28558): stay VIU-Blocked-Env (QuickBooks postings
  need a QB-connected company + human in QB), no write.
