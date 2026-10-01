# Founder Mode → Part Sales — Build Verification Foundation
## Env: QA branch sv9667.qa.shopview.com · build v26.39.2-210868d · started 2026-10-01

## Scope (live, Rule 100)
- TestRail group **20435 "Part Sales"** under group 20434 "Founder Mode (September 2026)", suite 1.
- **57 cases, all ours (created_by=3), 0 foreign, 0 automated.** Sections: 20440 S1 Return a core · 20441 S3
  Change the tax rate · 20442 S4 Audit log & menu order · 20443 S5 Sales representative · 20444 S6 Actions
  column layout · 20445 S7 Labels & tab bar · 20446 S8 Take a deposit · 20447 DATA Numeric & money accuracy.

## The job (QA lead, 2026-10-01)
Build-verify all 57 on sv9667: glossary everywhere from the build · UI paths from the build · preconditions/
steps runnable by a layman/manual QA · Expected layman-understandable using the build glossary (SUBSTANCE stays
the spec's, Rule 114). After verifying, flip marker to **AUTOMATION: READY**. Build-verification lane only.

## Access
- App https://sv9667.qa.shopview.com · API https://sv9667api.qa.shopview.com (fe-permissions 200 confirmed).
- Cookies (sv_sso_session + PHPSESSID + cf_clearance) in /tmp/cln/sv9667-cookies.json (chmod 600, NEVER committed).
  Boot: `qa-branch-boot.mjs sv9667 <route> admin`; Chrome-131 UA; node fetch NODE_USE_ENV_PROXY=1.
- TestRail API rate-limits rapid bursts (HTTP 400) — page reads in small paced batches.

## Standing holds + rules
No Jira/external artefact; no TestRail writes to foreign cases; secrets never committed; QA branch disposable
(Rule 6/107 — tag ZZAUTOTEST, restore). NEVER idle-wait (stop only on a question or full completion).
