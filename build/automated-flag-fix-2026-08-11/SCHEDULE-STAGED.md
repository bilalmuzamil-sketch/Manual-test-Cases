# Schedule — staged for the follow-up pass

**Short answer: there is nothing to stage. Schedule is already clean, and this pass proved it
read-only without touching a single Schedule case.**

**Scope discipline first:** the brief barred any TestRail write against Schedule, because a sibling
worker is running a 174-case `update_case` pass on it right now and a write from here would collide
with its byte-verification baseline. **This pass made zero writes of any kind, to any project** — see
`testrail-execution-log.md`. The Schedule figures below come from a **read-only** `get_cases` call that
this pass had to make anyway to establish the population.

---

## What the live read shows (2026-08-11)

| | |
|---|---:|
| Schedule cases authored by us (`created_by = 3`) | **174** |
| …reading `custom_atmstatus = 1` (Not Automated) | **174** |
| …reading `custom_atmstatus = 3` (Automated) | **0** |
| Foreign cases in the Schedule group | **0** |

**Schedule reads 174 of 174 Not Automated. There is no backlog.**

---

## Why — the correction already happened, earlier the same day

The preceding pass (`build/automated-flag-and-c30041-2026-08-11/`) found **31 Schedule cases** that
carried `custom_atmstatus = 3` with **no `custom_atmstatus` history entry at all**, meaning the value
came from our own `add_case` default and was never a deliberate act by anyone. It corrected all 31 from
`3` to `1` under the QA lead's ruling — verbatim, *"Yeh wee need to fix everycase from all the three
projects where we have mistakengly done that."*

**This pass re-checked all 31 against live TestRail rather than taking that record on trust**
(evidence: `evidence/schedule-live-check.json`):

| Check | Result |
|---|---|
| The 31 C-ids still exist in the Schedule group | **31 of 31** — none absent |
| …still reading `1` (Not Automated) live today | **31 of 31** |
| …reading `3` again (i.e. the correction reverted, or was re-set by someone) | **0** |

**The correction landed and has held.** The 31, for the follow-up pass's record:

C30614, C30615, C38847, C38848, C38849, C38850, C38851, C38855, C38863, C38864, C38865, C38866,
C38867, C38868, C38869, C38870, C38871, C38872, C38873, C38874, C38875, C38926, C43554, C43555,
C43556, C43582, C43583, C43584, C43585, C43586, C43587

*(links: `https://shopview.testrail.io/index.php?/cases/view/<id>`)*

---

## So what, if anything, does the follow-up pass owe?

**Nothing on the flags.** Two things are worth carrying forward instead, and neither is a TestRail
write:

1. **The Schedule push scripts still hardcode `3`, and that is deliberate.** Five of them
   (`exec_sync_2026-07-22.py`, `exec_sync_epic_2026-07-27.py`, `exec_sync_techplan_2026-07-30.py`,
   `coverage-rederivation-2026-07-31/exec_sync_coverage_2026-07-31.py`,
   `panel-collapse-2026-08-11/tools/push.py`) were left byte-identical as the audit record of what was
   executed — the reasoning, and the guard that now stops anyone copying them, are in `CODE-FIX.md`
   §5. **Any future Schedule `add_case` must take its payload from
   `build/testing-tools/testrail_add_case.py`, not from those scripts**, or the 31 will simply come
   back.
2. **Re-run the guard before the next Schedule push that creates cases:**
   `python3 build/testing-tools/check_add_case_payloads.py` — exit 0 is clean.

---

## The honest limit on this page

**The flag is read as it stands today.** If Vladimir Tomovic marks a Schedule case Automated tomorrow,
that is his deliberate act and it is **not** ours to clear (Rule 38) — it would simply join the
"left alone" population, as all 44 Filters and Report Suite cases did. And **if a future pass creates
Schedule cases from an old script, new born-Automated cases will appear**, which is precisely what the
guard exists to prevent.
