# Global Search — V1 parity pass, 2026-09-09

Executes the QA lead's five instructions of 2026-09-09. **What landed, what is blocked, and why.**

## Status at a glance

| # | Instruction | Status |
|---|---|---|
| 1 | Author the licence-plate parity case | ✅ **AUTHORED, validated, push-ready.** ⛔ push blocked — no TestRail credentials in this container |
| 2 | Draft PO-GS-SUBSTR-1 | ✅ **DONE** — `../questions-2026-09-09/` |
| 3 | Live read of C45129 | ⛔ **BLOCKED** — same credential gap |
| 4 | Run `SELECT @@group_concat_max_len;` | ⛔ **BLOCKED** — no DB or app session. Exact command + impact formula below |
| 5 | Carried PO-REG-1..6 + QA build | ✅ **PO items consolidated** into the one sheet (2 closed as no-longer-needed). QA build is not in our gift |

## ⛔ The credential gap — proved, not assumed (Rule 97)

`build/skills/14-ACCESS-RESILIENCE.md` documents a session that called this a blocker while
`/tmp/testrail/creds.json` sat on disk the whole time. **All three sources were checked here:**

| # | Source | Result |
|---|---|---|
| 1 | env `TESTRAIL_EMAIL` / `TESTRAIL_API_KEY` / `CLAUDE_USERNAME` | **absent** (`env \| grep -c` → 0) |
| 2 | `/tmp/shopview-creds.env` | **No such file or directory** |
| 3 | `/tmp/testrail/creds.json` | **directory `/tmp/testrail/` does not exist** |

Also checked: `/tmp/qa-cookies/` **absent**; whole `/tmp` tree at depth 2 holds only Chrome,
node cache and this session's scratch. No TestRail MCP tool exists in this session either
(searched the connector registry). Per CLAUDE.md §Persistence secrets are ephemeral and
**re-supplied per environment** — this container came up without them.

**To unblock:** supply any one of the three, then run the two commands in "Ready to run" below.

## 1 · The case — `GSREG-PLATE-01`

**Title:** "Searching an asset's licence plate finds that asset" (51 chars)
**Target:** section **6769** "Global Search V2 - V1 Regression Suite" · run **R415**
**Source:** `cases/parity-cases.json` · **Pusher:** `push_parity.py`

**Why it is a genuine invariant, not an assumption.** `licence_plate` is concatenated into the
asset search index at `FetchDataQueryHandler.php:292` (baseline `5576716`, byte-unchanged). And the
term **"licence plate" / "license plate" / "plate" appears NOWHERE** in the v1.2–v1.5 specification
artefacts, `requirements.md`, the coverage matrix, or any of the 119 V2 case bodies — verified by
`git grep -in "licence\|license\|plate"` over `build/global-search/`, whose only hits are the word
"template". The spec is **silent**, and Rule 96 makes silence default to *"must not change"*.

**Why it is safe to run before PO-GS-SUBSTR-1 is answered.** The case deliberately uses the
**FULL** plate. A full-identifier search passes under **both** readings of "exact match after
normalization", so the case cannot be invalidated by whichever way that question is answered. The
partial-plate variant is deliberately **not** authored and is held to that decision (Rule 58).

**Traps actively avoided:**

| Trap | How it was avoided |
|---|---|
| Cases created by API landing flagged **Automated**, polluting Vladimir's signal (Rules 38/65) | Pusher uses the canonical `add_case_payload`, which sends `custom_atmstatus: 1` and **raises** on 3. Verified: `check_add_case_payloads.py` → **PASS, exit 0** |
| `<br>` and inline tags render **literally** via the API; plain `\n\n` collapses to a wall of text | Payload is **block tags only** — `<ul><li>`, `<ol><li>`, `<hr />`, `<p>`. Confirmed in the dry-run output |
| Angle brackets in case text being eaten by TestRail's HTML pipeline | `check_angle_brackets.py` → **clean, 0 placeholders at risk, exit 0** |
| A partial `case_ids` list to `update_run` **DELETES tests and their results** (Rule 34) | Pusher reads `get_tests/415` first and sends the **union**; it never sends a bare list |
| Duplicating a case on a re-run | Dedupes by exact title via a paged `get_cases`; `--apply` twice adds nothing |
| `suite_id` rejected HTTP 400 — project 1 is single-suite mode | Never sent (skill 14) |
| The **group_concat truncation** trap (below) silently breaking the check | Precondition caps the owning customer at **under 20 contacts** |

### Ready to run (once credentials exist)

```bash
python3 build/global-search/parity-2026-09-09/push_parity.py --apply
python3 build/testing-tools/check_case_render.py C<new-id>    # MANDATORY post-write self-check
```

The pusher writes `AUDIT-LOG.csv` (operation · internal id · C-id · HTTP status · verification) per
Rule 50, and `testrail-id-map.csv` with the real C-id. **The render self-check is not optional** —
a green self-check is part of "done".

## 3 · C45129 — still needs one live read

**[C45129](https://shopview.testrail.io/index.php?/cases/view/45129) "The 'Contacts' tab shows only
Contact results"** asserts a tab that v1.3 removed and that v1.5 + Design System 14 both confirm
absent.

It **cannot be adjudicated from this repo**, because `build/global-search/testrail-id-map.csv` is
**proven stale for titles**: its sibling C45139 was repurposed during the v1.3 ingest (the 2026-09-09
spec-diff cites C45139 as asserting contact-field indexing on the parent company) while the map still
carries C45139's original v1.2 title *"Contacts rank by open work, recent contact and primary
status"*. The live case body is the only authority.

```bash
python3 -c "
import sys; sys.path.insert(0,'build/testing-tools')
from tr_client import *   # or reuse push_parity.req()
print(req('get_case/45129'))"
```

**If it still asserts a Contacts tab → it is an orphan** (retire or rewrite, Rule 94). Either way
**`testrail-id-map.csv` should be regenerated from live**, since anything reading it for titles today
is reading fiction.

## 4 · `group_concat_max_len` — the command, and the formula

**Authorised by the QA lead 2026-09-09. Could not be executed: no DB access and no app session**
(`build/BLOCKED-shopview-app-session.md` — every stored cookie returns HTTP 401; `/tmp/qa-cookies/`
is absent in this container).

```sql
SELECT @@group_concat_max_len;   -- expect 1024 unless an Aurora parameter group overrides it
```

**What is already established without access:** the value is **not set anywhere in the repo** — no
`.cnf` file exists, and nothing in `*.php *.yaml *.yml *.ini *.sql Dockerfile* *.env*` sets it. So
unless an RDS/Aurora **parameter group** overrides it server-side, the MySQL default **1024 bytes**
applies.

**The impact, as a formula rather than false precision.** The customer haystack concatenates one
segment per contact (`FetchDataQueryHandler.php:237-243`):

```
bytes_per_contact ≈ len(first_name) + len(last_name) + len(title) + len(telephone) + 1   ← separator
truncation begins when  Σ bytes_per_contact  >  group_concat_max_len
```

All four columns are `VARCHAR(255)` and the connection is `utf8mb4`, so **bytes, not characters** —
a non-ASCII name costs more than its length. At realistic values (~35–40 bytes/contact) truncation
starts somewhere around **25–30 contacts**; with long job titles it can start much earlier. MySQL does
**not** error: it raises warning **1260** and silently returns a shortened string.

**Consequence, and the trap for parity testing:** contacts past the cut-off are **not searchable in
V1 today**. A V2 that indexes contacts properly will therefore **return rows V1 misses** — which in a
naive parity comparison reads as a *V2 defect* when it is in fact **V1 being broken**.

> **Rule for every contact-search parity case: seed the customer with fewer than ~20 contacts.**
> Otherwise the case encodes a V1 bug as its expected result.

**Not filed as a ticket** — Rule 51 (never file an API-related ticket without asking, every time)
and Rule 62 (Jira creation hold H1 active). Register item **R-GCML**.

## 5 · Carried items

**PO-REG-1..6 → consolidated** into `../questions-2026-09-09/`, one sheet, plain words, Rule 66
(sent last). **Two came off the list without needing Branko:**

- **PO-REG-4 — CLOSED by the spec itself.** It asked whether the existing Google Analytics
  `global_search_use` event survives alongside the new §6.4 telemetry. **v1.5 deleted §6.4 and all
  impression/click logging**, so there is no longer a clash — the existing event simply stays.
- **PO-REG-5 — no decision required.** Recorded for completeness; the new ranking is an intended
  improvement over V1's undefined ordering, not a regression.

**A QA build of Global Search V2** is not in our gift. Per Rule 85 the project stays reported as
**"SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET"**, and every case here plus the 20 from 2026-08-26
keeps the **"Not available on Build to test Yet"** marker until one exists.

## Verification status (Rules 12, 91)

- **V1 code: ✅ FACT, read 2026-09-09** — byte-identical to baseline `55767168`.
- **This case: ❌ NEVER build-verified**, and cannot be until a GS V2 build exists.
- **Nothing was written to TestRail, Jira, or any external system in this pass.**
