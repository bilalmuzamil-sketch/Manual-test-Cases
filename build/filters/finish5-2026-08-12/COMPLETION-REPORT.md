# FILTERS — COMPLETION REPORT (Standing Rule 67)

**Project:** Filters · epic **SV-8785** · PO **Branko Cicovic** · QA branch `sv8785`
**Build:** **`v3.7-20e801b`** — `index.html` last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e3…`. **Read by this worker at 17:49:08Z**, the
same marker finish4 recorded, so **nothing redeployed between the two passes or under this one.**
**Location for every observation:** Staging Heavy Duty - 9919 (the standing default).
**Identities:** `admin@shopview.com` (42 permissions, `view_mode: full`, `/api/staff` 200) and the
technician `bilal.muzamil+filters@shopview.com` (6 permissions, `view_mode: tech`, `/api/staff` 403)
— **confirmed distinct before use**, separate cookie jars and browser contexts, `quick-login` and
`switch-user` never called.

**Every figure below was derived LIVE from TestRail and the running build. Census read at
`2026-08-12T18:34:29Z`, after the last write.** Nothing is carried from a document.

---

## THE TABLE

| # | Measure | Figure | Notes |
|---|---|---|---|
| 1 | **Total cases** | **ours 115 / live 120** | The other 5 (C43576–C43580) are **Ahtasham Amjad's**. Never edited, never counted as ours, proven byte-identical over every field **including `updated_on`/`updated_by`** across this pass's writes (Rule 38). |
| 2 | **Source-verified** — a per-source read-date **and** a current version pin | **115 of 115** | Measured live, **both conditions together**: 115 carry Rule-54 sentence 1 with `read on <date>` per source, and 115 pin **spec Confluence v19 (published 6 Aug 2026)**, still the current version. Unchanged by this pass. |
| 3 | **Build-verified — naming the build NOW RUNNING (`v3.7-20e801b`)** | **74** | Was 70. **+4, exactly this pass's four writes.** |
| 3b | **Build-verified — naming an EARLIER build** | **35** | **23** name `v3.4.2-d00239b` (5 Aug), **12** name `v3.6-3e9dd6d` (11 Aug). **These are NOT owed work.** Under Rule 60's 2026-08-12 amendment a bug-fix-only deploy does not make a prior pass stale, so these stamps are honest records of a real check, not a shortfall. |
| 3c | **Carrying no build line at all** | **6** | Was 7 — C43560 gained one. Each says in its own text that it has not been checked against any build, which is what Rule 60 requires. |
| 4 | **Steps and preconditions ACTUALLY WALKED on a build — every step verified** | **108 of 115** | **Was 92. +16 this pass**, as a **union by case id**. **This is the smaller and more honest number, and it is the one that answers "can a tester pick this up tomorrow and run it?"** |
| 5 | **Runnable vs held** — live marker census | **90 `READY` · 7 `READY - EXPECT FAIL` · 18 `HOLD` = 115** | **The gate closes both ways: 90 + 7 = 97, and 115 − 18 = 97.** Read back from the live cases. **No marker was changed by this pass.** |
| 6 | **Created / updated / deleted** | **0 created · 4 updated · 0 deleted** | 4 × `update_case`, all HTTP 200, **28 fields byte-compared each, 0 collateral**. 0 add_section, 0 run writes, 0 results, **0 Jira creations**. |
| 7 | **What is left** | **7 cases** | Itemised below, each with what it waits on and who can clear it. |

**Column 3 + 3b + 3c = 74 + 35 + 6 = 115.** ✓
**Column 4 + what is left = 108 + 7 = 115.** ✓
**Raw markup shown to the tester: 0 of 115** (checked across all three text fields).

### Why columns 3 and 4 are different numbers, deliberately

**"Build-verified" means the case's labels and its stamp were checked against a build. "Steps
walked" means a tester could actually execute it** — every precondition reachable, every navigation
path present, every named control where the step says it is, the order workable, the labels the ones
on screen. **The second is always the smaller claim and it is the one that matters tomorrow.**

### What this suite may and may not be called

**Not "VIU complete".** Since the behaviour verdict became the manual tester's (Rule 10, amended
2026-08-11):

> **108 of the 115 cases are source-verified and build-accurate in their preconditions, steps,
> navigation and labels, against build `v3.7-20e801b`. The behaviour verdict belongs to the
> tester — and that is by design.**

---

## THIS PASS IN ONE PARAGRAPH

finish4 reported **23 cases remaining** and classified **14 of them as "waiting on Branko" and
therefore untouchable**. That was wrong, and it is the mistake Standing Rule 68 was written for.
Branko's missing write-up leaves those cases' **expected behaviour** unsourced; it says nothing
about whether a tester can execute their steps. **They were walked: 11 of the 14 are runnable
today and 3 are not** — and the 3 fail for reasons that have **nothing to do with Branko**, two of
which would have stayed invisible until a tester opened the case and stopped. Separately, **the
filter-restore contradiction is settled** (finish3 was right; restore works, and finish4's negative
came from the address its probe landed on), which closed the last two part-walked cases. **And the three cases everyone had written off as costing the session cost nothing** — two of
them run on data that already exists, and the third never needed a staff edit at all. **The walked
union moved 92 → 108.**

---

## 7 · WHAT IS LEFT — 7 CASES, ITEMISED

### (a) Genuinely unrunnable — the precondition cannot be produced by anyone here — **2 cases**

| Case | What it needs | Who clears it |
|---|---|---|
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | an account whose filters were saved **before the redesign** — a historical state, not a seedable one; the old page no longer exists | **the QA lead** — is this case still meaningful now the migration window has closed? |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | its own precondition needs the **page-search rollout finished everywhere**; measured today, **8 of 10 report views have no search box** | **engineering** — the rollout |

Both were checked for self-serviceability first. Neither is seedable. Evidence: `HOLD-REASONS.md`.

### (b) Half-runnable — the block is proved and it is narrower than the case says — **1 case**

| Case | What is left | Who clears it |
|---|---|---|
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | its **report-tab half**. IBS Batches has both tabs and a search box, but **the box is on the first tab only**, so "each tab keeps its own search" still cannot be exercised. **Its stated hold reason is too broad and needs correcting** — exact wording in `DIVERGENCES.md` §6. | **engineering** — the rollout reaching the other tabs |

### (c) 🔴 Substantive divergences — the source describes something the build does not have — **3 cases**

| Case | The divergence | Who clears it |
|---|---|---|
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | **There is no Part Type button on Parts Returns.** The tab carries `Show cores only` (Yes/No) and `Vendor`. Steps 1 and 3 cannot be performed, and the case's own "blocked" note only covers a missing **bar**, not a missing **button**. | **Branko** — is `Show cores only` the intended shape? |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Its precondition needs a **written list of the pre-redesign filters**. The old screens are gone and no such list exists. Not seedable — a historical artefact. | **the developers** (the list) or **the QA lead** (a re-scope) |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | **The "My Timesheets" report does not exist.** Absent from all 17 Reports nav items, and all five plausible routes return the app's own 404. The case's expectation 4 describes its filter bar, so the *source* believes it exists. | **Branko** — is My Timesheets in scope, and is this a build gap or a scope change? |

**All three are RAISED, not rewritten.** Rewriting a substantive divergence into a runnable step
deletes the finding — full texts, both sides quoted, in `DIVERGENCES.md`.

### (d) Blocked on a sign-in, and the blocker is now PROVED — **1 case**

| Case | What it needs | Who clears it |
|---|---|---|
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | an account that has **never opened** the redesigned Work Orders page | **the QA lead** — a third sign-in, or a ruling that the case becomes `AUTOMATION: HOLD` |

**Proved rather than asserted, this pass:** `DELETE` on the page preference returns **HTTP 405**
with the server naming its own allowed methods (**`Allow: GET, PUT`**), and the preference was
**byte-identical after the attempt**. A `PUT` can only overwrite a preference, never make it absent.
**Both available sign-ins carry one** — admin `updatedAt 2026-08-12T17:39:11Z`, technician
`2026-08-12T14:36:08Z`. **And a staff-record edit would not have helped it**: what it needs is a
*signed-in session* for a never-used account, not a new record.

**2 + 1 + 3 + 1 = 7.** ✓

---

## 🟢 THE THREE CASES THAT WERE GOING TO COST THE SESSION — AND COST NOTHING

They were scheduled last precisely because a staff-record edit destroys the session of every holder.
**No staff record was touched, because none needed to be.**

**[C29581](https://shopview.testrail.io/index.php?/cases/view/29581) and
[C29588](https://shopview.testrail.io/index.php?/cases/view/29588) now RUN.** The blocker — *"needs a
staff record deactivated"* — had stood since finish3 and **was never total**: the estate **already
holds 17 inactive staff, 9 of them Technicians and 3 Sales Representatives**. A deactivated person is
a state that already exists, not one we had to create.

| | Lead Technician filter (C29581) | Service Advisor filter (C29588) |
|---|---|---|
| Options offered | **47** | **60** |
| Active staff appearing | 5 of 22 | 6 of 22 |
| **Inactive staff appearing** | **0 of 17** | **0 of 17** |
| **CONTROL** — an active person searched by name | **found**, 2 results | **found**, 1 result |
| The deactivated person, by first name **and** by surname | **not found** | **not found** |

**The control is what makes the absence a measurement**: the search box demonstrably finds an active
person, so "the deactivated technician is not in the list" is a result rather than a broken box. **An
earlier run of this could not fail** — it typed by setting `input.value`, which Vue's `v-model` never
sees, and emptied the list for the control as well as for the test. That run is kept in
`evidence/probeT1.json`.

**Honest limit:** the two people used (*Mary Higgins*, *Tony Green*) were **already** inactive, so the
**transition** the precondition describes — visible, then deactivated — was not observed by us. All
three of each case's steps ran, and creating a `ZZAUTOTEST` person and deactivating them is ordinary
work for a tester with admin rights.

**Both were re-stamped to `v3.7-20e801b`.**

---

## 🔴 THE ONE THING THAT MATTERS MOST

**C38880 is a runnable case sitting on `AUTOMATION: HOLD`, and its own marker says the hold is
administrative.** The marker reads *"held for the QA lead's ruling only — the behaviour IS
documented (S10-R4 …)"*. **All four of its steps were driven live today**, including the one that
looked impossible — step 4 needs a report with **both** tabs and a filter bar, and **Technician
Efficiency has both** (tabs INVOICED/COMPLETED, a `Date` chip; `Last year` applied →
`?range=last_year`, tab switch verified by `aria-selected`, the chip surviving both ways).

**A hold on a runnable case disarms it: the case stops being run and nobody notices.** The hold was
not lifted — that is the QA lead's call, and the brief bars it — **but it is one word from him to
clear, and nothing about the build stands in the way.**

---

## OUTSTANDING — WHAT I NEED FROM YOU

1. **One word on [C38880](https://shopview.testrail.io/index.php?/cases/view/38880)** — it runs
   today, end to end, and is held on a ruling its own marker says the specification already made.
2. **Branko's Parts and Reports product write-up.** Still blocks the **expected behaviour** of 10
   cases (their runnability is now settled). **Outstanding since 27 July** — still the single
   biggest thing holding this suite back.
3. **Branko's Status-chip confirmation.** Blocks 4 cases' expectations; **all four run.**
4. **Branko on [C38905](https://shopview.testrail.io/index.php?/cases/view/38905)** — is
   `Show cores only` the intended control, or is `Part Type / Core / Non Core` still owed?
5. **Branko on [C38909](https://shopview.testrail.io/index.php?/cases/view/38909)** — is the
   **My Timesheets** report still in scope? It does not exist on this build.
6. **The developers' before-list for [C38908](https://shopview.testrail.io/index.php?/cases/view/38908)**,
   or your decision to re-scope it against the specification instead.
7. **A third sign-in for [C38876](https://shopview.testrail.io/index.php?/cases/view/38876)**, or your ruling that it becomes `AUTOMATION: HOLD` — the blocker is now proved (DELETE 405, `Allow: GET, PUT`) and no staff edit can clear it.
8. **Your authorisation for one small edit pass** to apply the recommended step wording in
   `DIVERGENCES.md` §§1, 3, 4, 5 and 6 — deliberately not applied on release eve, and likely to be
   overtaken by Branko's write-up anyway.
9. **A ruling on [C38881](https://shopview.testrail.io/index.php?/cases/view/38881)** — it can never
   be run now the migration window has closed.
10. **A ticket for [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** when the
   creation hold lifts — still the project's only unticketed real deviation, prepared and unfiled.
   **One more candidate joins it**: a shared **report** address filters the data but its button
   shows no value (`DIVERGENCES.md` §7).

**Nothing else is outstanding from you.** Both sign-ins worked, the branch was reachable throughout,
and the build did not move under the pass.

---

## HONEST LIMITS OF THIS REPORT

* **108 of 115 walked, not 115.** The 7 are itemised above rather than covered by a caveat.
* **The behaviour verdict is not ours** (Rule 10 as amended). Where the build disagreed with a case
  we **left the case asserting its source so the tester fails it** — including the four Status-chip
  cases, where the chip is absent rather than greyed.
* **Six apparent product faults in this pass were our own harness**, and two further readings are
  reported as **INCONCLUSIVE** rather than as findings because their checks could not fail. All are
  named in `RUNNABILITY.md` §4 rather than quietly dropped — including the sixth, a filter search
  that returned nothing for the control as well as the test because it typed in a way Vue never saw.
* **Four of the cases this pass closed were closed by disproving our own previous passes**, not by
  anything the build did. Two were blocked on a restore failure that was our own landing URL; two
  were blocked on a staff edit that was never necessary. That is a caution about our verdicts:
  ***"the build is broken"* and *"this cannot be produced"* need the same rule-out discipline**, and
  the second is the easier one to get away with.
* **The precondition transition on C29581 and C29588 was not observed** — the two people used were
  already inactive. Their three steps ran; the visible-then-deactivated transition did not.
* **A previous worker was killed by a container restart mid-pass.** Everything it had measured was
  recovered from its committed evidence and from `/tmp`, and **its zero TestRail writes were proven
  by content** — all 120 cases byte-identical to the census it took at 16:41Z, `updated_on` and
  `updated_by` included.
* **The tester is grading run 352 live.** It was proven untouched **by content**, both directions,
  with all 648 results present by id and 0 graded-field changes.
