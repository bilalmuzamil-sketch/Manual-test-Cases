# AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)

**Rule 65:** any change to a case **TestRail itself flags as Automated** must be reported, so the
automation engineer can adjust. The marker that matters is TestRail's own field
**`custom_atmstatus`** (3 = Automated) — **not** our `AUTOMATION:` text marker; the two disagree and
the field is the one that answers the question (Rule 64).

**`custom_atmstatus` was captured AT WRITE TIME**, because the flag moves both ways.

---

## ONE CASE — AND IT IS ONE VLAD SET HIMSELF

| Case | `custom_atmstatus` at write time | What changed, in one phrase | Does it change what an automated check should conclude? |
|---|---|---|---|
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) — *Filters are remembered permanently for your account* | **3 — Automated** | The build line at the end of Expected Results moved from *"Last checked against build v3.4.2-d00239b on 8/5/2026"* to *"Last checked against build v3.7-20e801b on 12 August 2026"*. | **NO.** No step, precondition, expectation, title or `refs` changed, and the `AUTOMATION: READY` marker is unchanged. This is a provenance stamp only. |

**Who set the flag — checked, not assumed.** `get_history_for_case/29614` carries exactly one
`custom_atmstatus` event: **user 1 (Vladimir Tomovic), Not Automated → Automated**. So this is a case
Vlad marked by hand, and the Rule-65 report is genuinely owed rather than an artefact of our own
`add_case` tooling.

---

## THE OTHER THREE CASES THIS PASS WROTE TO — NONE OF THEM AUTOMATED

| Case | `custom_atmstatus` at write time | Note |
|---|---|---|
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) — *Two browsers: the last one to save wins* | **1 — Not Automated** | Its `custom_atmstatus` history is **empty**, so nobody has ever marked it. Same change: the sentence *"This test has not yet been checked against any build"* became *"Last checked against build v3.7-20e801b on 12 August 2026"*. |
| [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) — *A deactivated technician does not appear in the Lead Technician filter list* | **1 — Not Automated** | Sentence-2 build stamp only. |
| [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) — *A deactivated advisor does not appear in the Service Advisor filter list* | **1 — Not Automated** | Sentence-2 build stamp only. |

**All three listed for completeness; none is owed to Vlad.**

---

## WHAT MIGHT MATTER TO HIM ANYWAY, THOUGH NO CASE WAS TOUCHED

Both cases now carry a **verified live result** where they previously did not, and one of them was
recorded as failing:

* **C29614 was marked FAILED in run 352** on the strength of the previous pass's reading that a
  saved filter is not restored. **That reading was wrong** — see `RESTORE-CONTRADICTION.md`. Restore
  works; the earlier negative came from landing on `/workorders?tab=all`, which carries its own
  state and legitimately beats the saved preference. **An automated check that lands on `?tab=all`
  and expects the saved filter will fail for the same reason.** That is the one thing in this pass
  worth Vlad's attention.
* **C43560** now has an observed result for the first time (two browsers, last-write-wins, verified
  end to end).

**No result was written to run 352 by this pass, and no marker was changed.**

---

**Total: 4 cases written to; 1 of them Automated (C29614); the change does not alter what an
automated check should conclude — though the reason that case had been failing does.**

**One more thing worth Vlad's time, on cases nobody touched:** C29581 and C29588 are now proven
runnable **without any staff record being deactivated** — the estate already holds 17 inactive staff,
9 of them Technicians. **An automated check for these two does not need a staff-administration
step at all**; it can assert directly that no inactive person appears in the Lead Technician or
Service Advisor list, with an active person as its control.
