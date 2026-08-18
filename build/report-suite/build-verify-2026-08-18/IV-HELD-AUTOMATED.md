# IV-HELD-AUTOMATED — Automated IV cases HELD for ask-first ratification (2026-08-18)

**Rule 71 / skill 03 §5.4, §6.4.** These 5 Inventory Value cases carry TestRail's own
**`custom_atmstatus = 3` ("Automated")** — re-confirmed **LIVE** this pass (2026-08-18, all 5 still atm=3).
They are the contract Vladimir Tomovic's automation runs against, so they were **verified live but NOT
written.** The intended change per case is recorded for the QA lead's **ask-first** go-ahead; on approval
the edit is made **coupled with build verification** (skill 03 §6.4) and the case number handed to Vlad
(Rule 65 / register `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`).

**Who set the flag:** these are Report-Suite cases; on this project the `custom_atmstatus = 3` flag is
Vladimir Tomovic's own (not our `add_case` tooling), consistent with the SBC/SBR/PV/TU/WIP passes. They are
genuinely Automated and must not be edited without his awareness.

**Build verified against:** `v3.8-bd246fd` · Location Staging Heavy Duty - 9919 · Admin.

| Case (C-id) | internal | live marker (atm=3) | live observation | intended change (ON APPROVAL) | affects what Vlad's check concludes? |
|---|---|---|---|---|---|
| [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | IV-NAV-02 | `Not available on Build to test Yet` | one row per in-stock part at selected locations, valued at the resolved date — present (report renders rows; calc verifies) | **LIFT → `AUTOMATION: READY`** + sentence-2 | **Yes** — marker moves deferred→ready |
| [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | IV-TOT-02 | `AUTOMATION: READY` | totals row sums the FULL filtered set server-side (totals match the whole set, not the visible page) — present | refresh Rule-54 sentence-2 → `Last checked against build v3.8-bd246fd on 8/18/2026.` (body unchanged) | **No** — metadata only |
| [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | IV-DATE-03 | `Not available on Build to test Yet` | "as of" date control present, defaults to today (08/18/2026); today-not-yet-recorded → live stock | **LIFT → `AUTOMATION: READY`** + sentence-2 | **Yes** — marker moves deferred→ready |
| [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | IV-FLT-01 | `AUTOMATION: READY` | Category and Vendor multi-selects present and reload the report to matching parts | refresh sentence-2 (body unchanged) | **No** — metadata only |
| [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | IV-SORT-01 | `AUTOMATION: READY` | rows sorted by Total Cost highest-first on load (observed "Total Cost ▾") | refresh sentence-2 (body unchanged) | **No** — metadata only |

**Summary of intended changes:** 2 lifts that change the automated conclusion (C30535, C30563) + 3
metadata-only sentence-2 refreshes (C30557, C30569, C30583). **NOTHING WAS WRITTEN to any of the 5.** All
`custom_atmstatus = 3` preserved (untouched, re-confirmed live).

**Foreign Automated cases (NOT ours, Rule 38, untouched):** C43573 (IV column-persistence, Vladimir
Tomovic id 1, atm=3), C38921 (IV CSV metadata, Vladimir Tomovic id 1, atm=3).
