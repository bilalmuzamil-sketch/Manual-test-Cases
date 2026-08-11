# Deliberate decisions — Report Suite spec-delta, 2026-08-11 (Standing Rule 46)

Everything decided **not** to do, with a plain one-sentence answer, the evidence, the cases, who can
close it, and an honest risk rating. **HIGH does not mean we are wrong — it means that if this is
raised in public there is a concession to make, not just an explanation.**

**Risk profile: HIGH 3 · MEDIUM 4 · LOW 6.**

---

### 1 · We did not decide the Work In Progress tab-placement question — **HIGH**

**Plain answer.** The specification says two different things about how a job lands in a tab, so we
kept what the requirement says and asked the product owner rather than guessing.

**Evidence.** WIP v11 §3 Key Decisions: *"Buckets are keyed on line state, not work-order status …
appears in each matching tab"* versus the unchanged `S2-R4`: *"exactly once, in exactly one tab"*.
**Cases:** [C30458](https://shopview.testrail.io/index.php?/cases/view/30458),
[C30462](https://shopview.testrail.io/index.php?/cases/view/30462) (Automated),
[C30464](https://shopview.testrail.io/index.php?/cases/view/30464).
**Closed by:** Chris Ward.
**Risk: HIGH.** Three tests are on hold and two surfaces cannot be authored. Rule 32's latest-wins
would arguably favour the newer Key Decision — but Rule 15 is explicit that a self-contradictory
spec is flagged, never silently resolved, and the older text was left standing rather than
superseded, which is more likely an oversight than a decision.

### 2 · We did not resolve the Parts Velocity Location column — **MEDIUM**

**Plain answer.** Parts Velocity still describes its Location column two ways, so its tests assert
only the parts that both descriptions agree on.

**Evidence.** `S3-R10` (rewritten v6) versus `S2-R12` and `S4-R1`/`S4-R2`/`S4-R3`, all unchanged.
**Cases:** [C38914](https://shopview.testrail.io/index.php?/cases/view/38914),
[C30352](https://shopview.testrail.io/index.php?/cases/view/30352) (Automated).
**Closed by:** Chris Ward.
**Risk: MEDIUM.** Nothing is held, and the load-bearing assertions (position, per-row values,
*"Multiple"*) are unaffected — but a tester on this report gets a hedge the other five do not.

### 3 · We wrote no new case for the Parts Velocity export cap — **MEDIUM**

**Plain answer.** The requirement was new but the coverage already existed, so we fixed the
reference instead of adding a duplicate.

**Evidence.** `S6-R12` versus [C38885](https://shopview.testrail.io/index.php?/cases/view/38885),
which already asserts the verbatim message. Both texts are quoted side by side in
`COVERAGE-REDERIVATION.md` §3.2.
**Closed by:** the QA lead, if he wants a dedicated case anyway.
**Risk: MEDIUM.** The brief expected a new case, so this is a deliberate departure from it. The
defence is that authoring a second case asserting the same string would be the duplication Rule 28
exists to stop — but it is a judgement, and a reasonable reviewer could ask why the anchor had no
case of its own.

### 4 · We kept C30107's closed enumeration — **MEDIUM**

**Plain answer.** Rule 42 warns against closed lists, but here the closed list **is** the
requirement, which is Rule 42's own exception.

**Evidence.** v17 `S3-R2`: *"pins **two** action rows at the top … above **two** toggle options"*.
**Case:** [C30107](https://shopview.testrail.io/index.php?/cases/view/30107).
**Closed by:** us, at the next spec change.
**Risk: MEDIUM.** This is exactly the shape that just broke — the v16 list was also closed and also
"was the requirement". The mitigation is the version-pinned `refs`, which is what makes the next
break findable rather than silent.

### 5 · We did not edit C30480, C30491, C30488, C30452 — **LOW**

**Plain answer.** They are affected by the tab question but their assertions are true under either
answer, so changing them would be churn.
**Closed by:** Chris Ward's ruling, after which they are re-verdicted.
**Risk: LOW.**

### 6 · We did not edit C30528, the nightly snapshot — **HIGH**

**Plain answer.** It asserts one row per job per day, which the new reading may change, but it cites
its own unchanged requirement — the same position as the three cases we held — so we flagged it
instead of editing it.

**Evidence.** [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) versus the v11 Key
Decision. **Closed by:** Chris Ward.
**Risk: HIGH,** and higher than its position in this list suggests. The snapshot feeds trend
history, so a wrong shape there is invisible on screen and would be discovered late. It arguably
deserved a HOLD alongside the other three; it did not get one because it sits in the API section and
its requirement is about capture, not placement. **That is a line-call and it is recorded as one.**

### 7 · We did not repair C30288 — **LOW**

**Plain answer.** It carries no automation marker and no spec version, but it has nothing to do with
this spec delta, so it is recorded rather than quietly fixed.
**Evidence.** Live census: 474 of 476 marked.
**Closed by:** the QA lead authorising a marker pass.
**Risk: LOW,** but it is why the arithmetic gate is out by exactly 1.

### 8 · We did not touch C43547's silence claim — **LOW**

**Plain answer.** Its claim is about a **renderer** size limit, not the row cap, and it is still
true.
**Risk: LOW.** Worth recording because it looks identical to the C38885 claim we did repair, and a
future pass may "fix" it wrongly.

### 9 · We did not re-date any Rule-54 sentence 2 — **LOW**

**Plain answer.** No build was observed, so re-dating a build line would assert a check nobody made.
**Evidence.** Verified byte-exact on all 24 updated cases; the writer refuses the write otherwise.
**Risk: LOW.** The consequence is that 24 freshly-corrected cases still name builds from 4–6 August
— correct, and honest.

### 10 · The four new cases carry no build line at all — **LOW**

**Plain answer.** They have never been checked against a build and say so by omission.
**Risk: LOW.**

### 11 · We did not sync run 359 — **MEDIUM**

**Plain answer.** The four new cases are not in the run, but `update_run` replaces the selection and
535 results are at stake, so the union is staged and left.
**Evidence.** `STAGED-RUN-359-SYNC.md`. **Closed by:** the QA lead.
**Risk: MEDIUM.** Until it is synced, a reviewer reading run 359 will not see the new coverage —
which is precisely the false-gap problem Rule 47 exists to prevent.

### 12 · We created no Jira ticket — **LOW**

**Plain answer.** Ticket creation is barred outright, and nothing here is a build defect anyway —
every finding is a documentation or test-case problem.
**Evidence.** Standing Rule 62 and the active creation hold.
**Risk: LOW.**

### 13 · We ran no Tier-2 epic re-read — **LOW**

**Plain answer.** Nothing needed it, and a full re-read needs the QA lead's go-ahead.
**Evidence.** Rule 37; the epic was Tier-1 checked at 105 children earlier the same day.
**Risk: LOW.**
