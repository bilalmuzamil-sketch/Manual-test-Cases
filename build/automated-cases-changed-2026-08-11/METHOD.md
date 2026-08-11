# METHOD — how the Automated-cases-changed list was derived, and what would make it incomplete

**Date:** 2026-08-11 · **Deliverable:** `FOR-VLAD.md` · **Scope:** everything we changed from
**2026-08-06** onward.

**READ-ONLY throughout.** `get_cases`, `get_sections`, `get_history_for_case` only.
**0 `update_case` · 0 `add_case` · 0 `delete_case` · 0 section operations · 0 run writes · 0 results
· 0 Jira calls of any kind.** `quick-login` and `switch-user` were never called and no build was
opened — none was needed.

---

## 1. What "Automated marker" means, now that the QA lead has settled it

His ruling, 2026-08-11, verbatim:

> *"I was referring to testrail OWN AUTOMATED marker, because when we change any test case which has
> the testrail OWN automated marker we have to update Vlad who does the automation so that he can
> adjust accordingly his automation with our updates/delete of test cases."*

So the field is TestRail's own automation-status field, **`custom_atmstatus`**, where **3 =
Automated**. It is **not** our `AUTOMATION:` text marker at the end of Expected Results.

**The two genuinely disagree, and it matters.** Measured live today across our three active projects:

| | Cases |
|---|---:|
| Ours in the three active suites (`created_by = 3`) | **764** |
| …carrying `custom_atmstatus = 3` | **75** |
| Live cases in the same groups including other authors' | 781 |
| …carrying `custom_atmstatus = 3` (incl. 12 foreign) | 87 |

`custom_atmstatus` distribution across those groups: **`1` → 689 · `3` → 87 · unset → 5**.

**The disagreement, concretely:** [C29600](https://shopview.testrail.io/index.php?/cases/view/29600)
carries `custom_atmstatus = 3` and has **no `AUTOMATION:` text marker at all**. Under the old
both-readings interpretation it would have been treated as automated by luck; under the field
reading it is unambiguous.

**The 764 figure reconciles:** Filters 114 + Schedule 174 + Report Suite 476 = 764.

---

## 2. How the population was established

1. `get_cases` for project 1 / suite 1, fully paged → **4,089** cases in the whole suite.
2. `get_sections` for the same project/suite, fully paged → **626** sections.
   **Paging matters:** an unpaged `get_sections` returns 250 and silently misses most of the tree
   (playbook §J).
3. Each case walked up the section tree to its owning group. **Schedule is a trap:** its group
   `4254` is **not** a root section — it sits under `35 Schedule`, which sits under `1`. A
   walk-to-root approach returns zero Schedule cases and looks plausible. Group membership is
   therefore tested by **"is any ancestor one of 4110 / 4254 / 4281"**, not by root identity.
4. Ours = `created_by == 3`. Foreign cases were counted and reported separately, never edited and
   never included in our totals (Rule 38).

---

## 3. How "which ones did we change" was established

**The primary source is TestRail's own change history, not our execution logs.**

`get_history_for_case` was pulled, fully paged, for **all 75** cases. Every history entry carries a
`user_id`, a timestamp, and the **field-level old and new values**. We filtered to entries where
`user_id == 3` (us) and `created_on >= 2026-08-06`.

**Why history and not the logs:** the logs record what a pass *intended*; the history records what
TestRail *stored*, by whom, and when. History also catches writes from any pass whose log we might
have missed, and it attributes correctly when someone else has written to the same case since.

**The execution logs were used as a cross-check.** All machine-readable oplogs and markdown
execution logs touched by commits since 2026-08-06 were parsed — **785 operation rows over 519
distinct cases** across the Report Suite source-accuracy pass (231), the Filters and Schedule
source-accuracy pass (282 = 108 + 174), the raw-markup repair (41), the label-vs-behaviour pass (9),
the expect-fail marker audit (42), the dated-provenance fixes (2), the panel-collapse additions (6),
and the earlier `full-viu-2026-08-06` sessions. The oplogs use **four different shapes**
(`cid` / `c_id` as `"C29557"` / bare lists / `{"log": [...]}`), so the extractor normalises all four.

**Result:** we changed **73 of the 75**. Untouched:
[C30314](https://shopview.testrail.io/index.php?/cases/view/30314) and
[C30326](https://shopview.testrail.io/index.php?/cases/view/30326).

---

## 4. Who set the Automated flag — and the finding that changes how the list reads

History was searched for every change to `custom_atmstatus` itself. The result is clean and
one-sided:

| Project | Automated (ours) | Flag set by a person, in history | No history entry — set at creation |
|---|---:|---|---:|
| Report Suite | 40 | **40, all by user 1 (Vladimir Tomovic), all on 2026-08-10** | 0 |
| Filters | 4 | **4, all by user 1**, 5–8 August | 0 |
| Schedule | 31 | 0 | **31** |

**So on Report Suite and Filters the flag means what the QA lead says it means: Vlad marked those
cases as automated by hand.**

**On Schedule it means nothing of the sort.** No one ever set it. Those 31 carry the flag because
our own `add_case` tooling hardcodes it — verified in our own source, not inferred:

- `build/schedule/panel-collapse-2026-08-11/tools/push.py:25` → `'custom_atmstatus': 3`
- `build/schedule/exec_sync_epic_2026-07-27.py:147` → `"custom_atmstatus": 3`
- `build/schedule/exec_sync_2026-07-22.py:144` → `"custom_atmstatus": 3`

The corroborating shape is exact: **every Schedule case with an id above 30090 (i.e. every one we
added via `add_case`) is `3`, and every imported case is `1`.** By contrast the Filters
`add_case` pass of 2026-08-06 used `custom_atmstatus 1`
(`build/filters/vlad-gap-review-2026-08-06/testrail-execution-log.md:64`), which is why Filters'
added cases are `1` and only the four Vlad touched are `3`.

**This is why `FOR-VLAD.md` splits section 1 from section 2.** Handing Vlad 19 Schedule rows as
though he were automating them would have padded the list and cost it credibility on first reading.
It is flagged to the QA lead as a question, not silently corrected — changing the field is a
TestRail write and is not authorised.

---

## 5. How "does it affect what an automated check asserts" was decided

For each case, the **net** change across the window was computed — the **earliest old value**
against the **latest new value**, per field. Net, not per-event, because several cases were edited
and then edited back (for example
[C30410](https://shopview.testrail.io/index.php?/cases/view/30410) went ready → expect-fail → ready,
which is no change at all and would have been reported as two changes by a naive reading).

Each Expected Results value was then split into three parts before comparison:

1. **the assertion body** — what the test actually checks;
2. **the Rule-61 known-failure block** (`What you should see today…`);
3. **the Rule-54 provenance line and the `AUTOMATION:` marker** at the end.

Comparison of the assertion body normalises away things that are not meaning: HTML tags, list
numbering, bullet glyphs, and whitespace. **This matters — without it the raw-markup repair reads as
an assertion change.** [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) is the
worked example: its `<ol>/<li>` markup became plain numbered text, every word identical. A first
run of the classifier flagged it as changed; it is correctly reported as formatting only.

**Counted as affecting an automated check:** the assertion body changed · the `AUTOMATION:` marker
moved between ready / expect-fail / hold · a known-failure block was added or removed · steps,
preconditions or the title changed · the case is new.

**Counted as not affecting one:** only the provenance line, only the specification version cited in
`refs`, or only formatting.

**Final tally: 27 affect an automated check, 46 do not.** Of the 27, **8** are on cases Vlad marked
himself.

**One row was corrected by hand after review:**
[C43555](https://shopview.testrail.io/index.php?/cases/view/43555) was flagged as an assertion
change, but the only difference is a specification version number inside a tester note (23 → 27) and
the case is on hold both before and after. It is reported as **no effect**, with the reason stated.

---

## 6. What would make this list incomplete — stated plainly

1. **It only covers changes made by user id 3.** If any of our work was ever written under a
   different account, it is invisible here. We have no evidence of that, but it is not proven.
2. **The QA lead works in the TestRail and Jira UI under this same account.** Any edit he made by
   hand is indistinguishable from ours in the history and will appear in this list as our change.
3. **It starts at 2026-08-06.** Changes we made to Automated cases before that date are out of
   scope. For the forty Report Suite cases the window is generous rather than tight, because Vlad
   flagged them only on **2026-08-10**. **For Filters it is not.**
   [C38877](https://shopview.testrail.io/index.php?/cases/view/38877)'s earliest history entry is
   Vlad taking it **`3 → 1` on 5 August**, which means **it was already marked Automated before our
   window opens** — so any change we made to it before 6 August is missed by this list, and we have
   not established when it was first flagged. The other three Filters cases were flagged
   `1 → 3` on 6–7 August, inside the window.
4. **The flag is read as it stands today.** A case Vlad marked Automated and later unmarked is not
   in the population — and the history shows this happens: **C29600 went `1 → 3 → 1 → 3` across
   6, 7 and 8 August**, and **C38877 went `3 → 1 → 3`**. If he unmarks a case tomorrow, a change we
   made today drops out of any list rebuilt afterwards.
5. **"Affects an automated check" is our judgement, not his.** It is a reading of the case text, not
   of Vlad's actual scripts, which we have never seen. A rewording we call cosmetic could still
   break a script that matches on the exact string. **The full change is described on every row so
   he can overrule us**, which is why the "what we changed" column is not collapsed into the verdict
   column.
6. **Two cases we did not touch are reported as untouched on the strength of an absent history
   entry.** That is the correct reading of TestRail's history, but it is an absence, not a positive
   observation.
7. **The 12 foreign Automated cases in the Report Suite group are excluded by design** (Rule 38).
   They are not ours to change and we have not changed them.

---

## 7. Reproducing it

The working scripts are throwaway and live in `/tmp/av/` (ephemeral). The method above is complete
enough to rebuild from scratch; the sequence is:

1. `get_cases` (paged) + `get_sections` (paged) → map each case to its group by **ancestor**, not root.
2. Filter `created_by == 3` and `custom_atmstatus == 3` → the population.
3. `get_history_for_case` (paged) for each → filter `user_id == 3` and `created_on >= cutoff`.
4. Net-diff first-old against last-new per field; split Expected Results into body / known-failure
   block / provenance+marker; normalise HTML, numbering and whitespace before comparing the body.
5. Cross-check the resulting case set against the committed oplogs and execution logs.
