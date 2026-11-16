# Regression steps 1–2 on STAGING — results (16 Nov 2026)

Worker brief: `../WORKER-BRIEF-steps-1-2.md`. Intake: `../INTAKE.md`. Draft only — nothing written to Jira, TestRail, Google Sheets or Slack.

## Environment
- **Build:** `v26.45.4-f3d3d2d` (`meta[name="app-version"]`, read 07:31 UTC and again at every flow start/end — see each flow's evidence JSON).
- **Hosts:** app.staging.shopview.com / api.staging.shopview.com. Signed in as the dev quick-login **Admin** (Admin ShopView) via `build/testing-tools/staging-boot2.mjs`; own session per script.
- **Location:** **ZZAUTOTEST R365 Location C with a name longer than the chip** (id `2644c166…`), Calgary AB, tax **GST 5 %**, labour **General Labor $135**.
  - Why this one: `GET /api/staff/my-workplaces` lists six locations for this login — Heavy Duty - 9919 and Lethbridge - 4310 are the other worker's; **QB Location**, **DVI Test** and **ZZAUTOTEST V1R-87 Location C** all appear in the other worker's report-gaps evidence (18 / 53 / 3 files), so new WOs there could move its figures. R365 appears in none of its files, has no work orders, part sales or fees/discount templates (nothing auto-applies), has a labour rate, a real tax (5 %, not zero-rated like DVI Test) and a default bin. "US Location" was also clean but this login is not staffed there (the header showed no location), so it was not used.
  - It had **no parts in stock**, so ZZAUTOTEST inventory parts were seeded there (data, not settings; every create is in `seed-log.jsonl`).
- **Time zones (Rule 99):** session `change-location` = America/Edmonton · browser `timezoneId` = America/Edmonton · process `TZ=America/Edmonton` · app `localStorage['timezone']` = "America/Edmonton" — recorded in every evidence JSON.
  - `tz_rules_check.py America/Edmonton --from 2026-11-16 --to 2026-11-30` → **MISMATCH: browser UTC−7 vs machine UTC−6** (Chromium 153's old rules, 6 Nov amendment). The server follows UTC−6 (tz 2026e). All checks here are of amounts, lines and statuses, and were run well away from local midnight; the one date check (invoice/payment date = today) is read in the server's terms. No result depends on the gap hour.

## Step 1 — settings (read only; nothing changed)
Full list with on-screen labels, values, capture time and what each affects: `settings.json` (36 rows). Screenshots: `evidence/settings/`.

Settings that shape this run:
| Setting (on screen) | Value | Effect on the run |
|---|---|---|
| Work Orders › Require Approval for New Lines | On | new lines need approving |
| Work Orders › Require Review Before Completion | Off | no Review step before completion |
| Work Orders › Require Tech Story / Mileage / Engine Hours | Off / Off / Off | lines complete without them |
| Work Orders › Require Ordering Parts | On | each part needs Order |
| Work Orders › Require Receiving Parts Before Completion | On | parts must be received before complete / invoice |
| Work Orders › Require Picking Inventory Parts | On | inventory parts need Pick |
| Invoice › Labor rate / Labor hours / Labor price | Off / Off / Off | labour rate, hours and price are NOT printed on the invoice document — labour figures are checked in the invoice's data and the WO Finance screen |
| Invoice › Part number / quantity / price / description | On | part details printed |
| Invoice › Summarize parts total / labor total | On / On | subtotals printed |
| Locations › Taxes | GST (5 %; labour, parts and shop supplies taxable) | tax recomputed at 5 % |
| Locations › Sales Tax Rounding | Line by line (default) — on screen: "Round the tax on every line to the cent, then add them up." | rounding recomputed both ways where they differ |
| Locations › Shop Supplies Charge | 0 % (min 0, no max) | no shop-supplies line expected |
| Fees & Discounts templates | none | nothing auto-applied (F&D out of scope) |
