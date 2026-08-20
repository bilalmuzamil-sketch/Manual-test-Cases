# FOR VLAD — staging-verify reports-access pass (2026-08-20)

Three **Automated (atm=3)** reports-access permission cases were VIU'd LIVE and flipped
`AUTOMATION: HOLD → AUTOMATION: READY` this session. All `created_by=3` (ours). Build **v3.8-d0e135e**.
Cases store the interim `<br>` line-break form (hazard #6, see NEEDS-REFLOW-STAGING.md) — parse on `<br>`.

| C-id | Project | atm | What changed (field) | Verdict | Source reference | Build marker |
|---|---|---|---|---|---|---|
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Report Suite / Technician Utilization | 3 (Automated) | Expected: Rule-54 sentence-2 build stamp → v3.8-d0e135e 8/20/2026; marker HOLD→**READY** (preconds/steps content unchanged, re-sent in interim form) | **PASS** — no-reports user: TU absent from nav + route blocked + BE 403 | epic SV-8582; TU spec v9 (S1-N1) | v3.8-d0e135e, live 2026-08-20 |
| [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | Report Suite / Inventory Value | 3 (Automated) | Expected: build stamp → v3.8-d0e135e 8/20/2026; marker HOLD→**READY** | **PASS** — no-reports user: IV absent from nav + route blocked + BE 403 | epic SV-8582; IV spec v10 (S1-N1) | v3.8-d0e135e, live 2026-08-20 |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | Report Suite / Inventory Value | 3 (Automated) | Expected: build stamp → v3.8-d0e135e 8/20/2026; marker HOLD→**READY** | **PASS** — ordinary-reports user (Parts Manager) opens IV (200, 100 rows) + CSV export 200 | epic SV-8582; IV spec v10 (Story 1 Prerequisites) | v3.8-d0e135e, live 2026-08-20 |

## Automation notes
- All three gate on the single FE atom **`reportsPageAccess`** (the entire FE-permission catalogue holds
  exactly one report atom — no per-report atom exists). Backend ENFORCES it: the report data endpoint
  returns **HTTP 403 "Access denied."** when the atom is absent, **200** when present.
  - `GET /api/reporting/reports/technician-utilization?range=custom&start_date=<ISO>&end_date=<ISO>`
  - `GET /api/reporting/reports/inventory-value?range=custom&start_date=<ISO>&end_date=<ISO>`
- FE: with `reportsPageAccess` OFF the whole **Reports** top-nav is absent and `/reports/*` routes
  redirect to `/workorders`; with it ON, "Technician Utilization" and "Inventory Value" appear in the
  reports nav and their pages load.
- `refs` unchanged on all three; no collateral field change; run 359 not written.
