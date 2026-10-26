# A/R and A/P Report Sorting, Export and Location Filter — suite report (22 Oct 2026; full pass against PRD version 9, 26 Oct 2026)

## What I did

- 26 Oct 2026: full pass (QA lead's choice) against PRD version 9 (23 Oct 2026) and Chris Ward's answers 1 to 16: every case checked, verdict and per-part record in `v9-pass-2026-10-26/PASS-REPORT.md`. Drafted only: nothing written to TestRail, Jira, Slack or Google in that pass.
- Drafted the whole suite as authoring files: **356 cases** in 12 sections, every one in the Rule 117 shape (all twelve amendments). `python3 authoring/build.py` passes with **0 PROBLEM lines**; it wrote `authoring/proposals.json` (one entry per case: section, title, refs, the three HTML fields).
- Nothing was written to TestRail, Jira, Slack or Google, and nothing was committed.
- Saved PRD v5 (Confluence 947650561, 21 Oct 2026, Chris Ward) and checked the saved copy word for word against the page's HTML (352 text blocks, 0 missing apart from the epic link's display form).
- Read every ticket under the epic (25) and listed every sentence that differs from the PRD.

## Cases per section

| Section | TestRail section | Cases |
|---|---|---|
| Story 1 | 90419 | 16 |
| Story 2 | 90420 | 52 |
| Story 3 | 90421 | 34 |
| Story 4 | 90422 | 28 |
| Story 5 | 90423 | 43 |
| Story 6 | 90424 | 5 |
| Story 7 | 90425 | 21 |
| Story 8 | 90426 | 14 |
| Story 9 | 90427 | 4 |
| Totals and counts — exact amounts | 90428 | 27 |
| Release day and what must not change | 90429 | 18 |
| Design — how it looks | 90430 | 94 |
| **Total** | group 90418 | **356** |

## Automation markers (read back from the cases)

| Marker | Cases |
|---|---|
| `AUTOMATION: HOLD - not yet build-verified (no build yet)` | 342 |
| `AUTOMATION: HOLD - needs records and screenshots captured before the release is installed on the test site` | 13 |
| `AUTOMATION: HOLD - needs more rows than any test site holds; the developers check this limit in their own check tasks (SV-11595, SV-11598)` | 1 |

Every case is HOLD today because no build exists (Rule 85: source-verified only). READY + EXPECT-FAIL = 0 = total − HOLD.

## What is held, and why

| Case | Title | Why held |
|---|---|---|
| DATA-19 | A/R Summary: a PDF of exactly 2,000 customers downloads, 2,001 is refused | needs more rows than any test site holds; the developers check this limit in their own check tasks (SV-11595, SV-11598) |
| REL-01 | On release day an untouched A/R report shows the same rows and amounts | needs records and screenshots captured before the release is installed on the test site |
| REL-02 | On release day an untouched A/P report shows the same rows and amounts | needs records and screenshots captured before the release is installed on the test site |
| REL-05 | Inventory Value link, PDF and CSV work as before the release | needs records and screenshots captured before the release is installed on the test site |
| REL-05b | Sales By Customer link, PDF and CSV work as before the release | needs records and screenshots captured before the release is installed on the test site |
| REL-05c | Work In Progress link, PDF and CSV work as before the release | needs records and screenshots captured before the release is installed on the test site |
| REL-06 | Other reports keep their own export error message | needs records and screenshots captured before the release is installed on the test site |
| REL-08 | A credit dated on the as-of date stays in the same bucket as before | needs records and screenshots captured before the release is installed on the test site |
| REL-10 | The location switcher in the top right is unchanged | needs records and screenshots captured before the release is installed on the test site |
| REL-11 | A drill-down link saved before the release still opens on its customer | needs records and screenshots captured before the release is installed on the test site |
| REL-12 | Sales By Customer keeps or forgets its filter between visits as before | needs records and screenshots captured before the release is installed on the test site |
| REL-12b | Inventory Value keeps or forgets its filter between visits as before | needs records and screenshots captured before the release is installed on the test site |
| REL-12c | Work In Progress keeps or forgets its filter between visits as before | needs records and screenshots captured before the release is installed on the test site |
| REL-13 | Sales By Customer's filter menus behave as before the release | needs records and screenshots captured before the release is installed on the test site |

## PRD version 9 coverage — every requirement code

| Code | Cases | Reports covered |
|---|---|---|
| S1-R1 | S1-01, S1-02, S1-03, S1-04, S1-15, D-50, D-54 | A/R Summary, A/P Summary |
| S1-R2 | S1-01, S1-02, S1-05, S1-06, S1-16, D-50 | A/R Summary, A/P Summary |
| S1-R3 | S1-03, S1-04, S1-07 | A/R Summary, A/P Summary |
| S1-R4 | S1-05, S1-06, S1-07 | A/R Summary, A/P Summary |
| S1-R5 | S1-08, S1-09, DATA-14, DATA-15, D-52, D-63 | A/R Summary, A/R Detail, A/P Summary, A/P Detail |
| S1-R6 | S1-10, S1-11, S2-12, S2-19b, S2-20 | A/R Collection, A/P Unpaid Invoices |
| S1-R7 | S1-01, S1-02, S1-08, S1-09, S1-10, S1-11, S1-12, S1-13, S2-36, S2-36b, S2-37, S2-37b, S2-38, S2-38b, D-50, D-51, D-52, D-56 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S1-R8 | S2-29, S2-31, S2-32, S2-34, S4-05, S4-06, S4-07, S4-08, S4-13, S4-14, DATA-01, DATA-01b, DATA-02, DATA-02b, DATA-03, DATA-03b, DATA-04, DATA-04b, DATA-05, DATA-06 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S1-N1 | S1-14, REL-04 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S1-E1 | S1-15, D-74 | A/R Summary |
| S2-R1 | S2-01, S2-01b, S2-02, S2-03, S2-04, S2-04b, S2-05, S2-06, S2-07, S2-07b, S2-08, S2-09, S2-10, S2-11, S2-12, S2-12b, S2-13, S2-14, S2-15, S2-15b, S2-16, S2-17, S2-18, S2-19, S2-19b, S2-20, S2-20b, S2-21, S2-22, S2-40, S2-41, S2-42, D-01, D-04, D-07, D-10, D-13, D-16, D-52, D-56, D-61, D-63, D-81 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S2-R2 | S2-01, S2-01b, S2-02, S2-03, S2-04, S2-04b, S2-05, S2-06, S2-07, S2-07b, S2-08, S2-09, S2-10, S2-11, S2-12, S2-12b, S2-13, S2-14, S2-15, S2-15b, S2-16, S2-17, S2-18, S2-19, S2-20, S2-20b, S2-21, S2-22, S2-23, S2-29, S2-30, S2-31, S2-32, S2-33, S2-34, D-51, D-69 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S2-R3 | S2-01, S2-04, S2-07b, S2-12, S2-15b, S2-20, D-51 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S2-R4 | S1-08, S1-09, S1-10, S1-11, S2-10, S2-14, S2-18, S2-22, S2-39 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S2-R4a | S2-40, S2-41, S2-42, S3-20, S3-21, S3-22, S3-23, D-01, D-04, D-07, D-10, D-13, D-16, D-81 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S2-R5 | S2-07, S2-07b, S2-08, S2-09, S2-11, S2-12, S2-12b, S2-13, S2-15, S2-15b, S2-16, S2-17, S2-19, S2-20, S2-20b, S2-21, S2-25, S2-26, S2-27, S2-28 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S2-R6 | S2-23, S2-24, D-58 | A/P Detail, A/P Unpaid Invoices |
| S2-R7 | S2-29, S2-30, S2-31, S2-32, S2-33, S2-34, S2-35 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S2-R8 | S2-36, S2-36b, S2-37, S2-37b, S2-38, S2-38b | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S2-R9 | S2-25, S2-26, S2-27, S2-28 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S2-N1 | S2-19b, D-62 | A/P Unpaid Invoices |
| S2-E1 | S2-39 | A/R Collection |
| S3-R1 | S3-01, S3-01b, S3-01c, S3-02, S3-02b, S3-02c, D-35, D-36, D-53, D-54 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R2 | S1-05, S1-06, S3-03, S3-04, S3-05, S3-06, S3-07, S3-08 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R3 | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-28, S3-29, S3-30, S8-07, S8-07b, DATA-01b, DATA-02b, DATA-03b, DATA-04b, REL-03 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R4 | S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, REL-03, D-46 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R5 | S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16, S3-17, D-46 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R6 | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-09, S3-10, S3-11, S3-12, S3-13, S3-14 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R7 | S3-18, S3-19, D-44, D-45 | A/R Summary, A/P Summary |
| S3-R8 | S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16, S3-18, S3-19, S3-20, S3-21, S3-22, S3-23 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R8a | S9-03, S9-04 | A/R Collection |
| S3-R8b | S2-40, S2-41, S2-42, S3-18, S3-19, S3-20, S3-21, S3-22, S3-23 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-R9 | DATA-18, DATA-19, DATA-20 | A/R Summary, A/P Detail |
| S3-R10 | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-24, S3-25, S3-28, S3-29, DATA-20, D-37 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S3-N1 | DATA-18, DATA-19, DATA-20, D-38, D-55 | A/R Summary, A/P Detail |
| S3-N2 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |  |
| S3-N3 | DATA-18, DATA-19, DATA-20, D-55 | A/R Summary, A/P Detail |
| S4-R1 | S4-01, S4-02, S4-03, S4-04, S4-05, S4-06, D-25, D-26, D-27, D-28, D-52, D-56, D-59 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-R2 | S4-05, S4-06 | A/R Collection, A/P Unpaid Invoices |
| S4-R3 | S4-01, S4-02, S4-03, S4-04 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-R4 | S4-07, S4-08, DATA-05, DATA-06 | A/R Detail, A/P Detail |
| S4-R5 | S4-01, S4-02, S4-03, S4-04, D-25, D-26, D-27, D-28, D-52, D-56, D-59 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-R6 | S4-09, S4-10, S4-11, S4-12, D-25, D-26, D-27, D-28, D-57, D-58, D-61 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-R7 | S4-09b, S4-10b, S4-11b, S4-12b, D-47, D-48 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-R8 | S2-25, S2-26, S2-27, S2-28, S4-13, S4-14, DATA-05, DATA-06 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-R9 | S4-15, S4-15b, S4-16, S4-16b | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-N1 | S2-35, S4-17, S4-18, S4-19, S4-20 | A/R Detail, A/R Collection, A/P Detail, A/P Unpaid Invoices |
| S4-N2 | S4-21, S4-21b | A/R Summary, A/P Summary |
| S5-R1 | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-37, D-50, D-52, D-54, D-65 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R2 | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08, S5-09, D-29, D-30, D-66, D-67 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R3 | S5-10, S5-10b, S5-10c, S5-11, S5-11b, S5-11c | A/R Collection, A/P Unpaid Invoices |
| S5-R4 | S5-12, D-65, D-66 | A/R Detail |
| S5-R5 | S5-07, S5-08, REL-01, REL-02, D-65, D-66 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R6 | S3-17, S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08, S5-13, D-67, D-68 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R6a | S3-24, S5-14, S6-03, D-68 | A/R Summary, A/R Detail, A/R Collection, A/P Detail |
| S5-R7 | S5-15, S5-16, S5-17, DATA-09, DATA-10, DATA-11, DATA-12, DATA-14, DATA-15 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R8 | DATA-07, DATA-08 | A/R Summary, A/P Summary |
| S5-R9 | S5-18, D-68 | A/R Detail, A/R Collection |
| S5-R10 | S5-14, S5-19, S5-20, S5-23 | A/R Summary, A/R Collection, A/P Summary, A/P Detail |
| S5-R10a | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-25 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R11 | S5-26, S5-27, D-70 | A/R Summary, A/R Collection, A/P Summary, A/P Unpaid Invoices |
| S5-R12 | S5-10, S5-11, S7-11 | A/R Detail, A/R Collection, A/P Unpaid Invoices |
| S5-R13 | S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-28, S5-29, S5-38, S5-39, DATA-20, D-02, D-05, D-08, D-11, D-14, D-17, D-31, D-32, D-50, D-70, D-73, D-74, D-75 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R14 | S5-24, S5-35, S5-36, REL-11 | A/R Collection, A/P Unpaid Invoices |
| S5-R15 | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-22, S5-30, S5-31, DATA-16, DATA-17, D-02, D-05, D-08, D-11, D-14, D-17, D-33, D-34, D-50, D-71, D-72 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R16 | S2-35, DATA-09, DATA-10, DATA-11, DATA-12, DATA-16, DATA-17, DATA-23, DATA-24 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R17 | DATA-07, DATA-08, DATA-23, DATA-24, D-72 | A/R Summary, A/R Detail, A/P Summary, A/P Detail |
| S5-R18 | S5-38, DATA-01b, DATA-02b, DATA-03b, DATA-04b, DATA-07, DATA-08, DATA-09, DATA-10, DATA-11, DATA-12, DATA-13, DATA-14, DATA-15, DATA-16, DATA-17, DATA-22, DATA-23, DATA-24, D-51, D-70, D-72, D-74, D-75 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S5-R18a | DATA-14, DATA-15, DATA-23, DATA-24 | A/R Summary, A/R Detail, A/P Summary, A/P Detail |
| S5-R18b | DATA-22 | A/R Summary |
| S5-R19 | S5-23, S5-35, S5-36 | A/R Summary, A/R Collection, A/P Unpaid Invoices |
| S5-N1 | S5-18 | A/R Collection |
| S5-N2 | S5-21 | A/R Detail |
| S5-N3 | S5-22 | A/P Unpaid Invoices |
| S5-E1 | S3-25, S5-32 | A/R Summary, A/P Unpaid Invoices |
| S5-E2 | S5-33, S5-34, REL-10 | A/R Summary, A/R Collection, A/P Detail |
| S6-R1 | S6-01, S6-02, D-65 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S6-R2 | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S5-15, S6-03, S6-04, S6-05, D-65, D-67 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S6-R3 | S6-01, S6-02, D-01, D-04, D-07, D-10, D-13, D-16, D-50, D-65 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S6-R4 | S2-01b, S2-04b, S6-04, S6-05, DATA-07, DATA-08, D-54, D-69 | A/R Summary, A/P Summary |
| S6-R5 | S2-01b, S2-04b, D-69 | A/R Summary, A/P Summary |
| S6-N1 | S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, S6-03, D-67 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S7-R1 | S7-01, S7-02, S7-06, S7-12, S7-13, S7-15, S7-16, S7-18, S7-18b, S7-19, D-62, D-63 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S7-R2 | S7-01, S7-02, S7-14 | A/R Detail, A/R Collection |
| S7-R3 | S7-03, S7-04, S7-20, D-39, D-40, D-63, D-64 | A/R Detail, A/R Collection |
| S7-R4 | S7-03, S7-04 | A/R Detail, A/R Collection |
| S7-R5 | S7-05, S7-20, D-64 | A/R Detail, A/R Collection |
| S7-R6 | S7-06, S7-07, S7-08, S7-15, S7-16, D-58, D-62 | A/P Detail, A/P Unpaid Invoices |
| S7-R7 | D-01c, D-02, D-03, D-04c, D-05, D-06, D-07c, D-08, D-09, D-10c, D-11, D-12, D-13c, D-14, D-15, D-16c, D-17, D-18, D-59, D-61 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S7-R8 | S7-09 | A/R Detail |
| S7-R9 | S7-07, S7-08, S7-17, D-58 | A/P Detail, A/P Unpaid Invoices |
| S7-R10 | S7-10, D-56, D-63 | A/R Detail, A/R Collection |
| S7-N1 | S7-11 | A/R Detail |
| S7-N2 | S7-12, S7-13, S7-14, S7-17 | A/R Detail, A/R Collection, A/P Detail |
| S7-E1 | S5-33, S5-34, REL-10 | A/R Summary, A/R Collection, A/P Detail |
| S8-R1 | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-07b, S8-13, D-41, D-42, D-59, D-60 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S8-R2 | D-01, D-03, D-04, D-06, D-07, D-09, D-10, D-12, D-13, D-15, D-16, D-18, D-50, D-59 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S8-R3 | S4-09b, S4-10b, S4-11b, S4-12b, D-01, D-01b, D-02, D-03, D-04, D-04b, D-05, D-06, D-07, D-07b, D-08, D-09, D-10, D-10b, D-11, D-12, D-13, D-13b, D-14, D-15, D-16, D-16b, D-17, D-18, D-47, D-48, D-50, D-56, D-58, D-61, D-62 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S8-R4 | D-01b, D-02, D-03, D-04b, D-05, D-06, D-07b, D-08, D-09, D-10b, D-11, D-12, D-13b, D-14, D-15, D-16b, D-17, D-18, D-50, D-61 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S8-R5 | S5-14, S5-32, S8-08, S8-09, S8-12, D-19, D-20, D-21, D-22, D-23, D-24, D-68 | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S8-R6 | S8-10, S8-11, D-19b, D-20b, D-21b, D-22b, D-23b, D-24b | A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid Invoices |
| S8-N1 | S8-07, S8-07b | A/R Summary, A/P Unpaid Invoices |
| S9-R1 | S4-10, S9-01, D-43, D-56, D-57, D-59, D-75 | A/R Collection |
| S9-R2 | S4-10, S9-01, D-43, D-56, D-59, D-75 | A/R Collection |
| S9-R3 | S9-03, D-46 | A/R Collection |
| S9-N1 | S9-02, D-43 | A/R Collection |
| S9-N2 | S9-04 | A/R Collection |

## Named PRD items without a code — every one covered

| Item | What it is | Cases |
|---|---|---|
| EH | Story 3, Error Handling: If an export fails for any other reason (a server error or a lost connection), nothing dow… | S3-26, S3-27, REL-06, D-38 |
| UFS-1 | User Feedback Summary: PDF export over 2,000 rows | "This report is too large for PDF. Export it as CSV, or narro… | DATA-18, D-38, D-55 |
| UFS-2 | User Feedback Summary: CSV export over 50,000 rows | "This report is too large to export. Choose an earlier as-of… | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| UFS-3 | User Feedback Summary: Click an invoice at another enrolled location | Title "Switch location?", message "This wo… | S7-03, S7-05, D-39, D-64 |
| UFS-4 | User Feedback Summary: Click a part sale at another enrolled location | "This part sale is in {location}. Switch … | S7-04, D-40 |
| UFS-5 | User Feedback Summary: Collapse all / Expand all button | "Collapse all" / "Expand all" | Tooltip above the butto… | S4-01, S4-02, S4-03, S4-04, D-25, D-26, D-27, D-28 |
| UFS-6 | User Feedback Summary: Export succeeds | "Success", "Data exported successfully." | Success toast, as on the othe… | S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, D-37 |
| UFS-7 | User Feedback Summary: Export with no rows | "Empty export", "Export didn't yield any results" | Warning toast; n… | S3-24, S3-25, D-37 |
| UFS-8 | User Feedback Summary: Export fails for any other reason | "We couldn't export this report. Please try again." | … | S3-26, S3-27, REL-06, D-38 |
| UFS-9 | User Feedback Summary: Filters leave no rows | "No record matches these filters", "Try changing filters to widen … | S5-14, S8-08, S8-09, D-19, D-20, D-21, D-22, D-23, D-24 |
| UFS-10 | User Feedback Summary: Report fails to load | "Something went wrong loading this report. Please try again." | In … | S8-10, S8-11, D-19b, D-20b, D-21b, D-22b, D-23b, D-24b |
| WC-1 | What changes for existing users: A/R reports no longer come out in an unpredictable order; A/R Summary and A/R Collection n… | DATA-01, DATA-03 |
| WC-2 | What changes for existing users: A/P Detail opens with rows in vendor name order inside each bucket (today: most overdue fi… | S1-09 |
| WC-3 | What changes for existing users: A/R's Print button becomes the Export menu; its PDF prints the on-screen order and the as-… | S3-01, S3-01b, S3-01c, REL-03 |
| WC-4 | What changes for existing users: The Totals row on A/R Collection and A/P Unpaid Invoices now follows the customer or vendo… | DATA-10, DATA-12 |
| WC-5 | What changes for existing users: The A/R Summary Totals row now adds up exactly the customer rows above it. Today it also c… | DATA-13 |
| WC-6 | What changes for existing users: Clicking a row no longer opens it. The document number, or the customer or vendor name on … | S5-26, S5-27, S7-01, S7-02, S7-18, S7-18b, S7-19 |
| WC-7 | What changes for existing users: The date filter is labelled "As of" (was "Date"). On A/R Collection and A/P Unpaid Invoice… | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06 |
| WC-8 | What changes for existing users: Re-sorting A/R Collection or A/P Unpaid Invoices no longer collapses the open groups. | S2-26, S2-28 |
| WC-9 | What changes for existing users: The A/R column "Location full name" and the A/P column "Location Name" are renamed "Locati… | S6-01, S6-02 |
| WC-10 | What changes for existing users: Which rows and amounts each user can see is unchanged: an untouched report shows exactly t… | REL-01, REL-02, D-50 |
| WC-11 | What changes for existing users: The A/R column headings change to Title Case, as on the A/P reports and the other reports:… | S2-40, S2-41, D-81 |
| OOS-1 | Out of Scope: Background exports for very large reports ("we'll email you when it's ready"), as Sage Int… | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| OOS-2 | Out of Scope: Restricting these reports by the user's location enrollment. The reports stay organization… | S5-10, S5-11 |
| OOS-3 | Out of Scope: Renaming columns other than Location. Only the capitals change (S2-R4a): A/R keeps "ID" an… | S6-01, S6-02, D-81 |
| OOS-4 | Out of Scope: Other improvements found in research, each a separate ticket on SV-11315: a credit dated o… | REL-08, REL-09 |
| OOS-5 | Out of Scope: Email and a primary contact on the A/R Collection call list. A customer has no primary con… | S9-01 |
| OOS-6 | Out of Scope: Links for A/R credit memos and deposits. They have no page of their own to open, so they s… | S7-10 |
| OOS-7 | Out of Scope: A/P print from a separate print button. A/P printing is delivered through the Export menu'… | S3-02, S3-02b, S3-02c, D-54 |
| OOS-8 | Out of Scope: The location switcher in the top right of ShopView. It is not changed. Switching location … | S5-33, S5-34, REL-10 |
| OOS-9 | Out of Scope: A phone or tablet layout. Narrower than 1024 pixels, the reports show the native mobile fi… | D-49 |
| KD-PERM | Key Decisions, Permissions: Permissions. Viewing all six reports, and exporting them, is governed by 'Reports → Page A… | S1-14, S9-04, REL-04, REL-04b |
| KD-ROW | Key Decisions, row location: A row belongs to the location of its own open document (the invoice, credit memo or deposi… | S5-15, DATA-07, DATA-08 |
| KD-REUSE | Key Decisions, reuse rule: The reuse rule. Every control on these reports reuses an existing ShopView pattern: the na… | S5-37, REL-05, REL-05b, REL-05c, REL-07, REL-12, REL-12b, REL-12c, REL-13, D-01, D-01b, D-04, D-04b, D-07, D-07b, D-10, D-10b, D-13, D-13b, D-16, D-16b, D-25, D-26, D-27, D-28, D-29, D-30, D-31, D-32, D-33, D-34, D-35, D-36, D-39, D-40, D-41, D-42, D-50, D-53, D-71, D-73 |
| KD-DRILL | Key Decisions, drill-down: Drill-down keeps the report's scope. Clicking a customer or vendor on a Summary opens Coll… | S5-26, S5-27, REL-11, D-70 |
| KD-ORG | Key Decisions, organization-wide: The reports stay organization-wide, by decision. Everyone with access sees every location'… | S5-10, S5-11, REL-01, REL-02 |
| GOAL-ACCESS | Goals: Nobody gains or loses access to any data, and no setup is needed. | S5-10, S5-11, REL-04, REL-04b |
| ASSUME-13540 | Assumptions: A shop's A/P Detail can carry well over 10,000 open lines (the QA organization has 13,540 … | DATA-18 |
| FORM | Form factor: Form factor: Desktop only by rule: these are detailed reports. | D-49 |

## Cases deleted on the QA lead's order (26 Oct 2026) and the requirements they covered

| Deleted case | Requirement | Now |
|---|---|---|
| DATA-21 C715470 (A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused) | S3-N2 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| DATA-21 C715470 (A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused) | S3-N3 | still covered by DATA-18, DATA-19, DATA-20, D-55 |
| DATA-21 C715470 (A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused) | UFS-2 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| DATA-21 C715470 (A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused) | S3-R9 | still covered by DATA-18, DATA-19, DATA-20 |
| DATA-21 C715470 (A/P Detail: a CSV of 50,000 rows downloads, 50,001 is refused) | OOS-1 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |

Not testable as written: none (every PRD line has a case).

Gates `build.py` runs on every build: title ≤ 80 and no semicolon · design titles start "Design: " · one "Step N:" result per step · every {placeholder} defined in the preconditions · every quote word for word in PRD version 9 (or Chris Ward's answers, the Jira reading record or the tech plan) · every PRD code and named item covered · every report a requirement names covered · every column of every report clicked in a sort case, with a third click per report · every PRD message used word for word in a step or result · the six descriptions quoted word for word · one AUTOMATION line, last · "From:" line per document, build line, "References from Design" block · setup-file link first.

## What must not change (Rule 96, upgrade of six existing reports)

Code baseline: NOT AVAILABLE (no product source code in this pass), so the invariant list rests on the PRD's own statements; the honest limit is larger and stated here.

| Must not change (PRD wording) | Case(s) |
|---|---|
| WC-10: Which rows and amounts each user can see is unchanged: an untouched report shows exactly today's organization-… | REL-01, REL-02, D-50 |
| KD-PERM: Permissions. Viewing all six reports, and exporting them, is governed by 'Reports → Page Access', unchanged. N… | S1-14, S9-04, REL-04, REL-04b |
| GOAL-ACCESS: Nobody gains or loses access to any data, and no setup is needed. | S5-10, S5-11, REL-04, REL-04b |
| KD-ORG: The reports stay organization-wide, by decision. Everyone with access sees every location's data, as today; th… | S5-10, S5-11, REL-01, REL-02 |
| OOS-2: Restricting these reports by the user's location enrollment. The reports stay organization-wide for everyone w… | S5-10, S5-11 |
| OOS-3: Renaming columns other than Location. Only the capitals change (S2-R4a): A/R keeps "ID" and "Customer Full Nam… | S6-01, S6-02, D-81 |
| OOS-4: Other improvements found in research, each a separate ticket on SV-11315: a credit dated on the as-of date lan… | REL-08, REL-09 |
| OOS-8: The location switcher in the top right of ShopView. It is not changed. Switching location while on one of thes… | S5-33, S5-34, REL-10 |
| S7-E1: The location switcher in the top right of ShopView is not changed. | S5-33, S5-34, REL-10 |
| S1-N1: If the user lacks 'Reports → Page Access', the reports are not available, as today. | S1-14, REL-04 |
| S1-E1: A customer with no open documents on the as-of date does not appear, as today. | S1-15, D-74 |
| S4-R5: Each group's own expand toggle uses the same chevron: pointing down when open, right when closed. Behavior is … | S4-01, S4-02, S4-03, S4-04, D-25, D-26, D-27, D-28, D-52, D-56, D-59 |
| KD-REUSE: The reuse rule. Every control on these reports reuses an existing ShopView pattern: the native filter chips, t… | S5-37, REL-05, REL-05b, REL-05c, REL-07, REL-12, REL-12b, REL-12c, REL-13, D-01, D-01b, D-04, D-04b, D-07, D-07b, D-10, D-10b, D-13, D-13b, D-16, D-16b, D-25, D-26, D-27, D-28, D-29, D-30, D-31, D-32, D-33, D-34, D-35, D-36, D-39, D-40, D-41, D-42, D-50, D-53, D-71, D-73 |
| EH: If an export fails for any other reason (a server error or a lost connection), nothing downloads and one error… | S3-26, S3-27, REL-06, D-38 |
| S7-R2: An invoice or part sale at the user's current location opens its finance page, as today. | S7-01, S7-02, S7-14 |
| S7-R6: A bill at the user's current location opens its delivery, as today. A bill at another location shows as plain … | S7-06, S7-07, S7-08, S7-15, S7-16, D-58, D-62 |

## Where Jira differs from PRD v5 (the PRD wins; listed for the PO)

| Ticket | Difference |
|---|---|
| SV-11531 (Story 1) | S1-R8 reads "Paging (30 rows per page) never repeats or skips…"; PRD v5 states 30 per page on the Summaries, A/R Collection and A/P Unpaid Invoices, and 100 lines per bucket then scroll on the Detail reports. AC 6 says "more than 30 customers, vendors or rows". |
| SV-11532 (Story 2) | AC 7 lists the Past due filter among changes that keep the sort; PRD S2-R7 does not (question 7; case held). |
| SV-11534 (Story 4) | S4-R4 names A/P Detail only ("as today"); PRD v5 adds A/R Detail ("new on A/R Detail"). |
| SV-11535 (Story 5) | S5-R3 lacks "or the Past due filter; it changes only with the as-of date"; S5-R7 lacks the per-document A/P rule; S5-R19 and AC 8 keep the single-threshold Past due link (pastDue=31) that PRD v5 removed on 20 Oct. |
| SV-11537 (Story 7) | Adds AC "clicking anywhere but the link opens nothing" (agrees with What changes). |
| SV-11538 (Story 8) | AC 2 "text columns wrapping to a second line" is looser than S8-R3 (Location wraps only on A/P Detail). |
| SV-7192 (origin) | Proposes a selectable "Sort customers: Alphabetical (A-Z)" option with a "Default order" and ties by Customer ID; the PRD always opens A to Z and breaks ties by the lower-cased name, then the customer. |
| SV-11597 / SV-11600 | Duplicate developer tasks, word for word (for the QA lead). |

## Reading coverage (Rule 119)

| Source | Size | Lines | Read |
|---|---|---|---|
| PRD v9 (markdown, read in full 26 Oct 2026) | 64,317 bytes | 612 | 100% (lines 1–612) |
| Chris Ward's answers 1 to 16 (read in full 26 Oct 2026) | 3,806 bytes | 23 | 100% (lines 1–23) |
| PRD v5 (markdown, saved 22 Oct 2026) | 49,125 bytes | 447 | 100% (lines 1–447) |
| PRD v5 (HTML, used to verify the markdown copy by script) | 83,086 bytes | 1 | 100% (lines 1–1) |
| Epic search result, 25 tickets (key, summary, status, updated) | 82,169 bytes | 1998 | 100% (lines 1–1998) |
| My record of every ticket's description and acceptance criteria | 11,869 bytes | 99 | 100% (lines 1–99) |
| Stories SV-11531 to SV-11539 (description, requirements, acceptance criteria, comments: none) | via Jira | — | 100% |
| Origin tickets SV-7192, SV-10798; out-of-scope SV-11441 to SV-11447; verify tasks SV-11595 to SV-11600; epic SV-11315 | via Jira | — | 100% |
| Rules: LESSONS-REGISTER.md (L-01 to L-05); RULES-61-96.md Rules 96, 113, 114, 115, 116, 117 (all twelve amendments), 122, 126, 130, 133 | repo | — | 100% of those sections |
| Skills: 17-REGRESSION-IMPACT-V1-TO-V2.md (whole), 21-DESIGN-DRIVE-PROTOCOL.md (whole, incl. §4b, §6b, §6c, §6d), IDEAL-TEST-CASE-STANDARD.md (whole) | repo | — | 100% |
| Design canvas https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4 (saved in design-2026-10-22/) | 7 boards, 45 figures, 43 screenshots | — | 100% (DESIGN-READING-RECORD.md) |
| Tech plan (`sources/Tech-Plan-AR-AP-2026-10-22-upload.md`, 2026-10-21, uploaded 22 Oct 2026) | 88,174 bytes | 647 | 100% (lines 1–647; `tech-plan-pass-2026-10-22/READING-RECORD.md`) |

## Tech plan coverage (Rules 30, 115, 134; 22 Oct 2026)

Every testable statement of the tech plan has a verdict in `tech-plan-pass-2026-10-22/TECH-PLAN-STATEMENTS.md` (84 statements: CONFIRM 52, CHANGE 16, ADD 7, EXCLUDED 7, DIVERGE 2); every case's verdict and per-part record is in `tech-plan-pass-2026-10-22/PASS-REPORT.md`. Two contradictions with PRD version 9, both settled for the PRD by Chris Ward (23 Oct 2026): names that start with a punctuation mark (answer 16, S1-16) and the order of the ticked locations on the export (answer 7, S3-17); each case notes that the build may follow the plan until engineering changes it.

## Outputs

- `authoring/` — `ar_lib.py`, `common.py`, `po_questions.py`, `cases_*.py`, `build.py`, `render_setup.py`, `render_outputs.py`, `proposals.json`.
- `AR-AP-SETUP-FILE.md` — the setup file for Claude sessions (Rule 117 ninth amendment).
- `TICKET-LEDGER.json`, `TICKET-SWEEP.json` — one row per ticket (25); `build/testing-tools/ticket_sweep.py` exits 0 on them (run on a flattened copy of the saved search, whose issues sit under `nodes`; PRD still version 5 when re-checked at the end of the pass).
- `PO-QUESTIONS-DRAFT.md` — the 22 Oct 2026 question draft; all 16 sent questions answered 23 Oct 2026.
- `DESIGN-CASE-CHECKLIST-2026-10-22.md`, `DESIGN-DIVERGENCE-REGISTER.json`, `cases/design/DESIGN-CASES.json`.

## OUTSTANDING — what I need from you

| What | Who | What it blocks | Since |
|---|---|---|---|
| Permission to write the 26 Oct 2026 full pass to TestRail (changed and new cases) and to add the new and released cases to run 549 (Rules 6, 123) | QA lead | the v9 pass stays a draft | 26 Oct 2026 |
| A test data set with exactly 2,000/2,001 customers, or a lower test limit | developers | 1 held export-limit case (DATA-19; DATA-21 was deleted 26 Oct 2026) | 22 Oct 2026 |
| A build of the feature | developers | every case is HOLD (no build yet) | 22 Oct 2026 |

### Waiting on the PO

Sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA: questions 1 to 16 all answered by Chris Ward on 23 Oct 2026 (read 26 Oct 2026). Nothing is waiting on the PO; cases held on a PO question: none.
