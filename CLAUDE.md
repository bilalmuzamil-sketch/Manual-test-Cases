# ShopView Manual Test Cases — Project Memory

> **Before any staging or TestRail testing, read `build/TESTING-RUNBOOK.md`.**
> That runbook holds the full, proven method; this file is a concise index +
> durable memory. **No secrets in this repo — ever** (secrets live in `/tmp`).
> - **PAUSED 2026-08-13 at 98% weekly usage — say "SKILLS-VERIFICATION-RESUME" to resume; read build/SKILLS-VERIFICATION-RESUME.md FIRST.**
> - **COLD-RESUME ENTRY POINT (2026-08-06, weekly budget exhausted): read `build/RESUME-2026-08-06.md` FIRST** — the one thing needed first (a fresh `sv_sso_session`), where all three projects stand, what is waiting on the QA lead, and the UNCONFIRMED Filters lead on Vlad's row 8 to check before Branko's question sheet is sent.
> - **🛑 ACTIVE HOLD — CREATE NOTHING (QA lead, 2026-08-10). NOT a standing rule; a TEMPORARY hold
>   with a lift condition, layered on Standing Rule 62.** Verbatim: ***"Do not create anything until
>   my next order."*** **Rule 62 says ASK FIRST; this ruling says THE ANSWER IS NO FOR NOW, and there
>   is nothing to ask about until he lifts it.**
>   **🔴 SCOPE CORRECTED 2026-08-11 — THE HOLD IS **JIRA TICKETS ONLY**. HE CLARIFIED; WE HAD READ IT
>   TOO BROADLY.** Verbatim: ***"We are supposed to crfeate test cases and accurate ones … And
>   anything that stops you from creating/updating a test case You MUST let me know, we are supposed
>   to create the test cases."*** So: **`add_case` is PERMITTED AND EXPECTED**, and so is
>   `update_case` — **authoring a case for an uncovered requirement is THE JOB, not a thing to seek
>   permission for.** **Jira ticket creation REMAINS BARRED** until his next order (Rule 62 + the hold
>   at its tail, unchanged in that respect).
>   **⚠️ SUPERSEDED WORDING, KEPT VISIBLE AND DATED (the Rules 31/52/53 pattern):** the safe reading
>   encoded on 2026-08-10 read *"no Jira ticket · **no new TestRail case (`add_case`)** · no new
>   artefact created in any external system of record"*. **The `add_case` half was OUR
>   over-broad reading of his words, not his instruction — this is a correction to how we RECORDED his
>   ruling, not a reversal by him.**
>   **NEW DUTY (his words): anything that STOPS us creating or updating a test case is REPORTED TO HIM
>   IMMEDIATELY** — not parked in a gaps list (Rule 36 register + Rule 63 surface-before-acting).
>   **`update_case` on EXISTING cases CONTINUES** — that is **correction, not creation**, and it is
>   what he authorised in requiring the three handed-off reports be *"100% authentic and VIU'd"*.
>   **Where a worker cannot tell which side of the line something sits, it STOPS AND ASKS.**
>   **LIFT CONDITION: his next order — a session reading this weeks from now must NOT treat it as
>   standing law; check whether it has been lifted.** Full text at the tail of Standing Rule 62;
>   register row **H1**.
>   **🔴 RE-STATED BY HIM 2026-08-12, IN THE SAME BREATH AS RAISING THE TICKET-EVIDENCE BAR: *"However
>   for now the Jira ticket creation is still on hold."* — SO THE HOLD IS STILL ACTIVE AS OF 2026-08-12
>   AND THE NEW BAR (Standing Rule 52, amended) IS EXPRESSLY FOR THE FUTURE, NOT A SIGNAL THAT FILING
>   HAS RESUMED.**
>   **🔴 RE-CONFIRMED BY HIM 2026-08-20 — NEW TEST-CASE CREATION IS NOT HELD FOR ANY PROJECT.** Verbatim:
>   ***"SOrry new case creation is not held for any project at all, see if you confused Hold on Jira
>   ticket creation with Hold on New test case creation."*** This settles the 2026-08-11 scope
>   correction beyond doubt: **`add_case` (new TestRail test cases) is PERMITTED for ALL projects**, and
>   the hold covers **Jira ticket creation ONLY** (which stays barred per Rule 62 until his next order).
>   The **live "safe reading" is therefore: no Jira ticket** — `add_case` and `update_case` are both
>   permitted. **(Superseded 2026-08-10 encoding, kept visible and dated above: it listed "no new
>   TestRail case (`add_case`)" — that half was OUR over-broad reading, corrected 2026-08-11 and again
>   here 2026-08-20.)**
> - **🔴 THREE RULINGS RECORDED 2026-08-12 — read them before any ticket, question sheet or
>   tech-plan-vs-spec judgement.** **(1) DEFECT TICKETS MUST BE UNCHALLENGEABLE — Standing Rule 52's new
>   EIGHT-ITEM EVIDENCE BAR** (verbatim: *"the defects you create can not be challenged and should not
>   bite me, they did badly bite me and my job is on threat due to that"*): the expectation quoted from a
>   named source with version and date (**no quotable document, no ticket**) · annotated screenshots ·
>   exact named test data · build marker + environment · a recorded duplicate search · the five-part
>   reader shape · a written pre-filing self-challenge · and a check that it is not a Rule-24 PASS.
>   **The bar decides FITNESS, never authorisation, and the creation hold above is unchanged.**
>   **(2) PO QUESTION SHEETS ARE THE LAST THING SENT — new Standing Rule 66** (verbatim: *"This should be
>   the last thing once you give me the report that everything else has been done only this part is
>   left"*): write them any time, **send only when everything we can do ourselves is finished**; a genuine
>   blocker is still raised immediately.
>   **(3) THE TECHNICAL-DESIGN AUTHORITY QUESTION IS ANSWERED AND CLOSED** (verbatim: *"Technical design
>   is the authority but if that contradicts with specs/tickets/answer sheet/claude design/figma … consider
>   the specs/tickets/answer sheet/claude design/figma … as the authority for the test cases but let me
>   know where it contradicts with the tech design"*): the technical design **sources a case alone where
>   nothing contradicts it**; **where it contradicts, the other five win** (latest-wins among them); **and
>   every contradiction is REPORTED TO HIM — applying the order silently is NOT compliance.**
>   Recorded at **Rule 52** · new **Rule 66** · **Rule 57** follow-up (ii) · **Rule 30** · **Rule 33**.
>   **ELEVEN CASES HELD ON the old open question are RELEASED**; list + the contradiction sweep:
>   `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md`.
> - **⚖️ IF HIS INSTRUCTION CONTRADICTS A RECORDED RULE — STOP AND SAY SO *BEFORE* DOING THE WORK
>   (Standing Rule 63, 2026-08-11).** Verbatim: ***"If I say something that contradicts with you r
>   rules, please do tell me what I am saying VS what the rule and and ask me to tell you what to
>   follow."*** State **(a)** his instruction in his own words, **(b)** the rule's text WITH ITS
>   NUMBER, **(c)** an explicit ask which to follow — **before the work, never in the closing
>   summary.** Neither silent path is allowed: not silently following him, not silently keeping the
>   old rule. **A TIGHTENING IS NOT A CONFLICT** — the 2026-08-10 creation hold layers on Rule 62 and
>   rightly needed no escalation. On confirmation the superseded text is **kept visible and dated**
>   and his ruling is **cited** (Rules 32/33/48). **ALREADY LIVE: Rule 10's behaviour-verdict half is
>   SUPERSEDED** — the manual QA tester marks passed/failed; we verify labels, steps and sources
>   (confirmed 2026-08-11, ***"you are RIGHT"***; dated amendment at Standing Rule 10's tail).
> - **PRE-FLIGHT — THE FIRST ACTION OF ANY PROJECT TASK (Standing Rules 31 + 32): ESTABLISH THE
>   CURRENCY OF **ALL SOURCES** — not just the spec — BEFORE doing ANYTHING on a project (test cases,
>   question sheets, reports, audits, TestRail pushes, reconciliations, bug work, or even answering a
>   question about the project's state) (Rule 31, scope broadened 2026-07-31): (1) the **spec** (live Confluence version +
>   last-updated vs our baseline), (2) the **epic + its child stories** (story set, statuses,
>   description/comment changes), (3) the **designs** (Figma file/nodes; an OPEN Rule-35 fetch queue
>   means the design source is NOT current — say so), (4) the **engineering tech plan** (Rule 30),
>   (5) the **PO/stakeholder answers, messages and videos** (newest authoritative source wins).
>   **Every deliverable carries a SOURCE-CURRENCY block** — per source: identifier, version /
>   last-updated, date checked, and CURRENT / STALE / PARTIAL (a PARTIAL source names the exact
>   shortfall); nothing may claim completeness while a source is STALE. **Staleness markers lie:**
>   a Confluence page's in-body "Version" can sit at 1.0 while the real version advances (how the
>   Schedule spec drifted 5 versions) and a Jira epic's "updated" date moves for admin-only edits
>   like a QA-Assignee change — use the **Confluence version number** and the **Jira changelog**.
>   If a source can't be fetched, STOP and ask for access; never work off a possibly-stale copy.
>   And when sources disagree
>   (spec vs Figma vs prototype/Claude design vs video vs PO message vs tech plan) the MOST
>   RECENT authoritative product source WINS, with source + date recorded on the case (Rule 32).**
>   **Review findings are INPUTS, not overrides (Rule 33) — precedence: PO ruling → QA lead's
>   ruling → our own live-verified findings → a reviewer's/other QA's claims; judge the claim,
>   not the claimant, and never let a review silently reverse a recorded ruling.**
>   **WHEN ANOTHER AUTHOR'S CASE CONTRADICTS OURS (Rule 39): RETAIN our sourced position (spec /
>   tech plan / Loom video / PO answer), NEVER edit their case, and ESCALATE to the QA lead with
>   BOTH bases on the table — our document+version+anchor+date AND what source THEY worked from
>   (establish it; ASK them if it can't be determined). Check our OWN newer sources FIRST — the
>   conflict is often our older case vs a newer ruling we already ingested.**
>   **AFTER EVERY authorized `add_case` push, RUN-SYNC the project's test run (Rule 34) — a
>   fixed-selection run (`include_all: false`) never auto-picks up new cases; UNION the run's
>   current case_ids with the new ones (a partial `update_run` DELETES tests + results), snapshot
>   first, and get the user's authorization since the runs belong to other testers. Checker:
>   `build/testrail-run-sync-2026-07-31/run_sync_audit.py`.**
>   **AT EVERY SESSION START (and before/after any project or design work): CHECK FOR OPEN
>   DESIGN-FETCH QUEUES (Rule 35) — `ls build/*/design-*/PENDING-FIGMA-FETCH.md`; if a queue is
>   OPEN and now >= its DUE-AT, run its fetch command IMMEDIATELY without asking (no
>   authorization needed), and on another rate limit append the attempt + re-arm DUE-AT = new
>   error time + 9 h. **NO QUEUE IS OPEN as of 2026-08-04** — the Filters queue
>   `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` is **CLOSED at 85/85**
>   (2026-07-31T08:58:40Z, cleared over REST `/v1/images` with the QA lead's token). The
>   earlier "OPEN NOW 73/85, DUE-AT `2026-07-30T23:27:02Z`" pointer that stood here was
>   **STALE** — corrected 2026-08-04. Still run the glob at every session start.**
> - **AT EVERY SESSION START (and before/after any project work): CHECK FOR OPEN NON-FINAL-BUILD
>   RE-CHECK QUEUES (Standing Rules 49 + 60 + 61).** **THE GLOB IS `ls build/*/*/RECHECK-QUEUE.md` —
>   NOT `build/*/viu-*/RECHECK-QUEUE.md`, which is what stood here and finds only 3 of the 14 queue
>   files that exist** (passes now live in `full-viu-*`, `final-viu-*`, `recheck-*`, `cleanup-*` and
>   `provenance-reword-*` folders as well; corrected 2026-08-06 after reading every one). A build
>   declared NOT FINAL yields **PROVISIONAL** findings only, so every finding is queued with its
>   **BUILD MARKER**, **no suite may be called VIU-complete while a queue is OPEN**, and **a queue
>   closes ONLY when 100% of its rows are re-verified** (Rule 49, unchanged and not weakened).
>   **⚠️ THE RE-RUN TRIGGER CHANGED 2026-08-06 — the old blanket "re-run the queue when the build is
>   declared final or the app-version marker changes" is RETIRED as the default (Standing Rule 61).**
>   The **automated suite is now the monitor**: every `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` case
>   states the exact observable **SYMPTOM** and its **three outcomes**, so a fix that shipped
>   (outcome 3) or a failure that CHANGED (outcome 2) is reported by the next automated run — at no
>   cost, with no re-verification pass and no ticket polling. **What the queue now covers is only what
>   the suite CANNOT see: `AUTOMATION: HOLD` cases, never-observed cases, and any verdict that was
>   never automated — and THEIR trigger is the thing they are actually waiting on** (a PO answer, an
>   access blocker clearing, a feature shipping, a drag our tooling cannot perform) — **not a deploy.**
>   Rule **60(b)** still governs what a redeploy genuinely does invalidate: **layer 1** (on-screen
>   labels + navigation path), **layer 2** (the pass/fail/deviation verdict) and **the `HOLD` half of
>   layer 3**. Plain `AUTOMATION: READY` asserts *automatable*, not *currently passing*, and is
>   **build-independent**. **Also unchanged: ticket status is NEVER read as evidence about the build**
>   (Rule 61) — it is traceability, nothing more.
>   **🔵 ⚠️ AND THE REMAINING HALF OF THE TRIGGER WENT ON 2026-08-12 — A BUG-FIX DEPLOY DOES NOT MAKE
>   A PRIOR PASS STALE (Standing Rule 60's bug-fix-deploy amendment; the Rule 60(b) sentence
>   immediately above is KEPT VERBATIM AND DATED, not overwritten).** QA lead, verbatim: ***"don't
>   worry about them shipping the new biuilds everytime they fix a bug, they are just fixing the
>   reported bugs … and not adding any functionality to the build, so that does not make your previous
>   pass as stale."*** **So *"ON A REDEPLOY"* in Rule 60(b) now means *on a redeploy THAT ADDS OR
>   CHANGES FUNCTIONALITY*:** previously verified **labels, navigation, preconditions and steps STAY
>   VERIFIED** across a bug-fix-only deploy, their Rule-54 build stamps stay **honest records of a real
>   check**, and **a pass is NOT re-run merely because the marker moved** — the trigger is **a
>   specific, observed contradiction**, never a new hash. **THE HONEST LIMIT: this rests on the deploys
>   being bug-fix-only, and a marker cannot tell us which kind a deploy was — so do not PRE-EMPTIVELY
>   discard a pass, and where functionality demonstrably changed, Rule 60(b) applies as written.**
>   **UNCHANGED: a date nobody observed is never invented (Rule 12), a never-observed row is still
>   unobserved (Rule 60's honesty clause), and the Rule-49 close condition is not lowered.**
>   **WHAT IT REPAIRS: reports saying *"only N of M rest on the build now running"* as though the rest
>   were worthless were UNDERSTATING the position — those verdicts stand.**
>   **THE TRUE QUEUE STATE — 14 files, 13 OPEN, 1 CLOSED, established 2026-08-06 by reading every one
>   (this REPLACES the "THREE QUEUES ARE OPEN NOW (2026-08-04)" pointer that stood here, whose count
>   AND date were both stale — the body of this file already described a fourth and later ones):**
>   · **FILTERS — LIVE queue `build/filters/full-viu-2026-08-05/RECHECK-QUEUE.md`** (OPEN; 110 rows;
>   build `v3.4.2-d00239b`, etag `b9ab1d41…`, read three times byte-identical). **⚠️ UPDATED
>   2026-08-06: a NEWER queue is also OPEN — `build/filters/vlad-gap-review-2026-08-06/RECHECK-QUEUE.md`
>   (9 rows), and the BUILD HAS MOVED to `v3.4.2-280ca5a` (Thu 06 Aug 09:37:49 GMT, etag `720a7f1f…`),
>   so `v3.4.2-d00239b` above is the build those 110 rows WERE RECORDED ON, not the build running.**
>   Still OPEN as
>   SUPERSEDED RECORDS: `final-viu-2026-08-05`, `recheck-2026-08-05`, `viu-2026-08-04`.
>   **CLOSED: `cleanup-2026-08-05/RECHECK-QUEUE.md` (2026-08-05 14:25 UTC — all 8 phone rows observed
>   live at 390 × 844), together with its `PENDING-LIVE-CHECK.md`.**
>   · **SCHEDULE — LIVE queue `build/schedule/full-viu-2026-08-05/RECHECK-QUEUE.md`** (OPEN, opened
>   2026-08-06; 168 rows; **90 on `v3.5-7ec992f`, 78 on `v3.5-d122eef` which no longer exists**).
>   Still OPEN as SUPERSEDED RECORDS: `provenance-reword-2026-08-05`, `final-viu-2026-08-05`,
>   `viu-2026-08-04`. **⚠️ `recheck-2026-08-05/RECHECK-QUEUE.md` CONTRADICTS ITSELF — its banner reads
>   "✅ CLOSED AS AN ATTEMPT" while the status line immediately below still reads "STATUS: OPEN — 0 of
>   165 rows re-checked". Left exactly as found and reported rather than silently resolved; treat it
>   as a record either way, because the live queue is the `full-viu` one.**
>   · **REPORT SUITE — FOUR OPEN, no single one is the live queue:** `full-viu-2026-08-05` (476 rows,
>   `v3.5-16cf83f`) · `chris-newreqs-2026-08-05` · `final-viu-2026-08-05` · `viu-2026-08-03`.
>   **✅ CORRECTED 2026-08-06 — `build/report-suite/full-viu-2026-08-06/RECHECK-QUEUE.md` NOW EXISTS
>   AND IS OPEN.** The pointer that stood here — *"THE NEWEST REPORT SUITE PASS … OPENED NO QUEUE FILE
>   AT ALL — so the 200 verdicts it established on `v3.5-16cf83f` are queued nowhere … the next Report
>   Suite pass owes that queue"* — was **TRUE WHEN WRITTEN**; a later session on the same day opened the
>   queue, and it covers **both** the earlier verdicts and its own. **So the Report Suite queue family is
>   FIVE files, all OPEN**, not four. The gap is discharged, and the superseded wording is kept visible
>   and dated rather than deleted.
>   **NONE of the three branches has been declared final — engineering has confirmed they will not be
>   before release (Rule 60) — so an OPEN queue is the NORMAL STEADY STATE of an active project, a
>   living work list rather than an embarrassment, and every verdict on all three stays PROVISIONAL.**
>   **⚠️ CORRECTED 2026-08-11 — THAT SENTENCE IS NOW TRUE OF TWO BRANCHES, NOT THREE. THE REPORT SUITE
>   BRANCH IS FINAL:** the QA lead confirmed *"note that ALL 6 reports have been handed off now."*,
>   satisfying the condition he set on 2026-08-10, so **findings on all 476 Report Suite cases are NO
>   LONGER PROVISIONAL pending development — a deviation there is a real defect in a finished feature
>   — and its Rule-49 queue rows MAY CLOSE as each case is re-checked, on the ORDINARY close condition
>   (the bar is not lowered).** **SCHEDULE (`sv8685`) AND FILTERS (`sv8785`) ARE UNCHANGED — not
>   declared final, verdicts still PROVISIONAL, queues still the normal steady state.** **"Final"
>   means HANDED OFF / feature-complete, NOT "the code will never change" — a redeploy still
>   invalidates the labels and the pass/fail verdict (Rule 60, layers 1–2) even on a final report.**
>   **HONEST CONSEQUENCE: only 225 of the 476 are build-verified; the other 251 (Sales By
>   Representative 112 · Parts Velocity 71 · Inventory Value 68) are FINAL-BUT-NOT-BUILD-VERIFIED**,
>   so this RAISES the outstanding work. Full text: the 2026-08-11 amendment at the tail of Rule 49.
>   **⚠️⚠️ CORRECTED AGAIN, LATER ON 2026-08-11 — IT IS NOW TRUE OF *NO* BRANCH. ALL THREE ARE FINAL.**
>   QA lead, verbatim: ***"The Branches are Final now."*** — plural, and given immediately after he
>   confirmed all six reports were handed off, so it **extends finality to SCHEDULE (`sv8685`) and
>   FILTERS (`sv8785`) as well as the Report Suite (`sv8582`).** **The block immediately above is kept
>   verbatim and dated, not overwritten** (the Rules 31/52/53 pattern), so the record shows WHEN each
>   branch became final: the Report Suite on 2026-08-11 earlier in the day, Schedule and Filters with
>   this ruling. **CONSEQUENCES ON ALL THREE:** findings are **NO LONGER PROVISIONAL pending
>   development** — a deviation on any of the three is a **real defect in a finished feature** — and
>   **Rule-49 queue rows MAY CLOSE on every one of them**, on the **ORDINARY close condition** (the row
>   re-verified with fresh evidence; **the bar is NOT lowered**, only the *"wait for the build to
>   settle"* blocker is removed, and Rule 60 may still never be cited to close a queue with rows
>   unverified). **⚠️ AND THE "NORMAL STEADY STATE" FRAMING AT THE HEAD OF THIS POINTER IS RETIRED** —
>   an OPEN queue was described that way as a *consequence* of branches that were never declared
>   final, and that premise is gone.
>   **THE CAVEAT CARRIES FORWARD TO ALL THREE AND WILL OTHERWISE BE MISREAD: "final" means HANDED OFF /
>   FEATURE-COMPLETE, NOT "the code will never change."** All three can still redeploy — not least to
>   fix the very defects we are reporting — so **a redeploy still invalidates the on-screen labels and
>   the pass/fail verdict (Rule 60, layers 1–2) on every one of them.** What finality removes is a
>   different doubt: whether a gap is an **unfinished feature** or a **defect**. On all three it is now
>   a defect.
>   **🔴 THE HONEST CONSEQUENCE — THIS RAISES THE STAKES, IT CLOSES NOTHING OUT. ACROSS THE THREE
>   PROJECTS 433 CASES ARE FINAL BUT NOT BUILD-VERIFIED, AND THE RELEASE IS THURSDAY:** **Schedule
>   174** (build verification in progress; 0 of 174 observed — the session died 14 minutes in,
>   `build/schedule/build-verify-2026-08-11/BUILD-VERIFICATION.md`) · **Filters 8** (blocked on the
>   second non-administrator sign-in, outstanding since 5 August,
>   `build/filters/build-verify-2026-08-11/RESUME.md`) · **Report Suite 251** (Sales By Representative
>   112 · Parts Velocity 71 · Inventory Value 68 — source-accurate, never build-verified).
>   **331 ARE build-verified** — Report Suite's first three reports (225) and Filters (106) — and
>   **433 + 331 = 764 = the three suites in full (Schedule 174 + Filters 114 + Report Suite 476).**
>   **⚠️ ARITHMETIC CORRECTION, RECORDED RATHER THAN QUIETLY FIXED: this ruling was first framed as
>   "425 final but not build-verified / 339 build-verified". Those two totals DOUBLE-COUNT THE 8
>   FILTERS CASES** — they appear as unverified in the first figure and as verified in the second
>   (433 − 8 = 425; 331 + 8 = 339). **The component figures were right and only the sums were wrong**;
>   each was re-derived from committed evidence and the corrected totals gate both ways. Full text: the
>   later 2026-08-11 amendment at the tail of Rule 49.
>   **AUTOMATION MARKERS are now on 100% of all three suites** (they were on 102/110 Filters and
>   0/165 Schedule when this pointer was last written): **Filters 110/110** (81 READY · 14
>   READY-EXPECT-FAIL · 15 HOLD) · **Schedule 168/168** (119 · 21 · 28) · **Report Suite 476/476 —
>   CORRECTED 2026-08-06** by a full live census of all 476 cases (commit `a1c38d38`): **330 READY ·
>   103 READY-EXPECT-FAIL · 43 HOLD = 476, exactly one marker each with the marker last, exactly one
>   provenance line each, and RAW MARKUP IS 0 OF 476.**
>   **⚠️ THE TWO FIGURES THAT STOOD HERE WERE TRUE WHEN WRITTEN AND ARE NOW STALE — kept visible and
>   dated rather than silently overwritten:** *"Report Suite **464/476** by live census (**426** READY
>   · **38** HOLD)"* with *"**12** carrying no plain-text marker because their text is raw HTML and
>   the marker is wrapped in `<p>` tags — all 12 in Work In Progress"* (C30451, C30456, C30457,
>   C30460, C30487, C30490, C30491, C30493, C30519, C30522, C30526, C30528). **Those 12 have been
>   REPAIRED.** All twelve were re-read **INDIVIDUALLY**, and `get_case` was byte-compared against
>   `get_cases` on three of them to rule out a bulk-endpoint read trap — so the 0 is a measurement,
>   not an assumption.
>   **⚠️ THE ARITHMETIC GATE (330 + 103 = 433 = 476 − 43) IS NOT A COVERAGE CLAIM AND MUST NOT BE
>   QUOTED AS ONE — only 403 of 476 carry a verdict, and only 51 rest on the build now running.**
>   The marker goes at
>   the VERY END of Expected Results, AFTER the Rule-54 provenance line, blank line before and a line
>   break after, in exactly three forms: `AUTOMATION: READY` · `AUTOMATION: READY - EXPECT FAIL
>   (SV-xxxx)` · `AUTOMATION: HOLD - <reason>`. A tool flag NEVER justifies HOLD — only a genuinely
>   unobtainable thing (a real physical device, an external account we do not have) does.
> - **⚠️ CHANGE A CASE TESTRAIL FLAGS AS AUTOMATED → TELL VLAD (Standing Rule 65, 2026-08-11). THIS
>   ENDS EVERY PASS THAT WRITES TO CASES — UPDATES AS MUCH AS DELETIONS, not just Rule 64's deletion
>   path.** QA lead, verbatim: ***"when we change any test case which has the testrail OWN automated
>   marker we have to update Vlad who does the automation so that he can adjust accordingly his
>   automation with our updates/delete of test cases."*** **The marker is TestRail's OWN field
>   `custom_atmstatus` (3 = Automated) — NOT our `AUTOMATION:` text marker; the two disagree and the
>   FIELD is the one that answers the question** (Rule 64, settled 2026-08-11).
>   **SO: record `custom_atmstatus` in the execution log for every case a pass writes** (it is already
>   in the snapshot the Rule-50 byte-check takes — and it must be captured AT WRITE TIME, because the
>   flag moves both ways), **and end every pass report with an "AUTOMATED CASES CHANGED — FOR VLAD"
>   section** — C-id + link, what changed in one plain phrase, and **whether it changes what an
>   automated check should conclude**. **Say "none" where none; NEVER omit the section.**
>   **⚠️ AND CHECK WHO SET THE FLAG BEFORE TRUSTING IT (`get_history_for_case`): on Report Suite and
>   Filters Vlad set it by hand, but on SCHEDULE NOBODY EVER DID — all 31 come from our own `add_case`
>   tooling hardcoding `3`, so they are NOT evidence anything is automated.** Baseline as at
>   2026-08-11: **75 of our 764 cases are Automated; we had changed 73 of them since 6 August, 27 of
>   those changes matter to automation and 46 do not — and only 8 of the 27 sit on cases Vlad marked.**
>   Full list ready to forward + the method and its limits:
>   `build/automated-cases-changed-2026-08-11/{FOR-VLAD,METHOD}.md`. Register row **V1**.
> - **OUTSTANDING-ITEMS REGISTER (Standing Rule 36) — the single cross-project list of everything we
>   are WAITING ON: build/OUTSTANDING-ITEMS-REGISTER.md. READ IT before writing any status report or
>   management deliverable, and UPDATE IT the moment an item is raised or cleared. EVERY project
>   report MUST END with an "OUTSTANDING — what I need from you" section (say "nothing outstanding"
>   if that is true — never omit it). Sweep all six categories: missing sources · unanswered PO/dev
>   questions · missing go-aheads/authorizations · access/credentials · deferred or HELD decisions ·
>   what another team owes. Unresolved inputs are the main threat to 100% authentic tests.**
> - **THE OUTSIDE-IN GAP HUNT (Standing Rules 45 + 46) — a suite may NOT be called current until it
>   has been looked at from OUTSIDE our own work. Rules 40–44 force follow-through on what WE found;
>   45/46 exist because we had no way to notice an OUTSIDER could see what we could not. **45** run the
>   foreign-coverage diff in BOTH directions (overlap AND the reverse — their assertions with no
>   counterpart in ours = a COVERAGE SIGNAL, not a nuisance: read-only checker
>   `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`), apply the automation-engineer lens
>   ("what would I assert from the running build?" — limited to the document while we have no QA
>   branch, and say so), the hostile-reviewer lens, treat EVERY external signal as a coverage input
>   rather than a reply, and **(e) never accept a "covered" verdict without BOTH TEXTS QUOTED SIDE BY
>   SIDE — a requirement making two assertions gets one row PER ASSERTION** · **46** every suite ships
>   its DELIBERATE-DECISIONS / anticipated-challenge register (decision · plain one-sentence answer ·
>   evidence · affected cases with C-ids · who closes it · honest risk), because an undocumented
>   deliberate omission is indistinguishable from a miss. Root-cause analysis:
>   `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`.**
> - **THE 2026-07-31 LESSONS (Standing Rules 40–44) — read `build/LESSONS-2026-07-31.md` before any
>   spec-delta, authoring, or case-edit pass. In one line each: **40** trace a requirement across
>   EVERY surface (screen · PDF · CSV · print · API · mobile) and ship the SURFACE MATRIX, not a case
>   list · **41** touch a case → re-verify the WHOLE case against the current spec and log
>   "re-verified whole against <spec+version>" · **42** no closed "exactly these …" enumerations
>   without a version-pinned anchor — write them scope-conditionally · **43** every spec-diff
>   requirement gets its OWN coverage-verdict row (narrative summaries are not acceptable; matrices
>   are RE-DERIVED, never patched) · **44** someone else's contradicting case is a bug report
>   against OUR suite until we re-derive our own position — a missing `refs` is never a reason to
>   dismiss it.**
> - **THE SKILLS — the seven jobs, written to be run COLD by a session with no memory of this
>   workspace: `build/skills/README.md`** (index + trigger words + how they compose + which to
>   reach for). **`00-COMMON-CORE.md` is read FIRST by every one of them**, then
>   **`01-CASE-BUILD` · `02-SOURCE-CHECK` · `03-RUN-CHECK` · `04-TESTER-READY` ·
>   `05-PROJECT-REPORT` · `06-DEFECT-PREP` · `07-PO-QUESTIONS`**. **"VIU" = SOURCE-CHECK +
>   RUN-CHECK + build-accurate wording; the pass/fail verdict is the manual tester's, so "VIU
>   complete" is never said.** They do NOT replace these Standing Rules or the PROCESS CATALOG —
>   where they differ, **this file and the process docs win.** Full pointer at the tail of this
>   file, beside the no-work-loss strategy.
> - **PROCESS CATALOG (the table of every reusable process + how to call it for any project):
>   build/PROCESS-CATALOG.md — READ THIS to pick/name a process; it lists all of them with
>   trigger phrases and the deliverable each produces. Keep it updated when a process is
>   added/changed (shared brain for both sessions).**
> - **READ-FIRST STAGING ACTION RECIPES (how to do each thing in ShopView — reuse, never
>   re-discover): build/APP-ACTIONS-PLAYBOOK.md — the indexed "STAGING ACTION RECIPES"
>   section at the top is the canonical quick-reference for every staging/QA action (auth,
>   create WO, add part, adjustments, switch role, change location, endpoints, UI flows,
>   TestRail). READ IT + "Durable key facts" below BEFORE any staging action; append any NEW
>   proven recipe immediately (Standing Rule 27).**
> - Reusable build-accurate wording + VIU + TestRail-sync method (Standing Rule 9):
>   build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md — **apply to any project WHEN THE USER ASKS.**
> - Reusable spec-relevance/obsolescence reconciliation method (keep the WHOLE case
>   suite + all deliverables honest to a NEW/UPDATED spec, not just named deltas;
>   complements the VIU wording process — Standing Rules 9/10/11):
>   build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md — **apply to any project WHEN THE USER ASKS.**
> - Reusable **spec-recheck** method (re-check a feature's TestRail cases against the CURRENT
>   spec + all Done Jira tickets [newest-wins], live-verify on the build, deliver a SIMPLE
>   change-list of only the cases needing a change/decision with the driving ticket + Done-status,
>   then edit only user-approved cases in TestRail): build/SPEC-RECHECK-PROCESS.md — **apply to any
>   project WHEN THE USER ASKS.** Proven on Custom Roles SV-7388 2026-07-20 ("Vlad's spec-recheck";
>   deliverable build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx).
> - Reusable **spec-recheck change-list workbook** method (the SIMPLE sign-off FILE half of the
>   spec-recheck: only the cases needing a change/decision, each with driving ticket + Done-status
>   + Action, 2nd tab for cases blocked on a not-done ticket, fine cases omitted; nothing pushed
>   until approved; captures the full originating instructions + corrections per Rule 18):
>   build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md — **apply to any project WHEN THE USER ASKS.** This is
>   the process behind build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx
>   (generator gen_simple_changelist.py).
> - Reusable **missing-traceability** method (find every test case lacking a Jira ticket ref
>   and/or a spec anchor, then backfill the metadata layer — TestRail `refs` field + spec
>   citation — so 100% of cases are provably authentic; enforces Standing Rule 20):
>   build/MISSING-TRACEABILITY-PROCESS.md — **apply to any project WHEN THE USER ASKS, and as a
>   sub-step of any spec-recheck/VIU pass.**
> - Reusable **Custom-Roles / Permission-VIU** method (run a COMPLETE Custom Roles & Permissions
>   test for a feature/epic — LIVE, against the CURRENT spec + all Done tickets [newest-wins] — in
>   4 layers [composition / backend 403-200 / front-end route guards / element controls],
>   reset-to-template first [persistent re-reset on drift], every verdict observed live with
>   evidence, then deliver a plain-English 7-tab management report [.md + .xlsx]; composes the
>   wording-VIU + prod-vs-staging + Atlassian methods; Standing Rules 6/7/8/9/10/11/12/13/14/15/20/
>   22/23/26): build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md — **apply to any project WHEN THE USER
>   ASKS.** Proven on Simple Flow SV-8183 2026-07-23 (deliverable
>   build/simple-flow/sv8183/SimpleFlow_SV-8183_Permission-Test-Report_2026-07-23.md/.xlsx).
> - Reusable Atlassian/Jira/Confluence LIVE-LOGIN + ingest access method (shared infra):
>   build/ATLASSIAN-JIRA-ACCESS-METHOD.md — **live browser login (headless Chromium via a
>   fresh MITM bridge → id.atlassian.com email+password → 6-digit EMAIL OTP) is now the
>   PRIMARY way to read shopview.atlassian.net tickets/pages; export/paste is the FALLBACK.**
>   This SUPERSEDES the old "Jira/Confluence is SSO-walled → export/paste only" stance used
>   in the per-project pointers above. **MFA RACE (crux):** each password submit emails a NEW
>   code and invalidates prior ones → hold ONE detached session at the OTP prompt polling
>   /tmp/…/otp.txt; NEVER start a fresh run to retry. ShopView/Cloudflare cookies do NOT
>   authenticate atlassian.net (Basic auth → 401/404). Creds + cookies + OTP codes in /tmp
>   only, never committed. The user supplies the OTP codes on request.
> - Reusable **Ruthless Usefulness Audit** method — the THREE-DIMENSION quality gate: score 100%
>   of a suite (1) USEFUL: KEEP/MERGE/WEAK-KEEP/CUT (hunt the named slop patterns, credit
>   load-bearing coverage), (2) MAKES SENSE: SENSIBLE/FIX-WORDING/NONSENSE (the 6 cold-read fail
>   conditions), (3) GENUINE + LAYMAN-RUNNABLE (Rule 20 traceability + Rules 7/9 plain wording);
>   honest "is the critic right?" answer on BOTH halves (waste % + makes-no-sense %); MANDATORY
>   final gate of every authoring pass per Standing Rule 28:
>   build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md — canonical example
>   build/report-suite/quality-audit-2026-07-28/.
> - **QA QUALITY PIPELINE EXPLAINER (the presentable "how do we ensure the test cases are
>   good?" doc the QA lead presents): build/QA-QUALITY-PIPELINE-EXPLAINER.md — the 12-step
>   quality pipeline in plain language (source ingestion → traceability → build-accurate
>   wording → coverage matrix → adversarial review → Ruthless Usefulness Audit → spec-change
>   reconciliation → VIU → the tester Blocked-revisit loop → the OUTSIDE-IN CHECK against other
>   people's cases in both directions → the DELIBERATE-DECISIONS register → the outstanding-items
>   close), each step cross-referenced to its internal process doc.**
> - Keep the books current: After each task, append ONLY success-proven learnings
>   (working navigation paths, action recipes, endpoints, the specific unblock that
>   worked) to build/APP-ACTIONS-PLAYBOOK.md; update build/TESTING-RUNBOOK.md when the
>   method changes; update CLAUDE.md when a durable fact changes. Do NOT record failed
>   approaches or dead-ends; a gotcha is recorded only as the working fix. Promote
>   (verify) items to confirmed only after actually succeeding. Reuse the books for
>   anything done before; research only genuinely new things.

## Projects in this workspace (three projects now, MANY more incoming)
This workspace/chat serves **THREE separate projects today** (Custom Roles, Fees &
Discounts, Simple Flow) but **will SCALE TO MANY** — the QA lead has flagged that
**~10+ more new projects are coming**. Keep each project's memory **SEPARATE** (don't
mix facts/scope/cases), but **reuse shared infrastructure across all of them** (the
staging/QA access method, the harness scripts, the TestRail API patterns, and the two
process docs — `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` +
`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`).

**New-project onboarding convention (apply when each new spec arrives — do NOT invent
project details ahead of time):** for each new project create a
`build/<project-slug>/` folder with its own:
- `PROJECT-STATE.md` — the canonical cold-resume doc (single authoritative snapshot:
  case inventory + VIU breakdown, TestRail state, deliverables index, open threads,
  env/access facts, ordered how-to-resume).
- `requirements.md` — the COMPLETE spec, built from the spec the user provides
  (Confluence pages are Atlassian-SSO login-walled → the user must export/paste the
  content; do NOT fetch the URL — keep the canonical Confluence URL as a reference
  pointer only).
- `cases/` — the authored test-case source (per-project `<PREFIX>-<AREA>-NN` IDs).
- `testrail-id-map.csv` — the internal-ID ↔ TestRail Case-ID map (Standing Rule 8).
- Record the project's **canonical spec URL + PO name** (never mix PO attributions
  across projects).
- The **ENGINEERING TECH PLAN is part of the required input set** (alongside
  spec/designs/epic) — if the user has not provided it by project start (or when
  authoring/VIU begins), **REMIND the user to supply it** (Standing Rule 30).
Then add a **per-project CLAUDE.md entry** with a concise STATUS line that points at
that project's `PROJECT-STATE.md` as the canonical resume doc. Per **Standing Rule
11**, whenever a new/updated spec arrives OR a VIU is requested, ALWAYS ASK which
process(es) to run before proceeding.

**PROJECT STATUS SNAPSHOT (2026-07-27, user ruling):** the **3 ACTIVE projects** are
**Report Suite, Schedule, Filters** — all three VIU-pending their QA branches. **Global
Search = POSTPONED**; **Simple Flow + Fees & Discounts = COMPLETED** (detail/resume docs
retained). The exact "what we need from the user/PO before VIU" list per active project is
in **build/PROJECTS-NEEDS-2026-07-27.md**.

**PERMISSION TESTING ROUTES THROUGH THIS SESSION (all projects):** each NEW project
ships its own Custom-Roles permission ticket (defining what each permission does for that
feature); that permission testing routes through this session — apply the Custom-Roles /
Permission-VIU process (build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md, proven on Simple
Flow SV-8183 2026-07-23) to test it LIVE against the current spec + Done tickets and
deliver the 7-tab management report.

1. **Custom Roles project** — Custom Roles & Permissions (ShopView), Epic
   **SV-7388**, STAGING. **Canonical spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **RECURRING: run the complete Custom Roles & Permissions test
   against the CURRENT spec + ALL Done tickets in epic SV-7388 on a cadence AND
   AFTER EVERY FEATURE RELEASE (not just on a cadence) — the Custom Roles feature is
   VOLATILE and regresses when OTHER features ship (Fees & Discounts, Vendor mgmt, etc.);
   run build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md after each release to catch regressions
   before they reach customers. (User ruling 2026-07-27, prompted by the SV-8682/8541/8701
   post-release breakage — ingest + coverage in
   build/custom-roles-run/release-regression-2026-07-27/.)** — use
   build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md (4-layer live method + 7-tab management
   report; proven on Simple Flow SV-8183 2026-07-23). **POST-v0.68/v0.69 REGRESSION DONE +
   ADVERSARIALLY VERIFIED CLEAN 2026-07-27 (canonical resume:
   `build/custom-roles-run/release-regression-2026-07-27/RELEASE-REGRESSION-STATE-2026-07-27.md`):**
   3 tickets triaged — **SV-8682 NOT REPRODUCED** (Vendors loads with Reports OFF, no dependency),
   **SV-8701 FIXED-VERIFIED** (customer default-adjustments 200 entitled / 403 unentitled, FE guards
   the tab, no whole-page lockout), **SV-8541 SPEC-INTENDED / pending PM** (core-resolve + part-return
   gated by WO→View, 400 not 403). 3 guard cases pushed to TestRail (user-authorized, titles shortened,
   run 312 untouched): **CR-REG-01=C38843** (sec 3538), **CR-REG-02=C38844** (sec 3537),
   **CR-REG-03=C38845** (sec 3535), all HTTP 200 + re-GET MATCH. **Full 11-role live sweep = 110
   role×page cells** (independently re-derived matrix = exact match, 0 mismatches) — **NO new broken
   permissions** (no lockout, no broken dependency, no FE-exposure; only benign 404 = a doubled-path
   SSO housekeeping call, page loaded). All 11 roles left AT template. Honest limits: page-reachability
   + per-page BE (not every in-page action), Vendor Invoices dropped, genuine tech-login drive method
   (switch-user was concurrent-locked). **After-each-release regression rule ACTIVE.** **CANONICAL WORDING+VIU RESUME DOC (read first to resume the
   wording/VIU effort):** `build/custom-roles-run/WORDING-VIU-STATE-2026-07-13.md` —
   the single authoritative snapshot of the 2026-07-13 build-accurate wording + VIU
   pass (final tally, 38–39 manual/2nd-user residue, 11 dev deviations, deliverables
   index, env/access, how-to-resume). **STATUS: DONE 2026-07-13 — full build-accurate
   WORDING pass pushed to TestRail (252 update_case on the core suite, all 200/200) +
   boot2 behavioral VIU across 8 rounds (RUN331 headless blocker overcome) +
   section-3658 stub tree FULLY RESOLVED (3 dup deleted early + 2 moved into 3527
   [C27731→3549, C27736→3545] + 5 stubs deleted [C27729/30/32/34/38, QA-lead
   authorized]; section 3658 subtree 3658–3665 now EMPTY = candidate for section
   removal, not deleted).** Final tally (254 cases): **VIU-Verified 204 / Blocked-UI
   39 / Deviation 11.** **PROD-VS-STAGING PERMISSION COMPARE DONE 2026-07-14 (final
   commit 30b35bd)** — release-eve bi-directional capability diff of all 14 live prod
   legacy roles (org 72b2cc90…, no Owner) vs all 11 staging roles + independent
   verification + staging FE-gate verify; counts (out-of-model excl.): STAGING-LESS
   No=51/Yes=5, STAGING-MORE No=37/Yes=24 (WO-granular 22/18; out-of-model 10);
   headline risks = Send-to-Portal prod-only loss (6 roles), Parts-Mgr WO+WOL C&E
   over-grant, Tech Order-Parts/WOL-Delete + Parts-Tech invoice-reverse/AP-AR + SA
   WO-Delete regressions; Send-to-Terminal has NO control in the staging build at all.
   **CANONICAL RESUME DOC: `build/custom-roles-run/PROD-VS-STAGING-STATE-2026-07-14.md`**
   (deliverables: `Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`/`.md`,
   `compare-VERIFICATION-2026-07-14.md`, `prod-vs-staging-compare-PLAN-2026-07-14.md`,
   `gen_prod_vs_staging.py`, `compare-evidence-2026-07-14/`,
   `staging-ui-verify-2026-07-14/`). **REUSABLE METHOD DOC (new):**
   `build/PROD-VS-STAGING-COMPARE-METHOD.md` — how to run a 100%-LIVE-OBSERVED
   two-environment permission/function comparison with **ZERO cells "NOT VERIFIED"**
   (headless OR headful; seed data as needed since both prod & staging are disposable
   TEST accounts; create a FRESH staff per holderless role + CLEAN self-login to avoid
   the role-swap `/no-location` location-store bounce; classify live API error bodies
   as evidence, not crash-to-/no-location as a verdict). **Comparison/environment-diff workbooks: `build/COMPARISON-WORKBOOK-RECIPE.md`** — the reusable template + method for any "make a comparison file" request (file name starts with "Comparison"); parameters = the envs/population/capabilities/spec. Local case source now exists (first time for Custom Roles):
   `build/custom-roles-run/cases-2026-07-13/*.json` (254 bodies, carry
   `viu_status`/`section_id`; NO testrail-id-map.csv — filename = C<id>). Env note:
   staging org is SHARED and **Tech is currently DRIFTED on Technician — reset to Time
   Clock User `a0359055-3dfb-4e9c-9e11-2fbea21585c2` before any negative retest**
   (old `77b069d1-...` is wrong). **⚠️ TWO-SESSION BASELINE CONFLICT (shared staging org
   d55bc308, flagged 2026-07-22) — RESOLVED 2026-07-23:** the intended Tech default is
   **role "Technician" (50bf6a0d)** — the user reset `tech@shopview.com` (user a7fd0a88) via
   "Reset To Template" 2026-07-23 → canonical 6 perms (customersView, scheduleView,
   woPickParts, woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView). **Tech baseline
   = Technician, NOT Time Clock User** (this supersedes the earlier Custom-Roles "reset to Time
   Clock User" expectation on the SHARED d55bc308 org; Custom Roles' own separate note above is
   staging-org-context — on the shared d55bc308 org the confirmed default is Technician).
   **⚠️ LIVE-OBSERVED CAUTION (2026-07-23):** the Technician ROLE (50bf6a0d) is being actively
   RE-DRIFTED by a concurrent session (observed added `workOrdersCreateAndEdit` +
   `seeFinancialData`, up to 14 atoms). Sessions MUST re-read Tech's current role AND re-assert
   "Reset To Template" on Technician immediately before any role-negative test, and not assume a
   clean baseline — a concurrent actor may re-drift it mid-run (Standing Rule 26). **CANONICAL RUN-331 RESUME DOC (for the earlier
   run-331 re-test):** `build/custom-roles-run/RUN331-STATE.md` (final tally
   96P/4F/10B/50R/0U). Existing memory: this CLAUDE.md's detail sections,
   `build/TESTING-RUNBOOK.md`, `build/APP-ACTIONS-PLAYBOOK.md`,
   `build/custom-roles-run/*` (WORDING-VIU-STATE / Blockers Tracker / WordingVIU
   workbook / section-3658-resolution / testrail-wording-viu-log),
   `build/custom-roles-spec-update/*`, TestRail section **3527** / runs **312** & **331**.
   **SESSION RESUME 2026-07-16 (exec+QA deliverables): read build/custom-roles-run/SESSION-STATE-2026-07-16-EXEC-QA.md first** — exec file DELIVERED (audited CLEAN); QA pre-release checklist DELIVERED (audited CLEAN, aad5864). Task COMPLETE; open threads in the state doc.
2. **Fees and Discount project** — Fees & Discounts V1 (ShopView).
   **✅ STATUS: COMPLETED 2026-07-27 (user ruling).** Detail/resume docs below are
   kept for the record. **Canonical
   spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/622297094/Fees+Discounts+V1
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL
   STATE DOC (read first for resume):** `build/fees-discounts/PROJECT-STATE.md` —
   the single authoritative snapshot (case inventory 183 + VIU breakdown, TestRail
   state, deliverables index, FDBUG register, open threads, env/access facts,
   how-to-resume). Per-case status tallied by
   `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md`/`.xlsx` (regenerate with
   `python3 build/fees-discounts/gen_blockers.py`). Memory:
   `build/fees-discounts/*` (`requirements.md` = COMPLETE spec Stories 1–14 + §5
   calc contract; `design-notes.md`; `viu-recon.md` = qb env map/access/harness;
   **TWO same-day VIU passes 2026-07-08:** pass A = `viu-findings.md` +
   `bugs-log.md` + `viu-evidence/` (API-heavy, Admin+Tech); pass B =
   `viu-qb-findings.md` + `screenshots/viu-qb/` (UI-deep) — pass B's doc holds
   the merged scoreboard + reconciliation + FDBUG register + API map).
   **STATUS: 2026-07-14 — CHRIS WARD'S ROUND-2 ANSWERS (Q1=A/Q2=A/Q3=A/Q4=B)
   APPLIED + the 6 Round-2 cases PUSHED TO TESTRAIL (6/6, 200/200); FD-QB-014
   (C28557) VIU-Verified (commit-time over-discount warn/confirm "Discount exceeds
   subtotal" dialog confirmed BUILT at Create-Invoice + Mark-Reviewed/Complete).
   V1_3 applied 2026-07-17 (2 deltas: §5-R15 SFD-gate [FD-WO-016 gate qualifier +
   folded SFD-negative, FD-PROC-004], history→audit-log sweep [9 cases + 4
   notes-only]; 11 update_case pushed 11/11 200 + re-GET MATCH, audit-logged in
   spec-v3-2026-07-17/testrail-update-log.md, commit 90e786e; requirements.md §17 =
   V1_3 baseline; TICKET 3 reworded to audit-log; tally unchanged). DONE 2026-07-20
   (§0.0f/§0.0g): ALL 5 "History log*"→"Audit log*" section renames EXECUTED —
   thread CLOSED 5/5 (user-authorized; sections 3957–3960 4/4 + 5th section
   "History log — edit entry" 3961 → "Audit log — edit entry" [authorized
   2026-07-20], all update_section 200 + re-GET MATCH, audit-logged; mirrors +
   import/Tracker regenerated both passes) + the Chris V1_3
   question sheet PRODUCED + READY TO SEND
   (PO-Questions-Chris-V1_3_2026-07-17.xlsx/.md, Round-2 format 1:1, Rule-7
   layman).**
   **CHRIS V1_3 ANSWERS INGESTED 2026-07-20** (`chris-answers-v1_3-2026-07-20/answers-ingested.md`):
   **Q1=B** — the §5-R15 tax-jurisdiction note shows below EVERY Taxable control (WO +
   Part Sale Add/Edit + admin fee-template dialog, every kind; no separate
   Processing-Fee window); **Q2=A** — SFD gate observable only at the admin template
   dialog via a Manage-Finance-Settings-without-See-Financial-Data user. Resolves
   spec-diff §H a/b (latest-wins). Consequence: FD-WO-016 (C29441)/FD-PROC-004 (C28522)
   scope stands; TWO new surfaces (admin template dialog note S7-R12f + Part Sale dialog
   note) now need an authorized add/update pass + live VIU. INGESTION ONLY — tally
   unchanged.
   **STAGING LIVE VIU DONE 2026-07-20 (§0.0i — F&D now deployed to
   `app.staging.shopview.com`, flags FeesAndDiscounts+PartSales+QuickBooks ON):**
   Chris Q1=B §5-R15 note VERIFIED LIVE in all surfaces (admin template dialog + WO
   Add/Edit + Part Sale Add/Edit); Q2=A SFD-gate negative CONFIRMED (Tech = Manage
   Finance Settings without See Financial Data → sees Taxable toggle, not the note).
   ALL 12 Blocked-NotBuilt FLIPPED to VIU-Verified (Processing-Fee builder + Part Sales
   "Fees & Discounts" column both shipped on staging) + FD-WO-016/FD-WO-005/FD-VAL-001
   Deviations FIXED. 2 NEW cases pushed (FD-TMPL-018=C29917, FD-PSALE-001=C29918) +
   FD-WO-016 (C29441) refined — TestRail 1 update_case + 2 add_case, all 200 + re-GET
   MATCH, NO run results. Evidence/log: `build/fees-discounts/viu-staging-2026-07-20/`.
   **DUP-PAIR RETIREMENT DONE 2026-07-20 (§0.0k):** user ruled keep FD-VAL-007 (C28605),
   retire FD-CUST-016 (C28500) — C28500 delete_case'd (HTTP 200; verify re-GET HTTP 400
   gone), C28605 intact; body kept locally marked Retired; id-map −1; generators exclude
   Retired; deliverables regenerated over 184. Dup-pair thread CLOSED. Audit:
   `build/fees-discounts/retire-2026-07-20/testrail-log.md`.
   **SV-8479/8480 AUTHORING CONSOLIDATED & COMMITTED 2026-07-22 (§0.0m — NO TestRail
   writes):** 18 net-new cases authored (SV-8479 ×11 + SV-8480 ×7, all VIU-Pending, in
   id-map with BLANK C-ids pending `add_case`; FD-CALC-024 = API) + 54 existing edited
   (pending `update_case`) + 9 SV-8479 dups dropped + 3 retire-candidates flagged awaiting
   user ruling (FD-LABOR-003/FD-PCOL-003/FD-PCOL-007) + SV-8456 no-delta. **NEW TALLY: 202
   ACTIVE authored** (184 prior + 18 net-new; +2 dev-authored = 204 in id-map/204-row map),
   of which **18 are NOT-YET-IN-TESTRAIL**. Deliverables regenerated over 202 (import 202
   rows, hygiene clean). Sources: `sv8479-8456-8480/deconfliction-decision-table-2026-07-22.md`.
   **SV-8479/8480/8456 LIVE STAGING VIU DONE + ADVERSARIALLY AUDITED CLEAN 2026-07-22 (§0.0n —
   supersedes §0.0m; NO TestRail writes):** 18 net-new + 54 edited verified LIVE on
   `app.staging.shopview.com` (4 batches; evidence `viu-sv8479-8480-2026-07-22/` +
   `viu-sv8456-2026-07-22/`). **FINAL TALLY: 202 active authored = 167 VIU-Verified / 13
   VIU-Deviation / 21 VIU-Blocked-Env / 1 VIU-Pending (FD-PART-005)** (+2 dev-authored
   FD-PERM-012/013 Verified; FD-CUST-016 retired; 204 in id-map). New Deviations = FD-WO-017 +
   FD-LABOR-003 (item-#1 ⋮ entry renders RIGHT of "Unassigned", spec wants LEFT — matches ticket
   Rejected-from-testing); FD-CALC-023 Blocked-Env (needs flag-off org). Sign convention resolved
   (line-level fee bare "20%" / discount "−10%" en-dash, plain grey no badge, both Lines-tab
   inline + Parts F&D column; whole-container CARD parenthesized "(10%)"/"(−5%)"; resolved $
   signed). SV-8480 S3-R18: WO line Total = Labor(gross)+Parts(gross)+line's own SIGNED
   fee/discount amounts (display-only; docs print fees/discounts as own rows, no double-count).
   Durable build facts consolidated in PROJECT-STATE.md "Durable build facts (VIU-confirmed
   2026-07-22)".
   **AUTHORIZED TESTRAIL SYNC EXECUTED 2026-07-22 (§0.0o — supersedes §0.0n):** user authorized
   the push + retiring the 3. Executed 5 add_section (4377–4381) + 18 add_case (C30618–C30635) +
   3 delete_case (FD-LABOR-003/C28441, FD-PCOL-003/C28471, FD-PCOL-007/C28475 — verified gone) +
   51 update_case (54-item list minus the 3 deleted), ALL HTTP 200 + re-GET MATCH; run 325
   untouched, only group 3894 touched, no secrets. **NEW TALLY: 199 ACTIVE authored = 165
   VIU-Verified / 12 VIU-Deviation / 21 VIU-Blocked-Env / 1 VIU-Pending (FD-PART-005)** (+2
   dev-authored = 201 in id-map). Deliverables regenerated over 199. Executor
   `exec_sync_2026-07-22.py`; audit `sv8479-8456-8480/testrail-execution-log-2026-07-22.md`;
   manifest header = EXECUTED. Canonical resume = PROJECT-STATE.md §0.0o.
   **ALL DEVIATIONS + THE PENDING CLOSED 2026-07-24 (§0.0q — supersedes §0.0p for the tally):**
   user-authorized, per Ahtasham's QA live review + our own live SV-8421 spot-check, all 8
   remaining VIU-Deviations + the 1 VIU-Pending closed to VIU-Verified = "no bug". **ZERO TestRail
   writes this pass:** Ahtasham reworded 3 directly in TestRail (C28460 FD-STATS-002 per-row
   name/percent/amount; C28489 FD-CUST-005 single→multi-select S9-R20; C28526 FD-PROC-008
   Remove-only) — pulled READ-ONLY + mirrored local; **FD-WO-017/C30618 was edited MANUALLY by the
   USER** in TestRail (kebab LEFT→RIGHT, Chris Ward accepted, SV-8479 DONE) — re-GET read-only,
   synced local; 5 pass-as-written flips LOCAL-only (FD-INLINE-003/C28456, FD-STATS-004/C28462,
   FD-CUST-006/C28490, FD-TMPL-010/C28511, FD-PART-005/C28450); FD-PROC-009/C28527 +
   FD-CALC-013/C28580 confirmed ALREADY Verified from our live spot-check (not re-flipped). HONESTY
   (Rule 12/22): only C28527/C28580 re-observed live by us; every other flip accepted on Ahtasham's
   review / the user's manual edit (noted per case). **NEW TALLY: 199 ACTIVE = 178 VIU-Verified / 0
   VIU-Deviation / 21 VIU-Blocked-Env / 0 VIU-Pending** (+2 dev-authored = 201 managed; id-map 203
   rows incl. 2 from a concurrent SV-8520/8521 session, untouched). Deliverables regenerated over
   199 (import header byte-identical, 0 VIU/flag words, no dup titles, no C-id column; id-map C-ids
   preserved). whats_needed.py: all 11 now-Verified fall through to "No action needed — passed"; 21
   Blocked-Env keep next-steps. Run 325 untouched. Audit
   `testrail-execution-log-deviation-closeout-2026-07-24.md`.
   **FE-BLOCK/BE-ALLOW PASS FLIP 2026-07-24 (§0.0p — superseded by §0.0q for the tally):** per
   Standing Rule 24 (FE blocks + BE/API allows = PASS), user-authorized, **FD-WO-013 (C28436) +
   FD-PERM-002 (C28586) flipped VIU-Deviation → VIU-Verified (PASS)** + a plain tester line added
   to each Expected ("only hidden on screen; if still doable via back-end/API that's expected —
   mark PASSED, don't raise a bug"). 2 update_case, both HTTP 200 + re-GET MATCH, refs intact, NO
   run writes / no add/delete/section. whats_needed.py: both now "No action needed — passed".
   **NEW TALLY: 199 ACTIVE authored = 167 VIU-Verified / 10 VIU-Deviation / 21 VIU-Blocked-Env /
   1 VIU-Pending (FD-PART-005)** (+2 dev-authored = 201 in id-map). Deliverables regenerated over
   199. Audit `testrail-execution-log-fe-be-pass-2026-07-24.md`.
   **Prior CURRENT TALLY (pre-8479/8480): 151 VIU-Verified / 12 VIU-Deviation / 20 Blocked-Env
   / 1 VIU-Pending (FD-PART-005) = 184 ACTIVE** (185 authored − 1 retired; +2 dev-authored
   reconciled = 186 in-suite; was 152/12/0/20/1 = 185 pre-retire; prior qb 135/15/12/20/1 = 183).
   **SV-8456 UI-CORRECTION STAGING LIVE VIU DONE 2026-07-21 (§0.0l):** frontend-only F&D
   UI corrections verified live — **FUNCTIONALITY INTACT** (template CRUD + apply-to-WO/
   Part-Sale + calc correct) and the **PERMISSION PIVOT CONFIRMED** (F&D settings now
   gated by **Settings → Service** [atom settingsService], was Finance: Service-user
   sees+manages+convenience toggle; Finance-only user has no F&D nav item, FINANCE shows
   only Payment Methods, /administration/adjustment-templates bounces to /workorders). All
   8 UI corrections match the ticket, 0 deviations (Taxable Yes/No dropdown; Auto-apply
   checkbox+caption; plain-text left-aligned tables; WO card "Work Order Fees & Discounts"
   above Financial Info; Part-sale card above Financial Info; customer tab; jur.note +
   convenience banner preserved). **34 cases reworded + pushed update_case 34/34, 200 +
   re-GET MATCH** (statuses unchanged). **C29922/C29923** (dev-authored automated, TestRail
   section 3963 Permissions Story 13) reconciled into id-map (FD-PERM-012/013) + mirrored
   locally (dev_authored, excluded from import/tracker) — no duplicates. Tech restored to
   Technician; 4 ZZAUTOTEST roles deleted; test data removed. Evidence:
   `build/fees-discounts/viu-sv8456-2026-07-21/`.
   **This staging LIVE-VIU pass was ADVERSARIALLY AUDITED CLEAN 2026-07-20 (§0.0j):**
   every VIU-Verified flip is evidence-backed, the 152/12/0/20/1 = 185 tally reconciles
   across all deliverables, live TestRail matches, run 325 untouched, no secrets. STILL
   OPEN: re-VIU the remaining 12 Deviations not cleanly re-driven on staging
   (FD-STATS-001/002/004 persist [no headers/hyperlink]; FD-PROC-008/009, FD-CALC-013,
   FD-INLINE-003, FD-CUST-005/006, FD-TMPL-010, FD-WO-013, FD-PERM-002 need
   seeding/role-negatives) + FD-PART-005 + (the FD-CUST-016/FD-VAL-007 DUPLICATE-PAIR
   QA-lead ruling is now RESOLVED — kept C28605, retired C28500, §0.0k) + filing the ready bug drafts (TICKETS 2/3/6/7/8/9/10/11;
   TICKET 1 on hold, 4 & 5 dropped, FDBUG-15 dropped) + the env/VIU backlog.
   **Resume = PROJECT-STATE.md §0/§0.5**
   (TestRail edits need fresh one-day authorization). FEATURE LIVE on
   `qb.qa.shopview.com` / API `sv7387api.qa.shopview.com` (flag ON). **DONE 2026-07-13:
   V1_2 spec applied (43 case updates + new FD-WO-016=C29441) AND a FRESH FULL
   build-accurate WORDING + VIU PASS over ALL 183 cases** with live-captured build
   labels — **ALL 183 pushed to TestRail via update_case, 200/200, 0 errors.**
   Headlines: FDBUG-1 not reproduced (treat fixed; FD-DOC-011 Verified);
   §5-R15 tax-jurisdiction note NOT implemented (FD-WO-016 Deviation); 14 QB
   line-item cases need a human in
   QuickBooks; 6 flag-off cases need a tester-free window; env bugs for dev: WO
   line-create 500, QB duplicate-doc-number export failure, bookkeeping unmap PUT
   500; **Technician role DRIFTED on qb (now has WO/Lines Create&Edit + Delete →
   WO permission negatives not testable) — reset Tech + re-derive roles-matrix
   before any permission retest**. **qb env is SHARED** (never assume env state)
   and **tech quick-login is FLAKY** — retest each run. **PROJECT-STATE.md =
   canonical resume doc** (full detail: FDBUG register, open threads, env/access,
   how-to-resume).
   *TestRail import (INTERIM):* `testrail-import/fees-discounts-v1-testrail-import.csv`
   (+ `.xlsx`), all 183 cases via `build/fees-discounts/gen_import.py`; **VIU-word-free
   and feature-flag-free by user rule**; INTERIM pending post-VIU + dev-answer
   finalization (see `build/fees-discounts/RESUME-STRATEGY.md`). Permissions: DEFINED
   / reuse-only — see `build/PERMISSIONS-ASSESSMENT.md`.
   **PO for Fees & Discounts = Chris Ward; PO for Simple Flow = Milos — never mix
   attributions.**
3. **Simple flow project** — Simple Mode / Streamlined Work Order Completion &
   Receiving (ShopView), Epic **SV-7301**.
   **✅ STATUS: COMPLETED 2026-07-27 (user ruling).** Detail/resume docs below are
   kept for the record. **Canonical spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/PM/pages/646021121/Simple+Mode+Streamlined+Work+Order+Completion+Bulk+Receiving
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL STATE DOC (read first for
   resume):** `build/simple-flow/PROJECT-STATE.md` — the single authoritative
   snapshot (case inventory 184 active [187 authored − 3 retired] + VIU breakdown,
   TestRail state, deliverables
   index, open threads, env/access facts, how-to-resume). Memory:
   `build/simple-flow/*`
   (`requirements.md` = COMPLETE spec, 17 stories SV-7696..SV-7710 + SV-7870
   [incl. R12/R13 auto-complete = SV-8303] + SV-7876 + §9/§10 SV-8183 permissions;
   `design-notes.md`; `viu-findings.md`;
   `cases/*.json` = 187 authored cases with `SF-` IDs (post spec `_4`/V2.6 2026-07-17;
   **3 Retired 2026-07-20 → 184 ACTIVE**); `SimpleFlow_V1_TestCases.xlsx/.csv`;
   `build_workbook.py` + `gen_cases.py`). ALL 184 active cases in TestRail (SF-QB-09 =
   C29909 since 2026-07-17; SF-CORE-05/06/09 = ex C29317/18/21 DELETED 2026-07-20 per
   user ruling). **A QA execution run EXISTS — run 325 "Simple Flow -
   Ayesha Khan -> Specs 7/7/2026"** (project 1/suite 1; snapshot 48 Passed / 6 Failed
   / 13 Blocked / 89 Untested; results logged by Ayesha 2026-07-13). It was **NOT
   created by us** — it is Ayesha's/QA's run; **never write results to it without
   explicit permission** (corrects the earlier "no execution run exists" note).
   Reconciliation vs our findings:
   `build/simple-flow/run325-reconciliation-2026-07-13.md` — priority follow-ups = 5
   "she-FAILED / we-VIU-Verified" cases (SF-COMP-02, SF-TECH-02, SF-VPART-06
   unexplained → need live re-VIU; SF-VPART-01/02 likely stale-7/7-baseline tied to
   known BUG-9) + ingest Jira **SV-8303** (Ayesha's SF-SET-10 note flags a coming
   spec change).
   **RESUME 2026-07-24 (LATEST — SV-8183 UNCOVERED-AREAS RE-RUN "rerun2"; NO TestRail writes; read
   build/simple-flow/PROJECT-STATE.md §0-KK + source `sv8183/rerun2-2026-07-24/FINDINGS.md` commit
   7a0cc39):** closed the 5 §0-II open follow-ups (part-item kebab actions; SV-8541 return/resolve-core
   endpoints LOCATED; `/bulk-receive`; Returns/Part-Sales/Vendors/Deliveries/Inventory; Yes-heavy
   roles). **BE-enforcement matrix extended to 11 roles × 7 endpoints — `accept`/receive matches §9.2
   EXACTLY** (400 for the 7 Yes roles, 403 for the 4 No roles). **RESULT: NO NEW permission issue** (no
   FE-exposure defect, no true FE-allows+BE-allows gap); the 2 API-behaviors (NEW-1 `change-item`
   SFD-gate → Sales Rep/Office; NEW-2 part add/delete/edit + resolve-core not BE-enforced) are **PASS
   per the strengthened Rule 24** — rerun2 added the missing FE-blocked half of the proof (Office
   edit_note/Receive hidden; negatives route-blocked). Known SV-8515 (not reproducible), SV-8516
   (part-edit API-flag PASS), SV-8541 (pre-resolve-cores 400-all recurs; held) unchanged. **0 role
   drift** (all 11 == §9.2 before AND after). **HONESTY — do NOT claim 100% exhaustive; 2 residuals:**
   SM/SrSA/Foreman not individually UI-driven (no confirmed real holder; BE-positive via matrix
   superset); the resolve-cores wizard + return flow not driven end-to-end (per-role BE captured).
   Corrective cases IN TestRail (§0-JJ): SF-PERM-11 = C30646 (VIU-Deviation, SV-8515 FE-exposure) +
   SF-PERM-12 = C30647 (VIU-Verified, Rule-24 PASS) + SF-PERM-03 = C29407 (updated). Tally 186 active.
   **RESUME 2026-07-24 (LATEST — SV-8183 OPTIONAL REGRESSION EDITS EXECUTED; read PROJECT-STATE.md §0-LL):**
   2 `update_case` (user-authorized), both HTTP 200 + re-GET MATCH, run 325 untouched, 0 add/delete/section.
   SF-PERM-06 = C29410 (API — Permissions, sec 4090) — added per-role Bulk Receive `accept` BE-enforcement
   matrix (403 for the 4 No roles / allowed for the 7 Yes, matches §9.2). SF-PERM-12 = C30647 (Permissions,
   sec 4084) — appended a plain Rule-24 QA note (edit-part/change-vendor + part add/delete FE-hidden but
   API-possible = accepted PASS; NEW-1/NEW-2). viu_status unchanged; tally UNCHANGED 186 active
   (152/4/21/5/3/1); id-map refs mirrored; deliverables regenerated (import 186 rows, hygiene clean). Audit
   sv8183/testrail-execution-log-optional-edits-2026-07-24.md.
   **PRIOR RESUME 2026-07-24 (CORRECTIVE PUSH EXECUTED + RULE 24 STRENGTHENED; read
   build/simple-flow/PROJECT-STATE.md §0-JJ):** the staged SV-8183 corrective push is now LIVE —
   **SF-PERM-11 = C30646 (VIU-Deviation, SV-8515 FE-exposure) + SF-PERM-12 = C30647 (VIU-Verified,
   PASS per Rule 24) add_case + SF-PERM-03 = C29407 update_case, all HTTP 200 + re-GET MATCH; run
   325 untouched.** id-map 186/186 (0 blanks); deliverables regenerated over 186. **Standing Rule 24
   STRENGTHENED (user ruling 2026-07-24): FE-blocks + BE/API-allows = a PASSED test case (anywhere,
   always); INVERSE (FE exposes what BE blocks) = FE-exposure DEFECT.** §0-II NEW-1/NEW-2 → PASS per
   Rule 24 (no dev ticket); existing 3 Deviations scanned — none match FE-block/BE-allow, none
   flipped. Tally UNCHANGED 152/4/21/5/3/1 = 186.
   **PRIOR RESUME 2026-07-24 (SV-8183 EXHAUSTIVE LIVE RE-RUN, §13a method; NO TestRail writes;
   read build/simple-flow/PROJECT-STATE.md §0-II + source `sv8183/rerun-2026-07-24/FINDINGS.md`
   commit 1a263c8):** all 11 roles reset-verified == §9.2, 0 drift; **NO new permission BUG beyond
   the known 3.** Two NEW Rule-24 flags (FE-hidden but API-possible; accepted-for-now per user
   2026-07-24, NOT bugs): **NEW-1** = `change-item` (edit-part/change-vendor) BE-gated by
   `seeFinancialData` not `vendorOrderManagementCreateAndEdit` per §9.2 → Sales Rep + Office can
   change vendor via API (spec-conformance wrong-atom deviation, no known ticket, AWAITING user
   dev-raise decision); **NEW-2** = part add/delete not BE-enforced for any role (SV-7864
   atom-collapse). Known-3: SV-8515 NOT reproducible now (Receive-Selected path gone + accept 403);
   SV-8516 mostly fixed (change-item 403 for Time Clock; part add/cancel angle persists as API flag);
   SV-8541 not re-driven (endpoints not located; held). **Broad but NOT exhaustive — OPEN
   follow-ups:** part-row kebab on a seeded received special-order part+core; SV-8541
   return/resolve-core endpoints; the /bulk-receive page; Returns/Part-Sales/Vendor pages; the
   Yes-heavy roles (SM/SrSA/Foreman/PM) individually UI-driven. Corrective cases SF-PERM-11/12 +
   SF-PERM-03 tighten authored (commit 53d89a5), TestRail push STAGED not executed. Tally UNCHANGED
   152/4/21/5/3/1 = 186.
   **RESUME 2026-07-24 (SV-8183 report CORRECTED; our 11/11 PASS OVER-CLAIMED):**
   QA (Ayesha) found 3 real coverage gaps our pass missed; live re-verify on clean template roles
   (drift ruled out, Rule 26) confirmed all 3 — **SV-8515** = real FE-exposure defect (View-only user
   reaches editable Bulk-Receive via multi-select "Receive Selected"; BE blocks the actual receive
   `accept`→403; dev Ready-to-Fix; Ayesha overstated the bypass); **SV-8516** = real over-grant now
   FE-fixed (Time Clock ⋮ = only Return) but BE still accepts part edit (`change-request`→200) =
   Rule-24 flag; **SV-8541** = real, pre-existing/spec-interp (`pre-resolve-cores`→201 even for Time
   Clock, §9.4-anticipated, Open for Sasha). 3 corrective cases PROPOSED (not authored): (i) V&O
   View-only "Receive Selected" negative +update SF-PERM-03/C29407; (ii) Time Clock part
   edit/cancel/return negative (Rule-24); (iii) WOL-C&E core-resolve/return negative (pending Sasha).
   Deliverables: `sv8183/SimpleFlow_SV-8183_vs-QA-Issues_Analysis_2026-07-24.md`/`.xlsx`; prior report
   carries a CORRECTION addendum; **lesson folded into build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md §13a**
   (drive every action path + alternate entry points per role; probe BE per granular action; never
   report "all pass" as feature-wide completeness). NO TestRail writes; tally UNCHANGED 151/4/21/5/3=184.
   Read build/simple-flow/PROJECT-STATE.md §0-GG / the CORRECTION block first.
   **RESUME 2026-07-24 (SV-8183 CORRECTIVE CASES AUTHORED — user-approved, staged only, NO TestRail
   writes): read build/simple-flow/PROJECT-STATE.md §0-HH first.** 2 corrective SF-PERM cases authored
   for the QA-found coverage gaps: **SF-PERM-11** (new, no C-ID yet; driver **SV-8515** — V&O View-only
   [Office] can't receive by ANY path; multi-select "Receive Selected" currently EXPOSES editable
   /bulk-receive = FE-exposure defect, dev Ready-to-Fix, BE blocks accept→403; viu_status VIU-Deviation)
   + **SF-PERM-12** (new, no C-ID yet; driver **SV-8516** — Time Clock part ⋮ menu hides Edit/Cancel/
   Change Vendor [pass]; **SV-8516 FE-only gating ACCEPTED for now, NOT a defect** — same edit via API
   `part/change-request`→200 = Rule-24 flag; viu_status VIU-Verified) + **SF-PERM-03 (C29407) tightened**
   to drive BOTH Bulk-Receive entry points. **SV-8541 HELD** (not authored, user ruling). **NEW TALLY =
   186 ACTIVE: 152 VIU-Verified / 4 VIU-Pending / 21 Blocked-Env / 5 awaiting-Milos / 3 Deviation / 1
   VIU-Deviation.** id-map SF-PERM-11/12 = BLANK C-ids (need add_case). Sync STAGED not executed:
   `sv8183/testrail-sync-manifest-corrective-2026-07-24.md` (2 add_case + 1 update_case; run 325 untouched).
   **PRIOR RESUME 2026-07-23 (SV-8183 drift-cells FINISHED + SF-PERM-01 PUSHED): read build/simple-flow/PROJECT-STATE.md §0-FF-CLOSE first.**
   Follow-up (authorized): the 3 drift-blocked Technician cells are now CLEANLY OBSERVED LIVE
   against a verified-clean Technician baseline (role 50bf6a0d re-read = canonical 6 atoms,
   before==after, no drift this window; Rule 26 satisfied). **SF-PERM-02 (C29406)/SF-PERM-10
   (C29414) Technician cell** — WO "Send To Review"/completion cluster ABSENT for Technician
   (only line-level New Line/Complete show = line-edit). **SF-PERM-09 (C29413)** — New Part
   Request dialog for Technician shows only Part Number/Description/Quantity, **sell-price field
   ABSENT** (seeFinancialData gate; corroborated by Admin Parts-tab Sell Price column). Element
   gates now 9/9 clean this run. Evidence: `viu-sv8183-2026-07-23/element-reobserve/`
   (complete-Tech-reset-2026-07-23.png, tech-newpartrequest-dialog-2026-07-23.png, element-matrix.json).
   **SF-PERM-01 (C29405) `update_case` EXECUTED** (page-reachability Expected; BE atom-family
   driver in metadata) — HTTP 200 + re-GET MATCH, title/refs unchanged; manifest = EXECUTED;
   audit `sv8183/testrail-execution-log-2026-07-23.md`. **ONLY TestRail write; run 325 untouched;
   no add/delete/section.** Tally UNCHANGED = 151/4/21/5/3 = 184 (no status changes, metadata-only).
   Prior 0-FF pass (same day): all 11 SF-PERM/SF-REV VIU-Verified; composition 11/11 == §9.2;
   BE atom-FAMILY finding for `POST /api/organizations/settings/change` (clean Parts Manager 200,
   no-settings 403). **Tech baseline = role "Technician" (50bf6a0d), NOT Time Clock User** (Rule 26).
   **Prior RESUME 2026-07-20: read build/simple-flow/PROJECT-STATE.md §'WHAT'S LEFT TO DO' + §0-CC**
   — RETIRE EXECUTED 2026-07-20 (user ruling 2026-07-17): SF-CORE-05/06/09 deleted from
   TestRail (delete_case 3/3, verified gone, audit-logged, run 325 untouched), bodies
   kept locally marked Retired, id-map −3, generators exclude Retired (187→184), all
   deliverables regenerated over 184; **Milos spec-V2.6 question sheet READY to send:
   PO-Questions-Milos-SpecV26_2026-07-17.xlsx/.md** (Q1 S8-R7 leftover cost sentence,
   Q2 Vendors-Expenses surface, Q3 S10-R2 residue; layman + QA-map tabs). Prior pass:
   — spec `_4`/V2.6 APPLIED 2026-07-17: Story-18 pre-resolve-cores (SV-8353) authored
   (+17 new cases: SF-CORE-11..19 [2 API] + SF-RCV-11..13 + SF-VEND-07/08 + SF-POSEL-07
   + SF-BULK-11 + SF-WOP-04 = C29892–C29908), Δ9-Δ15 applied (14 case edits),
   SF-VMIS-06 rescoped (S6-R6 rewritten-to-code — Deviation RESOLVED), SF-QB-09
   rescoped + FINALLY IN TESTRAIL (=C29909; Open-Question resolved; all 187 mapped),
   SF-INV-01/02/03 + SF-BULK-06 re-VIU pending (old-build-Verified; Δ13 Apply-button
   removed / Δ14 $0-only cost — expect build deviations until dev ships);
   3 retire-proposals SF-CORE-05/06/09 (RESOLVED: retired + deleted 2026-07-20).
   TestRail push 2 add_section (4252/4253) +
   13 update_case + 18 add_case, all 200+re-GET-MATCH, audit =
   build/simple-flow/spec-v4-2026-07-17/testrail-update-log.md; **ADVERSARIALLY
   AUDITED CLEAN 2026-07-17** (31/31 live-vs-local MATCH, run 325 + retire
   candidates untouched, tally confirmed across all deliverables; one
   Tracker-header count defect fixed; commits df95b70→a578ef9 + audit fix 4398091);
   requirements.md promoted to V2.6; deliverables regenerated (import 187 rows
   VIU/flag-word-free).
   **STAGING LIVE VIU 2026-07-20 (§0-DD, LATEST):** Simple Flow is now DEPLOYED on
   `app.staging.shopview.com`/`api.staging.shopview.com` (shared d55bc308 org) — the
   Story-18 pre-resolve-cores build is LIVE there (was NOT seedable/built on sv7301). A
   live pass verified **4 cases: SF-CORE-03 (C29315) / SF-CORE-04 (C29316) / SF-CORE-11
   (C29892) / SF-CORE-18 (C29899)** — Resolve-cores wizard step ("Missing Details →
   Resolve cores → Receive parts & invoice"; buttons "OK · Returned"/"Not OK · Keep +
   Charge"; Continue gated 0/1→1/1) + `POST /api/work-orders/{id}/pre-resolve-cores`
   `{cores:[{partRequestId,isCoreOk}]}`→201 `{resolvedCount}` no side-effects. **Two-session
   pass verified 18 cases:** SF-CORE-03/04/07/08/11/12/13/14/16/18, SF-BULK-06/10,
   SF-INV-01/02/03, SF-RCV-13, SF-VEND-08, SF-REV-14 (Story-18 resolve wizard incl.
   required-invoice "Complete & Send to Review" pill order Details→Resolve cores→Receive;
   grouped Bulk Receive at `/bulk-receive?ids=...` via "Receive Selected" — per-vendor
   invoice field no-Apply-button; cost editable only when $0; receive auto-applies core
   decision via `badge_core_resolution` no re-prompt; Not-OK bills a "Core for <part>" line,
   OK doesn't — line-items authoritative, WO totalPrice aggregate lags/inverts). TestRail:
   SF-CORE-03/11/18 update_case 200 + re-GET MATCH, all others no-op (wording already accurate);
   run 325 untouched. Evidence: `build/simple-flow/viu-staging-2026-07-20/`. Seeding works
   (recipe + add-part API `POST /api/work-orders/part/make-request` in PROJECT-STATE §0-DD).
   **3-session pass verified 21 cases total** (added resume-2: SF-VEND-07, SF-POSEL-07, SF-BULK-11
   — vendor changeable via parts-tab select_vendor before receive; part-sale PO type 2 "P-1110"
   appears in PO list + on grouped Bulk Receive). **Tally 184 ACTIVE (187 authored − 3 retired):
   Verified 151 / VIU-Pending 4 / Blocked-Env 21 / awaiting-Milos 5 / Deviation 3 / Open-Q 0.**
   **SF-RCV-05/07 DEVIATION DEFINITIVELY CONFIRMED** (Accept-Delivery Vendor Missing group still at
   TOP, should be BOTTOM per Milos — they KEEP Deviation status; but **bug draft #5 DROPPED — WON'T FILE**
   as cosmetic-only / no functional impact per user 2026-07-20; the vendor-missing-position thread is
   CLOSED, accepted-cosmetic, not filed). SF-CORE-15/17 + SF-QB-09 → Blocked-Env
   (invoiced+unreceived-core state not producible: complete≠invoiced/paid + can't order on completed WO;
   QB not connected). Remaining 4 VIU-Pending: SF-CORE-19 (received-core handle-core), SF-RCV-11
   (return-to-line scroll), SF-RCV-12 (other-vendor exclusion), SF-WOP-04 (Waiting-on-Parts column).
   Outstanding: SEND the
   Milos spec-V2.6 sheet (READY), Story-18 re-VIU backlog (needs SV-8353 build +
   dev-seeded core), 5 unanswered Milos Qs, run-325 reconcile. (Receive-screen
   vendor-missing-position bug draft #5 DROPPED — won't-file, cosmetic, user 2026-07-20.)
   **STATUS: STAGING LIVE-VIU DONE + ADVERSARIALLY AUDITED CLEAN 2026-07-20 (§0-EE;
   tally 184: 151/4/21/5/3 reconciles across all deliverables, live TestRail matches,
   run 325 untouched, retired SF-CORE-05/06/09 confirmed gone, no secrets) + RETIRE
   EXECUTED + MILOS V2.6 SHEET READY 2026-07-20 (on top of SPEC `_4`
   V2.6 applied + audited clean 2026-07-17 + the complete VIU process + spec `_3`/design
   `_4` + Milos Round-3). PROJECT-STATE.md = canonical resume doc (read first).** Detail: full build-accurate
   wording+VIU pass (all 163, 200/200) + V2.4 Δ1-Δ4 (+ SF-VEND-06=C29442) +
   reviewer≠completer DESCOPED (self-review allowed when role holds Mark Reviewed; BUG-5
   dropped) + spec-relevance reconciliation + run-325 (Ayesha) reconciled + the
   2026-07-14 VIU grind (drove VIU-Pending to 0) + the **spec `_3`/design `_4` pass**:
   Δ5 auto-complete (Story 16 R12/R13 = SV-8303) authored **7 new SF-AUTO cases
   C29461–C29467** (sections 4092 UI / 4093 API; 01/02/03/05/07 Verified, 04
   [delete-lines API 500] + 06 [UI clock-out] Blocked-Env), Δ6 flipped SF-SET-10
   Verified (resolves SV-8303/run-325), Δ7 S10-R2 first-class-part DEPRECATED
   (SF-PNFIX-02/03/06 + SF-QB-08 rescoped → Verified), design `_4` flipped SF-CORE-03
   (core un-skippable at completion; core BEHAVIOR still Blocked-Env — needs a
   dev-seeded vendor-sourced core). **TestRail push: 18 update_case + 7 add_case + 2
   add_section, all 200/200, no writes to run 325.** Roles matrix re-derived —
   **Technician NOT drifted on sv7301.** Stories 7/8/9/14/16-auto CONFIRMED BUILT;
   DEV-NOT-BUILT = 0. **ALL 184 active current in TestRail** (SF-QB-09 = C29909,
   2026-07-17; SF-CORE-05/06/09 retired/deleted 2026-07-20).
   **Deviations (3):** SF-SET-03 (no Create Purchase Orders toggle) + SF-RCV-05/07
   (Vendor-Missing group at TOP on the Receive screen, should be BOTTOM). SF-VMIS-06's
   old "needs vendor report" deviation was RESOLVED 2026-07-17 by the spec `_4` S6-R6
   rewrite (rescoped → Blocked-Env). Build findings OBS-6 (Part-History 500) +
   OBS-7 (universal disabled-Complete gate on unapproved line, expected). **WAITING
   ON:** Milos Round-3 (8 awaiting-Milos: SF-SET-08/COMP-06/RCV-05/RCV-07/REV-11/
   REV-15/UX-04/QB-02 + earlier MILOS set; deliverables ready: PO-Questions-Round3.xlsx,
   SimpleFlow_Bugs-for-Milos-Confirm.xlsx, SimpleFlow_Bug-Drafts.xlsx); **25 Blocked-Env**
   (§0-ZZ/§0-AA): QuickBooks not connected (9, needs QB-connected company + human in QB),
   special-order vendor-sourced cores not creatable — needs dev-seeded core (SF-CORE
   set), invoiced/paid WO not drivable (3), merge auto-consolidates (2), VIN-less asset
   (1), SF-AUTO-04 (API-500 fix) + SF-AUTO-06 (UI clock-out) (2). Run-325 Ayesha status
   cross-referenced in `run325-status-map-2026-07-14.md`. **Doc self-contradiction to
   flag for Milos:** spec `_3` strikes S10-R2 but Story-10 AC bullets + technical
   guardrails still describe first-class-part creation. Bug drafts (TICKET 2-5) unfiled
   (no Atlassian in this env); OBS-6 + SF-AUTO-04 API-500 for dev (SF-VMIS-06 dev-route
   dropped 2026-07-17 — spec rewritten to match code). SF-QB-09 mapped 2026-07-17
   (= C29909) — the old unmapped-follow-up is CLOSED.
   Pre-existing residue: 3 QA WOs left Complete (reversible in-app only).
   **qb/sv7301 env is SHARED — re-read settings before runs, restore byte-identical
   after** (node-fetch-ignores-proxy gotcha → use undici ProxyAgent). All detail
   (deltas, blockers, env, how-to-resume) in PROJECT-STATE.md = canonical resume doc.
   *TestRail import (INTERIM):* `testrail-import/simple-flow-v1-testrail-import.csv`
   (+ `.xlsx`), all 169 mapped cases via `build/simple-flow/gen_import.py`; **VIU-word-free
   and feature-flag-free by user rule** (settings-driven, so settings preconditions
   are kept); INTERIM pending post-VIU + dev-answer finalization (see
   `build/simple-flow/RESUME-STRATEGY.md`). Permissions: REQUIRES definition (no role
   matrix) — see `build/PERMISSIONS-ASSESSMENT.md`.
   **Simple Flow contradiction rule:** when two inputs conflict (spec doc vs answer
   sheet vs design), the MOST RECENT update is authoritative (last-update-wins). The
   spec `_3` (de-facto V2.5) doc + 2026-07-14 design `_4` bundle are the latest and
   override the earlier V2.4 doc / round-1 answer sheet where they disagree (e.g. the
   V2.4 note #6 first-class-part requirement was REVERSED by spec `_3` Δ7).
4. **Global Search project** — Global Search v2 (ShopView App).
   **⏸️ STATUS: POSTPONED 2026-07-27 (user ruling).** Detail/resume docs below are
   kept for the record; not active work. **Canonical spec
   (Confluence, confirmed 2026-07-16):**
   https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements+Development+Plan
   (Atlassian-SSO login-walled — reference pointer only; do NOT fetch; spec content
   already ingested from the exported .doc).
   **Figma:** https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12053-65992
   **PO: Branko** (confirmed 2026-07-16; known as Branko, full name TBC — never mix PO
   attributions: Global Search=Branko, Fees&Discounts=Chris Ward, Simple Flow=Milos).
   **⚠️ Epic/Jira key: NOT AVAILABLE YET — ASK THE USER for it when VIU begins** (user
   doesn't have it as of 2026-07-16; do NOT invent).
   **CANONICAL STATE DOC (read first for resume):**
   `build/global-search/PROJECT-STATE.md` — single authoritative snapshot (status,
   case inventory, deliverables index, open questions, env/access TBD, how-to-resume).
   **STATUS: CASES AUTHORED 2026-07-16 (86 cases/15 sections, adversarial-reviewed
   CLEAN, import ready VIU-word-free/flag-free); TestRail push PENDING permission; VIU
   pending feature on QA; PO=Branko; Epic key TBD (ask at VIU); OQ-3 open. Canonical
   resume doc: build/global-search/PROJECT-STATE.md.**
   **2026-07-31 OWNERSHIP RULING (Branko, via the Filters Q6 sheet): the ⌘K/pop-up
   "Search or ask a question" palette is tested under GLOBAL SEARCH, not Filters — so the
   9 retired Filters palette cases (FLT-SRCH-01..09, blank C-ids, never pushed) have their
   coverage land HERE on resume; "Ask a question" is out of the FILTERS PRD only, so OQ-3
   (AI in Global Search V1?) STAYS OPEN. See PROJECT-STATE.md §0.0.** Spec fully
   ingested → `build/global-search/requirements.md` (§1–§11: 6 searchable entity types
   [Work Orders, Customers, Assets, Parts, Vendors, Part Sales], ⌘K/K spotlight
   palette, fuzzy match [trigram + Damerau-Levenshtein + Double Metaphone; identifier
   fields exact-only], relevance ranking, recent/persisting search, hover
   quick-actions, keyboard nav, role-based result scoping, `GET /api/search`, 5-phase
   dev plan, feature-flagged rollout). Design capture COMPLETE **10/10 Figma
   screenshots** → `build/global-search/design-notes.md`; **2 states OUT OF SCOPE (NOT
   authored): AI search-all + header-component proposal.** AI/"ask a question"
   placeholder implies AI but AI is OUT OF SCOPE for V1 (OQ-3 still open — confirm
   whether the placeholder ships in V1). Deliverables: `cases/cases-A..D-*.json` (86),
   `coverage-matrix.md` (every in-scope spec req + Figma state → case IDs, out-of-scope
   items + ~20 VIU-confirm placeholders), `gen_import.py` +
   `testrail-import/global-search-v2-testrail-import.csv`/`.xlsx` (CANONICAL location +
   format — PURE 1:1 match to the fees-discounts / simple-flow imports: 8 named columns
   + 2 trailing blank columns, header byte-identical, NO ID columns; traceability via
   `testrail-id-map.csv` per Rule 8, same as the other two projects;
   VIU-word-free + feature-flag-free; API cases in an "API — <leaf>" section per Rule 4;
   the old bespoke
   `build/global-search/GlobalSearch_TestRail-Import.*` was superseded/removed 2026-07-16),
   `testrail-id-map.csv` (all 86 IDs, blank C-ids),
   PROJECT-STATE.md. **No TestRail writes without explicit user permission.** Reuse
   shared infra (BUILD-ACCURATE-WORDING-VIU-PROCESS, SPEC-RELEVANCE-RECONCILIATION,
   TESTING-RUNBOOK, harness/TestRail patterns). Per Standing Rule 11, ASK which
   process(es) to run before the VIU pass. Still open: OQ-3 (AI scope), OQ-4 (Epic key
   — ask at VIU), OQ-5 (QA env/flag status).
5. **Filters project** — Filters / Work Order list filtering (ShopView App): a
   persistent multi-criteria filter bar on the Work Orders page (Status / Customer /
   Lead Technician / Service Advisor / Asset on Site chips; multi-select + search;
   Clear filters / Clear selection; collapse/expand toggle; per-user persistence;
   URL shareable state; tab behaviour incl. Status hidden on Estimates/Completed;
   mobile horizontally-scrollable chips + bottom-sheet dropdowns).
   **Canonical spec URL (Confluence): TO CONFIRM — user provided the exported .doc
   2026-07-16; ask for the page URL** (when obtained: Atlassian-SSO login-walled —
   reference pointer only, do NOT fetch; spec content already ingested from the
   exported .doc).
   **Figma (canonical design pointer):**
   https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-23562
   ("Work Order Explorations 20.4.2026"; spec header also links node 11817-27678;
   per-story node links in requirements.md).
   **PO: Branko** (full name TBC — same PO as Global Search; never mix PO
   attributions: Filters=Branko, Global Search=Branko, Fees&Discounts=Chris Ward,
   Simple Flow=Milos).
   **✅ Epic/Jira key: SV-8785 "Filters" — FOUND + VERIFIED LIVE 2026-08-04.** This
   **SUPERSEDES** the long-standing "no epic exists / all 170 SV epics enumerated, none is
   Filters" finding, which was **true on 2026-07-31 and went stale within hours**: the epic
   was created **2026-07-31T07:51:51-0500 = 12:51 UTC**, AFTER that enumeration ran, and
   Branko linked it into the spec at 13:07/13:10 UTC (Confluence v13→v14 — the ONLY content
   change in either version). Verified `GET /rest/api/3/issue/SV-8785` → HTTP 200, type
   **Epic**, hierarchy level 1, status Open. **14 children SV-8786…SV-8799 map 1:1 BY TITLE
   AND IN ORDER onto the spec's 14 stories, so `Story n → SV-(8785+n)`** (Rule-37 Tier-1
   check, two independent ways: `parent=SV-8785` → 14, `"Epic Link"=SV-8785` → 14, same keys,
   no paging remainder). **All 110 cases now carry a real ticket in `refs`** — 66 single-story
   keys + 44 the epic marked `[epic]` for cross-cutting/unanchored cases (the compact marker
   is deliberate: TestRail rejects a `refs` comma-entry over 248 chars, and these already run
   to 248) — pushed + byte-verified 2026-08-04 and mirrored into a **NEW `refs` column** on
   `build/filters/testrail-id-map.csv` (110/110). **Rule 20 is satisfiable for Filters for the
   first time.** **SV-8795 (Filter Persistence) and SV-8796 (URL State) are already `Ready for
   QA`** — the first sign a QA env may be near. Evidence:
   `build/filters/provenance-2026-08-04/SOURCE-CURRENCY.md`. **LESSON (Rule 31): a
   proven-absence finding has a shelf life — re-check it, do not cache it.**
   **CANONICAL STATE DOC (read first for resume):** `build/filters/PROJECT-STATE.md`
   — single authoritative snapshot (status, deliverables index, open questions,
   env/access TBD, how-to-resume).
   **STATUS 2026-07-27 (SUPERSEDED — OPTION A design-level authoring): 43 NEW
   Parts/Reports/page-search cases AUTHORED, VIU-Pending, NO TestRail writes** —
   Parts 12 (FLT-PARTS-01..12), Reports 22 (FLT-RPTS-01..22), page-search 9
   (FLT-SRCH-01..09; every one carries an OVERLAP note = also the Global Search
   project, reconcile before push). Written to the captured designs (chips +
   columns + on-screen labels); all behaviour flagged "pending Branko's product
   write-up" (design-only, not live-verified). **New total 122** (79 existing
   C29557–C29635 + 43 new blank C-ids → need add_case). Import + id-map regenerated
   over 122, hygiene re-verified (header byte-identical, 0 VIU/flag words, 79 C-ids
   re-merged). **Branko PO-questions doc READY:
   build/filters/PO-Questions-Branko-PartsReports-2026-07-27.md/.xlsx** (7 product
   Qs: PRD request, which chips apply, option lists, new filter-type behaviour,
   WO-parity, page-search scope vs Global Search + AI, per-role filters). NEXT =
   Branko PRD/answers → SPEC-RELEVANCE-RECONCILIATION + build-accurate wording + live
   VIU on the 43 new cases → authorized add_case push. Canonical resume doc:
   build/filters/PROJECT-STATE.md (2026-07-27 header).
   **STATUS 2026-08-06 (LATEST — VLAD'S GAP REVIEW WORKED: THE SUITE IS 114 CASES, READY TO AUTOMATE
   94, AND THREE CLAIMS BELOW ARE CORRECTED. Resume
   `build/filters/vlad-gap-review-2026-08-06/{ROOT-CAUSE,ROW-BY-ROW,SOURCE-CURRENCY,NEW-CASES,
   RECHECK-QUEUE,DELIBERATE-DECISIONS,QUESTIONS-FOR-BRANKO,testrail-execution-log,
   STAGED-RUN-352-SYNC}.md` → `build/filters/PROJECT-STATE.md`; commit `6a51f273`):**
   **🔴 THE ROOT CAUSE, IN ONE LINE: WE VERIFIED THAT THE 110 CASES WE HAD WERE CORRECT; WE NEVER
   VERIFIED THAT 110 WAS THE RIGHT SET.** The requirement→case map (`build/filters/coverage-matrix.md`)
   was last written **17 July** — **81 rules / 79 cases** — while the spec now carries **132 rules**,
   and the map has **ZERO entries for Stories 13 and 14**, the two largest sections, added **26 July**.
   **Rule 43 already required that map to be RE-DERIVED every spec version, and it was simply never
   run** (not for v12, v18 or v19). Three of the genuine gaps live in exactly that unmapped territory.
   Full five-whys, with the recurrence-vs-new analysis: `vlad-gap-review-2026-08-06/ROOT-CAUSE.md`.
   **⚠️ A REQUIREMENT→CASE RE-DERIVATION FOR FILTERS IS NOW AN OUTSTANDING ASK AWAITING THE QA LEAD'S
   GO-AHEAD — IT HAS NOT BEEN DONE and must not be described as done.**
   **THE HONEST SCOREBOARD on Vlad's eleven rows (twelve, because one splits in two under Rule 45(e)):
   he was RIGHT on 6 · MISTAKEN on 5 · and 1 was never a gap** (row 7, a deliberate HOLD on the QA
   lead's own *"lets wait for Brankos PRD"*). **AND 4 OF THE 5 HE GOT WRONG ARE STILL OUR FAULT** — the
   coverage he could not find sits **mid-list inside cases titled after a different rule** (point 4 of
   five, point 6 of seven), and **there is no published requirement→case map for him to check**, so his
   only option was reading 110 case bodies. **That last point is the actionable one:** publishing the
   map turns an outsider's review from archaeology into a one-page check.
   **CORRECTION 1 — "RAW MARKUP IS NOW 0 OF 110" (claimed 2026-08-05, below) IS NOT TRUE OF THE LIVE
   SUITE.** A live census on **2026-08-06** found **14 of the 114 cases still showing raw markup to the
   tester** (15 before one was repaired in passing): C29558, C29560, C29561, C29562, C29563, C29564,
   C29565, C29583, C29584, C29585, C29586, C29587, C29588, C38877, C38882 — and **11 of the 15 were
   last written by our own 5 August pass**, so this is ours, not drift. **REPAIRING THEM IS NOT YET
   AUTHORISED** — it is a TestRail write and its own pass (Rule 6).
   **CORRECTION 2 — READY TO AUTOMATE IS 94, NOT 95, AND THE SUITE IS 114 CASES, NOT 110.** Live
   markers read **79 `READY` + 15 `READY - EXPECT FAIL` + 20 `HOLD` = 114**, and **the gate passes both
   ways: 79 + 15 = 94, and 114 − 20 = 94.** Four new cases were authored (**C43560–C43563**), taking
   110 → 114. **And the honest detail: the old figure of 95 was ALREADY ONE TOO HIGH** — it was counted
   as 81 + 14, but the live census showed **80 READY plus C29558 carrying NO MARKER AT ALL** after
   another author's edit, so the true figure at the end of the 5 August pass was **94**.
   **CORRECTION 3 / SOURCE FACTS — BOTH THE SPEC AND THE BUILD MOVED ON 2026-08-06:** the spec went to
   **Confluence v19 at 11:48:47Z**, the whole diff being **one new requirement, `S1-R3`** (chips carry a
   leading type-icon; SV-8986), **so all 110 pre-existing `refs` now pin a superseded `[spec v18
   2026-08-04]`** — and note that **Ahtasham had already covered it 21 minutes BEFORE Branko published
   it**, rewriting C29558 at 11:27:20Z. The build redeployed to **`v3.4.2-280ca5a`** (last-mod Thu 06
   Aug 2026 09:37:49 GMT, etag `720a7f1f…`), **superseding the `v3.4.2-d00239b` recorded throughout the
   blocks below**, so **every Filters verdict now predates the build that is running** — under **Rule
   60** that is the ORDINARY CONSEQUENCE of a branch that is never declared final, not an alarm: it
   touches layer 1 (labels/navigation), layer 2 (the verdict) and the `HOLD` half of layer 3, and
   invalidates **no** expectation, because expectations come from documents (Rule 57).
   **⚠️ Rule-49 queue OPEN (`vlad-gap-review-2026-08-06/RECHECK-QUEUE.md`, 9 rows) — the branch is NOT
   declared final, so all 114 verdicts remain PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 ~21:35 UTC (SUPERSEDED for the three claims corrected above — THE FULL
   LIVE PASS: ALL 110 CASES DRIVEN LIVE, READY TO
   AUTOMATE 95. Resume `build/filters/READINESS-2026-08-05-FULL-LIVE.md` →
   `build/filters/full-viu-2026-08-05/{FINDINGS,CHANGES-MADE,testrail-execution-log,RECHECK-QUEUE,
   DELIBERATE-DECISIONS,SOURCE-CURRENCY,FILED,API-ASK,RESUME}.md` → `build/filters/PROJECT-STATE.md`):**
   **all 110 of the 110 cases were OBSERVED LIVE in this one pass — 0 carried forward** — on build
   **`v3.4.2-d00239b`** (`index.html` last-modified Tue 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41…`,
   read at 19:53Z, 21:00Z and 21:34Z and **byte-identical by sha256 all three times**, so nothing
   redeployed under the pass). Expected behaviour came from the documents only (Rule 57): spec at
   **Confluence version 18**, epic **SV-8785** and its stories, and Branko's recorded answers.
   **OUTCOMES: PASS 81 · DEVIATION 14 (every one ticketed) · HOLD 15.** **READY TO AUTOMATE = 95**, and
   **the arithmetic gate passes two ways: 81 READY + 14 EXPECT-FAIL = 95, and 110 − 15 HOLD = 95.**
   **⚠️ CORRECTED 2026-08-06 — THE 95 WAS ONE TOO HIGH EVEN THEN (a live census found 80 READY, not 81,
   because C29558 carried NO marker after another author's edit) and the suite is now 114 cases:
   THE FIGURE IS 94. Superseded wording kept above; see CORRECTION 2 in the 2026-08-06 block.**
   **The figure went DOWN from 100 to 95 and every one of the five is explained** — HOLD rose 10 → 15
   (C29615 needs a second login; C38880 and C38881 assert behaviour no source documents or need an
   account that no longer exists; C38891 and C38901 have preconditions the part-finished page-search
   rollout cannot meet). **A lower honest figure is the point of the exercise.** **ALL 110 `refs` MOVED
   OFF THE STALE TRAP NUMBER** — every entry now pins **`[spec v18 2026-08-04]`** instead of
   **`[spec v1.6 2026-07-28]`**, so Rule 42's version-pin mechanism can finally fire, and no entry
   exceeds the 248-character limit. **RAW MARKUP IS NOW 0 OF 110** — the ten cases showing raw
   `<ol>`/`<li>` to the tester (C29558, C29559, C29571, C29574, C29589, C29595, C29608, C29616,
   C38881, C38904, in all three text fields) are repaired; they were in the pre-write snapshot, so they
   **predate this pass**. **⚠️ THIS CLAIM IS UNTRUE AND IS CORRECTED 2026-08-06: a live census found 14
   of 114 cases still showing raw markup to the tester, 11 of them written by THIS pass. Superseded
   wording kept above; see CORRECTION 1 in the 2026-08-06 block. Repair NOT yet authorised.**
   **WRITES: 110 × `update_case`, every one HTTP 200 + byte-verified MATCH, 30
   fields compared each, 0 mismatches, 0 collateral changes**, with **all four fields on every payload**
   (`custom_preconds`, `custom_steps`, `custom_expected`, `refs`) because TestRail re-renders any
   omitted text field; **0 add / 0 delete / 0 section / 0 run writes; no result logged anywhere.**
   **Run 352 PROVEN UNDAMAGED** — `include_all` still false, 110 tests, test-id and case-id sets equal
   both directions, **all 458 result records present BY ID with 0 graded fields changed and 0 new
   results during the write window**; the 458 moved `case_refs` values are the **declared read-time
   echo** of the refs edit. **Untouched-proof is BY CONTENT, never by `updated_on`** — a sibling pass
   found 14 Report Suite cases whose text changed while the timestamp stood still. **Rule 59 satisfied:
   sources read at pass start 19:53Z and RE-READ at write start 21:34Z, verdict UNCHANGED.** **ONE
   TICKET FILED: [SV-8912](https://shopview.atlassian.net/browse/SV-8912)** — Story Defect · parent
   **SV-8798** (the owning story, itself a child of the epic) · priority **Low** · `relates to`
   SV-8798 · Open · 11 field checks read back all PASS · duplicate-searched with four JQL queries
   first · test data named (**Bahampton Holdings**, 6 work orders, with what was ruled out).
   **NOTHING WAS CREATED OR DELETED ON THE BRANCH** — no ZZAUTOTEST data exists from this pass because
   none was ever needed; every data state the 110 cases require already existed and was used read-only.
   **The 15 HOLDs are waiting on four things, and the four rows total exactly 15:** Branko's
   Parts/Reports product write-up (**10** — the bars ARE built, nothing documents what they should do) ·
   a second test login on this branch (**2** — C29615, C38895) · the page-search rollout finishing
   (**2**) · an account whose filters were saved before the redesign (**1**).
   **🔴 COVERAGE-COMPLETENESS IS *NOT* ESTABLISHED, AND FILTERS MAY NOT BE DESCRIBED AS COMPLETE
   WITHOUT THAT QUALIFIER.** This pass verified all 110 cases we **have**; it did **not** re-derive
   whether **110 is the right set** — the requirement→case direction Rule 43 requires. **Vlad (the
   automation engineer) has raised an ELEVEN-ROW requirement-side gap table**, transcribed and queued
   at **`build/filters/vlad-gap-review-QUEUED.md`** and tracked as register row **F9**. **Nothing has
   been analysed, checked or verified on it; no TestRail or Jira call was made.** It is queued on the
   QA lead's own instruction, verbatim: *"But do that after everything else has ben done."* **⚠️ NO
   LONGER TRUE — the review WAS worked on 2026-08-06 (all twelve rows verdicted from documents; see the
   2026-08-06 block above and `build/filters/vlad-gap-review-2026-08-06/`). Kept as the record of where
   the 5 August pass stopped.** The rows
   span `S9-R2/S9-R3`, `S11-R7`, `S10-R2`, `S13-R19`, `S13-N4`, `S14-R6`, Parts views, the Reports
   date-range URL contract, `R3 Q5` parity, `R3 Q5` single-range, and mobile imported-exclusivity —
   and **row 1 is the sharpest: it alleges our cases assert the REJECTED Status-chip behaviour rather
   than the DECIDED one, which would be a Rule-57-class defect and not merely a gap.** Four rows name
   cases that already exist (C38896, C38908, C38882, C38877), so those are PARTIAL-coverage claims
   needing both texts quoted side by side (Rule 45(e)) before we agree or disagree.
   **⚠️ Rule-49 queue OPEN (`full-viu-2026-08-05/RECHECK-QUEUE.md`) — the branch is NOT declared
   final, so all 110 verdicts are PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 14:25 UTC (THE FINAL-CHECK PASS: THE BUILD IS NO LONGER TREATED AS A
   SOURCE OF EXPECTED BEHAVIOUR, AND THE 8 PHONE CASES ARE FINALLY OBSERVED; resume
   `build/filters/expected-behaviour-audit-2026-08-05.md` then `build/filters/final-viu-2026-08-05/FINDINGS.md`):**
   the QA lead found **FLT-BAR-01 = C29557** stating what the build does instead of what the spec
   requires — *"I am shocked to see that how come you considered the Build behavior as the expected
   behavior?"* — and **he was right**. An audit of **all 110** (committed BEFORE any repair) classified
   every case: **A=5 build-derived over a documented requirement · B=0 spec silent · C=104 legitimate ·
   D=1 over-specified**. The five all carried *"Known and accepted: … The product behaves this way **on
   purpose for now. Do not raise this as a new problem.**"* over a requirement the PRD states plainly —
   **C29557 vs S1-R1, C29602 vs S1-R5, C29606 vs S8-R3, C29607 vs S8-R4/R5, and C38899 whose waiver was
   about a screen that case does not even test.** **Nothing supported "on purpose"**; the tickets behind
   them had merely been *closed*, and **a closed ticket is a decision about whether to fix, never an
   amendment to the spec.** **Class B is ZERO**, so every one had a documented requirement to return to
   and **none needs Branko**. **SV-8843 and SV-8847 were closed OBSOLETE under OUR OWN shared account**
   (4 Aug 21:41:31 / 22:02:41 −0500 — Rule 53's corollary), and **Ahtasham had independently filed
   [SV-8876](https://shopview.atlassian.net/browse/SV-8876) at 06:17 today quoting C29557's waiver note
   back at us — he found it eight hours before we did** (untouched, Rule 38; ~~it is Branko's question~~ —
   **CORRECTED 2026-08-06: Ahtasham CLOSED IT HIMSELF as Done on 5 August at 08:38:16−0500, so it was never
   Branko's to answer; see the corrected OUTSTANDING line further down this entry, which also records that
   his closing comment says he edited OUR case C29557**).
   **A second sweep answered his follow-up ask** (*"steps correctly VIU'd but the expectation quietly
   changed in the same edit"*): 26 commits replayed comparing steps against the **assertion body only**
   → **16 both-changed, 14 legitimate label work, 2 genuine reversals both driven by a document** (C38882
   by Confluence v18 published the previous evening; C29609/C29610 by S9-R2/S9-R3 superseding Branko's own
   17 July answer). **The five waivers were NOT camouflaged — steps byte-identical across the introducing
   commit.** **The reusable tell: if the new expectation cannot be quoted back to a document, the case has
   been disarmed.** **A FRESH SIGN-IN ARRIVED, so THE 8 PHONE CASES ARE SETTLED** at **390 × 844 touch**:
   the **combined "All Filters" sheet defers correctly** (two ticks fired **ZERO** list requests, address
   bar untouched, the button then applied both), a **single filter's own sheet does NOT** (tapping *Paid*
   changed the URL at once, the sheet closed, **no Apply button anywhere in the document**) — covered by
   **SV-8875**, so **nothing filed**; and **THE BUTTON'S EXACT LABEL IS `Apply Filters` WITH A CAPITAL F**
   (`data-test-id="apply_filters"`) while the spec writes *"Apply filters"*. **THREE CLOSED TICKETS STILL
   REPRODUCE:** **SV-8843** — measured tabs y81–121 vs bar y86–116, **flex siblings in one row**, so the
   bar is beside the tabs — **but its own claim "collapsing frees no space" is WRONG** (collapse moved the
   table y184→y144 and hid all 5 chips, so **S1-R5 PASSES** and only C29557 deviates); **SV-8847** — both
   halves, though **"clearing filters does not clear the query" PASSES**; **SV-8845** — **still reproduces
   and worse: on a phone EVERY filter link is ignored and `filters[0][value]=estimate` is sent instead**
   (proven on declined/paid/imported, 30 Estimates each) while the chips read *"Status (1)"*, and the same
   link on desktop correctly returns 7 Declined. **Closed OBSOLETE by Ahtasham this morning; NOT reopened
   — the QA lead's call, and our recommendation is that this is the one worth reopening.** **110
   `update_case`, every one HTTP 200 + byte-verified MATCH, 28 fields each, 0 mismatches, one write per
   case; 0 add / 0 delete / 0 section / 0 run writes; NO result logged anywhere.** **ALL 110 provenance
   lines now name the spec at CONFLUENCE VERSION 18** (the in-body *"1.6"* is the Rule-31(a) trap), and
   **16 EXPECT-FAIL cases no longer open "as per the build tested on…"** — literally false when the build
   fails the requirement. **MARKERS on all 110, read back live: READY 82 + READY-EXPECT-FAIL 18 + HOLD 10
   = 110 → READY-TO-AUTOMATE 100** (was 93: +8 phone, −1 for C38882 correctly moving to HOLD; the
   arithmetic gate holds). **⚠️ A NEW TESTRAIL NORMALISATION, FOUND THE HARD WAY: `update_case`
   RE-RENDERS ANY TEXT FIELD YOU OMIT FROM THE PAYLOAD through its HTML pipeline** — it wrapped
   `custom_preconds` and `custom_steps` in `<p>` and turned `\n` into `\r\n` on write 1 of 110; **a field
   sent explicitly is stored verbatim.** The byte-check caught it on case 1, **the batch STOPPED as Rule
   50 requires**, the fields were restored byte-exact, and every later payload carried all three text
   fields. **This matters here because this project shows markup LITERALLY to the tester** — same class as
   this morning's raw `<ol>`/`<li>`. **BELONGS IN `build/APP-ACTIONS-PLAYBOOK.md` §J — not edited from
   that worker, flagged in the register as F4.** **RUN 352 PROVEN UNDAMAGED** — include_all still false,
   110 tests, test-id and case_id sets equal both directions, **438 result records before and after with
   0 missing BY ID**, counters unchanged 36 Passed / 2 Failed; **the only field that moved is `case_refs`
   on 10 records, traced to exactly C29609/C29610, the only two cases whose `refs` we edited — a DERIVED
   read-time echo, same class as the declared `case_title` echo**; no graded field moved on any of the 438;
   Ahtasham logged nothing during the write window. **FOUR COUNTS live 110 · local 110 · id-map 110 ·
   import 110, set-equal BOTH directions**; id-map 0 blanks, refs 110/110, header byte-identical; shredding
   guard **PASSED** and independently re-checked; import header sha256 identical to all five peers.
   **0 deletions, 0 retirements — `delete_case` is irreversible and nothing earned it; the 27 July-retired
   cases and the 9 FLT-SRCH palette cases were NOT resurrected.** **QUEUES: `cleanup-2026-08-05/RECHECK-QUEUE.md`
   and its `PENDING-LIVE-CHECK.md` are CLOSED** (all 8 phone rows observed); `recheck-2026-08-05/` is
   banner-marked SUPERSEDED but **still OPEN**; **`final-viu-2026-08-05/RECHECK-QUEUE.md` is the live OPEN
   queue.** **HONEST LIMITS: 29 of the 110 were driven live THIS pass, not all 110** — the other 81 carry
   forward from the 04:20–04:53Z re-check **on the same build marker**, each labelled as such in
   `FINDINGS.md`; and **the branch is still NOT declared final, so every verdict is PROVISIONAL.**
   **OUTSTANDING: reopen SV-8845? (recommended) · ~~Branko owes SV-8876~~ **CORRECTED 2026-08-06 — SV-8876
   IS NOT BRANKO'S TO ANSWER AND IS NOT OUTSTANDING: it is CLOSED.** Read live 2026-08-06: type **Task**,
   **status Done**, resolution Done, resolved **2026-08-05T08:38:16−0500**, parent SV-8785, reporter
   **Ahtasham Amjad — who closed it himself**, verbatim: *"closing this as it was a gap with test case ,
   I've updated the test case here >>…/cases/view/29557 And created a story defect >> …/browse/SV-8883 as
   the build is not behaving as per PRD"*. **The old claim is kept struck-through because a
   silently-erased wrong claim is how a session re-asks a question a source has already answered — the
   exact embarrassment this workspace has had once.** **The half that IS still Branko's** — did he want the
   filter buttons on one row, in which case the developer job should be cancelled? — is **Filters item 5**
   on `build/filters/questions-2026-08-06/`. · a second test login for C29615 ·
   the branch declared final · the playbook §J note · Branko's Parts/Reports PRD.**
   **⚠️ AND IN THAT SAME CLOSING COMMENT AHTASHAM SAYS HE EDITED OUR CASE
   [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) (recorded 2026-08-06 under Rule 38).**
   Recorded as a FACT, **reported and NOT acted on** — we do not touch another author's cases and, by the
   same rule, ours are not his to edit. **This one needs the QA lead's eye specifically**, because C29557
   (FLT-BAR-01) is **the case at the centre of the whole expected-behaviour correction** — the one whose
   *"the product behaves this way on purpose for now"* waiver started the Rule-57 audit, and the one whose
   waiver note Ahtasham quoted back at us in SV-8876. **We do not know what he changed**: no before/after
   snapshot of his edit exists, and TestRail's `updated_by`/`updated_on` record only the LAST writer, which
   our own later passes have since overwritten. **So the honest position is that C29557 has been edited by
   someone else at least once and the change is not reconstructable from what we hold** — the QA lead's
   call on whether to ask him what he altered.
   **PRIOR STATUS 2026-08-05 12:30 UTC (CLEANUP PASS: 25 CASES REPAIRED, ALL BYTE-VERIFIED; resume
   `build/filters/cleanup-2026-08-05/` then `build/filters/READINESS-2026-08-05.md`):** build confirmed
   by us at **both ends** — `v3.4.2-d00239b`, last-mod Tue 04 Aug 22:51:02 GMT, etag `b9ab1d41…`,
   **identical at 11:59:30Z and 12:20:02Z down to the sha256 of `index.html`**, so no redeploy under us.
   **33 `update_case` over 25 distinct cases in two passes, every one HTTP 200 + byte-verified MATCH,
   28 fields compared each, 0 mismatches; the 85 untouched cases proven byte-identical INCLUDING
   `updated_on`/`updated_by`; 0 add / 0 delete / 0 section / 0 run writes.** **(1) THE 8 PHONE CASES —
   `SV-8825 IS ANSWERED AND CLOSED`:** Branko commented **2026-08-05T05:18:22-0500** *"This is updated in
   the filters prd, I'm closing it."* and closed it Done — read live by us, not taken on trust. Spec
   **Confluence v18** rules it (**§4 Key Decisions** + **S12-R6**, both quoted verbatim in
   `SOURCE-CURRENCY.md`): a phone applies **only on tapping "Apply filters"**. The false
   *"DO NOT AUTOMATE YET … the question is open as SV-8825"* line is **GONE from all 8**, and
   **FLT-MOB-04 = C29624 was REVERSED** (it asserted the opposite of the ratified spec) with a **Rule-56
   divergence sentence**; the other 7 got a **confirmation** citation only, per Rule 56's honesty half
   (**no divergence sentence where nothing diverged**). **S12-R6 covers a SINGLE filter's sheet, not just
   the combined one** — the chain is S12-R2's *"one exception (see S12-R5)"*, a **stale cross-reference**
   left by his own **v17** renumbering (*"deferred-apply requirement renumbered to S12-R6"*), so
   **S12-R2's "see S12-R5" is a spec defect Branko still owes**. **(2) NO DEFECT FILED — it already
   exists:** **[SV-8875](https://shopview.atlassian.net/browse/SV-8875)** (Story Defect, Open, parent
   SV-8797, **Ahtasham Amjad 05:50:12-0500 — 32 min after Branko's closure**) reports exactly it, reaches
   the **same** S12-R6 reading we reached independently, and **names our own C29622/C29623/C29624**. Not
   touched (Rule 38). **(3) ALL 8 CARRY `AUTOMATION: HOLD - needs one live check…` AND STATE-1 PROVENANCE
   WITH NO BUILD DATE** — because **every `.qa.shopview.com` cookie set is DEAD** (401 `sso_required`; all
   four share the same expired `sv_sso_session`; `quick-login` is itself session-gated and 401s too), so
   **nothing was observed on the app** and READY/EXPECT-FAIL would both assert a build fact we have not
   seen (Rule 12). **⇒ READY-TO-AUTOMATE STAYS AT 93 of 110 — it does NOT reach 101 this pass**; it
   becomes 101 in ~10 minutes once cookies land (`PENDING-LIVE-CHECK.md` names the exact steps + test
   data; a **4th Rule-49 queue** holds a row per case). **(4) THE DEAD GITHUB LINK — the owner-only fix
   would have produced a DIFFERENT dead link:** `bmuzamil-shopview/…` = 403, and
   `bilalmuzamil-sketch/…/blob/main/…` = **404 because THERE IS NO `main` BRANCH on this repo** (only four
   `claude/*` session branches; default HEAD = `claude/slack-session-0sxnd9`). **`blob/HEAD/` was used,
   verified HTTP 200 before and after.** Fixed on **10** cases; **REMOVED from 7** more where that file is
   **not** what the expectation rests on (Rule 54 bars citing a non-load-bearing source). **(5) RAW
   MARKUP:** all **10** listed cases verified broken from live text, each broken in **all three** fields,
   **no 11th found in a sweep of 110**, converted to plain numbered text — **formatting only**; and
   **C29613 had TWO provenance lines**, the stale `<hr /><p>` copy removed, so **110/110 now carry it
   exactly once**. **RUN 352 PROVEN UNTOUCHED** — include_all still false, 110 tests, test-id and case_id
   sets equal both ways, **all 429 prior result records present BY ID, 0 with any graded field changed**;
   the only field that moved on 5 of them is **`case_title`** (TestRail's read-time display copy —
   **independently corroborates playbook DECLARED NORMALISATION #2**), and **9 NEW results are Ahtasham's
   own grading during our window** (user 7, 12:02–12:25Z; counters 27P/5F → 36P/2F). **DELIVERABLES:**
   local source re-synced **from live before** regenerating (47 fields, then 8 more); **shredding guard
   RAN and PASSED (0 shredded), import independently re-checked = 0 rows with the signature**; id-map
   **re-merged FROM LIVE twice** (the generator blanks C-ids **and** drops `refs` every rerun) → **110
   rows, 0 blanks, refs 110/110, header byte-identical to the committed one, refs+titles byte-equal to
   live 110/110**; **four counts set-equal BOTH ways (live 110 / local 110 / id-map 110 / import 110)**;
   import header sha256 **identical to all 4 peers**. **ALSO FOUND, REPORTED NOT FIXED:**
   **[SV-8845](https://shopview.atlassian.net/browse/SV-8845) is now OBSOLETE/Done** (Ahtasham
   04:41:58-0500) yet **2 of our cases still call it open**; **all 110 provenance lines say "spec version
   1.6" while live Confluence is 18** (the Rule-31(a) trap — wants ONE authorised pass over all 110);
   the button may really read **"Apply Filters"** with a capital F (another run's capture; **spec-sourced
   lowercase kept, NOT live-confirmed**); **`get_sections` NEEDS PAGING — 625 sections exist and an
   unpaged call returns 250 and silently finds ZERO Filters sections** (added to playbook §J); and the
   earlier note that SV-8825 was answered *"28 minutes"* after the readiness report is **wrong — the gap
   was five and a half hours**, a −0500 timestamp read as UTC. **New epic state: SV-8785 has 20 children**
   (+SV-8876, a clarification on ground the QA lead already closed as accepted in SV-8843) plus **3 new
   Story Defects today — SV-8872, SV-8875, SV-8878** (all Ahtasham); **SV-8787 + SV-8788 are now QA
   Complete**. **⚠️ Branch still NOT declared final — every verdict remains PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 (AUTOMATION MARKERS WRITTEN, 102 of 110; resume
   `build/automation-markers-2026-08-05/` then `build/filters/PROJECT-STATE.md` §0-MARKERS-2026-08-05):**
   the QA lead's machine-findable automation marker is now on **102 of the 110** cases, at the **very end
   of Expected Results after the Rule-54 provenance line**, blank line before, line break after (his exact
   placement). **74 `AUTOMATION: READY` · 19 `AUTOMATION: READY - EXPECT FAIL (<ticket>)` · 9
   `AUTOMATION: HOLD - <reason>`** (8 not-built + 1 needing a second test login). **Arithmetic check
   PASSED: READY + READY-EXPECT-FAIL = 93 = the readiness figure exactly.** **102 × `update_case`, every
   one HTTP 200 + byte-verified MATCH, 30 fields compared each, 0 collateral changes**; `refs` not written
   on any op; **0 add / 0 delete / 0 section / 0 run writes**; **provenance lines deliberately NOT
   re-stamped** (nothing was re-observed, so a new tested-on date would be a false claim). Build confirmed
   **byte-identical at the start on all three markers** (`v3.4.2-d00239b`, last-mod Tue 04 Aug 22:51:02
   GMT, etag `b9ab1d41…`). **Run 352 PROVEN UNTOUCHED** — 110 tests, **427** result records (not 425:
   Ahtasham has since logged 2 more Passed, so he now stands at **25 Passed / 7 Failed**), case_id sets
   equal both ways, every prior result present BY ID and byte-identical.
   **⚠️ THE 8 PHONE CASES WERE DELIBERATELY NOT WRITTEN — Branko ANSWERED AND CLOSED
   [SV-8825](https://shopview.atlassian.net/browse/SV-8825) at 2026-08-05T05:18:22Z** (*"This is updated
   in the filters prd, I'm closing it."*) — **28 minutes AFTER `READINESS-2026-08-05.md` was finished
   saying it was still Open with zero comments.** Spec **v18** now rules it (§4 Key Decisions + **S12-R6**
   *"mobile does not filter in real time… only when the user taps an 'Apply filters' button"*, and *"This
   confirms intent"*). So FLT-MOB-01/02/03/04/05/06/07/10 (C29621–C29627, C29630) are **no longer waiting
   on the PO**, their existing *"the question is open as SV-8825"* line is **now FALSE**, and their verdict
   is **unknown** (the build applies as you tap = contradicts a ratified requirement, and there is **no
   defect ticket**). **Needs ONE authorised pass: correct the 8, raise one Low defect on epic SV-8785 with
   story SV-8797 linked, set their markers to READY-EXPECT-FAIL → ready figure 93 → 101 of 110.** Write-up
   `automation-markers-2026-08-05/SV-8825-ANSWERED.md`. **LESSON (Rule 31): a readiness figure has a shelf
   life measured in MINUTES when a PO is active — re-read the blocking ticket at the moment you rely on
   it.** Deliverables re-verified: local source re-synced FROM LIVE first (exactly 102 `expected` fields
   moved), shredding guard **PASSED** (and note: **the Filters import was NOT still corrupt** — the
   5 Aug recheck pass had already repaired it, correcting the standing note), import differs from its
   predecessor in **one column, 102 rows, only by the appended marker**, all four counts **= 110 set-equal
   both ways**, id-map came back **byte-identical (0 blanks, refs 110/110)**, import header **sha256
   identical to all 5 peers**. **Two defects in our own data, reported not fixed:** the GitHub links inside
   the provenance lines point at **`bmuzamil-shopview/Manual-test-Cases`, which does NOT resolve (403)** —
   the repo is `bilalmuzamil-sketch/Manual-test-Cases`; and **10 cases show raw `<ol>`/`<li>` markup to the
   tester** (C29557/29560/29566/29568/29573/29575/29582/29613/29625/38911, **predates this pass**).
   **⚠️ Rule-49 queue STILL OPEN — branch not declared final, all 110 verdicts PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 (FULL RULE-49 RE-CHECK AGAINST THE REBUILT BRANCH; resume
   `build/filters/recheck-2026-08-05/` then `build/filters/PROJECT-STATE.md` §0-RECHECK-2026-08-05):**
   the `sv8785` branch redeployed overnight (`v3.4.2-4f8211c` → **`v3.4.2-d00239b`**, last-modified
   Tue 04 Aug 22:51:02 GMT, etag `b9ab1d41…`; marker read at start/mid/end — **identical all three, no
   redeploy under us**), so the queue was re-run **IN FULL: 110 of 110 rows, no sampling — 91 CONFIRMED
   / 19 CHANGED.** **110 × `update_case`, every one HTTP 200 + byte-verified MATCH, 28 fields compared
   each** (Rule 50); **0 add / 0 delete / 0 section / 0 run writes**. **All 110 provenance lines
   re-stamped to `v3.4.2-d00239b` + 8/5/2026, exactly once each** (0 name the old build, 0 doubled).
   **Run 352 PROVEN UNTOUCHED both times** — 110 tests, **425 result records**, case_id sets equal both
   ways, **every prior result present BY ID and byte-identical field by field**; **Ahtasham Amjad's 30
   results (23 Passed / 7 Failed) exactly as he left them.** **THE 19 CHANGES:** **SV-8824 IS FIXED**
   (dropdown now stays open — proven on all five chips, 2nd + 3rd values tickable without reopening;
   Jira independently **Ready for QA**) → the false known-issue line removed from **12 cases**
   (STAT-03/04/05, CUST-03/05/07, TECH-03/05, ADV-03/05, ASSET-05, CHIP-01) — **our judgement call
   applying the QA lead's own rule, flagged for retrospective confirmation**; **SV-8844 IS FIXED** (no
   `search` key in the saved pref, no PUT sent, fresh browser returns the full 30 rows) → line
   **DELETED** from PSRCH-10/11/12 per his decision 1; **SV-8843 + SV-8847 STILL REPRODUCE
   byte-identically** → the 5 cases (BAR-01, COLL-02, EMPTY-01, EMPTY-02, PSRCH-09) carry his
   accepted-behaviour wording, **and the defence register records plainly that SV-8843 was closed as
   "Not Reproducible Anymore" while the build contradicts that reason**; **FLT-RPTS-23 = C38882**
   (id-map name; the ask said FLT-RPTS-13) NOTBUILT → **PASS**, rewritten scope-conditionally (Rule 42)
   to spec **Confluence v18** — the Reports date filter IS built and matches: opens on "Date Range: This
   month", offers 11 ready-made periods + Custom + Clear Selection, a period applies on selection
   (`?range=today`), a custom range applies **only on the 2nd date** (From 07/01/2026 alone fired no
   request; adding To 07/31/2026 gave `?range=custom&range=2026-07-01&range=2026-07-31`);
   **FLT-PERS-01 → DEVIATION** on a **NEW defect [SV-8871](https://shopview.atlassian.net/browse/SV-8871)**
   (**filed by us** as a **Bug, Low, parent SV-8785, Product Area Work Orders**, linked SV-8792 + SV-8795,
   Open, duplicate search run first — **that was byte-verified at filing and was the correct shape on
   2026-08-04, but it is NOT its shape now: Ahtasham Amjad converted it via the Jira "Change work type"
   wizard on 2026-08-05T04:51:42-0500, which changed the type Bug → Story Defect AND atomically
   re-parented it SV-8785 → SV-8795 (12 ms apart in the changelog), and the same conversion SILENTLY
   WIPED Product Area to empty. Jira logged the type and the parent move but records NO Product Area
   changelog entry at all, so the loss of "Work Orders" is provable ONLY from our byte-verification at
   filing time. LIVE NOW (read 2026-08-05): Story Defect · parent SV-8795 · Product Area NULL · Low ·
   Open. Do NOT reverse it — it is another author's deliberate triage (Rule 53's corollary); re-instating
   Product Area is the QA lead's call**) — a restored **Customer / Lead Technician / Service Advisor** button comes back
   blue but **WITHOUT its value name** on all four restore routes (nav-away, reload, fresh browser,
   shared link) while **Status and Asset on Site keep theirs**; breaches **S7-R1** *"…and displays the
   selected value(s)"* + **S10-R1** *"restored exactly as they were left"*; **honestly NOT callable a
   regression** — the 4 Aug pass tested persistence only with the two unaffected filters;
   **FLT-PERS-04 → DEVIATION: OUR 4 AUGUST PASS WAS WRONG AND AHTASHAM WAS RIGHT** — seeded properly
   (throwaway *ZZAUTOTEST Filters Recheck* + *Lastone Construction*, deleted while off-page) the
   dropdown hides the deleted customer but the URL **and** the request still carry it = his open
   **SV-8832**; **FLT-URL-02** keeps DEVIATION with a **second** reason (desktop label loss, SV-8871).
   **NEW TALLY: PASS 74 / DEVIATION 19 / HELD 8 / NOTBUILT 8 / second-sign-in 1 = 110** (was
   60/32/8/9/1); **ready to automate 89** (was 88). **SV-8825 (mobile Apply button) STILL UNANSWERED**
   — Open, **0 comments** — so the 8 mobile cases keep DO-NOT-AUTOMATE. **Nothing new shipped on
   Parts/Reports filter bars** (observations byte-identical). **Spec = Confluence v18** (2026-08-04T18:19:21Z,
   Branko: *"Date-range filter: reflect current in-app default range and standard predefined ranges"*),
   128 requirements unchanged — **and the page BODY still reads "Version: 1.6", the exact Rule-31(a)
   trap; go by the Confluence number.** **Deliverables:** local source **re-synced FROM live BEFORE
   regenerating** (114 fields), shredding guard **PASSED**, and the generator's gotcha fired again — it
   blanks the id-map C-ids **and drops the `refs` column** every rerun, so both were re-merged from live
   (110 rows, 0 blanks, refs 110/110); **all four counts = 110, set-equal BOTH directions**; import
   header **sha256 identical to all 4 peer imports**. **Readiness recounted —
   `build/filters/READINESS-2026-08-05.md`, EVERY row and the total now ADD UP** (the 4 Aug file is kept
   but marked SUPERSEDED); the 4-cases-in-two-columns / 1-case-in-none overlaps are stated in the open,
   and the 4 Aug note that named **FLT-MOB-10** as the double-counted phone case is corrected to
   **FLT-MOB-09**. Env clean: throwaway customer deleted + **proven absent two ways**, filters cleared,
   Reports range back to This month, one sign-in reused. **⚠️ Rule-49 queue STILL OPEN — the branch has
   NOT been declared final, so all 110 verdicts remain PROVISIONAL.**
   **STATUS 2026-08-04 (SUPERSEDED — STANDING RULE 54 PROVENANCE RETROFIT EXECUTED, user-authorized;
   resume `build/filters/provenance-2026-08-04/`):** all **110/110** cases now end their Expected
   Results with a plain provenance sentence naming **epic SV-8785** (see the epic entry above) + the
   **Filters specification version 1.6** + the case's own anchors — **state 1 (NO build date; still
   no Filters QA env)**. `update_case` ONLY: 110 cases / 111 ops, every one HTTP 200 +
   **byte-verified MATCH, 28 fields compared each** (Rule 50); **each op wrote `custom_expected` +
   `refs`**, the refs being the **epic backfill that replaced the now-false literal "Filters (no Jira
   epic)"**. **Run 352 verified untouched** — 110 tests set-equal both ways, **all 395 result records
   present BY ID**. **Rule-41 whole-case re-read of all 110** found the paste-corrupted **FLT-MOB-04
   C29624** (refs artefact FIXED in the same write; the BODY reflow is **STAGED not executed** —
   `STAGED-REPAIRS.md` — because the case sits in the frozen mobile cluster) and **0 other defects**.
   **Rule-28 cross-case sweep: 0 contradictions**, and it caught one coherence issue of our own —
   **FLT-MOB-08 C29628** reclassified `plain` → `design_awaiting` and re-pushed. **Honesty variants:
   4 PO-ruling (Status chip) · 9 prose-only+PO-answers (Parts/Reports) · 8 design-awaiting (mobile
   "Apply filters" — 2 HIGH risk, and the ask has NEVER been sent) · 2 no-anchor · 87 plain.**
   Defence register: `build/filters/provenance-2026-08-04/PO-RULING-DEFENCE.md`. **NOTE: the
   permanent-persistence ruling is NO LONGER a conflict — Branko fixed S10-R2 in v1.6.**
   **STATUS 2026-07-31 (three-dimension Ruthless Usefulness Audit RUN + consolidation
   EXECUTED; audit dir build/filters/quality-audit-2026-07-31/):** 137 → **110 local / 94 live**
   (2 update_case + 27 local-only retirements + 12 sense repairs); audit tally = **1 nonsense
   (RETAINED per user ruling) + 0 missing-traceability**. **PENDING:** ~~39 title trims~~
   (**DONE — re-measured live 2026-08-04: 0 of 110 titles exceed 80 chars, longest is exactly
   80**); the 19
   dropdown merges (await QA-branch LIVE check of the shared-dropdown-component assumption); the
   9 FLT-SRCH cases (await Branko's Global-Search ownership confirmation — user ruling 2026-07-31:
   do NOT delete unless he confirms).
   **Prior STATUS: CASES AUTHORED 2026-07-17 — 79 cases/14 sections,
   adversarial-reviewed CLEAN (7/7); import ready (pure 1:1,
   testrail-import/filters-v1-testrail-import.csv/.xlsx); PO questions ready
   for Branko (Parts/Reports scope + 3 more); VIU pending env + Epic key
   ask-at-VIU. IMPORTED TO TESTRAIL 2026-07-17 (suite 1, group 4110; id-map
   79/79 populated, C29557–C29635; API cases in section 4124 "API — Work Orders
   List Filtering"; ⚠️ gen_import.py blanks the C-id column — re-merge after any
   rerun); NEXT = Branko answers → VIU at QA (ask Epic key + process). Canonical
   resume doc: build/filters/PROJECT-STATE.md. Branko answers ingested
   2026-07-17 (Parts/Reports IN SCOPE pending PRD; persistence permanent;
   disabled-chip ruling); JE-tab frame captured (final set 50/50);
   design-system zip = reference prototype; baseline confirmed ZIP=final
   (user ruling A 2026-07-17). Q2/Q4 case updates PUSHED to TestRail
   2026-07-17 (3/3, audit-logged) — FLT-PERS-02/C29614 permanent persistence,
   FLT-TAB-02/03 C29609/C29610 disabled pre-filled Status chip; import +
   id-map regenerated (id-map re-merged 79/79); audit log =
   build/filters/branko-answers-2026-07-17/testrail-update-log.md; Round-2 Qs +
   PRD request SENT to Branko 2026-07-17. **ROUND-2 ANSWERS INGESTED 2026-07-20
   (Q1=A/Q2=A/Q3=A — all confirmatory, ZERO case edits / ZERO TestRail writes
   required; OQ-4 RESOLVED: filter lists role-independent; prototype
   "Reported" anomaly CLOSED — "Imported" correct; optional Q3 notes-only
   annotation on C29566/C29575/C29582 to bundle with the next authorized push;
   source of record
   build/filters/branko-answers-round2-2026-07-20/answers-ingested.md).**
   Still awaited: Branko's updated PRD (incl. the two Q1 text fixes) → then
   Parts/Reports authoring; VIU on QA arrival.** Same rules as all projects: reuse shared infra
   (BUILD-ACCURATE-WORDING-VIU-PROCESS, SPEC-RELEVANCE-RECONCILIATION,
   TESTING-RUNBOOK, harness/TestRail patterns); per Standing Rule 11 ASK which
   process(es) to run before any VIU pass. Open questions live in
   requirements.md (OQ-2/3/6/7 QA-side) + the PO sheet (product decisions).
6. **Schedule project** — Schedule / Technician Scheduling Module (ShopView App): a
   visual drag-and-drop technician scheduling calendar (top-level nav area) with a
   left work-order sidebar (mini calendar + searchable/filterable WO cards +
   approved-only per-line drill-down) and a main schedule grid (Day/Week/Month,
   department-grouped technician rows + in-grid Unassigned lane); drag a WO/line onto
   a technician × day/time cell to create shifts, with a scope picker (multi-line
   orders) and a multi-day spread step producing a linked series (connected banner);
   plus events, conflict detection (double-booked/weekend/before-hours/after-hours),
   capacity bars, hover tooltips, overlap lane-stacking (3-lane cap + "+N more"),
   series-aware deletion, undo toasts, keyboard support; WO labor-roster kept in
   sync; access gated by a Schedule View/Edit/Delete custom-role tier
   (Delete⊇Edit⊇View) + a Work Orders: View sidebar dependency; grid rows are
   department-based, not role-based.
   **Canonical spec URL (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule
   (Atlassian-SSO login-walled — reference pointer only, do NOT fetch; content
   ingested from the exported .doc — a Confluence "Export to Word" MHTML/
   quoted-printable file, decoded with Python email/quopri + BeautifulSoup).
   **PO: Branko** (confirmed 2026-07-21; same PO as Global Search & Filters; full name
   TBC — never mix PO attributions: Schedule=Branko, Global Search=Branko,
   Filters=Branko, Fees&Discounts=Chris Ward, Simple Flow=Milos).
   **⚠️ Epic/Jira key: NOT AVAILABLE YET — ASK THE USER when VIU begins** (do NOT
   invent). **⚠️ QA branch/env + feature-flag/settings status: NOT AVAILABLE YET —
   ASK THE USER when VIU begins.** **Figma/design: NONE at the moment (user confirmed
   2026-07-21) — SPEC-ONLY project;** author build-accurate wording (Rule 9) from the
   spec text where present and mark anything the spec doesn't pin down (exact
   on-screen labels/states) as "VIU-confirm" to confirm LIVE once the QA branch exists
   (same pattern as Global Search/Filters); do NOT invent labels.
   **CANONICAL STATE DOC (read first for resume):** `build/schedule/PROJECT-STATE.md`
   — single authoritative snapshot (status, spec-ingest facts, authoring-readiness
   assessment §0.6, deliverables index, open questions, env/access TBD, how-to-resume).
   **STATUS 2026-07-27 (SUPERSEDED — EPIC SV-8685 BACKFILL + DESIGN/JIRA DELTAS + NEW-SCOPE, LOCAL
   ONLY, NO TestRail writes; resume `build/schedule/PROJECT-STATE.md` §0.0-EPIC):** epic = **SV-8685**
   / 15 stories SV-8686..SV-8700 **(+ SV-8812 since 2026-08-04 = 16 children — a Task,
   "Set up a dedicated QA environment for testing", Board Backlog; NOT a testable requirement,
   it is the ticket for the very thing blocking our VIU. All 15 stories also moved Open →
   In Progress by 2026-08-04 — a status move, so NO case content changed).** Applied locally (plan item 1): (1) Rule-20 refs backfilled on ALL
   **167** active cases (`<TICKET> (<spec-anchor>)`, cross-cutting perms → epic SV-8685; resolves
   OQ-2); (2) 10 tester-facing edits — SCH-FILT-01/C29942 "Filters", SCH-VIEW-01/C30042 "Filter &
   Display", SCH-EVT-01/C30016 "Create Event", SCH-REAS-03/C30054 menu=Create Event+New Work Order,
   SCH-REAS-04/C30055 (View Day removed) + SCH-REAS-05/C30056 (New Shift removed, both REWORKED not
   retired), SCH-DEL-08/C30064 toast 7s-Undo/4s, D2 SCH-SPREAD-07/C29983 + SCH-EDGE-05/C30089 (shop
   closures NOT skipped V1), D3 SCH-BLOCK-04/C29994 (blocks default blue, custom per-shift); (3) **10
   NEW-SCOPE cases** (`cases/cases-G-new-scope.json`, VIU-Pending): Working Hours Settings ×7
   (SCH-HRS-01..07, SV-8699), Week Export ×2 (SCH-EXP-01/02, scope pending Branko), New Work Order
   shortcut ×1 (SCH-REAS-06). **HELD pending Branko:** D1 events-count-toward-capacity
   (SCH-EVT-08/C30615 + SCH-CAP-01..04) + D4 modal "Reassign" (SCH-MODAL-08/C30015). **NEW TALLY:
   177 ACTIVE authored** (all VIU-Pending); deliverables regenerated over 177 (id-map now has a
   `refs` column, References column = Rule-20 refs, header byte-identical, hygiene clean); id-map
   167 C-ids re-merged + 10 new blank. **EPIC SYNC EXECUTED 2026-07-27 (user-authorized, Rule 6):
   the manifest `spec-v1-2026-07-22/testrail-sync-manifest-epic-2026-07-27.md` is now LIVE —
   2 add_section (Working Hours Settings = 5405, Week Export and Printing = 5406) + 10 add_case
   (SCH-HRS-01..07 = C38846–C38852, SCH-EXP-01/02 = C38853/C38854, SCH-REAS-06 = C38855;
   custom_atmstatus:3+custom_automation_type:0, non-API) + 167 update_case (157 refs-only + 10
   tester-facing), ALL HTTP 200, ALL re-GET MATCH, 0 delete. D1 (events→capacity) + D4 (modal
   Reassign) HELD, not written. Run 325/all runs untouched. NEW TALLY: 177 ACTIVE, all C-id'd
   (id-map re-merged 177/177; import regenerated header byte-identical, 0 VIU/flag words).
   Executor `exec_sync_epic_2026-07-27.py` (+ `exec_sync_epic_resume.py` for a 16-case tail after a
   transient HTTP 000). Audit `testrail-execution-log-epic-2026-07-27.md`; manifest header = EXECUTED.**
   Scripts: `epic-sv8685/backfill_refs.py`, `epic-sv8685/patch_edits.py`. Design-pinned ≠
   VIU-Verified (Rule 12); live VIU still pending QA branch (OQ-3).
   **🔴 SOURCE-CURRENCY GAP, RECORDED 2026-08-06 (Standing Rule 31) — THE SCHEDULE SPECIFICATION IS AT
   CONFLUENCE v25 AND OUR RECORDS SAY v23. TWO VERSIONS ARE UNINGESTED.** Read live 2026-08-06:
   `GET /wiki/api/v2/pages/713031682` → **HTTP 200, Confluence version 25, last edited
   2026-08-06T09:13:51Z**. Every "spec CURRENT at Confluence v23" line in this entry, and **every one of the
   168 cases' Rule-54 provenance lines naming "the Schedule specification version 23"**, is therefore
   **STALE until the diff is done** — a version pin is only worth anything if it is the right version
   (Rule 42). **This is recorded as a GAP, not resolved here: the v23 → v25 diff has NOT been attempted by
   this note** (a separate worker is running it), so nothing below is re-verdicted and no case was touched.
   Consequences to keep in view rather than assume away: a moved requirement re-opens its per-requirement
   coverage verdict (Rule 43), and any case whose anchor moved needs re-checking (Rule 41). **The in-body
   "Version" field on that page still reads `1.0` — Rule 31's trap (a); go by the Confluence number.**
   **OUTSTANDING: the v23 → v25 diff, then a re-stamp of the affected provenance lines.**
   **STATUS 2026-08-06 (LATEST — THE FULL LIVE PASS ACROSS TWO BUILDS: ALL 168 WRITTEN AND
   BYTE-VERIFIED, 156 OF 168 OBSERVED, READY TO AUTOMATE 140. Resume
   `build/schedule/READINESS-2026-08-06.md` → `build/schedule/full-viu-2026-08-05/{FINDINGS,RESUME,
   CHANGES-MADE,RECHECK-QUEUE,FILED,NEW-TICKETS-ASSESSED,API-ASK,SOURCE-CURRENCY,
   TECH-HOURS-RESOLVED-2026-08-06,SV-8923-WITHDRAWN,COMMIT-SCOPING-LESSON-2026-08-06}.md` →
   `build/schedule/PROJECT-STATE.md`):** **168 × `update_case`, every one HTTP 200, 30 fields compared
   each, 0 mismatches, 0 collateral changes**, all three text fields on every op; read back live,
   **exactly one provenance line, one build stamp and one marker on every case, 0 raw markup, 0 barred
   phrases**. **MARKERS: 119 `READY` · 21 `READY - EXPECT FAIL` · 28 `HOLD` = 168. THE ARITHMETIC GATE
   PASSES: 119 + 21 = 140 = 168 − 28**, both arithmetics read back from the live cases rather than
   computed from our notes. **Run 357 PROVEN UNTOUCHED** — 168 tests, **429** results, all present BY
   ID, 0 graded and 0 derived fields changed, `include_all` still false. **THE HONEST SPLIT: 156 of the
   168 were observed, 12 have NEVER been observed and say so on themselves** — they need a **second
   sign-in as a non-administrator**, and impersonation was deliberately NOT used because a sibling
   worker shares the session (`quick-login` and `switch-user` were never called). **The 168 verdicts do
   not all come from one build: 90 were seen on `v3.5-7ec992f`** (last-mod Wed 05 Aug 22:49:36 GMT,
   etag `e2a80a6ab5e0b47c29fd88af9db1e980`, byte-identical at session start and end) **and 78 on
   `v3.5-d122eef`, which no longer exists** — and Rule-54 sentence 2 now names the marker **that case
   was actually seen on**, so the split is visible per case instead of hidden in an average.
   **🔴 A REGRESSION WAS FOUND IN A CASE WE HAD ALREADY PASSED: SCH-DND-08 =
   [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)'s CLICK-TO-ARM ALTERNATIVE TO
   DRAGGING HAS BEEN REMOVED between `v3.5-be42149` and `v3.5-7ec992f`** — zero controls anywhere carry
   it, on load, on hover, or in the expanded line list (it had been proven BUILT on 5 August:
   `button_sidebar_arm_<woId>`, `aria-pressed`). Filed **[SV-8957](https://shopview.atlassian.net/browse/SV-8957)**.
   **Its absence is also WHY 7 CASES COULD NOT BE RE-DRIVEN** — the drag will not complete through our
   tooling and the click route no longer exists: **C29967, C29982, C29984, C29985, C30004, C30013,
   C30020**, all now `HOLD - not re-checked against the current build`. **SEVEN CASES STOPPED BEING
   FAILURES** (SV-8857, SV-8849 and SV-8850 are fixed; the create-event toast and Undo now exist; event
   cards are structurally distinct; the tooltip caps line names at three) — **every one of those
   tickets is still Open or Ready to Fix in Jira, which is exactly why ticket status is never used as a
   verdict (Rule 61).** **ONE FEATURE SHIPPED** (the long-series and 120-shift guards on the scheduling
   endpoint now exist and behave correctly). **ONE TICKET OF OURS WAS WITHDRAWN AS INVALID** —
   **SV-8923**, closed OBSOLETE, because it had been raised against a shop with no business hours
   configured, which the source case's own precondition required. **TWO NEAR-MISS FALSE DEFECTS WERE
   AVOIDED BY LOOKING TWICE**, and one of them was ours: a "the working-hours service is broken" report
   was **our own missed click** — the Save button sat below the fold and the coordinate click landed on
   nothing (`scrollIntoViewIfNeeded()` then click → `POST /change` 201 + `PUT /working-hours` 200, value
   read back). **The 28 HOLDs, grouped:** 13 waiting on a second sign-in as a different user (the whole
   Permissions area plus two API cases and one Filter-and-Display case) · 7 needing a drag our tooling
   cannot complete · 3 waiting on a product-owner answer **that has never been sent** · 3 whose feature
   is simply not in the build · 1 needing shifts noted before a release already deployed · 1 needing a
   user with no staff record of their own.
   **⚠️ THE DESIGN BASELINE MAY BE STALE, AND IT IS RECORDED AS A PARTIAL SOURCE (Rule 31), NOT
   ASSUMED FINE.** **Sasha Grosman's three tickets — SV-8915, SV-8916, SV-8917 — all close with the same
   source: `Design: https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?file=Schedule.dc.html&via=share`,
   each *"Raised in the Schedule design review with Fabian on 5 Aug 2026"*.** That is a **share URL to a
   live, editable design page with no version or date on it** — **NOT** the artefact we ingested
   (`build/schedule/design-2026-07-27/`, the Claude prototype Branko ruled authoritative at Q0), and
   **~48 of our labels were pinned from that prototype**. Consequences stated rather than assumed: we
   **cannot verify any of Sasha's three design-sourced claims against a design we hold**; **SV-8916
   could not be verified at all** — its button is in *his* design and in **no requirement of spec v23**;
   and **if his link is newer, our design baseline is stale**, so the next Schedule pre-flight must
   fetch and diff it. **What is owed: confirmation of which design artefact is canonical.**
   **⚠️ Rule-49 queue OPEN (`full-viu-2026-08-05/RECHECK-QUEUE.md`, opened 2026-08-06) — the branch is
   NOT declared final, so all 168 verdicts are PROVISIONAL. This pass drove the 27 previously
   unobserved cases and re-drove 18 of the 25 stale deviations; it was NOT a fresh live run of all 168
   and does not claim to be.**
   **PRIOR STATUS 2026-08-05 ~17:30 UTC (THE SUITE IS 168 CASES, READY TO AUTOMATE 160; three coverage
   gaps authored, run 357 union-synced, and all 165 provenance lines re-worded off the build. Resume
   `build/schedule/PROJECT-STATE.md` §0-PROVENANCE-REWORD-2026-08-05 → `build/schedule/provenance-reword-2026-08-05/`
   {`SOURCE-CURRENCY`,`testrail-execution-log`,`NEW-CASES`,`RECHECK-QUEUE`}`.md` → `build/schedule/READINESS-2026-08-05.md`
   (banner + the RECOUNT section at its end)):** **THE BUILD MOVED A THIRD TIME IN TWO DAYS —
   `v3.5-be42149` → `v3.5-d122eef`**, last-modified Wed 05 Aug 2026 **15:35:43** GMT, etag
   `dd1c57e2fb4beba9758b62a29afdeaab`, read at 17:11:48Z and 17:29:54Z with `index.html` **sha256 identical
   both times**. Engineering will **not** declare the branch final before release, so an **OPEN Rule-49 queue is
   this project's normal steady state**, and the LIVE queue is now
   `provenance-reword-2026-08-05/RECHECK-QUEUE.md`. **THE THREE COVERAGE GAPS THAT THE 14:15 PASS LEFT
   UNAUTHORED ARE NOW AUTHORED** (QA-lead authorised: *"Yes authorized for Scheduling three coverage gaps."*),
   **all three reproducing live on `v3.5-d122eef`, each with a CONTROL that rules out a harness artefact**:
   **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)**
   ([SV-8863](https://shopview.atlassian.net/browse/SV-8863) — which view the module opens on; `Week` carries
   `aria-pressed="true"` on arrival while `Day` is false — **and the requirement is story SV-8686's acceptance
   criterion, NOT the specification, which is SILENT on the default view**, so the case says so rather than
   inventing an anchor) · **SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555)**
   ([SV-8870](https://shopview.atlassian.net/browse/SV-8870) — Month-view drag-create does nothing, **zero
   requests sent**, while the identical drag in Week view opens the scope picker; **HELD, because §4.1 names no
   view and story SV-8688 names only Week — the Month-view question was NOT resolved from the build, it is
   Branko's to answer**) · **SCH-REAS-07 = [C43556](https://shopview.testrail.io/index.php?/cases/view/43556)**
   ([SV-8867](https://shopview.atlassian.net/browse/SV-8867) — a series block snaps back with no confirmation
   while an ordinary shift between the **same two lanes** raises *"Move this shift to MQ Test Tech Qamar?"*).
   **Their internal IDs were checked THREE ways** (not in the 195 bodies · not on the 27-case retired list ·
   not in the id-map) because another project reused a retired ID today and its resync **overwrote the retired
   record**. **No API case among them** (Rule 51 — the QA lead ruled *"No test cases for API only findings
   please"*). **ALL 165 PROVENANCE LINES RE-WORDED so no case credits the build for its expected behaviour**
   (Rule 54 as amended: sentence 1 names only documents, sentence 2 records neutrally the build the case was
   last checked against — the two must never merge): **165 distinct cases · 241 `update_case` ops · every one
   HTTP 200 + byte-verified MATCH, 28 fields compared each · 0 collateral changes**, and because all three text
   fields were sent on every payload **TestRail's omit-field re-render never fired — 0 of 168 carry raw markup
   or CRLF**. **Two defects in our own text removed, both findings:** 8 cases said the expectation was
   *"verified against the build"* (**two of those 8 are EXPECT-FAIL cases that fail on that very build**, so the
   line contradicted the case's own body) and **157 named `v3.5-be42149` as the build the branch "has since been
   rebuilt to" — true when written, false within hours**. **HONEST PER-CASE SPLIT: only 8 were ever re-observed
   on the newer build** (`Last checked against build v3.5-be42149 on 8/5/2026`); the other **157 carry
   `v3.5-4873abe` / 8/4/2026** — and **only 3 of the 168 (the new cases) were observed on `v3.5-d122eef`**.
   **RUN 357 UNION-SYNCED 165 → 168** — `include_all` is **false**, so adding cases had frozen the run out of
   date; `update_run` HTTP 200 with the **FULL union of 168**, `case_id` sets **equal in both directions**, all
   165 prior tests present **by id** (0 lost, 0 rebound), **all 429 prior result records present BY ID with 0
   graded-field changes and 0 echo movement**, 0 new results, only `untested_count`/`updated_on` moved on the run
   record. Executor `tools/run_sync_357_only.py` = the proven executor with `SCOPE` **cut to run 357 alone**, so
   runs 359 and 352 (other workers live) could not be touched; the unsafe 2026-07-31 script was not used.
   **THE GATE — RE-VERIFIED LIVE 2026-08-05 ~19:30Z: cases 168 − 3 waiting on the PO − 2 un-settable − 3 not
   built = READY TO AUTOMATE 160, and the live markers are READY 137 + READY-EXPECT-FAIL 23 = 160, HOLD 8 =
   3 PO + 2 un-settable + 3 not built. 168 markers on 168 cases, EXACTLY ONE EACH, 0 unmarked, 0 doubled.
   THE GATE PASSES.** The figure moved **158 → 160**. **FOUR COUNTS: live 168 · local active 168 (195 bodies −
   27 retired) · id-map 168 · import 168, set-equal in EVERY direction**; id-map **0 blanks, refs 168/168**;
   **shredding guard PASSED (0 of 168)**; import header sha256 **`f2d76051d8a42e62`, identical to all five
   peers**. **ENVIRONMENT, HONESTLY: nothing seeded, but ONE all-day event was reassigned by an imprecisely
   targeted early drag and was restored through the interface and proven byte-identical** — 366 shifts / 33
   events / 7 series, 0 added, 0 removed, 0 changed, id sets equal both ways (recorded in full in
   `NEW-CASES.md` rather than glossed). No role changed. **0 Jira issues created.** **⚠️ THE BRANCH IS STILL
   NOT DECLARED FINAL — every verdict remains PROVISIONAL, and 165 of the 168 have NOT been re-observed on the
   build running now.**
   **PRIOR STATUS 2026-08-05 ~14:15 UTC (FINAL VIU PASS: THE QA LEAD'S "EXPECTED BEHAVIOUR IS NOT THE
   BUILD" CORRECTION AUDITED ACROSS ALL 165 AND REPAIRED — its figures below are AS AT 14:15 and describe the
   165-case suite BEFORE the three coverage-gap cases above were authored; resume `build/schedule/expected-behaviour-audit-2026-08-05.md`
   → `build/schedule/final-viu-2026-08-05/FINDINGS.md` → `build/schedule/READINESS-2026-08-05.md` →
   `build/schedule/PROJECT-STATE.md` §0-FINAL-VIU-2026-08-05):** cookies arrived, the branch was reachable,
   build **`v3.5-be42149`** read at **13:24:01Z / 13:49:34Z / 14:11:22Z — `index.html` byte-identical all
   three**, etag `70e496609e155994b93f515db32d0289`. **THE AUDIT (written and committed BEFORE any repair):
   the expected-result BODIES were SOUND — 0 of 165 described build behaviour as the requirement**, and the
   27 cases where the build disagrees kept the documented expectation with the deviation in a separately
   labelled note quoting the spec and instructing FAIL. **THE DEFECT WAS THE PROVENANCE LINE, ON ALL 165** —
   every one read *"This is the expected behaviour **as per the build tested on** 8/4/2026 (v3.5-4873abe),
   and as per epic … and the specification …"*, crediting the build FIRST for the expectation, and on the 27
   deviation cases it was **FALSE and self-contradictory**. **Honest note: that phrasing is Standing Rule
   54's own, taken from the QA lead's earlier example sentence; his correction supersedes it (Rules 32/33).**
   **TWO ASSERTIONS HAD GENUINELY BEEN REWRITTEN TO THE BUILD**, found by diffing live text against the
   4 August pre-write snapshot with the provenance excluded: **SCH-SCOPE-05 = C29967 had come to assert that
   `Select all` and `Cancel` DO NOT EXIST** — the absence of two controls spec §4.3 requires — so it would
   have FAILED before that pass and PASSED after; **silently disarmed**, exactly the QA lead's point that a
   test which cannot fail is not a test. **SCH-LINE-03 = C29950** item 3 had been weakened to a near-tautology.
   Both **restored to the specification**. **THE steps-VIU'd-but-expectation-bent FAILURE MODE DID NOT OCCUR —
   for an unflattering reason: the 4 August pass changed 37 expected results and ZERO steps or preconditions**,
   so the Rule-9 label half of VIU was never done to the steps on any of the 165 (which is why 16 cases still
   showed raw `<ol>` markup) — **fixed this pass**. **AUDIT TALLY over 165: C 155 · A 2 · T 8 · B 0 · D 0**,
   with BOTH texts quoted side by side for every row (Rule 45(e)). **WRITTEN: 165 × `update_case`, every one
   HTTP 200 + byte-verified, 30 fields compared each, 0 mismatches, `refs` under the declared comma
   normalisation, 0 add / 0 delete / 0 section / 0 run writes.** Provenance now **credits the documented
   source** and names the build only as what the case was **checked against**, with an **honest per-case
   date** — the 7 re-observed today say *verified against v3.5-be42149 on 8/5/2026*, the other **158 say in
   their own text that they have NOT been re-checked** against the rebuilt branch. Also fixed: **17 dead
   `blob/main` links** (404 — there is no `main` branch) → `blob/HEAD` (both verified 200), **16 raw-markup
   cases** cleaned (formatting only), **C30010 → SV-8834** and **C30041 → SV-8874** instead of claiming no
   ticket exists. **MARKERS on all 165 (0 before): 137 `READY` · 21 `READY - EXPECT FAIL` · 7 `HOLD`.
   ARITHMETIC GATE PASSES: 137 + 21 = 158 = 165 − 2 PO − 2 un-settable − 3 not-built** (the 2 PO holds say
   honestly that **the shop-closures question has never been sent — the blocker is US**). **FOUR VERDICTS
   CHANGED LIVE: SCH-DND-08 = C29962 NOT-BUILT → PASS — click-to-arm IS BUILT** (`button_sidebar_arm_<woId>`,
   `aria-label="Schedule S-12876 by click"`, `aria-pressed`→`true`, label → *"Stop placing S-12876"*, and
   clicking a technician cell opens the same scope picker a drag does) · **SCH-WOL-04 = C29939 PASS →
   DEVIATION (SV-8873) — OUR VERDICT WAS WRONG**: `Andrew`→12 rows, `Wade`→12, but **`Andrew Wade`→0**,
   `andrew wade`→0, `Wade Andrew`→0, while multi-word `Vuchester Retail`→21 proves it is **not** a spaces
   problem · **SCH-SCOPE-05 = C29967 PASS → DEVIATION (SV-8886)** — tally reads `1 selected · 1h`, confirm
   reads `Schedule`, **no Select all, no Cancel** · **SCH-FILT-03 = C29944 PASS re-proven over ALL 8 statuses
   the filter accepts, 0 leaks** (the 6 empty ones are correct — the list holds only Approved ×90 + Review ×1
   of 91, though the org holds 1200 WOs across 6 statuses, which is useful for whoever fixes SV-8868) ·
   **SCH-LINE-03 = C29950 restored assertion PASSES — 533 of 533 sidebar lines approved** (`authorized` ×329,
   `complete` ×204). **ONE TICKET FILED: [SV-8886](https://shopview.atlassian.net/browse/SV-8886)** — FILED as
   Bug · **Low** · parent **SV-8685** · story **SV-8689** linked *Relates* · Product Area Schedule · 7-section
   format · **11 field checks read back, all PASS** · duplicate-searched with 4 JQL queries first · test data
   named on-screen (S-12876 / Pamill Paving / unit 713 / MQ Test Tech Qamar).
   **⚠️ IT NO LONGER READS THAT WAY — re-read LIVE 2026-08-05: SV-8886 is now a `Story Defect` (id 10007,
   subtask, hierarchy level −1) parented to STORY **SV-8689** ("Scope Picker"), with **Product Area NULL**;
   still Open / Low.** **Mudassir Qamar converted it at 2026-08-05T09:29:49 −0500** with the Jira UI "Change
   work type" wizard, which changed `issuetype` Bug → Story Defect **AND** re-parented it SV-8685 → SV-8689
   **in ONE atomic action** (changelog read live). **BOTH HALVES OF THE AUDIT TRAIL STAND: our filing was
   CORRECT for its date — the 11 field checks did pass and Product Area WAS Schedule when we set it — and
   someone else changed it afterwards.** **THE Product Area LOSS IS NOT IN THE CHANGELOG AT ALL** — the whole
   changelog logs only three fields ever (`IssueParentAssociation`, `Link`, `issuetype`), **so NOBODY can
   reconstruct that value from Jira's own history**; it is provable only because the ticket was byte-verified
   at filing (Rule 50). The shape now required is amended **Rule 52**; converting a ticket is never ours to
   do. **API-only finding STILL NOT
   FILED** (Rule 51) — and honestly, the 8-week/120-shift limits appear **only in the tech plan, nowhere in
   spec v23**, so there are three possible answers and we are not guessing: `final-viu-2026-08-05/API-ASK.md`.
   **`delete_case` called ZERO times** — 6 candidates considered, each kept with a reason (`DELETIONS.md`),
   and the 27 July-retired internal IDs are listed as **never-reuse** after another project lost a retired
   record to ID reuse today. **3 CANDIDATE COVERAGE GAPS deliberately NOT AUTHORED** (SV-8863 default view ·
   SV-8870 Month-view drag-create · SV-8867 reassigning a series member); IDs reserved `SCH-NAV-08`,
   `SCH-DND-09`, `SCH-REAS-07`. **⚠️ NO LONGER TRUE — all three WERE authored later the same day as
   C43554/C43555/C43556 (see the LATEST block above); this sentence is kept only as the record of where the
   14:15 pass stopped.** **SPEC DEFECT REPORTED NOT FIXED: §7 says the cell menu opens on left-click
   while §14.1/§14.2 twice call it a right-click menu.** **PROOFS: run 357 untouched** — 165 tests, **429**
   results, all present BY ID, **0 new, 0 fields changed on any of the 429** (not even `case_title` — nothing
   was retitled); **no result logged anywhere**. **Nothing seeded, nothing to restore** — 34 shifts / 9 events
   / 6 series **byte-identical** before and after, shift id sets **equal both directions**; the scope picker's
   confirm button was never pressed. **Four counts reconcile 165/165/165/165 set-equal both ways**; id-map
   came back **byte-identical, 0 blanks, refs 165/165**; **shredding guard PASSED**; import header sha256
   **identical to all 5 peers**. **SOURCES: spec CURRENT at Confluence v23** (last edited **30 July**, before
   our ingest; **its in-body Version still reads `1.0` — the Rule-31(a) trap confirmed again**), 33 apparent
   word-diff gaps each individually resolved as boundary artefacts of our mirror's annotations, **0
   requirements changed**; epic **26 children** verified two ways with equal key sets; **22 story defects**;
   **all ten of our tickets SV-8848…SV-8857 read live and STILL OPEN**. **THE HONEST LIMIT: only 7 of the 165
   were re-observed live** — the other 158 carry 4 August verdicts and say so on themselves; **the Rule-49
   queue is OPEN, the branch is NOT declared final, and every verdict is PROVISIONAL.** `READINESS-2026-08-05.md`
   written (the 4 Aug file kept + marked SUPERSEDED); `READINESS-2026-08-04.md` NOT deleted.
   **PRIOR STATUS 2026-08-05 (THE QA BRANCH WAS REBUILT; the authorised automation-marker pass
   DELIBERATELY WROTE NOTHING; resume `build/automation-markers-2026-08-05/SCHEDULE-HALTED.md` then
   `build/schedule/PROJECT-STATE.md` §0-BUILD-MOVED-2026-08-05):** the `sv8685` branch **redeployed at
   08:09 UTC on 5 August** — **`v3.5-4873abe` → `v3.5-be42149`**, last-modified Wed 05 Aug 2026 08:09:19
   GMT, etag `70e496609e155994b93f515db32d0289` (all three read live). **So every one of the 165 verdicts,
   and every one of the 165 provenance lines, names a build that no longer exists**, and the marker pass
   stopped before writing rather than assert "expect this to fail" / "this feature is not built" from a
   build nobody has observed (Rule 12 + Rule 49). **All 165 cases proven byte-identical before and after,
   including `updated_on`/`updated_by`; run 357 proven untouched** (165 tests, **429** result records,
   case_id sets equal both ways, every prior result present BY ID and byte-identical). **Honest split:
   142 of the 165 markers were build-INDEPENDENT and safe** (138 `READY` — which asserts *automatable*,
   not *currently passing*; 2 waiting on Branko for the shop-closure contradiction; 2 un-settable on this
   estate) **and 23 were NOT** (19 `READY - EXPECT FAIL (SV-88xx)` + 4 "not built"). **All ten defect
   tickets SV-8848…SV-8857 were read live and are STILL Open**, so the 19 probably still reproduce — but
   probably is not observed.
   **STATUS 2026-08-05 ~12:10 UTC (SUPERSEDED — THE RULE-49 RE-CHECK WAS ATTEMPTED AND COULD NOT RUN; resume
   `build/schedule/PROJECT-STATE.md` §0-RECHECK-ATTEMPT-2026-08-05 then
   `build/schedule/recheck-2026-08-05/`):** the branch redeployed at **08:09 UTC** (`v3.5-4873abe` →
   **`v3.5-be42149`**, last-modified Wed 05 Aug 08:09:19 GMT, etag `70e496609e155994b93f515db32d0289`;
   marker read at start **12:01:46Z** and mid **12:09Z** — `index.html` **byte-identical between the
   reads**, so nothing redeployed under the attempt). **0 OF 165 ROWS RE-OBSERVED** — the QA-branch
   cookies (2026-08-04 11:31 UTC, ~24.5 h old) return HTTP 401 `sso_required`, and the Filters +
   Report Suite sets are dead too (the Filters cookie also 401s against the Schedule API), so it is the
   ordinary **~24 h expiry across the whole `.qa.shopview.com` estate** plus the deploy, and it cannot be
   worked around from the container. **ALL 165 VERDICTS ARE PROVISIONAL AND UNCONFIRMED and NOTHING was
   inferred** (Rule 12). **ZERO WRITES, PROVEN:** all 165 cases byte-identical before/after — **30 fields
   each, `updated_on` + `updated_by` included, 0 differences**; **run 357 untouched** — 165 tests, **429**
   result records, **every one present BY ID and byte-identical field by field**, `case_id` sets equal
   BOTH directions, `include_all` still false; **Jira 0 writes**; **no foreign cases exist in group 4254**
   (all 165 `created_by = 3`). **WHY NOTHING WAS WRITTEN even for the build-independent fixes:** every
   touched case owes a Rule-54 re-stamp, and a write today would either leave a dead build marker on a
   freshly-updated case or claim an observation we did not make — so the 16 formatting repairs, the 2
   false "no ticket yet" sentences, the 165 provenance re-stamps and the 165 automation markers are ALL
   staged as **ONE write per case** in `recheck-2026-08-05/WRITE-PLAN.md`. **Option (ii) — the 142
   build-independent markers — is no longer worth taking: 2 of the 19 "expect fail" cases have changed
   since.** **ESTABLISHED LIVE:** spec **CURRENT at Confluence v23**, proven by word-diff of the live body
   (**0 runs of 6+ words present live and missing from our mirror**) — **and its in-body "Version" field
   reads `1.0`, the Rule-31(a) trap confirmed live**; epic **SV-8685 = 26 direct children**, verified two
   ways with equal key sets, changelog's last entry administrative only (Stefan Vukovic, Severity + QA
   Test Plan, 2026-08-04T07:07); **all 10 of our tickets SV-8848…SV-8857 STILL OPEN, none fixed** (only
   Mudassir Qamar adding label `FS-Schedule`). **FOUR CORRECTIONS TO OUR OWN RECORD:** the epic has **26**
   children not 28; the 12 tickets we recorded as epic-level Bugs are **`Story Defect` SUBTASKS of the
   stories**; the SV-8826–8841 range is **16** tickets of which **4 are not Schedule at all** (2 Ahtasham
   Filters defects on SV-8795, 2 Ryan Fyfe unparented Bugs); and there are **22 story defects, not 12** —
   10 arrived after our ingest (7 Ayesha Khan, 3 Mudassir Qamar on 5 Aug). **TWO ASKS ANSWERED WITHOUT
   US:** [SV-8834](https://shopview.atlassian.net/browse/SV-8834) (Mudassir, 4 Aug 08:39) covers
   SCH-MODAL-03 = C30010 **exactly** — same `1h / 1h` symptom — **so the "eleventh ticket" would be a
   DUPLICATE and must not be filed**; and [SV-8874](https://shopview.atlassian.net/browse/SV-8874)
   (Mudassir, 5 Aug 05:26) now covers SCH-TOOL-03 = C30041, so **decisions-register entry 8 must stop
   calling it unticketed**. Both cases' text still says the fault *"has no developer ticket yet"* — **now
   false**, queued. **TWO OF OUR PASS VERDICTS ARE CONTRADICTED by accepted Ready-to-Fix defects and they
   are probably right (Rule 44):** SV-8873 vs C29939 (our evidence **never records which FORM of the
   technician name we typed**) and SV-8868 vs C29944 (**we proved Approved alone and called the filter
   good — one status is a sample, not the filter**; a Rule-50 exhaustiveness failure of our own). **THREE
   CANDIDATE COVERAGE GAPS** with no counterpart among our 165, found by reverse-coverage diff: SV-8863
   (which view the module opens on), SV-8870 (drag-create in Month view), SV-8867 (reassigning a series
   member) — **not authored**, needs authorisation + live observation. **STILL UNKNOWN and most wanted:**
   whether any of the **4 not-built** features shipped in this deploy (SCH-API-02 C38873, SCH-DND-08
   C29962, SCH-EVT-02 C30017, SCH-SPREAD-11 C38863) and whether the **2 un-settable** rows (SCH-EDGE-07
   C38865, SCH-START-02 C29970) can now be seeded. **MARKERS: 0 of 165**; all 165 provenance lines name
   `v3.5-4873abe` + `8/4/2026`, exactly once each, none doubled. **Arithmetic gate not runnable yet;
   target recorded = READY + READY-EXPECT-FAIL must equal 157** (165 − 2 PO − 2 un-settable − 4
   not-built), **and it will move if a not-built feature shipped or a contradicted PASS flips.**
   **16 raw-markup cases CONFIRMED by searching all 165** (not by trusting the count), all named with
   C-ids. **DELIVERABLES: nothing regenerated, deliberately** — live **165** = local active **165** (192
   bodies − 27 retired) = id-map **165** (0 blank C-ids, `refs` 165/165) = import **165** rows; **id-map
   C-ids vs live sets equal BOTH directions**; **local vs live text 0 field mismatches** across all 165;
   **shredding guard PASSED**; import header **sha256 `a45eae40ec73b8ac` identical to all five peers** — a
   rerun would only blank the id-map C-ids and drop `refs` for no gain. **`READINESS-2026-08-05.md` was
   DELIBERATELY NOT WRITTEN** (a readiness report is a statement about a build we could not see);
   **`READINESS-2026-08-04.md` is KEPT and banner-marked "its verdicts are no longer confirmed" rather
   than SUPERSEDED, because there is nothing newer to supersede it with.** **NEEDED FROM THE QA LEAD:
   fresh `sv_sso_session` / `PHPSESSID` / `cf_clearance` for `.qa.shopview.com` — that is the only
   blocker; every other source is current and proven current.**
   **PRIOR STATUS 2026-08-04 (FIRST-EVER LIVE VIU DONE on QA branch `sv8685`, then RECOVERED +
   FINISHED after the worker was cut off mid-wrap-up; resume `build/schedule/READINESS-2026-08-04.md`
   then `build/schedule/recovery-2026-08-04/STATE.md`):** all **165 cases carry a DEFINITE verdict** —
   **138 PASS / 19 DEVIATION (ticketed) / 4 NOT-BUILT / 2 HELD (shop closures) / 2 un-settable on this
   estate** — **zero partly-observed, zero unobserved**, counted two independent ways (the execution
   log and a re-read of the live case text) which agree area-for-area. Build **`v3.5-4873abe`**,
   `index.html` last-modified Tue 04 Aug 2026 14:47:39 GMT, etag `9b4b1fc776ebbfb04a9a0ca051d847f7` —
   **identical at start, mid-run, end AND at the recovery re-read, so NO redeploy**. **Provenance now
   at Rule-54 STATE 2 on 165/165** (build date + marker), each exactly once. **179 `update_case` ops
   total (169 by the original worker + 10 in recovery), ALL HTTP 200 + byte-verified MATCH, 28 fields
   compared each, 0 mismatch; run 357 proven untouched BOTH times** (include_all false, 165 tests, all
   **429** result records present BY ID, case_id sets equal both ways). **10 defects filed SV-8848…
   SV-8857** — all **priority Low, parent SV-8685, owning story linked, Open** (Rules 52/53), each
   read back from Jira. **⚠️ THAT IS THE PRE-2026-08-05 `Bug`-on-the-EPIC CONVENTION — correct for its date,
   NOT the shape required now: Rule 52 was AMENDED 2026-08-05 to require a `Story Defect` parented to the
   OWNING STORY, so read this line as a historical record and Rule 52 for today's shape.** **AND IT HAS SINCE
   MOVED (re-read LIVE 2026-08-05): NINE of the ten — SV-8849…SV-8857 — are now `Story Defect`s parented to
   their owning stories with **Product Area NULL**, converted by others; only **SV-8848** is still a `Bug`
   with Product Area Schedule, and **its parent was REMOVED** (Mudassir Qamar, 2026-08-05T09:21:39 −0500,
   SV-8685 → None), so it now has NO parent. All ten remain Open / Low.**
   **Epic is now 28 children** (15 stories all `Ready for QA`, SV-8812 **Done** =
   this branch, **+12 Bug tickets SV-8826…SV-8841 raised 2026-08-04 by Mudassir Qamar** — 6 confirmed,
   2 don't reproduce as written, 2 contradict Branko's own rulings [SV-8835 VIN / SV-8829 money] where
   **Rule 33 means the rulings STAND and nothing was changed on either side**, 1 = SV-8831 a REAL gap
   we missed). **1 API-only finding written up NOT filed** (Rule 51, `viu-2026-08-04/API-ASK.md`).
   **⚠️ Rule-49 queue OPEN — branch NOT declared final, so all 165 verdicts are PROVISIONAL.**
   **RECOVERY caught 5 half-states** (`recovery-2026-08-04/STATE.md`): (1) a **pre-existing shift
   `ebdd3e03…` left on the WRONG technician and 450 min short** by the Day-view drag test — **RESTORED
   and proven byte-identical on all 14 fields**, series total back to 1980 min *(lesson: a restore
   isn't restored until compared FIELD BY FIELD)*; (2) the **generated import was corrupt — a newline
   between EVERY CHARACTER** of preconds/steps/expected in all 165 rows, because `gen_import.py`'s
   `joinlines()` did `"\n".join(x)` over a **string** where the live-resync now writes strings not
   lists — **FIXED in `gen_import.py` (it now splits a string first) + regenerated**; ⚠️ **the SAME
   bug corrupted `testrail-import/filters-v1-testrail-import.csv` (all 110 rows) — NOT fixed here,
   out of scope, needs the same one-line fix in the Filters generator**; (3) local source stale for
   the 4 audit-fix cases; (4) **17 cases said a defect "has no developer ticket yet" when 8 of them
   DID** — 10 cases corrected so all 10 filed tickets are now named on their case; (5) 2 cases leaked
   dev jargon (a PATCH endpoint / a payload flag + HTTP codes) into tester text in **non-API sections**
   — cleaned, so **0 cases now carry API content outside the API section**. **Reported NOT changed:
   16 cases show raw `<ol>/<li>` markup to the tester (PREDATES this pass — same 16 in the pre-write
   snapshot; a repair = 16 writes, needs go-ahead)** and **SCH-MODAL-03 = C30010 is a real deviation
   with NO ticket and, until entry 19, no register entry** (the time-logged bar reads full when
   nothing was clocked — an 11th ticket is the ask). Env left clean: 3 ZZAUTOTEST roles already
   deleted, borrowed staff (Henry Hess) back on Technician, seeded shifts gone, working hours + the
   location business-hours toggle byte-identical to the snapshot. Deliverables:
   `READINESS-2026-08-04.md` (one table, 29 rows, **every row sums**, 161 of 165 automatable now),
   `viu-2026-08-04/{FINDINGS,COVERAGE-REDERIVATION,AUDIT,GAP-HUNT,SURFACE-MATRIX,DELIBERATE-DECISIONS
   [22 entries, HIGH 3/MED 7/LOW 12],RECHECK-QUEUE,API-ASK,SOURCE-CURRENCY}.md`,
   `recovery-2026-08-04/{STATE,testrail-execution-log}.md`, and the refreshed
   `provenance-2026-08-04/PO-RULING-DEFENCE.md` (all 4 Branko rulings re-confirmed LIVE).
   **Prior STATUS 2026-08-04 (STANDING RULE 54 PROVENANCE RETROFIT EXECUTED, user-authorized;
   resume `build/schedule/provenance-2026-08-04/`):** all **165/165** cases end their Expected
   Results with a plain provenance sentence naming **epic SV-8685** + the **Schedule specification
   version 23** + the case's own § anchors — **state 1 then (NO build date; superseded by state 2
   above once the branch arrived)**. `update_case` ONLY: 165 ops, every one HTTP 200 + **byte-verified MATCH, 28
   fields compared each**, every unintended field proven byte-identical (Rule 50). **Run 357 verified
   untouched** — 165 tests set-equal both ways, **all 429 result records present BY ID**,
   include_all still false. **Rule-41 whole-case re-read of all 165** produced 1 fix (SCH-HRS-04
   C38849 `(/02)` leak) and **0 other defects** (0 stale anchors, 0 over-80 titles, 0 Rule-4
   misplacements). **Rule-28 cross-case sweep: 0 contradictions.** **Honesty variants: 5 PO-ruling ·
   3 spec-states-it-BOTH-WAYS-with-no-ruling (2 HIGH risk: shop closures) · 2 tech-plan limits ·
   5 no-spec-anchor · 150 plain.** Defence register (quote-ready if challenged):
   `build/schedule/provenance-2026-08-04/PO-RULING-DEFENCE.md`; source currency
   `SOURCE-CURRENCY.md`; per-op audit `testrail-execution-log.md`. **Spec version is ONE generator
   constant** (`tools/classify.py`), and the stamper is **idempotent** (proven over 3 runs) — a
   re-stamp REPLACES the line, never appends.
   **STATUS 2026-07-31 (three-dimension Ruthless Usefulness Audit RUN + consolidation
   EXECUTED; audit dir build/schedule/quality-audit-2026-07-31/):** 190 → **165 ACTIVE**
   (49/49 TestRail ops verified — 20 merge groups + 2 cuts + 6 sense repairs); audit tally =
   **0 nonsense + 0 missing-traceability**. **PENDING:** ~~79 title trims~~ (**DONE —
   re-measured live 2026-08-04: 0 of 165 titles exceed 80 chars, longest is exactly 80**).
   **PRIOR STATUS: TestRail SYNC EXECUTED 2026-07-22 (user-authorized, incl. delete) — the staged
   spec_1+design+Branko reconciliation is now LIVE in TestRail: 7 update_case + 2 add_case +
   1 delete_case, ALL HTTP 200, ALL re-GET verified MATCH; run 325 untouched, only group 4254
   touched, no secrets committed. 7 updates: SCH-MODAL-04 (C30011)/MODAL-08 (C30015)/CONF-02/03/04
   (C30024/25/26)/VIEW-04 (C30045)/TIP-01 (C30034) [SCH-CONF-01/C30023 notes-only, NOT pushed].
   2 adds: SCH-PERM-12 = C30614 (Permissions §4279) + SCH-EVT-08 = C30615 (Events §4269), both
   custom_atmstatus:3/custom_automation_type:0, non-API. 1 delete: SCH-REAS-02/C30053 (modal-Reassign
   removed; drag-reassign covered by SCH-REAS-01/C30052) — verified gone, body kept locally Retired.
   Tally now 168 authored / **167 ACTIVE** (SCH-REAS-02 Retired/deleted). Deliverables regenerated
   over 167 (import 167 rows VIU/flag-word-free header byte-identical; id-map 167 ALL C-ids populated
   incl. C30614/C30615; ⚠️ gen_import.py blanks id-map C-ids + excludes Retired on rerun — re-merge).
   Executor build/schedule/exec_sync_2026-07-22.py; per-case audit log
   spec-v1-2026-07-22/testrail-execution-log-2026-07-22.md; manifest header = EXECUTED.
   Design NO LONGER MISSING (Claude prototype Schedule.dc.html authoritative, Branko Q0). Applied
   edits: 6 expected-result edits (MODAL-04 no $/labor, MODAL-08 Delete-only, CONF-02/03/04 per-tech
   configured hours hierarchy, VIEW-04 "VIN Number" toggle=block-only) + VIN §4.13-vs-§9 RESOLVED
   (design §6; §9 prose flagged to Branko) + Q1 events-excluded may-change notes + ~48 design-pinned
   labels folded (~18 still need LIVE confirm).
   NEXT = live VIU pending QA branch (OQ-3) + Epic key (OQ-2); Rule 12 design-pinned ≠ VIU-Verified.
   Prior: CASES
   AUTHORED 2026-07-21 166/26 SPEC-ONLY adversarial-reviewed CLEAN; IMPORTED TO TESTRAIL
   2026-07-21 (group 4254 "Schedule - 2026 (VIU Pending)", child sections 4255–4280).
   Canonical resume doc: build/schedule/PROJECT-STATE.md §0.0-APPLIED.** Same rules as all projects:
   reuse shared infra (BUILD-ACCURATE-WORDING-VIU-PROCESS,
   SPEC-RELEVANCE-RECONCILIATION-PROCESS, TESTING-RUNBOOK, harness/TestRail patterns);
   deliverable/import format pure 1:1 with testrail-import/*-testrail-import.csv
   (Standing Rule 16); no TestRail writes without explicit permission (Standing Rule
   6); per Standing Rule 11 ASK which process(es) to run before any VIU pass.
7. **Report Suite project** — Reporting suite (ShopView App): ONE project, SIX
   reports, each with its own spec — (1) SBC Sales By Customer, (2) SBR Sales By
   Representative, (3) Parts Velocity, (4) Technician Utilization, (5) WIP Work In
   Progress, (6) Inventory Value.
   **PO: Chris Ward** (same PO as Fees & Discounts — never mix attributions: Report
   Suite = Chris Ward; Global Search/Filters/Schedule = Branko; Simple Flow = Milos).
   **Epic/Jira key = SV-8582** (ingested 2026-07-27 via Atlassian MCP — epic Open, 97
   child stories SV-8583→SV-8679, branch `project/reports-suite-bravo`, QA Nebojsa +
   Viktoria; **reconciled: the 97 stories MATCH our 515 cases 1:1, no new user-facing
   cases needed** — sources build/report-suite/epic-sv8582/INGEST-SUMMARY.md +
   RECONCILIATION.md; **Chris PO-questions doc READY:
   build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-27.md/.xlsx** — SBR Esc
   vs Golden-Rule, permission-model confirm, confirm-no-designs; ~3–6 backend/regression
   cases deferred to the QA branch). OPEN = QA branch/env + flag state + Chris's answers.
   **⚠️ Designs: NOT YET AVAILABLE** — spec-only authoring (Rule 9 wording from the
   spec's verbatim labels, "VIU-confirm" anything unpinned; design-reconciliation
   later if designs arrive). **Specs WILL keep changing** — run
   SPEC-RELEVANCE-RECONCILIATION per update (ALWAYS ASK first, Standing Rule 11).
   **Canonical spec URLs (Confluence, Atlassian-SSO login-walled — reference pointers
   only, do NOT fetch; content ingested from the exported .doc MHTML files):** all six
   under https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/
   — SBC `577634305/SBC+Sales+By+Customer+Report` · SBR
   `585629698/SBR+Sales+By+Representative+Report` · Parts Velocity
   `620888066/Parts+Velocity+Report` · Technician Utilization
   `641400833/Technician+Utilization+Report` · WIP
   `703660034/WIP+Work+In+Progress+Report` · Inventory Value
   `720142338/Inventory+Value+Report` (full URLs in each spec file's header +
   PROJECT-STATE §1).
   **TestRail structure (user-prescribed):** ONE main section "Report Suite" → a
   SUBSECTION per report (named after the report) → that report's cases inside;
   API-content cases in "<Report> — API" sections per Rule 4; import pure 1:1 per
   Rule 16 (Section column = report name; the user's import creates the parent group).
   **CANONICAL STATE DOC (read first for resume):** `build/report-suite/PROJECT-STATE.md`
   — single authoritative snapshot (per-report spec inventory + readiness snapshot,
   TestRail structure, open questions OQ-1..7, how-to-resume).
   **STATUS 2026-08-06 LATE (NEWEST — THE COUNT MOVED AND THREE CLAIMS BELOW ARE SUPERSEDED. Session 6,
   commits `0446f226` / `a1c38d38`; resume `build/report-suite/full-viu-2026-08-06/RESUME.md`):**
   **THE COUNT IS NOW 403 OF 476 VERDICTED · 73 OUTSTANDING** (403 + 73 = 476), re-derived from live
   TestRail and **set-equal in BOTH directions** to the handover list. **⚠️ THE BLOCK IMMEDIATELY BELOW
   SAYS "200 OF 476 OBSERVED / 276 STILL OWED" — TRUE WHEN WRITTEN, NOW SUPERSEDED**; the superseded
   figures are kept visible and dated rather than overwritten. The branch has since moved to
   **`v3.5-f77875c`** (last-mod Thu 06 Aug 2026 10:43:37 GMT, etag `829ed03832a746e78cbdb28eb9957a3e`),
   so **only 51 of the 476 verdicts rest on the build now running** — the rest carry their own honest
   earlier build line, which under Rule 60 is the record, not a defect.
   **TWO FURTHER CLAIMS BELOW ARE STALE, BOTH DISPROVED BY A FULL LIVE CENSUS OF ALL 476:**
   **(a) "12 with NO plain-text marker … raw-markup cases"** — the census found **0 raw markup and
   476/476 carrying exactly one marker and one provenance line** (**330 READY · 103 READY-EXPECT-FAIL ·
   43 HOLD**); the 12 named cases were re-read individually and are clean.
   **(b) "8 cases still carry NO build line at all"** — it is **5** (C30278, C43550, C43551, C43558,
   C43559), and it is **NOT a defect**: each says in its own text that it has not yet been checked
   against any build, which is exactly what Rule 60 requires.
   **THE EPIC MOVED 105 → 104 CHILDREN, AND THE CAUSE IS KNOWN:**
   **[SV-8821](https://shopview.atlassian.net/browse/SV-8821) was closed OBSOLETE and had its PARENT
   STRIPPED at 14:23:46Z**, and **SV-8822 likewise** — both under **our own shared account**, so
   somebody was tidying closed tickets off the epic. **LEFT EXACTLY AS FOUND (Rule 53's corollary —
   his edits are indistinguishable from ours in the changelog, and nobody may "restore" them).** A
   sweep of all 476 cases confirms **neither ticket is named on any case**, so **nothing downstream is
   affected**. **All six specs re-read live and NONE moved** (SBC 15 · SBR 17 · PV 5 · TU 6 · WIP 9 ·
   IV 4). **0 cases were closed this session — the sign-in died estate-wide 80 minutes into it, and a
   verdict is an observation (Rule 12), so nothing was inferred to pad the number; 0 TestRail writes
   even though `update_case` was authorised.** **`AND A RULE-49 QUEUE NOW EXISTS`** — see the
   correction note on the queue-state pointer near the top of this file.
   **STATUS 2026-08-06 (SUPERSEDED IN PART BY THE BLOCK ABOVE — THE LIVE-OBSERVATION PASS: 200 OF 476
   OBSERVED ON `v3.5-16cf83f`,
   276 STILL OWED, THREE REPORTS FINISHED. Resume `build/report-suite/full-viu-2026-08-06/RESUME.md` →
   `{FINDINGS,CHANGES-MADE,FILED,TICKET-SOURCE-BLOCK,COMMIT-COLLISION-2026-08-06}.md` + `REMAINING.txt`
   + `verdicts.json` → `build/report-suite/PROJECT-STATE.md`):** build **`v3.5-16cf83f`** (last-mod Wed
   05 Aug 2026 06:40:32 GMT, etag `177c59546701e7810b894492dabc1423`, `index.html` sha256
   `67932a75…`), read at the start of every batch and at the end — **byte-identical every time, no
   redeploy under any batch**. **Sources re-fetched live: SBC v15 · SBR v17 · PV v5 · TU v6 · WIP v9 ·
   IV v4 — none moved**; epic **SV-8582 = 105 children**, verified two ways with equal key sets and no
   paging remainder. **THE HONEST HEADLINE: 200 of our 476 cases carry a verdict established against
   this build; 276 do NOT — they carry markers and verdicts inherited from earlier passes and say so on
   themselves. THE ARITHMETIC GATE IS NOT CLAIMED TO PASS AND MUST NOT BE.** 200 + 276 = 476.
   **INVENTORY VALUE, PARTS VELOCITY and TECHNICIAN UTILIZATION ARE FINISHED** — every one of their
   68 + 71 + 57 cases carries either a verdict or a written not-observed reason. **THE 276 REMAINING
   BREAK DOWN AS: SBR 109 (not started) · WIP 67 · SBC 58 · plus 42 already recorded NOT OBSERVED WITH
   WRITTEN REASONS and an `AUTOMATION: HOLD` marker already on them (IV 9, PV 26, TU 7)** — a reason is
   not a verdict, so they stay in `REMAINING.txt`. **Count by case id, never by line** (`grep -oE
   'C[0-9]{5}' REMAINING.txt | sort -u | wc -l` = 276). **NEXT ACTION: Sales By Customer (58), then
   Sales By Representative (109), then Work In Progress (67).** **LIVE MARKER CENSUS: 426 `READY` · 38
   `HOLD` · 12 with NO plain-text marker = 476** — and **only 200 of those markers rest on this build.**
   The 12 are the **raw-markup cases**, all now in **Work In Progress** (C30451, C30456, C30457, C30460,
   C30487, C30490, C30491, C30493, C30519, C30522, C30526, C30528): their marker exists but is wrapped
   in `<p>` tags, so it is not machine-findable. **8 cases still carry NO build line at all** (C30278,
   C38856, C43550, C43551, C43553, C43557, C43558, C43559 — C43552 was given one in batch 7).
   **OUR OWN DEFECT, OWNED AND REPAIRED IN THE SAME SESSION: C30341** stores its text as raw HTML, none
   of the writer's plain-text patterns matched, so instead of REPLACING the provenance line and the
   marker it **APPENDED a second one of each — and the byte-check PASSED, because the write was faithful
   to the payload; the payload itself was wrong.** Found by a census of all 476, not by chance;
   converted to plain numbered text with **not one word of meaning changed**, and `rebuild()` now
   **REFUSES outright** on any case containing raw markup. **TWO THINGS THAT LOOKED LIKE DEFECTS AND
   WERE NOT, mechanism established first:** the **~10,000-row export refusal is DELIBERATE and is in the
   epic** ([SV-8591](https://shopview.atlassian.net/browse/SV-8591) *"Export contract + 10k row-cap
   guard"*) — an epic story is a source of expected behaviour under Rule 57, so the cap is **expected**,
   and **none of the six specifications mentions it**, which is a documentation gap for Chris recorded
   as a **question**, not a defect; and the **header-click sort is CORRECT** — the first read was a stale
   snapshot four seconds after the click. **THE WORK IN PROGRESS EXPORT WAS REPRODUCED AT LAST, and the
   earlier failure to reproduce was our own input shape: WIP uses `from=`/`to=` with full ISO instants,
   NOT the other five reports' `range=` parameters** (shape taken from the product's own download menu
   via a request listener, not guessed). It returns **HTTP 500 on every non-empty tab, both formats** —
   2 rows fail exactly as 65 do, so it is **presence of rows, not size** — and **HTTP 200 with a real
   file when the window is empty**; already covered by
   [SV-8907](https://shopview.atlassian.net/browse/SV-8907), so **no new ticket**. **29 Story Defects
   filed** (SV-8925–SV-8940, SV-8943–SV-8956), all in the Rule-52 shape (issuetype 10007 · parent = the
   owning story · priority **Low** · `relates to` the same story), every field read back with 11 checks
   each all PASS; plus **one authorised edit to SV-8937**, WIDENED to three reports rather than
   duplicated, with two new `relates to` links and 16 field checks read back. **0 edits to anyone
   else's ticket.** **Run 359 PROVEN UNTOUCHED** — `include_all` false, 476 tests, sets equal both
   directions, **all 535 results present BY ID, 0 new, 0 non-echo field changes**; the only movement is
   **`case_title` on 2 results of the one case we were authorised to retitle (C30102)**, the declared
   read-time echo. **THE PERMISSION CASES ACROSS EVERY REPORT STILL CANNOT BE DRIVEN** — one session on
   this estate, shared with a sibling worker, and both `quick-login` and `switch-user` rotate it.
   **⚠️ THIS PASS OPENED NO RULE-49 QUEUE FILE**, so its 200 verdicts are queued nowhere — the four
   older Report Suite queues (`full-viu-2026-08-05`, `chris-newreqs-2026-08-05`, `final-viu-2026-08-05`,
   `viu-2026-08-03`) are all still OPEN, the branch is **NOT declared final**, and **all 476 verdicts
   are PROVISIONAL.**
   **DEFECT-TICKET TOTAL ACROSS ALL PROJECTS** (source-block retrofit pass,
   `build/ticket-source-blocks-2026-08-06/`): **66 tickets in our own records** · 1 skipped by instruction
   (**SV-8923**, withdrawn as a false defect, no legitimate source) · **65 IN SCOPE** · 1 already
   carried a block (SV-8937, untouched) · **64 BLOCKS WRITTEN**, all 65 re-read live after the writes =
   **65 PASS / 0 FAIL**, one block each, description above it byte-identical, no other field changed.
   Source types: **61 the specification · 2 a PO answer with tab + row · 0 an epic story**. **2 HAVE NO
   DOCUMENTED SOURCE AND THEIR BLOCKS SAY SO — [SV-8821](https://shopview.atlassian.net/browse/SV-8821)
   and [SV-8822](https://shopview.atlassian.net/browse/SV-8822)** — and **5 more are only PARTLY
   supported**; every one is written up decision-ready in
   **`build/ticket-source-blocks-2026-08-06/FLAGGED.md`** with what it claims, what the build does,
   exactly where we looked and found nothing, what the expectation really rests on, a recommendation,
   and the cases affected. **Nothing had a source invented for it.**
   **PRIOR STATUS 2026-08-05 LATE (THE EXPECTED-BEHAVIOUR CORRECTION: WE HAD BEEN TREATING BUILD
   BEHAVIOUR AS EXPECTED BEHAVIOUR. Resume `build/report-suite/expected-behaviour-audit-2026-08-05.md`
   → `build/report-suite/final-viu-2026-08-05/ADDENDUM-SPECS-MOVED-AGAIN.md` **(read the addendum before
   acting on anything)** → `final-viu-2026-08-05/{SOURCE-CURRENCY,FINDINGS,testrail-execution-log,
   RECHECK-QUEUE,DELIBERATE-DECISIONS,OUTSIDE-IN,API-ASK,DELETIONS}.md` → `READINESS-2026-08-05.md` →
   `rulings-2026-08-05/FOLLOW-UP-QUESTIONS-ROUND-2-2026-08-05.md`.)** The QA lead's ruling, verbatim:
   *"The expected behaviors are NOT the ones 'how the build is behaving'… From the Build we are JUST doing
   the VIU… I am shocked to see that how come you considered the Build behavior as the expected behavior?"*
   plus *"'the case should be matched to the build' … meant that the test case should be VIU'd from the
   build"* — **labels and steps from the build, NEVER the expectation; if the expectation bends to whatever
   shipped, the case can no longer fail and a test that cannot fail is not a test.** **ALL 473 AUDITED, no
   sampling: A 16 · A\* 2 (spec states it both ways) · B 8 · C 440 · D 7.** **The systemic error was ONE
   Location-column boilerplate paragraph pasted into 14 cases across all six reports**, contradicting
   PV S3-R10 / TU S10-R4 / WIP S4-R3 / IV S7-R6 / SBR S20-R1 — **and it had overwritten wording that was
   RIGHT** (C30352's line was PV S3-R10 almost verbatim, recorded in a manifest as "wrong under both
   readings"). **Three of our own suspicions were WRONG and the specs cleared them** (C30356, C30336,
   C30384); **C30265 is correct as written and was deliberately NOT changed** though the brief asked.
   **Rule-41 forensics over all 41 commits touching the case source: NO pass ever changed a case's steps
   and its expectation body together, and the two pure VIU passes changed ZERO expectations — the
   contamination entered via an ANSWER-INGEST pass where an ambiguous PO answer met an observed build and
   the observation won.** **473 × `update_case`, every one HTTP 200 + byte-verified, 30 fields compared,
   0 mismatch, 0 collateral**, plus a **15-case second pass** fixing provenance lines that said the PO
   overrode the spec while the body followed the spec. **MARKERS NOW ON 473/473, exactly one each, last
   line: 423 READY · 17 READY-EXPECT-FAIL · 33 HOLD; gate 423+17 = 440 = the readiness figure** (before
   this pass **453 carried NO marker** and two styles coexisted on the other 20). **Run 359 PROVEN
   UNTOUCHED — 469 tests, 535 results (not 532: the owners logged 3 more before we started), all present
   BY ID, 0 graded-field changes, 0 echo changes, 0 new during our window; the 5 foreign cases
   byte-identical incl. `updated_on`/`updated_by`.** **Four counts set-equal BOTH ways at 473; import
   header sha256 == all 6 peers.** **⚠️ THE SHREDDING BUG FIRED AGAIN — all 473 import rows came back with
   a newline between every character (`joinlines` iterating a string after the live re-sync); FIXED in
   `build/report-suite/gen_import.py`, guard now 0; the generator also blanked all 473 id-map C-ids and
   dropped `refs` — both re-merged from live, 0 blanks, refs 473/473.** **NEW PLAYBOOK FACTS: `case_refs`
   is a SECOND read-time echo on run results alongside `case_title`; and the reports export needs
   `variant=summary|expanded`.** **LIVE ON `v3.5-16cf83f` (session alive — the previous two passes got
   401; `quick-login` never called): the SBC Summary CSV carries a Location column with BOTH locations
   selected and NOT with one, so the build follows the in-scope model; the two brand-new v14 requirements
   S20-R19a and S20-R19 are ALREADY correctly built; S14-R14 filenames, the UTF-8 BOM and the
   `"Locations:"` line all met; S15-R15 met (1 embedded image, 0 URLs); SV-8823 STILL REPRODUCES
   (`$224.92`, `90.5%`); and NEW-UNTICKETED: the server rejects `last_12_months` (v14's new first preset)
   while still accepting `today`/`yesterday` (both deleted) — ASKED not filed (Rule 51).**
   **🔴 CHRIS WARD EDITED ALL SIX SPECS DURING THE PASS AND PART OF IT IS ALREADY REVERSED:** SBC v13→**14**
   (13:07Z) · PV v4→**5** (13:21Z, one minute before it was fetched) · then **SBR v15→16 · TU v5→6 ·
   WIP v6→7 · IV v3→4 between 13:55Z and 14:23Z**, all messaged *"Applied QA review workbook decisions"*.
   **All four now ratify the ACCESS-GATE + TOGGLEABLE Location model and the exact anchors this pass cited
   have FLIPPED (TU S10-R4, WIP S4-R3) — so the boilerplate we removed is now, for those reports, what the
   spec says.** The audit was right against the sources at 13:20–13:55Z and is **partly overtaken**.
   **The cases are SAFE because all 16 carry `AUTOMATION: HOLD` naming the open question.** **Four of six
   specs STILL state it both ways (SBR S21-R7, WIP S7-R13, IV S7-R6, SBC S13-R4) and PV was never touched
   on this point.** **OWED: re-diff the 4 moved specs, re-repair the 13 cases to the toggleable model,
   re-stamp SBR→16/TU→6/WIP→7/IV→4, and ask Chris to finish the four leftover contradictions.**
   **LESSON (Rule 31): re-read the sources immediately BEFORE the writes begin, not only at pass start.**
   **Build `v3.5-16cf83f` byte-identical at 13:20:39Z, 13:55:25Z and 14:23:34Z. Rule-49 queue OPEN — all
   473 verdicts PROVISIONAL; this pass was NOT a per-case live VIU of all 473 and does not claim to be.
   0 deletions. 0 tickets filed. 4 of our cases (C43550–C43553) are still absent from run 359 and
   `include_all` is false.**
   **PRIOR STATUS 2026-08-05 (CHRIS'S ANSWERS APPLIED + 4 NEW CASES + 3 DEFECT TICKETS; resume
   `build/report-suite/approved-writes-2026-08-05/` — read `THE-46-EXECUTED.md` first, then
   `TASK-A-UNSUPPORTED-FREEZE-LINE.md`, `TASK-B-NEW-CASES.md`, `TASK-C-TICKETS-FILED.md`,
   `API-SPLIT.md`):** all four QA-lead authorisations executed. **TALLY: 473 ACTIVE OURS** (469 + 4 new;
   live under group 4281 = **478** incl. **5 foreign** by Vladimir Tomovic C38919–C38923, proven
   byte-identical incl. `updated_on`/`updated_by`, Rule 38). **56 TestRail ops total, ALL HTTP 200, 30
   fields compared each, 0 mismatch, 0 add-beyond-the-4 / 0 delete / 0 section / 0 run writes.**
   **(a) The 46 staged Chris-answer edits EXECUTED + 4 corrections = 50 ops** — **ops for C30470/C30485/
   C30500 were RE-DERIVED, not pushed as staged: they invented a "then plate" fallback and `plate`
   appears 0 times in the live WIP spec v6** (fetched live; the spec specifies PLACEHOLDERS `"(no unit
   #)"` / `"— no VIN —"`), so as staged they would have failed a correct build; C30516's provenance
   likewise corrected (S9-E1 AGREES). **The 4 WIP identifier cases carry the HONEST divergence** — spec
   + build agree and it is Chris's **29 July** answer that differs (given against a question that
   mis-described the report); **inventing a spec conflict is itself a defect**. **C30525 WIP-VIS-07 never
   entered the write set** (hard assertion; `updated_on` unchanged) — it was right all along and
   contradicted 4 of our cases for 7 days. Also corrected: **PV-COL-02 C30352** (an EIGHTH live-and-wrong
   location case the manifest missed), **WIP-COL-01 C30466 precondition 4**, and **3 TITLES** (C30470/
   C30500/C30485) that still asserted the plate against their own corrected bodies. **C30134 keeps its
   plate — ratified SBC v13 S8-R9.** Held **47→16**: the **11 genuinely blocked** now cite the live
   `rulings-2026-08-05/Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx` (4 of them were LIVE and
   unwarned and deliberately GAINED a hold); the other 5 keep their old hold correctly. The manifest
   would also have dropped the `---` separator from 39 cases (all 469 live carried it) — restored.
   **(b) 4 NEW CASES pushed: SBC-COL-04 = C43550** (single-ACCESS user never sees Location in the column
   list — real coverage the release would have shipped without) **· WIP-PERS-05 = C43551 · TU-EXP-10 =
   C43552** (two TU spreadsheet downloads) **· SBC-EXP-17 = C43553** (a logo SET BUT FAILING TO LOAD —
   a branch no case tested). **All 4 `AUTOMATION: HOLD`, none live-verified.** **N2 NOT AUTHORED —
   Chris's answer says both yes and no about the same person (gap U1).**
   **(c) TASK A: the unsupported waiting-on-PO line REMOVED from C30440/C30491 (replaced with an accurate
   developer-blocker line — neither has a ticket yet) and C30564 (already names SV-8820). C30186
   NOT TOUCHED — removal not provably correct; a real product question sits behind it that was never
   asked.** **(d) 3 DEFECT TICKETS FILED — SV-8879** (location chooser shown to a single-location user,
   all six reports; screenshot proven to render inline) **· SV-8880** (SBR Summary spreadsheet missing 4
   columns) **· SV-8881** (TU download menu wording) — all Bug/priority **Low**/parent **SV-8582**/owning
   story linked **Relates**/Product Area Reports & Dashboards; every field read back, 11 checks each ALL
   PASS; 7/7 sections; 0 barred phrases. **⚠️ THAT IS THE PRE-2026-08-05 `Bug`-on-the-EPIC CONVENTION —
   correct for its date, and all three tickets STILL CARRY EXACTLY THIS SHAPE LIVE (re-read 2026-08-05:
   Bug · parent SV-8582 · Product Area Reports & Dashboards · Low · Open, none converted). It is NOT the
   shape required for NEW tickets: see amended Rule 52 (a `Story Defect` parented to the OWNING STORY).** **B4 NOT FILED (blocked on Chris's contradiction) · B5 NOT FILED
   — NO LIVE EVIDENCE: the no-logo state was never produced** (*"the PDF logo fallback could not be
   exercised because this organisation has an uploaded logo"*). **Rule 51 checked item by item: none of
   the 5 is API-only.** **PROVEN READY-TO-AUTOMATE = 432** (401 + 35 released − 4 newly held;
   cross-checked 473 − 16 − 14 − 6 − 1 − 4). ⚠️ **`READINESS-2026-08-04-POST-DEPLOY.md` still says 401 —
   owned by another worker, NOT edited.** **Four counts reconcile 473/473/473/473 set-equal both ways;
   id-map 0 blanks; import header sha256 == all 5 peers; shredding guard PASSED.** **Run 359 PROVEN
   UNTOUCHED** — 469 tests, case_id sets equal both ways, all **532** results present BY ID; 3 differ in
   **`case_title` ONLY**, a DERIVED read-time echo of the case title on the 2 cases we were authorised to
   retitle (**new declared normalisation, recorded in APP-ACTIONS-PLAYBOOK §J**); every real result field
   byte-identical on all 532. **OUR OWN DEFECT, OWNED: `SBC-COL-03` was a RETIRED id (merged 2026-07-28)
   that the new-case pass reused, and the resync overwrote the retired record — restored byte-for-byte
   from git, the new case renamed `SBC-COL-04`; no TestRail write needed, C43550 unchanged.**
   ⚠️ **BUILD REDEPLOYED AGAIN: `v3.4.1-3d03023` → `v3.5-16cf83f`** (last-modified Wed 05 Aug 06:40:32
   GMT, etag `177c59546701e7810b894492dabc1423`; identical at start and end of the pass). **The sign-in
   died with it (401 `sso_required`) so NO application was opened — the Rule-49 queue
   `viu-2026-08-03/RECHECK-QUEUE.md` is OPEN with the 2026-08-05 trigger recorded, and all 473 verdicts
   are PROVISIONAL.** **OUTSTANDING: one sentence from Chris on the location column (unblocks 11 cases +
   N2 + ticket B4) · which automation marker to standardise on (16 `DO NOT AUTOMATE` vs 4 `AUTOMATION:
   HOLD`) · the readiness file needs 432 folded in · a line on the CLAUDE.md cross-project identifier rule
   (NOT touched) · a live logo check before B5 · fresh QA-branch sign-in.**
   **PRIOR STATUS 2026-07-28: AUTHORIZED FULL TESTRAIL PUSH EXECUTED ("Push ALL") — 459
   ACTIVE cases (515 − 57 deletes + SBC-EXP-16 = C38856; video edits + 9 sense-check repairs +
   41-group merge consolidation all live, 70 update / 1 add / 57 delete, ALL 200 + verified, 0
   failures; run R359 515→458 documented, never written; live count under group 4281 = 459 ==
   id-map). Resume = PROJECT-STATE.md §0 UPDATE 2026-07-28-B; audit =
   reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md.**
   **Prior STATUS: CASES AUTHORED + ADVERSARIALLY REVIEWED CLEAN 2026-07-22 — 515
   cases / 89 sections / 6 reports; import ready; NEXT = user import → C-id
   map → VIU.** (SBC 99 / SBR 127 / PV 70 / TU 59 / WIP 83 / IV 77; spec-only,
   all VIU-Pending; coverage 6/6 complete, every bullet mapped in
   `build/report-suite/coverage-*.md`; review fixes b410d29 + 82f1665, import
   REGENERATED post-review, full gate re-passed). **Unified import READY (pure
   1:1, header byte-identical 5/5 vs prior imports):
   `testrail-import/report-suite-v1-testrail-import.csv`/`.xlsx` via
   `build/report-suite/gen_import.py`; id-map 515 rows blank C-ids (⚠️
   gen_import.py rerun blanks C-ids — re-merge, same as Filters/Schedule).
   **PER-REPORT SPLIT 2026-07-22:** user manually created TestRail group 4281
   "Reports Suite" + six empty per-report subsections 4282–4287; six per-report
   split imports emitted with **HUMAN-READABLE filenames** (user rule — full
   report names, never cryptic abbreviations; renamed same day from the initial
   `-{sbc,sbr,pv,tu,wip,iv}-` slugs):
   `testrail-import/Report-Suite_{Sales-By-Customer-Report,Sales-By-Representative-Report,Parts-Velocity-Report,Technician-Utilization-Report,Work-In-Progress-Report,Inventory-Value-Report}_testrail-import.csv`/`.xlsx`,
   99/127/70/59/83/77 = 515, rows byte-identical to the unified file, verified;
   PROJECT-STATE §0.6). **IMPORTED + MAPPED READ-ONLY 2026-07-22: all 515 cases
   now live in TestRail under group 4281 "Reports Suite" (six report folders
   4282–4287 → 89 per-area leaf subsections 4288–4376); live read confirmed
   exactly 515 cases under 4281; execution run R359 "Reports Suite -
   Nebojsa/Viktoria (VIU Pending)" exists (515 tests, all Untested, NOT ours —
   no result writes without permission). testrail-id-map.csv now FULLY POPULATED
   — 515/515 matched by exact (section-leaf-name + title), 0 unmatched / 0
   ambiguous / 0 leftover, observed C-id range C30096–C30610; done read-only
   (get_sections + get_cases only), NO TestRail writes.** NEXT = VIU pending
   env/Epic (ask Chris Ward: TU S8 video inconsistency, IV export cap; Epic key
   ask-at-VIU; designs pending).** Specs will keep
   changing → Rule-11 reconciliation ask per update. Canonical resume doc:
   build/report-suite/PROJECT-STATE.md. Same rules as all projects: reuse shared
   infra (BUILD-ACCURATE-WORDING-VIU-PROCESS, SPEC-RELEVANCE-RECONCILIATION-PROCESS,
   TESTING-RUNBOOK, harness/TestRail patterns); Standing Rules 6/11/16 apply.
   **2026-07-28: the walkthrough VIDEO ruled AUTHORITATIVE (VP-created); video-driven edits applied
   LOCALLY with full pre-edit backups (build/report-suite/video-promotion-backup-2026-07-28/) +
   SPEC-WATCH deadline 2026-08-04 — if Chris Ward has NOT ratified the video items into the 6 specs
   by then, REMIND THE USER (build/report-suite/SPEC-WATCH-2026-07-28.md); ruthless usefulness audit
   run 2026-07-28 (build/report-suite/quality-audit-2026-07-28/).**
   **2026-07-29 Chris ruling (DURABLE, all projects' reports + all future work): the asset
   identifier chain VIN → Unit # → plate is the STANDARD everywhere — WIP included (his answer "A
   is the correct answer" to the WIP question; verbatim "Not just for these specs though -- really
   good to keep this in mind for all actions moving forward"). Terminology caution: VIN = VEHICLE
   identification number — for non-vehicle assets (e.g. a generator) the value is effectively the
   serial number; keep the build label "VIN" + a short plain tester note. Source
   build/report-suite/chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md; WIP-COL-05
   C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485 / WIP-EXP-07 C30516 flipped LOCALLY, wave-2
   push queue = 4 update_case awaiting authorization; Chris's spec edit NOT hand-reviewed — the
   changelog re-diff must confirm the WIP identifier text (SPEC-WATCH deadline 2026-08-04).**

**STANDING RULES (apply to all projects):**
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
62. **NO JIRA TICKET IS EVER CREATED WITHOUT THE QA LEAD'S EXPLICIT PERMISSION, ASKED FOR AND GRANTED
    FIRST (all projects, every ticket type).**
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

## Project purpose (Custom Roles project)
Manual test-case authoring + live staging (Verify-in-UI) verification + TestRail
management for ShopView **"Custom Roles and Permissions"**, plus related
regression / bug-fix re-testing.

## Durable key facts (detail → runbook)
- **Staging topology:** `app.staging.shopview.com` = SPA frontend;
  `api.staging.shopview.com` = Symfony JSON backend.
- **PRODUCTION access & fix-verification (app.shopview.com, prod test org 72b2cc90…):** see
  build/APP-ACTIONS-PLAYBOOK.md **§K "PRODUCTION access & fix-verification"** (proven 2026-07-29,
  SV-8721) — prod login/session gotchas, canned-line workplace, 5-decimal recipe, Jira evidence method.
- **Auth:** DEV `POST /api/quick-login {key:'admin'|'tech'}` (gated by valid
  session cookies). Prefer quick-login SSO over raw-cookie API (raw can 409).
- **Session cookie lifetime:** staging cookies last **~24 HOURS** — they expire
  only after ~24h OR when a new deployment happens; they do **NOT** expire after
  ~1h (plan long VIU runs in one window). A 401 `sso_required` / 409 before 24h ⇒
  suspect a deployment (or a stale set) and re-request cookies.
- **UI automation:** Chromium can't TLS through the egress proxy directly — build
  a FRESH MITM bridge per run (port rotates; read `$HTTPS_PROXY` live). Use the
  `boot2` hydration pattern (seed cookies + localStorage `user` /
  `fe_permissions_wrapper` / `token`, THEN navigate); the DEV login BUTTONS don't
  reliably work.
- **IDs (non-secret):**
  - Tech `/change` **staff_id `6fb22c1b-...`** (the staff-list id `a7fd0a88-...`
    **404s on `/change`** — never use it there).
  - workplace `b3c8c820-...`; **Time Clock (User) restore role id (STAGING) =
    `a0359055-3dfb-4e9c-9e11-2fbea21585c2`** (restore target). NOTE: the old
    `77b069d1-...` does **NOT** exist on staging — do not use it.
    org `d55bc308-...`.
  - Tech email `tech@shopview.com`.
- **🏢 DEFAULT LOCATION FOR EVERY LIVE CHECK = `Staging Heavy Duty - 9919` (QA lead's standing
  convention, 2026-08-11).** Verbatim: ***"Make sure to use Staging Heavy Duty Location for all
  projects and change it only / When needed."*** Supplied with a screenshot of **Admin ShopView /
  `admin@shopview.com`** whose location selector reads **`Staging Heavy Duty - 9919`**. **This is the
  default on ALL THREE active projects (Filters · Schedule · Report Suite)** — id
  `b3c8c820-f815-4cf1-8938-10956c5ee71a` (America/Edmonton), already recorded in the workplace list
  in the next bullet. **CONFIRM the selector reads it BEFORE taking any observation.** **Switch away
  ONLY where a case genuinely requires it — and where you do, SAY SO ON THE CASE'S OWN RECORD and
  SWITCH BACK afterwards.**
  **THE LEGITIMATE EXCEPTIONS, NAMED SO THAT "WHEN NEEDED" IS NOT A LOOPHOLE — exactly two are
  known:** **(1)** a case that needs **MORE THAN ONE location in scope** — the Location column only
  appears when a user can see several, which is the whole subject of a group of Report Suite cases;
  **(2)** a case pinned to a **specific shop's data**, where the work order, technician or invoice
  exists only there. **Anything else defaults to Heavy Duty.**
  **WHY IT MATTERS — TWO REAL INCIDENTS, both this week, both already in our records:**
  **(a) AN OBSERVATION TAKEN ON A DIFFERENT LOCATION IS NOT COMPARABLE WITH THE REST.**
  `/api/labour-types` first appeared to show **four of the five locations with no default labor
  rate** — which **would have released three held cases** and looked like a finding. **Switching the
  active workplace and re-reading DISPROVED it:** the endpoint is **scoped to the ACTIVE WORKPLACE
  ONLY**, every location has a rate, and the first reading was an artefact of where the session
  happened to be standing. Source:
  `build/report-suite/full-viu-2026-08-06/THREE-REPORTS-STATUS.md` §6.
  **(b) NEVER SEED OR FAKE AROUND A LOCATION BOUNCE — REPORT THE BOUNCE.** A pass **seeded a default
  workplace** to get past the app's `/no-location` redirect, then saw work-order-number **links**
  working where an earlier, normally-signed-in session had faithfully seen plain text — **its own
  setup had created the evidence** (the shipped guard withholds the link from any user whose
  `defaultWorkplace` is null, and `admin@shopview.com`'s own staff record reads `null`). **It was
  caught before the three cases were changed, so their expect-fail markers stand — but it was a near
  miss.** Source:
  `build/report-suite/build-verify-2026-08-10/BUILD-VERIFICATION-2026-08-10.md` §4.
  **THIS IS THE LINE STANDING RULE 14 DRAWS: seeding the DATA a case needs is permitted and expected;
  MANUFACTURING THE CONDITION UNDER TEST is not** — the latter makes our own setup, rather than the
  build, the source of the result (Rules 12/57).
  **⇒ PRACTICAL CONSEQUENCE: EVERY LIVE OBSERVATION MUST BE ATTRIBUTABLE TO A NAMED LOCATION AS WELL
  AS A NAMED BUILD.** Record the **location alongside the build marker** in every verification
  deliverable, exactly the way **Rule 54 sentence 2** records the build — an observation with no
  location named is not reproducible by the next reader.
- **SWITCH WORKPLACE/LOCATION (self-unblock — learned 2026-07-23, never ask the user again):**
  a session is scoped to ONE workplace; reading/writing a WO in another workplace returns
  400/no-data. Switch with **`POST /api/iam/change-location {workplace_id, workplace_timezone}`**
  (→200). Helper: `changeLocation()` in `build/testing-tools/staging-admin.mjs`; boot2 accepts
  `{workplaceId}` / env `SV_WORKPLACE`+`SV_TZ` and switches before hydrating. Workplaces (GET
  `/api/staff/my-workplaces`): Heavy Duty 9919 = `b3c8c820-f815-4cf1-8938-10956c5ee71a`
  (America/Edmonton); Lethbridge 4310 = `f8a8b802-7780-4b16-bf10-343caeb616b2`; QB Location =
  `d5366a95-582d-4a06-96e2-20f8cb937866`. **CREATE A WO:** `POST /api/work-orders/create
  {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}` (→201, needs
  is_vehicle_here). Vehicles: `GET /api/vehicles?company_id={id}`. Customer defaults auto-apply
  fees on new WOs. **DELETE WO:** `POST /api/work-orders/delete {work_order_id}`. **WO LINE CREATE:**
  `POST /api/work-orders/lines/create` SUCCEEDS with a canned line — body `{canned_line_id,
  work_order_id, status:'authorized'}`; it 500s only when called without a canned line/labor — use the
  UI New Line dialog for those (confirmed live 2026-07-27, SV-8721 side project).
  **ADJUSTMENTS API (FD, learned 2026-07-23):** add a WO fee/discount = `POST /api/work-orders/adjustments/add`
  `{workOrderId, kind:'fee'|'discount'|'processing_fee', name, calculationType:'flat'|'pct_labor'|'pct_parts'|'pct_subtotal'|'pct_grand_total', amount, scope:'whole_wo'|line, targetId, taxable, templateId}`; remove = `POST /api/work-orders/adjustments/remove {adjustmentId, workOrderId}` (→204); edit = `POST /api/work-orders/adjustments/change {adjustmentId, workOrderId, name, ...}` (a **processing_fee** returns HTTP 409 'A processing fee cannot be edited through this endpoint' = remove-only, spec-correct). Customer default fees auto-apply on WO create (appliedBy=customer_default); processing-fee base = net subtotal (labour+parts+shop)×(1+tax) EXCLUDING whole-WO fees (§5-R4, VIU-confirmed FIXED 2026-07-23).
- **TestRail:** project **1** / single suite **1 "Master"**; API v2, Basic auth.
  - Custom Roles - (Revised) = section **3527**; Combo+Breakage **3641–3645**;
    Digital Inspections **3646**; execution **run = 312**.
  - **🛑 `add_case` MUST SEND `custom_atmstatus:1` (= "Not Automated") + `custom_automation_type:0`
    — NEVER `3`. `3` MEANS "Automated" AND IS THE AUTOMATION ENGINEER'S FLAG TO SET, NOT OURS.**
    **✅ QA-LEAD-CONFIRMED 2026-08-17, verbatim: *"1 is correct"* — new MANUAL cases created via
    `add_case` carry `custom_atmstatus = 1`; `custom_atmstatus = 3` ("Automated") is reserved for
    automated cases (e.g. Vladimir Tomovic's), and `custom_automation_type:0` is unchanged. All three
    Fabian-review passes (Schedule / Report Suite / Filters) used `1` and it is confirmed correct — so
    no future `add_case` pass may revert to `3`.**
    **⚠️ SUPERSEDED WORDING, KEPT VISIBLE AND DATED (the Rules 31/52/53 pattern) — until 2026-08-11
    this line read: *"`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`."* **THAT
    WAS WRONG ON BOTH HALVES, and because every `add_case` script in this workspace copied it, it
    silently marked as Automated every case we ever created by API.**
    **THE FIELD, READ LIVE FROM `get_case_fields` 2026-08-11 (not inferred):** `custom_atmstatus`,
    field id 17, label **"Automation status"**, a dropdown whose values are
    **`1` Not Automated · `2` Cannot be automated · `3` Automated · `4` Pending**. It carries
    `is_required: true` for project 1 **but also `default_value: "1"`** — so `3` was never required by
    anything; **the required value, if one must be sent, is `1`.** Sending `1` explicitly satisfies the
    required flag and states the truth, which is why it is the instruction rather than omitting the
    field. (`custom_automation_type` is **not** required: `is_required: false`, `default_value: "0"`.)
    **WHY IT MATTERS:** QA lead, 2026-08-11, verbatim — *"Are you adding 'Automated' to the test cases
    when you create them? there ar etest cases which are being given the AUTOMATED testrail marker,
    those are fine, but if you are adding that marker that is wrong."* The flag is how Vladimir
    Tomovic records what he has automated, and **Standing Rule 65 keys the whole tell-Vlad duty off
    it** — so a case born `3` corrupts the signal he and we both rely on. **31 Schedule cases were
    corrected `3 → 1` on 2026-08-11** (`build/automated-flag-and-c30041-2026-08-11/`).
    **✅ THERE IS NOW ONE CANONICAL PLACE TO COPY THE PAYLOAD FROM, AND A GUARD (added 2026-08-11 —
    the structural root cause was that NO shared `add_case` helper existed, so every pass wrote its
    own and copied the previous one's `3`):**
    **· `build/testing-tools/testrail_add_case.py` → `add_case_payload(...)`** — defaults
    `custom_atmstatus` to **`1`**, **RAISES** if a caller passes `3`, and carries
    `verify_created_case()` for the post-write check. **Python; there is a JS twin
    `addCasePayload()` / `addCase()` in `build/testing-tools/testrail-api.mjs`.**
    **· `build/testing-tools/check_add_case_payloads.py`** — **RUN IT BEFORE ANY PUSH THAT CREATES
    CASES.** Exit 0 = clean, exit 1 = a new payload would flag a case Automated. It also **WARNS about
    post-write VERIFIERS that treat `3` as the PASS condition** — those are the nastier hazard, because
    they call a correctly-created case a failure and so push the next pass back towards `3`
    (`build/report-suite/chris-newreqs-2026-08-05/tools/audit.py` is the live example).
    **⚠️ THE EXECUTED `add_case` SCRIPTS STILL CONTAIN `3` AND WERE DELIBERATELY NOT REWRITTEN** —
    they are the audit record of what was actually run, and editing them would make that record lie.
    **All 19 are enumerated in the guard's own `KNOWN_EXECUTED` list, so it can tell an old audit
    record apart from a NEW hazard and names them loudly on every run.**
    **DO NOT COPY AN `add_case` PAYLOAD FROM AN OLD SCRIPT; COPY IT FROM THIS LINE.** The full list of
    scripts carrying the old value is in
    `build/automated-flag-and-c30041-2026-08-11/FIELD-FACTS.md`.
  - Result statuses: **1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed**.
  - Scope structure lives in `build/custom-roles-run/run-plan.json`.

## Durable key facts (simple flow)
- **SHORTCUT INTERPRETATION PRINCIPLE (Simple Flow ONLY):** Simple Flow's purpose
  is to shorten/skip legacy multi-step flows to reach the **same end state faster**.
  Therefore any behavior that reaches the same destination by SKIPPING a legacy
  flow/step is **EXPECTED** (not a bug, not a PO question). It is ONLY a defect if
  the skip (a) throws an **ERROR**, or (b) **corrupts data / inventory / Part-History
  integrity**. Applied 2026-07-08: BUG-3, BUG-4, BUG-10 reclassified → EXPECTED;
  BUG-11 stays a REAL DEFECT (skip 500s); BUG-5/6/7/8/9 = OTHER (enforcement or
  added-requirement, not flow-skips). Detail in `build/simple-flow/finding-reclassification.md`.
- **QA env:** app `https://sv7301.qa.shopview.com`; API host
  `https://sv7301api.qa.shopview.com` (note: `sv7301api`, no dot).
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` gated by cookies
  `sv_sso_session` / `PHPSESSID` / `cf_clearance` (domain `.qa.shopview.com`;
  secrets in `/tmp` only). **Both `{key:'admin'}` and `{key:'tech'}` return 200**
  (the earlier tech-403 is FIXED). quick-login is **stateful on the shared
  PHPSESSID** — probe roles strictly SEQUENTIALLY. Read fe-permissions at
  `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],view_mode,
  cross_toggles}}` (array of code strings, NOT a bool map).
- **Settings-driven, NO feature flag** — behavior is controlled by the Work Order
  settings tab (checked `/administration/feature-flags`: no "Simple Mode" flag).
  Read `GET /api/organizations/settings`; save
  `POST /api/organizations/settings/change` (full settings object).
- **Routes:** WO settings `/administration/settings` → Work Orders tab; PO list
  `/parts/orders`; deliveries/Accept-Delivery `/parts/deliveries`; WOs
  `/workorders` → `/workorders/{id}/lines`.
- **NOT built yet:** Stories **7** (PO multi-select), **8** (Bulk Receive page),
  **9** (apply-invoice), **14** (Waiting-on-Parts column).
- **Receive/inventory endpoints:** PO list `GET /api/inventory/orders`; order detail
  `GET /api/inventory/orders/{id}` (`{data:{order:{items}}}`); deliveries
  `GET /api/inventory/deliveries`; inventory parts `GET /api/inventory/parts?…&search=`.
  **Receive = `POST /api/inventory/orders/accept`** (driven from
  `/accept-delivery/{orderId}` = the shared Accept Delivery surface: fields
  `invoice-number`, Invoice Date, per-line `delivered` qty, Tax, note; over-qty →
  "Received More Than Ordered" warning). Remove a WO part =
  `POST /api/work-orders/parts/delete {part_id,work_order_id}` (returns picked
  inventory + enables WO delete).
- **Cores:** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id). Add via New Part Request → `select_part` catalog PN (forces
  Source=Inventory; qty via `input_bin_quantity_{binId}`). **BUG-10:** the completion
  wizard shows NO distinct "Resolve Cores" step for a pre-picked inventory core
  (goes Details→Success); core Ok/Not-Ok is a LINE-level control.
- **VIU deviations (bugs):** (1) no "Create Purchase Orders" toggle / no
  `createPurchaseOrders` field — POs always-on; (2) Save Settings always enabled;
  (3) Mark-Reviewed dialog missing optional `input_review_note`; (4) review
  sign-off jumps straight to Complete (no distinct "Reviewed" state observed).
- **Permissions matrix = §9 of requirements.md (from SV-8183)** — DEFINED and now
  **live-verified for all 11 roles** (SF-PERM-10). Completion gate = FE-only at BE
  (BUG-6 atom-collapse).
- **IDs:** case IDs use `SF-<AREA>-NN`; org `d55bc308-...` (shared with Custom
  Roles). VIU tools in `/tmp/simple-flow/tools/`.
- **Self-service Tech role-switch (sv7301):** `POST /api/staff/{staff_id}/change`
  with `{first_name,last_name,email,role_id,workplace_id}` (+ job_title/salary/
  billable/clockable to avoid clobber). Tech: user `a7fd0a88-...`, **staff
  `6fb22c1b-...`**, restore role **Technician `131b5274-...`**, workplace
  `b3c8c820-...`. EXACT-MATCH `email==='tech@shopview.com'` before changing;
  safety-net `restore-tech.mjs`. **ALL 11 system roles are REAL & assignable** (the
  earlier "only 3 instantiated / other 8 are templates" note was WRONG). Roles list:
  `GET /api/organizations/{org}/roles` (405 on `/api/roles`). Ids: Admin
  `16fec34c…`, Service Manager `ef6e24c2…`, Senior Service Advisor `e03f176f…`,
  Service Advisor `3874cc56…`, Foreman `897018a5…`, Technician `131b5274…`, Parts
  Manager `5d703b9b…`, Parts Tech `486622b9…`, Office `163abe0d…`, Sales
  Representative `8eb4a1c1…`, Time Clock `0a198766…` (full map
  `/tmp/simple-flow/roles-map-6.json`). Assign any role to Tech via
  `POST /api/staff/{staff_id}/change` with that `role_id`. Role detail
  `GET /api/roles/{id}`. **SF-PERM-10 full 11-role completion matrix VERIFIED live**
  (matches §9.2 exactly; Complete gate = `workOrdersCreateAndEdit`).

## Key findings to remember
- **Enforcement model:** backend enforces only **resource-level View/Edit**;
  granular perms (Delete, WO sub-perms, cross-toggles, view_mode) are
  **FRONT-END display gates** the raw API does NOT enforce. Denial cases → verify
  in UI; enforcement cases → hit endpoint, check 403 vs 200/201.
- **Sasha's spec updates:** WO View = create/edit ANY note; WO Delete = delete
  ANY note; **Order Parts requires See Financial Data** and controls the WO Parts
  tab; WO Lines Create&Edit covers core OK/Not-OK + line story; **Manage AP/AR no
  longer gates aging reports** (they follow the Reports permission,
  all-or-nothing); History logs split WO-level vs line-level; Inventory item +
  SFD gating.
- **CAUTION:** several of these spec changes are **NOT yet implemented on
  staging** — cases written to the new spec may FAIL against the current app.
  See `build/custom-roles-run/CustomRoles_Run312_SUMMARY.md`.

## Standing user rules
- **NEVER write to TestRail** (create/update/delete cases, runs, or results)
  **without explicit user permission.**
- When logging a run: **log ONLY Passed cases to TestRail**; put
  Failed/Retest/Blocked only in the **local per-status report** (a tab per
  status). Capture ALL results locally.
- Staging is **fully disposable**: mark throwaway data `ZZAUTOTEST`, use
  **exact-user-match** on role changes (never substring/email), and **restore
  Tech to Time Clock** after.
- Currently **ignore** Digital Inspections, Regression Suite (Minja's API file),
  and Backend API & Security in the Custom Roles execution scope (unless told
  otherwise).
- **NEVER commit secrets** (cookies/tokens/keys/passwords) — `/tmp` only.
  **🔴 THIS REPOSITORY IS PUBLIC** (`bilalmuzamil-sketch/Manual-test-Cases`,
  `"private": false`) — everything pushed is world-readable immediately, which governs
  what may be written to disk at all, not merely how tidy we are.
  **A JWT IS A CREDENTIAL EVEN WHEN IT IS SHORT-LIVED AND NARROWLY SCOPED** — "it expires
  in ten minutes" and "it only grants read access to one topic" describe the blast radius,
  they do not license committing it; a signed token is also an offline oracle for
  brute-forcing the signing key, and **that risk does not expire when the token does**.
  **RUN `python3 build/testing-tools/scan_secrets.py --staged` BEFORE EVERY COMMIT**
  (exits non-zero on a hit; `--selftest` proves it both ways). It flags **values, never
  names**, so `'Basic ' + AUTH` and `"${CK.sv_sso_session}"` do not trip it.
  **REDACT AT THE POINT OF CAPTURE** — keep the header/key name, replace only the value;
  a pre-commit scan is the backstop, not the control. **Response BODIES leak credentials
  as readily as request headers**: the 2026-08-11 incident (12 Mercure JWTs in 13 tracked
  files, 8 of them public since 4 August) came from a capture storing the first 600 chars
  of every JSON response, and there was **not one `Bearer` literal in the repo**.
  **Redaction does NOT undo exposure** — tokens remain in git history, and on a public
  repo anything pushed must be assumed already cloned; **only rotating the signing secret
  revokes them, and that is the QA lead's call.** Full write-up:
  `build/secret-redaction-2026-08-11/REPORT.md`; standing detail in
  `build/APP-ACTIONS-PLAYBOOK.md` (header section).
- Git identity: `noreply@anthropic.com` / `Claude`.
- The **"Unverified" commit stop-hook is a known false alarm** (signing key not
  registered) — ignore it.
- **Prod-vs-staging (and any two-env) permission comparisons: 100% LIVE-OBSERVED,
  ZERO NOT-VERIFIED — see `build/PROD-VS-STAGING-COMPARE-METHOD.md`.**
- **Comparison/environment-diff workbooks: `build/COMPARISON-WORKBOOK-RECIPE.md`** —
  the reusable template + method for any "make a comparison file" request (file name
  starts with "Comparison"); parameters = the envs/population/capabilities/spec.
  **§1A "USER REQUIREMENTS & INSTRUCTIONS" now captures the originating engagement's
  own asks/standards/corrections** (bi-directional; Send-to-Terminal/Portal focus;
  role merge-map + naming trap; granular WO tab; the two per-spec/per-standing
  conformance columns; the trust rule = 100% live-observed both envs / zero
  NOT-VERIFIED / seed-don't-block; verbatim-truth-table + adversarial audit; Excel in
  the established format; exec + QA companions; env/access + ways-of-working) — these
  are the DEFAULT requirements for any comparison file unless the user overrides.

## Deliverable conventions the user likes
- Plain, layman English.
- Numbered **Preconditions / Steps / Expected**, each with line breaks.
- **EXPECTED RESULTS STATE WHAT THE DOCUMENT REQUIRES — the spec/PRD, the epic's stories, the PO's
  verified answers, and (from 2026-08-06) the DESIGN and FIGMA, which are now authoritative too. The
  build supplies ONLY the labels and the pass/fail verdict (Standing Rule 57, source list amended
  2026-08-06 from three sources to five).** Never write an expected result to describe how the build
  behaves; if the build differs, the case keeps the documented expectation and becomes a deviation
  with a ticket.
- **THE PRD, THE DESIGN AND FIGMA ARE EXPECTED TO AGREE; WHERE THEY DISAGREE THAT IS A FINDING TO
  RAISE, NOT A SIDE TO PICK (Standing Rule 57, amended 2026-08-06 — QA lead, verbatim: *"PRD/Design?Figm
  shuld match and then everything should match the Build."*).** The mismatch is a **defect in the
  documents** → a PO question (Rules 7/55) + the outstanding register (Rule 36); meanwhile the case
  follows the **most recent authoritative source** (Rule 32) and **discloses the divergence** (Rule 56).
  **"Everything should match the Build" means the BUILD must conform to the sources — the build is
  still NEVER a source of expected behaviour.** **NO RETROACTIVE CHANGES** — his words: *"For now seit
  it as a rule but do not change any test cases in retro."*
- **"THE DESIGN" MEANS THREE ARTEFACT TYPES, AND THE TIEBREAK BETWEEN THEM IS LATEST-WINS-OR-ASK
  (Standing Rule 57 follow-up rulings, 2026-08-06).** He ruled, verbatim: *"Design is Claude design/Figma
  Design/ also I do share with you the Technical design as well."* — so a **Claude design (prototype
  export or share page)**, a **Figma design** and the **technical design he shares** all count. And,
  verbatim: *"the latest wins or if latest does not make sense we can create a question sheet for the PO
  to respond."* — so the **most recent artefact wins**, **unless it does not make sense**, in which case
  it becomes a **PO question sheet** (Rules 7/55), never a choice of ours. **An UNDATED, EDITABLE share
  link has no date, so latest-wins cannot be applied to it — it is cited as exactly that (Rule 54) and
  escalated.**
  **✅ THE TECHNICAL-DESIGN QUESTION IS ANSWERED — 2026-08-12 (Standing Rule 57 follow-up (ii); Rule 30's
  tension resolved; Rule 33's order updated). QA lead, verbatim:** *"Technical design is the authority but
  if that contradicts with specs/tickets/answer sheet/claude design/figma (because they are also the
  authority with the rule that the latest entry for that question wins) I would suggest to consider the
  specs/tickets/answer sheet/claude design/figma (with the rule that the latest entry for that question
  wins) as the authority for the test cases but let me know where it contradicts with the tech design."*
  **So: the technical design IS an authority and sources a case on its own where nothing contradicts it;
  where it CONTRADICTS the spec, a ticket, an answer sheet, a Claude design or Figma, THOSE win for the
  test cases (latest-wins among them); and EVERY contradiction is REPORTED TO HIM — applying the order
  silently is not compliance.** Live list:
  `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md`.
  **⚠️ SUPERSEDED WORDING, kept visible and dated:** *"A technical design is on the authoritative list,
  but Rule 30's 'informs but never overrules' is PRESERVED and the question of which prevails is
  OUTSTANDING with him — do not answer it."*
- **A PO / DEV QUESTION SHEET IS THE LAST THING SENT (Standing Rule 66, 2026-08-12 — QA lead, verbatim:
  *"This should be the last thing once you give me the report that everything else has been done only this
  part is left and save it as a rule for now and for the future projects too."*).** Write the sheet
  whenever it is ready; **send it only once everything we can do ourselves is finished**, and report it to
  him as *"everything else is done; only this is left."* Until then the questions are **held and logged in
  the outstanding register** (Rule 36). **A question sent early gets answered against a state that has
  since changed, and it spends the PO's patience on something we could have resolved ourselves.** **It does
  NOT license sitting on a genuine blocker** — anything that actually stops work is raised immediately, and
  anything that stops us creating or correcting a case is escalated in the same breath (Rule 62). **A case
  waiting on an unsent question says in its own words that the question has not been sent** — never wording
  that implies the PO is sitting on it. Rule 55 still governs HOW the sheet is written; Rule 66 governs
  WHEN it is sent.
- **A PROVENANCE LINE ends every case's Expected Results (Standing Rule 54) — TWO SENTENCES THAT ARE
  NEVER MERGED:** after a separator line, **sentence 1 names ONLY DOCUMENTS** as the source of the
  expectation (the **epic and/or owning story + the specification with its version + the requirement
  reference**, and/or the **PO's answer file with its link and date**), and **sentence 2, optional,
  records the check**: *"This is the expected behaviour as per epic SV-8582 and the Sales By Customer
  report specification version 13 (S4-R13). Last checked against build v3.5-16cf83f on 8/5/2026."*
  **Re-stamped on every spec/epic/build re-check** — a stale stamp is a finding. Never the word
  "VIU", never a flag name; the requirement reference in parentheses is an authorised exception to
  the no-anchors-in-tester-text guidance.
- **THE BUILD IS NAMED ONLY AS WHAT A CASE WAS LAST CHECKED AGAINST — never as the source of an
  expectation (Standing Rules 54 + 57, amended 2026-08-05).** Use neutral checking language (*"last
  checked against build … on …"*); **"as per the build tested on …" is BARRED** — it credits the build
  for the expectation, confuses the tester, and invites leadership to ask how something can be
  expected behaviour merely because it happens on a build that can itself be wrong. A case that
  **FAILS** on the build says only that it was checked; the deviation note carries the failure. Not
  yet checked against any build ⇒ **omit** sentence 2 or say plainly that it has not been checked.
- **A DIVERGENCE SENTENCE follows the provenance line where — and ONLY where — the case follows a
  later decision that differs from an earlier source (Standing Rule 56):** after a line break, one
  plain sentence saying **where the PO asked for this behaviour** (file/message + link + date),
  **where it differs** from the earlier spec/design/earlier ruling and what that said, and **that we
  have taken the latest information as prevailing**. **Never added where nothing earlier
  contradicted the decision** — that manufactures a conflict and is itself a defect.
- **AUTOMATION MARKER — the LAST thing in Expected Results, exactly one of FOUR strings (a fourth was
  added 2026-08-17, Standing Rule 69):** `AUTOMATION: READY` · `AUTOMATION: READY - EXPECT FAIL
  (SV-xxxx)` · `AUTOMATION: HOLD - <short plain reason>` · `AUTOMATION: Not available on Build to test
  Yet - Last checked <M/D/YYYY>` (steps/preconditions cannot yet be verified on the build — feature not
  present, build not ready, or verification deferred; the documented source is STILL fully cited; a
  later sync lifts it to `READY`, or to `READY - EXPECT FAIL` on live-backed ticketed failure). Placed
  **at the VERY END of Expected Results, AFTER the Rule-54 provenance line,
  with a BLANK LINE BEFORE AND AFTER IT** (QA lead's exact instruction: *"put these markers below
  the Expected behavior column at the end after a line break and there should be a line breake
  before this marker and after this marker"*). **Purpose:** the automation engineer automates with
  Claude and needs **one machine-findable string per case** — so the marker is a fixed literal, never
  reworded, never abbreviated, exactly one per case. **A TOOL FLAG DOES NOT MAKE A CASE HOLD (QA lead's
  ruling):** devtools, DOM/network inspection, reading a PDF or a CSV, seeded data states, theme
  toggles and viewport sizes are **all automatable** and stay `READY`; only a **genuinely
  unobtainable thing** — a real physical device, an external account we do not have — justifies
  `HOLD`. **NOT-BUILT cases are EXCLUDED from any "ready to automate" figure** (they are not a
  readiness shortfall, they are absent product).
- **AN `EXPECT FAIL` CASE CARRIES THE SYMPTOM AND ALL THREE OUTCOMES (Standing Rule 61, added
  2026-08-06) — the marker is an INSTRUCTION, not a prediction.** In the tester-facing Expected
  Results, **before the Rule-54 provenance line**, name **the exact observable symptom** and what to do
  if the case **(1)** fails with **that** symptom, **(2)** fails in a **different** way, or **(3)**
  **passes**. Canonical wording to copy: *"What you should see today: <the exact symptom, in plain
  words>. This is a known problem and it is already reported — see
  https://shopview.atlassian.net/browse/SV-xxxx. · If you see exactly that, mark this test FAILED and
  do not raise anything new. · If it fails in a DIFFERENT way from what is described above, that is a
  NEW problem — please report it. · If it PASSES, the fix has shipped: tell the QA lead so the ticket
  can be closed and this note removed."* **Outcome (3) is what makes the automated run itself the
  detector** of a fix that shipped while its ticket sat Open; **outcome (2) is what stops a NEW defect
  hiding behind an old one.** Where the ticket was **closed without a fix**, that qualifier sits
  alongside the symptom. **Ticket status is never read as evidence about the build.**
- **THE RULE-69 MARKER SUBSTITUTES FOR A PLAIN `AUTOMATION: READY` MARKER ONLY (Standing Rule 69,
  dated addition 2026-08-17/18).** `AUTOMATION: Not available on Build to test Yet - Last checked
  <date>` may replace a plain `AUTOMATION: READY` marker and **nothing else** — **never overwrite an
  existing `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or `AUTOMATION: HOLD - <reason>` marker** (those
  carry ticket/blocker references). Touched plain-READY case → Rule-69 marker; touched EXPECT-FAIL or
  HOLD case → keep its marker.
- **THE MARKER KEYS ON TESTABLE-CONTENT CHANGES, NOT ON A PROVENANCE / REFS REFRESH (Standing Rule 69,
  dated refinement 2026-08-18).** A case's automation marker is added or changed only for a **newly
  authored** case or one whose **testable content** (title, preconditions, steps, or the
  expected-behaviour body) changed because of a spec/source change. **A metadata-only re-stamp** —
  refreshing the provenance line's spec version / read-dates / references or the `refs` field while the
  testable content is byte-identical — **keeps the existing marker** (a plain `AUTOMATION: READY` case
  stays READY; never flipped to `Not available on Build to test Yet`).
- **NEVER CHANGE OR DELETE AN "AUTOMATED" CASE WITHOUT ASKING FIRST (Standing Rule 71, 2026-08-17/18).**
  A case whose TestRail Automation-status field = "Automated" (`custom_atmstatus = 3`) is ask-first for
  ANY edit or deletion — **even our OWN cases** if someone flagged them Automated. **After** build
  verification proves such a case runnable, correct its marker to `AUTOMATION: READY` **and share the
  case number with Vladimir Tomovic (id 1)** so he adjusts his automations; the standing hand-off list
  is `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.
- **A PO QUESTION SHEET ALSO SHIPS AS A GOOGLE-DOC `.docx` (Standing Rule 55, dated addition
  2026-08-17/18).** In addition to the `.xlsx`/`.md` pair, produce a reader-facing **`.docx`
  (Google-Docs-openable)** with **ONLY the reader-facing questions** — no QA-only mapping tab, no case
  IDs/anchors/jargon, never the word "VIU" — so the QA lead can share it directly with the PO.
  Human-readable filename naming the PO and the date (Rule 19).
- Excel workbooks: a **separate tab per result status** + a **Summary** tab.
- Provide **GitHub raw download links** for deliverables.
- **Per-case audit logs** for any TestRail edits.
- **EVERY DEFECT TICKET WE FILE HAS ONE SHAPE (Standing Rule 52, amended 2026-08-05):** `issuetype` =
  **`Story Defect`** · `parent` = **THE OWNING STORY** (never the Epic — Jira returns **HTTP 400
  *"Please select valid parent issue."*** for an Epic parent on this type; the story is itself a child of
  the epic, so the defect still rolls up) · `priority` = **`Medium`** (Rule 53, amended 2026-08-06 — it
  was `Low` before that date; tickets filed earlier are correct for their date) · **ALSO link the owning
  story `relates to`** (it duplicates the parent, but it is what makes the org's UI conversions land on
  the right story) · **NO Product Area** (the field does not exist on this type; his ruling: *"Product
  area loss is OK"*). **NEVER use `Story Defect - Archive`** (legacy, wrong level). **Never convert
  someone else's existing ticket** — conversion is UI-only and silently wipes Product Area with no
  changelog entry, so it is the QA lead's call. Tickets filed **before 2026-08-05** are `Bug`s on an epic
  parent and are **correct for their date**. Full field/type/conversion facts:
  `build/APP-ACTIONS-PLAYBOOK.md` § "Filing a defect ticket".
  **⚠️ AND NOTHING IS CREATED UNTIL HE SAYS SO (Standing Rule 62, 2026-08-10 — QA lead, verbatim: *"Just
  One NEW rule, DO NOT create the Tickets in Jira but ask for my permission first."*).** This shape
  describes HOW a ticket is made **once permission is given**. No Jira ticket of any type may be created
  without his explicit permission, asked for and granted first; permission is **PER ASK** (an earlier
  batch approval never covers a later ticket), and a finding being real, sourced and obviously worth
  filing is **not** permission. Write the finding up, log it in the outstanding register, and present it
  with the recommendation and the ready-to-file text — then stop. **Editing an existing ticket is not
  creating one** and remains permitted.
  **🔴 AND WHEN THE HOLD LIFTS, THE TICKET MUST BE UNCHALLENGEABLE — THE EIGHT-ITEM EVIDENCE BAR
  (Standing Rule 52, amended 2026-08-12; QA lead, verbatim: *"you have to amend your rule to make sure
  that the defects you create can not be challenged and should not bite me, they did badly bite me and my
  job is on threat due to that. However for now the Jira ticket creation is still on hold."*).** Every
  ticket must show: **(1)** the expected behaviour **quoted verbatim from a named source with its version
  and date** — **no quotable document, no ticket** · **(2)** **annotated** screenshots, embedded (and
  beware the §J hazard: rewriting a description over the API destroys pasted images whose `media` nodes
  are not carried forward — one was lost on SV-8818) · **(3)** the **exact test data named as it appears
  on screen**, plus what was ruled out — an unnamed variable is why SV-8821 was bounced · **(4)** the
  **build marker and environment**, including the role actually used · **(5)** a **duplicate search, with
  the queries recorded** · **(6)** the **five-part reader shape** — concise description · steps of
  reproduction · current behaviour in plain words · expected behaviour in plain words · a line break, then
  the source — inside the seven-section playbook layout · **(7)** a written **pre-filing self-challenge**
  (*what is the strongest argument this is NOT a defect?* — if the answer is *"the source does not say
  that"* or *"I cannot reproduce it from my own steps"*, **do not file it**) · **(8)** a check that it is
  **not a Rule-24 PASS** (UI hidden + API allows = PASS, never a defect). **The bar decides FITNESS, never
  authorisation — passing all eight is still not permission (Rule 62).**
  **🔴 AND WHEN THE HOLD LIFTS, RESUME ONE TICKET AT A TIME AGAINST A QUALITY CHECKLIST (Standing Rule
  73, 2026-08-17 — recorded because previously-created tickets *"did bite us"*).** When the QA lead
  explicitly asks to resume: Claude creates **ONE** ticket, he **verifies it**, and only then does
  Claude create the **next** — **never a batch.** Each ticket must clear a checklist before it is
  proposed (a ticket that fails any item is NOT ready): **[1]** a `Story Defect` of the **related
  story** (full Rule-52 shape) · **[2]** proven **NOT a duplicate** (dup search first, JQL recorded,
  what was ruled out stated) · **[3]** **runnable, the EASIEST possible to reproduce** — steps a
  **non-technical PO can actually run**, exact on-screen labels, named test data, **no API calls in the
  steps** · **[4]** **relevant annotated screenshots**, embedded so they render · **[5]** the expected
  behaviour, then **after a line break** its source · **[6]** the expected behaviour **word-by-word from
  the source, IN QUOTATION MARKS** — **no invented expectation, no interpretation; no quotable
  document → no ticket** · **[7]** **concise, not too lengthy** — no unnecessary information. Rationale
  recorded: tickets bit us because they were too lengthy, missing screenshots, un-runnable by a
  non-technical PO, and cited sources without quoting them verbatim.
- Test cases with FE-block/BE-allow behavior carry a plain tester-facing "Note for the
  tester: …expected, mark PASSED, don't raise a bug" line (per Standing Rule 24).
- **Simple-format status updates (all chat updates + reports):** Give updates/status
  in EXTREMELY SIMPLE, plain, layman words a manual QA can read and follow — short
  statements/steps, grouped under clear plain headings (e.g. "What I did / What needs
  to be done / Other actions"), no jargon, nothing important omitted. This is the
  default format for every progress update and summary going forward. (User
  instruction 2026-07-24: "Always give updates in this format.")
- **Clear, action-first, table-form communication with the QA lead (Standing Rule 70, added
  2026-08-17 — QA lead, verbatim: *"communicate with me in clear things for me to do like what I
  exactly need to do and help me understand … and ideally share things with me in the form of a
  table"*).** Every status update, report, question set and outstanding-items list tells him **exactly
  what to DO** for each item (a concrete action, not just "pending"), **explains in plain words what
  each item is** (never assume he knows the term/case/ticket), is **presented as a TABLE** whenever
  there is more than one item (columns like # · What it is (plain) · What YOU do · Why it matters ·
  Priority), and **separates "needs your decision/action" from "informational/tidy"**. Strengthens
  Rule 7 and the "Simple-format status updates" bullet below.
- **Every DEVIATION cell must carry a plain "What needs to be done" (all
  deliverables):** In ANY deliverable (workbooks, reports, trackers, CSVs) that marks
  a cell/row as DEVIATION — or Failed / Blocked / any not-passed status — that cell
  MUST be paired with a plain-English "What needs to be done" explanation (a dedicated
  "What needs to be done (plain)" column or an adjacent note), in simple words a
  non-technical manual QA can act on. Never leave a bare "DEVIATION"/"Failed"/"Blocked"
  without the plain next-step. Bake this into every generator/workbook going forward.
  (User instruction 2026-07-24: "in such cases you always need to use simple words to
  tell me what needs to be done.") Ties to Standing Rules 7 and 8.
- **Concise TestRail case TITLES (all projects):** TestRail case titles MUST be concise
  enough to display fully on the TestRail case page (no truncation) — keep to ≤ ~80
  characters; put the full detail in Steps/Expected/Preconditions, never rely on a long
  title. Applies to all future authoring and to any long title when a case is next
  touched. (User instruction 2026-07-27.)
- **A PER-PROJECT COMPLETION TABLE GOES OUT BEFORE THE NEXT PROJECT STARTS (Standing Rule 67, added
  2026-08-12 — QA lead, verbatim: *"Before starting with filters, give me the report for schedule and
  set it as a rule to do before starting the next thing. I need a report table as to how many cases have
  been Source verified and how many have been build verified/VIU'd and what is left."*).** A **table**,
  not prose, carrying at minimum: **total cases as two numbers (ours / live incl. foreign, Rule 38)** ·
  **source-verified** (read-date + current version pin) · **build-verified, SPLIT — how many name the
  build now running and how many name an earlier one** · **steps and preconditions actually walked on
  the build** (the Rule-9 runnability figure) · **runnable vs held with the marker arithmetic shown
  closing both ways** · **created / updated / deleted** · **what is left, ITEMISED with each item's
  blocker and who can clear it** (Rule 48's five fields where it is blocked on him). **"Build-verified"
  and "steps walked" are DIFFERENT NUMBERS and are reported separately — the second is always smaller
  and always the more honest claim (Schedule 2026-08-12: 76 against 28, of 176).** **Never say "VIU
  complete"** — the accurate phrase since the behaviour half became the tester's (Rule 10, 2026-08-11)
  is **"source-verified and build-accurate in its preconditions, steps, navigation and labels — with the
  behaviour verdict belonging to the tester."** **Every figure derived LIVE at report time with the read
  time stamped on the table** (counts have moved mid-pass), and **any column short of 100% says plainly
  why** (Rule 60(d) bars the blanket caveat).
- **A BLOCKER IS PROVED BEFORE IT IS WRITTEN DOWN, AND IT BLOCKS ONLY WHAT IT ACTUALLY BLOCKS
  (Standing Rule 68, added 2026-08-12 — QA lead, verbatim: *"Regarding this mistake make a rule to
  avoid making similar mistake."*).** Before any item is recorded as blocked — in a Rule-67 table's
  *"what is left"* column, in the outstanding register, or in an ask to him — **(1) name what the
  blocker actually blocks** (a missing PO answer blocks the **verdict**, not the **runnability**; a
  missing permission blocks **one step**, not the case) · **(2) prove it is real AND total** by
  stating what was attempted and what each attempt returned — *"waiting on X"* untested is an
  **inference**, not an observation (Rule 12) · **(3) check it is not self-serviceable first** —
  seeding data, creating roles and creating users are **ours** (Rules 5/14/26) · **(4) treat a cost
  as a SCHEDULING decision, not a wall** — a destructive step (one that ends a session or consumes a
  one-way resource) is done **LAST, after committing everything that depends on it**, never skipped
  and never done first · **(5) state the residual explicitly** — *"Blocked for X. Still possible
  under it: Y. Genuinely impossible until X clears: Z."* — **a blocked item that never names what
  could still be done is not a report, it is an excuse** · **(6) escalate only what is truly his**,
  with Rule 48's five fields and what we already tried. **A falsely-blocked case is WORSE than an
  unblocked one: it looks like someone else's problem and stops being worked**, and it gathers
  authority at every hop while nobody re-tests the premise. On 12 August **14 of 23 reported-remaining
  Filters cases were classified "waiting on Branko" and were walkable all along** — roughly 60% of a
  reported remainder, self-inflicted.
- **Blocked-revisit loop (standing, all projects):** tester-marked-**Blocked** cases are a
  standing intake queue — if a case seems off/confusing/wrong during execution the manual
  tester marks it Blocked (never skips, never guesses); EVERY Blocked case then gets a manual
  revisit (re-checked against the current spec + live build) and a logged, authorized TestRail
  correction (reword / fix expectation / merge / retire). Part of the permanent quality
  pipeline — presentable overview doc = build/QA-QUALITY-PIPELINE-EXPLAINER.md; runtime
  counterpart section in build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md. (QA lead's standing
  instruction 2026-07-29: "the last fool proof process is that the manual tester marks the test
  cases which seems off to him/her as Blocked and we revisit those blocked tests manually to
  see what needs to be changed there.")
- **Execution discipline + tickets→cases (standing, all projects; Daily QA Meetup 2026-07-29,
  source build/meetings/Daily-QA-Meetup-2026-07-29-notes.md):** test-case execution and
  creative break-the-feature testing are TWO SEPARATE activities — QAs run the cases as
  written (Blocked for anything off), and SEPARATELY deep-dive each feature with "creative,
  imaginative testing … to attempt to break the features" + hunt regressions; those findings
  are NEVER mixed into the test-case run — they are reported as TICKETS ("Create tickets for
  any edge cases or scenarios that break features during manual creative testing"), findings
  consolidated in a dedicated regression/edge-case section, and those tickets are LATER
  CONVERTED INTO test cases — the suite grows from real findings. General leadership-facing
  doc: build/Test-Case-Creation-and-Refinement-Process_2026-07-29.docx/.md (no project names,
  anonymized numbers). **Refinements (QA lead 2026-07-29):**
  completely-irrelevant cases found on revisit are removed and should be ≤1% of the suite;
  slight fixes (expected behavior / steps of reproduction / title) are owned and applied
  directly by the QA; QAs also owe each feature a deeper dive — actively trying to break it and
  finding/reporting regressions (test-case work is only ONE part of squad success); those
  edge-case/regression tickets are later converted into test cases, so the suite grows from
  real findings. Layman-facing guide =
  build/How-We-Ensure-Test-Case-Quality_Simple-Guide_2026-07-29.docx (+ .md twin).

## Persistence note
Secrets are **ephemeral** (`/tmp`, re-supply per environment). Everything else
here is **durable memory** — update it when facts genuinely change (a spec change
gets implemented, ids change, scope changes).
- **NO-WORK-LOSS STRATEGY (read on any near-limit / restart / dead-worker event):**
  `build/NO-WORK-LOSS-STRATEGY.md` — golden rule (all durable work lives in GIT,
  committed+pushed after every step; container + /tmp are ephemeral), checkpoint
  granularity, resume anchors (this CLAUDE.md + each PROJECT-STATE.md), in-flight
  kill recovery, secrets re-supply, pre-limit checklist, post-reset resume steps.
- **SESSION LEARNINGS 2026-08-12 (the INCIDENTS behind the rules — read before any
  TestRail write, any probe, any label diff, any "blocked" claim, or any resume):**
  `build/SESSION-LEARNINGS-2026-08-12.md`. Written to be read COLD, by someone who was
  not here; every claim names its committed evidence, and where a claim cannot be
  evidenced **it says so**. Eight sections: verification traps (**the byte-check passes
  when the PAYLOAD is wrong**) · **probes that cannot fail** (40+ false absences in two
  days, **not one a product fault**) · our own instrumentation changing the measurement ·
  reading the interface (`textContent` **vs** computed style — **both readings needed**) ·
  source discipline · blockers · a shared moving branch (**a clean tree is not a current
  tree**) · session survival. **The through-line, worth reading twice: almost every signal
  a pass naturally trusts — its own memory, a clean git tree, an HTTP status, a timestamp,
  a liveness check, a selector returning zero — lied at least once in those two days; the
  only things that did not lie were COMMITTED RECORDS and LIVE CONTENT READ BACK.**
- **THE SKILLS — the seven jobs, packaged to be run COLD by a session with no memory of
  this workspace: `build/skills/README.md`** (index, trigger words, how they compose,
  which to reach for). **Origin, USER DIRECTIVE 2026-08-12, verbatim:** *"In future we
  have to convert this whole session into multiple Skills, one skill per session"* — and
  on why: ***"I do not want our hard work to be lost and things start to bite me and cost
  me my job due to this."*** **Every skill opens with `build/skills/00-COMMON-CORE.md`**
  (honesty bar · TestRail write discipline + hazards · runs · foreign cases · access ·
  environment · session survival · git · secrets · authority · reader-facing standards ·
  the OUTSTANDING section), then one of: **`01-CASE-BUILD`** (author + prove nothing was
  missed) · **`02-SOURCE-CHECK`** (are the sources current?) · **`03-RUN-CHECK`** (can a
  tester actually run it?) · **`04-TESTER-READY`** (hand it over + the skip list) ·
  **`05-PROJECT-REPORT`** (the completion table, before the next project starts) ·
  **`06-DEFECT-PREP`** (an unchallengeable ticket, then stop at the button) ·
  **`07-PO-QUESTIONS`** (one sheet, plain words, sent last). **"VIU" = SOURCE-CHECK +
  RUN-CHECK + build-accurate wording — the pass/fail verdict has been the manual
  tester's since 2026-08-11, so "VIU complete" is never said.** These do NOT replace the
  Standing Rules or `build/PROCESS-CATALOG.md`'s processes — where they differ, **this
  file and the process docs win, and the skill is the one to correct.**
