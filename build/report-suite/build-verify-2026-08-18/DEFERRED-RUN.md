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
