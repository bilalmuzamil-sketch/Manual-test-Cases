# TestRail execution log — C30041 latest-wins trim, 2026-08-11

**Authorisation:** `update_case` authorised · `delete_case` authorised for **C30041 only** and only if
the PRD deletion proved to be the later source · **no `add_case`, no section ops, no run writes, no
results**.

**Sources read at pass start:** 2026-08-11, before any analysis.
**Sources RE-READ at write start (Standing Rule 59):** **2026-08-11T10:18:18Z** — Confluence page
713031682 still **v27** (`2026-08-07T15:01:20.801Z`, Branko Cicovic), fade sentence **still absent**,
five-field row **still present**; Jira **SV-8686** still **TESTING QA**, `updated` still
**2026-08-07T01:02:57.009Z**. **Verdict of the second read: UNCHANGED.**

---

## Operations

| # | Operation | Target | HTTP | Verification | Result |
|---|---|---|---|---|---|
| 0 | `get_case/30041` (pre-write guard) | C30041 | **200** | byte-compared against `snapshots/C30041-PRE.json` — **30 of 30 fields identical**, `updated_on`/`updated_by` included | **no drift; safe to write** |
| 1 | **`update_case/30041`** | C30041 | **200** | re-GET + byte-compare, **30 fields**: 5 intended all match the payload exactly; 23 untouched fields byte-identical to the pre-write snapshot; 2 server-stamped (`updated_on`, `updated_by`) excluded by definition | **PASS — 0 mismatches, 0 collateral changes** |

**Fields written (all sent explicitly, because TestRail re-renders any text field omitted from the
payload):** `title`, `custom_preconds`, `custom_steps`, `custom_expected`, `refs`.

**`refs` verified under the declared TestRail normalisation** `','.join(p.strip() for p in
s.split(','))`. Payload `SV-8686 (§6 (Search) - spec v27 2026-08-07)` — **43 characters, 0 commas**,
so the normalisation is a no-op and the stored value is byte-exact.

### Operations NOT performed

| Operation | Count | Note |
|---|---|---|
| `delete_case` | **0** | authorised for C30041 and the dating condition was met; **deliberately not exercised** — it is the only case covering a live PRD requirement (`DECISION.md` §3) |
| `add_case` | **0** | barred by the brief, and by Standing Rule 62's creation hold |
| `add_section` / `update_section` / `delete_section` | **0** | — |
| `update_run` / `add_run` | **0** | — |
| `add_result*` | **0** | no result logged anywhere |
| Jira writes of any kind | **0** | SV-8874 not touched; nothing created, edited, commented or transitioned. Jira was read only: `GET` issue, `GET` changelog, `GET` comments |

---

## Case content census, read back live after the write

| Check | Result |
|---|---|
| raw markup (`<ol>`/`<li>`/`<p>`/entities) in any of the five fields | **0**, before **and** after |
| CRLF injected by the write | **0** |
| provenance lines (Rule 54) | **exactly 1** |
| build stamps (`Last checked against build …`) | **exactly 1** |
| `AUTOMATION:` markers | **exactly 1**, and it is the **last non-empty line** |
| barred phrase *"as per the build"* (Rule 54/57) | **0 occurrences** |
| title length | **76** characters (house limit ~80) |
| `custom_atmstatus` | **1 — Not Automated**, re-verified live at write time (Rule 64 precondition) |
| `custom_automation_type` | **0**, unchanged |

---

## Run 357 — Ayesha Khan's Schedule run — PROVEN UNTOUCHED BY CONTENT

Snapshotted **before** the write and **after**, by content, never by `updated_on`.

| Measure | Before | After | Verdict |
|---|---|---|---|
| `include_all` | **false** | **false** | unchanged |
| tests | **174** | **174** | unchanged; `case_id` sets **equal in BOTH directions**, 0 pre-only, 0 post-only |
| result records | **458** | **458** | **every prior result present BY ID**, 0 missing, 0 new |
| graded / real field changes on the 458 | — | — | **0** |
| counters | 25 Passed / 0 Failed / 1 Blocked / 148 Untested | identical | unchanged |
| `case_title` + `case_refs` movement | — | **6 changes across 3 records** | **fully accounted for: all 3 records belong to test 1845497 = C30041, the one case retitled.** These are the **declared read-time echoes** (`APP-ACTIONS-PLAYBOOK.md` §J), not stored values |

**The case count did not drop, because the case was not deleted.** Had it been, the run would have
gone **174 → 173** automatically; the before figure is recorded here so that comparison stays
available.

---

## Authorship census (Standing Rule 38)

`created_by` across all **174** cases in Schedule group 4254: **`{3: 174}`**. **Every case is ours;
there are no foreign cases in this group**, so nothing of anyone else's could be, or was, touched.

---

## Evidence

| File | What it holds |
|---|---|
| `snapshots/C30041-PRE.json` | the full case body before the write, all 30 fields |
| `snapshots/C30041-POST.json` | the re-GET after the write |
| `snapshots/C30041-POST-writeresponse.json` | the `update_case` response body |
| `evidence/write-verification.json` | the field-by-field verdict |
| `evidence/run357-pre.json` / `run357-post.json` | run, tests and every result record, both sides |
| `evidence/schedule-all-cases.json` | all 174 live Schedule cases as scanned |
| `evidence/assertion-scan.json` | every case matching each assertion probe, with context |
| `evidence/versions/v1.xml`…`v27.xml` | all 27 Confluence bodies |
| `evidence/string-dating.json` | the fade sentence traced through all 27 versions |
| `evidence/version-history.json` | the 27 version records with timestamps and authors |
| `evidence/SV-8686.json`, `-changelog.json`, `-comments.json`, `-desc-history.json`, `-desc-edit*.txt` | the story, its full 14-entry changelog, its 0 comments, and every description state |

**Tools are read-only except `tools/write_c30041.py`, which is the single write path and refuses to
proceed on any pre-write drift or any post-write mismatch.**
