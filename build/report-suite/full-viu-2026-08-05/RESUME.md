# RESUME — Report Suite full live-observation pass, 2026-08-05

**Pass ended with the session budget, not with an error.** Cookies were still alive at the end.

**Build marker in force throughout:** `v3.5-16cf83f`, last-mod Wed 05 Aug 2026 06:40:32 GMT,
etag `177c59546701e7810b894492dabc1423`, `index.html` sha256
`67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78`.
Read at **19:51:00Z** and **19:56:39Z** — byte-identical. **No redeploy under this pass.**

**Specs:** SBC v15 · SBR v17 · PV v5 · TU v6 · WIP v9 · IV v4 — read live 19:54Z, re-confirmed at
write start, **none moved**.

## Where this pass got to

| | Count |
|---|---|
| Our cases | **476** (live total 481 incl. 5 foreign) |
| **Driven live and adjudicated this pass** | **32** |
| **Not observed** | **444** |
| TestRail writes | **32 `update_case`**, all HTTP 200, 30 fields compared each, 0 mismatches |
| Markers after | READY **424** · READY-EXPECT-FAIL **27** · HOLD **25** = 476 |

## THE EXACT NEXT ACTION

Continue per-case live observation from **FINDINGS.md**, taking the rows tiered `NOT OBSERVED`.
Suggested order (largest evidence gaps first): **SBR — Staff Deactivation (8)**, **IV — As-of Date &
Snapshots (8, 1 already done)**, **SBC — Saved View & Persistence (7)**, **WIP — Earned & Remaining (10)**,
**SBC — Tree & Rows (12)**, then the remaining leaves.

Everything needed to resume is already built and proven working:
- `build/report-suite/full-viu-2026-08-05/tools/rs.py` — raw-cookie API + export downloader. **Note `-g`
  (globoff) is required for the `pagination[...]` bracket params; without it curl fails silently at HTTP 0.**
- `/tmp/rs-viu/boot.mjs` — SPA browser boot. Needs its own MITM bridge (`/tmp/rs-viu/br/bridge.mjs`, port in
  `bridge-port.txt`) and hydrates localStorage from the pre-existing `/tmp/report-suite-viu/rc/userobj.json`.
- `/tmp/rs-viu/case-index.json` — all 476 cases with title, steps, expectation and marker, stripped for reading.

## Proven env facts discovered this pass (reuse, do not re-derive — Rule 27)

- Report routes: `/reports/{sales-by-customer, sales-by-representative, parts-velocity,
  technician-utilization, work-in-progress, inventory-value}`.
- API: `/api/reporting/reports/{slug}` and `/api/reporting/reports/{slug}/export`.
- Export params: `format=csv|pdf` (**xlsx is rejected — "Invalid export format. Allowed values: csv, pdf."**),
  `variant=summary|expanded` (**mandatory** — omitting it gives "Invalid export variant"), `locations=<id>,<id>`.
- **Work In Progress export takes a different parameter set from the other five:** `tab=` +
  `from=`/`to=` ISO timestamps + `columns=` + `sortBy=`/`descending=` — NOT `range`/`start_date`/`end_date`.
  Valid tabs: `ApprovedPartiallyCompleted`, `ApprovedNotStarted`, `Completed`, `Estimates`.
- Date presets accepted: this_week, last_week, this_month, last_month, this_quarter, last_quarter,
  this_year, last_year, **today**, **yesterday**. Rejected: **`last_12_months`**, `last_30_days` (both
  HTTP 400 "Selected date range is invalid.").
- Two locations: `b3c8c820-…` Staging Heavy Duty - 9919 · `f8a8b802-…` Staging Lethbridge - 4310.
- `POST /api/quick-login` was **never called** (it rotates the shared session and siblings were using it).
  Raw cookies worked for every call.

## Environment left clean
**Nothing was seeded and nothing was changed.** No customer, work order, part, invoice or asset was
created; no organisation setting was written; no role was read-modified or reset (every observation used
the signed-in Admin session read-only). There is therefore nothing to restore, and the shared org was not
disturbed for the two sibling workers.

## Write ledger
- TestRail: **32 `update_case`**. 0 add · 0 delete · 0 section · **0 run writes** · **0 results logged**.
- Jira: **0 writes** (statuses and descriptions read only).
- Application: **read-only**.
