# Outside-in gap hunt — Printer Friendly Work Orders
1. **Pricing exclusion** — asserted on line items (S3-R3), summary (S4-R2), and via chrome-hide
   (S5-R1). Triple-covered; this is the feature's hard rule.
2. **Enable/disable timing** — the subtle S1-E1 (disabled until real data, not skeleton) is its own
   case (PFWO-MENU-08).
3. **All statuses + both platforms** — S1-R5 (10 statuses) and S1-R6 (desktop/mobile) each covered.
4. **Empty/placeholder branches** — no customer (S2-N1), no vehicle (S2-N2), no lines (S3-N1/S4-N1),
   no parts (S3-N2), no tech story (S3-R8/S3-N3), no techs (S3-N4). All covered.
5. **Multi-page behaviour** — page flow without mid-line split (S3-E1), per-page footer WO number
   (S4-R4), long tech story wrap (S3-E2). Covered.
6. **Theme/printer robustness** — dark-mode → black-on-white (S5-R2), plain-text badges for B&W
   printers (S5-R5), landscape override (S5-E1). Covered.
7. **Audit edge** — cancel-still-logs (S6-N1), multiple prints (S6-E1). Covered.
8. **Open items:** PO/owner unknown (PO-PFWO-1); no design to check appearance against (PO-PFWO-2).
No uncovered functional gap found beyond those two.
