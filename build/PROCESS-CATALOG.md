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
> **EVERY process now BEGINS with the Rule-31 ALL-SOURCES currency check (Standing Rules 31 + 32;
> strengthened 2026-07-31):** before any test-case work, Claude establishes that we hold the CURRENT
> version of **every** source — (1) the **spec** (live Confluence version + last-updated), (2) the
> **epic + its child stories** (story set, statuses, description/comment changes), (3) the
> **designs** (Figma file/nodes; an open Rule-35 fetch queue means the designs are NOT current),
> (4) the **engineering tech plan** (Rule 30) and (5) the **PO/stakeholder answers, messages and
> videos** — folds in any deltas FIRST, and emits a **SOURCE-CURRENCY block** in the deliverable
> (per source: identifier, version/last-updated, date checked, CURRENT / STALE / PARTIAL, with a
> PARTIAL source naming its exact shortfall). Nothing may claim completeness while a source is
> STALE; if a source can't be fetched Claude STOPS and asks for access. Note the two traps: a
> Confluence page's in-body "Version" can sit at 1.0 while the real version advances, and a Jira
> epic's "updated" date moves for admin-only edits — Claude uses the Confluence version number and
> the Jira changelog. Where sources disagree, the most recent authoritative product source wins
> (source + date recorded on the case).
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
| 2 | **Spec-Relevance Reconciliation** | Whole-suite audit against the CURRENT spec — which cases still deserve to exist, which are stale/obsolete, which contradict a resolved ruling — and regenerates ALL downstream deliverables so nothing hands a tester old-spec wording. **The diff step now REQUIRES a PER-REQUIREMENT COVERAGE VERDICT TABLE (Standing Rule 43): every added/changed/removed requirement gets its OWN row + verbatim text + exactly one verdict (covered / extended / new case / not independently testable / blocked), row count reconciled against the diff's delta count — a narrative summary is NOT acceptable; coverage matrices are RE-DERIVED per spec version (both directions: requirement→case and case→requirement), never incrementally patched; multi-surface requirements expand to one verdict PER SURFACE (Rule 40). Every case touched is RE-VERIFIED WHOLE and logged as such (Rule 41), and closed "exactly these …" lists are rewritten scope-conditionally with a version-pinned anchor (Rule 42).** | *"Reconcile the whole [project] suite to the new spec"* / *"relevance / obsolescence pass for [project]"* | Relevance verdicts per case + **the per-requirement coverage verdict table** + retire/keep/rescope list + regenerated deliverables | `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` |
| 3 | **Spec-Recheck** | Re-checks a feature's cases against the current spec + all DONE Jira tickets (with comments; newest-wins on conflicts), live-verifies labels/behaviour, and reconciles every case to a verdict (OK / UPDATE / OPEN-QUESTION). The analysis half that feeds the Change-List workbook. | *"Run the spec-recheck for [project]"* / *"re-check the cases against the spec + tickets"* | Reconciliation verdicts (100% of cases) + the Change-List workbook (see #4) | `build/SPEC-RECHECK-PROCESS.md` |
| 4 | **Spec-Recheck Change-List Workbook** | Turns the spec-recheck into the ONE simple sign-off file: only the cases needing a change or a decision, each with the driving ticket + whether it's Done, an Action (Apply update / Decision), and a 2nd tab isolating cases blocked on a not-done ticket. Fine cases omitted (count only). Nothing pushed until you approve. **(This is the file `CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx`.)** | *"Give me the change list for [project]"* / *"same change-list file as Custom Roles for [project]"* | `<Project>_SpecRecheck_ChangeList_<date>.xlsx` + `.md` (2 tabs) | `build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md` |
| 5 | **Missing-Traceability** | Finds every case lacking a Jira ticket ref and/or a spec anchor, then (after approval) backfills the metadata layer — TestRail `refs` field = **ticket + spec together** — so 100% of cases are provably authentic (Rule 20). | *"Check missing traceability for [project]"* / *"backfill the ticket + spec refs for [project]"* | Missing-Traceability list + (on approval) backfilled `refs` + audit log + traceability-status workbook | `build/MISSING-TRACEABILITY-PROCESS.md` |
| 6 | **Prod-vs-Staging (Two-Environment) Live Comparison** | Runs a 100% LIVE-OBSERVED role/permission (or any function) comparison between two environments (A vs B) with **ZERO "NOT VERIFIED" cells** — seed data as needed, observe every cell live with evidence. | *"Compare [envA] vs [envB] permissions/functions for [project], live"* | Live-observed comparison findings + evidence bundle | `build/PROD-VS-STAGING-COMPARE-METHOD.md` |
| 7 | **Comparison / Environment-Diff Workbook** | The fixed deliverable SHAPE for any *"make a comparison file"* request (filename starts with "Comparison") — the envs / population / capabilities / spec are the parameters. Pairs with #6 for the live data. | *"Make a comparison file for [A] vs [B]"* | `Comparison_...xlsx` (+ `.md` narrative) in the established layout, + exec/QA companions | `build/COMPARISON-WORKBOOK-RECIPE.md` |
| 8 | **VIU Access Method** | The non-secret how-to for getting live access to ShopView staging for any VIU/live run — network egress, the 3 fresh session cookies, the MITM/boot2 harness, the reusable role. Supporting method the VIU/comparison processes rely on. | *"Set up VIU/live access for [project]"* (usually invoked automatically by #1/#3/#6) | Working live session (no deliverable of its own) | `build/VIU-ACCESS-METHOD.md` |
| 9 | **Process-Authoring Standard** | The user's fixed preferences for HOW any process is written — read the raw transcript for the full instruction history + corrections, capture format AND requirements, include every section, human-readable name, add a catalog row, share with the other session. The meta-process; follow it whenever creating a process. | *"Create a process for [X]"* (this standard governs it automatically) | A complete, catalogued process doc | `build/PROCESS-AUTHORING-STANDARD.md` |
| 10 | **Custom-Roles / Permission-VIU** | Runs a COMPLETE Custom Roles & Permissions test for a feature/epic — live, against its CURRENT spec + all Done tickets (newest-wins) — in 4 layers (composition / backend 403-200 / front-end route guards / element controls), reset-to-template first (persistent re-reset on drift), every verdict observed live with evidence, and delivers a plain-English management report. Composes #1/#6/#8. Proven on Simple Flow SV-8183. | *"Test the custom roles permissions for [project]"* / *"VIU the permissions for [project]"* / *"test [project]'s permission ticket [key] live"* | `<Project>_<TICKET>_Permission-Test-Report_<date>.md` + `.xlsx` (7 tabs: Executive Summary / How We Tested / Permission-by-Permission / Role×Permission Matrix / Test Case Results / Findings / Scorecard) + evidence bundle; TestRail refine only on explicit auth | `build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` |
| 11 | **Ruthless Usefulness Audit** | The **three-dimension quality gate (useful + makes-sense + genuine/layman-runnable)**: scores 100% of a suite's cases (1) KEEP / MERGE / WEAK-KEEP / CUT (would a tester ever catch a real, non-duplicated bug with this case? — hunts the 7 named slop patterns, credits the load-bearing coverage), (2) SENSIBLE / FIX-WORDING / NONSENSE / CONTRADICTION (the cold-read coherence check: **7** fail conditions — **F7 = an unanchored absolute enumeration, i.e. a closed "exactly these headers" list with no version-pinned governing anchor and no scope-conditional wording, Standing Rule 42** — offending text quoted, KEEP-but-NONSENSE embarrassment check — **PLUS the mandatory CROSS-CASE CONSISTENCY SWEEP: cases grouped by the control they assert on and diffed against each other, opposite-assertion keyword sweep, TITLE-vs-EXPECTED check on every case, same-`refs`-anchor diff, and the SURFACE-SPLIT CHECK (Standing Rule 40) — group by requirement anchor and verify EVERY surface the requirement names (screen · PDF · CSV · print · API · mobile · selector · empty state) has a case, delivering a SURFACE MATRIX with one verdict per cell and every gap named; contradictions resolved by the Rule-33 precedence order and the whole group aligned — no suite ships with an unresolved contradiction or an un-verdicted surface cell**), and (3) genuine + layman-runnable (Rule 20 ticket+spec traceability; Rules 7/9 plain non-technical wording — failures → FIX-WORDING or CUT); answers "is the critic right?" honestly on BOTH halves (waste % AND makes-no-sense %). **MANDATORY final gate of every authoring pass (Standing Rule 28 — the suite ships with its three-dimension tally as proof)**; also on demand for any existing suite; recommendations only — TestRail merges/cuts need explicit approval (Rule 6). **Post-delivery loop (standing, 2026-07-29):** tester-marked-**Blocked** cases = a standing intake queue — every Blocked case gets a manual revisit (current spec + live build) and a logged, authorized correction (reword / fix expectation / merge / retire), so the suite permanently self-corrects; presentable pipeline overview = `build/QA-QUALITY-PIPELINE-EXPLAINER.md`. | *"usefulness audit"* / *"slop check"* / *"sense-check the cases"* / *"audit the cases for waste"* / runs automatically after every authoring pass | `build/<project>/quality-audit-<date>/`: `USEFULNESS-AUDIT-<date>.md` (+ `SENSE-CHECK-<date>.md`) (per-area verdict + sense tables + headline current→recommended + full NONSENSE/FIX-WORDING lists + honest critic paragraph + layman exec paragraph) + `per-case-verdicts.csv` (C-id + link per Rule 8; sense_verdict + sense_reason columns mandatory) + `MERGE-PLAN.md` (approvable wholesale or per-group) + the CONTRADICTION list / `CONTRADICTION-SWEEP-<date>.md` (each group: both assertions quoted, precedence winner + ruling, alignment edits, or PENDING PO question) | `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` — canonical examples `build/report-suite/quality-audit-2026-07-28/` + (cross-case sweep) `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md` |

| 12 | **Outside-In Gap Hunt** | **Looks at our suite from OUTSIDE our own work — the control for "somebody else found a gap before we did" (Standing Rule 45).** Rules 40-44 force follow-through on what WE detected; this one exists because we had **no way to notice an OUTSIDER could see what we could not**. Five stages, each with a stated result ("not applicable" is allowed, **silence is not**): **(a) FOREIGN-COVERAGE DIFF IN BOTH DIRECTIONS** — the overlap direction (do THEIR cases duplicate ours?) **and the REVERSE direction (do THEY assert something with NO counterpart in ours?)**; **their case existing where ours does not is a COVERAGE SIGNAL, not a nuisance**; every foreign assertion labelled COVERED-BY / **CANDIDATE GAP** / **CONTRADICTS-OURS**, authors resolved via `get_user/{id}`, counts reported as **"ours N / live total M"** (Rule 38); **(b) the AUTOMATION-ENGINEER LENS** — *"if I were automating this from the RUNNING BUILD, what would I assert?"* (**honest limit stated: without a QA branch this reaches only as far as the document** — Rule 12, and the branch is logged as an outstanding ask); **(c) the HOSTILE-REVIEWER LENS** — *"what would a reviewer claim is missing?"* **before** delivery; **(d) EVERY EXTERNAL SIGNAL IS A COVERAGE INPUT, NEVER MERELY A REPLY** — reviewer reports, colleagues' cases, support tickets, dev comments, customer complaints each LOGGED and DIFFED against the suite; **(e) THE EVIDENCE TEST** — a *"covered"* or NO-CHANGE verdict is **invalid** unless it quotes **the requirement's text beside the covering case's text**, and a requirement asserting **two things gets one row PER ASSERTION**. Pairs with the **Rule-46 DELIBERATE-DECISIONS register** (every deliberate non-authoring / PO-over-spec choice / held item / accepted imperfection written down with evidence + a plain one-sentence answer **before anyone asks**, because an undocumented deliberate omission is indistinguishable from a miss). **READ-ONLY; foreign cases are never edited, moved or deleted (Rule 38); a candidate gap is authorised by the QA lead, never authored on our own initiative (Rule 6).** | *"outside-in gap hunt"* / *"what would someone else find?"* / *"reverse coverage diff"* / *"foreign case check"* / *"did we miss any test cases others could raise?"* / *"check our cases against Vlad's"* / runs as **Dimension 4** of every Ruthless Usefulness Audit and as a step of every Spec-Relevance Reconciliation | `OUTSIDE-IN-GAP-HUNT-<date>.md` (one stated result per stage a-e) + `DELIBERATE-DECISIONS.md` (six fields per entry: decision - plain one-sentence answer - evidence - affected cases with C-ids + links - who closes it - honest RISK) + the checker output (`REVERSE-DIFF-<date>.md`/`.csv`/`.json`) | `CLAUDE.md` Standing Rules **45** + **46**; root-cause analysis `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`; checkers `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` (reverse) + `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py` (overlap); canonical examples `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md` + `build/report-suite/coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md` + `build/qa-preemptive-answers-2026-07-31/` |

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
- **#11 → #12:** #12 (Outside-In Gap Hunt) is **Dimension 4 of #11**, not an alternative to it.
  #11 judges the cases we wrote from our own point of view; #12 asks whether somebody outside could
  see something we cannot. **A suite is not "audited clean" until #12 has run** — that is the whole
  lesson of 2026-07-31, when an outside automation engineer's case exposed a five-report export gap
  our own audit had passed.
- **#2 and #11 both gained checks on 2026-07-31 (Standing Rules 40–44).** #2's diff step now REQUIRES
  the **per-requirement coverage verdict table** (Rule 43) and re-derives the coverage matrix per spec
  version instead of patching it; #11's Stage-2b sweep gained the **surface-split check + surface
  matrix** (Rule 40, helper (iv)) and Dimension 2 gained fail condition **F7** for unanchored
  absolute enumerations (Rule 42). Any case either process touches is **re-verified whole and logged
  as such** (Rule 41), and a contradicting case by another author is treated as a **bug report against
  our suite until we re-derive our own position** (Rule 44). Read
  **`build/LESSONS-2026-07-31.md`** (the retrospective these five rules came from) before running
  either process on a spec delta.
- **TEST-RUN SYNCING — SCOPE QUALIFIER (Standing Rule 47, 2026-07-31).** Several processes end in a
  TestRail push (#1 wording+VIU, #2 reconciliation, #3/#4 spec-recheck, #5 traceability) and
  **Standing Rule 34 makes a RUN-SYNC CHECK the last step of every such push** — so this qualifier
  applies to all of them: **the run-sync duty covers ONLY the runs of the projects we are actively
  working — Filters run 352 · Schedule run 357 · Reports Suite run 359 — and only to keep them
  COMPLETE** (every active case present as a test), re-checked whenever cases are added, edited or
  retired. **Runs belonging to other projects, to COMPLETED projects (324 Fees & Discounts, 325
  Simple Flow), or created by another author for work we are not doing — specifically run 278
  (Vladimir Tomovic's Custom Permissions run) — are IGNORED ENTIRELY: not synced, not written to,
  and not audited for missing cases.** Our coverage is measured against the **case suite under our
  group**, never against someone else's run selection. Sync is **UNION-ONLY** — `update_run`
  REPLACES the selection, so a partial `case_ids` list deletes tests **and their recorded results**;
  snapshot `get_tests` + `get_results_for_run` before any write and verify counts + every prior
  result after. Run writes still need explicit authorization (Rule 6). Foreign **cases** remain
  hands-off under Rule 38 — that governs cases, this governs runs, and both stand. Method + audit +
  the prepared completeness re-check: `build/testrail-run-sync-2026-07-31/`.

## Maintaining this catalog
When a new reusable process is created (or a durable rule changes), **add/adjust a row here in
the same turn** and note it in `CLAUDE.md` so the other session picks it up. Keep filenames
human-readable (Rule 19) and deliverables in the established format (Rule 16).
