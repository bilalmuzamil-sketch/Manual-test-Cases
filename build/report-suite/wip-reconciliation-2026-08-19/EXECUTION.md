# WIP SPEC RECONCILIATION — execution (2026-08-19)

> Applies **Chris Ward's 2026-08-19 WIP rulings** (both messages, verbatim in
> `build/report-suite/chris-answers-2026-08-19/WIP-CHRIS-RULINGS-2026-08-19.md`) to the WIP test
> cases, and **live-re-checks the corrected S11-R7 snapshot-read behaviour**. Chris's rulings are an
> authoritative PO answer (Rule 57 source (c)) and the newest product source (Rule 32); he pins the
> live WIP page at **Confluence version 24**.
> **Interim `<br>` writes** — the TestRail `update_case` markdown wrap block is still active
> (`UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`); QA lead accepted the interim `<br>` format
> (template C30133). This is cleanup debt (demark to plain once the TestRail API is fixed).

## Build under test
**`v3.8-d0e135e`** — `index.html` last-modified **Wed, 19 Aug 2026 13:27:07 GMT**, etag
`aa6ea37f82dd0af1b3fe6da5dfd65573`. **Read at pass start AND end — identical, no redeploy during the
pass.** Same build as the 8/19 WIP/PV/TU sweeps. Non-final branch → verdicts **PROVISIONAL** (Rule 60).

## Source currency (Rule 31/59)
| Source | Identifier | Version / date | Checked | Verdict |
|---|---|---|---|---|
| WIP spec (live Confluence page) | pageId **703660034** | **v24** (per Chris, 2026-08-19) | 2026-08-19 | **NOT FETCHED — SSO-walled, no Atlassian MCP in this session; staging cookies do not auth atlassian.net (HTTP 404).** Proceeded on Chris's rulings (authoritative PO answer). **Page body export owed by the user.** |
| WIP spec (local baseline) | `build/report-suite/wip-v22-2026-08-18/` | v22 | 2026-08-18 | STALE vs v24 |
| PO rulings | Chris Ward, both 2026-08-19 messages | 2026-08-19 | 2026-08-19 | **CURRENT** — newest authoritative product source |
| Epic | SV-8582 / WIP stories SV-8657/8658/8659/8660/8667/9214/9282 | — | — | unchanged this pass |
| Build | staging `v3.8-d0e135e` | 8/19 13:27 GMT | 2026-08-19 (start+end) | CURRENT |

## Live re-check — S11-R7 / S7-R8a (the "as of" snapshot read)
Driven via admin quick-login → change-location Heavy Duty 9919 →
`GET /api/reporting/reports/work-in-progress?from=<ISO>&to=<ISO>` (single "as of" day = `from`==`to`,
ISO instants; plain dates 400). **The response carries `as_of_date` and `has_snapshot` — the report
DOES read the nightly snapshot.**

- **Today (2026-08-19):** `has_snapshot: true`, real data — tab_counts Estimates 239 / Completed 62 /
  ApprovedPartiallyCompleted 162 / ApprovedNotStarted 133; totals populated.
- **Earlier days (8/18, 8/12, 7/15, 6/1):** `has_snapshot: false` → 0 rows, all totals $0 (no snapshot
  captured for those days on this staging org — correct "no snapshot / no rows" behaviour, matching
  C30502 item 3 and the C30460 no-data case).
- **Only the trend / over-time view is unbuilt** (no trend endpoint/tab) — C30455 item 1 confirmed.

**⇒ The old "no screen reads the snapshot / nothing in the report reads it back" wording is DISPROVEN
live.** The as-of date is the snapshot-read mechanism.

## Live re-check — Rulings 1 & 2 (two-row jobs / Days Open / Adjustments)
From today's as-of read (per-tab pull):
- **Two-row jobs exist:** 31 work orders appear in BOTH the Estimates tab AND their status tab
  (ApprovedPartiallyCompleted) — max **two** rows per job.
- **Both rows share `start_date` → same Days Open** (Ruling 2 confirmed: "both rows show the same
  number, correct not a bug"). Money splits by tab (status-tab row carries Earned; Estimates row
  Earned $0).
- **Adjustments only on the status-tab row (S3-R6):** WO **S9-24840** status-tab adj −21899 /
  Estimates adj 0; WO **S9-26352** status-tab adj −6039 / Estimates adj 0.

## Writes — 13 `update_case`, interim `<br>`, normalization-aware re-verify (Rule 50 declared clause)
The `<p>` wrapper + trailing `\n` + `&`/`<`/`>`/`—`→entity escaping are the documented block transform
and are NOT treated as mismatches (verifier `block()` proven idempotent on the 4 API cases first). A
write halts only on a genuine CONTENT change or `<ol>/<li>`. Per-op log
`wip-recon-oplog.jsonl`. **13/13 HTTP 200 + verify PASS. Post-write census: 0 anomalies** — each case
exactly 1 `AUTOMATION` marker + 1 provenance line + `<br>` present, 0 `<ol>/<li>`, atm=1, created_by=3.

| # | Case | atm | Change | Marker |
|---|---|---|---|---|
| 1 | WIP-TAB-05 **C30455** | 1 | S11-R7 corrected — removed "no screen reads the snapshot"; only trend view unbuilt | READY |
| 2 | WIP-API-01 **C30528** | 1 | Ruling 1: grain + **max-two-rows** + **Adjustments only on status-tab row (S3-R6)**; fixed false "nothing reads it back" note; **HOLD→READY** | READY |
| 3 | WIP-API-03 **C30530** | 1 | S11-R7 note fixed (readable via as-of); **HOLD→READY** | READY |
| 4 | WIP-API-04 **C30531** | 1 | S11-R7 note fixed; **HOLD→READY** | READY |
| 5 | WIP-API-06 **C30533** | 1 | S11-R7 note fixed; **HOLD→READY** | READY |
| 6 | WIP-FLT-05 **C30502** | 1 | content already correct (reconstructs from snapshot) — re-anchored v22→v24, re-stamped | READY |
| 7 | WIP-FLT-04 **C30501** | 1 | single as-of control — re-anchored v22→v24, re-stamped | READY |
| 8 | WIP-ADJ-07 **C43820** | 1 | earlier-day no adjustment backfill — re-anchored v22→v24, re-stamped | READY |
| 9 | WIP-COL-07 **C30472** | 1 | Ruling 2: **both rows same Days Open, correct not a defect** + **no per-line ageing** | READY |
| 10 | WIP-SCOPE-01 **C30456** | 1 | Ruling 3: line-state placement re-anchored to S3-R5/S3-R6; **Rule-56 divergence note retired** | READY |
| 11 | WIP-SCOPE-03 **C30458** | 1 | Ruling 3: same | READY |
| 12 | WIP-PLACE-03 **C30464** | 1 | Ruling 3: started-boundary + line-state S3-R5/S3-R6; divergence note retired | READY |
| 13 | WIP-PLACE-05 **C43979** | 1 | Ruling 3: slices-sum-to-total + line-state S3-R5/S3-R6; divergence note retired | READY |

**Marker note:** C30528/30530/30531/30533 flipped **HOLD→READY** because the HOLD reason ("nothing in
the product reads it back") is now factually wrong — the snapshot IS read via the as-of date
(live-verified). This is a content change driven by a source change (v24 S11-R7), not a metadata
re-stamp, so the marker legitimately changes (Rules 60/61/69). All were atm=1 (writable, Rule 71 clear).

## Held (Rule 71) — Automated atm=3, VERIFIED LIVE, 0 writes
- **WIP-SCOPE-05 C30460** — no-data message when no qualifying WOs. **Live-verified** (earlier day
  `has_snapshot:false` → all tab_counts 0, 0 rows = no-data across tabs). ⚠️ Its marker still reads
  `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` — now **stale/disproven**
  (the feature IS testable live). Held: needs the coupled build-verify + Vlad hand-off (Rule 71). See RS-WIP-1.
- **WIP-PLACE-01 C30462** — status-to-tab mapping. Line-state placement model live-verified (31 two-tab
  WOs). Held (atm=3).
- **WIP-TAB-02 C30452** — four tabs fixed order, partially-completed selected. Live-observed (tab order +
  default selection). Held (atm=3).

## Foreign (Rule 38) — untouched
**C38922, C43572** (Vladimir Tomovic, id 1, atm=3) — re-GET confirms created_by=1, unchanged.

## Safety / integrity
- **Run 359 UNTOUCHED** — `include_all` False; tests 508→508, results 535→535; case_id AND result_id
  sets equal both directions; 6 passed / 502 untested unchanged. 0 run/result writes.
- **0 Jira** (Standing Rule 62 + active creation hold — nothing created).
- No role/staff/settings changed; nothing seeded destructively (read-only report drives only);
  Tech untouched; cookies never committed; every diff secret-scanned.

## v22 → v24 deltas applied (Rule 43, from Chris's rulings — live v24 page not fetchable)
| # | Delta (v24) | Source | Cases |
|---|---|---|---|
| D1 | **S11-R7 corrected** — a screen DOES read the nightly snapshot; an earlier "as of" date reconstructs that day (S7-R8a). Only the trend view is unbuilt. (Was: "no screen reads the snapshot".) | Chris msg [3] | C30455, C30528, C30530, C30531, C30533 (+ C30502/C43820 already correct) |
| D2 | **Per-line ageing line REMOVED** — the stray spec line (unapproved line ages from its own line date) is gone as of v24; aging is per job, FINAL. Two-row job → same Days Open (correct, not a defect). | Chris msg [1] | C30472 |
| D3 | **Story 3 / S2-R4 tidied to the line-state model** (new **S3-R5, S3-R6**) — the old status-model self-contradiction is closed at source. | Chris msg (ruling 3) | C30456, C30458, C30464, C43979 (divergence note retired) |
| D4 | **S3-R6** — Adjustments belong only on the status-tab row; a job writes at most two rows (status tab + Estimates if unapproved lines). | Chris msg (ruling 1) | C30528 |
| D5 | **Quote Age column = future** (SV-9372, Parth, not started) — nothing to test; do NOT file the shared Days Open value as a defect. | Chris msg [2] | none (no such case today) |

**⚠️ Not a fetched-page diff.** The live v24 Confluence page (703660034) could not be pulled
(SSO-walled, no Atlassian MCP; staging cookies do not auth atlassian.net → HTTP 404). These deltas come
from Chris's 2026-08-19 rulings (authoritative PO answer, Rule 57 source (c)). A full byte-level
v22→v24 page diff is owed once the user exports the v24 page body (RS-WIP-6).

## Live limits (honest)
- **Historical snapshot VALUES for earlier days** — none exist on staging (`has_snapshot:false`), so
  reconstructed non-empty history could not be shown; the reconstruction MECHANISM is confirmed live
  (today `has_snapshot:true`). Data-state on a disposable env, not a missing feature; no screen-driven
  snapshot backfill endpoint exists.
- **Nightly capture idempotent re-run** — background behaviour; C30528 asserts only the screen-observable
  half.
- **C30464 started-boundary** — line-state placement live-confirmed; exact time-vs-part trigger rests on
  spec S3-R4.

## Recommended QA-lead spot-checks (4)
WIP-TAB-05 **C30455** (S11-R7 corrected) · WIP-API-01 **C30528** (grain + S3-R6, HOLD→READY) ·
WIP-COL-07 **C30472** (aging per job) · WIP-PLACE-05 **C43979** (slices sum to WO total).
