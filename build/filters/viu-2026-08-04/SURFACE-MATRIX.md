# Filters — SURFACE MATRIX (Standing Rule 40)

Every requirement that can touch more than one surface, with **each surface given its own verdict
observed live**. "Not applicable" is stated with its reason; silence is not a verdict.

Surfaces in scope for this feature: **desktop screen · phone screen · URL / shareable link ·
saved state (server-side, per user) · the data request (API) · the empty / zero state ·
the collapsed bar**. There is **no PDF, no CSV, no print and no email surface** in the Filters
feature — the spec defines none, and none exists in the build (verified: the Work Orders toolbar
holds only Search, Column Selection and Create Work Order).

| Requirement | Desktop screen | Phone screen | URL / link | Saved state | Data request | Empty state | Collapsed bar |
|---|---|---|---|---|---|---|---|
| **S2-R2** multi-select statuses = OR | **PASS** FLT-STAT-03 (C29562) — but the dropdown shuts on each tick, SV-8824 | **PASS** — sheet stays usable, FLT-MOB-04 | **PASS** repeated `?status=` params | **PASS** `filters.status:["invoiced"]` | **PASS** `filters[N][field]=status` | **PASS** FLT-STAT-06 | **PASS** stays applied, FLT-CHIP-04 |
| **S2-R7** Imported is exclusive | **PASS** all 4 other chips get `disabled`, FLT-STAT-07 | not applicable — Imported not reachable in the mobile sheet set observed | **PASS** `?status=imported` | not tested as saved state — Imported was cleared before each save | **PASS** — no `filters[]` sent for Imported | **PASS** "No work orders match your filters" | not applicable — chips hidden |
| **S3-R6** customer filter narrows | **PASS** FLT-CUST-05 | **PASS** chip reads `Customer (1)` | **PASS** `?company_id=<uuid>` | **PASS** in the saved payload | **PASS** `company_id` | **PASS** | **PASS** |
| **S7-R1/R2** chip active appearance | **PASS** blue pill `rgb(227,242,253)`, text `Status: Estimate, Approved` | **DIFFERENT** — the phone shows a **count**, `Status (1)`, not the value names | not applicable | not applicable | not applicable | not applicable | **PASS** the toggle icon turns blue, FLT-CHIP-04 |
| **S7-R3 / S8-R1** Clear Filters | **PASS** appears right of the chips, `clear_filters` | **FAIL — absent entirely**, SV-8846 | not applicable | **PASS** clearing writes `filters:{}` | **PASS** filters drop out of the request | **PASS** second copy, `empty_state_clear_filters` | **PASS** hidden with the bar |
| **S8-R3/R4/R5** empty state | **PASS** for filters · **FAIL** when only a query is active, SV-8847 | **PASS** same message | **PASS** reachable by link | not applicable | **PASS** HTTP 200 with 0 rows | **the surface itself** | **PASS** |
| **S10-R1/R2** persistence | **PASS** survives navigate-away, reload **and a brand-new browser** | **PASS** same saved state | **PASS** URL rewritten from saved state | **PASS** `PUT/GET /api/users/me/preferences/work-orders-list` | not applicable | not applicable | **PASS** `collapsed` is saved |
| **S10-R5 / S13-R25 / S13-N4** the query is NEVER saved | **FAIL** — the query is written to the account, SV-8844 | **FAIL** same saved state | **FAIL** restored into the URL on a later visit | **FAIL** `"search":"…"` sits in the saved payload | **PASS** `search=` is sent, which is correct | **FAIL** a restored query gives a stale empty list | not applicable |
| **S11-R1/R2** URL round trip | **PASS** desktop | **FAIL** chips show the filter, the request sends a different one, SV-8845 | **the surface itself** | **PASS** a link never overwrites saved state (S11-R6) | **PASS** desktop · **FAIL** phone | **PASS** | **PASS** |
| **S11-R3 / S11-N1** bad or dead values | **FAIL** the value is forwarded, SV-8832 | **FAIL** same | **FAIL** the surface itself | **PASS** not written back | **PASS** no 5xx — 400 on a bad field name, 200 with 0 rows on a bad value | **PASS** shows the empty state | not applicable |
| **S12-R1** chips scroll horizontally | not applicable | **PASS** `.mobile-filter-chip-row`, scrollWidth 878 > clientWidth 370 | not applicable | not applicable | not applicable | not applicable | not applicable |
| **S12-R6** deferred apply on mobile | not applicable | **HELD** — the single sheet applies instantly with no Apply button; the combined All Filters sheet has `Apply Filters`. SV-8825 | not applicable | not applicable | **HELD** — the request fires on the tick | not applicable | not applicable |
| **S13-R7/R10/R13/R14** the query | **PASS** applies as you type, additive with filters, X-circle clears it, survives navigation | **PASS** behaves the same; the control lives in the top header, not the action row | **PASS** `?search=` | **FAIL** see S13-R25 above | **PASS** `search=<q>` | **PASS** 0 rows | **PASS** stays applied while collapsed, FLT-PSRCH-13 |
| **S13-R22** every table has a search control | **PASS** Work Orders and every Parts view · **FAIL** no report tab has one | **PASS** Work Orders | not applicable | not applicable | not applicable | not applicable | not applicable |
| **S1-R4…R7 / S7-R4/R5** collapse | **PARTIAL** — collapses and the icon turns blue, but the table does not reclaim space, SV-8843 | not applicable — no toggle on mobile, correct per S12-R4 | not applicable — collapse is not in the URL | **PASS** `collapsed` is saved and survives navigation | **PASS** filters stay in the request | **PASS** | **the surface itself** |
