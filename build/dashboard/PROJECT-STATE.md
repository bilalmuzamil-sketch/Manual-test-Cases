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

## Status — 2026-10-05 · MANUAL-TESTER CLARITY PASS (Rule 115, new)
Trigger: the manual tester (Nebojsa Glavinic) reported Dashboard cases he could not understand or run.
QA lead made it a standing rule (115): this lane's definition of done is a case that is build-verified AND
layman-understandable AND hand-runnable — the authoring session creates, this lane makes them runnable.
- Checked all 61 ours cases (none edited by Nebojsa yet — all still show the 10/2 shared-account edit, so all eligible).
- New gate `build/testing-tools/check_tester_runnable.py` flagged **4** cases; the other 57 passed.
- Fixed (jargon → on-screen words; meaning unchanged; Source quotes intact; fr-view clean):
  - **C88594** — removed "API" from the precondition.
  - **C88595** — removed reportsPageAccess / endpoint / authorization-failure; kept the manual gate check; the
    server-enforcement line now reads as the automated check, not a manual step.
  - **C88630** — removed "server-side"; plain wording for the At Risk 12-month figure.
  - **C88631** — performance budget / circuit breaker is NOT hand-testable; re-marked
    `AUTOMATION: HOLD - not manually testable (developer/automated check only)`, NOT READY. Its user-visible
    half (one tile fails, others load) is covered by the Section 6 loading/failure case.
- Result: all 61 pass `check_tester_runnable.py`; run hand-off now 55 manual + 5 automated runnable + C88631 held.
- The 5 automated (C88594 among them) remain `custom_atmstatus=3`; C88594 was edited this pass → in the "tell Vlad" set.

## 2026-10-09 — "Refine tests" pass (QA lead's one-time request; skill 21) — 90 cases
- 88 eligible + pilots C88633/C88615 rewritten: Preconditions ("what must be true") + Setup ("For N: path only"), Steps count unchanged, Expected unchanged except made-up names (QA lead: "Correct them") — C88638, C88639, C88640, C88641, C351721, C351723, C351724, C351734, C351735. Markers and build stamps unchanged (byte-compared live).
- Setup routes seen on sv490 this pass: `OBSERVED-UI-LABELS-sv490.md` § SETUP SCREENS (location via profile icon > Change Location — L0056; Create Work Order dialog; New Line form; Story/Update; Complete / Missing Details / Mark Reviewed; Create Invoice / New Customer Payment; Reverse / Issue Credit; Start/Stop/Clock Out; labor rates $100 EVR Travel to EVO, $150 Calgary Transit Rate; quiet location 0 % shop supplies).
- Automated cases changed with QA lead OK (tell Vlad): C88594, C88609, C88612, C88617, C88623.
- Gates (final, 90 cases): runnable 90/90 · served fr-view 90/90 · labels ALL CLEAR · tester: C88631 only — "250 ms" in its Expected (not changeable).
- Data gaps on sv490 (reported, cases say "mark Blocked" honestly): no location shows invoices this month at Staging Heavy Duty - 9919 (history runs to Aug 2026); ZZAUTOTEST Dashboard Quiet had 7 invoices today (2026-10-09, Ayesha Khan / Admin ShopView) so it is not quiet this week.
- Not walked (kept from the cases' own wording): accepting a new staff member's invitation; ordering/receiving a part; the Issue Credit window's fields; editing a timesheet record; New Inventory Part; walk-in Part Sale.
- Test data left on sv490 (location 9919, customer 4 Star Truck Repair, ZZAUTOTEST lines): S490-17644 (invoiced, unpaid) · S490-17645 (estimate, ~1 min clocked by Tech ShopView).
- **Manual QA tester for the Dashboard suite: Ayesha (QA lead, 2026-10-09)** — on sv490 her staff record is "Ayesha Khan" (Admin, location ZZAUTOTEST Dashboard Quiet); the 7 cases last edited in TestRail by user 2 are Nebojsa Glavinic's edits, not hers. QA lead: *"I want the tests to be in runnable state for her or else she would fail and the blame would be on me."*
- Still carrying the wrong location wording ("workplace selector" / "ShopHub" / "QA Testing") after the refine pass, because they were held: C88595, C88596, C88597, C88598, C88599, C88600 (Automated, last edited by Nebojsa) and C88618 (last edited by Nebojsa). Vladimir's 5 (C137997, C137998, C137999, C433976, C327128) never touched.
- **2026-10-09 (later, QA lead YES to all three):** (1) 6 held cases rewritten — C88595, C88596, C88597, C88598, C88599, C88600 (5 Automated + C88596 Automated; tell Vlad). C88618 NOT changed: Nebojsa edited it in TestRail at 09:26 UTC today after our read (no text field changed) — left alone, still has old location wording. (2) 13 quiet-location cases now create a fresh location per run, add their own $100/$150 labor rate there, and use Admin ShopView as Technician 1 (clocks in one browser); internal-time cases (C88641, C88646, C88652) and C88640's Technician 2 create a test technician in that location (invitation). (3) 'this month' — C88604, C88607, C88612, C88614, C88616, C88627, C88628 now need last-12-months data only; C88601 needs one day this month (setup creates it); C88606 keeps its gap-day condition for the last check only.
- Final gates 2026-10-09 over 96 touched cases: runnable 96/96 · labels ALL CLEAR · tester: only C88631 ("250 ms" in its Expected) · Expected byte-identical 87, name-only 9, markers/stamps unchanged.
- Test data left on sv490 (not to be cleaned — QA lead): location "ZZAUTOTEST Quiet Check 1009" with labor rate "ZZAUTOTEST Rate 100" and work order S-17646 (one line, Admin ShopView, ~1 min clocked).
