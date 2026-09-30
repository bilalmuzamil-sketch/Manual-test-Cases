# Rule 117 rollout + Founder Mode — session state (2026-09-30)

Master state for the Rule-117 (ideal-test-case standard) work and the Founder Mode programme.
Branch: `claude/slack-session-setup-7v5itm` (all work below committed and pushed).

## Rule 117 — the locked standard
- **Rule 117** recorded at the end of `build/rules/RULES-61-96.md`; operator form + worked example
  (C154586) in `build/skills/IDEAL-TEST-CASE-STANDARD.md`; indexed in `CLAUDE.md` §1 + skills index.
- Four requirements, every case: **(1)** concise title ≤ ~80 chars; **(2)** every seeded value shown as
  an EXAMPLE beside the standard QA steps that create it; **(3)** runnable on the build in the build's
  own glossary; **(4)** Expected results = runnable observations, with the verbatim source quote kept
  under "Exact quotes … (for reproducibility)".
- **🔒 LOCKED:** never weaken/drop/alter without the QA lead's explicit authorization; when authorized,
  ask ONE-TIME or PERMANENT, and if PERMANENT state back in plain words what changes and reconfirm.

## Reformat status — all five folders DONE (411 cases + 7 tech-plan ADDs)
| Folder (TestRail) | Cases reformatted | Render | Tech-plan (Rule 115) | Scripts / doc |
|---|---|---|---|---|
| Founder Mode / Part Sales (20435) | 57 | 57/57 clean | folded into PRD | `build/founder-mode/part-sales/v2_*.py` |
| Maintenance Reminder (19397) | 81 | 81/81 clean | none supplied | `build/maintenance-reminder-v2/v2_*.py` |
| Digital Inspection V2 (6658) | 87 | 87/87 clean | +4 ADD (folder 20448); rest CONFIRM | `build/digital-inspections-v2/{di_lib,v2_*,tp_add_cases}.py` + `RULE117-…md` |
| Dashboard (12166) | 59 (+3 foreign untouched) | 59/59 clean | CONFIRM (NF+DATA already carry it) | `build/dashboards/{dash_lib,dash_v2_*}.py` + `RULE117-…md` |
| WO Board & Tech View (13204) | 127 | render finalizing | +3 ADD (folder 20449); **3 DIVERGE flagged** | `build/wo-board-tech-view/{wob_lib,wob_v2,tp_add_cases}.py` + `RULE117-…md` |

- Reformat harness pattern: `update`/`light`/`retitle_seed`/`update_by_anchors` — rewrite in place,
  matched by anchor-set (Part Sales/MR) or case id (DI/Dashboard/WO Board), **preserving the verbatim
  Source line + quotes + AUTOMATION marker byte-for-byte**.
- Foreign cases (created_by ≠ 3) left untouched (Rule 38): 3 in Dashboard root (C137997–C137999).

## OUTSTANDING (needs the QA lead)
1. **3 WO Board tech-plan-vs-PRD conflicts** (in `build/OUTSTANDING-ITEMS-REGISTER.md`): "N open" count
   statuses (3 vs 4/+Complete), reordering Invoiced/Paid work orders (match-the-WO-page rule), and
   "Assigned to me" on board displays (secondary vs hidden). Cases left on PRD wording pending a ruling
   (changing them would touch a verbatim quote → Rule 113 hold).
2. **Build verification:** MR / Part Sales / DI V2 have no reachable QA build (all HOLD). Dashboard
   (sv8311) and WO Board reference real QA builds and could be build-verified on request.

## Founder Mode programme (epic SV-9667, "Founder Mode Batch #1")
TestRail root **Founder Mode = section 20434**. Feature sub-folders:
- **Part Sales = 20435** — DONE (57 cases, Rule 117). PROJECT-STATE: `build/founder-mode/part-sales/PROJECT-STATE.md`.
- **Notifications = 20436** — DONE (56 cases C154651–C154706, Rule 117; 197 PRD anchors covered 1:1;
  design driven end-to-end = CONFIRM; no QA build/tech plan → all HOLD). Sub-folders S1–S10 =
  20450–20459. Scripts `build/founder-mode/notifications/n_s1_s3.py · n_s4_s6.py · n_s7_s10.py`.
  PROJECT-STATE: `build/founder-mode/notifications/PROJECT-STATE.md`.
- **What/Why = 20437** — DONE (19 cases C154707–C154725, Rule 117; 40 PRD anchors covered 1:1;
  design driven = CONFIRM; no QA build/tech plan → all HOLD). Sub-folders S1–S4 = 20461–20464.
  Scripts `build/founder-mode/what-why/{ww_lib,ww_cases}.py`.
  PROJECT-STATE: `build/founder-mode/what-why/PROJECT-STATE.md`. PO Chris Ward.
- **Price/Category = 20438** — DONE (26 cases C154726–C154751, Rule 117; 63 PRD anchors covered 1:1;
  design driven = CONFIRM; presentation-only feature; no QA build → all HOLD). Sub-folders S1–S3 =
  20465–20467. Scripts `build/founder-mode/price-category/{pc_lib,pc_cases}.py`.
  PROJECT-STATE: `build/founder-mode/price-category/PROJECT-STATE.md`. PO Chris Ward.
- **Part Lifecycle = 20439** — NOT STARTED (page 829227015, artifact Vz6rprcWyP16tYxzM1kdeE, SV-10647).

**Next:** create test cases for the remaining Founder Mode feature folders, one at a time, to the
Rule-117 standard. Per-feature intake needed each time (Rule 1/2/30/15): the feature name, its
Confluence spec/PRD, the design (drive it end-to-end, Rule 115), the epic/stories, and the tech plan
if one exists. Same pipeline as Part Sales: intake → drive design → create content sub-folders →
author atomic Rule-117 cases citing verbatim quotes → render-repair → coverage verdict → commit/push.
