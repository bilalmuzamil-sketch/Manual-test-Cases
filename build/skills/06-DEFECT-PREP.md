# 06 · DEFECT-PREP — build a defect ticket that cannot be challenged, then stop at the button

> # 🛑 GATE — READ THIS BEFORE ANY OF WHAT FOLLOWS (added 2026-09-03)
>
> **THE LANE DOES NOT PRODUCE TICKETS. IT PRODUCES RUNNABLE TESTS.** QA lead, **2026-09-01**, verbatim:
> ***"You are never supposed to create defect, you are supposed to make the tests RUNNABLE."***
> **EVERYTHING BELOW THIS BOX APPLIES ONLY IF THE QA LEAD HAS DIRECTED A TICKET.** Absent that
> direction it is **reference, not a procedure to run** — and it is **not** the output of a
> build-verification, VIU, test-execution or case-authoring pass.
>
> **WHAT A PASS DOES INSTEAD, when the build does not match the document** (Standing Rule 62, amendment
> of 2026-09-01; `CLAUDE.md` §1): the **documented expectation STAYS** (Rule 57) · the case gains the
> **three outcomes in plain words** so the tester runs it and marks it **Failed** · the marker stays
> **`AUTOMATION: READY`** (an `EXPECT FAIL` marker needs a **live ticket** and there is none) · the
> finding is **reported with its C-id** — **no ticket text, no ask, no candidate file.** Worked
> examples, 2026-09-01: **C45068**, **C45060**, **C44996**.
>
> **WHY THIS BOX EXISTS.** On **2026-09-03** (commit `d1879102`) Standing Rules **51, 52, 53 and 94**
> were retired into Rule 62 for exactly this reason: **their headlines still read as standing
> instructions to build a ticket**, and a hurried session acts on the headline. **This skill was the
> same trap in skill form** — it still holds the full ticket-prep procedure and Rule 62 names it as
> **superseded for the lane's own output**, while its own opening pointed straight at the
> admissibility gate. **The shape below still governs *if he asks for a ticket*; it never authorises
> starting one.**
>
> **AND IF HE EVER SAYS "GO AHEAD", THAT IS PERMISSION TO LOOK AGAIN, NOT TO FILE** — three gates in
> order: every candidate is **HELD**, on every suite · the go-ahead means **re-open the question** ·
> **reproduce it on the build as it stands that day** — if it no longer reproduces, **CLOSE** the
> candidate and say so; if it does, **ASK per candidate**. See **§A10-b** below, and Rule 62.

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST** — especially **§11.1, the active creation
> hold**.
>
> **🛑 THEN READ [THE ADMISSIBILITY GATE](#-the-admissibility-gate--a-ticket-is-not-filed-until-it-passes-every-check)
> (Standing Rule 94, added 2026-08-26).** It is the OUTERMOST gate of this skill and it runs **before**
> the 2026-08-17 quality checklist and the eight-item evidence bar. Those two ask *"is this ticket well
> built?"*; the admissibility gate asks the prior question — ***"is this a defect at all, and is it
> still a defect TODAY?"*** It exists because tickets came back refused as **"irrelevant"** and
> **"obsolete"**, which is a different failure from a badly built ticket.

---

## 🛑 READ THIS BEFORE ANYTHING ELSE

**NOTHING IS FILED. THE JIRA CREATION HOLD IS ACTIVE.**

QA lead, 2026-08-10, verbatim: ***"Do not create anything until my next order."***
And on 2026-08-12, in the same breath as raising the evidence bar: ***"However for now the Jira ticket
creation is still on hold."***

**This skill prepares. It does not file.** The prepared pack sits in the repository, logged in the
outstanding register, waiting for his order.

**⏳ A session reading this weeks later must NOT treat the hold as standing law — check whether it has
been lifted.** When it lifts, **Standing Rule 62 resumes as the governing rule**: permission is still
required, **per ask**, and an earlier batch approval never covers a later ticket.

**🔴 AND WHEN IT LIFTS, RESUME ONE TICKET AT A TIME (Standing Rule 73, 2026-08-17).** The QA lead asked
that this be recorded **because previously-created tickets *"did bite us."*** The moment he explicitly
asks to resume: **create ONE ticket → he verifies it → ONLY THEN create the next.** **Never a batch,
never the second before the first is confirmed.** One-at-a-time makes each ticket separately answerable
— which is the whole reason a weak ticket in a batch discredited the good ones beside it.

---

## PURPOSE, IN PLAIN ENGLISH

**Turn a finding into a ticket that an engineering manager cannot throw back — and if it cannot be
made that strong, say so and hold it.**

**Why this is a skill of its own, and not a paragraph inside another one:** the QA lead asked for it in
these words — ***"they did badly bite me and my job is on threat due to that."*** A defect ticket is
**immediately visible to the whole engineering organisation** and **cannot be cleanly undone**: a
withdrawn ticket stays on the record for good. **So a weak ticket does not cost us a correction — it
costs him credibility, and credibility is what lets every other finding we raise be believed.**

**The asymmetry is the whole argument:** a finding held back for one more day of evidence **costs
nothing and is fully recoverable**; a challengeable ticket **cannot be recovered at all**, and it
discredits the ninety good ones filed beside it.

---

## TRIGGER PHRASES

> *"Prepare a ticket for [finding]"* · *"write this up as a defect"* · *"is this filable?"* ·
> *"draft the bug report"* · *"the defect pack for [project]"* ·
> *"re-check the prepared defects against the bar"*

---

## KICKOFF PROMPT

```
Run DEFECT-PREP for [FINDING], on [PROJECT].

What I observed: [one sentence]
Where the expectation comes from: [document + version + anchor] — or "I don't know yet"
Build access to reproduce: [yes, cookies for <branch> | no]
Screenshots: [available | need capturing | cannot be captured because <reason>]
```

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

| Date | Verbatim | Effect |
|---|---|---|
| **2026-08-17** | Instructed that a **defect-ticket quality standard + a one-at-a-time resume process** be RECORDED as a rule, **because previously-created tickets *"did bite us."*** Hold restated: *"Lets hold them until we are done with Build verification ... Even then we will keep a hold on creating tickets until I allow you to create the tickets."* | **The mandatory quality checklist (below) + ONE ticket at a time on resume** (Standing Rule 73) |
| **2026-08-12** | *"The Engineering manager had raised a concern over creating tickets which does not make sense, so we have to make sure that the defects or tickets which we create do NOT bite us like it did, and must have solid references for the expected behavior, and should have the annotated screenshots in them … you have to amend your rule to make sure that the defects you create can not be challenged and should not bite me, they did badly bite me and my job is on threat due to that. However for now the Jira ticket creation is still on hold."* | **The eight-item bar**, and the hold restated in the same breath |
| **2026-08-10** | *"Just One NEW rule, DO NOT create the Tickets in Jira but ask for my permission first."* | Permission required, **per ask** |
| **2026-08-04** | *"do not create the tickets which are related to API , if there are any ASK me (ask again if I have previously given a go ahead for the API tickets with the Non API tickets)"* | **A batch approval does not cover the API item inside it** |
| **2026-08-04** | *"This is not reproducible with the canned line I used, either you used a different canned line (You should always name the canned line you used)"* | **Item 3** — name the exact test data |
| **2026-08-05** | *"whenever you create a ticket it should be attached to the parent ticket as its epic and that ticket should be created as STORY DEFECT"* | The shape |
| **2026-08-06** | *"please keep the priority of the tickets which you create to Medium instead of keeping them to LOW"* | Priority `Medium`. **`High` remains barred** |
| **2026-08-06** | *"Yes this source block MUST exist for every ticket you created."* | The source block at the bottom is not optional |

---

# 🛑 THE MANDATORY GATE — THE 2026-08-17 DEFECT-TICKET QUALITY CHECKLIST (Standing Rule 73)

**THIS CHECKLIST IS THE GATE OF THIS SKILL. A TICKET THAT FAILS ANY ITEM IS NOT READY to be proposed
for creation — and saying so is the correct outcome, not a failure of the pass.** The QA lead asked
for it in these words: **previously-created tickets *"did bite us."*** It is the **eight-item evidence
bar below, re-expressed as his 2026-08-17 gate**, hardening three points — one-at-a-time resume,
verbatim-in-quotation-marks source, and easiest-possible-for-a-non-technical-PO reproduction. **Satisfy
this checklist AND the eight-item bar; where they overlap they are the same requirement.**

| # | Gate item | Pass condition |
|---|---|---|
| **1** | **Story Defect of the RELATED STORY** | `issuetype` = `Story Defect`, `parent` = the OWNING STORY; also `relates to` the story; no Product Area; priority `Medium` (`High` barred). *(Full shape: Rules 52/53.)* |
| **2** | **NOT a duplicate** | Duplicate search run **first**; the JQL recorded; **what was ruled out stated.** |
| **3** | **Runnable, the EASIEST possible to reproduce** | Steps a **non-technical PO can actually run** — exact on-screen labels, the steps that CREATE any needed data, the **exact test data named**, what was ruled out. **No API calls in the steps.** |
| **4** | **Relevant annotated screenshots** | Marked up (arrow/box/caption), **embedded so they render** — not a file list. |
| **5** | **Expected behaviour, then — after a line break — its source** | The source is named immediately below the expected behaviour. |
| **6** | **Expected behaviour WORD-BY-WORD from the source, IN QUOTATION MARKS** | **No invented expectation, no interpretation.** Quoted literally, in quotation marks, from a named document with its version/date. **No quotable document → NO TICKET.** |
| **7** | **Concise — not too lengthy** | No unnecessary information; to the point. |

**RATIONALE (recorded — it is why each item exists):** previous tickets bit us (the QA lead said his
job was on threat because of it) because they were **too lengthy with unnecessary information, had
missing screenshots, had steps of reproduction that non-technical POs could not run, and cited sources
by reference while quoting NOTHING verbatim from them.** Item 7 closes the length, item 4 the
screenshots, item 3 the runnability, and items 5/6 the verbatim-quoted source.

**ON RESUME: ONE TICKET AT A TIME.** When the hold lifts and he asks to resume — **create ONE ticket →
he verifies it → ONLY THEN the next. Never a batch.** *(Standing Rules 62/73; the hold itself is still
active — see the top of this skill.)*

**Cross-references: Rule 51 (API tickets asked separately, every time) · Rule 52 (the shape + the
eight-item bar) · Rule 53 (priority Medium) · Rule 62 (the creation hold; per-ask permission).**

---

# 🛑 THE ADMISSIBILITY GATE — A TICKET IS NOT FILED UNTIL IT PASSES **EVERY** CHECK

**Added 2026-08-26 · Standing Rule 94 · this gate is the OUTERMOST gate of this skill.** It runs
**before** the 2026-08-17 quality checklist and **before** the eight-item evidence bar, because those
two ask *"is this ticket well built?"* and this one asks the prior question: **"is this a defect at
all, and is it still a defect TODAY?"** A beautifully built ticket about something that is not a
defect is exactly the ticket that comes back refused.

**WHY IT EXISTS — the QA lead, 2026-08-21, verbatim:**

> *"The last time you created the tickets were cause me to get bitten because they refused those
> tickets saying they are irrelevant and marked them obsolete, though a few of them were accepted as
> genuine tickets."*

**Read that precisely.** The refusals were **not** *"badly written"* — they were **"irrelevant"** and
**"obsolete"**. Those two words name four failure modes, and every check below exists to kill one of
them:

| The refusal word | What actually happened | The check that kills it |
|---|---|---|
| **"obsolete"** | The expectation came from a **superseded version** of the spec — true when the case was written, false by the time the ticket landed | **A2** (re-read the source immediately before filing) |
| **"irrelevant"** | The gap was **unfinished work on a never-final branch**, already owned by an open story | **A3** (the owning-story status check) |
| **"irrelevant"** | **Already reported** — including reported and closed | **A4** (duplicate search including closed) |
| **"irrelevant"** | **By design** — most often a Rule-24 front-end block | **A5** (by-design check) |
| **"irrelevant"** | **A technical observation the filer never translated into shop meaning** — a config toggle that was off, or a field read as storage rather than as what it means to a shop (2026-09-08: SV-9774, SV-9812) | **A5-b** (the domain-meaning gate) |

**THE DELIVERABLE OF THIS LANE IS A SET OF ADMISSIBLE, EVIDENCED CANDIDATES THE QA LEAD CAN APPROVE
ONE AT A TIME — NOT A PILE OF FILED TICKETS.** Ten admissible candidates he can walk through one by
one is a good pass. Ten filed tickets, six of which come back marked obsolete, is a bad pass **even if
four of them were right**, because the four are discredited by the six.

---

## THE CANDIDATE FILE — one per finding, filled in, and COMMITTED as the evidence

**Every candidate defect gets its own file, and the file IS the evidence that the gate ran.** A gate
you cannot show afterwards did not run.

```
build/<project>/defect-pack-<date>/DEFECT-CANDIDATE-<id>.md
```

`<id>` is a short human-readable slug, not a number alone — `DEFECT-CANDIDATE-wip-total-excludes-tax.md`
(Rule 19). **Commit it when the gate is filled in, whether the verdict is ADMISSIBLE or NOT** — a
candidate that fails the gate is a valuable record, and the `NOT-FILED.md` entry points at it.

**It sits ALONGSIDE the prepared pack, it does not replace it.** When a candidate passes, it still
gets its `TICKET-<n>-<short-name>.md` seven-section body and everything else in **THE DELIVERABLE —
the prepared pack** below. `SELF-CHALLENGE.md` and `DUPLICATE-SEARCH.md` may either stay as pack-level
files or be folded into the per-candidate files — **say in the pack README which arrangement you
used**, so a later session finds them.

**The template — copy it verbatim, fill every field, never delete a row to make it pass:**

```markdown
# DEFECT CANDIDATE — <plain one-line description>
Project: <project>   ·   Prepared: <date>   ·   Prepared by: <session/lane>
TestRail case: C##### — https://shopview.testrail.io/index.php?/cases/view/#####   (Rule 8)

## VERDICT: ADMISSIBLE / NOT ADMISSIBLE — <the deciding check, e.g. "fails A3: SV-#### is In Progress">

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ☐ | build marker at start / at end, both runs' timestamps |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ☐ | document + version + date + anchor, re-read <timestamp> |
| A3 | NOT an unfinished feature | ☐ | owning story + its status + sprint; flags; epic scan |
| A4 | NOT already reported (incl. CLOSED) | ☐ | the JQL, the hits, how each closed one was closed |
| A5 | NOT by design | ☐ | Rule-24 direction; recorded decisions; PO answers |
| A5-b | I understood what it MEANS in a repair shop | ☐ | the five answers below — not a tick, actual sentences |
| A6 | NOT environment / data / role | ☐ | env + build marker, role reset, seeded data, clean session |
| A7 | Correct parent, proved from the epic's children | ☐ | story key + how ownership was established |
| A8 | Evidence complete | ☐ | annotated screenshots, numbered steps, marker, env, role, time |
| A9 | Adversarial self-review survived | ☐ | the six refusals argued and defeated, below |
| A10 | Rule 62 — prepared to the button, not filed | ☐ | the ask, and his answer (or "not yet asked") |

## A5-b — WHAT THIS MEANS IN A REPAIR SHOP (answer in sentences, never a tick)
1. What the field/behaviour means to a shop, in shop words, not API or database words: <answer>
2. Setting / toggle / per-view option that could produce exactly this: <checked which, and the result>
3. Anything in MY OWN evidence that contradicts my claim: <answer, or "none — and here is why">
4. Is the rule wrong, or did I misread it? The reading under which it makes sense to a shop: <answer>
5. One sentence a shop person would recognise as a problem, no technical terms: <the sentence>

## A9 — THE SIX REFUSALS, ARGUED AND ANSWERED
1. "This is unbuilt / not finished yet." → <the answer, with evidence>
2. "The spec changed — this is obsolete." → <the answer>
3. "Works as designed." → <the answer>
4. "Cannot reproduce." → <the answer>
5. "Duplicate." → <the answer>
6. "Environment / data / your account." → <the answer>

## IF NOT ADMISSIBLE
What it is instead: <not-yet-built / duplicate of SV-#### / by design / environment>
Where it was recorded instead: <NOT-FILED.md · RECHECK-QUEUE.md · PO question sheet · expect-fail marker>
```

---

## THE CHECKS — A1–A10, plus **A5-b** added 2026-09-08

### A1 · REPRODUCED **TWICE**, ON THE **CURRENT** BUILD

**A defect seen once is not admissible.** One sighting is indistinguishable from a stale cache, a
half-deployed branch, a race, a leftover session or our own probe.

- **Reproduce it twice, in two separate runs**, from the numbered steps as written — not from memory.
  The second run is the proof the steps themselves work, which is also what a non-technical PO will do.
- **Record the build marker (`<meta name="app-version">`) at the START of the first repro and again at
  the END of the last one, and prove it did not change.** Paste both strings. **If it changed, the
  branch was redeployed underneath you: the whole repro is void — start again on the new marker.**
- Record both timestamps. **Prefer two different sessions/browsers** so a stuck client state cannot
  survive into run two.
- **If the second run does NOT reproduce it, it is not a defect — it is an intermittent observation.**
  Say exactly that, keep it in `NOT-FILED.md` with both runs recorded, and take it to the QA lead as an
  observation. **"Cannot reproduce" is the cheapest refusal there is; never hand it over.**

### A2 · THE EXPECTATION IS QUOTED **VERBATIM** FROM THE **CURRENT VERSION** OF AN AUTHORITATIVE DOCUMENT

This is item (1) of the evidence bar, **hardened with a currency requirement**.

- The source is one of: the **spec/PRD** (with its **Confluence version number** — never the in-body
  one — plus its date and the **section anchor**), the **owning story's acceptance criteria**, a **PO
  answer** (file + link + date), or the **design / Figma / technical design**. Rule 57's list is
  open-ended; the build is **never** a source.
- **RE-READ THE SOURCE IMMEDIATELY BEFORE FILING (Rule 59).** Not at the start of the pass — **at the
  end, minutes before the ticket goes to the QA lead.** Record the version you read and the timestamp
  you read it.
- **IF THE SPEC MOVED SINCE THE TEST CASE WAS WRITTEN, RE-DERIVE THE EXPECTATION FROM THE NEW VERSION
  FIRST.** The case may now be wrong, not the build. **A ticket whose expectation comes from a
  superseded version is the classic "obsolete" refusal, and it is the refusal we actually collected.**
  When the source moved, say so in the candidate file and state whether the expectation survived.
- If the newer version made the behaviour **ambiguous**, Rule 58 applies: **hold the case and ask** —
  never resolve it by looking at the build, and never file on an ambiguity.
- **No quotable document → NO TICKET.** Absolute, and unchanged.

### A3 · IT IS **NOT AN UNFINISHED FEATURE**

**The single most expensive check in this gate, and the one we did not have.**

**THE BRANCHES ARE NOT FINAL UNTIL RELEASE DAY** — the 2026-08-21 ruling recorded in Rule 91 and in
`00-COMMON-CORE.md` §16.0. Rules 49 and 60 are in force. **Therefore a gap in the build is
"possibly-unfinished" by default, and it is OUR job to prove it is a defect — not the developer's job
to prove it is not.** Filing pending work as a defect is precisely what earns the word *"irrelevant"*.

**Do all four, and record all four:**

1. **CHECK THE OWNING STORY'S STATUS.** If the story that owns this behaviour is **Not Started / To Do
   / In Progress / in an open sprint** — the gap is **PENDING WORK, NOT A DEFECT.** Record it as
   *"not yet built"* and move on.
2. **CHECK FOR A FEATURE FLAG.** Behaviour behind an off flag is not a defect; it is unreleased. Say
   which flag and what state you observed it in.
3. **SCAN THE EPIC'S OPEN STORIES for one that covers EXACTLY this behaviour.** Not "the same area" —
   the same behaviour. If one exists, this is that story's remaining work.
4. **STATE WHERE THE BEHAVIOUR SHOULD BE DONE.** If the only story that could own it is closed and the
   behaviour is absent, that is a real defect and it is now much stronger — say so explicitly.

> **A closed ticket is not a spec change.** Where a requirement's ticket was closed *accepted* and the
> build still fails it, that is a deviation that gets the **expect-fail treatment (Rule 61), not a new
> ticket** — see item (8) of the evidence bar.

**When A3 fails, the finding is NOT wasted.** Record it as *"not yet built"*, attach the **NOT
AVAILABLE ON BUILD** treatment to the affected case (Rule 69), and put it in the Rule-49 re-check
queue so it is re-tested when the story closes. **That is the correct outcome, not a failure.**

### A4 · IT IS **NOT ALREADY REPORTED** — AND CLOSED TICKETS COUNT

Item (5) of the evidence bar, **extended to closed and resolved issues**.

- Search **by area AND by symptom**, in **separate** queries — a symptom search alone misses a ticket
  worded differently; an area search alone drowns.
- **Include closed / resolved / done — explicitly.** A default JQL that filters to open issues is the
  trap: the duplicate we re-filed was closed.
- **Record every JQL and what each returned**, in the candidate file and in `DUPLICATE-SEARCH.md`.
- **If a closed one exists, READ HOW IT WAS CLOSED — do not infer it from the status.** *Fixed* /
  *Won't fix* / *By design* / *Obsolete* / *Cannot reproduce* are five different situations:
  - **closed BY DESIGN → re-filing it is an INSTANT refusal.** Do not file. If we believe the design
    decision is wrong, that is a **PO question**, not a defect ticket.
  - **closed WON'T FIX → not a new ticket either.** Take it to the QA lead as a decision to revisit.
  - **closed FIXED but it still reproduces → this is filable and strong** — say plainly that it
    regressed or was closed without a fix, and quote the closing comment.
  - **closed OBSOLETE but it still reproduces → filable, but tread carefully**: two of ours
    (SV-8843, SV-8847) reproduced byte-identically after an obsolete closure. Lead with the fresh
    repro, and quote the closing comment so the reader sees we read it.
- **Ticket status is never evidence about the build** (a fix shipped while SV-8851 stayed Open). The
  status tells you how to *argue*; only the build tells you what it *does*.

### A5 · IT IS **NOT BY DESIGN**

- **RULE 24: a control hidden in the front end while the back end still allows the action is a PASSED
  case, never a bug.** Filing one is the literal definition of a ticket that does not make sense.
  **The inverse — the front end EXPOSING what the back end blocks — IS a defect** and stays filable.
  **State which direction you observed**, in those words.
- **Check the recorded by-design decisions and the PO answers before calling anything a defect** — the
  project's `PROJECT-STATE.md`, its deliberate-decisions register (Rule 46), the PO answer files, and
  any closed-by-design ticket found in A4.
- **If the answer to *"is this even wrong?"* is a PO question, it is a question, not a ticket**
  (skill `07`). Filing a ticket to ask a question is how a ticket gets marked irrelevant.

### A5-b · **I HAVE UNDERSTOOD WHAT THE THING MEANS IN A REPAIR SHOP** — added 2026-09-08 after two tickets in one day were obsoleted for this

**Both failures came from the same move: turning a TECHNICAL OBSERVATION into a defect without first
establishing what the thing means to the business.**

| Ticket | What I filed | Why it was obsoleted |
|---|---|---|
| **SV-9774** | "Parts Sale document prints no part number" | The **"Part number" toggle was off** in that part sale's own per-view settings. With it on, the line reads `P550848 - FUEL/WATER SEPARATOR`. A configuration state, reported as a product fault |
| **SV-9812** | "Asset section rule assumes a separate VIN and Serial; the product has one combined field" | **A truck has a VIN, a generator set has a serial number.** One field holds whichever identifier the asset in front of you carries. The rule is correct; I read the storage and not the meaning |

**The five questions. Answer them IN WRITING in the candidate file before the ticket is admissible.**

1. **What does this field or behaviour mean to a repair shop?** — not what it is called in the API or
   the database. `vin` is a **column name**; the field holds whichever identifier the asset carries.
   **A schema fact is never a product fact.**
2. **Is there a setting, toggle or per-view option that produces exactly what I am seeing?** Check the
   document's own field toggles, the shop settings, and the per-record view options **before** filing.
   That single question kills SV-9774.
3. **Does my own evidence contradict my own claim?** SV-9812 asserted a spec branch was *unreachable*
   while the same pass had **observed both branches working** — a truck printing a VIN and an asset
   printing a serial. The contradiction was sitting in my own notes. **Re-read your evidence as if a
   reviewer wrote it.**
4. **Am I saying the rule is wrong, or did I misread the rule?** A rule that looks **impossible to
   satisfy** is far more likely one I have misread than one that is broken. **Find the reading under
   which the rule makes sense to a shop, and test THAT reading first.** Only if no sensible reading
   survives is there a finding.
5. **Would someone who works in a repair shop recognise this as a problem, described in one sentence,
   with no API or database terms?** If making it sound wrong needs a schema argument, it is not a
   defect yet.

> **🛑 THE SHARP EDGE — RE-VERIFYING AN OBSERVATION IS NOT VALIDATING A FINDING (Rule 62(c) gate 3).**
> Rule 62(c) says a go-ahead means reproduce it on the build as it stands that day. **That proves the
> OBSERVATION still happens. It says NOTHING about whether the observation is a DEFECT.** SV-9812 was
> re-verified exactly as instructed — 500 assets read, the document re-rendered — and filed anyway,
> because reproducing was allowed to stand in for judging. **They are two separate checks and the
> second one is this one. Run both, in that order.**

**When the answer is "the specification is worded confusingly", that is a QUESTION, not a ticket**
(skill `07`) — same disposal as A5's last bullet.

### A6 · IT IS **NOT ENVIRONMENT / DATA / ROLE**

Everything in item (3) and item (4) of the evidence bar, run as a deliberate elimination:

- **Correctly seeded data**, named exactly as it appears on screen — **never "any"** unless you have
  PROVEN it does not matter and said how (**the SV-8821 scar: the real variable was a missing contact
  person, not the canned line**).
- **The correct role — RESET THE ROLE TO TEMPLATE/DEFAULT FIRST (Rule 26)** on any shared org, then
  state the role you were **really** in, not the role the case assumes.
- **A clean session** — fresh login, no stale cookie, no leftover impersonation.
- **The right environment and branch**, and **prove the app is the one you think it is via the build
  marker** — not via the URL, which can point at a redeployed host.
- **Rule out our own probe and our own instrumentation first** (skill `03`). **More than forty
  "findings" were caught this way in two days and NOT ONE was a product fault.**

### A7 · THE **CORRECT PARENT**, PROVED — NOT GUESSED

- `issuetype` **`Story Defect`**, `parent` = **the STORY THAT OWNS THE BEHAVIOUR**. **An Epic parent is
  rejected — `HTTP 400 "Please select valid parent issue."`** Never `Story Defect - Archive`.
- **VERIFY OWNERSHIP FROM THE EPIC'S CHILDREN, NOT BY GUESSING** — list the epic's stories and identify
  which one's scope actually contains this behaviour. **Record how you established it.** A defect
  parented to the wrong story lands in the wrong team's queue and comes back refused as not theirs —
  which reads as *"irrelevant"* even when the finding is real.
- **Also link the owning story `relates to`** (it is what makes other people's "Change work type"
  conversions land correctly).
- **No standalone tickets. Where there is genuinely no owning story, ASK which story it belongs under.**
- Full shape, priority and the never-convert rule: **THE SHAPE, ONCE PERMISSION IS GIVEN**, below.

### A8 · THE EVIDENCE IS **COMPLETE**

**Annotated** screenshots to the standard in the next section · **exact numbered steps** a
non-technical reader can run · the **build marker** · the **environment / URL / API host** · the
**role and account** · the **date and time observed** · and — **in OUR records, never in the ticket** —
the **TestRail case C-id and its link** (Rule 8).

> **⚠️ THIS IS WHERE THE BRIEF AND THE REPO DISAGREE, AND THE REPO WINS.** The C-id and TestRail link
> are **mandatory in the candidate file and in `CASE-IMPACT.md`**, and **BARRED from the Jira ticket
> body** — see **TWO THINGS THAT MUST NEVER APPEAR IN A TICKET**, below. Putting our case IDs in front
> of a developer is jargon he did not ask for and cannot use.

### A9 · **ADVERSARIAL SELF-REVIEW** — ARGUE THE TICKET **DOWN** BEFORE FILING

Item (7) of the evidence bar, **made exhaustive**. In the candidate file, **write the strongest case a
developer could make for refusing this ticket** — all six, each one answered:

1. **"This is unbuilt."** · 2. **"The spec changed."** · 3. **"Works as designed."** ·
4. **"Cannot reproduce."** · 5. **"Duplicate."** · 6. **"Environment issue."**

> **🛑 IF ANY ONE OF THE SIX IS PLAUSIBLE AND YOU CANNOT DEFEAT IT WITH EVIDENCE — DO NOT FILE.
> ESCALATE TO THE QA LEAD WITH THE DOUBT STATED IN PLAIN WORDS.** Handing him a doubt is cheap and he
> can rule on it in a minute. Handing him a refusal costs him credibility he cannot get back.

**Be willing to lose here.** The argument gets made either way: **either we make it first, in private,
or the engineering manager makes it in public.**

### A10 · **RULE 62 — CREATION IS ON HOLD. PREPARE TO THE BUTTON, THEN ASK.**

- **The 2026-08-10 hold is active** (QA lead, verbatim: *"Do not create anything until my next
  order."*). It is **TEMPORARY with a lift condition** — **CHECK whether it has lifted; never assume it
  is standing law, and never assume it is gone.**
- **Permission is PER ASK.** An earlier batch approval **never** covers a later ticket. **Never file
  inside a previously-approved batch without asking again.**
- **A finding being real, sourced and obviously worth filing is NOT permission.** How good the finding
  is and whether we may file it are two unrelated questions.
- **API-related findings are asked about SEPARATELY, every time (Rule 51)** — even inside an approved
  batch. Classify by the reachability test below and split them out.
- **On resume: ONE TICKET AT A TIME** — create one, he verifies it, only then the next. **Never a
  batch** (Rules 62/73).

#### 🛑 A10-b · THE GO-AHEAD IS NOT THE PERMISSION — RE-VERIFY ON THE BUILD FIRST, THEN ASK AGAIN

**QA lead, 2026-09-01, verbatim:** *"Hold all such tickets for now - for other suites too, we may need
to create them after verifying the build once again when I will give you a go ahead, but make sure even
when I give you a go ahead I will verify on the build once again and if you still find the issue then
you will ask me for the permission to create the ticket."*

So a defect candidate now passes through **three** gates, not one, and they are in this order:

| # | Gate | What it means in practice |
|---|---|---|
| 1 | **HOLD** | Every candidate is held. **This applies to every suite, not only the one in hand.** Prepare it to the button and stop. |
| 2 | **HIS GO-AHEAD TO LOOK AGAIN** | When he says go ahead, that is permission to **re-verify**, and nothing more. It is **not** permission to file. |
| 3 | **RE-VERIFY ON THE BUILD, THEN ASK** | Reproduce the finding again on the build **as it stands that day** — the branch moves continuously (Rules 49/60), so a candidate written days earlier may already be fixed. **If it no longer reproduces, say so and close the candidate — do not file it.** If it still reproduces, **ask for permission to create the ticket**, per candidate. |

**The trap this closes:** treating "go ahead" as the filing permission and pushing a stale ticket for a
bug that shipped a fix in between. That wastes his time and costs the suite's credibility. **A10's
"permission is PER ASK" and this clause compound — the re-verification does not replace the ask, it
comes before it.**

---

# 📸 THE ANNOTATED-SCREENSHOT AND LAYMAN-TICKET STANDARD

**Added 2026-08-26 with the admissibility gate.** It makes concrete what evidence-bar item (2)
(*annotated screenshots*) and item (6) (*the shape the POs asked for*) require. **It does not replace
the SEVEN-SECTION FORMAT below — that remains the mechanical layout of the ticket body.**

## Screenshots

| Requirement | Why |
|---|---|
| **The FULL relevant screen**, with the **URL and the build/version visible where possible** | It proves *which screen on which build* — the answer to *"that is not what I see"* |
| **A boxed or arrowed highlight on the EXACT element** | A bare screenshot is not an annotated one. The reader must see the fault **without reproducing it** |
| **🛑 AND IT IS THE HALVES THAT GET MARKED, NOT THE FRAME (QA lead, 2026-09-15: *"All 20+ were supposed to be rewritten in the approved lay out and the annotated screenshots as I told you before"*)** | A comparison picture with a green BEFORE label and a red AFTER label is FRAMED, not annotated. 22 reports went out on 15 September like that and had to be rebuilt. **Every half carries numbered boxes on the exact elements — the search box, the counts along the top, the result area — and a numbered legend beneath it**, in the same house style as the reports raised from the QA lead's own recording. Tool: `build/testing-tools/annotate_panel.py`, wired into `compose_compare.py` as `--v1-note y0,y1,text` / `--v2-note`. **An archived half that is already annotated is left alone — never draw boxes over somebody else's boxes.** |
| **The legend must survive the scaling** | Each half is drawn at its own resolution and then scaled to fit 560px. A 1150px-wide crop scales to 0.49 and its legend becomes unreadable — **resize the crop to roughly 660px BEFORE annotating** so the text lands near full size. |
| **The picture file is named after the report** (`SV-10109.png`) | Two reports kept showing their older picture because the build script wrote `SV-10109.png` while the ticket still pointed at `VENDOR-ADDRESS-2.png`. The embed resolves by name, so a mismatch is invisible and silent. **Check every ticket's image name equals its key before publishing.** |
| **A one-plain-sentence caption on every image**, phrased as **"What you should see"** vs **"What actually happens"** | The caption is what a non-technical PO reads; the image is what proves it |
| **A before/after pair wherever behaviour differs** — the correct state and the faulty state, same screen, same data | One image shows a claim; two show a difference |
| **NEVER crop away the context that proves which screen or which build it is** | A tight crop of a number proves nothing and is the easiest thing in the world to dismiss |
| **Human-readable file names** (Rule 19) — `work-in-progress-total-excludes-tax-actual.png`, not `img3.png` | A later session, and the QA lead, must find them without opening them |
| **Redact at the point of capture** (core §10) — no customer data, no tokens, no cookies. **This repo is PUBLIC (Rule 82)** | A screenshot is a file in a public repo |
| **Embedded so they RENDER** — not a file list | See **Inline images — the mechanism that actually works**, below |

## 🛑 THE TICKET SHAPE HE ASKS FOR — EIGHT HEADINGS, IN THIS ORDER (QA lead, 2026-09-10)

**He has asked for this repeatedly and said so: _"but this is what I always ask you but you keep on
forgetting"_. It is not a preference, it is the layout. Write the ticket to it before writing a word
of anything else.**

His two messages, verbatim (2026-09-10, after SV-9917/9918/9919 were filed badly):

> *"Listen in the description just explain the problem do NOT assume the effects of the defects etc,
> it should always be simple what is happening and then steps of reproduction extremely easy for a
> manual qa tester or a lay man to follow them to reproduce the issue in the most easiest way
> possible, and it should have INLINE images annotated to clearly explain what is happening, and then
> at the bottom QUOTE the sources and the statements with source references incase someone wants to
> see the sources directly they can reach to the source."*

> *"Yes current behavior and expected behaior should also be nicely concisely and logically described
> in a non technical way for a lay man"*

**🛑 A TICKET THAT NO LONGER REPRODUCES IS *QA COMPLETE*, NEVER WITHDRAWN — QA LEAD, 2026-09-15,
VERBATIM:** *"the developers are quickly fixing the issues which we are reporting so I am not going
to withdraw any ticket which was an issue before and not reproducible anymore, rather we are going
to mark those ticket status as QA complete Also add the label QAcomplete."*

**So: transition the ticket to QA Complete and add the label `QAcomplete`.** Do NOT close it, do NOT
mark it obsolete, do NOT ask for it to be withdrawn.

**Why this matters and why my instinct was wrong.** Finding a reported fault gone, I proposed
withdrawing the ticket — which erases the fact that it was real, that it was reported, and that
someone fixed it. On a fast-moving branch that is most of the team's visible output. *Not
reproducible* is a RESULT, not an admission; it belongs in the record with the work that produced it.

**The one exception, and it is a different thing entirely: a ticket that was never a real fault.**
Where the finding was OUR mistake — a measurement artefact, a misread, a test comparing the wrong
states — it is withdrawn with an explanation, because there was nothing to fix and QA Complete would
assert that something was. Be honest about which of the two you have: *fixed since* and *never real*
look identical from the ticket, and only our own evidence tells them apart.

**🛑 AND KEEP IT SHORT — QA LEAD, 2026-09-15, VERBATIM:** *"Also do NOT forget ever to keep the
ticket simple and explainatory and short as much as possible."* **This is a STANDING requirement on
every ticket, not a note about one of them.** The eight headings stay; the words under them are cut
to the minimum that still lets a developer reproduce the fault and a layman understand it.

What that means in practice, from the SV-10061 rewrite that prompted it (≈900 words → **354**):

- **Heading 2 is ONE or TWO sentences.** Say what happens. Do not restate the mechanism, do not
  explain why it matters, do not preview the steps — the steps are next.
- **Headings 5 and 6 are bullets of one line each.** No bullet that runs to three lines; no bullet
  that argues.
- **Heading 7 is the link, ONE quote, and at most one line saying why that quote is the relevant
  one.** Reasoning about how requirements interact does not belong in a defect.
- **Cut every sentence that exists to show our work** — how carefully it was measured, how many
  times, what we ruled out. If it is worth recording, it goes in the repo or in a COMMENT, never in
  the description.
- **Correction history goes in a comment, never in the description.** Someone opening the ticket
  wants the defect, not our audit trail.

**The test:** can a developer read the whole description in under a minute and then reproduce it?
If not, it is too long — and length is not evidence of rigour.

## 🛑 THE HOUSE VOICE — REFINED BY HIM 2026-09-17 FROM A TICKET HE REWROTE (SV-10161)

**He rewrote one of my tickets and told me to read it: *"see how nicely … made everything stupid
simple with clear steps of replication and current and expected behavior with simplified
description and ticket title, you have to keep your ticket wordings like this."*** What changed is
VOICE and SHAPE, not the section order. Copy this, not my earlier narrative style.

### 1. TITLE — short, Title Case, states the relationship

`Global Search – Contact Name Match Ranks Above Exact Company Name Match`
`Global Search – "Show all N" Link Missing From Group Headers`

**Feature name, en-dash, then the fault in Title Case. Around 60-75 characters.** NOT a narrative
sentence. Mine was *"searching a person's name lists a company matched only through a contact above
the company actually called that name"* — 130 characters and unscannable in a backlog.

### 2. THE FIRST HEADING IS `Description` — **NEVER "The problem"** (his correction, 2026-09-17)

Inside it, three moves in order:

1. **One sentence naming the rule broken**, with the key clause in bold:
   *"When searching for a customer by name, **Global Search is not prioritizing the stronger direct
   company-name match over a weaker contact-name match**."*
2. **"For example," + 3-4 bullets describing the SHAPE of the fault generically** — "one company has
   the name directly", "another does not but a contact does", "the indirect one is displayed above".
   **Not my test data.** The reader should recognise the class of problem before meeting an instance.
3. **One sentence: "This appears inconsistent with … defined in *Epic SV-xxxx* and *… v1.5*."**

### 3. `Steps to Reproduce` — actions only; observations as SUB-bullets; then Actual / Expected

```
# Sign in to ShopView and open *Global Search* … or press *Ctrl + K*.
# Search for {{Deshawn}}.
# Under the *Customers* section, observe the first result:
#* *ZZAUTOTEST Fibridge Commercial*
#* Displayed as *"Contact match"*
#* {{Deshawn}} does not appear in the company name or address.

*Actual Result:*
…

*Expected Result:*
…
```

**The numbered step is the ACTION. What you see goes in `#*` sub-bullets under it. The verdict goes
in bold `Actual Result:` / `Expected Result:` blocks immediately after the steps** — and therefore
**the separate "Current behaviour" and "Expected behaviour" sections are GONE.** Carrying both was
duplication; he removed them.

### 4. FORMATTING IS PART OF THE CLARITY

`*bold*` on every key term and record name · `{{monospace}}` on anything typed or any identifier ·
short lines · bullets over prose. A wall of sentences is what made mine hard to read.

### 5. PICTURES — **THE BANNER STAYS. MAKE IT HELPFUL (his correction, 2026-09-17)**

*"No picture banners are needed always — I cropped it for this picture because it was also not very
clear and confusing the layman PO and manual testers; you are not supposed to cut the picture
banners, rather make them helpful and not confusing."*

⛔ **I drew the wrong lesson from his crop and stripped the banner. That was wrong.** The banner
stays on every picture. What it must NOT be is a restatement of the ticket title — that is what made
his unclear.

**A helpful banner says WHAT THE READER IS LOOKING AT:**
* ✅ `The new search on the test branch, after typing "Fib"`
* ❌ `A group of 20 matches offers no way to see past the first five` (the title again — tells a
  layman nothing about which screen this is)

Boxes, numbered discs and the numbered legend all stay. Keep captions short enough to fit the image
width, and pad the image left so a disc never covers the text it points at.

### 6b. HOW MANY EXAMPLES — ONE, OR TWO WHERE A CONTRAST IS NEEDED. NEVER MORE (2026-09-17)

*"Do not give large description when needed multiple examples when 1 or max two are more than
enough … Maximum two when needed, or 1 example when 1 example can work."*

He deleted the surplus examples out of a ticket I had written, in BOTH the Description and the
Steps. What he left is the rule:

* **One example** states the fault. `unit *TRK 412* on a *2019 Freightliner Cascadia* reads
  *"TRK 4122019 Freightliner Cascadia"*.`
* **A second ONLY where it is a contrast** that a single example cannot carry — the correct case
  beside the broken one. Two is the ceiling.
* **Scope goes in a sentence, not in more examples.** `Every asset that has a unit number is
  affected.` replaces listing four of them.

Three more examples do not make a case stronger; they make a reader skim. **If the extra example
proves nothing new, it is padding.**

### 6c. 🛑 IF THE TEXT MAKES A COMPARISON, THE PICTURE MUST SHOW BOTH SIDES OF IT (2026-09-17)

*"you are giving the example of a work order but not then including the work order with annotation
in the picture then, you are going so ilogical these days"* — and he was right.

My ticket told the reader to compare the asset row against the work-order row, and the picture
showed only the asset rows. **A comparison stated in words and absent from the picture is worse
than no comparison**: the reader is sent hunting for something I had already looked at.

**The rule: every entity, row, screen or value the text names as the comparison appears IN the
picture, annotated.** The strongest version of this is *one query, both sides* — on SV-10178 a single
search for {{Fib}} returns the same vehicle as a work order AND as an asset, so both crops come from
one screen and no one can say the two were captured differently.

### 6d. THE PICTURE ITSELF — `annotate_v2.py`, AND WHY IT REPLACED `annotate_shot.py`

*"the screenshots are appearing dirt and too much zoomed … make them looking Good as per the image
global standard, and annotations should be explanatory in a way that if someone reads the image only
they can understand the issue."*

**Use `build/testing-tools/annotate_v2.py`.** What it does that the old one did not:

| | Old (`annotate_shot.py`) | New (`annotate_v2.py`) |
|---|---|---|
| sharpness | captured at 1x, looked coarse and over-large | **capture at `deviceScaleFactor: 2`, pass `--scale 2`** — the picture is DOWNSAMPLED, which is what makes text crisp instead of zoomed |
| where the words go | a numbered legend UNDER the image; the reader cross-references | **a side gutter, level with the box, joined by a leader line** |
| what the words say | terse fragments | **full sentences that stand alone** — the image read on its own must explain the issue |
| colour | everything red | **green = correct, red = the fault**, with a tick or a cross in the label |
| crop | whole modal, whatever was on screen | **tight on the rows that matter**; stack two crops when the comparison needs it |

```
annotate_v2.py IN.png OUT.png --scale 2 \
  --title "One search for \"Fib\" — the same vehicle on a job line and on a vehicle line" \
  --mark "154,80,500,36:good:On the JOB line the unit and the year are separated …" \
  --mark "154,212,456,40:bad:On the VEHICLE line they are joined …"
```

Coordinates are in the SOURCE image's own pixels, so 2x coordinates for a 2x capture. **Labels are
laid out before drawing and never overlap** — two of them ran into each other on the first real
ticket and made the picture unreadable, which is the very failure the tool exists to prevent.

---

### 6e. 🛑 RE-MEASURE EVERY NEGATIVE FINDING AT THE MOMENT YOU FILE IT (2026-09-17)

A finding recorded hours ago is **not** evidence about the build now. On 2026-09-17 I carried
C44876 through a whole report as a certain defect — *"the box goes blank with no message"* — and it
was wrong: the product shows *Search unavailable* with a working *Retry*. My original reading was
taken five seconds after breaking the search, and in that window **the QA branch went to sleep and
replaced the entire page**. I saw an empty screen and called it an empty box.

**So, immediately before writing any ticket:**

1. **Re-run the observation.** It costs a minute and it is the last gate before a developer's time.
2. **Use the shortest wait that can show the thing.** Every extra second is a second in which the
   environment can change. Long waits feel safe and are the opposite.
3. **Read the WHOLE page, not just your element.** `document.body.innerText` would have said
   *"Environment Sleeping"* in plain words. Scoping the read to `.search-modal` turned a different
   page into an apparent absence.
4. **A positive control taken before the measurement does not cover it.** Rule 104's proofs are not
   ticked once at the start — the control and the measurement must be close enough in time that
   nothing could have changed between them.

---

### 7. ⛔ NO "TEST CASES" SECTION IN THE TICKET — HE REMOVED IT 2026-09-17

*"Also do not mention the test cases at the bottom."*

**The ticket ENDS at Sources.** No run link, no case ids, no test links in the description.

**Why this does not break traceability, and why you must keep the other half:** the link still
exists, it just points ONE WAY now. Standing Rule 113 already requires the ticket number to be
written into the test result in the run, so anyone holding the case can reach the ticket. Nobody
reading the ticket needs to reach the case — a developer fixing it does not care which check found
it, and the ids were noise on a page meant for them. **So: ticket number onto the case, always.
Case ids onto the ticket, never.**

⛔ This supersedes item 8 of the eight-heading layout (2026-09-10, *"Test cases with run + links"*).
Rule 8 still governs everything the QA lead reads and every deliverable — it is only the Jira
description that drops them.

### 8. THE STANDARD THIS ALL SERVES

He said it plainly on 2026-09-17: my tickets were **"very less friendly, difficult for the
non-technical users to understand and follow, and even difficult for the Manual testers to run
following your steps of replication."**

**Two readers, both non-technical, and the ticket fails if either one struggles:**
* a **Product Owner** who must understand what is wrong without knowing the system, and
* a **manual tester** who must reproduce it from the steps alone, with nothing else open.

**Test every ticket against both before it is filed:** could a PO say what is broken after reading
only the Description? Could a tester reach the fault following only the numbered steps, without
asking anyone anything? If either answer is no, it is not written yet — length is not the problem,
narrative is.

---

### 6. TWO PICTURE TRAPS, BOTH MEASURED 2026-09-17

* **Size EACH picture to ITS OWN dimensions.** `size_pics.py` takes the images in document order;
  the earlier one-size-fits-all version stretched a screenshot the QA lead had pasted in himself to
  another picture's shape. Never assume a description holds one picture.
* **Wiki image options split on COMMAS**, so `alt="the requirement, highlighted"` breaks the tag and
  prints a stray quote. Keep alt text comma-free, or omit it.

---

**THE ORDER IS HIS, GIVEN 2026-09-10 AND AMENDED BY HIM 2026-09-16 — NOT TO BE REARRANGED:**

> **🛑 AMENDMENT 2026-09-16 (QA lead, verbatim): *"I want the environent to appear after a line
> break just above the SOURCES sectio, then again a line break and then Sources."*** — **Environment
> is NO LONGER THE FIRST HEADING. It moves to SECOND-TO-LAST**, sitting on its own with **one blank
> line above it and one blank line below it**, and **Sources directly after it**. Everything else in
> the order below is unchanged. The reasoning he gave earlier for putting it first (the reader knows
> what they are looking at) is superseded: the reader now meets the PROBLEM first, and the
> "where do I go to see this" line sits with the evidence at the bottom. Encoded in
> `build/global-search/tickets-2026-09-14/rewrite_to_standard.py` — `ENVIRONMENT` is appended after
> the `----` rule, never at the head of `parts`.

| # | Heading | What goes in it |
|---|---|---|
| 1 | **The problem** | Two or three plain sentences saying WHAT IS HAPPENING. **NO assumed effects** — no "who this affects and how badly", no severity, no impact paragraph, no guessing at consequences. He struck those out by name. |
| 2 | **Steps to reproduce** | Numbered, one action per line, **the easiest possible route a manual tester or a layman can follow** — including the steps that CREATE any data needed, with the exact values to type. On-screen labels only. No API. |
| 3 | **Screenshots** | **INLINE and ANNOTATED**, sized to **fill the description frame without overflowing it** — `!file.png|width=760!`. Each carries a one-line caption saying *what actually happens* / *what you should see*. Not a file list, not attachments-only. |
| 4 | **Current behaviour** | Short plain bullets. What the build does today. What is correct alongside it goes here too, as a bullet, not as a separate essay. |
| 5 | **Expected behaviour** | Short plain bullets. What should happen. Non-technical. |
| 6 | **Environment** | **Second-to-last, a blank line above and a blank line below (2026-09-16).** Both places as clickable links — the version people use today and the new version on the test branch · build · signed in as · date · **the record used, with its FULL clickable link** so he can open it himself. |
| 7 | **Sources** | The document name, its page id, the date read, **a clickable link**, then each requirement quoted **verbatim** in its own quote block **labelled with its id** (S1-N1, S4-E1 …) so anyone can navigate straight to it. |
| ~~8~~ | ~~**Test cases**~~ | ⛔ **REMOVED BY HIM 2026-09-16/17 — there is no eighth heading. No case ids and no run links in a Jira description; the ticket number goes onto the case in the run instead (Rule 113). The layout ENDS AT SOURCES.** Kept struck through so nobody re-adds it. |

⛔ **SUPERSEDED, kept dated (1):** an earlier version of this table on 2026-09-10 put *The problem*
first and *Current/Expected behaviour* immediately after it, before the steps. He reordered it the
same day — the two behaviour sections go AFTER the screenshots. That part still stands.
⛔ **SUPERSEDED, kept dated (2):** *"Environment — First, so the reader knows what they are looking at
before anything else."* (2026-09-10). **Replaced 2026-09-16: Environment is second-to-last, just above
Sources.** Use the order above.

## 🛑 THE EXAMPLE-BLOCK SHAPE, AND THE SIX THINGS A SIMPLIFICATION MAY NEVER REMOVE (2026-09-18)

**Where he took one of my tickets (SV-10238) through ChatGPT, kept the shape and told me to learn
it — then sent the written guide, `build/skills/inputs/SHOPVIEW-JIRA-TICKET-GUIDE-2026-09-18.md`,
reconciled in `build/skills/inputs/GUIDE-RECONCILIATION-2026-09-18.md`.**

### The shape — ADOPT

**Where one fault shows on more than one kind of record, write ONE NAMED EXAMPLE PER RECORD TYPE,
each under its own `h3.`, each three to five steps, each with its own picture directly beneath it.**

```
h3. Example 1 - Asset
# Search {{ZZT-4471}}.
#* One vehicle is returned, and its row reads *2019 Freightliner Cascadia*.
# Search {{2019 Freightliner}}.
#* The vehicle is not returned and *Assets shows (0)*.

!PIC1-vehicle.png|width=760,height=543!
```

Then a **summary table** — record · what works · what fails — so the pattern is visible without
re-reading the steps. **A reader who stops after Example 1 must still have the whole point.**

### The six things a simplification may never remove

1. **The one sentence a reader remembers**, in the Description — e.g. *"a record cannot be found by
   the words the product itself prints for it."*
2. **The control that pins the diagnosis** — the neighbouring case that DOES work, so the fix lands
   in the right layer. Without it a developer reasonably fixes the wrong thing.
3. **The source quoted verbatim**, with page id, version and the date it was read.
4. **The honest caveat where the requirement is silent**, stated before a developer can say it.
5. **The pictures, annotated and inline**, each under the example it proves — never pooled at the end.
6. **The house order** — Environment second-to-last, Sources last, and nothing after Sources.

🔴 **NOT on that list, and never to be re-added: an IMPACT PARAGRAPH.** On 2026-09-18 I "restored"
a *Why it matters* paragraph to SV-10238 and had to take it out again — he struck impact paragraphs
out by name on 2026-09-10 (*no assumed effects, no severity, no impact paragraph*) and his own guide
says the same. Where the consequence is genuinely part of the fault, it is **one factual sentence of
what was observed**: *"adding a second valid search term removes a record the previous search had
already returned, and nothing indicates that some typed words were ignored."*

### Sections that appear only when they apply

* **`Permission Configuration`** — for any permission fault, each permission and its state
  (`Vendor & Order Management → View = ON` · `View and Manage AP/AR Data = OFF`), then one sentence
  naming the dependency. Never a role described in prose.
* **`Expected Result / Product Clarification Needed`** — where the requirement is ambiguous (Rule 58):
  both valid readings and what we would do under each, instead of picking one and calling it a bug.
* **`Regression Note`** — when it started · which environment · whether the live product differs ·
  whether it is intermittent. The words are *"started occurring after the deployment"*, **never**
  *"the deployment broke this"*, unless someone has confirmed the cause.
* **Data or migration faults** — three blocks: state before · what must be preserved · state after.
* **A screen action the back end refuses** — three lines (the screen offers it · the person clicks it ·
  the back end refuses), then the two valid expectations: it should work, or it should not be offered.

### One ticket, one primary failure

Several examples of the SAME failure belong in one ticket. Two different failures that happen to sit
on the same screen belong in two.

### 🛑 THREE THINGS IN HIS GUIDE THAT WE DO **NOT** ADOPT — he ruled on each, 2026-09-18

| The guide says | **His ruling: keep ours** |
|---|---|
| add a **`Technical Evidence`** section (status codes, request ids, response bodies) | **No.** There is no technical-details section. The layout ends at Sources. Confirmed observations that a developer needs go into the plain-English behaviour lines or a comment — never a developer section in the description. |
| put **Environment last** | **No.** Environment is **second-to-last**, Sources last (2026-09-16). |
| rename **`Sources`** to `Spec Reference` and paraphrase the requirement | **No.** It stays **`Sources`**, with the requirement **quoted verbatim** plus page id, version and read date. The guide's paraphrase is the floor, not the model. |

### The self-check before creating OR editing any ticket

Can a manual tester reproduce it from the steps alone · is the fault obvious in ten seconds · is the
actual result only what was observed · is the expected result from the specification or a recorded
decision · did I avoid stating an unconfirmed cause as fact · did I keep the environment, the build
and the test data · are the annotated pictures inline beside what they prove · **after ANY edit —
mine or anyone else's — did I re-read the RENDERED description and count the images** · are there
**zero `blob:` references** (an editor-session handle that points at nothing once the tab closes;
reference pictures by attachment FILENAME with the true aspect, `!PIC1-vehicle.png|width=760,height=543!`)
· **if I cannot guarantee the pictures survive my edit, did I hand over the revised text instead of
overwriting the description** · is this one fault rather than several.

**Verify with** `GET /rest/api/2/issue/<KEY>?expand=renderedFields`: the `<img` count equals the
number of pictures, and `blob:` appears zero times.

**⚠️ WHICH MARKUP — THIS IS WHERE IT WENT WRONG.** The two doors take **different dialects**:

| Door | Dialect | Use it for |
|---|---|---|
| MCP `createJiraIssue` / `editJiraIssue` | **MARKDOWN** (`##`, `>`, `1.`, `|` tables) — the tool converts to ADF | Creating the issue, and text-only edits |
| `PUT /rest/api/2/issue/{KEY}` via `build/atlassian-login/jira.sh` | **WIKI MARKUP** (`h2.`, `{quote}`, `||`, `#`, `!file.png|width=1000!`) | **Any ticket carrying inline images** — this is the ONLY route that embeds them |

**Writing wiki markup into the MCP tool prints `h2.` and `{quote}` as literal text on the page.** That
is exactly what happened on 2026-09-10 and what he called "ugly, not friendly or understandable".

**THE ROUTE THAT WORKS, END TO END (proven live 2026-09-10 on SV-9917/9918/9919):**
1. Sign in: write `/tmp/atlassian/creds.json` `{"email","password"}` (`chmod 600`, from
   `build/ENVIRONMENT-CREDENTIALS.md` §5) → `bash build/testing-tools/ensure_bridge.sh` →
   `setsid nohup node build/atlassian-login/login.mjs` → `STATUS=DONE` in `/tmp/atlassian/status.txt`.
   **There is no OTP on this account** — do not wait for a code and do not ask him for one.
2. Annotate: `python3 build/testing-tools/annotate_shot.py IN.png OUT.png --title "…" --box "x,y,w,h:1:caption"`.
   Capture the FULL screen with a stamp strip carrying the build and the address, so the shot proves itself.
3. Attach: `curl -b /tmp/atlassian/cookies.txt -H 'X-Atlassian-Token: no-check' -H 'Origin: https://shopview.atlassian.net' -H 'Referer: …' -F "file=@OUT.png" https://shopview.atlassian.net/rest/api/3/issue/<KEY>/attachments` → 200.
4. Body: `jira.sh PUT /rest/api/2/issue/<KEY> payload.json` where the description is a **wiki-markup
   string** containing `!OUT.png|width=1000!` → 204.
5. **VERIFY, never assume:** `GET /rest/api/3/issue/<KEY>?expand=renderedFields&fields=description` →
   the ADF must contain `mediaSingle` nodes and `renderedFields.description` must contain real
   `<img src=".../attachment/content/…">`, and the rendered HTML must contain **no literal `h2.`,
   `{quote}` or `||`**.

## The ticket body — plain layman English

**No jargon. No internal IDs. No endpoints, no HTTP verbs, no case IDs in the reader-facing prose.
Use the build's EXACT on-screen labels.** Everything technical goes in the LAST section and nowhere
above it.

| Reader-facing element | What it must contain |
|---|---|
| **Summary** | **One plain line.** What is wrong, in the words a PO would use |
| **Environment** | Build marker · URL / branch · role and account · date and time observed |
| **Steps to reproduce** | **Numbered, ONE ACTION PER LINE**, runnable by a **non-technical reader**, using the exact on-screen labels, **including the steps that CREATE any data needed**, with **the exact test data named**. **NO API calls** |
| **What happens now** | Plain words. No interpretation |
| **What should happen instead** | Plain words |
| **WHERE THAT COMES FROM** | **The verbatim source quote, in quotation marks**, + the document, **its version**, its date and its link. **A line break separates it from the expected behaviour** |
| **Evidence** | The annotated screenshots, embedded inline so they render |
| **Impact** | **Who is affected and how badly** — in plain words, no severity jargon |
| **What is NOT affected** | **The scope limit.** What we checked and found working. This is what stops a reader assuming we are claiming more than we are, and it is the cheapest credibility in the ticket |

**MAP THESE ONTO THE SEVEN SECTIONS, do not add an eighth:** Summary → §1 Description ·
Environment → §2 Branch/Environment · Steps → §3 · What should happen + WHERE THAT COMES FROM → §4
Expected behaviour (the source after a line break) · What happens now → §5 Current behaviour ·
Evidence → §6 Images · **Impact and What is NOT affected sit in §1** (they are plain-words, reader-facing
— they must **not** be pushed into §7) · everything technical → §7.

**Field shape, unchanged and non-negotiable:** `issuetype` **`Story Defect`** · `parent` **the owning
story** · `priority` **`Medium`** (**`High` is barred**) · **`relates to`** the owning story · **no
Product Area** on this type · **never `Story Defect - Archive`** · **never convert someone else's
ticket**.

**AND KEEP IT CONCISE (gate item 7).** Every line above earns its place; nothing else does. **A long
ticket is a ticket nobody finishes reading, and an unread ticket gets closed.**


---

# 🔴 THE EVIDENCE BAR — EIGHT ITEMS, ALL CHECKABLE

**A rule nobody can fail is a rule nobody follows.** **A ticket that cannot show all eight is NOT
READY TO BE PUT TO HIM — and saying so is the correct outcome**, not a failure of the pass.
**These eight items are the detailed backing for the mandatory gate above** — satisfy both.

### (1) THE EXPECTED BEHAVIOUR IS QUOTED VERBATIM FROM A NAMED SOURCE, WITH ITS VERSION AND DATE

The PRD **with its Confluence version number** (never the in-body one) · an **epic story** · a **PO
answer with its file and date** · the **design or Figma** · the **technical design**.

> **🛑 IF THE EXPECTATION CANNOT BE QUOTED BACK TO A DOCUMENT, THERE IS NO TICKET.**

**This single test would have prevented most of what went wrong, and it is deliberately absolute.**
*"The build ought to behave this way"*, *"any reasonable product would"*, *"it is obviously wrong"* are
**not sources** — and a ticket resting on one of them **is precisely the ticket an engineering manager
throws back as not making sense. He would be right, and we would have handed him the argument.**

### (2) ANNOTATED SCREENSHOTS

The actual behaviour **captured and marked up** — arrow, box, caption — so a reader **sees the fault
without reproducing it**. **A bare screenshot is not an annotated one, and a file list is not an
embedded image.**

**⚠️ RECORDED HAZARD, AND IT HAS ALREADY COST US ONE IMAGE.** Editing a Jira description over the REST
API **DESTROYS any pasted image whose `media` node is not carried forward into the new body — and Jira
logs the ADDITION of such an image but NOT its deletion**, so the loss is invisible in the changelog
and provable only from a pre-write snapshot. **One image was destroyed this way on SV-8818 and is
unrecoverable** (`GET /rest/api/3/attachment/59255` now returns 404).

**⇒ THE WORKING METHOD: LIFT THE EXISTING NODES VERBATIM, DO NOT REBUILD THEM.** Walk the current
description's ADF, **deep-copy every `mediaSingle` / `mediaGroup` node whole**, place the copies into
the new body, then **assert `media_ids(new) ⊇ media_ids(old)` and REFUSE TO WRITE if it does not
hold** — a refusal costs nothing, a write costs the file. *(Rebuilding from the media id is safe for
the file but silently loses width, height, `localId` and layout.)* **Verify after every write by
comparing the `attachment` array ATTACHMENT ID BY ATTACHMENT ID — never by count, because a count match
hides a swap.** Code and the read-only auditor:
`build/ticket-reformat-2026-08-06/{attachment-audit,closed-tickets}/tools/`.

### (3) EXACT, NAMED TEST DATA

**Every** canned line · customer · **contact** · part · asset · work-order state · location · role/user
· date range — **named exactly as it appears on screen — plus what was tried and RULED OUT.**

- ❌ *"Create a work order with a canned line."* — **non-compliant.**
- ✅ *"Create a work order and add canned line **HD CVIP air brake trailer single/tandem** (fixed
  labour, $350.00). The total should read **$406.09**."* — compliant.

**AN UNNAMED VARIABLE IS AN UNVERIFIED VARIABLE:** the reader picks a different one, gets a different
result, and closes the ticket.

**THE SCAR — this is exactly how SV-8821 was lost.** Its steps said *"choosing a pre-set (canned) job
so it carries a price"*, naming none. The seeding script behind the evidence had silently filtered the
catalogue to **11 of 79** canned lines, so the report rested on a narrow slice nobody could see. The QA
lead used a different one, saw it work, and closed the ticket. **Re-testing then showed the canned line
was never the variable at all: the real condition was that the work order had NO CONTACT PERSON**,
which disables the Finance tab entirely. **Naming the data would have surfaced that in the first hour.**

**Write "any" ONLY where you have PROVEN it does not matter — and say how you proved it.** A short
table of *"these behave the same"* saves the reader the work you already did **and is the proof the
variable is not the cause.** If a value could not be tried, say which and why.

### (4) THE BUILD MARKER AND THE ENVIRONMENT

The **app-version string** (`<meta name="app-version">`) · the **QA branch/URL and API host** · the
**date and time observed** · and the **true viewing context** — *"desktop browser, signed in as an
Administrator"*. **State the role you were REALLY in, not the role the case assumes.**

### (5) A DUPLICATE SEARCH RUN FIRST, WITH THE QUERIES RECORDED

Not *"we looked"* — **the JQL, in the pack.** **Several tickets we filed already existed**, and a
duplicate is the cheapest possible way to look careless in front of the people whose queue it lands in.

### (6) THE SHAPE THE POs AND THE ENGINEERING MANAGER ASKED FOR

**Concise description · steps of reproduction · current behaviour in plain words · expected behaviour
in plain words · a line break, then the source.** **The source block at the bottom is not optional.**

This sits **inside**, and does not replace, the **seven-section format** (below), which remains the
mechanical layout.

### (7) A PRE-FILING SELF-CHALLENGE, WRITTEN DOWN

**Answer in writing: *what is the strongest argument that this is NOT a defect?***

> **If the honest answer is *"the source does not actually say that"* or *"I cannot reproduce it from
> my own steps"* — DO NOT FILE IT.**

Record **the challenge and the answer** in the pack. **The argument gets made either way: either we
make it first, in private, or the engineering manager makes it in public.**

### (8) CHECK IT IS NOT A RULE-24 PASS

**A control hidden in the UI while the API still allows the action is a PASS, not a defect.** Filing
one of those is **the literal definition of a ticket that "does not make sense"**, and it is an easy
mistake to make from a network capture.

**The inverse — the front end EXPOSING what the back end blocks — IS a defect** and stays filable.

**And check the other three things that make a ticket nonsense, because (8) is only the commonest:**
- **a CLOSED ticket is not a spec change.** The build failing a requirement whose ticket was closed
  *accepted* is still a deviation, **but it needs the expect-fail treatment, not a new ticket**;
- **ticket status is never evidence about the build** — five evidenced failures of status-as-proxy are
  on record, including **a fix that shipped while its ticket stayed Open** (SV-8851) and **two tickets
  closed OBSOLETE that still reproduced byte-identically** (SV-8843, SV-8847);
- **an API-only finding is classified by the reachability test and asked about separately**, whatever
  else is approved.

---

## THE API REACHABILITY TEST — and why it is asked separately every time

> **If the defect is invisible to a user AND to a manual tester — reachable only by calling an
> endpoint directly with a request the product's own screens never send — it is API-RELATED.**
> **If the same failure ALSO occurs through the product's own screens, it is a USER-FACING defect**
> that merely happens to be characterised technically. **A 500 in a response is technical evidence; it
> is not what makes a ticket API-related.**

**Judge by REACHABILITY FROM THE PRODUCT, never by whether our evidence happens to be an endpoint
capture.**

**The pack lists API-related findings in their OWN SEPARATE SECTION**, with the reachability reason per
item, and **the ask goes separately, in plain words: what the defect is, that it cannot be reached from
any screen, and the explicit question — file it or not?**

**The worked contrast, and it IS the test in practice:** **SV-8822** (a server error on saving a
customer, reachable only by sending a request shape the dialog never produces) was **withdrawn —
transitioned to OBSOLETE with a plain closing comment, never deleted**; **SV-8821** stayed **open**
precisely because it **also fails through the product's own screen.**

**Withdrawal, when he rules for it:** **CLOSE via a workflow transition with a plain-language comment,
NEVER DELETE** — a withdrawn ticket with its reasoning on the record is worth more than a deleted one,
and deletion is irreversible. **Keep the underlying finding written up in the pack: we withdraw the
TICKET, not the FINDING.**

---

## THE SHAPE, ONCE PERMISSION IS GIVEN

**Five things, no ambiguity between them:**

| Field | Value |
|---|---|
| `issuetype` | **`Story Defect`** (10007) |
| `parent` | **THE OWNING STORY** — never the epic |
| `priority` | **`Medium`** — **`High` is barred**, always |
| link | **also link the owning story `relates to`** |
| Product Area | **do NOT send it** — the field does not exist on this type |

**⚠️ NEVER use `Story Defect - Archive`** (10279) — a legacy type at the wrong hierarchy level, whose
lookalike name silently reproduces the old shape.

**Why a story parent and not the epic:** a `Story Defect` is a **subtask (hierarchy level −1)** and
**Jira refuses an Epic parent outright** — `HTTP 400 "Please select valid parent issue."` — while the
identical body with a Story parent returns **201**. Of all 502 Story Defects in the project, **0 are
parented to an Epic**.

**⚠️ AND A FACTUAL CORRECTION WORTH KNOWING, because our own rule text got it wrong once:** a Story
Defect is **NOT** returned by `parent = <epic>`. It is reachable from its epic **only via a two-hop
join** (defect → story → epic). **The shape is still the QA lead's instruction and stands** — this is
a fact in the reasoning, not a reason to change the shape.

**Keep adding the `relates to` story link even though it duplicates the parent** — the organisation's
"Change work type" wizard lands a converted ticket on **the story we LINKED**, so our habit is
precisely what makes other people's conversions land correctly.

**NO STANDALONE TICKETS.** Every ticket has a parent, **including a defect whose underlying cause sits
in another team's area** — *"it is not really a reporting bug"* is not a reason to leave it parentless.
**Where there is genuinely no owning story, ASK which story it belongs under.** Say in the technical
section where the fault actually lives, and keep any `blocks` link that explains why we raised it.

**NEVER CONVERT SOMEONE ELSE'S TICKET.** Conversion is **UI-only** (the REST API refuses it), it
**silently wipes Product Area with no changelog entry**, and other people are actively converting
tickets themselves. **It is the QA lead's call, never ours.**

---

## THE SEVEN-SECTION FORMAT — the mechanical layout

| # | Section | What goes in it |
|---|---|---|
| 1 | **Description** | Plain layman words. **No jargon, no codes, no endpoints.** What is wrong, and **why it matters** |
| 2 | **Branch / Environment** | Stated explicitly, never assumed: branch URL, API host, **build marker**, org/location ids, **date and time observed** |
| 2 | **Steps to reproduce** | **Real numbered steps a layman can follow**, using the **exact on-screen labels**. **If data is needed, include the steps that CREATE it.** **NAME THE EXACT TEST DATA** (item 3). **NO API calls here.** If the fault genuinely cannot be reached from any screen, **say exactly that** and point at section 7 |
| 4 | **Expected behaviour** | In plain words, **quoting the governing requirement** |
| 4 | **Current behaviour** | In plain words |
| 6 | **Images** | Attach **and embed inline so they RENDER** — not a file list. If none exists, **say so and say why** |
| 7 | **Technical details for developers** | **LAST.** All codes, endpoints, request/response bodies, request ids, row counts, spec references, evidence paths — **everything technical, and nothing technical above** |

### 🛑 TWO THINGS THAT MUST NEVER APPEAR IN A TICKET

1. **No reference to our test cases** — no internal IDs, no C-ids, no TestRail links, no "cases
   affected" section. **That mapping stays in OUR records** (`CASE-IMPACT.md` in the pack).
2. **No "this branch is not final / this finding is provisional" disclaimer.** His reasoning, recorded:
   *every QA branch is always non-final — they keep changing it — so saying so adds nothing, and it is
   OUR job to keep the test cases accurate, not the developer's job to caveat our findings.*
   **A defect hedged as provisional invites dismissal.**
   > **⚠️ DO NOT OVER-APPLY #2.** It drops the **Jira-facing text only.** The internal re-check
   > obligation stands: the `RECHECK-QUEUE.md` files stay exactly as they are.

### Inline images — the mechanism that actually works

A hand-built ADF `media` node **fails** (400 `ATTACHMENT_VALIDATION_ERROR`) because the media `id` must
be a **media-services UUID**, not the attachment id. The working route is **wiki markup through API
v2**:
1. `POST /rest/api/3/issue/{KEY}/attachments` (multipart, header `X-Atlassian-Token: no-check`) — note
   the `id` and **check `size` against the source file**.
2. `PUT /rest/api/2/issue/{KEY}` with `description` as a **wiki-markup STRING** containing
   `!file-name.png|width=900!` → 204.
3. **VERIFY IT RENDERS, do not assume:** the stored ADF must contain a **`mediaSingle` › `media`** node
   whose `attrs.id` is a **36-char UUID**, **and** `renderedFields.description` must contain a real
   `<img src=".../attachment/content/<id>">`. **Attached but not inline fails this format.**

> **SCOPE (Rule 110, QA lead 2026-09-16): the next two sections, the approved eight-heading
> layout, and the annotated-screenshot standard are COMPANY-WIDE — they apply in BOTH
> Replacement Scope and General Scope.** Only the *Product Owner note after the screenshots*
> is Replacement-Scope-only, and only where something worked before and does not now. Ask him
> which scope before starting any task; never infer it.

### 🛑 A COMMENT IS PICTURE-LED, TWO SECTIONS, AND EVERY ANNOTATION QUOTES THE SPEC — NEVER OUR RULES (QA lead, 2026-09-20)

**Verbatim:** *"You are supposed to keep the comment simple with annotated screenshots and the
annotation should refer to the Specs and not to your rule book as the developers can not read your
rule book … there should be less words and more screenshots to explain whats wrong with the specs
reference and steps of reproduction."*

**The shape of a QA comment on a developer's ticket — exactly this order:**

| # | Section | What goes in it |
|---|---|---|
| 1 | **What has been fixed now** | the annotated picture, then **Steps to reproduce** (numbered, UI only) |
| 2 | **What was correct before and is now broken** | one sub-section per finding: the annotated picture, then **Steps of replication** so the reader can see it is not working as expected, then **the spec reference quoted exactly as the spec words it** |

**The five hard rules:**
1. **LESS WORDS, MORE PICTURES.** The picture carries the explanation; the text carries the steps and
   the quote. Target well under 500 words of body text however many findings there are.
2. **EVERY ANNOTATION CITES THE SPEC**, by section and in the spec's own words — *"PRD 6.1: 'Prefix
   match on primary name field → +0.70'"*. **NEVER our vocabulary** ("the rulebook", "the requirements
   page", a rule number, a skill name, a case id): the developer cannot read any of it.
3. **QUOTE THE SPEC VERBATIM IN A `{quote}` BLOCK**, under the picture it proves — not paraphrased,
   not summarised.
4. **A SCORE OR ANY OTHER VALUE THE SCREEN DOES NOT SHOW IS PROVED IN THE PICTURE, NOT IN PROSE.**
   Compose the panel screenshot with a small table UNDER it — *Result · What the spec awards it ·
   Value returned* — so the picture alone is the evidence
   (`build/testing-tools/compose_score_table.py`; worked examples
   `build/global-search/run415-execution/sv10161-retest/pics/PIC1-3`).
5. **STEPS ARE UI STEPS A LAYMAN CAN FOLLOW** — the shortcut, the word typed, the tab opened. Only the
   last line may name the thing that must be read off the response.

A short *"checked and not broken"* list at the end is allowed and earns trust — each line naming the
spec sentence that the behaviour conforms to. Nothing else goes in.

Worked example: comment **76906** on **SV-10161** (2026-09-20) — 3 pictures, 482 words, 4 verbatim
PRD quotes, 3 reproduction blocks.

### 🛑 THE REPORT IS THE ISSUE, IN THE PRESENT TENSE — EVEN AFTER IT IS FIXED (QA lead, 2026-09-16)

**Verbatim:** *"you should not change the Ticket title and description into the past that it WAS
happening. The ticket title and description should stay as it is so that the manual QA tester can
actually reproduce the issue and may know what is the expected behavior for this ticket even though if
it is not happening anymore."*

A report is the **specification of the issue**, not a diary of it. The check behind it is re-run on
every build, so both must stay runnable. **Six reports were rewritten into the past on 15 September and
had to be restored the next day.**

| Part of the report | What it says when the fault no longer reproduces |
|---|---|
| Title · Description · Steps · Current behaviour · Expected behaviour | **The issue, present tense, unchanged.** A tester must be able to reproduce it and see what is expected. |
| The picture in the body | **The fault as reported.** Not a before-and-after. |
| A comment | The only place "it passes now" goes — `→ QA Status: Passed`, with today's screenshot. Match the QA lead's own short format. |
| The status | **His to set.** Never moved by us, and the report is never closed by us (L0131). |

### 🛑 THREE THINGS EVERY COMMENT CARRIES, WITHOUT EXCEPTION (QA lead, 2026-09-20)

**Verbatim:** *"keep the comment PO friendly/simplified and with annotated screenshots — your no
screenshot should be NOT annotated, and your no comment should be without a screenshot, and your no
comment should be without quoting the specs reference."*

Three absolute rules, and they apply to a **comment** exactly as they apply to a ticket description:

| # | Rule | Why it was needed |
|---|---|---|
| 1 | **No comment without a screenshot.** | My first comment on **SV-10188** was 330 words of prose with the PRD quoted and *no picture at all*. A reader had to take my word for what the screen showed. |
| 2 | **No screenshot without annotation.** | A bare screenshot makes the reader hunt for the point. Every picture carries its boxes and its sentences, and the sentence leads in plain words with the spec in brackets after it (rule above). |
| 3 | **No comment without the spec quoted.** | A claim about what *should* happen is worthless unless the reader can see the sentence it rests on — quoted verbatim in a `{quote}` block, with the page id, version and read date. |

**And the comment is written for the Product Owner, not the developer**: lead with what a person
using the product is trying to do, then the picture, then **Actual Result** / **Expected Result**,
then the quote. Worked example: comment **76907** on SV-10188 — two annotated pictures (the work
order's own parts, then the search opened from that same work order), 329 words, one verbatim PRD
quote, and the test check with its run link at the bottom.

### 🛑 BEFORE CALLING A PERMISSION SIDE-EFFECT A DEFECT, OPEN THE ROLES AND PERMISSIONS SCREEN (QA lead, 2026-09-20)

**Verbatim:** *"if you disable something and find that something else which apparently is not related
to what you have disabled had also got disabled do check in the roles and permission for the same role
if disabling one thing has also auto disabled that. If disabling something auto disables something
else, and then it disappears from search then its ok."*

**The incident this comes from:** I filed **SV-10278** saying that removing *See Financial Data* wrongly
hid the whole *Part sales* heading, because the role's permission list, read back from
`/api/auth/me/fe-permissions`, still contained `partSalesView`. The roles and permissions screen states
the dependency in plain words — *"Part Sales requires See Financial Data. Enable it to grant this
permission?"* — so the behaviour is correct and the ticket was withdrawn the same day.

**The rule:** a permission list is DATA; the dependencies between permissions are RULES, and the rules
live on the roles and permissions screen. **Reading the list is not reading the rules.** So when
switching one permission off makes something apparently unrelated disappear:

1. **Open the role in Administration → Staff → Roles** and look at the two permissions together.
2. **Toggle the dependent one ON with the other OFF** and read the dialog the application shows — a
   dependency announces itself there, in the product's own words, and that sentence is the evidence.
3. Only if the screen shows **no** dependency is the disappearance a candidate defect.
4. Quote the dialog verbatim in whatever you write, exactly as a spec quote (Rule 106's live-source
   requirement applies to the product's own configuration screens, not only to the PRD).

**This generalises beyond permissions:** wherever setting A appears to change unrelated behaviour B,
the settings screen that owns A is a source and must be read before B is called broken.

### 🛑 A NUMBER THE READER CANNOT INTERPRET IS JARGON — GIVE THE PRODUCT'S OWN LABEL, OR SAY THE PLAIN THING (QA lead, 2026-09-20)

**Verbatim:** *"When you say 'a part with 176 on the shelf and a part with none score the same' —
nobody knows what 176 is and what shelf means. Please keep things simple always in your tickets."*

Two separate faults in one sentence, and both are easy to repeat:

1. **A BARE NUMBER CARRIES NO MEANING.** `176` is only meaningful next to the word the screen prints
   beside it. Write **"the row says 176 Available"**, never "176 of them". If the number is not doing
   any work, drop it: **"a part that is in stock and a part that is out of stock"** beats both.
2. **AN INVENTED SYNONYM IS NOT PLAIN ENGLISH.** *"on the shelf"* appears nowhere in the product. The
   row prints **Available**; the state is **in stock** / **out of stock**. This is the same rule as
   *Vendor* not "supplier" and *VIN number* not "chassis number" — **read the word off the screen**
   (Rule 57), and where no screen word exists use the ordinary one, never a warehouse metaphor.

3. **NEVER A METAPHOR — THE BUILD'S GLOSSARY IS THE ONLY VOCABULARY (QA lead, 2026-09-20:
   *"Never use metaphore, always use everything and glossary from the build."*).** Not *on the shelf*
   for **Available**, not *supplier* for **Vendor**, not *chassis number* for **VIN number**, not
   *jump straight to it* for the pinned row. If the screen has a word, that word is the word. If the
   screen has no word for it, use the ordinary description of the state (*in stock* / *out of stock*),
   never an image borrowed from somewhere else. This binds the prose, the annotations, the picture
   tables, the captions and the titles alike. The observed glossary lives in
   `build/OBSERVED-UI-LABELS-<env>.md` — read it rather than inventing a word.

**The test before any ticket goes out:** for every number and every noun in the body, ask *"is this on
the screen, and would a reader who has never used the product know what it means?"* If either answer
is no, replace it with the product's label or with the plain state. It applies to the annotations, the
picture tables and the captions as much as to the prose.

### 🛑 THE PRODUCT'S OWN WORD FOR A THING IS THE WORD — NEVER A "PLAINER" SYNONYM (QA lead, 2026-09-16)

Plain English means **no jargon**; it does not mean **renaming what the product names**. Writing
"supplier" for a **Vendor**, or "chassis number" for a **VIN number**, forces the tester to translate —
the opposite of plain — and it cost a correction pass across 5 reports and 4 checks. **Read the word off
the screen** (Rule 57: labels come from the build). If the product's word seems clumsy, raise it; never
translate it silently. Known pairs on this product: **Vendor** (not supplier) · **VIN number** (not
chassis number) · the record page prints **VIN/Serial #**.

#### 🛑 STEP 4 IS NOT OPTIONAL — THE PICTURE IS STILL A POSTAGE STAMP UNTIL THE MEDIA NODE CARRIES ITS TRUE SIZE (QA lead, 2026-09-15: *"Perfect the pictures is perfect NOW, save it as your rule/skill etc forever"*)

Steps 1–3 embed the picture. They do **not** make it readable. Wiki markup hands Jira **no height**, so
the `media` node is born with a made-up one (we measured **183** every time) and Jira draws the picture
to that wrong shape — the reader has to click it, which is precisely what the Head of Product asked us
to stop doing. **Three causes, and all three must be fixed or it is still small:**

1. **No true height.** ⇒ **Step 4: read the description back as ADF, set the `media` node's `width` and
   `height` to the file's REAL pixel size, set the parent `mediaSingle` to `layout: "full-width"`, and
   `PUT /rest/api/3/issue/<KEY>`.** Confirm exactly **1** node was fixed.
2. **A re-upload of the same filename does not replace the old one** — the embed resolves by name to the
   **FIRST** attachment ever uploaded under it, so a better picture changes nothing on screen. ⇒ **delete
   every existing attachment on the ticket BEFORE uploading** (`clear_attachments()`).
3. **A whole screen shrunk to fit is unreadable at any size.** ⇒ crop each half to the search box and its
   panel, and compose the two halves into **ONE** picture — the live product above, the new version
   below — so the reader is not made to do the comparing:
   `MAXW=560 python3 build/testing-tools/compose_compare.py --v1 … --v2 … --out ticket-images/<KEY>.png`.
   **560 inner + padding = 588 px wide, and 588 is the width he approved.**

**Never call a picture done because the upload succeeded.** Read the ADF back and check the media node's
width and height are the file's own. Tool that does all four steps:
`build/global-search/tickets-2026-09-14/rewrite_to_standard.py`. Learning **L0130**.

---

## THE DELIVERABLE — the prepared pack

`build/<project>/defect-pack-<date>/`:

| File | Contents |
|---|---|
| `DEFECT-CANDIDATE-<id>.md` | **One per finding.** The **admissibility gate A1–A10** filled in, the six refusals argued, and the VERDICT. **Committed whether the verdict is ADMISSIBLE or NOT** — a failed candidate is a record, not a waste (Rule 94) |
| `TICKET-<n>-<short-name>.md` | The full seven-section body, ready to paste, **with the eight bar items evidenced above it**. **Only ever written for a candidate whose gate verdict is ADMISSIBLE** |
| `SELF-CHALLENGE.md` | Per finding: **the strongest argument that this is not a defect**, and our answer |
| `DUPLICATE-SEARCH.md` | **The JQL queries run**, and what each returned |
| `API-SPLIT.md` | API-related findings in their own section, **with the reachability reason per item**, and the separate ask |
| `CASE-IMPACT.md` | Which of our cases this affects — **kept OUT of the ticket** |
| `evidence/` | Annotated screenshots, captured responses — **redacted at the point of capture** (core §10) |
| `NOT-FILED.md` | Findings deliberately **not** offered, and why — so a deliberate non-filing can never look like a miss |

**Then, in the report to the QA lead:** what the defect is, in plain layman words · the evidence · the
source quoted verbatim · **our recommendation** · and the **ready-to-file text**. **We do the whole job
of preparing the ticket and stop at the button.**

**Log it in `build/OUTSTANDING-ITEMS-REGISTER.md`.** An unanswered ask is a **missing input** and stays
outstanding — never quietly dropped, never re-decided by us.

*Canonical example: `build/report-suite/defect-pack-2026-08-04/` (`TICKET-1…6*.md`, `API-SPLIT.md`,
`FILED.md`, `repro-sv8821/`).*

**⚠️ ONE NAMING FACT, so the two conventions are not mistaken for two different artefacts (recorded
2026-08-21 while merging the lane files):** a **VIU** pass and a **build-verification** pass write the
Rule-51 split into their own dated pass folder as **`API-ASK.md`**, not `API-SPLIT.md` — e.g.
`build/schedule/full-viu-2026-08-05/API-ASK.md`, `build/filters/full-viu-2026-08-05/API-ASK.md`.
**Same content, same obligation, different filename by folder type.** When looking for whether an
API-only finding was already written up, **search for both names** — a finding that exists under the
other name and is not found reads as unrecorded, and gets asked about twice.

---

## THE STEPS

1. **Core §0 pass-start checklist.**
2. **Confirm the hold still stands** before doing anything that assumes filing. *(Asked to confirm it
   before raising a ticket, he answered: **"Good catch, be like this always."**)*
3. **Rule out our own probe first** (skill `03`) — **a false absence looks exactly like a finding.**
   **More than forty were caught in two days and NOT ONE was a product fault.**
4. **Rule out our own instrumentation** (skill `03`) — re-run from a **proven-clean baseline** when the
   result surprises you in an area that already has open tickets.
5. **Find the source and quote it** — item 1. **If you cannot, STOP: there is no ticket.**
5a. **OPEN A `DEFECT-CANDIDATE-<id>.md` AND RUN THE ADMISSIBILITY GATE (A1–A10) AS YOU GO** — it is not
    a form filled in at the end. **A3 (unfinished feature) and A4 (already reported, incl. closed) are
    cheap and kill findings early — do them BEFORE spending a repro on the finding.**
6. **Reproduce it, naming every piece of data** — item 3 — **and record what you ruled out.**
6a. **Reproduce it a SECOND time (A1), with the build marker recorded at the start and at the end,
    proved unchanged.** A defect seen once is not admissible.
7. **Capture and annotate** — item 2.
8. **Run the duplicate search and record the JQL** — item 5.
9. **Write the self-challenge** — item 7 / gate check **A9, all six refusals**. **Be willing to lose
   here — if any one of the six is plausible and undefeated, DO NOT FILE; escalate with the doubt.**
9a. **RE-READ THE SOURCE (Rule 59 / A2) — now, minutes before it goes to him**, and re-derive the
    expectation if the version moved. **This is the check that prevents the "obsolete" refusal.**
10. **Apply the four nonsense checks** — item 8.
11. **Classify API vs user-facing** by reachability, and split the pack.
12. **Write the seven-section body** and the pack.
13. **Score it against BOTH gates** — the **admissibility gate (A1–A10)** first, then the 2026-08-17
    checklist and the eight-item bar. **A fail on any item = NOT READY; say WHICH item failed**, and
    record where the finding went instead (`NOT-FILED.md`, the re-check queue, a PO question).
14. **Report it with the recommendation, and stop.** Log it in the register.
15. **ON RESUME ONLY (hold lifted + his go-ahead): ONE TICKET AT A TIME** — create one, he verifies it,
    only then the next. **Never a batch** (Standing Rules 62/73).

---

## GUARDRAILS

- **G1 — Nothing is filed. The hold is active** (core §11.1). When it lifts, permission is still
  required **per ask**.
- **G2 — A finding being real, sourced and obviously worth filing is NOT permission.** How good the
  finding is and whether we may file it are **two unrelated questions**.
- **G3 — An API item is asked about separately, even inside an approved batch.**
- **G4 — Never delete a ticket.** Withdraw by transition, with a plain comment.
- **G5 — Never edit or convert another author's ticket** (core §5, and the Product Area wipe above).
- **G6 — Never file a Rule-24 pass** (item 8).
- **G7 — Never file on "it is obviously broken".** The honest question is not *"am I right?"* but
  ***"can I prove it from a document, and can a stranger reproduce it from my own steps?"*** — and if
  the answer to either is no, **hold it and say so.**
- **G8 — Priority `Medium`. `High` is never ours to set.** Severity belongs in the ticket's words and
  in the `Severity` field, not in `Priority`. *(And never "restore" a priority the QA lead changed —
  that produced an embarrassing `High → Low → High → Low` round trip on four tickets, all under our
  shared account, where his edits are indistinguishable from ours in the changelog.)*
- **G9 — 🛑 If an instruction for this pass conflicts with a rule here, STOP and surface it BEFORE
  acting** (core §11.6, Standing Rule 63). **What he instructed, quoted verbatim · what the rule
  requires, quoted, with its number · an explicit ask: which should we follow?** **Neither silent path
  is available** — not silently following the new instruction, not silently keeping the old rule. **A
  tightening or a layering is NOT a conflict**; escalating those trains him to wave escalations
  through. *He endorsed the practice by name: **"Good catch, be like this always."***
- **G10 — On resume, ONE TICKET AT A TIME — never a batch** (Standing Rule 73). Create one → he
  verifies it → only then the next. A weak ticket filed in a batch discredits the good ones beside it;
  one-at-a-time makes each separately answerable and keeps Rule 62's per-ask permission true in fact.
---

## HONESTY NOTES

- **"Cannot clear the bar" is a legitimate, correct outcome.** Say which item failed. **Withdraw a
  weak finding from the pack rather than offering it weaker.**
- **✅ RE-CHECKED 2026-08-13 — the open item this skill owned is DISCHARGED, and the count was SIX,
  not five.** The prepared Report Suite defects live in
  **`build/report-suite/full-viu-2026-08-06/DEFECTS-FOR-PERMISSION.md`** (D1–D5 **plus "Defect 6"**,
  added later the same day — the long-repeated *"five prepared defects"* was stale). The first cold run
  of this skill scored all six against the eight items —
  **`build/report-suite/defect-recheck-2026-08-13/SCORECARD.md`**: **D1 holds** (offer as a
  reopen/broaden of SV-8954) · **D2 and Defect 6 hold** (new tickets) · **D3 and D4 are NOT filable as
  new tickets** (closed SV-8943/SV-8967 still reproduce — reopen asks, per item 8) · **D5 is WITHDRAWN
  as a ticket** (cosmetic, plausibly the document's error — a PO question). Common debts before any is
  offered: written self-challenges (none existed), recorded JQL duplicate searches (none existed),
  paste-ready bodies with C-ids stripped, and **annotated screenshots re-captured after the next
  Reports build lands** (every existing capture is bare, and D4's cited `wip-checks.png` does not
  exist). **The FILING still waits on the QA lead's hold.**
  **⚠️ SUPERSEDED WORDING, KEPT AND DATED:** until 2026-08-13 this note read *"the five
  already-prepared Report Suite defects were written under the OLD bar… NOT yet re-checked"* — and
  named no path to them, which was this skill's first proven cold-start defect: a fresh session had to
  grep the repository to find what the skill itself owned.
- **⚠️ AND THE BAR MATTERS MORE NOW THAN WHEN IT WAS WRITTEN, BECAUSE ALL THREE BRANCHES ARE FINAL**
  (QA lead, 2026-08-11: ***"The Branches are Final now."***). **A deviation on Schedule, Filters or the
  Report Suite is a REAL DEFECT IN A FINISHED FEATURE, not a possibly-unfinished one** — so the
  hedge that used to soften a weak finding is gone, and **a ticket that fails the bar now lands
  squarely as the "does not make sense" complaint that put the QA lead's job at risk.** **Finality
  raises the standard of evidence; it does not lower the standard of permission.**
- **Withdraw our own invalid ticket when we find it.** One of ours was closed OBSOLETE because it had
  been raised against a shop **with no business hours configured — which the source case's own
  precondition required.**
- **A deliberate non-filing is RECORDED** (`NOT-FILED.md`), so it can never look like a miss.
- **Be explicit about what could not be captured.** *"The no-logo state was never produced because
  this organisation has an uploaded logo"* is the correct sentence — **B5 was not filed for exactly
  that reason.**

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| **File the ticket** | **Nobody, while the hold stands.** Then: the QA lead's permission, per ask |
| Establish whether the source supports the expectation | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** |
| Prove the finding is not our own probe or our own setup | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** — do this **first** |
| Write or repair the affected cases | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** |
| Put the item in the completion report | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Ask the PO whether the behaviour is even wrong | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** — **if the answer decides whether it IS a defect, it is a question, not a ticket** |

---

## 🛑 RECONCILE EVERY CASE AGAINST THE SOURCE **BEFORE** YOU JUDGE IT (Rule 106, extended 2026-09-15)

**QA lead, 2026-09-15:** *"MAKE it a rule and save in your Skills etc and wherever needed forver."*

Before judging a case — **before running it, not after it fails** — compare its Expected against the
governing document as it reads TODAY.

**Why the old trigger was not enough.** Rule 106 used to fire only when you were about to propose a
defect, which means only when the product FAILS. A case whose Expected disagrees with the source, and
whose product happens to match the case, **passes** — and is written up as verified, and nobody looks
at it again. That is a **false pass manufactured by our own test**, and it is worse than a false
defect: a false defect gets argued with by a developer the same day; a false pass is believed for ever.

**Four outcomes. Two of them are our fault, not the product's:**

| Case vs source | Build | What it is | What you do |
|---|---|---|---|
| agree | matches | a real pass | record it |
| agree | differs | a real defect | ask to file it |
| **disagree** | matches the **case** | **FALSE PASS — the case is the defect** | do not use the pass as evidence; ask to correct the case |
| **disagree** | matches the **source** | **FALSE DEFECT about to be filed** | the product is right; ask to correct the case, never raise a ticket |

**Doing this without breaking Rule 81** (sources are offered and gated; never pulled on your own
initiative): **read the governing source ONCE per pass, with his go-ahead, and reconcile every case
against that one live read.** Record page id, version and read date once in the pass folder and cite
it per case. One gated fetch per pass, not one per case. **A pass with no go-ahead reconciles against
nothing and says so** — it does not reconcile against memory, an extract, or `requirements.md`
(Rules 12, 100).

**Write it down:** `build/<project>/source-verify-<date>/` — one file listing every case checked, the
quote it was checked against, and which of the four outcomes it fell into.

> A case is a claim about what the product should do. **Check the claim before you use it to judge
> anything** — including when the product agrees with it.
