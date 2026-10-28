# SENT 28 Oct 2026 to Chris Ward's question Doc as Q15 (with Q16 on clearing a picked canned line) — see README follow-up

Doc: "What/Why (Title and Description) – questions for Chris Ward" — https://docs.google.com/document/d/1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA/edit
Placed after question 14, under a new heading, in the Doc's own shape (What the page says / What the design says / Question).

---

Design vs Build discrepancy, 28 October 2026

15. The "Line Approved" tick box in the New Line window
What the build shows: on staging, the New Line window has a "Line Approved" tick box under Estimated Time and Tech Time, just above the Save buttons. It shows when the setting "Require Approval for New Lines" is on, and it was there before this change too.
What the page says: "Nothing else about the dialog changes … same fields in the same order" (Story 1, S1-R7).
What the design says: nothing. The New Line pictures, before and after, do not draw the tick box.
Question: should the "Line Approved" tick box stay in the New Line window as it is today?

---

QA internal (not for the Doc): tests that list the window's contents without it — C154710 (S1-04) and C839513 (design, New Line
header, fields and buttons). Evidence: probe 03 (newLine text), 06b screenshot, product code LineDialog.vue `label="Line Approved"`
present at f2d183d^1 (before the change) and f2d183d, shown when `!autoApproveLines`. The "SHOPCOACH LABOR GUIDE" link is not
asked about: it shows only once a title is typed with no canned line picked, a state neither test reaches.
