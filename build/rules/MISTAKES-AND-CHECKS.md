# Mistakes I made, and the check that now prevents each one (Rule 124)

**How this file works (automatic, no permission needed — QA lead, 2026-11-12):** the moment a mistake is found — by me,
by the QA lead, by a reviewer, or by the build — I fix it, then in the SAME turn: (1) add an entry here, (2) add its
one-line check to "Before you act" in `CLAUDE.md` §1B, (3) tell the QA lead in that report under "What I got wrong".
Newest first. Each entry: what happened · what it cost · why it happened · **the check** (the thing I now do every time).

## 2026-11-12 — A/R and A/P staging run (SV-11315)

**M17. "Nobody has decided this" without searching Jira (18 Nov).** I told the QA lead the credit-Amount question was
undecided and drafted a ticket for Chris; the epic SV-11315 already held his own 12 Nov comment raising it as "not a bug,
add one PRD line", answered by Milos "will do". Found only when Rule 121 forced the search. *Check:* before saying a
question is open, or drafting any ticket, search the epic's comments, its children and his own past comments for the
behaviour's words (Rule 126.2).

**M16. A held question written up as settled (16 Nov, found 18 Nov).** The 12 Nov question on the 6 partly-used
credits' Amount was held for the QA lead and never answered; my 16 Nov evidence README called it "intended" from my own
reading of PRD S5-R18a, and the next reader took that as decided. *Check:* an open question stays labelled "HELD —
undecided" (with its file) in every later note until he answers; before calling any difference "intended", find his
answer or the PRD sentence AND confirm no held question covers it.

**M15. A regression ticket built on a before/after comparison whose two sides used different settings — SV-12853, closed OBSOLETE "expected behavior" (16–17 Nov). The worst one so far: it reached Product and the developers under the QA lead's name.** The "before" screen (12 Nov harness `stg.js`) stored the user and permissions but never the app's own time-zone setting, so the old app showed dates on UTC days; the "before" data calls also used a UTC end of day. The "after" screen (16 Nov `screen_doc.js`) set the setting to the location's zone. Every one-day difference came from that. Three chances to catch it were missed: (1) I knew the before DATA was UTC and still treated the before SCREEN as "Pakistan time" because the browser clock was Karachi — the app uses its own setting, not the browser clock; (2) I did not open the bill's own page at Mountain time, which shows the same day as the new report and kills the claim; (3) production was the deciding control and I filed without it, writing "pictures of the version before the release: not attached" instead of stopping. I also told him "Is it defensible as a bug? I think so" — confidence I had not earned. *Check:* the regression-ticket gate — (a) a SETTINGS TABLE for both sides (app time-zone setting, location, role, as-of date and whether it was "today", browser clock, build), every cell measured, both sides equal, else no ticket; (b) the claim reproduced on PRODUCTION itself with a normal sign-in at the same location, with a picture — no production picture, no regression ticket; (c) the strongest innocent explanation written down and tested before filing (here: "the before capture used another time zone", "the record's own page shows the same"); (d) the doubts left are said to him plainly, never "I think so".

**M14. The Defects field of two run results reads "S,V,-,1,2,8,5,3" (16 Nov).** I gave `push_results_to_run.py` `"defects": "SV-12853"` (text) where it expects a list; it joined the text letter by letter. Results 617276 and 617277 in run 557 carry it; TestRail results cannot be edited through the API, so the "Follow the status here" results on top (617278, 617279) carry the correct SV-12853, and the QA lead was told. The scratch copy of the tool now splits a text value and refuses anything that is not a ticket key. *Check:* in the dry run, read the Defects value the tool will send, not only the comment; give `defects` as a list.

**M13. Called the API differently from the screen and nearly read it as what the user sees (16 Nov).** Re-checking C715471/72, I pulled the aging reports without the `timezone=` the fixed screen sends, so the server used the session's zone, and my first check reported "Heavy Duty documents a day off", which looked like SV-12663 still broken. The ticket's own handoff said the screen sends its zone. Caught before reporting: re-pulled as the screen does, 0 wrong. *Check:* before judging an API answer as "what the user sees", read the ticket's handoff and the screen's request (front-end API module or network tab) and send the same parameters; open the screen once to confirm.

**M12. A script guessed a field name and skipped without saying so (14 Nov).** The local v13 update keyed cases on `key`; cases.json uses `id`, so the V1R-07/08 changes silently did not apply and the retired cases were not skipped. The checker caught it before commit and the file was restored from git and redone. *Check:* read one real record's field names before scripting against a file, and make every special case ASSERT it was applied (a count of 1), never silently fall through.

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
