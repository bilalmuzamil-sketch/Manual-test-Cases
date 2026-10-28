# Founder Mode → What/Why (Title & Description) — PROJECT-STATE

**Feature:** "What Are You Doing / Why Are You Doing It?" — rename the two work-order-line fields to
Title / Description and strip our field names from the text that reaches QuickBooks.
**Epic:** SV-9667 · **Spec:** Confluence 845348896 (*Locked for build 2026-09-16*, read 2026-09-30)
· **PO:** Chris Ward
**TestRail:** Founder Mode = 20434 → **What/Why = 20437**
**Design:** artifact Pz1Q6BfvreYFpQwVQZPTE6 (5 artboards, driven end-to-end — Rule 115)
**Branch:** `claude/slack-session-setup-7v5itm`
**Build:** ❌ No QA branch yet → every case `AUTOMATION: HOLD`, source-verified only (Rule 85).

## 🟢 UPDATE — 28 Oct 2026, afternoon — read this first
- **Build-verified on staging by the build-verification session** (branch `claude/build-verification-setup-aieu36`, facts only, Rule 118):
  all 68 cases edited in TestRail at 08:15 and 10:48 UTC (setup made concrete for Staging Heavy Duty - 9919, the build's labels, example
  text capitalised, "Last checked against build v26.43.1-f2d183d (staging) on 10/28/2026"; markers READY 53, EXPECT FAIL 5, HOLD 10).
  Its run 553 "What/Why - Execution" (68 untested). **Our library is now behind the live cases: never write from it without first
  taking the live text in (apply.py's lock skipped all 68 on 28 Oct, correctly).**
- **Tickets filed 28 Oct (QA lead's one-time go-ahead; Product-reported, not reproduced by QA):** SV-11868 (S1-R6, under SV-10130),
  SV-11869 (S3-R8a, under SV-10132), SV-11870 (S4-R8, under SV-10133), SV-11871 (spaces-only tech story heading, under SV-9386, the QA
  lead's choice). Story Defect, Medium, relates to the story. Case markers left to the build-verification session (QA lead: "Leave it to the
  other session"): hand-over `defects-2026-10-28/HANDOVER-TO-BUILD-VERIFICATION-SESSION.md`.
- From now on defects go to the "Create defects from testrail…" session (QA lead, 28 Oct; OUTSTANDING-ITEMS-REGISTER standing instructions).
- New PO questions added by the build-verification session to Chris's What/Why Doc: 15 (New Line shows "Line Approved") and 16 (no way to
  clear a picked canned line).

## 🟢 CURRENT STATE — 28 Oct 2026 (named-set update to PRD v16 WRITTEN) — read this first
- Chris Ward answered Doc questions 9-14 on 27 Oct and folded them into **PRD v16** (27 Oct; `sources/CONFLUENCE-845348896-v16-2026-10-28.md`,
  verified paragraph by paragraph against the page). Answers saved word for word: `po-answers-2026-10-27/ANSWERS-Chris-Ward-2026-10-27.md`.
- QA lead 28 Oct: "Named set" (Rule 122 amendment), "Delete it" (D-15), and file the four bugs Chris asked for.
- **Written 28 Oct:** 15 cases rewritten to v16 (S1-03, S1-03b, S1-05, S2-03, S3-03, S3-05, S3-06, S3-08, S3-09, S3-13, S3-14, S3-15,
  S3-21, S3-22, S3-23); 7 new: S1-09 C847719, S1-10 C847720 (Title length message), S3-24 C847721 (imported invoice not in the report),
  S3-25 C847722, S3-26 C847723 (apostrophe guard, report / QuickBooks), S4-09 C847724 (import "Line Title cannot be empty."), D-18 C847725
  (no Scope of work heading without a tech story). **D-15 C839525 deleted** (no results in 346 open runs; read-back 400).
  The other 46 cases are unchanged (their page quotes are word for word in v16; their From line keeps version 15).
- **Suite (live): 68 cases** = map 68; readiness 0 on the live text; 44/44 v16 codes covered or PART_MANUAL. Log `applied-2026-10-27/apply-log.jsonl`
  (28 Oct entries), before-copies `applied-2026-10-28/before/`.
- **No open PO question.** Design-divergence register: every row closed (DV-04 ruled by answer 12).
- **Bugs to file (QA lead approved 28 Oct):** S1-R6 message timing, S3-R8a apostrophe guard, S4-R8 import message, and the separate
  invoice bug (a spaces-only tech story prints the Scope of work heading over a blank block). Rule 94 A1 needs two reproductions on the QA
  build first; **blocked**: this container's network policy refuses sv10130.qa.shopview.com, api.sv10130.qa.shopview.com and staging, and
  the QA build needs browser cookies from a Google sign-in. Once filed, S1-03b, S3-25 and S4-09 get EXPECT FAIL markers.
- Build verification: not started (same blocker).

## (HISTORY) STATE — 27 Oct 2026 (full pass WRITTEN to TestRail) — read this first
- QA lead 27 Oct: "OK now we do the same for WHy and WHY what you did for Parts life cycle" → "Full pass"; "Not now" to filing the S1-R6 bug of Chris Ward's answer 7.
- **Epic SV-11257** · PRD 845348896 **v15** (14 Oct; v14 holds Chris's 8 answers; re-checked unchanged just before the write, Rule 59) · Jira read 27 Oct (`sources/jira-2026-10-27/`), incl. open bug **SV-11850** (ShopCoach Build Lines shows nothing on staging) · tech plan unchanged · design 27 Oct copy (only change "Title *" → "Title").
- **Suite (live): 62 cases** = 37 rewritten in place (same C-ids) + 25 new (2 splits, 6 new story cases, 17 design cases in the new section **"Design — how it looks" 105855**). Map `testrail-id-map.csv` (62 rows). Every case in the QA lead's pattern; tester-readiness check 0 problems before the write (Rule 138); all 62 read back identical; design pictures attached (log `applied-2026-10-27/apply-log.jsonl`).
- Markers: 56 HOLD (not yet build-verified), 5 EXPECT FAIL SV-11850 (S2-01 C154711, S2-02 C154712, S2-03 C549079, D-16, D-17), 1 held design-version case **D-15 C839525** (Doc question 12).
- Runs: no dedicated run (QA lead 13 Oct); the automatic Nightly runs include every case, so the new cases join them.
- Rule 65 / Vlad: QA lead 28 Oct 2026, "NO need -> Do not remind me again about this." Not to be raised again.
- **Questions:** 9-14 added 27 Oct to the bottom of Chris's question Doc 1QcT7FRZ… (green headings, Chris tagged); see `build/PO-QUESTIONS-OPEN.md`. Q12 holds D-15; Q13 may remove S2-03's grey-italic words; Q9, Q10, Q11, Q14 have no case until answered (Rule 58).
- **Design differences:** `DESIGN-DIVERGENCE-REGISTER.json` (Phase D's 12 rows merged 27 Oct); every one closed by a ruling or a sent question.
- **Old per-case setup Docs:** 37 listed in `full-pass-2026-10-27/OLD-SETUP-DOCS.json`, no longer linked; trashed with a per-Doc log `full-pass-2026-10-27/old-setup-docs-trash-log.jsonl`.
- **Build verification:** not started. QA build sv10130.qa.shopview.com (QuickBooks qb1.qa.shopview.com) and staging carry the change; SV-11850 blocks the ShopCoach cases on staging.

## (HISTORY) STATE — 13 Oct 2026 (full update, Rule 122) — read this first
- **Epic now SV-11257** (split out of SV-9667). PRD 845348896 unchanged in substance since 30 Sep (40 codes). Tech plan received 13 Oct (`sources/tech-plan-Title-and-Description-2026-10-13.md`).
- **QA build exists:** sv10130.qa.shopview.com (qb1.qa.shopview.com for QuickBooks), PR #3553 — not yet build-verified.
- **Suite:** 37 cases = 19 rewritten + 18 new (C549075–C549092), current layout, one setup doc each; 40/40 codes. All 37 in Nightly run 538.
- **Record:** `update-2026-10-13/FULL-UPDATE-2026-10-13.md` (8 PO questions for after build verification); design proof `update-2026-10-13/DESIGN-COVERAGE-2026-10-13.md`.

## (HISTORY, 30 Sep) What was created — 19 cases, Rule 117, 40 anchors covered 1:1
| Story | Sub-folder (section) | Cases | Case ids |
|---|---|---|---|
| S1 The Work Order Line Dialog | 20461 | 4 | C154707–C154710 |
| S2 The ShopCoach Line Builder | 20462 | 2 | C154711–C154712 |
| S3 What Reaches QuickBooks | 20463 | 10 | C154713–C154722 |
| S4 The Imports | 20464 | 3 | C154723–C154725 |
| **Total** | | **19** | C154707–C154725 |

40 PRD requirement anchors (S1-R1 … S4-N1) covered 1:1 — no gap, no duplicate, no extra (verified by
script vs `anchor-quotes.json`).

## Coverage verdict (Rule 115)
- **PRD (Confluence 845348896):** ✅ 100% — all 40 anchors covered 1:1. R1 of S4 ("Withdrawn") is
  covered as the negative "no separate work order import carries these columns".
- **Design (5 artboards, driven):** ✅ CONFIRM — New Line / Edit Line dialogs, Title */Description
  labels, "What are you doing?" / "Why are you doing it?" placeholders (sentence case), the
  before/after QuickBooks line text (spaced-hyphen join, no semicolons), AI SHOPCOACH LINE BUILDER.
  No DIVERGE.
- **Tech plan:** none supplied. N/A.
- **Epic/stories (SV-9667):** ✅ four stories (SV-10130…10133) map 1:1 to the four sub-folders.

## Manual-runnability (Rule 114)
S3's joining/shortening rules are read manually via **Export Reports → Customer Invoice** (download,
read the Description column; needs "Invoicing & payments - View"). The live-sync-only assertions
(reaches QuickBooks / not in Unexported Items) need a shop with an active QuickBooks Online
connection; both surfaces share one builder (S3-R4). All HOLD until a QA build exists.

## Outstanding
- No QA build / no tech plan for What/Why → all 19 HOLD; build-verify when a branch exists.
- Nothing else outstanding.

- **Questions for Chris Ward (14 Oct, QA lead's "Yes" to sending them now, before build verification):** Google Doc https://docs.google.com/document/d/1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA/edit — the 8 questions from `update-2026-10-13/FULL-UPDATE-2026-10-13.md` plus one FYI (the "Title *" star); source HTML `questions-2026-10-14/questions-for-chris-ward.html`. The QA lead shares it. When answered: copy the answers verbatim to `po-answers-<date>/` and run a full update (Rule 122).
