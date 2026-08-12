# Schedule — TestRail execution log, verify-final, 2026-08-12

Build observed: **`v3.5-65d6500`**. Suite 176 cases. **Run 357 never touched — `update_run` was not called.**

**Scope: `update_case` only.** 0 `add_case` · 0 `delete_case` · 0 section writes · 0 run writes ·
0 results logged · 0 Jira calls of any kind. `custom_atmstatus` never sent — it is another author's flag.

**All three text fields on every payload**, including the two that do not change: TestRail re-renders
any text field omitted from a payload through its HTML pipeline, wrapping it in `<p>` and turning
`\n` into `\r\n`. On a project that shows markup literally to the tester that is a visible defect.

**Verification is by CONTENT, never by `updated_on`.** Every write is re-GET and compared field by
field against the intended payload, with every field not meant to change proven byte-identical to its
pre-write snapshot. **On any mismatch the batch stops.**

**And every payload was PRINTED AND READ before it was sent** — see §2. Two re-stamp defects bit this
workspace earlier today, both of the same class: the byte-check PASSED because the write was faithful
to a payload that was itself wrong.

## 1 · Batch A — the Rule-54 sentence-2 re-stamps

| # | case | op | HTTP | fields compared | mismatches | collateral | was |
|---|---|---|---|---|---|---|---|
| 1 | C29930 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 2 | C29936 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 3 | C29939 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 4 | C29940 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 5 | C29941 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 6 | C29942 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 7 | C29943 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 8 | C29944 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 9 | C29945 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 10 | C29947 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 11 | C29950 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 12 | C29953 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 13 | C29954 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 14 | C29956 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 15 | C29958 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 16 | C29963 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 17 | C29965 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 18 | C29978 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 19 | C29981 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 20 | C29983 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 21 | C29986 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 22 | C29998 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 23 | C30006 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 24 | C30008 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 25 | C30015 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 26 | C30016 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 27 | C30017 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 28 | C30018 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 29 | C30025 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 30 | C30029 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 31 | C30032 | update_case | 200 | 30 | 0 | 0 | v3.5-d122eef / 8/5/2026 |
| 32 | C30039 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 33 | C30042 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 34 | C30043 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 35 | C30044 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 36 | C30045 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 37 | C30046 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 38 | C30047 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 39 | C30050 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 40 | C30051 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 41 | C30054 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 42 | C30057 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 43 | C30075 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 44 | C30077 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |
| 45 | C38855 | update_case | 200 | 30 | 0 | 0 | v3.5-7ec992f / 8/6/2026 |

**45 of 45 written, every one HTTP 200 + byte-verified, 30 fields compared each, 0 mismatches,
0 collateral changes.**

Each write was additionally checked by an **independent re-read of the stored text**, rather than
trusting the verification helper: the new stamp present (`stamp_ok`) and the old build token gone
(`stale_gone`). **45 of 45 passed both.** Machine log: `evidence/restamp-oplog.json`.

