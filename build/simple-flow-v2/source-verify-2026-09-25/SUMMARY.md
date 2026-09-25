# Simple Flow V2 — source read of 25 September 2026, and what it settled

**One gated read this pass (Rule 81, his go-ahead given in conversation), then every case checked
against that single read (Rule 106, 2026-09-15 extension). No per-case fetches, nothing from memory.**

Source: Confluence **771391574**, *Simple Flow V2*, **version 26**, last changed **11 September 2026**.
Text as read: `spec-v26-as-read-2026-09-25.txt` (679 lines). Instrument: `reconcile_all.py`.

## 1. What it settled — C44565 is a real defect

The source, under **SV-9251 Story 5 → Negative cases**, verbatim:

> **A Technician in Tech View cannot complete, because they cannot approve. They can still pick parts**

and in the same story's Prerequisite, *"Tech View hides Approve"*, and under permissions,
*"A Technician carries it even though they cannot complete a line"*.

Our case quotes this faithfully. **The build does not do it** — on the proven-default Technician role,
in the technician's own view, a line was completed. Positive control on the same line: the admin sees
*Approve/Decline*, the technician sees nothing and the word *Approve* is absent from their page, which
is the source's own test for that view. Full reconciliation: `C44565-TECHNICIAN.md`.

**Case agrees + build differs ⇒ real defect.** The Expected is untouched (Rule 114).

## 2. What it settled for the rest of the suite — no false passes on this axis

Every sentence each of the 64 cases asserts was checked against the source as it reads today.

| | |
|---|---|
| Cases whose every asserted sentence traces to the source | **61** |
| Cases carrying a sentence the source does not state | **3** |
| Cases whose Expected **contradicts** the source | **none** |

The three are **not divergences in substance** — they state a source requirement in technical terms
the source does not use, so the checks are sound and the wording is ours to tidy:

| | Ours | The source's own words |
|---|---|---|
| C44604 (Passed) | *"reflected in the invoice and the PDF order"* | *"that order is what the invoice prints"* |
| C44605 (Blocked) | *"rejected with 409"* | *"Reordering on an invoiced work order is refused"* |
| C44587 (Blocked) | *"read back over the API equals the purchase order's cost"* | the source does not describe a stored-value check |

**This is the check that prevents a false pass** — a case whose Expected disagrees with the source, and
whose build matches the case, passes and is believed for ever. None of ours is in that position.

## 3. What it raised — the suite is two versions behind on paper

Our cases' provenance says *"revised 8 September 2026"*, which is **version 24** (*"QA handoff folded
in: Stories 1-5, 7, 13-15, 17, 18"*). The page has moved twice since, both without a note:

| Version | Changed |
|---|---|
| 24 | 8 September 2026 — what our cases cite |
| 25 | 9 September 2026 |
| **26** | **11 September 2026 — live today** |

**Nothing in those two revisions contradicts any of our 64 cases** — that is what section 2 measured,
against version 26, not against the version we cite. So the risk here is bookkeeping, not correctness:
**the provenance line is stale and needs re-stamping on every case in the suite (Rule 54)**, which is a
suite-wide write and is raised rather than done inside this execution pass.

## 4. The instrument, and its first run — recorded because it nearly misled me

The first run flagged **40 of 64**, which was the instrument and not the cases: it scored the
provenance, divergence and ruling lines (which are *about* the source, not claims the case makes), and
it judged by sentence similarity alone, so a case that faithfully expands one source sentence into
plain tester language looked like a paraphrase. Fixed by excluding those lines and adding a
**content-vocabulary** test beside the similarity one. **A 40-of-64 figure would have been reported as
a finding if it had not been obviously wrong — a bad instrument produces confident numbers.**
