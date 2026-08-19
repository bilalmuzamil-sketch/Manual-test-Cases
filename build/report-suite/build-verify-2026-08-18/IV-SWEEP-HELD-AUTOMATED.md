# IV RE-VERIFY SWEEP — Automated cases HELD (2026-08-19)

**Rule 71: never change/delete an Automated case (`custom_atmstatus = 3`) without asking the QA lead first —
including our own.** Verified present live on **v3.8-d0e135e**, **NOT written**. Re-GET confirms all still
`atm=3`. **Live count is 11 (the 8/18 doc recorded 5) — the atm column was stale; re-read is authoritative.**

C30534, C30535, C30557, C30563, C30569, C30579, C30580, C30583, C30588, C30603, C30604.

**Note:** C30588 carries the SV-8823 "column-selection-in-export" sub-claim that was NOT re-verified this
pass — it is Automated, so held. Put to the QA lead for ask-first ratification before closing SV-8823's money
portion. Intended changes are made in the coupled build-verify pass once ratified, then handed to Vlad via
`AUTOMATED-CASES-REGISTER.md`. **0 writes. Foreign C38921 / C43573 (Vladimir Tomovic id 1) also untouched
(Rule 38).**
