# Founder Mode → Price/Category (Settings sorting) — PROJECT-STATE

**Feature:** Settings "Pricing" and "Categories" sorting — make the sort controls on three Settings →
Parts lists actually work, with a predictable default order and a sort that survives reload/search.
**Epic:** SV-9667 · **Spec:** Confluence 578781186 (*Locked for build 2026-09-15*, read 2026-09-30)
· **PO:** Chris Ward
**TestRail:** Founder Mode = 20434 → **Price/Category = 20438**
**Design:** artifact UMNdojKWhYhRyJrjdgZa4P (5 artboards, driven end-to-end — Rule 115)
**Branch:** `claude/slack-session-setup-7v5itm`
**Build:** ❌ No QA branch yet → every case `AUTOMATION: HOLD`, source-verified only (Rule 85).

## What was created — 26 cases, Rule 117, 63 anchors covered 1:1
| Story | Sub-folder (section) | Cases | Case ids |
|---|---|---|---|
| S1 Categories, sort by name | 20465 | 10 | C154726–C154735 |
| S2 Pricing Matrices, sortable column | 20466 | 6 | C154736–C154741 |
| S3 Fixed Rules, sortable columns | 20467 | 10 | C154742–C154751 |
| **Total** | | **26** | C154726–C154751 |

63 PRD requirement anchors (S1-R1 … S3-N2) covered 1:1 — no gap, no duplicate, no extra.

## Coverage verdict (Rule 115)
- **PRD (Confluence 578781186):** ✅ 100% — all 63 anchors covered 1:1.
- **Design (5 artboards, driven):** ✅ CONFIRM — Categories before/after (Name + QuickBooks Products
  And Services columns, Default/"Uncategorized" pinned, "Parts" in the QB cell), Pricing matrices
  (default unpinned), Fixed rules before/after (Part Number/Category/Fixed Price, numeric-aware order,
  space before the count), and "The three rules that bite" (sort-survives-edit/search). No DIVERGE.
- **Tech plan:** none supplied. N/A (spec is presentation-only, "no server behavior for QA to test").
- **Epic/stories (SV-9667):** ✅ three stories (SV-10134…10136) map 1:1 to the three sub-folders.

## Manual-runnability (Rule 114)
Fully UI-driven: seed rows, set the list state, read order / arrow / label. Desktop only. The
QuickBooks-column cases need a QuickBooks-connected shop (and one connection-check-failure state for
S1-N5). All HOLD until a QA build exists.

## Outstanding
- No QA build for Price/Category → all 26 HOLD; build-verify when a branch exists. (PRD says test at
  production sizes — largest org 1,076 categories, 8,994 fixed rules — noted in preconditions.)
- Nothing else outstanding.
