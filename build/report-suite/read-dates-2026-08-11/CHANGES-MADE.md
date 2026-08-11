# Report Suite — CHANGES MADE, 2026-08-11

Two jobs, combined into **one write per case** so that no case was touched twice.

---

## Job 1 — a read-date after every cited source (Standing Rule 54, amended 2026-08-11)

**1,000 read-dates are now live across the 476 cases.** Every one says `read on 11 August 2026`,
and every one rests on a source that was **actually read in this pass** — the six specifications and
the epic on 11 August, Chris Ward's answers sheet fetched and hashed at 18:35:23Z, the engineering
technical plan read at 18:35:47Z. **Nothing was back-filled** (Rule 12).

| | |
|---|---|
| Cases carrying at least one read-date | **476 of 476** |
| Cases carrying none | **0** |
| Read-dates per case | 2 on 431 cases · 3 on 43 · 4 on 1 · 5 on 1 |
| Total read-dates | **1,000** |

### Which sources were dated

| Source | Read-dates inserted |
|---|---|
| epic SV-8582 | 476 |
| Sales By Representative specification | 111 |
| Sales By Customer specification | 86 |
| Work In Progress specification | 78 |
| Parts Velocity specification | 70 |
| Inventory Value specification | 68 |
| Technician Utilization specification | 60 |
| Chris Ward's answers sheet | 46 |
| the engineering technical plan | 1 |
| stories SV-8654 / SV-8657 | 0 — **already dated today, left exactly as found** |

The specification totals exceed the number of cases per report because **a case can cite more than
one specification**. C43550 cites three (Sales By Customer, Technician Utilization and Work In
Progress) and now carries a separate date on each, which is precisely what Rule 54's amendment
requires: *"a spec and a PO answer are read at different times and move independently, so a single
shared date would misstate at least one of them."*

### The shape, before and after

Before:

> This is the expected behaviour as per epic SV-8582 and the Sales By Customer report specification
> version 16 (S1-R1, S1-R3, S1-R4).
> Last checked against build v3.5-7168d14 on 8/6/2026.

After:

> This is the expected behaviour as per epic SV-8582, **read on 11 August 2026**, and the Sales By
> Customer report specification version **17** (S1-R1, S1-R3, S1-R4), **read on 11 August 2026**.
> Last checked against build v3.5-7168d14 on 8/6/2026.

**Sentence 2 is byte-identical.** It always was, on all 476 — verified after the writes, not
assumed.

### Two cases were already partly dated — and partly is not compliant

**C30452** and **C30434** were stamped earlier today by the `dated-provenance-2026-08-11` pass. Both
carried a read-date on the **specification** and on their **story**, and **neither carried one on the
epic**. Under the per-source rule that is a partially-dated line, so both were completed. Their
existing dates were left untouched; only the missing epic date was added.

The sibling passes found the same shape at larger scale — **26 cases on Schedule** and **17 on
Filters**, all dated on the specification with the epic left undated. **Three projects, three
instances: the per-source clause is the part of Rule 54 most easily half-applied**, and a sweep that
only checks "does this case have a read-date?" will pass all of them.

---

## Job 2 — 378 stale specification version pins corrected

| Report | Pinned was | Live is | Citations re-pinned |
|---|---|---|---|
| Sales By Customer | 16 | **17** | 86 |
| Work In Progress | 10 | **11** | 78 |
| Sales By Representative | 17 | **18** | 76 |
| Parts Velocity | 5 | **6** | 70 |
| Inventory Value | 4 | **5** | 68 |
| Technician Utilization | 7 | **7** | 0 — already correct |
| **Total** | | | **378** |

**Verified afterwards: 0 citations anywhere in the suite still name a superseded version.**

The brief's estimate was 377 and named the same five reports. The extra one is **C43550**, a Sales By
Customer case that also cites the **Work In Progress** specification — so its Work In Progress
citation needed re-pinning even though the case does not live in that report. That is exactly why
each citation is re-pinned to the live version of **the report it names**, never to the version of
the report folder the case happens to sit in.

### Three judgement calls, each verified rather than assumed

**(a) A historical version discussed in prose is NOT a pin, and was left alone.** Several cases
deliberately talk about an earlier revision — *"Version 9 of that specification contradicted itself
about whether the Location column can be switched on and off"* (C30511), *"version 10 of that
specification uses the number S9-R11 for two different requirements"* (C30518), *"Version 6 of that
specification, published on 5 August 2026, is what settles the one point"* (C30401). Re-pinning those
would falsify the case's own reasoning. Only the citation form `<Report> report specification version
N` was re-pinned; the prose form `Version N of that specification` cannot match it, because the word
order differs.

**(b) The one negative mention was re-pinned but NOT dated — and the re-pin was checked first.**
C38856 names the Sales By Customer specification only to record that it **is silent** on the point.
Re-pinning it to 17 asserts that **v17** is silent, so before doing it, all **eight** anchors that
citation names (S14-R1, S14-R2, S14-R4, S15-R1, S15-R2, S15-R4, S15-R5, S4-R13) were proven
**byte-identical between v16 and v17**. The negative claim therefore still holds. No read-date was
added to that citation (see `FINDINGS.md` §3).

**(c) C30518's caution still holds in the version it now names.** It warns that S9-R11 numbers two
different requirements. **S9-R11 occurs twice in Work In Progress v10 and twice in v11**, so
re-pinning to 11 does not falsify the caution. Its prose still says *"version 10"*, which is now one
behind the case's own pin — recorded in `STALE-ANCHORS.md`, not silently reworded.

---

## What was deliberately NOT changed

| | |
|---|---|
| **Sentence 2 (the build line)** | not added, not removed, not re-dated, on any of the 476. No build was observed in this pass, and a build date nobody stood behind is a fabrication. |
| **`refs`** | not written on any operation — including its **own, separately stale** version pins (`FINDINGS.md` §2). |
| **Automation markers** | untouched. Two cases carry none; inventing one is an automation judgement, and under Rule 61 an expect-fail marker now needs live backing. |
| **Expected behaviour** | not one assertion was altered. A version pin is not a licence to change an expectation, and where a requirement's own text has moved it is recorded in `STALE-ANCHORS.md` for a Rule-43 coverage re-derivation. |
| **Anyone else's cases** | the 12 foreign cases were never written and are proven byte-identical, `updated_on` included. |
| **Run 359** | never written. |
| **Jira** | zero writes. The creation hold stands. |

---

## Local source and deliverables

The local case source was **re-synced from live before anything was regenerated**, because counts
cannot detect stale content — the sibling Filters pass found all 114 of its local bodies stale while
its four counts reconciled perfectly.

**Local was stale on far more than this pass wrote**: besides the 476 expected-result fields, **243
`refs`, 7 titles, 8 steps and 5 preconditions** differed from live *before* these writes. All are now
in step.

| Check | Result |
|---|---|
| four counts | live **476** · local active **476** · id-map **476** · import **476** |
| set-equality | live ↔ local and live ↔ id-map, **both directions** |
| id-map | **0 blank C-ids**, `refs` **476/476**, title and refs byte-equal to live on all 476 |
| shredding guard | **0 rows** carry the signature |
| import header | sha256 `a45eae40ec73b8ac` — **identical to all five peer projects** |
| import rows carrying a read-date | **476 of 476** |

The generator's documented gotcha fired as expected: `gen_import.py` **blanked all 476 C-ids and
dropped the `refs` column**. Both were re-merged **from live**, not from the previous file, so the
id-map cannot preserve a value the suite no longer has.
