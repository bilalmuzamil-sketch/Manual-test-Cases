# Schedule — recovery STATE, 2026-08-04

A worker ran the full Schedule live-VIU chain with TestRail write authority and was cut off during
its wrap-up. This file records the **verified** state of the live systems and of its own artefacts,
established read-only **before anything was changed**. Nothing here is taken on trust from the
interrupted worker's own claims; every figure below was re-measured.

## 1. What the interrupted worker actually completed

Its commits (all pushed — the sweeper had stalled for ~6 h and they landed later than their
timestamps suggest, but nothing was lost):

| commit | what it carries |
|---|---|
| `5db7304` | source currency, live pull of 165 cases, run 357 snapshot, build marker |
| `76b9811` | live findings batch 1 — the UTC time defect, all four conflict types, labels |
| `f4fe005` | 166 `data-test-id` hooks, series, spread, delete-scope, reassign |
| `f993e51` | permission tiers proven at the backend; working-hours editors; keyboard gaps |
| `6dd18e3` | a definite verdict for all 165 cases — zero partly-observed |
| `592a94f` | ten defects filed (SV-8848…SV-8857); push plan; first 20 cases byte-verified |
| `cd73a99` | 105 of 165 case updates pushed and byte-verified |
| `81f367d` | all 165 pushed and byte-verified; deliverables reconciled |
| `ce19037` | coverage re-derivation, audit, gap hunt, surface matrix, registers, re-check queue |
| `4e0bf6e` | the sweeper's final checkpoint — READINESS, the execution log, CLAUDE.md, the register |

**It got further than its truncated message suggested.** The execution log, the readiness report and
the CLAUDE.md / outstanding-register edits all exist and were committed by the sweeper's last sweep.

## 2. Live TestRail state — re-measured, not assumed

| check | expected | **found** | verdict |
|---|---|---|---|
| sections in the group-4254 tree | — | **31** (incl. the group itself) | — |
| cases under 4254 | 165 ours, 0 foreign | **165, every one `created_by: 3`** | **MATCH** |
| foreign cases | none | **none** — 0 cases with any other author | **MATCH** |
| run 357 `include_all` | false | **false** | **MATCH** |
| run 357 tests | 165 | **165** | **MATCH** |
| run 357 result records | 429 | **429** | **MATCH** |
| prior results present **BY ID** | all | **all 429 present by id; 0 missing, 0 new** | **MATCH** |
| run case-id set vs the start-of-pass snapshot | equal | **equal both ways** — 0 only-before, 0 only-after | **MATCH** |
| run case-id set vs live cases under 4254 | equal | **equal both ways** — 0 either side | **MATCH** |

Run 357 is **intact**. No case was added or retired, so no `update_run` union was needed and none
was sent.

### The four counts (Rule 50 — set equality both ways, not matching totals)

| | count | proof |
|---|---|---|
| live-ours under 4254 | **165** | `get_cases` filtered to the 31-section subtree, `created_by == 3` |
| local active case bodies | **165** | 192 bodies − 27 marked Retired |
| `testrail-id-map.csv` rows | **165** | 0 blank C-ids |
| import CSV rows | **165** | `schedule-v1-testrail-import.csv` |

- id-map C-ids **vs** live ids: **set-equal both ways** (0 either side)
- local active internal ids **vs** id-map internal ids: **set-equal both ways** (0 either side)
- import titles **vs** live titles: **set-equal both ways** (0 either side)

## 3. Provenance (Standing Rule 54) — 165 of 165

Every one of the 165 cases ends its Expected Results with the provenance sentence, **naming both the
build date and the build identifier**: `the build tested on 8/4/2026 (v3.5-4873abe)`.

- carrying the sentence at all: **165 / 165**
- carrying the **build date + marker** (state 2): **165 / 165**
- **carrying it twice: 0** — the stamper is idempotent, verified live

## 4. The DO-NOT-AUTOMATE set — matches the HELD set exactly

Two cases carry the wording, and they are exactly the two the worker recorded as HELD:

| case | C-id | why |
|---|---|---|
| SCH-SPREAD-07 | [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | shop closures vs the spread — the specification says it both ways, nobody has ruled |
| SCH-EDGE-05 | [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | the same contradiction, from the other side |

## 5. The build marker — no redeploy, so the later observations stand

| | at the worker's start (16:03Z) | **now** | verdict |
|---|---|---|---|
| `<meta name="app-version">` | `v3.5-4873abe` | **`v3.5-4873abe`** | **identical** |
| `index.html` last-modified | Tue, 04 Aug 2026 14:47:39 GMT | **Tue, 04 Aug 2026 14:47:39 GMT** | **identical** |
| etag | `9b4b1fc776ebbfb04a9a0ca051d847f7` | **`9b4b1fc776ebbfb04a9a0ca051d847f7`** | **identical** |

**The branch did not redeploy mid-run.** Nothing the worker observed is invalidated on that count.
The session in `/tmp/schedule-viu/cookies.json` is alive; one sign-in was used, no more.

## 6. Verdict coverage — 165 of 165 have a definite verdict

Re-tallied from the execution log **and** independently re-derived from the live case text by
section. The two agree **section for section, exactly**:

| verdict | count |
|---|---|
| works correctly on the build | **138** |
| broken on the build | **19** |
| not built yet | **4** |
| held for the product owner | **2** |
| cannot be set up on this estate | **2** |
| **definite verdict** | **165 / 165** |

**Zero cases are unobserved, partly-observed or unverdicted.** 169 `update_case` operations, all
HTTP 200, all byte-verified MATCH with 28 fields compared each (165 cases + 4 audit repairs).

## 7. Things found in a half-state, and what was done

### 7a. **A pre-existing shift was left damaged on the branch — RESTORED**

`ebdd3e03-ab10-40f3-b820-4dd7e6192892`, work order **S-9379** (Xiriver Apparel, unit 16604, 11
lines). The Day-view sideways-drag test (SCH-DAY-04 =
[C30004](https://shopview.testrail.io/index.php?/cases/view/30004)) issued
`PATCH /api/schedule/shifts/ebdd3e03…` — captured in `snapshots/f-batch13.json`. The worker's own
note says *"The pre-existing shift was restored afterwards."* **Its start time was restored. Two
other things were not:**

| field | start-of-pass snapshot | found now | |
|---|---|---|---|
| `staffId` | `57378c17…` | `0aac76eb…` | **reassigned to a different technician** |
| `endsAt` | `2026-08-05T01:00:00Z` | `2026-08-04T17:30:00Z` | **duration 720 min → 270 min** |
| `startsAt` | `2026-08-04T13:00:00Z` | `2026-08-04T13:00:00Z` | restored correctly |

The parent series `1bb9ffbb…` therefore read **1530** scheduled minutes instead of **1980**.
See §8 for the restore and its verification.

### 7b. **The generated import file was corrupt — REGENERATED**

`testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` had **a newline between every single
character** of Preconditions, Steps and Expected Results — all 165 rows. Cause: the worker's
`tools/sync_local.py` correctly refreshed the local bodies from live but wrote those three fields as
**strings**, where they had previously been **lists**; `gen_import.py`'s `joinlines()` does
`"\n".join(...)` over its argument, which iterates a string character by character. Introduced in
`81f367d`; the file was clean in every earlier commit. Titles and References were unaffected, which
is why the worker's own header-and-title checks passed.

### 7c. **The local case source had gone stale for 4 cases — RE-SYNCED**

The local bodies were refreshed from live *before* the 4 audit repairs were pushed, so
[C29927](https://shopview.testrail.io/index.php?/cases/view/29927),
[C29988](https://shopview.testrail.io/index.php?/cases/view/29988),
[C30009](https://shopview.testrail.io/index.php?/cases/view/30009) and
[C30081](https://shopview.testrail.io/index.php?/cases/view/30081) still held the pre-repair text.
Any regeneration would have reverted them — the exact trap that fired three times today.

### 7d. **17 cases said a defect had no ticket when 8 of them now do — CORRECTED**

Seventeen broken/not-built cases carried *"It has been reported to the QA lead but has no developer
ticket yet."* All ten tickets **SV-8848…SV-8857** were verified live in Jira as **Bug · priority
Low · parent SV-8685 · owning story linked · status Open** — so for eight of those cases the
sentence was false, and the readiness report's claim that each broken case *"names its ticket
number"* was not yet true. Only 3 of the 10 filed tickets appeared anywhere in the case text.

### 7e. Two cases leaked developer jargon into tester-facing text — CORRECTED

The worker's audit hunted exactly this and repaired three cases, but missed two of its own new
known-issue notes: [C30004](https://shopview.testrail.io/index.php?/cases/view/30004)
(`PATCH /api/schedule/shifts/{id}`, `13:00Z to 14:00Z`) and
[C38863](https://shopview.testrail.io/index.php?/cases/view/38863)
(`acknowledgeLongSeries:false`, `409`, `422`) — both sitting in non-API sections, which also
tripped the API-placement rule.

### 7f. Reported, NOT changed

- **16 of the 165 cases hold raw HTML markup** (`<ol>`, `<li>`) in Preconditions, Steps and Expected
  Results, which a tester sees literally. **This predates today** — the same 16 appear in the
  pre-write snapshot, so it is not a regression from this pass. Repairing it is a TestRail write on
  16 cases and needs the QA lead's go-ahead.
- **One real defect has no ticket and no register entry:** SCH-MODAL-03 =
  [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) — the shift window's TIME
  LOGGED read *"40h 19m / 40h 19m"* with a full progress bar on a shift where nothing had been
  clocked. Every other unticketed deviation has a documented reason; this one does not.
- **The corrupt-import bug also hit the Filters import** (`filters-v1-testrail-import.csv`, all 110
  rows, same cause). **Out of this task's scope — not touched, reported instead.**

## 8. Environment left clean

| thing | state |
|---|---|
| the three `ZZAUTOTEST` roles it created | **already deleted** — the org holds exactly its 11 system roles |
| the staff member it borrowed (Henry Hess) | **restored to Technician**, `role_id 0a80a61f…` = the original |
| staff holding a `ZZAUTOTEST` role | **none** |
| seeded shifts on 9–11 Aug | **all removed** — the 9–16 Aug window holds zero shifts |
| events | **4, unchanged** from the start-of-pass snapshot |
| technicians with custom working hours | **1**, with the original ranges — no working-hours write survived |
| the location business-hours toggle | **still off** — the working windows for the overlapping dates are byte-identical to the snapshot, so nothing was saved |
| shift `ebdd3e03…` | **was damaged (§7a) — restored, see the execution log** |

## 9. Honest limits of this recovery

- Every verdict in the pass remains **PROVISIONAL**: engineering has not declared branch `sv8685`
  final, so `build/schedule/viu-2026-08-04/RECHECK-QUEUE.md` stays **OPEN** with one row per case.
- I did **not** re-drive any case. The verdicts are the interrupted worker's live observations; what
  I verified is that all 165 exist, that they were written correctly, and that the systems around
  them are sound.
- The full response body of the PATCH that damaged shift `ebdd3e03…` was truncated in the captured
  evidence, so **which** call dropped the 450 minutes cannot be pinned down from the record — only
  that the shift ended the day 450 minutes shorter and on the wrong technician. That is stated as an
  open question, not as a diagnosed defect.
