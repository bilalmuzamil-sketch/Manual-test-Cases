# WO Board & Tech View — seven tests the run session flagged ("the test's wording and staging disagree"), 15 Oct 2026
Source of the disagreements: origin/claude/test-execution-defects-cdrjsq build/wo-board-tech-view/run498-2026-10-08/REPORT-staging-2026-10-15.md items 3–10 (facts only).
Lane: labels/routes/setup only. Expected results are the documents' (never changed toward the build).
| Case | Disagreement | Done here |
|---|---|---|
| C96916 | Back restores sideways exactly, up-down can shift ~1 row | "Build:" line -> staging; stamp -> v26.40.17-a5c4210 (staging) 10/15/2026. Verdict question left with the QA lead |
| C96920 | Offline, a browser that never opened Tech View cannot switch to it | same as C96916. Whether to add "open Tech View once first" is a test-design question for the QA lead |
| C97003 | Ben dropped before Unassigned lands right after it | same + review wording -> "Mark as reviewed … Confirm review". The Expected says only "cannot be placed before Unassigned; Unassigned stays first" — it does not require "nothing happens" |
| C581895 | Staging keeps one name per technician | READY (set by me 14 Oct from labels alone) -> HOLD with the reason; claim-one-name.json PROVED from the run session's committed evidence (L0339, L0346, L0349) |
| C96973 | Assigned-to-me board empties with a message, test says column with 0 | NOT written: Automated (Rule 71) and an Expected/source question (Rule 106) |
| C96978 | Card shows full name +1 (as List does); test/PRD say first name +1 | NOT written: Automated (Rule 71); the PRD sentence contradicts itself (Rule 58) |
| C590125 | Dark theme, no expected yet | NOT written: HOLD for the product owner |
Checks: check_tester_runnable PASS; check_runnable_cases 4/4; display fr-view 4/4 (served-4.json).
Environment note: from ~09:00 the container disk returned I/O errors (dmesg: "I/O error, dev vda") on some repo files
(build/testing-tools/scan_secrets.py, blocker_gate.py, staging-boot2.mjs, ensure_bridge.sh …); those were run from `git show HEAD:` copies.
The staging build marker could not be re-read after 09:00 for that reason; a5c4210 was read at 03:00 and 03:30 today.

## QA lead's answers, 15 Oct 2026 ("1. Ask the product Owner 2. DO whats scitific and logical and best 3. a 4. a 5. OK")
- 1 (C96916) and 4 (C96978): product owner sheet ../source-verify-2026-10-15/Work Orders Board View and Tech View - Product Owner questions - 15 Oct 2026.xlsx (layman check clean).
- 2 (C96920): apply2.py — one step added before going offline: open Tech View, List and Board View once while online, so offline
  only the save can fail (the source S1-N3/S1-N4 is about a failed save). Expected unchanged; 12 steps; gate RUNNABLE.
- 3 (C96973, Automated): PRD v52 read 15 Oct; ../source-verify-2026-10-15/C96973-RECONCILIATION.md — the case's
  "(your column count goes from 1 to 0)" is not in the source (S3-N1 hides the column; S1-N1a shows the empty message). Correction
  proposed; NOT written until the QA lead says yes (Rule 71/106).
- 5 (C590125): no action.

## 15 Oct, later
- Items 1 and 4 added as questions 30 and 31 at the bottom of Chris Ward's sheet "WO Board and Tech View Feature Squad – Questions on the spec and design – for Chris Ward (14 Oct 2026)" (Google Sheet 1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU), same columns and pink format as 12–29. Read back.
- Item 3: QA lead "Follow the requirements" -> apply3.py corrected C96973's Expected to PRD v52 (S4-E8, S3-N1, S1-N1a quoted), stamp -> staging. C96973 is AUTOMATED: TELL VLAD (Rule 65) — the expected outcome changed from "your column count goes from 1 to 0" to "your column is hidden and the board shows the No work orders match these filters message".
