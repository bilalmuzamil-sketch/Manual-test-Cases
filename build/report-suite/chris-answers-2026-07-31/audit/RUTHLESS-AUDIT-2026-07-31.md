# Report Suite — Ruthless Usefulness Audit, 2026-07-31 pass (Standing Rule 28)

**Scope of this audit: the 77 cases this pass touched** — 70 edited + 7 newly authored — scored on
all THREE dimensions, 100% of them, no sampling. **Dimension 2 Stage 2b (the cross-case consistency
sweep) was run over the WHOLE suite of 472 active cases**, as the process requires, because a
contradiction can only be found suite-wide.

Suite after this pass: **472 active** (SBR 111 · SBC 83 · WIP 79 · IV 70 · PV 69 · TU 60).
Raw sweep output: `consistency-sweep-raw-2026-07-31.txt` · re-runnable: `consistency_sweep.py` ·
repairs applied: `repair-log-2026-07-31.md` (53).

---

## Headline tally

| Dimension | Result over the 77 in-scope cases |
|---|---|
| **1 — USEFUL** | **KEEP 77** · MERGE 0 · WEAK-KEEP 0 · **CUT 0** |
| **2a — MAKES SENSE (cold read)** | **SENSIBLE 77** · FIX-WORDING 0 remaining (**5 found and repaired in-pass**) · **NONSENSE 0** |
| **2b — CROSS-CASE CONSISTENCY** | **CONTRADICTION 0 remaining** (1 found and repaired: SBR-WO-01 title-vs-expected; 6 flagged pairs adjudicated as NOT contradictions, reasons below) |
| **3 — GENUINE + LAYMAN-RUNNABLE** | traceability **77/77** (**44 repaired** — ticket backfilled; 2 mis-cited tickets corrected) · plain-language **77/77** (**2 repaired** — spec anchors removed from tester-facing words) |
| **KEEP-but-NONSENSE (the embarrassment check)** | **empty** |

**Is the critic right about this pass?** No. **Waste = 0%** (nothing here is spec-parroting, no
near-duplicate was created — two suite-wide rulings that would naturally have spawned 2 extra
near-duplicate cases were folded into existing cases instead, see D3 below). **Makes-no-sense =
0%** after the 6 in-pass repairs. But the honest half: **the audit DID find 51 real defects in this
pass's own work before delivery** (44 missing tickets, 2 wrong tickets, 2 jargon leaks, 2 wording
doublings, 1 title contradiction) — that is the gate doing its job, not a clean first draft.

---

## Dimension 1 — USEFUL (77/77 KEEP)

Every case in scope earns KEEP because each asserts a **distinct observable behaviour whose failure
is a real reportable bug**:

- **The 7 new cases** cover behaviour with **zero prior coverage**: the suite-wide per-row Location
  column (auto-visibility, per-report "Multiple" rules, position, not-in-the-selector,
  constant-width filter) and the WIP export cap. One case per report, not per-requirement — a
  deliberate anti-explosion choice.
- **The 70 edits** are all **build-accuracy or expectation corrections** driven by a PO ruling or the
  ratified spec: a wrong toast string (2), a wrong permission model (3), a wrong label in 24
  places, two renamed columns (9), a renamed part type (16), an inverted logo expectation (1), a
  changed toolbar order (1), a new column selector (1), export shape/filenames (5), a column that
  is no longer user-toggleable (2), plus traceability and title repairs.

**Slop patterns hunted, and what was found:**

| Slop pattern | Verdict |
|---|---|
| Near-duplicates across areas | **Actively avoided.** Chris's Q1 ruling (filter hidden for a one-location user) applies to all six reports but only 4 had a case. Instead of authoring 2 near-duplicates, the assertion was folded into SBC-LOC-01 (C30109) and WIP-FLT-06 (C30503) — **2 cases NOT created.** |
| Per-column / sort-direction explosions | None created. The Location column is one case per report, not one per aspect (visibility + value + position + selector + filter width all in one). |
| Tooltip present-vs-text splits | None created. |
| Empty-state triplets | None created. |
| Permission cases reducing to one gate | The Q4 change **reduces** the SBC permission story to the same one gate the other five use — the opposite of proliferation. |
| Export pairs duplicating a whole filter matrix | None created; the WIP cap case is a single negative case, not a matrix. |

**Load-bearing coverage credited:** the per-report "Multiple" rules are genuine calculation/display
contracts that differ per report (SBC and SBR and TU and PV DO show "Multiple"; WIP and IV NEVER
can) — getting that wrong in the build is exactly the sort of bug a suite is for. The export cap
and the permission gate are both release-blocking behaviours.

## Dimension 2a — MAKES SENSE, per-case cold read (77/77 SENSIBLE after repair)

Each of the 77 was read cold against the 6 fail conditions. **No NONSENSE.** Five FIX-WORDING
defects were found and repaired in-pass (so none remain):

| Case | Fail | The defect (quoted) | Repair |
|---|---|---|---|
| PV-CALC-02 (C30360) | F6 / Rule 20 | precondition read *"A special-order (vendor-sourced, special-order) part"* — the mechanical rename doubled the phrase; and expected 2 carried the spec anchor *"(net of reversals, per S5-R4b)"* | phrase de-duplicated; anchor moved to the metadata |
| PV-ROW-02 (C30342) | F6 | precondition read *"The same special-order (special-order, vendor-sourced) part"* | de-duplicated |
| TU-VIS-01 (C30447) | Rule 20 | expected 3 carried *"(Technician column, per S4-R4)"* — a §-number in the words the tester reads | reworded to *"(in the Technician column)"* |
| SBR-ASGN-02 (C30293) | F5 | the renamed download file name would have been asserted as a certainty (`sales-representative-assignments.csv`) although no build has shipped it | hedged — *"confirm the exact final file name in the build"* (Rule 9: never invent a build string) |
| SBR-WO-01 (C30310) | F3 | see Stage 2b below | title realigned |

Honest note on the hedges that are NOT sense failures: the WIP cap case says *"If the environment
cannot reach 10,000 rows even fully widened, record the maximum reachable and mark the case
Blocked-Env with that reason"* — that is the honest pattern, not a defect.

## Dimension 2b — CROSS-CASE CONSISTENCY SWEEP (mandatory; run over all 472)

Method as specified: 14 control groups built across report boundaries, 12 opposite-assertion
keyword pairs diffed within each group, TITLE-vs-EXPECTED checked on **every one of the 472 cases**,
and same-anchor clustering over the `refs` anchors.

**1 real CONTRADICTION found — and it was in this pass's own work:**

| Case | The contradiction | Resolution |
|---|---|---|
| **SBR-WO-01 (C30310)** | The title trimmed in this pass read *"…hidden on imported"* while the case's own expected 3 and 4 say *"The selector is NOT present on the imported Work Order"* / *"…NOT present in History mode"* — and the trimmed title had silently **dropped the History-mode leg** the case actually tests. A title is what a reviewer reads first. | Title realigned to **"Sales Representative selector shows on WO and Part Sale, not on imported"**, matching its own expected results. This is exactly the class of miss (stale title vs live body) that the stage exists for. |

**6 flagged pairs adjudicated as NOT contradictions** (each checked, each reason recorded — a flag
is a candidate, not a verdict):

| Flagged pair | Why it is not a contradiction |
|---|---|
| **PV-EXP-05 (C30379) "no logo" vs TU-EXP-06 (C30439) "bundled ShopView logo"** | Different reports with different spec text. TU spec v5 now pins the bundled default; the **PV spec contains no logo requirement at all** (verified: zero matches for "logo" in the live PV page), so PV-EXP-05 correctly HEDGES the fallback as build-confirmed. **But this exposes a genuine SPEC inconsistency across the suite** — SBC S15-R17 has a three-step chain ending in *no logo*, TU says the bundled default *always*, PV is silent, while Chris's 2026-07-29 message promised "same logo treatment all reports". **Escalated to Chris; no case changed** (Rule 15: never silently pick a side). |
| IV-LOC-06 / WIP-FLT-09 titles *"never reads Multiple"* vs expected *"NO row ever shows \"Multiple\""* | Same assertion, different words. Consistent to a cold reader; kept. |
| SBR-TOT-01/02/03 + SBR-MOB-02 on anchors S10-N1 / S10-R5 | Pre-existing, outside this pass. Not a contradiction: TOT-02's *"hidden during loading and in the empty state"* and TOT-01/03's *"present/visible"* are conditioned on **different states** — both true of the same build. |
| "Location filter" group — SBC-LOC-04 / SBR-LOC-05 (no reload) vs PV-FILT-10 / WIP-FLT-06 (reloads) | Different behaviours: **selecting locations reloads the data**; the **Location column's visibility** follows scope without being a separate reload assertion. Both true. |
| "Type" group — many pairs | Artefact of a deliberately broad keyword group (`\bType\b` catches every case containing the word). Inspected; all pairs are different controls or different conditions. |
| "column-selection" group — SBC/SBR/WIP off-by-default vs on-by-default | Different reports' different default column sets. Both true. |

**TITLE-vs-EXPECTED over all 472:** 11 candidates, of which 1 was the real SBR-WO-01 defect (fixed),
2 were the IV/WIP wording variants above, and **8 are PRE-EXISTING cases outside this pass's scope**
— recorded here so they are not lost: IV-NAV-01 (C30534), PV-NAV-01 (C30322), SBC-API-01 (C30190),
SBR-EXP-13 (C30288), SBR-ROW-01 (C30217), TU-SUM-02 (C30415), WIP-EXP-04 (C30513), WIP-TAB-01
(C30451). Each was read: all are *"appears/shows"* in the title vs a synonym in the body — no
contradiction, no repair needed, **but they are the pattern to watch** on the next full-suite audit.

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE (77/77 after repair)

**Traceability (Rule 20) — this is where the pass was weakest, and it was fixed:**

- **44 of the 77 in-scope cases carried a spec anchor but NO Jira ticket** in `refs`
  (e.g. `specs/parts-velocity.md S5-R4`). Rule 20 requires **both**. All 44 were backfilled with
  the **exact per-story ticket**, transcribed from the SV-8582 epic ingest
  (`../../epic-sv8582/INGEST-SUMMARY.md`, e.g. *"Velocity - Story 5 - Metric Calculations" =
  SV-8645*) and keyed on the case's own first-cited story anchor — **derived, never guessed.**
- **2 tickets were wrong** and were corrected: SBC-PERM-01 (C30098) and SBC-PERM-02 (C30099) had
  been re-cited to **SV-8601**, but the epic map shows SBC **Story 1 = SV-8600** (SV-8601 is Story 2,
  Filter by date range).
- **One genuine traceability gap remains and cannot be closed by us:** the TU spec's **new Story 10
  (Column Selection and Persistence)** has **no Jira story ticket** — the TU story tickets stop at
  SV-8656 (Story 9). TU-COL-01 (C38859) and TU-LOC-06 (new) are cited to the nearest owning story
  and carry an explicit note to **ask for the Story-10 key** and re-cite. Flagged, not papered over.
- Every in-scope case now passes: ticket present, spec anchor present, `refs` ≤ 250 characters.

**Layman-runnable (Rules 7/9):**

- Tester-facing wording carries **no ticket keys, no §/S-numbers, no permission-atom names, no
  HTTP/enum jargon** — verified mechanically over all 77 (2 leaks found and fixed, above).
- Every case has numbered Preconditions / Steps / Expected in order; every title ≤ 80 characters
  (**41 titles trimmed in this pass** because the standing rule says a long title is fixed when the
  case is next touched).
- The two changes that will FAIL against today's build carry a **plain tester note** so a
  non-technical tester knows what to do: the Sales-Representative rename (11 cases) and the
  permission change (SBC-PERM-01) each say, in plain words, *mark it Failed and report it as the
  pending change — do not change the test.*

---

## Known limits of this audit (honesty, Rule 12)

1. **Nothing was live-verified.** The Report Suite QA branch is still unavailable to us, so every
   verdict here is a document-level judgement. All 77 cases remain **VIU-Pending**.
2. **Dimensions 1 and 2a were scored on the 77 in-scope cases, not all 472.** The last full-suite
   three-dimension audit is `../../quality-audit-2026-07-28/`. Stage 2b WAS run suite-wide.
3. **8 pre-existing title-vs-body candidates** (listed above) were adjudicated as non-contradictions
   but not otherwise touched, and **288 of the 472 active titles still exceed 80 characters** on
   cases this pass did not touch (41 were trimmed here because we touched them) — both are queued
   for the next full-suite pass. That 288 is a big pending number and worth its own authorized
   title-trim pass; it is the same PENDING item the Filters and Schedule projects carry.
4. Two suite-wide **duplicate titles** exist (the four identical *"The Location filter is hidden for
   a user with access to only one location"* titles across four reports, and a shared three-dot-menu
   title). They sit in **different report sections**, so they are not ambiguous in TestRail, and
   they are pre-existing — recorded, not changed.
