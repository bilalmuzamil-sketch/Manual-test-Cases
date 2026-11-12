# A/R and A/P upgrade — does the EXISTING data and behaviour stay the same?

Purpose: the before/after check behind the TestRail folder of 13 tests (section 133628, under "A/R and A/P Report
Sorting, Export and Location Filter"). A snapshot is taken **before** the feature lands on an environment, and the
same screens are checked **after** it lands. A difference the PRD does not ask for is a regression.

## Where and when (QA lead, 12 Nov 2026 — Rule 122)

| Order | Environment | When | Folder | Why |
|---|---|---|---|---|
| 1 | **Staging** | Snapshot BEFORE the feature is migrated to staging (12 Nov 2026); re-check AFTER it lands | `staging-before-feature-captured-2026-11-12/` | Finds a regression **before customers can see it**, while it can still be fixed before the release |
| 2 | Production | Snapshot taken 10 Nov 2026; quick confirmation after the 19 Nov release | `production-before-release-captured-2026-11-10/` | Last-line confirmation on real data; no longer the main check |

A before/after comparison is only valid on the **same** environment: a staging "after" is compared with the staging
"before", never with the production snapshot (different data).
