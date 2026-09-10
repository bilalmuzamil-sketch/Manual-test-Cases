# Printer Friendly Work Orders — case vs LIVE source, 2026-09-10 (Rule 106)

Source read **live** this pass: Confluence page **519176194**, *Printer Friendly Work Orders*,
epic **SV-9383**, owner Milos Vasic / Branko Cicovic, Confluence last-modified **2026-09-07**.
Our `requirements.md` cites "version 8, read 2026-08-25" — **the page has moved since** (07 Sep),
and the version integer is not returned by this call (known limitation), so the date is the anchor.

**Why this was done now:** the Staging session expired mid-run. Rather than idle (105), the whole
suite was reconciled against the source it is measured against — which had never been read live in
this pass. It found a contradiction inside the spec that makes two cases unrunnable as written.

---

## 🛑 FINDING 1 — THE SPEC CONTRADICTS ITSELF: two cases can never be run

**Rule for when Print is disabled**, §4 Key Decisions, verbatim:

> **Print disabled until lines data loads.** The menu item is disabled (grayed out) while line item
> data is being fetched from the server **or when no line items exist**. The button does not enable
> when the UI skeleton appears — it waits for the actual data to arrive.

**Rules for what must print when there are no lines**, verbatim:

> **S3-N1:** If the work order has no line items, the line items section will display
> "No lines on this work order"

> **S4-N1:** If there are no line items, the summary will show zero totals rather than being hidden,
> and the line items area shows a single placeholder row reading "No lines on this work order".

**These cannot both hold.** If Print is disabled when a work order has no line items, then a
work order with no line items can never be printed — so the "No lines on this work order"
placeholder and the zero totals can never appear on any printout. The two negative cases describe a
page that the disable rule prevents anyone from ever producing.

**Affected cases — both currently untested, neither claimed:**
[C45107](https://shopview.testrail.io/index.php?/cases/view/45107) (no line items prints an explicit
placeholder) and [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) (with no line
items the summary shows zero totals).

**This is a source question, not a build defect** — do not raise a ticket against the build for it
(Rule 106). Either the disable rule should not include "or when no line items exist", or S3-N1 and
S4-N1 should be withdrawn. **Only the PO can decide which.**

**It also puts a caveat on a case already marked Passed:**
[C45091](https://shopview.testrail.io/index.php?/cases/view/45091) — Print stays disabled until the
line data arrives. What was observed and passed is the *loading* half, with the line request
deliberately held open: Print was present but greyed out, and became usable once the data arrived.
The *"or when no line items exist"* half was **not** observed and is not claimed.

---

## FINDING 2 — the header requires two fields not yet confirmed, and one never seen

**S2-R3**, verbatim, the header must carry:

> - Customer name (and company name, if present)
> - Vehicle: year, make, model, VIN, license plate, unit number (if present), mileage, engine hours (if present)
> - Service advisor name
> - **Lead technician name**
> - Work order start date

**Observed on the printed page** (work order S2-32231): Customer · Company · VIN · Date ·
Service Advisor · Vehicle (year make model) · Unit · Licence Plate. **Not present: mileage, engine
hours, lead technician.**

**This is NOT yet a finding**, because **S2-R4** says fields with no value are omitted:

> **S2-R4:** Fields that have no value (e.g., no engine hours, no license plate) will be omitted from
> the printout rather than displayed as blank

So the absence is only a defect if that work order actually HAS a mileage, engine hours or a lead
technician. **That has not been checked** — it needs a work order where those three are populated.
[C45094](https://shopview.testrail.io/index.php?/cases/view/45094) stays untested; nothing is claimed
about it. **When Staging is back, seed a work order with mileage, engine hours and a lead technician
assigned, and print it.**

---

## FINDING 3 — a requirement with no case, found by reading the source

**S4-R4**, verbatim:

> **S4-R4:** The work order number will repeat in the footer of each printed page for multi-page
> printouts

**No case in the suite covers the per-page footer repeat.** The behaviour was in fact observed
incidentally — the printed page ends with `WO #S2-32231` — but "it appears at the end of the
document" is not the same as "it repeats on every page", which needs a genuinely multi-page print.
Related and also uncovered: **S3-E1** (10+ lines flow across pages; no line split mid-page if
avoidable). **Recommend adding a case for each** once Staging is back.

---

## What the source CONFIRMS about the 11 cases already passed

Each of these was checked against the live wording this pass and the case's Expected matches it:

| Case | Source rule, verbatim (abridged) | Agrees |
|---|---|---|
| [C45092](https://shopview.testrail.io/index.php?/cases/view/45092) | S2-R1 "work order number prominently at the top" | ✅ |
| [C45093](https://shopview.testrail.io/index.php?/cases/view/45093) | S2-R2 "status will be displayed next to the work order number" | ✅ |
| [C45096](https://shopview.testrail.io/index.php?/cases/view/45096) | S2-R5 "shop name or organization name will appear in the header area" | ✅ |
| [C45101](https://shopview.testrail.io/index.php?/cases/view/45101) | S3-R3 "Pricing is **never** shown … Rate, Margin, and Total columns are removed entirely" | ✅ |
| [C45102](https://shopview.testrail.io/index.php?/cases/view/45102) | S3-R4 "The Action column … and Progress column … are removed" | ✅ |
| [C45103](https://shopview.testrail.io/index.php?/cases/view/45103) | S3-R5 "printed in the same order they appear on screen (by line number)" | ✅ |
| [C45106](https://shopview.testrail.io/index.php?/cases/view/45106) | S3-R8 / S3-N3 "tech story row will be omitted entirely — no placeholder text" | ✅ |
| [C45112](https://shopview.testrail.io/index.php?/cases/view/45112) | S4-R1 "Total actual time / Total estimated time across all lines" | ✅ |
| [C45113](https://shopview.testrail.io/index.php?/cases/view/45113) | S4-R2 "Pricing is **never** shown in the summary … Only time totals" | ✅ |
| [C45114](https://shopview.testrail.io/index.php?/cases/view/45114) | S4-R3 "print timestamp (date and time of printing) … at the bottom" | ✅ |
| [C45117](https://shopview.testrail.io/index.php?/cases/view/45117) | S5-R1 full hidden-element list | ✅ |

**No case's Expected disagrees with the source.** The suite is sound; the two problems above are in
the source and in coverage, not in our cases.

## Still to check when Staging returns, with the source rule each needs

**S5-R2** black text on white regardless of theme · **S5-R3** text no smaller than 10pt ·
**S5-R4** portrait on US Letter / A4 · **S5-E1** landscape still readable, no overflow ·
**S3-R7** thick border and blank note space between line groups ·
**S3-R1/R2** line and part detail with a tech story and technicians present ·
**S3-E2** a 500+ character tech story wraps and prints in full ·
**S6-R1…E1** the audit trail (print logged, user and time recorded, visible in History, logged even
when the dialog is cancelled, one entry per print).
