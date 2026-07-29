# Report Suite — Adversarial Usefulness Audit of All 515 Test Cases — 2026-07-28

**What this is:** a ruthless keep/merge/cut audit of every one of the 515 AI-authored Report Suite
test cases, run AS IF by Stefan Mitrovic (eng manager), in response to his claim that "maybe only
~200 are useful and 70%+ are AI slop". Zero self-protection was the instruction; where the suite is
fat, this report says so with case IDs.

- **Scope:** ALL 515 cases, no sampling (Standing Rule 17). Every case has a verdict + one-line reason in `per-case-verdicts.csv`.
- **Source snapshot:** `build/report-suite/cases/*.json` (26 files, 515 cases) copied read-only at audit start; **git SHA `ddf8c16b1c271b12459838f6c9e51a34078087bf`**, working tree clean for `build/report-suite/` at snapshot time (other workers were editing concurrently — the snapshot isolates this audit from their changes).
- **Also read:** `testrail-id-map.csv` (C30096–C30610, 515/515 mapped), the six current specs in `spec-current-2026-07-28/`, the SPEC-DIFF-SUMMARY (specs unchanged since our 2026-07-22 ingest), Chris Ward's kickoff-video transcript + his 2026-07-28 answers (Q1/Q2/Q3) + the video-delta list.
- **Not done (honesty, Rules 12/22):** no live-build check — the QA branch does not exist yet, so "testable/untestable" judgments are about *manual executability as written*, not observed behavior. **Zero TestRail writes, zero case edits** — analysis + proposal only.

## Method

1. Snapshot the 515 case bodies + id-map (read-only).
2. Ingest what the PO actually cares about: the kickoff transcript (exports-reflect-filters, labor delta, snapshots, hyperlinks, additive nav, serial-number identifier, per-user-per-device persistence risk flagged by Stefan himself) and the 2026-07-28 answers (Q1 Esc, Q2 permissions, Q3 video reference).
3. Read every case (title + full expected results; full bodies where a merge/cut needed detail) and assign exactly one verdict per case:
   - **KEEP** — distinct, observable, executable behavior; a failure is a real reportable bug; not covered elsewhere.
   - **MERGE** — real behavior but over-granular; absorbed into a named survivor (no coverage loss).
   - **WEAK-KEEP** — legitimate but low-value (cosmetic/verbatim-string/px assertions); keep only if suite size is not a concern.
   - **CUT** — no executable check / manual-untestable minutiae / literal duplicate / framework no-op.
4. Additionally tag each surviving case **T1** (durable per-cycle regression value) or **T2** (one-time build-acceptance conformance) — because "useful" in Stefan's sense is really about repeat execution cost.
5. Encode all verdicts in `gen_verdicts.py` (single source of truth) → `per-case-verdicts.csv`; render the consolidation proposal → `MERGE-PLAN.md`.

## Headline numbers

| | KEEP | MERGE (absorbed) | WEAK-KEEP | CUT | Total |
|---|---|---|---|---|---|
| **SBC** Sales By Customer | 72 | 16 | 10 | 1 | 99 |
| **SBR** Sales By Representative | 99 | 16 | 10 | 2 | 127 |
| **PV** Parts Velocity | 59 | 2 | 8 | 1 | 70 |
| **TU** Technician Utilization | 51 | 2 | 6 | 0 | 59 |
| **WIP** Work In Progress | 69 | 6 | 7 | 1 | 83 |
| **IV** Inventory Value | 59 | 8 | 9 | 1 | 77 |
| **TOTAL** | **409** | **50** | **50** | **6** | **515** |

- **Recommended suite after the 41 merge groups + 6 cuts: 515 → 459 cases** (identical behavioral coverage — merges lose nothing, they compress).
- **If WEAK-KEEPs are also trimmed** (Stefan-size-matters mode): **409**.
- **Execution-priority split of the 509 surviving cases: ~348 T1** (per-cycle regression value: calculations, scope/row model, permissions, filter data-effects, links, export content, persistence, snapshot/API contracts) **vs ~161 T2** (one-time conformance: verbatim labels/toasts/filenames, layout/px/hex, dark mode, mobile, a11y, loading states). The tier split is an honest estimate, not a per-case guarantee.

## Top 5 slop patterns found (with examples)

1. **Single behavior fragmented across 2–4 cases.** The SBC asset-label fallback chain is one contract split into three cases — SBC-LBL-01 (C30134), SBC-LBL-02 (C30135), SBC-LBL-03 (C30136) → one case with an input table. WIP's status→tab mapping is four cases — WIP-PLACE-01..04 (C30462–C30465) → two (mapping + started-boundary). SBR's badge is three — SBR-BADGE-01/02/03 (C30226–C30228). SBR's contributor gate is re-proven per filter — SBR-TYPE-03 (C30207) + SBR-STAT-03 (C30210) duplicate the rule SBR-STAT-04 (C30211) states once. **This is the biggest source of the 50 merges.**
2. **Defaults asserted twice per report.** Every filter case asserts its own default AND the persistence-defaults case enumerates them all again — e.g. SBC-DATE-02 (C30103) + SBC-LOC-02 (C30110) restate lines of SBC-PERS-05 (C30178); same on SBR.
3. **Empty-state re-tested per trigger.** IV asserts the same "Empty bays…" message + no-totals for three different causes — IV-NAV-06 (C30539), IV-DATE-07 (C30567), IV-LOC-05 (C30578) — plus a fourth literal duplicate, IV-TOT-05 (C30560, CUT). WIP and TU have the same pattern (WIP-TOT-04 C30497 = CUT duplicate).
4. **Manual-untestable spec minutiae presented as manual cases.** The worst offender: SBR-EXP-09 (C30284) — PDF body font shifts one px tier when a negative dollar string is longer than the largest positive (CUT; no manual tester can verify px font tiers in a PDF). Related WEAK-KEEPs: SBR-EXP-08 (C30283) font-tier base table, 25px PDF margins (SBC-EXP-08 C30166), 44×44px touch targets (SBR-MOB-03 C30304), WCAG ratios, px/hex theme cases (e.g. SBC-VIS-01 C30185). PV-COL-07 (C30357, CUT) requires manufacturing a "stale schema version" in browser storage.
5. **Framework no-ops.** Sorting an empty/single-row table "produces no visible change" — SBC-SORT-07 (C30148), SBR-SORT-06 (C30246): both CUT; a failure would never be filed.

**On cross-report duplication (judged honestly, as instructed):** yes, the standardized toolbar is re-authored six times (date presets + no-All-Time + 366-day cap, location filter block, export-menu/toast cases, dark mode, single-location-still-sees-filter). ONE parameterized case per concern would have been cheaper to author. BUT execution is per-report against six separately-implemented screens (Chris standardized the design, not the code — his own local shows per-report drift), and TestRail runs are per-report folders; a per-report failure needs a per-report case to fail. So cross-report repetition is **defensible for execution, wasteful only in authoring** — we did NOT count it as slop, except where it duplicates *within* a report. The four "single-location user still sees the filter" cases (SBR-LOC-04 C30216, PV-FILT-13 C30340, TU-LOC-05 C30446, IV-LOC-04 C30577) are WEAK-KEEP for a different reason: pending video item P33 (hide the filter when ≤1 location) would invert all four.

## Top 5 strongest, defensible areas (Stefan should concede these)

1. **Parts Velocity calculations — PV-CALC-01..16 (C30359–C30374), all KEEP.** Demand counts transactions not quantity (PV-CALC-06 C30364 — exactly Chris's video explanation to Nebojsa), returns/credits handling (PV-CALC-03/04), reversal netting with Demand unchanged (PV-ROW-10 C30350), window anchors movement-date vs WO-date (PV-CALC-16), core exclusion (PV-CALC-14 C30372), Last Sale all-time vs range (PV-CALC-07 C30365). These encode the exact contracts the PO spent the QA portion of the kickoff explaining.
2. **WIP earned/remaining + summary math + nightly snapshot.** Total = Earned + Remaining, NOT the WO grand total (WIP-CALC-06 C30479); the hero figure reconciliation (WIP-SUM-02 C30488); the snapshot capture contract incl. one-row-per-WO-per-date, same-computation-as-screen, $0 WOs captured (WIP-API-01..06, C30528–C30533) — the "difficult to build, high value" feature Chris opened with.
3. **IV as-of/snapshot semantics + valuation chain.** The date is an as-of anchor, not a created-date filter (IV-DATE-02 C30562 — testers WILL misread this without the case); live-today vs closest-recorded-day fallback; retention thinning 13-months-daily-then-monthly (IV-API-05 C30609); fixed-price > matrix > cost valuation fallback (IV-CALC-01..03, C30545–C30547).
4. **The labor-delta contract + reconciliation traps.** Inv. Hrs +green/−red/0.0-default with rollups from unrounded values on SBC/SBR/WIP (SBC-CALC-03 C30151, SBR-CALC-02 C30230, WIP-CALC-08 C30481) — Chris's signature suite-wide feature; TU's weighted-not-averaged Summary % (TU-SUM-03 C30416); TU↔Timesheet-Activities to-the-cent reconciliation with its two documented legitimate exceptions (TU-LINK-03/04/05, C30430–C30432) — cases that define when a mismatch IS a bug, preventing both missed bugs and false tickets.
5. **Permissions, crediting and destructive-flow safety.** Location-access enforcement (SBC-PERM-04 C30101), backend export/data denial (PV-API-04 C30391), invoice-crediting snapshot precedence that never rewrites history (SBR-WO-05 C30314), the deactivate-with-assignments type-YES gate (SBR-DEACT-02 C30253; SBR-DEACT-04 C30255 already matches Chris's Q1=B answer), legacy-robust assignments export (SBR-ASGN-05 C30296). Plus the "expected — do not file" trap cases (WIP-EXP-06/07 C30515/C30516, WIP-TAB-05 C30455, IV-SCOPE-02, TU-ELL-05) that will save the QA team from filing false bugs.

## Is Stefan right?

**Partially — about execution, not about authorship. The data:**

- **Genuine waste (his "slop") = 56 cases, ~11%**: 6 outright cuts + 50 over-granular fragments that merge away with zero coverage loss. Add the 50 low-value WEAK-KEEPs and the worst honest reading is **~21% fat — nowhere near 70%**.
- **89% of the suite (459 post-merge cases) asserts distinct, spec-traceable, observable behavior** whose failure a QA should report — and the heaviest areas (515 cases' worth of calc/scope/snapshot/permission contracts listed above) map 1:1 to what he and Chris discussed on the kickoff video.
- **Where his ~200 number has a real basis:** if "useful" means *worth executing every regression cycle*, our T1 tier is ~348 — and a stricter smoke-level core (calculations + scope + permissions + export-content + links + snapshots only) is plausibly nearer 250. The remaining ~160 T2 cases are verbatim-label/format/layout conformance that should be executed ONCE at build acceptance and then parked. A 515-case flat list *looks* like slop when 30% of it is one-time conformance checking mixed in with the regression core — that's a presentation/prioritization failure, not 300 junk cases.
- **What he'd find if he dug that we found first:** the font-px-tier cases (SBR-EXP-08/09), the stale-schema-version case (PV-COL-07), the sort-no-ops, the IV empty-state quadruplet, the WIP tab-placement quadruplet, defaults double-assertion on SBC/SBR — all named, all in the plan. If he finds waste beyond this list, it will be in the WEAK-KEEP tier, which is already flagged case-by-case.

**Bottom line: recommend consolidating 515 → 459 now (41 merge groups + 6 cuts, MERGE-PLAN.md), tagging the ~161 T2 conformance cases as build-acceptance-only, and running the ~348 T1 core per cycle.** The suite should shrink some and be tiered — it should not be halved.

### Risk flag (independent of quality)

~15 KEEP cases will need rework regardless of this audit, because pending video deltas will invert or delete them when Chris updates the specs: SBC Print removal (SBC-EXP-13 C30171), serial-number asset identifier (SBC-LBL-01 C30134 and the WIP asset cells), SBC compressed/expanded download (new case needed), location-filter hiding at ≤1 location (the four single-location cases), PV "Catalogue" rename. The consolidation pass, if approved, should be sequenced with that rework so cases are edited once, not twice. Persistence cases on all six reports carry the Stefan-flagged Filters-squad dependency (may be delegated/reworked) — SBC-PERS-01 (C30174), SBR-PERS-01 (C30271), etc.

## Exec paragraph (paste-ready for Stefan — plain words, Rule 7)

> We took your "maybe 200 of the 515 are useful" seriously and audited every single case against the specs and your kickoff video — no sampling, every case got a keep/merge/cut verdict with a written reason (spreadsheet attached). Here is the honest result: 56 cases (11%) are genuine waste — 6 we would delete outright and 50 that are the same check written two or three times, which we would fold together, shrinking the suite from 515 to 459 with nothing lost. Another 50 are legitimate but low-value (exact pixel sizes, toast wording) and are flagged case-by-case. The rest holds up: every calculation rule (labor delta, demand counting, earned/remaining, inventory valuation, snapshot math), every permission gate, every filter's effect on the data, the hyperlink targets, and "exports match what's on screen" are each covered by exactly one case, and those map directly to what you and Chris walked through on the video. Where your 200 number is fair: only about 350 of these carry repeat regression value — the other ~160 are one-time "does the build match the spec's labels and layout" checks that should run once at acceptance and then be parked, and we've tagged every case accordingly. So: we're consolidating to 459, tiering the rest, and we can defend every surviving case line-by-line if you want to spot-check.

## Deliverables in this folder

| File | What it is |
|---|---|
| `USEFULNESS-AUDIT-2026-07-28.md` | This report (method, criteria, numbers, patterns, verdict on Stefan's claim). |
| `per-case-verdicts.csv` | All 515 cases: internal ID, TestRail C-id + link, report, section, title, verdict, one-line reason, merge group/survivor, tier. |
| `MERGE-PLAN.md` | The concrete consolidation: 41 merge groups (members → survivor + what its step table gains), 6 cuts with reasons, 50 WEAK-KEEP flags — approvable wholesale or per-group. |
| `EXEC-NOTE-for-Stefan.md` | The paste-ready exec paragraph on its own. |
| `gen_verdicts.py` / `gen_merge_plan.py` | The verdict source of truth + renderers (CSV and plan are generated from one dict set, so they cannot drift apart). |

**Guardrails honored:** zero TestRail writes; zero edits to `build/report-suite/cases/*`, the reconciliation folder, or any concurrently-edited file; output confined to `build/report-suite/quality-audit-2026-07-28/`; no secrets.
