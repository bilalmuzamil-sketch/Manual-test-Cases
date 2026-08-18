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
