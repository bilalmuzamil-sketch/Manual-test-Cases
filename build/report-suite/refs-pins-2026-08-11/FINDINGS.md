# Report Suite — refs version-pin pass, findings, 2026-08-11

Everything here was **read live in this pass**. Where a finding contradicts the brief that
commissioned the pass, the brief's wording is quoted and the evidence set beside it, rather than
the difference being quietly absorbed.

---

## 1 · The headline: 337 stale citations across 343 cases, and TU was already right

| Report | Pinned in the cases | **Live** | Citations re-pinned |
|---|---|---|---|
| Sales By Customer | v16 (2026-08-06) | **17** | **77** |
| Sales By Representative | v15 (2026-07-29) | **18** | **73** |
| Sales By Representative | v17 (2026-08-05) | **18** | **1** |
| Parts Velocity | v4 (2026-07-29) | **6** | **58** |
| Work In Progress | v10 (2026-08-06) | **11** | **68** |
| Inventory Value | v3 (2026-07-29) | **5** | **60** |
| Technician Utilization | v7 (2026-08-06) | **7** | **0 — already current** |
| | | | **337** |

The brief's two sample figures are both confirmed: Sales By Representative sat at **15** against
live **18**, and Inventory Value at **3** against live **5**. The brief's estimate of *"roughly 350
of 476"* is close: **337 citations on 343 of 480 cases**.

**`refs` was indeed further behind than the provenance line.** The provenance lines were corrected
earlier today and name the live version on 478 of 480 cases; `refs` was up to **three versions**
behind (SBR v15 → v18) and in the case of Inventory Value **two** (v3 → v5).

---

## 2 · C38925 — the brief's premise does not hold, and no version was invented

The brief says: *"**C38925** names no spec version in its provenance. Establish the right one from
its own anchor and add it."*

**It was established, and the right answer is that there is no specification version to name.**
[C38925](https://shopview.testrail.io/index.php?/cases/view/38925) asserts that a QuickBooks
journal amount is exact for a fractional-quantity sale. Its provenance currently reads:

> *"…as per epic SV-8582, read on 11 August 2026, and the engineering technical plan, read on
> 11 August 2026; **this point is not covered by any of the six report specifications**."*

That sentence is **true**, and it was verified rather than taken on trust. All six live bodies were
searched for QuickBooks:

| Report | Mentions of "QuickBooks" in the live body | What the mention says |
|---|---|---|
| Sales By Customer v17 | 1 | *"**Out of Scope** … QuickBooks sync of any data shown in this report."* |
| Sales By Representative v18 | 1 | *"**Out of Scope** … or QuickBooks sync of any data displayed here."* |
| Parts Velocity v6 | **0** | — (and this is the report C38925 sits under) |
| Technician Utilization v7 | **0** | — |
| Work In Progress v11 | **0** | — |
| Inventory Value v5 | **0** | — |

**The only two mentions in the entire specification set are explicit exclusions.** So adding a
specification version to this case's provenance would name a source that not merely fails to
support the expectation but **expressly disclaims it** — the exact "false authority" Rule 54's
honesty clause forbids, and worse than having no citation at all.

**C38925 was therefore left unchanged**, and its sole documented source, the engineering technical
plan, carries no version of its own (it is a committed verbatim copy of a user upload), which is
why a read-date is the honest form there.

**The case the brief was probably reaching for is C30288** — see §3. It is the only *other* case in
the suite whose provenance named a specification without a version, and unlike C38925 it could be
fixed honestly.

---

## 3 · C30288 — both owed items, and a third defect found on the way

[C30288](https://shopview.testrail.io/index.php?/cases/view/30288) needed **three** repairs, all
done in a single write:

**(a) The missing automation marker.** It was the only case in the suite without one — a live
census reads **479 markers on 480 cases**. `AUTOMATION: READY` was added in the standard position:
the very end of Expected Results, after the provenance line, blank line before.

*Why READY and not something else:* the case downloads two CSVs and reads their contents, which the
QA lead has ruled automatable; there is no unobtainable precondition, so `HOLD` would be wrong.
`READY - EXPECT FAIL` was **not** used — there is no live backing for it and no ticket, and Rule 61
requires a named observable symptom that this pass has no session to observe.

*A correction to the brief's arithmetic:* it says *"the live census reads 474 of 476, which is why
the arithmetic gate is out by one." * The live figures are **479 of 480** — the suite grew to 480
when the spec-delta pass created four cases earlier today. The gate was out by one either way, and
it is now closed: **480 of 480**.

**(b) The provenance naming a specification with no version.** It read *"…and the Sales By
Representative report specification (S22-R2, S22-R4, S14-R19), read on 11 August 2026."* All three
anchors were confirmed present in the live SBR v18 body, so the version could be added honestly, in
the suite's exact house wording: **"…report specification version 18 (S22-R2, S22-R4, S14-R19)…"**.

**(c) A comma in `refs`** — `…in both CSV exports,gated by…` — which TestRail was storing as two
separate references. Repaired to the suite's own `;` separator.

**Its Rule 54 sentence 2 was not touched: it has none.** C30288 is one of five cases that have
never been checked against any build and say so by omission. Adding a build line would have been a
false claim (Rule 12).

---

## 4 · The 248-character limit is on CHARACTERS, not bytes — and the brief understates the pressure

Full working in `OVER-LIMIT.md`. The two facts that matter:

- **Characters, proven from live data:** C30458 is stored and accepted at **248 characters / 251
  bytes**. If the cap were on bytes it could not exist. This mattered because these refs are dense
  with em-dashes — one character, three bytes — so the two measures diverge by up to 5.
- **The longest existing entry is 248, not 246** as the brief states. The suite is already sitting
  exactly on the ceiling, so there is less headroom than assumed.

**The re-pins themselves cost nothing in length** — every move stays inside the same digit count
and an ISO date is always ten characters, so all 337 are length-neutral. Only the *comma repairs*
could push an entry over, and exactly one did: **C30511**, condensed by removing two definite
articles from descriptive text, ticket key, anchors and version untouched. **No case was left
unwritten for length.**

---

## 5 · Zero anchors were orphaned by the re-pin — the check that makes it safe

Moving a pin from v15 to v18 is only honest if the requirement the case cites still exists at v18.
Two independent checks:

- **Version-level:** every content diff shows **0 anchors removed** (SBC v16→17 added `S3-R6a`;
  PV v4→6 added `S6-R12`; IV v3→5 added `S10-R8a`; SBR and WIP unchanged in anchor set).
- **Case-level:** across all 337 re-pinned citations, **0 cite an anchor absent from the live body
  they now name.**

And in the other direction, **0 of the 343 cases had a ticket key or an anchor altered** by this
pass. Only the version integer, its date, and commas moved.

---

## 6 · A version mentioned in prose is NOT a pin — three places where re-pointing would have lied

The rewriter matches only the citation form `<REPORT> spec v<N> <date>`. Three other shapes appear
in the suite and were deliberately **left alone**, because they are historical statements about
when something landed, not statements about which version the case is written against:

| Case | Text left untouched | Why |
|---|---|---|
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | *"S7-R13 rewritten in v10"*, *"the v9 contradiction"* | records **when** S7-R13 changed; re-pointing at v11 would make a true sentence false |
| [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | *"(SBR v16 2026-08-05)"* | records **when** Chris Ward's spec edit landed |
| [C30290](https://shopview.testrail.io/index.php?/cases/view/30290), [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | *"his SBR spec edit is pending"*, *"WIP spec Story 11 is silent on re-runs"* | prose about the spec, not a citation of it |

**This is the failure mode a blunter find-and-replace would have produced**, and it would have been
invisible afterwards: the case would read as freshly maintained while asserting something untrue
about the document's history.

---

## 7 · REPORTED, NOT FIXED: 42 spec citations carry no version pin at all (Rule 42 gap)

Rule 42 requires a version-pinned anchor on any citation, and **42 cases cite a report
specification with no version at all** — a different defect from the stale pins this pass was
chartered to fix. Examples:

- [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) — *"SBC spec S1-R1; S1-R3;
  S1-R4 — Confluence 577634305 v-2026-07-31"* (a date-form marker, not a version)
- [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) — *"SBC spec Story 4 S4-R1;
  S4-R2; S4-R3"*
- [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) — *"TU spec S1-R1"*

**Not fixed here, deliberately, for two reasons.** First, it is outside this pass's charter — the
brief is explicit that the job is *stale* pins, and adding pins where none exist is a different
change. Second, and more practically, **adding a pin costs roughly 16 characters and 11 of the 42
have less than 20 characters of headroom** — four have fewer than 10 (C30111 and C30290 have
**6**) — so several would need condensing, which is an editorial judgement about someone else's
wording rather than a mechanical repair.

**This wants its own authorised pass.** The full list with measured headroom per case is in
`logs/unpinned-citations.json`.

---

## 8 · REPORTED, NOT FIXED: Technician Utilization's pin date is a day out, and the suite is inconsistent about it

TU is pinned `v7 2026-08-06` on 58 cases. **The version integer is correct** — v7 is live — so
nothing here is stale and TU was not touched.

But v7 was published **2026-08-07T03:43:12Z**, and the same batch of Chris Ward edits published
minutes apart is dated **two different ways** across the suite:

| Same publication batch, 2026-08-07 ~03:43Z | Dated in the cases as |
|---|---|
| SBC v16, TU v7, WIP v10 | **2026-08-06** |
| SBR v18, PV v6, IV v5 | **2026-08-07** |

The explanation is a timezone: 03:43 UTC is 22:43 on 2026-08-06 in US Central, and Chris Ward's own
commit message says *"QA workbook 2026-08-06"*. **Both renderings are defensible**, which is
exactly why the inconsistency is worth recording rather than silently normalising.

**The new pins written by this pass all use the UTC date**, and each one matches the convention
already established for that version by the cases that were correctly pinned before this pass — so
nothing was invented and no existing convention was overturned. Re-dating 58 correct TU pins to
shift them one day would have been churn on cases with nothing wrong with them.

---

## 9 · No expectation was changed, and nothing was found that should have been

**A version pin is a pointer to a document. It is not a licence to change what a case asserts**
(Rule 57), and this pass changed no expectation, no step and no precondition — the single exception
being C30288's missing marker and provenance version, both additive.

**What the Rule-41 re-read on all 343 cases actually checked — stated precisely, because the
distinction matters.** Every field was re-read (title · preconditions · steps · expected results ·
refs · section · type), and each case was checked for: every anchor it cites still existing in the
live specification body it now names, raw markup, CRLF, title length, and exactly one automation
marker. All 343 came back clean on every one of those: **0 orphaned anchors, 0 raw markup, 0 CRLF,
0 titles over 80 characters, 0 missing markers.**

**It was NOT a semantic re-derivation of each assertion against its requirement, and this pass does
not claim one.** That is the spec-delta pass's job, and it finished about half an hour before this
one having done exactly that against these same six live versions, verdicting 14 requirement deltas
and repairing 24 cases. Re-doing it here would have cut across work that was already current, and
**had this pass found assertion-level drift it would have been recorded in this file and left for
that pass's owner rather than fixed unilaterally** — a version pin is not a licence to change an
expectation.

So the honest statement is: **nothing in the structural re-read flagged a case as wrong, and no
assertion-level claim is being made either way.**

---

## 10 · Housekeeping observations

- **The suite is 480 of our cases, not 476.** The brief's 476 predates the four cases the
  spec-delta pass created earlier today (C43556–C43559 and siblings). Both numbers are reported
  wherever it matters.
- **12 foreign cases** by Vladimir Tomovic (C38919–C38923, C43567–C43573) were **not touched** and
  are proven byte-identical by content including `updated_on`/`updated_by` — see
  `CHANGES-MADE.md`.
- **Raw-markup census at pass start: 0 of 480**, recorded because playbook §J declared hazard #5
  means that figure is true only of the moment it was measured — TestRail re-renders case text
  hours later when a tester works in it, without moving `updated_on`.
