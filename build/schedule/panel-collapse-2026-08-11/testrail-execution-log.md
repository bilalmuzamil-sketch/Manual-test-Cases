# Schedule §5.3 Panel collapse — TestRail execution log — 2026-08-11

**Authorisation.** The QA lead, 2026-08-11, verbatim: *"We are supposed to crfeate test cases and
accurate ones and also which are VIU'd with the process attached to the VIU… And anything that stops
you from creating/updating a test case You MUST let me know, we are supposed to create the test
cases."* — so `add_case` and `update_case` are authorised. **His creation hold of 2026-08-10 still
covers Jira: no ticket of any kind was created (Rules 62 / 51).**

| | |
|---|---|
| **Operations** | **6 × `add_case`. 0 update · 0 delete · 0 section · 0 run write · 0 result logged · 0 Jira write.** |
| **Result** | **6/6 HTTP 200, 6/6 byte-verified MATCH, 10 fields compared each, 0 mismatches, 0 collateral changes.** |
| **Sources read** | pass start **02:36Z / 03:14Z**; **re-read at write start 03:27Z** (Rule 59) — **unchanged** |
| **Build** | `v3.5-af3a6e1`, `index.html` sha256 `3cb182af…` **identical before and after** |

---

## Per operation (Rule 50 — an entry that says only "200 OK" is non-compliant)

| Op | Internal id | Case | Section | HTTP | Fields compared | Byte-level verification |
|---|---|---|---|---|---|---|
| `add_case` | SCH-PANEL-01 | **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | 4273 Grid Toolbar | **200** | **10** | **MATCH** |
| `add_case` | SCH-PANEL-02 | **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | 4273 Grid Toolbar | **200** | **10** | **MATCH** |
| `add_case` | SCH-PANEL-03 | **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | 4273 Grid Toolbar | **200** | **10** | **MATCH** |
| `add_case` | SCH-PANEL-04 | **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** | 4280 Edge Cases and Responsiveness | **200** | **10** | **MATCH** |
| `add_case` | SCH-PANEL-05 | **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | 4273 Grid Toolbar | **200** | **10** | **MATCH** |
| `add_case` | SCH-PANEL-06 | **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | 4273 Grid Toolbar | **200** | **10** | **MATCH** |

**The 10 fields compared on every op**, each re-GET and byte-compared against the intended payload:
`title` · `custom_preconds` · `custom_steps` · `custom_expected` · `refs` · `custom_atmstatus` ·
`custom_automation_type` · `priority_id` · `section_id` · `suite_id`.

**All three text fields were sent explicitly on every payload**, so TestRail's omit-field re-render
(playbook §J) could not fire — and it did not: **0 of 174 cases carry raw markup after the writes.**

**Declared normalisation applied to `refs` only:** `','.join(p.strip() for p in s.split(','))`. Every
`refs` value was written **comma-free** and well under the 248-character limit, so the normalisation
was a no-op on all six; it is asserted rather than assumed.

**The batch was written to STOP on any mismatch** (Rule 50). It did not have to.

---

## Untouched-proofs — by content, never by count and never by timestamp alone

### Run 357 "Schedule - Ayesha (VIU Pending)"

| Check | Before | After | Verdict |
|---|---|---|---|
| `include_all` | `false` | `false` | unchanged |
| tests | 168 | 168 | unchanged |
| test-id sets | — | — | **equal in BOTH directions** |
| `case_id` sets | — | — | **equal in BOTH directions** |
| result records | **458** | **458** | **all 458 present BY ID, 0 missing** |
| graded fields changed on any prior result | — | — | **0** (`status_id`, `comment`, `defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`) |
| new results during the write window | — | — | **0** |
| counters | 25 P / 0 F / 1 B / 142 U | 25 P / 0 F / 1 B / 142 U | unchanged |

**The six new cases are deliberately NOT in run 357.** `include_all` is `false`, so a fixed-selection
run never picks up new cases. The union sync is **computed and STAGED, not executed** —
`STAGED-RUN-357-SYNC.md`. **The run is Ayesha's and a run write needs the QA lead's go-ahead**
(Rules 6 / 34 / 47).

### The 168 pre-existing cases

**0 fields differ**, on a full field-by-field comparison of every case against the pre-write snapshot,
**`updated_on` and `updated_by` included**. Nothing was touched in passing.

### Foreign cases

**None exist.** All 174 cases under group 4254 carry `created_by = 3`. Rule 38 had nothing to protect
here, and that is stated rather than left silent.

---

## Post-write census, read back live from TestRail

| Check | Result |
|---|---|
| Cases under group 4254 | **174** (168 + 6) |
| Raw markup (`<p>`, `<li>`, `<ol>`, `<ul>`, `<br>`, `<div>`) in any of the three text fields | **0 of 174** |
| Automation markers | **119 `READY` · 21 `READY - EXPECT FAIL` · 34 `HOLD` = 174** |
| **The arithmetic gate** | **119 + 21 = 140**, and **174 − 34 = 140**. **It passes both ways.** |
| Provenance lines | exactly one per case; the six new ones name **specification version 27** and build **`v3.5-af3a6e1`** |
| Markers per case | exactly one, last, blank line before and a line break after |

**HOLD rose 28 → 34: the six new cases are all HOLD**, because the control they test is not in the
build. **Ready-to-automate is unchanged at 140** — a not-built feature is absent product, not a
readiness shortfall.

**A markup census was taken before AND after** (0 → 0). Per playbook §J hazard 5, TestRail can
re-render text into HTML hours after a write **without moving `updated_on`**, so this zero is a
measurement of now, not a guarantee, and it should be re-taken on the next pass.

---

## Deliverables regenerated

**The local case source was re-synced FROM LIVE before regenerating.** The 2026-08-06 pass rewrote
**all 168 expected fields** plus 20 preconditions, 20 steps and 2 `refs` in TestRail without updating
the local JSON, so regenerating the import from stale local text would have shipped 168 stale rows.
After the resync, local and live are **byte-identical on all five text fields across all 174 cases**.

| Check | Result |
|---|---|
| **Shredding guard** (`joinlines` newline-per-character bug) | **0 shredded rows of 174** |
| Four counts | live **174** · local active **174** · id-map **174** · import **174** |
| Set equality | **equal in BOTH directions**, live ↔ local and live ↔ id-map |
| id-map | **0 blank C-ids**, **refs 174/174** — both re-merged from live after the generator blanked them, as it does on every rerun |
| Import header sha256 | **`a82ca60c36074512` — identical to all five peer imports** |
| Duplicate titles / duplicate internal ids | **NONE** |
| `VIU` / feature-flag words in the import | **0** |
