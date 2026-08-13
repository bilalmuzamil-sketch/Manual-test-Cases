# 05 · PROJECT-REPORT — the per-project completion table, delivered before the next project starts

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST** — especially **§1 the honesty bar**, which
> is the whole substance of this skill.

---

## PURPOSE, IN PLAIN ENGLISH

**Tell the QA lead, in one table, exactly what is done on a project and exactly what is not — before
work moves to the next project.**

**The risk this manages is HIS, not ours.** He presents these numbers to people who will not have read
the file behind them. **An overstated figure is what bites him — not a missing one.** A shortfall
stated plainly is a position he can defend in a sentence; a number that turns out to have merged
*"labels checked"* with *"actually runnable"* is one **he cannot defend at all, because he will have
said it in good faith.**

**⇒ The conservative number is the useful number, and this skill exists to make the conservative
number the one that reaches him.**

---

## TRIGGER PHRASES

> *"Give me the report for [project]"* · *"where are we on [project]?"* ·
> *"how many cases are source-verified and how many build-verified?"* · *"what is left?"* ·
> *"status on [project]"* · **and automatically before starting work on a different project.**

---

## KICKOFF PROMPT

```
Run PROJECT-REPORT for [PROJECT].

Derive every figure live from TestRail now — nothing carried from a document.
Include the question sheet? [yes, it is ready and everything else is done | no, work remains]
Where should it go? [chat | build/<project>/READINESS-<date>.md | both]
```

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

| Date | Verbatim | Effect |
|---|---|---|
| **2026-08-12** | *"Before starting with filters, give me the report for schedule and set it as a rule to do before starting the next thing. I need a report table as to how many cases have been Source verified and how many have been build verified/VIU'd and what is left."* | **The whole rule.** The sequencing is the instruction, not a preference about formatting — and it is **a TABLE** |
| **2026-08-11** | *"let the manual QA tester verify those test cases and mark those test cases are passed or failed"* — confirmed *"you are RIGHT"* | **Never report "VIU complete"** (§honesty (b)) |
| **2026-08-12** | *"they are just fixing the reported bugs … and not adding any functionality to the build, so that does not make your previous pass as stale."* | Column 3's **second group is not a shortfall** across bug-fix deploys |
| **2026-08-12** | *"This should be the last thing once you give me the report that everything else has been done only this part is left"* | The **PO question sheet goes out attached to this report** — skill `07` |

### The correction that produced the honesty requirements

**A single "build-verified" figure would have overstated Schedule by nearly three times.** On
2026-08-12 the two numbers were **76 build-verified and 28 steps-walked, out of 176** — the day before
a release. The findings file states both in its own headline and says why: *"Those are two different
numbers on purpose, and the second is the one that answers 'can a tester pick this up tomorrow and run
it?'"* *(Evidence: `build/schedule/verify-final-2026-08-12/FINDINGS.md`.)*

---

# THE TABLE — seven columns, every one, every time

**It is a TABLE, not a paragraph.** He asked for *"a report table"*, and **a table is what makes a
missing column visible. A figure that has no row is a figure nobody notices is absent.**

| # | Column | What it must show |
|---|---|---|
| **1** | **TOTAL CASES — TWO NUMBERS** | **"ours N / live M"**, because we never claim or hide another author's work. **One number alone is wrong whichever one it is** |
| **2** | **SOURCE-VERIFIED** | how many carry **a per-source read date AND a current spec version pin** — **both halves.** A case pinned to a version nobody re-read is not source-verified; a source read on a date but pinned to a superseded version is the trap-(c) failure waiting to happen |
| **3** | **BUILD-VERIFIED — SPLIT IN TWO** | how many name **the build now running**, and how many name **an earlier one**. A single total silently merges them and is **the easiest number in the whole table to overstate** |
| **4** | **STEPS AND PRECONDITIONS ACTUALLY WALKED** | the runnability figure — **always the smaller number and always the more honest claim** |
| **5** | **RUNNABLE vs HELD, WITH THE MARKER ARITHMETIC SHOWN CLOSING BOTH WAYS** | `READY` + `READY - EXPECT FAIL` on one side; `total − HOLD` on the other. **Both printed. A gate shown only one way is not a gate** |
| **6** | **CREATED / UPDATED / DELETED in the pass** | — |
| **7** | **WHAT IS LEFT — ITEMISED, NEVER A TOTAL** | not *"48 remaining"* but **what specifically remains and what each item is waiting on** |

### Worked shape

```
## <PROJECT> — completion, derived live at <UTC timestamp>

| Measure | Figure | Note |
|---|---|---|
| Total cases                          | ours 176 / live 176 | 0 foreign in group 4254 |
| Source-verified                      | 176 | read date + spec v25 pin on every case |
| Build-verified — build now running    | 90  | v3.5-7ec992f |
| Build-verified — an earlier build     | 86  | v3.5-d122eef; bug-fix deploys since, so VERIFIED not owed |
| Steps and preconditions walked        | 28  | the number that answers "can a tester run it tomorrow?" |
| Runnable / held                       | 145 / 31 | 141 READY + 4 EXPECT FAIL = 145 ; 176 − 31 HOLD = 145 ✔ both ways |
| Created / updated / deleted this pass | 3 / 168 / 0 | |
```

Then **column 7 as its own list**, never a number.

---

# 🔴 THE HONESTY REQUIREMENTS — the substance, not caveats on it

### (a) "BUILD-VERIFIED" and "STEPS WALKED" are different numbers, reported separately

**Never merged, never substituted for one another.**

- **Build-verified** says a case's **labels were compared against this build**.
- **Steps walked** says **a tester could actually execute it** — every precondition reachable, every
  navigation path present, every control where the step says it is, the order workable.

**The second is always the smaller number and always the more honest claim.**

### (b) 🛑 NEVER report "VIU COMPLETE"

The behaviour verdict has belonged to the manual tester since 2026-08-11. **The accurate phrase — and
it is stronger than the overclaim, not weaker:**

> **"source-verified and build-accurate in its preconditions, steps, navigation and labels — with the
> behaviour verdict belonging to the tester."**

### (c) Every figure is derived LIVE at report time, and the read time is stamped on the table

**A number copied out of yesterday's findings file is a claim about yesterday**, however carefully it
was measured then. **Counts have moved within a single pass** — a worker watched a held count drop
**91 → 88 mid-write**. This is the write-time-re-read logic applied to reporting: **re-read at the
moment you rely on it.**

### (d) State plainly where a column is not 100%, and why

**An unexplained gap invites the challenge; an explained one answers it in advance.** **A blanket
caveat is BARRED** — *"the branch is not final"* applied to everything **hides the number instead of
explaining it.**

### (e) "What is left" names the blocker and who can clear it

With **Rule 48's five fields wherever the item is blocked on the QA lead himself** (core §11.7):
**which ruling, quoted verbatim · when he gave it and what question it answered · what it blocks, with
C-ids and links · why it was reasonable, or what has changed · the one thing that would unblock it,
and from whom.**

**So the report doubles as the ask** — and the same items go into
`build/OUTSTANDING-ITEMS-REGISTER.md`, rather than living only in a report he has to go back and find.

### (f) 🛑 PROVE EVERY BLOCKER BEFORE IT REACHES COLUMN 7

**This is where a false blocker enters the record**, and column 7 is honest-looking cover for it.

**Roughly 60% of one reported remainder was self-inflicted:** 23 Filters cases reported as remaining,
**14 classified "waiting on Branko" and treated as untouchable — they were not.** His missing write-up
left their **expected behaviour** unsourced; **it did not stop anyone executing their preconditions
and steps**, which was exactly what had been asked for. The next pass **walked all 14 surfaces**.

**Before any row is written into column 7:** decompose the work and **block only the part genuinely
blocked** · **prove the blocker real AND TOTAL** (*"we tried A, B and C and here is what each
returned"*, not *"we could not see a way"*) · **check it is not self-serviceable** · **treat a cost as
a scheduling decision, not a wall** · **state the residual: "Blocked for X. Still possible under it:
Y. Genuinely impossible until X clears: Z."**

**Why this matters more than it looks:** a falsely-blocked case **looks like someone else's problem
and stops being worked**, then **migrates** — into column 7, into the outstanding register, into an ask
forwarded to a PO — **gathering authority at every hop while nobody re-tests the premise.** By the time
it reaches the product owner it is a fact.

**And note where the failure surfaces, which is why it went uncaught: column 7 asks "what is left" and
the register asks "what are we waiting on" — BOTH ARE ANSWERED HONESTLY BY A FALSELY-BLOCKED ITEM.
Neither asks "and did you prove it?"**

### (g) Column 3's second group is a FACT, not a shortfall

**The bookkeeping is unchanged** — the table still reports the build a case was checked against, split
two ways, and the reader is entitled to it. **What changed is the MEANING of the second group: across
BUG-FIX-ONLY deploys those cases are VERIFIED, not owed.**

**So the second number is not written up as a shortfall and does not belong in column 7 on the
strength of the marker alone** — **a report that discounts its own sound work UNDERSTATES the
position**, which is the opposite of this skill's purpose even though it errs in the "safe" direction.

**Unchanged and not weakened:** figures still derived live (c) · any column short of 100% still says
why (d) · **a row NEVER observed is still reported as never observed** · **no case is ever re-dated to
a build nobody checked it on**. **Where a deploy is known to have ADDED OR CHANGED functionality, the
affected cases ARE owed and column 7 says so.**

### (h) 🛑 GATE EVERY TOTAL — AND REFUSE TO SUM FIGURES THAT MAY DOUBLE-COUNT

**A total that reads well is worth nothing if its parts overlap, and this table is exactly where such
a total gets published.** The proof is our own: the 2026-08-11 finality position was first framed as
**"425 final but not build-verified / 339 build-verified"**, and **those two totals double-counted the
8 Filters cases** — they appeared as unverified in the first and verified in the second. The corrected
figures are **433 and 331**, and **they gate both ways: 433 + 331 = 764 = Schedule 174 + Filters 114 +
Report Suite 476.** **The component figures were right all along; only the sums were wrong.**

**⇒ THREE THINGS, EVERY TABLE:**
1. **Gate each total against a known whole** — the parts must reconcile to the suite, both directions.
2. **Where the parts may overlap and no de-duplication was done, PUBLISH THE COMPONENTS AND SAY SO
   rather than inventing a total.** *(The false-absence count is the standing example: *"more than
   forty, plus four after that"* — deliberately not a tidy number, because the per-pass figures sit
   inside one another.)*
3. **Record the correction visibly and dated — never quietly fix it.** **A figure that fails its own
   gate is a finding**, and it is his credibility that a silently-repaired total puts at risk.

### (i) On these three projects, the branches are FINAL — do not hedge the findings

QA lead, 2026-08-11, verbatim: ***"The Branches are Final now."*** (after *"note that ALL 6 reports
have been handed off now."*). **So a deviation in column 7 is a REAL DEFECT IN A FINISHED FEATURE**,
and describing it as provisional-pending-development is now **wrong and understates it.** **Finality
closed nothing out — it RAISED the stakes:** as at that date **433 cases were final but NOT
build-verified** (Schedule 174 · Filters 8 · Report Suite 251) against **331 build-verified**.
*(Figures move — derive live, per (c).)* **"Final" means handed off, not frozen**: the branches still
redeploy, so (g)'s bug-fix-versus-functional distinction still governs.

---

## THE STEPS

1. **Core §0 pass-start checklist.**
2. **Check the run is in sync before reporting any coverage figure** (core §4). **A run out of sync
   with the suite makes every coverage figure meaningless.**
3. **Derive every figure LIVE** — page `get_sections` (**unpaged returns 250 and silently finds
   nothing**), page `get_cases`, read the `AUTOMATION:` markers, read the provenance lines' sentence 2
   for the per-case build date, read `get_results_for_run`. **Nothing transcribed.**
4. **Prove the counts as SET EQUALITY IN BOTH DIRECTIONS** — live · local active · id-map rows ·
   import rows. **Equal totals are not verification.**
5. **Separate ours from foreign** by `created_by` and report both numbers (core §5).
6. **Show the marker arithmetic closing both ways** (column 5).
7. **Test every blocker before it reaches column 7** (§f).
8. **Write the table, then column 7 as an itemised list, then OUTSTANDING** (core §13).
9. **Update `build/OUTSTANDING-ITEMS-REGISTER.md` in the same turn.**
10. **Include the "AUTOMATED CASES CHANGED — FOR VLAD" section** if the pass wrote to any case
    (core §5.3). **Say "none" where none.**

---

## THE DELIVERABLE

- **In chat**, because that is where he reads it — **plain, simple words under plain headings**, the
  table, then *"What is left"*, then *"OUTSTANDING — what I need from you"*.
- **And committed**, as `build/<project>/READINESS-<date>.md` or the pass's `COMPLETION-REPORT.md`, so
  the figures can be defended without re-deriving them. **Keep the previous readiness file and mark it
  SUPERSEDED — do not delete it.**
- **If it cites counts, it carries its own working** — how each figure was derived, in the shape of
  `build/tester-brief-2026-08-12/HOW-THE-NUMBERS-WERE-DERIVED.md`.

*Canonical examples: `build/schedule/verify-final-2026-08-12/FINDINGS.md` (both numbers in its own
headline) · `build/filters/finish4-2026-08-12/COMPLETION-REPORT.md` (including §7, which is the
falsely-blocked remainder preserved as evidence) · `build/schedule/READINESS-2026-08-06.md`.*

---

## WHY THE TIMING IS HALF THE VALUE

**A report delivered BEFORE the next project starts surfaces a problem while there is still time to
act on it** — the effort, the attention and the environment access are all still on that project.

**The same report delivered after the work has moved on is an archaeology exercise:** re-establishing
a build marker, a session and a data state that have all since changed, to fix something that was
cheap to fix an hour earlier.

---

## GUARDRAILS

- **G1 — Never report a figure you did not derive live in this pass** (§c).
- **G2 — Never merge build-verified with steps-walked** (§a).
- **G3 — Never say "VIU complete"** (§b).
- **G4 — Never write a blocker you have not tested** (§f).
- **G5 — Never use a blanket caveat in place of a number** (§d).
- **G6 — Read-only by default.** This skill reports; it does not fix what it finds. If it finds
  something that needs fixing, **name it in column 7 and ask.**
- **G7 — Never omit the OUTSTANDING section.** Say *"nothing outstanding"* if that is true.
- **G8 — 🛑 If an instruction for this pass conflicts with a rule here, STOP and surface it BEFORE
  acting** (core §11.6, Standing Rule 63). **What he instructed, quoted verbatim · what the rule
  requires, quoted, with its number · an explicit ask: which should we follow?** **Neither silent path
  is available** — not silently following the new instruction, not silently keeping the old rule. **A
  tightening or a layering is NOT a conflict**; escalating those trains him to wave escalations
  through. *He endorsed the practice by name: **"Good catch, be like this always."***
---

## HONESTY NOTES

- **A marker count is a marker count.** The arithmetic gate proves the markers are internally
  consistent. **It is not a coverage claim and must never be quoted as one** — we have already had to
  correct our own file for doing exactly that.
- **Say how many cases were observed and how many carry an earlier check** — per case, not averaged.
- **A row never observed is reported as never observed**, however small the number.
- **If a figure moved between two of your own passes, say which is current and why** — do not quietly
  publish the higher one.
- **Where a previous report of ours was wrong, correct it visibly and date the correction.** The
  workspace convention is that **a superseded claim is kept and dated, never silently erased** —
  because **a silently-erased wrong claim is how a future session re-derives the same mistake.**

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Fix the cases the report shows are incomplete | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** / **[`03-RUN-CHECK`](03-RUN-CHECK.md)** |
| Establish whether the sources moved | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** |
| Write the tester's skip list | **[`04-TESTER-READY`](04-TESTER-READY.md)** |
| Prepare a defect ticket for something in column 7 | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** |
| Write the questions that would clear column 7 | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** — and **the sheet goes out attached to THIS report**, once it says everything else is done |

**And it never writes to TestRail.**
