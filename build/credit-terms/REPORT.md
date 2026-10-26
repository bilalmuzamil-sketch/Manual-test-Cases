# Credit terms — draft suite report (23 Oct 2026)

Drafted from PRD v3 (Confluence 963346440, 22 Oct 2026) and the 12 stories of epic SV-11638. 344 cases, not written to TestRail. No tech plan yet; no build; the design is driven in parallel by another worker and its pass fills "References from Design" and the DESIGN section.

## 1. Counts per section
| Key | TestRail section | Name | Cases |
|---|---|---|---|
| S1 | 91455 | Story 1 — Credit Terms page and list | 36 |
| S2 | 91456 | Story 2 — Row menu actions | 36 |
| S3 | 91457 | Story 3 — Create or edit a credit term | 28 |
| S4 | 91458 | Story 4 — Move Customers | 36 |
| S5 | 91459 | Story 5 — New Customer and Edit Customer | 26 |
| S6 | 91460 | Story 6 — Vendors | 8 |
| S7 | 91461 | Story 7 — Due dates | 12 |
| S8 | 91462 | Story 8 — QuickBooks sync | 13 |
| S9 | 91463 | Story 9 — Over Credit warning | 10 |
| S10 | 91464 | Story 10 — Imports and Public API | 16 |
| S11 | 91465 | Release day and what must not change | 20 |
| S12 | 91466 | Story 12 — Credit Terms audit log | 21 |
| DATA | 91467 | Counts and due dates — exact numbers | 29 |
| DESIGN | 91468 | Design — how it looks (written by the design worker, cases_design.py) | 53 |
| | | **Total** | **344** |

Markers: `AUTOMATION: HOLD - not yet build-verified (no build yet)` × 306; `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` × 6; `AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records (the shared test site holds other terms and customers)` × 4; `AUTOMATION: HOLD - needs the before values taken on production shortly before the release reaches production; run on production after the release` × 3; `AUTOMATION: HOLD - a manual tester cannot hold the list in its loading state long enough to look (it needs a slowed network)` × 1; `AUTOMATION: HOLD - a manual tester cannot make the term list fail to load on demand` × 1; `AUTOMATION: HOLD - the page never offers Deactivate on these three terms, so only a request sent outside the page can reach this refusal` × 1; `AUTOMATION: HOLD - waiting on the PO (question 3)` × 1; `AUTOMATION: HOLD - the Name field stops at 31 characters, so only a request sent outside the window can reach this refusal` × 1; `AUTOMATION: HOLD - the window always has one option chosen, so only a request sent outside the window can reach this refusal` × 1; `AUTOMATION: HOLD - the page greys Move Customers for this user, and changing a role signs the user out, so only a request sent outside the page can reach this refusal` × 1; `AUTOMATION: HOLD - a manual tester cannot make a move fail partway` × 1; `AUTOMATION: HOLD - waiting on the PO (question 5)` × 1; `AUTOMATION: HOLD - waiting on the PO (question 6)` × 1; `AUTOMATION: HOLD - a manual tester cannot hold the term list in its loading state (it needs a slowed network)` × 1; `AUTOMATION: HOLD - the window locks Credit Limit at $0.00 for COD and Credit Hold, so only a save sent outside the window can reach this refusal` × 1; `AUTOMATION: HOLD - needs the before due date taken on production shortly before the release reaches production; run on production after the release` × 1; `AUTOMATION: HOLD - waiting on the PO (question 7)` × 1; `AUTOMATION: HOLD - what AccountingHub and IBS receive cannot be seen in ShopView; needs access to those systems` × 1; `AUTOMATION: HOLD - what AccountingHub receives cannot be seen in ShopView; needs access to AccountingHub` × 1; `AUTOMATION: HOLD - needs an organization created after the release; how a tester gets a new organization on the test site is to be confirmed with the QA lead` × 1; `AUTOMATION: HOLD - a tester cannot make or recognise an organization with no settings record` × 1; `AUTOMATION: HOLD - waiting on the PO (question 4)` × 1; `AUTOMATION: HOLD - without Settings Finance the page and its menu cannot be reached, so only a request sent outside the page can reach this refusal` × 1; `AUTOMATION: HOLD - a manual tester cannot make the log fail to load on demand` × 1; `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 8)` × 1; `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 9)` × 1; `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 10)` × 1; `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 11)` × 1

## 2. Coverage of the 211 requirement codes
| Code | Cases |
|---|---|
| S1-R1 | S1-01, D-01 |
| S1-R2 | S1-01, S12-01, D-01 |
| S1-R3 | S1-01, S1-04, S1-23, S1-25, DATA-24, D-01, D-04 |
| S1-R4 | S1-02, D-01, D-09 |
| S1-R5 | S1-03, S1-04, S1-08, S3-08, S4-06, S5-02, S6-01, D-23 |
| S1-R6 | S1-05, S1-06, S1-07, S1-08, S1-09 |
| S1-R7 | S1-10, S1-11, S3-09, S11-05 |
| S1-R8 | S1-12, S1-13, S1-14, S11-05, S11-06, D-02, D-50 |
| S1-R9 | S1-15, D-02 |
| S1-R10 | S1-16, S1-18, D-01 |
| S1-R11 | S1-17, S1-18, D-06 |
| S1-R12 | S1-19, S4-11, DATA-20, DATA-21, DATA-23, D-01 |
| S1-R13 | S1-19, DATA-21, DATA-22, D-01 |
| S1-R14 | S1-02, S1-03, S1-04, D-09 |
| S1-R15 | S1-20, D-05 |
| S1-R16 | S1-21 |
| S1-N1 | S1-22 |
| S1-N2 | S1-23, D-10, D-51 |
| S1-N3 | S1-24, D-01, D-45 |
| S1-E1 | S1-25, D-09 |
| S1-E2 | S1-26, S2-12 |
| S1-E3 | S1-27 |
| S2-R1 | S2-01, S2-02, S2-03, S2-04, S2-05, S2-06, S2-07, S2-08, S2-09, S2-10, S2-13, S2-14, S2-16, S2-17, S2-18, S2-19, S4-01, S4-26, S4-27, S4-28, D-07, D-35, D-46, D-47, D-49 |
| S2-R2 | S1-26, S2-10, S2-11, S2-12, S2-13, S2-14, S2-15, DATA-27, D-46 |
| S2-R3 | S2-06, S2-07, D-35, D-49 |
| S2-R4 | S2-29, S3-19, D-16 |
| S2-R5 | S2-20, D-11 |
| S2-R6 | S2-21, D-03, D-06 |
| S2-R7 | S2-22, S2-23, DATA-24 |
| S2-R8 | S2-24, DATA-24 |
| S2-R9 | S2-25, DATA-24, D-12 |
| S2-R10 | S2-07, S2-17, S2-18, D-49 |
| S2-R11 | S2-26, S2-27 |
| S2-R12 | S2-28 |
| S2-N1 | S2-01, S2-02, S2-03, S2-06, S2-07, S11-19, D-35 |
| S2-N2 | S2-01, S2-02, S2-03, S2-04, S2-05, D-45 |
| S2-N3 | S2-05 |
| S2-N4 | S2-01, S2-04, S2-08, S2-16, D-47 |
| S2-N5 | S2-10, S2-11, S2-13, S2-23, D-46 |
| S2-N6 | S2-19 |
| S2-E1 | S2-29 |
| S2-E2 | S2-30, S2-31, S2-32, S2-36 |
| S2-E3 | S2-23 |
| S3-R1 | S3-01, S3-19, D-13, D-16 |
| S3-R2 | S3-01, S3-12, D-05, D-13 |
| S3-R3 | S3-01, S3-02, D-13, D-14 |
| S3-R4 | S3-02, D-14 |
| S3-R5 | S3-03, S3-04, S3-05, S3-06, DATA-19, D-13, D-14, D-52 |
| S3-R6 | S3-01, S3-07, D-15 |
| S3-R7 | S3-08, S3-09, DATA-24 |
| S3-R8 | S3-20 |
| S3-R9 | S3-10, S3-12, S3-13, S3-14, S3-15, S3-16, S3-27, D-15 |
| S3-R10 | S3-05, S3-10, S3-11, D-53 |
| S3-R11 | S3-17 |
| S3-R12 | S3-18 |
| S3-R13 | S3-19 |
| S3-R14 | S3-21 |
| S3-R15 | S3-22 |
| S3-R16 | S3-06, DATA-19 |
| S3-N1 | S1-22 |
| S3-N2 | S2-17, S2-18, S3-19 |
| S3-N3 | S3-23 |
| S3-E1 | S3-24 |
| S3-E2 | S3-25 |
| S4-R1 | S4-01, D-17 |
| S4-R2 | S4-01, S4-05, S4-07, S4-09, DATA-23, DATA-25, D-17 |
| S4-R3 | S4-02, S4-03 |
| S4-R4 | S4-01, D-17 |
| S4-R5 | S4-04 |
| S4-R6 | S4-05, DATA-25 |
| S4-R7 | S4-01, S4-02, S4-06, S4-07, D-17, D-37, D-18 |
| S4-R8 | S4-07 |
| S4-R9 | S4-08, S4-09, S4-29, DATA-23, DATA-26, DATA-26b |
| S4-R10 | S4-12, D-18 |
| S4-R11 | S4-10, S4-11, S4-35, S4-36 |
| S4-R12 | S4-17, S8-06, S8-12 |
| S4-R13 | S4-22 |
| S4-R14 | S4-12, S4-14, S11-09, DATA-26, D-19 |
| S4-R15 | S4-12, D-19 |
| S4-R16 | S4-13, S4-14 |
| S4-R17 | S4-08, S4-15 |
| S4-R18 | S4-16 |
| S4-R19 | S4-16 |
| S4-R20 | S4-10, S4-13, S11-09 |
| S4-R21 | S4-18, S4-19 |
| S4-R22 | S4-20 |
| S4-R23 | S4-21 |
| S4-R24 | S4-23 |
| S4-N1 | S4-26, S4-27, S4-28, S4-30, D-48 |
| S4-N2 | S2-09, D-07, D-45 |
| S4-N3 | S2-05, S2-18, S4-06, S4-24, S4-25, S4-35, D-37 |
| S4-E1 | S4-31 |
| S4-E2 | S4-14 |
| S4-E3 | S4-13, S4-15, S4-25 |
| S4-E4 | S4-24 |
| S5-R1 | S1-32, S1-33, S1-34, S5-01, D-22, D-27 |
| S5-R2 | S5-01, S5-07, S5-08, S5-20, D-22 |
| S5-R3 | S5-01, S5-02, D-23 |
| S5-R4 | S5-03, S5-04, S5-05, S5-26, D-24, D-40 |
| S5-R5 | S4-15, S5-05 |
| S5-R6 | S5-06 |
| S5-R7 | S5-09, D-27, D-28 |
| S5-R8 | S5-09, S7-06, S10-04, S11-20, D-26, D-33 |
| S5-R9 | S11-08 |
| S5-R10 | S5-11, S5-12 |
| S5-R11 | S5-13, S5-14, D-33 |
| S5-R12 | S5-09, S5-10, D-27 |
| S5-R13 | S5-10 |
| S5-R14 | S5-15, D-26 |
| S5-R15 | S5-07, S5-08, S11-03 |
| S5-N1 | S5-16, D-39 |
| S5-N2 | S5-02, S5-10, D-41 |
| S5-N3 | S5-02 |
| S5-N4 | S5-17, S5-18, S5-19 |
| S5-E1 | S5-21 |
| S5-E2 | S5-22, S10-03 |
| S5-E3 | S5-23 |
| S6-R1 | S6-01, D-29, D-30 |
| S6-R2 | S6-01, S6-02, D-29, D-30 |
| S6-R3 | S6-03, D-31, D-42 |
| S6-R4 | S6-04, D-29 |
| S6-R5 | S6-05, S6-06 |
| S6-R6 | S6-07, D-42 |
| S6-N1 | S6-08 |
| S6-N2 | S6-01, S6-03 |
| S6-E1 | S10-09 |
| S6-E2 | S2-11, DATA-22 |
| S7-R1 | S7-02, DATA-01, DATA-02, DATA-09, DATA-10, D-43 |
| S7-R2 | DATA-03, DATA-08, D-32, D-33, D-44 |
| S7-R3 | DATA-04, DATA-05, DATA-06, DATA-06b, DATA-19 |
| S7-R4 | DATA-07 |
| S7-R5 | DATA-16, DATA-17 |
| S7-R6 | S7-04, S11-12, DATA-11, DATA-12, DATA-13, DATA-18 |
| S7-R6a | S7-04, DATA-18 |
| S7-R6b | DATA-14 |
| S7-R7 | S7-01, S7-01b, S7-01c, S7-10 |
| S7-R8 | S7-10, DATA-15 |
| S7-R9 | S7-02, DATA-17, D-32, D-43 |
| S7-R10 | DATA-11, DATA-12 |
| S7-R11 | S7-03 |
| S7-N1 | S7-05 |
| S7-E1 | S5-09, S7-06 |
| S7-E2 | S11-02, S11-12 |
| S7-E3 | S7-07 |
| S7-E4 | S7-08 |
| S8-R1 | S8-01, S8-02, S8-04 |
| S8-R2 | S8-01, S8-04 |
| S8-R3 | S8-02 |
| S8-R4 | S8-03 |
| S8-R5 | S8-01, S8-04 |
| S8-R6 | S8-05, S8-06 |
| S8-R7 | S8-07, S8-07b |
| S8-R8 | S8-11 |
| S8-N1 | S8-10 |
| S8-N2 | S8-07b, S8-08 |
| S8-E1 | S8-03 |
| S9-R1 | S9-01, S9-10, D-25 |
| S9-R2 | S9-02, S9-03, D-36 |
| S9-R3 | S9-01, D-25 |
| S9-R4 | S9-02, S9-03 |
| S9-N1 | S9-04, D-34 |
| S9-N2 | S9-05, S9-06, S9-07, S9-08, D-34 |
| S9-E1 | S9-09 |
| S9-E2 | S4-14, S9-07 |
| S10-R1 | S10-01 |
| S10-R2 | S10-11 |
| S10-R3 | S10-02, S10-09, S10-12, DATA-20 |
| S10-R4 | S7-05, S10-03, S10-13 |
| S10-R5 | S10-13 |
| S10-R6 | S10-05 |
| S10-R7 | S10-12, S10-16 |
| S10-R8 | S10-07, S10-08, S10-14, S10-15 |
| S10-N1 | S10-03, S10-07, S10-13, S10-14 |
| S10-N2 | S10-09 |
| S10-E1 | S10-04 |
| S10-E2 | S10-05, S10-08, S10-15 |
| S10-E3 | S10-06, S10-10 |
| S11-R1 | S11-01 |
| S11-R2 | S11-02, S11-03 |
| S11-R3 | S11-04 |
| S11-R4 | S1-01, S11-01 |
| S11-R5 | S5-01, S5-16, S11-01 |
| S11-R6 | S5-11, S5-12 |
| S11-R7 | S6-05, S6-06 |
| S11-R8 | S9-04, S9-05, S9-06, S9-07 |
| S11-R9 | S4-02, S11-13, DATA-21 |
| S11-R10 | S7-09, S11-05, S11-06 |
| S11-R11 | S11-07 |
| S11-R12 | S11-10 |
| S11-R13 | S11-02 |
| S11-R14 | S7-03, S11-12 |
| S11-R16 | S11-08 |
| S11-R17 | S11-09 |
| S11-N1 | S11-02, S11-14 |
| S11-N2 | S1-22, S5-16 |
| S11-E1 | S11-11 |
| S11-E2 | S4-36, S11-13, DATA-20 |
| S12-R1 | S12-01, D-08 |
| S12-R2 | S12-01, S12-06, D-20 |
| S12-R3 | S2-26, S4-18, S12-01, S12-02, S12-03, S12-04, S12-05, S12-06, S12-07, S12-08, S12-09, DATA-26, DATA-26b, D-20 |
| S12-R4 | S12-10 |
| S12-R5 | S12-11 |
| S12-R6 | S12-10, S12-12 |
| S12-R7 | S12-13, S12-13b, S12-13c, S12-14 |
| S12-R8 | S12-15, D-20 |
| S12-N1 | S12-18 |
| S12-N2 | S12-16 |
| S12-N3 | S11-18, S12-17 |
| S12-E1 | S12-16, D-21 |
| S12-E2 | S12-07 |
| S12-E3 | S4-31 |

No code is listed as not testable: every one of the 211 is quoted by at least one case (codes with no runnable trigger are held, see §4). Story 11 has no S11-R15 (question 1).

### Named PRD items (no code): Error Handling, User Feedback Summary, Key Decisions, Permissions, Terminology, Assumptions, Goals, Out of Scope
| Item | Where | Cases or reason |
|---|---|---|
| EH-S1 | Story 1, Error Handling | S1-28 |
| EH-S2 | Story 2, Error Handling | S2-30, S2-31, S2-32, S2-33, S2-34, S2-35 |
| EH-S3a | Story 3, Error Handling | S3-25, S3-26, S3-27, S3-28 |
| EH-S3b | Story 3, Error Handling | S3-08, S3-20 |
| EH-S4a | Story 4, Error Handling | S4-32 |
| EH-S4b | Story 4, Error Handling | S4-33 |
| EH-S4c | Story 4, Error Handling | S4-34 |
| EH-S5a | Story 5, Error Handling | S5-24 |
| EH-S5b | Story 5, Error Handling | S5-25 |
| EH-S6 | Story 6, Error Handling | S6-05 |
| EH-S7 | Story 7, Error Handling | NOT TESTABLE: States that due-date calculation has no failure path; there is nothing to trigger. The due-date cases (S7, DATA) cover the behaviour. |
| EH-S8 | Story 8, Error Handling | S8-09 |
| EH-S9 | Story 9, Error Handling | S9-01 |
| EH-S10 | Story 10, Error Handling | S10-03 |
| EH-S11 | Story 11, Error Handling | NOT TESTABLE: States that release has no failure path; nothing to trigger. The release-day cases (S11) cover the behaviour. |
| EH-S12 | Story 12, Error Handling | S12-19 |
| UFS-1 | User Feedback Summary | S1-28 |
| UFS-2 | User Feedback Summary | S1-23, D-10 |
| UFS-3 | User Feedback Summary | S1-15, D-02 |
| UFS-4 | User Feedback Summary | S1-12, D-02 |
| UFS-5 | User Feedback Summary | S1-13 |
| UFS-6 | User Feedback Summary | S1-14 |
| UFS-7 | User Feedback Summary | S2-10, D-46 |
| UFS-8 | User Feedback Summary | S2-08, S2-16, D-47 |
| UFS-9 | User Feedback Summary | S2-09, D-45 |
| UFS-10 | User Feedback Summary | S2-06, D-35 |
| UFS-11 | User Feedback Summary | S2-20, D-11 |
| UFS-12 | User Feedback Summary | S2-21, D-03 |
| UFS-13 | User Feedback Summary | S2-22 |
| UFS-14 | User Feedback Summary | S2-24 |
| UFS-15 | User Feedback Summary | S2-25, D-12 |
| UFS-16 | User Feedback Summary | S2-25 |
| UFS-17 | User Feedback Summary | S3-08 |
| UFS-18 | User Feedback Summary | S3-20 |
| UFS-19 | User Feedback Summary | S3-01, D-13 |
| UFS-20 | User Feedback Summary | S3-10 |
| UFS-21 | User Feedback Summary | S3-27 |
| UFS-22 | User Feedback Summary | S3-13, D-15 |
| UFS-23 | User Feedback Summary | S3-14 |
| UFS-24 | User Feedback Summary | S3-15, D-15 |
| UFS-25 | User Feedback Summary | S3-16 |
| UFS-26 | User Feedback Summary | S3-28 |
| UFS-27 | User Feedback Summary | S3-03, D-13 |
| UFS-28 | User Feedback Summary | S3-04, D-14 |
| UFS-29 | User Feedback Summary | S2-31 |
| UFS-30 | User Feedback Summary | S2-30, S2-32 |
| UFS-31 | User Feedback Summary | S2-35 |
| UFS-32 | User Feedback Summary | S2-33 |
| UFS-33 | User Feedback Summary | S2-34 |
| UFS-34 | User Feedback Summary | S4-01, D-17, D-18 |
| UFS-35 | User Feedback Summary | S4-12, D-18 |
| UFS-36 | User Feedback Summary | S4-12, D-19 |
| UFS-37 | User Feedback Summary | S4-26, S4-27, S4-28, D-48 |
| UFS-38 | User Feedback Summary | S4-34 |
| UFS-39 | User Feedback Summary | S4-04 |
| UFS-40 | User Feedback Summary | S4-08, S4-09, DATA-26 |
| UFS-41 | User Feedback Summary | S4-10, S4-13 |
| UFS-42 | User Feedback Summary | S4-32 |
| UFS-43 | User Feedback Summary | S4-33 |
| UFS-44 | User Feedback Summary | S5-03, D-24, D-40 |
| UFS-45 | User Feedback Summary | S5-25 |
| UFS-46 | User Feedback Summary | S5-24 |
| UFS-47 | User Feedback Summary | S12-01, D-08 |
| UFS-48 | User Feedback Summary | S12-02, DATA-26 |
| UFS-49 | User Feedback Summary | S12-02, DATA-26, D-17 |
| UFS-50 | User Feedback Summary | S12-16, D-21 |
| UFS-51 | User Feedback Summary | S12-19, D-38 |
| UFS-52 | User Feedback Summary | S9-01, D-25 |
| KD-EXIST | Key Decisions | S11-01, S11-02, S11-10 |
| KD-NEWONLY | Key Decisions | S2-21 |
| KD-ANYACTIVE | Key Decisions | S2-21, S2-33 |
| KD-ONELIST | Key Decisions | S1-21, S3-08, S5-02, S6-01 |
| KD-OWNNET | Key Decisions | S7-09, S9-09 |
| KD-LOCK | Key Decisions | S2-09, S2-10, S2-25, S3-26, S7-01 |
| KD-DEACT | Key Decisions | S2-23, S2-24, S5-09 |
| KD-DEFAULT | Key Decisions | S2-08, S2-16 |
| KD-NETDEACT | Key Decisions | S2-06, S2-22 |
| KD-NAMES | Key Decisions | S3-24 |
| KD-RANGE | Key Decisions | S1-11, S3-12, S3-15, S3-16, DATA-10 |
| KD-TABLE | Key Decisions | S1-02 |
| KD-THREE | Key Decisions | S1-15, S2-35 |
| KD-INLINE | Key Decisions | S1-10, S1-12, S1-13, S1-14, S1-16 |
| KD-CONFIRM | Key Decisions | S2-20, S2-22, S2-25 |
| KD-LOG | Key Decisions | S4-10, S12-02, S12-09 |
| KD-LENIENT | Key Decisions | S10-01, S10-02, S10-03, S10-04, S10-11 |
| KD-NOFLAG | Key Decisions | S11-01, S11-02 |
| KD-ZERO | Key Decisions | S5-03, S5-04, S10-05, S10-14 |
| KD-ZERO2 | Key Decisions | S10-08, S10-15, S11-07, S11-08 |
| KD-MOVEZERO | Key Decisions | S4-12, S4-13 |
| KD-MOVEGATE | Key Decisions | S4-26, S4-27, S4-28, S4-29 |
| KD-MODAL | Key Decisions | S3-22, S4-20 |
| PERM-PAGE | Key Decisions, Permissions | S1-01, S1-22, S4-26, S4-27, S4-28 |
| PERM-MOVE | Key Decisions, Permissions | S4-26, S4-27, S4-28, S4-29 |
| PERM-FIELDS | Key Decisions, Permissions | S5-01, S5-16, S6-08 |
| PERM-IGNORED | Key Decisions, Permissions | S5-17, S5-18, S5-19 |
| PERM-LIST | Key Decisions, Permissions | S5-20, S7-04 |
| PERM-NONEW | Key Decisions, Permissions | S1-36 |
| PERM-SCREEN | Key Decisions, Permissions | S1-29, S1-36 |
| PERM-DEFAULTS | Key Decisions, Permissions | S1-29, S1-30, S1-31, S1-32, S1-33, S1-34, S1-35 |
| PERM-OOTB | Key Decisions, Permissions | S1-30, S1-31, S1-32, S1-33, S1-34 |
| T-INUSE | Terminology | S1-26, S2-11, S2-12, DATA-20, DATA-21, DATA-22, DATA-27 |
| T-INACTIVE | Terminology | S2-23, S5-09, S6-03 |
| T-COUNTER | Terminology | S4-02, S11-03, DATA-21 |
| T-MDVSMC | Terminology | S2-21, S4-08 |
| T-DEFAULT | Terminology | S2-21 |
| T-STANDARD | Terminology | S11-04 |
| T-OWN | Terminology | S3-01, DATA-02, DATA-03 |
| T-CREDIT | Terminology | NOT TESTABLE: Defines the word; the AccountingHub Payment Terms list check is OOS-2's case. |
| T-VI | Terminology | S8-04 |
| T-VOCAB | Terminology | NOT TESTABLE: Vocabulary note mapping screen words to back-end words; no behaviour. |
| A-1500 | Assumptions | S4-22 |
| A-SPELL | Assumptions | S3-13, S4-03, S10-02, S11-13, DATA-20 |
| A-DESK | Assumptions | NOT TESTABLE: Describes who uses the page (desktop office user); the page cases run in a desktop browser. No separate check. |
| GOAL-1 | Goals | S2-21, S10-01 |
| GOAL-2 | Goals | S3-08, S7-09 |
| GOAL-3 | Goals | S5-01, S5-06 |
| GOAL-4 | Goals | S4-08 |
| GOAL-5 | Goals | S9-04, S9-05 |
| GOAL-6 | Goals | S11-01, S11-04, S11-10 |
| OOS-1 | Out of Scope | S6-02 |
| OOS-2 | Out of Scope | S11-16 |
| OOS-3 | Out of Scope | S3-01 |
| OOS-4 | Out of Scope | S1-21 |
| OOS-5 | Out of Scope | S8-05 |
| OOS-6 | Out of Scope | S3-26 |
| OOS-7 | Out of Scope | S11-19 |
| OOS-8 | Out of Scope | NOT TESTABLE: A permission that is not built in this release and has no screen; there is nothing a tester can look for. |
| OOS-9 | Out of Scope | S6-04 |
| OOS-10 | Out of Scope | S11-12, S11-15 |
| OOS-11 | Out of Scope | S11-17 |
| OOS-12 | Out of Scope | S11-18 |
| OOS-13 | Out of Scope | NOT TESTABLE: Release notes are not part of this PRD; nothing to test. |
| OOS-14 | Out of Scope | S8-11 |
| FO-DESIGN | Feature Overview, Design coverage | NOT TESTABLE: Says which states have no design board; it is a note for the design pass, not a behaviour. Each such state is covered by its own case quoting the PRD text. |
| FO-VENDOR-COD | Feature Overview | S6-01, S6-02 |

Sub-items (rows of the S2-R1 and S12-R3 tables, the S1-R7/S1-R8/S3-R2/S3-R5/S3-R9 bullets): every one is quoted by a case (gate in build.py).

## 3. Must not change (Rule 96)
Project type: V2 / upgrade, confirmed by the QA lead on 23 Oct 2026 ("It is an updgrade"; twelve fixed terms exist today). Code baseline: NOT AVAILABLE (no product repository in this session); the baseline rests on PRD v3 and the facts in `build/sv9087-credit-term-2026-08-27/FINDINGS.md`. Every PRD sentence that says a behaviour stays as today, and the case that protects it:
| PRD sentence (verbatim) | Cases |
|---|---|
| S2-R5: "Customers you already have keep their current term." and the buttons "Cancel" and "Make Default"." | S2-20, D-11 |
| S3-R13: "Editing a term keeps its own name valid (saving "Net 10" unchanged on the term "Net 10" is not a duplicate)." | S3-19 |
| S4-R6: "Customers hidden by the search keep their ticks." | S4-05, DATA-25 |
| S5-N3: "Credit Hold is offered in the dropdown (as today) but never carries the "Default" tag, because it can never be the default." | S5-02 |
| S6-R2: "New Vendor starts on COD, as today." | S6-01, S6-02, D-29, D-30 |
| S6-R4: "Vendor credit limits behave exactly as today on every term, COD and Credit Hold included: no lock, no $0 rule." | S6-04, D-29 |
| S6-N1: "If the user does not have the 'View and Manage AP/AR Data' setting, the vendor Credit Terms field stays hidden, as today." | S6-08 |
| S6-E1: "A vendor imported with a blank term starts on COD, as today;" | S10-09 |
| S7-R5: "COD, Due on Receipt and Credit Hold are due on the invoice date, as today." | DATA-16, DATA-17 |
| S7-R7: "Changing the customer's term later, deactivating the term or moving the customer never changes an existing invoice." | S7-01, S7-01b, S7-01c, S7-10 |
| S7-N1: "A term whose text ShopView does not recognize (from an old import or the Public API) is dated exactly as today." | S7-05 |
| S7-E2: "Due dates already stored on existing invoices and vendor invoices are never rewritten." | S11-02, S11-12 |
| S7-E3: "An invoice created after a reversal takes the customer's term at that moment, as today: a deactivated term the customer still holds, or the new term after a move or edit." | S7-07 |
| S8-R4: "ShopView never changes a term in QuickBooks." | S8-03 |
| S8-R5: "Each invoice carries its own term and due date to QuickBooks, as today." | S8-01, S8-04 |
| S8-R6: "Changing a customer's term in ShopView, by Edit Customer or by Move Customers (Story 4: Move Customers), does not change the customer record in QuickBooks, exactly as an Edit Customer save does not today." | S8-05, S8-06 |
| S8-R8: "AccountingHub and IBS are unchanged: both receive each invoice's or vendor invoice's due date only, never the term name, so a shop's own term names never reach them." | S8-11 |
| S8-N1: "If the QuickBooks integration is not connected, nothing is sent and Story 3: Create or edit a credit term, Story 4: Move Customers, Story 5: New Customer and Edit Customer and Story 7: Due dates behave exactly as they do without the integration." | S8-10 |
| S9-R1: "When a user opens a new work order for a customer whose balance exceeds a credit limit above $0, and the customer is not on COD, Due on Receipt or Credit Hold, the existing confirmation shows unchanged: title "Confirmation", message "Are you sure you want to open a new work order? This customer is over their credit limit.", buttons "Create" and "Cancel"." | S9-01, S9-10, D-25 |
| S9-R3: "Wording and buttons are unchanged." | S9-01, D-25 |
| S9-R4: "Opening a part sale shows no over-credit confirmation, as today;" | S9-02, S9-03 |
| S9-E2: "A customer on Credit Hold is still blocked from invoicing as today;" | S4-14, S9-07 |
| S10-R4: "Any other text is saved exactly as sent and dates invoices as it does today (lenient, as today)." | S7-05, S10-03, S10-13 |
| S10-R7: "The vendor API is unchanged." | S10-12, S10-16 |
| S10-E2: "Credit limits sent with an import or API customer are handled as today, except as S10-R6 and S10-R8 state." | S10-05, S10-08, S10-15 |
| S11-R5: "Users without it see New Customer as before." | S5-01, S5-16, S11-01 |
| S11-R10: "COD behaves as today at invoicing: Create Invoice still opens the payment window, Charge Account is still hidden for COD customers, and closing the window without paying still removes the new invoice." | S7-09, S11-05, S11-06 |
| S11-R10: "The payment window opens for every term at invoicing, as today;" | S7-09, S11-05, S11-06 |
| S11-R13: "due dates stored on existing invoices and vendor invoices are never rewritten (S7-E2)." | S11-02 |
| S11-R14: "Stored due dates are never rewritten." | S7-03, S11-12 |
| EH-S6: "Vendor save errors are unchanged." | S6-05 |
| EH-S10: "Import and API errors are unchanged." | S10-03 |
| UFS-11: "Customers you already have keep their current term." / Confirmation, buttons "Cancel" and "Make Default"" | S2-20, D-11 |
| UFS-52: "Over credit limit on New Work Order (unchanged wording) / "Are you sure you want to open a new work order? This customer is over their credit limit." / Confirmation titled "Confirmation", buttons "Create" and "Cancel"" | S9-01, D-25 |
| KD-LENIENT: "any other text is saved as sent and dated as today." | S10-01, S10-02, S10-03, S10-04, S10-11 |
| KD-NOFLAG: "release-day behavior (Story 11: Release day) leaves existing shops exactly as they were until they act." | S11-01, S11-02 |
| PERM-LIST: "The organization's credit term list itself (the terms that fill those dropdowns, and which one is the default) loads for every user in the shop, as today," | S5-20, S7-04 |
| T-DEFAULT: "It never changes an existing customer." | S2-21 |
| GOAL-6: "With no setup at all, existing shops behave exactly as before release (default COD, the same twelve terms), and new shops start on Due on Receipt." | S11-01, S11-04, S11-10 |
| OOS-9: "Vendor credit limits behave exactly as today on every term, including COD and Credit Hold." | S6-04 |
| OOS-12: "A term or credit limit changed one record at a time (New or Edit Customer, Edit Vendor, imports, the Public API) leaves no visible record, exactly as today;" | S11-18 |
| OOS-14: "AccountingHub and IBS are unchanged: both receive each invoice's or vendor invoice's due date only, never the term name, so a shop's own term names never reach them (S8-R8)." | S8-11 |

Honest limit (skill 17 §7): undocumented, untested, code-invisible behaviours cannot be fully listed; without code access the list above is the PRD's own sentences plus the Out of Scope checks. A dangerous silence found while drafting (how a deactivated term reads on screens the PRD does not name) is question 4.

## 4. Held cases and why
| Case | Title | Marker |
|---|---|---|
| S1-23 | An empty Inactive tab says "No inactive terms" | `AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records (the shared test site holds other terms and customers)` |
| S1-25 | With every term deactivated, Active keeps the three fixed terms and the default | `AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records (the shared test site holds other terms and customers)` |
| S1-27 | While the list loads, the Inactive tab never says "No inactive terms" | `AUTOMATION: HOLD - a manual tester cannot hold the list in its loading state long enough to look (it needs a slowed network)` |
| S1-28 | If the list cannot load, the page says so above the tabs | `AUTOMATION: HOLD - a manual tester cannot make the term list fail to load on demand` |
| S2-35 | Deactivating COD, Due on Receipt or Credit Hold is refused by the server | `AUTOMATION: HOLD - the page never offers Deactivate on these three terms, so only a request sent outside the page can reach this refusal` |
| S2-36 | Acting on a term another user renamed after the page loaded | `AUTOMATION: HOLD - waiting on the PO (question 3)` |
| S3-27 | A name longer than 31 characters is refused by the server | `AUTOMATION: HOLD - the Name field stops at 31 characters, so only a request sent outside the window can reach this refusal` |
| S3-28 | A create request with no option chosen is refused | `AUTOMATION: HOLD - the window always has one option chosen, so only a request sent outside the window can reach this refusal` |
| S4-30 | A move sent without all three permissions is refused by the server | `AUTOMATION: HOLD - the page greys Move Customers for this user, and changing a role signs the user out, so only a request sent outside the page can reach this refusal` |
| S4-34 | If a move fails partway, nobody is changed | `AUTOMATION: HOLD - a manual tester cannot make a move fail partway` |
| S4-35 | Moving off a deactivated term: how the note names the old term | `AUTOMATION: HOLD - waiting on the PO (question 5)` |
| S4-36 | Moving a customer stored as "NET 30": how the note names the old term | `AUTOMATION: HOLD - waiting on the PO (question 6)` |
| S5-23 | Before the term list loads, the dropdown shows the twelve standard terms | `AUTOMATION: HOLD - a manual tester cannot hold the term list in its loading state (it needs a slowed network)` |
| S5-25 | A limit above $0 sent for a COD customer is refused by the server | `AUTOMATION: HOLD - the window locks Credit Limit at $0.00 for COD and Credit Hold, so only a save sent outside the window can reach this refusal` |
| S7-05 | A term the app does not recognise is dated exactly as before the release | `AUTOMATION: HOLD - needs the before due date taken on production shortly before the release reaches production; run on production after the release` |
| S7-10 | Changing the invoice date after the customer changed term | `AUTOMATION: HOLD - waiting on the PO (question 7)` |
| S8-11 | AccountingHub and IBS receive the due date only, never the term name | `AUTOMATION: HOLD - what AccountingHub and IBS receive cannot be seen in ShopView; needs access to those systems` |
| S8-12 | Move Customers sends AccountingHub the same update as Edit Customer | `AUTOMATION: HOLD - what AccountingHub receives cannot be seen in ShopView; needs access to AccountingHub` |
| S10-11 | A customer created through the API without a term gets the default | `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` |
| S10-12 | An API term in other capitals saves and reads back in the term's spelling | `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` |
| S10-13 | Updating a term through the API matches spelling, or saves unknown text | `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` |
| S10-14 | A customer created or updated through the API on COD gets a $0 limit | `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` |
| S10-15 | An API update with neither term nor limit keeps the stored limit | `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` |
| S10-16 | The Public API has no way to list terms or the default | `AUTOMATION: HOLD - the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request` |
| S11-02 | No existing customer, vendor or invoice changes at release | `AUTOMATION: HOLD - needs the before values taken on production shortly before the release reaches production; run on production after the release` |
| S11-04 | At release all twelve standard terms are active and the shop has none of its own | `AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records (the shared test site holds other terms and customers)` |
| S11-07 | An existing COD customer keeps its old limit on release day | `AUTOMATION: HOLD - needs the before values taken on production shortly before the release reaches production; run on production after the release` |
| S11-10 | A new organization created after the release starts on Due on Receipt | `AUTOMATION: HOLD - needs an organization created after the release; how a tester gets a new organization on the test site is to be confirmed with the QA lead` |
| S11-11 | An organization with no settings record behaves as COD | `AUTOMATION: HOLD - a tester cannot make or recognise an organization with no settings record` |
| S11-14 | Nothing is re-sent to QuickBooks at release | `AUTOMATION: HOLD - needs the before values taken on production shortly before the release reaches production; run on production after the release` |
| S11-20 | Other screens showing a customer's term: plain name or (Inactive) | `AUTOMATION: HOLD - waiting on the PO (question 4)` |
| S12-16 | An untouched log on release day shows its empty state | `AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records (the shared test site holds other terms and customers)` |
| S12-18 | The log is refused by the server without Settings Finance | `AUTOMATION: HOLD - without Settings Finance the page and its menu cannot be reached, so only a request sent outside the page can reach this refusal` |
| S12-19 | If the log cannot load, it says so and the page is unaffected | `AUTOMATION: HOLD - a manual tester cannot make the log fail to load on demand` |
| D-50 | Design: Due on Receipt info tooltip reads as designed | `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 8)` |
| D-51 | Design: Empty Inactive tab keeps the column headings | `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 9)` |
| D-52 | Design: No blue line while the name is not allowed | `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 10)` |
| D-53 | Design: Name error shows after clicking in and out | `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 11)` |

Every other case carries `AUTOMATION: HOLD - not yet build-verified (no build yet)` (the pattern's default while no build exists). The six Public API cases (S10-11 to S10-16) would be READY once the request is documented.

## 5. Story-vs-PRD differences
- None in substance. All 211 requirement lines in SV-11670 … SV-11681 are word for word PRD v3 (script check, markdown marks removed). The S2-R1 and S12-R3 tables are bullet lists in the stories with the same cells.
- Context and Acceptance Criteria add nothing the PRD lacks; the S4 acceptance criterion gives the note's limit format "$500.00" (used in S4-13, quoted). The stories' PRD link points at the draft (resumedraft.action?draftId=963346440) and calls it "Default Credit Terms PRD"; the live page is "Credit terms" v3. Noted, nothing held.

## 6. Rule 4 (API placement)
The 6 Public API cases (S10-11, S10-12, S10-13, S10-14, S10-15, S10-16) are in S10. TestRail section 91464 is titled "S10 — Imports and Public API" (coordinator, 23 Oct 2026), so Rule 4 is satisfied and they stay there.

## 7. Gates (`python3 authoring/build.py`)
Title ≤ 80 and no semicolon; steps = results, each "Step N:"; no step with two UI actions (heuristic, plus each step read by hand); placeholders defined and named name-hyphen-letter/number; every quote verbatim in PRD v3 or the saved stories; every code and named item covered or not testable with a reason; every User Feedback Summary message used word for word in a step or result; one AUTOMATION line, last; From: line per document, build line, References from Design block. Result: 0 PROBLEM lines. Over the ~10-step target: DATA-24 (14 steps; kept whole: each count depends on the action before it, Rule 136).

## 8. Reading coverage (Rule 119)
| File | Size | Lines read | Coverage |
|---|---|---|---|
| sources/CONFLUENCE-963346440-v3-2026-10-23.md | 119,191 bytes, 1,075 lines | 1–1075 | 100% |
| sources/JIRA-SV-11638-stories-2026-10-23.md | 82,576 bytes, 811 lines | 1–811 (211 requirement lines by script against the PRD, the rest by eye) | 100% |
| build/sv9087-credit-term-2026-08-27/FINDINGS.md | 9,034 bytes | whole | 100% |
| build/sv8815-customer-credit-2026-08-20/FINDINGS.md | 13,848 bytes | first 120 lines (customer credit memo path; the rest is tax-rounding detail, not credit terms) | partial, facts only |
| build/APP-ACTIONS-PLAYBOOK.md | 279,203 bytes | §G, §H, Navigation Map, Invoicing, Customers/Vendors, Roles/Staff, Settings sub-toggles (targeted, Rule 88) | targeted |
| Rules and skills (brief list) | — | LESSONS-REGISTER L-01–L-09; Rule 4; Rules 96, 113, 114, 116, 117 (all amendments), 122, 129, 130, 132, 134, 135, 136; IDEAL-TEST-CASE-STANDARD; skills 17 and 07; TOKEN-DISCIPLINE-CHARTER | 100% |

## 9. Fix round, 23 Oct 2026 (coordinator review)
| Change | Cases | Why |
|---|---|---|
| Item 1 (a), fresh shop term per case | S4-01, S4-04, S4-05, S4-08, S4-12, S4-13, S4-16, S4-20, S4-34 (three customers on {Term-A}, 15 days); S4-09, S4-10, S4-14, S4-17, S4-18, S4-19, S4-29, S4-31, S4-32, S4-33, S7-01c, S8-06, S8-12, S12-09, DATA-25, DATA-26 ({Term-A}, 20 days); DATA-26b ({Term-A}, 45 days); S4-35 (deactivated {Term-A}, 60 days); S1-06, S1-07, S1-19 (new terms with 1/2/3 holders or none) | a standard term on the shared site holds other people's customers, so "exactly N on Net 15/20/45" could not be reached; the behaviour does not depend on the term being standard |
| Item 1 (b), standard term kept, relative counts or Select None + search | S2-03, S2-07 ("at least one customer", Move Customers available), S2-22 and DATA-24 ({Count-A}/{Count-B} tab counts), S4-08 (Net 30 {Count-A} + 3), S4-25 (Credit Hold: Select None, search, tick), S11-09 (COD → Credit Hold with Select None, search, tick) | the case must use that standard term; counts and selections are stated so a tester can reach them |
| Item 1 (c), clean organization | S1-23, S1-25, S11-04, S12-16 (`AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records ...`; setup recipe P-CLEAN) | an empty Inactive tab, every term deactivated, exactly the twelve standard terms, an empty log: none can be reached on a shared site without touching other sessions' data |
| Item 2, shared site lists | S1-03, S1-04, S1-05, S1-08, S4-06, S5-02, S6-01 | other sessions' shop terms also appear in lists, so the results now check the order of the named rows rather than an exact full list |
| Item 2, start screen and other-screen checks | S9-03 (starts on Parts, Part Sales), S4-14 (limit checked on the customer page in its own step), S5-07, S5-08 (customer page in its own step), S7-06 (printed invoice in its own step), S8-09 (QuickBooks invoice in its own step), S11-01 (default proven by the log, not by "nobody used the page") | a result checked something not on the screen of its step, or the starting screen did not match step 1 |
| Item 2, S11-09 content | S11-09 | S11-R17 is about an existing COD or Credit Hold customer with an old limit; the case moved a Net customer and now moves an old-limit COD customer to Credit Hold |
| Item 2, trivial results (all cases) | every case (ct_lib.visible) | results that only restated the action ("the name is typed", "Net 45 is chosen", "the toast shows") now say what the tester sees |
| Item 3, design hook | ct_lib.design_block, build.py | DREFS from design_refs.py fills References from Design; cases_design.py is imported; design gates added (title "Design: ", a picture per design case, every picture exists in design-2026-10-23/images/) |
Every touched case was rewritten top to bottom (title, preconditions, steps, results, quotes unchanged as the sources did not change, setup recipe regenerated).

## OUTSTANDING — what I need from you
| What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|
| Tech plan | QA lead (engineering) | A full pass over every case (Rule 134); the Public API request details | 23 Oct 2026 |
| Public API documentation (request addresses and fields) | QA lead / developers | S10-11 to S10-16 stay held | 23 Oct 2026 |
| How a tester gets an organization created after the release, and one with no settings record | QA lead | S11-10, S11-11 | 23 Oct 2026 |
| Access to what AccountingHub and IBS receive | QA lead | S8-11, S8-12 | 23 Oct 2026 |
| Records and screenshots captured before the release reaches the test site | QA (us, once a date is known) | S7-05, S11-02, S11-07, S11-14 | 23 Oct 2026 |
| A QA branch for SV-11638 | developers | every case's build check | 23 Oct 2026 |
| Which organization the clean-organization cases run on (only this suite's records) | QA lead | S1-23, S1-25, S11-04, S12-16 | 23 Oct 2026 |

**Waiting on the PO:** Chris Ward's Credit terms questions 1 to 7 are drafted in `PO-QUESTIONS-DRAFT.md` and NOT sent yet; question 3 holds S2-36; question 4 holds S11-20; question 5 holds S4-35; question 6 holds S4-36; question 7 holds S7-10; question 8 holds D-50; question 9 holds D-51; question 10 holds D-52; question 11 holds D-53.
