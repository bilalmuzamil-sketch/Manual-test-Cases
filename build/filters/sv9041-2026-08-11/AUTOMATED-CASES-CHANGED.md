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

---

## ADDENDUM — the case CREATED on 2026-08-11 is `custom_atmstatus = 1`

**[C43590](https://shopview.testrail.io/index.php?/cases/view/43590) — FLT-COLL-06** was created with
**`custom_atmstatus = 1` ("Not Automated")**, read back live on the post-create re-GET.

**It is deliberately NOT 3.** `3` is TestRail's own **Automated** marker and it is **Vladimir
Tomovic's to set**, never ours — a case we create has been automated by nobody, so `3` would both
claim his work and pollute the signal Rule 65 reads. The payload came from the canonical builder
`build/testing-tools/testrail_add_case.py`, which **raises** rather than letting `3` through, and the
repo guard `check_add_case_payloads.py` was run **before** the create: **PASS, exit 0, 891 files
scanned, 0 new payloads sending 3.**

**So the Filters suite still holds exactly 4 Automated-flagged cases** — C29600, C29614, C29623,
C38877 — and **none was touched by this pass**. There is nothing here Vlad needs to be told about.
