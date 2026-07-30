# Filters — TestRail per-op execution log — 2026-07-31

Authorized PARTIAL execution of `USEFULNESS-AUDIT-2026-07-31.md` (manifest:
`testrail-execution-manifest-2026-07-31.md`). Project 1 / suite 1 / group 4110 only.
**2 `update_case` ops, 0 add, 0 delete, 0 section ops, 0 run writes.**
Executor: `exec_push_2026-07-31.py`. Each entry was flushed to disk immediately after the call.

| # | Op | Internal ID | C-id | Section | Field | HTTP | re-GET verify |
|---|---|---|---|---|---|---|---|
| 1 | update_case/29558 | FLT-BAR-02 | C29558 | 4111 | `custom_preconds` | **200** | MATCH |
| 2 | update_case/29590 | FLT-ASSET-02 | C29590 | 4116 | `custom_expected` | **200** | MATCH |

### op 1 — FLT-BAR-02 (C29558)

- Reason: FIX-WORDING #1 — pin the tab: add the 'You are on the All tab' precondition
- HTTP **200**, response-body field MATCH, independent re-GET MATCH
- Title after: `Five filter chips appear in a fixed order, each with an icon, its name and a down arrow`
- refs after: `requirements.md Story 1 S1-R2; S1-R3`
- section_id after: `4111`

**Field value now live:**

```
1. You are signed in to the ShopView App on a desktop browser.
2. You are on the Work Orders page with the filter bar visible.
3. You are on the All tab (on the Estimates and Completed tabs the Status chip is shown greyed out and already filled in, so the chips do not all look the same there).
```

### op 2 — FLT-ASSET-02 (C29590)

- Reason: FIX-WORDING #2 — drop the over-broad expected 3 (the 'No' direction = FLT-ASSET-07 / C38878)
- HTTP **200**, response-body field MATCH, independent re-GET MATCH
- Title after: `Choosing Yes shows only work orders whose asset is on site`
- refs after: `requirements.md Story 6 S6-R2`
- section_id after: `4116`

**Field value now live:**

```
1. The table shows only work orders whose asset is currently on site.
2. Work orders whose asset is not on site are hidden.
```

## Result

- **2 / 2 ops HTTP 200 + re-GET MATCH.**
- 0 `add_case`, 0 `add_section`, 0 `delete_case`, 0 `delete_section`.
- **0 run/result writes** — no execution run was touched.
- Titles, `refs`, `section_id`, priority and type unchanged on both cases (the ≤80-char title trims are HELD).
- Pre-write snapshots: `pre-push-snapshot/`; post-write re-GETs: `post-push-verify/`.

