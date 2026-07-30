# Schedule — Epic SV-8685 re-check vs our ingest

> **Verdict in one line: the Schedule epic is UNCHANGED since we ingested it. Nothing to author, nothing to edit, no contradictions.**

- **Epic:** SV-8685 — "Schedule — Technician Scheduling Module" · status **Open** · PO **Branko**
- **Our ingest:** 2026-07-28 (`build/schedule/epic-sv8685/`, committed `98251499` 2026-07-28 08:04 UTC)
- **This re-check:** 2026-07-31, live Jira REST v3 (`GET /rest/api/3/myself` = HTTP 200 as Bilal Muzamil)
- **Raw evidence:** `raw/SV-8685-epic.json`, `raw/SV-8685-children-full.json`, `raw/SV-8685-children-index.json`, `raw/SV-8685-analysis.txt`
- **Live-build check:** none needed for this task (Rule 22) — this is a Jira-source recheck only. Nothing here is claimed as build-verified.

## 1. Story count then vs now

| | Then (our ingest) | Now (live 2026-07-31) |
|---|---|---|
| Child stories | **15** (SV-8686 … SV-8700) | **15** (SV-8686 … SV-8700) |
| NEW stories | — | **0** |
| REMOVED / moved out | — | **0** |
| RENAMED | — | **0** |

Enumerated two independent ways and cross-checked (Rule 17): JQL `parent = SV-8685` = **15**, JQL `"Epic Link" = SV-8685` = **15**, and the two key sets are **identical** — no paging remainder. Exact total found: **15 children + 1 epic = 16 issues.**

## 2. Status changes

**Zero.** All 15 children are still **Open**, exactly as at ingest. The epic itself is still **Open**.

- **Nothing has moved to Done** → nothing has shipped, so there is no newly-shipped behaviour to test and no "we assumed pending, it's now built" case to revisit.
- This is consistent with the project's own state: Schedule is still awaiting a QA branch (OQ-3).

## 3. Description / comment changes carrying testable content

**Zero.**

- **Changelog entries after our ingest cutoff (2026-07-28 07:46 UTC): 0** across the epic and all 15 children.
- **Comments: 0** across the epic and all 15 children (all time — not just since ingest).
- **Attachments: 0** across the epic and all 15 children (all time). No images or videos to analyse.
- Newest `updated` on any child = **SV-8700 at 2026-07-27T05:31 (-0500)** — i.e. every child was last touched *before* our ingest.

### Why the user's screenshot showed "updated 2026-07-28"

The epic's `updated` timestamp is **2026-07-28T02:33:54.965-0500**. The changelog shows that single edit verbatim:

> `2026-07-28T02:33:54.965-0500 | QA Assignee | '' -> '[Ayesha Khan]' | by Bilal Muzamil`

That is an **administrative field set by the user's own Jira account** — it carries **no product or testable content**. The last content-bearing edits to the epic were Branko's on 2026-07-27 (adding related-issue links SV-3397 / SV-5735 / SV-3620 / SV-5331 and the Confluence remote link), and **all of those are already captured** in `build/schedule/epic-sv8685/INGEST-SUMMARY.md` ("Epic issue links (10, context only)"). So the 2026-07-28 date is not a stale-source signal.

**One small NEW fact worth recording (not a case change):** the epic now names **Ayesha Khan as QA Assignee** for Schedule. Our Schedule docs record PO = Branko but do not name the QA. Suggest adding it to `build/schedule/PROJECT-STATE.md` when that project's owner next touches it (this worker does not write into `build/schedule/**`).

## 4. Coverage verdict per NEW/CHANGED story

**Not applicable — there are no new or changed stories.** Our existing 165-case Schedule suite (per CLAUDE.md, post-2026-07-31 consolidation) stands unchanged against this epic. The story→case mapping in `build/schedule/epic-sv8685/RECONCILIATION.md` remains valid as written, including the one gap it already recorded and closed:

- **SV-8699 Working Hours Settings** — was flagged "NO existing section — GAP" at ingest, and was **already closed** by the 2026-07-27 epic-sync wave: SCH-HRS-01..07 = **C38846–C38852**. Still Open in Jira, still covered by us. No action.

## 5. Contradictions with what our cases assert

**None found.** No story text changed, so nothing new can contradict our cases.

The two product decisions the Schedule project is already **holding for Branko** are unchanged in Jira — neither has been answered in a ticket, so they stay open with the project's owner:

- **D1** events-count-toward-capacity — SCH-EVT-08 = **C30615** ([view](https://shopview.testrail.io/index.php?/cases/view/30615)) + SCH-CAP-01..04
- **D4** shift-detail-modal "Reassign" — SCH-MODAL-08 = **C30015** ([view](https://shopview.testrail.io/index.php?/cases/view/30015))

## 6. Action list for Schedule

| # | Action | Owner | Priority |
|---|---|---|---|
| 1 | **Nothing** — no authoring, no case edits, no TestRail writes required from this epic re-check. | — | — |
| 2 | Optional bookkeeping: record **QA Assignee = Ayesha Khan** in `build/schedule/PROJECT-STATE.md`. | Schedule project owner | Low |
| 3 | Unchanged pre-existing blockers (not from this re-check): live VIU still needs the QA branch (OQ-3); D1 + D4 still need Branko. | Schedule project owner | — |
