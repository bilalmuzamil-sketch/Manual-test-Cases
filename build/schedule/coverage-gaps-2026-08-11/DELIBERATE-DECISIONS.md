# Schedule coverage-gap pass — DELIBERATE DECISIONS (Standing Rule 46) — 2026-08-11

**Everything this pass chose NOT to do, written down before anyone asks.** An undocumented deliberate
omission is indistinguishable from a miss, so each entry carries the decision, a plain one-sentence answer
a non-technical reader can paste into a channel, the evidence, the affected cases with C-ids and links, who
can close it, and an **honest** risk rating.

**Read the risk column honestly: HIGH does not mean we are wrong. It means that if this is raised in
public, we have a concession to make and not just an explanation.**

| | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|
| Entries | **2** | **3** | **6** | **11 open + 1 closed during the pass** |

**HIGH: D7** (the design baseline cannot be dated and ~48 labels rest on it) · **D12** (two cases held on a
question we wrote five days ago and have not sent).
**MEDIUM: D5** (staged labels unconfirmed against a build) · **D6** (no Rule-41 forensic diff of 174 bodies)
· **D9** (no ticket for the unbuilt panel control).
**CLOSED DURING THE PASS, kept as a record: D11** (the 148 missing read-on dates — a sibling worker's sweep
finished while these files were being written; **174 of 174 now carry one**).
**LOW: D1 · D2 · D3 · D4 · D8 · D10.**

---

## D1 · We did not author for `§5.3-L195.A1` — *"Persistence. Not persisted in the prototype."*

**Plain answer:** That sentence describes how the clickable mock-up behaved, not how the product must
behave, so there is nothing for a tester to check — and the very next sentence, which *is* a product
requirement, is covered.

**Evidence:** Confluence v27 §5.3, verbatim: *"**Persistence.** Not persisted in the prototype.
Session-scoped per user for build — this is a working-mode preference, not a saved view."* The build
requirement is the second clause, `§5.3-L195.A2`, asserted by **SCH-PANEL-06 =
[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** expected 1 and 2.

**Affected cases:** none — this is a non-authoring. **Closed by:** nobody; it is a verdict, not a gap.
**Risk: LOW.** It is re-classified from UNCOVERED to NOT-INDEPENDENTLY-TESTABLE, and the re-classification
is stated in the tally rather than quietly folded into "covered" — the distinction is the point.

---

## D2 · We REVERSED the 2026-08-10 recommendation to skip the dark-mode depth requirement

**Plain answer:** Last week we said this one was really a design check and someone else would pick it up
later; that someone has not been scheduled, the release is Thursday, and a tester can plainly see whether a
pop-up stands off the page or merges into it — so we wrote the case.

**Evidence:** `build/schedule/coverage-rederivation-2026-08-10/GAPS.md` G5 recommended *"fix the first,
skip the other two… closer to design-fidelity checks and would be better handled by the Figma pass that has
not happened."* Requirement, v27 §11: *"elevation/shadow tokens also swap so **depth reads correctly on
dark surfaces**."* **Dated to v19, 2026-07-23** (`evidence/requirement-dating-2026-08-11.json`).

**Affected cases:** staged **`SCH-EDGE-10`** (`NEW-CASES.md` S2); the requirement is currently only
partly covered by **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)**.
**Closed by:** the QA lead, by approving or rejecting S2.
**Risk: LOW.** The downside of authoring it is one more case to run; the downside of skipping it a second
time is a requirement that has now been skipped twice. **A skip whose owning pass never runs is an
uncovered requirement with a nicer name.**

---

## D3 · `SCH-EDGE-09` does not assert that one person's theme leaves another person's untouched

**Plain answer:** The case proves your dark-mode choice is stored against your account and not against one
browser, but it does not check a second person's screen — that needs a second sign-in we have not had since
5 August, and adding it would have put the case on hold instead of making it runnable.

**Evidence:** Requirement, v27 §11: *"…and **persisted per user**."* The case covers account-scoping by
signing in as the **same** user in a second browser (step 7). **Thirteen Schedule cases already carry
`AUTOMATION: HOLD - needs a second sign-in as…`**, so the blocker is real and suite-wide.

**Affected cases:** staged **`SCH-EDGE-09`** (`NEW-CASES.md` S1).
**Closed by:** the second non-administrator sign-in — outstanding since 5 August, in
`build/OUTSTANDING-ITEMS-REGISTER.md`.
**Risk: LOW.** The substantive promise — per-user rather than per-browser — *is* asserted, and that is the
failure a tester would actually meet.

---

## D4 · `§11-L301.A6` is staged as an EXTENSION of an existing case, not as a new case

**Plain answer:** The check needs five overlapping shifts on one technician, which an existing case already
sets up, so it is one extra line in that case rather than a whole new test that repeats the same expensive
setup.

**Evidence:** **SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)**
precondition 2 already seeds *"FIVE mutually overlapping shifts at the same time on the same day"*. Rule 28
scores a case that duplicates an existing setup to assert one sentence as a **MERGE**, not a KEEP.

**Affected cases:** C29998 (`NEW-CASES.md` S3).
**Closed by:** the QA lead approving S3.
**Risk: LOW** — with one honest rider: an extension is invisible in a case count, so **the requirement will
look uncovered to anyone counting cases rather than reading them.** That is exactly why it is written down
here and given its own row in the coverage map.

---

## D5 · No build was observed, so no case here carries a build marker or a verdict

**Plain answer:** This was a paperwork pass about which requirements have tests, not about whether the
product works, so nothing here says anything about the build.

**Evidence:** Rule 57 — a coverage question is document-side; the build supplies labels and the verdict,
never the expectation. `quick-login` and `switch-user` were **deliberately not called**: they rotate the
shared session and siblings are live on this estate.

**Affected cases:** the three staged items carry **sentence 1 only** of the Rule-54 provenance line.
**Closed by:** the pass that pushes them, adding sentence 2 if it observes a build.
**Risk: MEDIUM.** The staged text names **the user menu** and **pop-up windows** without a confirmed
on-screen label, because we hold **no dated design** and saw no build. **Anyone pushing these should
confirm the wording live first** — Rule 9 forbids inventing a label, and quoting the specification's own
words is the honest substitute, not an equivalent.

---

## D6 · We did not re-run a full Rule-41 forensic diff of all 174 case bodies

**Plain answer:** We checked mechanically that every requirement still has case text matching it, but we
did not re-read all 174 cases line by line against their sources, so a case whose wording was quietly
weakened while keeping its keywords would not have been caught.

**Evidence:** **All 174 bodies changed after 2026-08-10 12:00Z.** The check run instead compares each of
the 397 assertions' best-match score against the 2026-08-10 baseline: **20 improved, 376 held, 1 degraded**
(hand-read, still covered). That proves the matching **text** survives; it cannot prove an **assertion**
was not softened — the Rule-57 failure mode where steps are VIU'd correctly and the expectation bends.

**Affected cases:** potentially any of the 174. **Closed by:** a Rule-41 pass diffing expectation bodies
against cited sources across the intervening commits.
**Risk: MEDIUM.** The Report Suite found exactly this class of drift on 2026-08-05, across 748 cases. **It
is named here rather than assumed away**, and it is the single largest thing this pass did not do.

---

## D7 · We did not re-ingest the design, and the design is now an authoritative source

**Plain answer:** The design we hold has no date on it, and the newer link people are citing has no date
either, so fetching it again would not tell us which is the current one.

**Evidence:** Source D in `SOURCE-CURRENCY.md` is **PARTIAL**. SV-8915 / SV-8916 / SV-8917 **and story
SV-8700's own UI/UX field** all cite `claude.ai/design/p/d3cdcf5c-…?via=share` — **live, editable, no
version, no date** — so Rule 32's latest-wins cannot be applied to it at all (Rule 57 follow-up (i)).
**~48 of our Schedule labels were pinned from the prototype at `build/schedule/design-2026-07-27/`.**

**Affected cases:** ~48, plus staged `SCH-EDGE-09` and `SCH-EDGE-10`, whose labels are unconfirmed.
**Closed by:** Branko or the QA lead confirming which design artefact is canonical — **already asked, still
unanswered.**
**Risk: HIGH.** Design became an authoritative source of expected behaviour on 2026-08-06, which makes an
undatable baseline a bigger problem than it was, not a smaller one.

---

## D8 · We did not fix the `§4.12` case, and we did not undo the fix somebody else made

**Plain answer:** Somebody has already corrected that case to match the newest wording of the specification,
which is the right wording to follow — we checked, agreed, and left it alone.

**Evidence:** **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** now reads
*"a breakdown for each assigned technician"*. Dating (all 27 versions): `per-assigned technician` first
appears at **v26, 2026-08-07T11:02:57Z**; the wording it replaced stood from **v1 to v25**. **So the new
wording is genuinely the newer source and Rule 32 points forwards.**

**The honest rider:** the 2026-08-10 pass recommended **holding this edit until Branko confirmed the
one-word change was not a typo** (**v26 carries no version comment**, so nothing announced it), and it was
applied without that confirmation. **The edit is defensible under Rule 57** — the spec is the source and
this is its current text — so it is **not** reverted.
**Closed by:** Branko, in one line. **Risk: LOW.**

---

## D9 · We did not raise a Jira ticket for anything, including the panel control that is not built

**Plain answer:** Creating Jira tickets is on hold until you say otherwise, so findings are written up and
handed to you instead.

**Evidence:** the hold of 2026-08-10, verbatim: *"Do not create anything until my next order"* — clarified
on 2026-08-11 to cover **Jira only**, not test cases. Rule 62 requires per-ask permission in any case.
The panel-collapse control being absent from the build was established by the 2026-08-11 pass
(`build/schedule/panel-collapse-2026-08-11/NEW-CASES.md`) and **has no ticket.**

**Affected cases:** C43582–C43587. **Closed by:** the QA lead lifting the hold or authorising one ticket.
**Risk: MEDIUM.** The six cases will be run and failed by a tester with no ticket to point at, which is
survivable but wasteful.

---

## D10 · We did not fix the "steps 1 to 8" wording on the six new panel cases

**Plain answer:** All six of the new panel cases tell the tester that "steps 1 to 8 cannot be carried out",
but five of them do not have eight steps — it is a copied sentence and it should say the right number.

**Evidence, measured live 2026-08-11:** real step counts are **7, 6, 7, 4, 5, 7** for C43582–C43587
respectively; **all six carry the identical sentence** *"…so on that build steps 1 to 8 cannot be carried
out and this test FAILS."* Only C43582 has eight of anything (eight expected results).

**Affected cases:** [C43582](https://shopview.testrail.io/index.php?/cases/view/43582),
[C43583](https://shopview.testrail.io/index.php?/cases/view/43583),
[C43584](https://shopview.testrail.io/index.php?/cases/view/43584),
[C43585](https://shopview.testrail.io/index.php?/cases/view/43585),
[C43586](https://shopview.testrail.io/index.php?/cases/view/43586),
[C43587](https://shopview.testrail.io/index.php?/cases/view/43587).
**Closed by:** an authorised `update_case` pass — **this pass makes no writes and another worker owns
TestRail for Schedule.**
**Risk: LOW**, but it is our own text confusing a tester, and it is the kind of thing a reviewer notices
first.

---

## D11 · We did not sweep the missing Rule-54 read-on dates

**Plain answer:** Your new rule says every case must record the date we read each of its sources; only 26 of
174 Schedule cases do, and fixing the rest is 148 separate edits that were not part of this job.

**Evidence:** Rule 54 as amended 2026-08-11 — *"make sure to mention the date of the source when that
source of truth was taken from each source"*. Measured live at pass start, **13:10Z: 26 of 174** carried a
read-on date.

**⚠️ CLOSED WHILE THIS PASS WAS BEING WRITTEN, AND CORRECTED HERE RATHER THAN QUIETLY DELETED (Rule 59).**
Re-read live at the end of the pass: **174 of 174 now carry a read-on date.** A sibling worker's read-date
sweep completed under us — the same class of event as a spec moving mid-pass. **The original figure is kept
above rather than erased**, because a silently-corrected wrong number is how a reader stops trusting the
right ones.

**Affected cases:** was 148, now **0**. **Closed by:** already done, by the sibling pass.
**Risk: NONE — this entry is retained as a record, not as an open item.** The three staged cases carry
their read-on dates too, so the suite is uniform rather than in two states.

---

## D12 · We did not treat the shop-closure contradiction as resolved, although the dating favours our cases

**Plain answer:** The specification says two opposite things about shop closures; we found that the one our
tests follow is the newer of the two, which makes our position stronger, but a document arguing with itself
still needs Branko to settle it.

**Evidence:** §12's *"block the spread step from placing shifts on those days"* dates to **v1
(2026-07-15)**; §4.5's *"Shop closures and public holidays are not skipped in V1"* was added at **v22
(2026-07-27)** and has survived five later edits. Both are in v27. **Two sentences in one document at one
version are a document defect, not a Rule 32 conflict between sources**, so recency informs the risk and
does not answer the question.

**Affected cases:** **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)**
and **SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)**, both on
`AUTOMATION: HOLD` and both saying so in their own text.
**Closed by:** Branko — **and the question is already written, as Tab 2 Item 1.0 of the 6 August sheet,
which has never been sent. The blocker is us.**
**Risk: HIGH.** Two cases are held on a question we wrote five days ago and have not asked.
