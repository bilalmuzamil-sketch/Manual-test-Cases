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
> **Exhaustive-and-exact verification qualifier (Standing Rule 50) — applies to EVERY process row
> below whose deliverable involves a TESTRAIL WRITE (`update_case` / `add_case` / `update_run` /
> section change) or a COUNT RECONCILIATION (live vs local vs id-map vs import rows), i.e. rows 1, 2,
> 3, 4, 5, 6, 7, 8 and any future push/audit/sync process.**
> **EXHAUSTIVE FIRST — the QA lead's own gloss on "byte-level" is *"not to miss anything"*:** every
> case, every field, every requirement (both directions), every surface, every role, every export
> format — **no sampling, no "representative subset", no spot-check reported in language implying the
> whole**; a large population changes the **schedule**, not the **scope** (batch, checkpoint, finish,
> and state the exact number done and the exact remainder). A sample is acceptable **only when you
> explicitly ask for one**, and is labelled as such with its size and population.
> **THEN EXACT** — the verification is **BYTE-LEVEL, never by eye and never by a matching total**. Every write is **re-GET and byte-compared field-by-field against the
> intended payload**, with **every field not intended to change proven byte-identical to its
> pre-write snapshot**; every claimed **non-write** is proven by a byte-identical snapshot
> **including `updated_on`/`updated_by`** (that is how a foreign case is proven untouched, Rule 38);
> every **count** claim is proven as **SET EQUALITY in BOTH directions** (`A − B` and `B − A` both
> empty) — **equal totals are NOT verification**; every **run sync** verifies **each prior result
> present BY ID**, not by count (Rules 34/47). **A mismatch means the write FAILED** — the batch
> STOPS, both byte sequences are reported, nothing is retried blindly or logged as success. The only
> permitted exception is a **DECLARED NORMALISATION** already recorded in
> `build/APP-ACTIONS-PLAYBOOK.md` §J (today: TestRail's `refs` comma-split/trim/rejoin + the 248-char
> per-entry pattern error), asserted explicitly in the audit log — never "close enough". Audit logs
> record **operation · target C-id · HTTP status · byte-level verification result**; an entry saying
> only *"200 OK"* is non-compliant.
>
> **Provenance-line qualifier (Standing Rule 54) — applies to EVERY process row below that AUTHORS or
> UPDATES test cases (rows 1, 2, 3, 4, 5, 6, 7, 8, 11 and any future authoring / VIU / spec-delta /
> recheck / retrofit process).** Every case's **Expected Results ENDS** with a separator line and one
> plain provenance statement of what its expectation is based on, **in TWO SENTENCES THAT ARE NEVER
> MERGED (amended 2026-08-05)**: **SENTENCE 1 — the SOURCE — names ONLY DOCUMENTS** (the epic and/or
> owning story + the specification with its VERSION + the requirement reference, and/or the PO's answer
> file with its link and date) and **NEVER THE BUILD**; **SENTENCE 2 — optional — records the CHECK** in
> neutral language: *"This is the expected behaviour as per epic SV-8582 and the Sales By Customer report
> specification version 13 (S4-R13). Last checked against build v3.5-16cf83f on 8/5/2026."* **The old
> template *"as per the build tested on …" IS BARRED** — it credited the build for the expectation
> (Rule 57); a case that FAILS on the build says only that it was checked, and a case never checked
> against a build **omits** sentence 2. **Any process that re-checks a case against the spec, the epic or the build MUST
> RE-STAMP that line — a stale spec version, stale build date or stale epic reference is ITSELF A
> FINDING**, and a pass is not complete while one survives. Date = **one generator variable**, spec
> versions = a **per-project/per-report map**, stamper **IDEMPOTENT** (replace, never append a second).
> **Never the word "VIU"** or a flag name (imports stay VIU-word-free); the **requirement reference in
> parentheses is an AUTHORISED exception** to the no-anchors-in-tester-text guidance — do not strip it.
> Where a case follows a **later product decision** over the spec text (Rule 32), the line **says so**
> — a stamp asserting a source that does not support the expectation is **worse than none**.
>
> **Divergence-disclosure qualifier (Standing Rule 56, added 2026-08-05) — applies to EVERY process row
> below that AUTHORS or UPDATES test cases (the same rows as the Rule-54 qualifier).** Latest
> authoritative information is the authentic one (Rule 32) — and **latest-wins may no longer happen
> SILENTLY.** Where a case's expected behaviour follows a **LATER decision INSTEAD OF an earlier source**
> (an earlier spec version, a design, or **an earlier ruling by the same PO**), the **Expected Results
> carry, after a line break, one plain sentence** saying **(1) where the PO asked for this behaviour**
> (file/message + link + date), **(2) where it DIFFERS** from the earlier source and what that source
> said, and **(3) that we have taken the latest information as prevailing** — in layman words, so a
> tester who half-remembers the old behaviour does not raise a false bug. It sits **with the Rule-54
> provenance material**, and the **automation marker still goes last** (blank line before and after).
> **RE-STAMPED whenever the sources move** — a divergence note naming a superseded source is itself
> stale, and a stale note is a **finding**. **HONESTY HALF, as firm as the requirement: NO divergence
> sentence where there is NO divergence** — adding one where nothing earlier contradicted the decision
> **manufactures a conflict and is itself a defect**; a later source that merely AGREES is cited as a
> **confirmation** under Rule 54, not disclosed as a difference.
>
> **PO-questionnaire qualifier (Standing Rule 55, added 2026-08-05) — applies to EVERY process row below
> whose deliverable includes a PO/stakeholder QUESTION SHEET (rows 2, 3, 4, 11, 12 and any future
> reconciliation / audit / gap-hunt pass that ends in an open question).** **ASK AGAIN whenever an answer
> is unclear, partial, or something we are INTERPRETING rather than reading — an interpreted answer is
> not an answer** — and sweep **all** open ambiguities onto **ONE sheet** rather than drip separate asks
> (each logged in the Outstanding register, Rule 36). **EVERY question ROW names its PROJECT and its
> FEATURE/REPORT, not just the header**, because a PO answers row by row and **one PO owns more than one
> thing** (Chris Ward = Report Suite **and** Fees & Discounts; Branko = Filters, Schedule **and** Global
> Search), so *"the date filter"* is genuinely ambiguous and a mis-scoped answer costs a whole round
> trip. **EXTREMELY SIMPLIFIED** — *"what happens now"* + the question + simple **A/B** options + a blank
> for the answer; **if it cannot be made simple it is two questions, so split it**; no case IDs, spec
> anchors, HTTP terms or internal names in anything he reads (Rule 7). **Story/epic references included
> in plain form ONLY where they help him place the question** — a judgement call, stated as such. The
> question→case mapping stays on a **QA-only tab** (Rule 8), and the sheet mirrors the established format
> 1:1 (Rule 16) — canonical example
> `build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx`.
>
> **Source-of-expected-behaviour qualifier (Standing Rule 57, added 2026-08-05) — applies to EVERY
> process row below that AUTHORS, VIU's or UPDATES test cases (rows 1, 2, 3, 4, 5, 6, 7, 8, 11 and any
> future authoring / VIU / spec-recheck / spec-delta / recheck / retrofit process).** **EXPECTED
> BEHAVIOUR COMES FROM THE DOCUMENT, NEVER FROM THE BUILD.** Its only three sources are **(a)** the
> **PRD / Confluence specification**, **(b)** the **epic's stories** (description, acceptance criteria,
> comments) and **(c)** the **PO's verified answers** in an answer sheet or message. **FROM THE BUILD
> THESE PROCESSES TAKE EXACTLY TWO THINGS: the exact on-screen LABELS/wording (Rule 9) and the PASS /
> FAIL / deviation VERDICT (Rules 10/12/13) — nothing else.** QA lead, 2026-08-05, verbatim: *"For the
> rule: 'the case should be matched to the build' That doesnt mean the expected behavior should match
> the build. That kills the purpose of the test case. I think when we said 'the case should be matched
> to the build' it meant that the test case should be VIU'd from the build"*. **If the build differs
> from the documented expectation, the case KEEPS the documented expectation and becomes a DEVIATION
> with a ticket — never the reverse**; and **a CLOSED ticket does not change it** (closing as
> "accepted"/"obsolete"/"not reproducible" is triage about whether to FIX, not a spec change — the
> automation marker `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` carries that qualification instead).
> **ONE NARROW EXCEPTION:** where OUR case asserted something **no source supports**, the repair is
> **REMOVAL or scope-conditional wording (Rule 42)** — **never substitution of observed behaviour**.
> **WHERE NO SOURCE SPEAKS AT ALL**, assert only what a source supports and raise the gap as a **PO
> question** (Rules 7/55) in the Outstanding register (Rule 36) — filling it in from the build **HIDES
> the gap**, which is the deeper harm. **AUDIT DIAGNOSTIC: a case whose STEPS were correctly VIU'd
> while its EXPECTED RESULT was quietly changed in the same edit looks freshly maintained and its
> provenance line looks current — diff the expected result against its CITED SOURCE, never against how
> recently the case was touched.**
>
> **Ambiguity-never-settled-by-the-build qualifier (Standing Rule 58, added 2026-08-05) — applies to
> EVERY process row below that INGESTS a source: a PO answer, a spec delta, a walkthrough video, a tech
> plan or a design (rows 1, 2, 3, 4, 11, 12 and any future answer-ingest / spec-delta / reconciliation
> pass).** When an ingested source is **AMBIGUOUS about what the behaviour should be, the ambiguity is
> NEVER settled by observing the build.** The ambiguous answer goes **BACK to the PO (Rule 55)** and the
> affected cases are **HELD with the open question cited on them** and logged in the Outstanding register
> (Rule 36). **Reaching for the build to break a tie is how build behaviour becomes expected behaviour
> WITHOUT ANYONE DECIDING TO DO IT** — and the edit then looks sourced, because the pass legitimately
> cites a PO answer, so it survives every later review. **MECHANICS:** an ingest pass **records per
> answer one verdict — UNAMBIGUOUS (act) or AMBIGUOUS (hold + ask)**, naming the ambiguity; and it **may
> NOT produce a case edit whose new expected result cannot be QUOTED BACK to the source text** (Rule
> 45(e) side-by-side standard) — **if it cannot be quoted, the edit is INVALID**, reverted or held, never
> shipped with a hopeful provenance line. **A pass that classifies nothing is non-compliant.** Accept
> that this sometimes leaves a case **less specific than the build would allow, and that is correct** —
> vague-but-sourced with an open question is honest; precise-but-invented hides the fact that nothing was
> ever decided. **This is the door Rule 57 did not know about: the Report Suite forensics over all 41
> commits proved the VIU passes changed ZERO expectations and the contamination came in through an
> ANSWER-INGEST pass.**
>
> **Re-read-the-sources-before-writing qualifier (Standing Rule 59, added 2026-08-05) — applies to EVERY
> process row below that ENDS IN A WRITE (rows 1, 2, 3, 4, 5, 10, 11 and any future push / retrofit /
> recheck pass; also any Jira filing).** **Rule 31's currency pre-flight runs at PASS START; this adds a
> SECOND, CHEAP check immediately BEFORE THE WRITE PHASE BEGINS** — re-fetch the **governing spec
> version(s)** and re-read **any blocking ticket** at the moment you rely on them. **If a source moved
> between pass start and write start: STOP, RE-DIFF, RE-DERIVE the affected edits before writing** — a
> pass may not write conclusions drawn from a source that has since changed, because they were right when
> reached and are wrong when written, while the log shows them as carefully verified. **MECHANICS:** the
> execution log records **BOTH timestamps — "sources read at pass start" and "sources re-read at write
> start"** — and **states the verdict of the second read**; **a log with only ONE source-read timestamp
> is NON-COMPLIANT**, exactly as one saying only *"200 OK"* is (Rule 50). It is deliberately a version
> number and a ticket status, **not** a second full pre-flight, so it stays affordable on every pass.
> **Earned 2026-08-05: the PO edited ALL SIX Report Suite specs mid-pass — one of them ONE MINUTE before
> it was fetched — flipping the exact anchors the pass had cited; the sources had been read ~35 minutes
> earlier and that was already too long.**
>
> **Never-final-build qualifier (Standing Rule 60, added 2026-08-05) — applies to EVERY process row below
> that OBSERVES A BUILD or reports readiness (rows 1, 3, 6, 8, 10, 11, 12 and any future VIU / recheck /
> readiness pass).** **The QA branches will NOT be declared final before release, so this is the steady
> state, not an exception.** Because expected behaviour comes from documents (Rule 57), **A REDEPLOY
> CANNOT INVALIDATE AN EXPECTATION** — only **three layers** go stale: **(1)** the on-screen **LABELS +
> navigation path** (Rule 9), **(2)** the **PASS/FAIL/deviation VERDICT**, **(3)** the markers asserting
> a build fact (`READY - EXPECT FAIL`, `HOLD - not built`). **Plain `AUTOMATION: READY` asserts
> AUTOMATABLE, not currently-passing, so it is BUILD-INDEPENDENT and survives a redeploy.** Therefore:
> **state which layer every claim belongs to**, per case and in every readiness report; **on a redeploy
> re-check ONLY layers 1–3** rather than re-deriving the suite; **keep the Rule-49 queue permanently OPEN
> as a living work list**; build a **re-runnable label-and-verdict checker per project** so a redeploy
> costs a cheap automated re-check; and record **per case when it was last checked** (Rule 54 sentence 2).
> **NEVER let *"the branch is not final"* become a blanket caveat — a caveat on everything tells the
> reader nothing.** A report states **exactly which cases were observed, on WHICH BUILD MARKER, and HOW
> MANY WERE NOT.** **HONESTY HALF: this makes the re-check AFFORDABLE, it does NOT licence claiming
> coverage we do not have** — an unobserved row stays unobserved (Rules 12/17/50), and the correct
> sentence is *"N of M observed on build <marker>; the remaining M−N carry their last recorded check"*.
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

| 12 | **Outside-In Gap Hunt** | **Looks at our suite from OUTSIDE our own work — the control for "somebody else found a gap before we did" (Standing Rule 45).** Rules 40-44 force follow-through on what WE detected; this one exists because we had **no way to notice an OUTSIDER could see what we could not**. Five stages, each with a stated result ("not applicable" is allowed, **silence is not**): **(a) FOREIGN-COVERAGE DIFF IN BOTH DIRECTIONS** — the overlap direction (do THEIR cases duplicate ours?) **and the REVERSE direction (do THEY assert something with NO counterpart in ours?)**; **their case existing where ours does not is a COVERAGE SIGNAL, not a nuisance**; every foreign assertion labelled COVERED-BY / **CANDIDATE GAP** / **CONTRADICTS-OURS**, authors resolved via `get_user/{id}`, counts reported as **"ours N / live total M"** (Rule 38); **(b) the AUTOMATION-ENGINEER LENS** — *"if I were automating this from the RUNNING BUILD, what would I assert?"* (**honest limit stated: without a QA branch this reaches only as far as the document** — Rule 12, and the branch is logged as an outstanding ask); **(c) the HOSTILE-REVIEWER LENS** — *"what would a reviewer claim is missing?"* **before** delivery; **(d) EVERY EXTERNAL SIGNAL IS A COVERAGE INPUT, NEVER MERELY A REPLY** — reviewer reports, colleagues' cases, support tickets, dev comments, customer complaints each LOGGED and DIFFED against the suite; **(e) THE EVIDENCE TEST** — a *"covered"* or NO-CHANGE verdict is **invalid** unless it quotes **the requirement's text beside the covering case's text**, and a requirement asserting **two things gets one row PER ASSERTION**. Pairs with the **Rule-46 DELIBERATE-DECISIONS register** (every deliberate non-authoring / PO-over-spec choice / held item / accepted imperfection written down with evidence + a plain one-sentence answer **before anyone asks**, because an undocumented deliberate omission is indistinguishable from a miss). **READ-ONLY; foreign cases are never edited, moved or deleted (Rule 38); a candidate gap is authorised by the QA lead, never authored on our own initiative (Rule 6).** | *"outside-in gap hunt"* / *"what would someone else find?"* / *"reverse coverage diff"* / *"foreign case check"* / *"did we miss any test cases others could raise?"* / *"check our cases against Vlad's"* / runs as **Dimension 4** of every Ruthless Usefulness Audit and as a step of every Spec-Relevance Reconciliation | `OUTSIDE-IN-GAP-HUNT-<date>.md` (one stated result per stage a-e) + `DELIBERATE-DECISIONS.md` (six fields per entry: decision - plain one-sentence answer - evidence - affected cases with C-ids + links - who closes it **[if that is the QA LEAD himself, Standing Rule 48 applies: quote his ruling verbatim + its date + the question it answered + why it was reasonable + the one thing that would unblock it]** - honest RISK) + the checker output (`REVERSE-DIFF-<date>.md`/`.csv`/`.json`) | `CLAUDE.md` Standing Rules **45** + **46**; root-cause analysis `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`; checkers `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` (reverse) + `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py` (overlap); canonical examples `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md` + `build/report-suite/coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md` + `build/qa-preemptive-answers-2026-07-31/` |

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
