# 04 · TESTER-READY — hand a suite to the manual test team so they can pick it up and run it

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST.** This file adds only what is specific to
> the handover.

---

## PURPOSE, IN PLAIN ENGLISH

**Make the suite fit to be handed to a manual tester who has never seen it, and tell them plainly what
to run and what to leave alone.**

Three things have to be true before a suite can be handed over, and none of them is guaranteed by the
cases having been authored and walked:

1. **Each case makes sense on its own**, read cold by someone with no context.
2. **The cases do not contradict each other** — a suite can be 100% individually sensible and still
   tell two testers opposite things about the same control.
3. **The tester knows which cases cannot be run yet, and marks them Blocked rather than guessing.**

**The failure this exists to prevent is a Passed result on a test nobody could run.** Once that is in
the run it reads as evidence the feature works, and **it is read that way by people who will never
open the case.**

---

## TRIGGER PHRASES

> *"Prepare the suite for the testers"* · *"tester handover for [project]"* ·
> *"what should they run and what should they skip?"* · *"the testers start tomorrow"* ·
> *"cold-read the cases"* · *"sense-check [project]"* · *"build the skip list"* ·
> *"the tester brief"*

---

## KICKOFF PROMPT

```
Run TESTER-READY for [PROJECT | all three projects].

Runs: [352 Filters | 357 Schedule | 359 Report Suite]
Deadline the testers are working to: [date]
TestRail writes authorised: [none | update_case to fix wording | update_run to sync]
If a held case already carries a result: [report only | report and propose the correction]
```

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

| Date | Verbatim | Effect |
|---|---|---|
| **2026-08-10** | *"let the manual QA tester verify those test cases and mark those test cases are passed or failed"* — confirmed 2026-08-11: *"you are RIGHT"* | **The pass/fail verdict is the TESTER's.** Our job is to make the case runnable and honest, not to grade it |
| **2026-07-29** | *"the last fool proof process is that the manual tester marks the test cases which seems off to him/her as Blocked and we revisit those blocked tests manually to see what needs to be changed there"* | The **Blocked-revisit loop** — a standing intake queue, not a one-off |
| **2026-07-28** | *"usefulness + sense together — Make it a permanent rule so that his claims can never be proven right. Our test cases need to be genuine, can be run by the manual QA guys and laymen who are non technical very easily"* | The cold read is **for a layman**, and it is permanent |
| **2026-07-31** | *"when we update or add test cases for any projects and we have a test run for them, make sure that those test cases also appear in the test run"* | **Run sync** (step 5) |
| **2026-07-24** | *"in such cases you always need to use simple words to tell me what needs to be done"* | Every not-passed status carries a plain next step |

### The correction that produced the skip list

**Nobody asked for a skip list.** It exists because a census found that **19 of 91 held cases already
carried a result, and 16 of those said Passed** — while their own text said they could not be run.

**And the honest half:** **3 of the 19 were not a tester's error.** C30004, C30013 and C30020 were
moved onto the skip list **that same day, by us**, *after* their results had been recorded. **Say that
in the brief.** A handover that blames the testers for our own sequencing is worse than no handover.

---

# 1 · THE COLD READ — coherence

**Read every case as the critic would: with no context, no memory of authoring it, and no goodwill.**
One verdict each: **SENSIBLE / FIX-WORDING / NONSENSE.**

**The fail conditions — any one is enough:**
- steps not executable in the order given, or a precondition that cannot be reached;
- the **expected result does not follow from the steps**;
- an **internal contradiction** inside the case;
- it references a **control, screen or field in neither the sources nor the designs**;
- **domain nonsense** — impossible arithmetic, a calculation in the wrong direction, cost and sell
  price conflated, an impossible snapshot;
- **not actionable** — a tester cannot tell what to DO or what PASS looks like;
- **an unanchored absolute enumeration** — *"the headers are exactly …"* with no version-pinned
  governing anchor and no scope-conditional wording (core §12; skill `01` step 5).

**Every NONSENSE quotes the offending text and names its fail condition.**

**Run the KEEP-but-NONSENSE cross-check explicitly** — the embarrassment check. A case can be
genuinely valuable coverage **and** unreadable, and those are the ones that reach a tester.

**🛑 THE COLD READ IS NOT A SAMPLE.** Every case, and the deliverable **states the exact number read
out of the exact population**. A spot-check may never be reported in language implying the whole.

---

# 2 · THE CROSS-CASE CONTRADICTION SWEEP — the half that gets skipped

**A suite can be 100% individually sensible and still be self-contradictory**, and no per-case review
will ever catch it, because each case is fine on its own.

**Five passes, all of them:**
1. **Group by the CONTROL or BEHAVIOUR the cases assert on**, and **diff their expected results.**
2. **Opposite-assertion keyword sweep** — hidden vs shown vs disabled · real-time vs on-Apply ·
   editable vs locked · present vs absent.
3. **TITLE-vs-EXPECTED check on EVERY case.** A title promising one thing while the expected result
   asserts another is a contradiction with itself.
4. **Same-`refs`-anchor diff** — cases citing the same requirement must not disagree about it.
5. **The SURFACE-SPLIT check** — group by requirement anchor and verify every surface the requirement
   names has a case (skill `01` step 4).

**Any pair that cannot both be true is a CONTRADICTION.** Resolve it by the precedence order (core
§11.5) — **PO ruling → QA lead's ruling → our live-verified findings → a reviewer's claim** — and
**align the WHOLE group to the winner**, not just the case you happened to open. Where no ruling
exists, flag it **PENDING a PO question** and log it.

**🛑 A SUITE MAY NOT BE DELIVERED WITH AN UNRESOLVED CONTRADICTION**, and the count found/resolved
ships in the tally.

**THE SCAR:** our own audit rated **110 Filters cases SENSIBLE** while they **contradicted each other
on the Status chip** — a junior QA caught it cold, from outside our work. *(Canonical evidence:
`build/filters/ahtesham-review-2026-07-31/VERIFICATION.md`.)*

---

# 3 · 🔑 FIND CASES ALREADY PASSED WHILE HELD

**This is the check the skip list exists for, and it is cheap.**

For each in-scope run, cross-read **every case carrying `AUTOMATION: HOLD`** against
`get_results_for_run`. **A test that cannot be run cannot have passed.**

**Report, per case: C-id + link · the hold reason in its own words · the result recorded · who
recorded it · when.**

**And split the finding honestly:**
- results recorded **before** the case was held → a tester graded something they could not run, and it
  needs clearing up before it is read as evidence;
- results recorded **before we moved the case onto the skip list** → **ours**, and the brief says so.

**Never write a result to another tester's run** to "fix" this. Report it; the QA lead decides.

---

# 4 · THE SKIP LIST — and the exact instruction that goes with it

**Every held case carries its reason IN ITS OWN WORDS, at the end of its Expected Results**, so a
tester who opens the case is told the same thing the brief tells them.

**The instruction, and it is the opening line of the brief:**

> **"If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed."**

**And the counterpart, because it is the commonest confusion** — an `EXPECT FAIL` case **is** to be
run:

> *"Some tests say, in plain words, what you should see today and that it is a known problem with a
> ticket already raised. Those you DO run:*
> *· See exactly what the test describes → mark it **Failed** and raise nothing new.*
> *· See something **different** → that is a **new** problem. Please report it.*
> *· It **passes** → the fix has shipped. Tell the QA lead so the ticket can be closed."*

**🛑 BEFORE THE BRIEF GOES OUT, CHECK EVERY `EXPECT FAIL` MARKER STILL HAS LIVE BACKING — NO BACKING,
NO MARKER (Standing Rule 61 as amended 2026-08-11; core §15.1).** QA lead, verbatim: *"WHen there is
nothing to back 'Expect fail' then not set that marker. And let the manual QA tester simply discover
whether this test fails or passes and mark the test case accordingly in the tesrail"*.
**A CLOSED OR OBSOLETE TICKET DOES NOT BACK THE MARKER, and the scale of this is real: 31 of the 33
tickets behind the Report Suite's expect-fail cases were CLOSED**, several confirmed fixed on
10 August. **Those markers were telling a tester to ignore a failure that may no longer exist — the
precise inverse of what the marker is for**, and on a handover it is the tester who pays for it.
**⇒ Where the backing is gone, the marker comes off and the case carries plain `AUTOMATION: READY`;
the tester then DISCOVERS the outcome and records it.** **We do not predict on the tester's behalf.**

**Group the skip list by the thing each case is actually waiting on**, so the reader can see at a
glance which asks would unblock how many — *"waiting on Branko's Parts and Reports write-up"*
(10 cases) · *"needs a second test login"* (2) · *"needs an account whose filters were saved before
the redesign"* (1).

**⚠️ AND CHECK THE HOLD IS REAL BEFORE PUTTING A CASE ON THE LIST** (core §11.4). **Roughly 60% of one
reported remainder was self-inflicted** — 14 cases classified *"waiting on Branko"* were **never
unwalkable**; his missing write-up left their **expected behaviour** unsourced but did not stop anyone
executing the preconditions and steps. **A blocked item whose reason is a person's name is the tell.**

**⇒ Every skip row states the residual in two parts:** *"Blocked for X. Still possible under it: Y."*

---

# 5 · SYNC THE RUN BEFORE THE HANDOVER

A handover against an out-of-sync run makes a tester see gaps that do not exist — **that has already
happened**, and it cost a wasted review cycle.

**Union-only, per core §4.** Then prove, in the brief's own working: **the run's case-id set equals our
case-id set IN BOTH DIRECTIONS**, so **nothing we own is missing from the run and the run carries no
case we do not own**.

**Foreign cases are excluded and SAID to be excluded** — *"5 further tests in this area were written by
a colleague and are not part of this list or these counts"* (core §5). **None of them should sit in a
run**, and if the counts match exactly, say why.

---

# 6 · THE DELIVERABLE — the tester brief

**Written for a non-technical manual tester. No case IDs in prose, no spec anchors, no HTTP terms, no
internal names, and never the word "VIU".** A C-id appears only as a **clickable link in a table
cell**, which is what a tester actually needs.

**🔑 GENERATE IT, DO NOT HAND-WRITE IT.** The counts move repeatedly during a day, and **a stale brief
is worse than none.** The proven chain:

| Script | What it does |
|---|---|
| `census.py` | Pages `get_sections` (**an unpaged call returns 250 and silently finds nothing** — core §3.3) and `get_cases`, walks the section tree from each group, reads the `AUTOMATION:` marker out of each case |
| `holds.py` | Collects every `HOLD` case with its reason, **and cross-reads each run for results already recorded against a held case** (§3) |
| `gen_brief.py` | Writes the brief. **Every figure comes from the first two; nothing is transcribed** |

*Canonical example: `build/TESTER-BRIEF-2026-08-12.md`, with its working at
`build/tester-brief-2026-08-12/HOW-THE-NUMBERS-WERE-DERIVED.md`.*

### The brief's shape

1. **"Read this first"** — the Blocked instruction, the already-Passed finding stated honestly
   (including our own share), and the three-outcome instruction for expect-fail cases.
2. **The short version** — one table: project · **tests to run** · **tests to skip** · which run, by
   number and name.
3. **Per project** — the totals, the foreign-case exclusion in one line, a warning if any skip-list
   case already carries a result, then **the skip table**: case link · **what it is, in plain words** ·
   **why it cannot be run yet**.
4. **OUTSTANDING — what I need from you** (core §13).

### And the working, in a companion file

**How every number was derived**, so the brief can be defended without re-deriving it: the marker
census per project, **the arithmetic gate shown closing BOTH ways** (`READY + EXPECT FAIL` **and**
`total − HOLD` — a gate shown one way is not a gate), the foreign cases named with their author, the
run test counts, and the set-equality proof.

**⚠️ STATE PLAINLY THAT THE MARKER COUNT IS A MARKER COUNT, NOT A COVERAGE CLAIM.** *"680 tests to
run"* says how many are runnable — **not** that 680 requirements are covered, and **not** that anything
passed.

---

## THE STEPS

1. **Core §0 pass-start checklist.**
2. **Run the census live** (core §1.7) — never carry counts from a document.
3. **Cold-read 100% of the cases** (§1) and record the exact number read out of the population.
4. **Run the five contradiction sweeps** (§2) and resolve or flag every one found.
5. **Cross-read holds against run results** (§3).
6. **Test every hold before it reaches the skip list** (§4, core §11.4).
7. **Sync the run, union-only, and prove set equality both ways** (§5).
8. **Fix the wording problems the cold read found** — only if authorised, and per core §2 (all three
   text fields, byte-check, stop on mismatch, dry-run and read the payloads).
9. **Generate the brief and its working file** (§6).
10. **The "AUTOMATED CASES CHANGED — FOR VLAD" section** (core §5.3) and **OUTSTANDING** (core §13).

---

## THE BLOCKED-REVISIT LOOP — this does not end at the handover

**A tester marking something Blocked is not an obstacle; it is the intake queue that keeps the suite
honest.** Every Blocked case gets a **manual revisit** — re-checked against the current sources and
the live build — and then **a logged, authorised correction**: reword · fix the expectation · merge ·
retire.

**The QA lead's refinements (2026-07-29):**
- **completely irrelevant cases found on revisit are removed, and should be ≤ 1% of the suite;**
- **slight fixes** — expected behaviour, steps of reproduction, title — **are owned and applied
  directly by the QA;**
- **execution and creative break-the-feature testing are TWO SEPARATE ACTIVITIES.** Testers run the
  cases as written and mark anything off as Blocked; **separately** they try to break the feature and
  hunt regressions, and **those findings are reported as TICKETS, never mixed into the case run.**
  **Those tickets are later converted into test cases — the suite grows from real findings.**

---

## GUARDRAILS

- **G1 — Never write a result to a run.** Not to correct a wrong one, not to clear a held case. Report
  it; the QA lead decides.
- **G2 — Never grade a case Pass or Fail on the tester's behalf** (core §1.6).
- **G3 — Union-only run sync, snapshot first, every prior result proven present by id** (core §4).
- **G4 — Foreign cases are excluded from every count and said to be excluded** (core §5).
- **G5 — Test the hold before listing it as blocked** (core §11.4).
- **G6 — No jargon in anything the tester reads** (core §12).
- **G7 — Generate the numbers; never transcribe them** (§6).
- **G8 — 🛑 If an instruction for this pass conflicts with a rule here, STOP and surface it BEFORE
  acting** (core §11.6, Standing Rule 63). **What he instructed, quoted verbatim · what the rule
  requires, quoted, with its number · an explicit ask: which should we follow?** **Neither silent path
  is available** — not silently following the new instruction, not silently keeping the old rule. **A
  tightening or a layering is NOT a conflict**; escalating those trains him to wave escalations
  through. *He endorsed the practice by name: **"Good catch, be like this always."***
---

## HONESTY NOTES

- **Own our share of the already-Passed finding.** Say which results predate the hold and which were
  created by our own late reclassification.
- **The arithmetic gate is a marker count.** It proves the markers are internally consistent. It says
  **nothing** about coverage or about anything passing.
- **A cold read is a judgement, not a measurement.** Say who read them and how many.
- **"Sensible" does not mean "runnable".** Runnability is skill `03`, and a case can read beautifully
  and still send a tester to a menu that does not exist.
- **If the skip list shrank because a blocker was tested and found false, say so** — that is the most
  useful sentence in the brief, and it is the one that stops the same false blocker migrating into
  next week's report.

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Write a missing case, or score cases KEEP/MERGE/CUT | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** (step 9 is the full usefulness audit) |
| Check whether the sources moved | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** |
| Prove the steps execute on the build | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** |
| Report the project's completion figures to the QA lead | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Turn a held case's blocker into a defect ticket | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** |
| Ask the PO the question a hold is waiting on | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** |

**And it never grades a test.**
