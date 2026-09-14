# V1 → V2 CAPABILITY LOSSES — TASK TICKETS FOR THE PRODUCT OWNER

**Date:** 2026-09-14 · **Project:** Global Search V2 (epic **SV-9160**) · **Author:** QA (Bilal) session
**Branch:** `claude/global-search-v1-baseline-6ax9ul` · **Run:** 415 · **Section:** 6769

## THE RULING THIS DOCUMENT IMPLEMENTS

QA lead, 2026-09-14, verbatim:

> *"if it is n[o]t working on V2 and works on V1 we need a task ticket for that too … no matter the
> specs of V2 are disallowing this to happen we have to ensure that V1 things are doable in V2"*

**This overturns §2 of `v1-coverage-audit-2026-09-10/V1-COVERAGE-GAP-AUDIT.md`** ("CORRECTLY EXCLUDED —
V1 behaviour V2 deliberately changes (do NOT add regression cases)"). That table was wrong. A V2
specification that deliberately removes a V1 capability does **not** discharge the regression suite —
it is precisely the case that must exist, because the customer never read the specification. The
specification decides whether the loss is *acceptable*; it does not decide whether the loss is *tested*.

**Every row below therefore gets BOTH a test case AND a task ticket for the PO to confirm or reject.**

---

## 1 · WHAT CHANGED IN THE SUITE TODAY

Nine cases were added to section 6769 and synced union-only into run 415 (139 → **148** tests,
**0 lost**). Four of the nine were previously excluded on the reasoning the QA lead has now overturned;
the other five were simply missed.

| Case | Title | Why it did not exist before |
|---|---|---|
| [C55658](https://shopview.testrail.io/index.php?/cases/view/55658) | Finding a work order by typing its status still works | Excluded — "status was deliberately dropped at spec v12" |
| [C55659](https://shopview.testrail.io/index.php?/cases/view/55659) | Finding a record by typing only part of its number still works | Excluded — "identifiers are exact-only by design (§7)" |
| [C55660](https://shopview.testrail.io/index.php?/cases/view/55660) | Finding a record by a fragment from the middle of a word still works | Excluded — "substring matching was replaced by fuzzy scoring" |
| [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) | Every matching type still appears when a search matches many records | Excluded — "the 20-result cap is a deliberate change" |
| [C55662](https://shopview.testrail.io/index.php?/cases/view/55662) | Finding a customer by the company's own main phone number | **Missed** — assumed covered by the contact-phone case |
| [C55663](https://shopview.testrail.io/index.php?/cases/view/55663) | Finding a vendor by phone number | **Missed** — the only phone case uses a customer |
| [C55664](https://shopview.testrail.io/index.php?/cases/view/55664) | Finding an asset by its model | **Missed** — only the make was covered, via the fuzzy case |
| [C55665](https://shopview.testrail.io/index.php?/cases/view/55665) | Finding a part sale by its customer's name | **Missed** — only the work-order side was covered |
| [C55666](https://shopview.testrail.io/index.php?/cases/view/55666) | Finding a part by its part number still works | **Missed** — section 6769 only covered the part *description*; the part *number* had no regression case anywhere |

Section 6769 is now **49 cases**. Run 415 is **148 tests**.

---

## 2 · TICKET CANDIDATES — GROUP A: CONFIRMED DEFECTS
*(V1 could · V2 cannot · **and the V2 specification says it SHOULD work** — so this is a build defect,
not a product decision. Observed live on `sv9160.qa.shopview.com`, 2026-09-14.)*

| # | Summary | Evidence (reproduce exactly) | Spec says | Case |
|---|---|---|---|---|
| **A1** | An asset cannot be found by its unit number | Search `ZZT-4471` and `ZZT4471` → **0 results**. The same asset IS returned by `ZZAUTOTESTBridgeport`, so it is indexed | PRD v1.5 §4 indexes **unit number** for Assets | [C53580](https://shopview.testrail.io/index.php?/cases/view/53580) |
| **A2** | An asset cannot be found by its full VIN, though the VIN prefix works | Search `1FUJGLDR9KLZZ4471` → **0 results**; `1FUJGLDR9KL` → returns the asset | §4 indexes **VIN**; §7 requires exact match after normalization. A prefix succeeding while the exact value fails points at a length or tokenisation bug | [C53516](https://shopview.testrail.io/index.php?/cases/view/53516) |
| **A3** | A vendor cannot be found by email address | Search `parts@kestrelsupply-zzt.com` → **0 results** | §4 explicitly indexes vendor **email** | [C53584](https://shopview.testrail.io/index.php?/cases/view/53584) |
| **A4** | A stocked inventory part cannot be found by its own part number | **Controlled experiment.** Two parts created minutes apart, same vendor / category / tags; one stocked (qty 25), one not. The stocked part `ZZT-88-4412` IS returned by its description (`Kestrel`, `Brake Chamber`) but **its own part number returns nothing**. Same record, same moment → rules out indexing lag, org scoping and permissions | §4 indexes **part number** for Parts | [C55666](https://shopview.testrail.io/index.php?/cases/view/55666) |

**A1–A4 share one shape: free text matches, identifiers do not.** They are very likely **one root
cause** in how identifier fields are tokenised or normalised, not four separate bugs. Recommend filing
A1–A4 and letting engineering collapse them if they prove to be one fix — **a fleet user searching a
unit number is the single most common search in the product**, so this is the highest-risk finding on
the page.

---

## 3 · TICKET CANDIDATES — GROUP B: PO DECISIONS, OBSERVED
*(V1 could · V2 cannot · **the V2 specification is silent or excludes the field** — so the PO must rule
whether the loss is acceptable. Observed live, 2026-09-14.)*

| # | Summary — "V1 could find it this way, V2 cannot" | Query that returned 0 | Case |
|---|---|---|---|
| **B1** | A catalogue part that has never been stocked is no longer findable at all | Both seeded catalogue-only part terms | [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) |
| **B2** | A customer cannot be found by postal code | `44872-9931` | [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) |
| **B3** | A customer cannot be found by website | `bridgeporthauling-zzt.com` | [C53583](https://shopview.testrail.io/index.php?/cases/view/53583) |
| **B4** | A customer or vendor cannot be found by a contact's job title | `Dispatch Supervisor` | [C53603](https://shopview.testrail.io/index.php?/cases/view/53603) |
| **B5** | A vendor cannot be found by postal code | `43055-2210` | [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) |
| **B6** | A vendor cannot be found by state or province | `Ohio` | [C53606](https://shopview.testrail.io/index.php?/cases/view/53606) |
| **B7** | An asset cannot be found by licence plate | `OHZZT471` | [C53516](https://shopview.testrail.io/index.php?/cases/view/53516) |

**B1 is the one most likely to generate the complaint the QA lead is trying to prevent.** A parts
clerk who has searched the catalogue for years will type a part number for something the shop has
never stocked and get nothing.

---

## 4 · TICKET CANDIDATES — GROUP C: PO DECISIONS, PREDICTED BUT NOT YET OBSERVED
*(V1 could · the V2 specification deliberately changes the behaviour · **not yet tested on the build**.
These are the four the earlier audit wrongly closed. The test cases now exist; the tickets should be
raised once the run produces the result, unless the PO wants to rule ahead of the evidence.)*

| # | Summary | V1 evidence (code, baseline `55767168`) | What V2 does instead | Case |
|---|---|---|---|---|
| **C1** | A work order can no longer be found by typing its status | `FetchDataQueryHandler.php:113-116` folds `wo.status` into the work-order search text, underscores stripped, `quality_check` → `qualitycheckqc` | Status was removed from the indexed Work Order fields at spec **v12** | [C55658](https://shopview.testrail.io/index.php?/cases/view/55658) |
| **C2** | A record can no longer be found by typing only **part** of its number | `useGlobalSearch.ts:92` — the second pass matched the typed text **anywhere** inside the record's search text | §7 makes identifier fields **exact-match-only** and bypasses fuzzy logic, so a fragment no longer matches | [C55659](https://shopview.testrail.io/index.php?/cases/view/55659) |
| **C3** | A record can no longer be found by a fragment from the **middle of a word** | `useGlobalSearch.ts:84-93` — substring match anywhere | §7 replaces substring matching with similarity scoring against a threshold; **silent** on mid-word fragments | [C55660](https://shopview.testrail.io/index.php?/cases/view/55660) |
| **C4** | A matching entity type can be squeezed out of the results entirely | `useGlobalSearch.ts:152` — up to 3 rows **per type**, and **no overall cap**, so every matching type was always shown | §5.2 caps the whole list at 20 and §2 rules out pagination; **silent** on whether a matching type may get zero rows | [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) |

**C2 deserves the PO's attention most.** "Type the last few digits of the work order" is how the shop
floor actually searches. V1 supported it as a side-effect of substring matching; V2's exact-only
identifier rule removes it by design, and nobody appears to have weighed that trade-off explicitly.

---

## 5 · THE PROPOSED TICKET SHAPE

Per the repo's ticket standard (Rules 52, 53) and the QA lead's wording (*"task ticket … for the PO to
confirm if that is acceptable"*):

| Field | Group A (defects) | Groups B and C (PO decisions) |
|---|---|---|
| Issue type | `Story Defect` | `Task` |
| Parent | the **owning story** under SV-9160 (never the epic — an Epic parent is rejected HTTP 400) | the **owning story** under SV-9160 |
| Priority | `Medium` (never `High`) | `Medium` |
| Links | `relates to` the owning story | `relates to` the owning story |
| Body | V1 behaviour + code citation · exact query · observed V2 result · spec clause that says it should work | V1 behaviour + code citation · exact query · observed or predicted V2 result · **the question: is this loss acceptable?** |
| Title pattern | "Global Search V2: \<thing> cannot be found by \<field>" | "Global Search V2 — PO decision: is losing \<capability> acceptable?" |

---

## 6 · NOT YET FILED — AND WHY

**Nothing in this document has been filed in Jira.** Standing Rule 62 puts a creation hold in place
(QA lead, 2026-08-10: *"Do not create anything until my next order."*) and makes permission **per
ask** — an approval for one batch never covers a later one. The 2026-09-14 ruling reads as that next
order, but a Jira ticket is a write into a real production system and is awkward to unpick, so this
session is not going to assume it.

**Say the word and all fifteen go in, one at a time, each through the Rule 94 admissibility gate.**

---

## 7 · ONE FINDING RETRACTED

`qa-seed-2026-09-14/EARLY-SIGNALS-FROM-SEED-VERIFICATION.md` listed `BIN-ZZT-77` returning nothing as
a signal. **That was not a valid negative and it is withdrawn.** The bin location `BIN-ZZT-77` did not
exist as a record — only the free-text `grid_location` field on one inventory part carried that string.
Searching for a record that was never created and finding nothing proves nothing.

The QA lead has since created the bin location. **The check must be re-run**, and re-run twice, because
the Edit Inventory Part dialog shows that "bin location" is **two different things**: a selectable
**Bin Location record**, and the free-text **grid location** on the part. PRD v1.5 §4 says Parts are
indexed on "bin location" without saying which — a Rule 58 ambiguity, so it is a PO question and not
something to settle by guessing at the build.

**Blocked on:** the QA session cookies for `sv9160.qa.shopview.com` have expired from `/tmp` (Rule 82 —
secrets are never committed, so they do not survive the container). Fresh cookies and the check takes
two minutes.

---

## OUTSTANDING — what I need from you

| # | What I need | Why it matters |
|---|---|---|
| 1 | **One word to file the 15 tickets** (4 defects + 11 PO decisions) | Rule 62 makes permission per-ask; they are written and ready |
| 2 | **Fresh QA cookies for `sv9160.qa.shopview.com`** | To re-run the bin-location check and to seed the missing Part Sale that C55665 needs |
| 3 | **A PO ruling on what "bin location" means** in PRD v1.5 §4 — the Bin Location record, or the part's free-text grid location? | Rule 58 — I will not resolve an ambiguous spec by guessing from the build |
| 4 | **Tell the execution session** that run 415 is now 148 tests, not 139 | It is mid-handoff and will otherwise work from a stale count |
