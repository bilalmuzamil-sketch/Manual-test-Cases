# Report Suite — AUTOMATION READINESS, 2026-08-05

**Project:** Report Suite only · **Epic:** SV-8582 · **TestRail group:** 4281 ·
**Our cases: 476** (live total 481 — 5 belong to Vladimir Tomovic and are excluded from every figure here) ·
**Build observed:** `v3.5-16cf83f` · **branch NOT declared final, so every verdict is PROVISIONAL.**

> **UPDATED AGAIN 2026-08-05, latest** by the pass on Chris Ward's three new requirement items
> (`chris-newreqs-2026-08-05/`). **Ready to automate moved 447 → 446 while the suite GREW from 473 to
> 476 cases** — and that direction is deliberate, not an error. Three new cases were authored for the
> **negative half of the suite-wide link-permission rule**, which had **no coverage on any report**;
> all three are `AUTOMATION: HOLD`, because **no sign-in exists on this test system that can run them**
> (every one of the eleven roles holds work-order access). **C30100 also moved to HOLD**: the new SBC
> S9-R1a contradicts the S9-N2 that case was written from, and picking a side is barred.
> **Nine Work In Progress export cases moved to `READY - EXPECT FAIL (SV-8907)`** — the WIP download
> fails with a server error on every non-empty tab — and **C30500 to `READY - EXPECT FAIL (SV-8908)`**,
> the Asset filter dropping six vehicles that share a unit number.
> **The new requirements' coverage is counted in the DENOMINATOR and NOT in the ready figure**, exactly
> so this number cannot flatter itself. The earlier denominator warning below is now discharged: those
> requirements have cases, and the cases are honestly held.

> **UPDATED 2026-08-05 late** by the provenance re-stamp + Location re-repair pass
> (`prov-restamp-2026-08-05/FINDINGS.md`). **Ready to automate moved 440 → 447**: seven cases that were
> held for a reason that did not survive checking have been released — three Technician Utilization
> Location cases (its v6 settles the point in both S9-R9 and S10-R4), C30466 (true under both readings;
> only its precondition depended on the disputed point), and the three that were held against Chris Ward
> although he owed nothing on any of them: **C30186** (its expected result is SBC v15 S20-R8/R9/R10/R11/R14
> near verbatim), **C43550** (answered outright by SBC S4-R12) and **C30502** (observed live to MATCH
> WIP S7-R8 — the earlier "one day later than the specification" note was wrong by a day, and no ticket
> was filed because there is no defect).
> **The Location hold now covers 12 cases, not 16**, and **Parts Velocity is one of them** — contrary to
> what the round-3 sheet says, PV v5 states the point both ways too.
> **Denominator warning:** Chris published SBC v15, SBR v17 and WIP v9 at 17:53–17:54Z adding a suite-wide
> link-permission rule. **Those new requirements have NO cases at all** and are counted nowhere below.

> **The 2026-08-04 file `READINESS-2026-08-04-POST-DEPLOY.md` is SUPERSEDED by this one.** It is kept, not
> deleted. Its ready figure of 401 is out of date on two counts: 4 cases have been added since, and 35 that
> it held have been released.

---

## 1 · THE ONE FORMULA

> **ready to automate = all our cases − waiting on the product owner − not built yet − could not be set up here − needs a second sign-in we do not have**
> **= 476 − 20 − 8 − 1 − 1 = 446**

Written out in full:

| Term | Count |
|---|---|
| All our cases | **476** |
| − waiting on the product owner | **20** |
| − not built yet | 8 |
| − needs a live check we could not run (a logo that is uploaded but fails to load) | 1 |
| − needs a second sign-in that can see reports but cannot open work orders | **1** |
| **= ready to automate** | **446** |

**Cross-check against the markers actually written on the cases:**
`AUTOMATION: READY` **419** + `AUTOMATION: READY - EXPECT FAIL` **27** = **446**. ✅ **The arithmetic gate
passes**, and it was re-read from the live case text after the writes, not computed from the plan.
Cross-check the other way: 476 − 30 cases carrying `AUTOMATION: HOLD` = **446**. ✅

---

## 2 · OUTCOMES — mutually exclusive, every row sums to its total

Each case appears in exactly ONE outcome column.

| Report | Cases | Ready, works as documented | Ready, product wrong (ticketed) | Waiting on the PO | Not built yet | Needs a live check we could not run |
|---|---|---|---|---|---|---|
| Sales By Customer | **87** | **77** | 3 | **5** | 1 | 1 |
| Sales By Representative | **112** | 103 | 3 | **4** | 2 | 0 |
| Parts Velocity | 71 | 66 | 2 | 2 | 1 | 0 |
| Technician Utilization | 60 | 56 | 1 | 1 | 2 | 0 |
| Work In Progress | **78** | **62** | **10** | **4** | 1 | **1** |
| Inventory Value | 68 | 55 | 8 | 4 | 1 | 0 |
| **TOTAL** | **476** | **419** | **27** | **20** | **8** | **2** |

**Every row sums to its own Cases figure** — 77+3+5+1+1=87 · 103+3+4+2+0=112 · 66+2+2+1+0=71 ·
56+1+1+2+0=60 · 62+10+4+1+1=78 · 55+8+4+1+0=68. Counts are **derived from the markers actually written on
the cases and read back from live after the writes**, grouped by the report prefix in
`testrail-id-map.csv` — not estimated.

**TOTAL row check:** 419 + 27 + 20 + 8 + 2 = **476** ✅
**Ready to automate = 419 + 27 = 446** ✅

*The last column now holds **2**: **C43553** (a logo that is set but fails to load — the state could not
be produced without disturbing two other testers' organisation) and **WIP-COL-09 = C43557**, which needs
a second sign-in that can see reports but cannot open work orders. **No such account exists on this test
system, and every route to creating one is closed from our container** — see
`chris-newreqs-2026-08-05/FINDINGS.md` §4. **Any one of three small things clears it in about ten
minutes**, and they are listed there.*

*The "waiting on the PO" column has moved from 17 to **20**, and the three additions are all honest
rather than convenient: **C30100**, **SBC-LINK-05 = C43558** and **SBR-LINK-06 = C43559** all sit on the
same open question — Chris wrote the link-permission rule into Sales By Customer as a numbered
requirement but left **S9-N2** contradicting it, and wrote it into Sales By Representative as narrative
only while **S12-R1 / S12-R3** still read unconditionally. **One sentence from him releases the
expectation on all three.** ⚠️ **Said plainly so the column is not misread: C43558 and C43559 are blocked
TWICE over** — they need his answer **and** the second sign-in. They are counted once, in this column,
because without the answer there is nothing settled to run; a reader adding "just get the login" should
know it takes both.*

*The full make-up of the **20** "waiting on the PO": the **12** Location cases · **4** other
product-owner questions (C30096, C30310, C30315, C43551) · **C43552**, whose two spreadsheet downloads do
not exist · and the **3** new link-permission cases (C30100, C43558, C43559). **Four of them still look
wrongly held** — see `prov-restamp-2026-08-05/FINDINGS.md` §5; they were reported rather than released,
because releasing them moves this figure and that is the QA lead's call.*

---

## 3 · LEGEND — read this before quoting any number

- **"Ready, works as documented" (419)** — the case is **automatable**. **It does NOT mean the case passes
  on today's build.** The pass/fail verdicts on this suite were taken on 2026-08-04 against
  `v3.4.1-3d03023`, and the live build is now `v3.5-16cf83f`. **Anyone reading 446 as "446 cases pass" is
  misreading it.** The pass on Chris's new requirements re-observed only the Work In Progress filters and
  downloads; every other verdict still dates from 2026-08-04.
- **"Ready, product wrong (ticketed)" (27) — THESE ARE GOOD CASES.** Each states what the written
  description requires, the product does something else, and a developer ticket is open. **The automated run
  is EXPECTED TO FAIL until the ticket is fixed, and that failure is the case doing its job.** They carry
  `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`. The 27 break down as SV-8818 ×10, SV-8907 ×9, SV-8820 ×4, SV-8823 ×3, SV-8908 ×1.
- **"Waiting on the PO" (20)** — the written descriptions disagree with each other, so there is no settled
  expectation to test. **Not a defect in the case.** **12** are the Location column question and **3** are
  the new link-permission question.
- **"Not built yet" (8)** — the feature is absent. **This is not a readiness shortfall; it is absent
  product**, and these are excluded from the ready figure by the formula, not deducted from a quality score.
- **"Needs a live check we could not run" (2)** — a real-world state we could not create today.
- **A case needing a tool — devtools, a network trace, reading a PDF or a spreadsheet, seeded data, a theme
  toggle, a different window size — IS RUNNABLE BY A MANUAL TESTER TODAY and is counted as ready.** A tool
  flag has never been a reason to hold a case. Only a genuinely unobtainable thing is.

---

## 4 · FLAGS — enumerated, with internal ID, C-id and link

### 4.1 · Waiting on the product owner (17)

**The Location column — 12 cases, Tab 1 of the ROUND-3 question sheet**
(`rulings-2026-08-05/Questions-for-Chris-Ward_Report-Suite_Round-3_2026-08-05.xlsx`). Four cases that were
on this list have been **released** — TU-HRS-02 C30401, TU-EXP-04 C30437, TU-LOC-06 C38915 and WIP-COL-01
C30466 — and **Parts Velocity is still on it**, because PV v5 states the point both ways.

| Internal ID | C-id | Link |
|---|---|---|
| PV-COL-02 | C30352 | https://shopview.testrail.io/index.php?/cases/view/30352 |
| PV-FILT-14 | C38914 | https://shopview.testrail.io/index.php?/cases/view/38914 |
| WIP-COL-02 | C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 |
| WIP-EXP-02 | C30511 | https://shopview.testrail.io/index.php?/cases/view/30511 |
| WIP-FLT-09 | C38916 | https://shopview.testrail.io/index.php?/cases/view/38916 |
| IV-COL-01 | C30551 | https://shopview.testrail.io/index.php?/cases/view/30551 |
| IV-COL-04 | C30554 | https://shopview.testrail.io/index.php?/cases/view/30554 |
| IV-EXP-02 | C30588 | https://shopview.testrail.io/index.php?/cases/view/30588 |
| IV-LOC-06 | C38917 | https://shopview.testrail.io/index.php?/cases/view/38917 |
| SBR-LOC-05 | C38913 | https://shopview.testrail.io/index.php?/cases/view/38913 |
| SBC-COL-01 | C30156 | https://shopview.testrail.io/index.php?/cases/view/30156 |
| SBC-LOC-04 | C38912 | https://shopview.testrail.io/index.php?/cases/view/38912 |

**Other product-owner questions — 5 cases:** C30096, C30310, C30315, C43551 and C43552
(`https://shopview.testrail.io/index.php?/cases/view/<id>`). **C30186, C30502 and C43550 are no longer
here** — each was held against Chris Ward although he owed nothing on it, and all three are released.
**C30376 and C38859 are no longer held either** — they carry `AUTOMATION: READY` and their open point is
recorded in their text, not in a hold.

### 4.2 · Ready, product wrong — the 17, by ticket

| Ticket | Status | Cases |
|---|---|---|
| **SV-8818** (PDF download fails on a medium-sized view) | Ready to Fix | C30172, C30194, C30290, C30320, C30593, C30595, C38885, C38887, C43547, C43548 |
| **SV-8823** (spreadsheet money arrives as text; columns ignored) | Ready to Fix — **confirmed still reproducing live this pass** | C30162, C30287, C30589, C30588* |
| **SV-8820** (stock value dated one day late) | Ready to Fix | C30562, C30564, C30565, C30566 |

\* C30588 also carries a Location hold; it is counted once, under the hold.

### 4.3 · Not built yet (8)

C30191, C30311, C30319, C30368, C30442, C30506, C30592 and one further case
(`https://shopview.testrail.io/index.php?/cases/view/<id>`).

### 4.4 · Needs a live check we could not run (1)

| Internal ID | C-id | What is needed |
|---|---|---|
| SBC-EXP-17 | C43553 | a logo that is uploaded but **fails to load**. Not seeded: the organisation is shared with two other live testers today. |

*TU-EXP-10 C43552 has moved into the product-owner column above — its blocker is Chris's answer, not a
live check.*

---

## 5 · WHAT WOULD MOVE THE FIGURE

| If this happens | 446 becomes |
|---|---|
| **One second sign-in** — reports access, no work-order / part-sale / customer access | **+1 immediately** (C43557), and **+2 more** once Chris also answers below |
| **Chris answers the new link-permission question** (is the number a link at all, or plain text?) | **+3** — C30100, C43558, C43559. Two of the three ALSO need the sign-in above |
| Chris answers the round-3 Tab-1 question on the Location column | **+12** (the 12 held Location cases release) |
| Chris answers the other 4 product-owner questions | **+4** |
| Chris answers the spreadsheet-downloads question → C43552 settled | **+1** |
| A window on the organisation with no other worker, for the logo check | **+1** (C43553) |
| The four possibly-wrongly-held cases are reviewed and released | ready up to **+4** |
| **Everything answered and one extra sign-in** | **468 of 468 answerable cases** — with 8 not built |

---

## 6 · OUTSTANDING — what I need from you

1. **One sentence from Chris on the Location column** — it unblocks **16 cases** and is the single biggest item.
2. **The other six answers** on the round-2 sheet — 7 more cases.
3. **A window on organisation `d55bc308…` with no other worker active**, for the logo check.
4. **Authorisation to sync run 359** (union-only) — **4 of our cases are not in it** (C43550–C43553) and it
   will never pick them up on its own.
5. **A yes/no on filing the date-range finding** (`final-viu-2026-08-05/API-ASK.md` ASK 1).
6. **Tell us when the branch is declared final** — until then every verdict stays provisional.
