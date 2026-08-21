# ShopView QA — Standing Rules 41–60

This file holds the FULL, VERBATIM text of Standing Rules 41–60.

Full archive: build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md
Index: CLAUDE.md (rule index table). Other rule files: build/rules/RULES-01-20.md, build/rules/RULES-21-40.md, build/rules/RULES-41-60.md, build/rules/RULES-61-93.md

**Read the rule you are about to apply here, in full — the index is not the rule.**

---

41. **Touch a case, RE-VERIFY THE WHOLE CASE — there are no surgical edits (all projects).** Any test
    case you open for **ANY** reason — a one-word label rename, a title trim, a `refs` backfill, a
    merge, a note addition, a status flip — gets **RE-READ END-TO-END against the CURRENT spec before
    it is saved**, and its `refs` re-validated. **Opening a case is the cheapest opportunity we will
    ever get to catch that it is stale; a surgical edit throws that opportunity away and, worse,
    stamps the case with a fresh "Updated" date that makes it LOOK current.**
    **METHOD (checkable — the pass must be able to prove it did this):** per touched case, record in
    the execution log a line **"re-verified whole against `<spec document + version + date>`"** plus
    the fields checked — **title · preconditions · steps · expected results · refs · notes** — and
    any second finding the re-read produced. **A push log whose entries name only the edited field is
    non-compliant.** **The re-read follows Standing Rule 50 — EXHAUSTIVE then EXACT: EVERY field
    (title · preconditions · every step · every expected result · refs · section · type · notes), not
    only the one being edited; the case text byte-compared against the current spec text; and every
    field the pass did NOT intend to change proven byte-identical to its pre-write snapshot.** Where the re-read finds a further problem the pass was not chartered to fix,
    **RECORD IT** (in the manifest and the Outstanding register) rather than silently leaving it;
    where it finds nothing, the recorded line is the positive evidence that it was looked at.
    **⇒ EXTENDED 2026-08-12 (Standing Rule 9's amendment): THE WHOLE-CASE RE-READ IS AGAINST THE
    CURRENT SPEC *AND* THE CURRENT BUILD — IT NOW RUNS THE FIVE-CHECK RUNNABILITY TEST TOO.** Reading
    a case end-to-end against the spec proves its **expectation** is sound and says **nothing** about
    whether a tester can reach the screen. So the re-read also asks: **is the precondition reachable ·
    does the navigation path exist · does each named control exist where the step says it is · do the
    steps work in the order written · are the labels the ones actually on screen (computed style, not
    `textContent`)** — full text at the tail of Rule 9. **The recorded line gains a second half:
    "re-verified whole against `<spec + version + date>` and runnable against `<build marker>`"**, or
    an honest statement that the build half was **not** checked this pass. **This rule's own logic
    demands it: opening a case is the cheapest chance to catch that it is unrunnable, and the fresh
    "Updated" date makes an unrunnable case look freshly maintained** — exactly the harm the rule was
    written against, in the one dimension it did not yet cover.
    **RATIONALE (2026-07-31):** **SBR-EXP-10 = C30285** and **SBR-EXP-11 = C30286** were touched that
    same day — **ops 46 and 47** of the authorized push
    (`build/report-suite/chris-answers-2026-07-31/testrail-execution-log-2026-07-31.md`) — **purely to
    apply Chris's Q5 `Sales Rep` → `Sales Representative` rename on the first header**. The pass had
    both cases open, edited the very line that lists the headers, and **did not notice the header LIST
    itself was already stale** against `S14-R20`. One end-to-end re-read of either case would have
    caught the day's worst defect hours earlier and for free. Ties to Standing Rules 20, 28, 31, 40
    and 43, **and 9 (the five-check runnability test the re-read now also runs)**.
    **⇒ DATED ADDITION, 2026-08-17 (QA lead, approved with "Add") — "MAKE THE CASES CURRENT" MEANS THE
    WHOLE CASE, NOT A REFERENCE BUMP.** Verbatim clarification: *"Not just the references should be
    correct the test cases should be current too."* When the QA lead asks for cases to be made
    **current** to updated sources, that means the **ENTIRE case** — expected behaviour, on-screen
    labels, steps, preconditions **AND** the references — **must reflect the latest sources** (Rules
    31/32/57), **not merely bumping the `refs` or the version pin.** A reference-only update is **NOT**
    "making the case current" and must never be reported as such. This is the flip side of this rule:
    touching a case to re-pin its `refs` obliges the same whole-case re-verification as any other edit,
    and re-stamping the Rule-54 provenance line is part of the same pass. **Context:** on 2026-08-17 the
    QA lead corrected a pass that had treated a currency update as a reference/version-pin update.
    Ties to Standing Rules 11 (ask which process on updated sources), 31 (source currency — its dated
    addition of the same date carries the cross-pointer), 43 (per-requirement re-derivation), 54
    (re-stamp the provenance line) and 57 (expectation from the current documents).
42. **NO ABSOLUTE ENUMERATIONS without a version-pinned anchor — prefer scope-conditional wording
    (all projects).** A closed list in an expected result is a **time bomb**: it is correct until the
    spec adds one item, and then it makes a tester **fail a correct build**. Any expected result that
    CLOSES a list — *"the headers, in order, are exactly …"*, *"the options are exactly …"*, *"only
    these columns appear"*, *"the menu contains exactly …"*, *"no other field is shown"* — MUST:
    **(a) CITE ITS GOVERNING REQUIREMENT + THE SPEC VERSION in `refs`** (Rule 20 format, extended
    with the version: `<TICKET(S)> (<spec-anchor>, spec v<N> <date>)`), so that when that requirement
    changes, **every case citing it is re-checked** (this is what makes the same-anchor clustering in
    Rule 28's Stage 2b actually work); and
    **(b) BE WRITTEN SCOPE-CONDITIONALLY WHEREVER THE SPEC MAKES THE LIST CONDITIONAL** — prefer
    **"includes X in position Y when Z"** (plus, where useful, "and is absent when not-Z") over a
    closed list. Only keep a closed list when **the closed list IS the requirement** (the spec itself
    says "exactly these and no others") — and then say so in the case notes, citing the anchor.
    **Give the tester the plain conditional too** (Rule 7), e.g. *"If you are looking at only one
    location there is no Location column — that is correct."* — otherwise a correct build reads as a
    failure to a layman tester.
    **SWEEP DUTY:** the word **"exactly"** (and "only", "no other", "the complete list") in a
    tester-facing field is a **grep-able audit target**; every hit must show a version-pinned anchor
    or be rewritten. This is a Dimension-2 fail condition in Rule 28.
    **RATIONALE (2026-07-31):** *"The headers, in order, are **exactly**: Sales Representative,
    # Invoices, …, Subtotal."* (SBR-EXP-10 = C30285, and its twin C30286) **broke the moment the spec
    added a column** — `S14-R20`, 2026-07-29. The enumerations dated from the **2026-07-11** "Exports
    hardened" change and the cases' `refs` cited only **S14-R15 / S14-R16 / S14-R18**, so nothing
    connected them to the requirement that changed.
    **⇒ CROSS-REFERENCE ADDED 2026-08-12 (Standing Rule 9's amendment): SCOPE-CONDITIONAL WORDING
    FIXES THE *ASSERTION*, AND IS WORTH NOTHING BEHIND AN UNRUNNABLE PRECONDITION.** This rule keeps
    a correct build from reading as a failure; **Rule 9's five-check runnability test keeps the
    tester from never reaching the screen at all.** A case can satisfy this rule perfectly and still
    be untestable, so the two are checked **together** on any pass that touches a case (Rule 41).
    **And note the direction of the licence: the build may correct the ROUTE to the assertion; it may
    never supply or narrow the ASSERTION** — the repair for an unsupported enumeration is still
    removal or a scope condition (Rules 25/57), never substituting what the build renders.
    Ties to Standing Rules 7 (plain tester wording),
    20 (refs), 25 (verbatim citation), 28 (Dimension 2), 32 (latest wins), 40 and 43, **and 9
    (runnability — the other half of a case a tester can actually run)**.
43. **Spec-diff processing must emit a PER-REQUIREMENT COVERAGE VERDICT — a narrative summary is not
    acceptable (all projects).** For **EVERY** added / changed / removed requirement in a spec diff,
    the deliverable carries **its own explicit ROW**: the **requirement id** + the **VERBATIM
    requirement text** → **one** verdict from: **covered by case(s)** (internal ID + C-id) ·
    **case extended** (name the case + the field changed) · **new case authored** (or *authoring
    proposed, awaiting authorization*) · **not independently testable** (state the reason — e.g. it
    is rationale prose, or it duplicates another requirement's assertion) · **blocked** (state the
    blocker and who owns it). **The diff pass is NOT COMPLETE until every row has a verdict**, and
    the row count must reconcile with the number of deltas the diff itself found (state both totals —
    Rule 17).
    **COVERAGE MATRICES ARE RE-DERIVED PER SPEC VERSION, NEVER INCREMENTALLY PATCHED.** Rebuild the
    requirement → case map from the CURRENT spec body and the CURRENT case source every time, and run
    it in **BOTH directions**: requirement → case(s) (finds uncovered requirements) **and** case →
    requirement (finds cases whose anchor no longer exists, i.e. orphaned or stale-anchored cases).
    Patching last version's matrix preserves last version's blind spots — which is exactly how this
    rule was earned.
    **RATIONALE (2026-07-31):** **`S14-R20` WAS PRESENT** in our own v15 spec diff
    (`build/report-suite/spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md` §2.2 lists it explicitly)
    and yet **appears NOWHERE** in the deltas document that acted on that diff
    (`chris-answers-2026-07-31/DELTAS.md` — 0 occurrences). **The narrative summary let a
    correctly-detected requirement slip between detection and action**, and it took a **formal
    re-derivation** (`build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md`)
    to surface it — along with the same gap on **PV S6-R11, TU S7-R13, IV S10-R15**. A per-requirement
    verdict table makes that class of slip structurally impossible: an un-verdicted row is a visible
    hole. Ties to Standing Rules 11 (ask which process), 15 (verbatim truth-table), 17, 20, 31, 40
    and 42; the required table format lives in
    `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` step 1.
44. **Another author's CONTRADICTING case is a BUG REPORT AGAINST OUR SUITE until disproven (all
    projects).** When anyone else's test case — automation or manual, senior or junior, referenced or
    unreferenced — disagrees with one of ours, the **FIRST** move is **NOT** to defend ours or to
    question theirs. It is to **RE-DERIVE OUR OWN POSITION FROM THE CURRENT SOURCES**: re-pull the
    spec (Rule 31), find the governing requirement, read it verbatim (Rule 25), and check the DATE of
    the text our case actually cites. **If our source is stale or was misread, OURS IS THE DEFECT and
    we fix ours** — and we say so plainly. **Only after our side is verified sound** does the
    disagreement become a question to them, escalated with **both sides' sources** per Rule 39.
    **NEVER dismiss the other case on grounds of seniority, authorship, job title, automation-vs-
    manual, or ABSENCE OF REFERENCES.** A missing `refs` field is a **traceability** shortcoming of
    their case; it is **not evidence about the build**, and it must never be used as the reason to
    wave the disagreement away. Rule 38 still stands absolutely: **we do not touch their cases** — we
    fix ours and present the evidence.
    **RATIONALE (2026-07-31 — the uncomfortable one):** Vladimir Tomovic's automated
    **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** ("SBR Summary and Expanded
    CSV exports carry the Location column at its designated slot") was **RIGHT**, and **our two cases
    — SBR-EXP-10 = C30285 and SBR-EXP-11 = C30286 — were WRONG, against OUR OWN spec** (SBR v15
    `S14-R20`, live since 2026-07-29, one day before he authored). **His case carried NO `refs` at
    all** — precisely the signal we might have used to dismiss it. It was the only thing that exposed
    a four-report export gap. Evidence:
    `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` +
    `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`. Ties to Standing Rules 12, 25, 31, 32,
    33 (precedence — judge the claim, not the claimant), 38, 39, 40 and 43.
45. **OUTSIDE-IN GAP HUNT — before any suite is declared current, deliberately look at it from
    OUTSIDE (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"Also I need to fill the GAP,
    Vlad should not have been able to find the missing cases, how did we miss them and what have we
    learned from that? How will we ensure that we will not miss creating those cases which Vlad picked
    up. Learn from that and add to your strategy anything which should be the part of your learning to
    never miss any test cases to be created which others can raise like Vlad did today."*
    **THE RULE:** a suite may **NOT** be reported as current, complete, or audited-clean until it has
    been examined from a position **other than our own**. Rules 40–44 force us to follow through on
    what WE detected; this rule exists because **we had no way to notice that an outsider could see
    something we could not.** All five checks below run, and the suite's deliverable **states the
    result of each one** — "not applicable" is a permitted answer, silence is not.
    **(a) FOREIGN-COVERAGE DIFF, IN BOTH DIRECTIONS.** The overlap direction ("which of THEIR cases
    duplicate OURS") is `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`. The
    REVERSE direction — **assertions in other authors' cases with NO counterpart in ours** — is
    `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` (READ-ONLY, `get_*` only). **Their case
    existing where ours does not is a COVERAGE SIGNAL, not a nuisance.** Every foreign assertion gets
    one of three labels — **COVERED-BY** (name our case ids) · **CANDIDATE GAP** · **CONTRADICTS-OURS**
    — and every CANDIDATE GAP / CONTRADICTS row is **carried into the deliverable with its evidence**.
    **Foreign cases stay untouched in every scenario (Rule 38); a candidate gap is authorised by the
    QA lead, never authored on our own initiative (Rule 6).**
    **(b) THE AUTOMATION-ENGINEER LENS.** For each requirement ask: *"if I were automating this from
    the RUNNING BUILD, what would I assert?"* — then check we have a case for it. An automation
    engineer must assert what a system actually emits; he cannot write a header list he has not seen.
    **HONESTY, per Rule 12: WITHOUT A QA BRANCH this lens is limited to what the DOCUMENT says, and
    that limit must be stated in the deliverable.** It is also itself an **OUTSTANDING ASK** (Rule 36)
    — the largest single reason an outsider working from the build can out-see us.
    **(c) THE HOSTILE-REVIEWER LENS.** An explicit *"what would a reviewer claim is missing?"* pass
    **before** delivery, not after the challenge arrives. Its output is the Rule-46 register.
    **(d) EVERY EXTERNAL SIGNAL IS A COVERAGE INPUT, NEVER MERELY A REPLY.** A reviewer's report, a
    colleague's test case, a support ticket, a dev comment, a customer complaint, a PO aside — each is
    **LOGGED and DIFFED against the suite**, not just answered. On 2026-07-31 **two reviews and one
    foreign case each surfaced something real**; answering them would have fixed three sentences and
    left the defects in place.
    **(e) A "COVERED" VERDICT IS ONLY VALID WITH BOTH TEXTS QUOTED SIDE BY SIDE — and a requirement
    making MORE THAN ONE ASSERTION GETS ONE ROW PER ASSERTION.** This is the mechanical clause; the
    other four are lenses. *"Covered by C30277"* is **unfalsifiable as written**, so no reviewer ever
    tests it. Any coverage / NO-CHANGE / "provably fine" verdict must show **the requirement's verbatim
    text** beside **the covering case's verbatim expected-result text**, and where a requirement
    asserts two things (a column **and** a metadata line; on screen **and** in the export) **each
    assertion is verdicted separately.** **Checkable test of compliance: a NO-CHANGE entry that names
    only case ids, with no quoted text, is non-compliant and the pass is not done.**
    **RATIONALE (2026-07-31 — the failure this rule exists for):** SBR spec v15 `S14-R20` (live
    2026-07-29) makes **two** assertions — the per-row Location **column** in all four exports, **and**
    a `"Locations:"` metadata **line**. Our deltas pass
    (`build/report-suite/chris-answers-2026-07-31/DELTAS.md`) **did examine the export surface** and
    filed it under **"NO-CHANGE (checked, provably fine — not skipped)"** entry **N2**, listing seven
    case ids that cover the **line** — thereby certifying the **column** as done. That is a **false
    all-clear, which is worse than a blind spot because it stops anyone looking again**. `S14-R20`
    appears **nowhere** in that document (0 occurrences). Consequence: **SBR-EXP-10 =
    [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and **SBR-EXP-11 =
    [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** kept enumerating CSV headers
    *"exactly"* without Location, and the identical split existed on **four more reports** — SBC
    `S4-R13`, PV `S6-R11`, TU `S7-R13`, IV `S10-R15` (**five reports in total**; WIP was covered by
    WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)). **We did not find
    it by auditing. We found it because Vladimir Tomovic's automated
    [C38923](https://shopview.testrail.io/index.php?/cases/view/38923) — which carried NO `refs` —
    disagreed with ours.** The reverse checker reproduces the catch from cold: for C38923 it narrows
    **474 of our cases to 8 candidates** with C30285 and C30286 ranked **3rd and 4th**. Full analysis
    (timeline, five-whys, and the honest finding that **Rule 42 would NOT have fired here** because the
    invalidating requirement was a NEW anchor arriving in the same spec version):
    `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`; live output
    `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md`. Ties to Standing Rules 6 (nothing
    written without permission), 12 (observed, never inferred), 17 (complete data in/out), 22 (ask for
    the live check + access up front), 28 (the audit's outside-in stage), 31, 33 (judge the claim, not
    the claimant), 36 (the QA-branch ask), 38 (foreign cases hands-off), 39, 40, 41, 43, 44 and 46.
46. **EVERY SUITE SHIPS ITS DELIBERATE-DECISIONS / ANTICIPATED-CHALLENGE REGISTER (all projects).**
    **THE RULE:** every **deliberate non-authoring**, every case that **follows a PO ruling over spec
    text**, every **HELD / open / awaiting-answer** item, and every **accepted imperfection** is
    **WRITTEN DOWN — with its evidence and a plain one-sentence answer — BEFORE anyone asks.** The
    register ships **with** the suite, as a required deliverable of every authoring, audit,
    reconciliation and push pass; a suite delivered without one is incomplete.
    **REQUIRED CONTENT, per entry (all six fields, every entry):** **(1)** the decision, in plain
    layman words (Rule 7); **(2)** the **plain one-sentence answer** a non-technical reader can paste
    straight into a public channel; **(3)** the **evidence** — document, version, anchor, date (Rules
    20/25); **(4)** the **affected cases** with internal ID **and** C-id **and**
    `https://shopview.testrail.io/index.php?/cases/view/<id>` link (Rule 8); **(5)** **who can close
    it** (PO / QA lead / dev / a live check); **(6)** an honest **RISK rating** — and read that column
    honestly: **HIGH does not mean we are wrong, it means if this is raised publicly we have a
    concession to make, not just an explanation.**
    **THE CATEGORIES TO SWEEP** (walk all of them; "none" is a valid entry, omission is not):
    requirements not authored **because the spec contradicts itself** · cases that **follow a PO ruling
    over the spec text** · requirements **deliberately not authored for other reasons** · items **open,
    awaiting a PO or dev** · things that **cannot be settled without a live build** · **foreign-case
    overlaps** (Rule 38/45a) · **known imperfections accepted or scheduled**.
    **HONESTY CLAUSE:** the register records what we **decided**, never what we **wish we had
    decided**. A defect discovered late goes in as a defect — dated, with the cost stated — not
    re-labelled as a deliberate choice. **Back-dating a miss into the register is the one thing that
    would make it worthless.**
    **RATIONALE:** the QA lead must **never be blindsided in a public channel by a decision we made on
    purpose**, and — the sharper half — **an undocumented deliberate omission is indistinguishable from
    a miss.** On 2026-07-31 entry **N2** of
    `build/report-suite/chris-answers-2026-07-31/DELTAS.md` was written in the exact register of a
    considered decision — a numbered NO-CHANGE entry, seven case ids, a stated reason — and was an
    **error**; nothing in the deliverable let a reader tell the two apart, because no NO-CHANGE verdict
    was required to show its working (now Rule 45(e)). Canonical examples:
    `build/report-suite/coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md` (Report Suite, 474
    cases — 7 categories, risk profile HIGH 3 · MEDIUM 7 · LOW 25) and the cross-project
    `build/qa-preemptive-answers-2026-07-31/`. Ties to Standing Rules 6, 7 (plain layman wording), 8
    (always give the C-id + link), 12, 17, 20, 25, 28 (a required audit deliverable), 33, 36 (the
    outstanding register is its waiting-on-others sibling), 38, 43 and 45.
47. **TEST-RUN SCOPE — we keep OUR ACTIVE projects' runs COMPLETE, and IGNORE every other run
    entirely (all projects).** **IN SCOPE = the runs of the projects we are actively working, and
    only to keep them COMPLETE:** every ACTIVE case in that project's suite must be present as a
    test in that project's execution run. The three active runs are **Filters run 352 · Schedule
    run 357 · Reports Suite run 359**. Keeping them complete is a **STANDING DUTY, re-checked
    whenever cases are added, edited or retired** — not a one-off task (this is the scoped
    application of Rule 34).
    **METHOD — UNION-ONLY, per Rule 34:** `update_run` **REPLACES** the run's selection, so a
    partial `case_ids` list **DELETES the omitted tests AND their recorded results**. Therefore:
    **SNAPSHOT `get_tests` + `get_results_for_run` BEFORE any write**, send the **FULL UNION**
    (`sorted(set(current) | set(new))`), then **VERIFY AFTER** — test count equals the expected
    figure and **every prior result is still present**. Record the run's test count before→after in
    the audit log. Run writes still need the user's explicit authorization (Rule 6).
    **OUT OF SCOPE — IGNORED ENTIRELY:** runs belonging to **other projects**, to **COMPLETED
    projects (run 324 Fees & Discounts · run 325 Simple Flow)**, or **created by another author for
    work we are not doing** — specifically **run 278 (Vladimir Tomovic's Custom Permissions run)**.
    Ignored means **not synced, not written to, and NOT AUDITED for missing cases**: we do not
    measure ourselves against them and we do not produce gap reports about them.
    **WHAT OUR COVERAGE IS MEASURED AGAINST:** the **CASE SUITE under our group** — **never** anyone
    else's run selection. A foreign run's contents are **not evidence about our suite**; if a
    reviewer reports cases "missing" from their run, **that run's selection is theirs to manage**,
    and the honest answer is to point at the suite (Rule 8: internal ID + C-id + link).
    **DISTINCT FROM RULE 38:** foreign **CASES** are governed by Rule 38 (report, never touch);
    this rule governs foreign **RUNS**. **Both stand** — neither weakens the other.
    **RATIONALE, 2026-07-31:** the QA lead ruled *"ignore any test run which is not created by Bilal
    Muzamil"*, then **clarified the same day** that the three active projects' runs must still
    contain **every** test case, *"like it happened with filters yesterday"* — a frozen run selection
    on Filters 352 made a reviewer see coverage gaps that **did not exist**. **The earlier blanket
    "ignore all foreign runs" reading was CORRECTED by him; both instructions are recorded here so
    neither half is lost.** Canonical papers: `build/testrail-run-sync-2026-07-31/` (`RUN-SYNC-AUDIT.md`,
    `RUN-278-DECISION.md` — now SUPERSEDED/out-of-scope, `RUN-COMPLETENESS-CHECK-2026-07-31.md`).
    Ties to Standing Rules 6 (no TestRail write without permission), 8, 12 (a completeness check not
    run is NOT VERIFIED), 17 (100% of the case list, no sampling), 32/33 (latest ruling wins), 34
    (the sync mechanism this scopes), 36 and 38.
48. **NEVER say "waiting on you" or "frozen by your ruling" without the CONTEXT — quote the ruling,
    date it, and say whether it was right (all projects).** USER DIRECTIVE (2026-07-31, verbatim):
    *"SO when you say that something is waiting on me or forzen by my own ruling always give a
    context with that too just like you gave this context: 'The ruling was yours, two messages ago.
    I asked what it would take to apply each staged group, and you answered: "Lets wait for Brankos
    answers." So they're frozen deliberately — and it was the right call, because applying them
    means asserting behaviour no written source supports.'"*
    **THE RULE:** whenever a deliverable, status report, chat reply, register row or OUTSTANDING
    section states that something is **blocked on the QA lead**, **frozen by his ruling**,
    **awaiting his authorisation**, or **held by a decision he made**, it MUST carry **ALL FIVE** of
    the following — **never a bare "awaiting your decision"**:
    **(1) WHICH RULING** — quote his words **VERBATIM**. **Rule 25 applies to his instructions
    exactly as it does to a spec.**
    **(2) WHEN he gave it, and IN WHAT CONTEXT** — what question he was answering; a ruling read
    without its question is easy to misremember as arbitrary.
    **(3) WHAT IT BLOCKS, concretely** — the **named cases** (internal ID + C-id +
    `https://shopview.testrail.io/index.php?/cases/view/<id>` per Rule 8), the deliverable, or the
    **specific coverage claim we cannot make**.
    **(4) WHY THE RULING WAS REASONABLE** — or, honestly, **what has CHANGED since that makes it
    worth revisiting.** The point is that he can **re-read his own decision and see the reasoning
    without reconstructing it**. **Never imply his ruling is the obstacle when it was the correct
    call**; and **never quietly carry a stale ruling forward when new information has superseded it
    — say so.**
    **(5) WHAT WOULD UNBLOCK IT** — the **single specific thing** needed, and **from whom**.
    **THE UNDERLYING PRINCIPLE, PLAINLY: A RULING IS A SOURCE, AND SOURCES GET CITED.** We already
    require this for specs, PO answers, tickets and designs (Rules 20/25/32); **the QA lead's own
    decisions are held to the same standard.** **A blocked item with no cited ruling is
    indistinguishable from us having forgotten to do the work** — the same failure mode **Rule 46**
    exists to prevent for deliberate omissions.
    **RATIONALE, 2026-07-31:** a status line said *"roughly 15 changes are queued but frozen by your
    own ruling"* **without naming the ruling, its date or the cases**, and the QA lead had to ask
    *"Which ruling and what are those cases?"*. When the context **WAS** given — the ruling quoted,
    the question it answered, and why it was the right call — he directed that **this become the
    standard for every such statement**. Canonical examples: the Filters frozen-items row and the
    completed-runs row of `build/OUTSTANDING-ITEMS-REGISTER.md`. Ties to Standing Rules 7 (plain
    layman wording), 8 (always give the C-id + link), 12 (observed, never inferred), 25 (verbatim
    citation of the source), 32 (latest source wins), 33 (authority precedence — a ruling outranks a
    reviewer claim, which is exactly why it must be citable), 36 (the outstanding register carries
    these five fields for QA-lead-blocked items) and 46 (an undocumented deliberate decision is
    indistinguishable from a miss).
49. **A NON-FINAL BUILD yields PROVISIONAL findings ONLY — record the build marker, queue every
    finding for re-check, and never report a suite VIU-complete against it (all projects).**
    USER DIRECTIVE (2026-08-03, verbatim — on the Report Suite QA branch `sv8582`): *"they have also
    told they this QA Branch is also not final they are still working on it. So whatever you change
    from it, make sure that you will have to recheck it in future to ensure that what you had learned
    from this QA branch is still true or if that has been changed."*
    **THE RULE:** when a build/branch/environment is declared **NOT FINAL** by engineering, the PO or
    the QA lead, **every** observation taken from it — a captured on-screen label, a column order, a
    calculation result, a permission verdict, a PASS/DEVIATION call — is **PROVISIONAL**, not settled.
    A provisional finding may still be acted on (wording corrections, verdicts, staged pushes), but it
    is **never treated as durable truth** and it is **never allowed to look durable**.
    **THE FOUR OBLIGATIONS (all four, every time):**
    **(1) RECORD THE BUILD MARKER.** Capture a concrete, re-readable identifier of the exact build
    observed and put it in the deliverable: the app's version string (ShopView SPA:
    `<meta name="app-version">` in `index.html`, e.g. `v3.4.1-0ed4433`), plus a corroborating marker
    (`last-modified`/`etag` on `index.html`, or the API's `x-request-id`/server banner) and the
    **UTC timestamp of observation**. **Without a build marker a "re-check" is meaningless — you
    cannot tell whether the build changed.**
    **(2) OPEN A DATED RE-CHECK QUEUE — the same mechanism as the Rule-35 design-fetch queue.**
    One file per pass, `RECHECK-QUEUE.md`, inside that pass's dated folder, with a **status header of
    OPEN or CLOSED** and **one row per case touched or verdicted**, each carrying: internal ID · C-id ·
    the `https://shopview.testrail.io/index.php?/cases/view/<id>` link (Rule 8) · **what was observed**
    · **what was changed or concluded** · the **date + build marker** · and the **re-check obligation**
    (what specifically must be re-confirmed when the build settles). **Honesty about the mechanism
    (as with Rule 35): there is NO background scheduler — the queue is a committed, dated file plus
    the mandatory check below.**
    **(3) STAMP THE PROVENANCE ON THE CASE ITSELF** — in the **notes/metadata layer, never the
    tester-facing fields** (Rules 9/20): the observation came from a **non-final build**, naming the
    build marker and the date. A future reader must not mistake a provisional label for a confirmed
    one. **THE MECHANISM FOR THIS IS STANDING RULE 54 (added 2026-08-04): the case's PROVENANCE LINE
    under Expected Results IS where the build marker lives on the case** (this project has no Notes
    field) — and **since Rule 54's 2026-08-05 amendment it lives SPECIFICALLY IN SENTENCE 2 ("Last
    checked against build … on …"), NEVER IN SENTENCE 1, which names DOCUMENTS ONLY: a non-final build
    is only ever a RECORD OF WHAT WAS CHECKED, never a source of the expectation (Rules 54/57), so a
    provisional observation must not be written as though the build supplied the requirement** — and
    **re-stamping that line is part of re-running the queue** below — a row re-checked
    without its provenance line re-stamped is not re-checked.
    **(4) NEVER CLAIM COMPLETENESS.** No suite, report, deliverable, tally or status line may be
    described as **VIU-complete / verified / current** on a non-final build **without stating that the
    build was non-final and naming the OPEN queue**. This is the Rule-31 SOURCE-CURRENCY logic applied
    to the *build* as a source: a non-final build is at best **PARTIAL**, and a PARTIAL source must
    name its exact shortfall.
    **WHEN TO RE-RUN THE QUEUE:** at **every session start** for that project (alongside the Rule-35
    design-queue check), **before and after any work on that project**, and **immediately** when the
    build is declared final, a deploy is detected (the app-version marker changed, or a session dies
    early — cookies on these estates die at ~24h **or on deploy**), or the QA lead asks — **but see
    WHAT THE QUEUE COVERS below: since 2026-08-06 these triggers apply to the queue's SCOPED rows, not
    to every verdict in the suite.** Re-check each
    row against the new build, **flip it to CONFIRMED or CHANGED with fresh evidence**, and only close
    the queue when **100% of rows are re-verified** (Rule 17 — no sampling, no "the important ones").
    **WHAT THE QUEUE COVERS — SCOPED 2026-08-06 BY STANDING RULE 61. THIS NARROWS THE ROWS, NEVER THE
    BAR.** *"A redeploy triggers a re-check of every finding"* is **RETIRED as the default**: an
    **AUTOMATED** case is now monitored **by the suite itself** — its next run reports a fix that has
    shipped (Rule 61 outcome 3) or a failure that has CHANGED (outcome 2) **without anyone
    re-observing it**. **The queue therefore carries what the suite CANNOT see: every
    `AUTOMATION: HOLD` case, every case that was NEVER OBSERVED at all, and any case whose verdict was
    never automated** — and **their trigger is the thing they are actually waiting on**, not a deploy.
    **THE CLOSE CONDITION IS UNCHANGED — 100% of the queue's rows re-verified, no sampling** — and **a
    row is NOT re-verified by the existence of a passing automated run unless that run ACTUALLY
    EXERCISES it** (Rules 12/50). **THE PROVISIONAL LABELLING ABOVE IS LIKEWISE UNCHANGED:** a case an
    automated suite watches is still a case observed on a **non-final build**.
    **AN OPEN QUEUE IS THEREFORE THE NORMAL STEADY STATE of an active project, not a failure —
    Rule 60(c) explains WHY this close condition will rarely be met on branches that are never declared
    final; it does NOT lower it, and Rule 60 may never be cited to close a queue with rows unverified.**
    **A row that flips to CHANGED is a finding in its own right** and is reported, not quietly
    corrected.
    **⇒ AMENDMENT, 2026-08-10 — FINALITY CAN ARRIVE *PER REPORT*, AND THIS RULE DID NOT CONTEMPLATE A
    PARTIAL ANSWER. THE FIRST FINALITY ANSWER THIS RULE HAS EVER HAD IS A PARTIAL ONE.**
    **⚠️ THE THREE-AND-THREE SPLIT BELOW WAS SUPERSEDED ON 2026-08-11 — ALL SIX REPORTS ARE NOW HANDED
    OFF AND THE BRANCH IS FINAL. The block is kept verbatim and dated, not overwritten (the Rules
    31/52/53 pattern), so the record shows WHEN each half became final rather than implying it always
    was. Read the 2026-08-11 amendment immediately after it before quoting any of these lists.**
    **USER DIRECTIVE (2026-08-10, verbatim):** *"If you are referring to the Reports branch, they have
    released just those reports which I mentioned in my previous comments so the branch is final for
    those reports only, the remaining reports are yet to be handed of to the QA. Once all 6 reports are
    handded of to the QA only then we can consider the branch as final."*
    **SO FINALITY IS A PER-REPORT PROPERTY ON THE REPORT SUITE BRANCH, NOT A BRANCH-WIDE ONE:**
    **· FINAL (handed off to QA): WORK IN PROGRESS · TECHNICIAN UTILIZATION · SALES BY CUSTOMER.**
    Findings on these are **NO LONGER PROVISIONAL PENDING DEVELOPMENT** — **a deviation here is a real
    defect in a finished feature.** **Rule-49 queue rows for these three MAY CLOSE as each case is
    re-checked**, on the ordinary close condition (the row re-verified with fresh evidence — the bar is
    not lowered, only the *"wait for the build to settle"* blocker is removed).
    **· NOT FINAL: SALES BY REPRESENTATIVE · PARTS VELOCITY · INVENTORY VALUE.** **Unchanged** — still
    provisional, queue rows **stay open**, awaiting hand-off to QA.
    **· BRANCH-WIDE FINALITY REQUIRES ALL SIX**, in his own words: *"Once all 6 reports are handded of
    to the QA only then we can consider the branch as final."*
    **⚠️ THE HONEST CAVEAT — WRITE IT DOWN OR IT WILL BE MISREAD. "FINAL" MEANS HANDED OFF /
    FEATURE-COMPLETE. IT DOES *NOT* MEAN "THE CODE WILL NEVER CHANGE."** The branch **can and will
    redeploy** — not least **to fix the very defects we are reporting**. Therefore:
    **· A REDEPLOY STILL INVALIDATES THE LABELS AND THE PASS/FAIL VERDICT (Rule 60, layers 1–2) EVEN ON
    A FINAL REPORT.** The build marker on each case still has to be honest, and Rule 54 sentence 2 still
    records when it was last checked.
    **· WHAT FINALITY REMOVES IS A DIFFERENT DOUBT ENTIRELY: the ambiguity about whether a gap is an
    UNFINISHED FEATURE or a DEFECT.** On those three it is a **defect**. That is the whole value of the
    distinction — the previous passes could not tell the two apart, so every verdict carried a hedge,
    and **on these three that hedge is now WRONG and keeping it would understate real findings.**
    **THIS REFINES STANDING RULE 60, WHOSE HEADLINE SAYS THE BUILD WILL NEVER BE DECLARED FINAL — that
    was TRUE WHEN WRITTEN (2026-08-05) and is now TRUE ONLY PER-REPORT.** Rule 60's own wording is kept
    visible and dated rather than overwritten (the Rules 31/52/53 pattern), with a cross-reference at
    its head. **Nothing in Rule 60's strategy is discarded** — the layer split is exactly what makes a
    per-report finality answer usable at all.
    Contemporaneous write-up:
    `build/report-suite/full-viu-2026-08-06/RULINGS-2026-08-10-CREATION-HOLD-AND-FINALITY.md`.
    **⇒ AMENDMENT, 2026-08-11 — THE CONDITION HE SET ON 2026-08-10 IS NOW SATISFIED: ALL SIX REPORTS
    ARE HANDED OFF, SO THE REPORT SUITE BRANCH IS FINAL. THIS SUPERSEDES THE THREE-AND-THREE SPLIT
    ABOVE, WHICH IS KEPT VISIBLE AND DATED.**
    **USER DIRECTIVE (2026-08-11, verbatim):** *"note that ALL 6 reports have been handed off now."*
    **THAT SATISFIES THE CONDITION HE HIMSELF SET THE DAY BEFORE, in his own words:** *"Once all 6
    reports are handded of to the QA only then we can consider the branch as final."*
    **SO, AS OF 2026-08-11:**
    **· FINAL (handed off to QA) — ALL SIX: WORK IN PROGRESS · TECHNICIAN UTILIZATION · SALES BY
    CUSTOMER · SALES BY REPRESENTATIVE · PARTS VELOCITY · INVENTORY VALUE.** The three that were
    already final became so on **2026-08-10**; the other three on **2026-08-11**.
    **· THE BRANCH IS FINAL**, the condition having been met in full.
    **· FINDINGS ON ALL 476 REPORT SUITE CASES ARE NO LONGER PROVISIONAL PENDING DEVELOPMENT — a
    deviation is a REAL DEFECT IN A FINISHED FEATURE, on any of the six.**
    **· RULE-49 QUEUE ROWS FOR THE REPORT SUITE MAY CLOSE as each case is re-checked**, on the
    **ORDINARY CLOSE CONDITION** — the row re-verified with fresh evidence. **THE BAR IS NOT LOWERED**;
    only the *"wait for the build to settle"* blocker is removed, and **Rule 60 may still never be
    cited to close a queue with rows unverified.**
    **⚠️ THE HONEST CAVEAT CARRIES FORWARD UNCHANGED AND MUST BE REPEATED, BECAUSE IT WILL OTHERWISE
    BE MISREAD: "FINAL" MEANS HANDED OFF / FEATURE-COMPLETE. IT DOES *NOT* MEAN "THE CODE WILL NEVER
    CHANGE."** The branch **can and will redeploy** — not least **to fix the very defects we are
    reporting** — so **A REDEPLOY STILL INVALIDATES THE ON-SCREEN LABELS AND THE PASS/FAIL VERDICT
    (Rule 60, layers 1–2) ON EVERY ONE OF THE SIX.** The build marker on each case still has to be
    honest, and Rule 54 sentence 2 still records when it was last checked. **What finality removes is
    a DIFFERENT doubt entirely: the ambiguity about whether a gap is an UNFINISHED FEATURE or a
    DEFECT. On all six it is now a defect.**
    **🔴 THE HONEST CONSEQUENCE — THIS RAISES THE OUTSTANDING WORK, IT DOES NOT LOWER IT. Only the
    three previously-final reports are BUILD-VERIFIED — 225 of 476. THE OTHER 251 (SALES BY
    REPRESENTATIVE 112 · PARTS VELOCITY 71 · INVENTORY VALUE 68) HAVE HAD SOURCE ACCURACY DONE AND NO
    BUILD VERIFICATION AT ALL — and they are FINAL NOW, so their findings count for real.** Recorded
    in `build/OUTSTANDING-ITEMS-REGISTER.md`. **The QA lead has sequenced the work Schedule → Filters
    → Report Suite, so those 251 are QUEUED BEHIND THE OTHER TWO, not forgotten.**
    **⇒ AMENDMENT, 2026-08-11 (LATER THE SAME DAY) — ALL THREE BRANCHES ARE FINAL, NOT JUST THE REPORT
    SUITE. THIS EXTENDS THE AMENDMENT ABOVE TO SCHEDULE AND FILTERS; THAT BLOCK IS KEPT VERBATIM AND
    DATED, NOT OVERWRITTEN (the Rules 31/52/53 pattern), SO THE RECORD SHOWS WHEN EACH BRANCH BECAME
    FINAL.**
    **USER DIRECTIVE (2026-08-11, verbatim):** *"The Branches are Final now."*
    **THE WORD IS PLURAL, AND IT CAME IMMEDIATELY AFTER HE CONFIRMED ALL SIX REPORTS WERE HANDED OFF**
    — which had already made the Report Suite branch final on its own. **So this ruling EXTENDS
    finality to the other two.**
    **SO, AS OF 2026-08-11 (later):**
    **· FINAL — ALL THREE BRANCHES: SCHEDULE (`sv8685`) · FILTERS (`sv8785`) · REPORT SUITE
    (`sv8582`).** The Report Suite became final earlier the same day (all six reports handed off);
    **Schedule and Filters with this ruling.**
    **· FINDINGS ON ALL THREE SUITES ARE NO LONGER PROVISIONAL PENDING DEVELOPMENT — a deviation is a
    REAL DEFECT IN A FINISHED FEATURE, on any of them.**
    **· RULE-49 QUEUE ROWS MAY CLOSE ON ALL THREE**, on the **ORDINARY CLOSE CONDITION** — the row
    re-verified with fresh evidence. **THE BAR IS NOT LOWERED**; only the *"wait for the build to
    settle"* blocker is removed, and **Rule 60 may still never be cited to close a queue with rows
    unverified.**
    **· ⚠️ AN OPEN QUEUE IS NO LONGER "THE NORMAL STEADY STATE OF AN ACTIVE PROJECT."** That framing —
    written into this rule above, and kept there — was a **consequence** of branches that were never
    declared final. **That premise is now gone on all three, so the framing is RETIRED**; an open queue
    is once again a work list with an end.
    **⚠️ THE HONEST CAVEAT CARRIES FORWARD TO ALL THREE AND MUST BE REPEATED: "FINAL" MEANS HANDED OFF
    / FEATURE-COMPLETE. IT DOES *NOT* MEAN "THE CODE WILL NEVER CHANGE."** All three branches **can and
    will redeploy** — not least **to fix the very defects we are reporting** — so **A REDEPLOY STILL
    INVALIDATES THE ON-SCREEN LABELS AND THE PASS/FAIL VERDICT (Rule 60, layers 1–2) ON EVERY ONE OF
    THEM.** The build marker on each case still has to be honest, and Rule 54 sentence 2 still records
    when it was last checked. **What finality removes is a DIFFERENT doubt entirely: the ambiguity
    about whether a gap is an UNFINISHED FEATURE or a DEFECT. On all three it is now a defect** — and
    the evidence that this matters is already on the record: the Schedule branch redeployed to
    `v3.5-65d6500` on the morning of 2026-08-11, so no Schedule verdict rests on the build running.
    **🔴 THE HONEST CONSEQUENCE — THIS RAISES THE STAKES RATHER THAN CLOSING ANYTHING OUT. ACROSS THE
    THREE PROJECTS 433 CASES ARE FINAL BUT NOT BUILD-VERIFIED, AND THE RELEASE IS THURSDAY:**
    **· SCHEDULE 174** — build verification **in progress right now**; the last pass observed **0 of
    174** because the session died 14 minutes in
    (`build/schedule/build-verify-2026-08-11/BUILD-VERIFICATION.md`).
    **· FILTERS 8** — blocked on the **second non-administrator sign-in**, outstanding **since 5
    August** (`build/filters/build-verify-2026-08-11/RESUME.md`; the other 106 were checked against the
    running build).
    **· REPORT SUITE 251** — Sales By Representative 112 · Parts Velocity 71 · Inventory Value 68;
    **source-accurate, never build-verified** (`build/report-suite/source-accuracy-remaining-2026-08-11/RESUME.md`).
    **331 CASES ARE BUILD-VERIFIED** — Report Suite's first three reports (**225**) and Filters
    (**106**) — and **the arithmetic gates both ways: 433 + 331 = 764 = Schedule 174 + Filters 114 +
    Report Suite 476.**
    **⚠️ ARITHMETIC CORRECTION, RECORDED RATHER THAN QUIETLY FIXED (Rule 50 — a figure that fails its
    own gate is a finding):** this ruling was first framed as **"425 final but not build-verified /
    339 build-verified"**. **Those totals DOUBLE-COUNT THE 8 FILTERS CASES** — the same 8 appear as
    unverified in the first figure and as verified in the second (**433 − 8 = 425; 331 + 8 = 339**).
    **The per-project components were RIGHT and only the sums were wrong**; each component was
    re-derived from the committed evidence named above before the totals were restated.
    Recorded in `build/OUTSTANDING-ITEMS-REGISTER.md`. **The QA lead's sequencing (Schedule → Filters
    → Report Suite) is unchanged by this ruling** — what changed is that every one of the 433 now
    counts for real.
    **⇒ REFINEMENT, 2026-08-11 (LATER STILL) — WHAT "FINAL" MEANS, CONFIRMED FROM THE DEVELOPERS'
    OWN BEHAVIOUR. THIS CHANGES NO POLICY; IT CLOSES THE ONE MISREADING THIS RULE IS MOST EXPOSED TO.**
    **USER DIRECTIVE (2026-08-11, verbatim):** *"remember the developers said that those builds are
    final but they keep on pushing new builds as they fix a reported issue which they will keep on
    doing until the last bug for those projects is fixed."*
    **SO "FINAL" IS A STATEMENT ABOUT SCOPE, NOT ABOUT MOTION: it means FEATURE-COMPLETE AND HANDED
    OFF TO QA. IT HAS NEVER MEANT THAT THE CODE HAS STOPPED CHANGING, AND IT DOES NOT MEAN THAT NOW.**
    Deploys **will continue until the last bug is fixed** — and, pointedly, **each one is likely to be
    a fix for a defect WE reported**, so the busier we are the faster the build moves.
    **THE THREE CONSEQUENCES, ALL OF WHICH ALREADY FOLLOW FROM RULE 60'S LAYER SPLIT — nothing new is
    invented here:**
    **· A REDEPLOY STILL INVALIDATES LAYER 1 (the on-screen labels and the navigation path) AND LAYER
    2 (the pass/fail verdict), EVEN ON A FINAL REPORT.** Finality does not exempt a case from
    re-checking; **Rule 60(b) governs exactly as before.**
    **· WHAT FINALITY CHANGES IS THE MEANING OF A GAP.** On a not-final feature a missing control might
    be unfinished work; **on a final feature it is a DEFECT.** That is the whole value of the
    distinction, and it is why the old hedges now understate real findings rather than protecting us.
    **· BUILD STAMPS WILL KEEP GOING STALE BY DESIGN, AND THAT IS THE NORMAL STATE OF AN ACTIVELY-FIXED
    BRANCH — NOT A FAILURE OF OURS.** A Rule-54 sentence-2 marker naming a superseded build is an
    honest record of when the case was last checked (Rule 60(f)); it is **never** to be "fixed" by
    re-stamping a date nobody observed (Rule 12). **Already evidenced: the Schedule branch redeployed
    to `v3.5-65d6500` on the morning of 2026-08-11.**
    **⚠️ WHAT THIS DOES *NOT* DO, SAID EXPLICITLY BECAUSE IT IS THE TEMPTING READING: it does NOT
    re-open the "wait for the build to settle" blocker, and it does NOT return any verdict to
    PROVISIONAL-pending-development.** The branches are final; queue rows may close on the ordinary
    condition. **Nor does it lower the close condition — Rule 60 may still never be cited to close a
    queue with rows unverified.**
    **RATIONALE, 2026-08-03:** the Report Suite got its first QA branch (`sv8582`,
    `v3.4.1-0ed4433`) and 475 cases were finally live-verifiable — but engineering said the branch is
    still being worked on. Without this rule the suite would have been stamped "VIU-Verified" against
    a moving target, and every corrected label would have silently become "the truth" with no record
    of which build it came from and no trigger to re-confirm it. Canonical example:
    `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` (+ its build marker in
    `ACCESS-PROOF-2026-08-03.md`). Ties to Standing Rules 10/12 (VIU verdicts are live-observed, and
    a provisional observation is still an observation — it is its DURABILITY that is limited), 17
    (complete data in/out), 22 (ask for the live check + the environment/flag state up front), 25
    (cite the source verbatim — here, the build marker), 29 (the queue is committed to git, the only
    durable store), 31 (source currency — the build is a source), 35 (the design-fetch queue is the
    same due-dated-queue pattern), 36 (an OPEN queue is an outstanding item and belongs in the
    register), 46 (a provisional finding recorded as final is indistinguishable from a miss) and 61
    (**which scopes this queue to what an automated suite cannot see, without lowering its close
    condition or its PROVISIONAL labelling**).
    **⇒ CROSS-REFERENCE, 2026-08-12 — A BUG-FIX DEPLOY DOES NOT RE-OPEN A CLOSED ROW, AND IT IS NOT A
    QUEUE TRIGGER (Standing Rule 60's bug-fix-deploy amendment).** QA lead, verbatim: *"they are just
    fixing the reported bugs … and not adding any functionality to the build, so that does not make
    your previous pass as stale."* **This rule already said a queue row's trigger is THE THING IT IS
    WAITING ON, not a deploy** — the amendment extends the same logic to a whole pass, so **a row
    re-verified before a bug-fix-only deploy STAYS re-verified** and the marker moving underneath it
    does not push it back onto the list. **THE CLOSE CONDITION IS NOT LOWERED BY ONE INCH: 100% of a
    queue's rows re-verified, no sampling, and a row that was NEVER observed is still unobserved
    (Rules 12/17/50).** **A deploy that ADDS OR CHANGES FUNCTIONALITY is a different matter entirely
    and re-opens what it actually touched, per Rule 60 practice (b) as written.**
50. **VERIFY EXHAUSTIVELY — "byte-level" means NOTHING is skipped, sampled, or assumed (all
    projects).**
    USER DIRECTIVE (2026-08-04, verbatim): *"Also remember, the verification should always be
    byte-level verification"* — **CLARIFIED by him the same day, verbatim:** *"When said byte-level
    verification I meant not to miss anything when you are verifying something."*
    **So this rule is PRIMARILY about EXHAUSTIVENESS, and only secondly about mechanical exactness.
    Read Part 1 first: "byte-level" is his phrase for MISS NOTHING.**
    **PART 1 — EXHAUSTIVE (the primary meaning).** When we verify anything, **we verify ALL of it.**
    **No sampling. No "representative subset". No spot-check standing in for a population. No "the
    important ones". No stopping at the first confirming example.** Concretely:
    · verifying a **suite** means **EVERY CASE**, not a sample
    · verifying a **case** means **EVERY FIELD** — title · preconditions · every step · every
    expected result · refs · section · type · notes — **not only the field we came to change** (this
    is the mechanism of Rule 41)
    · verifying **coverage** means **EVERY REQUIREMENT in the spec**, in **BOTH DIRECTIONS**
    (requirement→case and case→requirement), with the **totals reconciled** — **a partial extraction
    is an UNFINISHED JOB, not a "partial pass"**
    · verifying a requirement that **spans surfaces** means **EVERY SURFACE** (Rule 40) and **EVERY
    ASSERTION within it** (Rule 45(e))
    · verifying a **permission** means **EVERY ROLE**, in **both directions** (granted → allowed, and
    not-granted → refused)
    · verifying an **export** means **EVERY FORMAT and EVERY VIEW**, and **reading the file's actual
    CONTENT** — not merely that a download occurred
    · verifying **counts** means **SET EQUALITY BOTH WAYS**, **never matching totals**
    · verifying a **REPRODUCTION** means **NAMING EVERY PIECE OF TEST DATA IT DEPENDS ON** — the canned
    line, customer, contact, part, asset, work-order state, location, role/user and date range, each by
    its exact on-screen name, plus **which values were tried and ruled out**. *"Create a work order with
    a canned line"* is **not exhaustively specified**; *"add canned line **HD CVIP air brake trailer
    single/tandem**"* is. **An unnamed variable is an unverified variable** — the reader picks a different
    one, gets a different result, and closes the ticket (SV-8821, 2026-08-04: the QA lead could not
    reproduce it because our steps named no canned line, and the real condition turned out to be a
    missing CONTACT, not the canned line at all). Format requirement:
    `build/APP-ACTIONS-PLAYBOOK.md` § "HARD REQUIREMENT ON SECTION 3 — NAME THE EXACT TEST DATA".
    **IF THE POPULATION IS LARGE, THAT CHANGES THE SCHEDULE, NOT THE SCOPE:** batch it, checkpoint it
    (Rule 29), and **FINISH it**. **State the EXACT number verified and the EXACT remainder** — and
    **never let a sample be reported in language that implies the whole** (Rules 12/17).
    **A SAMPLE IS ONLY EVER ACCEPTABLE WHEN THE QA LEAD EXPLICITLY ASKS FOR ONE** — and then the
    deliverable must **say plainly that it IS a sample, of what size, out of what population**.
    **PART 2 — EXACT (the mechanical half).** Where a comparison is possible, make it **BYTE-LEVEL**,
    never by eye, never by "looks right", never by a substring/`contains` check, never by a matching
    total: **every TestRail write** re-GET and compared **field by field against the intended
    payload**, with **every field we did NOT intend to change proven BYTE-IDENTICAL to its pre-write
    snapshot** (that is how collateral damage is caught, and it is the half a "200 OK" can never tell
    you) · **every claimed NON-WRITE** proven by a **byte-identical snapshot INCLUDING `updated_on` /
    `updated_by`** — *"we didn't write to it"* is an **assertion**, a byte-identical snapshot is
    **evidence** (this is how a foreign case is proven untouched, Rule 38) · **import headers HASHED**
    against their peer projects, id-map zero blanks, no duplicate titles, no leaked internal IDs ·
    **spec mirrors BYTE-COMPARED against the live fetch** (or the exact differing lines enumerated) —
    **never trusted by version number alone**, which is exactly Rule 31's staleness trap · **every
    prior run result verified PRESENT BY ID** (Rules 34/47).
    **ON A MISMATCH: THE WRITE FAILED.** **STOP the batch, do NOT proceed to the next operation**,
    report it with **BOTH byte sequences** — **never retry blindly, never log it as success**.
    **THE HONEST CAVEAT — DECLARED NORMALISATIONS.** A server may legitimately **transform** a value
    on write, so a raw byte compare can differ **for a correct write**. Accept that **ONLY when it is
    a KNOWN, RECORDED behaviour**, and then **assert it EXPLICITLY as the expected transformation** —
    **never wave it away as "close enough"**. The one recorded for us: **TestRail's `refs` field
    splits on commas, trims each entry, and rejoins with a bare comma, and rejects any single entry
    over 248 characters with HTTP 400 `Field :refs does not match the required pattern.` — a PATTERN
    error, not a length error** (248 passes, 249 fails; total length unbounded; our house style is
    **one comma-free entry ≤ 248 chars**), so `refs` is verified under
    `','.join(p.strip() for p in s.split(','))`, declared as such in the log. **Any NEWLY discovered
    normalisation must be PROVEN and RECORDED in `build/APP-ACTIONS-PLAYBOOK.md` §J, with its
    evidence, BEFORE it may be relied on** (Rule 27 — the books are the shared brain; an undeclared
    normalisation is indistinguishable from a silent write failure).
    **EVIDENCE DUTY:** keep **the pre-write snapshot AND the post-write re-GET**, and record **per
    operation** in the audit log: **the operation · the target C-id · the HTTP status · the
    verification result**. **An audit log that records only "200 OK" is NON-COMPLIANT.**
    **RATIONALE, 2026-08-04 — and the honest part is that the shortfalls are OURS.** The QA lead
    requires **zero risk of error on the Report Suite**, and our own recent work **passed the exact
    half while FAILING the exhaustive half**: the independent certification pass **spot-checked 25 of
    895 requirements and cold-read 24 of 475 cases** while reading as a certification **of the
    whole**; a coverage re-derivation extracted **856 of ~895** anchors and was reported as
    *"partial"* **rather than finished**; and an earlier VIU pass reported **86 of 475** cases
    verified with **243 only "partly observed" and 124 untouched**, which the QA lead **rejected**.
    Meanwhile the **exact** half is what caught the real dangers: a **`refs` normalisation** that
    would otherwise have read as a failed write; a run holding **539 result records** when the staged
    plan said zero — where a partial `case_ids` list would have **destroyed them** (Rule 34's
    union-only law); and **foreign cases proven untouched** by comparing their timestamps.
    **Both halves are the rule; neither substitutes for the other.**
    Ties to Standing Rules 8 (the C-id names the target), 10 (the VIU push step), 12 (observed, never
    inferred — this is its mechanical form), 17 (complete data in/out — **this rule is its
    verification-side twin**), 25 (quote the bytes, verbatim), 28 (score 100% of the cases, no
    sampling), 34 and 47 (run-sync before/after), 40 (every surface), 41 (the whole-case re-read, and
    untouched fields proven byte-identical), 45 (both directions, and one row per assertion), 48 (a
    claim carries its evidence) and 49 (a provisional finding is still verified exhaustively and
    exactly — its *durability* is what is limited, not its rigour).
    **⇒ DATED ADDITION, 2026-08-17/18 (QA lead, approved with "Add") — AUDIT FROM LIVE, NOT FROM
    SELF-REPORTS.** When auditing whether cases were changed — or in ANY after-the-fact verification —
    establish the truth from **LIVE TestRail + the git history of the case source**, NEVER from a
    worker's own summary / oplog self-report. A pass's own account of what it did is a **hypothesis**,
    not evidence (the same principle as the killed-pass recovery discipline, Rule 29). This is the
    mechanical twin of the "verify by content, never by `updated_on`" half above, extended to a pass's
    own claims. **Context:** the 2026-08-17 Automated-marker audit found a prior pass's *"FOR VLAD:
    None"* self-report was **WRONG** — it had in fact edited two `custom_atmstatus == 3` (Automated)
    cases; **live verification caught it**, and the miss would have starved the Rule-65 tell-Vlad
    report. Ties to Standing Rules 12 (observed, never inferred), 29 (killed-pass recovery from live
    content), 38 and 65 (the tell-Vlad report must be derived from live, or it under-reports), and 71
    (protect Automated cases — the audit that surfaced this).
51. **NEVER file an API-related ticket without ASKING — every time, even inside an approved batch (all
    projects).**
    **⚠️ SUBSUMED BY STANDING RULE 62 (2026-08-10) — ASKING IS NOW UNIVERSAL, NOT SPECIAL TO API
    TICKETS: NO Jira ticket of ANY type may be created without the QA lead's explicit permission, asked
    for and granted first. THIS RULE STANDS UNCHANGED — its reachability test still classifies a finding
    and decides how to present it, and its withdrawal procedure still applies — but it is no longer the
    exception to an otherwise-permitted filing; it is one instance of the general case. See Rule 62.**
    USER DIRECTIVE (2026-08-04, verbatim): *"do not create the tickets which are related to API , if
    there are any ASK me (ask again if I have previously given a go ahead for the API tickets with the
    Non API tickets) and create them ONLY if I ask you to create them"*.
    **THE RULE:** an **API-related defect is NEVER filed on our own initiative.** It is **ASKED ABOUT
    SEPARATELY and filed ONLY if the QA lead explicitly says to file it.** **A BATCH APPROVAL DOES NOT
    COVER AN API ITEM** — the parenthesis in his directive is the whole point: *"ask again if I have
    previously given a go ahead for the API tickets with the Non API tickets"*. So *"file these six"*
    is **NOT** authorisation for the API one among the six; **ask again, naming it.** Silence is not
    consent, and an earlier yes to the batch is not a yes to the API item.
    **HOW TO JUDGE WHETHER A FINDING IS API-RELATED (the test, in one line):** **if the defect is
    invisible to a user AND to a manual tester — reachable only by calling an endpoint directly with a
    request the product's own screens never send — it is API-RELATED.** **If the same failure ALSO
    occurs through the product's own screens, it is a USER-FACING defect** that merely happens to be
    *characterised* technically (a 500 in the response is technical *evidence*; it is not what makes
    the ticket API-related). Judge by **reachability from the product**, never by whether our evidence
    happens to be an endpoint capture.
    **METHOD (so the split is visible BEFORE anything is filed):** **(1)** every defect pack **LISTS
    API-RELATED FINDINGS IN THEIR OWN SEPARATE SECTION**, with the reachability reason stated per item
    — a dated `API-SPLIT.md` beside the pack is the canonical vehicle (`build/report-suite/
    defect-pack-2026-08-04/API-SPLIT.md`). **(2)** the ask goes to the QA lead **separately from the
    non-API batch**, in plain layman words (Rule 7): what the defect is, that it cannot be reached from
    any screen, and the explicit question *file it or not?* **(3)** nothing is filed until he answers.
    **(4)** if an API ticket was already filed before this rule was known, **withdraw it on his ruling**
    — **CLOSE it via a workflow transition with a plain-language closing comment, NEVER DELETE it**
    (a withdrawn ticket with its reasoning on the record is worth more than a deleted one, and deletion
    is irreversible); set **priority Medium first** (Rule 53) so it does not sit closed at the wrong
    priority; and **keep the underlying finding written up in the defect pack** — we withdraw the
    *ticket*, we do not discard the *finding*.
    **TIE TO RULE 24 (read them together):** Rule 24 already says **front-end blocks + back-end/API
    allows = a PASS, not a defect.** This rule is its filing-side sibling: even where an API-only
    behaviour is a genuine hardening opportunity rather than a Rule-24 pass, **it is still not ours to
    raise unasked.** Between them: an FE-gated/BE-allowed action is **not a defect at all**, and an
    API-only fault that IS a defect is **not a ticket without his say-so**.
    **RATIONALE, 2026-08-04 (the worked example that produced the rule — and it was our miss):**
    **SV-8822** *"Saving a customer returns a server error instead of a validation error when a
    sales-rep id is supplied"* was filed **inside the approved batch of six** defect tickets, because
    the batch had been approved as a whole and nobody separated out the API item. It is **API-only**:
    the fault is reachable only by sending the customer-save request directly in a shape the product's
    own dialog never produces, so **no customer and no manual tester can see it**. The QA lead then
    stated the rule above, and when asked, ruled verbatim: *"Yes Tickets related to API which you have
    already created can be withdrawn"* — so SV-8822 was **transitioned to OBSOLETE (resolution Done)
    with a plain-language withdrawal comment, not deleted**, while **SV-8821** (the create-invoice
    server error) **stayed OPEN** precisely because that one **also fails through the product's own
    screen** and is therefore user-facing despite its technical characterisation. **That contrast —
    8822 withdrawn, 8821 kept — IS the reachability test in practice.** Records:
    `build/report-suite/defect-pack-2026-08-04/API-SPLIT.md` + `FILED.md`. Ties to Standing Rules 1
    (never proceed without the complete input set — an unanswered ask is a missing input), 6 (nothing
    written to a system of record without permission), 7 (plain layman wording for the ask), 12
    (observed, never inferred), 24 (FE-blocks/BE-allows is a PASS), 36 (an unanswered ask is an
    OUTSTANDING item and belongs in the register), 48 (a blocked item cites the ruling that blocks it)
    and 53 (priority Medium).
52. **A defect ticket is filed as a `Story Defect` parented to the OWNING STORY — and because that story
    is itself a child of the epic, the defect STILL ROLLS UP TO THE EPIC (all projects; this SUPERSEDES
    the Bug-on-an-epic-parent convention of 2026-08-04, which is preserved below as dated history).**
    **⚠️ THE ROLL-UP HALF OF THAT HEADLINE IS FACTUALLY WRONG — CORRECTED 2026-08-06 BELOW; THE REQUIRED
    SHAPE IS UNCHANGED.**
    **🔴🔴 ⇒ AMENDMENT, 2026-08-12 — THE EVIDENCE BAR: A DEFECT TICKET WE FILE MUST BE UNCHALLENGEABLE.
    THIS IS THE MOST IMPORTANT CLAUSE IN THIS RULE. IT GOVERNS *WHETHER A TICKET IS FIT TO FILE AT ALL*,
    WHERE EVERYTHING ELSE IN RULE 52 GOVERNS ONLY ITS SHAPE — AND A CORRECTLY-SHAPED TICKET THAT FAILS
    THIS BAR IS EXACTLY THE TICKET THAT BIT US.**
    **USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec):** *"The Engineering manager had raised a concern
    over creating tickets which does not make sense, so we have to make sure that the defects or tickets
    which we create do NOT bite us like it did, and must have solid references for the expected behavior,
    and should have the annotated screenshots in them, but this is for the future but you have to amend
    your rule to make sure that the defects you create can not be challenged and should not bite me, they
    did badly bite me and my job is on threat due to that. However for now the Jira ticket creation is
    still on hold."*
    **🛑 READ HIS LAST SENTENCE BEFORE ANY OTHER PART OF THIS AMENDMENT: *"However for now the Jira ticket
    creation is still on hold."* THIS IS A RULE FOR THE FUTURE. THE CREATION HOLD AT RULE 62's TAIL
    REMAINS ACTIVE AND NOTHING IS FILED NOW.** He re-stated the hold **in the same breath** as raising the
    bar, so this amendment is **not** a signal that filing has resumed and must never be read as one. What
    it does is make sure that **when the hold lifts, the first ticket out of the door cannot be thrown
    back.**
    **THE BAR — EIGHT ITEMS. EVERY ONE IS CHECKABLE, DELIBERATELY: A RULE NOBODY CAN FAIL IS A RULE NOBODY
    FOLLOWS.** A ticket that cannot show all eight **is not ready to be put to him**, and saying so is the
    correct outcome (Rule 12 — never dress an unfinished case up as a finished one).
    **(1) THE EXPECTED BEHAVIOUR IS QUOTED VERBATIM FROM A NAMED SOURCE, WITH ITS VERSION AND ITS DATE.**
    The PRD with its **Confluence version number** (never the in-body one — Rule 31 trap (a)), an **epic
    story**, a **PO answer with its file and date**, the **design or Figma**, or the **technical design** —
    Standing Rule 57's list at (a)–(g). **IF THE EXPECTATION CANNOT BE QUOTED BACK TO A DOCUMENT, THERE IS
    NO TICKET.** **This single test is the one that would have prevented most of what went wrong**, and it
    is deliberately absolute: *"the build ought to behave this way"*, *"any reasonable product would"*,
    *"it is obviously wrong"* are **not sources**, and a ticket resting on one of them is precisely the
    ticket an engineering manager throws back as *not making sense* — **he would be right, and we would
    have handed him the argument.** This is **Rule 57 applied at the filing step**: expected behaviour
    comes from the document, never from what the build ought to do.
    **(2) ANNOTATED SCREENSHOTS.** The actual behaviour **captured and marked up** — arrow, box, caption —
    so a reader **sees the fault without reproducing it**. A bare screenshot is not an annotated one, and a
    file list is not an embedded image (playbook §"Filing a defect ticket" section 6). **⚠️ RECORDED
    HAZARD, AND IT HAS ALREADY COST US ONE IMAGE: EDITING A JIRA DESCRIPTION OVER THE REST API DESTROYS ANY
    PASTED IMAGE WHOSE `media` NODE IS NOT CARRIED FORWARD INTO THE NEW BODY, AND JIRA LOGS THE ADDITION BUT
    NOT THE DELETION** — so the loss is invisible in the changelog and provable only from a pre-write
    snapshot. **One image was destroyed this way on SV-8818 and is unrecoverable.** The working method, the
    node-lifting code and the read-only auditor are in `build/APP-ACTIONS-PLAYBOOK.md` §J declared hazard
    #4 (Rule 27 — do not re-derive it).
    **(3) EXACT, NAMED TEST DATA (Standing Rule 50).** Every **canned line · customer · contact · part ·
    asset · work-order state · location · role/user · date range**, named **exactly as it appears on
    screen** — **plus what was tried and RULED OUT**. *"Create a work order with a canned line"* is **not
    reproducible**; *"add canned line **HD CVIP air brake trailer single/tandem**"* is. **AN UNNAMED
    VARIABLE IS AN UNVERIFIED VARIABLE:** the reader picks a different one, gets a different result, and
    closes the ticket. **That is exactly how SV-8821 was bounced** — the QA lead could not reproduce it
    because our steps named no canned line, and the real condition turned out to be a **missing CONTACT,
    not the canned line at all.** **A ticket the reader cannot reproduce is a ticket that gets closed.**
    **(4) THE BUILD MARKER AND THE ENVIRONMENT.** The **app-version string** (`<meta name="app-version">`,
    e.g. `v3.5-16cf83f`), the **QA branch/URL and API host**, the **date and time observed**, and the
    **true viewing context** — *"desktop browser, signed in as an Admin"*, or whatever the role actually
    was. **State the role you were really in, not the role the case assumes** (Rule 12).
    **(5) A DUPLICATE SEARCH RUN FIRST, WITH THE QUERIES RECORDED.** Not *"we looked"* — **the JQL, in the
    ticket pack.** **Several tickets we filed already existed**, and a duplicate is the cheapest possible
    way to look careless in front of the people whose queue it lands in.
    **(6) THE SHAPE THE POs AND THE ENGINEERING MANAGER ASKED FOR, UNCHANGED** — **concise description ·
    steps of reproduction · current behaviour in plain words · expected behaviour in plain words · a line
    break, then the source.** This sits inside, and does not replace, the **seven-section format** in
    `build/APP-ACTIONS-PLAYBOOK.md` § "Filing a defect ticket" (which additionally pins Branch/Environment,
    Images and a LAST technical section); the seven-section format remains the mechanical layout, and item
    (6) is the **reader's** view of it. **The source block at the bottom is not optional** — his ruling,
    verbatim: *"Yes this source block MUST exist for every ticket you created."*
    **(7) A PRE-FILING SELF-CHALLENGE, WRITTEN DOWN.** Before filing, answer **in writing**: ***what is the
    strongest argument that this is NOT a defect?*** **If the honest answer is *"the source does not
    actually say that"* or *"I cannot reproduce it from my own steps"* — DO NOT FILE IT.** Record the
    challenge **and** the answer on the ticket or in the pack. **This is the hostile-reviewer lens of Rule
    45(c) moved to the filing step**, and it exists because the argument gets made either way: **either we
    make it first, in private, or the engineering manager makes it in public.**
    **(8) CHECK IT IS NOT A RULE-24 PASS.** A control **hidden in the UI while the API still allows the
    action is a PASS, not a defect** (Standing Rule 24). Filing one of those is **the literal definition of
    a ticket that "does not make sense"**, and it is an easy mistake to make from a network capture. **The
    inverse — the front end EXPOSING what the back end blocks — IS a defect** and stays filable.
    **AND CHECK THE OTHER THREE THINGS THAT MAKE A TICKET NONSENSE, because (8) is only the commonest:**
    **· a CLOSED ticket is NOT a spec change** (Rule 57) — the build failing a requirement whose ticket was
    closed *accepted* is still a deviation, but it needs the **expect-fail treatment (Rule 61), not a new
    ticket** · **· ticket status is never evidence about the build** (Rule 61) · **· an API-only finding is
    classified by Rule 51's reachability test and asked about separately**, whatever else is approved.
    **WHAT THIS DOES NOT CHANGE:** the **shape** (this rule's five fields), the **priority** (`Medium`,
    Rule 53), the **permission requirement** (Rule 62 — asked for and granted, **per ask**), or the **active
    hold**. **The bar is ADDITIONAL. It never licenses filing, and passing all eight is still not
    permission.**
    **⚠️ AND THE BAR APPLIES TO THE FIVE ALREADY-PREPARED REPORT SUITE DEFECTS BEFORE THEY ARE PUT TO HIM.**
    They were written under the old bar; **each must be re-checked against these eight and repaired or
    withdrawn before it is offered**, and any that cannot clear item (1) or item (3) **should be withdrawn
    from the pack rather than filed weaker** (Rule 46 — a deliberate non-filing is recorded, so it can never
    look like a miss).
    **RATIONALE, 2026-08-12 — AND THE HUMAN STAKES ARE PART OF THE RULE, NOT DECORATION. A FUTURE SESSION
    MUST UNDERSTAND *WHY* THE BAR IS THIS HIGH, OR IT WILL QUIETLY LOWER IT.** The engineering manager
    raised a concern about **tickets that do not make sense** — the same manager who, on **2026-07-27**,
    claimed our suites were *"serious AI slop"* and produced **Standing Rule 28**. This time the complaint
    landed on the **QA lead personally**, and his words are the record: ***"they did badly bite me and my
    job is on threat due to that."*** **That is the cost of a weak ticket, stated by the person who paid
    it.** Read it against Rule 62's own rationale, which is the same lesson from the other side: a ticket is
    **immediately visible to the whole engineering organisation** and **cannot be cleanly undone** — a
    withdrawn ticket stays on the record for good. **So a weak ticket does not cost us a correction; it
    costs him credibility, and credibility is what lets every other finding we raise be believed.** The
    asymmetry is the whole argument: **a finding held back for one more day of evidence costs nothing and is
    fully recoverable; a challengeable ticket cannot be recovered at all**, and it discredits the ninety
    good ones filed beside it. **When a future pass is tempted to file something on "it is obviously
    broken", the honest question is not "am I right?" but "can I prove it from a document, and can a
    stranger reproduce it from my own steps?" — and if the answer to either is no, the correct action is to
    hold it and say so.**
    USER DIRECTIVE (2026-08-05, verbatim): *"Also, make sure that whenever you create a ticket it should
    be attached to the parent ticket as its epic and that ticket should be created as STORY DEFECT"*.
    **THE REQUIRED SHAPE — five things, and no ambiguity between them:** **`issuetype` = `Story Defect`
    (10007)** · **`parent` = THE OWNING STORY** · **`priority` = `Medium`** (Rule 53, amended
    2026-08-06 — it was `Low` before that date) · **ALSO link the
    owning story `relates to`** · **DO NOT send Product Area** (`customfield_10153` does not exist on
    this issue type).
    **WHY THIS SATISFIES HIS INSTRUCTION, PLAINLY: the owning story is itself a child of the epic, so a
    Story Defect under that story still hangs off the epic** — the epic remains the ticket's home in the
    hierarchy, reached one level further down instead of directly. **A `Story Defect` CANNOT be parented
    to an Epic at all**, so a story parent is not a substitute for what he asked for; it is the only
    shape that delivers **both** halves of what he asked for.
    **⚠️ FACTUAL CORRECTION 2026-08-06 — THE ROLL-UP CLAIM IMMEDIATELY ABOVE IS WRONG IN JIRA'S QUERY
    MODEL. THE REQUIRED SHAPE IS UNCHANGED.** The two sentences above — the headline's *"because that
    story is itself a child of the epic, the defect STILL ROLLS UP TO THE EPIC"* and *"the owning story
    is itself a child of the epic, so a Story Defect under that story still hangs off the epic … the
    epic remains the ticket's home in the hierarchy, reached one level further down instead of
    directly"* — are **KEPT ABOVE AS THE CORRECTED CLAIM, NOT DELETED** (the same dated-history pattern
    this rule already uses for the superseded Bug-on-an-epic convention and Rule 53 uses for `Low`),
    because **a silently-erased wrong claim is how a future session re-derives the same mistake.**
    **MEASURED LIVE 2026-08-06, BY QUERY** (`build/ticket-type-audit-2026-08-06/TYPE-AUDIT.md`, commit
    `264cc25c`): **`parent = <epic>` returns 11 of our 14 `Bug`s and 0 of our 73 `Story Defect`s**, and
    **`parentEpic` is no help — it returns only the epic itself**. So a Story Defect is reachable from
    its epic **ONLY VIA A TWO-HOP JOIN (defect → story → epic), NEVER by the direct child query** — and
    therefore **CONVERTING A `Bug` TO A `Story Defect` REMOVES IT FROM THE EPIC'S DIRECT CHILD LIST.**
    **THE HONEST TRADE-OFF, BOTH SIDES, so this is not read as an argument to abandon the shape:** it
    **GAINS** consistency with the project's overwhelming norm — **project SV holds 575 Story Defects,
    367 under a Story and 0 under an Epic**, so our 11 epic-parented `Bug`s are the outliers — and it
    **GAINS per-story visibility** (`parent = SV-8654` returns 5 Story Defects today, **with our
    SV-8881 absent from them**; that absence is exactly what the shape buys back). It **COSTS** direct
    epic-child visibility **and** the Product Area field. **So converting an existing `Bug` is a TIDY-UP
    WITH A REAL COST, NOT A REPAIR.**
    **WHAT IS UNCHANGED:** the required shape above — `Story Defect` · parent = the owning story · the
    story also linked `relates to` · no Product Area · priority `Medium` — **is the QA LEAD'S OWN
    INSTRUCTION AND STANDS UNTOUCHED.** Our live-verified finding **corrects a FACT in the reasoning; it
    does NOT overrule a RULING** — Rule 33's precedence order draws exactly that line. **Whether to
    convert the 8 existing `Bug`s the audit identified is HIS DECISION — currently put to him and
    AWAITING HIS ANSWER.**
    **PROOF THAT AN EPIC PARENT IS IMPOSSIBLE, NOT MERELY UNCONVENTIONAL (all read live 2026-08-05):** a
    create with `issuetype:10007` + an Epic parent returns **HTTP 400
    `{"errorMessages":[],"errors":{"parent":"Please select valid parent issue.","parentId":"Please select
    valid parent issue."}}`**, while **the IDENTICAL body with a STORY as parent (SV-8689) returns HTTP
    201** and reads back as a Story Defect at hierarchy level −1 under a Story. **The population agrees:
    of ALL 502 Story Defects in project SV** (exhaustive, fully paged) the parents are **Story 294 ·
    Task 149 · Bug 57 · none 2 · EPIC 0** — and **directly-epic-parented Story Defects number 0 under
    SV-8685, 0 under SV-8785 and 0 under SV-8582.** **His own cited example, SV-8883, is a Story Defect
    whose parent is SV-8786 — a STORY.**
    **THE ISSUE TYPES IN PROJECT SV** (`GET /rest/api/3/issue/createmeta/SV/issuetypes` → HTTP 200, 6
    types, read live 2026-08-05): **Task 10005 level 0** · **Epic 10006 level 1** · **`Story Defect`
    10007, `subtask: true`, hierarchy level −1** · **Bug 10008 level 0** · **Story 10245 level 0** ·
    **`Story Defect - Archive` 10279, level 0, NOT a subtask — a LEGACY ARCHIVED type that must NEVER be
    used** (it is a lookalike name sitting at the wrong level, so choosing it silently reproduces the old
    Bug shape under a Story-Defect name).
    **FIELD DIFFERENCES THAT BITE:** `Story Defect` **REQUIRES `parent`** (and only a level-0 issue is
    valid there) and **has NO Product Area field at all**; `Bug` **REQUIRES Product Area
    (`customfield_10153`)** and **may** take an Epic parent. **Priority, the `relates to` story
    link and the seven-section ADF body all work identically on both types.**
    **THE PRE-2026-08-05 CONVENTION, PRESERVED AND DATED (Rules 32/33 — the latest ruling wins, and the
    earlier one is DATED, never deleted):** until 2026-08-05 the required shape was **`Bug` parented to
    the EPIC with the owning story merely LINKED**, on his 2026-08-04 clarification, verbatim: *"So Yes,
    attach the tickets to the Epic as Parent but when you liunk th etickets to the stories they should be
    linked as their story defects. You did it correctly before."* **That was CORRECT FOR `Bug`** — a Bug
    is hierarchy level 0, so an Epic is the only parent it can take and a Story cannot parent a Bug at
    all. **The tickets filed under it are therefore RIGHT FOR THEIR DATE, not errors:** **SV-8879,
    SV-8880, SV-8881** (Report Suite) and the earlier **SV-8818, SV-8819, SV-8820, SV-8823** and
    **SV-8848** were all filed as `Bug`s on an epic parent. **Do not "fix" them on our own initiative — see the
    conversion facts below.** **STATUS OF THAT LIST, RE-READ LIVE 2026-08-05:** SV-8879/8880/8881 still hold
    that exact shape (Bug · parent SV-8582 · Product Area Reports & Dashboards) · SV-8818/8819/8820/8823 are
    still `Bug`s on parent SV-8582 · **but SV-8848 NO LONGER HAS A PARENT AT ALL** — Mudassir Qamar removed
    it (SV-8685 → None) at **2026-08-05T09:21:39 −0500**, so it is now the one shape this rule forbids.
    **NOT re-parented by us:** his action, Rule 53's corollary, and the QA lead's call.
    **NO STANDALONE TICKETS — EVERY ticket we create HAS A PARENT (his 2026-08-04 clarification, still in
    force), INCLUDING a defect we found during our testing whose UNDERLYING CAUSE SITS IN ANOTHER TEAM'S
    AREA.** "It is not really a reporting bug" is **NOT** a reason to leave a ticket parentless: we found
    it, we raised it from this epic's testing, so it hangs off that work. **Under the shape above the
    parent is the OWNING STORY; where there is genuinely NO owning story, ASK the QA lead which story (or
    which level-0 ticket) it belongs under — never leave it parentless, and never fall back to the epic,
    which Jira rejects for this type.** **HONEST CAVEAT (a note, not an exception): a parent CAN
    MISATTRIBUTE another squad's work** — so where the defect is not that story's own feature, **SAY SO
    IN THE TICKET'S TECHNICAL SECTION** (name the real area/endpoint) and **KEEP the `blocks` link that
    explains WHY we raised it**. The parent records who found and owns the report; the links and the text
    record where the fault actually lives. **A `blocks` link and a parent COEXIST FINE** — Jira raised no
    objection (proven live on **SV-8821**, 2026-08-04: `parent = SV-8582` set while `blocks SV-8582` +
    `blocks SV-8592` were both retained).
    **THE STORY LINK STILL MATTERS EVEN THOUGH IT NOW DUPLICATES THE PARENT — KEEP ADDING IT.** The
    organisation's UI "Change work type" wizard **lands a converted ticket on the story we LINKED**:
    **SV-8886** linked `relates to SV-8689` and landed under SV-8689; **SV-8849** linked SV-8692 and
    landed there. **So our habit of linking the owning story is precisely what makes other people's
    conversions land on the right story** — dropping the link as redundant would quietly break that.
    **CONVERSION IS UI-ONLY, IT SILENTLY DESTROYS Product Area, AND IT IS NEVER OURS TO DO.** The REST
    API cannot convert a level-0 issue into a subtask: `PUT /rest/api/3/issue/{key}` with
    `issuetype:10007` + `parent` returns **HTTP 400 `{"pid":"Issues with this Issue Type must be created
    in the same project as the parent."}`** (a misleading message — the parent WAS in the same project),
    and `issuetype` alone returns **HTTP 400 `{"issuetype":"Issue type is a sub-task but parent issue key
    or id not specified."}`** — an unwinnable pair. **RE-CONFIRMED LIVE 2026-08-06** — re-probed on
    **SV-8881**: the same `PUT` still returns that identical HTTP 400 `pid` error, so conversion remains
    **web-UI-wizard-only**; the probe was **proven harmless — all 59 fields byte-identical, `updated`
    included.** **The org's UI wizard does what the API refuses: it
    converts the type AND atomically re-parents Epic→Story in ONE action** (changelog evidence,
    2026-08-05: **SV-8886** Mudassir Qamar 09:29:49, Bug→Story Defect **and** parent SV-8685→SV-8689 in
    one action · **SV-8849** Mudassir 09:15:03 →SV-8692 · **SV-8871** Ahtasham Amjad 04:51:42 →SV-8795 ·
    **SV-8846** Ahtasham 04:46:32 →SV-8797). **⚠️ CONVERSION WIPES Product Area AND THE LOSS IS NOT IN
    THE CHANGELOG** — proven on our own **SV-8886**, filed with Product Area = Schedule and byte-verified
    at filing (11 field checks, all PASS), which now reads **NULL**, while **SV-8848** (never converted)
    still reads Schedule; **all 502 Story Defects in SV have Product Area null.** The QA lead has ruled on
    the consequence, verbatim: **"Product area loss is OK"** — so the loss is accepted, **but it is still
    a silent, unlogged loss and must never be discovered a second time.** **THEREFORE CONVERTING AN
    EXISTING TICKET IS HIS DECISION AND IS NEVER DONE ON OUR OWN INITIATIVE** — the more so because
    **Mudassir Qamar and Ahtasham Amjad are actively converting tickets themselves**, and **Rule 53's
    corollary forbids cutting across another person's triage** (on this shared account their edits are
    indistinguishable from ours in the changelog).
    **METHOD:** create with `issuetype` = `Story Defect` and `parent` = the owning story, then attach the
    same story via `POST /rest/api/3/issueLink`.
    **The link TYPE is the QA lead's to name — never guessed.** The types available in this Jira
    (`GET /rest/api/3/issueLinkType`, read live 2026-08-04) are exactly: **Blocks** (`is blocked by` /
    `blocks`) · **Cause** (`caused by` / `causes`) · **Cloners** · **Duplicate** · **Fixes** (`Fixes` /
    `Fixed by`) · **Polaris work item link** (`is implemented by` / `implements`) · **Relates**
    (`relates to` / `relates to`) · **Split**. **NONE of them is a defect-of / is-defect-for type — and
    that question is now SETTLED a different way:** the "story defect" relationship is carried by the
    **ISSUE TYPE plus the STORY PARENT**, not by a link type, so **the link we add is `relates to`** and
    there is nothing left to guess. **If he ever asks for a different link type, CHANGE NOTHING and ASK
    which of the eight he means** (Rule 7 — plain question; Rule 12 — never invent a semantic).
    **RATIONALE, 2026-08-05 — the live investigation, because the evidence is what makes the shape
    unarguable.** He instructed the Story-Defect shape, and every part of it was then established live
    rather than assumed: the **six issue types with their ids and hierarchy levels**; the **HTTP 400 that
    refuses an Epic parent** beside the **HTTP 201 that accepts a Story parent** for a byte-identical
    body; the **0-of-502** population fact; **his own cited SV-8883 sitting under a Story**; the **four
    changelog conversions** by Mudassir Qamar and Ahtasham Amjad that show the UI doing what the API
    refuses; and the **silent Product Area loss**, caught only because **SV-8886 had been byte-verified
    at filing** (Rule 50) and could therefore be compared against its own filed state — nothing in the
    changelog would ever have revealed it. **HONEST NOTE ON THE PROBE:** the create/refuse experiments
    left one throwaway ticket, **SV-8902**, which **could not be deleted** — `DELETE` returns **HTTP 403
    *"You do not have permission to delete issues in this project."*** — so it was **transitioned to
    OBSOLETE / Done with a comment stating it is a disposable ZZAUTOTEST probe**. **It still exists as a
    closed item in SV**, and that is recorded here rather than tidied out of the story: our account cannot
    delete Jira issues, so any future probe will leave the same residue (which is itself a reason to probe
    on purpose, once, and write the answer down here instead of re-deriving it).
    **RATIONALE, 2026-08-04 (HISTORY — the pass that established the Bug shape):** the six Report-Suite
    defect tickets were filed as `Bug`s parented to
    epic **SV-8582** with the owning story merely **linked** (`Relates`) — SV-8818→SV-8591,
    SV-8819→SV-8645, SV-8820→SV-8672, SV-8823→SV-8677. **An intermediate pass then wrongly proposed
    CONVERTING those four into `Story Defect` subtasks parented to their stories, and the QA lead
    corrected it: *"You did it correctly before."*** Both conversion attempts had already been
    **rejected by Jira with the two HTTP 400s quoted above, so nothing was converted** and no repair
    was needed — but the lesson is that **the original shape was right and the "fix" was the error.**
    **SECOND RATIONALE, same day — the no-standalone half:** **SV-8821** (the create-invoice server error) was
    filed with **NO parent** because its cause is work-order invoicing rather than reporting, and the QA lead
    asked why it was not related to the Report Suite epic. It was corrected to **`parent = SV-8582`**
    (`PUT /rest/api/3/issue/SV-8821` → **HTTP 204**, byte-verified: 58 fields compared, only `parent` and the
    server's `updated` changed, both `blocks` links intact). **`SV-8822` was left alone** — it is
    **OBSOLETE / Done / withdrawn**, and re-parenting a closed ticket is his decision, not ours.
    Record: `build/report-suite/defect-pack-2026-08-04/FILED.md`. **The full field/type/conversion facts
    are in `build/APP-ACTIONS-PLAYBOOK.md` § "Filing a defect ticket" so no session ever re-derives
    them (Rule 27).** Ties to Standing Rules 6 (no write without permission), 12 (observed, never
    inferred — the hierarchy levels, the refusals and the Product Area loss were all read live, not
    assumed), 25 (quote the source and the error verbatim), 27 (recorded in the playbook so it is never
    re-derived), 32/33 (the latest ruling wins — his 2026-08-05 Story-Defect instruction supersedes the
    2026-08-04 Bug shape, which is kept and dated rather than deleted), 38 (another author's ticket is
    theirs — we do not convert it), 50 (byte-verifying at filing is the ONLY reason the silent Product
    Area loss was ever detectable — **and its EXACT-NAMED-TEST-DATA clause is item (3) of the 2026-08-12
    evidence bar**), 51 (an API-related ticket is not filed without asking, whatever its
    shape — **and its reachability test is part of the bar's nonsense check**), 53 (priority `Medium` since 2026-08-06, and never "restore" a field he changed — which is exactly why a
    conversion someone else performed is left alone) **and, for the 2026-08-12 evidence bar specifically:
    7** (the ticket is written in plain layman words), **12** (observed, never inferred — including the
    role and the environment we claim we were in), **24** (an FE-block/BE-allow finding is a PASS and must
    never be filed), **25** (the expectation is QUOTED verbatim from its source), **27** (the image-loss
    hazard and the seven-section format are in the playbook — never re-derived), **31** (use the Confluence
    version, not the in-body one), **45(c)** (the hostile-reviewer lens, moved to the filing step as the
    pre-filing self-challenge), **46** (a defect deliberately NOT filed is RECORDED, so it can never look
    like a miss), **57** (the expectation comes from the document — a ticket resting on how the build
    "ought" to behave is the ticket that gets thrown back), **61** (a closed ticket is not a spec change,
    and a known failure is handled by the expect-fail marker rather than a second ticket) and **62** (the
    permission requirement and the ACTIVE creation hold — the bar governs FITNESS, never authorisation).
53. **NEVER set a ticket's priority to High — always file at Medium; and NEVER "restore" a field the QA
    lead has changed (all projects; the required value became `Medium` on 2026-08-06, superseding `Low`,
    which is preserved below as dated history).**
    USER DIRECTIVE (2026-08-06, verbatim — this SUPERSEDES the 2026-08-04 directive quoted further
    down): *"One thing which I want to correct, please keep the priority of the tickets which you create
    to Medium instead of keeping them to LOW."*
    **THE RULE:** **every ticket we create is filed at priority `Medium`.** Not Low, not "the severity
    the pack states", not High however bad the defect looks to us. **Priority is the QA lead's to
    RAISE, not ours to ASSERT** — he triages; we report. This is unconditional and applies to every
    project and every ticket type. **Where the finding genuinely is severe, that belongs in the ticket's
    own words and in the project's `Severity` field — not in `Priority`.**
    **`High` REMAINS BARRED. The amendment moved the filing value from `Low` to `Medium`; it did NOT
    relax the ceiling** — filing at High is still never ours to do, however bad the defect looks.
    **THE PRE-2026-08-06 VALUE, PRESERVED AND DATED (Rules 32/33 — the latest ruling wins, and the
    earlier one is DATED, never deleted):** until 2026-08-06 the required priority was **`Low`**, on his
    2026-08-04 directive, verbatim: *"never mark the priority as High for the tickets you create always
    keep the priority as LOW"*. **Tickets filed at `Low` BEFORE 2026-08-06 are therefore CORRECT FOR
    THEIR DATE and must NOT be "fixed"** — exactly the treatment Rule 52 gives the Bug-on-an-epic-parent
    convention it superseded.
    **ALREADY-FILED TICKETS ARE NOT RETROSPECTIVELY RE-PRIORITISED.** Raising an existing ticket from
    `Low` to `Medium` is **the QA lead's decision, not ours** — it has been **put to him and is AWAITING
    HIS ANSWER**. Until he rules, existing tickets stay exactly as they are; the new value applies to
    tickets we file from 2026-08-06 onward. **Note how directly this follows from the corollary below:
    re-prioritising a batch of his tickets on our own initiative is the very move that produced the
    `High → Low → High → Low` round trip.**
    **THE COROLLARY THAT BURNED US — A CHANGE MADE UNDER HIS ACCOUNT IS HIS TRIAGE, NOT AN ANOMALY:**
    **NEVER "restore", "correct" or "repair" a field value that has changed without an action of ours.**
    He works in the Jira UI **under this same account** (`bilal.muzamil@shopview.com`, accountId
    `712020:6d590212-…`), so **his edits are INDISTINGUISHABLE FROM OURS in the changelog** — the author
    column will read our own name. Therefore: an unexplained field change is to be **READ AS HIS
    DELIBERATE ACTION and ASKED ABOUT, never reversed.** The signature to look for: a change that is
    **selective and semantically coherent** (only the `High` ones moved; the `Low` and `Medium` ones did
    not) or a **status transition that sets a resolution** — both are human triage, not a stray write.
    **RATIONALE, 2026-08-04 (the whole sequence, because the evidence is the lesson):** the six tickets
    were created at the severity their pack stated (High ×4 · Low · Medium). The QA lead then downgraded
    the four to `Low` at **00:35:27 / 00:35:32 / 00:35:37 / 00:36:58 (−0500)** and closed **SV-8823** to
    **OBSOLETE** at **00:55:27** — all under our shared account. A pass read the four downgrades as
    unexplained drift and **"restored" them to `High` at 00:54:23–00:54:27, reversing his deliberate
    decision.** He then **re-applied `Low` at 00:56:00–00:56:29** — the changelog now carries the full
    embarrassing round trip **`High → Low → High → Low`** on all four, and it is on the record precisely
    so nobody repeats it. **The restore was WRONG twice over: wrong because it undid his triage, and
    wrong because the correct value under this rule **as it then stood** was `Low` all along (from
    2026-08-06 that value is `Medium`).** Ties to Standing Rules 6
    (nothing changed in a system of record without permission — *including* changing it back), 12
    (observed, never inferred — "drift" was an inference and it was false), 25 (cite the changelog
    verbatim), 32/33 (his ruling outranks our reading of a pack), 48 (never imply his decision is an
    obstacle, and never carry a "restore" forward silently), 50 (the byte-level re-read is what surfaced
    the change — reading it correctly is the other half of the job) and 51/52.
54. **EVERY TEST CASE STATES WHAT ITS EXPECTATION IS BASED ON — a provenance line under Expected
    Results, kept current (all projects).**
    **⚠️ DO NOT COPY THE EXAMPLE SENTENCE INSIDE THE QUOTE BELOW — IT WAS SUPERSEDED 2026-08-05: the
    build may NEVER be named as the source of an expectation. Use the TWO-SENTENCE form set out below.**
    USER DIRECTIVE (2026-08-04, verbatim): *"This is the expected behaviour as per the build tested on
    8/4/2026, and as per the Sales By Customer report specification version 13 (S4-R13). yes make it a
    permanent rule whenever you create the test cases, when there is only the Epic and Specs mention
    the epic and specs reference and when you also are done with VIU mention the Test on Buil with the
    date. Then update them whenever you recheck against the spec/epic/Build."*
    **⚠️ THE WORDING WAS AMENDED 2026-08-05 — THE BUILD MAY NEVER BE NAMED AS THE SOURCE OF AN
    EXPECTATION.** USER DIRECTIVE (2026-08-05, verbatim): *"at present it says something like this '
    and as per the build tested on ' it should never say that it is an expected behavior as per the
    build testing because it can confuse the tester as well as it can raise a serious concern of the
    higher ups that how can something be considered as the expected behavior if it is happening on
    the build because the build can be wrong too. Yes you can use the builds name if you want to say
    that the test passed on this date through automation testing."*
    **HONESTY — THE BAD TEMPLATE WAS THIS RULE'S OWN.** The sentence *"This is the expected behaviour
    as per the build tested on 8/4/2026, and as per the Sales By Customer report specification version
    13 (S4-R13)."* was **written into Rule 54 on 2026-08-04 as the QA lead's own example wording, and
    we stamped it onto hundreds of cases in good faith.** **His 2026-08-05 correction SUPERSEDES it
    (Rules 32/33)**, and the old template is now **WRONG and must be replaced wherever it survives** —
    it credits the **build FIRST** for the expectation, which is exactly what Rule 57 forbids.
    **THE RULE:** **every** test case carries, as the **LAST thing in its Expected Results** — after a
    separator line — **a plain-English provenance statement of what its expectation rests on.**
    A case that does not say what it is based on is not self-describing, and its staleness is
    invisible.
    **THE REQUIRED FORM — TWO SEPARATE SENTENCES THAT MUST NEVER BE MERGED. Merging them is precisely
    what caused the problem, so keep them as two sentences even when both are present.**
    **SENTENCE 1 — THE SOURCE OF THE EXPECTATION. MANDATORY. NAMES ONLY DOCUMENTS.**
    **⚠️ AMENDED 2026-08-11 — SENTENCE 1 ALSO CARRIES THE DATE WE READ EACH SOURCE. Read the
    AMENDMENT block below before copying any shape from this paragraph.** The
    **specification with its VERSION and the requirement anchor**, and/or the **epic and/or the owning
    story**, and/or the **PO's verified answer with its file link and date**, **and/or — from
    2026-08-06 — the DESIGN or FIGMA, now authoritative sources of expected behaviour (Rule 57, as
    amended): name the design artefact and, where it has one, its version/date** (an **undated,
    editable share link** is cited as exactly that, never dressed up as a versioned source — Rule 12).
    **THE BUILD IS NEVER NAMED HERE — not as a source, not as corroboration, not in passing.** Shapes:
    *"This is the expected behaviour as per the Schedule specification version 23 (§4.3) and epic
    SV-8685."* · *"This is the expected behaviour as per Branko's answer in this file: <link>
    (5 August 2026), and epic SV-8785."*
    **SENTENCE 2 — THE RECORD OF CHECKING. OPTIONAL. NAMES THE BUILD ONLY AS WHAT THE CASE WAS CHECKED
    AGAINST.** Shape: *"Last checked against build v3.5-be42149 on 8/5/2026."*
    **USE NEUTRAL CHECKING LANGUAGE — "last checked against" — NEVER language implying the build
    DEFINES, CONFIRMS or RATIFIES correctness** ("as per the build", "verified by the build", "as the
    build behaves" are all barred). **A CASE THAT FAILS ON THE BUILD MUST NOT SAY "passed" OR
    "verified"**: sentence 2 records only that the check happened, and the **deviation note carries the
    failure** (Rule 57). **WHERE THE CASE HAS NOT BEEN CHECKED AGAINST ANY BUILD, SENTENCE 2 IS
    OMITTED, or states plainly that it has not yet been checked** — never a date we cannot stand behind
    (Rule 12).
    **THE TWO STATES (a case is always in exactly one of them):**
    **(1) BEFORE ANY LIVE VERIFICATION (documents only)** — **sentence 1 alone**, naming the **epic**,
    the **specification with its VERSION**, and the **governing requirement reference**. Shape:
    *"This is the expected behaviour as per epic SV-8582 and the Sales By Customer report
    specification version 13 (S4-R13)."*
    **(2) AFTER LIVE VERIFICATION** — **sentence 1 UNCHANGED, plus sentence 2** recording the build and
    the date it was checked against. Shape: *"This is the expected behaviour as per epic SV-8582 and
    the Sales By Customer report specification version 13 (S4-R13). Last checked against build
    v3.5-16cf83f on 8/5/2026."* **Note what did NOT change between the two states: the SOURCE sentence
    is identical, because a live check does not alter where an expectation comes from.**
    **⇒ AMENDMENT, 2026-08-11 — EVERY CITED SOURCE ALSO CARRIES THE DATE WE READ IT. THE TWO-SENTENCE
    FORM AND EVERYTHING ABOVE ARE OTHERWISE UNCHANGED; THIS IS PURELY ADDITIVE.**
    USER DIRECTIVE (2026-08-11, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"Do with the cases/or update them as per the
    logic, if anyone sees those test cases they will bite me saying that it is not coming from specs/
    tickets/answer sheet/Claud design/Figma or anything which the PO confirmed. I want nothing to bite
    me like that. And every expected behavior as I mentioned before should have a reference in the test
    cases in the same format as you are keeping that must tell the Manual QA guy or anyone who is
    auditing those test cases that these are the sources of the expected behavior, make sure to mention
    the date of the source when that source of truth was taken from each source, so that in future if
    someone changes the source of truth I can guard myself telling that the refrence taken from the
    source of truth was from the state of that source which was at this certain date."*
    **HIS PURPOSE, STATED PLAINLY BECAUSE IT IS WHAT MAKES THE DATE LOAD-BEARING: THE READ-DATE IS
    EVIDENTIARY.** A version number alone says what the source was *called*; **the read-date says WHEN
    WE LOOKED.** So when a source later moves, he can show that the reference was taken from that
    source **as it stood on a stated date** — and the case reads as **a record of a real reading**
    rather than a claim that ages silently.
    **WHAT CHANGES — SENTENCE 1 GAINS A READ-DATE PER SOURCE.** Shape: *"This is the expected
    behaviour as per epic SV-8685 and the Schedule specification version 27, section 5.3, read on
    11 August 2026."*
    **WHERE A CASE CITES MORE THAN ONE SOURCE, EACH CARRIES ITS OWN DATE.** A spec and a PO answer are
    **read at different times and move independently**, so a single shared date would misstate at
    least one of them.
    **SENTENCE 2 IS UNCHANGED.** *"Last checked against build … on …"* still names the build **only as
    what the case was checked against, never as a source** (Rule 57). **The read-date does NOT attach
    to the build** — the build line already carries its own date, and merging the two is the exact
    error this rule spent 2026-08-05 undoing.
    **THE DATE IS THE DATE *WE READ THAT SOURCE*, NOT TODAY'S DATE.** **NEVER back-fill a read-date
    onto a case whose source was not actually re-read in that pass.** That is a **fabricated
    observation** (Rule 12), and it **defeats the entire purpose**: the value of the date is
    evidentiary, and **a date nobody stood behind protects nobody.** Where a pass re-reads the spec but
    not the epic, **only the spec's date moves.**
    **CONSEQUENCE, RECORDED HONESTLY RATHER THAN GLOSSED — THE EXISTING SUITES DO NOT CARRY
    READ-DATES.** Every case stamped before 2026-08-11 names its sources without one, so **a sweep is
    owed across all projects and it is NOT done.** It is logged in
    `build/OUTSTANDING-ITEMS-REGISTER.md`; **until it runs, no pass may describe any suite as compliant
    with this amendment.**
    **TIES:** Rule 20 (`refs` carries the ticket + anchor in the metadata layer — this line is its
    tester-visible twin, and the read-date belongs on both), Rule 31 (source currency — the read-date
    is the currency check made **visible on the case**, and Rule 31's trap (c) still applies: a
    read-date proves when we looked, never how old the requirement is), Rule 42 (a version-pinned
    anchor connects a closed list to the requirement that invalidates it; the read-date pins **when**
    that pin was taken), Rule 56 (a divergence disclosure carries its own dates on the same principle)
    and Rule 57 (the read-date applies to **every** kind of source on its list — spec, story, PO
    answer, design, Figma, shared `.md` file, written statement).
    **KEEP IT CURRENT — THIS IS THE OPERATIVE HALF.** The line is **RE-STAMPED whenever we re-check
    against the spec, the epic or the build**, and re-stamping is a **REQUIRED step** of every
    verification, reconciliation and spec-delta pass — **not an optional tidy**. **A stale date, a
    stale spec version or a stale epic reference is ITSELF A FINDING** and is reported as one (Rule 31
    source currency; Rule 49's re-check queue — the provenance line is **where the build marker
    actually lives on the case**, so re-running a Rule-49 queue re-stamps it).
    **MECHANICS THAT MAKE IT MAINTAINABLE (not hundreds of hand-edited strings):** the **date is a
    SINGLE variable** in the generator and the **spec versions a per-report / per-project MAP**;
    the stamper is **IDEMPOTENT** — it **REPLACES an existing provenance line, never appends a
    second**; and it is driven off the case source so a re-stamp is one regeneration, not a manual
    sweep.
    **WORDING CONSTRAINTS:** **plain layman English** (Rule 7) · the **FULL report/feature name, never
    an abbreviation** (Rule 19's spirit) · and **NEVER the word "VIU"**, nor a feature-flag name, nor
    any internal jargon — imports stay **VIU-word-free and flag-word-free** per the standing
    convention. **THE REQUIREMENT REFERENCE IN PARENTHESES IS PERMITTED AND WANTED** — notwithstanding
    the general "no §-anchors in tester-facing text" guidance of Rules 7/20. **This is a DELIBERATE,
    QA-LEAD-AUTHORISED EXCEPTION and it is stated here explicitly so that a future pass does not strip
    it as a Rule-7 violation.**
    **NAME THE SOURCE FILE, AND GIVE ITS LINK (added 2026-08-04 by the QA lead's ruling, verbatim:
    *"If Branko said this in his new file then yes, but below the expected behavior give the file link
    and mention that this is coming from Branko's responses here. Anyting that you do if that has the
    reference from the file only - follow the same practice."*).** Where an expectation derives from a
    **NAMED SOURCE FILE rather than the specification** — a **PO's answer sheet**, a **walkthrough /
    Loom video**, an **engineering tech plan**, a **design export**, any document that is not the spec
    — the provenance line **NAMES THAT SOURCE, GIVES ITS LINK, and says plainly that the position comes
    from there**, e.g. *"…and as per Branko's answers in this file: <link>"*. **THE LINK IN
    TESTER-FACING TEXT IS A DELIBERATE, QA-LEAD-AUTHORISED EXCEPTION** to the no-jargon guidance of
    Rules 7/20, exactly as the requirement anchor above is — **stated here so a future pass does not
    strip it.** **A LINK MAY ONLY BE CITED WHERE THAT SOURCE IS GENUINELY LOAD-BEARING FOR THE
    ASSERTION:** pasting an answer-file link onto a case the file does not govern manufactures false
    authority just as surely as omitting a source does, so **distinguish the two cases in the wording**
    — the file is either the **BASIS** (*"that decision is recorded in <who>'s answers, in this file:
    <link>"*) or a **CONFIRMATION** of a spec-backed expectation (*"<who> confirmed this on <date> in
    his answers in this file: <link>"*). **Keep the answer's DATE where it clarifies things**, and
    **re-stamp when a newer file supersedes it** (Rule 32). Canonical example:
    `build/filters/branko-answers-2026-08-04/testrail-execution-log.md` — 12 Filters cases, 10 cited
    the file as governing and 2 as confirming, while the other 98 kept the ordinary line.
    **HONESTY CLAUSE — THE IMPORTANT ONE.** Where a case **deliberately follows a LATER PRODUCT
    DECISION instead of the spec text** (Rule 32 latest-wins — e.g. a PO ruling the spec has not
    caught up with), the line **MUST NOT claim plain spec agreement**: it names the spec **AND states
    that the behaviour follows a later product decision**. **A provenance line asserting a source that
    does not actually support the expectation is WORSE THAN NONE — it manufactures false authority**
    (the same failure mode Rule 46 exists to prevent). Where a case genuinely **has no spec anchor**,
    **say that in words** rather than inventing a reference (Rule 12).
    **SCOPE:** **ALL projects** — Report Suite, Schedule, Filters, Global Search and every future one.
    **NEW cases get it at authoring**; **EXISTING suites get it when next touched, or on an authorised
    retrofit pass** (a retrofit is a TestRail write and needs the QA lead's go-ahead, Rule 6).
    **RATIONALE, 2026-08-04:** it makes every case **self-describing about what it is based on**, so an
    automation engineer or a reviewer can see the basis **without asking** (the Rule-39/44 conversation
    starts from evidence instead of guesswork), and **a source moving on makes the case VISIBLY STALE
    instead of silently wrong** — which is exactly the failure that cost us the SBR export gap. The
    **Report Suite is receiving it now across 478 cases**; and note that **this TestRail project has NO
    Notes field** (verified read-only via `get_case_fields`), which is **why the provenance belongs in
    Expected Results — where a tester actually sees it** — rather than in a metadata field that does
    not exist.
    **RATIONALE FOR THE 2026-08-05 AMENDMENT — the old template was actively misleading, and the
    evidence is our own Schedule suite.** The expected-behaviour audit found **ALL 165 Schedule
    provenance lines** reading *"This is the expected behaviour **as per the build tested on** 8/4/2026
    (v3.5-4873abe), and as per epic … and the specification …"* — crediting the **build FIRST** for the
    expectation. On the **27 DEVIATION cases that was FLATLY FALSE and CONTRADICTED THE CASE'S OWN
    BODY**: the body said *"expect X, the build does Y, mark it FAILED"* while **the line directly
    below it credited the build for the expectation** — so the case simultaneously told the tester that
    the build defines correctness and that the build is wrong. **THE QA LEAD'S ESCALATION CONCERN,
    RECORDED BECAUSE IT IS THE POINT OF THE CHANGE:** the wording *"can confuse the tester as well as
    it can raise a serious concern of the higher ups that how can something be considered as the
    expected behavior if it is happening on the build because the build can be wrong too."* **He is
    right, and it is the kind of question that is asked once, in public, about a whole suite** — a
    provenance line that credits the build invites leadership to conclude that our expectations are
    reverse-engineered from whatever shipped. Splitting the line into **SOURCE** and **RECORD OF
    CHECKING** makes that reading impossible while keeping everything the build legitimately gives us.
    **⇒ CLARIFIED 2026-08-12 (Standing Rule 9's amendment): SENTENCE 2 RECORDS THE CHECK OF THE WHOLE
    BUILD-FACING LAYER — the preconditions, the steps, the navigation path AND the labels — not the
    labels alone.** *"Last checked against build … on …"* is therefore the per-case record that the
    **five-check runnability test** was run on that build (Rule 9), which is what makes Rule 60's
    honest N-of-M split derivable from the cases themselves.
    **🛑 SENTENCE 1 IS UNCHANGED AND NAMES DOCUMENTS ONLY.** The 2026-08-12 licence to correct steps
    from the build **does NOT put the build into sentence 1**, in any form, at any strength — the
    build is still **never** the source of an expectation (Rule 57), and *"as per the build tested on
    …"* remains **BARRED**. **Widening what sentence 2 records is precisely what keeps sentence 1
    clean:** the build gets full credit for the route, in the sentence built for it.
    Ties to Standing Rules 7 (plain layman wording — with the authorised anchor exception
    above), 8 (a case is always named with its C-id), 9 (build-accurate wording), 10 (the VIU push step
    stamps/refreshes the line), 12 (never assert a source you did not read), 19 (full readable names),
    20 (traceability — this is its **tester-visible** twin; `refs` remains the metadata layer), 25
    (cite the source, with its version), 31 (source currency — a stale stamp is a stale source), 32
    (latest product decision wins, and the line must say so), 41 (touch a case → re-verify it whole,
    and re-stamp), 42 (the version in the stamp is what connects a closed list to the requirement that
    invalidates it), 43 (a spec-version bump re-stamps every affected case), 46 (a documented basis is
    what stops a deliberate decision looking like a miss), 49 (the build marker + the re-check
    queue) and 57 (the source of expected behaviour is the DOCUMENT, never the build — this line is
    where that principle becomes visible to the tester, which is exactly why it may not name the build
    as a source), **and 9 (sentence 2 records the runnability check of preconditions, steps,
    navigation and labels — while sentence 1 stays documents-only)**.
55. **A PO QUESTIONNAIRE NAMES THE PROJECT AND THE FEATURE ON EVERY ROW, IS ANSWERABLE BY A
    NON-TECHNICAL READER, AND GOES BACK OUT WHENEVER AN ANSWER IS UNCLEAR (all projects).**
    USER DIRECTIVE (2026-08-05, verbatim): *"Anything which is not clear we need to ask him again.
    Make sure that thre is a possibility that one PO is handling more than one project/feature so
    whenever you create a questionnaire for them do mention for them the project name/feature name,
    and the questions should be extremely simplified for a non technical PO to understand and answer
    and use the references from stories/epic too if needed."*
    **(1) ASK AGAIN — AN INTERPRETED ANSWER IS NOT AN ANSWER.** Whenever a PO's answer is
    **unclear, partial, answers a neighbouring question, or is something we find ourselves
    INTERPRETING rather than READING**, it goes **straight back to him as a follow-up question**. We
    do **not** convert an ambiguity into a case and hope; we do **not** record *"we read this as
    meaning X"* and move on (Rule 12 — never fill a gap with inference). **Do NOT let ambiguities
    stack up across days either:** sweep **every** open one onto **ONE sheet** so he answers in a
    single sitting rather than a drip of separate asks — and log each of them in the
    **OUTSTANDING-ITEMS REGISTER** until answered (Rule 36).
    **(2) NAME THE PROJECT AND THE FEATURE/REPORT ON EVERY QUESTION ROW — NOT JUST IN A HEADER.**
    A PO answers **row by row**, often days later, often on a phone, and **one PO owns more than one
    thing**: **Chris Ward owns BOTH the Report Suite AND Fees & Discounts**; **Branko owns Filters,
    Schedule AND Global Search**. So *"the date filter"* or *"the export"* is **genuinely ambiguous
    to him**, and a mis-scoped answer costs a **whole round trip** — days, on a source we are
    blocked on. Every row therefore carries its own **project name + feature/report name** in plain
    words, so a row read in isolation is still unambiguous.
    **(3) EXTREMELY SIMPLIFIED — PLAINER THAN FEELS NECESSARY.** Each question = **"What happens
    now"** + **the question** + **simple A/B options** + **a blank for the answer**. **If a question
    cannot be made simple, it is probably TWO questions — split it.** **Nothing the PO reads may
    contain** case IDs, spec anchors, HTTP terms, endpoint names, enum/internal names, bug codes, or
    the word "VIU". This **restates and strengthens Standing Rule 7** — read that rule for the full
    wording bar; this rule adds the per-row scoping and the split-it test.
    **(4) USE STORY / EPIC REFERENCES WHERE THEY ORIENT THE READER — AND LEAVE THEM OUT WHERE THEY
    ARE NOISE.** Where naming the piece of work helps the PO **place** the question (*"the story
    about saving your filters"*, and the key alongside it), include it **in plain form**; where it
    adds nothing, omit it. **This is a judgement call and is stated as such** — the test is whether
    the reference helps HIM find the question's context, never whether it looks rigorous to us.
    **(5) THE INTERNAL MAPPING STAYS OFF THE READER-FACING VIEW.** The question→case mapping
    (internal ID + C-id + link per Rule 8) lives on a **separate QA-only tab**, exactly as the
    established sheets do — never in the columns the PO reads.
    **(6) MIRROR THE ESTABLISHED SHEET FORMAT 1:1 (Rule 16).** Canonical example:
    `build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx`;
    today's follow-up sheet is
    `build/report-suite/rulings-2026-08-05/Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx`.
    Human-readable filename naming the PO and the date (Rule 19).
    **RATIONALE, 2026-08-05:** the QA lead gave this directive while we were carrying **unclear
    items from Chris Ward's answer sheet that we had begun to INTERPRET** rather than re-ask, and he
    pointed out the ownership overlap explicitly. It is the cheapest failure to prevent and the most
    expensive to discover: **a PO answering the wrong feature's question in good faith produces a
    confidently-wrong test case**, and nothing downstream catches it, because the answer file itself
    then reads as authority (the false-authority failure mode of Rules 46 and 54). Ties to Standing
    Rules 1 (never proceed without the complete input set — an unclear answer IS a missing input), 7
    (plain layman wording — this rule extends it), 11 (ask which process on new inputs), 16 (mirror
    the established format), 19 (human-readable filenames), 20 (the QA-only mapping preserves
    traceability without leaking it), 23 (the spec is still checked; a question never substitutes for
    reading it), 31 (source currency — a PO answer is a source), 32 (the newest answer wins, so it
    had better be unambiguous), 36 (every unanswered ask is an OUTSTANDING item) and 43 (an
    unanswered question leaves a requirement row un-verdicted, and that must be visible).
    **⇒ DATED ADDITION, 2026-08-17/18 (QA lead, approved with "Add") — ALSO PRODUCE A GOOGLE-DOC
    (.docx) OF THE READER-FACING QUESTIONS.** In addition to the established `.xlsx`/`.md` question
    sheet, produce a reader-facing **`.docx` (Google-Docs-openable)** containing **ONLY the
    reader-facing questions** — **no QA-only mapping tab, no case IDs, no spec anchors, no jargon, and
    never the word "VIU"** — so the QA lead can share it directly with the PO. Human-readable filename
    alongside the originals (Rule 19), naming the PO and the date. The QA-only question→case mapping
    (internal ID + C-id + link) stays in the `.xlsx`/`.md` ONLY, never in the `.docx`. Canonical
    examples: the 2026-08-17 Google-Docs-ready `.docx` sheets for Chris Ward (2 questions) and Branko
    (3 questions). Ties to Standing Rules 7 (plain layman wording), 16 (mirror the established format),
    19 (human-readable filenames) and 20 (the mapping stays off the reader-facing view).
56. **WHERE A CASE FOLLOWS A LATER DECISION THAT DIFFERS FROM AN EARLIER SOURCE, THE CASE MUST SAY
    SO — in plain words, in the Expected Results (all projects).**
    USER DIRECTIVE (2026-08-05, verbatim): *"COnsider the latest piece of information as the
    authentic one and do mention in the expected behavior after a line break about where the PO asked
    for this behaviour and where it differes and we have taken the last information as the prevailing
    one."*
    **THE LATEST AUTHORITATIVE INFORMATION IS THE AUTHENTIC ONE — that half is Standing Rule 32 and
    is not restated here.** **Rule 56 is about the TESTER-FACING DISCLOSURE that Rule 32's outcome
    now requires**: latest-wins is no longer allowed to happen **silently**.
    **THE REQUIREMENT.** Where a case's expected behaviour **follows a LATER decision INSTEAD OF an
    earlier source** — an earlier spec version, a design, or **an earlier ruling by the same PO** —
    the **Expected Results MUST carry, after a line break, a plain-English sentence stating THREE
    things**: **(1) WHERE the PO asked for this behaviour** — the file or message, **with its link
    and its date**; **(2) WHERE IT DIFFERS from the earlier source** — naming that source and what it
    said, **briefly and plainly**; **(3) THAT WE HAVE TAKEN THE LATEST INFORMATION AS PREVAILING.**
    All three, every time — a note giving only the new source leaves the tester with no idea what
    changed.
    **PLAIN LAYMAN WORDS (Rule 7).** The point is that a **non-technical tester can see WHY the case
    says what it says**, so **a tester who half-remembers the old behaviour does not raise a false
    bug** — which is exactly the cost this sentence buys off.
    **NO DIVERGENCE SENTENCE WHERE THERE IS NO DIVERGENCE — the honesty half, and it is as firm as
    the requirement.** If **nothing earlier contradicted** the decision, adding this sentence
    **MANUFACTURES A CONFLICT THAT DOES NOT EXIST** and is **itself a defect** — it teaches the
    tester to distrust a settled expectation and it misrepresents the sources. A confirmation is
    **not** a divergence: where the later source merely **agrees** with the spec, it is cited as a
    **confirmation** under Rule 54, not disclosed as a difference.
    **PLACEMENT.** It sits **WITH the Rule-54 provenance material at the END of Expected Results**;
    the **automation marker still goes LAST**, after a blank line (the QA lead's placement
    instruction: markers at the end of Expected Results with a blank line before and after — see
    "Deliverable conventions the user likes").
    **KEEP IT CURRENT — RE-STAMPED LIKE THE PROVENANCE LINE.** Whenever the sources move, the
    divergence note is **re-written along with the provenance line** (Rule 54's keep-it-current half;
    Rule 31's currency logic). **A divergence note naming a source that has since been superseded is
    ITSELF STALE, and a stale note is a FINDING** — reported, not quietly overwritten.
    **⚠️ IT ALSO COVERS A PRD-vs-DESIGN DIVERGENCE FROM 2026-08-06 (Rule 57, as amended: the design and
    Figma are now authoritative).** Where a case must assert something while a **PRD/design/Figma
    mismatch is still OPEN with the PO**, it follows the **most recent authoritative source (Rule 32)**
    and **discloses that divergence here, in these same three parts** — naming the other document and
    what it said. **The disclosure is NOT a substitute for RAISING the mismatch** (Rules 36/55/57);
    both happen.
    **WORKED EXAMPLE (the one that produced the rule).** **Chris Ward ruled on 2026-07-29** that the
    asset-identifier chain **VIN → Unit # → plate** is the standard **everywhere**, verbatim: *"Not
    just for these specs though -- really good to keep this in mind for all actions moving forward"*
    (`build/report-suite/chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`). His
    **2026-08-05 answer sheet** then says the **Work In Progress report keeps the UNIT NUMBER first**
    (`build/report-suite/chris-answers-2026-08-05/`). **Latest wins for that report**, so those cases
    **follow unit-number-first AND say plainly** that his earlier cross-project instruction said
    otherwise and that we are following his most recent word — with the file and date, so he can
    re-read his own two answers side by side and correct us in one line if we have it backwards.
    **RATIONALE, 2026-08-05:** a case that silently follows the newer of two conflicting sources is
    **indistinguishable, to a tester and to a reviewer, from a case that is simply wrong against the
    spec** — the same failure mode Rules 46 and 54 exist to prevent. Disclosing the divergence turns
    a **latent argument** into a **visible, dated, checkable decision**: the tester does not raise a
    false bug, a reviewer's challenge starts from evidence instead of guesswork (Rules 39/44), and if
    the PO changes his mind again the affected cases are **findable by their own text**. Ties to
    Standing Rules 7 (plain layman wording), 9 (build-accurate, tester-readable wording), 12 (never
    assert a source you did not read), 20 (traceability — `refs` remains the metadata layer, this is
    its tester-visible twin), 25 (cite the source, verbatim, with its date), 31 (source currency — a
    stale note is a stale source), 32 (latest authoritative information wins — this is its disclosure
    obligation), 33 (authority precedence decides WHICH source is later-and-authoritative), 41 (touch
    a case → re-verify it whole and re-stamp), 43 (a spec/answer delta re-stamps every affected case),
    46 (an undocumented deliberate decision is indistinguishable from a miss) and 54 (the provenance
    line this sentence sits with).
57. **THE SOURCE OF EXPECTED BEHAVIOUR IS THE DOCUMENT, NEVER THE BUILD — from the build we take
    only the labels and the verdict (all projects).**
    USER DIRECTIVE (2026-08-05, verbatim): *"The expected behaviors are NOT the ones 'how the build
    is behaving'. Expected behaviors are the ones which are either in PRD-COnfluence/Epic STories/
    Verified in the Anser sheets by the PO. From the Build we are JUST doing the VIU and the
    processes attached to that VIU process. I am shocked to see that how come you considered the
    Build behavior as the expected behavior?"* — and, naming the root cause himself, verbatim: *"For
    the rule: 'the case should be matched to the build' That doesnt mean the expected behavior should
    match the build. That kills the purpose of the test case. I think when we said 'the case should
    be matched to the build' it meant that the test case should be VIU'd from the build"*.
    **⚠️ THE SOURCE LIST WAS AMENDED 2026-08-06 — IT WAS THREE SOURCES, IT IS NOW FIVE: THE DESIGN
    AND FIGMA ARE AUTHORITATIVE TOO. Read the AMENDMENT block below BEFORE relying on the
    three-source list that follows, which is kept verbatim and dated rather than overwritten.**
    **THE ORIGINAL THREE-SOURCE LIST (2026-08-05 — SUPERSEDED 2026-08-06 by the amendment below;
    kept visible as the record of what the rule said, exactly as Rules 31/52/53 keep theirs):**
    **EXPECTED BEHAVIOUR COMES FROM EXACTLY THREE PLACES, AND NOWHERE ELSE:** **(a)** the **PRD /
    Confluence specification** · **(b)** the **epic's stories** — description, acceptance criteria,
    comments · **(c)** the **PO's verified answers** in an answer sheet or message. That is the whole
    list. **A build is not on it.**
    **⇒ AMENDMENT, 2026-08-06 — THE DESIGN AND FIGMA JOIN THE LIST, AND THEY ARE EXPECTED TO AGREE
    WITH THE PRD.** Asked whether designs should be an authoritative source and where they sit
    relative to the PRD, the QA lead answered — **USER DIRECTIVE (2026-08-06, verbatim, his typing
    preserved exactly as he wrote it, because Rule 25 applies to his instructions exactly as it does
    to a spec):** *"PRD/Design?Figm shuld match and then everything should match the Build."* and
    *"For now seit it as a rule but do not change any test cases in retro."*
    **SO EXPECTED BEHAVIOUR NOW COMES FROM FIVE PLACES, AND NOWHERE ELSE:** **(a)** the **PRD /
    Confluence specification** · **(b)** the **epic's stories** — description, acceptance criteria,
    comments · **(c)** the **PO's verified answers** in an answer sheet or message · **(d)** the
    **DESIGN** · **(e)** **FIGMA**. **A build is still NOT on it.** Everywhere this rule (or another
    rule citing it) says **"a source in (a)/(b)/(c)"**, read **(a)–(e)** from 2026-08-06 onward.
    **(a)–(e) ARE EXPECTED TO AGREE WITH ONE ANOTHER.** The PRD, the design and Figma are **all
    authoritative sources of expected behaviour**, and the ruling's first half — *"PRD/Design?Figm
    shuld match"* — is a statement that they are **supposed to say the same thing**.
    **WHERE THEY DISAGREE, THAT DISAGREEMENT IS A FINDING TO BE RAISED — NEVER A SIDE TO BE SILENTLY
    PICKED.** A mismatch between the PRD and the design is a **defect IN THE DOCUMENTS**: it goes to
    the **PO as a question** (Rules 7/55) and into the **OUTSTANDING-ITEMS REGISTER** (Rule 36).
    **Quietly picking a side hides a documentation defect** — the same failure mode Rule 58 exists to
    prevent, one layer up.
    **🔴 "EVERYTHING SHOULD MATCH THE BUILD" DOES NOT WEAKEN THIS RULE'S CORE — THE BUILD IS STILL
    NEVER A SOURCE OF EXPECTED BEHAVIOUR. IT IS THE THING UNDER TEST.** The ruling's second half means
    **the BUILD is expected to CONFORM to the agreed sources**. It does **NOT** mean the sources are
    read off the build, and it does **NOT** reopen the door Rules 57 and 58 closed. **This sentence is
    spelled out because it is the exact clause a future session could misread, and misreading it is
    what cost us the whole 2026-08-05 expected-behaviour correction across 748 cases.**
    **ORDER OF OPERATIONS WHEN THE SOURCES DISAGREE — THIS DOES NOT DISPLACE RULE 32.** Rule 32
    stands: **the most recent authoritative product source wins.** So: **(1) RAISE the mismatch** as a
    finding per the paragraph above — it is never resolved silently; **(2) MEANWHILE, where a case
    must assert something before the PO answers, it follows the MOST RECENT authoritative source
    (Rule 32)** and **DISCLOSES the divergence in the case text (Rule 56)**; **(3) the raised question
    stays OPEN in the register (Rule 36) until the PO settles it.** **NO NEW TIEBREAK IS INTRODUCED
    HERE** — where recency itself cannot be established, Rule 32's own clause governs: **ASK the PO,
    never pick a side.**
    **⇒ FOLLOW-UP RULINGS, 2026-08-06 — the SAME DAY, answering the TWO THINGS the amendment above
    flagged and could not settle on its own: *"when the design and Figma disagree with EACH OTHER,
    which wins?"* and *"what counts as the design?"*. Both are quoted verbatim, his typing preserved,
    because Rule 25 applies to his instructions exactly as it does to a spec.**
    **(i) THE TIEBREAK — USER DIRECTIVE (2026-08-06, verbatim):** *"the latest wins or if latest does
    not make sense we can create a question sheet for the PO to respond."*
    **THIS IS RULE 32 APPLYING TO DESIGN ARTEFACTS TOO — IT IS NOT A NEW TIEBREAK.** Where the design
    and Figma (or any two design artefacts) disagree with **each other**, **the MOST RECENT ARTEFACT
    WINS**, exactly as Rule 32 already provides for every other source type. **AND IT NOW CARRIES AN
    EXPLICIT SECOND LIMB: "OR IT DOES NOT MAKE SENSE."** Rule 32's own corollary (iii) already sent an
    **AMBIGUOUS** newest source, or one whose **recency cannot be established**, to the PO; his ruling
    **BROADENS that** — the most recent artefact is **not followed** where it **does not make sense**,
    **even when it is perfectly clear and perfectly dated.**
    **"DOES NOT MAKE SENSE" IS A JUDGEMENT HE HAS AUTHORISED US TO MAKE — AND THE ONLY PERMITTED
    RESPONSE TO IT IS A QUESTION SHEET (Rules 7/55), NEVER A DECISION OF OURS.** We may say *"this does
    not make sense"*; we may **not** then choose what it should have said. The finding goes to the PO on
    a question sheet in plain layman words and into the **OUTSTANDING-ITEMS REGISTER** (Rule 36) until
    he answers; meanwhile the affected cases are **HELD**, or keep the sourced position they already
    had, with the divergence disclosed (Rule 56). **Reaching for the build to break the tie remains
    barred by Rules 57 and 58, and this ruling does not reopen it.**
    **⚠️ THE PRACTICAL CRUX, AND IT IS LIVE RIGHT NOW: "LATEST WINS" REQUIRES A DATE, AND AN UNDATED,
    EDITABLE SHARE LINK HAS NONE.** A `claude.ai/design/p/…?…&via=share` page is **live, editable, and
    carries no version and no date**, so its recency **cannot be established at all** — which sends it
    **straight to the escalation limb** instead of winning on recency. **WORKED EXAMPLE (the live one):**
    Sasha Grosman's Schedule design share link, cited as the closing source of
    **[SV-8915](https://shopview.atlassian.net/browse/SV-8915)**,
    **[SV-8916](https://shopview.atlassian.net/browse/SV-8916)** and
    **[SV-8917](https://shopview.atlassian.net/browse/SV-8917)** — it **cannot be dated**, so it does
    **NOT** displace our ingested baseline **`build/schedule/design-2026-07-27/`** by recency, and
    **which design artefact is canonical is a QUESTION** (already outstanding), never something we
    resolve for ourselves.
    **(ii) WHAT COUNTS AS "THE DESIGN" — USER DIRECTIVE (2026-08-06, verbatim):** *"Design is Claude
    design/Figma Design/ also I do share with you the Technical design as well."*
    **SO THE ARTEFACT TYPES THAT COUNT AS "THE DESIGN" UNDER (d) ARE THREE:** **(d1) a CLAUDE DESIGN**
    — including a **Claude prototype export or share page** · **(d2) a FIGMA DESIGN** · **(d3) the
    TECHNICAL DESIGN he shares.**
    **(d1) CONFIRMS THAT A CLAUDE PROTOTYPE COUNTS, AND THAT MATTERS CONCRETELY:** the authoritative
    Schedule design has been a **Claude prototype, not Figma**, and **~48 of our Schedule labels were
    pinned from it** — so those labels rest on an artefact this ruling puts squarely inside the
    authoritative list.
    **AN UNDATED EDITABLE SHARE LINK STILL COUNTS AS A DESIGN under this ruling** — but **Rule 54
    requires it be CITED AS EXACTLY THAT, undated and editable, and never dressed up as a versioned
    source** (Rule 12). That constraint is already written in Rule 54 sentence 1; cross-referenced here
    rather than restated.
    **✅ ⇒ ANSWERED AND CLOSED 2026-08-12 BY THE QA LEAD. THE SUPERSEDED "OPEN QUESTION" WORDING IS KEPT
    VISIBLE IMMEDIATELY BELOW AND DATED, NEVER DELETED (the Rules 31/52/53 pattern) — a silently-erased
    question is how a future session re-asks something a source has already answered.**
    **USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec):** *"Technical design is the authority but if that
    contradicts with specs/tickets/answer sheet/claude design/figma (because they are also the authority
    with the rule that the latest entry for that question wins) I would suggest to consider the
    specs/tickets/answer sheet/claude design/figma (with the rule that the latest entry for that question
    wins) as the authority for the test cases but let me know where it contradicts with the tech design."*
    **THE RULING, IN THREE LINES — AND ALL THREE MATTER:**
    **· THE TECHNICAL DESIGN *IS* AN AUTHORITY.** His first four words settle it: *"Technical design is
    the authority"*. It stays on the source list at **(d3)**, and a case sourced by the technical design
    **alone** — where nothing else speaks — **is properly sourced and is NOT a Rule-64 deletion
    candidate.** **This is the half that UNBLOCKS work**, and it is easy to miss behind the second half.
    **· WHERE IT CONTRADICTS ANOTHER SOURCE, THE OTHER SOURCE WINS FOR THE TEST CASES.** Specifically the
    **specs · tickets · answer sheets · Claude design · Figma** — *"consider the [them] … as the authority
    for the test cases"* — **with latest-wins applying AMONG them** (Rule 32; and Rule 31 trap (c): date
    the REQUIREMENT by diffing its own text across versions, never the page).
    **· AND EVERY SUCH CONTRADICTION IS REPORTED TO HIM — NOT SILENTLY RESOLVED.** His closing clause is
    an instruction, not a courtesy: *"but let me know where it contradicts with the tech design."* **So
    following the winning source is only half of what he asked for; the other half is TELLING HIM**, and a
    pass that quietly applies the precedence order and says nothing has complied with one sentence of the
    ruling and ignored the other. The contradiction goes into the **OUTSTANDING-ITEMS REGISTER** (Rule 36)
    and is named in the pass report. **The reason it matters: a tech-design-vs-PRD contradiction is a
    DEFECT IN THE DOCUMENTS — it means engineering is building to one description and the product is
    written to another — and that is worth far more to him than a quietly-corrected test case.**
    **WHAT THIS DOES *NOT* CHANGE, said explicitly (Rule 63(iii) — an override of one clause is not an
    override of the rules around it):** **(a)** the technical design's place on the source list is
    **unchanged** — it was already at (d3) and still is; **(b) Rule 30's subordination clause is
    VINDICATED, not overturned** — *"engineering intent never overrules product truth"* was our reading,
    and he has now confirmed it in his own words, so the clause stands as **his** position rather than
    ours; **(c)** the build is **still not a source** (Rules 57/58) — nothing here reopens that;
    **(d)** where the technical design is the **only** source and nothing contradicts it, **no
    subordination arises at all** and the case is simply sourced.
    **NO RETROACTIVE SWEEP IS AUTHORISED BY THIS RULING.** It settles the resolution order; it does not
    instruct a rewrite of existing cases. The contradiction **list** is produced and handed over (that is
    what he asked for); **acting on it is his call** (Rule 6).
    **⚠️ THE SUPERSEDED WORDING, PRESERVED AND DATED — from 2026-08-06 until this ruling this block read:**
    *"🔴 (d3) CARRIES A GENUINE TENSION WITH STANDING RULE 30, AND IT IS RAISED HERE RATHER THAN RESOLVED.
    Rule 30 says the engineering tech plan INFORMS but NEVER OVERRULES product truth from the spec/PO, and
    that a tech-plan-vs-spec conflict becomes a PO/dev QUESTION, never a silent case change. His ruling now
    names "the Technical design" among the design artefacts, and this rule's amended list makes designs
    authoritative sources of expected behaviour. THOSE TWO READINGS CAN CONFLICT. How it is recorded,
    pending his confirmation: · the TECHNICAL DESIGN IS a design artefact under (d)/(d3), as he instructed
    — it is on the authoritative list; · RULE 30'S SUBORDINATION CLAUSE IS PRESERVED IN FULL — a technical
    design does NOT overrule the PRD or a PO answer on product behaviour, and such a conflict is a PO/dev
    question; · THAT SECOND BULLET IS OUR READING, PENDING HIS CONFIRMATION — HE HAS NOT RULED ON IT. It is
    not his position and must never be quoted as one. ⏳ OUTSTANDING QUESTION FOR THE QA LEAD (unanswered —
    do NOT answer it for him): does a TECHNICAL DESIGN carry the same authority as the PRD on what the
    product SHOULD DO, or does Rule 30's "informs but never overrules" still hold for it? Until he answers,
    the two bullets above stand together, and any case that would turn on the difference is HELD, not
    decided."*
    **THE HOLD THAT WORDING IMPOSED IS LIFTED. ELEVEN CASES WERE HELD ON IT AND ARE NOW SETTLED** — nine
    in class C-3 of `build/unsourced-cases-2026-08-11/CANDIDATES.md` plus **C29600** and **C29632** —
    **every one of them a case the technical design sources ALONE, with the other documents SILENT rather
    than contradictory**, so the subordination limb never fires and they are sourced as they stand. The
    list, with what each now needs, is `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md` §3.
    **NO RETROACTIVE CHANGES — his words are the authority: *"For now seit it as a rule but do not
    change any test cases in retro."*** **No existing test case is re-sourced, re-worded or
    re-verdicted because of this amendment.** It governs **NEW AND FUTURE WORK ONLY**, and a pass that
    "tidies" existing cases to it is acting **without authorisation** (Rule 6). **THIS COVERS THE TWO
    FOLLOW-UP RULINGS ABOVE AS WELL (recorded 2026-08-06): his no-retro instruction from earlier the
    same day STILL STANDS, so neither the design tiebreak nor the three-artefact definition licenses a
    single edit to an existing case.**
    **THE LIVE CONFLICT THIS RULING ARRIVES INTO — the worked example, and the reason the question was
    asked.** On **2026-08-06 Branko called the design the *"single source of truth"*** while **Stefan
    described a *"gap between PRD and design"*** — and **Stefan's remark led to a requirement being
    DELETED from the Schedule specification at v24** (the fade/highlight line in **§6**), **81 seconds
    after [SV-8874](https://shopview.atlassian.net/browse/SV-8874) was closed OBSOLETE**. Meanwhile
    **story SV-8686 STILL REQUIRES that behaviour** in both its Requirements and its Acceptance
    Criteria, **so the specification and the story now disagree** — precisely the (a)-vs-(b) mismatch
    this amendment says must be RAISED rather than silently resolved. Evidence:
    `build/schedule/spec-v25-2026-08-06/`. **NOTHING about those cases changes because of this
    ruling** — they are pending the QA lead's separate go-ahead and are driven by the **spec diff**,
    not by this amendment.
    **STANDING CONSEQUENCE FOR SCHEDULE — A STALE DESIGN BASELINE IS NOW A MORE SERIOUS
    SOURCE-CURRENCY GAP THAN IT WAS.** Our Schedule design baseline is
    **`build/schedule/design-2026-07-27/`**; **~48 of our Schedule labels were pinned from it**;
    **three tickets cite a NEWER, UNDATED, EDITABLE design SHARE LINK**; and re-ingestion is
    authorised **only *"if Sasha's design is final"* — a condition NOT YET ESTABLISHED.** Because the
    design is now **authoritative**, that baseline carries the weight of a source in the **Rule-31
    pre-flight** and must be recorded there as **PARTIAL** with the exact shortfall named: *"design
    PARTIAL — baseline `build/schedule/design-2026-07-27/`, ~48 labels pinned from it; a newer
    undated editable share link exists; re-ingestion authorised only if Sasha's design is final,
    which is not established."*
    **⇒ AMENDMENT, 2026-08-10 — THE SOURCE LIST IS WIDENED AGAIN, AND IT IS DECLARED OPEN-ENDED.
    IT WAS THREE (2026-08-05), THEN FIVE (2026-08-06); IT IS NOW SEVEN *AND EXPLICITLY NOT A CLOSED
    LIST*.**
    **USER DIRECTIVE (2026-08-10, verbatim, his typing preserved exactly as he wrote it because Rule
    25 applies to his instructions as it does to a spec):** *"General rule for the test cases to keep
    them current authentic and accurate that you need to ensure the test cases are correct as per the
    Specs/Stories/Answer sheets/New design/new .md files/new claude designs and anything which is
    provided to you and is latest if that conflicts with the older order and anything which in
    srittem statement they share with us and is newer and the rest you know"*.
    **MOST OF THIS RESTATES RULES 31, 32 AND 57 AND CHANGES NOTHING** — sources must be current
    (31), the latest authoritative one wins on conflict (32), and expected behaviour comes from
    documents (57). **THE PART THAT IS NEW, AND THE ONLY PART TO CAPTURE, IS THE EXPLICIT WIDENING OF
    THE SOURCE LIST:**
    **· (f) NEW `.md` FILES SHARED WITH US** — his words, *"new .md files"*: the **handover and
    design-review documents**, e.g. today's `ed9bc33e-FIlters_HANDOVERAppWideFilterRedesign.md` and
    `af54d7ba-Schedule_scheduledesignreview20260805.md`.
    **· "NEW CLAUDE DESIGNS" — ALREADY COVERED by the 2026-08-06 amendment at (d1); his enumeration
    CONFIRMS it** rather than adding anything.
    **· (g) ANY WRITTEN STATEMENT SHARED WITH US, WHEN IT IS NEWER** — his words, *"anything which in
    srittem statement they share with us and is newer"*: **including a message or a channel post.**
    **⇒ SO THE LIST READS (a)–(g), AND EVERYWHERE THIS RULE OR ANOTHER RULE CITING IT SAYS
    "(a)/(b)/(c)" OR "(a)–(e)", READ "(a)–(g)" FROM 2026-08-10 ONWARD.**
    **🔑 THE SOURCE LIST IS OPEN-ENDED BY HIS INSTRUCTION — *"and anything which is provided to you
    and is latest"*. A NEW DOCUMENT TYPE DOES NOT NEED A RULE AMENDMENT BEFORE IT COUNTS.** The
    enumeration is illustrative, not exhaustive; the test is **is it provided to us, is it
    authoritative, and is it the latest** — not **is its file extension already listed here.**
    **🔴 WHAT THIS DOES NOT DO — SAID EXPLICITLY, BECAUSE HIS CLOSING PHRASE *"and the rest you know"*
    INVITES A FUTURE SESSION TO FILL THE GAP FROM MEMORY, AND THE LAST TIME A GAP GOT FILLED FROM THE
    BUILD IT COST 748 CASES:** **THE BUILD IS STILL NOT A SOURCE OF EXPECTED BEHAVIOUR.** Widening the
    list of *documents* does not put the build on it, and *"the rest you know"* means **this rule's
    core, Rule 32's latest-wins and Rule 58's hold-and-ask** — it does **not** mean *"use your
    judgement about what the product should do"*. **Latest wins ON CONFLICT (Rule 32); the build is
    never the thing that wins.**
    **THE PRACTICAL DUTY THIS CREATES — A NEW DOCUMENT IS INGESTED, NOT SKIMMED.** When a new document
    arrives it goes through **the Rule-31 currency check** (recorded in the SOURCE-CURRENCY block with
    its identifier, date and CURRENT/STALE/PARTIAL verdict) **and a Rule-43 per-requirement
    reconciliation** — one verdict row per requirement, both directions, totals reconciled. **A skim is
    not an ingest.** **The evidence that this is not theoretical: today's two `.md` files EACH CHANGED
    REAL VERDICTS**, and one of them exposed **[C38909](https://shopview.testrail.io/index.php?/cases/view/38909)**
    asserting working filter buttons across nineteen report surfaces when **fourteen** of them had been
    **forbidden, deferred, orphaned or never scoped** by engineering — a tester would have logged a long
    row of Blocked results waiting for a build that was never coming. Evidence:
    `build/filters/run-sync-and-c38909-2026-08-10/C38909-REPAIR.md`.
    **FROM THE BUILD WE TAKE EXACTLY TWO THINGS:** **(1)** the **exact on-screen labels and wording**,
    so the tester reads what they will actually see (Rule 9); and **(2)** the **PASS / FAIL /
    deviation VERDICT** (Rules 10/12/13). **Nothing else. Not the assertion, not the rule, not the
    "accepted behaviour".**
    **IF THE BUILD DIFFERS FROM THE DOCUMENTED EXPECTATION, THE CASE KEEPS THE DOCUMENTED
    EXPECTATION** and becomes a **DEVIATION with a ticket**. **Never the reverse.** That is the
    entire point of holding an expectation in the first place.
    **A CLOSED TICKET DOES NOT CHANGE THE EXPECTED BEHAVIOUR.** A ticket closed as **"accepted"**,
    **"obsolete"** or **"not reproducible"** is a **triage decision about whether to FIX** — it is
    **NOT a specification change** and it is not the PO ratifying anything. If the spec requires **X**
    and the build does **Y**, the case **still expects X**; the **automation marker** qualifies the
    closed ticket (`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`) so nobody waits for a fix that is not
    coming. **Only a source in (a)/(b)/(c) can move an expectation.**
    **THE ONE NARROW EXCEPTION — stated here precisely so it cannot be read as the rule:** where
    **OUR OWN case asserted something NO source supports** (a design-only detail, an over-specified
    enumeration), the repair is **REMOVAL or scope-conditional wording (Rule 42)** — **never
    substitution of observed behaviour.** Rule 25 now says this in the same words.
    **WHERE NO SOURCE SPEAKS AT ALL, THE CASE MUST NOT INVENT A REQUIREMENT FROM THE BUILD.** It
    asserts **only what a source supports**, and the **gap becomes a PO QUESTION** (Rules 7/55),
    recorded in the **OUTSTANDING-ITEMS REGISTER** (Rule 36) until answered. **An unsourced
    expectation filled in from the build HIDES the gap — and that is the deeper harm**, because the
    missing requirement stops being visible to anyone: no reviewer, no PO and no future pass can tell
    that nothing was ever decided.
    **⇒ CLARIFIED 2026-08-12 — WHAT "FROM THE BUILD WE TAKE ONLY THE LABELS AND THE VERDICT" MEANT
    ALL ALONG: THE WHOLE *ROUTE* — PRECONDITIONS, STEPS, NAVIGATION AND LABELS — IS **VERIFIED
    AGAINST** THE BUILD. THIS RULE'S CORE IS UNTOUCHED AND IS RESTATED IN FULL: THE EXPECTED
    BEHAVIOUR COMES FROM THE DOCUMENTS, NEVER FROM THE BUILD.** Nothing below is weakened, no source
    is added to (a)–(g), and **the build is still NOT on the list.**
    QA lead, verbatim (2026-08-12): *"YES the expected behavior should come from the sources rather
    than the build, Keep the VIU rule but correct it as needed."* — and, **sharpening the steps half
    the same day**: *"when I say steps of reproduction can be taken from build I mean, that steps of
    reproduction MUST be verified from the build to 100% ensure that when manual tester would run the
    test he will be able to run it."*
    **THE LINE, DRAWN ONCE AND PRECISELY: THE BUILD MAY CONFIRM *HOW YOU GET THERE*. IT MAY NEVER
    SUPPLY *WHAT SHOULD HAPPEN WHEN YOU DO*, AND IT MAY NEVER DECIDE *WHAT GETS TESTED*.** Screen
    names, tab names, menu paths, button text, step order, the data state a precondition needs — **all
    verified against the build, and corrected to the minimum that makes them executable.** The
    assertion — **from a source in (a)–(g), always.**
    **⚠️ TWO MISREADINGS TO GUARD AGAINST, BOTH NAMED SO NEITHER CAN HAPPEN QUIETLY:**
    **(1) *"you can take them from the build"* IS SCOPED TO THE STEPS BY ITS OWN SENTENCE.** Reading
    it as licence to take the **EXPECTATION** from the build reproduces **EXACTLY the failure this
    rule was written for — the one that cost 748 cases on 5 August 2026.** If a future pass finds
    itself citing this clarification while editing an **expected result**, it has misread it: **stop,
    and re-read the directive above, in which the very next clause says the opposite.**
    **(2) IT IS ALSO NOT LICENCE TO *AUTHOR* STEPS FROM THE BUILD** — his own sharpening rules that
    out: the obligation is **VERIFICATION**, and **the build is the CHECK, never the AUTHOR.**
    Writing steps by walking the build lets the product **choose our coverage**, which is the same
    error one layer down: **a suite that tests whatever the build made easy, and passes beautifully
    while doing it.**
    **AND THE WIDENING CUTS BOTH WAYS — IT CREATES AN OBLIGATION, NOT A LOOPHOLE.** A case whose
    expectation is impeccably sourced but whose steps do not match the build **still fails**, because
    *"the manual tester can not test that test"* — the five-check runnability test at the tail of
    **Rule 9** is now part of doing this properly, **at his stated standard of 100%**, and **an
    unverified step is an unverified case** in any count we publish.
    **THE DIAGNOSTIC TO CARRY FORWARD (the hardest failure to spot):** a case whose **STEPS were
    correctly VIU'd** while its **EXPECTED RESULT was quietly changed in the same edit** looks
    **freshly maintained**, and its **Rule-54 provenance line looks current** — so it reads as our
    best work. **That is WORSE than an obviously stale case, not better**, because staleness at least
    announces itself. When auditing, diff the **expected result** against its **cited source**, not
    against how recently the case was touched.
    **⚠️ AND THIS DIAGNOSTIC IS SHARPER AFTER 2026-08-12, NOT BLUNTER: verifying and correcting steps
    against the build is now EXPLICITLY REQUIRED, so an expectation edit riding along inside a
    legitimate step correction has BETTER COVER THAN IT EVER HAD.** So when auditing, **diff the
    expected result SEPARATELY from the steps** — a pass that changed both in one edit must be able to
    **quote the new expectation back to a document** (Rule 58's quote-back test).
    **RATIONALE, 2026-08-05:** the QA lead found **FLT-BAR-01 =
    [C29557](https://shopview.testrail.io/index.php?/cases/view/29557)** asserting **build behaviour
    as expected behaviour**. It was **one of five Filters cases rewritten into "accepted behaviour"
    wording after [SV-8843](https://shopview.atlassian.net/browse/SV-8843) and
    [SV-8847](https://shopview.atlassian.net/browse/SV-8847) were closed** — **closing the tickets was
    read as ratifying the behaviour, which it was not.** He ordered a **full FOUR-WAY AUDIT of all
    three active projects' 748 cases**, categorising every expected result as: **build-derived but
    matching a documented requirement** / **build-derived with the source SILENT** / **legitimate
    label-only VIU correction** / **unsourced assertion to be REMOVED** — with the **audit committed
    as standalone evidence BEFORE any repair**, so the scale of the drift is on the record and cannot
    be quietly absorbed into a fix pass. Ties to Standing Rules 9 (build-accurate LABELS — the
    legitimate half of what the build gives us), 10 (VIU is a verification, not a rewrite), 12
    (observed, never inferred — and observing is not deciding), 13 (live feature-by-feature), 20
    (traceability — an expectation with no source is not authentic), 25 (cite the source you deviate
    from; its ambiguous clause is what produced this rule), 31 (source currency), 32 (latest
    authoritative source wins — a build is not a source), 33 (authority precedence), 41 (touch a case
    → re-verify it whole), 42 (scope-conditional wording is the repair, not substitution), 43
    (per-requirement coverage verdicts), 44 (a contradicting case is a bug report against ours), 45
    (the outside-in hunt), 46 (the deliberate-decisions register), 49 (a non-final build yields
    PROVISIONAL findings — all the more reason it cannot rewrite an expectation), 54 (the provenance
    line must name a real supporting source), 55 (an unclear answer goes back to the PO) and 56 (a
    later DECISION can move an expectation; a build cannot).
58. **AN AMBIGUOUS SOURCE IS NEVER RESOLVED BY LOOKING AT THE BUILD — an ingest pass holds and asks
    (all projects).**
    **ORIGIN (2026-08-05):** added by the QA lead's instruction after the Report Suite forensic
    reconstruction identified **ANSWER-INGEST, not VIU, as the mechanism** by which build behaviour
    became expected behaviour. **No existing rule guarded this path** — Rules 10/57 guard the VIU pass,
    which is where we would naturally have put the guard, and it is not where the damage came from.
    **⚠️ AMENDED SCOPE, 2026-08-06: "SOURCE" HERE INCLUDES THE DESIGN AND FIGMA (Rule 57, as amended),
    AND IT INCLUDES TWO SOURCES CONTRADICTING EACH OTHER — not only one source being vague.** A
    PRD-vs-design mismatch is exactly the kind of ambiguity this rule forbids settling from the build:
    **HOLD the affected cases, cite the open question on them, and ASK** (Rules 7/36/55/57).
    **THE RULE:** when ingesting a **PO answer, a spec delta, a walkthrough video, a tech plan or any
    other source**, if that source is **AMBIGUOUS about what the behaviour should be, the ambiguity is
    NEVER settled by observing what the build does.** An ambiguous answer goes **BACK to the PO
    (Rule 55)** and the affected cases are **HELD with the open question cited on them**.
    **WHY THIS IS THE DANGEROUS PATH, PLAINLY: reaching for the build to break a tie is how build
    behaviour becomes expected behaviour WITHOUT ANYONE DECIDING TO DO IT.** Nobody sets out to
    substitute the build; they set out to resolve an ambiguity, the build is the only concrete thing in
    the room, and the observation wins by default. **The edit then looks sourced** — it was made during
    a pass that legitimately cites a PO answer — **so it survives every later review.**
    **MECHANICS (checkable, so a pass can PROVE it complied):**
    **(a) PER-ANSWER CLASSIFICATION.** An ingest pass **records, for every answer/delta it ingests, one
    verdict: UNAMBIGUOUS (act on it) or AMBIGUOUS (hold + ask)** — with the ambiguity named. **A pass
    whose log classifies nothing is non-compliant**, because "we understood it" is not a record.
    **(b) THE QUOTE-BACK TEST — the hard gate.** **An ingest pass may NOT produce a case edit whose new
    expected result cannot be QUOTED BACK to the source text.** Every case edited during an ingest must
    be able to show **its new expectation quoted from the document** (Rule 45(e)'s both-texts-side-by-
    side standard). **If it cannot be quoted, THE EDIT IS INVALID** — not "weakly sourced", invalid —
    and it is reverted or held, never shipped with a hopeful provenance line (Rule 54).
    **(c) THE HELD CASES CARRY THE QUESTION**, and the question goes into the **OUTSTANDING-ITEMS
    REGISTER** (Rule 36) until answered — so the gap stays visible instead of being quietly filled.
    **⇒ SCOPE CLARIFIED 2026-08-12 (Standing Rule 9's amendment) — THIS RULE IS ABOUT *EXPECTATIONS*,
    AND THE DISTINCTION IS WORTH STATING BECAUSE IT LOOKS LIKE A CONTRADICTION AND IS NOT:**
    **· AN AMBIGUOUS SOURCE ABOUT A *STEP OR A ROUTE* IS SETTLED AGAINST THE BUILD — that is not a
    breach of this rule, it is Rule 9's obligation.** If the spec does not say which menu holds a
    control, **you verify it against the build and write the route that works.** Nothing is being
    decided about what the product SHOULD do.
    **· AN AMBIGUOUS SOURCE ABOUT AN *EXPECTATION* IS HELD AND ASKED — this rule, unchanged.** The
    build may not break that tie, at any strength, for any deadline.
    **THE TEST THAT SEPARATES THEM IN ONE QUESTION: *"IF I WRITE THIS DOWN, AM I RECORDING HOW TO GET
    THERE, OR AM I DECIDING WHAT IS CORRECT?"*** The first is verification; the second is this rule's
    forbidden move. **AND THE THIRD THING, WHICH IS NEITHER: if the ambiguity is about WHETHER THIS
    CASE SHOULD EXIST AT ALL, the build settles nothing — that is coverage, and letting the build
    author it is Rule 9's guard 2.**
    **HONESTY CLAUSE:** this rule will sometimes leave a case **less specific than the build would
    allow us to make it, and that is the correct outcome.** A vague-but-sourced expectation with an open
    PO question is **honest**; a precise expectation invented from the build is **confidently wrong and
    hides the fact that nothing was ever decided** (Rule 57's deeper harm).
    **RATIONALE, 2026-08-05 — the forensics, because the mechanism is the lesson.** The Report Suite
    audit replayed **ALL 41 commits that ever touched the case source** and established two things that
    together point at exactly one door: **the two pure VIU passes changed ZERO expectations**, and **NO
    pass ever changed a case's steps and its expectation body together** (the failure mode Rule 57's
    diagnostic warns about **did not occur here**). **The contamination entered via an ANSWER-INGEST
    pass, where an ambiguous PO answer met an observed build and the observation won.** The result was
    **ONE Location-column boilerplate paragraph pasted into 14 cases across ALL SIX reports**,
    contradicting **PV S3-R10, TU S10-R4, WIP S4-R3, IV S7-R6 and SBR S20-R1** — and on
    **[C30352](https://shopview.testrail.io/index.php?/cases/view/30352)** it **OVERWROTE wording that
    was near-verbatim from that report's own spec**, i.e. it replaced a correct sourced expectation with
    an observation, and a manifest later recorded the correct line as *"wrong under both readings"*.
    **The guard we would naturally have placed on the VIU pass would have missed every bit of this.**
    Ties to Standing Rules 7 (plain layman wording for the ask), 11 (ask which process on new inputs),
    12 (observed, never inferred — and an observation is not a decision), 20 (an unsourced expectation
    is not authentic), 25 (quote the source verbatim), 31 (source currency), 32 (latest authoritative
    source wins — a build is not one), 33 (authority precedence), 43 (an unanswered question leaves a
    requirement row un-verdicted and that must be VISIBLE), 45 (both texts quoted side by side; one row
    per assertion), 54 (the provenance line must name a source that genuinely supports the
    expectation), 55 (an unclear answer goes straight back to the PO), 56 (disclose a divergence rather
    than absorb it) and 57 (the source of expected behaviour is the document, never the build — this
    rule closes the door 57 did not know about), **and 9 (an ambiguity about the ROUTE is settled
    against the build; an ambiguity about the EXPECTATION is held and asked)**.
59. **RE-READ THE SOURCES IMMEDIATELY BEFORE THE WRITES BEGIN — a second currency check, not only the
    one at pass start (all projects).**
    **ORIGIN (2026-08-05):** added by the QA lead's instruction after two same-day incidents in which a
    source moved **between pass start and write start**. It is recorded in the Report Suite state as the
    lesson *"re-read the sources immediately BEFORE the writes begin, not only at pass start."*
    **THE RULE:** **Standing Rule 31's currency pre-flight happens at PASS START. This rule adds a
    SECOND check immediately BEFORE THE WRITE PHASE BEGINS.** Re-fetch the **governing spec version(s)**
    and re-read **any blocking ticket** at the **moment you rely on them**. **If a source moved between
    pass start and write start: STOP, RE-DIFF, and RE-DERIVE the affected edits before writing.** **A
    pass may NOT write conclusions drawn from a source that has since changed** — those conclusions
    were correct when reached and are wrong when written, which is the worst combination, because the
    execution log will show them as carefully verified.
    **MECHANICS (checkable):** the execution log records **BOTH timestamps — "sources read at pass
    start: <UTC>" and "sources re-read at write start: <UTC>"** — and **states the VERDICT of the second
    read** (unchanged, or what moved and what was re-derived). **A pass whose log shows only ONE
    source-read timestamp is NON-COMPLIANT**, exactly as an audit log showing only *"200 OK"* is
    (Rule 50).
    **SCOPE NOTE:** this is a **cheap** check — a version number and a ticket status — deliberately so,
    because it must be affordable enough to run on **every** pass without anyone reasoning their way out
    of it. It is **not** a second full pre-flight; the full Rule-31 sweep stays at pass start.
    **RATIONALE, 2026-08-05 — two incidents, the same day.**
    **(a) THE PO EDITED ALL SIX SPECS MID-PASS.** Chris Ward edited **every one of the six Report Suite
    specifications while a repair pass was running**: **SBC v13→14 at 13:07Z**, **PV v4→5 at 13:21Z —
    ONE MINUTE before that spec was fetched** — then **SBR v15→16, TU v5→6, WIP v6→7 and IV v3→4 between
    13:55Z and 14:23Z**, all messaged *"Applied QA review workbook decisions"*. **The four late ones
    RATIFIED the toggleable Location model and FLIPPED THE EXACT ANCHORS THE PASS HAD CITED (TU S10-R4,
    WIP S4-R3)** — so wording the pass correctly removed became, for those reports, **what the spec now
    says**. The audit **was right against the sources as they stood at 13:20–13:55Z** and was
    **partly overtaken within the hour**. **The sources had been read only ~35 minutes earlier and that
    was already enough.**
    **(b) THE PO ANSWERED AND CLOSED A BLOCKING TICKET HOURS AFTER A REPORT RELIED ON IT.** Branko
    answered and closed **[SV-8825](https://shopview.atlassian.net/browse/SV-8825)** — *"This is updated
    in the filters prd, I'm closing it."* — **after** `READINESS-2026-08-05.md` had been finished stating
    it was still Open with **zero comments**, which froze 8 phone cases on a question that was already
    settled.
    **HONESTY NOTE, RECORDED DELIBERATELY: our own first write-up of (b) said the gap was "28 minutes",
    and that was WRONG — a `-0500` timestamp was read as UTC. The real gap was FIVE AND A HALF HOURS.**
    It is recorded here because **a misread timezone inside an evidence claim is itself a defect**: it
    made a near-miss look like an impossible-to-avoid coincidence, when in truth a re-read at write time
    would have caught it comfortably. **Timestamps carry offsets; convert them, do not eyeball them.**
    Ties to Standing Rules 12 (observed, never inferred — including WHEN it was observed), 25 (cite the
    source and its version verbatim), 31 (**this rule is its second half — the pre-flight is not a
    one-shot**), 32 (latest authoritative source wins, which is meaningless if we read it once), 36 (a
    moved source becomes an outstanding re-diff and belongs in the register), 37 (the cheap Tier-1
    currency check is exactly what this re-read reuses), 43 (a moved spec re-opens per-requirement
    verdicts), 49 (the build is a source too — re-read its marker before writing), 50 (an execution log
    that omits its verification timestamps is non-compliant) and 55 (a PO answering mid-pass is a new
    input, not noise).
60. **THE BUILD WILL NEVER BE DECLARED FINAL — SEPARATE WHAT DEPENDS ON THE BUILD FROM WHAT DOES NOT
    (all projects).**
    **⚠️ THE HEADLINE ABOVE WAS AMENDED 2026-08-10 — IT IS NOW TRUE ONLY *PER REPORT*. Read this
    block before quoting "never declared final". The original wording and its 2026-08-05 directive
    are kept below verbatim and dated, not overwritten (the Rules 31/52/53 pattern).**
    **⚠️ AND IT MOVED AGAIN ON 2026-08-11 — THE REPORT SUITE BRANCH IS NOW FINAL FOR ALL SIX REPORTS,
    SO THE HEADLINE IS FALSE OF THAT BRANCH OUTRIGHT. IT REMAINS TRUE OF SCHEDULE (`sv8685`) AND
    FILTERS (`sv8785`), NEITHER OF WHICH HAS BEEN DECLARED FINAL.** See the 2026-08-11 amendment at
    the tail of Standing Rule 49; the two blocks below are kept as the dated record of the "never
    final" and "3 of 6" positions, not as the current state.
    **🛑 ⚠️ AND IT MOVED ONCE MORE, LATER ON 2026-08-11 — THE HEADLINE ABOVE IS NOW FULLY SUPERSEDED
    AND IS FALSE OF EVERY BRANCH. ALL THREE ARE FINAL.** QA lead, verbatim: ***"The Branches are Final
    now."*** — plural, given immediately after he confirmed all six reports were handed off, so it
    covers **SCHEDULE (`sv8685`) and FILTERS (`sv8785`) as well as the REPORT SUITE (`sv8582`).**
    **THE HEADLINE AND EVERY BLOCK BELOW ARE KEPT VERBATIM AND DATED, NOT DELETED** (the Rules
    31/52/53 pattern): they are the dated record of the "never final", "3 of 6" and "Report Suite
    only" positions, and they show WHEN each branch became final.
    **🔑 NOTHING IN THIS RULE'S STRATEGY IS DISCARDED — ONLY ITS HEADLINE PREMISE.** The layer split
    (what depends on the build versus what does not), **every practice (a)–(f)** and **the honesty
    clause** all **STAND UNCHANGED AND STILL GOVERN REDEPLOYS**, because *"final"* means **handed off
    / feature-complete**, **not** *"the code will never change"*: all three branches can still
    redeploy — not least to fix the very defects we are reporting — so **a redeploy still invalidates
    layers 1–2 (the on-screen labels and the pass/fail verdict) on every one of them.** **What
    finality removes is a different doubt: whether a gap is an UNFINISHED FEATURE or a DEFECT. On all
    three it is now a defect.**
    **⇒ AND THE DEVELOPERS' OWN BEHAVIOUR CONFIRMS IT, 2026-08-11.** QA lead, verbatim: ***"remember
    the developers said that those builds are final but they keep on pushing new builds as they fix a
    reported issue which they will keep on doing until the last bug for those projects is fixed."***
    **So deploys CONTINUE after finality, indefinitely, and each one is likely to be a fix for a defect
    WE reported.** Three consequences, all of which this rule's layer split already produces — **layers
    1 and 2 are still invalidated by every redeploy, even on a final branch** (practice (b) governs
    unchanged) · **a gap on a final feature is a DEFECT, not unfinished work** · and **build stamps go
    stale BY DESIGN, which is the normal state of an actively-fixed branch and never something to
    "fix" by re-stamping a date nobody observed** (practice (f) + Rule 12). Full text at the tail of
    Standing Rule 49.
    **🔵 ⇒ AMENDMENT, 2026-08-12 — A BUG-FIX DEPLOY DOES **NOT** MAKE A PRIOR PASS STALE. THIS
    REFINES THE BLOCK IMMEDIATELY ABOVE AND PRACTICE (b) BELOW; THE LAYER SPLIT ITSELF IS UNTOUCHED.**
    **USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule
    25 applies to his instructions as it does to a spec):** *"don't worry about them shipping the new
    biuilds everytime they fix a bug, they are just fixing the reported bugs which are to help fix the
    reported issues and not adding any functionality to the build, so that does not make your previous
    pass as stale."*
    **HIS REASONING IS THE OPERATIVE PART, NOT A COURTESY: THESE DEPLOYS FIX REPORTED ISSUES AND ADD
    NO FUNCTIONALITY, SO THEY CANNOT HAVE MOVED THE LABELS, ROUTES, PRECONDITIONS OR STEPS THAT A PASS
    HAS JUST VERIFIED.** A deploy that changes nothing a pass looked at cannot invalidate what that
    pass found.
    **WHAT IS ENCODED — THREE THINGS:**
    **· (1) PREVIOUSLY VERIFIED WORK REMAINS VERIFIED ACROSS A BUG-FIX DEPLOY.** Labels, navigation,
    preconditions and steps that were checked stay checked, and their **Rule-54 sentence-2 build
    stamps remain HONEST RECORDS OF A REAL CHECK** — not stale claims to be apologised for.
    **· (2) A PASS IS NOT RE-RUN MERELY BECAUSE THE MARKER MOVED.** Re-verification is driven by
    **WHAT ACTUALLY CHANGED** — a fixed defect's own cases, a shipped feature, a changed requirement —
    **never by the marker alone.** A marker change is a fact to record, not a trigger to act on.
    **· (3) WHAT STILL HOLDS, IN FULL. THE STAMP KEEPS NAMING THE BUILD IT WAS ACTUALLY CHECKED ON,
    AND A DATE NOBODY OBSERVED IS NEVER INVENTED (Standing Rule 12, RESTATED INTACT AND NOT WEAKENED
    BY ONE WORD).** This amendment says a prior check **STILL COUNTS**; it does **NOT** say the check
    may be **RE-DATED**. **Re-stamping a case to a build nobody opened it against is a fabricated
    observation and remains barred** — exactly as practice (f) and the 2026-08-11 block above already
    say. **AND A CASE WHOSE OWN SPECIFIC DEFECT WAS THE THING FIXED GENUINELY DOES NEED RE-CHECKING**
    — which is precisely what **Rule 61's expect-fail three-outcome instruction already detects at no
    cost**, outcome (3) being the shipped fix reporting itself through the next automated run.
    **⚠️ THE HONEST LIMIT — WRITTEN DOWN BECAUSE A RULE WITH NO LIMIT GETS OVER-APPLIED IN THE
    DANGEROUS DIRECTION.** This rests entirely on the deploys being **BUG-FIX-ONLY**. **IF A DEPLOY
    ADDS OR CHANGES FUNCTIONALITY, RULE 60's LAYER INVALIDATION APPLIES EXACTLY AS BEFORE** — layers
    1 and 2 go stale and practice (b) governs unchanged. **AND WE GENERALLY CANNOT TELL WHICH KIND A
    DEPLOY IS FROM THE MARKER**: an app-version string says a build shipped, never what it contained.
    **SO THE PRACTICAL GUIDANCE IS DELIBERATELY ASYMMETRIC: DO NOT PRE-EMPTIVELY DISCARD A PASS OVER A
    MARKER CHANGE — TREAT A SPECIFIC, OBSERVED CONTRADICTION AS THE TRIGGER INSTEAD.** A control that
    is genuinely no longer where a step says it is, a precondition that can no longer be reached, a
    label that has genuinely changed: **those are triggers. A new hash is not.**
    **🔧 WHAT THIS REPAIRS, AND IT IS THE POINT OF THE RULING: PASSES HAVE BEEN REPORTING *"only N of
    M rest on the build now running"* AS THOUGH THE REMAINING M−N WERE WORTHLESS. UNDER THIS RULING
    THAT FRAMING IS WRONG AND IT UNDERSTATES THE POSITION — THOSE VERDICTS STAND.** The cost was real
    and it was paid today: **Schedule and Filters both redeployed at approximately 12:10 GMT on
    2026-08-12** *(reported context, on which this ruling was given; NOT re-verified by this
    documentation-only entry — Rule 12)*, and the honest-but-unhelpful conclusion drawn from Rule 60
    read literally was that **a full day's runnability verification had gone stale within the hour.**
    **It had not.** The same over-reading is what produced a week of readiness reports discounting
    their own sound work — the 2026-08-11 figures *"only 51 of the 476"*, *"every Filters verdict now
    predates the build that is running"* and *"165 of the 168 have NOT been re-observed on the build
    running now"* are all **kept exactly as written elsewhere in this file, as the dated record of what
    was believed at the time**, and are **re-read under this amendment as UNDERSTATEMENTS rather than
    as findings.**
    **📋 THE BOOKKEEPING DOES NOT CHANGE — ONLY THE INTERPRETATION.** **Rule 67's completion table
    STILL REPORTS THE BUILD A CASE WAS CHECKED AGAINST**, split as it requires, because that remains a
    **fact worth stating** and a reader is entitled to it. **What changes is what the split MEANS:** a
    case checked on an earlier build across bug-fix-only deploys is **verified**, not **owed**.
    **Rule 60(d) still bars the blanket caveat**, and **Rule 60's honesty clause is untouched — a row
    that was NEVER observed is still unobserved, and this amendment converts nothing into a
    verification that was not performed.**
    Ties to Standing Rules 9 (**layer 1 is the runnable route — this is what stops a bug-fix deploy
    forcing it to be re-walked**), 10 (VIU's live-observation step), 12 (**observed, never inferred —
    restated intact above: a prior check still counts, and a date nobody observed is still never
    invented**), 17 (complete data in/out — the honest N-of-M survives, correctly interpreted), 49
    (**a queue row's trigger is the thing it is waiting on, not a deploy — this amendment is that
    principle applied to a whole pass**), 54 (sentence 2 keeps naming the build actually checked), 57
    (expectations come from documents and were never at risk from a deploy at all), 59 (re-read the
    sources before you rely on them — a genuine functionality change is found this way, not from a
    hash), 61 (**outcome (3) is how a shipped fix reports itself, which is why a fixed defect's own
    cases need no manual sweep**) and 67 (**the table still reports the build; the interpretation of
    its split is what this amendment corrects**).
    **THE HONEST CONSEQUENCE: 433 cases across the three projects are FINAL BUT NOT BUILD-VERIFIED**
    (Schedule 174 · Filters 8 · Report Suite 251) against **331 that are** (Report Suite 225 · Filters
    106), **with the release on Thursday** — so this **raises** the outstanding work rather than
    lowering it. Full text, the per-project evidence paths and the arithmetic correction to the
    first-stated "425 / 339": the later 2026-08-11 amendment at the tail of **Standing Rule 49**.
    **⇒ AMENDMENT, 2026-08-10 — THE FIRST FINALITY ANSWER WE HAVE EVER HAD, AND IT IS PARTIAL.
    ⚠️ SUPERSEDED 2026-08-11 — ALL SIX ARE NOW FINAL; kept verbatim and dated.** The
    QA lead ruled that the Report Suite branch **is final for the three reports already handed off to
    QA — WORK IN PROGRESS · TECHNICIAN UTILIZATION · SALES BY CUSTOMER** — and **not final for SALES BY
    REPRESENTATIVE · PARTS VELOCITY · INVENTORY VALUE**, with branch-wide finality requiring all six.
    **The verbatim directive and the full consequences are recorded at the tail of Standing Rule 49**,
    which is where finality lives; they are cross-referenced here rather than duplicated.
    **⇒ AMENDMENT, 2026-08-11 — THE CONDITION IS MET: *"note that ALL 6 reports have been handed off
    now."*** So **the Report Suite branch IS FINAL**, findings on **all 476** of its cases are **no
    longer provisional pending development**, and its **Rule-49 queue rows MAY CLOSE on the ordinary
    close condition — the bar is not lowered.** **EVERY LAYER DISTINCTION, EVERY PRACTICE (a)–(f) AND
    THE HONESTY CLAUSE BELOW STAND UNCHANGED**, and **a redeploy still invalidates layers 1–2 on a
    final report.** **THE HONEST CONSEQUENCE: only 225 of the 476 are build-verified; the other 251
    are FINAL-BUT-NOT-BUILD-VERIFIED**, which raises the outstanding work rather than lowering it.
    Full text and the per-report figures: the tail of **Standing Rule 49**.
    **WHAT THIS DOES *NOT* CHANGE — AND IT IS THE PART THAT WILL BE MISREAD:** **"final" means HANDED
    OFF / FEATURE-COMPLETE, NOT "the code will never change."** The branch can still redeploy, indeed
    to fix the very defects we are reporting, so **A REDEPLOY STILL INVALIDATES LAYERS 1–2 (the
    on-screen labels and the pass/fail verdict) EVEN ON A FINAL REPORT.** **Every layer distinction,
    every practice (a)–(f), and the honesty clause below all stand unchanged.** What finality removes
    is a different doubt: whether a gap is an **unfinished feature** or a **defect**. On those three it
    is a defect.
    **ORIGINAL DIRECTIVE AND WORDING (2026-08-05 — TRUE WHEN WRITTEN; now true only per-report, per
    the amendment above; kept as the record):**
    USER DIRECTIVE (2026-08-05, verbatim): *"They are not declaring it as final - it is what it is now
    we have to work and strategize in a waqy that we do not fail and out test cases still stay current/
    runnable by the lay man and manual qa tester and they are all VIU's and all of those test cases are
    100% authentic and nothing is invented ever."*
    **THIS RULE IS THE STRATEGY, and its core insight follows directly from Rule 57: BECAUSE EXPECTED
    BEHAVIOUR COMES FROM DOCUMENTS, A REDEPLOY CANNOT INVALIDATE AN EXPECTATION.** Only **THREE** things
    go stale when the build moves, and they are a **far smaller surface than a whole suite**:
    **(1) THE ON-SCREEN LABELS AND THE NAVIGATION PATH** — the Rule-9 layer (button text, field names,
    screen names, step order, where you click).
    **⚠️ LAYER 1 WAS WIDENED 2026-08-12 (Standing Rule 9's amendment) — IT IS THE WHOLE RUNNABLE
    ROUTE: THE PRECONDITIONS AND THE STEPS AS WELL AS THE LABELS AND THE NAVIGATION PATH.** The
    original wording is kept above and dated, not overwritten (the Rules 31/52/53 pattern). **A
    redeploy can make a precondition unreachable or a step un-executable just as easily as it can
    rename a button**, so practice (b) below re-checks all of it — and **the re-check is a
    VERIFICATION against the build, never an occasion to re-author the steps around what the new
    build makes convenient** (Rule 9, guard 2). **This is the layer whose staleness stops a tester
    dead**, which is why it heads the list.
    **(2) THE PASS / FAIL / DEVIATION VERDICT.**
    **(3) THE MARKERS THAT ASSERT A BUILD FACT** — `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` and
    `AUTOMATION: HOLD - <not built>`. **NOTE, because this is routinely got wrong: plain
    `AUTOMATION: READY` asserts that a case is AUTOMATABLE, NOT that it currently passes — so it is
    BUILD-INDEPENDENT and SURVIVES A REDEPLOY untouched.** **AMENDED 2026-08-06: THE EXPECT-FAIL
    MARKER'S STALENESS IS NOW DETECTED BY THE SUITE ITSELF, NOT BY RE-OBSERVATION** — under **Standing
    Rule 61** the case names the exact observable SYMPTOM and its three outcomes, so a fix that has
    shipped (outcome 3) or a failure that has CHANGED (outcome 2) is reported by the next automated
    run. **`AUTOMATION: HOLD` is the part that still needs a human trigger**, and that trigger is the
    thing it is waiting on, not a deploy.
    **EVERYTHING ELSE — the expectation, the requirement anchor, the spec version, the epic/story
    reference, the traceability, the Rule-54 SOURCE sentence — is BUILD-INDEPENDENT and survives a
    redeploy unchanged.**
    **WHAT THIS REQUIRES IN PRACTICE:**
    **(a) STATE THE LAYER.** Per case, and in **every readiness report**, say **which layer a claim
    belongs to** — a documented expectation, a label observation, a verdict, or a build-fact marker.
    **(b) ON A REDEPLOY, RE-CHECK ONLY LAYERS 1–2 PLUS THE `HOLD` HALF OF LAYER 3.** **AMENDED
    2026-08-06 (the clause used to read "layers 1–3"):** under **Standing Rule 61** the automated suite
    detects a stale `READY - EXPECT FAIL` **itself** — the case names the symptom and its three
    outcomes, so a shipped fix or a changed failure is reported by the next run — therefore that half
    of layer 3 no longer needs re-observation on a deploy. **The `HOLD` half still does need a human,
    and its trigger is the thing it is actually waiting on, not a deploy.** Do **NOT** re-derive the
    suite, re-read the spec
    per case, or re-audit expectations — a redeploy is not a spec change, and treating it as one is how
    a cheap re-check turns into an unaffordable one that then does not happen at all.
    **⚠️ AMENDED 2026-08-12 — THIS PRACTICE IS SCOPED BY THE BUG-FIX-DEPLOY AMENDMENT ABOVE, AND THE
    WORDING ABOVE IS KEPT VERBATIM AND DATED, NEVER DELETED (the Rules 31/52/53 pattern).** *"ON A
    REDEPLOY"* now means **on a redeploy THAT ADDS OR CHANGES FUNCTIONALITY**. **A BUG-FIX-ONLY DEPLOY
    TRIGGERS NO RE-CHECK OF LAYERS 1–2** — QA lead, verbatim: *"they are just fixing the reported bugs
    … and not adding any functionality to the build, so that does not make your previous pass as
    stale."* **The trigger is a SPECIFIC, OBSERVED CONTRADICTION — a control genuinely moved, a
    precondition genuinely unreachable, a label genuinely changed — NEVER a changed app-version
    string.** Where the deploy's content is unknown (the ordinary case, since a marker says nothing
    about what shipped), **do not pre-emptively discard the pass**; and where the deploy is known to
    have added or changed functionality, **this practice governs unchanged as written above.**
    **(c) KEEP THE RULE-49 QUEUE PERMANENTLY OPEN AS THE STANDING MECHANISM, NOT AN EXCEPTION.** The
    branches will not be declared final, so an OPEN queue is now the **normal steady state** of an
    active project — it is a **living work list**, not an embarrassment to be closed.
    **(d) NEVER LET "THE BRANCH IS NOT FINAL" BECOME A BLANKET CAVEAT.** A caveat applied to everything
    tells the reader nothing and **makes the whole report meaningless**. A report must say **exactly
    which cases were observed, on WHICH BUILD MARKER, and HOW MANY WERE NOT** — numbers, not a banner.
    **(e) BUILD A RE-RUNNABLE LABEL-AND-VERDICT CHECKER PER PROJECT**, so a redeploy costs a **cheap
    automated re-check** rather than a full manual pass. This is the practical difference between a
    suite that stays current under continuous deployment and one that quietly rots.
    **(f) STATE PER CASE WHEN IT WAS LAST CHECKED** — that is **Rule 54's sentence 2**, and it is what
    makes the honest split in (d) derivable from the cases themselves rather than from memory.
    **HONESTY CLAUSE — READ THIS BEFORE QUOTING THE RULE AS COMFORT.** **A suite may still NEVER be
    called fully verified while rows are unobserved.** This rule makes the re-check **AFFORDABLE**; it
    does **NOT** licence claiming coverage we do not have, and it does not convert an unobserved row
    into a verified one (Rules 12/17/50). The correct sentence remains *"N of M observed on build
    <marker>; the remaining M−N carry their last recorded check"* — never *"the suite is current"*.
    **RATIONALE, 2026-08-05:** **all three QA branches redeployed on the same day.** Schedule's marker
    moved mid-morning (`v3.5-4873abe` → `v3.5-be42149`, 08:09 UTC) and **invalidated 165 provisional
    verdicts**; Report Suite moved to **`v3.5-16cf83f`**; Filters sat on `v3.4.2-d00239b` having moved
    the day before. **Engineering has now confirmed the branches will NOT be declared final before
    release**, so the Rule-49 "wait until the build settles" assumption **has no end date and needed
    replacing with a strategy.** Today's passes achieved a **complete correctness audit of all 748
    cases** but only **PARTIAL live observation — 7 of 165 on Schedule, 29 of 110 on Filters, and Report
    Suite not per-case at all** — which is precisely the shortfall this rule exists to make manageable
    rather than permanent. Ties to Standing Rules 9 (the label layer is the part a redeploy really does
    invalidate), 10 (VIU's live-observation step), 12 (observed, never inferred — an unobserved row
    stays unobserved), 13 (live feature-by-feature), 17 (complete data in/out — the honest N-of-M), 22
    (ask for the live check + access up front), 31 (the build is a source and its currency is checked),
    36 (an OPEN queue and a missing sign-in are outstanding items), 49 (**this rule is how a
    never-final build is worked with rather than waited on**), 50 (exhaustive and exact — the re-check
    covers every row of layers 1–3, no sampling), 54 (sentence 2 is the per-case record of when it was
    last checked) and 57 (because expectations come from documents, a redeploy cannot invalidate them —
    that is the whole reason this strategy is possible), **and 9 (layer 1 is the whole runnable route
    — preconditions and steps included — and an unverified step is an unverified case in the N-of-M
    the honesty clause demands)**.
