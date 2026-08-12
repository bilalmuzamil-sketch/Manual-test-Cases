# Filters — divergences, 2026-08-12

**Build `v3.6-3e9dd6d`, read at 11:04:29Z and unmoved.** Every entry quotes both texts.

> **This file is NOT empty, and it distinguishes the two things it must:**
> **1 COSMETIC divergence, corrected and pushed** · **1 SUBSTANTIVE divergence, recorded and RAISED,
> not rewritten** · **1 inherited divergence still owed** · and **1 case that looked like a divergence
> and is not**.

---

## 1 · COSMETIC — CORRECTED AND PUSHED

### C43590 — the precondition named a page that no longer has the state

**[C43590](https://shopview.testrail.io/index.php?/cases/view/43590)** — *"One filter on a page: no
collapse control and the filter bar stays shown"*.

**WHAT THE CASE SAID (verbatim, before):**
> *"2. You can reach a page whose filter bar shows only ONE filter button. **On the build the
> developers were working on, Parts then Part Sales was such a page: its filter bar showed only
> Status.**
> 3. If every page you can reach shows **two or more** filter buttons, mark this test BLOCKED…"*

**WHAT THE BUILD OFFERS (measured live, 14 pages surveyed):**

| Page | filter chips | collapse control |
|---|---|---|
| **Parts → Part Sales** | **0 — no filter bar at all** | absent |
| Purchase Orders · Deliveries · Customers · Vendors · Assets · Sales Tax Collected · IBS Batches · Sales By Customer | 0 | absent |
| **Reports → Technician Efficiency** | **1** — `filter_chip_range`, *"Date : This month"* | **absent from the DOM** |
| Parts Returns | 2 | present |
| Reports → Timesheet Activities | 2 | present |
| Parts Inventory | 3 | present |
| Work Orders | 5 | present |

**CATEGORY — COSMETIC.** The test is *would a reader of the source recognise what the build offers as
the same thing?* **Yes**: a page with exactly one filter button and no collapse control exists and
behaves as the case expects — only the **example page name** was stale. So it was corrected, not
raised.

**WHY IT MATTERED ENOUGH TO FIX THE DAY BEFORE RELEASE:** the tester would have gone to Part Sales,
found **no filter bar at all**, and fallen through to the escape hatch — which does not even cover
that case, because it only anticipates *"two or more"*. A runnable test would have been marked BLOCKED
and the coverage lost.

**WHAT IT SAYS NOW:**
> *"2. You can reach a page whose filter bar shows only ONE filter button. On the build tested,
> Reports then Technician Efficiency was such a page: its filter bar showed only the Date button. (An
> earlier build had Parts then Part Sales as the example; that page now shows no filter bar at all, so
> use Technician Efficiency.)
> 3. If every page you can reach shows **either no filter bar at all, or two or more** filter
> buttons, mark this test BLOCKED…"*

Step 3 was also loosened from *"where the Search control and the page's main button sit"* to *"at the
top of the table — including where a Search control or the page's main button would sit"*, because
Technician Efficiency has neither, and the old wording presupposed both.

**1 `update_case`, byte-verified. `custom_preconds` and `custom_steps` moved and nothing else** —
title, refs, section and `custom_atmstatus` all byte-identical. **The expected results were not
touched**, and its Rule-54 line already reads `v3.6-3e9dd6d on 12 August 2026`.

---

## 2 · SUBSTANTIVE — RECORDED AND RAISED, THE CASE LEFT ALONE

### C38897 — the empty state offers no way to clear the search on its own

**[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** — *"When filters and a search
find nothing, each can be cleared on its own"*.

**WHAT THE SOURCE REQUIRES** (the case's own expected results, sourced to Filters spec **Confluence
v19**, `S8-R3`, `S8-R4`, `S8-R5`, read 11 August 2026):
> *"1. The table is replaced by a no-results message that mentions **BOTH the current filters and the
> search** — not the filters alone. 2. The message offers a way to clear the filters and, **because a
> search is active, a separate way to clear the search.**"*

**WHAT THE BUILD DOES** (measured live, filter and search both active, and again with a search only):
> The message reads **`No work orders match your filters`** — filters alone, in both states — and the
> only control it offers is **`Clear Filters`** (`data-test-id="empty_state_clear_filters"`).
> **There is no clear-the-search offer in the message.**

**RULE-OUT, because this is an absence claim:** the scanner was first run in a state where the search
clear control **is** present, and it saw `page_search_clear` there. So the absence is a real absence,
not a blind check. Evidence: `evidence/empty-state.json`, field
`scanner_saw_page_search_clear_in_matching_state: true`.

**CATEGORY — SUBSTANTIVE.** A reader of `S8-R4`/`S8-R5` would **not** recognise a single *Clear
Filters* button as the same thing as two independently clearable controls.

**WHAT WAS DONE — AND DELIBERATELY NOT DONE.** **The case was not edited.** Under Rule 57 the case
keeps the documented expectation and the build is what is wrong; the steps are runnable in the sense
that matters — a tester follows step 3, finds no such option, and **marks the case FAILED, which is
the correct outcome.** Adding an `AUTOMATION: HOLD` or a "mark BLOCKED" note would have **disarmed a
case that is doing its job.**

**No expect-fail marker was added either**, because Rule 61 as amended on 11 August requires a **live
source backing it** and **no ticket describes this**. Creating one is barred by the standing hold, so
it is **raised here instead**. It is the one item on this project that most deserves a ticket.

---

## 3 · INHERITED AND STILL OWED — not touched, and the reasoning stands

### C38891 — roughly 42 surface names, two known wrong

**[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)** (`AUTOMATION: HOLD`).

| The case says | The build's navigation reads | Confirmed live this session |
|---|---|---|
| `IBS Batch Transactions` | **`IBS Batches`** | `/reports/ibs-batches` loads |
| `Sales Tax Invoices` | **`Sales Tax Collected`** | `/reports/sales-tax-collected` loads |

**Deliberately not corrected, for the third time, and the reason should survive:** fixing two names
inside a list of forty would make the case *look* freshly verified while the other forty stayed
unchecked. **It needs one pass that walks all 42 surfaces at once**, against the live specification's
`S14-R6` list — which itself warns that seven surfaces are named differently in code than in the
interface and that they should be located **by URL rather than by name**. The case is held on the
page-search rollout in any event.

---

## 4 · LOOKED LIKE A DIVERGENCE AND IS NOT

### C38889 — the phone has no page search, and the case already says so

**[C38889](https://shopview.testrail.io/index.php?/cases/view/38889)** — step 1 is *"Tap the Search
control in the page toolbar"*, and **at 390 × 844 the Work Orders page has no `page_search_toggle` in
the DOM at all.** The only magnifier is `button_open_mobile_search` in the **top app bar**, and it
opens `select_global_search`: typing *Iibay* produced a **Customers** dropdown, left the URL without
`?search=` and left the card count at **30**.

**That is word for word what the case's own note already predicts:**
> *"What you should see today: on a phone there is no page search at all. The magnifier in the top bar
> opens the app-wide search box instead, and typing in it does not narrow this page's list."*

It carries **`AUTOMATION: READY - EXPECT FAIL (SV-8912)`**. So the case is **correct, its symptom is
confirmed unchanged on the shipping build, and nothing is owed** — this is Rule 61 working exactly as
designed, and it is recorded here so a later pass does not "discover" it again as a defect.

**Rule-out:** `page_search_toggle` **is** visible on desktop in the same check, so the phone absence is
real.

---

## WHAT IS RAISED TO THE QA LEAD

1. **C38897 — a real build deviation against `S8-R3`/`S8-R4`/`S8-R5`, with no ticket and no marker.**
   The tester will fail it tomorrow and be right to. It wants a ticket the moment the creation hold
   lifts.
2. **C38891 — the 42-surface pass is still owed**, and two names in it are known wrong.
3. **C29581 and C29588 cannot be walked by us** because their preconditions need a staff record
   deactivated, and staff edits are barred on this branch. **A tester can do this; we could not** —
   flagged so nobody records them as unrunnable.
