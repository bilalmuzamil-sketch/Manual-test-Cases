# AUTOMATED CASES CHANGED — FOR VLAD (Filters finish4, 2026-08-12)

**Standing Rule 65.** Any case TestRail flags as Automated that we change is reported so the
automation engineer can adjust. The marker meant is TestRail's **own field `custom_atmstatus`**
(`3` = Automated), **not** our `AUTOMATION:` text marker — the two disagree, and the field is the
one that answers the question.

`custom_atmstatus` was captured **at write time** for every case written, because the flag moves
both ways.

---

## NONE.

**All six cases written in this pass carry `custom_atmstatus = 1` (Not Automated).**

| Case | `custom_atmstatus` at write time | what changed |
|---|---|---|
| [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | 1 | provenance re-stamped |
| [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | 1 | provenance re-stamped |
| [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | 1 | provenance re-stamped |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | 1 | provenance re-stamped |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | 1 | provenance re-stamped **+ step 2 wording corrected** |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | 1 | provenance re-stamped |

**So there is nothing for Vlad from this pass.**

---

## ⚠️ ONE NEAR MISS, RECORDED BECAUSE IT WILL RECUR

**[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) carries
`custom_atmstatus = 3` — it is one of the four Filters cases Vlad flagged himself** (the others
being C29600, C29623, C38877).

**It was NOT written in this pass**, because its step 6 could not be completed. **But it was in the
planned write set until the last moment**, and had it been stamped it would have needed a note here.

**Whoever finishes C29614 owes Vlad that note** — and the change will matter to him, not merely be
cosmetic, because the case is *"Filters are remembered permanently, even after closing the
browser"* and the open question is precisely **whether a saved filter is restored on load**
(`DIVERGENCES.md` §3). **If that turns out to be a real defect, an automated check on C29614 would
start failing, and the reason would not be obvious from the case text alone.**

---

## WOULD ANY OF THIS CHANGE WHAT AN AUTOMATED CHECK SHOULD CONCLUDE?

**No — nothing in this pass.**

* The six provenance re-stamps touch only the sentence recording **which build the case was last
  checked against**. No assertion, no step, no marker.
* **C38886's step 2 correction** changes *how* a tester advances through results (scroll rather than
  a next-page click). **It could matter to an automated script that clicked a pager** — but there is
  no pager in this build to click, so any such script is already failing for that reason. Flagged
  rather than judged silently, since we have never seen the scripts.

**Every judgement above is ours and can be overruled.** The full change detail is in
`CHANGES-MADE.md` and the per-operation record in `testrail-execution-log.md`.
