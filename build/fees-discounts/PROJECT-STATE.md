# Fees & Discounts V1 — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Fees & Discounts (F&D V1) project.** It
> is a single authoritative snapshot so the project can be resumed with zero
> re-discovery.
> **Canonical spec (Confluence):** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/622297094/Fees+Discounts+V1
> (Atlassian-SSO login-walled — reference pointer only; content must be exported/pasted to ingest, do NOT fetch the URL.)
> **Last updated:** 2026-07-17 (§0.0e: **spec V1_3 APPLIED** — Δ1 §5-R15 SFD-gate +
> Δ2 history→audit-log; 11 update_case pushed to TestRail 11/11 200 + re-GET MATCH,
> audit `spec-v3-2026-07-17/testrail-update-log.md`; requirements.md now carries §17
> = the V1_3 baseline; tally UNCHANGED 135/15/12/20/1 = 183)
> — prior same-day update (§0.0d: Epic **SV-7387** user-confirmed; spec **V1_3**
> + design zips ingested ANALYSIS-ONLY → `spec-v3-2026-07-17/`)
> — prior update 2026-07-14 (post-Round-2 snapshot — after **V1_2 spec applied** [43 case
> updates + new FD-WO-016=C29441, all pushed] AND a **FRESH FULL build-accurate WORDING +
> VIU PASS over ALL 183 cases** [live-captured build labels; every case re-adjudicated;
> **ALL 183 pushed to TestRail via update_case, 200/200, 0 errors**] AND **Chris Ward's
> Round-2 answers APPLIED + the 6 Round-2 cases pushed to TestRail 2026-07-14 + FD-QB-014
> commit-time re-VIU SETTLED VIU-Verified**.
> **UPDATE 2026-07-14: Chris Ward's Round-2 answers RETURNED (Q1=A, Q2=A, Q3=A, Q4=B)
> and the §0.1 action map was APPLIED to local artifacts — see §0.0c. The 6 Round-2
> cases were PUSHED TO TESTRAIL 2026-07-14 (update_case, 6/6 updated, all verify
> 200/200 MATCH; audit `testrail-round2-push-log.md`); TICKET 4 + TICKET 5 DROPPED.
> FD-QB-014 left VIU-Pending — its commit-time re-VIU is blocked on EXPIRED qb cookies.**).
> **UPDATE 2026-07-14 (later, fresh qb cookies): FD-QB-014 commit-time re-VIU SETTLED =
> VIU-Verified.** The over-discount warn/confirm IS built and fires at BOTH commit points
> (Create Invoice + Mark-Reviewed/Complete), never at add time — matches Chris Q1=A exactly.
> Evidence: live FE component `OverDiscountWarningDialog` (title "Discount exceeds subtotal";
> floor to $0.00 + tax on taxable base still owed + exact excess as customer credit +
> Continue/Cancel confirm), wired in the Invoice component's Create-Invoice + Complete/Review
> handlers behind the `adjustmentsSummary.excessCreditAmount>0` gate; plus a live reversible
> check on WO S-15970 (over-discount → sub_total floored $0.00, excessCreditAmount=9522.26>0,
> WO restored byte-identical). NO TestRail write (expected already build-accurate; status flip
> local only). See §0.0c.
> **NEW TALLY 2026-07-14: 135 VIU-Verified / 15 VIU-Deviation / 12 Blocked-NotBuilt /
> 20 Blocked-Env / 1 VIU-Pending (FD-PART-005) = 183** (source: `FeesDiscounts_Blockers_Tracker`;
> supersedes the earlier same-day 134/15/12/20/2 and the 2026-07-13 130/20/12/20/1 below).
> **Final tally 2026-07-13: 130 VIU-Verified / 20 VIU-Deviation / 12 Blocked-NotBuilt /
> 20 Blocked-Env / 1 VIU-Pending = 183** (source: `FeesDiscounts_Blockers_Tracker`).
> **⏸️ STATUS 2026-07-14: Chris Ward's Round-2 answers are APPLIED + IN TESTRAIL and
> FD-QB-014 is VIU-Verified. The wording+VIU pass, V1_2 batch, and Round-2 batch are all
> DONE and pushed. Remaining open items (see §0): (1) the FD-CUST-016 / FD-VAL-007
> DUPLICATE PAIR needs a QA-lead keep/retire ruling; (2) the ready bug drafts (TICKETS
> 2/3/6/7/8/9/10/11) need filing via Atlassian; (3) FD-PART-005 + the 20 Blocked-Env
> cases need the env fixes / a QB-UI human / a flag-off window. NO TestRail catch-up is
> outstanding.**
> **Source of truth for per-case status:** the case JSONs `build/fees-discounts/cases/*.json`
> (`viu_status`), tallied by `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md`/`.xlsx`
> (regenerate with `python3 build/fees-discounts/gen_blockers.py`). All counts below
> are cited from those files — do not invent numbers; re-read them if in doubt.
> Companion docs kept current: `PROJECT-STATUS.md` (narrative log), `viu-qb-findings.md`
> + `viu-findings.md` (VIU evidence + FDBUG register), `bugs-log.md`, `viu-recon.md`
> (env map), `RESUME-STRATEGY.md` (two-phase finalization).

---

## 0. WAITING ON (read this first) — snapshot 2026-07-14

**Chris Ward's Round-2 answers are IN — applied and pushed to TestRail 2026-07-14
(§0.0c).** The project is no longer blocked on the PO. The remaining open items are:
1. **QA-lead ruling on the FD-CUST-016 / FD-VAL-007 DUPLICATE PAIR** (keep one / retire
   one — snapshotted, NOT deleted; see §0.-1).
2. **File the ready bug drafts** (TICKETS 2/3/6/7/8/9/10/11) via Atlassian — no Atlassian
   from this env, so the USER files them (§0.3). TICKET 1 stays ON HOLD (US-tax re-repro);
   TICKETS 4 & 5 DROPPED; FDBUG-15 dropped (not-a-defect).
3. **Env / VIU backlog:** FD-PART-005 (blocked by the env-wide WO line-create 500) + the
   20 Blocked-Env cases (14 QuickBooks need a human in QB / the unmap-500 fix; 6 need a
   flag-off window); §5-R15 taxable disclaimer not implemented (FD-WO-016 deviation);
   Story-8 pfee builder + Story-11 Part Sales Not-Built (retest when dev ships).

This section is the complete snapshot: current tally, the applied Round-2 action map,
everything else open, and the ordered resume checklist. The rest of this doc holds the
standing detail. **NO TestRail catch-up is outstanding** — all authored wording is live.

### 0.0e SPEC V1_3 APPLIED + PUSHED TO TESTRAIL — 2026-07-17 (NEWEST event)

**The V1_3 apply pass was run (user-instructed 2026-07-17: "check if any test cases
need to be updated, if yes then please do that" — that instruction authorized this
one-day update_case pass).** Per the delta doc
`spec-v3-2026-07-17/spec-diff-v3-2026-07-17.md` §E/§G:

- **Δ1 — §5-R15 SFD gate (2 substantive edits, 0 status flips):** FD-WO-016 (C29441)
  expected gains the gate qualifier (spec verbatim: *"The note is shown only to users
  with See Financial Data."*) **+ the SFD-negative check FOLDED IN as expected 4 — NO
  new case authored** (the fold option from the delta doc; the gate is only
  independently observable at the admin template/Processing-Fee dialog, §H.b).
  FD-PROC-004 (C28522) expected gains the same qualifier. **Statuses unchanged**
  (VIU-Deviation / Blocked-NotBuilt — the note is still not built; the 2026-07-13 VIU
  was as admin WITH See Financial Data and the note was absent).
- **Δ2 — history→audit-log terminology sweep (9 reader-facing cosmetic edits, 0
  status flips):** FD-HIST-001..006 (C28560–C28565), FD-PERM-009 (C28593), FD-PERM-010
  (C28594), FD-FLAG-002 (C28597) — generic "history log / history entry / work-order
  history" prose → "audit log / audit-log entry"; the exact build labels **'Audit Log'**
  (⋮ menu) / **'Work Order Log'** (page) kept verbatim (Standing Rule 9). Plus 4
  internal-notes-only touches (FD-HIST-007/008, FD-EDIT-002, FD-FLAG-001 — local
  `notes` field only, NOT pushed).
- **TestRail: 11/11 update_case, all 200 + re-GET diff-confirm MATCH** (fields
  title/custom_preconds/custom_steps/custom_expected built per gen_import.py rules;
  before/after snapshots `spec-v3-2026-07-17/testrail-snapshots-2026-07-17/`; audit
  log `spec-v3-2026-07-17/testrail-update-log.md`). **NO section renames** — the 4
  sections still named "History log*" ("History log", "History log — visibility",
  "History log — permission", "History log — Processing Fee") are an OPTIONAL
  "Audit log…" rename candidate needing separate authorization.
- **requirements.md: §17 "V1_3 update (2026-07-17)" appended** (mirrors the §16 V1_2
  pattern; carries the new change-log row verbatim + Δ1/Δ2 + the 2 Chris ambiguities;
  requirements.md is now the V1_3 baseline, last-update-wins). The
  `spec-v3-2026-07-17/` folder stays as the delta record (`requirements-v3.md` = full
  decoded V1_3).
- **TICKET 3 bug draft reworded** to "audit log (Work Order Log)" terminology
  (`jira-bug-drafts.md`; defect unchanged, still ready to file).
- **Deliverables regenerated:** `gen_blockers.py` + `gen_import.py` +
  `gen_fresh_viu_workbook.py` (diffs confirmed limited to exactly the affected rows:
  import 11 rows, FreshVIU 15 rows incl. the 4 notes-only, Tracker 8 title rows);
  `testrail-id-map.csv` titles/sections refreshed from the case source (all 183 C-ids
  preserved — no ID blanking). Import still VIU-word-free + feature-flag-free (0/0).
- **Tally UNCHANGED: 135 VIU-Verified / 15 VIU-Deviation / 12 Blocked-NotBuilt /
  20 Blocked-Env / 1 VIU-Pending = 183.** Zero conflicts with Chris's Round-2 answers;
  no FDBUG/dup-pair impact.
- **NEW OPEN QUESTIONS for Chris (send with the next PO round — spec-diff §H,
  layman-phrase per Rule 7):** (a) which "second place" gets the note+gate — the
  change-log says "the template dialog" but the §5-R15 body says the Processing Fee
  dialog (S8-R11), and the plain template dialog's own Taxable control (S7-R12f)
  carries no §5-R15 reference despite "Below every Taxable control"; (b) the gate is
  unobservable at the WO Add/Edit dialog (Stories 1/2 already require See Financial
  Data to open it) — confirm the admin template/Processing-Fee dialog is the intended
  place a restricted user would otherwise see the Taxable control without the note.

### 0.0d SPEC V1_3 + DESIGN ZIPS INGESTED (ANALYSIS ONLY) + EPIC CONFIRMED — 2026-07-17 (prior same-day event)

- **Epic = SV-7387 — USER-CONFIRMED 2026-07-17** (was previously known only as the
  env/API naming; now an explicitly confirmed project fact). Canonical Confluence
  spec URL unchanged. PO = Chris Ward.
- **Spec V1_3 ingested** (`730081de-FeesDiscountsV1_3.doc`) → complete decoded spec
  saved to `build/fees-discounts/spec-v3-2026-07-17/requirements-v3.md`
  (`requirements.md` NOT yet updated — apply pass pending user authorization).
  **Delta vs V1_2 = ONE change-log row (2026-07-14) with TWO changes:**
  Δ1 §5-R15 jurisdiction note gated to See Financial Data (does NOT legitimize the
  FD-WO-016 deviation — note still not built for an SFD admin); Δ2 Story 10
  "history log" → "audit log" rename (terminology only; gates unchanged; build
  already labels the menu 'Audit Log' / page 'Work Order Log'). **Zero conflicts
  with Chris's Round-2 answers; no impact on FDBUGs, the 12 Not-Built, or the
  FD-CUST-016/FD-VAL-007 dup pair.** Full delta + per-case map + scope estimate:
  `build/fees-discounts/spec-v3-2026-07-17/spec-diff-v3-2026-07-17.md`
  (~11 case edits [2 substantive + 9 cosmetic] + 1 new-case candidate + 0 retires +
  0 status flips; 2 spec ambiguities flagged for Chris in its §H).
- **Design zips Work_Order_4/5/6 (2026-07-17) = byte-identical re-uploads** of the
  already-ingested Work_Order design bundle (all 7 zips share one per-file CRC
  set) — ZERO new design content. Evidence:
  `build/fees-discounts/spec-v3-2026-07-17/design-new-notes.md`.
- **NO case edits, NO TestRail writes this pass** (analysis + ingestion only).

### 0.0c CHRIS WARD ROUND-2 ANSWERS RETURNED + APPLIED — 2026-07-14 (NEWEST event)

**Chris Ward returned the filled Round-2 sheet** (source saved verbatim to
`chris-round2-answers-source.xlsx` / `.csv`). **Answers: Q1=A, Q2=A, Q3=A, Q4=B.**
The §0.1 pre-decided action map was applied to **LOCAL artifacts only — NO TestRail
writes** (TestRail case edits still need FRESH one-day authorization; 6 cases are
staged and listed below).

Per-question outcome (verbatim answers in `PO-Questions-Round2.md` + full quotes in
`jira-bug-drafts.md` / `reconciliation-actions.md`):

- **Q1 = A** (over-sized discount / FDBUG-15): PO says the warn/confirm is required
  AND already exists — it fires **before invoicing and before mark-reviewed/complete**,
  NOT when the adjustment is merely added (add is uncommitted; the Add dialog preview
  shows resulting totals). Our FDBUG-15 "silent save" was observed at **add time = the
  wrong trigger point**. **FDBUG-15 reclassified NOT-A-DEFECT; NO dev ticket created**
  (the potential "new Q1 ticket" is NOT created). **FD-QB-014 (C28557)** expected
  reworded to the commit-point warning; **status VIU-Deviation → VIU-Pending → VIU-Verified
  (settled 2026-07-14, fresh qb cookies — the invoice/complete warn/confirm is BUILT and firing;
  see the SETTLED note below).** FD-QB-012 / FD-QB-015 unchanged.
- **Q2 = A** (maxCap 0 / FDBUG-9): 0 = "no limit" is working as designed (S2-R25; a true
  $0 cap only from legacy data). **FDBUG-9 closed accepted; jira draft TICKET 4 DROPPED.**
  **FD-CALC-008 (C28575), FD-VAL-006 (C28604), FD-TMPL-011 (C28512)** expecteds reworded
  to affirm 0 = no cap; **all flipped VIU-Deviation → VIU-Verified.**
- **Q3 = A** (tiny-% rounding / FDBUG-10): quiet round-up to the 0.01% minimum is
  fine/expected. **FDBUG-10 closed accepted; jira draft TICKET 5 DROPPED.** **FD-CALC-006
  (C28573)** expected reworded to expect the coercion; **flipped VIU-Deviation →
  VIU-Verified.**
- **Q4 = B** (pfee minimum / FD-PROC-014): processing fees do not support a minimum and
  the app already makes that clear — no minimum field in the UI + the API rejects a pfee
  minimum with an explicit error ("A processing fee cannot have a minimum or maximum
  cap"), matching the live 2026-07-13 finding (older 2026-07-10 "silent strip" reading
  superseded, last-update-wins). **FD-PROC-014 (C28532)** expected reworded to the
  explicit-reject + no-field behavior; **stays VIU-Verified.** No dev ticket.

**Cases PUSHED to TestRail 2026-07-14 (6/6, QA-lead one-day authorization; update_case
ONLY; each update 200 / re-verify 200 MATCH; audit `testrail-round2-push-log.md`)** —
each carries `fresh_run: 2026-07-14`: **FD-QB-014 (C28557), FD-CALC-008 (C28575),
FD-VAL-006 (C28604), FD-TMPL-011 (C28512), FD-CALC-006 (C28573), FD-PROC-014 (C28532).**
(All 6 differed in custom_preconds/steps/expected → updated; title/refs no-op.)

**FD-QB-014 commit-time re-VIU (Step 2) — SETTLED 2026-07-14 (fresh qb cookies) = VIU-Verified.**
Chris's Q1=A commit-point warn/confirm is CONFIRMED BUILT and firing. Method (no browser in
env, and the warn/confirm is a FE modal that gates the commit API call, so API-only can't reveal
it): captured the live FE bundle from `qb.qa.shopview.com` and did a live reversible API check.
- **ADD-TIME SILENT (expected #1 ✓):** the Add/Edit dialog component `AdjustmentDialog.S8gN6cAn.js`
  has NO over-discount warning and does not import the warning dialog (only an unrelated
  "A percentage discount cannot exceed 100%" per-field check) → adding an over-sized discount is silent.
- **COMMIT-TIME WARN/CONFIRM BUILT (expected #2 & #3 ✓):** dedicated component
  `OverDiscountWarningDialog.BCmTBE33.js` — title **"Discount exceeds subtotal"**; body: *"The total
  discount exceeds this work order's subtotal. The subtotal will be reduced to $0.00, but any tax on
  the taxable base is still owed. The remaining $<excess> will be carried as a customer credit.
  Continue?"*; buttons **Continue / Cancel** (emits confirm/cancel). It is imported + wired in
  `Invoice.Ny62BJnd.js`: the Create-Invoice handler (`Lt`→`_a`) AND the mark-reviewed/Complete
  handler (`Vt`→`ga`, posts `status:'complete'`) BOTH intercept when the gate is true
  (`FeesAndDiscounts` flag ON && not partSale && `adjustmentsSummary.excessCreditAmount>0`), open the
  dialog, and only run the commit on **Continue** / abort on **Cancel** → mandatory confirm at BOTH
  commit points, never silent.
- **LIVE DATA CONDITION:** on WO **S-15970** added a $9,999 whole-WO flat discount (reversible
  ZZAUTOTEST, removed after) → `sub_total` floored to **$0.00**, `adjustmentsSummary.excessCreditAmount`
  = **9522.26** (>0) ⇒ the gate evaluates TRUE, so the dialog fires at the commit points. WO restored
  byte-identical to baseline.
- **Verdict: VIU-Verified.** FDBUG-15 stays NOT-A-DEFECT. **NO TestRail write** — the commit-point
  expected pushed 2026-07-14 is already build-accurate (floor $0.00 + tax on taxable base still owed +
  exact excess as customer credit + must confirm); it does NOT differ from the built dialog, so the
  status flip is local only. (Exact on-screen labels now captured for the record: dialog "Discount
  exceeds subtotal", buttons "Continue"/"Cancel".)

**Tickets:** TICKET 4 (Q2) + TICKET 5 (Q3) **DROPPED** (WAD/expected per PO; annotated
in `jira-bug-drafts.md`); **no new tickets** created (Q1 warning exists per PO; Q4 no
defect). Previously-cleared ready-to-file drafts are unchanged: TICKETS 2, 3, 6, 7,
8, 9, 10, 11 remain **ready to file**; TICKET 1 stays **ON HOLD** (US-tax re-repro).

**Tally impact — APPLIED + deliverables regenerated 2026-07-14:** 4 cases flipped
Deviation → Verified (Q2×3 + Q3×1) and 1 Deviation → Pending (Q1). Net: VIU-Deviation
20 → 15, VIU-Verified 130 → 134, VIU-Pending 1 → 2. (FD-PROC-014 was already Verified;
its expected changed only.) Interim tally 134/15/12/20/2 = 183. **THEN (later same day) the
FD-QB-014 commit-time re-VIU was SETTLED = Verified (Pending → Verified): final tally
135 VIU-Verified / 15 VIU-Deviation / 12 Blocked-NotBuilt / 20 Blocked-Env / 1 VIU-Pending
(FD-PART-005) = 183** (Blockers Tracker regenerated; Deviation sub 10 case-update + 3
PO-question + 2 code-bug). `gen_blockers.py` / `gen_import.py` / `gen_fresh_viu_workbook.py`
all re-run.

**Remaining before finalization:** (1) ~~fresh one-day TestRail authorization → push the 6
staged cases~~ **DONE 2026-07-14 (6/6, 200/200)**; (2) ~~regenerate the downstream
deliverables~~ **DONE 2026-07-14**; (3) ~~FD-QB-014 commit-time re-VIU needs fresh qb
cookies~~ **DONE 2026-07-14 (later, fresh cookies) — SETTLED VIU-Verified**; (4) the
standing env/VIU backlog (§0.5 steps 6–7) is unchanged by these answers.

### 0.-1 SPEC-RELEVANCE / OBSOLESCENCE AUDIT — 2026-07-13 (NEWEST event)

Ran `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` END-TO-END over all **183**
cases (audit doc: `spec-relevance-audit-2026-07-13.md`).
- **Case suite is CLEAN of stale spec-wording** — 0 OBSOLETE, 0 MISSED
  NEEDS-UPDATE, 0 CONTRADICTS; 181 RELEVANT; **1 DUPLICATE/OVERLAP pair**
  (FD-CUST-016 / FD-VAL-007) flagged as RETIRE candidates (snapshotted to
  `testrail-snapshots-relevance-2026-07-13/`, needs QA-lead ruling — NOT deleted).
  The removed "% of Labor + Parts" method, the old legal-disclosure block, and
  per-template QB mapping are correctly ABSENT / asserted-as-absent (see audit doc).
- **The gap was in DELIVERABLES, not cases** (the exact failure this process
  catches): `testrail-id-map.csv` carried **156 stale (pre-wording-pass) titles**
  and one TestRail section (**3928**) was still named "Processing Fee — taxable +
  **legal disclosure**". **FIXED:** id-map titles + section column regenerated from
  the current case source; **TestRail section 3928 renamed** to "…jurisdiction note"
  via `update_section` (200/200, verified).
- **Deliverables regenerated** from current cases (`gen_import.py`, `gen_blockers.py`,
  `gen_fresh_viu_workbook.py`) and **grep-verified stale-clean** (0 hits on
  pricing-view/WO-change/customer-change/generic-change/history permission
  euphemisms, legal-disclosure/sign-off/auto-translate; import CSV/xlsx also 0
  "feature flag"/"VIU"). Allowed residual = dated evidence-column history notes +
  legitimate flag-gating refs + status values (see audit doc §Grep-verify).
- **TestRail this pass:** 1 `update_section` (200/200) + 2 read-only `get_case`
  snapshots; **0 `update_case`** (case content already current from the wording
  pass); 0 moves/deletes/results. Log: `testrail-relevance-audit-log-2026-07-13.md`.

### 0.0 V1_2 spec applied to LOCAL cases — 2026-07-13 (newest event)

The V1_2 spec doc (`spec-source-2026-07-10.md`, Change-Log 2026-07-12) was ingested
and reconciled in `spec-v2-reconciliation.md`. On **2026-07-13** the QA-lead-authorized
V1_2 edits were applied to the **LOCAL case files** (`cases/*.json`) and requirements:

- **43 existing cases updated + 1 new case (FD-WO-016):**
  - **A — 5 firm permission rewrites:** FD-PERM-001 (See Financial Data; drop pricing-view
    euphemism), FD-PERM-003 (Work Order Lines: Create and Edit), FD-PERM-004 (Part Sales:
    Create and Edit + See Financial Data; whole-sale AND part-line per S13-R5; still
    Not-Built), FD-PERM-008 (Customer Management: C&E + Manage AP/AR), FD-PROC-004
    (expected rewritten to the §5-R15 jurisdiction note per S8-R13; old legal-disclosure
    block removed; folds in the Processing-Fee §5-R15 check).
  - **B — 10 history-log gating cases flipped per S13-R10** (WO-level history →
    **Work Orders: Create and Edit**; line history → **Work Order Lines: Create and Edit**;
    was View History Logs): FD-PERM-009 + FD-HIST-006 (full flips); FD-HIST-001/002/003/004/005/007/008
    + FD-FLAG-002 (prereq/gate-name; independence assertions kept).
  - **D — 28 cosmetic wording-sweep** ("change permission" → "matching Create and Edit
    permission", S13-N2) in preconditions/steps; behavior + viu_status unchanged.
  - **C — 1 new case FD-WO-016** (§5-R15 taxable jurisdiction note in the Add/Edit dialog,
    S2-R26a; FUNCTIONAL section, not API). The Processing-Fee dialog §5-R15 check was
    **folded into FD-PROC-004** (so 1 new case, not 2).
- **requirements.md:** appended dated **§16 "V1_2 update (2026-07-13)"** delta (§5-R15
  exact string; S13-R10 history flip; exact SV-7388 names for Stories 1/3/4/9/10/11;
  S13-R4/R5/R6/N2; S13-R11 table retired / §10.2 superseded). V1_1 body kept for
  traceability (last-update-wins: §16 governs).
- **Re-VIU-PENDING set (now DONE):** the 10 history cases + FD-WO-016 + the whole FD-PERM-*
  suite were all re-run live in the §0.0a wording+VIU pass (roles matrix re-derived first —
  `roles-matrix-2026-07-13.md`). Only remaining Pending = FD-PART-005 (line-create 500).
- **Chris Ward's Round-2 answers are STILL BLANK** — §0.1 action map unchanged / not applied.
- **Deliverables regenerated (INTERIM) — final counts after the §0.0a pass:**
  `testrail-import/fees-discounts-v1-testrail-import.csv`/`.xlsx` (183 cases; VIU=0,
  feature-flag=0), `FeesDiscounts_Blockers_Tracker.md`/`.xlsx` (carries TestRail Case ID +
  Link columns; **130 Ready / 20 Deviation / 12 Not-Built / 20 Env / 1 VIU-Pending = 183**),
  `FeesDiscounts_FreshVIU_2026-07-10.xlsx`/`.csv` (normalized). **NOTE:** the master authoring
  workbook `FeesDiscounts_V1_TestCases.xlsx` (build_workbook.py) was NOT regenerated — it
  carries hardcoded "182 / 62-verified" narrative; a manual pass is a follow-up.
- **TestRail push for this V1_2 batch:** authorized by the QA lead on 2026-07-13 — see the
  per-case audit log `testrail-v1_2-push-log.md`.

### 0.0a WORDING+VIU PASS 2026-07-13 (newest event — build-accurate + layman for a new manual tester)

QA-lead-authorized combined pass (Standing Rule 9): rewrite Title/Preconditions/Steps/Expected
to the EXACT on-screen build labels (captured live from `qb.qa.shopview.com`) in plain layman
language, VIU-verify behavior, push corrected wording to TestRail (update_case only), area by area.

- **ALL 15 functional areas / 183 cases now wording-corrected + VIU'd + pushed to TestRail
  (all update_case 200/200, 0 errors across the whole pass):** FD-WO(16), FD-FIN(5),
  FD-INLINE(5), FD-STATS(5), FD-REMOVE(3), FD-EDIT(3), FD-VAL(7), FD-STACK(3), FD-CALC(17),
  FD-TMPL(17), FD-CUST(17), FD-LABOR(7), FD-PART(8), FD-PROC(14), FD-DOC(11), FD-PCOL(7),
  FD-FLAG(3), FD-HIST(8), FD-PERM(11), FD-QB(16). Roles matrix re-derived live before FD-HIST/
  FD-PERM (`roles-matrix-2026-07-13.md`).
- **FINAL TALLY (Blockers Tracker, 2026-07-13): 130 VIU-Verified / 20 VIU-Deviation / 12
  Blocked-NotBuilt / 20 Blocked-Env / 1 VIU-Pending = 183.** (Deviation sub: 5 code-bug + 3
  PO-question + 12 case-update; Not-Built: Story 8 pfee builder ×4 + Story 11 Part Sales ×8;
  Env: 14 QuickBooks + 6 flag-off/shared-env; Pending: FD-PART-005.)
- **Notable NEW live findings this pass:** template admin is under **FINANCE → Fees & Discounts**
  (not "Service, below Canned Lines"); the BE accepts `processing_fee`/rejects pfee min/max cap +
  disallowed method (exact messages captured); the estimate Subtotal INCLUDES adjustments (FDBUG-1
  not reproduced); the §5-R15 jurisdiction note is ABSENT (FD-WO-016); menu options are
  Edit/Remove (not Delete); Remove confirm 'Remove Fee / Discount' / 'Are you sure you want to
  remove this fee?'; history UI 'Work Order Log' renders 'Fee added'. Technician DRIFTED (now has
  WO/Lines Create&Edit) → WO-C&E/Lines-C&E permission NEGATIVES not testable here.

**(Superseded) earlier 6-area checkpoint note:**
- **Live-captured build glossary:** `wording-glossary-2026-07-13.md`; screenshots in
  `screenshots/wording-2026-07-13/`; per-case audit `testrail-wording-viu-log.md`.
- **Notable build terms that differed from our older wording (now corrected):** ⋯ menu item
  **'Add Fee/Discount'** (was "Add Work Order Fee / Discount"); dialog **'Add new fee/discount'**
  (was "New Fee / Discount"); **'Apply From Template'**; Calculation Type options are exactly
  **Flat Amount / % of Labor Total / % of Parts Total / % of Subtotal** (no "Percentage", no
  "% of Grand Total"); amount field **'$ Amount'** vs **'Percent %'**; **'$ Max Amount (Optional)'**
  (% only); **'Taxable' is a toggle** (not a dropdown); sidebar card **'WO Fees & Discounts'**
  (was "Work Order Fee / Discount"); ⋮ menu options **'Edit' / 'Remove'** (was "Edit/Delete");
  Remove confirm **'Remove Fee / Discount' / 'Are you sure you want to remove this fee?'**;
  Edit dialog **'Edit Fee / Discount'** with Type + Calculation Type **locked** and a **'Save'**
  button; preview empty prompt **'Enter an amount to see the impact.'**
- **New/confirmed findings this pass:** FD-WO-016 — the §5-R15 tax-jurisdiction note is **NOT
  shown** below the Taxable toggle (checked Flat Amount + % of Subtotal) → flipped to
  VIU-Deviation. Re-confirmed live: BUG-FD-4 (Add button enabled on empty form; FD-WO-005 /
  FD-VAL-001). Flipped to Verified after wording match: FD-WO-001, FD-FIN-004, FD-REMOVE-001.
- **Tally after this pass (from the Blockers Tracker / cases):** **112 VIU-Verified / 30
  VIU-Deviation / 12 Blocked-NotBuilt / 18 Blocked-Env / 11 VIU-Pending = 183.** Deliverables
  regenerated (`gen_blockers.py`, `gen_import.py`, `gen_fresh_viu_workbook.py`).
- **REMAINING areas for the wording+VIU pass (not yet done — need their own screen captures /
  a re-derived roles matrix):** FD-LABOR, FD-PART, FD-CALC, FD-TMPL, FD-CUST, FD-PROC, FD-DOC,
  FD-HIST, FD-PERM, FD-FLAG, FD-QB, FD-PCOL. Resume checkpoint = the committed `cases/*.json`
  `fresh_run:2026-07-13` + `testrail-wording-viu-log.md` (skip areas already logged tester-ready).
- **Chris Ward's Round-2 answers STILL BLANK** — §0.1 action map unchanged.

### 0.1 Waiting on: Chris Ward's answers to `PO-Questions-Round2.xlsx` (4 questions) — **ANSWERED + APPLIED 2026-07-14 (see §0.0c); map below retained for traceability**

- **What was sent:** `build/fees-discounts/PO-Questions-Round2.xlsx` (+ `.md`;
  generator `gen_po_questions_round2.py`) — 4 plain-language product decisions
  raised by the fresh full VIU pass 2026-07-10. **The user will share the filled
  file back** — that is the resume trigger.
- **Resume = apply this PRE-DECIDED action map** (condensed from the Round-2 QA
  Internal Mapping at the bottom of `PO-Questions-Round2.md` — read that for full
  spec refs/evidence). **NOTE: every TestRail edit below requires FRESH one-day
  user authorization at execution time** — the 2026-07-09/10 authorization is
  spent (standing rule: never write to TestRail without explicit permission).

| Q | Topic (internal ref → cases) | Answer → action | TestRail cases to update |
|---|---|---|---|
| **Q1** | Over-discount saves silently, no warn/confirm (**FDBUG-15** → FD-QB-014; companions FD-QB-012 floor / FD-QB-015 credit) | **A (add warning):** keep spec expected on FD-QB-014 (stays Deviation until dev fix); DRAFT + release a **NEW dev ticket** for the missing S6-R12 warn/confirm (no draft exists yet — write it then). **B (silent OK):** case-update FD-QB-014 expected → silent save + exact customer credit; flip to Verified; update C28557 (align C28555/C28558 wording only if touched). | [C28557](https://shopview.testrail.io/index.php?/cases/view/28557) (+ [C28555](https://shopview.testrail.io/index.php?/cases/view/28555), [C28558](https://shopview.testrail.io/index.php?/cases/view/28558) companions) |
| **Q2** | maxCap 0 stored but ignored = "no limit" (**FDBUG-9** → FD-CALC-008, FD-VAL-006, FD-TMPL-011; **held draft = jira-bug-drafts.md TICKET 4**) | **A (0 = no limit):** case-update all 3 expecteds to "0 = no cap"; **DROP TICKET 4**; flip cases to Verified; update the 3 C-cases. **B (cap at $0.00):** **FILE TICKET 4 as drafted** (§5-R6 wins); cases keep spec expected (stay Deviation until fix). **C (refuse 0):** new validation requirement — revise TICKET 4 to "reject 0", case-update all 3 expecteds to rejection; update the 3 C-cases. | [C28575](https://shopview.testrail.io/index.php?/cases/view/28575), [C28604](https://shopview.testrail.io/index.php?/cases/view/28604), [C28512](https://shopview.testrail.io/index.php?/cases/view/28512) |
| **Q3** | Below-minimum percent silently coerced up to 0.01% (**FDBUG-10** → FD-CALC-006; **held draft = TICKET 5**) | **A (rounding fine):** case-update FD-CALC-006 to expect coercion; **DROP TICKET 5**; flip to Verified; update C28573. **B (store exact):** revise TICKET 5 to a store-exact dev change (likely new precision spec); case gets exact-value expected. **C (reject):** **FILE TICKET 5 as drafted**; case keeps spec expected (Deviation until fix). | [C28573](https://shopview.testrail.io/index.php?/cases/view/28573) |
| **Q4** | Processing-fee minimum silently stripped on create (no FDBUG — §8 no-minimum invariant holds; deviation = silent-ignore vs explicit reject → FD-PROC-014, currently Verified with a standing wording note) | **A (support pfee minimums):** spec/data-model change — annotate `requirements.md`, author NEW pfee-minimum cases, update C28532 expected. **B (don't support, but make clear):** case-update FD-PROC-014 to expect explicit reject / absent field (vs today's silent strip); update C28532; optionally a low-sev dev tweak ticket for the silent strip. | [C28532](https://shopview.testrail.io/index.php?/cases/view/28532) |

### 0.2 Fresh-pass state — CURRENT = 2026-07-13 (§0.0a); prior = 2026-07-10

- **CURRENT authoritative tally (2026-07-14, after Chris's Round-2 answers applied +
  the 6 Round-2 cases pushed to TestRail + FD-QB-014 commit-time re-VIU SETTLED): 135
  VIU-Verified / 15 VIU-Deviation / 12 Blocked-NotBuilt / 20 Blocked-Env / 1 VIU-Pending
  (FD-PART-005) = 183.** (Supersedes the interim same-day 134/15/12/20/2 and the 2026-07-13
  130/20/12/20/1.) See §0.0c for detail.
- **Prior pass (2026-07-10, 182 cases): 114 / 35 / 12 / 20 / 1** — historical; superseded
  by the 2026-07-13 final above. Detail (deliverables paths) below.
- **Deliverables at pause** (paths relative to repo root):
  - `build/fees-discounts/FeesDiscounts_FreshVIU_2026-07-10.xlsx` / `.csv` —
    tester-facing fresh-pass workbook (generator `gen_fresh_viu_workbook.py`).
  - `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md` / `.xlsx` — per-case
    source of truth (regenerate: `python3 build/fees-discounts/gen_blockers.py`).
  - `build/fees-discounts/PO-Questions-Round2.md` / `.xlsx` — the sheet sent to
    Chris (PO-facing 4 questions + QA-only internal mapping in the `.md`).
  - `build/fees-discounts/jira-bug-drafts.md` — 11 plain-language dev-ticket
    drafts **with hold flags** (see §0.3; user files via Atlassian — unreachable
    from this env).
  - `build/fees-discounts/testrail-viu-sync-log.md` — 2026-07-10 authorized sync
    audit: 114 Verified cases gated, **0 updates needed (all no-op)**.
  - `build/fees-discounts/fresh-viu-2026-07-10/` — raw probe JSONs (P1–P6 +
    templates baseline; the 4 line-create-500 requestIds live here).
  - Audit logs: `testrail-po-clarify-log.md`, `testrail-caseupdate-log.md`,
    `section-rename-log.md`, `testrail-fd-api-section-move-log.md`.
  - `build/fees-discounts/testrail-id-map.csv` — all FD-ID→C# mappings.
- **2026-07-13 deliverables (V1_2 + wording+VIU pass):**
  - `build/fees-discounts/wording-glossary-2026-07-13.md` — live-captured exact build labels.
  - `build/fees-discounts/testrail-wording-viu-log.md` — per-case audit for the wording+VIU
    push (all 15 areas / 183 cases; every area logged `N updated · 0 error`).
  - `build/fees-discounts/testrail-v1_2-push-log.md` — per-case audit for the V1_2 batch
    (43 updates + new FD-WO-016=C29441).
  - `build/fees-discounts/roles-matrix-2026-07-13.md` — freshly re-derived roles matrix
    (records the Technician drift).
  - `build/fees-discounts/screenshots/wording-2026-07-13/` — build screenshots for the pass.

### 0.3 Other open threads at pause

**Dev tickets (`jira-bug-drafts.md`; the USER files them — Atlassian unreachable here):**
- **CLEARED — ready to file now (not gated on Chris):** TICKET 2 (FDBUG-2 pfee
  base includes whole-WO adjustments — re-confirmed live 2026-07-10), TICKET 3
  (FDBUG-3 auto-applied adjustments write no history — re-confirmed), TICKET 6
  (FDBUG-14 part-line dialog label defects), TICKET 7 (BUG-FD-3 whole-WO FE-only
  enforcement — dev-routing; finding stands from pass A but is currently NOT
  re-testable, see role drift below), TICKETS 8–11 (round-1 PO-confirmed defects:
  Stats per-row, Add disabled-until-valid, show-more collapse, missing
  Processing-Fee builder UI).
- **HELD on Chris's Round-2 answers:** TICKET 4 (Q2) and TICKET 5 (Q3); plus a
  potential NEW Q1 ticket (over-discount warning) that exists only if Q1=A.
- **DROP/CLOSE recommended:** TICKET 1 (FDBUG-1 totals bug) — NOT reproduced on
  3 consecutive passes; FD-DOC-011 now Verified; residual work is the GST→US-tax
  re-word of FD-EDIT-002 / FD-DOC-011 / FD-CALC-011 / FD-CALC-014 (reconciliation
  group D), not a bug filing.
- **FDBUG-12 CONFIRMED FIXED** 2026-07-10 (API-created customers now inherit
  auto-apply defaults). **FDBUG-16 NEW** (raw API accepts an empty-name adjustment
  201 while the UI blocks — FE-only guard, low sev; regression vs batch-3's 400):
  no draft yet — decide at resume whether to draft or bundle (same pending call as
  register-only FDBUG-11/FDBUG-13).

**Env issues to hand dev (environment, not F&D code):**
- **WO line-create 500** env-wide — 4 requestIds captured in the
  `fresh-viu-2026-07-10/` probe JSONs; blocks FD-PART-005 + seeding fresh
  invoiceable WOs.
- **QB unmap 500** — `PUT /api/bookkeeping/settings {settings:{feeItemId:null}}`
  500s; the mapping-guard cycle FD-QB-004..008 cannot be driven.
- **QB export failure on duplicate document numbers** (re-invoiced WOs never
  reach QuickBooks).
- **Technician role DRIFTED on the shared qb env** (now has
  `workOrdersCreateAndEdit` + `workOrdersDelete`) — the `/tmp/fdcln/roles-matrix.json`
  derivations are STALE; **re-derive the roles matrix before ANY permission
  retest** (BUG-FD-3 / FD-PERM re-checks are invalid until then).

**Human / env-window items:**
- **~14 QB-UI eyeball checks need a human logged into QuickBooks** (no QB read
  API): FD-QB-001..011, 013, 016 line internals + FD-QB-015's goodwill-memo half
  + FD-CALC-017's penny-cap half.
- **6 flag-off / shared-env cases deliberately NOT run** while the manual tester
  is active on the shared env (FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012) —
  need a coordinated flag-off window.
- **Leftover ZZ-tagged shells (harmless, documented in §6):** WO **S-15947**
  (`b7c9e9a5…`; Completed → undeletable, stripped to 0 lines / 0 adjustments / $0)
  and customer **"ZZAUTOTEST FD Fresh710"** (`b881540e…`; empty shell, undeletable
  due to an orphan contact with no discoverable API).

### 0.4 Env / access facts for the resume session

- **Cookies are EPHEMERAL** — re-supply per session into `/tmp` only
  (`sv_sso_session` + `PHPSESSID` + `cf_clearance`, domain `.qa.shopview.com`).
  Never in the repo.
- **The env sleeps** — wake with
  `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
  {action:'wake',env:'sv7387'}`, then poll the API root `/` for 200 (~60s).
- **Poisoned-PHPSESSID fix** — if every request 500s, mint a fresh quick-login
  WITHOUT the old PHPSESSID; avoid `POST /api/iam/change-location`. Full working
  recipe: `build/APP-ACTIONS-PLAYBOOK.md`.
- **TestRail sync** — `build/fees-discounts/testrail_viu_sync.py` is idempotent
  (gates on the gen_import.py rules; the 2026-07-10 run was 114 gated / 0 updates,
  all no-op), but **every run needs fresh explicit user authorization that day**.
  ID source: `testrail-id-map.csv`.

### 0.5 How to resume (ordered checklist) — updated 2026-07-14 (post-Round-2)

**Chris Ward's Round-2 answers are DONE (applied + pushed to TestRail 2026-07-14; FD-QB-014
Verified — §0.0c). No PO catch-up and no TestRail catch-up is outstanding.** The remaining
work, in order:

1. **Get a QA-lead ruling on the FD-CUST-016 (C28500) / FD-VAL-007 (C28605) DUPLICATE PAIR**
   (keep one / retire one). Snapshotted to `testrail-snapshots-relevance-2026-07-13/`; NOT
   deleted. If retire is approved, ask for fresh one-day TestRail authorization, then
   `delete_case` / mark-obsolete the loser and regenerate deliverables.
2. **Hand the user the ready-to-file bug drafts** (`jira-bug-drafts.md`): TICKETS
   2/3/6/7/8/9/10/11 are cleared to file via Atlassian (unreachable from this env → the
   user files them). TICKET 1 (FDBUG-1) stays ON HOLD pending a US-tax re-repro; TICKETS 4
   & 5 are DROPPED (Chris Q2=A / Q3=A); FDBUG-15 dropped (not-a-defect, Chris Q1=A).
3. **When fresh qb cookies are supplied:** get admin (+ retest the FLAKY tech quick-login)
   cookies into `/tmp`, rebuild the boot2 harness.
4. **Reset the drifted Technician role + re-derive the roles matrix** BEFORE any
   permission/history retest (Technician on the shared qb env now has WO/Lines Create&Edit
   + Delete → WO/Lines permission NEGATIVES are not testable until reset;
   `roles-matrix-2026-07-13.md` records the drift).
5. **Work the remaining VIU backlog as the env allows:** 20 Blocked-Env (needs the
   unmap-500 fix for FD-QB-004..009, a human QB-UI eyeball for the 14 QB checks, and a
   flag-off/tester-free window for the 6 shared-env cases) + 1 VIU-Pending FD-PART-005
   (needs the env-wide WO line-create-500 fix). Also §5-R15 disclaimer / FD-WO-016
   (deviation until dev implements the tax-jurisdiction note), Story 8 pfee builder +
   Story 11 Part Sales (Not-Built) retest when dev ships.
6. **After ANY case-status change:** re-run `gen_blockers.py` → `gen_fresh_viu_workbook.py`
   → `gen_import.py` (+ `build_workbook.py`), run the spec-relevance grep-check, and
   regenerate ALL deliverables — spec-relevance reconciliation + deliverable-regen are
   MANDATORY closing steps (Standing Rules 10/11). Any TestRail write needs fresh one-day
   user authorization that day; append a per-case audit log.

**Env issues for dev (hand off):** env-wide WO line-create 500 (blocks FD-PART-005 +
invoiceable-WO seeding), QB unmap PUT 500 (blocks FD-QB-004..008 mapping-guard cycle), QB
export failure on duplicate document numbers (re-invoiced WOs never reach QuickBooks).

---

## 1. Summary

**What F&D V1 is:** ShopView **"Fees & Discounts V1"** — the ability to add
fees/discounts (and a Processing Fee) at the whole-work-order, labor-line, part-line
and part-sale levels, from reusable admin **templates**, with **customer defaults**
(auto-applied to new WOs), a defined **calculation contract** (§5), rendering on
customer estimates/invoices, a WO **history log**, **QuickBooks** sync, and a
**Story-13 permissions model** (See Financial Data + WO/Lines Create&Edit + Manage
AP/AR gates). Controlled per-org by the **`FeesAndDiscounts` feature flag**.

**Spec status:** `requirements.md` is the working spec extract **incl. Story 13
permissions** and the §5 calculation contract. (Historical note: an earlier source
PDF was truncated at Story 2; the current `requirements.md` covers the stories
exercised by the 182 cases — S1–S14 + §5 + §7/§9/§10/§13.)

**Env:** app `https://qb.qa.shopview.com` · API `https://sv7387api.qa.shopview.com`
(SV-7387) · **`FeesAndDiscounts` flag = ON**. **QuickBooks IS now CONNECTED (2026-07-09
batch-5 finding — supersedes the earlier "not connected"):** org "Staging Foothills Group
Inc", location **Staging Lethbridge - 4310** (= admin default_workplace; both org locations
`bookkeeping_enabled:true`); `adjustment-item-mapping-status` = connected + both items mapped;
real QB chart of accounts + unexported-items returned. **AVOID `POST /api/iam/change-location`** — batch-6
root-caused the recurring "sustained 500 incident": it is a **POISONED SHARED PHPSESSID**
(every request carrying it 500s; a fresh quick-login WITHOUT the old PHPSESSID mints a
working session), and change-location is the prime suspect trigger (500s began minutes
after it in both batch-5 and batch-6; admin default_workplace is already Lethbridge so it
is unnecessary). **The env also SLEEPS**: 302s to `sleep.qa.shopview.com`; wake with
`POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
{action:'wake',env:'sv7387'}` then poll the API root `/` for 200 (~60s).
Full env/access map: `viu-recon.md`.

**Overall status:** **CHRIS WARD'S ROUND-2 ANSWERS APPLIED + IN TESTRAIL 2026-07-14
(§0.0c); FD-QB-014 VIU-Verified. No longer PO-blocked — remaining open = the FD-CUST-016 /
FD-VAL-007 duplicate-pair QA-lead ruling + filing the ready bug drafts + the env/VIU
backlog (§0).** **FEATURE LIVE on qb; V1_2 SPEC APPLIED + FRESH FULL build-accurate
WORDING + VIU PASS DONE 2026-07-13** (all 183 cases re-adjudicated live with
live-captured build labels; every `viu_status` carries `fresh_run` + evidence; **ALL 183
pushed to TestRail via update_case, 200/200, 0 errors**), **+ the 6 Round-2 cases pushed
2026-07-14 (6/6, 200/200)**. **FINAL tally: 135 VIU-Verified / 15 VIU-Deviation / 12
Blocked-NotBuilt / 20 Blocked-Env / 1 VIU-Pending (FD-PART-005) = 183.**
(The 2026-07-13 tally 130/20/12/20/1 and the 2026-07-10 pass 114/35/12/20/1 over 182 are
historical — superseded.)
Fresh-pass deltas vs batch-6: **FD-DOC-011 → Verified** (FDBUG-1 NOT reproduced for the
3rd consecutive pass — doc Subtotal/GST/Total include adjustments and match the API
exactly; treat FDBUG-1 as fixed, residual = GST→US-tax re-word); **FD-QB-015 →
Blocked-Env with its in-app half VERIFIED** (invoicing an over-discounted WO recorded a
customer credit of exactly the excess −117.24; the QB goodwill-memo half is unobservable
— export fails on the duplicate-doc-number env bug and there is no QB read API).
**Re-confirmed live today:** FDBUG-2 (pfee base includes whole-WO adjustments — clean
discriminator: 3% pfee = 0.63 on a WO whose only money is a $20 whole-WO fee),
FDBUG-3 (+FD-HIST-007) auto-applied adjustments write no history, FDBUG-9 (maxCap 0 = no
cap), FDBUG-10 (0.005% coerced to 0.01%), FDBUG-15 (over-discount saves silently, no
warn/confirm), BUG-FD-4 (Add/Create buttons enabled on empty forms), BUG-FD-5 (no
Show-N-more), FDBUG-6 (Stats aggregate), Story 8 builder UI still missing (Type options =
Fee|Discount only), Story 11 Part Sales still absent (fresh part sale created + checked).
**NEW today: FDBUG-16** — the raw API now ACCEPTS an empty-name adjustment (201;
regression vs batch-3's 400) while the UI still blocks it (FE-only guard, low sev).
**FIXED today: FDBUG-12** — API-created customers now DO inherit auto-apply defaults.
**Env bugs persisting 2026-07-10:** WO line-create 500s env-wide (4 requestIds captured;
blocks fresh invoiceable WOs, FD-PART-005 and part-flow re-seeding); QB export of
re-invoiced WOs fails on duplicate document numbers; NEW: `PUT /api/bookkeeping/settings
{settings:{feeItemId:null}}` 500s → the mapping-guard cycle (FD-QB-004..008) cannot be
driven (unmap impossible). Technician role DRIFTED on the shared env (now has
workOrdersCreateAndEdit + workOrdersDelete; roles-matrix.json derivations need a re-pull
before reuse; BUG-FD-3 not re-testable). Remaining gates: **dev** (Stories 8/11 +
code-bug FDBUGs + line-create + duplicate-number export + unmap 500), **PO** (3
PO-question deviations), **QB-side UI inspection** (13 QB line cases + memo half +
penny-cap half), **flag-off window** (not taken — tester active on the shared env).
**TestRail:** on **2026-07-13** the V1_2 batch (43 updates + new FD-WO-016=C29441) AND the
full build-accurate wording+VIU pass (all 183 cases) were explicitly authorized and pushed
via `update_case` — **200/200, 0 errors** (audits: `testrail-v1_2-push-log.md`,
`testrail-wording-viu-log.md`). Prior: the 2026-07-10 fresh-run master-case sync
(`testrail-viu-sync-log.md`). **Any further write needs new one-day permission.**

---

## 2. Case inventory

**Total authored cases: 183** (source: the three `cases/*.json` files; tallied by the
Blockers Tracker). +1 vs the 2026-07-10 pass = new **FD-WO-016** (§5-R15 tax-jurisdiction
note, added in the V1_2 batch; C29441).

**By authoring group (`cases/*.json`):**

| Group file | Count | Scope |
|---|---:|---|
| `group-A-wo-parts.json` | 62 | WO whole-WO / labor-line / part-line adjustments, inline display, Stats, Financial Info card, Parts-page column + breakdown modal, edit/remove/stacking (incl. new FD-WO-016) |
| `group-B-customer-admin-finance.json` | 83 | Customer Fees&Discounts tab + defaults lifecycle, Template admin (create/edit/delete/scoping/validation), Processing Fee, customer documents (estimate/invoice, Shop Supplies), QuickBooks, History log |
| `group-C-calc-permissions-validation.json` | 38 | §5 calculation contract, Story-13 permissions, feature-flag gating, validation / edge |
| **TOTAL** | **183** | |

**By delivery state (from the Blockers Tracker, 2026-07-14 FINAL):**

| State / bucket | Count | Meaning |
|---|---:|---|
| **VIU-Verified (READY)** | **135** | wording+VIU pass + Round-2 flips: exercised (or evidence re-validated) with build-accurate wording; matches spec |
| **VIU-Deviation** | **15** | Built but deviates from spec (2 code-bug + 3 PO-question + 10 case-update) |
| **Blocked — DEV NOT BUILT** | **12** | Story 8 Processing-Fee builder UI (4) + Story 11 Part Sales (8) |
| **Blocked — ENV** | **20** | QuickBooks internals/unmap-500 (14 incl. FD-QB-015's memo half + FD-CALC-017's QB half) + flag-off/shared-env (6: FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012) |
| **VIU-Pending** | **1** | FD-PART-005 (receive-transition; env-wide WO line-create 500 persists + completed-line lock) |
| **TOTAL** | **183** | 135 verified + 48 not-yet-verified |

**VIU-Deviation (15) sub-split — 2026-07-14 FINAL** (tallied by the Blockers Tracker: 2
code-bug + 3 PO-question + 10 case-update; the per-case assignments are authoritative in
`FeesDiscounts_Blockers_Tracker.md`):

| Sub-bucket | Count | Notes |
|---|---:|---|
| **code-bug** (needs a dev fix) | 2 | FDBUG-2 (pfee base), FDBUG-3 (auto-apply no history). (FDBUG-9 / FDBUG-10 flipped Verified per Chris Q2=A / Q3=A; FDBUG-15 dropped not-a-defect per Q1=A → FD-QB-014 Verified; FDBUG-1/FD-DOC-011 dropped — Verified; FDBUG-16 low-sev noted on Verified cases.) |
| **PO-question** (needs a product ruling) | 3 | FD-STATS-001 (Stats layout, BUG-FD-2); FD-PERM-002 + FD-WO-013 (whole-WO FE-vs-BE enforcement, BUG-FD-3 — not re-testable, Technician drifted). |
| **case-update** (label/copy/UX drift + PO-accepted behaviors) | 10 | Incl. **FD-WO-016** (§5-R15 jurisdiction note not implemented) + label/copy drifts; see Blockers Tracker for the full list. |

**Not-Built (12) by story — re-checked live 2026-07-13:** Story 8 (Processing-Fee
builder UI; Type options are still only Fee|Discount) = FD-PROC-001..004 (4); Story 11
(Part Sales; no F&D column/API surface) = FD-PCOL-001..007 + FD-PERM-004 (8).

**ENV (20) by sub-bucket:** QuickBooks = FD-QB-001..011, 013, 016 + FD-QB-015 (memo
half; in-app credit half VERIFIED) + FD-CALC-017 (QB penny-cap half; floor half
VERIFIED) — line internals need a QB-UI eyeball; the mapping-guard cycle is blocked by
the unmap 500; export currently fails on duplicate doc numbers. Flag-off / shared-env =
FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012 (not taken while the manual tester is
active).

**VIU-Pending (1):** FD-PART-005 (requested→received transition — blocked by the
line-create 500 + the completed-line part-request lock).

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- **F&D cases imported** under parent section **3894** = "Fees & Discounts
  (VIU-PENDING)" (the brief's older id 3822/3822-prefix was renamed/superseded; 3894
  is the live parent — see `section-rename-log.md`). Leaf sections per functional
  area; the "Fees and Discounts V1 > " prefix was stripped from all 70 sections.
- **API sections (STANDING RULE 4):** the two API-flagged cases were moved into
  API-titled sections under parent 3894 —
  **`API — Customer Fees & Discounts tab — negative` (section 4087)** = FD-CUST-017
  (case 28501) and **`API — Processing Fee — negative` (section 4088)** = FD-PROC-010
  (case 28528). Audit: `testrail-fd-api-section-move-log.md`.
- **F&D Case-ID map:** **BUILT 2026-07-09; now 183** → `build/fees-discounts/testrail-id-map.csv`
  (columns `ID,fd_id,title,section`; all **183** cases mapped, incl. new **FD-WO-016→C29441**,
  against the live suite under parent 3894). **178** originally matched on exact (normalized)
  title; the remaining
  **4** matched via the documented feature-flag-free rename ("feature flag" /
  "FeesAndDiscounts flag" → "Fees & Discounts feature"), each an unambiguous 1:1 pairing:
  FD-HIST-004→28563, FD-PERM-010→28594, FD-FLAG-001→28596, FD-FLAG-002→28597. The 2 API
  cases confirm the earlier log (FD-CUST-017→28501, FD-PROC-010→28528). Use this before
  any ID-matched TestRail update loop. **Never write to TestRail without explicit user
  permission.**
- **Import files remain INTERIM** (`testrail-import/fees-discounts-v1-testrail-import.csv`
  / `.xlsx`, all 183; VIU-word-free + feature-flag-free per user rule) pending
  post-VIU + dev/PO-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).
  **NOTE: TestRail already carries the corrected wording** for all 183 cases (pushed live
  via update_case 2026-07-13, 200/200, 0 errors — see `testrail-wording-viu-log.md`).
- **Never write to TestRail without explicit user permission.**

---

## 4. Deliverables index (paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/fees-discounts/cases/group-A-wo-parts.json` — 62 cases (incl. FD-WO-016).
- `build/fees-discounts/cases/group-B-customer-admin-finance.json` — 83 cases.
- `build/fees-discounts/cases/group-C-calc-permissions-validation.json` — 38 cases.

**Human-readable workbook / CSV:**
- `build/fees-discounts/FeesDiscounts_V1_TestCases.xlsx` / `.csv` — the full test-case
  workbook (tab-per-area + summary), built by `build_workbook.py`.

**TestRail import artifacts:**
- `testrail-import/fees-discounts-v1-testrail-import.csv` / `.xlsx` — full-suite
  import (all 183; VIU-word-free, feature-flag-free; leaf sections; API-titled
  sections for the 2 API cases), built by `build/fees-discounts/gen_import.py`.

**Tracking / status:**
- `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md` / `.xlsx` — **source of
  truth** for per-case state + blocker category + owner + what's-needed (+ Summary).
- `build/fees-discounts/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/fees-discounts/PROJECT-STATUS.md` — narrative status log.
- `build/fees-discounts/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.

**Analysis / VIU / provenance:**
- `build/fees-discounts/requirements.md` — spec extract (incl. Story 13 permissions + §5 calc contract).
- `build/fees-discounts/design-notes.md` — design catalog.
- `build/fees-discounts/viu-recon.md` — qb env map + per-surface BUILT/NOT-YET table + access.
- `build/fees-discounts/viu-qb-findings.md` — batch-1 deep-VIU scoreboard + **FDBUG register** + API map.
- `build/fees-discounts/viu-findings.md` — pass-A / batch-2 per-priority VIU evidence + endpoints.
- `build/fees-discounts/bugs-log.md` — BUG-FD-1..5 + NOTE-FD-4..7 register (batch-2 current).
- `build/fees-discounts/viu-evidence/` and `build/fees-discounts/screenshots/` — VIU screenshots.
- `build/fees-discounts/section-rename-log.md` — TestRail section rename audit.
- `build/fees-discounts/testrail-fd-api-section-move-log.md` — API-section move audit (sections 4087/4088).
- `build/PERMISSIONS-ASSESSMENT.md` — cross-project permissions assessment (F&D permissions = DEFINED / reuse-only).
- **2026-07-13 pass artifacts:**
  - `build/fees-discounts/wording-glossary-2026-07-13.md` — live-captured exact build labels.
  - `build/fees-discounts/testrail-wording-viu-log.md` — per-case audit, wording+VIU push (183/183, 0 errors).
  - `build/fees-discounts/testrail-v1_2-push-log.md` — per-case audit, V1_2 batch (43 + FD-WO-016).
  - `build/fees-discounts/roles-matrix-2026-07-13.md` — re-derived roles matrix (records Technician drift).
  - `build/fees-discounts/screenshots/wording-2026-07-13/` — build screenshots for the pass.
- **Reusable process:** `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` — the repeatable method used for the 2026-07-13 pass.

**Generators (Python):**
- `build/fees-discounts/gen_import.py` — rebuilds the TestRail import CSV/XLSX.
- `build/fees-discounts/build_workbook.py` — rebuilds the human-readable workbook.
- `build/fees-discounts/gen_blockers.py` — rebuilds the Blockers Tracker (`.md` + `.xlsx`).
- `build/fees-discounts/gen_fresh_viu_workbook.py` — rebuilds the Fresh-VIU results workbook.
- `build/fees-discounts/testrail_viu_sync.py` — idempotent TestRail update_case sync (needs day-authorization).

---

## 5. Bugs / deviations — the FDBUG register + PO-confirmation set

**FDBUG register** (full detail in `viu-qb-findings.md`; narrative in `bugs-log.md`):

- **FDBUG-1 — MAJOR (totals bug).** WO `total_cost`, Financial-Info Total/Balance
  AND the customer estimate Subtotal/Total all EXCLUDE the net adjustment amount,
  while GST *includes* the adjustments' tax effect → customer-facing money is wrong.
  Case: FD-DOC-011.
- **FDBUG-2 — processing-fee Grand-Total base wrong.** The pfee base includes
  whole-WO fees/discounts + their tax; §5-R4 requires it to EXCLUDE every whole-WO
  adjustment. Cases: FD-PROC-009, FD-CALC-013 (+ Stats FD-STATS-001/002/004).
- **FDBUG-3 — auto-applied adjustments write NO history-log entry** (manual
  add/edit/remove ARE logged). Case: FD-HIST-001. Also the enforcement finding: the
  whole-WO adjustment write + the history endpoint are **FE-only** (see §6/BUG-FD-3).
- Smaller: **FDBUG-9** maxCap 0 accepted as "no cap" (FD-CALC-008, FD-VAL-006);
  **FDBUG-10** percent below minimum silently rounded up not rejected (FD-CALC-006);
  **FDBUG-4/5/6/7** display/UX (Line-Total gross-only, Stats aggregate, no "Show N
  more", customer-default single-select picker); **FDBUG-8** Processing Fee absent
  from the builder UI though the BE supports it; **FDBUG-11** history omits the
  "Type:" line; **FDBUG-12** API-created customers don't seed auto-apply defaults;
  **FDBUG-13** line-scope Add dialog has no template picker.

**New batch-2 bugs/notes (in `bugs-log.md`):** **BUG-FD-4** (Add button not disabled
on an empty form — validates on submit instead; FD-WO-005/FD-VAL-001), **BUG-FD-5**
(no "Show N more" collapse on ≥2 line adjustments; FD-INLINE-003), **NOTE-FD-7**
(Add-dialog Taxable is a toggle not a dropdown; template delete-confirm wording
differs). **NOTE-FD-4** = BE accepts `kind:processing_fee` though the builder UI is
absent (PO to confirm intent).

**Deviation / findings awaiting a PO ruling (the "5" + the pending-flagged set):**

| Case | Status | PO question |
|---|---|---|
| FD-STATS-001 | VIU-Deviation | Stats aggregate layout — intended V1, or is the per-row layout still to build? (BUG-FD-2) |
| FD-PERM-002 | VIU-Deviation | Whole-WO adjustment writes FE-only at BE — enforce or leave FE-gated? (BUG-FD-3) |
| FD-WO-013 | VIU-Deviation | Whole-WO starting-places hidden without WO Create&Edit is FE-only — same ruling |
| FD-CUST-016 | VIU-Verified | Double-add (BUG-FD-1) did NOT reproduce on batch-2 — PO to confirm the S9 fix shipped |
| FD-VAL-007 | VIU-Verified | Double-add validation — PO to confirm fixed / re-scope to single adjustment |

(Plus the 6 VIU-Pending deviations batch-2 flagged for PO: FD-WO-005, FD-VAL-001,
FD-INLINE-003, FD-STATS-002, FD-STATS-004, FD-CUST-005 — see §2.)

---

## 6. Open threads / what unblocks what

- **BATCH-6 LEFTOVER CLEANUP — DONE 2026-07-10 (fresh-pass step 1).** S-15895
  reverse-invoiced (200), both ZZAUTOTEST adjustments removed (204), baseline verified
  (sub 182.76 / GST 9.14 / total 191.90, adjs ["Flat fee"], status Complete — re-verified
  after EVERY probe batch of the fresh pass); failed-export + my credit-memo unexported
  entries marked done; 3 of the 4 line-less WOs deleted (201). **Known residue (harmless,
  ZZ-tagged):** (1) WO **S-15947** `b7c9e9a5…` could NOT be deleted — it was walked to
  Complete and the API refuses both delete ("Completed work order cannot be deleted") and
  any status change back; it is now stripped to 0 lines / 0 adjustments / $0. (2) Customer
  **"ZZAUTOTEST FD Fresh710"** (`b881540e…`) holds one orphan contact whose id is not
  retrievable via any discovered API (no contacts-list endpoint; UI tab makes no list
  call), so `customers/delete` 400s ("Company with a customer") — empty shell, no WOs/
  defaults/financials. (3) The 3 pre-existing unexported entries (S3-15929, S3-15889 ×2)
  belong to OTHER testers — left untouched.

- **Fresh qb cookies → resume VIU.** (Post-fresh-pass the VIU backlog is only the
  **20 Blocked-Env + 1 VIU-Pending** — see §0.5 step 6.) Fresh cookies are also —
  via the self-service staff role-switch — a prerequisite for the remaining role
  work. (Tech quick-login is **FLAKY** on qb — 200 in batch-1/2, 403 in recon —
  retest each run.)
- **Restricted-role accounts → the 4 NEEDS-ACCOUNT Story-13 negatives**
  (FD-PERM-004/008/010, FD-CUST-015). The tech quick-login user is **not in the org
  staff table** on qb and quick-login only supports admin/tech, so the other 9 roles
  cannot be logged in / role-switched here — a real non-Tech account (or a fixed
  login path) is required. Restore Tech afterward. (Batch-2 verified the REST of the
  Story-13 matrix by DERIVING per-role capability from `roles-matrix.json`, which is
  why 9 Story-13 cases flipped to Verified.)
- **Dev → Stories 6 / 8 / 11 + the code-bug deviations.** Story 8 (Processing-Fee
  builder UI) unblocks FD-PROC-001..004; Story 11 (Part Sales) unblocks
  FD-PCOL-001..007; a QuickBooks-connected env (or dev/QB-side inspection) unblocks
  the 13 QB ENV cases. The 7 code-bug deviations (FDBUG-1/2/3/9/10) need dev fixes.
- **PO → deviation confirmations + double-add + NOTE-FD-4.** Rule on the 3
  PO-question deviations (Stats layout; whole-WO FE-vs-BE enforcement), confirm the
  double-add fix (FD-CUST-016/FD-VAL-007), and confirm NOTE-FD-4 (should the BE keep
  accepting `processing_fee` before the UI ships?). Then the 6 pending PO-flagged
  deviations and the 17 case-update deviations can be finalized.
- **Flag-off window (non-shared env) → the 5 flag-off/shared-env ENV cases**
  (FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012).

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://qb.qa.shopview.com` · API host
  `https://sv7387api.qa.shopview.com` (note `sv7387api`, **no dot**; found by
  grepping the SPA bundle — `qbapi.qa.shopview.com` does NOT exist). Env = SV-7387.
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` gated by cookies
  `sv_sso_session` + `PHPSESSID` + `cf_clearance` (domain `.qa.shopview.com`).
  `{key:'admin'}` → 200. **`{key:'tech'}` is FLAKY** (200 in batch-1/2, 403 in
  recon) — retest each run. Only admin/tech are supported; the other 9 roles need a
  real account. Read FE permissions at `GET /api/auth/me/fe-permissions`.
- **Feature flag:** `GET /api/feature-flags` → `{data:{featureFlags:[…]}}`;
  `FeesAndDiscounts` toggle is ON at `/administration/feature-flags`.
- **QuickBooks (Story 6) — CONNECTED as of 2026-07-09.** Location **Staging Lethbridge - 4310**
  (`f8a8b802-7780-4b16-bf10-343caeb616b2`) = admin default_workplace; Heavy Duty
  (`b3c8c820-f815-4cf1-8938-10956c5ee71a`); both `bookkeeping_enabled:true`. Switch active
  location: `POST /api/iam/change-location {workplace_id}` (key is `workplace_id`; only sets
  the ephemeral session location, NOT the stored default). QB endpoints:
  `GET /api/bookkeeping/adjustment-item-mapping-status`
  (`{quickBooksConnected,feeItemMapped,discountItemMapped}` — the S6-R6 guard's data source),
  `GET /api/bookkeeping/integration` (live QB chart of accounts — flaky/500s),
  `GET/POST /api/bookkeeping/products-and-services`·`code`, `PUT /api/bookkeeping/settings`
  (save Fee/Discount item mapping), `GET /api/bookkeeping/unexported-items` +
  `…/{id}/retry`/`…/{id}/mark-done`. No non-committing QB export preview exists (sync is
  automatic on invoicing). Story-6 behavior VIU pending a healthy env (batch-5 attempt hit a
  sustained sv7387api 500 incident).
- **Enforcement model (Story 13, batch-2 confirmed):** templates admin (Settings→
  Finance) is **BE-enforced** (Tech → 403 list/create); **customer-defaults GET+POST
  are BE-enforced** (403); **See Financial Data** masks financials in the payload
  (`view_mode:tech` → `sub_total:"0.00"`); adds on an Invoiced/Paid WO are
  **BE-enforced** (409). BUT **whole-WO adjustment add/edit/remove is FE-only** (Tech
  without `workOrdersCreateAndEdit` got 201 = BUG-FD-3), and the **WO history
  endpoint is FE-only** (Tech without `viewHistoryLogs` got 200 with entries; F&D
  history persists regardless of SFD because entries carry the SET rate, not a
  resolved total). Per-role FE capability derived in `/tmp/fdcln/roles-matrix.json`.
- **Adjustment API (reverse-engineered, `viu-qb-findings.md` API map):**
  - Templates: `GET/POST /api/adjustment-templates`, `POST …/{id}/change`,
    `DELETE …/{id}`, `GET …/{id}/delete-precondition` → `{affectedCustomerCount}`.
    Fields: `{name, kind:fee|discount|processing_fee, calculationType:flat|pct_labor|
    pct_parts|pct_subtotal|pct_grand_total, defaultAmount, defaultMaxCap, autoApply,
    taxable, description}`.
  - WO adjustments: `POST /api/work-orders/adjustments/add|change|remove`
    (`add`: `{workOrderId, kind, name, calculationType, amount, maxCap,
    scope:whole_wo|labor_line|part_line, targetId, taxable, templateId, description}`;
    `change`: `{adjustmentId, name, amount, maxCap, taxable}`; `remove` → 204).
  - Reads: whole-WO adjustments in `GET /api/work-orders/view/{id}`
    (`work_order.adjustments`, `adjustmentsSummary{…}`); line-level under each line
    in `GET /api/work-orders/lines/{woId}`.
  - Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
    (POST `{templateIds:[…]}` — array OK), `DELETE …/{defaultId}` → 204.
  - QB mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status`.
  - History: `GET /api/work-orders/{id}/history` (adjustment.added/updated/removed).
- **Key routes:** admin templates `/administration/adjustment-templates` (in-SPA click
  only — under FINANCE); WO detail `/workorders/{id}/lines`; Stats
  `/workorders/{id}/statistics`; customer defaults `/customers/{id}/default-adjustments`;
  part sale `/parts/part-sale/{id}/part-requests`; feature flags
  `/administration/feature-flags`.
- **Gotchas:** (1) **`NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`
  must both be set** for node, else a spurious proxy 403. (2) SPA **deep-links to
  most sub-routes render a blank "Error" page** — navigate in-SPA (`/workorders/{id}/lines`
  deep-links fine). (3) **Concurrent users are active on qb** — never assume env
  state; mark throwaway data ZZAUTOTEST and clean up.
- **Harness / boot2:** `/tmp/fdcln/fd-admin.mjs` (API client), `/tmp/fdcln/fd-boot2.mjs`
  (Chromium boot2 hydration, cookie domain `.qa.shopview.com`; Playwright straight at
  `$HTTPS_PROXY`). Secrets ephemeral (`/tmp` only, re-supply per environment).

---

## 8. How to resume

**Confirm the project first** (this workspace holds 3 projects) — instruction must
target **Fees & Discounts**. **The primary resume path is §0.5** (the project is
paused on Chris Ward's Round-2 answers). The generic per-trigger paths below stay
valid for whatever lands:

**When fresh qb cookies are supplied:**
1. Get admin (+ retest tech) cookies into `/tmp`; rebuild the boot2 harness.
2. Work the remaining VIU backlog — **20 Blocked-Env + 1 VIU-Pending
   (FD-PART-005)** — as the env allows (§0.5 step 6; §2 lists the cases).
3. Flip verified cases to VIU-Verified in `cases/*.json`; re-run
   `gen_blockers.py`, then `gen_import.py` + `build_workbook.py`.

**When a non-Tech role account is supplied:** run the 4 NEEDS-ACCOUNT Story-13
negatives (FD-PERM-004/008/010, FD-CUST-015); restore Tech afterward.

**When dev fixes land (Stories 6/8/11 + FDBUG code fixes):** re-run VIU for the
now-reachable cases (Story 8 → FD-PROC-001..004; Story 11 → FD-PCOL-001..007; a
QB-connected env → the 13 QB cases; the 7 code-bug deviations retest after fix).

**When the PO answers (= the Round-2 sheet comes back):** follow §0.5 — apply the
§0.1 per-answer action map, release/drop the held tickets, then sync + regenerate.
(Round-1's 6 answers are already fully actioned — see `reconciliation-actions.md`
+ `testrail-po-clarify-log.md`.)

**Before any TestRail update loop:** the **F&D Case-ID map is BUILT**
(`testrail-id-map.csv`, all 183) — use it for ID-matched updates. **Ask the user
before any TestRail write (fresh one-day authorization each time).**

**Two-phase finalization** (`RESUME-STRATEGY.md`): the current import files are
INTERIM; FINAL = the regenerated post-VIU + dev/PO-answered files.
