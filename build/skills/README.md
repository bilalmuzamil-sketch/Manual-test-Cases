# Skills — the eight jobs this workspace does, plus the support files and the lane routers

> **Each file below is a complete specification for one job, written for a session with NO memory of
> this workspace.** They exist because the QA lead asked for them in these words (2026-08-12):
> *"In future we have to convert this whole session into multiple Skills, one skill per session, so I
> want you to manage this session accordingly"* — and, on why: ***"I do not want our hard work to be
> lost and things start to bite me and cost me my job due to this."***
>
> ## 🔴 START WITH [`00-COMMON-CORE.md`](00-COMMON-CORE.md), ALWAYS
> Every skill points at it instead of repeating it, so a fix lands in **one** place instead of eleven.
> It carries the honesty bar · TestRail write discipline and hazards · runs · foreign cases · access
> mechanics · environment · session survival · git on a shared branch · secrets · authority ·
> reader-facing standards · the OUTSTANDING section every deliverable ends with · **the provenance
> line and the read-date every source now carries (§14)** · **the `AUTOMATION:` marker and its
> live-backing precondition (§15)** · and **finality — all three branches are FINAL (§16)**.
>
> **⚠️ AND IF YOU READ ONLY FOUR SECTIONS OF IT, READ THESE — they were all added or corrected on
> 2026-08-13 by the adversarial audit, and each is a thing that has actually bitten us:**
> **§17 the PROJECT FACT SHEET** (epic · group · run · branch · API host · spec page · case source,
> per project — a cold session could not run a single skill without them) · **§2.10 the POST-WRITE
> ASSERTION RE-AUDIT** (*an audit committed before the repair does not audit the repair*) ·
> **§15.1a a HOLD on a runnable case DISARMS it** · **§7.5 a probe may not press a destructive
> control to find out what it does.**
>
> ## 📋 AND [`COVERAGE-MATRIX.md`](COVERAGE-MATRIX.md) IS THE PROOF THIS SET IS COMPLETE
> One row per session learning — the item, its source, **which file carries it**, and the verdict.
> **98 items: 80 already present, 16 added, 2 completed, 2 deliberately excluded with the reason.**
> It also records, rather than hides, **its own two false absences and its own corrected totals** —
> read it if you want to challenge whether anything was missed, or before adding a new learning, so
> the new item lands in the right file **and gets a row.**

---

## THE EIGHT CORE JOBS — one skill per job, and the canonical procedure lives here

| # | Skill | Trigger word | What it does, in one line |
|---|---|---|---|
| **01** | [CASE-BUILD](01-CASE-BUILD.md) | **`CASE-BUILD`** | Turn the documents into test cases, and prove nothing was missed |
| **02** | [SOURCE-CHECK](02-SOURCE-CHECK.md) | **`SOURCE-CHECK`** | Prove we hold today's specification, epic, designs, tech plan and PO answers — not last week's |
| **03** | [RUN-CHECK](03-RUN-CHECK.md) | **`RUN-CHECK`** | Open the product and prove a tester could actually execute each case |
| **04** | [TESTER-READY](04-TESTER-READY.md) | **`TESTER-READY`** | Make the suite fit to hand over, and tell the testers what to run and what to skip |
| **05** | [PROJECT-REPORT](05-PROJECT-REPORT.md) | **`PROJECT-REPORT`** | The completion table, delivered before the next project starts |
| **06** | [DEFECT-PREP](06-DEFECT-PREP.md) | **`DEFECT-PREP`** | Build a defect ticket that cannot be challenged — then stop at the button |
| **07** | [PO-QUESTIONS](07-PO-QUESTIONS.md) | **`PO-QUESTIONS`** | One sheet, in plain words, sent last |
| **08** | [RECOVER](08-RECOVER.md) | **`RECOVER`** | Establish what a killed pass actually landed, by content, and finish it |
| **09** | [TEST-EXECUTION](09-TEST-EXECUTION.md) | **`EXECUTE`** | Execute the existing cases against a build and record honest results — the honest-status rule, disciplined Blocked, the retest loop, union-only run sync |

**Call one like this:** *"Run **RUN-CHECK** for **Schedule**."* Each file opens with a kickoff prompt
to fill in.

---

## EVERY OTHER FILE IN THIS FOLDER (refreshed 2026-08-21 — the header used to say "eight" and
stopped there, which left six files undocumented)

| File | What it is |
|---|---|
| [`00-COMMON-CORE.md`](00-COMMON-CORE.md) | **The shared core — read it first, always.** Its own routing table says which section covers what. **§16.0 = the CURRENT finality position (the branches are NOT final); §16.1 = the superseded 2026-08-11 "FINAL" text, kept dated** |
| [`09-TEST-EXECUTION.md`](09-TEST-EXECUTION.md) | **The canonical execute-and-record procedure** (created 2026-08-26). Picking the run in Rule-47 scope, pinning the build marker at pass start AND end, **batched** execution (never one tool call per case, Rule 88), per-case evidence, the **honest-status rule** (*a case not actually executed is NEVER marked Passed*), **Blocked — never skip, never guess**, but decomposed per Rule 68, the retest loop, and the **union-only** run sync. **Results are held LOCALLY by default** — core §4.1 bars writing a result to another tester's run. Cross-references `03-RUN-CHECK` rather than duplicating it |
| [`13-CROSS-SESSION-SAFETY.md`](13-CROSS-SESSION-SAFETY.md) | **Rules 82–87** — the real secret-scan gate, lane write locks, the tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, case-body snapshots. **Read it when more than one session is live** |
| [`14-ACCESS-RESILIENCE.md`](14-ACCESS-RESILIENCE.md) | **Rule 89** — primary path and fallback ladder per system, the session-start preflight, failure signatures, the **five MCP-hygiene hard rules**, the unattended **BLOCKED** protocol. **Read it BEFORE the first access call** |
| [`15-NEW-PROJECT-INTAKE.md`](15-NEW-PROJECT-INTAKE.md) | **Rules 92–93** — the project-agnostic intake for ANY newly named project: the required 7-input set, the committed PRESENT/MISSING checklist, the source-currency block, the scaffolding pointer, and the **REVIVAL** variant (an existing project starts as a RECONCILIATION, never fresh authoring). **Read it the moment the QA lead names a project** |
| [`16-TEST-EXECUTION-AND-DEFECTS.md`](16-TEST-EXECUTION-AND-DEFECTS.md) | **ROUTER** — the TEST EXECUTION & DEFECT REPORTING lane (created 2026-08-26). Points at `00` → `09` → `03` → `06` → `04` §6.1 → `13` → `14`. **No procedure of its own.** Its lane's output is **admissible, evidenced defect CANDIDATES the QA lead approves one at a time — not filed tickets** (Rule 94) |
| [`COVERAGE-MATRIX.md`](COVERAGE-MATRIX.md) | The completeness proof skill `01` owes — the requirement→case map, both directions |
| [`STATE.md`](STATE.md) | Where this skill set itself stands |

### THE THREE LANE ROUTERS — **thin pointers, NOT procedure**

| Router | Lane | Points at |
|---|---|---|
| [`10-TEST-CASE-CREATION.md`](10-TEST-CASE-CREATION.md) | authoring new cases | `00` → `02` → `01` → `COVERAGE-MATRIX` |
| [`11-BUILD-VERIFICATION.md`](11-BUILD-VERIFICATION.md) | verifying cases against the running build | `00` → `02` §1 → `03` → `04` §6/§6.1 → `06` |
| [`12-VIU.md`](12-VIU.md) | the full wording + Verify-In-UI pass | `00` → `02` → `03` → `01` → `04` → `06` |
| [`16-TEST-EXECUTION-AND-DEFECTS.md`](16-TEST-EXECUTION-AND-DEFECTS.md) | executing cases and preparing **admissible** defects | `00` → `09` → `03` → `06` → `04` §6.1 → `13` → `14` |

**Each was a full standalone skill until 2026-08-21, when they were converted to routers** because
they duplicated `01`/`02`/`03`/`04`/`06` and **duplicated content drifts** — the two copies were
already disagreeing about whether the branches were final, and one held a second copy of the Rule-50
write discipline, which is the last material that should ever exist twice. **Nothing was lost:** the
unique content was migrated first — **new-project onboarding → `01` §11**, the
**`Defects-for-Testers` workbook → `04` §6.1**, the **`API-ASK.md` naming fact → `06`**. **A router
holds no substance, so it cannot drift.** If you find procedure in one, that is a bug in the router.

**The lane handoffs that call these routers:** `build/handoffs/HANDOFF-1-TEST-CASE-CREATION.md` ·
`HANDOFF-2-BUILD-VERIFICATION.md` · `HANDOFF-3-VIU.md`.

---

## RULE 91 — THE FRESHNESS BADGE APPLIES TO EVERY SKILL'S OUTPUT (added 2026-08-21)

Any deliverable that claims something is build-verified or source-verified shows a **badge with its
date**: **✅ ≤ 7 days · 🟠 8–14 days · 🔴 > 14 days · ❌ never verified** — plus the build marker (or
spec version). **A bare tick is non-compliant.** Rule 91 is the **visibility** layer; **Rule 77** is
the **validity** test, so a case inside Rule 77's 3-build window may still show 🟠 or 🔴 — intended,
not a contradiction. Tool: `build/testing-tools/verification_badge.py` (requires `--today`).

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

        08 RECOVER      ── runs when ANY of the above is killed mid-flight, before it resumes
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
| *"The last pass was killed"* / *"did we lose anything?"* / *"the container restarted"* | **08** — **before resuming anything** |
| *"Which epic / group / run / branch is this project?"* | **core §17**, the project fact sheet |

---

## THE SEVEN THINGS THAT WILL BITE A COLD SESSION FASTEST

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
6. **Putting a case on `AUTOMATION: HOLD` can DISARM it.** A hold tells the tester to mark it BLOCKED,
   so on a case whose steps **do** run it destroys the case's ability to fail — **and it looks like
   caution rather than like a mistake.** Decide on **whether the steps run**, never on how badly the
   case looks like failing. (core §15.1a)
7. **An audit committed BEFORE the repair does not audit the repair.** A pass classified **C29944** as
   legitimate and then, in its own write, gave it an assertion **no source supports**. Every byte-check
   passed. **Re-audit what the pass actually changed, afterwards.** (core §2.10)

---

## WHAT THESE FILES ARE **NOT**

- **Not a replacement for `CLAUDE.md`.** That is the authority — the standing rules, the project
  entries, the durable facts. These skills operationalise it and **state every referenced rule in
  substance.**
  **⚠️ ON A DIFFERENCE, ESTABLISH WHICH IS NEWER BEFORE DECIDING WHICH WINS — corrected 2026-08-13.**
  This line previously read *"where the two ever differ, `CLAUDE.md` wins and this file is the one to
  fix"*, **and that is wrong in one direction that matters.** `CLAUDE.md` is the authority on **what he
  ruled**; it is **not automatically the newer record of it.** A ruling can land in a skill first while
  `CLAUDE.md` lags — so a blanket *"CLAUDE.md wins"* would **revert a current ruling to a stale one**,
  which is exactly what Standing Rule 32 (latest authoritative source wins) forbids.
  **⇒ THE RULE: find the DATE of each statement, apply latest-wins, and FIX THE OLDER FILE IN THE SAME
  TURN** — keeping the superseded wording visible and dated. **Where they are the same age, or the date
  cannot be established, `CLAUDE.md` wins and the skill is the one to fix.** *(Checked 2026-08-13: on
  the one place this could have bitten — finality — `CLAUDE.md` is current, carrying **"The Branches
  are Final now."** at lines 3982/4014. No live divergence was found.)*
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
