# RECHECK-QUEUE — Report Suite, opened 2026-08-05 (Standing Rule 49 / Rule 60)

**STATUS: OPEN.** Per Standing Rule 60 an open queue is the **normal steady state** of an active
project — engineering has confirmed the branches will not be declared final before release, so this
is a living work list, not an embarrassment.

**Build marker for every row below:** `v3.5-16cf83f`, last-mod Wed 05 Aug 2026 06:40:32 GMT,
etag `177c59546701e7810b894492dabc1423`.

## What is provisional, and what is not (Rule 60 layer split)

| Layer | Survives a redeploy? | State after this pass |
|---|---|---|
| The documented expectation, requirement anchor, spec version, epic/story refs, Rule-54 sentence 1 | **YES** — build-independent | Unchanged by this pass; no document moved |
| On-screen labels and navigation path (Rule 9) | NO | Captured live for all six reports — `evidence/screens.json`, `evidence/toolbar.json` |
| The PASS / DEVIATION verdict | NO | 32 of 476 carry a verdict from this build; 444 carry their last recorded check |
| `READY - EXPECT FAIL` and `HOLD - not built` markers (they assert a build fact) | NO | 27 EXPECT-FAIL re-driven this pass; 5 stale "not built" HOLDs corrected |
| Plain `AUTOMATION: READY` (asserts *automatable*, not *passing*) | **YES** — build-independent | 424 cases |

## Rows

| C-id | What must be re-confirmed | Why it is queued |
|---|---|---|
| The 444 NOT-OBSERVED cases | A live per-case observation on the current build | Never driven this pass — see FINDINGS.md |
| C30172 C30194 C30290 C30320 C30593 C30595 C38885 C38887 C43547 C43548 | Whether the PDF export still fails above the row cap | SV-8818 Ready to Fix — reproduced 2026-08-05 on PV, IV and SBC |
| C30510 C30512 C30513 C30514 C30515 C30516 C30517 C30518 C38918 | Whether Work In Progress can be downloaded at all | SV-8907 Open — reproduced on both formats and all four tabs. **Seven of these nine assert things about the CONTENTS of a downloaded file, and no file can be produced, so their inner assertions are currently unobservable.** |
| C30562 C30564 C30565 C30566 | Whether the "As of" day still lands one day after the range end | SV-8820 Ready to Fix — reproduced |
| C30162 C30287 C30589 | Whether export money/dates/percent formats become plain numbers | SV-8823 Ready to Fix for Inventory Value; **the Sales By Customer and Sales By Representative half has no ticket** |
| C30500 | Whether the Asset filter offers both vehicles sharing unit number 854 | SV-8908 Open — the shared-unit data is confirmed present; the dropdown was not driven |
| The 12 Location-column HOLDs (C30156 C30352 C30467 C30511 C30551 C30554 C30588 C38912 C38913 C38914 C38916 C38917) | Chris Ward's one-sentence answer, then the live model per report | All six specs still state it both ways; the build is split 3/3 |
| C30191 C30442 C30506 C30592 C38859 | Nothing outstanding — corrected this pass | Their "not built yet" hold was stale; now READY |
