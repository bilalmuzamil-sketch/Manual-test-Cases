# RESUME — Report Suite, 12 August 2026

## Where this stopped
All six reports were **route-walked** against build `v3.7-4626299`. **3 `update_case`, all
byte-verified. 0 Jira calls. Run 359 untouched.** Nothing is half-written.

## Check first — the build
`v3.7-4626299` · last-mod Wed 12 Aug 2026 05:06:49 GMT · etag `da084d29fbcc187229d2988862374d6b` ·
sha256 `6dc177ab17a9243f4820e0523390602c0c06038f0d70ee165d1d26032ee9c85b`. Byte-identical at session
start and end. **Schedule and Filters both moved around 12:10 GMT today; Report Suite did not.**

## The numbers — see COMPLETION-REPORT.md, and read its caveat before quoting anything
- **Route walked: 472 of 480.** Measured. This is the figure to use.
- **Steps AND preconditions: NOT reliably established.** The machine figure is 253 and it
  **over-counts** — two hand-audits of 8 random cases found 4, then ~3, with preconditions never met.
- Source-verified 480/480 · markers 341 READY + 97 EXPECT FAIL + 42 HOLD, gate closes both ways.
- Only **3** cases carry a build line naming the running build, and that is deliberate.

## What is left, in the order I would do it
1. **The QA lead's answer on the 57 bulk-closed tickets** — it governs ~75 EXPECT FAIL markers and
   nothing should move until it is answered. `DIVERGENCES.md` §4.
2. **Establish the data preconditions.** This is the biggest remaining job and the one that decides
   whether a tester can really run the suite. ~106 cases name a seeded data state and ~91 name an app
   or data state; neither set was individually confirmed.
3. **Technician Utilization sorting** — still NOT established. The walk's extractor read 0 rows and a
   targeted probe could not separate a sort from data still arriving. `tools/probe_tu.cjs`.
4. **Parts Velocity sorting** — 0 of 3 columns reordered with 11 rows measured. A signal, not a
   finding. Worth one targeted re-check.
5. **C38912's hold** — its stated reason is a filing reason, not a runnability one, and it may be
   disarming a runnable case.
6. Two Work In Progress columns did not reorder while a third did — three samples, not a finding.

## Re-running the tooling
```
cd build/report-suite/finish-2026-08-12/tools
# cookies: /tmp only, chmod 600, written to /tmp/qa-cookies/reports-cookie-header.txt
python3 ../../verify-final-2026-08-12/tools/mkseed.py     # /tmp/seed.json
python3 ../../verify-final-2026-08-12/tools/pull_live.py  # /tmp/rs812/live_now.json
for r in wip tu sbc sbr pv iv; do node walk.cjs $r; done  # ~5 min each
node probe_tu.cjs ; python3 map_cases.py ; python3 completion.py
```

## Traps already paid for — do not pay again
1. `.q-tab, [role=tab]` matches the **reports navigation**, not a report's tabs (`[data-test-id^=tab_]`).
2. A bare `tbody` reports **1 row for an 18-row table**; `[data-test-id^=table_]` is a **div** and
   `q-table` renders several tbodies. Count `tbody tr`.
3. Work In Progress names **no `header_*` test-ids** — a `header_`-only sort probe cannot fail.
4. `browser.close()` hangs behind the route handler and leaves an orphan racing the next report.
5. The Work In Progress tab `text-transform` is on a **child** of the tab, so the tab computes `none`.
6. A sort probe that measured **0 rows** establishes nothing — require evidence it read rows.

## Environment
Nothing seeded, changed or deleted. **0 non-GET API calls** from any probe, checked per run. No role,
staff record or setting touched. `quick-login` and `switch-user` never called.
