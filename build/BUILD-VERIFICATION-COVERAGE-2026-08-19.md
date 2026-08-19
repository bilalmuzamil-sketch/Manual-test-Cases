# BUILD-VERIFICATION COVERAGE — per project (2026-08-19)

**Docs-only consolidation.** Every figure below is drawn from committed artifacts under
`build/report-suite/build-verify-2026-08-18/` and `build/schedule/build-verify-2026-08-18/`.
No staging, TestRail, Jira or cookies were touched producing this file (Standing Rules 6/62).

**Honest phrasing (Standing Rule 10, 2026-08-11 amendment; Rule 67):** a case counted "build-verified"
below is **source-verified and build-accurate in its preconditions, steps, navigation and labels — the
pass/fail behaviour verdict belongs to the manual tester.** "VIU complete" is deliberately NOT said.

**Build under test:** `v3.8-bd246fd` (`app.staging.shopview.com`, last-modified Tue 18 Aug 2026
19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc`). Report Suite's SBC pass observed the earlier
same-minor bug-fix build `v3.8-2bf8d14` (Rule 60 — not stale).

---

## ⭐ WHAT YOU NEED TO DO (action-first — Standing Rule 70)

| # | Action for YOU | Plain reason | Priority |
|---|---|---|---|
| 1 | **Supply fresh staging session cookies** — `sv_sso_session` + `PHPSESSID` + `cf_clearance` for `.staging.shopview.com`, dropped into `/tmp/staging-cookie.txt`. | This is the ONLY blocker on finishing Schedule. A container reset (~06:30 UTC 2026-08-19) wiped the live session; **134 Schedule cases (batches B + C) are waiting** and resume the moment cookies land (build unchanged). | **HIGH** |
| 2 | **Lift the Jira-creation hold** so the flagged defects can be reopened/refiled. | 26 closed-but-still-reproducing Report Suite defects (+1 new) have no live ticket a tester can point at. | HIGH |
| 3 | **Answer / forward Chris Ward's 3 PO questions** (WIP tab-placement · invoice link-vs-plain-text · PV Location-column position). | Document-vs-document conflicts we will not resolve from the build (Rules 32/57/58). | MED |
| 4 | **Supply a 2nd non-admin (single-location) test sign-in.** | ~20 permission-negative cases (both projects) can't be driven with one admin cookie without rotating the shared session. | MED |

---

## THE COVERAGE TABLE

**"Build-verified"** = the case carries a **fresh `v3.8` build-check stamp** (its labels/steps/navigation
were compared against the build this pass). **"NOT build-verified"** = everything else, itemised in the
reason column. Totals reconcile per project (verified + not-verified = total).

| Project / area | Total cases | Build-verified | NOT build-verified | Reason not verified | How & when we'll verify them |
|---|---|---|---|---|---|
| **REPORT SUITE (epic SV-8582)** | **508** | **298** | **210** | HOLD **40** + feature-absent/NOT-AVAILABLE **13** + plain-READY-not-individually-restamped **157** (feature area verified present at report level, specific assertion not stamped). All 6 reports fully built on v3.8. | See per-report rows below. |
| — Sales By Customer (SBC) | 96 | 50 | 46 | 10 HOLD (6 need 2nd non-admin sign-in; 4 unseedable data-states — no service-only invoice, no reversed/voided invoice, two same-label assets, set-but-fails-to-load logo) + 36 plain-READY feature-present-not-restamped. | 2nd sign-in → run negatives; seed the data-states on a later pass (Rule 14); the 36 need a per-assertion re-stamp on the next full pass. |
| — Sales By Representative (SBR) | 118 | 51 | 67 | 5 HOLD (2nd non-admin sign-in for SBR-PERM; over-cap Expanded-PDF/API row-cap not reachable at 88 invoices; assignments-CSV BOM endpoint not located) + 1 NOT-AVAILABLE (WO-rep-assignment UI unconfirmed) + 61 plain-READY. | 2nd sign-in; seed >row-cap data; locate the assignments-export endpoint; re-stamp the 61 next pass. |
| — Parts Velocity (PV) | 72 | 26 | 46 | 1 HOLD (2nd non-admin sign-in for PV-PERM-02) + 2 NOT-AVAILABLE (PDF-content cases blocked by the SV-8818 PDF 500) + 43 plain-READY. | 2nd sign-in; PDF cases re-check when SV-8818 is fixed; re-stamp the 43 next pass. |
| — Technician Utilization (TU) | 61 | 42 | 19 | 7 HOLD (2 need 2nd non-admin sign-in; 5 unseedable data-states — rate-less location for em-dash, open clock, one-location user) + 4 NOT-AVAILABLE (Total Hours **link** absent from build) + 8 plain-READY. | 2nd sign-in; seed data-states; the 4 link cases re-check when the link feature ships (trigger = feature, not a redeploy). |
| — Work In Progress (WIP) | 92 | 75 | 17 | 7 HOLD (permission 2nd sign-in; multi-state WO not in current data; Location absent from Column Selection pending a ticket) + 4 NOT-AVAILABLE + 6 plain-READY. | 2nd sign-in; seed a WO with lines in >1 state; re-stamp remainder next pass. |
| — Inventory Value (IV) | 69 | 54 | 15 | 10 HOLD (single-location / reports-only / no-reports 2nd sign-ins; no-category part; server-side nightly-capture/retention rows not reachable from the app) + 2 NOT-AVAILABLE (SV-8818 large-view PDF timeout) + 3 plain-READY. | 2nd sign-in; seed the part; PDF cases re-check when SV-8818 is fixed; re-stamp remainder. |
| **SCHEDULE (epic SV-8685)** | **195** | **57** | **138** | Batch A: 4 feature-absent (deferred). Batches B + C: **134 cases NOT verified — staging session wiped by a container reset ~06:30 UTC 2026-08-19; awaiting fresh cookies.** | See per-batch rows below. |
| — Batch A (Navigation · Sidebar · Toolbar · Read-display) | 61 | 57 | 4 | 4 features not found in the build (Rule 69 deferred): C29945 Priority filter, C30005 shift edge-resize, C43812 day-view zoom, C43813 day-view clipped-block chevron. | Re-check in the separate build-verification run once each feature ships (trigger = feature, not a redeploy). |
| — Batch B (Drag-to-create · Scope · Spread · Shift · Reassignment) | 66 | 0 | 66 | **Staging session cookies wiped by a container reset (~06:30 UTC 2026-08-19); no session can be minted here (`quick-login` is itself SSO-gated → 401).** Build reachable and unchanged (`v3.8-bd246fd`). | **Resume verbatim the moment fresh `sv_sso_session`+`PHPSESSID`+`cf_clearance` land in `/tmp/staging-cookie.txt`** — the batch-A boot2 recipe applies unchanged; walk the 66 cases live. |
| — Batch C (Events · Conflicts · Capacity · Deletion · Settings · Permissions · API) | 68 | 0 | 68 | Not yet started; **blocked on the same fresh-cookie ask**. The 13 Permissions cases additionally need a 2nd non-admin sign-in. | Resume after cookies land; Permissions cases need the 2nd non-admin login (or a ruling to skip the negatives). |
| **GRAND TOTAL** | **703** | **355** | **348** | Report Suite 210 (mostly re-stamp backlog + HOLD) + Schedule 138 (134 cookie-blocked + 4 feature-absent). | #1 action: **supply fresh staging cookies** → Schedule B+C finish; the rest are 2nd sign-in / seed / feature-ship / re-stamp. |

**Reconciliation:** Report Suite 298 + 210 = 508 ✓ · Schedule 57 + 138 = 195 ✓ · Grand total 355 + 348 = 703 ✓.
Batch counts: 61 + 66 + 68 = 195 ✓.

---

## HOW EACH "NOT VERIFIED" REASON GETS RESOLVED (the concrete future path)

| Reason | Cases affected | Path to verify | Trigger |
|---|---|---|---|
| **Staging cookies wiped (container reset)** | Schedule batches B (66) + C (68) = 134 | Fresh `sv_sso_session`+`PHPSESSID`+`cf_clearance` → boot2 render → walk the cases live | **QA lead supplies cookies** (mintable only via `auth.staging.shopview.com/login`) |
| **Feature not found in the build (Rule 69 deferred)** | Schedule A: C29945, C30005, C43812, C43813 · TU: Total Hours link (4) · SBR: WO-rep-assignment UI | Re-check in the separate build-verification run | **The feature shipping** (NOT a redeploy — Rule 49/61) |
| **2nd non-admin (single-location) sign-in** | ~20 across both projects (SBC 6, SBR-PERM, PV-PERM-02, TU 2, WIP perm, IV 3, Schedule Permissions 13) | Drive the permission-negative branch as the non-admin user | **QA lead supplies a 2nd non-admin session** (or rules to skip negatives) |
| **Unseedable / server-side data-state** | SBC 4, TU 5, IV data-states, WIP multi-state WO, PV no-core-part | Seed the state on a later pass (Rule 14); server-side nightly-capture rows are not reachable from the app | **A seeding pass** once a session exists |
| **PDF-500-blocked (SV-8818, OPEN)** | PV 2, IV 6 (+ SBR 2 over-cap) | Re-run the PDF-content assertions | **SV-8818 fixed** (PDF export stops returning HTTP 500/502/timeout) |
| **PO-question-dependent (document conflict)** | WIP tab-placement, SBC/SBR invoice link, PV Location column | Author/confirm once Chris Ward answers | **PO answer** (Rules 32/57/58 — no guessing from the build) |
| **Plain-READY, feature-present-but-not-individually-restamped** | Report Suite ~157 | Per-assertion re-stamp on the next full build-verify pass | **Next scheduled pass** (feature area already confirmed present) |
| **Drag-gesture not harness-drivable** | Schedule drag cases (batch B) + C30004 | Kept READY with the limit noted — a **manual tester** performs the drag | Manual execution |

---

## OUTSTANDING — what I need from you
1. **Fresh staging cookies** (the #1 action above) — unblocks Schedule batches B+C (134 cases).
2. **Lift the Jira-creation hold** — for the 26 flagged Report Suite defects + the 1 new deviation.
3. **Chris Ward's 3 PO answers** — WIP tab-placement, invoice link-vs-plain-text, PV Location column.
4. **A 2nd non-admin sign-in** — for the ~20 permission-negative cases across both projects.

All four are logged in `build/OUTSTANDING-ITEMS-REGISTER.md`. Nothing else is outstanding for the
build-verification work itself.
