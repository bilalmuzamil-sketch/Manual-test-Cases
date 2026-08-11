# Schedule — FINDINGS from the staged push — 2026-08-11

Everything the pass found that it did **not** fix, plus the judgement calls it made and the two
places where the brief or the staged pack turned out to be slightly wrong. Recorded here rather than
absorbed silently, because a corrected claim that leaves no trace is how the same mistake gets
re-derived (Rules 46 / 50).

---

## A · The brief undercounted our own defect by one: it was SIX cases, not five

The brief said *"Five of them do not have eight steps"*. **All six are wrong.** C43582 — the case the
sentence was copied FROM — has **eight expected results and seven steps**, so it was never right
either. The counts, re-counted from live text, are **7 · 6 · 7 · 4 · 5 · 7**.

**Nothing was taken on trust here and that is the point of re-counting:** had the brief's "five" been
followed, C43582 would have been skipped and the case that started the whole defect would have kept
it. All six were corrected.

**Sweep, so this is a measurement and not a spot-check (Rule 50):** all 176 live cases were searched
for any *"steps N to M"* reference. **Eight exist, and after this pass 0 overshoot the case's real
step count.** Two of the eight are legitimate partial references inside a case (C43584's steps and
C43587's preconditions) and are correct. **Zero cases still contain the string "steps 1 to 8".**

---

## B · OWED, NOT DONE — C38866's own provenance line still names the epic, not SV-8700

**[C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** now carries `refs` naming
**SV-8700** (proven live: requirement 5 states the requirement almost verbatim and cites §11 itself).
**Its tester-facing Rule-54 provenance line still reads *"as per epic SV-8685 … and the Schedule
specification version 27 (§11)"*.**

**This pass deliberately did not touch it** — the brief scoped Group 4 to `refs` only, and the
provenance line lives in `custom_expected`, the field holding the case's assertions. Changing it is a
one-line edit but it is a write to an assertion-bearing field and belongs to its own authorised pass.

**The consequence, stated plainly: the metadata layer and the tester-facing layer now disagree about
which ticket owns this case.** Neither is wrong about the requirement, but Rule 20's per-story
precision is satisfied in `refs` and not in the sentence the tester reads. **Recommend it be folded
into the next authorised Schedule write, alongside item C.**

---

## C · REPORTED, NOT ACTED ON — C38866's third assertion is not a dark-theme assertion at all

C38866's expected item 3 — *"Conflict and overtime cues remain distinguishable (they never rely on
colour alone - text/icon still present)"* — is a **§11 accessibility** assertion, not a dark-theme
one. It is why the new `refs` names **SV-8698** as well as SV-8700: the suite already credits SV-8698
with *"not color-only"* on **[C30032](https://shopview.testrail.io/index.php?/cases/view/30032)**.

**So C38866 asserts, in passing, something C30032 asserts as its whole subject.** That is a
**MERGE-or-narrow candidate for a Ruthless Usefulness Audit (Rule 28)**, not a defect, and it is
**not ours to decide unasked**. The honest reading is that C38866 would be tighter if item 3 were
dropped — it dilutes a dark-theme case with a requirement owned elsewhere — but removing an assertion
is a coverage decision and needs the QA lead.

---

## D · A SCOPE OBSERVATION on C29998, deliberately not expanded

§4.7 of spec v27 says two things beyond what C29998 covers, both read verbatim this pass:

1. *"This applies in **day, week, and month views** (week and month reach the overflow much sooner
   because cells are narrower)."* — **C29998 tests day view only** (its precondition pins day view).
2. *"Overlap on the same technician **is a conflict (see §4.11) and is flagged**, so stacking reads as
   'resolve me,' not 'two normal jobs.'"* — **C29998 asserts nothing about the conflict flag.**

**Neither is necessarily a gap** — the SCH-LANE and SCH-CONF families may well cover both, and the
2026-08-11 re-derivation verdicted §4.7's assertions individually. **This pass did not re-open that
map** (it was chartered to write, not to re-derive), so the honest statement is: **these two
assertions were not checked by this pass and are flagged for the next coverage re-derivation**, which
is exactly where a per-assertion verdict belongs (Rules 43 / 45(e)).

**Expanding C29998's scope was NOT done and should not be done casually:** its expensive precondition
is five mutually overlapping shifts on one technician, and bolting a month-view and a conflict-flag
assertion onto it would make one case carry four subjects.

---

## E · A RECORDED DECISION — C29998's build stamp now predates one of its own items

C29998 keeps sentence 2 verbatim: *"Last checked against build v3.5-7ec992f on 8/6/2026."*

**That remains TRUE of the case as a whole** — it is a neutral record of the last time the case was
checked against a build, which is exactly what Rule 54 sentence 2 is for. **But the new expected item
4 has never been checked against any build**, so the stamp is older than part of the case it sits on.

**Three options were considered and the middle one taken:** re-stamping with today's date would
assert a check nobody made (Rule 12 — barred outright); adding a tester-facing caveat would put new
prose into a case the brief scoped to one item; **leaving the true stamp and recording the nuance
here** keeps every sentence on the case true. **The tester is unaffected either way** — the marker is
`AUTOMATION: READY` and under Rule 61 as amended today they run it and record what they find.

**The same is true, more simply, of the two new cases: they carry NO sentence 2 at all**, because no
build was observed.

---

## F · SYSTEMIC — the local case source was stale on 174 of 176 expected fields before this pass

Re-syncing local from live before regenerating pulled in **174 `expected` fields, 1 `title`, 1
`steps` and 3 `refs`** that live TestRail had and the repository did not. Two earlier passes wrote to
live without syncing back:

* the **read-date sweep** of 2026-08-11, which added a read-date per source to all 174 provenance
  lines;
* the **C30041 latest-wins pass** of 2026-08-11, which retitled **SCH-TOOL-03 =
  [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** from *"Toolbar search
  highlights matching blocks and fades non-matching ones"* to *"Toolbar search matches customer, work
  order, unit, technician and line names"* and rewrote its steps and `refs`.

**Both are legitimate work; the gap is the sync step.** Had this pass regenerated the import without
re-syncing, it would have shipped **176 rows of stale text** — every provenance line missing its
read-dates and C30041 under its old title — and the four counts would still have reconciled at 176,
because **counts cannot detect stale content**.

**The recommendation is narrow and cheap: make "re-sync local FROM live" the first step of the
deliverable regeneration, not an optional courtesy.** The reusable script already exists
(`build/schedule/panel-collapse-2026-08-11/tools/resync_local_from_live.py`); this pass ran its own
copy of it against a POST snapshot.

---

## G · A LIVE HAZARD IN THE SHARED BRAIN, reported not edited — the playbook still tells a reader to send `custom_atmstatus: 3`

**`build/APP-ACTIONS-PLAYBOOK.md` §J still contains:** *"**`add_case` REQUIRES `custom_atmstatus:3` +
`custom_automation_type:0`** (non-API cases)."*

**That is the exact instruction that made every API-created case in this workspace claim to be
automated**, and it is **contradicted by CLAUDE.md's "Durable key facts → TestRail"**, which now says
`1` and explains why (`3` is Vlad's flag; `is_required` is true but `default_value` is `"1"`; the 31
Schedule cases were corrected `3 → 1` on 2026-08-11).

**Not edited, for two reasons, and both are worth stating:** the brief authorised **one** additive
playbook note, and **the playbook is being edited by a sibling worker right now** (76 uncommitted
insertions were in the working tree when this pass read it). **The hazard is currently contained** —
CLAUDE.md is authoritative and carries the correction, the canonical helper
`build/testing-tools/testrail_add_case.py` **raises** on `3`, and the guard
`check_add_case_payloads.py` fails any new payload carrying it.
**Recommended follow-up: a dated additive correction under that bullet, keeping the superseded
wording visible (the Rules 31/52/53 pattern) rather than deleting it.**

---

## H · Guard output worth passing on — three verifier scripts would call a correct case a failure

`check_add_case_payloads.py` **exited 0** (PASS, 0 new hazards, 852 files scanned), but warned that
three scripts treat `custom_atmstatus == 3` as a PASS condition:

* `build/filters/read-dates-2026-08-11/tools/snap.py:75`
* `build/schedule/read-dates-2026-08-11/tools/final_verify.py:36`
* `build/schedule/read-dates-2026-08-11/tools/snap.py:11`

**Both `read-dates-2026-08-11` directories belong to a pass that is live right now**, so they were
**not touched** (another worker's in-flight files). They are diagnostics rather than gates, so the
practical risk is a confusing print, not a bad write — but a future pass that reuses one of them as a
verifier would report a correctly-created case as broken. **Flagged for their owner.**

---

## I · OUTSTANDING — what is needed from the QA lead

1. **Authorisation to sync run 357 from 174 to 176 tests.** The two new cases exist but sit outside
   the run Ayesha executes, because that run is a fixed selection and never picks up new cases. The
   full 176-id union, the snapshots and the exact call are staged in `STAGED-RUN-357-SYNC.md`.
   **Nothing was written to the run.** **Since when:** today, from the moment C43588/C43589 were
   created.
2. **Authorisation for one more small Schedule write** covering item **B** (C38866's provenance line
   → SV-8700) and, if he wants it, item **C** (whether C38866 keeps its accessibility assertion or
   leaves it to C30032). Both are one-line changes; neither is urgent; both are visible to a
   reviewer.
3. **A decision on item G** — whether to correct the playbook's `add_case` bullet, and whether that
   is ours to do while a sibling is editing the file.
4. **Nothing else is blocked.** The two new cases, the six corrections and the two reference fixes
   are all live and byte-verified; the spec was current at v27 at both ends of the write window; the
   Jira creation hold was honoured with zero creating calls.

**And the standing caveat this pass could not remove: nothing here was verified against the running
build.** No build was observed, deliberately — `quick-login` and `switch-user` rotate the shared
session and two siblings are live on this estate. So the ten cases are **source-accurate and
tester-runnable, not build-verified**, which is the same position as the other 174 on the branch that
were last checked against builds now superseded. Under Rule 60 that touches the labels and the
pass/fail verdict, never the expectation — the expectations come from spec v27 and story SV-8700, both
read live today.
