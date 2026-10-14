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
| 1a | qty 3 core $25 received 1 + 2 on two vendor invoices → two rows, "0 / 2 resolved" | desc + handoff §1 | PASS — S10841-17580 (ZZ10841-S1-12343, qty 3, $25 core, received 1 on ZZ10841-A1 + 2 on ZZ10841-A2): "INVENTORY CORES · 2", "0 / 2 resolved" | FAIL (before) — S2-976: one row only, "0 / 1 resolved" |
| 1b | row amounts $25.00 and $50.00 with "2 × $25.00"; subtitles carry part #, line, each invoice number, different | handoff §1 | PASS — "Core $25.00" (…· ZZ10841-A1) and "Core $50.00" (…· ZZ10841-A2 · 2 × $25.00); invoice numbers differ | FAIL (before) — "Core $25.00", no invoice #, no × |
| 1c | row1 OK → "no charge", row2 Not OK → "added to invoice", total "+$50.00", "2 / 2" | handoff §1 | PASS — notes "no charge" / "added to invoice", "+$50.00 to invoice", "2 / 2 resolved" | not run |
| 1d | finish → Lines tab: OK core Returned, Not OK core billed $50.00 | handoff §1 | PASS — handle-cores sent both part ids; Lines: qty-1 core "Returned", qty-2 core $25.00 × 2 = $50; status Review | not run |
| 1e | swapped (row1 Not OK, row2 OK) → "+$25.00", $25 billed | handoff §1 | PASS — S10841-17581: "+$25.00"; billed $25 on the qty-1 core, qty-2 core Returned | not run |
| 1f | both Not OK → "+$75.00", $75 billed | handoff §1 | PASS — S10841-17582: "+$75.00"; billed $50 + $25 | not run |
| 2 | three deliveries 1+1+3 of a $10 core → 3 rows $10/$10/$30, all Not OK "+$50.00" | handoff §2 | PASS — S10841-17583 (qty 5, $10 core, ZZ10841-D1/D2/D3 = 1+1+3): 3 rows $10/$10/"3 × $10.00" $30, "+$50.00"; billed $10+$10+$30 | not run |
| 3 | two deliveries, one core resolved first → reopen, other core still listed | handoff §3 | PASS, both paths — (a) S10841-17584: Ok on the qty-1 core from the Lines tab → wizard lists only the other core ("Resolve cores (1)", $50.00), Lines shows the first Returned. (b) S10841-17593: K1 marked OK then "Continue Without Resolving" → Mark Reviewed reopens Resolve cores with BOTH K1 $25.00 and K2 $50.00, "0 / 2 resolved" (see observation O1) | not run |
| 4a | qty 1, one delivery → "Core $25.00", no "×"; OK "no charge"; Not OK "+$25.00"; "1 / 1"; billed matches | handoff §4 / dev comment | PASS — S10841-17585 (qty 1): one row "Core $25.00", no "×"; OK "no charge" (no total), Not OK "+$25.00", "1 / 1 resolved"; billed $25 | not run |
| 4b | qty 3, one delivery → one row "Core $75.00 · 3 × $25.00"; Not OK bills $75 | handoff §4 | PASS — S10841-17586 (qty 3, one delivery G1): one row "… · ZZ10841-G1 · 3 × $25.00", "Core $75.00"; Not OK "+$75.00"; billed $25 × 3 = $75 | not run |
| 5 | special order qty 5 $3 core, received 1 + 2, 2 owed → inventory rows $3/$6 with invoice #; pending row $6; all Not OK "+$15.00"; billed matches | handoff §5 | PASS — S10841-17587 (special order qty 5, $3 core, H1=1, H2=2, 2 owed): Inventory cores · 2 ($3.00 H1, $6.00 H2 "2 × $3.00"), Special order cores · 1 "2 × $3.00" $6.00; all Not OK "+$15.00"; Save Core Decisions → Receive parts step; after receiving the 2 owed on ZZ10841-H3 the WO completed to Review with no new prompt; billed $6 + $3 + $6 = $15 | not run |
| 6 | inventory cored part not yet picked: mark OK before pick → kept after pick, not asked again, Returned | handoff §6 | PASS — P550848 given a $7 core (inventory/parts/change). S10841-17588/17589: Resolve cores opened before Pick parts, OK → "no charge", Pick All (`pick-inventory-parts`) → row now keyed by the new core part id, still OK/"no charge"/"1 / 1"; finish sent `handle-cores {partId:<new core part>, isCoreOk:true}`; Lines "Returned", Review | not run |
| 7 | Back to Resolve cores after deciding → each decision/subtitle/amount kept, nothing duplicated or missing | handoff §7 | PASS — S10841-17587: Save Core Decisions → Receive parts → "Resolve cores" step button → all three cores listed once each with subtitle, amount and "Not OK · keep + charge" | not run |
| 8 | OK / Not OK buttons' aria-label includes the subtitle with invoice #; no red console errors / duplicate-key warnings | handoff §8 | PASS — every OK/Not OK aria-label reads "Mark Core for … (<part #> · Line 1 · <invoice #>[ · n × $x]) returned|kept"; 0 console errors and 0 warnings on every wizard run (S1–S11, R) | not run |
| 9 | org setting auto-pick inventory parts ON → cored inventory part listed once, right amount, resolves | handoff §9 | PASS — autoPickInventoryParts set true (only that key changed), S10841-17590: part auto-picked, one row "P550848 · Line 1 · 2 × $7.00" Core $14.00, Not OK "+$14.00", billed $7 × 2 = $14, Review; setting restored to false | not run |
| R | regression: WO with no cored parts — wizard as before | handoff "not impacted" | PASS — S10841-17592 (uncored vendor part, qty 2): wizard shows only Tech stories, no Resolve cores step, no handle-cores call; simple-complete → Review | not run |

## Results
(filled in as observed)

## Observation O1 (same on production — not introduced by this ticket)
Marking one core OK and then clicking **Continue Without Resolving** completes the line (`lines/bulk-status complete`) without saving that decision: both cores stay open (Ok / Not Ok on the Lines tab) and the work order goes to **Review**. Production S2-977 (customer ZZAUTOTEST SV10841 PR2, received 1 on ZZ10841-P5 + 2 on ZZ10841-P6) does exactly the same. Production also confirmed the bug a second time: its wizard listed one core ("0 / 1 resolved") for this two-delivery part. Not raised: the button says "Without Resolving" and the behaviour matches production.

## Verdict
PASSED — all 16 matrix cells pass on v26.40.17-c177759 (plus case 3's second path). No recording, no technical section (QA lead's answers).

## Pre-post gate (2026-10-14 ~09:30 UTC)
- Branch marker re-read: v26.40.17-c177759, last-modified Wed 14 Oct 2026 07:16:54 GMT — unchanged from the start of the pass. FE-only PR (handoff: BE files 0).
- Ticket re-read live: TESTING QA, Medium, last comments 78631 / 78634 (Dipesh) — nothing new.
- Reproduction walked live on S10841-17594 (customer ZZAUTOTEST SV10841 DEMO 27744): Complete → Tech stories → Resolve cores showed ZZ10841-DEMO-1 Core $25.00 and ZZ10841-DEMO-2 · 2 × $25.00 Core $50.00, "0 / 2 resolved"; cancelled, so the work order is left ready.
- Voice scan: no AI / model / attribution text. No technical section. No recording.
- Posted comment **78644** (2026-10-14T04:34:36-0500). Read back in ADF: first line "OVERALL QA STATUS: PASSED", 7 media all `type:file` in the order sent, 18 table rows (header + 17).

## Learning check
- `pgrep -f "<pattern>"` inside an `until` loop matches the loop's own shell (the pattern is in its command line), so the loop never ends — wait on a file marker instead, or match with a pattern the shell line cannot contain. Added to LESSONS-INDEX.
- Recipes added to playbook §AP: wizard ids (`button_resolve_cores_continue` "Save Core Decisions", step pills jump ahead, production has no row ids), `inventory/parts/change` bins use `binLocationId`, and a 1000-px-high viewport cuts off a third core row.
