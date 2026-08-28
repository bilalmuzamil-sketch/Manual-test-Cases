# ShopView QA — Standing Rules 61–96

This file holds the FULL, VERBATIM text of Standing Rules 61–96.

Full archive: build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md
Index: CLAUDE.md (rule index table). Other rule files: build/rules/RULES-01-20.md, build/rules/RULES-21-40.md, build/rules/RULES-41-60.md, build/rules/RULES-61-96.md

**Read the rule you are about to apply here, in full — the index is not the rule.**

---

61. **THE EXPECT-FAIL MARKER IS AN INSTRUCTION, NOT A PREDICTION — NAME THE SYMPTOM, AND LET THE
    SUITE BE THE MONITOR (all projects).**
    **ORIGIN (2026-08-06):** the QA lead proposed that the ticket link plus the tested-on date already
    makes an expect-fail case self-documenting, because a reader can track the ticket. The objection
    put to him was that **TICKET STATUS IS NOT A RELIABLE PROXY FOR BUILD STATE**, and he agreed,
    verbatim: *"I agree with you then lets make a strategy that doesnt bite in any case"*.
    **THE PROBLEM IN ONE LINE:** `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` as it stands is a
    **PREDICTION about the build's future state**, and **predictions go stale**. The obvious remedy —
    re-verifying every deviation on every redeploy — is **unwinnable**: the **Schedule QA branch
    redeployed FOUR TIMES IN TWO DAYS**.
    **⇒ AMENDMENT, 2026-08-11 — AN EXPECT-FAIL MARKER NEEDS LIVE BACKING. NO BACKING, NO MARKER.
    THIS ADDS A PRECONDITION FOR SETTING ONE; IT DOES NOT CHANGE THE SHAPE OF A LEGITIMATE ONE.**
    USER DIRECTIVE (2026-08-11, verbatim, his typing preserved exactly as he wrote it): *"WHen there
    is nothing to back 'Expect fail' then not set that marker. And let the manual QA tester simply
    discover whether this test fails or passes and mark the test case accordingly in the tesrail"*
    **THE PRECONDITION:** `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` may be set **ONLY where a LIVE
    source actually backs it** — an **OPEN ticket describing the failure**, or an equivalent
    **documented basis**. **No backing, no marker.**
    **WHERE THE BACKING IS ABSENT, STALE, OR WAS NEVER ESTABLISHED, THE MARKER COMES OFF** and the case
    carries plain **`AUTOMATION: READY`**. The manual tester then **DISCOVERS** whether it passes or
    fails and records that in TestRail. **WE DO NOT PREDICT ON THE TESTER'S BEHALF.**
    **A CLOSED OR OBSOLETE TICKET DOES NOT BACK THE MARKER.** This is concrete, not theoretical: **31
    of the 33 tickets behind the Report Suite's expect-fail cases are closed**, several confirmed fixed
    on **10 August** — so those markers are **telling a tester to ignore a failure that may no longer
    exist**, which is the precise inverse of what the marker is for.
    **WHAT IS UNCHANGED — THE THREE-OUTCOME INSTRUCTION STAYS** for markers that **ARE** properly
    backed; it is what makes a live expect-fail an instruction rather than a prediction. **What changes
    is the PRECONDITION for setting one at all.**
    **AND THIS IS NOT A LICENCE TO GUESS THE OTHER WAY (Rules 12 + 57).** An unbacked expect-fail
    **asserts a build fact nobody observed**, which **Rule 12** forbids; and a marker written from what
    the build merely happens to do is **build-derived expectation through a side door**, which **Rule
    57** forbids. **Removing an unbacked marker does not soften the case — it RESTORES the case's
    ability to fail**, which is the whole point of holding an expectation.
    **WORKED EXAMPLE, AND IT CUTS AGAINST OUR OWN RECENT WORK:** the six Schedule Panel collapse cases
    **C43582–C43587** carry `AUTOMATION: HOLD - the panel collapse control is not in the build`. Under
    this ruling that is **wrong on both counts** — the control's **absence is perfectly observable**, so
    it is **not** a genuine `HOLD` (this rule already reserves `HOLD` for a **truly unobtainable**
    thing), and **no ticket backs an expect-fail** either. **They should carry plain
    `AUTOMATION: READY`**, and the tester runs them, fails them, and records it. **They were NOT
    written by this pass** — a separate pass is taking the whole expect-fail population so the change
    lands consistently across all three projects.
    **THE CORE RULE:** an `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` case MUST state, **in the
    TESTER-FACING Expected Results, THE EXACT OBSERVABLE SYMPTOM of the known failure**, and then what
    to do in **EACH of three outcomes**:
    **(1) IT FAILS WITH THAT SYMPTOM** → the known problem, already reported: **mark it failed and
    raise nothing new.**
    **(2) IT FAILS IN A DIFFERENT WAY** → **that is a NEW problem: report it.**
    **(3) IT PASSES** → **the fix has shipped: report it** so the ticket can be closed and the marker
    removed.
    **WHY OUTCOME (3) IS THE WHOLE POINT: it makes the automated run ITSELF the detector.** A fix that
    ships silently while its ticket sits Open is caught by **the very run that would otherwise be
    confused by it** — **at no cost, continuously, with no re-verification pass and no ticket
    polling.**
    **WHY OUTCOME (2) MATTERS, AND IT IS THE GENUINELY NEW PART:** a case can keep failing **FOR A
    DIFFERENT REASON THAN ITS TICKET DESCRIBES**, hiding a **new defect behind an old one**. **Naming
    the symptom is the only thing that tells the two apart** — **nothing in the previous scheme could
    catch it**, because *"it failed, as expected"* reads identically either way.
    **TICKET STATUS IS NEVER READ AS EVIDENCE ABOUT THE BUILD** — **not to set a marker, not to clear
    one, not to decide whether a case needs re-checking.** It is **traceability, nothing more.** This
    is **Rule 57's sibling: a CLOSED ticket is not a spec change, and an OPEN ticket is not proof of a
    live defect.**
    **THE STANDING RE-CHECK TRIGGER CHANGES — and this is what makes the rule affordable.**
    *"Re-check every verdict on redeploy"* is **RETIRED as the default**. **The automated suite
    monitors itself.** Only cases that are **NOT automated — every `AUTOMATION: HOLD`** — need a human
    trigger, and **their trigger is the thing they are actually waiting on** (a PO answer, a feature
    shipping, an access blocker clearing) — **NOT a deploy.** The current scale, so the size of what
    still needs a human is honest: roughly **43 HOLD cases across the three active projects, against
    754 cases in total.**
    **THE REQUIRED WORDING — plain layman English (Rule 7). This is the canonical form to copy:**
    > *"What you should see today: <the exact symptom, in plain words>. This is a known problem and it
    > is already reported — see https://shopview.atlassian.net/browse/SV-xxxx.*
    > *· If you see exactly that, mark this test FAILED and do not raise anything new.*
    > *· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please
    > report it.*
    > *· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note
    > removed."*
    **PLACEMENT:** it sits **with the deviation note in Expected Results, BEFORE the Rule-54 provenance
    line**; the `AUTOMATION:` marker still goes **LAST**, with a **blank line before it and a line
    break after it**.
    **IT APPLIES EQUALLY TO A TICKET CLOSED AS ACCEPTED.** The qualifier already required — **"closed
    without a fix"** — sits **alongside** the symptom, so **nobody waits for a fix that is not
    coming**.
    **HONESTY CLAUSE:** this **does NOT licence claiming a case is verified when it has not been
    observed.** It changes **WHAT WE MONITOR, not what we may ASSERT.** An unobserved case is still
    unobserved, and **Rule 60's bar stands** — the correct sentence remains *"N of M observed on build
    <marker>; the remaining M−N carry their last recorded check"*.
    **RATIONALE, 2026-08-06 — FIVE evidenced failures of status-as-proxy, all from 2026-08-05/06.**
    **(a) A FIX SHIPPED WHILE ITS TICKET STAYED OPEN.**
    **[SV-8851](https://shopview.atlassian.net/browse/SV-8851) is still Open**, yet Tech Hours now
    writes the working window beside each technician and **SCH-VIEW-09 =
    [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) PASSES**. A reader checking the
    ticket would **wrongly conclude the test should still fail**.
    **(b) TWO TICKETS CLOSED OBSOLETE STILL REPRODUCE BYTE-IDENTICALLY** —
    **[SV-8843](https://shopview.atlassian.net/browse/SV-8843)** and
    **[SV-8847](https://shopview.atlassian.net/browse/SV-8847)**; a reader checking the tickets would
    **wrongly conclude they were fixed**.
    **(c) STATUS CARRIED NO INFORMATION AT ALL.**
    **[SV-8819](https://shopview.atlassian.net/browse/SV-8819) was walked through SEVEN STATUSES IN 22
    SECONDS** under our own shared account (Rule 53's corollary — his edits are indistinguishable from
    ours).
    **(d) A TICKET MIS-DESCRIBES THE VERY FAILURE IT EXISTS TO EXPLAIN.**
    **[SV-8827](https://shopview.atlassian.net/browse/SV-8827) is half wrong** — it asserts Tech Hours
    defaults ON; it **defaults OFF, correctly**.
    **(e) FIVE FILTERS CASES CARRIED EXPECT-FAIL MARKERS FOR FAILURES THAT NO LONGER HAPPENED**
    (**[SV-8828](https://shopview.atlassian.net/browse/SV-8828)** fixed) — and this was **found ONLY
    because somebody drove all 110 live**, which is precisely the expensive thing this rule removes the
    need for.
    **THE TRIGGER CHANGE IS WHAT MAKES THIS AFFORDABLE: the alternative was re-verifying HUNDREDS of
    cases against branches that redeploy daily** — a job that, being unaffordable, would simply not get
    done, and the markers would rot in place.
    Ties to Standing Rules 7 (plain layman wording — the three outcomes are written for a
    non-technical tester), 9 (build-accurate labels — the symptom is described in the words the tester
    will actually see), 10 (the VIU push stamps the symptom, the provenance line and the marker in the
    same write), 12 (observed, never inferred — a ticket status is not an observation), 13 (live
    feature-by-feature — outcome (2) is what keeps a live run informative instead of merely
    confirmatory), 17 (complete data in/out — EVERY expect-fail case carries all three outcomes, no
    sampling), 25 (cite verbatim — the symptom is quoted from what was actually seen, not paraphrased),
    29 (no work loss — the monitoring lives in the committed suite, never in anyone's memory), 36 (an
    outcome-(3) report is an OUTSTANDING item until the ticket is closed and the marker removed), 42
    (the symptom is written scope-conditionally, never as a closed enumeration a partial fix would
    break), 44 (a case that starts PASSING is a bug report against our own marker), 49 (**this scopes
    the re-check queue to what the suite cannot see**), 50 (exhaustive and exact — the symptom is
    stated precisely enough to be told apart from a different failure), 53 (we REPORT outcome (3); the
    QA lead closes the ticket — ticket fields are his), 54 (the provenance line still follows this
    note, and the marker still goes last), 57 (**its sibling — a closed ticket is not a spec change,
    and an open ticket is not proof of a live defect**) and 60 (**this is how layer 3, the build-fact
    markers, is monitored without re-observation**).
    **⇒ CROSS-REFERENCE, 2026-08-12 — THIS RULE IS WHAT MAKES STANDING RULE 60's BUG-FIX-DEPLOY
    AMENDMENT SAFE.** The one thing a bug-fix deploy genuinely *does* change is **the case whose own
    defect was fixed** — and that is exactly the case this rule already covers **at no cost**:
    **outcome (3) means the shipped fix REPORTS ITSELF through the next automated run**, and
    **outcome (2) catches a failure that has CHANGED rather than gone.** **So the correct response to
    a bug-fix deploy is NOT a manual sweep of the affected cases — it is the next run of the suite**,
    which is why Rule 60 can now say a marker change is not by itself a trigger. QA lead, verbatim
    (2026-08-12): *"they are just fixing the reported bugs … and not adding any functionality to the
    build, so that does not make your previous pass as stale."* **UNCHANGED: an expect-fail marker
    still needs LIVE BACKING (this rule's 2026-08-11 amendment) — a fix shipping is a reason to REMOVE
    a marker once reported, never a reason to assert a build fact nobody observed (Rule 12).**
62. **NO *JIRA TICKET* IS EVER CREATED WITHOUT THE QA LEAD'S EXPLICIT PERMISSION, ASKED FOR AND
    GRANTED FIRST (all projects, every ticket type).**

    > # 🛑 READ THIS BEFORE ANYTHING ELSE IN RULE 62
    >
    > ## THIS RULE AND ITS HOLD COVER **JIRA TICKET CREATION ONLY**.
    > ## **CREATING TESTRAIL TEST CASES IS *NOT* HELD, AND NEVER WAS.**
    >
    > **`add_case` IS PERMITTED AND EXPECTED. So is `update_case`. Authoring a case for an uncovered
    > requirement is THE JOB — it is not a thing to seek permission for, and a coverage gap is never
    > a reason to wait or to stop.**
    >
    > **USER DIRECTIVE (the QA lead — recorded in `build/OUTSTANDING-ITEMS-REGISTER.md` row H1 on
    > 2026-08-20 and relayed again on 2026-08-28 — verbatim, his typing preserved exactly as he
    > wrote it because Rule 25 applies to his instructions as it does to a spec):**
    >
    > > *"SOrry new case creation is not held for any project at all, see if you confused Hold on
    > > Jira ticket creation with Hold on New test case creation."*
    >
    > **WHY THIS BANNER EXISTS — THE FAILURE IT FIXES.** This rule already carried the same
    > correction, made on **2026-08-11**, but it sat **seventy-odd lines down**, *after* a
    > deliberately-preserved block of **superseded 2026-08-10 wording that says "NO new TestRail
    > case — `add_case` is barred."* **Two separate workers read the superseded line, believed
    > TestRail case creation was held, and STALLED REAL WORK.** Keeping a superseded reading visible
    > is right (the Rules 31/52/53 pattern); letting it be the FIRST thing a reader meets is not.
    > **The superseded wording below is untouched and still dated — but it is history, not the rule.**
    >
    > **SO, IN ONE LINE EACH:**
    > **· Jira ticket, any type, any project → BARRED until his next order. Prepare it, stop at the
    > button, ASK.**
    > **· TestRail test case, new or updated, any project → NOT HELD. Just do it.**
    > **· Any OTHER new artefact in an external system of record → still barred; TestRail cases are
    > expressly carved out.**
    >
    > **If you find yourself about to report a requirement as "cannot be covered while the hold
    > stands", you have made this exact mistake. Write the case.**

    USER DIRECTIVE (2026-08-10, verbatim): *"Just One NEW rule, DO NOT create the Tickets in Jira but
    ask for my permission first."*
    **THE RULE: no Jira ticket may be created without the QA lead's explicit permission, asked for and
    granted first.** This is **unconditional** and covers **EVERY ticket type on EVERY project** — a
    `Story Defect`, a `Bug`, a `Task`, a spec-defect ticket, a follow-up, anything. **We prepare the
    ticket; we do not create it.**
    **THE THREE WAYS THIS RULE COULD BE QUIETLY ERODED — each closed explicitly:**
    **(1) A BATCH APPROVAL DOES NOT COVER A LATER TICKET. Permission is PER ASK.** *"You approved the
    last six"* is **not** permission for a seventh, and an approval given for one pass does not carry
    into the next. **Silence is not consent, and an earlier yes is not a standing yes.**
    **(2) THE QUALITY OF THE FINDING IS NOT PERMISSION.** A defect being **real, sourced, live-verified,
    duplicate-searched and obviously worth filing** has **no bearing whatever on the authorisation**.
    *"It plainly needed a ticket"* is exactly the reasoning this rule exists to stop — **how good the
    finding is, and whether we may file it, are two unrelated questions.**
    **(3) EDITING AN EXISTING TICKET IS NOT CREATING ONE.** This rule governs **CREATION**. The
    description rewrites he ordered on **2026-08-06** (the five-part shape — see the ticket bullet in
    "Deliverable conventions the user likes") remain **permitted work**, as do comments, transitions and
    field corrections he has authorised. **Where there is any doubt which side of the line an action
    falls on, ASK** (Rule 6's logic — nothing enters a system of record unasked).
    **WHAT WE STILL DO, IN FULL — THE FINDING IS NEVER LOST:** every finding is **written up in the
    pass's findings file**, **logged in the OUTSTANDING-ITEMS REGISTER** (Rule 36), and **presented to
    him WITH OUR RECOMMENDATION** — in plain layman words (Rule 7), with the evidence, the source it
    deviates from quoted verbatim (Rule 25), the affected cases by internal ID + C-id + link (Rule 8),
    and the **ready-to-file ticket text**. **We do the whole job of preparing the ticket and stop at the
    button.** An unanswered ask is a **MISSING INPUT** (Rule 1) and stays **OUTSTANDING** until he
    answers — never quietly dropped, and never re-decided by us.
    **THIS STRENGTHENS STANDING RULE 51, WHICH IS NOW SUBSUMED AS A SPECIAL CASE.** Rule 51 (2026-08-04)
    already required asking before filing an **API-related** ticket, and framed that as the exception to
    an otherwise-permitted filing. **From 2026-08-10 the asking requirement is UNIVERSAL, so Rule 51's
    requirement is no longer an exception — it is one instance of the general case.** **Rule 51 STANDS
    and is NOT deleted:** its **reachability test** (*is the defect invisible to a user AND to a manual
    tester, reachable only by calling an endpoint directly?*) remains the useful way to **classify** a
    finding and decide **how to present it**, and its **withdrawal procedure** still governs an API
    ticket he rules should be withdrawn. **What changed is only its scope of novelty: asking is no
    longer special to API tickets.**
    **SUPERSEDED FRAMING, DATED AND KEPT VISIBLE (the pattern of Rules 31/52/53):** before 2026-08-10 a
    NON-API defect could be filed inside an approved batch without a fresh ask. **That is no longer true
    of any ticket, of any type, on any project.**
    **HOW A TICKET IS MADE ONCE PERMISSION IS GIVEN IS UNCHANGED — this rule is about WHETHER, not
    HOW.** **Rule 52's shape** (`issuetype` = `Story Defect`, `parent` = the **owning story**, the story
    also linked **`relates to`**) and **Rule 53's priority** (**`Medium`** since 2026-08-06, **`High`
    still barred**) govern the filing exactly as before.
    **RATIONALE, 2026-08-10:** ticket creation is the one thing we do that is **immediately visible to
    the whole engineering organisation** and **cannot be cleanly undone** — a withdrawn ticket stays on
    the record for good (Rule 51's own no-delete finding), so a ticket filed unasked costs the QA lead's
    credibility, not merely ours. The preceding week supplies the evidence for why the **per-ask** clause
    is the operative one: tickets were filed in **approved batches** across the Report Suite, Schedule
    and Filters passes, and the approvals **ran ahead of themselves** — a pass reading *"file these"* as
    licence for the next finding too, which is precisely how **SV-8822** came to be filed inside an
    approved batch of six and then had to be withdrawn (Rule 51). **A ticket not filed is recoverable in
    one minute; a ticket filed unasked is not recoverable at all.** Ties to Standing Rules 1 (never
    proceed without the complete input set — an unanswered ask IS a missing input), 6 (nothing written to
    a system of record without permission — **this is its Jira half; Jira is a real production system
    exactly as TestRail is**), 7 (the ask is in plain layman words), 8 (name the affected cases with
    their C-ids and links), 12 (observed, never inferred — **including never inferring permission**), 25
    (cite verbatim the source the finding deviates from), 36 (an unanswered ask is an OUTSTANDING item
    and belongs in the register), 46 (a deliberate non-filing is RECORDED, so it can never look like a
    miss), 48 (a held item quotes the ruling holding it — for these items, this one), 51 (**the
    API-ticket ask, now subsumed as a special case**), 52 (the shape, once permitted) and 53 (the
    priority, once permitted).
    **🛑 ⇒ ACTIVE HOLD LAYERED ON TOP OF THIS RULE, 2026-08-10 — "CREATE NOTHING". THIS IS A
    TEMPORARY HOLD WITH A LIFT CONDITION, NOT A NEW STANDING RULE, AND IT MUST NOT HARDEN INTO ONE.**
    **USER DIRECTIVE (2026-08-10, verbatim), answering a request for permission to file five prepared
    defects:** *"Do not create anything until my next order."*
    **THE DISTINCTION FROM RULE 62, STATED PLAINLY BECAUSE IT IS THE WHOLE POINT: RULE 62 SAYS *ASK
    FIRST*. THIS RULING SAYS *THE ANSWER IS NO FOR NOW* — and therefore THERE IS NOTHING TO ASK ABOUT
    UNTIL HE LIFTS IT.** Under Rule 62 alone, a well-prepared finding is presented with an ask; under
    this hold the ask itself is **premature**. The finding is still **prepared in full and written up**
    (Rule 62's "we do the whole job and stop at the button") — it is simply **not put to him** as a
    request until he gives the next order.
    **🔴 SCOPE — CORRECTED 2026-08-11 BY THE QA LEAD. THE HOLD IS **JIRA TICKETS ONLY**. CREATING AND
    UPDATING TEST CASES IS OUR CORE WORK AND WAS NEVER IN SCOPE.**
    **USER DIRECTIVE (2026-08-11, verbatim, his typing preserved exactly as he wrote it because Rule
    25 applies to his instructions as it does to a spec), answering the report that Schedule's new
    "Panel collapse" section had no test case and could not get one while the hold stood:**
    *"Schedule's new 'Panel collapse' section has no test case and can't get one while the hold
    stands. WHY? We are supposed to crfeate test cases and accurate ones and also which are VIU'd with
    the process attached to the VIU, remember I asked you to run a few processes with VIU whenever I
    ask you to run VIU. Dont forget that. And anything that stops you from creating/updating a test
    case You MUST let me know, we are supposed to create the test cases."*
    **THE CORRECTED SCOPE, IN THREE LINES:**
    **· NO Jira ticket, of any type, on any project — THIS HALF IS UNCHANGED and remains barred until
    his next order.**
    **· `add_case` IS PERMITTED AND EXPECTED. So is `update_case`.** **Authoring a case for an
    uncovered requirement is THE JOB — it is not a thing to seek permission for**, and a coverage gap
    is never a reason to wait.
    **· NO new artefact created in any external system of record — unchanged, EXCEPT that TestRail
    CASES are expressly carved out by the ruling above.**
    **⚠️ THE SUPERSEDED WORDING, KEPT VISIBLE AND DATED, NEVER DELETED (the Rules 31/52/53 pattern).**
    From 2026-08-10 until this correction this block read:
    *"SCOPE — STATED HONESTLY, INCLUDING WHERE THE BOUNDARY IS GENUINELY UNCERTAIN. He was answering a
    question about **Jira tickets**; his words are **"anything"**. The SAFE READING is therefore the
    one encoded, and it is deliberately the broader of the two: · NO Jira ticket, of any type, on any
    project. · **NO new TestRail case — `add_case` is barred.** · NO new artefact created in any
    external system of record."*
    **🛑 THE LINE YOU JUST READ — "NO new TestRail case — `add_case` is barred" — IS DEAD WORDING
    FROM 2026-08-10 AND IS QUOTED HERE ONLY AS HISTORY. IT IS NOT THE RULE. IT HAS BEEN WRONG SINCE
    2026-08-11 AND WAS CONTRADICTED AGAIN BY THE QA LEAD ON 2026-08-28 (see the banner at the top of
    this rule): *"SOrry new case creation is not held for any project at all, see if you confused
    Hold on Jira ticket creation with Hold on New test case creation."* CREATING TESTRAIL TEST CASES
    IS NOT HELD. Two workers have already stalled work by quoting this superseded line.**
    **BE PRECISE ABOUT WHAT HAPPENED: HE CLARIFIED; WE HAD READ HIM TOO BROADLY.** The ambiguity was
    flagged at the time and the broader branch taken — **the over-broad `add_case` bar was OUR
    reading, not his instruction.** **This is a correction to how we RECORDED his ruling, NOT a
    reversal by him**, and the record must show that plainly rather than let a future session read it
    as him changing his mind.
    **⇒ A NEW DUTY, IN HIS OWN WORDS: *"anything that stops you from creating/updating a test case You
    MUST let me know"*.** **A blocker on authoring or correcting a test case is REPORTED TO HIM
    IMMEDIATELY** — an access blocker, a missing source, a hold someone believes is in force, an
    unanswered authorisation, a tooling failure. **It is NOT parked in a gaps list, a coverage matrix
    or a findings file to be discovered later.** Log it in the **OUTSTANDING-ITEMS REGISTER** (Rule 36)
    **and raise it with him in the same breath**; where the blocker is a rule or a ruling we believe is
    in force, **surface it BEFORE the work rather than in the closing summary** (Rule 63). **The
    evidence for why this duty exists is this very correction: a coverage gap sat unauthored for a day
    because a hold was read too widely and the blockage was recorded rather than raised.**
    **WHAT EXPLICITLY CONTINUES: `update_case` ON CASES THAT ALREADY EXIST** — correcting wording,
    re-verdicting, re-stamping the Rule-54 provenance line, repairing an automation marker. **That is
    CORRECTION, NOT CREATION**, and it is precisely what he authorised when he required the three
    handed-off reports be **"100% authentic and VIU'd"**. Comments, transitions and field corrections
    on **existing** tickets remain governed by Rule 62's clause (3), unchanged.
    **WHERE A FUTURE WORKER CANNOT TELL WHICH SIDE OF THE LINE SOMETHING SITS, IT STOPS AND ASKS —
    it does NOT guess, and it does not resolve the ambiguity in favour of acting** (Rule 6's logic;
    Rule 12 — never infer permission). A local file written into this repository is not an external
    system of record and is not what he was addressing, but **anything that becomes visible to the
    engineering organisation is.**
    **⏳ LIFT CONDITION — "UNTIL MY NEXT ORDER".** This hold is **ACTIVE from 2026-08-10** and ends
    **only when the QA lead says so**. **A SESSION READING THIS WEEKS FROM NOW MUST NOT TREAT IT AS
    STANDING LAW**: check whether it has been lifted before concluding that creation is barred, and
    do not quietly carry a spent hold forward (Rule 48's clause — never carry a stale ruling forward
    without saying so). When it is lifted, **Rule 62 resumes as the governing rule**, unchanged and
    undiminished — the hold suspends creation; it does not replace the permission requirement.
    **WHAT IT BLOCKS TODAY, CONCRETELY:** the **five prepared Report Suite defects** stay prepared and
    unfiled, and the cases sitting on `AUTOMATION: HOLD` **only because an expect-fail marker needs a
    ticket number that does not yet exist** stay on `HOLD` — each becomes `READY - EXPECT FAIL` with
    one edit once a ticket exists. Recorded in the **OUTSTANDING-ITEMS REGISTER** as row **H1** (Rule
    36), with the five Rule-48 fields. Contemporaneous write-up:
    `build/report-suite/full-viu-2026-08-06/RULINGS-2026-08-10-CREATION-HOLD-AND-FINALITY.md`.
    **⏳ DATED NOTE, 2026-08-17 — THE HOLD PERSISTS THROUGH AND BEYOND BUILD VERIFICATION (Fabian-review
    reconciliation; QA lead point 7).** Asked for permission to create the deferred expect-fail tickets,
    the QA lead ruled, **verbatim: *"Lets hold them until we are done with Build verification ... Even
    then we will keep a hold on creating tickets until I allow you to create the tickets."*** **So
    completing a build-verify sync does NOT lift the ticket-creation hold** — a future session must not
    read "build verification is done" as licence to file the held expect-fail / defect tickets. The hold
    still lifts ONLY on his explicit "you may create the tickets" order (the LIFT CONDITION above),
    which is a SEPARATE event from finishing build verification. **Concretely:** cases carrying
    `AUTOMATION: Not available on Build to test Yet` (Rule 69) that would become
    `READY - EXPECT FAIL (SV-xxxx)` once a ticket exists **stay unable to reach that marker until BOTH
    (a) build verification proves them runnable AND (b) he allows ticket creation** — register row
    **H1** still governs. Ties to Rules 61 (the expect-fail marker), 69 (the transitional marker that
    waits on build verification) and 62's own per-ask permission requirement.
    **⏳ DATED NOTE, 2026-08-20 — THE QA LEAD RE-CONFIRMED THE HOLD IS JIRA-TICKET-CREATION ONLY; NEW
    TEST-CASE CREATION IS NOT HELD FOR ANY PROJECT.** Verbatim: *"SOrry new case creation is not held
    for any project at all, see if you confused Hold on Jira ticket creation with Hold on New test case
    creation."* **So `add_case` (new TestRail test cases) is PERMITTED for ALL projects** — the
    2026-08-10 "anything" that a prior session encoded to include `add_case` was OUR over-broad reading
    (corrected 2026-08-11, and re-confirmed by him here). **Jira ticket creation STAYS HELD** until his
    next order (the LIFT CONDITION above). This is a clarification of how we RECORDED his ruling, not a
    reversal by him.
63. **WHEN HIS INSTRUCTION CONFLICTS WITH A RECORDED RULE, STOP AND SURFACE THE CONFLICT BEFORE
    ACTING — state both sides and ask which to follow (all projects).**
    USER DIRECTIVE (2026-08-11, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"Please do not forget the rules, and If I say
    something that contradicts with you r rules, please do tell me what I am saying VS what the rule
    and and ask me to tell you what to follow."*
    **THE RULE:** when the QA lead gives an instruction that **CONFLICTS WITH A RECORDED STANDING
    RULE**, we **STOP AND SURFACE THE CONFLICT BEFORE ACTING**, stating **THREE** things:
    **(a) WHAT HE HAS INSTRUCTED — in HIS OWN WORDS, quoted verbatim**;
    **(b) WHAT THE RULE CURRENTLY REQUIRES — quoted, WITH ITS NUMBER**, so he can see the exact text
    he would be overriding;
    **(c) AN EXPLICIT ASK — which of the two should we follow?**
    **NEITHER SILENT PATH IS AVAILABLE. We may NOT silently follow the new instruction, and we may
    NOT silently keep following the old rule.** Both fail the same way: they leave him unaware either
    that a rule he set has stopped being applied, or that an instruction he gave is not being
    followed — and in both cases the choice was made for him.
    **BEFORE THE WORK, NOT AFTER — this is the clause that actually erodes.** Discovering the conflict
    mid-pass and mentioning it in the closing summary is **NOT compliance**: by then the work has
    already been done one way, and the summary merely **reports a decision he was never given.**
    **DISTINGUISH A CONFLICT FROM A TIGHTENING OR A LAYERING — NOT EVERY NEW INSTRUCTION CONTRADICTS,
    AND ESCALATING THE ONES THAT DO NOT IS ITS OWN FAILURE** (it trains him to wave escalations
    through, which costs us the real ones). A **TIGHTENING** narrows what a rule permits while leaving
    its requirement intact; a **LAYERING** adds a condition on top. **Neither needs this escalation —
    both are simply RECORDED.**
    **WORKED EXAMPLE OF WHAT DOES *NOT* NEED ESCALATING:** his 2026-08-10 hold, *"Do not create
    anything until my next order"*, sits on top of **Rule 62**, which requires that we **ASK FIRST**
    before creating a Jira ticket. **It does not contradict Rule 62 — it ANSWERS the standing ask with
    "no, for now".** Rule 62 still governs whether and how anything is created; the hold suspends
    creation while it stands. **The two sit together cleanly**, which is exactly why the hold was
    recorded at Rule 62's tail rather than raised as a conflict.
    **WHERE HE CONFIRMS THE INSTRUCTION, IT BECOMES THE RULING** — under **Rules 32/33 the latest
    authoritative ruling wins** — and **THREE things then follow, every time:**
    **(i) THE SUPERSEDED RULE TEXT IS KEPT VISIBLE AND DATED, NEVER DELETED** (the pattern already
    used by Rules 31, 52 and 53), because **a silently-erased requirement is how a future session
    re-derives the very behaviour that was overridden**;
    **(ii) HIS RULING IS CITED AS THE AUTHORITY** (**Rule 48** — a ruling is a source and sources get
    cited), so a later reader sees a **DELIBERATE OVERRIDE rather than a lapse**;
    **(iii) THE AMENDMENT SAYS WHAT IT DOES *NOT* TOUCH.** An override of one clause is not an
    override of the rules around it, and **the neighbouring rules are the ones that get quietly
    widened in the retelling.**
    **WHERE HE DECLINES, THE RULE STANDS**, and the instruction is recorded as
    considered-and-not-adopted — never left as an unexplained gap between what he said and what we did.
    **SCOPE: THIS GOVERNS *HIS INSTRUCTIONS*.** A conflict between two **DOCUMENTS** — spec vs design
    vs Figma vs a PO answer vs a tech plan — is already governed by **Rules 32, 33 and 57** and is
    **NOT** what this rule is for.
    **RATIONALE, 2026-08-11 — TWO LIVE EXAMPLES, AND NEITHER WAS SURFACED PROPERLY AT THE TIME. They
    are recorded here as the evidence for the rule, not tidied out of it.**
    **(1) THE MANUAL-TESTER RULING vs STANDING RULE 10.** On **2026-08-10** he instructed, verbatim:
    *"let the manual QA tester verify those test cases and mark those test cases are passed or
    failed"*. **Standing Rule 10 required at that moment that a case is only VIU-complete when its
    behaviour is OBSERVED LIVE WITH EVIDENCE**, with anything unobserved marked **Blocked / NOT
    VERIFIED**. **The work was re-scoped to match him WITHOUT ANYONE STATING THAT IT CHANGED WHAT RULE
    10 REQUIRES** — precisely the silent-follow failure this rule forbids. **It has since been put to
    him and CONFIRMED on 2026-08-11, verbatim: *"you are RIGHT"***, so it is a **RULING, not an
    assumption**, and it is recorded as the dated amendment at the tail of **Standing Rule 10** — with
    Rule 10's superseded text kept visible, and with the explicit note that it weakens **neither Rule
    57** (expected behaviour still comes from the documents; only WHO JUDGES the build changed) **nor
    Rule 12** (whatever we DO call observed must still be genuinely observed with evidence).
    **(2) THE CREATION HOLD vs RULES 43 AND 47 — AN OPEN COST, RECORDED, NOT AN OBJECTION.** The
    active hold (*"Do not create anything until my next order"*, at Rule 62's tail) sits against
    **Rule 43**, under which **a requirement with no case is a visible hole to be closed**, and **Rule
    47**, under which **the three active runs must contain EVERY active case**. **The concrete cost
    today: Schedule's §5.3 "Panel collapse", new in spec v27, HAS NO CASE AND CANNOT GET ONE**, and
    **any further gap found while the hold stands also stays open**. **This is a cost being RECORDED
    so he can see it, NOT an argument against his hold** — but it **ACCRUES rather than pauses**, and
    a cost that accrues silently is one nobody can weigh.
    **⚠️ CORRECTED 2026-08-11 — THE COST DESCRIBED IN EXAMPLE (2) NO LONGER EXISTS, AND THE EXAMPLE IS
    KEPT ONLY AS THE RECORD OF WHAT WAS RAISED.** Told that Panel collapse *"can't get one while the
    hold stands"*, he answered — verbatim — ***"WHY? We are supposed to crfeate test cases … we are
    supposed to create the test cases."*** **The hold is JIRA TICKETS ONLY; `add_case` was never
    barred by him**, so **§5.3 Panel collapse is now simply OUTSTANDING AUTHORING WORK, not blocked**,
    and **Rules 43 and 47 are NOT in tension with the hold at all.** **This vindicates the rule while
    correcting the example: recording the cost is what got it corrected within a day** — and had it
    been RAISED rather than merely recorded, it would have been corrected sooner still, which is
    exactly the duty now written into Rule 62's tail (*"anything that stops you from creating/updating
    a test case You MUST let me know"*). **The sole surviving cost of the hold is the FIVE PREPARED
    JIRA DEFECTS, which stay unfiled.**
    **⇒ AND THE PRACTICE ITSELF HAS NOW BEEN EXPLICITLY ENDORSED (2026-08-11).** Asked to confirm the
    creation hold before raising a Jira ticket for an unbuilt control, he **confirmed the hold stands**
    and answered, verbatim: ***"Good catch, be like this always."*** **So checking before acting is not
    merely permitted — it is the behaviour he has asked for by name**, which settles the standing worry
    that surfacing a conflict reads as obstruction. **The cost of a needless check is one sentence; the
    cost of a silent assumption is a ticket he never approved.**
    Ties to Standing Rules 1 (never proceed without the complete input set — an unresolved conflict IS
    a missing input), 6 (nothing enters a system of record unasked), 7 (the ask is in plain layman
    words), 12 (observed, never inferred — **including never inferring which of two instructions he
    meant**), 25 (quote verbatim — his words as much as a spec's), 30 (its own outstanding tension
    with Rule 57 is exactly the kind of thing this rule surfaces), 32 and 33 (the latest authoritative
    ruling wins — **this rule is HOW that transition is made visible rather than silent**), 36 (an
    unanswered which-do-I-follow ask is an OUTSTANDING item and belongs in the register), 43 and 47
    (example 2's accruing cost), 46 (an undocumented deliberate decision is indistinguishable from a
    miss), 48 (a ruling is a source and gets cited — this rule is what produces the ruling worth
    citing), 55 (an unclear answer goes back to him rather than being interpreted), 57
    (document-vs-document conflicts are ITS business, not this rule's) and 62 (whose 2026-08-10 hold
    is this rule's worked example of a TIGHTENING, not a conflict).
64. **EVERY TEST CASE MUST HAVE A SOURCE — a case with NO source should not exist; but CHECK THE
    AUTOMATION MARKER BEFORE DELETING, AND NEVER MISTAKE A MISSING *RECORD* FOR A MISSING *SOURCE*
    (all projects).**
    USER DIRECTIVE (2026-08-11, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"And there should not be a case for which we do
    not have a source. A case should only exists IF there is a source for that. Otherwise the case
    should be deleted, but before deleting the case check if that case has 'Automated' marker"*.
    **THE REQUIREMENT, IN ONE SENTENCE: A TEST CASE EXISTS ONLY IF A DOCUMENT SOURCES IT — a case whose
    expected behaviour rests on no document at all is a DELETION CANDIDATE, and no case may be created
    or kept on the strength of nothing.**
    **WHAT COUNTS AS A SOURCE IS STANDING RULE 57'S LIST, AND NOTHING ELSE:** **(a)** the **PRD /
    Confluence specification** · **(b)** the **epic's stories** (description, acceptance criteria,
    comments) · **(c)** the **PO's verified answers** · **(d)** the **DESIGN** (Claude design, Figma
    design, or the technical design he shares) · **(e)** **FIGMA** · **(f)** a **shared `.md` file**
    (handover, design review) · **(g)** any **newer written statement shared with us**, including a
    message or channel post. **The list is OPEN-ENDED by his instruction** — a new document type does
    not need a rule amendment before it counts. **AND THE BUILD IS STILL NOT ON IT (Rules 57/58): "the
    build does it, so something must have said so" IS NOT A SOURCE**, and reaching for the build to
    source a case is the exact door Rule 58 closed.
    **🔴 THE DISTINCTION THAT MUST BE APPLIED EVERY TIME, OR THIS RULE WILL DESTROY GOOD COVERAGE.
    "NO SOURCE" MEANS THREE DIFFERENT THINGS AND THEY HAVE OPPOSITE REMEDIES:**
    **(a) THE CASE ASSERTS SOMETHING NO DOCUMENT SUPPORTS — genuinely unsourceable.** Nothing in
    (a)–(g) says it; it was invented, inherited from a design-only detail, over-specified, or
    reverse-engineered from a build. **⇒ DELETION CANDIDATE.** (Where only PART of a case is
    unsupported, **Rule 25's repair still applies first: REMOVE the unsupported assertion or make it
    scope-conditional (Rule 42) — deleting a whole case for one bad line is over-correction.**)
    **(b) A SOURCE EXISTS BUT WAS NEVER RECORDED ON THE CASE — a TRACEABILITY GAP, NOT A SOURCELESS
    CASE.** The requirement is in the spec, the story or an answer sheet; the case simply carries no
    `refs` and no provenance line. **⇒ THE REMEDY IS TO FIND AND RECORD THE SOURCE**, per
    **`build/MISSING-TRACEABILITY-PROCESS.md`** (Rule 20) — backfill `refs` and stamp the Rule-54
    provenance line. **DELETING ONE OF THESE THROWS AWAY REAL COVERAGE**, and it is the single most
    likely way this rule gets misapplied, because **(a) and (b) look identical from the case text
    alone.**
    **(c) THE SOURCE QUESTION IS OPEN WITH THE PO — HELD, NOT DELETED.** The case asserts something no
    requirement currently settles, **and a question is out** (or is owed). Worked example: **FLT-COMBO
    = [C29600](https://shopview.testrail.io/index.php?/cases/view/29600)**, which asserts how two
    filters combine when **no requirement says how they combine**. **⇒ HOLD it pending the answer,
    carry the open question on the case, and log it in the OUTSTANDING-ITEMS REGISTER (Rule 36) —
    BECAUSE THE ANSWER MAY SOURCE IT.** Deleting a case the PO is about to source destroys coverage
    **and** the question.
    **⇒ A CASE MAY ONLY BE DELETED AFTER (b) AND (c) HAVE BEEN GENUINELY EXCLUDED — the sources
    SEARCHED AND NAMED, not merely "we could not see one".** The candidate record must state **which
    documents were searched, at which versions, and on what date** (Rules 31/50 — exhaustive first,
    then exact). ***"No source found"* IS A MEASUREMENT ONLY IF THE SEARCH IS ON THE RECORD; otherwise
    it is an assumption** (Rule 12).
    **🛑 THE AUTOMATION CHECK IS A HARD PRECONDITION OF DELETION, IN HIS OWN WORDS: *"before deleting
    the case check if that case has 'Automated' marker"*.** **WHY IT MATTERS:** an automated case is
    one **an automation suite may already depend on**, so deleting it **breaks someone else's work**,
    silently, in a system we do not own — and unlike a wrong test case, a broken suite is not visible
    to us at all. **WHERE A CASE IS AUTOMATED, STOP AND RAISE IT WITH THE QA LEAD — DO NOT DELETE IT**,
    however unsourced it looks; **the sourcing problem is then a conversation with the automation
    engineer, not a deletion.**
    **✅ WHICH "AUTOMATED" MARKER HE MEANS IS NOW SETTLED — IT IS TESTRAIL'S OWN FIELD,
    `custom_atmstatus` (2026-08-11).** USER DIRECTIVE, verbatim: *"I was referring to testrail OWN
    AUTOMATED marker, because when we change any test case which has the testrail OWN automated marker
    we have to update Vlad who does the automation so that he can adjust accordingly his automation
    with our updates/delete of test cases."* **So the deletion precondition is read off
    `custom_atmstatus` (where `3` = Automated) — NOT off our own `AUTOMATION:` text marker at the end
    of Expected Results (Rules 60/61), which is a DIFFERENT THING and answers a different question.**
    **⚠️ SUPERSEDED READING, KEPT VISIBLE AND DATED (the Rules 31/52/53 pattern):** until 2026-08-11
    this rule encoded the safe both-readings interpretation — *"CHECK BOTH … IF EITHER SAYS AUTOMATED,
    THE CASE IS TREATED AS AUTOMATED AND IS NOT DELETED"* — while the clarification sat OUTSTANDING.
    **That is no longer in force; his answer replaces it.**
    **THE TWO GENUINELY DISAGREE, WHICH IS WHY THE ANSWER MATTERS:** measured live 2026-08-11,
    **75 of our 764 cases** across the three active suites carry `custom_atmstatus = 3` (Filters 4 ·
    Schedule 31 · Report Suite 40; 87 of 781 including other authors'), and
    **[C29600](https://shopview.testrail.io/index.php?/cases/view/29600) carries the field while having
    NO `AUTOMATION:` text marker at all.** **The field is the one that answers the question.**
    **🔴 AND THE FIELD DOES NOT MEAN THE SAME THING ON EVERY PROJECT — ESTABLISHED FROM TESTRAIL'S OWN
    HISTORY, 2026-08-11, AND IT MUST BE CHECKED BEFORE THE FIELD IS TRUSTED.** `get_history_for_case`
    over all 75 shows **every deliberate setting was made by user 1 (Vladimir Tomovic)** — the 40
    Report Suite cases on 2026-08-10, the 4 Filters cases on 5–8 August — **while all 31 Schedule cases
    have NO history entry at all**, because our own `add_case` tooling hardcodes `custom_atmstatus: 3`
    at creation (`build/schedule/panel-collapse-2026-08-11/tools/push.py`,
    `exec_sync_epic_2026-07-27.py`, `exec_sync_2026-07-22.py`; corroborated exactly — every Schedule
    case above id 30090 is `3`, every imported one is `1`). **So on Schedule the flag is an artefact of
    our creation template and asserts nothing about automation**, whereas on Report Suite and Filters
    it is Vlad's own hand. **Before relying on the field, check whether a PERSON set it** — the flag
    also moves both ways (**C29600 went `1→3→1→3`; C38877 went `3→1→3`**).
    **✅ RESOLVED 2026-08-11 — THE 31 SCHEDULE FLAGS ARE CORRECTED.** (The line above read *"Whether to
    correct the 31 Schedule flags is OUTSTANDING with the QA lead"*; that ask has been answered.) QA
    lead, verbatim: *"Yeh wee need to fix everycase from all the three projects where we have
    mistakengly done that."* All **31** were set **`3 → 1`**, every write byte-verified with **only
    `custom_atmstatus` moved**; Schedule now reads **174/174 Not Automated**. **THE OTHER 44 WERE LEFT
    ALONE AND THAT IS THE POINT OF THE METHOD:** who set the flag was established **per case from
    `get_history_for_case`, never by subtraction** — **44 cases carry an `custom_atmstatus` history
    event and every single one is user 1 (Vladimir Tomovic)**; the 31 carry **none**, while their
    history is otherwise non-empty, so the `3` has stood since creation. Corroborated independently:
    **every Schedule case above id 30090 (i.e. every one we added by `add_case`) was `3`, and all 143
    imported ones were `1`** — two lines of evidence agreeing exactly. **The root cause is fixed at
    source: see the `add_case` entry under "Durable key facts → TestRail".** Full record:
    `build/automated-flag-and-c30041-2026-08-11/`.
    **DELETION DISCIPLINE — `delete_case` IS IRREVERSIBLE, AND IRREVERSIBILITY RAISES THE BAR RATHER
    THAN LOWERING IT:**
    **· THE CANDIDATE LIST GOES TO THE QA LEAD BEFORE ANY DELETION IS EXECUTED.** **Rule 6 stands
    absolutely — nothing is written to TestRail without his explicit permission**, and this ruling is
    **not** a standing licence to delete. Each candidate is presented with its **internal ID + C-id +
    link** (Rule 8), **what it asserts**, **which sources were searched and at which versions**, **its
    automation status**, and **our recommendation** — the same "do the whole job and stop at the
    button" shape Rule 62 requires of a ticket.
    **· NEVER REUSE A RETIRED INTERNAL ID.** A resync once **OVERWROTE A RETIRED RECORD** because a new
    case reused a retired ID (the `SBC-COL-03` incident, 2026-08-05 — renamed to `SBC-COL-04`), so
    retired IDs are recorded as **never-reuse** and the deletion record keeps them.
    **· A DELETION IS RECORDED, NOT JUST DONE** — the case body kept locally marked Retired, the id-map
    decremented, the generators excluding it, the deliverables regenerated, and the **run re-checked**
    (deleted cases drop out of runs automatically, but the before→after test count is logged — Rules
    34/47).
    **· FOREIGN CASES ARE NEVER DELETED BY US, WHATEVER THEIR SOURCING (Rule 38).** An unsourced case
    written by another author is **reported to them and to the QA lead**, never removed.
    **THIS ESCALATES STANDING RULE 20** — see the dated escalation note at Rule 20's tail. Rule 20's
    remedy for an unsourced case was **FLAG**; it is now **FLAG, SEARCH, and — only where the case
    genuinely cannot be sourced — DELETE**, with the automation check and his permission first.
    **Rule 20's prior wording is kept visible and dated**, because it is still the correct FIRST move
    and it is the half that protects coverage.
    **CROSS-REFERENCES THAT MAKE THIS OPERABLE:** **Rule 54** is where a source is STATED on the case
    (the provenance line, with the date each source was read), so **a case whose provenance line names
    no document is exactly the population this rule sweeps** — and **Rule 57** is what counts as a
    document. **A case that cannot be given a Rule-54 sentence 1 is, by definition, a candidate.**
    **HONESTY CLAUSE:** this rule **REDUCES the suite deliberately, and that is the point** — but a
    deletion made without the (b)/(c) exclusion is **indistinguishable from losing coverage**, and
    nobody downstream will ever know what was removed. **When in doubt, HOLD and ASK; a case held one
    day longer costs nothing, a case deleted wrongly cannot be recovered.**
    **RATIONALE, 2026-08-11:** the end goal has always been **100% authentic test cases** (Rule 20),
    and an unsourced case is the one thing that can never be made authentic — it cannot cite a
    document, cannot survive a challenge from a reviewer or an automation engineer (Rules 39/44), and
    cannot be re-derived when a spec moves (Rules 31/43). **It is also the exact residue of the failure
    Rule 57 corrected**: expectations reverse-engineered from a build look sourced, read as our best
    work, and have nothing behind them. Ties to Standing Rules 6 (nothing written to TestRail without
    permission — **including a deletion**), 8 (every candidate named with its C-id and link), 12
    (observed, never inferred — *"no source found"* must be a measurement), 17 (complete data in/out —
    the sweep covers 100% of a suite, no sampling), 20 (**escalated by this rule; its prior wording
    kept and dated**), 25 (quote the source, or state plainly that none exists — and remove an
    unsupported assertion rather than substituting the build), 31 (source currency — a source that
    moved is not an absent source), 36 (the sweep and the automation-marker clarification are
    OUTSTANDING items), 38 (foreign cases are never deleted by us), 42 (scope-conditional wording is
    often the right repair instead of deletion), 43 (a per-requirement re-derivation is what proves a
    case has no requirement behind it), 46 (a deliberate deletion is RECORDED so it can never look like
    a miss), 48 (a held candidate cites the ruling holding it), 50 (exhaustive then exact — the source
    search is on the record), 54 (the provenance line is where the source is stated), 55 (an open
    source question goes to the PO, not into a deletion), 57 (**what counts as a source**), 58 (an
    ambiguous source is never resolved from the build — nor is an absent one), 62 (the "prepare it
    fully, then stop at the button" shape this borrows) and 63 (where this ruling conflicts with a
    recorded rule, it is surfaced — which is why Rule 20's escalation is written down rather than
    applied silently).
65. **CHANGE A CASE THAT TESTRAIL FLAGS AS AUTOMATED → TELL VLAD. Every pass that writes to cases
    reports which Automated cases it touched and what changed — UPDATES AS MUCH AS DELETIONS (all
    projects).**
    USER DIRECTIVE (2026-08-11, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"I was referring to testrail OWN AUTOMATED
    marker, because when we change any test case which has the testrail OWN automated marker we have to
    update Vlad who does the automation so that he can adjust accordingly his automation with our
    updates/delete of test cases."*
    **THE DUTY, IN ONE SENTENCE: ANY change we make to a case TestRail flags as Automated — an UPDATE
    as much as a DELETION — obliges us to report it, so the automation engineer can adjust his
    automation.** His reason is the operative part and it is broader than deletion: *"so that he can
    adjust accordingly his automation with our **updates/delete** of test cases."*
    **⚠️ THIS IS NOT LIMITED TO RULE 64's DELETION PATH.** Rule 64 checks the Automated flag as a
    **precondition of deleting**; **this rule is a standing obligation of EVERY pass that writes to
    cases**, whatever the pass was chartered to do — a wording repair, a provenance re-stamp, a marker
    change, a re-verdict, a new case. **A pass that only ever ran `update_case` still owes this
    report.**
    **WHICH MARKER: `custom_atmstatus` (3 = Automated) — TestRail's OWN field, NOT our `AUTOMATION:`
    text marker** (Rule 64's settled reading; the two disagree, and the field is the one that answers
    the question).
    **WHAT EVERY PASS MUST DO — two mechanical things, both checkable:**
    **(1) THE EXECUTION LOG RECORDS `custom_atmstatus` FOR EVERY CASE IT WRITES.** It is already in the
    `get_case` body the pass snapshots for its Rule-50 byte-check, so this costs nothing — but it must
    be **recorded at write time**, because the flag moves (proven: **C29600 went `1→3→1→3`**, C38877
    `3→1→3`), so reading it afterwards can give a different answer from the truth at the moment of the
    write.
    **(2) EVERY PASS REPORT CARRIES AN "AUTOMATED CASES CHANGED — FOR VLAD" SECTION.** Per case:
    **C-id + `https://shopview.testrail.io/index.php?/cases/view/<id>` link** (Rule 8) · **what changed,
    in one plain phrase** (Rule 7 — no internal jargon; the QA lead forwards this) · and **whether the
    change affects what an automated check would assert.** **SAY "none" WHERE NONE — NEVER OMIT THE
    SECTION** (the Rule-36 pattern: the reader must be able to tell "clear" from "we forgot to look").
    **THE LAST COLUMN IS THE ONE HE ACTUALLY NEEDS, AND IT IS OUR JUDGEMENT, NOT HIS.** A provenance
    re-stamp or a spec-version correction changes **nothing** he automates; a **marker moving between
    ready / expect-fail / hold**, a **changed assertion**, **changed steps** or a **new case** changes
    what a run should conclude. **So report the full change alongside the verdict and let him overrule
    us — we have never seen his scripts, and a rewording we call cosmetic can still break a check that
    matches an exact string.** **BAND THE LIST so what matters is at the top**, and **be honest where
    the call cannot be made.**
    **CHECK WHETHER A PERSON ACTUALLY SET THE FLAG BEFORE REPORTING A CASE AS AUTOMATED.**
    `get_history_for_case` shows who set `custom_atmstatus` and when. **On Schedule NOBODY EVER SET IT
    — our own `add_case` tooling hardcodes `3`** (Rule 64), so those cases are **not** evidence that
    anything is automated. **Reporting them to Vlad as his own would pad the list and cost it
    credibility on the first reading** — separate them, and say why.
    **THIS IS ABOUT *OUR* CASES THAT *HE* AUTOMATES — Rule 38 is untouched and still absolute:
    HIS OWN cases stay hands-off**, not edited, not deleted, not counted in our tallies. The two rules
    point in opposite directions on purpose: we never touch his cases, and we always tell him when we
    touch ours that he depends on.
    **IT IS A REPORT, NOT A WRITE.** We tell the QA lead, who tells Vlad. **Nothing about this rule
    authorises editing a case, changing a flag, or opening a ticket** (Rules 6/62), and it is **never a
    reason to skip a correction** — a case that should be fixed still gets fixed; the duty is to say so.
    **RATIONALE, 2026-08-11 — the duty was discovered only after a week of changing cases without
    tracking it.** The reconstruction (`build/automated-cases-changed-2026-08-11/`) found **73 of the
    75 Automated cases changed since 6 August**, of which **27 affect what an automated check should
    conclude and 46 do not** — and, tellingly, **only 8 of the 27 are on cases Vlad himself marked.**
    Two of those eight (**C30510, C30515**) had gone from *expected to fail* to *expected to pass*
    because SV-8907 was fixed: a suite still expecting failure would have reported a **false alarm on a
    working build**, and nobody would have known why. **The cost of the report is a paragraph; the cost
    of not sending it is someone else debugging our edit.** Ties to Standing Rules 6 (nothing written
    without permission — this rule writes nothing), 7 (plain layman wording, because it is forwarded),
    8 (every case named with its C-id and link), 12 (observed, never inferred — the flag and its history
    are READ, never assumed), 17 (complete data in/out — every Automated case the pass touched, no
    sampling), 20 (traceability), 34 and 47 (**the same downstream-effect discipline a run sync already
    carries: a change here breaks something over there unless someone is told**), 36 (an unsent report is
    an OUTSTANDING item), 38 (**his cases are hands-off; this is the mirror duty for ours**), 50 (the
    flag is captured in the same snapshot the byte-check already takes), 60/61 (a marker move is exactly
    what changes an automated run's conclusion) and 64 (**which settled which marker this means, and
    where the flag cannot be trusted**).
66. **A PO / DEV QUESTION SHEET IS THE LAST THING SENT — it goes out only once everything we can do
    ourselves is finished and the sheet is genuinely the only item left (all projects, and all future
    projects).**
    USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"This should be the last thing once you give me
    the report that everything else has been done only this part is left and save it as a rule for now
    and for the future projects too."*
    **THE RULE:** a **PO or dev question sheet is SENT only when everything we can settle ourselves is
    settled** and the sheet is the **only remaining item** — and it is **reported to the QA lead as
    exactly that**: *"everything else on this project is done; the only thing left is these questions."*
    **Until that point the questions are WRITTEN, HELD, and LOGGED in the OUTSTANDING-ITEMS REGISTER
    (Rule 36).** Writing the sheet early is not merely permitted, it is **wanted** — what is deferred is
    **SENDING it**.
    **THE REASONING, SO THIS IS NOT MISTAKEN FOR MERE SEQUENCING — there are two costs and both are
    real.** **(a) A QUESTION SENT EARLY GETS ANSWERED AGAINST A STATE THAT HAS SINCE CHANGED.** Between
    the ask and the answer the spec moves, the build redeploys, another source lands — and the answer
    comes back addressed to a question we would no longer ask in those words. That is not hypothetical:
    **Standing Rule 59 exists because sources moved *within the hour* on 2026-08-05**, and **Standing Rule
    31's own lesson is that a readiness figure has a shelf life measured in minutes when a PO is active.**
    **(b) IT SPENDS THE PO's PATIENCE ON SOMETHING WE COULD HAVE RESOLVED OURSELVES.** A PO's willingness
    to answer is a **finite resource shared across every project he owns** — Branko owns three, Chris owns
    two — and every question we could have answered from a document we had not yet read is drawn against
    the questions only he can answer. **Rule 55 already forbids the drip of separate asks; this rule
    forbids the PREMATURE ask**, and the two work together: **one sheet, sent once, at the end.**
    **THE HONEST COUNTER-LIMIT — A RULE WITH NO LIMIT GETS MISAPPLIED, AND THIS ONE WOULD BE MISAPPLIED IN
    A DANGEROUS DIRECTION.** **THIS DOES NOT LICENSE SITTING ON A GENUINE BLOCKER.** An item that
    **actually stops work** — a missing source, an access blocker, an unanswered authorisation, a
    contradiction with no defensible resolution order — is **RAISED IMMEDIATELY as an outstanding item
    (Rule 36)**, and where it stops us creating or correcting a test case it is escalated **in the same
    breath** (Rule 62's 2026-08-11 duty: *"anything that stops you from creating/updating a test case You
    MUST let me know"*). **What is deferred is the QUESTION SHEET — a batched, considered, end-of-work
    deliverable. It is NOT the escalation of a blocker, and the two must never be conflated to justify
    silence.** The distinguishing test, in one line: ***if the answer would change what we do NEXT, raise
    it now; if it would change what a case ASSERTS once everything else is done, it belongs on the
    sheet.***
    **AND THE DEFERRED SHEET IS NEVER A REASON TO STALL A CASE SILENTLY.** A case waiting on an unsent
    question carries `AUTOMATION: HOLD` and **says in its own words that the question has not been sent
    yet** — never wording that implies the PO is sitting on it. **We have had that exact embarrassment:**
    the Schedule shop-closures question was drafted on **22 July** and **had never been sent**, while the
    register had to record plainly that *"the blocker is US, not him."*
    **WHAT "EVERYTHING ELSE IS DONE" MEANS, so it cannot be stretched:** every source re-read and current
    (Rule 31), every requirement carrying a coverage verdict (Rule 43), every case we can author authored
    and every case we can correct corrected (Rule 62's carve-out), every deliverable regenerated, and the
    remaining items **each traced to a named external dependency**. **If work remains that we could do, the
    sheet is not ready to send — however finished the sheet itself looks.**
    **UNCHANGED: HOW A SHEET IS WRITTEN.** **Rule 55** still governs its content in full — the project and
    the feature named **on every row**, extremely simplified language, A/B options, story/epic references
    where they orient the reader, the QA-only mapping on a separate tab, the established format mirrored
    1:1 (Rule 16), a human-readable filename (Rule 19). **This rule adds WHEN, and only WHEN.**
    **RATIONALE, 2026-08-12:** the instruction arrived while **two written, ready, unsent sheets** were on
    the books — **Chris Ward's 13 items** and **Branko Cicovic's 21** — with real work still outstanding on
    all three active projects. His framing is the operative part and it is a **reporting** requirement as
    much as a sequencing one: the sheet goes out **attached to a report that says everything else is
    finished**, so that when he forwards it he can stand behind it, and the PO sees one considered ask
    rather than a project still in motion. Ties to Standing Rules 1 (never proceed without the complete
    input set — an unanswered question IS a missing input, which is exactly why the counter-limit above
    matters), 7 (plain layman wording), 11 (ask which process on new inputs), 16 (mirror the established
    format), 19 (human-readable filenames), 31 and 59 (source currency — the reason a stale question is
    worse than a late one), 36 (**every unsent question is an OUTSTANDING item and stays visible while it
    is held**), 43 (an unanswered question leaves a requirement row un-verdicted and that must be visible),
    46 (a deliberately-held sheet is RECORDED, so it can never look like a miss), 48 (a case held on an
    unsent question quotes the ruling holding it — for these, this one), 55 (**which governs HOW the sheet
    is written; this rule governs WHEN it is sent**), 58 (an ambiguous source is never resolved by looking
    at the build — it waits for the sheet) and 62 (a blocker on creating or correcting a case is escalated
    immediately, never deferred onto the sheet).
67. **EACH PROJECT REPORTS BEFORE THE NEXT ONE STARTS — a per-project completion TABLE, delivered to
    the QA lead as the gate on moving on (all projects, and all future projects).**
    USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"Before starting with filters, give me the report
    for schedule and set it as a rule to do before starting the next thing. I need a report table as to
    how many cases have been Source verified and how many have been build verified/VIU'd and what is
    left."*
    **THE RULE:** a **per-project completion report is DELIVERED BEFORE WORK STARTS ON THE NEXT
    PROJECT.** **Not at the end of the day. Not bundled with two other projects. Not "I'll write it up
    once all three are done."** **Each project reports, and only then does the next begin** — his words
    are *"before starting the next thing"*, and the sequencing is the instruction, not a preference about
    formatting.
    **IT IS A TABLE.** Not a paragraph, not a narrative summary with the numbers embedded in prose — he
    asked for *"a report table"*, and a table is what makes a missing column visible. **A figure that has
    no row is a figure nobody notices is absent.**
    **THE COLUMNS — THESE ARE THE MINIMUM, EVERY ONE OF THEM, EVERY TIME:**
    **(1) TOTAL CASES — TWO NUMBERS, OURS AND LIVE-INCLUDING-FOREIGN.** Per **Rule 38** we never claim
    or hide another author's work, so the row reads *"ours N / live M"*. **One number alone is wrong
    whichever one it is.**
    **(2) SOURCE-VERIFIED** — how many carry **a per-source read-date AND a current spec version pin**.
    Both halves, not either: a case pinned to a spec version nobody re-read is not source-verified, and
    a source read on a date but pinned to a superseded version is Rule 31's trap (c) waiting to happen.
    **(3) BUILD-VERIFIED — SPLIT IN TWO: how many name THE BUILD NOW RUNNING, and how many name an
    EARLIER one.** A single "build-verified" total silently merges the two and is the easiest number in
    the whole table to overstate. **Under Rule 60 the second group is the ORDINARY consequence of a
    branch nobody declares final — it is reported, not apologised for, and never rounded into the
    first.**
    **(4) STEPS AND PRECONDITIONS ACTUALLY WALKED ON THE BUILD — the Rule-9 runnability figure.**
    **(5) RUNNABLE vs HELD, WITH THE MARKER ARITHMETIC SHOWN CLOSING BOTH WAYS** — `READY` +
    `READY - EXPECT FAIL` on one side, total − `HOLD` on the other, **both printed**. A gate that is
    only shown one way is not a gate.
    **(6) CREATED / UPDATED / DELETED IN THE PASS.**
    **(7) WHAT IS LEFT — ITEMISED, NEVER A TOTAL.** Not *"48 remaining"* but **what specifically remains
    and what each item is waiting on**.
    **🔴 THE HONESTY REQUIREMENTS — READ THESE AS THE SUBSTANCE OF THE RULE, NOT AS CAVEATS ON IT. THE
    TABLE IS THE FORMAT; THIS IS THE POINT.**
    **(a) "BUILD-VERIFIED" AND "STEPS WALKED" ARE DIFFERENT NUMBERS AND ARE REPORTED SEPARATELY —
    NEVER MERGED, NEVER SUBSTITUTED FOR ONE ANOTHER.** **Build-verified** says a case's **labels were
    compared against this build**. **Steps walked** says **a tester could actually execute it** — every
    precondition reachable, every navigation path present, every control where the step says it is, the
    order workable (Rule 9's five checks). **THE SECOND IS ALWAYS THE SMALLER NUMBER AND ALWAYS THE MORE
    HONEST CLAIM.** **On Schedule today it was 76 against 28, out of 176** — reporting the 76 alone
    would have overstated the position by a factor of nearly three, on the day before a release.
    **Evidence: `build/schedule/verify-final-2026-08-12/FINDINGS.md`, which states both figures in its
    own headline and says why: *"Those are two different numbers on purpose, and the second is the one
    that answers 'can a tester pick this up tomorrow and run it?'"***
    **(b) NEVER REPORT "VIU COMPLETE"** unless the **behaviour verdict was genuinely ours to make**.
    Since the QA lead re-scoped that half to the manual tester (**Rule 10's 2026-08-11 amendment**), the
    accurate phrase — and it is **stronger than the overclaim, not weaker** — is: **"source-verified and
    build-accurate in its preconditions, steps, navigation and labels — with the behaviour verdict
    belonging to the tester."**
    **(c) EVERY FIGURE IS DERIVED LIVE AT REPORT TIME, NOT CARRIED FROM A DOCUMENT — AND THE READ TIME
    IS STAMPED ON THE TABLE.** Counts have moved **within a single pass**: a sibling worker watched a
    held count drop **91 → 88 mid-write** (recorded here as that worker's mid-pass observation, not as
    something re-derived by this entry — Rule 12). **A number copied out of yesterday's findings file is
    a claim about yesterday**, however carefully it was measured then. **This is Rule 59's logic applied
    to reporting: re-read at the moment you rely on it.**
    **(d) STATE PLAINLY WHERE A COLUMN IS NOT 100%, AND WHY.** **An unexplained gap invites the
    challenge; an explained one answers it in advance.** This is **Rule 60(d)** — the blanket caveat
    ("the branch is not final") is barred precisely because it hides the number instead of explaining
    it.
    **(e) "WHAT IS LEFT" NAMES THE BLOCKER AND WHO CAN CLEAR IT** — with **Rule 48's five fields wherever
    the item is blocked on the QA lead himself** (which ruling, verbatim · when and what question it
    answered · what it blocks, with C-ids and links per Rule 8 · why it was reasonable, or what has
    changed · the one thing that would unblock it, and from whom). **So the report doubles as the ask**,
    and the same items are logged in the **OUTSTANDING-ITEMS REGISTER** (Rule 36) rather than living only
    in a report he has to go back and find.
    **⇒ CLARIFIED 2026-08-12 — HOW COLUMN 3's SPLIT IS *INTERPRETED*, NOT WHAT IT REPORTS (Standing
    Rule 60's bug-fix-deploy amendment). THE BOOKKEEPING IS UNCHANGED: THE TABLE STILL REPORTS THE
    BUILD A CASE WAS CHECKED AGAINST, SPLIT INTO "the build now running" AND "an earlier one."** That
    remains a **fact worth stating** and the reader is entitled to it. **WHAT CHANGES IS THE MEANING
    OF THE SECOND GROUP: across BUG-FIX-ONLY deploys those cases are VERIFIED, NOT OWED** — QA lead,
    verbatim: *"they are just fixing the reported bugs … and not adding any functionality to the
    build, so that does not make your previous pass as stale."* **SO THE SECOND NUMBER IS NOT WRITTEN
    UP AS A SHORTFALL, AND IT DOES NOT BELONG IN COLUMN 7 ("what is left") ON THE STRENGTH OF THE
    MARKER ALONE** — a report that discounts its own sound work **understates the position**, which is
    the opposite of this rule's purpose even though it errs in the "safe" direction. **UNCHANGED AND
    NOT WEAKENED: figures are still derived LIVE (c), any column short of 100% still says plainly why
    (d), a row NEVER observed is still reported as never observed (Rule 60's honesty clause), and no
    case is ever re-dated to a build nobody checked it on (Rule 12).** **Where a deploy is known to
    have ADDED OR CHANGED functionality, the affected cases ARE owed and column 7 says so.**
    **RATIONALE, 2026-08-12 — IN HIS TERMS, BECAUSE THE RISK IS HIS AND NOT OURS.** **HE is the one who
    presents these numbers**, to people who will not have read the findings file behind them. **An
    overstated figure is what would bite him** — not a missing one. A shortfall stated plainly is a
    position he can defend in a sentence; a number that turns out to have merged "labels checked" with
    "actually runnable" is one he cannot defend at all, because he will have said it in good faith. **The
    conservative number is therefore the useful number**, and this rule exists to make the conservative
    number the one that reaches him.
    **AND THE TIMING IS HALF THE VALUE, NOT PACKAGING.** A report delivered **before the next project
    starts** surfaces a problem **while there is still time to act on it** — the effort, the attention
    and the environment access are all still on that project. The same report delivered after the work
    has moved on is an **archaeology exercise**: re-establishing a build marker, a session and a data
    state that have all since changed, to fix something that was cheap to fix an hour earlier. **This is
    the reporting-side sibling of Rule 66** — Rule 66 defers the PO question sheet to the END of a
    project's work, and this rule fixes what accompanies it: **the sheet goes out attached to a report
    that says, with a table behind it, exactly what is done and exactly what is not.**
    Ties to Standing Rules 8 (every case named with its C-id and link, including in the "what is left"
    rows), 9 (**the runnability figure of column 4 — and its "N of M, on which build marker" reporting
    standard is this table's column 3/4 discipline**), 10 (**"VIU" means the method end to end, and its
    behaviour half has belonged to the manual tester since 2026-08-11 — which is why (b) bars the
    phrase**), 12 (observed, never inferred — a figure not derived live is not a measurement), 17
    (complete data in and out — including the **honest remainder**, itemised), 34 and 47 (a run out of
    sync with the suite makes any coverage figure meaningless — check before reporting one), 36 (**the
    outstanding register is where the asks live; the report points at it, it does not replace it**), 38
    (ours-and-live, two numbers), 48 (**a blocked item cites the ruling blocking it, with all five
    fields**), 49 (an OPEN re-check queue is part of "what is left" and is named as such), 50 (exhaustive
    and exact — a count is set-equal in both directions, never a matching total), 54 (the provenance
    line's sentence 2 is **where the per-case build date in column 3 actually comes from**), 59 (re-read
    immediately before you rely on it — the reason for (c)), 60 (**what "build-verified" means when a
    branch is never declared final, and 60(d)'s bar on the blanket caveat**), 61 (an automated suite
    monitors what it can see; the rest is what column 7 itemises) and 66 (**the question sheet is sent
    WITH this report, once it says everything else is done**).
68. **A BLOCKER MUST BE PROVED, AND IT BLOCKS ONLY WHAT IT ACTUALLY BLOCKS — decompose the work,
    prove the blocker is real and total, and clear it yourself before escalating it (all projects,
    and all future projects).**
    USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it because Rule 25
    applies to his instructions as it does to a spec): *"Regarding this mistake make a rule to avoid
    making similar mistake."*
    **THE MISTAKE THIS RULE EXISTS FOR, STATED PLAINLY SO THE RULE HAS A SPINE — AND IT WAS OURS.**
    Across the Filters work of 12 August, **23 cases were reported as remaining and 14 of them were
    classified "waiting on Branko" and treated as untouchable. THEY WERE NOT.** Branko's missing
    Parts/Reports product write-up leaves those cases' **EXPECTED BEHAVIOUR** unsourced — it does
    **NOT** prevent verifying that **a tester can execute their preconditions and steps**, which is
    precisely what the QA lead had asked for (Rule 9's runnability half). **ROUGHLY 60% OF A REPORTED
    REMAINDER WAS SELF-INFLICTED.**
    Evidence, both sides of it: the claim is
    `build/filters/finish4-2026-08-12/COMPLETION-REPORT.md` §7, groups (a) **10 cases** — C38882,
    C38904, C38905, C38906, C38907, C38908, C38909, C38910, C38911, C43562 — and (b) **4 cases** —
    C29559, C29609, C29610, C29612. The correction is the next pass, which **walked the Status-chip
    four** (commit `e882d1c6`) and **all 14 Parts/Reports surfaces** (commit `b3e3aeb6`), with the
    probe evidence committed alongside. **The blocker was real about the VERDICT and false about the
    RUNNABILITY, and nobody had tested which.**
    **⚠️ HONEST SCOPE OF THAT EVIDENCE: the commits prove the surfaces and the four were WALKED. The
    corrected per-case write-up was still in flight when this rule was recorded, so this entry does
    NOT claim the 14 are closed** — only that they were **never unwalkable**, which is the whole
    point (Rule 12 — a claim carries only what was observed).
    **AND IT IS A PATTERN, NOT AN INCIDENT — TWO MORE OF THE SAME SHAPE, THE SAME DAY. One example
    reads as bad luck; three read as a habit.**
    **· (ii) A COST WAS TREATED AS A WALL.** **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581)**
    and **[C29588](https://shopview.testrail.io/index.php?/cases/view/29588)** were held because they
    need a **staff record deactivated**, and such an edit **destroys the session of every holder**
    (`build/filters/finish3-2026-08-12/DIVERGENCES.md` and `finish4`'s §7(d), which records them as
    *"runnable; they are simply not runnable by us"*). **The destruction is TRUE. The conclusion did
    not follow.** That is a **SEQUENCING problem, not a wall**: do everything else that needs the
    session first, commit it, then make the edit **last** and accept that the session ends. **The cost
    was being AVOIDED rather than SCHEDULED.**
    **· (iii) AN ASK REACHED THE QA LEAD THAT SHOULD NEVER HAVE REACHED HIM.**
    `build/schedule/verify-final-2026-08-12/DIVERGENCES.md` §A escalated *"three role assignments"* as
    the thing that would unblock **ten** Schedule cases — when **Standing Rules 5, 14 and 26 already
    authorise creating and assigning roles ourselves**, and his own standing words are *"do whatever
    you want to do with data seeding/changing/editing in the QA branch."*
    **THE NEXT PASS DID ATTEMPT IT, AND THAT IS THE INSTRUCTIVE PART** — it is written up at
    `build/schedule/finish-2026-08-12/DIVERGENCES.md` §A under the heading *"I tried to unblock them
    myself, and I can tell you exactly why it cannot be done from here"*, opening: **"This section
    replaces the previous pass's 'three role assignments would fix it'. That ask was right about the
    goal and wrong about the mechanism."** Attempting it **turned a vague ask into a precise one** —
    a **role-definition** edit invalidates every holder's session **one way, and it does not come back
    when the permissions are restored**, so the correct ask is *"create the users, give them their
    permissions, and only THEN sign each one in and send the cookies — configure first, mint
    second."*
    **⚠️ AND THAT ATTEMPT COST THE TECHNICIAN SESSION, WHICH IS REQUIREMENT (4) FAILING IN THE OTHER
    DIRECTION AND IS RECORDED RATHER THAN TIDIED AWAY.** Attempting it was **right** (Rules 5/14/26);
    doing it **before** everything else needing that session was finished was **wrong**. **So the two
    halves of this rule are not in tension — (3) says clear it yourself, (4) says schedule the
    destructive part last. Instance (ii) breached (4) by never doing it; instance (iii) breached (4)
    by doing it first.**
    **🔴 WHAT THE RULE REQUIRES — SIX THINGS, ALL CHECKABLE, BECAUSE A RULE NOBODY CAN FAIL IS A RULE
    NOBODY FOLLOWS:**
    **(1) NAME WHAT THE BLOCKER ACTUALLY BLOCKS — DECOMPOSE THE WORK AND BLOCK ONLY THE PART THAT IS
    GENUINELY BLOCKED.** A missing PO answer blocks the **VERDICT**, not the **RUNNABILITY**. A
    missing permission blocks **ONE STEP**, not the whole case. A missing ticket number blocks the
    **MARKER**, not the walk. **"Blocked" is not a property of a case — it is a property of a
    QUESTION about that case**, and a case usually raises several. **The tell that this step was
    skipped: a blocked item whose reason is a person's name.**
    **(2) PROVE THE BLOCKER IS REAL *AND TOTAL* BEFORE RECORDING IT — the same standard Rule 12 sets
    for any absence.** *"Waiting on X"* asserted without testing what can still be done is an
    **INFERENCE, not an observation**, and it is exactly the class of claim Rule 12 forbids. **The
    checkable form: state what was attempted, what it returned, and what remained possible.** *"We
    could not see a way"* is an assumption; *"we tried A, B and C and here is what each returned"* is
    a measurement.
    **(3) CHECK IT IS NOT SELF-SERVICEABLE FIRST (Rules 5, 14 and 26).** Seeding data, creating
    roles, creating users, switching location, driving the API where the UI resists — **all ours to
    do.** The QA lead's standing words are the test: ***"there is nothing like 'require seeding data'
    — you can make everything in the build; do not find an excuse to keep yourself blocked."***
    **Rule 14's self-seed playbook is the checklist**, and it must genuinely be worked before the word
    "blocked" is written down.
    **(4) A COST IS NOT A BLOCKER — IT IS A SCHEDULING DECISION.** Where an action is **possible but
    destructive** (it ends a session, consumes a one-way resource, dirties an environment state),
    the answer is **DO IT LAST, AFTER COMMITTING EVERYTHING THAT DEPENDS ON WHAT IT DESTROYS** — not
    "do not do it". **Order the pass around the destructive step; never let the destructive step
    delete the pass.** Both failure directions are live examples above: **never doing it** (ii) and
    **doing it first** (iii).
    **(5) STATE THE RESIDUAL EXPLICITLY — WHAT REMAINS POSSIBLE UNDER THE BLOCKER, AND WHAT IS
    GENUINELY IMPOSSIBLE.** **A blocked item that never names what could still be done is not a
    report, it is an excuse.** The required shape is two lines, not one: ***"Blocked for X. Still
    possible under it: Y. Genuinely impossible until X clears: Z."*** **A blocker with an empty
    residual is a claim, and it must be provable under (2).**
    **(6) ESCALATE ONLY WHAT IS TRULY HIS (Rule 62's "prepare it fully, then stop at the button"
    shape).** Before a blocker is put to the QA lead, **confirm we cannot clear it ourselves** — and
    where it *is* his, it carries **Rule 48's five fields** and states **what we already tried**.
    **AN ASK THAT SHOULD NOT HAVE BEEN MADE COSTS HIM TIME AND COSTS US CREDIBILITY** — and it costs
    more than that, because **the next ask, the one that really is his, is read against the last
    one.**
    **RATIONALE, IN HIS TERMS, BECAUSE THE COST LANDS ON HIM AND NOT ON US.** He is **short of time
    before a release**, and **A FALSELY-BLOCKED CASE IS WORSE THAN AN UNBLOCKED ONE** — an unblocked
    case is visibly unfinished and someone picks it up; **a falsely-blocked case LOOKS LIKE SOMEONE
    ELSE'S PROBLEM AND STOPS BEING WORKED.** It also **migrates**: it lands in the Rule-67 completion
    table's *"what is left"* column, then in the outstanding register, then in the ask he forwards to
    a PO — **gathering authority at every hop while nobody re-tests the premise.** By the time it
    reaches Branko it is a fact. **The asymmetry is the argument: testing a blocker costs minutes and
    is fully recoverable; recording a false one costs a case for the rest of the release AND spends
    the PO's patience on a question that did not need asking.**
    **AND NOTE WHERE THIS FAILURE SURFACES, WHICH IS WHY IT WENT UNCAUGHT: Rule 67's column 7 asks
    "what is left" and Rule 36's register asks "what are we waiting on" — BOTH ARE ANSWERED HONESTLY
    BY A FALSELY-BLOCKED ITEM.** Neither rule asks *"and did you prove it?"*. **Rule 68 is that
    question**, and it is asked **before** the item is written into either.
    Ties to Standing Rules 5 (self-service test data and roles — requirement (3)'s authority), 6
    (nothing written to a system of record unasked — a blocker is never cleared by writing something
    we were not authorised to write), 7 (the escalation is in plain layman words), 8 (a blocked item
    names its cases with C-id and link), 9 (**the decomposition that requirement (1) turns on:
    RUNNABILITY comes from the build, the EXPECTATION from the documents — so a missing document
    blocks one and not the other**), 12 (**observed, never inferred — requirement (2) is Rule 12
    applied to the word "blocked"**), 14 (**seed it rather than declare blocked; its playbook is
    requirement (3)'s checklist**), 17 (complete data in and out — a remainder is itemised and
    honest, which requires it to be true as well as complete), 26 (roles are ours to reset and
    assign), 27 (a blocker cleared once is recorded in the playbook so it is never re-hit), 36 (an
    outstanding item must be **real** before it is registered), 45 (the outside-in lenses — an
    outsider is exactly who spots that a "blocked" item was runnable), 46 (**a deliberate hold is
    RECORDED with its evidence, so it can never look like a miss — and, in reverse, an unproved
    blocker must never be able to look like a deliberate hold**), 48 (**the five fields an item
    blocked on the QA lead carries — requirement (6)**), 49 (a queue row's trigger is the thing it is
    actually waiting on, which requires knowing what that thing really is), 57 and 58 (**a missing or
    ambiguous source blocks the ASSERTION and is never resolved from the build — the canonical case
    of a blocker that is real but partial**), 62 (**prepare it fully and stop at the button; and the
    creation hold is a genuine blocker on FILING, never on walking a case**), 63 (where clearing a
    blocker would cut across a recorded rule or a brief, surface it BEFORE the work rather than
    recording a block), 64 (a case held for an open source question is HELD, not deleted — the same
    decomposition) and 67 (**whose "what is left" column is exactly where this failure surfaces, and
    which this rule is the precondition of**).
69. **A CASE WHOSE STEPS/PRECONDITIONS CANNOT YET BE BUILD-VERIFIED GETS THE "NOT AVAILABLE ON BUILD"
    MARKER, NOT "READY" — an honest deferral, dated, with the documented source still fully cited (all
    projects).**
    USER DIRECTIVE (2026-08-17, verbatim): *"There might be the test cases for which you can not 'build
    verify' the Steps of reproduction and the Preconditions because the Build is not ready for those test
    cases or those features/functions are not yet present in the build. For those test cases instead of
    putting the marker 'Automation ready' you will put 'Not available on Build to test Yet - with the
    date when you last checked the build for that test case'. However do not forget to put the source for
    the expected behavior with all the references from specs and stories as you always do. Later we will
    run another sync to build verify if those tests are runnable on the build. Then upon success we will
    replace that statement with 'Automation Ready' marker."*
    **THE RULE:** where a case's **Steps of reproduction and Preconditions cannot be verified against the
    build** — because the build is not ready for that feature, or the feature/function is not present in
    the build yet, or build verification was deliberately DEFERRED for the pass — its automation marker
    is **NOT** `AUTOMATION: READY`. It is a **FOURTH permitted marker string**, dated:
    **`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`**
    placed **at the VERY END of Expected Results, AFTER the Rule-54 provenance line, blank line before
    and a line break after** — the placement of every automation marker (Standing Rule 61 / core §15 /
    the marker bullet in "Deliverable conventions"). **The `<date>` is the day the build was last checked
    for that case** (or, on a deferred-verification pass, the day the pass ran without opening the app).
    **THE DOCUMENTED SOURCE IS STILL FULLY CITED — this marker NEVER excuses a thin Rule-54 provenance
    line.** The expectation still comes from the documents (Rule 57), so sentence 1 of the provenance
    line is written in full with every source's read-date (Rule 54 as amended); **only sentence 2 (the
    build "last checked against …" record) is absent**, which is exactly what this marker announces. A
    case carrying it is a fully-sourced, fully-authored case whose ONLY gap is live build confirmation.
    **THE LIFT PATH:** a **later sync re-checks whether the case is runnable on the build**; on success
    the marker is **REPLACED** with `AUTOMATION: READY` (or, on ticketed failure with live backing,
    `READY - EXPECT FAIL (SV-xxxx)`, per Rule 61 §15.1). This marker is **transitional by design** — a
    placeholder a future automated/live sync clears, never a permanent verdict.
    **DO NOT CONFLATE IT WITH `HOLD`:** `HOLD` is for a genuinely unobtainable thing (a real physical
    device, an external account we do not have); this marker is for something the build **will** be able
    to run once it ships/stabilises, and it carries a date so its staleness is visible. **NOT-BUILT /
    not-available cases are EXCLUDED from any "ready to automate" figure**, same as `HOLD`.
    **RELATION TO FINALITY (core §16):** a branch being "final" means feature-complete/handed-off, not
    that every newly-specced feature is already in it — so a Fabian-design-review reconciliation that
    adds cases for stories/spec/design NOT YET shipped legitimately uses this marker rather than
    asserting `READY` (which would assert an unobserved build fact, Rule 12).
    **RATIONALE, 2026-08-17:** on the Fabian-design-review reconciliation the specs/epic/design changed
    across all three projects and Schedule was authored/updated source-first with build verification
    deliberately deferred to a later sync — so `AUTOMATION: READY` would have asserted a build fact
    nobody observed. This marker records the honest state: sourced and authored, build-confirmation
    pending. Ties to Standing Rules 7, 9 (deferred build ⇒ unpinned labels are "VIU-confirm", never
    invented), 10/12/13 (a marker never asserts an unobserved build fact), 49/60 (a provisional/dated,
    re-checkable state), 54 (sentence 1 fully written; only sentence 2 absent), 57 (expectation from
    documents regardless of build readiness) and 61 (the marker family this extends; lifts to READY on
    success, or READY - EXPECT FAIL on live-backed ticketed failure).
    **⏳ DATED NOTE, 2026-08-17 (QA lead point 7) — THE MARKER STAYS UNTIL A LATER BUILD-VERIFY SYNC
    PROVES THE STEPS + PRECONDITIONS ACTUALLY RUN ON THE BUILD.** The `Not available on Build to test
    Yet` marker is **not** cleared by re-authoring, by a spec/design update, or by the branch being
    called "final" — it comes off ONLY when a **later build-verify sync opens the app and confirms the
    case's Steps of reproduction and Preconditions are runnable on the build**, at which point it is
    replaced with `READY` (or `READY - EXPECT FAIL (SV-xxxx)` on live-backed ticketed failure). Until
    that sync runs the marker is the honest state and must be left in place. **AND — see the Rule-62
    hold note of the same date — completing that build-verify sync does NOT permit creating the
    expect-fail/defect tickets: the Jira creation hold persists through and beyond build verification
    (verbatim: *"Even then we will keep a hold on creating tickets until I allow you to create the
    tickets."*).**
    **⇒ DATED ADDITION, 2026-08-17/18 (QA lead, approved with "Add") — THIS MARKER SUBSTITUTES FOR A
    PLAIN `AUTOMATION: READY` MARKER ONLY.** The Rule-69 marker
    `AUTOMATION: Not available on Build to test Yet - Last checked <date>` may replace a plain
    `AUTOMATION: READY` marker **and nothing else.** **NEVER overwrite an existing
    `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or `AUTOMATION: HOLD - <reason>` marker with it** —
    those carry ticket / blocker references that must be preserved. So, on a touched case whose
    steps/preconditions cannot yet be build-verified: a **plain-READY** case → the Rule-69 marker; an
    **EXPECT-FAIL** or **HOLD** case → **keep its existing marker.** Ties to Standing Rules 60/61 (the
    marker family) and 12 (a marker never asserts an unobserved build fact).
    **⇒ DATED ADDITION, 2026-08-18 (QA lead, PROPOSED-AND-CONFIRMED per Rule 72) — THE DEFERRED MARKER
    NEVER OVERWRITES EXPECT-FAIL/HOLD, AND A MID-EFFORT POLICY MUST BE SWEPT RETROACTIVELY.**
    - **THE `Not available on Build to test Yet` MARKER NEVER OVERWRITES AN EXISTING
      `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` OR `AUTOMATION: HOLD - <reason>` MARKER** — exactly as
      the Rule-69/C marker-substitution note immediately above requires (and exactly as the plain-`READY`
      substitution rule requires): those markers carry ticket / blocker references and are PRESERVED. The
      deferred marker substitutes for a **plain `AUTOMATION: READY`** marker **ONLY**.
    - **WHEN A RULE OR POLICY IS ESTABLISHED MID-EFFORT: RETROACTIVELY SWEEP THE EARLIER PASSES OF THAT
      SAME EFFORT FOR COMPLIANCE.** Do NOT assume the earlier batches followed a rule that did not exist
      when they ran. If the earlier passes violated the newly-set policy, FIX them.
    - **RATIONALE, 2026-08-18:** the marker-substitution policy (Rule 69/C) was established DURING the
      Report Suite currency pass, but the EARLIER Fabian authoring passes had already overwritten **47
      EXPECT-FAIL/HOLD markers** with the deferred marker before that policy existed — and no one swept
      back to catch it, so it was only found later by a live audit (Rule 50/G, audit-from-live). Ties to
      Standing Rules 61 (the marker family), 69/C (the substitution note this extends) and 51/52 (the
      ticket references those EXPECT-FAIL/HOLD markers carry).
    **⇒ DATED REFINEMENT, 2026-08-18 (QA lead, PROPOSED-AND-CONFIRMED per Rule 72) — THE AUTOMATION
    MARKER KEYS ON TESTABLE CONTENT, NOT ON A METADATA REFRESH.**
    - **A case's automation marker is ADDED or CHANGED ONLY when either (a) the case is NEWLY AUTHORED,
      or (b) its TESTABLE CONTENT — title, preconditions, steps of reproduction, or the
      expected-behaviour BODY — changed because of a spec/source change.**
    - **A METADATA-ONLY UPDATE MUST NOT CHANGE THE MARKER.** "Metadata" here = the provenance line (spec
      version, read-dates, epic/story/source references sitting below the line break — Rule 54), the
      `refs` field, and the marker line itself. **When a pass only refreshes provenance / refs / version
      / date and the testable content is BYTE-IDENTICAL, the case KEEPS ITS EXISTING MARKER** — a
      previously-`AUTOMATION: READY` case STAYS `AUTOMATION: READY` (plain READY is build-independent,
      Rule 60), and it is **NOT** flipped to `AUTOMATION: Not available on Build to test Yet`.
    - **THE BROADER PRINCIPLE THIS ENFORCES:** in ANY pass, DISTINGUISH a content change from a metadata
      refresh. **Content-level decisions** — the automation marker, EXPECT-FAIL, deviation status,
      re-verification obligations — **key on TESTABLE-CONTENT changes**; **provenance / refs / version /
      date refreshes are BOOKKEEPING and must NEVER trigger them.**
    - **RATIONALE, 2026-08-18:** the 2026-08-18 currency passes wrongly stamped the `Not available on
      Build to test Yet` marker onto **~570 REFERENCE-ONLY cases** (Schedule ~142, Report Suite ~387,
      Filters ~41) whose testable content did **not** change — because the pass treated *"we refreshed
      the provenance / version / date below the line break"* as *"we changed the case."* A
      provenance/date refresh is bookkeeping; it must not drive a content-level decision like the marker.
      **The QA lead's intent was that the deferred marker go ONLY on newly-added or
      content-changed-due-to-spec cases.** Ties to Standing Rules 41 (touch a case → re-verify the WHOLE
      case, but re-verifying is not the same as CHANGING content), 54 (the provenance line is the
      metadata layer this refers to), 60 (plain `READY` is build-independent and survives a re-stamp), 61
      (the marker family) and this rule (69).
    **⇒ DATED ADDITION, 2026-08-18 (QA lead, EXPLICIT DIRECTIVE TO RECORD — Rule 72's "propose before
    recording" is satisfied because he asked for it in his own words) — THE TREATMENT FOR A PROJECT
    DEPLOYED TO STAGING WHOSE FEATURES ARE NOT YET ALL COMPLETE. This is the state the upcoming
    SCHEDULE build-verification will use, and it applies to ANY FUTURE PROJECT in the same state.**
    USER DIRECTIVE (2026-08-18, verbatim, his typing preserved exactly because Rule 25 applies to his
    instructions as it does to a spec): *"save it in your skills and rules about how to treat the test
    cases for a project whose features are not yet complete."* He gave this while authorising Schedule
    build-verification next — Schedule is now on staging, some of its features may not be complete, and
    those cases are treated exactly the way the Report Suite SBC/SBR build-verify passes already
    treated similar cases.
    **BUILD-VERIFY IS A PROJECT-LEVEL STATE, NOT ONLY A PER-CASE ONE.** When a project's build is on
    staging but some features are still under development, you STILL build-verify EVERY case by LIVE
    OBSERVATION. **JUDGE BY LIVE OBSERVATION, NEVER BY JIRA STORY STATUS** — devs frequently leave a
    story "Open" while the feature is in fact built, and conversely a feature you cannot find in the
    build is treated as not-yet-developed. **Live observation is the arbiter; the story field is not**
    (this is Rule 60's layer-1/2 logic — a verdict rests on the build, never on the ticket).
    **THE PER-CASE OUTCOMES — THREE:**
    **(1) FEATURE PRESENT + case runs / passes** → `AUTOMATION: READY`. Correct any cosmetic label or
    route drift so the case is build-accurate (Rule 9 cosmetic-vs-substantive), and add or refresh the
    Rule-54 provenance **sentence 2** *"Last checked against build <marker> on <date>."* (sentence 1
    stays documents-only).
    **(2) FEATURE PRESENT + a genuine deviation** → record it with live evidence. If a **LIVE OPEN
    ticket** backs it → `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` with the Rule-61 symptom +
    three-outcome block. If **NO live-backed ticket** (closed / obsolete / none) → **flag the defect in
    the findings with evidence + a recommendation, FILE NO Jira ticket** (creation is on the QA lead's
    hold, Rule 62), and set the case to **plain `AUTOMATION: READY`** — a stale EXPECT-FAIL marker has
    no live backing (Rule 61's 2026-08-11 amendment, skill §15.1).
    **(3) FEATURE NOT FOUND IN THE BUILD** → treated as **NOT-YET-DEVELOPED — neither a fail nor a
    pass; it is EVIDENCE OF ABSENCE, recorded** (never inferred, Rule 12; a "not found" is a
    measurement only if a probe that could fire found nothing — the probes-that-cannot-fail
    discipline). **KEEP the case's `AUTOMATION: Not available on Build to test Yet` marker, update its
    date to the day checked, and add — BELOW the sources, after a line break — this exact tester-facing
    line (generalise the date; keep the wording):** *"This test case could not be build-verified on
    <M/D/YYYY> because the feature it tests was not found in the build yet — the related story is still
    under development. It will be re-checked in the separate build-verification run once the feature
    ships."* **Then LOG the case to a SEPARATE deferred build-verification run list — a local
    `DEFERRED-RUN.md` per project, NOT a new TestRail run object** — to be re-checked when staging
    redeploys or the devs confirm the feature shipped.
    **THE STANDING RE-CHECK TRIGGER FOR THIS POPULATION IS THE FEATURE SHIPPING, NOT A REDEPLOY ALONE
    (Rule 49 / Rule 60(b)).** The deferred cases are re-checked on a later build-verification run once
    the feature ships — and only then is the marker lifted to `READY` (or `READY - EXPECT FAIL` on a
    live-backed failure).
    **AUTOMATED CASES (`custom_atmstatus = 3`) ARE HELD, NOT WRITTEN, DURING ANY SUCH PASS (Rule 71).**
    Verify them live, record the intended change, and put it to the QA lead for ask-first ratification —
    the edit is batched into the coupled build-verify pass, never made on a documents-only run.
    **MARKER DISCIPLINE IS UNCHANGED (Rule 69 above):** the deferred marker substitutes for a plain
    `AUTOMATION: READY` marker **ONLY** — it never overwrites an existing `READY - EXPECT FAIL
    (SV-xxxx)` or `HOLD` marker; and a **metadata-only re-stamp keeps the existing marker** (the
    testable-content refinement above).
    Ties to Standing Rules 49 (the deferred / re-check queue — its trigger is the thing it waits on,
    not a deploy), 54 (sentence 2 records the build actually checked; sentence 1 stays documents-only),
    57 (the expectation still comes from the documents whatever the build's readiness), 60 (build-verified
    vs not; live observation over story status; layers 1–2), 61 (the marker family; a stale expect-fail
    has no backing), 62 (nothing is filed while the creation hold stands), 69 (the deferred marker and
    its substitution / metadata rules) and 71 (Automated cases held). Operator form:
    `build/skills/03-RUN-CHECK.md` § "Project whose features are not yet complete".
70. **COMMUNICATE WITH THE QA LEAD CLEARLY: ACTION-FIRST, PLAIN-LANGUAGE, TABLE-FORM — tell him
    EXACTLY what to DO and help him UNDERSTAND what each item is (all projects, every communication).**
    USER DIRECTIVE (2026-08-17, verbatim, two messages): *"Please whenever you communicate with me
    please communicate with me in clear things for me to do like what I exactly need to do and help me
    understand what I really need to do and what are you talking about and ideally share things with me
    in the form of a table."* and *"Yes make it a rule to always communicate with me in similar
    mannaers."*
    **THE RULE:** every **status update, report, question set and outstanding-items list** to the QA
    lead is written as **CLEAR, ACTIONABLE communication** — not a description of state he then has to
    decode. Four requirements, every time:
    **(1) STATE EXACTLY WHAT HE NEEDS TO DO for each item — a concrete action he can take**, phrased as
    the action itself (e.g. *"reply 'sync run 357'"*, *"say yes to file these 5 defects"*, *"send
    Branko's PRD"*), **NOT merely that something is pending or waiting.** A row that says *"awaiting your
    decision"* without naming the decision is non-compliant (this is the same bar Rule 48 sets for
    QA-lead-blocked items).
    **(2) HELP HIM UNDERSTAND what each item means, in plain layman words** — never assume he knows the
    internal term, the case ID, the ticket, or the jargon. Explain **"what I'm talking about"** in one
    plain sentence before asking anything of him (Rule 7). The C-id and link still travel with it (Rule
    8), but the plain explanation comes first.
    **(3) PRESENT AS A TABLE wherever there is more than one item, or more than one attribute per
    item.** Ideal columns: **# · What it is (plain) · What YOU do · Why it matters / what it affects ·
    Priority.** A wall of prose listing several asks is non-compliant — the table is his default, his
    explicit ask.
    **(4) SEPARATE "needs your decision/action" from "informational / tidy"** so he can see **at a
    glance** what actually requires him versus what is just being reported. Never bury a real ask inside
    a status narrative.
    **THIS STRENGTHENS — does not replace — the existing plain-language conventions:** Standing Rule 7
    (plain layman wording for everything reader-facing), the **"Simple-format status updates"** bullet
    and the **"Deliverable conventions the user likes"** section (short plain statements under clear
    headings). Rule 7 governs the WORDS; this rule governs the STRUCTURE — action-first, understood, in
    a table, decisions separated from noise.
    **RATIONALE, 2026-08-17:** the QA lead received a report that said in effect *"13 items waiting on
    you"* without spelling out what each item was or what he was supposed to do about it, and directed
    that all communication going forward be clear, action-first and table-form so he can act without
    having to reverse-engineer our meaning. A list of blockers he cannot act on is not help; it is
    homework. Ties to Standing Rules 7 (plain layman wording), 8 (always give the C-id + link), 36 (the
    OUTSTANDING-ITEMS list is the prime place this table form applies), 46 (a decision recorded so it
    can never look like a miss) and 48 (a QA-lead-blocked item names the ruling, the action and who
    unblocks it — this rule makes that presentation a table).
71. **PROTECT "AUTOMATED" CASES — never change or delete a case TestRail flags as Automated without
    asking the QA lead first (all projects, INCLUDING our OWN cases).**
    USER RULING (2026-08-17/18, explicitly approved with *"Add"*).
    **THE RULE:** never change, edit, or delete a test case whose TestRail Automation-status field is
    **"Automated" (`custom_atmstatus = 3`)** without **asking the QA lead first and getting
    permission** — and **this applies EVEN to our OWN cases (`created_by = 3`)** if someone (e.g.
    Vladimir Tomovic, id 1) has flagged them Automated.
    **THE PRECONDITION OF ANY PASS THAT WRITES TO CASES:** before any authoring / VIU / currency pass,
    **IDENTIFY the in-scope `custom_atmstatus == 3` cases first**; if the pass would touch one, **STOP
    and ASK the QA lead (per case or per batch) and proceed only with permission.**
    **HOW THIS DIFFERS FROM RULES 64 AND 65, so all three are read together:** Rule 64 checks the
    Automated flag as a **precondition of DELETION**; Rule 65 requires **TELLING VLAD AFTER** a change
    lands. **This rule adds the ASK-FIRST GATE, BEFORE any change of any kind** — an update as much as a
    delete. The three are complementary: **ask before (71) → do only with permission → tell Vlad after
    (65)**; and deletion additionally carries Rule 64's automation precondition.
    **CONTEXT:** the 2026-08-17/18 currency passes edited content on **44 of our own Automated-flagged
    cases** (11 real content changes, 33 marker-only) **without asking**; the QA lead ruled **KEEP
    them** but set this ask-first rule going forward.
    **⇒ POST-BUILD-VERIFY VLAD HAND-OFF (process, 2026-08-17/18, QA lead approved with *"Add"*).**
    After build verification proves an Automated case's steps/preconditions **run on the build**, its
    plain-text marker is corrected to **`AUTOMATION: READY`** (Automation Ready) **AND its case number
    is shared with Vladimir Tomovic (id 1)** so he adjusts his automations. **The durable hand-off list
    is `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` — the standing
    hand-off artifact.** (This is the operational pairing of Rule 65's tell-Vlad duty with Rule 69's
    marker-lift path: build-verify proves runnable → marker lifts to READY → Vlad is handed the case
    number via the register.)
    Ties to Standing Rules 6 (nothing written to TestRail without permission), 12 (observed, never
    inferred — including never inferring permission), 38 (foreign cases are hands-off; this protects OUR
    Automated cases the same way for the same reason — an automation suite may depend on them), 64 (the
    automation precondition of deletion), 65 (tell Vlad after a change) and 69 (the marker-lift path).
    **⇒ DATED REFINEMENT, 2026-08-18 (QA lead, PROPOSED-AND-CONFIRMED per Rule 72) — AUTOMATED CASES ARE
    EDITED ONLY COUPLED WITH BUILD VERIFICATION, THEN HANDED TO VLAD.**
    - **Rule 71 does NOT mean "never touch Automated cases."** An Automated case (`custom_atmstatus = 3`)
      MAY genuinely need updating — its **steps of reproduction, preconditions, and expected behaviour** —
      to match the current sources.
    - **BUT an Automated case is EDITED ONLY WHEN WE CAN ALSO BUILD-VERIFY IT IN THE SAME PASS**, so the
      steps/preconditions produced are **CONFIRMED RUNNABLE ON THE BUILD before they reach anyone**.
      **Editing + build-verifying an Automated case happen TOGETHER, never separately.**
    - **THE LOGIC (this is why the rule exists):** an Automated case is the **contract Vlad's (Vladimir
      Tomovic, id 1) automation runs against.** Editing it WITHOUT build-verifying hands Vlad a **MOVING,
      UNVERIFIED target** — steps that may not actually run on the build (exactly the risk while build
      verification is deferred and a feature may not even be built yet). Vlad would then rebuild his
      automation to match unverified steps, and if they turn out not to be runnable **his work breaks and
      must be redone.** COUPLING the edit with build verification means Vlad only ever receives
      steps/preconditions that are **REAL, RUNNABLE and CONFIRMED on the build**, so he adjusts his
      automation **ONCE, correctly.**
    - **CONSEQUENCE — WHILE BUILD VERIFICATION IS DEFERRED (features not yet on the build): do NOT edit
      Automated cases. HOLD them.** Do the edit-and-verify TOGETHER during the build-verify pass (when the
      features are on staging): make the steps/preconditions build-accurate and runnable, **VERIFY LIVE**,
      set the correct marker (`AUTOMATION: READY` per Rule 69/61 on success, or `READY - EXPECT FAIL
      (SV-xxxx)` if a known bug with live backing), and THEN hand the case number to Vlad (the Rule 71 /
      Rule-B hand-off via `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`).
    - **ASK-FIRST STILL APPLIES:** Rule 71's permission gate stands — even coupled with build
      verification, **get the QA lead's go-ahead before editing an Automated case.**
    - **STRATEGY IN ONE LINE:** Automated-case edits are **BATCHED INTO THE BUILD-VERIFY PASS**
      (edit-and-verify together, then hand off to Vlad) — **NEVER edited on a documents-only /
      deferred-build pass.** Cross-refs: Rules 69 (the marker-lift path), 61 (the marker family), B (the
      POST-BUILD-VERIFY Vlad hand-off sub-note above) and the build-verify skill
      `build/skills/03-RUN-CHECK.md` §6.4 (where the edit+verify coupling operationally lives).
    **⇒ DATED ADDITION, 2026-08-18 (QA lead, PROPOSED-AND-CONFIRMED per Rule 72) — CORRECTING OUR OWN
    ERRONEOUS METADATA-ONLY CHANGE ON AN AUTOMATED CASE IS A PERMITTED CORRECTION (WITH QA-LEAD
    AUTHORISATION), DISTINCT FROM A CONTENT EDIT.**
    - **Reverting or correcting OUR OWN erroneous METADATA-ONLY change on an Automated case
      (`custom_atmstatus = 3`) is a PERMITTED CORRECTION, done WITH the QA lead's authorisation.**
      Example: restoring a marker we wrongly applied, where the case's TESTABLE CONTENT — title,
      preconditions, steps of reproduction, expected-behaviour BODY — is UNTOUCHED. It restores the case
      (and Vlad's expected state) and does NOT touch what Vlad's automation runs against.
    - **THIS IS DISTINCT FROM "editing an Automated case."** Per the 2026-08-18 build-verify-coupling
      refinement above, "editing an Automated case" means changing its **testable content**, which
      requires build-verify coupling (edit + verify together, then hand to Vlad). **The
      build-verify-coupling requirement applies to CONTENT edits — NOT to undoing our own metadata
      error.**
    - **ASK-FIRST STILL APPLIES:** the correction is done only with the QA lead's go-ahead (as given
      2026-08-18 for the marker revert).
    - **RATIONALE, 2026-08-18:** 27 Automated cases had the deferred marker (Rule 69) wrongly applied on a
      metadata-only re-stamp; the QA lead authorised reverting their markers because the testable content
      was untouched — a correction that RESTORES Vlad's expected state, not a content edit. Ties to
      Standing Rules 38 (foreign/Automated cases hands-off — this is the narrow permitted-correction
      carve-out), 69 (the content-vs-metadata refinement that classifies what changed), 71 (the
      build-verify coupling for content edits) and B (the POST-BUILD-VERIFY Vlad hand-off).
    **⇒ DATED REFINEMENT, 2026-08-20 (QA lead) — THE ANSWER TO "WHEN IS AN AUTOMATED CASE UPDATED?",
    PLUS THE MANDATORY "FOR VLAD" HAND-OFF. This ANSWERS Rule 71's ask-first gate; it does not remove
    it — the ask-first origin above stands as history.**
    USER DIRECTIVE (2026-08-20, verbatim): *"I see maybe you are referring to hold the test case writing
    for the ones having the AUTOMATED marker, yes, they need to be changed ONLY if they are build
    verified and something in their title/preconditions/steps of reproduction/Epected behavior changed -
    If yes then we need to also update them with the sources references so that those changes do not bite
    me and then I have to share the test case numbers with Vlad who is very critical about test cases
    failure to update his auotmations accordingly, note that any test cases which we update/create and
    that goes to Vlad and his automation fails we will be blamed for that and it will bite us."*
    - **UPDATE AN AUTOMATED CASE (`custom_atmstatus = 3`) ONLY IF BOTH ARE TRUE:** **(a)** it is
      **build-verified** in the same pass (the edit-and-build-verify coupling above), AND **(b)**
      something in its **Title / Preconditions / Steps of reproduction / Expected behaviour genuinely
      changed.** **If it is build-verified and NOTHING in that content changed — LEAVE IT. Do not churn
      it.**
    - **ANY Automated case we update — and ANY case (new or updated) that goes to Vlad's automation —
      MUST carry its SOURCE REFERENCES** (Rule 20: `<ticket> (<spec/design anchor>)`), so the change is
      traceable and "does not bite" us later.
    - **THE "FOR VLAD" HAND-OFF IS MANDATORY.** Every created or updated case bound for Vlad's
      automation goes on a **FOR VLAD** hand-off list: the **C-id + exactly what changed (which field)
      + the source reference.** The standing durable artifact is
      `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`, plus each pass's
      "AUTOMATED CASES CHANGED — FOR VLAD" section. **The hand-off list is a REQUIRED deliverable of any
      pass that touches Automated cases.**
    - **WHY (his words):** Vlad (Vladimir Tomovic, id 1) is **very critical about test-case failures**;
      **any case we update/create that reaches his automation and makes it fail is blamed on us.** An
      un-communicated change that breaks his automation is our fault — so a change is communicated with
      its source reference, or it is not made.
    **⇒ DATED REFINEMENT, 2026-08-20 (QA lead, verbatim: *"Yes always atleast rad to tell if they need to be changed, and then hold on me whether I want them to be changed or not. Save it in your rules and skills"*) — ALWAYS READ-ASSESS AN AUTOMATED CASE FIRST; NEVER BLANKET-SKIP IT UNEXAMINED.**
    Rule 71's ask-first gate governs **EDITING** an Automated case (`custom_atmstatus = 3`); it does **NOT** license **skipping the case unassessed.** On any pass that would touch a set of cases, an Automated case is **ALWAYS READ (read-only, which Rule 71 permits) to determine WHETHER it needs the change**, the finding is **REPORTED** (this case needs X / this case is already fine), and **THEN the case is HELD for the QA lead's decision** on whether to actually change it. **A blanket skip that never checks whether the Automated case needs the change is NON-COMPLIANT** — it leaves the QA lead unable to decide, and it can silently leave a real defect (e.g. a collapsed-rendering case) in place. **SEQUENCE: READ → ASSESS + REPORT the need → HOLD for his go-ahead → (only on his "yes") edit, coupled with build-verify where content changes, then notify Vlad (Rule 65).** **RATIONALE, 2026-08-20:** a format-reflow pass BLANKET-SKIPPED 5 `atm=3` Schedule cases (C43811, C38847, C38848, C38849, C38850) without checking; a read-only check then found **all 5 render collapsed (Steps + Preconditions)** and DO need the fix — the QA lead required the read-assessment ALWAYS happen first so he can decide with the facts, not a blind skip. Ties to Standing Rules 12 (observed, never inferred — the need is READ, never assumed), 50 (read-assess exhaustively, no sampling), 65 (tell Vlad after an authorized change), 69 (the marker) and 72 (this refinement is recorded because he asked for it).

72. **PROPOSE SKILL / RULE CHANGES BEFORE RECORDING THEM — never add to the Skills or CLAUDE.md
    autonomously (all projects).**
    USER DIRECTIVE (2026-08-17/18, verbatim, explicitly approved with *"Add"*): *"make/update the rules
    and keep on updating the Skills ... updating the skills on what we decide as the correct way forward
    as an ongoing process ... Make sure that you do not make your skills bad or do not learn the wrong
    process, rather ask me before blindly adding anything to the skills."*
    **THE RULE:** skill and rule updates are an **ONGOING process** — we keep improving them — **but
    every one is PROPOSED to the QA lead for approval BEFORE it is written into the Skills
    (`build/skills/*`) or `CLAUDE.md`.** Nothing is added **autonomously or blindly.** **The goal is to
    keep improving the skills WITHOUT teaching a wrong process** — a bad rule, recorded, propagates to
    every future cold session that trusts it, so the cost of a wrong learning is far higher than the
    cost of asking.
    **WHAT THIS DOES AND DOES NOT REQUIRE:** it requires the QA lead's go-ahead **before recording** a
    new or changed rule/skill; it does **not** stop us **drafting** the proposed wording, nor recording
    a rule/skill change he has **already approved** (this very pass records seven he approved item by
    item with *"Add"*). Where he has ruled, record it faithfully (Rule 25) and keep any superseded
    wording visible and dated (the Rules 31/52/53 pattern); where he has not, **draft and ask, do not
    write.**
    **DISTINGUISH THIS FROM RULE 63:** Rule 63 governs the case where his instruction **conflicts with
    an existing rule** (surface the conflict before acting); **this rule governs the routine act of
    changing the rulebook itself** — even a non-conflicting improvement is proposed before it lands.
    Ties to Standing Rules 18 (reconstruct the full originating instruction history when encoding a
    process), 21 (the Process-Authoring Standard), 25 (record his wording verbatim), 32/33 (latest
    authoritative ruling wins; he is the authority on the rules) and 63 (surface a conflict before
    acting).
73. **WHEN THE JIRA CREATION HOLD LIFTS, RESUME ONE TICKET AT A TIME — AND EVERY TICKET MUST CLEAR THE
    DEFECT-TICKET QUALITY CHECKLIST BEFORE IT IS PROPOSED FOR CREATION (all projects; reinforces Rules
    51/52/53/62).**
    USER DIRECTIVE (2026-08-17): the QA lead instructed that a **defect-ticket quality standard** and a
    **one-at-a-time resume process** be RECORDED as a rule, **because previously-created tickets "did
    bite us."** He restated the standing hold in the same period, verbatim: ***"Lets hold them until we
    are done with Build verification ... Even then we will keep a hold on creating tickets until I allow
    you to create the tickets."***
    **THE HOLD STANDS FIRST (Rule 62 + skill §11.1) — NOTHING IN THIS RULE LIFTS IT.** Jira ticket
    creation stays **ON HOLD until the QA lead EXPLICITLY asks to resume**; finishing build verification
    does **not** lift it. This rule governs **what happens the moment he does**, and what every prepared
    ticket must already satisfy so that the first one out of the door cannot be thrown back.
    **THE RESUME PROCESS — ONE TICKET AT A TIME, NEVER A BATCH.** When he asks to resume: **(1)** Claude
    creates **ONE** ticket; **(2)** the QA lead **verifies that one ticket**; **(3)** ONLY THEN does
    Claude create the next. **Never batch; never file the second before the first is confirmed.** This is
    the operational lesson of the tickets that bit him — a weak ticket filed in a batch discredits the
    good ones beside it, and one-at-a-time makes each ticket separately answerable. It also keeps Rule
    62's PER-ASK permission true in practice: each ticket is its own confirmed step, and an earlier
    confirmation never covers the next ticket.
    **THE DEFECT-TICKET QUALITY CHECKLIST — a ticket that FAILS ANY ITEM is NOT READY to be proposed for
    creation** (and saying so is the correct outcome, not a failure of the pass):
    · **[1] STORY DEFECT OF THE RELATED STORY** — `issuetype` = `Story Defect`, `parent` = the OWNING
    STORY (the full Rule-52 shape: also `relates to` the story, no Product Area, priority `Medium` per
    Rule 53, `High` barred; never `Story Defect - Archive`).
    · **[2] NOT A DUPLICATE of an already-reported issue** — run a duplicate search FIRST and STATE WHAT
    WAS RULED OUT (record the JQL). Several tickets we filed already existed, and a duplicate is the
    cheapest way to look careless in front of the queue it lands in.
    · **[3] RUNNABLE, AND THE EASIEST POSSIBLE TO REPRODUCE** — easy-to-follow steps of replication a
    **NON-TECHNICAL PO can actually run**, using the exact on-screen labels; include the steps that
    CREATE any needed data; NAME the exact test data used and what was ruled out (Rule 52 item 3); **NO
    API calls in the steps.**
    · **[4] RELEVANT ANNOTATED SCREENSHOTS** — embedded so they RENDER (not a file list), marked up
    (arrow / box / caption) so the fault is visible without reproducing it.
    · **[5] EXPECTED BEHAVIOUR, THEN — AFTER A LINE BREAK — ITS SOURCE** — the source is named
    immediately below the expected behaviour.
    · **[6] THE EXPECTED BEHAVIOUR IS WORD-BY-WORD FROM THE SOURCE, IN QUOTATION MARKS** — **NO invented
    expected behaviour and NO wrong interpretation required.** The expected behaviour is quoted
    **literally, in quotation marks, from a named document with its version and date**, so there is
    **0% chance it bites us**. **If it cannot be quoted verbatim from a document, THERE IS NO TICKET**
    (Rule 57; this strengthens Rule 52 item 1 — the quote is literal and in quotation marks, not merely
    "quoting the requirement").
    · **[7] CONCISE — NOT TOO LENGTHY** — no unnecessary information; to the point. An over-long ticket
    buries the fault and invites dismissal.
    **RATIONALE — RECORDED, because it is exactly why each item exists:** previous tickets bit us (and
    the QA lead said his job was on threat because of it) because they were **too lengthy with
    unnecessary information, had missing screenshots, had steps of reproduction that non-technical POs
    could not run, and cited sources by reference while quoting NOTHING verbatim from them.** The
    checklist closes each of those four failure modes directly — [7] the length, [4] the screenshots,
    [3] the runnability, and [5]/[6] the verbatim-quoted source.
    **RELATION TO RULE 52's EIGHT-ITEM EVIDENCE BAR:** this checklist is the **same standard, re-stated
    as the QA lead's 2026-08-17 gate**, hardening three points — the **one-at-a-time resume**, the
    **verbatim-in-quotation-marks** expected behaviour, and the **easiest-possible-for-a-non-technical-PO**
    reproduction. Where they overlap, satisfy BOTH; Rule 52 carries the full field/type detail and the
    screenshot-loss hazard, and Rule 51 still governs API-related tickets (asked separately, every time).
    Ties to Standing Rules 6 (nothing to a system of record without permission), 7 (plain layman wording
    — the PO must be able to run it), 8 (name the affected cases in OUR records, not the ticket), 25
    (quote the source verbatim), 46 (a deliberate non-filing is recorded so it can never look like a
    miss), 48 (a held item quotes the ruling holding it), 51 (API tickets asked separately), 52 (the
    shape + the eight-item bar), 53 (priority `Medium`), 57 (expected behaviour comes from the document,
    never the build) and 62 (the creation hold; per-ask permission).
74. **NO PRESENT FEATURE IS LEFT UN-BUILD-VERIFIED — SEED DATA AND LOG IN AS NEEDED; THE ONLY
    UN-VERIFIED CASE IS A GENUINELY ABSENT FEATURE (all projects).**
    USER DIRECTIVE (2026-08-19, verbatim, his typing preserved exactly because Rule 25 applies to his
    instructions as it does to a spec): *"why would you skip build verifying any case … specially when I
    have told you how critically we need all the tests build verified. also, I told you not to block
    yourself for data seeding issues and seed data the way you want in staging and QA branches because
    those are all test accounts/branches. also for multi log in blocked test cases again login as needed
    and dont get yourself blocked at all. there should not be such big negative surprises that fails me
    and get me bitten for not getting the test cases Runnable for the QA testers. learn from that, add
    your learning to the rules and also to the skills."* (Rule 72's "propose before recording" is
    satisfied — he explicitly instructed this be recorded.)
    **THE RULE, IN ONE LINE: on a build that is on staging/QA, the ONLY acceptable un-build-verified
    case is one whose FEATURE IS GENUINELY ABSENT FROM THE BUILD. Everything else is driven live, and a
    data-state or a login is NEVER the reason a case is skipped.**
    **(1) BUILD VERIFICATION IS INDIVIDUAL AND EXHAUSTIVE (Rule 50).** EVERY case whose feature is
    present in the build is **driven live and re-stamped** (Rule 54 sentence 2, *"Last checked against
    build … on …"*). **"The feature area is confirmed present" is NOT a substitute for verifying each
    case.** **"Present but not individually re-stamped" is NOT an acceptable outcome and must never be
    reported as a completed pass — it is UNFINISHED WORK** (Rule 50 Part 1: no sampling, no "the area is
    covered", the honest report is how many cases had EVERY step verified, stated as N of M on which
    build marker).
    **(2) NEVER LEAVE A CASE HOLD / NOT-VERIFIED FOR A DATA-STATE THAT CAN BE SEEDED, OR FOR NEEDING A
    SECOND / DIFFERENT / ROLE-SPECIFIC LOGIN.** Staging and the QA branches are disposable TEST
    accounts/branches (Rule 6), so both are self-service and NEVER a blocker:
    · **SEED any data-state yourself (Rule 14)** — work orders, lines, parts, cores, invoices,
    multi-state records, POs, deliveries, roles. His words: *"seed data the way you want."*
    · **LOG IN AS WHATEVER USER / ROLE IS NEEDED to observe role / permission / second-user behaviour**
    — create a fresh staff per role and self-login, OR impersonate via `switch-user`, OR `quick-login`.
    His words: *"for multi log in blocked test cases again login as needed and dont get yourself blocked
    at all."*
    **⚠️ THIS OVERRIDES the earlier shared-session cautions where they would cause a SKIP.** The prior
    *"avoid `quick-login`/`switch-user` for shared-session safety"* guidance and the *"accept an honest
    N-of-M when a second sign-in is needed"* stance are **SUPERSEDED for disposable test envs**: on
    staging/QA you **self-seed and self-login rather than block.** **The safeguard is PRESERVED, not
    abolished** — do not rotate a session that ANOTHER OF OUR OWN concurrent workers is actively using;
    **sequence multi-login work, or use a SEPARATE BROWSER CONTEXT / a FRESH STAFF LOGIN, so a sibling
    is not disturbed** — **but the concurrency safeguard may NEVER become the excuse to skip a case.**
    (This refines skill `03` G3 / core §6: the constraint is "don't disturb a live sibling", not "don't
    log in".)
    **(3) THE ONLY ACCEPTABLE UN-VERIFIED CASE IS ONE WHOSE FEATURE IS GENUINELY ABSENT FROM THE BUILD**
    → Rule 69 deferred treatment: keep the `AUTOMATION: Not available on Build to test Yet - Last
    checked <date>` marker, add the under-development line, log it to the project's `DEFERRED-RUN.md`,
    and re-check when the feature ships. **Absence is a MEASUREMENT, never an inference** (Rule 12; a
    "not found" counts only if a probe that COULD fire found nothing — skill `03` §2 probes-that-cannot-
    fail). A data-state or a login is not absence of a feature.
    **(4) A HARNESS / TOOLING LIMITATION IS NOT THE SAME AS UN-RUNNABLE.** If OUR automation harness
    cannot perform a gesture (e.g. a mouse drag) but a MANUAL QA can, **the case stays `READY` and
    build-accurate/runnable** — record our own auto-observation limit SEPARATELY, but NEVER present a
    harness limit as *"not runnable"* and NEVER leave the case un-verified for it. Build-accurate labels
    and steps are still corrected from the build so the manual tester can run it (Rule 9).
    **(5) THE GOAL, STATED: every delivered case is RUNNABLE by a non-technical manual QA — no negative
    surprises, nothing left non-runnable, because a skipped case FAILS THE QA LEAD PUBLICLY.** His words:
    *"there should not be such big negative surprises that fails me and get me bitten for not getting the
    test cases Runnable for the QA testers."* This is the **enforcement teeth** behind Rules 7/9/28's
    runnability requirement.
    **CHECKLIST GATE (the operable form): before reporting a build-verify pass complete, CONFIRM 0 cases
    were skipped for data-seeding or login reasons.** If any were, the pass is NOT complete — seed the
    data, log in as needed, and finish them; a case may end un-verified ONLY under (3), genuine feature
    absence.
    **RATIONALE, 2026-08-19:** the Report Suite build-verify left **157 cases "present but not
    individually re-stamped"** plus **~30 on `HOLD` for a second sign-in or an "unseedable" data-state**
    — the product of an over-cautious orchestration instruction (no `quick-login`/`switch-user`; accept
    an honest N-of-M for data/login). The QA lead required these all be build-verified: on a disposable
    test env there is no such thing as an un-seedable data-state or an un-obtainable login, so those
    were never legitimate blockers, and a case left non-runnable for the manual testers is the negative
    surprise that bites him in front of the organisation. Ties to Standing Rules 5 (self-service test
    data/roles), 6 (everything except TestRail is a disposable TEST account — act freely), 14 (never
    mark NOT-VERIFIED for a missing data-state — seed it; the self-seed playbook), 22 (ask for the live
    check + access up front — and when access is granted, USE it, do not skip), 26 (reset roles to
    template first, then observe live per role), 49 (the deferred / re-check queue — a genuinely absent
    feature is its ONLY legitimate occupant here), 50 (verify EXHAUSTIVELY then EXACT — every present
    case, every field, no sampling; "swept"/"covered by a label pass" is not verified), 60 (live
    observation over story status; the branches are FINAL, so a gap is a real defect), 69 (the deferred
    marker and its lift path — the one permitted un-verified state) and 7/9/28 (the runnability
    requirement this rule enforces). Operator form: `build/skills/03-RUN-CHECK.md` §8
    ("No present feature left un-build-verified — seed and log in as needed") and §5.3 (seed, do not
    block; log in as whatever role is needed).
    **⇒ MULTI-LOGIN STANDARD PRACTICE — THE TECHNICIAN-ROLE-SWAP METHOD (added 2026-08-19, QA lead's
    EXPLICIT directive; Rule 72's "propose before recording" satisfied — he ordered it saved to the
    rules AND the skills).** USER DIRECTIVE (2026-08-19, verbatim, his typing preserved because Rule 25
    applies to his instructions as it does to a spec): *"Regarding multi log in, I would suggest instead
    of creating a new user assign a different role (as needed) to technician quick log-in and use it.
    before applying a role to the technician quick log-in make sure to reset that role to default and
    save the changes and then apply that role to technician. once you are done with All the testing,
    make sure you apply technician role again to the technician. this should be a standard practice for
    the test cases where multi login is needed. save this in your rules and skills."*
    **THIS IS THE PREFERRED, RECORDED STANDARD for any test case needing a DIFFERENT role / login** —
    permission cases, role-negatives, second-user behaviour. It satisfies §(2) above (log in as needed,
    never block) using the EXISTING Technician quick-login rather than new-user creation (which on
    staging needs invite-confirmation). **THE FIVE STEPS, IN ORDER:**
    **(1) DO NOT create a new user** — use the **Technician quick-login user** and swap its role.
    **(2) RESET the needed role to its TEMPLATE/DEFAULT and SAVE the change FIRST** (ties Rule 26 — this
    guarantees the role carries its spec-default permissions, not drift, before it is ever applied).
    **(3) ASSIGN that reset-to-template role to the Technician quick-login user.**
    **(4) RUN THE TEST as the Technician quick-login user** — observe live, with evidence (Rules 12/13).
    **(5) AFTER ALL TESTING IS COMPLETE, RESTORE the Technician ROLE back to the Technician user** —
    Tech must end on "Technician".
    **`switch-user` impersonation of an existing role-holder remains an acceptable SIMPLER FALLBACK, but
    the Technician-role-swap above (reset-to-template first, restore Tech after) is the PREFERRED
    standard.** On the shared staging org, **re-read the role LIVE before asserting and re-reset if a
    concurrent actor drifts it mid-run (Rule 26a).** Concrete ids + endpoints:
    `build/APP-ACTIONS-PLAYBOOK.md` §G ("STAGING ACTION RECIPE: multi-login via Technician role-swap").
    Ties to Standing Rules 26 (reset roles to template first, then observe), 26a (re-reset on mid-run
    drift, persistently) and 74 (log in as needed — never skip a case for a login).

75. **LONG-RUNNING WORK RUNS DETACHED AND SELF-COMMITTING; AN AGENT LAUNCHES IT AND EXITS — IT NEVER BABYSITS (all projects). The anti-context-thrash architecture.**
    USER DIRECTIVE (2026-08-20, verbatim): *"Find a solution and implement it for the High context issue, we will always have such context and we need to learn and make a rule and make it the part of our skills to ensure that similar thing never ever happens again while ensuring the quality and capability and correctness and authenticity of everything which we are doing in this session."*
    **THE FAILURE THIS ENDS:** *"Autocompact is thrashing — the context refilled to the limit within 3 turns of the previous compact, 3 times in a row."* Multiple agents died this way in two days. **The cause is PERMANENT:** this CLAUDE.md is large and is injected into every agent, leaving little context headroom, so any agent that **(a)** reads large files, **(b)** takes large tool outputs, or **(c) STAYS ALIVE POLLING a long job** accumulates context until compaction cannot keep up. **(c) is the deadliest and least obvious** — even tiny `tail`/`wc` polls accumulate over dozens of turns on a near-full baseline. Note: the detached WORK survives an agent's death; it is the babysitting AGENT that dies.
    **THE ARCHITECTURE — mandatory for any job over ~1–2 min or more than a handful of cases (reflows, VIU / build-verify passes, sweeps, multi-case pushes, audits):**
    **(1) THE WORK IS ONE DETACHED, IDEMPOTENT, RESUMABLE SCRIPT** — never per-item agent tool-calls. It does all file/API work, writes progress to a checkpoint file (DONE.jsonl) it reads on start to skip done items, plus its own log; launched `nohup … &` so it outlives the agent (proven here: detached scripts survive their spawning agent's death).
    **(2) CHECKPOINT + COMMIT ARE DONE BY DETACHED PROCESSES, NOT AN AGENT** — the script self-commits, or a **pure-shell committer loop (no LLM → cannot thrash)** does path-scoped `git add`/scan_secrets/`commit`/`push` every ~5 min, plus a final commit + a completion sentinel + a `grep -c` tally SUMMARY when the script exits. **The committer loops on a RUN-FLAG FILE the work script creates and deletes — the script does `touch /tmp/<job>.running` at start and `trap 'rm -f /tmp/<job>.running' EXIT`, and the committer runs `while [ -f /tmp/<job>.running ]; do …; done`. NEVER gate the committer on `pgrep -f <scriptname>` — the committer's own command line contains `<scriptname>`, so pgrep self-matches and the loop never ends (Rule 29 R5).**
    **(3) THE AGENT LAUNCHES AND EXITS** — it writes the script, launches it + the committer detached, confirms both alive with ONE `pgrep`, then ENDS ITS TURN. **NO poll loop.** Verification + the final tally happen LATER in a **FRESH, SHORT-LIVED agent that runs ONCE** (reads the sentinel + SUMMARY, or computes a `grep -c` tally), reports, exits.
    **PROHIBITIONS (each is a way an agent has died):** never keep an agent in a poll/watch loop; never `Read`/`cat` a large file into an agent (inspect only with `wc -l`/`head -n 5`/`grep -c`/`tail -n 20`, sparingly); never let a tool dump a large blob into the agent (redirect to a file, read a bounded slice); never hand an agent a huge inline blob to hold across turns.
    **QUALITY IS PRESERVED, NOT TRADED:** the heavy work moves into a script that performs Rule-50 byte-verify, Rule-41 whole-case re-reads, Rule-71 automation gates and Rule-54 provenance stamping deterministically and EXHAUSTIVELY, with no context ceiling; verification reads COMMITTED EVIDENCE + live content, never a self-report (Rules 29/50).
    **DEEPER CAUSE, FLAGGED NOT ACTED ON:** the ultimate lever is a smaller CLAUDE.md (move bulk into load-on-demand skills) — a QA-lead decision (Rule 72), never done unilaterally lest durable memory/authenticity be lost. Full operator form: `build/skills/00-COMMON-CORE.md` § "Session survival — the detached-process architecture." Ties to Standing Rules 17, 29, 50, 71, 72.

76. **QUOTA DISCIPLINE — MINIMIZE SUBAGENT SPAWNS; EVERY SPAWN PAYS THE FULL CONTEXT TAX (all projects).**
    USER DIRECTIVE (2026-08-20, verbatim): *"We need to get out of this trap of running out of the Hourly Weekly Quota despite being having a premium cloud seat, find a solution implement that first and make sure that it never happens again that we run out of our weekly quota..."*
    **THE ROOT COST:** the orchestrator (main session) has NO file/git/API tools — every file read, git op, or TestRail/Jira call requires spawning a subagent, and EACH subagent re-loads the large CLAUDE.md as its system context (observed **200–380k tokens per spawn**, mostly baseline tax + reasoning). **The NUMBER OF SPAWNS — not the size of the work — is what burns quota.**
    **POST-MORTEM (what burned the 2026-08-20 session):** (a) ~6+ pure status-check spawns (`wc -l`, `pgrep`, "is it done") at ~300k each ≈ **1.8M tokens** for information a committed status line would have shown free; (b) separate commit/push spawns to answer the stop-hook while a detached committer was already committing; (c) repeated autocompact-thrash deaths before Rule 75; (d) redundant overlapping workers doing the same job.
    **THE RULES:** **(1)** Treat every spawn as expensive — before spawning ask "can this be BATCHED into a worker I'm already spawning, or SELF-REPORTED by a detached process?"; if yes, don't spawn. **(2) NEVER SPAWN FOR A TRIVIAL CHECK** (`wc -l`, `pgrep`, "is it done", "is the tree clean") — the detached script/committer writes a human-readable progress line INTO EACH COMMIT MESSAGE (e.g. "schedule reflow 143/195") + a STATUS file, and the orchestrator reads progress from the commit messages the stop-hook surfaces; poll-by-spawn is BANNED. **(3)** ONE launch worker + at most ONE end-of-job verification worker per long job — no repeated mid-run checks. **(4) BATCH RUTHLESSLY** — one worker does ALL related steps (do → finalize → diagnose → fix → commit) and edits MANY cases in one scripted run; rule-recording, register and skill edits are batched into a single worker. **(5)** The detached committer handles ALL mid-run commits — do NOT spawn a commit worker to answer a stop-hook nag while it runs. **(6) ON MOST TURNS, RESPOND IN TEXT — DO NOT SPAWN;** the stop-hook fires every turn and a reflexive per-turn spawn is the trap. **(7)** Kill orphan/redundant processes before launching (Rule 75). **(8) DEEPER LEVER (QA-lead decision, Rule 72 — flagged, not done unilaterally):** the per-spawn tax scales with CLAUDE.md size; moving bulk into load-on-demand skills would cut every spawn's cost — propose first, never lose durable memory.
    Ties to Standing Rules 29 (commits by the detached committer, not poll-spawns), 49/60 (provisional verdicts self-tracked in files), 72 (slimming CLAUDE.md is his call), 75 (detached-process architecture — this is its cost-discipline sibling).

77. **VERIFICATION VALIDITY WINDOW — a check within the last 3 builds (or 3 source versions) still COUNTS, with the DATE shown (all projects).**
    USER DIRECTIVE (2026-08-20, verbatim): *"if any test cases have once been build verified and that happened not more than 3 builds ago, then consider them as build verified but do mention when (date) they were last verified and same goes for the source verification."*
    **THE RULE:** a test case **BUILD-VERIFIED within the last 3 builds counts as BUILD-VERIFIED** (not merely "provisional/stale"), PROVIDED the case states the **DATE and build marker** it was last verified against. Likewise a case **SOURCE-VERIFIED within the last 3 source versions counts as SOURCE-VERIFIED**, stating the **date and version** last checked. **Beyond 3 builds / 3 versions**, it reverts to needing re-verification.
    **THIS REFINES Rules 49/60:** a never-final, frequently-redeploying branch made "every verdict provisional forever" impractical; this gives a workable VALIDITY WINDOW. **It does NOT weaken honesty** — the date/build/version MUST be shown (Rule 54 sentence 2 carries build+date; the source version is in the provenance line + refs), so the claim is exactly *"build-verified, last checked build X on date Y"*, never a bare "verified".
    **MECHANICS:** the ≤3-builds test needs the CURRENT build marker vs the case's marker (count intervening deploys); the ≤3-versions test compares the case's cited spec version vs the live version. **Where the count cannot be established, treat as OUTSIDE the window (needs re-verify) — never assume inside (Rule 12).**
    Ties to Standing Rules 12, 31 (source currency), 49/60 (provisional → windowed), 54 (the date/build/version already lives on the case).

78. **PIGGYBACK CHEAP CHECKS ONTO THE NEXT SUBSTANTIVE WORKER — never spend a dedicated spawn on a cheap verification (all projects; EFFECTIVE FROM TUESDAY 2026-08-25).**
    USER DIRECTIVE (2026-08-20): liked and ruled permanent the idea of folding a cheap check into the next real work instead of a dedicated spawn; *"apply it from tuesday"*.
    **THE RULE:** when a cheap, non-urgent verification is needed — *"is the current build ≤3 builds from this case's marker?"* (Rule 77), *"did the spec version move?"*, *"is the tree clean?"* — do **NOT** spawn a dedicated worker for it. **Append it as an extra sub-task to the NEXT substantive worker you were already going to spawn**, so it costs no extra spawn. Keep a short **"pending cheap checks"** list and **drain it opportunistically into real work.** Only if a cheap check is genuinely BLOCKING and no substantive worker is imminent may it earn its own minimal spawn — and then **batch every pending cheap check into that one.** Operational corollary of Rule 76; the canonical example is Rule 77's ≤3-build / ≤3-version window check.
    Ties to Standing Rules 12, 29, 75, 76, 77.

79. **STRATEGY-FIRST — BEFORE STARTING ANY TASK, DEVISE (OR RECALL) THE SMARTEST QUOTA-EFFICIENT PLAN, AND ONLY THEN BEGIN (all projects, permanent).**
    USER DIRECTIVE (2026-08-20, verbatim): *"before starting with a new task you have to first make the smartest strategy about how to complete that task without extra burning the hourly weekly Quota, once done with that starategy or reminding yourself of an already built strategy only then start on a task. With the time keep on making this strategy better and more effecient."*
    **THE RULE:** the FIRST action of EVERY task is a brief **STRATEGY step** — either **(a) RECALL** an existing proven strategy for this task type (from build/skills/*, Rules 75–78, build/PROCESS-CATALOG.md) or **(b) DEVISE** the most quota-efficient plan: fewest spawns, batched work, one detached self-reporting script, piggybacked cheap checks (Rule 78), no poll-by-spawn, answer-in-text where possible (Rule 76). **Execution begins ONLY after the strategy is set.** **CONTINUOUSLY IMPROVE IT** — when a task reveals a cheaper method, refine the strategy in the skills (rule-level changes via Rule 72). This is the UMBRELLA over Rules 75 (detached architecture), 76 (minimize spawns), 77 (validity window) and 78 (piggyback cheap checks); those are its current toolbox and are expected to grow.
    Ties to Standing Rules 29, 72, 75, 76, 77, 78.

80. **TELL THE LAST-DONE DATE AND ASK BEFORE RE-RUNNING any verification / VIU / ordered task (all projects, permanent).**
    USER DIRECTIVE (2026-08-20, verbatim): *"when you do the build verification or if I ask you to do that and same for the source verification or for VIU or for anything when I order you to do, you must first tell me the date when the same was last done and ask me if I still want to run it again."*
    **THE RULE:** before starting **build verification, source verification, a VIU pass, or ANY task the QA lead orders** that may already have been done recently, the FIRST response STATES **when it was last done** (date + build marker and/or spec version, sourced from the committed records) and **ASKS whether he still wants it re-run.** **Never auto-run** a verification/VIU that was recently done without confirming. Where the last-done date cannot be found, say so and ask. Only proceed once he confirms. Pairs with Rule 77 (a check within 3 builds/3 versions still COUNTS, so a re-run may be unnecessary) and Rule 79 (strategy-first).
    Ties to Standing Rules 12, 31, 49, 54, 77, 79, 81.

81. **SOURCE VERIFICATION PRECEDES BUILD VERIFICATION / VIU — make the source current FIRST (all projects, permanent).**
    USER DIRECTIVE (2026-08-20, verbatim): *"when you are asked to do the build verification the logic says that before that build verification you do the source verification so that you first have the source current with you for each project and then you start build verification or viu on that."*
    **THE RULE:** whenever **build verification (or a VIU pass) is ordered**, FIRST run the **source verification / currency check** (Rule 31 pre-flight: spec version, epic + child stories, designs, tech plan, PO answers), **fold in any deltas** (Rule 43), and **ONLY THEN** begin build verification / VIU against the now-current source. **A build-verification run against a STALE source is INVALID** — expected behaviour comes from the source (Rule 57), so the source must be current before the build is observed. Source-verification is therefore a **mandatory precursor step of every build-verification / VIU order**, not an optional extra.
    Ties to Standing Rules 10, 31, 43, 57, 80.
    **⇒ DATED REFINEMENT, 2026-08-20 (QA lead, verbatim: *"Istead of automatically starting to do source verifiction ask me that I am asking you to do something for which we need to ensure that the test cases are newly source verified and then tell me the date when they were last source verified and wait for my answer wether I want to proceed with source verification or without source verification."*) — SOURCE VERIFICATION IS OFFERED AND GATED BY THE QA LEAD, NOT AUTO-RUN.**
    When build-verify / VIU / any source-dependent task is ordered, do **NOT** automatically start source verification. Instead: **(1)** tell the QA lead that the ordered task needs source-current test cases; **(2)** state the **DATE (+ spec version)** source verification was last done for that project, from the records; **(3) ASK** whether to proceed **WITH** source verification first or **WITHOUT** it; **(4) WAIT** for his answer, then proceed accordingly. The original Rule 81 requirement remains the DEFAULT LOGIC (source should be current before build-verify), but **WHETHER to run it now is HIS decision**, informed by the last-done date and Rule 77's validity window. This aligns Rule 81 with Rule 80 (tell last-done + ask before re-running).

82. **THE SECRET-SCAN GATE MUST BE REAL AND EXECUTABLE — never claim a scan that did not run (all projects, permanent).**
    **THE RULE:** a **pre-commit secret scan is MANDATORY** on this repository, because **the repository is PUBLIC**. The tool is **`build/testing-tools/scan_secrets.py`**, enforced by **`build/testing-tools/pre-commit`** (install once per clone: `cp build/testing-tools/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`). Run it **`--staged`** before every commit; the hook **BLOCKS the commit on exit 1**.
    **IF A SCAN TOOL IS MISSING, THAT IS A FINDING TO REPORT AND FIX — NEVER A STEP TO SILENTLY SKIP, AND NEVER A STEP TO FAKE WITH AN AD-HOC GREP.** An improvised `grep` for a couple of cookie names is **not** the gate: it has no allowlist, so it either floods or (far worse) it passes, and it gets **reported in the same words as the real scan**. The hook therefore **fails the commit when the scanner is absent** rather than passing quietly — **a guardrail that silently no-ops is WORSE than no guardrail at all, because it is reported as having run.**
    **THE PROOF OBLIGATION:** a pass that says *"secret scan clean"* must have **actually invoked the tool** and be able to name the mode and the population (e.g. *"clean — 13,502 tracked files"*). **`--selftest` exists so that a clean result means something** — it proves detection fires on planted material and that clean text still passes. **A tool nobody has ever seen fail is indistinguishable from a tool that cannot fail.**
    **RATIONALE (2026-08-20 — and the embarrassment is entirely ours):** CLAUDE.md instructed every pass to run `build/testing-tools/scan_secrets.py`, and **THE FILE DID NOT EXIST for weeks.** Workers reached the instruction, found no tool, fell back to manual greps, and **reported "scan clean"** — so a **mandatory guardrail on a PUBLIC repository was imaginary**, and every report asserting it had run was, without anyone intending it, false. **Nothing leaked, and that is luck rather than process.** The related precedent shows the stakes: on **2026-08-11 twelve Mercure JWT bearer tokens were found in thirteen tracked files, committed since 4 August**, and every scan before that date had "passed" because `eyJ` was not among the patterns. **A credential that reaches a commit on a public repo is disclosed the moment it is pushed, and rewriting history does NOT un-disclose it — the value must be rotated.**
    Ties to Standing Rules 6, 12, 29, 50.

83. **LANE OWNERSHIP AND WRITE LOCKS — four sessions, one TestRail, one branch, one login (all projects, permanent).**
    **THE RULE:** per **`build/LOCKS/README.md`** — **CLAIM before you write** (one claim file per project, `build/LOCKS/<project-slug>.lock.md`, naming the lane, the exact intent, an ISO start time and an expected release), **CHECK for a foreign claim first** (`git pull` first — a claim you have not fetched is a claim you cannot see), **RELEASE when done**, and **report stale claims rather than overwriting them** (older than 6 h may be cleared, with who cleared it and on what basis recorded).
    **THE THREE COLLISION MODES, NAMED — and the first two are SILENT:** **(1) CONCURRENT `update_case` ON ONE CASE IS LAST-WRITE-WINS AND SILENT** — TestRail records only the **last** writer, so the earlier edit is gone with **no trace it ever existed**; **(2) TWO BROWSER SESSIONS ON THE SHARED LOGIN EVICT EACH OTHER** — `quick-login` and `switch-user` **rotate the shared session**, so the victim sees `401 sso_required` and reasonably concludes the estate expired when it has actually been evicted by a colleague; **(3) CONCURRENT PUSHES RACE** — the mild one, because git genuinely rejects, handled by `git fetch origin && git rebase origin/<branch> && git push`.
    **THE BROWSER/STAGING LOGIN IS A SEPARATE GLOBAL LOCK** — `build/LOCKS/browser.lock.md`. **Only ONE session drives the browser or calls `quick-login` / `switch-user` at a time, regardless of project**, because the session is shared estate-wide rather than per-project.
    **CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION, WHICH ASSIGNS THEM. A LANE NEVER FIXES ANOTHER LANE'S ARTEFACT UNILATERALLY** — doing so produces exactly the untraceable edit this rule exists to prevent, and Rule 38's logic (another author's work is hands-off) applies with equal force to a colleague's work as to a foreign author's.
    **A LOCK IS NOT AUTHORISATION.** Holding it does not permit a write: **Rule 6** still governs TestRail and **Rule 62** governs every Jira ticket, and while the creation hold is active nothing is created at all.
    **RATIONALE:** four sessions now work this workspace in parallel against **one** TestRail project, **one** git branch and **one** staging login, and the damage from modes (1) and (2) is **invisible at the time** — no error, no rejection, nothing to notice. The precedent is already on the record: when **Ahtasham Amjad edited our own C29557** we could **never establish what he changed**, because TestRail keeps only the last writer and our own later passes overwrote the trail. **🔴 CORRECTED 2026-08-28 (see Rule 87): the "could never establish" half of this precedent is WITHDRAWN — `get_history_for_case/29557` recovered the edit field by field with old and new values. The lock discipline above still stands on its own merits (concurrent writes still silently overwrite each other); only the "unrecoverable" justification is retired.**
    Ties to Standing Rules 6, 29, 38, 50, 75, 76.

84. **THE TESTER-READINESS GATE — nothing reaches a manual tester until it passes (all projects, permanent).**
    **THE RULE:** before **ANY** case set is handed to manual testers, it passes the gate in **`build/TESTER-READINESS-CHECKLIST.md`** — line breaks that genuinely render as separate lines (**`<br>`**, never a bare `\n` in an HTML-rendered field); **no raw `<ol>` / `<li>` / `<p>` markup visible to the tester**; **exactly one** automation marker, **last** in Expected Results with a blank line before it; a **Rule-54 provenance line present exactly once**, sentence 1 naming **documents only**; title **≤ 80 characters**; the **C-id in every deliverable** that names the case (Rule 8); **no jargon or §-anchors** in tester-facing text bar the authorised requirement reference and source link; **preconditions reachable and steps executable in order** (Rule 28 dimension 2); and **every non-passed row carrying a plain "what needs to be done"**.
    **SCORED OVER 100% OF THE SET — NO SAMPLING (Rule 50) — AND THE HANDOVER REPORT STATES THE COUNTS PASSED / FAILED**, per check, out of the exact population.
    **THE MECHANICAL SUBSET IS AUTOMATED, THE REST IS NOT, AND THE DIFFERENCE MUST BE STATED:** `build/testing-tools/check_tester_readiness.py` (read-only, credentials from `/tmp`) covers the markup / marker / provenance / title / jargon / no-build checks. **The C-id-in-deliverables check and the two cold-read checks are HUMAN**, so a clean script run is reported as **"the mechanical subset passed"** and **NEVER** as *"the readiness gate passed"* — claiming the second from the first is the overstated-verification failure mode this workspace has already been bitten by.
    **A FAILED CHECK IS A FINDING, NOT A BLOCKER TO HIDE** — reported with the C-ids; repairing cases is a TestRail write needing the QA lead's go-ahead (Rule 6). **The gate certifies RUNNABLE AND READABLE, not CORRECT** — a case can pass all ten checks and still assert the wrong thing (Rules 43/45/57).
    **RATIONALE (2026-08-20):** cases had been sitting with **bare `\n` line breaks that TestRail collapsed into one run-on paragraph** — numbered steps a tester was meant to follow in order arrived as a wall of text — **and we did not find it; a tester waited two days.** Separately, **~14 Filters cases still show raw `<ol>` / `<li>` to the tester, and 11 of the 15 were last written by our own pass**, so it is ours rather than drift. **Both defects are INVISIBLE in the payload we send and visible only in what the tester actually sees** — which is precisely why the gate exists: it turns *"I think they're fine"* into a **measured pass/fail against the rendered case**.
    Ties to Standing Rules 7, 8, 9, 28, 50.

85. **A PROJECT WITH NO QA BUILD IS REPORTED AS "SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET" (all projects, permanent).**
    **THE RULE:** where **no QA build exists** for a project, every status line, report, readiness figure and handover states — **in those words** — **"SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET"**. Its cases carry **Rule-54 state 1** (sentence 1 only, **no build sentence at all**) and the **Rule-69 marker form**, and they may **NEVER** be described as **build-verified**, **VIU'd**, or simply **"verified"**.
    **WHY THE EXACT WORDS MATTER:** *"verified"* with no qualifier is heard as *"someone ran it against the product"*. **The honest sentence carries its own limitation**, so it cannot be quoted out of context into a status deck — which is exactly how a hedge gets lost.
    **WHAT IT DOES NOT MEAN:** source-verified-only is **not a lesser grade of work** and must not be reported apologetically. Cases traced to a current spec, epic and PO answers are **exactly as authentic as Rule 20 requires**; what is absent is the **build**, which is absent because **the product does not exist yet** — not because we skipped a step. **State the limitation; do not apologise for it.**
    **RATIONALE:** **five new projects begin development on 2026-08-24**, so every case authored for them will be **source-only for weeks**. The bite risk is concrete and predictable: **a leader asks "are these verified?" and receives a confident yes** — and nobody in that conversation has any way to know the answer meant "against documents, against a product that has not been built". This is the same class of harm as the barred *"as per the build tested on"* provenance (Rule 54), read from the opposite direction.
    Ties to Standing Rules 12, 49, 54, 60, 69, 77, 80.

86. **CROSS-SESSION TRUST — VERIFY FROM COMMITTED EVIDENCE, NEVER FROM A SESSION'S SELF-REPORT; AND BUDGET THE SHARED QUOTA (all projects, permanent).**
    **THE RULE, FIRST HALF:** **a lane session's summary is a CLAIM, not a verification.** The main session **confirms from the COMMITTED EVIDENCE FILES and the LIVE CONTENT** (Rules 12/50) before repeating any lane's figure onward — counts re-derived, writes byte-verified, "untouched" proven byte-identical. **Therefore LANES MUST COMMIT THEIR EVIDENCE, NOT MERELY REPORT IT:** an execution log, the per-op results, the snapshots. **A number that exists only in a chat summary is unverifiable the moment that session ends** — and every session here ends.
    **THIS IS NOT DISTRUST OF THE LANES; IT IS THE SAME STANDARD WE APPLY TO OURSELVES.** Rule 50 already forbids accepting our *own* write as successful on a `200 OK`; a colleague's prose summary is weaker evidence than that, not stronger. And the failure is asymmetric: **an over-stated lane figure repeated by the main session becomes the workspace's official position**, at which point nobody can tell it from a measurement.
    **THE RULE, SECOND HALF — BUDGET THE SHARED QUOTA:** **all sessions share ONE weekly quota.** The **main session allocates a rough per-lane budget**, and **each lane reports its spend with its work**. **A lane that finds itself burning budget on STATUS CHECKS rather than substantive work STOPS AND REPORTS** (Rule 76) — polling is the most expensive way to learn nothing, and a lane is the worst-placed party to judge whether its own polling is still worth it.
    **RATIONALE:** the workspace has already spent a full weekly budget to exhaustion, and the cold-resume machinery (`build/RESUME-*.md`) exists because of it. With four parallel lanes the two risks compound: **quota is consumed four times as fast**, and **claims cross session boundaries where they can no longer be checked**. The committed-evidence discipline is what makes a lane's work survivable at all — it is the same reason Rule 29 insists git is the only durable store, applied to *trust* rather than to *files*.
    Ties to Standing Rules 12, 29, 50, 75, 76, 79.

87. **SNAPSHOT CASE BODIES SO A FOREIGN EDIT IS ALWAYS DIFFABLE (all projects, permanent).**
    **THE RULE:** **periodically — and BEFORE AND AFTER any authorised bulk write — snapshot the FULL case bodies of each project to git**, so that an edit made by anyone outside this workspace can be **diffed** rather than argued about. The snapshot holds every field a write could touch (title, preconditions, steps, expected, refs, section, type) for **100% of the project's cases** (Rule 50 — no sampling), committed, because **git is the only durable store** (Rule 29).
    **🔴 CORRECTED 2026-08-28 — CHECK `get_history_for_case` FIRST; IT IS THE AUTHORITATIVE RECORD.** **`GET index.php?/api/v2/get_history_for_case/<case_id>` RETURNS THE FULL PER-FIELD CHANGE LOG** — one entry per save, each carrying `created_on`, `user_id`, and a `changes[]` array with **`field`, `old_value` AND `new_value`, INCLUDING COMPLETE TEXT BODIES** (title, refs, `custom_preconds`, `custom_steps`, `custom_expected`, the custom fields). **So a foreign edit IS reconstructable, field by field, with both sides of the change, EVEN AFTER our own later passes have overwritten the case.** **NOTHING MAY BE DECLARED UNRECONSTRUCTABLE UNTIL THAT CALL HAS BEEN MADE AND ITS RESULT RECORDED** (Rule 12 — never infer an absence you did not test for).
    **THE SNAPSHOT KEEPS ITS PLACE, IN A SMALLER ROLE:** committed body snapshots remain worth taking as a **fast local `git diff`** and as an **offline baseline** that needs no API call and survives loss of TestRail access — but they are the **SECONDARY** tool. **HISTORY IS PRIMARY AND IS CHECKED FIRST.**
    **EVIDENCE (2026-08-28).** [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) — the very case this rule was written about — returned **17 history entries**, and the foreign edit was recovered in full: see the Rationale below. Separately, **C27792 and C27805 each returned exactly ONE entry, `custom_atmstatus` `1 → 4 Pending`, with NO text-field change**, which **disproved the standing claim that an undiffable body edit had occurred on them**. **Also recorded: `custom_atmstatus` `4` = `Pending`, which is DISTINCT from `3` = `Automated` — so a `1 → 4` change does NOT make a case Automated and does NOT trigger Rules 65 / 71.**
    **SUPERSEDED 2026-08-28 — the original premise, kept visible and dated per Rules 32/33, NOT deleted; it is FALSE and must not be quoted or relied on:** *"**WHY A SNAPSHOT IS THE ONLY THING THAT WORKS:** **TestRail stores only the LAST writer** in `updated_by` / `updated_on`. There is **no per-field history** and **no way to reconstruct what a previous editor changed** — so the moment one of our own later passes writes the case, the trail of the foreign edit is **permanently gone**. **A committed snapshot converts an unanswerable question into a `git diff`.**"* — **the first two sentences describe `updated_by` / `updated_on` correctly and then generalise from them to the whole product, which was never tested. `get_history_for_case` was simply never called.**
    **WHAT IT BUYS, CONCRETELY:** it turns **Rule 38 / 39 disputes into EVIDENCE. Rule 39 requires that a contradiction be escalated with BOTH sides' sources on the table** — which is impossible to do about an edit we cannot characterise. With a snapshot the conversation starts from *"here is exactly what changed, and when"* instead of *"we think something changed"*. **It also protects the other party**: a diff is as capable of showing that a suspected foreign edit never happened, or that ours was the pass at fault.
    **IT IS A READ, SO IT NEEDS NO AUTHORISATION.** Snapshotting is `get_cases` only — no write, no run touch — so it is safe to run at any time and is **not** gated by Rule 6 or by the Rule-62 creation hold.
    **RATIONALE:** when **Ahtasham Amjad said in a Jira comment that he had edited our own [C29557](https://shopview.testrail.io/index.php?/cases/view/29557)** — the case at the centre of the entire expected-behaviour correction, the one whose waiver note started the Rule-57 audit — **we could not establish what he had altered.** No before/after snapshot existed, and `updated_by` / `updated_on` recorded only the **last** writer, which **our own later passes had since overwritten**. The honest position we were forced into was that the case *"has been edited by someone else at least once and the change is not reconstructable from what we hold"*.
    **🔴 THAT RATIONALE WAS RESOLVED ON 2026-08-28, AND ITS CLOSING CLAIM — *"a position no amount of later diligence can recover from"* — IS WITHDRAWN.** `get_history_for_case/29557` recovered the edit outright. **Ahtasham Amjad (TestRail user id 7) saved the case once, on 2026-08-05 13:32 UTC**, touching **three fields**: `custom_preconds`, `custom_steps` and `custom_expected`. He had opened the case in TestRail's rich-text editor, so each field came back **wrapped in `<p>…</p>` with the line breaks flattened** — and on **Expected Result the save was LOSSY, 687 → 423 characters**: the **entire "Known and accepted" tester note was deleted** and the **automation marker was TRUNCATED to `AUTOMATION: READY -`**, losing `EXPECT FAIL (SV-8843 …)`. **Our own pass restored and rewrote the field the same day at 14:18 UTC**, and the case has since been superseded by the 2026-08-17 rewrite (now `SV-9268`, `AUTOMATION: READY`, `custom_atmstatus` 1), **so no live damage remains.** Full history: `build/custom-roles/foreign-edit-C29557/HISTORY.json`.
    **THE LESSON THE RULE NOW CARRIES:** the snapshot discipline is still right, but the reason it was adopted was **an untested assumption about the tool**, and a whole rule was built on it. **Before recording "X is impossible" as a standing premise, TRY X** (Rule 12).
    Ties to Standing Rules 12, 29, 32, 33, 38, 39, 41, 50.

88. **LANE-SESSION CONTEXT DISCIPLINE — a session WITH direct tools must never bulk-read; script it
    instead (all projects, permanent).**
    USER DIRECTIVE (2026-08-20, verbatim): *"every session should also always ensure that we never
    face the same thrash/context issue or burn our quota fast like we did by mistake in this session
    ... make our new 3 dedicated session smartest ever"*.
    **🔴 THE KEY DISTINCTION, STATED FIRST, BECAUSE COPYING THE ORCHESTRATOR'S RULES INTO A LANE
    SESSION WOULD BE EXACTLY WRONG.** The **MAIN / ORCHESTRATOR session has NO file tools**, so it
    must **spawn** to do anything — and **every spawn re-loads `CLAUDE.md`, observed at 200–380k
    tokens per spawn**. Its discipline is therefore **"MINIMISE SPAWNS"** (Rule 76). A **LANE SESSION
    HAS DIRECT TOOLS**, so its **cheap path is doing the work IN-CONTEXT**, and it should **barely
    spawn at all**. **Its danger is the OPPOSITE ONE: pulling bulk into its own context and
    thrashing** — the failure that **killed three workers on 2026-08-20**, recorded verbatim:
    *"Autocompact is thrashing — the context refilled to the limit within 3 turns of the previous
    compact, 3 times in a row"*. **A lane session that obeys Rule 76 as though it were the
    orchestrator will spawn needlessly and burn the quota it was created to protect.**
    **THE LANE RULES — SEVEN, AND ALL SEVEN APPLY FROM THE FIRST TURN:**
    **(1) NEVER READ `CLAUDE.md` END-TO-END — `grep -n` IT FOR THE RULE YOU NEED.** It is **tens of
    thousands of tokens** and it **auto-loads already**. **AND THE CORROLLARY THAT COST US TODAY:
    the auto-load TRUNCATES, so a rule missing from what you were given is NOT missing from the
    file** — **absence in context is never absence on disk**; confirm with
    `grep -cE '^NN\. \*\*' CLAUDE.md` before concluding anything is absent (Rule 12 — never infer).
    **(2) NEVER PULL BULK DATA INTO CONTEXT** — hundreds of case bodies, an id-map CSV, a large API
    response. **Have a SCRIPT fetch it to a FILE, then read a BOUNDED SUMMARY.** Inspect with
    `wc -l` / `head -n 20` / `grep -c` only. **A file you wrote is not free to read back** (Rule 78).
    **(3) BATCH WRITES IN A SCRIPT, NOT ONE TOOL CALL PER CASE** — and **the script performs the
    Rule-50 byte-verify itself and writes a per-operation log**, so the evidence lives in a file
    rather than in a transcript nobody can re-read.
    **(4) LONG JOBS USE THE RULE-75 PATTERN** — **one detached, idempotent, resumable script** plus a
    **pure-shell committer gated on a RUN-FLAG FILE** — **never `pgrep -f <scriptname>`, which
    SELF-MATCHES** and reports the job alive forever — with **progress SELF-REPORTED IN COMMIT
    MESSAGES so nobody has to poll it.**
    **(5) DO NOT SPAWN SUBAGENTS FOR WORK YOU CAN DO DIRECTLY.** This is **the INVERSE of Rule 76 for
    a lane session, and it matters**: every spawn re-pays the whole `CLAUDE.md` load for work the lane
    could have done in a few tool calls.
    **(6) BUDGET TRIPWIRE.** Each lane gets an **explicit token budget from the QA lead** and
    **reports its spend with its work** (Rule 86). **At ~50% of budget it compares SPEND against WORK
    COMPLETED, and if spend is outpacing progress it STOPS AND REPORTS** rather than grinding to zero.
    **Discovering at 100% that a job was not affordable is the same as not doing it** — except the
    quota is gone.
    **(7) OPENING RITUAL.** Read **only your own lane skill + `build/skills/00-COMMON-CORE.md`**, then
    **`grep` for specifics**. **Never bulk-read to "get oriented"** — orientation by reading is how a
    lane spends a third of its budget before its first useful action.
    **RATIONALE, 2026-08-20:** the session that produced this rule **thrashed autocompact three times
    in a row** and burned quota that three dedicated lane sessions were then created to conserve. The
    cause was **not** a hard job; it was **bulk reading and needless spawning by a session that had
    direct tools all along**. **The remedy is cheap and mechanical** — grep instead of read, script
    instead of loop, file instead of context — which is why it is written as seven flat rules rather
    than a judgement call.
    Ties to Standing Rules 12 (observed, never inferred — including never inferring that a rule is
    absent because the auto-load omitted it), 29 (no work loss — the script and its log are committed,
    the transcript is not durable), 50 (exhaustive and exact — the byte-verify moves into the script,
    it is not skipped), 75 (the detached long-job pattern), 76 (**the orchestrator's minimise-spawns
    discipline, which this rule deliberately INVERTS for a lane**), 78 (context is a budget), 79 (one
    pass, then exit) and 86 (report the spend).
89. **ACCESS RESILIENCE AND MCP HYGIENE — every session keeps a working path to every source, and
    never corrupts a connector (all projects, permanent).**
    USER DIRECTIVE (2026-08-21, verbatim): *"all the sessions will have to run unattended, and they
    would need access to Jira/testrail/Shopview QA and Staging and Production environment and other
    sources like Figma etc, it happene din this session that the MCP connection were broken and we
    could not again reconnect and we had to use the workarounds, make sure that the other sessions
    remains capable of using workarounds to connect to Jira/figma/Testrail and Shopview environments
    etc but at the same time the MC connector method never goes corrupt in those sessions for any
    connection."*
    **THE RULE HAS TWO HALVES AND THEY ARE EQUALLY BINDING: (1) NEVER BE BLOCKED — every system has a
    PRIMARY path AND a FALLBACK ladder, and a session drops down the ladder rather than downing tools;
    (2) NEVER CORRUPT THE CONNECTOR — no session may edit, delete or "repair" shared MCP configuration
    to fix a connection.** The second half is the one that outlives your session: a broken connection
    is recoverable in minutes, **a mutated config stays corrupt for every future session.**
    **THE OPERATOR FORM IS `build/skills/14-ACCESS-RESILIENCE.md`** — the per-system ladders, the
    preflight commands, the failure signatures and the traps live there and are NOT duplicated here.
    Read that file before the first access call of any session.
    **(a) THE SESSION-START PREFLIGHT IS MANDATORY.** Run the one-call preflight for **every** system
    the session will need, **at session start**, and **RECORD the results** (system · path used ·
    verdict · UTC timestamp) in the session's findings file. It is cheap, and it converts a mid-run
    surprise into a known starting condition. **TestRail** `get_case` → 200 · **Jira/Confluence** a
    known key/page → 200 · **ShopView** `index.html` → 200 **plus the `<meta name="app-version">`,
    `last-modified` and `etag`** (which is also the Rule-49 build marker, so this preflight is never
    wasted) · **Figma** one `nodes` call → 200 · the **Slack/Gmail/Drive/Calendar/Fireflies**
    connectors, one list/search — **and their ABSENCE is expected, not a fault.**
    **(b) THE PRIMARY / FALLBACK LADDERS, in one line each (detail in skill 14).** **TestRail** —
    PRIMARY the REST API v2 with Basic auth from `/tmp` (**no MCP is involved, which is why it is the
    sturdiest access we own**), FALLBACK the web UI driven by Playwright for what the API cannot do.
    **Jira/Confluence** — PRIMARY the Atlassian MCP tools, FALLBACK the live browser login of
    `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` (**the MFA race is the crux: each password submit
    invalidates the previous OTP, so hold ONE detached session parked at the prompt and NEVER start a
    fresh run to retry**); ShopView/Cloudflare cookies do **not** authenticate `atlassian.net`.
    **ShopView QA/staging/production** — PRIMARY `/tmp` cookies plus `POST /api/quick-login`, FALLBACK
    the API and the UI substituting for each other in either direction, with production's own gotchas
    in `build/APP-ACTIONS-PLAYBOOK.md` §K; Playwright needs a **FRESH MITM bridge per run** (the port
    rotates — read `$HTTPS_PROXY` live) and the **`boot2` hydration pattern**. **Figma** — PRIMARY the
    Figma MCP tools, FALLBACK REST `/v1/files/.../nodes` and `/v1/images` with the token from
    `/tmp/figma-token`, and a **429 opens the Rule-35 queue with DUE-AT = error time + 9 h, repeated
    until 100 % of the frames are down.**
    **(c) THE FAILURE SIGNATURE THAT IS MOST OFTEN MISREAD: ShopView `HTTP 401 sso_required` means
    EITHER the cookies died (~24 h) OR A DEPLOY HAPPENED — check the build marker BEFORE concluding
    expiry.** The whole `.qa.shopview.com` estate dies together, so one project's cookie failing
    against another project's API is ordinary expiry, not that project's problem.
    **(d) THE FIVE MCP-HYGIENE HARD RULES.** **(1) NEVER EDIT, DELETE OR "REPAIR" SHARED MCP
    CONFIGURATION TO FIX A CONNECTION** — not a server definition, not `settings.json`, not an env var a
    connector reads; if a config genuinely looks wrong, **report it with the evidence and let the QA
    lead decide** (Rules 6/72 — propose, never self-authorise). **(2) IF AN MCP TOOL IS MISSING OR
    ERRORING, RE-DISCOVER IT WITH `ToolSearch` FIRST** — deferred tools are name-only until their schema
    is fetched, so *"not in my list"* usually means *"not yet loaded"* — **and only THEN fall back.**
    **(3) DO NOT RETRY-LOOP** — repeated identical calls burn quota for nothing and can trip a rate
    limit that then blocks the fallback too. **(4) NEVER DISABLE TLS VERIFICATION AND NEVER UNSET
    `HTTPS_PROXY`** — on a TLS failure or a 403/405/407 from the proxy, read `/root/.ccr/README.md` and
    run `curl -sS "$HTTPS_PROXY/__agentproxy/status"`; weakening transport security to make a call
    succeed is never an acceptable workaround. **(5) AN INTERACTIVELY-AUTHENTICATED MCP SERVER MAY
    SIMPLY BE ABSENT IN A HEADLESS/UNATTENDED RUN — THAT IS EXPECTED, NOT BREAKAGE:** do not attempt to
    re-authenticate it or script an OAuth flow; the fallback path is the answer. **AND RECORD EVERY
    CONNECTOR FAILURE PLUS THE WORKAROUND USED** in the session's findings file — the books are the only
    channel between sessions (Rule 27), so an unrecorded failure is one the next session re-hits.
    **(e) THE UNATTENDED PROTOCOL — degrade honestly, never stall and never invent.** If a credential is
    missing or expires mid-run, write **`BLOCKED-<system>.md`** naming exactly what is needed, what it
    blocks with the named cases (internal ID + C-id + link, Rule 8), what is **not** blocked, and the
    steps to resume; **COMMIT it** (Rule 29); **then continue with the work that does not need that
    system** — a blocker blocks only what it actually blocks (Rule 68); and report it under
    **"OUTSTANDING — what I need from you"** (Rule 36). **NEVER fabricate a result, never infer an
    observation, never mark verified what was not observed** (Rule 12): the honest sentence is *"N of M
    observed on build `<marker>`; the remaining M−N carry their last recorded check"*, never *"the suite
    is current"* (Rule 60). **Secrets stay in `/tmp` at `chmod 600` and are NEVER committed — not in a
    log, not in an error paste, not in a `BLOCKED-*.md`**: name the credential you need, never quote its
    value, and run the real scanner before every commit (Rule 82).
    **RATIONALE, 2026-08-21:** in a live session the **MCP connections broke and could not be
    reconnected**, and the work finished only because documented workarounds existed. Two lessons came
    out of it. First, **an unattended session cannot ask for help**, so the ladder has to be written
    down in advance — which is why the preflight is mandatory rather than advisory. Second, and the
    reason for the hygiene half: the instinct when a connector fails is to *fix the config*, and that is
    precisely the move that turns a one-session outage into a permanent one for every session that
    follows. Ties to Standing Rules 6 (nothing written to a system of record without permission), 12
    (observed, never inferred), 22 (ask for the live-build check and its access UP FRONT), 27 (reuse the
    recorded recipe; record a new one immediately — the books are the shared brain), 29 (no work loss —
    the `BLOCKED-*.md` is committed), 35 (the Figma retry queue), 36 (an access gap is an OUTSTANDING
    item), 49 (the build marker comes free with the ShopView preflight), 50 (exhaustive and exact), 68
    (prove the blocker; it blocks only what it blocks), 72 (propose a change, never self-authorise it),
    76 (do not spend spawns or quota retry-looping), 82 (the real secret-scan gate), 83 (lane write
    locks — never steal a shared login) and 88 (script the bulk work rather than reading it).
90. **SHARED-QUOTA BUDGET ALLOCATION ACROSS SESSIONS (all projects).**
    **THE WEEKLY QUOTA IS ONE POOL, SHARED BY THE MAIN SESSION AND EVERY LANE.** There is no per-session
    allowance that a lane can spend freely: every token a lane burns is a token the orchestrator and the
    other lanes no longer have. A lane that treats its own budget as private is spending someone else's.
    **THE DEFAULT ALLOCATION — adjustable by the QA lead at any time:** **main / orchestrator 15 %** ·
    **each lane session 25 %** · **10 % reserve.** The main session's share is deliberately the smallest
    because its job is to plan, delegate and synthesise (Rule 76 — minimise spawns; Rule 79 —
    strategy-first), not to do the bulk work itself.
    **EVERY LANE REPORTS ITS SPEND WITH ITS WORK** (Rule 86) — the report states what was consumed
    against what was produced, so the orchestrator can re-allocate on evidence instead of impression.
    **THE TRIPWIRE, AT 50 % OF A LANE'S OWN BUDGET (Rule 88's discipline made numeric):** the lane
    **compares spend against work completed**, and **if spend is outpacing progress it STOPS AND
    REPORTS** rather than pressing on. Stopping at half-spend with an honest position is recoverable;
    discovering at 100 % that the budget bought a third of the job is not.
    **THE MAIN SESSION MAY RE-ALLOCATE** between lanes as work demands — that is the point of holding
    the pool centrally.
    **THE RESERVE IS NOT AVAILABLE TO A LANE ON ITS OWN INITIATIVE: a lane must NEVER consume the 10 %
    reserve without the QA lead's say-so.** The reserve exists for recovery — finishing an interrupted
    write sequence, a genuine emergency, a re-check that cannot wait — and a reserve quietly absorbed
    into ordinary work is not a reserve at all.
    **HONESTY CLAUSE:** a percentage is a budget, not a target. Under-spending a lane's share while
    delivering the job is a **good** outcome, and a lane that finishes early says so rather than finding
    more work to fill the allowance. Equally, a lane must not smuggle an over-spend past the tripwire by
    redefining what "progress" meant at the start — the comparison is against the work the lane was
    briefed to do.
    Ties to Standing Rules 29 (no work loss — a stop at the tripwire is a checkpoint, not an
    abandonment), 75 (the detached long-job pattern is what makes a lane's spend predictable), 76 (every
    spawn pays the full context tax), 78 (context is a budget, and this rule makes the budget explicit),
    79 (devise the quota-efficient plan BEFORE starting), 86 (report the spend; verify from committed
    evidence, never from a session's self-report) and 88 (a lane scripts its bulk work precisely so its
    share buys work rather than reading).

91. **THE VERIFICATION FRESHNESS BADGE — every build/source verification claim is shown with a COLOUR
    and its DATE (all projects, permanent).**
    USER DIRECTIVE (2026-08-21, verbatim): *"The branches are continuously being updated as the adhoc
    desiions are being made they it looks like they will never be final until the release day- So when
    we say that our test cases are Build verified asay that with a sheck mark green and date to tell if
    they were recently build verified and orange if they were build verified but the dat eis like a week
    old and red if the build verified was more than 2 weeks old tell the date with that and a X croxx if
    the build verification has not been done."*
    **THE SCHEME — four badges, and the thresholds are EXACT. Age is measured from the case's
    last-checked DATE to TODAY, in whole days:**
    · **✅ GREEN — build-verified, current: age <= 7 days.**
    · **🟠 ORANGE — build-verified, ageing: age 8–14 days.**
    · **🔴 RED — build-verified, stale: age > 14 days.**
    · **❌ CROSS — NOT build-verified: never observed on any build.**
    **THE BADGE ALWAYS CARRIES THE DATE, and the build marker where known** — e.g.
    `✅ Build-verified 2026-08-18 (v3.8-bd246fd)`. **A BARE TICK IS NON-COMPLIANT** (Rule 12 — a claim
    must carry its evidence): a colour on its own tells the reader that somebody was once satisfied, and
    nothing about when or against what, which is precisely the ambiguity this badge exists to remove.
    **THE SAME SCHEME APPLIES TO SOURCE VERIFICATION**, per his earlier ruling that the same logic
    governs source verification — the badge carries the **date and the spec version**, e.g.
    `🟠 Source-verified 2026-08-06 (spec v19)`. **A PROJECT THEREFORE SHOWS TWO BADGES**, one for the
    build and one for the source, and they will often disagree: a suite can be source-current and
    build-stale, or the reverse, and collapsing them into a single "verified" hides exactly the half
    that is out of date.
    **WHERE IT APPEARS:** **every** status report, chat update, project table, `PROJECT-STATE.md`,
    handover sheet and Defects-for-Testers workbook — **anywhere a verification claim is made.** There
    is no context in which "build-verified" may be written without its badge and date.
    **RELATIONSHIP TO RULE 77 — THEY ARE COMPLEMENTARY, NOT CONFLICTING, and this is the clause a
    future session is most likely to misread.** **Rule 77 is the VALIDITY test**: a check within the
    last 3 builds (or 3 source versions) still **COUNTS** as verified. **Rule 91 is the VISIBILITY
    layer**: how **FRESH** that counting check is. **A case can be INSIDE Rule 77's window and still
    show 🟠 or 🔴, and that is the intended outcome, not a contradiction** — it counts, and the ageing
    is visible. Neither rule may be cited to suppress the other: Rule 77 never licenses hiding a red
    badge, and a red badge never licenses calling a case unverified when Rule 77 says it counts.
    **FINALITY CONTEXT — the other half of the same directive, and it is a correction.** This ruling
    establishes that **the branches are CONTINUOUSLY UPDATED as ad-hoc decisions are made and will NOT
    be final until release day.** Therefore **Rule 60's never-final strategy and Rule 49's
    provisional-findings discipline REMAIN IN FORCE**, and **a gap is treated as POSSIBLY-UNFINISHED
    rather than automatically a defect.** Any earlier statement that the branches are final is
    **superseded from 2026-08-21** — kept visible and dated, never silently overwritten (the Rules
    32/33 pattern).
    **HONEST CAVEAT — WHAT THE BADGE IS NOT.** It is a **freshness indicator, not a verdict**: a green
    badge says the case was checked recently, **not** that it passed, and **not** that the expectation
    is right. The pass/fail verdict is a separate layer (Rule 60 layer 2) and the expectation comes from
    documents only (Rule 57). A green badge on a case whose expectation was never sourced is still an
    unsourced case.
    **TOOLING:** `build/testing-tools/verification_badge.py` computes the badge for a project, a list
    of case ids or a section, parsing the Rule-54 sentence-2 line and the cited spec version. It takes
    `--today YYYY-MM-DD` **explicitly and refuses to run without it** — a badge computed off an
    implicit clock is unreproducible, and a freshness claim that cannot be recomputed is not evidence.
    Ties to Standing Rules 12 (observed, never inferred — and a claim carries its evidence, which is why
    a bare tick fails), 49 (a non-final build yields PROVISIONAL findings — the badge is how the
    provisionality becomes visible per case), 54 (sentence 2 is where the build marker and date live on
    the case, so the badge is DERIVED from the case rather than remembered), 60 (the never-final
    strategy, re-confirmed by this same directive), 77 (the validity window this badge makes visible
    without weakening), 80 (tell the last-done date and ask before re-running — the badge IS that date,
    shown by default), 84 (the tester-readiness gate reads the badge) and 85 (a project with no QA build
    shows ❌ for the build badge and a real date for the source badge).

---

92. **A LANE SESSION IS A PROJECT-AGNOSTIC ENGINE — IT WORKS ONLY ON THE PROJECT IT IS GIVEN, AND
    EXISTING PROJECT STATE IS REFERENCE, NOT A BACKLOG (all projects, permanent).**
    USER DIRECTIVE (2026-08-21, verbatim, his typing preserved exactly because Rule 25 applies to his
    instructions as it does to a spec): *"I just want them to be ready for new projects and those
    projects will keep on changing, all the sessions will learn from the previous project and add
    rules/skills etc to be more trained and mature for coming projects."*
    **THE RULE — THE SCOPE GATE.** Every lane session (test-case creation · build verification · VIU)
    is a **PROJECT-AGNOSTIC ENGINE**. It works on **exactly one project at a time, and ONLY the project
    the QA lead NAMES**. It arrives with **no project and no backlog.**
    **EVERYTHING IT READS ABOUT EXISTING PROJECTS IS REFERENCE MATERIAL AND HISTORY — Custom Roles,
    Fees & Discounts, Simple Flow, Global Search, Filters, Schedule, Report Suite. It is other
    sessions' work. IT IS NOT A TASK LIST.** A lane does not start, continue, audit, verify,
    re-verify, reconcile or report on any of it unless the QA lead **explicitly names that project and
    asks**.
    **🔴 THE CLAUDE.md PROJECT INDEX AND `build/OUTSTANDING-ITEMS-REGISTER.md` ARE REFERENCE, NOT A
    BACKLOG. READING AN OPEN ITEM THERE DOES NOT AUTHORISE ACTING ON IT.** This is the clause that
    matters, because both documents are **written in the register of a work queue** — the index lists
    statuses and badges, the register lists open asks with owners and dates — and a session that reads
    either one as an assignment is making an entirely reasonable mistake. **They exist so that a
    session which HAS been given a project can orient itself, and so the QA lead can see what is
    outstanding. Neither is an instruction to anybody.**
    **THE STARTUP PROTOCOL — DO THIS, THEN STOP.** On startup a lane session: **(1)** confirms its lane
    and its boundaries · **(2)** confirms its reading list · **(3)** states the inputs it will need
    once a project is assigned · **(4)** states its access preflight (Rule 89), its lock claim (Rule
    83) and its budget (Rule 90) · **(5)** **WAITS for the QA lead to name a project.** **It does no
    project work before that**, and "getting a head start" on a project nobody assigned is not
    initiative — it is a collision waiting to happen.
    **WHEN A PROJECT IS ASSIGNED:** claim its **lock** (Rule 83) · run the **Rule-31 source-currency
    pre-flight for THAT project only** · follow **`build/skills/15-NEW-PROJECT-INTAKE.md`** · and
    **stay inside it.** **ONE PROJECT AT A TIME.** Intake for a second does not begin until the first
    is handed back.
    **CROSS-PROJECT AND CROSS-LANE FINDINGS ARE REPORTED, NEVER ACTIONED UNILATERALLY (Rule 83).** A
    lane that notices, while working project A, that project B looks stale or that another lane's case
    is wrong, **writes it down and hands it to the main session.** It does not fix it, does not open the
    other project's folder to "just check", and does not add it to its own scope. The temptation is
    strongest exactly when the finding looks obvious and cheap — and that is when a second session is
    most likely to be mid-write on it.
    **HONESTY CLAUSE — WHAT THIS RULE IS NOT.** It is **not** permission to be incurious or to ignore a
    real problem. A lane still **reads** the reference material (it must, to know the conventions and
    the history), still **reports** what it notices, and still refuses to proceed on a half input set
    (Rule 1). What it may not do is **convert reading into doing** without the QA lead naming the
    project. **The distinction is between KNOWING about work and OWNING it.**
    **RATIONALE (2026-08-21):** a freshly-created test-case-creation lane session immediately began
    **pulling the entire Schedule project** — its spec, its epic, its cases — because CLAUDE.md's
    project index and the outstanding register read like an assignment, and the handoff's own reading
    list pointed straight at them. Nobody had named Schedule. **The cost of that failure mode is
    threefold and all three are real:** it **burns shared quota** on work nobody asked for (Rules
    76/90); it **risks colliding** with the session that actually owns that project, on one TestRail,
    one branch and one login (Rule 83); and it **can act on superseded state**, because a project's
    stored status line is frequently wrong and the sources have moved since — the very failure Rule 31
    exists for. **A session that adopts stale work is worse than an idle one**, because its output
    looks authoritative and carries a fresh date. Ties to Standing Rules 1 (never proceed without the
    complete input set), 6 (nothing written to a system of record without permission), 31 (source
    currency — for the assigned project only), 36 (the register is a list of asks, not a list of
    orders), 76 (quota discipline), 79 (strategy first), 83 (lane ownership and write locks), 88
    (context discipline — do not bulk-read a project you were not given) and 90 (shared-quota budget).

---

93. **THE LEARNING LOOP — EVERY PROJECT ENDS WITH A RETRO THAT PROPOSES RULE AND SKILL IMPROVEMENTS
    (all projects, permanent).**
    USER DIRECTIVE (2026-08-21, verbatim — the learning half of the same instruction): *"all the
    sessions will learn from the previous project and add rules/skills etc to be more trained and
    mature for coming projects."*
    **THE RULE.** At the **END of each project** — and **after any significant failure or surprise**,
    without waiting for the project to finish — the lane session writes
    **`build/<project-slug>/RETRO-<date>.md`** containing:
    **(1) WHAT WORKED** — named, with the evidence, so it can be reused rather than rediscovered
    (Rule 27's logic: a proven recipe recorded once must never be re-derived).
    **(2) WHAT WENT WRONG, AND ITS ROOT CAUSE** — **five-whys, not a symptom.** *"The count was wrong"*
    is a symptom; *"we measured from a stale checkout because no rule required a fetch first"* is a
    root cause. A retro that stops at the symptom produces a rule that prevents nothing.
    **(3) WHAT AN OUTSIDER COULD HAVE CAUGHT THAT WE DID NOT** — the Rule-45 outside-in question, asked
    of ourselves: what would an automation engineer working from the running build, or a hostile
    reviewer, have seen here? **This is the section that has historically found the real gaps**, and it
    is also the most uncomfortable to write, which is precisely why it is mandatory.
    **(4) THE EXACT RULE OR SKILL TEXT IT PROPOSES** — **quoted ready to paste**, not described. A
    proposal phrased as *"we should be more careful about X"* is not actionable; a proposal phrased as
    the sentence that would go into the rule body is.
    **(5) THE EVIDENCE FOR IT** — what happened, when, with the file paths, commit SHAs, case ids or
    ticket keys that prove it. **A proposal with no evidence is an opinion** (Rule 12).
    **🔴 IT PROPOSES; IT NEVER EDITS THE RULES OR SKILLS ITSELF.** That is the QA lead's call via
    **Rule 72** — no addition to the Standing Rules or the Skills is recorded without his go-ahead —
    and **the main session records the approved changes** in `build/rules/` and `build/skills/`, keeping
    the CLAUDE.md index row consistent. **A lane session that edits the rules on its own initiative has
    broken Rule 72 even if its proposal was correct**, because the rules are the shared brain across
    sessions and a unilateral edit is indistinguishable from a drift.
    **A RETRO WITH NO PROPOSAL SAYS SO PLAINLY.** *"Nothing new was learned that is worth a rule"* is a
    **legitimate and welcome outcome**, and it is far better than a manufactured one. **Never invent a
    proposal for form's sake** — a rule added to fill a template dilutes the set, and the set only works
    because every rule in it was paid for by a real failure.
    **THE PURPOSE, PLAINLY: EACH PROJECT MAKES THE NEXT ONE CHEAPER AND SAFER.** The engines are meant
    to get **more mature, not just busier.** A lane that has run five projects and proposed nothing has
    either been extraordinarily lucky or has not been looking; a lane that has folded five projects'
    lessons into its skills starts the sixth project already knowing where the traps are.
    **RELATIONSHIP TO THE OTHER CLOSING OBLIGATIONS.** This is **not** a replacement for the Rule-67
    per-project completion table (what was done, for the QA lead) or the Rule-46 deliberate-decisions
    register (what we chose, and why). **Rule 67 reports the WORK; Rule 46 defends the DECISIONS; Rule
    93 improves the MACHINE.** All three ship; none substitutes for another.
    **RATIONALE (2026-08-21):** the QA lead's instruction has two halves, and the second half is the
    one with compounding value — the sessions are not merely to be ready for new projects, they are to
    **learn from each one and mature.** The evidence that this needs to be a rule rather than a habit is
    the workspace's own history: the most valuable rules in the set — 40 through 46, 57, 58 — were each
    written **after** a failure that had already cost real money, and several of them were only written
    because somebody outside our own work spotted the gap first. **A standing retro turns that from luck
    into process.** Ties to Standing Rules 21 (the process-authoring standard — a proposed process is
    written to it), 27 (record the proven recipe so it is never re-derived), 29 (no work loss — the
    retro is committed to git, the only durable store), 33 (a proposal is an INPUT, judged on its
    evidence, not an override), 45 (the outside-in hunt supplies section 3), 46 (the
    deliberate-decisions register is its sibling, not its substitute), 67 (the completion table reports
    the work; this reports the lessons), 72 (**PROPOSE, never self-record**) , 76 (quota discipline — a
    cheaper next project is the point) and 92 (the engines this loop matures).

94. **THE DEFECT ADMISSIBILITY GATE — NO TICKET IS FILED UNTIL IT PASSES EVERY CHECK, AND THE LANE'S
    OUTPUT IS APPROVED CANDIDATES, NOT FILED TICKETS (all projects, permanent).**
    **ORIGIN — the QA lead, 2026-08-21, verbatim:** *"The last time you created the tickets were cause
    me to get bitten because they refused those tickets saying they are irrelevant and marked them
    obsolete, though a few of them were accepted as genuine tickets."*
    **READ THOSE TWO WORDS PRECISELY: "IRRELEVANT" AND "OBSOLETE".** They are **not** *"badly
    written"*. Rule 73's 2026-08-17 quality checklist and skill `06`'s eight-item evidence bar both
    already answer *"is this ticket well built?"* — and a ticket can pass both, be beautifully built,
    and **still** come back refused. **This rule answers the PRIOR question: "is this a defect at all,
    and is it still a defect TODAY?"** It therefore runs **BEFORE** Rule 73's checklist and before the
    eight-item bar; it does not replace either, and where they overlap they are the same requirement.
    **THE TEN CHECKS.** Full text and the fill-in template: `build/skills/06-DEFECT-PREP.md`, section
    **THE ADMISSIBILITY GATE**. In brief:
    **A1 — REPRODUCED TWICE ON THE CURRENT BUILD.** Two separate runs from the steps as written, with
    the build marker (`<meta name="app-version">`) recorded at the **start of the first** and the **end
    of the last** and **proved unchanged**. A marker that moved means the branch was redeployed
    underneath the repro and the repro is void. **A defect seen once is not admissible** — it is an
    intermittent observation, and *"cannot reproduce"* is the cheapest refusal there is.
    **A2 — THE EXPECTATION IS QUOTED VERBATIM FROM THE CURRENT VERSION OF AN AUTHORITATIVE DOCUMENT.**
    Spec/PRD (with its **Confluence** version, its date and the section anchor), the owning story's
    acceptance criteria, a PO answer (file + link + date), or the design. **RE-READ THE SOURCE
    IMMEDIATELY BEFORE FILING (Rule 59)** — at the end of the pass, not the start. **If the spec moved
    since the case was written, RE-DERIVE the expectation from the new version first**; the case may
    now be wrong, not the build. **No quotable document → NO TICKET** (Rules 57/25). An ambiguity in
    the newer version is held and asked about, never resolved by looking at the build (Rule 58).
    **A3 — IT IS NOT AN UNFINISHED FEATURE.** **The branches are NOT final until release day** (the
    2026-08-21 ruling in Rule 91; Rules 49 and 60 in force), so a gap is **possibly-unfinished by
    default and it is OUR job to prove it is a defect.** Check the **owning story's status** — Not
    Started / To Do / In Progress / in an open sprint means **PENDING WORK, NOT A DEFECT**; check
    **feature flags**; scan the **epic's open stories** for one covering exactly this behaviour. If so,
    record it as *"not yet built"*, give the case the Rule-69 **NOT AVAILABLE ON BUILD** treatment, put
    it in the Rule-49 re-check queue, and move on. **That is the correct outcome, not a failure.**
    **A4 — IT IS NOT ALREADY REPORTED, AND CLOSED TICKETS COUNT.** Search by **area AND symptom**, in
    separate queries, **explicitly including closed/resolved** — the default open-only JQL is the trap.
    Record every query. **If a closed one exists, READ HOW IT WAS CLOSED, never infer it from the
    status: a re-file of a BY-DESIGN closure is an instant refusal**; *won't fix* is a decision to take
    back to the QA lead, not a new ticket; *fixed* or *obsolete* that still reproduces **is** filable,
    led by the fresh repro and quoting the closing comment.
    **A5 — IT IS NOT BY DESIGN.** **Rule 24: a control hidden in the front end while the back end still
    allows the action is a PASSED case, never a bug** — filing one is the literal definition of a
    ticket that does not make sense. **The inverse — the front end EXPOSING what the back end blocks —
    IS a defect.** Check the recorded by-design decisions (Rule 46) and the PO answers first. **If the
    answer to "is this even wrong?" is a PO question, it is a question, not a ticket** (skill `07`).
    **A6 — IT IS NOT ENVIRONMENT, DATA OR ROLE.** Correctly seeded data **named exactly as it appears
    on screen** (*"any"* only where PROVEN irrelevant, and say how — **the SV-8821 scar**), the correct
    role with the role **reset to template first** (Rule 26), a clean session, the right
    environment/branch, and **the app proved to be the one you think it is from the build marker, not
    the URL**. Rule out our own probe and our own instrumentation first (skill `03`).
    **A7 — THE CORRECT PARENT, PROVED.** `Story Defect` parented to **the STORY THAT OWNS THE
    BEHAVIOUR** — an Epic parent is rejected `HTTP 400` — **established from the epic's children, not
    guessed**, with how it was established recorded; plus the `relates to` link (Rules 52/53). A defect
    in the wrong team's queue comes back refused as not theirs, which reads as *"irrelevant"* even when
    the finding is real.
    **A8 — THE EVIDENCE IS COMPLETE.** Annotated screenshots to skill `06`'s standard, exact numbered
    steps a non-technical reader can run, the build marker, the environment/URL, the role and account,
    the timestamp — **and the TestRail C-id with its link (Rule 8) in OUR records, `CASE-IMPACT.md`,
    NEVER in the ticket body.**
    **A9 — ADVERSARIAL SELF-REVIEW: ARGUE THE TICKET DOWN BEFORE FILING.** Write, in the candidate
    file, the strongest case a developer could make for refusing it — **"this is unbuilt" · "the spec
    changed" · "works as designed" · "cannot reproduce" · "duplicate" · "environment issue"** — and
    answer each. **IF ANY ONE OF THE SIX IS PLAUSIBLE AND CANNOT BE DEFEATED WITH EVIDENCE, DO NOT
    FILE: ESCALATE TO THE QA LEAD WITH THE DOUBT STATED.** Be willing to lose here. **The argument gets
    made either way — either we make it first, in private, or the engineering manager makes it in
    public.**
    **A10 — RULE 62: CREATION IS ON HOLD. PREPARE TO THE BUTTON, THEN ASK.** The 2026-08-10 hold
    (*"Do not create anything until my next order."*) is **temporary with a lift condition — CHECK
    whether it lifted; assume neither way.** **Permission is PER ASK**; an earlier batch approval never
    covers a later ticket, and a finding being real, sourced and obviously worth filing **is not
    permission**. API-related findings are asked about **separately, every time** (Rule 51). On resume,
    **one ticket at a time** (Rule 73).
    **THE EVIDENCE THAT THE GATE RAN.** Every candidate gets its own committed
    `DEFECT-CANDIDATE-<id>.md` in the pass's defect pack — A1–A10 filled in, the six refusals argued,
    and a VERDICT. **It is committed whether the verdict is ADMISSIBLE or NOT**: a candidate that fails
    the gate is a valuable record, pointed at from `NOT-FILED.md`. **A gate you cannot show afterwards
    did not run** (Rules 12/50/86 — verify from committed evidence, never from a self-report).
    **THE DELIVERABLE IS APPROVED CANDIDATES, NOT FILED TICKETS.** Ten admissible, evidenced candidates
    the QA lead can walk through one at a time is a **good** pass. Ten filed tickets, six of which come
    back marked irrelevant or obsolete, is a **bad** pass **even if four of them were right** — because
    **the four are discredited by the six.** The thing being protected is his credibility, and it is
    not recoverable by volume.
    **RATIONALE.** Tickets refused as irrelevant or obsolete cost the QA lead credibility with the
    people whose queue they land in, and he has said plainly that it bit him. **The commonest causes,
    in order, are: a SUPERSEDED EXPECTATION (the spec moved after the case was written), an UNFINISHED
    FEATURE on a branch that is never final, a DUPLICATE of something already reported and often
    already closed, and BY-DESIGN behaviour** — most often a Rule-24 front-end block read as a bug. Not
    one of those is a writing problem, which is why Rule 73's checklist could not catch them. Each is
    cheap to check **before** the evidence budget is spent: **A3 and A4 in particular should be run
    EARLY, because they kill findings before a repro is paid for.**
    **AND THE FAILED CANDIDATE IS NOT A WASTED ONE.** A finding that fails A3 becomes a re-check-queue
    entry that fires when the story closes; one that fails A5 becomes a PO question; one that fails A4
    becomes a decision to take back to him. **The gate redirects findings, it does not bin them.**
    Ties to Standing Rules 6 (nothing written without permission), 11 (ask which process to run), 12
    (verified means observed, never inferred), 24 (FE blocks + BE allows = a PASS), 25 (a deviation
    cites the verbatim wording), 38 (foreign tickets are hands-off — report, never edit), 49 and 60
    (non-final builds yield provisional findings; the re-check queue), 51 (API items asked separately),
    52 and 53 (the ticket shape and Medium priority), 57 (the source is the document, never the build),
    58 (an ambiguous source is never resolved by looking at the build), 59 (re-read the sources
    immediately before the writes begin), 62 (the creation hold, per-ask permission), 71 (Automated
    cases held for the QA lead), 73 (the quality checklist this gate runs before, and one ticket at a
    time on resume), 91 (the branches are not final; the freshness badge) and 93 (the learning loop —
    the refusal post-mortem PROPOSES further checks; Rule 72 records them).

95. **THE TOKEN-DISCIPLINE CHARTER IS CARRIED BY EVERY SESSION AND EVERY HANDOFF — AND QUALITY IS
    NEVER WHAT GETS CUT (all projects, permanent).**
    **ORIGIN — the QA lead, 2026-08-21, verbatim:** *"Also make sure that this session is smartest one
    about token usage as I do not want once again the weekly tokens to be burnt at the start of the
    week. Make it a general rule for all the sessions we create and the hand offs we create for new
    sessions"*
    **THE CANONICAL TEXT IS `build/skills/TOKEN-DISCIPLINE-CHARTER.md`** — one page, imperative,
    copy-pasteable. **EVERY HANDOFF EMBEDS ITS TWELVE CLAUSES VERBATIM** (a session must not have to
    open another file to learn how to spend) and **EVERY SESSION APPLIES THEM FROM ITS FIRST TURN.**
    **A handoff without the section titled "TOKEN DISCIPLINE CHARTER (mandatory — Rule 95)" is
    NON-COMPLIANT AND MUST NOT BE ISSUED**; where a handoff already carries a token/quota section the
    charter is **MERGED into it, never duplicated**. Routers and other skills take it **by pointer
    only** — a router holds no substance, so procedure found inside one is a bug in that router.
    **THE TWELVE CLAUSES, IN BRIEF.**
    **(1) STRATEGY FIRST (79)** — before ANY task recall or devise the CHEAPEST CORRECT plan, not the
    first one; for anything large DECLARE AN INTENDED SPEND; then begin, one pass, then exit.
    **(2) NEVER BULK-READ — SCRIPT IT (88)** — no case bodies, CSVs, API dumps, spec bodies or large
    files into context; script it to a file and read a BOUNDED SUMMARY; inspect with `wc -l`,
    `head -n 20`, `grep -c`, `grep -n` and bounded `sed -n 'A,Bp'`; **never read CLAUDE.md end-to-end**
    (it is an index) and **never read `CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact
    whole**.
    **(3) THE READING RULE** — the startup reading list is FOR STARTUP; afterwards consult **anything
    the task needs**, always targeted and bounded. **KNOWLEDGE IS NEVER OFF-LIMITS; ONLY BULK READING
    IS.** Not reading a rule you are about to apply is a worse failure than the tokens it would cost —
    which is exactly the failure the index restructure was built to prevent.
    **(4) SPAWN DISCIPLINE (76 / 88)** — an ORCHESTRATOR with no file tools minimises spawns and
    batches ruthlessly, because every spawn re-loads the whole project context (**observed at
    200–380 k tokens each**); a LANE SESSION with direct tools DOES THE WORK ITSELF and does NOT spawn
    for anything it can do directly. **Never spawn for a trivial check** — piggyback it.
    **(5) NEVER POLL (75)** — long work runs as ONE detached, idempotent, resumable script with a
    CHECKPOINT FILE, plus a committer loop gated on a **RUN-FLAG FILE**; **never `pgrep -f
    <scriptname>`**, which matches itself so the loop never exits. Progress is **SELF-REPORTED IN
    COMMIT MESSAGES**. Launch and exit; verify later in one short pass.
    **(6) BATCH WRITES** — one scripted run with a PER-OP LOG (operation · C-id · HTTP status ·
    verification result), never one tool call per case; *"200 OK"* alone is non-compliant (50).
    **(7) PIGGYBACK CHEAP CHECKS (78)** — fold a cheap verification into the next substantive task and
    keep a pending-cheap-checks list; never spend a dedicated spawn on one.
    **(8) NEVER RE-DO WORK (77 / 80)** — before any verification, VIU or ordered task STATE WHEN IT WAS
    LAST DONE (date + build marker / spec version) and ASK before re-running; a check within the last
    3 builds or 3 source versions still COUNTS, shown with its date and freshness badge (91).
    **(9) ANSWER IN TEXT** when a tool call is not needed — a reflexive tool call every turn is a trap.
    **(10) THE BUDGET (90)** — one shared weekly pool: main/orchestrator **15 %**, each lane **25 %**,
    **10 % reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.**
    At **50 % of your own budget** compare spend against work completed, and **if spend is outpacing
    progress STOP AND REPORT** — never grind to zero. **Never consume the reserve** without his say-so.
    **(11) THE WEEK-START GUARD** — the pool resets weekly and was once nearly exhausted in ONE DAY, so
    **no lane may spend more than its weekly allocation in the first 48 hours of the week** without
    explicit approval, and **a task that will exceed its declared intended spend STOPS AND REPORTS**
    rather than continuing.
    **(12) QUALITY IS NEVER THE THING CUT** — none of clauses 1–11 may be used to justify **sampling
    instead of full coverage (50)**, **inferring instead of observing (12)**, or **skipping a
    verification gate (84, 86)**. **THE SAVINGS COME FROM HOW THE WORK IS EXECUTED** — scripts,
    batching, no polling, no re-doing — **NEVER FROM DOING LESS OF IT, AND NEVER FROM DOING IT LESS
    RIGOROUSLY.** Where cheap and correct conflict, **correct wins and you report the cost.**
    **RATIONALE — WHY A CHARTER AND NOT JUST THE EXISTING RULES.** The weekly pool was **nearly
    exhausted in a single day**. The causes, in order of damage, were **poll-by-spawn status checks**
    (a subagent spawned merely to ask whether a job was still running, each one re-loading the whole
    project context), **one tool call per case** instead of a scripted batch, **bulk reads** of case
    bodies, spec bodies and archives into context, **autocompact thrash** caused by those bulk reads,
    and **redundant re-verification** of things already verified within the validity window. **NOT ONE
    OF THOSE PRODUCED ANY QUALITY** — they were pure overhead, and every one of them was already
    forbidden by a rule that existed. Rules **75, 76, 77, 78, 79, 88 and 90 were correct but
    SCATTERED**, so nothing guaranteed that a new session, or a newly-authored handoff, actually
    carried them; a rule a session never sees is a rule it will break. **The charter is the single
    inherited statement that closes that gap** — one page, always embedded, always applied.
    **AND THE GUARANTEE THAT MAKES IT SAFE IS CLAUSE 12.** This rule must never become an argument for
    a smaller sample, a softer verdict or a skipped gate. **Rule 50 (verify exhaustively), Rule 12
    (verified means observed, never inferred) and Rule 86 (verify from committed evidence) are
    UNTOUCHED by it** — indeed the charter serves them, because a session that stops polling and starts
    scripting can afford the FULL pass it could not otherwise finish. **Cheap is a method, never a
    standard.**
    Ties to Standing Rules 12 (observed, never inferred), 50 (verify exhaustively — the thing clause 12
    protects), 75 (detached, self-committing long work), 76 (minimise spawns), 77 (the validity
    window), 78 (piggyback cheap checks), 79 (strategy first), 80 (say the last-done date and ask), 86
    (verify from committed evidence, not self-report) , 88 (lane-session context discipline) and 90
    (the shared-quota budget allocation).

96. **A V2 / UPGRADE PROJECT MUST DERIVE AND TEST THE INVARIANT SET — WHAT THE SPEC DOES NOT MENTION
    IS STILL A REQUIREMENT (all projects, permanent).**
    **ORIGIN — THE QA LEAD, 2026-08-21, VERBATIM:** *"I have no way to know what should not be changed
    in V1 due to V2 specially when V2 is not asking to change it."*
    **AND ON THE CODE-VS-DOCUMENT CONFLICT, VERBATIM:** *"Good Question you should always ask this
    question. But in this case I will raise a question in the meeting or if we create ticket with the
    reference that current behavior is this and V2 is changing it in that case the PO can decide which
    behavior to keep."*
    **THE PROBLEM IN ONE LINE.** We author cases for **V2 of an existing feature**, but a **V2 spec
    only describes what CHANGES — it is SILENT about everything else.** Nothing in our process
    converted that silence into tests, so **a V2 build could silently break a V1 behaviour and every
    case we hold would still pass.** A green suite would be reporting a regression as success. This is
    not a gap in diligence; it is a gap in the METHOD, and no amount of care applied to the V2 delta
    closes it, because the delta is not where the damage is.
    **THE RULE.** **Whenever the assigned project is a V2, an upgrade, a re-work or a re-design of an
    existing feature, the pass MUST derive and test the INVARIANT SET before or alongside authoring the
    V2 delta cases** — never after, because a matrix written after the cases is written to fit them.
    The operator form is **`build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`**, and the project type is
    established at intake by the **§1a PROJECT-TYPE question** of
    `build/skills/15-NEW-PROJECT-INTAKE.md`: **(i) NEW feature · (ii) V2 / UPGRADE of an existing
    feature · (iii) REVIVAL of an existing workspace project.** **Type (ii) triggers this rule** and
    additionally requires the **V1 project's slug**, the **V1 spec with its version**, and the
    **existing V1 case set** as inputs (Rule 1 — work does not start on a half-set). **The type is
    ASKED, never inferred from the project's name.** The process needs **NO BUILD and NO APP COOKIES**
    — it is document + case + code analysis, so a blocked login or a missing QA branch does not block
    it (Rules 68 and 85).
    **THE ARITHMETIC — INVARIANTS = V1 BASELINE − (CHANGED ∪ REMOVED ∪ REPLACED).** Enumerate what V1
    does today; map every V2 statement onto it as **CHANGED / REMOVED / REPLACED / SILENT** with the
    **verbatim V2 quote wherever V2 speaks** (Rule 25); everything left over is an **INVARIANT — a
    behaviour that must still work after V2 — and it gets a regression case.**
    **SILENCE DEFAULTS TO "MUST NOT CHANGE" — AND HIGH-COLLATERAL-RISK SILENCE IS ESCALATED, NEVER
    ASSUMED.** The default is safe for a behaviour V2 goes nowhere near. It is **not** safe where V2
    touches the **same screen, component, API, data model, permission check or shared pipeline** — that
    is a **DANGEROUS SILENCE**, and it is **raised as a PO question**, not silently converted into an
    assertion we will later defend. Which silences are dangerous is a **factual dependency question**,
    answerable from the product source code and from the developer: what does V2 touch, and what else
    depends on it.
    **DOCUMENTS ESTABLISH INTENT. CODE ESTABLISHES FACT. THEY ANSWER DIFFERENT QUESTIONS AND MUST NOT
    BE CONFUSED.** **DOCUMENTS** — the V1 spec/PRD with its version, the V1 epic's stories and
    acceptance criteria, the PO's answers, the designs — are **AUTHORITATIVE for what V1 SHOULD do**
    (Rule 57). **OUR OWN REPO IS A FIRST-CLASS V1 SOURCE**: the existing V1 TestRail cases and their
    bodies, `build/<project>/requirements.md`, spec exports, PO answer files, design-review docs and
    `PROJECT-STATE.md`. **A V1 case DERIVED from V1 documents carries a Rule-54 provenance line, and
    those count as DOCUMENTED INVARIANTS**; a case whose provenance is **missing or vague is a
    CANDIDATE invariant only** and must be confirmed (Rule 64). **But our V1 cases are what we TESTED,
    not everything V1 DOES** — coverage gaps are **invisible invariants**, so the case baseline is
    **NECESSARY BUT NOT SUFFICIENT**. **PRODUCT SOURCE CODE** — the application repository's current
    release/develop branch, its composables, components, handlers and existing E2E tests — establishes
    **what the system CURRENTLY DOES**. It is **excellent** for exhaustively enumerating current
    behaviour (every branch, permission gate and edge case, far beyond our test coverage) and using it
    for a **REGRESSION baseline is legitimate**, because a regression baseline is a question of fact.
    **BUT CODE IS NEVER A SOURCE OF EXPECTATION (Rule 57).** The danger is exact: **if the code contains
    a bug, code-derived "current behaviour" would become an invariant we actively protect** — a
    regression case asserting that **the bug must survive V2**. **PRODUCTION OBSERVATION** may surface
    undocumented behaviours users rely on; those are **CANDIDATE invariants needing PO confirmation,
    never expectations in themselves.**
    **A CODE-VS-DOCUMENT CONFLICT IS A PO DECISION ITEM, NEVER A SILENT INVARIANT.** Code **agrees**
    with the documents ⇒ **STRONG INVARIANT, write the regression case** (citing the document, not the
    code). Code **contradicts** the documents ⇒ **a FINDING**: it goes to the **PO DECISION REGISTER**
    with what the system does today (evidence), what the V1 document says (**verbatim + version +
    link**), what V2 says or that V2 is **SILENT**, the options, and **our recommendation — which is a
    recommendation, never a decision.** **ASK THIS QUESTION ON EVERY CODE-DERIVED BEHAVIOUR** — that is
    the QA lead's directive quoted above, and his ruling on the consequence is equally explicit: he
    raises it in the meeting, or a ticket states that the current behaviour is X and V2 changes it to
    Y, **and the PO decides which behaviour to keep. WE DO NOT DECIDE IT.** **The affected case is HELD
    until the decision (Rule 58) and is never resolved by looking at the build.** Once the decision is
    given the case is written **to the decision** and carries the **Rule-56 divergence sentence**
    naming the decision, its source and its date.
    **SUPERSEDED V1 CASES ARE RETIRED OR REWRITTEN, NOT PRESERVED.** Where V2 **deliberately** changes
    or removes a V1 behaviour, every V1 case asserting the old behaviour is listed by `C#####` + link
    and proposed for **REWRITE or RETIRE** — a proposal, because nothing is changed or deleted in
    TestRail without explicit permission (Rule 6), an `Automated` case is held for the QA lead (Rules
    71/65), a foreign case is reported and never edited (Rule 38), and touching a case means
    re-verifying the whole case (Rule 41). **WORKED EXAMPLE:** *global search must no longer include
    page search, because page search has been separated out.* *"Page search results appear in global
    search"* is therefore **NOT an invariant** — it is REPLACED. A regression case asserting it would
    **generate a defect against intended behaviour** and be **refused as obsolete**, which is precisely
    what Rule 94's admissibility gate exists to prevent. **A regression suite that protects what V2 was
    commissioned to remove is a defect factory, not caution.**
    **THE HONEST LIMIT, STATED IN THE DELIVERABLE.** **Undocumented, untested, code-invisible
    behaviours cannot be fully enumerated.** The documents describe intent rather than behaviour, our
    cases cover what we chose to test, and code analysis surfaces only what the code makes visible. **No
    baseline built from the three is provably complete, and this rule does not pretend otherwise.**
    **WHAT PROTECTS US IS THE WRITTEN, PO-REVIEWED INVARIANT LIST PLUS THE DATED QUESTIONS WE ASKED** —
    the invariants are on paper, they were reviewed by the person entitled to decide them, and every
    silence we judged dangerous was asked about in writing on a stated date. That is a defensible
    position; *"we assumed the rest was fine"* is not. **The limit is a DISCLOSURE, never a discount:**
    it may not be used to justify a thinner baseline, a sampled matrix or a skipped escalation (Rule 50,
    Rule 95 clause 12).
    **WHERE THE CODE IS NOT AVAILABLE TO THE SESSION**, say so plainly in the deliverable, mark the
    code column **NOT AVAILABLE** (never blank, never guessed, never inferred from visible behaviour —
    Rule 12), and raise it as an **OUTSTANDING** item with the four Rule-36 fields. The pass still runs;
    the honest limit is correspondingly larger and the deliverable says so.
    **DELIVERABLES.** `build/<project>/regression-impact-<date>/REGRESSION-IMPACT-MATRIX.md` (one row
    per V1 behaviour: behaviour in plain words · where V1 guarantees it, doc + version + anchor and/or
    C-id + link · what the code does today, file → function · V2 says CHANGED/REMOVED/REPLACED/SILENT
    with the verbatim quote · COLLATERAL RISK HIGH/MED/LOW naming what is shared · DECISION · where it
    went), `PO-DECISION-REGISTER.md`, `RETIRE-OR-REWRITE-LIST.md`, the regression case set (each marked
    as a regression case, each tracing to its V1 source in its provenance line), the PO question sheet
    rows (Rule 66 — the sheet goes last), and an **OUTSTANDING** section (Rule 36).
    Ties to Standing Rules 1 (never start on a half-set — the three type-(ii) inputs), 12 (verified
    means observed, never inferred), 20 (every case traceable to its ticket + spec), 25 (verbatim
    citation on every deviation call), 32 (latest information wins), 40 (a requirement spanning surfaces
    is traced across every surface), 43 (a per-requirement verdict, never a narrative), 45 (the
    outside-in gap hunt — the same instinct, pointed at V1), 56 (the divergence sentence), 57 (the
    source of expectation is the document, never the build — and never the code), 58 (an ambiguous
    source is never resolved by looking at the build — hold and ask), 64 (every case must have a source;
    check before concluding it has none), 66 (the PO sheet is the last thing sent) and 94 (the defect
    admissibility gate — why an obsolete regression case is a liability).
