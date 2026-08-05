# Filters — findings, 5 August 2026 (the final-check pass)

**Build:** `v3.4.2-d00239b`, `index.html` last-modified Tue 04 Aug 2026 22:51:02 GMT, etag
`b9ab1d41718b5e871432064ed914e2e7`. Read at **13:22:10Z, 14:13:35Z and 14:25:10Z** — byte-identical
all three times (sha256 `d4845701337c6836…`), so **nothing redeployed under this pass**.
**The branch is not declared final, so every verdict below is PROVISIONAL** (Standing Rule 49).

## What this pass did, and did not, observe — stated plainly

**29 of the 110 cases were driven live on the build in this pass** and their evidence is quoted per
case below. **The other 81 were not re-driven today.** Their verdicts carry forward from the
2026-08-05 04:20–04:53Z re-check, which ran against **the same build marker** — and that is stated as
what it is: an earlier observation of the same build, **not** an observation made now. Nothing in this
document is inferred from the specification or from source code (Standing Rule 12).

The live work this pass was deliberately aimed at the three things that were open: the **eight phone
cases** nobody had been able to reach, the **three closed tickets** whose cases depended on them, and
the **five class-A waivers** the QA lead found.

## The headline: expected behaviour is no longer taken from the build

The QA lead found that **FLT-BAR-01 = C29557** described what the build does instead of what the
specification requires. The full audit is `../expected-behaviour-audit-2026-08-05.md` — **A=5, B=0,
C=104, D=1** over all 110. All six defective cases are repaired; class B is zero, so **every one had a
documented requirement to go back to and none of them needs Branko**.

## Markers, and the arithmetic gate

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | **82** |
| `AUTOMATION: READY - EXPECT FAIL (…)` | **18** |
| `AUTOMATION: HOLD - …` | **10** |
| **Total** | **110** |

**GATE: READY + READY-EXPECT-FAIL = 100, which equals the ready-to-automate figure in
`../READINESS-2026-08-05.md`.** It was **93**; it is now **100**, because the eight phone cases were
finally observed (+8) and C38882 correctly moved to HOLD (−1).

## The phone cases — settled, at last

Observed at a **390 × 844 viewport with touch and an iPhone user agent**. A viewport is not a physical
device and is fully automatable, so **none of these is HOLD-worthy for being mobile**.

**THE BUTTON'S EXACT LABEL IS `Apply Filters` — WITH A CAPITAL F.** `data-test-id="apply_filters"`,
on-screen text exactly `"Apply Filters"`. The specification writes *"Apply filters"*. Standing Rule 9
says the tester reads what they will actually see, so **the build wins on the label** while the
specification keeps deciding the behaviour.

| What | What the build does |
|---|---|
| The chip row | starts **All Filters**, then Status, Customer, Lead Technician, Service Advisor, Asset on Site. Genuinely scrollable sideways: `scrollWidth` 878 against `clientWidth` 370, `overflow-x: auto`. |
| The **combined** All Filters sheet | **works exactly as S12-R6 requires.** Ticking two statuses fired **0** list requests and left the address bar untouched; pressing **Apply Filters** then produced `?status=paid&status=declined`. Multi-select works there too. |
| A **single** filter's own sheet | **does not defer.** Tapping *Paid* changed the address bar to `?status=paid` **immediately**, the sheet **closed**, and there is **no Apply button anywhere in the document**. A second value can only be added by reopening the sheet. **That contradicts S12-R6** — and Ahtasham's **SV-8875** already covers it, so nothing new was filed. |
| Customer / Lead Technician / Service Advisor sheets | each has a **Search** box and its list, plus Clear Selection — but each applies on tap and closes, same root cause. |
| Asset on Site | `Asset on Site / close / Yes / No / Clear Selection` — correct. |
| Clear Filters on a phone | **absent while filters are on.** Our own **SV-8846** (Open, Low) reproduces. |
| The mobile empty state | **correct.** Tapping *Imported* gave 0 rows, *"No work orders match your filters"* and a **Clear Filters** link. |
| Collapse toggle | **none on mobile**, and the chip row is always present — correct. |

## The three closed tickets, re-verified against the build

**A closed ticket does not change the expected behaviour.** Each case below keeps the requirement and
says the build fails it, with the ticket qualified so nobody waits for a fix.

### SV-8843 — STILL REPRODUCES, and its own title is half wrong

Measured: the tabs occupy **y81–121**, the filter bar **y86–116**, and they are **flex siblings in one
row** (common ancestor `div.row work-orders-top`, tabs x35–391, bar x407–1403). So the bar is
**beside** the tabs, not below them → **S1-R1 fails**.

But the ticket's own claim *"so collapsing it frees no space"* is **wrong**: collapsing moved the table
top from **y184 to y144** and hid all five chips, while the filter kept applying. **S1-R5 passes.** So
C29601 and C29602 are PASSES and only C29557 is the deviation. The old waiver on C29602 was not just
unsourced — **it was factually false on this build**.

### SV-8847 — STILL REPRODUCES, both halves

With only a search active the message reads *"No work orders match your filters"* and **never mentions
the search** (S8-R3 wants *"filters and search"*), and the only link offered is **Clear Filters** —
there is **no way to clear just the query** (S8-R4 wants one).

**One thing does pass, and it is worth saying:** pressing **Clear Filters** left the search in the box
and in the URL — exactly what S8-R5's *"Clearing filters does not clear the query"* requires.

### SV-8845 — STILL REPRODUCES, and worse than it was reported

Closed **OBSOLETE by Ahtasham at 04:41:58-0500 today**. On a phone, **every** filter link is ignored:

| Link opened on a phone | What the app requested | What was listed |
|---|---|---|
| `?status=declined&tab=all` | `filters[0][value]=estimate` | 30 **Estimate** |
| `?status=paid&tab=all` | `filters[0][value]=estimate` | 30 **Estimate** |
| `?status=imported&tab=all` | `filters[0][value]=estimate` | 30 **Estimate** |
| the **same** declined link on **desktop** | `filters[0][value]=declined` | **7 Declined** — correct |

…while the chips read *"All Filters (1)"* and *"Status (1)"* as though the filter had taken. **Not
reopened — that is the QA lead's call.** Reported here instead, and the cases that name it now say
*"reported, closed without a fix"*.

---

## All 110 cases

`Marker` is what the case now carries. `Observed this pass` is quoted evidence from **today**; where it
is blank, the case was **not re-driven today** and that is stated rather than papered over.

### FLT-BAR-01 = C29557 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29557)
*Filter Bar Layout and Visibility* · Filter bar is shown below the tab row on the Work Orders page
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8843 - reported, closed without a fix)`
- **Observed live this pass:** Measured live: tabs occupy y81-121, the filter bar y86-116, side by side as flex siblings in one row (common ancestor div.row work-orders-top). The bar is BESIDE the tabs, not below them.
- **Changed this pass:** class-A waiver paragraph deleted; plain deviation note added naming the closed ticket; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict; provenance no longer names the build as the source of an expectation the build fails

### FLT-BAR-02 = C29558 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29558)
*Filter Bar Layout and Visibility* · Five filter chips appear in a fixed order with an icon, name and arrow
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: five chips in order Status, Customer, Lead Technician, Service Advisor, Asset on Site, each with a name and a keyboard_arrow_down chevron.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-BAR-03 = C29559 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29559)
*Filter Bar Layout and Visibility* · The filter bar still shows the other four chips on the Estimates tab
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-01 = C29560 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29560)
*Status Filter* · Status chip opens a checkbox list of all nine statuses plus Clear Selection
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the Status panel lists exactly nine statuses - Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported - plus a "Clear Selection" action (data-test-id filter_clear_selection_status).
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-02 = C29561 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29561)
*Status Filter* · Ticking one status filters the table immediately, with no apply button
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: ticking Paid changed the address bar to ?status=paid at once and the table to 30 Paid rows. No Apply or Submit button exists anywhere on the page.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-03 = C29562 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29562)
*Status Filter* · Ticking several statuses shows work orders matching any of them
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: ticking Paid then Declined without reopening gave ?status=paid&status=declined and the chip read "Status: Paid, Declined".
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-04 = C29563 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29563)
*Status Filter* · Clear Selection in the Status dropdown unticks every status
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-05 = C29564 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29564)
*Status Filter* · Clicking outside the Status dropdown closes it and keeps the selections applied
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-06 = C29565 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29565)
*Status Filter* · Selecting statuses that no work order has shows the empty state
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-01 = C29566 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29566)
*Customer Filter* · Customer chip opens a dropdown with a search field and a customer list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-02 = C29567 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29567)
*Customer Filter* · Typing in the customer search narrows the list to matching names
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-03 = C29568 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29568)
*Customer Filter* · Selected customers show as removable tags and as ticks in the list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-04 = C29569 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29569)
*Customer Filter* · Clicking the x on a customer tag removes just that customer from the selection
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-05 = C29570 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29570)
*Customer Filter* · The table shows only work orders belonging to any of the selected customers
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-06 = C29571 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29571)
*Customer Filter* · Clear Selection in the Customer dropdown removes all selected customers
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-07 = C29572 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29572)
*Customer Filter* · Clicking outside the Customer dropdown closes it and the selections remain
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-08 = C29573 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29573)
*Customer Filter* · Customer search with no matching name shows a no-results message in the list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CUST-09 = C29574 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29574)
*Customer Filter* · A customer with no work orders is still listed; picking them shows no rows
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-01 = C29575 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29575)
*Lead Technician Filter* · Lead Technician chip opens a dropdown with a search field and a list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-02 = C29576 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29576)
*Lead Technician Filter* · Typing in the technician search narrows the list to matching names
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-03 = C29577 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29577)
*Lead Technician Filter* · Selecting technicians shows only work orders where they are the lead technician
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-04 = C29578 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29578)
*Lead Technician Filter* · Clear Selection in the Lead Technician dropdown removes all selected technicians
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-05 = C29579 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29579)
*Lead Technician Filter* · Clicking outside the Lead Technician dropdown closes it
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-06 = C29580 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29580)
*Lead Technician Filter* · Selecting a technician who leads no work orders shows the empty state
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TECH-07 = C29581 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29581)
*Lead Technician Filter* · A deactivated technician does not appear in the Lead Technician filter list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-01 = C29582 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29582)
*Service Advisor Filter* · Service Advisor chip opens a dropdown with a search field and a list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-02 = C29583 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29583)
*Service Advisor Filter* · Typing in the advisor search narrows the list to matching names
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-03 = C29584 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29584)
*Service Advisor Filter* · Selecting advisors shows only work orders assigned to those advisors
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-04 = C29585 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29585)
*Service Advisor Filter* · Clear Selection in the Service Advisor dropdown removes all selected advisors
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-05 = C29586 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29586)
*Service Advisor Filter* · Clicking outside the Service Advisor dropdown closes it
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-06 = C29587 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29587)
*Service Advisor Filter* · Selecting an advisor with no assigned work orders shows the empty state
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ADV-07 = C29588 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29588)
*Service Advisor Filter* · A deactivated advisor does not appear in the Service Advisor filter list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-01 = C29589 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29589)
*Asset on Site Filter* · Asset on Site chip opens a dropdown with Yes and No plus Clear Selection
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-02 = C29590 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29590)
*Asset on Site Filter* · Choosing Yes shows only work orders whose asset is on site
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-03 = C29591 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29591)
*Asset on Site Filter* · Asset on Site is single-select: choosing the other option replaces the first
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-04 = C29592 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29592)
*Asset on Site Filter* · Clear Selection in the Asset on Site dropdown removes the filter
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-05 = C29593 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29593)
*Asset on Site Filter* · Clicking outside the Asset on Site dropdown closes it
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-06 = C29594 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29594)
*Asset on Site Filter* · An Asset on Site choice that matches no work orders shows the empty state
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CHIP-01 = C29595 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29595)
*Active Filter Chips and Clear Filters* · A chip with a selected value turns blue and shows the value
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the active chip reads "Status: Paid, Declined" - the value, not just a count - on background rgb(227,242,253) while the four inactive chips are transparent.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CHIP-02 = C29596 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29596)
*Active Filter Chips and Clear Filters* · A chip with several values shows the first ones and shortens the rest
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CHIP-03 = C29597 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29597)
*Active Filter Chips and Clear Filters* · 'Clear Filters' shows right of the chips only when a filter is active
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: "Clear Filters" appears at x1507 y87, to the right of the last chip (Asset on Site ends at x1398), and only while a filter is active.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CHIP-04 = C29598 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29598)
*Active Filter Chips and Clear Filters* · 'Clear Filters' removes every active filter and resets all chips
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CHIP-05 = C29599 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29599)
*Active Filter Chips and Clear Filters* · 'Clear Selection' in one dropdown clears only that filter
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-CHIP-06 = C29600 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29600)
*Active Filter Chips and Clear Filters* · Status and Customer filters together show only work orders matching both
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-COLL-01 = C29601 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29601)
*Collapse and Expand* · The toolbar filter button collapses the bar and the table takes the space
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: pressing the toolbar filter button (data-test-id toggle_filter_bar) hid all five chips and moved the table top from y184 to y144 - the table DOES take the reclaimed space - while the filter kept applying (30 rows before and after).
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-COLL-02 = C29602 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29602)
*Collapse and Expand* · Expanding the filter bar brings it back with active filters still shown
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: pressing it again brought the bar back with "Status: Paid" still on the chip and "Clear Filters" still shown.
- **Changed this pass:** class-A waiver paragraph deleted; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict

### FLT-COLL-03 = C29603 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29603)
*Collapse and Expand* · The filter bar's collapsed or expanded state is remembered on return
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-COLL-04 = C29604 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29604)
*Collapse and Expand* · Collapsed filter button shows a blue indicator only when filters are active
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: collapsed with a filter on, the toggle renders text-blue-10 / rgb(56,116,255); collapsed with no filter on, it does not.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-COLL-05 = C29605 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29605)
*Collapse and Expand* · Active filters keep filtering the table while the filter bar is collapsed
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: with the bar collapsed the row count stayed at 30 - the filter kept applying.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-EMPTY-01 = C29606 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29606)
*Empty State* · A filter combination with no matches shows a no-results empty state
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8847 - reported, closed without a fix)`
- **Observed live this pass:** Live: with only a search active the message reads "No work orders match your filters" - it never mentions the search.
- **Changed this pass:** class-A waiver paragraph deleted; assertion restored to the documented requirement; plain deviation note added naming the closed ticket; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict; provenance no longer names the build as the source of an expectation the build fails

### FLT-EMPTY-02 = C29607 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29607)
*Empty State* · The filtered empty state offers a way to clear the filters
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8847 - reported, closed without a fix)`
- **Observed live this pass:** Live: the empty screen offers only "Clear Filters" (data-test-id empty_state_clear_filters). There is no way to clear just the search. Pressing Clear Filters DID leave the search in place, which is what S8-R5 asks for.
- **Changed this pass:** class-A waiver paragraph deleted; assertion restored to the documented requirement; plain deviation note added naming the closed ticket; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict; provenance no longer names the build as the source of an expectation the build fails

### FLT-TAB-01 = C29608 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29608)
*Tab Behaviour* · The All tab shows all five filter chips, all working
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the All tab shows all five chips.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TAB-02 = C29609 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29609)
*Tab Behaviour* · Estimates tab: the Status chip is not shown; the other four still work
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** stale refs corrected; "and the build" dropped from the divergence sentence; spec version corrected 1.6 -> Confluence 18

### FLT-TAB-03 = C29610 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29610)
*Tab Behaviour* · Completed tab: the Status chip is not shown; the other four still work
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** stale refs corrected; "and the build" dropped from the divergence sentence; spec version corrected 1.6 -> Confluence 18

### FLT-TAB-04 = C29611 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29611)
*Tab Behaviour* · My Work Orders tab shows all five filters and they narrow that list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TAB-05 = C29612 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29612)
*Tab Behaviour* · A Status choice is kept while you switch tabs and comes back on the All tab
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PERS-01 = C29613 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29613)
*Persistence* · Leaving the page and coming back restores the filters and the bar state
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8871)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-PERS-02 = C29614 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29614)
*Persistence* · Filters are remembered permanently, even after closing the browser
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PERS-03 = C29615 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29615)
*Persistence* · Saved filters are per user: one user's filters do not appear for another user
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PERS-04 = C29616 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29616)
*Persistence* · A remembered filter value that was deleted is silently ignored
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8832)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-URL-01 = C29617 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29617)
*URL State and Shareable Links* · Applying filters updates the page URL to reflect the active filter state
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-URL-02 = C29618 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29618)
*URL State and Shareable Links* · Opening a shared URL or bookmark loads the page with those filters on
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8845 - reported, closed without a fix; SV-8871)`
- **Observed live this pass:** Live, desktop: ?status=declined&tab=all sent filters[0][value]=declined and returned 7 Declined rows with the chip reading "Status: Declined". Live, phone: the same link sent estimate and listed 30 Estimates.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; SV-8845 qualified as closed without a fix, since this pass proved it still reproduces; provenance no longer names the build as the source of an expectation the build fails

### FLT-URL-03 = C29619 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29619)
*URL State and Shareable Links* · A URL with a deleted filter value loads and ignores that value
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8832)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-URL-04 = C29620 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29620)
*URL State and Shareable Links* · A broken filter URL loads the page with no filters and no error
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8832)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-MOB-01 = C29621 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29621)
*Mobile Filters* · Mobile: chips sit in a scrollable row below the tabs, starting All Filters
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live at 390x844: the row starts "All Filters" at x27, then Status x159, Customer x271, Lead Technician x402, Service Advisor x570, Asset on Site x737. The container .mobile-filter-chip-row has scrollWidth 878 against clientWidth 370 with overflow-x auto - genuinely scrollable.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-02 = C29622 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29622)
*Mobile Filters* · Mobile: All Filters opens a sheet of expandable rows with Apply filters
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the All Filters sheet carries a footer button whose on-screen text is exactly "Apply Filters" (capital F), data-test-id apply_filters.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-03 = C29623 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29623)
*Mobile Filters* · Mobile: tapping Apply filters applies the statuses and updates the count
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: ticking two statuses in the combined sheet fired 0 list requests and left the address bar unchanged; pressing Apply Filters produced ?status=paid&status=declined and the chips read "All Filters (1)" and "Status (2)".
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-04 = C29624 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29624)
*Mobile Filters* · Mobile: one chip opens its own sheet and applies only on Apply filters
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8875)`
- **Observed live this pass:** Live: tapping the Status chip opens data-test-id mobile_filter_sheet (title "Status", close button, nine checkboxes, "Clear Selection"). Tapping Paid changed the address bar to ?status=paid immediately, the sheet closed, and there is NO Apply button anywhere in the document. A second value can only be added by reopening the sheet.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-05 = C29625 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29625)
*Mobile Filters* · Mobile Customer filter has search, multi-select and removable tags
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8875)`
- **Observed live this pass:** Live: the Customer sheet has a Search box (placeholder "Search", data-test-id filter_search_company_id) and its customer list, but ticking applies at once and closes the sheet - no Apply button.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-06 = C29626 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29626)
*Mobile Filters* · Mobile Lead Technician and Service Advisor filters offer their search lists
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the Lead Technician and Service Advisor sheets each have a Search box and their name lists plus Clear Selection.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-07 = C29627 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29627)
*Mobile Filters* · The mobile Asset on Site filter offers Yes/No with Clear Selection in the sheet
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the Asset on Site sheet reads "Asset on Site / close / Yes / No / Clear Selection".
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict

### FLT-MOB-08 = C29628 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29628)
*Mobile Filters* · Active chips and Clear Filters behave on mobile the same way as on desktop
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8846)`
- **Observed live this pass:** Live: with a filter active on a phone there is NO Clear Filters control at all - no clear_filters element and no element whose text is "Clear Filters" in the chip row.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-MOB-09 = C29629 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29629)
*Mobile Filters* · Mobile has no collapse toggle: the filter chip row is always visible
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: no collapse or toggle_filters control exists at a phone viewport, and .mobile-filter-chip-row is present.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; marker set from the live verdict

### FLT-MOB-10 = C29630 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29630)
*Mobile Filters* · Filters matching no work orders on mobile show the same empty state as desktop
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: tapping Imported gave 0 rows, the message "No work orders match your filters" and a "Clear Filters" link in the empty state.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict; note about a shared-link fault removed - this case reaches the empty state by tapping, so the note would make a passing case look failed

### FLT-API-01 = C29631 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29631)
*API — Work Orders List Filtering* · The work order list request carries the active filter selections
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-API-02 = C29632 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29632)
*API — Work Orders List Filtering* · A combined multi-filter request returns only work orders matching all filters
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-API-03 = C29633 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29633)
*API — Work Orders List Filtering* · A request with a deleted or unknown filter value gives no server error
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8832)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-API-04 = C29634 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29634)
*API — Work Orders List Filtering* · A list request with malformed filter parameters does not produce a server error
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8832)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-API-05 = C29635 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29635)
*API — Work Orders List Filtering* · A filter combination matching nothing returns an empty list, not an error
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-TAB-06 = C38876 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38876)
*Tab Behaviour* · First visit opens the Estimates tab; your last-used tab is remembered
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-STAT-07 = C38877 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38877)
*Status Filter* · Imported works alone: picking it greys out the other filters
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-ASSET-07 = C38878 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38878)
*Asset on Site Filter* · Choosing No shows only work orders whose asset is not on site
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-URL-05 = C38879 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38879)
*URL State and Shareable Links* · Opening a shared link does not change your own saved filters
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8828)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-PERS-05 = C38880 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38880)
*Persistence* · Each page and tab remembers its own filters separately
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PERS-06 = C38881 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38881)
*Persistence* · Filters saved before the redesign carry over after the update
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-RPTS-23 = C38882 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38882)
*Reports Page Filters* · Date range filter offers ready-made periods and a custom start/end range
- **Marker:** `AUTOMATION: HOLD - the report filter bars are not in the product yet beyond the first report tab`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** assertion restored to the documented requirement; assertion restored to the documented requirement; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict

### FLT-PSRCH-01 = C38883 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38883)
*Page Search Toolbar* · Page toolbar Search expands in place and narrows the list as you type
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)`
- **Observed live this pass:** Live: the toolbar Search (data-test-id page_search_toggle) expands in place to an input with placeholder "Type to search" (data-test-id page_search_input); typing "Aagate" narrowed the table in place and the address bar gained &search=Aagate.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-PSRCH-02 = C38884 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38884)
*Page Search Toolbar* · Page search combines with filters and is cleared separately
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-PSRCH-03 = C38886 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38886)
*Page Search Toolbar* · Your typed search stays in this browser tab only and is never saved
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-04 = C38888 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38888)
*Page Search Toolbar* · The search term is part of the shareable page link
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the address bar carried &search=ZZQQNOMATCHXX and &search=Aagate.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-05 = C38889 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38889)
*Page Search Toolbar* · On mobile the search expands in the toolbar and buttons make room
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-06 = C38891 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38891)
*Page Search Toolbar* · Every list page keeps its own search box (Parts, Reports, detail tabs)
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-07 = C38893 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38893)
*Page Search Toolbar* · The top navigation search no longer filters page lists
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-API-06 = C38895 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38895)
*API — Work Orders List Filtering* · Saved-filters service round-trip: save, reload, and per-user isolation
- **Marker:** `AUTOMATION: HOLD - needs a second test login to prove one person's saved filters do not reach another`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-URL-06 = C38896 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38896)
*URL State and Shareable Links* · 'Back To My Saved Filters' is not shown when you are on your own view
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8828)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-EMPTY-03 = C38897 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38897)
*Empty State* · When filters and a search find nothing, each can be cleared on its own
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: with a filter AND a search both active and nothing matching, the screen offered two "Clear Filters" controls (the chip-row one and the empty-state one) and no way to clear the search. Pressing Clear Filters cleared the status and left the search in the box and in the URL.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-08 = C38898 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38898)
*Page Search Toolbar* · The Search box changes look as you hover over it, open it and type
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (no ticket - reported to the QA lead as one design item, not filed)`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails

### FLT-PSRCH-09 = C38899 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38899)
*Page Search Toolbar* · The list narrows shortly after you stop typing, with no button to press
- **Marker:** `AUTOMATION: READY`
- **Observed live this pass:** Live: the list narrowed on its own after typing, with no Apply or Submit button next to the box, and pressing Enter changed nothing - 30 rows before and after, no reload.
- **Changed this pass:** class-A waiver paragraph deleted; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict

### FLT-PSRCH-10 = C38900 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38900)
*Page Search Toolbar* · One search box serves all Work Orders tabs and searches the tab you are on
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-11 = C38901 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38901)
*Page Search Toolbar* · Each Report tab and each Parts view keeps its own separate search
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-12 = C38902 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38902)
*Page Search Toolbar* · An old link carrying a top-search word no longer narrows the page list
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PSRCH-13 = C38903 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38903)
*Page Search Toolbar* · Collapsing the filter bar keeps an active search working
- **Marker:** `AUTOMATION: READY`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18

### FLT-PARTS-01 = C38904 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38904)
*Parts Page Filters* · Every Parts list page shows its designed filter buttons
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-PARTS-09 = C38905 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38905)
*Parts Page Filters* · Part Type filter opens a Core / Non Core list with Clear Selection
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-PARTS-11 = C38906 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38906)
*Parts Page Filters* · Choosing a Parts filter narrows the list on that page
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-PARTS-12 = C38907 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38907)
*Parts Page Filters* · Parts filters support multiple choices and can be cleared
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-PARTS-13 = C38908 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38908)
*Parts Page Filters* · Every filter a page had before is still available in the new filter bar
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-RPTS-01 = C38909 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38909)
*Reports Page Filters* · Every report page shows its designed filter buttons
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-RPTS-21 = C38910 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38910)
*Reports Page Filters* · Choosing a Reports filter narrows the report results
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature

### FLT-RPTS-22 = C38911 — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38911)
*Reports Page Filters* · New Reports filter types behave correctly (Location, Transaction Type, etc.)
- **Marker:** `AUTOMATION: HOLD - the feature is not in the product yet`
- **Not re-driven today.** Verdict carried forward from the 2026-08-05 04:20–04:53Z re-check against the same build marker `v3.4.2-d00239b`. Stated as an earlier observation of this build, not a fresh one.
- **Changed this pass:** spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature
