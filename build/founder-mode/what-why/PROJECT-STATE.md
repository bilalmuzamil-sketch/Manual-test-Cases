# Founder Mode → What/Why (Title & Description) — PROJECT-STATE

**Feature:** "What Are You Doing / Why Are You Doing It?" — rename the two work-order-line fields to
Title / Description and strip our field names from the text that reaches QuickBooks.
**Epic:** SV-9667 · **Spec:** Confluence 845348896 (*Locked for build 2026-09-16*, read 2026-09-30)
· **PO:** Chris Ward
**TestRail:** Founder Mode = 20434 → **What/Why = 20437**
**Design:** artifact Pz1Q6BfvreYFpQwVQZPTE6 (5 artboards, driven end-to-end — Rule 115)
**Branch:** `claude/slack-session-setup-7v5itm`
**Build:** ❌ No QA branch yet → every case `AUTOMATION: HOLD`, source-verified only (Rule 85).

## 🟢 CURRENT STATE — 27 Oct 2026 (full pass, DRAFT, nothing written to TestRail yet) — read this first
- QA lead 27 Oct: "Full pass" (as for Parts Lifecycle); "Not now" to filing the S1-R6 bug of Chris Ward's answer 7.
- Sources: PRD **v15** (14 Oct; v14 holds Chris's 8 answers), `full-pass-2026-10-27/PRD-DIFF-v13-v15.md`; Jira read 27 Oct (`sources/jira-2026-10-27/`), incl. new open bug **SV-11850** (Build Lines shows nothing on staging); tech plan unchanged; design 27 Oct copy (only "Title *" → "Title").
- Phase A (library + Stories 1-4) done in `authoring/`: 45 cases (37 rewritten keeping C-ids, 2 splits, 6 new), 41/41 codes, gates green; `PHASE-A-HANDOFF.md`. Phase D (design) works in `full-pass-2026-10-27/design/` and writes `authoring/cases_design.py`.
- Open questions Q9-Q11 (`full-pass-2026-10-27/QUESTIONS.json`), not sent.

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
