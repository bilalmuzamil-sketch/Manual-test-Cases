# BUILD-VERIFICATION COVERAGE — per project (2026-08-19)

**Docs-only consolidation.** Every figure below is drawn from committed artifacts under
`build/report-suite/build-verify-2026-08-18/`, `build/report-suite/wip-reconciliation-2026-08-19/`
and `build/schedule/build-verify-2026-08-18/` (incl. `schedule-recheck-2026-08-19/`).
No staging, TestRail, Jira or cookies were touched producing this file (Standing Rules 6/62).

**Honest phrasing (Standing Rule 10, 2026-08-11 amendment; Rule 67):** a case counted "build-verified"
below is **source-verified and build-accurate in its preconditions, steps, navigation and labels — the
pass/fail behaviour verdict belongs to the manual tester.** "VIU complete" is deliberately NOT said.

**Builds under test (all same-minor `v3.8`, so no pass is stale-making — Rule 60):**
- **Report Suite re-verify sweep:** SBC `v3.8-da72171` (redeployed to `v3.8-b7d80dc` mid-pass) · SBR
  `v3.8-b7d80dc` · PV / TU / WIP / IV / WIP-reconciliation `v3.8-d0e135e` (last-mod Wed 19 Aug 2026
  13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`).
- **Schedule build-verify A/B/C:** `v3.8-bd246fd` → `v3.8-da72171` (bug-fix redeploy mid-run).
- **Schedule re-check target (Stefan V's deploy):** `v3.8-d0e135e` — **NOT yet observed (blocked on
  cookies).** Every Schedule verdict currently rests on the earlier build and is PROVISIONAL.

---

## ⭐ WHAT YOU NEED TO DO (action-first — Standing Rule 70)

| # | Action for YOU | Plain reason | Priority |
|---|---|---|---|
| 1 | **Supply fresh staging session cookies** — `sv_sso_session` + `PHPSESSID` for `api.staging.shopview.com` (drop into `/tmp/staging-cookie.txt`; `cf_clearance` in hand is still valid). | This is the ONLY blocker on finishing **Schedule** and starting **Filters**. Stefan V's 13:27 GMT deploy (`v3.8-d0e135e`) killed the session; the Schedule re-check, the Priority-filter fix and the permission-tier residual all resume the moment cookies land. | **HIGH** |
| 2 | **Fix / demark the interim `<br>` cleanup debt** once the TestRail `update_case` markdown-wrap regression is resolved. | The whole Report Suite re-verify sweep (166 cases + 13 WIP-recon) was written with literal `<br>` line breaks because `update_case` now HTML-wraps markdown. Runs correctly; needs a formatting-only demark pass later. | HIGH |
| 3 | **Lift the Jira-creation hold** so the flagged defects can be reopened/refiled. | 26 closed-but-still-reproducing Report Suite defects (+1 new deviation) + the Schedule defect sheet have no live ticket a tester can point at. | HIGH |
| 4 | **Ratify the Automated (atm=3) held cases + give the flagged-defect go-ahead.** | **76 Automated cases** (Report Suite 71 + Schedule 5) are HELD unwritten (Rule 71, ask-first — they are Vladimir Tomovic's automation contract). | MED |
| 5 | **Answer Chris Ward's remaining PO questions** (invoice link-vs-plain-text · PV Location-column position). WIP tab-placement + WIP aging are now RESOLVED. | Document-vs-document conflicts we will not resolve from the build (Rules 32/57/58). | MED |
| 6 | **Supply a 2nd non-admin (single-location) test sign-in** (or rule to skip the negatives). | ~20 permission-negative / one-location cases (both projects) can't be driven with one admin cookie without rotating the shared session. | MED |
| 7 | **Export the live WIP Confluence page (v24)** — Chris pinned it but it is SSO-walled to this session. | The local WIP baseline is v22; the v24 page body is owed so the spec mirror can catch up (behaviour already applied from Chris's rulings). | LOW |

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
| **REPORT SUITE (epic SV-8582)** | **508** | **437** | **71** | Re-verify sweep COMPLETE across all 6 reports (166 cases written interim `<br>` on `v3.8` builds) **+** WIP v24 reconciliation (13 cases, S11-R7 live-confirmed). The old "157 not-verified" backlog is CLOSED. What's left inside 437: genuine feature-absent + PO-question + unseedable HOLDs (itemised per report) + the interim-`<br>` cleanup debt on all 166+13. |
| — Sales By Customer (SBC) | 96 | 86 | 10 | 8/18 stamped 50 + sweep-written 36 (29 READY: incl. 4 newly driven live — C30132 reverse-invoice exclusion, C30137 duplicate-label, C30101 location-access via Parts-Manager impersonation, C43550 Location-not-a-toggle). Residual HOLD within: 5 invoice-link PO-question (C30100/30139/30140/30141/C43558), C30131 (build blocks a no-vehicle service WO — create 500), C43553 (broken-logo storage state, not app-seedable). |
| — Sales By Representative (SBR) | 118 | 104 | 14 | 8/18 stamped 47 + sweep-written 57. Residual HOLD within: over-cap Expanded-PDF/API row-cap not reachable at 88 invoices (C30290/C30320 kept EXPECT-FAIL), C30202 (calendar >366-day span not harness-drivable), assignments-CSV BOM endpoint not located. |
| — Parts Velocity (PV) | 72 | 59 | 13 | 8/18 stamped 23 + sweep-written 36 (driven live: C30327 reports-access-alone opens PV via non-admin Technician; C30331 >366-day range rejected HTTP 400; Units Returned C30361/C30362). Residual HOLD within: C30340 (Location-hidden needs a one-location user), C38885/C43547 EXPECT-FAIL (SV-8818 PDF-500, still open). |
| — Technician Utilization (TU) | 61 | 52 | 9 | 8/18 stamped 36 + sweep-written 16 (6 READY driven live + 6 HOLD characterised + 4 deferred). Residual HOLD/deferred within: C30407 (em-dash ELL needs a rate-less location), C30446 (Location-filter negative needs a one-location user — positive confirmed live), 4 Total-Hours-**link** cases (link absent from build — feature-ship trigger). |
| — Work In Progress (WIP) | 92 | 78 | 14 | 8/18 stamped 71 + sweep-written 7 + **WIP v24 reconciliation applied Chris's rulings to 13 cases**; **S11-R7 snapshot-read behaviour LIVE-CONFIRMED** (`as_of_date`/`has_snapshot` — the old "nothing reads the snapshot back" note DISPROVEN; C30528 HOLD→READY). Residual within: C30467/C43551 (Location built as a default column but NOT in Column Selection — deviation re-confirmed); multi-state WO seeding for placement cases; permission 2nd-sign-in. |
| — Inventory Value (IV) | 69 | 58 | 11 | 8/18 stamped 44 + sweep-written 14 (8 HOLD + 6 SV-8818 EXPECT-FAIL re-stamped). Residual HOLD within: SV-8818 large-view PDF 500 (C30587/30590/30591/30593/30595/C43548), C30547 (no-category part — parts require a category on this build), C30577 (one-location user — 0 of 19 roster staff single-workplace), server-side nightly-capture rows not reachable from the app (C30605/30606/30607/30609/30610/C38892). |
| **SCHEDULE (epic SV-8685)** | **195** | **190** | **5** | **Build-verify A/B/C all COMPLETE on the EARLIER build** (`v3.8-bd246fd`/`da72171`): A 61 + B 65 + C 64 written = 190 (5 Automated held: C43811, C38847–C38850). **⚠️ Re-check vs Stefan V's `v3.8-d0e135e` deploy is PENDING — BLOCKED on dead cookies (STEP 0).** All 190 verdicts rest on the earlier build → PROVISIONAL; layers 1–2 (labels + pass/fail) need re-observation on `v3.8-d0e135e` (Rule 60). |
| — Batch A (Navigation · Sidebar · Toolbar · Read-display) | 61 | 61 | 0 | Incl. **4 feature-absent, deferred** (Rule 69): C29945 Priority filter, C30005 shift edge-resize, C43812 day-view zoom, C43813 clipped-block chevron — re-check when each ships (trigger = feature, not a redeploy). |
| — Batch B (Drag-to-create · Scope · Spread · Shift · Reassignment) | 66 | 65 | 1 | 65 written; C43811 Automated held. |
| — Batch C (Events · Conflicts · Capacity · Deletion · Settings · Permissions · API) | 68 | 64 | 4 | 64 written; C38847–C38850 Automated held. **13 Permissions cases (§4279) still owe a 2nd non-admin / Technician role-swap re-confirm** on the new build. |
| — Re-check vs `v3.8-d0e135e` + Priority fix | (subset) | 0 (blocked) | — | **PENDING fresh cookies.** Owed on resume: Stefan-changed labels/verdicts re-drive (Month chips, Day hour-axis, Lucide conflict icon, SV-9361 WO-number form, SV-9357 90%-zoom edges); re-confirm the 4 defect-sheet items (C30029 amber-vs-red, the spread-hours block, SV-8870 Month drag, SV-8957 click-to-arm); **C29945 re-scope + C29942 tweak** (Branko's 2026-08-19 ruling, decision-ready); permission tiers (Part 4). |
| **REPORT SUITE + SCHEDULE TOTAL** | **703** | **627** | **76** | RS 437 + Schedule 190 = 627 build-verified. Held atm=3: RS 71 + Schedule 5 = 76. 627 + 76 = 703 ✓. |
| **FILTERS (epic SV-8785)** | ~114 | **0 (this cycle)** | — | **Build-verification NOT STARTED this cycle — queued last, BLOCKED on the same fresh-cookie ask.** Prior work under `build/filters/build-verify-2026-08-11/`. Resume after Schedule re-check. |

**Reconciliation (Report Suite):** SBC 86+10=96 · SBR 104+14=118 · PV 59+13=72 · TU 52+9=61 ·
WIP 78+14=92 · IV 58+11=69 · **total 437+71=508 ✓.**
**Reconciliation (Schedule):** A 61 + B 66 + C 68 = 195; build-verified 61+65+64=190, held 0+1+4=5;
190+5=195 ✓.

---

## HOW EACH "NOT-YET-CLOSED" REASON GETS RESOLVED (the concrete future path)

| Reason | Cases affected | Path to resolve | Trigger |
|---|---|---|---|
| **Staging cookies dead (Stefan deploy)** | Schedule re-check (all 195 layers 1–2) + Priority fix + Filters (~114) | Fresh `sv_sso_session`+`PHPSESSID` → boot2 render → resume verbatim | **QA lead supplies cookies** |
| **Interim `<br>` cleanup debt** | Report Suite 166 sweep-written + 13 WIP-recon | Formatting-only demark (`build/markup-regression-2026-08-10/demark.py`) | **TestRail `update_case` stores clean markdown again** |
| **Automated (atm=3) held for Vlad** | 76 (RS 71 + Schedule 5) | Ratify → hand case numbers to Vladimir Tomovic (Rule 65 register) | **QA-lead ratification** (each edit coupled with build-verify) |
| **Feature not found in the build (Rule 69 deferred)** | Schedule 4 (C29945, C30005, C43812, C43813) · TU Total-Hours link (4) · SBR WO-rep-assignment UI | Re-check in the separate build-verify run | **The feature shipping** (NOT a redeploy — Rule 49/61) |
| **2nd non-admin (single-location) sign-in** | ~20 (SBC negatives, PV C30340, TU C30446, WIP perm, IV C30577, Schedule Permissions 13) | Drive the permission-negative / one-location branch | **QA lead supplies a 2nd non-admin session** (or rules to skip) |
| **Unseedable / server-side data-state** | IV C30547 no-category part + nightly-capture rows, WIP multi-state WO, SBC no-vehicle service WO, TU rate-less location | Seed on a later pass (Rule 14); server-side snapshot rows are not app-reachable | **A seeding pass once a session exists** |
| **PDF-500-blocked (SV-8818, OPEN)** | PV 2, IV 6 (+ SBR 2 over-cap) | Re-run the PDF-content assertions | **SV-8818 fixed** |
| **PO-question (document conflict)** | SBC/SBR invoice link, PV Location column (WIP tab-placement + WIP aging RESOLVED 8/19) | Author/confirm once Chris Ward answers | **PO answer** (Rules 32/57/58) |
| **PO page export owed** | WIP spec mirror (v22 local vs v24 live) | Ingest the v24 page body (behaviour already applied from Chris's rulings) | **User exports the SSO-walled page** |

---

## OUTSTANDING — what I need from you
1. **Fresh staging cookies** (action #1) — unblocks Schedule re-check vs `v3.8-d0e135e`, the Priority
   fix, the permission tiers, and the Filters build-verification (~114 cases).
2. **Fix the TestRail `update_case` markdown-wrap regression** → then the interim-`<br>` cleanup demark.
3. **Lift the Jira-creation hold** — for the 26 flagged Report Suite defects + 1 new deviation + the
   Schedule defect sheet.
4. **Ratify the 76 Automated (atm=3) held cases** + give the flagged-defect go-ahead.
5. **Chris Ward's 2 remaining PO answers** — invoice link-vs-plain-text, PV Location column.
6. **A 2nd non-admin sign-in** — for the ~20 permission-negative / one-location cases across both projects.
7. **Export the live WIP Confluence page (v24)** — the mirror is behind at v22.

All are logged in `build/OUTSTANDING-ITEMS-REGISTER.md`. Nothing else is outstanding for the
build-verification work itself.
