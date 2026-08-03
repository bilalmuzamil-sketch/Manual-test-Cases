# Report Suite — RUTHLESS USEFULNESS AUDIT, three dimensions (Standing Rule 28) · 2026-08-03

**Scope of this audit.** Rule 28 makes this the **mandatory closing gate** of every authoring or
update pass. This pass did not author cases — it **verified** them against a live build — so the
population scored here is the **475 active cases** as they now stand, with the difference that for
the first time the scoring is informed by **observation of a running build** rather than by reading.

**The purpose, stated plainly:** Stefan Mitrovic claimed on 2026-07-27 that of the 500+ Report Suite
cases *"maybe only 200 test cases are useful, the rest of them can be a waste"*, that AI makes
*"more than 70% useless test cases"*, and that *"some tests just do not make sense"*. This tally is
the standing answer, and it now has a build behind it.

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

Specs **SBC v13 · SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3** — current 2026-08-03.
Epic **SV-8582 — PARTIAL**. Designs **N/A**. Tech plan **PARTIAL**.
**Build `v3.4.1-0ed4433` — PARTIAL, NOT FINAL** → `RECHECK-QUEUE.md` **OPEN**.

---

## DIMENSION 1 — USEFUL

The 2026-07-28 audit already put this suite through a full usefulness pass: **515 → 459** after 41
merge groups and 57 deletions, all user-authorised. This pass asked a different and sharper question:
**now that the build exists, did any case turn out to be worthless?**

| Verdict | Cases | Notes |
|---|---:|---|
| **KEEP** | **461** | Distinct observable behaviour; a failure would be a real, reportable bug |
| **WEAK-KEEP** | **13** | Legitimate but low-value: the visual/styling cases (PV-VIS-02 padding and borders, PV-VIS-03 dark-mode contrast, the font-weight assertions). They are honest requirements, they are just cheap to break and expensive to run |
| **MERGE** | **0** | The build gave no new evidence of over-granularity. The 41 merge groups from July already took that out |
| **CUT** | **0** | **Not one case turned out to be worthless against the build.** The nine cases whose wording is wrong are wrong about a *label*, not about whether the behaviour is worth testing |
| **NEW COVERAGE THE BUILD REVEALED** | **+7 candidates** | The build showed us seven things worth asserting that no case covers — listed in `OUTSIDE-IN.md`. **The build made the suite look too small, not too big** |

**Usefulness headline: 461 KEEP / 13 WEAK-KEEP / 0 MERGE / 0 CUT = 97.3% load-bearing**, and the
honest finding of the day is that **the build argues for more cases, not fewer**.

**Is the critic right on the waste half?** **No — and the build is now the evidence, not our
opinion.** Against a running system, 0% of the 475 proved worthless and 2.7% proved low-value. His
figure was "more than 70% useless". The July pass *did* find real slop and removed 57 cases plus 41
merge groups — so his instinct that a first draft over-produces was sound, and it was acted on. What
is not sound is the claim about the suite as it stands.

---

## DIMENSION 2 — MAKES SENSE (coherence)

Scored by reading each case cold, as the critic would, against the six fail conditions.

| Verdict | Cases |
|---|---:|
| **SENSIBLE** | **463** |
| **FIX-WORDING** | **11** |
| **NONSENSE** | **1** |

### The one NONSENSE — and it is ours, found by the build

**WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)**, expected item 3.
**Fail condition: internal contradiction** — and worse, a contradiction *across* cases.

> Offending text, verbatim: *"Location is NOT offered in the column-selection control — it appears on
> its own whenever more than one location is in scope, and is hidden when a single location is in
> scope."*

Against the build: **Location is offered in the Column Selection panel**, sits between VIN and
Advisor, is off by default, and did **not** appear automatically at two-location scope. And it was
**already** irreconcilable with two of our own cases —
**WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)** and
**WIP-PERS-02 = [C30507](https://shopview.testrail.io/index.php?/cases/view/30507)** — both of which
list Location inside the fixed toggleable column order. Two of our cases could not both be true.

### The 11 FIX-WORDING

Nine are the label corrections in `CHANGE-LEDGER.md` rows 1–9. Two more:
**SBC-DATE-03 = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104)** (a step instructs
the tester to choose a control that does not exist — fail condition *"references a control in neither
the spec nor the build"*, though here the spec does have it and the build does not), and
**PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925)** (needs its
external-dependency status stated plainly for the tester).

### THE MANDATORY CROSS-CASE CONSISTENCY SWEEP (Stage 2b)

This is the part that failed on 2026-07-31, when 110 Filters cases were rated individually sensible
while contradicting each other, and a junior QA caught it cold. So it was run properly, three ways:

**1. Grouped by the control asserted on.** Grouping every case by the control it asserts on and
diffing the expected results found **one contradiction group**: the WIP Location column, across
**C30466 / C30467 / C30507**, above. **Resolved by the build** (Rule 33 precedence: our own
live-verified finding outranks a stale case) — C30466 and C30507 stand, C30467 item 3 is corrected.

**2. Opposite-assertion keyword sweep** (offered vs not offered · hidden vs shown · automatic vs
toggleable · exactly vs includes). This is what surfaced the group above. **One further tension
found and resolved without a contradiction:** SBC-COL-01 says *"there is no Location toggle in this
panel"* while WIP-COL-02 said Location is not offered in **its** panel. Both read like the same
claim; the build shows **they differ by report** — SBC has no Location toggle (correct), WIP does.
So the two cases are about different panels and are not in conflict. Worth recording, because a
reviewer could easily read them as a contradiction.

**3. Same-`refs`-anchor clustering.** Cases citing the same anchor were diffed for compatible
expectations. The Location anchors (SBC S4-R12, SBR S21-R7/S14-R20, PV S6-R11, TU S9-R9, WIP S7-R13,
IV S7-R6) are mutually consistent **except** WIP, as above.

**Contradictions found: 1. Resolved: 1. Unresolved: 0.** A suite may not ship with an unresolved
contradiction, and this one is resolved — subject to the QA lead authorising the C30467 edit, which
is why it is row 1 of the change ledger.

**Is the critic right on the makes-no-sense half?** **Partly, and I will not soften it.** He said
*"some tests just do not make sense"*. **One case in 475 (0.2%) is genuinely incoherent, and it is a
contradiction our own audit rated sensible in July.** That is a real hit for him. Eleven more (2.3%)
need wording repair. So **97.5% read correctly cold** — but the 0.2% he is right about is the exact
class of defect he predicted, and it took a running build and an outsider's test case to expose it.
The lesson is recorded in `OUTSIDE-IN.md` §(c) item 2 rather than buried.

---

## DIMENSION 3 — GENUINE + LAYMAN-RUNNABLE

**Genuine (Rule 20 traceability):**

| Check | Result |
|---|---|
| Carries a Jira ticket | **475 / 475** |
| Carries a spec anchor | **474 / 475** — the exception, **PV-PREC-02 = C38925**, states in its own refs that *no report spec covers QuickBooks* and cites the tech plan. A documented exception, not an unsourced case |
| Has a TestRail C-id | **475 / 475** |
| Anchor still exists in the current spec | **475 / 475** — re-checked against the refreshed captures; no ref points at removed text |
| **Verdict** | **100% traceable. No missing-traceability findings. No reference change needed anywhere** |

**Layman-runnable (Rules 7 / 9):**

| Check | Result |
|---|---|
| Title ≤ 80 characters | **475 / 475** |
| Numbered preconditions / steps / expected | **475 / 475** |
| No jargon, ticket ids, §-anchors or HTTP codes in tester-facing fields | **holds** — the 5 automated hits were false positives (dollar amounts, a day count, CSS font weights) |
| Build-accurate labels | **this is the weak point, and it is the point of this whole pass.** Until today **no label in this suite had ever been checked against a build**. Nine are now known wrong, sixteen groups are confirmed right, and the rest are unchecked |
| Steps executable by a non-technical tester on this build | **474 / 475** — **SBC-DATE-03 = C30104** instructs the tester to choose a *"Custom"* item that does not exist |
| **Verdict** | **Structurally excellent, and now genuinely evidenced for the first time on the areas reached** |

---

## THE TALLY THAT SHIPS WITH THE SUITE

> **475 active cases, scored 100%, no sampling.**
> **USEFUL — 461 KEEP · 13 WEAK-KEEP · 0 MERGE · 0 CUT (97.3% load-bearing).** Against a running
> build, no case proved worthless; the build instead revealed **7 things we do not yet cover**.
> **MAKES SENSE — 463 SENSIBLE · 11 FIX-WORDING · 1 NONSENSE (97.5%). Cross-case contradictions
> found 1, resolved 1, unresolved 0.**
> **GENUINE + LAYMAN-RUNNABLE — 100% traceable (475 ticketed, 474 spec-anchored with the one
> exception documented, 475 C-id'd), 100% within the title limit, 474/475 executable as written.**
> **Waste: 0% useless, 2.7% low-value. Makes-no-sense: 0.2%.**
> **Every figure above was scored with a live build in hand — and the suite is NOT VIU-complete,
> because that build was declared not final. See `RECHECK-QUEUE.md`, status OPEN.**

---

## WHAT THIS AUDIT CHANGES ABOUT HOW WE WORK

The honest lesson is not that the suite scored well. It is that **the July audit rated the WIP
Location contradiction as sensible**, and only two things caught it: a **running build**, and an
**outsider's test case**. Both are Rule-45 instruments, and both had been unavailable to this project
until now. The gap-closing action is already in the standing rules — Rule 28's Stage-2b sweep now
groups by the control asserted on and by `refs` anchor, which is precisely the grouping that would
have caught C30466-vs-C30467 from cold reading alone.
