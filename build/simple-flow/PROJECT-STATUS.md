# Simple Flow — Project Status

> **Project:** Simple Flow (Simple Mode — Streamlined Work Order Completion &
> Receiving). ShopView. Epic **SV-7301**.
> **Separate project** from Custom Roles and Fees & Discounts — keep memory
> separate (shared infra: staging access + TestRail harness may be reused).
> **Phase:** Cases authored (**159 cases**) + **SV-8183 permissions APPLIED**
> (2026-07-07). Deliverables regenerated (workbook + interim TestRail import).
> VIU PARTIAL (feature under development). Do NOT touch TestRail.

## API-folder rule applied (2026-07-08)

STANDING RULE 4 (CLAUDE.md) is now applied to this project: any case whose
preconditions/steps/expected include API-related content (endpoints, HTTP
verbs/status codes, backend request/response checks) is routed to a TestRail
section whose title includes "API". Each case JSON now carries an `api_related`
boolean, and `gen_import.py` / `gen_update.py` / `gen_blockers.py` derive the
section from it (`"API — <leaf area>"` when true, else the leaf area).

- **7 cases** flagged API-related and moved into **2 API sections**:
  `API — Work Order Settings` (SF-SET-04, SF-SET-07, SF-SET-09, SF-SET-11,
  SF-SET-12) and `API — Permissions` (SF-PERM-01, SF-PERM-06).
- Regenerated import still has **159** data rows + byte-identical header,
  **0 VIU / 0 feature-flag**.

## Unblock → Update loop (2026-07-07)

The delivery package now supports an iterative unblock→update loop. **The Blockers
Tracker is the source of truth** for what every case is waiting on and who
unblocks it.

- **Upload file (first):** `testrail-import/simple-flow-v1-testrail-import.csv`
  (+ `.xlsx`) — all **159** cases, 0 VIU / 0 feature-flag / leaf sections /
  header byte-identical to the reference. Regenerate: `gen_import.py`.
- **Blockers Tracker (source of truth):**
  `build/simple-flow/SimpleFlow_Blockers_Tracker.xlsx` (+ `.md`) — every case →
  state + blocker category + owner + what's-needed. Regenerate: `gen_blockers.py`.
- **Update generator:** `build/simple-flow/gen_update.py` — emits a TestRail-ready
  UPDATE file for ONLY the cleared cases (ID-matched CSV via
  `testrail-id-map.csv`; XML on request). Process: `UPDATE-LOOP-README.md`.

### Current counts by blocker category (of 159)

| Category | Count | Owner |
|---|---:|---|
| READY (VIU-Verified, uploadable) | 42 | — |
| BLOCKED — DEV NOT BUILT | 25 | Dev team |
| BLOCKED — VIU PENDING (QA) | 71 | QA (cookies + seed + role accounts) |
| BLOCKED — MILOS ANSWER | 15 | Milos (PO) |
| BLOCKED — BUG/RULING | 6 | Dev / PO ruling |

DEV-NOT-BUILT breakdown: Story 8 Bulk Receive = 12 (10 SF-BULK + SF-PERM-03 +
SF-VAL-09), Story 7 PO multi-select = 6, Story 9 apply-invoice = 4 (3 SF-INV +
SF-VAL-10), Story 14 Waiting-on-Parts = 3.

### New VIU bugs (see `bugs-log.md`)
- BUG-5 reviewer≠completer NOT enforced (High).
- BUG-6 WO-completion permission FE-only at the BE — Technician completed via API (High).
- BUG-7 review sign-off permission FE-only at the BE (High).
- Contradiction to resolve: SV-8183 "BE enforces" vs SV-7864 atom-collapse.

## SV-8183 update (2026-07-07)

- **Permissions are now DEFINED.** SV-8183 maps every Simple-Flow action to an
  existing Custom Roles atom (no new atom) plus the NET-NEW **reviewer≠completer**
  rule — see `requirements.md §9`/`§10` and `SV-8183-permissions-source.md`.
- All role-gating cases rewritten to the matrix; **3 new cases** added
  (SF-PERM-08/09/10) → **159 total** (was 156). All IDs unique.
- Deliverables **regenerated**: `SimpleFlow_V1_TestCases.xlsx/.csv` and
  `testrail-import/simple-flow-v1-testrail-import.csv/.xlsx` (0 VIU / 0
  feature-flag / leaf sections / header-matched). Open Questions tab marks the 3
  SV-8183-resolved items RESOLVED and keeps 11 open.
- **Remaining open questions are PENDING MILOS** (Product Owner): captured in the
  shareable `OpenQuestions-for-Milos.md`/`.xlsx` (11 questions). Role-gating
  negatives remain VIU-Pending (admin-only session on sv7301).

## What we have

- **Complete product spec** parsed from the .doc (MHTML) →
  `build/simple-flow/requirements.md`. 17 stories (SV-7696…SV-7710, SV-7870,
  SV-7876), each with acceptance criteria; full business case, key decisions,
  cross-system/QuickBooks + inventory integrity rules, terminology, open
  questions.
- **Rich design bundle** → `build/simple-flow/design-notes.md`. 15 HTML
  prototypes/mockups (interactive completion wizard, cores gate, settings,
  PO list/detail, bulk receive, WO list), 3 developer handoffs with case matrices
  and test IDs, JSX/CSS sources, ~50 screenshots.
- **Sources log** → `build/simple-flow/sources-log.md`.

## What is missing / blocked (resolve before authoring cases)

1. ~~**No permissions/role matrix.**~~ **RESOLVED by SV-8183** (2026-07-07):
   completion / bulk receive / settings / review role-gating are now DEFINED via
   existing Custom Roles atoms + the reviewer≠completer rule (`requirements.md §9`).
   Role-gating negatives still need live verification (VIU-Pending).
2. **Spec-version drift.** Doc = V2.3; design handoffs = V1.4. Confirm which is
   authoritative.
3. **Settings-default conflict (spec vs design).** Spec: Auto-approve OFF /
   Vendor invoice REQUIRED. Design: Auto-approve ON / Vendor invoice Optional, and
   design omits the Require-review toggle. **Confirm correct defaults.**
4. **Design pending items:** close-vs-cancel confirm (S15-R4); Require-review +
   VIN toggles not yet on Workflow Settings; Story 16 review default + role-gating;
   "Ready for Review" queue; Story 4 inline invoice entry / delete-line-from-modal
   (currently routes to receive page).
5. **Tech-story placement** (modal vs on-the-line) — confirm Story 17 supersedes
   S15-R2.
6. **Unanswered §8 questions** affecting expected results: cost-at-completion,
   auto-receive of in-stock parts on simple completion, and whether the **backend
   enforces** Simple-Flow settings (in Custom Roles we found BE often enforces only
   resource-level View/Edit; granular gates were front-end only — the same
   FE-gate-vs-BE-enforcement split likely matters here).
7. **Confluence + Jira blocked (403).** Could not verify latest spec version or
   read individual Jira stories. If the user wants the live epic/story bodies read,
   an authenticated path is required.

## VIU (Verify-in-UI) posture — PARTIAL

**This feature is UNDER DEVELOPMENT.** Per the design handoffs, several surfaces
are "not yet built" (close-confirm, review toggle in settings, Ready-for-Review
queue, Story-4 inline invoice entry). So VIU will be **partial**: some surfaces
are testable now, others are prototype-only / not yet implemented.
- QA env referenced by design = **sv7301 (POC)**.
- The user **may supply QA-env cookies later** — keep them in `/tmp` only, never
  commit. Reuse the fresh-MITM-bridge + boot2 hydration approach from the shared
  testing runbook when live verification begins.

## Next steps (await user direction — do not proceed unsolicited)

1. Get the user to resolve the gaps above (esp. permissions table + the
   spec/design default conflict + spec version).
2. Decide VIU scope given the under-development state (which surfaces are live on
   sv7301).
3. Only then: draft the settings-driven test matrix (the spec explicitly says
   "Settings drive behavior; QA tests the matrix") + per-story cases.

## Standing rules reminder

- Never write to TestRail without explicit user permission.
- Confirm the target project (Simple Flow) on every instruction — this workspace
  holds 3 projects.
- Never commit secrets — `/tmp` only.
