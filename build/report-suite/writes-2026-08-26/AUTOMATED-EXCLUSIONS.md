# Report Suite — APPROVED WRITE PASS — 2026-08-26

TestRail writes made under the QA lead's approved write pass. Every write is scripted, logged
per operation, and byte-verified by a re-GET (Rule 50). **No `add_case`, no `delete_case`, no
run writes were made.**

## GATE 0 — Rule 71 Automated check

All **309** distinct target cases were freshly `get_case`-ed and `custom_atmstatus` read
(`logs/gate0.log`, one line per case). **45 carry `custom_atmstatus = 3` (Automated) and are
EXCLUDED from every write** — read-assessed only, held for the QA lead's per-case decision.

**C30265 and C43831 are excluded ABSOLUTELY** (held pending a PO ruling, Rule 58). They were
never fetched and never touched.

### Automated exclusions by group, and what each would need

| Group | Automated C-ids excluded | What each would need if he releases it |
|---|---|---|
| A — content rewrite | C30287, C30518 | C30287: SBR §14-R17 moved in v24 — Expected Results re-read against v24 and the marker moved to last (it is also one of the 2 `marker-not-last` cases). C30518: WIP S9-R13 moved in v21→v28 — needs a v28 re-read plus an AUTOMATION marker (it is also one of the 13 markerless cases). |
| B — add version pin | C30488 | Add the WIP v28 provenance pin after confirming its content matches v28. |
| C — re-pin | 39 cases (see table below) | Provenance line version bumped to the live spec version. Bookkeeping only; no content change. |
| D — format | C30162, C30277, C30287 | C30162 and C30287: AUTOMATION marker moved to the end. C30277: no action needed — see the format finding below. |
| E — add marker | C30221, C30346, C30353, C30460, C30462, C30508, C30518, C30535, C30563 | One AUTOMATION marker appended as the last line of Expected Results. 9 of the 13 markerless cases are Automated, so only 4 were writable. |

### All 45 Automated C-ids

| C-id | Link |
|---|---|
| C30162 | https://shopview.testrail.io/index.php?/cases/view/30162 |
| C30217 | https://shopview.testrail.io/index.php?/cases/view/30217 |
| C30221 | https://shopview.testrail.io/index.php?/cases/view/30221 |
| C30247 | https://shopview.testrail.io/index.php?/cases/view/30247 |
| C30255 | https://shopview.testrail.io/index.php?/cases/view/30255 |
| C30256 | https://shopview.testrail.io/index.php?/cases/view/30256 |
| C30262 | https://shopview.testrail.io/index.php?/cases/view/30262 |
| C30271 | https://shopview.testrail.io/index.php?/cases/view/30271 |
| C30272 | https://shopview.testrail.io/index.php?/cases/view/30272 |
| C30274 | https://shopview.testrail.io/index.php?/cases/view/30274 |
| C30275 | https://shopview.testrail.io/index.php?/cases/view/30275 |
| C30276 | https://shopview.testrail.io/index.php?/cases/view/30276 |
| C30277 | https://shopview.testrail.io/index.php?/cases/view/30277 |
| C30287 | https://shopview.testrail.io/index.php?/cases/view/30287 |
| C30293 | https://shopview.testrail.io/index.php?/cases/view/30293 |
| C30314 | https://shopview.testrail.io/index.php?/cases/view/30314 |
| C30322 | https://shopview.testrail.io/index.php?/cases/view/30322 |
| C30326 | https://shopview.testrail.io/index.php?/cases/view/30326 |
| C30328 | https://shopview.testrail.io/index.php?/cases/view/30328 |
| C30333 | https://shopview.testrail.io/index.php?/cases/view/30333 |
| C30338 | https://shopview.testrail.io/index.php?/cases/view/30338 |
| C30346 | https://shopview.testrail.io/index.php?/cases/view/30346 |
| C30351 | https://shopview.testrail.io/index.php?/cases/view/30351 |
| C30352 | https://shopview.testrail.io/index.php?/cases/view/30352 |
| C30353 | https://shopview.testrail.io/index.php?/cases/view/30353 |
| C30354 | https://shopview.testrail.io/index.php?/cases/view/30354 |
| C30375 | https://shopview.testrail.io/index.php?/cases/view/30375 |
| C30377 | https://shopview.testrail.io/index.php?/cases/view/30377 |
| C30390 | https://shopview.testrail.io/index.php?/cases/view/30390 |
| C30451 | https://shopview.testrail.io/index.php?/cases/view/30451 |
| C30452 | https://shopview.testrail.io/index.php?/cases/view/30452 |
| C30460 | https://shopview.testrail.io/index.php?/cases/view/30460 |
| C30462 | https://shopview.testrail.io/index.php?/cases/view/30462 |
| C30488 | https://shopview.testrail.io/index.php?/cases/view/30488 |
| C30498 | https://shopview.testrail.io/index.php?/cases/view/30498 |
| C30506 | https://shopview.testrail.io/index.php?/cases/view/30506 |
| C30507 | https://shopview.testrail.io/index.php?/cases/view/30507 |
| C30508 | https://shopview.testrail.io/index.php?/cases/view/30508 |
| C30510 | https://shopview.testrail.io/index.php?/cases/view/30510 |
| C30511 | https://shopview.testrail.io/index.php?/cases/view/30511 |
| C30515 | https://shopview.testrail.io/index.php?/cases/view/30515 |
| C30518 | https://shopview.testrail.io/index.php?/cases/view/30518 |
| C30527 | https://shopview.testrail.io/index.php?/cases/view/30527 |
| C30535 | https://shopview.testrail.io/index.php?/cases/view/30535 |
| C30563 | https://shopview.testrail.io/index.php?/cases/view/30563 |

