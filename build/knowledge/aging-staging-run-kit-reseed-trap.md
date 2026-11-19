---
title: Reseeding the A/R A/P 92-test staging run kit on a new day (staging keeps the old records) - use seed.py --fresh
keywords: seed, reseed, fresh, staging, run.js, run card, 92 tests, anchor, ledger, tag, generation, GARA, fixed document numbers, already invoice with number, already return with credit memo number, vendor reused, duplicate customer name, release morning, fallback, smoke
learned: 2026-11-19
evidence: build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/tools/seed.py; build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/tools/logs/reseed-2026-11-19-fresh.log; build/ar-ap-report-sorting/v1-regression/STAGING-RUN-CARD.md; build/ar-ap-report-sorting/release-audit-2026-11-18/AUDIT-STATUS.md
---
- THE TRAP (19 Nov, M22): staging is not wiped between seeds. A reseed that only "moved the ledger aside" hit three collisions:
  bills refused ("There is already invoice with number: ZZT-P61-BILL_LATE"), vendor credits refused ("There is already return with
  credit memo number"), and the seeder silently REUSED the 12 Nov vendors (found by name + e-mail), so new bills would sit beside old
  ones. New customers would have been created with the SAME names as the old ones, so a test picking a customer by name sees two.
- THE FIX (19 Nov): `python3 seed.py staging --fresh`. It keeps the old ledger as `seeded-staging-anchor-<A date>.json` (or just
  drops the current file when that copy already exists byte for byte) and starts a new ledger with a TAG made from the anchor date:
  'G' + 3 letters (19 Nov = GARA, 20 Nov = GARB). The tag goes on every customer/vendor name, bill and credit number, e-mail, VIN and
  plate. Letters only, so the cases' name patterns ([A-Za-z ]+) still match; no I/O/Q, so it is valid inside a VIN.
- The cases read names from the ledger (cases_qa.js CUST/VEND), so they follow the tag; document numbers were already read from it (num()).
  A ledger from before 19 Nov has no tag and behaves exactly as before.
- A full seed takes about 30 minutes (vendors and bills are slow). If it stops, run `python3 seed.py staging` WITHOUT --fresh to resume.
  Never wrap it in a 15-minute timeout (19 Nov: my own `timeout 900` cut it at 59 of 85).
- Expected end state: done 83 of 85. `doc:R76:pay` and `doc:P27:pay` are overpayments the app refuses ("Transaction cannot be overpaid") - same on every seed.
- run.js still refuses a seed from another day (correct: case dates move with the anchor). The STOP message now names the --fresh command.
- Staging refuses a bill (vendor invoice) number over 21 characters, so tagged bill numbers are compact (ZZTARA-P52-BILL_LATE) and seed.py checks every planned number before its first write.
- PROVED 19 Nov: reseed 83/85, board 47/47, full screen run 87 of 90 verdicts the same as 12 Nov (the 3 others need the tech sign-in, a separate permission). Older seeds on staging changed no verdict.
- Re-run on another day with RUN_DIR=../rerun-staging-<date> so the earlier run's verdicts and pictures stay.
- PDF limit is 1,000 rows since PRD v14 (16 Nov, SV-12539); the whole-company A/R Detail is over it (1,969 lines on 19 Nov), so a test that needs its PDF narrows to one customer first (cases_qa.js arDetailUnderPdfLimit).
- Fallback that worked in 10 minutes on release morning: release-audit-2026-11-18/scripts/smoke_screens.js + sort_in_group.js.
