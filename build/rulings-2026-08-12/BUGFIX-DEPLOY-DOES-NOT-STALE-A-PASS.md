# A bug-fix deploy does not make a prior pass stale — QA lead's ruling, 2026-08-12

**Documentation only.** No TestRail call, no Jira call, no test case touched, nothing in any Report
Suite folder — a sibling worker was writing to Report Suite cases while this was recorded.

---

## 1 · The ruling, verbatim

His typing is preserved exactly as he wrote it, because **Standing Rule 25 applies to his
instructions as it does to a spec**:

> *"don't worry about them shipping the new biuilds everytime they fix a bug, they are just fixing
> the reported bugs which are to help fix the reported issues and not adding any functionality to the
> build, so that does not make your previous pass as stale."*

---

## 2 · What it settles, and why it is a real change rather than a reassurance

**Standing Rule 60's layer split says a redeploy invalidates layer 1** — the on-screen labels and the
navigation path, **widened earlier the same day (Rule 9's amendment) to the preconditions and steps
as well** — **and layer 2, the pass/fail verdict.**

That has been applied **literally, all week**, and today it produced a concrete cost: **Schedule and
Filters both redeployed at approximately 12:10 GMT on 2026-08-12**, and the honest-but-unhelpful
conclusion drawn straight from Rule 60 was that **a full day's runnability verification had gone
stale within the hour.**

> **HONESTY NOTE (Rule 12).** The ~12:10 GMT redeploy is recorded here as **the reported context in
> which the ruling was given**. **This entry is documentation-only and did NOT re-verify it** — no
> build marker was read by this pass. It is stated as context, not as an observation of ours.

**The QA lead has ruled that the pass did not go stale.** His reasoning is the operative part, not a
courtesy: these deploys **fix reported bugs and add no functionality**, so **they cannot have moved
the labels, routes, preconditions or steps a pass has just verified.** A deploy that changes nothing
a pass looked at cannot invalidate what that pass found.

---

## 3 · What is encoded

### (1) Previously verified work remains verified across a bug-fix deploy
Labels, navigation, preconditions and steps that were checked **stay checked**, and their **Rule-54
sentence-2 build stamps remain honest records of a real check** — not stale claims to apologise for.

### (2) A pass is not re-run merely because the marker moved
Re-verification is driven by **what actually changed** — a fixed defect's own cases, a shipped
feature, a changed requirement — **never by the marker alone.** A marker change is a fact to record,
not a trigger to act on.

### (3) What still holds, in full
- **The stamp keeps naming the build it was actually checked on.**
- **A date nobody observed is never invented — Standing Rule 12, restated intact.** This amendment
  says a prior check **still counts**; it does **not** say the check may be **re-dated**. Re-stamping
  a case to a build nobody opened it against is a fabricated observation and remains barred, exactly
  as Rule 60 practice (f) and the 2026-08-11 block already say.
- **A case whose own specific defect was the thing fixed genuinely does need re-checking** — which is
  precisely what **Rule 61's expect-fail three-outcome instruction already detects at no cost**:
  outcome (3) is the shipped fix reporting itself through the next automated run, and outcome (2)
  catches a failure that has *changed* rather than gone.

---

## 4 · The honest limit — written down because a rule with no limit gets over-applied

**This rests entirely on the deploys being BUG-FIX-ONLY.**

**If a deploy adds or changes functionality, Rule 60's layer invalidation applies exactly as
before** — layers 1 and 2 go stale and practice (b) governs unchanged.

**And we generally cannot tell which kind a deploy is from the marker**: an app-version string says a
build shipped, never what it contained.

**So the practical guidance is deliberately asymmetric:**

> **Do not pre-emptively discard a pass over a marker change. Treat a specific, observed
> contradiction as the trigger instead.**

A control genuinely no longer where a step says it is · a precondition that can no longer be
reached · a label that has genuinely changed — **those are triggers. A new hash is not.**

---

## 5 · What this repairs

Passes have been reporting **"only N of M rest on the build now running"** as though the remaining
M − N were worthless. **Under this ruling that framing is wrong, and it understates the position —
those verdicts stand.**

The same over-reading produced a week of readiness reports discounting their own sound work. These
three lines are **kept exactly as written where they appear, as the dated record of what was believed
at the time**, and are **re-read under this ruling as understatements rather than as findings**:

| Where it stands | The wording | Re-read as |
|---|---|---|
| Report Suite entry, 2026-08-06 late | *"only **51** of the 476 verdicts rest on the build now running"* | an understatement |
| Filters entry, 2026-08-06 | *"**every Filters verdict now predates the build that is running**"* | an understatement |
| Schedule entry, 2026-08-06 | *"**165 of the 168** have NOT been re-observed on the build running now"* | an understatement |

**Nothing was edited in those entries.** Superseded wording is kept visible and dated — the
house convention of Rules 31/52/53.

---

## 6 · The bookkeeping does not change — only the interpretation

**Rule 67's completion table still reports the build a case was checked against**, split into *"the
build now running"* and *"an earlier one"*, because that remains a **fact worth stating** and the
reader is entitled to it.

**What changes is what the split means:** across bug-fix-only deploys, a case checked on an earlier
build is **verified**, not **owed** — so the second number is **not written up as a shortfall** and
**does not belong in column 7 ("what is left") on the strength of the marker alone.**

**Unchanged and not weakened:** figures still derived live at report time (67(c)) · any column short
of 100% still says plainly why (67(d), Rule 60(d)'s bar on the blanket caveat) · **a row that was
never observed is still reported as never observed** (Rule 60's honesty clause) · and **no case is
ever re-dated to a build nobody checked it on** (Rule 12).

---

## 7 · Where this is recorded

| File | What was added |
|---|---|
| `CLAUDE.md` — **Standing Rule 60** | The full dated amendment, placed immediately after the 2026-08-11 "developers' own behaviour" block it refines — the block whose *"layers 1 and 2 are still invalidated by every redeploy"* is the reading now scoped. That block is **kept verbatim and dated, not overwritten.** |
| `CLAUDE.md` — **Rule 60 practice (b)** | An inline dated marker scoping *"ON A REDEPLOY"* to a redeploy that **adds or changes functionality**. The practice's own wording is kept verbatim above it. |
| `CLAUDE.md` — **Standing Rule 49** (tail) | Cross-reference: a bug-fix deploy does not re-open a closed queue row and is not a queue trigger. **The close condition is not lowered.** |
| `CLAUDE.md` — **Standing Rule 61** (tail) | Cross-reference: this rule is *what makes the amendment safe* — the one thing a bug-fix deploy really does change is the case whose defect was fixed, and outcome (3) reports it at no cost. |
| `CLAUDE.md` — **Standing Rule 67** (after item (e)) | Clarification: the table still reports the build; the **interpretation** of column 3's split is what changed. |
| `CLAUDE.md` — top-of-file queue-state pointer | A dated pointer beside the 2026-08-06 re-run-trigger note, so a cold-resuming session meets it before quoting Rule 60(b). |
| This file | The contemporaneous write-up. |

**No renumbering. No restructuring. No rule text deleted.**

---

## 8 · Ties

Standing Rules **9** (layer 1 is the runnable route — this is what stops a bug-fix deploy forcing it
to be re-walked) · **10** (VIU's live-observation step) · **12** (**observed, never inferred —
restated intact: a prior check still counts, and a date nobody observed is still never invented**) ·
**17** (complete data in and out — the honest N-of-M survives, correctly interpreted) · **25** (his
instruction quoted verbatim) · **49** (a queue row's trigger is the thing it is waiting on, not a
deploy — this applies that principle to a whole pass) · **54** (sentence 2 keeps naming the build
actually checked) · **57** (expectations come from documents and were never at risk from a deploy at
all) · **59** (re-read the sources before you rely on them — a genuine functionality change is found
that way, not from a hash) · **60** (the rule amended) · **61** (outcome (3) is how a shipped fix
reports itself) · **67** (the table still reports the build; the interpretation of its split is what
this corrects).
