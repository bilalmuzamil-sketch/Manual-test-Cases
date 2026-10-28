# Reports phase — shared brief for every worker (28 Oct 2026)

## The order you are carrying out (QA lead, verbatim, 2026-10-28)
> "I want you to run the independant run based on PRD and sources and find calculation bugs for dashboard and if the reports are also not showing the correct data, and I need complete defects drafted to create the jira ticket for each defect with the steps of reproduction which a layman non technical person and a manual QA tester can follow to reproduce the defect/bug.
> Make sure that you NEVER run a delta pass, I need a FULL pass run to find the bugs/defects and all the jira tickets drafted for each bug/defect, then I will give you a go ahead and you will create each defect/bug upon my permission.
> I want this dashboard first and then the reports to be 100% scrutinez to ensure either they are showing correct data OR we have a defect/bug for anything which is wrong."
The dashboard is done (`../defect-pack-2026-10-28/README.md`). You own a set of REPORTS. **Full pass**: every column, every total, every filter/date option of each report you own — never a sample, never only what changed.

## Non-negotiables
1. **Expected behaviour comes from WRITTEN SOURCES, never from the build or the code.** Sources: the report's PRD/spec on Confluence (fetch the CURRENT version live with the Atlassian MCP tools — `getConfluencePage` with the page id, cloudId `shopview.atlassian.net` — and record its version number and date), its Jira epic/stories (read-only), PO answers. The code at `/home/user/sv-develop` (develop e8b3c4b31 = identical app code to staging) tells you HOW the build works so you can design checks — it is never what "correct" means. If a report has no written source, say so plainly, still check it for internal consistency (totals = sum of rows, columns agree with each other and with independent raw records), and put any doubt to the PO instead of calling it a defect.
2. **Verified means observed.** Only PASS/FAIL what you observed live this run. Otherwise write NOT VERIFIED or BLOCKED + reason.
3. **Independent recompute.** Comparing a report with another report that shares its code proves nothing. Recompute from raw records through different paths (invoice record `GET /api/invoices/{id}/view`, work-order lines `GET /api/work-orders/lines/{woId}` with `task_records` = clock records, work-order list `GET /api/work-orders?status=completed&pagination[rowsPerPage]=1000`, parts/inventory/vendor endpoints you find, etc.), and/or seed known data and check exact deltas.
4. **Rule 24:** if the SCREEN blocks something but the server API allows it, that is a PASS (note it as an API-hardening observation, no ticket). Every defect must be reproducible through the screen.
5. **Nothing written to TestRail. No Jira ticket created** (read-only Jira/Confluence is fine). You prepare drafts only.
6. **Secrets live in /tmp only.** Never print, log or write a cookie/token value into any file under the repo. Do not `git add` or commit — the coordinator commits your files.
7. Throwaway data: name it `ZZAUTOTEST …`, seed in **DVI Test** (quiet) unless your report needs other data; record every record you create.

## Environment facts (proven today — reuse, don't rediscover)
- Staging app `https://app.staging.shopview.com`, API `https://api.staging.shopview.com`. Build marker `v26.43.2-f8698cb` (read `<meta name="app-version">`; re-check at start and end — if it changed, say so).
- Session: cookie header in `/tmp/cln/sess-admin.txt` (quick-login Admin). Python helper: `sys.path.insert(0,'/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'); from collect_dashboard import curl, WORKPLACES` → `curl(method, path, body=None, extra_headers={'X-Location-ID': wid})` returns `(status, json)`. If you get 401/409 run `cd /tmp/cln/dv && node mint.mjs` to mint a fresh session (needs `/tmp/cln/cookies.json`, already there).
- **ALWAYS `POST /api/iam/change-location {"workplace_id":wid,"workplace_timezone":tz}` before reading a location** — report dates are shown in the SESSION's time zone; the `X-Location-ID` header alone picks the data but not the time zone (this caused a false finding today).
- Locations: Staging Heavy Duty - 9919 `b3c8c820-f815-4cf1-8938-10956c5ee71a` Asia/Karachi · Staging Lethbridge - 4310 `f8a8b802-7780-4b16-bf10-343caeb616b2` America/Edmonton · QB Location `25a0d576-b371-4b82-bef4-41ba977f31c2` America/Vancouver · DVI Test `39522bc6-abca-4f67-bd12-2840043c2d68` America/Toronto.
- Report date windows: `start_date`/`end_date` as UTC instants `YYYY-MM-DDTHH:mm:ss.SSSZ` of local 00:00:00.000 → 23:59:59.999 (`from collect_reports import instants`). Pagination `pagination[page]`, `pagination[rowsPerPage]` (max 1000 — page through!). Service Advisor Analysis returns 1000 rows max per page.
- Report endpoints and fields: `/tmp/cln/dv/` caches and `../tools/*.py` show working calls; the per-column formula reference (code-derived, NOT an expectation source) is `../../report-suite/ShopView-Reports-What-Every-Column-Calculates-2026-10-28.md`.
- Raw caches you may reuse (read-only): `/tmp/cln/dv/inv/<invoiceId>.json` (8,036 invoice records), `/tmp/cln/dv/wol/<woId>.json` (work-order lines incl. clock records), `/tmp/cln/dv/rep/<wid>/<range>__<report>.json` (Sales, SAA, TE, TU, SBC for 16 ranges), `/tmp/cln/dv/hist/` (Sales history by year), `/tmp/cln/dv/wolist.json` (all work orders).
- Seeding recipes: `build/APP-ACTIONS-PLAYBOOK.md` (read only the sections you need) and `../tools/seed.py` (customer/WO/lines/clock/invoice examples). Clock record: `POST /api/technician-tasks/create` with `start_date`/`end_date` as `dd/mm/yyyy hh:mm` LOCAL and `tech_assigned_id` = the staff record's `staff_id` (billable technicians at DVI Test today: Esther Howard staff_id b669608e-a897-4f21-a510-8ced9d9fa982, Fabian Bonjean 6f6e02d6-d9c9-4650-917a-3478e4b12873). Canned line at DVI Test: `6e1ec60e-7412-48ae-9f96-f59e653c01a1` (60 min, $135/h). Create invoice through the screen: `node /tmp/cln/dv/inv_create.mjs <workOrderId>`.
- Browser: `import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs'; const {browser,page}=await boot2('admin',{workplaceId,timezone}); await page.evaluate(w=>localStorage.setItem('location',JSON.stringify(w)),workplaceId)` — **without the `location` key pages fetch nothing.** Use `deviceScaleFactor: 2` captures for evidence (see `../tools/evidence_f2b.mjs`). Quasar menus: `.q-menu`; dialogs `.q-dialog`; an empty work order opens the New Line window by itself.
- Annotated pictures: `python3 ../tools/annotate_v2.py IN.png OUT.png --scale 2 --title "<what the reader is looking at>" --mark "x,y,w,h:bad:<full sentence>" --mark "x,y,w,h:good:<full sentence>"` (red ✗ = wrong, green ✓ = right; coordinates in the source image's pixels).

## Token discipline (Rule 95 — read `build/skills/TOKEN-DISCIPLINE-CHARTER.md` once, apply it; quality is never the thing cut)
Script the bulk work and read summaries; never read big files whole; never poll with sleep loops; batch API calls; do not redo work already cached above.

## Defect drafts (house style — copy, don't invent)
- Read `build/skills/06-DEFECT-PREP.md` sections "THE CANDIDATE FILE" and "The ticket body" (grep the headings; don't read the whole file).
- For EVERY suspected defect write `DEFECT-CANDIDATE-<slug>.md` (the ten-check A1–A10 table + the six refusals), and if it could be filed, `TICKET-<slug>.wiki`. Copy the exact shape of `../defect-pack-2026-10-28/DEFECT-CANDIDATE-tech-efficiency-counts-declined-lines.md` and `../defect-pack-2026-10-28/TICKET-F2-tech-efficiency-counts-declined-lines.wiki`.
- A1 = reproduced twice on the current build. A2 = the expectation quoted VERBATIM from the current source version — **if it cannot be quoted, the verdict is HELD + a PO question, not a ticket.** A4 = run the duplicate JQL searches live and record them.
- Steps to Reproduce: numbered, ONE action per line, exact on-screen labels, include the steps that CREATE the data, name the exact test data, no API calls. Prove the steps by doing them through the screen at least once.
- Pictures annotated with annotate_v2.py and listed in the ticket.

## Output (write under `build/dashboard-verify-2026-10-28/reports/<your-folder>/`)
- `RESULTS.md` — per report: source used (page id + version + date) or "no written source found (searches run: …)", every check run with PASS/FAIL counts, observed values, and what was NOT verified and why.
- `results-*.json` — raw check rows.
- `defects/` — candidate files, ticket drafts, `pictures/`.
- `PO-QUESTIONS.md` — one row per open question, answerable in one word.
- Your tools in `tools/`.
Finish with a compact report to the coordinator: reports covered, checks run/passed/failed, each finding with its verdict (ADMISSIBLE draft / HELD for PO / already reported SV-#### / not a defect), and the file paths.
