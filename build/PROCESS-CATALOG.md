# Process Catalog — the reusable processes you can call (all projects)

> **What this is:** the single index of every reusable process/method/recipe in this workspace,
> what each one does, and **how to call it** for any project. Point Claude at a process by name
> or by its trigger phrase (plus the project name); per **Standing Rule 11**, when a new/updated
> spec arrives OR you ask to VIU, Claude will still confirm which process(es) to run before
> starting.
>
> **How to call one (copy/paste, fill the brackets):**
> *"Run the **[Process name]** for **[project]**."* — e.g. *"Run the Spec-Recheck Change-List
> for Fees & Discounts."* Add any specifics (epic key, spec page, env) if Claude doesn't have
> them yet.
>
> **Always-ask live-build-check rule (Standing Rule 22):** for EVERY process below, at the start
> Claude identifies anything that appears to need observing the LIVE build (labels, controls,
> behaviour, permissions, calculations, states, "what needs to change", VIU, spec-vs-build,
> comparisons) and **ASKS you whether to run the live-build check + requests fresh access
> (cookies + env/branch + flags) before proceeding** — it never skips it or substitutes
> documented/inferred data. Decline and those items are labelled "not live-verified this run".
>
> **Always-check the Confluence spec rule (Standing Rule 23):** for the Spec-Recheck Change-List
> and almost every reconciliation/verification/authoring process, the CURRENT Confluence spec is a
> source of truth. When unsure the local `requirements.md` is current, Claude **ASKS you whether to
> read the Confluence spec** (via Atlassian MCP) and reconcile against it — it never assumes the
> local copy is current or silently skips it.
>
> **Two-session note:** this workspace is worked by more than one Claude session in parallel.
> This catalog + `CLAUDE.md` + the `build/*-PROCESS.md`/`*-METHOD.md`/`*-RECIPE.md` docs are the
> **shared brain** — both sessions read and update them, so any process is callable from either.

## The processes

| # | Process name | What it does | How to call it (trigger) | Deliverable it produces | Doc |
|---|---|---|---|---|---|
| 1 | **Build-Accurate Wording + VIU** | Rewrites every case's Title/Preconditions/Steps/Expected to the EXACT on-screen build labels in plain layman English, VIU-verifies each behaviour LIVE with evidence, then syncs to TestRail via `update_case` with a per-case audit log. This is what **"VIU the test cases"** means (Rule 10). | *"VIU the test cases for [project]"* / *"do the VIU / build-accurate wording pass for [project]"* | Corrected cases in TestRail + wording glossary + evidence + regenerated import/Blockers-Tracker/results workbook (Case ID + link columns) | `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` |
| 2 | **Spec-Relevance Reconciliation** | Whole-suite audit against the CURRENT spec — which cases still deserve to exist, which are stale/obsolete, which contradict a resolved ruling — and regenerates ALL downstream deliverables so nothing hands a tester old-spec wording. | *"Reconcile the whole [project] suite to the new spec"* / *"relevance / obsolescence pass for [project]"* | Relevance verdicts per case + retire/keep/rescope list + regenerated deliverables | `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` |
| 3 | **Spec-Recheck** | Re-checks a feature's cases against the current spec + all DONE Jira tickets (with comments; newest-wins on conflicts), live-verifies labels/behaviour, and reconciles every case to a verdict (OK / UPDATE / OPEN-QUESTION). The analysis half that feeds the Change-List workbook. | *"Run the spec-recheck for [project]"* / *"re-check the cases against the spec + tickets"* | Reconciliation verdicts (100% of cases) + the Change-List workbook (see #4) | `build/SPEC-RECHECK-PROCESS.md` |
| 4 | **Spec-Recheck Change-List Workbook** | Turns the spec-recheck into the ONE simple sign-off file: only the cases needing a change or a decision, each with the driving ticket + whether it's Done, an Action (Apply update / Decision), and a 2nd tab isolating cases blocked on a not-done ticket. Fine cases omitted (count only). Nothing pushed until you approve. **(This is the file `CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx`.)** | *"Give me the change list for [project]"* / *"same change-list file as Custom Roles for [project]"* | `<Project>_SpecRecheck_ChangeList_<date>.xlsx` + `.md` (2 tabs) | `build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md` |
| 5 | **Missing-Traceability** | Finds every case lacking a Jira ticket ref and/or a spec anchor, then (after approval) backfills the metadata layer — TestRail `refs` field = **ticket + spec together** — so 100% of cases are provably authentic (Rule 20). | *"Check missing traceability for [project]"* / *"backfill the ticket + spec refs for [project]"* | Missing-Traceability list + (on approval) backfilled `refs` + audit log + traceability-status workbook | `build/MISSING-TRACEABILITY-PROCESS.md` |
| 6 | **Prod-vs-Staging (Two-Environment) Live Comparison** | Runs a 100% LIVE-OBSERVED role/permission (or any function) comparison between two environments (A vs B) with **ZERO "NOT VERIFIED" cells** — seed data as needed, observe every cell live with evidence. | *"Compare [envA] vs [envB] permissions/functions for [project], live"* | Live-observed comparison findings + evidence bundle | `build/PROD-VS-STAGING-COMPARE-METHOD.md` |
| 7 | **Comparison / Environment-Diff Workbook** | The fixed deliverable SHAPE for any *"make a comparison file"* request (filename starts with "Comparison") — the envs / population / capabilities / spec are the parameters. Pairs with #6 for the live data. | *"Make a comparison file for [A] vs [B]"* | `Comparison_...xlsx` (+ `.md` narrative) in the established layout, + exec/QA companions | `build/COMPARISON-WORKBOOK-RECIPE.md` |
| 8 | **VIU Access Method** | The non-secret how-to for getting live access to ShopView staging for any VIU/live run — network egress, the 3 fresh session cookies, the MITM/boot2 harness, the reusable role. Supporting method the VIU/comparison processes rely on. | *"Set up VIU/live access for [project]"* (usually invoked automatically by #1/#3/#6) | Working live session (no deliverable of its own) | `build/VIU-ACCESS-METHOD.md` |
| 9 | **Process-Authoring Standard** | The user's fixed preferences for HOW any process is written — read the raw transcript for the full instruction history + corrections, capture format AND requirements, include every section, human-readable name, add a catalog row, share with the other session. The meta-process; follow it whenever creating a process. | *"Create a process for [X]"* (this standard governs it automatically) | A complete, catalogued process doc | `build/PROCESS-AUTHORING-STANDARD.md` |

## Notes on choosing between the close ones
- **#1 vs #3:** #1 (Build-Accurate Wording + VIU) fixes each case's *words + behaviour*; #3
  (Spec-Recheck) decides *which cases need changing* vs the spec + Done tickets. They compose.
- **#2 vs #3:** #2 (Spec-Relevance Reconciliation) asks *which cases should still exist* across
  the whole suite; #3 checks *individual cases vs the current spec/tickets*. Rule 11 = always ask
  which to run on a new/updated spec.
- **#3 → #4:** #4 is the sign-off FILE produced from #3's analysis. Ask for #4 when you want the
  simple change list; it will run/reuse #3 first.
- **#6 → #7:** #6 is the live *method* (how to observe both envs); #7 is the *file shape*. A
  "comparison file" request uses both.

## Maintaining this catalog
When a new reusable process is created (or a durable rule changes), **add/adjust a row here in
the same turn** and note it in `CLAUDE.md` so the other session picks it up. Keep filenames
human-readable (Rule 19) and deliverables in the established format (Rule 16).
