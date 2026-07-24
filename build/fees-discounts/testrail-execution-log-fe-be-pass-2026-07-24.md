# Fees & Discounts — TestRail execution log: FE-block/BE-allow PASS flip (2026-07-24)

**Authorization:** User-authorized 2026-07-24 (global ruling: front-end blocks +
back-end/API allows = a PASSED test case — Standing Rule 24).

**Scope:** flip 2 cases from VIU-Deviation → VIU-Verified (PASS), add the required
plain tester line to each case's Expected, push via `update_case`, re-GET verify.

**Guardrails honoured:** read-only GET on C28436 first (HTTP 200) before any write;
only `custom_expected` sent (refs + title + all other fields left intact — verified
unchanged on re-GET); **NO writes to any test run**; no add_case / delete_case /
add_section. Creds from `/tmp/tr-creds.env` (never committed).

## Tester line added to Expected (both cases, Rule 7 layman)
> "Note for the tester: this action is only hidden/blocked on the screen for this
> role. If you find it can still be done another way (for example through the
> system's back-end/API), that is expected — mark this test as PASSED and do NOT
> raise it as a bug."

The technical "which API / why" detail (POST /api/work-orders/adjustments/add
returns 201 for a role lacking Work Orders: Create & Edit; FE-only enforcement
accepted by product policy) is kept in each case's `notes` metadata only.

## Cases

| Internal ID | TestRail | Case link | Before status | After status | Action | HTTP | re-GET MATCH |
|---|---|---|---|---|---|---|---|
| FD-WO-013 | C28436 | https://shopview.testrail.io/index.php?/cases/view/28436 | VIU-Deviation | VIU-Verified (PASS) | update_case (custom_expected: added tester line as item 3) | 200 | YES |
| FD-PERM-002 | C28586 | https://shopview.testrail.io/index.php?/cases/view/28586 | VIU-Deviation | VIU-Verified (PASS) | update_case (custom_expected: added tester line as item 4) | 200 | YES |

**refs after write (unchanged):**
- C28436: `S1-N2 / S13-R3 / S13-N2 | SV-8479 (SV-8288 Story 12 — item 10)`
- C28586: `SV-8289 (S13-R3)`

## Result
- 2 update_case, both HTTP 200, both re-GET MATCH on `custom_expected`.
- Run 325 untouched; no add/delete/section; no secrets committed.

## Tally after this pass
**199 active authored = 167 VIU-Verified / 10 VIU-Deviation / 21 VIU-Blocked-Env /
1 VIU-Pending** (+2 dev-authored Verified = 201 in id-map).
Change vs §0.0o (165/12/21/1): +2 Verified, −2 Deviation.
Reconciles across all regenerated deliverables (Blockers Tracker, FreshVIU workbook,
V1 TestCases workbook, TestRail import) and PROJECT-STATE.md §0.0p.
