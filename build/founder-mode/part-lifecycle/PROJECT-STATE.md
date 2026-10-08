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

## 🟢 CURRENT STATE — 8 Oct 2026 (full update, Rule 122) — read this first
- **Sources:**
  - PRD Confluence 829227015 **v26 "Ready for dev"** (Product sign-off 8 Oct 13:17 UTC);
  - tech plan 7 Oct (first copy, `sources/tech-plan-…`);
  - 13 stories SV-10814…SV-10826 (some behind the PRD);
  - bug SV-10380 (ships with this epic);
  - design canvas: **46 boards** plus 5 Before boards, driven to the Rule 124 gates (`update-2026-10-08/DESIGN-COVERAGE-2026-10-08.md`).
- **Suite:** **259 live cases** = 61 rewritten + 198 new (C425585–C425782), plus C154761. All are ours.
  - Layout: 8 Oct (Needs, Setup with placeholders, Step n:, own data).
  - Coverage: 288/288 requirements.
  - Every case is `AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified`.
- **New section 54274** "Inventory Value net quantity (SV-10380)": 9 cases.
- **QA lead decisions (8 Oct):**
  - **C154761** is to be deleted, once the test-run check proves it is in no run.
  - **7 cases** a manual tester cannot fully run were moved to section **54275 "Retired - not manually runnable"** (not deleted).
  - **Manual suite:** 251 cases, 282 of 288 requirements. S4-N1, S4-N2, S5-N1, S9-E9, S13-R19d and S10-R25a are left to the developers' automated tests.
- **Report, PO questions and hand-runnability decisions:** `update-2026-10-08/FULL-UPDATE-2026-10-08.md`. PO questions go out AFTER build verification.
- **Build:** none yet (Rule 85: "source-verified only, no build exists yet").

## (HISTORY) What was created on 30 Sep — 62 cases, Rule 117, 207 anchors covered 1:1
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
1. ✅ **RESOLVED — 27 duplicate cases C154801–C154827 deleted** (2026-09-30, on the user's
   go-ahead). Verified all 27 gone; the 13 sections now hold exactly the 62 canonical cases.
2. **Spec is IN REVIEW, not locked for build** — all 62 cases are PROVISIONAL/HOLD; re-verify the
   source version and re-open affected quotes if the PRD changes before it locks.
3. **Open question in the PRD:** should Part Number stay mandatory (Story 7)? "Decide before build."
   S7-N1/N2 assume it is required, per the current spec.
4. **No QA build / story-level Jira & designs TBD** — build-verify when a branch exists.

## Coverage verdict (Rule 115)
- **PRD (Confluence 829227015, in review):** ✅ 100% — all 207 anchors covered 1:1.
- **Design (11 boards, driven):** ✅ CONFIRM — no DIVERGE (canvas covers stories the PRD marks TBD).
- **Tech plan:** first copy received 8 Oct 2026 (dated 7 Oct, PRD v22) — see SOURCE-CHECK-2026-10-08.md; suite NOT yet updated against it.
- **Epic (SV-10647):** ✅ 13 stories map 1:1 to the 13 sub-folders.
