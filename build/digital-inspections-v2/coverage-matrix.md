# Coverage Matrix — Digital Inspections V2 (spec v18)

**Re-derived 2026-08-21 from spec v18 (14 in-scope stories) and the 43 authored cases, BOTH directions. No C-IDs yet.**

| Story | Title | Verdict | Covered by |
|---|---|---|---|
| S1 | Require a note on flagged responses | covered | DINV-CAP-01, DINV-CAP-02, DINV-CAP-03 |
| S2 | Turn findings into work order lines | covered | DINV-BLD-01, DINV-BLD-02, DINV-BLD-03, DINV-BLD-04, DINV-BLD-05 |
| S3 | Build from a completed inspection | covered | DINV-BLD-06, DINV-BLD-07 |
| S4 | Build from the inspection note on a work order | covered | DINV-BLD-08, DINV-BLD-09 |
| S5 | Inspection history on the asset record | covered | DINV-HIST-01, DINV-HIST-02, DINV-HIST-03, DINV-HIST-04 |
| S6 | Build from the asset Inspections tab | covered | DINV-BLD-10, DINV-BLD-11 |
| S7 | Record where the lines came from | covered | DINV-BLD-12 |
| S8 | Record measurements per axle | covered | DINV-CAP-06, DINV-CAP-07, DINV-CAP-08, DINV-CAP-09, DINV-CAP-10, DINV-CAP-11, DINV-CAP-12 |
| S11 | Attach a reference file to a question | covered | DINV-CAP-13, DINV-CAP-14 |
| S12 | Template builder authoring | covered | DINV-AUTH-01, DINV-AUTH-02, DINV-AUTH-03, DINV-AUTH-04, DINV-AUTH-05 |
| S13 | Customer-facing inspection report | covered | DINV-RPT-01, DINV-RPT-02 |
| S14 | Inspection filling on a phone | covered | DINV-PHONE-01, DINV-PHONE-02 |
| S15 | Draft the lines with ShopCoach | covered | DINV-BLD-13, DINV-BLD-14, DINV-BLD-15, DINV-BLD-16 |
| S17 | Require a photo on a Not OK response | covered | DINV-CAP-04, DINV-CAP-05 |

## Reconciliation
- In-scope stories: **14** · covered: **14** · UNCOVERED: none
- Cases: **43** · every case anchor resolves to an in-scope story: **YES**
- Rule-level: 275 distinct S#-R#/N#/E# IDs; each in-scope story's R-rules and key N/E cases are covered by clustered cases (see each case's refs for the exact anchors).
- Out of scope (correctly no cases): S9 conditional follow-ups, S10 acknowledgement, S16 line-builder-from-WO (S15-N5); SPIKE SV-9112 is a dev spike, not a testable story.
- **HELD:** DINV-AUTH-02 (S12-R4 drum/disc vs fill-time Key Decision — spec Open item 11 / PO-DI-1).