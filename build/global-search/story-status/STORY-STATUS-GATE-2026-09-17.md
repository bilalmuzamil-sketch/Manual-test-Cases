# Story status gate — read LIVE from Jira on 17 September 2026 (Rule 112)

All 26 children of SV-9160, with the status each one actually carries today. This supersedes the
2026-09-16 file for anything filed from today onward; a status is never carried over from a handoff
or from memory.

| Story | Status | Admits a defect? | Summary |
|---|---|---|---|
| SV-9161 | Ready for QA | ✅ | [Spike — resolved] Search infrastructure decision — residual: commit the ADR |
| SV-9162 | Ready for QA | ✅ | BE — `GET /api/search`: query-parameterised, scoped, grouped and ranked endpoint |
| SV-9163 | Ready for QA | ✅ | BE — Search index: backfill and incremental maintenance, nine entity types |
| SV-9164 | Ready for QA | ✅ | BE — Matching pipeline: normalisation, identifier parsing, fuzzy matching |
| **SV-9165** | **Ready for QA** | ✅ | **BE — Ranking engine: per-entity scoring, cross-entity ordering and contextual bias** |
| SV-9166 | Ready for QA | ✅ | BE — Recent-entities API |
| SV-9167 | OBSOLETE | ❌ | Search telemetry: `search_event` schema, impression and click logging |
| SV-9168 | Ready for QA | ✅ | FE — Global search modal shell: ⌘K trigger, five states, focus management |
| SV-9169 | OBSOLETE | ❌ | FE — Scope tab strip with live counts, grouped results, scoped-tab load-more |
| **SV-9170** | **Ready for QA** | ✅ | **FE — Entity result rows: shared base row, nine variants, badges and match highlighting** |
| SV-9171 | Ready for QA | ✅ | FE — Keyboard navigation and WCAG 2.1 AA accessibility for the search modal |
| SV-9172 | Ready for QA | ✅ | FE — Recent searches grouped by time interval, persisting the last query |
| SV-9173 | OBSOLETE | ❌ | FE — Contextual quick actions on result rows |
| SV-9174 | Ready for QA | ✅ | FE — Integration: wire the modal to `/api/search`, debounce, error handling, page context |
| SV-9175 | Open | ❌ | QA — end-to-end test plan and E2E automation |
| SV-9176 | Open | ❌ | Direct rollout (no flags) and old-path removal |
| SV-9306 | OBSOLETE | ❌ | BE — Page search cutover: WO / Inventory Parts / Customers list search |
| SV-9307 | Board Backlog | ❌ | Verify Phase 1 — infrastructure & framework core |
| SV-9308 | Board Backlog | ❌ | Verify Phase 2 — indexing pipeline, backfill & staleness |
| SV-9309 | Board Backlog | ❌ | Verify Phase 3 — matching, ranking, permissions, recents |
| SV-9310 | OBSOLETE | ❌ | Verify Phase 4 — modal states, rows, keyboard, persistence, quick actions |
| SV-9311 | Board Backlog | ❌ | Verify Phase 5 — page-search cutover parity |
| SV-9312 | Board Backlog | ❌ | Verify Phase 6 — rollout & BE old-path removal |
| SV-9313 | TESTING QA | ✅ | Verify Phase 6 — FE old-path removal & copy |
| SV-9594 | Open | ❌ | Show unit number and vehicle on Schedule work orders |
| SV-10031 | QA Complete | ❌ | Part Sales: a new part sale is created but the app cannot open it |

**Unchanged from 2026-09-16** — the same five are obsolete and the same twelve admit a defect.

## What this settles for the two held reports

| Held report | Owning story | Status | Gate |
|---|---|---|---|
| C44838 — a job's stage is green on the Work Orders list and orange in the search | **SV-9170** | Ready for QA | ✅ passes |
| C44854 — a part already on the job is not pushed down | **SV-9165** | Ready for QA | ✅ passes |

Neither is blocked by Rule 112. The only thing still missing from both is the **Sources** section,
which needs an authorised source read (Rule 106).

## The decision item

Ten checks in run 415 are held against work that is marked **OBSOLETE** while the requirement is
still written in the specification and still written into the case:

* **SV-9173** (quick actions on hover) — eight checks.
* **SV-9169** (the scope tab strip, which owns the "Show all" handover) — one check, plus the
  filed report SV-10159 whose natural parent this would have been.
* **SV-9306** (page-search cutover) — one check, with its verification SV-9311 still in Board
  Backlog.

Either the work returns and these re-run, or the requirement is dropped and the checks are retired.
Not a decision this lane can take.
