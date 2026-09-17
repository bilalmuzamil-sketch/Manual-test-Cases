# Comments posted on the OBSOLETE stories — 17 September 2026

On the QA lead's instruction, a note was added to each story that is marked **OBSOLETE** and that
has Global Search v2 checks parked against it, so that anyone who reopens the story sees
immediately which checks are waiting on it.

| Story | Status read live | Checks parked on it | Comment |
|---|---|---|---|
| [SV-9173](https://shopview.atlassian.net/browse/SV-9173) — FE, contextual quick actions on result rows | OBSOLETE | **8** (C44866–C44873) | id 76751 |
| [SV-9169](https://shopview.atlassian.net/browse/SV-9169) — FE, scope tab strip, counts, grouped results | OBSOLETE | **1** (C44826) | id 76752 |
| [SV-9306](https://shopview.atlassian.net/browse/SV-9306) — BE, page-search cutover | OBSOLETE | **1** (C44896) | id 76753 |
| [SV-9167](https://shopview.atlassian.net/browse/SV-9167) — search telemetry | OBSOLETE | **1** (C45160) | id 76754 |

**Each comment says:** the story is obsolete, so N checks in the Global Search v2 run cannot be run
and are marked **Blocked** rather than Failed; what those checks cover, in plain words; and that the
requirement is still written both in the product requirements page and in the test cases, so the two
disagree — either the work returns and the checks are re-run, or the requirement is dropped and the
checks are retired, which is the QA lead's decision.

**No case ids and no run links are in any comment** — traceability runs one way only (the ticket
number goes onto the case in the run, never the reverse; QA lead, 2026-09-16/17).

**SV-9306 also carries the measurement**, so the decision can be made with facts rather than
guesses: `brake` returns 20 work orders from the main search and nothing from the Work Orders page
search; `Fibrige` (a typo) returns 20 from the main search and nothing from the page search; the
page search returns 32 rows for `Buda`, proving it works and simply matches differently.

**SV-9167 also carries the confirmation** that the requirements page itself puts impression and
click logging outside this version, in two places.

## Checked first, and worth recording

**None of the seven defect tickets raised today hangs off an obsolete story** — every parent was
read live and all seven are **Ready for QA**: SV-10159 → SV-9174 · SV-10161 → SV-9165 ·
SV-10163 → SV-9170 · SV-10178 → SV-9170 · SV-10181 → SV-9168 · SV-10186 → SV-9170 ·
SV-10188 → SV-9165. So the instruction could only mean the obsolete stories themselves, and that is
where the notes went.

⚠️ **One thing for the QA lead:** [SV-10159](https://shopview.atlassian.net/browse/SV-10159), the
missing "Show all" link, sits under **SV-9174** (the integration story) because its natural owner,
**SV-9169**, is obsolete and Jira will not accept an obsolete parent for new work in practice. If
SV-9169 ever returns, that ticket should be re-parented.

---

## Correction — the note also belongs ON THE CHECKS, and that is where it was missing

**QA lead, same day:** *"i DONT SEE THE COMMENT AND TEXT IN ANY OF THOSE TICKETS BEING BLOCKED DUE
TO THE OBSOLETE STORIES."*

He was right, and checking rather than arguing settled it in one command: of the eleven checks held
against obsolete work, **only one (C44896) named its story or used the word obsolete.** The other
ten said things like *"this is the hover quick-actions feature, which has not been built on this
branch yet"* — true, but it does not tell the reader **which** story, **what** its status is, or
**when** that was read. The Jira-side comments were real and verified, but they were the half he
could not see from the run.

**What I got wrong:** I read *"the tickets related to the Obsoleted stories"* as the Jira issues,
checked that no defect raised today hangs off an obsolete story, and concluded the obsolete stories
themselves were the only possible target. The thing that is actually *being blocked* is the check,
and his own handoff instruction on 2026-09-16 already said it plainly: *"mark those test cases as
BLOCKED with a comment in those test cases which includes the stories those test cases related to
and mention that those stories are Still IN PROGRESS/Not ready for QA."* **A reading that makes an
earlier standing instruction redundant is the wrong reading.**

### What now stands on each of the eleven

Every one carries, in its own result: the sentence *"cannot be run: the story this check belongs to
has been OBSOLETED"*, the story key and title, that it **reads OBSOLETE in Jira read live on 17
September 2026**, what the check covers in plain words, what was observed on the branch, the note
that the requirement still stands in both the requirements page and the check, and what the QA lead
must decide. Verified on the served page: renders cleanly, no literal markup.

### Then moved to Retest — QA lead, same day: *"aND THEN MOVE THEM TO RETEST STATUS"*

All eleven now read **Retest**, each with the line *"moved to Retest on the QA lead's instruction …
so it is picked up again the moment the story behind it comes back"* above the full explanation.

**Run 415 after this pass: 135 Passed · 16 Failed · 11 Retest · 3 Blocked · 1 Untested.**

The three that remain **Blocked** are the ones held by environment or data, whose stories are
Ready for QA: C44857 (visits cannot be backdated), C44880 (second organisation holds nothing
searchable), C45159 (a person with no home branch cannot sign in at all).
