# Report Suite — refs version-pin pass, what changed, 2026-08-11

**343 cases written. 337 stale version citations re-pinned. 1 case also gained an automation marker and a specification version. 9 cases had a comma repaired. 1 was condensed to fit the 248-character limit.**

Nothing else moved: **0 `add_case`, 0 `delete_case`, 0 section writes, 0 run writes, 0 results logged, 0 Jira calls**. No expectation, step, precondition or title was changed — with the single, additive exception of C30288 below.

## 1 · The re-pins, by report

| Report | Pinned as | Now pinned as | Citations | Cases |
|---|---|---|---|---|
| Inventory Value | `IV spec v3 2026-07-29` | `IV spec v5 2026-08-07` | 60 | 60 |
| Parts Velocity | `PV spec v4 2026-07-29` | `PV spec v6 2026-08-07` | 58 | 58 |
| Sales By Customer | `SBC spec v16 2026-08-06` | `SBC spec v17 2026-08-10` | 77 | 77 |
| Sales By Representative | `SBR spec v15 2026-07-29` | `SBR spec v18 2026-08-07` | 73 | 73 |
| Sales By Representative | `SBR spec v17 2026-08-05` | `SBR spec v18 2026-08-07` | 1 | 1 |
| Work In Progress | `WIP spec v10 2026-08-06` | `WIP spec v11 2026-08-10` | 68 | 68 |
| | | | **337** | |

**Technician Utilization needed no re-pin** — it was already at its live version 7 on all 59 of its citations.

**Every re-pin is length-neutral** (same digit count, same ten-character ISO date), so no re-pin could push an entry over the 248-character limit. See `OVER-LIMIT.md`.

## 2 · The one case whose Expected Results were touched

**[C30288](https://shopview.testrail.io/index.php?/cases/view/30288)** — *The Unassigned row appears in both CSV downloads only when the toggle is on* (Sales By Representative). Three repairs, one write:

1. **Added the missing automation marker** `AUTOMATION: READY` — it was the only case in the suite without one. Placed at the very end of Expected Results, after the provenance line, blank line before.
2. **Added the specification version to its provenance line**: *"…the Sales By Representative report specification **version 18** (S22-R2, S22-R4, S14-R19), read on 11 August 2026."* All three anchors were confirmed present in the live v18 body before the version was written.
3. **Repaired a comma in `refs`** that TestRail was storing as two separate references.

**Its Rule 54 sentence 2 was not touched, because it has none** — C30288 is one of five cases never checked against any build, and adding a build line would have been a false claim.

## 3 · The comma repairs

TestRail splits `refs` on commas and stores one reference per piece, so a prose comma silently manufactures a phantom second reference. House style is **one comma-free entry**. Nine cases carried one:

| Case | Report | Was stored as | Repair |
|---|---|---|---|
| [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | Sales By Representative Report | **2 references** | space |
| [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | Sales By Representative Report | **2 references** | `;` separator |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Technician Utilization | **2 references** | space |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Technician Utilization | **2 references** | `;` separator |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Work In Progress | **2 references** | `;` separator |
| [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) | Work In Progress | **2 references** | `;` separator |
| [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) | Technician Utilization | **2 references** | `;` separator |
| [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | Technician Utilization | **5 references** | `;` separator |
| [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | Work In Progress | **4 references** | `;` separator |

After this pass **no case of ours carries a comma in `refs`**.

## 4 · What was deliberately NOT changed

- **Rule 54 sentence 2** — the `Last checked against build … on …` line — preserved byte-exact on every case that has one. The writer refuses the write if it moves. No build was observed in this pass and none is claimed.
- **The provenance line's spec version** — corrected earlier today and correct; untouched on all 480 cases except C30288, which had none.
- **Version numbers mentioned in prose** — *"S7-R13 rewritten in v10"*, *"the v9 contradiction"*, *"(SBR v16 2026-08-05)"* — these record **when** something landed and are not currency pins. Re-pointing them would have made true sentences false. See `FINDINGS.md` §6.
- **Technician Utilization's pin date**, which is a day out for timezone reasons on 58 cases whose version integer is correct. Reported in `FINDINGS.md` §8, not churned.
- **42 spec citations that carry no version at all** — a different defect from a stale pin, outside this pass's charter, and several have too little headroom to take one without editorial condensation. Reported in `FINDINGS.md` §7.
- **The 12 foreign cases** by Vladimir Tomovic (C38919–C38923, C43567–C43573), proven byte-identical by content including `updated_on`/`updated_by` (Rule 38).

## 5 · Post-write proofs (Standing Rule 50 — exhaustive, then exact)

All of these are **by content**. `updated_on` is never used to decide whether a case changed: it
has been proven unreliable in both directions on this estate — a case can carry a fresh timestamp
from an unrelated pass while the intended write never landed, and TestRail can re-render a case's
text hours later *without* moving the timestamp at all.

| Proof | Result |
|---|---|
| Planned cases carrying exactly the intended `refs` | **343 / 343** |
| Untouched cases of ours, byte-identical **including `updated_on`/`updated_by`** | **137 / 137** |
| Foreign cases (Vladimir Tomovic), byte-identical on the same standard | **12 / 12** |
| 343 written + 137 untouched | **= 480, the whole of our suite** |
| Raw markup across our 480 | **0** |
| CRLF across our 480 | **0** |
| `refs` entries over 248 characters | **0** (longest written: 247) |
| Cases still carrying a comma in `refs` | **0** |
| Cases with no `refs` at all | **0** |
| Version pins in `refs`, total | **442** |
| **Stale version pins remaining** | **0** |

### Run 359 — proven undamaged

| Check | Before | After |
|---|---|---|
| `include_all` | false | **false** (never changed; `update_run` was never called) |
| Tests | 476 | **476** — case-id sets and test-id sets **equal in BOTH directions** |
| Result records | 535 | **535** — **all present BY ID, 0 missing, 0 new** |
| **Graded fields changed on any result** | — | **0** (`status_id`, `comment`, `defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`, `case_id`, `id`) |

**The derived echo moved, exactly as expected, and it was traced rather than waved through.**
`case_refs` on a run result is a stored snapshot of the case's References that catches up when the
case is next written (playbook §J, declared normalisations #2b / #2c). It moved on **400 result
records across 325 cases — and every single one of those 325 is a case this pass wrote. Zero
belong to a case we did not touch.** That is the difference between a declared echo and damage,
and it is why the trace was run instead of assumed.

### The suite, as two numbers (Rule 38)

**Ours: 480. Live under group 4281: 492.** The difference is the **12 cases authored by Vladimir
Tomovic** (C38919–C38923, C43567–C43573), which are never edited, never counted in our tallies,
and were proven byte-identical here.

### Automation markers — the gate is now closed

| | Before | After |
|---|---|---|
| `AUTOMATION: READY` | 337 | **338** |
| `AUTOMATION: READY - EXPECT FAIL` | 100 | 100 |
| `AUTOMATION: HOLD` | 42 | 42 |
| **Total markers** | **479 of 480** | **480 of 480** |

The single missing marker was C30288's, and it is now present. **Every case in the suite carries
exactly one.**

### Deliverables

Local source was **re-synced FROM LIVE before anything was regenerated** — and the re-sync is
itself a cross-check: it moved **exactly 343 `refs` fields and exactly 1 `expected` field**, which
is precisely what this pass wrote and nothing else.

| Check | Result |
|---|---|
| Four counts — live · local active · id-map · import | **480 / 480 / 480 / 480, set-equal in BOTH directions** |
| Shredding guard (a newline between every character) | **0 rows** |
| Import header sha256 | `a45eae40ec73b8ac` — **identical to all five peer projects** |
| id-map | **480 rows, 0 blank C-ids, 0 blank refs** (both re-merged from live, as the generator drops them on every rerun) |
