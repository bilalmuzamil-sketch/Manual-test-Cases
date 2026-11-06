# SV-12003 — Spell check not underlining misspellings (Tech Story etc.) — 5 Nov 2026

**Verdict: PARTIALLY PASSED.** Posted as two comments (Rule 115): 80210 (what passed) then 80211 (what is still to be fixed, @parth fadadu). No QAcomplete label, no status move (not a full pass).

Mode: API (QA lead) — no recording, no technical section. Spell-check only renders headed, so every capture ran under `xvfb-run -a` with `HEADED=1` (qa-session.mjs `headed` option).

## Environment
- QA branch sv12003 — build `v26.45.0-440aa25` (re-read at post time, unchanged)
- Production — build `v26.45.1-6505633` (re-read at post time)
- Chrome for Testing 153.0.8010.12, desktop, 1600x900, 100% zoom, dpr 2
- Test data (branch): WO `S12003-17580` (id 737fce7f-…), customer **4 Star Truck Repair**, asset **2020 Ford Transit**, line `Service - Electric brake trailer CVIP`. (Vendor of the seeded parts is 5 Star Truck Repair — not the customer.)
- Typed text in every box: `thee spellling are wrong wrng` ("thee" is a real word).

## Matrix (red spell-underline pixels, scripts/redcount.py; states 1 typing / 2 clicked out / 3 refocus)
| Box | Production 1/2/3 | Branch 1/2/3 | Result |
|---|---|---|---|
| Tech Story | 0/0/0 | 382/**0**/384 | Fixed while typing; underlines vanish on blur (text auto-capitalised "Thee") — REMAINING (QA lead: "Remaining issue") |
| Edit Line Description | 0/0/0 | 789/789/789 | PASSED |
| New Line Description | 0/0/0 | 0/0/0 | PASSED — intended off (Chris 79914) |
| Notes tab > New Note | 382/382/382 | 382/382/382 | PASSED, unchanged |
| Edit Customer Notes | 0/0/0 | 0/0/0 | REMAINING (ticket lists it; QA lead: "Remaining issue") |
| Edit Asset Notes | 0/0/0 | 0/0/0 | REMAINING (ticket lists it) |

Cause (read from the deployed bundle): the fix sets `spellcheck` on in LineDialog Edit mode (off for New Line) and on in Tech Story; Edit Customer / Edit Asset forms still carry `spellcheck="false"`.

## Pre-post gate
Build markers re-read live (both unchanged); ticket re-read (TESTING QA, 3 comments, no new ones); every step walked live (walk.mjs / walk2.mjs — corrected customer name from "5 Star" (vendor) to "4 Star Truck Repair" and the edit icon description); voice scan clean; failing rows removed from the passed comment; unmeasured "every try" sentence removed; read back from Jira: 80210 = 3 images + 4 rows, 80211 = 2 images, in created order.

Learning check: playbook entry added for the headed spell-check method.

---
# Retest 6 Nov 2026 after Parth's redeploy (80289) — branch `v26.45.1-b7be383`
**Verdict: PARTIALLY PASSED** — 80293 (what passed, 6 rows, before/after) then 80294 (still to fix, @parth, 2 items, 2 exhibits). Moved **TESTING QA → REJECTED FROM TESTING** (transition 15). QA Assignee already Bilal.

Full matrix re-run (ev/branch-matrix; old 5 Nov run kept as ev/branch-matrix-2026-11-05-440aa25), text WITH trailing space: all boxes underline in typing / clicked-out / refocus — Tech Story 382/382/382 (was 382/0/384), Customer Notes 382×3, Asset Notes 382×3 (were 0), Edit Line Description 789×3, New Note 382×3, New Line 0×3 (intended).

## Parth's two "browser behaviour" notes, checked
- **No trailing space** (ev/branch-matrix-nospace-1..3, 3 runs): Customer Notes, Asset Notes, Edit Line Description, New Note underline including the last word, all states, 3/3. **Tech Story: 0 or 238 (one word) while typing and after click-out, 382 only after refocus, 3/3.** Ending with a full stop (`…wrng.`, ev/branch-matrix-period-1..2): Tech Story 0/0/382, 2/2.
- **Single-line box**: plain Chrome input on a blank page (comparison only, ev/branch-parth/plain-input-*) = underline while typing (125 px), none after blur — that half of Parth's note is Chrome. But **Edit Line Title** (`input_line_name`) = 0 while typing, 0 after blur, underlined only after refocus, 2/2 (ev/branch-parth, branch-parth-r2).
- New Note no-space crop bug of mine (cropped the "Create note for" select, read 0) caught and re-run with the textarea's own field: 382×3 on branch and production.
- Production Title check timed out (no line on that WO) — not needed for the verdict; recorded.

## Pre-post gate
Branch marker re-read at post time (b7be383 unchanged); ticket re-read (last comment Parth 80289); exhibits checked by eye; two-comment order 80293 → 80294.

---
# Retest 3 — 6 Nov 2026 after Parth's redeploy (80308) — branch `v26.45.1-9ae1530`
**Verdict: PASSED** — comment 80315 (one green comment, 9 rows, 2 exhibits; edited once at 05:45 UTC−5 to fix "How to see it" — line 1 now shows the saved story "wrng spellling"). Label `QAcomplete` added, moved TESTING QA → **QA Complete** (transition 10). QA Assignee already Bilal.
- Matrix (scripts/matrix.mjs, ev/branch-matrix-r3-{space,nospace,period}): every box underlines in typing / clicked-out / refocus for all three endings — Tech Story 382×3 (was 0/0/382 with a full stop), Customer/Asset Notes 382×3, Edit Line Description 789×3, New Note 382×3, New Line 0×3 (intended).
- scripts/gate.mjs (ev/branch-r3-gate, -run2): Edit Line Title 522 typing / 0 clicked-out / 515 refocus, 2 of 2 (click-out drop = plain Chrome input behaviour, proven earlier ev/branch-parth/plain-input-*). Completion wizard (`input_tech_story_<line>` via `button_action_complete_line_<line>`) 384 typing; clicking out saved the story (shot timed out because the box became read-only) — matches Parth's note. Tech story gate (`button_mark_reviewed` on S2-17422, ready_for_review, 5 lines without story) 384/384/384, spellcheck attr true, not autofocused.
- How the gate is reached: WorkOrder chunk — `onOpenMarkReviewed` → if requireTechStories && lines without story → TechStoryGateModal (found via bundle read, findgate.mjs).
- Pre-post gate: marker 9ae1530 re-read; ticket TESTING QA, last comment Parth 80308; images uploaded as Jira media; steps walked (howto.mjs) — caught the stale "Add tech story" link and fixed in place with dated note.
- Rule 121 (AccountingHub/QB): not applicable — no money/tax data touched.
Learning check: the completion-gate Tech story window opens from Mark Reviewed when tech stories are required and a line has none — added to playbook.
