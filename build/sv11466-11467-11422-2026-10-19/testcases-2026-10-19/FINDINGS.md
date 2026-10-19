# Test cases + run results, 19 Oct 2026 (SV-11466 / SV-11467 / SV-11422)

Build staging v26.40.19-c850386 (read before and after every script). PRD 845185030 v66. Admin, 1440 x 900, dpr 2. Location switched from "ZZAUTOTEST C614715 Empty .." to "Staging Heavy Duty - 9919" and back each run.

## SV-11466 result
- Test 4053764 (C682419) already held Passed result 527986 (16:18:59Z) and test 3481897 held 527988 (16:21:58Z). Both were logged under our shared account by another session or the QA lead, not by this session. Result 527986 says "Firefox was not checked".
- Added result **527989** (Passed) to 4053764, with our Firefox check and 3 annotated PNGs (attachments 1000035731-33). Did not add one to 3481897: it already has today's Passed result for its own steps.
- **Wording slip in 527989:** it says the DVI Test handle is "most of the bar". Measured 1053 / 516 / 204 px at 1920 / 1440 / 1024: always above 150 px, but not "most" at narrow widths. The API cannot edit a result, so this is flagged to the QA lead.
- Run 498 before/after: 1607 → 1608 results, 0 missing, 0 changed.

## New cases (layman, no setup, existing staging data)
| Ticket | Case | Run 498 test | Section | Result |
|---|---|---|---|---|
| SV-11467 | 682420 "Tech View count numbers sit on the status pill as in List, at every density" | 4054407 | 73780 | 527990 **Passed** |
| SV-11422 | 682421 "First Tab goes to the work order even when it is far down or off to the side" | 4054408 | 13246 | 527991 **Blocked** (waiting on Chris, 79033) |
- add_case re-GET: every field equal to the payload (refs under the comma normalisation).
- update_run 498 by union: 281 → 283 tests, 0 removed; results 1608 unchanged. Adding the results: 1608 → 1610, 0 missing, 0 changed.
- Walk of the case steps (walk.mjs): S2-33351 has red 2 / blue 3, offset -15 px at List / Compact / Regular / Comfortable, cover 28% each; pill 21 / 16 / 16 / 22. The link drops `tab=all` from the URL but the All tab is selected and Search is filled. S2-16688: row at y 3044 before Tab; "Unassigned 0".
- SV-11422, Tech View after Tab, by density (walkB.mjs): Compact row 208–244, heading 208–244 (fully covered); Regular row 208–256, heading 208–252 (4 px shows); Comfortable row 208–272, heading 208–264 (8 px shows). Board View card fully on screen (1149–1411 of 1440).

## Existing cases not changed
- C590115 (test 3995724), status pill: its S2-R19 / S6-R2a quotes are word-for-word the same in v66. It needs heavy setup, so the new short case covers SV-11467's point (where the numbers sit).
- **C614719 (test 4007027): NOT touched.** Created by us, but Vladimir Tomovic (user 1) rewrote its preconditions on 19 Oct at 08:46 and 09:17 UTC. They now mention steps 8–13, a third technician C and a WO-4 for the off-screen case, but the steps and expected results stop at step 7. Raised with the QA lead (Rules 38/39/53).
- C97021 (test 3481959): its S11-R1 quote is version 61, which lacks the clause "the first row or card in Unassigned, or the first technician's first row or card when Unassigned is collapsed or empty". The case's own steps still follow v66. Not changed.

## Environment slip (mine), fixed
walk.mjs restored only view / tab / collapsed groups, so density was left at Comfortable. Earlier runs today showed 36 px rows (Compact), so the density was put back to Compact (PUT 200). Lesson recorded in the playbook §AK-VIS addendum.
