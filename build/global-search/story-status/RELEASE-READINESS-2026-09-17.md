# Global Search v2 — release readiness by story, 17 September 2026

Every figure read **live** from Jira and from run 415 on the day. Shareable page:
https://claude.ai/artifact/25r8mu1rsGXa5TF5xviz3B · source `build/global-search/reports/global-search-readiness.html`.

**26 children of SV-9160.** 5 clear · 7 held by open defects · 5 obsolete · 8 not started · 1 already QA Complete.

## A · Zero defects — can be marked QA Complete now (5)

| Story | What it is | Checks | Note |
|---|---|---|---|
| **SV-9162** | BE — `GET /api/search`, scoped, grouped, ranked | **6/6 pass** (section 6734) | tenancy check passed by the QA lead 2026-09-17 |
| **SV-9166** | BE — Recent-entities API | 4/5 pass (6728) | the fifth (C44857) is data-limited, not a fault |
| **SV-9172** | FE — Recent searches grouped, last query kept | **3/3 pass** (6729) | shares C44857 |
| **SV-9313** | Verify Phase 6 — FE old-path removal & copy | — | status TESTING QA, no defects raised |
| **SV-9161** | Spike resolved; residual is committing the ADR | — | nothing for QA to test |

## B · Held by open defects — 14 to fix, 1 awaiting QA verification (7)

| Story | What it is | To fix | Awaiting QA | Verified | Defects |
|---|---|---|---|---|---|
| **SV-9170** | FE — Entity result rows | **3** | — | 0 | SV-10163 · SV-10178 · SV-10186 |
| **SV-9164** | BE — Matching pipeline | **3** | — | 1 | SV-10025 · SV-10055 · **SV-10060 (Blocked)** |
| **SV-9163** | BE — Search index | **2** | **1** | 9 | SV-10001 · SV-10199 · **SV-10008 (Done, needs QA)** |
| **SV-9165** | BE — Ranking engine | **2** | — | 0 | SV-10161 · SV-10188 |
| **SV-9168** | FE — Modal shell | **2** | — | 1 | SV-10181 · **SV-10068 (In Progress)** |
| **SV-9171** | FE — Keyboard & WCAG | **1** | — | 0 | SV-10061 |
| **SV-9174** | FE — Integration | **1** | — | 0 | SV-10159 |

**Total: 14 not fixed · 1 fixed awaiting QA (SV-10008) · 11 verified · 1 dropped (SV-10110).**

## C · Obsolete (5) — 11 checks parked

SV-9173 (8 checks) · SV-9169 (1, and all 5 of its own defects were verified before it was dropped) ·
SV-9306 (1, its verification SV-9311 also not started) · SV-9167 (1, the spec agrees) · SV-9310.

## D · Not started (8)

SV-9176 rollout & old-path removal · SV-9307 · SV-9308 · SV-9309 · SV-9311 · SV-9312 (verification
rounds) · SV-9175 our own E2E automation · **SV-9594 unit number on Schedule work orders — a
different feature; it has no checks in this suite and should be moved out of the epic.**

## E · Already complete (1)

SV-10031 — Part Sales bug, QA Complete.

## Run 415, live

139 Passed · 13 Failed · 11 Retest · 1 Blocked · 1 Untested = **165**.
**All 13 failures carry a ticket**, so every one is trackable and re-runnable on fix.

Two failures cleared by the QA lead himself today with verification videos: **C44880** (tenancy) and
**C53476** (the count of twenty — his ruling stands over the §5.2 wording, so the Rule 63 conflict
raised earlier is closed). Two more cleared by reading §5.6 live: **C45132** and **C45136**.

## Who the 14 open defects are with — read live 2026-09-17

| Assignee | Count | Defects |
|---|---|---|
| **Sinisa Nogic** | **6** | SV-10001 · SV-10199 · SV-10161 · SV-10188 · SV-10163 · SV-10060 (Blocked) |
| **Nikola Milosevic** | 3 | SV-10178 · SV-10186 · SV-10068 (In Progress) |
| **Branko Cicovic** | 2 | SV-10181 · SV-10061 |
| **Milos Vasic** | 1 | SV-10055 |
| ⚠️ **Unassigned** | 1 | **SV-10159** — the missing "Show all" link; nobody is on it |
| ⚠️ **Bilal Muzamil (QA)** | 1 | **SV-10025** — parked on QA, needs reassigning to a developer before anyone can start |
| *With QA to verify* | *1* | *SV-10008 — Done, awaiting a QA check* |

**The two flagged rows are the quickest wins:** neither has a developer working on it today.

## The shareable report

https://claude.ai/artifact/25r8mu1rsGXa5TF5xviz3B — **version 2**, rewritten for a CEO and Product
Head audience on the QA lead's instruction:

* a black **bottom-line** banner at the top: tested end to end, 139 of 165 pass, held by 14 open
  developer faults and **not** by anything waiting on QA;
* a **two-column split — QA work / Developer work** — so the two sides read at a glance;
* per-story owner counts in the defect section, plus a **"who the 14 faults are with"** table.

Ticket keys are kept but deliberately subdued: nothing in the narrative requires reading one.

## Version 3 — the tone pass (QA lead: *"does not sound like I am blaming any other team"*)

**The problem with version 2.** Its headline read *"14 faults are still open with developers — not
because anything is waiting on QA."* Factually correct, and exactly the sentence that turns a status
report into a case against another team. A report the CEO reads is also a report every named
engineer reads.

**What changed, and the principle behind each change:**

| Version 2 | Version 3 | Why |
|---|---|---|
| "not because anything is waiting on QA" | "the feature is ready to release once they are closed" | states the condition, not whose fault the delay is |
| "QA work / Developer work" | "Testing / Defects to close" | phases of one delivery, not two teams |
| "Finished" / "Outstanding" | "Complete" / "In flight" | *outstanding* implies overdue; *in flight* is neutral |
| "Held by faults the developers must fix" | "Waiting on defects being closed" | removes the instruction and the addressee |
| "One person is carrying six of the fourteen" | "the load is weighted towards one of them — worth a look if it affects sequencing" | a capacity observation, not an indictment |
| "1 fault has no owner at all" / "parked on QA rather than a developer" | "2 are not yet assigned" | the state is identical; the finger-pointing is gone, and it no longer singles out our own team either |
| "Who the 14 faults are with" | "How the 14 defects are distributed" | grouping for sequencing, not attribution |
| "dropped by the team" | "withdrawn from scope" | passive on purpose |
| "Nothing has started" | "still ahead of us" | *us* — one team |
| **fault** (10 uses) | **defect** throughout | *fault* carries blame in English; *defect* is the industry term and is neutral |

**The one thing deliberately NOT softened:** every number. 139 of 165, 14 open, 7 waiting, 2
unassigned, 1 blocked. Neutral tone is achieved by changing the framing, never by blurring the
facts — a report that softens its numbers is worth nothing to the person who has to act on it.

**Also kept:** the owner table. The QA lead asked for *"how many tickets, who needs to take care of
them"*, and removing the names would have answered a different question. Names stay; the
commentary around them is about sequencing and capacity.

---

# Version 4 — refreshed after the QA lead signed off, 17 September 2026

## What moved

| Story | Was | Now |
|---|---|---|
| SV-9162 — BE `GET /api/search`, scoped | Ready for QA | **QA Complete** |
| SV-9166 — BE Recent-entities API | Ready for QA | **QA Complete** |
| SV-9172 — FE Recent searches grouped, last query kept | Ready for QA | **QA Complete** |
| SV-9313 — Verify Phase 6, FE old-path removal & copy | TESTING QA | **Ready for Production** |
| SV-9161 — Search infrastructure decision | (already) | QA Complete |

**Through QA: 6** (the five above plus SV-10031). **Waiting on defects: 7** — unchanged.
**Withdrawn: 5.** **Still ahead: 8.** Defects: **14 open · 1 closed awaiting re-check · 16 closed and
verified · 1 withdrawn = 32.** Run 415: **139 Passed · 13 Failed · 11 Retest · 1 Blocked · 1 Untested.**

## Two presentation fixes the QA lead asked for

**1 · The number strip meant nothing on its own.** *"they dont have any heading or title to tell the
person who is reading the report for the first time."* He was right, and the flaw was worse than a
missing heading: **the six tiles silently mixed two different units** — 5, 7, 5 and 8 counted parts
of the feature while 14 and 1 counted defects. A first-time reader had no way to know that, and
would naturally read all six as one series.

Replaced with **three labelled bands**, each stating its own total in a full sentence, and each tile
carrying a bold label plus a line of explanation:

* *The feature is built in 26 parts. Here is where each one stands.* → 6 · 7 · 5 · 8
* *Testing raised 32 defects in total. Here is what has happened to them.* → 16 · 14 · 1 · 1
* *The test suite is 165 checks. Here is how the current build scored.* → 139 · 13 · 11 · 2

**Every band now sums to its stated total**, so a reader can check the arithmetic themselves.

**2 · Never describe an item by what was not done to it.** *"mention it in a way that just tell
their status instead of telling everyone that I did not do anything on them."*

The spike row read *"The only thing left is writing the decision down — there is nothing for QA to
test"*, chipped **Nothing to test**. Factually right, and it reads as an absence of work by his
team in a document the CEO opens. Now: *"An investigation, now resolved. Its outcome is recorded as
the architecture decision the build follows — it produced a decision rather than a change to the
product,"* chipped **QA complete**.

**The general rule, and it applies to every future report:** describe an item by the state it is in,
never by the activity it did not receive. *Not started* → **Scheduled** / **Still ahead**. *Nothing
to test* → **Investigation closed**. *Not a search item* → **Separate feature**. The facts do not
change; the reader stops inferring a gap that was never there.

Zero occurrences remain in the page of: *fault · blame · not started · nothing to test · no owner ·
waiting on QA · with developers.*

---

# Version 5 — the regression work was missing, and it was the larger half

**QA lead:** *"YOU MUST add the things we raised while testing the regression suite do not miss
anything which can show our efforts."*

He was right and the omission was serious. Versions 1–4 reported **"16 defects closed and
verified"** as a single grey number. Those sixteen, plus eight still open, are what the **regression
suite** found — and the report gave no hint that a second body of work existed at all.

## The split, counted

| Suite | Checks | Results | Defects it produced |
|---|---|---|---|
| **V1 regression** (sections 6769 + 8056) | **66** | 59 Passed · 6 Failed · 1 Retest | **24 of 32** |
| New-feature checks (all other sections) | **98** | 80 Passed · 7 Failed · 10 Retest · 1 Blocked | **7 of 32** |
| Out of V1 scope (6767) | 1 | 1 Untested | — |
| | **165** | 139 Passed · 13 Failed · 11 Retest · 1 Blocked · 1 Untested | 32 (+1 raised outside testing) |

**Three quarters of everything found on this feature came from the regression work** — and by its
nature it caught what nobody would have thought to look for, because it already worked and nobody
expected it to stop.

## What was added to the report

A full section, *"Where the 32 defects came from"*, with a three-tile band (24 / 7 / 1) and a
named list of what the regression pass actually caught:

* **Customers unfindable** by postcode · website · part of a telephone number · a contact's job
  title — 4 raised, all fixed (SV-10002, SV-10003, SV-10057, SV-10004).
* **Vendors unfindable** by postcode · state · address line 2 — each of which still worked for
  customers, so the gap was only visible by checking both — 3 raised, all fixed (SV-10005,
  SV-10006, SV-10109).
* **Records missing from their own section** although present in the overall list — a vehicle by
  VIN, a vendor by contact email, a part by part number, a work order by part of its number —
  4 raised, all fixed (SV-10014, SV-10015, SV-10016, SV-10017).
* **Vehicles unfindable by number plate, and by part of a VIN** — 2 raised, fixed (SV-10007,
  SV-10058).
* **A new work order taking ~85 seconds to become findable** — measured, not estimated; in a shop
  that means it cannot be pulled up while the customer is still at the counter (SV-10056).
* **A keyword that threw "Oops! An error occurred"** on screen (SV-10113).
* **Work orders no longer findable by their stage** — fixed, now awaiting re-check (SV-10008).
* **Six still open** — SV-10001, SV-10199, SV-10025, SV-10055, SV-10060 (blocked), SV-10061.

The regression split is now also named in the masthead, in the Testing column of the summary, and
in the run table's introduction, so a reader meets it before the detail.

## The lesson

**A status report that counts only what is still broken erases the work that fixed everything
else.** Sixteen closed defects are not background — they are the single largest piece of evidence
that the testing was thorough. Report closed work by name and by count, not as a grey total.

## v6 — published 2026-09-17 evening (artifact version 6)

Refreshed after the evening execution pass (the handoff's 16 outstanding ranking / fuzzy /
permission checks, plus the two fixtures repaired under the standing CRUD authorisation).

Figures re-derived LIVE from run 415 immediately before publishing:

| Result | Checks |
|---|---|
| Passed | 153 |
| Failed | 15 (14 with a defect raised; C55707 written up, ticket held per Rule 113) |
| Retest (parked behind obsolete work) | 11 |
| Blocked | 1 (C55711 — part-sale comparison records not seeded) |
| Untested | 1 (C45159 — out of this release by the spec's own wording) |
| **Total** | **181** |

Suite composition stated in the report: **115 new-feature checks + 66 regression checks**, and the
regression half is credited with **24 of the 32 defects** — added on his instruction *"YOU MUST add
the things we raised while testing the regresion suite do not miss anything which can show our
efforts."*

Artifact: https://claude.ai/artifact/25r8mu1rsGXa5TF5xviz3B

## v7 — published 2026-09-17, late evening (artifact version 7)

The last blocked check (C55711) was unblocked and run — see
`build/global-search/run415-execution/C55711-FIXTURE-2026-09-17.md`. Run 415 read live afterwards:

| Result | Checks |
|---|---|
| Passed | **154** |
| Failed | 15 |
| Retest (parked behind obsolete work) | 11 |
| Blocked | **0** |
| Untested | 1 (C45159 — out of this release by the spec's own wording) |
| **Total** | **181** |

The "Cannot run yet — 2" tile becomes "Outside this release — 1", and the Held row leaves the
results table. **Nothing in the run is blocked on data or access any more; the only thing waiting
is the go-ahead on one report.**

## v8 — published 2026-09-18 (artifact version 8)

Refreshed after the ranking report was raised on his per-ticket go-ahead. Every figure re-derived
live before publishing — run 415 from TestRail, all 33 defects from Jira in one query.

**Two changes arrived from outside this lane and are reflected:**

1. **C55658 has been DELETED from TestRail and is gone from run 415** (`get_case/55658` → HTTP 400;
   run size 181 → **180**). That is the *work order found by typing its stage* check, and it follows
   SV-10008 being closed with the decision *"Status will not be a searchable field."* The run
   therefore reads **153 Passed** rather than 154, with nothing lost — the check was withdrawn, not
   failed. The report now calls that defect **settled by a decision** rather than "closed, ready to
   re-check", and the suite reads **115 new-feature + 65 regression**.
2. **Assignees have moved.** Re-derived per owner: Nikola Milosevic 4 · Sinisa Nogic 4 · Branko
   Cicovic 2 · Milos Vasic 2 · Bilal Muzamil 1 (SV-10025) · not yet assigned 2 (SV-10159, SV-10211).
   The v7 table's "Sinisa 6 / Nikola 3 / Milos 1" was already out of date.

| | v7 | v8 |
|---|---|---|
| Checks in the run | 181 | **180** |
| Passed | 154 | **153** |
| Failed | 15 (14 reported) | 15 — **all 15 reported** |
| Defects raised in total | 32 | **33** (SV-10211) |
| Still open | 14 | **15** |
| Ranking (SV-9165) open | 2 | **3** |

Also added, on his standing instruction to show the testing effort: the eleven checks that had only
been accepted on a sign-off were re-run and watched on screen, and **two of them were found to be
asking for the opposite of the written requirement** — our own wording, caught before it sent a
developer chasing a product that was behaving correctly.

Artifact: https://claude.ai/artifact/25r8mu1rsGXa5TF5xviz3B

## v9 — published 2026-09-18 (artifact version 9)

Added on his instruction: *"add somewhere nicely about which stories have been QA complete and which
are yet to be completed by the dev so once the remaining stories are completed by dev side and move
for testing QA the work on those will start from the QA side then."*

New section **"Where each part sits between development and QA"**, placed above *Through QA*: a
four-stage handover strip plus a table of the eight not yet handed over. Every status read live
from Jira immediately before publishing.

| Stage | Count | Stories |
|---|---|---|
| Signed off by QA | **6** | SV-9161 · SV-9162 · SV-9166 · SV-9172 · SV-10031 (QA Complete) · SV-9313 (Ready for Production — cleared QA) |
| Handed over and tested, waiting on defects | **7** | SV-9163 · SV-9164 · SV-9165 · SV-9168 · SV-9170 · SV-9171 · SV-9174 (all **TESTING QA**) |
| Still with the development side — QA not started | **8** | SV-9307 · SV-9308 · SV-9309 · SV-9311 · SV-9312 (Board Backlog) · SV-9176 · SV-9175 · SV-9594 (Open) |
| Withdrawn | **5** | SV-9167 · SV-9169 · SV-9173 · SV-9306 · SV-9310 (OBSOLETE) |

The section states plainly that **nothing in the third group is held up by QA** — testing starts on
each one the day it is moved over — and says for each what QA will do when it arrives. The later
*Still ahead* section now names them as the same eight rather than repeating them as a new list.

Artifact: https://claude.ai/artifact/25r8mu1rsGXa5TF5xviz3B
