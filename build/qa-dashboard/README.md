# QA execution dashboard

Self-contained HTML dashboard generated from live TestRail data (milestone M3, runs R414-R419).

- **Generator:** `build/testing-tools/gen_dashboard.py` (pulls the API, renders `dashboard.html`).
- **Published Artifact (shareable link):** https://claude.ai/code/artifact/dc9c1fe5-1e63-46f8-bd2c-dcaa77a02a38
- **Refresh:** re-run the generator, then republish the same file path to keep the URL stable.
  Cadence (daily/hourly) to be scheduled via a Routine once assignments + execution begin.
- Shows: KPI band, burndown to 2026-09-21, per-suite progress, per-engineer workload, recent activity.
  Currently all-untested / unassigned — it lights up as runs are assigned and tests are executed.
