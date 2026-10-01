# DVI V2 (Digital Inspection V2) — Build Verification Foundation
## Env: QA branch sv8181.qa.shopview.com · build v26.36.8-2a64085 · started 2026-10-01

## Scope (live, Rule 100)
- TestRail group **6658** "Digital Inspection V2 (Aug 2026)", suite 1, parent 3559.
- **91 cases, all ours (created_by=3), 0 foreign, 0 automated.** Subsections:
  12150 S1 note-on-flag · 12151 S17 photo-on-NotOK · 12152 S2 findings->WO lines · 12153 S3 build-from-completed ·
  12154 S4 build-from-WO-note · 12155 S5 asset inspection history · 12156 S6 build-from-asset-tab ·
  12157 S7 record line source · 12158 S15 draft-with-ShopCoach · 12159 S8 per-axle measurements ·
  12160 S11 reference file on question · 12161 S12 template builder · 12162 S13 customer report ·
  12163 S14 phone filling · 12164 S18 mark scope OK · 12165 S19 conditional follow-up · 20448 TP tech-plan.

## The job (QA lead, 2026-10-01)
Build-verify all 91 against sv8181: **glossary everywhere from the build**, **UI paths from the build**,
**preconditions/steps runnable by a layman/manual QA**, **expected behavior layman-understandable using the
build glossary**. Expected SUBSTANCE stays the source's (spec) — only wording/glossary is build-aligned (Rule 114).
**After verifying, flip the marker to AUTOMATION: READY.** Build-verification lane only (no pass/fail runs).

## Access
- App https://sv8181.qa.shopview.com · API https://sv8181api.qa.shopview.com (fe-permissions 200 confirmed).
- Cookies (sv_sso_session + PHPSESSID + cf_clearance) in /tmp/cln/sv8181-cookies.json (chmod 600, NEVER committed).
- Browser: qa-branch-boot.mjs / boot pattern; node fetch NODE_USE_ENV_PROXY=1; Chrome-131 UA (cf_clearance UA-bound).
- TestRail API rate-limits rapid bursts (HTTP 400) — page reads in small paced batches.

## Standing holds
No Jira/external artefact; no TestRail writes to foreign/Vladimir's cases; Automated cases need QA-lead go-ahead
(none here); secrets never committed; QA branch is disposable (Rule 6/107 — tag ZZAUTOTEST, restore).
