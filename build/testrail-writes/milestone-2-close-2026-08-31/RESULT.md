# TestRail write record — close milestone 2

**Date:** 2026-08-31
**Authority:** QA lead's explicit written permission for this single write (Rule 6). Scope limited to
the milestone; **no run, plan or case was written**.

## Operation

| Field | Value |
|---|---|
| Operation | `POST /index.php?/api/v2/update_milestone/2` |
| Request body | `{"is_completed": true}` — and nothing else |
| Project | 1 |
| Milestone id | **2** |
| Milestone name | Feature Squad – Schedule, Filters, Reports – August 2026 |
| Milestone URL | https://shopview.testrail.io/index.php?/milestones/view/2 |
| HTTP status | **200** |
| Verification call | fresh `GET /index.php?/api/v2/get_milestone/2` → **HTTP 200** |
| Verification result | **PASS** — `is_completed: true`, `completed_on: 1788168365` (2026-08-31T09:26:05Z) |

Name was confirmed to match the target exactly (en-dash `–`, U+2013) **before** the write was sent.

Pre-state: `pre-state.json` · post-state: `post-state.json` (both in this directory, verified to
contain no credentials).

## Field-by-field diff — milestone 2

| Field | Pre | Post | Verdict |
|---|---|---|---|
| `is_completed` | `false` | `true` | **CHANGED — intended** |
| `completed_on` | `null` | `1788168365` (2026-08-31T09:26:05Z) | **CHANGED — intended, set by TestRail** |
| `id` | 2 | 2 | same |
| `name` | Feature Squad – Schedule, Filters, Reports – August 2026 | identical | same |
| `description` | `<p>QA milestone for the Feature Squad covering Schedule, Filters, and Reports. Testing handoff received on 4 August 2026, with completion targeted for 20 August 2026.</p>` | identical | same |
| `start_on` | 1785801600 | 1785801600 | same |
| `started_on` | 1785801600 | 1785801600 | same |
| `is_started` | `true` | `true` | same |
| `due_on` | 1787184000 | 1787184000 | same |
| `project_id` | 1 | 1 | same |
| `parent_id` | `null` | `null` | same |
| `refs` | `null` | `null` | same |
| `url` | .../milestones/view/2 | identical | same |
| `milestones` | `[]` | `[]` | same |

**Exactly two fields changed, both of them the intended effect of the close.** Nothing was
re-rendered or cleared — in particular the description HTML is byte-identical.

## Runs left untouched (required)

No call was made to `update_run`, `close_run`, `update_plan` or `close_plan`. After the milestone
write, each run was re-read via `GET /index.php?/api/v2/get_run/<id>` (all **HTTP 200**) and compared
against the counts recorded before the write.

| Run | Project scope | `is_completed` | Passed | Failed | Blocked | Untested | Retest | Verdict |
|---|---|---|---|---|---|---|---|---|
| **352** | Filters | `false` (open) | 91 | 10 | 1 | 27 | 0 | **UNCHANGED** |
| **357** | Schedule | `false` (open) | 170 | 1 | 1 | 23 | 0 | **UNCHANGED** |
| **359** | Report Suite | `false` (open) | 6 | 0 | 0 | 510 | 0 | **UNCHANGED** |

All three still carry `milestone_id: 2` and remain **open**. Closing the milestone did **not**
cascade to its runs.

## Honesty / gate record

- Secret-scan gate run for real before commit: `python3 build/testing-tools/scan_secrets.py --staged`.
- Credentials were held only in a `chmod 600` file under `/tmp`, never written to the repo, a script,
  a log or any pasted output, and the file was deleted at the end of the pass.
