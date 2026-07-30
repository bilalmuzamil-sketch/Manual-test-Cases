# Schedule suite — Ruthless Usefulness Audit — 2026-07-31

**Process:** `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` (Standing Rule 28 — the mandatory
three-dimension quality gate: USEFUL + MAKES SENSE + GENUINE/LAYMAN-RUNNABLE).
**Companions (same folder):** `per-case-verdicts.csv` (one row per case, both verdict sets) ·
`MERGE-PLAN.md` (approvable per-group) · `gen_verdicts.py` / `gen_merge_plan.py` (deterministic
regeneration, incl. the automated KEEP-but-NONSENSE embarrassment check).
**STATUS: EXECUTED 2026-07-31 (user-authorized).** The recommendations in this report were approved
and carried out: the **20 merge groups + 2 cuts** (companion `MERGE-PLAN.md`, 0 groups held) and the
**6 FIX-WORDING repairs** listed in Dimension 2 below. **Result: 190 → 165 active cases.** Pushed as
**24 `update_case` + 25 `delete_case` = 49 operations, ALL HTTP 200, ALL re-GET verified** (0
failures); live count under TestRail group 4254 = **165**, equal C-id-for-C-id to the regenerated
165-row `testrail-id-map.csv`. Run 325 and all other runs untouched; no add_case, no section writes,
nothing outside group 4254. NOT done (not authorized this pass): the over-80-character **title trims**
(98 → 79 remaining as a side effect of the merges, still pending as its own pass) and the
**HELD-pending-Branko** cases (SCH-EVT-08 C30615, SCH-CAP-01..04 C30030–C30033, SCH-MODAL-08 C30015),
which were verified absent from every merge group and left untouched. The **19 WEAK-KEEP** cases were
kept as recommended. Artefacts: `testrail-execution-manifest-2026-07-31.md` ·
`testrail-execution-log-2026-07-31.md` · `pre-push-snapshot/` ·
`../consolidation-backup-2026-07-31/MANIFEST.md`. Resume: `../PROJECT-STATE.md`
§0.0-CONSOLIDATION-EXECUTED.

**⚠️ C-id correction to the FIX-WORDING table below:** it lists SCH-PERM-02 as C30074, SCH-PERM-04 as
C30076 and SCH-COLOR-02 as C30070. The authoritative ids from `testrail-id-map.csv` (and from
`per-case-verdicts.csv`, which agrees with it) are **C30075 / C30077 / C30072** — those are the ids
that were written.

## Scope + snapshot (Rule 17 counts)

| | |
|---|---|
| Authored case bodies (`build/schedule/cases/*.json`) | **191** |
| Excluded-with-reason | **1** — SCH-REAS-02 (Retired 2026-07-22, user-authorized delete; ex C30053; modal 'Reassign' removed by Branko) |
| **ACTIVE = scored (100%, no sampling)** | **190** (matches `testrail-id-map.csv`, all 190 with populated C-ids, all live in TestRail group 4254) |
| Source snapshot git SHA | `7eeb74548eae665f5ac5110512fddc0c8550db41` (working tree clean at audit start) |
| Sources used for fail-condition F4 / traceability | `requirements.md` (spec, verbatim-structured) · `spec-v1-2026-07-22/design-notes-claude.md` (authoritative Claude prototype, Branko Q0) · `epic-sv8685/` (epic SV-8685, stories SV-8686..SV-8700) · `tech-plan-2026-07-29/` (engineering tech plan) · PROJECT-STATE.md (held items) |

**Audit type honesty (Rules 12/22/23):** this is a **DESK audit** of case text vs the ingested
spec/design/tech-plan sources. The Schedule suite is **SPEC-ONLY authored — no live build exists
yet** (QA branch pending, OQ-3), so **no live-build check was possible this run** and no verdict
below is live verification (that is the future VIU pass's job). The local `requirements.md` +
Branko Q&A + epic + tech plan are the current source set per PROJECT-STATE §0.0-EPIC; the
Confluence page was **not** re-read this run — if a newer spec revision is suspected, re-run the
CUT/spec-parroting verdicts after a Rule-23 Confluence read. Per the process doc, a case is NOT
nonsense merely for carrying a VIU-confirm flag — on a spec-only suite those flags are the honest
pattern.

**Held-pending-Branko context (scored as authored, hold noted per case):** SCH-EVT-08
(C30615) + SCH-CAP-01..04 (C30030–C30033) — D1 events-count-toward-capacity question; SCH-MODAL-08
(C30015) — D4 modal 'Reassign'. No recommendation below touches their held status.

## THE THREE-DIMENSION HEADLINE

| Dimension | Tally |
|---|---|
| **1 — USEFUL** | **KEEP 146 · MERGE 23 (into 20 survivors) · WEAK-KEEP 19 · CUT 2** → **190 today → 165 recommended** (−23 merged members, −2 cuts; a further 19 WEAK-KEEPs kept but tagged verify-once) |
| **2 — MAKES SENSE** | **SENSIBLE 184 · FIX-WORDING 6 · NONSENSE 0** — **KEEP-but-NONSENSE: EMPTY** (the embarrassment check passes) |
| **3 — GENUINE + LAYMAN-RUNNABLE** | **Traceability 190/190 (100%)** — every case carries `<TICKET> (<spec-anchor>)` refs (Rule 20; backfilled 2026-07-27, epic SV-8685 / stories SV-8686..SV-8700 / tech-plan anchors); **missing-traceability = 0**. Wording is plain/layman with build-label VIU-confirm flags where the spec doesn't pin a label; the 4 API cases live in an API-titled section (Rule 4). **98 titles exceed 80 chars** (suite authored 2026-07-21/22, before the 2026-07-27 concise-title rule) — repairable, fix-when-next-touched; full list = `title_over_80` column in the CSV. |

**Usefulness rate: 87% of the suite is KEEP/WEAK-KEEP as it stands; 99% of the coverage
survives (merges lose packaging, not checks); genuine waste (CUT) = 2 cases = 1.05%.**

## Per-area verdict + sense tables

Area (TestRail section) · KEEP/MERGE/WEAK-KEEP/CUT · SENSIBLE/FIX-WORDING/NONSENSE

| Area | K | M | W | C | S | FW | N |
|---|--:|--:|--:|--:|--:|--:|--:|
| Navigation and Layout | 5 | 1 | 1 | 0 | 7 | 0 | 0 |
| Sidebar - Mini Calendar | 3 | 0 | 1 | 0 | 4 | 0 | 0 |
| Sidebar - Work Order List and Search | 3 | 1 | 2 | 0 | 6 | 0 | 0 |
| Sidebar - Work Order Filters | 6 | 0 | 0 | 0 | 6 | 0 | 0 |
| Sidebar - Line Drill-Down | 6 | 1 | 0 | 0 | 7 | 0 | 0 |
| Drag-and-Drop Scheduling | 7 | 0 | 1 | 0 | 8 | 0 | 0 |
| Scope Picker | 4 | 2 | 0 | 0 | 6 | 0 | 0 |
| Shift Start Times and Unassigned Shifts | 6 | 0 | 1 | 1 | 8 | 0 | 0 |
| Multi-Day Spread Scheduling | 10 | 1 | 0 | 0 | 10 | 1 | 0 |
| Linked Series and Banners | 3 | 0 | 1 | 0 | 4 | 0 | 0 |
| Shift Block Anatomy | 2 | 2 | 1 | 0 | 5 | 0 | 0 |
| Overlap and Lane Stacking | 4 | 1 | 0 | 0 | 5 | 0 | 0 |
| Day View Timeline | 3 | 2 | 2 | 0 | 7 | 0 | 0 |
| Shift Detail Modal | 8 | 0 | 0 | 0 | 8 | 0 | 0 |
| Events | 6 | 1 | 1 | 0 | 7 | 1 | 0 |
| Conflict Detection | 5 | 1 | 1 | 0 | 7 | 0 | 0 |
| Capacity Bars | 4 | 0 | 0 | 0 | 4 | 0 | 0 |
| Hover Tooltips | 3 | 0 | 2 | 0 | 5 | 0 | 0 |
| Grid Toolbar | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Filter and Display and View Options | 8 | 2 | 0 | 0 | 10 | 0 | 0 |
| Reassignment and Context Menu | 3 | 2 | 0 | 0 | 4 | 1 | 0 |
| Deletion, Series Scopes and Undo | 7 | 1 | 2 | 0 | 10 | 0 | 0 |
| Keyboard Interactions | 3 | 2 | 0 | 0 | 5 | 0 | 0 |
| Color System | 3 | 0 | 0 | 0 | 2 | 1 | 0 |
| Permissions | 12 | 0 | 0 | 0 | 10 | 2 | 0 |
| Edge Cases and Responsiveness | 4 | 0 | 3 | 1 | 8 | 0 | 0 |
| Working Hours Settings | 5 | 2 | 0 | 0 | 7 | 0 | 0 |
| Week Export and Printing | 1 | 1 | 0 | 0 | 2 | 0 | 0 |
| Cross-Module and Rewrite Regression | 5 | 0 | 0 | 0 | 5 | 0 | 0 |
| Schedule (API) | 4 | 0 | 0 | 0 | 4 | 0 | 0 |
| **Total (190)** | **146** | **23** | **19** | **2** | **184** | **6** | **0** |

## Dimension 2 — the full NONSENSE + FIX-WORDING lists

**NONSENSE: none found.** All 190 cases were cold-read in full (title + preconditions + steps +
expected + notes) against the 6 fail conditions; worked math was recomputed (the 40h/8h-day spread
ends day 5 ✓; 5 overlapping shifts → 3 lanes + '+2 more' ✓; tooltip 5 lines → 3 + '+2 more lines'
✓; 7→6→5 weekend columns ✓). Hedged hard-to-seed states (SCH-START-03's unset-business-hours,
SCH-CONF-07's pure-OT window) carry honest blocked-with-reason notes — the allowed pattern, not
sense failures. **KEEP-but-NONSENSE: EMPTY** (asserted by the generator).

**FIX-WORDING (6) — each directly actionable as an edit instruction:**

| Case | C-id / link | What exactly to fix |
|---|---|---|
| SCH-PERM-02 | C30074 — https://shopview.testrail.io/index.php?/cases/view/30074 | Expected 3 still names the OLD menu items — "no New Shift / New Event / View Day creation entry points" — the suite's own reconciled menu (SCH-REAS-03, DESIGN-RECONCILIATION #8-10) is 'Create Event' + 'New Work Order'. Reword the parenthetical. |
| SCH-PERM-04 | C30076 — https://shopview.testrail.io/index.php?/cases/view/30076 | Step 2: "create an event via right-click 'New Event'" — stale label; it is 'Create Event' (DESIGN-RECONCILIATION #7). |
| SCH-EVT-03 | C30018 — https://shopview.testrail.io/index.php?/cases/view/30018 | Precondition 2: "via right-click 'New Event'" — same stale label; align with SCH-EVT-01's 'Create Event'. |
| SCH-COLOR-02 | C30070 — https://shopview.testrail.io/index.php?/cases/view/30070 | Its note still asks whether recolouring one shift recolours all blocks of the same WO ("§4.4 ties color to the WO") — contradicted by the reconciled per-SHIFT rule (SV-8690, applied in SCH-BLOCK-04 2026-07-27). Drop the stale note; the G-SHIFT-COLOR merge folds the per-shift assertion in. |
| SCH-REAS-06 | C38855 — https://shopview.testrail.io/index.php?/cases/view/38855 | Expected 3 — "The exact target flow (toast or navigation) is confirmed during live testing" — is a to-be-confirmed placeholder inside Expected, not a pass criterion. Move it to the notes. |
| SCH-SPREAD-08 | C29984 — https://shopview.testrail.io/index.php?/cases/view/29984 | Expected 3 says skipped days show the reason "(weekend / closure)" — but the suite's own V1 rule (SCH-SPREAD-07/SCH-EDGE-05, SV-8691 Key Decision) is that closures are NOT skipped, so a 'closure' skip reason cannot occur in V1. Reword to weekend-only (or align when tech-plan conflict NQ-1 is answered). |

(C-ids above verified against `testrail-id-map.csv`.) Note the FIX-WORDING items cluster around
the two late spec reversals (menu redesign, per-shift colour) — exactly the residue a
reconciliation pass leaves; all six are one-line edits to bundle with the next authorized push.

## Dimension 1 — named slop patterns: what was hunted, what was found

The calendar/drag-drop-specific patterns from the kickoff + the 7 canonical patterns:

1. **Per-view-mode triplication (Day/Week/Month variants of one behaviour)** — HUNTED, largely
   NOT guilty: SCH-SER-01/02/03 render genuinely DIFFERENT series artifacts per view (wrapping
   month banner / chevrons + 'week N of M' / single time-block + cue) — kept (SER-03 WEAK).
   SCH-LANE-04 sweeps all three views in ONE case (correct packaging). SCH-BLOCK-03/SCH-DAY-07
   were the real instance — the same VIN-toggle behaviour re-authored per surface → merged into
   SCH-VIEW-04 (G-VIN-TOGGLE).
2. **Present-vs-behaviour splits** (the calendar cousin of tooltip present-vs-text) — FOUND, 7
   groups: display case + behaviour case for the same control authored separately
   (SPREAD-01/02 header, SCOPE-01/04 picker contents, SCOPE-05/06 checkbox mode, EVT-03/04
   modal fields, HRS-01/02 toggle+editor, HRS-06/07 validation, EXP-01/02 export) → merged.
3. **Removed-item negatives as standalone cases** — FOUND: SCH-REAS-04 ('View Day' gone) +
   SCH-REAS-05 ('New Shift' gone) are the SAME observation as SCH-REAS-03 (right-click, read
   the menu) → G-CELL-MENU.
4. **Near-duplicates across areas** — FOUND, 4: SCH-EDGE-01 ≡ SCH-SPREAD-10 (CUT);
   SCH-START-08 re-runs SCH-START-01..05 (CUT); SCH-BLOCK-04 ≡ COLOR-01+COLOR-02 (merged);
   SCH-LANE-05 ≡ SCH-LANE-01 (merged); SCH-DEL-07's toast sweep ≡ the per-action toast
   assertions (merged into SCH-DEL-09).
5. **Per-toggle show/hide filler** — FOUND, mild: SCH-VIEW-07/08 are pure show/hide flips on a
   popover another case already opens → merged into SCH-VIEW-05. (VIEW-06/09/10 kept — shading,
   data-match, and column restructuring are distinct observables.)
6. **Per-conflict-type explosion** — CHECKED, half-guilty: the four conflict types are genuinely
   distinct spec entities with different setups; only the before/after-hours mirror pair
   (CONF-03/04) collapses into one sitting → G-HOURS-CONFLICT. Double-booked and working-day
   conflicts stay.
7. **Permission cases reducing to one gate** — NOT guilty: the 12 permission cases map to
   genuinely different gates (View allow/block, Edit allow/block, Delete allow/block, tier
   dependency, WO:View dependency ×2, no-own-only, department rows, Time Clock setting) — and
   SCH-API-01 packs the whole BE matrix into ONE case instead of a per-endpoint explosion.
   **Credited, not cut.**
8. **Sort-direction/per-column explosions, export-pairs-duplicating-filter-matrices** — N/A /
   not present (the one export case pair was merged; there are no sortable columns here).

## The defence — load-bearing coverage credited (what answers the critic)

- **Calculation contracts:** the start-time hierarchy trio (START-01/02/03) + day-view drop
  positioning; the spread distribution rules (SPREAD-07 tech-hours sizing + weekend/closure
  rules, SPREAD-10 independent re-spread); capacity math (CAP-01 booked÷available clamped,
  CAP-03 per-tech OT independent of the aggregate, CAP-04 reconciling breakdown); the series
  caps (SPREAD-11 + API-02: 8-week confirm / 120-shift hard refusal / no partial series).
- **Permission gating:** all three tiers with BOTH allow and block sides + composition
  (PERM-01..07), the Work Orders:View dependency on sidebar AND shift-surfaced data
  (PERM-08, PERM-12), no-own-only (PERM-09), and the response-level backend proofs
  (API-01 enforcement matrix, API-03 no-pricing/absent-fields, API-04 location 404s).
- **Lifecycle/state integrity:** roster sync both ways (DND-07, REAS-01, START-07), undo
  restoring state incl. rosters (DEL-09), commit-immediately semantics with the
  false-bug-preventing tester note (DEL-10), series deletion scopes incl. the per-technician
  boundary (DEL-02/03/04), the rewrite migration + cross-module regression pack
  (REG-01..05), and DST wall-clock integrity (EDGE-07).
- **Link/navigation contracts:** mini-calendar → grid (MCAL-01), conflict-list → technician/day
  (CONF-06), Today/arrows/date-label (TOOL-01/02).
- **Data-exposure contracts:** no money anywhere in the schedule (MODAL-04 + API-03) — a real
  customer-facing leak class.
- **Anti-slop packaging already in the suite:** card/block/tooltip anatomies authored as ONE
  case each (WOL-02, BLOCK-01, TIP-01), the 3-view lane sweep in one case (LANE-04), the BE
  permission matrix in one case (API-01). The authoring already avoided most of the named
  patterns; this audit's merges trim the remaining 12%.

## Dimension 3 — genuine + layman confirmation

- **Genuine (Rule 20):** 190/190 cases carry `refs` = `<TICKET> (<spec-anchor>)` — per-story
  precision (SV-8686..SV-8700), epic SV-8685 only for genuinely cross-cutting cases (dark mode,
  Week Export pending an owner story, the API/regression tech-plan cases), tech-plan anchors
  named where the tech plan is the driver. **Missing-traceability: 0.** Every deviation-flag in
  the notes cites its driver (Branko Q&A date, DESIGN-RECONCILIATION #, tech-plan D#/NQ-#).
- **Layman-runnable (Rules 7/9):** tester-facing text is plain ("Drag that work order's card…",
  "Read the shift block's text lines"), numbered P/S/E throughout, no ticket IDs/§-numbers/enums
  in tester-facing fields; spec-unpinned labels are flagged "confirm live" rather than invented
  (correct for a spec-only suite). The 4 API cases sit in the API-titled section (Rule 4) and
  address a technically-equipped tester in plain words. Two repairable wording debts: the 6
  FIX-WORDING items above, and **98 titles > 80 chars** (pre-dating the 2026-07-27 concise-title
  rule; shorten when next touched — the merge push, if approved, is the natural moment for the
  ~30 of them it already edits).

## Is the critic right? (both halves, straight)

**The waste half ("70%+ useless"): NO — not on this suite.** 146/190 (77%) are straight KEEPs;
another 19 (10%) are honest WEAK-KEEPs (flagged low-value, not hidden); 23 (12%) are real
coverage that is merely over-granular packaging — merging them loses ZERO checks; and exactly
**2 cases (1.05%) are genuine waste** (both literal duplicates). Even counting every WEAK-KEEP
and every merged member against us, the worst honest reading is ~23% "trimmable", nowhere near
70% — and 190→165 is the recommended consolidation. The suite's core is demonstrably
load-bearing: calculation, permission, lifecycle, and data-exposure contracts named above.

**The makes-no-sense half: 0 of 190 are nonsense.** The full-suite cold read + recomputed math
found no case a competent manual tester could not execute or judge. It found **6 FIX-WORDING
items (3.2%)** — stale labels from two late spec reversals, one placeholder pass-criterion, one
cross-suite closure-reason contradiction — all one-line repairs, all listed with exact fixes.
Where the criticism has a POINT worth conceding: (a) the suite still carried ~12% packaging
granularity a reviewer could paint as padding — this plan removes it; (b) 98 long titles look
sloppy in TestRail even though the cases beneath them are sound; (c) 3 tech-plan-vs-story
conflicts (NQ-1 closures, NQ-3 settings placement, NQ-4 multi-range hours) are honestly flagged
in the cases but unresolved pending Branko — a hostile reader could call those "tests of
unconfirmed behaviour"; they are correctly quarantined as VIU-confirm/held items, not silently
asserted.

## Plain-words summary for management (forwardable as-is)

We put the entire Schedule test suite — every single one of its 190 test cases — through our
standing three-part quality audit before anyone runs it. First, is each test genuinely useful:
would it catch a real bug a customer would feel? Second, does it make sense: could a new,
non-technical tester read it cold and know exactly what to do and what "pass" looks like?
Third, is it genuine: can every test be traced back to the exact requirement and ticket it
comes from? The results: not one test failed the "makes sense" check; every test is traceable
to its source; and about nine in ten earn their place outright. The audit did find that roughly
one test in eight repeats a check another test already makes on the same screen, plus two
outright duplicates — so we are recommending consolidating the suite from 190 tests down to 165
with zero loss of coverage, and we found six small wording corrections (mostly button names
that changed late in the design) which we will fix in the same pass once approved. Nothing has
been changed yet — this is a recommendation awaiting sign-off.

## Reconciliation (adversarial self-audit, Rule 15)

- Counts reconcile on both dimensions (asserted in `gen_verdicts.py` every run):
  190 = 146 K + 23 M + 19 W + 2 C = 184 S + 6 FW + 0 N; recommended 165 = 190 − 23 − 2 =
  146 K (incl. 20 survivors) + 19 W.
- Independent re-derivation pass run before delivery: both CUTs re-verified as literal
  duplicates against the named survivors' expected lines; all 20 merge groups re-checked for
  lost assertions (each "what the survivor gains" line covers the member's unique checks); a
  whole-suite grep for the removed labels ('New Event' / 'New Shift' / 'View Day' / modal
  'Reassign') confirmed the FIX-WORDING list is complete and that the remaining mentions
  (SCH-MODAL-08, SCH-REAS-04/05) are intentional absence-assertions; held-item C-ids verified
  against the id-map. No drift found between the re-derivation and the CSV.
- Desk-audit honesty: these verdicts judge case TEXT vs the ingested sources; nothing here is
  live verification of behaviour (Rule 12) — the suite remains VIU-Pending end to end.

## What happens next (nothing without authorization)

1. User reviews `MERGE-PLAN.md` — approve wholesale, per-group, or reject.
2. If approved: TestRail `update_case` (20 survivors gain the folded checks + members' refs) +
   `delete_case` (23 members + 2 cuts; bodies kept locally marked Retired) with per-case audit
   log + re-GET verification; regenerate import + id-map; bundle the 6 FIX-WORDING one-liners
   and (optionally) title shortening for the touched cases in the same push.
3. The suite ships with this tally (Rule 28 step 10): **190 → 165 recommended · 184/6/0
   sense · 100% traceable · layman-runnable.**
