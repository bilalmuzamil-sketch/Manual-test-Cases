# AHTASHAM'S CLAIM — "we don't have the test cases for last two stories"

**Stories named:** [SV-8798](https://shopview.atlassian.net/browse/SV-8798) "Page Search" ·
[SV-8799](https://shopview.atlassian.net/browse/SV-8799) "Remove Page Filtering from Global Search"
**Date:** 2026-08-10 · **Read-only pass** — no TestRail write, no Jira write, no ticket created.
**Posture:** Standing Rule 44 — his claim was treated as a bug report against our suite until
disproven. Our own coverage was checked first, not defended.

---

## THE VERDICT, IN ONE LINE

**He is mistaken on the literal claim — the cases exist — but he is right about something real
underneath it, and one of the two reasons he could not see it is our fault.**

| | |
|---|---|
| **"We have no test cases for SV-8798"** | **WRONG.** **6** cases name SV-8798 in their References field, inside a dedicated TestRail section called **"Page Search Toolbar"** which holds **14** cases in total. |
| **"We have no test cases for SV-8799"** | **WRONG.** **2** cases name SV-8799, in the same section. |
| **Is the coverage actually complete?** | **NO — and this is the half he is right about.** Story 13 has **9 uncovered assertions** out of 39; Story 14 has **1** out of 9. |
| **Could he have seen the coverage?** | **PARTLY NOT, AND THAT IS ON US.** One of the six SV-8798 cases is **not in his test run at all**, and until today there was **no published map** for him to check. |

**The short version for the QA lead:** Ahtasham looked, did not find, and reported honestly. The
cases were there. But we had given him no list to check against, and his own run does not contain
all of our cases — so "I can't find them" was a reasonable thing for him to conclude. **This is the
third time in eight days that an outsider has reported a gap that was really a visibility failure
of ours.**

---

## 1. THE CASES THAT EXIST

Read live from TestRail on 2026-08-10. All are ours (`created_by = 3`).

### SV-8798 — Page Search (6 cases)

| Case | In his run 352? | Title |
|---|---|---|
| [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | yes | Page toolbar Search expands in place and narrows the list as you type |
| [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | yes | The Search box changes look as you hover over it, open it and type |
| [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | yes | The list narrows shortly after you stop typing, with no button to press |
| [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | yes | One search box serves all Work Orders tabs and searches the tab you are on |
| [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | yes | Collapsing the filter bar keeps an active search working |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | **NO** | On a phone, pages with two or more icon buttons collapse them into one menu |

### SV-8799 — Remove Page Filtering from Global Search (2 cases)

| Case | In his run 352? | Title |
|---|---|---|
| [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | yes | The top navigation search no longer filters page lists |
| [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | yes | An old link carrying a top-search word no longer narrows the page list |

Six more cases in the same **"Page Search Toolbar"** section carry the search behaviour under other
anchors (C38884, C38886, C38889, C38891, C38897, C38901), making **14** in the section.

---

## 2. RULE 45(e) — BOTH TEXTS, SIDE BY SIDE

A "covered" verdict is only valid with the requirement and the case quoted together. Below is one
row **per assertion**, not per requirement. The full 48-row table for these two stories is in
`build/filters/coverage-rederivation-2026-08-06/COVERAGE-MAP.md`; the representative rows are here.

### SV-8799 — every requirement in the story

> **Story SV-8799, requirement 1, verbatim:** *"Global search returns navigational results only; it
> does not modify the contents of the current page's table"*
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"The top
> navigation search no longer filters page lists"* — and its expected results assert the list is
> left untouched while the query runs.
> **VERDICT: COVERED.**

> **Story SV-8799, requirement 3, verbatim:** *"Any state, URL parameters, or persisted values that
> carry a global search term into page filtering are removed"*
> **[C38902](https://shopview.testrail.io/index.php?/cases/view/38902) says, verbatim:** *"An old
> link carrying a top-search word no longer narrows the page list"*
> **VERDICT: COVERED.**

> **Story SV-8799, requirement 6, verbatim:** *"Every affected surface keeps a search control via the
> shared table component. 42 surfaces across 39 components confirmed"*
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Every table
> listed above has its own Search box - no table lost the ability to narrow by text."* The case walks
> all 42 surfaces; they were counted against the spec's own list group by group — 5 + 11 + 10 + 12 + 2
> + 2 = 42.
> **VERDICT: COVERED.**

> **Story SV-8799, requirement 5, verbatim:** *"This applies to every page in the application — an
> app-wide sweep, not per-module"*
> **Our case:** C38891 + C38893 cover the named surfaces. **No case asserts the sweep on pages
> outside Work Orders, Parts and Reports.**
> **VERDICT: PARTIALLY COVERED — see §4, this is a deliberate scope boundary, not a miss.**

### SV-8798 — the requirements that are NOT fully covered

> **`S13-R25`, verbatim:** *"The query is stored in the browser tab session, never against the user
> account… They sync across the user's devices"* (the contrast clause)
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886)** covers the tab-session half.
> **Nothing asserts that the query does NOT follow you to a second device.**
> **VERDICT: PARTIAL — a genuine gap of ours.**

> **`S13-R21`, verbatim:** *"All query behaviour is identical across breakpoints: additive with
> filters, tab scoping, clearing, retention and the four component states"*
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** covers only the width rule.
> **Those five behaviours are tested on desktop only.**
> **VERDICT: PARTIAL — a genuine gap of ours, and the largest one in this story.**

> **`S13-R16`, verbatim:** mobile *"same inline expansion"*, and tapping *"moves focus into the field
> and raises the keyboard"*
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** covers the inline expansion.
> **The focus-and-keyboard half is asserted nowhere.**
> **VERDICT: PARTIAL — a genuine gap of ours.**

**Tally for the two stories he named:**

| Story | Spec anchors | Assertion rows | COVERED | UNCOVERED | BLOCKED | NOT-TESTABLE |
|---|---|---|---|---|---|---|
| SV-8798 Page Search | 30 | 39 | **28** | **9** | 1 | 1 |
| SV-8799 Global Search | 7 | 9 | **7** | **1** | 0 | 1 |

---

## 3. WHY HE COULD NOT TELL — THE ACTIONABLE HALF

Two reasons. **Both are ours, and one of them is a repeat.**

### (a) One of the cases is genuinely invisible to him — his run is frozen

Run **352 "Filters - Ahtasham (Awaiting QA- ENV)"** was created with `include_all: false`, so it is
**frozen at the 110 cases it was built with**. There are now **114** live. The four that are missing
from his run are:

**C43560 · [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) · C43562 · C43563**

**C43561 is one of the six SV-8798 cases.** From inside his run it does not exist. This is exactly
the failure Standing Rule 34 was written for, and exactly what happened on **31 July**, when the
same reviewer reported "no case exists" for requirements we had already authored and pushed. **The
rule exists, the checker exists (`build/testrail-run-sync-2026-07-31/run_sync_audit.py`), and the
sync was not run after the last four cases were added.**

**The fix is one authorised `update_run` sending the UNION of the current 110 and the 4** — never a
partial list, which would delete tests and their results. It needs the QA lead's go-ahead because
the run is Ahtasham's (Rule 6). **It is not done here.**

### (b) There was no map to check — until this document

Our cases carry the story key in the **References** field, which is metadata a reviewer scanning a
run does not see. To find the SV-8798 cases by reading, he would have had to open case bodies and
recognise sentences buried in the middle of them.

This is the *identical* finding to the Vlad review of 6 August, written up in
`build/filters/vlad-gap-review-2026-08-06/ROOT-CAUSE.md`: *"There is no published list he could have
checked… The reason he had to do it at all is that we never gave anyone a map."* Four of the five
things Vlad got "wrong" were wrong for that reason.

**`STORY-COVERAGE.md`, published in this folder today, is that map** — for all three projects, not
just Filters.

---

## 4. WHAT IS *NOT* OUR FAILURE — AND THE DISTINCTION MATTERS

Three of the uncovered assertions on these two stories are **not** cases we forgot. The engineering
handover for this branch (`HANDOVER — App-Wide Filter Redesign`) states a product decision of
**2026-07-29** called **"adopt-only-existing"**: *"migrate only the filters a page has today; don't
invent new filter capabilities from the spec/Figma"*. It also lists what was deliberately **not**
migrated: the SV-8582-owned reports (TechnicianEfficiency, Sales, ServiceAdvisorAnalysis, Work In
Progress), the aging / as-of-date reports, the nav-orphan reports and the no-date reports.

| Assertion | Looks like | Actually is |
|---|---|---|
| `S13-R22` (b) — *"the scope is WIDER than the S14-R6 list"* | uncovered | **deliberately unbuilt.** A test would fail by design on every unmigrated page |
| `S14-R5` (b) — *"an app-wide sweep, not per-module"* | uncovered | **deliberately bounded** to the migrated set |
| `S13-R2/R3/R17/R18` (b) — exact colours, fonts and pixel widths | uncovered | **premature.** The handover says the components are *"not pixel-perfect yet"* and a Figma-fidelity pass is owed pending the PM's list of style deltas |

**Also relevant to his exact wording:** the handover's own "6 Reports" (Shop Billing Efficiency, My
Timesheets, Timesheet Activities, Notes, Reminders, Sales Tax) are **not** the six Report Suite
reports. If he was checking Story 13/14 coverage against the Report Suite reports, he was checking
the wrong six — those belong to epic SV-8582 and are explicitly out of this branch's scope.

**The genuine gaps of ours on these two stories are four:** `S13-R25` (b) cross-device,
`S13-R21` (b) mobile parity, `S13-R16` (b) tap-focus, `S13-R8` (b) keyboard and drag-selection.
They are proposed — not authored — in `GAPS.md`.

---

## 5. WHAT I WOULD SAY BACK TO HIM

Plain words, ready to forward:

> The cases do exist — six for Page Search and two for Global Search, all in the "Page Search
> Toolbar" section. One of them, C43561, is genuinely missing from your test run, because the run was
> built from a fixed list and four newer cases never got added; we will get that fixed. And you were
> right that the coverage is not complete: four things in the Page Search story have no case yet, and
> we have written them up. Thank you for saying something — there was no list for you to check
> against, which is our fault, and there is one now.

---

## OUTSTANDING — what I need from you

1. **Go-ahead to sync run 352** — add the 4 missing cases by UNION (`update_run`), snapshotting
   tests and results first. It is Ahtasham's run, so it is your call (Rule 6). **Until this is done
   he will keep reporting gaps that are not gaps.**
2. **Go-ahead to author the 4 genuine Story-13 gaps** listed in `GAPS.md`. Nothing has been written.
3. **Send him `STORY-COVERAGE.md`** — and Vlad too. The decisions register has the same problem: it
   lives in our repository and nobody outside the team has ever read it.
4. **Confirm the scope reading** — that `S13-R22`'s wider scope and `S14-R5`'s app-wide sweep are
   bounded by "adopt-only-existing", so our cases should stay scoped to the migrated pages rather
   than asserting the spec's literal wording.
