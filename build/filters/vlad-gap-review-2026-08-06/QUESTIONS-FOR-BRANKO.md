# QUESTIONS FOR BRANKO — 2026-08-06

**Standing Rule 55.** Branko owns **three** things — **Filters**, **Schedule** and **Global Search** —
so **every question below names its project and its screen on its own row**. A row read on its own, days
later, on a phone, must still be unambiguous.

**Plain words only (Rule 7).** No case numbers, no requirement numbers, no technical terms. Four
questions, each with a short "what happens now", the question, simple options, and a blank for the
answer. **The internal mapping is on the QA-only sheet at the bottom — please ignore that part.**

---

## Q1 — Filters · Work Orders page · the Status button on the Estimates and Completed tabs

**Project:** Filters · **Screen:** the Work Orders list, on the *Estimates* tab and the *Completed* tab
· **Piece of work:** the story about how filters behave on each tab (SV-8794)

**What happens now.** The Work Orders list has tabs across the top. Two of them — *Estimates* and
*Completed* — already show you only one kind of work order. There is also a row of filter buttons
below, and one of them is *Status*.

**Two answers are on record and they disagree.**

- **The written product description** says the *Status* button is **not shown at all** on those two
  tabs. It has said that since **14 May** and has never been changed.
- **You told us on 17 July** that the *Status* button **is shown, greyed out, and already filled in**
  with that tab's own status, and cannot be changed. Our QA lead agreed with that on 30 July, and the
  design drawing shows it that way too.

**The question.** Which one is right?

| | Option | Tick |
|---|---|---|
| **A** | The *Status* button is **not shown at all** on the Estimates and Completed tabs — the written description is right, and my July answer is out of date. | |
| **B** | The *Status* button **is shown, greyed out and already filled in** — my July answer stands, and **the written description needs correcting**. | |
| **C** | Something else — please describe it. | |

**Your answer:** ______________________________________________

**Why we are asking rather than choosing.** Four of our tests are **paused** on this. We have put them
back to option B, because that is what you and our QA lead actually decided, but the product currently
behaves like option A — so **one of the three needs to change** and it is your call which. If you pick
**B**, we will also raise it as a defect so the product can be fixed.

---

## Q2 — Filters · Parts pages and Reports pages · what each filter button should do

**Project:** Filters · **Screens:** the Parts pages (Inventory, Part Sales, Catalog, Returns, Credits,
Purchase Orders, Vendor Invoices, Vendors) and the Reports pages

**What happens now.** The new filter buttons have started appearing on some Parts pages and on one
report. **Nothing written down says what they are supposed to do**, so we can see them working but we
cannot say whether what they do is correct.

**The question.** Could we have the short product write-up for the Parts and Reports filters?

**Your answer / when:** ______________________________________________

**Why we are asking again.** **Ten of our tests have been paused on this for four weeks**, and our
automation engineer has now raised it independently. It is the single biggest blocker on this project.

---

## Q3 — Filters · Reports pages · the date filter and the page's web address

**Project:** Filters · **Screen:** any report that has a *Date Range* button · **Piece of work:** the
story about sharing a filtered view by link (SV-8796)

**What happens now.** When you pick a date range on a report, the page's web address changes so the view
can be shared or bookmarked. **Our tests check that the address changes; they do not check the exact
shape of it**, because nothing written down says what that shape should be. An engineering note suggests
one shape, but the product appears to do something different, and part of that same engineering note has
already been overtaken by your update of 4 August.

**The question.** Is the exact shape of the web address a product requirement we should be testing?

| | Option | Tick |
|---|---|---|
| **A** | No — it is enough that the link works when shared. Do not test the exact shape. | |
| **B** | Yes — it matters, and here is the shape it must be: ____________________ | |
| **C** | Ask engineering to settle it and write it down; treat it as their documentation, not as a test. | |

**Your answer:** ______________________________________________

---

## Q4 — Filters · Work Orders page on a phone · the *Imported* choice

**Project:** Filters · **Screen:** the Work Orders list **on a phone**, in the filter sheet ·
**Piece of work:** the mobile filter bar story (SV-8797)

**What happens now.** *Imported* sits in the Status list but behaves differently from the others: while
it is chosen, the other filters cannot be used. That much is written down, and we have now added a test
for it on a phone.

**But there is a second behaviour that is not written down anywhere.** We are told the product also does
the reverse: **if you pick an ordinary status last, *Imported* is quietly un-picked for you.**

**The question.** Is that reverse behaviour intended?

| | Option | Tick |
|---|---|---|
| **A** | Yes — picking an ordinary status last should automatically un-pick *Imported*. We will test it and it should be written down. | |
| **B** | No — that is not intended. | |
| **C** | Something else — please describe what should happen. | |

**Your answer:** ______________________________________________

**Why we are asking rather than testing it.** It only exists in the developers' own code checks. **We do
not turn something the code does into something the product must do** — that has to be your decision, or
it stops being a test of the product and becomes a description of it.

---
---

# QA-ONLY — question to case mapping (not for the reader above)

| Q | Row in Vlad's table | Source read | Cases affected | Blocking |
|---|---|---|---|---|
| **Q1** | **1** — `S9-R2` / `S9-R3` | spec v19 (text unchanged since v4, 2026-05-14) vs Branko Round-1 Q4=B 2026-07-17 vs QA-lead ruling 2026-07-30 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) · [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) · [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) · [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | **4 cases on `AUTOMATION: HOLD`**, and a possible defect ticket |
| **Q2** | **7** — Parts view chip sets | spec v19 §4 Key Decisions (defines no chips); Branko Q2/Q3/Q5/Q7 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) · [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) · [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) · [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) · [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) · [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) · [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) · [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) · [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) · [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) · new [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | **11 cases on HOLD** |
| **Q3** | **8** — Reports date-range URL contract | spec v19 §4 + `S11-R1`; tech plan **D19** (partly superseded by v18); 5 Aug live capture `?range=custom&range=…&range=…` | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) — **no case authored** | a gap left open on purpose |
| **Q4** | **11** — mobile Imported, second behaviour | `S2-R7`, `S2-N4`, Story 12 and every Branko answer searched: **0 occurrences**; exists only in `MobileAllFiltersSheet.spec.ts` | new [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) covers the documented half | one added assertion if he says yes |
