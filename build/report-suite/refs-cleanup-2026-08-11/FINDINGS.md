# Report Suite — refs-cleanup pass, findings, 2026-08-11

Everything here was read live in this pass. Where a finding contradicts the brief that commissioned
it, the brief's wording is quoted and the evidence set beside it rather than the difference being
quietly absorbed.

---

## 1 · Headline

**Both gaps are closed. 95 `update_case`, all HTTP 200, all byte-verified, 0 mismatches, 0
collateral changes, one field touched.**

| | |
|---|---|
| Version pins added | **35** |
| Variant pin forms normalised | **2** |
| Technician Utilization pin dates corrected | **58** |
| Entries that could not be made to fit | **0** |
| Citations left unpinned anywhere in the suite | **0** |
| Stale pins left anywhere in the suite | **0** |

**Live spec versions, all confirmed by content this pass:** SBC **17** · SBR **18** · PV **6** ·
TU **7** · WIP **11** · IV **5**. Full evidence in `SOURCE-CURRENCY.md`.

---

## 2 · The count of 42 is right, but it is not 42 missing pins — it is 35

**The brief says "42 citations carry NO version pin at all". The 42 is the correct size of the
inherited list, but the three groups inside it need different handling, and two of them needed no
pin at all.** The reconciliation is exact:

| | Cases | What they actually are |
|---|---|---|
| **Genuinely unpinned** | **35** | A citation naming a specification with no version. **These are the real gap.** |
| **Variant pin form** | **2** | **Already carry the correct version integer** — in a date form no detector matches. |
| **False positives** | **5** | The unpinned match is **prose about the spec**, not a citation of it. |
| | **42** | |

### The 2 variants — already pinned, and this is why the earlier scan missed them

[C30434](https://shopview.testrail.io/index.php?/cases/view/30434) read `TU spec v7 read 2026-08-11`
and [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) read
`WIP spec v11 read 2026-08-11`. **Both name the correct live version.** Rule 42's mechanism is the
**version integer**, and both had it — so neither was ever the Rule-42 hazard the gap describes.

**They were normalised anyway, and the reason is the mechanism rather than tidiness.** A pin is only
useful if a future pass can *find* it: the whole point of Rule 42 is that when a requirement changes,
every case citing it is re-checked. A pin written in a form no detector matches **is invisible to
exactly the process it exists to serve** — which is not hypothetical, because it is precisely what
happened here: the earlier pass's scan reported both as having no pin at all. Both entries **got
shorter** in the process.

### The 5 false positives — three of them are sentences that would have been made false

**Three cases matched only on prose ABOUT the specification, not a citation OF it:**

| Case | The text | Why a pin must not go in |
|---|---|---|
| [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | *"his **SBR spec** edit is pending"* | Says Chris Ward's edit **has not landed**. Pinning v18 into it would assert the opposite. |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | *"the **SBC spec** carries no error-state story of its own"* | Says what the document **does not** contain. |
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | *"**WIP spec** Story 11 is silent on re-runs"* | Says the document is **silent**. |

**This is the failure mode a blunter pass would have shipped, and it would have been invisible
afterwards** — the case would read as freshly maintained while asserting something untrue about the
document. C30528's is the nastiest of the three, because it begins `WIP spec Story 11` and so looks
exactly like the 17 genuine `<RPT> spec Story N S…` citations; only the word after the story number
distinguishes them.

**C30290 and C30528 already carry a correct pin** on their real citation, so both needed **no write
at all**. C30184's *other* occurrence is a genuine citation and was pinned.

The remaining two false positives ([C38885](https://shopview.testrail.io/index.php?/cases/view/38885),
[C38918](https://shopview.testrail.io/index.php?/cases/view/38918)) match on *"…are now IN the PV
spec; previously spec-silent"* — again prose, again already pinned.
[C38887](https://shopview.testrail.io/index.php?/cases/view/38887) is the same shape but **was**
written, for the TU date.

---

## 3 · GAP 2 — the Technician Utilization date was WRONG, not merely inconsistent

**The brief asked for an honest verdict, including the option of changing nothing: *"If the
inconsistency turns out to be defensible rather than wrong, say so and change nothing."*
It is not defensible. The evidence is a four-second window.**

### The decisive fact

Chris Ward published four specifications in **one batch, inside five seconds**:

| Report | Published (UTC) | Was pinned as |
|---|---|---|
| Sales By Representative v18 | 03:43:**08**Z | 2026-08-07 |
| Parts Velocity v6 | 03:43:**09**Z | 2026-08-07 |
| Inventory Value v5 | 03:43:**11**Z | 2026-08-07 |
| **Technician Utilization v7** | 03:43:**12**Z | **2026-08-06** |

**The same publication instant was being dated two different ways inside the same suite.** TU v7 is
**four seconds newer** than SBR v18, and was carrying a date **one day older**. A reader comparing
the two pins would reasonably conclude TU's source was the earlier document. **That is not a
stylistic split; it misrepresents the ordering of two documents.**

### Why the earlier pass's "both renderings are defensible" no longer holds

The refs-pins pass recorded, correctly for the moment it was written, that the 2026-08-06 rendering
was shared by **SBC v16, TU v7 and WIP v10** — so it looked like a coexisting convention rather than
an error. **Both of its supporting examples have since been superseded**: SBC advanced to **v17** and
WIP to **v11**, both published 2026-08-10, a date on which UTC and US Central agree. **TU was left as
the sole survivor of a convention that no longer had any other members** — 1 report against 5.

(WIP v10 was published at 03:43:**13**Z, one second after TU v7, and carried the 08-06 rendering
too. It is now v11. So the convention did not change; its other members simply moved on.)

### The convention chosen, stated so the next pass does not flip it back

> **The date beside a pin is the UTC calendar date of the Confluence version's `when` timestamp.**

Three reasons, in order of weight:

1. **It is what the API returns.** No timezone judgement is applied, so any future pass reproduces it
   from one call with nothing to decide.
2. **It was already the suite's majority convention** — 5 of 6 reports.
3. **It is reproducible without knowing where Chris Ward was sitting.** The alternative requires
   knowing the author's local offset, which is not recorded anywhere in our sources; we only inferred
   US Central from a commit message reading *"QA workbook 2026-08-06"*.

**Honest counter-argument, recorded rather than buried:** by Chris Ward's own clock he *did* edit
these on the 6th, and his commit message says so. **That argument is real but loses**, because the
pin's job is to identify a document version unambiguously, and a rendering that makes a newer
document look older fails at exactly that job.

**Cost:** 58 writes, every one a same-length substitution, so **no entry moved closer to the
248-character ceiling.** The version integer — the thing Rule 42 actually depends on — was already
correct on all 58 and was not touched.

---

## 4 · REPORTED, NOT FIXED

Nothing below was changed. Each is outside this pass's charter, and each is recorded so it is
visible rather than silently carried.

### (a) Four SBC cases now carry two date markers

[C30096](https://shopview.testrail.io/index.php?/cases/view/30096),
[C30098](https://shopview.testrail.io/index.php?/cases/view/30098),
[C30099](https://shopview.testrail.io/index.php?/cases/view/30099) and
[C39447](https://shopview.testrail.io/index.php?/cases/view/39447) carry a legacy marker,
`Confluence 577634305 v-2026-07-31`, and now also the house pin `SBC spec v17 2026-08-10`.

**Both are true and they are not in conflict** — the pin says which version the case is written
against; the legacy marker says when that requirement's wording landed, and each of those three
entries goes on to quote the wording with *"now reads …"*. **It reads as noise rather than as an
error**, and removing it would free ~35 characters on entries that are among the tightest in the
suite. **A tidy-up candidate for an authorised pass, not a defect.**

### (b) One embedded version marker that could be misread as a stale pin

[C30503](https://shopview.testrail.io/index.php?/cases/view/30503) reads
`… + on-screen location-scope indicator; spec v6 2026-07-29; single-location filter HIDDEN …`.

**It was checked rather than assumed: WIP v6 was published 2026-07-29T06:33:58Z, so the statement is
TRUE**, and it qualifies the location-scope indicator — when that requirement landed — rather than
pinning the case. **Left alone deliberately.** It is flagged only because it lacks a report prefix
and sits mid-entry, so a future automated re-pin could mistake it for a stale pin and "correct" a
true sentence into a false one. **The genuine pin on that case is `WIP spec v11 2026-08-10`, added
by this pass.**

### (c) Five entries are now at or within one character of the ceiling

[C30485](https://shopview.testrail.io/index.php?/cases/view/30485) and
[C30603](https://shopview.testrail.io/index.php?/cases/view/30603) sit at **exactly 248**;
[C30516](https://shopview.testrail.io/index.php?/cases/view/30516),
[C30398](https://shopview.testrail.io/index.php?/cases/view/30398) and
[C38859](https://shopview.testrail.io/index.php?/cases/view/38859) at **247**. **Any future pass
adding a single character to those must condense first**; safe candidates are catalogued in
`OVER-LIMIT.md`.

### (d) No assertion-level drift was found — and this pass did not go looking for it

The Rule-41 re-read covered **every field of all 95 touched cases** and checked: every cited anchor
still present in the live body now named, raw markup, CRLF, title length, exactly one automation
marker, exactly one provenance sentence. **All 95 came back clean on every one: 0 orphaned anchors
(375 anchors checked), 0 raw markup, 0 CRLF, 0 over-length titles, 0 marker anomalies, 0 provenance
anomalies.**

**It was NOT a semantic re-derivation of each assertion against its requirement, and none is
claimed.** That is the spec-delta pass's job, and it finished earlier today having done exactly that
against these same six live versions, repairing 24 cases. **Had this pass found assertion-level
drift it would have been recorded here and left for that pass's owner, not fixed** — a metadata pass
changing an expectation would cut straight across work that is already current.

---

## 5 · What was proven, and the one thing that proves scope independently

Full tables in `CHANGES-MADE.md`. The single most useful check is the re-sync: re-syncing the local
case source **from live** found **exactly 95 `refs` differing and ZERO titles, preconditions, steps
or expected results.** That is a measurement against live, not a restatement of our own intentions —
it would have caught an accidental Expected-Results edit even if every other guard had missed it.

- Our 385 untouched cases and the 12 foreign cases: **byte-identical, `updated_on`/`updated_by`
  included.**
- **Run 359 undamaged** — `include_all` still false, 476 tests set-equal both ways, **all 535
  results present BY ID**, 0 graded-field changes, 0 new results, `update_run` never called. **97
  rows moved `case_refs` only, across 89 distinct cases, every one traced to a case this pass
  wrote** — the declared read-time echo, behaving exactly as declared.
- **Four counts 480/480/480/480 set-equal both ways**; shredding guard **0**; id-map 480 rows, 0
  blanks, refs 480/480; import header sha256 **identical across all 13 project imports**.

**Ours 480 / live 492.**

---

## 6 · Process notes

**The `pgrep` trap the previous pass documented was avoided by not chaining batches at all.** Each
of the four batches was run directly and **verified by reading the cases back from TestRail**, never
by watching a process. After every batch the check was the same question: *are these cases actually
at their target value?* — answered from live, 95 of 95.

**The writer was built to make the three known hazards non-events**, and none of them fired: no write
returned a non-200, so the 500-that-already-landed path was never exercised; no retry was ever
issued; and the "already at target" guard that would have caught a half-landed batch reported nothing,
consistent with a clean run.

**One thing worth keeping:** the writer asserted `custom_expected` byte-identical *after* the write on
every operation, in addition to the harness's own field-by-field comparison. On a pass whose entire
risk is touching a field it should not, a second independent assertion of the same fact is cheap and
was worth having.
