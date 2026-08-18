# TU — AUTOMATED CASES HELD (ask-first, Rule 71) — 2026-08-18, build v3.8-bd246fd

Per this pass's instruction and Standing Rule 71, any TU case TestRail flags **Automated
(`custom_atmstatus = 3`)** was **verified LIVE but NOT written to**. Below are the 8 Automated TU cases
with their C-id, current marker, the change this pass WOULD have made, and the live verdict — for the QA
lead's ask-first ratification. **`custom_atmstatus = 3` confirmed LIVE per case this pass.** All 8 are
`created_by = 3` (ours) but Automated-flagged. **NOT edited, markers untouched, not re-stamped**
(byte-unchanged; not passed to the writer, which additionally refuses `atm==3`).

| C-id | internal | current marker | live verdict on v3.8-bd246fd | intended change (NOT applied) | affects automation? |
|---|---|---|---|---|---|
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | TU-NAV-07 | `AUTOMATION: HOLD - needs a second sign-in as a user without reports access…` | Positive branch not testable without a **no-reports-access** user sign-in (one shared session; quick-login/switch-user not called). HOLD reason valid. | None — HOLD stands. | No. |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | TU-NAV-08 | `AUTOMATION: READY` | **VERIFIED** — clearing all technicians yields the standard no-data message **"Empty bays, endless possibilities. Get Going!"**. Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | TU-HRS-02 | `AUTOMATION: READY` | **VERIFIED** — headers in fixed order; Total Hours / WO Hours / Internal Hours all present and right-aligned two-decimal. Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | TU-ELL-01 | `AUTOMATION: READY` | **VERIFIED** — Est. Lost Labor = internal hours × the location's default labor rate ($125/hr; e.g. 185.31 h → $23,163.75). Calc ties out live. Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | TU-SORT-02 | `AUTOMATION: READY` | **VERIFIED** — every sortable column sorts on screen ascending-first, second click toggles descending (Total Hours 0.00→23.23 then reverse); Summary row stays pinned. Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | TU-TECH-02 | `AUTOMATION: READY - EXPECT FAIL (SV-8946)` | Deselecting a technician **hides the row and recalculates the Summary** (33.73 → 10.50 when Admin deselected) — VERIFIED. **SV-8946 is OBSOLETE/Done** (no live backing). | **Strip stale expect-fail → `AUTOMATION: READY`** + sentence-2 build-check (Rule 61 §15.1). HELD, not applied. | **Yes** — removing the expect-fail changes what an automated run concludes. |
| [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | TU-LINK-02 | `AUTOMATION: READY` | ⚠️ **The Total Hours link feature is ABSENT** (no link/button in the Total Hours cell in any scope tested — TU-FINDINGS §F7), so "the Total Hours link opens Timesheet Activities" cannot be verified. Its READY marker is questionable. | **NEEDS REVIEW — do NOT auto-keep READY.** If the link is genuinely not built, this should carry `Not available on Build to test Yet`, matching TU-LINK-01/05/06. Recorded for the QA lead + Vlad. | **Yes** — the case asserts a feature that is not in the build. |
| [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | TU-API-01 | `AUTOMATION: READY` | **VERIFIED** — a technician's per-day breakdown appears only after the row is expanded (the day rows are not present until expand). Consistent with fetch-on-expand. Runnable. | Optional: sentence-2 build-check. Marker stays READY. | No — metadata only. |

**Recommendation for the QA lead:**
- **Ratify stripping C30424 → `AUTOMATION: READY`** (SV-8946 OBSOLETE; the deselect/recalc behaviour is
  correct live).
- **C30429 (TU-LINK-02):** review — the Total Hours link is not in the build (§F7); this Automated case
  currently asserts the link works. It likely should be `Not available on Build to test Yet` alongside
  the other TU-LINK cases, OR the link genuinely ships in a scope this environment cannot reach. Confirm
  before letting an automated run treat it as READY.
- The other six (C30398 HOLD-valid, C30399, C30401, C30404, C30410, C30449) are correct as marked; only a
  metadata build-check stamp was withheld.

If ratified, apply each edit **coupled with the live verification recorded here** (skill-03 §6.4) and hand
the case numbers to Vladimir Tomovic (id 1) via
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.
