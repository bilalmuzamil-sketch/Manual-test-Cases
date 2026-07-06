# Simple Flow — Project Status

> **Project:** Simple Flow (Simple Mode — Streamlined Work Order Completion &
> Receiving). ShopView. Epic **SV-7301**.
> **Separate project** from Custom Roles and Fees & Discounts — keep memory
> separate (shared infra: staging access + TestRail harness may be reused).
> **Phase:** INGESTION + COMPLETENESS ASSESSMENT complete. **No test cases
> authored yet.** Do NOT touch TestRail.

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

1. **No permissions/role matrix.** Spec §8 leaves "which roles do completion vs
   bulk receive vs settings vs review" OPEN; Story 16 role-gating (custom roles vs
   open for v1) is undecided. Role-based cases would be guesses. **NEED from
   user.**
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
