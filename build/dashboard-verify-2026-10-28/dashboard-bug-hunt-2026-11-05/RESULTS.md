# Dashboard bug hunt, 5 Nov 2026: results

# LIVE RUN, 6 Nov 2026 (cookies renewed by the coordinator; preflight 200/200 at 09:28 and 09:30 UTC)

**Build:** sv11839 **v26.45.0-5d54a3f** (recorded in every evidence JSON as `app_version`).
**Sign-in:** the QA lead's own cookie set. **Every `change-location` call in this run also moved the QA lead's own browser location on sv11839.** Each evidence file records it as `rule99.note`.
**Rule 99:** every script refuses to run unless the process `TZ` equals the location's zone. Each evidence JSON records the `rule99` block:
- the change-location status;
- the browser `timezoneId`;
- the process `TZ`;
- `localStorage['timezone']` and `localStorage['location']`;
- the header location at the start and at the end;
- `all_match`.

### Area 4: access by role (Story 1, STAGING v26.45.2-7238f98, Staging Heavy Duty - 9919, Asia/Karachi, 09:50–09:56 UTC)
Rule 99 (both runs): browser `timezoneId` Asia/Karachi, process `TZ` Asia/Karachi, `localStorage['timezone']` "Asia/Karachi", `localStorage['location']` = Heavy Duty, session `change-location` to Heavy Duty/Karachi. All recorded in `evidence/area4-access/access.json`.

| Check | Result | Evidence |
|---|---|---|
| 4.1 Tech, Technician role (no reportsPageAccess) | **PASS.** No "Dashboard" (or "Reports") in the navigation (S1-N1). Typing `/dashboard` lands on `/workorders?assigned_to_me=1&tab=work_orders` with no error page (S1-R8). `GET /api/dashboard/reports` answers **403** with no figures (S1-R7). | `evidence/area4-access/A-technician-role-*.png` |
| 4.2 Tech moved for ~20 s to the custom role "ZZAUTOTEST No Financial Data", which has reportsPageAccess, then **restored to Technician** (read back: same role id) | **PASS.** "Dashboard" appears, the dashboard opens, all 6 tiles load with no error, and the API answers 200. reportsPageAccess is the only gate (S1-R6). | `evidence/area4-access/B-*.png`, `role-changes.jsonl` |
| 4.3 Where login lands (S1-R3) | **NOT TESTED.** A real login goes through Google SSO, which cannot be scripted here. Every script starts from an existing session. | none |
| 4.4 Per-report permissions | **Not applicable.** The only report codes in the staging roles are `reportsPageAccess` and `accountingReportsView`; no role carries a per-report permission to take away. | `access.json` |
| Note on S1-R5 | The navigation reads **Dashboard, Work Orders, Schedule, Customers, Parts, Reports**. PRD v53 S1-R5 says *"The 'Dashboard' entry sits immediately to the right of the 'Reports' entry."* **Not a defect.** Chris Ward's own ticket [SV-11712](https://shopview.atlassian.net/browse/SV-11712) (created 22 Oct 2026, 19:28 UTC, 33 minutes AFTER PRD v53 was saved at 18:55 UTC; Done) says *"move 'Dashboard' in the top navigation to the first spot, where 'Work Orders' is today"*. The latest written source wins (Rule 32). **Housekeeping only:** PRD S1-R5 was not updated after SV-11712. Worth one line to Chris at the next PRD edit. | `evidence/area4-access/B-reports-role-no-financial-data-1-nav.png` |

**Set-up fact found:** the Tech staff id hard-coded in `build/testing-tools/staging-restore-tech.mjs` (`6fb22c1b…`) now answers **404** on `/api/staff/{id}/change`. The id that works is the `staff_id` from `GET /api/staff?search=tech%40shopview.com` (`d2cb20a6…`, answers 201). The failed attempt changed nothing.

### Area 3: report drill-in and the chart on the report page (Heavy Duty, America/Edmonton, 09:35–10:05 UTC)
| Check | What was done | Result | Evidence |
|---|---|---|---|
| 3.1 | All 5 tile links on Last Quarter. Each link opens the report in a **new tab**. | **PASS.** Each report shows "Last quarter" (S10-R5), and its Totals/Summary row equals the tile: Revenue $993,491.27 · Billing 102.42 % (3,085.24/3,012.39) · Tech Efficiency 95.54 % (2,879.65/3,014.18) · Tech Utilization 72.93 % (4,729.40/6,485.12). Sales By Customer: 104 customers with the same top customer. | `evidence/area3-drill/` |
| 3.2 | On the Technician Utilization report, and again on Sales By Customer: Location changed to Lethbridge from the Reports menu, then the Heavy Duty tile link followed | **PASS.** The report opened on Heavy Duty with the tile's figure. The Lethbridge choice was not carried to the next visit. | `evidence/area3-locmem/` |
| 3.4 | Browser Back | **Not applicable.** The link opens a new tab, so the Dashboard tab is untouched. My first try used Back in the same tab and landed on the previous page (Work Orders), which is a test artefact, not a defect. | `evidence/explore/` |
| 3.5 | Report charts on This Month (Sales, Advisor Analysis, Tech Efficiency, Tech Utilization), compared with the expanded Dashboard chart | **PASS.** Every report chart ends on **Nov 6, 2026** (today at Heavy Duty) with no later empty days (S11-R8). | `evidence/area3-chartend/` |
| 3.6 | Hide Chart on Sales, then: another report, a revisit, a new tab, a reload | **PASS.** Sales stays hidden on every revisit, and Technician Efficiency still shows its chart (S11-E1, per report). Restored to shown afterwards. | `evidence/area3-showhide/` |
| 2-lead | Sales chart on This Month draws bars on Nov 3 and Nov 4; the first screen seemed to list only Nov 04 rows | **Not a defect.** The full table has 5 rows on Nov 03 (4 invoices + CM11839-4189) and 9 on Nov 04. The bars match. | `evidence/area2-daybound/sales-*` |

**Worker run:** 5 Nov 2026, 17:23 to about 17:50 UTC.

**Builds seen:**
- sv11839: **v26.45.0-277b249**, read from `meta[name="app-version"]` at 17:30 UTC.
- staging: v26.45.2-a434e28.

**PRD:** Confluence 788430850, **v53**, re-checked at 17:27 UTC (Rule 59).

## Headline: every on-screen area is BLOCKED. Both sign-ins expired; only the QA lead can make new ones.

| When (UTC) | Check | Result |
|---|---|---|
| 17:23 | sv11839 API root | 401 (awake, not asleep) |
| 17:26 | `GET https://sv11839api.qa.shopview.com/api/auth/me/fe-permissions` with `/tmp/cln/qa11839/cookies.json` (QA lead's set, written 4 Nov 17:12 UTC) | **401 `{"error":"sso_required"}`** |
| 17:26 | Same, with each cookie on its own and in pairs (playbook trap 1: an expired `cf_clearance` only) | 401 every time, so it is not just `cf_clearance` |
| 17:27 | `auth.qa.shopview.com/login?return_to=…` with only `sv_sso_session` | Redirects to the **Google sign-in page** (accounts.google.com, `hd=shopview.com`), so the SSO session itself is dead |
| 17:27 | Staging `fe-permissions` with `/tmp/cln/cookies.json` (written 4 Nov 15:38 UTC) | **401 `sso_required`** |
| 17:28 | Staging quick-login `admin` through `staging-admin.mjs` `login()` | **401**, so quick-login cannot start a session without a live SSO cookie |
| 17:29 | Production (§K, `POST /api/login`) | No ShopView password in this container (`CLAUDE_PASSWORD` / `SHOPVIEW_PASSWORD` not set; no `/tmp/shopview-creds.env`). Production is also not the build under test. |
| 17:29 | Local stack (AGENTS.md `make up`) | No Docker daemon (`/var/run/docker.sock` missing), no MySQL server. Not viable. |
| 17:30 | `tools/preflight.py` (new, secret-free) | sv11839 401, staging 401 |

**Why this blocks and cannot be worked around.** Both cookie sets passed their ~24 h life. The QA set was written 4 Nov 17:12 UTC and was dead by 5 Nov 17:23. Sign-in is Google SSO. The playbook says so in two places: line ~211, *"cookies are mintable ONLY by the QA lead"*, and the "sso_required" entries at lines 192–215 and 283–352. No path in this container can make a session.

**Searches run before calling it blocked (Rule 97):**
- `git fetch origin`, then `git grep -n "sso_required" -- build/` (playbook lines 192, 194, 199, 208, 283, 345, 348, 375, 382, 3339);
- the playbook's "How to unblock yourself: methods proven 4–5 Nov 2026" (it covers seeding and reading, not sign-in);
- `staging-boot2.mjs`, `mint-staging-session.mjs`, `init_creds.sh` and `load_creds.py`;
- `find / -name "*cookie*" -newer …` (no newer session anywhere in the container).

**What unblocks it:**
- the QA lead exports a fresh cookie set for **sv11839** (`/tmp/cln/qa11839/cookies.json`) and, for area 4, for **staging** (`/tmp/cln/cookies.json`);
- then `python3 tools/preflight.py` must print 200 for both.

The Fiji day-boundary window recurs every day from 12:00 to 23:59 UTC, so nothing is lost by waiting one day. The Karachi window is from 19:00 UTC, and Edmonton's from 00:00 to 06:00 or 07:00 UTC.

**No data was seeded, nothing was changed on any environment, and no Jira or TestRail write was made.** `seed-log.jsonl` is therefore not created.

## Area table

| # | Area | Status | Evidence / reason |
|---|---|---|---|
| 1 | Reconcile confirmed defects against tickets | **DONE: nothing missing** | `RECONCILE.md`. Every Dashboard defect Chris confirmed, or that the passes found, has a ticket. One note: SV-11688 (Technician Utilization, Blocked) is not under SV-11839. |
| 2 | Day boundary / time zone | **NOT VERIFIED: blocked (sign-in)** | Plan 2 below |
| 3 | Report drill-in (Story 10) and chart on the report page (Story 11) | **NOT VERIFIED: blocked** | Plan 3 below |
| 4 | Access by role (Story 1, staging) | **NOT VERIFIED: blocked** (staging quick-login 401) | Plan 4 below |
| 5 | Stories 6–9 gaps | **NOT VERIFIED: blocked** | Plan 5 below |
| 6 | Location switch | **NOT VERIFIED: blocked** | Plan 6 below |
| 7 | Visual conformance (Story 12) | **NOT VERIFIED: blocked** | Plan 7 below |
| 8 | Money edge cases | **NOT VERIFIED: blocked** | Plan 8 below |

**Candidate defects drafted: none.** The Rule 94 gate needs a reproduction on screen with the zones matched, and none was possible. No D-folder was made, because a draft without a reproduction would be inference (Rule 12).

---

## Ready-to-run plans (for the next session with live cookies)

Every expectation below is quoted from the PRD v53 or from Chris's answers; none comes from the build.

**About the "look first" notes.** Some come from reading the SV-11839 branch code at `/home/user/shopview`, `origin/SV-11839`. That is the playbook's "read the query handler first" unblock method. These notes say **where to look**, never what is right (Rule 57). They are not findings.

### Common start (Rule 99)
1. `python3 tools/preflight.py`: both must print 200. If the branch is asleep, wake it (playbook, "More sv11839 recipes").
2. Boot with `../sv11839-ticket-qa-2026-11-04/tools/common.mjs`:
   - `boot(loc)` with `TZ=<zone>`;
   - it does the change-location, browser `timezoneId` and `localStorage['timezone']`, and records `rule99.all_match`.
   - Add **DVI Test** to `LOC`: `{ id: '93404b24-8d43-4459-b152-513e64e2ad81', name: 'DVI Test', tz: 'Pacific/Fiji' }`.
3. Seeding: `../sv11839-ticket-qa-2026-11-04/tools/seed_qa.py` steps customer, wo, clock, status, invoice.
   - It is hard-wired to Heavy Duty/Lethbridge with `ZONE='America/Edmonton'`. For DVI Test, copy it with `W=DVI`, `ZONE='Pacific/Fiji'`.
   - **First check that DVI Test has a canned line and a technician.** The DVI copy was made on 5 Nov and may have neither. If not, add a line on screen, or use Test Location (Karachi, from 19:00 UTC).
   - Log every call to `seed-log.jsonl` in this folder.
4. ⚠️ Edmonton: the system tz database says UTC−6 from 1 Nov 2026, but Chromium 153 says UTC−7 (playbook). Record both offsets. Do not judge an Edmonton result within one hour of midnight.

### 2. Day boundary / time zone
**Documents:**
- S10-R8: *"…through today, in the workplace's timezone."*
- S5-R15: *"counted in whole calendar days in the selected workplace's timezone … The count therefore changes at the shop's own midnight … two people viewing the same workplace from different places see the same number."*
- S11-R8: *"The embedded chart never runs past today."*
- S7-E1: *"If the selected range has not finished, the tile's headline and sparkline both describe the same partial window."*
- Chris 39(b), for the export: *"Time counts on the day it was worked, in the location's time zone. A timesheet that runs past midnight is split at midnight."*

**Checks.** Each is read at once in the ahead-of-UTC window, then again after UTC catches up (after 00:00 UTC for Fiji).

| # | Check | Expected |
|---|---|---|
| 2.1 | ZZAUTOTEST invoice at DVI Test while Fiji is a day ahead of UTC. Look at Revenue and the invoice count on This Week, This Month and a Custom range of today only. | Counted on the **Fiji** date in each; the daily bucket is labelled with the Fiji date. |
| 2.2 | The same invoice on a Custom range of **yesterday** (the UTC date) | Not counted. |
| 2.3 | Revenue tile link → Sales report | The same invoice and total. For Custom ranges both ends are the Fiji dates. |
| 2.4 | Technician Efficiency and Billing Efficiency: invoice a WO clocked in the window | Hours land on the Fiji date. The tile equals its report. |
| 2.5 | Technician Utilization: a clock finished in the window | Hours land on the Fiji date. The tile equals the report. |
| 2.6 | Technician Utilization: a clock that runs across Fiji midnight (for example 23:30–00:30 local) | **PRD silent.** Chris's 39(b) was given for the export. If the tile puts all of it on the start day, write a **question for Chris**, not a defect. |
| 2.7 | At Risk: a customer whose last invoice was on day N | The count changes at the shop's midnight (S5-R15). Needs an invoice dated in the past: check whether one can be seeded on screen; do not use only the API. |
| 2.8 | The dashboard on This Week | Opens on the Fiji week, not the UTC week. On a Monday in Fiji, This Week has two days. |

**Look first (code facts, not expectations):**
- The dashboard server builds its buckets in the workplace zone: `api/src/Dashboard/Tiles/Domain/BucketCalendar.php`.
- Technician Efficiency buckets by the invoice's UTC instant: `TechnicianEfficiencyMeasure::invoicedAtOf`.
- The front end reads `localStorage['timezone']`.
- So the tiles look built for this. The risk is more in **the reports reached by drill-in** and in **Technician Utilization's clipping** (`TechnicianUtilizationMeasure`, "00:00:00 .. 23:59:59 in the workplace timezone").

### 3. Report drill-in (Story 10) and chart on the report page (Story 11)
**Documents:**
- S10-R3: *"The report opens with the date range the tile currently shows."*
- S10-R5: *"…opens with that preset selected. It does not show 'Custom'."*
- S10-R6: *"A report opened on a preset covers exactly the dates the tile showed."*
- S3-R1: *"equals the figure the measure's matching report shows for the same workplace, date range, and filters … at every moment"*.
- S11-R3: *"reflects the report's own active filters"*.
- S11-R7: *"same figures as the report"*.
- S11-R8: *"never runs past today"*.
- S11-E1: *"show or hide … remembered per report"*.
- S12-R6: *"opens its Date filter panel once, in its final position, with no jump"*.

| # | Check | Expected |
|---|---|---|
| 3.1 | Each of the 5 links, on every preset and on Custom | The report shows the preset name (Custom only for a custom range) and the same figure. |
| 3.2 | **Technician Utilization and Sales By Customer reports with a remembered Location choice.** First pick "All locations" on the report, go back to the Dashboard, then follow the tile link. | Same workplace as the tile (S3-R1, S1-R4). These two reports sync `locationIds` in the URL and keep it as a filter. The drill-in link carries only the date (`reportLinks.ts`). |
| 3.3 | **Technician filter on the tile** (e.g. 2 technicians unticked) → Technician Efficiency / Utilization report | **PRD silent** on whether the report takes the tile's chart filter (S10 names the date range only). If the report shows all technicians and a different figure, that is a **question for Chris** about S3-R1 "and filters". |
| 3.4 | Browser Back from the report | The Dashboard tile keeps the range the user picked in this visit (S7-R8 only forbids carrying it *between visits*), and the expanded tile stays (S6-R16). |
| 3.5 | Report chart on This Month / This Week | Ends today, with no empty days (S11-R8). The table and totals are unchanged. |
| 3.6 | Hide the chart, leave, come back | Still hidden (S11-E1). |

### 4. Access by role (Story 1, staging only, quick-login allowed there)
**Documents:**
- S1-R6: *"shown to any user who has the reportsPageAccess permission … the only gate"*.
- S1-R7: *"A request to any of the dashboard's own endpoints from a user who lacks reportsPageAccess is refused … and returns no dashboard data."*
- S1-R8: *"…enters the dashboard address directly is redirected to Work Orders rather than shown an error page."*
- S1-R3 / S1-N2: login never lands on the dashboard.
- S1-R5: *"immediately to the right of the 'Reports' entry."*

| # | Check | Expected |
|---|---|---|
| 4.1 | `tech` (quick-login): nav entry; `/dashboard` typed in; `GET /api/dashboard/reports?reports[]=revenueKpi…` | If the role lacks reportsPageAccess: no entry, a redirect to Work Orders, and a 403 with no data. If it has it: everything works. |
| 4.2 | A role with Reports turned off (custom role, reset afterwards; Rule 26) | The same as without access. |
| 4.3 | Login while the last page was the dashboard | Does not land on the dashboard (S1-R3). |
| 4.4 | A role with Reports but without per-report permissions (e.g. no Technician Utilization) | Code fact (where to look, not an expectation): `DashboardReportRegistry` maps each tile key to "the permission each one" needs. The PRD (S1-R6) says reportsPageAccess is the *only* gate. If a tile is refused for a role that has reportsPageAccess, write a **question for Chris** (or a defect if S1-R6 is read strictly). |

### 5. Stories 6–9 (the parts not covered on 4 Nov)
**Documents:**
- S7-R7: KPI tiles open on This Month; Sales by Customer opens on Last 12 Months.
- S7-R8: *"A tile's date range is not carried between visits."*
- S6-R16: remembered choices are the expanded tile, chart filters, the At Risk window and the embedded chart.
- S7-R2a: custom range up to 366 days, plus Today.
- S4-R12/R13: the empty placeholder when fewer than 2 points, or all zero.
- S9-R11: *"No data for selected date range"*.
- S9-R5: tooltip = advisor % and ELR.
- S9-R10: legend hover shows *"120% · Aug 2026"*, with no average.

| # | Check | Expected |
|---|---|---|
| 5.1 | Change each tile's range, reload, then switch location and come back | Each tile is back on its S7-R7 default. |
| 5.2 | Custom: a single day; a range ending today; a range ending in the future (if the picker allows it) | One-day buckets. The chart never runs past today (S7-E1, S11-R8). |
| 5.3 | Empty states: DVI Test (new, no data) on every tile | Placeholder on the tile (S4-R12 to R18). The expanded chart reads "No data for selected date range". The headline follows S3-E3 (no value when the denominator is 0). |
| 5.4 | Tooltip and legend values against the table | Equal. Billing Efficiency shows % and ELR. |

### 6. Location switch
**Documents:**
- S1-R4: *"figures for the workplace the user currently has selected in the top navigation"*.
- S6-R14: *"never shows a stale…"*.
- S6-R16: per-tile memory.

| # | Check | Expected |
|---|---|---|
| 6.1 | Heavy Duty → Test Location → DVI Test, with tiles expanded and filters set | No figure from the previous location, even for a moment. A technician filter for a technician who is not at the new location must not empty the chart without a reason. |
| 6.2 | SV-11822 (REJECTED) | Re-check only if the coordinator asks. It is an open ticket. |

### 7. Visual conformance (Story 12)
Check at 1920, 1536×864, 1280, 1024 and 390 px wide, in light and dark.

**Requirements:**
- S12-R1: four KPI tiles in one row at 1024 px or wider.
- S12-R2/R3: near-black or near-white descriptive text.
- S12-R4: the count headline is larger.
- S12-R7: rows visible under the report chart at 1536×864.
- S12-R9: the date picker never floats away.
- S12-R10: a filter list never covers the menu bar.
- S12-R11: a dark date picker in dark mode.
- S12-R12: the date button works on a small screen at any scroll position.
- S12-R13: no sideways scroll; a long date label fits.

"Not looking nice" is not a defect. Only these requirements count.

### 8. Money edge cases (Story 3)
**Documents:**
- S3-E2: *"A voided invoice is excluded from every figure the dashboard shows"* (Revenue, split, invoiced hours, Sales by Customer and At Risk counts).
- S3-E1: Revenue may be negative.
- S4-R3: the split, with Parts net of credits.
- S4-N2: *"{count} Invoices"* when there is no split.
- Chris Q2: revenue is after the discount.

| # | Case | Expected on every tile |
|---|---|---|
| 8.1 | Voided invoice | Gone from Revenue, the split, invoiced hours, Technician Efficiency, Sales by Customer and At Risk. |
| 8.2 | Reversed and re-created invoice | Counted once (compare SV-11946 on Parts Velocity). |
| 8.3 | Credit memo | Revenue drops; not in the invoice count. Recipe: `POST /api/credit-memos` (playbook), or on screen. |
| 8.4 | Refund / deposit | **PRD:** Revenue is invoice subtotals minus credit memos, so neither a deposit nor a refund moves Revenue. Confirm this against the PRD table (S3-R2) before calling it. |
| 8.5 | $0 invoice | Counted as an invoice; $0.00 revenue; does not make a customer "with revenue" (S5-R15 needs > $0.00). |
| 8.6 | Invoice with part sales only | Split reads Parts 100 % (Labor 0 %); the "· Other" share is left off. |

## Not covered, and why
- **Areas 2–8, every check:** both test sites refused sign-in (401 `sso_required`), and only the QA lead can mint cookies. Each plan above can run as soon as `tools/preflight.py` prints two 200s.
- **No ticket or Chris-comment drafts:** nothing was reproduced (Rules 12 and 94).

## Files
- `RECONCILE.md`: area 1.
- `tools/preflight.py`: sign-in check that prints no secrets (run 17:30 UTC: 401 / 401).
