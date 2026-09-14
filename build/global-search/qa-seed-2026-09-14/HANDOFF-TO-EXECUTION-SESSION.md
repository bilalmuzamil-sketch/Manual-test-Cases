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

## 🔴 DO THESE TWO THINGS BEFORE YOU START

**1. A 10-minute UI build-verification. I could NOT do it and I am not going to pretend otherwise.**
I verified the API layer end to end (`GET /api/search`, seeding, indexing) but **never opened the
UI** — Chromium in my sandbox cannot reach the QA host (5 retries, `ERR_CONNECTION_RESET`, while API
calls to the same host succeed; proxy status shows `ws_closed_mid_exchange`). Every one of these
cases is written as UI steps, so somebody must confirm, once:
  - you can sign in to `sv9160.qa.shopview.com`
  - `⌘K` / `Ctrl+K` opens the search modal, and clicking the header field does too
  - typing ≥2 characters returns grouped results with counts
  - Esc closes it
If those four hold, the whole suite is executable and you can run straight through. If the modal
does not open, **stop and report** — every case is blocked at step 1 and marking 40 cases Failed
would be noise.

**2. One seeding step remains (5 minutes, UI).**
Put **`ZZAUTOTEST Brake Chamber Kestrel` (`ZZT-88-4412`)** into inventory with **quantity > 0**, and
**leave `ZZAUTOTEST Airline Coupler Vernway` (`ZZT-77-3300`) untouched in the catalogue.** There is no
API route to stock a part (stock arrives via receive-order), which is why I could not do it. **The
contrast between those two parts IS the C53601 test** — without it C53601 and C53607 prove nothing.

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

## THINGS I DELIBERATELY DID NOT DO
- No test results recorded, no run marked, no tickets raised — yours.
- No Jira ticket (Rule 62 hold). TestRail case creation was authorized per-ask and is done.
- Nothing on production beyond read-only login + search reads to prove the V1 baseline.

## IF YOU THINK I GOT SOMETHING WRONG
I probably did somewhere. Two I already caught and corrected: a transient result that showed
`ZZT-4471` returning an asset (a clean re-query returned zero — the zero is reproducible), and a
"Kestrel" hit that was the **vendor**, not the part. Re-query before trusting any single observation.

=== end ===
