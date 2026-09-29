# Search Results Integrity — a separate suite for "the results disappointed me"

**Created:** 2026-09-29 · **Project:** Global Search · **Epic:** SV-9160 · **Story:** SV-9170
**Status:** authored, **not pushed to TestRail** (Rule 62 creation hold is in force)

---

## Why this folder exists, separately

The existing Global Search suites test whether search **finds** the right records — ranking, fuzzy
matching, permissions, the algorithm. This suite tests something different and, on the evidence of
the last week, more fragile: whether the row the user is looking at **tells them what they need to
know**.

It was opened after two defects — [SV-10619](https://shopview.atlassian.net/browse/SV-10619) and
[SV-10551](https://shopview.atlassian.net/browse/SV-10551) — turned out to be the same failure, and
after the QA lead put the damage in one sentence:

> type `123786`, and a row that shows only `786` is indistinguishable from a row for `185786`.

Kept separate because it has a different question, a different trigger for re-running (a front-end
change, not a ranking change), and a different audience — most of it is readable by someone who has
never seen the spec.

---

## What is in here

| File | What it is |
|---|---|
| `WHY-SEARCH-RESULTS-DISAPPOINT-Root-Cause-Analysis.md` | **Read this first.** The measured and code-traced reason this family of bugs exists — the four questions every case asks, and why they fail |
| `SOURCES.md` | Every sentence the cases quote, pinned to its document and version (Rule 113) |
| `PO-QUESTIONS.md` | The 10 questions that must be answered before 32 of the cases can assert anything |
| `cases/` | The 110 cases, one file per tab plus a cross-tab file |
| `build_cases.py` | Regenerates the per-tab cases from one hand-authored table — rerun it when the PRD moves |

## The 110 cases

| File | Tab | Cases |
|---|---|---|
| `cases/WO-work_orders.md` | Work Orders | 12 |
| `cases/CUST-customers.md` | Customers | 15 |
| `cases/ASSET-assets.md` | Assets | 9 |
| `cases/PART-parts.md` | Parts | 12 |
| `cases/VEND-vendors.md` | Vendors | 12 |
| `cases/PS-part_sales.md` | Part Sales | 9 |
| `cases/PO-purchase_orders.md` | Purchase Orders | 11 |
| `cases/VINV-vendor_invoices.md` | Vendor Invoices | 8 |
| `cases/ALL-cross-tab.md` | All + everything spanning tabs | 22 |

## The classes, and the end-user expectation each one encodes

| Class | The user's expectation, in their words | Cases |
|---|---|---|
| **A** | "Show me the whole value you matched on" | 24 |
| **B** | "Let me tell two similar records apart" | 16 |
| **C** | "Tell me why this row came back" | 32 — **all HELD, see Q1** |
| **D** | "Show me everything the spec promised" | 8 |
| **E** | "Do not lie to me about how many there are" | 7 |
| **F** | "Accept it the way it is written down" | 6 |
| **G** | "Do not fall over on ordinary but awkward data" | 5 |
| **H** | "Say 'nothing found' honestly" | 3 |
| **I** | "A corrected typo must admit it corrected something" | 8 |
| **K** | "Do not show me what I am not allowed to see" | 1 |

---

## How these cases are written, and the one rule that shapes them

Every Expected Result is a **verbatim quote** from the PRD or the story, with the document and
version named (Rule 113). Nothing is paraphrased or tidied, and nothing is written towards what the
build happens to do — a case rewritten to match the thing it tests can never fail.

**Where the spec is silent, the case says so and is HELD.** That is 32 of the 110, all in Class C,
all waiting on PO question Q1. They were written anyway rather than skipped, because an unwritten
case is exactly how this family of defect reached customers in the first place.

Two things were used from the running system, and only these two: the **labels** a tester will see,
and the **facts** in the root-cause analysis. Neither is a source of expectation (Rule 57).

---

## Before a tester runs any of this

1. **Seed the data.** Most cases need two records that deliberately share a fragment. The seeding kit
   is at `build/global-search/seeding/` — but **no manifest yet builds the pairs these cases need**.
   That is the next piece of work and it is on me; see `PROJECT-STATE.md`.
2. **Read the root-cause analysis.** A tester who knows the four questions will find things these
   cases did not think to ask.
3. **Record, do not judge.** Several cases end "record what you see and do not judge it" — those are
   the held ones. A tester guessing an expectation is how a spec gap becomes a wrong verdict.
