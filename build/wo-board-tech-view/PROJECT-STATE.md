# WO Board and Tech View — PROJECT-STATE

**Created:** 2026-09-23 · **PO / spec owner:** Sasha Grosman · **Status:** ACTIVE — source-verified authoring complete, not yet build-verified.

## What this is
Manual TestRail test suite for **Work Orders — Board View & Tech View Display Options** (adds Tech View and
Board View display options to the Work Orders page, plus shared controls: fields/columns, density, lead
reassignment, drag reorder, line-tech avatars, tech-story check-mark removal, keyboard access, analytics).

## Sources (currency established 2026-09-23)
| Source | Reference | Version / date |
|---|---|---|
| PRD / spec | Confluence **845185030** "Work Orders — Board View & Tech View Display Options (Draft Spec)" | **Draft v0.9**, lastModified 21 Sep 2026 |
| Review decisions / open questions / S12 event contract | Confluence **853901313** | lastModified 21 Sep 2026 |
| Epic | **SV-10043**; Stories 1–11 = **SV-10044 … SV-10054**; Story 12 has no Jira story yet | live 23 Sep 2026 |
| Tech plan | `sources/Tech-Plan-Kanban-Tech-View-Display-Options.md` (informs, never overrules — Rule 30) | dated 17 Sep 2026, references PRD v0.8 (spec now v0.9) |
| Design | Claude Design export `sources/design/Work Orders.dc.html` (driven end-to-end 2026-09-23) | design lags the PRD (22 open UX follow-ups) |

Verbatim spec + review child saved under `sources/`. Every Expected quote pulled by anchor id from the saved spec (Rule 113).

## TestRail
- Parent folder **group_id 13204** "WO Board and Tech View (Sep 2026)" (was empty).
- **13 content-named subfolders** created (13236–13248) — one per story + a Rule-116 data-accuracy folder. See `section-map.json`.
- **127 cases authored: C96909–C97035.** All `created_by=3`, all **AUTOMATION: HOLD** (source-verified, not build-verified).
- Arithmetic gate: READY 0 + EXPECT-FAIL 0 + HOLD 127 = total 127. ✓
- Render: all fr-view (spot-checked via `hs_repair_one.mjs`, edited=false, marker last).

### Folder → count
S1 15 · S2 16 · S3 16 · S4 19 · S5 12 · S6 6 · S7 4 · S8 4 · S9 13 · S10 6 · S11 3 · S12 7 · DATA 6 = **127**.

## Coverage (Rule 43/115 — per-source verdict)
- **PRD/spec:** ✓ 100% — all **207** requirement anchors (S1–S12 R/N/E) covered ≥1 (each once, except 4 count/N-open
  anchors intentionally re-tested in the DATA folder for numeric integrity). Machine-checked (`build_wo.py` + coverage check).
- **Design:** ✓ driven end-to-end (List, Tech View, Board View, Columns picker, Density menu, more-actions, avatar
  overflow, restricted-status locks, dark theme) — screenshots in `design-exploration-2026-09-23/`; findings in
  `DESIGN-REVIEW-2026-09-23.md`. No design-only behaviour needing a case beyond the spec; several **design-vs-spec
  divergences** recorded as PO/design questions (below) — cases follow the SPEC (Rule 57/113).
- **Epic:** ✓ every case Source line cites SV-10043 + its story (SV-10044…SV-10054; Story 12 = TBD).
- **Tech plan:** ✓ read for testable additions; user-observable NFRs (optimistic counts/rollback, virtualized card
  reachability) already covered by spec anchors (S4-N3, S4-R7, S3-E4). Pure performance NFRs have no numeric target
  (open FF-6) → held. It informs, does not overrule (Rule 30).
- **Rule 116 (numbers):** DATA folder covers header-count exactness & cross-view parity, count integrity after
  reassignment, exact "N open" composition, field-selection-rate as a pooled ratio (not an average), density
  distribution / distinct-user counts (no double count), and event multiplicity + a sample reporting recompute.

## Held / OPEN items (not invented — PO questions, Rule 58/64)
Authored to the spec's settled decisions; the following remain OPEN on the review child and are **held**, not guessed:
1. **Story 11 keyboard (SQ-15/UX-19):** exact key/focus behaviour design-pending. Only **S11-N1** (permissions/status
   not bypassed) is authored as fully testable; S11-R1–R10 / E1 / E2 are authored as design-pending cases (verify once
   the keyboard design is final).
2. **MF-3 (S4-R4 dialog):** the N-open status set is settled (Approved/In Progress/Ready for Review — tested); the
   search fields/matching/no-results, top-group order, and avatars are design-pending → not asserted.
3. **FF-2:** exact production List default sort field/direction/tie-break and the Status-control matrix per tab are
   engineering-pending → cases assert the behaviour ("uses List default sort", "restores saved sort") without pinning
   the exact field.
4. **FF-4/UX-21:** shift-clearing prompt scope is settled and tested (S4-R11/R22–R24); prompt timing, cancel, no-shift,
   failure, and lead-**removal** prompt behaviour remain OPEN → not asserted.
5. **MF-2:** historical implicit/explicit line classification is an engineering build decision → S4-R8 tests the table
   behaviour on fresh data; historical-origin edge is flagged.
6. **FF-6 / V-1 / V-2:** performance volumes and numeric response targets not set; phone/tablet layouts (UX-20)
   design-pending → performance/mobile cases held.
7. **SQ-2** (Lead Tech filter return to List), **SQ-8** (Tech View icon; board name = Board View settled),
   **SQ-10** (row click vs drag target), **SQ-11** (unpin return position / cross-location), **OQ-2** (other-user
   order placement) — OPEN, not asserted.

## Design-vs-spec divergences (design lags PRD; cases follow the SPEC — disclosed per Rule 56/115)
- Density shows **"Row height: Small/Medium/Large"**; spec requires **Density: Compact/Regular/Comfortable** (UX-14).
- No separate **"Fields to display"** picker on Board View in the design; only the shared Columns picker (UX-12).
- Display switcher tooltips read **"Table / By Lead Tech / Board"**; spec labels are **List / Tech View / Board View**
  (board name settled to Board View, SQ-8; Tech View icon still Branko's).
- Design opens on the **All** filter tab; spec S1-R10 makes **Work Orders** the default filter view.
- Empty group label in design is **"No work orders assigned"**; spec S2-R15 says **"No work orders"**.
- Restricted-status cards still expose **Reassign Lead Tech** in the design (UX-17 restriction-state incomplete).

## Reproduce
`sources/` (verbatim) · `anchor-quotes.json` (verbatim per anchor) · `plain-bullets.txt` (one plain result per anchor) ·
`cases.py` (127 case defs) · `build_wo.py --create` (creates via API) · `section-map.json` · `created-ALL.json`.
Design driving: served over local HTTP (react/react-dom/babel localized into `sources/design/vendor/`; original
`support.js` restored to verbatim, backup `support.orig.js`) then driven with `build/testing-tools/drive_design.py`.

## Outstanding for the QA lead
- **Not build-verified.** No QA build for this feature was confirmed; when one exists, execute the suite, re-stamp
  read/build dates, and flip AUTOMATION per case (HOLD → READY / READY-EXPECT FAIL).
- **No test run created** yet (Rule 34) — create/sync one at execution time, union-only.
- **PO questions** above (Story 11 keyboard, MF-3 dialog, FF-2 sort/status matrix, FF-4 prompt details, FF-6/V-2
  perf & mobile, SQ-2/10/11, OQ-2) and the six design-vs-spec divergences need the PO/design authority.
