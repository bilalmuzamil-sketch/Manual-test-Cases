# DELIBERATE DECISIONS — Report Suite final push · 2026-08-04

**Standing Rule 46.** Everything this pass **deliberately did not do** is written down here, with
its evidence and a plain one-sentence answer, **before anyone asks**. An undocumented deliberate
omission is indistinguishable from a miss — which is exactly how entry N2 of the 2026-07-31 deltas
pass came to certify a real gap as "provably fine".

**Honesty clause up front:** this register records what we **decided**, not what we wish we had
decided. Where the re-read found a mistake of ours, it is written up as a mistake, dated, with the
cost stated — not relabelled as a choice. Two such entries are below (**D9**, **D10**).

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBC spec | Confluence 577634305 | **v13**, 2026-07-31 | 2026-08-03 | CURRENT |
| SBR spec | Confluence 585629698 | **v15**, 2026-07-29 | 2026-08-03 | CURRENT |
| PV spec | Confluence 620888066 | **v4**, 2026-07-29 | 2026-08-03 | CURRENT |
| TU spec | Confluence 641400833 | **v5**, 2026-07-29 | 2026-08-03 | CURRENT |
| WIP spec | Confluence 703660034 | **v6**, 2026-07-29 | 2026-08-03 | CURRENT |
| IV spec | Confluence 720142338 | **v3**, 2026-07-29 | 2026-08-03 | CURRENT |
| Epic | SV-8582 | 6 stories reopened as of 2026-07-31; **not re-read** | 2026-08-03 | **PARTIAL** — a Tier-2 full re-read is a Rule-37 ask, never launched unasked |
| Designs | none exist (spec-only project) | — | — | **N/A** — no Rule-35 queue |
| Tech plan | `tech-plan-2026-07-29/` | 2026-07-29, not re-fetched this pass | — | **PARTIAL** |
| PO answers | Chris Ward, through 2026-08-01 | 2026-08-01 | 2026-08-03 | CURRENT |
| **Live build** | `sv8582.qa.shopview.com` `v3.4.1-0ed4433` | index.html last-modified 2026-08-03 13:40:38 GMT | 2026-08-03/04 | **ACCEPTED-AS-FINAL-FOR-NOW** by the QA lead's 2026-08-04 ruling — engineering's "not final" position is **not withdrawn**, so `../viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** |

**This pass re-observed nothing live.** It applied corrections derived from the 2026-08-03/04 VIU
and the 2026-08-04 exhaustive audit, and verified every write byte-for-byte against TestRail. It is
**not** a fresh verification and does not claim to be.

---

## D1 · The ~10 cases that assert a spec requirement the build breaches — LEFT EXACTLY AS WRITTEN · RISK: **LOW**

**Plain answer:** these are the test cases that *found* the bugs, so we deliberately did not touch
them — rewriting them to match the broken build would delete the only thing that catches the defect.

**The authority is the QA lead's own ruling, 2026-08-04, verbatim:**
> *"where there is a bug and you found that, do not change those test cases, because you found the
> bug due to those test cases."*

**Why this matters more than usual today:** the automation engineers are automating this suite
**today**. A case rewritten to match a broken build does not merely lose the finding — it **encodes
the bug as the expected result**, and every future automated run then certifies the defect as
correct. That is not a recoverable mistake.

**The cases, and the requirement each one holds the build to:**

| Case | C-id | Requirement it asserts | What the build does | Ticket |
|---|---|---|---|---|
| IV-COL-04 | [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | IV v3 `S3-R13`/`S8-R3` — Margin and Total Sell hidden by default | all twelve columns show | — (unbuilt default) |
| WIP-FLT-06 | [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | WIP v6 `S7-R9` — first visit defaults to the active location | reads "All locations" | — |
| IV-NAV-03 | [C30536](https://shopview.testrail.io/index.php?/cases/view/30536) | IV v3 `S1-R3` — same | same | — |
| IV-LOC-01 | [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | IV v3 `S7-R2` — same | same | — |
| IV-DATE-05 | [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) | IV v3 `S5-R6` — the "As of" indicator is **not** shown when the day matches | always shown | **SV-8820** |
| IV-EXP-02 | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | IV v3 `S10-R3` — file columns = screen columns, screen order, Total Cost last | export ignores the column selection and re-orders | **SV-8823** |
| IV-EXP-03 | [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | IV v3 Story 10 — CSV money as plain numbers | writes `"$11,176.88"`; money imports as **text** | **SV-8823** |
| IV-VIS-02 | [C30597](https://shopview.testrail.io/index.php?/cases/view/30597) | IV v3 `S12-R3` — date control first | part search first | — |
| WIP-VIS-01 | [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | WIP v6 `S10-R1` — white column headers | `rgb(249,250,251)` | — |
| IV-VIS-01 | [C30596](https://shopview.testrail.io/index.php?/cases/view/30596) | IV v3 `S12-R1` — same | same | — |

Related, and equally untouched in substance: the Turns/Yr divisor (**SV-8819**) and the PDF failure
(**SV-8818**) cases, whose assertions were already correct.

**Who closes it:** dev, by fixing the build — then these cases pass on their own.
**What they DID receive:** the provenance line, and nothing else.

---

## D2 · The 8 Location-column cases — LEFT AS WRITTEN, and their provenance line says so honestly · RISK: **HIGH**

**Plain answer:** on these eight the case follows what the build does while the written
specification says the opposite, so they cannot currently fail a broken build — and we left them
alone because Chris Ward's ruling is still outstanding.

**The evidence, verbatim.** IV spec v3 (720142338, 2026-07-29) `S7-R6`: the automatic Location
column's *"visibility is automatic"*. WIP spec v6 (703660034, 2026-07-29) `S4-R3`: *"The Location
column is not offered in the column selector; its visibility is automatic."* Several of these eight
cases nevertheless describe the tester **switching Location on in the column-selection control**.

**The set is EIGHT, not seven** (the brief said seven and then listed eight; verified against
`../audit-exhaustive-2026-08-04/DELIBERATE-DECISIONS.md` D1):

IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) ·
IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) ·
IV-PERS-02 = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) ·
IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
IV-LOC-06 = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) ·
WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) ·
WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) ·
WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)

**Three of these are also three of the audit's seven CONTRADICTION cases** — so of the seven, four
were fixed this pass (D8) and three are held here. That is the whole seven accounted for.

**The one thing we did NOT let slide.** Their provenance line could not be allowed to read *"as per
the Inventory Value report specification version 3 (S7-R6)"* full stop, because the specification
**does not support** what those cases assert. A provenance line asserting a source that does not
back the expectation manufactures false authority — worse than no line at all. So all eight carry
the honest variant:

> *"…and as per the Work In Progress report specification version 6 (S7-R13, S7-R14, S4-R3, S9-E1,
> S10-R5a); **on this point that specification currently states otherwise and a product decision is
> still awaited**, so treat the behaviour described above as what the build does today."*

**Why HIGH.** Read the risk column honestly: HIGH does not mean we are wrong, it means if this is
raised publicly we have a concession to make. Here we do — eight cases currently cannot fail a
build that contradicts their own spec.
**Who closes it:** **Chris Ward** (item 2 on his sheet).

---

## D3 · The date-picker preset list — 6 enumerations HELD · RISK: **MEDIUM**

**Plain answer:** four specifications close an eleven-option list and the build ships nine plus a
calendar, and we will not rewrite six cases to the build while four current specs say otherwise.

**Evidence:** SBC `S2-R2` · SBR `S2-R2` · WIP `S7-R6` · IV `S5-R1` each close an **eleven**-option
list; the build ships **nine** plus an inline calendar, from **one shared component serving all six
reports**.
**Held:** SBC-DATE-01 = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) ·
SBR-DATE-01 = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) ·
WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) ·
IV-DATE-01 = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) · plus the cap
figure in WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)
(spec says 366; observed 367 accepted / 368 refused).

**What we DID fix, because it is independent of any product decision:** the **un-runnable steps**.
A step telling the tester to choose a *"Custom"* item that does not exist is a hard Rule-28 failure
whatever Chris rules, so **C30104** and **C30564** now say how a custom range is actually picked.
**Not one expected-result enumeration was touched.**
**Who closes it:** Chris Ward.

---

## D4 · The asset-identifier chain — 3 cases HELD · RISK: **MEDIUM**

**Plain answer:** Chris ruled the identifier should be VIN → Unit # → plate but the WIP spec was
never updated, so these three keep asserting the ruling and keep failing the build.
**Evidence:** Chris Ward 2026-07-29, *"A is the correct answer"*, plus *"Not just for these specs
though -- really good to keep this in mind for all actions moving forward"*. WIP `S4-R7` still
carries the old text.
**Cases:** WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) ·
WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) ·
WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500).
**Note this is the THIRD pass this edit has been owed.**
**Who closes it:** Chris Ward — his spec edit.

---

## D5 · The single-location filter · the Estimates quoted value · the rep label — 5 cases HELD · RISK: **MEDIUM**

**Plain answer:** three separate product questions, all Chris's, all with the case currently
asserting the ruling or the spec rather than the build.

- **Single-location filter hidden** (Chris 2026-07-31 Q1=A): WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) item 5 · IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577).
- **Estimates quoted value** (WIP `S5-R8` verbatim; build shows $0.00 — it is showing approved value): WIP-SUM-05 = [C30491](https://shopview.testrail.io/index.php?/cases/view/30491). **Our case is right; we deliberately did not weaken it.**
- **The rep label — three words from three sources:** spec says `Sales Rep`, Chris ruled `Sales Representative`, the build's CSV says `Representative` and the work-order field says `Sales rep`. `CHANGE-LEDGER` row 17 verbatim: *"**Three different words from three sources.** Do not edit until Chris rules."* Held: SBR-WO-01 = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) · SBR-WO-06 = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315).

**Who closes it:** Chris Ward.

---

## D6 · The empty-export pair — HELD for a fresh observation, not for a ruling · RISK: **MEDIUM**

**Plain answer:** two of our own documents from the same pass disagree about what the build does on
an empty export, so we are not picking one — it needs re-observing.

`CHANGE-LEDGER` row 3 says *"**No file downloads.** A warning appears reading 'Empty export'"*;
`batch-sbc-sbr` §4 says *"the file **does** download with the 'Locations:' line and the column
headers, but there is NO totals row"*. Both cannot be true.
**Held:** SBC-EXP-15 = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) ·
SBR-EXP-16 = [C30291](https://shopview.testrail.io/index.php?/cases/view/30291).
**Who closes it:** **us**, with one live re-observation — it is queued in the Rule-49 re-check
queue. It needs no ruling from anyone.

---

## D7 · Two cases the batches themselves said to ask the PO about first · RISK: **LOW**

**Plain answer:** the pass that proposed these edits also said to ask Chris first, and the later
instruction wins (Rule 32).
SBC-VIS-02 = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) — *"but confirm
with the PO first, because this may be a styling gap rather than the intended design"*.
SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) — the spec says
`Performance`, the build says `SALES`, and Chris's companion video described a new grouping.
**Who closes it:** Chris Ward.

---

## D8 · Four internally contradictory cases — FIXED, because incoherence is not a product question · RISK: **LOW**

**Plain answer:** four cases contradicted themselves, which is broken no matter what anyone rules,
so we fixed them.

| Case | The contradiction | How it was resolved |
|---|---|---|
| SBC-DATE-03 [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | step 1 said the range is picked on a month calendar; expected 1 said choosing "Custom" opens a dialog | expected 1 now matches the build's mechanism; **the 366-day cap assertion is untouched** |
| IV-NAV-05 [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) | expected 1 required a pagination control, expected 3 said none exists | expected 1 now asserts the paging **behaviour** the spec requires (one page at a time, not the whole list — observable); the record that numbered controls are absent stays in expected 3 |
| IV-TOT-01 [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | expected 1 required "Totals" on screen; the case's own note recorded that `S4-R1` says **"Total"** on screen and `S10-R6` says "Totals" in the download | expected 1 now asserts the **spec** value, names the download label separately, and tells the tester to **fail and report** a screen reading "Totals" — so this fix *increases* defect sensitivity |
| SBR-BADGE-01 [C30226](https://shopview.testrail.io/index.php?/cases/view/30226) | expected 1 closed Status's neighbours absolutely, contradicting `S21-R7` (and C30279/C30265) which insert Location immediately after Status | rewritten **scope-conditionally** per Rule 42, so both are true |

**Who closes it:** closed.

---

## D9 · A mistake of ours: one of our own new cases asserted the defect as its PASS condition · RISK: **LOW** (now fixed)

**Plain answer:** a case we authored on 2026-08-04 was written so that the bug counted as a pass —
we caught it and fixed it, and it is recorded here as an error, not a decision.

**IV-EXP-10 = [C43548](https://shopview.testrail.io/index.php?/cases/view/43548)**, authored the
previous day to characterise the PDF failure boundary, had this as expected item 2: *"On the whole
list the PDF does not download. After roughly half a minute a plain error appears…"* A tester on a
**fixed** build would have had to mark it **Failed**, and the automation engineers would have
encoded the failure as the expected result — precisely the harm the QA lead's ruling exists to
prevent, produced by us rather than avoided by us.

**Fixed:** the expected now states the correct behaviour (a working PDF **or** the polite
too-large refusal), with the observed failure preserved **verbatim** as a known-problem note
naming the ticket. On today's build the case now **fails visibly**, which is what a defect-finding
case is for. **Cost of the error:** none realised — caught before automation began.

---

## D10 · A mistake of ours: nine cases carried a stale spec version · RISK: **LOW** (now fixed)

**Plain answer:** nine cases said they were written against SBC spec v12 when v13 had been live
since 2026-07-31; that is exactly the staleness Rule 31 exists to catch, and we were the ones
carrying it.

C38912, C30160, C30161, C30162, C30164, C30166, C30168, C30169, C30172 all cited `SBC spec v12
2026-07-29`. **Refreshed to `SBC spec v13 2026-07-31`** in the same operation as their provenance
line. Per Rule 54 a stale spec version is **itself a finding**, so it is reported here rather than
quietly corrected. Found by the Rule-41 whole-case re-read — which is the argument for Rule 41.

---

## D11 · 9 MERGE groups and 1 CUT — STAGED, NOT EXECUTED · RISK: **LOW**

**Plain answer:** merging or deleting cases is irreversible and structural, so it waits for the QA
lead's explicit go-ahead — we only ever recommend.

Standing Rule 28: the audit **recommends**; nothing is merged, cut or deleted without explicit
authorisation (Rule 6). The 9 groups are `MG-IV-SNAPSHOT-RERUN`, `MG-IV-TOTALS-POSITION`,
`MG-PV-REVERSAL`, `MG-SBC-EMPTY-LOADING`, `MG-TU-LOC-FALLBACK`, `MG-WIP-SNAPSHOT-PRECISION`,
`MG-WIP-SNAPSHOT-SHAPE`, `MG-WIP-TAB-COUNTS`, `MG-WIP-TOTAL-PINNED`, plus 1 CUT — all itemised
with survivors in `../audit-exhaustive-2026-08-04/AUDIT.md` and `per-case-verdicts.csv`.
**Extra reason to hold today:** the automation engineers start from the live suite this morning;
changing its shape underneath them is worse than leaving nine known-redundant cases in place.
**Who closes it:** the QA lead.

---

## D12 · The candidate gap (SBR Expanded CSV footer totals row) — NOT AUTHORED · RISK: **LOW**

**Plain answer:** an automated case of Vladimir's asserts a totals row in a file our spec says
nothing about, so authoring a case would mean asserting something no written source supports.

The SBR spec is **silent** on a footer totals row in the Expanded CSV. Authoring it would breach
Rule 12 (never fill a gap with inference and present it as verified). **Staged as a question for
Chris Ward instead.** Foreign cases remain untouched in every scenario (Rule 38).
**Who closes it:** Chris Ward.

---

## D13 · 30 cases that require a browser network panel — LEFT AS THEY ARE, deliberately · RISK: **LOW**

**Plain answer:** these are API tests sitting in API sections, so a technical tester is the right
audience and the wording is correct for them.

The audit's dimension-3 verdict `TECHNICAL` on 30 cases is **not** a defect: every one of them
lives in a `<Report> — API` section per Standing Rule 4, which is exactly where a case that reads
an HTTP response belongs. Rules 7/9 govern the **tester-facing manual** suite; an API case's
audience is a technical tester.
**Who closes it:** closed — no action wanted.

---

## D14 · 7 refs pins withheld from the defect and Location families · RISK: **LOW**

**Plain answer:** these seven cases were owed a spec-version pin, but the instruction for those two
families was that the provenance line is the **only** permitted change, so we obeyed it literally
and are flagging the leftover rather than quietly doing it anyway.

C30519, C30536, C30565, C30574, C30589, C30596, C30597 still cite their spec as a bare file path
with no version. The pin is metadata and cannot alter an assertion — but the instruction was
explicit and scoped by name to *"the ~10 defect-finding cases and the 7 Location cases, where this
remains the ONLY permitted change"*, so it was not applied. **One word of authorisation completes
it**; the other **360** pins were applied.
**Who closes it:** the QA lead — a yes/no.

---

## WHAT THIS PASS DID CHANGE, for contrast

| | Count |
|---|---:|
| Provenance / build-date + spec-version line | **478** (every case) |
| `refs` spec-version pins applied | **351** newly pinned + **9** stale pins refreshed = **360** |
| Hand-authored wording repairs | **22** (4 contradictions + 18 audit FIX-WORDING) |
| Cases whose provenance line had to record a later product decision instead of plain spec agreement | **37** |
| Cases whose provenance line records that a product decision is still awaited | **8** |
| Cases with no spec anchor, stated plainly in words | **1** (the QuickBooks journal case, C38925) |
| Local-only status corrections (PASS → DEVIATION) | **3** |
| `add_case` · `delete_case` · section moves · run writes | **0** |
