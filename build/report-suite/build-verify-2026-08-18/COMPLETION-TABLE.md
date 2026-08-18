# REPORT SUITE — BUILD-VERIFICATION COMPLETION TABLE (all 6 reports, 2026-08-18)

**Read time of this consolidation:** 2026-08-18 (docs-only; no staging, no TestRail, no Jira touched this pass).
**Every figure below is drawn from the committed per-report artifacts under**
`build/report-suite/build-verify-2026-08-18/` (SBC/SBR/PV/TU/WIP/IV — EXECUTION.md, FINDINGS.md,
HELD-AUTOMATED.md, DEFERRED-RUN.md, FOR-VLAD.md). Nothing here is re-derived from a live source this pass.

**Honest phrasing (Standing Rule 10, 2026-08-11 amendment):** each report below is
**source-verified and build-accurate in its preconditions, steps, navigation and labels — the
pass/fail behaviour verdict belongs to the manual tester.** "VIU complete" is deliberately NOT said.

---

## ⭐ WHAT YOU NEED TO DO (action-first — Standing Rule 70)

| # | Action for YOU | Plain reason | Priority |
|---|---|---|---|
| 1 | **Approve the Automated-case list** (`AUTOMATION-RATIFICATION-LIST.md`) — (A) ratify the 4 SBC Automated cases already edited, and (B) give go-ahead to edit the 35 held Automated cases (coupled with re-verification, then handed to Vlad). | Rule 71: Automated cases are ask-first even when they're ours. 11 of the 39 change what an automated run concludes. | HIGH |
| 2 | **Decide the defect reopens** (`FLAGGED-DEFECTS-FOR-JIRA.md`) — 26 defects recommend reopen/refile, 1 recommends close-as-fixed (SV-8823), 3 are PO questions. **No ticket is filed yet — Jira creation is on your hold.** | The tester will fail these closed-but-still-reproducing defects and has no live ticket to point at. | HIGH |
| 3 | **Answer / forward Chris Ward's PO questions** — the WIP tab-placement spec self-contradiction (S2-R4 vs the SV-9027 line-state Key Decision); the invoice-number link-vs-plain-text question (SBC + SBR); the Parts Velocity Location-column position (SV-8938 contested). | We will not resolve a document-vs-document conflict from the build (Rules 32/57/58). | MED |
| 4 | **Supply a second, non-admin (single-location) test sign-in** for the Report Suite branch — or say to skip the permission-negative checks. | ~20 permission-negative cases across all 6 reports cannot be driven with one admin cookie without rotating the shared session. | MED |

---

## 1. THE COMPLETION TABLE

Columns: **Total (ours / live-incl-foreign)** · **Automated held (atm=3, not written)** · **Writes (byte-verified)** ·
**READY / EXPECT-FAIL / HOLD / NOT-AVAILABLE** (live marker split) · **Build-verified & marker** · **Ready-to-automate**.

| Report | Total (ours/live) | Auto held | Writes | READY | EXPECT-FAIL | HOLD | NOT-AVAIL | Build-verified & marker | Ready-to-auto |
|---|---|---|---|---|---|---|---|---|---|
| **Sales By Customer (SBC)** | 96 / 96 | 0 *(4 edited, see note)* | 50 | 86 | 0 | 10 | 0 | 50 of 96 carry a fresh stamp on **`v3.8-2bf8d14`** (earlier build; redeployed to bd246fd at pass END — Rule 60 same-minor bug-fix, not stale). All 96 features verified PRESENT. | 86 |
| **Sales By Representative (SBR)** | 118 / 120 | 4 | 51 | 110 | 2 | 5 | 1 | 51 of 118 carry a fresh **`v3.8-bd246fd`** stamp; all features driven live. | 112 |
| **Parts Velocity (PV)** | 72 / 75 | 8 | 26 | 66 | 3 | 1 | 2 | 26 of 72 carry a fresh **`v3.8-bd246fd`** stamp; all features driven live. | 69 |
| **Technician Utilization (TU)** | 61 / 62 | 8 | 42 | 49 | 1 | 7 | 4 | 42 of 61 carry a fresh **`v3.8-bd246fd`** stamp; 59 of 61 assertions driven live. | 50 |
| **Work In Progress (WIP)** | 92 / 94 | 10 | 75 | 80 | 1 | 7 | 4 | 75 of 92 carry a fresh **`v3.8-bd246fd`** stamp; 80 of 82 non-auto screen-observed. | 81 |
| **Inventory Value (IV)** | 69 / 71 | 5 | 54 | 51 | 6 | 10 | 2 | 54 of 69 carry a fresh **`v3.8-bd246fd`** stamp; all feature areas screen-observed. | 57 |
| **TOTAL** | **508 / 518** | **35** *(+4 SBC edited = 39)* | **298** | **442** | **13** | **40** | **13** | **298 of 508 carry a fresh v3.8 stamp** (50 on `v3.8-2bf8d14`, 248 on `v3.8-bd246fd`). All 6 reports fully built. | **455** |

**Marker arithmetic (closes both ways per report and in total):**

| Report | READY + EXPECT-FAIL | = | Total − HOLD − NOT-AVAIL |
|---|---|---|---|
| SBC | 86 + 0 = **86** | ✅ | 96 − 10 − 0 = **86** |
| SBR | 110 + 2 = **112** | ✅ | 118 − 5 − 1 = **112** |
| PV | 66 + 3 = **69** | ✅ | 72 − 1 − 2 = **69** |
| TU | 49 + 1 = **50** | ✅ | 61 − 7 − 4 = **50** |
| WIP | 80 + 1 = **81** | ✅ | 92 − 7 − 4 = **81** |
| IV | 51 + 6 = **57** | ✅ | 69 − 10 − 2 = **57** |
| **TOTAL** | 442 + 13 = **455** | ✅ | 508 − 40 − 13 = **455** |

**Count reconciliation (Rule 38 — two numbers):** ours **508** (= run 359's 508 tests) / live-in-Report-Suite
sections **518** / foreign **10** (all Vladimir Tomovic id 1, atm=3 except one atm=1; HANDS-OFF, 0 touched).
508 + 10 = 518, set-equal both ways.

*(SBC note: SBC did not HOLD its Automated cases — 4 Automated cases (C30107, C30114, C30121, C30123) were
edited during the SBC pass BEFORE the "hold-Automated / ask-first" correction was in force. They are listed in
`AUTOMATION-RATIFICATION-LIST.md` section (A) for retrospective ratification. Every later report (SBR→IV) held
its Automated cases unwritten per Rule 71.)*

---

## 2. WHAT IS LEFT — itemized per report (never a bare total)

### SBC — Sales By Customer (10 HOLD + 2 reopen)
- **6 permission-negative cases** (C30098, C30099, C30101, C39447, C43546, C30100) need a **2nd non-admin
  sign-in** — one admin cookie only; quick-login/switch-user rotate the shared session. Positive observed.
- **4 data-state HOLDs, seedable on a later pass** (Rule 14): C30131 (no service-only invoice), C30132 (no
  reversed/voided invoice), C30137 (customer with two same-label assets), C43553 (set-but-fails-to-load logo).
- **C30141** — deleting a real invoice while the report is open (destructive; avoided on shared org).
- **C30184** — a failing data fetch cannot be forced from the application.
- **Invoice link-vs-plain-text PO question** — C30100, C43558 (HOLD on PO) + C30138 (kept READY).
- **C38912** — the build does not follow the ratified Location-column rule (defect, needs a ticket — Jira hold).
- **2 reopen defects** — SV-8964 (Expanded PDF on A3, C30166), SV-8955 (date range not written to link, C30105).

### SBR — Sales By Representative (5 HOLD + 1 deferred + reopen/close)
- **2nd non-admin sign-in** for SBR-PERM negative branches.
- **C30290, C30320** — SV-8818 over-cap Expanded-PDF / API row-cap; the > row-cap state is not reachable at
  88 invoices (kept EXPECT-FAIL, ticket still open).
- **C30293** — Sales Rep Assignments CSV BOM: the assignments-export endpoint was not located; owed on a future pass.
- **C30311 (SBR-WO-02) HOLD** — flag for review: confirm whether the WO-rep-assignment UI is built.
- **Ratify Automated C30221 lift** (expand-tree now built) — Rule 71 ask-first.
- **2 reopen** — SV-8973 (empty-state wording, C30298), SV-8975 (icon aria-labels, C30307).
- **SV-8823** (CSV money-as-text) appears FIXED for SBR but ticket still TESTING QA — confirm & close.
- **A3 Expanded PDF** (SV-8964 cross-report with SBC, touches C30279).
- **Invoice link-vs-plain-text PO question** (same as SBC).

### PV — Parts Velocity (1 HOLD + 2 deferred held-auto + reopen/PO)
- **3 reopen** — SV-8939 (Location filter defaults to All locations, C30337), SV-8940 (on-screen truncation/no
  tooltip, C30347), SV-8936 (export success toast generic, C30384).
- **SV-8818 PDF export fails (HTTP 500/502)** on a medium view while CSV works (OPEN; C38885, C43547 kept
  EXPECT-FAIL). PDF-content cases C30379/C30381/C43834 partly blocked by the PDF 500.
- **PV Location-column PO question** — SV-8938 (C38914/C30352): sits 6th not leftmost, but the spec says two
  different things and "leftmost" is not confirmed. Get Chris Ward's answer before treating 6th as a defect.
- **Ratify Automated changes** — C30346 + C30353 lift deferred→READY (features built); C30352 strip stale
  SV-8938 expect-fail (confirm PO answer first); **C30328 needs review** (possible "All types" vs "Both" +
  single-vs-multi-select deviation — do NOT auto-lift).
- **2nd non-admin sign-in** for PV-PERM-02 negative branch.
- **C30372 (PV-CALC-14) HOLD** — no core-flagged part exists; seedable later.

### TU — Technician Utilization (7 HOLD + 4 deferred feature-absent + reopen/new)
- **Total Hours LINK feature is ABSENT from the build** (§F7) → 4 cases deferred (`Not available`): C30428,
  C30430, C30432, C30433. Plus **C30429 (Automated) needs review** — asserts the link works; likely should be
  deferred too. Re-check trigger = the link shipping, NOT a redeploy.
- **8 reopen** — SV-8943 (opens All locations, C30394), SV-8945 (sort/filter server-side, C30450), SV-8950
  (Summary row missing from PDF, C30435), SV-8951 (Expanded CSV per-day rows, C30436/C43552), SV-8952 (export
  toast wording, C30441), SV-8954 (Location column 2nd + not in selector, C38915), SV-8947 ("All technicians"
  vs "Select all" label, C30425), SV-8953 (aria-expanded not reported, C30418/C30421).
- **NEW deviation, no ticket** — TU-EXP-07 (C30440): export with all technicians cleared shows an "Empty
  export" error toast, not the spec's silent no-op. File-new candidate.
- **Ratify Automated C30424 strip** (SV-8946 obsolete; deselect/recalc verified correct).
- **2nd non-admin sign-in** — TU-LOC-05 (one-location user), TU-NAV-07 (no-reports-access user).
- **5 HOLD data-states** — C30407/C30408 (need a rate-less location for em-dash ELL), C30431 (needs an open
  clock + the absent link), C30446 (one-location-user sign-in), C30413 (no em-dash ELL tech).

### WIP — Work In Progress (7 HOLD + 10 held-auto + reopen/PO)
- **7 reopen** — SV-8967 (WO# no link, C30468/C43557/C30523), SV-8970 (rows pale not white, C30519), SV-8987
  (column header alignment, C30466), SV-8988 (Estimates summary not muted, C30491), SV-8989 (Labor Delta two
  decimals, C30481), SV-8969 (Customer filter Clear-before-select, C30499), SV-8968 (filter server-recompute,
  C30505). All closed OBSOLETE, still reproduce on v3.8.
- **WIP spec self-contradiction (Chris Ward PO question)** — S2-R4 ("appears once, in one tab") vs the §3
  SV-9027 line-state Key Decision ("appears in each matching tab"). Build behaviour NOT_ESTABLISHED (§C/§D);
  no verdict invented. Also register rows RS-WIP-3/4/5.
- **Ratify 10 Automated cases** — 5 change what an automated run concludes (C30460, C30462, C30508, C30518
  lift deferred→READY; C30498 strip SV-8968 expect-fail) + 5 metadata-only refreshes.
- **2 Location-rule HOLD cases need a ticket** (Jira hold) — C30467 (WIP-COL-02), C43551 (WIP-PERS-05):
  Location absent from the Column Selection control → one edit from EXPECT-FAIL once a ticket is authorised.
- **Multi-tab seeded confirmation** — C30458 (SCOPE-03), C43979 (PLACE-05): lifted to READY, but no WO with
  lines in >1 state exists in current data; a tester seeds it to confirm the "appears in each tab" behaviour.
- **Permission 2nd sign-in** for the entitlement-gated WO-link checks.

### IV — Inventory Value (10 HOLD + 2 deferred held-auto + reopen/close/PO)
- **SV-8818 PDF export fails (HTTP 500/timeout)** on a large IV view (5,703 rows) while small views work
  (OPEN) → 6 cases kept EXPECT-FAIL (C30587, C30590, C30591, C30593, C30595, C43548).
- **3 reopen** — SV-8926 (Totals row reads "Totals" vs spec "Total", C30556), SV-8930 (empty-state wording ≠
  spec's "Empty bays…", C30539), SV-8931 (first visit opens All locations, C30536/C30574). All OBSOLETE, reproduce.
- **SV-8823 (money/column-order) appears FIXED but ticket still OPEN (TESTING QA)** — confirm the fix and
  close the money portion; **NOT verified this pass:** whether the CSV honours column-selection-in-export
  (C30588 keeps an SV-8823 note, left unchanged). Verify that sub-claim before fully closing.
- **Ratify 5 Automated cases** — 2 lifts that change the automated conclusion (C30535 IV-NAV-02, C30563
  IV-DATE-03) + 3 metadata-only refreshes (C30557, C30569, C30583).
- **10 HOLD data-states** — C30547 (no-category part), C30577/C30603/C30604 (single-location / reports-only /
  no-reports 2nd sign-ins), C30605/C30606/C30607/C30609/C30610 + C38892 (server-side nightly-capture/retention
  rows not reachable from the app; recorded earlier day).

---

## 3. HONEST SCOPE NOTES (Rules 12/17/60)

- **298 of 508 cases carry a fresh v3.8 build-check stamp this pass.** The remaining ~210 plain-READY cases had
  their **feature area verified present at report level** but their specific assertion was **not individually
  re-stamped** — reported honestly, not folded into the build-verified count. (Per-report N-of-M is stated in
  each FINDINGS file.)
- **The build did not stay on one marker across the six passes.** SBC observed `v3.8-2bf8d14` (redeployed to
  `v3.8-bd246fd` at the SBC pass's very end); SBR/PV/TU/WIP/IV all observed `v3.8-bd246fd`. Per Rule 60's
  bug-fix-deploy amendment, a same-minor bug-fix rebuild does not make a prior pass stale — the 50 SBC verdicts
  on `v3.8-2bf8d14` stand, and are recorded on the build actually observed.
- **Run 359 untouched by every pass** — `include_all` still False, 508 tests / 6 passed / 502 untested; 0 run
  writes, 0 result writes, across all six reports.
- **0 Jira writes** (GET only, for ticket status) — the ticket-creation hold is active (Rule 62 / register H1).
- **10 foreign cases** (Vladimir Tomovic id 1) untouched throughout (Rule 38).
- **All six reports are fully built on v3.8.** Only one feature is genuinely absent: the **Total Hours link**
  in Technician Utilization (4 deferred cases).

---

## OUTSTANDING — what I need from you
See the action-first table at the top and `FLAGGED-DEFECTS-FOR-JIRA.md` / `AUTOMATION-RATIFICATION-LIST.md`.
The four durable asks (Automated ratification · defect reopens once the Jira hold lifts · Chris Ward's PO
questions · a second non-admin sign-in) are logged in `build/OUTSTANDING-ITEMS-REGISTER.md`. Nothing else is
outstanding for the Report Suite build-verification itself — **all 6 reports are build-verified on v3.8.**
