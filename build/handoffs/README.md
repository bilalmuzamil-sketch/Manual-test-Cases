# Session handoffs — index

> **What this folder is:** four copy-paste briefings. Open one, paste the whole file into a fresh
> session, and that session knows what lane it is in, what to read, what rules bind it, what to ask
> before it starts, and what "done" looks like. Written 2026-08-21.

---

## The four handoffs

| # | File | The session is for | Its skill | Its primary deliverable |
|---|---|---|---|---|
| 1 | `HANDOFF-1-TEST-CASE-CREATION.md` | **Authoring NEW test cases** from the spec/PRD, epic stories, designs, tech plan and PO answers — plus the coverage verdict table, surface matrix, deliberate-decisions register and the TestRail import. Closes with the Ruthless Usefulness Audit. | `build/skills/10-TEST-CASE-CREATION.md` (**router** → `00`/`02`/`01`) | The case source + `testrail-import/<project>-v1-testrail-import.csv` + the coverage and audit outputs |
| 2 | `HANDOFF-2-BUILD-VERIFICATION.md` | **Driving existing cases live against the running build** to produce observed PASS / DEVIATION / HOLD verdicts with evidence, plus the re-check queue. | `build/skills/11-BUILD-VERIFICATION.md` (**router** → `00`/`02`/`03`/`04`/`06`) | `<Project>_Defects-for-Testers_<date>.xlsx` + `FINDINGS.md` + `RECHECK-QUEUE.md` |
| 3 | `HANDOFF-3-VIU.md` | **The full VIU pass** — capture the real labels live, rewrite the wording, verify behaviour, push to TestRail with a per-case audit log, re-stamp provenance, regenerate deliverables. | `build/skills/12-VIU.md` (**router** → `00`/`02`/`03`/`01`/`04`/`06`) | Corrected cases live in TestRail + the execution log + regenerated import/tracker/workbook |
| 4 | `HANDOFF-4-TEST-EXECUTION-AND-DEFECTS.md` | **Executing existing cases against a build and preparing defects that get ACCEPTED** — honest results with evidence, then every candidate defect through the **admissibility gate**. Its FIRST task, before any testing, is the **REFUSAL POST-MORTEM**: read the actual refusal comments on our refused tickets in Jira (**never guess them**) and record what would have caught each one. | `build/skills/16-TEST-EXECUTION-AND-DEFECTS.md` (**router** → `00`/`09`/`03`/`06`/`04`/`13`/`14`) | `REFUSAL-POSTMORTEM-<date>.md` + `execution-<date>/` (log, results, blocked, re-check queue) + `defect-pack-<date>/DEFECT-CANDIDATE-<id>.md` per finding. **Approved candidates, never filed tickets** (Rule 94) |

---

---

## 🔴 EVERY HANDOFF AUTHORED FROM NOW ON MUST EMBED THE TOKEN DISCIPLINE CHARTER (Rule 95)

**REQUIRED SECTION.** Every handoff in this folder — existing and future — carries a section titled
**"TOKEN DISCIPLINE CHARTER (mandatory — Rule 95)"** reproducing **all twelve clauses VERBATIM**, plus
a pointer to the canonical [`../skills/TOKEN-DISCIPLINE-CHARTER.md`](../skills/TOKEN-DISCIPLINE-CHARTER.md).
Inline and verbatim, because **a session must not have to open another file to learn how to spend.**

**A HANDOFF WITHOUT IT IS NON-COMPLIANT AND MUST NOT BE ISSUED.** If you are authoring or revising a
handoff, copy the section from any of the four existing handoffs. If a handoff already has a
token/quota section, **MERGE into it — never duplicate.** Authority: **Standing Rule 95**
(`build/rules/RULES-61-99.md`); it ties Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90.

---

## 🔴 EVERY HANDOFF AUTHORED FROM NOW ON MUST ALSO EMBED "SEARCH BEFORE YOU GIVE UP" (Rule 97)

**REQUIRED SECTION — same treatment as the charter above.** Every handoff in this folder — existing and
future — carries a section titled **"SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)"**, **INLINE and in
full**, because **a session must not have to open another file to learn how to stop giving up.** It
carries: the QA-lead directive verbatim (2026-08-28); the rule that **nothing is reported as impossible,
blocked, unavailable or unreconstructable until the workspace has been searched with the EXACT ERROR
TEXT**; the **search drill** (`grep -rn "<exact error string>" build/ --include=*.md` ·
`grep -rn "<endpoint/tool/symptom>" build/APP-ACTIONS-PLAYBOOK.md build/skills/` · `ls build/BLOCKED-*.md`
— **several are marked RESOLVED with the cause** — · `ls build/*DIAGNOSIS*.md build/*/FINDINGS.md` ·
`git log --all --oneline --grep="<keyword>"`); **the four places in order** (`build/APP-ACTIONS-PLAYBOOK.md`
· `../skills/14-ACCESS-RESILIENCE.md` · `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` · `build/rules/RULES-*.md`,
grepped and never read whole); the duty to **report the searches you ran** when the answer genuinely is
not there; the five real 2026-08-28 false blockers; and the duty to **write a new solution into the
playbook or the relevant skill IN THE SAME PASS**.

**A HANDOFF WITHOUT IT IS NON-COMPLIANT AND MUST NOT BE ISSUED.** Copy the section from any of the four
existing handoffs; merge rather than duplicate if a similar section exists. Routers and other skills take
it **by pointer only**. Authority: **Standing Rule 97** (`build/rules/RULES-61-99.md`); it ties Rules 27,
29, 59, 68, 76, 79, 86, 88, 89, 93.

---

## 🔴 EVERY HANDOFF AUTHORED FROM NOW ON MUST ALSO CARRY A **§1a** — "I CANNOT OBSERVE THIS ON THE BUILD" IS **NOT** "BLOCKED"

**REQUIRED SECTION — same treatment as the charter and the search drill above, and it sits at §1a so a
session hits it BEFORE its reading list.** Every handoff in this folder — existing and future — carries
a section numbered **§1a** stating that **"I cannot observe this on the build" is NOT "blocked"**, and
that work in a lane **almost never STOPS — it CHANGES SHAPE.** It is **INLINE and in full**, because
**a session must not have to open another file to learn that its blocker list is mostly not blockers.**

**It carries the OUTCOME LIST — the outcome already defined for each thing you actually hit:**

| What you actually hit | The outcome that is already defined for it |
|---|---|
| **Feature is not built yet** | **Rule 69** — the `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>` marker, the under-development line, `DEFERRED-RUN.md`. **A finished case**, not a blocker. |
| **The case puts the tester on a CUSTOMER-PORTAL SCREEN** | The **staging-only HOLD** marker (`00-COMMON-CORE.md` §5.0-b — CANONICAL). **Three-part test, corrected 2026-09-03, run all three:** (i) read the **preconditions AND the steps** — either can gate it, a precondition-only scan is not a scan (it missed C18671/C18672/C18728/C18729) · (ii) never from the **word "portal"** — a case verifying the portal's ABSENCE on the shop-app path is testable · (iii) a portal **screen** is not a portal **data state** — a data state is **seeded, not parked** (Rule 14); HOLD only if seeding needs a portal credential. ⛔ superseded 2026-09-03: *"Judge it from the preconditions, never from the word 'portal'."* |
| **The source is ambiguous** | **Rule 58** — **hold the case and ask** (a PO-question row). An ambiguous source is **NEVER** resolved by looking at the build. |
| **A data state you need does not exist** | **Rule 14 — SEED IT.** Pre-authorised, permanently, on a disposable environment. **Never NOT-VERIFIED for a data state.** |
| **The feature is there but you cannot find the control** | **The Rule 97 search drill** (playbook first, the exact error text) **+ Rule 26 role reset** — a control you cannot see may be one role reset away. |
| **It is genuinely your own unfinished work** | **Say so plainly — "MINE".** That is the honest name for it, and it is never filed under a blocker. |

**And it carries the two statements that make the list bind:**

1. **BLOCKED IS WHAT IS LEFT OVER, AND IT IS NEVER THE DEFAULT.** Nothing earns the word "blocked"
   until every outcome above has been ruled out, one at a time, in writing.
2. **THEN RULE 68 APPLIES — DECOMPOSE AND STATE THE RESIDUAL.** A blocker blocks only what it
   actually blocks; part of the group is almost always testable, so the group is split and the
   residual is named. A category-wide "not built" derived from one missing artefact is the exact
   failure this section exists to stop.

**THE SECTION IS WEIGHTED PER LANE — NOT PASTED IDENTICALLY.** The outcome list is the same set of
outcomes, but each lane leans on a different part of it, so each handoff phrases and orders it for its
own work: the **creation** lane's §1a is *"no build access is not a blocker on this lane — and you
still own the markers"* (Rule 57's corollary: a case can be fully authored, tester-ready and FINISHED
with zero build access); the **build-verification** and **VIU** lanes' §1a leads with the observation
outcomes; the **test-execution & defect** lane's adds *"— and it is not a defect either"*, because on
that lane the wrong turn is filing rather than parking. **The four existing sections are the worked
examples — copy the nearest one and re-weight it, do not paste it blind:**
`HANDOFF-1-TEST-CASE-CREATION.md` §1a · `HANDOFF-2-BUILD-VERIFICATION.md` §1a ·
`HANDOFF-3-VIU.md` §1a · `HANDOFF-4-TEST-EXECUTION-AND-DEFECTS.md` §1a.

**Canonical fuller treatment, which every §1a must point at and no §1a replaces:
`../skills/03-RUN-CHECK.md` §8.0-a** — *a check that fails is a statement about YOUR CHECK until you
prove otherwise*: the positive-control gate, the one-token variant, and the
**MINE / BLOCKED-PROVEN / BLOCKED-EVIDENCED / NOT-YET-PROVEN** classification a lane must report
counts for.

**A HANDOFF WITHOUT IT IS NON-COMPLIANT AND MUST NOT BE ISSUED.** Merge rather than duplicate if a
handoff already has a blocked-handling section. Routers and other skills take it **by pointer only**.
Authority: the QA lead, **2026-08-31** (*"WHY are you failing to unblock yourself?"*) — the incident
was **18 cases parked as "blocked" when every one had a defined outcome already written down, and 12
more called blocked before the search was finished.** It ties Rules **12, 14, 26, 57, 58, 68, 69, 74,
97** (`build/rules/RULES-01-20.md`, `RULES-41-60.md`, `RULES-61-99.md`).

---

## Lanes do not overlap — and that is deliberate

- The **creation** session does not run build verification and does not rewrite existing wording.
- The **build-verification** session does not author cases and does not rewrite wording.
- The **VIU** session does not author new cases and **never** changes what a case *expects* — it
  corrects **labels**; if the build differs, the case keeps the documented expectation and becomes a
  deviation.
- The **test-execution & defect** session does **not** author cases and does **not** run VIU wording
  passes. It executes and it prepares defects — and it **files nothing**: its output is a set of
  admissible, evidenced candidates the QA lead approves **one at a time** (Rule 94).

A finding that belongs to another lane is **written up and handed back**, never acted on in place.

---

## The MAIN session stays the brain

The main session (the one that produced these handoffs) holds the **cross-project state** — which
projects are active, what each is waiting on, which rulings are in force, where each suite stands —
and it is the only session that consolidates that picture.

**Rule/skill changes are never made unilaterally by a lane session.** Under **Rule 72**, a lane
session that believes a rule or a skill should change **proposes it to the QA lead** — states what it
found, what it thinks should change and why — and waits. It does not edit `CLAUDE.md`, it does not edit
a skill file to suit its own pass, and it does not quietly work to a rule it has decided is wrong.
Durable learnings go back through the main session so both the shared brain (`CLAUDE.md`, the process
docs, the playbook) and the other lanes pick them up.

---

## Two things every lane session must know before it starts

1. **Do NOT read `CLAUDE.md` end to end.** It is roughly 5,000 lines; reading it whole causes context
   thrash and will cost the session. `grep -n '<thing>' CLAUDE.md` and read only what matches.
2. **`CLAUDE.md`'s numbered Standing Rules stop at Rule 62** (verified 2026-08-21). The
   higher-numbered rules the skills rely on — **69, 71, 72, 74, 75, 76, 77, 79, 80, 81** — come from
   the QA lead's later instructions and are **recorded in the skill files, not in CLAUDE.md**. If a
   decision turns on one of them, ask him to confirm the wording.

**Also read `build/skills/00-COMMON-CORE.md` — it EXISTS and it is the shared core of the
pre-existing `00`–`08` skill set.** *(Correction recorded 2026-08-21: an earlier draft of these
handoffs said it did not exist. `build/skills/` was empty at this session's first inventory and the
whole set arrived from another worker on the next fetch. The wrong claim is corrected, not erased.)*

**⚠️ OVERLAP THE QA LEAD NEEDS TO SETTLE — not for a lane session to resolve.** The pre-existing set
already covers much of this ground: **`01-CASE-BUILD.md`** (authoring) · **`02-SOURCE-CHECK.md`**
(source currency) · **`03-RUN-CHECK.md`** (driving the build) · **`04-TESTER-READY.md`** (handover) ·
**`06-DEFECT-PREP.md`** (ticket prep), with `COVERAGE-MATRIX.md` as its completeness proof. The three
dedicated per-process skills (`10-TEST-CASE-CREATION.md`, `11-BUILD-VERIFICATION.md`, `12-VIU.md`)
were written to the QA lead's per-process framing and **partly duplicate** it. Nothing has been merged
or deleted. **A lane session reads both files for its lane and, where they disagree, STOPS and asks.**
**One disagreement is already known:** `00-COMMON-CORE.md` §16 says all three branches are **FINAL**,
while skills `11`/`12` carry Rule 60's "never declared final" plus the 2026-08-10 **per-report**
finality ruling — a source-currency question for the QA lead.

---

## The five new projects (start Monday 24 August 2026)

| Project | **DEVELOPER(S) / lead** | Product Owner |
|---|---|---|
| Parts on Work Orders | Stefan Vukovic | **UNKNOWN — ask** |
| Global Search | Sinisa Nogic, Nikola Milosevic | **UNKNOWN — ask** |
| Invoicing Refresh | Minja Kotlajic | **UNKNOWN — ask** |
| Simplified Workflow v2 | Parth Faladu | **UNKNOWN — ask** |
| Accounting | Nikola Mitrovic | **UNKNOWN — ask** |

**Those are developers, not product owners.** The PO for each is unknown and must be asked for; PO
attributions are never mixed or guessed. **Global Search already exists here** — 86 cases authored,
previously postponed, resume doc `build/global-search/PROJECT-STATE.md` — so it is a **revival to
reconcile**, not a greenfield build.


---

## ⚠️ REFRESHED 2026-08-21 — SKILLS `10` / `11` / `12` ARE NOW THIN ROUTERS

They were full standalone skills; they duplicated `01`/`02`/`03`/`04`/`06`, and **duplicated content
drifts** (the two copies were already disagreeing about whether the branches were final). **The
canonical procedure now lives in the `00`–`08` set and is maintained there only** — each router names
the exact canonical files and sections its lane needs. **Nothing was lost:** new-project onboarding →
`01` §11 · the `Defects-for-Testers` workbook → `04` §6.1 · the `API-ASK.md` naming fact → `06`.

**TWO THINGS EVERY LANE NOW OWES IN ITS REPORT:**

1. **FINALITY — read `00-COMMON-CORE.md` §16.0, not §16.1.** The QA lead ruled on 2026-08-21 that
   **the branches are NOT final** — continuously updated by ad-hoc decisions until release day — so
   **Rules 49 and 60 apply in full, findings stay PROVISIONAL, and a gap is possibly-unfinished rather
   than automatically a defect.** §16.1 is the superseded 2026-08-11 "FINAL" text, kept dated.
2. **RULE 91 — every verification claim carries a freshness badge and its date:** **✅ ≤ 7 days ·
   🟠 8–14 days · 🔴 > 14 days · ❌ never verified**, with the build marker (or spec version). **A bare
   tick is non-compliant.** Tool: `build/testing-tools/verification_badge.py` (requires `--today`).
