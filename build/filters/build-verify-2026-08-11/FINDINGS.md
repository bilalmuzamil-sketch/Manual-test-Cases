# Behaviour deviations observed — written up, NOT filed

**Build `v3.6-3e9dd6d`, observed 2026-08-11.** **No Jira write of any kind was made** — the
QA lead's creation hold of 2026-08-10 stands (*"Do not create anything until my next order."*), and
Standing Rule 62 requires his permission per ask in any event. Everything below is ready to file the
moment he says so.

**None of these changed a single expectation.** Under Rule 57 a build that differs from the document
is a deviation to record, never a case to rewrite.

---

## 1 · The Status chip is ABSENT on the Estimates and Completed tabs, not greyed out

**Observed:** on `?tab=all` the bar renders five chips including `filter_chip_status`. On
`?tab=estimates` and `?tab=completed` **`filter_chip_status` is not in the DOM at all** — the bar
renders four chips.

**Why this is delicate rather than simple.** Two sources disagree, and they have disagreed since July:

- **Spec v19 S9-R2 / S9-R3** say the Status chip is **hidden** on these tabs. **The build matches the spec.**
- **Branko's answer of 17 July (Round 1, Q4 = B)**, reinforced by the **QA lead's ruling of 30 July**,
  says it is **shown greyed-out and pre-filled**.

Our [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) follows **the answer**, which is
correct under Rule 32 — the spec sentence has not been edited since 14 May 2026, two and a half months
*before* the answer, so the answer is the later decision. The case already carries the Rule-56
divergence note and an `AUTOMATION: HOLD` naming exactly this question.

**So this is not a new finding and nothing needs changing.** It is recorded because the build now gives
a third data point: **the build sides with the spec.** That is worth Branko seeing when he answers.

**Affected, all already HOLD or already carrying the divergence:**
[C29559](https://shopview.testrail.io/index.php?/cases/view/29559),
[C29609](https://shopview.testrail.io/index.php?/cases/view/29609),
[C29610](https://shopview.testrail.io/index.php?/cases/view/29610).

---

## 2 · Parts pages carry fewer filters than the design requires

| Page | Our cases require | Build carries |
|---|---|---|
| Inventory | Bin Location, Category, Supply, **Vendor** | Bin Location, Category, Supply |
| Part Sales | Status, Customer, Created by, + one more | **Status** only |
| Returns | a **Part Type** filter offering **Core** and **Non Core**, multi-select | **`Show cores only`** and **`Vendor`** |
| Catalog | its designed filter set | **no filter chips at all** (page search and the collapse toggle are present) |
| Purchase Orders | — | no filter bar (page search present) |
| Vendors | — | no filter bar, no collapse toggle |
| Vendor Invoices (`/parts/deliveries`) | — | **the route returns a page-not-found error** |

**The last row is the one to look at first.** `/parts/deliveries` is the **href the product's own
navigation uses** for Vendor Invoices, and loading it produced an error page. Worth a second pair of
eyes before anyone acts on it — it may be data-dependent — but it is the only outright broken route
found in the pass.

**Source:** spec v19 §2 Parts Filters and §4 *"Context-specific filter sets on Parts and Reports"* +
*"Multi-select where it makes sense"*, plus Branko's 2026-07-31 answers and Figma 11884-16885.

**Affected:** [C38904](https://shopview.testrail.io/index.php?/cases/view/38904),
[C38905](https://shopview.testrail.io/index.php?/cases/view/38905),
[C38906](https://shopview.testrail.io/index.php?/cases/view/38906),
[C38907](https://shopview.testrail.io/index.php?/cases/view/38907),
[C38908](https://shopview.testrail.io/index.php?/cases/view/38908),
[C43562](https://shopview.testrail.io/index.php?/cases/view/43562).

**Note the existing hedges on these cases are now partly stale.** They say *"a filter bar exists on
Inventory, Part Sales, Catalog and Returns"* — **Catalog has no filter bar today.** Correcting a
Rule-61 symptom note is legitimate work, but it is a judgement about build state across six cases and
was left for a pass that can do all six together rather than piecemeal.

---

## 3 · Reports filter bars are thinner than the cases describe

| Report (nav label) | Route | Filter chips |
|---|---|---|
| Timesheet Activities | `/reports/punch-clock-activities` | `Date Range`, `Filter by Staff` |
| Shop Efficiency | `/reports/shop-billing-efficiency` | `Date Range` |
| Notes | `/reports/notes-report` | `Sort By`, `Date Range`, `Filter by Author`, `Filter by Mention` |
| Sales | `/reports/sales` | `Customer`, `Date` |
| Sales Tax Collected | `/reports/sales-tax` → `/sales-tax/invoices` | `Date Range`, `Invoice Status` — **and no tabs** |
| A/R Aging Detail | `/reports/ar-aging-detail` | `Date` only |
| IBS Batches | `/reports/batch-transactions` | **none**; tabs `Ready To Send`, `Sent`, `Payments` |

**Against this, [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) requires `Location`,
`Transaction Type`, `Invoice Status`, `Type`, `User` and `Mention` to exist and to multi-select.** Of
those six, only `Invoice Status` (Sales Tax) and `Filter by Mention` (Notes) were found. **`Location`
and `Transaction Type` are absent from A/R Aging Detail**, which is the report the case names.

**[C38909](https://shopview.testrail.io/index.php?/cases/view/38909) requires Sales Tax to have two view
tabs, `Collected` and `All Tax Rates`.** The page has **no tabs**.

---

## 4 · A broken heading on the Timesheets surface

`/timesheets` renders **`Timesheets for undefined`** — a placeholder that was never filled in.

**This is outside the Filters feature** and no Filters case asserts it. Recorded because we saw it while
establishing where *"My Timesheets"* lives, and a visible `undefined` in front of a user is worth
somebody knowing about. It is also the answer to
[C38909](https://shopview.testrail.io/index.php?/cases/view/38909)'s step 3: **the report exists, but at
`/timesheets`, not in the Reports navigation** where the case sends the tester.

---

## 5 · Two things that looked like findings and were not

**The mobile single-filter sheet applies immediately** rather than deferring to `Apply Filters` —
tapping a status changes the URL at once. That is **already covered** by
[SV-8875](https://shopview.atlassian.net/browse/SV-8875) and is exactly what
[C29624](https://shopview.testrail.io/index.php?/cases/view/29624)'s Rule-61 symptom block already tells
the tester to expect. **Nothing new.** (The combined *All Filters* sheet does carry `Apply Filters` and
does defer, as the spec requires.)

**Persisted filter state was carrying over between visits** — the Parts Inventory page loaded with
`gridLocation`, six `category` values and `supply=under-supplied` already applied, and the Notes report
with an author and a mention already set. **That is the feature working**, not a defect. It is recorded
in `RESUME.md` under environment state because **none of it was created by this pass** and it was left
exactly as found.

---

## Outstanding — what I need from you

1. **Permission to file.** Findings 2 and 3 are real product gaps against the design, and finding 2's
   broken `/parts/deliveries` route is the sharpest of them. **Nothing will be filed until you say so**
   — the hold of 2026-08-10 is what is stopping it, and it was your instruction, not an oversight.
2. **A second test login on this branch.** It has been outstanding since 5 August and it is the only
   thing blocking the 7 Persistence cases,
   [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) among them.
3. **Branko still owes the Status-chip answer** (finding 1). The build now agrees with the spec and
   disagrees with his July answer, which is new information for him.
4. **A decision on the Parts/Reports hedges.** Six cases carry a *"not built yet"* note that is now
   partly wrong. Correcting it is a build-state note, not an expectation — but it is six writes and I
   would rather you knew it was happening.
