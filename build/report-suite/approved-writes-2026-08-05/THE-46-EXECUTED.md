# The 46 staged edits — EXECUTED, with the three corrections the research pass found

**Report Suite · epic SV-8582 · 2026-08-05**

**The QA lead's authorisation, verbatim:** *"We should do what is right to do. If our test case is
wrong then we need to correct it, our tests should tell the authentic expected behavior and steps oof
reproduction which should easily help a manual QA to follow them and reproduce the behavior."*

**Outcome in one line:** **50 operations, every one HTTP 200 and byte-verified, 0 mismatches** — the 46
staged edits (3 of them re-derived from the live specification because the staged wording was wrong),
**one extra case the manifest missed**, and **three titles that contradicted their own corrected
bodies**.

---

## 1 · WHAT HAPPENED TO OPS 23, 24, 25 — the three that would have failed a correct build

**They were re-derived from the live specification, not pushed as staged.**

The staged texts kept the shape of the old vehicle-number sentence and carried the word **plate**
across with it. **I verified the claim myself rather than taking it on trust:** Confluence page
703660034 version 6 fetched live today (HTTP 200, 47,260 bytes of page body) —
**`plate` appears 0 times.**

| Case | The staged text that was NOT pushed | The live requirement, verbatim | What was pushed instead |
|---|---|---|---|
| **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | *"2. When the asset has no Unit #, the cell shows its VIN instead; when it has neither, it shows its **plate** instead."* | **S4-R8:** *"When a work order has no unit number, the Asset cell's first line shows **"(no unit #)"**; when it has no vehicle identification number, the second line shows **"— no VIN —"**."* | *"2. When the work order has no Unit #, the first line reads "(no unit #)"; when it has no VIN, the second line reads "— no VIN —". Nothing else stands in for a missing value - there is no further fallback."* |
| **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | *"4. The Asset column sorts by the identifier it shows - the Unit #, falling back to the VIN, **then plate**."* | **S4-R9:** *"**The Asset column sorts by unit number.**"* | *"4. The Asset column sorts by the Unit #."* |
| **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | *"2. Each option identifies the asset by its Unit #, **falling back to the VIN, then plate**…"* | **S7-R4:** *"Each option shows **the unit number and the vehicle identification number**, and the user's typed text matches against **EITHER** the unit number **OR** the vehicle identification number."* | *"2. Each option shows both the asset's Unit # and its VIN."* and *"3. Text you type matches against either the Unit # or the VIN - a match on either one brings the asset up."* |

**Why this mattered.** A tester seeding an asset with no unit number would have seen **`(no unit #)`** —
exactly what the specification promises — while the test told them to expect a vehicle number, then a
plate. **They would have failed a correct build and raised three false defects.** It is the same trap
the freeze was protecting against, re-introduced inside the fix. It also breached Standing Rule 42: a
closed list (*"…then plate"*) pinned to nothing.

**A machine gate now enforces it:** the executor **refuses to run** if the word *plate* survives in any
case's expected result **except C30134**, where the plate chain is ratified Sales By Customer text
(version 13, **S8-R9**: *"When the vehicle has no VIN and no Unit number, the label is the vehicle's
plate."*). **C30134 was pushed with its plate intact, deliberately.**

### A fourth case needed the same correction to its provenance line

**WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) carried no plate,
but its staged provenance said *"Where the Work In Progress report specification version 6 (S9-E1) says
something different…"*. **S9-E1 says the same thing** — read live: *"in the downloaded PDF/CSV the same
two columns are headed "Unit" and "Branch" (Story 9, S9-E1)"*. Corrected to the agreement wording.

---

## 2 · THE DIVERGENCE SENTENCE — and where inventing one would have been the defect

The QA lead's new requirement: name **where Chris asked for the behaviour**, **where it differs from an
earlier source**, and **that the latest information prevails**. His instruction also says a case that
follows his answer with **nothing earlier contradicting it** gets **no** divergence sentence.

| Shape | Count | What the line says |
|---|---:|---|
| **His answer is the basis and it DIFFERS from a specification** | **21** | Names his file with its link and the date, names the specification, version and the exact requirements it differs from, and says his decision is the authority |
| **His answer CONFIRMS what the specification and the build already say** | **12** | Names both, then *"Chris Ward confirmed this on 8/5/2026 in his answers in this file: …"*. **No divergence sentence — there is no divergence** |
| **The specification is SILENT, so his file is the sole basis** | **2** | Says the specification is silent and that it has not been confirmed on a build |
| **Ordinary — released unchanged in substance** | **2** | Build + specification only; his answer changed nothing about it |
| **The four Work In Progress identifier cases — the honest form** | **4** | See below |
| **Parts Velocity, the extra case** | **1** | Specification for the column defaults; his answer for the Location part, with the divergence named |

### The four Work In Progress cases got the HONEST divergence, not the invented one

The staged line asserted *"Where the Work In Progress report specification version 6 … says something
different…"* — **but the specification says the same thing.** It has said *"the unit number on the first
line in bold"* (S4-R7) and *"sorts by unit number"* (S4-R9) in every version since the page was written,
and version 6 was saved at **06:33Z on 29 July, BEFORE** his same-day ruling, and never revisited. **So
what moved on 29 July was our four test cases, not the document.**

**What was pushed instead, verbatim:**

> This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per
> the Work In Progress report specification version 6 (S4-R7, S4-R8, S4-R10) — the build and that
> specification agree. Chris Ward confirmed it again on 8/5/2026 in his answers in this file: *(link)*.
> It differs from an earlier answer he gave us on 29 July 2026, which we now know was given against a
> question that described this report incorrectly; we follow his latest word, which agrees with the
> specification.

**It names all three things the ruling asks for, and it does not manufacture a conflict that does not
exist** — which the ruling's own honesty clause forbids.

---

## 3 · C30525 — CHECKED, AND IT NEVER ENTERED THE WRITE SET

**WIP-VIS-07** = [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) — the live case that
has been asserting *"the two-line asset cell (bold unit over muted VIN)"* for seven days, contradicting
the four the batch is about, and **right all along**.

**It is not in the 46**, it was not added, and **the executor carries a hard assertion that refuses to
run if C30525 appears in the plan at all**. Its `updated_on` is unchanged between the pre-write and
post-write snapshots. **Nothing touched it.**

---

## 4 · THE ADDITIONAL CASES CORRECTED

### 4.1 · PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) — the eighth live-and-wrong case, absent from the manifest

Its line 3 said the Location column *"is not in the column picker"* — **wrong under both readings** of
Chris's contradictory answer, so it was correctable today. Now:

> 3. When more than one location is selected the Location column shows as well, leftmost before Type —
> 15 columns. It is already switched on for you; you do not have to turn it on, and you can switch it
> off again. It is not part of the 14-column default set, so its presence is expected and is not a
> failure of this test.

**It also keeps a hold line**, because its first-visit behaviour is one of the 11 genuinely blocked on
his clarification.

### 4.2 · WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) — the precondition its expected result did not need

Rule 41 says a case opened for any reason is re-read whole. Precondition 4 read *"Location is turned ON
in the column-selection control (**it is off by default**)"* — which both readings contradict once
several locations are selected. Rewritten to *"More than one location is selected, so the Location
column is showing. If it is switched off, turn it back on in the column-selection control."*
**Its expected result — the column order — needed no change and got none.**

### 4.3 · THREE TITLES THAT CONTRADICTED THEIR OWN CORRECTED BODIES — found by our own sweep

**This is a defect the manifest missed and our first read-back caught.** After the 47 writes, a
title-versus-expected sweep (Standing Rule 28) found three titles still asserting the plate:

| Case | Title before | Title now |
|---|---|---|
| **C30470** | *"Asset cell identifies the asset by VIN, falling back to Unit #, then plate"* | *"The Asset cell shows the Unit # in bold with the VIN underneath"* (62) |
| **C30500** | *"Asset filter matches VIN, Unit #, or plate; "All assets" when empty"* | *"Asset filter shows Unit # and VIN and matches text against either one"* (69) |
| **C30485** | *"Columns sort by underlying values; Asset sorts by the identifier shown"* | *"Columns sort by their underlying values; Asset sorts by the Unit #"* (65) |

**Had these been left, each case's title would have told the tester the opposite of its own expected
result** — and the plate would have survived the very correction that removed it.

---

## 5 · WHICH CASES STAY HELD, AND WHY

**16 cases carry a hold line now, down from 47.**

### The 11 genuinely blocked on Chris's self-contradiction — now citing the RIGHT sheet

C30352 · C30437 · C30467 · C30551 · C30554 · C38912 · C38913 · C38914 · C38915 · C38916 · C38917

Their hold line was **re-pointed from the answered 4 August sheet to the live follow-up question**:

> DO NOT AUTOMATE YET: part of this behaviour is still waiting on an answer from the product owner.
> Automating it now could lock in the wrong behaviour.
> The open question is in: Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx — *(raw link)*

**Four of these were LIVE and unwarned before this pass** — C30352, C30437, C38914, C38915 — and have
**gained** a hold. That is deliberate: they are wrong, they cannot yet be corrected, and a wrong live
case with no warning is the worst of the three states.

### The 5 that keep their old hold, correctly

C30096 · C30186 · C30310 · C30315 · C30502 — none is in the 46 and none is in Task A. Three are
genuinely waiting on items Chris left blank; C30186 and C30502 are the two whose questions **were never
asked** (both are asks in the Task A paper).

### 35 released

35 of the 47 came off the hold list, because his answers settle what they assert.

---

## 6 · READY TO AUTOMATE — the proven figure is 432, and both methods agree

**The readiness file's own formula, which I did not change and did not edit:**
`469 − 47 waiting on Chris − 14 cannot be run here − 6 not built − 1 QuickBooks = 401`.
Its columns are **mutually exclusive** — `385 + 16 + 47 + 14 + 6 + 1 = 469`, and `385 + 16 = 401` —
so releasing a held case adds exactly one.

| Movement | Effect |
|---|---:|
| Released from the waiting-on-Chris column | **+35** |
| Moved **into** that column (live-and-wrong, now warned) | **−4** |
| 4 new cases added, all on `AUTOMATION: HOLD` | +4 to the total, **+0** to ready |
| **PROVEN READY FIGURE** | **432** |

**Cross-checked a second, independent way:** `473 total ours − 16 held − 14 − 6 − 1 − 4 new-HOLD = 432`.
**Both give 432.**

**432, not the projected 440** — because 4 cases correctly moved *into* the held column and the 4 new
cases are on HOLD until someone runs them once. **The figure is what I can prove, not what was hoped
for.** `READINESS-2026-08-04-POST-DEPLOY.md` is owned by another worker and was **not edited**; it still
states 401 and will need this movement folded in.

---

## 7 · VERIFICATION (Standing Rule 50 — exhaustive, then exact)

### The operations

| Batch | Ops | Result |
|---|---:|---|
| The 46 staged edits (3 re-derived) | 46 | **all HTTP 200** · 30 fields compared each · every intended field byte-equal to the intended payload · every untouched field byte-identical to its pre-write snapshot · **0 mismatch** |
| The extra case PV-COL-02 | 1 | **HTTP 200**, same verification |
| The three contradicting titles | 3 | **HTTP 200**, same verification |
| **Total this pass** | **50** | **0 mismatch, no sampling** |

Intended fields written: `custom_expected` on all 47 · `title` on 5 (2 staged + 3 corrections) ·
`custom_preconds` on 1. **`refs` was not written by any operation** and was proven byte-identical on
every case; the declared normalisation `','.join(p.strip() for p in s.split(','))` is stated for
completeness. **0 add · 0 delete · 0 section · 0 run writes.**

**Pre-write gates that would have refused to run:** C30525 in the plan · the word *plate* surviving
anywhere but C30134 · a missing `---` separator · a hold line present on a case that should not have one
or absent from one that should · a title over 80 characters. **All passed before the first write.**

### Run 359 — PROVEN UNTOUCHED, and the one difference fully explained

| Check | Result |
|---|---|
| Tests | **469 → 469**, `case_id` sets **equal in both directions** (A−B 0, B−A 0) |
| Result records | **532 → 532**, **every prior result present BY ID** |
| `include_all` · `is_completed` · `name` · `id` | **unchanged** |
| Writes to the run | **zero** — no `add_result`, no `update_run`, no `add_run` |

**Three of the 532 result records differ in exactly one field, and it is not a write.** The only field
that differs anywhere across all 532 is **`case_title`**, on 3 records belonging to **C30104** and
**C30439** — the two cases whose titles the batch was authorised to change. `case_title` is a
**derived echo** of the case's current title that TestRail returns at read time.

**Proven, not asserted:** `status_id`, `comment`, `created_on`, `created_by`, `elapsed`, `defects`,
`version`, `test_id` and `id` are **byte-identical on all 532 records**. **No graded result moved.**

> **A NEW declared normalisation, recorded per Standing Rule 50:** `get_results_for_run` echoes the
> case's **current** `case_title` into historical result records. A result whose case has since been
> retitled therefore reads back differently **without any run write**. Verify run results on the fields
> above and treat `case_title` as derived.

### Vladimir Tomovic's five cases — untouched

**C38919 · C38920 · C38921 · C38922 · C38923: byte-identical between the pre-write and post-write
snapshots, INCLUDING `updated_on` and `updated_by`.** Not read into any plan, not written, not counted
as ours.

### No collateral damage anywhere in the suite

Every case under group 4281 was compared pre versus post, ignoring only `updated_on`/`updated_by`:

- **50 cases changed content.** Every one is in the authorised write set.
- **Cases changed but NOT in the write set: NONE.**
- **Cases in the write set but unchanged: NONE** — so no operation silently no-opped.
- **474 → 478 cases** under the group; the 4 additions are exactly C43550–C43553.

---

## 8 · DELIBERATE DECISIONS AND HONEST DEFECTS OF OUR OWN

### 8.1 · A DEFECT I INTRODUCED AND THEN CAUGHT — a retired internal ID reused

**`SBC-COL-03` was not a free identifier.** It was **retired on 2026-07-28**, merged into SBC-COL-02 and
deleted from TestRail. My Task B pass took the next apparently-free number and reused it, and the
resync then **overwrote the retired record's stored body** with the new case's text.

**Both halves are repaired:**

1. The retired `SBC-COL-03` record was **restored byte-for-byte from git** and asserted equal to the
   committed original.
2. The new case is now **`SBC-COL-04`** — an identifier no live or retired record uses — in the local
   source and the id-map. **No TestRail write was needed**, because the internal ID lives only in our
   own files. **C43550 is unchanged in TestRail.**

**The other three new IDs were checked against all 66 retired records: no collision.** Stated here
because a silently-reused retired ID would have corrupted the historical record, and I would rather own
it than have it found later.

### 8.2 · The `---` separator the manifest would have dropped from 39 cases

**All 469 live cases carry a `---` line before the provenance line. Only 7 of the 46 staged texts kept
it.** Pushing them as staged would have dropped it from 39 cases and split the suite into two formats.
**It is restored by the builder** and re-verified: **0 of 473 cases are missing it.**

### 8.3 · Two conventions for the same idea — flagged, not silently merged

The suite marks un-automatable cases with a **`DO NOT AUTOMATE YET` block placed BEFORE the provenance
line**; the four new Task-B cases use the QA lead's newer **`AUTOMATION: HOLD` marker placed LAST**.
**Both are now in the suite: 16 of the first, 4 of the second.**

I did **not** convert the 46 to the new marker. Introducing a second marker on 47 of 473 cases would
have made the readiness count ambiguous, and the readiness figures are computed from the existing block.
**This is a question, not a decision: say which convention you want and it is one mechanical pass.**

### 8.4 · What I did NOT do, on purpose

- **`CLAUDE.md`'s cross-project asset-identifier rule was not touched** — another worker is researching
  it, and the recommendation in `VIN-ORDER-RULING.md` is yours to accept or rewrite.
- **No case in the other five reports was touched on the identifier point.**
- **`READINESS-2026-08-04-POST-DEPLOY.md`, `chris-answers-2026-08-05/` and `rulings-2026-08-05/` were
  not edited** — all three are owned by other workers.
- **SBC-LBL-01's over-hedge was left alone** (its line 4 still says *"confirmed in the build"* where
  version 13 S8-R10 now pins *"Unknown Asset"*). Outside what was authorised; it is an ask.

---

## 9 · DELIVERABLES REGENERATED — all four counts reconcile

| Check | Result |
|---|---|
| Local case source **re-synced FROM LIVE before regenerating** | **60 field updates across 26 files** |
| **Shredding guard** (the Schedule project's `joinlines` bug) | **PASSED** — no field is a string where a list is expected, no shredded field |
| Shredded cells in the emitted import | **0** |
| **live (ours) · id-map · import rows · local active** | **473 · 473 · 473 · 473** |
| live == id-map, **both directions** | **True** — A−B 0, B−A 0 |
| import titles == live titles, **both directions** | **True** |
| id-map blank C-ids | **0** (the generator blanks all 473 on every rerun; all 473 re-merged from live by exact section + title, **0 unmatched**) |
| Duplicate titles in the import | **NONE** |
| Import header sha256 identical to **all five** peer project imports | **True** |
| VIU words · feature-flag words · internal-id leaks | **0 · 0 · NONE** |
| API cases not in an `API` section | **NONE** (28 API cases, all correctly placed) |

*(The local source holds 538 records; the generator correctly excludes the **66 marked Retired**,
emitting 473.)*

---

## 10 · OUTSTANDING — what I need from you

1. **One sentence from Chris on the location column** — for someone who can reach several branches but
   has selected one, is the Location option in the column list? It unblocks **11 held cases**, the new
   case N2, and developer ticket **B4**. The follow-up sheet is ready to send.
2. **Which automation marker do you want** — the existing `DO NOT AUTOMATE YET` block, or the newer
   `AUTOMATION: HOLD` marker? Both are in the suite now and I will not guess (§8.3).
3. **The readiness file needs the movement folded in** — it still says 401; the proven figure is **432**.
   It is owned by another worker, so I did not edit it.
4. **A line on the `CLAUDE.md` cross-project identifier rule** — the narrowing wording in
   `VIN-ORDER-RULING.md` §3 is yours to accept or rewrite.
5. **Go-ahead for two more small corrections** found by the whole-case re-reads: **SBC-LBL-01**'s
   over-hedge, and **C30440**'s step 2 which still names three short-form download options against
   Chris's T2-6 = B answer.
6. **Fresh sign-in for the QA branch.** It redeployed to **`v3.5-16cf83f`** at 06:40 GMT today, two
   builds on from the observations everything here rests on. **No application was opened this pass**,
   the Rule-49 queue stays **OPEN**, and every verdict on all 473 cases remains provisional.
