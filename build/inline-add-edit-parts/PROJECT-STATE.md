# PROJECT-STATE — Inline Add and Edit Parts on Work Order Lines

**Canonical cold-resume doc.** Status derived live; do not trust remembered figures (Rule 92 / skill 15 §7).

## Identity
- **TestRail parent folder (group):** group_id **6597**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6597 (recorded 2026-08-25)
- **Epic:** SV-9315 · **PO / Owner:** Sasha Grosman
- **Spec:** Confluence **782761986**, live **v16** (verified 2026-08-31; was v13 on 2026-08-25)
- **Design:** Claude "Add Part" artifact `561657da` (appearance reference; static export held)
- **Tech plan:** `intake-2026-08-25/sources/tech-plan-2026-08-18.md` (behind PRD v13; informs only, Rule 30)
- **QA env:** none yet → **Rule 85 SOURCE-VERIFIED ONLY**
- **Case source:** `cases/` · internal ID prefix **IAEP** (`IAEP-<AREA>-NN`)

## Scope (from spec v16)
- **7 stories**, **129 rule IDs**. Stories 1–6 = SV-9316–SV-9321 (107 rule IDs). **Story 7 "Bin
  Allocation on the Inline Row" (added v16, 2026-08-27) = 22 rule IDs (S7-R1…R18/N1–N2/E1–E2); its
  Jira story ticket is TBD — cases ref the epic SV-9315.** Single surface: Work Order → Lines → Parts,
  forking by Work Order View Mode (Tech View / Full View). New v16 "Keyboard Model — Inline Row"
  section is the single source of Tab order (S2-R13 / S4-R15 point to it).

## Status — 2026-08-25 (authoring pass complete)
- **FULL SUITE AUTHORED: 96 cases** across 6 areas.
- **Coverage: 107/107 rule IDs, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **RUA:** 96/96 KEEP (2 WEAK-KEEP tied to open PO questions), 0 CUT, 0 NONSENSE.
- **Rule-85:** every case "Not available on Build to test Yet - Last checked 8/25/2026".
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank). Import ready for the QA lead.
- **Open PO questions (Sasha Grosman):** PO-IAEP-1 (S3-E1 scope: PRD keeps it, tech plan D3 defers it) ·
  PO-IAEP-2 ("Imported" status guard: PRD hides Add Part/Edit, tech plan plans no such check).
- **Deliverables:** requirements.md (v13) · coverage-matrix.md · intake-2026-08-25/{INTAKE, SOURCE-CURRENCY,
  SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} · cases/ ·
  testrail-id-map.csv · testrail-import/Inline-Add-and-Edit-Parts_testrail-import.{csv,xlsx} ·
  questions-2026-08-25/.
- **Reconciliation:** authored 96 = import 96 = id-map 96; set-equal both ways.

## Status — 2026-08-31 (source re-verification v13→v16)
- **Spec re-verified live: Confluence 782761986 now v16** (metadata.version=16, "Last Updated"
  2026-08-27). Verbatim body captured at `intake-2026-08-25/sources/spec-body-confluence-v16-782761986.md`.
  §11 Change Log is EMPTY — the v13→v16 delta was derived by body diff.
- **v13→v16 delta (rule-by-rule):** NEW **Story 7 Bin Allocation** (22 rule IDs, zero prior coverage);
  NEW **Keyboard Model — Inline Row** section; **S2-R4** amended (typeahead cards carry inventory qty +
  bins; selecting triggers bin allocation); **S2-R6** amended (qty may be set by a bin split, S7-R14);
  **S2-R13 / S4-R15** amended (defer Tab order to the Keyboard Model); **§5** (Bin / Default bin /
  Allocation terms added), **§9** (Bin Locations modal is the one Tech View modal), **§8** (two bin
  messages). **Stories 1, 3, 5, 6 unchanged.** S2-R19, S3-R7/R9, S4-R20, S4-N5/N6, S6 edit wording,
  S2-N1 combined message: re-confirmed IDENTICAL to our cases (they already matched from the 2026-08-24
  edits) — re-stamped only.
- **Suite now 118 cases ours** (was 96): +22 Story-7 cases **IAEP-BIN-01…22 → C45221–45240, C45242, C45243**
  (section 6771 "Inline Add and Edit Parts - Bin Allocation"), covering all 22 S7 rule IDs 1:1, 0 uncovered.
- **Amended existing cases updated to v16:** IAEP-TADD-03 (C45000, S2-R4 bin trigger + typeahead cards),
  IAEP-TADD-05 (C45002, S2-R6 bin split), IAEP-TADD-12 (C45009, S2-R13 keyboard model tab order),
  IAEP-FADD-15 (C45050, S4-R15 keyboard model tab order), IAEP-TEDIT-03 (C45025, S3-R4 edit-row tab order).
- **Provenance re-stamped to v16 / "read on 31 August 2026" on all cases we could touch (114 of 116
  non-held; the 2 held keep v13 stamp).** AUTOMATION marker unchanged "Not available on Build to test
  Yet" (Rule 85, no QA build) with "Last checked 8/31/2026".
- **🛑 Rule 71 HOLD — 2 of our cases are live-flagged Automated (atmstatus=3) by Vladimir Tomovic and
  were NOT edited this pass:** IAEP-TADD-08 (C45005, S2-R9) and IAEP-TEDIT-04 (C45026, S3-R5). Both map
  to rules UNCHANGED in v16, so they miss only the provenance re-stamp, no behaviour change. They also
  carry pre-2026-08-31 CSV-import formatting that fails/warns the render self-check (C45026 no block
  tags; C45005 <br>) — cannot be reformatted without the QA lead's go-ahead (Rule 71). **Ask Sasha/Vlad
  whether to re-stamp + reformat these two.**
- **Foreign case in the group:** **C45220** "Adding a part to a completed line reopens the line" —
  created by **Vladimir Tomovic** (TestRail user 1), Automated (atm=3). Hands-off (Rule 38). It was
  pulled into R418 by the union-sync (below). Note it appears to contradict S1-N1 (Add Part hidden on
  Complete) — surface to the QA lead. Ours **118** / live subtree total **119** (1 foreign).
- **Render self-check:** all 116 cases we wrote render clean (block-only <ol>/<li>/<hr />/<p>, no inline
  tags, no <br>). Only the 2 held Automated cases flag (pre-existing, not ours to fix).
- **Run R418 union-synced (Rule 34): 96 → 119 tests** (added the 22 new bin cases + the foreign C45220;
  nothing dropped). https://shopview.testrail.io/index.php?/runs/view/418
- **Deliverables refreshed:** requirements.md (→ v16 incl. Story 7 + Keyboard Model), coverage-matrix.md
  (129/129, +S7 block), testrail-id-map.csv (118 rows, all C-IDs), testrail-import CSV/XLSX (118 rows),
  author_cases.py + apply_to_testrail.py.
- **Still no QA build → Rule 85 SOURCE-VERIFIED ONLY.** Open PO questions PO-IAEP-1/2 still open.

## Status — 2026-08-31 (render-container repair to fr-view)
- **PROBLEM (measured, not theoretical):** TestRail serves each case field in one of two containers,
  invisible to the API — `<div class="markdown fr-view">` (block HTML renders, readable) vs
  `<div class="markdown">` (block HTML **ESCAPED** — the tester literally reads `<ol><li><p>`). An API
  `update_case` always leaves the field in the ESCAPING container; **only a UI save flips it to
  `fr-view`.** The 2026-08-31 v13→v16 API pass converted these cases' plain text to block HTML, so a
  live scan found **76 of the 118 escaping** (e.g. C45000 = 3/3 fields escaping).
- **FIX (QA-lead-approved UI-repair-to-fr-view):** drove the TestRail web editor with Playwright
  through the local MITM bridge and re-saved each field so the container flips to `fr-view`. Evidence +
  scripts in `render-repair-2026-08-31/` (scan.mjs, repair.mjs, fix_deterministic.mjs, REPAIRED-final.jsonl).
- **RESULT — final re-scan of all 118 (scan-final.json): escaping 0, all-fr-view 118, zero literal
  tags, zero visible entities.** 77 targets (76 escaping + C45005) verified fr-view + numbers visible +
  AUTOMATION marker last + atmstatus/title unchanged; 0 failures.
- **Rule 71 / 65 — the 2 Automated cases (atm=3, Vladimir Tomovic) were UI-repaired this pass with the
  QA lead's explicit go-ahead (skip lifted for these two only):** **C45026 (IAEP-TEDIT-04, S3-R5)** was
  escaping → repaired to fr-view + re-stamped v13→v16; **C45005 (IAEP-TADD-08, S2-R9)** was found live
  already fr-view + v16 and was NOT written. atm=3 preserved on both. FOR-VLAD note:
  `render-repair-2026-08-31/FOR-VLAD-automated-cases-changed-2026-08-31.md`. Foreign C45220 untouched (Rule 38).
- **🛑 LESSON — a case's readability is decided by the SERVED-PAGE CONTAINER, not the API-stored HTML.**
  `build/testing-tools/check_case_render.py` reads the API value and cannot see the container, so an
  API-written case with perfect block HTML PASSES that check yet is UNREADABLE on screen. The only fix
  is a **UI save** (Playwright). Two further traps proven this pass: (1) keystroke-typing "1. " into a
  field that still holds the old `<ol>` intermittently triggers Froala's list-autoformat, which swallows
  the literal "1." into a real `<ol>` marker (lost from the tester's numbered view) — so set content
  **deterministically via the Froala instance** (`window.FroalaEditor.INSTANCES.find(i => i.$oel[0].id ===
  '<field>_display').html.set('<p>line<br>line</p>')`) rather than keystrokes; (2) TestRail intermittently
  rejects the save with **"Deadlock found when trying to get lock"** — **retry the save** (loop, backoff).
  Chromium **cannot TLS through the egress proxy** (connection reset) — it must go through the local MITM
  bridge (`build/atlassian-login/bridge.mjs`, `NODE_USE_ENV_PROXY=1`), and Node fetch API calls likewise
  need `NODE_USE_ENV_PROXY=1` + `NODE_EXTRA_CA_CERTS`.

## Status — 2026-08-31 (layman-UI provisional routes — skill 18)
- **STANDARD ENFORCED (QA lead, 2026-08-31, universal):** no case may ship with spec-level
  preconditions/steps; every case must be runnable from the UI by a manual QA (Victoria). This suite is
  **Rule 85 (no QA build)**, so routes are **DESIGN/SPEC-derived and marked PROVISIONAL — to be
  confirmed on the build.** Only PRECONDITIONS/STEPS were touched; Expected Results unchanged (Rule 57).
- **Routes added (from spec v16 + the "Add Part" design + the sibling Invoice-UI NAVIGATION-MAP's
  confirmed top-nav):** entry route in every case — *In the top menu click "Work Orders" → open a work
  order of the right status → its Lines tab → each work order line has its own Parts section, where
  "Add Part" and the part lines appear.* Permission/view-mode preconditions ('Work Order Line - Create
  and Edit', 'Work Orders → Work Order View Mode' = Tech/Full View) now say plainly that an
  administrator sets them "on your user role; confirm the exact path on the build" — **no admin menu
  path invented** (task hard line). Intermediate-state preconditions (inline row open, bin picker,
  Bin Locations modal, part details modal, discard/navigate-away dialogs, "Pulled from" chip) now name
  the click that reaches them. Wording matches the suite convention (UI labels in smart double quotes,
  permissions in single quotes; no markdown — Froala inserts text literally).
- **Applied through the UI editor (Playwright → Froala `html.set` → Save, deadlock-retry ×15) so each
  field is written AND flipped to `fr-view` in one save** (an API write would leave it escaping).
  Recipe `render-repair-2026-08-31/layman_fix.mjs` (adapted from fix_deterministic.mjs, Rule 27);
  intended content regenerated by `gen_intended.py` from the edited JSONs; checkpoints in
  `REPAIRED-layman.jsonl` / `FAILED-layman.jsonl`.
- **RESULT: 116 of 118 verified on the served page — `markdown fr-view`, 0 literal tags, 0 visible
  entities, route text present, AUTOMATION marker still last, atmstatus & title unchanged. 0 failures.**
- **🛑 Rule 71 — the 2 Automated cases (atm=3, Vladimir Tomovic) were SKIPPED this pass (no go-ahead):
  C45005 (IAEP-TADD-08) and C45026 (IAEP-TEDIT-04).** They still carry spec-level wording and do NOT
  yet meet skill 18. Ready-to-apply route text for both is in `intended-blocks.json`; ask/enrich per
  `render-repair-2026-08-31/FOR-VLAD-layman-routes-automated-2026-08-31.md`.
- **Local JSONs (`cases/`) updated to match TestRail.** No Expected Results / no Jira / no run changes.
- **Still Rule 85 SOURCE-VERIFIED ONLY — routes are PROVISIONAL until a QA build confirms exact tab
  names, the Parts-section placement, the admin paths, and the bin/modal controls.**

## How to resume
1. On go-ahead from Sasha's answers: fold PO-IAEP-1/2 outcomes into IAEP-TEDIT-12 and IAEP-BTN-06/07.
2. When a QA build exists: run skill 03/11 build verification; re-stamp AUTOMATION markers.

## TestRail run (2026-08-25)
- **Full-suite run R418** — all 96 cases — https://shopview.testrail.io/index.php?/runs/view/418. C-IDs backfilled into testrail-id-map.csv. New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).
