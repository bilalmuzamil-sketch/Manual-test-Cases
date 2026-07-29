# Report Suite — INDEPENDENT post-push verification (2026-07-29 UTC, dated to the 2026-07-28 push)

**What this is:** an independent, adversarial re-derivation (Standing Rule 15) of the "Push ALL"
executed 2026-07-28 (commits 93723bf → 98debf5 → ba0c043; push window live-observed
**2026-07-29 04:07:56Z → 04:11:19Z**). Nothing was trusted from the executor's own log — every
number below was re-derived from live TestRail with **READ-ONLY** calls only (`get_sections`,
`get_cases`, `get_case`, `get_run`, `get_tests`). **ZERO TestRail writes, zero run writes.**

**Method:** full paginated pull of ALL suite-1 sections (619) + ALL suite-1 cases (4,071) into
`/tmp/rs-verify/`, section-tree walk to compute per-group populations, per-id `get_case` on all 57
deletes + C38856 + 12 spot cases, full `get_tests/359` pull, plus a **beyond-scope full-population
sweep**: live-vs-local content comparison of ALL 459 active cases (Rule 17), normalizing the
original import's `<ol><li>` HTML into the plain numbered-line format the push writes.

**VERDICT: ISSUES — 1 real gap (2 cases), everything the push itself claimed is confirmed clean.**
See "Findings" at the end.

---

## Check 1 — live count == 459 == id-map == import — **PASS**

| Source | Count |
|---|---|
| Live cases under group 4281 (96 sections: 1 group + 6 report folders + 89 leaves) | **459** |
| `build/report-suite/testrail-id-map.csv` active rows (0 blank C-ids) | **459** |
| `testrail-import/report-suite-v1-testrail-import.csv` data rows | **459** |

Stronger than counts: the live C-id **set** equals the id-map C-id set exactly (live-only = ∅,
idmap-only = ∅). Live range C30096–C30610 plus C38856. Import titles == id-map titles as sets.

## Check 2 — all 57 deleted C-ids gone (sample-free) — **PASS**

All 57 C-ids parsed from `testrail-push-manifest-2026-07-28.md` were individually re-GET:
**57/57 return HTTP 400 (gone)**; additionally 0 of the 57 appear anywhere in the full 4,071-case
active pull. Includes SBC-EXP-13 (C30171, the Print retire). Evidence:
`/tmp/rs-verify/deleted-57-check.json` (counter: `HTTP 400: 57`).

## Check 3 — SBC-EXP-16 = C38856 — **PASS**

- Exists live, HTTP 200; title "The download menu also offers a compressed (summary) version of
  the report" (74 chars ≤ 80).
- Section **4300 "SBC — Exports"** → parent **4282 "Sales By Customer Report"** → grandparent
  **4281** (correct placement).
- `custom_atmstatus: 3`, `custom_automation_type: 0` (both correct).
- Body vs local `SBC-EXP-16`: title / preconds / steps / expected / refs — **all 5 MATCH**
  byte-level (after the push's documented field mapping).

## Check 4 — 12-case spot verify live-vs-local — **FAIL on 1 of 12 (SBR-DEACT-04); 11/12 clean**

Note on the pick spec: no merge group absorbed 3+ *members* (max = 2 members; MERGE-PLAN.md, 41
groups / 50 members). "Absorbed 3+" was read as **3+ cases combined into one** (survivor + 2
members); four such 3-into-1 survivors were picked.

| Case | C-id | Category | Live `updated_on` | Result |
|---|---|---|---|---|
| SBC-TYPE-02 | C30107 | merge survivor (3-into-1) | 2026-07-29 04:08:59Z | **MATCH** |
| SBR-STAT-04 | C30211 | merge survivor (3-into-1) | 2026-07-29 04:09:16Z | **MATCH** |
| IV-TOT-01 | C30556 | merge survivor | 2026-07-29 04:08:06Z | **MATCH** |
| WIP-FLT-08 | C30505 | merge survivor (3-into-1) | 2026-07-29 04:09:37Z | **MATCH** |
| SBR-LOC-04 | C30216 | video edit — location-filter flip | 2026-07-29 04:09:10Z | **MATCH** |
| SBC-LBL-01 | C30134 | video edit + merge survivor — serial-number case | 2026-07-29 04:08:46Z | **MATCH** |
| TU-NAV-01 | C30392 | video edit | 2026-07-29 04:09:29Z | **MATCH** |
| WIP-SORT-03 | C30485 | video edit | 2026-07-29 04:09:43Z | **MATCH** |
| SBC-PERM-04 | C30101 | FIX-WORDING repair | 2026-07-29 04:08:52Z | **MATCH** |
| TU-SUM-02 | C30415 | FIX-WORDING repair | 2026-07-29 04:09:32Z | **MATCH** |
| SBR-DEACT-04 | C30255 | Chris Q1=B Esc edit | 2026-07-22 10:02:32Z | **MISMATCH** — see ISSUE-1 |
| SBC-PERM-01 | C30098 | untouched control | 2026-07-22 09:59:09Z | **UNCHANGED — PASS** (see note) |

- All 10 pushed picks match byte-level on title/preconds/steps/expected.
- **Control note:** the pre-push snapshot covers only the 127 touched cases, so the control was
  proven unchanged by (a) `updated_on` = 2026-07-22 09:59:09Z, far outside the push window, and
  (b) live content == local content. Its live body is still the original import's `<ol><li>` HTML
  (all untouched cases are; pushed cases are plain numbered text) — content identical, format is a
  pre-existing import artifact, not push-caused.
- **SBR-DEACT-04 (C30255):** live still says Escape DISMISSES the deactivate dialog; the local
  accepted body (Chris Q1=B: **Esc does NOT close**) was never pushed → ISSUE-1 below.

**Beyond-scope full sweep (all 459 live-vs-local, content-normalized): exactly 3 drifts —**
SBR-DEACT-04 (C30255, title+steps+expected), SBR-DEACT-05 (C30256, title+expected), TU-DAY-01
(C30418, expected). The other 456, including all 70 updates + the add, match. Details in Findings.

## Check 5 — nothing outside C30096–C30610 ∪ {C38856} deleted — **PASS**

Suite-1 live total = **4,071** cases (⇒ implied pre-push total 4,127 = 4,071 + 57 − 1). Per-group
live counts vs each project's own tracked state:

| Group | Live count | Expected (source) | Verdict |
|---|---|---|---|
| Reports Suite 4281 | 459 | 459 (this push) | ✅ |
| Schedule 4254 | 177 | 177 ACTIVE (schedule PROJECT-STATE / id-map 177) | ✅ exact |
| Filters 4110 | 79 | 79 in TestRail (43 new not yet pushed) | ✅ exact |
| Fees & Discounts 3894 | 203 | 203 (id-map: 199 active + 2 dev-authored + 2 concurrent-session) | ✅ exact |
| Custom Roles 3527 tree | 755 | no full-tree tally on record (tree includes legacy subtrees) | ✅ plausible — see below |

Stronger membership checks (every tracked C-id still live): Schedule 177/177 ✅, Filters 79/79 ✅,
F&D 203/203 ✅, Custom Roles local bodies 269/269 ✅ + CR-REG C38843/C38844/C38845 all live ✅.
Simple Flow id-map: 182/186 live — the 4 missing (C29277 SF-SET-03, C29282 SF-SET-08, C29295
SF-COMP-06, C29427 SF-QB-02) were **investigated, not waved through**: each carries the id-map
note "IGNORED per user 2026-07-22 — deleted from TestRail (Create-POs toggle Deviation)" — a
pre-existing user-ruled deletion from 2026-07-22, unrelated to this push. No surprise remains.

## Check 6 — R359 — **PASS**

- `get_run/359` "Reports Suite - Nebojsa/Viktoria (VIU Pending)": total = **458** (was 515 in the
  pre-push snapshot).
- Full `get_tests/359` pull: **458 tests, status distribution {3 (Untested): 458}** — zero
  Passed/Failed/Blocked/Retest, i.e. **zero results added** (pre-push was 515 all-Untested).
- Every one of the 458 tests maps to a still-active case under group 4281 (**0 orphans**).
- 458 = 459 − 1 is expected: C38856 was added after the run was created, so it has no test.

## Check 7 — regenerated import hygiene — **PASS** (2 benign notes)

- Header **byte-identical** to `testrail-import/schedule-v1-testrail-import.csv`
  (`Title,Section,Type,Priority,Preconditions,Steps,Expected Result,References,,` + CRLF). ✅
- **459 data rows**, uniform 10 columns, no C-id column. ✅
- **0 VIU words, 0 feature-flag words** in the whole file. ✅
- **0 duplicate titles within any section.** 3 titles are shared ACROSS different report folders
  (the same behaviour worded once per report: single-location Location-filter hiding ×4 reports,
  fixed column order ×2, three-dot Download menu ×2) — inherent to a six-report suite where each
  report is its own section tree; not a defect.

---

## Findings

**ISSUE-1 (real, needs a follow-up authorized push): the Chris Q1=B "Esc" edits were applied
locally but never pushed — live TestRail still contradicts Chris's accepted answer.**
- **SBR-DEACT-04 = C30255** (https://shopview.testrail.io/index.php?/cases/view/30255): live title
  "Cancel, X and Escape dismiss the dialog…" / live expected "…it dismisses on Cancel, X, or
  Escape" — the OLD spec S13-R8 behaviour. Local accepted body (change-list row APPLIED-NOW/DONE,
  per Chris's answer Q1=B): "Pressing the 'Esc' key does NOT close the dialog…".
- **SBR-DEACT-05 = C30256** (https://shopview.testrail.io/index.php?/cases/view/30256): same story
  (consistency fix + title shorten), local-only.
- Root cause: these two were edited locally in the Phase-2 reconciliation commit (16485ca, "no
  TestRail writes") but were **not in any of the push manifest's three buckets** (video edits /
  sense-check repairs / merge survivors), so the 70-update list never included them. Both live
  `updated_on` = 2026-07-22 (pre-push, untouched). The executor faithfully pushed its manifest —
  the manifest's scope omitted these 2.
- **What needs to be done (plain):** run a small follow-up push (needs fresh Rule-6 user
  authorization) with 2 `update_case` calls — C30255 and C30256 — using the final local bodies, so
  TestRail matches what Chris decided (the Esc key must NOT close the deactivate pop-up).

**OBSERVATION-1 (pre-existing import artifact, not push-caused): TU-DAY-01 = C30418**
(https://shopview.testrail.io/index.php?/cases/view/30418): the live expected reads
`"Expand 's daily breakdown"` — the `<technician>` placeholder in the local text was swallowed as
an HTML tag by the original 2026-07-22 CSV import (live `updated_on` 2026-07-22; case untouched by
this push). Plain fix: include C30418 in the next authorized update pass (and avoid angle-bracket
placeholders in future import text — write `[technician]`).

**OBSERVATION-2 (minor, rule-of-2026-07-27):** 2 of the 70 touched cases carry live titles > 80
chars — PV-API-02 = C30389 (100 chars), PV-FILT-09 = C30336 (96 chars). Per the concise-title rule
these should be shortened when next touched.

**Formatting note (no action):** untouched cases keep the original import's `<ol><li>` HTML body
format; the 71 pushed cases are plain numbered text. Content-equivalent; TestRail renders both.

## Verdict

**ISSUES** — the push itself executed exactly as claimed (all 7 checks confirm the executor's log
independently: counts, deletes, add, updates, run integrity, collateral safety, import hygiene),
**but** the "Push ALL" bundle's manifest omitted the 2 Chris-answer cases (SBR-DEACT-04 C30255,
SBR-DEACT-05 C30256), which remain live in the pre-answer wording; plus 1 pre-existing import
artifact (TU-DAY-01 C30418) surfaced by the full sweep. No collateral damage anywhere in the suite;
no run writes; no results added.

| # | Check | Result |
|---|---|---|
| 1 | 459 live == id-map == import | **PASS** |
| 2 | 57 deletes gone (all 57 checked) | **PASS** |
| 3 | C38856 correct + matches local | **PASS** |
| 4 | 12-case spot verify | **FAIL (1/12: SBR-DEACT-04 local-only edit; 11/12 clean; control unchanged)** |
| 5 | No collateral deletion outside scope | **PASS** |
| 6 | R359 = 458, all Untested, 0 orphans, 0 results | **PASS** |
| 7 | Import hygiene | **PASS** |

*Verifier evidence: `/tmp/rs-verify/` (sections.json, cases.json, deleted-57-check.json,
C38856-live.json, spot-C*.json, spot-check.json, full-sweep-drift.json, run-R359-post.json,
r359-tests.json) — ephemeral; the durable facts are all cited above.*
