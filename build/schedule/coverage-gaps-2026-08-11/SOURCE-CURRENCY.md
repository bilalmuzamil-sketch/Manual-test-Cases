# Schedule — SOURCE CURRENCY (Standing Rule 31) — 2026-08-11

> Established as the **first action** of this pass, before any analysis (Rule 31), and re-read before the
> deliverables were written (Rule 59).
>
> **This pass makes ZERO TestRail writes, ZERO Jira writes, and creates nothing anywhere.** Every
> TestRail call was a `get_*`; every Jira call was a read; the only writing is these files into git.
> The Jira creation hold of 2026-08-10 is live (Rule 62) and nothing here tests it.

| | |
|---|---|
| **Sources read at pass start** | **2026-08-11 13:09Z** |
| **Sources re-read before the deliverables were written** | **2026-08-11 13:26Z** — spec version integer, epic child set |
| **Verdict of the second read** | **UNCHANGED.** Confluence still **v27** (`version.when` 2026-08-07T15:01:20.801Z, `body` 43,064 chars, sha256 identical); epic still **24** direct children. **No conclusion in this pass rests on a source that moved while it was being written.** |

---

## The sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule", space `SHOPVIEW` | **Confluence version 27**, `version.when` **2026-08-07T15:01:20.801Z**, by **Branko Cicovic**, comment *"Add §5.3 Panel collapse; toolbar row and cross-references"* | 2026-08-11, fetched live, **HTTP 200** | **CURRENT — and our mirror is CURRENT with it.** Unmoved for four days. **All 174 cases are now stamped version 27**, so the "168 stamped v23" finding of 2026-08-10 is **CLEARED**. |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **NOT OBSERVED THIS PASS** | — | **NOT APPLICABLE, deliberately and declared.** A coverage question is entirely document-side (Rule 57): the build supplies labels and the verdict, never the expectation. **No behaviour is claimed or implied anywhere in this pass** (Rule 12). `quick-login` and `switch-user` were **not called** — they rotate the shared session and siblings are live on this estate. |
| **C** | **The epic and its child stories** | Jira epic **SV-8685** | **24 direct children**, verified two independent ways — `parent = SV-8685` → **24** and `"Epic Link" = SV-8685` → **24**, key sets equal, `hasNextPage` **false**, no paging remainder (Rule 37 Tier-1) | 2026-08-11 | **CURRENT.** The **15-story set is unchanged** since 2026-08-10. One status moved: **SV-8921 Open → OBSOLETE**. **No full re-read was performed and none was asked for** (Rule 37 Tier-2 is user-gated). |
| **D** | **The designs** | Claude prototype `Schedule.dc.html` (Branko's Q0 artefact, ingested at `build/schedule/design-2026-07-27/`) · the live share link `claude.ai/design/p/d3cdcf5c-…?file=Schedule.dc.html&via=share` cited by SV-8915/8916/8917 · **and now by story SV-8700's own UI/UX field** | prototype: **no version, no date**; share link: **no version, no date, live and editable** | 2026-08-11 | **PARTIAL — and materially so.** Exact shortfall: **we cannot date the share link at all**, so Rule 32's latest-wins cannot be applied to it (Rule 57 follow-up (i)); we cannot tell whether it is the artefact we hold; and **~48 of our Schedule labels were pinned from the prototype**. Design is an authoritative source since 2026-08-06, which makes this **bigger** than it was, not smaller. **Not fetched this pass** — it is not needed for a requirement→case map, and fetching an undated artefact would not make it datable. |
| **E** | **The engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | **2026-07-29**, as supplied | 2026-08-11 | **PARTIAL — no newer version supplied and no way to check for one.** It is a file we were given, not a source we can re-fetch, so "current" cannot be asserted (Rule 12). **Five cases rest on it** and five provenance lines still under-cite it (see `FINDINGS.md` §6). |
| **F** | **The two shared `.md` files** | `af54d7ba-Schedule_scheduledesignreview20260805.md` (Fabian / Sasha, **dated Aug 5 2026** in its own header) · `ed9bc33e-FIlters_HANDOVERAppWideFilterRedesign.md` (Filters — **not a Schedule source**) | design review: **Aug 5 2026** · handover: no version, no date | 2026-08-11 | **CURRENT as artefacts · PARTIAL as scope decisions.** Ingested 2026-08-10 at `build/handover-ingest-2026-08-10/` — 21 testable statements, one verdict row each. **Not re-ingested here; carried, and declared as carried.** Source (g) of Rule 57 since 2026-08-10. |
| **G** | **PO / stakeholder answers and messages** | Branko's recorded answers · the **6 August question sheet** · SV-8915 (OBSOLETE) / SV-8916 (Blocked) / SV-8917 (TESTING QA) · the two clarification Tasks SV-8992 and SV-9020 | 6 August sheet **written and STILL NOT SENT** | 2026-08-11 | **CURRENT as a record — and the largest item in it has never left our hands.** `build/filters/questions-2026-08-06/` holds **20 items, 8 of them Schedule**. **The blocker is us, not Branko**, and three of our cases say so in their own automation markers. |

---

## A — the specification: how the version was read, and the trap it is the standing example of

**Trap (a) — the in-body "Version" field is a lie, confirmed again today.** The page body's own header
table still reads **`Version | 1.0`** and **`Last Updated | July 15, 2026`**, exactly as it has since
version 1. **The page is at Confluence version 27.** Only the Confluence version integer is a reliable
currency marker for this page.

**How the integer was obtained, stated honestly.** The Atlassian MCP's `getConfluencePage` returns the
body and a `lastModified` but **does not expose `version.number`**. The integer, the `version.when`
timestamp, the author and the version comment were read from
`/wiki/rest/api/content/713031682?expand=version` (**HTTP 200**). **So the version number here was read,
not inferred.**

**And it was byte-checked, not taken on the number alone (Rule 50).** The live body was re-fetched and
its sha256 compared against the 2026-08-10 mirror:

```
4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b   raw-v27.xml  (2026-08-10 mirror)
4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b   re-fetched live 2026-08-11
```

**Identical.** A version number matching is not evidence the body matches — Rule 31's whole point is that
staleness markers lie — so the hash is what carries the claim.

### Trap (c) applied properly: every requirement this pass turns on was DATED against all 27 versions

**A page version dates the PAGE, not the rule inside it.** A page republished four days ago can carry a
requirement untouched for four weeks, and getting this wrong applies Rule 32's latest-wins **backwards** —
the exact error that cost us two Filters cases on 2026-08-06. So each requirement was dated by fetching
**all 27 historical bodies** and probing its own literal text. Tool: `tools/date_requirements.py`;
full matrix: `evidence/requirement-dating-2026-08-11.json`; bodies cached at `evidence/versions/`.

| Requirement literal | First appears | Date it actually entered the spec | In v27? |
|---|---|---|---|
| `chosen from the user menu and persisted per user` (§11 dark theme) | **v19** | **2026-07-23** | yes |
| `user-selectable Light / Dark theme` (§11) | **v19** | 2026-07-23 | yes |
| `elevation/shadow tokens also swap` (§11) | **v19** | 2026-07-23 | yes |
| `the overflow uses shape` (§11 accessibility) | **v1** | **2026-07-15** | yes |
| `not color-only` (§11) | **v1** | 2026-07-15 | yes |
| `per-assigned technician` (§4.12 tooltip) | **v26** | **2026-08-07T11:02:57Z** | yes |
| `a per-technician breakdown` (the wording it replaced) | **v1** | 2026-07-15 | **no — gone at v26** |
| `block the spread step from placing shifts on those days` (§12) | **v1** | **2026-07-15** | yes |
| `Shop closures and public holidays are not skipped in V1` (§4.5) | **v22** | **2026-07-27** | yes |
| `The full 24-hour timeline remains intact and scrollable` (§4.8) | **v6** | 2026-07-17 | yes |

**Three of those rows changed a verdict in this pass, and none of them could have been reached from the
page's version number:**

1. **The §11 gaps are NOT fresh spec churn — they are 19 and 27 days old.** `the overflow uses shape` has
   been in the document **since version 1**, and the dark-theme sentence since **v19**. That is less
   comfortable than "the spec moved under us", and it is the honest reading.
2. **The §4.12 narrowing is confirmed genuinely newer** — `per-assigned` (v26) replaced wording that had
   stood for 25 versions, so following it is Rule 32 pointing forwards, not backwards.
3. **The shop-closure contradiction is NOT symmetrical, which nobody had established.** §12's sentence
   dates to **v1**; §4.5's *"not skipped in V1"* was **added at v22, twelve days later**, and Branko has
   edited the page **five times since** without removing either. See `FINDINGS.md` §5 — it lowers the risk
   on two held cases without resolving the question.

**Versions 10, 12 and 14 are truncated partial saves** (7,314 / 8,632 / 5,918 chars against ~40,000 for
their neighbours) and are **excluded from the dating logic**. They are named here so the gaps in the
matrix are never misread as removals. **24 versions were used for dating; 27 were fetched.**

---

## C — the epic, read-only

| Key | Type | Status | Note |
|---|---|---|---|
| SV-8686 … SV-8700 | Story ×15 | 8 TESTING QA · 7 QA Complete | **unchanged set since 2026-08-10** |
| SV-8812 | Task | Done | the QA environment |
| SV-8915 / SV-8916 / SV-8917 | Bug ×3 | OBSOLETE / Blocked / TESTING QA | the 5 August design review |
| SV-8921 | Bug | **OBSOLETE** | **status moved since 2026-08-10** (was Open) — a technician on the grid with no Staff record |
| SV-8992 | Task | Board Backlog | a PRD clarification: should grid search scroll to the first match? |
| SV-8993 | Bug | Ready to Fix | **not a Schedule defect** (staff resend-invitation link); parented here |
| SV-9020 | Task | Board Backlog | a PRD clarification: should changing the mini-calendar month/year navigate the grid? |
| SV-9083 | Task | Board Backlog | improvement: conflicts and overtime share the same amber |

**Ticket status was not used as evidence about the build anywhere in this pass (Rule 61).** Where a
ticket is cited it is cited for **what somebody wrote in it**, which is a source; never for its status,
which is not. SV-8921's move to OBSOLETE changes nothing in this map for exactly that reason.

**One story was read in full because it settles an ownership question this pass had to answer:
[SV-8700](https://shopview.atlassian.net/browse/SV-8700) "View Options, Color System & Display
Customization".** Its **requirement 5** is the §11 dark-theme rule almost verbatim — *"Dark theme: built
on design-system color tokens. Surfaces, borders, text, accents, and elevation/shadow tokens remap
automatically. User-selectable from user menu, persisted per user."* — and its acceptance criteria carry
*"Given dark theme is selected, when viewing the schedule, then all surfaces, text, and borders use
dark-mode design tokens."* **So the owning story for the dark-theme gaps is SV-8700, not the epic**, and
the two staged cases cite it. Our existing dark-theme case C38866 cites only the epic; that is a
provenance under-citation, recorded in `FINDINGS.md` §6.

---

## The suite, read read-only

| | |
|---|---|
| Sections holding our cases (group 4254 and its descendants) | **31** |
| Live cases in those sections | **174** |
| **Ours** (`created_by = 3`, Bilal Muzamil) | **174** |
| **Foreign** | **0** |

**The honest two-number report for Schedule is `ours 174 / live total 174`** (Rule 38). There is no
foreign case in this group, so the **reverse-coverage diff has nothing to diff against and produces no
candidate gap from that lens** (Rule 45(a)) — unlike Report Suite, where it found real coverage. Stated
rather than left as an unexplained absence.

**The suite has moved since the 2026-08-10 map, substantially, and that is why this pass re-derived
rather than trusted it:**

| | 2026-08-10 | 2026-08-11 (live) |
|---|---|---|
| Cases | 168 | **174** (+6, the §5.3 panel family C43582–C43587) |
| Cases stamped specification version 23 | **168** | **0** |
| Cases stamped specification version **27** | 0 | **174** |
| `custom_atmstatus = 3` ("Automated") | 31 | **0** — all 174 now `1`, the Rule-64 correction |
| `AUTOMATION: READY` | — | **146** |
| `AUTOMATION: HOLD` | — | **28** |
| `AUTOMATION: READY - EXPECT FAIL` | 21 | **0** — the Rule-61 amendment of 2026-08-11 |
| Cases carrying a Rule-54 **read-on date** | 0 | **26 of 174** |

146 + 28 = **174** ✔. **Every one of the 174 was updated after 2026-08-10 12:00Z**, which is precisely
why the 282 COVERED verdicts could not simply be carried forward — see `COVERAGE-REDERIVATION.md` §2 for
the mechanical re-check that was run instead.

## Run 357, read-only, for the record

`include_all` **false** · **174** tests · **it belongs to Ayesha Khan**. This pass made **no
`update_run`, no `add_result`, and no case add / update / delete anywhere** — there is no before/after to
prove, only the absence of any write call. The client at
`build/schedule/coverage-rederivation-2026-08-10/tools/tr.py` **has no write path in it at all**.

---

## OUTSTANDING — what I need from you

1. **A go-ahead to push the three staged items** in `NEW-CASES.md` — 2 `add_case` + 1 `update_case`.
   Nothing is executed (Rules 6 / 62). **A later authorised pass owns the writes; another worker owns
   TestRail for Schedule right now.**
2. **Send the 6 August Branko sheet.** It carries 8 Schedule items including the shop-closure
   contradiction that holds three cases. **The blocker is us, not Branko**, and it has been for five days.
3. **Confirm which design artefact is canonical for Schedule** — source D is PARTIAL and cannot be dated,
   and design is now an authoritative source of expected behaviour. **~48 of our labels rest on the
   prototype.**
4. **A ruling on the read-on-date sweep.** Rule 54 as amended on 2026-08-11 requires a read-date per
   source on every case. **148 of 174 do not carry one.** That is 148 writes and it is not this pass's.
5. **Whether a technical design carries PRD-level authority** — Rule 30 versus Rule 57(d3), still
   unanswered, and Schedule is the project where it bites (source E is PARTIAL and five cases rest on it).
