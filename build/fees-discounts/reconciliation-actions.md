# F&D v1 Reconciliation — Action Checklist (groups A–G)

> **Purpose:** track execution of the case actions proposed in
> `spec-v1-reconciliation.md` §5, so tomorrow's finalization pass knows exactly
> what is done and what is left. **Status legend:** ✅ DONE NOW (this pass,
> 2026-07-09) · ⏳ AWAITING VIU WORKER (a parallel worker owns `cases/*.json`,
> `FeesDiscounts_Blockers_Tracker.*` and `PROJECT-STATE.md` — no case-file edits
> were made here to avoid clashing) · 🧑 AWAITING USER/ENV/DEV.

| Group | Action (from `spec-v1-reconciliation.md` §5) | Status | Detail |
|---|---|---|---|
| **A** | File the 4 PO-confirmed defects as dev tickets (Q1 per-row Stats; Q4 Add disabled-until-valid; Q5 show-more collapse; Q3 missing Processing-Fee builder UI) | ✅ DONE NOW (drafts) / 🧑 filing awaits user | Drafted as `jira-bug-drafts.md` TICKETS 8–11 (plain-language, Epic SV-7387). Atlassian unreachable from here — the user files them. |
| **A** | Re-class the findings in the case JSONs (FD-STATS-001/002/004, FD-WO-005, FD-VAL-001, FD-INLINE-003 → confirmed-defect; keep spec expected) | ⏳ AWAITING VIU WORKER | No `cases/*.json` edits made in this pass. |
| **B** | Re-scope EXPECTED of FD-CUST-016 + FD-VAL-007 from double-add → exactly ONE adjustment (Q2=A settled; close BUG-FD-1) | ⏳ AWAITING VIU WORKER | Case-wording edits deliberately deferred to avoid clashing with the concurrent VIU worker. |
| **C** | Adopt case-update wording: FD-CUST-003/004/005/006/007 (single-select dropdown + Save, single-add toast, "No results", trash remove — Q6=A accepted; FDBUG-7 closed won't-fix) | ⏳ AWAITING VIU WORKER | FD-CUST-005 wording edit explicitly deferred (VIU-worker clash). Q6 closure itself is recorded (✅) in `jira-bug-drafts.md` "Dropped" + `PO-Questions-SIMPLE.*`. |
| **C** | Adopt FD-TMPL-008 standardized delete-dialog wording (epic-confirmed; NOTE-FD-7b) | ⏳ AWAITING VIU WORKER | Deferred (same reason). |
| **C** | The 13 pure label/copy Part-2 case-updates (FD-WO-001, FD-LABOR-001, FD-FIN-004, FD-REMOVE-001, FD-TMPL-001/003/004/006, FD-CUST-007, FD-PROC-008, …) | ⏳ AWAITING VIU WORKER | Unchanged by the closeout package; apply at finalization. |
| **D** | Re-word GST worked examples → US sales-tax in FD-EDIT-002, FD-DOC-011, FD-CALC-011, FD-CALC-014 | ⏳ AWAITING VIU WORKER | Case edits deferred. |
| **D** | FDBUG-1 controlled re-repro on a US sales-tax org BEFORE filing | ✅ flag DONE NOW / 🧑 re-repro awaits US-tax org | TICKET 1 in `jira-bug-drafts.md` is marked **ON HOLD — DO NOT FILE YET** with the US-tax re-check plan. Needs a US sales-tax org (user/env). |
| **D** | FDBUG-2 re-verify the figure on US tax (structural defect stands) | ✅ draft kept DONE NOW / 🧑 number re-check awaits US-tax org | TICKET 2 kept with an explicit "re-verify figures on US tax" note. |
| **E** | Retest FD-QB-001…016 on a healthy, US-sales-tax env (all confirmed v1; none Phase-2) | 🧑 AWAITING ENV | Blocked by the sv7387api 500 incident (NOTE-FD-8) + needs US-tax org; QB is connected. Then the VIU worker adjudicates. |
| **F** | Author the NEW cross-tenant isolation case FD-SEC-001 | ✅ DONE NOW (standalone) / ⏳ merge into `cases/*.json` at finalization | Written as `build/fees-discounts/proposed-cases/FD-SEC-001.md` (API-asserting → API-titled TestRail section per standing rule 4). Not added to `cases/*.json` (VIU worker owns it). |
| **G** | BUG-FD-3 whole-WO FE-only enforcement (FD-PERM-002, FD-WO-013) — route to dev (no PO answer; mapping confirmed, enforcement depth open) | ✅ draft DONE NOW / 🧑 decision awaits dev | TICKET 7 layman-ized with the dev-routing note. |
| **G** | Remaining dev bugs unchanged by the closeout package: FDBUG-3 (auto-apply not logged), FDBUG-9 (maxCap 0), FDBUG-10 (percent rounded up), FDBUG-14 (part-dialog labels); plus FDBUG-11 (missing Type line) & FDBUG-13 (no line-scope picker) not yet drafted | ✅ drafts DONE NOW (TICKETS 3/4/5/6) / 🧑 fixes await dev | FDBUG-11 & FDBUG-13 remain register-only (low sev, no ticket drafted yet — decide at finalization whether to draft or bundle). |

## PO-answer clarifications applied (2026-07-09, later pass — user-authorized TestRail writes)

- ✅ **Group B DONE:** FD-CUST-016 + FD-VAL-007 EXPECTED re-scoped to exactly ONE
  adjustment (Q2=A settled; BUG-FD-1 closed) — local `cases/*.json` + TestRail
  master cases C28500 / C28605 updated.
- ✅ **Group C (PO/epic-driven part) DONE:** FD-CUST-003/004/005/006/007 re-worded
  to the accepted single-select dropdown picker (Q6=A; FDBUG-7 won't-fix) and
  FD-TMPL-008 adopts the standardized Delete Template dialog wording — local
  `cases/*.json` + TestRail C28487/C28488/C28489/C28490/C28491/C28509 updated.
  (The 13 pure label/copy Part-2 case-updates remain ⏳ finalization — not
  PO-answer-driven.)
- ✅ **Group A case side re-checked — deliberately NO case edits:** FD-STATS-001/
  002/004, FD-WO-005, FD-VAL-001, FD-INLINE-003 already state the PO-confirmed
  expected behavior (per-row Stats / disabled-until-valid / show-more); the build
  is what's wrong (dev tickets). FD-PROC-* audited for Q3: no wording implies the
  builder UI is optional/out-of-scope, so no edits.
- 📜 Per-case audit: `testrail-po-clarify-log.md`. Attribution note: the answers
  are **Chris Ward's** (F&D PO), not Milos's (Simple Flow PO).

## Also done this pass (supporting items)

- ✅ `jira-bug-drafts.md` fully rewritten in plain language; Epic set to
  **SV-7387** on every draft; FDBUG-7 dropped/annotated as accepted (Q6=A).
- ✅ `PO-Questions-SIMPLE.md` + `.xlsx` (+ generator) updated — all 6 questions
  marked ANSWERED with Chris Ward's answer + one-sentence resulting action.

## Round-2 PO answers applied (2026-07-14 — Chris Ward, F&D PO)

Chris Ward returned the filled `PO-Questions-Round2` sheet
(`chris-round2-answers-source.xlsx/.csv`). Answers: **Q1=A, Q2=A, Q3=A, Q4=B.**
The §0.1 pre-decided action map was applied to LOCAL artifacts only (NO TestRail
writes — TestRail push staged pending fresh one-day authorization).

| Q | Chris's answer | Action taken (local) | Cases (C-IDs) → status | Ticket |
|---|---|---|---|---|
| **Q1** — over-sized discount silent save (FDBUG-15) | **A** — warn/confirm required AND already exists (fires at invoice + mark-reviewed/complete, NOT at mere add) | ✅ FDBUG-15 reclassified NOT-A-DEFECT; FD-QB-014 expected reworded to the commit-point warning | FD-QB-014 **C28557** → VIU-Deviation ⟶ **VIU-Pending** (needs commit-time re-VIU). FD-QB-012/FD-QB-015 unchanged | **No ticket** (none created) |
| **Q2** — Max Amount 0 (FDBUG-9, TICKET 4) | **A** — 0 = no limit (WAD, S2-R25) | ✅ FDBUG-9 closed accepted; expecteds reworded to affirm 0 = no cap; flipped Verified; **TICKET 4 DROPPED** | FD-CALC-008 **C28575**, FD-VAL-006 **C28604**, FD-TMPL-011 **C28512** → all **VIU-Verified** | **TICKET 4 DROPPED** |
| **Q3** — tiny-% rounding (FDBUG-10, TICKET 5) | **A** — rounding fine/expected | ✅ FDBUG-10 closed accepted; expected reworded to expect the round-up-to-minimum; flipped Verified; **TICKET 5 DROPPED** | FD-CALC-006 **C28573** → **VIU-Verified** | **TICKET 5 DROPPED** |
| **Q4** — pfee minimum (FD-PROC-014) | **B** — don't support, make clear (no field + explicit API reject; premise doesn't reproduce) | ✅ Expected reworded to explicit-reject + no-field (matches live 2026-07-13); stays Verified | FD-PROC-014 **C28532** → **VIU-Verified** (expected changed) | No ticket |

**Staged for TestRail push (6 cases, awaiting fresh one-day authorization):**
FD-QB-014 (C28557), FD-CALC-008 (C28575), FD-VAL-006 (C28604), FD-TMPL-011 (C28512),
FD-CALC-006 (C28573), FD-PROC-014 (C28532). Each case JSON carries `fresh_run:
2026-07-14` + a "pending TestRail push (awaiting authorization)" note.

## Left entirely to the finalization pass (not started)

- 🧑/⏳ `requirements.md` annotations from the reconciliation's "Spec update"
  pointer (Epic ref SV-7387, US-tax-only scope banner, QB v1-vs-Phase-2 note,
  calc-method dropdown note, PO-rulings block, epic-shipped checklist).
- ⏳ Regenerate downstream deliverables after the case edits land
  (`gen_blockers.py`, `gen_import.py`, `build_workbook.py`) — FINAL (not
  INTERIM) import per `RESUME-STRATEGY.md`.
- 🧑 TestRail writes of any kind — **only with explicit user permission**.
- ⏳ Audit FD-CALC method-picker cases for "% Labor+Parts" dropdown references
  (§4 caveat — legacy-only method must not be a selectable option in any
  new-adjustment case).
