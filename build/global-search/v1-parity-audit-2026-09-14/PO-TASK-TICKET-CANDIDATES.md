# V1 → V2 CAPABILITY LOSSES — TASK TICKETS FOR THE PRODUCT OWNER

**Date:** 2026-09-14 · **Project:** Global Search V2 (epic **SV-9160**) · **Author:** QA (Bilal) session
**Branch:** `claude/global-search-v1-baseline-6ax9ul` · **Run:** 415 · **Section:** 6769

## THE RULING THIS DOCUMENT IMPLEMENTS

QA lead, 2026-09-14, verbatim:

> *"if it is n[o]t working on V2 and works on V1 we need a task ticket for that too … no matter the
> specs of V2 are disallowing this to happen we have to ensure that V1 things are doable in V2"*

Sharpened by the QA lead the same day, verbatim:

> *"You made a mistake looking at V2 specs to see if that is intentionally not there due to the specs
> in V2. You were not supposed to do that. For your this task your V1 was supposed to be considered
> the specs"*

## 🔴 THE OPERATING PRINCIPLE FOR THIS SUITE — READ IT BEFORE ANYTHING ELSE

**FOR THE V1 REGRESSION SUITE, V1 *IS* THE SPECIFICATION.** Not PRD v1.5. Not the epic. Not the
designs. The behaviour of the shipped V1 product, as established from its source code, is the
requirement this suite tests against, and **it is the only one.**

Therefore, when deciding whether a case must exist, **the V2 specification is not consulted at all.**
The only question is:

> **Could a user do this in V1?**

If yes, there is a case. Whether V2's specification mentions it, omits it, or explicitly forbids it
changes **nothing** about whether the case exists — that is a question about the *outcome* of the test,
to be settled by the Product Owner after the test has run, and never a reason not to run it.

**What I got wrong, plainly.** I read each V1 behaviour, checked whether PRD v1.5 had deliberately
changed it, and where it had, I wrote the behaviour off as "correctly excluded — not a gap." That is
using the thing under test as the standard it is tested against. It is the same error Standing Rule 57
names (*expected behaviour comes from the documents, never from the build*) wearing a different coat:
here the V2 document was allowed to excuse a V1 capability out of existence. The catalogue-only part is
the clean illustration — it is searchable in V1, it is not searchable in V2, and **that alone** makes
it a test case and a ticket. Whether PRD v1.5 §4 says "Parts (Inventory)" is irrelevant to whether we
test it.

**This overturns §2 of `v1-coverage-audit-2026-09-10/V1-COVERAGE-GAP-AUDIT.md`** ("CORRECTLY EXCLUDED —
V1 behaviour V2 deliberately changes (do NOT add regression cases)"). That table was wrong. A V2
specification that deliberately removes a V1 capability does **not** discharge the regression suite —
it is precisely the case that must exist, because the customer never read the specification. The
specification decides whether the loss is *acceptable*; it does not decide whether the loss is *tested*.

**Every row below therefore gets BOTH a test case AND a task ticket for the PO to confirm or reject.**

---

## 1 · WHAT CHANGED IN THE SUITE TODAY

Eighteen cases were added to section 6769 and synced union-only into run 415 (139 → **157** tests,
**0 lost**). Four of the eighteen were previously excluded on the reasoning the QA lead has now overturned;
the other fourteen were simply missed — a nearby case had been assumed to cover them.

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

Section 6769 is now **58 cases**. Run 415 is **157 tests**.

**Second batch — nine more, all "simply missed":**

| Case | Title | What it protects |
|---|---|---|
| [C55667](https://shopview.testrail.io/index.php?/cases/view/55667) | Finding a customer by company name | The most basic search in the product had no regression case |
| [C55668](https://shopview.testrail.io/index.php?/cases/view/55668) | Finding a vendor by name | Same, for vendors |
| [C55669](https://shopview.testrail.io/index.php?/cases/view/55669) | Finding an asset by its VIN, in full and in part | The only VIN case asserted V2's exact-only rule, so V1 parity was never tested |
| [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) | Finding a customer or vendor by a contact's first or last name | Looking a company up by the person you speak to |
| [C55671](https://shopview.testrail.io/index.php?/cases/view/55671) | Search finds records whatever mix of capitals is typed | V1 lower-cased both sides; nothing tested it |
| [C55672](https://shopview.testrail.io/index.php?/cases/view/55672) | Finding a work order by its plain number with no prefix | V1 stored the bare number as a value in its own right |
| [C55673](https://shopview.testrail.io/index.php?/cases/view/55673) | Pressing Enter opens the top result without arrowing to it | V1 auto-highlighted the first row; type-then-Enter was the common path |
| [C55674](https://shopview.testrail.io/index.php?/cases/view/55674) | Search can be reached on a phone and a tablet as well as a desktop | Technicians work from phones |
| [C55675](https://shopview.testrail.io/index.php?/cases/view/55675) | A search that matches nothing says so plainly | V1 showed a no-results message rather than an empty list |

**Twenty existing cases were also corrected.** C45142–C45161 had been authored citing PRD v1.5 as the
source of their expectation. Each was re-derived against its V1 invariant and re-stamped. One,
**C45153**, had actually been *edited away from* the V1 behaviour to follow spec v1.3 — it has been put
back. Full detail in `V1-CAPABILITY-COVERAGE-PROOF.md` §4–§5.

**Coverage is now proved, not asserted:** `V1-CAPABILITY-COVERAGE-PROOF.md` maps all **65** V1
capabilities (37 searchable fields extracted mechanically from the V1 SQL, plus 28 behaviours) to cases,
and checks live against TestRail that every mapped case exists and sits in run 415. Zero gaps, zero
cases serving no V1 capability.

---

## 2 · TICKET CANDIDATES — GROUP A: CONFIRMED BUILD DEFECTS

*(V1 could · V2 cannot · **observed live** on `sv9160.qa.shopview.com`, 2026-09-14.)*

**A1–A4 are tickets because V1 could do it and V2 cannot. Full stop.** **A5 is a straight build failure** — not a V1 comparison at all, but it blocks a case in this suite, so it is carried here rather than lost. The extra fact that
PRD v1.5 also says these should work is recorded only because it makes the ticket unarguable — it is
**not** the reason the ticket exists, and its absence would not have removed one.

| # | Summary | Evidence (reproduce exactly) | Spec says | Case |
|---|---|---|---|---|
| **A1** | An asset cannot be found by its unit number | Search `ZZT-4471` and `ZZT4471` → **0 results**. The same asset IS returned by `ZZAUTOTESTBridgeport`, so it is indexed | PRD v1.5 §4 indexes **unit number** for Assets | [C53580](https://shopview.testrail.io/index.php?/cases/view/53580) |
| **A2** | An asset cannot be found by its full VIN, though the VIN prefix works | Search `1FUJGLDR9KLZZ4471` → **0 results**; `1FUJGLDR9KL` → returns the asset | §4 indexes **VIN**; §7 requires exact match after normalization. A prefix succeeding while the exact value fails points at a length or tokenisation bug | [C53516](https://shopview.testrail.io/index.php?/cases/view/53516) |
| **A3** | A vendor cannot be found by email address | Search `parts@kestrelsupply-zzt.com` → **0 results** | §4 explicitly indexes vendor **email** | [C53584](https://shopview.testrail.io/index.php?/cases/view/53584) |
| **A4** | A stocked inventory part cannot be found by its own part number | **Controlled experiment.** Two parts created minutes apart, same vendor / category / tags; one stocked (qty 25), one not. The stocked part `ZZT-88-4412` IS returned by its description (`Kestrel`, `Brake Chamber`) but **its own part number returns nothing**. Same record, same moment → rules out indexing lag, org scoping and permissions | §4 indexes **part number** for Parts | [C55666](https://shopview.testrail.io/index.php?/cases/view/55666) |

| **A5** | **A work order / part sale cannot be created** | **Reported by the QA lead from the UI: part sales are not being created.** Corroborated from the API: `POST /api/work-orders/create` returns **HTTP 500** for the minimal valid payload (`company_id` alone — the only non-nullable field on `CreateCommand`), with and without `X-Location-ID`. Six request ids captured, listed below. The same endpoint created work orders S9160-17580…17583 **earlier the same day** | This is a build failure, not a product decision — nothing in any specification permits a 500 | *(blocks C55665; no case asserts it)* |

**Request ids for A5** — hand these to engineering, they resolve to the exact stack traces:
`465ccf15-369a-4217-bd41-4c861f2c6648` · `6e58db29-a136-403e-9140-35b731d34e29` ·
`8adc4b7b-f5fb-42b3-9b53-a409c31cf970` · `d630fc5e-5017-4c5b-83c4-8401243fcc47` ·
`d50aeb87-834d-4e0b-9d87-59f9990ca365` · `4bf25333-5d4c-458e-82af-e12a5cae4856`

**What A5 does NOT yet establish, and the execution session should close:** whether the UI failure and
the API 500 are the same bug, and whether this session's signed-in user simply lacks
`ROLE_WORK_ORDER_CREATE_AND_EDIT` (which ought to return 403, not 500 — a permission error surfacing as
a 500 would itself be the defect). **Reproduce it once in the browser and capture the request id from
the network tab**; that settles both questions. Note also that `/api/work-orders/create` takes **no
`type` field at all** — it is service-only, and the part sale is produced by the
`CreateDefaultPartSaleLineOnWorkOrderCreatedEvent` listener, so "part sales are not created" may be a
failure in that listener rather than in creation itself.

**A1–A4 share one shape: free text matches, identifiers do not.** They are very likely **one root
cause** in how identifier fields are tokenised or normalised, not four separate bugs. Recommend filing
A1–A4 and letting engineering collapse them if they prove to be one fix — **a fleet user searching a
unit number is the single most common search in the product**, so this is the highest-risk finding on
the page.

---

## 3 · TICKET CANDIDATES — GROUP B: OBSERVED LOSSES WHERE V2's SPEC HAPPENS TO BE SILENT

*(V1 could · V2 cannot · **observed live**, 2026-09-14.)*

**These are tickets on exactly the same footing as Group A.** The only difference is that PRD v1.5 does
not mention the field, so the PO has a genuine decision to make about whether to restore it — but the
*ticket* is owed either way, and the spec's silence is never a reason to close one without a ruling.

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

## 4 · TICKET CANDIDATES — GROUP C: LOSSES V2's SPEC DELIBERATELY INTENDS, NOT YET OBSERVED

*(V1 could · **not yet tested on the build** — these are the four the earlier audit wrongly closed.)*

🔴 **These are the rows the mistake was made on, so read the principle above before judging them.**
That PRD v1.5 *deliberately* removes each of these is **not** a reason to skip the case — it is the
reason the case matters most, because a deliberate removal is the kind nobody re-examines. The cases
exist now; raise the tickets when the run produces the result, or earlier if the PO wants to rule
ahead of the evidence.

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

## 6 · WHO FILES THESE — the execution session, not this one

**QA lead ruling, 2026-09-14:** the tickets are to be filed by **session `manual-test-cases-c2`**
(session `session_01FWbxRKg4riKCp3gpbbwYzA`, branch `claude/test-execution-defects-cdrjsq`), because
that session holds the defect-filing skill and the Jira access.

**What that session needs, and it is all in this file:**

| It needs | Where it is |
|---|---|
| The 16 candidates, each with V1 evidence, the exact query, and the observed V2 result | §2, §3, §4 above |
| The ticket shape — issue type, parent, priority, links, title pattern | §5 below |
| The TestRail case each one maps to | the Case column in every table |
| The request ids for A5 | §2 |
| The V1 code citations | every row, and `V1-CAPABILITY-COVERAGE-PROOF.md` |
| The rule that governs the framing | Standing Rule 109 |

**It must still ask for permission per ask (Rule 62) and clear the Rule 94 admissibility gate on each
one.** This document is a set of approved candidates, not an instruction to file.

## 6a · NOT FILED BY THIS SESSION — AND WHY

**Nothing in this document has been filed in Jira.** Standing Rule 62 puts a creation hold in place
(QA lead, 2026-08-10: *"Do not create anything until my next order."*) and makes permission **per
ask** — an approval for one batch never covers a later one. The 2026-09-14 ruling reads as that next
order, but a Jira ticket is a write into a real production system and is awkward to unpick, so this
session is not going to assume it.

**This session files none of them.** They go to `manual-test-cases-c2` per §6.

---

## 7 · ONE FINDING RETRACTED — AND NOW RE-TESTED AND SETTLED

`qa-seed-2026-09-14/EARLY-SIGNALS-FROM-SEED-VERIFICATION.md` listed `BIN-ZZT-77` returning nothing as
a signal. **That was not a valid negative and it is withdrawn.** The bin location `BIN-ZZT-77` did not
exist as a record — only the free-text `grid_location` field on one inventory part carried that string.
Searching for a record that was never created and finding nothing proves nothing.

The QA lead has since created the bin location. **The check must be re-run**, and re-run twice, because
the Edit Inventory Part dialog shows that "bin location" is **two different things**: a selectable
**Bin Location record**, and the free-text **grid location** on the part. PRD v1.5 §4 says Parts are
indexed on "bin location" without saying which — a Rule 58 ambiguity, so it is a PO question and not
something to settle by guessing at the build.

**RE-TESTED 2026-09-14 with fresh cookies, and the QA lead settled the ambiguity:** *"Bin Locations are
Grid locations"* — one concept, not two, managed at `/administration/bins`. **The PO question is CLOSED.**

**The proved result:** bin location search **works** in V2 (`H3B` → 13 parts, `General Storage` → 19),
but `BIN-ZZT-77` returns **0** even though the bin exists and part **P550848** sits in it with 555 units.
That same part **is** returned by `H3B`, its other bin. Same record, same field, two values, one indexed
and one not — the index holds a stale copy of the part's bin list.

🔴 **This is NOT a V1 regression and gets no case in section 6769.** V1 never indexed bin or grid
location — V1's part search text was `cp.name` and `cp.part_number` only
(`FetchDataQueryHandler.php:324-328`). Nothing was lost. It **is** a V2 defect against PRD v1.5 §4 and
§9, so it belongs to the V2 functional suite. Full evidence:
`qa-seed-2026-09-14/EARLY-SIGNALS-FROM-SEED-VERIFICATION.md`.

---

## OUTSTANDING — what I need from you

| # | What I need | Why it matters |
|---|---|---|
| 1 | **One word to file the 16 tickets** (4 defects + 11 PO decisions) | Rule 62 makes permission per-ask; they are written and ready |
| 2 | **Fresh QA cookies for `sv9160.qa.shopview.com`** | To re-run the bin-location check and to seed the missing Part Sale that C55665 needs |
| 3 | **A PO ruling on what "bin location" means** in PRD v1.5 §4 — the Bin Location record, or the part's free-text grid location? | Rule 58 — I will not resolve an ambiguous spec by guessing from the build |
| 4 | **Tell the execution session** that run 415 is now 157 tests, not 139 | It is mid-handoff and will otherwise work from a stale count |
