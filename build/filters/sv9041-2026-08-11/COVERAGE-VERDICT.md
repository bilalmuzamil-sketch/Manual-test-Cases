# SV-9041 — COVERAGE VERDICT, CASE BY CASE — 2026-08-11

**Rule 45(e): a verdict is only valid with BOTH TEXTS QUOTED SIDE BY SIDE.** Case ids alone are
non-compliant, so every row below quotes the ticket's condition against the case's own assertion.

**The ticket's condition, once, for reference:**

> *"Expand/collapse filter toggle should only be visible if there is more then 1 filter present on
> the page. If not then it shouldn't be visible and the filter is always shown"*
> — SV-9041, stated **2026-08-07T13:28:17Z**, never amended.

---

## THE SCOPE WAS RE-DERIVED, NOT INHERITED — AND IT IS **TWO**, NOT THREE AND NOT EIGHT

| Source | Said the scope was | Verdict now |
|---|---|---|
| The brief's candidate list | 8 cases (C29601, C29602, C29603, C29604, C29605, C29629, C38903, C43562) | **too wide** — 6 of the 8 are unaffected |
| The killed pass's `plan.py` | 3 cases (C29601, **C38882**, C43562) | **wrong on one** — C38882 is the Date-Range case and has nothing to do with the toggle |
| **This pass** | **2 cases — C29601 and C43562** | derived below |

**The derivation was exhaustive, not limited to the brief's list (Rule 50).** All **114** cases were
searched for tester-facing mentions of *collapse / expand / toggle / filter icon / filter button*,
which returned **24** candidates — sixteen more than the brief named. Each was then judged on
whether it asserts **the toolbar collapse toggle's presence**, which is the only thing SV-9041
governs.

The 24: C29589, C29601, C29602, C29603, C29604, C29605, C29613, C29621, C29626, C29629, C38881,
C38883, C38889, C38903, C38904, C38905, C38906, C38907, C38908, C38909, C38910, C38911, C43561,
C43562.

**Sixteen fell away on the text, not on a hunch:** C38904/C38906–C38911 are about the *filter chips*,
not the toolbar toggle; C38883/C38889/C43561 use "collapse" for the *search box* and the *kebab
menu*; C29626 uses "collapse" for an *accordion row*; C29589 says Asset on Site is a dropdown "not an
on/off toggle"; C29621/C38881 concern the mobile chip row and pre-redesign saved filters.

---

## THE TWO IN SCOPE

### 1. C29601 — FLT-COLL-01 — **QUALIFIED (no contradiction)** → repaired

**[C29601](https://shopview.testrail.io/index.php?/cases/view/29601)** — *"The toolbar filter button
collapses the bar and the table takes the space"*

| | Text, verbatim |
|---|---|
| **SV-9041 says** | *"Expand/collapse filter toggle should only be visible if there is more then 1 filter present on the page."* |
| **The case said (step 1)** | *"Find the filter icon button in the page toolbar (next to the Search magnifier and the column/layout toggle, left of the Create Work Order button)."* |
| **The case said (expected)** | *"1. The filter bar row is hidden. 2. The work order table moves up and uses the reclaimed vertical space. 3. The filter icon shows a pressed/active look while the bar is collapsed."* |

**Verdict: NOT contradicted.** The case is a **Work Orders** case, and the Work Orders page carries
**five** filter chips (**S1-R2**). Five is more than one, so SV-9041's condition is **satisfied**, the
toggle **is** present, and every assertion the case made was and remains correct. Even on the
Estimates and Completed tabs, where the Status chip is hidden (**S9-R2/S9-R3**), the count falls only
to four.

**So why touch it at all?** Because SV-9041 is a **new authoritative source about the very control
this case exercises**, and the case gave the tester no way to know the control's presence is
conditional. Under **Rule 42** the assertion is made **scope-conditional**; under **Rule 54** the new
source is then named. The two go together: naming SV-9041 without asserting its rule would be
manufacturing authority the case does not use, and asserting the rule without naming SV-9041 would
leave it unsourced. **Neither half is done alone.**

**No Rule-56 divergence sentence was added, deliberately.** On this page S1-R4 and SV-9041 produce
the **same outcome**, so nothing diverges — and Rule 56's honesty half is explicit that inventing a
conflict where none exists is itself a defect.

---

### 2. C43562 — FLT-PR-PAR-01 — **GENUINELY CONTRADICTED** → repaired + divergence disclosed

**[C43562](https://shopview.testrail.io/index.php?/cases/view/43562)** — *"Parts and Reports filters
collapse, share and work on a phone as Work Orders do"*

| | Text, verbatim |
|---|---|
| **SV-9041 says** | *"…If not then it shouldn't be visible and the filter is always shown"* |
| **The case said (expected 1)** | *"The filter bar on the Parts page and on the report **can be collapsed and expanded**, and the table takes the freed space when it is collapsed - exactly as on the Work Orders page."* |
| **The case said (step 2)** | *"Find the control that collapses the filter bar and use it. Then expand it again."* |
| **The case said (expected 2)** | *"While the bar is collapsed the filters keep working, and the collapsed control shows that filters are active - exactly as on the Work Orders page."* |

**Verdict: CONTRADICTED.** The case asserts, **unconditionally and across every Parts view and every
report**, that the filter bar can be collapsed and expanded. SV-9041 says the control is **absent**
where a page has one filter. Single-filter Parts views demonstrably exist — **the ticket's own QA
screenshot is `/parts/part-sales`, showing one filter (Status) and no toggle.**

**The concrete cost had it been left:** a tester opening Part Sales, following step 2, and finding no
collapse control would have marked this test **FAILED on a correct build**. That is precisely the
closed-assertion failure mode **Rule 42** exists to prevent.

**Rule 33 — a recorded ruling is in play here and was NOT dropped.** The case's `refs` credits
**Branko's own answer of 31 July 2026 (Round 3, Q5=A)**: collapse, shareable URL and mobile on Parts
and Reports all match Work Orders. SV-9041 qualifies that ruling **without mentioning it**. So the
ruling is **kept and cited** in both `refs` and the case text, the divergence is **disclosed** (Rule
56), and the reach question is **put to Branko** rather than settled by us.

---

## THE SIX THE BRIEF NAMED THAT ARE **OUT OF SCOPE** — with the reason, not a dismissal

Every one is a **Work Orders desktop or mobile** case. None asserts the toggle's *presence* as a
thing that could be absent, and SV-9041 changes no assertion any of them makes.

| Case | Its assertion | Why SV-9041 does not touch it |
|---|---|---|
| **[C29602](https://shopview.testrail.io/index.php?/cases/view/29602)** | *"The filter bar reappears below the tab row… previously selected filters are still shown…"* | Behaviour **after** collapse, on a five-filter page. The toggle's existence is a precondition that holds. |
| **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603)** | *"the filter bar is still collapsed (your choice was remembered)"* | State persistence (S1-R7). Unaffected by when the control is shown. |
| **[C29604](https://shopview.testrail.io/index.php?/cases/view/29604)** | *"the filter icon shows a visual indicator (filters icon in primary blue)…"* | The indicator **on** a toggle that is present. S7-R4 is untouched. |
| **[C29605](https://shopview.testrail.io/index.php?/cases/view/29605)** | *"The table content does not change when the bar collapses…"* | Filtering continues while collapsed (S7-R5). Independent. |
| **[C29629](https://shopview.testrail.io/index.php?/cases/view/29629)** | *"There is no filter-bar collapse/expand (filter icon) toggle on mobile."* | **S12-R4** already removes the toggle on mobile **regardless of filter count**. The two rules are independent and agree; SV-9041 cannot make it appear. |
| **[C38903](https://shopview.testrail.io/index.php?/cases/view/38903)** | *"The list stays narrowed by your word - collapsing the filter bar does not cancel the search."* | Search/collapse interaction (S13-E1) on a five-filter page. |

**Touching any of these would have been a defect, not diligence.** Adding SV-9041 to their provenance
would name a source that does not support their expectation — which **Rule 54** calls *"WORSE THAN
NONE… it manufactures false authority"*.

## And the one the killed pass named that does not belong

**[C38882](https://shopview.testrail.io/index.php?/cases/view/38882)** — *"Date range filter offers
ready-made periods and a custom start/end range"*. Its subject is the **Date Range** chip: ready-made
periods, a Custom option, and applying on the second date. **It contains no assertion about the
collapse toggle at all.** The earlier plan's intent for it cannot be reconstructed — the pass left no
findings file — but on the text it is **not in scope**, and it was **not touched**.

---

## THE COVERAGE GAP IS NOW CLOSED — C43590 authored

**No case tested SV-9041's negative limb** — *on a page with exactly one filter, the toggle is absent
and the filter bar is always shown.* C43562 now treats that state as a **PASS** when a tester happens
upon it, but nothing **drove** it.

**[C43590](https://shopview.testrail.io/index.php?/cases/view/43590) — FLT-COLL-06** now does, in
section **4118 "Collapse and Expand"**: *"One filter on a page: no collapse control and the filter
bar stays shown"*, driven on **Parts → Part Sales**, the page in the ticket's own QA evidence.

**This pass first declined to author it**, misreading the QA lead's creation hold as covering
`add_case`. **It does not** — his ruling is *"Keep up the Jira ticket creation hold, but do not hold
creating the test cases in Testrail."* The correction is recorded rather than silently absorbed,
because a wrong reading quietly fixed is how the same wrong reading returns.

`custom_atmstatus = 1` (Not Automated) · `AUTOMATION: READY` · Rule-54 sentence 1 only, with a
read-date per source and **no build date** · internal ID checked three ways · created and
**byte-verified, 10 fields, 0 mismatches**.
