# TestRail execution log — 2026-08-11

**Two jobs. One of them wrote; the other deliberately did not.**

| | |
|---|---|
| `update_case` | **31**, all HTTP 200, all byte-verified PASS |
| `delete_case` | **0** — authorised for C30041 only, and the condition for it was not met (`C30041-DECISION.md`) |
| `add_case` · section ops · run writes · results | **0 of each** |
| Jira calls | **1 read** (`GET` on story SV-8686, for the sourcing analysis) · **0 writes** · **SV-8874 not called at all** |
| Build / application opened | **none** — neither job needed it. `quick-login` and `switch-user` never called. |

**Sources read at pass start and again immediately before the writes (Rule 59):** Confluence page
`713031682` at **version 27** and Jira **SV-8686** at **TESTING QA / updated 2026-08-06T20:02:57-0500**
— unchanged between the two reads, verdict unchanged.

---

## 1. The 31 flag corrections

**Payload per case:** `custom_atmstatus: 1` **plus `custom_preconds`, `custom_steps` and
`custom_expected` at their exact pre-write values.** The three text fields are sent on every payload
even though none of them changes — playbook **DECLARED NORMALISATION #3**: a text field omitted from
an `update_case` is re-rendered through TestRail's HTML pipeline and reaches the manual tester as raw
`<p>`/`<ol>` markup. `refs` was not sent and did not move.

**Verification per operation (Standing Rule 50 — exhaustive, then exact):** re-GET, then compare
**every one of the ~30 fields** against the pre-write snapshot. Fields permitted to move:
`custom_atmstatus` (intended) and the server-set `updated_on` / `updated_by`. **Any other movement
stops the batch** — none occurred.

| # | Op | Case | HTTP | Automation status | Fields compared | Verification |
|---:|---|---|---:|---|---:|---|
| 1 | `update_case` | [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 2 | `update_case` | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 3 | `update_case` | [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 4 | `update_case` | [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 5 | `update_case` | [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 6 | `update_case` | [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 7 | `update_case` | [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 8 | `update_case` | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 9 | `update_case` | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 10 | `update_case` | [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 11 | `update_case` | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 12 | `update_case` | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 13 | `update_case` | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 14 | `update_case` | [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 15 | `update_case` | [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 16 | `update_case` | [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 17 | `update_case` | [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 18 | `update_case` | [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 19 | `update_case` | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 20 | `update_case` | [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 21 | `update_case` | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 22 | `update_case` | [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 23 | `update_case` | [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 24 | `update_case` | [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 25 | `update_case` | [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 26 | `update_case` | [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 27 | `update_case` | [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 28 | `update_case` | [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 29 | `update_case` | [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 30 | `update_case` | [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |
| 31 | `update_case` | [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | 200 | 3 → 1 | 30 | **PASS** — only `custom_atmstatus` (+ server `updated_on`/`updated_by`) moved |

**Totals: 31 operations · 31 × HTTP 200 · 31 × PASS · 0 mismatches · 0 unintended field changes.**

**Independent re-read afterwards.** A fresh `get_case` per case — not the write's own response —
compared against the pre-write snapshot: **0 mismatches on 31 of 31**. Group-wide read afterwards:
**Schedule = 174 of 174 `Not Automated`**, and the only cases still carrying `Automated` across all
three groups are the **44 Vladimir Tomovic set himself** (40 Report Suite + 4 Filters), exactly as
before this pass.

Snapshots: `snapshots/PRE-31-schedule-cases.json` · `snapshots/POST-31-schedule-cases.json` ·
machine log `evidence/oplog-31-flag-fixes.json`.

---

## 2. C30041 — snapshotted, analysed, **not** deleted

`snapshots/C30041-before-delete.json` holds the complete pre-decision body and was **committed to git
before any decision was taken**, so the record survives regardless of the outcome. The case was **not
written to and not deleted** — reasoning in `C30041-DECISION.md`. Its `custom_atmstatus` is **1**, so
Rule 64's automation precondition did not block deletion; the **sourcing** did.

---

## 3. Runs 352, 357 and 359 — proven untouched **by content**, never by timestamp

Snapshotted before the writes and re-read after: the full run record, every test, and every result.
`case_title` and `case_refs` are excluded from the comparison as **declared read-time echoes**
(playbook normalisations #2 / #2b / #2c) — every other field is compared.

| Run | Owner | `include_all` | Tests before → after | Test-id sets equal both ways | Case-id sets equal both ways | Results before → after | Prior results missing **by id** | Non-derived field changes | New results |
|---|---|---|---|---|---|---|---:|---:|---:|
| **352** | Ahtasham Amjad (Filters) | false → false | 114 → **114** | ✅ | ✅ | 473 → **473** | **0** | **0** | **0** |
| **357** | Ayesha Khan (Schedule) | false → false | 174 → **174** | ✅ | ✅ | 458 → **458** | **0** | **0** | **0** |
| **359** | Nebojsa / Viktoria (Report Suite) | false → false | 476 → **476** | ✅ | ✅ | 535 → **535** | **0** | **0** | **0** |

**Run 357's test count is unchanged at 174 because nothing was deleted.** Had C30041 been deleted it
would have dropped to 173 automatically; the before figure is recorded either way, as instructed.
**Not one derived-echo field moved either** — `case_title` and `case_refs` are byte-identical on all
1,466 result records across the three runs, because the 31 writes touched neither title nor `refs`.

---

## 4. What was deliberately **not** done

| Not done | Why |
|---|---|
| Cleared the flag on the **44** cases Vlad set | His deliberate act, proven per case from history. Clearing it would break his automation silently (Rule 64 / Rule 65). |
| Touched the **12** foreign Report Suite cases at `Automated` or the **5** foreign Filters cases | Authored by Vladimir Tomovic and Ahtasham Amjad — Rule 38, hands-off. |
| Deleted **C30041** | The requirement it rests on survives in story SV-8686, and one of its four points is sourced by the live PRD. Deletion is irreversible. |
| Rewrote **C30041**'s text to what survives | The QA lead's decision to make, not ours — presented with both texts quoted instead. |
| Rewrote the executed `add_case` scripts that hardcode `3` | They are the audit record of writes that actually happened. Fixed at source in `CLAUDE.md` and listed in `FIELD-FACTS.md` instead. |
| Any Jira write, or any call on **SV-8874** | The creation hold stands, and he has said not to touch it. |
