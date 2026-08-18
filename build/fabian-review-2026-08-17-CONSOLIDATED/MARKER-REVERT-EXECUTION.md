# Marker-Revert Execution — restoring the correct `AUTOMATION:` markers

**2026-08-18 · Schedule (group 4254) · Report Suite (group 4281) · Filters (group 4110)**
**Author: Bilal Muzamil (TestRail user id 3). TestRail `update_case` authorized for this revert;
no Jira, no run writes, app not opened.**

This pass reverts the wrongly-applied `AUTOMATION: Not available on Build to test Yet - Last checked
8/17/2026` marker back to each case's **prior (correct)** marker, per
`MARKER-MISAPPLICATION-AUDIT.md`. **Everything was RE-VERIFIED LIVE + from git baseline (Rule G / §2.11)
— the audit report was not trusted blindly.** The fix set was re-derived independently from the git
baselines (Schedule `6dbec93f`, Report Suite `94a4aab0`, Filters `80f773af`) vs the current committed
case source, then cross-checked against live TestRail and against the audit's C-id lists.

## Independent re-derivation vs the audit (Rule G)

- My git-derived fix set = the audit's 499 **plus** the 4 §5 local-only Schedule cases (SCH-HRS-02/03/04/05),
  which carry the deferred marker in the **local source only**. A live read confirmed those 4 (and the
  5th §5 case, SCH-REAS-08) carry **no marker live** (updated_by = 1, Vladimir Tomovic), so they are
  handled as §5 (local-source sync), not a live revert — exactly matching the audit.
- Reference-only vs content-changed classification, after normalising trailing-whitespace reformatting,
  reconciles to the audit **exactly**: 452 reference-only, 47 content-changed-overwritten.
  The one initial disagreement (C30050) was a trailing-newline-only reformat — genuinely reference-only,
  as the audit had it.
- All **67 non-READY prior markers** (with ticket refs — 22 EXPECT-FAIL + 45 HOLD) were taken from the
  git baseline and **match the audit's stated text with 0 mismatches**.
- **0 foreign cases** are in the fix set (all `created_by = 3`).

## What was reverted (live `update_case`)

**497 cases reverted**, each a marker-only swap (deferred marker → prior marker). Per project, by the
marker restored:

| Project | Reverted | → `AUTOMATION: READY` | → `READY - EXPECT FAIL (SV-…)` | → `HOLD - …` | of which Automated (atmstatus=3) |
|---|--:|--:|--:|--:|--:|
| Schedule (4254) | **143** | 109 | 1 | 33 | 0 |
| Report Suite (4281) | **303** | 281 | 18 | 4 | 25 |
| Filters (4110) | **51** | 40 | 3 | 8 | 2 |
| **TOTAL** | **497** | **430** | **22** | **45** | **27** |

- **27 Automated (`custom_atmstatus = 3`) cases reverted** — all **reference-only** (content byte-identical
  to baseline), all prior `AUTOMATION: READY`. This is a **metadata-only correction of our own erroneous
  marker** (testable content untouched), which the QA lead authorized 2026-08-18 (Common-Core §5.4 / Rule
  71 dated addition). Each was re-confirmed content-unchanged **live vs local** before reverting (27/27 OK),
  and `custom_atmstatus` was re-checked **live per case** at write time.

## Flagged and HELD — NOT reverted (2 cases)

The 2 Automated cases in the **content-changed** set were left untouched and flagged for the build-verify
pass (content-changed Automated is the sensitive case; Rule 71 build-verify coupling):

| C-id | Internal ID | Project | atmstatus | Prior marker (to restore later, coupled with build-verify) |
|---|---|---|--:|---|
| C30462 | WIP-PLACE-01 | Report Suite | 3 | `AUTOMATION: HOLD - the specification states two different tab-placement rules …` |
| C30518 | WIP-EXP-09 | Report Suite | 3 | `AUTOMATION: READY - EXPECT FAIL (SV-8907)` |

Both still carry the deferred marker live (confirmed post-pass), `updated_by = 3`, untouched by this pass.

## §5 local-only cases fixed (5 cases — LOCAL edit only, no live write)

These carry the marker in the committed local source only; live shows no marker (Vladimir Tomovic's
Automated version prevails). The local source was synced to match live (marker line removed):

| C-id | Internal ID | Action |
|---|---|---|
| C38847 | SCH-HRS-02 | local marker removed (live: no marker, updated_by 1) |
| C38848 | SCH-HRS-03 | local marker removed |
| C38849 | SCH-HRS-04 | local marker removed |
| C38850 | SCH-HRS-05 | local marker removed |
| C43811 | SCH-REAS-08 | local marker removed (NEW case, live is Vlad's) |

## Only the marker line changed — byte-verified (Rule 50 / §2.2)

Each live write sent all three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) with the
preconds/steps at their exact pre-write values and `custom_expected` = the live value with **only the
deferred-marker substring replaced** by the prior marker. `refs` was **not sent** (left untouched). After
every write, a re-GET byte-compared:

- `custom_expected` == the intended value (marker swapped, everything else identical) — **authoritative**;
- an HTML-agnostic re-assertion that reversing the swap recovers the exact pre-write `custom_expected`
  (**only the marker span moved** — proving the expected-behaviour BODY and the Rule-54 provenance line
  are byte-identical);
- `custom_preconds`, `custom_steps`, `title`, `refs`, `custom_atmstatus` all **byte-identical** to the
  pre-write snapshot;
- the deferred marker is gone and exactly one `AUTOMATION:` marker remains.

Verification is **by content, never by `updated_on`** (§2.5). Batches ≤ 15; per-operation oplog committed
per batch (work-loss safe). **Result: 497/497 verified PASS, 0 FAIL, 0 mismatches, 0 STOPs on data.**
One case (C30442) was found already-reverted on resume (a prior batch's write had landed but its oplog
append was cut off by a tool timeout); it was confirmed live (marker == prior, deferred gone) and recorded.

## Post-write live census (Rule G, re-pulled live after all writes)

- **497/497 reverted cases: deferred marker gone, exactly one marker, marker == prior. 0 anomalies.**
- The 2 held cases still carry the deferred marker (untouched).
- The 5 §5 cases: no marker live, `updated_by = 1` (untouched by us).
- **0 reverted case still carries the deferred marker; 0 unexpected case lost/kept it.**
- Residual deferred markers on our cases = **189** (54 NEW + 133 content-changed-with-prior-READY + 2 held)
  — all **correctly** deferred, none in scope for revert.

## Deliverables regenerated

- **Local case source** updated (marker swap for 497; marker removed for 5 §5) — the git diff touches
  **only the `expected` field**, and every changed line is a marker line (499 marker swaps as full
  `expected` lines) + 5 §5 marker removals. No body/provenance/title/refs text changed.
- **Imports regenerated** (schedule 195 · report-suite 507 · filters 124 rows): shredding guard **PASSED
  (0 shredded cells)**, import header **sha256 identical to peers**.
- **id-maps**: regenerated + C-ids/refs re-merged from the committed map (§3.6); **no drift**, and the
  result is **byte-identical to the committed id-map** (the revert changed no id-map field). 0 blanks,
  refs N/N (195/195, 507/507, 124/124).

## Census (ours / live / foreign — §1.3)

| Group | ours | live | foreign |
|---|--:|--:|--:|
| Schedule (4254) | 195 | 195 | 0 |
| Report Suite (4281) | 507 | 519 | 12 (Vladimir Tomovic, id 1) |
| Filters (4110) | 124 | 129 | 5 (Ahtasham Amjad, id 7) |

**No foreign case was touched** (byte-identical; none in the fix set).

## AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65 / §5.3)

**27 cases flagged Automated (`custom_atmstatus = 3`) had their automation MARKER reverted**
(`AUTOMATION: Not available on Build to test Yet …` → `AUTOMATION: READY`). This is a **marker-only
metadata correction — the testable content (title, preconditions, steps, expected-behaviour body) is
byte-identical and was not touched** — so it does **not** change what an automated check asserts; it only
restores the correct marker we had wrongly overwritten. C-ids (all Report Suite unless noted):

C30121 · C30123 · C30138 · C30217 · C30262 · C30314 · C30326 · C30328 · C30333 · C30338 · C30390 · C30399 ·
C30401 · C30404 · C30410 · C30429 · C30449 · C30452 · C30488 · C30510 · C30515 · C30527 · C30557 · C30569 ·
C30583 · **Filters** C29614 (FLT-PERS-02) · C38877 (FLT-STAT-07).

**Not changed (held for the build-verify pass):** C30462 (WIP-PLACE-01), C30518 (WIP-EXP-09) — both
Automated + content-changed; their markers were left as-is.

## Outstanding

- **2 held Automated content-changed cases** (C30462, C30518) — marker revert deferred to the coupled
  build-verify pass (Rule 71).
- Nothing else outstanding for this revert.
