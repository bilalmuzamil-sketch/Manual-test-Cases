# DEFERRED build-verification run list — Schedule (2026-08-18)

> Local list (NOT a TestRail run). One row per Schedule case whose feature was **not found in the
> build** during live build-verification (Standing Rule 69 / skill `03-RUN-CHECK.md` §7.4). These keep
> the `AUTOMATION: Not available on Build to test Yet - Last checked <date>` marker + the
> under-development line, and are re-checked when the feature ships (the trigger is the **feature
> shipping**, not a redeploy alone). On success the marker lifts to `READY` (or
> `READY - EXPECT FAIL (SV-xxxx)` on a live-backed failure) via the §6.4 Vlad hand-off.

Build under test at scoping: **`v3.8-bd246fd`** (2026-08-18 19:57:31 GMT).

| C-id | internal | section | feature / story it waits on | last checked | build marker |
|---|---|---|---|---|---|
| SCH-FILT-04 | [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | 4258 Sidebar - WO Filters | Priority filter (High/Med/Low) — story SV-8687 §5.1 | 8/18/2026 | v3.8-bd246fd |
| SCH-DAY-05 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | 4267 Day View Timeline | Shift edge-resize (no fc-event-resizer handles) — SV-8694/SV-9244 §4.8 | 8/18/2026 | v3.8-bd246fd |
| SCH-DAY-08 | [C43812](https://shopview.testrail.io/index.php?/cases/view/43812) | 4267 Day View Timeline | Day-view pixels-per-hour zoom control — SV-9244 §3.2/§4.6/§4.8/§6 | 8/18/2026 | v3.8-bd246fd |
| SCH-DAY-09 | [C43813](https://shopview.testrail.io/index.php?/cases/view/43813) | 4267 Day View Timeline | Day-view continuation chevron on a clipped block (NOT-ESTABLISHED: mechanism seen in Week view; day-view clip not producible) — SV-9244 §3.2/§4.6/§4.8/§6 | 8/18/2026 | v3.8-bd246fd |
