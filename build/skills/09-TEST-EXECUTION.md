# 09 · TEST-EXECUTION — execute the cases against a build and record honest results

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST.** Non-negotiable from it: the honesty bar ·
> **§16.0 finality (the branches are NOT final)** · the TestRail write discipline · **§4.1 union-only
> run sync** · §11.4 what a blocker actually blocks · secrets.
>
> **🔴 AND READ [`03-RUN-CHECK.md`](03-RUN-CHECK.md).** **This skill does NOT repeat it.** `03` owns
> *"can this case be executed at all, and is what I am seeing real?"* — the runnability test,
> **probes that cannot fail**, ruling out our own harness, reading the interface correctly,
> FE-blocks/BE-allows, role resets, seeding, what a deploy invalidates, the not-yet-built decision
> table. **Every one of those questions is answered in `03` before a result is recorded here.**
> Where this file names one of them, it is a **pointer**, never a second copy.

**Created 2026-08-26** as the canonical procedure of the **TEST EXECUTION & DEFECT REPORTING** lane
(router: [`16-TEST-EXECUTION-AND-DEFECTS.md`](16-TEST-EXECUTION-AND-DEFECTS.md)).

---

## PURPOSE, IN PLAIN ENGLISH

**Take a set of test cases that already exist, run them against a real build, and write down what
actually happened — accurately, with evidence, and without ever filling a gap with a guess.**

That is the whole job. It is not authoring, it is not rewording, it is not filing tickets. What comes
*out* of it is two things: **a truthful set of results**, and **a shortlist of candidate defects** that
go to [`06-DEFECT-PREP.md`](06-DEFECT-PREP.md) and its **admissibility gate**.

---

## MISSION AND BOUNDARIES

**THIS SKILL MUST NOT:**

- **author new test cases** → [`01-CASE-BUILD.md`](01-CASE-BUILD.md);
- **run a VIU wording pass** or change what a case *expects* → [`12-VIU.md`](12-VIU.md) → `03` + `01`;
- **file a Jira ticket** → [`06-DEFECT-PREP.md`](06-DEFECT-PREP.md), and **Rule 62's hold is active**;
- **touch a foreign case** (Rule 38) or a case TestRail flags **Automated** (Rule 71) without asking;
- **write anything to TestRail without explicit permission for that write, that pass** (Rule 6).

**CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION (Rule 83).** A wording error, a missing case, a
source conflict or a foreign edit noticed while executing is **written up and handed back** — not
fixed in place.

---

# 1 · PICK THE RUN — and stay inside Rule 47 scope

**Rule 47: we keep OUR ACTIVE projects' runs COMPLETE and IGNORE every other run.** The active runs
are listed in the CLAUDE.md project index (`grep -n 'Active test runs' CLAUDE.md`) — **read it there,
because it moves.** As of 2026-08-21: **Filters 352 · Schedule 357 · Report Suite 359.**

**Before executing a single case, establish and write down:**

| # | Establish | How |
|---|---|---|
| 1 | **Which project** you are assigned to | Rule 2 / Rule 92 — **the QA lead NAMES it.** No project = no work |
| 2 | **Which run** covers it, and **who owns that run** | `get_run/{id}`. **These runs belong to other testers** — 352 Ahtasham Amjad · 357 Ayesha Khan · 359 Nebojsa Glavinic and Viktoria Videnovic |
| 3 | **Which cases are OURS** (`created_by = 3`) and which are **foreign** | Foreign cases are **executed only if the QA lead asks**, and **never edited** (Rule 38). Report both numbers: ours N / live total M |
| 4 | **Which cases are `Automated`** | Rule 71 — read-assess, then **hold for the QA lead**. If a pass changes one, **tell Vlad** (Rule 65) |
| 5 | **The build marker** you are executing against | `<meta name="app-version">` — see §2 |
| 6 | **The source currency** for this project | **Rule 81: source verification precedes build verification.** [`02-SOURCE-CHECK.md`](02-SOURCE-CHECK.md) §1 — and **ASK before spending the quota on it** |
| 7 | **When this was last executed** | **Rule 80: state the last-done date and ASK before re-running.** A check within the last 3 builds / 3 source versions **still counts** (Rule 77) — say so with its date rather than silently repeating it |

**A run is never created by this lane.** If the cases have no run, that is a Rule-34 gap to **report**.

---

# 2 · PIN THE BUILD — at the start, at the end, and at every deploy

**Record the build marker (`<meta name="app-version">`) and the branch/API host BEFORE the first case
and AFTER the last one.** Paste both strings into the execution log.

- **If the marker changed mid-pass, the branch was redeployed underneath you.** Do **not** silently
  continue: **`03` §6 decides what that invalidates** — a bug-fix deploy does not make a prior pass
  stale, a functional deploy invalidates three layers. **Record the split point** so every result is
  attributable to a known marker.
- **The URL is not the build.** A host can be redeployed, or point somewhere else entirely (the
  `sv8582` host returned **HTTP 502** while staging was healthy). **Prove the app is the one you think
  it is from the marker, not the address.**
- **Every result records the marker it was observed on.** A result without a marker cannot be aged,
  cannot be re-checked and cannot support a defect ticket (gate check **A1**).
- **Rule 91 — every verification claim in the report carries a freshness badge with its date:**
  **✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days · ❌ never**. Tool:
  `build/testing-tools/verification_badge.py` (requires `--today`). **A bare tick is non-compliant.**

---

# 3 · EXECUTE CASE-BY-CASE — but BATCHED, never one tool call per case

**Rule 88: a session with direct tools must never bulk-read, and must not burn its context one case at
a time. SCRIPT THE BULK WORK, RUN IT, READ THE SUMMARY.**

| ❌ Never | ✅ Instead |
|---|---|
| `get_case` once per case, into context | **One scripted paged fetch** of the run's cases to a **file**; read a bounded summary |
| A tool call per case to record a result | **Accumulate results in a local file**, then **one batched write** (`add_results_for_cases`) — if and only if a write is authorised |
| Reading 200 case bodies to "get oriented" | `grep -n` / `sed -n '<a>,<b>p'` the one thing you need |
| A long interactive pass that dies with the session | **Rule 75: long-running work runs DETACHED and SELF-COMMITTING** — launch it, it commits as it goes, and it survives the session |

**⚠️ AND THE PAGING TRAP THAT SILENTLY RETURNS NOTHING (core §3.3):** the TestRail API here takes
**ampersands throughout, no `?` anywhere** — `get_cases/1&suite_id=1&limit=250&offset=0`. The
`?limit=`-then-`.replace()` idiom in the older tooling **works only because the patch undoes the
conditional**, and when it breaks it **400s in a way that reads like an empty result set**. An unpaged
`get_cases` returns **250 sections and silently finds zero cases**. **Assert your counts against
`get_run`'s own `untested_count + passed_count + …` and STOP if they disagree.**

**Per case, the loop is:**

1. **Read the case's preconditions and steps** — and **execute them as written**, not from memory.
2. **`03` first: is this case runnable at all?** Preconditions satisfiable, data seedable, role
   obtainable, feature present. **Seed data and log in as the role — a data-state or a login is NEVER
   a blocker** (Rules 14 / 74, `03` §8.2).
3. **Rule out your own probe and your own instrumentation** (`03` §"probes that cannot fail"). **Over
   forty apparent findings were caught this way in two days and NOT ONE was a product fault.** A false
   absence looks exactly like a finding.
4. **Compare what you saw against what the case EXPECTS — and the expectation comes from the DOCUMENT,
   never from the build (Rule 57).** If the build differs, the case **keeps** the documented
   expectation and the difference becomes a **deviation**. Never "correct" a case to match the build.
5. **Capture the evidence for THIS case, in this run** (§4).
6. **Assign the status** (§5), **with a comment that a non-technical reader can act on.**

---

# 4 · EVIDENCE, PER CASE — captured in the run that produced the verdict

**Rule 12: VERIFIED MEANS OBSERVED, NEVER INFERRED.** A status is only as good as the evidence
captured **at the moment it was observed**.

Per case, capture: **a screenshot of the relevant screen** · the **build marker** · the **URL /
branch** · the **role and account you were really in** · the **exact test data, named as it appears on
screen** · the **date and time**.

- **Name the data. "Any" is barred** unless you have PROVEN it does not matter and said how. **The
  SV-8821 scar:** the steps said *"a pre-set (canned) job"* and named none; the real variable turned
  out to be a **missing contact person**, and the ticket was closed against us.
- **Redact at the point of capture (core §10). THIS REPO IS PUBLIC (Rule 82)** — no customer data, no
  tokens, no cookies, no session ids in a screenshot or a pasted response.
- **A failing case's evidence must already meet the defect standard** — full screen, URL/build visible,
  annotated, captioned. See **THE ANNOTATED-SCREENSHOT AND LAYMAN-TICKET STANDARD** in
  [`06-DEFECT-PREP.md`](06-DEFECT-PREP.md). **Capturing it properly the first time is free; going back
  for it after the branch moved is often impossible.**
- **Store it under the pass folder:** `build/<project>/execution-<date>/evidence/`, human-readable
  filenames (Rule 19), **committed as you go** (Rule 29 — the container and `/tmp` are ephemeral).

---

# 5 · RECORD THE RESULT — the honest-status rules

## 5.1 🛑 THE HONEST-STATUS RULE — THE ONE THAT MATTERS MOST

> **A CASE THAT WAS NOT ACTUALLY EXECUTED IS NEVER MARKED PASSED.** Not "it obviously works", not
> "the one above it passed", not "the same control on another screen was fine". **Untested is a
> perfectly good status. A false Passed is a lie that someone ships on.**

**Rule 12 in operation:** only mark Passed / Failed / present / absent **if it was observed live, with
evidence captured that run.** Anything not observed is **NOT VERIFIED** or **Blocked-with-reason** —
never inferred, and **never filled in to make a pass look complete.**

## 5.2 THE STATUS DECISION TABLE

| What happened | Status | What must accompany it |
|---|---|---|
| Ran it; the build did what the **document** requires | **Passed** | Evidence + marker |
| Ran it; the build did **not** do what the document requires, and `03` ruled out probe/harness/data/role | **Failed** | Evidence + marker + **a candidate defect** → `06` admissibility gate |
| **Something is off** — you are not sure the case, the data, the environment or the expectation is sound | **Blocked** | **The reason, in plain words**, and what would unblock it |
| The case cannot run because **the feature is not in the build** | **Blocked**, with the **NOT AVAILABLE ON BUILD** treatment (Rule 69, `03` §7) | Which feature, and the owning story — and it goes to the **deferred run list**, not a defect |
| The case is `Automated` | **Do not execute-and-change it.** Read-assess and **hold for the QA lead** (Rule 71) | If a pass did change it, **tell Vlad** (Rule 65) |
| The case is **foreign** (not `created_by = 3`) | **Do not execute unless asked. Never edit** (Rule 38) | Report ours N / live total M |
| Front end blocks it, back end still allows it | **Passed** — **Rule 24, this is not a bug** | The plain tester note; **the inverse IS a defect** |
| You did not get to it | **Untested** — leave it | Say so in the report. **Never a guess** |

## 5.3 BLOCKED — never skip, never guess

**A tester who is unsure marks the case Blocked. They never skip it and they never guess.** That is
the standing instruction, and it applies to us executing exactly as it applies to a manual tester.

**But Blocked is disciplined, not a shrug (Rule 68 / core §11.4):**

1. **Name what the blocker actually blocks** — a missing PO answer blocks the **verdict**, not the
   **runnability**; a missing permission blocks **one step**, not the case.
2. **Prove it real AND total** — *"we could not see a way"* is an assumption; *"we tried A, B and C,
   here is what each returned"* is a measurement.
3. **Check it is not self-serviceable first** — **a data state or a login is NEVER a blocker: seed it,
   log in as the role** (Rules 14 / 74).
4. **State the residual in two lines:** *"Blocked for X. Still possible under it: Y. Genuinely
   impossible until X clears: Z."* **A blocked item that never names what could still be done is not a
   report, it is an excuse.**
5. **The tell that this was skipped: a blocked item whose reason is a person's name.** The scar: on
   12 August, 14 Filters cases were classified *"waiting on Branko"* and treated as untouchable. **They
   were not.**

Every Blocked case gets a **manual revisit** against the current spec + build, and an **authorised**
correction.

## 5.4 🛑 WRITING RESULTS TO TESTRAIL — the repo rule, and it is narrower than you think

> **CORE §4.1: "Never write a RESULT to another tester's run. Log only Passed cases to a run at all,
> and only with permission; keep Failed / Retest / Blocked local."**

**Runs 352 / 357 / 359 belong to other testers.** So the default posture of this lane is:

- **Results live LOCALLY**, in the pass folder, committed — `RESULTS.md` / `results.csv`;
- **Nothing is written to a run without the QA lead's explicit permission for that write, that pass**
  (Rule 6). **A permission to execute is not a permission to write.**
- **Even with permission, only Passed goes to another tester's run.** **Failed / Retest / Blocked stay
  local** and are reported to him — because a Failed we wrote into someone else's run is a verdict on
  their work that they did not agree to.
- **Snapshot before you write** and **verify after**, on the **graded fields only** —
  `status_id · comment · defects · elapsed · version · assignedto_id · created_by · created_on ·
  test_id · case_id · id`. **`case_title` and `case_refs` are ECHOES filled in at read time**, so a
  whole-record compare reports a false *"results changed"* and stops a clean batch (core §3.4).
- **Per-write audit log** (Rule 50): operation · C-id · HTTP status · verification result.
  ***"200 OK" alone is non-compliant.***

---

# 6 · THE RETEST LOOP

**A Failed case is not finished — it is halfway.**

1. **Re-run it from the written steps**, in a second run, on a **proved-unchanged marker.** This is
   simultaneously gate check **A1** — *reproduced twice on the current build* — so **doing it here
   costs nothing later**, and skipping it means going back when the branch may have moved.
2. **If it does not reproduce, it is not a Failed** — it is an **intermittent observation.** Say
   exactly that, record both runs, and take it to the QA lead. **"Cannot reproduce" is the cheapest
   refusal there is; never hand it over.**
3. **If it reproduces, open a `DEFECT-CANDIDATE-<id>.md`** and run the **admissibility gate** in
   [`06-DEFECT-PREP.md`](06-DEFECT-PREP.md). **Do A3 (is it unfinished work?) and A4 (already
   reported?) EARLY — they are cheap and they kill findings before you spend the evidence budget.**
4. **After a fix lands: re-test on the NEW marker**, and record it as a new observation with a new
   date. **`03` §6.3 — a regression IS possible in a case we already passed; say so.**
5. **Ticket status is never evidence about the build.** A fix shipped while **SV-8851** stayed Open;
   **SV-8843 and SV-8847** were closed *obsolete* and still reproduced byte-identically. **Only the
   build tells you what the build does.**
6. **An `EXPECT FAIL` case carries all three outcomes** (Rule 61): fails exactly as described → mark
   **Failed**, raise nothing new · fails **differently** → a **NEW** problem, report it · **passes** →
   the fix shipped, **tell the QA lead.**

---

# 7 · KEEP THE RUN IN SYNC WITH THE CASES — union only

**Rule 34: new or updated cases must appear in the run.** But the sync itself is **the single most
destructive call we make.**

> **🛑 `update_run` REPLACES the selection. A PARTIAL `case_ids` LIST DELETES THE OMITTED TESTS **AND
> THEIR GRADED RESULTS**, AND THEY CANNOT BE RECOVERED.**

**The procedure is core §4.1 and it is not restated here beyond its shape** — read it there before
running it:

```
0. CONFIRM EXPLICIT PERMISSION FOR THIS RUN, THIS PASS   ← never implied; an add_case approval is NOT a sync approval
1. get_run/{id}          → include_all true? nothing to do
2. get_tests/{run_id}    → the run's CURRENT case_id list   (assert the count against get_run's own totals)
3. get_results_for_run   → SNAPSHOT every result BEFORE writing, and COMMIT the snapshot
4. update_run with sorted(set(current) | set(new))          ← THE FULL UNION, never a partial list
5. verify: counts as expected, case_id sets equal BOTH ways, EVERY prior result present BY ID,
           include_all still false
```

- **Step 0 is not optional** and was missing from the procedure until 2026-08-13. **These runs belong
  to other testers.**
- **SCOPE THE EXECUTOR TO ONE RUN.** The canonical
  `build/testrail-run-sync-2026-07-31/sync_runs_EXECUTOR.py` carries a **multi-run `SCOPE`**. Copy it
  with `SCOPE` cut to the single authorised run (the proven-safe 2026-08-05 practice,
  `tools/run_sync_357_only.py`). **Do not run the multi-run form.**
- **Foreign cases are never added to a run by us** (Rule 38).
- **Our coverage is measured against the CASE SUITE under our group — never against anyone else's run
  selection.** A frozen selection on Filters 352 once made a reviewer see **coverage gaps that did not
  exist** and cost a wasted review cycle.

---

# 8 · THE DELIVERABLE

`build/<project>/execution-<date>/`:

| File | Contents |
|---|---|
| `EXECUTION-LOG.md` | Per case: C-id + link (Rule 8) · status · marker · timestamp · role · data named · evidence path. **The build marker at pass start AND pass end** |
| `RESULTS.md` / `results.csv` | The results, **held locally** — the source of truth until a write is authorised |
| `evidence/` | Screenshots and captures, **redacted at capture**, human-readable names |
| `BLOCKED.md` | Every Blocked case with its **decomposed** reason and its **residual** two lines |
| `DEFERRED-RUN.md` | Cases deferred because the feature is not in the build (Rule 69 / `03` §7.4) — **not a TestRail run** |
| `DEFECT-CANDIDATE-<id>.md` | One per candidate defect — **the admissibility gate**, `06` |
| `RECHECK-QUEUE.md` | Rule 49/60 — **the branches are NOT final**; every provisional verdict queued for re-check |
| `RUN-SYNC-AUDIT.md` | Only if a run write was authorised: the snapshot, the union, the per-write audit lines |

**Every report ends with "OUTSTANDING — what I need from you" (Rule 36)** — *"nothing outstanding"* if
that is true, **never omitted** — and `build/OUTSTANDING-ITEMS-REGISTER.md` is kept current.

**Report action-first, plain language, table-form (Rule 70):** *What I did / What needs to be done /
Other actions*. **Every Failed or Blocked cell carries a plain "what needs to be done"** a
non-technical QA can act on — **never a bare status** (Rule 7).

---

# 9 · GUARDRAILS

- **G1 — A case not executed is never Passed.** Untested is honest; a false Passed is not.
- **G2 — The expectation comes from the document, never the build** (Rule 57). The build gives us
  exactly two things: **the on-screen labels, and the pass/fail verdict.**
- **G3 — The branches are NOT final until release day** (§16.0 / Rule 91). **Verdicts are PROVISIONAL,
  a gap is possibly-unfinished, and Rules 49/60 are in force.** Queue every provisional verdict.
- **G4 — Nothing is written to TestRail without explicit permission for that write, that pass**
  (Rule 6); results into another tester's run are **Passed-only**, and the run sync is **union-only**.
- **G5 — No Jira ticket is created here. Rule 62's hold is active** — and it is **temporary with a lift
  condition**, so **check whether it lifted; do not assume either way.**
- **G6 — Automated cases (71) and foreign cases (38) are hands-off.** Report, never edit.
- **G7 — Commit after every step, path-scoped** (Rule 29): `git add -- <paths>`, **never `git add -A`**.
  **Run `python3 build/testing-tools/scan_secrets.py --staged` before every commit; exit 1 = REFUSE.**
- **G8 — Rule 90 budget:** report your spend; at **50 %** of your own budget compare spend against
  progress and **STOP AND REPORT** if spend is outpacing it. **Never touch the reserve.**

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Decide whether a case *can* be executed, or whether what you saw is real | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** — **first, always** |
| Prove we hold the current version of every source | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** (Rule 81 — before build work) |
| Author, reword or repair a case | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** |
| Turn a Failed into a ticket | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** — **the admissibility gate**, then stop at the button |
| Hand the suite to a manual tester | **[`04-TESTER-READY`](04-TESTER-READY.md)** (§6 / §6.1 the defects workbook) |
| Put the results in the completion report | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Ask the PO whether the behaviour is even wrong | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** |
| Establish what a killed pass actually landed | **[`08-RECOVER`](08-RECOVER.md)** |
