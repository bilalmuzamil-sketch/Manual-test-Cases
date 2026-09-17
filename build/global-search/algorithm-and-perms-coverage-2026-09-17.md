# Global Search — permissions (positive) + search-algorithm coverage & new cases (2026-09-17)

Sources read live 2026-09-17: PRD **576978945 v1.5** §6 (Ranking), §7 (Fuzzy), §9 (role-based access);
folders 6725 Fuzzy, 6726 Ranking, 6734 Permissions, 6723 Grouped-Results.

## A. Permissions — positive direction (WITH access, DOES see)
Gated map: Work Orders:View→Work Orders · Part Sales:View→Part Sales · Customers:View→Customers+Assets
· Catalog & Inventory:View→Parts · Vendor & Order Management:View→Vendors+POs+Vendor Invoices ·
See Financial Data→prices in rows.

| Gate | Positive case before | Action |
|---|---|---|
| Parts | C44877 | already covered |
| Work Orders | none | **NEW** |
| Customers (+Assets) | none | **NEW** |
| Part Sales | none | **NEW** |
| Vendors + POs + Vendor Invoices | none | **NEW** |
| See Financial Data (prices shown) | none (only masked, C44882) | **NEW** |

## B. Search algorithm — §6 Ranking
| Spec item | Case before | Action |
|---|---|---|
| Exact identifier pinned top (§6.1/§6.2) | C44850, C44830 | covered |
| Within-group best-first (Work Orders signals, §6.1) | C44851 | covered |
| Parts: in-stock above out-of-stock (§6.1) | C44852 | covered |
| Purchase Orders signals (§6.1) | C45137 | covered |
| Vendor Invoices signals (§6.1) | C45138 | covered |
| Contextual bias — customer page / WO page (§6.3) | C44853, C44854 | covered |
| Contact-field = secondary-field score (§6.1) | C45139 | covered |
| Group display order (§6.2) | C44827, C44830 | covered |
| **Match-quality precedence: prefix (+0.70) > whole-word (+0.50) > fuzzy (+0.40)** | none | **NEW** (most sensitive) |
| **Customer signals (open WO, recently viewed)** | none | **NEW** |
| **Asset signals (open WO, recently viewed, year tie-break)** | none | **NEW** |
| **Vendor signals (open POs, used recently)** | none | **NEW** |
| **Part Sale signals (recency-dominant, created-by-you, Paid)** | none | **NEW** |
| **Parts signals: sold/used recently, recently viewed, bin present** | partial (C44852 in-stock only) | **NEW** |

## C. Search algorithm — §7 Fuzzy
| Spec item | Case before | Action |
|---|---|---|
| Trigram typo (Petersn→Peterson) | C44839 | covered |
| Damerau transposition (frieghtliner) | C44841 | covered |
| Phonetic fallback (Filbridge→Fibridge) | C44842 | covered |
| Identifier normalization WO/VIN/phone/part/P-number | C44843–46, C44849 | covered |
| Exact-only identifiers, no fuzzy | C44844, C44846, C44847, C44849 | covered |
| Soft-match visual indicator (≈) | C44848 | covered |
| **Short-query stricter threshold (≥0.80 for <4 chars vs ≥0.70)** | none | **NEW** |

## New cases created 2026-09-17 (see creation log)
5 permission-positive (6734) + 6 ranking (6726) + 1 fuzzy (6725) = 12 cases. All atm=1, type=2
(Functional), sourced to SV-9160 + PRD §6/§7/§9, added to the Global Search run, marked not yet
build-verified. C-ids recorded in build/global-search/new-cases-2026-09-17.json.
