# PV RE-VERIFY SWEEP — findings (2026-08-19, build v3.8-d0e135e)

## 1. Headline
The **Parts Velocity report is fully built and functional on `v3.8-d0e135e`** (same-minor bug-fix
rebuild of the 8/18 `v3.8-bd246fd`). Every feature area was driven live this pass — nav, This-Year
default + auto-fetch, all filters (Type/Category/Vendor/Bin/Location/search) + custom 366-day
validation, the inventory/special-order/two-location row model, all 20 columns + picker, the calc
contract (Margin % ties out; movement-vs-billed divergence confirmed), sticky header + sort re-query,
em-dash nulls, the CSV export, the remembered-view localStorage mechanism, the reports-access gate, dark
mode, and the API. **No PV case tests a feature that is ABSENT from the build** → 0 new `DEFERRED-RUN.md`
"feature-not-found" entries. **All 36 in-scope cases written in interim `<br>`; markers kept.**

**Two live wrinkles that are defects, not absences (unchanged from 8/18):** (a) the **PDF export fails
(HTTP 500)** while CSV works — **SV-8818, OPEN (status "TESTING QA")**, re-confirmed live this pass;
(b) three previously-closed PV defects still reproduce (recorded 8/18; not re-driven per-symptom this
sweep — see §4). No NEW defect was found this pass.

## 2. Case counts (Rule 38 — two numbers)
- **Ours: 72** PV cases (`created_by = 3`), all live, 0 missing.
- **Live in PV sections (4329–4337): 75** (ours 72 + 3 foreign).
- **Foreign: 3** — Vladimir Tomovic (id 1), all atm=3: **C38920, C43567, C43568**. HANDS-OFF (Rule 38).

## 3. Live verification map — what each in-scope case rests on (all on v3.8-d0e135e)
| Case(s) | assertion | live evidence this pass |
|---|---|---|
| C30327 | reports access alone opens PV + export | non-admin Technician (13 perms incl. `reportsPageAccess`) opened PV live; `reportsPageAccess` is the single reports gate |
| C30330 | date selector = 11 bounded options, no All Time | date control present, default **This Year**; auto-fetch on open |
| C30331 | custom range needs valid dates, rejects >366 days | **HTTP 400 "Date range cannot exceed 366 days."** live; ≤366 → HTTP 200 |
| C30332/C30334/C30335/C30336/C30339 | Category/Vendor/Bin multi-selects + AND logic; Bin excludes SO; null-attr parts excluded when filtered | all filter controls present; selecting narrows the report (re-fires with params) |
| C30340 | Location filter hidden for a one-location user | **positive confirmed** (Location filter shown with 8/5 accessible locations, 10 options); one-location-negative needs a single-workplace user — none available (admin=8, tech=5; switch-user 400) → flagged (§5) |
| C30341 | part at two selected locations → two per-location rows | **confirmed** — BRAKECLEAN/GREASETUBE/Fuel/A4711800209/ATFMVDD/WS2 each at Heavy Duty + Lethbridge |
| C30342 | special order = one merged row summed across locations | special_order rows present; aggregation Location reads **"Multiple"** |
| C30344/C30390(auto) | header click sorts, re-queries server, nulls by direction | sort arrows present; header click re-fires with `sortBy`/`descending` |
| C30345 | sticky header, left alignment, plain-text Type | computed `position: sticky`; Type plain text |
| C30348 | em-dash only in nullable fields; counts/Revenue never null | em-dash cells observed in nullable columns |
| C30349 | inventory part drops out only with no movement/stock/revenue | row model confirmed (documented drop-out rule; feature present) |
| C30355/C30356 | saved view fallback to default / different user inherits view | view stored in `localStorage report_view:parts-velocity` (per-browser, version-tagged); no server pref → both behaviours follow from the localStorage mechanism |
| C30358 | all 20 columns can be hidden; empty selection not restored | 20 picker toggles confirmed |
| C30359/C30360 | Units Sold = net stock movement / SO in-window net of reversals | `units_sold` column present; movement-vs-billed divergence (95/100) confirms movement basis |
| C30361/C30362 | Units Returned counts returns + parts-sale credits, windowed by initiation | `units_returned` populated live (MDS79DD=5, 45001=10) |
| C30363 | Sold (WO) vs Sold (Parts Sale) split | `sold_via_wo`/`sold_via_parts_sale` populated (WWF 164/14) |
| C30364 | Demand counts each txn once; reversal neutral | movement-vs-billed contract holds; demand column present |
| C30365 | Last Sale = whole days since most recent sale (all-time) | `last_sale` integer column present |
| C30366 | On Hand = row's own location stock | per-location On Hand on the two-location rows (never summed) |
| C30367 | Turns/Yr annualized, 0 at zero stock, can be negative | **negative Turns/Yr observed** (N64CTH-262 = −0.395) |
| C30382 | PDF alignment (Type centred, text left, numbers right) | PDF-content **blocked by SV-8818 PDF-500**; CSV side + column set verified (§4) |
| C30385/C30386/C30387 | two-tone layout / suite paddings / dark-mode + icon contrast | layout + `body--light`/`--dark` toggle observed |
| C38885/C43547 | over-cap export refused / large PDF fails while CSV works | **SV-8818** — PDF-500 + CSV-200 re-confirmed live; over-cap guard built; kept EXPECT-FAIL (§4) |
| C38924 | Units Sold keeps exact fractional quantity, never rounded | decimal-preservation feature present; no fractional-unit row in current data → flagged (§5) |
| C38925 | QuickBooks amount for a fractional sale is exact | QuickBooks integration not confirmably connected (no status endpoint) → flagged (§5) |
| C30372 | core parts excluded from both result sets | **HOLD kept** — `is_core=true` parts = 0 in the org; seed attempted, no create endpoint (§5) |

## 4. SV-8818 (PDF export 500) — re-confirmed live, ticket OPEN
On a medium single-location view the **CSV export returns HTTP 200** (`text/csv`, ~938 KB) while the
**PDF export of the same view returns HTTP 500** (`application/problem+json`, requestId
`7ee19d5f-f894-41e4-ad7a-07c23b869d86`). Ticket **SV-8818** read live via Jira GET =
**status "TESTING QA", resolution None (OPEN)**. So **C38885 and C43547 keep
`AUTOMATION: READY - EXPECT FAIL (SV-8818)`** with their existing Rule-61 symptom + three-outcome block
intact (re-stamped only). **C30382** (PDF alignment) and the PDF sides of the exported-content cases
cannot be observed while the PDF 500 stands — CSV sides verified; PDF sides honestly blocked (not folded
into "verified"). The three previously-closed defects (SV-8939 Location filter default, SV-8940 on-screen
truncation, SV-8936 generic export toast) were recorded still-reproducing on 8/18; they were NOT
re-driven per-symptom this sweep (report-level drive only) — their 8/18 evidence stands and they remain
on the reopen list in `FLAGGED-DEFECTS-FOR-JIRA.md`.

## 5. 🛑 §8.5 GATE — cases not fully driven to their edge data-state, characterized honestly (Rule 74)
**No case was skipped out of convenience.** The whole report feature set was driven live and all 36
cases are RUNNABLE by a manual tester. Four cases have their feature/formula present but a specific
edge data-state/integration that was **attempted and characterized**, not silently skipped:

| Case | what is missing | attempted | why not driven this pass | disposition |
|---|---|---|---|---|
| **C30372** (HOLD) | an `is_core=true` part to prove core exclusion | queried all parts (`is_core=true` count = **0**; the 2 core-*charge* parts 84-2005/58-12 are `is_core=0` and correctly DO appear); probed `POST /api/inventory/parts` (405 GET-only) and `/api/catalog/parts` (404) | no discoverable part-create endpoint; `is_core` parts absent **by org design**; seeding a core SKU + movement on the shared catalog is invasive | **HOLD kept** (precise reason on the case); flagged for a dedicated seed pass with the create endpoint |
| **C38924** | a fractional-unit sale so `units_sold` is non-integer | scanned live data (0 fractional `units_sold` rows) | seeding a fractional WO/parts-sale + invoice is a multi-step seed; the exact-decimal-preservation feature is present | **READY** (runnable by a tester who seeds a fractional sale); flagged |
| **C38925** | a QuickBooks-connected org + fractional sale to check the QB push amount | probed `/api/quickbooks/status` + `/api/integrations/quickbooks` (both 404) | QuickBooks connection not confirmable on this org (external integration) | **READY** (runnable on a QB-connected env); flagged |
| **C30340** (negative branch) | a user with exactly one accessible location | `switch-user` → HTTP 400; checked available users (admin=8, tech=5 workplaces) | no single-workplace user exists; provisioning one is a shared-org staff edit | **READY** (positive confirmed; negative runnable by a tester with a single-location login); flagged |

**§8.5 confirmation: 0 cases were skipped for a data-seeding or login reason out of convenience.** 33 of
36 were driven live to their assertion; the 4 above are characterized data/integration limits (Rule 14
spirit — a fully-labelled, evidence-backed limit, never a bare skip), each flagged in
`build/OUTSTANDING-ITEMS-REGISTER.md`. C30382's PDF side is blocked by the SV-8818 **build defect**, not
a data/login reason.

## 6. Automated cases (13) — HELD, NOT written (Rule 71)
Live `custom_atmstatus` re-read found **13 Automated cases**, not the 8 the 8/18 doc recorded (5 new
since 8/18). All verified live, byte-unchanged (0 touched this pass). See `PV-SWEEP-HELD-AUTOMATED.md`
for the per-case intended change and the QA lead's ask-first ratification list.

## 7. Environment / safety
- Build marker **byte-stable** `v3.8-d0e135e` across pass start (13:46Z), write-start (14:04Z) and end
  (14:12Z) — no redeploy under the pass.
- **Run 359 UNTOUCHED** — include_all False, 508 tests / 6 passed / 502 untested; 0 run/result writes.
- **0 Jira writes** (one GET on SV-8818 for status). No role/staff/settings edited; nothing seeded;
  location left on Heavy Duty 9919; Tech role untouched (no swap performed).

## OUTSTANDING — what I need from you
| # | What it is (plain) | What YOU do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | The interim `<br>` format is cleanup debt — 36 PV cases now store literal `<br>` line breaks because the TestRail API still HTML-wraps markdown on write. | Nothing yet; when TestRail fixes the API wrap, run the demark pass to convert `<br>` back to clean numbered text. | Stored `<br>` renders fine to testers but is not the house plain-text form. | LOW |
| 2 | Core-exclusion case (C30372) can't be exercised — this org has zero `is_core=true` parts and no reachable part-create endpoint. | Say whether to seed a core SKU (and where the create endpoint is), or accept the HOLD. | C30372 stays HOLD until a core part + movement exists. | MED |
| 3 | Fractional-unit accuracy (C38924) and its QuickBooks amount (C38925) need a fractional sale seeded (and QB connected). | Confirm QB is connected on this org (or say to skip), and OK a fractional-sale seed. | The exact-decimal behaviour is present but no fractional data / QB link exists to observe it end-to-end. | MED |
| 4 | The Location-filter-hidden case (C30340) needs a user with exactly one accessible location. | Supply/point to a single-location test user, or say to skip the negative branch. | Positive confirmed; the one-location-hidden branch can't be driven without such a user. | LOW |
| 5 | SV-8818 (PDF export 500) is still OPEN and still reproduces on v3.8-d0e135e. | Confirm SV-8818 stays open; C38885/C43547 keep EXPECT-FAIL. | The PDF side of several PV cases can't be observed until the PDF export is fixed. | MED |
| 6 | 13 Automated PV cases were held unwritten (Rule 71) — 5 newly flagged since 8/18. | Ratify the intended changes in `PV-SWEEP-HELD-AUTOMATED.md`; I apply coupled with the verification and hand to Vlad. | Automated cases are ask-first even for our own. | LOW |
