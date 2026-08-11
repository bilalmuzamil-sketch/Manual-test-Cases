# Filters — FINDINGS of the read-date sweep, 2026-08-11

Everything here was **found while doing the sweep** and is **recorded rather than silently fixed or
silently left** (Rule 41). Nothing in §2–§7 was acted on: each is either outside this pass's charter
or belongs to the QA lead.

---

## 1. The sweep itself — what it did, in numbers that gate both ways

| | |
|---|---|
| Our cases live under group 4110 | **114** (live total **119**; the other 5 are Ahtasham Amjad's — Rule 38) |
| Written | **114 of 114** — every one HTTP 200, 30 fields compared each, **0 mismatches, 0 collateral changes** |
| Already fully compliant before the pass | **0.** 18 cases carried a read-date, but **17 of them on the specification only** and the 18th (C29600) on the specification and the technical design — every one left the epic or the story undated, so **none met the per-source requirement** |
| Read-dates inserted | **231** across 114 cases |
| Cases carrying at least one read-date afterwards | **114 of 114** — 2 dates on 93 cases, 3 on 20, 5 on 1 |
| Sentence 2 altered | **0** |
| Raw markup | **0 of 114 at 13:56Z (pre-write) and 0 of 119 at 14:03Z (post-write)** |
| Run 352 | **undamaged** — 114 tests, 473 results all present by id, 0 graded-field changes |

**The specification was proven current by CONTENT, not by its version number**: the in-body "Version"
field reads `1.6` (Rule 31 trap (a)), so the live storage body was flattened and compared against our
committed v19 mirror — **whitespace-normalised sha256 identical**, 0 six-word runs either direction,
132/132 requirement anchors with sets equal both ways. Details in `SOURCE-CURRENCY.md`.

---

## 2. 🔴 THE EPIC HAS MOVED, AND ONE NEW CHILD CARRIES A BEHAVIOURAL STATEMENT THAT IS NOT IN SPEC v19

Our recorded baseline for epic **SV-8785** was **20 direct children** (2026-08-05). **Live today it is
21**, verified two independent ways with the key sets equal in both directions and no paging
remainder. The newest child is the one that matters:

**[SV-9041](https://shopview.atlassian.net/browse/SV-9041) — "Expand/collapse filter toggle
visibility"** · type **Task** · status **TESTING QA** · parent SV-8785 · created **2026-08-07
13:28Z** · **updated 2026-08-11 12:59Z, about forty minutes before this pass started**. Its whole
description, verbatim:

> *"Expand/collapse filter toggle should only be visible if there is more then 1 filter present on the
> page. If not then it shouldn't be visible and the filter is always shown"*

**Why this is a finding and not a note.** An epic's story or task is an **authoritative source of
expected behaviour** (Rule 57(b)). That sentence is a **conditional visibility rule for the collapse
toggle**, and **no requirement in specification v19 states it** — the 132 anchors were read live and
checked. We hold **six cases that assert the collapse toggle's behaviour without that condition**:

* [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) — the toolbar filter button collapses the bar
* [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) — expanding brings it back with active filters shown
* [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) — the collapsed/expanded state is remembered on return
* [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) — the collapsed button's blue indicator
* [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) — active filters keep filtering while collapsed
* [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) — mobile has no collapse toggle, the chip row is always visible

plus [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) (collapsing keeps an active
search working) and [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) (Parts and
Reports collapse as Work Orders do), which touch the same control on other pages — **and the Parts and
Reports pages are exactly where a "only if more than one filter" condition would bite**, because those
bars carry a different number of buttons per page.

**Not acted on, deliberately.** Deciding whether these cases need a condition added is a
**requirement-reconciliation job (Rule 43)** against a source we had not ingested when the pass began,
not a read-date edit — and it needs the QA lead's go-ahead. **What is owed: an ingest of SV-9041 and a
coverage verdict for it.** Logged for `build/OUTSTANDING-ITEMS-REGISTER.md`.

**The other new children are clarifications, not requirements**, and are recorded for completeness:
**SV-9076** (Done — mobile header search appearance, and the *"Create Work Order"* versus *"New Work
Order"* label, both raised against S13-R18/Story 14), **SV-8904**, **SV-8906**, **SV-8901**.

---

## 3. 13 specification mentions were deliberately LEFT UNSTAMPED, because they are not citations

Stamping a read-date onto these would assert that the specification supports an expectation it
**explicitly does not**. Two forms exist in this suite, and both were checked by reading the words
that immediately follow the mention:

**(a) "… has no numbered requirement for this" — 9 cases.** The specification is named only to record
that it is silent, and the expectation comes from a design, a PO answer or the tech plan instead:
**C38876, C38904, C38905, C38906, C38907, C38908, C38910, C38911, C43562.**

**(b) "… says instead that the Status chip is hidden on this tab" — 4 cases.** These are **Rule 56
divergence sentences**: the case follows Branko's 17 July answer, and the specification is named to
disclose that it differs. **C29559, C29609, C29610, C29612.**

All 13 still carry read-dates on the sources they **do** rest on — the epic, the owning story, and
Branko's answers file. **The mechanical test that separated them is in `tools/classify.py`** (the
`NEG_AFTER` list), so the decision is reproducible rather than a matter of taste.

**This repeats a finding the Schedule pass made on the same day**, where seven cases had the same
shape. It is now clear that a **negative mention of a source is a recurring feature of these suites**,
not a one-off, and any future automated stamper must handle it.

---

## 4. One `.md` pointer was left unstamped because it is OUR reading record, not a source

[C38909](https://shopview.testrail.io/index.php?/cases/view/38909) says *"our reading of it is recorded
in this file: build/handover-ingest-2026-08-10/FILTERS-RECONCILIATION.md"*. That file is **our note
about a source**, not the source, so it takes no read-date. **The source it describes — the engineering
handover for branch `SV-8785-app-wide-filter-redesign`, sections 3 and 8 — already carries an honest
`read on 10 August 2026`, and that was left exactly as found** (Rule 12 — overwriting it with today's
date would be back-filling). C38909 is the one case now carrying five read-dates: four inserted plus
that one.

---

## 5. ⚠️ C38882 NAMES THE WRONG PUBLICATION DATE FOR SPECIFICATION VERSION 19 — FOUND, NOT FIXED

[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) reads:

> *"It follows the NEWER wording of the Filters specification at Confluence version 19, **published on
> the afternoon of 4 August 2026**, which changed the date filter description …"*

**Version 19 was published 2026-08-06T11:48:47Z** — read live twice today. The other **107** cases
say *"(published 6 August 2026)"* and are right. **4 August afternoon is version 18's publication
slot.**

**Why it was not fixed here, and this is a judgement worth stating plainly:** the sentence is about
*which revision changed the date-filter description*, and that change may genuinely have landed in
**v18**, with v19 merely carrying it forward. So the correct repair is not a one-word date swap — it
needs a **v18-versus-v19 diff of that requirement** to establish which revision the case should name.
That is a spec-delta job, outside a read-date sweep. **A read-date was still added after the version
identifier** (*"version 19, read on 11 August 2026, published on the afternoon of 4 August 2026…"*),
which is evidentially correct — we did read v19 today — and deliberately **not** placed after the
publication-date clause, so the stamp does not appear to endorse it.

---

## 6. `case_refs` did NOT move on run 352, though playbook §J #2c predicts it can

Declared normalisation **#2c** (found 2026-08-10, Schedule) says `case_refs` on a run result is a
**stored snapshot that catches up when the case is next written**, and records it moving on **208**
run-357 records belonging to cases whose `refs` we never edited, purely because those cases were
touched by an unrelated `custom_expected` write.

**This pass wrote all 114 cases with an unrelated `custom_expected` change and `case_refs` moved on
0 of 473 records.** `case_title` moved on 0 as well.

**So the catch-up is CONDITIONAL, not automatic** — the same "treat every prediction about it as
unsafe" posture that normalisation #3 already earned. **The practical consequence is unchanged and
safe either way:** keep excluding both fields from the untouched-run comparison and verify on the
graded fields, exactly as #2b/#2c say. **Not edited into the playbook from this worker** — §J is
another pass's ground today; flagged for whoever owns it.

---

## 7. Smaller observations, all recorded and none acted on

**(a) One case cites no epic.** [C29600](https://shopview.testrail.io/index.php?/cases/view/29600)
names **story SV-8793** instead of the epic. It is still traceable — SV-8793 is a child of SV-8785 —
and its `refs` carries both a ticket and an anchor, so Rule 20 is satisfied. Recorded because it is the
only one of the 114 shaped that way.

**(b) 11 cases have never been checked against any build, and now say so consistently.** C29558,
C29559, C29600, C29609, C29610, C29612, C29621, C43560, C43561, C43562, C43563. **103 carry a build
line: 95 read `v3.4.2-d00239b` on 8/5/2026 and 8 read `v3.6-3e9dd6d` on 8/11/2026.** Note this against
the figure the pass was briefed with — *"106 build-verified, 8 not"* — **the live count is 103 and 11**;
the brief's figure appears to count the eight phone cases separately. Nothing was changed either way,
because this pass observed no build.

**(c) The Rule-41 whole-case re-read of all 114 was clean on every other check**: 0 stale requirement
anchors against live spec v19, 0 provenance naming a version other than 19, exactly one provenance
opening and one `AUTOMATION:` marker per case with nothing after it, 0 barred phrases, 0 uses of the
word "VIU", `refs` carrying both a Jira key and a spec anchor on all 114 with no entry over 248
characters, 0 API content outside an API section, 0 title over 80 characters, `---` separator present
on all 114.

**(d) The raw-markup census is 0 — of the moment it was taken, and of no other moment.** Measured over
all four tester-facing fields of all 119 live cases at **13:56Z** and again at **14:03Z**. TestRail
re-renders tester text into HTML **hours after** a write **without moving `updated_on` or
`updated_by`** (playbook §J hazard #5), so this figure is a measurement and never a durable state.
**Expect it to regress once a tester next works through these cases in the UI.**

**(e) The `/rest/api/3/search` JQL endpoint is GONE** — HTTP 410, *"The requested API has been removed…
migrate to /rest/api/3/search/jql"* (CHANGE-2046). The replacement **pages by `nextPageToken` and
reports no total**, so exhaustion is proven by `isLast`, not by a count. Already recorded in
`build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §5a; `tools/epic_check.py` here is a working example.

**(f) A sibling worker's broad commits swept this pass's tooling and snapshots into git before our own
commit** (`66188525` at 13:42 and `33017655` at 13:47). Nothing is lost — every file is committed and
pushed — but it means the pass's history is spread across commits that are not ours. Our own commits
used one explicit path each, as required.

---

## OUTSTANDING — what I need from you

1. **Ingest [SV-9041](https://shopview.atlassian.net/browse/SV-9041) and give it a coverage verdict.**
   It states a conditional visibility rule for the collapse toggle that **no requirement in
   specification v19 carries**, and we hold **eight cases** on that control which do not mention the
   condition (§2). This needs your go-ahead, because it is requirement reconciliation (Rule 43), not
   wording. **It blocks nothing today; it means eight cases may assert an unconditional behaviour the
   epic has since qualified.**
2. **A ruling on C38882's wrong publication date for version 19** (§5) — the honest repair needs a
   v18-versus-v19 diff of that requirement, which is a spec-delta pass, not a read-date edit.
3. **Whether the 21st epic child should change our baseline of record.** Our project notes say 20
   children; live is 21. Ours to update once you confirm nothing else has been read into the epic that
   we have missed.
4. **Nothing else.** The spec is current, all three PO answer files, the tech plan, the six cited
   stories and the design capture were read today, and the sweep itself is complete at 114 of 114.
