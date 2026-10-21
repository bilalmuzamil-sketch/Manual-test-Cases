# SV-11414 — Net-N due date one day early across a DST change
Result: PASSED. Comment 79161 posted 21 Oct 2026 (no recording, no technical section — QA lead's instruction for this batch).

- Branch sv11414, build v26.40.19-36196fa (last-mod 20 Oct 06:12:55 GMT), Staging Heavy Duty - 9919 (America/Edmonton). Browser clock UTC and America/Edmonton.
- Matrix (all PASSED): Net 30 S2-17113 10/09→Nov 8, 10/02→Nov 1, 10/01→Oct 31, 10/21(today)→Nov 20, 02/20/2027→Mar 22, 03/10→Apr 9, 03/15→Apr 14;
  Net 60 S2-16673 10/09→Dec 8, 09/02→Nov 1, 01/20/2027→Mar 21, 10/21→Dec 20.
- Create Invoice at 10/09/2026 on S2-17113: POST /api/invoices/create due_date 2026-11-08T19:00Z (noon MST); after reload Oct 9 / Nov 8. Branch now sends issueDate as local noon (18:00Z), prod sends local midnight.
- Production before (app.shopview.com): no DST location exists, so Trucks Hill 2 (b617914c…) was set Africa/Accra → America/Edmonton,
  fresh login, WO S2-488 (aqeel transport 56, Net 30): 10/09→Nov 7 (BUG), 10/02→Nov 1, 10/01→Oct 31, 02/20/2027→Mar 22, 03/10→Apr 9.
  Timezone restored to Africa/Accra; all 24 workplace fields compared to the original snapshot, 0 differ.
  First prod attempt discarded: the SPA still held the old timezone (even 10/01 shifted) — technique artifact, redone with a fresh login.
- Data left on branch: S2-17113 is now Invoiced (no cleanup on QA branches).
