# VIU LANE — INTAKE ATTEMPT, 2026-08-21 ~07:05Z — ASSIGNMENT ARRIVED UNFILLED

**Branch** `claude/slack-session-0sxnd9`, fetched + `merge --ff-only` clean, HEAD `b6d247a7`.
**Zero writes: 0 TestRail, 0 Jira, 0 application driving, 0 lock claimed, no project folder created.**

## What happened

The QA lead sent the project-assignment template. **Every field arrived as its literal unfilled
placeholder** — `<project name>`, `<name>`, `<Confluence URL>`, `<SV-xxxx>`, `<or "propose one">` and
the rest. **No project was actually named**, so per `15-NEW-PROJECT-INTAKE.md` §0 this session is
**not in the intake skill at all** and remains at the Rule-92 scope gate:

> *"No project has been named → You are not in this skill yet. Sit at the Rule-92 scope gate and wait."*

**Recorded rather than passed over in silence**, so a later reader can tell "the assignment had not
landed yet" from "the session sat idle", and so no future session mistakes the placeholders for a
project called `<project name>`.

## The checklist result, run against what was supplied

| # | Required input (skill 15 §1) | PRESENT / MISSING | What arrived | If MISSING: what it blocks |
|---|---|---|---|---|
| 1 | Spec / PRD — URL **and** an ingestible copy | **MISSING** | `<Confluence URL>` | The primary source of expected behaviour (Rule 57). Nothing can be sourced, so no case may be touched |
| 2 | Designs — Claude design / Figma file + node ids / technical design | **MISSING** | `<Claude design / Figma link / technical design>` | Every label the spec does not pin; a Figma node set cannot be fetched |
| 3 | Epic / Jira key | **MISSING** | `<SV-xxxx>` | Rule-20 traceability and the `refs` value; no owning story can be named |
| 4 | Engineering tech plan | **MISSING** | `<link or "not available yet">` | Edge cases, API contracts, state machines (Rule 30). "Not available yet" is an acceptable answer; a placeholder is not |
| 5 | The PO's name | **MISSING** | `<name>` | Whose answers carry authority. **Never guessed, never carried across projects** |
| 6 | QA branch / env + feature-flag or settings state | **MISSING** | `<or "no build yet">` | Every live observation. "No build yet" is acceptable and triggers Rule 85 |
| 7 | TestRail target section | **MISSING** | `<or "propose one">` | Where a push would land. "Propose one" is acceptable once the project is known |

**Count: 0 of 7 PRESENT, 7 MISSING** — and the project name itself, which is the gate rather than one
of the seven, is also absent.

**Also absent, and not one of the seven:** `Developer/lead: <name>`. It is useful context, never a
source of expected behaviour, and it is **never read as the PO** — handoff 3 §5 records that the five
upcoming projects' listed names are **developers**, with every PO still unknown and to be asked.

## Why nothing was created

`15-NEW-PROJECT-INTAKE.md` §3 puts folder scaffolding **after** §1 and §2, so the state document
records a real input set rather than an aspiration; §1 forbids inventing project details ahead of the
spec. With no slug there is no legitimate path for `build/<project-slug>/INTAKE-<date>.md`, and
creating one under a guessed slug would be exactly the invention the rule bars. **This file is the
record instead.**

## OUTSTANDING — what I need from you

**One thing: the same template, filled in.** Every row above converts to PRESENT the moment its field
carries a value. `"not available yet"`, `"no build yet"` and `"propose one"` are **real answers** and
are handled — an unfilled `<placeholder>` is the only thing that cannot be.

Nothing else outstanding. The rows carried at 06:50Z stand unchanged: no ShopView cookies and no
TestRail credentials in `/tmp` (both blocked on the QA lead), `sv8582` unreachable at HTTP 502, the
Rule-62 Jira creation hold still active, and the branch-name confirmation still open.
