# Fees & Discounts — TestRail API-Section Move Audit Log

**Date:** 2026-07-08
**Operator:** Claude (automated, user-authorized WRITE)
**Environment:** LIVE TestRail — https://shopview.testrail.io (Project 1, Suite 1 "Master")
**Authorization:** User explicitly approved moving the two API-flagged Fees & Discounts
cases into API-titled sections.

## Scope / rule applied

Per project STANDING RULE #4: any test case whose preconditions, steps, or expected
results include API content (endpoints, HTTP methods, status codes, backend
request/response checks) MUST live in a TestRail section whose title includes "API".
The Fees & Discounts import generator flagged exactly two such cases; they were still
in their functional (non-API) sections in the live suite and are now moved.

## Parent-section note

Task brief referenced parent section id **3822**, but `get_section/3822` returns
`"Field :section_id is not a valid section."`. The section whose name exactly matches
the brief ("Fees & Discounts (VIU-PENDING)") is id **3894**. Matched by name and used
**3894** as the parent for the new API sections.

## Target cases (matched by TITLE; internal FD- ids are not stored in TestRail)

| Internal id | TestRail case_id | Title | Title match count |
|---|---|---|---|
| FD-CUST-017 | 28501 | Verify add/remove/load failure on customer defaults shows the standard error notification | 1 (unique) |
| FD-PROC-010 | 28528 | Verify a Processing Fee with a Max Amount or a disallowed method is rejected | 1 (unique) |

CSV-assigned API section names (from `testrail-import/fees-discounts-v1-testrail-import.csv`):
- FD-CUST-017 → `API — Customer Fees & Discounts tab — negative`
- FD-PROC-010 → `API — Processing Fee — negative`

## Actions & HTTP results

| Case (title) | case_id | Old section (id / name) | New API section (id / name) | add_section | move_cases | verify get_case |
|---|---|---|---|---|---|---|
| Verify add/remove/load failure on customer defaults shows the standard error notification | 28501 | 3913 / Customer Fees & Discounts tab — negative | 4087 / API — Customer Fees & Discounts tab — negative | HTTP 200 (created) | HTTP 200 | HTTP 200 → section_id 4087 ✓ |
| Verify a Processing Fee with a Max Amount or a disallowed method is rejected | 28528 | 3934 / Processing Fee — negative | 4088 / API — Processing Fee — negative | HTTP 200 (created) | HTTP 200 (1st attempt HTTP 000 network; retry after 2s → HTTP 200) | HTTP 200 → section_id 4088 ✓ |

Both new sections created under parent 3894 (`suite_id:1`, `parent_id:3894`), depth 1.
Neither section pre-existed (searched all 449 suite sections beforehand).

## Post-change integrity checks

- Section 4087 contains exactly 1 case: 28501. ✓
- Section 4088 contains exactly 1 case: 28528. ✓
- Total cases in Project 1 / Suite 1: **3173 before → 3173 after** (nothing created or
  deleted). ✓
- No other case was moved; only 28501 and 28528 changed section. ✓

## Endpoints used

- `GET  get_sections/1&suite_id=1` (paginated) — enumerate sections
- `GET  get_cases/1&suite_id=1` (paginated) — locate/verify cases by title
- `POST add_section/1` `{suite_id:1, parent_id:3894, name:"…"}` — create API sections
- `POST move_cases_to_section/{section_id}` `{suite_id:1, case_ids:[…]}` — move
- `GET  get_case/{id}` — verify final section_id

No secrets stored in this repo (credentials kept in /tmp only).
