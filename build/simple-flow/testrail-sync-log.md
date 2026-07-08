# Simple Flow — TestRail Sync Audit Log

Date: 2026-07-08
Operator: Claude (authorized TestRail WRITE — user said "update the cases in TestRail")
Host: https://shopview.testrail.io — Project 1 / Suite 1 ("Master")
Simple Flow parent section: **4058** ("Simple Flow (VIU-PENDING")
Local source of truth: `build/simple-flow/cases/*.json` (159 cases) rendered via `gen_import.py`

## Recon (read-only)
- Sections in project 1/suite 1: 451 (paginated).
- Simple Flow leaf sections: 4059–4086 under parent 4058.
- Simple Flow cases in TestRail before sync: **159**.
- Matched to local by TITLE: **159 / 159 (1:1)**. Unmatched local: 0. Duplicate TR titles: 0. Extra TR titles: 0.
- DECISION GATE: NOT triggered (normal state).
- Note: sections 4087/4088 ("API — Customer Fees & Discounts tab — negative", "API — Processing Fee — negative") are **Fees & Discounts** (parent 3894) — NOT touched.

## STEP 2 actions

### (a) ADD new permission cases — ALL SKIPPED (already present)
| SF ID | Title | TR case_id | Section | Action | Result |
|---|---|---|---|---|---|
| SF-PERM-08 | reviewer ≠ completer | 29412 | Permissions (4084) | SKIP — already present | n/a |
| SF-PERM-09 | Technician can't add vendorless part | 29413 | Permissions (4084) | SKIP — already present | n/a |
| SF-PERM-10 | per-role completion matrix | 29414 | Permissions (4084) | SKIP — already present | n/a |

### (b) MOVE API-flagged cases into API sections
Created sections under parent 4058:
- `add_section/1` → **4089** "API — Work Order Settings" — HTTP 200
- `add_section/1` → **4090** "API — Permissions" — HTTP 200

| SF ID | Title | TR case_id | From → To | Action | HTTP | Verified section |
|---|---|---|---|---|---|---|
| SF-SET-04 | Require Vendor Invoice Number toggle present… | 29278 | 4059 → 4089 | MOVED | 200 | 4089 OK |
| SF-SET-07 | existing settings display org values | 29281 | 4059 → 4089 | MOVED | 200 | 4089 OK |
| SF-SET-09 | saving a settings change persists | 29283 | 4059 → 4089 | MOVED | 200 | 4089 OK |
| SF-SET-11 | non-admin cannot see/modify WO settings | 29285 | 4059 → 4089 | MOVED | 200 | 4089 OK |
| SF-SET-12 | settings model has no operatingMode/requireVin | 29286 | 4059 → 4089 | MOVED | 200 | 4089 OK |
| SF-PERM-01 | only owner/admin can view/modify WO settings | 29405 | 4084 → 4090 | MOVED | 200 | 4090 OK |
| SF-PERM-06 | backend enforces settings & perm atoms | 29410 | 4084 → 4090 | MOVED | 200 | 4090 OK |

Moves via `move_cases_to_section/4089` (5 cases) and `move_cases_to_section/4090` (2 cases); both HTTP 200; each verified by `get_case` re-fetch.

### (c) UPDATE SV-8183 permission cases — ALL SKIPPED (content already identical)
Compared TR stored Preconditions/Steps/Expected/References vs local render; all 13 identical (no-op).

| SF ID | TR case_id | Action |
|---|---|---|
| SF-PERM-01 | 29405 | SKIP — identical |
| SF-PERM-02 | 29406 | SKIP — identical |
| SF-PERM-03 | 29407 | SKIP — identical |
| SF-PERM-04 | 29408 | SKIP — identical |
| SF-PERM-05 | 29409 | SKIP — identical |
| SF-PERM-06 | 29410 | SKIP — identical |
| SF-PERM-07 | 29411 | SKIP — identical |
| SF-SET-11 | 29285 | SKIP — identical |
| SF-RCV-03 | 29371 | SKIP — identical |
| SF-REV-09 | 29394 | SKIP — identical |
| SF-VPART-01 | 29331 | SKIP — identical |
| SF-VPART-02 | 29332 | SKIP — identical |
| SF-QB-06 | 29431 | SKIP — identical |

## Totals
- ADDED: 0 · MOVED: 7 · UPDATED: 0 · SKIPPED (a/c): 16 · Sections created: 2
- No F&D / Custom Roles cases touched. Nothing deleted.

## NOTE — cosmetic (non-substantive) differences found, NOT written (outside a/b/c scope)
Full 159-case comparison showed:
- **19 cases** whose TR stored value is HTML `<ol><li>…</li></ol>` while local is plain `1. …` numbering — the visible text is identical; only markup differs (these were likely last edited via the TestRail web UI). Cases: SF-SET-01,04,06,07,09,12,13; SF-COMP-01,02,04,11,18,21,23; SF-CORE-02,04,08,10; SF-TECH-01.
- **13 cases** with References differing only by comma spacing ("SV-7697,SV-7710" in TR vs "SV-7697, SV-7710" local) — from an older `gen_import` render. Cases: SF-SET-10, SF-COMP-03/04/21, SF-CORE-01, SF-TECH-08, SF-BULK-06, SF-PNFIX-04, SF-VAL-01/02/03/05/06.

These are cosmetic and were intentionally left untouched per the "do not mass-rewrite; only (a)/(b)/(c)" instruction. Flag for guidance if a normalize pass is desired.

## Case-ID map
Saved `build/simple-flow/testrail-id-map.csv` — 159 rows (columns: ID, sf_id, title, section).
