# SKILLS-VERIFICATION-RESUME — the callable resume checkpoint

> **The QA lead will say "SKILLS-VERIFICATION-RESUME" to resume. A fresh session resumes from
> THIS FILE ALONE.** Written 2026-08-13.

## 1. What this is

The paused state of the **Skill-set verification (2026-08-13)**, stopped **deliberately at 98% of
the QA lead's weekly usage limit** — nothing failed; the pass was cut short on purpose to save the
remaining budget. This file is the single resume anchor.

## 2. Skill verification scoreboard (as at the stop)

| Skill | Status |
|---|---|
| **06-DEFECT-PREP** | **PASSED COLD** — 2 defects fixed |
| **08-RECOVER** | **PASSES WITH FIXES APPLIED** — 3 defects fixed; the drill matched the real recovery |
| **05** | **MID-RUN when stopped** — last known position: at its FINAL step, updating the register |
| **02-SOURCE-CHECK** | **MID-RUN when stopped** — last known position: 63 material spec-diff candidates left to read individually |
| **07** | **MID-RUN when stopped** — last known position: had FINISHED Branko's sheet, was STARTING Chris's |
| **03-RUN-CHECK** | **NEVER STARTED** |
| **04-TESTER-READY** | **NEVER STARTED** |
| **01-CASE-BUILD** | **NEVER STARTED** |
| Consolidation | Consolidating all verdicts into `build/skills/STATE.md` is **PENDING** |

**For 05, 02 and 07: do NOT trust the last-known positions above as final — establish each one's
exact position from its COMMITTED CHECKPOINTS** under:
- `build/skills/verification-2026-08-13/`
- `build/reports-2026-08-13/`
- `build/report-suite/source-sync-2026-08-13/`
- `build/filters/questions-2026-08-13/`

## 3. FIRST ACTION ON RESUME

**Run `build/skills/08-RECOVER.md`** (itself now drill-verified) **over the three stopped passes —
02-SOURCE-CHECK FIRST**, because it alone had TestRail write authority; **verify BY CONTENT what it
landed** (never by timestamps or by its own log alone).

## 4. Then

1. **Finish 05, 02 and 07** from their committed checkpoints.
2. **Run 03-RUN-CHECK** — needs **fresh QA-branch cookies from the QA lead** (all sessions will be
   long dead by resume time).
3. **Run 04-TESTER-READY and 01-CASE-BUILD cold.**
4. **Consolidate every verdict into `build/skills/STATE.md`.**

## 5. Standing project state (pointers only — read the pointed-at files, do not work from this table)

- **Filters:** 108/115 walked, **7 remaining** → `build/filters/finish5-2026-08-12/`
- **Schedule:** 151/176; **4 on the QA lead's go-ahead** + a fresh session needed →
  `build/schedule/blocker-audit-2026-08-12/`
- **Reports:** **postponed**; functional changes coming, a re-check is owed →
  `build/report-suite/data-preconditions-2026-08-12/RESUME.md`
- **Six prepared defects scorecard** → `build/report-suite/defect-recheck-2026-08-13/SCORECARD.md`
- **Tester handover sheets** → `build/handover/`
- **Read-date sweep owed** on pre-2026-08-11 stamps.
- **Jira creation hold is ACTIVE** (QA lead, 2026-08-10: *"Do not create anything until my next
  order."* — Standing Rule 62 tail / register row H1; check whether it has been lifted before
  concluding anything about creation).

## 6. OUTSTANDING — what the QA lead owes (so he sees it on resume)

- **Fresh cookies per branch** (every session will be dead).
- **The Schedule role/settings go-ahead.**
- **Word on C38880 and C29568.**
- **The Branko and Chris question sheets** — ready to send when he is.
