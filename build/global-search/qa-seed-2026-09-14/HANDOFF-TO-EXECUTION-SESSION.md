# === HANDOFF: Global Search V1-REGRESSION suite — ready to execute ===

**To:** `manual-test-cases-c2` [ref f9d47e] — session_01FWbxRKg4riKCp3gpbbwYzA
**From:** the session that authored the V1-regression cases and seeded the QA branch
**Date:** 2026-09-14

## WHAT THIS SUITE IS FOR — read this first, it changes how you judge a failure
These cases exist for **one** purpose: prove that **nothing a V1 customer could find has become
unfindable in V2.** They are a *no-loss* check. They are **not** a check that V2 is good, fast or
better — that is the V2 functional suite's job (sections 6721-6740). If a case fails here, a real
customer who could search that way yesterday cannot today.

## WHERE THE WORK LIVES (trust this over anything I say — Standing Rule 86)
```
Repo   : github.com/bilalmuzamil-sketch/Manual-test-Cases
Branch : claude/global-search-v1-baseline-6ax9ul
Verify : git fetch origin && git log --oneline origin/claude/global-search-v1-baseline-6ax9ul -8
Folder : build/global-search/qa-seed-2026-09-14/      (seed state + early signals + this file)
         build/global-search/v1-coverage-audit-2026-09-10/  (cases, seed data, coverage proof)
```

## WHAT TO RUN
| | |
|---|---|
| TestRail run | **415** "Global Search V2 — Full Suite" (139 tests) |
| Section | **6769** "Global Search V2 - V1 Regression Suite" (40 cases) |
| **The 19 authored in this pass** | **C53578-C53589, C53601-C53607** |
| The other 21 in 6769 | pre-existing (permissions, tenant/location scoping, navigation, recents) |
| Environment | `sv9160.qa.shopview.com` — dummy QA account, seed/modify freely, no cleanup needed |

## ✅ NOTHING TO DO BEFORE YOU START — BOTH PRE-STEPS ARE DONE

**1. UI build-verification: DONE (14 Sep).** I drove the V2 search in a real browser on this branch
(headless Chromium via the documented MITM bridge + boot2 SPA hydration). Confirmed working:
sign-in · the header **Search button** (`data-test-id="global_search_trigger"` — it is a BUTTON, not
V1's typeable field) opens a **centred modal** · **`Ctrl+k` opens it too** · a **scope tab strip**
(All · Work orders · Customers · Assets · Parts · Vendors · Part sales · Purchase orders · Vendor
invoices) each with a count · results grouped with counts · the announcement *"12 results found across
3 categories"* · **Esc closes**. Seeded data is visible in the UI. Evidence:
`UI-VERIFICATION-2026-09-14.md`. **You do not need a separate build-verification pass — start executing.**

⚠️ **One trap I hit so you don't:** an automated `Control+K` (capital K) sends Ctrl+**Shift**+K, which
the app correctly ignores (it listens for `e.key === 'k'`). **The shortcut works** — I nearly filed a
false defect on it, which would have wrongly failed C45156 and C44804.

**2. Seeding: DONE, including the part stock.** `ZZAUTOTEST Brake Chamber Kestrel` (`ZZT-88-4412`) is
in inventory with **quantity 25**; `ZZAUTOTEST Airline Coupler Vernway` (`ZZT-77-3300`) is deliberately
**catalogue-only**. Inventory = 1, catalogue = 2. **That contrast IS the C53601 test — do not stock the
second part.**

## SEEDED DATA (already created by me on the QA branch)
| Entity | Identity |
|---|---|
| Customer | ZZAUTOTEST Bridgeport Hauling — addr1 `1450 Kestrelway Industrial`, addr2 `Dock 7B`, city `Fernvale`, state `Ohio`, postal `44872-9931`, phone `(419) 555-0143`, website `bridgeporthauling-zzt.com` |
| Contact | Marlene Okonkwo, title **Dispatch Supervisor**, `(419) 555-0177` |
| Asset | 2019 Freightliner Cascadia — unit `ZZT-4471`, VIN `1FUJGLDR9KLZZ4471`, plate `OHZZT471` |
| Vendor | ZZAUTOTEST Kestrel Parts Supply — `88 Halbrook Trace`, `Marnston`, `Ohio`, `43055-2210`, `parts@kestrelsupply-zzt.com` |
| Parts | catalogue-only `ZZT-77-3300` · to-be-stocked `ZZT-88-4412` |
| Work orders | `S9160-17580` `17581` `17582` `17583` — same customer + asset. **Shop number = 9160** |

Exact IDs: `qa-seed-state.json`. Runtime values: `seed-data.json` → `_runtime_values`.

## 🟠 THE RULE FOR THE 9 "PO DECISION" CASES — UPDATED 2026-09-14 BY THE QA LEAD
**C53579 · C53582 · C53583 · C53585 · C53601 · C53602 · C53603 · C53606 · C53516**

**RUN every one of them. Do not skip any.** If one fails:
- mark it **Blocked**, with the reason *"V1 behaviour, not listed in PRD v1.5 §4 — awaiting Product
  Owner ruling"*
- do **NOT** mark it Failed and do **NOT** raise a defect

Those fields are absent from PRD v1.5 §4, so a failure is a **scope question, not a bug**. Blocked
keeps the question visible; skipping loses it. The instruction is written inside each case too.

## WHAT I ALREADY OBSERVED (signals, not results — you own the verdicts)
Full detail + reproduction queries: `EARLY-SIGNALS-FROM-SEED-VERIFICATION.md`.

**Looked fine:** customer name · address 1 · **address 2** · city · contact surname · **name with
spaces removed** · vendor address · vendor city · VIN *prefix* · **work orders by customer name (all
4, newest first)** · **part by description**.

**Did not reproduce:** customer postal code · website · contact job title · **asset unit number** ·
**asset full VIN** · licence plate · **vendor email** · vendor postal code · vendor state ·
**catalogue-only part**.

🔴 **A pattern worth testing early: free-text matching works, exact identifiers do not.** Part numbers
of three *real pre-existing stocked* parts (`P550848`, `2--83-2511PK`, `84-2005`), the full VIN, the
unit number and the vendor email all failed, while the same records came back by name. PRD §7 requires
identifiers to match exactly after normalization, so **these are defect candidates, not scope cuts** —
and they also threaten existing cases **C44844 (VIN)** and **C44846 (part number)**.

**Run the work-order number search (`S9160-17580`) first.** I never probed it in isolation; if the
identifier path is broken generally it will fail, and it is the most-used search in the product.

🔴 **The identifier finding is now airtight, via a controlled pair.** The stocked part is provably in
the index — searching its description (`Kestrel`, `Brake Chamber`) returns it — yet searching **its own
part number `ZZT-88-4412` returns nothing**. That rules out indexing lag, wrong org and permissions.
Same shape as asset unit number, full VIN and vendor email. PRD §4 indexes part number and §7 requires
identifiers to match exactly after normalization, so **these are defect candidates, and C44846 and
C44844 are at risk too**. Also `BIN-ZZT-77` (bin location, indexed per §4) returns nothing — outside my
19 cases, but worth a look.

## THINGS I DELIBERATELY DID NOT DO
- No test results recorded, no run marked, no tickets raised — yours.
- No Jira ticket (Rule 62 hold). TestRail case creation was authorized per-ask and is done.
- Nothing on production beyond read-only login + search reads to prove the V1 baseline.

## IF YOU THINK I GOT SOMETHING WRONG
I probably did somewhere. Two I already caught and corrected: a transient result that showed
`ZZT-4471` returning an asset (a clean re-query returned zero — the zero is reproducible), and a
"Kestrel" hit that was the **vendor**, not the part. Re-query before trusting any single observation.

=== end ===
