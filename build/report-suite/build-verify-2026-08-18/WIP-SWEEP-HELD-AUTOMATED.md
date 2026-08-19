# WIP RE-VERIFY SWEEP — Automated cases HELD (2026-08-19)

**Rule 71: never change/delete an Automated case (`custom_atmstatus = 3`) without asking the QA lead first —
including our own.** Verified present live on **v3.8-d0e135e**, **NOT written**. Re-GET confirms all still
`atm=3`. **Live count is 14 (the 8/18 doc recorded 10) — the atm column was stale; re-read is authoritative.**

C30451, C30452, C30460, C30462, C30488, C30498, C30506, C30507, C30508, C30510, C30511, C30515, C30518, C30527.

Intended changes (live re-confirm + build-stamp refresh, and where a marker transform applies) are put to the
QA lead for ask-first ratification, then made in the coupled build-verify pass and handed to Vlad via
`AUTOMATED-CASES-REGISTER.md`. **0 writes to any of these 14. Foreign C38922 / C43572 (Vladimir Tomovic id 1)
also untouched (Rule 38).**
