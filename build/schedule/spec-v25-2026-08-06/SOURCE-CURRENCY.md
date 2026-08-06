# Schedule — SOURCE CURRENCY (Standing Rule 31) — 2026-08-06

> Established at the **start** of this pass and **re-read immediately before the write phase**
> (Standing Rule 59). This pass makes **no TestRail writes, no Jira writes and no run writes** —
> the "write phase" here is the writing of these deliverables to git.
>
> | | |
> |---|---|
> | **Sources read at pass start** | **2026-08-06 13:10Z** |
> | **Sources re-read at write start** | **2026-08-06 13:19Z**, and **again at 13:33Z** immediately before the final commit (spec version, build marker, epic child set) |
> | **Verdict of the second read** | **UNCHANGED.** Spec still **Confluence v25** (`version.when` 2026-08-06T09:13:51.655Z, identical). Build still **`v3.5-d64ba62`** with `index.html` **byte-identical by sha256 across both reads** (`add638c5…`), same etag, same last-modified — **so nothing redeployed under this pass**. The epic child set is unchanged at 19. **No conclusion in this pass rests on a source that moved while it was being written.** |
> | **The build had ALREADY moved before the pass began** | Recorded rather than glossed — see **B** below. It is the ordinary Rule-60 consequence, not an alarm, but it means **none of the 168 verdicts was taken on the build now running**. |

---

## The five sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Date checked | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule", space `SHOPVIEW` | **Confluence version 25**, `version.when` **2026-08-06T09:13:51.655Z**, by **Branko Cicovic**, version comment **empty** | 2026-08-06 13:10Z and 13:19Z | **CURRENT — and our baseline was STALE by two versions (v23 → v25). That gap is what this pass closes.** |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **`v3.5-d64ba62`** · `index.html` last-modified **Thu 06 Aug 2026 12:56:44 GMT** · etag `abb0ecadcdbad3eaa5425958ace18385` · sha256 `add638c575bc4365c8086df851fa08ed11ce277dd96b0517eeef0f2956a00d91` | 2026-08-06 13:19Z | **PARTIAL — the marker is readable, the application is NOT.** Exact shortfall: `index.html` is a public S3 object so the build marker was read directly, but `sv8685api.qa.shopview.com/api/auth/me/fe-permissions` returns **HTTP 401** — the application is SSO-walled, so **no behaviour was observed in this pass and none is claimed** (Rules 12/49). `quick-login` and `switch-user` were **deliberately not called** (they rotate the shared session and would sign a sibling worker out). |
| **C** | **The epic and its child stories** | Jira epic **SV-8685** | **19 direct children**, verified two independent ways — `parent=SV-8685` → 19 and `"Epic Link"=SV-8685` → 19, **key sets equal in both directions, `isLast` true, no paging remainder** | 2026-08-06 13:14Z | **CURRENT.** 15 stories SV-8686…SV-8700 · 1 Task SV-8812 (Done) · **3 Bugs SV-8915/8916/8917 (Sasha Grosman)**. The **55** Story Defects sit under the individual **stories**, not the epic, which is why a `parent=SV-8685` count of 19 is correct and not a shortfall. |
| **D** | **The designs** | `build/schedule/design-2026-07-27/` — the Claude prototype `Schedule.dc.html` Branko ruled authoritative at **Q0** | **no version, no date on the artefact** | 2026-08-06 | **PARTIAL — and this is the material one.** Exact shortfall: **three tickets raised on 2026-08-05 (SV-8915, SV-8916, SV-8917) all cite a DIFFERENT design URL** — a live, editable `claude.ai/design/p/…?via=share` link carrying **no version and no date** — and **~48 of our Schedule labels were pinned from the artefact we hold**. **We cannot tell whether the two are the same document.** The design was **deliberately NOT fetched**: the QA lead's authorisation is conditional — *"Yes if Sasha's design is final"* — and **that condition is not established**. Full write-up: `DESIGN-SOURCE.md`. |
| **E** | **The engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | **2026-07-29**, as supplied | 2026-08-06 | **PARTIAL — no newer version has been supplied, and we have no way to check for one.** Exact shortfall: the plan is a file we were given, not a source we can re-fetch, so "current" cannot be asserted (Rule 12). Two cases anchor to it rather than to the spec — SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) and SCH-REG-01 — which is deliberate and recorded. |
| **F** | **PO / stakeholder answers and messages** | Branko's recorded answers + **two Jira comments dated TODAY** | **Branko on SV-8829, 2026-08-06T09:31:05Z** · **Stefan Vukovic on SV-8874, 2026-08-06T08:15:35Z** and **on SV-8917, 2026-08-06T13:03:11Z** · **Milos Vasic on SV-8874, 2026-08-06T08:32:34Z** | 2026-08-06 13:15Z | **CURRENT — and NEWER than the specification on one point.** Branko's SV-8829 comment is **17 minutes LATER than Confluence v25** and rules on something v25 does **not** carry. See `SPEC-DIFF.md` row **D-A/3**. |

**Timestamps: the Jira REST API returns `-0500` offsets on this instance and they have been converted
to UTC throughout.** This is called out because a `-0500` value read as UTC produced a false "28
minutes" claim on another project on 5 August; every Jira time in these deliverables is UTC.

---

## A — the specification, and the two traps it is the canonical example of

**Trap (a) — the in-body "Version" field is a lie, confirmed again.** The page body's own header table
still reads **`Version | 1.0`** and **`Last Updated | July 15, 2026`**, exactly as it has since
Confluence version 1. The page is at **version 25**. **Only the Confluence version number is a
reliable currency marker for this page.**

**Trap (c) — a page version dates the PAGE, not the rule inside it.** Applied here by tracing each
delta string across **all 25 historical bodies**. Both deltas turn out to be genuinely new, so no
inversion risk materialised — but the check is what establishes that, and it is recorded in full in
`SPEC-DIFF.md` §2. Note the corollary that **did** bite: the *removed* sentence was **~20 days old**
(introduced in v7 on 2026-07-17) and the *replaced* phrase was **the original wording, unchanged
across 24 versions since v1**. Neither age is visible from the page's version number.

**There is NO change-log section on this page**, and the version comment is **empty on both v24 and
v25**. So the mandatory change-log → verdict linkage check has **zero anchors to extract**:

> **anchors in diff = 2 · anchors in change-log = 0 (the page carries no change log) · rows in the
> verdict table = 4 · unmatched = 0.**

That absence is itself worth stating: on this page there is **no PO-authored second enumeration of
what changed**, which is precisely why our baseline was able to drift five versions in July and two
versions now.

---

## Version-by-version metadata, all 25 pulled

| Version | `version.when` (UTC) | Author | Body length | Note |
|---|---|---|---|---|
| 1 | 2026-07-15T21:17:56Z | Branko Cicovic | 28,735 | first save; `labor/total figures` present from here |
| 7 | 2026-07-17T10:10:41Z | Branko Cicovic | 32,301 | the §6 Search toolbar row **and its fade/highlight sentence** first appear |
| 10 · 12 · 14 | 2026-07-17 | Branko Cicovic | 7,314 · 8,632 · 5,918 | **partial intermediate saves** — truncated bodies, not real requirement states; excluded from the dating logic and named here so the gaps in the marker table are not read as removals |
| 18 | 2026-07-22T09:18:11Z | Branko Cicovic | 55,573 | the baseline our July pass was working from |
| 23 | 2026-07-30T10:40:32Z | Branko Cicovic | 58,584 | **our current `requirements.md` baseline** |
| **24** | **2026-08-06T08:34:03Z** | **Branko Cicovic** | **58,531** | **deletes the §6 fade/highlight sentence** (−53 chars) |
| **25** | **2026-08-06T09:13:51Z** | **Branko Cicovic** | **58,532** | **`labor/total` → `labor/status` in §4.9** (+1 char) |

---

## B — the build, honestly

**The branch has redeployed since our own full live pass this morning.** That pass recorded 90 cases
on `v3.5-7ec992f` and 78 on `v3.5-d122eef`. The build running now is **`v3.5-d64ba62`**, so
**none of the 168 verdicts was taken on the build that is live.** Under **Rule 60** that is the
ordinary consequence of a branch that is never declared final, **not an alarm** — and under
**Rule 60(b)** what it invalidates is layer 1 (labels and navigation) and layer 2 (the verdict), not
the documented expectations.

**The deploy is corroborated and roughly dated by a third party:** Stefan Vukovic commented on
**SV-8917** at **13:03:11Z** *"Fixed and deployed to sv8685.qa"*, and the build's `last-modified` is
**12:56:44Z** — six and a half minutes earlier. That is consistent, and it means **at least one
on-screen label changed in this deploy** (see `PROPOSED-CHANGES.md` §3).

**The Rule-49 queue `build/schedule/full-viu-2026-08-05/RECHECK-QUEUE.md` remains OPEN, the branch is
NOT declared final, and every one of the 168 verdicts stays PROVISIONAL.** This pass adds nothing to
that queue's rows and closes none of them.

---

## C — the epic, and what changed in it since our ingest

Nothing in the **story set** moved. What moved is **status** and **defect volume**, neither of which
changes a requirement:

- **SV-8686, SV-8688, SV-8687** are now **TESTING QA** (were Ready for QA).
- **SV-8915 is now OBSOLETE/Done**, closed by Branko; **SV-8916 is Blocked**; **SV-8917 is TESTING QA**.
- **55 Story Defects** now hang off the 15 stories.

**Ticket status was not used as evidence about the build anywhere in this pass (Rule 61).** Where a
ticket is cited below it is cited for **what somebody wrote in it**, which is a source, not for its
status, which is not.

---

## Foreign-coverage check (Rule 38 / 45(a)), run read-only in this pass

| | |
|---|---|
| Sections holding our cases | **29** |
| Live cases in those sections | **168** |
| **Ours** | **168** (every one `created_by = 3`, Bilal Muzamil) |
| **Foreign** | **0** |

So the honest two-number report for Schedule is **ours 168 / live total 168**. There is no foreign
case in this group to diff against in either direction, and therefore **no candidate gap from that
lens** — unlike Report Suite, where the reverse diff found real coverage.

## Run 357, read-only

`include_all` **false** · **168** tests · **429** result records · counters 0 passed / 0 failed /
0 blocked / 168 untested. Read once, for the record. **This pass wrote nothing to it** — no
`update_run`, no `add_result`, no case adds or deletes anywhere — so there is no before/after to
prove, only the absence of any write call.

---

## OUTSTANDING — what I need from you

See `QUESTIONS-FOR-BRANKO.md` for the product questions and
`build/OUTSTANDING-ITEMS-REGISTER.md` rows **C3** and **C4**, which this pass advances but does not
clear.
