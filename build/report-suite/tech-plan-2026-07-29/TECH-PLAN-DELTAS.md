# Report Suite — Tech-Plan Reconciliation Deltas (2026-07-30)

**Source:** `TechPlan-Reports-Suite-Full-Implementation.md` (engineering tech plan, user upload
2026-07-29; plan dated 2026-07-21, grounded on `develop @ 674007b37e`).
**Suite at analysis time:** 460 active cases (id-map 460/460 C-id'd, all VIU-Pending).
**Rule of precedence (Rule 15/25 + user instruction):** product truth = PO/spec/video
(newest-wins). The tech plan is an ENGINEERING doc — it informs test design and VIU prep but
does NOT overrule the spec, the kickoff video (2026-07-28, user-ruled authoritative), or
Chris's answers. Every tech-plan-only behavior used in a case is flagged as such.
**Scope of this pass:** LOCAL only — NO TestRail writes. All edits/new cases go on the push
queue awaiting authorization.

---

## Classification tally

| Classification | Count | Outcome |
|---|---|---|
| IMPROVES-CASE (edits to existing cases) | 7 | applied locally (Phase 3), backups kept |
| IMPROVES-CASE (genuinely-missing new cases) | 5 | authored locally, blank C-ids |
| API-CONTRACT (recorded; 1 folded into an edit) | 9 | recorded below; SBC-API-02 extended |
| PERMISSION MODEL (Q2) | 1 finding | Q2 note QA-internal section updated |
| CONFLICTS-WITH-SPEC/VIDEO/PO-ANSWERS | 5 | flagged; question drafts in `Questions-for-Chris-dev.md`; NO case rewrites |
| VIU-PREP facts | 14 | recorded below (read before the QA-branch VIU) |
| NO-IMPACT / already-covered (verified) | 30+ | listed in §6 |

---

## 1. PERMISSION MODEL (high priority — the Q2 finding)

**What the tech plan says (verbatim anchors):**

- **SBC — dedicated atom, deliberate.** §B5.3: "All per-report atoms were retired in SV-7478;
  the AP/AR survivors … are the carve-out pattern. 1. Atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`
  in `PermissionEnum`. 2. Bundle decision — new `FEPermissionEnum` case (a 43rd bundle) vs ride
  an existing one. The 42-bundle set is 'locked' (SV-7476) → **product-level decision to
  surface**, not a mechanical default." And: "Every SBC endpoint (rows, drilldown, typeahead,
  totals, CSV, PDF, Print) gates on the new atom via `#[IsGranted]` — NOT `ROLE_REPORT_VIEW`
  (S1-N1)." Also 🔴 decision #5: "SBC dedicated permission (B5.3) — new atom + a
  bundle-placement product decision."
- **PV — existing inventory-reports permission.** §B3.2: "Permission: existing **Inventory
  Reports→View** (`ROLE_REPORT_VIEW` family — no new atom)."
- **IV — plain report-view.** §B4.2: "Permission: `ROLE_REPORT_VIEW` (the inventory-reports
  atom was retired SV-7478 — **correction to spec wording**; no new atom)."
- **SBR / TU / WIP** — no dedicated atom anywhere in the plan; they ride the shell's
  per-route permission contract (§8: "No permission changes in the foundation … SBC's dedicated
  view permission (S1-R2) is registered in the SBC phase … flagged so it isn't invented
  ad-hoc."). WIP E2E includes "permission-denied nav absence"; SBC E2E includes
  "permission-denied (no atom) → nav hidden + direct-link denied (S1-N1)".

**Verdict vs the pending Q2 discrepancy:** the tech plan **CONFIRMS the SHIPPED MIXED MODEL as
deliberate engineering design** — it is exactly the model our permission cases were authored to
(SBC dedicated atom; PV inventory-reports; IV report-view; SBR/TU/WIP existing report access).
This **sharpens, not settles, Q2**: Chris's Q2 answer ("these should be gated by normal reports
access") still contradicts the design for SBC at minimum, and the plan itself flags the SBC
bundle placement as a **product decision to surface** — i.e. engineering expected a PO call
here. Product truth = PO; the A/B question to Chris stands unchanged. Cases stay AS AUTHORED
per user Ruling 1 (2026-07-28). Action taken: the QA-internal section of
`chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md` updated with these
tech-plan citations (reader-facing question text untouched).

---

## 2. IMPROVES-CASE — edits applied locally (7)

| # | Case (C-id) | Edit | Tech-plan anchor | Spec position |
|---|---|---|---|---|
| E1 | WIP-API-01 C30528 | Added expected: re-running the capture for a date REPLACES that date's rows (no duplicates; idempotent) | B1.2 "Idempotent **delete+reinsert per (workplace, work_order, date)**" | WIP spec Story 11 is SILENT on re-run (IV's S11-R3 has it) — flagged tech-plan-sourced, VIU-confirm |
| E2 | SBR-STAT-02 C30209 | Precondition + note: seed the prepaid-with-zero-balance invoice by covering it with a customer DEPOSIT — the bug-prone path; failure symptom = a deposit-covered prepaid invoice showing "Partially Paid" | B6.2 🔴 "deposits are excluded from `paid_balance` (SV-6616) … a naive `total_balance − paid_balance` misclassifies every prepaid invoice" | SBR §3 mapping (prepaid + zero balance → Paid) already the anchor; the deposit is the seeding mechanism |
| E3 | SBR-BADGE-01 C30226 | Same deposit-seeding tester note (badge side) | B6.2 (same) | same |
| E4 | PV-CALC-07 C30365 | Added expected: reversing the MOST RECENT sale re-anchors Last Sale to the prior remaining sale (or "—" if none) | B3.1 "recompute on invoice reversal (reversed sale may have been the latest → per-part `MAX` over remaining history)" | PV spec S5-R4 Last Sale silent on reversal — flagged, VIU-confirm |
| E5 | SBC-API-02 C30191 | Added expected: a sort request for a column the report does not offer is safely refused/ignored — never an error or a broken page (server sort whitelist) | A2/Phase 2 "Paginator sort-whitelist … honors the sort whitelist (rejects/ignores non-whitelisted `sortBy`)" | SBC S10 server sort; whitelist behavior is the contract's safety half |
| E6 | WIP-FLT-05 C30502 | Note-only (local metadata): in the build the WO's "created" date = its **start date** (no separate created timestamp) — backdate `start_date` to seed in/out-of-range WOs | B1.2 "Date-range anchor = `work_order.start_date` — verified: there is no `created_on` column … `start_date` is the creation timestamp" | consistent with WIP S7-R7 "created date"; pure seeding aid |
| E7 | IV-EXP-07 C30593 | Title trimmed (drop "(exact cap value pending owner confirmation)") + note updated: the 10,000 cap is the suite-wide constant "locked by Chris 07-21" per the plan; exact value still VIU-confirm | A3/Phase 3 "`10_000` (single suite-wide constant, locked by Chris 07-21)" | IV spec S10-R12 carries 10,000 as a proposed default — plan resolves the openness (still confirm live) |

C-ids verified against testrail-id-map.csv (links: https://shopview.testrail.io/index.php?/cases/view/<id-number>).

## 3. IMPROVES-CASE — genuinely-missing new cases authored (5, blank C-ids)

| # | New case | Section | What it tests (distinct observable behavior) | Refs |
|---|---|---|---|---|
| N1 | PV-EXP-11 | PV — Exports | Over-cap Parts Velocity export refused with the too-large message; no file; narrowing re-enables | SV-8646 (PV Story 6; cap = tech plan FR-F4/A3, spec-silent — flagged) |
| N2 | TU-EXP-09 | TU — Exports | Over-cap Technician Utilization export refused with the too-large message; no file | SV-8654 (TU Story 7; cap = tech plan FR-F4/A3, spec-silent — flagged) |
| N3 | WIP-CALC-10 | WIP — Earned & Remaining | A technician STILL CLOCKED IN counts toward Labor Earned — running time valued up to now, still capped at the line's quoted value (regression guard: the legacy WIP query DROPPED open clock rows) | SV-8660 (WIP Story 4 §4 Earned; tech plan B1.2 open-TTR policy + "Do NOT copy" warning) |
| N4 | IV-DATE-09 | IV — As-of Date & Snapshots | After a category/vendor RENAME or DELETE, an as-of view of an earlier recorded day still shows the names as they were recorded — no blank cells, no dropped rows | SV-8678 (IV S11-R2 "a recorded day equals what the live report showed that day"; tech plan B4.1 denormalized names) |
| N5 | SBR-CALC-09 | SBR — Inv. Hrs & Calculations | Editing/deleting a clock record AFTER invoicing updates the invoice's hours-worked side (Inv. Hrs delta) on the report, while the BILLED money values stay unchanged; a void invoice is not touched | SV-8626 (SBR §3 hours worked = clocked hours recorded against that WO; tech plan Phase 4 FR-F7 clock subscriber, "any non-void invoice … sell columns untouched") |

Not authored (deliberate, Rule 28):
- **WIP export cap** — the plan's FR-F4 unblock list names SBC/SBR/PV/IV/TU but NOT WIP S9;
  ambiguous whether WIP's per-tab export is capped. Recorded as a VIU probe, not a case.
- **Page-size ≤1000 clamp / envelope shape / `rowsNumber`** — backend contract internals a
  manual tester can't meaningfully observe beyond what SBC-API-04/PV-API-01 already assert;
  recorded as API-CONTRACT facts only.
- **SBC company-vs-contact grouping** (B5.2 "Group by `company_id` … NOT `customer_id`
  (contact)") — the observable (invoices under two contacts of one customer roll into one
  customer row) is marginal for a manual tester and spec-silent; recorded as a VIU probe.
- **Snapshot-table schemas, indexes, migrations, backfill command internals, Golden-Rule
  exemptions** — implementation detail, not manually testable (Rule 28 "no
  implementation-detail cases").

## 4. CONFLICTS — flagged, NOT silently rewritten (question drafts in `Questions-for-Chris-dev.md`)

| # | Conflict | Positions | Our stance |
|---|---|---|---|
| C1 | **Location filter for a single-location user** | Tech plan Phase 5 `LocationFilter`: "single-location user still renders the control" (matches the OLD spec text). Kickoff video P33 (2026-07-28, user-ruled authoritative, NEWER): filter HIDDEN when only one permitted location — our 4 cases (SBR-LOC-04 C30216, TU-LOC-05 C30446, IV-LOC-04 C30577, PV-FILT-13 C30340) already flipped to the video | Cases stay video-authoritative (newest-wins). Flag to Chris/dev: the engineering plan predates the video and would build the visible version — Q1 |
| C2 | **Two different too-large-export messages** | SBC spec S14-R14/S15-R22: "This **export** is too large to **generate**…". IV spec S10-R12 + tech plan A3 (single suite-wide error): "This **report** is too large to **export**…" | Cases follow each spec today (SBC-EXP-14 vs IV-EXP-07). Q2 asks which single wording to expect — new PV/TU cap cases assert the behavior + plan wording with VIU-confirm on exact text |
| C3 | **Export cap absent from the PV / TU / WIP spec pages** | Tech plan: the 10k cap guards every suite report's exports (FR-F4 lists PV S6, TU S7; PV E2E "export >10k cap toast"), "locked by Chris 07-21". PV/TU/WIP spec pages carry NO cap text | N1/N2 authored (flagged tech-plan-sourced); Q3 asks Chris to ratify the cap into those specs; WIP left as a VIU probe |
| C4 | **SBR staff-dialog Escape** | Tech plan 🔴 decision #9: spec S13-R8 wants Esc-to-dismiss; Golden Rule #9 says Esc is not a supported close path — "Pick one" | ALREADY ASKED — this is the exact Esc question in `PO-Questions-Chris-ReportSuite-2026-07-27` (SBR Esc vs Golden-Rule). No re-ask; the plan independently confirms the decision is real and unresolved |
| C5 | **Per-browser remembered view vs the filters-redesign server-side preference program** | Tech plan D3 resolves it FOR NOW (specs win: per-browser localStorage; migration path documented). A later swap to server-side `UserPagePreference` would invalidate the "per browser"/"another browser = defaults" halves of our persistence cases | No change now (cases match spec + plan). Recorded as a WATCH item — if the filters-redesign program later migrates Reports, re-run reconciliation on the *-PERS-* cases |

## 5. VIU-PREP facts (record only — read before the QA-branch VIU pass)

1. **Branch/PR shape:** PR-1 = `inventory_changes` INT→DECIMAL fix (ships first, off-peak);
   PR-2 = the whole suite, one branch (epic notes: `project/reports-suite-bravo`). Build order
   Foundation → WIP → TU → PV → IV → SBC → SBR — expect reports to land in that order on the QA
   branch; late reports (SBC/SBR) may lag.
2. **Historical money on SBC/SBR needs the backfill:** the six invoice financial columns are
   backfilled by `app:invoicing:backfill-financial-columns`. Until it has run on the env,
   invoices predating the deploy can show NULL-derived zeros/blanks — plan B5.2 even names a
   "Backfill-NULL guard … or gate report launch on backfill completion." During VIU, a zeroed
   historical row is FIRST a backfill-state question, not a calc bug.
3. **SBR rep credit is forward-only, NO backfill** (B6.1): every pre-existing invoice lands
   under "Unassigned" — expected, not a bug.
4. **Snapshot crons:** WIP `app:reporting:capture-wip-snapshots` — EventBridge ~08:00 UTC,
   idempotent delete+reinsert; IV `app:reporting:capture-inventory-value-snapshots` — nightly,
   retention prune runs inside/alongside the capture. On a fresh QA branch NO snapshot rows
   exist until the cron first runs → IV as-of past dates = empty state (matches IV-API-04);
   WIP snapshot is write-only this version (no screen reads it — S11-R7).
5. **Exports are true file downloads** (`Content-Disposition` attachment, `text/csv` /
   `application/pdf`) — a deliberate departure from the legacy JSON-wrapped export convention
   (D5). EXCEPTION: the SBR "Sales Rep Assignments" export deliberately STAYS on the legacy
   JSON-wrapped convention inside the existing Export Reports dialog.
6. **PDF engine = WeasyPrint** (600s timeout), copied from the Technician Efficiency
   Summary/Expanded pair — SBR's four exports map 1:1 onto that pair.
7. **Remembered view = localStorage key `report_view:<reportSlug>`**, schema-versioned; a
   version bump clears the saved view; per-field defensive validators (drop unknown range /
   inaccessible location / dead sort column / column-set mismatch); restore runs BEFORE the
   first fetch and BEATS the URL (SBC S2-R9 — matches SBC-PERS-06). Clearing site data =
   all defaults.
8. **Switching location clears the whole TanStack cache** (PR #1886) — a full refetch on
   location switch is expected, not a perf bug.
9. **Page-local search is a server `search` param** — the global search bar dependency is
   "forbidden suite-wide" (matches PV spec S2-R6).
10. **Date presets:** 11 presets + Custom, 366-day cap enforced at the DTO boundary AND in the
    calendar/Apply (prevention, not a form error — S2-N2); page size clamps at the Paginator
    max (1000); non-whitelisted sort params are rejected/ignored (now asserted in SBC-API-02).
11. **Routes/nav:** WIP REUSES route name `WorkInProgress` + path `reports/work-in-progress`
    (only the title meta changes; the old WIP report page + its FE code are DELETED); PV + IV
    sit in a NET-NEW "Parts" nav group; TU/SBR/WIP in Performance. Envelope =
    `data.<resource>[]` + `data.pagination{rowsPerPage, rowsNumber}`.
12. **WIP is the odd one out architecturally:** one fetch of the whole bounded open-WO set,
    tabs/filters/summary all client-side ("recomputes with no reload"), native q-table
    client-side sort within a tab — only the OTHER five use server pagination.
13. **TU/WIP clock valuation rate:** `technician_task_record.hourly_rate` is the STAFF
    cost-rate snapshot taken at clocking time — NOT the location's default labor rate (that
    rate is only used for TU's Est. Lost Labor). Rate changes after clocking don't reprice
    old records.
14. **Payment-status mapping is one shared expression** driving both the SBR badge and the S4
    filter; the badge must be fed the MAPPED display key (raw `overpaid` through the app's
    color helper would render orange, mapped it must show the Paid color) — SBR-BADGE-01's
    mapping assertions are the guard.

## 6. NO-IMPACT / already-covered (verified against the 460, spot list)

- 366-day cap: SBC-DATE-03, PV-FILT-04, SBR-DATE-02, IV-API-05, TU-NAV-04, WIP-FLT-05 ✓
- 10k cap SBC/SBR/IV: SBC-EXP-14 + SBC-API-05, SBR-EXP-15 + SBR-API-05, IV-EXP-07 ✓
- Nightly snapshot mechanics: WIP-API-01..06, IV-API-01..06 (per-day rows, identical
  computation, cross-tenant span, $0.00 capture, cents, forward-only, retention 13-mo →
  monthly, as-of bridging) ✓ (only the WIP re-run gap → E1)
- Empty-set exports: SBC-EXP-15, SBR-EXP-16, WIP-EXP-09 ✓
- Remembered-view defensive restore/per-report isolation/defaults: SBC-PERS-01..07,
  SBR-PERS-01..05, WIP-PERS-03/04, IV-PERS-03/04, PV-ROW-03/PV-COL-01 ✓; restore-beats-URL:
  SBC-PERS-06 ✓
- TU reconciliation to Timesheet Activities incl. the two documented exceptions (open clocks,
  no-location deep-link): TU-LINK-02..06 ✓; single report-level timezone: TU-NAV-03/06 ✓;
  sort resets on reload, never persisted: TU-SORT-03 ✓; Est. Lost Labor rate cases
  (partial/"—"/$0.00): TU-ELL-01..05 ✓
- WIP money model: per-line quoted cap WIP-CALC-02, Remaining WIP-CALC-03, Parts
  Earned/Remaining WIP-CALC-04/05, Estimates all-$0.00, Total ≠ WO total ✓; tab partition
  WIP-PLACE-* ✓; "X days" not pluralized WIP-COL-07 ✓; export renames Unit/Branch WIP-EXP-07 ✓;
  filenames `wip-2-report.*` WIP-EXP-06 ✓ (plan confirms both)
- PV: Units Sold nets reversals/movement-based vs billed (PV-CALC-01/02/16), Demand
  reversal-proof, core excluded (PV-CALC-04/14), catalogue merged vs inventory per-location,
  returns exclude cancelled+core, profitability nulls (PV-ROW-08), Last Sale all-time
  location-scoped (PV-CALC-07), server pagination/filters (PV-API-01/02) ✓
- IV: is_core + qty>0 scope (IV-SCOPE-01), sell chain fixed→matrix→cost (IV-CALC-01..03),
  totals over full set (IV-TOT-02), as-of live-today/nearest/none-empty (IV-DATE-01..06),
  per-location rows not merged (IV-SCOPE-02) ✓
- SBC: lazy drill-down + bounded expand-all (SBC-API-01), server sort (SBC-API-02), asset
  grouping + snapshot fallback (SBC-TREE-05), Parts Sales bucket incl. service-no-vehicle
  (SBC-TREE-10/11), dup labels (#1)/(#2) (SBC-LBL-04), type-ahead all-customers state
  (SBC-PERS-07), two-level export count (SBC-API-05) ✓
- SBR: rep snapshot chain + immutability (SBR-WO-05), contributor gate/(Inactive)/deleted-staff
  name (SBR-ROW-03), 5→3 payment mapping both surfaces (SBR-STAT-02, SBR-BADGE-01), lazy per-rep
  details + per-rep pagination (SBR-API-01), server sort (SBR-API-02), 4 exports + formats +
  font-tier + empty exports (SBR-EXP-*), deactivation dialog type-YES (SBR-DEACT-05),
  assignments export (SBR-ASGN-*) ✓
- Formatters (accounting parens, margin% em-dash, signed Inv. Hrs coloring, "N days", em-dash
  null): SBC-CALC-03, SBR-CALC-01/03, PV-CALC-13, PV-EXP-07, IV S3 cases ✓
- Two themes (two-tone SBC/PV, all-white SBR/TU/WIP/IV): visual cases per report ✓

## 7. Spec-gap notes fed to SPEC-WATCH thinking (not new watch rows)

- WIP Story 11 lacks an idempotent-re-run requirement (IV S11-R3 has one) — E1 flags it;
  Chris's imminent changelog re-diff is the natural place to confirm.
- PV/TU/WIP spec pages lack the export cap (C3/Q3).
- The two toast strings (C2/Q2).
