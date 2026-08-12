# Schedule — completion report

**Standing Rule 67.** Every figure below was **derived live from TestRail and Confluence at
2026-08-12T10:58Z**, not carried from a document. **Build `v3.5-65d6500`** (last-mod Tue 11 Aug
2026 09:33:33 GMT, etag `3250d285ffcf50626363a578fe273071`) — **read at the start and the end of
this pass and unmoved**. Location **`Staging Heavy Duty - 9919`**.

## THE TABLE

| | Schedule (TestRail group 4254) |
|---|---|
| **Total cases** | **ours 176 / live 176** — 0 foreign; every case `created_by = 3` |
| **Source-verified** | **176 of 176** — all carry per-source read-dates, and all pin **specification version 27**, which **is** the live Confluence version (read live this pass: HTTP 200, v27, last edited 2026-08-07T15:01:20Z) |
| **Build-verified — naming the build now running** | **151 of 176** (`v3.5-65d6500`) |
| **Build-verified — naming an earlier build** | **25 of 176** |
| **No build line at all** | **0 of 176** |
| **🔴 Steps and preconditions actually WALKED** | **147 of 176** (union by case id, all passes) |
| **🔴 Walked *and* on the build now running** | **137 of 176** — the conservative figure |
| **Runnable vs held** | **READY 137 · READY-EXPECT-FAIL 4 · HOLD 35** |
| **The gate, closing both ways** | **137 + 4 = 141** and **176 − 35 = 141** ✅ |
| **Created / updated / deleted this pass** | **0 / 4 / 0** |

### The two build numbers are different on purpose, and the smaller one is the honest one

**151 cases name the running build; 147 have had their steps walked; 137 are both.** They are three
different populations and merging them would overstate the position:

- **14 name the running build but were never walked.** Every one carries `AUTOMATION: HOLD` with a
  real reason — a control that does not exist in this build (the six Panel-collapse cases), a
  second sign-in that has not been available, an unticketed fault, or an unanswered product
  question. Their stamp records a genuine observation *about* them; it does not claim their steps
  were run.
- **10 were walked but name an earlier build** — C29925, C29927, C29928, C29931, C29932, C29933,
  C29934, C29937, C29948, C30037, walked on `v3.5-d122eef` (5 Aug) and `v3.5-7ec992f` (6 Aug).
  **Their stamps are accurate and were deliberately left alone.** Re-stamping them to today's build
  would assert an observation nobody made (Rule 12); a stamp naming a superseded build is an
  honest record, not a defect (Rule 60(f)).

### What this suite may and may not be called

**"Source-verified and build-accurate in its preconditions, steps, navigation and labels — with the
behaviour verdict belonging to the tester."** **Not "VIU complete"** — the pass/fail verdict has
been the manual tester's since the QA lead re-scoped it on 2026-08-11 (Rule 10 as amended).

## WHAT IS LEFT — 29 cases, itemised

**25 of the 29 already carry `AUTOMATION: HOLD` and are correctly parked.** Only **4 are genuinely
outstanding**, and all four wait on the same single answer.

### The 4 genuinely remaining — all blocked on one go-ahead from you

| Case | Title | Waiting on | Who can clear it |
|---|---|---|---|
| [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) | Schedule access is gated by the Schedule permission tier | a role / staff / settings change on `sv8685` | **you** |
| [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) | Schedule: Delete gates the delete controls | the same | **you** |
| [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) | The Work Orders: View dependency gates the sidebar | the same | **you** |
| [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | Working-hours settings are gated by the settings permission | the same | **you** |

**Rule 48 — the five fields on the item that is blocked on you:**

1. **The ruling, in your words:** this pass and the two before it were instructed *"Do not edit any
   role definition, staff record or setting for any reason"*, and that those four cases are
   *"awaiting the QA lead's go-ahead"*.
2. **When and what it answered:** given on 12 August, in the brief for this pass, answering how to
   treat a change class that had already cost us a session.
3. **What it blocks:** exactly the four cases above — the last four unwalked cases in the suite.
4. **Why it was right:** editing a role definition on this branch **invalidates every holder's
   session, one way**. That is how the Technician session was lost on 12 August and it never came
   back. With the release tomorrow, losing the administrator session would have cost far more than
   four cases. **The ruling was correct and this pass did not test it.**
5. **What would unblock it:** **one sentence from you** authorising a role / staff / settings
   change on `sv8685` — ideally with the administrator session treated as expendable, or a second
   sign-in supplied so the change can be made from one and observed from the other.

### The 25 already held, grouped by what they are actually waiting on

| # | Waiting on | Cases |
|---|---|---|
| **8** | a **second sign-in** as a non-administrator | C30076, C30077, C30078, C30079, C30081, C30084, C30614, C38926 |
| **6** | the **Panel-collapse button, which is not in this build** | C43582, C43583, C43584, C43585, C43586, C43587 |
| **4** | an **observed fault with no ticket number yet** — these are the write-ups awaiting you, and each becomes `READY - EXPECT FAIL` with one edit once a ticket exists | C29985, C30004, C30013, C30020 |
| **3** | a **product-owner answer** | C29983, C30089, C43555 |
| **3** | a **feature that does not exist in the build** — the Dashboard section, an appointment at work-order creation, the Priority field | C38868, C38869, C38871 |
| **1** | **shifts noted BEFORE a release that has already deployed** — cannot be run now | C38867 |

**8 + 6 + 4 + 3 + 3 + 1 = 25**, and 25 + the 4 above = **29**. Each row was read from the case's own
`AUTOMATION: HOLD` reason live, not grouped from memory.

**Their trigger is the thing they are actually waiting on — not a deploy** (Standing Rule 61).

## THIS PASS

| | |
|---|---|
| Cases walked | **5** — C38875, C38863, C38865, C29986, C30615 |
| TestRail writes | **4 × `update_case`**, every one HTTP 200 and byte-verified, 0 mismatches |
| add / delete / section / run / result | **0 on every one** |
| Jira calls that create anything | **0** — creation remains on hold (Rule 62) |
| Substantive divergences | **0** |
| Cosmetic corrections | **1** — C38875 step 2 |
| False absences caught before reporting | **4** |
| Defects reported | **0** |
| Run 357 | **untouched, proven by content** — 176 tests, 529 results, 0 missing by id, 0 graded fields moved, 0 new, `case_id` sets equal both ways, `include_all` still false |
| TestRail-Automated cases changed | **none** — the whole Schedule suite reads 0 |

## OUTSTANDING — what I need from you

1. **One go-ahead for a role / staff / settings change on `sv8685`** — unblocks the **last four**
   cases and finishes the suite.
2. **The Story Defects written up and awaiting you**, chiefly the **missing Unassigned row**.
   Nothing was filed; Jira creation is on hold. **4 cases** (C29985, C30004, C30013, C30020) each
   turn from `HOLD` into `READY - EXPECT FAIL` with a single edit the moment a ticket number
   exists.
3. **A second non-administrator sign-in** would release **8** more of the held cases — the largest
   single group — and is the same ask that has been open on Filters since 5 August.

**Nothing else is outstanding on Schedule.**
