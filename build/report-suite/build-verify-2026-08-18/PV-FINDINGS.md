# PV-FINDINGS — Parts Velocity live build-verify (2026-08-18, build v3.8-bd246fd)

## 1. Headline
The **Parts Velocity report is fully built on `v3.8-bd246fd`** — every feature area was driven live this
pass: nav (Reports → new **PARTS** group → Parts Velocity), the **This Year** default with auto-fetch,
all filters (Type / Category / Vendor / Bin / Location + toolbar search), the inventory/special-order
row model, all 20 picker columns, the full calc column set, sorting headers, header info tooltips, the
**CSV export**, and the API. **No PV case tests a feature that is ABSENT from the build** → `DEFERRED-RUN.md`
gets 0 PV "feature-not-found" entries.

**Two live wrinkles that ARE defects, not absences:** (a) the **PDF export fails (HTTP 500/502) at every
size** while the CSV works (§F5, SV-8818 — OPEN); (b) three previously-ticketed defects that were closed
**STILL REPRODUCE** on this build (§F1–F3). One previously-ticketed defect (SV-8935) is **FIXED**.

## 2. Case counts (Rule 38 — two numbers)
- **Ours: 72** PV cases (`created_by = 3`), all in the id-map, all live.
- **Live in PV sections (4329–4337): 75** (ours 72 + 3 foreign).
- **Foreign: 3** — Vladimir Tomovic (id 1), all atm=3: **C43567** (filter-panel search keyboard focus),
  **C38920** (Location column scope-governed), **C43568** (Manual Parts return → Units Returned).
  HANDS-OFF (Rule 38), not touched, not counted in ours.

## 3. Marker split (live, read back at pass end)
| Marker | Count |
|---|---|
| `AUTOMATION: READY` | 66 |
| `AUTOMATION: READY - EXPECT FAIL (SV-8818)` | 2 (C38885, C43547) |
| `AUTOMATION: READY - EXPECT FAIL (SV-8938)` | 1 (C30352 — Automated, HELD) |
| `AUTOMATION: HOLD` | 1 (C30372 — no core part exists) |
| `AUTOMATION: Not available on Build to test Yet` | 2 (C30346, C30353 — Automated, HELD; features present) |
| **Total** | **72** |

**Gate: READY + EXPECT-FAIL = 69; 72 − 1 HOLD − 2 not-available = 69.** Passes both ways.
Ready-to-automate = 69 (the 2 not-available are held Automated cases whose features ARE present — they
stay deferred only because Rule 71 forbids the write, not because the feature is absent).

## 4. Calc contract (epic SV-8582 / FORMULAS-SV-8582.md) — VERIFIED live per-row
The report endpoint `/api/reporting/reports/parts-velocity` returns the computed columns server-side
(units_sold, unit_cost=Avg Cost, sell_price=Avg Sell, revenue, margin, margin_pct, demand, last_sale,
turns_per_year, on_hand). Checked over 250 live rows:
- **Margin % = Margin ÷ Revenue × 100** (one decimal) — **0 mismatches of 250 rows.** ✅
- **Margin = Revenue − COGS** ties out (margin_pct derives from it and matches). ✅
- **Revenue ≠ Avg Sell × Units Sold on 111 of 250 rows — and that is CORRECT, not a defect:** it is
  exactly PV-CALC-15 (movement-based Units Sold differs from the billed units behind Revenue/Avg Sell).
  Avg Sell = Revenue ÷ billed-units, not ÷ Units Sold. The 111 divergences **confirm** the documented
  movement-vs-billed distinction. ✅
- Row types live: 248 inventory + 2 special_order (row model correct).

**No calc defect found.** The FORMULAS-SV-8582.md contract holds on the build.

## 5. FLAGGED DEFECTS (Jira creation on the QA lead's hold — NOTHING FILED). All on `v3.8-bd246fd`.
Recorded with live evidence + recommendation.

- **F1 — SV-8939 STILL REPRODUCES (Location filter default), C30337.** On a fresh hydration the Location
  filter opens showing **"All locations"** and the table returns all-location rows, even though the
  global switcher is "Staging Heavy Duty - 9919". Spec (S2-R9 / Chris Ward's decision) wants it to
  default to the **user's currently active location**. Ticket SV-8939 is **OBSOLETE/Done**. Marker
  stripped → plain READY (tester fails it correctly). Everything else about the filter is right (it lists
  only accessible locations; choosing one narrows the report; it is rightmost among the filter controls).
  **Recommend: reopen SV-8939 or file new.**
- **F2 — SV-8940 STILL REPRODUCES (on-screen truncation), C30347.** Long Description/Category/Vendor cells
  are **not truncated**: computed `text-overflow: clip`, `overflow: visible`, `white-space: nowrap`, and
  **no `title` attribute** (measured on 4 long cells, len 43–70). No ellipsis, no hover tooltip — a
  117-char description shows complete. Spec (S3-R7) wants ellipsis + native-hover tooltip. Part # is
  correctly never truncated. Ticket SV-8940 **OBSOLETE/Done**. Marker stripped → plain READY.
  **Recommend: reopen SV-8940 or file new.**
- **F3 — SV-8936 STILL REPRODUCES (export success toast wording), C30384.** A successful CSV export
  (narrowed to 4 rows) shows the toast **"Success / Data exported successfully."** — the generic message,
  not the specified **"Velocity report exported (CSV)"** / **"(PDF)"** (S6-R9/S6-N1). The failure/over-cap
  message IS correct (see §F5). Ticket SV-8936 **OBSOLETE/Done**. Marker stripped → plain READY.
  **Recommend: reopen SV-8936 or file new.**
- **F4 — SV-8938 STILL REPRODUCES but the target is a CONTESTED open PO question, C38914 (+ held
  C30352).** The Location column sits **sixth, after Vendor**, on screen AND in the CSV export (header
  order `header_pv_location` at index 5; CSV column list matches). The case expects it **leftmost, before
  Type**. BUT the case's own provenance already records that the spec says two different things (S3-R10
  access-gated/toggleable vs S2-R12 scope-tied; S4-R2/R3 list 20 picker columns that do not include
  Location), so **"neither reading is asserted here"** and Chris Ward has an open question on it. Ticket
  SV-8938 **OBSOLETE/Done**. Marker stripped → plain READY. **Recommend: get Chris Ward's answer on the
  intended Location-column position/toggle BEFORE reopening or refiling — the position is not settled.**
- **F5 — SV-8818 STILL REPRODUCES (PDF export fails; CSV works), C38885/C43547 kept EXPECT-FAIL.** Live on
  a medium single-location view (~245 rows, under the export cap): the **CSV export returns HTTP 200 with
  a valid `velocity-report.csv`**, but the **PDF export of the same view returns HTTP 500**
  (`application/problem+json`, requestId `8afc7bb6-…`) and 502 on retry, at every row count including a
  1-row page. On the **full over-cap view** (all locations, This Year) BOTH exports are correctly refused
  with the exact standard message **"This report is too large to export. Narrow the date range or filters,
  then try again."** (S6-R12 — over-cap guard IS built and correctly worded). So the SV-8818 symptom (CSV
  works, PDF errors at a size below the cap) reproduces exactly. Ticket SV-8818 is **OPEN (TESTING QA)**,
  so C38885/C43547 keep `AUTOMATION: READY - EXPECT FAIL (SV-8818)` — live-backed, no change.

## 6. Source-reconciliation / verification notes
- **SV-8935 FIXED (C30380):** the CSV Last Sale column is a **plain integer (66)**, not the words "66
  days". CSV long text is carried in full (untruncated). Ticket OBSOLETE — matches the current build.
  Marker → READY.
- **SV-8934 / PDF-content cases can only be PARTLY verified (C30379, and the PDF halves of C30381/C43834):**
  because the PDF export 500s (§F5), the PDF's 18-char truncation (SV-8934), the PDF em-dash for null cells
  (C30381), and the CSV-vs-PDF-header verbatim comparison (C43834) **cannot be observed on the build**.
  The CSV sides were verified: CSV carries full untruncated text; CSV metadata rows present
  ("Date Range: …", "Type: Both", "Locations: …"). C30379 stripped to READY (SV-8934 closed); the tester
  will hit the PDF 500 (SV-8818) first. **Flagged honestly — not folded into "verified".**
- **Over-cap guard message (S6-R12) is BUILT and exact** — see §F5. This is new-since-8/6 behaviour and
  it works.

## 7. Cases NOT made bulletproof this pass — honest N-of-M (why)
- **C30326 (PV-PERM-02, HELD Automated):** the permission-negative branch (Reports entry hidden without
  Manager/Office User role) needs a SECOND non-admin sign-in. `quick-login`/`switch-user` rotate the
  shared `sv_sso_session` and were NOT called (shared-session safety, skill-03 G3). Positive nav
  visibility observed as admin; negative not driven.
- **C30372 (PV-CALC-14, HOLD):** core exclusion — no core-flagged part exists in the org (is_core=1 = 0).
  Seedable later (core part + invoiced activity); not seeded this pass. HOLD reason confirmed accurate.
- **C30369/C30370/C30371/C30373/C30374 (CALC deferred → READY):** the calc COLUMNS are all present and the
  Margin % / movement-vs-billed contract verifies live, but the specific data-state scenarios (reverse a
  sale, null-trigger rows, differing window anchors) were NOT each seeded and driven end-to-end — they are
  seedable and are the manual tester's to execute. Feature present → lifted to READY (not build-verified
  per-scenario; stated honestly).
- **PDF-content assertions (C30379 + PDF halves of C30381/C43834):** blocked by the SV-8818 PDF-export
  500 (§6). CSV sides verified; PDF sides could not be observed.
- **Held Automated cases (8):** verified live but NOT written (Rule 71) — see PV-HELD-AUTOMATED.md. Two
  (C30346 info icons, C30353 immediate column toggle) have their features PRESENT and would lift
  DEFERRED→READY; recorded for ask-first ratification.

## 8. What WAS driven live and is build-verified this pass (26 cases carry a fresh v3.8 build-check)
9 deferred lifts + 6 expect-fail→READY strips + 11 plain-READY re-stamps = **26 cases carry
`Last checked against build v3.8-bd246fd on 8/18/2026.`** The whole report feature set was driven live
(nav, This-Year default, all filters, row model, 20-column picker, calc contract per-row, sorting, info
tooltips, CSV export ×metadata, over-cap guard, API pagination/refetch). The remaining ~38 plain-READY
cases (and 8 held Automated) had their **feature verified present at report level** but were **not
individually sentence-2-stamped this pass** — reported honestly, not folded into the build-verified count.

## 9. Automated cases (8) — HELD, verified live, NOT written
C30326, C30328, C30333, C30338, C30346, C30352, C30353, C30390 — see `PV-HELD-AUTOMATED.md`. Two need a
marker change (C30346, C30353: DEFERRED → READY, features verified present); one would strip an expect-fail
(C30352, SV-8938 closed). Two possible label/order discrepancies on C30328 recorded there. All recorded
for the QA lead's ask-first ratification (Rule 71).

## 10. Environment / method
- UI hydrated **directly from the supplied session cookies + `/tmp/seed.json`** — **NO
  `quick-login`/`switch-user`** (shared-session safety; a custom cookie-only boot, not `staging-boot2`
  which quick-logs-in).
- Location was **All locations** for the report screen (report default) and single-location Heavy Duty for
  the direct-API export probes; no role/staff/settings edit, nothing seeded, all observation read-only
  against existing data.
- Build marker **byte-stable** at pass start (20:44:03Z) and end (21:13:13Z): `v3.8-bd246fd`,
  last-modified 19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc` — no redeploy under the pass.
- **Run 359 untouched** — 0 run/result writes (only `update_case`); include_all still False; 508 tests
  unchanged. **0 Jira writes** (GET only).

## OUTSTANDING — what I need from you
| # | What it is (plain) | What YOU do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | Three Parts Velocity defects whose tickets are closed (Done) but STILL happen: Location filter defaults to All locations not the active one (SV-8939, C30337); long text is not shortened/no tooltip on screen (SV-8940, C30347); export success toast is the generic "Data exported successfully." (SV-8936, C30384). | Say whether to reopen SV-8939/8940/8936 or file new (Jira creation is on your hold). | The tester will fail these and has no live ticket to point at. | MED |
| 2 | The Parts Velocity **PDF export fails with a server error (HTTP 500/502)** on a medium view while the CSV works (SV-8818, still OPEN). Over-cap views are correctly refused with the "too large" message. | Confirm SV-8818 stays open; decide if the PDF-content cases (C30379 truncation, C30381 PDF nulls, C43834 CSV-vs-PDF) should be marked blocked-on-SV-8818 rather than plain READY. | The PDF side of several cases can't be observed at all until the PDF export is fixed. | MED |
| 3 | The Location column position/toggle for Parts Velocity is an **open PO question** (spec says two different things; C38914/C30352). It sits 6th, not leftmost — but "leftmost" isn't confirmed as the target. | Get Chris Ward's answer on the intended Location-column position and whether it's toggleable, before we treat 6th as a defect. | Refiling SV-8938 without the answer risks a "does not make sense" ticket. | MED |
| 4 | Ratify the 2 Automated Parts Velocity cases whose feature is now built and would lift DEFERRED → READY (C30346 header info icons, C30353 immediate column toggle), and the 1 that would strip a stale expect-fail (C30352, SV-8938 closed). | Say yes; I apply them coupled with the verification recorded, then hand the case numbers to Vlad. | Rule 71 — Automated cases are ask-first even for our own. | LOW |
| 5 | A second, non-admin test sign-in for the Report Suite branch. | Supply a second (non-admin) session, or say to skip permission-negative checks. | The PV-PERM-02 negative branch (Reports entry hidden without role) can't be driven with one admin cookie without rotating the shared session. | LOW |

Nothing else is outstanding for the Parts Velocity build-verify itself.
