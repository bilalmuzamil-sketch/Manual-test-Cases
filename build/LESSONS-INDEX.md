# LESSONS INDEX — every correction, what it cost, and where the fix is written

**READ THIS AT SESSION START, and before any pass that will produce a public deliverable.**
It is the retrieval layer for everything we have learned the hard way. One row per correction:
*what went wrong* → *what we do now* → *where the durable rule or recipe lives*.

**It is maintained AUTOMATICALLY (Standing Rule 82), not on request.** The moment a mistake is found —
by the QA lead, by a reviewer, by another author's case, or by our own re-check — the row is added in the
SAME turn, along with the rule or recipe it produces. A correction that is not written down here will be
made again, by us or by the other session.

**How to use it:** scan the "What went wrong" column for the shape of the problem in front of you, not
for the feature name. The mistakes repeat across projects wearing different nouns — a false "missing
label", a false "regression", a false "verified" — and the row that saves you is usually about a
different feature entirely.

---

## The corrections, newest first

| Date | What went wrong | What we do now | Where it lives |
|---|---|---|---|
| 2026-09-12 | Verified 17 evidence images by curling the source for HTTP 200; the reader saw broken images in Jira anyway. The check measured the wrong end of the pipe. | Embed evidence as **real platform-owned attachments** and verify by **reading the posted artefact back**, checking count, order and aspect. | Rule **81**, playbook **§V.0** |
| 2026-09-12 | Reported a layout difference with no viewing parameters; the QA lead saw one line where the PDF showed two, and both of us were right. | Every rendering finding names **screen resolution · browser zoom · page size · viewport**, reconciles screen vs print with a number, and is explained by a **validated predictor**. | Rule **80**, playbook **§AC.7** |
| 2026-09-12 | Read page 1 of a 6-page invoice and wrote "labour-only" into a findings doc — the summary on the last page said otherwise. Compared 70 geometry measurements without ever checking the headers said the same **words**. Then reported 3 labels "missing" that were all present. | Read **every page** before characterising; run the **vocabulary axis** as well as geometry, in both directions, against a **skeleton/empty** document; treat any "missing" as a **bug in your own checker** until re-derived a second way. | Rule **79**, playbook **§AC.6** |
| 2026-09-10 | Passed SV-9857 on its symptom without noticing the build shipped **Option A** while the ticket recommended **Option B**. The PO had ruled — but I passed it without knowing that. | A ticket that asks a question is not testable by symptom: **identify which option shipped, find the ruling in a source, and say so out loud in the comment**. | Rule **78** |
| 2026-09-10 | Called a cross-environment difference a **regression**; it was two settings toggles switched off on the branch. A false regression reversed a correct PASS. | Explain any environment difference **configuration first** — setting/toggle/flag/permission → data → **code last**; read the whole settings object on both and **match them** before comparing. Uniformity across a whole class is the fingerprint of a toggle. | Rule **75**, playbook **§AC.5** |
| 2026-09-10 | Verified all 11 declared CSS changes and passed the ticket — while the same build had silently removed 50 Labor and 45 Parts figures from the line footers. | A fix is a **diff, not a change list**: verify the declared changes **and** diff the whole output against the pre-fix build, accounting for **every** difference. Never explain one away as "data drift" without proving it. | Rule **74** |
| 2026-09-10 | Posted QA comments with **after-only** evidence; a non-technical executive could see the tests passed but not what had been broken. | Every QA comment on a fix carries a **BEFORE vs AFTER** exhibit — and the **before is captured FIRST**, while the pre-fix environment is still reachable. | Rules **73**, **77**, playbook **§AD** |
| 2026-09-04 | Follow-up tickets a PO could not reproduce: steps naming no exact data, controls hidden inside collapsed containers, no quick way in. | A follow-up ticket is written for a **non-technical PO**: tight description, steps runnable **on the named QA branch**, exact row/control named, seeded data left in place, annotated screenshots, plus a **one-click "fastest way to reproduce"** line. | Rules **67**, **69**, **70**, **71** |
| 2026-08-26 | Expensive passes: 344 JS chunks downloaded to grep them, a 58 KB file read in one call (26k tokens), raw JSON printed instead of verdicts. | **Be cheap by default** — let the ticket choose the harness (API defect = no browser), cheapest decisive check first, scripts print verdicts not data, never bulk-download to search. Cheapness is skipping **redundant reads**, never a check. | Rule **63** |
| 2026-08-20 | Put a "branch not final, verdicts provisional" caveat on a per-ticket branch we had just **passed**. | On a per-ticket QA branch, **our PASS is the finality signal**; only a FAIL sends it back and re-opens Rule 49. | Rule **62** |
| 2026-08-10 | Silently built a parts work order neither ticket asked for; it hit five backend guards and produced **no verdict**, while the labour-only shape the ticket specified had already proven the bug. | When the asked-for setup diverges from what the document requires, **say so in one sentence and ask** — then do whatever the answer is. | Rule **61** |
| 2026-08-05 | Treated **build behaviour as expected behaviour** — five Filters cases rewritten into "accepted behaviour" because tickets had been *closed*. A test that cannot fail is not a test. | Expected behaviour comes from **spec / stories / PO answers only**. From the build take **labels and the verdict**, nothing else. A closed ticket is a triage decision, never a spec change. An **ambiguous source is never resolved by looking at the build**. | Rules **57**, **58**, **25**, **54** (amended) |
| 2026-08-05 | A readiness report stated a blocking ticket was open with zero comments; the PO had answered and closed it hours earlier. Specs moved **mid-pass**, flipping the exact anchors a repair pass had cited. | Re-read the sources **immediately before the writes begin**, not only at pass start, and record **both timestamps** in the log. | Rule **59** |
| 2026-08-04 | "Restored" four ticket priorities the QA lead had deliberately downgraded, producing a High→Low→High→Low round trip in the changelog. | Never reverse a field that changed without an action of ours — he works under the same account, so **his edits look like ours**. Ask, never restore. | Rule **53** |
| 2026-08-04 | Filed an API-only defect inside an approved batch of six. | **Never file an API-related ticket without asking** — a batch approval does not cover the API item. Judge by **reachability from the product**, not by whether the evidence is an endpoint capture. | Rule **51** |
| 2026-08-04 | Certified a whole suite off a spot-check (25 of 895 requirements, 24 of 475 cases) and reported a partial extraction as "partial" rather than unfinished. | **Exhaustive AND exact**: every case, every field, every requirement, both directions — and every write byte-verified with untouched fields proven identical. | Rule **50** |
| 2026-08-03 | Findings taken from a QA branch engineering had declared **not final** would have been stamped as settled truth. | Record the **build marker**, open a dated **RECHECK-QUEUE**, stamp provenance, and never claim completeness while the queue is open. Branches that are never declared final are worked with, not waited on. | Rules **49**, **60** |
| 2026-07-31 | An automation engineer's case — carrying **no `refs`** — was right where two of ours were wrong, exposing a four-report export gap our own spec diff had detected and then dropped. | A contradicting case is a **bug report against our suite** until re-derived; trace requirements across **every surface**; give **every requirement its own coverage verdict**; run the **outside-in gap hunt**; ship the **deliberate-decisions register**. | Rules **40**–**46**, `build/gap-rootcause-2026-07-31/` |
| 2026-07-31 | Told the QA lead work was "frozen by your own ruling" without naming the ruling, its date or the cases. | A blocked item quotes **which ruling, when, what it blocks, why it was right, and what unblocks it**. A ruling is a source, and sources get cited. | Rule **48** |
| 2026-07-31 | A reviewer reported coverage gaps that did not exist — his run held a frozen case selection. | Keep the active projects' runs **complete**, union-only, snapshot before writing. Coverage is measured against the **case suite**, never someone else's run. | Rules **34**, **47** |
| 2026-07-31 | Worked from a Filters spec **8 versions** stale and a Schedule spec **5** stale; a PO answer had already reversed a ruling our cases still asserted. | **Establish the currency of ALL sources before doing anything** — and beware the traps: a Confluence body "Version" lies, a Jira "updated" date moves for admin edits. | Rule **31** |
| 2026-07-28 | An engineering manager claimed 70%+ of our cases were "AI slop" and that some "just do not make sense". | Every authoring pass ends with the **three-dimension Ruthless Usefulness Audit** over 100% of the suite, shipped with its tally. | Rule **28** |
| 2026-07-27 | Re-discovered known actions (how to add a part to a work order) from scratch, extending a pass. | **Reuse recorded recipes**; append any newly proven one the instant it works. The books are the shared brain. | Rule **27**, playbook |
| 2026-07-23 | Delivered change lists off documented findings with no fresh live check. | **Ask about the live-build check and the access up front**, for every process; label anything not live-verified. | Rule **22** |
| 2026-07-23 | Ran permission tests against roles another session had drifted. | **Reset roles to template first**, record the before/after diff as a finding, re-reset on mid-run drift. | Rule **26** |
| 2026-07-22 | Reduced `refs` to the ticket key alone, dropping the spec anchor. | `refs` always carries **ticket + spec anchor**, per story, never epic-level guesswork. | Rule **20** |
| 2026-07-16 | Rendered 8 of ~26 Figma frames and reported a design capture as done; produced a TestRail import in a bespoke layout; annotated 297 cells from a stale prose extract, 64 of them wrong. | **Complete data in, complete data out**; **mirror the established format 1:1**; build a **verbatim truth table** and run an adversarial self-audit before delivering. | Rules **17**, **16**, **15** |
| 2026-07-14 | Presented FE-gated capabilities as verified results when they were inferred from role definitions — and the session had expired mid-run. | **Verified means observed, with evidence captured that run.** Anything else is labelled NOT VERIFIED, or the run stops and asks for access. | Rule **12** |

---

## Where the long-form lessons live

- `build/LESSONS-2026-07-31.md` — the spec-delta / coverage lessons behind Rules 40–44.
- `build/LESSONS-2026-08-19.md` — 11 lessons on producing public comments and annotated evidence.
- `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md` — the five-whys that produced Rules 45/46.
- `build/APP-ACTIONS-PLAYBOOK.md` — the **recipes** half: §U.0 pre-action check · §U.0b harness traps ·
  §V evidence and Jira comments (**§V.0 first**) · §W navigation map · §AC printed documents
  (**§AC.5** settings-first, **§AC.6** two-axis comparison, **§AC.7** proving two builds print one
  template) · §AD the before/after exhibit.
- `CLAUDE.md` Standing Rules — the **rules** half. Every rule carries its own rationale, which is the
  story of the mistake that produced it.

## The shape of the mistakes, in four lines

Read these before trusting any verdict you are about to give:

1. **A green check on a proxy for the real condition** — curling a URL instead of reading the post; a
   spot-check reported as a suite; "we didn't touch it" without a byte-identical snapshot.
2. **An inference wearing the clothes of an observation** — "data drift", "probably a regression",
   "not reachable in normal use", "the label is missing".
3. **Verifying the checklist instead of the thing** — every declared change confirmed while the output
   changed underneath.
4. **A source that moved** — the spec, the epic, the PO's answer, the build, the ticket's status. It
   moves between pass start and write start, not just between sessions.
