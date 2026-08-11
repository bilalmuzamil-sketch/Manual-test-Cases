# Two QA-lead rulings recorded — 2026-08-11

Both arrived today. Both are encoded in `CLAUDE.md`. Neither is retroactive of its own force;
each creates work that is recorded as **outstanding**, not quietly claimed as done.

---

## 1 · Standing Rule 54 — every cited source also carries the date we read it

**His words, verbatim:**

> *"Do with the cases/or update them as per the logic, if anyone sees those test cases they will bite
> me saying that it is not coming from specs/tickets/answer sheet/Claud design/Figma or anything which
> the PO confirmed. I want nothing to bite me like that. And every expected behavior as I mentioned
> before should have a reference in the test cases in the same format as you are keeping that must
> tell the Manual QA guy or anyone who is auditing those test cases that these are the sources of the
> expected behavior, make sure to mention the date of the source when that source of truth was taken
> from each source, so that in future if someone changes the source of truth I can guard myself
> telling that the refrence taken from the source of truth was from the state of that source which was
> at this certain date."*

**What the amendment says.** Sentence 1 of the provenance line now carries **the date we read each
source**. A version number says what the source was *called*; the read-date says **when we looked**.
That is the whole point — it is **evidentiary**, so that when a source later moves he can show the
reference was taken from it **as it stood on a stated date**.

**The example format:**

> This is the expected behaviour as per epic SV-8685 and the Schedule specification version 27,
> section 5.3, read on 11 August 2026.

**Four things pinned down, because each is a way the rule could be eroded:**

| Clause | Why it is there |
|---|---|
| **One date per source** — a spec and a PO answer each carry their own | they are read at different times and move independently, so one shared date misstates at least one |
| **Sentence 2 unchanged** — *"Last checked against build … on …"* | the build is still never a source (Rule 57); the read-date does **not** attach to it, and merging the two is the error this rule spent 2026-08-05 undoing |
| **The date is when WE READ it, not today's date** | back-filling a read-date onto a source nobody re-read is a **fabricated observation** (Rule 12) and destroys the only thing the date is for — a date nobody stood behind protects nobody |
| **Additive** | the two-sentence form, the ordering, the marker placement and every honesty clause are untouched |

**Cross-referenced to** Rule 20 (`refs` is the metadata twin), Rule 31 (source currency made visible
on the case — and its trap (c) still applies: a read-date proves when we looked, never how old the
requirement is), Rule 42 (a version-pinned anchor; the read-date pins when the pin was taken),
Rule 56 (divergence disclosures carry their own dates) and Rule 57 (it applies to every kind of
source on that list — spec, story, PO answer, design, Figma, shared `.md`, written statement).

**The honest consequence, recorded not glossed: existing cases do not carry read-dates.** Only the two
cases below do. A sweep is owed across all projects and **is not done** — register row **D1**.

---

## 2 · Standing Rule 61 — an expect-fail marker needs live backing

**His words, verbatim:**

> *"WHen there is nothing to back 'Expect fail' then not set that marker. And let the manual QA tester
> simply discover whether this test fails or passes and mark the test case accordingly in the tesrail"*

**The precondition added:** `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` may be set **only where a live
source backs it** — an open ticket describing the failure, or an equivalent documented basis.
**No backing, no marker.** Where the backing is absent, stale or was never established, the marker
comes off, the case carries plain `AUTOMATION: READY`, and the tester **discovers** the outcome.
**We do not predict on the tester's behalf.**

**A closed or obsolete ticket does not back the marker** — concretely, **31 of the 33 tickets behind
the Report Suite's expect-fail cases are closed**, several confirmed fixed on 10 August, so those
markers tell a tester to ignore a failure that may no longer exist.

**What did not change:** the three-outcome instruction stays for markers that *are* properly backed.
Only the **precondition for setting one** is new.

**Not a licence to guess the other way** (Rules 12 + 57): an unbacked expect-fail asserts a build fact
nobody observed, and a marker written from what the build happens to do is build-derived expectation
through a side door. **Removing an unbacked marker restores the case's ability to fail.**

**Worked example recorded in the rule, and it cuts against our own recent work:** the six Schedule
Panel collapse cases **C43582–C43587** carry `AUTOMATION: HOLD - the panel collapse control is not in
the build`. That is wrong on both counts — the absence is perfectly observable, so it is not a genuine
`HOLD`, and no ticket backs an expect-fail either. They should carry plain `AUTOMATION: READY`.
**They were not written by this pass** — a separate pass is taking the whole expect-fail population.

---

## 3 · Standing Rule 63 — the practice was explicitly endorsed

He confirmed the creation hold stands and added, verbatim: ***"Good catch, be like this always."***
Recorded in Rule 63's rationale: checking before acting is not merely permitted, it is the behaviour
he has asked for by name. The cost of a needless check is one sentence; the cost of a silent
assumption is a ticket he never approved.
