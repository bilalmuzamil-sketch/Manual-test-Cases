# THE FOUR ALREADY-HELD CASES — WHY EACH IS HELD, ESTABLISHED FROM LIVE DATA

**The question:** each of these four carries an `AUTOMATION: HOLD` with a reason written on it.
Is that reason **a runnability reason** (a tester genuinely cannot run the case) or **a filing
reason** (a decision, a ruling, a preference)? **A hold on a runnable case disarms it** — the case
stops being run and nobody notices.

**Method:** every reason below was checked **against the live build**, not quoted from the case's
own text. Standing Rule 68 governs: a blocker must be **proved**, and it blocks **only what it
actually blocks**.

**Build:** `v3.7-20e801b`, read 17:49:08Z. **Location:** Staging Heavy Duty - 9919.
**Evidence:** `evidence/probeR3.json`, `evidence/probeS4.json`, `evidence/probeS5.json`.
**None of the four was written to.**

---

## THE ANSWER IN ONE TABLE

| Case | Stated reason | Is it a runnability reason? | Verdict |
|---|---|---|---|
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | *"held for the QA lead's ruling only — the behaviour IS documented"* | **NO — it is a filing reason** | 🔴 **The case is RUNNABLE and the hold disarms it** |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | needs an account whose filters were saved **before** the redesign | **YES** | ✅ Hold correct, and now evidence-backed |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | its own precondition needs the page-search rollout **finished everywhere** | **YES** | ✅ Hold correct, and now proved rather than asserted |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | *"the report pages have no page search box yet"* | **YES — but the reason as written is too broad** | ⚠️ Hold stands; **the reason needs correcting** |

---

## 1 · C38880 — "Each page and tab remembers its own filters separately"

### 🔴 This is a hold on a runnable case, and its own marker admits it

The marker reads, verbatim:

> `AUTOMATION: HOLD - held for the QA lead's ruling only - the behaviour IS documented (S10-R4 says
> each Parts view and each Report tab keeps its own separate filter set and each persists
> independently), so the earlier reas…`

**The case says the behaviour is documented. That is not a reason a tester cannot run it — it is a
note that somebody once wanted a decision.**

### And it does run. All four steps, driven live

Its precondition 2 requires the new filter bar to have reached **the Parts views** *and* **a report
that has tabs**. Both are true on this build:

| Step | What happened |
|---|---|
| 1 · apply a filter on one Parts view | Inventory, `Supply` chip → applied |
| 2 · switch to a different Parts view | Purchase Orders reached (it carries no filter bar of its own) |
| 3 · return to the first Parts view | Inventory reached again, chips read back |
| 4 · **a report with tabs: filter one tab, switch, switch back** | **Technician Efficiency** — tabs **INVOICED** (active) and **COMPLETED**, plus a `Date` chip. `Last year` picked from the panel → **`?range=last_year`**, chip `Date : Last year`. Switched to Completed — **switch verified by `aria-selected`** — chip still `Date : Last year`. Switched back — chip still `Date : Last year`. |

**Step 4 was the one that looked impossible, and it is the one that runs.** A report with **both**
tabs and a filter bar exists; nobody had looked for one.

**⚠️ It took two attempts to establish this, and the first was our own fault** — an active-tab test
matching `/active/` anywhere in the class string called every tab active, so the "other" tab clicked
was the one already showing and nothing moved. That run is kept in `evidence/probeS4.json` as the
record of a check that could not fail.

### What we are NOT doing

**The hold is not lifted.** The brief bars it, and lifting a marker is a judgement about
automation-readiness that belongs to the QA lead. **What is reported is that the reason on the case
is administrative, not a blocker** — and that a runnable case sitting on `HOLD` is a case that does
not get run.

**The one thing that would clear it: the QA lead's word.** Nothing about the build stands in the way.

---

## 2 · C38881 — "Filters saved before the redesign carry over after the update"

### The hold is correct, for a genuine runnability reason

Its precondition 1 requires *"the account was used on the OLD Work Orders page with choices saved
there … **BEFORE the redesign was installed**"*.

**The redesign is installed on this branch.** The old page does not exist to save anything from, and
no account anywhere holds a pre-redesign preference — the preference this branch stores is already
in the new shape (`{tab, sortBy, columns, filters, collapsed, descending}`, read live).

**Checked for self-serviceability first (Rule 68):** this is **not** a data state that seeding can
produce. It is a **historical** state — it needed to exist before a deploy that has already
happened. Writing a hand-made "old-shape" preference would not reproduce it; it would only test our
own fabrication, and a preference written by hand has already once disabled saving on this branch
altogether.

**Verdict: genuinely unrunnable. The hold is right.**
**What would clear it: nothing we can do. Only an account that genuinely predates the redesign** —
which is a question for the QA lead about whether this case should exist at all now that the
migration window has closed.

---

## 3 · C38891 — "Every list page keeps its own search box (Parts, Reports, detail tabs)"

### The hold is correct — and it is now proved rather than asserted

Its precondition 2 requires *"The page-search rollout has finished everywhere (run this sweep at the
end of the rollout, not part-way through)"*.

**Measured across ten Reports views:**

| Page search present | Page search **absent** |
|---|---|
| Sales Tax · IBS Batches | Timesheet Activities · Sales · Shop Efficiency · Notes · Reminders · A/R Aging Detail · Technician Efficiency · Advisor Analysis |

**Eight of ten report views have no page search box.** All seven Parts views do. **So the rollout is
demonstrably part-way through, which is exactly the state the precondition tells the tester to wait
out.**

**Verdict: hold correct, runnability reason, and it now rests on a measurement instead of a
sentence.**
**What would clear it: the page-search rollout finishing** — engineering's, not ours.

---

## 4 · C38901 — "Each Report tab and each Parts view keeps its own separate search"

### The hold stands — but the reason written on the case is wider than the truth

The marker says *"only half of it can be run — **the report pages have no page search box yet**, so
the report-tab half cannot be tested"*.

**That sentence is not true of every report page.** **IBS Batches has both** — three tabs
(**READY TO SEND** · **SENT** · **PAYMENTS**) **and** a page search. Driven live:

| | Result |
|---|---|
| Search `a` on the first tab | `?search=a`, **6 rows → 5** — the search genuinely applied |
| Switch to **Sent** (switch verified by `aria-selected`) | 2 rows, address still `?search=a` |
| Page search on that tab | **absent** |
| Back on the first tab | address still `?search=a` |

### So the exception exists, and it does not clear the block

The case's step 4 asks the tester to *"search on one tab, then switch to another tab of the same
report"*. **On the only report that has a search box and tabs, the search box exists on the first
tab only** — so there is nothing to compare it against, and the *"each tab keeps its own separate
search"* behaviour still cannot be exercised.

**Verdict: the hold stands on a runnability reason. The stated reason should read "no report page
offers a page search box on more than one of its tabs" rather than "the report pages have no page
search box".**

**Recommended, not applied** — it is an expected-results edit on a held case on release eve, and
`DIVERGENCES.md` §6 carries the exact wording.
**What would clear it: the page-search rollout reaching the other report tabs.**

---

## 5 · THE POINT OF THIS FILE

Three of the four holds are sound and are now **evidence-backed instead of self-quoted** — which
matters, because a hold that only cites its own text is indistinguishable from a hold nobody has
re-checked since it was written.

**One of the four is not a runnability hold at all.** C38880 runs today, on this build, end to end,
and it has been sitting on `HOLD` waiting for a decision that its own marker says was already made
in the specification. **That is precisely the failure Standing Rule 68 was written for, one week
after it was written**, and it is the QA lead's single-word call to clear.
