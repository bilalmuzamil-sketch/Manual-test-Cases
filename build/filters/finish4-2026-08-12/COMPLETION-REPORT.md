# FILTERS — COMPLETION REPORT (Standing Rule 67)

**Project:** Filters · epic **SV-8785** · PO **Branko Cicovic** · QA branch `sv8785`
**Build:** **`v3.7-20e801b`** — `index.html` last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e3…`
**Marker read by this worker at 15:30:10Z and again at 16:07:04Z immediately before the writes —
byte-identical, so nothing redeployed under this pass.**
**Every figure below was derived LIVE from TestRail and the running build. Census read at
2026-08-12T16:15:12Z.** Nothing is carried from a document.
**Location for every observation:** Staging Heavy Duty - 9919 (the standing default).

---

## THE TABLE

| # | Measure | Figure | Notes |
|---|---|---|---|
| 1 | **Total cases** | **ours 115 / live 120** | The other 5 (C43576–C43580) are **Ahtasham Amjad's**. Never edited, never counted as ours, proven byte-identical over every field including `updated_on`/`updated_by` (Rule 38). |
| 2 | **Source-verified** — a per-source read-date **and** a current version pin | **115 of 115** | Every case carries Rule-54 sentence 1 naming its documents with read-dates, pinned to **spec Confluence v19 (published 6 Aug 2026)**, the current version. Measured live, both conditions together. Unchanged by this pass. |
| 3 | **Build-verified — naming the build NOW RUNNING (`v3.7-20e801b`)** | **70** | Was 64. **+6, exactly this pass's writes.** |
| 3b | **Build-verified — naming an EARLIER build** | **38** | **26** name `v3.4.2-d00239b` (5 Aug), **12** name `v3.6-3e9dd6d` (11 Aug). Under Rule 60 that is the **ordinary** consequence of a branch that keeps redeploying, not a defect — the stamp is an honest record of when the case was last checked. |
| 3c | **Carrying no build line at all** | **7** | 5 have no line; **2 say in their own words that they have not been checked against any build** — one of those is C43560, left that way deliberately. Also what Rule 60 requires. |
| 4 | **Steps and preconditions ACTUALLY WALKED on a build — every step verified** | **92 of 115** | **6 closed in this pass**, 86 from earlier passes, **union by case id**. **This is the smaller and more honest number, and it is the one that answers "can a tester pick this up tomorrow and run it?"** |
| 4b | **Part-walked, remainder named per case** | **2** | C29614 and C43560 — **not** folded into the 92. An unverified step is an unverified case. |
| 5 | **Runnable vs held** — live marker census | **90 `READY` · 7 `READY - EXPECT FAIL` · 18 `HOLD` = 115** | **The gate closes both ways: 90 + 7 = 97, and 115 − 18 = 97.** Read back from the live cases. **No marker was changed by this pass.** |
| 6 | **Created / updated / deleted** | **0 created · 6 updated · 0 deleted** | 6 × `update_case`, all HTTP 200, byte-verified over 28 fields each, **0 collateral changes**. 0 add_section, 0 run writes, 0 results, 0 Jira creations. |
| 7 | **What is left** | **23 cases** | Itemised below, each with what it waits on and who can clear it. |

**Column 3 + 3b + 3c = 70 + 38 + 7 = 115.** ✓
**Column 4 + what is left = 92 + 23 = 115.** ✓

### Why columns 3 and 4 are different numbers, deliberately

**"Build-verified" means the case's labels and stamp were checked against a build. "Steps walked"
means a tester could actually execute it** — every precondition reachable, every navigation path
present, every named control where the step says it is, the order workable, the labels the ones on
screen. **The second is always the smaller claim and it is the one that matters tomorrow.**

### What this suite may and may not be called

**Not "VIU complete".** Since the behaviour verdict became the manual tester's (Rule 10, amended
2026-08-11):

> **92 of the 115 cases are source-verified and build-accurate in their preconditions, steps,
> navigation and labels, against build `v3.7-20e801b`. The behaviour verdict belongs to the
> tester — and that is by design.**

---

## THIS PASS IN ONE PARAGRAPH

finish3 left **8 part-walked** cases with the exact remainder named on each. **6 are now closed**
(C29568, C29569, C29594, C29626, C38886, C43561), taking the walked union **86 → 92**. **2 could
not be closed, and they fail for the same reason** — both depend on a saved filter being **restored
when the page loads**, and that behaviour is now genuinely in question (§ below). **Two of finish3's
"cannot be produced" verdicts turned out to be producible by the route the cases' own text
sanctions**, and **five apparent product faults during this pass were traced to our own harness**
and are reported as ours rather than as findings.

---

## 7 · WHAT IS LEFT — 23 CASES, ITEMISED

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
**The filter bars ARE built on some of those pages; nothing documents what they should do.**
**Outstanding since 27 July** — still the single biggest thing holding this suite back.

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
finished) ·
[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) (only half can be run — the
report pages have no page search)

### (d) Ordinary tester work, barred for us — **2 cases** · *a tester with admin rights clears this*
[C29581](https://shopview.testrail.io/index.php?/cases/view/29581) ·
[C29588](https://shopview.testrail.io/index.php?/cases/view/29588)
Both need a **staff record deactivated**, which **destroys the session of every holder** — barred by
the brief. **These are runnable; they are simply not runnable by us.**

### (e) Blocked on a precondition the branch cannot produce — **1 case** · *the QA lead clears this*
[C38876](https://shopview.testrail.io/index.php?/cases/view/38876) — needs an account that has never
opened the redesigned page. `DELETE` on the page preference returns **HTTP 405**. Already raised by
finish3; untouched here.

### (f) 🔴 Blocked on the filter-restore question — **2 cases** · *one 15-minute re-run clears this*
| Case | What is left |
|---|---|
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | step 6 — a different browser profile. The profile route **is** producible (the case's own alternative); what stopped it is that **the saved filter did not come back**. Also carries `custom_atmstatus = 3` (Vlad's flag). |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | steps 5–6. **Our own step-2 implementation was wrong** (Browser B was never reloaded, so "clear Approved" *added* it); underneath that, step 4 failed on the same restore question. |

**10 + 4 + 4 + 2 + 1 + 2 = 23.** ✓

---

## 🔴 THE ONE THING THAT MATTERS MOST

**A saved filter appears not to be restored when the page loads — and it is NOT ESTABLISHED, because
it contradicts finish3 on this same build.**

The app **saves** the filter itself (its own `PUT` → 200) and a fresh profile **fetches it itself**
(`GET` → 200), yet the chip shows no value at 6 s, 12 s, 18 s, 25 s **or after a further reload**,
while the stored value stays `{"status":["declined"]}`. finish3 recorded the opposite outcome for the
equivalent step. **Filter persistence is where SV-8871 and SV-8905 live, this pass already produced
one false alarm on exactly this ground, and it is the evening before a release — so it is reported,
not filed.** Full evidence with both observations quoted side by side, and the four-step re-run that
would settle it: **`DIVERGENCES.md` §3**.

---

## OUTSTANDING — WHAT I NEED FROM YOU

1. **A 15-minute re-run to settle the filter-restore question** (`DIVERGENCES.md` §3), or your
   decision to accept our negative. **It blocks C29614 and C43560, and if confirmed it is a real
   defect against S10-R1/S10-R2 that needs a ticket the moment the creation hold lifts.**
2. **Branko's Parts and Reports product write-up.** Blocks **10 cases**. Outstanding since 27 July.
3. **Branko's Status-chip confirmation.** Blocks **4 cases**.
4. **Your call on [C29568](https://shopview.testrail.io/index.php?/cases/view/29568)'s expectation 3**
   — it asserts an ellipsis on customer tags that **no requirement supports** and that the build does
   not do (the *bar chip* ellipsises; the tag does not). Left as it stands, a tester will fail a
   spec-compliant build. **Recommended wording is ready; not applied**, because it is an expectation
   edit on release eve. `DIVERGENCES.md` §1.
5. **A ticket for [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** when the
   creation hold lifts — still the project's only unticketed real deviation, still prepared and
   unfiled.
6. **A ruling on [C38876](https://shopview.testrail.io/index.php?/cases/view/38876)** — either a
   never-used sign-in or your decision that it becomes `AUTOMATION: HOLD`.
7. **Whether [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) and
   [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) go to the tester** — they need
   a staff deactivation we are barred from doing.
8. **Optional:** whether C38886's expectation 1 should say *"moving further through the results"*
   rather than *"paging"*, now that its step says scroll. Cosmetic; raised for completeness.

**Nothing else is outstanding from you.** Both sign-ins worked, the branch was reachable throughout,
and the build did not move under the pass.

---

## HONEST LIMITS OF THIS REPORT

* **92 of 115 walked, not 115.** The 23 are itemised above rather than covered by a caveat.
* **The behaviour verdict is not ours** (Rule 10 as amended). Where the build disagreed with a case
  we **left the case asserting its source so the tester fails it**.
* **Five apparent product faults in this pass were our own harness** and are named as such in
  `RUNNABILITY.md` §4 rather than quietly dropped: a wrong chip id, a wrong API field name, a
  tick-count taken with a search filter still applied, a virtual-scroll row count misread as "no
  more results", and a preference scare caused by state a previous probe left behind.
* **Two of finish3's "cannot be produced" verdicts were producible** by the route the cases' own
  preconditions sanction. That is a caution about *our* verdicts, not theirs alone: **"cannot be
  produced" deserves the same rule-out discipline as "the build is broken".**
* **The tester is grading run 352 live.** It was proven untouched **by content** — 120 tests, id sets
  equal both ways, all 645 results present by id, 0 graded-field changes, 0 new results during the
  write window.
