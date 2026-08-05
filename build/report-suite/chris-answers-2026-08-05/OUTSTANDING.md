# OUTSTANDING — what we need, and from whom

**Report Suite · epic SV-8582 · as at 2026-08-05**

Every item states the four things Standing Rule 36 requires: **what is missing · who owes it ·
what it blocks · since when.** Where an item is blocked on the **QA lead himself**, it also
carries the five extra fields Standing Rule 48 requires — the ruling quoted, when he gave it,
the named cases, why it was reasonable, and the one thing that would unblock it.

**Engineering intends to release Tuesday, or Thursday next week at the latest.** Everything
below is read against that.

---

## THE ONE THING I MOST NEED FROM YOU

**Your go-ahead to execute the 46 staged case edits.** They are fully prepared and byte-exact
in `testrail-sync-manifest.md`. Until they run, **7 tests that nobody had frozen stay live and
wrong** — they would fail a build behaving exactly as Chris now wants, or pass one that is
wrong. With a release days away that is the sharpest risk on this project.

**A close second:** Chris left **9 of 24** items blank, and one of his answers (the location
column) **contradicts itself** in a way that blocks a developer ticket.

---

## 1 · MISSING SOURCES

| What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|
| **All six report descriptions are un-updated.** Read live 2026-08-05: SBC 13 · SBR 15 · PV 4 · TU 5 · WIP 6 · IV 3 — not one has moved. Chris: *"just haven't done any of the updates you separated"* | **Chris Ward** | Nothing, operationally — he authorised testing to his answers instead (item T3-2 = A). But it means **every one of the 46 staged cases must cite his spreadsheet rather than a specification**, and an outside reader still sees our tests disagreeing with the written descriptions. | 2026-07-29 for most; the newest 15 since 2026-08-05 |
| **The QA branch is still not declared final.** Build `v3.4.1-3d03023` | **Engineering**, via you | **Every verdict on all 469 tests is provisional.** The Rule-49 re-check queue `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** and no suite may be called complete. | 2026-08-03 |
| **No designs exist for this project at all** | Chris Ward / design | Nothing is blocked — it is a spec-only project and always has been. Recorded so it is not mistaken for an oversight. | project start |

## 2 · UNANSWERED QUESTIONS

### 2a · The 9 items Chris left completely blank

All nine are on tab 3 under *"THINGS THAT ONLY NEED WRITING DOWN (NO DECISION NEEDED)"* — every
one asks him to correct a written description. **His silence is consistent with what he told
you**, so this is a documentation debt rather than a refusal.

| Item | What we asked | What it blocks | Cases still frozen |
|---|---|---|---|
| **T3-6** | Will you write down that Technician Utilization sits below the existing menu links? | Documentation only — no case depends on it. | none |
| **T3-7** | Will you name the menu group Sales By Customer sits in, and say it goes below the existing links? | **A real test stays frozen.** It asserts the Performance group and the placement, and our own notes record the build showing a *SALES* group instead — so we cannot tell whether the test or the build is wrong. | **SBC-NAV-01** = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) |
| **T3-8** | Will you write down that the Work In Progress asset chooser looks like every other multi-pick list, with a select-all? | Documentation only — nothing in our tests depends on it. | none |
| **T3-9** | Will you change "Sales Rep" to the full word on screen, on the customer card and in the assignments file? | **Two tests stay frozen.** His item T2-3 answer covered only the DOWNLOAD heading, so the on-screen label is still open. Applying T2-3 to the screen would be us extending his answer past what he wrote. | **SBR-WO-01** = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) · **SBR-WO-06** = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) |
| **T3-10** | Will you correct the line calling Parts Velocity the "only" report in the Parts group? | Documentation only — Inventory Value is in that group too. | none |
| **T3-11** | Will you correct the line saying Escape closes the deactivate pop-up? | Documentation only — our test already follows your 28 July answer that Escape must NOT close it. | none |
| **T3-12** | Will you add the download size limit and its message to the three descriptions that lack it? | Documentation only — tests exist for all six reports already. | none |
| **T3-13** | Will you add a note that "VIN" also covers machines that are not vehicles? | Documentation only — our tests already carry a plain note for the tester. | none |
| **T3-14** | Will you tidy the garbled characters in two descriptions? | Nothing — but it makes those lines hard to quote back to you. | none |

**Owed by:** Chris Ward. **Since:** 2026-08-03 (first asked on the 17-item sheet) — **two days,
and the second time of asking**.

### 2b · His own answer contradicts itself, and it blocks a developer ticket

**Item T1-1, the location column.** We offered him two options; he wrote a third rule:

```
C) -- by default, the
column will exist in all
reports being built as
follows (requirements):

1) user has access to
multiple locations;
2) user has selected
multiple locations;
---------
The location column 
selector should still be toggleable
from the column selector
list for the user, if the above
is satisfied (note - the column
selector for locations 
should not appear if the user
doesn't satisfy #1 above.
```

**The problem, in one sentence:** *"toggleable … if the above is satisfied"* reads as needing
**both** his conditions, so a person with access to several branches who has selected only one
would get **no** switch — but his own bracket only removes the switch when someone lacks
**access** to several, which reads as **yes**, they do get it. **Those two sentences describe
the same person differently**, and it is a common person, not an edge case.

| | |
|---|---|
| **What is missing** | One sentence from Chris: for someone who *can* see several branches but has selected only one, is the Location option offered in the column list or not? |
| **Who owes it** | **Chris Ward** |
| **What it blocks** | **Developer ticket B4 cannot be written** — we cannot describe correct behaviour to a developer while his own two sentences disagree. It also blocks **two new tests** (`DELTAS.md` N1, N2) and leaves a question mark on **15 staged cases**, which we have staged to state only the part of his rule that is unambiguous. |
| **Since** | 2026-08-05, the moment he answered |

**Two smaller ambiguities in the same answer:** does a hand-made toggle **persist** (N3), and do
the **downloads** follow the column? The second we resolved by derivation — his T2-4 remark
*"on-screen should match download"* plus his T3-1 answer **A** settle it — and `DELTAS.md`
labels it as a derivation rather than as something he said.

### 2c · Three answers that left part of their own question unaddressed

| Item | What he answered | What he did NOT answer |
|---|---|---|
| **T2-6** — the Technician Utilization download menu | **B**, "consistency is key" — use the longer wording | Whether the menu should have **four** options or three. We read "bring it into line with" the two named reports as meaning four, but that is our reading. **One word confirms it.** It also opens a coverage gap: two spreadsheet downloads where the description described one. |
| **T2-7** — the Inventory Value "As of" line | **A**, it belongs in the spreadsheet | Whether both files should **word it identically**. Option C was that option and he did not take it, so the punctuation difference (`As of:` versus `As of`) stays by default. Our test already tells the tester not to raise it — that stance now rests on implication, not on his words. |
| **T2-9** — Print is gone | Praised the flag: *"Intentionally dropped :). Great call-out!"* | He did **not** tick the box asking whether to keep reminding him, and did not say he would drop the two stale description lines or close the open Print job. So we do not know whether to keep chasing it. |

## 3 · MISSING GO-AHEADS AND AUTHORISATIONS — all owed by you

| What is needed | What it blocks | Since |
|---|---|---|
| **Execute the 46 staged case edits** (`testrail-sync-manifest.md`) | **7 live, unfrozen tests stay wrong** and 39 frozen tests stay frozen. Highest-risk item on the project with a release days away. | 2026-08-05 |
| **Author the 5 new cases** (`DELTAS.md` N1–N5) | Coverage his answers create. **N1** (a one-location person must never see the Location option) and **N4** (two Technician Utilization spreadsheet downloads) look like real coverage the release would otherwise ship without. **N2 also needs Chris's clarification first.** | 2026-08-05 |
| **File the 5 developer tickets** (`DELTAS.md` B1–B5) | Five defects his answers prove are defects. None is API-only, so Standing Rule 51 does not bar them — but filing needs your word. **B4 needs Chris's clarification first.** | 2026-08-05 |
| **Decide what to do about the 5 wrongly-frozen cases** — **SBC-VIS-02** = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) · **TU-EXP-07** = [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) · **WIP-SUM-05** = [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) · **WIP-FLT-05** = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) · **IV-DATE-04** = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) | Each carries a "waiting on the product owner" line that **no question on the sheet supports**. Two are blocked on a developer, one on a question never asked, two on nothing at all. They are needlessly excluded from automation. **We staged no change** — removing that line changes what a tester does. | 2026-08-05 |
| **Decide whether the durable `CLAUDE.md` asset-identifier rule should be narrowed** | Chris's T2-2 answer **B** reverses, for Work In Progress only, his own 2026-07-29 cross-project ruling. See §5 X1. We left the durable rule untouched. | 2026-08-05 |

## 4 · ACCESS AND CREDENTIALS

| What is needed | What it blocks | Since |
|---|---|---|
| **Fresh sign-in for the QA branch**, if a live re-check is wanted | **This pass made no live build observation.** Several verdicts want confirming on the build — the Summary-file column position (2 cases), the Sales By Representative printable-file heading, and the whole location-column rule. | not requested this pass |
| Nothing else | TestRail read-only worked; Atlassian read-only worked | — |

## 5 · DECISIONS DEFERRED OR HELD, AND CONFLICTS FLAGGED NOT RESOLVED

### X1 · Chris reverses his own cross-project ruling (Standing Rule 48 treatment)

| | |
|---|---|
| **The conflict** | On **2026-07-29** Chris ruled the vehicle-number chain applies everywhere, verbatim: *"A is the correct answer"*, adding *"Not just for these specs though -- really good to keep this in mind for all actions moving forward."* That is recorded as a **durable, cross-project** rule in `CLAUDE.md`. On **2026-08-05** he answered **B** on Work In Progress: *"this is visually appealing, and already built. This looks right."* |
| **Which wins** | For **Work In Progress**, his newer answer (Standing Rule 32) — and the option he chose says so in its own words: *"we record that your ruling does not reach this one report."* |
| **Why the original ruling was reasonable** | It was right, and it still is for the other five reports. He was making the asset identifier consistent everywhere; he has now seen this one report built and judged its two-line layout better. Nothing about the 29 July ruling was careless. |
| **What we did** | Staged 4 case rewrites for Work In Progress. **Left the durable rule in `CLAUDE.md` untouched** — narrowing a rule you recorded as applying to all future work is your call, not ours. |
| **Affected cases** | **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) · **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) — and **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134), which **keeps** the vehicle-number chain |
| **What unblocks it** | One line from you: does the durable rule get an "except Work In Progress" note, or stand as written with this as a per-report exception? |

### X2 · A ticket status moved with no action of ours

| | |
|---|---|
| **What happened** | [SV-8821](https://shopview.atlassian.net/browse/SV-8821) — the create-invoice server error — now reads **OBSOLETE**. Our record says it was deliberately kept **Open** because that failure **also happens through the product's own screen**, which is what made it user-facing rather than API-only (Standing Rule 51). |
| **What we did** | **Nothing.** Per Standing Rule 53, a change under our shared account is read as **your triage**, not as drift, and is never reversed. We have burned ourselves once already by "restoring" a value you had deliberately changed. |
| **What we need** | Confirmation that closing it was intended. If it was **not**, it needs re-opening — and that is your write, not ours. |
| **Since** | noticed 2026-08-05 |

### X3 · Our own earlier mapping was wrong — recorded, not buried

Our QA-only mapping tab of 2026-08-04 said *"there is NO Sales By Customer case asserting the
hidden filter"*. **That was wrong** — **SBC-LOC-01** = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) line 5 asserts it plainly, so the
new Sales By Customer case that plan implied is **not needed**. Nothing is blocked; it is
recorded in the open because a mistake of ours that quietly disappears is worse than one
written down (Standing Rule 44).

## 6 · WHAT ANOTHER TEAM OWES

| What is owed | Who | What it blocks | Since |
|---|---|---|---|
| **Declare the QA branch final** | Engineering | Every verdict on all 469 tests stays provisional; the Rule-49 queue stays OPEN | 2026-08-03 |
| **The 5 fixes his answers call for** (B1–B5) | Engineering, once filed | 5 tests will read red until they ship — correctly so | 2026-08-05 |
| **[SV-8818](https://shopview.atlassian.net/browse/SV-8818) · [SV-8820](https://shopview.atlassian.net/browse/SV-8820) · [SV-8823](https://shopview.atlassian.net/browse/SV-8823)** — all three read **Ready to Fix** | Engineering | Their cases read red until fixed. **IV-DATE-04** = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) is one of them and is **needlessly still frozen** — see §3. | 2026-08-04 |
| **The four missing Sales By Representative download columns** | Engineering (per his T2-4 = A) | **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) expects thirteen columns; nine arrive | 2026-08-05 |

---

## Nothing hidden

All six Standing Rule 36 categories were swept and **each one has entries — none is "nothing
outstanding"** this time. The single most consequential item is the first: **your go-ahead on
the 46 staged edits**, because 7 of the tests they fix are live right now, are wrong, and carry
no warning to the person who would automate them.
