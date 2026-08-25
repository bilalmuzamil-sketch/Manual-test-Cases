# Global Search — TestRail vs local title discrepancies (found 2026-08-25 during C-ID backfill)

Two live TestRail cases have titles that differ from our local case files. Both are now mapped in
testrail-id-map.csv, but the wording differs — reported, not silently changed (Rule 12/86).

| Case | Our local title | Live TestRail title | Likely cause |
|---|---|---|---|
| **C44864** (GS-NORES-01) | No matches shows 'No results for **\<query\>**' plus the three quick-create buttons | No matches shows 'No results for **' plus the three quick-create buttons | The `<query>` placeholder was **stripped on import** — TestRail treated the angle-bracket token as markup. The live case now reads "No results for '' " with the placeholder gone. **Action:** on the next authorised update, re-word to a non-angle-bracket placeholder (e.g. "No results for [query]") so it survives import. |
| **C44897** (GS-CUT-02) | Old global-search path is removed on direct rollout (**no feature flag**) | Old global-search path is removed on direct rollout (**no Global Search feature**) | The imported CSV carried an **earlier title** than our current local file, OR the case was edited in TestRail after import. A wording divergence to reconcile. **Action:** confirm which wording is intended and align on the next authorised update. |

Neither is a content/behaviour defect in the test itself; both are title-text drift. No TestRail write
was made — these are queued for the next authorised `update_case` pass (Rule 6/62).
