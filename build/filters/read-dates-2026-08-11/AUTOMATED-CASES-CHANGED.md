# Filters — AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65) — 2026-08-11

**Not "none". Four of the cases this pass wrote carry TestRail's own Automated flag.**

The QA lead's rule, verbatim: *"when we change any test case which has the testrail OWN automated
marker we have to update Vlad who does the automation so that he can adjust accordingly his
automation with our updates/delete of test cases."*

**Which flag this is:** TestRail's own field **`custom_atmstatus`**, where **3 = Automated** — **not**
our `AUTOMATION:` text marker at the end of Expected Results, which is a different thing and answers a
different question (Rule 64, settled 2026-08-11).

**How the four were identified, and why they can be trusted:** `custom_atmstatus` was read from every
case at pass start (**4 of our 114 at `3`, the other 110 at `1`**) and again **at write time, per
case**, from the post-write `get_case` body — recorded in the `atm at write` column of
`testrail-execution-log.md`, because the flag genuinely moves both ways — see the history below — so
reading it afterwards can give a different answer from the truth at the moment of the write.

**`get_history_for_case` was read on all four, and EVERY `Automation status` change on all four was
made by `user_id = 1` — Vladimir Tomovic — by hand.** Not one is an artefact of our own `add_case`
tooling, unlike the 31 Schedule cases corrected earlier today. **So all four belong on this list.**
Evidence: `evidence/atmstatus-history.json`; the seven change records are:

| Case | When (UTC) | Change | By |
|---|---|---|---|
| C29600 | 2026-08-06 11:30 | Not Automated → **Automated** | user 1 |
| C29600 | 2026-08-07 07:30 | Automated → Not Automated | user 1 |
| C29600 | 2026-08-08 11:12 | Not Automated → **Automated** | user 1 |
| C29614 | 2026-08-06 11:30 | Not Automated → **Automated** | user 1 |
| C29623 | 2026-08-07 07:30 | Not Automated → **Automated** | user 1 |
| C38877 | 2026-08-05 13:08 | Automated → Not Automated | user 1 |
| C38877 | 2026-08-06 11:30 | Not Automated → **Automated** | user 1 |

---

## The four, and whether the change matters to automation

| Case | Title | What changed, in one plain phrase | Does it change what an automated check should conclude? |
|---|---|---|---|
| **[C29600](https://shopview.testrail.io/index.php?/cases/view/29600)** | Status and Customer filters together show only work orders matching both | A read-date was added after the story it cites (its specification and technical-design citations were already dated). | **No.** |
| **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614)** | Filters are remembered permanently, even after closing the browser | Read-dates were added after the epic and after the specification citation. | **No.** |
| **[C29623](https://shopview.testrail.io/index.php?/cases/view/29623)** | Mobile: tapping Apply filters applies the statuses and updates the count | Read-dates were added after the epic and after the specification citation. | **No.** |
| **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877)** | Imported works alone: picking it greys out the other filters | Read-dates were added after the epic and after the specification citation. | **No.** |

## Why the answer is "no" on all four — and what would make it "yes"

The **only** text added anywhere is the phrase **", read on 11 August 2026"**, inserted inside the
provenance sentence at the end of Expected Results. Proven mechanically, not asserted: a
character-level opcode diff of the old and new provenance blocks on all 114 cases returned **0
non-insert edits**, and the inserted strings are that one phrase and nothing else.

Specifically, on all four:

* the **title** is unchanged;
* the **preconditions** and **steps** are unchanged — nothing a script navigates, clicks or types has moved;
* the **assertion** in Expected Results is unchanged — nothing a script checks has moved;
* the **`AUTOMATION:` marker** is unchanged, and all four read plain **`AUTOMATION: READY`** before
  and after — so none of them moved between ready / expect-fail / hold, which is the change that
  *would* matter;
* **`refs` was never sent** on any payload and is byte-identical afterwards;
* **`custom_atmstatus` itself was not written** — it reads `3` before and `3` after on all four.

**Our judgement, and it is ours to be overruled:** we have never seen Vlad's scripts. If any of them
matches on the exact text of the Expected Results field rather than on the assertion, the added phrase
would show up as a diff. That is why the full change is stated above rather than only our verdict.

## The 110 that are NOT on this list

The other 110 cases we wrote read `custom_atmstatus = 1` (Not Automated) at write time and are
therefore **not Vlad's to adjust**. The 5 cases under the Filters group authored by Ahtasham Amjad
(**C43576–C43580**) carry `custom_atmstatus` **null**, were **never touched**, and were proven
byte-identical afterwards including `updated_on` and `updated_by` (Rule 38).

## Nothing was deleted

**0 `delete_case` calls.** Rule 64's deletion path was not exercised at all in this pass, so there is
no removal for Vlad to absorb — only the wording addition described above.
