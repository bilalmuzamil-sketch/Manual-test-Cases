# C38909 (`FLT-RPTS-01`) — scoped to the reports this epic actually covers, 2026-08-10

**Authorisation:** QA lead, verbatim — *"Authorise fixing C38909 — it's actively misleading a tester
today --> yes please"*.
**Operation:** one `update_case/38909`. HTTP 200, byte-verified. Nothing else was written.
**Case:** [C38909](https://shopview.testrail.io/index.php?/cases/view/38909), section 5412.

---

## 1. What was wrong

The case asserted working filter buttons across **nineteen report surfaces**. Only **five** are
unambiguously inside this epic. The other fourteen are, per the engineering handover, either owned
by a different epic, deferred pending the PM, awaiting a reachability call, or technically incapable
of the filter the case demanded.

A tester following it would have logged a long row of Blocked results **waiting for a build that is
never coming** — and, worse, would have had no way to tell that from a genuine regression.

### The nineteen surfaces, classified

| # | Surface in the case | Verdict | Why |
|---|---|---|---|
| 1 | Timesheet Activities | **IN SCOPE** | handover §3 rollout list (PunchClock) |
| 2 | Timesheets (Payroll Timesheet) | **OUT — nav-orphan** | handover §8; and see the naming trap in §4 |
| 3 | Sales | **OUT — forbidden** | handover §8 *"Do not migrate"* (SV-8582) |
| 4 | Technician Efficiency | **OUT — forbidden** | handover §8 *"Do not migrate"* (SV-8582) |
| 5 | Advisor Analysis | **OUT — forbidden** | handover §8 *"Do not migrate"* (SV-8582) |
| 6 | Shop Efficiency | **IN SCOPE** | handover §3 (Shop Billing Efficiency) |
| 7 | Work in Progress | **OUT — forbidden** | handover §8 *"Do not migrate"* (SV-8582) |
| 8 | Sales Follow Up | **OUT — nav-orphan** | handover §8 |
| 9 | Sales Tax | **IN SCOPE** | handover §3 |
| 10–12 | A/R Aging Summary / Detail / Collection | **OUT — deferred** | handover §8, no chip type yet |
| 13–15 | A/P Aging Summary / Detail / Unpaid Invoices | **OUT — deferred** | handover §8, no chip type yet |
| 16 | Notes | **IN SCOPE** | handover §3 |
| 17 | Reminders | **IN SCOPE** | handover §3 |
| 18 | IBS Batch Transactions | **OUT — no date dimension** | handover §8 |
| 19 | QB Unexported | **OUT — no date dimension** | handover §8 |

**5 in scope · 14 not** (of which one, row 2, is a naming ambiguity — see §4). The case asserted a
**Date** filter on rows 18 and 19, which the handover says the server cannot support at all.

## 2. The source, quoted

From the **engineering handover for the app-wide filter redesign** (branch
`SV-8785-app-wide-filter-redesign`), read 2026-08-10:

> **§3, program scope:** *"**6 Reports** — Shop Billing Efficiency, My Timesheets, Timesheet
> Activities (PunchClock), Notes, Reminders, Sales Tax."*

> **§8, open decisions — do NOT auto-resolve:**
> *"**SV-8582 "Reporting Suite" overlap:** separate epic/branch… **Do not migrate**
> `TechnicianEfficiency`, `Sales`, `ServiceAdvisorAnalysis`, `WorkInProgress` — coordinate first."*
> *"**As-of-date reports (A/R & A/P Aging ×5–6):** single point-in-time "As Of Date", no chip type
> yet. **Deferred pending PM**… **NOT migrated**."*
> *"**Nav-orphan / hidden reports** (CustomerTransactions, VendorTransactions, SalesFollowUp,
> PayrollTimesheet, Inventory-report): reachability/priority call before migrating."*
> *"**No-date reports** (IBS Batch, QuickBooks Unexported): no date dimension server-side; would only
> get shell + page-search + persistence, or need new BE work."*

**This is an engineering handover, not a specification, and the case says so in those words.** It is
cited because the scoping rests on it and nothing else states it — the specification does not name
which reports are covered.

## 3. The repair — scope-conditional, not substitution

**Rules 25 and 57:** the out-of-scope surfaces were **not** rewritten to describe what the build does,
and the case's expectations for the in-scope reports were **not** touched. Under **Rule 42** the list
is written **conditionally**, not closed absolutely:

> *"14. The list of reports in this test is the list this piece of work covers today. If a report
> named in item 13 later gains the new filter bar, that is a change of what the work covers rather
> than a failure of this test — check the current product write-up before raising anything."*

**No case was deleted.** Those reports get filter bars eventually; `delete_case` is irreversible.
The coverage is **scoped and dated, not thrown away.**

### Before → after

| Field | Before | After |
|---|---|---|
| **title** | *"Every report page shows its designed filter buttons"* — **"Every" was the error in one word** | *"Report filter bars appear on the reports this change covers"* (59 chars) |
| **steps** | 16 steps walking 19 reports | 9 steps walking the 6 in-scope reports |
| **expected** | 25 items, 19 of them per-report assertions on out-of-scope reports | 16 items: 12 assertions on the in-scope reports, then the exclusion block, the scope caveat, and the blocked-not-failed note |
| **refs** | `…(spec v18 §2 Reports Filters; §4 Key Decisions…)` | `…(spec **v19** …; **S1-R3 chip type-icon**); … eng handover SV-8785-app-wide-filter-redesign §3+§8 2026-08-10` — 232 chars, one comma-free entry |

### The exclusion block, in tester-facing words

> *"13. The reports below are NOT part of this piece of work. If they have no filter bar, or still
> show their older controls, that is correct. Do not raise a bug and do not mark this test failed
> because of them:*
> - *Sales, Technician Efficiency, Advisor Analysis and Work in Progress. These belong to a separate
>   piece of work (the Reporting Suite) and are deliberately being left alone here.*
> - *The six ageing reports… These pick a single 'as of' date, and no filter button of that kind has
>   been built yet. The decision on them is still open.*
> - *Timesheets (Payroll Timesheet) and Sales Follow Up. These are not currently reachable from the
>   menu and no decision has been taken on them…*
> - *IBS Batch Transactions and QB Unexported. There is no date information behind these two reports,
>   so they cannot be given a Date filter."*

## 4. What the whole-case re-read turned up (Standing Rule 41)

The case was re-read end to end against the **live specification at Confluence version 19**, not only
the part being edited. Four further findings, all folded into the same write:

1. **The spec version on the case was stale.** It said *"Confluence version 18 (published 4 August
   2026)"*. Live is **version 19**, published **2026-08-06T11:48:47Z**. Corrected in both the
   provenance line and `refs`. *(The page body still reads "Version: 1.6" — the Rule-31(a) trap. The
   Confluence version number was used, as instructed.)*

2. **v19's only change lands on this case.** The v18→v19 diff is a single sentence, and it is a **new
   requirement**: **S1-R3** now reads *"Each chip displays **a leading type-icon identifying the
   filter**, the filter name, and a chevron icon…"*. The case's old item 21 said only *"each filter
   button shows its name and a down arrow"* — **incomplete against v19**. Rewritten as item 9:
   *"Each filter button shows a small icon for the kind of filter, then the filter name, then a down
   arrow."* This is defensible for Reports because spec §2 *"Reports Filters"* says reports follow
   *"the same chip-and-dropdown pattern as Work Orders"*.

3. **A naming trap that would have confused a tester.** The rollout contains **"My Timesheets"**; the
   nav-orphan list contains **"PayrollTimesheet"**. The old case's step 2 said *"the Timesheets
   (Payroll Timesheet) report"* — **naming both at once**, so neither we nor a tester could tell
   which report it meant. Resolved by **naming them separately and explicitly**: My Timesheets is
   step 3 (in scope), Timesheets (Payroll Timesheet) is called out in item 13 as a **different**
   report that is out of scope.

4. **An in-scope report had no coverage at all.** **My Timesheets** is one of the handover's six and
   the case never tested it. Added as step 3 — but **conservatively**: only a Date filter button is
   asserted, because that is all any document supports (handover §5.4 — every migrated report carries
   the required, defaulted preset date chip). Item 4 says plainly that no product document lists any
   other filter button for it, so a tester seeing more must report rather than fail. **Nothing was
   invented** (Rule 57).

**No raw markup was present** in this case (unlike 15 others in the suite) — checked on all three
text fields and re-checked in the shape guard before sending.

## 5. Rule 56 — no divergence sentence was added, deliberately

Nothing genuinely diverges. Narrowing to the reports this epic delivers is a **scoping clarification**,
not a later decision reversing an earlier source: no PO ruled one way and then the other, and the
specification's *"on each report"* in §2 is a feature-overview sentence, **not a numbered requirement**
that this scoping contradicts.

Adding a divergence sentence here would have **manufactured a conflict that does not exist**, which
Rule 56's honesty half calls a defect in its own right. It is recorded as an **open question** instead
(§7).

## 6. Provenance and marker

**Sentence 1 (documents only) and the build sentence were kept separate, never merged.** The build
sentence — *"Last checked against build v3.4.2-d00239b on 8/5/2026."* — was **carried over verbatim
and NOT re-stamped**, because **no Filters QA sign-in was available this pass and nothing was
re-observed** (Rule 12). The shape guard asserts that sentence is present unaltered before sending.

**Marker (last line, blank line before):**
`AUTOMATION: HOLD - Branko's Parts and Reports write-up is still outstanding, so no product source
states which filter buttons each report should show`

HOLD is unchanged and still correct — it rests on a **missing product write-up**, which is a genuine
open question, not a tool flag.

## 7. Reported, not acted on

1. **The spec says one thing, the delivery scope another.** §2 *"Reports Filters"* says a filter bar
   appears *"on each report"*; the handover delivers **six**. That is a question for **Branko** — is
   the rest a later phase, or is the spec's overview overstated? Until he answers, the case follows
   the handover and says so.
2. **A live discrepancy no one has resolved.** The case's 5 August observation says only Timesheet
   Activities had a filter bar on build `v3.4.2-d00239b`. The handover says **all six** reports were
   migrated by that same commit (`4f8211cbfd` precedes `d00239be6b`). **Both cannot be true.** No
   Filters sign-in was available, so this was **not resolved** — item 16 of the case states both
   sides and tells the tester to check the current build. **One live check settles it.**
3. **The build has moved on again.** The 2026-08-06 pass recorded `v3.4.2-d00239b` →
   **`v3.4.2-280ca5a`**. This case's build sentence is therefore honest but old, and the Rule-49
   queue stays open.
4. **105 of the suite's cases still pin spec v18.** Only 9 carry v19. C38909 is now one of the 9.
   The rest need an authorised re-stamp pass.
5. **No ticket was filed** (Rule 62), for anything above.

## 8. Verification

| Check | Result |
|---|---|
| Shape checked **before** sending | one provenance line · one marker · marker is the last non-empty line · blank line before it · no raw markup in any of the three text fields · title ≤ 80 · every `refs` comma-entry ≤ 248 · build sentence present verbatim — **all PASS** |
| `update_case/38909` | **HTTP 200** |
| Intended fields stored as sent | **5 of 5 byte-identical** (`title`, `refs`, `custom_preconds`, `custom_steps`, `custom_expected`); `refs` compared under the declared comma normalisation |
| Collateral damage | **30 fields compared; 23 proven byte-identical** to the pre-write snapshot. `updated_on` / `updated_by` excluded by design. **0 collateral changes.** |
| All three text fields sent explicitly | yes — none omitted, so nothing was re-rendered by TestRail's HTML pipeline |
| Run 352 after the edit | **114 tests, 473 results, 0 missing by id, 0 graded changes, 0 echoes moved, 0 new results.** C38909 **is** in run 352 and its title changed, yet **no `case_title` echo fired** on any result. |
| Cited links resolve | both cited files verified present in git at HEAD; `blob/HEAD` used, never `blob/main` (there is no `main` branch) |

Snapshots: `snapshots/C38909-before.json`, `snapshots/C38909-after.json`. Executor:
`tools/repair_c38909.py`.
