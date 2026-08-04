# The DO-NOT-AUTOMATE warning — 47 cases held pending Chris Ward · 2026-08-04

**The QA lead's instruction, verbatim:**

> *"Below the expected behavior make anothe rline and ask put a message DO NOT AUTOMATE until the
> file is answered by the PO."*

and, on the cases contradicting his own written spec: **"Do the same for the cases related to this."**

---

## 1 · THE EXACT TEXT WRITTEN, VERBATIM

Two lines, placed **after the `---` separator and immediately before the provenance line**, so the
provenance line stays last (Standing Rule 54):

```
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx
```

**The QA lead's sentence is used verbatim, not paraphrased.** The file is **named as well as
linked**, so the reference is usable by a reader who cannot open the repository.

### As it now reads on a real case — IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)

```
4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Note for the tester: the files carry the Location column when Location is turned ON in the column-selection control (it sits between Vendor and Qty). It does not appear just because you have more than one location selected.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026, and as per the Inventory Value report specification version 3 (S10-R3, S10-R4, S10-R5, S10-R6, S10-R15); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

---

## 2 · THE COUNT — 47, NOT 24, AND HERE IS WHY

The coordinator's figure was *"roughly 24"* with an explicit instruction to establish the true set.
**The true set is 47.** It is larger because two authoritative sources had to be unioned, and the
second one carries held cases the first does not.

| Source | Contributed |
|---|---:|
| The sheet actually sent to Chris — its **"Decisions we need from you"** items only (Tab 1 item 1, Tab 2 items 1–7, Tab 3 items 1–5) | 40 |
| **`final-push-2026-08-04/DELIBERATE-DECISIONS.md`** — cases marked **HELD** pending his ruling that the sheet does not list as decision items (D3 C30502 / C30564, D5 C30310 / C30315 / C30491, D7 C30096 / C30186) | +7 |
| **Union, de-duplicated** | **47** |

### The test I applied, stated so it can be challenged

**A case gets the line if Chris's answer could change WHAT THE CASE ASSERTS.** It does not get the
line if the only thing outstanding is **his spec text**, with the assertion already settled by a
ruling. This is the difference between *"we do not know what the right answer is"* and *"we know, and
a document needs updating"* — only the first is dangerous to automate.

### All 47, by what they are waiting on

| # | Group — what Chris has to decide | Cases |
|---|---|---|
| **G1** | **The Location column: does the user switch it on, or does it appear on its own?** | IV-COL-01 [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) · IV-COL-04 [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) · IV-PERS-02 [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) · IV-EXP-02 [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) · IV-LOC-06 [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) · WIP-COL-01 [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) · WIP-COL-02 [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) · WIP-FLT-09 [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) |
| **G2** | **Should a one-location user see the location chooser at all?** | SBR-LOC-04 [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · PV-FILT-13 [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) · TU-LOC-05 [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · WIP-FLT-06 [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) · IV-LOC-04 [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · SBC-LOC-01 [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) |
| **G3** | **Which identifier leads for a machine — its vehicle number or its unit number?** | WIP-COL-05 [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · WIP-SORT-03 [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · WIP-FLT-03 [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) · WIP-EXP-07 [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) · SBC-LBL-01 [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) |
| **G4** | **What is a sales representative called? Three sources give three words.** | SBR-EXP-10 [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) · SBR-EXP-11 [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) · SBR-WO-01 [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) · SBR-WO-06 [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) |
| **G5** | **How many choices does the date chooser offer, and is there a "Custom" one?** | SBC-DATE-01 [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) · SBC-DATE-03 [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) · SBR-DATE-01 [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) · PV-FILT-03 [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) · WIP-FLT-04 [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) · WIP-FLT-05 [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) · IV-DATE-01 [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) · IV-DATE-04 [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) |
| **G6** | **What should the four Technician Utilization download options be called?** | TU-EXP-01 [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) · TU-EXP-02 [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) |
| **G7** | **Should the Inventory Value spreadsheet carry an "As of" line at all?** | IV-EXP-04 [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) |
| **G8** | **The Sales By Representative download columns contradict each other.** | SBR-EXP-03 [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) · SBR-EXP-04 [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) · SBR-LOC-05 [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) |
| **G9** | **Where does the location column sit in the shorter "Summary" downloads?** | SBC-EXP-16 [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) · SBC-LOC-04 [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) |
| **G10** | **"The same logo treatment" — three descriptions describe three different rules.** | SBC-EXP-10 [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) · TU-EXP-06 [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) · TU-EXP-07 [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) · PV-EXP-05 [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) · PV-EXP-06 [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) |
| **G11** | **What value should an Estimate show — quoted, or approved?** | WIP-SUM-05 [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) |
| **G12** | **Two cases our own earlier pass said to ask him about first.** | SBC-NAV-01 [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) · SBC-VIS-02 [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) |

**By report:** Work In Progress 11 · Inventory Value 9 · Sales By Representative 9 ·
Sales By Customer 9 · Technician Utilization 5 · Parts Velocity 4 = **47**.
**By current status:** 34 already recorded as failing-against-a-requirement, 13 recorded as passing.

---

## 3 · WHAT I DELIBERATELY DID **NOT** STAMP, AND WHY

*A wrong reason is worse than no note, so each exclusion is reasoned and named.*

| Excluded | Cases | Why |
|---|---:|---|
| **The permission model** — one "can see reports" setting gates all six | **14** | **Chris has already answered** (Q2 = A) **and the QA lead ruled it too**, verbatim *"Yes all the reports will be gated by ONE permission FOR NOW"*. The cases assert the ruling **and** match the build. Only his spec text is outstanding. **Safe to automate.** |
| **The over-cap export message** | **6** | **Chris already answered** 2026-07-31 Q2 = A, *"great catch"*. The cases assert the agreed single message. Only his spec text is outstanding. **Safe to automate.** |
| **Sheet Tab 3 item 2** — have the six descriptions been updated yet? | **10** | The sheet says in its own words: **"Neither answer changes a case."** It is documentation debt, not a behaviour question. |
| **The empty-export pair** — SBC-EXP-15 [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) · SBR-EXP-16 [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) | **2** | **Held for a fresh observation by US, not for a ruling** — two of our own documents disagree about what the build does. Chris is not the blocker, so his file is the wrong reference to cite. Separate note handled with the not-verifiable group. |
| **The ~10 cases that assert a requirement the build breaches** | **~10** | **Not PO-blocked — dev-blocked.** They are the cases that *found* the bugs; they are expected to fail, they already say so, and an automated run failing on a real defect is correct behaviour. **Safe to automate.** |

### The one judgement I want on the record as a judgement

**SBC-LOC-01 = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) was INCLUDED even
though the sheet says it stands whichever way Chris answers.** The audit register's own D4 says all
six one-location-filter cases *"read as failures until either the build or the ruling moves"*, so on
the register's reading its assertion is exposed. **I chose the inclusive side because the risk is
asymmetric:** a false positive costs a tester one line of caution; a false negative lets an
automation engineer bake in a behaviour Chris may reverse. Reverse it freely if you disagree — no
assertion was touched, so removing the line restores the case exactly.

---

## 4 · WHAT WAS AND WAS NOT CHANGED

**Addition only — no assertion was altered on any of the 47.** Proven mechanically, not asserted:
the executor **counts the numbered expectation lines before and after every write and aborts if the
count changes**. It did not change on any case.

| Guarantee | How it was enforced |
|---|---|
| **No assertion changed** | numbered-line count compared before/after, per case; a change raises and stops the batch |
| **Provenance line stays LAST** (Rule 54) | insertion is positioned relative to the provenance line, which is required to exist — a case without one is refused |
| **Idempotent** | any pre-existing `DO NOT AUTOMATE` / `The open question is in:` line is **removed before insertion**, so a re-run replaces and never duplicates. **0 of the 47 had one already**, so this run added rather than replaced |
| **Ours only** (Rule 38) | `created_by == 3` asserted per case before writing; a foreign case would have raised |
| **Rule 41 whole-case re-read** | every case re-read end to end — title length, refs present and version-pinned, steps present, expected present, provenance present, no forbidden words. **13 fields per case. 0 findings across all 47** |
| **Rule 50 byte verification** | pre-write snapshot → write → re-GET → field-by-field compare. **47 writes, all HTTP 200, each "30 fields compared, 1 intended, 0 mismatch"** — every unintended field proven byte-identical |
| **Rule 7 wording** | plain English, no jargon, **the word "VIU" appears nowhere**, no flag name |

**Per-operation record:** `op-log.json` (47 entries) · pre/post snapshots in `/tmp/testrail/snapshots/`
(`C<id>.before.json` / `C<id>.after.json`) · executor `tools/stamp_hold.py`.

**Nothing else was touched.** No `add_case`, no `delete_case`, no section change, no run write.

---

## 5 · THE SEPARATE, ACCURATE LINE FOR THE CASES THAT ARE **NOT** PO-BLOCKED

Handled in `../not-verifiable-2026-08-04/` — 6 Work In Progress overnight-figure cases, 2 needing
more than a year of history, and the 2 empty-export cases held for our own re-observation. **They do
not name Chris**, because he is not what they are waiting on.

---

## 6 · OUTSTANDING — what I need from you

1. **Chris Ward's answers to the consolidated sheet.** Until they arrive, **47 cases carry the
   do-not-automate warning** and the automation engineer must skip them. That is the single largest
   thing standing between this suite and full automation. **Blocked on:** Chris Ward, chased by you.
2. **Do you agree with the 47, and specifically with including C30109?** §3 states the judgement and
   the asymmetric-risk reasoning. Removing the line from any case is one write and changes nothing
   else. **Blocked on:** you.
3. **Do you want the 14 permission cases and the 6 over-cap cases stamped too?** I excluded them
   because you and Chris have both already ruled, so automating them is safe — but if you would
   rather every case naming an unfinished spec edit carried the warning, say so and it is 20 more
   writes. **Blocked on:** you.
