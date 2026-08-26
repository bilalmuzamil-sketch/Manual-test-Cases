# 00 · COMMON CORE — what every Skill in this set needs, regardless of the task

> **Read this FIRST, then the skill you were called for.** Every skill file (`01`–`07`) points here
> instead of repeating this material, so a fix lands in one place instead of seven.
>
> **WHO THIS IS WRITTEN FOR: a session with NO memory of this workspace.** Nothing below assumes you
> were here yesterday. Where a rule is referenced by number, **its substance is stated too** — a bare
> number is useless in a fresh session.
>
> **WHY THE FAILURES ARE NAMED.** Almost every paragraph here carries the incident that produced it.
> That is deliberate: **a rule without its scar gets optimised away** by the next session that finds
> it inconvenient. The QA lead's own framing of the stakes, verbatim (2026-08-12): *"I do not want our
> hard work to be lost and things start to bite me and cost me my job due to this."*
>
> **THE ONE-LINE THROUGH-LINE, and it is worth reading twice:** *almost every signal a pass naturally
> trusts — its own memory, a clean git tree, an HTTP 200, a timestamp, a liveness check, a selector
> returning zero — lied at least once in the two days of 11–12 August 2026.* **The only things that did
> not lie were committed records and live content read back.**
> Source: `build/SESSION-LEARNINGS-2026-08-12.md`.

---

## CONTENTS

| § | Read it before you… |
|---|---|
| **0** | do anything at all — the first five minutes of any pass |
| **1** | write a number, a verdict or the word "complete" anywhere |
| **2** | write to TestRail, or trust that a write landed |
| **3** | build any TestRail payload or read any TestRail response |
| **4** | touch a test run |
| **5** | count cases, or look at a case somebody else wrote |
| **6** | try to reach the application |
| **7** | create, change or delete anything in the environment |
| **8** | start a long batch, or resume after one died |
| **9** | commit or push |
| **10** | write **anything** to disk |
| **11** | decide what a case should say, or whether you may act |
| **12** | write a word a human will read |
| **13** | finish any deliverable |
| **14** | stamp a provenance line — **the read-date every source now carries** |
| **15** | set, move or trust an `AUTOMATION:` marker — **including §15.1a, where a HOLD disarms a runnable case** |
| **16** | describe a branch as final, or a finding as provisional — **§16.0 is current (NOT final, until release day); §16.1 is SUPERSEDED**, and §16.0 carries the Rule-91 badge scheme |
| **17** | **do anything at all on a named project** — the identifiers, so nothing is guessed |

---

# 0 · THE FIRST FIVE MINUTES OF ANY PASS

Do these in order, before reading anything else, and **record that you did them** in the pass's log.

1. **`git fetch origin <branch>` then `git merge --ff-only`.** A clean tree proves **nothing** about
   currency (§9). **If the fast-forward is refused, STOP and report** — never force, never rebase,
   never `reset --hard`.
2. **Create the pass folder now and put the oplog in it** — `build/<project>/<pass-name>-<date>/`.
   Not `/tmp`. Not later (§8).
3. **Establish source currency** (§11 and skill `02`) — spec version, epic children, designs, tech
   plan, PO answers. **This is the first action of any project task, including a read-only one.**
4. **If the pass touches the build**, establish the build marker before anything else:
   `<meta name="app-version">` in `index.html`, plus `last-modified`/`etag`, plus the UTC time you
   read it. Read it again at the end and say whether it moved.
5. **Say what the pass will and will not do**, in its own README or findings file, before it starts.

---

# 1 · THE HONESTY BAR

This is the section that protects the QA lead. **He presents these numbers to people who will not
have read the file behind them.** An overstated figure is what bites him; a shortfall stated plainly
is a position he can defend in one sentence.

### 1.1 Observed, never inferred (Standing Rule 12)

**Only call something Verified / Pass / Fail / present / absent if it was ACTUALLY OBSERVED, live,
with evidence captured in that run.** Never fill a gap with inference from the spec, the source code,
a role definition or prior data and present it as a result. Anything not directly observed is
labelled **NOT VERIFIED** or **Blocked-with-reason** — never silently derived.

**If a live check cannot be completed, say so plainly and say what is needed.** Do not substitute
inference to appear complete. *(Rule 12 exists because a 2026-07-14 permission comparison presented
inferred capabilities as observed results and broke the QA lead's trust.)*

### 1.2 Exhaustive first, then exact (Standing Rule 50)

The QA lead's own gloss on *"byte-level verification"*, verbatim: ***"I meant not to miss anything
when you are verifying something."*** So the rule has two halves and **neither substitutes for the
other**:

**EXHAUSTIVE** — no sampling, no "representative subset", no spot-check reported in words that imply
the whole.
- a **suite** means every case · a **case** means every field, not only the one you came to change ·
  **coverage** means every requirement, **in both directions** · a **permission** means every role,
  both ways · an **export** means every format and every view, **with the file's content read**.
- **A large population changes the SCHEDULE, not the SCOPE.** Batch it, checkpoint it, finish it, and
  state the exact number done and the exact remainder.
- **A sample is acceptable only when the QA lead explicitly asks for one**, and then the deliverable
  says it is a sample, of what size, out of what population.

**EXACT** — where a comparison is possible, make it byte-level: never by eye, never by "looks right",
never by a `contains` check, never by a matching total. **Counts are proven as SET EQUALITY IN BOTH
DIRECTIONS** (`A − B` and `B − A` both empty) — **two sets of the same size can differ.**

### 1.3 Two numbers, always: ours and live (Standing Rule 38)

Other people write cases in the same TestRail groups. **Report "ours N / live M"** so our counts stay
honest without claiming or hiding anyone else's work. One number alone is wrong whichever one it is.

### 1.4 "Not established" beats a finding

A probe that errors, or that cannot be shown capable of firing, is graded **`NOT_ESTABLISHED`** —
**never `ABSENT`**, never "the feature is missing". See §2 of skill `03`; this is the single most
expensive mistake this workspace makes.

### 1.5 Never round a figure up, and never merge two figures into one

**"Build-verified" and "steps walked" are different numbers and are reported separately.** On
Schedule on 2026-08-12 they were **76 and 28, out of 176** — reporting the 76 alone would have
overstated the position by nearly three times, the day before a release.
Evidence: `build/schedule/verify-final-2026-08-12/FINDINGS.md`.

### 1.5a 🛑 DO NOT SUM FIGURES THAT MAY DOUBLE-COUNT — refuse the tidy total, and say why

**A total that reads well is worth nothing if its parts overlap.** Two real instances, and both were
caught only because somebody added the numbers up and checked the sum against a known whole:

- **The false-absence count.** One pass recorded *"more than forty"* false absences over two days;
  other passes separately recorded Filters 11, Report Suite 4, Schedule 3 and Schedule 4. **The first
  three almost certainly sit INSIDE the forty**, so adding them double-counts. **No census was run and
  no de-duplication was attempted**, so the defensible statement is *"more than forty over the two
  days, plus four after that"* — **an order of magnitude, not a count.** A first draft summed them to
  *"well over forty-five"*; that was corrected before commit
  (`build/SESSION-LEARNINGS-2026-08-12.md`, "WHAT THIS FILE DOES NOT CLAIM" §1).
- **The finality arithmetic.** The 2026-08-11 ruling was first framed as **"425 final but not
  build-verified / 339 build-verified"**. **Those two totals double-counted the 8 Filters cases** —
  they appeared as unverified in the first and verified in the second. The corrected figures are
  **433 and 331**, and they gate both ways: **433 + 331 = 764 = Schedule 174 + Filters 114 + Report
  Suite 476.** **The component figures were right; only the sums were wrong.**

**⇒ THE PRACTICE, THREE PARTS:**
1. **Gate every total against a known whole** — if the parts should sum to the suite, prove they do.
2. **Where the parts may overlap and no de-duplication was done, SAY SO AND REFUSE TO SUM.** Publish
   the components and the reason, not an invented total.
3. **Record the correction visibly and dated — never quietly fix it.** Both cases above are on the
   record precisely because *a figure that fails its own gate is a finding*, and a silently-repaired
   total teaches nobody anything.

### 1.6 🛑 NEVER claim "VIU complete"

**The behaviour half of VIU stopped being ours on 2026-08-11.** The QA lead re-scoped the pass/fail
verdict to the manual tester (Standing Rule 10's amendment; he confirmed it verbatim: *"you are
RIGHT"*). The accurate phrase — and it is **stronger** than the overclaim, not weaker:

> **"source-verified and build-accurate in its preconditions, steps, navigation and labels — with the
> behaviour verdict belonging to the tester."**

### 1.7 Derive every figure LIVE, at report time, and stamp the read time

**A number copied out of yesterday's findings file is a claim about yesterday**, however carefully it
was measured then. Counts have moved **within a single pass** — a worker watched a held count drop
91 → 88 mid-write (Standing Rule 67(c)).

### 1.8 State plainly where a column is not 100%, and why

An unexplained gap invites the challenge; an explained one answers it in advance. **A blanket caveat
("the branch is not final") is barred** — it hides the number instead of explaining it (Rule 60(d)).

---

# 2 · TESTRAIL WRITE DISCIPLINE

> **TestRail is the ONLY real production system we touch. NEVER create, update or delete a case, run
> or result without the QA lead's explicit permission (Standing Rule 6).** Permission is **per ask**.
> Everything else — staging, QA branches, QuickBooks — is disposable.

### 2.1 🔑 Send ALL THREE text fields on EVERY `update_case`

`custom_preconds` + `custom_steps` + `custom_expected` — **even when you are changing only one**,
setting the unchanged ones to their exact pre-write snapshot value.

**Why:** TestRail **re-renders any text field you OMIT** through its HTML pipeline. On 2026-08-05,
write 1 of 110 sent only `custom_expected`, returned HTTP 200, and came back with `custom_preconds`
and `custom_steps` **wrapped in `<p>…</p>` with every `\n` turned into `\r\n`**. A field sent
explicitly is stored verbatim. **These projects render that markup LITERALLY to the manual tester** —
the same day, 10 Filters cases and 16 Schedule cases had to be repaired for showing raw `<ol>`/`<li>`.

**It is intermittent and you cannot predict it:** the same day, in the same project, a Report Suite
pass sent **469 partial payloads over structurally identical content and was not affected at all.**
So **treat every partial payload as unsafe.** *(Playbook §J, DECLARED NORMALISATION #3.)*

### 2.1a 🛑 CORRECTION 2026-08-25 — *"A field sent explicitly is stored verbatim"* IS FALSE

**The sentence above, struck through in effect, is the most dangerous line in this file, because it is
the one that talks a pass out of checking.** Sending all three fields is **NECESSARY BUT NOT
SUFFICIENT.** *(Correction approved by the QA lead, 2026-08-25; the original wording is kept in place
above rather than deleted, per the Rules 32/33 pattern.)*

**THE PROOF, and it is our own damage.** A single authorised **title-only** repair on
[C44864](https://shopview.testrail.io/index.php?/cases/view/44864) sent `custom_preconds`,
`custom_steps` and `custom_expected` **explicitly, at their exact pre-write snapshot values**, byte
for byte. It returned **HTTP 200**, and **all three came back wrapped in `<p>…</p>` with their
newlines left bare and no `<br>`** — the §3.5 collapse pattern. The case had been plain text before
the write. **So the write did the approved job and simultaneously made the case render as one
unreadable run-on paragraph for the tester.**

**⇒ THREE THINGS FOLLOW:**
1. **THE BYTE-CHECK IS NOT OPTIONAL EVEN ON A "SAFE" ONE-FIELD EDIT.** §2.2 is what caught this;
   §2.1's promise is what would have suppressed it. A pass that trusts the promise and skips the
   check reports a clean write over a case it has just damaged.
2. **🔑 PRE-EMPT IT: PUT `<br>` INTO EVERY MULTI-LINE FIELD YOU SEND, ON EVERY WRITE.** Do not wait to
   see whether the re-render fires. **The repair for the collapse pattern and the prevention of it are
   the same operation** — insert `<br>` before each newline, changing the breaks only and never the
   wording. Applied that way, an `update_case` on a plain-text case leaves it rendering correctly
   instead of collapsed.
3. **A CASE'S MARKUP STATE IS AN OUTPUT OF YOUR WRITE, NOT A PROPERTY YOU INHERITED.** §3.5 says never
   report "0 raw markup" as durable; this is the active form of the same fact — **your own write is one
   of the things that changes it**, so census after writing, not only before.

### 2.2 Re-GET and byte-compare, field by field, after every write

Compare the live case against **the intended payload**, and prove **every field you did not intend to
change byte-identical to its pre-write snapshot**. That second half is what catches collateral damage,
and it is the half a "200 OK" can never tell you.

### 2.3 🛑 STOP the batch on any mismatch

**A mismatch means the write FAILED.** Do not proceed to the next operation, do not retry blindly, do
not log it as success. Report **both byte sequences**. Restore from the snapshot if needed.

### 2.4 🔑 THE BYTE-CHECK PASSES WHEN THE *PAYLOAD* IS WRONG

**This is the most important item in this file, because it defeats the control we rely on most.** The
byte-check proves the **server stored what we sent**. It says **nothing** about whether what we sent
was right.

Three proven instances:

| What the payload would have written | Evidence |
|---|---|
| A re-stamp regex `Last checked against build [^\n]*?\.` — **non-greedy to the first `.`, which lands INSIDE the build marker `v3.5-65d6500`** — producing `…build v3.5-65d6500 on 8/12/2026.5-af3a6e1 on 8/11/2026.` | `build/schedule/build-viu-2026-08-12/CHANGES-MADE.md` |
| A stray full stop (`on 12 August 2026**.**; the wording above…`) on C30041 and a tripled blank line on C29929 | `build/schedule/finish2-2026-08-12/testrail-execution-log.md` |
| **C30341** stored its text as raw HTML, so none of the writer's plain-text patterns matched: instead of **replacing** the provenance line and the marker it **APPENDED a second one of each — and the byte-check PASSED**, because the write was faithful to the payload | `build/report-suite/full-viu-2026-08-06/CHANGES-MADE.md` |

**⇒ THE PRACTICE, THREE PARTS:**
1. **DRY-RUN AND READ THE BUILT PAYLOADS BEFORE SENDING.** Not the diff, not the count — **the actual
   strings**. This caught all three above; the byte-check caught none of them.
2. **MAKE THE WRITER REFUSE INPUT IT CANNOT HANDLE.** After C30341, `rebuild()` was changed to
   **refuse outright** on any case containing raw markup. A writer that silently does the wrong thing
   on unexpected input **will do it again**.
3. **ANCHOR REGEXES ON SOMETHING THAT CANNOT OCCUR INSIDE THE FIELD.** Trap 1 was fixed by anchoring
   on the trailing date (`build \S+ on \d{1,2}/\d{1,2}/\d{4}\.`), because build markers contain full
   stops.
4. **RUN A POST-BATCH INVARIANT CENSUS** — exactly one provenance line and exactly one automation
   marker per touched case. **That census is what found C30341, not chance.**

### 2.5 🛑 VERIFY BY CONTENT, NEVER BY `updated_on` — it lies in BOTH directions

- **A FROZEN timestamp hides a change that happened.** Fourteen Report Suite cases had all three text
  fields turn into raw `<ol>`/`<li>` HTML **while `updated_on` and `updated_by` stayed frozen** at
  pre-pass values. Nobody in that pass wrote to any of them.
- **A FRESH timestamp advertises a change that did NOT happen — and this one is worse.** Three
  Filters cases (**C29601 · C38882 · C43562**) carried the current day's `updated_on` from an
  *unrelated* pass while the write intended for them **had never landed**. A worker checking "did my
  write go through?" by timestamp would have read today's date on all three and **stopped checking
  something that was broken**.

**On a shared suite, a fresh timestamp is the EXPECTED state and proves nothing at all.**

### 2.6 An HTTP 500 or 502 can come back from a write that LANDED

**NEVER blind-retry a failed write. READ THE LIVE STATE FIRST.** A blind retry after a 500 that
actually succeeded writes over a landed change — and the byte-check will happily confirm the second
one. *(Proven live: a transient HTTP 502 `policy unavailable` hit a pre-write read for C30010; the
batch stopped as Rule 50 requires, C30010 was read back live and confirmed unwritten, then the run
resumed.)*

### 2.7 An idempotence guard must test the CONTENT, not the CASE

`restamp.py` skipped any case already naming the running build **but exempted note-carrying cases from
that skip** — correct on a first run, **wrong on a resume**. C29929 came back with its tester note
**duplicated**. It was found by **reconciling the operation count against the plan (39 writes over 38
cases)**, not by chance.

**⇒ Two transferable rules:** an idempotence guard tests **the content it is about to write**, never a
class of case; and **reconcile the op count against the plan at the end of every batch.**

### 2.8 What a "0 changes" claim actually requires

Set equality **in both directions**, and presence **by id** — never matching totals. The shape that
stands up: *"176 tests, 529 results, 0 missing by id, 0 graded fields moved, 0 new, `case_id` sets
equal both ways, `include_all` still false."*

### 2.9 The audit log records four things per operation

**operation · target C-id · HTTP status · byte-level verification result.** An entry saying only
*"200 OK"* is **non-compliant**.

### 2.10 🔑 THE POST-WRITE ASSERTION RE-AUDIT — because an audit committed BEFORE the repair does not audit the repair

**This is the control that §2.4 leaves open, and it was missing until 2026-08-13.** §2.4 catches a
payload that is **mechanically** wrong — a bad regex, a stray full stop, an appended duplicate. **It
cannot catch a payload that is mechanically perfect and SEMANTICALLY WRONG for the case it landed on.**
Neither can the invariant census, because the result has exactly one provenance line and exactly one
marker, as required.

**THE SCAR, AND IT IS THE SHARPEST ONE WE HAVE, BECAUSE THE PASS THAT CAUSED IT WAS THE PASS FIXING
THIS EXACT PROBLEM.** `expected-behaviour-audit-2026-08-05.md` row 59 classified **SCH-FILT-03 =
[C29944](https://shopview.testrail.io/index.php?/cases/view/29944)** as **class C — LEGITIMATE**, and
quoted its expected results as three items with **no multi-status assertion**. The audit was committed
**before** the repair, exactly as good practice requires. **Then the same pass's own write added the
assertion** — *"Choosing more than one status shows the work orders of all the chosen statuses
together"* — which **no source in Rule 57's list supports**: absent from **all 27 spec versions**, from
story SV-8687, from the tech plan, from the design and from Branko's answers. **And the case's own
metadata still said *"Single vs multi-select within a group is not pinned - confirm live"*** — the
authoring pass had flagged it, the later pass confirmed it on the build, and the observation was
written in as a requirement. **Rule 58 exactly.** *(It is not even runnable as written: the steps say
*"choose one status"*, so the tester never reaches that expectation.)*

> **AN AUDIT COMMITTED BEFORE THE REPAIR DOES NOT AUDIT THE REPAIR. That is a structural hole in the
> discipline, not a slip by one pass.**

**A SECOND, DIFFERENT INSTANCE OF THE SAME CLASS — CONTENT THAT LANDED ON THE WRONG CASE.**
[C30162](https://shopview.testrail.io/index.php?/cases/view/30162) (Sales By Customer) and
[C30287](https://shopview.testrail.io/index.php?/cases/view/30287) (Sales By Representative) were
given, in one pass, a symptom block naming the **Inventory Value** column set — *"Part #, Description,
Category, Vendor, Qty, Unit Cost, Unit Sell, Total Cost, Total Sell"* — and that report's example
figure `$11,176.88`. **Neither report has those columns.** A tester cannot match a symptom from another
report, so **Rule 61's second bullet would then have told them it was *"a NEW problem — please report
it"*: the text manufactured duplicate tickets on two reports.** Every byte-check passed.

### ⇒ THE PRACTICE — re-audit ONLY what the pass changed, and do it AFTER the write

**It is cheap precisely because it is scoped to the diff.** The proven method
(`build/quality-gate-2026-08-11/AUDIT.md`) makes *"what changed"* **a measurement rather than a
judgement**, by splitting `custom_expected` into three parts and comparing part by part:

| Part | What it is |
|---|---|
| **body** | everything **before** the `---` separator — **the assertion itself** |
| **provenance** | the Rule-54 line(s) after it |
| **marker** | the trailing `AUTOMATION:` line |

**A case is MATERIAL only if `title`, `preconditions`, `steps` or the EXPECTED BODY moved.** A
provenance re-stamp or a `refs` version re-cut **falls out by construction** — on that pass **495 of
771 cases fell out that way**, leaving 240 to read. **That is the whole reason this is affordable.**

**Then, for every material case, four checks:**
1. **QUOTE THE NEW ASSERTION BACK TO ITS CITED SOURCE.** If it cannot be quoted, **the edit is
   invalid** — not "weakly sourced", invalid (§11.2's quote-back gate, applied to our own output).
2. **CHECK THE ASSERTION IS REACHABLE BY THE CASE'S OWN STEPS.** C29944 failed this independently, and
   that failure **corroborated the sourcing finding from a different direction** — an assertion the
   procedure cannot reach usually did not come from the procedure.
3. **CHECK THE CONTENT BELONGS TO THIS CASE.** Any text naming a screen, column set, figure or report
   is checked against **this** case's subject. C30162/C30287 is the whole reason.
4. **DIFF THE NOTE PARAGRAPHS TOO, NOT ONLY THE NUMBERED ASSERTIONS.** On Filters,
   [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) was **disarmed by a note
   paragraph**, not by an assertion. The forensic pass classified **105 note-block transitions across
   46 cases** and found the dominant pattern was the *correct* one; **the point is that it looked.**
   **The signature to hunt is a waiver** — *"known and accepted"*, *"on purpose for now"*, *"do not
   raise this as a new problem"* — over a requirement a document states plainly.

**⚠️ AND THE REPAIR IS NEVER "DELETE THE CASE".** An unsourced assertion is repaired by **removing that
assertion or making it scope-conditional** (Rule 42), leaving the rest of the case intact — see `01`
step 7, which separates *unsourceable* from *a traceability gap* from *open with the PO*.

**Record it as `POST-WRITE-AUDIT.md` in the pass folder**, stating the population, how many fell out by
construction, how many were read, and the verdict on each. **Saying "0 material changes, nothing to
re-audit" is a valid outcome; omitting the file is not.**

### 2.11 🛑 AUDIT FROM LIVE, NEVER FROM A SELF-REPORT (Standing Rule 50, added 2026-08-17/18)

**When auditing whether cases were changed — or in ANY after-the-fact verification — establish the
truth from LIVE TestRail plus the git history of the case source, NEVER from a worker's own summary or
oplog self-report.** A pass's own account of what it did is a **hypothesis**, not evidence — the same
principle skill `08` runs on, one step earlier. **This is §2.5's "verify by content, not by
`updated_on`" extended to a pass's own claims.**

**THE SCAR:** the 2026-08-17 Automated-marker audit found a prior pass's **"FOR VLAD: None"**
self-report was **WRONG** — it had in fact edited **two `custom_atmstatus == 3` (Automated) cases**;
**live verification caught it.** A self-report trusted there would have starved the Rule-65 tell-Vlad
report and left the automation engineer debugging our edit. **Read the live cases and the git log;
the summary is where to look, not what is true.**

---

# 3 · TESTRAIL HAZARDS — the mechanics that cost real time

### 3.1 🛑 NEVER set `custom_atmstatus: 3` on `add_case`

Send **`custom_atmstatus: 1`** ("Not Automated") **+ `custom_automation_type: 0`**.

**✅ QA-lead-confirmed 2026-08-17, verbatim: *"1 is correct"* — manual cases = `custom_atmstatus 1`;
`3` = Automated (reserved, e.g. Vladimir Tomovic's). No future `add_case` pass may revert to `3`.**

**`3` is Vladimir Tomovic's OWN flag for what HE has automated**, and the whole tell-Vlad duty
(Standing Rule 65) keys off it — so a case born `3` corrupts a signal he and we both rely on. The
field is `is_required: true` but its `default_value` is `"1"`, so `3` was never required by anything.

**This was our own long-standing defect:** the playbook told every `add_case` script to send `3`, so
**31 Schedule cases claimed to be automated when nobody had automated them**; all 31 were corrected
`3 → 1` on 2026-08-11.

- **Use the canonical helper:** `build/testing-tools/testrail_add_case.py` — `add_case_payload()` sets
  `1` and **raises** on `3`.
- **Run the guard before committing a pass that creates cases:**
  `build/testing-tools/check_add_case_payloads.py`.
- **Do NOT copy a payload out of an executed push script** — the 19 executed scripts still contain `3`
  **deliberately**, because they are the audit record of what was actually run.

**🛑 AND `custom_atmstatus == 3` IS ASK-FIRST FOR ANY EDIT OR DELETE — even our OWN cases (Standing
Rule 71, added 2026-08-17/18).** A case TestRail flags **"Automated"** (`custom_atmstatus = 3`) may not
be changed or deleted without the QA lead's permission first, **including a case `created_by = 3` (ours)
that someone — e.g. Vladimir Tomovic, id 1 — has flagged Automated.** Full treatment at §5.4.

### 3.2 `refs` — 248 chars per entry, comma-delimited, and it is a PATTERN error

TestRail splits `refs` on `,`, trims each entry, and re-joins with a bare comma. **Any single entry
over 248 characters rejects the WHOLE `update_case`** with `HTTP 400 Field :refs does not match the
required pattern.` — 248 passes, 249 fails. **Total** length is unbounded.

- **House style: one comma-free entry, ≤ 248 chars, semicolons as separators.**
- **Never put a comma inside a quoted list in `refs`** — `"Today, Yesterday, …"` silently becomes many
  references.
- **When verifying a `refs` write, compare under the normalisation**
  `','.join(p.strip() for p in s.split(','))`, and **assert it explicitly in the log as the expected
  transformation**. This is **the only declared normalisation permitted by Rule 50**; any newly
  discovered one must be **proven and recorded in `build/APP-ACTIONS-PLAYBOOK.md` §J with its
  evidence BEFORE it may be relied on**. Until then, **a mismatch means the write failed.**

### 3.3 ⚠️ `get_sections` NEEDS PAGING — and it fails SILENTLY

This project has **625 sections**. An unpaged `get_sections` returns the **first 250**, with no error
and no warning. Because the Filters group is section **4110**, an unpaged call finds **ZERO Filters
sections and therefore zero cases** — which reads exactly like *"the group is empty"*. Same for
`get_cases`, `get_tests`, `get_results_for_run`.

**And the URL separator is `&`, never `?`** — the whole `/api/v2/...` path already sits inside
`index.php?`, so a second `?` is an illegal character, not a separator. `get_cases/1?suite_id=1`
returns `HTTP 400 Invalid characters in URI`. **Build the path with `&` unconditionally.**

**⚠️ AND THIS IS THE REAL CAUSE OF THE `getall()` / `trlib` PAGING BREAKAGE (recorded 2026-08-11,
Schedule staged push) — the fault has been mis-described before as *"it appends `?limit=` twice"*,
which is a symptom.** The shared paginators in
`build/testrail-run-sync-2026-07-31/{run_sync_audit,sync_runs_EXECUTOR,exec_run_sync_2026-07-31}.py`
all carry the shape

```
f"{path}{'&' if '?' in path or '/' in path else '?'}limit=250&offset={offset}".replace('?limit', '&limit')
```

— **a conditional that can emit `?`, followed by a `.replace()` that patches it back to `&`.** It
works **only because the patch undoes the conditional**, so the moment anyone edits either half, adds
a parameter, or reorders the string, the request 400s — **and the failure reads like an empty result
set, not like a bad URL.** **Proven live 2026-08-11, all read-only:** `get_cases/1?suite_id=1` →
**HTTP 400** · the four-parameter all-ampersand form → **HTTP 200** · a five-parameter form → **HTTP
200**. **TestRail corroborates it itself:** the `_links.next` it hands back reads
`/api/v2/get_cases/1&suite_id=1&limit=2&offset=2` — **ampersands throughout, no `?` anywhere**, so
the server's own pagination link is the canonical example of the form to build.
Full write-up: `build/APP-ACTIONS-PLAYBOOK.md` §J.

### 3.4 `case_title` and `case_refs` on run results are ECHOES, not graded fields

A run result record carries the case's **current** title and refs, filled in at read time. **So
retitling a case, or writing its `refs`, makes its old result records read back differently with NO
run write at all.** A raw whole-record compare will report a false *"results changed"* and stop a
clean batch.

**Verify a run untouched on the GRADED fields only:** `status_id · comment · defects · elapsed ·
version · assignedto_id · created_by · created_on · test_id · case_id · id`.

*(`case_refs` is better described as a snapshot that catches up when the case is next written — on
2026-08-10 it moved on **208** run-357 results belonging to cases whose `refs` we never edited, purely
because an unrelated `custom_expected` write touched them.)*

### 3.5 🛑 TestRail re-renders tester text into HTML HOURS AFTER your write

**This is NOT §2.1, and §2.1's mitigation does not prevent it.** It fires **later**, on cases written
with all three fields sent, and produces a **full rich-text render** (`<ol>`/`<li>`, `<p>`, `<br />`,
`<hr />` for `---`, `<a href>` around bare URLs, `&nbsp;`) — **without moving `updated_on` or
`updated_by`**, so the immediate re-GET byte-check cannot see it.

**The proof:** two committed live snapshots of the same 110 Filters cases, 2.5 hours apart with **no
write in between**, differ on **10 cases in exactly the three text fields and no other field**, while
`updated_on` is byte-identical in both.

**What triggers it:** the run owners working the cases in the TestRail UI. 19 of 20 rendered Schedule
cases had been graded inside one 14-minute window.

**⇒ THE MITIGATION IS A DEFERRED CENSUS, NOT A TIGHTER WRITE:** census raw markup across the project
**at the START of every pass**, before any write; **never report "0 raw markup" as a durable state**
— it is true only of the moment measured; **expect repaired cases to regress.** Converter:
`build/markup-regression-2026-08-10/demark.py`.

### 3.6 The generator blanks the id-map C-ids and drops `refs` on every rerun

`gen_import.py` (every project's copy) **blanks the C-id column and drops the `refs` column** each
time it runs. **Re-merge both from live after every regeneration**, then prove: id-map rows == live
count, 0 blanks, `refs` N/N, header byte-identical to its peers.

### 3.7 The `joinlines` shredding bug

`gen_import.py`'s `joinlines()` did `"\n".join(x)` over a **string** where a live re-sync now writes
strings rather than lists — producing an import with **a newline between EVERY CHARACTER** of
preconds/steps/expected, in **all 165 rows** (Schedule) and **all 110** (Filters) and **all 473**
(Report Suite). **Fixed in each generator (split a string first), and every pass runs the shredding
guard and reports the count.**

### 3.8 Angle brackets are eaten as HTML

**Never use `<` or `>` in case text.** `TU-DAY-01 / C30418` imported as *"Expand 's daily breakdown"* —
the angle-bracket placeholder was swallowed. Sweep any payload for `<` before sending.

**🔴 IT HAPPENED AGAIN ON 2026-08-25, AND THE SWEEP IS NOW MANDATORY, NOT ADVISORY (QA lead approved
this addition).** Four cases across the six August suites reached TestRail with their placeholders
destroyed — **7 field instances**, found only by comparing local source against live:

| Case | Placeholder lost | Fields | What the tester was left reading |
|---|---|---|---|
| [C44864](https://shopview.testrail.io/index.php?/cases/view/44864) | `<query>` | title · refs · expected | `'No results for ' plus…` — the echoed search term simply gone |
| [C44875](https://shopview.testrail.io/index.php?/cases/view/44875) | `<q>` | preconds · expected | `banner 'Showing N work orders matching '` |
| [C44892](https://shopview.testrail.io/index.php?/cases/view/44892) | `<that customer>` | steps | `context set to {type: customer, id: }` — a broken instruction |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) | `<typed text>` | expected | `“Create  as a new part”` |

**⇒ TWO RULES, AND THE SECOND IS THE ONE THAT ACTUALLY FIXES IT:**

1. **SWEEP EVERY PAYLOAD FOR `<` BEFORE ANY `add_case`, `update_case` OR CSV IMPORT.** Run
   **`python3 build/testing-tools/check_angle_brackets.py <files-or-dirs>`** (exit 1 on a hit) over the
   case sources *and* the generated import CSV. **A case that has already been imported cannot be
   swept — the placeholder is gone and only the local source knows what it said**, which is why this
   is a pre-flight and not an audit.
2. **🔑 USE SQUARE BRACKETS FOR PLACEHOLDERS — `[query]`, NOT `<query>`.** Square brackets pass through
   TestRail's HTML pipeline untouched, so the meaning survives; angle brackets never can. **This is the
   permanent authoring convention.** *(Proven on 2026-08-25: the four cases above were repaired to
   `[query]` / `[q]` / `[that customer]` / `[typed text]` and byte-verified intact.)*

**Why "just avoid placeholders" is the wrong lesson:** the placeholder is carrying real information —
*the message echoes what you typed*. Deleting it to dodge the bug loses the assertion; bracketing it
keeps it.

### 3.9 A byte-check is a check on FIDELITY, never on CORRECTNESS

Restated here because it is the single sentence that generalises §2.4: **pair it with a post-batch
invariant census, always.**

---

# 4 · RUNS

**In scope: the active projects' runs only** — Filters **352** · Schedule **357** · Report Suite
**359**. Runs belonging to other or completed projects (324, 325, 278, 312) are **ignored entirely**:
not synced, not written to, **and not audited for missing cases**.

**Our coverage is measured against the CASE SUITE under our group — never against anyone else's run
selection.**

### 4.1 🛑 UNION ONLY — a partial `case_ids` list DELETES tests AND THEIR RESULTS

`update_run` **REPLACES** the selection. A run built with `include_all: false` — which is how every
run here was built — **stays frozen** at its original selection, so new cases never appear in it
automatically. The sync is therefore mandatory after any authorised `add_case`, and it is **add-only**
(deleted cases drop out by themselves).

```
0. CONFIRM EXPLICIT PERMISSION FOR THIS RUN, THIS PASS   ← see below; a run write is never implied
1. get_run/{id}          → if include_all is true, nothing to do; just verify the count
2. get_tests/{run_id}    → the run's CURRENT case_id list
3. get_results_for_run   → SNAPSHOT every result BEFORE writing, and COMMIT the snapshot (§8 R4)
4. update_run with sorted(set(current) | set(new))   ← THE FULL UNION, never a partial list
5. verify: test count as expected, case_id sets equal BOTH ways,
           EVERY prior result present BY ID, include_all still false
```

**🛑 STEP 0 IS NOT OPTIONAL, AND IT WAS MISSING FROM THIS PROCEDURE UNTIL 2026-08-13.** **These runs
belong to other testers** — 352 Ahtasham Amjad · 357 Ayesha Khan · 359 Nebojsa Glavinic and Viktoria
Videnovic — and **`update_run` is the single most destructive call we make**, because a partial list
**deletes their graded results and they cannot be recovered**. **Authorisation is required for the run
write itself, per ask** (Rule 6 + Rule 34), **not merely for writing results.** An `add_case` approval
is **not** a run-sync approval, even though the sync is mandatory after the add: **do the add, then
ask.** Where the run belongs to a completed project or already holds graded results, **ask whether to
sync it at all** — a "finished" run becoming incomplete is a reporting decision, not a QA one.

**🛑 SCOPE THE EXECUTOR TO ONE RUN BEFORE YOU RUN IT.** The canonical executor
(`build/testrail-run-sync-2026-07-31/sync_runs_EXECUTOR.py`) carries a **multi-run `SCOPE`**. The
proven-safe practice is the one used on 2026-08-05: **copy it with `SCOPE` cut to the single run you
were authorised for** — `tools/run_sync_357_only.py` — **so that runs another worker is live on cannot
be touched by a mistake in a list.** Do not run the multi-run form.

**⚠️ AND THAT FOLDER'S OWN PAGINATORS CARRY THE FRAGILE URL SHAPE NAMED IN §3.3** —
`run_sync_audit.py`, `sync_runs_EXECUTOR.py` and `exec_run_sync_2026-07-31.py` all build
`?limit=`-then-`.replace()`, **which works only because the patch undoes the conditional.** So the
canonical run-sync tooling is **exactly** the tooling most likely to return an empty page that reads
like *"the run has no tests"* — **the most dangerous possible false negative here, because an empty
`current` list turns the union into a partial list.** **Assert the run's test count against `get_run`'s
own `untested_count + passed_count + …` before building the union**, and stop if they disagree.

**Never write a RESULT to another tester's run.** Log only Passed cases to a run at all, and only with
permission; keep Failed / Retest / Blocked local.

**Why this rule exists:** a frozen run selection on Filters 352 made a reviewer see coverage gaps
**that did not exist**, and cost a wasted review cycle.

---

# 5 · FOREIGN CASES — hands off, and counted separately

**We NEVER edit, update, delete, move, or add to a run any case we did not author.** Not to tidy a
title, not to add `refs`, not to merge an apparent duplicate.

**How to tell:** `get_case` returns `created_by` / `updated_by` as user ids. **We are user id 3 (Bilal
Muzamil).** Id 1 = **Vladimir Tomovic**, the automation engineer. Others: 2 Nebojsa Glavinic ·
4 Viktoria Videnovic · 5 Ayesha Khan · 6 Mudassir Qamar · 7 Ahtasham Amjad · 8 Chris Amani ·
9 Sasha Grossman. `get_users` is admin-only for our account; resolve with `get_user/{id}`.

**Supporting tells:** no `refs` (ours always carry one) · `template_id` 2 vs our 1 · no expected
results · titles over 80 chars · `custom_automation_type` unset. **⚠️ `custom_atmstatus` is NOT a
tell** — it is `3` on his cases *and* on some of ours.

### 5.1 Proving a foreign case untouched

**By CONTENT, byte-compared against a pre-write snapshot committed before the first write —
including `updated_on` / `updated_by`.** *"We didn't write to it"* is an assertion; a byte-identical
snapshot is evidence. **A timestamp is context, never evidence** (§2.5).

### 5.2 When a foreign case CONTRADICTS ours

**The first move is NOT to defend ours.** Re-derive our own position from the current sources. **If
our source is stale or was misread, OURS IS THE DEFECT and we fix ours**, and we say so. Only then is
it a question for them, escalated to the QA lead with **both sides' sources** on the table.

**Never dismiss their case for having no `refs`.** A missing `refs` is a traceability shortcoming of
their case; **it is not evidence about the build**.

**The scar:** Vladimir's automated **C38923** asserted a Location column in the SBR CSV exports while
our **C30285** and **C30286** enumerated the headers *"exactly"* without it. **He was right and we
were wrong, against our own spec** (SBR v15 `S14-R20`, live one day before he authored) — and **his
case carried no `refs` at all**, precisely the signal we might have used to wave it away. The same
on-screen/export split existed on **four more reports**.

### 5.3 We must TELL VLAD when we change a case TestRail flags as Automated (Standing Rule 65)

**Any change — an UPDATE as much as a deletion — to a case with `custom_atmstatus = 3` obliges a
report**, so he can adjust his automation. **Every pass report carries an "AUTOMATED CASES CHANGED —
FOR VLAD" section**: per case, the **C-id + link**, **what changed in one plain phrase**, and
**whether it affects what an automated check would assert**. **Say "none" where none — never omit the
section.**

- **Record `custom_atmstatus` at WRITE time**, from the snapshot you already take — the flag moves
  (C29600 went `1→3→1→3`).
- **Check whether a PERSON actually set it** via `get_history_for_case` before reporting a case as
  automated. On Schedule **nobody ever did** — our own tooling hardcoded `3` (§3.1) — so reporting
  those would pad the list and cost it credibility on first reading.
- **This is a REPORT, not a write.** It never authorises editing a flag or opening a ticket, and it is
  **never a reason to skip a correction**.

### 5.4 🛑 OUR OWN "AUTOMATED" CASES ARE ASK-FIRST TOO (Standing Rule 71, added 2026-08-17/18)

**§5 keeps foreign cases hands-off; this protects OUR Automated cases for the same reason — an
automation suite may depend on them.** **Never change, edit or delete a case whose `custom_atmstatus =
3` ("Automated") without asking the QA lead first and getting permission — even a case `created_by = 3`
(ours) if someone (e.g. Vladimir Tomovic, id 1) has flagged it Automated.**

**⇒ THE PRECONDITION OF ANY PASS THAT WRITES TO CASES:** before authoring / VIU / a currency pass,
**identify the in-scope `custom_atmstatus == 3` cases first**; if the pass would touch one, **STOP and
ASK (per case or per batch)** and proceed only with permission. **Read the flag LIVE** — it moves
(C29600 went `1→3→1→3`) — and **do not infer authorship from a gap in a set** (§5.3): our own tooling
once hardcoded `3` on 31 Schedule cases nobody had automated.

**⇒ NEVER BLANKET-SKIP AN AUTOMATED CASE — READ-ASSESS FIRST (Rule 71 dated refinement, 2026-08-20).**
Ask-first governs EDITING; it does NOT license skipping the case unexamined. Automated (`atm=3`) cases:
**NEVER blanket-skip. Always READ-ASSESS (read-only, which Rule 71 permits) whether the case needs the
change, REPORT the finding (needs X / already fine), then HOLD for the QA lead's yes/no. Only on "yes"
edit (coupled with build-verify for content changes) + notify Vlad (Rule 65).** Rationale 2026-08-20:
a format pass blanket-skipped 5 `atm=3` Schedule cases (C43811/C38847/C38848/C38849/C38850) without
checking; a read-only check found all 5 render collapsed and DO need the fix — the QA lead required the
read-assessment ALWAYS happen first so he decides with the facts, not a blind skip.

**HOW THE THREE RULES COMPOSE:** **ask before (this rule) → do only with permission → tell Vlad after
(§5.3 / Rule 65)**; deletion additionally carries Rule 64's automation precondition.

**⇒ POST-BUILD-VERIFY VLAD HAND-OFF.** After build verification proves an Automated case's
steps/preconditions **run on the build**, correct its plain-text marker to **`AUTOMATION: READY`** AND
**share its case number with Vladimir Tomovic (id 1)** so he adjusts his automations. **The standing
hand-off list is `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.** (This
pairs §5.3's tell-Vlad duty with §15's Rule-69 marker-lift path.)

**⇒ EDIT AND BUILD-VERIFY TOGETHER — THE 2026-08-18 REFINEMENT (Rule 71, QA-lead confirmed).** Rule 71
is **not** "never touch Automated cases": one **MAY genuinely need its steps of reproduction,
preconditions and expected behaviour updated** to match the current sources. **But it is edited ONLY
when we can also build-verify it in the SAME pass**, so the steps/preconditions produced are
**confirmed runnable on the build before they reach anyone** — **editing and build-verifying happen
TOGETHER, never separately.** **WHY:** an Automated case is the **contract Vlad's automation runs
against**; editing it without build-verifying hands him a **moving, unverified target**, so he rebuilds
to match steps that may not run and **his work must be redone** — coupling means he gets **real,
runnable, confirmed** steps and adjusts **once, correctly.** **CONSEQUENCE:** while build verification
is deferred (feature not yet on the build), **do NOT edit Automated cases — HOLD them and list them for
permission** (skill `01` G10); the edit is **BATCHED INTO THE BUILD-VERIFY PASS** (skill `03` §6.4),
which verifies live, sets the marker (`READY`, or `READY - EXPECT FAIL (SV-xxxx)` on a live-backed
known bug), then hands the case number to Vlad. **Ask-first still gates it** even coupled with build
verification.

**⇒ CORRECTING OUR OWN ERRONEOUS METADATA-ONLY CHANGE IS A PERMITTED CORRECTION — DISTINCT FROM A
CONTENT EDIT (Standing Rule 71, dated addition 2026-08-18, QA-lead confirmed).** Reverting or correcting
**our own** erroneous **metadata-only** change on an Automated case (`custom_atmstatus = 3`) — e.g.
restoring a marker we wrongly applied, where the **testable content** (title, preconditions, steps,
expected BODY) is **UNTOUCHED** — is a **PERMITTED CORRECTION, done WITH the QA lead's authorisation**.
It restores the case (and Vlad's expected state) and does **not** touch what Vlad's automation runs
against. **This is DISTINCT from "editing an Automated case"**, which (per the build-verify-coupling
refinement above) means changing its **testable content** and requires build-verify coupling — **the
coupling requirement applies to CONTENT edits, NOT to undoing our own metadata error.** **Ask-first
still applies** (the go-ahead was given 2026-08-18 for the marker revert). *The scar: 27 Automated cases
had the deferred marker wrongly applied on a metadata-only re-stamp; the QA lead authorised reverting
their markers because content was untouched — a correction that restores Vlad's expected state, not a
content edit.* Ties to Rules 38, 69 (content-vs-metadata refinement), 71 (build-verify coupling) and
§5.4's Vlad hand-off.

**CONTEXT:** the 2026-08-17/18 currency passes edited content on **44 of our own Automated-flagged
cases without asking**; the QA lead ruled **KEEP them** and set this ask-first rule going forward.

**⇒ 2026-08-20 REFINEMENT — WHEN AN AUTOMATED CASE IS UPDATED + THE MANDATORY "FOR VLAD" HAND-OFF (Rule
71, QA lead; full treatment in skill `03` §6.4).** Verbatim: *"they need to be changed ONLY if they are
build verified and something in their title/preconditions/steps of reproduction/Epected behavior
changed ... update them with the sources references so that those changes do not bite me and then I have
to share the test case numbers with Vlad ... any test cases which we update/create and that goes to Vlad
and his automation fails we will be blamed for that."* In short: **update an Automated case ONLY if it
is build-verified AND its Title/Preconditions/Steps/Expected genuinely changed** (build-verified +
unchanged → leave it); **every such update carries its source references** (Rule 20); and **every
created/updated case bound for Vlad goes on the FOR VLAD hand-off list** (C-id + what changed + source
ref) — the pass's "AUTOMATED CASES CHANGED — FOR VLAD" section (§5.3) and the standing register — because
**a change that breaks his automation is blamed on us.**

---

# 6 · ACCESS MECHANICS — the five traps that produce a FALSE "dead session"

**Read this before asking the QA lead for new cookies.** The first three each cost a whole pass.

**(1) A 401 `sso_required` is usually an EXPIRED `cf_clearance`, not a dead sign-in.** Measured
against the exact set that had just 401'd, `sv_sso_session` and `PHPSESSID` were **byte-identical**
and only `cf_clearance` had changed. **Ask for a fresh `cf_clearance` by name, not a whole new
sign-in.**

**(2) PROBE THE `…api.` HOST, NEVER THE APP HOST.** `GET https://sv8685.qa.shopview.com/api/auth/me/…`
returns **HTTP 200 — and it is not a live session**: the SPA host serves `index.html` for any
unmatched path, so the 200 is an HTML page. Always probe
`https://sv<n>api.qa.shopview.com/api/auth/me/fe-permissions`.

**(3) `paste -sd'; '` SILENTLY CORRUPTS THE COOKIE HEADER** — it **alternates** the two delimiter
characters, producing `A=1;B=2 C=3` and **dropping the third cookie**. That one bug produced a false
"dead session" that stopped an entire pass; rebuilt as **`'; '.join(lines)`** the very same cookies
returned **HTTP 200 with 42 permissions on the first try**. Keep the cookie file as **one line**,
`name=value; name=value; …`, `chmod 600`, `/tmp` only.

**(4) EACH QA BRANCH KEEPS ITS OWN SESSION STORE.** `sv_sso_session` + `cf_clearance` are **shared
across branches**; **`PHPSESSID` is per-branch**. A set alive on one branch returns **HTTP 409
`Session has expired.`** on another. **A live cookie on one branch is not a live session on another.**

**(5) 🛑 `POST /api/quick-login` AND `POST /api/switch-user` BOTH ROTATE THE SHARED `sv_sso_session`,
SIGNING OUT ANY CONCURRENT WORKER ON ANOTHER BRANCH.** **Never call either while a sibling worker is
live** — and say so in the pass notes, because it is the honest reason a permission case goes
unobserved rather than being seeded around.

### 6.1 The diagnostic order — so nobody re-derives it

> build the header with `'; '.join` → probe the **`…api.`** host → on **401** ask for a fresh
> **`cf_clearance`** → on **409** check you are using **that branch's** `PHPSESSID` → only then
> consider the sign-in dead.

**401 vs 409 vs an HTML challenge each name a different dead half:**

| Symptom | What is dead |
|---|---|
| **401 `{"error":"sso_required"}` as JSON from the app** | the **shared `sv_sso_session`** — the request reached the application, so Cloudflare is fine |
| **A Cloudflare challenge / HTML body** | **`cf_clearance`** — the request never reached the application |
| **409 `Session has expired.`** | the **per-branch `PHPSESSID`** — wrong branch's value, or a burned session |

**The signature of a genuinely dead shared sign-in — all three together:** all branches 401 at once on
a byte-identical shared token · the refusal arrives from the app as **JSON** · **nothing returns 409**.
**Then, and only then, ask for a fresh `sv_sso_session` — by that name.** `quick-login` is **not** a
recovery route in that state: it is itself SSO-gated and answers 401.

### 6.2 The 409 recovery recipe (a failed `quick-login` burns the session)

If `quick-login {"key":"tech"}` returns **403**, every request on that branch then returns **409**.
**The fix:** call `quick-login {"key":"admin"}`, take **only the `PHPSESSID`** it returns, and swap
that one value into the existing header, leaving `sv_sso_session` and `cf_clearance` untouched.
**Do not rebuild the whole header and do not ask for new cookies.**

### 6.3 Other mechanics

- **Cookie lifetime ~24 hours**, and they also die **on a deploy**. A 401 well before 24h ⇒ suspect a
  deployment.
- **`node-fetch` ignores the proxy** → use undici `ProxyAgent`, or Node global `fetch` with
  `NODE_USE_ENV_PROXY=1`.
- **Chromium cannot TLS through the egress proxy directly** → `boot2` hydration (seed cookies +
  localStorage `user` / `fe_permissions_wrapper` / `token`, **then** navigate; the DEV login buttons
  do not reliably work), and rebuild the MITM bridge every run — **the port rotates, never hard-code
  it**.
- **Cookie VALUES are secrets: `/tmp` only, never in the repo.** Cookie *names* are fine.

---

# 7 · ENVIRONMENT — what you may create, change and destroy

### 7.1 Everything except TestRail is disposable (Standing Rule 6)

Staging, the QA branches, QuickBooks, every integration account — **nothing there is off-limits.**
Create work orders, adjustments, invoices; push to QuickBooks and verify the real line items; unmap
and remap settings. **Do NOT skip a verification because it writes to a third-party integration.**

### 7.2 Seed rather than block (Standing Rule 14) — this is not optional

**A test may NEVER be left "NOT VERIFIED" because the data state does not currently exist.** The QA
lead's standing words: ***"there is nothing like 'require seeding data' — you can make everything in
the build; do not find an excuse to keep yourself blocked."*** And on the QA branches: ***"do whatever
you want to do with data seeding/changing/editing in the QA branch."***

*"Line already approved"*, *"no returnable part exists"*, *"no invoice in void state"*, *"this role
has no live holder"* are **not blockers** — they are things to create. The self-seed playbook:
- **Don't wait for the QA lead to unblock an env/data problem** — find the fix (e.g. the location
  switcher, a different work order in your own workplace).
- **When the UI resists, switch to the API; when the API is awkward, switch to the UI.**
- **Discover endpoints by probing** — POST an empty body and read the validation error to learn the
  required fields.
- **For Quasar UI, click by element-centre coordinate** rather than Playwright actionability clicks
  that time out on backdrops.
- Only after all of this genuinely fails is it a real blocker — and then it is a
  **fully-characterised, evidence-backed label** (*"WO line-create returns HTTP 500, requestId X"*),
  **never a bare "NOT VERIFIED"**.

**Tag throwaway data `ZZAUTOTEST`.** Rules 5/6 also ask that you **restore any setting, role or
location you change** — see the carve-out immediately below, which is where that obligation actually
bites.

**🔴 A DATA-STATE OR A LOGIN IS NEVER A REASON TO SKIP A BUILD-VERIFY CASE (Standing Rule 74,
2026-08-19).** On staging/QA (disposable test envs) you **seed the data AND log in as whatever
user/role a case needs** — fresh staff per role, `switch-user`, or `quick-login` — the only limit being
"don't disturb a live sibling" (§6). The **only** acceptable un-build-verified case is one whose
feature is **genuinely absent** from the build (Rule 69). Operator form: skill `03` §8.

### 7.3 🛑 ROLES, STAFF RECORDS AND SETTINGS ARE EXCLUDED FROM "SEED FREELY"

They are excluded for two separate reasons, and both are load-bearing:

**(a) A DRIFTED ROLE CHANGES WHAT EVERY OTHER TEST SEES (Standing Rule 26).** Before any
permission-or-role-gated verification, **reset every in-scope role to its template first**, record the
before→after diff (**the diff is itself a finding**), verify each template default against the spec
matrix, and **leave the roles at template afterwards** — that corrected state is the baseline every
session sharing the org depends on. **If a role re-drifts mid-test, reset it again and continue** —
persistently, not a fixed number of retries.

**(b) THE EDIT DESTROYS SESSIONS, ONE WAY.** A **staff-record** edit invalidates that user's session
instantly (HTTP 409 `Session has expired`). A **role-definition** edit invalidates **every holder's**
session — **and it does not come back when the permissions are restored.** On this estate sign-ins are
scarce, so that is often the whole day's access.

**⇒ THAT IS A SCHEDULING CONSTRAINT, NOT A WALL** (§11.4). Do everything that needs the session
**first**, commit it, **then** make the edit **last**. Both failure directions have already happened
in one day: two Filters cases were held for months because the cost was **avoided rather than
scheduled**, and a Schedule pass **cost itself the Technician session by doing the edit first**.
**The correct order when new role-holders are needed: create the users, permission them, and only
THEN sign each one in and mint cookies — configure first, mint second.**

### 7.4 🔑 SEEDING DATA IS PERMITTED. MANUFACTURING THE CONDITION UNDER TEST IS NOT

**Section §3 of skill `03` is the full treatment; the line is drawn here because it governs every
skill.** Two proven instances, in opposite directions:

- **A "persistence defect" that was our own leftover state.** A saved filter preference did not move
  when a filter was applied — twice, in the exact area where two open tickets live, the evening before
  a release. **It was ours:** from a proven-clean baseline (`filters: []`) the same action saved
  perfectly. The earlier non-update came from **state a previous probe of ours had left behind**.
- **A pass SEEDED a default workplace** to get past the `/no-location` redirect, then observed
  work-order links working where a normally-signed-in session had faithfully seen plain text. **Its
  own setup had created the evidence** — the shipped guard withholds the link from any user whose
  `defaultWorkplace` is null. Caught before three cases were changed.

**⇒ Establish and record the BASELINE BEFORE the action, not just the state after it. When a result
surprises you in an area that already has open tickets, RE-RUN FROM CLEAN FIRST. And name every
environment mutation the pass made, in the pass's own record**, so the next reader can tell setup from
finding.

### 7.5 🛑 A PROBE MAY NOT PRESS A DESTRUCTIVE CONTROL TO FIND OUT WHAT IT DOES

**The same pre-existing shift was destroyed TWICE in two days, by two different workers, on the same
branch — and the second time is the one that matters, because the first was already written up with
the exact warning that would have prevented it.**

**Both probes made the same assumption:** click **Delete** on a shift's detail modal, then read the
*"this shift or the whole series?"* dialog and press Escape. **For a NON-SERIES shift there is no
dialog at all**, so `DELETE /api/schedule/shifts/{id}?scope=shift` → **HTTP 204** completed on the
first click. There was nothing to cancel.

**THE SECOND WORKER'S OWN WORDS, KEPT VERBATIM BECAUSE THEY ARE THE LESSON:**

> *"The warning was already on disk and I had not read it. … **A guardrail written down but not read is
> not a guardrail.** The lesson is not 'be careful with delete'; it is **read the project's own incident
> reports before writing a probe that clicks anything destructive**. … And the deeper fault was in the
> probe's shape, not my attention. The probe pressed a destructive control in order to *discover* what
> would happen next."*

**THE FOUR RULES THAT FOLLOW:**
1. **ESTABLISH WHETHER A CONFIRMATION STEP EXISTS *BEFORE* PRESSING THE CONTROL THAT COMMITS.** A probe
   may open a destructive dialog **to read it**; it may never press the commit control to learn whether
   one appears. **The safe order is: establish, then press.**
2. **SELECT BY ID, NEVER BY A DISPLAYED STRING.** The first delete matched the customer name
   **`Brabay Maintenance`** on the grid, which was ambiguous — the eight shifts that worker had created
   and the one it destroyed all belonged to the **same work order, S-14158**. The id was already in
   hand. **Matching on a display string is how a cleanup step becomes a destructive one.**
3. **READ `build/<project>/*/INCIDENT-*.md` BEFORE WRITING ANY PROBE THAT CLICKS.** They are short,
   there are two, and one of them contains the field-by-field record that made the recovery possible.
4. **MAKE THE PROBE PRINT ITS NON-GET CALLS AT EXIT, AND EXPECT THAT LIST TO BE EMPTY.** That is the
   only reason the second delete was caught within seconds instead of at the next board diff.

**WHAT RECOVERY LOOKS LIKE, SINCE IT WILL HAPPEN AGAIN:** recreate from a **board fetch taken earlier
in the session**, verify **field by field** (11 fields, 0 mismatches), and **state plainly that the id
cannot be restored** — a delete destroys it and the create mints a new one, so the board diff reads
one REMOVED and one ADDED **for good, and that is the honest record.** Then prove nothing else moved:
*"shifts 545 → 545, events 49 → 49, series 18 → 18; REMOVED ece60594, ADDED 07c11c58, CHANGED 0."*
**Write the incident up rather than tidying it away** — both are on the record, and the second one
exists only because the first one was.
*(`build/schedule/drag-retry-2026-08-12/INCIDENT-accidental-delete-2026-08-12.md` ·
`build/schedule/finish-2026-08-12/INCIDENT-shift-delete-2026-08-12.md`.)*

---

# 8 · SESSION SURVIVAL (Standing Rule 29)

**Four passes were killed on 12 August. Nothing was lost — only because of this.** The container and
`/tmp` are **ephemeral**; **git is the only durable store.**

### The seven requirements — a pass can be FAILED on these

| # | Requirement | The failure it was written against |
|---|---|---|
| **R1** | **The per-operation log is written BEFORE or AS each write, `flush()`ed, and COMMITTED** — case id · verb · intended fields · HTTP status · verification result · UTC time. **Write the INTENT line before the call and complete it after**: an op with an intent and no outcome is the exact point the pass died. | a pass wrote for ~40 minutes with no checkpoint; an oplog written at the end is worthless to a run that dies in the middle |
| **R2** | **Commit AND push every 25 write ops or 10 minutes of wall clock, whichever comes first.** On exploratory passes the 10-minute ceiling governs. **A checkpoint never waits for a clean stopping point** — a half-finished findings file committed beats a perfect one lost. | *"commit regularly"* is exactly what the 40-minute silence was already doing |
| **R3** | **`git fetch` + `merge --ff-only` at pass start**, before reading anything | a checkout reported *clean* and *1 ahead* while **110 commits behind** |
| **R4** | **Verification evidence is COMMITTED, never left in `/tmp`.** `/tmp` is for **secrets only**. **A byte-comparison whose output is not committed did not happen, evidentially.** | **the only thing actually lost on 2026-08-11** — the writes landed, the proof did not |
| **R5** | **Resume by re-establishing position from LIVE, by CONTENT** — fetch, read the killed pass's oplog, **verify that claim against live field by field**, complete only what is verifiably missing | a fresh `updated_on` is not proof; a 500 can follow a success; a liveness check is not progress |
| **R6** | **The pre-kill state save** — **DONE** (with evidence path) · **IN FLIGHT** (with its exact re-run recipe) · **AWAITING WHOM** | — |
| **R7** | **Path-scoped commits** (§9) | a bare commit has swept a sibling's staged work **three times** |

**The test that decides whether R1 is really being met:** *if this worker is killed right now, can the
next one find its exact position from **git alone**?*

> **⚠️ THE REPLAY TRAP, PROVEN TWICE.** A staged plan that performs **exact-string surgery** against a
> pre-write snapshot **cannot simply be re-run later** — a sibling may have moved the anchors it
> matches on, so it fails its own assertions. **Say so in the recipe: REBUILD, do not replay.** And
> the upside, recorded because it is not obvious: one plan **rebuilt from source** produced a *better*
> result — it dropped a case that did not belong and found a gap the original had missed.

> **⚠️ NEVER `pgrep -f` A PATTERN THAT APPEARS IN THE WATCHING SHELL'S OWN COMMAND LINE.** It matches
> itself and returns *true* forever, while the batch has **silently never run**. **A liveness check is
> not evidence of progress — check the work product.**

## Session survival — the detached-process architecture (Rule 75)

**The context-thrash failure is PERMANENT and structural:** this CLAUDE.md is large and is injected
into every agent, so headroom is small. An agent that reads large files, takes large tool outputs, or
**STAYS ALIVE POLLING a long job** refills context faster than autocompact can keep up, and dies —
seen as *"autocompact thrashing 3 times in 3 turns."* **The detached WORK survives; it is the
babysitting AGENT that dies.** So: **never babysit.**

**THE THREE-PART PATTERN — mandatory for any job over ~1–2 min or more than a handful of cases
(reflows, VIU / build-verify passes, sweeps, multi-case pushes, audits):**

**(1) THE WORK = ONE DETACHED, IDEMPOTENT, RESUMABLE SCRIPT** — never per-item agent tool-calls. It
does all file/API work; writes a checkpoint file (`DONE.jsonl`) it reads on start to skip completed
items; writes its own log. It performs the quality steps deterministically and EXHAUSTIVELY (Rule-50
byte-verify, Rule-41 whole-case re-reads, Rule-71 automation gates, Rule-54 provenance stamping) with
no context ceiling. **It creates a run-flag `touch /tmp/<job>.running` at start and `rm -f`s it on
exit (use `trap 'rm -f /tmp/<job>.running' EXIT` so it clears even on crash)** — this flag, NOT a
`pgrep` on the script name, is what the committer gates on. Launch it detached:
`nohup python3 build/.../work.py >work.log 2>&1 &`.

**(2) A PURE-SHELL COMMITTER LOOP CHECKPOINTS — NO LLM, SO IT CANNOT THRASH.** Launch it detached
alongside the work script. Reusable form:

```bash
nohup bash -c '
  BR=claude/slack-session-0sxnd9
  # Gate on the run-flag the work script created, NOT on pgrep of the script name.
  while [ -f /tmp/<job>.running ]; do
    git add -- <explicit paths>
    python3 build/testing-tools/scan_secrets.py --staged || { sleep 300; continue; }
    git commit -q -F /tmp/ckmsg.txt -- <the same paths> 2>/dev/null
    for i in 1 2 3 4; do
      git push origin HEAD:"$BR" && break
      git fetch origin "$BR" && git rebase "origin/$BR" || break
    done
    sleep 300
  done
  # final flush after the work script exits
  git add -- <explicit paths>
  python3 build/testing-tools/scan_secrets.py --staged && git commit -q -F /tmp/ckmsg.txt -- <paths> 2>/dev/null
  for i in 1 2 3 4; do git push origin HEAD:"$BR" && break; git fetch origin "$BR" && git rebase "origin/$BR" || break; done
  grep -c "^" DONE.jsonl > SUMMARY.txt   # tally into a committed SUMMARY
  git add -- SUMMARY.txt && git commit -q -m "work SUMMARY" -- SUMMARY.txt; git push origin HEAD:"$BR"
  touch WORK-COMPLETE.sentinel
' >committer.log 2>&1 &
```

Keep `git add`/`commit` **path-scoped** (§9) so a sibling worker's staged files are never swept.

**⚠️ NEVER gate the committer on `pgrep -f <scriptname>` — the committer's own command line contains
`<scriptname>`, so pgrep self-matches and the loop never ends (Rule 29 R5). Use a run-flag file the
script creates and deletes.**

**(3) THE AGENT LAUNCHES AND EXITS — NO POLL LOOP.** Write the script, launch it + the committer
detached, confirm both alive with **ONE** `pgrep` (never a pattern matching the watching shell — see
the warning above), then **END THE TURN.** Verification + the final tally happen LATER in a **FRESH,
SHORT-LIVED agent that runs ONCE**: it reads the `WORK-COMPLETE.sentinel` + `SUMMARY.txt` (or computes
its own `grep -c` tally against live/committed evidence, never a self-report — Rules 29/50), reports,
and exits.

**PROHIBITIONS — each is a way an agent has actually died:**
- **Never keep an agent in a poll/watch loop** waiting on a job (even `tail`/`wc` polls accumulate).
- **Never `Read`/`cat` a large file into an agent** — inspect only with `wc -l` / `head -n 5` /
  `grep -c` / `tail -n 20`, sparingly.
- **Never let a tool dump a large blob into the agent** — redirect to a file, read a bounded slice.
- **Never hand an agent a huge inline blob to hold across turns.**

**QUALITY IS PRESERVED, NOT TRADED:** the heavy work is more rigorous in a script (exhaustive,
deterministic, byte-verified) than in agent tool-calls, and verification reads COMMITTED EVIDENCE +
live content, never a pass's own memory. **Deeper lever, flagged not acted on:** a smaller CLAUDE.md
(bulk → load-on-demand skills) is the ultimate fix, but it is a QA-lead decision (Rule 72) — never
unilateral, lest durable memory or authenticity be lost.

## Quota discipline (Standing Rule 76)

Every subagent spawn re-loads the large CLAUDE.md as context (**200–380k tokens each**) — the NUMBER
of spawns, not the size of the work, is what burns quota. So: **NEVER spawn for a trivial check**
(`wc -l`, `pgrep`, "is it done", "is the tree clean") — the detached script/committer writes a
human-readable progress line INTO EACH COMMIT MESSAGE (e.g. "schedule reflow 143/195") + a STATUS
file, and the orchestrator reads progress from those; **poll-by-spawn is BANNED.** **ONE launch worker
+ at most ONE end-of-job verification worker** per long job (no mid-run checks). **BATCH RUTHLESSLY** —
one worker does all related steps (do → finalize → diagnose → fix → commit) and edits many cases in one
scripted run; rule/register/skill edits batch into a single worker. The detached committer handles ALL
mid-run commits — do NOT spawn a commit worker to answer a stop-hook nag. **On MOST turns, respond in
TEXT — do not spawn** (the stop-hook fires every turn; a reflexive per-turn spawn is the trap). Kill
orphan/redundant processes before launching (Rule 75).

## Verification validity window (Standing Rule 77)

A case **build-verified within the last 3 builds counts as BUILD-VERIFIED** (not merely
provisional/stale) — PROVIDED it shows the **date + build marker** it was last checked against
(Rule 54 sentence 2). A case **source-verified within the last 3 source versions counts as
SOURCE-VERIFIED** — showing the **date + version** last checked. **Beyond 3 builds / 3 versions**, it
reverts to needing re-verification. **Where the intervening-deploy or version count cannot be
established, treat as OUTSIDE the window (needs re-verify) — never assume inside (Rule 12).** Refines
Rules 49/60 for never-final, frequently-redeploying branches; honesty is preserved because the claim
is always *"build-verified, last checked build X on date Y"*, never a bare "verified".

## Piggyback cheap checks (Standing Rule 78)

Rule 78 — piggyback cheap checks onto the next substantive worker; keep a pending-cheap-checks list; effective Tue 2026-08-25. Never spend a dedicated spawn on a cheap, non-urgent verification (build/version/tree checks); append it as an extra sub-task to the next real worker and drain the list opportunistically. Canonical example: Rule 77's ≤3-build / ≤3-version window check.

## Strategy-first (Standing Rule 79)

Rule 79 (permanent) — STRATEGY-FIRST: before any task, recall or devise the smartest quota-efficient plan (fewest spawns, batch, detached self-report, piggyback checks, answer-in-text) THEN begin; keep improving it. Umbrella over Rules 75–78.

## Ask before re-running (Standing Rule 80)

Rule 80 (permanent) — before build-verify / source-verify / VIU / any ordered task, STATE when it was last done (date + build/version, from committed records) and ASK before re-running; never auto-re-run a recently-done verification. Pairs with Rule 77 (a check within 3 builds/3 versions still counts — a re-run may be unnecessary).

## Source-verify precedes build-verify (Standing Rule 81)

Rule 81 (permanent, refined 2026-08-20) — source should be current before build-verify/VIU, BUT do NOT auto-run source verification: tell the QA lead the task needs source-current cases, state the last source-verify date (+version), ASK proceed WITH or WITHOUT source verification, and WAIT for his answer (aligns with Rule 80).

---

# 9 · GIT ON A SHARED, MOVING BRANCH

**Another session pushes to this branch from a different container.** All of the following are proven,
not theoretical.

### 9.1 A clean tree is not a current tree

`git status` reported **clean** and `git rev-list` reported **1 ahead** while the checkout was **110
commits behind**. A recovery pass then concluded **all six passes' work was lost** — false, and
withdrawn. **Every conclusion it drew was confident, fully evidenced and wrong.**

**⇒ `git fetch origin <branch>` + `git merge --ff-only` as the FIRST ACTION of every pass. If the
fast-forward is refused, STOP and report — never force, never rebase, never `reset --hard`**, because
a sibling's commits are the very thing at risk.

**⇒ And a "1 unpushed commit" warning is usually a STALE TRACKING REF.** `origin/<branch>` is only as
fresh as your last fetch. **Fetch, then check, before acting on it.**

### 9.2 Parallel workers share ONE git index

**A bare `git commit` takes the WHOLE INDEX, including another worker's staged files.** It has swept a
sibling's staged work **three times**. One documented instance: a worker staged correctly path-scoped
to `build/schedule/`, then committed with a bare `git commit -q -F /tmp/cm4.txt` and **swept in nine
files staged by the live Report Suite worker**. Nothing was lost — **the damage was to the record**,
because the commit message talks only about Schedule and misattributes the nine. **It was deliberately
NOT fixed:** *"a misleading commit message is a documentation problem; a rewritten shared history is a
data-loss problem."*

**Note the asymmetry:** path-scoped `add` protects **other people's files from you**; only path-scoped
**`commit`** protects **you from an un-scoped sibling**.

### 9.3 The procedure

```
git fetch origin <branch> && git merge --ff-only     # first action of the pass
python3 build/testing-tools/scan_secrets.py --staged # §10 — before every commit
git status                                           # immediately before committing
git add -- <explicit paths>                          # NEVER -A, NEVER .
git commit -F /tmp/msg.txt -- <the same paths>       # back to back, nothing in between
git show --stat                                      # confirm what actually landed
git push origin <sha>:refs/heads/<branch>            # the EXPLICIT SHA, never force
```

- **`git commit -m "msg" -- <paths>` errors** (*"did not match any file(s)"*) — write the message to a
  temp file and use **`-F`**.
- **Push the explicit SHA**, because `git push <branch>` resolves the ref **at push time**: a sibling
  can add a commit between your scan and your push, publishing work **you never looked at**. Report
  the pushed SHA and confirm it equals the SHA you scanned.
- **Expect HEAD to move under you.** That is normal here, not an error.

---

# 10 · SECRETS — THE REPOSITORY IS **PUBLIC**

`bilalmuzamil-sketch/Manual-test-Cases` is `"private": false`. **Everything committed is
world-readable the moment it is pushed.** That changes what may be written to disk **at all** — it is
not merely a reason to be tidy.

### 10.1 The proven incident (2026-08-11)

**12 Mercure JWT bearer tokens in 13 tracked files.** Eight had been public **since 4 August**. Every
earlier scan passed, because the patterns looked for **cookie prefixes** and **`eyJ` was not among
them**.

**THE HARNESS CAUSE — and it was NOT an `Authorization` header.** A capture script did
`body = JSON.stringify(j).slice(0, 600)` — **the first 600 characters of EVERY JSON response body** —
and `/api/notifications/subscribe-token` exists purely to **return a token**. There were **zero
`Bearer` literals in the repo**, so a scan for request headers would have found nothing.
**⇒ RESPONSE BODIES LEAK CREDENTIALS JUST AS READILY AS REQUEST HEADERS, AND ARE FAR LESS WATCHED.**

**THE REASONING THAT FAILED US, so it is not repeated:** *"it expires in ten minutes"* and *"it only
grants read to one topic"* are statements about **blast radius**, not arguments for committing it. A
signed token is also an **offline oracle for brute-forcing the signing key**, and **that risk does not
expire when the token does.**

### 10.2 The practice

- **NEVER write an `Authorization` or `Cookie` header, or a response body containing a token, to
  disk.**
- **REDACT AT THE POINT OF CAPTURE, not before commit.** Keep the header/key **name** so the evidence
  stays diagnostically useful; replace only the **value**. Copy the `scrub()` helper pattern into any
  new capture harness.
- **Run the scanner before every commit:**
  ```
  python3 build/testing-tools/scan_secrets.py --staged    # exits non-zero on a hit
  python3 build/testing-tools/scan_secrets.py --selftest  # proves it BOTH ways
  ```
  It covers JWTs, `Bearer`/`Basic` values, `Authorization` headers, `set-cookie` and session-cookie
  **values**, the known cookie prefixes, `figd_` Figma tokens, private keys, cloud/GitHub/Slack
  tokens, and literal password assignments — and it deliberately **distinguishes a reference from a
  value**, because **a scanner that cries wolf gets switched off and then protects nothing**.
- **⚠️ REDACTION DOES NOT UNDO EXPOSURE.** Cleaning files at HEAD leaves the tokens **in git history**;
  on a public repo anything pushed must be assumed already cloned and cached. **Rotating the signing
  secret is the only control that actually revokes them — that is the QA lead's decision, not a
  worker's.**

---

# 11 · AUTHORITY — what you may act on, and what you must ask about

### 11.1 🛑 THE JIRA CREATION HOLD IS ACTIVE (Standing Rule 62 + the 2026-08-10 hold)

**Standing Rule 62:** no Jira ticket of **any type** may be created without the QA lead's explicit
permission, **asked for and granted first**. Permission is **PER ASK** — an earlier batch approval
never covers a later ticket. **A finding being real, sourced and obviously worth filing is NOT
permission**; how good the finding is and whether we may file it are two unrelated questions.

**Layered on top, his ruling of 2026-08-10, verbatim: *"Do not create anything until my next
order."*** Rule 62 says **ask first**; this says **the answer is no for now**, so there is nothing to
ask about while it stands.

**Safe reading, as encoded:** no Jira ticket · no new artefact in any external system of record.
**`update_case` on EXISTING cases CONTINUES** — that is **correction, not creation**.
**⚠️ `add_case` IS NOT BARRED BY HIM.** He corrected that reading himself, verbatim: ***"WHY? We are
supposed to crfeate test cases … we are supposed to create the test cases."***
**Where a worker cannot tell which side of the line something sits, it STOPS AND ASKS.**

**⏳ LIFT CONDITION: his next order.** **A session reading this weeks later must NOT treat it as
standing law — check whether it has been lifted.**

**🔴 THE HOLD WAS RE-STATED BY HIM ON 2026-08-12, IN THE SAME BREATH AS RAISING THE TICKET-EVIDENCE
BAR, verbatim: *"However for now the Jira ticket creation is still on hold."*** **So the hold was
still active as of 2026-08-12, and the new eight-item evidence bar (Standing Rule 52, and skill `06`)
is EXPRESSLY FOR THE FUTURE — it is NOT a signal that filing has resumed and must never be read as
one.** What the bar does is make sure that **when the hold lifts, the first ticket out of the door
cannot be thrown back.**

**WHAT THE HOLD BLOCKS TODAY, CONCRETELY, so a resuming session does not rediscover it:** the **five
prepared Report Suite defects** stay prepared and unfiled, and any case sitting on `AUTOMATION: HOLD`
**only because an expect-fail marker needs a ticket number that does not yet exist** stays on `HOLD`
— each becomes `READY - EXPECT FAIL` with one edit once a ticket exists. Register row **H1**.

**⏳ THE HOLD PERSISTS THROUGH AND BEYOND BUILD VERIFICATION (QA lead, 2026-08-17, verbatim):** *"Lets
hold them until we are done with Build verification ... Even then we will keep a hold on creating
tickets until I allow you to create the tickets."* **So finishing a build-verify sync does NOT lift the
ticket-creation hold** — a resuming session must not read "build verification is done" as licence to
file the held expect-fail/defect tickets. It lifts ONLY on his explicit "you may create the tickets"
order, a separate event from build verification. A Rule-69 `Not available on Build to test Yet` case
therefore needs BOTH (a) build verification proving it runnable AND (b) his ticket-creation go-ahead
before it can reach `READY - EXPECT FAIL`.

**⏳ WHEN THE HOLD LIFTS — RESUME ONE TICKET AT A TIME (Standing Rule 73, 2026-08-17).** He asked that
this be recorded **because previously-created tickets *"did bite us."*** The moment he explicitly asks
to resume: **(1)** create **ONE** ticket; **(2)** he **verifies that one ticket**; **(3)** ONLY THEN
create the next — **never a batch, never the second before the first is confirmed.** This keeps Rule
62's per-ask permission true in practice, and makes each ticket separately answerable — the whole
reason a weak ticket in a batch discredited the good ones beside it. **Every ticket must also clear the
DEFECT-TICKET QUALITY CHECKLIST before it is proposed** (skill `06`, the mandatory gate; Standing Rules
52/73): Story Defect of the related story · proven not a duplicate · runnable and the easiest possible
for a **non-technical PO** to reproduce · relevant annotated screenshots · expected behaviour then, on
a new line, its source · the expected behaviour **word-by-word from the source in quotation marks** (no
quotable document → no ticket) · concise. **A ticket that fails any item is NOT ready.**

### 11.2 Expected behaviour comes from the DOCUMENTS, never the build (Standing Rules 57/58)

**The sources are (a)–(g) and the list is OPEN-ENDED by his instruction:**
**(a)** the PRD / Confluence specification · **(b)** the epic's stories (description, acceptance
criteria, comments) · **(c)** the PO's verified answers · **(d)** the **DESIGN** — a Claude design or
prototype, a Figma design, **or the technical design he shares** · **(e)** **Figma** · **(f)** a
shared **`.md` file** (handover, design review) · **(g)** any newer **written statement** shared with
us, including a message or channel post. **A new document type does not need a rule amendment before
it counts.**

**THE BUILD IS NOT ON THE LIST.** From the build we take exactly two things: **the exact on-screen
labels** and **the pass/fail verdict**. Nothing else.

- **If the build differs from the documented expectation, the case KEEPS the documented expectation**
  and becomes a deviation with a ticket. **Never the reverse.**
- **A CLOSED ticket is not a spec change.** Closing as *accepted* / *obsolete* / *not reproducible* is
  triage about whether to **fix** — the expect-fail marker carries that qualification instead.
- **The one narrow exception:** where **our own** case asserted something **no source supports**, the
  repair is **REMOVAL or scope-conditional wording — never substitution of observed behaviour**.
- **Where no source speaks at all**, assert only what a source supports and **raise the gap as a PO
  question**. Filling it in from the build **HIDES the gap**, and that is the deeper harm.
- **Standing Rule 58: an AMBIGUOUS source is never resolved by looking at the build.** The ambiguity
  goes back to the PO and the cases are **HELD with the open question cited on them**. **Reaching for
  the build to break a tie is how build behaviour becomes expected behaviour without anyone deciding
  to do it** — and the edit then looks sourced, so it survives every later review.
- **The quote-back gate:** an ingest pass **may not produce a case edit whose new expected result
  cannot be QUOTED BACK to the source text**. If it cannot be quoted, **the edit is invalid** — not
  "weakly sourced", invalid.

**🔑 THE TECHNICAL DESIGN'S STANDING — ANSWERED AND CLOSED BY THE QA LEAD ON 2026-08-12. DO NOT
RE-ASK IT.** For a week this sat as an open question (*"does a technical design carry PRD-level
authority, or does Rule 30's 'informs but never overrules' still hold?"*). **He answered it,
verbatim:**

> *"Technical design is the authority but if that contradicts with specs/tickets/answer sheet/claude
> design/figma (because they are also the authority with the rule that the latest entry for that
> question wins) I would suggest to consider the specs/tickets/answer sheet/claude design/figma (with
> the rule that the latest entry for that question wins) as the authority for the test cases but let
> me know where it contradicts with the tech design."*

**THREE THINGS FOLLOW, AND THE THIRD IS THE ONE THAT GETS DROPPED:**
1. **ON A CONTRADICTION, THE OTHER FIVE WIN** — spec, ticket, answer sheet, Claude design, Figma —
   with **latest-wins applying among them** (Rule 32).
2. **WHERE NOTHING CONTRADICTS IT, THE TECHNICAL DESIGN SOURCES A CASE ON ITS OWN.** *"Informs but
   never overrules"* is a rule about **conflict**, not about weight in isolation — so a case resting
   on the technical design while every other document is **silent** is **properly sourced** and is
   **NOT a Rule-64 deletion candidate**. **Eleven cases held on the old open question were released
   by this ruling** (list: `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md` §3).
3. **🛑 EVERY CONTRADICTION IS REPORTED TO HIM — his closing clause is an INSTRUCTION, not a
   courtesy:** *"but let me know where it contradicts with the tech design."* **Applying the
   precedence order silently satisfies half the ruling and breaches the other half.** Each one is
   named to him and logged in the OUTSTANDING-ITEMS REGISTER (Rule 36).

**⚠️ SUPERSEDED WORDING, KEPT VISIBLE AND DATED (the Rules 31/52/53 pattern).** From 2026-08-06 until
this ruling, this set and the workspace memory carried it as **OPEN**, with the instruction *"Do not
answer it for him — until he does, a case that would turn on the difference is HELD."* **That is no
longer in force.** It is kept here rather than deleted because **a silently-erased open question is
how a session re-asks something a source has already answered** — the exact embarrassment this
workspace has had before.

**The scar: 748 cases.** On 2026-08-05 the QA lead found cases asserting build behaviour as expected
behaviour, wrote *"I am shocked to see that how come you considered the Build behavior as the expected
behavior?"*, and ordered a four-way audit of all 748 cases across three projects.

**The audit diagnostic, and it is the hardest failure to spot:** a case whose **steps were correctly
VIU'd** while its **expected result was quietly changed in the same edit** looks **freshly
maintained** and its provenance line looks current. **Diff the expected result against its CITED
SOURCE, never against how recently the case was touched.**

### 11.3 Latest authoritative source wins — but date the RULE, not the PAGE (Standing Rules 31/32)

Where sources disagree, **the most recent authoritative product source wins**, with source + date
recorded on the case. **Duplication across two agreeing sources raises confidence.** Engineering docs
**inform but never overrule** product truth. Where recency **cannot be established, or the newest
source does not make sense, ASK the PO** — never pick a side.

**⚠️ A PAGE'S VERSION NUMBER SAYS NOTHING ABOUT A REQUIREMENT'S AGE.** A spec republished yesterday
can carry a requirement untouched for five months. **To date a requirement, diff THAT REQUIREMENT'S
OWN TEXT across versions** — one extra fetch per version.

**The scar:** two Filters cases (C29609, C29610) were flipped off a PO ruling onto spec text, reasoning
*"the specification is the newer authoritative source"* — measured from the **page's** date. Fetched
from **ten spec versions**, the rule was **byte-identical in all ten, unchanged since 2026-05-14 — two
and a half months BEFORE the answer.** Latest-wins pointed the other way. **And the same pass silently
reversed a recorded QA-lead ruling, deleting the very `refs` entry that named it.**

**⇒ THE CHECK THAT CATCHES IT: before overriding any case, read what the case's OWN `refs` credits. If
a ruling is named there, it may not be dropped without citing it and saying why.**

### 11.4 A blocker blocks only what it ACTUALLY blocks (Standing Rule 68)

**"Blocked" is not a property of a case — it is a property of a QUESTION about that case**, and a case
usually raises several. A missing PO answer blocks the **VERDICT**, not the **RUNNABILITY**. A missing
permission blocks **one step**, not the whole case. A missing ticket number blocks the **MARKER**, not
the walk. **The tell that this was skipped: a blocked item whose reason is a person's name.**

**Six requirements, all checkable:**
1. **Name what the blocker actually blocks** — decompose the work.
2. **Prove it real AND TOTAL** — *"we could not see a way"* is an assumption; *"we tried A, B and C
   and here is what each returned"* is a measurement.
3. **Check it is not self-serviceable** (§7.2) before writing the word "blocked".
4. **A cost is a scheduling decision, not a wall** (§7.3).
5. **State the residual explicitly**, in two lines: ***"Blocked for X. Still possible under it: Y.
   Genuinely impossible until X clears: Z."*** **A blocked item that never names what could still be
   done is not a report, it is an excuse.**
6. **Escalate only what is truly his** — and then with Rule 48's five fields and what we already tried.

**The scar:** across the Filters work of 12 August, **23 cases were reported as remaining and 14
classified "waiting on Branko" and treated as untouchable. They were not** — the next pass walked all
14 surfaces. **Roughly 60% of a reported remainder was self-inflicted.** Claim:
`build/filters/finish4-2026-08-12/COMPLETION-REPORT.md` §7, groups (a) **10 cases** — C38882, C38904,
C38905, C38906, C38907, C38908, C38909, C38910, C38911, C43562 — and (b) **4 cases** — C29559,
C29609, C29610, C29612. Correction: commits `e882d1c6` (the Status-chip four) and `b3e3aeb6` (all 14
Parts/Reports surfaces). **HONEST SCOPE: those commits prove the surfaces were WALKED; they do not
claim the 14 are closed** — only that they were **never unwalkable**, which is the whole point.

**AND IT IS A PATTERN, NOT AN INCIDENT — three of the same shape in one day. One reads as bad luck;
three read as a habit.**
- **(ii) A COST TREATED AS A WALL.** **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581)**
  and **[C29588](https://shopview.testrail.io/index.php?/cases/view/29588)** were held because they
  need a **staff record deactivated**, which **destroys every holder's session**. **The destruction is
  TRUE; the conclusion did not follow** — it is a **SEQUENCING problem** (requirement 4). The cost was
  being **avoided rather than scheduled**.
- **(iii) AN ASK THAT SHOULD NEVER HAVE REACHED HIM.** *"Three role assignments"* was escalated as
  what would unblock ten Schedule cases, when **Rules 5/14/26 already authorise doing it ourselves**.
  **The next pass attempted it, and that is the instructive part** — it turned a vague ask into a
  precise one: *a role-definition edit invalidates every holder's session ONE WAY and does not come
  back when the permissions are restored, so create the users, permission them, and only THEN sign in
  and mint cookies — configure first, mint second.*
- **⚠️ AND THAT ATTEMPT COST THE TECHNICIAN SESSION — requirement (4) failing in the OTHER direction.**
  Attempting it was **right**; doing it **before** everything else needing that session was finished
  was **wrong**. **So (3) and (4) are not in tension: clear it yourself, AND schedule the destructive
  part last.** Instance (ii) breached (4) by **never doing it**; instance (iii) by **doing it first**.

**Why it costs more than it looks:** a falsely-blocked case **looks like someone else's problem and
stops being worked**, then **migrates** — into a "what is left" row, into the outstanding register,
into an ask forwarded to a PO — **gathering authority at every hop while nobody re-tests the premise.**

### 11.5 The precedence order (Standing Rule 33)

**(a)** the PO's product ruling → **(b)** the QA lead's ruling → **(c)** our own live-observed,
evidence-backed findings → **(d)** a reviewer's or another QA's spec-reading claims. Within a tier,
the most recent authoritative source wins.

**A review is an INPUT, evaluated claim by claim — never an authority that reverses a ruling, and
never dismissed either. Judge the claim, not the claimant.** Where a review claim is **correct, adopt
it and say so plainly.** Where it contradicts a recorded ruling, **the ruling stands** and the review
is noted as the trigger that surfaced the inconsistency.

**POs by project:** **Branko Cicovic** = Filters, Schedule, Global Search · **Chris Ward** = Report
Suite, Fees & Discounts · **Milos** = Simple Flow. **Never mix attributions.**

### 11.6 🛑 SURFACE A CONFLICT BEFORE ACTING (Standing Rule 63)

His directive, verbatim: *"If I say something that contradicts with you r rules, please do tell me
what I am saying VS what the rule and and ask me to tell you what to follow."*

When his instruction **conflicts with a recorded rule**, **STOP and state three things**: **(a)** what
he instructed, **quoted verbatim** · **(b)** what the rule requires, **quoted, with its number** ·
**(c)** an explicit ask — **which should we follow?**

**NEITHER SILENT PATH IS AVAILABLE.** We may not silently follow the new instruction, and we may not
silently keep following the old rule. **BEFORE the work, not after** — discovering the conflict
mid-pass and mentioning it in the closing summary is **not compliance**: by then the work is done one
way and the summary merely reports a decision he was never given.

**Distinguish a conflict from a TIGHTENING or a LAYERING.** Neither needs escalation — both are simply
recorded. **Escalating what does not conflict is its own failure**: it trains him to wave escalations
through, which costs us the real ones.

**Where he confirms:** his ruling becomes the rule, the **superseded text is kept visible and dated,
never deleted**, his ruling is **cited as the authority**, and the amendment **says what it does NOT
touch**. **Where he declines:** the rule stands and the instruction is recorded as
considered-and-not-adopted.

**He has endorsed the practice by name**, verbatim: ***"Good catch, be like this always."*** **The cost
of a needless check is one sentence; the cost of a silent assumption is a ticket he never approved.**

### 11.7 A ruling is a SOURCE, and sources get cited (Standing Rule 48)

**Never write "waiting on you" or "frozen by your ruling" bare.** Any item blocked on the QA lead
carries **five fields**: **(1)** which ruling, **quoted verbatim** · **(2)** when he gave it and what
question it answered · **(3)** what it blocks, concretely, with **C-ids and links** · **(4)** why it
was reasonable, **or what has changed since** · **(5)** the single thing that would unblock it, and
from whom.

**A blocked item with no cited ruling is indistinguishable from us having forgotten to do the work.**

### 11.8 "Make the cases CURRENT" means the WHOLE case, not a reference bump (Standing Rules 31/41, added 2026-08-17)

**QA lead, verbatim: *"Not just the references should be correct the test cases should be current
too."*** When he asks for cases to be made **current** to updated sources, that means the **ENTIRE
case** — expected behaviour, on-screen labels, steps, preconditions **AND** the references — must
reflect the latest sources (§11.2/§11.3), **not merely bumping the `refs` or the version pin.** **A
reference-only update is NOT "making the case current" and must never be reported as such.** This is
the flip side of Rule 41 (touch a case → re-verify the whole case): re-pinning `refs` obliges the same
whole-case re-verification as any other edit, and the Rule-54 provenance line is re-stamped in the same
pass (§14). *Context: on 2026-08-17 the QA lead corrected a pass that had treated a currency update as
a reference/version-pin update.*

### 11.9 🛑 PROPOSE A SKILL / RULE CHANGE BEFORE RECORDING IT (Standing Rule 72, added 2026-08-17/18)

**QA lead, verbatim:** *"make/update the rules and keep on updating the Skills ... updating the skills
on what we decide as the correct way forward as an ongoing process ... Make sure that you do not make
your skills bad or do not learn the wrong process, rather ask me before blindly adding anything to the
skills."*

**THE RULE:** improving the skills and rules is an **ongoing process** — **but every new or changed
rule/skill is PROPOSED to the QA lead for approval BEFORE it is written into `build/skills/*` or
`CLAUDE.md`.** Nothing is added **autonomously or blindly.** **A bad rule, once recorded, propagates to
every future cold session that trusts it**, so the cost of a wrong learning is far higher than the cost
of asking.

- **You MAY draft the proposed wording, and you MAY record a change he has already approved** (this
  section itself records seven he approved item by item with *"Add"*). Where he has ruled, record it
  faithfully and keep any superseded wording visible and dated (§16-style). **Where he has not ruled,
  draft and ASK — do not write.**
- **Distinguish this from §11.6 (Rule 63):** §11.6 handles his instruction **conflicting** with an
  existing rule; **this handles the routine act of changing the rulebook itself** — even a
  non-conflicting improvement is proposed before it lands.

---

# 12 · READER-FACING STANDARDS

- **Plain, layman English (Rules 7/9).** Assume the reader is not technical at all. No case IDs, spec
  anchors, HTTP terms, endpoint names, enum names, bug codes — **and never the word "VIU"** — in
  anything a PO or a manual tester reads.
- **Build-accurate wording (Rule 9).** Every label, button, screen and field name is **exactly** as it
  appears in the build — taken from the build, never invented, paraphrased or guessed. **If a term
  cannot be confirmed, flag it rather than invent it.**
- **Always give the C-id and the link (Rule 8).** Anywhere a case is named by an internal ID
  (`FLT-…`, `SCH-…`), pair it with the TestRail Case ID and
  `https://shopview.testrail.io/index.php?/cases/view/<id>` — **in chat replies and summaries as much
  as in files.** A case not yet in TestRail is stated as *"new, no C-ID yet"*.
- **Titles ≤ ~80 characters** so they display in full on the TestRail case page.
- **Mirror the established format 1:1 (Rule 16).** Before producing any deliverable, **find the
  canonical prior example** and match its columns, order, naming and location exactly. Do not invent
  a layout.
- **Human-readable filenames (Rule 19).** Spell names out in full — never cryptic abbreviations
  (`sbc`, `pv`, `tu`), internal codes or opaque slugs. Include the deliverable type and, where dated,
  the date.
- **Reuse recorded recipes; never re-derive (Rule 27).** Read `build/APP-ACTIONS-PLAYBOOK.md` before
  any environment action, and **append any new proven recipe immediately, in the same session** —
  success-proven knowledge only, never dead ends. **The books ARE the channel between parallel
  sessions; there is no live message bus.**
- **Every DEVIATION / Failed / Blocked cell carries a plain "What needs to be done"** a
  non-technical QA can act on. Never a bare status.
- **API-content cases go in a section whose title includes "API" (Rule 4).**
- **Give updates in extremely simple words** under plain headings (*"What I did / What needs to be
  done"*), nothing important omitted.
- **No emojis in prose to the user.**

---

# 13 · EVERY DELIVERABLE ENDS WITH "OUTSTANDING — what I need from you"

**Standing Rule 36. If nothing is outstanding, SAY SO explicitly — never omit the section**, so the
reader can tell *"clear"* from *"we forgot to look"*.

**Sweep all six categories every time** (walk all six; do not stop at the first with items):
1. **Missing sources** — spec not shared or stale, no epic, designs missing or a fetch queue open, no
   tech plan.
2. **Unanswered questions** to a PO or dev — name the sheet, the question number, who owes it, and
   **how long it has been outstanding**.
3. **Missing go-aheads / authorisations** — TestRail pushes, retirements, merges, deletions, run syncs.
4. **Access / credentials** — fresh cookies, Atlassian access, a Figma token, a QA branch.
5. **Decisions deferred or HELD.**
6. **Things another team owes** — a spec correction, a dev fix, a missing ticket key.

**Each item states four things:** *what is missing* · *who owes it* · **what it BLOCKS** (the concrete
consequence, not a vague "needed for completeness") · *since when*. **Items blocked on the QA lead
himself carry Rule 48's five fields** (§11.7).

**Update `build/OUTSTANDING-ITEMS-REGISTER.md` in the same turn** an item is raised or cleared. A
cleared item **moves to "Recently cleared" with the date and how it was satisfied** — never quietly
dropped, so nothing gets re-asked. *(We have already had that embarrassment: re-asking a question a
source had answered.)*

### 13.1 🔑 COMMUNICATE CLEARLY: ACTION-FIRST, PLAIN, TABLE-FORM (Standing Rule 70, added 2026-08-17)

**QA lead, verbatim, two messages:** *"communicate with me in clear things for me to do like what I
exactly need to do and help me understand what I really need to do and what are you talking about and
ideally share things with me in the form of a table."* / *"Yes make it a rule to always communicate
with me in similar mannaers."*

Every status update, report, question set and outstanding-items list is written as **CLEAR,
ACTIONABLE communication**, not a description of state he then has to decode:
1. **Say EXACTLY what he needs to DO** for each item — a concrete action (*"reply 'sync run 357'"*,
   *"say yes to file these 5 defects"*), **never just "pending" / "awaiting your decision"** (same bar
   as Rule 48).
2. **Explain in plain words what each item IS** before asking anything — never assume he knows the
   term/case/ticket/jargon (Rule 7). The C-id + link still travel with it (Rule 8), but the plain
   explanation comes first.
3. **Present as a TABLE** whenever there is more than one item — columns like **# · What it is (plain)
   · What YOU do · Why it matters / what it affects · Priority**. A wall of prose listing several asks
   is non-compliant.
4. **Separate "needs your decision/action" from "informational / tidy"** so he sees at a glance what
   actually requires him.

This **strengthens** Rule 7 and the simple-format conventions: Rule 7 governs the WORDS; Rule 70
governs the STRUCTURE. **The OUTSTANDING list above is the prime place this table form applies.**
**Rationale, 2026-08-17:** he received a report that said *"13 items waiting on you"* without spelling
out what each was or what to do — a list of blockers he cannot act on is homework, not help.

---

# 14 · THE PROVENANCE LINE — AND THE READ-DATE EVERY SOURCE NOW CARRIES

**Standing Rule 54, amended 2026-08-11.** Every case ends its Expected Results with a plain
provenance statement, after a separator line, in **TWO SENTENCES THAT ARE NEVER MERGED**. Merging them
is the exact error that took 748 cases to undo.

**SENTENCE 1 — THE SOURCE OF THE EXPECTATION. MANDATORY. NAMES ONLY DOCUMENTS.** The specification
with its **version** and the requirement anchor, and/or the epic and/or owning story, and/or the PO's
answer with its **file link**, and/or the design or Figma. **THE BUILD IS NEVER NAMED HERE — not as a
source, not as corroboration, not in passing.**

**SENTENCE 2 — THE RECORD OF CHECKING. OPTIONAL. NAMES THE BUILD ONLY AS WHAT THE CASE WAS CHECKED
AGAINST.** *"Last checked against build v3.5-be42149 on 8/5/2026."* Use **neutral checking language**;
**"as per the build tested on …" is BARRED.** Not yet checked against any build ⇒ **omit sentence 2**,
or say plainly that it has not been checked. **A case that FAILS on the build must not say "passed"
or "verified"** — sentence 2 records only that the check happened.

### 14.1 🔑 EVERY CITED SOURCE ALSO CARRIES THE DATE WE READ IT (added 2026-08-11)

**QA lead, verbatim, his typing preserved:**

> *"every expected behavior as I mentioned before should have a reference in the test cases … that
> must tell the Manual QA guy or anyone who is auditing those test cases that these are the sources of
> the expected behavior, make sure to mention the date of the source when that source of truth was
> taken from each source, so that in future if someone changes the source of truth I can guard myself
> telling that the refrence taken from the source of truth was from the state of that source which was
> at this certain date."*

**HIS PURPOSE IS WHAT MAKES THE DATE LOAD-BEARING: THE READ-DATE IS EVIDENTIARY.** A version number
says what the source was **called**; **the read-date says WHEN WE LOOKED**. So when a source later
moves, he can show the reference was taken from it **as it stood on a stated date** — and the case
reads as **a record of a real reading** rather than a claim that ages silently.

**THE SHAPE:** *"This is the expected behaviour as per epic SV-8685 and the Schedule specification
version 27, section 5.3, read on 11 August 2026."*

**FOUR THINGS THAT ARE EASY TO GET WRONG:**
1. **WHERE A CASE CITES MORE THAN ONE SOURCE, EACH CARRIES ITS OWN DATE.** A spec and a PO answer are
   **read at different times and move independently**, so one shared date would misstate at least one.
2. **THE DATE IS THE DATE *WE READ THAT SOURCE*, NOT TODAY'S DATE. NEVER back-fill a read-date onto a
   case whose source was not actually re-read in that pass.** That is a **fabricated observation**
   (Rule 12) and **it defeats the entire purpose — a date nobody stood behind protects nobody.**
   Where a pass re-reads the spec but not the epic, **only the spec's date moves.**
3. **THE READ-DATE DOES NOT ATTACH TO THE BUILD.** Sentence 2 already carries its own date, and
   merging the two is the error this rule spent 2026-08-05 undoing.
4. **A READ-DATE PROVES WHEN WE LOOKED, NEVER HOW OLD THE REQUIREMENT IS** (§11.3, trap (c)).

**⏳ OUTSTANDING AND HONEST: THE EXISTING SUITES DO NOT CARRY READ-DATES.** Every case stamped before
2026-08-11 names its sources **without one**, so **a sweep is owed across all projects and it is NOT
DONE.** It is logged in `build/OUTSTANDING-ITEMS-REGISTER.md`, and **until it runs, no pass may
describe any suite as compliant with this amendment.**

**✅ CORRECTED 2026-08-13 (cold-run defect D7) — the paragraph above is STALE for two of the three
suites and is kept dated rather than deleted.** A live census (two independent reads, 05:58 and
07:44 UTC) found **Filters 115/115 and Schedule 176/176 DO carry read-dates** ("read on 11/12 August
2026") together with their spec pins — the sweep evidently ran for those two after the paragraph was
written. **Report Suite was NOT measured by that census**, so for Report Suite the claim above stands
until someone measures it. Evidence: `build/reports-2026-08-13/live-derivation.json`.

### 14.2 What sentence 2 records (clarified 2026-08-12)

Sentence 2 records the check of **the whole build-facing layer** — the preconditions, the steps, the
navigation path **and** the labels — **not the labels alone.** It is therefore the per-case record
that the **five-check runnability test** was run on that build, which is what makes an honest N-of-M
split derivable from the cases themselves rather than from memory.
**🛑 Sentence 1 is unchanged and names documents only.** The licence to correct steps from the build
**does not put the build into sentence 1, in any form, at any strength.**

### 14.3 Mechanics that keep it maintainable

The **date is a single variable** in the generator and the **spec versions a per-project map**; the
stamper is **IDEMPOTENT — it REPLACES an existing provenance line, never appends a second**.
**Re-stamping is a REQUIRED step of every verification, reconciliation and spec-delta pass, not an
optional tidy** — and **a stale date, a stale spec version or a stale epic reference is ITSELF A
FINDING**, reported as one.

---

# 15 · THE `AUTOMATION:` MARKER — three forms, and one precondition that is new

**The marker is the automation engineer's machine-findable string: exactly one per case, a fixed
literal, never reworded, never abbreviated.** It goes at the **VERY END of Expected Results, AFTER
the Rule-54 provenance line, with a blank line before and a line break after** (the QA lead's exact
placement). Three forms only:

`AUTOMATION: READY` · `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` · `AUTOMATION: HOLD - <reason>`

**🆕 A FOURTH FORM, added 2026-08-17 (Standing Rule 69):**
`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`

- **When to use it:** the case's **steps/preconditions cannot yet be verified on the build** — the
  feature is not present, the build is not ready, or build verification was **deliberately deferred**
  for the pass. QA lead, verbatim (2026-08-17): *"instead of putting the marker 'Automation ready' you
  will put 'Not available on Build to test Yet - with the date when you last checked the build for that
  test case'. However do not forget to put the source for the expected behavior with all the references
  from specs and stories as you always do. Later we will run another sync to build verify … Then upon
  success we will replace that statement with 'Automation Ready' marker."*
- **The documented source is STILL fully cited** — sentence 1 of the Rule-54 provenance line is written
  in full with each source's read-date; only **sentence 2** (the build "last checked against …" record)
  is absent, which is exactly what this marker announces.
- **It is TRANSITIONAL, and dated so its staleness shows.** A later sync lifts it to `READY`, or to
  `READY - EXPECT FAIL (SV-xxxx)` on live-backed ticketed failure (§15.1). **It is EXCLUDED from any
  "ready to automate" figure**, same as `HOLD`.
- **Do NOT conflate it with `HOLD`.** `HOLD` is for a genuinely unobtainable thing (a physical device,
  an external account we do not have); this marker is for something the build **will** run once it
  ships/stabilises. **Do NOT conflate it with `READY` either** — plain `READY` asserts the steps have
  been confirmed runnable; this marker says they have not been (Rule 12).
- **⏳ IT STAYS UNTIL A LATER BUILD-VERIFY SYNC PROVES THE STEPS + PRECONDITIONS RUN (QA lead,
  2026-08-17, point 7).** It is not cleared by re-authoring, by a spec/design update, or by "final" —
  only by a sync that opens the app and confirms the case is runnable, at which point it becomes
  `READY` (or `READY - EXPECT FAIL (SV-xxxx)` on live-backed ticketed failure). **AND completing that
  sync does NOT permit filing the ticket** — the Jira creation hold persists beyond build verification
  (§11.1).
- **🛑 IT SUBSTITUTES FOR A PLAIN `AUTOMATION: READY` MARKER ONLY (Standing Rule 69, dated addition
  2026-08-17/18).** The fourth form may replace a plain `AUTOMATION: READY` marker **and nothing else.**
  **NEVER overwrite an existing `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or `AUTOMATION: HOLD -
  <reason>` marker with it** — those carry ticket / blocker references that must be preserved. So, on a
  touched case whose steps/preconditions cannot yet be build-verified: **plain-READY → the Rule-69
  marker; EXPECT-FAIL or HOLD → keep its existing marker.**
- **🔑 THE MARKER KEYS ON TESTABLE CONTENT, NOT ON A METADATA REFRESH (Standing Rule 69, dated
  refinement 2026-08-18, QA-lead confirmed).** Add or change a marker ONLY for a **newly authored** case
  or one whose **testable content** — title, preconditions, steps of reproduction, or the
  expected-behaviour BODY — changed from a spec/source change. **A metadata-only update MUST NOT change
  the marker**: refreshing the provenance line (spec version, read-dates, references), the `refs` field,
  or the marker line while the testable content is BYTE-IDENTICAL **keeps the existing marker** — a
  plain-`READY` case stays `READY` (build-independent, §16 / Rule 60), never flipped to `Not available on
  Build to test Yet`. **The broader principle:** distinguish a CONTENT change from a metadata refresh —
  content-level decisions (the marker, EXPECT-FAIL, deviation status, re-verification) key on
  testable-content changes; provenance / refs / version / date refreshes are **bookkeeping** and never
  trigger them. *The scar: the 2026-08-18 currency passes wrongly stamped `Not available on Build to test
  Yet` onto ~570 reference-only cases (Schedule ~142, Report Suite ~387, Filters ~41) whose testable
  content did not change, treating a below-the-line provenance refresh as a case change.*
- **🛑 THE DEFERRED MARKER NEVER OVERWRITES EXPECT-FAIL/HOLD, AND A MID-EFFORT POLICY MUST BE SWEPT
  RETROACTIVELY (Standing Rule 69, dated addition 2026-08-18, QA-lead confirmed).** Restated because it
  is the error we actually made: the `Not available on Build to test Yet` marker (like the plain-`READY`
  substitution rule above) **NEVER overwrites an existing `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or
  `AUTOMATION: HOLD - <reason>` marker** — those carry ticket/blocker references and are PRESERVED; it
  substitutes for a **plain `AUTOMATION: READY`** marker **ONLY**. **AND when a rule or policy is
  established MID-EFFORT, RETROACTIVELY SWEEP the earlier passes of that SAME effort for compliance** —
  never assume the earlier batches followed a rule that did not exist when they ran; if they violated the
  newly-set policy, fix them. *The scar: the marker-substitution policy was set DURING the Report Suite
  currency pass, but the EARLIER Fabian authoring passes had already overwritten **47 EXPECT-FAIL/HOLD
  markers** with the deferred marker before the policy existed, and nobody swept back — it was only found
  later by a live audit (§2.11 / Rule 50/G).* Ties to Rules 61 (marker family), 69 (this note) and
  51/52 (the ticket refs those markers carry).

- **Plain `READY` asserts AUTOMATABLE, not currently passing** — it is **build-independent** and
  survives a redeploy untouched.
- **A TOOL FLAG NEVER JUSTIFIES `HOLD`.** Devtools, DOM/network inspection, reading a PDF or CSV,
  seeded data states, theme toggles and viewport sizes are **all automatable**. Only a **genuinely
  unobtainable thing** — a real physical device, an external account we do not have — justifies it.
- **NOT-BUILT cases are EXCLUDED from any "ready to automate" figure.** They are not a readiness
  shortfall, they are absent product.

### 15.1 🔑 AN EXPECT-FAIL MARKER NEEDS LIVE BACKING. NO BACKING, NO MARKER (added 2026-08-11)

**QA lead, verbatim, his typing preserved:** *"WHen there is nothing to back 'Expect fail' then not
set that marker. And let the manual QA tester simply discover whether this test fails or passes and
mark the test case accordingly in the tesrail"*

**THE PRECONDITION:** `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` may be set **ONLY where a LIVE
source actually backs it** — an **OPEN ticket describing the failure**, or an equivalent documented
basis. **Where the backing is absent, stale, or was never established, THE MARKER COMES OFF** and the
case carries plain `AUTOMATION: READY`. **The manual tester then DISCOVERS whether it passes or fails
and records that. WE DO NOT PREDICT ON THE TESTER'S BEHALF.**

**A CLOSED OR OBSOLETE TICKET DOES NOT BACK THE MARKER, and this is concrete rather than theoretical:
31 of the 33 tickets behind the Report Suite's expect-fail cases are CLOSED**, several confirmed fixed
on 10 August — so those markers were **telling a tester to ignore a failure that may no longer
exist**, the precise inverse of what the marker is for.

**IT IS NOT A LICENCE TO GUESS THE OTHER WAY.** An unbacked expect-fail **asserts a build fact nobody
observed** (Rule 12), and a marker written from what the build merely happens to do is
**build-derived expectation through a side door** (Rule 57). **Removing an unbacked marker does not
soften the case — it RESTORES the case's ability to fail**, which is the whole point of holding an
expectation.

**WORKED EXAMPLE, AND IT CUTS AGAINST OUR OWN WORK:** the six Schedule Panel-collapse cases
**C43582–C43587** carried `AUTOMATION: HOLD - the panel collapse control is not in the build`. That is
**wrong on both counts** — the control's **absence is perfectly observable**, so it is not a genuine
`HOLD`, and **no ticket backs an expect-fail** either. **They should carry plain `AUTOMATION: READY`**,
and the tester runs them, fails them, and records it.

### 15.1a 🛑 THE OPPOSITE ERROR: PUTTING A **HOLD** ON A CASE THAT CAN BE RUN DISARMS IT

**§15.1 says an unbacked `EXPECT FAIL` must come off. This says the mirror image, and it is the error
we actually made more often.** **`AUTOMATION: HOLD` tells the tester to mark the case BLOCKED — so a
hold on a runnable case removes its ability to fail exactly as surely as a build-derived expectation
does.** The difference is that it looks like caution rather than like a mistake.

**⇒ THE DECISION IS ABOUT THE STEPS, NOT ABOUT HOW BADLY THE CASE LOOKS LIKE FAILING:**

| The situation | Marker | Why |
|---|---|---|
| **The tester cannot execute the steps** — the route, screen or precondition genuinely does not exist | **`HOLD - <plain reason>`** + a *"mark BLOCKED, not failed"* line | They would be stranded |
| **The tester CAN execute the steps; the build simply fails the requirement, and a LIVE ticket describes it** | **`READY - EXPECT FAIL (SV-xxxx)`** + the symptom and three outcomes (§15.2) | It stays armed: **if the fix ships, the case passes and the tester tells us — which a HOLD can never do** |
| **The tester CAN execute the steps; the build fails the requirement; NO live ticket exists** | **plain `READY`** — and **change nothing else** | Under Rule 57 the case keeps its documented expectation and **the tester fails it, which is correct**. An unbacked expect-fail marker is barred (§15.1); a hold would disarm it |
| **MOST steps run; ONE cannot be performed** | **plain `READY`** + a verdict-free runnability note naming the one step and saying *"mark that step blocked and record the rest normally"* | A hold would throw away every result the runnable steps produce |

**WORKED EXAMPLES, ALL LIVE, ALL THE DAY BEFORE A RELEASE:**
- **[C30107](https://shopview.testrail.io/index.php?/cases/view/30107)** had a `HOLD` prepared for it.
  It was given **`READY - EXPECT FAIL (SV-9074)`** instead — the tester *can* start it, step 1 shows
  the fault immediately, and the ticket was live. **A hold would have sent a two-day-old requirement
  gap on a report handed off as FINAL through the manual run unreported.**
- **[C38913](https://shopview.testrail.io/index.php?/cases/view/38913)** kept plain **`READY`**: steps
  1–7 and 9 all run, only step 8 cannot be performed, and **`SV-8954` is OBSOLETE so there is nothing
  to hang an expect-fail on.** It gained a runnability note that deliberately **does not tell the
  tester what to conclude** about steps 1–7 — that is the tester's call.
- **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** was **deliberately not edited
  at all**: the build fails `S8-R4`/`S8-R5`, no ticket exists, so *"the tester will fail it and be
  right to"* — **adding a hold would have disarmed a case that is working.**

**⚠️ A HOLD WHOSE STATED REASON IS A *FILING* PROBLEM IS NOT A RUNNABILITY HOLD AT ALL.** *"…needs the
QA lead's permission before a ticket exists to point at"* describes **our** constraint, not the
tester's — and **[C38912](https://shopview.testrail.io/index.php?/cases/view/38912) may be runnable
under exactly such a hold** (flagged, not changed, because it turns on a build fact). **When the
creation hold lifts, sweep for these: each is one edit from `READY - EXPECT FAIL`.**

### 15.2 The three-outcome instruction stays, for markers that ARE properly backed

A backed expect-fail case states, in the **tester-facing** Expected Results, **the exact observable
symptom** and what to do in each of three outcomes: **(1) fails with that symptom** → mark failed,
raise nothing new · **(2) fails in a DIFFERENT way** → **a NEW problem, report it** · **(3) PASSES**
→ **the fix shipped, report it** so the ticket closes and the marker comes off.
**Outcome (3) makes the automated run itself the detector; outcome (2) stops a new defect hiding
behind an old one.** **Ticket status is NEVER read as evidence about the build.**

---

# 16 · FINALITY — the branches are **NOT** final; they are updated until release day

## 16.0 · THE CURRENT POSITION (2026-08-21) — THIS IS THE ONE TO APPLY

**⚠️ THE 2026-08-11 "the branches are FINAL" POSITION AT §16.1 BELOW IS SUPERSEDED FROM 2026-08-21.
It is kept visible and dated rather than deleted — the Rules 32/33 pattern, latest wins and the
earlier ruling stays readable — but it is NOT the position to apply, and it must not be quoted as
current.**

**QA-LEAD DIRECTIVE (2026-08-21, verbatim, his typing preserved because Rule 25 applies to his
instructions as it does to a spec):** *"The branches are continuously being updated as the adhoc
desiions are being made they it looks like they will never be final until the release day- So when we
say that our test cases are Build verified asay that with a sheck mark green and date to tell if they
were recently build verified and orange if they were build verified but the dat eis like a week old
and red if the build verified was more than 2 weeks old tell the date with that and a X croxx if the
build verification has not been done."*

**SO, PLAINLY: THE BRANCHES ARE NOT FINAL.** They are **continuously updated as ad-hoc decisions are
made**, and **they will not be final until release day.** Consequences, and they are the exact
reverse of §16.1:

- **RULES 49 AND 60 APPLY IN FULL.** Rule 60's never-final strategy is **back in force**, and Rule
  49's provisional-findings discipline with it.
- **FINDINGS ARE PROVISIONAL AGAIN.** A verdict is recorded with its build marker and stays
  **PROVISIONAL** until the branch is final — which is now expected only at release.
- **A GAP IS TREATED AS POSSIBLY-UNFINISHED, NOT AUTOMATICALLY A DEFECT.** This is the substantive
  reversal: §16.1 removed that ambiguity, and this ruling puts it back. Where a feature is absent or
  incomplete, the honest reading is *"this may not be finished yet"*, and it is written that way.
- **THE "AN OPEN QUEUE IS THE NORMAL STEADY STATE" FRAMING IS REINSTATED** — §16.1 retired it on the
  premise that finality had arrived; that premise is withdrawn. An OPEN Rule-49 queue is again the
  ordinary condition of an active project, a living work list rather than a failure. **The close
  condition is unchanged and is NOT lowered:** a queue closes only when 100 % of its rows are
  re-verified with fresh evidence, and Rule 60 may never be cited to close a queue with rows
  unverified.
- **EVERY VERIFICATION CLAIM NOW CARRIES A FRESHNESS BADGE — Standing Rule 91**, the other half of
  this same directive: **✅ ≤ 7 days · 🟠 8–14 days · 🔴 > 14 days · ❌ never build-verified**, always
  with the **date** and the **build marker** (or, for source verification, the **spec version**). **A
  bare tick is non-compliant** (Rule 12 — a claim carries its evidence). Tool:
  `build/testing-tools/verification_badge.py` (requires an explicit `--today`).
- **RULE 91 DOES NOT WEAKEN RULE 77.** Rule 77 remains the **VALIDITY** test (a check within the last
  3 builds / 3 source versions still **counts**); Rule 91 is the **VISIBILITY** layer. A case can be
  inside Rule 77's window and still show 🟠 or 🔴 — intended honesty, not a contradiction.

**⚠️ ONE NUANCE, RECORDED AS FACT AND NOT RESOLVED BEYOND HIS WORDS: HAND-OFF STATUS AND BRANCH
FINALITY ARE TWO SEPARATE DIMENSIONS.** The **2026-08-10 per-report ruling** recorded that three
Report Suite reports — **WORK IN PROGRESS · TECHNICIAN UTILIZATION · SALES BY CUSTOMER** — had been
**HANDED OFF to QA**, and the 2026-08-11 ruling then reported all six handed off. **Hand-off is a
statement about which features have reached QA; branch finality is a statement about whether the code
has stopped changing.** **Today's ruling governs BRANCH FINALITY, and it says: not final until
release day.** It says nothing about hand-off, and nothing here withdraws the hand-off record. **What
follows from that for a report handed off but on a non-final branch is NOT stated by him and is NOT
decided here** — where a case turns on the difference, it is **held and asked** (Rules 6/11/63), never
inferred.

---

## 16.1 · SUPERSEDED 2026-08-21 — the 2026-08-11 "all three branches are FINAL" position

**🛑 SUPERSEDED. KEPT FOR THE RECORD ONLY — DO NOT APPLY, DO NOT QUOTE AS CURRENT. Read §16.0 above.**
It is preserved because a silently-erased ruling is how a session re-derives a withdrawn position and
presents it confidently; the reversal itself is part of the record.

**⚠️ [AS WRITTEN 2026-08-11] THIS SUPERSEDES THE LONG-STANDING "the branches will never be declared
final" POSITION. The old wording is kept dated in `CLAUDE.md` rather than deleted; do not quote it.**
*(That sentence is itself now overtaken — the "never final" position it superseded is, in substance,
what §16.0 restores.)*

**Sequence, both rulings verbatim:** on **2026-08-11** the QA lead confirmed *"note that ALL 6 reports
have been handed off now."*, making the **Report Suite** branch final; **later the same day** he said
***"The Branches are Final now."*** — plural, immediately after — **extending finality to SCHEDULE
(`sv8685`) and FILTERS (`sv8785`) as well.**

**WHAT FINALITY CHANGES:**
- **Findings are NO LONGER PROVISIONAL pending development.** **A deviation on any of the three is a
  REAL DEFECT IN A FINISHED FEATURE** — not possibly-an-unfinished-feature. **That ambiguity is
  exactly what finality removes**, and it is why a hedge that was right last week is now **wrong and
  would understate a real finding.**
- **Rule-49 queue rows MAY CLOSE on all three**, on the **ORDINARY close condition** (the row
  re-verified with fresh evidence). **The bar is NOT lowered** — only the *"wait for the build to
  settle"* blocker is removed, and **Rule 60 may never be cited to close a queue with rows
  unverified.**
- **The "an OPEN queue is the normal steady state" framing is RETIRED** — it described a consequence
  of branches that were never declared final, and that premise is gone.

**🛑 THE CAVEAT THAT WILL OTHERWISE BE MISREAD: "FINAL" MEANS HANDED OFF / FEATURE-COMPLETE, NOT "the
code will never change."** All three still redeploy — **not least to fix the very defects we are
reporting** — so **a redeploy still invalidates the on-screen labels and the pass/fail verdict**
(Rule 60 layers 1–2) on every one of them. Read this together with the **bug-fix-deploy** amendment
(skill `03` §6.1): a **bug-fix-only** deploy does **not** make a prior pass stale, and the re-check
trigger is **a specific observed contradiction, never a changed app-version string.**

**🔴 AND THE HONEST CONSEQUENCE — FINALITY RAISED THE STAKES; IT CLOSED NOTHING OUT.** As at
2026-08-11, **433 cases were final but NOT build-verified** — **Schedule 174** · **Filters 8**
(blocked on the second non-administrator sign-in) · **Report Suite 251** (Sales By Representative 112
· Parts Velocity 71 · Inventory Value 68) — against **331 build-verified**, and **433 + 331 = 764**,
the three suites in full. *(Those figures are as recorded on that date and move; derive live before
quoting — §1.7. The arithmetic correction behind them is at §1.5a.)*

**— END OF THE SUPERSEDED 2026-08-11 POSITION. The position in force is §16.0: the branches are NOT
final until release day, findings are PROVISIONAL, a gap is possibly-unfinished, and every
verification claim carries a Rule-91 badge with its date. Note that ONE part of §16.1 survives
unchanged and is NOT superseded — the caveat that a redeploy still invalidates the on-screen labels
and the pass/fail verdict (Rule 60 layers 1–2), together with the bug-fix-deploy amendment in skill
`03` §6.1: the re-check trigger is a specific observed contradiction, never a changed app-version
string. That was true under finality and is true without it.**

---

# 17 · THE PROJECT FACT SHEET — the identifiers a cold session would otherwise have to guess

**Added 2026-08-13, because a session with no memory could not run a single skill without these**, and
they were scattered across five files or absent. **Everything here is an IDENTIFIER — stable, checkable
and safe to write down. No counts, no verdicts, no status** (those move within a single pass — §1.7 —
and belong in each `PROJECT-STATE.md`, derived live).

| | **FILTERS** | **SCHEDULE** | **REPORT SUITE** |
|---|---|---|---|
| **Epic** | `SV-8785` | `SV-8685` | `SV-8582` |
| **Product owner** | **Branko Cicovic** | **Branko Cicovic** | **Chris Ward** |
| **TestRail group** | **4110** | **4254** | **4281** |
| **Test run** (someone else's) | **352** — Ahtasham Amjad | **357** — Ayesha Khan | **359** — Nebojsa Glavinic / Viktoria Videnovic |
| **QA branch** | `sv8785.qa.shopview.com` | `sv8685.qa.shopview.com` | `sv8582.qa.shopview.com` |
| **API host** (probe THIS, §6) | `sv8785api.qa.shopview.com` | `sv8685api.qa.shopview.com` | `sv8582api.qa.shopview.com` |
| **Confluence spec page** | **572030978** | **713031682** | **six — one per report**, below |
| **Case source** | `build/filters/cases/` | `build/schedule/cases/` | `build/report-suite/cases/` |
| **Id-map · generator** | `build/filters/testrail-id-map.csv` · `gen_import.py` | `build/schedule/testrail-id-map.csv` · `gen_import.py` | `build/report-suite/testrail-id-map.csv` · `gen_import.py` |
| **Import file** | `testrail-import/filters-v1-testrail-import.csv` | `testrail-import/schedule-v1-testrail-import.csv` | `testrail-import/report-suite-v1-testrail-import.csv` (+ six per-report splits) |
| **Cold-resume doc** | `build/filters/PROJECT-STATE.md` | `build/schedule/PROJECT-STATE.md` | `build/report-suite/PROJECT-STATE.md` |

**THE SIX REPORT SUITE SPEC PAGES:** Sales By Customer **577634305** · Sales By Representative
**585629698** · Parts Velocity **620888066** · Technician Utilization **641400833** · Work In Progress
**703660034** · Inventory Value **720142338**.

- **TestRail:** project **1**, single suite **1 "Master"**, API v2 at
  `https://shopview.testrail.io/index.php?/api/v2/…` — **and the separator inside that path is `&`,
  never a second `?`** (§3.3).
- **"Local active" case count (added 2026-08-13 — cold-run defect D6):** a case body under
  `build/<project>/cases/cases-*.json` counts as ACTIVE unless its status field marks it retired —
  the convention **differs per project**: Filters uses `viu_status` beginning `"Retired"`, Schedule
  uses `status`. Check both keys.
- **TestRail CREDENTIALS (added 2026-08-13 — found missing by TWO cold drills in one morning):**
  Basic auth, and the credentials live in **`/tmp/testrail/creds.json`** (keys: `email` / `host` /
  `password` / `user`; `chmod 600`, **never committed** — the repository is public, §10). **`/tmp` is
  ephemeral: if the file is absent on a fresh container, ASK THE QA LEAD for the TestRail credentials
  by that path-name** — do not hunt the repository for them (they are not there, by design) and do
  not report TestRail as unreachable without having asked. *(Scar: the 05-drill and the 08-drill of
  2026-08-13 each had to discover this file by exploring `/tmp` — the first logged it and no fix
  landed, so the second hit it again. A logged-but-unfixed defect is §7.5's "guardrail written down
  but not read".)*
- **Confluence:** `GET /wiki/api/v2/pages/<id>` on `shopview.atlassian.net`. **Use the Confluence
  version number, never the in-body one** (§11.3 / skill `02` trap (a)).
- **We are TestRail user id 3** (Bilal Muzamil); **id 1 is Vladimir Tomovic**, the automation engineer
  (§5).
- **The three other projects** — **Global Search** (Branko, postponed) · **Fees & Discounts** (Chris
  Ward, completed) · **Simple Flow** (Milos, completed) · plus **Custom Roles** — have entries in
  `CLAUDE.md` and their own `PROJECT-STATE.md`. **Their runs (324, 325, 278, 312) are OUT OF SCOPE**
  (§4).

**🛑 THE ONE THING THIS TABLE DOES NOT TELL YOU IS WHETHER IT IS STILL TRUE.** Identifiers change less
often than counts, but *a proven-absence finding has a shelf life* — **the Filters epic was created
hours after a pass proved no epic existed.** **Confirm the epic and the spec version live at pass
start (skill `02`); this table is where to start looking, not what to cite.**

---

## APPENDIX · THE PRIMARY SOURCES BEHIND THIS FILE

Go to these rather than trusting this summary.

| Topic | Source |
|---|---|
| All standing rules, project entries, durable facts | `CLAUDE.md` |
| The incidents behind the rules, 11–12 August | `build/SESSION-LEARNINGS-2026-08-12.md` |
| Environment recipes; **§A sessions**, **§J TestRail hazards**, **§L git** | `build/APP-ACTIONS-PLAYBOOK.md` |
| The seven survival requirements + compliance checklist | `build/NO-WORK-LOSS-STRATEGY.md` |
| What we are waiting on, cross-project | `build/OUTSTANDING-ITEMS-REGISTER.md` |
| How a process doc must be written | `build/PROCESS-AUTHORING-STANDARD.md` |
| Every callable process and its trigger | `build/PROCESS-CATALOG.md` |
| Per-project cold-resume snapshots | `build/<project>/PROJECT-STATE.md` |

## BEFORE YOUR FIRST WRITE — read `build/skills/13-CROSS-SESSION-SAFETY.md`

Four sessions share one TestRail project, one branch, one staging login and one weekly
quota, and **a collision between them is silent**. Skill 13 is the operator form of
**Standing Rules 82–87**: the real secret-scan gate (`scan_secrets.py` + the
`pre-commit` hook), the lane-lock protocol in `build/LOCKS/`, the tester-readiness gate,
the "SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET" sentence, verify-from-committed-evidence,
and the case-body snapshots that make a foreign edit diffable.

---

**Rule 88 — LANE-SESSION CONTEXT DISCIPLINE:** never read `CLAUDE.md` end-to-end (grep it); never bulk-read case bodies or CSVs into context (script it to a file, read a bounded summary); batch writes in a script; long jobs use the Rule-75 detached pattern with progress in commit messages; do NOT spawn subagents for work you can do directly; stop and report at the budget tripwire.

---

## ACCESS + QUOTA — added 2026-08-21 (Standing Rules 89 & 90)

> **🔴 [`14-ACCESS-RESILIENCE.md`](14-ACCESS-RESILIENCE.md) — read it BEFORE the first access call of
> this session.** It carries **Standing Rule 89**: the PRIMARY path and FALLBACK ladder for TestRail,
> Jira/Confluence, ShopView QA/staging/production and Figma; the **mandatory session-start preflight**;
> the failure signatures (notably **ShopView `401 sso_required` = dead cookies OR a deploy — check the
> build marker first**); the **five MCP-hygiene hard rules** (above all: **never edit, delete or
> "repair" shared MCP configuration to fix a connection** — a mutated config stays corrupt for every
> future session); and the **unattended BLOCKED protocol** (write and commit `BLOCKED-<system>.md`,
> keep working on what is not blocked, never fabricate a result).
>
> **Standing Rule 90 — the weekly quota is ONE shared pool:** main/orchestrator **15 %** · each lane
> **25 %** · **10 % reserve**. **Report your spend with your work**; at **50 % of your own budget**
> compare spend against work completed and **STOP AND REPORT if spend is outpacing progress**; **never
> consume the reserve without the QA lead's say-so.** Full texts: `build/rules/RULES-61-96.md`.
