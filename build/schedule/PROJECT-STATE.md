# Schedule — PROJECT STATE (canonical cold-resume doc)

> **Read this first to resume the Schedule project.** Single authoritative snapshot.
> Keep this project's memory SEPARATE from other projects; reuse shared infrastructure
> (staging/QA access method, harness scripts, TestRail API patterns, the two process
> docs) across all projects.

## 0. STATUS / WHAT'S LEFT TO DO — read first (Last updated 2026-07-31)

### 0.0-BRANKO-ANSWERS BRANKO'S ANSWERS INGESTED + APPLIED + PUSHED (2026-07-31, LATEST — read this first)

**Branko answered the 2026-07-27 question sheet. Both long-HELD items are settled, the local spec
was 5 Confluence versions stale, 24 cases were edited, and 16 `update_case` writes are live in
TestRail (all HTTP 200, all re-GET MATCH). Run 357 verified read-only — 165 tests, 429 result
records unchanged. Nothing deleted.**

**Resume docs for this pass:** `branko-answers-2026-07-31/answers-ingested.md` (his verbatim
answers) → `DELTAS.md` (consequences, §10 = what got pushed, §11 = the new question) →
`audit/AUDIT-2026-07-31.md` (Rule-28) → `testrail-execution-log-2026-07-31.md`.

**SPEC WAS STALE — now current.** `requirements.md` corresponded to Confluence **version 18**
(2026-07-22); live is **version 23** (2026-07-30, Branko). **We were 5 versions behind.** The live
body + a per-version attributed diff are in `spec-current-2026-07-31/`
(`Schedule-spec-current.md`, `SPEC-DIFF.md`). ⚠️ **`requirements.md` itself is still the v18 text** —
the 2026-07-27 epic pass and the 2026-07-30 tech-plan pass edited CASES from Jira/the plan but never
re-ingested the page, which is exactly why it lagged. Nine body deltas found; **seven were already
reflected in our cases**; the two that were not are the two HELD items. ⚠️ **Read
`spec-current-2026-07-31/` (not `requirements.md`) as the current spec** until requirements.md is
re-ingested. **The page-body "Version" field always reads 1.0 — use the Confluence version number.**

**His answers (7 asked, 6 answered, 1 declined):**
| Q | Topic | Answer |
|---|---|---|
| 1 (**D1**) | Do events consume technician capacity? | **A — yes.** Quotes §4.12 verbatim. **REVERSES his 2026-07-22 "no"** |
| 2 (**D4**) | 'Reassign' button in the shift pop-up? | **B — no button, drag only.** He also deleted the clause from the PRD in v23 |
| 3 | Printable Week Export in V1? | **No** — "nothing about this in the PRD, not in the future requirements" |
| 4 | Cell-menu shortcut + wording | **C** — "there is no right click, only left click"; menu = 'Create event' + 'New work order' |
| 5 | Default working day | **B — 7:00 AM to 7:00 PM** |
| 6 | VIN in the hover note | **A — always visible regardless of the toggle.** Closes OQ-6(a) |
| 7 | Test the backend too? | **NOT ANSWERED** — "I'm not sure if this question is for me Bilal." **Re-route to engineering / the QA lead; do not re-ask him** |

**BOTH HOLDS LIFTED.**
- **D1 = A → a real reversal, not a confirmation.** SCH-EVT-08 (C30615) asserted the opposite and was
  rewritten (title + expected); SCH-CAP-01 (C30030) now names shift+event hours; the stale
  "events excluded" notes cleared on C30031/C30032/C30033/C30023. The tech plan already built it this
  way, so plan + spec + PO now agree.
- **D4 = B → confirmation.** SCH-MODAL-08 (C30015) was already right; only its provenance/refs
  changed. SCH-REAS-02 stays retired. **Jira SV-8695's text is now the stale artefact** (still lists a
  modal Reassign action) — for the story owner, we do not edit Jira.

**Biggest genuine find: the cell menu was unrunnable as written.** The 2026-07-27 pass fixed the menu
ITEMS but left **right-click** in 6 active cases; Branko and the spec (since v22) both say left-click
only. Corrected on C30016, C30017, C30018, C30054, C30075, C30077, C38855.

**16 `update_case` EXECUTED (15 authorized + 1 same-run repair), all 200 + re-GET MATCH:**
SCH-EVT-08 C30615 · SCH-CAP-01 C30030 · SCH-MODAL-08 C30015 · SCH-EVT-01 C30016 · SCH-EVT-02 C30017 ·
SCH-REAS-03 C30054 · SCH-EVT-03 C30018 · SCH-PERM-02 C30075 · SCH-PERM-04 C30077 · SCH-REAS-06 C38855
(×2, the repair) · SCH-CONF-03 C30025 · SCH-SER-01 C29987 · SCH-SER-02 C29988 · SCH-DAY-06 C30006 ·
SCH-EDGE-08 C38866. **0 add_case · 0 add_section · 0 delete_case · 0 update_run · 0 result writes.**
9 further edits are **notes-only and stay LOCAL** (the executor pushes only title / preconds / steps /
expected / refs).

**TALLY UNCHANGED: 165 ACTIVE, all VIU-Pending.** Live count under group 4254 = **165** == the
165-row id-map (165 C-ids, 0 blanks after the re-merge). Import regenerated over 165 — header
byte-identical to all four prior project imports, 0 VIU/flag words, 4 API cases in "API — Schedule".

**Rule-28 audit (`audit/`): 21 KEEP / 2 WEAK-KEEP / 1 CUT · 24 SENSIBLE · 24/24 genuine +
layman-runnable · KEEP-but-NONSENSE empty. The cross-case consistency sweep ran SUITE-WIDE over all
165 cases: 6 contradiction groups found, 6 resolved, 0 delivered unresolved.** Two were invisible to
every other check — **X6** (SCH-EVT-02/C30017 said a left-click STARTS event creation while
SCH-REAS-03 said the same click OPENS A MENU; it reads perfectly cold and is only wrong next to its
neighbour) and SCH-SER-01's step-3 residue. 7 more candidate pairs were checked and CLEARED with
reasons (mostly role-gated preconditions).

**Also folded in:** 4 over-length titles trimmed on cases already being written (SCH-SER-01 137→76,
SCH-SER-02 117→72, SCH-CAP-01 125→80, SCH-MODAL-08 82→60) — **title-trim backlog 79 → 75.**

### ⚠️ OPEN AFTER THIS PASS

1. **HELD RETIRE — needs your ruling: SCH-EXP-01 (C38853) Week Export.** Branko says it is not in V1
   and not in the backlog; the audit rates it CUT. **NOT deleted.** Retiring it is 3 linked ops:
   `delete_case` C38853 + decide the then-empty section **5406 "Week Export and Printing"** +
   a **run-357 resync** (Rule 34).
2. **4 NEW questions his answer opened — spec silent, so deliberately NOT asserted** (`DELTAS.md`
   §8/§11): **A1** do event hours feed the per-technician OT tag / hover breakdown (C30032, C30033)?
   **A2** do department-assigned events consume each tech's time? **A3** does an all-day event consume
   a full day? **A7** does switching the 'Events' display OFF take event hours back out of the
   capacity bars (C30046)?
3. **A4 — Q7 re-route.** Backend-testing scope goes to engineering / the QA lead, not Branko.
4. **A5** — what 'New Work Order' actually DOES (toast vs opens the WO window) is still unresolved;
   SCH-REAS-06 (C38855) passes either way.
5. **A6 — migration heads-up for product:** now that events count, ~9,684 migrated legacy events will
   raise capacity bars at cutover. Expected, not a bug.
6. **NQ-1..NQ-5 still unanswered** — `PO-Questions-Branko-Schedule-TechPlan_2026-07-30` looks unsent.
   Its Q6/Q7 were re-asks of the 07-27 Q1/Q2 and are now answered, so **send it trimmed to
   NQ-1..NQ-5, plus A1/A2/A3.** The live spec now sides with our existing cases on **NQ-1** (closures
   NOT skipped in V1), **NQ-3** (hours live in Edit Staff Member + Edit Location) and **NQ-4**
   ("Add hours" explicitly "supports split shifts") — so reframe those three as "please confirm the
   PRD stands and the build plan should change". NQ-2 is genuinely split; NQ-5 the spec is silent on.
7. **Doc hygiene for Branko:** live v23 **§9 still** ties the tooltip VIN to the 'VIN Number' toggle,
   contradicting §4.13 and his own Q6 answer.
8. **Latent import defect (needs its own authorized write):** `SCH-HRS-04` precondition 1 carries a
   bare `(SCH-HRS-01/02)`; `clean()` strips only the ID and leaves a stray `(/02)` in the pushed
   text. Harden `clean()` in `gen_import.py` to drop the whole parenthetical.
9. **75 over-80-character titles** (was 79) — still needs its own authorized pass.
10. **`requirements.md` re-ingest to v23** — not done this pass; `spec-current-2026-07-31/` is the
    current-spec reference in the meantime.
11. **Live VIU still pending the QA branch (OQ-3)** and the Epic key is known (SV-8685). **Rule 12:
    PO-, spec-, design- and tech-plan-pinned ≠ VIU-Verified.**


**TEST RUN SYNCED 2026-07-31 (Standing Rule 34, user-authorized):** run **357 "Schedule -
Ayesha (VIU Pending)"** now contains the COMPLETE active Schedule suite — **+22 cases, 143 →
165 tests**, result records unchanged (429 → 429, nothing lost), and the run's case set is
**EQUAL both ways** to the 165 live cases in `testrail-id-map.csv` (0 missing, 0 extra).
Evidence: `build/testrail-run-sync-2026-07-31/run-sync-execution-log-2026-07-31.md`.

### 0.0-CONSOLIDATION-EXECUTED CONSOLIDATION + WORDING REPAIRS EXECUTED (2026-07-31, LATEST — user-authorized TestRail writes DONE)

**The Rule-28 usefulness-audit recommendations are now EXECUTED (user authorization
2026-07-31): the 20 merge groups + 2 cuts from `quality-audit-2026-07-31/MERGE-PLAN.md`
plus the 6 FIX-WORDING repairs from `USEFULNESS-AUDIT-2026-07-31.md`. 24 `update_case` +
25 `delete_case` = 49 operations, ALL HTTP 200, ALL re-GET verified, 0 failures. Nothing
else written: no add_case, no section writes, NO run writes (run 325 / all runs
untouched), nothing outside group 4254.**

- **NEW TALLY: 165 ACTIVE authored** (was 190) — all still **VIU-Pending** (the suite is
  pre-VIU / spec+design+tech-plan-only; Rule 12 — design-pinned ≠ VIU-Verified).
  **Live count under group 4254 = 165 == the 165-row id-map** (set-equality verified
  C-id-by-C-id, not just a count match).
- **20 merge groups** — each survivor gained the absorbed members' distinct
  steps/expected, with their `refs` unioned in (Rule 20), and **14 survivor titles were
  rewritten to ≤ 80 chars** (concise-title rule). Groups: G-NAV-LANDING, G-CELL-MENU,
  G-SIDEBAR-SEARCH, G-DRILLDOWN-OPEN, G-SCOPE-CONTENTS, G-SCOPE-MULTI, G-SPREAD-HEADER,
  G-VIN-TOGGLE, G-SHIFT-COLOR, G-SAMEDAY-LANE, G-AUTOSCROLL, G-EVENT-MODAL,
  G-HOURS-CONFLICT, G-VIEW-TOGGLES, G-UNDO, G-ESCAPE, G-ENTER, G-HRS-LOCATION,
  G-HRS-VALIDATION, G-WEEK-EXPORT. **0 groups held/skipped.**
- **23 merged-away members + 2 cuts deleted** (`delete_case`, all verified gone):
  members SCH-NAV-02 (C29926), SCH-WOL-03 (C29938), SCH-LINE-02 (C29949),
  SCH-SCOPE-04 (C29966), SCH-SCOPE-06 (C29968), SCH-SPREAD-01 (C29977),
  SCH-BLOCK-03 (C29993), SCH-BLOCK-04 (C29994), SCH-LANE-05 (C30000),
  SCH-DAY-02 (C30002), SCH-DAY-07 (C30007), SCH-EVT-04 (C30019), SCH-CONF-04 (C30026),
  SCH-VIEW-07 (C30048), SCH-VIEW-08 (C30049), SCH-REAS-04 (C30055), SCH-REAS-05 (C30056),
  SCH-DEL-07 (C30063), SCH-KEY-02 (C30067), SCH-KEY-04 (C30069), SCH-HRS-01 (C38846),
  SCH-HRS-07 (C38852), SCH-EXP-02 (C38854); cuts **SCH-START-08 (C29976)** (duplicate
  sweep of SCH-START-01..05) + **SCH-EDGE-01 (C30085)** (duplicate of SCH-SPREAD-10,
  C29986). **All 25 bodies are KEPT locally** marked `viu_status: "Retired - ..."` and
  are additionally backed up in `consolidation-backup-2026-07-31/` — nothing is lost.
- **6 FIX-WORDING repairs** (the residue of the two late spec reversals + one placeholder):
  **SCH-PERM-02 (C30075)** Expected 3 stale menu items → 'Create Event' / 'New Work Order';
  **SCH-PERM-04 (C30077)** step 2 'New Event' → 'Create Event';
  **SCH-EVT-03 (C30018)** precondition 2 'New Event' → 'Create Event';
  **SCH-COLOR-02 (C30072)** stale per-work-order colour open question DROPPED (the
  per-SHIFT rule is now asserted in Expected 3); **SCH-REAS-06 (C38855)** the
  to-be-confirmed placeholder moved out of Expected into the notes (Expected 1–2 are now
  the pass bar); **SCH-SPREAD-08 (C29984)** the impossible '(weekend / closure)' skip
  reason reworded to weekend-only (V1 does not skip closures per SV-8691).
  SCH-EVT-03 and SCH-COLOR-02 were survivor **and** repair → one `update_case` each with
  the final body.
- **⚠️ C-id correction:** the audit report's FIX-WORDING table listed three C-ids one-off
  (SCH-PERM-02 as C30074, SCH-PERM-04 as C30076, SCH-COLOR-02 as C30070). The
  authoritative ids from `testrail-id-map.csv` (and `per-case-verdicts.csv`, which agrees)
  are **C30075 / C30077 / C30072** — those are what was written.
- **HELD-pending-Branko items UNTOUCHED and verified still live:** SCH-EVT-08 (C30615) +
  SCH-CAP-01..04 (C30030–C30033) (events-count-toward-capacity, D1) and SCH-MODAL-08
  (C30015) (modal 'Reassign', D4). Verified programmatically absent from every merge group
  before any edit, and confirmed present in TestRail after.
- **Durable TestRail gotcha learned:** TestRail parses `refs` as a comma-separated
  reference LIST and **stores it with the spaces after commas removed** (`'§3, §3.1'` →
  `'§3,§3.1'`). 13 of the 24 updates read as `refs` "mismatches" purely because of this.
  **When re-GET-verifying `refs`, normalize `", "` → `","` first**, otherwise TestRail's
  own storage format is a false mismatch. Proven benign here: `sent.replace(", ", ",") ==
  stored` for all 13 (0 unexplained), no ticket key or spec anchor lost (Rule 20 intact),
  and 16 of the 49 pre-write snapshots already stored refs that way before this run.
- Deliverables regenerated over 165: `testrail-import/schedule-v1-testrail-import.csv`/
  `.xlsx` (165 rows, header byte-identical vs all four prior project imports, 0 VIU/flag
  words, no dup titles/ids, 4 API cases in "API — Schedule" per Rule 4, no C-id column) +
  `testrail-id-map.csv` (**165 rows, 165 C-ids, 0 blanks**; retired/deleted rows dropped
  per the SCH-REAS-02 convention). ⚠️ `gen_import.py` blanks the id-map C-ids and excludes
  Retired on every rerun — **re-merge the C-ids after any regeneration**.
- Artefacts: plan `quality-audit-2026-07-31/MERGE-PLAN.md` (header = EXECUTED) · report
  `USEFULNESS-AUDIT-2026-07-31.md` (header = EXECUTED) · manifest
  `testrail-execution-manifest-2026-07-31.md` (= EXECUTED) · per-operation audit
  `testrail-execution-log-2026-07-31.md` · pre-write `get_case` snapshots
  `pre-push-snapshot/` (49/49) · pre-edit case bodies + recovery instructions
  `consolidation-backup-2026-07-31/MANIFEST.md`.

**STILL PENDING after this pass (nothing here was authorized or done):**
1. **79 over-80-character titles** — the concise-title backlog. It was 98 before this pass
   and is **79** now (19 over-length titles belonged to merged-away members and a further
   batch was shortened as part of a survivor's new title). **Needs its own authorized
   pass.** Longest remaining: SCH-SPREAD-08 (C29984) at 133 chars.
2. **HELD items** — SCH-EVT-08 (C30615) + SCH-CAP-01..04 (C30030–C30033) (D1
   events→capacity) and SCH-MODAL-08 (C30015) (D4 modal 'Reassign') — awaiting Branko.
3. **19 WEAK-KEEP cases** — the audit recommends KEEP but tagged "build-acceptance /
   verify once" rather than per-cycle regression; no action taken.
4. Everything already open below: **live VIU pending the QA branch (OQ-3)**, the NQ-1..5 +
   Q1/Q2/Q3 sheets to Branko/dev, and Rule 12 (design/tech-plan-pinned ≠ VIU-Verified).


### 0.0-TECHPLAN-EXECUTED TECH-PLAN PUSH EXECUTED (2026-07-30, LATEST — user-authorized TestRail writes DONE)

**The §0.0-TECHPLAN push queue is now EXECUTED (user authorization "Push all three",
2026-07-30): exactly 2 add_section + 13 add_case + 2 update_case per
`tech-plan-2026-07-29/Schedule_TechPlan_ChangeList_2026-07-29.md` §A — ALL HTTP 200,
ALL re-GET verified MATCH, 0 failures. Nothing else written: no deletes, no run
writes (run 325/all runs untouched), no other cases/sections touched.**
- **2 add_section** under group 4254: **Cross-Module and Rewrite Regression = 5408**,
  **API — Schedule = 5409** (Rule 4 — the first API section/cases for Schedule).
- **2 update_case** (pre-push get_case snapshots in
  `tech-plan-2026-07-29/pre-push-snapshot/`; live titles confirmed unchanged):
  SCH-WOL-05 = C29940 (added expected #3 — paged loading of the sidebar list is
  expected, not a fault) + SCH-VIEW-03 = C30044 (added expected #4 — a user with no
  technician record does not see 'My Shifts' at all).
- **13 add_case** (all `custom_atmstatus:3`+`custom_automation_type:0`, VIU-Pending):
  SCH-SPREAD-11 = **C38863** (sec 4263), SCH-DEL-10 = **C38864** (4276),
  SCH-EDGE-07 = **C38865** / SCH-EDGE-08 = **C38866** (4280),
  SCH-REG-01..05 = **C38867–C38871** (5408),
  SCH-API-01..04 = **C38872–C38875** (5409).
- **Live count under group 4254 subtree = 190** (paginated get_cases read-back) ==
  the 190-row id-map. `testrail-id-map.csv` = **190/190 C-ids, 0 blanks** (177
  re-merged + 13 new). Import regenerated over 190 (header byte-identical, 0
  VIU/flag words, no dup titles/ids, 4 API cases in "API — Schedule").
- **HELD/blocked items untouched** per the ChangeList: SCH-EVT-08 (C30615),
  SCH-CAP-01..04 (C30030–C30033), SCH-MODAL-08 (C30015), SCH-EXP-01/02
  (C38853/C38854), and all §C blocked-on-an-answer items (NQ-1..5, Q1/Q2/Q3).
- Executor `exec_sync_techplan_2026-07-30.py`; audit
  `tech-plan-2026-07-29/testrail-execution-log-2026-07-30.md`; ChangeList header =
  EXECUTED.
- **NEXT:** send NQ-1..5 with the open Q1/Q2/Q3 sheet to Branko/dev; live VIU of the
  13 new + 2 edited cases when the QA branch exists (OQ-3) — SCH-REG-01..04 need the
  CUTOVER build.

### 0.0-TECHPLAN ENGINEERING TECH PLAN RECONCILED (2026-07-29 — push EXECUTED 2026-07-30, see §0.0-TECHPLAN-EXECUTED)

**The engineering "Schedule Module Rewrite — Technical Implementation Plan" (user upload
2026-07-29) was ingested VERBATIM + reconciled against the 177-case suite.** Sources of
record: `tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` (the plan),
`TECH-PLAN-DELTAS.md` (full classification), `Schedule_TechPlan_ChangeList_2026-07-29.md`/`.xlsx`
(sign-off file), `RULE28-AUDIT-2026-07-29.md`, `Questions-for-Branko-dev.md`,
`backup/` + `MANIFEST.md` (pre-edit copies).

- **13 NEW cases authored** (`cases/cases-H-tech-plan.json`, all VIU-Pending, blank
  C-ids — need add_case): SCH-SPREAD-11 (8-week warn + 120-shift hard cap), SCH-DEL-10
  (commit-immediately undo), SCH-EDGE-07 (DST-stable series), SCH-EDGE-08 (dark mode),
  SCH-REG-01..05 (rewrite regression: data survives migration; Dashboard ONE aggregated
  row per WO [intended fix]; WO-create appointment lands on board; multi-location tech
  shift on the WO's location only [intended change]; WO Priority field), SCH-API-01..04
  (first API cases ever for Schedule — the tech plan IS the backend contract: permission
  matrix 403s, series caps 409/422, no-pricing + WO:View server-side omission,
  cross-location 404). Two NEW sections: "Cross-Module and Rewrite Regression",
  "API — Schedule" (Rule 4).
- **16 edits**: 2 tester-facing (SCH-WOL-05/C29940 paged-loading expected line;
  SCH-VIEW-03/C30044 My-Shifts-hidden-for-non-tech line) + 14 notes-only QA flags
  (conflict cautions + confirmations; notes never reach TestRail).
- **HELD items D1 (events→capacity) + D4 (modal Reassign): the plan SPEAKS to both but
  settles NEITHER** — it builds events-count (D5, citing a PRD Q&A comment 2026-07-23)
  and drag-only reassign ("PRD wins over prototype"); product truth stays with Branko.
  Cases untouched; PO-Questions QA-internal appendix updated (also informs Q3 no-export,
  Q4 New-WO opens the real dialog, Q5 default 07:00–19:00, Q7 backend contract exists).
- **5 NEW conflicts flagged, NOT rewritten** (`Questions-for-Branko-dev.md`, layman):
  NQ-1 closure-skip in spread (plan skips; Jira V1 rule says no — hits SCH-EDGE-05/
  SPREAD-07/08), NQ-2 double-booking in the conflicts counter (plan: soft warning only —
  hits SCH-CONF-01/05), NQ-3 business-hours/closures placement (admin "Schedule
  Settings" page vs Edit Location — hits SCH-HRS-01/02), NQ-4 split shifts (plan model =
  ONE range/day — hits SCH-HRS-05..07), NQ-5 own-data write scoping (ManageShiftVoter).
- **VIU-PREP recorded** (DELTAS §E): no feature flag ever (one-release cutover; pre-cutover
  /schedule still renders LEGACY even with new endpoints live); route + atoms unchanged
  (`ROLE_SCHEDULE_VIEW/CREATE_AND_EDIT/DELETE`); DOM hook `schedule_shift_block`/
  `data-shift-id`; 17-endpoint API map + error contract in DELTAS §C.
- **NEW TALLY: 190 ACTIVE authored** (177 + 13). Deliverables regenerated over 190:
  import 190 rows (header byte-identical, 0 VIU/flag words, no dup titles/ids, API
  section emitted), id-map 190 rows (177 C-ids re-merged, 13 blank). Rule-28 audit:
  12 KEEP / 1 WEAK-KEEP / 0 CUT · 15/15 SENSIBLE · all traceable.
- **PUSH QUEUE (awaiting authorization): 2 add_section + 13 add_case + 2 update_case.**
- **NEXT:** authorize the push; send NQ-1..5 with the open Q1/Q2/Q3 sheet; live VIU when
  the QA branch exists (OQ-3) — note SCH-REG-01..04 need the CUTOVER build.

### 0.0-EPIC-EXECUTED EPIC SV-8685 SYNC EXECUTED (2026-07-27 — user-authorized TestRail writes DONE)

**The staged epic sync (§0.0-EPIC manifest) is now EXECUTED (user-authorized, Standing Rule 6):
2 add_section + 10 add_case + 167 update_case, ALL HTTP 200, ALL re-GET verified MATCH, 0 delete.**
- **2 add_section** under group 4254: **Working Hours Settings = 5405**, **Week Export and Printing = 5406**.
- **10 add_case** (new-scope, new C-ids, `custom_atmstatus:3`+`custom_automation_type:0`, non-API):
  SCH-HRS-01=**C38846**, HRS-02=**C38847**, HRS-03=**C38848**, HRS-04=**C38849**, HRS-05=**C38850**,
  HRS-06=**C38851**, HRS-07=**C38852** (all → 5405); SCH-EXP-01=**C38853**, EXP-02=**C38854** (→ 5406);
  SCH-REAS-06=**C38855** (→ existing Reassignment and Context Menu 4275).
- **167 update_case** = 157 metadata-only (refs field only) + 10 tester-facing (refs + title/preconds/
  steps/expected): SCH-FILT-01/C29942, SCH-VIEW-01/C30042, SCH-EVT-01/C30016, SCH-REAS-03/C30054,
  SCH-REAS-04/C30055, SCH-REAS-05/C30056, SCH-DEL-08/C30064, SCH-SPREAD-07/C29983, SCH-EDGE-05/C30089,
  SCH-BLOCK-04/C29994. All re-GET MATCH.
- **D1 (events→capacity) + D4 (modal Reassign) remain HELD — NOT written.**
- **NEW TALLY: 177 ACTIVE, ALL in TestRail with a C-id.** id-map re-merged 177/177 (0 blanks); import
  regenerated over 177 (header byte-identical, 0 VIU/flag words, no dup titles, no C-id column).
- Executor `build/schedule/exec_sync_epic_2026-07-27.py` (+ `exec_sync_epic_resume.py` for a 16-case
  tail after a transient HTTP 000 network drop — idempotent resume, no data loss). Audit:
  `spec-v1-2026-07-22/testrail-execution-log-epic-2026-07-27.md`; manifest header = EXECUTED.
  **Run 325 / all execution runs untouched; no secrets committed.**
- **NEXT:** Branko rulings on D1 + D4 + Week Export V1 scope; then live VIU (QA branch OQ-3). Per
  Rule 12, design-pinned ≠ VIU-Verified.

### 0.0-EPIC EPIC SV-8685 BACKFILL + DESIGN/JIRA DELTAS + NEW-SCOPE APPLIED LOCALLY (2026-07-27 — since EXECUTED, see 0.0-EPIC-EXECUTED)

**Applied LOCAL ONLY (plan item 1); TestRail push STAGED not executed.** Sources:
`build/schedule/epic-sv8685/RECONCILIATION.md` (§3 backfill map, deltas D1–D5, gap G1) +
`build/schedule/design-2026-07-27/DESIGN-RECONCILIATION-2026-07-27.md` (label/menu/timing).

- **EPIC-KEY BACKFILL — all 167 active cases** now carry a Rule-20 `refs` = `<TICKET> (<spec-anchor>)`
  (existing spec anchor kept), per the RECONCILIATION §3 section→story map. Resolves OQ-2.
  Script: `build/schedule/epic-sv8685/backfill_refs.py`. Cross-cutting permission tiers → epic
  **SV-8685**; everything else → its owning story (SV-8686..SV-8700).
- **10 tester-facing edits** (design + Jira agree / Jira deltas), script
  `build/schedule/epic-sv8685/patch_edits.py`: SCH-FILT-01/C29942 ("Filters"), SCH-VIEW-01/C30042
  ("Filter & Display"), SCH-EVT-01/C30016 ("Create Event"), SCH-REAS-03/C30054 (menu = Create
  Event + New Work Order), SCH-REAS-04/C30055 (View Day removed) + SCH-REAS-05/C30056 (New Shift
  removed) — **reworked, NOT retired**, C-ids kept; SCH-DEL-08/C30064 (toast 7s-with-Undo /
  4s-without); **D2** SCH-SPREAD-07/C29983 + SCH-EDGE-05/C30089 (shop closures NOT skipped in V1);
  **D3** SCH-BLOCK-04/C29994 (blocks default blue, custom colour optional per shift, not WO-tied).
- **10 NEW-SCOPE cases authored** (VIU-Pending, behaviours flagged confirm-at-VIU),
  `cases/cases-G-new-scope.json`: **Working Hours Settings ×7** (SCH-HRS-01..07 — SV-8699 gap G1:
  Edit-Location "Set business hours…" toggle, per-day Mon-Sun From→To, Edit-Staff "Set custom
  hours…" toggle + inherit-shop-hours, "Add hours" split shifts removable/empty, overlap red flag
  + "These hours overlap…" + Save disabled, incomplete rows ignored), **Week Export ×2**
  (SCH-EXP-01/02 — printable Dept×Tech week grid; V1 scope PENDING BRANKO), **New Work Order
  shortcut ×1** (SCH-REAS-06). Two new sections: "Working Hours Settings", "Week Export and Printing".
- **HELD (pending Branko — NOT changed):** **D1** events-count-toward-capacity (SCH-EVT-08/C30615
  + SCH-CAP-01..04 / C30030–C30033) — new design reverses Branko's earlier Q1; **D4** modal
  "Reassign" (SCH-MODAL-08/C30015 + the retired SCH-REAS-02/C30053) — Jira-vs-design conflict.
- **NEW TALLY: 177 authored ACTIVE** (167 + 10 new; SCH-REAS-02 still retired/deleted =
  178 authored incl. retired). All VIU-Pending. **Deliverables regenerated over 177:**
  `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` (177 rows, References now = Rule-20
  refs, header byte-identical to the other project imports; 0 VIU/flag words, no dup titles/ids,
  no missing fields, no C-id column), `testrail-id-map.csv` (177 rows, NEW `refs` column; ALL 177
  C-ids populated after the 2026-07-27 push — the 10 new-scope got C38846–C38855). ⚠️ `gen_import.py` blanks id-map C-ids on rerun + excludes
  Retired — ALWAYS re-merge from the prior id-map afterwards.
- **TestRail sync manifest (now EXECUTED 2026-07-27 — see §0.0-EPIC-EXECUTED):**
  `build/schedule/spec-v1-2026-07-22/testrail-sync-manifest-epic-2026-07-27.md` — **167 update_case**
  (refs backfill; 10 of them also change tester-facing fields) + **10 add_case** (new-scope) +
  **0 delete_case**; D1/D4 HELD.
- **NEXT:** Branko rulings on D1 (events→capacity) + D4 (modal Reassign) + Week Export V1 scope;
  then live VIU (QA branch OQ-3) + authorized TestRail push. Per Rule 12, design-pinned ≠ VIU-Verified.

### 0.0-SYNC-DONE TestRail SYNC EXECUTED (2026-07-22 — user-authorized writes DONE)

**The staged sync is EXECUTED (user-authorized, incl. the delete — Standing Rule 6):
7 update_case + 2 add_case + 1 delete_case, ALL HTTP 200, ALL re-GET verified MATCH.**
- **7 update_case** (all re-GET MATCH): SCH-MODAL-04 (C30011), SCH-MODAL-08 (C30015),
  SCH-CONF-02/03/04 (C30024/25/26), SCH-VIEW-04 (C30045), SCH-TIP-01 (C30034).
  (SCH-CONF-01/C30023 = notes-only, NOT pushed — correct per manifest §A.1.)
- **2 add_case** (new C-ids): **SCH-PERM-12 = C30614** (Permissions §4279, type_id 5/Negative,
  prio 3/High), **SCH-EVT-08 = C30615** (Events §4269, type_id 6/Functional, prio 2/Medium);
  both `custom_atmstatus:3` + `custom_automation_type:0`, non-API.
- **1 delete_case**: **SCH-REAS-02 / C30053** deleted (re-GET gone) — modal-Reassign removed;
  drag-reassign covered by SCH-REAS-01 (C30052). Body kept locally marked Retired; id-map −1.
- **NO execution run written** (run 325 etc. untouched); only Schedule group 4254 touched.
- Executor: `build/schedule/exec_sync_2026-07-22.py`; per-case audit log:
  `spec-v1-2026-07-22/testrail-execution-log-2026-07-22.md`; manifest header = EXECUTED.

### 0.0-APPLIED RECONCILIATION APPLIED LOCALLY (2026-07-22 — superseded by 0.0-SYNC-DONE for TestRail state)

**The spec_1 + Claude-design + Branko-Q&A reconciliation was APPLIED to the case
suite; the staged TestRail sync is now EXECUTED (see 0.0-SYNC-DONE).**
Design is **no longer missing** — the Claude prototype `Schedule.dc.html` is the
authoritative design (Branko Q0); every case `design_ref` now cites it.

- **Tally: 168 authored** (166 original + 2 new). **167 ACTIVE** — SCH-REAS-02
  (former C30053) is now **Retired** (deleted from TestRail 2026-07-22, body kept locally
  for the record; excluded from all deliverables + tally).
- **6 expected-result edits applied:** SCH-MODAL-04 (C30011, no $/labor — number/title/
  hours/status pill only), SCH-MODAL-08 (C30015, Delete-only, no Reassign), SCH-CONF-02/03/04
  (C30024/25/26, per-tech configured working days+hours, hierarchy Tech>Business>Default),
  SCH-VIEW-04 (C30045, "VIN Number" toggle gates the BLOCK only; tooltip+modal always show VIN).
- **VIN §4.13-vs-§9 RESOLVED** in favour of §4.13 (design §6) — SCH-VIEW-04 + SCH-TIP-01
  (C30034) + SCH-MODAL-01 updated; §9 tooltip-gating prose flagged to Branko for doc hygiene.
- **Events-excluded may-change notes (Branko Q1)** added to SCH-CAP-01/02/03/04 +
  SCH-CONF-01/05.
- **~48 design-pinned labels/visuals FOLDED** to the design's actual wording (VIU-confirm
  hedge removed, design cited in `notes`); **~18 items STILL need a LIVE build check** —
  trimmed register in `coverage-matrix.md` §D.1.
- **2 NEW cases** now IN TestRail (VIU-Pending): **SCH-PERM-12 = C30614**
  (permission-masking, Branko Q3, Permissions §4279) and **SCH-EVT-08 = C30615**
  (event-not-counted, Branko Q1, Events §4269).
- **Deliverables regenerated over 167 ACTIVE:** `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx`
  (167 rows, 0 VIU/flag words, no dup titles/ids, no missing fields; header byte-identical to
  the other project imports), `testrail-id-map.csv` (167 rows; ALL C-ids populated incl. the
  2 new C30614/C30615; SCH-REAS-02 row removed), coverage-matrix.md, requirements.md.
  ⚠️ `gen_import.py` blanks the id-map C-id column on rerun + now EXCLUDES Retired — ALWAYS re-merge afterwards.
- **NEXT:** live VIU still pending the QA branch (OQ-3) + Epic key (OQ-2). Per Rule 12,
  design-pinned ≠ VIU-Verified.
- Method: `build/schedule/spec-v1-2026-07-22/apply_reconciliation.py` (re-runnable transform).

### 0.0 SPEC `_1` + CLAUDE DESIGN + BRANKO Q&A INGESTED — ANALYSIS ONLY (2026-07-22, historical — now APPLIED, see 0.0-APPLIED)

**Three new inputs ingested, ANALYSIS-ONLY — 166 cases, import, id-map, and TestRail
UNTOUCHED. AWAITING USER PROCESS CHOICE (Standing Rule 11) before ANY case change;
the live-VIU step is still BLOCKED on the QA branch (OQ-3) + Epic key (OQ-2).**

- **Spec `_1`** (`66b5d64f-Schedule_1.doc`) decoded → `spec-v1-2026-07-22/requirements-v1.md`.
  A full word-level diff vs the `_0` baseline found **ZERO substantive body changes** — the
  ONLY genuine change is a new **`Design`** row added to the header metadata (the Claude
  prototype link). No spec-text-driven case edits result.
- **Claude design RECEIVED — design is NO LONGER MISSING (OQ-4 flips).** `72d051ef-Schedule.zip`
  extracted to `/tmp/schedule-design/` (185 files: authoritative coded prototype
  `Schedule.dc.html`, a rendered PRD, staff/hours settings screens, 44 render screenshots,
  84 PRD screenshots, the design-system bundle). Captured → `spec-v1-2026-07-22/design-notes-claude.md`.
  **Authoritative design = `Schedule.dc.html`** (Branko Q0). ⚠️ Some `screenshots/*.png`
  (`modal-v2`/`dropdown`/`popover-v4`/`spread`) are **STALE** — they show removed $ totals /
  Assigned-Unassigned tabs / Tech-Dept toggle / By-hours spread; do NOT author to them.
- **Branko ↔ Milan Q&A INGESTED (PO rulings, authoritative, latest-wins):** Q1 events
  EXCLUDED from capacity+conflict (design code confirms; may-change); Q2 conflict = per-tech
  configured working weekdays+hours, hierarchy Tech>Business>Default (prototype hardcodes
  Mon–Fri/8–17 → confirm live); Q3 NO total $ anywhere in the schedule + WO-derived data
  masked under the pricing/Work-Orders:View permission (design modal shows line #/title/
  hours/status only, no $/labor, no Reassign button); Minor removals (Assigned/Unassigned
  tabs + Tech/Dept toggle already reflected in our cases; **Reassign-in-modal REMOVED** →
  our modal-Reassign case is stale).
- **Delta rollup (`spec-v1-2026-07-22/spec-diff-v1-2026-07-22.md`):** **~13–15 of 166 cases
  need a change or decision** — 6 expected-result edits (SCH-MODAL-04 C30011 no $/labor;
  SCH-MODAL-08 C30015 Delete-only; SCH-CONF-02/03/04 C30024/25/26 per-tech hours; SCH-VIEW-04
  C30045 VIN-toggle scope), ~4–6 status-notes (Q1 events-excluded on SCH-CAP-01/04 + SCH-CONF-01
  etc.), **1 RETIRE candidate** (SCH-REAS-02 C30053, modal-Reassign removed), **2 NEW candidates**
  (perm-masking; event-not-counted). Tabs/toggle cases need NO edit (already spec-accurate).
- **VIU-confirm register:** of ~62–64 items, **~45–48 now PINNED/resolvable by the authoritative
  design** (all D.1 labels incl. exact **"VIN Number"** toggle + conflict reason sentences; all
  D.4 visuals; ~half of D.2/D.5), **~16–18 still need LIVE build confirm** (tenant enumerations,
  timing thresholds, permission naming, the 7-7-vs-8-17 default discrepancy). Design-pinned ≠
  VIU-Verified (Rule 12 — live build still confirms at VIU).
- **VIN §4.13-vs-§9 inconsistency = RESOLVED by the design** (tooltip shows VIN unconditionally;
  the "VIN Number" toggle gates the shift-BLOCK VIN line only) → resolved in favour of §4.13;
  still recommend flagging the §9 prose to Branko for doc hygiene.
- **Recommended process (Rule 11 — NOT run):** SPEC-RELEVANCE-RECONCILIATION (primary — retire/
  add/notes + regenerate deliverables) + BUILD-ACCURATE-WORDING-VIU (the 6 expected edits +
  fold pinned design labels; live behaviour-VIU deferred until QA branch/Epic exist).
- Artifacts: `build/schedule/spec-v1-2026-07-22/{requirements-v1.md, design-notes-claude.md,
  spec-diff-v1-2026-07-22.md}`.

### 0.1 Prior status (import + authoring)

**IMPORTED TO TESTRAIL BY THE USER 2026-07-21 — id-map populated 166/166
(2026-07-22, READ-ONLY GETs, zero TestRail writes).** The user imported
`testrail-import/schedule-v1-testrail-import.csv` themselves (the Filters
precedent). Live location: project 1 / suite 1 ("Master"), **group section 4254
"Schedule - 2026 (VIU Pending)"** (parent 35), containing our **26 child sections
= ids 4255–4280 in our exact order** (4255 Navigation and Layout … 4280 Edge
Cases and Responsiveness). **Section names match ours 1:1, byte-identical — NO
name variance** (no em-dash/hyphen mangling this time; TestRail kept our
"and"-form titles as authored). Canonical TestRail URL (user-shared 2026-07-22):
https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=4254
Mapping: fetched 166 cases from sections 4255–4280 (get_sections + get_cases,
paginated), matched **166/166 by EXACT title+section** against `cases/*.json` —
0 unmatched, 0 extras; **C-id range C29925–C30090, contiguous**.
`testrail-id-map.csv` now carries all 166 C-ids.
**⚠️ id-map-regen GOTCHA (same as Filters):** `gen_import.py` REWRITES
`testrail-id-map.csv` with BLANK C-ids on every run — after ANY rerun, RE-MERGE
the C-ids (re-match by exact title+section from TestRail or from a saved copy)
before committing.

**STATUS: CASES AUTHORED & ADVERSARIALLY REVIEWED CLEAN 2026-07-21 (SPEC-ONLY — no
designs exist) — 166 cases / 26 sections authored from the v1.0 spec
(`cases/cases-A..F-*.json`, IDs `SCH-<AREA>-NN`; authoring commits 2e524ad→51af802).
The adversarial review found + FIXED 4 defects (commit 64b1813): (1) SCH-CONF-05 —
internal cross-ref mangled by the import cleaner into "(set up via/02)", reworded
id-free; (2) SCH-PERM-07 — math ⊇-notation in a reader-facing expected replaced with
layman wording; (3) SCH-TIP-01 — VIN-toggle case contradiction vs SCH-VIEW-04 fixed
by adding a "VIN toggle ON" precondition (**underlying spec §4.13-vs-§9 VIN-tooltip
inconsistency FLAGGED FOR BRANKO** — §4.13 lists tooltip VIN unconditionally, §9 ties
it to the toggle, default OFF); (4) SCH-START-06 — unobservable conditional expected
(7:00 AM fallback) removed, moved to notes. Coverage: **147 spec §1–§14 requirement
lines → case IDs, 0 gaps** (bidirectional check: 0 unmapped requirements, 0
unreferenced cases) + a **62-entry VIU-confirm register** (`coverage-matrix.md` §D:
all deferred labels/thresholds/enumerations/visuals/open behaviors). Explicit
exclusions: §15 future items + **NO API cases authored — spec has NO API contract,
ask Branko/dev if API coverage is wanted**. Import READY:
`testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` via `gen_import.py` — pure
1:1 with the established format (8 named columns + 2 trailing blanks, header
byte-identical to the fees-discounts / simple-flow / global-search / filters imports —
equality check PASSED), 166 rows, VIU-word-free + feature-flag-free, deterministic.
`testrail-id-map.csv` populated 166/166 (~~blank C-ids~~ → C-ids filled 2026-07-22,
see the IMPORTED block above; the push-pending note is SUPERSEDED by the user's own
import 2026-07-21). VIU pending the QA branch/env (OQ-3) + Epic key
(OQ-2, ask at VIU). Design reconciliation pending IF Figma ever arrives (OQ-4 — none
exists today).**

**PO = Branko** (confirmed 2026-07-21; same PO as Global Search & Filters; full name
TBC). **Epic/Jira key = ⚠️ NOT AVAILABLE — ask the user at VIU.** **QA branch/env +
feature-flag/settings status = ⚠️ NOT AVAILABLE — ask the user at VIU.**
**Figma/design = NONE at the moment (user confirmed 2026-07-21) — SPEC-ONLY project.**

**NOT DONE / NEXT:**
1. ~~TestRail push/import~~ — **DONE 2026-07-21 via USER IMPORT** (group 4254,
   sections 4255–4280); id-map populated 166/166 READ-ONLY 2026-07-22
   (C29925–C30090). Remember the gen_import.py id-map-blanking gotcha above.
2. **VIU PENDING the QA branch** — ⚠️ when VIU begins, ASK THE USER for: the
   **Epic / Jira key** (OQ-2, do NOT invent), the **QA branch/env +
   feature-flag/settings status** (OQ-3 — VIU + TestRail push both wait on this),
   and **which process(es) to run per Standing Rule 11**
   (BUILD-ACCURATE-WORDING-VIU and/or SPEC-RELEVANCE-RECONCILIATION). Then resolve
   the 62-entry VIU-confirm register (`coverage-matrix.md` §D: all spec-quoted
   labels, ~9 numeric/timing thresholds, the app-deferred enumerations
   [Status-filter list, department names, palette], all prose-only visuals, and the
   §D.5 open behaviors).
3. **If Figma/designs arrive** (OQ-4 — user says possible) — capture into
   `design-notes.md` FIRST, then run a design-reconciliation pass over the suite to
   tighten the 62 VIU-confirm items + Rule-9 wording (add design_refs, reconcile
   conflicts, as done for Filters).
4. **Flag to Branko:** (a) the **spec §4.13-vs-§9 VIN-tooltip inconsistency** (§4.13
   lists tooltip VIN unconditionally; §9 ties it to the VIN toggle, default OFF —
   cases currently authored to the toggle-gated reading, SCH-TIP-01/SCH-VIEW-04);
   (b) the **no-API-contract question** — spec v1.0 has zero endpoints; ask
   Branko/dev for the backend contract if API coverage is wanted (`gen_import.py`
   already routes `api_related` cases to an "API — <leaf>" section per Standing
   Rule 4).
5. **Expect spec revisions from the PO** — on each spec update, run
   SPEC-RELEVANCE-RECONCILIATION per Standing Rule 11 (ask first, as always).

## 0.1 Status detail

- Authoring: **DONE 2026-07-21** (SPEC-ONLY per §0.6's assessment — user launched
  authoring; commits 2e524ad→51af802). Verified before commit: 166/166 cases carry
  all schema fields; 0 duplicate ids/titles; import rows == case count (166); header
  equality vs all four prior imports PASSED; 0 VIU/flag words in import cells; no
  invented labels (spec labels verbatim, unpinned items generic + VIU-confirm notes);
  coverage matrix bidirectional check clean (147 requirement lines, 0 gaps).
- Adversarial review: **DONE 2026-07-21, CLEAN after fixes** (commit 64b1813) — found
  + fixed 4 defects: SCH-CONF-05 import-cleaner cross-ref mangle; SCH-PERM-07 math
  notation in reader-facing expected; SCH-TIP-01 VIN-toggle contradiction vs
  SCH-VIEW-04 (spec §4.13-vs-§9 inconsistency flagged for Branko); SCH-START-06
  unobservable expected removed. Import CSV/XLSX + id-map regenerated post-fix (166
  rows, header byte-identical, 0 VIU/flag words, 0 internal-id leaks).
- Spec: **INGESTED (complete)** → `requirements.md`. Source doc
  (`/root/.claude/uploads/.../beb1e7e0-Schedule.doc`) was a Confluence "Export to
  Word" MHTML / quoted-printable file (`Subject: Exported From Confluence`,
  `Content-Transfer-Encoding: quoted-printable`). Decoded with Python `email` (MIME
  walk to the `text/html` part → `get_payload(decode=True)`, which handles the
  quoted-printable) + BeautifulSoup, preserving all headings, lists, and tables. Full
  spec captured verbatim-structured (overview, personas, IA, 13 core-feature
  sub-sections, sidebar, toolbar, interactions, data model, view options, color
  system, NFRs, edge cases, success metrics, roles & permissions, future
  considerations). `file` reported "news or mail, ASCII text" (the MHTML signature) —
  same family as every prior ShopView spec.
- Design: **NONE (user confirmed 2026-07-21).** SPEC-ONLY. No `design-notes.md` (no
  Figma to capture). The spec has no images/Figma links/screenshot refs.
- Cases: **AUTHORED 2026-07-21 — 166 cases / 26 sections**, SPEC-ONLY, in
  `cases/cases-A..F-*.json` (internal IDs `SCH-<AREA>-NN`; schema identical to the
  Filters/Global-Search case JSON; every case `viu_status: VIU-Pending`,
  `api_related: false`, `design_ref: none - SPEC-ONLY`). Per-file split:
  A navigation+sidebar 30 · B dnd/scope/start/spread/series 36 · C
  blocks/lanes/day-view/modal 25 · D events/conflicts/capacity/tooltips 23 · E
  toolbar/views/reassign/delete/keyboard/color 35 · F permissions/edge 17.
- Deliverables: `coverage-matrix.md` (every §1–§14 requirement → cases; §15 + API +
  metrics exclusions; VIU-confirm register §D), `gen_import.py`, canonical import
  `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` (166 rows; header
  byte-identical to the other four project imports — verified), `testrail-id-map.csv`
  (166 rows, blank C-ids).
- TestRail: **NOT pushed** — `testrail-id-map.csv` C-id column blank. **No TestRail
  writes without explicit user permission** (Standing Rule 6).
- Env/VIU: **NOT available yet** — QA branch/env + flag/settings status unknown. VIU
  deferred until it ships to a testable environment.
- PO: **Branko** (confirmed 2026-07-21; full name TBC). Spec URL recorded (§1).

## 0.5 What is blocking / awaiting

Onboarding + authoring are done; remaining items:
- **⚠️ Epic / Jira key (OQ-2)** — ASK THE USER when VIU begins.
- **⚠️ QA branch / env + feature-flag/settings status (OQ-3)** — ASK THE USER; VIU +
  TestRail push wait on this.
- **Figma/designs (OQ-4)** — NONE at the moment (user-confirmed). If tighter
  visual/label fidelity is wanted before authoring, the user can provide Figma exports;
  otherwise author SPEC-ONLY with VIU-confirm placeholders.
- Per **Standing Rule 11**, ASK which process(es) to run before any VIU pass.
- **RESOLVED:** OQ-1 (PO = Branko), canonical spec URL recorded.

## 0.6 AUTHORING-READINESS ASSESSMENT (critical — read before authoring)

**Bottom line: the spec is LARGELY SELF-SUFFICIENT to author PRD-accurate manual test
cases now, WITHOUT designs — it is unusually label-rich and behavior-complete. It is
NOT a half-spec. Full build-accurate wording (Standing Rule 9) and all visual-rendering
details still require a LIVE VIU pass on a QA build (no QA env yet), exactly like every
other project. No part of the spec is genuinely un-authorable for lack of designs; the
gaps are the normal "confirm the exact on-screen label/visual live" gaps, handled with
VIU-confirm placeholders.**

**Why self-sufficient (what the spec DOES give):**
- Rich, explicit **behavior** for every feature: drag-and-drop scenarios (§4.1), scope
  picker (§4.3), multi-day spread (§4.5), linked-series banners (§4.6), overlap/lane
  stacking with the 3-lane cap + "+N more" (§4.7), day-view timeline interactions
  (§4.8), shift detail modal contents (§4.9), events (§4.10), conflict detection with
  the 4 conflict types (§4.11), capacity visualization (§4.12), hover tooltips (§4.13),
  filters (§5.1), toolbar controls (§6), micro-interactions incl. series-aware
  deletion scopes (§7), view options (§9), color system (§10), edge cases (§12).
- Many **on-screen labels are named in the prose**, e.g.: "Search work orders",
  "Search lines", "Needs techs" badge, "All / Unscheduled" chips, "Schedule whole work
  order", "Select multiple", "Select all", "Create shift · 2 lines · 6h", "Change
  scope", spread options ("Full estimate", "1 week", "2 weeks", "Until a date…",
  "Specific hours…"), "+N more", "Today" button, "Filter" button, "Clear all",
  "Filter and Display", "View Options" toggles ("Business Hours", "Capacity Bars",
  "Events", "Tech Hours", "Saturday", "Sunday"), "My Shifts", "VIN", right-click menu
  ("New Shift", "New Event", "View Day"), conflict types ("Double-booked", "Weekend
  shift", "Before hours", "After hours"), delete scopes ("This shift only", "This and
  everything after", "The whole series"), "OT" tag, "Adjust", "Reassign".
- A concrete **data model** (§8) with entities/fields/relationships.
- A complete **roles & permissions** model (§14) — View/Edit/Delete tiers with the
  Delete⊇Edit⊇View dependency, the Work Orders: View sidebar dependency (§14.2), the
  no-"own-only" rule (§14.3), and the department-based grid-row rule (§14.4). This maps
  cleanly to the Custom Roles permission-testing pattern already in this workspace.

**What genuinely needs LIVE VIU (NOT blockers to authoring — normal VIU-confirm; would
be tighter WITH designs but none exist):**
- **Exact on-screen wording** of every label above must be verified against the real
  build per Standing Rule 9 (PRD labels can differ from the shipped build). Author with
  the spec's wording, tag as VIU-confirm, correct live at VIU.
- **Visual-only rendering** described in prose but not shown (no Figma): shift block
  three/four-line anatomy & color tinting (§4.4), event-vs-shift card styling (§4.10),
  connected-series banner rendering across month/week/day (§4.6), lane-stacking growth
  & "+N more" popover (§4.7), capacity-bar blue-fill / amber-spill / OT-tag (§4.12),
  business-hours shading, now-line, drag ghost block. These are testable behaviorally
  from the spec (what appears/when), but pixel/label exactness needs the live build (or
  Figma if later provided).
- **Enumerations the spec defers to the app:** the Status-filter list ("All work order
  statuses currently supported in the app", §5.1) and department names (examples only)
  — source from the app at VIU.
- **Numeric/timing thresholds** to confirm live: 15-min snap, 300–500ms hover delay,
  4–7s toast, 150px/960px responsive breakpoints, auto-scroll buffer 30–60min.

**What is NOT in the spec (flag to user; may need more input):**
- **No API contract** — zero endpoints, HTTP methods, or status codes anywhere (unlike
  Global Search / Simple Flow / Fees & Discounts). If API-level cases are in scope
  (Standing Rule 4), the backend contract must be supplied; otherwise author UI-only.
- **No dev plan / phasing / rollout** section (Global Search had a 5-phase plan).
  Confirm delivery phasing with the PO if it affects scoping.
- **No Figma/designs** — user-confirmed NONE at the moment. Author SPEC-ONLY.

**Recommendation:** authoring can proceed SPEC-ONLY on the user's go-ahead, producing
PRD-accurate cases with VIU-confirm tags for unpinned labels/visuals; then VIU live
once a QA branch exists. If the user prefers maximum visual/label fidelity up front,
they can provide Figma exports first (optional, not required to start).

## 1. Project identity

- **Project:** Schedule — ShopView App · Technician Scheduling Module.
- **Spec doc title:** "Schedule" (Confluence export; Status Complete, v1.0, Last
  Updated July 15, 2026; Author "Product Team"; Stakeholders: Engineering, Design,
  Shop Operations).
- **Canonical spec URL (Confluence):**
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule
  (Atlassian-SSO login-walled — **reference pointer only; do NOT fetch**; content
  already ingested from the exported `.doc`).
- **Figma / design:** NONE at the moment (user confirmed 2026-07-21) — SPEC-ONLY.
- **PO: Branko** (confirmed 2026-07-21; full name TBC). *(Never mix PO attributions —
  Schedule = Branko; Global Search = Branko; Filters = Branko; Fees & Discounts =
  Chris Ward; Simple Flow = Milos.)*
- **Epic / Jira key:** ⚠️ NOT AVAILABLE YET — ASK the user when VIU begins (OQ-2).

## 2. Feature summary (one paragraph)

A visual **technician scheduling calendar** for shop managers: a top-level nav area
with a left **work-order sidebar** (mini calendar + searchable/filterable WO cards +
per-line drill-down with draggable, approved-only lines) and a main **schedule grid**
(Day / Week / Month, department-grouped technician rows, plus an in-grid Unassigned
lane). The core interaction is **drag-and-drop** of a WO card or line onto a
technician × day/time cell, which creates **shifts** — with a **scope picker** for
multi-line orders and a **multi-day spread** step for large jobs that produces a linked
**series** rendered as a connected banner. It adds **events** (non-WO time blocks),
**conflict detection** (double-booked / weekend / before-hours / after-hours),
**capacity bars**, hover tooltips, overlap **lane-stacking** (3-lane cap + "+N more"),
series-aware deletion, undo toasts, and keyboard support. Scheduling a tech onto a line
keeps the WO **labor roster** in sync. Access is gated by a **Schedule
View/Edit/Delete** custom-role permission tier (Delete⊇Edit⊇View) plus a **Work
Orders: View** dependency for the sidebar; grid rows are **department-based**, not
role-based. No API endpoints appear in the spec.

## 3. Deliverables index (this folder: `build/schedule/`)

- `requirements.md` — COMPLETE structured spec (§1–§15) + onboarding metadata + open
  questions (PO resolved = Branko; Epic key + QA branch = ask at VIU; no designs).
- `cases/cases-A..F-*.json` — **166 authored cases / 26 sections** (SPEC-ONLY,
  2026-07-21), IDs `SCH-<AREA>-NN`, all `VIU-Pending`.
- `coverage-matrix.md` — every spec §1–§14 requirement → case IDs; §C explicit
  exclusions (§15 items, **API NOT AUTHORED — no contract in spec**, §13 metrics,
  no mobile spec); §D VIU-confirm register (labels/thresholds/enumerations/visuals/
  open behaviors).
- `gen_import.py` — canonical import generator (Standing Rules 4/16 baked in).
- `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` — 166 rows, pure 1:1
  format (header byte-identical to the other four project imports — verified),
  VIU-word-free + feature-flag-free.
- `testrail-id-map.csv` — 166 rows (`internal_id,testrail_case_id,title,section`);
  the sole traceability source per Standing Rule 8; C-ids blank (not pushed).
- `PROJECT-STATE.md` — this file (canonical resume doc).

## 4. Shared infrastructure to reuse (do NOT re-invent)

- **Build-accurate wording + VIU method:** `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`
  (Standing Rules 9/10) — apply when the user asks and once the feature is VIU-able.
- **Spec-relevance / obsolescence reconciliation:**
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (Standing Rules 10/11).
- **Testing runbook / app-actions:** `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`.
- **Two-env permission-compare method:** `build/PROD-VS-STAGING-COMPARE-METHOD.md`
  (relevant to the §14 role-based access model — live per-role UI observation).
- **Permissions assessment:** `build/PERMISSIONS-ASSESSMENT.md`.
- **Import format template:** any existing `testrail-import/<project>-testrail-import.csv`
  + that project's `gen_import.py` (Standing Rule 16 — mirror 1:1).
- TestRail: project **1** / single suite **1 "Master"**; API v2 Basic auth; `add_case`
  requires `custom_atmstatus:3` + `custom_automation_type:0`; result statuses 1 Passed
  / 2 Blocked / 3 Untested / 4 Retest / 5 Failed. **Standing Rule 4:** any case
  touching API endpoints/methods/status codes → a TestRail section whose title includes
  'API' (NOTE: the Schedule spec currently has NO API content).

## 5. Testing-relevant highlights for future case authoring

- **Areas to cover (candidate `SCH-` groups):** sidebar (mini calendar, WO cards,
  search, filters, line drill-down), grid views (Day / Week / Month, department
  grouping, Unassigned lane), drag-and-drop scheduling, scope picker, shift start-time
  hierarchy, multi-day spread + series banners, shift block anatomy, overlap/lane
  stacking, day-view timeline interactions, shift detail modal, events, conflict
  detection, capacity visualization, hover tooltips, grid toolbar, micro-interactions
  (toasts/undo, keyboard, series-aware delete, reassignment), view options &
  customization, color system, permissions (View/Edit/Delete + WO-View dependency +
  department-based rows), edge cases, NFRs.
- **Permissions (§14):** View / Edit / Delete tiers (Delete⊇Edit⊇View); nav item hidden
  when View is OFF; sidebar hidden when Work Orders: View is OFF; NO "own-only"
  restriction (My Shifts is a convenience filter, not a boundary); grid rows are
  department-based, not role-based; clock-in gated by the staff "Time Clock" setting.
  Will need live per-role UI observation at VIU (Custom Roles pattern).
- **States to cover:** empty/first-time, unassigned shifts, conflicted shifts (each of
  4 types), overtime (OT tag, distinct from capacity), series (first/middle/last shift
  delete adaptivity), overflow ("+N more"), VIN-on vs VIN-off, each toolbar toggle
  on/off, business-hours shading, now-line.
- **Author from spec wording; mark unpinned labels VIU-confirm** (see §0.6). Do NOT
  invent labels. No API cases unless a backend contract is later provided.

## 6. How to resume (ordered)

1. Read this file (§0 first), then `coverage-matrix.md` (coverage + exclusions +
   VIU-confirm register), then `requirements.md` for spec detail. No
   `design-notes.md` (no designs exist).
2. Cases live in `cases/cases-A..F-*.json`; regenerate the import + id-map any time
   with `python3 build/schedule/gen_import.py` (deterministic; runs its own sanity
   checks — dupes, VIU/flag words, empty fields).
3. **⚠️ ASK THE USER for the Epic/Jira key (OQ-2)** and the **QA branch/env +
   flag/settings status (OQ-3)** before/at VIU. If the user later provides Figma,
   capture it into `design-notes.md` first and run a design-reconciliation pass.
4. Per **Standing Rule 11**, ASK which process(es) to run (BUILD-ACCURATE-WORDING-VIU
   and/or SPEC-RELEVANCE-RECONCILIATION) before the VIU pass.
5. VIU pass once on a QA env: verify LIVE with evidence (Standing Rules 10–14),
   resolve the VIU-confirm register (`coverage-matrix.md` §D), correct wording to the
   real build, then regenerate the import.
6. **TestRail push only after** the feature is on a QA env AND the user grants
   explicit TestRail permission (Standing Rule 6). After the push, re-merge the
   assigned C-ids into `testrail-id-map.csv` (gen_import.py blanks the C-id column
   on rerun — same gotcha as Filters).
7. If API cases become in-scope (Branko/dev supplies the contract): author them with
   `api_related: true` — the generator already routes them to an "API — <leaf>"
   section (Standing Rule 4).

## 7. Env / access facts

- **TBD — feature not yet confirmed on any QA environment / branch.** No QA host, no
  quick-login, no feature-flag/settings confirmation recorded yet. Populate this
  section once the user provides the QA env + flag/settings status (OQ-3). Secrets
  (cookies/tokens) go in `/tmp` only — never in this repo.
- **No API endpoints** are given in the spec (populate here if/when a backend contract
  is supplied).
- Reuse the workspace's shared staging/QA access method + harness (undici ProxyAgent /
  MITM bridge / boot2 hydration patterns) once the env is known — see
  `build/TESTING-RUNBOOK.md`.

## 8. Open threads

- **OQ-1 PO = Branko (RESOLVED 2026-07-21); canonical spec URL recorded (RESOLVED).**
- **⚠️ OQ-2 Epic / Jira key — STILL OPEN: ASK THE USER when VIU begins** (not available
  as of 2026-07-21).
- **⚠️ OQ-3 QA branch / env + feature-flag/settings status — STILL OPEN: ASK THE USER**
  (VIU + TestRail push wait on it).
- **OQ-4 Designs / Figma — NONE at the moment (user-confirmed 2026-07-21).** SPEC-ONLY
  authoring; VIU-confirm unpinned labels/visuals. User may provide Figma later
  (optional).
- **OQ-5 Spec-internal ambiguities** (see `requirements.md` open-questions): exact
  on-screen label wording (VIU-confirm), Status-filter enumeration + department names
  (source from app), NO API contract, NO dev/phasing plan.
- **OQ-6 FLAG TO BRANKO (from the 2026-07-21 adversarial review):** (a) spec
  §4.13-vs-§9 VIN-tooltip inconsistency (§4.13 lists tooltip VIN unconditionally, §9
  ties it to the VIN toggle, default OFF — cases authored to the toggle-gated
  reading); (b) the no-API-contract question (does Branko/dev want API cases? supply
  the backend contract if so).
