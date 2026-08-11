# TestRail execution log — 2026-08-11, dated-provenance pass

**Authorised:** `update_case` (and `add_case`, unused — neither case needed one).
**NOT authorised and NOT called:** `delete_case` · section operations · run writes · results.
**Jira: zero writes of any kind** — the creation hold stands. `SV-8881` was **read only**.

## Operations — 2 writes, both byte-verified (Rule 50)

| Case | Op | Fields sent | Payload | Status | Verification |
|---|---|---|---|---|---|
| C30452 | update_case | 4 | `custom_expected, custom_preconds, custom_steps, refs` | HTTP 200 | 30 fields compared, 4 intended, 0 mismatch |
| C30434 | update_case | 5 | `custom_expected, custom_preconds, custom_steps, refs, title` | HTTP 200 | 30 fields compared, 5 intended, 0 mismatch |

All three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) were sent **explicitly on
every payload**, including the two that were not changing, because TestRail re-renders any text field
omitted from the payload through its HTML pipeline (playbook §J).

**0 mismatches. 0 collateral changes.** Every field the pass did not intend to change was proven
byte-identical to its pre-write snapshot; `updated_on`/`updated_by` excluded by declared convention.

## Pre-send shape gates — all PASS on both payloads

`exactly one provenance line` · `exactly one marker` · `marker is the last line` ·
`blank line before the marker` · `no raw markup in any of the three text fields` ·
`no barred "as per the build" phrasing` · `every refs comma-entry <= 248 chars` · `title <= 80 chars`

## Markup census

**Before:** both cases plain text in all three fields — 0 markup.
**After (live re-read):** both cases 0 markup, exactly one `AUTOMATION:` marker each, exactly one
provenance line each.

> **Honest caveat (playbook §J hazard #5):** TestRail can re-render stored text into HTML *hours*
> after a write **without moving `updated_on`**. This zero is therefore true **as measured now** and
> **is not durable** — it is not a guarantee about tomorrow, and the next pass must re-census rather
> than trust this line.

## Run 359 — PROVEN UNTOUCHED BY CONTENT (not by timestamp)

Owned by Nebojsa and Viktoria. Snapshotted in full before the writes and re-read after.

| Check | Result |
|---|---|
| `include_all` | `False` before → `False` after |
| tests | 476 → 476 |
| `case_id` sets | **equal in BOTH directions** (0 added, 0 removed) |
| `test_id` sets | **equal in BOTH directions** |
| result records | **535 → 535** |
| every prior result present **BY ID** | **yes — 0 missing, 0 new** |
| graded fields changed (`status_id`, `comment`, `defects`, `elapsed`, `version`, `created_by`, `created_on`, `test_id`, `assignedto_id`) | **0 across all 535** |
| derived/echo fields changed | 3 records: `case_refs` on C30452 and C30434, `case_title` on C30434 |

The echoes trace to **our two cases only** — `case_refs` because `refs` was edited on both, and
`case_title` because C30434's title was corrected. Both are **declared read-time echoes** recorded in
`build/APP-ACTIONS-PLAYBOOK.md` §J, not writes to the run. **No result was logged anywhere.**

## Sources read live this pass

Epic `SV-8582` (Open) · story `SV-8657` (Open) · story `SV-8654` (Open) · WIP spec Confluence
`703660034` **v11** · TU spec Confluence `641400833` **v7** · `SV-8881` (Bug, **OBSOLETE/Done**,
resolved 2026-08-07) — all read **11 August 2026**, all read-only.

**The build was NOT observed.** `sv8582api.qa.shopview.com` returned **HTTP 401** — the session is
dead. `quick-login` and `switch-user` were **not called** (other workers are live on this estate).
Build facts cited in `CASES-FIXED.md` come from **evidence captured earlier today and committed** to
this repository, and **neither case's build line (sentence 2) was re-stamped**, because claiming a
build check we did not perform is exactly what the amended Rule 54 forbids.
