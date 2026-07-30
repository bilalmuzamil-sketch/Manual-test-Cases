# Run 278 (Custom Roles) — sync decision paper

> **STATUS: DECISION PAPER ONLY. NOTHING WAS WRITTEN TO TESTRAIL.**
> Every number below was read LIVE from TestRail on **2026-07-30**, read-only
> (`get_run` / `get_tests` / `get_results_for_run` / `get_cases` / `get_sections` / `get_user`).
> No `update_run`, no `add_result`, no case writes of any kind (Standing Rule 6).
> Credentials were read from the environment (`/tmp/tr-creds.env`) and are not recorded here.

Run 278 is the **last run left out of sync** after the 2026-07-31 sync pass. Runs 352 / 357 / 359
were synced; runs 324 and 325 are HELD by the QA lead's ruling (*"For now do not do anything for
the completed test runs"*). Custom Roles is **not** a completed project, so 278 was never covered
by that ruling and still needs a decision.

---

## 1. The facts (all live-read 2026-07-30)

### The run itself

| Fact | Value |
|---|---|
| Run name | **"Custom Permissions"** (run id 278) |
| `include_all` | **false** — fixed case selection. **New cases will NEVER appear in it by themselves.** |
| Created | **2026-06-18**, by TestRail user id **1 = Vladimir Tomovic** (not us; we are user id 3) |
| Run state | **OPEN** (`is_completed = false`, never closed) |
| Tests in the run | **746** |
| Last result logged | **2026-07-14** (16 days ago) — every one of the 3,537 result records was written by user id **1 (Vladimir Tomovic)** |
| First result logged | 2026-06-18 |

### How much of it is actually done

**The run is NOT finished.** This is the single most important fact in this paper.

| Current test status | Count |
|---|---|
| Passed | **574** |
| Failed | **98** |
| Blocked | **9** |
| **Untested** | **65** |
| **Total** | **746** |

So **681 of 746 tests carry a result and 65 are still Untested — the run stands at 91.3% executed,
not 100%.**

Separately, the run holds **3,537 result *records*** in its history (**3,521 of them graded**:
2,921 Passed / 527 Failed / 73 Blocked, plus 16 Untested/reset records). A test can carry several
records over time, which is why the history count is far larger than the test count. **That
history is what a bad write would destroy.**

### Our cases vs the run

The Custom Roles group in TestRail is section **3527** (with all its subsections).

| Fact | Value |
|---|---|
| Cases live in the Custom Roles group | **755** |
| — created under our account (user id 3, Bilal Muzamil) | **554** |
| — created under user id 1 (Vladimir Tomovic) | **201** |
| Cases in run 278 | **746** |
| Active cases **missing** from the run | **9** |
| Stale case ids in the run (cases that no longer exist) | **0** — so the sync is **add-only** |

**Honesty note on that 554 / 201 split (Rule 38).** For Custom Roles the "who created it" field is
**not** a clean ownership signal, unlike Report Suite. The Custom Roles suite **pre-dates our work
on it** — it was created in TestRail under Vladimir's account, and we then did the 2026-07-13
build-accurate wording + VIU pass over 254 of those cases. Many user-1 cases carry **our** naming
convention and **our** `refs` format (e.g. `CR-C2-001 … SV-7388`) and show **`updated_by = 3`**,
i.e. we edited them. Two of them (C27873, C29435) are in our own local July-13 case snapshot.
So: **"ours 554 / live total 755"** is the honest way to report the counts, but do not read the
201 as "someone else's project" — a large part of it is content we maintain that was simply
created under another account. Custom Roles has **no `testrail-id-map.csv`**, so there is no
internal-ID↔C-id map to check this against; the created-by field is all we have.

### The 9 missing cases — and who authored them

**Only 3 of the 9 are ours.** The other 6 were created under user id 1 (Vladimir Tomovic).

| # | Internal ID | C-id | Link | Section | Created by | Title |
|---|---|---|---|---|---|---|
| 1 | **CR-REG-01** | **C38843** | https://shopview.testrail.io/index.php?/cases/view/38843 | Parts Department Permissions | **3 (ours)** | Vendors page opens without the Reports permission |
| 2 | **CR-REG-02** | **C38844** | https://shopview.testrail.io/index.php?/cases/view/38844 | Customer Management Permissions | **3 (ours)** | Customer detail page loads for AP/AR role (Fees & Discounts on) |
| 3 | **CR-REG-03** | **C38845** | https://shopview.testrail.io/index.php?/cases/view/38845 | Work Order Lines Permissions | **3 (ours)** | Return part & resolve cores allowed with Work Orders: View |
| 4 | *(none — not ours)* | C29469 | https://shopview.testrail.io/index.php?/cases/view/29469 | Digital Inspections – Per-Role Access Checks | 1 | Custom role (WO Lines C&E on, Delete off): delete/reopen inspections on a Completed line respects the atom, not line status |
| 5 | *(none — not ours)* | C29911 | https://shopview.testrail.io/index.php?/cases/view/29911 | See Financial Data | 1 | See Financial Data OFF: the WO Fees & Discounts card is hidden entirely |
| 6 | *(none — not ours)* | C29915 | https://shopview.testrail.io/index.php?/cases/view/29915 | Parts Department Permissions | 1 | Catalog part detail deep-link is bounced for a role without Catalog & Inventory View |
| 7 | *(none — not ours)* | C30642 | https://shopview.testrail.io/index.php?/cases/view/30642 | Work Order Lines Permissions | 1 | Part row click does not open part dialog without Work Order Lines Create and Edit |
| 8 | *(none — not ours)* | C30643 | https://shopview.testrail.io/index.php?/cases/view/30643 | Manage Accounts Payable and Receivable | 1 | AP/AR-OFF vendor manager can create a vendor and view the Taxes row |
| 9 | *(none — not ours)* | C38842 | https://shopview.testrail.io/index.php?/cases/view/38842 | Page Access Toggles | 1 | Billing Portal feature flag OFF hides the Billing menu item despite page-access permission |

The 3 ours are exactly the **regression guard cases pushed on 2026-07-27** after the
post-v0.68/v0.69 release regression triage (CR-REG-01/02/03). Their `refs` are intact and
Rule-20-compliant (ticket + spec anchor): SV-8682, SV-8701, SV-8541 respectively.

**Correction to the earlier audit (worth flagging).** `RUN-SYNC-AUDIT.md` attributed cases
C29911 / C29915 / C30642 / C30643 / C38842 to *"other sessions"* — i.e. it assumed a concurrent
Claude session of ours. Live `created_by` says **user id 1 (Vladimir Tomovic)** for all five, and
`updated_by` is also 1 (we never touched them). We cannot claim them, and under **Rule 38 we must
not edit, move, or unilaterally decide anything about them** — including whether they belong in
someone else's run. That materially changes the shape of this decision (see §3).

### Are the 3 guard cases anywhere a human will run them?

Checked live across **every** Custom Roles manual/fixed run:

| Run | Name | include_all | Tests | Contains C38843/44/45? |
|---|---|---|---|---|
| 278 | Custom Permissions | false | 746 | **No** |
| 303 | SV-7388 Custom Roles — Automation (fast) | false | 124 | **No** |
| 304 | SV-7388 Custom Roles — Manual | false | 55 | **No** |
| 311 | CR - Failed and Blocked test Run - Bilal | false | 21 | **No** |
| 323 | §3646 DVI Per-Role Access Checks — automation | false | 132 | **No** |
| 370 | Nightly Test Run - Jul 29, 2026 (newest of 252 `include_all` runs) | **true** | 4,115 | **Yes** (auto-included) |

**So our three release-regression guard cases sit in no manual run at all.** They exist in
TestRail, they are correctly written and referenced, and **no tester will ever be handed them.**
They only appear inside the nightly automation runs, which nobody executes by hand. Those three
cases exist precisely to catch the SV-8682 / SV-8701 / SV-8541 class of breakage on the next
release — and as things stand, the next release regression pass will not include them unless
somebody remembers them from memory.

### Foreign cases in the group (Rule 38 — reported, not touched)

- **201 of the 755** Custom Roles cases were created under user id **1 = Vladimir Tomovic**
  (see the honesty note above — much of it is content we maintain, created under his account).
- **6 of the 9** missing cases are his (listed above).
- **Nothing of his was edited, moved, or queued for any write.** This paper only reports them.

---

## 2. Why this happened (one line)

Run 278 was created from a **fixed case selection** (`include_all = false`). TestRail never adds
newly created cases to that kind of run. Every case added to the Custom Roles group since
2026-06-18 is simply not in it.

---

## 3. The decision — three options

The trade-off is a **reporting** one, not a QA-correctness one. Here it is in plain words.

### Option A — Sync the whole run (add all 9)

Add all 9 missing cases to run 278.

- Run goes **746 → 755 tests**; Untested goes **65 → 74**; completion **91.3% → 89.8%**.
- Every one of the 3,521 graded results is preserved (add-only union write).
- **Catch:** 6 of the 9 are **Vladimir's cases**, not ours. Putting another person's cases into
  another person's run is a decision for the two of them, not ours to make (Rule 38). We would be
  changing the shape of his run on his behalf.
- Consequence in plain words: the run gets 9 more unrun tests and looks very slightly less
  complete than it does now. It already shows 65 unrun tests, so this is a small change to a run
  that is **already visibly unfinished**.

### Option B — Sync only OUR 3 cases (C38843, C38844, C38845)

Add only the 3 regression guard cases we authored, and leave Vladimir's 6 for him to decide on.

- Run goes **746 → 749 tests**; Untested **65 → 68**; completion **91.3% → 90.5%**.
- Our release-regression guards become visible to whoever next executes Custom Roles — which is
  the entire reason they were written.
- Stays inside our own lane (Rule 38): we only add cases we authored.
- Consequence: the run stays out of sync by 6 cases, and those 6 should be raised with Vladimir
  rather than quietly fixed.

### Option C — Leave 278 alone; create a NEW small run for the unrun cases

Leave run 278 exactly as it is as the historical record, and create a fresh run containing just
the cases that need executing.

- 278's 3,521-result history is untouched and its numbers never move.
- The new cases get a clean home a tester can actually pick up.
- Consequence: two runs to look at instead of one, and it needs a naming/ownership decision
  (whose run is it, and does it also carry the 65 currently-Untested tests from 278?).

---

## 4. Recommendation

**Recommended: Option B — add only our 3 regression guard cases (C38843, C38844, C38845) to run
278. Then raise the other 6 with Vladimir separately.**

Reasoning, in order of weight:

1. **Custom Roles is ACTIVE work with a standing obligation.** CLAUDE.md carries a standing rule
   for this project: run the full Custom Roles & Permissions test *"on a cadence AND AFTER EVERY
   FEATURE RELEASE"*, because Custom Roles is volatile and regresses when other features ship.
   This is the one project where the run **must** stay current — there is a known next execution
   coming, by definition. This is why the completed-project hold does not apply here.
2. **The three cases are currently unreachable by any tester.** They are in no manual run at all
   (verified live across runs 278/303/304/311/323). They were written on 2026-07-27 specifically
   to guard the SV-8682 / SV-8701 / SV-8541 breakage that reached customers. A guard case nobody
   is handed is not a guard.
3. **The "it will look unfinished" objection is much weaker here than it was for runs 324/325.**
   Run 278 is **open and already 65 tests short of done** (91.3%). It is not a closed-out, tidy,
   finished record like the completed-project runs — so adding 3 tests does not turn a finished
   run into an unfinished one. It was already unfinished.
4. **The blast radius is real but fully manageable.** 3,521 graded results is the largest history
   in the project, so this deserves the most care of any sync we have done — but an add-only union
   write with a pre-write snapshot has now been executed cleanly on three runs (352/357/359) with
   every result preserved.
5. **Option B respects Rule 38.** We add only what we authored. Vladimir's 6 cases are his call;
   the right move is to show him the list and let him and you decide, not to fold them in silently.

**If you would rather not touch a 3,521-result run at all, Option C is the sound second choice** —
a small fresh run for the unrun Custom Roles cases, leaving 278 as the historical record. Option A
is the one we would avoid, only because it makes a decision about another person's cases on their
behalf.

**Whichever you pick, the run-sync check should now be the last step of every authorized Custom
Roles push** (Standing Rule 34), so this cannot drift again before the next release regression.

---

## 5. Exact mechanics if you say yes

> ### ⚠️ THE DANGER — READ THIS FIRST
> **`update_run` REPLACES the run's case selection with whatever `case_ids` list you send.**
> Sending a **partial** list **DELETES the omitted tests AND every recorded result attached to
> them.** For run 278 that is **3,521 graded results** — the largest history in the project.
> The list sent MUST be the **FULL UNION**. Never send just the new ids.

Order of operations, exactly as executed for runs 352/357/359:

1. **Snapshot first (before any write).** `get_run/278` + `get_tests/278` +
   `get_results_for_run/278` saved to
   `build/testrail-run-sync-2026-07-31/pre-write-snapshot-live/run-278.json`.
   Expected snapshot contents: 746 tests, 3,537 result records.
2. **Build the union.**
   `case_ids = sorted(set(current_746_case_ids) | set(new_ids))`
   - Option B → `new_ids = {38843, 38844, 38845}` → union length **749**
   - Option A → `new_ids = {29469, 29911, 29915, 30642, 30643, 38842, 38843, 38844, 38845}` →
     union length **755**
3. **Write once.** `update_run/278` with a body containing **only** `{"case_ids": <FULL union>}`.
   Nothing else in the body.
4. **Verify immediately.**
   - re-`get_run/278` → test count == 749 (Option B) or 755 (Option A)
   - re-`get_tests/278` → every one of the original 746 case ids still present
   - re-`get_results_for_run/278` → **3,537 records still present**, each with the same
     `status_id` as in the snapshot
   - status counters still show 574 Passed / 98 Failed / 9 Blocked, with Untested risen by
     exactly the number of cases added
5. **Log it.** A per-run row in `run-sync-execution-log-2026-07-31.md`: before → after test count,
   HTTP status, and the results-preserved check.
6. **No other writes.** No `add_result`, no run close, no case create/update/delete.

The executor that already does exactly this is
`build/testrail-run-sync-2026-07-31/exec_run_sync_2026-07-31.py` (it snapshots, unions, writes,
verifies and logs). It requires an explicit `--authorized` flag; it has **not** been run for 278.

---

## OUTSTANDING — what I need from you

| # | What I need | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Your decision on run 278: Option A, B, or C** (recommendation: **B**) | You (QA lead) | Our 3 release-regression guard cases (C38843/44/45) are in **no manual run**, so the next Custom Roles release regression will not include them | 2026-07-31 |
| 2 | **Authorization to write** if you pick A or B — a single `update_run/278` union call, no other writes | You (QA lead) | Nothing moves without it (Rule 6) | 2026-07-31 |
| 3 | **A word with Vladimir Tomovic** about his 6 cases missing from his own run (C29469, C29911, C29915, C30642, C30643, C38842) | You / Vladimir | We will not touch another author's cases (Rule 38), so those 6 stay out of sync until he decides | 2026-07-30 |
| 4 | **Confirmation of who executes Custom Roles next**, and in which run | You (QA lead) | Determines whether Option C (a fresh run) is better than syncing 278 | 2026-07-30 |

*Nothing else is outstanding for this decision.*

---

*Produced read-only 2026-07-30. Live snapshots used for the numbers above are the
`get_run` / `get_tests` / `get_results_for_run` / `get_cases` / `get_sections` / `get_user`
responses read during this pass. **Zero TestRail writes.***
