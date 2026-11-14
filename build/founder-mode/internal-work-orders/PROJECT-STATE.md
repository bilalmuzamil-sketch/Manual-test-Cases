# Internal Work Orders — project state

- PO: Milos Vasic. Epic SV-11665. TestRail section 136701 (suite 1, Founder Mode). See `INTAKE-2026-11-12.md`.

## 12 Nov 2026 — intake (QA lead travelling; unattended)
- Sources saved (PRD Final v1.0, tech plan, design files, Jira list, the QA lead's zip). Section 136701 description set (Rule 140, new rule
  recorded today). Three workers started: design drive, tech plan reading, PRD cases (round 1).

## 12 Nov 2026 — written to TestRail (unattended; standing choices as in INTAKE)
- Rounds: PRD + Jira (504) → tech plan (+66, 680 statements read) → design (92 design cases, 401 cases with design references) →
  coordinator review fixes (results with a visible baseline; no code paths quoted). Library 661: 641 to TestRail, 20 not manual (kept out).
- 22 subsections under 136701 (ids in sections.json). 641 cases added and read back (5 re-sent with ✓ as &#10003;), 1,076 pictures
  attached and read back. Live: 641 cases, all ours.
- Run 559 "Internal Work Orders - Execution" https://shopview.testrail.io/index.php?/runs/view/559: 596 tests, Mudassir. 45 held out:
  `applied/HELD-CASES-2026-11-12.md` (18 on Milos's questions, 19 Open API, 1 Maintenance Reminders, 8 production around the release).
- Question sheet for Milos Vasic: https://docs.google.com/spreadsheets/d/1HMtYS1VTJEH1-m4ykJNVefdg1mu2mwtlH9HhOkRml-w (16 questions,
  NOT shared; the QA lead shares it).
- 12 Nov 2026, QA lead: the question sheet has been given to Milos Vasic; he is expected to answer in one to two weeks. QA branch:
  not yet available — the suite is "source-verified only, no build exists yet" (Rule 85); every runnable case carries the Rule 69 marker.
- 12 Nov 2026: Milos Vasic answered all 16 (all option (a)); PRD v1.1 the same day carries them. Design republished (1794507512-2fc4)
  with no board changed. Question review: 8 of 16 were avoidable (`po-answers-2026-11-12/QUESTION-REVIEW.md`); skill 07 §6.0 and lesson
  L-20 recorded on the QA lead's approval. QA lead: "Named set" (rewrite ~166 affected, new cases for v1.1 additions, release held, stamp
  the rest after reading each) and "Yes, delete the 3" (C1112404 D-87, C1112406 D-89, C1112408 D-91). Case worker drafting round 3.

## 14 Nov 2026 — PRD v1.4 / design 1794565397-7f4c, named set (QA lead: "Named set, drop S12-49 (Recommended)")
- PRD v1.4 (13 Nov 2026): the no-charge line chip reads "No Charge", category in the tooltip "Category: [category]" (S12-R3, S2-R22,
  S12-E8, section 8). Design 1794565397-7f4c: the same string on 6 boards, no tooltip drawn. Impact: `po-answers-2026-11-12/V1.4-IMPACT.md`.
- Library: per-case override (`authoring/cases_zzzzz_v14.py`, `iwo_lib.prd_version/is14`, `design_refs.v14`). 34 touched live cases on
  v1.4 (16 rewritten, 8 re-quoted, 10 re-pictured), S12-24 confirmed, 54 drafts on v1.4 (S12-49 dropped; D-113, D-143 rewritten).
  The other 609 live and 22 library-only cases byte-identical (`po-answers-2026-11-12/v14/prove-unchanged.json`).
- Register: IWO-D63 (chip matches v1.4, closed), IWO-N45 (tooltip design-silent). build.py 0 PROBLEM; readiness 0 hard problems.
- NOTHING WRITTEN. Write scripts and dry runs: `po-answers-2026-11-12/write-v14/` (lock 34/34 ok, no foreign case, run 559 615 tests).
  Report: `po-answers-2026-11-12/V1.4-NAMED-SET-PASS-REPORT.md` (candidate PO points: badge tooltip, phone tooltip, Issue Credit label).

## 14 Nov 2026 — PRD v1.4 named set WRITTEN (QA lead: "Named set, drop S12-49 (Recommended)")
- Rule 59 re-check: Confluence 942243841 last modified 13 Nov (v1.4, unchanged); design still 1794565397-7f4c.
- 34 live cases updated (16 rewritten, 8 re-quoted, 10 re-pictured; lock 34/34; read-back 34/34). The old flow6-3/hf-32 and flow6-4/hf-33 pictures
  could not be deleted (TestRail: attached to a closed run), so the 14 cases holding them now name them and say to ignore them (iwo_lib
  OLD_PICTURES_LEFT; written, read-back 14/14). update_v14.py's delete call fixed to POST.
- 54 new cases (S12-49 dropped); run 559 615 -> 663 tests, union only, 48 released new cases assigned to Mudassir; held out: D-139..D-144
  (questions 17-18), and API-22, API-27 (API cases, not in the execution run).
- Folder 136701 note re-dated 11/14/2026. The other 609 live cases keep their v1.3 From line (byte-identical, proved by script).
- Question 18 corrected in place (see PO-QUESTIONS-OPEN.md). Test links: po-answers-2026-11-12/TESTS-TO-RUN-v14-2026-11-14.md.
- 14 Nov 2026: questions 19 (badge tooltip, PRD v1.4 S12-R3/S1-R14 vs S2-R16/S2-R3) and 20 (phone: no hover) added to Milos Vasic's sheet,
  rows 26-28, light orange (QA lead: "Add both"); no case held on them. S12-33's Issue Credit line stays removed (QA lead: "OK").
