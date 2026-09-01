# 06 · DEFECT-PREP — build a defect ticket that cannot be challenged, then stop at the button

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
| A6 | NOT environment / data / role | ☐ | env + build marker, role reset, seeded data, clean session |
| A7 | Correct parent, proved from the epic's children | ☐ | story key + how ownership was established |
| A8 | Evidence complete | ☐ | annotated screenshots, numbered steps, marker, env, role, time |
| A9 | Adversarial self-review survived | ☐ | the six refusals argued and defeated, below |
| A10 | Rule 62 — prepared to the button, not filed | ☐ | the ask, and his answer (or "not yet asked") |

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

## THE TEN CHECKS

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
| **A one-plain-sentence caption on every image**, phrased as **"What you should see"** vs **"What actually happens"** | The caption is what a non-technical PO reads; the image is what proves it |
| **A before/after pair wherever behaviour differs** — the correct state and the faulty state, same screen, same data | One image shows a claim; two show a difference |
| **NEVER crop away the context that proves which screen or which build it is** | A tight crop of a number proves nothing and is the easiest thing in the world to dismiss |
| **Human-readable file names** (Rule 19) — `work-in-progress-total-excludes-tax-actual.png`, not `img3.png` | A later session, and the QA lead, must find them without opening them |
| **Redact at the point of capture** (core §10) — no customer data, no tokens, no cookies. **This repo is PUBLIC (Rule 82)** | A screenshot is a file in a public repo |
| **Embedded so they RENDER** — not a file list | See **Inline images — the mechanism that actually works**, below |

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
| 3 | **Steps to reproduce** | **Real numbered steps a layman can follow**, using the **exact on-screen labels**. **If data is needed, include the steps that CREATE it.** **NAME THE EXACT TEST DATA** (item 3). **NO API calls here.** If the fault genuinely cannot be reached from any screen, **say exactly that** and point at section 7 |
| 4 | **Expected behaviour** | In plain words, **quoting the governing requirement** |
| 5 | **Current behaviour** | In plain words |
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
