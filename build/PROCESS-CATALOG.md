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
> **EVERY process now BEGINS with the Rule-31 spec pull (Standing Rules 31 + 32):** before any
> test-case work, Claude pulls the LATEST spec from its canonical URL, records its version +
> last-updated date, and folds in any deltas first — and where sources disagree, the most recent
> authoritative product source wins (source + date recorded on the case).
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
| 10 | **Custom-Roles / Permission-VIU** | Runs a COMPLETE Custom Roles & Permissions test for a feature/epic — live, against its CURRENT spec + all Done tickets (newest-wins) — in 4 layers (composition / backend 403-200 / front-end route guards / element controls), reset-to-template first (persistent re-reset on drift), every verdict observed live with evidence, and delivers a plain-English management report. Composes #1/#6/#8. Proven on Simple Flow SV-8183. | *"Test the custom roles permissions for [project]"* / *"VIU the permissions for [project]"* / *"test [project]'s permission ticket [key] live"* | `<Project>_<TICKET>_Permission-Test-Report_<date>.md` + `.xlsx` (7 tabs: Executive Summary / How We Tested / Permission-by-Permission / Role×Permission Matrix / Test Case Results / Findings / Scorecard) + evidence bundle; TestRail refine only on explicit auth | `build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` |
| 11 | **Ruthless Usefulness Audit** | The **three-dimension quality gate (useful + makes-sense + genuine/layman-runnable)**: scores 100% of a suite's cases (1) KEEP / MERGE / WEAK-KEEP / CUT (would a tester ever catch a real, non-duplicated bug with this case? — hunts the 7 named slop patterns, credits the load-bearing coverage), (2) SENSIBLE / FIX-WORDING / NONSENSE / CONTRADICTION (the cold-read coherence check: 6 fail conditions, offending text quoted, KEEP-but-NONSENSE embarrassment check — **PLUS the mandatory CROSS-CASE CONSISTENCY SWEEP: cases grouped by the control they assert on and diffed against each other, opposite-assertion keyword sweep, TITLE-vs-EXPECTED check on every case, same-`refs`-anchor diff; contradictions resolved by the Rule-33 precedence order and the whole group aligned — no suite ships with an unresolved contradiction**), and (3) genuine + layman-runnable (Rule 20 ticket+spec traceability; Rules 7/9 plain non-technical wording — failures → FIX-WORDING or CUT); answers "is the critic right?" honestly on BOTH halves (waste % AND makes-no-sense %). **MANDATORY final gate of every authoring pass (Standing Rule 28 — the suite ships with its three-dimension tally as proof)**; also on demand for any existing suite; recommendations only — TestRail merges/cuts need explicit approval (Rule 6). **Post-delivery loop (standing, 2026-07-29):** tester-marked-**Blocked** cases = a standing intake queue — every Blocked case gets a manual revisit (current spec + live build) and a logged, authorized correction (reword / fix expectation / merge / retire), so the suite permanently self-corrects; presentable pipeline overview = `build/QA-QUALITY-PIPELINE-EXPLAINER.md`. | *"usefulness audit"* / *"slop check"* / *"sense-check the cases"* / *"audit the cases for waste"* / runs automatically after every authoring pass | `build/<project>/quality-audit-<date>/`: `USEFULNESS-AUDIT-<date>.md` (+ `SENSE-CHECK-<date>.md`) (per-area verdict + sense tables + headline current→recommended + full NONSENSE/FIX-WORDING lists + honest critic paragraph + layman exec paragraph) + `per-case-verdicts.csv` (C-id + link per Rule 8; sense_verdict + sense_reason columns mandatory) + `MERGE-PLAN.md` (approvable wholesale or per-group) + the CONTRADICTION list / `CONTRADICTION-SWEEP-<date>.md` (each group: both assertions quoted, precedence winner + ruling, alignment edits, or PENDING PO question) | `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` — canonical examples `build/report-suite/quality-audit-2026-07-28/` + (cross-case sweep) `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md` |

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
