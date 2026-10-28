# SV-11744 — reversing a credit-memo payment over several invoices (QA, 28 Oct 2026)

**Verdict: PASSED** (one green comment, Rule 115(d)). Mode: API way (Rule 113). No recording, no technical section (QA lead, 28 Oct).

## Sources read
- Ticket SV-11744 (TESTING QA, label `bug-report`, no QA assignee, no `accounting` label) — description + comments 79451, 79452, 79453, 79502, 79511, 79531, 79595 (Nemanja's QA checklist 1–3, known mismatches, not-impacted list).
- PR ShopView/shopview#3967 (open, base `main`, head `deedf48`, backend only, 4 files). Head unchanged since 27 Oct 14:42Z, before testing.
- Pre-fix handler read at production commit `537378f` (`ReversePaymentCommandHandler.php`, Step 3.5): credit is put back invoice by invoice in the order `findBy()` returns the customer transactions (no ORDER BY → primary-key order of the binary UUID), capped by `amount − balance`. So the old bug only shows when the part-paid invoice sorts first.

## Builds
- Branch sv11744: `v26.43.2-b517d96`, last-modified Tue 27 Oct 2026 14:42:17 GMT, etag `85fff61c…` (read at start and before posting — unchanged).
- Production: `v26.43.2-537378f`, last-modified 27 Oct 09:11:44 GMT.

## Branch results (customer → seed file /tmp/s11744/seed-branch-<tag>.json; screenshots /tmp/s11744/branch-<tag>/, copied to ev/)
| Check | Data | Result |
|---|---|---|
| Checklist 1 | S4: S11744-17586 $347.96 (txn 01ee9057, sorts first) cash $100; credit CM11744-4189 $400 used $300.16 over 17586 rest + 17587 $52.20; reversed payment daf378d0 | 17586 $247.96 Partially Paid; 17587 $52.20 Unpaid; memo −$400 Unapplied; WOs Invoiced; no $0 Partially Paid |
| New Payment | S4, Open only, both ticked | dialog opens with $247.96 / $52.20, no refusal |
| Checklist 2 | S5: 17588 $347.96 + 17589 $52.20; cash $100.16 + CM11744-4190 $300; payment 606eec95 reversed | both Unpaid full; memo −$300 Unapplied; payment gone; balance $100.16 (= 400.16 − 300) |
| Extra: memo partly used | S5: credit-only $152.36 of $300 (17588 $100.16, 17589 $52.20); payment cdd4e530 reversed | both Unpaid full; memo −$300 Unapplied |
| Checklist 3a cash only | S5: cash $347.96 on 17588; payment a861050f reversed | 17588 $347.96 Unpaid; WO Invoiced |
| Checklist 3b deposit | S5: open WO S11744-17590, deposits DEP-4703 $40 + DEP-4704 $400; invoiced $52.20 → auto-applied, overflow DEP-4705 $387.80 Held; one payment DEP-4705 + $12.36 cash over 17588/17589; payment cc94606b reversed | DEP-4705 back to $387.80 Held, $0 applied; 17588/17589 Unpaid full; WOs Invoiced |
| Extra: reported 3-invoice shape | S6: 17591 $347.96 (txn e97c2e21), 17592 $52.20 (c4869c5a), 17593 $260.98 (6e87128c, sorts first). Cash $100 on 17591; credit CM11744-4191 $400.16 for 17591 $247.96 + 17592 $52.20 + 17593 $100; cash $160.98 on 17593; credit payment 37bf7a57 reversed | 17593 $100.00 Partially Paid; 17592 $52.20 Unpaid; 17591 $247.96 Partially Paid; memo −$400.16 Unapplied; WOs Invoiced; New Payment opens |

Under the old code, S4 and S6 are both shapes that break (the part-paid invoice sorts first and its paid amount ≥ the credit share handed to it), so the correct branch results prove the fix, not luck.

## Production BEFORE (org 72b2cc90…, Trucks Hill 2)
- P1: S2-1765 $149.95 (txn 4575ea58) cash $50, CM2-4401 $217.95 over both; S2-1766 $118 (txn 3d014b32 sorts first). Reversed → **correct** result (S2-1765 $99.95, S2-1766 $118). Lucky order — recorded honestly.
- P2/P3/P5: the $118 invoice sorted first again. P4: S2-1771 $149.95 (txn 73b5bbff) sorts first.
- **P4 (reproduced):** cash $120 on S2-1771; CM2-4402 $147.95 over S2-1771 rest $29.95 + S2-1772 $118; reversed payment 9de0dbcc → S2-1771 owes **$147.95** (should be $29.95), S2-1772 **$0.00 Partially Paid**; Open only + both ticked → New Payment greyed out, tooltip *"Payments cannot be made on a Paid invoice."* (ev: prod-P4/newpay-result.png).
- How the failing example was built: invoices by API set-up (same chain a user does on screen: complete WO → invoice), credit memo by API (a user does it with **Issue Credit** on the Invoices tab), cash and credit payments on screen (New Payment), reversal on screen (Payments → bin → Reverse). All steps exist on screens (Rule 106).

## Side observations (Rule 93)
- **"-$0.00" balance** on the branch S6 Invoices tab after the reversal. Server figures are clean (100, 52.2, 247.96, −400.16; totalDueAmount 0); the screen adds them in floating point (100+52.2+247.96−400.16 ≈ −5.7e−14). Front-end only, same code on production → **not caused by this ticket**. Jira search found no ticket. Bucket (d): to ask the QA lead, with steps.
- **Credit-only payment:** with a credit memo covering the whole amount, the Payment Method box is greyed out and Make Payment stays disabled until a payment amount is retyped. Same on production (P5, CM2-4403). **Already tracked: SV-11854** (Board Backlog, 27 Oct). Bucket (b).
- **"Still covered in full by other payments" branch** (PR summary): not reachable on screen — once an invoice is Paid the screen refuses another payment on it, so other payments can't fully cover an invoice that also took credit. Not in the QA checklist. Mentioned to the QA lead.

## Not tested
- IBS batch reversal and pre-deploy credit payments — developer lists both as known mismatches / out of scope.

## Pre-post gate (28 Oct 2026, ~08:05 UTC) and post
- Branch marker re-read: v26.43.2-b517d96 (unchanged); PR head deedf48 unchanged since 27 Oct 14:42Z (back-end-only PR, so the head was checked too, not just the front-end marker).
- Ticket re-read: TESTING QA, assignee Nemanja Djuric, 7 comments, newest 79595 (no new input).
- Text: no AI fingerprint, no technical section (QA lead said no), every embed has width and height; full pass → one green comment.
- Posted **comment 79638**; attachments 63093–63097. Read back in ADF: first panel PASSED, 5 media all `file` in order (1140x761, 902x405, 1140x668, 1140x844, 1140x402), table 11 rows (header + 10 checks).
- Learning check: one new fact recorded — the pre-fix reversal walked invoices in internal-ID order, so a production "before" for an order-dependent bug can come out right by chance; re-seed until the failing order appears and say so (LESSONS-INDEX row).
