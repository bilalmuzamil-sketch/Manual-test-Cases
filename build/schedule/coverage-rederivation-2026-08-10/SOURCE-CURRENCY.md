# Schedule — SOURCE CURRENCY (Standing Rule 31) — 2026-08-10

> Established **before** any of this pass's work, and re-read before the deliverables were written
> (Rule 59). This pass makes **no TestRail writes, no Jira writes, no run writes and creates no Jira
> ticket** (Rules 6 and 62) — the only writing is these files into git.

| | |
|---|---|
| **Sources read at pass start** | **2026-08-10 15:56Z** |
| **Sources re-read before the deliverables were written** | **2026-08-10 16:09Z** — spec version, epic child set |
| **Verdict of the second read** | **UNCHANGED.** Confluence still **v27** (`version.when` 2026-08-07T15:01:20.801Z, identical); epic still **24** direct children. No conclusion here rests on a source that moved while it was being written. |

---

## The five sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Date checked | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule", space `SHOPVIEW` | **Confluence version 27**, `version.when` **2026-08-07T15:01:20.801Z**, by **Branko Cicovic**, version comment **"Add §5.3 Panel collapse; toolbar row and cross-references"** | 2026-08-10 | **CURRENT — and our baseline was STALE by two versions (v25 → v27), while every one of the 168 cases is stamped v23, four versions behind.** |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **NOT READ THIS PASS** | — | **NOT APPLICABLE, deliberately.** No Schedule QA sign-in was supplied, none was needed, and `quick-login` / `switch-user` were **not called** because they rotate the shared token and a sibling worker is live on the Reports branch. Under Rule 57 a coverage question is entirely document-side: the build supplies labels and verdicts, never the expectation. **No behaviour is claimed or implied anywhere in this pass** (Rules 12 / 49). |
| **C** | **The epic and its child stories** | Jira epic **SV-8685** | **24 direct children**, verified two independent ways — `parent = SV-8685` → 24 and `"Epic Link" = SV-8685` → 24, **key sets equal, `hasNextPage` false, no paging remainder** | 2026-08-10 | **CURRENT — and it has grown by 5 since 2026-08-06 (was 19).** Detail below. |
| **D** | **The designs** | The Claude prototype `Schedule.dc.html` ruled authoritative at Branko's Q0, plus the **Fabian / Sasha design review of 5 August** | prototype: **no version, no date**; review: **2026-08-05** | 2026-08-10 | **PARTIAL — unchanged from 2026-08-06 and still material.** Exact shortfall: SV-8915/8916/8917 all cite a **live, editable `claude.ai/design/p/…?via=share` link carrying no version and no date**, and we cannot tell whether it is the same document as the artefact we hold. Design is now an authoritative source under Rule 57 as amended, which makes the un-versioned link a bigger problem than it was, not a smaller one. Already asked as **Tab 2 Item 4.0** of the 6 August Branko sheet. |
| **E** | **The engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | **2026-07-29**, as supplied | 2026-08-10 | **PARTIAL — no newer version supplied and no way to check for one.** It is a file we were given, not a source we can re-fetch, so "current" cannot be asserted (Rule 12). **Five cases rest on it**; see `ORPHANS.md` §2, which finds that five of them name only the specification in their provenance line. |
| **F** | **PO / stakeholder answers and messages** | Branko's recorded answers; the 6 August question sheet; three Jira tickets from the design review | 6 August sheet **written and NOT SENT**; SV-8915 (OBSOLETE), SV-8916 (Blocked), SV-8917 (TESTING QA) | 2026-08-10 | **CURRENT as a record — but the largest single item in it has never left our hands.** `build/filters/questions-2026-08-06/` holds **20 items, 8 of them Schedule**, and it has not been sent. Two of our cases say so on themselves. |

---

## A — the specification, and the two traps this page is the standing example of

**Trap (a) — the in-body "Version" field is a lie, confirmed again.** The page body's own header table
still reads **`Version | 1.0`** and **`Last Updated | July 15, 2026`**, exactly as it has since
version 1. **The page is at Confluence version 27.** Only the Confluence version integer is a
reliable currency marker for this page, and it is what every statement in this folder cites.

**How the version integer was obtained, stated honestly.** The Atlassian MCP tool
`getConfluencePage` returns the body and a `lastModified` of **"Aug 07, 2026"** but **does not expose
the version integer**. The integer, the `version.when` timestamp, the author and the version comment
were read from the REST endpoint
`/wiki/rest/api/content/713031682?expand=version` (HTTP 200), and the historical bodies from the same
endpoint with `&version=N`. **So the version number here was read, not inferred.** The reusable
fetcher is `tools/fetch_spec.py`.

**A serialization change that is NOT content loss, recorded because the byte count looks alarming.**
v26's storage body is **58,541 chars** and v27's is **43,064** — a 15,477-char drop. It is entirely
the removal of **216 `ac:local-id` attributes** (v26 has 216, v27 has 0): Confluence re-serialized the
page on save. **Content-line extraction rises from 334 to 345 lines**, so nothing was deleted.
Anyone re-running this comparison would otherwise reasonably suspect a quarter of the page had gone.

**Trap (c) — a page version dates the PAGE, not the rule inside it.** Applied by fetching **all 27
historical bodies** and testing each new string against every one of them. Full matrix:
`evidence/string-dating-all-27-versions.json`.

| String | First appears | Meaning |
|---|---|---|
| `Panel collapse` (the §5.3 heading) | **v27** | genuinely new, 2026-08-07 |
| `panel-left icon` · `Hide panel` · `Show panel` · `State preservation` · `Session-scoped per user for build` | **v27** | genuinely new |
| `Panel toggle` (the §6 toolbar row) | **v27** | genuinely new |
| `handing its width to the grid` (the §3.1 sentence) | **v27** | genuinely new |
| `per-assigned technician` | **v26** | new on **2026-08-07T11:02:57Z** |
| `a per-technician breakdown` (the wording it replaced) | **v1** | **unchanged for 26 versions before it moved** |
| `The full 24-hour timeline remains intact and scrollable` | **v6** | ~3 weeks old; **relevant to E11**, which argues against it |
| `Add Existing Work Order` | **never** | 0 occurrences in any of the 27 versions |
| `carryover` | **never** | 0 occurrences in any of the 27 versions |

**v10, v12 and v14 are truncated partial saves** (7,314 / 8,632 / 5,918 chars) and are excluded from
the dating logic; they are named here so the gaps in the matrix are not read as removals.

**The change-log → verdict linkage check, and a correction to our own earlier record.** The
2026-08-06 pass wrote that *"there is NO change-log section on this page"*. That is true of the page
BODY, but **not of the version comments**, which this pass pulled in full
(`tools/fetch_spec.py history`). The real shape is sharper than "no change log":

> **v3 through v16 carry descriptive version comments** (*"Add day-view auto-scroll to business
> hours"*, *"Add global keyboard shortcuts"*, *"Change default hours to 7 AM - 7 PM"*). **Then v17
> through v26 — ten consecutive versions — carry EMPTY comments.** **v27 breaks that silence** with
> *"Add §5.3 Panel collapse; toolbar row and cross-references"*.

**Those ten silent versions include v23, the version stamped on all 168 of our cases, and v25, our
previous mirror.** So the period in which our baseline drifted is exactly the period in which Branko
stopped annotating his own edits. That is worth saying plainly rather than filing as trivia: it is
the mechanism, not a coincidence.

For v27 the linkage check can finally be run. The comment names three items; our diff found exactly
three change blocks: §5.3 (8 lines), the §6 toolbar row (2 lines), and two cross-references (§3.1
and §11).

> **anchors in the version comment = 3 · anchors in our diff = 3 · rows in the verdict table = 4 ·
> unmatched = 0.** The fourth row is the **v26** `per-assigned technician` change, which carries
> **no version comment at all** — an unannounced edit to a sentence that had stood since v1. That is
> the drift class Rule 31 exists for, and it is the one that produced a real case impact.

---

## C — the epic, and what changed in it since 2026-08-06

**24 direct children, up from 19.** Nothing in the 15-story set moved. What moved is defect and
question volume:

| Key | Type | Status | Note |
|---|---|---|---|
| SV-8686 … SV-8700 | Story ×15 | 7 TESTING QA · 8 QA Complete | unchanged set |
| SV-8812 | Task | Done | the QA environment |
| SV-8915 / SV-8916 / SV-8917 | Bug ×3 | OBSOLETE / Blocked / TESTING QA | the 5 August design review |
| **SV-8921** | Bug | **Open** | *new*, Ayesha Khan — a technician on the grid with no Staff record (cites §14.4) |
| **SV-8992** | Task | **Board Backlog** | *new*, Ayesha Khan — **a PRD clarification**: should grid search scroll to the first match? |
| **SV-8993** | Bug | Ready to Fix | *new*, Mudassir Qamar — **not a Schedule defect at all** (staff resend-invitation link); parented here |
| **SV-9020** | Task | **Board Backlog** | *new*, Ayesha Khan — **a PRD clarification**: should changing the mini-calendar month/year navigate the grid without a date click? |
| **SV-9083** | Task | Board Backlog | *new*, Mudassir Qamar — improvement: conflicts and overtime share the same amber |

**SV-8992 and SV-9020 are relevant to this map and are recorded as such.** Both are open questions
about behaviour the spec does not state — §6 grid search, and §3.1/§5.2 mini calendar. Neither is a
coverage gap of ours: our cases assert what the spec does say, and the unstated half is exactly what
those tickets are asking about. They are listed in `GAPS.md` as *spec-silent, question already
raised by someone else*. **Nothing was written to either ticket** (Rules 38 / 62).

**Ticket status was not used as evidence about the build anywhere in this pass (Rule 61).** Where a
ticket is cited it is cited for what somebody wrote in it, which is a source; not for its status,
which is not.

---

## Foreign-coverage check (Rules 38 / 45(a)), read-only

| | |
|---|---|
| Sections holding our cases (group 4254 and its descendants) | **31** |
| Live cases in those sections | **168** |
| **Ours** | **168** — every one `created_by = 3`, Bilal Muzamil |
| **Foreign** | **0** |

The honest two-number report for Schedule is **ours 168 / live total 168**. There is no foreign case
in this group, so the reverse-coverage diff has nothing to diff against and **produces no candidate
gap from that lens** — unlike Report Suite, where it found real coverage. That is stated rather than
left as an unexplained absence.

## Run 357, read-only, for the record

`include_all` **false** · **168** tests · **429** result records · counters **0 passed / 0 failed /
0 blocked / 168 untested**. **It belongs to Ayesha Khan.** This pass made **no `update_run`, no
`add_result`, no case add / update / delete anywhere** — there is no before/after to prove, only the
absence of any write call. The read-only client in `tools/tr.py` has no write path in it at all.

## The four counts

| | |
|---|---|
| Live cases under group 4254 | **168** |
| Local active case bodies (195 authored − 27 retired) | **168** |
| `build/schedule/testrail-id-map.csv` rows | **168** |
| Cases examined in Direction 2 | **168** |

**Set-equal in both directions.** No deliverable was regenerated in this pass, deliberately: nothing
about the case source changed, and `gen_import.py` is known to blank the id-map C-ids and drop the
`refs` column on every rerun.

---

## OUTSTANDING — what I need from you

1. **A go-ahead to author the §5.3 panel-collapse coverage** — the single real gap, 20 assertions.
   Proposed in `GAPS.md`, **not authored** (Rule 6).
2. **A go-ahead for the staged case changes** in `PROPOSED-CHANGES.md` — 8 cases, all read-only-staged.
3. **The 6 August Branko sheet has still not been sent.** It carries 8 Schedule items, including the
   shop-closure contradiction that puts two of our cases on HOLD. **The blocker is us, not Branko** —
   two cases say so in their own automation marker.
4. **One new question for Branko**, in `QUESTIONS-FOR-BRANKO.md` — the v26 `per-assigned technician`
   change. It is one row, and it is deliberately **not** a duplicate of anything on the 6 August sheet.
5. **A decision on whether to share this map** with the two reviewers, which is what it was built for.
