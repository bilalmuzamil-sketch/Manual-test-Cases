# Why an outside automation engineer found a coverage gap in our suite before we did

**Date:** 2026-07-31 · **Audience:** QA lead + engineering leadership · **Scope:** the Report Suite
export-Location defect, and the process hole it exposes across all projects.

**The QA lead's ask, verbatim:** *"Also I need to fill the GAP, Vlad should not have been able to
find the missing cases, how did we miss them and what have we learned from that? How will we ensure
that we will not miss creating those cases which Vlad picked up. Learn from that and add to your
strategy anything which should be the part of your learning to never miss any test cases to be
created which others can raise like Vlad did today."*

**What this document is.** A verified root-cause analysis. Every link in the chain below was
re-checked against the actual files in this repository, with file and line evidence, before it was
written down. **Two claims in the earlier account did not hold up, and one claim in this document's
own first draft did not either — all three are corrected in §7.**

**Honesty notes up front.**
- **Nothing here is live-build verified** (Standing Rule 12). The Report Suite has no QA branch we
  can reach, so every statement is source reconciliation, not observation of the shipped product.
  That limit is itself central to §5.
- **Timestamps are quoted as the TestRail and Confluence APIs return them (UTC).** The working
  documents of this session are dated `2026-07-31` while the underlying epoch timestamps read
  `2026-07-30`. The document naming convention is kept for continuity; the raw UTC values are quoted
  unaltered so nothing depends on which of the two is "right".
- **Read-only.** No test case was edited, no foreign case was touched (Rule 38), no TestRail write
  of any kind was made from this analysis.

---

## 1. The timeline

| When (UTC) | What happened | Evidence |
|---|---|---|
| **2026-07-29 06:38:33Z** | Chris Ward publishes **SBR spec v15**, adding **`S14-R20` "Location in exports"** — *"included in all four exports in the same position it occupies on screen"*. The same change-log row says *"the column is carried into all four exports"*. | `build/report-suite/spec-current-2026-07-31/Sales-By-Representative-Report-current.md:566` and `:906` |
| **2026-07-29 06:33:58Z** | The same suite-wide Location change lands in the other five report specs — **SBC `S4-R13`**, **PV `S6-R11`**, **TU `S7-R13`**, **IV `S10-R15`**, WIP `S7-R13`. | `build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md:144-148` |
| **2026-07-31 (capture)** | **Our spec diff DETECTS `S14-R20` correctly** and quotes it. Detection did not fail. | `build/report-suite/spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md:136` |
| **before the push** | The deltas document that acts on that diff is written. **`S14-R20` appears in it zero times** (verified: `grep -c` = 0). Its **D11** authors six **on-screen** Location cases and cites only `S21-R7`, `S21-R8`, `S18-R13` for SBR. Its **N2** examines the export surface and clears it as *"provably fine — not skipped"*. | `build/report-suite/chris-answers-2026-07-31/DELTAS.md:202-222` (D11), `:241-244` (N2) |
| **2026-07-30 15:27:09Z** | The authorized push executes: 70 `update_case` + 7 `add_case`. It creates the six on-screen cases **C38912–C38917**, and as **operations 46 and 47** it opens **SBR-EXP-10 = C30285** and **SBR-EXP-11 = C30286** — purely to rename `Sales Rep` → `Sales Representative` on the first header. The stale header list is not noticed. | `build/report-suite/chris-answers-2026-07-31/testrail-execution-log-2026-07-31.md:3-4`, `:93-94` |
| **2026-07-30 15:54Z** | **27 minutes later**, Vladimir Tomovic creates five automated cases, among them **C38923** — *"SBR Summary and Expanded CSV exports carry the Location column at its designated slot"*. **No `refs`. No expected results.** | `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md:50`, `:60` |
| **2026-07-30 17:41Z** | He last updates them. | same |
| **later that day** | Two of our passes converge on the defect **independently**: the foreign-case analysis (because his case disagreed with ours) and the coverage re-derivation (because it rebuilt the requirement→case map from scratch). The re-derivation finds the identical on-screen/export split on **five reports**. | `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` · `COVERAGE-REDERIVATION.md:144-148` |
| **2026-07-30 19:56:44Z** | **C30285 and C30286 are repaired** — operations 20 and 21 of the `2b-repair` pass — with scope-conditional wording and `S14-R20` added to `refs`. Verified live this session. | `build/report-suite/coverage-rederivation-2026-07-31/testrail-execution-log-2026-07-31.md:42-43`; live `get_case` |

**Two numbers that matter.** The spec requirement was live for about **33 hours** before we applied
it — and we applied it *wrongly*. And Vladimir's case landed **27 minutes after our own push**: we
were not slow, we were reading the same document at the same time and taking less out of it.

---

## 2. The failure chain — verified, and one correction

The briefing's reading was that **detection succeeded and everything after it failed**. That is
correct, and the evidence supports every link. But the second link is **sharper and worse** than
"surface blindness", and that difference is the whole point of this analysis.

### Link 0 — DETECTION: **SUCCEEDED**
`SPEC-DIFF-2026-07-31.md:136` names `S14-R20` and quotes it. Nobody missed the requirement.

*Aggravating detail:* the diff presented **four new anchors in one prose paragraph** —
`S21-R7`, `S21-R8`, **`S14-R20`**, `S18-R13`. Three of the four were carried forward. One fell out
of a sentence.

### Link A — DETECTION → ACTION HANDOFF: **FAILED**
The deltas document contains **zero** occurrences of `S14-R20`. A correctly-detected requirement
never received a row of its own. Covered by **Rule 43**.

### Link B — SURFACE HANDLING: **FAILED, but not the way it looks**

The briefing says the requirement was "applied on screen only". True in effect — but the pass **did
look at the export surface**. `DELTAS.md:241-244`, under **"NO-CHANGE (checked, provably fine — not
skipped)"**, states:

> **"N2.** The six **"Locations:" export-line** cases already assert the line: SBC-EXP-03 (C30161),
> SBC-EXP-09 (C30167), SBR-EXP-02 (C30277), PV-EXP-02 (C30376), TU-EXP-04 (C30437), IV-EXP-02
> (C30588), WIP-EXP-02 (C30511) — the 2026-07-29 message pass got there first, and the ratified spec
> matches them."

**This is not blindness. This is a false all-clear, and it is a worse failure mode.** `S14-R20`
contains **two distinct assertions**:

1. the per-row **Location COLUMN** is carried into all four exports at its on-screen position; and
2. every export also gains a **"Locations:" metadata LINE** naming the scope.

The pass verified **assertion 2**, found it covered, and wrote **"provably fine"** over the whole
requirement. The independent re-derivation later stated the residue exactly: *"SBR-EXP-02 = C30277
expected 5 covers **only** the `"Locations:"` line"* (`COVERAGE-REDERIVATION.md:145`).

So the honest statement of Link B is: **a requirement carrying two assertions was verdicted as one
unit, and coverage of the weaker assertion certified the stronger one as done.** A blind spot gets
found by looking. A false all-clear actively stops anyone looking again — it was filed under
*"provably fine — not skipped"*.

### Link C — SURGICAL EDIT: **FAILED**
Operations 46 and 47 opened both defective cases, edited **the very line that lists the headers**,
and re-saved them — stamping a fresh "Updated" date that made them look current. Covered by
**Rule 41**.

### Link D — THE CLOSED ENUMERATION: **FAILED**
Both cases said *"the headers, in order, are **exactly**: …"* — correct until the spec added one
column. Covered by **Rule 42**, *with a caveat in §4.*

### Link E — NO OUTSIDE-IN CHECK: **FAILED, and nothing covers it**
We had no mechanism of any kind that asked "could somebody outside see something we cannot?" We
found the defect because a colleague's case happened to disagree with ours, in a group we happened
to audit. That is luck wearing the costume of process.

### Link F — DELIBERATE vs MISSED was indistinguishable
`N2` is written in the exact register of a deliberate, evidenced decision — a numbered NO-CHANGE
entry, seven case ids, a reason. It was an error. Nothing in the deliverable let a reader tell a
considered omission from a mistake, because **no NO-CHANGE verdict was required to show its
working**.

---

## 3. Five whys on the deepest failure (Link B, the false all-clear)

| | |
|---|---|
| **The failure** | The export surface was examined and **cleared incorrectly**. |
| **Why 1** | Because the check asked "is the `"Locations:"` line covered?" — and it was. |
| **Why 2** | Because `S14-R20` bundles **two distinct assertions** and the check treated the requirement as **one indivisible unit**. |
| **Why 3** | Because the verdict was recorded at **requirement granularity**, and its evidence was a **list of case ids** rather than the covering case's **actual words** set against the requirement's **actual words**. |
| **Why 4** | Because nothing in the process required that. *"Covered by C30277"* is **unfalsifiable as written** — a reader cannot check it without re-doing the work, so no reviewer ever does. |
| **Why 5 — ROOT** | Because **every coverage verdict we produce is self-certified.** We wrote the requirement list, we wrote the cases, we wrote the verdict, and we wrote the evidence for the verdict. No person, no script, and no adversarial pass was positioned to test the sentence *"provably fine"*. The only thing that eventually tested it was an outsider who had no idea he was doing so. |

The root cause is **not** carelessness on one line. It is **a closed evidential loop**: a
self-graded exam with the answer key written by the candidate.

---

## 4. Which of Rules 40–44 covers which failure — and what is still uncovered

| Link | Failure | Covered by | Would it actually have caught this? |
|---|---|---|---|
| 0 | 4 anchors bundled in one diff paragraph | **Rule 43** (per-requirement row) | **Yes** — one row per anchor makes an un-verdicted anchor a visible hole. |
| A | `S14-R20` never carried into the deltas | **Rule 43** | **Yes.** |
| B | Export surface examined and **falsely cleared** | **Rule 40** (surface matrix) — *partially* | **NO, not reliably.** Rule 40 forces a per-surface **verdict**. The pass effectively had one (N2) and it said *"covered"*. Rule 40 does not require the verdict to **show evidence**, and does not require a **multi-assertion requirement to be split**. **Not closed.** |
| C | Surgical edit at ops 46/47 | **Rule 41** | **Yes** — and at zero marginal cost. See §6. |
| D | *"exactly"* closed list | **Rule 42** | **Partially — and honestly, no.** See the caveat below. |
| E | No outside-in check | **nothing** | **Not closed** → this is **Rule 45**. |
| F | Deliberate vs missed indistinguishable | **nothing** | **Not closed** → this is **Rule 46**. |

### The Rule 42 caveat, stated plainly because it is unflattering

Rule 42's mechanism is: pin a closed list to its **governing requirement + spec version**, so that
**when that requirement changes, every case citing it is re-checked.** Applied to this incident it
would **not have fired**:

- The cases cited `S14-R15` / `S14-R16`. **Those requirements did not change.**
- The requirement that invalidated them was **`S14-R20`, a brand-new anchor**.
- The cases would have been pinned to *"spec v15"* — and `S14-R20` arrived **in v15 itself**.

So a same-anchor cluster sweep and a version-pin both come up empty. **A closed list can be
invalidated by a requirement it does not cite and could not have cited.** Rule 42 still earns its
place (the scope-conditional wording it mandates is exactly the repair that was applied), but it
must not be credited with a detection power it does not have. The detection has to come from the
**requirement side** (Rule 43 + assertion-level evidence) or from **outside** (Rule 45).

### The residual gap, named

**Rules 40–44 force VERDICTS. Nothing forces EVIDENCE FOR A VERDICT, and nothing splits a
requirement into the separate assertions it makes.** That is precisely the hole `N2` walked through.
It is closed below by **Rule 45(e)**, and it is flagged in §8 as a recommended tightening of Rule 43
for the QA lead's decision.

---

## 5. Why an outsider was positioned to see it and we were not

Four reasons. None of them are flattering, and the third is the one nobody would volunteer.

**1. He works from the BUILD; we work from the DOCUMENT.** His sibling case C38922 says it in its
own title — *"…its column semantics stay **exactly as shipped**"*. An automation engineer must
assert something a running system actually emits; he cannot write a header list he has not seen. We
assert what a document says, and we have **no QA branch for any of the three active projects**
(Rules 12/22). A document can be read three-quarters correctly and nothing pushes back. A build
pushes back immediately.

**2. He authored FRESH; we EDITED.** He wrote C38923 against v15 with no history. Our two cases were
**inherited artefacts** whose header enumerations date from the **2026-07-11** "Exports hardened"
change. Fresh authoring reads the current spec end to end. Incremental editing **inherits the
previous author's reading of the spec** and only re-reads the words it came to change. Our pass came
to change one word, and changed one word. **This is the structural argument for Rule 41**, and the
reason a "small" edit is the most dangerous kind.

**3. We had no mechanism — none — for comparing our coverage against anybody else's.** The one
checker we had, `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`, is documented as
answering *"which of THEIR cases duplicate OURS?"*. It looks for **overlap**. The shape that hurt us
is the **exact inverse**: an assertion of theirs with **no counterpart in ours**. We had built the
tool that finds the harmless case and not the tool that finds the harmful one. Until today,
**a colleague's case existing where ours did not was treated as a tidiness question, not a coverage
signal.**

**4. Our verdicts were self-certified (§3, Why 5).** He was the first genuinely independent reader
of that requirement — and he was not even reading our suite.

**One thing we did get right, and it is the only reason this cost nothing.** His case carried **no
`refs`** — the single most available excuse to dismiss it, and the tell our own foreign-case analysis
lists as a marker of foreign work (`FOREIGN-CASES.md:69` — `refs` populated **474/474** for ours,
**0/5** for his). It was investigated instead of waved away, and that investigation found a
**five-report** defect. That instinct is now **Rule 44**. It should never again depend on instinct.

---

## 6. The counterfactual: which single control would have caught it earliest and cheapest

**Answer: Rule 41 — "touch a case, re-verify the whole case."**

- **Earliest.** It would have fired at **2026-07-30 15:27:09Z**, during operations 46 and 47 —
  **27 minutes before Vladimir's cases existed at all.** The defect would have been ours to find and
  fix, before any outside party could raise it.
- **Cheapest.** The marginal cost was **zero**. Both cases were **already open**, the editor was
  **already on the header line**, and the current spec (v15) was **already the pass's own reference**.
  One end-to-end read of a case we had in our hands.
- **Most reliable of the five.** Rule 43 would have caught it a stage earlier in principle, but only
  if the verdict carried evidence — as written, a row reading `S14-R20 → covered by C30277` passes,
  which is *exactly what N2 did*. Rule 42 would **not** have fired at all (§4). Rule 40 gives the
  export surface a row that N2 effectively already had. Rule 45 catches it, but **later and by luck's
  design rather than by construction** — it depends on somebody else having written a case.

**Ranked, for the record:**

| | Control | Would fire at | Cost | Reliable here? |
|---|---|---|---|---|
| **1** | **Rule 41** whole-case re-read | 2026-07-30 15:27Z (ops 46/47) | **zero** | **Yes** |
| 2 | **Rule 43 + assertion-level evidence** (§8) | deltas stage, pre-push | low | Yes *only with* the evidence requirement |
| 3 | **Rule 45** outside-in / reverse diff | after his cases exist | low, automatable | Yes, but dependent on an outsider |
| 4 | **Rule 40** surface matrix | deltas stage | low | Weak alone — N2 shape passes it |
| 5 | **Rule 42** anchor pinning | never, here | — | **No** (§4 caveat) |

**The uncomfortable summary:** the cheapest control in the entire set was also the earliest and the
most certain, and it cost nothing but the discipline to read a whole case we already had open.

---

## 7. Corrections to the earlier account — and to this document's own first draft

Three claims did not survive verification. All are stated here rather than quietly fixed.

**7.1 — The defect spanned FIVE reports, not four.**
`build/LESSONS-2026-07-31.md:122-124` says the split existed on *"three further reports (Parts
Velocity `S6-R11`, Technician Utilization `S7-R13`, Inventory Value `S10-R15`)"*. The coverage
re-derivation lists **five** genuine export gaps — **SBC `S4-R13`** (`COVERAGE-REDERIVATION.md:144`)
as well as SBR, PV, TU and IV. **SBC was omitted from the lessons account.** WIP is correctly not a
gap: `WIP-FLT-09 = C38916` covers the export header *"Branch"*. So the correct count is **SBR + 4
siblings = 5 reports**, and the lessons document **understates the incident by one report**.

**7.2 — "Surface blindness" is the wrong diagnosis for Link B.**
The pass did not skip the export surface; it **examined and falsely cleared** it (`DELTAS.md:241-244`).
This is not a softening — it is worse, and it changes which control is needed (§4).

**Verified and holding, for completeness:** `S14-R20` detected in the diff (`:136`) ✓ · zero
occurrences in `DELTAS.md` ✓ · six on-screen cases C38912–C38917 authored ✓ · ops 46/47 on
C30285/C30286 for the rename only ✓ · C38923 carries no `refs` ✓ · Vladimir Tomovic = TestRail user
id **1**, we are id **3** (both resolved live via `get_user`) ✓.

**One material update the earlier documents do not yet reflect:** **C30285 and C30286 are already
repaired** — ops 20/21 of the `2b-repair` pass, `2026-07-30 19:56:44Z`, verified live this session.
Both now carry scope-conditional wording *("With a single location in scope the headers, in order,
are exactly: … / When more than one location is in scope the file also carries a Location column…")*
and `S14-R20` in `refs`.

**And the four sibling reports are closed too — corrected after checking, rather than assumed.** An
earlier draft of this analysis listed them as still open. They are not: they were closed as
**extensions to the on-screen Location cases** rather than edits to the export cases — **SBC-LOC-04 =
[C38912](https://shopview.testrail.io/index.php?/cases/view/38912)** (*"Every one of the four
downloads also contains the Location column, in the same position it holds on screen…"*), **PV-FILT-14
= [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)**, **TU-LOC-06 =
[C38915](https://shopview.testrail.io/index.php?/cases/view/38915)** and **IV-LOC-06 =
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917)**, each carrying its export anchor
(`S4-R13` / `S6-R11` / `S7-R13` / `S10-R15`) in `refs`. **All four re-read live via `get_case` this
session.** So the export defect is **fully closed across all five reports**, and only **Chris's spec
correction** remains open from that thread. *This correction is itself a small instance of Rule 44:
the register said the gaps were closed, our draft said they were open, and the honest move was to go
and look rather than to trust either document.*

---

## 8. What is being installed, and one thing left for the QA lead to decide

**Installed as Standing Rules (see `CLAUDE.md`):**

- **Rule 45 — OUTSIDE-IN GAP HUNT.** Before any suite is declared current, look at it from outside:
  a **foreign-coverage diff in both directions**, the **automation-engineer lens**, the
  **hostile-reviewer lens**, **every external signal logged and diffed** rather than merely answered
  — and **(e)** a COVERED verdict is only valid when it **quotes the requirement text and the
  covering case's text side by side**, with **multi-assertion requirements split per assertion**.
  Clause (e) is what closes the `N2` hole.
- **Rule 46 — DELIBERATE-DECISIONS / ANTICIPATED-CHALLENGE REGISTER.** Every deliberate
  non-authoring, PO-over-spec choice, held item and accepted imperfection is written down with its
  evidence and a plain one-sentence answer **before anyone asks** — so an intentional omission can
  never again be indistinguishable from a miss.

**Made real, not aspirational:** `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` — the
reverse half of the foreign-case checker, run live and read-only over all three active groups. It
reproduces this incident from cold: for **C38923** its closed-list collision detector narrows **474
of our cases to 8 candidates**, with both real defects — **C30285** and **C30286** — ranked **3rd and
4th**. Output: `REVERSE-DIFF-2026-07-31.md`.

**One decision for the QA lead (not taken unilaterally):** §4 shows **Rule 43 as written is
insufficient** — a per-requirement row reading *"covered by C30277"* passes while being wrong. The
evidence requirement is installed inside **Rule 45(e)**, but it arguably belongs **inside Rule 43
itself**, since that is the rule a spec-diff pass reads. **Recommendation: amend Rule 43 so that a
"covered" verdict must quote both texts, and so a requirement making more than one assertion gets
one row per assertion.** Not done without your say-so.

---

## OUTSTANDING — what I need from you

1. **A decision on the Rule 43 amendment** above (evidence-bearing verdicts + one row per
   assertion). *Blocks:* until then the `N2` failure mode is closed only via Rule 45's audit stage,
   not at the point the spec diff is processed — which is where it is cheapest to catch. *Since:*
   2026-07-31.
2. **A QA branch for the three active projects** — the single largest reason an outsider working from
   the build can out-see us (§5.1). *Blocks:* Rule 45's automation-engineer lens is limited to what
   the document says, and **nothing in any of today's documents is live-verified** (Rules 12/22).
   *Since:* 2026-07-31.
3. **One question to Vladimir Tomovic** — what source he authored **C38923** and **C38922 step 3**
   from (spec version, or the shipped build). *Blocks:* Rule 39 requires the other author's basis to
   be established, and "unknown" is only acceptable after asking. *Since:* 2026-07-31.
4. **One spec correction from Chris Ward** — SBR v15 `S14-R15`/`S14-R16` still enumerate CSV headers
   *"in order"* without the conditional Location column that its own `S14-R20` adds. *Blocks:*
   nothing directly (newer text wins), but it will keep regenerating this confusion. *Since:*
   2026-07-31.

The full cross-project list lives in `build/OUTSTANDING-ITEMS-REGISTER.md`.
