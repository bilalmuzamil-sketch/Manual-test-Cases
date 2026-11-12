# Rule 140 genuineness gate — draft 07 (Inventory Value PDF fails after ~30 s) — 12 Nov 2026 ~06:10 UTC — RESULT: STOPPED, NO NEW TICKET
1. Latest source really says it — closed: test C715475 "Inventory Value … works as before the release"; production prints 1,439 and 2,856 parts.
2. Not accepted as built — closed (none found).
3. Not our setup / the QA SITE — **NOT CLOSED.** Every export that dies does so at ~31 s with a generic 500 ("An error occurred…"), whatever the report — the aging A/P Detail (1,784 rows, under its 2,000 limit) dies the same way; every export that finished took < 30 s; production allowed ~90 s. A 30-second server limit on the QA site would produce exactly this, and production has no such limit. Cannot be ruled out on the QA site alone (no other QA site up, staging not reachable).
4. Caused by this work — not closable while 3 is open.
5. Not a duplicate — **NOT CLOSED: SV-12539 (Open)** reports the same ~30-52 s failure for A/P PDFs.
=> No new ticket. Option for him: add the Inventory Value evidence to SV-12539 as a comment (no new defect), or hold until the release reaches staging/production where the time limit can be ruled out.
