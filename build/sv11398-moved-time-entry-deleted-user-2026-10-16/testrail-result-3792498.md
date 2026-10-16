**Tested on staging, build v26.40.19-edc8195, on 16 October 2026 (fresh work orders).**

* **Result: Passed.** When a time entry is moved to another line, the receiving line lists only the technician whose time was moved. The "Deleted user" entry seen on 15 October no longer appears, and the line the time came from goes back to Unassigned.
* This is the fix for SV-11398 (duplicate of SV-11087). The ticket's QA comment: https://shopview.atlassian.net/browse/SV-11398?focusedCommentId=78897

---

**What was checked (all Passed):**

1. The test's steps on a fresh work order, S2-36626: Tech ShopView clocked in and out on line 1, Admin moved the entry to line 2 (work order menu → Timesheets → pencil → Line → Save) and reloaded. Line 2 lists only Tech ShopView; line 1 shows Unassigned.
2. The same steps on S2-36625 (Tech ShopView) and S2-36628 (Admin ShopView): same result.
3. Admin ShopView's own entry moved from line 1 to line 2 on S2-36623: line 2 lists only Admin ShopView.
4. The entry moved back from line 2 to line 1: both lines exactly as before, no extra rows.
5. The technician already had time on line 2, then line 1's entry was moved there: line 2 keeps one row with both times (0.05 h + 0.02 h = 0.07 h).
6. The move made from Reports → Timesheet Activities instead of the work order (S2-36625): same result.

The old example S2-35973 still shows "Deleted user": that entry was made on 15 October, before the fix, and the developer noted on SV-11087 that rows made before the fix are kept.

---

**How to see it:** on staging, Admin, open work order S2-36629 (two approved lines, nobody on them). On line 1 click Start in the Labor row, wait a minute, click Stop, type a note and click Clock Out. Open the menu at the top right of the tabs → Timesheets (1) → pencil on your row → Line 2 → Save. Reload the Lines tab: line 2 lists only your name and there is no "Deleted user".

**Attached:** before-vs-after picture, the steps, the other checks, and a screen recording of the test on S2-36626.