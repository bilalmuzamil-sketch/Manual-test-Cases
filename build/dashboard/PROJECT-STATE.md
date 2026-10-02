# PROJECT-STATE — Dashboard
## Identity
- TestRail group **12166 "Dashboard (Sep 2026)"**, suite 1, 14 sections (S1–S12 + NF + DATA).
  **64 cases (live, re-derived 2026-10-02): 56 ours MANUAL · 5 ours AUTOMATED · 3 Vladimir's.**
  (Earlier note said 62/54 — that was a stale count; the live census found 64, incl. 2 newer cases C204097/C204098.)
- Build-verify env: QA branch **sv490.qa.shopview.com/dashboard** · API sv490api · build **v26.39.1-09be696**.
  Access: 3 cookies → /tmp/cln/sv490-cookies.json (ephemeral). Routes/glossary: NAVIGATION-MAP.md / OBSERVED-UI-LABELS-sv490.md.

## Status — 2026-10-02 · FULL RE-VERIFICATION COMPLETE (all 64 cases)
### Scope rule applied this pass (QA lead, 2026-10-02):
"Include Vlad's cases in Build verification too; only don't touch cases created by someone else; tell me of any
change to Vlad's automated cases so I can update Vlad." → This OVERRIDES the standing Rule-38 "never touch
Vlad's cases" hold for build-verification (surfaced to the QA lead, Rule 63). No foreign authors exist in this group.

### What the re-verification found and fixed (ALL 61 ours = 56 manual + 5 automated):
- **STALE BRANCH HOST in every one of the 61 ours cases.** Preconditions hardcoded a dead QA branch
  "sv8311.qa.shopview.com" (and the 5 automated also carried "...on the sv8311 QA build" inside their HOLD marker).
  The first pass had stamped the build date but left this wrong host. Fixed: removed the parenthetical →
  branch-agnostic "on the build under test" (C88631's "(sv8311, …)" → "(…)"); the marker flip cleared the 5 in-marker refs.
- **Stamp**: all 61 now carry *"Last checked against build v26.39.1-09be696 on 10/2/2026."* (4 manual
  C88595/C88596/C204097/C204098 were previously un-stamped; now stamped.)
- **Marker**: all 61 now **AUTOMATION: READY** (the 5 automated flipped HOLD→READY this pass).
- **Substance frozen**: every Expected unchanged in substance (token-level guard); only glossary/host/stamp/marker touched.
- **Live verify (TestRail, all 61):** sv8311 remaining 0 · missing stamp 0 · not READY 0 · still HOLD 0 · all created_by=3.
- **Served render:** fr-view 61/61 clean (served-page container scan).

### Automated cases (5 ours — C88594, C88609, C88612, C88617, C88623):
- NOW build-verified under the QA lead's 2026-10-02 instruction (previously HELD under Rule 71). Changed exactly like
  the manual cases: host removed, stamped, HOLD→READY. custom_atmstatus left = 3 (TestRail automation status untouched).
- **REPORT TO QA LEAD so he can alert the team:** these 5 automated cases were edited this pass.

### Vladimir's cases (3 — C137997, C137998, C137999):
- Build-verified against sv490 and found **build-accurate — LEFT UNCHANGED (no edits).** They are automated E2E
  specs (template "Steps", storage-state / API-seeded preconditions); converting them to layman manual cases would
  destroy their purpose, which is NOT build-verification. Their labels/paths (Reports → Technician Efficiency,
  chart above the tabs, "This Month" date filter, "No data for selected date range", Dashboard landing, Work Orders)
  were all confirmed live and match the build. **Nothing changed ⇒ nothing for Vlad to be told about on these 3.**

### Screens observed live this pass (closes earlier residuals):
- Reports landing + left rail (all report entries) — reverify-2026-10-02/reports-landing.png
- Technician Efficiency report (/reports/technician-efficiency): embedded chart above Invoiced/Completed tabs,
  "Date: This month" filter, "⋯" more-actions + "Hide Chart", "No data for selected date range" — report-technician-efficiency.png
- Service Advisor Analysis (/reports/service-advisor-analysis): page heading "Service Advisor Analysis" (rail label
  "Advisor Analysis"); confirms C204098's wording is build-accurate — report-advisor-analysis.png

### Residual (run session confirms live — not blockers):
- Chart hover tooltips (ELR on hover, C88622) · deselect-all-hides-chart interaction (C88620) · the 200%/axis
  scaling with live data (C88621/C204097) · per-tile circuit-breaker behaviour under load (C88631). Entry points and
  glossary are confirmed; these need live data/interaction a tester drives.

- Run hand-off: RUN-HANDOFF-DASHBOARD-2026-10-02.md (updated to 61 READY).
