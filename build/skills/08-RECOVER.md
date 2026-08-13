# 08 · RECOVER — establish what a killed pass actually landed, by content, and finish it

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST** — especially **§8 session survival**,
> **§9 git**, and **§2.5/§2.6, the two traps that make a naive resume write over good work.**

---

## PURPOSE, IN PLAIN ENGLISH

**A pass died in the middle. Work out exactly what it landed and what it did not — from evidence, not
from its own claims — and complete only what is genuinely missing.**

**Why this is a skill of its own and not a paragraph in the core:** it ran **four times in two days**,
and it runs at the **worst possible moment** — a fresh session, no memory, a half-finished batch, and
someone waiting. **Every ingredient of a bad decision is present at once**, and the two commonest
mistakes both make things worse rather than better:

- **assuming the work was lost** and redoing it — which **writes over a landed change**, and the
  byte-check will happily confirm the second write;
- **assuming the work landed** because a timestamp says so — and **leaving something broken while
  reporting it done**.

**THE SCAR THAT DEFINES THIS SKILL: a recovery pass on 2026-08-11 concluded that all six killed
passes' work was lost. It was false and was withdrawn — and every conclusion it drew was confident,
fully evidenced and wrong.** The cause was **not** bad reasoning: **the checkout was 110 commits
behind while `git status` reported `clean` and `1 ahead`** (core §9.1). **It read a real repository
accurately and the repository was stale.**

**And the honest counterweight, because it is the reassuring half:** an independent re-audit
(`build/loss-audit-2026-08-11/VERDICT.md`) established from live TestRail, live git and each pass's
own artefacts that **no QA work was lost** — *"every operation the six killed passes intended is now
either landed, or was deliberately dropped for a documented and better reason."* **One thing was
genuinely lost and could not be recovered: a byte-comparison output written to `/tmp`.** The writes it
covered did land and are provably correct; **the contemporaneous proof that they verified clean at the
moment of writing is gone.** *(That is core §8 R4 in one sentence: **a byte-comparison whose output is
not committed did not happen, evidentially.**)*

---

## TRIGGER PHRASES

> *"The last pass was killed — pick it up"* · *"resume [pass]"* · *"did we lose anything?"* ·
> *"the container restarted"* · *"we hit the limit"* · *"what did that pass actually land?"* ·
> *"is the work from yesterday still there?"* · **and automatically whenever a `RESUME.md` names
> anything as IN FLIGHT.**

---

## KICKOFF PROMPT

```
Run RECOVER for [PROJECT / the pass at build/<project>/<pass>-<date>/].

What I know: [the pass died at roughly <time> | a container restart | the weekly limit | unknown]
Writes it was making: [TestRail update_case | add_case | a run sync | none — it was read-only]
Authorisation to COMPLETE it: [the original approval still stands | ask again | report only]
```

**⚠️ IF THE LAST LINE IS MISSING, ASK.** **A resume is not covered by the original approval by
default** — permission is per ask (core §2), and *"finish what you started"* is a different request
from *"tell me where it got to"*. **Recovering the POSITION is always safe and never needs
permission; COMPLETING the writes may not be.**

---

# 🔑 THE ONE RULE THIS SKILL TURNS ON

> ## ESTABLISH POSITION FROM **LIVE CONTENT**, NEVER FROM WHAT THE DEAD PASS CLAIMED — AND NEVER FROM A TIMESTAMP.

**The dead pass's oplog is a HYPOTHESIS about what happened. Live content is the evidence.** The oplog
tells you **where to look**; it does not tell you **what is true**. Core §8 R5 states the principle;
this file is the procedure.

---

# THE FOUR TRAPS THAT MAKE A NAIVE RESUME WORSE THAN NO RESUME

Each is treated in full in the core; they are gathered here because **a resume meets all four at
once**, which is why assembling them under pressure goes wrong.

### TRAP 1 — A STALE CHECKOUT LOOKS EXACTLY LIKE LOST WORK (core §9.1)

**`git status` reporting `clean` proves nothing about currency**, and *"1 unpushed commit"* is usually
a **stale tracking ref**. **`git fetch origin <branch>` then `git merge --ff-only` is the FIRST ACTION,
before reading a single file.** If the fast-forward is refused, **STOP and report** — never force,
never rebase, never `reset --hard`, because a sibling's commits are the very thing at risk.

**This trap alone produced the false "everything was lost" verdict.**

### TRAP 2 — `updated_on` LIES IN BOTH DIRECTIONS (core §2.5)

- **A FROZEN timestamp hides a change that DID happen** — 14 Report Suite cases had all three text
  fields turn into raw HTML while `updated_on` and `updated_by` stayed at pre-pass values.
- **A FRESH timestamp advertises a change that did NOT happen, and this is the one that bites a
  resume** — three Filters cases (**C29601 · C38882 · C43562**) carried the current day's `updated_on`
  from an *unrelated* pass while **the write intended for them had never landed.** A worker checking
  *"did my write go through?"* by timestamp would have read today's date on all three and **stopped
  checking something that was broken.**

**On a shared suite a fresh timestamp is the EXPECTED state and proves nothing at all.**

### TRAP 3 — AN HTTP 500 OR 502 CAN COME BACK FROM A WRITE THAT LANDED (core §2.6)

**So the last oplog line is not a reliable verdict either.** A failure recorded against the final
operation may describe a write that succeeded. **NEVER blind-retry. READ THE LIVE STATE FIRST.**

### TRAP 4 — A LIVENESS CHECK IS NOT EVIDENCE OF PROGRESS (core §8)

**`pgrep -f` matched the watching shell's own command line and returned true forever, while the batch
had silently never run.** **Check the work product, never the process.**

---

# THE PROCEDURE — seven steps

### 1 · FETCH AND FAST-FORWARD, BEFORE READING ANYTHING

Trap 1. **Record the SHA you land on** in the recovery's own notes, because every later claim is
relative to it.

### 2 · FIND THE PASS FOLDER AND READ ITS OPLOG AS A HYPOTHESIS

`build/<project>/<pass>-<date>/` — the oplog (`oplog.json` / `testrail-execution-log.md`) and
`RESUME.md`. Core §8 **R1** requires the **intent line written BEFORE the call and completed after**,
so:

> **🔑 AN OPERATION WITH AN INTENT AND NO OUTCOME IS THE EXACT POINT THE PASS DIED.** Start there —
> **and treat the last few COMPLETED lines as unverified too**, because of trap 3.

**If there is no oplog at all**, say so plainly: the position must then be rebuilt from the live suite
and the git history alone, which is **slower and less certain**, and the recovery report says which.

### 3 · SWEEP `/tmp` BEFORE IT DIES, AND COMMIT WHAT IS THERE

**`/tmp` is ephemeral and loses evidence every time.** If the container is still alive, **look for the
dead pass's orphaned output and commit it immediately** — this is worth doing **first among the
optional steps**, because the window closes without warning.

**It has paid twice, and both times by luck rather than architecture:**
`build/report-suite/data-preconditions-2026-08-12/RESUME.md` records six facts (**F33–F38**) that
*"ran at 14:02, minutes before the pass died, and their results existed only in `/tmp`"*; and
`build/filters/finish5-2026-08-12` needed a dedicated recovery commit (`c82afbe8`) *"to commit the
orphaned probe output the container restart left uncommitted."*

**Redact at the point of capture before committing anything from `/tmp`** (core §10) — and **cookie
values never leave `/tmp` at all.**

### 4 · VERIFY EVERY CLAIMED OPERATION AGAINST LIVE, FIELD BY FIELD

**Not by count. Not by timestamp. Not by re-reading the log.** For each operation the oplog claims:

- **`get_case` and byte-compare against the payload the oplog says was intended** (core §2.2);
- classify it **LANDED / NOT LANDED / LANDED BUT WRONG**;
- **`LANDED BUT WRONG` is a real category and it is the one people forget** — §2.4's whole point is
  that a write can be faithful to a payload that was itself wrong.

**Then reconcile the operation count against the plan** (core §2.7). **That is how a duplicated edit
was found** — 39 writes over 38 cases, because a resume re-applied an edit whose idempotence guard
tested *the case* rather than *the content*.

### 5 · PROVE THE RUNS UNTOUCHED, AND THE FOREIGN CASES

A killed pass is exactly when a partial run write could have gone out. **Verify on the GRADED fields
only** (core §3.4 — `case_title` and `case_refs` are read-time echoes and will show false movement):
*"N tests, M results, 0 missing by id, 0 graded fields moved, 0 new, `case_id` sets equal both ways,
`include_all` still false."* **And prove any foreign case byte-identical including `updated_on` /
`updated_by`** (core §5.1).

### 6 · COMPLETE **ONLY** WHAT IS VERIFIABLY MISSING — AND REBUILD, DO NOT REPLAY

**🛑 A STAGED PLAN THAT PERFORMS EXACT-STRING SURGERY AGAINST A PRE-WRITE SNAPSHOT CANNOT SIMPLY BE
RE-RUN.** A sibling may have moved the anchors it matches on, so **it fails its own assertions** —
proven twice. **Say `REBUILD, do not replay` in every recipe you write.**

**And the upside, recorded because it is not obvious: one plan REBUILT from source produced a BETTER
result** — it dropped a case that did not belong and found a gap the original had missed.

**Everything the dead pass owed, the resume owes too:** all three text fields on every `update_case`
(core §2.1) · the byte-check (§2.2) · **stop the batch on a mismatch** (§2.3) · the Rule-54 provenance
re-stamp (§14) · **the post-write assertion re-audit (§2.10)** · the tell-Vlad section (§5.3).

### 7 · WRITE THE RECOVERY REPORT — and be willing for it to say "nothing was lost"

---

## THE DELIVERABLE

`build/<project>/<pass>-recovery-<date>/` — or `RECOVERY.md` inside the dead pass's own folder, which
keeps the record together:

| File | Contents |
|---|---|
| **`STATE.md`** | **LANDED · NOT LANDED · LANDED BUT WRONG · DELIBERATELY DROPPED (with the reason)** — one row per claimed operation, each with **C-id + link** and **how it was verified** |
| `VERDICT.md` | The plain answer to *"did we lose anything?"* — **and its second half** (below) |
| `evidence/` | The live re-reads the verdict rests on, committed, **not** in `/tmp` |
| `RESUME.md` | What still remains, with its **rebuild** recipe — never a replay recipe |

### The verdict has two halves, and the second one is the honest part

**The canonical shape, from `build/loss-audit-2026-08-11/VERDICT.md`:**

> **✅ NO QA WORK WAS LOST.** Every operation the killed passes intended is now either landed, or was
> deliberately dropped for a documented and better reason. **All three test runs are intact — every
> graded result still present, by ID.**
>
> **⚠️ ONE THING WAS GENUINELY LOST AND CANNOT BE GOT BACK.** The contemporaneous byte-comparison
> output was written to `/tmp` and died with the container. **The writes did land and are provably
> correct** — but the *original* proof that they verified clean at the moment of writing is gone.
> **What stands in its place is an after-the-fact reconstruction, and it says so on its own first
> line.**

**Copy that structure.** *"Nothing was lost"* on its own is the answer everyone wants and is almost
never the whole truth; **the second half is what makes the first half believable.**

---

## GUARDRAILS

- **G1 — Fetch and fast-forward FIRST.** Never force, never rebase, never `reset --hard` (core §9).
- **G2 — Never conclude work was lost from a local checkout alone.** That is the exact false verdict
  this skill exists to prevent.
- **G3 — Never blind-retry a write.** Read live first (core §2.6).
- **G4 — Never accept a timestamp as evidence in either direction** (core §2.5).
- **G5 — Rebuild a staged plan; never replay it** (step 6).
- **G6 — Completing the writes may need fresh permission.** Recovering the position never does.
- **G7 — Commit the evidence.** A recovery whose proof sits in `/tmp` has recreated the one loss this
  workspace has actually suffered.
- **G8 — Path-scoped `add` AND `commit`** (core §9.2) — a recovery often runs while a sibling is live,
  and a bare commit has swept a sibling's staged work three times.

---

## HONESTY NOTES

- **"I could not establish what this operation did" is a legitimate finding**, and it is far better
  than a confident wrong answer. Say which operation, and what you tried.
- **Distinguish DELIBERATELY DROPPED from NEVER LANDED.** The 2026-08-11 audit's real finding was that
  several operations were dropped **for a documented and better reason** — reporting those as losses
  would have been as wrong as missing a real one.
- **Say whether the recovery's own evidence is contemporaneous or reconstructed.** The reconstructed
  kind is worth having; **it is not worth the same**, and the report says which it is on its own first
  line.
- **A recovery is not a status report.** When it is done, the project's position comes from
  **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)**, derived live.

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Decide what the cases should say | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** + core §11.2 |
| Re-walk the build the dead pass was walking | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** |
| Report where the project now stands | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| File anything the dead pass had prepared | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** — **and the creation hold stands** |

**And it never re-runs a write on the assumption that it failed.**
