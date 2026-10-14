# SV-10841 — Completion wizard asks about only one core when a part arrived in two deliveries

- Ticket: https://shopview.atlassian.net/browse/SV-10841 (TESTING QA, Medium, Product Area Work Orders, label QA_Validation_Required, no parent)
- QA branch: https://sv10841.qa.shopview.com · production BEFORE: https://app.shopview.com (Rule 86)
- Developer handoff: QA-Handoff-SV-10841 (PR #3573, FE only) — checklist sections 1–9 mirrored below
- QA lead answers (2026-10-14): **No recording** · **No technical section**

## Source of truth (Rule 66)
Description: *"The completion steps ask Ok / Not Ok for every core on the work order, one question per received core."*
Steps: part with core charge on a WO, ordered, received in two deliveries, complete the WO.
Dev comment 78631 adds: per-row billed amount (unit × qty, e.g. "2 × $25.00"), "+$X to invoice" total, vendor invoice number per row, special-order pending row priced for owed units only, and a re-check of the single-delivery qty-1 case.

## Variant matrix (written BEFORE testing — Rule 96/106)
Every row is driven on screen (the completion wizard) unless marked setup.

| # | Case | Source | Branch | Production |
|---|---|---|---|---|
| 1a | qty 3 core $25 received 1 + 2 on two vendor invoices → two rows, "0 / 2 resolved" | desc + handoff §1 | | |
| 1b | row amounts $25.00 and $50.00 with "2 × $25.00"; subtitles carry part #, line, each invoice number, different | handoff §1 | | |
| 1c | row1 OK → "no charge", row2 Not OK → "added to invoice", total "+$50.00", "2 / 2" | handoff §1 | | |
| 1d | finish → Lines tab: OK core Returned, Not OK core billed $50.00 | handoff §1 | | |
| 1e | swapped (row1 Not OK, row2 OK) → "+$25.00", $25 billed | handoff §1 | | |
| 1f | both Not OK → "+$75.00", $75 billed | handoff §1 | | |
| 2 | three deliveries 1+1+3 of a $10 core → 3 rows $10/$10/$30, all Not OK "+$50.00" | handoff §2 | | |
| 3 | two deliveries, one core resolved first → reopen, other core still listed | handoff §3 | | |
| 4a | qty 1, one delivery → "Core $25.00", no "×"; OK "no charge"; Not OK "+$25.00"; "1 / 1"; billed matches | handoff §4 / dev comment | | |
| 4b | qty 3, one delivery → one row "Core $75.00 · 3 × $25.00"; Not OK bills $75 | handoff §4 | | |
| 5 | special order qty 5 $3 core, received 1 + 2, 2 owed → inventory rows $3/$6 with invoice #; pending row $6; all Not OK "+$15.00"; billed matches | handoff §5 | | |
| 6 | inventory cored part not yet picked: mark OK before pick → kept after pick, not asked again, Returned | handoff §6 | | |
| 7 | Back to Resolve cores after deciding → each decision/subtitle/amount kept, nothing duplicated or missing | handoff §7 | | |
| 8 | OK / Not OK buttons' aria-label includes the subtitle with invoice #; no red console errors / duplicate-key warnings | handoff §8 | | |
| 9 | org setting auto-pick inventory parts ON → cored inventory part listed once, right amount, resolves | handoff §9 | | |
| R | regression: WO with no cored parts — wizard as before | handoff "not impacted" | | |

## Results
(filled in as observed)
