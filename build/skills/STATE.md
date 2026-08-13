# STATE — where the Skill set stands, and what is still open on it

> **Read this to resume work ON THE SKILLS THEMSELVES.** It is not a project status file — for that,
> run [`05-PROJECT-REPORT`](05-PROJECT-REPORT.md) and derive the figures live.
>
> **Last updated: 2026-08-13, by the adversarial audit** (`git log -- build/skills/`).
> **That pass made ZERO TestRail calls, ZERO Jira calls and ZERO application access.** It is a
> documentation pass, and **every factual claim it repeats is as recorded by the pass that made it**,
> inheriting that pass's caveats.

---

## 1 · WHAT EXISTS, AND WHAT EACH FILE IS FOR

| File | What it is for | Read it when |
|---|---|---|
| **[`README.md`](README.md)** | The index — trigger words, how the eight compose, which to reach for, and the **seven things that bite a cold session fastest** | first, always |
| **[`00-COMMON-CORE.md`](00-COMMON-CORE.md)** | Everything shared: the honesty bar · TestRail writes and hazards · runs · foreign cases · access · environment · session survival · git · secrets · authority · reader-facing standards · provenance and read-dates · markers · finality · **the project fact sheet (§17)** | before the skill you were called for — **always** |
| **[`01-CASE-BUILD.md`](01-CASE-BUILD.md)** | Author or extend a suite from the sources, and prove nothing was missed | *"write the cases"*, *"did we miss any?"* |
| **[`02-SOURCE-CHECK.md`](02-SOURCE-CHECK.md)** | Prove we hold today's spec, epic, designs, tech plan and PO answers | **first on every project task**, including read-only ones |
| **[`03-RUN-CHECK.md`](03-RUN-CHECK.md)** | Open the product and prove a tester could actually execute each case | *"are these runnable?"*, *"the branch was rebuilt"* |
| **[`04-TESTER-READY.md`](04-TESTER-READY.md)** | Make the suite fit to hand over; the cold read, the contradiction sweep, the skip list | *"the testers start tomorrow"* |
| **[`05-PROJECT-REPORT.md`](05-PROJECT-REPORT.md)** | The seven-column completion table, **before the next project starts** | *"where are we?"* — and as a standing gate |
| **[`06-DEFECT-PREP.md`](06-DEFECT-PREP.md)** | Build a defect that cannot be challenged, then **stop at the button** | *"is this filable?"* |
| **[`07-PO-QUESTIONS.md`](07-PO-QUESTIONS.md)** | One sheet, plain words, **sent last** | *"what do we need from Branko?"* |
| **[`08-RECOVER.md`](08-RECOVER.md)** | **NEW 2026-08-13.** Establish what a killed pass actually landed, **by content**, and finish it | *"the last pass was killed"*, *"did we lose anything?"* |
| **[`COVERAGE-MATRIX.md`](COVERAGE-MATRIX.md)** | The proof of completeness — one row per learning, with **which file carries it** and a verdict | before adding a new learning, or to challenge whether anything was missed |
| **`STATE.md`** | This file | to resume work on the skills |

---

## 2 · WHAT THE 2026-08-13 ADVERSARIAL AUDIT CHANGED

**The question it asked was deliberately harder than the coverage pass's.** Coverage asked *"did we
transfer what we know?"* — **this asked *"would a fresh session, running only this skill set, produce
work that cannot be challenged?"*** It found **13 items**, and — the part worth carrying forward —
**seven of them were never in `SESSION-LEARNINGS-2026-08-12.md` at all.** They sat in **incident
reports, forensic audits and divergence files** that no inventory had swept.

> **⇒ A COVERAGE MATRIX OVER A LIST IS ONLY AS COMPLETE AS THE LIST. The next audit of this set should
> sweep the `INCIDENT-*.md`, `DIVERGENCES.md` and forensic-audit files directly, not a summary of
> them.**

### The four substantive additions

| | What | Where | Why it matters |
|---|---|---|---|
| **1** | **The POST-WRITE ASSERTION RE-AUDIT** | `00` **§2.10** | **An audit committed before the repair does not audit the repair.** C29944 was classified LEGITIMATE by the very pass that then wrote into it an assertion **no source supports** — absent from all 27 spec versions. **Every byte-check passed**, and so would an invariant census. Carries the cheap scoped method (split `expected` into body / provenance / marker, so *"what changed"* is a measurement — **495 of 771 fell out by construction**), the four per-case checks, and the **note-paragraph** diff |
| **2** | **A `HOLD` ON A RUNNABLE CASE DISARMS IT** | `00` **§15.1a**, `03` | **`03` actively pointed the wrong way**, saying the smallest change is *"normally `AUTOMATION: HOLD`"*. A hold means *mark BLOCKED*, so on a case whose steps run it destroys the case's ability to fail — **and it looks like caution.** Now a four-row table keyed on **whether the steps run** |
| **3** | **DESTRUCTIVE PROBES** | `00` **§7.5**, `03` G9 | The **same shift destroyed twice in two days**, the second time by a worker who had not read the incident report the first one wrote. *"A guardrail written down but not read is not a guardrail."* Establish whether a confirmation exists **before** pressing the control that commits; **select by ID, never by a displayed string** |
| **4** | **THE PROJECT FACT SHEET** | `00` **§17** | A cold session **could not run a single skill** without the epic, group, run, branch, API host, spec page and case-source path — **scattered across five files or absent** |

### The rest

- **`08-RECOVER.md` written** — the missing skill. It ran **four times in two days**, at the worst
  moment, and its pieces were spread across `00` §2.5, §2.6, §8 and §9.1 for a session to assemble
  under pressure.
- **Standing Rule 63 added to all seven skill files** — *surface a conflict before acting* was in
  **none** of them; it lived only in `00` §11.6.
- **`03` §5.1 clarified** — **Rule 24 decides *"is this a defect?"* (ours), not *"did it pass?"* (the
  tester's).** Those were one sentence because Rule 24 predates the 2026-08-11 re-scoping, and as
  written it sat against `03`'s own G4.
- **`00` §4.1 hardened on the single most destructive call we make** — **a run write needs its own
  explicit permission, per ask**; **scope the executor to one run**; and **the canonical run-sync
  folder's own paginators carry the fragile URL shape of §3.3**, which is the worst possible false
  negative there, because an empty `current` list turns the union into a partial list.
- **The README's precedence line corrected** — *"`CLAUDE.md` always wins"* would **revert a ruling
  that landed in a skill first**, which Rule 32 forbids. Now: establish the date, apply latest-wins,
  fix the older file in the same turn. *(Checked: on finality, `CLAUDE.md` is current. No live
  divergence found.)*
- **`01` gained an OUTSTANDING guardrail** — it was the only skill without one.
- **`COVERAGE-MATRIX.md` §6** records all 13 with their evidence, and the inventory total is corrected
  **98 → 111** with the old box kept and dated.
- **Register:** **H1's ownership split** (the re-check is ours and needs no permission; only filing
  waits on him) and **D1 re-confirmed not started**.

---

## 3 · 🔴 WHAT IS STILL OPEN **ON THE SKILL SET ITSELF**

**Nothing below is blocked on the QA lead except where it says so.**

| # | What | Who closes it | Honest note |
|---|---|---|---|
| **S1** | **NO SKILL HAS EVER BEEN RUN COLD.** Every one was written and audited by sessions that already had the context. **The cold-start test in §2 was a SIMULATION — a reading, not a trial.** | **us**, on the next real pass | **This is the largest unknown about the set**, and it cannot be closed by more editing. **The next pass to invoke a skill should record where it had to guess**, and that record is worth more than another audit. |
| **S2** | **The 13 new items are STATED, not EXERCISED.** §2.10's re-audit, §7.5's probe discipline and §15.1a's marker table have **never been run on a live pass**. | **us** | A procedure that has not been executed may be unworkable in ways no reading finds — **the failure mode is over-cost, not error**: a step too expensive to run gets quietly skipped. **§2.10 was deliberately scoped to the diff for exactly this reason; whether that is cheap enough is untested.** |
| **S3** | **The audit swept incident and forensic files but NOT exhaustively.** It went to them because the regression list pointed there. **No census of `build/**/INCIDENT-*.md`, `DIVERGENCES.md` or the forensic audits was run**, so **there may be more of the seven's shape.** | **us** | Stated plainly rather than implied: **13 found by one pass is evidence the method finds things, not evidence there is nothing left.** |
| **S4** | **`00-COMMON-CORE.md` is now 1,435 lines.** Every addition is load-bearing and each names its scar — **but a file nobody finishes protects nobody**, which is the same failure mode as a pointer. | **the QA lead** — it is his call whether to split it | **No split was attempted**, because splitting it would break the *"a fix lands in one place"* property that is the whole design. **Recorded as a risk, not a recommendation.** |
| **S5** | ✅ **CLOSED 2026-08-13.** `build/PROCESS-CATALOG.md` now carries the **S8 RECOVER** row, and the S0–S7 references read S0–S8. | — | Standing Rule 21 requires the catalogue row **in the same turn** as a new process, so this was not optional. |
| **S6** | ✅ **CLOSED 2026-08-13.** All three `PROJECT-STATE.md` files (**Filters · Schedule · Report Suite**) now open with a banner pointing at `../skills/README.md` and naming **§17** as where that project's identifiers live. | — | It closed a real cold-start path §17 could not reach by itself: **a session resuming a project lands on `PROJECT-STATE.md` first**, and was not told the skill set existed. |

### And two live items the skills DESCRIBE but cannot CLOSE

| # | What | Who closes it |
|---|---|---|
| **S7** | **THE READ-DATE SWEEP HAS NEVER RUN ON ANY SUITE.** Rule 54 as amended requires **one date per cited source** in every provenance line. **Only 2 cases carry it** (C30452, C30434). **The skills now carry the amendment in three places — `00` §14.1, `01` step 5, `02` step 8 — while no suite complies with it.** It **cannot** be done by stamping today's date on everything: the date must be when that source was **actually re-read**, so it is a real pass per project, not a text substitution. Register **D1**. | **the QA lead** — it needs his go-ahead as an `update_case` pass over ~750 cases |
| **S8** | **THE FIVE PREPARED REPORT SUITE DEFECTS WERE WRITTEN UNDER THE OLD BAR** and have **not** been re-checked against the eight items. **The re-check is OURS and needs NO permission — preparing is not filing** — and any that cannot clear item **(1)** *(expectation quoted from a named source)* or item **(3)** *(exact named test data)* is **withdrawn rather than offered weaker**. **Only the FILING waits on him**, and the Jira creation hold stands: *"However for now the Jira ticket creation is still on hold."* Register **H1**. | **US** for the re-check · **the QA lead** for the lift |

---

## 4 · THE EXACT NEXT STEP FOR WHOEVER RESUMES

**S5 and S6 were done by the audit itself and are struck from this list. What remains, in order:**

1. **🔑 RUN THE S8 RE-CHECK — it needs no permission and it is the highest-value unblocked work here.**
   Take the five prepared Report Suite defects, run each against `06`'s eight items, and **repair or
   withdraw**. Expect withdrawals; **that is the correct outcome, not a failure of the pass.** It also
   **exercises `06` cold, which closes part of S1 and S2 at the same time** — and if the eight items
   turn out to be unworkable in practice, that is a finding about the skill worth more than the pack.
2. **Then, on the next real project pass, record where the skill had to be guessed** (S1) — and
   **write those gaps back into the skill in the same turn**, not into a report about it.
3. **Sweep `build/**/INCIDENT-*.md`, `DIVERGENCES.md` and the forensic audits properly** (S3) — that
   is where **seven of this audit's thirteen** items came from, and **no census of them has been run.**

**And ask him about S7** — the read-date sweep is the largest owed piece of work in the register and
**nothing in this set can close it.**

---

## 5 · HOW TO CHANGE A SKILL

- **A fix goes in ONE place.** If it is shared, it goes in `00`; if it is specific, it goes in the
  skill. **Never both** — a second copy silently drifts, which is the exact failure Rule 10's
  amendment names.
- **Give the item a row in `COVERAGE-MATRIX.md` in the same turn.** A learning without a row is
  invisible to the next audit.
- **Keep superseded wording, visible and dated.** *(This set does it in `00` §11.2, `02` step 4, `03`'s
  cosmetic/substantive block, `07` §5, `COVERAGE-MATRIX` §6 and the README's precedence line.)*
  **A silently-erased claim is how a future session re-derives the same mistake.**
- **Name the scar.** A rule without its incident **gets optimised away** by the next session that
  finds it inconvenient.
- **If a change conflicts with `CLAUDE.md`, establish which is NEWER first** (README) — then fix the
  older one **in the same turn**.

---

## OUTSTANDING — what I need from you

1. **A go-ahead for the read-date sweep** (S7) — it is the largest owed piece of work across all three
   projects, it needs an `update_case` pass over roughly 750 cases, and **until it runs no suite may be
   described as compliant with your own 2026-08-11 amendment.** *(Your words, and the reason it
   matters: *"if someone changes the source of truth I can guard myself telling that the refrence taken
   from the source of truth was from the state of that source which was at this certain date."*)*
2. **Nothing else is blocked on you.** S5, S6 and the S8 re-check are ours and can start immediately;
   **only the FILING of the five defects waits on your hold**, which stands and was not treated as
   lifted.
3. **A decision, when you have a moment, on S4** — whether `00-COMMON-CORE.md` should be split now it
   is 1,435 lines. **We have not split it**, because doing so breaks the *"a fix lands in one place"*
   property, and that trade-off is yours rather than ours.
