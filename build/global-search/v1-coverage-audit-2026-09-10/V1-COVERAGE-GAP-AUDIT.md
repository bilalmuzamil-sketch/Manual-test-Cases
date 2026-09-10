# GLOBAL SEARCH V2 — "DOES V2 STILL DO EVERYTHING V1 DID?" COVERAGE AUDIT

**Date:** 2026-09-10 · **Author:** QA (Bilal) session · **Read-only pass — no TestRail writes were made (Rule 6).**

**The question this answers:** at V2 launch, is there a test for every single thing V1 could do?

**Method (all three legs, so a gap is a fact and not an opinion):**
1. **What V1 could do** = the source-cited V1 baseline, `ShopView/shopview @ 55767168` (`develop`;
   Global Search FE+BE byte-identical to `main d9ce0e5`) — the invariant register `INV-01…INV-91`
   in `build/global-search/GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md`. Code enumerates every field,
   gate and edge case, including ones nobody wrote a case for.
2. **What V2 will test** = ALL **128** live cases in the TestRail Global Search tree (section 49 and
   its 24 descendants, suite 1 "Master"), read live 2026-09-10 — not just the 21-case regression
   section, because a "gap" in section 6769 that the V2 functional suite already covers is not a gap.
3. **The match was made on FULL CASE BODIES** (title + preconditions + steps + expected + BDD +
   mission/goals), not titles alone.

## 0 · HEADLINE

The regression suite (section **6769**, **21 cases**) is strong exactly where regressions are most
dangerous — **permissions, tenant/location scoping and navigation** (11 of its 21 cases) — and the V2
functional suite covers matching behaviour well (fuzzy, VIN, phone, part number, WO dash formats,
contact-match-returns-company).

**The one systematic hole: WHAT YOU CAN TYPE TO FIND A RECORD.** V1's SQL concatenated a wide
"haystack" per entity; several of those fields have **no searchability case anywhere in the 128.**
The trap that hides this: the suite has cases that prove a field is **DISPLAYED** in a result row
(`C44831` unit, `C44832`/`C44835` address) and it is easy to mistake those for proof the field is
**SEARCHABLE**. They are different behaviours — display is `Per-Entity Result Shape`, searchability
is the query path. **Every "display-only" row below was checked individually.**

## 1 · THE GAP REGISTER — V1 behaviour with NO test anywhere in the 128

| # | What V1 could do | V1 evidence (code) | Coverage found in the 128 | Verdict | Pri |
|---|---|---|---|---|---|
| G1 | **A just-created record is findable immediately.** V1 invalidated the cached search collection at 5 create/receive points, so a new customer/WO/part sale/received part appeared in search at once | `useGlobalSearch.ts:309-313` + 5 call sites (`ReceiveOrderDialog:322`, `Customer.vue:701`, `PartSales:424`, `WorkOrders:1914`, `Customers:265`) — INV-33 | **ZERO hits** for `newly created / just created / immediately findable / after creating` across all 128 bodies | **GAP** | 🔴 High |
| G2 | **Find an asset by its unit number.** `v.unit` was in the vehicle haystack | `FetchDataQueryHandler.php:285-293` — INV-04 | Only **display**: `C44831` shows unit on a WO row; `C44874` is the in-page WO list. No search-by-unit case | **GAP** | 🔴 High |
| G3 | **Find a work order by its customer's name.** V1 concatenated `c.name` into the WO haystack, so typing the customer found their work orders | `FetchDataQueryHandler.php:91-118` — INV-02 | All 5 hits are **display** (`C44831/44832/44833/44836`) or tab-scoping (`C44822`). No search-WO-by-customer-name case | **GAP** | 🔴 High |
| G4 | **Find a WO by its shop-prefixed number variants** — V1 accepted `S-1234`, `S1234`, `S12-1234`, `12-1234` (shop id injected 4 ways) | `FetchDataQueryHandler.php:91-118` (the `REPLACE` chain) — INV-02 | `C44843` covers **dash/space only** ("with or without the dash or a space"). The **shop-id-injected** forms are untested | **GAP (partial)** | 🟠 Med-High |
| G5 | **Find a vendor by email address.** `v.email` was in the vendor haystack | `FetchDataQueryHandler.php:155-164` — INV-05 | The 4 `e-mail` hits are all **contact-match** cases (`C45129/44895/44837/45139`). V1's customer contact haystack held first/last/title/**telephone** — not email; vendor email sat on the vendor record. Not covered | **GAP** | 🟠 Med |
| G6 | **Find a customer or vendor by street address, city, state/province or postal code** | Customer `:224-245`, Vendor `:155-164` — INV-03/INV-05 | `city` **0 hits** · `postal/zip` **0 hits** · `state/province` **0 hits** · `address` only **display** (`C44832/44835`) | **GAP** | 🟠 Med |
| G7 | **Find a customer by website** | `FetchDataQueryHandler.php:224-245` (`c.website`) — INV-03 | **ZERO hits** for `website` | **GAP** | 🟡 Low-Med |
| G8 | **Find an asset by its owning customer's name.** V1 put `c.name` in the vehicle haystack | `FetchDataQueryHandler.php:285-293` — INV-04 | Only **display** (`C44833` shows the owning customer) | **GAP** | 🟠 Med |
| G9 | **Work order results come back newest-first** (`start_date DESC`) | `FetchDataQueryHandler.php:124` — INV-18 | Recency is tested only for **Purchase Orders** (`C45137`) and **Vendor Invoices** (`C45138`). WO recency untested; `C44851` ("more relevant first") does not pin ordering | **GAP** | 🟠 Med |
| G10 | **A loading state while results are being fetched** (input disabled, "Loading…" placeholder) | `GlobalSearch.vue:12-14,147-149` — INV-43 | 3 `loading` hits are unrelated (tab counts, Show-all, the 20-cap). No loading/skeleton case | **GAP** | 🟡 Low |

## 2 · CORRECTLY EXCLUDED — V1 behaviour V2 deliberately changes (do NOT add regression cases)

Verified against the V2 delta already recorded in `build/global-search/regression-2026-08-26/REGRESSION-IMPACT-MATRIX.md`:

| V1 behaviour | V2 disposition | Where V2 tests the new behaviour |
|---|---|---|
| 6 result types (INV-01) | CHANGED → 9 entities | `6722` Scope Tabs (12) |
| Prefix + substring matching, no fuzzy (INV-11/12/13) | REPLACED by fuzzy | `6725` Fuzzy Matching (11) |
| 3 results per type (INV-14) | CHANGED → 5 | `C44824` |
| No total cap (INV-15) | CHANGED → 20 | `C53476` |
| 350 ms debounce (INV-31) | CHANGED → 150 ms | V2 functional |
| Part = catalog part (INV-06) | CHANGED → inventory part + stock badge | `C44834`, `C44852` |
| Invoices not searchable (INV-07) | ADDED as an entity | `6740` |
| Focus clears the query (INV-49) | CHANGED → query persists | `6729` (3) |
| Customer→Contact remap (INV-17) | CHANGED → no Contacts group; contact match returns the company, labelled "Contact match" | `C44895`, `C44837`, `C45129`, `C45139` |
| WO indexed on status | **CHANGED at spec v12** — status dropped | matrix note + PO-REG-6 |
| In-memory recents (INV-60/61/62) | REPLACED by a recent-entities API | `6728` (5) |

## 3 · TWO DISCREPANCIES TO RESOLVE (not gaps — do not guess)

1. **`C252 "Search for tags"` and `C1927 "Search For Grid Location"`** sit in the legacy root section
   **49**. **The V1 code baseline contains no tag field and no bin/grid-location field in any of the
   five global-search haystacks** (`FetchDataQueryHandler.php:75-343`). So either these cases test the
   **in-page inventory search** rather than global search, or they are stale. **NOT FOUND IN CODE as
   global-search behaviour — needs a human read of the two case bodies before they are treated as V1
   capabilities V2 must preserve.** Flagged, not resolved.
2. **`C1789 "Try global search from each page where search is visible"`** — a real V1 capability
   (global search rendered on desktop, tablet and mobile from the app shell, INV-50). V2's
   `6737` Page-Search Cutover (2 cases) covers the unified engine but not "reachable from every page".
   Worth confirming whether `C1789` is being carried into the V2 run.

## 4 · PROPOSED ADDITIONS — 12 cases, ready to push

Full bodies in `proposed-cases.json` (workspace shape: plain-English Preconditions / Steps / Expected,
Rule-54 provenance line, Rule-61 `AUTOMATION:` marker, titles ≤ 80 chars,
`custom_atmstatus:1` + `custom_automation_type:0` per the playbook §J).

**Every proposed case is a Rule-96 invariant: V2 spec v1.2 is SILENT on it, so silence defaults to
"must not change".** Where a silence is high-collateral it is marked as a PO decision item rather than
assumed — G4 (shop-prefixed formats) and G9 (WO recency vs the new ranking model) are the two where
V2's rewrite could legitimately have changed behaviour, so each carries a PO-question note.

**NOTHING WAS WRITTEN TO TESTRAIL.** Rule 6 requires explicit per-ask permission and this pass ran
unattended. `push_proposed_cases.py` performs the adds but refuses to run without `--confirm`.

## OUTSTANDING — what I need from you

1. **One word to push the 12 cases** into section 6769 (`python3 push_proposed_cases.py --confirm`).
2. **Read `C252` and `C1927`** (§3.1) — decide whether they are global-search V1 capabilities or
   in-page inventory search. I will not guess.
3. **Two PO decisions** if you want them settled rather than defaulted: G4 shop-prefixed WO number
   formats, G9 work-order recency under the new ranking model.
4. **FYI, not a blocker:** the TestRail **API key you supplied returns HTTP 401**; the account
   password authenticates fine. If you want key-based auth for scripts, the key needs regenerating.
