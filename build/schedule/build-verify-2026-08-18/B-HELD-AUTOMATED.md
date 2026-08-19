# Batch B — Automated cases HELD (Rule 71, ask-first)

`custom_atmstatus = 3` cases are Vlad's (Vladimir Tomovic, id 1) automation contract. Per Rule 71 /
skill 03 §6.4 they are **ask-first for ANY change, even our own**, and are edited **only coupled with
live build-verification** in the same pass — never on a documents-only basis. The flag is read LIVE
(it moves).

## Batch B Automated inventory (read live from TestRail 2026-08-19)
| C-id | Section | atm (read live) | Owner | Status this session |
|---|---|---|---|---|
| **C43811** | 4275 Reassignment and Context Menu | **3 (Automated)** | Vlad (id 1) | **HELD — not verified, not edited.** Live build access is blocked this session (no staging session; see B-EXECUTION.md), so it could not be build-verified. No intended change recorded yet — that requires live observation first. |

**Re-check of the whole batch for atm=3:** only C43811 carries `atm=3` in batch B (the other 65 are
`atm=1`). No hidden Automated case.

## What happens on resume (once live access lands)
1. Verify C43811 live against the current spec (Confluence v30) + build `v3.8-bd246fd`.
2. Record the intended change (if any) with live evidence.
3. **Ask the QA lead** before editing (per case or per batch).
4. Edit only coupled with build-verification; set the correct marker (`READY`, or
   `READY - EXPECT FAIL (SV-xxxx)` on a live-backed ticketed failure).
5. Hand the case number to Vlad via
   `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

**This session: 0 edits to C43811. 0 TestRail writes.**
