# SV-9194 — Labor Rate dropdown does not display all configured labor rates — QA PASS

**Date:** 2026-08-27
**Branch:** https://sv9194.qa.shopview.com  (API https://sv9194api.qa.shopview.com)
**Build:** app-version `v26.35.3-9ccdc12`, index.html etag `b1ad2217b3cf29ac7760d87cb5cf9035`
**Verdict:** PASS — per QA lead's manual UI test and this independent live re-check.

## The ticket
The Work Order Labor Rate dropdown only loaded ~the first 100 labor rates, so an account
with 200+ (client: Frame and Spring) could not reach the rest. Fix asked for: make all
configured rates accessible (pagination / infinite scroll / search).

## Setup
Seeded the org to **exactly 300 labor rates** via API (`POST /api/labour-types/create`):
267 `ZZAUTOTEST WO Rate 034..308` + 1 probe + 32 pre-existing = 300.

## What was tested (live, HD-9919 workplace, WO S9194-15.. bd07ed0b)
1. **Dropdown reaches the highest rates** — opened Work Order > New Line > **Labor Rate**;
   the list scrolls all the way to `ZZAUTOTEST WO Rate 303..308`. Not capped at ~100.
   Evidence: `evidence/EX-A-dropdown-reaches-all-annotated.png`.
2. **Search finds a rate far past #100** — typed `ZZAUTOTEST WO Rate 308` in the Labor Rate
   box; it is found and selectable. Evidence: `evidence/EX-B-search-finds-308-annotated.png`.

## Fix mechanism (technical)
The dropdown now calls **`GET /api/labour-type-options?pagination[rowsPerPage]=1000`**, which
returned **302** options (all 300 labor rates + `Fixed Labor Total` / `Fixed Line Total`).
The old capped endpoint `GET /api/labour-types` still returns only **100** and ignores
`page`/`offset`/`limit`/`rowsPerPage` — but the WO dropdown no longer depends on it.

## Per-ticket QA branch (Standing Rule 62)
Verdict is PASS, so the branch is treated as final — findings are not provisional.
