# Filters build-verify 2026-08-19 — EXECUTION LOG

Build **v3.8-d0e135e** (last-mod Wed 19 Aug 2026 13:27:07 GMT, etag `aa6ea37f82dd0af1b3fe6da5dfd65573`)
— read at pass start and end, unchanged. Interim `<br>` write format (TestRail markdown-wrap block
active). Every `update_case` byte-verified: word-content preserved, `<br>` breaks present, NO
`<ol>/<li>`, exactly 1 marker + 1 provenance line, refs intact. Per-op record: `filters-bv-oplog.jsonl`.

## Writes: 119 `update_case`, 0 add / 0 delete / 0 section / 0 run / 0 result. 0 Jira. 0 foreign touched.

| Batch | Section(s) | Cases | Decision |
|---|---|---|---|
| 1 | Filter Bar Layout | 9 | 8 DEFERRED → READY; C29559 kept HOLD (Branko greyed/hidden Status chip) |
| 2 | Status Filter | 6 | C29560 DEF→READY; C29561–65 re-stamp READY |
| 3 | Customer/Lead-Tech/Advisor entity panels | 23 | all DEFERRED → READY (removal from WO + Story-16 panel contract verified) |
| 4 | Asset(7) + Active Chips(6) + Collapse(6) + Empty(3) | 22 | DEF→READY / re-stamp; C29595 chip label "Status : Estimate"→"Status: Estimate" |
| 5 | Tab(7) + Persistence(6) + URL(6) | 19 | DEF→READY; RDY/HOLD/XF markers preserved; all re-stamped |
| 6 | API(6) + Page Search desktop(12) | 18 | DEF→READY; RDY re-stamp; HOLD/XF preserved |
| 7 | Mobile(10) + page-search mobile(2) | 12 | DEF→READY; **C29624 + C29625 XF→READY** (SV-8875 fix verified); RDY/XF preserved |
| 8 | Parts(6) + Reports(4) | 10 | all kept HOLD (Branko write-up pending) + re-stamped |

## Held (Rule 71 — Automated, 0 writes): 5
C38877, C29600, C29614, C29618, C29623 — all verified PRESENT/PASS live; intended edits recorded in
`FILTERS-HELD-AUTOMATED.md` for QA-lead + Vlad.

## Marker census (live, read back after all writes) — 124 ours
READY **99** · EXPECT-FAIL **5** · HOLD **18** · DEFERRED **2** (= the 2 Automated held C29600/C29623).
Raw `<ol>/<li>` markup: **0**. Cases with ≠1 marker: **0**. READY-TO-AUTOMATE = **104**.
Started: DEFERRED 59 / READY 40 / HOLD 18 / XF 7. Net: 57 deferred lifted (2 held), 2 XF→READY.

## Live verification method
One admin browser session drove the WO filter bar (chips, panels, tabs, clear, persistence, share,
empty), a mobile 390×844 session drove the sheets + deferred-apply, and the API filter contract was
exercised directly. Entity-panel contract verified on Parts/Reports. Tools: `tools/*.mjs`.

## Rule 74 §8.5 gate: PASS — 0 cases skipped for data-seeding or login reasons.
No seeding needed (existing staging data covered every state); admin + tech quick-login used; Tech left
on its own role (no role-swap needed — no role-negative case in scope).

## Run 352
0 run/result writes performed (only `update_case`). NOTE: a pre-pass snapshot of run 352 was not taken
this session (process miss); the oplog proves 0 run/result operations, and `update_case` cannot alter
run tests or results. Live run 352 test/result counts reflect other workers' activity since the
2026-08-17 snapshot, not this pass.

## Deviations (0 Jira filed — creation hold Rule 62): see the pass FINDINGS in the worker report.
DEV-1 empty state generic (C29607/C38897, kept READY, flagged). DEV-2 empty-state "Clear filters"
recovery link vs "no Clear anywhere" (C29597/99 nuance). SV-8875 verified FIXED (C29624/25 → READY).
XF SV-8832/8912 deviation broadly persists (markers kept; tickets not re-verifiable this pass).
