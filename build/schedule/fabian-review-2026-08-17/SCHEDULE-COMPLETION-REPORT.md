# Schedule — Fabian design-review reconciliation — COMPLETION REPORT (2026-08-17)

Plain-English summary for the QA lead. Build verification was **deliberately deferred** this pass
(your 2026-08-17 instruction); the application was never opened.

## What I did (in order)

**Step 0 — recorded the new marker rule.** Your 2026-08-17 directive is now a durable rule:
- **CLAUDE.md → Standing Rule 69** + the "Deliverable conventions" automation-marker bullet (now four
  marker strings, not three).
- **build/skills/00-COMMON-CORE.md §15** (a fourth marker form) and **01-CASE-BUILD.md step 5**.
- The literal marker string, used on every case this pass touched:
  `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`
- (The task named 02-SOURCE-CHECK too, but that skill does not describe markers, so nothing was added
  there.) Committed alone as `dd0c7dd5`.

**Step 1 — source currency (SOURCE-CURRENCY.md).** See the verdict table below.

**Step 2 — coverage re-derivation, both directions (COVERAGE-REDERIVATION.md).** The 14 new stories
decompose into 34 testable requirement rows → 19 NEW cases + ~24 existing cases to update.

**Step 3 — authored + pushed.** 19 new cases created in TestRail; 2 stale existing cases corrected.

**Step 4 — quality gate (QUALITY-GATE.md), staged run sync (STAGED-RUN-357-SYNC.md), this report.**

## Source currency (Rule 31) — what I could and could not fetch
| Source | Verdict | Detail |
|---|---|---|
| **Spec** (Confluence 713031682) | **STALE, fetched OK** | Live **Confluence v30** (last edited 2026-08-13); our baseline `requirements.md` is v25, cases cite v27. A full v25→v30 re-ingest of `requirements.md` is **owed** (not done this pass). |
| **Epic + stories** (SV-8685) | **CURRENT, fetched OK** | **39 children**, verified two ways (`parent=` 39, `"Epic Link"=` 39, key sets equal). 14 NEW stories **SV-9231…SV-9244** = the new scope. |
| **Designs** (Claude/Figma/technical) | **PARTIAL / not fetchable this session** | The attached Schedule Claude designs are **not present** in my environment (scratchpad had only an unrelated Aug-10 diff dump; /tmp had a codesign MCP config token but no design content and no loaded tool; the repo has only the earlier ingested prototype `build/schedule/design-2026-07-27/` and the Aug-10 handover `.md`). Exact on-screen labels not pinned by the spec/story text are marked **VIU-confirm**, never invented. |
| **Technical design / tech plan** | **MISSING** | No new tech plan/technical design was supplied for the Fabian scope; the last one is 2026-07-29 and cannot be re-fetched. Reminded (outstanding). |
| **PO / handover** | **CURRENT** | The 14 new stories are the newest authoritative source and supersede the Aug-5 handover where they overlap. |

Rule-59 re-read at write start (18:28Z): spec v30 + epic 39 both ways — **UNCHANGED**.

## Counts — honest, and the two build numbers reported separately (core §1.5)
| | Count |
|---|---|
| New cases authored + pushed to TestRail | **19** (C43795–C43813) |
| Existing cases updated (byte-verified) | **2** (C30054 menu; C29931 unassigned lane) |
| Existing cases FLAGGED for update but DEFERRED this pass | **~22** (list below) |
| Stories fully covered (new + existing) | SV-9243 already covered (SCH-PANEL, re-anchor only); SV-9231…9242/9244 now have new cases |
| Not-independently-testable / blocked | **0** |
| **Build-verified this pass** | **0** — build verification deferred; nothing observed (Rule 12) |
| **Steps walked on the build this pass** | **0** — the app was not opened |
| Suite size after this pass | live under group 4254: **176 → 195** (ours); id-map 195 |

Every one of the 21 touched cases carries the **Rule-69 "Not available on Build to test Yet" marker** —
none claims `READY`, because nothing was build-verified. The later sync lifts them.

**TestRail writes:** 19 `add_case` + 2 `update_case`, **all HTTP 200/201, all Rule-50 byte-verified**
(new: 5 fields match + `custom_atmstatus=1` not 3; updates: 30 fields compared, 0 collateral). Oplogs:
`oplog-add.jsonl`, `oplog-update.jsonl`. **0 run writes, 0 Jira writes, 0 deletes.**

## AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)
**None.** Standing Rule 65 keys off `custom_atmstatus = 3` (Automated). **No touched case is `3`.**
- The 19 new cases were created at `1` (Not Automated) — confirmed live.
- **C30054** is `1`.
- **C29931 is `4` (Pending)** — it was `4` **before** this pass (not set by us), and the byte-verify of
  the update showed **0 collateral change**, so its automation status was not touched. `4` = Pending,
  not Automated, so there is **no tell-Vlad obligation** — but it is recorded here for accuracy rather
  than glossed as `1`.
No case flagged Automated (`3`) was changed.

## A note I owe you (Standing Rule 63 — surfacing a tension, not a conflict)
The task said "every case created OR updated this pass gets the new marker; do not write READY."
Standing Rule 15.1a warns that a not-available marker on an already-runnable case can disarm it. I
treated this as a **LAYERING, not a conflict**, and applied the Rule-69 marker to all 21 touched
cases — because **your own Rule 69 explicitly covers "verification deliberately DEFERRED for the
pass"**, and the later sync lifts the marker. The 2 updated cases (C30054/C29931) were previously
`READY`; they now carry the deferred marker until the sync re-confirms them. If you would rather a
pure metadata re-anchor keep its old `READY` marker, tell me and I will adjust.

## OUTSTANDING — what I need from you
1. **Run 357 sync authorization** (go-ahead) — the 19 new cases are NOT in Ayesha's run 357
   (`include_all` false, frozen at 176). Union to 195 is staged in `STAGED-RUN-357-SYNC.md`; a run
   write needs your explicit per-ask permission (Rules 6/34). **Blocks:** the new cases appearing in
   the execution run. Since 2026-08-17.
2. **The ~22 deferred existing-case updates** (go-ahead + confirm the marker choice above). These are
   existing cases the new stories make incomplete/stale; the new cases already COVER the behaviour, so
   this is alignment, not a coverage gap. **List:** SCH-SPREAD-03/04/05/08, SCH-CAP-04, SCH-CONF-02/03,
   SCH-DND-01/04, SCH-WOL-02/04, SCH-MODAL-02/03, SCH-DAY-01/04/05, SCH-START-03/07, SCH-PANEL-01…06
   (re-anchor to SV-9243). **Blocks:** 5 in-direction contradictions closing fully (QUALITY-GATE.md).
   Since 2026-08-17.
3. **The build-verification sync** — to lift the 21 Rule-69 markers to `READY` (or `READY - EXPECT
   FAIL` where a live ticket backs a failure). **Blocks:** any "ready to automate" figure for the new
   scope. Since 2026-08-17.
4. **Technical design / tech plan for the Fabian scope (Rule 30)** — none supplied; owed by
   engineering. **Blocks:** edge-case/API-contract strengthening of the new cases.
5. **Design finality (source D)** — is Sasha's design final? If so, re-ingest it and confirm the
   labels currently marked VIU-confirm. **Blocks:** pinning ~unconfirmed on-screen labels.
6. **Full v25→v30 `requirements.md` re-ingest** — our local spec mirror is 5 versions behind. This
   pass reconciled the epic-story new scope, not the whole spec body. **Blocks:** describing
   `requirements.md` as current.

Nothing else outstanding on this pass.
