# Schedule finish4 — TestRail execution log

**`update_case` ONLY. 15 operations over 15 distinct cases, every one HTTP 200 and
byte-verified.** Zero `add_case` · zero `delete_case` · zero section writes · **zero run writes** ·
**zero results logged** · zero Jira calls that create anything. `custom_atmstatus` was **never sent**.

Every write went through `tr.update_case_verified`, which takes a pre-write snapshot, re-GETs after
the write and compares **every field** against the intended payload, proving every field we did not
intend to change is byte-identical. On any mismatch it raises and the batch **stops**. The log below
was flushed to disk **after each write**, so a killed run leaves its exact position.

**All three text fields were sent on every payload** (`custom_preconds`, `custom_steps`,
`custom_expected`) because TestRail re-renders any text field omitted from the payload.

**Payloads were printed and read before sending.** The self-check asserted, per payload: exactly one
Rule-54 build stamp, exactly one `AUTOMATION:` marker, and no punctuation artefact.

**Three cases were refused as no-ops rather than written** — C30017, C30018 and C30057 already
carried `v3.5-65d6500`. 18 walked − 3 no-ops = **15 writes**, and that arithmetic is the
reconciliation.

## What changed, and why

Every operation is the same edit: **re-stamp Standing Rule 54 sentence 2** to the build the case was
actually walked on — `Last checked against build v3.5-65d6500 on 12 August 2026.` Sentence 1, which
names the documents, was **not touched on any case**, and no expected behaviour was altered.

| # | Case | HTTP | Byte-level verification | `custom_atmstatus` at write time |
|---|---|---|---|---|
| 1 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | 200 | finish4 1/15 C29962: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 2 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | 200 | finish4 2/15 C30005: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 3 | [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | 200 | finish4 3/15 C30031: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 4 | [C30060](https://shopview.testrail.io/index.php?/cases/view/30060) | 200 | finish4 4/15 C30060: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 5 | [C30065](https://shopview.testrail.io/index.php?/cases/view/30065) | 200 | finish4 5/15 C30065: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 6 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | 200 | finish4 6/15 C30068: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 7 | [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | 200 | finish4 7/15 C30072: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 8 | [C30073](https://shopview.testrail.io/index.php?/cases/view/30073) | 200 | finish4 8/15 C30073: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 9 | [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | 200 | finish4 9/15 C38849: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 10 | [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 200 | finish4 10/15 C38850: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 11 | [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | 200 | finish4 11/15 C38851: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 12 | [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | 200 | finish4 12/15 C38864: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 13 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | 200 | finish4 13/15 C38866: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 14 | [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | 200 | finish4 14/15 C43556: 30 fields compared, 3 intended, 0 mismatch | 1 |
| 15 | [C43589](https://shopview.testrail.io/index.php?/cases/view/43589) | 200 | finish4 15/15 C43589: 30 fields compared, 3 intended, 0 mismatch | 1 |

## Run 357 — proven untouched, by content

| | Before | After |
|---|---|---|
| tests | 176 | 176 |
| result records | 529 | 529 |
| results missing **by id** | — | **0** |
| new results during the write window | — | **0** |
| fields that moved on any prior result | — | **none at all** |
| `include_all` | false | **false** |

Test-id sets and case-id sets are **equal in both directions**. Snapshots:
`evidence/run357-PRE.json`, `evidence/run357-POST.json`.
