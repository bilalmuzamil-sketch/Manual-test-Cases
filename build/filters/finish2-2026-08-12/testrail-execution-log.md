# Filters — execution log, 2026-08-12 (finish2)

**Build `v3.6-3e9dd6d`**, `index.html` sha256
`fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb`, last-modified Tue 11 Aug 2026
07:45:44 GMT, etag `b1b2623f07bec03883f57a0e17204431` — **byte-identical to the marker the previous
pass recorded, so the build has not moved.**
Location: **Staging Heavy Duty - 9919**. Identity: **admin@shopview.com** unless a row says otherwise.

## IDENTITY PROOF (taken before any observation was trusted)

| | admin | technician |
|---|---|---|
| `fe_permissions` count | **42** | **6** |
| `view_mode` | `full` | `tech` |
| `GET /api/staff?limit=200` | **200** | **403** |

`quick-login` and `switch-user` were **never called**.

## READ-ONLY SNAPSHOTS TAKEN FIRST

| What | When (UTC) | Result |
|---|---|---|
| Case census under group 4110 | 2026-08-12T12:08:27Z | **120 live · 115 ours (`created_by` 3) · 5 foreign (`created_by` 7)** |
| Foreign cases C43576–C43580 | 2026-08-12T12:08Z | `evidence/foreign-PRE.json` |
| Run 352 | 2026-08-12T12:09:38Z | `include_all` **false**, 120 tests, **636** results |

## WRITE OPERATIONS

| # | Op | Case | HTTP | Fields compared | Verdict |
|---|---|---|---|---|---|
| — | *(none yet)* | | | | |

**0 `add_case` · 0 `delete_case` · 0 `add_section` · 0 `update_run` · 0 results · 0 Jira calls of any kind.**
