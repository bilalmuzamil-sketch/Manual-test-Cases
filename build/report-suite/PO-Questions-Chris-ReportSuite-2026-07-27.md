# Report Suite — Questions for Chris Ward — 2026-07-27

Plain-language product questions only (no bugs, no test jargon).
Please pick an option (or write your own answer) for each.

## Question 1 — The "deactivate a sales rep" pop-up: how it closes

**What happens now:** On the Sales By Representative report, when someone turns off a sales rep who still has customers assigned to them, a warning pop-up appears (it asks you to type "YES" to confirm). The written description says this pop-up should also close if you press the "Esc" key on the keyboard. But the app has a general house rule that pop-ups do NOT close with the "Esc" key. So the two say different things, and we don't know which one the finished app should follow.

**The question:** For this "deactivate a sales rep" pop-up, should pressing the "Esc" key close it, or not?

**Options:**

- A) Yes - pressing "Esc" should close the pop-up (matches the written description).
- B) No - pressing "Esc" should NOT close it (matches the app's general house rule); use only the Cancel and X buttons.

**Your answer:** ____________________

## Question 2 — Each report uses a different permission to view it

**What happens now:** These reports do not all use the same "who is allowed to see this" setting. The Sales By Customer report has its OWN dedicated permission. The Parts Velocity report and the Inventory Value report both reuse the existing inventory-reports permission. The Sales By Representative report is opened by anyone who can already see the other performance reports. We want to make sure this mix is on purpose before we lock in our tests for who can and cannot open each report.

**The question:** Is it intended that each report is controlled this way (some have their own permission, some share an existing one), rather than all six using one single "Reports" permission?

**Options:**

- A) Yes - this mix is intended; keep it as described.
- B) No - it should work differently (please tell us how).

**Your answer:** ____________________

## Question 3 — Are there any pictures or videos to check the reports against?

**What happens now:** We wrote all of these report tests from the written descriptions only. There are no design pictures anywhere for these reports. Two of the written descriptions (Technician Utilization and Inventory Value) mention a "companion video" as a visual reference, but that video was never shared with us, so we cannot check the look-and-feel against it.

**The question:** Are there any design pictures, mock-ups, or videos for these reports that we should test the screens against - including the "companion video" mentioned for the Technician Utilization and Inventory Value reports?

**Options:**

- A) No - there are no pictures or videos; test from the written descriptions only.
- B) Yes - designs or a video exist and can be shared (please send them so we can check the screens).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are from `build/report-suite/testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

| Q# | Affected internal case IDs (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | SBR-DEACT-04 (C30255) — currently asserts Escape dismisses the dialog; SBR-DEACT-01..09 (C30252–C30260); SBR-API-06 (C30321) | Spec S13-R8 (Esc-to-dismiss) conflicts with Golden Rule #9 (no Esc). Jira SBR Story 13 = SV-8630; engineering story SV-8599 (B6) flags this as an OPEN decision. Our SBR-DEACT-04 was authored to the spec (Escape dismisses). | A -> keep SBR-DEACT-04 as written (Escape dismisses). B -> reword SBR-DEACT-04 so Escape does NOT dismiss; VIU-confirm the shipped dismiss behaviour before finalizing. |
| 2 | SBC-PERM-01/02 (C30098/C30099); SBR-PERM-01/02 (C30198/C30199); PV-PERM-01/03 (C30325/C30327); TU-NAV-01/07 (C30392/C30397); WIP-PERM-01/02 (C30526/C30527); IV-PERM-01/02 (C30603/C30604) | OQ-5 permission-model inconsistency. Engineering confirms as-designed: SBC = dedicated atom ROLE_SALES_BY_CUSTOMER_REPORT::VIEW (SV-8598/B5); PV = Inventory Reports→View (SV-8596/B3); IV = ROLE_REPORT_VIEW (SV-8597/B4); SBR rides the Performance group (SV-8599/B6); TU reuses timesheet-reports. Chris confirmation still pending. | A -> permission cases stand as authored; VIU-confirm the exact permission names per report at the build. B -> revise the permission cases per Chris's correction. |
| 3 | All Visual Conformance cases: SBC-VIS-01..03 (C30185–C30187), SBR-VIS-01..05 (C30305–C30309), PV-VIS-01..03 (C30385–C30387), TU-VIS-01/02 (C30447/C30448), WIP-VIS-01..07 (C30519–C30525), IV-VIS-01..07 (C30596–C30602) | OQ-3 designs/videos. 0 attachments across epic SV-8582 + all 97 child stories — no Figma, no video in Jira. TU Story 8 note and IV Story 12 note both reference a "companion video" that was removed from the doc header / never provided (minor spec self-inconsistency). | A -> visual cases stay spec-only, confirmed LIVE at VIU. B -> ingest the designs/video and run a design-reconciliation pass before/with VIU. |

### Already resolved — NOT asked here (for QA reference)

- **Inventory Value export cap = 10,000 rows** — engineering treats 10,000 as the single suite-wide constant (story SV-8591 / A3). The spec's "confirm the exact value with the owner" (IV S10-R12) is now just a wording rubber-stamp, not an open decision. Case IV-EXP-07 (C30593) carries "exact cap value pending owner confirmation" and can be finalized to 10,000. NOT a Chris question.
- **Epic key = SV-8582** (one epic for the whole suite) — OQ-1 RESOLVED.
- **Build-deltas ("spec ahead of code")** — OQ-6: confirmed real and expected (SBR single-rep schema; PV reversal netting + precision; TU per-location/single-rate lost labor). Track as expected deviations at VIU, not new PO questions.
- **QA env / branch / feature-flag state** — needed to run VIU (branch `project/reports-suite-bravo`), but this is an environment/access need from the user/dev, NOT a Chris product decision, so it is not in this sheet.
