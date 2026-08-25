# TestRail parent-folder (group) links — per project

**Convention (per QA lead, 2026-08-25):** the link points at the **parent folder (group)** in
TestRail suite 1. **The test cases are NOT directly in this folder — they live in the sub-sections
inside it.** `group_id` is the parent group id. Suite is always **1 ("Master")**, project 1.

| Project | group_id | Parent-folder link |
|---|---|---|
| **Digital Inspections V2** | **6658** | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6658 |
| **Global Search V2** | **6720** | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6720 |
| **Simple Flow V2** | **6665** | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6665 |
| **Invoice UI Refresh** (Invoice Refresh) | **6559** | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6559 |
| **Inline Add and Edit Parts** (authored 2026-08-25 — 96 cases) | **6597** | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6597 |
| **Printer Friendly Work Orders** (authored 2026-08-25 — 44 cases) | **6617** | https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6617 |

All six suites were authored by us and imported into TestRail by the QA lead (we made no TestRail writes). Live C-IDs are now recorded per project — see the C-ID backfill note below.

## C-ID backfill status
**2026-08-25:** connected to TestRail (project 1 "ShopView - APP", suite 1) read-only and confirmed
all six suites live with matching counts (DI-V2 43 · GS 97 · SFv2 61 · Invoice 87 · Inline 96 · PFWO 44
= 428). Every project's `testrail-id-map.csv` now carries the live **C-ID** for each case, so future
updates can target cases precisely. Two Global Search titles drifted on import — see
`build/global-search/TESTRAIL-TITLE-DISCREPANCIES-2026-08-25.md`.
