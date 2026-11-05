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
