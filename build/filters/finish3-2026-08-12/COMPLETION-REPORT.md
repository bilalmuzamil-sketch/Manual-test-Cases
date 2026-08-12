# FILTERS — COMPLETION REPORT (Standing Rule 67)

**Project:** Filters · epic **SV-8785** · PO **Branko Cicovic** · QA branch `sv8785`
**Build:** **`v3.7-20e801b`** — last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, `index.html` sha256 `157756e3…`
**Build marker read by this worker at 13:44:12Z and again at 15:13:51Z — byte-identical, so nothing
redeployed under this pass.**
**Every figure below was derived LIVE from TestRail and the running build at ~15:15Z**, not carried
from a document.
**Location for every observation:** Staging Heavy Duty - 9919 (the standing default).

---

## THE TABLE

| # | Measure | Figure | Notes |
|---|---|---|---|
| 1 | **Total cases** | **ours 115 / live 120** | The 5 others (C43576–C43580) are **Ahtasham Amjad's**. Never edited, never counted as ours, proven byte-identical over all 30 fields including `updated_on`/`updated_by` (Rule 38). |
| 2 | **Source-verified** — a per-source read-date **and** a current version pin | **115 of 115** | Every case carries Rule-54 sentence 1 naming its documents with read-dates, pinned to **spec Confluence v19 (published 6 Aug 2026)**, the current version. Unchanged by this pass. |
| 3 | **Build-verified — naming the build NOW RUNNING (`v3.7-20e801b`)** | **64** | The 64 re-stamped this pass. Each was driven step by step on this build today. |
| 3b | **Build-verified — naming an EARLIER build** | **44** | **30** name `v3.4.2-d00239b` (5 Aug), **14** name `v3.6-3e9dd6d` (11 Aug). Under Rule 60 that is the **ordinary** consequence of a branch that keeps redeploying, not a defect: the stamp is an honest record of when the case was last checked. |
| 3c | **Carrying no build line at all** | **7** | They say in their own text that they have not been checked against any build. Also what Rule 60 requires. |
| 4 | **Steps and preconditions ACTUALLY WALKED on a build — every step verified** | **86 of 115** | **65 in this pass**, 22 in the two earlier passes, union 86. **This is the smaller and more honest number, and it is the one that answers "can a tester pick this up tomorrow and run it?"** |
| 4b | **Part-walked, with the remainder named per case** | **9** | Not folded into the 86. An unverified step is an unverified case. |
| 5 | **Runnable vs held** — live marker census | **90 `READY` · 7 `READY - EXPECT FAIL` · 18 `HOLD` = 115** | **The gate closes both ways: 90 + 7 = 97, and 115 − 18 = 97.** Read back from the live cases, not computed from notes. **No marker was changed by this pass.** |
| 6 | **Created / updated / deleted** | **0 created · 64 updated · 0 deleted** | 64 × `update_case`, all HTTP 200, byte-verified over 28 fields each, 0 collateral changes. 0 `add_section`, 0 run writes, 0 results, 0 Jira creations. |
| 7 | **What is left** | **29 cases** | Itemised below, each with what it is waiting on and who can clear it. |

**Column 3 + 3b + 3c = 64 + 44 + 7 = 115.** ✓
**Column 4 + the 29 remaining = 86 + 29 = 115.** ✓

### Why columns 3 and 4 are different numbers, deliberately

**"Build-verified" means the case's labels and stamp were checked against a build. "Steps walked"
means a tester could actually execute it** — every precondition reachable, every navigation path
present, every named control where the step says it is, the order workable, the labels the ones on
screen. The second is always the smaller claim, and it is the one that matters tomorrow.

### What this suite may and may not be called

**Not "VIU complete".** The accurate description, since the behaviour verdict became the manual
tester's (Rule 10, 2026-08-11):

> **86 of the 115 cases are source-verified and build-accurate in their preconditions, steps,
> navigation and labels, against build `v3.7-20e801b`. The behaviour verdict belongs to the tester —
> and that is by design.**

---

## 7 · WHAT IS LEFT — 29 CASES, ITEMISED

### (a) Waiting on Branko's Parts and Reports product write-up — **10 cases** · *Branko clears this*
[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) ·
[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) ·
[C38905](https://shopview.testrail.io/index.php?/cases/view/38905) ·
[C38906](https://shopview.testrail.io/index.php?/cases/view/38906) ·
[C38907](https://shopview.testrail.io/index.php?/cases/view/38907) ·
[C38908](https://shopview.testrail.io/index.php?/cases/view/38908) ·
[C38909](https://shopview.testrail.io/index.php?/cases/view/38909) ·
[C38910](https://shopview.testrail.io/index.php?/cases/view/38910) ·
[C38911](https://shopview.testrail.io/index.php?/cases/view/38911) ·
[C43562](https://shopview.testrail.io/index.php?/cases/view/43562)
**The filter bars ARE built on some of those pages; nothing documents what they should do.** This same
gap is why the C29603 coverage hole cannot be authored (§ below). **Outstanding since 27 July.**

### (b) Waiting on Branko to confirm the Status-chip ruling — **4 cases** · *Branko clears this*
[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) ·
[C29609](https://shopview.testrail.io/index.php?/cases/view/29609) ·
[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) ·
[C29612](https://shopview.testrail.io/index.php?/cases/view/29612)

### (c) Held for reasons already recorded on the case — **4 cases**
[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) (the QA lead's own ruling) ·
[C38881](https://shopview.testrail.io/index.php?/cases/view/38881) (needs an account whose filters
were saved before the redesign) ·
[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) (needs the page-search rollout
finished; owed as **one pass over all 42 surface names**, two of which are known wrong) ·
[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) (only half of it can be run — the
report pages have no page search)

### (d) Ordinary tester work, barred for us — **2 cases** · *a tester with admin rights clears this*
[C29581](https://shopview.testrail.io/index.php?/cases/view/29581) ·
[C29588](https://shopview.testrail.io/index.php?/cases/view/29588)
Both need a **staff record deactivated**. Such an edit **destroys the session of every holder** — that
is how the Schedule technician login was lost earlier today — so it was not attempted. **These are
runnable; they are simply not runnable by us.**

### (e) Blocked on a precondition the branch cannot produce — **1 case** · *the QA lead clears this*
[C38876](https://shopview.testrail.io/index.php?/cases/view/38876) — needs an account that has never
opened the redesigned page. Both sign-ins carry saved state, and
`DELETE /api/users/me/preferences/work-orders-list` returns **HTTP 405**. **A substantive divergence,
raised, with the case left untouched** (`DIVERGENCES.md` §5).

### (f) Part-walked — the honest remainder is named per case — **8 cases**
| Case | What is left |
|---|---|
| [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | a customer name long enough to **overflow** the dropdown panel (84 chars still fits) |
| [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | the plural half — *"the others keep their tags"* — with 2+ selected |
| [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | cannot be produced from this filter alone on this data |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | steps 5–6: **a different physical computer**, which cannot be produced here |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | step 3 — applying a name from the technician/advisor list |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | steps 2 and 5 — sorting/paging, and closing the whole browser |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | steps 5–6 (expectations 1 and 2 **are** now proven) |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | step 4's **second** Technician Efficiency view tab |

*(C29568, C29569, C29594, C29614, C29626, C38886, C43560, C43561 = 8; C38876 is counted at (e).)*

**10 + 4 + 4 + 2 + 1 + 8 = 29.** ✓

---

## OUTSTANDING — WHAT I NEED FROM YOU

1. **Branko's Parts and Reports product write-up.** Blocks **10 cases** outright and blocks the
   **C29603 coverage gap** from being authored at all. **Outstanding since 27 July** — the single
   biggest thing holding this suite back.
2. **Branko's Status-chip confirmation.** Blocks **4 cases**.
3. **A ruling on [C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** — either a third
   sign-in that has never opened the redesigned Work Orders page, or your decision that the case
   becomes `AUTOMATION: HOLD`. **We did not change its marker ourselves**, because that would quietly
   remove a case from the automatable count.
4. **A ticket for [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** the moment the
   creation hold lifts. **Re-confirmed on this build with all four steps driven**; it is still the
   project's only unticketed real deviation. Ready-to-file text is prepared and **nothing was filed**.
5. **Your call on [C29625](https://shopview.testrail.io/index.php?/cases/view/29625)'s expect-fail
   note**, which describes the wrong sheet. Proposed replacement wording is in `CHANGES-MADE.md`;
   **not applied**, because rewriting an expect-fail note hours before release could disarm a real
   signal.
6. **One line of authorised text repair for
   [C29621](https://shopview.testrail.io/index.php?/cases/view/29621)** — its provenance paragraph ends
   without a full stop, so the writer's guard refused to append a build sentence rather than invent
   punctuation in a tester-facing field. The case itself was walked and passes.
7. **Whether [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) and
   [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) go to the tester** — they need a
   staff deactivation we are barred from doing.

**Nothing else is outstanding from you.** The sessions worked, the branch was reachable throughout, and
the build did not move under the pass.

---

## HONEST LIMITS OF THIS REPORT

* **86 of 115 walked, not 115.** The 29 are itemised above rather than covered by a caveat.
* **The behaviour verdict is not ours** (Rule 10 as amended). Where the build disagreed with a case we
  **left the case asserting its source so the tester fails it** — C38897, C29623, C29616, C29619 and
  C29624 are all in that position deliberately, and a hold on a working case would disarm it.
* **The tester is working this suite live.** At 13:46Z run 352 read 81 Passed / 8 Failed / 1 Blocked /
  30 Untested. **Run 352 was proven untouched by content** — 120 tests, 645 results all present by id,
  0 graded fields changed, `include_all` still false, and **0 new results during our write window**.
* **One alarming observation was traced to our own doing and is NOT reported as a defect:** a direct
  `PUT` of an invalid status value into the saved preference stopped the SPA saving filter changes;
  restoring a valid preference fixed it immediately. Full account in `CHANGES-MADE.md` — it would have
  been a bogus defect on precisely the ground where the real persistence tickets live.
