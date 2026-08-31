# RUN 417 PRE-WRITE BASELINE — Invoice Refresh · read 2026-08-31T09:13:35Z

Taken **before** any authorised write, while the run is static, because a run snapshot is only
evidence if it predates the write (core §4 step 3). Raw data: `snapshots/PRE-run417.json` (run +
all 119 tests + all 87 result records) and `snapshots/PRE-cases-6559.json`.

## THE RUN IS ALREADY IN SYNC — the authorised update is currently a NO-OP

| | |
|---|---|
| Run | **417** — *"Invoice UI Refresh — Full Suite (2026-08-25)"* |
| `include_all` | **false** (frozen selection — so new cases never appear by themselves) |
| Tests in the run | **119** |
| Invoice Refresh cases live under group 6559 | **119** |
| Set equality, both directions | **TRUE** — 0 in the run that are not ours, 0 of ours missing from the run |

**⇒ Nothing needs adding today.** The union sync becomes necessary only if the suite changes during
the pass. **And it stays UNION-ONLY when it does run**: `update_run` replaces the selection, so a
partial `case_ids` list deletes the omitted tests *and their results*.

## 🔴 A CORRECTION TO MY OWN FIGURE: THE SUITE IS 119 CASES, NOT 87

I have been quoting **87** for Invoice Refresh all week — that was true on 2026-08-25 and is now
stale. The suite has grown to **119**; another session extended it. Every count I gave for this
project, and the six-suite total of 428, should be re-derived rather than reused.

## THE 87 "RESULTS" ARE ASSIGNMENTS, NOT GRADES — the QA lead's statement is confirmed

`get_results_for_run/417` returns 87 records, which reads alarmingly like graded work. It is not:

| Field | Value across all 87 |
|---|---|
| `status_id` | **null** — not one is graded |
| `assignedto_id` | **6** (Mudassir Qamar) |
| `created_by` | **3** (us) |
| `comment` | none |

They are the by-product of the bulk **assignment** action, which mints a result row per test to carry
the assignee. **GRADED results: 0.** So the QA lead's *"Mudassir is not working on that test run yet"*
is confirmed by measurement, not taken on trust — and **there is currently nothing a run write could
destroy.** That will stop being true the moment he starts, which is exactly why this baseline is
committed now.

## ⚠️ 32 TESTS IN THE RUN HAVE NO ASSIGNEE

The assignment covered **87** tests; the run now holds **119**. So **32 tests are unassigned** —
the assignment predates the suite growing. A tester opening the run would find a third of it with
nobody's name on it. **Not fixed — assigning tests is a run write and belongs to whoever owns the
run.** Reported for the QA lead's decision.

## WHAT THE 119 CASES CURRENTLY CLAIM ABOUT THE BUILD

**All 119 carry `AUTOMATION: Not available on Build to test Yet`** — none has ever been build-verified.
That is the honest starting position for this pass, and it is what the pass exists to change.

**5 of the 119 are flagged Automated (`custom_atmstatus = 3`).** Under Rule 71 those are **ask-first
for any edit**, and under the coupling rule they may be edited **only** in a pass that also
build-verifies them — which this pass will be. **I will identify them and put them to the QA lead
before touching any of the five**, and any change to them goes on the "FOR VLAD" hand-off with its
source reference.

## STILL HOLDING

No case opened, no step walked, no verdict formed, no write of any kind, no lock claimed. Waiting on
the QA lead's go-ahead after his source-currency check.
