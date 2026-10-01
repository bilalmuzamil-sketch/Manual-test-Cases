# HAND THE RUN OVER `<feature>` — so somebody else can pick it up cold

> **Call it:** `HAND THE RUN OVER for Invoicing`
>
> The reader has none of your context. They are a tester, another session, or you in three weeks.
> **A handoff that assumes anything is a handoff that fails.**

**RUNS AFTER:** `7 · Publish to TestRail` — it provides a published suite in a run to hand over.
**If it has not been done I run it**, rather than starting and failing halfway.

**SAFETY:** this process obeys [what must never happen](00-WHAT-MUST-NEVER-HAPPEN.md), and may not report success while any check there
is unmet. Mechanical half: `python3 build/testing-tools/safety_check.py --staged`.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **Who is picking it up** — a manual tester, another session, the whole team | It changes the level, not the facts |
| **What they are expected to do** — run everything, run a section, retest a list | |
| Whether they have **their own access**, or need credentials | |

---

## WHAT IT PRODUCES

One document that stands alone:

1. **What this is and what "done" looks like** — in two sentences.
2. **Exactly where to go** — environment URL, workplace, login, the TestRail run link.
3. **What to run**, named — section or case list, with C-ids and links (Rule 8: never a bare local
   id).
4. **What is already known to fail**, so they do not re-report it — with the ticket number.
5. **What is HELD and must not be judged** — and why.
6. **The traps specific to this feature** — the things that will waste their first hour.
7. 🔴 **The token-discipline charter, verbatim**, if the reader is another session (Rule 95). A
   handoff without it is non-compliant.
8. **Who to ask**, and what is outstanding.

---

## THE STEPS

1. **Write it for someone who was not here.** Expand every internal name once.
2. **Re-verify the facts you are about to state.** A handoff is a summary, and a summary is exactly
   what Rule 112 says not to trust — the previous Global Search handoff claimed eight cases needed no
   new records; reading the actual case bodies found three dead example records and a product defect.
   **Check against the case text, not against what you remember writing.**
3. **Name the build marker and the date.** The reader must know how stale it is.
4. **List what is outstanding**, with what you need from whom.
5. **Say what was NOT done**, explicitly. A gap you name is a gap; a gap you omit is a trap.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| Summarising instead of checking | The reader hits dead ends you promised were fine | Verify against the real case text (112) |
| Assuming shared context | They cannot start | Expand every name once |
| No build marker | They cannot tell what is stale | Date everything |
| Omitting the known failures | They re-report what is already filed | List them with ticket numbers |

---

## DONE WHEN
Someone with no context could start work from this document alone, and every factual claim in it was
re-checked rather than remembered.

**Canonical:** `build/skills/04-TESTER-READY.md`, `build/handoffs/README.md`.
**Rules:** 112, 95, 84, 8, 36. **Worked examples:** the four `HANDOFF-*.md` in `build/global-search/`.
