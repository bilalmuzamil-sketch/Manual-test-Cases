# Mistakes I made, and the check that now prevents each one (Rule 124)

**How this file works (automatic, no permission needed — QA lead, 2026-11-12):** the moment a mistake is found — by me,
by the QA lead, by a reviewer, or by the build — I fix it, then in the SAME turn: (1) add an entry here, (2) add its
one-line check to "Before you act" in `CLAUDE.md` §1B, (3) tell the QA lead in that report under "What I got wrong".
Newest first. Each entry: what happened · what it cost · why it happened · **the check** (the thing I now do every time).

## 2026-11-12 — A/R and A/P staging run (SV-11315)

**M11. A "not found" was my lookup, not the data.** Read 4Refuel's unpaid bills and payments at Lethbridge with the
Heavy Duty vendor account id (hard-coded). The list is per location, so it read 0, and I reported "an unexplained empty
list on staging" to the QA lead. *Cost:* a false alarm and a needless investigation. *Why:* reused an id read in another
scope; when two readings disagreed I suspected staging before my own method.
**Check:** any id that belongs to a location, workplace, account or environment is read in the SAME scope as the call
that uses it — never hard-coded. When two readings disagree, diff the two METHODS (ids, scope, filters, session) before
saying anything about the system.

**M10. A stop I did not verify.** `pkill` did not end the re-run; I took its output ("782", the process still running)
as success, restored evidence files while it was still writing, and it ran 12 more tests. *Check:* a stop is proved only
by `pgrep` returning NOTHING; escalate to `kill -9` if needed; only then restore or report "stopped".

**M9. Started a re-run that could not change any verdict.** The change was labels and one extra quoted sentence; I began
a 30-minute staging re-run anyway. *Check:* before re-running, ask "can this change move any pass/fail?" If not, say so
and do not run (Rule 80: give the last-run date and ask).

**M8. A bulk find-and-replace edited records of what was sent.** `sed` over a folder changed "$1.00" inside the saved
TestRail payloads too; I had to restore them. *Check:* files that record what was POSTED (RESULTS*.json,
result-posted.json, push logs, before-images) are never edited — a correction goes in a new note beside them. Scope every
bulk replace to named files and list them first.

**M7. Wrong units: "$1.00" for $100.00 bills.** The before snapshot stores dollars, the after data stores cents; I read
one as the other and posted "$1.00 each" in two TestRail results. *Check:* before stating any amount, confirm the
field's unit (cents vs dollars) from a known row and quote the amount as the SCREEN shows it.

**M6. A comparison that skipped a column.** C715472 posted as "Blocked" after comparing rows, columns and amounts only;
1,149 bills had a Past Due one day off. Another run had already posted the correct "Failed". *Check:* a before/after
comparison compares EVERY column the case's Expected names (list them from the case first), and the result says which
columns were compared. Read the run's existing results for the case before posting over them.

**M5. "The PRD does not say" without reading it.** Told the QA lead the PRD did not define the Detail "Amount"; S5-R18a
did. *Check:* Rule 123 — fetch the current PRD, search its words, quote what is found, before any claim about it.

**M4. A substring match counted as a finding.** "v11" matched inside "sv11315", so I reported 16 cases as citing PRD v11.
*Check:* match whole tokens (`\bv11\b`, or the full citation phrase), and spot-check one hit by eye before reporting a count.

**M3. A test script built for one environment run on another.** V1R-53/87 failed on staging because the script used QA
invoice numbers and an exact page title; I nearly read it as a product failure. *Check:* every identifier and expected
label in a script is re-read for the environment it runs on (Rule 111); a FAIL is first re-measured by hand before it
counts.

**M2. A screenshot that did not show what it claimed.** The production report picture cut off the Amount and Open
Balance columns. *Check:* open every picture before using it and confirm the claimed values are visible in it.

**M1. A ticket against a decision already taken (SV-12546, 11 Nov).** Filed against the epic's "do not file" list.
*Check:* Rule 121's pre-filing gate.
