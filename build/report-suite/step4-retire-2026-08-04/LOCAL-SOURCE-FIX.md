# STEP 4 — the local-source landmine, fixed · 2026-08-04 · LOCAL ONLY, zero TestRail writes

## THE LANDMINE WAS BIGGER THAN THE BRIEF DESCRIBED — and the brief's own instruction would have tripped it

The brief said: *"`cases/*.json` holds **535** bodies, **57 not in the id-map** — 2026-07-28 deletions
never marked `Retired`. Mark those 57 Retired."*

**Two things about that turned out to be wrong, and the second one is dangerous.**

**(1) The 57 were ALREADY marked `Retired`.** Measured: 535 bodies, 469 in the id-map, **66 not in
it**, of which **57 already carry a `Retired — 2026-07-28 (…)` status** from the consolidation. So the
genuine gap was **9**, not 57 — and those 9 are **exactly this morning's authorised merge/cut
deletions**, which the merge pass never marked. Proven by set comparison, not by eye:

```
today's 9 deletions, by internal id: IV-API-04 IV-SCOPE-05 IV-SORT-04 PV-ROW-10
                                     SBC-EMPTY-02 TU-LOC-04 WIP-API-02 WIP-API-05 WIP-TAB-03
the gap (not in id-map, not Retired): IV-API-04 IV-SCOPE-05 IV-SORT-04 PV-ROW-10
                                     SBC-EMPTY-02 TU-LOC-04 WIP-API-02 WIP-API-05 WIP-TAB-03
EXACT MATCH: True
```

**(2) The far worse problem: the local case source was STALE against TestRail, and regenerating the
import silently reverted live content.** The brief's Step 4 says *"confirm the generator emits exactly
the live count and the import stays byte-accurate"* — I did that, and it **failed**. Regenerating from
the local source **dropped 63 rows' worth of live content**:

| Field reverted | Rows affected |
|---|---|
| `Expected Result` | **56** — including **all 47 DO NOT AUTOMATE blocks** |
| `References` | **16** |
| `Preconditions` | **2** |

**Cause:** the last several TestRail pushes — the 47 DO-NOT-AUTOMATE stamps, a refs pass, two
precondition edits, and my own 8 Step-3 notes — were applied to **TestRail** and mirrored into the
**import**, but were **never written back into `cases/*.json`**. The live→local sync
(`../final-push-2026-08-04/sync_local.py`) had last run against a snapshot taken **before** the
DO-NOT-AUTOMATE stamping, so the generator's input was behind its own output.

**This is the actual landmine.** Anyone who regenerated the import — following the brief's own
instruction — would have handed the automation engineer a file with every do-not-automate warning
silently deleted, and nothing in the generator's clean output would have hinted at it. It prints
*"VIU occurrences: 0 … Rows missing Preconditions/Steps/Expected: NONE"* and looks perfect.

---

## WHAT I DID, IN ORDER

**1 · Marked the 9 `Retired`, mirroring Fees & Discounts / Simple Flow exactly.** Same shape as
`build/fees-discounts/cases/*.json`: a `viu_status` of
`"Retired - 2026-08-04 (<reason>; C<id> deleted from TestRail; prev status <X>)"` plus the same
sentence appended to `notes`, naming the survivor, the merge group, and the `delete_case` HTTP 200 /
re-GET HTTP 400 evidence. **Bodies kept, never deleted** — that is the whole point of the convention.
Pre-edit copies of all 8 touched files: `backup/`.

| Internal id | C-id deleted | Folded into | Group |
|---|---|---|---|
| IV-SCOPE-05 | C30544 | IV-SCOPE-01 = [C30540](https://shopview.testrail.io/index.php?/cases/view/30540) | CUT (duplicate) |
| IV-SORT-04 | C30586 | IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | MG-IV-TOTALS-POSITION |
| IV-API-04 | C30608 | IV-API-03 = [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | MG-IV-SNAPSHOT-RERUN |
| PV-ROW-10 | C30350 | PV-CALC-06 = [C30364](https://shopview.testrail.io/index.php?/cases/view/30364) | MG-PV-REVERSAL |
| SBC-EMPTY-02 | C30182 | SBC-EMPTY-01 = [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | MG-SBC-EMPTY-LOADING |
| TU-LOC-04 | C30445 | TU-LOC-03 = [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | MG-TU-LOC-FALLBACK |
| WIP-TAB-03 | C30453 | WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | MG-WIP-TAB-COUNTS |
| WIP-API-02 | C30529 | WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | MG-WIP-SNAPSHOT-SHAPE |
| WIP-API-05 | C30532 | WIP-API-03 = [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | MG-WIP-SNAPSHOT-PRECISION |

**2 · Re-synced the local source FROM live TestRail**, which is the byte-verified system of record.
Took a **fresh** live pull (474 total / 469 ours, after my Step-3 writes; the previous snapshot kept as
`data/live-after.json.pre-step3.bak`) and re-ran the existing `sync_local.py` with its unchanged
field mapping — `title`, `custom_preconds`→`preconditions[]`, `custom_steps`→`steps[]`,
`custom_expected`→`expected[]`, `refs`→`spec_ref`. It corrected **61 `expected`, 16 `spec_ref`, 2
`preconditions`** across 20 files.

**3 · Regenerated the import, then re-merged the id-map C-ids.** The generator **blanks the C-id
column on every run** — CLAUDE.md warns about this for Filters and Schedule and it fired here too,
blanking **all 469**. Restored from the committed id-map by `internal_id`.

---

## THE PROOF — set equality both directions, and a byte comparison against live

```
local active ids         469
id-map rows              469
live ours (created_by=3) 469
id-map distinct C-ids    469
local - idmap  = (empty)      idmap - local = (empty)
live  - idmap  = (empty)      idmap - live  = (empty)
duplicate local ids = (none)
```

| Check | Result |
|---|---|
| Local bodies: total / active / Retired | **535 / 469 / 66** (57 from 2026-07-28 + **9 new**) |
| **Import rows byte-compared to live** on `Preconditions`, `Steps`, `Expected Result`, `References` | **469 / 469 match, 0 mismatches** |
| **DO NOT AUTOMATE blocks in the import** | **47** — restored (was 0 after the naive regeneration) |
| id-map C-ids populated | **469 / 469**, 0 blanks |
| id-map titles matching live | **469 / 469** |
| Import header SHA-256 vs all four peer projects | **`a82ca60c36074512b0df99f2` — identical (Rule 16)** |
| Six split imports | 84 + 111 + 71 + 59 + 76 + 68 = **469 == unified**; each header identical; **every row present in the unified file** |
| `VIU` occurrences / `feature flag` occurrences | **0 / 0** |
| Duplicate titles / internal-ID leaks in cells | **0 / 0** |
| Titles over 80 characters | **0** (longest is exactly 80) |

**Zero TestRail calls were made in this step other than the read needed for the fresh snapshot.**
Nothing was written to TestRail.

---

## THE RECOMMENDATION THIS EARNED

**The generator must not be run without the live→local sync immediately before it, and the C-id
re-merge immediately after.** Both steps are silent when skipped and both produce a file that looks
correct. Either `gen_import.py` should call the sync itself and stop refusing to preserve C-ids, or
there should be a single wrapper that does all three in order. **A one-command wrapper would have
prevented today's revert**, and it is the only lasting fix — I have not written it because changing
the generator's contract is a decision, not a chore.

---

## OUTSTANDING — what I need from you

1. **May I wrap the three steps into one command** (sync from live → generate → re-merge C-ids), so
   the import can never again be regenerated from a stale source? **Blocked on: you.**

Nothing else is outstanding from this step.
