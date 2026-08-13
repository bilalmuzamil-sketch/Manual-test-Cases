# Skills — the seven jobs this workspace does, written to be run cold

> **Each file below is a complete specification for one job, written for a session with NO memory of
> this workspace.** They exist because the QA lead asked for them in these words (2026-08-12):
> *"In future we have to convert this whole session into multiple Skills, one skill per session, so I
> want you to manage this session accordingly"* — and, on why: ***"I do not want our hard work to be
> lost and things start to bite me and cost me my job due to this."***
>
> ## 🔴 START WITH [`00-COMMON-CORE.md`](00-COMMON-CORE.md), ALWAYS
> Every skill points at it instead of repeating it, so a fix lands in **one** place instead of seven.
> It carries the honesty bar · TestRail write discipline and hazards · runs · foreign cases · access
> mechanics · environment · session survival · git on a shared branch · secrets · authority ·
> reader-facing standards · and the OUTSTANDING section every deliverable ends with.

---

## THE SEVEN

| # | Skill | Trigger word | What it does, in one line |
|---|---|---|---|
| **01** | [CASE-BUILD](01-CASE-BUILD.md) | **`CASE-BUILD`** | Turn the documents into test cases, and prove nothing was missed |
| **02** | [SOURCE-CHECK](02-SOURCE-CHECK.md) | **`SOURCE-CHECK`** | Prove we hold today's specification, epic, designs, tech plan and PO answers — not last week's |
| **03** | [RUN-CHECK](03-RUN-CHECK.md) | **`RUN-CHECK`** | Open the product and prove a tester could actually execute each case |
| **04** | [TESTER-READY](04-TESTER-READY.md) | **`TESTER-READY`** | Make the suite fit to hand over, and tell the testers what to run and what to skip |
| **05** | [PROJECT-REPORT](05-PROJECT-REPORT.md) | **`PROJECT-REPORT`** | The completion table, delivered before the next project starts |
| **06** | [DEFECT-PREP](06-DEFECT-PREP.md) | **`DEFECT-PREP`** | Build a defect ticket that cannot be challenged — then stop at the button |
| **07** | [PO-QUESTIONS](07-PO-QUESTIONS.md) | **`PO-QUESTIONS`** | One sheet, in plain words, sent last |

**Call one like this:** *"Run **RUN-CHECK** for **Schedule**."* Each file opens with a kickoff prompt
to fill in.

---

## HOW THEY COMPOSE

```
        01 CASE-BUILD  ──►  02 SOURCE-CHECK  ──►  03 RUN-CHECK  ──►  04 TESTER-READY
        do the cases        are the sources       can a tester        hand it to the
        exist at all?       still current?        actually run it?    test team

                     └──────────────  05 PROJECT-REPORT  ◄──────────────┘
                              what is done, what is left — before the next project

        06 DEFECT-PREP  ── raised BY 03, prepared, held for permission
        07 PO-QUESTIONS ── written throughout, SENT once 05 says everything else is done
```

**Read the arrows as "answers a different question", not as a rigid pipeline.** They are run
individually far more often than in sequence.

### 🔑 "VIU" = SOURCE-CHECK + RUN-CHECK + wording

The word has meant different things at different times. **What it means now:**

> **`02` SOURCE-CHECK** (what the case should expect, from the documents)
> **`+ 03` RUN-CHECK** (that it can actually be run, and the labels are the ones on screen)
> **`+` build-accurate wording** (core §12 — every label exactly as it appears, in plain layman words)

**And what it NO LONGER includes: the pass/fail verdict.** The QA lead re-scoped that half to the
manual tester on 2026-08-11 and confirmed it verbatim — *"you are RIGHT"*.

**⇒ So "VIU complete" is never said.** The accurate phrase — **stronger than the overclaim, not
weaker** — is:

> *"source-verified and build-accurate in its preconditions, steps, navigation and labels — with the
> behaviour verdict belonging to the tester."*

---

## WHICH ONE TO REACH FOR

| If you are asked to… | Reach for |
|---|---|
| *"Write the cases for this story / spec / epic"* | **01** |
| *"Did we miss any cases?"* / *"the coverage matrix is out of date"* | **01** (steps 3, 4, 8) |
| *"The spec has been updated"* / *"is our copy current?"* | **02** |
| *"What changed between v23 and v25?"* | **02** (step 5) |
| *"VIU the cases"* | **02 then 03**, and say plainly that the verdict is the tester's |
| *"Are these cases runnable?"* / *"the branch has been rebuilt"* | **03** |
| *"The labels have changed"* | **03** (§4 — read **both** the DOM string and the computed style) |
| *"The testers start tomorrow"* | **04** |
| *"Some held cases are marked Passed"* | **04** (§3) |
| *"Where are we on this project?"* / *"what is left?"* | **05** |
| **Before starting work on a different project** | **05** — this is a standing gate, not a request |
| *"This looks like a bug"* | **03 first** (rule out our own probe), **then 06** |
| *"Prepare the ticket"* | **06** — and **nothing is filed while the creation hold stands** |
| *"We need Branko to decide something"* | **07** — but **test the blocker first** (core §11.4) |

---

## THE FIVE THINGS THAT WILL BITE A COLD SESSION FASTEST

Each is treated fully in the core; they are listed here because **they are the ones that look safe.**

1. **The byte-check passes when the PAYLOAD is wrong.** It proves the server stored what you sent, not
   that what you sent was right. **Dry-run and READ the built payloads.** (core §2.4)
2. **A selector that matches nothing looks exactly like a missing feature.** **More than forty false
   absences in two days, and not one was a product fault.** **Run a control that proves your detector
   can fire.** (`03`)
3. **A clean git tree is not a current one.** One checkout was **110 commits behind** while reporting
   *clean* and *1 ahead*, and a recovery pass concluded six passes' work was lost. **Fetch and
   fast-forward first.** (core §9.1)
4. **`updated_on` lies in both directions** — frozen while text changed, fresh while a write never
   landed. **Verify by content.** (core §2.5)
5. **The repository is PUBLIC**, and **response bodies leak credentials as readily as headers** — 12
   JWTs reached it that way. **Redact at the point of capture; scan every staged diff.** (core §10)

---

## WHAT THESE FILES ARE **NOT**

- **Not a replacement for `CLAUDE.md`.** That is the authority — the standing rules, the project
  entries, the durable facts. These skills operationalise it and **state every referenced rule in
  substance**, but where the two ever differ, **`CLAUDE.md` wins and this file is the one to fix.**
- **Not a replacement for `build/APP-ACTIONS-PLAYBOOK.md`.** Environment recipes, endpoints, payload
  shapes and the declared TestRail hazards live there in full. **Reuse them; never re-derive them —
  and append any new proven recipe the moment you find it.**
- **Not a status report.** Nothing here says how far any project has got. That is `05`, derived live,
  and each project's own `PROJECT-STATE.md`.
- **Not complete about the incidents.** `build/SESSION-LEARNINGS-2026-08-12.md` is the fuller record of
  what went wrong on 11–12 August and why, with the committed evidence for every claim.

---

## THE SOURCES BEHIND THIS SET

| Topic | File |
|---|---|
| Standing rules, project entries, durable facts | `CLAUDE.md` |
| The incidents behind the rules, 11–12 August 2026 | `build/SESSION-LEARNINGS-2026-08-12.md` |
| Environment recipes; §A sessions · §J TestRail hazards · §L git | `build/APP-ACTIONS-PLAYBOOK.md` |
| The seven survival requirements + the compliance checklist | `build/NO-WORK-LOSS-STRATEGY.md` |
| What we are waiting on, cross-project | `build/OUTSTANDING-ITEMS-REGISTER.md` |
| Every callable process and its trigger | `build/PROCESS-CATALOG.md` |
| How a process doc must be written | `build/PROCESS-AUTHORING-STANDARD.md` |
| The three-dimension quality gate in full | `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` |
| Per-project cold-resume snapshots | `build/<project>/PROJECT-STATE.md` |
