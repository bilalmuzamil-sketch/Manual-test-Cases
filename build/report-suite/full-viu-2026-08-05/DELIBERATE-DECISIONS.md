# DELIBERATE-DECISIONS — Report Suite, 2026-08-05 (Standing Rule 46)

Six fields per entry: the decision · the plain one-sentence answer · the evidence · the affected cases ·
who can close it · the honest risk.

---
## 1. Twelve cases are still held on the Location column, and the build has now made the question sharper

**Decision.** I did not release the twelve held Location-column cases, even though I now know exactly what
the build does.

**Plain answer.** All six written specifications still describe the Location column in two contradictory
ways, so we are holding these twelve tests until Chris Ward tells us which one he means — and the build
cannot settle it for us because the build does it three different ways out of six.

**Evidence.** Every spec carries both readings. Model A, access-gated and toggleable: SBC **S4-R12**
("the column is shown by default and can be toggled on or off from the column selector, **regardless of how
many locations are currently selected**"), WIP line 47, IV line 44, PV line 46, TU line 41, SBR line 23.
Model B, scope-driven and not toggleable: PV **S3-R10** ("auto-managed by the location scope … **is not
user-toggleable** … hidden entirely when a single location is in scope"), WIP **S7-R13** ("the user does not
toggle it in the column selector"), IV **S7-R6** ("not one of the columns offered in the column-selection
control"), SBC glossary line 69, SBR lines 68 and 78, TU line 50.
Live on `v3.5-16cf83f`, with a user who has access to both locations and **one** location selected
(`evidence/loccol.json`): the column is **shown** on SBC, WIP and IV and **hidden** on SBR, PV and TU. In the
column selector (`evidence/colsel.json`) it is offered on **IV only** — not on the other five.
**So whichever way Chris rules, three reports are wrong.**

**Affected cases.** [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) ·
[C30352](https://shopview.testrail.io/index.php?/cases/view/30352) ·
[C30467](https://shopview.testrail.io/index.php?/cases/view/30467) ·
[C30511](https://shopview.testrail.io/index.php?/cases/view/30511) ·
[C30551](https://shopview.testrail.io/index.php?/cases/view/30551) ·
[C30554](https://shopview.testrail.io/index.php?/cases/view/30554) ·
[C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
[C38912](https://shopview.testrail.io/index.php?/cases/view/38912) ·
[C38913](https://shopview.testrail.io/index.php?/cases/view/38913) ·
[C38914](https://shopview.testrail.io/index.php?/cases/view/38914) ·
[C38916](https://shopview.testrail.io/index.php?/cases/view/38916) ·
[C38917](https://shopview.testrail.io/index.php?/cases/view/38917)

**Who closes it.** Chris Ward, in one sentence.

**Risk: HIGH.** Twelve tests have been unrunnable for days on a question nobody has answered, and the honest
concession is that the *question* has been sitting with us — the follow-up sheet exists but the answer has
not come back.

---
## 2. I corrected five markers on my own live evidence

**Decision.** I changed five cases from `AUTOMATION: HOLD - this part of the report is not built yet` to
`AUTOMATION: READY` without asking first.

**Plain answer.** Those five tests said the feature did not exist yet; I opened the app and it does, so the
note was simply false and I corrected it.

**Evidence.** C30191 — server-side sorting proven on 113 rows with a working page-2 continuation and a
bogus sort column safely ignored. C30592 — the export returned 9,276 rows where the screen had loaded 5.
C30506 and C38859 — the Column Selection button exists with that exact accessible name and opens the exact
toggle lists the cases describe. C30442 — the Location filter exists with a Clear Location action.
No expected-result body was touched (Rule 57).

**Affected cases.** [C30191](https://shopview.testrail.io/index.php?/cases/view/30191) ·
[C30442](https://shopview.testrail.io/index.php?/cases/view/30442) ·
[C30506](https://shopview.testrail.io/index.php?/cases/view/30506) ·
[C30592](https://shopview.testrail.io/index.php?/cases/view/30592) ·
[C38859](https://shopview.testrail.io/index.php?/cases/view/38859)

**Who closes it.** The QA lead, by agreeing or reverting.

**Risk: LOW** for four of them; **MEDIUM for C30442**, because I proved the filter exists but did not drive
its "All locations acts as select-all" and "not offered to a single-location user" items. `READY` claims
only that the case is automatable, which is true — but the case is not fully verified and I have said so.

---
## 3. I did not release the four cases the QA lead has not ruled on

**Decision.** C30096, C30310, C30315 and C43551 keep their holds.

**Plain answer.** The brief told me to establish the facts and report, not to release them, so that is what
I did — and I got less far on them than I wanted.

**Evidence.** C30096 (where Sales By Customer sits in the reports menu) — the navigation was captured live
and the report **is** listed under **SALES**, as `groups_2 Sales By Customer`, with a **PERFORMANCE** group
above it holding Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency, Work In Progress,
Technician Utilization and Sales By Representative (`evidence/screens.json`). The case expects it under
Performance. **That is a real conflict and it needs Chris's answer, not my judgement.** C30310, C30315 and
C43551 were **not reached** — no live evidence gathered.

**Affected cases.** [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) ·
[C30310](https://shopview.testrail.io/index.php?/cases/view/30310) ·
[C30315](https://shopview.testrail.io/index.php?/cases/view/30315) ·
[C43551](https://shopview.testrail.io/index.php?/cases/view/43551)

**Who closes it.** The QA lead, then Chris Ward for C30096.

**Risk: MEDIUM.** Three of the four have no live evidence at all after a pass that was meant to gather it.

---
## 4. C30100 was left pointing the way it points

**Decision.** I did not touch C30100 and did not resolve its contradiction from the build.

**Plain answer.** The Sales By Customer specification says two different things about whether an invoice
number is a link or plain text, so the test stays as it is and the question stays with Chris.

**Evidence.** The brief states S9-N2 describes a click-through while S9-R1a now says plain text. Standing
Rules 57 and 58 both forbid settling that by looking at the app. **I did not independently re-read either
anchor this pass** — I accepted the brief's characterisation, which is a limitation worth naming.

**Affected cases.** [C30100](https://shopview.testrail.io/index.php?/cases/view/30100), and relatedly
[C43558](https://shopview.testrail.io/index.php?/cases/view/43558) and
[C43559](https://shopview.testrail.io/index.php?/cases/view/43559).

**Who closes it.** Chris Ward.

**Risk: MEDIUM.** A specification that contradicts itself on a permission-facing behaviour is exactly the
kind of thing that ships wrong.

---
## 5. 444 of 476 cases were not observed, and I am not dressing that up

**Decision.** I report 32 observed and 444 not, rather than counting the broad evidence base as coverage.

**Plain answer.** We captured a lot of real evidence about all six reports, but looking at a screenshot is
not the same as running a test, so only the tests actually run are counted.

**Evidence.** FINDINGS.md lists all 476 with a tier each. The captured artifacts are under `evidence/`.

**Who closes it.** Another pass with a live session — the queue in RECHECK-QUEUE.md names every row.

**Risk: HIGH.** The mandate was to close the live-observation gap for Report Suite and the gap is mostly
still open. The honest number is 32 of 476.

---
## 6. Fourteen cases changed underneath me and I did not repair them

**Decision.** Reported, not fixed.

**Plain answer.** Fourteen tests now show raw formatting codes to the tester, the change did not come from
anything I did, and repairing them is 42 edits that need your go-ahead.

**Evidence.** See the closing section of testrail-execution-log.md. `updated_on` and `updated_by` did not
move on any of the fourteen, which is itself the more troubling finding.

**Affected cases.** C30341 C30392 C30451 C30456 C30457 C30460 C30487 C30490 C30491 C30493 C30519 C30522
C30526 C30528.

**Who closes it.** The QA lead authorising a repair pass.

**Risk: MEDIUM** for the testers who hit those fourteen; **HIGH for our verification method**, because it
shows `updated_on` can stand still while a stored value changes.
