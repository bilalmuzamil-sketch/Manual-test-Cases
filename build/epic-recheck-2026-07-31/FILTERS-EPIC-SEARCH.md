# Filters — epic key hunt (2026-07-31)

> **Verdict in one line: there is NO Jira epic for the Filters project. This is not a lookup failure — the SV project's full epic list was enumerated and no Filters epic exists. Do not invent a key.**

- **Searched:** 2026-07-31, live Jira REST v3 (`GET /rest/api/3/myself` = HTTP 200 as Bilal Muzamil)
- **Raw evidence:** `raw/filters-legacy-hunt.txt`, `raw/filters-and-legacy-hunt.json`, `raw/filters-hunt2.json`
- Our record before this pass (CLAUDE.md, Filters project): *"Epic/Jira key: NOT AVAILABLE YET — ASK THE USER for it when VIU begins (every story's Jira field reads 'TBD'; do NOT invent)."* That record is **confirmed still correct.**

## What was searched (7 independent angles, all exhaustive)

| # | Angle | JQL / method | Result |
|---|---|---|---|
| 1 | **Every epic in the SV project** | `project = SV AND issuetype = Epic ORDER BY updated DESC` | **170 epics** enumerated. No Filters epic. |
| 2 | Epics whose text mentions filtering | `project = SV AND issuetype = Epic AND text ~ "filter"` | 14 hits — all unrelated (see below) |
| 3 | Anything mentioning the design language | `project = SV AND text ~ "filter chips"` / `summary ~ "chip"` | 9 / **0** hits — the chip hits are the *Schedule* stories SV-8686/SV-8687, not a Filters ticket |
| 4 | Anything citing the Filters Confluence page id | `project = SV AND text ~ "572030978"` | **0 hits** |
| 5 | Anything citing the tech plan's own name | `project = SV AND text ~ "filter redesign"` | 3 hits, none related |
| 6 | Anything citing the tech plan's net-new artefact | `project = SV AND text ~ "UserPagePreference"` | 1 hit — SV-8593, a *Report Suite* story |
| 7 | **All epics created since 2026-06-01** (a new epic would be here) | `project = SV AND issuetype = Epic AND created >= 2026-06-01` | **8 epics**: SV-8702 Open API · SV-8685 Schedule · SV-8683 Simple Flow V2 · SV-8582 Reporting Suite · SV-8563 FE duplicate-requests (OBSOLETE) · SV-8406 Custom Roles follow-up defects · SV-8218 Invoice UI Refresh · SV-8181 Digital Inspection V2. **None is Filters.** |

## The one near-miss, ruled out

**SV-4913 "Page Filter Improvements"** (Epic, Open) is the only epic that could be mistaken for ours. It is **not** the Filters project. Its 7 children are all old page-search/page-filter defects:

| Child | Type | Status | Summary |
|---|---|---|---|
| SV-4912 | Task | Board Backlog | Global search - Only search Customers, not Contacts |
| SV-4914 | Bug | Open | Page Filter Hyphens and Spaces on Parts Page |
| SV-4915 | Bug | Open | Tag Searches on Inventory/catalog Page - Page Filter Results |
| SV-4916 | Bug | Open | Tag Search - Adding an inventory part to a work order |
| SV-4919 | Bug | Open | Vendor Invoices page filter - special characters not working in search |
| SV-4920 | Bug | Open | Customer Page Page Filter - Special Characters and Spaces Not Working In Search |
| SV-4921 | Bug | Open | Work Order Page Page Filter - Special Characters not working |

That is the **legacy free-text "page filter" search box** bug bucket — a different feature from our project's **persistent multi-criteria chip filter bar** (Status / Customer / Lead Technician / Service Advisor / Asset on Site, URL-shareable state, per-user persistence). Do not adopt SV-4913 as the Filters epic key.

## Corroboration from our own Filters artefacts

- `build/filters/testrail-id-map.csv` has columns `internal_id, testrail_case_id, title, section` — **no `refs` column and no SV- keys anywhere** in it (118 rows checked).
- A grep for `SV-\d+` across every `build/filters/**.md` returns only: **SV-8685** (a cross-reference to the Schedule epic), **SV-8032** (cited in the tech plan purely as an unrelated code precedent for a `clockableOnly` query param), and four `SV-442xx` strings that are **screenshot transcription artefacts** in `design-notes.md` (adjustment numbers read off a design mock, not Jira keys — the SV project has no 5-digit keys).
- `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` cites only the **Confluence spec** (`.../pages/572030978/Filters`) and uses spec-internal `S9-R5`-style requirement IDs — **it carries no Jira epic or story key at all.**

## Consequences (flagged, not fixed)

1. **The Filters project is the one active project with NO Jira traceability.** Its ~110 local / 94 live cases cannot satisfy Standing Rule 20 (`refs` = `<TICKET> (<spec-anchor>)`) because there is no ticket to cite. Right now they can only be traced to the Confluence spec + the tech plan.
2. **Nothing is stale here** — there is no Jira source to have drifted. The Filters staleness risk lives entirely in the **Confluence spec** (the "8 versions behind" incident), which is a separate check from this epic re-check.
3. **Action: ask the user / Branko for the Filters epic key** (or confirm that the work is being tracked outside Jira / not yet ticketed). This is the same ask already recorded as OQ-2-equivalent in the Filters project state — this pass confirms it is still genuinely unanswered rather than something we simply failed to look up.
4. If a key is later supplied, run the same ingest used here (`fetch_epic.py <KEY>` + `analyze_delta.py`) and backfill refs with the Schedule precedent `build/schedule/epic-sv8685/backfill_refs.py`.
