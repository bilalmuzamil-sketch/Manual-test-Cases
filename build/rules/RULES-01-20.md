# ShopView QA — Standing Rules 1–20

This file holds the FULL, VERBATIM text of Standing Rules 1–20.

Full archive: build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md
Index: CLAUDE.md (rule index table). Other rule files: build/rules/RULES-01-20.md, build/rules/RULES-21-40.md, build/rules/RULES-41-60.md, build/rules/RULES-61-99.md

**Read the rule you are about to apply here, in full — the index is not the rule.**

---

1. **Never proceed without the complete set of information needed.** If
   specs/designs/inputs are incomplete, STOP and ask for the missing pieces
   before doing the work (do not guess or partially proceed on a half-spec).
2. **Always confirm which project an instruction is for.** When the user gives an
   instruction, first offer the options (Custom Roles project / Fees and Discount
   project) and confirm the target project before acting — unless the instruction
   itself unambiguously names or references one project's artifacts.
3. **Separate memory per project; cross-use when useful.** Shared infrastructure
   (staging access, harness scripts, TestRail API patterns) is common;
   project-specific facts/scope/cases stay under each project's own files.
4. **API test placement:** ANY test case (any project) whose preconditions, steps,
   or expected results include API-related content — API endpoints, HTTP
   methods/verbs, HTTP status codes (200/201/204/400/403…), or explicit backend
   request/response checks — MUST be placed in a TestRail section whose title
   includes 'API'. UI-only cases stay in their functional sections. Apply to every
   TestRail import going forward.
5. **Self-service test data & roles (all projects):** On the disposable
   test/QA/staging environments, CREATE and DELETE whatever data a test case needs
   yourself (work orders, POs, parts, assets, inventory items, custom roles, etc.)
   — never block on missing data you can seed. To verify role-specific behavior,
   assign the Tech user the needed role (a system role, or a purpose-made custom
   role), test, then RESTORE Tech to its original role afterward. Do not block on
   anything you can do yourself. Still: mark throwaway data ZZAUTOTEST, restore any
   user/role/settings you change, and don't do irreversible things outside the
   disposable env.
6. **Everything except TestRail is a disposable TEST account — act freely.** All
   environments and third-party/integration accounts provided (staging, QA, qb,
   QuickBooks, and any other integration/environment) are disposable TEST accounts —
   nothing there is off-limits or irreversible-in-a-bad-way. Fully exercise them:
   create WOs/adjustments, invoice, push/sync to QuickBooks and verify real QB line
   items/GL/tax/totals end-to-end, unmap/remap settings, etc. Do NOT skip a
   verification just because it writes to a third-party integration. (Still tag
   throwaway data ZZAUTOTEST for tidiness and clean up in-app where easy, and restore
   settings/roles/location you change.) **The ONLY real/production system is
   TestRail — NEVER write to TestRail (create/update/delete cases, runs, or results)
   without explicit user permission.**
7. **PO & Dev questions (all projects):** When preparing open questions for a
   Product Owner OR for Developers, write them in the SIMPLEST, non-technical
   layman form. Each question = plain "What happens now" + "the question" +
   simple A/B options + a blank answer. NO case IDs, API/HTTP terms, bug codes,
   enum names, or jargon in the reader-facing content. Include ONLY genuine PRODUCT
   DECISIONS for the PO — never put bugs/defects in front of the PO (bugs go to dev
   tickets). Keep any internal question→case-ID mapping on a separate QA-only
   section/sheet, out of the reader-facing view. Whenever we surface questions to a
   Product Owner OR to Developers, the reader-facing wording MUST be in very simple,
   layman, non-technical language — assume the reader is not technical at all. This
   applies to every question deliverable going forward, for every project.
8. **TestRail IDs in deliverables (all projects):** EVERY deliverable that lists
   test cases (Excel workbooks, results/blockers trackers, CSVs, per-status files)
   MUST include the TestRail Case ID (C#####) — and a clickable TestRail link where
   practical (https://shopview.testrail.io/index.php?/cases/view/<id>) — so the user
   can locate each case in TestRail. Show it alongside any internal (SF-/FD-/etc.)
   ID. Source it from the per-project testrail-id-map.csv. Bake this into every
   workbook generator going forward.
   **EXTENDED 2026-07-23 — applies to CHAT/REPORTS too, not just files:** whenever I
   name a case by its internal ID (FD-/SF-/SCH-/etc.) ANYWHERE — a chat reply, a status
   update, a summary table, a findings list — I MUST pair it with the TestRail Case ID
   (C#####) + the /cases/view/<id> link so the user can look it up in TestRail. Never
   give a bare internal ID with no C-ID. (A case not yet in TestRail — e.g. a new
   to-be-authored case — is stated as "new, no C-ID yet".) User rule: "instead of just
   such numbers also give me the TestRail test case IDs so I can look for those in
   TestRail … save it for all the processes where you give me these numbers."
9. **Build-accurate, layman-friendly wording (all projects):** Every test case's
   Title, Preconditions, Steps, and Expected Results MUST use the EXACT words,
   button/label/feature/function/screen names as they actually appear in the
   build/UI — taken DIRECTLY from the build, never invented, paraphrased, or
   guessed. Wording must be understandable by a NEW, NON-TECHNICAL manual tester
   (plain layman language; if a UI term is unavoidable, use the term exactly as the
   build shows it). During any VIU pass, capture the real on-screen labels from the
   build and correct the case wording (title/preconds/steps/expected) to match them.
   If a term cannot be confirmed from the build, flag it rather than invent it. This
   applies to every project (Fees & Discounts, Simple Flow, Custom Roles, and any
   future project) and to every TestRail import/update going forward. **The repeatable
   method for this (capture labels → rewrite → VIU → push → deliverables) is
   `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`; apply it to a given project WHEN THE
   USER ASKS.**
   **⇒ AMENDMENT, 2026-08-12 — THIS RULE IS WIDER THAN "LABELS", AND ITS TEST IS *RUNNABILITY*.
   EVERY PRECONDITION AND EVERY STEP MUST BE **VERIFIED AGAINST THE BUILD**; THE EXPECTED BEHAVIOUR
   STILL COMES ONLY FROM THE DOCUMENTS. This is a SHARPENING of the rule, NOT a reversal of Rule
   57.** The wording above is kept verbatim and dated, never deleted (the Rules 31/52/53 pattern) —
   it was never wrong, it was read too narrowly.
   USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule 25
   applies to his instructions as it does to a spec): *"I understand, you have to address my concern,
   so even if you are not fully following what is meant by VIU, you have to make sure that the
   Preconditions/Steps or preproduction and Expected behavior are correct and Runnable by the manual
   tester. Steps of reproduction should not be the invented ones, neither the expected behaviors. For
   the steps of reproduction you can take them from the build to make them correct, and I need those
   steps of reproduction and preconditions mentioned in the test cases correct to the level that they
   can be executed by the manual QA tester, if the steps of reproduction and preconditions are not
   runnable as they differ from what is there in the build then the manual tester can not test that
   test, YES the expected behavior should come from the sources rather than the build, Keep the VIU
   rule but correct it as needed."*
   **⇒ AND HE SHARPENED IT THE SAME DAY, verbatim — THIS SECOND FORMULATION IS THE OPERATIVE ONE:**
   *"when I say steps of reproduction can be taken from build I mean, that steps of reproduction MUST
   be verified from the build to 100% ensure that when manual tester would run the test he will be
   able to run it."*
   **🔑 THE DISTINCTION, AND IT IS THE WHOLE POINT: THE BUILD IS THE *CHECK*, NEVER THE *AUTHOR*.**
   **· ❌ NOT THIS:** observe the build, then write the steps to describe what it does. **That would
   let the build AUTHOR OUR COVERAGE — the same failure mode as taking an expectation from it, one
   layer down.** A case whose steps were written by watching the build **ends up testing whatever the
   build happens to make easy**, and it will look impeccable while doing it.
   **· ✅ THIS:** the steps come from **what the case exists to test**; **every one is then VERIFIED
   against the build** so that a manual tester can actually execute it. ~~**Where a step cannot be
   executed as written, it is CORRECTED to the MINIMUM that makes it executable**~~ — **never a
   rewrite of the case around what the build makes convenient, and never an invented step.**
   **⚠️ THE STRUCK CLAUSE IS CORRECTED BY THE THIRD STEP BELOW, ADDED LATER THE SAME DAY. It is kept
   visible and struck, not deleted (the Rules 31/52/53 pattern), because it is WRONG AS A GENERAL
   RULE: "correct it to the minimum that makes it executable" is right for a COSMETIC difference and
   WRONG for a SUBSTANTIVE one — where the route or state the source requires DOES NOT EXIST on the
   build, silently correcting the case ERASES A DEFECT SIGNAL.** See **THE THIRD STEP** immediately
   below for the two categories and their different handling.
   **⇒ AND THE FULL CHAIN HAS THREE STEPS, NOT TWO — HIS THIRD STATEMENT THE SAME DAY, verbatim:**
   *"We have to make sure that we learn the steps of reproduction from the sources but when we are
   writing steps of reproduction to execute any test case, those steps of reproduction should be
   verified to be 'Runnable' on a build. If any step learned from the sources verified on the build
   differs that can be raised to me. A tester should not find a step coming from mars (which does not
   exist), so writing steps of reproduction and verifying them from the BUILD must never be confused
   with taking the expected behaviors from the build, same goes for the preconditions, the
   preconditions should be learned from the sources and verified on Build to see if that is really
   possible to set as a precondition on the build or not. If any precondition learned from the
   sources is not doable on the build should be raised to me. The sensitive part here is that we need
   to make sure that the testers find a runnable test to execute."*
   **🔗 THE CHAIN, AND ALL THREE LINKS ARE MANDATORY:**
   **LEARNED FROM THE SOURCES → VERIFIED RUNNABLE ON THE BUILD → ANY DIVERGENCE RAISED TO THE QA
   LEAD.** **Steps and preconditions ORIGINATE IN THE SOURCES** — that is the first link, and it is
   what makes guard 2 below operative: the build never decides what a case does or what state it
   needs. **The build's job is the second link only: proving it can actually be run.**
   **🔴 THE THIRD STEP — TWO CATEGORIES OF DIVERGENCE, HANDLED DIFFERENTLY. GETTING THIS WRONG IS HOW
   A DEFECT DISAPPEARS.**
   **· (a) COSMETIC** — a renamed control, a moved menu item, a changed label, **the same route by a
   slightly different path**. **CORRECT IT so the tester can run the case, and LOG IT.** No
   escalation.
   **· (b) SUBSTANTIVE** — **the route or the state the source describes DOES NOT EXIST on the build,
   or cannot be set up at all.** **NEVER SILENTLY REWRITTEN.** It is **RECORDED AS A DIVERGENCE with
   BOTH TEXTS QUOTED** (Rule 45(e)) **and the affected C-ids** (Rule 8), given **the smallest change
   that stops a tester being stranded** — normally **`AUTOMATION: HOLD` with a plain reason and a
   "mark BLOCKED, not failed" line** — **and RAISED TO THE QA LEAD** (his words: *"If any precondition
   learned from the sources is not doable on the build should be raised to me"*), logged in the
   **OUTSTANDING-ITEMS REGISTER** (Rule 36).
   **🔑 THE TEST BETWEEN THEM, IN ONE QUESTION — this is what makes the category DECIDABLE rather
   than a matter of taste: *WOULD A READER OF THE SOURCE RECOGNISE WHAT THE BUILD OFFERS AS THE SAME
   THING?*** **If YES → cosmetic.** **If the source describes something the build simply DOES NOT
   HAVE → substantive.**
   **⚠️ AND WHY (b) MATTERS SO MUCH: A PRECONDITION THE SOURCES REQUIRE BUT THE BUILD CANNOT ACHIEVE
   IS VERY OFTEN EVIDENCE THAT THE *BUILD* IS WRONG, NOT THE CASE.** Rewriting the case to match the
   build in that situation does not fix a test — **it deletes the finding**, and nobody downstream can
   tell it ever existed.
   **🔴 THE TWO-WAY SPLIT — READ BOTH HALVES TOGETHER, NEVER ONE ALONE:**
   **· PRECONDITIONS · STEPS · NAVIGATION · LABELS → LEARNED FROM THE SOURCES, then 100% VERIFIED
   AGAINST THE BUILD, and must be EXECUTABLE EXACTLY AS WRITTEN.** The obligation is **VERIFICATION,
   not derivation**: *"steps of reproduction MUST be verified from the build to 100% ensure that when
   manual tester would run the test he will be able to run it."*
   **· EXPECTED BEHAVIOUR → COMES ONLY FROM THE DOCUMENTS (Standing Rule 57), in his own words:
   *"YES the expected behavior should come from the sources rather than the build"*.**
   **· NEITHER MAY BE INVENTED — his words cover both halves in one breath: *"Steps of reproduction
   should not be the invented ones, neither the expected behaviors."*** **AN INVENTED STEP IS WORSE
   THAN A MISSING ONE, BECAUSE IT *LOOKS* RUNNABLE** and the tester only discovers otherwise with the
   case open in front of them.
   **🛑 TWO GUARDS, AND THEY PROTECT AGAINST OPPOSITE ERRORS — BOTH ARE LOAD-BEARING:**
   **· GUARD 1 — THE BUILD MAY NOT SUPPLY THE *EXPECTATION*. RULE 57 IS UNTOUCHED AND IS RESTATED
   HERE INTACT: THE EXPECTED BEHAVIOUR COMES FROM THE DOCUMENTS, NEVER FROM THE BUILD.** This is
   spelled out because **the clause *"for the steps of reproduction you can take them from the
   build"* is EXACTLY the sentence a future session could over-read into "take the expectation from
   the build too"** — which is the failure that cost **748 cases on 5 August 2026** (Rule 57's
   rationale). **The licence is scoped to the ROUTE — how you get there, what the screen is called,
   what the button says. It stops dead at the ASSERTION.**
   **· GUARD 2 — THE BUILD MAY NOT SUPPLY THE *COVERAGE*.** Steps are **verified** against the build,
   never **authored** from it. **A pass that walks the build and writes down what it finds has let
   the product decide what gets tested** — it will produce a suite that passes handsomely and covers
   whatever was easiest to reach. **Guard 1 keeps the build out of the assertion; guard 2 keeps it
   out of the coverage.** Neither substitutes for the other, and **the second is the easier one to
   breach without noticing**, because the resulting case is genuinely runnable and reads as careful
   work.
   **🔥 THE DANGEROUS EDGE — GUARD 2'S SHARPEST INSTANCE, AND IT IS NEW TODAY. NOW THAT CORRECTING
   STEPS AGAINST THE BUILD IS *REQUIRED*, CATEGORY (b) IS THE NEW HIDING PLACE: A SUBSTANTIVE
   DIVERGENCE QUIETLY "FIXED" INTO A RUNNABLE STEP LOOKS LIKE DILIGENT MAINTENANCE AND READS AS
   CAREFUL WORK.** It is **the same shape as the failure that cost 748 cases on 5 August 2026, one
   layer down** — and it is **harder to spot than that one was**, because the resulting case is
   genuinely runnable, genuinely build-accurate, and passes every check except the one that matters:
   **the source said something the build does not do, and now nothing anywhere records it.** **THE
   DEFENCE IS THE CATEGORY QUESTION ABOVE, ASKED EVERY TIME A STEP IS CORRECTED** — never skipped
   because the fix was obvious, and never resolved in favour of (a) because (b) is more work or the
   release is close.
   **THE RUNNABILITY TEST — FIVE CHECKS, AND A REVIEWER MAY FAIL A CASE ON ANY ONE OF THEM:**
   **(1) IS THE PRECONDITION REACHABLE?** Does the required data state exist, or can it be seeded
   (Rule 14)? **If it is genuinely unreachable, that is an `AUTOMATION: HOLD` with a plain reason and
   a tester-facing "mark BLOCKED, not failed" instruction — NEVER a silent pass.**
   **(2) DOES THE NAVIGATION PATH EXIST?** Every screen, tab and menu the steps name.
   **(3) DOES EACH NAMED CONTROL EXIST WHERE THE STEP SAYS IT IS?** — **not merely somewhere on the
   page.** A control that exists two screens away is a failed check, not a near miss.
   **(4) DO THE STEPS WORK IN THE ORDER WRITTEN?** **A step that depends on a state no earlier step
   creates is NOT runnable**, however correct each line looks in isolation.
   **(5) ARE THE LABELS THE ONES ACTUALLY ON SCREEN?** — **read the COMPUTED STYLE, not
   `textContent`.** A label carrying `text-transform: capitalize` **reads one way in the DOM and
   another to the tester**, and **BOTH READINGS ARE NEEDED — neither alone is "the label".**
   **WHY THIS MATTERS, IN HIS TERMS: a case whose steps do not match the build CANNOT BE EXECUTED AT
   ALL** — *"then the manual tester can not test that test."* **A perfect expectation sitting behind
   an unrunnable precondition is worth NOTHING**, and it fails silently: the tester does not report a
   defect, they simply stop.
   **🎯 HIS STATED GOAL, AND IT IS THE ONE-LINE TEST OF THE WHOLE AMENDMENT:** *"A tester should not
   find a step coming from mars (which does not exist)"* and *"we need to make sure that the testers
   find a runnable test to execute."*
   **⇒ SO: NO CASE MAY SEND A TESTER TO SOMETHING THAT DOES NOT EXIST — it is either CORRECTED (a),
   or CLEARLY MARKED NOT RUNNABLE WITH THE REASON AND RAISED (b). NEVER LEFT SILENTLY BROKEN, AND
   NEVER QUIETLY REWRITTEN INTO SOMETHING THE SOURCES NEVER ASKED FOR.**
   **📊 THE REPORTING CONSEQUENCE — THE STANDARD IS 100%, AND THE COUNT IS STATED HONESTLY, NEVER
   ROUNDED UP.** His words are *"verified from the build to 100%"*, so: **a suite may be called
   runnable ONLY to the extent its steps have ACTUALLY been verified.** **AN UNVERIFIED STEP IS AN
   UNVERIFIED CASE** — one unchecked step disqualifies the whole case from the runnable count, because
   that is the step the tester will stop on. **The honest report is HOW MANY CASES HAD EVERY STEP
   VERIFIED — not how many were "looked at", "swept", "covered by a label pass" or "expected to be
   fine".** State it as **N of M, on which build marker** (Rules 12/17/50; Rule 60(d) bars the blanket
   caveat that hides the number). **A case whose steps were never checked against the build is
   reported as exactly that**, not folded into a total.
   **RATIONALE, 2026-08-12 — TWO LIVE EXAMPLES FROM THIS WEEK, AND BOTH ARE OURS:**
   **(a) [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) (Schedule)** sent the
   tester to the **roles-list three-dot menu** to use **`Reset to template`** — **that menu offers
   ONLY `View Permissions`** (measured on Technician and Parts Manager). The control lives on the
   role's own screen at `/administration/roles-permissions/<id>/edit`. **A tester would have been
   stuck on the very case that resets every role before permission testing** — check (3) catches it.
   Evidence: `build/schedule/build-viu-2026-08-12/FINDINGS.md` §F2.
   **(b) [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) = FLT-PSRCH-14
   (Filters)** told the tester to *"Open the **Sales Tax** report, choose the **Collected** tab"* —
   **a report and a tab in that shape the specification does not describe**; `S13-R19` names
   **"Sales Tax (Collected)"** as ONE surface. **The case is `READY` and UNTESTED**, so a tester
   would have opened it and stopped — check (2) catches it. Evidence:
   `build/filters/build-viu-2026-08-12/CHANGES-MADE.md` §1.
   **(c) AND THE COUNTER-EXAMPLE THAT PRODUCED CHECK (5): a `textContent`-only sweep nearly
   "CORRECTED" FIVE Work In Progress cases INTO BEING WRONG** — on a **FINAL** report, **hours before
   release**. The tab labels carry `text-transform: capitalize`: `textContent` gives
   *"Approved - partially completed"* while **the tester reads *"Approved - Partially Completed"* —
   and our cases said the second, and were RIGHT.** Evidence:
   `build/report-suite/build-viu-2026-08-12/FINDINGS.md`.
   **⚠️ HONEST SCOPE NOTE — WHAT A SUITE IN THIS STATE MAY AND MAY NOT BE CALLED.** The QA lead has
   **separately re-scoped the behaviour half** (Rule 10's 2026-08-11 amendment): **the MANUAL QA
   TESTER records pass or fail; WE DO NOT.** So a suite that has had this treatment is described as
   **"source-verified and build-accurate in its preconditions, steps, navigation and labels — with
   the behaviour verdict belonging to the tester"**, and **NOT as "VIU complete"**.
   **THE PLAINER PHRASING, RECORDED DELIBERATELY BECAUSE IT IS WHAT HE WILL SAY OUT LOUD WHEN
   CHALLENGED — and it is BOTH TRUE AND STRONGER THAN AN OVERCLAIM:** ***"Every case says what the
   documents require, and every case can actually be run on the build as written. Whether the build
   does what the documents require is the tester's call — and that is by design."***
   Ties to Standing Rules 7 (plain layman wording), 8 (a divergence names its cases with C-id +
   link), 10 (**"VIU" means this method end to end — and its behaviour half is the tester's since
   2026-08-11**), 12 (observed, never inferred — a
   runnability check is an OBSERVATION and must genuinely be made), 13 (live feature-by-feature), 14
   (seed the state rather than declare blocked — check (1)'s first resort, **and if seeding genuinely
   cannot achieve it, that is a category (b) divergence, not a blocker to shrug at**), 25
   (**"matched to the build" = VIU'd against the build: the route, never the assertion**), 36 (**a
   raised divergence is an OUTSTANDING item and belongs in the register**), 41 (touch a case → the
   whole-case re-read now includes all five checks), 42 (a scope-conditional expectation is still
   worth nothing behind an unrunnable precondition), 45(e) (**a divergence quotes BOTH texts side by
   side**), 46 (**a divergence recorded is a deliberate decision documented — one silently "fixed" is
   indistinguishable from a miss**), 48 (**an item raised to the QA lead carries its five fields**),
   49 (a runnability finding on a non-final build
   is still PROVISIONAL), 54 (sentence 2 records when the route was last checked; sentence 1 still
   names documents only), 55 (**a divergence is written for him in plain layman words**), 57
   (**UNTOUCHED — the expectation comes from the documents, never the
   build**), 58 (an ambiguous source about a STEP is settled from the build; an ambiguous source
   about an EXPECTATION is held and asked), 60 (**layer 1 is hereby WIDENED from "labels and
   navigation" to "preconditions, steps, navigation and labels"**), 61 (a held case tells the
   tester to mark BLOCKED, not failed) and 62 (**raising a divergence is REPORTING, not filing — no
   ticket is created without his permission, and the creation hold at Rule 62's tail is active**).
10. **"VIU" = the full BUILD-ACCURATE-WORDING-VIU-PROCESS (all projects, default
    meaning):** When the user says **"VIU the test cases"** (or "do the VIU"), it
    means **run `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` END-TO-END** (this is
    the rule-9 method): capture the EXACT on-screen labels LIVE from the build →
    rewrite every case Title/Preconditions/Steps/Expected into build-accurate,
    layman, non-technical wording (never invented; flag anything unconfirmable) →
    VIU-verify behavior **LIVE with evidence** → checkpoint-commit → push to TestRail via `update_case`
    with a per-case audit log (subject to that project's TestRail authorization; **the push step's
    verification follows Standing Rule 50 — EXHAUSTIVE then EXACT: every case and every field, no
    sampling, and each write re-GET and byte-compared against the intended payload with untouched
    fields proven byte-identical**) →
    **STAMP OR REFRESH EACH CASE'S PROVENANCE LINE as part of that same push (Standing Rule 54) — a
    live-verified case's line must name the build and the date it was checked against IN RULE 54's
    SENTENCE 2 ("Last checked against build … on …"), NEVER in sentence 1, which names DOCUMENTS ONLY;
    the barred single-sentence "as per the build tested on …" form must never be reconstructed. A push
    that corrects wording but leaves a stale (or absent) provenance line is not complete** →
    regenerate deliverables (Blockers Tracker + Results workbook + import, with
    TestRail Case ID + Link columns) → report each area tester-ready and **ALWAYS
    state the TestRail update status explicitly.** This is the default meaning of
    "VIU" for EVERY project going forward. **The behavior-verification step MUST be
    LIVE UI-OBSERVED with evidence captured that run (screenshot / captured API
    response) — never inferred.** For permission/role cases this means actually
    logging in / driving the UI AS the actual role and OBSERVING the control, PER
    role, PER environment — never derived from role definitions, `fe_permissions`,
    atoms, or source code. A case is only **VIU-Verified** when its behavior was
    directly observed live with evidence; otherwise it is **Blocked / NOT VERIFIED**
    with the reason stated. (See Standing Rule 12 — verified means observed, never
    inferred; it governs this step absolutely.)
    **⇒ AMENDMENT, 2026-08-11 — THE BEHAVIOUR-VERDICT HALF OF THIS RULE IS SUPERSEDED BY THE QA
    LEAD'S RULING; THE WORDING/LABEL HALF STANDS UNCHANGED. The superseded text above is KEPT
    VISIBLE AND DATED, never deleted (the Rules 31/52/53 pattern), so a future session sees a
    DELIBERATE OVERRIDE rather than a lapse.**
    He instructed, verbatim (2026-08-10): *"let the manual QA tester verify those test cases and
    mark those test cases are passed or failed"*, and **CONFIRMED the reading of it on 2026-08-11,
    verbatim: *"you are RIGHT"***.
    **WHAT WE STILL DO:** verify the **LABELS AND WORDINGS** against the build (Rule 9 and this
    rule's wording half) · verify the **STEPS AND NAVIGATION** are followable by a layman tester ·
    verify the **SOURCES** are 100% accurate.
    **WHAT WE NO LONGER DO:** chase a **pass/fail BEHAVIOUR VERDICT** per case. **The MANUAL QA
    TESTER observes the behaviour and marks the case passed or failed.**
    **SO THE SENTENCES ABOVE — *"The behavior-verification step MUST be LIVE UI-OBSERVED with
    evidence"* and *"A case is only VIU-Verified when its behavior was directly observed live with
    evidence; otherwise it is Blocked / NOT VERIFIED"* — NO LONGER GOVERN THE BEHAVIOUR VERDICT.**
    Under Rules 32/33 his ruling is the later authority and wins.
    **🔴 TWO THINGS THIS DOES *NOT* DO, SPELLED OUT BECAUSE THEY ARE EASY TO BLUR:**
    **(1) IT DOES NOT WEAKEN RULE 57.** Expected behaviour **STILL comes from the documents** — the
    PRD, the epic's stories, the PO's answers, the design, Figma, a shared handover. **The build
    still NEVER supplies an expectation.** What changed is only **WHO JUDGES whether the build meets
    it**: the tester, not us.
    **(2) IT DOES NOT WEAKEN RULE 12.** Anything we **DO** state as observed must still be
    **genuinely observed with evidence**. **The ruling removes an OBLIGATION TO OBSERVE; it does not
    licence claiming an observation we did not make.**
    **AND IT DOES NOT SUPPRESS AN INCIDENTAL FINDING:** where we observe a deviation while checking
    a label, we **still RECORD it with its evidence** in the pass's findings — we simply do not build
    a verification programme around it, and **under the active creation hold we FILE nothing**
    (Rule 62 and the hold at its tail).
    **AUTHORITY:** his 2026-08-10 instruction as confirmed 2026-08-11; surfaced and put to him under
    **Standing Rule 63**, and cited here per **Rule 48** (a ruling is a source and sources get cited).
    **⇒ REMINDER REINFORCED, 2026-08-11 — "VIU" MEANS THE PROCESS *AND THE PROCESSES ATTACHED TO IT*,
    NOT A WORDING SWEEP.** His words, verbatim: *"which are VIU'd with the process attached to the
    VIU, remember I asked you to run a few processes with VIU whenever I ask you to run VIU. Dont
    forget that."* **This adds no new requirement — it is a reminder that the attached processes are
    part of what "VIU" already means, and they are the half that gets quietly dropped.** When he asks
    for a VIU, **Standing Rule 11 still governs: ASK WHICH PROCESSES** — and the ones that hang off a
    VIU pass are:
    **· BUILD-ACCURATE WORDING + VIU** — `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`, this rule's
    own method (Rule 9's labels/wording half).
    **· TRACEABILITY BACKFILL (Rule 20)** — every case's `refs` carrying **BOTH** the Jira ticket key
    **AND** the spec anchor in `<TICKET(S)> (<spec-anchor>)`; ticket-only is not acceptable — plus the
    tester-facing **Rule-54 provenance line** stamped or re-stamped in the same push.
    **· COVERAGE-MATRIX RE-DERIVATION (Rule 43)** — the requirement → case map **RE-DERIVED from the
    current spec, never patched**, run in **BOTH directions**, one verdict row per requirement.
    **· THE RUTHLESS USEFULNESS AUDIT (Rule 28)** — the **MANDATORY FINAL GATE** of every authoring
    pass, scoring **100%** of the cases on all three dimensions.
    **The full callable list, with trigger phrases and the deliverable each produces, is
    `build/PROCESS-CATALOG.md` — read it to pick and name the processes rather than reconstructing
    them from memory.**
    **⇒ AMENDMENT, 2026-08-12 — THE WORDING HALF OF THIS RULE IS WIDER THAN "LABELS": IT IS
    RUNNABILITY, AND IT COVERS PRECONDITIONS, STEPS AND NAVIGATION AS WELL. Full text, the verbatim
    directive and the FIVE-CHECK RUNNABILITY TEST live at the tail of Standing Rule 9** — recorded
    once there rather than duplicated here, because Rule 9 is where the wording obligation is
    defined and a divergent second copy is how the two drift apart.
    **WHAT IT CHANGES IN THIS RULE'S STEP LIST, IN ONE LINE:** the step above that reads *"rewrite
    every case Title/Preconditions/Steps/Expected into build-accurate, layman, non-technical
    wording"* is **not satisfied by correcting labels alone** — **every precondition and every step
    must be VERIFIED AGAINST THE BUILD and be EXECUTABLE EXACTLY AS WRITTEN**, and a pass that
    skipped the five checks **has not done this rule's wording half.** QA lead, verbatim
    (2026-08-12): *"steps of reproduction MUST be verified from the build to 100% ensure that when
    manual tester would run the test he will be able to run it."* and *"Keep the VIU rule but correct
    it as needed."*
    **🛑 TWO GUARDS, BOTH RESTATED: THE BUILD SUPPLIES NEITHER THE EXPECTATION NOR THE COVERAGE.**
    **(1) RULE 57 IS INTACT — THE EXPECTED BEHAVIOUR STILL COMES FROM THE DOCUMENTS, NEVER FROM THE
    BUILD**, in his own words: *"YES the expected behavior should come from the sources rather than
    the build"*. **(2) THE BUILD IS THE CHECK, NEVER THE AUTHOR** — steps come from what the case
    exists to test and are then **verified** against the build; **a suite whose steps were written by
    watching the build tests whatever the build made easy.**
    **AND THE COUNT IS HONEST: an unverified step is an unverified case**, so a VIU report states
    **how many cases had EVERY step verified, on which build marker** — never how many were looked
    at (Rule 9's reporting consequence).
    **⚠️ THE CHAIN HAS THREE LINKS, AND A VIU PASS OWES ALL THREE: LEARNED FROM THE SOURCES →
    VERIFIED RUNNABLE ON THE BUILD → ANY DIVERGENCE RAISED TO THE QA LEAD.** A step or precondition
    the sources require that the build **does not have** is a **SUBSTANTIVE divergence**: it is
    **never silently rewritten into something runnable** — it is recorded with both texts and the
    C-ids, given `AUTOMATION: HOLD` plus a "mark BLOCKED, not failed" line, and **raised**. Only a
    **COSMETIC** difference (a renamed control, a moved menu item — *would a reader of the source
    recognise what the build offers as the same thing?*) is simply corrected and logged. **A VIU pass
    therefore ships a `DIVERGENCES` deliverable**, and a pass that corrected steps but raised nothing
    should be able to say why (Rule 9's dangerous edge). QA lead, verbatim: *"If any precondition
    learned from the sources is not doable on the build should be raised to me."*
    **HOW A SUITE IN THIS STATE IS DESCRIBED (with this rule's 2026-08-11 behaviour-verdict
    amendment above): "source-verified and build-accurate in its preconditions, steps, navigation and
    labels — with the behaviour verdict belonging to the tester" — NEVER "VIU complete".** The plain
    spoken form is recorded at the tail of Rule 9.
11. **ALWAYS ASK which process to run on a new/updated spec OR a VIU request (all
    projects):** Whenever the user provides a spec (new or updated) OR asks to VIU,
    ALWAYS ASK the user first whether they want (1)
    `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (per-case build-accurate wording +
    behavior VIU) and/or (2)
    `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (whole-suite
    relevance/obsolescence audit + regenerate ALL deliverables) run — **do not
    assume; confirm which one(s) before proceeding.** Ties directly to Standing
    Rules 9 and 10 (they define the two methods; this rule governs when to invoke
    each). The two are complementary: rule-9/10 wording+VIU handles each case's
    words/behavior; the reconciliation process handles which cases should exist and
    keeps every downstream deliverable honest to the current spec.
12. **Verified means OBSERVED, never inferred (trust rule):** When the user asks
    for a real/live check — or ANY verification — only mark something Verified /
    Pass / Fail / grants / blocks / present / absent if it was ACTUALLY observed
    live in the environment with evidence (screenshot / API response captured that
    run). NEVER fill a gap with inference from the spec, the source code, role
    definitions, or prior data and present it as a verified result. Anything not
    directly observed MUST be labeled explicitly 'NOT VERIFIED' (or
    Blocked-with-reason) in the deliverable — never silently derived and passed off
    as done. If a live check cannot be completed (session/cookie expired, screen
    unreachable, env down), STOP and tell the user plainly what could not be
    verified and what is needed (e.g. fresh cookies) — do NOT substitute inference
    to appear complete. Every deliverable must clearly separate LIVE-OBSERVED
    results from INFERRED/derived ones, with a per-item confidence/source. This is
    absolute for release-critical and production work. Rationale: on 2026-07-14 a
    prod-vs-staging permission comparison presented FE-gated capabilities (Send to
    Portal/Terminal etc.) as results when they were inferred from role
    definitions/code rather than UI-observed, and the session had expired mid-run —
    this broke user trust and must never recur.
    **AMENDMENT 2026-09-03 — AN ABSENCE IS A CLAIM, AND IT NEEDS A SAMPLE THAT COULD HAVE
    DISPROVED IT.** Rule 12 has always governed what may be called Verified. Its mirror image needs
    saying too: **"X is not there" is just as much a verified/not-verified call as "X is there", and it
    is the one that gets reported from evidence that cannot carry it.** Two misses in one night, both
    from clean-running probes that answered a NARROWER question than the one being asked:
    **(a)** a probe read `document.querySelector('table tbody tr')` — the FIRST row of the table, which
    in this app's tables is an empty SPACER — printed "0 controls", and that went into a report as
    *"a part sale's line rows carry no return action in any status"*. Every row reading `Received`
    carries a `Return` arrow, and two blocked test cases hung off it; the QA lead found it in one
    click. **(b)** ten credit notes were read, none carried the shop's disclaimer, and that was
    reported as *"the credit note omits the disclaimer"* — with C44970 rewritten to be marked Failed.
    All ten were the SAME KIND of credit (account-level); the eleventh, raised from an invoice, prints
    it in full. The finding had to be withdrawn and the case rewritten again.
    **⇒ Before writing any sentence that says something is absent, missing, unavailable or impossible,
    answer one question: WHAT WOULD THIS PROBE HAVE PRINTED IF THE THING DID EXIST SOMEWHERE I DID NOT
    LOOK? If the answer is "exactly what it printed", the probe has not measured the claim.** Name the
    dimension the claim generalises over (every row? every status? every kind of document?) and show
    the sample spans it — **N observations of one kind are one observation.** Enforced, not merely
    advised: `probe_lib.mjs` `ENUMERATE_ROWS_FN` · `rowNegativeIsTrustworthy` (throws when rows went
    unexamined or all share one state) · `sampleSpansKinds` (throws on a one-kind sample), and
    `negativesAreTrustworthy` for bundle scans. Full treatment with both worked misses:
    `build/skills/03-RUN-CHECK.md` §8.0-c.
13. **Live, feature-by-feature testing is the DEFAULT standard (all projects):**
    Whenever the user asks to TEST / VERIFY / CHECK / CONFIRM anything — any
    feature, function, permission, or behavior — test it LIVE by going through each
    feature/function IN THE REAL ENVIRONMENT and OBSERVING it directly with evidence
    (screenshot / captured response that run), exactly the way the 2026-07-14
    prod-vs-staging permission comparison was done (log in / drive the actual UI per
    role / per environment, seed data as needed, observe the real control/behavior).
    Never assume, never infer from spec, source code, role definitions,
    fe_permissions, atoms, or prior data. Go feature-by-feature in reality. This
    live, feature-by-feature, evidence-based method is the required standard for
    EVERY testing request going forward, not just VIU or release checks. (Extends
    Rule 12's observed-not-inferred trust rule and Rule 10's live VIU verification
    step to cover ALL test/verify/check/confirm requests.)
14. **NEVER mark anything NOT-VERIFIED for a missing DATA-STATE — seed it and
    observe (all projects).** A test/verify/compare cell or case must NEVER be left
    "NOT VERIFIED" (or Blocked) merely because the required data-state doesn't
    currently exist in the environment. On the disposable test/staging/QA/prod
    environments (all are test accounts — writes/deletes authorized per Standing
    Rule 6), the required state is ALWAYS self-serviceable: SEED it and observe the
    behavior LIVE with evidence. Reasons like "line already approved — needs a
    pending-line WO", "no returnable part exists", "no cored picked line", "no
    invoice in void state", "no PO/delivery", "role has no live holder" are NOT
    acceptable blockers — UNBLOCK yourself by creating the state (seed a WO with an
    unapproved line, pick a cored/returnable part, drive an invoice to void, create
    a PO+delivery, CREATE a fresh staff member per role and clean-self-login, etc.),
    then observe. The ONLY permissible non-plain-observed cell is a genuine EXTERNAL
    dependency that cannot be provisioned even with full seeding + fresh-staff
    creation (e.g. physical payment-terminal hardware / external payment-processor
    registration) — and even then it must be a FULLY-CHARACTERIZED, evidence-backed
    LABELED verdict (e.g. "org-device gate — org has no terminal device; not a
    role/permission difference"), NEVER the bare text "NOT VERIFIED". This extends
    Standing Rules 5 (self-service test data), 12 (observed not inferred), and 13
    (live feature-by-feature testing): observed-not-inferred means you must first
    CREATE the conditions needed to observe, not fall back to NOT-VERIFIED. Applies
    to every deliverable and every project going forward.
    **RE-CONFIRMED 2026-09-03, QA lead, verbatim: _"1. Always seed data, never stay blocked."_ —
    said in answer to a report that six Credit Invoice cases could not be verified because no credit
    existed in any state other than `Unapplied`. Worked example, the whole of it done that night on the
    disposable branch: the states `Applied` (C45181), `Partially applied` (C45180), `Refunded` and
    partly-refunded (C45182), and partly-applied-AND-partly-refunded (C45183) were each CREATED through
    the UI, every credit's printed note rendered via `GET /api/credit-memos/{id}/pdf`, and all four
    cases moved from NOT VERIFIED to PASS on real documents — after the route for applying a credit,
    which nobody in this workspace had ever found, was discovered by clicking (the credit's own row has
    no "apply" action; you tick the credit row AND an unpaid invoice row together and use `New
    Payment`). **The lesson underneath it: a state nobody knows how to reach is not the same as a state
    that cannot exist — and the difference is found by walking the UI, never by declaring a blocker.**
    Evidence and the four recipes: `build/invoice-ui-refresh/credit-states-2026-09-03/VERDICTS.md`.
    **What still does not yield to seeding is named honestly:** C44967 line 2 and C44968 line 1 need a
    credit raised from a RETURNED PART with a restocking fee, which is a parts-return flow rather than
    the account-level `Issue Credit`, and they remain NOT VERIFIED with that reason stated.**
    **SELF-SEED PLAYBOOK (learned 2026-07-23 — always try these BEFORE ever saying
    "blocked"): (a) DON'T rely on the user to unblock env/data/workplace issues — find
    the fix yourself (e.g. the location/workplace switcher, a different WO in your own
    workplace). (b) When the UI is flaky (Quasar dialogs/selects intercepting clicks),
    switch to the API; when the API is scoped/awkward, switch to the UI — use whichever
    works. (c) DISCOVER endpoints by probing: POST with an empty/partial body and read
    the validation error to learn required fields (this found `POST /api/work-orders/create`
    needs company_id+vehicle_id+workplace_id+start_date+`is_vehicle_here:true`). (d) SEED
    the state yourself: create WOs/lines/parts/adjustments, assign a customer default so
    fees auto-apply, create a fresh staff per role, etc. **ROLE-TESTING ON STAGING (learned from the Test-Case/Automated-Test-Run session 2026-07-23): to test an arbitrary role's permission LIVE, either (i) `POST /api/switch-user {user_id}` to IMPERSONATE an existing holder of that role (get user_id = staff `id` from `GET /api/staff?limit=200` which lists role_label per staff; end with a fresh admin `login()`), or (ii) create a fresh staff `POST /api/iam/create {email, firstName, lastName, roleId, departments:[...], workplaceId}` then self-login — but on staging a fresh staff needs invite-confirmation, so PREFER switch-user impersonation of an existing role holder. NEVER role-swap Tech mid-session (causes the /no-location SPA bounce = technique artifact, not a permission result). Proven: impersonated Sales Representative (workOrdersCreateAndEdit=FALSE) → whole-WO fee add returned 201 = FE-only gate, confirming FD-WO-013/PERM-002.** (e) For Quasar UI, click by
    element-center COORDINATE (page.mouse.click) rather than Playwright actionability
    clicks that time out on backdrops; reach in-page tabs the same way. (f) CLEAN UP
    after (delete ZZAUTOTEST data, restore roles). Only after all of this genuinely
    fails is it a real blocker — and then it must be a FULLY-CHARACTERIZED, evidence-backed
    label (e.g. "WO line-create returns HTTP 500, requestId X — env defect for dev"),
    never bare "NOT VERIFIED", and you may hand the user a step-by-step data-setup sheet
    (layman, per Rule 7) for the one thing only a human/dev can provide.** The user's
    standing instruction: "there is nothing like 'require seeding data' — you can make
    everything in the build; do not find an excuse to keep yourself blocked."
15. **Spec-conformance calls derive from a VERBATIM TRUTH TABLE + adversarial
    self-audit before delivery (all projects).** Whenever annotating/judging
    ANYTHING against a spec (per-spec columns, case-vs-spec reconciliation,
    deviation calls): (1) NEVER derive from a prose summary/extract of the spec —
    build a VERBATIM role×gate / requirement truth table from the CANONICAL spec
    document itself, every value cited to its exact table row/section, with ALL
    change-log entries applied (latest-wins) so no stale column survives; (2)
    re-derive every judgement from that truth table, not from memory or a previous
    pass; (3) before delivering, run an ADVERSARIAL SELF-AUDIT diff — independently
    recompute a sample (or all, for release-critical work) of the calls and diff
    against what was written; ship only after the diff is empty; (4) MATCH/no-delta
    rows must STILL be checked against the spec — identical behavior in both envs
    can still deviate from spec; (5) where the spec is silent or self-contradictory,
    say "spec silent"/"spec inconsistent (flagged)" explicitly with the conflicting
    citations — never pick a side silently, and never declare silence without
    reading the FULL spec (matrix + prose + change-log + key decisions + open
    questions). Rationale: on 2026-07-16 a per-spec annotation pass produced 64/297
    wrong cells because it derived from a stale prose extract instead of the
    canonical spec; the truth-table + adversarial-diff method caught and fixed
    them. Release-critical deliverables get the full-population re-audit, not a
    sample.
16. **ALWAYS deliver in the format already established/provided (all projects).**
    Every deliverable (TestRail import CSV/XLSX, results/blockers workbooks,
    question sheets, exec/QA reports, per-status files, etc.) MUST match the EXACT
    format of the artifact already given for that deliverable type — same column
    headers and order, same section/folder naming convention, same file location
    and filename pattern, same wording/formatting conventions (numbered
    Preconditions/Steps/Expected, line breaks), same rules (API cases in an
    'API'-titled section per Rule 4, VIU-word-free + feature-flag-free imports,
    TestRail Case ID + link columns per Rule 8). Before producing any deliverable,
    FIRST locate the canonical prior example (e.g.
    testrail-import/<project>-testrail-import.csv + the project's gen_import.py, or
    the established workbook generator) and MIRROR its schema 1:1; do NOT invent a
    new layout. If no prior example exists for that deliverable type, ask or reuse
    the closest established template. Rationale: on 2026-07-16 the Global Search
    TestRail import was first produced in a bespoke column layout instead of
    matching the existing testrail-import/ CSV format used by Fees & Discounts and
    Simple Flow; deliverables must always mirror the format already in use so they
    drop into the user's existing process unchanged.
17. **COMPLETE data in, COMPLETE data out, COMPLETE work — always (all projects).**
    Never work from, or deliver, a partial subset unless the user EXPLICITLY asks
    to trim. (1) INPUTS: before authoring/analyzing/verifying anything, enumerate
    the FULL input set (every Figma frame in the section, every spec section +
    change-log, every ticket + its comments, every case in the suite, every role,
    every row) and state the exact total found; if any part of the input set
    cannot be obtained, STOP and tell the user exactly what is missing and how to
    supply it (per Standing Rule 1) rather than silently proceeding on a subset.
    (2) OUTPUTS: deliverables cover the WHOLE population, not a sample — no silent
    caps, no "top N", no representative-subset substitutions; if something is
    intentionally excluded (e.g. design states marked out-of-scope), list the
    exclusion explicitly with the reason. (3) WORK: multi-item jobs (VIU passes,
    comparisons, audits, pushes) run to 100% of the item list or report the
    precise per-item remainder with reasons — never declare done at a partial
    count. (4) Every completion report states the counts: total in scope /
    processed / excluded-with-reason, so completeness is verifiable at a glance.
    Rationale: 2026-07-16 — the first Figma capture for the Filters project
    rendered only 8 of the section's ~26 frames and the user had to catch it
    ("you need to have them ALL"); completeness must be the default, trimming
    only ever user-requested.
18. **Reconstruct the FULL originating instruction history when turning work
    into a process or reproducing a deliverable (all projects).** Whenever the
    user asks to (a) create/save a process, recipe, template, or "method" FROM
    their instructions, or (b) reproduce/replicate/"do the same as" a
    deliverable previously produced (including when they hand back a file you
    generated), you MUST go back to the COMPLETE set of instructions that
    produced that artifact — from the very first ask through EVERY correction,
    refinement, and iteration that led to the final ACCEPTED version — and fold
    all of it in. Do NOT merely reverse-engineer the finished artifact's
    structure/format: the originating intent, the standards demanded, and
    especially the corrections the user made ("this is wrong, fix it", "you
    can't make this mistake", "it has to be X", "you also had to learn from my
    instructions") are part of the spec and must be captured too. This applies
    to EVERYTHING — files/workbooks, TestRail test cases, imports, question
    sheets, exec/QA reports, comparisons, VIU passes, and any other work.
    METHOD: mine (1) the session transcript for the user's own turns on that
    work, (2) the project's memory/state/method docs, and (3) the relevant
    Standing Rules' rationale clauses, to recover the full A-to-Z including the
    path to the final acceptable format; then reproduce/encode BOTH the final
    structure AND the requirements/corrections behind it. When reproducing,
    apply those captured requirements by default unless the user overrides for
    that specific request. Rationale: on 2026-07-20, asked to save a reusable
    recipe for the prod-vs-staging comparison workbook, the first pass only
    reverse-engineered the file's cell structure and omitted the user's
    originating instructions and hard-won corrections (the trust incident,
    zero-NOT-VERIFIED, truth-table + adversarial audit, exec/QA companions,
    role merge-map); the user required both the format AND the full instruction
    history. Ties to Standing Rules 9/10/11/15/16/17 and the recipe docs (e.g.
    build/COMPARISON-WORKBOOK-RECIPE.md).
19. **Deliverable filenames must be HUMAN-READABLE (all projects).** Every file
    delivered to the user (imports, workbooks, question sheets, reports,
    evidence bundles) carries a filename readable at a glance — spell out
    project/report/feature names in full; NEVER cryptic abbreviations
    (sbc/pv/tu), internal codes, or opaque slugs; include the deliverable type
    and (where dated) the date. Established cross-project patterns (e.g.
    `<project>-v1-testrail-import.csv`) remain valid where they already exist;
    new files default to readable full names. Rationale: 2026-07-22 — the six
    per-report Report Suite split imports were first emitted as
    report-suite-v1-{sbc,pv,...}-… and the user required full report names
    ("make them human readable to avoid confusion - remember this rule
    always").
20. **Every test case is 100% AUTHENTIC = fully TRACEABLE to its ticket(s) + spec
    (all projects).** Whenever CREATING, VIU-verifying, or UPDATING a test case, the
    case MUST carry a provable link back to (a) the Jira ticket(s) it belongs to AND
    (b) the exact spec section/requirement it derives from — so anyone can show WHY the
    case exists and WHY its expected result is what it is. Capture these references in
    the TRACEABILITY / METADATA layer, NOT the tester-facing fields. **The TestRail
    case References (`refs`) field MUST carry BOTH references together — the Jira
    ticket key(s) AND the spec section/requirement anchor — in the format
    `<TICKET(S)> (<spec-anchor>)`** (e.g. `SV-7696 (S1-R3 (Vendor invoice Optional/
    Required))`, `SV-7865 (§5-R3)`, `SV-7301 (§5 invariant 1)` for a cross-cutting
    integrity case with no single-story owner). **Ticket-only is NOT acceptable — the
    spec reference must never be dropped** (corrected 2026-07-22: an earlier pass wrongly
    reduced `refs` to the ticket key alone; the user requires ticket + spec both, always).
    Mirror the same combined `refs` into the per-project `testrail-id-map.csv` and the
    findings/coverage-matrix. **Per-story precision ALWAYS** — the exact story ticket +
    exact spec requirement, never epic-level or guesswork (the only time the epic key is
    used is a genuinely cross-cutting case with no single-story owner, and that is stated
    explicitly). This does NOT contradict Rules 7 & 9 — the tester-facing Title/
    Preconditions/Steps/Expected stay plain and jargon-free (NO ticket IDs, story refs,
    §-numbers, enum names, or bug codes in the words the manual tester reads); the
    references live only in the metadata layer. Every CHANGE to a case must cite its
    driving ticket (with Done/Not-Done status) + spec section in the audit log and the
    change-list deliverable (last-update-wins on conflicts). A case with no ticket AND no
    spec anchor is NOT authentic — flag it (missing-traceability) rather than leave it
    unsourced. **The repeatable method to find + backfill unsourced cases is
    build/MISSING-TRACEABILITY-PROCESS.md** (run it on demand or as a sub-step of any
    spec-recheck/VIU pass).
    **⇒ ESCALATED 2026-08-11 BY STANDING RULE 64 — THE REMEDY IS NO LONGER "FLAG" ALONE.** The
    sentence above — ***"A case with no ticket AND no spec anchor is NOT authentic — flag it
    (missing-traceability) rather than leave it unsourced"*** — is **KEPT VISIBLE AND DATED, NOT
    DELETED** (the Rules 31/52/53 pattern), because it remains the **FIRST** step and the one that
    saves real coverage. **What changed is what happens AFTER the flag:** the QA lead ruled
    (2026-08-11, verbatim) ***"there should not be a case for which we do not have a source … Otherwise
    the case should be deleted, but before deleting the case check if that case has 'Automated'
    marker"***. **So the remedy is now FLAG → SEARCH FOR THE SOURCE → and, only where the case
    genuinely cannot be sourced from ANY document, DELETE — with the automation check first and the
    QA lead's permission always.** **THE FLAG IS NOT OPTIONAL AND IT IS NOT A FORMALITY: most
    "unsourced" cases are TRACEABILITY GAPS, not sourceless cases, and deleting one of those throws
    away real coverage.** The full requirement, the three states, the automation precondition and the
    deletion discipline are **Standing Rule 64** — read it before acting on this paragraph.
    **TWO-SESSION KNOWLEDGE SHARING:** this workspace is worked
    by more than one Claude session in parallel; there is no live message bus between
    them, so **this CLAUDE.md + the build/*-PROCESS.md docs ARE the shared brain** — any
    session that learns/changes a durable rule MUST write it here so the other session
    picks it up, and MUST read here before acting. Ties to Standing Rules
    6/8/9/10/11/12/13/14/15 and build/SPEC-RECHECK-PROCESS.md +
    build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md.
