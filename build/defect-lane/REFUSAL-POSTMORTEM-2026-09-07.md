# REFUSAL POST-MORTEM — 2026-09-07

**Lane:** test-execution-and-defects · **Scope:** refused/withdrawn defect tickets on epic **SV-8218
(Invoice UI Refresh)** · **Method:** every refusal reason below is **QUOTED VERBATIM from the Jira
comment that closed the ticket**. Nothing here is reconstructed or inferred (Rule 12).

## Population and how it was found

`parent = SV-8218` returned 31 children. Two are Bugs closed **OBSOLETE**; both are ours in the sense
that they were raised from our testing of this epic. No other refused/withdrawn defect exists on this
epic. Five further "Spec gap" Tasks are **Done** (accepted, not refused) and are treated below as the
*accepted* pattern to copy.

| Ticket | Status | Stated refusal reason (VERBATIM, who + when) | The TRUE root cause | The admissibility check that would have caught it |
|---|---|---|---|---|
| [SV-9692](https://shopview.atlassian.net/browse/SV-9692) — *"Build defect - job title renders at 14px, spec and design both require 16px"* | **OBSOLETE** (resolution Done) | **Chris Ward, 2026-09-03 11:20:** *"Correcting this ticket, and it should be closed in favour of SV-9694. I raised it saying the title renders at 14px. **That figure came from an older local copy of the template.** On the branch the QA environment actually runs, the title is 12px, not 14px. It is also not an isolated drift. Every size in that stylesheet is written at exactly three quarters of spec... The job title is one instance of a whole-stylesheet scaling. SV-9694 now carries the root cause and the full list, so this one is redundant. Closing as obsolete."* | **TWO faults, compounding.** (1) The "actual" value was read from a **stale local copy of the template**, not from the running branch — so the headline number in the ticket (14px) was simply **wrong** (real value 12px). (2) A **single symptom** was filed where a **whole-stylesheet 0.75 rescale** was the real defect, so the ticket was superseded by the root-cause ticket SV-9694. | **A6 (not environment) + A1 (reproduce on the CURRENT build, marker proved).** "Actual" must be observed on the running environment, never read out of a local file or a code read. **Plus A4 extended:** before filing an instance, look for the general pattern — a symptom ticket is superseded the moment someone finds the root cause. |
| [SV-9695](https://shopview.atlassian.net/browse/SV-9695) — *"Build defect - line description renders below the job name, design requires it inline beside the name"* | **OBSOLETE** (resolution Done) | **Chris Ward, 2026-09-03 11:21:** *"Withdrawing this. I raised it in error and it should be closed. I said the build renders the line description on its own line below the job name. **That came from an older local copy of the template.** On the branch the QA environment actually runs, the description is already rendered inline immediately after the job name, in the same row, in smaller muted text - which is exactly what the Design Document requires. So there is nothing to fix here. Closing as obsolete. The one thing that IS off is its size: it renders at 9px where the design specifies 12px. That is the same whole-stylesheet 0.75 scaling tracked on SV-9694, not a separate problem."* | **The reported behaviour never existed on the running build.** The defect was **entirely an artefact of reading a stale local template**. The build already did the right thing. The only real residue (9px vs 12px) belonged to the existing SV-9694. | **A6 + A1**, exactly as above — and it would have killed the ticket outright rather than merely re-scoping it. |

## THE HEADLINE FINDING — one root cause, both refusals

> **Both refused tickets on this epic were refused for the SAME reason: the "actual behaviour" was
> taken from an OLDER LOCAL COPY OF THE TEMPLATE instead of from the environment the reader would
> actually open.** Neither was a wording problem, neither was a sourcing problem — the *expected* side
> was correctly quoted from spec + Design Document in both. **The defect was in how "actual" was
> established.**

That is a narrower and more fixable failure than "our tickets are bad", and it maps to one rule we
already have: **Rule 12 — verified means OBSERVED, never inferred.** A code read is an inference.

## What we should have done with each finding instead

| Ticket | What should have happened |
|---|---|
| SV-9692 | Measure the **running** document (PDF text extraction on a real download from the branch), notice all four sizes land at exactly 0.75x, and file **one root-cause ticket** — which is precisely what SV-9694 became. The instance ticket should never have existed. |
| SV-9695 | Open the actual document on the branch first. The finding evaporates — **nothing to file at all.** The 9px residue folds into SV-9694. |

## The accepted pattern, for contrast (5 tickets, all Done, none refused)

**SV-9684 · SV-9685 · SV-9686 · SV-9687 · SV-9689** are all typed **Task** and titled **"Spec gap — ..."**.
Where the *spec does not define* the behaviour, this project files a **spec-gap Task**, not a Bug — and
those all landed. **A defect ticket is for the build diverging from an agreed value; a spec-gap Task is
for the value not being agreed.** Choosing the wrong one of these two is itself a refusal risk (A2/A5:
no quotable current source -> it is a question, not a defect).

## PROPOSED additional gate checks (Rules 72/93 — PROPOSED ONLY, not self-recorded)

**I have not added these to `06-DEFECT-PREP.md` or to any rule file. They are for the QA lead to rule on.**

| # | Proposed check | Why the post-mortem supports it |
|---|---|---|
| **P1** | **A6a — "ACTUAL" IS OBSERVED ON THE RUNNING ENVIRONMENT, NEVER READ FROM SOURCE.** State the URL/branch and the build marker the observation came from, and name the artefact opened (a downloaded PDF, a rendered page). **A value taken from a repository file, a template, a stylesheet or a code read may NEVER be reported as the build's actual behaviour** — it may only motivate going and looking. | This single check would have prevented **both** refusals on this epic. Neither had any other fault. |
| **P2** | **A4a — BEFORE FILING AN INSTANCE, LOOK FOR THE PATTERN.** Where a finding is one measurable value, test at least two or three sibling values of the same kind. If they all deviate by the same factor/shape, file **one root-cause ticket** naming the pattern, not the instance. | SV-9692 was refused specifically as an instance of a whole-stylesheet scaling that SV-9694 then owned. |
| **P3** | **A5a — DEFECT vs SPEC-GAP ROUTING.** Before filing, ask which of two things is true: the build diverges from an **agreed, quotable, CURRENT** value (-> Story Defect), or the value is **not agreed** (-> a "Spec gap" Task). Record which and why. | This epic's five accepted tickets are all spec-gap **Tasks**; its two refused ones are **Bugs**. The routing is doing real work here. |

## Live-context note that changes the odds this pass (recorded 2026-09-07, evidence in the tickets)

- **SV-9694** (*"Document text renders at 75% of the sizes S12-R9 specifies"*) is a **Story Defect
  parented to SV-9151 (Story 12)**, status **Ready for QA** — the rescale has been **reverted**
  (`.shop-meta` 12.5px, `.doc-dates` 11.5px, `.shop-name` 18px re-measured out of a real PDF).
  **Consequence: any font-size / type-scale finding on this document is almost certainly A4-duplicate
  of SV-9694 and must NOT be filed as new.**
- **The spec has moved past the version our cases cite.** Chris Ward, SV-9694, 2026-09-04: *"Written
  into the spec so it cannot be read two ways again... **Live page v49**."* and a later reference to
  **S12-R4 v52**. **All 120 cases in the suite cite specification version 45.** Under **A2** an
  expectation quoted from v45 is not safe to file on until it is re-derived from the current version —
  this is the exact shape of the *"obsolete"* refusal.
- Open, still-unruled questions recorded on SV-9694 that overlap our cases: whether `.doc-label` is
  **18px or 24px**; whether the **375px phone preview at ~7.2px** passes; and **what QA should do when
  a PDF's line breaks differ from the Design Document** (the design sheet has ~876px of content, A4 has
  634px, so wrapping provably differs). **Findings that turn on these are HELD as questions, not filed
  (Rule 58).**
