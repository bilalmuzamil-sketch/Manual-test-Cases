# QA Dashboard — hourly refresh runbook

Refreshes the artifact at
**https://claude.ai/code/artifact/db96d3fa-b068-4044-88d2-bdc5efa52544**
with current Jira data. Runs on a Routine (hourly, weekdays); also run on demand
when the user asks. Keep chat output to ONE line ("Dashboard refreshed · <UTC time>")
on success; on Jira/MCP failure, skip silently — the next run retries.

## Steps

1. **Pull tickets** — Jira MCP `searchJiraIssuesUsingJql`, cloudId
   `19fdd96d-a135-46c4-83e7-d2cc218a4e63`, paginate (maxResults 100, follow
   `pageInfo.endCursor` until `hasNextPage` false — ~9-10 pages):
   ```
   project = SV AND updated >= -63d AND ("QA Assignee" is not EMPTY OR
   status in ("Ready for QA", "TESTING QA", "TESTING STAGE",
   "REJECTED FROM TESTING", "Merged to Staging") OR reporter in
   ("Bilal Muzamil", "Ayesha Khan", "Mudassir Qamar", "Viktoria Videnovic",
   "Nebojsa Glavinic", "Ahtasham Amjad")) ORDER BY updated DESC
   ```
   fields: `["summary","status","labels","customfield_10385","parent","priority",
   "issuetype","created","updated","resolutiondate","statuscategorychangedate","reporter","assignee"]`
   (customfield_10385 = QA Assignee; `assignee` = the normal/developer assignee —
   REQUIRED for the two follow-up tables below.) Results exceed the token cap and are
   saved to files — extract each page with a compact extractor into `tickets.jsonl`
   records: `{key,summary,status,type,priority,labels,qa,reporter,assignee,parent,
   parentType,parentSummary,created,updated,resolved,catchange,statusCat}`
   (see git history of this folder for the exact extract.py), then dedupe by key
   into `tickets-unique.json`.

2. **Resolve epics for story-parents** — collect unique `parent` keys where
   `parentType` not in (Epic, null); one JQL `key in (...)` with fields
   `["parent"]`; write `story-epic-map.json`:
   `{storyKey: {epic, epicSummary, epicType}}`.

3. **Generate data** — `python3 build/qa-dashboard/gen_data.py <workdir> <today YYYY-MM-DD>`
   → `<workdir>/dash-data.json`.

4. **Build page** — inject into the template (replace the literal `"__DATA__"`):
   ```
   python3 -c "d=open('<workdir>/dash-data.json').read();
   t=open('build/qa-dashboard/qa-dashboard-template.html').read();
   open('<scratchpad>/qa-dashboard.html','w').write(t.replace('\"__DATA__\"',d))"
   ```
   The template computes all dates/labels from `asof` — no HTML edits needed.

5. **Republish** — Artifact tool, file `<scratchpad>/qa-dashboard.html`,
   favicon `🧪`. If publishing from a different conversation than the original,
   pass `url: https://claude.ai/code/artifact/db96d3fa-b068-4044-88d2-bdc5efa52544`
   to keep the same link.

6. **Persist (once per day is enough)** — copy the built HTML +
   dash-data.json into `build/qa-dashboard/` (overwrite the dated copies) and
   commit/push to `claude/qa-jira-dashboard-i7zxr1` only on the first refresh
   of the day, to avoid commit spam.

## Timezone, in-progress & activity (added 2026-07-10)

All dates are **Pakistan time (PKT, UTC+5)**. The extractor converts every Jira
timestamp to PKT before taking the date; "today"/"yesterday" and all buckets are PKT days.
A PKT calendar day D = the Bogota-time (Jira account tz, UTC-5) window
`["D-1 14:00", "D 14:00")` — used as the DURING bounds below.

**In-progress tracker** (`data.inprogress`): tickets carrying an `InProgress_<First>_<Last>`
label (prefix) or `<name>_inprogress` (suffix). gen_data.py reads them from the ticket set;
"since" comes from the optional `inprogress-since.json` sidecar `{issueKey: "YYYY-MM-DD"}`.
To fill "since", for each in-progress ticket call getJiraIssue expand=changelog and find the
history whose `items[].field=="labels"` toString first contains the label → that history's
`created` (converted to PKT date). Stale = ticket already resolved (statusCategory Done).

**Per-person activity table** (`activity.json` sidecar, PKT yesterday/today) — current
method (fewest API calls; yest = ASOF−1, today = ASOF):
- **Created** & **Moved to Done**: derived straight from the already-pulled
  `tickets-unique.json` — no extra queries. Created = QA-member `reporter` with `created` on the
  day. Done = `statusCat=='Done'` with `catchange` on the day, credited to the `QAComplete_*`
  label person else QA Assignee (same FIRST map as gen_data.py).
- **Commented**: one window pull `project = SV AND updated >= "<yest-start Bogota>" ORDER BY
  updated DESC` with `fields=["comment","key"]`, **follow pageInfo — it is usually 2 pages** (~120
  tickets); bucket comment authors (QA only) by PKT day across ALL pages.
- **Rejected**: probe the group over the 2-day window
  `status CHANGED TO "REJECTED FROM TESTING" BY (<all QA>) DURING ("<yest-start>","<today-end>")`.
  If any, get the **today-only** set (DURING today window) to know the day split, then run one
  per-person query each (`BY "<name>"` over the full window, fields=["key"]) and bucket each key:
  in the today-set → today, else → yesterday. (Weekends are usually all zero.)
- **Reassigned**: group probe `assignee CHANGED BY (<all QA>) DURING (...)`; if zero, all zero.
- Write `activity.json`: `{people:{<name>:{created:[y,t],commented:[y,t],rejected:[y,t],done:[y,t],reassigned:[y,t]}}}`
  where every cell is a **list of ticket keys** (count = length; the UI shows the keys on hover
  when ≤10). `gen_data.py` reads this sidecar as-is.
- Tip for pulls that exceed the token cap: they save to a tool-results file. Extract with a
  Python glob filtered by the run's timestamp prefix (each page file is
  `mcp-Atlassian-searchJiraIssuesUsingJql-<epoch>.txt`; filter `>= <run start epoch>` to pick
  only this run's pages).

gen_data.py emits `tz`, `epicStart`, `dataMinDate`, `inprogress`, `activity`, and `tables`.
Selecting an epic auto-sets the calendar to its start (Custom Roles SV-7388 pinned 17 Jun);
default view = Custom Roles.

## Coverage bars & follow-up tables (added 2026-07-10)

Each ticket record gets a **defect flag** `dz` = `type in (Bug, Story Defect)` **OR**
`type == Task AND reporter in QA_TEAM` (QA-raised tasks count as tickets/defects). The
QA_TEAM set lives at the top of gen_data.py — keep it in sync with the roster.

- **QA Testing Coverage bar** (`renderProgress`): of the epic's `dz` defects, how many
  reached Done (`statusCategory == Done`, which already folds in Obsolete/Duplicate). Stories
  are EXCLUDED. Named "QA Testing Coverage", explicitly *not* release readiness.
- **Story Completion bar** (`renderStoryProgress`): of the epic's `type == Story` tickets,
  how many are Done. Separate from defect coverage.
- **Two follow-up tables** in `data.tables` (both "less than Done" = `statusCategory != Done`):
  - `needsResponse` — the normal **Assignee** is a QA member (a query likely waiting on QA),
    PLUS any open **QA-raised Task** (shown with its assignee + a "Why" chip).
  - `openQueue` — the **QA Assignee** field is a QA member (their open testing workload).
  Both tables respect the epic + member filters client-side (`needsMatch`/`queueMatch`). The
  `needsResponse` items currently carry no epic, so they only appear under "All epics"; the
  empty-state hints the user to switch the Epic filter.

## Template-only features (no data step — automatic once `dash-data.json` is built)
- **Issue-type breakdown tooltips**: hovering any count (KPI cards, per-member bars, coverage
  bar, Epic×member matrix cells + totals, leaderboard) shows its composition by issue type,
  e.g. "71 total · 45 Bug, 15 Story Defect, 9 Task…". Built from `t.ty`; nothing to compute.
- **Epic scoping**: selecting an epic scopes every section (incl. in-progress + per-person
  activity via the key→epic map, and hides the cross-epic "Primary epic per member" table).
- These live in `qa-dashboard-template.html` (the working template is
  `qa-dashboard-v2.tpl.html` in scratchpad; the committed copy is the template file). No refresh
  action needed — just inject `dash-data.json` and republish.

## Notes
- Attribution: `QAComplete_*` label wins, QA Assignee is fallback; `*_inprogress`
  auto-detected (see gen_data.py FIRST map for name resolution — extend it when
  the team changes).
- The Routine is named "QA dashboard auto-refresh — SV project" (weekday hourly).
  Manage it: `list_triggers` to find it, `update_trigger` to pause/re-schedule,
  `delete_trigger` to remove.
- NEVER write to Jira or TestRail during a refresh — read-only. Only touch files
  under `build/qa-dashboard/`.
