# TestRail execution log — Report Suite spec-delta, 2026-08-11

**Authorised by the brief.** Jira creation stays barred (Standing Rule 62 + the active hold); **no Jira call that creates anything was made.**

| | |
|---|---|
| `update_case` | **24** (one write per case; 2 extra ops on C38913, see the repair note) |
| `add_case` | **4** |
| `delete_case` | **0** |
| section writes | **0** |
| `update_run` / results | **0** |
| Verification | re-GET + byte compare, **30 fields per op, 0 mismatches, 0 collateral changes** |
| Rule 54 sentence 2 | **preserved byte-exact on all 24** — 0 added, 0 removed, 0 re-dated |

Every payload carried **all three text fields** (`custom_preconds`, `custom_steps`, `custom_expected`), because TestRail re-renders an omitted text field into `<p>`-wrapped HTML with CRLF endings.

## Updates

| C-id | Automation status | Fields written | Marker before → after | Build line |
|---|---|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | **3 (Automated)** | title, custom_steps, custom_expected, refs | READY | preserved |
| [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | 1 | custom_expected | READY | preserved |
| [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | 1 | custom_expected, refs | — → READY | none (and none invented) |
| [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | 1 | custom_expected | READY - EXPECT FAIL (SV-9001) | preserved |
| [C30226](https://shopview.testrail.io/index.php?/cases/view/30226) | 1 | custom_expected | READY | preserved |
| [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) | 1 | custom_expected | READY | preserved |
| [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) | 1 | custom_expected | READY - EXPECT FAIL (SV-8981) | preserved |
| [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | 1 | custom_expected | READY - EXPECT FAIL (SV-8880) | preserved |
| [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | 1 | custom_expected | READY - EXPECT FAIL (SV-8972) | preserved |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | **3 (Automated)** | custom_expected, refs | READY - EXPECT FAIL (SV-8938) | preserved |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | 1 | custom_expected, refs | READY → HOLD - the specification states two differen… | preserved |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | **3 (Automated)** | custom_expected, refs | READY → HOLD - the specification states two differen… | preserved |
| [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | 1 | custom_expected, refs | READY → HOLD - the specification states two differen… | preserved |
| [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | 1 | custom_expected | READY - EXPECT FAIL (SV-8987) | preserved |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | **3 (Automated)** | custom_expected | READY - EXPECT FAIL (SV-8907) | preserved |
| [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | 1 | custom_expected, refs | HOLD - the written description says two diff… → READY | preserved |
| [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | 1 | custom_expected, refs | HOLD - the written description says two diff… → READY | preserved |
| [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | 1 | custom_expected, refs | HOLD - the written description says two diff… → READY | preserved |
| [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | 1 | custom_expected | READY | preserved |
| [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | 1 | custom_steps, custom_expected, refs | READY | preserved |
| [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) | 1 | custom_expected, refs | READY - EXPECT FAIL (SV-8818) | preserved |
| [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | 1 | title, custom_steps, custom_expected, refs | READY | preserved |
| [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | 1 | title, custom_expected, refs | READY - EXPECT FAIL (SV-8938) | preserved |
| [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | 1 | title, custom_steps, custom_expected, refs | HOLD - the written description says two diff… → READY | preserved |

## Creations

| Internal | C-id | Section | `custom_atmstatus` | Marker |
|---|---|---|---|---|
| `SBC-TYPE-04` | [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | 4291 | **1 (Not Automated)** | AUTOMATION: READY |
| `WIP-CALC-11` | [C43592](https://shopview.testrail.io/index.php?/cases/view/43592) | 4354 | **1 (Not Automated)** | AUTOMATION: READY |
| `WIP-CALC-12` | [C43593](https://shopview.testrail.io/index.php?/cases/view/43593) | 4354 | **1 (Not Automated)** | AUTOMATION: READY |
| `WIP-CALC-13` | [C43594](https://shopview.testrail.io/index.php?/cases/view/43594) | 4354 | **1 (Not Automated)** | AUTOMATION: READY |

## Two failures, both stopped correctly

**Rule 50 requires a batch to stop on any mismatch rather than retry blindly. It stopped twice.**

1. **C38913, `refs` 265 characters → HTTP 400 `Field :refs does not match the required pattern`.** The write did not land and the case was verified unchanged. A `refs_guard` was added that fails BEFORE the call; it then caught C38917 at 249 and C38859 at 264 pre-write.

2. **A nine-case substitution batch stopped on C30466** when its target string was not found — the text was in the provenance, not the body. The eight before it had already been written and verified; C30466 was then handled separately. **No blind retry, and nothing was written on a guessed target.**

## One defect of our own, owned

The op on **C38913** replaced the whole provenance block and so **dropped Rule 54 sentence 2**. The writer's own post-write guard caught it immediately, and the build line `Last checked against build v3.5-7168d14 on 8/6/2026.` was restored **byte-exact from the PRE snapshot** and re-verified. The writer was then changed to take `prov_s1`, which replaces sentence 1 and carries everything from `Last checked against build` onward through untouched — so the failure cannot recur by construction. **That is why C38913 took two ops.**

## Run 359 — proven undamaged, before and after

| Check | Result |
|---|---|
| `include_all` | false → **false** |
| Tests | 476 → **476**, test-id and case-id sets equal in **both** directions |
| Results | 535 → **535**, **all present BY ID**, 0 missing |
| Graded-field changes on prior results | **0** |
| New results during the window | **0** |
| Derived read-time echo | 14 records moved on `case_refs`/`case_title`, tracing to **9 cases, every one of which we edited** |
| `update_run` | **never called.** The union is staged in `STAGED-RUN-359-SYNC.md` and left |

The run is frozen at 476 tests, so the 4 new cases are **not** in it. Sending a partial `case_ids` list would delete the omitted tests **and their 535 results**, so the staged value is the full 480-id union and it needs the QA lead's authorisation.

## Foreign cases — untouched, proven by content

The 12 cases by Vladimir Tomovic (C38919–C38923, C43567–C43573) are **byte-identical before and after on every field, `updated_on` and `updated_by` included**. Ours **480** / live total **492** — reported as two numbers, never merged.

## A third failure: HTTP 500 that had ALREADY WRITTEN — new, and it belongs in the playbook

The last op of the pass — trimming C30169's 110-character title, the only one of 480 over the
80-character convention — returned:

```
HTTP 500 {'error': 'An unexpected error occurred. If this problem persists, please contact support
and reference error ID: d8c0bb200f43339ebc52fdb8ab7a01ac'}
```

**The write had in fact succeeded.** The harness raises on a non-200 *before* it reaches its
verification step, so nothing was verified automatically. **It was not retried** (Rule 50 bars a
blind retry); the live state was read instead, and the 30-field comparison was then run by hand
against the pre-write snapshot:

```
C30169: 30 fields compared, 4 intended, 0 mismatch
```

Title is the intended 76-character value; `custom_preconds`, `custom_steps`, `custom_expected` and
`refs` are byte-identical to the snapshot; no collateral change.

**Why this matters beyond this one case.** A pass that reads HTTP 500 as *"the write failed"* and
re-runs a **different** payload — a rebuilt body, a re-stamped provenance — would be writing on top
of a change that already landed. **The safe response to a 500 on `update_case` is to READ THE CASE,
not to re-send.** Recorded here and flagged for `build/APP-ACTIONS-PLAYBOOK.md` §J; that file was
not edited from this pass.
