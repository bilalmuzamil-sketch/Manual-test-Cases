# TU-FINDINGS — Technician Utilization live build-verification (2026-08-18)

**Build:** `v3.8-bd246fd` (app.staging.shopview.com), last-mod 2026-08-18 19:57:31 GMT, etag
`c4dd352f91ecfee192844c6a04a643fc`, byte-stable pass start→end. Default location **Staging Heavy Duty -
9919**. Sources not re-fetched this pass (build-verify only); expected behaviour comes from the epic
SV-8582 / TU spec v9 / PO answers already cited on each case (Rule 57). **No Jira actions** (creation on
hold — Rule 62/skill 06). **No ticket filed for any deviation below** — each is flagged with live
evidence + a recommendation only.

## What is BUILT and verified present on v3.8-bd246fd
Nav under **PERFORMANCE** (below Sales / Technician Efficiency / Advisor Analysis / Shop Efficiency);
route `/reports/technician-utilization`. Columns, left→right: **Technician · Location · Total Hours · WO
Hours · Internal Hours · Utilization % · Est. Lost Labor** (info icon on Est. Lost Labor). Toolbar,
left→right: **Export report** (3-dot, `aria-label="Export report"`) → **Column Selection**
(`width_normal` icon) → **Expand all technicians** (header, `keyboard_double_arrow_down`). Per-row
accessible **Expand `<name>`'s daily breakdown** control. Filters: **Filter By Technician** (multi-select,
All technicians / Clear all) and **Location** (rightmost multi-select, All locations). Date range presets
(defaults **This Month**). Pinned **Summary** row. Export menu = 4 options: Download Summary (PDF),
Download Summary (CSV), Download Expanded View (PDF), Download Expanded View (CSV). Empty-state message:
**"Empty bays, endless possibilities. Get Going!"**.

## §Calc — the TU calc contract verifies EXACTLY on live data
Source of the contract: the TU spec v9 requirements cited on the HRS / ELL / SUM cases (Rule 57). Live
data read from `GET /api/reporting/reports/technician-utilization?range=this_year` (37 technician rows)
and the exported CSVs.

- **Utilization % = WO seconds ÷ Total seconds × 100** (from unrounded values). Live samples:
  Admin ShopView 94.27/279.58 = **33.7%** ✅ · Alyssa Randall 743.41/744.51 = **99.9%** ✅ ·
  Christian Pitts 31.23/931.66 = **3.4%** ✅ · a technician with only internal hours (Mudassir Qamar,
  wo=0, internal>0) = **0.0%** ✅ (TU-HRS-04) · a technician with 0 total hours (Vladimir Tomovic)
  renders **"—"** in Utilization % (0/0), not 0.0%.
- **Est. Lost Labor = Internal hours × the location's default labor rate** ($125/hr at Staging Heavy
  Duty). Live: Alyssa 1.10 h → **$137.50** ✅ · Andrew Wade 29.50 h → **$3,687.50** ✅ · Admin 185.31 h →
  **$23,163.75** ✅ · zero-internal techs → **$0.00** ✅. Per-day rows tie too (24.00 internal h →
  **$3,000.00**). Tooltip on the header reads verbatim **"Internal hours valued at each location's
  default labor rate"**.
- **Summary Utilization % is the WEIGHTED rate, not a row-average** (TU-SUM-03): summary
  9,707.40 WO h / 11,864.13 total h = **81.8%**, i.e. total WO ÷ total hours, not the mean of the 37
  rows' percentages ✅.
- **Summary totals sum the visible technicians** (TU-SUM-02/04) and recalculate live when a technician
  is deselected (33.73 → 10.50 when Admin deselected) ✅.

## §F — deviations found live (all flagged, NONE filed — creation on hold)

**§F1 — SV-8943 (TU-NAV-03) STILL REPRODUCES.** The report opens on **All locations** (not the user's
active shop): the Location filter reads "All locations" and rows come from multiple locations. The
date-range half is correct (defaults This Month). Ticket OBSOLETE/Done → marker stripped to READY.
*Honest caveat: with a shared account carrying persisted state, first-visit default is hard to isolate;
the observed symptom matches SV-8943 exactly.* **Recommendation:** the QA lead may reopen SV-8943.

**§F2 — SV-8945 (TU-API-02) STILL REPRODUCES.** Both a **column-header sort** and a **technician-filter
deselect** fire a `GET /api/reporting/reports/technician-utilization` server request; the spec requires
both to be client-side only. Items 1–2 (date-range and location changes reload) pass. Ticket OBSOLETE →
stripped to READY. **Recommendation:** reopen SV-8945.

**§F3 — SV-8950 (TU-EXP-02) PARTIAL.** The **Summary row is still absent** from both the Summary PDF and
the Expanded PDF (the file stops at the last technician) — STILL REPRODUCES. The **filename half is now
FIXED**: files download Title-Case as `Technician-Utilization-Summary.pdf` /
`Technician-Utilization-Expanded.pdf`. Ticket OBSOLETE → stripped to READY. **Recommendation:** the
Summary-row-missing defect is real; reopen or re-file (held — creation on hold).

**§F4 — SV-8951 (TU-EXP-03 / TU-EXP-10) STILL REPRODUCES.** There are **two spreadsheet files**, not one:
`Technician-Utilization-Summary.csv` and `Technician-Utilization-Expanded.csv`, and the **Expanded CSV
holds a row for each day** (verified: `2026-08-03,2026-08-04,…` rows). **Neither CSV contains the Summary
row.** The comma-quoting requirement passes (`"$7,248.85"`-style values are double-quoted; location names
quoted). The spec wants a single summary-level `technician-utilization.csv`. Ticket OBSOLETE → both
stripped to READY. **Recommendation:** reopen SV-8951.

**§F5 — SV-8948 (TU-EXP-04 FIXED / TU-EXP-07 DIFFERENT).**
- **TU-EXP-04 FIXED** — the export now respects the technician filter: with **Admin ShopView deselected**,
  the subset CSV contained only Mudassir Qamar + Vladimir Tomovic (0 occurrences of "Admin ShopView") and
  carried a `"Technicians: Mudassir Qamar, Vladimir Tomovic"` header line. Location + date range + shown
  columns all carried correctly. → stripped to READY.
- **TU-EXP-07 DIFFERENT (new deviation).** With **all technicians cleared**, no file downloads (the old
  "a file still arrives holding every technician" bug is fixed) **BUT** an error toast appears:
  **"Empty export / Export didn't yield any results"** (`priority_high`). The spec (S7-N1) requires a
  fully **silent no-op** — no file AND no message. So the behaviour differs from BOTH the spec (silent)
  AND the old SV-8948 symptom (file+success) → **a NEW deviation from spec**, no live-backed ticket.
  Marker stripped to plain READY, flagged here. **Recommendation:** consider a fresh ticket for the
  not-silent no-op (held — creation on hold).

**§F6 — SV-8949 (TU-EXP-05) FIXED.** Downloads are ordered **Technician A→Z** (Summary CSV this_year:
Admin ShopView, Alyssa Randall, Andrew Wade, Angela Roman, Automation Tech, … alphabetical); the
on-screen sort is not carried into the export. Ticket OBSOLETE → stripped to READY.

**§F7 — Total Hours LINK feature is ABSENT (TU-LINK cluster).** The **Total Hours cell carries no link,
button or `role="link"` element** — checked in **All-locations** scope AND with the Location filter set
to the single active shop (Staging Heavy Duty - 9919). The affordance the spec describes (a real link
with a non-color affordance and keyboard access, opening Timesheet Activities) is **not found in the
build**. *Honest note: TU-LINK-01's own text says the link appears only in the default view with
active-shop-only location scope; because the report defaults to All locations (the §F1 behaviour) that
exact scope could not be forced on this environment — but in no scope reached did the cell render a
link.* Treatment: **TU-LINK-01/05/06 stay deferred** (`Not available on Build to test Yet`, date updated,
under-development line added, logged to DEFERRED-RUN); **TU-LINK-03 (SV-8944, OBSOLETE)** had its stale
expect-fail stripped and, because its feature is absent, was set to the deferred marker with the
under-development line; **TU-LINK-02 (Automated)** is HELD (TU-HELD-AUTOMATED.md — its READY marker
should be reviewed against the absent link); **TU-LINK-04** stays HOLD (needs an open clock, and the link
is absent anyway).

**§F8 — SV-8952 (TU-EXP-08) STILL REPRODUCES.** A download that starts shows the toast
**"Data exported successfully."** — not the specified **"Download started"**; a download that fails (the
empty-export case) shows **"Empty export / Export didn't yield any results"** — not the specified
**"Failed to download report"**. Ticket OBSOLETE → stripped to READY. **Recommendation:** reopen SV-8952.

**§F9 — SV-8954 (TU-LOC-06) STILL REPRODUCES.** For a multi-location user the **Location column is drawn
2nd (after Technician), not leftmost** as the spec requires, and **Location is never offered in the
Column Selection control** (Column Selection lists only Total Hours / WO Hours / Internal Hours /
Utilization % / Est. Lost Labor). Item 3 ("Multiple" for a mixed-location technician) and the
single-location-user-hides-column check (item 6) need a second sign-in and were not driven this pass.
Ticket OBSOLETE → stripped to READY. **Recommendation:** reopen SV-8954.

**§F10 — SV-8947 (TU-TECH-03) STILL REPRODUCES.** The select-all control is labelled **"All
technicians"**, not the specified **"Select all"**. The behaviour itself passes (Clear all deselects the
whole list; deselections persist across a date-range change). Ticket OBSOLETE → stripped to READY.
**Recommendation:** reopen SV-8947 (label only).

**§F11 — SV-8953 (TU-DAY-01 / TU-DAY-04) STILL REPRODUCES.** The per-row expand control's accessible name
works (`"Expand Admin ShopView's daily breakdown"`), it is keyboard-focusable and toggles; the expand-all
control lives in the header, toggles all rows, and its name flips "Expand all technicians" ↔ "Collapse
all technicians". **But `aria-expanded` is `null` on both controls** — the open/closed state is not
exposed to assistive technology, exactly the SV-8953 symptom. Ticket OBSOLETE → both stripped to READY.
**Recommendation:** reopen SV-8953.

**§F12 — TU-EXP-11 (CSV header filter lines) PRESENT → lifted to READY.** The exported CSV carries the
same leading filter-summary lines as the PDF header: `Date Range: …`, `Locations: …`, and — when the
technician filter is narrowed — `Technicians: …` (verified on the Admin-deselected subset export). Was
deferred; feature is present → `AUTOMATION: READY` + build-check.

**§F13 — TU-EXP-09 (SV-8818, OPEN) → HOLD.** The case tests the **over-cap export refusal** (S7-R14, the
"This report is too large to export…" message), which needs a filtered set exceeding the row cap
(thousands of rows) — **not seedable on this environment** (37 technicians). Separately, the SV-8818
symptom the case's note describes ("the PDF download fails with a server error on a medium view") **does
NOT reproduce for TU**: every TU PDF export returned **HTTP 200 with a valid PDF**, including the
this_year Expanded PDF (127 KB, 37 technicians × per-day). So the marker was moved EXPECT-FAIL(SV-8818) →
**HOLD** (over-cap unseedable), and the SV-8818 symptom block was stripped. **Recommendation:** TU's PDF
export is healthy; SV-8818 (a PV/report-suite PDF-failure ticket) should not be treated as reproducing
for TU. Over-cap is a data-state block, seedable on a later pass.

## Honest coverage limits (N-of-M)
- **59 of 61** cases had their specific assertion driven live this pass. **Not driven:** TU-LOC-05
  (needs a one-location-user sign-in) and TU-NAV-07 (Automated; needs a no-reports-access user sign-in) —
  both require a **second, non-admin sign-in**, deliberately not used (one shared session; quick-login /
  switch-user never called — shared-session safety).
- **6 plain-READY cases** (TU-ELL-02, TU-EXP-06, TU-LOC-02, TU-LOC-03, TU-SORT-03, TU-TECH-04) keep their
  prior build stamp — their specific assertion (ELL bold styling, PDF logo state, location-pooling reload,
  defensive restore of a bad saved location, reload-resets-sort, cross-session persistence) was not
  individually driven this pass. They are runnable; simply not re-stamped, and said so honestly here.
- **5 HOLD cases** could not be exercised on this environment (no rate-less location for the em-dash ELL
  cases; open-clock and one-location-user sign-in needs). Reasons re-verified valid; markers unchanged.
- **8 Automated cases** verified live but NOT written (Rule 71) — see TU-HELD-AUTOMATED.md.

## Environment
Nothing seeded. Reads and exports only; the technician/location filters were toggled in-session and the
report reloads them from the server (no persisted change written). No role changed. Default location
Staging Heavy Duty - 9919 throughout. **0 Jira issues.** Run 359 untouched.
