# Fees and Discount project — STATUS

> **CANONICAL RESUME SNAPSHOT: `build/fees-discounts/PROJECT-STATE.md`** — read that
> first (case inventory, VIU breakdown, TestRail state, deliverables index, FDBUG
> register, open threads, env/access facts, how-to-resume). Per-case state is tallied
> by `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md`/`.xlsx` (regenerate with
> `python3 build/fees-discounts/gen_blockers.py`). This file is the narrative log.

**STATUS (2026-07-08): FEATURE LIVE on qb QA env — Deep-VIU BATCH 1 + BATCH 2 DONE
(batch-2 commit `93279ed`).** Current tally: **88 VIU-Verified / 94 not-yet-verified**
of 182 = 27 Deviation (7 code-bug · 3 PO-question · 17 case-update) · 11 Blocked-NotBuilt
(S11 Part Sales ×7 + S8 Processing-Fee builder UI ×4) · 18 Blocked-Env (QuickBooks ×13
+ flag-off/shared-env ×5) · 4 Needs-Account (Story-13 per-role) · 34 Pending (6 are
PO-flagged deviations). See `PROJECT-STATE.md` §2 for the full breakdown.

**STATUS (batch 1, superseded by the tally above): FEATURE LIVE on qb QA env — Deep-VIU
BATCH 1 DONE (two parallel same-day passes, merged).**
Env: `qb.qa.shopview.com` / API `sv7387api.qa.shopview.com` (flag ON).
- **Pass A** (API-heavy, Admin+Tech): `viu-findings.md` + `bugs-log.md` + `viu-evidence/`.
- **Pass B** (UI-deep): **`viu-qb-findings.md`** (merged scoreboard, reconciliation,
  FDBUG register, API map) + `screenshots/viu-qb/`. Env map/access: `viu-recon.md`.
- The 2026-07-06 staging "not deployed" finding is superseded.

**Merged batch-1 result (all 182 cases adjudicated in `cases/*.json` `viu_status`,
pass-A per-case verdicts preserved in `notes`):**
- **72 VIU-Verified · 36 VIU-Deviation · 11 Blocked-NotBuilt** (Part Sales S11 ×7,
  Processing-Fee builder UI S8 ×4) **· 31 Blocked-Env** (QuickBooks, flag-off,
  most Story-13 perms) **· 32 Pending** (parts UI flows, invoice-time walks).
- **Headline bugs:** FDBUG-1 WO + estimate Subtotal/Total EXCLUDE adjustments while
  GST includes their tax (customer-facing money wrong); FDBUG-2 processing-fee
  Grand-Total base wrongly includes whole-WO fees + their tax; FDBUG-3 auto-applied
  adjustments write no history entries; whole-WO adjustment writes FE-only enforced
  (pass A: tech 201) while templates admin IS BE-enforced (403). Double-add known
  bug NOT reproduced in a controlled repro. Full registers: `viu-qb-findings.md`
  (FDBUG-1..13) + `bugs-log.md` (BUG-FD-1..4).
- Tech quick-login on qb is FLAKY (403 in recon/pass B, 200 in pass A) — retest
  per run.

**Next (batch 2):** parts UI flows, invoice-time walk (over-discount floor/credit +
FDBUG-1 on a real invoice), restricted-role sessions for Story-13, flag-off window,
small retests — backlog at the end of `viu-qb-findings.md`. THEN: finalize cases +
workbook; TestRail only with explicit user approval.
