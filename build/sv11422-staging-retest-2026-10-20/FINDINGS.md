# SV-11422 — Tech View first Tab, row hidden under the sticky heading (staging re-check, 20 Oct 2026)

Build `v26.40.20-9c75418`, Admin, 1440x900, dpr 2. PRD v68 S11-R1 (same text as v66). Chris 79047: re-check only the
S2-16688 case once Slavcho's fix is in.

## Results (`walkC.mjs`, Q=<search>; data `ev/walkC-*.json`)
| Search | Spacing | First Tab | Row after Tab | Covered? |
|---|---|---|---|---|
| S2-16688 (Brandi Smith pinned on the Admin account, so her group is 2nd) | C / R / Comf | S2-16688, ring 2px blue | y 336 / 364 / 404, no scroll needed | no |
| S2-16688 (pin removed for the test, restored after) | C / R / Comf | S2-16688, ring | scroll 1512 / 1932 / 2520; row 244–280 / 252–300 / 264–328 | no (elementFromPoint top/mid/bottom = row) |
| S2-35560 (ZB Ben Bravo) | C / R / Comf | ring | scroll 17820–19816; row just below heading | no |
| S2-37560 (AZ AA ZZAUTOTEST C368159) | C / R / Comf | ring | scroll 26460–28456 | no |
Board View (`z22.mjs`, 2 loads each, pinned and unpinned): card S2-16688 focused, ring, fully on screen (x 333 pinned / x 1149 unpinned after sideways scroll); Unassigned header never focused.
Checks 3–9 of 79031 were not re-run (Chris asked for this case only); stated in the comment.

## Writes
- Jira: **79031 updated in place** to OVERALL QA STATUS: PASSED, dated notes (20 Oct 08:57 CDT) at the panel, summary, re-check scope line, check 10 (now PASSED) and the "remaining issue is fixed" section with the new exhibit `sv11422-01-first-tab-before-after.png`. Read back: panel PASSED, 11 table rows, 3 images, 5 steps.
- TestRail run 498 test 4054408 (case 682421): **result 530472 Passed** + attachment 1000035840 (the exhibit). Results 1549 → 1550, 0 missing, 0 changed by id (`testrail/run498-results-*.json`). Test status 5 → 1.
- Admin prefs: saved full, Brandi Smith unpinned only during two runs, restored byte-identical (`restore 200 identical true` both times). Location restored to what it was (QB Location at the time).
- Not touched: C614719 / test 4007027 (QA lead 19 Oct: "Leave it as is").

## Correction (QA lead, 20 Oct): old comment restored, new comment posted
- 79031 restored via v2 PUT to the exact pre-edit text saved in `comment-79031-live.txt` (5846 chars, byte-identical on read-back, its 2 original images).
- New comment **79136** (PASSED): today's checks; S2-16688 re-run on the current build v26.40.20-0509710 (Brandi unpinned, row 244–280 / 252–300 / 264–328, scroll 1728 / 2208 / 2880, ring, nothing covering it; Board card x 1149 with ring, 2 loads). Spec v69 (S11-R1 unchanged). Admin prefs restored identical.
- Standing Rule 112 added.
