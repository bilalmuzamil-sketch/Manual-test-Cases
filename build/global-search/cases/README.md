# Global Search — Test Cases (AUTHORED 2026-07-16)

**84 cases authored** across 15 sections (14 functional + 1 API). Internal IDs use
the `GS-[AREA]-NN` scheme. All cases carry `viu_status: "VIU-Pending"` — the feature
is not yet on a QA environment, so VIU (live build-accurate verification) is deferred.

Files:
- `cases-A-palette-keyboard-tabs.json` (18) — GS-KEY (palette open/close/keyboard),
  GS-TAB (scope tabs).
- `cases-B-results-entities-fuzzy-ranking.json` (30) — GS-GRP (grouped results/counts),
  GS-ENT (per-entity result shape), GS-FUZ (fuzzy matching), GS-RANK (ranking).
- `cases-C-states-hover-list-error.json` (20) — GS-EMPTY, GS-REC (recent), GS-PERS
  (persisting query), GS-NORES, GS-HOVER (hover quick-actions), GS-LIST (in-page WO
  list search), GS-ERR (error state).
- `cases-D-permissions-api.json` (16) — GS-PERM (role-based scoping, 4) + GS-API
  (`GET /api/search` etc., 12; all under the API-titled section per Standing Rule 4).

**OUT OF SCOPE — NOT authored** (Figma-labelled): AI search-all, header-component
proposal. See `../coverage-matrix.md` §C.

Build-accurate wording is taken from `../design-notes.md`; ~20 items carry a
"VIU-confirm" note to verify live once the feature ships (see coverage-matrix §D).

**No TestRail push** — cases are local-only until the user grants explicit permission
(Standing Rule 6). Regenerate the import with `python3 ../gen_import.py`.
