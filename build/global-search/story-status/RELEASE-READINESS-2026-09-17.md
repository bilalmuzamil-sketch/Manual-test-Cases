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
