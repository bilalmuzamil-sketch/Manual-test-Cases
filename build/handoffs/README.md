# Session handoffs — index

> **What this folder is:** three copy-paste briefings. Open one, paste the whole file into a fresh
> session, and that session knows what lane it is in, what to read, what rules bind it, what to ask
> before it starts, and what "done" looks like. Written 2026-08-21.

---

## The three handoffs

| # | File | The session is for | Its skill | Its primary deliverable |
|---|---|---|---|---|
| 1 | `HANDOFF-1-TEST-CASE-CREATION.md` | **Authoring NEW test cases** from the spec/PRD, epic stories, designs, tech plan and PO answers — plus the coverage verdict table, surface matrix, deliberate-decisions register and the TestRail import. Closes with the Ruthless Usefulness Audit. | `build/skills/10-TEST-CASE-CREATION.md` | The case source + `testrail-import/<project>-v1-testrail-import.csv` + the coverage and audit outputs |
| 2 | `HANDOFF-2-BUILD-VERIFICATION.md` | **Driving existing cases live against the running build** to produce observed PASS / DEVIATION / HOLD verdicts with evidence, plus the re-check queue. | `build/skills/11-BUILD-VERIFICATION.md` | `<Project>_Defects-for-Testers_<date>.xlsx` + `FINDINGS.md` + `RECHECK-QUEUE.md` |
| 3 | `HANDOFF-3-VIU.md` | **The full VIU pass** — capture the real labels live, rewrite the wording, verify behaviour, push to TestRail with a per-case audit log, re-stamp provenance, regenerate deliverables. | `build/skills/12-VIU.md` | Corrected cases live in TestRail + the execution log + regenerated import/tracker/workbook |

---

## Lanes do not overlap — and that is deliberate

- The **creation** session does not run build verification and does not rewrite existing wording.
- The **build-verification** session does not author cases and does not rewrite wording.
- The **VIU** session does not author new cases and **never** changes what a case *expects* — it
  corrects **labels**; if the build differs, the case keeps the documented expectation and becomes a
  deviation.

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

**Also missing, and worth knowing:** `build/skills/00-COMMON-CORE.md` does **not** exist. The shared
core block (session survival, quota discipline, strategy-first, secrets, no-work-loss, IDs,
outstanding) is reproduced at the head of **each** of the three skills, so nothing is lost — but if
that common file is ever created, the handoffs' read-order lists point at the right place for it.

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
