# FULL FEATURE QA `<feature>` — the umbrella: everything we did for Global Search, in order

> **Call it:** `FULL FEATURE QA on Invoicing`
>
> Runs the whole pipeline. Use it when a feature is new to us. Call the individual processes when
> you only want one part.

**SAFETY:** this process obeys [what must never happen](00-WHAT-MUST-NEVER-HAPPEN.md), and may not report success while any check there
is unmet. Mechanical half: `python3 build/testing-tools/safety_check.py --staged`.

---

## THE GATE — the full input set, asked ONCE at the start

I ask for all of this up front so the pipeline does not stop halfway for a missing link. Anything
you cannot supply, say so — I will record it as a gap and tell you what it costs, rather than
quietly working around it.

| # | What I need | Which step needs it | Blocking? |
|---|---|---|---|
| 1 | Feature name + type: **NEW / V2-UPGRADE / REVIVAL** | routing | yes |
| 2 | **Repository access**, the **V1 commit**, the **V2 branch** | V1 vs V2 Capability Check | yes, on a V2 |
| 3 | Spec / PRD link | Lock the Requirements | yes |
| 4 | Epic key | Lock the Requirements | yes |
| 5 | Designs (Figma / technical design) | Lock the Requirements | no — recorded as a gap |
| 6 | Engineering tech plan | Lock the Requirements | no — I will remind you (Rule 30) |
| 7 | PO's name | PO questions | yes, before questions go out |
| 8 | Environment URLs + which to use | Kick-Off, Seed the data | yes |
| 9 | **A dedicated login per environment** | Seed the data, Make runnable | yes |
| 10 | TestRail write permission + target section and run | Publish to TestRail | yes, at that step |
| 11 | Jira ticket permission | findings | per ticket, never a blanket |

---

## THE ORDER, AND WHY IT IS THIS ORDER

```
  KICK-OFF ─► V1 vs V2 ────► LOCK THE ──► WRITE THE ──► SEED THE ──► MAKE THEM ──► PUBLISH
             CAPABILITY        REQS          TESTS        TEST DATA   RUNNABLE      TO TESTRAIL
```

- **Feature Kick-Off first** because everything else needs access, and because which version each environment
  runs must be **measured** before anything is pointed at it.
- **The V1 vs V2 Capability Check second, and before the cases are written** — on a V2 it decides which cases need to
  exist at all. Written after, it becomes an audit of a suite that already has the wrong shape.
- **Lock the requirements before writing the tests**, because an expected result is a quotation and you cannot quote a
  document you have not pinned.
- **Seed the data before proving the terms**, because you cannot prove a term against data that is not there.
- **Prove the terms before publishing to TestRail**, because publishing a suite full of "find the data first" hands a
  tester a pile of dead ends.

**Checkpoint after every step:** commit and push, path-scoped, with the real secret scan. Git is the
only durable store — the container and `/tmp` are not (Rule 29).

---

## REPORTING — what you get, and when

- **After each step**, in plain language: what I did, what it proved, what is outstanding.
- **Per-project completion table** before the next project starts (Rule 67).
- **Every report ends with "OUTSTANDING — what I need from you"**, written so it stands on its own:
  what the thing is, why it matters, what I need, and what happens next. *"Nothing outstanding"* if
  that is true — but the section is never omitted (Rule 36).

---

## IF SOMETHING FAILS MID-PIPELINE

It must not fail from a cause we have already met. These are handled, not hoped:

| Cause | What happens now |
|---|---|
| Session expired | Re-mints itself and carries on, if a credential file is present |
| Branch redeployed mid-run | Build marker compared before and after; the run says so and is resumable from a step |
| A record did not create | Second pass; then named explicitly if it still fails |
| Slow indexing | Waits and re-asks before reporting a loss |
| An endpoint is unknown | Front-end code → back-end routes → playbook → network tab → ask. **Guessing is not a rung** (Rule 115) |
| The data is right and the build is wrong | Reported as a PRODUCT FINDING; does not fail the run |

Anything genuinely new stops and reports **which rungs were tried and what each returned** — never a
bare "blocked".

---

**Read first, always:** `build/skills/TOKEN-DISCIPLINE-CHARTER.md` (Rule 95) and
`build/skills/00-COMMON-CORE.md`. **Clause 12: quality is never the thing that gets cut.**
