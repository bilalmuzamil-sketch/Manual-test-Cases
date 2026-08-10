# Schedule — DELIBERATE DECISIONS / anticipated-challenge register (Standing Rule 46) — 2026-08-10

**Why this exists:** an undocumented deliberate omission is indistinguishable from a miss. Every
decision below was made on purpose during this pass, and each carries all six required fields —
the decision, a plain one-sentence answer, the evidence, the affected cases, who can close it, and an
honest risk.

**Read the RISK column honestly: HIGH does not mean we are wrong. It means that if this is raised in
a public channel we have a concession to make, not just an explanation.**

| Risk | Count |
|---|---|
| HIGH | 3 |
| MEDIUM | 6 |
| LOW | 7 |
| **Total** | **16** |

---

### 1 · We did not author the §5.3 panel-collapse cases, even though we found the gap · **RISK: MEDIUM**

**Plain answer:** we were authorised to build the map, not to change the suite, so the two cases are
written out ready to go and are waiting on one word from the QA lead.
**Evidence:** the authorisation was *"Authorise the Schedule requirement-to-case rebuild — Do what is
logically correct"*; Rule 6 says nothing enters TestRail unasked. The proposal is
`PROPOSED-CHANGES.md` P4, with both cases' assertions written out.
**Affected:** none yet — `SCH-PANEL-01` and `SCH-PANEL-02` have no C-ids because they do not exist.
**Who closes it:** the QA lead, with one go-ahead.
**Honest risk:** the branch could ship with the panel toggle untested. Mitigating: §5.3 is three days
old and the two cases are ready to author.

---

### 2 · No build was observed, and no verdict in this pass claims one · **RISK: LOW**

**Plain answer:** a coverage question is answered from the documents, not from the running app, so we
did not sign in — and we deliberately did not call `quick-login`, which would have signed a colleague
out of the Reports branch.
**Evidence:** Rule 57 — expected behaviour comes from the PRD, the stories, the PO's answers or the
design; the build supplies only labels and pass/fail. The brief also stated no Schedule sign-in was
available.
**Affected:** all 168 — every verdict in this map is about **whether a requirement has a case**, never
about whether the build satisfies it.
**Who closes it:** nobody; this is the correct scope.
**Honest risk:** none to the map. The separate Rule-49 obligation is untouched — the queue at
`build/schedule/full-viu-2026-08-05/RECHECK-QUEUE.md` stays OPEN and all 168 build verdicts from 5–6
August remain PROVISIONAL.

---

### 3 · We did not re-stamp the stale specification version, though we found it on all 168 · **RISK: MEDIUM**

**Plain answer:** correcting it is 168 TestRail writes, which needs its own go-ahead.
**Evidence:** every live provenance line reads *"specification version 23"*; live is 27. Rule 54 says
a stale stamp is itself a finding — so it is reported here rather than silently fixed.
**Affected:** all 168.
**Who closes it:** the QA lead (`PROPOSED-CHANGES.md` P2).
**Honest risk:** a reviewer opening any case is pointed at a spec body four versions old that predates
§5.3 entirely. **This is the single most visible thing in the suite and the easiest to be challenged
on.**

---

### 4 · A re-stamp would fix the spec version and leave the build marker untouched · **RISK: LOW**

**Plain answer:** we can honestly say which requirement version a case follows, but not that we
re-checked it against a build we never opened.
**Evidence:** Rule 12; Rule 54 state 2 requires the build **and the date it was tested**. The 168
currently name two builds — 90 at `v3.5-7ec992f`, 78 at `v3.5-d122eef`.
**Affected:** all 168, if P2 is approved.
**Who closes it:** whoever runs the next live pass.
**Honest risk:** the cases will carry a current spec version beside a 5-August build marker, which
looks inconsistent. It is not — it is accurate, and pretending otherwise is the worse option.

---

### 5 · The capacity-tooltip fix is HELD pending Branko, not applied · **RISK: MEDIUM**

**Plain answer:** the specification changed one word without a version comment, and we are asking
whether that was deliberate before we write it into a test.
**Evidence:** `per-assigned technician` first appears in v26 (2026-08-07T11:02:57Z); the wording it
replaced stood from v1 to v25. Rule 58 — an ambiguous source is never resolved by looking at the
build.
**Affected:** **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)**.
**Who closes it:** Branko — one row, `QUESTIONS-FOR-BRANKO.md` S-1.
**Honest risk:** if it was deliberate, our case passes a build showing every technician instead of
only the assigned ones, for as long as the question sits unanswered.

---

### 6 · We did not resolve the SV-8917 conflict-label question · **RISK: HIGH**

**Plain answer:** the ticket asks for the label to say "business hours", but the specification makes a
technician's own working hours take precedence over the shop's, so applying it literally would make
the label wrong for anyone with custom hours.
**Evidence:** §4.2 verbatim — *"1. The technician's configured working hours take precedence. 2. If
those are not set, the shop's business hours are used."*; §4.11 verbatim — *"Before hours — Shift
starts before the **working-day** start."* The specification never calls this conflict "business
hours".
**Affected:** **SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)** and
**SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)**.
**Who closes it:** Branko, or the QA lead ruling that the ticket is right and the spec follows.
**Honest risk:** **the ticket is TESTING QA, so the change may already be in the build.** If it is,
our two cases fail against it and we will be told our cases are stale. Our answer — that the fix is
wrong for a technician with custom hours — is sourced, but it is an argument, not a ruling. Already
raised as **B-2** of `build/handover-ingest-2026-08-10/QUESTIONS.md`; **not re-asked here, to avoid
sending Branko the same question twice**.

---

### 7 · The shop-closure contradiction is unresolved and the question has never been sent · **RISK: HIGH**

**Plain answer:** the specification says two opposite things about shop closures, our cases follow one
of them and say so, and the question that would settle it has been written since 6 August and is
still in our folder.
**Evidence:** §12 — *"…**block the spread step** from placing shifts on those days"*; §4.5 — *"Shop
closures and public holidays are **not skipped** in V1"*. Both present in v27.
**Affected:** **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)** and
**SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)**, both
`AUTOMATION: HOLD`.
**Who closes it:** us, by sending `build/filters/questions-2026-08-06/` — then Branko.
**Honest risk:** **the blocker is us, not Branko, and one of the two cases says so in its own
automation marker**: *"the question has not been sent yet"*. That is the most honest possible record
and also the least comfortable one to be asked about.

---

### 8 · Two §11 partials are recorded and deliberately not fixed · **RISK: LOW**

**Plain answer:** that shadows keep their depth in dark mode, and that the "+N more" overflow reads by
shape rather than colour, are closer to design-fidelity checks than behaviour, and the design-fidelity
pass that would own them has not happened.
**Evidence:** `§11-L303.A4` and `§11-L301.A6` in `COVERAGE-MAP.md`; the same reasoning the
2026-08-10 sweep applied to the Filters design-token items.
**Affected:** **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** and
**SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)**.
**Who closes it:** the QA lead, if he disagrees.
**Honest risk:** low. A reviewer could fairly say the accessibility half of §11 is only partly tested.

---

### 9 · The dark-theme persistence half IS proposed, unlike the other two · **RISK: LOW**

**Plain answer:** it is a real user-visible promise and the case already claims it in its references
without checking it.
**Evidence:** C38866's `refs` read `§11 (Dark theme - user-selectable Light / Dark,persisted per
user)` while its four steps never sign out and back in.
**Affected:** C38866.
**Who closes it:** the QA lead (`PROPOSED-CHANGES.md` P5).
**Honest risk:** none. This is a case asserting less than its own reference claims, which is the
clearest kind of finding to act on.

---

### 10 · 91 assertions are verdicted NOT-INDEPENDENTLY-TESTABLE · **RISK: MEDIUM**

**Plain answer:** they are table label cells, data-model definitions, lead-in sentences and
cross-references — the assertion each one belongs to is verdicted on its own row.
**Evidence:** the breakdown is in `COVERAGE-MAP.md` — 41 label cells, 21 data-model rows, 15 framing
lines, 10 cross-references, 4 goal statements. This spec states many requirements as a two-cell table
row; the label cell is verdicted here and **the assertion is verdicted on the description cell, which
appears in the COVERED count**.
**Affected:** none directly.
**Who closes it:** the QA lead, if he wants any of them reclassified.
**Honest risk:** **23% of the assertion count sits in this bucket, and a hostile reader will go
straight for it.** The defence is that every single one names the row it belongs to and every
description cell is verdicted separately — but it is the number to be ready for.

---

### 11 · The assertion splitter is mechanical, and where it is wrong the map says so · **RISK: MEDIUM**

**Plain answer:** we split 234 requirement lines into 397 assertions with a script, so some splits are
clumsy, and every assertion keeps its parent line's full text so any reader can check the split
itself.
**Evidence:** `tools/assertions.py`, with the two glue rules commented. e.g. `§5.3-L189.A3` reads only
*"grouping with the date controls."* — a fragment of the sentence before it, verdicted UNCOVERED with
its siblings, which is right, but it is not a standalone promise.
**Affected:** the 79 lines that carry more than one assertion.
**Who closes it:** anybody re-reading the map; the parent text is in every row of
`evidence/assertions-v27.json`.
**Honest risk:** a reviewer could argue the 397 is inflated. **The counter is that splitting is what
found G4, which is invisible at line level** — and that the previous pass's 224-line count reported
0 uncovered against a spec that now has an entirely uncovered section.

---

### 12 · We did not touch SV-8992, SV-9020, SV-8921, SV-9083 or any other ticket · **RISK: LOW**

**Plain answer:** we do not write in other people's tickets, and we do not create tickets at all
without being asked.
**Evidence:** Rule 38 (foreign work is hands-off) and Rule 62 (no Jira ticket without explicit
permission, asked and granted first).
**Affected:** none of our cases; two of the tickets are open PRD clarifications whose answers would
extend coverage (`GAPS.md`).
**Who closes it:** the QA lead.
**Honest risk:** none.

---

### 13 · Nothing was retired, and 27 cases that no assertion named were kept · **RISK: LOW**

**Plain answer:** the matcher names one best case per assertion, so a good case that is always second
is never named, and none of the 27 earned deletion.
**Evidence:** `ORPHANS.md` §5 groups all 27 — regression cases, API cases, second-best matches, and
cases that go beyond the spec.
**Affected:** the 27, all kept.
**Who closes it:** nobody.
**Honest risk:** none. `delete_case` is irreversible; this is the safe direction to be wrong in.

---

### 14 · The design is a PARTIAL source and we did not fetch it · **RISK: HIGH**

**Plain answer:** the three design-review tickets point at a live, editable design link with no
version and no date, and we cannot tell whether it is the same document we already hold.
**Evidence:** SV-8915/8916/8917 all cite
`claude.ai/design/p/d3cdcf5c-…?via=share`. Design became an authoritative source under Rule 57 as
amended, which makes an un-versioned link a bigger problem than it used to be, not a smaller one.
**Affected:** the ~48 Schedule labels pinned from the prototype artefact we hold.
**Who closes it:** Branko — already **Tab 2 Item 4.0** of the 6 August sheet, unsent.
**Honest risk:** **if the live design has moved, an unknown number of our pinned labels are wrong and
we would not know it.** This is the largest unquantified exposure in the project and it is not new.

---

### 15 · Not-V1 items are excluded from the gap count entirely · **RISK: LOW**

**Plain answer:** E1, E13, E14 and E16 are fast-follow by the review's own words, so a requirement
covering one of them is not a coverage gap of ours.
**Evidence:** the review's scope column, verbatim — *"Out of Scope / Done in foundermode FS"*,
*"Will be done in Foundermode FS"*, *"Fast-follow, not part of this v1 release"*. `GAPS.md` Class C.
**Affected:** none.
**Who closes it:** the QA lead, if V1 scope changes.
**Honest risk:** low, and the watch list is the mitigation — the moment Branko writes any of them into
the spec they become Class A.

---

### 16 · No deliverable was regenerated · **RISK: LOW**

**Plain answer:** nothing about the case source changed, so there was nothing to regenerate, and
running the generator would have done damage for no gain.
**Evidence:** `gen_import.py` blanks the id-map C-ids and drops the `refs` column on every rerun — a
recorded gotcha. All four counts already reconcile: live 168 / local active 168 / id-map 168 /
Direction-2 examined 168, set-equal both ways.
**Affected:** none.
**Who closes it:** whoever runs the next pass that actually changes a case.
**Honest risk:** none.
