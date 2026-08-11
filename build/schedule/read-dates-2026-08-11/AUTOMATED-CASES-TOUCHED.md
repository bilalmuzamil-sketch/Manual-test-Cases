# AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)

**Pass:** Schedule read-dates, 2026-08-11. **Cases written: 174.**

## NONE.

**Not one of the 174 cases this pass wrote carries TestRail's own Automated flag.**

| | |
|---|---|
| `custom_atmstatus = 3` (**Automated**) | **0 of 174** |
| `custom_atmstatus = 1` (**Not Automated**) | **174 of 174** |

**Measured, not assumed, and measured AT WRITE TIME.** The flag was read from the live case body in the
same `get_case` that byte-verified each write, and is recorded per operation in the
`atmstatus_at_write` column of `testrail-execution-log.md` — **174 rows, every one `1`**. It was also
read at pass start (13:19Z) and again in the final live re-read of all 174 (13:33Z), agreeing all
three times.

**Rule 65 requires this section to say "none" where none, and never to be omitted.** This is that
statement.

## Why Schedule reads 0 when Filters and Report Suite do not

Earlier on **2026-08-11** a separate pass corrected **31 Schedule cases from `3` back to `1`**
(`build/automated-flag-and-c30041-2026-08-11/`). Those 31 had **never been flagged by a person**: our
own `add_case` tooling hardcoded `custom_atmstatus: 3` at creation, so the flag was an artefact of our
creation template and asserted nothing about automation. `get_history_for_case` showed **no
`custom_atmstatus` event at all** on any of the 31, while every one of the 44 genuinely-flagged cases
across Filters and the Report Suite carries an event and every one of those events is **user 1,
Vladimir Tomovic**.

**So the 0 here is a true 0, not a gap in our reading:** there is no Schedule case Vlad has marked as
automated, and therefore nothing in this pass for him to adjust.

## And this pass would not have mattered to automation even if there had been

Stated because it is the column Rule 65 actually asks for — *does this change what an automated check
should conclude?*

**No, for every one of the 174.** The only text that changed is the **provenance sentence at the end of
Expected Results**, which records where the expectation came from and when we read it. **No assertion
changed. No step changed. No precondition changed. No title changed. No automation marker changed.**
Nothing an automated check evaluates was touched.

**The honest caveat, since we have never seen Vlad's scripts:** a check that matched the provenance
sentence as an exact string would see a difference. That is worth saying rather than assuming it away —
but it applies to no Schedule case today, because none is flagged as automated.
