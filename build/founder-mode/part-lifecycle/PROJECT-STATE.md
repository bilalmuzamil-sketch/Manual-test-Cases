# Founder Mode → Part Lifecycle — PROJECT-STATE

**Feature:** Parts Lifecycle — active/inactive + tracked/untracked part states, create-without-library,
Catalog→Part Library rename, editable part number.
**Epic:** SV-10647 (FounderMode Part Lifecycle) · **Spec:** Confluence 829227015 ·
**🔴 Status: "In review — 2026-09-09" (NOT locked for build)** · read 2026-09-30 · **PO:** Chris Ward
**TestRail:** Founder Mode = 20434 → **Part Lifecycle = 20439**
**Design:** artifact Vz6rprcWyP16tYxzM1kdeE (11 boards, driven end-to-end — Rule 115)
**Branch:** `claude/slack-session-setup-7v5itm`
**Build:** ❌ No QA branch yet. **PROVISIONAL — the spec is in review**; every case is
`AUTOMATION: HOLD` naming the in-review status (Rules 49/85).

## What was created — 62 cases, Rule 117, 207 anchors covered 1:1
| Story | Sub-folder (section) | Cases | Case ids |
|---|---|---|---|
| S1 Active/Inactive tabs | 20468 | 2 | C154752–C154753 |
| S2 Deactivate parts | 20469 | 10 | C154754–C154763 |
| S3 Activate parts | 20470 | 2 | C154764–C154765 |
| S4 Create an untracked part | 20471 | 4 | C154766–C154769 |
| S5 Edit tracking state | 20472 | 4 | C154770–C154773 |
| S6 Search & sort by tracking state | 20473 | 2 | C154774–C154775 |
| S7 Create without a library item | 20474 | 4 | C154776–C154779 |
| S8 Permissions | 20475 | 4 | C154780–C154783 |
| S9 Inactive parts cannot be selected | 20476 | 5 | C154784–C154788 |
| S10 Confirming & recording a status change | 20477 | 12 | C154789–C154800 |
| S11 Part Library browse & edit only | 20478 | 4 | C154828–C154831 |
| S12 Rename Catalog to Part Library | 20479 | 4 | C154832–C154835 |
| S13 Edit the part number | 20480 | 5 | C154836–C154840 |
| **Total** | | **62** | (see above) |

207 PRD requirement anchors (S1-R1 … S13-N3) covered 1:1 — no gap, no duplicate, no extra.
**Render:** 62/62 canonical cases rendered clean on TestRail (2026-09-30).

## 🔴 Outstanding — needs the QA lead / user
1. **27 DUPLICATE cases to delete: C154801–C154827** (in sections S6–S10, folder 20439). Cause: an
   accidental second `--apply` of `pl_s6_s10.py`; `delete_case` was denied by the auto-mode
   classifier (external-system write), so I could not remove them. They duplicate canonical
   C154774–C154800. Recorded in `DUPLICATES-TO-DELETE.json`. **Please authorise the delete (or delete
   them), or grant the delete_case permission and I will.**
2. **Spec is IN REVIEW, not locked for build** — all 62 cases are PROVISIONAL/HOLD; re-verify the
   source version and re-open affected quotes if the PRD changes before it locks.
3. **Open question in the PRD:** should Part Number stay mandatory (Story 7)? "Decide before build."
   S7-N1/N2 assume it is required, per the current spec.
4. **No QA build / story-level Jira & designs TBD** — build-verify when a branch exists.

## Coverage verdict (Rule 115)
- **PRD (Confluence 829227015, in review):** ✅ 100% — all 207 anchors covered 1:1.
- **Design (11 boards, driven):** ✅ CONFIRM — no DIVERGE (canvas covers stories the PRD marks TBD).
- **Tech plan:** none supplied. N/A.
- **Epic (SV-10647):** ✅ 13 stories map 1:1 to the 13 sub-folders.
