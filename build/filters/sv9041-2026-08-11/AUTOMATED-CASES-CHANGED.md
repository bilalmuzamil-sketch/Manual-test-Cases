# RULE 65 — AUTOMATED-FLAGGED CASES TOUCHED — Filters / SV-9041 — 2026-08-11

**Rule 65 requires every touched case carrying `custom_atmstatus = 3` (Automated) to be reported,
with its C-id and link, captured AT WRITE TIME rather than read back later.**

## Result: NONE. Neither case touched this pass is Automated-flagged.

`custom_atmstatus` was captured inside the executor on the post-write re-GET, in the same operation
as the byte verification, so the value is the one in force at the moment of the write.

| Case | Internal ID | `custom_atmstatus` at write time | Meaning | Link |
|---|---|---|---|---|
| C29601 | FLT-COLL-01 | **1** | not automated | https://shopview.testrail.io/index.php?/cases/view/29601 |
| C43562 | FLT-PR-PAR-01 | **1** | not automated | https://shopview.testrail.io/index.php?/cases/view/43562 |

**So no automated test was disturbed by this pass**, and no automation engineer needs to be told a
script's source case moved under them.

---

## The four Automated-flagged cases in the Filters suite — for the record, all UNTOUCHED

A live census of all 114 of our cases found **4 carrying `custom_atmstatus = 3`**; the other 110
carry `1`. These are the four Vladimir Tomovic set by hand, exactly as the brief states.

| Case | Title | Touched this pass? |
|---|---|---|
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Customer filters together show only work orders matching both | **NO** |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters are remembered permanently, even after closing the browser | **NO** |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile: tapping Apply Filters applies the statuses and updates the list | **NO** |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Imported works alone: picking it greys out the other filters | **NO** |

**A note worth recording, because it looks like a contradiction and is not.** Three of these four —
C29600, C29623 and C38877 — **do** appear in the Job-1 re-sync report as bodies whose **local** copy
was refreshed from live. That was a **local file operation only**: the re-sync pulled live text down
into the repository's case source. **No TestRail write was made to any of them**, by this pass or by
Job 1, which issued none at all.
