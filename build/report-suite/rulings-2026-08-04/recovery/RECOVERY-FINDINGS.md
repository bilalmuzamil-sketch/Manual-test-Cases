# RECOVERY — what the interrupted run finished, what it did not, and what is left · 2026-08-04

The QA-lead rulings pass was **interrupted part-way through Ruling 3's analysis** and its closing report
was truncated. This document establishes, **from evidence rather than inference**, exactly where it
stopped, proves the live state is coherent, and records the only work that was safe to finish.

**Its history is intact.** `../testrail-execution-log.md` was **appended to** under a
`# RECOVERY 2026-08-04` heading — nothing above that heading was rewritten.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| WIP spec | Confluence **703660034** | **version 6**, 2026-07-29T06:33:58Z | **2026-08-04, live** | **CURRENT** |
| IV spec | Confluence **720142338** | **version 3**, 2026-07-29T06:32:54Z | **2026-08-04, live** | **CURRENT** |
| SBR spec | Confluence 585629698 | version 15, 2026-07-29T06:38:33Z | 2026-08-04, live | **CURRENT** |
| SBC spec | Confluence 577634305 | version 13, 2026-07-31T13:02:21Z | 2026-08-04, live | **CURRENT** |
| Jira tickets | SV-8818…SV-8823 | read live | 2026-08-04 | **CURRENT** |
| Epic | SV-8582 | **not re-read** — a full re-read is a Rule-37 ask | — | **PARTIAL** |
| Live build | `sv8582.qa.shopview.com` `v3.4.1-0ed4433` | **declared NOT FINAL** | 2026-08-03/04 | **PARTIAL (Rule 49)** — `../../viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** |

The two versions the pins wrote were **verified live today**, not taken from memory or from the other
cases. They also agree with the value already carried by the 431 pinned cases — duplication raising
confidence (Rule 32).

---

## 1 · WHAT IT COMPLETED

**Ruling 1 — finished, and finished correctly.** All 15 previously-BLOCKED cases have a definite
verdict, written up in `../RULING-1-THE-15-CASES.md` and mirrored into
`../../audit-exhaustive-2026-08-04/per-case-verdicts.csv`. Its **2** TestRail writes are live and
byte-verified: **C30259** `"occured"` → `"occurred"`, **C30255** Cancel is grey not "red outline".
The `BLOCKED-BY-DEFECT` bucket is empty; the ledger reads **329 PASS / 116 DEVIATION / 13 NOT-BUILT /
20 EXTERNAL-DEPENDENCY / 0 BLOCKED = 478** and reconciles both ways.

**Its "there was no SV-8821 line to remove" claim is TRUE — and I widened the check it ran.** It grepped
only the 15 cases. I grepped **all 478 live cases** for `SV-8818`…`SV-8823` and for the phrases "known
issue", "filed for a fix", "awaiting a fix", "has been filed":

| Ticket cited on a case | Live Jira status | Cases citing it | Misleading? |
|---|---|---|---|
| SV-8818 | **Open**, Low | 10 | no |
| SV-8819 | **Open**, Low | 2 | no |
| SV-8820 | **Open**, Low | 4 — incl. C30565, one of the pin targets | no |
| **SV-8821** | **OBSOLETE / Done** | **0** | — |
| **SV-8822** | **OBSOLETE / Done** | **0** | — |
| **SV-8823** | **OBSOLETE / Done** | **0** | — |

**All 16 "known issue / filed for a fix" lines in the suite point at the three tickets that are still
Open.** No case anywhere points a tester at a closed ticket. Nothing to correct.

---

## 2 · WHAT IT STARTED AND DID NOT FINISH

**Ruling 3 — started, produced nothing durable, and is NOT recoverable from its own artefacts.** Its
truncated closing line concerned an export payload builder carrying no column list, so the analysis was
live in the session; but there is **no Ruling-3 evidence file, no findings document and no plan**
anywhere in `../`, and the working tree was **clean** (the interrupted worker had committed everything it
wrote). **The analysis is lost and must be re-run from scratch** when authorised — it needs a fresh live
export drive, which is new verification work rather than recovery, so this pass did not attempt it.

Its two subjects, for whoever picks it up:
**IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)** (money arrives as
text) and **IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589)** (chosen
columns ignored and re-ordered) — the behaviour **SV-8823** covered, which the QA lead set to
**OBSOLETE**. `../../final-push-2026-08-04/DELIBERATE-DECISIONS.md` **D15** already flags the honest
consequence: a tester will fail these two and re-report a closed defect, and neither case carries an
explanatory line because writing *"reviewed and not raised"* would have been untrue. **That is still an
open decision for the QA lead, and this pass deliberately left it alone.**

---

## 3 · WHAT IT NEVER BEGAN

**Ruling 2 — never executed, and no execution is needed.** The ruling was to find any case covering the
**SV-8822** API-only behaviour and delete it if it covered only that. Two independent checks agree there
is nothing to delete:

- our own pre-existing record, `../../defect-pack-2026-08-04/CASE-IMPACT.md` §SV-8822: **"None."** — the
  fault blocked one API-only seeding shortcut, which was then completed through the shape the UI uses;
- a live search of all 478 cases: **0** mention `SV-8822`, and **0** reference a sales-rep-id field or a
  customer-save endpoint in any tester-facing field or in `refs`.

**Verdict: Ruling 2 is satisfied with zero writes.** Recorded rather than quietly skipped.

**The 7 reference pins — never began. Now DONE by this pass** (see §5).

**The 9 merges + 1 cut — never began, and NOT started here.** Deletion authority does not carry into a
recovery pass. Every one of the 19 cases involved is **present and byte-identical to the pre-run
baseline**, so the plan in `../../audit-exhaustive-2026-08-04/AUDIT.md` is intact and re-authorisable
exactly as written:

| Group | Absorbed | Survivor | State of both |
|---|---|---|---|
| MG-IV-SNAPSHOT-RERUN | IV-API-04 = [C30608](https://shopview.testrail.io/index.php?/cases/view/30608) | IV-API-03 = [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | present, byte-identical |
| MG-IV-TOTALS-POSITION | IV-SORT-04 = [C30586](https://shopview.testrail.io/index.php?/cases/view/30586) | IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | present, byte-identical |
| MG-PV-REVERSAL | PV-ROW-10 = [C30350](https://shopview.testrail.io/index.php?/cases/view/30350) | PV-CALC-06 = [C30364](https://shopview.testrail.io/index.php?/cases/view/30364) | present, byte-identical |
| MG-SBC-EMPTY-LOADING | SBC-EMPTY-02 = [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) | SBC-EMPTY-01 = [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | present, byte-identical |
| MG-TU-LOC-FALLBACK | TU-LOC-04 = [C30445](https://shopview.testrail.io/index.php?/cases/view/30445) | TU-LOC-03 = [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | present, byte-identical |
| MG-WIP-SNAPSHOT-SHAPE | WIP-API-02 = [C30529](https://shopview.testrail.io/index.php?/cases/view/30529) | WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | present, byte-identical |
| MG-WIP-SNAPSHOT-PRECISION | WIP-API-05 = [C30532](https://shopview.testrail.io/index.php?/cases/view/30532) | WIP-API-03 = [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | present, byte-identical |
| MG-WIP-TAB-COUNTS | WIP-TAB-03 = [C30453](https://shopview.testrail.io/index.php?/cases/view/30453) | WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | present, byte-identical |
| MG-WIP-TOTAL-PINNED | WIP-VIS-03 = [C30521](https://shopview.testrail.io/index.php?/cases/view/30521) | WIP-TOT-01 = [C30494](https://shopview.testrail.io/index.php?/cases/view/30494) | present, byte-identical |
| **CUT** | IV-SCOPE-05 = [C30544](https://shopview.testrail.io/index.php?/cases/view/30544) | — | present, byte-identical |

---

## 4 · NOTHING WAS IN A DANGEROUS HALF-STATE — and here is the proof, not the assurance

The half-done merge was the state worth fearing: content folded into a survivor with the absorbed case
still live (silent duplication), or an absorbed case deleted with its content never folded in (**silent
coverage loss**). **Neither happened, because no merge was touched at all.**

A full re-pull of every case under group 4281, diffed field by field against
`../baseline/live-cases-4281-START.json`:

| Check | Result |
|---|---|
| Live under 4281 | **483** · ours (`created_by == 3`) **478** · foreign **5** — identical to before the run |
| Case-id set vs START | **EQUAL in both directions** — **0 deleted, 0 added** |
| Cases whose content changed during the interrupted run | **exactly 2** — C30255, C30259, `custom_expected` only |
| Cases whose `updated_on` moved | **exactly the same 2** |

Because **nothing was deleted**, no restore-from-snapshot was needed, and the `baseline/` snapshots were
not drawn on for repair.

---

## 5 · WHAT THIS PASS FINISHED — the 7 reference pins, and only that

The **one** task the previous pass had knowingly left unfinished
(`../../final-push-2026-08-04/DELIBERATE-DECISIONS.md` **D14 / D16**): seven cases whose `refs` cited the
spec as a bare file path with no version. Metadata only — a pin cannot alter an assertion.

| Case | C-id | `refs` before | `refs` after |
|---|---|---|---|
| WIP-VIS-01 | [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | `SV-8666 (specs/wip-work-in-progress.md Story 10 S10-R1)` | `SV-8666 (WIP spec v6 2026-07-29 Story 10 S10-R1)` |
| IV-NAV-03 | [C30536](https://shopview.testrail.io/index.php?/cases/view/30536) | `SV-8668 (specs/inventory-value.md …)` | `SV-8668 (IV spec v3 2026-07-29 Story 1 S1-R3; Story 7 S7-R2)` |
| IV-DATE-05 | [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) | `SV-8672 (specs/inventory-value.md …)` | `SV-8672 (IV spec v3 2026-07-29 Story 5 S5-R5; S5-R6)` |
| IV-LOC-01 | [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | `SV-8674 (specs/inventory-value.md …)` | `SV-8674 (IV spec v3 2026-07-29 Story 7 S7-R1; S7-R2; Story 12 S12-R3 — …)` |
| IV-EXP-03 | [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | `SV-8677 (specs/inventory-value.md …)` | `SV-8677 (IV spec v3 2026-07-29 Story 10 S10-R7 (+ context note))` |
| IV-VIS-01 | [C30596](https://shopview.testrail.io/index.php?/cases/view/30596) | `SV-8679 (specs/inventory-value.md …)` | `SV-8679 (IV spec v3 2026-07-29 Story 12 S12-R1)` |
| IV-VIS-02 | [C30597](https://shopview.testrail.io/index.php?/cases/view/30597) | `SV-8679 (specs/inventory-value.md …)` | `SV-8679 (IV spec v3 2026-07-29 Story 12 S12-R2; S12-R3)` |

**7 `update_case`, every one HTTP 200 and byte-verified: 30 fields compared, 1 intended, 0 mismatch,
every untouched field proven byte-identical to its pre-write snapshot.** Ticket keys, anchors, ordering
and trailing notes are unchanged — only the bare path became a versioned name. **0 of 478 cases now cite
a bare `specs/` path.** Per-op record: `pins-op-log.json`; snapshots: `snapshots/`.

**Provenance line (Rule 54): checked on all 7, no re-stamp required** — each already ends with the
correct build date **8/4/2026**, the correct specification version and the correct anchors. C30574 keeps
its honesty variant for the video-override ruling.

### The Rule-41 second finding — recorded, not fixed

**IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589)**, expected result 2:
*"In the CSV, money values are written as plain numbers with two decimals and NO thousands separators
(so they parse cleanly in a spreadsheet)."* **The IV spec does not say this.** Its anchor `S10-R7` says
only *"Money and Margin % use two-decimal and one-decimal formats respectively; an undefined Margin %
shows '—'"*, and `S3-R10` describes the **on-screen** format as carrying `"$"` **and** thousands
separators. Nothing in Story 10 states a CSV plain-number rule — which is why the case's own `refs`
carries the hedge `(+ context note)`.

**Not changed, for two reasons.** It is outside a pin's remit, and it is the **same assertion SV-8823
covered** — a ticket the QA lead closed as OBSOLETE — so it sits inside the **D15 decision that is
already his to make**. Raised here rather than left silent (Rules 42/45(e)).

---

## 6 · THE COUNTS, proven by set equality in both directions

| # | Population | Count | Set equality |
|---|---|---:|---|
| 1 | **Live ours** under group 4281 (`created_by == 3`) | **478** | — |
| 2 | **`testrail-id-map.csv`** rows | **478** | **EQUAL to live both ways** on C-ids · 0 blanks |
| 3 | **Unified import** data rows | **478** | all 478 titles matched live; **References 0 differ · Expected Result 0 differ** |
| 4 | **Six per-report imports** | 85 + 111 + 72 + 60 + 79 + 71 = **478** | headers byte-identical (same SHA-256) across all 7 files |
| — | **Verdict ledger** `per-case-verdicts.csv` | **478** | **EQUAL to id-map both ways** on C-ids |
| — | Live **foreign** cases under 4281 | **5** | C38919–C38923, **byte-identical incl. `updated_on`/`updated_by`** |
| — | **Live total** under 4281 | **483** | ours 478 / live 483, stated both ways per Rule 38 |

### One honest exception, pre-existing and not caused by this run

`build/report-suite/cases/*.json` holds **535** case bodies, of which **57 are not in the id-map** —
exactly the 57 deleted in the 2026-07-28 consolidation. Their bodies were kept locally as the retire
convention requires, but **their `viu_status` was never marked `Retired`**, so a generator that filters
on that flag still counts them. Consequence: `cases/*.json` is **NOT** in set equality with the id-map,
and **`gen_import.py` must not be re-run against it** — it would emit 535 rows in the old `refs` format
and destroy the live-accurate import. (This pass therefore patched the import **surgically** and proved
the result matches live on all 478 rows, rather than regenerating.) **Flagged, not fixed:** marking 57
bodies Retired changes what every generator emits, which is the QA lead's call.

---

## 7 · RUN 359 — integrity, checked before and after

`include_all` **false**. **478 tests before → 478 after.** **539 result records before → 539 after.**
Case-id sets **EQUAL in both directions**; **every one of the 539 prior results verified PRESENT BY ID**,
not by count — 0 missing. The run's 478 case ids are **set-equal to our 478 live cases**, so Rule 47
completeness holds with nothing to sync. **No `add_case` or `delete_case` was performed, so no
`update_run` was required** — and none was attempted, which is the point: `update_run` replaces a
selection and a partial list would have destroyed those 539 records.

---

## 8 · OUTSTANDING — what I need from you

1. **Authorise the 9 merges + 1 cut** (478 → 468). The plan is intact and byte-verified untouched;
   each group has a named survivor. Approvable wholesale or per group. **Blocked on:** you.
   **Why it was not done here:** deletion authority does not carry into a recovery pass, and a merge
   half-applied is worse than one not started.
2. **Ruling 3 must be re-run from scratch** — the interrupted pass left no durable artefact of its
   analysis. Say the word and it needs a live export drive on the QA branch (and fresh access if the
   session has died). **Blocked on:** you.
3. **The D15 decision on IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)
   and IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589).** SV-8823 is
   OBSOLETE, so a tester will fail these two and re-report a closed defect. Either re-open SV-8823, or
   tell us to write a plain *"known and accepted, do not re-report"* line on both. **Blocked on:** you.
4. **The C30589 CSV plain-number assertion has no spec basis** (§5 above). Fold it into the same D15
   decision, or ask Chris Ward to add the rule to the IV spec. **Blocked on:** you, then Chris Ward.
5. **Mark the 57 consolidated-away bodies `Retired` in `cases/*.json`?** Until then that directory
   cannot be used to regenerate the import. **Blocked on:** you (it changes generator output).
6. **The four Ruling-1 asks are still open** — the six new Story-13 deviations (the pre-check count
   returning 0 is the load-bearing one), the C30314 customer-rep fallback, the S13-R8 Escape spec
   correction for Chris Ward, and whether the S13 dialog copy was signed off. See
   `../RULING-1-THE-15-CASES.md` §OUTSTANDING. **Blocked on:** you, then Chris Ward.
7. **Rule 49 stays OPEN.** The build is declared not final, so every verdict from it is provisional and
   queued in `../../viu-2026-08-03/RECHECK-QUEUE.md`. **Blocked on:** engineering declaring the branch
   final, or the app-version marker moving.
