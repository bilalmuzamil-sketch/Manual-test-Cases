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

## Also done this pass (supporting items)

- ✅ `jira-bug-drafts.md` fully rewritten in plain language; Epic set to
  **SV-7387** on every draft; FDBUG-7 dropped/annotated as accepted (Q6=A).
- ✅ `PO-Questions-SIMPLE.md` + `.xlsx` (+ generator) updated — all 6 questions
  marked ANSWERED with Chris Ward's answer + one-sentence resulting action.

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
