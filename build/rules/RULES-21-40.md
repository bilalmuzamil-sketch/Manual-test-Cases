# ShopView QA — Standing Rules 21–40

This file holds the FULL, VERBATIM text of Standing Rules 21–40.

Full archive: build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md
Index: CLAUDE.md (rule index table). Other rule files: build/rules/RULES-01-20.md, build/rules/RULES-21-40.md, build/rules/RULES-41-60.md, build/rules/RULES-61-ONWARD.md

**Read the rule you are about to apply here, in full — the index is not the rule.**

---

21. **When CREATING a process, follow the Process-Authoring Standard — do NOT skip
    anything (all projects).** The user has a fixed preference for how a reusable
    process/recipe/method is written (stated 2026-07-23: "whenever you are creating the
    process keep in mind my preference for making a process and do not skip anything").
    Every process doc MUST: (1) be built from the FULL originating instruction history read
    from the RAW TRANSCRIPT (not a summary or memory — Rule 18), verified line by line, with
    every correction folded in; (2) capture BOTH the final accepted FORMAT and the
    REQUIREMENTS/CORRECTIONS behind it; (3) contain ALL sections — plain-English purpose,
    trigger phrases, kickoff prompt, originating-instructions+corrections, exact deliverable
    format (mirror 1:1, canonical example path), numbered steps, reusable generator/tooling,
    guardrails, honesty notes; (4) carry a human-readable filename (Rule 19); (5) get a row
    added to build/PROCESS-CATALOG.md in the SAME turn; (6) be indexed in this CLAUDE.md and
    shared with the other session; (7) end by telling the user the name + how to call it and
    offering a dry-run. **The full checklist is build/PROCESS-AUTHORING-STANDARD.md.** The
    canonical index of all callable processes is **build/PROCESS-CATALOG.md** (read it to
    pick/name a process for any project). Ties to Standing Rules 16/17/18/19.
22. **ALWAYS ASK about a live-build check up front — for EVERY process/task — whenever
    anything appears to require it (all projects).** A live-build check (observing the real
    staging/QA build with evidence) is a mandatory step of most of these processes, and access
    needs the user to supply fresh cookies. Therefore, at the START of any process or task,
    identify every step/deliverable/cell that APPEARS to need observing the live build — on-screen
    labels/wording, a control's presence/absence, a behaviour, a permission/role gate, a
    calculation, a state/flow, "what needs to change" descriptions, VIU/verification, spec-vs-build
    conformance, comparisons — and **ASK the user whether to run the live-build check for those
    items, and request the access needed (fresh cookies + env/branch + feature-flag state), BEFORE
    proceeding.** Never silently skip it, and never substitute documented prior findings,
    `viu_status`, memory, spec text, source code, or inference for a fresh live observation to
    appear complete (Rule 12). If the user declines the live check, proceed but clearly LABEL every
    such item as "not live-verified this run" in the deliverable. When live access is required but
    missing, STOP and request it rather than guessing. Rationale, 2026-07-23: the first Simple Flow
    + Fees & Discounts change lists were delivered off documented findings without a fresh live
    build check and the user rejected them — "checking in the build is part of the process, why did
    you skip that? … you should always ask me for every process if something needs to be live build
    checked … Remember that forever." Ties to Standing Rules 10/11/12/13/14/21 and
    build/PROCESS-AUTHORING-STANDARD.md.
23. **ALWAYS check the CURRENT Confluence spec — and ASK per process when unsure (all
    projects).** For the Spec-Recheck Change-List and almost every reconciliation/verification/
    authoring process, the CANONICAL current spec on Confluence is a source of truth to check
    against (not just the ingested `requirements.md`, which can lag). Therefore, at the start of
    any such process, if there is ANY doubt whether the local spec is current, **ASK the user
    whether to go through the Confluence spec** (each project's canonical page — e.g. Fees &
    Discounts pageId 622297094, Simple Flow pageId 646021121, Custom Roles pageId 565116952) —
    do NOT assume the local copy is up to date and do NOT silently skip the Confluence read.
    **When the Atlassian MCP is live, read Confluence directly via `getConfluencePage`** (this
    supersedes the older "Confluence is login-walled → user must export/paste" note, which applied
    only when no MCP was available); if the MCP is NOT available, ask the user to export/paste.
    Reconcile the cases + the change-list against the current spec (last-update-wins with the
    tickets, Rule 15 verbatim-truth-table). Rationale, 2026-07-23: the user requires "for this
    process and almost all processes you are supposed to check the specs from that confluence link
    as well; ask me for every process if I want you to go through that confluence specs or not when
    you are not sure." Ties to Standing Rules 10/11/12/13/15/21/22 and build/PROCESS-CATALOG.md.
24. **Front-end blocks + backend/API allows = a PASSED test case (all projects).** When a
    control/action is restricted in the UI (hidden/disabled by a front-end permission or FE
    gate) for a role BUT the same action still succeeds through the API (e.g. a direct `POST`
    returns 201/200 for a user who lacks the permission in the UI), the test case is a **PASS**
    — do NOT classify it as a bug/defect. **User ruling 2026-07-24 (anywhere, always): "if an
    action is blocked from the front-end and allowed from the backend/API, consider that a
    PASSED test case."** The front-end gate IS the tester-facing behaviour and is the pass
    criterion; the front-end-only enforcement (backend does not independently enforce) is
    ACCEPTED by product policy. Treat the UI behaviour as the tester-facing result (viu_status
    = Verified / PASS). **Tester-facing line required (going forward + retroactively where such
    cases exist):** Any test case where an action is blocked/hidden in the UI for a role but still
    succeeds via the back-end/API MUST carry a PLAIN, tester-facing note line so the manual tester
    knows it is expected and passes — worded simply (Rule 7), e.g.: "Note for the tester: this
    action is only hidden on the screen. If you find it can still be done another way (through the
    back-end/API), that is expected — mark this test PASSED and do not raise it as a bug." This
    applies to all projects and all future authoring; existing FE-block/BE-allow cases should get
    this line added when next touched. (User ruling 2026-07-24.) This SUPERSEDES the earlier
    "metadata-layer only" phrasing: the plain tester-facing line is now REQUIRED in the case; the
    technical detail (which exact API/endpoint) may still ALSO live in the QA/findings metadata
    layer. This matches the ShopView enforcement model (granular permissions are largely front-end
    display gates the backend does not independently enforce). **INVERSE IS NOT A PASS:** if the front-end EXPOSES/ALLOWS
    something it should NOT for a role while the backend blocks it (FE-exposure), that is an
    FE-exposure DEFECT, not covered by this ruling (e.g. SV-8515 / SF-PERM-11 — a View-only user
    reaches an editable Bulk-Receive screen the FE should hide, even though the BE `accept`→403
    blocks the actual write; keep it a Deviation). Rationale, 2026-07-23: FD-WO-013 (C28436)/
    FD-PERM-002 (C28586) — a Sales-Rep-role user (no Work Orders: Create & Edit in the UI) still
    added a whole-WO fee via the API (201); per this rule that is a PASS with the "doable via
    API" flag, not a bug. Ties to Standing Rules 12/13 and the Custom Roles enforcement-model
    finding (BE enforces resource View/Edit; granular perms are FE gates).
25. **Every DEVIATION call must cite the spec/ticket/story reference + the VERBATIM wording
    it deviates from (all projects).** Whenever I say something is a deviation (or a
    build-vs-case mismatch, or "the case expects X but the build does Y"), I MUST quote the
    exact source wording the case's expectation comes from — the spec section/requirement,
    the Jira ticket/story, and/or the design — with the reference AND the verbatim text, so
    the user can see the basis and judge it. If the expectation turns out NOT to be in the
    spec/ticket (e.g. it came from a design mock only, or was over-specified), SAY SO
    explicitly — that often means the build is actually spec-compliant and the case is not a
    bug. **THE CORRECT REPAIR IS TO REMOVE THE UNSUPPORTED ASSERTION, OR TO MAKE IT
    SCOPE-CONDITIONAL (Rule 42) — NEVER TO SUBSTITUTE WHAT THE BUILD DOES.** **"MATCHED TO THE
    BUILD" MEANS VIU'D AGAINST THE BUILD** — correct the **LABELS**, the screen/field names, the
    button text, the step order and the navigation path so a manual tester can actually follow
    the case (Rule 9). **It has NEVER meant rewriting what the case EXPECTS.** QA lead's
    clarification, 2026-08-05, verbatim: *"For the rule: 'the case should be matched to the
    build' That doesnt mean the expected behavior should match the build. That kills the purpose
    of the test case. I think when we said 'the case should be matched to the build' it meant
    that the test case should be VIU'd from the build"*. The reasoning in one line: **if the
    expected behaviour bends to whatever shipped, the case can no longer fail, and a test that
    cannot fail is not a test.** The source of expected behaviour is governed by **Standing Rule
    57**.
    **⇒ WIDENED 2026-08-12 (Standing Rule 9's amendment): "MATCHED TO THE BUILD" COVERS THE
    PRECONDITIONS AND THE WHOLE NAVIGATION ROUTE, NOT JUST THE LABELS AND STEP ORDER LISTED ABOVE —
    AND IT MEANS *VERIFIED AGAINST* THE BUILD, NOT *DERIVED FROM* IT.** QA lead, verbatim: *"steps of
    reproduction MUST be verified from the build to 100% ensure that when manual tester would run the
    test he will be able to run it."* **THE BUILD IS THE CHECK, NEVER THE AUTHOR:** steps come from
    **what the case exists to test**, the build **confirms they can be run**, and a step that cannot
    be executed as written is corrected to **the minimum that makes it executable**. **The sentence
    immediately above is UNCHANGED and is the reason the widening is safe: it has NEVER meant
    rewriting what the case EXPECTS** — *"YES the expected behavior should come from the sources
    rather than the build"* (same directive). **So the check confirms the ROUTE and stops dead at
    the ASSERTION**, and the repair for an unsupported assertion remains **removal or
    scope-conditional wording (Rule 42), never substitution.** The five-check runnability test is at
    the tail of Rule 9.
    Never assert a deviation from memory or a
    prose summary; pull the wording from the canonical spec/ticket (Rule 15 verbatim
    truth-table; Rule 23 read Confluence when unsure). Rationale, 2026-07-23: FD-STATS-002
    (C28460) "expected a per-row target + clickable link" — but the FD spec only says
    adjustments "appear on the Statistics tab" (§3) "oldest first" (§5-R9); the target/link
    was design-only, not in the spec, so the build was spec-compliant and the case was not a bug.
    **THE CORRECT REPAIR THERE WAS TO DELETE THE DESIGN-ONLY EXPECTATION — NOT to describe what
    the build renders instead.** The original wording of this rationale was ambiguous on exactly
    that point, and **that ambiguity is what cost us 2026-08-05** (see Rule 57). User: "whenever
    you discuss a deviation, give specs/tickets/stories reference
    with the wordings from which the test case is deviating." Ties to Standing Rules 12/15/20/23
    and 57 (the source of expected behaviour is the document, never the build), **and 9 (the
    2026-08-12 widening of what "matched to the build" covers)**.
26. **Reset roles to template/default BEFORE any permission/role verification on a shared/
    disposable environment (all projects).** Whenever verifying permission- or role-gated
    behavior — a permission/role VIU (e.g. role-matrix cases), a prod-vs-staging (or any
    two-env) permission comparison, or ANY test whose expected result depends on what a role
    can/can't do — FIRST reset every in-scope role to its TEMPLATE/DEFAULT (the app's 'Reset
    To Template' action) so the test runs against the CORRECT spec-default permissions, NOT
    drift/over-grants left by prior or parallel-session testing on the shared org. Method: for
    each role, (1) record the current (pre-reset) permission set, (2) reset to template, (3)
    record the post-reset set — the before→after diff is itself a finding (which roles were
    drifted/over- or under-granted); (4) verify each template-default against the canonical
    spec permission matrix and FLAG any role whose template differs from spec (never silently
    accept); (5) then observe live per role (Rule 10/12/13). Leave roles at template afterward
    (that corrected state is the canonical baseline, and it benefits every session sharing the
    org — see the two-session shared-env caution). This EXTENDS Standing Rules 5 (self-service
    data/roles), 12 (observed-not-inferred), 13 (live feature-by-feature), 14 (seed-don't-block),
    and 15 (verbatim spec truth-table). Rationale: 2026-07-23 — during the Simple Flow SV-8183
    permission VIU on shared staging org d55bc308, the Tech user (and likely other roles) were
    over-granted from prior testing; the user directed resetting each role to template first so
    the VIU verifies against correct permissions rather than drift.
    **26a — Re-reset on mid-test drift, persistently.** If a role RE-DRIFTS during the test (a
    concurrent session/actor re-adds permissions on the shared org), RESET it to template AGAIN
    and CONTINUE the testing — re-assert the template baseline every time drift is detected mid-run,
    then immediately re-observe. Do NOT abandon the observation to a "drift-blocked" partial while
    re-reset is still working, and do NOT cap the retries at a small number. Only record a genuine
    blocker if the reset itself fails, or drift recurs so fast that no observation can complete even
    with immediate re-reset+observe after sustained persistence — and then document it precisely
    (Rule 12, never infer a pass). Leave the role at template when done. Rationale: 2026-07-23 —
    during the SV-8183 Technician-role VIU a concurrent session kept re-drifting the shared
    Technician role mid-run.
27. **Reuse recorded action recipes; never re-discover from scratch (all projects).** Before
    performing ANY staging/QA/env action — create a WO, add a part to a work order, add a fee/
    discount, switch/impersonate a role, reset a role to template, change location/workplace, hit
    an endpoint, drive a UI flow, log into Jira/Confluence, push to TestRail — FIRST read
    build/APP-ACTIONS-PLAYBOOK.md "STAGING ACTION RECIPES" (the indexed quick-reference at the top)
    + CLAUDE.md "Durable key facts" and REUSE the recorded recipe. Do NOT re-derive endpoints, IDs,
    payloads, UI click-paths, or gotcha-fixes that you (or another session) already proved. The
    INSTANT you discover a NEW working recipe (a new endpoint, payload field, ID, UI path, or the
    concrete gotcha-fix that unblocked success), append it to build/APP-ACTIONS-PLAYBOOK.md
    immediately in the same session — success-proven knowledge ONLY (never failed attempts/dead-ends),
    per the "Keeping this current" append-only convention. This is the shared brain across the
    parallel sessions (there is no live message bus — the books ARE the channel, Rule 20), so a
    recipe recorded once must never be re-discovered. Rationale, 2026-07-27: the user flagged that
    re-discovering known actions (e.g. how to add a part to a work order) from scratch extends
    testing time — "you should have these things in your memory as mentioned to you before so that
    you can retrieve them from memory instead of finding your ways from scratch again and again."
    Ties to Standing Rules 5 (self-service data/roles), 6 (disposable env), 14 (self-seed playbook)
    and the "keep the books current" convention.
28. **Ruthless usefulness audit — a THREE-DIMENSION mandatory quality gate on all test-case
    authoring (all projects).** EVERY test-case authoring/update pass, for every project, ENDS
    with the Ruthless Usefulness Audit (build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md) BEFORE the
    suite is delivered/imported, scoring 100% of the cases (no sampling, Rule 17) on **THREE
    dimensions, together**: **(1) USEFUL** — exactly one verdict each: **KEEP** (distinct
    observable behavior, failure = real reportable bug, not covered elsewhere) / **MERGE**
    (over-granular; name the merge group + the one survivor) / **WEAK-KEEP** (legitimate but
    low-value, flagged) / **CUT** (spec-parroting, untestable/vague, duplicate [named], tests the
    framework not the feature, or PO-descoped) — hunting the named slop patterns (near-duplicates
    across areas; sort-direction/per-column explosions; per-column display filler; tooltip
    present-vs-text splits; empty-state triplets; permission cases reducing to one gate; export
    pairs duplicating a whole filter matrix) AND crediting the load-bearing coverage (calculation
    contracts, permission gating, link targets, persistence, export-reflects-filters).
    **(2) MAKES SENSE (coherence)** — read each case COLD, as the critic would, and score
    **SENSIBLE / FIX-WORDING / NONSENSE** against the 6 fail conditions: steps not executable in
    order or precondition unreachable; expected result doesn't follow from the steps; internal
    contradiction; references a control/screen/field in neither the spec nor the design/video
    sources; domain nonsense (impossible math, wrong calculation direction, cost/sell conflation,
    impossible snapshot logic); not actionable (a tester can't tell what to DO or what PASS looks
    like). Every NONSENSE quotes the offending text + fail condition; cross-check for
    KEEP-but-NONSENSE (the embarrassment check) explicitly. **Per Standing Rule 50 the audit scores
    100% of the cases and THE COLD READ IS NOT A SAMPLE — every case is cold-read on all three
    dimensions; a spot-check of N cases may NEVER be reported in language implying the whole suite,
    and the deliverable states the exact number read out of the exact population.** **Dimension 2 also includes a MANDATORY
    CROSS-CASE CONSISTENCY SWEEP (a suite can be 100% individually-sensible and still be
    self-contradictory):** group the cases by the control/behaviour they assert on and diff their
    expected results — plus an opposite-assertion keyword sweep (hidden vs shown/disabled, real-time
    vs on-Apply, editable vs locked…), a **TITLE-vs-EXPECTED check on every case**, and a
    same-`refs`-anchor diff; any pair that cannot both be true = **CONTRADICTION**, resolved by the
    Rule-33 precedence order (PO ruling → QA-lead ruling → our live-verified findings → reviewer
    claim) with the WHOLE group aligned to the winner, or flagged PENDING a PO question if no ruling
    exists — **a suite may not be delivered with an unresolved contradiction**, and the count found/
    resolved ships in the tally (rationale 2026-07-31: our audit rated 110 Filters cases SENSIBLE
    while they contradicted each other on the Status chip — a junior QA caught it cold; canonical
    example `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md`). **(3) GENUINE + LAYMAN-RUNNABLE** —
    every case traceable to its ticket + spec/video source (Rule 20 authenticity) AND executable
    by a NON-TECHNICAL manual QA tester easily (Rules 7/9 plain wording: build-accurate labels,
    no jargon, numbered steps a layman can follow); a case failing this dimension gets FIX-WORDING
    or CUT. **The stated purpose: no suite we deliver can ever substantiate the "AI makes useless
    test cases" claim — every delivered suite carries the three-dimension tally as proof.** The
    suite SHIPS WITH that tally (usefulness headline current → recommended + sense counts +
    contradictions found/resolved + genuine/layman confirmation) + an honest "is the critic right?" answer covering BOTH halves of
    the claim (waste % AND makes-no-sense %); the audit only RECOMMENDS — no merge/cut/delete/edit
    is executed in TestRail without explicit user authorization (Rule 6). Also runs on demand for
    any existing suite and as a sub-step of major spec reconciliations. Rationale, 2026-07-28:
    Stefan Mitrovic (engineering manager) claimed 2026-07-27 there is "serious AI slop" — of the
    500+ Report Suite cases "maybe only 200 test cases are useful, the rest of them can be a
    waste", AI makes "more than 70% useless test cases", and (second half of the claim) "some
    tests just do not make sense"; the user directed: "we have to be very careful to make sure
    that he does not prove us wrong and him as right when he says that AI is making more than 70%
    useless test cases", "Regarding: ruthless usefulness audit — Please keep this approach always
    for all the test cases you create and it should be the part of the process", "Regarding
    Ruthless Audit: Stefan believes that some tests just does not make sense. So our audit should
    keep in mind that part of his claim too", and (the three-part permanent bar, 2026-07-28):
    "usefulness + sense together — Make it a permanent rule so that his claims can never be proven
    right. Our test cases need to be genuine, can be run by the manual QA guys and laymen who are
    non technical very easily and the rest of the rules you already know." Canonical example:
    build/report-suite/quality-audit-2026-07-28/ (Report Suite, 515 cases — usefulness audit +
    SENSE-CHECK-2026-07-28.md supplement, per-case-verdicts.csv with both verdict sets). Ties to
    Standing Rules 6/7/8/9/16/17/20/21.
29. **No-work-loss checkpoint discipline is permanent (all projects + side projects).**
    USER DIRECTIVE (2026-07-29, permanent): "you have to make sure that if we hit the daily
    limit we do not loose anything and this should be a permanent rule for every project or
    side project you work on". Every task — on every project AND every side project —
    commits + pushes durable work to git after EVERY completed step/phase; NEVER hold more
    than one phase uncommitted. Long runs (VIU passes, sweeps, audits, multi-batch pushes)
    checkpoint-commit MID-RUN, not just at the end. Before any known limit/reset risk, do a
    state-save: write the cold-resume block — what's DONE, what's IN FLIGHT (with its exact
    re-run recipe), what's AWAITING WHOM — into that project's PROJECT-STATE.md and push it.
    Every in-flight TestRail/Jira write sequence MUST be resumable: take pre-write snapshots
    + keep per-operation logs so a killed run can be verified against the live state and
    completed from exactly where it stopped (proven on the 2026-07-29 wave-completion — the
    killed worker's per-op log let the resume verify live TestRail and finish only the
    missing writes). The container and `/tmp` are EPHEMERAL — git is the ONLY durable store;
    `/tmp` secrets (cookies/tokens/OTP) are the ONLY acceptable loss, re-supplied by the user
    on resume (never committed, Rule 6/secrets rule). Detailed method =
    **build/NO-WORK-LOSS-STRATEGY.md** (golden rule, checkpoint granularity, resume anchors,
    in-flight kill recovery, pre-limit checklist, post-reset resume steps). Rationale: proven
    across the 2026-07-28/29 daily-limit hits — because every step was committed+pushed and
    state-saved, ZERO work was lost across the resets. Ties to Standing Rules 6/17/20 and the
    two-session shared-brain convention (CLAUDE.md + PROJECT-STATE.md are the resume anchors).
    **⇒ STRENGTHENED 2026-08-11 INTO SEVEN CHECKABLE REQUIREMENTS — because the wording above was
    ALREADY IN FORCE on 2026-08-11 and was NOT ENOUGH. USER DIRECTIVE (2026-08-11, verbatim):**
    *"there are the chances that again we will lose all the work due to 5 hours limit issue, so we
    have to make sure that we have a permanent strategy or a rule that protects us from losing our
    work due to these limit issues."* **A six-worker kill that day cost almost nothing — but only
    because a sweeper worker happened to be committing other passes' output, and the recovery that
    followed first concluded everything was lost and had to withdraw it. That is luck, not
    architecture.** **THE SEVEN REQUIREMENTS, IN FULL, WITH THEIR EVIDENCE AND A COMPLIANCE
    CHECKLIST: `build/NO-WORK-LOSS-STRATEGY.md` (rewritten 2026-08-11).** In one line each:
    **R1 — the PER-OPERATION LOG IS WRITTEN BEFORE OR AS EACH WRITE AND IS COMMITTED** (an oplog
    written at the end is worthless to a run that dies in the middle; the test is *"if this worker
    is killed right now, can the next one find its exact position from git ALONE?"*) · **R2 — a HARD
    CHECKPOINT INTERVAL: commit AND push every 25 write operations or every 10 minutes of wall
    clock, whichever comes first** ("regularly" is what the 40-minute silent stretch was already
    doing) · **R3 — `git fetch` + `git merge --ff-only` AT THE START OF EVERY PASS**, never trusting
    the local tracking ref or a clean tree as evidence of currency (a checkout read *clean* and *1
    ahead* while 110 commits behind, and a recovery pass then reported six passes' work lost —
    falsely) · **R4 — VERIFICATION EVIDENCE IS COMMITTED TO THE REPOSITORY, NEVER LEFT IN `/tmp`**
    (`/tmp` is for secrets only; a Rule-50 byte-comparison whose output is not committed did not
    happen, evidentially — this is the ONLY thing actually lost on 2026-08-11) · **R5 — RESUME BY
    RE-ESTABLISHING POSITION FROM LIVE, BY CONTENT, never from the pass's own memory: a fresh
    `updated_on` is NOT proof of your write, TestRail re-renders text without moving it at all, an
    HTTP 500 can come back from a write that SUCCEEDED (read the case, never blind-retry), and a
    liveness check is not evidence of progress — check the work product, and never `pgrep -f` a
    pattern that appears in the watching shell's own command line** · **R6 — THE PRE-KILL STATE-SAVE**
    (DONE · IN FLIGHT with its exact re-run recipe · AWAITING WHOM), **naming explicitly where a
    staged exact-string plan must be REBUILT rather than REPLAYED** — a sibling pass may have moved
    the anchors it matches on · **R7 — PATH-SCOPED COMMITS** (`git add <explicit paths>`,
    `git commit -m "…" -- <paths>`, `git show --stat`, push the explicit SHA, never force) — a bare
    commit has swept a sibling's staged work three times now. **Independent proof that nothing was
    lost, and of the one thing that was: `build/loss-audit-2026-08-11/VERDICT.md`.**
    **⇒ R7 AMENDED 2026-09-03 — `git add -- <paths>` IS NOT SUFFICIENT. THE PATHSPEC MUST BE ON THE
    `git commit` ITSELF.** R7 has said *"`git add <explicit paths>`, `git commit -m "…" -- <paths>`"*
    since 2026-08-11, and the count in its last line — *"three times now"* — **reached five on
    2026-09-03, twice in that single day.** The two 2026-09-03 incidents are what this amendment
    exists for, because in both of them the worker **did** scope its `git add` and was swept anyway:
    a commit took **five** files (another worker's handoff and skill edits), and a second took
    **seven** (`CLAUDE.md`, rule files, skills, `build/handoffs/README.md`,
    `build/PROCESS-AUTHORING-STANDARD.md`). **THE MECHANISM, WHICH IS THE WHOLE POINT: several
    workers share ONE checkout and therefore ONE git index. Between your `git add` and your
    `git commit`, a sibling worker's `git add` mutates that index — so a bare `git commit -m "…"`
    commits THEIR staged paths along with yours. Scoping only the `add` protects nothing, because
    the damage happens after it.** `git commit -m "…" -- <paths>` takes the pathspec directly and
    commits **exactly** those paths regardless of what the index holds; it is immune to the race.
    **THEREFORE, THREE REQUIREMENTS, ALL THREE EVERY TIME:**
    **(a) COMMIT WITH AN EXPLICIT PATHSPEC — `git commit -m "…" -- <paths>`.** Never a bare
    `git commit`, never `git add -A` / `git add .` / `git commit -a`. Scoping the `add` as well is
    good hygiene, but it is not the guard and must never be mistaken for it.
    **(b) VERIFY THE COUNT BEFORE YOU PUSH — read the `N files changed` line git prints and compare
    it to the number of files you actually changed. If N EXCEEDS your count, STOP AND FIX IT BEFORE
    PUSHING.** That one line is what caught the second incident (`11 files changed` against an
    expected 4). `git show --stat` gives the same answer after the fact. **A commit whose file count
    was never read is a commit whose contents were never checked.**
    **(c) THE SAFE RECOVERY, IF YOU HAVE NOT PUSHED — and ONLY if you have not pushed:**
    `git reset --soft HEAD~1` (soft: the work stays in the tree and nothing is lost) · **back up
    every affected file first**, including the foreign ones · `git restore --staged -- <the foreign
    paths>` to unstage what is not yours · re-commit with an explicit pathspec · then **BYTE-COMPARE
    the foreign files against the backup (`diff`/`sha256sum`) and record that they are identical** —
    the proof that the sibling's work survived is the comparison, not the intention (R4: evidence not
    committed did not happen). That is exactly how the second incident was closed the same day: reset
    locally, backed up, byte-compared identical, re-committed with a pathspec, nothing lost.
    **🛑 NEVER REWRITE PUSHED HISTORY.** Once it is on the remote, another worker may already have
    fetched it; `git reset`/`--force` is then not a repair, it is a second, larger incident. A
    foreign file already pushed inside your commit is REPORTED to the coordinator and left alone.
    Operational form of this amendment: `build/APP-ACTIONS-PLAYBOOK.md` §L.
30. **Tech plan is a standard project input — remind the user if missing (all projects).**
    USER DIRECTIVE (2026-07-29, verbatim): "Also, going forward if I miss to provide you the
    tech plan for the project, please remind me of that. Save it as a rule". Every project's
    STANDARD INPUT SET includes the ENGINEERING TECH PLAN alongside the spec, designs, and
    epic/tickets. If the tech plan has not been provided at project start — or at the latest
    by the time authoring or a VIU pass begins — REMIND the user to supply it (do not
    silently proceed without asking). Tech plans STRENGTHEN test cases: they reveal edge
    cases, API contracts, and states/state machines the spec glosses over. But engineering
    intent NEVER overrules product truth from the spec/PO — where a tech plan conflicts with
    the spec/PO position, the conflict becomes a PO/dev QUESTION (Rules 7/11/15), never a
    silent case change.
    **✅ THE TENSION NAMED 2026-08-06 IS RESOLVED — ANSWERED BY THE QA LEAD ON 2026-08-12, AND THIS
    RULE'S SUBORDINATION CLAUSE IS VINDICATED RATHER THAN OVERTURNED.**
    **USER DIRECTIVE (2026-08-12, verbatim):** *"Technical design is the authority but if that contradicts
    with specs/tickets/answer sheet/claude design/figma (because they are also the authority with the rule
    that the latest entry for that question wins) I would suggest to consider the specs/tickets/answer
    sheet/claude design/figma (with the rule that the latest entry for that question wins) as the authority
    for the test cases but let me know where it contradicts with the tech design."*
    **SO, IN THIS RULE'S OWN TERMS:** the technical design **IS** an authoritative source (Rule 57 (d3)) —
    *"Technical design is the authority"* — **AND the clause above stands exactly as written: where it
    CONTRADICTS the spec, a ticket, an answer sheet, a Claude design or Figma, THOSE win for the test
    cases**, with latest-wins applying among them (Rule 32). **The clause was OUR reading until this date;
    it is now HIS RULING, and may be cited as such.**
    **⚠️ ONE THING CHANGED, AND IT IS THE PART THAT IS EASY TO DROP: a contradiction is no longer merely
    "a PO/dev QUESTION" — HE HAS ASKED TO BE TOLD ABOUT EVERY ONE.** His closing clause is an instruction:
    *"but let me know where it contradicts with the tech design."* **Following the precedence order
    silently is NOT compliance.** Each contradiction is **reported to him** and logged in the
    OUTSTANDING-ITEMS REGISTER (Rule 36).
    **AND THE OTHER HALF, WHICH THIS RULE'S WORDING ALONE WOULD HIDE: WHERE NOTHING CONTRADICTS THE
    TECHNICAL DESIGN, IT SOURCES A CASE ON ITS OWN.** *"Informs but never overrules"* is a rule about
    **conflict**, not a rule about **weight in isolation** — a case resting on the technical design while
    every other document is **silent** is properly sourced and is **not** a Rule-64 deletion candidate.
    **Eleven cases were held on the old open question and are released by this** (Rule 57's follow-up (ii);
    list at `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md` §3).
    **⚠️ THE SUPERSEDED WORDING, PRESERVED AND DATED — from 2026-08-06 until this ruling this block read:**
    *"⚠️ A TENSION WAS NAMED 2026-08-06 AND IS NOT YET RESOLVED — SEE RULE 57's FOLLOW-UP RULING (ii). His
    ruling that day, verbatim — 'Design is Claude design/Figma Design/ also I do share with you the
    Technical design as well.' — puts the TECHNICAL DESIGN among the authoritative design artefacts of Rule
    57(d), while THIS RULE'S SUBORDINATION CLAUSE ABOVE IS PRESERVED UNCHANGED AND DELIBERATELY:
    engineering intent never overrules product truth. Our reading is that a technical design does NOT
    overrule the PRD or a PO answer on product behaviour — that reading is OURS, pending his confirmation,
    and it is NOT his position. THE QUESTION IS OUTSTANDING: does a technical design carry PRD-level
    authority on what the product SHOULD DO, or does 'informs but never overrules' still hold for it? Do
    not answer it for him; until he does, a case that would turn on the difference is HELD."*
    Canonical example: the 2026-07-29 tech-plan reconciliations —
    build/filters/tech-plan-2026-07-29/, build/report-suite/tech-plan-2026-07-29/,
    build/schedule/tech-plan-2026-07-29/. Ties to Standing Rules 1 (complete inputs before
    work), 11 (ask which process on new inputs), 17 (complete data in/out), **32 (latest-wins applies
    among the sources that outrank the technical design on a contradiction)**, **33 (whose precedence
    order now carries this ruling explicitly)**, **36 (every contradiction found is an OUTSTANDING item —
    he asked to be told)**, **57 (which lists the technical design at (d3) and records the 2026-08-12
    ruling in full at its follow-up (ii))**, **64 (a case sourced by the technical design ALONE is
    sourced, and is not a deletion candidate)**, and the
    new-project onboarding convention (tech plan is part of the required input set).
    **✅ DATED NOTE, 2026-08-17 (QA lead point 13) — REMINDER ANSWERED, STOP RE-ASKING: there is NO
    engineering tech plan for the NEW (Fabian app-wide-filter-redesign) scope on any project.** The QA
    lead confirmed we use the **existing tech plans we already hold** — for Filters that is
    `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` (2026-07-30 sync), plus the
    eng handover cited in refs; Schedule and Report Suite likewise use their `tech-plan-2026-07-29/`
    docs. So the Rule-30 "remind the user if the tech plan is missing" duty is **SATISFIED for the
    Fabian scope** — do not re-raise it as an outstanding item for these projects. Where the existing
    tech plan and the newer v21 spec/design differ, the newer authoritative product source still wins
    (this rule's subordination clause; Rule 32), and the per-view filter list stays PENDING from
    engineering (spec S1-R8 / S13-R23).
31. **Establish the CURRENCY OF EVERY SOURCE before doing ANYTHING on a project (all projects).**
    *(Originally "always pull the latest spec"; **STRENGTHENED 2026-07-31** to cover EVERY source;
    **SCOPE BROADENED 2026-07-31** from test-case work to ANY project task — the rule number is kept
    so existing cross-references stay valid.)*
    USER DIRECTIVE (2026-07-31, verbatim — the third and BROADEST statement of the same
    requirement): **"Going forward the first thing you do whenever you are about to do anything for
    your projects is to get the updated version of all the sources you have for that project and
    ONLY then do what you are asked to do."**
    Earlier directive (2026-07-31, verbatim): **"I want the test cases to be current with specs and
    epics and you must have the current version of epics and specs and every other doc you are
    using alwyas first make sure that you have the current source for the test cases before doing
    anything with the test cases."** Earlier directive (2026-07-31, verbatim): "everytime you are
    making the test cases or looking at the test cases for any reason make a rule that you pull the
    latest version of Specs from the URL, I see that the specs have been updated on 28th. But I
    believe you are unaware of that and due to that you left a few tests uncovered."
    **THE PRE-FLIGHT (MANDATORY — BEFORE DOING ANYTHING ON A PROJECT; the FIRST action of any
    project task, without exception) — establish and record the currency of ALL FIVE source types.**
    This covers **not only test-case work** (authoring / editing / auditing / reconciling /
    reviewing cases) but ALSO: **writing or revising PO/dev question sheets; status reports and
    management deliverables; audits; coverage analyses; TestRail pushes and run syncs; spec/epic
    reconciliations; bug investigations; and answering the user's questions about a project's
    state.** The sequence is FIXED: **(1) refresh every source → (2) diff against our baseline →
    (3) fold in any deltas → (4) only then do the thing that was asked.**
    **If a task looks trivial or read-only, the currency check is STILL first** — a stale answer
    about a project's state is as damaging as a stale test case (we once told the user a suite was
    current while its spec was 8 versions ahead).
    **(1) THE SPEC** — fetch it LIVE from its canonical URL (Confluence via the Atlassian MCP
    `getConfluencePage` when available, else the REST API with session cookies); compare the **live
    version number + last-updated date** against our ingested `requirements.md` baseline.
    **(2) THE EPIC AND ITS CHILD STORIES** — fetch the epic LIVE and compare the **story set +
    each story's status + description/comment changes** against our ingest; a **reopened** story or
    a **newly-Done** story CHANGES what must be tested, so this is never optional.
    **(3) THE DESIGNS** — the Figma file + node set (and any prototype/Claude design in play); **if
    a design-fetch queue is OPEN per Rule 35, the design source is NOT current and that must be
    STATED in the deliverable**, naming the shortfall. **⚠️ THIS SOURCE CARRIES MORE WEIGHT FROM
    2026-08-06: the design and Figma are now AUTHORITATIVE SOURCES OF EXPECTED BEHAVIOUR (Rule 57, as
    amended), so a STALE OR UNDATED design baseline is a source-currency gap of the same seriousness
    as a stale spec — record it as PARTIAL with the exact shortfall, never wave it through.**
    **⚠️ "THE DESIGN" MEANS THREE ARTEFACT TYPES (his ruling 2026-08-06 — Rule 57 follow-up (ii)): a
    CLAUDE DESIGN (including a Claude prototype export or share page) · a FIGMA DESIGN · the TECHNICAL
    DESIGN he shares.** Check the currency of **each one that is in play**, not only Figma.
    **⚠️ AN UNDATED ARTEFACT CANNOT BE DATED FOR RECENCY PURPOSES, SO RULE 32's LATEST-WINS CANNOT BE
    APPLIED TO IT AT ALL** — an editable share page with no version and no date is recorded **PARTIAL**
    and **ESCALATED** (Rule 57 follow-up (i)); it is never treated as the newest source merely because it
    arrived most recently in a conversation.
    **(4) THE ENGINEERING TECH PLAN** (Rule 30) — confirm we hold the current version; if it was
    never supplied, remind the user.
    **(5) THE PO / STAKEHOLDER ANSWERS, MESSAGES AND VIDEOS** — the **newest authoritative product
    source wins** (Rule 32); a later PO answer can reverse an earlier ruling our cases still assert.
    If the live spec/epic/design/plan/answer is NEWER than our baseline, run the **diff FIRST** and
    fold the deltas in BEFORE doing the requested work (Rule 11 — ask which process).
    **EVERY DELIVERABLE MUST CARRY A "SOURCE-CURRENCY" BLOCK** stating, **per source**: the
    **identifier** (Confluence page id / epic key / Figma file + node ids / doc name), the
    **version-or-last-updated value**, the **date we checked it**, and a verdict of
    **CURRENT / STALE / PARTIAL** — e.g. *"designs PARTIAL — 12 of 85 frames pending, Rule-35 queue
    open"*. **No deliverable may claim completeness while ANY source is STALE**, and a **PARTIAL**
    source must name the **exact shortfall** (which frames/stories/sections are missing).
    **⚠️ STALENESS MARKERS ARE UNRELIABLE — VERIFY THE RIGHT ONE (three proven traps):**
    **(a)** a Confluence page's **BODY "Version" field can sit at 1.0 forever** while the real
    Confluence page version advances — this is exactly how the **Schedule spec drifted 5 versions**
    unnoticed; **use the CONFLUENCE VERSION NUMBER, not the version written inside the document.**
    **(b)** a Jira epic's **"updated" timestamp moves for purely ADMINISTRATIVE edits** such as a
    QA-Assignee change — on **2026-07-31 two epics looked changed when their content was identical**;
    **use the JIRA CHANGELOG (what actually changed), not the surface updated-date.**
    **(c) ⚠️ A PAGE VERSION BEING NEW SAYS NOTHING ABOUT WHETHER A GIVEN RULE INSIDE IT IS NEW —
    established 2026-08-06, and it is the MIRROR IMAGE of trap (a): there, the printed version lies
    while the page version is honest; here, the page version is honest AND STILL TELLS YOU NOTHING
    about the age of the requirement you are reading.** A spec page republished yesterday can carry a
    requirement untouched for five months. **TO DATE A REQUIREMENT YOU MUST DIFF THAT REQUIREMENT'S
    OWN TEXT ACROSS VERSIONS — never read the page's version number or its last-updated date as the
    rule's date.** **THE METHOD, and it is CHEAP:** fetch the anchor's text from each page version and
    find the version at which it **actually changed** (Confluence serves any historical version, so
    this is one extra call per version per requirement — it settled the incident below in about two
    minutes). **WHY IT MATTERS: this is the exact input to Rule 32's latest-wins test**, so getting
    the rule's date wrong applies Rule 32 **BACKWARDS** — an older requirement is used to overrule a
    newer decision, while the case looks freshly reviewed and carries a confident explanation of
    itself (Rule 57's hardest-to-spot failure). **INCIDENT (2026-08-06, Filters):** our 5 August pass
    flipped **FLT-TAB-02 = [C29609](https://shopview.testrail.io/index.php?/cases/view/29609)** and
    **FLT-TAB-03 = [C29610](https://shopview.testrail.io/index.php?/cases/view/29610)** off Branko's
    **17 July** Q4=B ruling and onto the spec's wording, reasoning verbatim *"The specification is the
    newer authoritative source (Standing Rule 32), so the cases follow it"* — a comparison of the
    **PAGE's** publication date (v18, 4 August) against the answer's date. The rule was then fetched
    from **ten spec versions (4, 5, 6, 7, 9, 12, 14, 17, 18, 19)** and **`S9-R2`/`S9-R3` are
    BYTE-IDENTICAL in all ten, unchanged since version 4, 2026-05-14** — two and a half months
    **BEFORE** the answer. The spec text was **OLDER, not newer**, so latest-wins pointed the other
    way. **AND THE SAME PASS SILENTLY REVERSED THE QA LEAD'S OWN 30 JULY RULING WITHOUT CITING IT** —
    the deleted `refs` read *"behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = shown
    greyed-out/disabled"*. **That is the second half of the defect and Rule 33 forbids it outright**
    (see Rule 33; a ruling is a source and gets cited, Rule 48). Evidence:
    `build/filters/vlad-gap-review-2026-08-06/ROOT-CAUSE.md` + `ROW-BY-ROW.md` row 1.
    **If a source cannot be fetched, STOP and ASK THE USER for access** — never proceed on a
    possibly-stale copy, never fabricate content to appear complete (Rule 12).
    **RATIONALE (both incidents are the evidence):** the **Filters** spec was **8 versions behind**
    (we held **V1.0**, live was **v1.6**) and a QA reviewer (Ahtesham) found requirements with **NO
    coverage** as a direct result; the **Schedule** spec was **5 versions behind** (we held **v18**,
    live was **v23**) and a **PO answer had reversed an earlier ruling our cases still asserted**.
    This **STRENGTHENS Standing Rule 23** from "ask if unsure" to **"ALWAYS verify currency, for
    every source"**. Ties to Standing Rules 1 (complete inputs), 11 (ask which process), 12
    (observed, never inferred/fabricated), 17 (complete data in/out), 23 (check the Confluence
    spec), 30 (tech plan is a standard input), 32 (latest information wins), 33 (authority
    precedence), 35 (design-fetch queues).
    **⇒ DATED ADDITION, 2026-08-17 (QA lead, approved with "Add") — "CURRENT" IS A PROPERTY OF THE
    WHOLE CASE, NOT JUST ITS REFERENCES.** Verbatim clarification: *"Not just the references should be
    correct the test cases should be current too."* Establishing source currency (this rule) is only
    the first half. **Once a source has moved, making the affected cases current means re-verifying the
    ENTIRE case against it** — expected behaviour, on-screen labels, steps, preconditions **AND** the
    references — **not merely re-pinning `refs` or bumping the version.** A reference-only update is
    **NOT** "making the case current" and must never be reported as such. Full text at Standing Rule
    41's dated addition of the same date. Ties to Standing Rules 11 (ask which process on updated
    sources), 41 (touch a case → re-verify the WHOLE case), 43 (per-requirement re-derivation), 54
    (re-stamp the provenance line in the same pass) and 57 (expectation from the current documents).
32. **Latest information wins across ALL sources (all projects).** USER DIRECTIVE (2026-07-31,
    verbatim): "Rule of trusting something if it is duplicated or if figma says one thing and
    claud design says the other thing. Trust the latest information." When two sources disagree —
    spec vs Figma design vs a prototype/Claude-generated design vs a walkthrough video vs a PO
    message vs an engineering tech plan — **the MOST RECENT authoritative PRODUCT source wins**,
    and the case **records which source + date it follows**. Corollaries: **(i) DUPLICATION RAISES
    CONFIDENCE** — where the same thing appears in two sources and they AGREE, treat it as
    CONFIRMED; **(ii) engineering docs INFORM but NEVER OVERRULE product truth** from the spec/PO
    (Rule 30); **(iii) if the newest source is AMBIGUOUS or its recency cannot be established, ASK
    THE PO rather than pick a side** (Rules 7/11/15 — never silently choose); **(iv) ALWAYS state
    the source + date in the case metadata** so the next pass can re-evaluate.
    **⚠️ ESTABLISH THE RULE'S OWN DATE, NOT ITS PAGE'S DATE — SEE RULE 31 TRAP (c), added 2026-08-06.**
    A spec page republished yesterday can carry a requirement untouched for five months, so **"the spec
    is newer than the answer" is NOT established by the page's version or last-updated date** — it is
    established by **diffing that requirement's own text across versions.** Get this wrong and
    latest-wins is applied **BACKWARDS**: on 2026-08-06 two Filters cases (C29609/C29610) had been
    flipped off a PO ruling onto spec text that turned out to be **two and a half months OLDER** than
    the ruling. Proven precedent:
    the **Simple Flow "last-update-wins" contradiction rule** (spec `_3`/design `_4` overrode the
    earlier V2.4 doc + round-1 answer sheet) — this rule generalizes it to EVERY project and EVERY
    source type. Ties to Standing Rules 7/11/15/20/23/25/30/31 (**especially trap (c)**)/33.
    **⚠️ A PRD-vs-DESIGN MISMATCH IS RAISED FIRST, NOT SILENTLY RESOLVED BY THIS RULE (added
    2026-08-06, per Rule 57 as amended — the design and Figma are now authoritative sources too).**
    Latest-wins **still applies to what a case must ASSERT in the meantime**, but the disagreement
    itself is a **defect in the documents** and goes to the PO as a question (Rules 7/55) + the
    outstanding register (Rule 36); the case follows the most recent authoritative source **and
    DISCLOSES the divergence in its text (Rule 56)**. **No new tiebreak exists** — where recency
    cannot be established, corollary (iii) above governs: **ASK the PO.**
    **⚠️ CORROLLARY (iii) GAINED AN EXPLICIT SECOND LIMB 2026-08-06 — "OR IT DOES NOT MAKE SENSE".**
    Asked which wins when the design and Figma disagree with each other, the QA lead ruled, verbatim:
    *"the latest wins or if latest does not make sense we can create a question sheet for the PO to
    respond."* So **this rule applies to DESIGN ARTEFACTS TOO — the most recent artefact wins** — **and
    the most recent artefact is NOT followed where it DOES NOT MAKE SENSE, even if it is perfectly clear
    and perfectly dated**, which is **broader than ambiguity alone**. *"Does not make sense"* is a
    judgement **he has authorised us to make**; the **only permitted response is a QUESTION SHEET**
    (Rules 7/55) + the outstanding register (Rule 36) — **never a choice of ours**, and never the build
    (Rules 57/58). **CRUX: latest-wins needs a DATE, and an undated editable share link has none**, so
    its recency cannot be established at all and it goes straight to the escalation limb — the live case
    being Sasha Grosman's Schedule design link on SV-8915/SV-8916/SV-8917. Full text: **Rule 57's
    FOLLOW-UP RULING (i), 2026-08-06.**
    **⏳ DATED NOTE, 2026-08-17 (QA lead point 12) — RESTATED, verbatim: *"Consider the newest as the
    authority."*** This is this rule unchanged (newest authoritative source wins); recorded here so a
    future session sees it was reaffirmed on the Fabian-review reconciliation. **⚠️ He added: *"The date
    is 26-8-05 I have attached the screenshot as well."* — but the 2026-08-05 screenshot was NOT in the
    uploads** (checked 2026-08-17: `/root/.claude/uploads/dd1d42ba-…/` held only the design ZIP + the
    Branko tech-plan xlsx; no 08-05 image, and none inside the ZIP — its newest dated shots are 08-11 /
    08-13 / 08-14). **So we do NOT yet know which source/case that "newest authority" governs.** It is an
    **OUTSTANDING** item (Rule 36): ask the QA lead to re-attach the 2026-08-05 screenshot; until it
    lands, do not guess what it overrides. Evidence: `build/filters/design-2026-08-17/SCREENSHOT-FINDINGS.md`.
33. **Review findings are INPUTS, not overrides — apply the authority precedence order (all
    projects).** USER DIRECTIVE (2026-07-31, verbatim): "Hold Ahtesham as the Junior most QA
    person, I do not want his findings to over rule me and your findings here. But we need to know
    if he is right at some point so that we can take advantage of his findings." **PRECEDENCE ORDER
    for resolving any disagreement about what a test case should say:** (a) the **PO's product
    ruling** (per project: **Branko** = Filters / Schedule / Global Search; **Chris Ward** = Report
    Suite / Fees & Discounts; **Milos** = Simple Flow) → (b) the **QA lead's (the user's) ruling** →
    (c) **our own live-observed, evidence-backed findings** (Rule 12) → (d) a **reviewer's / other
    QA's spec-reading claims** (e.g. Ahtesham, the most junior QA). Within the same tier, the most
    recent authoritative product source wins (Rule 32). **A reviewer's report is an INPUT to be
    EVALUATED CLAIM-BY-CLAIM on the evidence** — never an authority that reverses a PO or QA-lead
    ruling, and never dismissed either: **judge the claim, not the claimant.** **Where a review
    claim is CORRECT, ADOPT it and say so plainly** — that is the value of the review (e.g.
    2026-07-31: a junior QA's run review correctly exposed a real internal inconsistency in our own
    Filters run, and correctly flagged coverage that a stale-spec baseline had cost us). **Where a
    review claim CONTRADICTS an existing ruling, the RULING STANDS:** align the cases to the ruling,
    and note the reviewer's observation as the trigger that surfaced the inconsistency; escalate to
    the PO only if the underlying product question is genuinely open. **Never let a review claim
    silently reverse a recorded ruling** — every adoption/rejection is logged with its evidence
    (Rules 20/25). **⚠️ AND IT IS NOT ONLY REVIEWERS WHO CAN REVERSE A RULING — WE DID IT OURSELVES,
    2026-08-06 (Filters):** our own 5 August pass reversed **the QA lead's recorded 30 July ruling**
    on the Status chip **WITHOUT CITING IT AT ALL**, deleting the very `refs` entry that named it
    (*"behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled"*)
    — reversing both the PO's ruling and the QA lead's on a mis-dated reading of which source was newer
    (**Rule 31 trap (c)**). **Naming the mis-dating is only half the defect; the other half is that a
    recorded ruling was overturned in silence**, which this rule forbids outright — a ruling is a source
    and gets cited (Rule 48). **THE CHECK THAT CATCHES IT: before overriding any case, read what the
    case's OWN `refs` credits — if a ruling is named there, it may not be dropped without citing it and
    saying why.** Canonical examples:
    `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md` and
    `build/filters/vlad-gap-review-2026-08-06/ROW-BY-ROW.md` row 1. Ties to Standing Rules
    7/11/12/15/20/25/31/32/48/57.
    **⚠️ THIS ORDER RANKS WHO RULES, NOT WHICH DOCUMENT — AND FROM 2026-08-06 THE PRD, THE DESIGN AND
    FIGMA ARE ALL AUTHORITATIVE (Rule 57, as amended).** Two of the PO's OWN sources contradicting each
    other therefore sits at **tier (a) against itself**, and this rule does **not** break that tie: it
    is **RAISED to the PO as a question** (Rules 7/55/57) and logged (Rule 36), while the case follows
    the most recent authoritative source (Rule 32) and **discloses the divergence (Rule 56)**.
    **⚠️ ONE DOCUMENT-vs-DOCUMENT TIE *IS* NOW SETTLED, AND IT IS SETTLED HERE RATHER THAN LEFT TO THE PO
    (added 2026-08-12).** **THE TECHNICAL DESIGN AGAINST THE SPEC, A TICKET, AN ANSWER SHEET, A CLAUDE
    DESIGN OR FIGMA: THOSE FIVE WIN FOR THE TEST CASES**, with **latest-wins applying among THEM** (Rule
    32). **USER DIRECTIVE (2026-08-12, verbatim):** *"Technical design is the authority but if that
    contradicts with specs/tickets/answer sheet/claude design/figma (because they are also the authority
    with the rule that the latest entry for that question wins) I would suggest to consider the
    specs/tickets/answer sheet/claude design/figma (with the rule that the latest entry for that question
    wins) as the authority for the test cases but let me know where it contradicts with the tech design."*
    **THIS IS A QA-LEAD RULING AT TIER (b), so it OUTRANKS any reviewer or engineering claim to the
    contrary** — and it is **narrow**: it decides only the technical design's standing **on a
    contradiction**. **Where the technical design is the ONLY source and nothing contradicts it, it
    SOURCES the case on its own** (Rule 57 (d3); Rule 64 — such a case is **not** a deletion candidate).
    **AND THE RULING CARRIES A REPORTING DUTY THAT IS NOT OPTIONAL: *"let me know where it contradicts
    with the tech design."*** Applying the order **silently** satisfies half the ruling and breaches the
    other half — every contradiction is **named to him** and logged (Rule 36). Full text at **Rule 57's
    follow-up (ii)**; the resolved tension is recorded at **Rule 30**; the live list is
    `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md`.
34. **Keep test runs in sync with the cases (all projects) — new/updated cases must appear in
    the existing run.** USER DIRECTIVE (2026-07-31, verbatim): "when we update or add test cases
    for any projects and we have a test run for them, make sure that those test cases also appear
    in the test run." **THE GOTCHA THAT CAUSES THIS:** a TestRail run does **NOT** auto-include
    newly added cases **unless the run was created with `include_all: true`**. A run built from a
    FIXED CASE SELECTION (`include_all: false` — which is how every per-project VIU run in this
    workspace was built) stays **FROZEN** at the selection it was created with. Therefore **every
    authorized `add_case` pass MUST be followed by a run-sync check** — it is the LAST STEP of
    every push manifest/execution log, not an afterthought. **METHOD:** (1) `get_run/{id}` → if
    `include_all` is **true**, new cases appear automatically — nothing to do, just VERIFY the test
    count equals the live case count. (2) If `include_all` is **false**: `get_tests/{run_id}` to
    derive the run's **CURRENT** case_id list, **UNION** it with the new case ids
    (`sorted(set(current) | set(new))`), then `update_run` with the **FULL UNION**.
    **⚠️ NEVER SEND A PARTIAL `case_ids` LIST — `update_run` REPLACES the selection, so a partial
    list DELETES the omitted tests AND THEIR RECORDED RESULTS.** This is the single most dangerous
    operation in the sync: **always union, and always snapshot the run's tests + results
    (`get_tests` + `get_results_for_run`) BEFORE writing**, then re-verify after (test count ==
    expected, every prior result still present). **The before/after check follows Standing Rule 50 —
    EXHAUSTIVE then EXACT: EVERY prior result verified present BY ID (no sampling), never by count
    alone, and the case_id sets proven equal in BOTH directions.** **Deleted/retired cases drop out of runs
    automatically** — so the sync is add-only; still **record the run's test count before→after in
    the audit log** (proven 2026-07-28: R359 went 515→458 when the consolidated cases were
    deleted). **Runs owned by other testers** (R359 = Nebojsa/Viktoria Report Suite; run 357 =
    Ayesha/Schedule; run 352 = Ahtesham/Filters; run 325 = Ayesha/Simple Flow; run 324 =
    Ahtasham/Fees & Discounts; run 278 = Custom Roles; note the old "run 312" no longer exists)
    **still require the user's EXPLICIT AUTHORIZATION before any run write (Rule 6 stands)** — and
    the case-sync must **never touch existing RESULTS**. Where a run belongs to a COMPLETED project
    or already holds graded results, ASK the user whether to sync it at all or to create a new run
    for the unrun cases (a "finished" run becoming incomplete is a reporting decision, not a QA one).
    **Rationale, 2026-07-31:** a junior QA's review of Filters run 352 reported "no case exists" for
    requirements we HAD already authored and pushed — the cases simply were not in his run.
    Out-of-sync runs cause **false coverage gaps and wasted review cycles**. Canonical audit +
    reusable read-only checker + union executor:
    `build/testrail-run-sync-2026-07-31/` (`RUN-SYNC-AUDIT.md`, `run_sync_audit.py`,
    `sync_runs_EXECUTOR.py`). Ties to Standing Rules 6/8/17/20/29/31/33.
    **SCOPE (see Rule 47, 2026-07-31): this sync duty applies to the THREE ACTIVE projects' runs
    ONLY — Filters 352 · Schedule 357 · Reports Suite 359; all other runs (other/completed projects,
    and run 278) are OUT OF SCOPE and are not synced, written to, or audited for missing cases.**
35. **Never leave design frames unfetched — auto-retry rate-limited Figma fetches until 100%
    complete (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"Do not forget to fetch
    the frames from Figma which you could not because of the limit reached issue. You do not need
    my authorization for that, for every figma frams which were/are left due to the rate limit
    auto set the timer to fetch them after 9 hours of the rate limit error time and date, set it
    as a rule permanently. And keep on repeating the same unless you fetch ALL the frames
    needed."* **THE RULE:** when a Figma (or ANY design-source) fetch is blocked by a rate limit
    — `HTTP 429 {"err":"Rate limit exceeded"}` on `GET /v1/images/{file_key}` is the usual one —
    **do NOT abandon it and do NOT ask permission to retry.** Instead: (1) record the exact
    MISSING node ids + the **UTC error timestamp** + the fresh `retry-after` in a
    **`PENDING-FIGMA-FETCH.md` queue file inside that project's design folder**; (2) set
    **DUE-AT = error time + 9 HOURS**; (3) re-attempt **at or after DUE-AT, automatically,
    without asking**; (4) if it fails again, **append the attempt to the queue's RETRY LOG and
    re-arm DUE-AT = new error time + 9 hours**; (5) **repeat until EVERY needed frame is
    downloaded.** "All the frames needed" means **100%, not "enough"** (Standing Rule 17
    completeness — no sampling, no "the important ones are done"). **WHEN TO CHECK THE QUEUE:**
    at **every session start**, and **before AND after any work touching that project or any
    design ingest**. **A design pass may NOT be reported as complete while a queue file is
    OPEN** — the deliverable (design notes + the project's PROJECT-STATE.md) must state the exact
    shortfall, e.g. *"73/85 PNGs; 12 pending, due-at 2026-07-30T23:27:02Z"*. **QUEUE FILE
    CONTENTS (convention):** OPEN/CLOSED status header with the check-and-run instruction · file
    key · the exact missing node ids + target filenames · the error timestamp (UTC) · DUE-AT ·
    the fresh `retry-after` for reference · the **exact resumable command** · a RETRY LOG table
    (attempt #, timestamp, outcome, frames obtained, still missing, `retry-after`, next DUE-AT)
    between `<!-- RETRY-LOG-START -->` / `<!-- RETRY-LOG-END -->` markers so the fetcher can
    append rows and re-arm DUE-AT itself · the post-success checklist (update the counts, the
    inventory's `png_source`, flag any NEW information the render reveals, close the queue).
    **INTERIM HONESTY:** missing frames are described from the **node tree** (their own visible
    TEXT layers, component/variant names, layer names) — **never guessed, never silently
    omitted** (Rules 12/17); the *nodes* endpoint is a SEPARATE budget from *images* and usually
    still works when images is capped, and `scale=1` is capped by the SAME budget (not a
    workaround). Any NEW information a late render reveals is recorded as a **FLAG** in the
    design notes — no test-case edit without user authorization (Rule 6). **HONESTY NOTE (say
    this plainly, don't imply magic): there is NO live scheduler or background timer across
    sessions/containers — the mechanism is this DUE-DATED QUEUE FILE plus the MANDATORY check at
    session start / before-and-after related work.** The fetcher must be **resumable and
    idempotent** (skip boards that already have a file, cache render URLs, work off the canonical
    frame inventory, runnable from any cwd) so a killed or rate-limited run costs nothing —
    canonical implementation `build/filters/design-2026-07-31/tools/fetch_all.py` (exit 0 =
    complete / 2 = rate-limited, queue re-armed / 3 = short for another reason). Design-source
    tokens stay in `/tmp` (`/tmp/figma-token`) and are **never committed**; `/tmp` is ephemeral,
    so on a fresh container ASK the user to re-supply the token, then continue the queue.
    **Rationale, 2026-07-31 (Filters):** the complete-Figma-extraction pass got 73 of 85 boards
    and the last 12 were blocked by a ~10.5 h image-endpoint cap; the user directed a permanent
    auto-retry so no design frame is ever quietly left behind. Canonical example:
    `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`. Method/recipe cross-reference:
    `build/APP-ACTIONS-PLAYBOOK.md` §M "Figma: extract ALL frames from a design link". Ties to
    Standing Rules 17 (complete data in/out), 27 (reuse recorded recipes), 29 (no work loss —
    the queue file is committed to git, the only durable store), 31 and 32 (latest source wins).
36. **Always remind the user of everything OUTSTANDING for each project — every report carries
    the asks (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"And keep on reminding me
    for anything which is missing for any project, like the epic is missing for some project the
    answers are missing for some project my go ahead is missing for some project OR anything which
    you had asked me to give you for that project that can be anything from give you a go ahead for
    something or provided you with a soure of something or to answer any of your squestion,m if
    anything is missing with the report of each project you will include that as a reminder for me
    to provide you with. The end goal is ALWAYS to make sure that our tests are 100% authentic."*
    **THE RULE:** EVERY project status report, management deliverable, and progress update MUST
    END with an **"OUTSTANDING — what I need from you"** section for that project. If nothing is
    outstanding, **say that explicitly** (*"Nothing outstanding"*) — **never omit the section**, so
    the user can always tell the difference between "clear" and "we forgot to check".
    **THE SIX CATEGORIES TO SWEEP EVERY TIME** (walk all six, every report — do not stop at the
    first one that has items): **(1) MISSING SOURCES** — spec/PRD not shared or stale, no epic in
    Jira, designs not provided or a Rule-35 Figma fetch queue still OPEN, tech plan not supplied
    (Rule 30), a promised video/changelog not delivered. **(2) UNANSWERED QUESTIONS** to a PO or to
    dev — name the sheet + the question number and who owes it, and **how long it has been
    outstanding**. **(3) MISSING GO-AHEADS / AUTHORIZATIONS** from the user — TestRail pushes,
    retirements, merges, deletions, run syncs, title-trim passes (Rule 6 means nothing moves
    without them). **(4) ACCESS / CREDENTIALS** needed — fresh staging or prod cookies, Atlassian
    access, a Figma token, a QuickBooks-connected company, a QA branch/env + flag state. **(5)
    DECISIONS THE USER DEFERRED OR HELD** — anything marked HELD, PENDING, or "your call".
    **(6) THINGS ANOTHER TEAM OWES** — a PO's spec correction, a dev fix, a missing ticket key, a
    stale Jira story.
    **EACH ITEM STATES FOUR THINGS:** *what is missing* · *who owes it* · **what it BLOCKS** (the
    concrete authenticity or coverage consequence, not a vague "needed for completeness") · *since
    when*.
    **ITEMS BLOCKED ON THE QA LEAD HIMSELF CARRY FIVE MORE — see Standing Rule 48:** any item that
    is *awaiting his authorisation*, *frozen by his ruling*, or *held by a decision he made* MUST
    also quote **which ruling (verbatim)** · **when he gave it and what question it answered** ·
    **the named cases it blocks (internal ID + C-id + link)** · **why the ruling was reasonable (or
    what has changed since)** · **the single thing that would unblock it, and from whom.** A bare
    *"awaiting your decision"* row is non-compliant — a ruling is a source, and sources get cited.
    **THE DURABLE REGISTER: `build/OUTSTANDING-ITEMS-REGISTER.md`** is the SINGLE cross-project
    source of truth for these asks — one section per project, a table per project, plus a one-line
    "what I most need from you". It is **updated whenever an item is RAISED or CLEARED** (same
    turn, like the PROCESS-CATALOG convention in Rule 21), and each project's `PROJECT-STATE.md`
    points at it. **Items are removed ONLY when genuinely satisfied** — never quietly dropped;
    cleared items move to the register's "Recently cleared" log with the date and how they were
    satisfied, so nothing can silently disappear and nothing gets re-asked (we have already
    embarrassed ourselves once by re-asking a question a source had answered). Predecessor
    snapshot kept for the record: `build/PROJECTS-NEEDS-2026-07-27.md`.
    **Reader-facing wording stays plain and layman (Rule 7)** — the outstanding section is written
    for a non-technical reader: what you need to give us, and what we cannot prove until you do.
    **RATIONALE:** the end goal is **100% AUTHENTIC tests**, and most authenticity gaps are things
    WE are waiting on — a missing epic means no ticket traceability (Rule 20 cannot be satisfied at
    all); an unanswered PO question means a case stays hedged/flagged rather than asserted; a
    missing QA branch means **nothing is live-verified** and the whole suite sits VIU-Pending (Rules
    12/22). Surfacing these every time is how the gaps get closed instead of quietly accumulating.
    Ties to Standing Rules 1 (never proceed without the complete input set), 6 (nothing written
    without permission), 12 (observed, never inferred), 20 (traceability/authenticity), 22 (ask for
    the live-build check + access up front), 30 (tech plan is a standard input), 31 (source
    currency), 33 (authority precedence) and 35 (the Figma fetch queue).
37. **Epics — ASK before a full re-read; if authorized, read them EXHAUSTIVELY (all projects).**
    USER DIRECTIVE (2026-07-31, verbatim): *"And for the EPics, since reading them from scratch is
    a long proess, ask me if you want me to get the updated epic version too. But if I ask you to
    do ye, then you need to check the epic open each ticket defect, bug, story and everything in
    that epic or related to that epic including the ticket/stories/bug/task titles/description/
    attached or inline images/comments and everything related to ALL the tickets."*
    This **REFINES Rule 31's epic step into two tiers** — it does not contradict it.
    **TIER 1 — THE CHEAP CURRENCY CHECK (part of the Rule-31 pre-flight; NO need to ask).** Fetch
    the epic + its child list and compare against our ingest: the **STORY SET** (any new or removed
    keys), **each story's STATUS**, and the **Jira CHANGELOG**. Verify the child count two
    independent ways (`parent = <epic>` and `"Epic Link" = <epic>`) with no paging remainder (Rule
    17). This is cheap and it is what proved **SV-8685 unchanged** and caught **SV-8582's 6
    reopened stories** on 2026-07-31. **If nothing moved, SAY SO plainly and proceed** — no full
    re-read, no question needed.
    **TIER 2 — THE FULL RE-READ (EXPENSIVE — ASK THE USER FIRST).** When the currency check shows
    **meaningful movement**, or when the task genuinely needs the epic's full content, **ASK the
    user whether to do a full epic re-read before starting it** — it is a long process and it is
    the most expensive ingest we do. **Never launch a full re-read unannounced, and never skip one
    the user has authorized.**
    **IF AUTHORIZED, "EXHAUSTIVE" MEANS EXACTLY THIS (Rule 17 completeness — state the totals
    found):** open **EVERY child ticket AND every related ticket** — linked issues, sub-tasks,
    defects, bugs, stories, tasks, **including tickets OUTSIDE the epic that link to it** — and for
    **EACH** one read: the **title**, the **FULL description**, **EVERY comment**, and **EVERY
    attachment INCLUDING inline images**. **Images must actually be DOWNLOADED and LOOKED AT — not
    merely listed by filename** — because screenshots routinely carry the real requirement or the
    real defect. Also read the **changelog**, the **status/resolution history**, and any **linked
    PRs/branches** referenced. **Report the exact counts** (tickets read / comments read / images
    viewed) and **quote the testable content VERBATIM** with its ticket key (Rule 25).
    **HONESTY CLAUSE:** if any part cannot be read — an attachment that will not download, a
    permission-blocked linked ticket, a truncated comment thread — **say precisely what was
    unreadable and why**. **NEVER present a partial epic read as complete** (Rules 12/17).
    **RATIONALE:** epic re-reads are the most expensive ingest we do, so they are **user-gated**;
    but a **PARTIAL one is worse than none**, because it produces false confidence about coverage.
    Canonical Tier-1 example: `build/epic-recheck-2026-07-31/` (both active epics currency-checked,
    170 SV epics enumerated to prove Filters has none). Ties to Standing Rules 1 (complete inputs),
    11 (ask which process), 12 (observed not inferred), 17 (complete data in/out), 22 (ask up
    front), 25 (verbatim citations), 31 (source currency) and 33 (authority precedence).
38. **FOREIGN test cases (created by someone other than us) are HANDS-OFF — identify, exclude from
    our counts, raise with the author (all projects).** USER RULING 2026-07-31: this hands-off
    approach is the CORRECT strategy and must be kept. **We NEVER edit, update, delete, move, or add
    to a run any case we did not author** — not to tidy a title, not to add `refs`, not to merge an
    apparent duplicate. **HOW TO TELL:** a case page's bottom-left **"People & Dates"** panel shows
    **Created** and **Updated** (name + date); via the API `get_case`/`get_cases` return
    **`created_by` / `updated_by` as user ids**, resolved with **`get_user/{id}`** (`get_users` is
    admin-only for our account). **We are user id 3 (Bilal Muzamil); id 1 = Vladimir Tomovic**, who
    authored the 5 automated Report Suite cases **C38919–C38923** found 2026-07-31. Supporting tells:
    **no `refs`** (ours always carry a Rule-20 reference), `template_id` 2 vs our 1, no expected
    results, titles over 80 chars, `custom_automation_type` unset — but **`custom_atmstatus` is NOT a
    tell** (3 = "Automated" on his cases and on 16 of ours). **REPORTING:** always state **BOTH
    numbers — "ours N / live total M"** (e.g. Report Suite = **ours 474 / live 479**) so our counts
    stay honest without claiming or hiding anyone else's work; per-project tallies count OURS only.
    **OVERLAP:** after any authorized push, re-check the group for new foreign cases and for overlaps
    with our cases (read-only checker
    `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`, method in
    build/APP-ACTIONS-PLAYBOOK.md §J), classify each as **DUPLICATE / AUTOMATED EQUIVALENT / NEW
    COVERAGE** on the assertion text, and **present the evidence rather than acting** — a duplicate
    is a QA-lead + author conversation (keep both / retire ours / their automation is redundant),
    never our unilateral decision. Where a foreign case CONTRADICTS one of ours about the build, that
    is a question for its author, not a licence to change either side. Canonical evidence pack:
    `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`. Ties to Standing Rules 6 (never write
    to TestRail without permission), 8 (always give the C-id), 17, 20, 25, 33 and 34.
    **⇒ AMENDMENT, 2026-09-01 — VLADIMIR TOMOVIC'S CASES ARE LEFT EXACTLY AS THEY ARE, FULL STOP, AND
    THIS IS NOW A NAMED-PERSON RULE RATHER THAN A CATEGORY ONE.** QA lead, 2026-09-01, verbatim:
    *"If the creator is Vladimir leave the test cases as is - remember this rule."* Restating his
    2026-09-01 earlier wording: *"C45220 and others where the creator of the test case is Vladimir,
    do not change them."*
    **THE TEST IS `created_by == 1`, CHECKED BEFORE THE WRITE — never the title, never the section,
    never "it looks like ours".** It does not matter that the case fails a gate, has no steps at all,
    contradicts one of ours, or is the single item standing between a suite and a clean runnability
    score: **it is reported, named with its author, and left untouched.** C45220 is the standing
    example — it is the only case in suite 6597 that fails the runnability gate, it has no steps, and
    it stays that way; the gate result is reported as 118 of 119 with the one exclusion named.
    **This overrides any general authorisation to write.** A go-ahead for a pass, a batch, a suite or
    a lane never reaches his cases; only he can, and he has said not to. **Do not ask again per case
    either** — the answer is recorded, and re-asking is how a standing ruling gets eroded.
    **⇒ AMENDMENT, 2026-08-31, RECORDED IN THIS FILE 2026-09-02 — THE PROJECT'S DESIGNATED MANUAL QA
    OWNER IS *IN SCOPE*, NOT FOREIGN. THIS IS THE ONE CARVE-OUT TO THE HANDS-OFF RULE.** QA lead,
    verbatim: *"If they are created by Mudassir, then treat them as the test cases which you need to
    build verify too because mudassir is the Manual QA owner for this testing suite/project. Going
    forward for such foreign cases tell me the name of the creator/updater of those test cases and if I
    tell you in the reply that the person you have named is the Maual QA owner, then you must treat
    those test cases as other test cases."*
    **⇒ SO A CASE AUTHORED BY THE PROJECT'S NAMED MANUAL QA OWNER IS TREATED EXACTLY AS IF WE HAD
    AUTHORED IT** — source-verify it, build-verify it, keep it tester-ready, update it (Rule 71 still
    applies if TestRail flags it Automated). **The NAMING STEP IS THE WHOLE POINT:** resolve the author
    to a name LIVE with `get_user/{id}`, report the name to the QA lead, and the carve-out applies only
    once **he** confirms that person is the manual QA owner **of that project**. **Recorded owners:**
    Invoice UI Refresh → **Mudassir Qamar** (user **6**, Manual QA owner — *not* the automation
    engineer; he corrected that in writing on 2026-08-31, verbatim: *"Layman/Manual QA"*) · Inline Add
    and Edit Parts (6597) and Printer Friendly WO (6617) → **Viktoria Videnovic** (user **4**;
    spelling is "Viktoria", not "Victoria"). **Vladimir Tomovic (user 1) is the exception in the other
    direction and is NEVER in scope, on any project** — see the 2026-09-01 amendment above.
    **⇒ THE PER-SUITE ASSIGNMENT IS THE QA LEAD'S OWN WORDS — RECORDED HERE VERBATIM 2026-09-02 SO IT
    LIVES IN THE RULE AND NOT ONLY IN THE INDEX. THE TWO MANUAL QA OWNERS ARE ASSIGNED PER SUITE — DO
    NOT MERGE THEM.** QA lead, 2026-09-01, verbatim, his typing preserved exactly as he wrote it because
    Rule 25 applies to his instructions as it does to a spec:
    > *"invoice refresh os for the manual QA tester Mudassir. 6597/6617 is for Viktoria."*
    **READ IT AS AN ASSIGNMENT, NOT A LIST:** the carve-out is **per project/suite**, so being a named
    manual QA owner **somewhere** does not make a person in scope **everywhere**. Mudassir Qamar
    (user **6**) is the owner on **Invoice UI Refresh**; Viktoria Videnovic (user **4**) is the owner on
    **6597 (Inline Add and Edit Parts)** and **6617 (Printer Friendly WO)**. **A handover names the owner
    who actually owns that suite.** (This quote existed only in `CLAUDE.md` §1 until this backfill —
    `build/rules/SECTION1-AND-AMENDMENT-AUDIT-2026-09-02.md` Part B; §1 is consolidated separately, and
    without the quote here it would have been lost.)
    **⇒ AND THE GENERAL LESSON, WHICH IS WHY THIS AMENDMENT IS WRITTEN HERE AND NOT ONLY IN CLAUDE.md:
    A RULE'S AMENDMENT IS PART OF THE RULE.** On 2026-09-02 a payload builder implemented this rule as
    the bare headline — `created_by != 3 → "foreign (Rule 38)"` — and **rejected all 30 of the manual
    QA owner's cases on Invoice UI Refresh**, i.e. it enforced the rule's first paragraph while
    breaking its amendment. **Read the rule in its file to the END, amendments included** — the
    CLAUDE.md index line is not the rule and says so itself — **and when a check implements a rule,
    encode the amendment in the check, SCOPED TO THE PROJECT it belongs to, never as a blanket
    allowance.** Worked example and the ten-check gate that now enforces it:
    `build/skills/00-COMMON-CORE.md` §5.0 / §5.0-a and its "A RULE'S AMENDMENT IS PART OF THE RULE"
    section.

39. **When someone else's test cases CONTRADICT ours, establish BOTH sides' sources and bring them
    to the QA lead (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"If what we have done
    is based on the specs/technical Plan/Loom Videos/Answers of the questins, then retain the latest
    information from our own sources, and if in future again the test cases of someone else
    contradicts with us, you need to come back to me with your sources and references and also you
    need to tell me here the otehr person who is creating the contradicting cases with ours is
    getting the reference to create those cases from"*.
    **DEFAULT POSITION — RETAIN OUR SOURCED LATEST INFORMATION.** Where OUR case is grounded in a
    legitimate source — **the spec, the engineering tech plan, a walkthrough/Loom video, or a PO's
    written answer** — we **KEEP our latest information** and do **NOT** change the case merely
    because another author's case disagrees. Another author's disagreement is not evidence.
    **BUT EVERY SUCH CONTRADICTION IS ESCALATED TO THE QA LEAD — NEVER RESOLVED SILENTLY**, and the
    escalation MUST put **BOTH SIDES** on the table: **(a) OUR source and reference** for the
    assertion — the **named document, its version, the section/anchor, and the date**; and **(b) WHAT
    SOURCE THE OTHER AUTHOR BASED THEIR CASE ON** — and this must be **ACTIVELY ESTABLISHED**, not
    shrugged at: their case's `refs` if it has any, **the spec version that was live on the date they
    authored it** (compare their created/updated timestamps against the spec's version history), the
    ticket / branch / build they were working from, the shipped-build behaviour their automation runs
    against — **or ASK THEM DIRECTLY**. **"Unknown" is only acceptable AFTER asking.**
    **RESOLUTION ORDER IS UNCHANGED:** Rule 33 (PO ruling → QA-lead ruling → our live-verified
    findings → another's claim) and Rule 32 (**newest authoritative product source wins**). A
    contradiction is **NEVER settled by seniority, job title, or who wrote first** — it is settled by
    **whose source is the most recent authoritative one**, which is precisely why **both bases must be
    visible** before anyone decides.
    **NEVER EDIT, DELETE OR MOVE THE OTHER AUTHOR'S CASES** (Rule 38 stands, absolutely) — we
    **present evidence** and let the **QA lead and the author** decide.
    **ALSO CHECK OUR OWN NEWER SOURCES FIRST.** An apparent conflict with another author is often
    **our own older case contradicting a newer ruling WE OURSELVES already ingested** (a spec version
    bump, a PO answer, a video). **Verify that before attributing the disagreement to anyone** — the
    honest outcome is frequently *"they are right, and our case is stale against our own source"*.
    Report which of the three it is: **(i) no change to ours** · **(ii) ours needs updating because
    of OUR OWN newer source** · **(iii) genuinely unresolvable without a PO ruling**.
    **RATIONALE, 2026-07-31:** Vladimir Tomovic's automated case
    **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** asserted a **Location
    column in the SBR CSV exports** while two of our cases — **SBR-EXP-10 =
    [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and **SBR-EXP-11 =
    [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** — stated the CSV headers
    were *"exactly"* a list **without it**. On inspection the likelier cause was **OUR OWN older
    cases not yet reflecting the 2026-07-29 SBR spec v15 export ruling (S14-R20)**, not a mistake by
    the other author. Canonical evidence pack:
    `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md`. Ties to Standing Rules 12
    (observed, never inferred), 20 (traceability), 25 (verbatim citation of the source deviated
    from), 32 (latest source wins), 33 (authority precedence) and 38 (foreign cases are hands-off).
40. **A requirement that spans SURFACES must be traced across EVERY surface — produce a surface
    matrix, not a case list (all projects).** A requirement almost never lives on one screen. When a
    requirement, PO ruling, spec delta, or design change is applied, **ENUMERATE THE SURFACES IT CAN
    TOUCH and give EACH ONE ITS OWN VERDICT** — "applied" is not an answer, and neither is a list of
    the cases you happened to edit.
    **THE SURFACE CHECKLIST (walk ALL of it, every time; mark N/A explicitly rather than skipping):**
    **on-screen** (the grid/list/table/detail view) · **PDF export** · **CSV export** (and any other
    download format) · **print view** · **API / response payload** · **mobile / responsive layout** ·
    **email or scheduled delivery** · **column/field selector or settings surface** · **filter and
    sort surfaces** · **empty / error / zero-state**. Add any surface the project has (a portal, a
    terminal, a QuickBooks push, a document template).
    **PER SURFACE, EXACTLY ONE VERDICT:** *covered by case X (internal ID + C-id)* · *case X extended
    (name the field changed)* · *new case authored* · *not applicable (state WHY, from the spec)* ·
    *blocked (state the blocker)*. **The change-list / delta deliverable MUST SHOW THE SURFACE MATRIX**
    — requirement anchor down the side, surfaces across the top — so a reader can see at a glance
    that no surface was left unexamined. A delta document that names only the cases it touched is
    **incomplete by definition** and may not be delivered.
    **THE TELL TO WATCH FOR:** a requirement whose own text says *"…in all four exports"*, *"every
    download"*, *"wherever it is shown"*, *"and in the API"*, *"on screen and in print"* is
    **explicitly multi-surface** — those phrases are a hard trigger for this rule. Also treat any
    requirement that CROSS-REFERENCES another requirement (*"in the same position it occupies on
    screen (S21-R7)"*) as multi-surface: the cross-reference is the surface link.
    **RATIONALE (2026-07-31 — the worst defect of the day, and it was ours):** the 2026-07-29
    suite-wide **Location column** ruling was worked through
    `build/report-suite/chris-answers-2026-07-31/DELTAS.md` **D11**, which authored **six new
    ON-SCREEN cases** (SBC-LOC-04 = C38912, SBR-LOC-05 = C38913, PV-FILT-14 = C38914, TU-LOC-06 =
    C38915, WIP-FLT-09 = C38916, IV-LOC-06 = C38917) and **never revisited the EXPORT cases** — the
    anchor **`S14-R20`** appears **nowhere in DELTAS.md** (verified: 0 occurrences). Consequence:
    **SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and
    **SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** kept
    enumerating CSV headers *"exactly"* **without** Location, so a tester on a correct multi-location
    build would have **failed a passing build**. The **same on-screen/export split** existed on three
    more reports — PV **S6-R11**, TU **S7-R13**, IV **S10-R15** (each export case covered only the
    `"Locations:"` metadata line). **We did not find it by auditing; we found it because an automation
    engineer's case disagreed with ours** (Rule 44). Evidence:
    `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` +
    `build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` rows 2–5. Ties to
    Standing Rules 17 (complete data in/out), 20 (traceability), 28 (the audit's Stage-2b sweep now
    groups by requirement anchor and checks every surface it names), 31 (source currency), 41
    (re-verify a whole case when you touch it) and 43 (per-requirement coverage verdicts).
