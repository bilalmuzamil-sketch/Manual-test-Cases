# TESTRAIL EXECUTION LOG — Filters, Vlad gap review, 2026-08-06

**Standing Rule 50: exhaustive then exact.** Every operation records the operation, the target C-id,
the HTTP status **and the verification result**. A line reading only *"200 OK"* is non-compliant.

**Authorisation:** `update_case` on our cases **authorised** · `add_case` **authorised for a gap proven
absent** · `delete_case` **NOT authorised — called ZERO times** · **run writes NOT authorised — none
made.**

**Executors, committed beside this log:** `writeA.py` (5 updates) · `writeB.py` (4 adds). Both drive
`/tmp/testrail/tr.py`'s `update_case_verified`, which snapshots the full case before the write, writes,
re-GETs, compares **every** field against the intended payload, and proves **every field not intended
to change is byte-identical**. On any mismatch it raises and the batch stops.

**All three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) were sent explicitly on
every payload** — `update_case` re-renders any text field omitted from the payload, and this project
shows markup literally to the tester.

---

## PART A — 5 × `update_case` (row 1, the Rule-57 defect)

| # | Operation | C-id | Internal | HTTP | Verification |
|---|---|---|---|---|---|
| 1 | `update_case` | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | FLT-TAB-02 | **200** | **30 fields compared, 5 intended, 0 mismatch, 0 collateral** |
| 2 | `update_case` | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | FLT-TAB-03 | **200** | **30 fields compared, 5 intended, 0 mismatch, 0 collateral** |
| 3 | `update_case` | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | FLT-BAR-03 | **200** | **30 fields compared, 4 intended, 0 mismatch, 0 collateral** |
| 4 | `update_case` | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | FLT-TAB-05 | **200** | **30 fields compared, 4 intended, 0 mismatch, 0 collateral** |
| 5 | `update_case` | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | FLT-BAR-02 | **200** | **30 fields compared, 4 intended, 0 mismatch, 0 collateral** |

**Ops 1–2** changed `title`, `refs` and all three text fields. **Ops 3–5** changed `refs` and all three
text fields; titles were already correct.

**Op 5 is the one incidental repair in this pass and it is declared rather than slipped in.** C29558
had been rewritten by **Ahtasham Amjad at 11:27:20Z today** to assert the new leading type-icon of spec
v19. **His assertion was kept**, unchanged in meaning. What op 5 did: converted all three fields out of
raw HTML into plain text; removed the contested Status-chip claim from precondition 3 (that is row 1
work); and **restored the Rule-54 provenance line and the automation marker, which his edit had
dropped**, adding the Rule-61 symptom and three outcomes for
**[SV-8986](https://shopview.atlassian.net/browse/SV-8986)** — with the symptom **attributed to his
ticket and explicitly marked as not observed by us**, because we could not reach the build.

---

## PART B — 4 × `add_case` (the four proven gaps)

**Internal-ID collision check, run before any create (three independent ways):**

| Candidate | in the 150 local case bodies | in the id-map | among the 36 retired bodies |
|---|---|---|---|
| `FLT-PERS-07` | **False** | **False** | **False** |
| `FLT-PSRCH-14` | **False** | **False** | **False** |
| `FLT-PARTS-14` | **False** | **False** | **False** |
| `FLT-MOB-11` | **False** | **False** | **False** |

| # | Operation | C-id | Internal | Section | HTTP | Verification |
|---|---|---|---|---|---|---|
| 6 | `add_case` | [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | FLT-PERS-07 | 4121 Persistence | **200** | **11 fields re-GET and byte-compared, 0 mismatch** |
| 7 | `add_case` | [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | FLT-PSRCH-14 | 5410 Page Search Toolbar | **200** | **11 fields re-GET and byte-compared, 0 mismatch** |
| 8 | `add_case` | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | FLT-PARTS-14 | 5411 Parts Page Filters | **200** | **11 fields re-GET and byte-compared, 0 mismatch** |
| 9 | `add_case` | [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | FLT-MOB-11 | 4123 Mobile Filters | **200** | **11 fields re-GET and byte-compared, 0 mismatch** |

Field conventions mirrored from the section siblings: `template_id 1`, `type_id 6`, `priority_id 2`,
`custom_atmstatus 1`, `custom_automation_type 0`. **Rule 4 checked: none of the four contains an
endpoint, an HTTP verb or a status code**, so none belongs in an API-titled section.

### THE BATCH STOPPED ONCE, EXACTLY AS RULE 50 REQUIRES

Between ops 6 and 7 the pre-flight guard **refused** `FLT-PSRCH-14`: its `refs` entry measured **253
characters** against TestRail's **248** limit, which would have returned HTTP 400
`Field :refs does not match the required pattern.` **The batch stopped, nothing was retried blindly,
the `refs` string was shortened to 214 characters and re-measured, and only then did the run resume**
from op 7. **Op 6 (C43560) was already created and verified and was not re-created.** Recorded here
because a guard that fires is evidence the guard works.

### The one declared normalisation relied on

`refs` is compared under `','.join(p.strip() for p in s.split(','))` — TestRail's declared
comma-split-trim-rejoin. **No new normalisation was discovered**, so nothing needed adding to the
playbook.

---

## PROOFS

### The 105 cases we did not touch

**0 of 105 changed on ANY field, `updated_on` and `updated_by` included.** Compared by full JSON
serialisation of the pre-write snapshot against a fresh live read.

### Run 352 — Ahtasham's run — PROVEN UNDAMAGED

| Check | Before | After | Verdict |
|---|---|---|---|
| `include_all` | false | **false** | unchanged |
| Tests | 110 | **110** | test-id sets **equal both directions** |
| `case_id` sets | 110 | **110** | **equal both directions** |
| Result records | **459** | **459** | **all 459 present BY ID, 0 missing** |
| Graded fields on prior results (`status_id`, `comment`, `defects`, `elapsed`, `version`, `created_by`, `created_on`, `test_id`, `assignedto_id`) | — | — | **0 changes on any of the 459** |
| New results during the write window | — | — | **0** |

**The only fields that moved are `case_refs` and `case_title`, on 42 records** — both **declared
read-time echoes** (playbook §J). They were **attributed, not waved away**: every affected record
belongs to one of **exactly the five cases whose `refs` or `title` we edited** — C29558, C29559,
C29609, C29610, C29612. Set equality verified.

**0 `update_run`. 0 results logged anywhere. 0 `delete_case`. 0 section writes.**

### Live census over all 114 cases, read back from TestRail after the writes

- **Provenance line: exactly one on every one of the 114.** 0 missing, 0 doubled.
- **Automation marker: exactly one on every one of the 114.** 0 missing, 0 doubled.
  **79 `READY` · 15 `READY - EXPECT FAIL` · 20 `HOLD` = 114.**
- **Arithmetic gate PASSES both ways: 79 + 15 = 94 · 114 − 20 = 94.**
- **Raw markup on the 9 cases we wrote: 0.** Across all 114 it is **14** — down from 15, because op 5
  repaired one. **The other 14 were not touched** (see `DELIBERATE-DECISIONS.md` entry 5).

### Deliverables

| Check | Result |
|---|---|
| Four counts | **live 114 · local active 114 · id-map 114 · import 114** |
| Set equality | **live == id-map, both directions** |
| id-map blanks | **0** · `refs` filled **114 / 114** |
| id-map vs live | **0 rows differ** on `refs` or `title` |
| Character-shredding guard | **PASSED — 0 shredded fields**, and independently re-checked on the written CSV: **0 rows carry the signature** |
| Import header sha256 | **`a82ca60c36074512` — identical to all five peer imports** |
| Duplicate titles / duplicate internal ids | **NONE / NONE** |
| "VIU" / feature-flag words in the import | **0 / 0** |

**The generator's two known gotchas both fired and both were repaired:** `gen_import.py` **blanked all
114 C-ids and dropped the `refs` column entirely** from `testrail-id-map.csv`. Both were **re-merged
from live**, and the header is back to the committed five-column form.
