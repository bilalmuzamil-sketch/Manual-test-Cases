# Dashboard — Build Verification Foundation
## Env: QA branch sv490.qa.shopview.com/dashboard · build v26.39.1-09be696 · started 2026-10-02

## Scope (live, Rule 100)
- TestRail group **12166 "Dashboard (Sep 2026)"**, suite 1, 14 sections (S1 Access · S2 One Fixed Layout ·
  S3 Measure Formulas/Report Parity · S4 KPI Hero Tiles · S5 Count Tiles · S6 Expanding a Tile · S7 Per-Tile
  Date Ranges · S8 Chart Filters · S9 Chart Behavior · S10 Report Drill-In · S11 Chart on Report Page ·
  S12 Visual Conformance · NF Non-Functional/Tech Plan · DATA Accuracy/Report Parity).
- **62 cases total: 54 ours MANUAL (build-verify) · 5 ours AUTOMATED (HOLD, Rule 71, no go-ahead) · 3 Vladimir's
  (user 1, HANDS-OFF, Rule 38).**
  - Automated held: C88594, C88609, C88612, C88617, C88623.
  - Vladimir (never touch): C137997, C137998, C137999.

## The job (QA lead, 2026-10-02) — "do not stray from the standards"
Build-verify the 54 manual on sv490: glossary from the build · UI paths from the build · preconditions/steps
runnable by a layman · Expected layman-understandable using the build glossary (SUBSTANCE stays the spec's,
Rule 114). After verifying, flip marker to AUTOMATION: READY. Build-verification lane only.

## Access
- App https://sv490.qa.shopview.com · API https://sv490api.qa.shopview.com (fe-perms 200 confirmed).
- Cookies (3) → /tmp/cln/sv490-cookies.json (chmod 600, NEVER committed). Boot: qa-branch-boot.mjs sv490 <route> admin.
  Chrome-131 UA; NODE_USE_ENV_PROXY=1; bridge via ensure_bridge.sh. TestRail API rate-limits bursts (HTTP 400).

## Standing holds
No Jira/external artefact; Vladimir's 3 never touched; 5 automated held (Rule 71) unless QA-lead go-ahead;
secrets never committed; QA branch disposable (Rule 6/107). NEVER idle-wait (stop only on a question or full completion).
