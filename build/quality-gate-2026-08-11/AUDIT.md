# RUTHLESS USEFULNESS AUDIT — the final quality gate before tomorrow's release

**2026-08-11 · Schedule · Filters · Report Suite · Standing Rule 28**

The QA lead's words for tonight were *"make sure that nothing should bite us this time."* This is the
answer, with the numbers behind it.

---

## 1 · THE POPULATION, AND HOW IT WAS DERIVED

**240 cases: 13 created today, 227 materially changed today.**

Derived from **the repo record and live TestRail**, never from a summary. **Baseline** = the case
source at commit `43930ee3` (2026-08-10 23:53:10Z, the last commit before today). **Head** = live
TestRail, read this session.

| | Filters | Schedule | Report Suite | **Total** |
|---|---:|---:|---:|---:|
| **Created today** | 1 | 8 | 4 | **13** |
| **Materially changed today** | 43 | 51 | 133 | **227** |
| **= IN SCOPE** | **44** | **59** | **137** | **240** |
| Excluded — automation marker only | 1 | 0 | 35 | 36 |
| Excluded — provenance line / version pin only | 70 | 117 | 308 | 495 |
| Untouched | 0 | 0 | 0 | 0 |
| **Our live population** | **115** | **176** | **480** | **771** |

**13 + 227 + 36 + 495 = 771**, and 771 is every case we own across the three groups. The arithmetic
closes both ways.

**Created today:** C43590 (Filters) · C43582–C43589 (Schedule) · C43591–C43594 (Report Suite).

### What "materially changed" means, and why the exclusions are safe

The brief excludes provenance-only and version-pin-only edits because they change no tester-facing
meaning. To make that a **measurement rather than a judgement**, the `expected` field is split into
three parts and compared part by part:

- **body** — everything before the `---` separator; the assertion itself
- **provenance** — the Rule-54 line(s) after it
- **marker** — the trailing `AUTOMATION:` line

A case is **material** only if `title`, `preconditions`, `steps` or the **expected body** moved. A
case whose provenance was re-stamped or whose `refs` version pin was re-cut falls out **by
construction**. **495 of 771 fell out that way** — which is exactly what today's read-dates and
refs-pin passes were for.

### The baseline is independently corroborated

A stale baseline would inflate the population. It does not: the Filters re-sync pass at 17:48 measured
local against live and reported *"expected 114, refs 104, steps 22, preconditions 18, title 1"* — and
this pass's independent baseline-vs-live diff produced **expected 114, refs 105, preconditions 18,
steps 23, title 1**. Two different methods, same field counts.

**Foreign cases were excluded and never read for verdicts** (Rule 38): **Filters 5** (Ahtasham Amjad,
`created_by=7`) and **Report Suite 12** (Vladimir Tomovic, `created_by=1`).

---

## 2 · THE THREE-DIMENSION TALLY — the audit's own proof

**Every one of the 240 was cold-read on all three dimensions. This is not a sample.**
240 read of a population of 240 (Standing Rule 50).

### Dimension 1 — USEFUL

| Verdict | Count | % |
|---|---:|---:|
| **KEEP** | **240** | **100%** |
| MERGE | 0 | 0% |
| WEAK-KEEP | 0 | 0% |
| **CUT** | **0** | **0%** |

**Nothing was cut, and that is a finding rather than a courtesy.** The named slop patterns were hunted
explicitly — near-duplicates across areas, sort-direction and per-column explosions, per-column
display filler, tooltip present-vs-text splits, empty-state triplets, permission cases reducing to one
gate, export pairs duplicating a whole filter matrix. **The population is not padded**: it is
overwhelmingly *changed* cases from three mature suites that have already been through consolidation
passes (Filters 137→110, Schedule 190→165, Report Suite 515→459 earlier in the project's life), so the
padding was cut long ago. The 13 new cases each carry a distinct observable behaviour with a named
source.

### Dimension 2 — MAKES SENSE (cold read + cross-case sweep)

| Verdict | Count | % |
|---|---:|---:|
| **SENSIBLE** | **219** | **91.3%** |
| **FIX-WORDING** | **10** | **4.2%** |
| **NONSENSE** | **2** | **0.8%** |
| **CONTRADICTION** | **9** | **3.8%** |

**Contradictions found: 3 groups covering 11 cases. Resolved: 1. Escalated: 2.** Full working in
`CONTRADICTIONS.md`. **KEEP-but-NONSENSE — the embarrassment check — is 2**, both named and both in
the defect list; the goal is an empty list and it is not empty.

### Dimension 3 — GENUINE + LAYMAN-RUNNABLE

| Verdict | Count | % |
|---|---:|---:|
| **PASS** | **228** | **95%** |
| **FIX-WORDING** | **12** | **5%** |
| CUT | 0 | 0% |

**Traceability: 240 of 240 carry a `refs` value with both a ticket and a spec anchor.** 0 missing,
0 ticket-only.

### The hygiene census — measured LIVE across all 771, at **2026-08-12T02:06:27Z**

| Check | Result |
|---|---|
| Raw HTML markup shown literally to the tester (`<ol>`, `<li>`, `<p>`, `<br>`) | **0 of 771** |
| Stray CRLF in stored text | **0 of 771** |
| Automation markers | **exactly one per case, 771 of 771** |
| Rule-54 provenance lines | **exactly one per case, 771 of 771** |
| Titles over 80 characters | **0 of 771** |
| Marker is the last non-empty line | **771 of 771** |
| Broken numbering in a tester-facing field | **1** (C30102 — see the defect list) |

**The markup number is a measurement, not an assumption**, and the timestamp is stated because
TestRail can re-render text hours after a write **without moving `updated_on`** — which is also why
every "untouched" claim in this pass is proven by **content**, never by timestamp.

---

## 3 · IS THE CRITIC RIGHT? — the honest answer, on both halves

The standing claim is that AI produces *"more than 70% useless test cases"* and that *"some tests just
do not make sense."* Both halves get an answer.

### Half one — waste: **0% of the population is waste. The claim does not hold here.**

Zero CUT and zero MERGE across 240 cases. That is a strong number and it deserves its caveat: **this
population is not a fresh authoring batch.** It is today's edits to three suites that have already
survived consolidation and a Ruthless Usefulness Audit apiece. **The fair reading is that the waste
was removed earlier and has not come back** — not that a first draft would score 0%.

**Where the suites genuinely earn their keep** — the load-bearing coverage a reviewer should credit:
calculation contracts (Inv. Hrs as invoiced minus worked, half-up to one decimal; fixed-price
valuation; rollups from unrounded deltas), export-reflects-filters on four downloads across six
reports, permission gating, link targets, persistence and defensive restore of stale saved values,
and the empty/zero states. None of that is padding, and a failure in any of it is a real reportable
bug.

### Half two — incoherence: **the critic has a point, and it is 4.6%.**

**11 of 240 (4.6%) are not fully coherent** — 2 NONSENSE and 9 in one contradiction group. **That is
not zero and it should not be reported as zero.** More pointedly:

**🔴 Three of the eleven are regressions introduced TODAY, by our own passes:**

- **C30162 and C30287** were given a symptom block describing **a different report's columns** —
  absent from the baseline, added today. *(Repaired.)*
- **The nine-case Work In Progress download family was split down the middle today**, so the suite now
  asserts both that downloads work and that nothing downloads.

**And one of the two NONSENSE cases (C30102) predates today but was touched today**, which under Rule
41 means the pass that opened it owned the whole case and did not catch a title promising coverage its
body does not deliver.

**The honest conclusion: the volume was the problem.** Roughly a dozen cases created and several
hundred edited by many workers in one day, under a deadline, produced three defects that no mechanical
check would catch and that only a cold read finds. **This gate is the reason they were found before a
tester met them, and the argument for never skipping it.**

---

## 4 · WHAT WAS REPAIRED, AND WHAT WAS DELIBERATELY NOT

**Repaired — 3 cases, 3 `update_case` operations, each byte-verified.** Details and proofs in
`testrail-execution-log.md`.

| Case | What was wrong | Why it was safe to write |
|---|---|---|
| [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | The only 1 of 107 EXPECT-FAIL cases with no Rule-61 symptom and no three outcomes | Symptom quoted from our own recorded live observation on **the same build the case already names**; the edit is provably **additive** |
| [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | Symptom block describing the **Inventory Value** report on a Sales By Customer case | Used **only words already in the case**; deleted a false claim rather than adding one |
| [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) | Same wrong-report block on a Sales By Representative case | Same |

**No expectation was changed on any case** — expectations come from the documents (Rule 57) and this
pass had **no build session**. `custom_atmstatus` was never sent. 0 `add_case`, 0 `delete_case`, 0
section writes, 0 run writes, 0 results, 0 Jira calls.

**Not repaired, on purpose — 15 findings.** Each turns on a build fact this pass could not check, or
on a judgement about what the product should do. They are in `DEFECTS-PRIORITISED.md` with the exact
recommended change, and the reasoning is in `DELIBERATE-DECISIONS.md`.

---

## 5 · A CORRECTION TO ANOTHER AUDIT'S NUMBER, AND A LOCAL-SOURCE HAZARD CLOSED

A loss audit reported **6** stale Schedule bodies in the local case source. A full content comparison
of all 176 found **12** — the other six being C30043, C30044, C30045, C30047, C30050 and C30082,
every one a steps-only miss where the old *"Filter and Display"* / *"View Options"* wording survived.
**Six was what one audit happened to catch, not a measured total.**

All twelve are corrected **in the local files only** — live TestRail was already right, and no
TestRail write was needed. Regenerating any Schedule deliverable from local would have **reverted live
to labels the build does not use**, undoing this afternoon's 12-label push.

**Measured by CONTENT, never by counts.** Final state, all three suites:

| Suite | Live (ours) | Local | Drifted |
|---|---:|---:|---:|
| Filters | 115 | 115 | **0** |
| Schedule | 176 | 176 | **0** |
| Report Suite | 480 | 480 | **0** |

**And a near-miss worth recording:** the first comparison reported **479 of 480** Report Suite cases
as drifted. They were not. The local source stores preconditions and steps as **lists** while live
returns **newline-joined strings** — a representation difference, the same list-vs-string confusion
behind the `joinlines` shredding bug that corrupted three generated imports. **A naive reading would
have triggered a 479-case "correction" that corrupted nothing but wasted a night.** The comparator
normalises both sides; the tool is committed.

---

## 6 · HOW THE POPULATION WAS AUDITED — so the work is checkable

| Stage | Tool | Coverage |
|---|---|---|
| Population derivation | `tools/population.py` | 771 cases, both directions |
| Local vs live by content | `tools/local_vs_live.py` | 771 cases × 5 fields |
| Mechanical checks M1–M9 | `tools/mechanical_checks.py` | 240 cases |
| Hygiene census | inline, live | 771 cases |
| **Cold read, all three dimensions** | **by hand** | **240 of 240** |
| Stage 2b sweep, helpers (i)–(iv) | by hand + scripted greps | 240 cases |
| Per-case verdicts | `tools/verdicts.py` | `per-case-verdicts.csv`, 240 rows |

**The mechanical checks returned six hits and five were false positives** — a `$500` price, a row
count, CSS font weights, pixel widths, and the phrase *"not a JSON file"*. They are named here rather
than quietly dropped, because a defect list padded with false positives is how a real one stops being
read. **The sixth was genuine and is P1-3.**

**Everything else in this audit came from the cold read.** That is the point of the exercise.
