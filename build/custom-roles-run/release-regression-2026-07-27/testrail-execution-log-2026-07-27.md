# TestRail execution log — Custom Roles release-regression push (2026-07-27)

**Authorization:** user-authorized 2026-07-27 (explicit one-day push authorization).
**Scope:** 3 `add_case` only. No `update_case`, no `delete_case`, no section changes, no run writes.
**Project 1 / suite 1 "Master".** Read-only pre-check: `GET /api/v2/get_case/26416` = HTTP 200 (access confirmed).
**Run 312 (Custom Roles execution run): NOT TOUCHED.**

## add_case results (3)

| internal_id | Driving ticket | New Case | Section | HTTP | re-GET MATCH |
|---|---|---|---|---|---|
| CR-REG-01 | SV-8682 | C38843 | 3538 Parts Department Permissions | 200 | YES |
| CR-REG-02 | SV-8701 | C38844 | 3537 Customer Management Permissions | 200 | YES* |
| CR-REG-03 | SV-8541 | C38845 | 3535 Work Order Lines Permissions | 200 | YES |

Links:
- CR-REG-01 C38843 — https://shopview.testrail.io/index.php?/cases/view/38843
- CR-REG-02 C38844 — https://shopview.testrail.io/index.php?/cases/view/38844
- CR-REG-03 C38845 — https://shopview.testrail.io/index.php?/cases/view/38845

*CR-REG-02 (C38844): title / preconds / steps / expected re-GET byte-identical. The `refs`
field was cosmetically normalized by TestRail — it trimmed the space after the comma inside
the parenthetical ("...gate, S13-R9..." → "...gate,S13-R9...") because TestRail treats `refs`
as a comma-delimited field. Both the Jira ticket key **SV-8701** and the spec anchor **S13-R9**
are fully preserved (Rule 20 satisfied: ticket + spec anchor both present). No content lost;
not re-pushed (add-only scope).

## Field mapping (each add_case)
- `title`, `custom_preconds`, `custom_steps`, `custom_expected` — from the gap-case JSON body
  (tester-facing fields are UI-only; HTTP/403/200 detail kept only in the local `evidence`
  metadata field, NOT pushed → Rule 4 does not force an API section).
- `refs` — full Rule-20 string (ticket key + spec anchor), from the JSON body.
- `custom_atmstatus: 3`, `custom_automation_type: 0` (required for add_case).

## Section placement rationale (Rule 4)
All three cases have UI-only tester-facing steps, so all land in their functional
Custom-Roles subsections (children of 3527 "Custom Roles - (Revised)"), none in an API section:
- CR-REG-01 → 3538 (sibling of the verified vendor-visibility case C26416, same section).
- CR-REG-02 → 3537 Customer Management Permissions.
- CR-REG-03 → 3535 Work Order Lines Permissions.

## Local convention
Gap-case JSON files annotated with `testrail_case_id` / section / link / `pushed` flag.
Small id-map written: `gap-cases/testrail-id-map.csv`.

## Title-shorten pass (2026-07-27, user-authorized) — 3 `update_case`, title field ONLY

TestRail truncated the long titles on the case page ("..."). Shortened to concise,
build-accurate, meaning-preserving titles (≤80 chars); full detail stays in
Steps/Expected/Preconditions. Read-only pre-check `GET /api/v2/get_case/38843` = HTTP 200.
Only the `title` field changed; `custom_steps` / `custom_expected` / `custom_preconds` /
`refs` re-GET byte-identical (verified). No run touched, no add/delete/section.

| Case | Ticket | Before (chars) → After (chars) | HTTP | re-GET MATCH (title + others untouched) |
|---|---|---|---|---|
| C38843 | SV-8682 | "Vendors page opens for a Vendor & Order Management (View) + See Financial Data role even when Reports is turned OFF" (114) → "Vendors page opens without the Reports permission" (49) | 200 | YES |
| C38844 | SV-8701 | "Customer detail page opens (no Access restricted) for a Customer Create & Edit + See Financial Data + Manage AP/AR role when Fees & Discounts is ON" (144) → "Customer detail page loads for AP/AR role (Fees & Discounts on)" (63) | 200 | YES |
| C38845 | SV-8541 | "Returning a received special-order part and resolving cores (OK/Not OK) is allowed with Work Orders → View, without Work Order Line: Create & Edit" (144) → "Return part & resolve cores allowed with Work Orders: View" (58) | 200 | YES |

Local gap-case JSON titles updated to match TestRail. `testrail-id-map.csv` has no title
column (internal_id/testrail_case_id/section/refs/link only) → no change needed there.
