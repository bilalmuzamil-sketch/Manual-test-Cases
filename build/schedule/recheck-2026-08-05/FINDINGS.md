# Schedule — Rule-49 re-check attempt, 5 August 2026: FINDINGS

## The headline, in one line

**The build moved this morning and we cannot get into it, so none of the 165 cases could be
re-checked.** Everything that could be established without the running app **was** established, and
it turned up **six real problems in our own records** plus **ten new defects raised by other testers
that bear on our cases**. Nothing was written to TestRail and no ticket was filed.

## How many of the 165 rows are CONFIRMED and how many CHANGED

| | Count | of 165 |
|---|---|---|
| **CONFIRMED** on `v3.5-be42149` | **0** | 0% |
| **CHANGED** on `v3.5-be42149` | **0** | 0% |
| **NOT RE-OBSERVED — no session on the build** | **165** | **100%** |

That is the honest answer and it is not a partial pass reported as a whole one. **A row we could not
drive is not confirmed** (Standing Rule 12). All 165 stay **PROVISIONAL AND UNCONFIRMED**.

The verdicts being carried forward, re-counted from the queue this run — **138 pass / 19 product-is-
wrong / 4 not built / 2 held for the product owner / 2 could not be set up here = 165** — are the
**4 August** answers, measured on **`v3.5-4873abe`**, a build that is no longer served.

## What we did establish, and what it changes

### Finding 1 — The specification has not moved, and that is proven exactly, not assumed

Live Confluence version **23**, same as our baseline. We did not stop at the number: the live page
body was fetched and word-diffed against our mirror. **Zero runs of six or more words exist in the
live page that are missing from our copy.** So there is no uncovered requirement hiding behind a
version bump, and no requirement-verdict rows are owed. Detail and the sha256 in
`SOURCE-CURRENCY.md` section 1.

### Finding 2 — None of our ten tickets is fixed

All ten (`SV-8848`...`SV-8857`) are still **Open**, priority Low, parented to the epic, each with its
story attached. The only change since we filed them is another QA adding a `FS-Schedule` label to all
ten. **So the 19 product-is-wrong cases most likely still fail — but "most likely" is not observed,
and this pass does not upgrade it to a verdict.**

### Finding 3 — Two of our four "no ticket at all" deviations now HAVE tickets, raised by other testers

The 4 August readiness report named four product-is-wrong cases with no developer ticket. **Two of
them have since been ticketed by other QAs, independently of us:**

| Our case | C-id | Now ticketed by | Ticket | Match |
|---|---|---|---|---|
| SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | Mudassir Qamar, 04 Aug 08:39 | **[SV-8834](https://shopview.atlassian.net/browse/SV-8834)** "Schedule shows time logged as complete when nothing has been clocked" | **exact** |
| SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | Mudassir Qamar, **05 Aug 05:26** | **[SV-8874](https://shopview.atlassian.net/browse/SV-8874)** "Grid search hides non-matching shifts instead of fading them" | **exact** |

**SV-8834 is word-for-word our finding.** His description reads *"the shift tooltip and shift detail
modal show TIME LOGGED as 1h / 1h with a full progress bar, but the work order shows Actual 0.00 of
1.00 and Progress 0%"* — and C30010's own known-issue block records *"'1h / 1h' on another"*. Same
symptom, same figures.

**This settles outstanding item 5 of the 4 August readiness report without us doing anything.** That
item asked whether to file an eleventh ticket for C30010. **The answer is no — it would be a
duplicate of another tester's ticket**, and Rule 38 keeps us hands-off their work. The ask should be
struck from the outstanding list.

**SV-8874 also overturns one of our own deliberate decisions.** Decisions-register entry 8 said the
toolbar-search behaviour *"is arguably the better behaviour, so it is a product question for Branko
rather than a bug for a developer"* and we deliberately left it unticketed. Another QA has now filed
it as a defect. That does not make our reasoning wrong, but **it is no longer an unticketed
deliberate omission** and the register must say so.

**Two of the four remain genuinely unticketed and that is still deliberate and still documented** —
SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) (behaviour below the
960px minimum the spec supports) and SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)
(the hover summary lists all five lines instead of capping at three — it shows *more* than asked, not
less).

### Finding 4 — Two other testers' Ready-to-Fix defects CONTRADICT two of our PASS verdicts

This is the Rule-44 situation and it is treated as a bug report against our suite until we can
disprove it. **We cannot disprove it without the build, so both are carried as open contradictions —
not resolved in our favour.**

**Contradiction A — sidebar search on a technician's full name**

- **Ours:** [C29939](https://shopview.testrail.io/index.php?/cases/view/29939)
  "'Search work orders' matches work order number, customer, unit, and technician name" —
  verdict **PASS**, evidence *"Search matched on work-order number ("S-9379" and bare "9379"),
  customer name, unit number and technician name."*
- **Theirs:** [SV-8873](https://shopview.atlassian.net/browse/SV-8873) (Mudassir Qamar, 05 Aug 04:19,
  **Ready to Fix**) "Sidebar search returns no results when you type a technician's **full** name".
- **Why both can be true, and why that is our problem:** our evidence does not say *which form* of the
  technician name we typed. If a partial name matches and the full name does not, **we tested the
  passing half and reported a pass.** A developer has already accepted his report. **Our case's
  assertion is likely right and our verdict likely wrong.** Must be re-driven typing the full name
  exactly as it appears on the technician row.

**Contradiction B — the sidebar Status filter**

- **Ours:** [C29944](https://shopview.testrail.io/index.php?/cases/view/29944)
  "Status filter narrows the list to work orders in the chosen status(es)" — verdict **PASS**,
  evidence *"Checking Approved narrowed the list to the 91 approved work orders, matching
  facetCounts."*
- **Theirs:** [SV-8868](https://shopview.atlassian.net/browse/SV-8868) (Ayesha Khan, 04 Aug 18:47,
  **Ready to Fix**) "Schedule sidebar Status filter returns no work orders for **most** statuses".
- **This one is a Rule-50 exhaustiveness failure of our own.** We proved **one** status of many and
  called the filter good. **One status is a sample.** Every status offered by the chip must be
  driven — and if most of them return nothing, C29944's verdict is a deviation, not a pass.

Both contradictions are recorded here rather than acted on, because acting on them without observing
the build would be inference (Rule 12). Neither of their tickets was touched (Rule 38).

### Finding 5 — Three of the ten new defects look like coverage GAPS we have no case for

Run as a reverse-coverage diff (Rule 45(a)) — their assertion against all 165 of ours, best keyword
overlap shown. Three land with no plausible counterpart:

| Their ticket | Assertion | Best match in our suite | Read |
|---|---|---|---|
| [SV-8863](https://shopview.atlassian.net/browse/SV-8863) **Ready to Fix** | Schedule **opens in Week view by default instead of Day view** | nothing above 2 of 2 generic words; no case asserts the default landing view | **CANDIDATE GAP** — we have cases for switching views, none for which view the module opens on |
| [SV-8870](https://shopview.atlassian.net/browse/SV-8870) | **Cannot create a shift by dragging a work order onto a day in Month view** | C38863, C30077, C30075 — none is month-view drag-creation | **CANDIDATE GAP** — our drag-creation cases are Week and Day view |
| [SV-8867](https://shopview.atlassian.net/browse/SV-8867) | A **series shift cannot be reassigned by drag in Week and Month view** | C29987 (month series banner), C30020 (events drag) | **CANDIDATE GAP** — we cover reassigning a standalone shift, not a series member |

Two more overlap cases we already hold and should re-drive rather than author:
**[SV-8865](https://shopview.atlassian.net/browse/SV-8865)** (series shift cannot be opened or deleted
in Month view) touches the SCH-DEL set and C30062; **[SV-8877](https://shopview.atlassian.net/browse/SV-8877)**
(the conflict list does not name the technician or day) touches SCH-CONF-05 =
[C30027](https://shopview.testrail.io/index.php?/cases/view/30027) and SCH-CONF-06 =
[C30028](https://shopview.testrail.io/index.php?/cases/view/30028), both of which we passed.
**[SV-8869](https://shopview.atlassian.net/browse/SV-8869)** is the Day-view half of
SV-8840, which we already confirmed in Week view (SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960)).
**[SV-8864](https://shopview.atlassian.net/browse/SV-8864)** (conflict pop-up alignment) is cosmetic
positioning and we hold no case for it — not proposed.

**No case was authored.** New cases need the QA lead's authorisation (Rule 6), and each of these
needs live observation first.

### Finding 6 — Our own record of the epic was wrong in four ways

Set out in full in `SOURCE-CURRENCY.md` section 2. In short: the epic has **26** direct children, not the
28 `CLAUDE.md` claims; the 12 tickets we recorded as *"Bug tickets, children of the epic"* are
**`Story Defect` subtasks of the individual stories**, one level lower; the range `SV-8826`-`SV-8841`
is **16** tickets of which **four are nothing to do with Schedule** (two are Ahtasham's Filters
defects, two are Ryan Fyfe's unparented Bugs); and there are now **22** story defects, not 12.
**Stated, not silently corrected.**

### Finding 7 — The 16 raw-markup cases: count verified, all 16 named

Our record said 16 cases show literal `<ol>` / `<li>` page markup to the tester. **We searched all
165 rather than trusting the count, and it is exactly 16.** No case has it in the title; it is in
preconditions, steps and expected results.

| # | Case | C-id | link |
|---|---|---|---|
| 1 | Grid rows are grouped by department under group headers | C29928 | https://shopview.testrail.io/index.php?/cases/view/29928 |
| 2 | No Tech/Dept toggle - department grouping is the only grid grouping | C29930 | https://shopview.testrail.io/index.php?/cases/view/29930 |
| 3 | An Unassigned row sits inside the grid, not in a separate tray | C29931 | https://shopview.testrail.io/index.php?/cases/view/29931 |
| 4 | Clicking a date in the mini calendar navigates the main grid | C29932 | https://shopview.testrail.io/index.php?/cases/view/29932 |
| 5 | The sidebar is a flat list of work order cards with no tabs | C29936 | https://shopview.testrail.io/index.php?/cases/view/29936 |
| 6 | Dropping a single-line work order creates a shift with no scope picker | C29955 | https://shopview.testrail.io/index.php?/cases/view/29955 |
| 7 | A shift's start time uses the technician's own working hours | C29969 | https://shopview.testrail.io/index.php?/cases/view/29969 |
| 8 | A single-line shift block shows customer, unit number and line | C29991 | https://shopview.testrail.io/index.php?/cases/view/29991 |
| 9 | Clicking a shift opens its detail modal, with VIN always visible | C30008 | https://shopview.testrail.io/index.php?/cases/view/30008 |
| 10 | Double-booked: two overlapping work orders on one technician | C30023 | https://shopview.testrail.io/index.php?/cases/view/30023 |
| 11 | Shift hover tooltip shows the full shift summary | C30034 | https://shopview.testrail.io/index.php?/cases/view/30034 |
| 12 | 'Today' button jumps the grid to the current date | C30039 | https://shopview.testrail.io/index.php?/cases/view/30039 |
| 13 | Dragging a shift to another technician row reassigns it | C30052 | https://shopview.testrail.io/index.php?/cases/view/30052 |
| 14 | Deleting a middle shift of a series offers all three scope options | C30057 | https://shopview.testrail.io/index.php?/cases/view/30057 |
| 15 | Blue is the default color for all shifts | C30071 | https://shopview.testrail.io/index.php?/cases/view/30071 |
| 16 | Schedule: View grants the full read-only experience | C30074 | https://shopview.testrail.io/index.php?/cases/view/30074 |

The fix is formatting only, not one word of meaning. **It is staged, not executed** — see
`WRITE-PLAN.md` for why nothing was written today.

### Finding 8 — Not one of the 165 cases carries an automation marker

Read live from all 165: **0 have an `AUTOMATION:` line.** Schedule never received the marker pass —
it was halted on 5 August precisely because the build had moved
(`build/automation-markers-2026-08-05/SCHEDULE-HALTED.md`). All 165 provenance lines name
**`v3.5-4873abe`** and **8/4/2026**, exactly once each, with no doubling.

**The arithmetic gate cannot be run yet** because there are no markers to count. Its target is
recorded so it can be checked in one step later: **READY + READY-EXPECT-FAIL must equal 157** —
165 cases minus 2 waiting on the product owner (SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089),
SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)) minus 2 that could
not be set up here (SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865),
SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)) minus 4 not built
(SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873), SCH-DND-08 =
[C29962](https://shopview.testrail.io/index.php?/cases/view/29962), SCH-EVT-02 =
[C30017](https://shopview.testrail.io/index.php?/cases/view/30017), SCH-SPREAD-11 =
[C38863](https://shopview.testrail.io/index.php?/cases/view/38863)). **That figure will move if any
of the four not-built features shipped in this morning's deploy — which is one of the things we could
not check.**

## The four "not built" and the two "could not be set up": still unknown

A redeploy is exactly when a not-built feature appears, and this is the question we most wanted to
answer. **We could not.** All six rows are carried forward unchanged and unobserved:

| Case | C-id | What must be re-checked |
|---|---|---|
| SCH-API-02 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | whether the long-series confirmation and the 120-shift cap now exist |
| SCH-DND-08 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | whether a click-to-arm alternative to dragging now exists |
| SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | whether the Day-view live preview while creating an event now exists |
| SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | as SCH-API-02, from the screen side |
| SCH-EDGE-07 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | retry with harder seeding |
| SCH-START-02 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | retry with harder seeding |

## Data we seeded and left behind

**None.** No session, so nothing was created, no role was borrowed, no setting was changed, no
technician was touched. There is nothing to clean up and nothing to restore. (The 4 August pass's own
clean-up was already verified field by field at the time — see `recovery-2026-08-04/STATE.md`.)

## Nothing was written anywhere

- **TestRail: 0 writes.** All 165 cases proven **byte-identical** before and after this pass — 30
  fields each, `updated_on` and `updated_by` included, **0 differences**.
- **Run 357: 0 writes.** 165 tests, **429** result records, every one present **by ID** and
  byte-identical field by field, case_id sets equal in both directions, `include_all` still false.
- **Jira: 0 writes.** No ticket created, none edited, none transitioned, none re-parented.
- **Foreign cases: none exist in group 4254.** All 165 have `created_by = 3` and `updated_by = 3`.

Proof and per-operation detail in `testrail-execution-log.md`.
