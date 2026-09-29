# The 16 Global Search checks that did not pass — links, causes and where each stands

**Run 415** — https://shopview.testrail.io/index.php?/runs/view/415. Every check in the suite has been
run and answered; the 16 below are the ones that did not pass, and they are the whole of what is left
to deal with. Of those 16, only ONE is a live fault a developer needs to look at. The rest are either
checks that have fallen behind a decision already taken, or things needing a word from you.
Everything was measured on the shared test site, build **v26.39.1-02c6b6c**, on 28 September 2026.

**I had left something out, and you were right to ask.** None of the 16 results named its report.
Every one of them now does — each result in the run carries the report raised against it, that
report's status read live today, and the piece of work it belongs to. The links are in the run
itself, not only in this note.

## The short answer

| | How many |
|---|---|
| Has a report that is still **OPEN** | **1** (C44854) |
| Has a report, **closed as intended** — so the check is what is out of date | **8** |
| The work itself is **OBSOLETE** — dropped, nothing to fix | **1** (C45160) |
| **No report filed**, and a decision is needed from you | **6** |

---

## Every one, in full

| Check | What failed, in plain words | Is the failure real? | Report | Story | Where it stands |
|---|---|---|---|---|---|
| **C44854**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2723924) · [case](https://shopview.testrail.io/index.php?/cases/view/44854) | A part already on the job you are looking at is not pushed down the list. | Correct - it really does not happen. Proved by putting a part on a job and searching from that job's own page: the order is identical to searching from anywhere else. | [SV-10188](https://shopview.atlassian.net/browse/SV-10188) — QA Complete — OPEN, no resolution | [SV-9165](https://shopview.atlassian.net/browse/SV-9165) — TESTING QA | **The only one with a live report.** Already known, still open, and it behaves exactly as it did before. |
| **C53476**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2868064) · [case](https://shopview.testrail.io/index.php?/cases/view/53476) | A count somewhere in search reads higher than twenty. | Correct - the All tab counts past twenty while the other tabs stop there. | [SV-10320](https://shopview.atlassian.net/browse/SV-10320) — OBSOLETE | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | Reported and closed as intended. The check is what is out of date. |
| **C55716**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/3051908) · [case](https://shopview.testrail.io/index.php?/cases/view/55716) | Where two results are otherwise identical, the one changed most recently should come first. It does not. | Correct - the tie is not broken that way. | [SV-10340](https://shopview.atlassian.net/browse/SV-10340) — OBSOLETE | [SV-9165](https://shopview.atlassian.net/browse/SV-9165) — TESTING QA | Reported and closed as intended. The check is what is out of date. |
| **C45153**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2738734) · [case](https://shopview.testrail.io/index.php?/cases/view/45153) | A part that is in the catalogue but never stocked cannot be found at all, so there is no row to open. | Correct - the part exists in the catalogue, and searching its number or a word from its description returns nothing. | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) — OBSOLETE | [SV-9163](https://shopview.atlassian.net/browse/SV-9163) — QA Complete | Reported and closed as intended. The check is what is out of date. |
| **C53601**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2959367) · [case](https://shopview.testrail.io/index.php?/cases/view/53601) | The same thing as the one above - a catalogue part that was never stocked cannot be found. | Correct - same cause, same evidence. | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) — OBSOLETE | [SV-9163](https://shopview.atlassian.net/browse/SV-9163) — QA Complete | Reported and closed as intended. The check is what is out of date. |
| **C55660**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2977472) · [case](https://shopview.testrail.io/index.php?/cases/view/55660) | Part of a word from the middle of a name does not find the record. | Correct. | [SV-10060](https://shopview.atlassian.net/browse/SV-10060) — OBSOLETE · [SV-10025](https://shopview.atlassian.net/browse/SV-10025) — OBSOLETE | [SV-9164](https://shopview.atlassian.net/browse/SV-9164) — TESTING QA | Two reports, both closed as intended. The check is what is out of date. |
| **C55685**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2984234) · [case](https://shopview.testrail.io/index.php?/cases/view/55685) | Typing a name brings back other, differently spelled names. | Correct. | [SV-10025](https://shopview.atlassian.net/browse/SV-10025) — OBSOLETE | [SV-9164](https://shopview.atlassian.net/browse/SV-9164) — TESTING QA | Reported and closed as intended. The check is what is out of date. |
| **C55673**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2980695) · [case](https://shopview.testrail.io/index.php?/cases/view/55673) | Pressing Enter opens the wrong record. | Correct, and I found the cause: the row under the MOUSE POINTER becomes the one Enter opens, and clicking the search box leaves the pointer over the panel. Move the mouse away, or open with the keyboard, and it is right. | [SV-10061](https://shopview.atlassian.net/browse/SV-10061) — OBSOLETE | [SV-9171](https://shopview.atlassian.net/browse/SV-9171) — QA Complete | Exactly what that report describes, and it was closed as intended. The check is what is out of date. |
| **C55686**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2984235) · [case](https://shopview.testrail.io/index.php?/cases/view/55686) | The right record is listed first, but pressing Enter opens a different one. | The listing half is correct. The Enter half is the same mouse-pointer behaviour as above. | [SV-10061](https://shopview.atlassian.net/browse/SV-10061) — OBSOLETE | [SV-9171](https://shopview.atlassian.net/browse/SV-9171) — QA Complete | Same report, closed as intended. The check is what is out of date. |
| **C45160**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2738741) · [case](https://shopview.testrail.io/index.php?/cases/view/45160) | Selecting a result does not record a usage-tracking event. | Correct. | **none filed** | [SV-9167](https://shopview.atlassian.net/browse/SV-9167) — OBSOLETE | **The work itself was dropped** - search usage tracking is obsolete. There is nothing to raise and nothing to fix. |
| **C44850**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2723920) · [case](https://shopview.testrail.io/index.php?/cases/view/44850) | Typing an exact number no longer puts that record on a line of its own above everything. | Correct - the record is found and ranked first, but sits inside its section. Checked with two job numbers, a part number and a vehicle number; no such line exists for any of them. | **none filed** | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | **No report filed against this check.** Two related ones suggest it was changed on purpose: SV-10547 (Done) asked why that top line did not say what kind of record it was, and SV-10556 (OBSOLETE) asked about its missing heading. |
| **C55729**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/3075528) · [case](https://shopview.testrail.io/index.php?/cases/view/55729) | The same thing, with a name that also matches - the exact number wins, but still without a line of its own. | Correct - the number does outrank the name; it just is not pinned above the sections. | **none filed** | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | **No report filed against this check.** Same two related ones as above. |
| **C44898**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2723968) · [case](https://shopview.testrail.io/index.php?/cases/view/44898) | On a phone the results are capped at five a section with a "Show All" link, where this requires the full scrolling list. | Correct - counted on a search returning 106 results across eight sections: five rows per section and "Show All" twenty-one times. | **none filed** | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | **No report filed - and there is a conflict.** SV-10345 (QA Complete, OPEN) asks for "Show all" to be ADDED on phones, which is the opposite of what this check requires. |
| **C45134**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2728112) · [case](https://shopview.testrail.io/index.php?/cases/view/45134) | The same phone capping. | Correct - sticky headings and tapping a row both work; only the capped list is wrong. | **none filed** | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | **No report filed.** Same conflict with SV-10345 (OPEN). |
| **C45136**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2728114) · [case](https://shopview.testrail.io/index.php?/cases/view/45136) | The same phone capping, seen from the "no Show all" angle. | Correct - the keyboard half of this check is right; the "Show all" half is not. | **none filed** | [SV-9168](https://shopview.atlassian.net/browse/SV-9168) — TESTING QA | **No report filed.** Same conflict with SV-10345 (OPEN). |
| **C45132**<br>[test in run](https://shopview.testrail.io/index.php?/tests/view/2728110) · [case](https://shopview.testrail.io/index.php?/cases/view/45132) | The greyed-out words in the phone search box read "Search work orders, parts…" where this requires "Search everything". | Correct - the full-screen panel, the Cancel button and the absent shortcut strip are all right; only the wording differs. | **none filed** | [SV-9168](https://shopview.atlassian.net/browse/SV-9168) — TESTING QA | **No report filed** - wording, waiting on your decision. |

---

## What this means

**Only one thing here is a live fault:** C44854, a part already on the job not being pushed down. Its
report is open and it behaves exactly as it did before — nothing has got worse.

**Eight are checks that have fallen behind decisions already taken.** In each case a report was
raised, and the product team closed it as intended behaviour. The product is doing what was decided;
our check still describes the older search. I cannot change what a check expects, so these need your
word: retire them, or reword them.

**One is simply dead** — the usage-tracking work is obsolete, so C45160 can be retired outright.

**Six have no report at all, and two of those carry a real conflict.** The three phone ones fail
because a phone shows the capped list with "Show All" — but SV-10345, which is still open, asks for
"Show all" to be ADDED on phones. Our checks and that request point in opposite directions, and
someone has to choose. The two about an exact number no longer getting its own line at the top look
like a deliberate change, going by SV-10547 and SV-10556, but nothing says so outright.

**No new report is being raised on any of them**, and none is waiting on my go-ahead — what is
waiting is four decisions that are yours, set out in `REPORT-FULL-RERUN-2026-09-28.md`.
