# PROJECT-STATE — Digital Inspections V2

**⚠️ Assigned under the header "Simple Flow V2" but is Digital Inspections V2** (epic SV-8181, PRD 768507905). Flag if wrong.

## Identity
- **Epic:** SV-8181 (PM Milos Vasic) · **PO:** Milos Vasic · **Spec:** Confluence 768507905 live **v18**
- **Design:** Claude 'Digital Inspections V2' 0c2be389 + DVI-V2 bundle (intake-2026-08-21/sources/)
- **QA env:** sv8181.qa.shopview.com — **DO NOT TOUCH** (QA lead) → treated as no-build, Rule-85
- **Case source:** build/digital-inspections-v2/cases/ · prefix **DINV** (DINV-<AREA>-NN)
- **TestRail target:** UNCONFIRMED — proposed new "Digital Inspections V2" section, suite 1
- Extends the released Digital Inspections; behind the existing DI feature flag.

## Scope (spec v18): 14 in-scope stories
Capture: S1 note, S17 photo, S8 per-axle, S11 reference file · Build: S2 turn-to-lines, S3/S4/S6 entry points, S7 provenance, S15 ShopCoach drafting · History: S5 asset Inspections tab · Authoring/output: S12 builder, S13 report, S14 phone.
OUT OF SCOPE: S9 conditional follow-ups, S10 acknowledgement, S16 line-builder-from-WO (S15-N5).

## Status — 2026-08-21
- INTAKE COMPLETE (5/7). Authoring in progress. Rule-85 source-verified-only. NO TestRail/Jira writes. QA branch untouched.

## How to resume
1. git fetch + merge --ff-only; claim lock. 2. Read intake-2026-08-21/{INTAKE,SOURCE-CURRENCY}; cases/; coverage-matrix.md. 3. On QA-branch go-ahead: build-verify sync lifts markers.
