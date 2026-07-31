# PRE-CALL BRIEF — 2026-07-31

**For:** the QA lead, before the calls with **Mudassir** and then **Ahtasham**.
**Read time:** one page. Everything below was checked **live in TestRail today, read-only.
No TestRail write of any kind was made.**

---

## 1. The three test runs — all three are COMPLETE

Checked live, right now. Not this morning's figures.

| Project | Our active cases | Tests in the run | Complete? | Results recorded |
|---|---|---|---|---|
| **Filters** — group 4110, run **352** | **110** | **110** | **YES** | **No verdicts.** 395 records, all "Untested" or comment-only |
| **Schedule** — group 4254, run **357** | **165** | **165** | **YES** | **No verdicts.** 429 records, all "Untested" or comment-only |
| **Reports Suite** — group 4281, run **359** | **474** | **474** | **YES** | **No verdicts.** 539 records, all "Untested" or comment-only |

**This is a true match, not just matching totals.** For each run we listed every case in our
folder and every test in the run and compared them one by one, both directions:
**0 of our cases missing from any run, and 0 tests pointing at a case that no longer exists.**

**Nobody has passed, failed or blocked a single test yet.** We read every result record in all
three runs: every one is either "Untested" or a comment with no verdict on it. There are
**zero** Passed, Failed, Blocked or Retest results anywhere. So there is nothing to report as
tested — which matches the fact that there is no environment to test on.

**Reports Suite — the 5 extra cases.** Our folder actually holds 479 cases; **5 of them are
Vladimir Tomovic's** (C38919, C38920, C38921, C38922, C38923). We do **not** count them as
ours, we have **not** touched them, and they are **not** in the run. Our number is **474**.
Every other case in all three folders was created by us.

---

## 2. Are the cases current? Yes — all three were re-checked against today's live sources

**Reports Suite.** Re-checked against the six live specs pulled today (Sales By Customer v12,
Sales By Representative v15, Parts Velocity v4, Technician Utilisation v5, Work In Progress v6,
Inventory Value v3 — all updated 29 July). **882 of 895 requirements are covered.** 6 real gaps,
7 not separately testable, 0 cases pointing at anything that no longer exists.
*(Note: the figure is **882**, not 888 — using the document's own number.)*

**Schedule.** Re-checked against the live Schedule spec, **Confluence version 23** (30 July).
Careful point worth knowing: the version printed **inside** that document still says "1.0" and
is not to be trusted — only the Confluence version number is reliable. **210 of the 213
testable statements are covered (98.6%).** 3 gaps.

**Filters.** Re-checked against the live PRD, **Confluence version 12 = spec v1.6** (28 July).
All **110** cases were re-read cold end to end and every reference re-pointed at v1.6: **100 of
110 now cite a numbered v1.6 requirement**, the other 10 cite v1.6 prose sections that carry no
numbered requirements (Parts/Reports) or state plainly that no requirement exists. Quality
re-check of all 110: **0 that make no sense**, 110 of 110 traceable and runnable by a
non-technical tester, and a full cross-case sweep of 1,959 assertions found **5 contradictions,
all 5 resolved**. Ahtasham's review was verified claim by claim: **1 fully right, 4 partly
right, 1 wrong (but with a fair point inside it), and zero false alarms.**

---

## 3. Queued but NOT applied — 8 cases live, plus a whole area not written

These are frozen deliberately: **we are waiting on Branko's answers, and on your own
instruction not to move them.** Nothing here has been changed in TestRail.

### Group A — the mobile "Apply filters" pattern (7 cases). Unblocked by **Branko Q1 (mobile)**

| Internal ID | C-id | Current title in TestRail |
|---|---|---|
| FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | Mobile: All Filters opens a sheet of expandable rows with Apply filters |
| FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile: tapping Apply filters applies the statuses and updates the count |
| FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Mobile: tapping one chip opens its own sheet with an 'Apply filter' button |
| FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Mobile Customer filter has search, multi-select and removable tags |
| FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | Mobile Lead Technician and Service Advisor filters offer their search lists |
| FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | The mobile Asset on site filter offers Yes/No with Clear selection in the sheet |
| FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Active chips and Clear filters behave on mobile the same way as on desktop |

### Group B — the default-tab case (1 case). Unblocked by **Branko Q2 (default tab)**

| Internal ID | C-id | Current title in TestRail |
|---|---|---|
| FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | First visit opens the Estimates tab; your last-used tab is remembered |

This one exists **only** because the engineering plan says so — the ratified spec v1.6 has no
requirement for it, and the case says that openly in its references.

### Group C — sorting. Unblocked by **Branko Q4 (sorting)**

**Say this plainly: there are NO sorting drafts. Zero cases have been written.** There is no
`FLT-SORT` area, no internal IDs handed out, and therefore **no C-ids — nothing was ever
pushed.** What exists is a design-backed proposal for roughly **6–8 cases**, described in
`build/filters/design-2026-07-31/RECONCILIATION-FINAL-2026-07-31.md` §D-1.

Three reasons nothing was written, all still true: the Figma section is literally named
**"Sorting (Work In Progress)"**; **spec v1.6 contains no sorting requirement at all** (one
passing mention only); and **Branko has never answered the sorting-scope question**. Two things
the design still does not pin down even if he says yes: whether **two sorts is the maximum**,
and **how you reverse a sort** ("Descending" is drawn nowhere).

### Exact total

**8 cases live in TestRail and frozen** (7 mobile + 1 default tab) — **plus 0 sorting cases
written, against an estimated 6–8 still to author** once Branko answers. So: **8 queued today;
up to 16 once sorting is answered.**

---

## 4. What neither call can resolve

1. **There is no QA branch or test environment for any of the three projects.** So **nothing is
   live-verified** — all 749 cases (474 + 165 + 110) are written, traced, audited and sitting in
   the testers' runs, and not one has been run against a working build. If either call drifts
   towards "so is it tested?", the honest answer is **no, and this is why**.
2. **Filters has no Jira ticket at all** — no epic, no stories. We proved it by listing all 170
   SV epics rather than by a failed search, and we did **not** invent a key. Every Filters case
   cites a spec section instead. Only Branko or you can close that.

---

## 5. If Ahtasham or Mudassir raises it — paste-ready lines

*(Lifted unchanged from `build/qa-preemptive-answers-2026-07-31/ANTICIPATED-QUESTIONS-AND-ANSWERS.md`.)*

- **"How much of this is actually tested?"** → *None of it, against a running build. 749 cases
  across Report Suite, Schedule and Filters are written, traced, audited and in the testers' runs
  — and there is no environment for any of the three. That is the single biggest thing we need,
  and we would rather say it plainly than let "cases complete" be read as "feature tested".*
- **"You were working from stale specs."** → *Yes — Filters was eight Confluence versions behind
  and Schedule five, and that did cost us real coverage. It is fully corrected and the rule that
  prevents it is now the first action of any project task. The trap worth knowing: the version
  number printed inside the Schedule document never changes, so only the Confluence version
  number is reliable.*
- **"Your own audit missed the contradiction a junior QA found."** → *That is exactly right, and
  we have said so in writing. Our sense check was applied case by case, so a suite could be
  individually sensible and still contradict itself. We added a mandatory across-the-suite
  contradiction sweep, and it has since found five more on Filters and one on Schedule that
  nobody had reported.*
- **"Cases were missing from the run I reviewed."** → *That was real and it was our fault, for
  the three runs we own. A TestRail run built from a fixed selection never picks up new cases, so
  runs had been frozen since 17 July. Filters 352, Schedule 357 and Reports Suite 359 were
  brought current with every recorded result preserved, and keeping them complete is now a
  standing duty. Runs outside those three are not ours to manage.*  **(Re-verified live today:
  all three are complete — see the table above.)**
- **"The PRD says the Status filter is hidden; your cases say greyed out."** → *The PRD text is
  the stale part. Branko was asked this exact question and chose "shown but greyed out,
  pre-filled with the tab's status, and not clickable", and you ruled the same way. Both of those
  outrank PRD wording the author has not updated in eight versions.*
- **"None of the Filters cases cite a Jira ticket."** → *It does break the rule, and the reason
  is that Filters has no Jira epic and no stories at all — we proved that by listing every one of
  the 170 SV epics. We did not invent a key; the ticket field reads "Filters (no Jira epic)".
  Every case still cites a spec anchor.*
- **"Stefan said only ~200 of the 500-odd cases are useful."** → *We scored every single case,
  not a sample. 11% were genuine waste and we consolidated them; 0.4% genuinely did not make
  sense and we had already flagged both ourselves. Where he is fair is regression value — about
  350 carry repeat value and the rest are one-time acceptance checks, and every case is now
  tagged that way.*

---

## OUTSTANDING — what I need from you

| # | What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **A QA branch / test environment** for Filters, Schedule and Reports Suite | You / engineering | **Nothing is live-verified.** All 749 cases stay "VIU-Pending" until an environment exists | ongoing |
| 2 | **Branko's answers — Q1 mobile Apply button, Q2 default tab, Q4 sorting** | Branko | The 8 frozen cases above, and the 6–8 sorting cases that cannot be written at all | 30 Jul |
| 3 | **A Jira epic/ticket key for Filters — or written confirmation the work is genuinely not ticketed** | You / Branko | Filters cases can never carry a ticket reference; spec-anchor-only is the ceiling | 31 Jul |
| 4 | **Your go-ahead on the held items:** 26 Filters merges + 1 cut, 79 Schedule title trims, 39 Filters title trims | You | All recommended, none applied — nothing moves in TestRail without your word | 31 Jul |
| 5 | **Chris Ward's spec fix** for the Sales By Customer permission wording, and the engineering change behind it | Chris Ward / engineering | 3 Reports Suite cases will fail on the current build on purpose | 31 Jul |

*(The Filters Figma design source is **no longer outstanding** — all **85 of 85** boards were
pulled and read on 31 July and the retry queue is closed.)*

**Nothing else is outstanding for these three projects.**

---

### Source-currency note (Standing Rule 31)

| Source | Identifier | Version / date | Checked | Verdict |
|---|---|---|---|---|
| TestRail runs + cases | runs 352 / 357 / 359; groups 4110 / 4254 / 4281 | live | **2026-07-31, this brief** | **CURRENT** (read-only) |
| Filters spec | Confluence 572030978 | version 12 = v1.6, 2026-07-28 | 2026-07-31 | CURRENT |
| Schedule spec | Confluence 713031682 | version 23, 2026-07-30 | 2026-07-31 | CURRENT |
| Report Suite specs ×6 | 577634305 / 585629698 / 620888066 / 641400833 / 703660034 / 720142338 | v12 / v15 / v4 / v5 / v6 / v3, 2026-07-29 | 2026-07-31 | CURRENT |
| Designs | Filters Figma `DR4gEODShYgJqkozs3mF5q` | **85 of 85 boards** rendered and read; retry queue CLOSED | 2026-07-31 | **CURRENT** (Report Suite has no designs; Schedule uses the ratified prototype) |
| Live build | all three projects | **none exists** | 2026-07-31 | **MISSING — nothing is live-verified** |
