# AUTOMATED CASES CHANGED — FOR VLAD (Filters, finish3, 2026-08-12)

**Standing Rule 65.** Any case TestRail flags as **Automated** that we change gets reported, so the
automation engineer can adjust. The marker meant here is TestRail's **own field
`custom_atmstatus` (3 = Automated)** — *not* our `AUTOMATION:` text marker at the end of Expected
Results, which is a different thing and answers a different question.

**Captured AT WRITE TIME on all 64 cases written**, because the flag moves both ways.

---

## DOES THIS CHANGE WHAT AN AUTOMATED CHECK SHOULD CONCLUDE? **NO — on both cases.**

**2 of the 64 cases written carry `custom_atmstatus = 3`.** Both flags were **set by hand by user 1
(Vladimir Tomovic)**, confirmed from `get_history_for_case` rather than assumed — so both are
genuinely his, and neither is an artefact of our own `add_case` tooling.

| Case | Title | What changed | Affects automation? |
|---|---|---|---|
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Customer filters together show only work orders matching both | **One sentence added** at the very end of Expected Results: *"Last checked against build v3.7-20e801b on 12 August 2026."* Nothing else — no step, no expectation, no label, no marker. | **NO.** It records which build the case was last checked against. The assertion is unchanged. |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile: tapping Apply filters applies the statuses and updates the count | **One sentence replaced** at the very end of Expected Results: the build named in *"Last checked against build … on …"* moved from `v3.6-3e9dd6d` to `v3.7-20e801b`. Nothing else. | **NO.** Same reason. |

**Flag history, read live:**

* **C29600** — 3 events, **all user 1**: Not Automated → Automated, → Not Automated, → Automated.
* **C29623** — 1 event, **user 1**: Not Automated → Automated.

---

## WHAT WAS *NOT* DONE

* **`custom_atmstatus` was not sent on any payload** — the flag is Vlad's to set, never ours.
* **No `AUTOMATION:` text marker was changed** on any of the 115 cases. The live census still reads
  **90 `READY` · 7 `READY - EXPECT FAIL` · 18 `HOLD` = 115**, gate closing both ways
  (90 + 7 = 97 = 115 − 18).
* **No case was deleted, retitled, re-scoped or moved.** 0 `add_case`, 0 `delete_case`,
  0 `add_section`, 0 run writes.
* **Vlad's own five cases (C43576–C43580) were not touched** and are proven byte-identical over all
  30 fields including `updated_on` and `updated_by`.

---

## ONE THING WORTH HIS TIME, EVEN THOUGH WE CHANGED NOTHING ON IT

Two `data-test-id` facts that would silently break a selector written from the case text alone:

* the **Review** status option is **`filter_option_status_ready_for_review`**, *not*
  `filter_option_status_review` — a wrong guess here matches nothing and makes a check **unable to
  fail** rather than fail loudly (it cost this pass one whole diagnostic run);
* the two option lists use **different markups**: Status and Asset on Site are `q-checkbox` with
  `aria-checked`, while **Customer, Lead Technician and Service Advisor are `q-item`/`role="listitem"`
  with no `aria-checked` at all** — selection appends a `q-item__section--side` check glyph. An
  `aria-checked`-only assertion returns "nothing selected" for those three however many are selected.

Neither is a defect and neither is a change of ours; both are the kind of thing that costs an
afternoon if it is met for the first time inside a failing automated run.
