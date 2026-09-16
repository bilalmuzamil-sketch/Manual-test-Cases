# Rule 112 gate — the live status of every child of epic SV-9160, read 2026-09-16

**Read LIVE from Jira on 2026-09-16** (`parent = SV-9160`, 26 children, no paging remainder).
**Not from a handoff, not from memory (Rule 100).** Re-read it before the next batch — a status
moves without telling us.

**The gate (Rule 112):** only **Ready for QA** and **TESTING QA** admit a story defect. Everything
else means the case is marked **Blocked** with a comment naming the story, its status and the date.

## ✅ DEFECT ALLOWED — 12 (still subject to Rule 62: ask him per ticket)

| Key | Status | Summary |
|---|---|---|
| [SV-9161](https://shopview.atlassian.net/browse/SV-9161) | Ready for QA | [Spike — resolved] Search infrastructure decision — residual: commit the ADR |
| [SV-9162](https://shopview.atlassian.net/browse/SV-9162) | Ready for QA | BE — GET /api/search: query-parameterised, scoped, grouped and ranked search endpoint |
| [SV-9163](https://shopview.atlassian.net/browse/SV-9163) | Ready for QA | BE — Search index: backfill and incremental maintenance for all nine entity types |
| [SV-9164](https://shopview.atlassian.net/browse/SV-9164) | Ready for QA | BE — Matching pipeline: query normalisation, identifier parsing and fuzzy matching |
| [SV-9165](https://shopview.atlassian.net/browse/SV-9165) | Ready for QA | BE — Ranking engine: per-entity scoring, cross-entity ordering and contextual bias |
| [SV-9166](https://shopview.atlassian.net/browse/SV-9166) | Ready for QA | BE — Recent-entities API: record and serve the user's recently-viewed records |
| [SV-9168](https://shopview.atlassian.net/browse/SV-9168) | Ready for QA | FE — Global search modal shell: ⌘K trigger, five states and focus management |
| [SV-9170](https://shopview.atlassian.net/browse/SV-9170) | Ready for QA | FE — Entity result rows: shared base row, nine variants, badges and match highlighting |
| [SV-9171](https://shopview.atlassian.net/browse/SV-9171) | Ready for QA | FE — Keyboard navigation and WCAG 2.1 AA accessibility for the search modal |
| [SV-9172](https://shopview.atlassian.net/browse/SV-9172) | Ready for QA | FE — Recent searches grouped by time interval, and persisting the last query |
| [SV-9174](https://shopview.atlassian.net/browse/SV-9174) | Ready for QA | FE — Integration: wire the modal to /api/search with debounce, error handling, page-context |
| [SV-9313](https://shopview.atlassian.net/browse/SV-9313) | **TESTING QA** | Verify Phase 6 — FE old-path removal & copy |

## ⛔ NO DEFECT — MARK THE CASE **BLOCKED** — 8 not yet handed to QA

| Key | Status | Summary |
|---|---|---|
| [SV-9175](https://shopview.atlassian.net/browse/SV-9175) | Open | QA — Global Search v2 end-to-end test plan and E2E automation |
| [SV-9176](https://shopview.atlassian.net/browse/SV-9176) | Open | Direct rollout (no flags) and old-path removal |
| [SV-9594](https://shopview.atlassian.net/browse/SV-9594) | Open | Show unit number and vehicle on Schedule work orders |
| [SV-9307](https://shopview.atlassian.net/browse/SV-9307) | Board Backlog | Verify Phase 1 — OpenSearch infrastructure & search framework core |
| [SV-9308](https://shopview.atlassian.net/browse/SV-9308) | Board Backlog | Verify Phase 2 — indexing pipeline, backfill & staleness |
| [SV-9309](https://shopview.atlassian.net/browse/SV-9309) | Board Backlog | Verify Phase 3 — /api/search matching, ranking, permissions, recents |
| [SV-9311](https://shopview.atlassian.net/browse/SV-9311) | Board Backlog | Verify Phase 5 — page-search cutover parity (WO / Parts / Customers) |
| [SV-9312](https://shopview.atlassian.net/browse/SV-9312) | Board Backlog | Verify Phase 6 — rollout & BE old-path removal |

## ⛔ NO DEFECT — OBSOLETE — 5 (leave untouched, QA lead 2026-09-16)

SV-9167 · SV-9169 · SV-9173 · SV-9306 · SV-9310 — all **OBSOLETE**. A case that only covers one of
these is not Blocked-pending-work; it is testing something that is not being built. Report it, do
not park it silently.

## Already closed out — 1

[SV-10031](https://shopview.atlassian.net/browse/SV-10031) — **QA Complete** (a Bug, not a story).

---

## How to use this when the handoff lands

1. For each case the handoff names, find the story it covers (the case's own source line, never the
   handoff's claim).
2. Case passes ⇒ Passed, as normal.
3. Case fails **and** its story is in the ✅ table ⇒ build the ticket to the approved layout
   (annotated old-vs-new picture, Environment second-to-last above Sources), then **ask him per
   ticket** before filing (Rule 62).
4. Case fails **and** its story is in either ⛔ table ⇒ **Blocked**, with the comment template in
   `build/skills/09-TEST-EXECUTION.md` §5.3-a. Run it and record the observation anyway.
5. A case spanning both ⇒ the lowest status wins. Blocked, naming every story it covers.
