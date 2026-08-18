# DEFERRED-RUN — Sales By Customer cases not build-verifiable (feature absent)

**Build under test:** v3.8-2bf8d14 (2026-08-18).

## EMPTY — 0 Sales By Customer cases deferred.

The Sales By Customer report and ALL of its features are PRESENT on v3.8-2bf8d14 (report surface,
nav entry, date/product-type/location/customer filters, customer/asset/invoice tree, all financial
columns, sorting, the 10-column selector, all four exports, pagination, and the API). Every one of the
19 cases that previously carried "AUTOMATION: Not available on Build to test Yet" was live-verified this
pass and lifted to READY. No SBC case tests a feature that is absent from the build, so none goes to a
separate deferred build-verification run.

The 10 HOLD cases (listed in SBC-EXECUTION.md / FINDINGS.md 7) are NOT deferred for a missing feature -
they are blocked on data-state (seedable later), a destructive action, an un-forceable server error, or
an open PO question. They stay in the main run with their HOLD markers.

---

# Sales By Representative (SBR) — 2026-08-18, build v3.8-bd246fd

## 0 SBR cases deferred for an absent feature.

The Sales By Representative report and ALL of its features are PRESENT on v3.8-bd246fd (nav entry,
date/product-type/invoice-status/location filters, Show Unassigned toggle, rep/invoice tree with
expand-on-demand, all financial columns, payment-status badges, sorting, the 8-column selector, all
four exports, and the API). Every one of the 17 non-Automated cases that carried "AUTOMATION: Not
available on Build to test Yet" was live-verified this pass and lifted to READY. **No SBR case tests a
feature absent from the build.**

**One case keeps the deferred marker — but NOT for feature-absence:** C30221 (SBR-TREE-05,
expand-on-demand) is **Automated (custom_atmstatus = 3)**, so under Rule 71 it is HELD ask-first and
was not written. Its feature IS present (verified live); the intended lift to READY is recorded in
`SBR-HELD-AUTOMATED.md` for the QA lead's ratification. It does NOT go to a separate deferred
build-verification run.

---

# Parts Velocity (PV) — 2026-08-18, build v3.8-bd246fd

## 0 PV cases deferred for an absent feature.

The Parts Velocity report and ALL of its features are PRESENT on v3.8-bd246fd (nav under the new PARTS
group, This-Year default with auto-fetch, Type/Category/Vendor/Bin/Location filters + toolbar search,
inventory/special-order row model, all 20 picker columns, the full calc column set, sorting headers,
header info tooltips, the CSV export, and the API). Every one of the 9 non-Automated cases that carried
"AUTOMATION: Not available on Build to test Yet" was live-verified this pass and lifted to READY. **No PV
case tests a feature absent from the build.**

**Two cases keep the deferred marker — but NOT for feature-absence:** C30346 (PV-ROW-06, header info
icons) and C30353 (PV-COL-03, immediate column toggle) are **Automated (custom_atmstatus = 3)**, so under
Rule 71 they are HELD ask-first and were not written. Their features ARE present (verified live); the
intended lift to READY is recorded in `PV-HELD-AUTOMATED.md` for the QA lead's ratification. They do NOT
go to a separate deferred build-verification run.

**Note — a feature that is PRESENT but BROKEN, not absent:** the Parts Velocity **PDF export fails
(HTTP 500/502)** on a medium view (SV-8818, OPEN). That is a defect in a built feature, not an absent
feature, so its cases (C38885/C43547 kept EXPECT-FAIL; PDF-content cases C30379/C30381/C43834) are NOT
deferred here — see PV-FINDINGS §F5.

---

# Technician Utilization (TU) — 2026-08-18, build v3.8-bd246fd

## 4 TU cases deferred — the Total Hours LINK feature is NOT in the build.

The Technician Utilization report and nearly all of its features ARE present on v3.8-bd246fd (see
TU-EXECUTION.md). **ONE feature is not found in the build: the Total Hours link** (a real link on the
Total Hours cell that opens Timesheet Activities). The Total Hours cell carries no link/button/`role=link`
in any location scope tested — All locations and the single active shop (TU-FINDINGS §F7). The four cases
that test that link therefore could not be build-verified and stay deferred (`Not available on Build to
test Yet - Last checked 8/18/2026`, under-development line added). They are re-checked once the Total
Hours link ships (the trigger is the feature shipping, not a redeploy — Rule 49/61).

| internal | C-id | link | feature it waits on | last checked | build |
|---|---|---|---|---|---|
| TU-LINK-01 | C30428 | https://shopview.testrail.io/index.php?/cases/view/30428 | Total Hours as a real link (active-shop default view) | 8/18/2026 | v3.8-bd246fd |
| TU-LINK-03 | C30430 | https://shopview.testrail.io/index.php?/cases/view/30430 | Total Hours link ↔ Timesheet reconciliation | 8/18/2026 | v3.8-bd246fd |
| TU-LINK-05 | C30432 | https://shopview.testrail.io/index.php?/cases/view/30432 | reconciliation exception (b) — link passes no location | 8/18/2026 | v3.8-bd246fd |
| TU-LINK-06 | C30433 | https://shopview.testrail.io/index.php?/cases/view/30433 | day-row Total Hours link → single-day timesheet | 8/18/2026 | v3.8-bd246fd |

**Note — C30430 (TU-LINK-03)** previously carried `EXPECT FAIL (SV-8944)`. SV-8944 is OBSOLETE/Done (no
live backing), so the stale expect-fail was stripped; because the case's feature (the link) is absent, it
was set to the deferred marker rather than plain READY.

**NOT deferred, but LINK-related:** TU-LINK-02 (C30429) is **Automated** — HELD (TU-HELD-AUTOMATED.md),
its READY marker flagged for review since the link is absent; TU-LINK-04 (C30431) stays HOLD (needs an
open clock, and the link is absent anyway).

**Feature that is PRESENT but has open defects, NOT deferred:** the exports (Summary row omitted from
PDF/CSV, Expanded CSV holds per-day rows, wrong toast wording, Location column 2nd not leftmost) are
built-but-deviating — see TU-FINDINGS §F3/§F4/§F8/§F9; their cases were stripped to READY, not deferred.
