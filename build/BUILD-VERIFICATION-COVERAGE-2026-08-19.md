# BUILD-VERIFICATION COVERAGE — per project (2026-08-19, FINAL)

**Docs-only consolidation.** Every figure below is drawn from committed artifacts under
`build/report-suite/build-verify-2026-08-18/`, `build/report-suite/wip-reconciliation-2026-08-19/`,
`build/schedule/build-verify-2026-08-18/` (incl. `schedule-recheck-2026-08-19/`) and
`build/filters/build-verify-2026-08-19/`. No staging, TestRail, Jira or cookies were touched producing
this file (Standing Rules 6/62).

**Honest phrasing (Standing Rule 10, 2026-08-11 amendment; Rule 67):** a case counted "build-verified"
below is **source-verified and build-accurate in its preconditions, steps, navigation and labels — the
pass/fail behaviour verdict belongs to the manual tester.** "VIU complete" is deliberately NOT said.

**Builds under test (all same-minor `v3.8`, so no pass is stale-making — Rule 60):**
- **Report Suite re-verify sweep:** SBC `v3.8-da72171` (redeployed to `v3.8-b7d80dc` mid-pass) · SBR
  `v3.8-b7d80dc` · PV / TU / WIP / IV / WIP-reconciliation `v3.8-d0e135e` (last-mod Wed 19 Aug 2026
  13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`).
- **Schedule build-verify A/B/C:** `v3.8-bd246fd` → `v3.8-da72171` (bug-fix redeploy mid-run).
- **Schedule re-check (Stefan V's deploy) — ✅ NOW DONE:** `v3.8-d0e135e` (last-mod Wed 19 Aug 2026
  13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`) — session was alive; **94 cases re-driven live
  and re-stamped**, Priority-filter fix applied, all 4 Schedule defects re-confirmed still reproducing.
- **Filters build-verify:** `v3.8-d0e135e` (same marker) — **COMPLETE**, 119 cases written.

**⇒ ALL THREE PROJECTS' BUILD-VERIFICATION IS DONE. One small task remains, blocked on fresh cookies:
the Parts-Velocity CSV rule + WIP Story-5 spec-delta reconciliation (~15 cases).**

---

## ⭐ WHAT YOU NEED TO DO (action-first — Standing Rule 70)

| # | Action for YOU | Plain reason | Priority |
|---|---|---|---|
| 1 | **Supply ONE fresh staging session cookie set** — `sv_sso_session` + `PHPSESSID` for `api.staging.shopview.com` (drop into `/tmp/staging-cookie.txt`; `cf_clearance` in hand is still valid). | **The ONLY staging item left is the Parts-Velocity CSV rule + WIP Story-5 spec-delta reconciliation (~15 cases)** — it needs a live re-check and runs verbatim the moment cookies land. Staging sessions die on every deploy, which is why cookies keep expiring. | **HIGH** |
| 2 | **Lift the Jira-creation hold** so the flagged defects can be reopened/refiled. | 26 closed-but-still-reproducing Report Suite defects (+1 new deviation) + the 4 Schedule defects (all re-confirmed still reproducing on Stefan's build) have no live ticket a tester can point at. | HIGH |
| 3 | **Ratify the Automated (atm=3) held cases + give the flagged-defect go-ahead.** | **81 Automated cases** (Report Suite 71 + Schedule 5 + Filters 5) are HELD unwritten (Rule 71, ask-first — they are Vladimir Tomovic's automation contract). | MED |
| 4 | **Fix / demark the interim `<br>` cleanup debt** once the TestRail `update_case` markdown-wrap regression is resolved. | The whole Report Suite sweep (166 + 13 WIP-recon), the 94 Schedule re-check writes and all 119 Filters writes were written with literal `<br>` line breaks because `update_case` now HTML-wraps markdown. Renders correctly; a formatting-only demark is owed later. | MED |
| 5 | **Answer Chris Ward's 2 remaining PO questions** (invoice link-vs-plain-text · PV Location-column position). WIP tab-placement + WIP aging are now RESOLVED. | Document-vs-document conflicts we will not resolve from the build (Rules 32/57/58). | MED |
| 6 | **Decide the 2 Filters empty-state deviations** (DEV-1 generic empty message · DEV-2 "Clear filters" recovery). | File a defect (post creation-hold) or scope the cases down — a QA-lead call. | MED |
| 7 | **Supply a 2nd non-admin (single-location) test sign-in** (or rule to skip the negatives). | ~20 permission-negative / one-location cases (all three projects) can't be driven with one admin cookie without rotating the shared session. | MED |
| 8 | **Export the live WIP Confluence page (v24)** — Chris pinned it but it is SSO-walled to this session. | The local WIP baseline is v22; the v24 page body is owed so the spec mirror can catch up (behaviour already applied from Chris's rulings). | LOW |

---

## THE COVERAGE TABLE

**"Build-verified"** = the case is **source-verified & build-accurate** and carries a **fresh `v3.8`
build-check stamp** (labels/steps/navigation compared against the current build, Rule-54 sentence-2
stamped). **"Held / not re-stamped"** = **Automated (`custom_atmstatus = 3`)** cases held unwritten for
Vlad (Rule 71). Genuine feature-absent / PO-question / unseedable HOLDs are *inside* the build-verified
count (they were driven/characterised live and stamped) and are called out in the notes column. Totals
reconcile per project.

| Project / area | Total (ours) | Build-verified | Held atm=3 (for Vlad) | Notes — residual HOLDs inside "build-verified", + what's left |
|---|---|---|---|---|
| **REPORT SUITE (epic SV-8582)** | **508** | **437** | **71** | Re-verify sweep COMPLETE across all 6 reports (166 cases written interim `<br>` on `v3.8` builds) **+** WIP v24 reconciliation (13 cases, S11-R7 live-confirmed). The old "157 not-verified" backlog is CLOSED. Residual inside 437: genuine feature-absent + PO-question + unseedable HOLDs (itemised per report) + the interim-`<br>` cleanup debt. **PENDING (blocked on cookies, ~15 cases): the Parts-Velocity CSV number-format rule (RS-PV-1) + WIP Story-5 Summary-Strip design adoption (RS-WIP-8) — the ONE staging item left across all projects.** |
| — Sales By Customer (SBC) | 96 | 86 | 10 | 8/18 stamped 50 + sweep-written 36 (29 READY: incl. 4 newly driven live — C30132 reverse-invoice exclusion, C30137 duplicate-label, C30101 location-access via Parts-Manager impersonation, C43550 Location-not-a-toggle). Residual HOLD within: 5 invoice-link PO-question (C30100/30139/30140/30141/C43558), C30131 (build blocks a no-vehicle service WO — create 500), C43553 (broken-logo storage state, not app-seedable). |
| — Sales By Representative (SBR) | 118 | 104 | 14 | 8/18 stamped 47 + sweep-written 57. Residual HOLD within: over-cap Expanded-PDF/API row-cap not reachable at 88 invoices (C30290/C30320 kept EXPECT-FAIL), C30202 (calendar >366-day span not harness-drivable), assignments-CSV BOM endpoint not located. |
| — Parts Velocity (PV) | 72 | 59 | 13 | 8/18 stamped 23 + sweep-written 36 (driven live: C30327 reports-access-alone opens PV via non-admin Technician; C30331 >366-day range rejected HTTP 400; Units Returned C30361/C30362). Residual HOLD within: C30340 (Location-hidden needs a one-location user), C38885/C43547 EXPECT-FAIL (SV-8818 PDF-500, still open). **PENDING: the CSV plain-number rule (RS-PV-1) — ~6 cases, needs live re-check.** |
| — Technician Utilization (TU) | 61 | 52 | 9 | 8/18 stamped 36 + sweep-written 16 (6 READY driven live + 6 HOLD characterised + 4 deferred). Residual HOLD/deferred within: C30407 (em-dash ELL needs a rate-less location), C30446 (Location-filter negative needs a one-location user — positive confirmed live), 4 Total-Hours-**link** cases (link absent from build — feature-ship trigger). |
| — Work In Progress (WIP) | 92 | 78 | 14 | 8/18 stamped 71 + sweep-written 7 + **WIP v24 reconciliation applied Chris's rulings to 13 cases**; **S11-R7 snapshot-read behaviour LIVE-CONFIRMED** (`as_of_date`/`has_snapshot` — the old "nothing reads the snapshot back" note DISPROVEN; C30528 HOLD→READY). Residual within: C30467/C43551 (Location built as a default column but NOT in Column Selection — deviation re-confirmed); multi-state WO seeding for placement cases; permission 2nd-sign-in. **PENDING: Story-5 Summary-Strip design adoption (RS-WIP-8) — ~9 cases, needs live re-check.** |
| — Inventory Value (IV) | 69 | 58 | 11 | 8/18 stamped 44 + sweep-written 14 (8 HOLD + 6 SV-8818 EXPECT-FAIL re-stamped). Residual HOLD within: SV-8818 large-view PDF 500 (C30587/30590/30591/30593/30595/C43548), C30547 (no-category part — parts require a category on this build), C30577 (one-location user — 0 of 19 roster staff single-workplace), server-side nightly-capture rows not reachable from the app (C30605/30606/30607/30609/30610/C38892). |
| **SCHEDULE (epic SV-8685)** | **195** | **190** | **5** | **Build-verify A/B/C COMPLETE** (A 61 + B 65 + C 64 = 190; 5 Automated held: C43811, C38847–C38850) **AND the re-check vs Stefan V's `v3.8-d0e135e` deploy is now DONE:** 94 cases re-driven live and re-stamped, **Priority-filter fix applied** (C29945 re-scoped to a negative READY case, C29942 tweaked, C29946 tidied — Branko's 2026-08-19 ruling), **all 4 defect-sheet items re-confirmed STILL REPRODUCING**, and the **View + Edit/Delete permission tiers observed live** (Rule-74 fallback: `quick-login tech` View tier + admin Edit/Delete tier). What's left inside 190: **15 sections carry prior `v3.8-bd246fd/da72171` stamps** (honest N-of-M, bug-fix redeploy — provisional, DEFERRED-RUN.md); **3 pre-existing raw-markup cases** (C43554, C43806, C43807 — demark owed); **4 residual permission tiers** needing a 2nd non-admin / custom-role (C30076 nav-off, C30078 edit-no-delete, C30081/C30614 WO-dependency); feature-absent deferrals (C30005, C43812, C43813 — trigger = feature ships, not a redeploy). |
| — Batch A (Navigation · Sidebar · Toolbar · Read-display) | 61 | 61 | 0 | Incl. 3 feature-absent, deferred (Rule 69): C30005 shift edge-resize, C43812 day-view zoom, C43813 clipped-block chevron. **C29945 Priority filter was RE-SCOPED (not deferred) to a negative READY case** on Branko's 2026-08-19 ruling to remove Priority from the PRD. |
| — Batch B (Drag-to-create · Scope · Spread · Shift · Reassignment) | 66 | 65 | 1 | 65 written; C43811 Automated held. |
| — Batch C (Events · Conflicts · Capacity · Deletion · Settings · Permissions · API) | 68 | 64 | 4 | 64 written; C38847–C38850 Automated held. **Permissions (§4279): View + Edit/Delete tiers re-confirmed live; 4 residual cells owe a 2nd non-admin / custom role.** |
| — Re-check vs `v3.8-d0e135e` + Priority fix | (subset) | done | — | ✅ DONE. Stefan-changed labels/verdicts re-driven (Month chips, Day hour-axis, new Lucide amber conflict icon, new toolbar placeholder "Search schedule...", SV-9361 WO-number form, SV-9357 90%-zoom edges) — **verdicts unchanged; build-marker re-stamped on 94 cases.** 4 defects re-confirmed reproducing (C30029 amber-not-red, spread-hours block, SV-8870 Month drag, SV-8957 click-to-arm). Priority fix: C29945 re-scoped + C29942 tweaked + C29946 tidied. |
| **FILTERS (epic SV-8785)** | **124** | **119** | **5** | **Build-verify COMPLETE on `v3.8-d0e135e` — the 2-day-waiting tester is UNBLOCKED.** The Fabian app-wide filter redesign (spec v21) is fully present; **119 cases build-verified live + written** (interim `<br>`), 5 Automated held (C38877, C29600, C29614, C29618, C29623). **57 deferred markers lifted to READY; SV-8875 verified FIXED (C29624/C29625 EXPECT-FAIL→READY).** Live marker census: READY 99 · EXPECT-FAIL 5 · HOLD 18 · DEFERRED 2 (= the 2 held Automated) · READY-TO-AUTOMATE 104 · 0 raw markup. Residual: 5 Automated held; **2 empty-state deviations for a QA-lead decision** — DEV-1 (C29607/C38897, generic empty message) + DEV-2 (C29597/C29599, "Clear filters" recovery); XF SV-8832/SV-8912 markers kept (not re-verifiable this pass). Rule-74 §8.5 gate PASS — 0 cases skipped for data/login. |
| **GRAND TOTAL (all 3 projects)** | **827** | **746** | **81** | RS 437 + Schedule 190 + Filters 119 = **746** build-verified. Held atm=3: RS 71 + Schedule 5 + Filters 5 = **81**. 746 + 81 = **827** ✓ (508 + 195 + 124 = 827). |

**Reconciliation (Report Suite):** SBC 86+10=96 · SBR 104+14=118 · PV 59+13=72 · TU 52+9=61 ·
WIP 78+14=92 · IV 58+11=69 · **total 437+71=508 ✓.**
**Reconciliation (Schedule):** A 61 + B 66 + C 68 = 195; build-verified 61+65+64=190, held 0+1+4=5;
190+5=195 ✓.
**Reconciliation (Filters):** build-verified 119 + held 5 = **124 ✓** (ours; 5 foreign Ahtasham cases
HANDS-OFF, Rule 38).

---

## HOW EACH "NOT-YET-CLOSED" REASON GETS RESOLVED (the concrete future path)

| Reason | Cases affected | Path to resolve | Trigger |
|---|---|---|---|
| **PV CSV rule + WIP Story-5 reconciliation** (the ONE staging item left) | ~15 (PV ~6 RS-PV-1 · WIP ~9 RS-WIP-8) | Fresh cookies → live re-check → apply the delta (interim `<br>`) | **QA lead supplies cookies** |
| **Interim `<br>` cleanup debt** | Report Suite 166 sweep + 13 WIP-recon + Schedule 94 re-check + Filters 119 | Formatting-only demark (`build/markup-regression-2026-08-10/demark.py`) | **TestRail `update_case` stores clean markdown again** |
| **Automated (atm=3) held for Vlad** | 81 (RS 71 + Schedule 5 + Filters 5) | Ratify → hand case numbers to Vladimir Tomovic (Rule 65 register) | **QA-lead ratification** (each edit coupled with build-verify) |
| **Feature not found in the build (Rule 69 deferred)** | Schedule 3 (C30005, C43812, C43813) · TU Total-Hours link (4) · SBR WO-rep-assignment UI | Re-check in the separate build-verify run | **The feature shipping** (NOT a redeploy — Rule 49/61) |
| **2nd non-admin (single-location) sign-in** | ~20 (SBC negatives, PV C30340, TU C30446, WIP perm, IV C30577, Schedule 4 permission tiers) | Drive the permission-negative / one-location branch | **QA lead supplies a 2nd non-admin session** (or rules to skip) |
| **Raw-markup demark (Schedule)** | Schedule 3 (C43554, C43806, C43807) | Convert raw `<ol>/<li>` to numbered `<br>` lines (formatting only) | **QA-lead go-ahead for the 3 edits** |
| **Unseedable / server-side data-state** | IV C30547 no-category part + nightly-capture rows, WIP multi-state WO, SBC no-vehicle service WO, TU rate-less location | Seed on a later pass (Rule 14); server-side snapshot rows are not app-reachable | **A seeding pass once a session exists** |
| **PDF-500-blocked (SV-8818, OPEN)** | PV 2, IV 6 (+ SBR 2 over-cap) | Re-run the PDF-content assertions | **SV-8818 fixed** |
| **PO-question (document conflict)** | SBC/SBR invoice link, PV Location column (WIP tab-placement + WIP aging RESOLVED 8/19) | Author/confirm once Chris Ward answers | **PO answer** (Rules 32/57/58) |
| **Empty-state deviations (Filters)** | 2 (DEV-1 C29607/C38897, DEV-2 C29597/C29599) | File post-hold or scope down | **QA-lead decision** |
| **PO page export owed** | WIP spec mirror (v22 local vs v24 live) | Ingest the v24 page body (behaviour already applied from Chris's rulings) | **User exports the SSO-walled page** |

---

## OUTSTANDING — what I need from you
1. **Fresh staging cookies** (action #1) — the ONLY staging item left is the PV CSV rule + WIP Story-5
   reconciliation (~15 cases). Every other build-verification task is DONE.
2. **Lift the Jira-creation hold** — for the 26 flagged Report Suite defects + 1 new deviation + the 4
   Schedule defects (all re-confirmed still reproducing on Stefan's build).
3. **Ratify the 81 Automated (atm=3) held cases** + give the flagged-defect go-ahead.
4. **Fix the TestRail `update_case` markdown-wrap regression** → then the interim-`<br>` cleanup demark.
5. **Chris Ward's 2 remaining PO answers** — invoice link-vs-plain-text, PV Location column.
6. **Decide the 2 Filters empty-state deviations** (DEV-1 / DEV-2).
7. **A 2nd non-admin sign-in** — for the ~20 permission-negative / one-location cases across all projects.
8. **Export the live WIP Confluence page (v24)** — the mirror is behind at v22.

All are logged in `build/OUTSTANDING-ITEMS-REGISTER.md`, and summarised for you in
`build/EXECUTIVE-SUMMARY-2026-08-19.md`. Nothing else is outstanding for the build-verification work itself.
