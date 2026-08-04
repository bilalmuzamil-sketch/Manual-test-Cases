# REPORT SUITE — IS IT READY FOR AUTOMATION? · re-checked after the 2026-08-04 redeploy

**Short answer: yes — and it is slightly better than this morning. 394 of the 469 tests can be
automated starting now**, up from 392, because a real bug was fixed. The other 75 should be left
alone, and every one is listed with the reason.

**The uncertainty in the earlier version of this report is now gone.** That version carried a warning
that most checks had been done on the build running *before* this morning's 10:40 update. **Everything
has now been re-checked on the build running now** (`v3.4.1-3d03023`), and the marker was read again
at the end of the run to be sure it had not moved a second time. It had not.

---

## THE TABLE

| Report | Cases | Verified against the build | Failing because of a known open problem | Held waiting on Chris Ward | Needs a special tool | Ready for automation? |
|---|---:|---:|---:|---:|---:|---|
| Sales By Customer | 84 | 68 | 2 | 9 | 13 | **Yes — 73 of 84** |
| Sales By Representative | 111 | 74 | 2 | 9 | 14 | **Yes — 92 of 111** |
| Parts Velocity | 71 | **55** | **2** | 4 | 5 | **Yes — 68 of 71** |
| Technician Utilization | 59 | 40 | 1 | 5 | 7 | **Yes — 51 of 59** |
| Work In Progress | 76 | 54 | 0 | 11 | 6 | **Yes — 59 of 76** |
| Inventory Value | 68 | 35 | 7 | 9 | 7 | **Yes — 51 of 68** |
| **TOTAL** | **469** | **326** | **14** | **47** | **52** | **Yes — 394 of 469** |

**How to read the columns** is unchanged from the earlier version. *Verified against the build* means
we opened the real report and watched it behave, and it matched.

### WHAT CHANGED VERSUS THIS MORNING — three things, no more

**1 · Two Parts Velocity tests moved from "failing" to "passing", because the bug was fixed.** ⭐

The "Turns / Yr" figure was being worked out over a period one day too short whenever you used the
**This Year** shortcut, so the number came out too high. **That is now fixed.** We checked it two ways:
the shortcut and the same dates picked by hand now give **exactly the same figure**, and we measured it
across **500 rows for every date shortcut**, not on one example.

The two tests are **PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367)**
and **PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374)**. Both now pass,
so the sentence on each of them that said *"Known issue: the product does not currently do this"* has
been **taken off** — it would have told a tester to ignore behaviour that is now correct.

**⚠️ One thing for whoever owns the ticket:** **[SV-8819](https://shopview.atlassian.net/browse/SV-8819)
is still marked Open in Jira**, even though the build no longer has the problem. It should be moved to
a resolved state so Jira and the build agree.

**2 · One Inventory Value test had to be corrected, because the update broke it.**

Every downloaded file now begins with a new **"Date Range:"** line that was not there before. On the
Inventory Value spreadsheet that pushed the "As of" line down from first to second.
**IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)** said the "As of"
line was *the first line*, which is no longer true — **a tester would have reported a fault that does
not exist.** It now says the line is *one of the short summary lines above the column headings*, and
tells the tester **not to count those lines, because more may be added.** That wording cannot be broken
by the next new line.

**We checked all 469 tests for this same problem, not just the one we were told about. Exactly one was
affected.** Twenty-three others mention those summary lines but were written without pinning a line
number, so they are all still correct — the careful wording did its job.

**3 · Nothing else moved.** Every other check we re-ran gave the same answer as before: the same
figures, the same column names, the same menus, the same nav headings, the same error messages.

### WHAT IS STILL BROKEN — unchanged, and both still ticketed

- **Downloading a PDF still fails on a large report** ([SV-8818](https://shopview.atlassian.net/browse/SV-8818), Open).
  Parts Velocity, the long Technician Utilization download and Inventory Value all fail after 30–45
  seconds; the spreadsheet version of the very same report works, and the PDF works once you narrow it
  down. **10 tests will fail on this — that is expected.**
- **Inventory Value still values stock one day late** ([SV-8820](https://shopview.atlassian.net/browse/SV-8820), Open).
  Ask for 31 July and it reports 1 August. **4 tests will fail on this — that is expected.**
- **The Inventory Value spreadsheet still ignores the columns you chose** and puts them in a different
  order from the screen. Money still arrives as text rather than numbers, so **anything doing sums on
  the download must strip the `$` and the commas first.** The amounts themselves are correct — we
  checked **55,584 cells against the report's own figures and found no wrong value.**

---

## WHAT TO SKIP, AND WHY — 75 tests

**1 · Leave the 47 tests we are waiting on Chris Ward for.** Each one says so in its own expected
results: *"DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner."* It also
links the question sheet. **If a test carries that line, skip it** — no other list needed. We counted
these live on the build this run: **47, all still present.**

**2 · Leave the 14 tests that are correct but the product is not** (the SV-8818 and SV-8820 lists
above). Each says so on the case, with the ticket link. Automate them if you prefer and expect a red
result until the fix lands — just do not raise a new ticket.

**3 · Leave the 4 Work In Progress tests about the nightly figures** — written by a background job that
no screen reads back. Cases [C30528](https://shopview.testrail.io/index.php?/cases/view/30528),
[C30530](https://shopview.testrail.io/index.php?/cases/view/30530),
[C30531](https://shopview.testrail.io/index.php?/cases/view/30531),
[C30533](https://shopview.testrail.io/index.php?/cases/view/30533).

**4 · Leave the 2 tests that need more than a year of stored history** — the test system holds about six
days. Cases [C30609](https://shopview.testrail.io/index.php?/cases/view/30609),
[C30610](https://shopview.testrail.io/index.php?/cases/view/30610).

**5 · Leave the 14 Sales-Representative tests about switching a representative off**, and the
assignments download. Creating an invoice on this test system fails with a server error
([SV-8821](https://shopview.atlassian.net/browse/SV-8821)), and the assignments download is not built,
so **we could not re-check these this run and are not claiming we did.**

---

## HONEST LIMITS — what this re-check did NOT cover

- **The branch is still not final.** Engineering has not withdrawn that, and this morning's deploy
  proved the point. So these results are **provisional**: good enough to automate against today, but
  every one of them stays on the re-check list for the next time the build moves. The list is
  `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` and it **stays open**.
- **We re-observed the surfaces the tests read, not 469 separate manual run-throughs.** All 36
  download surfaces, all six screens' columns and menus, all six column pickers, every error message,
  and every calculation were re-driven and compared against the previous results. That covers what the
  tests assert. It is **not** the same as executing 469 test scripts by hand, and we are not going to
  describe it as if it were.
- **One question is still genuinely open**: whether the Location filter should disappear for a user who
  can only see one location. We proved the **download** behaves correctly. Proving what the **filter**
  does needs a user account restricted to a single location, which we did not create.

---

## CAN THE AUTOMATION ENGINEER START TODAY?

**Yes — start on the 394. They are stable, their wording matches the build running now, and every one
of them says on its own face which build and which specification version it was checked against.**
Skip anything carrying the *"DO NOT AUTOMATE YET"* line, and treat the 14 known-broken ones as expected
failures rather than new bugs.

---

## OUTSTANDING — what I need from you

1. **SV-8819 is fixed but still Open in Jira.** Please move it to a resolved state so the ticket and
   the build agree. *(Blocks nothing; it just misleads anyone reading Jira.)*
2. **The Inventory Value columns problem needs a decision, and I did not file a ticket for it.** You
   asked me to file it *"but search Jira for duplicates first, and do not file if one exists — report
   instead."* **A duplicate exists: [SV-8823](https://shopview.atlassian.net/browse/SV-8823)**, whose
   title already covers both halves — *"money arrives as text, **and the file ignores the chosen columns
   and re-orders them**"*. You closed it as OBSOLETE on the money half only. So: **re-open SV-8823 for
   the columns half, or tell me to raise a separate ticket.** *(Blocks: nothing today; the behaviour is
   re-confirmed and written up either way.)*
3. **Chris Ward still owes answers on 47 tests.** Outstanding since 2026-08-03. *(Blocks: those 47
   cannot be automated without risking locking in the wrong behaviour.)*
4. **A single-location user account** would let us close the last open Location question. *(Blocks: one
   line of a coverage claim, nothing more.)*
5. **Tell us when the branch is declared final** — that is the trigger to re-run the whole re-check
   list and finally close it. *(Blocks: calling the suite VIU-complete at all.)*
