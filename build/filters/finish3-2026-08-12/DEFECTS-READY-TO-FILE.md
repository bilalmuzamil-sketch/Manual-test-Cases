# Filters — defects prepared and NOT filed (finish3, 2026-08-12)

**NOTHING IN THIS FILE HAS BEEN FILED.** Jira ticket creation is on hold (Standing Rule 62 and the
QA lead's ruling at its tail, re-stated 2026-08-12: *"However for now the Jira ticket creation is
still on hold."*). **0 Jira calls that create anything were made by this pass.**

Each entry is prepared against the **eight-item evidence bar** of Standing Rule 52 as amended on
2026-08-12, so that the first ticket out of the door when the hold lifts cannot be thrown back.

---

## 1 · C38897 — the filtered-and-searched empty state cannot clear each thing on its own

**The project's only unticketed real deviation. Re-confirmed on `v3.7-20e801b` this pass with all
four steps driven and a check that could fail.**

| Bar item | Evidence |
|---|---|
| **(1) Expectation quoted from a named source, with version and date** | **Filters specification, Confluence version 19, published 6 August 2026**, requirements **S8-R3, S8-R4, S8-R5** (with S13-N1, S13-N2), the anchors already on the case. The case's own wording: *"The table is replaced by a no-results message that mentions BOTH the current filters and the search — not the filters alone"* and *"Clearing the filters leaves your typed word in the box and still applied — each is cleared on its own without wiping the other."* |
| **(2) Annotated screenshots** | `evidence/c38897-empty-state.png` and `evidence/c38897-after-clear-filters-only.png` — **still need arrows/captions added before filing.** |
| **(3) Exact named test data** | Status filter **`Invoiced`** applied **through the chip** (a URL-applied filter is not saved and behaves differently); search word **`zzzznomatchzzz`**, verified present in the field before anything was read; location **Staging Heavy Duty - 9919**; **33 rows** with the filter alone. Ruled out: the filter was applied by chip, not by URL, so the difference between those two paths cannot explain it. |
| **(4) Build marker + environment** | **`v3.7-20e801b`**, last-mod Wed 12 Aug 2026 12:09:14 GMT, etag `82eedf656263a3228c8865356eed8379`; branch `sv8785.qa.shopview.com`, API `sv8785api.qa.shopview.com`; **desktop 1680 × 1080, signed in as `admin@shopview.com` (Admin, 42 permissions)**; observed **2026-08-12 ~14:5xZ**. |
| **(5) Duplicate search** | **STILL OWED — must be run immediately before filing.** Suggested JQL: `project = SV AND text ~ "empty state" AND text ~ "clear"`; `project = SV AND parent = SV-8798`; `project = SV AND text ~ "no work orders match"`; `project = SV AND created >= -14d AND text ~ "search"`. |
| **(6) Reader shape** | Below. |
| **(7) Pre-filing self-challenge** | *Strongest argument this is NOT a defect:* the search **can** be cleared on its own — expectation 3 passes — so a reader could say the case is "mostly met" and the rest is wording. **Answer: expectation 4 is a behaviour, not wording.** Clearing the filters **also wipes the search**, which is the exact thing the requirement forbids, and it is reproducible from the steps above. Expectation 1 is a wording gap in the product's own message, which is minor on its own but is quoted verbatim from the spec. **The ticket should lead on expectation 4.** |
| **(8) Not a Rule-24 pass** | Correct — nothing here is a UI-hidden/API-allowed control. Both controls are visible and the fault is in what they do. |

### The five-part reader body

**Description.** On the Work Orders page, when a filter and a page search are both active and nothing
matches, the no-results message names only the filters, and using its Clear Filters link also wipes
the search instead of leaving it in place.

**Steps of reproduction.**
1. Open Work Orders at Staging Heavy Duty - 9919.
2. Click the **Status** chip and tick **Invoiced** (33 work orders remain).
3. Click **Search** in the toolbar and type **`zzzznomatchzzz`**. The list empties.
4. Read the message where the table was.
5. Click **Clear Filters** inside that message.

**Current behaviour.** The message reads **"No work orders match your filters"** — no mention of the
search. It offers **Clear Filters** only; the only way to clear the search is the round **x** in the
toolbar box, which is not part of the message. After clicking **Clear Filters** the address bar
becomes `?tab=all`: **the search parameter is gone and the search box is empty.**

**Expected behaviour.** The message should mention **both** the filters and the search, and should
offer a separate way to clear the search. Clearing the filters should **leave the typed word in the
box and still applied**, so each can be cleared without wiping the other.

**Source.** Filters specification, Confluence version 19 (published 6 August 2026), requirements
S8-R3, S8-R4 and S8-R5.

**Shape when filed (Rules 52/53):** `Story Defect` (issuetype 10007) · **parent = the owning story**
(**SV-8798** on current information — confirm before filing) · that story also linked **`relates to`**
· priority **`Medium`** · **no Product Area** (the field does not exist on this type).

---

## 2 · NOT A DEFECT — recorded so nobody files it later

**A `filters` value the SPA cannot parse stops it saving filter changes.** Writing
`filters={status:['review']}` (an invalid status key; the real one is `ready_for_review`) into a user's
saved preference by direct `PUT` left the SPA sending **no save request at all** on three subsequent
valid chip picks. Restoring a valid preference resumed saving immediately.

**This must not be filed.** **We caused it ourselves with a direct API write**, and **a user cannot
reach it from any screen** — so under Standing Rule 51's reachability test it is API-only, and under
Rule 52's item (8) nonsense check it is not a user-facing defect at all. It is written down only
because for a while it looked exactly like a filter-persistence bug, on the same ground as SV-8871 and
SV-8905.

---

## 3 · CASES LEFT ASSERTING THEIR SOURCE SO THE TESTER FAILS THEM — no ticket owed from us

These already have tickets or are already graded by the tester. **None was given a hold, because a
hold on a runnable case disarms it.**

| Case | Position |
|---|---|
| [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) · [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | Both reproduce their stated expect-fail symptom **exactly** (the deleted id is still sent, the Customer chip shows no value, the list comes back empty). **Outcome 1: mark FAILED, raise nothing new.** |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Reproduces the SV-8875 symptom exactly — the single-filter sheet applies instantly, has no Apply button, and closes so a second value cannot be picked. |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | The reopened sheet's title carries no count (the count is on the chip). Tester has it under a ticket. |
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) · [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) · [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Established by the previous pass, each already failed by the tester under a ticket. Not re-litigated. |
